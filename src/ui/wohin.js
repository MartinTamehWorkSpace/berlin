// Berlin · wohin.js · Knopf „Wohin?“ in der Leiste: alle Orte der Stadt als große Kacheln nach Thema.
// Antippen: Kamera fliegt hin, du gehst oder fährst los (Auto, Uber oder zu Fuß wie beim Antippen eines Hauses).
const WOHIN = [
  ['Karriere', [['@uhr', '🕰️', 'Weltzeituhr · Karriere'], ['@ort:goerli', '💊', 'Görli · Deals'], ['@ort:raw', '💊', 'RAW · Deals'], ['@ort:kotti', '💊', 'Kotti · Deals'], ['@ort:tor', '📸', 'Brandenburger Tor'], ['@ort:ufer', '📸', 'East Side Ufer']]],
  ['Deine Orte', [['Alex Tower', '🩺', 'Fernsehturm · Klinik'], ['@zuhause', '🏠', 'Deine Wohnung']]],
  ['Ausgehen', [['Scorpius Berlin', '🏖️', 'Pool-Party'], ['Spree Arena', '🎤', 'Konzerte'], ['Berghain', '🖤', 'Techno und Fetischnacht'], ['Papillong', '🍸', 'Bar am Wasser'], ['Borchert', '🥂', 'Restaurant'], ['Grill Royale', '⚓', 'Am Anleger']]],
  ['Shopping', [['Maison du Sac', '👜', 'Taschen'], ['Tiffanny & Co.', '💎', 'Schmuck'], ['Galeries Lafayetto', '👗', 'Mode'], ['KaDeVe', '🛒', 'Mall'], ['Beauty Galerie', '💄', 'Beauty'], ['Spree Motors', '🚗', 'Autos'], ['Markthalle Zehn', '🧺', 'Markt']]],
  ['Wellness', [['Spree Spa', '🧖', 'Spa'], ['Health Hub', '🏋️', 'Fitness'], ['Klinik Dr. Glatt', '✨', 'Beratung']]],
  ['Reisen und Wohnen', [['Flughafen Tempelhoff', '✈️', 'Privatjets'], ['@spaceport', '🚀', 'Mond und Mars'], ['Penthouse Mitte', '🌴', 'Wohnen'], ['Spreeufer Residenz', '🏠', 'Wohnen'], ['Lofts Kreuzberg', '🏢', 'Wohnen'], ['Fabrik Coworking', '💼', 'Arbeit'], ['Kiez Gym', '🍔', 'Snacks']]]
];
// Linien-Symbole statt Emojis: einheitlich, schlank, in Pink. Schlüssel ist das Emoji aus WOHIN, damit die Liste lesbar bleibt.
const SYM_PFAD = { '🩺': 'M6 3v6a6 6 0 0 0 12 0V3M12 15v2a4 4 0 0 0 8 0v-3M20 14a2 2 0 1 0 0-.01', '🛍️': 'M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2', '🏠': 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6',
  '🏖️': 'M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9zM12 12v9M4 21h16', '🎤': 'M9 3h6v9a3 3 0 0 1-6 0V3zM5 11a7 7 0 0 0 14 0M12 18v3', '🍸': 'M4 4h16l-8 9-8-9zM12 13v7M8 20h8', '🥂': 'M8 3l-1 7a3 3 0 0 0 6 0l-1-7H8zM10 13v8M7 21h6M16 3l1 7a3 3 0 0 1-2 3',
  '⚓': 'M12 5a2 2 0 1 0 0-.01M12 7v14M5 13a7 7 0 0 0 14 0M8 10h8', '👜': 'M4 9h16l-2 11H6L4 9zM8 9a4 4 0 0 1 8 0', '💎': 'M6 3h12l4 6-10 12L2 9l4-6zM2 9h20M9 3l3 18 3-18', '👗': 'M9 3l-1 4 2 3-5 11h14l-5-11 2-3-1-4M9 3h6',
  '🛒': 'M3 4h2l3 11h11l2-8H6M9 20a1 1 0 1 0 0-.01M18 20a1 1 0 1 0 0-.01', '💄': 'M9 21V11h6v10H9zM10 11V6l4-3v8', '🚗': 'M3 15l2-6h14l2 6v4H3v-4zM3 15h18M7 19v2M17 19v2M7 13h.01M17 13h.01', '🧺': 'M3 10h18l-2 10H5L3 10zM8 10l3-6M16 10l-3-6',
  '🧖': 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21a8 8 0 0 1 16 0', '🏋️': 'M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12', '✨': 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z', '✈️': 'M2 13l20-8-6 16-3-7-11-1z', '🚀': 'M12 2c4 3 5 8 4 13H8C7 10 8 5 12 2zM8 15l-3 4h4M16 15l3 4h-4M12 8h.01',
  '🌴': 'M12 21v-9M12 12c-3-4-7-4-9-2M12 12c3-4 7-4 9-2M12 12c-1-4-4-7-7-7M12 12c1-4 4-7 7-7', '🏢': 'M5 21V4h10v17M15 9h4v12M8 8h4M8 12h4M8 16h4', '💼': 'M3 8h18v12H3V8zM9 8V5h6v3M3 13h18', '🍔': 'M4 11a8 6 0 0 1 16 0H4zM4 14h16M5 17h14a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3z' };
function symbol(emoji) { const d = SYM_PFAD[emoji]; if (!d) return el_('span', 'ic', emoji); const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'ic'); s.innerHTML = `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`; return s }
// Große Orte zeigt die Kamera in der Mitte des Geländes, nicht am Eingang
const WOHIN_BLICK = { 'Spree Arena': [-34, 7], 'Flughafen Tempelhoff': [58, 22] };
function wohinFahren(b) { if (b.spaceport) { document.getElementById('card').hidden = true; offen = null; ZIEL = { cx: 32 * (80 - 6), cy: 16 * (80 + 6) - 50, z: 1 }; setTimeout(() => typeof spaceportZeigen === 'function' && spaceportZeigen(), 1800); return } document.getElementById('card').hidden = true; offen = null; const [bx, by] = WOHIN_BLICK[b.title] || [b.x + 2, b.y + 2]; ZIEL = { cx: wx(bx, by), cy: wy(bx, by, 0) - 60, z: 1 }; laufeZu(b.x + 2, b.y + 2, b.pod ? b : null) }
function wohin() { if (INNEN) verlassen(); const cb = panel('Wohin?');
  for (const [gruppe, orte] of WOHIN) { const da = orte.map(([t, ic, z]) => [t === '@uhr' ? { title: 'Weltzeituhr', x: PLAZA.x + .5, y: PLAZA.y + 1 } : t.startsWith('@ort:') && typeof ORTE !== 'undefined' ? (() => { const q = ORTE[t.slice(5)].p(); return q && { title: ORTE[t.slice(5)].n, x: q.x - 2, y: q.y - 2 } })() :
      t === '@zuhause' ? B.find(b => b.top === 'home') : t === '@spaceport' ? { title: 'Spree Spaceport', spaceport: true, x: 82, y: 4 } : B.find(b => b.title === t), ic, z]).filter(o => o[0]); if (!da.length) continue;
    const h = el_('h4', 'wohinkopf', gruppe), raster = el_('div', 'wohin');
    for (const [b, ic, z] of da) { const k = el_('button', 'wohinort'); k.append(symbol(ic), el_('b', null, b.top === 'home' && z === 'Deine Wohnung' ? 'Dein Zuhause' : b.title), el_('small', null, z)); k.onclick = () => wohinFahren(b); raster.append(k) }
    cb.append(h, raster) } if (typeof einladenBereich === 'function') einladenBereich(cb) }
document.getElementById('bStadt').onclick = wohin;

// Spree Spaceport: Ausblick auf Mond und Mars, für Milliardärinnen. Noch gesperrt, die Reise kommt mit einer späteren Welt.
function spaceportZeigen() { const cb = panel('🚀 Spree Spaceport'); cb.append(el_('p', 'hin', 'Hier starten bald Reisen ins All. Nur für die Reichsten der Stadt.'));
  for (const [ic, n, t, p] of [['🌙', 'Mond-Resort Glow Luna', 'Wochenende mit Blick auf die Erde', 250000000], ['🔴', 'Mars Base One', 'Die erste Klinik auf dem Mars eröffnen', 1000000000], ['🛰️', 'Orbit-Party', 'Champagner in der Schwerelosigkeit', 80000000]]) {
    const r = el_('div', 'freundin'), l = el_('div'); l.append(el_('b', null, `${ic} ${n}`), el_('small', null, `${t} · Ticket ${euro(p)}`)); const bt = el_('button', 'cta', '🔒 Bald'); bt.disabled = true; r.append(l, bt); cb.append(r) }
  cb.append(el_('p', 'hin', 'Jede volle Stunde um Viertel nach startet eine Rakete. Schau zu.')) }
