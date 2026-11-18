// Glow City · party.js · Mittanzen bei der Pool-Party von Nicky Beach. Wer in der Nähe ist, sieht den Knopf, tanzt 15 Sek. und bekommt Follower, Stil und XP.
// Danach 10 Min. Pause, damit es etwas Besonderes bleibt.
const PARTY = { tanzBis: 0, naechste: 0, dauer: 15, pause: 600, follower: 300, stil: 5 };
const partyNah = () => !INNEN && !ICH.faehrt && !(typeof MEINBOOT !== 'undefined' && MEINBOOT.an) && ICH.x > 33.3 && ICH.x < 41.5 && ICH.y > 39.5 && ICH.y < 46.5;
function mittanzen() { const jetzt = Date.now(); if (!partyNah() || jetzt < PARTY.naechste) return; PARTY.tanzBis = jetzt + PARTY.dauer * 1000; PARTY.naechste = jetzt + PARTY.pause * 1000; ICH.path = [];
  toast('Du tanzt bei der Pool-Party 💃'); setTimeout(() => { ST.follower = (ST.follower || 0) + PARTY.follower; ST.stil = (ST.stil || 0) + PARTY.stil; xpGeben(20); save(); hud(); karten(); banner('POOL-PARTY', 'Alle haben dich tanzen sehen', `+${PARTY.follower} Follower · +${PARTY.stil} Stil`) }, PARTY.dauer * 1000) }
function partyWeiter() { const leiste = aktionsLeiste(), karte = document.getElementById('card'); leiste.hidden = !!(karte && !karte.hidden) || !!INNEN || (typeof KLINIK !== 'undefined' && KLINIK.offen); let k = document.getElementById('bTanzen'); const nah = partyNah(), tanzt = Date.now() < PARTY.tanzBis;
  if (!k) { k = document.createElement('button'); k.id = 'bTanzen'; k.className = 'anlegen'; k.onclick = mittanzen; aktionsLeiste().append(k) }
  k.hidden = !nah; if (!nah) return; const rest = Math.ceil((PARTY.naechste - Date.now()) / 1000);
  k.disabled = tanzt || rest > 0; k.textContent = tanzt ? '💃 Du tanzt …' : rest > 0 ? `💃 Wieder in ${dauer(rest)}` : '💃 Mittanzen' }
