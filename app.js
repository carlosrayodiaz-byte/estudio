'use strict';
const APP_VERSION = '1.0';

/* ───────── Utilidades ───────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nf = (n, d = 1) => (n == null || isNaN(n)) ? '–' : (+n).toFixed(d).replace('.', ',');
const LS = {
  get(k, def) { try { const v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { toast('Sin espacio para guardar en el iPhone'); } }
};
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const esSi = v => v === true || v === 1 || v === '1' || v === 'true';

const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESL = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const D = s => { if (!s) return null; const [y, m, d] = String(s).slice(0, 10).split('-').map(Number); return (y && m && d) ? new Date(y, m - 1, d) : null; };
const hoy0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const dias = (a, b) => Math.round((a - b) / 864e5);
const fCorta = d => `${d.getDate()} ${MES[d.getMonth()]}`;
const fDia = d => `${DS[d.getDay()]} ${d.getDate()} ${MES[d.getMonth()]}`;
const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const same = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;

const I = {
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  list: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  cal: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  set: '<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  warn: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  pen: '<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>',
  minus: '<path d="M5 12h14"/>'
};
const ic = (n, s = 20, cls = '') => `<svg class="${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;
const ESTADOS = ['Por estudiar', 'Repasar', 'Dominado'];

function mates(el) {
  if (!window.renderMathInElement) return;
  try {
    renderMathInElement(el, {
      delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
      throwOnError: false, strict: 'ignore', ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'input']
    });
  } catch (e) { /* una fórmula mal escrita no debe romper la pantalla */ }
  /* Si una fórmula no cabe en el ancho del iPhone, se reduce hasta un 70 % antes de recurrir al scroll lateral */
  $$('.katex-display', el).forEach(d => {
    const k = d.firstElementChild; if (!k) return;
    d.style.fontSize = '';
    const disp = d.clientWidth - 24, w = k.scrollWidth;
    if (disp > 0 && w > disp) d.style.fontSize = Math.max(0.7, disp / w).toFixed(3) + 'em';
  });
}
let tToast;
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(tToast); tToast = setTimeout(() => el.classList.remove('on'), 2200); }

/* ───────── Estado y almacenamiento ───────── */
const S = {
  sem: null, cfg: Object.assign({ url: '', token: '', nuevas: 20 }, LS.get('sem:cfg', {})),
  data: null, estudio: {}, cola: [], tab: 'inicio', fAsig: 'all', fTag: null, cm: null, sel: null,
  sync: { st: '', t: null, err: '' }, capas: []
};
const UI = { temaTab: {}, pasos: {}, abiertas: {}, puntos: {}, comp: {} };
const esDemo = () => !(S.cfg.url && S.cfg.token);
const semId = () => S.sem.semestre.id;
const modo = () => esDemo() ? 'demo' : 'real';
const kData = () => `sem:${modo()}:datos:${semId()}`;
const kEst = () => `sem:${modo()}:estudio:${semId()}`;
const kCola = () => `sem:cola:${semId()}`;
const vacio = () => ({ entregas: {}, temas: {}, propios: {}, cards: {}, ejercicios: {}, ajustes: {} });
const TABLAS = { Entregas: 'entregas', Temas: 'temas', Propios: 'propios', Tarjetas: 'cards', Ejercicios: 'ejercicios', Ajustes: 'ajustes' };

function cargarLocal() {
  S.data = LS.get(kData(), null) || (esDemo() ? DEMO.datos() : vacio());
  for (const k of Object.keys(vacio())) S.data[k] = S.data[k] || {};
  S.estudio = LS.get(kEst(), null) || (esDemo() ? DEMO.estudio : {});
  S.cola = esDemo() ? [] : LS.get(kCola(), []);
  invalidar();
}
const persistir = () => LS.set(kData(), S.data);

function guardar(tabla, clave, datos) {
  const k = TABLAS[tabla];
  S.data[k][clave] = Object.assign({}, S.data[k][clave], datos);
  persistir(); invalidar();
  if (esDemo()) return;
  S.cola.push({ id: uid(), tabla, semestre: semId(), clave, datos: Object.assign({}, datos) });
  LS.set(kCola(), S.cola);
  programarSync();
}

/* ───────── Sincronización con la Sheet ───────── */
let tSync, syncando = false;
const programarSync = (ms = 1500) => { clearTimeout(tSync); tSync = setTimeout(() => sync(false), ms); };
async function api(params, body) {
  if (body) {
    const r = await fetch(S.cfg.url, { method: 'POST', body: JSON.stringify(Object.assign({ token: S.cfg.token }, body)) });
    return r.json();
  }
  const u = new URL(S.cfg.url);
  Object.entries(Object.assign({ token: S.cfg.token, semestre: semId() }, params)).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u.toString());
  return r.json();
}
async function sync(completo) {
  if (esDemo() || syncando) return;
  if (!navigator.onLine) { S.sync.st = 'off'; pintarSync(); return; }
  syncando = true; S.sync.st = 'run'; pintarSync();
  try {
    while (S.cola.length) {
      const ops = S.cola.slice(0, 300);
      const r = await api(null, { ops });
      if (!r.ok) throw new Error(r.error || 'error');
      const ids = new Set(ops.map(o => o.id));
      S.cola = S.cola.filter(o => !ids.has(o.id));
      LS.set(kCola(), S.cola);
    }
    if (completo) {
      const [r1, r2] = await Promise.all([api({ accion: 'todo' }), api({ accion: 'estudio' })]);
      if (!r1.ok) throw new Error(r1.error || 'error');
      S.data = desdeServidor(r1.datos);
      for (const o of S.cola) { const k = TABLAS[o.tabla]; S.data[k][o.clave] = Object.assign({}, S.data[k][o.clave], o.datos); }
      persistir();
      if (r2.ok) {
        S.estudio = {};
        (r2.modulos || []).forEach(m => { if (m && m.modulo && !m._error) S.estudio[m.modulo] = m; });
        S.sync.malos = (r2.modulos || []).filter(m => m._error).map(m => m._archivo);
        LS.set(kEst(), S.estudio);
      }
      invalidar(); render();
    }
    S.sync.st = 'ok'; S.sync.t = Date.now(); S.sync.err = '';
  } catch (e) {
    S.sync.st = 'err';
    S.sync.err = e.message === 'token' ? 'El token no coincide con el de la Sheet' : 'No se ha podido conectar con la Sheet (' + e.message + ')';
  }
  syncando = false; pintarSync();
}
function desdeServidor(d) {
  const out = vacio();
  for (const [t, k] of Object.entries(TABLAS)) (d[t] || []).forEach(r => {
    const o = Object.assign({}, r); delete o.semestre; delete o.clave; delete o.actualizado; out[k][r.clave] = o;
  });
  return out;
}
function pintarSync() {
  const cls = { ok: 'ok', err: 'err', run: 'run' }[S.sync.st] || '';
  $$('.syncdot').forEach(el => { el.className = 'syncdot ' + cls; });
  const aj = S.capas.find(c => c.dataset.tipo === 'ajustes');
  if (aj && !enFoco()) pintarCapa(aj);
}

/* ───────── Modelo derivado ───────── */
let M = null;
const invalidar = () => { M = null; };
function estadoTema(id) {
  const t = S.data.temas[id] || {};
  return { e: +t.estado || 0, duda: esSi(t.duda), prio: esSi(t.prioridad), apunte: t.apunte || '', ultimo: t.ultimo || '' };
}
function modelo() {
  if (M) return M;
  const sem = S.sem;
  const asig = {}; sem.asignaturas.forEach(a => { asig[a.id] = a; });
  const cal = sem.calendario.map(c => {
    const e = S.data.entregas[c.id] || {};
    return Object.assign({}, c, { a: D(c.apertura), c: D(c.cierre) || D(e.fecha) });
  });
  const contTema = {}, cards = [];
  Object.values(S.estudio).forEach(m => (m.temas || []).forEach(t => {
    contTema[t.id] = Object.assign({ modulo: m.modulo, asignatura: m.asignatura }, t);
    (t.tarjetas || []).forEach(c => cards.push(Object.assign({ tema: t.id, asig: m.asignatura }, c)));
  }));
  const temas = [], mods = [];
  sem.asignaturas.forEach(a => {
    const tm = ((sem.temario || []).find(x => x.asignatura === a.id) || { modulos: [] }).modulos.slice();
    Object.values(S.estudio).filter(m => m.asignatura === a.id && !tm.some(x => x.id === m.modulo))
      .forEach(m => tm.push({ id: m.modulo, numero: 99, titulo: m.titulo, temas: [] }));
    tm.forEach(mo => {
      const est = S.estudio[mo.id];
      const titulo = mo.titulo || (est && est.titulo) || `Mòdul ${mo.numero}`;
      const lista = (mo.temas || []).map(t => ({ id: t.id, titulo: t.titulo }));
      ((est && est.temas) || []).forEach(t => {
        const x = lista.find(y => y.id === t.id);
        if (!x) lista.push({ id: t.id, titulo: t.titulo }); else if (!x.titulo) x.titulo = t.titulo;
      });
      Object.entries(S.data.propios).forEach(([id, p]) => { if (p.modulo === mo.id && !esSi(p.borrado)) lista.push({ id, titulo: p.titulo, propio: true }); });
      if (!lista.length) lista.push({ id: mo.id, titulo, bloque: true });
      const ts = lista.map(t => Object.assign(t, { asig: a.id, mod: mo.id, modTitulo: titulo, cont: contTema[t.id] || null }, estadoTema(t.id)));
      mods.push({ id: mo.id, asig: a.id, numero: mo.numero, titulo, temas: ts });
      temas.push(...ts);
    });
  });
  const temaById = {}; temas.forEach(t => { temaById[t.id] = t; });
  M = { asig, cal, temas, mods, cards, contTema, temaById };
  return M;
}
const asigDe = id => S.sem.asignaturas.find(a => a.id === id);
const abrev = id => (asigDe(id) || {}).abreviatura || id;
const corto = c => String(c.nombre || '').split(' · ')[0];
function proxima(aid) {
  const h = hoy0();
  return modelo().cal.filter(c => c.asignatura === aid && c.c && c.c >= h).sort((x, y) => x.c - y.c)[0] || null;
}
const diasProx = aid => { const p = proxima(aid); return p ? dias(p.c, hoy0()) : 999; };

/* ───────── Notas y cálculo de lo que necesitas ───────── */
const LETRA_MIN = { A: 9, B: 7, 'C+': 5, 'C-': 3, D: 0 };
const aLetra = n => n >= 9 ? 'A' : n >= 7 ? 'B' : n >= 5 ? 'C+' : n >= 3 ? 'C-' : 'D';
const numero = v => { if (v === undefined || v === null || v === '') return null; const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n; };
function notaDe(id) {
  const e = S.data.entregas[id] || {};
  if (e.estado === 'no_entregada') return { tipo: 'no', n: 0 };
  const n = numero(e.nota);
  if (n != null) return { tipo: 'nota', n };
  if (e.letra && e.letra in LETRA_MIN) return { tipo: 'nota', n: LETRA_MIN[e.letra], letra: e.letra };
  return { tipo: 'pend', entregada: e.estado === 'entregada' };
}
function calculo(a) {
  if (a.calculo) return a.calculo;
  return { tipo: 'ponderada', items: S.sem.calendario.filter(c => c.asignatura === a.id).map(c => c.id), min_entregadas: 0, aprobado: 5 };
}
function pesos(ids) {
  const raw = ids.map(id => {
    const p = numero((S.data.entregas[id] || {}).peso);
    if (p != null) return p;
    const c = S.sem.calendario.find(x => x.id === id);
    return c && c.peso_final != null ? +c.peso_final : null;
  });
  const conocido = raw.filter(x => x != null).reduce((s, x) => s + x, 0);
  const nulos = raw.filter(x => x == null).length;
  const resto = Math.max(0, 1 - conocido);
  return raw.map(x => x != null ? x : (nulos ? resto / nulos : 0));
}
function evaluar(a, fill) {
  const c = calculo(a);
  const v = id => {
    const n = notaDe(id);
    if (n.tipo === 'no') return { ent: false, n: 0 };
    if (n.tipo === 'nota') return { ent: true, n: n.n };
    if (fill && id in fill) return { ent: true, n: fill[id] };
    return { ent: null, n: null };
  };
  const ck = []; let final = null, ok = null;
  const items = c.items.map(v);
  const pend = items.filter(x => x.ent === null).length;
  const ent = items.filter(x => x.ent === true).length;
  const posibles = items.filter(x => x.ent !== false).length;
  const st = (cumple, posible) => cumple ? 'ok' : (posible ? 'pend' : 'mal');

  if (c.tipo === 'ac_pf') {
    const val = items.filter(x => x.ent && x.n >= c.min_item);
    ck.push({ t: `PACs con ${c.min_item} o más (mínimo ${c.min_entregadas})`, st: st(val.length >= c.min_entregadas, val.length + pend >= c.min_entregadas), v: `${val.length} de ${c.min_entregadas}` });
    const ac = pend ? null : val.reduce((s, x) => s + x.n, 0) / c.items.length;
    ck.push({ t: 'Media de la AC de C+ o más', st: ac == null ? 'pend' : ac >= c.min_media_ac ? 'ok' : 'mal', v: ac == null ? '' : nf(ac) });
    const pf = v(c.pf);
    ck.push({ t: `Prova final de ${c.min_pf} o más`, st: pf.ent === null ? 'pend' : pf.n >= c.min_pf ? 'ok' : 'mal', v: pf.ent === null ? '' : nf(pf.n) });
    if (ac != null && pf.ent !== null) {
      final = c.peso_ac * ac + c.peso_pf * pf.n;
      ok = val.length >= c.min_entregadas && ac >= c.min_media_ac && pf.n >= c.min_pf && final >= c.aprobado;
    }
  } else if (c.tipo === 'mejores') {
    const val = items.filter(x => x.ent && x.n >= c.min_item);
    ck.push({ t: `Retos con ${a.tipo_nota === "letra" ? aLetra(c.min_item) : nf(c.min_item, 0)} o más (mínimo ${c.min_entregadas})`, st: st(val.length >= c.min_entregadas, val.length + pend >= c.min_entregadas), v: `${val.length} de ${c.min_entregadas}` });
    const ac = pend ? null : val.map(x => x.n).sort((x, y) => y - x).slice(0, c.mejores).reduce((s, x) => s + x, 0) / c.mejores;
    ck.push({ t: `Media de los ${c.mejores} mejores de 5 o más`, st: ac == null ? 'pend' : ac >= c.min_media_ac ? 'ok' : 'mal', v: ac == null ? '' : nf(ac) });
    const g = v(c.global);
    ck.push({ t: `PAC Global de ${c.min_global} o más`, st: g.ent === null ? 'pend' : g.n >= c.min_global ? 'ok' : 'mal', v: g.ent === null ? '' : nf(g.n) });
    if (ac != null && g.ent !== null) {
      final = c.peso_items * ac + c.peso_global * g.n;
      ok = val.length >= c.min_entregadas && ac >= c.min_media_ac && g.n >= c.min_global && final >= c.aprobado;
    }
  } else if (c.tipo === 'recuperacion') {
    const w = pesos(c.items);
    ck.push({ t: `Entregar ${c.min_entregadas} de ${c.items.length} (las ${c.items.length} para aprobar sin el Repte Global)`, st: st(ent >= c.min_entregadas, ent + pend >= c.min_entregadas), v: `${ent} de ${c.items.length}` });
    const media = pend ? null : items.reduce((s, x, i) => s + w[i] * x.n, 0);
    ck.push({ t: 'Media de los retos de 5 o más', st: media == null ? 'pend' : media >= c.aprobado ? 'ok' : 'mal', v: media == null ? '' : nf(media) });
    if (media != null) {
      if (ent === c.items.length && media >= c.aprobado) { final = media; ok = true; }
      else if (ent < c.min_entregadas) { final = media; ok = false; }
      else {
        const rg = v(c.recuperacion);
        if (rg.ent === null) ck.push({ t: 'Repte Global aprobado (da un C+)', st: 'pend', v: '' });
        else { ok = rg.n >= 5; final = ok ? c.nota_recuperacion : media; ck.push({ t: 'Repte Global aprobado (da un C+)', st: ok ? 'ok' : 'mal', v: nf(rg.n) }); }
      }
    }
  } else {
    const w = pesos(c.items);
    if (c.min_entregadas) ck.push({ t: `Entregar ${c.min_entregadas} de ${c.items.length}`, st: st(ent >= c.min_entregadas, ent + pend >= c.min_entregadas), v: `${ent} de ${c.min_entregadas}` });
    if (!pend) { final = items.reduce((s, x, i) => s + w[i] * x.n, 0); ok = ent >= (c.min_entregadas || 0) && final >= c.aprobado; }
  }
  ck.push({ t: `Nota final de ${c.aprobado} o más`, st: final == null || ok == null ? 'pend' : ok ? 'ok' : 'mal', v: final == null ? '' : nf(final) });
  const margen = c.min_entregadas ? posibles - c.min_entregadas : null;
  return { final, ok, ck, margen, c };
}
function pendientes(a) {
  const c = calculo(a);
  return [...c.items, c.pf, c.global].filter(Boolean).filter(id => notaDe(id).tipo === 'pend');
}
function necesito(a) {
  const ids = pendientes(a), actual = evaluar(a), c = calculo(a);
  if (!ids.length) {
    if (actual.ok === null && c.recuperacion) return { estado: 'rg', ids, ev: actual };
    return { estado: actual.ok ? 'aprobada' : actual.ok === false ? 'suspendida' : 'pendiente', ids, ev: actual };
  }
  const f = x => { const fill = {}; ids.forEach(id => { fill[id] = x; }); return evaluar(a, fill).ok === true; };
  if (!f(10)) return { estado: 'imposible', ids, ev: actual };
  if (f(0)) return { estado: 'asegurada', ids, ev: actual };
  let lo = 0, hi = 10;
  for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; if (f(m)) hi = m; else lo = m; }
  return { estado: 'necesita', x: Math.ceil(hi * 10 - 1e-3) / 10, ids, ev: actual };
}
function llevas(a) {
  const ns = calculo(a).items.map(notaDe).filter(n => n.tipo === 'nota');
  if (!ns.length) return null;
  return ns.reduce((s, n) => s + n.n, 0) / ns.length;
}
const fmtNota = (a, n) => n == null ? '–' : (a.tipo_nota === 'letra' ? aLetra(n) : nf(n));
function resumenAsig(a) {
  const n = necesito(a);
  switch (n.estado) {
    case 'aprobada': return { t: 'Aprobada', cls: 'acc', n };
    case 'suspendida': return { t: 'Suspendida', cls: 'red', n };
    case 'rg': return { t: 'Te toca el Repte Global', cls: 'amber', n };
    case 'pendiente': return { t: 'Falta la nota de lo entregado', cls: 'muted', n };
    case 'imposible': return { t: calculo(a).recuperacion ? 'Por la vía ordinaria ya no llegas: queda el Repte Global' : 'Ya no llegas al 5 con lo que queda', cls: 'red', n };
    case 'asegurada': return { t: 'Aprobada aunque saques un 0 en lo que queda', cls: 'acc', n };
  }
  const alto = n.ev.margen === 0 || n.x >= 7;
  return { t: `Necesitas ${nf(n.x)} de media en lo que queda`, cls: alto ? 'amber' : 'muted', n };
}

/* ───────── Tarjetas ───────── */
const estCard = id => S.data.cards[id] || null;
function prioridadNueva(c) {
  const t = modelo().temaById[c.tema] || {};
  return [diasProx(c.asig), t.prio ? 0 : 1, t.duda ? 0 : 1];
}
function cardsHoy(aid) {
  const m = modelo(), now = new Date();
  const base = m.cards.filter(c => !aid || c.asig === aid);
  const due = base.filter(c => { const s = estCard(c.id); return s && s.due && new Date(s.due) <= now; })
    .sort((x, y) => new Date(estCard(x.id).due) - new Date(estCard(y.id).due));
  const hoyS = ymd(new Date());
  const hechas = Object.values(S.data.cards).filter(s => s.primera === hoyS).length;
  const cupo = Math.max(0, (+S.cfg.nuevas || 20) - hechas);
  const nuevasTodas = base.filter(c => !estCard(c.id) && ((modelo().temaById[c.tema] || {}).e || 0) >= 1);
  const orden = nuevasTodas.map((c, i) => ({ c, k: prioridadNueva(c).concat(i) }))
    .sort((x, y) => { for (let i = 0; i < x.k.length; i++) if (x.k[i] !== y.k[i]) return x.k[i] - y.k[i]; return 0; })
    .map(x => x.c);
  return { due, nuevas: orden.slice(0, cupo), totalNuevas: nuevasTodas.length };
}
function etiquetaCard(id) {
  const s = estCard(id);
  if (!s) return 'Nueva';
  const d = new Date(s.due), now = new Date();
  if (d <= now) return 'Toca hoy';
  const n = Math.ceil((d - now) / 864e5);
  return n <= 1 ? 'Mañana' : `En ${n} días`;
}

/* ───────── Navegación ───────── */
const enFoco = () => document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName);
const VISTAS = {};
const CAPAS = {};
const TABS = [['inicio', 'home', 'Inicio'], ['asig', 'book', 'Asignaturas'], ['estudiar', 'layers', 'Estudiar'], ['temario', 'list', 'Temario'], ['cal', 'cal', 'Calendario']];
function pintarTabbar() {
  $('#tabbar').innerHTML = TABS.map(([id, i, l]) => `<button class="tab" data-t="${id}" onclick="X.tab('${id}')">${ic(i, 23)}${l}${id === 'estudiar' ? '<span class="badge" id="badge" hidden></span>' : ''}</button>`).join('');
}
function badge() {
  const b = $('#badge'); if (!b) return;
  const h = cardsHoy(), n = h.due.length + h.nuevas.length;
  b.hidden = !n; b.textContent = n > 99 ? '99+' : n;
}
function tab(t) {
  S.tab = t;
  while (S.capas.length) S.capas.pop().remove();
  const f = () => {
    $$('.screen').forEach(s => s.classList.toggle('on', s.id === 'v-' + t));
    $$('.tab').forEach(b => b.classList.toggle('on', b.dataset.t === t));
    render();
    $('#v-' + t).scrollTop = 0;
  };
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(f); else f();
}
function render() {
  const el = $('#v-' + S.tab);
  el.innerHTML = VISTAS[S.tab]();
  mates(el); badge();
  if (!enFoco()) S.capas.forEach(pintarCapa);
}
function abrirCapa(tipo, arg = '') {
  const el = document.createElement('section');
  el.className = 'layer'; el.dataset.tipo = tipo; el.dataset.arg = arg;
  document.body.appendChild(el); S.capas.push(el); pintarCapa(el);
}
function cerrarCapa() {
  const el = S.capas.pop(); if (!el) return;
  el.classList.add('sale'); setTimeout(() => el.remove(), 190);
  render();
}
function pintarCapa(el) {
  el.innerHTML = CAPAS[el.dataset.tipo](el.dataset.arg);
  mates(el);
}

/* ───────── Hoja inferior ───────── */
function abrirSheet(html, montar) {
  cerrarSheet();
  const w = document.createElement('div'); w.id = 'sheetw';
  w.innerHTML = `<div class="backdrop" onclick="X.cerrarSheet()"></div><div class="sheet"><div class="grab"></div>${html}</div>`;
  document.body.appendChild(w);
  if (montar) montar(w);
}
function cerrarSheet() { const w = $('#sheetw'); if (w) w.remove(); }

/* ───────── Vistas: Inicio ───────── */
VISTAS.inicio = () => {
  const m = modelo(), h = hoy0(), sem = S.sem.semestre, a0 = D(sem.inicio), b0 = D(sem.fin);
  const semP = Math.min(1, Math.max(0, dias(h, a0) / dias(b0, a0)));
  const wk = Math.min(Math.ceil(dias(b0, a0) / 7), Math.max(1, Math.ceil((dias(h, a0) + 1) / 7))), wkT = Math.ceil(dias(b0, a0) / 7);
  const up = m.cal.filter(c => c.c && c.c >= h).sort((x, y) => x.c - y.c);
  const nx = up[0];
  const ch = cardsHoy(), nHoy = ch.due.length + ch.nuevas.length;
  const av = avisos(); window.AV = av.map(x => x.go);
  let html = `<div class="hdr"><div><div class="eyebrow">${DIAS[h.getDay()]}, ${h.getDate()} de ${MESL[h.getMonth()]} <span class="syncdot"></span>${esDemo() ? '<span class="demo">DEMO</span>' : ''}</div><h1>Hoy</h1></div><button class="ibtn" onclick="X.ajustes()" aria-label="Ajustes">${ic('set', 22)}</button></div>
  <div class="semline"><span>Semana ${wk} de ${wkT}</span><span>Acaba el ${fCorta(b0)}</span></div><div class="bar"><i style="width:${semP * 100}%"></i></div>`;
  const head = html; html = '';
  if (nx) {
    const d = dias(nx.c, h), cls = d < 3 ? 'red' : d < 7 ? 'amber' : '';
    const ent = S.data.entregas[nx.id] || {};
    const abierta = !nx.a || nx.a <= h;
    html += `<div class="next"><div class="eyebrow">${abierta ? 'Próxima entrega' : 'Próxima apertura'} · ${esc(abrev(nx.asignatura))}</div>
      <div class="big num ${cls}">${d === 0 ? 'Hoy' : d}${d === 0 ? '' : `<small>${d === 1 ? 'día' : 'días'}</small>`}</div>
      <div class="t">${esc(corto(nx))} · ${esc(asigDe(nx.asignatura).nombre)}</div>
      <div class="d">${abierta ? '' : 'Abre el ' + fDia(nx.a) + ' · '}Cierra el ${fDia(nx.c)}${ent.estado === 'entregada' ? ' · <span class="acc">Entregada</span>' : ''}</div>
      <div class="btns"><span class="link" onclick="X.entrega('${nx.id}')">${ent.estado === 'entregada' ? 'Poner nota' : 'Marcar entregada'}</span><button class="btn o" onclick="X.verTemario('${nx.asignatura}')">Temas</button></div></div>`;
    if (up.length > 1) html += `<div class="sec">Después</div><div class="list">${up.slice(1, 4).map(filaEntrega).join('')}</div>`;
  }
  let hoyHtml = `<div class="sec">Para hoy</div>`;
  if (m.cards.length) {
    hoyHtml += `<div class="box today"><div class="n num">${nHoy}</div><div class="l">${nHoy === 1 ? 'tarjeta' : 'tarjetas'}<br>${plural(ch.due.length, 'repaso', 'repasos')} · ${plural(ch.nuevas.length, 'nueva', 'nuevas')}</div><button class="btn a" style="margin-left:auto" onclick="X.sesion()" ${nHoy ? '' : 'disabled'}>Empezar</button></div>`;
  } else {
    hoyHtml += `<div class="box small muted" style="line-height:1.5">Todavía no hay material de estudio. Cuando Claude procese el PDF de un módulo, aquí te saldrán las tarjetas del día.</div>`;
  }
  if (av.length) html += `<div class="sec">Vas flojo</div><div>${av.map((x, i) => `<div class="alert ${x.cls}" onclick="AV[${i}]()"><div class="ic">${ic(x.ic, 17)}</div><div><b>${x.t}</b><p>${x.p}</p></div></div>`).join('')}</div>`;
  return `<div class="stag">${head}${hoyHtml}${html}</div>`;
};
function filaEntrega(c) {
  const h = hoy0(), d = dias(c.c, h), abierta = !c.a || c.a <= h;
  return `<div class="row" onclick="X.entrega('${c.id}')"><div class="m"><div class="t">${esc(abrev(c.asignatura))} · ${esc(corto(c))}</div><div class="s">${abierta ? 'Cierra el ' + fDia(c.c) : 'Abre el ' + fDia(c.a)}</div></div><div class="v num ${d < 3 ? 'red' : d < 7 ? 'amber' : ''}">${d}<small>días</small></div></div>`;
}
function avisos() {
  const m = modelo(), h = hoy0(), out = [];
  S.sem.asignaturas.forEach(a => {
    const r = resumenAsig(a), n = r.n, c = calculo(a);
    const minTxt = c.min_item != null ? ` con ${a.tipo_nota === 'letra' ? aLetra(c.min_item) : nf(c.min_item, 0)} o más` : '';
    if (n.estado === 'imposible') out.push({ cls: 'r', ic: 'warn', t: `${esc(a.abreviatura)} · ${r.t}`, p: 'Revisa las notas que has apuntado en la ficha.', go: () => X.ficha(a.id) });
    else if (n.estado === 'necesita' && n.ev.margen === 0) out.push({ cls: 'r', ic: 'warn', t: `${esc(a.abreviatura)} · sin margen`, p: `Tienes que entregar todo lo que queda${minTxt}. Necesitas ${nf(n.x)} de media.`, go: () => X.ficha(a.id) });
    else if (n.estado === 'necesita' && n.x >= 7) out.push({ cls: 'a', ic: 'warn', t: `${esc(a.abreviatura)} · necesitas ${nf(n.x)} de media`, p: 'Es una media alta para lo que queda.', go: () => X.ficha(a.id) });
    else if (n.estado === 'rg') out.push({ cls: 'a', ic: 'warn', t: `${esc(a.abreviatura)} · ${r.t}`, p: 'Con las PACs no llegas: aprobar el Repte Global te da un C+.', go: () => X.ficha(a.id) });
  });
  const sin = m.cal.filter(c => c.c && c.c < h && notaDe(c.id).tipo === 'pend' && !(S.data.entregas[c.id] || {}).estado);
  if (sin.length) out.push({ cls: 'n', ic: 'pen', t: `${plural(sin.length, 'entrega cerrada', 'entregas cerradas')} sin marcar`, p: `${sin.map(c => esc(abrev(c.asignatura) + ' ' + corto(c))).join(', ')}. Sin esto no puedo calcular lo que necesitas.`, go: () => X.entrega(sin[0].id) });
  const sinNota = m.cal.filter(c => (S.data.entregas[c.id] || {}).estado === 'entregada' && notaDe(c.id).tipo === 'pend' && c.c && c.c < h);
  if (sinNota.length) out.push({ cls: 'n', ic: 'pen', t: `${plural(sinNota.length, 'entrega', 'entregas')} sin nota`, p: `${sinNota.map(c => esc(abrev(c.asignatura) + ' ' + corto(c))).join(', ')}. Apúntala cuando salga.`, go: () => X.entrega(sinNota[0].id) });
  S.sem.asignaturas.forEach(a => {
    const p = proxima(a.id); if (!p) return;
    const d = dias(p.c, h); if (d > 14) return;
    const ts = m.temas.filter(t => t.asig === a.id);
    const enPac = (p.modulos || []).length ? ts.filter(t => p.modulos.includes(t.mod) && t.e === 0) : [];
    const dudas = ts.filter(t => t.duda);
    if (enPac.length) out.push({ cls: 'a', ic: 'book', t: `${esc(a.abreviatura)} · ${plural(enPac.length, 'tema', 'temas')} sin estudiar para la ${esc(corto(p))}`, p: `Cierra en ${plural(d, 'día', 'días')}.`, go: () => { S.fAsig = a.id; S.fTag = 'e0'; X.tab('temario'); } });
    if (dudas.length) out.push({ cls: 'a', ic: 'help', t: `${esc(a.abreviatura)} · ${plural(dudas.length, 'duda abierta', 'dudas abiertas')}`, p: `La ${esc(corto(p))} cierra en ${plural(d, 'día', 'días')}.`, go: () => { S.fAsig = a.id; S.fTag = 'd'; X.tab('temario'); } });
  });
  return out;
}

/* ───────── Vistas: Asignaturas y ficha ───────── */
VISTAS.asig = () => {
  const cred = S.sem.asignaturas.reduce((s, a) => s + (+a.creditos || 0), 0);
  return `<div class="stag"><div class="hdr"><div><div class="eyebrow">${plural(S.sem.asignaturas.length, 'asignatura', 'asignaturas')} · ${cred} créditos</div><h1>Asignaturas</h1></div></div>
  <div class="list">${S.sem.asignaturas.map(a => {
    const r = resumenAsig(a), l = llevas(a), c = calculo(a), con = c.items.filter(id => notaDe(id).tipo === 'nota').length;
    return `<div class="row" onclick="X.ficha('${a.id}')"><div class="m"><div class="ab">${esc(a.abreviatura)}</div><div class="t">${esc(a.nombre)}</div><div class="s ${r.cls}">${r.t}</div></div><div class="v num">${fmtNota(a, l)}<small>${con} de ${c.items.length} con nota</small></div></div>`;
  }).join('')}</div></div>`;
};
CAPAS.ficha = aid => {
  const a = asigDe(aid), m = modelo(), r = resumenAsig(a), n = r.n, ev = n.ev, c = calculo(a), h = hoy0(), l = llevas(a);
  const prof = (a.profesorado || []).map(p => esc(p.nombre)).join(', ');
  const ia = a.ia || {};
  const iaTxt = ia.permitida === true ? 'IA permitida' : ia.permitida === false ? 'IA prohibida' : 'IA sin confirmar';
  const nec = n.estado === 'necesita' ? `${nf(n.x)}<small>de media</small>` : n.estado === 'imposible' ? '<span class="red">–</span>' : n.estado === 'aprobada' || n.estado === 'asegurada' ? '<span class="acc">✓</span>' : '–';
  const items = [...c.items, c.pf, c.global, c.recuperacion].filter(Boolean);
  const cal = items.map(id => m.cal.find(x => x.id === id)).filter(Boolean);
  const ts = m.temas.filter(t => t.asig === aid), dom = ts.filter(t => t.e === 2).length;
  let html = `<button class="back" onclick="X.atras()">${ic('left', 22)}Asignaturas</button>
  <div class="eyebrow">${esc(a.abreviatura)} · ${esc(a.codigo || '')}</div><h1 class="sm">${esc(a.nombre)}</h1>
  <div class="meta">${[a.creditos ? a.creditos + ' créditos' : '', a.caracter ? a.caracter[0].toUpperCase() + a.caracter.slice(1) : '', prof].filter(Boolean).join(' · ')}<br>${iaTxt}${ia.detalle ? '. ' + esc(ia.detalle) : ''}</div>
  <div class="duo"><div><div class="k">Llevas</div><div class="val num">${fmtNota(a, l)}${l != null && a.tipo_nota === 'letra' ? `<small>${nf(l)}</small>` : ''}</div></div><div><div class="k">Necesitas</div><div class="val num">${nec}</div></div></div>
  <div class="note ${r.cls === 'red' ? 'r' : r.cls === 'amber' ? 'a' : ''}">${r.t}${n.estado === 'necesita' && ev.margen != null ? `. ${ev.margen > 0 ? `Puedes dejar sin entregar ${plural(ev.margen, 'entrega', 'entregas')} más.` : 'No puedes dejar ninguna sin entregar.'}` : '.'}</div>
  <div class="sec">Mínimos</div><div>${ev.ck.map(k => `<div class="chk"><span class="ci ${k.st}">${k.st === 'ok' ? ic('check', 13) : k.st === 'mal' ? ic('x', 13) : ''}</span><span>${k.t}</span><span class="r num">${k.v}</span></div>`).join('')}</div>
  <div class="sec">Entregas</div><div class="list">${cal.map(x => {
    const nd = notaDe(x.id), e = S.data.entregas[x.id] || {};
    let s, v;
    if (nd.tipo === 'no') { s = 'No entregada'; v = '<span class="red">0</span>'; }
    else if (nd.tipo === 'nota') { s = 'Entregada'; v = a.tipo_nota === 'letra' ? (nd.letra || aLetra(nd.n)) : nf(nd.n); }
    else if (e.estado === 'entregada') { s = 'Entregada · sin nota'; v = '<span class="faint">–</span>'; }
    else if (!x.c) { s = 'Sin fecha · toca para ponerla'; v = '<span class="faint">–</span>'; }
    else if (x.c < h) { s = `Cerró el ${fCorta(x.c)} · sin marcar`; v = '<span class="faint">?</span>'; }
    else if (x.a && x.a > h) { s = `Abre el ${fDia(x.a)}`; v = '<span class="faint">–</span>'; }
    else { const d = dias(x.c, h); s = `Abierta · cierra el ${fDia(x.c)}`; v = `<span class="${d < 3 ? 'red' : d < 7 ? 'amber' : ''}">${d}</span><small>días</small>`; }
    const w = ['ponderada', 'recuperacion'].includes(c.tipo) && c.items.includes(x.id) ? ` · ${Math.round(pesos(c.items)[c.items.indexOf(x.id)] * 1000) / 10} %` : '';
    return `<div class="row" onclick="X.entrega('${x.id}')"><div class="m"><div class="t">${esc(x.nombre)}</div><div class="s">${s}${w}</div></div><div class="v num">${v}</div></div>`;
  }).join('')}</div>`;
  if (n.ids.length) {
    const def = n.estado === 'necesita' ? Math.min(10, Math.ceil(n.x * 2) / 2) : 5;
    html += `<div class="sec">Simulador</div><div class="box" id="sim" data-a="${aid}">${n.ids.map(id => {
      const x = m.cal.find(y => y.id === id) || { nombre: id };
      return `<div class="sl"><div class="h"><span>${esc(corto(x))}</span><span class="num" id="o-${id}">${nf(def)}</span></div><input type="range" min="0" max="10" step="0.5" value="${def}" data-id="${id}" oninput="X.sim('${aid}')"></div>`;
    }).join('')}<div class="verd"><div><div class="small muted">Nota final</div><div class="val num" id="simv">–</div></div><div class="vt" id="simt"></div></div></div>`;
  }
  html += `<div class="sec">Plan docente</div><details><summary>Reglas de evaluación ${ic('right', 18)}</summary><ul>${(a.evaluacion && a.evaluacion.reglas || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>
  <div class="sec">Temario <a onclick="X.verTemario('${aid}')">Ver temas</a></div><div class="prog" style="grid-template-columns:1fr 70px"><div class="bar"><i style="width:${ts.length ? dom / ts.length * 100 : 0}%"></i></div><span class="p num">${dom} de ${ts.length}</span></div>`;
  setTimeout(() => X.sim(aid), 0);
  return html;
};

/* ───────── Vistas: Estudiar ───────── */
VISTAS.estudiar = () => {
  const m = modelo(), ch = cardsHoy(), n = ch.due.length + ch.nuevas.length;
  let html = `<div class="hdr"><div><div class="eyebrow">Ordenado por la entrega más cercana</div><h1>Estudiar</h1></div></div>`;
  if (!m.cards.length) {
    html += `<div class="box"><b>Sin material todavía</b><p class="small muted" style="margin-top:6px;line-height:1.5">Pásale a Claude el PDF de un módulo. Lo deja en tu carpeta de Drive «Semestre estudio» y aquí aparecen el resumen, las tarjetas y los ejercicios de cada tema.</p></div>`;
  } else {
    html += `<div class="box today"><div class="n num">${n}</div><div class="l">${n === 1 ? 'tarjeta para hoy' : 'tarjetas para hoy'}<br>${plural(ch.due.length, 'repaso', 'repasos')} · ${plural(ch.nuevas.length, 'nueva', 'nuevas')}</div><button class="btn a" style="margin-left:auto" onclick="X.sesion()" ${n ? '' : 'disabled'}>Empezar</button></div>`;
    const porAsig = S.sem.asignaturas.map(a => ({ a, h: cardsHoy(a.id), total: m.cards.filter(c => c.asig === a.id).length })).filter(x => x.total);
    html += `<div class="sec">Por asignatura</div><div class="list">${porAsig.map(({ a, h, total }) => {
      const k = h.due.length + h.nuevas.length;
      return `<div class="row" onclick="X.sesion('${a.id}')"><div class="m"><div class="t">${esc(a.abreviatura)} · ${esc(a.nombre)}</div><div class="s">${plural(total, 'tarjeta', 'tarjetas')} · hoy ${plural(h.due.length, 'repaso', 'repasos')} y ${plural(h.nuevas.length, 'nueva', 'nuevas')}</div></div><div class="v num ${k ? 'acc' : 'faint'}">${k}</div></div>`;
    }).join('')}</div>`;
  }
  const score = t => [diasProx(t.asig), t.duda ? 0 : 1, t.prio ? 0 : 1, t.e, t.ultimo || '0'];
  const cola = m.temas.filter(t => t.e < 2 || t.duda).map(t => ({ t, k: score(t) }))
    .sort((x, y) => { for (let i = 0; i < x.k.length; i++) { if (x.k[i] < y.k[i]) return -1; if (x.k[i] > y.k[i]) return 1; } return 0; }).slice(0, 8).map(x => x.t);
  html += `<div class="sec">Temas a trabajar <a onclick="X.tab('temario')">Todos</a></div>`;
  html += cola.length ? `<div class="list">${cola.map(t => filaTema(t, abrev(t.asig))).join('')}</div>` : `<div class="empty">Todo dominado. Buen momento para repasar tarjetas.</div>`;
  const ejs = [];
  m.temas.forEach(t => (t.cont && t.cont.ejercicios || []).forEach((e, i) => { if (!S.data.ejercicios[e.id]) ejs.push({ t, e, i }); }));
  ejs.sort((x, y) => diasProx(x.t.asig) - diasProx(y.t.asig));
  if (ejs.length) html += `<div class="sec">Ejercicios sin hacer</div><div class="list">${ejs.slice(0, 5).map(({ t, e, i }) => `<div class="row" onclick="X.tema('${t.id}','ej')"><div class="m"><div class="t">${esc(t.titulo)}</div><div class="s">${esc(abrev(t.asig))} · Ejercicio ${i + 1} · ${e.tipo === 'desarrollo' ? 'desarrollo' : 'cálculo'}</div></div>${ic('right', 18, 'faint')}</div>`).join('')}</div>`;
  return `<div class="stag">${html}</div>`;
};
function filaTema(t, ctx) {
  const nC = t.cont ? (t.cont.tarjetas || []).length : 0, nE = t.cont ? (t.cont.ejercicios || []).length : 0;
  const sub = [ctx, t.cont ? `${plural(nC, 'tarjeta', 'tarjetas')} · ${plural(nE, 'ejercicio', 'ejercicios')}` : '', t.bloque ? 'módulo sin temas' : '', t.propio ? 'añadido por ti' : ''].filter(Boolean).join(' · ');
  return `<div class="row" onclick="X.tema('${t.id}')"><span class="dot e${t.e}"></span><div class="m"><div class="t">${esc(t.titulo)}</div>${sub ? `<div class="s">${sub}</div>` : ''}</div><span class="flags">${t.duda ? ic('help', 16, 'on duda') : ''}${t.prio ? ic('star', 16, 'on prio') : ''}</span><button class="est e${t.e}" onclick="event.stopPropagation();X.ciclo('${t.id}')">${ESTADOS[t.e]}</button></div>`;
}

/* ───────── Vistas: Temario ───────── */
const FILTROS = { e0: ['Por estudiar', t => t.e === 0], e1: ['Repasar', t => t.e === 1], e2: ['Dominado', t => t.e === 2], d: ['Duda', t => t.duda], p: ['Prioridad', t => t.prio] };
VISTAS.temario = () => {
  const m = modelo();
  const base = m.temas.filter(t => S.fAsig === 'all' || t.asig === S.fAsig);
  const filtrar = S.fTag ? FILTROS[S.fTag][1] : () => true;
  let html = `<div class="hdr"><div><div class="eyebrow">${plural(m.temas.length, 'tema', 'temas')} · ${m.temas.filter(t => t.e === 2).length} dominados</div><h1>Temario</h1></div></div>
  <div class="hs">${[['all', 'Todas']].concat(S.sem.asignaturas.map(a => [a.id, a.abreviatura])).map(([k, l]) => `<button class="chip ${S.fAsig === k ? 'on' : ''}" onclick="X.fAsig('${k}')">${esc(l)}</button>`).join('')}</div>
  <div class="hs" style="margin-top:8px">${Object.keys(FILTROS).map(k => `<button class="chip ${S.fTag === k ? 'on' : ''}" onclick="X.fTag('${k}')">${k === 'd' ? ic('help', 15) : k === 'p' ? ic('star', 15) : `<span class="dot ${k}"></span>`}${FILTROS[k][0]} <span class="c">${base.filter(FILTROS[k][1]).length}</span></button>`).join('')}</div>`;
  let algo = false;
  S.sem.asignaturas.filter(a => S.fAsig === 'all' || a.id === S.fAsig).forEach(a => {
    const mods = m.mods.filter(mo => mo.asig === a.id).map(mo => ({ mo, ts: mo.temas.filter(filtrar) })).filter(x => x.ts.length);
    if (!mods.length) return;
    algo = true;
    html += `<div class="subh">${esc(a.abreviatura)}<span style="font-weight:600">${esc(a.nombre)}</span></div>`;
    mods.forEach(({ mo, ts }) => {
      const dom = mo.temas.filter(t => t.e === 2).length;
      html += `<div class="mod"><div class="mt">${esc(mo.titulo)}</div><div class="ms"><span>${dom} de ${mo.temas.length} dominados</span><div class="bar"><i style="width:${dom / mo.temas.length * 100}%"></i></div></div>
      <div class="list">${ts.map(t => filaTema(t, '')).join('')}</div></div>`;
    });
  });
  if (!algo) html += `<div class="empty">Ningún tema con este filtro.</div>`;
  return html;
};

/* ───────── Capa: tema ───────── */
CAPAS.tema = id => {
  const m = modelo(), t = m.temaById[id];
  if (!t) return `<button class="back" onclick="X.atras()">${ic('left', 22)}Volver</button><div class="empty">Este tema ya no existe.</div>`;
  const a = asigDe(t.asig), cont = t.cont;
  const tab = UI.temaTab[id] || 'res';
  let html = `<button class="back" onclick="X.atras()">${ic('left', 22)}Volver</button>
  <div class="eyebrow">${esc(a.abreviatura)} · ${esc(t.modTitulo)}</div><h1 class="sm">${esc(t.titulo)}</h1></h1>`;
  if (!cont) {
    html += `<div class="empty" style="padding-top:28px">Sin material todavía.<br>Cuando Claude procese el PDF de este módulo, aquí tendrás el resumen, las tarjetas y los ejercicios.</div>`;
  } else {
    const nC = (cont.tarjetas || []).length, nE = (cont.ejercicios || []).length;
    html += `<div class="tabs"><button class="${tab === 'res' ? 'on' : ''}" onclick="X.temaTab('${id}','res')">Resumen</button>${nC ? `<button class="${tab === 'tar' ? 'on' : ''}" onclick="X.temaTab('${id}','tar')">Tarjetas<span class="c">${nC}</span></button>` : ''}${nE ? `<button class="${tab === 'ej' ? 'on' : ''}" onclick="X.temaTab('${id}','ej')">Ejercicios<span class="c">${nE}</span></button>` : ''}</div>`;
    if (tab === 'tar' && nC) {
      html += `<button class="btn p w" style="margin-top:18px" onclick="X.sesionTema('${id}')">Repasar estas ${nC} tarjetas</button><div style="margin-top:8px">${cont.tarjetas.map(c => `<div class="cardq ${UI.abiertas[c.id] ? 'open' : ''}" onclick="X.voltear('${c.id}',this)"><div class="q">${c.pregunta}</div><div class="a">${c.respuesta}</div><div class="st">${etiquetaCard(c.id)}</div></div>`).join('')}</div>`;
    } else if (tab === 'ej' && nE) {
      html += cont.ejercicios.map((e, i) => ejercicio(e, i)).join('');
    } else {
      html += `<div class="rich" style="margin-top:8px">${cont.resumen || '<p class="muted">Este tema no tiene resumen.</p>'}</div>`;
      if (t.e === 0) html += `<button class="btn o w" style="margin-top:18px" onclick="X.estado('${id}',1)">Leído · pasar a Repasar</button>`;
    }
  }
  const ctlHtml = `
  <div class="seg" style="margin-top:18px">${ESTADOS.map((e, i) => `<button class="${t.e === i ? 'on' : ''}" onclick="X.estado('${id}',${i})">${e}</button>`).join('')}</div>
  <div class="toggles"><button class="tg duda ${t.duda ? 'on' : ''}" onclick="X.flag('${id}','duda')">${ic('help', 16)}Duda</button><button class="tg prio ${t.prio ? 'on' : ''}" onclick="X.flag('${id}','prioridad')">${ic('star', 16)}Prioridad</button><span class="small faint" style="margin-left:auto;align-self:center">${t.ultimo ? 'Repasado el ' + fCorta(D(t.ultimo)) : 'Sin repasar'}</span></div>
  <textarea style="margin-top:12px" placeholder="Apunte o duda concreta" onchange="X.apunte('${id}',this.value)">${esc(t.apunte)}</textarea>`;
  html += `<div class="sec" style="margin-top:28px">Estado y notas</div>${ctlHtml}`;
  if (t.propio) html += `<button class="add" style="margin-top:24px;color:var(--red)" onclick="X.borrarTema('${id}')">${ic('x', 18)}Borrar este tema</button>`;
  return html;
};
function ejercicio(e, i) {
  const st = S.data.ejercicios[e.id] || {}, ok = +st.ok || 0, mal = +st.fallos || 0;
  const pasos = e.pasos || [], k = UI.pasos[e.id] || 0;
  let html = `<div class="ex"><div class="n">Ejercicio ${i + 1} · ${e.tipo === 'desarrollo' ? 'Desarrollo' : 'Cálculo'}${ok + mal ? ` <span class="faint" style="text-transform:none;letter-spacing:0;font-weight:600">· ${ok} de ${ok + mal} bien</span>` : ''}</div><div class="rich en">${e.enunciado || ''}</div>`;
  let terminado = false;
  if (e.tipo === 'desarrollo') {
    if (UI.puntos[e.id]) { html += `<div class="step"><div class="st">Puntos que debería tener tu respuesta</div><ul class="puntos rich">${(e.puntos || []).map(p => `<li>${p}</li>`).join('')}</ul></div>`; terminado = true; }
    else html += `<button class="btn o w" style="margin-top:14px" onclick="X.puntos('${e.id}')">Ver puntos clave</button>`;
  } else {
    html += pasos.slice(0, k).map((p, j) => `<div class="step"><div class="st">${j + 1}. ${esc(p.titulo || '')}</div><div class="rich">${p.texto || ''}</div></div>`).join('');
    if (k < pasos.length) {
      html += `<button class="btn o w" style="margin-top:14px" onclick="X.paso('${e.id}')">${k === 0 ? 'Ver el primer paso' : `Siguiente paso (${k + 1} de ${pasos.length})`}</button>`;
      if (e.resultado) html += UI.comp[e.id] ? `<div class="res rich">${e.resultado}</div>` : `<button class="btn o w" style="margin-top:8px" onclick="X.comprobar('${e.id}')">Comprobar resultado</button>`;
    } else { if (e.resultado) html += `<div class="res rich">${e.resultado}</div>`; terminado = true; }
  }
  if (terminado) html += `<div class="self"><button class="btn o" onclick="X.autoeval('${e.id}',false)">No me ha salido</button><button class="btn a" onclick="X.autoeval('${e.id}',true)">Me ha salido</button></div>`;
  return html + '</div>';
}

/* ───────── Capa: sesión de tarjetas ───────── */
let SES = null;
CAPAS.sesion = () => {
  if (!SES) return '';
  const total = SES.ids.length;
  if (SES.i >= total) return `<div class="ses"><div class="fin"><div class="n num">${SES.hechas}</div><div class="muted">${SES.hechas === 1 ? 'tarjeta repasada' : 'tarjetas repasadas'}</div><div style="margin-top:28px"><button class="btn p" onclick="X.cerrarSesion()">Terminar</button></div></div></div>`;
  const m = modelo(), id = SES.ids[SES.i], card = m.cards.find(c => c.id === id), t = m.temaById[card.tema], st = estCard(id);
  const g = [[1, 'Otra vez'], [2, 'Difícil'], [3, 'Bien'], [4, 'Fácil']];
  return `<div class="ses"><div class="ses-top"><button class="ibtn" onclick="X.cerrarSesion()" aria-label="Cerrar">${ic('x', 22)}</button><div class="bar"><i style="width:${SES.i / total * 100}%"></i></div><div class="c num">${SES.i + 1} / ${total}</div></div>
  <div class="ses-card"><div class="eb">${esc(abrev(card.asig))} · ${esc(t ? t.titulo : '')}${st ? '' : ' · <span class="acc">nueva</span>'}</div><div class="q rich">${card.pregunta}</div>${SES.show ? `<div class="sep"></div><div class="a rich">${card.respuesta}</div>` : ''}</div>
  <div class="ses-bot">${SES.show ? `<div class="grades">${g.map(([n, l]) => `<button class="g${n}" onclick="X.nota(${n})">${l}<small>${FSRS.etiqueta(st, n)}</small></button>`).join('')}</div>` : `<button class="btn p w" style="height:56px" onclick="X.mostrar()">Mostrar respuesta</button>`}</div></div>`;
};

/* ───────── Vistas: Calendario ───────── */
VISTAS.cal = () => {
  const m = modelo(), h = hoy0();
  if (!S.cm) S.cm = new Date(h.getFullYear(), h.getMonth(), 1);
  if (!S.sel) S.sel = new Date(h);
  const y = S.cm.getFullYear(), mo = S.cm.getMonth(), off = (new Date(y, mo, 1).getDay() + 6) % 7, nd = new Date(y, mo + 1, 0).getDate();
  let cells = '';
  for (let i = 0; i < off; i++) cells += '<div class="day out"></div>';
  for (let d = 1; d <= nd; d++) {
    const dt = new Date(y, mo, d);
    const ci = m.cal.filter(c => same(c.c, dt)).map(c => { const k = dias(c.c, h); return `<i class="${k >= 0 && k < 3 ? 'u' : ''}"></i>`; });
    const ab = m.cal.filter(c => same(c.a, dt)).map(() => '<i class="o"></i>');
    cells += `<button class="day ${same(dt, h) ? 'today' : ''} ${same(dt, S.sel) ? 'sel' : ''} ${dt < h ? 'past' : ''}" onclick="X.dia(${y},${mo},${d})">${d}<span class="ds">${ci.concat(ab).slice(0, 4).join('')}</span></button>`;
  }
  const sel = S.sel;
  const lista = m.cal.filter(c => c.c && ((c.a && c.a <= sel && c.c >= sel) || same(c.c, sel) || same(c.a, sel))).sort((a, b) => a.c - b.c);
  const filas = lista.map(c => {
    const d = dias(c.c, h);
    const txt = same(c.c, sel) ? 'Cierra este día' : same(c.a, sel) ? `Abre este día · cierra el ${fCorta(c.c)}` : `${c.a ? fCorta(c.a) : ''} → ${fCorta(c.c)}`;
    return `<div class="row" onclick="X.entrega('${c.id}')"><div class="m"><div class="t">${esc(abrev(c.asignatura))} · ${esc(corto(c))}</div><div class="s">${txt}</div></div>${d >= 0 ? `<div class="v num ${d < 3 ? 'red' : d < 7 ? 'amber' : ''}">${d}<small>días</small></div>` : ''}</div>`;
  }).join('');
  const a0 = D(S.sem.semestre.inicio), b0 = D(S.sem.semestre.fin), span = dias(b0, a0);
  const pos = d => Math.max(0, Math.min(100, dias(d, a0) / span * 100)), tp = pos(h);
  const meses = []; for (let d = new Date(a0.getFullYear(), a0.getMonth() + 1, 1); d <= b0; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) meses.push(new Date(d));
  const gantt = `<div class="gt"><div></div><div class="gm">${meses.map(x => `<span style="left:${pos(x)}%">${MES[x.getMonth()]}</span>`).join('')}</div>${S.sem.asignaturas.map(a => {
    const p = proxima(a.id);
    return `<div class="gl">${esc(a.abreviatura)}</div><div class="gtrack">${m.cal.filter(c => c.asignatura === a.id && c.c).map(c => {
      const ini = c.a || c.c;
      return `<div class="gbar ${c.c < h ? 'past' : p && p.id === c.id ? 'prox' : ''}" style="left:${pos(ini)}%;width:max(4px,calc(${pos(c.c) - pos(ini)}% - 2px))"></div>`;
    }).join('')}${h >= a0 && h <= b0 ? `<div class="tline" style="left:${tp}%"></div>` : ''}</div>`;
  }).join('')}</div>`;
  return `<div class="hdr"><div><div class="eyebrow">${fCorta(a0)} → ${fCorta(b0)}</div><h1>Calendario</h1></div></div>
  <div class="mnav"><button class="ibtn" onclick="X.mes(-1)" aria-label="Mes anterior">${ic('left', 22)}</button><div class="m">${MESL[mo]} ${y}</div><button class="ibtn" onclick="X.mes(1)" aria-label="Mes siguiente">${ic('right', 22)}</button></div>
  <div class="mg">${['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(w => `<div class="wd">${w}</div>`).join('')}${cells}</div>
  <div class="cleg"><span><i></i>Cierra</span><span><i class="o"></i>Abre</span><span><i style="background:var(--red)"></i>En menos de 3 días</span></div>
  <div class="sec">${same(sel, h) ? 'Hoy' : fDia(sel)}</div>
  ${filas ? `<div class="list">${filas}</div>` : '<div class="empty" style="padding:20px">Nada abierto este día.</div>'}
  <div class="sec">Semestre</div>${gantt}`;
};

/* ───────── Capa: ajustes ───────── */
CAPAS.ajustes = () => {
  const est = Object.values(S.estudio);
  const ult = S.sync.t ? new Date(S.sync.t) : null;
  const stTxt = esDemo() ? 'Modo demo: los datos son de ejemplo y se quedan en este iPhone.' :
    S.sync.st === 'err' ? `<span class="red">${esc(S.sync.err)}</span>` :
    S.sync.st === 'run' ? 'Sincronizando…' : S.sync.st === 'off' ? 'Sin conexión: los cambios se suben al volver.' :
    ult ? `Sincronizado a las ${String(ult.getHours()).padStart(2, '0')}:${String(ult.getMinutes()).padStart(2, '0')}` : 'Conectado';
  return `<button class="back" onclick="X.atras()">${ic('left', 22)}Volver</button><h1>Ajustes</h1>
  <div class="sec">Google Sheet</div>
  <div class="field"><label>URL de la aplicación web de Apps Script</label><input id="cfg-url" value="${esc(S.cfg.url)}" placeholder="https://script.google.com/macros/s/…/exec" autocomplete="off" autocapitalize="off" spellcheck="false"></div>
  <div class="field"><label>Token</label><input id="cfg-token" type="password" value="${esc(S.cfg.token)}" autocomplete="off" autocapitalize="off" spellcheck="false"></div>
  <p class="small muted" style="margin-top:10px;line-height:1.5"><span class="syncdot"></span> ${stTxt}${S.cola.length ? ` · ${plural(S.cola.length, 'cambio pendiente', 'cambios pendientes')} de subir` : ''}</p>
  <div class="btns"><button class="btn p" onclick="X.conectar()">Guardar y conectar</button>${esDemo() ? '' : `<button class="btn o" onclick="X.sincronizar()">Sincronizar</button>`}</div>
  ${esDemo() ? '' : `<button class="add" onclick="X.desconectar()">${ic('minus', 18)}Desconectar y volver al modo demo</button>`}
  <div class="sec">Material de estudio</div>
  ${est.length ? `<div class="list">${est.map(mo => `<div class="row" style="cursor:default"><div class="m"><div class="t">${esc(abrev(mo.asignatura))} · ${esc(mo.titulo || mo.modulo)}</div><div class="s">${plural((mo.temas || []).length, 'tema', 'temas')} · ${(mo.temas || []).reduce((s, t) => s + (t.tarjetas || []).length, 0)} tarjetas · ${(mo.temas || []).reduce((s, t) => s + (t.ejercicios || []).length, 0)} ejercicios</div></div></div>`).join('')}</div>` : '<p class="small muted">Todavía no hay módulos en la carpeta «Semestre estudio».</p>'}
  ${(S.sync.malos || []).length ? `<p class="small red" style="margin-top:10px">No se han podido leer: ${S.sync.malos.map(esc).join(', ')}</p>` : ''}
  <div class="sec">Repaso</div>
  <div class="field" style="margin-top:0"><label>Tarjetas nuevas al día</label><input id="cfg-nuevas" type="number" inputmode="numeric" min="0" max="200" value="${+S.cfg.nuevas || 20}" onchange="X.nuevasDia(this.value)"></div>
  <div class="sec">Semestre</div>
  <p class="small" style="line-height:1.6">${esc(S.sem.semestre.nombre)} · ${fCorta(D(S.sem.semestre.inicio))} → ${fCorta(D(S.sem.semestre.fin))}<br><span class="muted">Para cambiar de semestre, sustituye semestre.json en GitHub. El progreso de cada semestre se guarda aparte.</span></p>
  <p class="small faint" style="margin-top:28px">Semestre ${APP_VERSION} · ${S.sem.semestre.id}</p>`;
};

/* ───────── Acciones ───────── */
const X = window.X = {
  tab,
  atras: cerrarCapa,
  cerrarSheet,
  ajustes: () => abrirCapa('ajustes'),
  ficha: aid => abrirCapa('ficha', aid),
  tema: (id, t) => { if (t) UI.temaTab[id] = t; abrirCapa('tema', id); },
  verTemario: aid => { S.fAsig = aid; S.fTag = null; tab('temario'); },
  fAsig: k => { S.fAsig = k; render(); },
  fTag: k => { S.fTag = S.fTag === k ? null : k; render(); },
  mes: d => { S.cm = new Date(S.cm.getFullYear(), S.cm.getMonth() + d, 1); render(); },
  dia: (y, m, d) => { S.sel = new Date(y, m, d); render(); },
  temaTab: (id, t) => { UI.temaTab[id] = t; render(); },
  voltear: (id, el) => { UI.abiertas[id] = !UI.abiertas[id]; el.classList.toggle('open'); },
  paso: id => { UI.pasos[id] = (UI.pasos[id] || 0) + 1; render(); },
  comprobar: id => { UI.comp[id] = true; render(); },
  puntos: id => { UI.puntos[id] = true; render(); },
  autoeval: (id, bien) => {
    const s = S.data.ejercicios[id] || {};
    guardar('Ejercicios', id, { ok: (+s.ok || 0) + (bien ? 1 : 0), fallos: (+s.fallos || 0) + (bien ? 0 : 1), ultimo: ymd(new Date()) });
    UI.pasos[id] = 0; UI.puntos[id] = false;
    toast(bien ? 'Apuntado' : 'Apuntado. Vuelve a intentarlo otro día');
    render();
  },
  ciclo: id => { const t = modelo().temaById[id]; X.estado(id, (t.e + 1) % 3); },
  estado: (id, e) => { guardar('Temas', id, { estado: String(e), ultimo: e > 0 ? ymd(new Date()) : (S.data.temas[id] || {}).ultimo || '' }); render(); },
  flag: (id, k) => { const v = esSi((S.data.temas[id] || {})[k]); guardar('Temas', id, { [k]: v ? '0' : '1' }); render(); },
  apunte: (id, v) => { guardar('Temas', id, { apunte: v.trim() }); toast('Apunte guardado'); },
  nuevoTema: (mod, aid) => {
    abrirSheet(`<h3>Añadir tema</h3><div class="sub">${esc((modelo().mods.find(m => m.id === mod) || {}).titulo || '')}</div><div class="field"><label>Título</label><input id="nt" autocomplete="off"></div><button class="btn p w" style="margin-top:18px" id="nt-ok">Añadir</button>`, w => {
      const inp = $('#nt', w); setTimeout(() => inp.focus(), 250);
      $('#nt-ok', w).onclick = () => {
        const t = inp.value.trim(); if (!t) return inp.focus();
        guardar('Propios', 'p-' + uid().slice(0, 8), { asignatura: aid, modulo: mod, titulo: t, borrado: '0' });
        cerrarSheet(); render(); toast('Tema añadido');
      };
    });
  },
  borrarTema: id => { guardar('Propios', id, { borrado: '1' }); cerrarCapa(); toast('Tema borrado'); },
  entrega: id => abrirEntrega(id),
  sim: aid => {
    const box = $('#sim'); if (!box || box.dataset.a !== aid) return;
    const a = asigDe(aid), fill = {};
    $$('input[type=range]', box).forEach(r => { fill[r.dataset.id] = +r.value; $('#o-' + r.dataset.id).textContent = nf(+r.value); });
    const ev = evaluar(a, fill);
    const v = $('#simv'), t = $('#simt');
    if (ev.final == null) { v.textContent = '–'; t.textContent = ''; return; }
    v.textContent = fmtNota(a, ev.final) + (a.tipo_nota === 'letra' ? ` (${nf(ev.final)})` : '');
    const fallo = ev.ck.find(k => k.st === 'mal');
    t.textContent = ev.ok ? 'Apruebas' : fallo ? 'Falla: ' + fallo.t.toLowerCase() : 'Te faltaría el Repte Global';
    t.className = 'vt ' + (ev.ok ? 'acc' : 'red'); v.className = 'val num ' + (ev.ok ? 'acc' : 'red');
  },
  sesion: aid => { const h = cardsHoy(aid); empezarSesion(h.due.concat(h.nuevas)); },
  sesionTema: id => {
    const cs = modelo().cards.filter(c => c.tema === id);
    const now = new Date();
    cs.sort((x, y) => { const a = estCard(x.id), b = estCard(y.id); const ka = !a ? 1 : new Date(a.due) <= now ? 0 : 2, kb = !b ? 1 : new Date(b.due) <= now ? 0 : 2; return ka - kb; });
    empezarSesion(cs);
  },
  mostrar: () => { SES.show = true; repintarSesion(); },
  nota: g => {
    const id = SES.ids[SES.i], st = estCard(id), n = FSRS.repasar(st, g, new Date());
    const card = modelo().cards.find(c => c.id === id);
    n.primera = (st && st.primera) || ymd(new Date());
    guardar('Tarjetas', id, n);
    if (card && !SES.temas.has(card.tema)) { SES.temas.add(card.tema); guardar('Temas', card.tema, { ultimo: ymd(new Date()) }); }
    if (g === 1) SES.ids.splice(Math.min(SES.i + 4, SES.ids.length), 0, id);
    SES.i++; SES.hechas++; SES.show = false;
    repintarSesion();
  },
  cerrarSesion: () => { SES = null; cerrarCapa(); },
  conectar: () => {
    const url = $('#cfg-url').value.trim(), token = $('#cfg-token').value.trim();
    if (url && !/^https:\/\/script\.google(usercontent)?\.com\//.test(url)) return toast('La URL tiene que ser la de Apps Script');
    const antes = esDemo();
    S.cfg.url = url; S.cfg.token = token; LS.set('sem:cfg', S.cfg);
    if (antes !== esDemo()) cargarLocal();
    if (!esDemo()) { toast('Conectando…'); sync(true); } else toast('Modo demo');
    render();
  },
  desconectar: () => { S.cfg.url = ''; S.cfg.token = ''; LS.set('sem:cfg', S.cfg); cargarLocal(); render(); toast('Modo demo'); },
  sincronizar: () => sync(true),
  nuevasDia: v => { S.cfg.nuevas = Math.max(0, Math.min(200, parseInt(v, 10) || 0)); LS.set('sem:cfg', S.cfg); badge(); }
};
function empezarSesion(lista) {
  if (!lista.length) return toast('No hay tarjetas para repasar');
  SES = { ids: lista.map(c => c.id), i: 0, show: false, hechas: 0, temas: new Set() };
  abrirCapa('sesion');
}
function repintarSesion() {
  const el = S.capas.find(c => c.dataset.tipo === 'sesion');
  if (el) { pintarCapa(el); el.scrollTop = 0; }
  badge();
}

/* ───────── Hoja: entrega ───────── */
function abrirEntrega(id) {
  const c = modelo().cal.find(x => x.id === id); if (!c) return;
  const a = asigDe(c.asignatura), e = S.data.entregas[id] || {}, letra = a.tipo_nota === 'letra', calc = calculo(a);
  const conPeso = ['ponderada', 'recuperacion'].includes(calc.tipo) && calc.items.includes(id);
  const pesoAct = conPeso ? pesos(calc.items)[calc.items.indexOf(id)] : null;
  let est = e.estado || (notaDe(id).tipo === 'nota' ? 'entregada' : 'pendiente'), le = e.letra || '';
  const fechas = [c.a ? 'Abre el ' + fDia(c.a) : '', c.c ? 'cierra el ' + fDia(c.c) : 'sin fecha'].filter(Boolean).join(' · ');
  abrirSheet(`<h3>${esc(a.abreviatura)} · ${esc(c.nombre)}</h3><div class="sub">${fechas}${c.peso_detalle ? ' · ' + esc(c.peso_detalle) : ''}</div>
  <div class="field"><label>Estado</label><div class="seg" id="e-st">${[['pendiente', 'Pendiente'], ['entregada', 'Entregada'], ['no_entregada', 'No entregada']].map(([v, l]) => `<button data-v="${v}" class="${est === v ? 'on' : ''}">${l}</button>`).join('')}</div></div>
  ${letra ? `<div class="field"><label>Nota</label><div class="letters" id="e-le">${['A', 'B', 'C+', 'C-', 'D'].map(l => `<button data-v="${l}" class="${le === l ? 'on' : ''}">${l}</button>`).join('')}</div></div>
  <div class="field"><label>Nota numérica (opcional, si la sabes)</label><input id="e-n" inputmode="decimal" value="${esc(e.nota || '')}" placeholder="Ej.: 6,5"></div>` :
    `<div class="field"><label>Nota (0 a 10)</label><input id="e-n" inputmode="decimal" value="${esc(String(e.nota || '').replace('.', ','))}" placeholder="Ej.: 7,5"></div>`}
  ${conPeso ? `<div class="field"><label>Peso en la nota final (%)</label><input id="e-p" inputmode="decimal" value="${e.peso ? nf(+e.peso * 100) : ''}" placeholder="${nf(pesoAct * 100)} (calculado)"></div>` : ''}
  ${!D(c.cierre) ? `<div class="field"><label>Fecha</label><input id="e-f" type="date" value="${esc(e.fecha || '')}"></div>` : ''}
  <button class="btn p w" style="margin-top:22px" id="e-ok">Guardar</button>`, w => {
    $$('#e-st button', w).forEach(b => b.onclick = () => { est = b.dataset.v; $$('#e-st button', w).forEach(x => x.classList.toggle('on', x === b)); });
    $$('#e-le button', w).forEach(b => b.onclick = () => { le = le === b.dataset.v ? '' : b.dataset.v; $$('#e-le button', w).forEach(x => x.classList.toggle('on', x.dataset.v === le)); if (le && est === 'pendiente') { est = 'entregada'; $$('#e-st button', w).forEach(x => x.classList.toggle('on', x.dataset.v === est)); } });
    $('#e-ok', w).onclick = () => {
      const nRaw = $('#e-n', w).value.trim(), n = numero(nRaw);
      if (nRaw && (n == null || n < 0 || n > 10)) return toast('La nota tiene que ir de 0 a 10');
      const datos = { estado: est, nota: n == null ? '' : String(n), letra: le };
      if ((n != null || le) && est === 'pendiente') datos.estado = 'entregada';
      if (est === 'no_entregada') { datos.nota = ''; datos.letra = ''; }
      const pi = $('#e-p', w);
      if (pi) { const p = numero(pi.value); if (pi.value.trim() && (p == null || p < 0 || p > 100)) return toast('El peso va de 0 a 100'); datos.peso = p == null ? '' : String(p / 100); }
      const fi = $('#e-f', w); if (fi) datos.fecha = fi.value;
      guardar('Entregas', id, datos);
      cerrarSheet(); render(); toast('Guardado');
    };
  });
}

/* ───────── Arranque ───────── */
async function iniciar() {
  try { const r = await fetch('semestre.json', { cache: 'no-cache' }); if (!r.ok) throw 0; S.sem = await r.json(); LS.set('sem:json', S.sem); }
  catch (e) { S.sem = LS.get('sem:json', null); }
  if (!S.sem) { document.body.innerHTML = '<div class="empty" style="padding-top:40vh">No se ha podido cargar semestre.json</div>'; return; }
  cargarLocal();
  pintarTabbar();
  tab('inicio');
  if (!esDemo()) sync(true);
  window.addEventListener('online', () => sync(true));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    invalidar();
    if (!S.capas.some(c => c.dataset.tipo === 'sesion')) render();
    sync(true);
  });
}
if ('serviceWorker' in navigator && window.isSecureContext) {
  const habia = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => {});
  let recargado = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (habia && !recargado) { recargado = true; location.reload(); } });
}
iniciar();
