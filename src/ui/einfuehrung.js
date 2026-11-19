// Berlin · einfuehrung.js · Einführung beim ersten Start: eine Karte über der Leiste führt Schritt für Schritt durch Klinik, Stadt und Chat.
// Schritte mit Bedingung gehen von selbst weiter, sobald man es gemacht hat; der passende Knopf leuchtet. Überspringen geht jederzeit.
// Wer schon behandelt hat, sieht die Einführung nie. Fertig steht in ST.intro.
const INTRO = [
  { titel: 'Willkommen in Berlin', text: 'Berlin gehört dem, der es sich nimmt. Am Alexanderplatz wählst du deine Karriere: Dealer, Gastro-Boss oder Influencer.', knopf: 'Los geht’s' },
  { titel: 'Deine Karriere', text: 'Tipp unten auf Karriere und such dir deinen Weg aus. Jede Karriere hat eigene Missionen und Ränge.', zeig: '#bKlinik', fertig: () => !!ST.karriere },
  { titel: 'Die Missionen', text: 'Oben rechts siehst du deinen Rang. Tipp darauf, dann siehst du deine nächste Mission. An den richtigen Orten erscheint unten ein Knopf.', knopf: 'Weiter' },
  { titel: 'Die Stadt', text: 'Mit Wohin? kommst du überall hin: Berghain, Scorpius, Fernsehturm, Spree. Echte Spieler tragen einen grünen Ring und LIVE.', zeig: '#bStadt', knopf: 'Weiter' },
  { titel: 'Sag Hallo', text: 'Im Stadt-Chat schreibst du mit allen. Viel Spaß in Berlin!', zeig: '#bChat', knopf: 'Fertig' }
];
function introZeigen() { const n = ST.intro; let el = document.getElementById('intro'); if (n == null || n >= INTRO.length || n === 'fertig') { if (el) el.hidden = true; introLeuchten(null); return }
  const s = INTRO[n]; if (!el) { el = document.createElement('div'); el.id = 'intro'; el.className = 'intro'; document.body.append(el) }
  el.replaceChildren(el_('small', 'introschritt', `Einführung · ${n + 1} von ${INTRO.length}`), el_('b', null, s.titel), el_('p', null, s.text));
  const reihe = el_('div', 'introknoepfe'), weg = el_('button', 'introweg', 'Überspringen'); weg.onclick = () => { ST.intro = 'fertig'; save(); introZeigen() }; reihe.append(weg);
  if (s.knopf) { const b = el_('button', 'cta', s.knopf); b.onclick = () => { ST.intro = n + 1; save(); introZeigen() }; reihe.append(b) }
  el.append(reihe); el.hidden = false; introLeuchten(s.zeig) }
let INTRO_ZIEL = null;
function introLeuchten(sel) { if (INTRO_ZIEL) INTRO_ZIEL.classList.remove('introzeig'); INTRO_ZIEL = sel ? document.querySelector(sel) : null; if (INTRO_ZIEL) INTRO_ZIEL.classList.add('introzeig') }
// Läuft im Hintergrund: startet nach dem Startbildschirm, geht bei erledigten Schritten weiter, hält das Leuchten am richtigen Knopf
setInterval(() => { if (!document.getElementById('start').hidden) return;
  if (ST.intro == null) { ST.intro = klinikStand().behandelt > 0 ? 'fertig' : 0; save() }
  if (ST.intro === 'fertig' || ST.intro >= INTRO.length) { const el = document.getElementById('intro'); if (el && !el.hidden) introZeigen(); return }
  const s = INTRO[ST.intro]; if (s.fertig && s.fertig()) { ST.intro++; save(); introZeigen(); return }
  const el = document.getElementById('intro'); if (!el || el.hidden) introZeigen(); else if (s.zeig && (!INTRO_ZIEL || !INTRO_ZIEL.isConnected)) introLeuchten(s.zeig) }, 700);
