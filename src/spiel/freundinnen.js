// Berlin City · freundinnen.js · Boutiquen anderer besuchen und aufpolieren. Beide haben etwas davon.
// Jede schreibt nur ihr eigenes Dokument: Der Besuch steht in ST.besucht der Besucherin, die Besuchte liest ihn und holt sich den Bonus selbst ab.
const BESUCH = { proTag: 5, schneller: 15 * 60e3, xpGast: 25, xpWirtin: 20, geldGast: 300 };
function besuchtHeute() { const h = heute(); if (!ST.besucht || ST.besucht.tag !== h) ST.besucht = { tag: h, ids: [] }; return ST.besucht }
// Wer hat eine Boutique? Echte Spielerinnen aus der Datenbank (LIVE), dazu die Bewohnerinnen der Stadt (NPC)
function boutiquenListe() { const liste = [];
  if (typeof SPIELER !== 'undefined') for (const [id, x] of SPIELER) { let st = {}; try { st = JSON.parse(x.stand || '{}') } catch (e) {}
    liste.push({ id, name: x.handle, live: true, lvl: glowLevel(st.xp || 0).l, album: Object.keys(st.album || {}).length, regale: (st.bout && st.bout.regale) || [], tasche: (st.traegtTasche && GLOW_FIGUREN.TASCHE[st.traegtTasche]) ? st.traegtTasche : x.tasche }) }
  // Bewohnerinnen: Level und Kollektion folgen ihren Stilpunkten, die Stars stehen oben
  for (const c of GLOW_FIGUREN.CHARS.filter(c => c.w).sort((a, b) => b.stil - a.stil).slice(0, 10)) { const lvl = Math.max(2, Math.min(99, Math.round(Math.sqrt(c.stil || 0) / 2.5)));
    liste.push({ id: 'npc_' + c.id, name: c.handle || c.name, rolle: c.rolle, live: false, lvl, album: Math.min(40, Math.round(lvl * .42)), regale: [], tasche: c.tasche }) }
  return liste }
function besuchen(b) { const bh = besuchtHeute(); if (bh.ids.includes(b.id) || bh.ids.length >= BESUCH.proTag) return;
  bh.ids.push(b.id); ST.geld += BESUCH.geldGast; xpGeben(BESUCH.xpGast); setTimeout(() => ereignis('besuch', { b }));
  const t = b.tasche && GLOW_FIGUREN.TASCHE[b.tasche]; const alb = ALLE_TASCHEN.find(x => x.id === b.tasche) || (t && Object.assign({ f: 'halb' }, t));
  karteZeigen({ kopf: b.live ? 'BESUCH BEI EINER FREUNDIN' : 'BESUCH IN DER STADT', bild: alb ? taschenBild(alb, 120, true) : null, titel: b.name, sub: `Glow-Level ${b.lvl} · ${b.album} Taschen in der Kollektion`,
    unter: b.live ? `Du hast ihre Regale aufpoliert: Ihre Ware verkauft sich 15 Min. schneller. Du bekommst +${euro(BESUCH.geldGast)} und +${BESUCH.xpGast} XP.` : `Ihr habt über Taschen geredet: +${euro(BESUCH.geldGast)} und +${BESUCH.xpGast} XP.`,
    farbe: b.live ? '#2fe0d2' : '#ff8fc7', knopf: 'Danke' }); save(); hud() }
// Besuche bei mir: einmal pro Besucherin und Tag laufende Ware schneller fertig, dazu XP
function besucheErhalten() { if (typeof SPIELER === 'undefined' || !KONTO.id) return; const h = heute(); if (!ST.erhalten || ST.erhalten.tag !== h) ST.erhalten = { tag: h, ids: [] };
  for (const [id, x] of SPIELER) { if (ST.erhalten.ids.includes(id)) continue; let st; try { st = JSON.parse(x.stand || '{}') } catch (e) { continue }
    if (!st.besucht || st.besucht.tag !== h || !(st.besucht.ids || []).includes(KONTO.id)) continue;
    ST.erhalten.ids.push(id); for (const r of boutStand().regale) if (r) r.t0 -= BESUCH.schneller; xpGeben(BESUCH.xpWirtin);
    banner('BESUCH IN DEINER BOUTIQUE', `${x.handle} hat deine Regale aufpoliert`, `Ware 15 Min. schneller · +${BESUCH.xpWirtin} XP`); news(`${x.handle} war in der Boutique von ${ST.profil.handle}`) }
  save() }
function freundinnenZeichnen(body) { const bh = besuchtHeute(), liste = boutiquenListe(), live = liste.filter(b => b.live);
  const k = el_('div', 'albumkopf'); k.append(el_('b', null, 'Boutiquen besuchen'), el_('span', null, `Heute ${bh.ids.length}/${BESUCH.proTag} Besuche`)); body.append(k);
  body.append(el_('p', 'hin', 'Besuch eine Freundin und polier ihre Regale auf. Ihre Ware verkauft sich schneller, du bekommst Geld und XP. Besuchen dich andere, wird deine Ware schneller fertig.'));
  if (ST.erhalten && ST.erhalten.tag === heute() && ST.erhalten.ids.length) { const namen = ST.erhalten.ids.map(id => (SPIELER.get(id) || {}).handle).filter(Boolean); if (namen.length) body.append(el_('p', 'hin gast', `Heute bei dir: ${namen.join(', ')}`)) }
  if (!live.length) body.append(el_('p', 'hin', 'Noch keine Freundin online mit eigener Boutique. Schick ihr den Link zu Berlin City, dann taucht sie hier mit LIVE auf.'));
  for (const b of liste) { const r = el_('div', 'freundin' + (b.live ? ' live' : '')); const l = el_('div');
    const n = el_('b', null, b.name); const m = el_('span', 'marke', b.live ? 'LIVE' : 'NPC'); n.prepend(m);
    const besetzt = b.regale.filter(Boolean).length; l.append(n, el_('small', null, `Level ${b.lvl} · ${b.album} Taschen${b.live ? ` · ${besetzt} Regale belegt` : b.rolle ? ' · ' + b.rolle : ''}`));
    const war = bh.ids.includes(b.id); const bt = el_('button', war ? null : 'cta', war ? 'Besucht' : 'Besuchen'); bt.disabled = war || bh.ids.length >= BESUCH.proTag; bt.onclick = () => { besuchen(b); boutiqueZeichnen() };
    r.append(l, bt); body.append(r) } }
