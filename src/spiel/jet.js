// Berlin City · jet.js · Mit deinem Privatjet abheben: Ziel wählen, der Jet rollt und startet am Flughafen Tempelhoff, du bekommst Stil und Follower.
// Jedes Ziel einmal am Tag. Größere Jets bringen mehr (Faktor nach Jet-Typ).
const JETFLUG = { start: 0, id: null };
const JET_FAKTOR = { light: 1, mid: 1.6, long: 2.4, ultra: 3.5 };
const JET_ZIELE = [
  { id: 'mykonos', name: 'Mykonos', text: 'Beachclub, weiße Häuser, Sonnenuntergang. Deine Story geht viral.', stil: 30, fol: 600 },
  { id: 'tropez',  name: 'Saint-Tropez', text: 'Mittagessen am Hafen, Rosé auf der Yacht von Freunden.', stil: 40, fol: 800 },
  { id: 'dubai',   name: 'Dubai', text: 'Rooftop-Dinner, Wüstensafari, Shopping im Mall-Palast.', stil: 50, fol: 1100 },
  { id: 'aspen',   name: 'Aspen', text: 'Après-Ski im Pelzmantel, Kaminfeuer, sehr viel Champagner.', stil: 45, fol: 900 },
  { id: 'tulum',   name: 'Tulum', text: 'Yoga am Strand, Cenoten, Boho-Outfits für die ganze Woche.', stil: 35, fol: 700 }
];
function jetBesitz() { return WS.KATALOG.filter(i => i.kat === 'jet' && ST.besitz[i.id]).sort((a, b) => b.rang - a.rang)[0] || null }
function jetFliegen(z) { const j = jetBesitz(); if (!j) return; ST.jetFluege = ST.jetFluege || {}; const heute = new Date().toDateString(); if (ST.jetFluege[z.id] === heute) return;
  ST.jetFluege[z.id] = heute; const f = JET_FAKTOR[j.jet] || 1, stil = Math.round(z.stil * f), fol = Math.round(z.fol * f); ST.stil = (ST.stil || 0) + stil; ST.follower = (ST.follower || 0) + fol; xpGeben(stil * 2);
  JETFLUG.start = Date.now(); JETFLUG.id = j.id; cockpit(z.name); banner(`✈️ ${z.name.toUpperCase()}`, `Mit deinem ${j.name}: ${z.text}`, `+${stil} Stil · +${fol.toLocaleString('de-DE')} Follower`);
  if (typeof news === 'function') news(`${(ST.profil && ST.profil.handle) || 'Jemand'} ist gerade mit dem Privatjet nach ${z.name} geflogen ✈️`); save(); hud(); karten(); const wahl = document.getElementById('jetWahl'); if (wahl) wahl.hidden = true }
function jetZiele() { const j = jetBesitz(); if (!j) { toast('Kauf zuerst einen Jet im Terminal des Flughafen Tempelhoff'); return } let el = document.getElementById('jetWahl'); if (!el) { el = document.createElement('div'); el.id = 'jetWahl'; el.className = 'aufzugwahl'; document.body.append(el) }
  el.replaceChildren(); const k = document.createElement('b'); k.textContent = `✈️ ${j.name} · Wohin?`; el.append(k); const heute = new Date().toDateString(), f = JET_FAKTOR[j.jet] || 1;
  for (const z of JET_ZIELE) { const b = document.createElement('button'), weg = ST.jetFluege && ST.jetFluege[z.id] === heute; b.textContent = weg ? `${z.name} · heute schon geflogen` : `${z.name} · +${Math.round(z.stil * f)} Stil · +${Math.round(z.fol * f).toLocaleString('de-DE')} Follower`; b.disabled = weg; b.onclick = () => jetFliegen(z); el.append(b) }
  const zu = document.createElement('button'); zu.className = 'zu'; zu.textContent = 'Schließen'; zu.onclick = () => el.hidden = true; el.append(zu); el.hidden = false }
// Cockpit beim Start: Rahmen wie aus dem Cockpit, Geschwindigkeit und Höhe als Bänder, künstlicher Horizont, Ansagen. Läuft 16 Sekunden synchron zum Abflug.
function cockpit(ziel) { let el = document.getElementById('cockpit'); if (!el) { el = document.createElement('div'); el.id = 'cockpit'; el.className = 'cockpit'; document.body.append(el) }
  el.innerHTML = '<div class="ckrahmen"></div><div class="ckhorizont"><i></i></div><div class="ckband links"><small>KN</small><b>0</b></div><div class="ckband rechts"><small>FT</small><b>0</b></div><div class="ckansage"></div><div class="ckziel"></div>';
  el.hidden = false; const start = Date.now(), tempo = el.querySelector('.links b'), hoehe = el.querySelector('.rechts b'), hor = el.querySelector('.ckhorizont'), ans = el.querySelector('.ckansage'); el.querySelector('.ckziel').textContent = `GLOW 1 · Ziel ${ziel}`;
  const ANSAGEN = [[0, 'Triebwerke hochfahren'], [2, 'Schub setzen'], [6, 'V1'], [7, 'Rotate'], [9, 'Positive Climb · Fahrwerk ein'], [12, `Kurs auf ${ziel}`]];
  (function lauf() { const t = (Date.now() - start) / 1000; if (t > 16) { el.hidden = true; return }
    const kn = t < 2 ? 0 : t < 12 ? (t - 2) / 10 * 165 : 165 + (t - 12) * 18, ft = t < 7 ? 0 : t < 12 ? (t - 7) ** 2 * 22 : 550 + (t - 12) * 650;
    tempo.textContent = Math.round(kn); hoehe.textContent = Math.round(ft).toLocaleString('de-DE'); hor.style.transform = `translateY(${t < 7 ? 0 : Math.min(70, (t - 7) * 18)}px) rotate(${t > 11 ? Math.sin(t) * 3 : 0}deg)`;
    ans.textContent = ANSAGEN.filter(([a]) => t >= a).pop()[1]; el.style.opacity = t < .4 ? t / .4 : t > 15 ? 16 - t : 1; requestAnimationFrame(lauf) })() }
