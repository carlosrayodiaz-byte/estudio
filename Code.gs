/**
 * Semestre · Apps Script
 * Guarda el progreso (entregas, temas, tarjetas, ejercicios, ajustes) en esta Sheet
 * y sirve el material de estudio desde la carpeta de Drive «Semestre estudio».
 *
 * 1. Ejecuta setup() una vez y copia el TOKEN del registro.
 * 2. Implementar → Nueva implementación → Aplicación web
 *    (Ejecutar como: Yo · Quién tiene acceso: Cualquier usuario).
 * 3. Si cambias este archivo: Implementar → Gestionar implementaciones → editar → Nueva versión.
 */

const TABLAS = {
  Entregas:   ['semestre', 'clave', 'estado', 'nota', 'letra', 'peso', 'fecha', 'actualizado'],
  Temas:      ['semestre', 'clave', 'estado', 'duda', 'prioridad', 'apunte', 'ultimo', 'actualizado'],
  Propios:    ['semestre', 'clave', 'asignatura', 'modulo', 'titulo', 'borrado', 'actualizado'],
  Tarjetas:   ['semestre', 'clave', 's', 'd', 'reps', 'lapses', 'last', 'due', 'primera', 'actualizado'],
  Ejercicios: ['semestre', 'clave', 'ok', 'fallos', 'ultimo', 'actualizado'],
  Ajustes:    ['semestre', 'clave', 'valor', 'actualizado']
};
const CARPETA = 'Semestre estudio';

function setup() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(TABLAS).forEach(function (n) {
    const cols = TABLAS[n];
    const sh = ss.getSheetByName(n) || ss.insertSheet(n);
    sh.getRange(1, 1, sh.getMaxRows(), cols.length).setNumberFormat('@');
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold');
    sh.setFrozenRows(1);
  });
  ['Hoja 1', 'Full 1', 'Sheet1'].forEach(function (n) {
    const sh = ss.getSheetByName(n);
    if (sh && sh.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(sh);
  });
  const props = PropertiesService.getScriptProperties();
  let token = props.getProperty('TOKEN');
  if (!token) {
    token = Utilities.getUuid().replace(/-/g, '');
    props.setProperty('TOKEN', token);
  }
  const it = DriveApp.getFoldersByName(CARPETA);
  const carpeta = it.hasNext() ? it.next() : DriveApp.createFolder(CARPETA);
  Logger.log('TOKEN: ' + token);
  Logger.log('Carpeta del material: ' + carpeta.getUrl());
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (!tokenOk_(p.token)) return salida_({ ok: false, error: 'token' });
  try {
    if (p.accion === 'ping') return salida_({ ok: true });
    if (p.accion === 'estudio') return salida_({ ok: true, modulos: estudio_(p.semestre) });
    return salida_({ ok: true, datos: leerTodo_(p.semestre) });
  } catch (err) {
    return salida_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return salida_({ ok: false, error: 'json' }); }
  if (!tokenOk_(body.token)) return salida_({ ok: false, error: 'token' });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    guardar_(body.ops || []);
  } catch (err) {
    return salida_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
  return salida_({ ok: true, n: (body.ops || []).length });
}

/* Inserta o actualiza por (semestre, clave). Reintentar la misma operación no duplica filas. */
function guardar_(ops) {
  const ss = SpreadsheetApp.getActive();
  const porTabla = {};
  ops.forEach(function (o) {
    if (TABLAS[o.tabla] && o.semestre && o.clave) (porTabla[o.tabla] = porTabla[o.tabla] || []).push(o);
  });
  Object.keys(porTabla).forEach(function (t) {
    const cols = TABLAS[t];
    const sh = ss.getSheetByName(t);
    const last = sh.getLastRow();
    const filas = last > 1 ? sh.getRange(2, 1, last - 1, cols.length).getValues() : [];
    const idx = {};
    filas.forEach(function (r, i) { idx[r[0] + '|' + r[1]] = i; });
    const iAct = cols.indexOf('actualizado');
    const ahora = new Date().toISOString();
    porTabla[t].forEach(function (o) {
      const k = o.semestre + '|' + o.clave;
      let i = idx[k];
      if (i === undefined) {
        i = filas.length;
        idx[k] = i;
        filas.push(cols.map(function () { return ''; }));
        filas[i][0] = o.semestre;
        filas[i][1] = o.clave;
      }
      cols.forEach(function (c, j) {
        if (j > 1 && o.datos && Object.prototype.hasOwnProperty.call(o.datos, c)) {
          const v = o.datos[c];
          filas[i][j] = v === null || v === undefined ? '' : String(v);
        }
      });
      filas[i][iAct] = ahora;
    });
    if (filas.length) {
      const rg = sh.getRange(2, 1, filas.length, cols.length);
      rg.setNumberFormat('@');
      rg.setValues(filas.map(function (r) { return r.map(String); }));
    }
  });
}

function leerTodo_(semestre) {
  const ss = SpreadsheetApp.getActive();
  const res = {};
  Object.keys(TABLAS).forEach(function (t) {
    const cols = TABLAS[t];
    const sh = ss.getSheetByName(t);
    const last = sh ? sh.getLastRow() : 0;
    res[t] = [];
    if (last < 2) return;
    sh.getRange(2, 1, last - 1, cols.length).getValues().forEach(function (r) {
      if (semestre && String(r[0]) !== String(semestre)) return;
      const o = {};
      cols.forEach(function (c, j) { o[c] = String(r[j]); });
      res[t].push(o);
    });
  });
  return res;
}

/* Lee los JSON de material (uno por módulo) de la carpeta «Semestre estudio». */
function estudio_(semestre) {
  const it = DriveApp.getFoldersByName(CARPETA);
  if (!it.hasNext()) return [];
  const files = it.next().getFiles();
  const out = [];
  while (files.hasNext()) {
    const f = files.next();
    if (!/\.json$/i.test(f.getName())) continue;
    try {
      const m = JSON.parse(f.getBlob().getDataAsString('UTF-8'));
      if (semestre && m.semestre && String(m.semestre) !== String(semestre)) continue;
      m._archivo = f.getName();
      m._actualizado = f.getLastUpdated().toISOString();
      out.push(m);
    } catch (err) {
      out.push({ _archivo: f.getName(), _error: 'JSON no válido' });
    }
  }
  return out;
}

function tokenOk_(t) {
  const real = PropertiesService.getScriptProperties().getProperty('TOKEN');
  return !!t && !!real && t === real;
}

function salida_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
