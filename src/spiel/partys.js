// Berlin · partys.js · Leben in den Wohnungen: jede Wohnung hat jeden Tag ein Event (Techno-Brunch, CEO-Dinner …) mit 4 bis 10 Gästen,
// passender Einrichtung und Aktionen (mitmachen, Gäste ansprechen). In jeder Wohnung steht die Glow-Home-Zentrale: Lieferdienste und Möbel bestellen.
const PD = window.GLOW_PARTYS;
const LIEFERUNG = [
  { id: 'masseurin', icon: '💆‍♀️', name: 'Masseurin nach Hause', preis: 180, energie: 30, stil: 3 },
  { id: 'koch', icon: '👨‍🍳', name: 'Privatkoch für heute Abend', preis: 450, energie: 15, stil: 8, follower: 60 },
  { id: 'blumen', icon: '💐', name: 'Blumen vom Floristen', preis: 120, stil: 4 },
  { id: 'champagner', icon: '🍾', name: 'Champagner auf Eis', preis: 260, stil: 6, follower: 40 },
  { id: 'trainer', icon: '🏋️‍♀️', name: 'Personal Trainerin', preis: 150, energie: 20, stil: 3 },
  { id: 'putz', icon: '🧹', name: 'Reinigungsservice', preis: 90, energie: 10 },
  { id: 'stylist', icon: '💇‍♀️', name: 'Hairstylistin zum Ausgehen', preis: 220, stil: 10, follower: 50 },
  { id: 'sushi', icon: '🍣', name: 'Sushi-Platte geliefert', preis: 95, energie: 12 }
];
const tagSchluessel = () => new Date().toDateString();
const zahlAus = t => [...t].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
function partyFuer(b, stock) { const z = zahlAus(tagSchluessel() + b.title + stock), e = PD.EVENTS[z % PD.EVENTS.length], n = e.gaeste[0] + (z >>> 4) % (e.gaeste[1] - e.gaeste[0] + 1); return Object.assign({ n, id: tagSchluessel() + b.title + stock }, e) }
// Gäste stehen in Gruppen im Raum, beim DJ tanzen sie
const eigeneWohnung = (b, stock) => b.top === 'home' && stock === etagen(b).length - 1;
const eingeladen = () => !!(ST.einladung && ST.einladung.tag === tagSchluessel());
function partyGaeste(b, stock, L) { if (eigeneWohnung(b, stock) && !eingeladen()) return null; const p = eingeladen() && eigeneWohnung(b, stock) ? Object.assign(partyFuer(b, stock), PD.EVENTS.find(e => e.name === ST.einladung.name) || {}) : partyFuer(b, stock), z = zahlAus(p.id);
  for (let i = 0; i < p.n; i++) { const g = human({}), bw = BEW[(z + i * 7) % BEW.length]; const kl = PD.KLASSEN[p.klasse || 0]; Object.assign(g, { x: b.x + .7 + (i % 4) * .8 + (i > 3 ? .3 : 0), y: b.y + 1.6 + Math.floor(i / 4) * .8, idle: 1, ph: i * 1.3, name: bw.name, partyGast: 1, tanzt: p.art === 'dj', klasse: p.klasse || 0, titel: kl.titel[(z + i) % kl.titel.length] }); if (i % 3 === 0) g.bagK = ['lady', 'speedi', 'jackie'][i % 3]; L.push(g) } return p }
// Einrichtung je Art in der 2D-Innenansicht
function partyEinrichtung(b, x, y, add, K) { const e = etagen(b)[b.stock || 0]; if (e.a !== 'home') return; const p = partyFuer(b, b.stock || 0);
  if (p.art === 'dj') { K(1.4, .35, 1.4, .5, 10, '#16171a'); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) add('f', 1 + i * .7, 2.3 + j * .6, () => top4(x + 1 + i * .7, y + 2.3 + j * .6, .65, .55, .4, `hsl(${(i * 50 + j * 80 + T * 120) % 360},80%,${55 + 15 * Math.sin(T * 7 + i + j)}%)`)) }
  if (p.art === 'bar') { K(.4, .45, 2.6, .5, 11, '#2a2218'); K(.45, .5, 2.5, .4, .6, '#e6c76a', 11); for (let i = 0; i < 6; i++) K(.55 + i * .4, .5, .12, .12, 5, ['#ff6f9c', '#ffd166', '#9fe8ff'][i % 3], 11.6) }
  if (p.art === 'kueche') { K(1.1, 1.3, 1.8, .8, 10, '#f4f1ea'); K(1.15, 1.35, 1.7, .7, .5, '#2b2d33', 10); K(.3, .3, 3.2, .45, 18, '#e9e4dc') }
  if (p.art === 'dinner') { K(.7, 1.4, 2.6, .8, 8, '#7a5236'); for (let i = 0; i < 5; i++) { K(.85 + i * .5, 1.15, .25, .2, 6, '#f2eee8'); K(.85 + i * .5, 2.25, .25, .2, 6, '#f2eee8') } }
  if (p.art === 'beauty') { for (let i = 0; i < 3; i++) { K(.5 + i * 1.1, .4, .8, .45, 10, '#ffb3d1'); K(.6 + i * 1.1, .42, .6, .06, 7, '#fff7fb', 10) } }
  K(3.3, 1.2, .15, 1.1, 14, '#0d0e12'); add('tv', 3.3, 1.7, () => { const [px, py] = pt(x + 3.32, y + 1.7, 9); g.fillStyle = '#2fe0d2'; g.globalAlpha = .6 + .2 * Math.sin(T * 3); g.fillRect(px - 2 * Z, py - 6 * Z, 4 * Z, 10 * Z); g.globalAlpha = 1 }) }
// Im Fenster der Wohnung: Event, Mitmachen, Gäste ansprechen, Glow-Home-Zentrale
// Eigene Wohnung: privat. Du lädst ein (Event wählen), dann kommen Gäste. Internet über TV oder Laptop, hier auch als Knopf.
function einladen(b, ev) { if (ST.geld < 800) return; ST.geld -= 800; ST.einladung = { tag: tagSchluessel(), name: ev.name }; b.innen = innenLeute(b); save(); hud(); banner(`🥂 ${ev.name.toUpperCase()}`, 'Deine Gäste sind da', 'Tipp sie an und rede mit ihnen'); zeigeEtage(b) }
function internetZeigen(b) { const cb = panel('📺 Glow Home · Internet'); cb.append(el_('p', 'hin', 'Lieferdienste kommen sofort. Möbel stehen nach dem Kauf in deiner Wohnung.'));
  const box = el_('div', 'lieferung'); for (const it of LIEFERUNG) { const bt = el_('button', 'liefer'); bt.append(el_('span', null, it.icon), el_('b', null, it.name), el_('small', null, euro(it.preis))); bt.disabled = ST.geld < it.preis;
    bt.onclick = () => { if (ST.geld < it.preis) return; ST.geld -= it.preis; ST.energie = Math.min(100, (ST.energie ?? 70) + (it.energie || 0)); ST.stil += it.stil || 0; ST.follower = (ST.follower || 0) + (it.follower || 0); save(); hud(); toast(`${it.icon} ${it.name} ist unterwegs`); internetZeigen(b) }; box.append(bt) }
  const m = el_('div'); m.style.cssText = 'display:flex;flex-direction:column;gap:5px;margin-top:6px'; m.append(...WS.KATALOG.filter(i => i.kat === 'wohnen').sort((a, c) => a.rang - c.rang).map(zeile));
  const zur = el_('button', 'big test', '← Zurück in die Wohnung'); zur.onclick = () => { if (b) zeigeEtage(b) }; cb.append(el_('h4', null, 'Lieferdienste'), box, el_('h4', null, 'Möbel und Einrichtung'), m, zur) }
function partyBereich(cb, b) { const e = etagen(b)[b.stock || 0]; if (e.a !== 'home') return;
  if (eigeneWohnung(b, b.stock || 0)) { const net = el_('button', 'big', '📺 Internet: bestellen und Möbel kaufen'); net.onclick = () => internetZeigen(b); cb.append(net);
    if (!eingeladen()) { cb.append(el_('h4', null, '🥂 Gäste einladen'), el_('p', 'hin', 'Deine Wohnung ist privat. Lad Leute zu einem Event ein (800 € für Drinks und Essen).')); const r = el_('div', 'partygaeste');
      for (const ev of PD.EVENTS) { const frei = zugang(ev.klasse); const bt = el_('button', 'zweit', frei ? `${ev.name} · ${PD.KLASSEN[ev.klasse].name}` : `🔒 ${ev.name} · ab Stufe ${PD.KLASSEN[ev.klasse].ab}`); bt.disabled = !frei || ST.geld < 800; bt.onclick = () => einladen(b, ev); r.append(bt) } cb.append(r); return } }
  const p = eigeneWohnung(b, b.stock || 0) ? Object.assign(partyFuer(b, b.stock || 0), PD.EVENTS.find(x => x.name === ST.einladung.name) || {}) : partyFuer(b, b.stock || 0);
  if (!zugang(p.klasse)) { const kl = PD.KLASSEN[p.klasse || 0]; cb.append(el_('h4', null, `🔒 ${p.name}`), el_('p', 'hin', `Der Türsteher lässt dich nicht rein: nur ${kl.name}, ab Influencer-Stufe ${kl.ab}. Du bist auf Stufe ${meineStufe()}.`)); return } ST.partys = ST.partys || {}; const dabei = ST.partys[p.id];
  const h = el_('h4', null, `🎉 Heute hier: ${p.name} · ${p.n} Gäste`), t = el_('p', 'hin', p.text), mit = el_('button', 'big', dabei ? 'Du warst heute schon dabei' : `${p.aktion} · +15 Stil · +120 Follower`); mit.disabled = !!dabei;
  mit.onclick = () => { ST.partys[p.id] = 1; ST.stil += 15; ST.follower = (ST.follower || 0) + 120; ST.energie = Math.min(100, (ST.energie ?? 70) + 5); save(); hud(); banner(`🎉 ${p.name.toUpperCase()}`, p.aktion.replace(/^\S+ /, ''), '+15 Stil · +120 Follower'); if (typeof news === 'function') news(`${(ST.profil && ST.profil.handle) || 'Jemand'} feiert beim ${p.name} im ${b.title}`); zeigeEtage(b) };
  cb.append(h, t, mit); const gaeste = (b.innen || []).filter(x => x.partyGast).slice(0, 4);
  if (gaeste.length) { const r = el_('div', 'partygaeste'); for (const gs of gaeste) { const bt = el_('button', 'zweit', `💬 ${gs.name.split(' ')[0]} · ${gs.titel || ''}`); bt.onclick = () => ansprechen(gs); r.append(bt) } cb.append(el_('p', 'hin', 'Sprich Gäste an:'), r) }
}
// ---------- Soziale Leiter: Zugang, Nähe, Aktionen ----------
const meineStufe = () => typeof influencerStufe === 'function' ? INFLUENCER.indexOf(influencerStufe()) : 0;
const zugang = klasse => meineStufe() >= PD.KLASSEN[klasse || 0].ab;
// Star-Vorsprung: wie weit du über der Klasse des Gasts stehst. Als Star macht jeder mit.
const vorsprung = q => Math.max(0, meineStufe() - PD.KLASSEN[q.klasse || 0].ab);
const naehe = q => ((ST.naehe || {})[q.name] || 0);
function ansprechen(q) { const cb = panel(`${q.name} · ${q.titel || 'Gast'}`), kl = PD.KLASSEN[q.klasse || 0], n = naehe(q), v = vorsprung(q);
  if (!zugang(q.klasse)) { cb.append(el_('p', 'hin', `${kl.name}: Hier sind nur Leute ab Influencer-Stufe ${kl.ab}. ${q.name.split(' ')[0]} schaut durch dich hindurch.`)); return }
  const r = el_('div', 'meister'), bar = el_('i'), sb = el_('span', 'mbalken'); sb.append(bar); bar.style.width = n + '%';
  r.append(el_('b', null, `${kl.name} · Nähe ${Math.round(n)} %`), el_('small', null, v >= 4 ? '⭐ Du bist hier der Star. Alle wollen mit dir gesehen werden.' : 'Je bekannter du bist, desto offener sind die Leute.'), sb); cb.append(r);
  const box = el_('div', 'partygaeste'); for (const a of PD.AKTIONEN) { const noetig = Math.max(0, a.stufe - v * 8), frei = n >= noetig && (a.id !== 'deal' || (q.klasse || 0) >= 2);
    const bt = el_('button', frei ? 'zweit' : 'zweit gesperrt', frei ? `${a.icon} ${a.name}` : a.id === 'deal' && (q.klasse || 0) < 2 ? `🔒 ${a.name} · erst ab Society` : `🔒 ${a.name} · ab ${noetig} % Nähe`); bt.disabled = !frei; bt.onclick = () => aktion(q, a); box.append(bt) } cb.append(box) }
function aktion(q, a) { const v = vorsprung(q), kl = q.klasse || 0; ST.naehe = ST.naehe || {}; const chance = Math.min(.98, .62 + v * .05), ok = a.id === 'reden' || Math.random() < chance, name = q.name.split(' ')[0];
  window.AKTION3D = { q, art: ok ? a.id : 'abblitzen', bis: Date.now() + 4500 };
  if (!ok) { ST.naehe[q.name] = Math.max(0, naehe(q) - 8); toast(`${name} lächelt höflich und dreht sich weg`); save(); return ansprechen(q) }
  const fol = Math.round(15 * (kl + 1) * (kl + 1) * (1 + meineStufe() * .1) * ({ reden: .5, anstossen: .8, tanzen: 1.2, selfie: 2, flirten: 1.5, deal: 1, kuessen: 3 }[a.id] || 1));
  ST.naehe[q.name] = Math.min(100, naehe(q) + { reden: 8, anstossen: 10, tanzen: 14, selfie: 10, flirten: 16, deal: 6, kuessen: 20 }[a.id]); ST.follower = (ST.follower || 0) + fol; ST.stil += 2 * (kl + 1);
  let text = `+${fol.toLocaleString('de-DE')} Follower`;
  if (a.id === 'deal') { const k = klinikStand(); if (Math.random() < .5) { boostGeben(k, .2 + kl * .05, 30, `Deal mit ${q.name}`); text = `${q.titel} schickt dir ihre Kontakte: Glow-Boost 30 Min.` } else { const geld = Math.round(3000 * kl * kl * (1 + meineStufe() * .15)); ST.geld += geld; text = `Kooperation mit ${q.titel}: +${euro(geld)}` } }
  if (a.id === 'selfie' || a.id === 'kuessen') { if (typeof news === 'function') news(`${(ST.profil && ST.profil.handle) || 'Jemand'} wurde mit ${q.name} (${q.titel}) gesehen`) }
  banner(`${a.icon} ${a.name.toUpperCase()}`, `mit ${q.name} · ${q.titel}`, text); save(); hud(); ansprechen(q) }
