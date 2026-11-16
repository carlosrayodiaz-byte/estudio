/* FSRS-5 (repaso espaciado) con los parámetros por defecto. Notas: 1 otra vez, 2 difícil, 3 bien, 4 fácil. */
'use strict';
const FSRS = (() => {
  const w = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192,
    1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621];
  const DECAY = -0.5, FACTOR = 19 / 81, RETENCION = 0.9, MAX_DIAS = 365, OTRA_VEZ_MIN = 10;
  const clampD = d => Math.min(10, Math.max(1, d));
  const D0 = g => clampD(w[4] - Math.exp(w[5] * (g - 1)) + 1);
  const S0 = g => Math.max(0.1, w[g - 1]);
  const R = (t, s) => Math.pow(1 + FACTOR * t / s, DECAY);
  const dias = s => Math.min(MAX_DIAS, Math.max(1, Math.round(s / FACTOR * (Math.pow(RETENCION, 1 / DECAY) - 1))));
  const nuevaD = (d, g) => clampD(w[7] * D0(4) + (1 - w[7]) * (d - w[6] * (g - 3) * (10 - d) / 9));
  const sExito = (d, s, r, g) => s * (Math.exp(w[8]) * (11 - d) * Math.pow(s, -w[9]) * (Math.exp(w[10] * (1 - r)) - 1)
    * (g === 2 ? w[15] : 1) * (g === 4 ? w[16] : 1) + 1);
  const sFallo = (d, s, r) => Math.min(s, w[11] * Math.pow(d, -w[12]) * (Math.pow(s + 1, w[13]) - 1) * Math.exp(w[14] * (1 - r)));
  const sMismoDia = (s, g) => s * Math.exp(w[17] * (g - 3 + w[18]));

  function repasar(st, g, ahora = new Date()) {
    let s, d, reps = +(st && st.reps) || 0, lapses = +(st && st.lapses) || 0;
    if (!st || !st.s) { s = S0(g); d = D0(g); }
    else {
      s = +st.s; d = +st.d;
      const t = Math.max(0, (ahora - new Date(st.last)) / 864e5);
      if (t < 1) s = sMismoDia(s, g);
      else { const r = R(t, s); s = g === 1 ? sFallo(d, s, r) : sExito(d, s, r, g); }
      if (g === 1) lapses++;
      d = nuevaD(d, g);
    }
    reps++;
    let due;
    if (g === 1) due = new Date(ahora.getTime() + OTRA_VEZ_MIN * 60000);
    else { due = new Date(ahora); due.setHours(4, 0, 0, 0); due.setDate(due.getDate() + dias(s)); }
    return { s: +s.toFixed(4), d: +d.toFixed(4), reps, lapses, last: ahora.toISOString(), due: due.toISOString() };
  }

  function etiqueta(st, g, ahora = new Date()) {
    if (g === 1) return OTRA_VEZ_MIN + ' min';
    const n = repasar(st, g, ahora);
    const d = Math.round((new Date(n.due) - ahora) / 864e5);
    if (d < 1) return '1 d';
    if (d < 30) return d + ' d';
    if (d < 365) return Math.round(d / 30) + ' m';
    return '1 a';
  }

  return { repasar, etiqueta };
})();
