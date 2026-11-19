// Berlin · mitspieler.js · Echte Spieler sehen sich live in der Stadt. Austausch über einen öffentlichen MQTT-Server (HiveMQ, kostenlos, ohne Netlify).
// Jede Figur schickt 4 Mal pro Sekunde, wo sie steht. (Direkte Browserverbindung per Trystero/Nostr fand am 19.11.2026 keine Partner.)
// Angezeigt werden die anderen als echte Figuren (ECHT aus konto.js) an ihrer echten Position, mit grünem LIVE-Ring.
import mqtt from 'https://esm.sh/mqtt@5.10.1';
const THEMA = 'berlincity26/stadt/pos', AKTION = 'berlincity26/stadt/aktion';
let raum = null, senden = null;

function figurFuer(id, d) { let p = ECHT.get(id);
  if (!p) { p = Object.assign(human({}), { star: 1, echt: 1, s: 0, v: 0, ph: Math.random() * 6, sz: 1.08, lp: loop(PLAZA, .1) }); ECHT.set(id, p); P.push(p) }
  if (d.name) p.name = (d.kar ? d.kar + ' ' : '') + String(d.name).slice(0, 24);
  if (d.look) { const l = d.look; Object.assign(p, { skin: l.skin || p.skin, frisur: l.frisur, hair: l.hair || p.hair,
    c1: l.c1, c2: l.c2 != null ? l.c2 : p.c2, top: l.top || l.c1 || p.top, leg: l.leg || l.c2 || p.leg,
    dress: l.dress ? 1 : 0, outfit: l.outfit || null, muster: l.muster || null, acc: l.acc || [], bagK: l.bagK || null,
    w: l.frisur === 'kurz' ? 0 : 1 }); const k = JSON.stringify(l); if (k !== p.lookKey) { p.lookKey = k; p.neuKleiden = 1 } }
  if (!p.prof || !p.prof.name) p.prof = Object.assign({ handle: 'Echter Spieler', titel: 'Live in Berlin', lohn: 0, stil: 0, fol: 0, verm: 0, glow: 0 }, p.prof || {}, { name: p.name, p });
  return p }

function starten() { const ich = window.KONTO_ICH; if (!ich || raum) return;
  raum = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', { reconnectPeriod: 3000 });
  raum.on('connect', () => raum.subscribe(THEMA)); senden = d => { if (raum.connected) raum.publish(THEMA, JSON.stringify(d)) };
  raum.on('message', (t, roh) => { if (t === AKTION) return aktionErhalten(roh); let d; try { d = JSON.parse(roh.toString()) } catch (e) { return } if (!d || !d.id || d.id === ich.id) return; const p = figurFuer(d.id, d);
    if (!p.live) { p.x = d.x; p.y = d.y; letzte = 0; if (typeof toast === 'function') toast('● ' + p.name + ' ist live in der Stadt') }
    p.live = 1; p.zx = d.x; p.zy = d.y; p.liveZeit = Date.now(); p.idle = d.idle; p.drin = d.drin || ''; if (d.tanz && !((p.tanzBis || 0) > Date.now())) p.tanzBis = Date.now() + 3000 });
  raum.on('connect', () => raum.subscribe(AKTION));
  setInterval(senden_, 250) }

let letzte = 0, look = '';
function senden_() { if (!senden || typeof ICH === 'undefined') return; const ich = window.KONTO_ICH; if (!ich) return;
  const pr = (typeof ST !== 'undefined' && ST.profil) || {}; const d = { id: ich.id, name: pr.handle || ich.name, x: +ICH.x.toFixed(2), y: +ICH.y.toFixed(2), idle: ICH.idle ? 1 : 0, drin: raumName(), kar: typeof KARRIEREN !== 'undefined' && ST.karriere ? KARRIEREN[ST.karriere].ic : '', tanz: (ICH.tanzBis || 0) > Date.now() ? 1 : 0 };
  // Outfit kommt aus der eigenen Figur, damit jeder Kleiderwechsel sofort bei den anderen ankommt
  const jetzt = Object.assign({}, pr, { skin: ICH.skin || pr.skin, hair: ICH.hair || pr.hair, frisur: ICH.frisur || pr.frisur,
    c1: ICH.c1 || ICH.top || pr.c1, c2: ICH.c2 || ICH.leg, top: ICH.top, leg: ICH.leg, dress: ICH.dress ? 1 : 0,
    outfit: ICH.outfit || null, muster: ICH.muster || null, acc: ICH.acc || [], bagK: ICH.bagK || null });
  const l = JSON.stringify(jetzt); if (l !== look || Date.now() - letzte > 5000) { d.look = jetzt; look = l; letzte = Date.now() }
  senden(d) }

/* Figuren ohne Lebenszeichen seit 8 Sekunden gehen zurück in den normalen Rundgang */
setInterval(() => { for (const p of ECHT.values()) if (p.live && Date.now() - (p.liveZeit || 0) > 8000) p.live = 0 }, 2000);
const warte = setInterval(() => { if (window.KONTO_ICH) { clearInterval(warte); try { starten() } catch (e) { console.warn('Live', e) } } }, 1000);

/* ---------- Gemeinsam spielen: wer im selben Raum oder in der Nähe ist, bekommt Aktionen ---------- */
function raumName() { return typeof INNEN !== 'undefined' && INNEN ? (INNEN.title || 'innen') + '#' + (INNEN.stock || 0) : '' }
/* Für innen.js: echte Mitspieler im selben Gebäude und Stockwerk */
window.liveImRaum = b => { const r = raumName(); return r ? [...ECHT.values()].filter(p => p.live && p.drin === r) : [] };
const AKTIONEN = [
  { id: 'tanzen', k: '💃 Zusammen tanzen', ich: n => `Du tanzt mit ${n}`, du: n => `${n} tanzt mit dir`, tanz: 20, stil: 3, fol: 40 },
  { id: 'drink', k: '🥂 Drink ausgeben', ich: n => `Du gibst ${n} einen Drink aus (−25 €)`, du: n => `${n} gibt dir einen Drink aus 🥂`, kosten: 25, stil: 1, fol: 10 },
  { id: 'anstossen', k: '🍻 Anstoßen', ich: n => `Prost mit ${n}!`, du: n => `${n} stößt mit dir an 🍻`, fol: 15, stil: 1 },
  { id: 'reden', k: '💬 Ansprechen', ich: n => `Du sprichst ${n} an`, du: n => `${n} spricht dich an: „Na, auch hier? 😏“`, fol: 5 },
  { id: 'highfive', k: '🙌 High Five', ich: n => `High Five mit ${n}`, du: n => `${n}: High Five! 🙌`, fol: 5 },
  { id: 'umarmen', k: '🤗 Umarmen', ich: n => `Du umarmst ${n}`, du: n => `${n} umarmt dich 🤗`, stil: 1 },
  { id: 'geld', k: '💸 100.000 € schenken', ich: n => `Du schenkst ${n} 100.000 €`, du: n => `${n} schenkt dir 100.000 € 💸`, kosten: 100000, geschenk: 100000 },
  { id: 'selfie', k: '📸 Selfie zusammen', ich: n => `Selfie mit ${n} gepostet`, du: n => `${n} hat ein Selfie mit dir gepostet 📸`, fol: 60, stil: 2 }];
function wirkung(a, empfaenger) { if (typeof ST === 'undefined') return; if (a.tanz) { ICH.tanzBis = Date.now() + a.tanz * 1000; if (typeof PARTY !== 'undefined') PARTY.tanzBis = ICH.tanzBis }
  if (a.stil) ST.stil = (ST.stil || 0) + a.stil; if (a.fol) ST.follower = (ST.follower || 0) + a.fol; if (empfaenger && a.geschenk) ST.geld += a.geschenk; save(); hud() }
function aktionSenden(a, p, id) { const ich = window.KONTO_ICH; if (!raum || !raum.connected || !ich) return toast('Live-Verbindung fehlt noch');
  if (a.kosten && ST.geld < a.kosten) return toast('Dafür reicht dein Geld nicht'); if (a.kosten) ST.geld -= a.kosten;
  raum.publish(AKTION, JSON.stringify({ von: ich.id, vonName: (ST.profil && ST.profil.handle) || ich.name, an: id, a: a.id }));
  if (a.tanz) p.tanzBis = Date.now() + a.tanz * 1000; wirkung(a, false); toast(a.ich(p.name)); leisteZu() }
function aktionErhalten(roh) { let d; try { d = JSON.parse(roh.toString()) } catch (e) { return } const ich = window.KONTO_ICH; if (!ich || d.an !== ich.id) return;
  const a = AKTIONEN.find(x => x.id === d.a); if (!a) return; const p = ECHT.get(d.von); const n = (p && p.name) || d.vonName || 'Jemand';
  if (a.tanz && p) p.tanzBis = Date.now() + a.tanz * 1000; wirkung(a, true); if (typeof banner === 'function') banner('● LIVE', a.du(n), a.fol ? `+${a.fol} Follower` : ''); else toast(a.du(n)) }
/* Kleiner Knopf oben in der Mitte (unter der Leiste mit Happy Hour): „● Leon ist bei dir“. Erst Antippen klappt die Aktionen auf, nach einer Aktion klappt sie wieder zu. */
const leiste = document.createElement('div'); leiste.className = 'mitleiste'; leiste.hidden = true; document.body.append(leiste);
const css = document.createElement('style'); css.textContent = `.mitleiste{position:fixed;left:50%;transform:translateX(-50%);top:calc(150px + env(safe-area-inset-top,0px));z-index:44;font-family:var(--body);color:#fff;text-align:center}.mitleiste[hidden]{display:none}.mitleiste .pille{font:800 15px var(--body);padding:11px 18px;box-shadow:0 0 0 0 rgba(62,224,143,.6);animation:mitPuls 1.6s infinite;border-radius:999px;border:1px solid #3ee08f;background:rgba(14,12,20,.88);color:#3ee08f;cursor:pointer}.mitleiste .reihe{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:6px;padding:8px;border-radius:14px;background:rgba(14,12,20,.92);border:1px solid rgba(62,224,143,.5)}.mitleiste .reihe[hidden]{display:none}.mitleiste .reihe button{font:700 11px var(--body);padding:7px 8px;border-radius:10px;border:0;background:#ff4fa3;color:#fff;cursor:pointer;white-space:nowrap}`; css.textContent += '@keyframes mitPuls{0%{box-shadow:0 0 0 0 rgba(62,224,143,.6)}70%{box-shadow:0 0 0 12px rgba(62,224,143,0)}100%{box-shadow:0 0 0 0 rgba(62,224,143,0)}}.mitleiste .reihe button{font-size:13px;padding:9px 10px}'; document.head.append(css);
let leisteFuer = '', reiheEl = null; function leisteZu() { if (reiheEl) reiheEl.hidden = true }
setInterval(() => { const st = document.getElementById('start'); if (typeof ICH === 'undefined' || (st && !st.hidden) || document.querySelector('.login')) { leiste.hidden = true; leisteFuer = ''; return } const r = raumName();
  const nah = [...ECHT.entries()].filter(([, p]) => p.live && (r ? p.drin === r : !p.drin && Math.hypot(p.x - ICH.x, p.y - ICH.y) < 4)).sort((a, b) => Math.hypot(a[1].x - ICH.x, a[1].y - ICH.y) - Math.hypot(b[1].x - ICH.x, b[1].y - ICH.y))[0];
  if (!nah) { leiste.hidden = true; leisteFuer = ''; return } const [id, p] = nah; leiste.hidden = false; if (leisteFuer === id + p.name) return; leisteFuer = id + p.name;
  leiste.replaceChildren(); const k = document.createElement('button'); k.className = 'pille'; k.textContent = '● ' + p.name + ' ist bei dir · Tippen zum Interagieren ▾'; const reihe = document.createElement('div'); reihe.className = 'reihe'; reihe.hidden = true; reiheEl = reihe;
  k.onclick = () => { reihe.hidden = !reihe.hidden };
  for (const a of AKTIONEN) { const btn = document.createElement('button'); btn.textContent = a.k; btn.onclick = () => aktionSenden(a, p, id); reihe.append(btn) } leiste.append(k, reihe) }, 700);
