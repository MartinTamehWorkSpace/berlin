// Berlin · live.js · Echte Spieler sehen sich live in der Stadt. Die Browser verbinden sich direkt miteinander (WebRTC über Trystero,
// Vermittlung über öffentliche Nostr-Relays, kostenlos, ohne Netlify). Jede Figur schickt 4 Mal pro Sekunde, wo sie steht.
// Angezeigt werden die anderen als echte Figuren (ECHT aus konto.js) an ihrer echten Position, mit grünem LIVE-Ring.
import { joinRoom } from 'https://esm.sh/trystero@0.21.4/nostr';
const RAUM = { appId: 'berlin-city-stadt-2026' };
let raum = null, senden = null; const PEERS = new Map(); /* peerId -> Konto-ID */

function figurFuer(id, d) { let p = ECHT.get(id);
  if (!p) { p = Object.assign(human({}), { star: 1, echt: 1, s: 0, v: 0, ph: Math.random() * 6, sz: 1.08, lp: loop(PLAZA, .1) }); ECHT.set(id, p); P.push(p) }
  if (d.name) p.name = String(d.name).slice(0, 24);
  if (d.look) Object.assign(p, { skin: d.look.skin || p.skin, frisur: d.look.frisur, hair: d.look.hair || p.hair, c1: d.look.c1, top: d.look.c1 || p.top, w: d.look.frisur === 'kurz' ? 0 : 1 });
  return p }

function starten() { const ich = window.KONTO_ICH; if (!ich || raum) return;
  raum = joinRoom(RAUM, 'stadt'); const [sende, hoere] = raum.makeAction('pos'); senden = sende;
  hoere((d, peer) => { if (!d || !d.id || d.id === ich.id) return; PEERS.set(peer, d.id); const p = figurFuer(d.id, d);
    if (!p.live) { p.x = d.x; p.y = d.y; if (typeof toast === 'function') toast('● ' + p.name + ' ist live in der Stadt') }
    p.live = 1; p.zx = d.x; p.zy = d.y; p.liveZeit = Date.now(); p.idle = d.idle });
  raum.onPeerLeave(peer => { const id = PEERS.get(peer); PEERS.delete(peer); const p = id && ECHT.get(id); if (p) p.live = 0 });
  raum.onPeerJoin(() => { letzte = 0 });
  setInterval(senden_, 250) }

let letzte = 0, look = '';
function senden_() { if (!senden || typeof ICH === 'undefined') return; const ich = window.KONTO_ICH; if (!ich) return;
  const pr = (typeof ST !== 'undefined' && ST.profil) || {}; const d = { id: ich.id, name: pr.handle || ich.name, x: +ICH.x.toFixed(2), y: +ICH.y.toFixed(2), idle: ICH.idle ? 1 : 0 };
  const l = JSON.stringify(pr); if (l !== look || Date.now() - letzte > 5000) { d.look = pr; look = l; letzte = Date.now() }
  senden(d) }

/* Figuren ohne Lebenszeichen seit 8 Sekunden gehen zurück in den normalen Rundgang */
setInterval(() => { for (const p of ECHT.values()) if (p.live && Date.now() - (p.liveZeit || 0) > 8000) p.live = 0 }, 2000);
const warte = setInterval(() => { if (window.KONTO_ICH) { clearInterval(warte); try { starten() } catch (e) { console.warn('Live', e) } } }, 1000);
