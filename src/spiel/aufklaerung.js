// Berlin · aufklaerung.js · Aufklärungsblatt zu jeder Behandlung (antippen in Liege oder Wartezimmer) und Merkblätter von Kongressen.
// Die Inhalte stehen in src/daten/aufklaerung.js.
const AUF = window.GLOW_AUFKLAERUNG;
const HINWEIS = 'Das ist keine medizinische Empfehlung. Alle Angaben sind allgemeine Information. Bitte kläre jede Behandlung persönlich mit deiner Ärztin oder deinem Arzt ab.';
function blattZeigen(kopf, titel, abschnitte, fuss) { let el = document.getElementById('blatt'); if (!el) { el = document.createElement('div'); el.id = 'blatt'; el.className = 'blatt'; document.body.append(el) }
  el.replaceChildren(); const zu = el_('button', 'bzu', '×'); zu.setAttribute('aria-label', 'Schließen'); zu.onclick = () => el.hidden = true;
  el.append(zu, el_('small', 'bkopf', kopf), el_('h3', null, titel));
  for (const [t, inhalt] of abschnitte) { if (!inhalt) continue; el.append(el_('h5', null, t)); if (Array.isArray(inhalt)) { const ul = el_('ul'); for (const x of inhalt) ul.append(el_('li', null, x)); el.append(ul) } else el.append(el_('p', null, inhalt)) }
  if (fuss) el.append(el_('p', 'bfuss', fuss)); el.hidden = false; el.scrollTop = 0 }
function behandlungInfo(id, name) { const b = behandlung(id), a = AUF.BEHANDLUNGEN[id]; if (!b || !a) return;
  blattZeigen(`${b.icon} Aufklärung${name ? ' · ' + name : ''}`, b.name, [['Was gemacht wird', a.was], ['Material', a.material], ['Ablauf', a.ablauf], ['Wie lange es hält', a.haelt], ['Ausfallzeit', a.ausfall], ['Risiken', a.risiken], ['Danach', a.nachsorge]], HINWEIS) }
function merkblattZeigen(id) { const kg = KQ.KONGRESSE.find(x => x.id === id), m = AUF.KONGRESSE[id]; if (!kg || !m) return;
  blattZeigen(`${kg.icon} Merkblatt · ${kg.ort}`, m.thema, [['Was du mitnimmst', m.punkte]], `${kg.name}. ${HINWEIS}`) }
// Merkblatt nach der Rückkehr sammeln und zeigen
function merkblattMerken(k, id) { k.merkblaetter = k.merkblaetter || []; if (!k.merkblaetter.includes(id)) k.merkblaetter.push(id); if (typeof KLINIK !== 'undefined' && KLINIK.offen) setTimeout(() => merkblattZeigen(id), 1500) }
