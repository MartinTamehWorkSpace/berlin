// Glow City · influencer.js · Vom Praxisalltag zur bekannten Ärztin: Follower-Stufen mit Kooperations-Einkommen und ab Macro eine eigene Pflegemarke.
// Einkommen läuft in echter Zeit (auch wenn du weg bist, höchstens 8 Stunden am Stück), ausgezahlt im Minutentakt.
// Die Marke: Produkte einmal entwickeln, danach verkaufen sie sich stündlich, je mehr Follower, desto mehr. Neue Produkte sind nur Einträge in MARKE.produkte.
// 20 Stufen von 500 bis 5 Mio. Followern, dazwischen gleichmäßige Schritte. Star-Bonus steigt bis +300 %, Kooperationen bis 30.000 € pro Stunde.
const INFLUENCER = [{ ab: 0, name: 'Privat', icon: '🙂', proStd: 0, star: 0 }, ...Array.from({ length: 20 }, (_, i) => {
  const gruppe = [['Nano-Influencerin', '📱'], ['Micro-Influencerin', '✨'], ['Rising Star', '🌟'], ['Macro-Influencerin', '💫'], ['Mega-Influencerin', '👑'], ['Ikone', '💎']][Math.min(5, Math.floor(i / 3.4))];
  return { ab: Math.round(500 * Math.pow(10000, i / 19) / 100) * 100 || 500, name: `${gruppe[0]} ${i + 1}`, icon: gruppe[1], proStd: Math.round(20 * Math.pow(1500, i / 19) / 10) * 10, star: Math.round((i + 1) * 15) / 100 } })];
const MARKE = { ab: 250000, gruendung: 250000, maxStd: 8,
  produkte: [
    { id: 'serum', icon: '🧴', name: 'Glow Serum mit Hyaluron', kosten: 80000, proStd: 1500 },
    { id: 'spf', icon: '☀️', name: 'Daily SPF 50 Fluid', kosten: 120000, proStd: 2200 },
    { id: 'creme', icon: '🫙', name: 'Repair Night Cream', kosten: 200000, proStd: 3500 },
    { id: 'lippe', icon: '💋', name: 'Lip Plump Gloss', kosten: 150000, proStd: 2800 },
    { id: 'drink', icon: '🥤', name: 'Collagen Beauty Drink', kosten: 400000, proStd: 6000 }
  ] };
// Star-Bonus: Bekanntheit macht dich zur Starärztin, jede Behandlung zahlt mehr (bis +200 %). Getrennt vom Kooperations-Einkommen.
const starBonus = () => influencerStufe().star || 0;
const influencerStufe = (f = ST.follower || 0) => INFLUENCER.reduce((s, x) => f >= x.ab ? x : s, INFLUENCER[0]);
const markeFaktor = () => 1 + Math.log10(1 + (ST.follower || 0) / 100000);
function einnahmenProStd() { const st = influencerStufe(), m = ST.marke; return st.proStd + (m ? MARKE.produkte.filter(p => m.produkte[p.id]).reduce((s, p) => s + p.proStd, 0) * markeFaktor() : 0) }
// Alle 60 Sekunden auszahlen, verpasste Zeit seit dem letzten Besuch bis höchstens 8 Stunden nachholen; neue Stufe wird gefeiert
function influencerWeiter() { const jetzt = Date.now(), zuletzt = ST.infZuletzt || jetzt, std = Math.min(MARKE.maxStd, (jetzt - zuletzt) / 36e5); ST.infZuletzt = jetzt;
  const plus = Math.round(einnahmenProStd() * std); if (plus > 0) { ST.geld += plus; ST.infSumme = (ST.infSumme || 0) + plus; if (std > .5) banner('KOOPERATIONEN UND MARKE', `Während du weg warst`, `+${euro(plus)}`) }
  const st = influencerStufe(); if (ST.infStufe !== st.name) { const neu = ST.infStufe != null && INFLUENCER.indexOf(st) > INFLUENCER.findIndex(x => x.name === ST.infStufe); ST.infStufe = st.name;
    if (neu) { banner(`${st.icon} ${st.name.toUpperCase()}`, `Star-Bonus: +${Math.round(st.star * 100)} % auf jede Behandlung`, `Kooperationen ${euro(st.proStd)} pro Stunde`); if (typeof news === 'function') news(`${(ST.profil && ST.profil.handle) || 'Eine Ärztin'} ist jetzt ${st.name}`) } }
  save(); hud() }
setInterval(() => { if (document.getElementById('start').hidden) influencerWeiter() }, 60000);
function markeGruenden() { if (ST.marke || ST.geld < MARKE.gruendung || (ST.follower || 0) < MARKE.ab) return; ST.geld -= MARKE.gruendung; ST.marke = { name: `${((ST.profil && ST.profil.handle) || 'Glow').replace('@', '')} Skin`, produkte: {}, seit: Date.now() };
  banner('🧴 DEINE EIGENE MARKE', ST.marke.name, 'Entwickle jetzt dein erstes Produkt'); if (typeof news === 'function') news(`${(ST.profil && ST.profil.handle) || 'Eine Ärztin'} gründet die Pflegemarke ${ST.marke.name}`); save(); hud(); if (KLINIK.offen) klinikZeichnen() }
function produktStarten(id) { const p = MARKE.produkte.find(x => x.id === id), m = ST.marke; if (!p || !m || m.produkte[id] || ST.geld < p.kosten) return; influencerWeiter(); ST.geld -= p.kosten; m.produkte[id] = Date.now();
  banner(`${p.icon} LAUNCH`, p.name, `verkauft sich ab jetzt jede Stunde · +${euro(Math.round(p.proStd * markeFaktor()))} pro Stunde`); save(); hud(); if (KLINIK.offen) klinikZeichnen() }
// Im Social-Reiter der Klinik: Stufe, Fortschritt zur nächsten, Einkommen, Marke
function influencerBereich(k, body) { const f = ST.follower || 0, st = influencerStufe(f), i = INFLUENCER.indexOf(st), nx = INFLUENCER[i + 1];
  body.append(el_('h4', null, `${st.icon} Du als Influencerin: ${st.name}`));
  const r = el_('div', 'meister'), bar = el_('i'), sb = el_('span', 'mbalken'); sb.append(bar); bar.style.width = (nx ? Math.min(1, (f - st.ab) / (nx.ab - st.ab)) : 1) * 100 + '%';
  r.append(el_('b', null, `${f.toLocaleString('de-DE')} Follower · Star-Bonus +${Math.round(st.star * 100)} % auf jede Behandlung · Kooperationen ${euro(st.proStd)} pro Stunde`), el_('small', null, nx ? `Ab ${nx.ab.toLocaleString('de-DE')} Followern: ${nx.icon} ${nx.name}, Star-Bonus +${Math.round(nx.star * 100)} %, ${euro(nx.proStd)} pro Stunde` : 'Höchste Stufe erreicht'), sb); body.append(r);
  body.append(el_('p', 'hin', `Gesamt pro Stunde mit Marke: ${euro(Math.round(einnahmenProStd()))}. Läuft auch, wenn du weg bist (bis 8 Stunden).`));
  if (!ST.marke) { const z = el_('div', 'freundin'), l = el_('div'); l.append(el_('b', null, '🧴 Eigene Pflegemarke gründen'), el_('small', null, f < MARKE.ab ? `ab ${MARKE.ab.toLocaleString('de-DE')} Followern` : `Gründung ${euro(MARKE.gruendung)} · danach eigene Produkte, die stündlich verkaufen`));
    const bt = el_('button', 'cta', f < MARKE.ab ? 'Noch gesperrt' : euro(MARKE.gruendung)); bt.disabled = f < MARKE.ab || ST.geld < MARKE.gruendung; bt.onclick = markeGruenden; z.append(l, bt); body.append(z); return }
  body.append(el_('h4', null, `🧴 ${ST.marke.name}`));
  for (const p of MARKE.produkte) { const da = !!ST.marke.produkte[p.id], z = el_('div', 'freundin' + (da ? ' live' : '')), l = el_('div'); l.append(el_('b', null, `${p.icon} ${p.name}`), el_('small', null, da ? `im Handel · +${euro(Math.round(p.proStd * markeFaktor()))} pro Stunde` : `Entwicklung ${euro(p.kosten)} · danach +${euro(Math.round(p.proStd * markeFaktor()))} pro Stunde`));
    const bt = el_('button', da ? null : 'cta', da ? 'Im Handel' : 'Entwickeln'); bt.disabled = da || ST.geld < p.kosten; bt.onclick = () => produktStarten(p.id); z.append(l, bt); body.append(z) } }
