// Glow City · events.js · Live-Events mit Zeitdruck: Flash-Sale, Happy Hour, Promi-Sichtung
// Alle 90 bis 150 Sekunden startet ein Event. Neue Events sind ein Eintrag in EVENT_ARTEN.
const EVENT_ARTEN = [
  { id: 'sale',  dauer: 120, start() { const l = ['zahra', 'sac', 'tif', 'prado', 'lulu'][Math.floor(Math.random() * 5)]; return { laden: l, faktor: .7, titel: `FLASH SALE · ${BR[l].n} −30 %` } } },
  { id: 'happy', dauer: 100, start() { const l = ['riva', 'borch', 'hug', 'nicky', 'star'][Math.floor(Math.random() * 5)]; return { laden: l, faktor: .5, titel: `HAPPY HOUR · ${BR[l].n} −50 %` } } },
  { id: 'promi', dauer: 90,  start() { const c = ['valentina', 'mila', 'kerem', 'sasha'][Math.floor(Math.random() * 4)]; const p = CHAR_P.find(q => q.charId === c) || CHAR_P[0];
      const b = B.filter(x => !x.top && x.pod.shops.length)[Math.floor(Math.random() * 12)]; const [tx, ty] = tuer(b); return { promi: p, x: tx, y: ty, b, titel: `${p.name.split(' ')[0].toUpperCase()} GESICHTET · vor ${b.title}` } } }
];
let EVENT = null, naechstesEvent = 25;
// Preis mit laufendem Rabatt
function preisVon(it) { if (EVENT && EVENT.laden && (it.laden === EVENT.laden || (EVENT.laden === 'sac' && it.kat === 'tasche'))) return Math.round(it.preis * EVENT.faktor * 100) / 100; return it.preis }
function eventsWeiter(dt) {
  if (EVENT) { EVENT.rest -= dt;
    if (EVENT.promi) { const p = EVENT.promi; p.x = EVENT.x + Math.sin(T) * .3; p.y = EVENT.y + .3;
      if (!EVENT.selfie && Math.hypot(ICH.x - p.x, ICH.y - p.y) < 1.4) { EVENT.selfie = true; const f = 300 + Math.round(ST.stil / 20); ST.follower = (ST.follower || 0) + f; ST.stil += 15; save(); hud(); banner('SELFIE MIT ' + p.name.split(' ')[0].toUpperCase(), 'Das Foto geht gerade viral', `+${f} Follower · +15 Stil`); setTimeout(() => ereignis('foto')) } }
    if (EVENT.rest <= 0) { if (EVENT.promi) EVENT.promi.lp && (EVENT.promi.prom = 0); EVENT = null; tickerZeigen() } else tickerZeigen()
    return }
  naechstesEvent -= dt; if (naechstesEvent > 0) return; naechstesEvent = 90 + Math.random() * 60;
  const art = EVENT_ARTEN[Math.floor(Math.random() * EVENT_ARTEN.length)]; EVENT = Object.assign({ art: art.id, rest: art.dauer, dauer: art.dauer }, art.start());
  if (EVENT.promi) { EVENT.promi.lpAlt = EVENT.promi.lp } tickerZeigen(); toast(EVENT.titel);
  if (offen) zeigeEtage(offen) }
// Promi läuft während des Events zum Ort statt im Kreis
function promiZiel(p) { return EVENT && EVENT.promi === p }
function tickerZeigen() { const el = document.getElementById('ticker'); if (!EVENT) { el.hidden = true; return }
  const m = Math.max(0, Math.ceil(EVENT.rest)); el.hidden = false; el.querySelector('b').textContent = EVENT.titel; el.querySelector('em').textContent = `noch ${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  el.querySelector('i').style.width = (EVENT.rest / EVENT.dauer * 100) + '%' }
document.getElementById('ticker').onclick = () => { if (!EVENT || INNEN) return;
  if (EVENT.promi) { laufeZu(EVENT.x, EVENT.y + .6, null); return }
  const b = B.find(x => x.pod.shops.some(s => s[3] === EVENT.laden) || (EVENT.laden === 'sac' && x.title === 'Maison du Sac')); if (b) { const [tx, ty] = tuer(b); laufeZu(tx, ty, b) } }
// Markierung am Promi: pulsierender Ring und Stern auf der Karte
function eventZeichnen() { if (!EVENT || !EVENT.promi) return; const [x, y] = pt(EVENT.promi.x, EVENT.promi.y); const r = (12 + Math.sin(T * 5) * 3) * Z;
  g.strokeStyle = '#ffd166'; g.lineWidth = 2 * Z; g.beginPath(); g.ellipse(x, y, r, r * .5, 0, 0, 7); g.stroke();
  g.fillStyle = '#ffd166'; g.font = `800 ${11 * Z}px Inter`; g.textAlign = 'center'; g.fillText('★', x, y - 42 * Z) }
