# Semestre · instalación paso a paso

App de estudio para el iPhone: entregas, notas, temario con etiquetas, tarjetas con repaso espaciado y ejercicios. PWA en GitHub Pages, datos en Google Sheet + Apps Script y material de estudio en una carpeta de Drive.

## 1. Google Sheet y Apps Script (la misma cuenta de Google que Gastos)

1. En Google Drive: **Nuevo → Hojas de cálculo de Google**. Llámala `Semestre`.
2. En la hoja: **Extensiones → Apps Script**. Borra lo que haya, pega el contenido de `Code.gs` y guarda (icono del disquete).
3. Arriba, en el desplegable de funciones, elige `setup` y pulsa **Ejecutar**. Acepta los permisos (pide Hojas y Drive).
4. Abajo, en el **Registro de ejecución**, copia el `TOKEN`. `setup` también crea en tu Drive la carpeta **Semestre estudio**, que es donde irá el material.
5. **Implementar → Nueva implementación** → tipo **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
   Pulsa **Implementar** y copia la URL que termina en `/exec`.

## 2. GitHub

1. Crea un repositorio **público** llamado `semestre` en tu cuenta `carlosrayodiaz-byte`.
2. **Add file → Upload files** y arrastra **todos los archivos sueltos** del zip (no la carpeta). **Commit changes**.
3. **Settings → Pages** → Branch `main` y carpeta `/ (root)` → **Save**.
4. En uno o dos minutos estará en `https://carlosrayodiaz-byte.github.io/semestre/`.

`Code.gs` y `LEEME.md` pueden ir al repo sin problema: no llevan el token.

## 3. iPhone

1. Abre la URL en **Safari** → **Compartir → Añadir a pantalla de inicio**.
2. Abre la app. Arranca en **modo demo** con datos de ejemplo.
3. En **Hoy**, toca el icono de ajustes (arriba a la derecha), pega la **URL** y el **token** y pulsa **Guardar y conectar**. Lo que hayas tocado en el modo demo no se sube: empiezas limpio.

## 4. Primer uso

- En **Hoy** te saldrá un aviso con las entregas que ya han cerrado y no tienen estado. Tócalo y marca cada una: entregada (con su nota o letra), no entregada o pendiente.
- Las asignaturas con nota en letra (HE, IM, AXSE) aceptan la letra y, si la sabes, la nota numérica. Con solo la letra, la app calcula con el mínimo del tramo (C+ = 5) para que el cálculo no te dé más margen del que tienes.
- En IM y AXSE puedes corregir el peso de cada PAC desde la propia entrega cuando lo publiquen en el aula.

## 5. Material de estudio

1. Pásale a Claude, en el proyecto WEBS_APPS, el PDF de un módulo (uno por chat).
2. Claude genera `estudio-<módulo>.json` (resumen, tarjetas y ejercicios de cada tema, en catalán) y lo deja en la carpeta **Semestre estudio** de tu Drive.
3. Abre la app: lo descarga sola al abrirse. También puedes forzarlo en **Ajustes → Sincronizar**.

Si algún día lo subes tú a mano, basta con arrastrar el `.json` a esa carpeta de Drive. Si un archivo tiene un error, Ajustes te dice cuál.

## 6. Cambiar de semestre

Sustituye `semestre.json` en GitHub por el del semestre nuevo y sube también `sw.js` con la `VERSION` subida. El progreso de cada semestre se guarda aparte en la Sheet (columna `semestre`).

## 7. Actualizaciones

- Cualquier cambio en un archivo implica subir `VERSION` en `sw.js` y subir también `sw.js`.
- Si cambias `Code.gs`: **Implementar → Gestionar implementaciones → editar (lápiz) → Versión: Nueva versión → Implementar**. Así la URL no cambia.
- En el iPhone, para ver la versión nueva: cierra la app del todo y ábrela dos veces.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html`, `styles.css`, `app.js` | La app |
| `fsrs.js` | Repaso espaciado de las tarjetas (FSRS-5) |
| `demo.js` | Datos de ejemplo del modo demo |
| `semestre.json` | Plan docente, calendario y temario del semestre |
| `sw.js`, `manifest.json`, `icon-*.png` | Instalación en el iPhone y uso sin conexión |
| `katex*.js`, `katex.min.css`, `KaTeX_*.woff2` | Fórmulas (KaTeX, licencia MIT) |
| `manrope*.woff2` | Tipografía Manrope (licencia SIL OFL) |
| `Code.gs` | Apps Script (va en la Sheet, no en GitHub) |
