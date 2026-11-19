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
  let k = document.getElementById('bTanzen'); const nah = partyNah(); const alt = document.getElementById('nickyMenue'); if (alt) alt.remove();
  if (!k) { k = document.createElement('button'); k.id = 'bTanzen'; k.className = 'anlegen'; k.textContent = '🌴 Ins Scorpius'; k.onclick = () => { const b = B.find(x => x.title === 'Scorpius Berlin'); if (b) betreten(b) }; leiste.append(k) }
  k.hidden = !nah }

/* Yachtclub Spreeblick: hier kauft man Boote (vorher im Scorpius, Martin 19.11.2026: zu viel neben den Club-Aktionen) */
function yachtclubZeigen() { const cb = panel('⚓ Yachtclub Spreeblick · Boote kaufen'); const p = document.createElement('p'); p.className = 'hin'; p.textContent = 'Pfahlbau an der Spree, eigene Liegeplätze. Dein Boot liegt danach am Steg.'; cb.append(p);
  const box = document.createElement('div'); box.style.cssText = 'display:flex;flex-direction:column;gap:5px;margin-top:6px'; box.append(...WS.KATALOG.filter(VERKAUF.yacht).sort((a, c) => a.rang - c.rang).map(zeile)); cb.append(box) }
