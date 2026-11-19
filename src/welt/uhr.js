// Berlin City · zeit.js · Tag und Nacht: Spieluhr, Himmelsfarben, Dunkelheit, Lichter bei Nacht
// Ein Spieltag dauert 4 echte Stunden (eine Spielstunde = 10 echte Minuten). Die Uhr folgt der echten Zeit,
// darum ist für alle Spielerinnen gleichzeitig Tag oder Nacht. UHR.min zählt immer weiter, die Stunde ist min/60 modulo 24.
const UHR = { tagMs: 4 * 3600e3, min: 0, zuletzt: '' };
const UHR_VERSATZ = 635; /* Minuten, am 19.11.2026 so gestellt, dass es in Berlin gerade Mittag ist (für alle gleich) */ const uhrStellen = () => { UHR.min = Date.now() / UHR.tagMs * 1440 + UHR_VERSATZ }; uhrStellen();
const HIMMEL = [ // Stunde, vier Verlaufsfarben von oben nach unten, Dunkelheit über der Stadt
  [0, ['#0b0820', '#1a1238', '#2a1840', '#311a3a'], .52],
  [5, ['#141236', '#3a2a5e', '#6a3a6a', '#8a4a6a'], .4],
  [7, ['#2a2a5a', '#b06a8a', '#ffb38a', '#ffd6a0'], .12],
  [10, ['#4f8fd6', '#8cc4ee', '#d6ecff', '#f6efe0'], 0],
  [16, ['#5a8fd0', '#9cc6ec', '#f0e4d6', '#f8d6b0'], 0],
  [18.5, ['#2a1c40', '#9a4a7e', '#e9798f', '#f8b98c'], .08],
  [20.5, ['#140c2a', '#3a1d55', '#7a2f6a', '#b0506a'], .32],
  [24, ['#0b0820', '#1a1238', '#2a1840', '#311a3a'], .52]
];
const stunde = () => (UHR.min / 60) % 24;
function mischen(a, b, t) { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return 'rgb(' + x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(',') + ')' }
function himmelJetzt() { const h = stunde(); let i = 0; while (i < HIMMEL.length - 2 && HIMMEL[i + 1][0] <= h) i++; const a = HIMMEL[i], b = HIMMEL[i + 1], t = (h - a[0]) / (b[0] - a[0]);
  return { farben: a[1].map((c, k) => mischen(c, b[1][k], t)), dunkel: a[2] + (b[2] - a[2]) * t } }
let HIMMEL_JETZT = himmelJetzt();
function zeitWeiter(dt) { uhrStellen(); HIMMEL_JETZT = himmelJetzt(); uhrAnzeigen();
  // Energie sinkt in echter Zeit: etwa 10 Punkte pro Minute Laufen, weniger im Stehen
  if (typeof ST !== 'undefined') { const vorher = ST.energie ?? 80; ST.energie = Math.max(0, vorher - dt / 15 * (ICH && !ICH.idle ? 3 : 2)); if (vorher >= 15 && ST.energie < 15) toast('Wenig Energie: Kaffee, Massage oder Schlafen hilft') } }
function himmel() { const f = HIMMEL_JETZT.farben, sk = g.createLinearGradient(0, 0, 0, H); f.forEach((c, i) => sk.addColorStop([0, .5, .8, 1][i], c)); g.fillStyle = sk; g.fillRect(0, 0, W, H) }
// Nacht: Stadt abdunkeln, dann Laternen, Ampeln, Scheinwerfer und Fenster wieder aufleuchten lassen
function nacht() { const d = HIMMEL_JETZT.dunkel; if (d < .03) return;
  g.fillStyle = `rgba(16,8,40,${d})`; g.fillRect(0, 0, W, H);
  g.save(); g.globalCompositeOperation = 'lighter'; const a = Math.min(1, d * 2.2);
  for (const o of S) { if (o.k !== 'lamp') continue; const [x, y] = pt(o.x, o.y); if (x < -60 || x > W + 60 || y < -60 || y > H + 60) continue; const k = glut(o.c);
    g.globalAlpha = a; g.drawImage(k, x + 6 * Z - 20 * Z, y - 35 * Z - 20 * Z, 40 * Z, 40 * Z); g.globalAlpha = a * .7; g.drawImage(k, x - 30 * Z, y - 10 * Z, 64 * Z, 26 * Z) }
  for (const b of B) { if (b === INNEN || !b.pod.shops.length) continue; let za, zb; if (b.tow) { za = b.ph + 3; zb = b.ph + 2 * FH - 3 } else if (b.pod.fl >= 2) { za = GF + 2; zb = b.ph - PAR - 2 } else continue;
    for (const [side, u0, u1, br] of b.pod.shops) { if (!GLOW[br]) continue; const um = (u0 + u1) / 2, zc = (za + zb) / 2; const [x, y] = side === 'L' ? pt(b.x + um, b.y + 4, zc) : pt(b.x + 4, b.y + 4 - um, zc);
      if (x < -80 || x > W + 80 || y < -80 || y > H + 80) continue; g.globalAlpha = a * .55; const w = (u1 - u0) * 36 * Z; g.drawImage(glut(GLOW[br]), x - w * .7, y - w * .35, w * 1.4, w * .7) } }
  for (const c of CARS) { const [x, y] = pt(c.x, c.y, 4); if (x < -40 || x > W + 40 || y < -40 || y > H + 40) continue; g.globalAlpha = a * .8; g.drawImage(glut('#fff2d0'), x - 14 * Z, y - 8 * Z, 28 * Z, 16 * Z) }
  // Fenster: warme Punkte auf den Fassaden, fest je Gebäude
  g.globalAlpha = a * .55; const fk = glut('#ffd38a');
  for (const b of B) { if (b === INNEN) continue; const n = Math.min(18, Math.round(b.h / 14));
    for (let i = 0; i < n; i++) { const u = ((i * 37 + b.x * 11) % 36) / 10 + .2, z = 30 + ((i * 53 + b.y * 7) % Math.max(20, b.h - 40)); const [x, y] = (i % 2) ? pt(b.x + u, b.y + 4, z) : pt(b.x + 4, b.y + 4 - u, z);
      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue; g.drawImage(fk, x - 5 * Z, y - 4 * Z, 10 * Z, 8 * Z) } }
  g.restore() }
// Uhr oben rechts: Uhrzeit, Tageszeit und wann es wechselt (in echten Minuten)
const PHASEN = [[6, 'Morgen', '🌅'], [10, 'Tag', '☀️'], [18, 'Abend', '🌇'], [21, 'Nacht', '🌙']];
function uhrAnzeigen() { const t = uhrText(); if (t === UHR.zuletzt) return; UHR.zuletzt = t; const el = document.getElementById('uhr'); if (!el) return;
  const h = stunde(); let i = PHASEN.length - 1; for (let k = 0; k < PHASEN.length; k++) if (h >= PHASEN[k][0]) i = k;
  const nx = PHASEN[(i + 1) % PHASEN.length], bis = ((nx[0] - h + 24) % 24) * 10; // eine Spielstunde = 10 echte Minuten
  el.querySelector('i').textContent = PHASEN[i][2]; const bb = el.querySelector('b'), sp = document.createElement('span'); sp.textContent = PHASEN[i][1]; bb.replaceChildren(t, sp);
  el.querySelector('small').textContent = `${nx[1]} in ${bis >= 60 ? Math.floor(bis / 60) + ' Std. ' : ''}${Math.round(bis % 60)} Min.`; el.dataset.phase = PHASEN[i][1] }
function uhrText() { const h = Math.floor(stunde()), m = Math.floor(UHR.min % 60); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` }
