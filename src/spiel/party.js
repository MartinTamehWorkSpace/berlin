// Berlin · party.js · Scorpius Berlin, unser Beachclub (Konkurrenz: Berghain). Wer auf dem Deck steht, sieht einen Knopf „🌴 Scorpius Berlin“.
// Antippen klappt das Programm auf: mittanzen, in den Pool springen, Champagner-Dusche, ans DJ-Pult, VIP-Cabana. Jede Aktion hat eine eigene Pause,
// damit sie etwas Besonderes bleibt. Nach einer Aktion klappt das Programm wieder zu.
const PARTY = { tanzBis: 0, offen: false, pausen: {} };
const NICKY = [
  { id: 'tanzen', k: '💃 Mittanzen', tanz: 15, pause: 300, fol: 300, stil: 5, xp: 20, text: 'Alle haben dich tanzen sehen' },
  { id: 'pool', k: '🏊 In den Pool springen', tanz: 0, pause: 120, fol: 120, stil: 2, xp: 10, text: 'Platsch! Dein Sprung geht viral' },
  { id: 'champagner', k: '🍾 Champagner-Dusche', kosten: 50000, tanz: 10, pause: 600, fol: 900, stil: 12, xp: 40, text: 'Champagner für das ganze Deck' },
  { id: 'dj', k: '🎧 Ans DJ-Pult', tanz: 30, pause: 900, fol: 1500, stil: 15, xp: 60, text: 'Dein Set bringt das Deck zum Kochen' },
  { id: 'cabana', k: '👑 VIP-Cabana mieten', kosten: 100000, tanz: 0, pause: 1800, fol: 600, stil: 25, xp: 50, text: 'Goldene Cabana, Vorhänge zu, nur für dich' }];
const partyNah = () => !INNEN && !ICH.faehrt && !(typeof MEINBOOT !== 'undefined' && MEINBOOT.an) && ICH.x > 33.3 && ICH.x < 41.5 && ICH.y > 39.5 && ICH.y < 46.5;
function nickyAktion(a) { const jetzt = Date.now(); if (!partyNah() || jetzt < (PARTY.pausen[a.id] || 0)) return; if (a.kosten && ST.geld < a.kosten) return toast('Dafür reicht dein Geld nicht');
  if (a.kosten) ST.geld -= a.kosten; PARTY.pausen[a.id] = jetzt + a.pause * 1000; PARTY.offen = false; ICH.path = [];
  if (a.tanz) { PARTY.tanzBis = jetzt + a.tanz * 1000; ICH.tanzBis = PARTY.tanzBis } toast(a.k + ' 🌴');
  setTimeout(() => { ST.follower = (ST.follower || 0) + a.fol; ST.stil = (ST.stil || 0) + a.stil; xpGeben(a.xp); save(); hud(); karten(); banner('SCORPIUS', a.text, `+${a.fol} Follower · +${a.stil} Stil`) }, Math.max(1500, a.tanz * 1000)) }
function partyWeiter() { const leiste = aktionsLeiste(), karte = document.getElementById('card'); leiste.hidden = !!(karte && !karte.hidden) || !!INNEN || (typeof KLINIK !== 'undefined' && KLINIK.offen);
  let k = document.getElementById('bTanzen'), menue = document.getElementById('nickyMenue'); const nah = partyNah();
  if (!k) { k = document.createElement('button'); k.id = 'bTanzen'; k.className = 'anlegen'; k.onclick = () => { PARTY.offen = !PARTY.offen; partyWeiter() }; leiste.append(k);
    menue = document.createElement('div'); menue.id = 'nickyMenue'; menue.style.cssText = 'flex-basis:100%;width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:6px;margin-top:6px'; leiste.style.flexWrap = 'wrap'; leiste.append(menue) }
  k.hidden = !nah; menue.hidden = !nah || !PARTY.offen; if (!nah) { PARTY.offen = false; return }
  const tanzt = Date.now() < PARTY.tanzBis; k.textContent = tanzt ? '💃 Du feierst …' : PARTY.offen ? '🌴 Scorpius Berlin ▴' : '🌴 Scorpius Berlin ▾'; if (!PARTY.offen) return;
  if (menue.children.length !== NICKY.length) { menue.replaceChildren(...NICKY.map(a => { const b = document.createElement('button'); b.className = 'anlegen'; b.style.whiteSpace = 'nowrap'; b.dataset.id = a.id; b.onclick = () => nickyAktion(a); return b })) }
  for (const b of menue.children) { const a = NICKY.find(x => x.id === b.dataset.id), rest = Math.ceil(((PARTY.pausen[a.id] || 0) - Date.now()) / 1000);
    b.disabled = tanzt || rest > 0; b.textContent = rest > 0 ? `${a.k.split(' ')[0]} wieder in ${dauer(rest)}` : a.k + (a.kosten ? ` · ${euro(a.kosten)}` : '') } }
