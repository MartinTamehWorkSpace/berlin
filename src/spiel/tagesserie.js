// Berlin · tagesserie.js · Tagesbonus: sieben Tage am Stück, steigendes Geld, an Tag 7 15.000 €
// Einmal pro Kalendertag abholen. Wer einen Tag auslässt, fängt wieder bei Tag 1 an.
const SERIE_LOHN = [
  { text: '1.000 €', geben: () => { ST.geld += 1000 } },
  { text: '80 XP', geben: () => xpGeben(80) },
  { text: '2.000 €', geben: () => { ST.geld += 2000 } },
  { text: '3.000 €', geben: () => { ST.geld += 3000 } },
  { text: '200 XP', geben: () => xpGeben(200) },
  { text: '6.000 €', geben: () => { ST.geld += 6000 } },
  { text: '15.000 €', geben: () => { ST.geld += 15000; xpGeben(300) } }
];
function serieStand() { const h = heute(), k = ST.kal || { tag: null, n: 0 }; if (k.tag === h) return { heute: false, n: k.n, k };
  const gestern = k.tag && Date.parse(h) - Date.parse(k.tag) <= 864e5 * 1.5; return { heute: true, n: gestern && k.n < 7 ? k.n : 0, gerissen: !!k.tag && !gestern && k.n > 0, k } }
function serieZeigen(danach) { const s = serieStand(); if (!s.heute) return danach && danach(); const reihe = el_('div', 'kal');
  SERIE_LOHN.forEach((l, i) => { const d = el_('div', 'kt' +(i < s.n ? ' hat' : i === s.n ? ' jetzt' : '') + (i === 6 ? ' ikone' : '')); d.append(el_('small', null, `Tag ${i + 1}`), el_('b', null, i < s.n ? '✓' : l.text)); reihe.append(d) });
  karteZeigen({ kopf: s.gerissen ? 'NEUE SERIE' : 'TAGESBONUS', titel: `Tag ${s.n + 1} von 7`, sub: s.gerissen ? 'Gestern warst du nicht da, die Serie beginnt neu.' : 'Komm jeden Tag, an Tag 7 gibt es 15.000 €.', inhalt: reihe,
    unter: `Heute: ${SERIE_LOHN[s.n].text}`, farbe: s.n === 6 ? '#e6c76a' : '#ff8fc7', knopf: 'Abholen', danach: () => { ST.kal = { tag: heute(), n: s.n + 1 }; SERIE_LOHN[s.n].geben(); if (s.n === 6) ST.kal.n = 7; save(); hud(); if (danach) setTimeout(danach, 600) } }) }
// Erst zeigen, wenn die Spielerin in der Stadt ist (Startbildschirm zu)
(function warteAufStadt() { if (document.getElementById('start').hidden) serieZeigen(boutiqueWillkommen); else setTimeout(warteAufStadt, 1000) })();
