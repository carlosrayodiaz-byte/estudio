/* Cada cambio en cualquier archivo: sube VERSION y sube también este archivo. */
const VERSION = 'semestre-v2';
const ARCHIVOS = [
  './',
  "KaTeX_AMS-Regular.woff2",
  "KaTeX_Caligraphic-Bold.woff2",
  "KaTeX_Caligraphic-Regular.woff2",
  "KaTeX_Fraktur-Bold.woff2",
  "KaTeX_Fraktur-Regular.woff2",
  "KaTeX_Main-Bold.woff2",
  "KaTeX_Main-BoldItalic.woff2",
  "KaTeX_Main-Italic.woff2",
  "KaTeX_Main-Regular.woff2",
  "KaTeX_Math-BoldItalic.woff2",
  "KaTeX_Math-Italic.woff2",
  "KaTeX_SansSerif-Bold.woff2",
  "KaTeX_SansSerif-Italic.woff2",
  "KaTeX_SansSerif-Regular.woff2",
  "KaTeX_Script-Regular.woff2",
  "KaTeX_Size1-Regular.woff2",
  "KaTeX_Size2-Regular.woff2",
  "KaTeX_Size3-Regular.woff2",
  "KaTeX_Size4-Regular.woff2",
  "KaTeX_Typewriter-Regular.woff2",
  "app.js",
  "demo.js",
  "fsrs.js",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "index.html",
  "katex-auto-render.min.js",
  "katex.min.css",
  "katex.min.js",
  "manifest.json",
  "manrope-ext.woff2",
  "manrope.woff2",
  "semestre.json",
  "styles.css",
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS.map(u => new Request(u, { cache: 'reload' })))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* Red primero: si hay conexión siempre sirve lo último; sin conexión, lo guardado. */
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }).then(r => {
      if (r.ok) { const copia = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copia)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./')))
  );
});
