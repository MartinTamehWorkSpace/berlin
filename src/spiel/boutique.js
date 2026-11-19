// Berlin City · boutique.js · Die eigene Boutique (Regale, Kasse), Glow-Level und Funde fürs Kollektion
// Der tägliche Kreislauf: Ware einräumen, wiederkommen, abholen, Kasse leeren, ausbauen. Zeiten laufen in echter Zeit weiter.
const BQ = window.GLOW_BOUTIQUE;
// Taschen der Kollektion kennt auch die Figur, damit man sie in der Stadt tragen kann
for (const s of BQ.SETS) for (const t of s.taschen) GLOW_FIGUREN.TASCHE[t.id] = t; // Form für die kleine Tasche an der Figur
const ALLE_TASCHEN = BQ.SETS.flatMap(s => s.taschen.map(t => Object.assign({ set: s.id }, t)));
// Maison du Sac verkauft alle Taschen der Kollektion. Gekauft = in der Kollektion. Die alten Einzeltaschen zählen weiter.
for (const st of BQ.SETS) st.taschen.forEach((t, i) => { const preis = BQ.preisVonTasche(st.id, t, i); WS.KATALOG.push({ id: t.id, kat: 'tasche', laden: 'sac', kollektion: true, name: `${BQ.MARKE[st.id]} ${t.name}`, preis, stil: Math.round(preis / 140), rang: Math.min(899, Math.round(preis / 180)) }) });
const KAUF_ZU_KOLLEKTION = { speedi: 'lv_speedi', reed: 'pr_reed', jackie: 'gu_jackie', baguetta: 'fe_bag', jodie: 'bv_jodie', lady: 'di_lady', flap: 'sh_255', birkinn: 'he_birkin' };
function kaufFuerKollektion(id) { const t = ALLE_TASCHEN.find(x => x.id === (KAUF_ZU_KOLLEKTION[id] || id)); if (t && !(ST.album && ST.album[t.id])) setTimeout(() => taschenFund(t), 300) }
// Wer früher eine Einzeltasche gekauft hat, hat sie jetzt auch in der Kollektion
setTimeout(() => { ST.album = ST.album || {}; for (const [alt, neu] of Object.entries(KAUF_ZU_KOLLEKTION)) if (ST.besitz && ST.besitz[alt] && !ST.album[neu]) { ST.album[neu] = 1; ST.besitz[neu] = 1 } }, 0);
function boutStand() { if (!ST.bout) ST.bout = { regale: [null, null, null], kasse: 0, kt: Date.now(), ohne: 0, vs: 0 }; ST.album = ST.album || {}; ST.xp = ST.xp || 0; return ST.bout }
const jetzt = () => Date.now() + (boutStand().vs || 0);
const dauer = s => s >= 3600 ? `${Math.floor(s / 3600)} Std. ${Math.round(s % 3600 / 60)} Min.` : s >= 60 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')} Min.` : `${Math.ceil(s)} Sek.`;

// ---------- Glow-Level ----------
function glowLevel(xp) { let l = 1, x = xp ?? ST.xp ?? 0; while (l < BQ.LEVEL_MAX && x >= BQ.xpFuer(l)) { x -= BQ.xpFuer(l); l++ } return { l, rest: x, bis: BQ.xpFuer(l) } }
function freiBei(l) { return [...BQ.WARE.filter(w => w.lvl === l).map(w => w.name), ...BQ.REGALE.map((r, i) => r.lvl === l && i > 2 ? `${i + 1}. Regal` : '').filter(Boolean), ...BQ.KASSE.filter(k => k.lvl === l && k.preis).map(k => k.name)] }
function xpGeben(n) { if (!n) return; const vor = glowLevel().l; ST.xp = (ST.xp || 0) + n; const nach = glowLevel().l;
  for (let l = vor + 1; l <= nach; l++) { const lohn = BQ.levelLohn(l); ST.geld += lohn; const neu = freiBei(l); banner(`GLOW-LEVEL ${l}`, neu.length ? 'Neu: ' + neu.join(', ') : 'Du wirst bekannter in der Stadt', `+${euro(lohn)}`) }
  xpLeiste() }
function xpLeiste() { const el = document.getElementById('xpLeiste'); if (!el) return; const g = glowLevel();
  el.querySelector('b').textContent = `GLOW-LEVEL ${g.l}`; el.querySelector('i').style.width = Math.round(g.rest / g.bis * 100) + '%'; el.querySelector('span').textContent = `${g.rest.toLocaleString('de-DE')} / ${g.bis.toLocaleString('de-DE')} XP` }

// ---------- Boutique ----------
const setBonus = () => (1 + BQ.SETS.filter(setKomplett).reduce((s, x) => s + x.bonus, 0)) * (typeof ruhmStufe === 'function' ? ruhmStufe().preis : 1);
function setKomplett(s) { return s.taschen.every(t => ST.album && ST.album[t.id]) }
function kasseStand() { const b = boutStand(), k = BQ.KASSE[b.kasse || 0]; return { k, wert: Math.min(k.cap, Math.floor((jetzt() - b.kt) / 3.6e6 * BQ.kasseProStunde(glowLevel().l) * setBonus())) } }
function regalRest(r) { const w = BQ.WARE.find(x => x.id === r.w); return { w, rest: Math.max(0, r.t0 + w.zeit * 1000 - jetzt()) / 1000 } }
function einraeumen(i, id) { const b = boutStand(), w = BQ.WARE.find(x => x.id === id); if (!w || b.regale[i] || ST.geld < w.ek) return false;
  ST.geld -= w.ek; b.regale[i] = { w: id, t0: jetzt() }; return true }
function abholen(i, still) { const b = boutStand(), r = b.regale[i]; if (!r) return; const { w, rest } = regalRest(r); if (rest > 0) return;
  const erl = Math.round(w.vk * setBonus()); b.regale[i] = null; ST.geld += erl; ST.boutVerkauft = (ST.boutVerkauft || 0) + 1; xpGeben(w.xp);
  setTimeout(() => ereignis('verkauf')); if (!still) toast(`${w.name} verkauft · +${euro(erl)} · +${w.xp} XP`); return erl }
function kasseLeeren() { const { wert } = kasseStand(); if (wert < 1) return; ST.geld += wert; boutStand().kt = jetzt(); xpGeben(Math.max(1, Math.round(wert / 60))); toast(`Kasse geleert · +${euro(wert)}`); save(); hud(); boutiqueZeichnen() }
function regalKaufen(i) { const r = BQ.REGALE[i], b = boutStand(); if (!r || b.regale.length !== i || glowLevel().l < r.lvl || ST.geld < r.preis) return;
  ST.geld -= r.preis; b.regale.push(null); xpGeben(Math.round(r.preis / 200)); toast(`${i + 1}. Regal aufgebaut`); save(); hud(); boutiqueZeichnen() }
function kasseAusbauen() { const b = boutStand(), n = BQ.KASSE[(b.kasse || 0) + 1]; if (!n || glowLevel().l < n.lvl || ST.geld < n.preis) return;
  const { wert } = kasseStand(); ST.geld += wert - n.preis; b.kt = jetzt(); b.kasse = (b.kasse || 0) + 1; xpGeben(Math.round(n.preis / 200)); toast(`${n.name} steht · fasst ${euro(n.cap)}`); save(); hud(); boutiqueZeichnen() }

// ---------- Funde für die Kollektion ----------
// Längere Ware bringt öfter und seltener. Spätestens nach 8 Verkäufen ohne Fund gibt es sicher eine Tasche.
function fundPruefen(w) { const b = boutStand(); const anteil = w.zeit / 43200;
  if (Math.random() >= w.fund && (b.ohne || 0) < 7) { b.ohne = (b.ohne || 0) + 1; return } b.ohne = 0;
  const gew = { 1: BQ.SELTEN[1].gewicht, 2: BQ.SELTEN[2].gewicht * (1 + anteil * 2), 3: BQ.SELTEN[3].gewicht * (1 + anteil * 5) };
  let z = Math.random() * (gew[1] + gew[2] + gew[3]), s = 1; for (const k of [1, 2, 3]) { z -= gew[k]; if (z < 0) { s = k; break } }
  const pool = ALLE_TASCHEN.filter(t => t.selten === s), t = pool[Math.floor(Math.random() * pool.length)]; taschenFund(t) }
function taschenFund(t) { const doppelt = !!ST.album[t.id]; const set = BQ.SETS.find(s => s.id === t.set);
  if (doppelt) { const wert = BQ.doppeltWert(t.selten); ST.geld += wert; ST.album[t.id]++; fundZeigen(t, set, `Doppelt: an Sammlerinnen verkauft für ${euro(wert)}`); return }
  ST.album[t.id] = 1; ST.besitz[t.id] = 1; xpGeben(t.selten * 40); fundZeigen(t, set, `Neu in deiner Kollektion · ${set.taschen.filter(x => ST.album[x.id]).length}/5 im Set ${set.name}`);
  if (setKomplett(set)) { ST.stil += set.stil; banner('SET KOMPLETT', set.name, `+${Math.round(set.bonus * 100)} % Boutique-Erlös für immer · +${set.stil} Stil`) } }
function taschenBild(t, groesse, besitzt) { const c = document.createElement('canvas'), d = Math.min(2, devicePixelRatio || 1); c.width = c.height = groesse * d; c.style.width = c.style.height = groesse + 'px';
  const g2 = c.getContext('2d'); if (!g2) return c; g2.scale(d, d); taschenZeichnung(g2, t, groesse, besitzt); return c }
// Große Taschen für die Kollektion: jede Form mit eigenen Erkennungszeichen (Monogramm, Steppung, Kette, Klappe, Schloss)
function hell(hex, f) { const n = parseInt(hex.slice(1), 16), k = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(f > 1 ? v + (255 - v) * (f - 1) : v * f)))); return `rgb(${k})` }
function taschenZeichnung(g, t, G, besitzt) { const c = besitzt ? t.c : '#3d3848', d = besitzt ? t.d : '#57506a', f = t.f; g.save();
  const W = G * (f === 'birkin' ? .72 : f === 'tonne' ? .74 : f === 'knoten' ? .7 : .66), H = W * (t.h / t.w) * (f === 'tonne' ? 1.05 : 1), x0 = (G - W) / 2, y0 = G * .9 - H, cx = G / 2, lw = Math.max(1.2, G * .02);
  const dunkel = parseInt(c.slice(1, 3), 16) + parseInt(c.slice(3, 5), 16) + parseInt(c.slice(5, 7), 16) < 200; const leder = hell(c, dunkel ? 1.9 : .72);
  const gold = besitzt ? (/c0c4cc|ffffff/.test(t.d) ? '#e4e8ee' : '#f0cf6a') : '#5f5872', goldDunkel = besitzt ? (/c0c4cc|ffffff/.test(t.d) ? '#9aa1aa' : '#b88f2a') : '#4a4458';
  const metall = (x, y, w, h, r) => { const gr = g.createLinearGradient(x, y, x, y + h); gr.addColorStop(0, '#fff6d8'); gr.addColorStop(.4, gold); gr.addColorStop(1, goldDunkel); g.fillStyle = besitzt ? gr : gold; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill() };
  const koerper = () => { g.beginPath(); if (f === 'halb' || f === 'birkin') { g.moveTo(x0 + W * .08, y0); g.lineTo(x0 + W * .92, y0); g.lineTo(x0 + W, y0 + H); g.lineTo(x0, y0 + H); g.closePath() }
    else if (f === 'tonne') g.roundRect(x0, y0, W, H, [H * .5, H * .5, H * .12, H * .12]); else if (f === 'knoten') g.ellipse(cx, y0 + H * .55, W / 2, H * .55, 0, 0, 7); else g.roundRect(x0, y0, W, H, G * .035) };
  // Henkel und Riemen hinter dem Körper
  g.lineCap = g.lineJoin = 'round';
  if (f === 'kette' || f === 'stepp') { const pkt = []; for (let k = 0; k <= 26; k++) { const u = k / 26, x = x0 + W * .12 + (W * .76) * u, y = y0 + 2 - Math.sin(u * Math.PI) * H * 1.25; pkt.push([x, y]) }
    for (const [x, y] of pkt) { g.strokeStyle = gold; g.lineWidth = lw * .9; g.beginPath(); g.ellipse(x, y, lw * 1.25, lw * .8, 0, 0, 7); g.stroke() } g.strokeStyle = leder; g.lineWidth = lw * .5; g.beginPath(); pkt.forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke() }
  else if (f === 'klappe') { g.strokeStyle = leder; g.lineWidth = lw * 1.6; g.beginPath(); g.moveTo(x0 + W * .1, y0 + H * .2); g.quadraticCurveTo(cx, y0 - H * .95, x0 + W * .9, y0 + H * .2); g.stroke() }
  else if (f === 'knoten') { g.strokeStyle = hell(c, .85); g.lineWidth = lw * 3.2; g.beginPath(); g.moveTo(x0 + W * .3, y0 + H * .18); g.quadraticCurveTo(cx, y0 - H * .7, x0 + W * .7, y0 + H * .18); g.stroke(); g.fillStyle = hell(c, .8); g.beginPath(); g.ellipse(cx, y0 - H * .2, lw * 2.6, lw * 2, 0, 0, 7); g.fill() }
  else { const henkel = f === 'tonne' ? (besitzt ? '#c9a46b' : leder) : leder; for (const sx of [-1, 1]) { const mx = cx + sx * W * (f === 'birkin' ? .19 : .17); g.strokeStyle = henkel; g.lineWidth = lw * (f === 'birkin' ? 2.4 : 1.7); g.beginPath(); g.ellipse(mx, y0 + 1, W * .12, H * (f === 'birkin' ? .4 : .5), 0, Math.PI, 0); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = lw * .35; g.setLineDash([lw, lw * .9]); g.beginPath(); g.ellipse(mx, y0 + 1, W * .12, H * (f === 'birkin' ? .4 : .5), 0, Math.PI, 0); g.stroke(); g.setLineDash([]) } }
  // Körper: Leder mit Licht von oben links
  const gr = g.createLinearGradient(x0, y0, x0 + W, y0 + H); gr.addColorStop(0, hell(c, 1.3)); gr.addColorStop(.5, c); gr.addColorStop(1, hell(c, .6)); g.fillStyle = gr; koerper(); g.fill();
  g.save(); koerper(); g.clip();
  if (besitzt && f === 'tonne') { g.fillStyle = hell(d, 1); g.globalAlpha = .6; const r = G * .011; for (let yy = y0 + H * .12; yy < y0 + H; yy += G * .055) for (let xx = x0 + ((yy - y0) / (G * .055) % 2) * G * .0275; xx < x0 + W; xx += G * .055) { for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(xx + Math.cos(k * 1.57) * r * 1.2, yy + Math.sin(k * 1.57) * r * 1.2, r, r * .55, k * 1.57, 0, 7); g.fill() } } g.globalAlpha = 1;
    g.fillStyle = '#c9a46b'; g.fillRect(x0, y0 + H * .82, W, H * .18); g.fillRect(x0, y0, W * .08, H); g.fillRect(x0 + W * .92, y0, W * .08, H) }
  if (f === 'stepp' || f === 'kette') { const st = G * .075; for (let a = -H; a < W + H; a += st) for (let b = 0; b < H + st; b += st) { const px = x0 + a + b, py = y0 + b; const rg = g.createRadialGradient(px - st * .2, py - st * .2, 1, px, py, st * .75); rg.addColorStop(0, 'rgba(255,255,255,.22)'); rg.addColorStop(1, 'rgba(0,0,0,.18)'); g.fillStyle = rg; g.beginPath(); g.moveTo(px, py - st / 2); g.lineTo(px + st / 2, py); g.lineTo(px, py + st / 2); g.lineTo(px - st / 2, py); g.fill() }
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = Math.max(1, G * .006); for (let k = -H; k < W + H; k += st / Math.SQRT2 * 1.41) { g.beginPath(); g.moveTo(x0 + k, y0); g.lineTo(x0 + k + H, y0 + H); g.moveTo(x0 + k + H, y0); g.lineTo(x0 + k, y0 + H); g.stroke() } }
  if (f === 'knoten') { const st = G * .045; for (let y = y0; y < y0 + H; y += st) for (let x = x0 + ((y - y0) / st % 2) * st; x < x0 + W; x += st * 2) { g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x, y, st, st * .5); g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(x + st, y + st * .5, st, st * .5) } }
  // Klappe
  if (f === 'kette' || f === 'stepp' || f === 'klappe' || f === 'birkin') { const kh = H * (f === 'birkin' ? .34 : .52); g.fillStyle = 'rgba(0,0,0,.16)'; g.beginPath();
    if (f === 'klappe') { g.moveTo(x0, y0); g.lineTo(x0 + W, y0); g.lineTo(x0 + W, y0 + kh * .7); g.quadraticCurveTo(cx, y0 + kh * 1.5, x0, y0 + kh * .7) } else { g.rect(x0, y0, W, kh) } g.fill();
    g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = Math.max(1, G * .008); g.beginPath(); if (f === 'klappe') { g.moveTo(x0, y0 + kh * .7); g.quadraticCurveTo(cx, y0 + kh * 1.5, x0 + W, y0 + kh * .7) } else { g.moveTo(x0, y0 + kh); g.lineTo(x0 + W, y0 + kh) } g.stroke()
    if (f === 'birkin') { for (const sx of [-1, 1]) { g.fillStyle = hell(c, .82); g.beginPath(); g.roundRect(cx + sx * W * .2 - W * .045, y0 - 1, W * .09, kh + H * .1, 2); g.fill() } } }
  // Ziernaht innen am Rand
  g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = Math.max(.8, G * .006); g.setLineDash([G * .014, G * .012]); g.save(); g.translate(cx, y0 + H / 2); g.scale(.93, .9); g.translate(-cx, -(y0 + H / 2)); koerper(); g.stroke(); g.restore(); g.setLineDash([]);
  // Glanzlicht
  const gl = g.createRadialGradient(x0 + W * .28, y0 + H * .25, 1, x0 + W * .28, y0 + H * .25, W * .55); gl.addColorStop(0, 'rgba(255,255,255,.28)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gl; g.fillRect(x0, y0, W, H);
  g.restore();
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = Math.max(1, G * .008); koerper(); g.stroke(); if (besitzt) { g.strokeStyle = 'rgba(255,255,255,.25)'; koerper(); g.stroke() }
  // Beschläge: Drehschloss, Vorhängeschloss mit Glocke, Schnalle, Dreieck-Emblem
  if (f === 'kette' || f === 'stepp') metall(cx - G * .055, y0 + H * .46, G * .11, G * .065, G * .012);
  else if (f === 'klappe') { g.strokeStyle = gold; g.lineWidth = lw * 1.1; g.beginPath(); g.roundRect(cx - G * .05, y0 + H * .5, G * .1, G * .07, G * .015); g.stroke(); g.fillStyle = gold; g.fillRect(cx - G * .006, y0 + H * .5, G * .012, G * .07) }
  else if (f === 'birkin') { metall(cx - W * .14, y0 + H * .28, W * .28, G * .03, 2); metall(cx - G * .03, y0 + H * .25, G * .06, G * .06, 3);
    g.strokeStyle = gold; g.lineWidth = lw * .9; g.beginPath(); g.arc(cx, y0 + H * .42, G * .025, Math.PI, 0); g.stroke(); metall(cx - G * .035, y0 + H * .42, G * .07, G * .06, G * .012);
    g.fillStyle = hell(c, .78); g.beginPath(); g.moveTo(x0 + W * .74, y0 + 2); g.lineTo(x0 + W * .79, y0 + H * .2); g.quadraticCurveTo(x0 + W * .74, y0 + H * .34, x0 + W * .69, y0 + H * .2); g.closePath(); g.fill();
    g.fillStyle = 'rgba(0,0,0,.4)'; for (const sx of [.12, .88]) { g.beginPath(); g.arc(x0 + W * sx, y0 + H + 1, G * .012, 0, 7); g.fill() } }
  else if (f === 'tonne') { metall(cx - G * .03, y0 + H * .08, G * .06, G * .055, G * .01); g.fillStyle = '#c9a46b'; for (const sx of [-1, 1]) g.fillRect(cx + sx * W * .17 - G * .022, y0, G * .044, H * .2) }
  else if (f === 'halb') { const ty = y0 + H * .34; g.fillStyle = besitzt ? '#111' : gold; g.beginPath(); g.moveTo(cx - W * .14, ty); g.lineTo(cx + W * .14, ty); g.lineTo(cx, ty + H * .2); g.closePath(); g.fill(); g.strokeStyle = gold; g.lineWidth = lw * .6; g.stroke() }
  g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(cx, G * .925, W * .5, G * .024, 0, 0, 7); g.fill(); g.restore() }
function fundZeigen(t, set, unter) { const kopf = t.selten === 3 ? 'IKONE GEKAUFT' : t.selten === 2 ? 'SELTENES STÜCK' : 'NEU IN DEINER KOLLEKTION';
  karteZeigen({ kopf, bild: taschenBild(t, 150, true), titel: t.name, sub: `${set.name} · ${BQ.SELTEN[t.selten].name}`, unter, farbe: BQ.SELTEN[t.selten].farbe, knopf: 'In die Kollektion' }) }
// Große Karte in der Bildmitte: Funde, Tagesbonus, Besuche. Mehrere warten hintereinander.
const KARTEN = [];
function karteZeigen(k) { KARTEN.push(k); if (KARTEN.length === 1) karteNaechste() }
function karteNaechste() { const k = KARTEN[0], el = document.getElementById('fund'); if (!el) return; if (!k) { el.hidden = true; return } el.replaceChildren(); el.style.setProperty('--selten', k.farbe || '#ff8fc7');
  const ok = el_('button', null, k.knopf || 'Weiter'); ok.onclick = () => { KARTEN.shift(); if (k.danach) k.danach(); karteNaechste(); if (BOUT.tab) boutiqueZeichnen() };
  el.append(el_('b', null, k.kopf)); if (k.bild) el.append(k.bild); el.append(el_('strong', null, k.titel)); if (k.sub) el.append(el_('span', null, k.sub)); if (k.inhalt) el.append(k.inhalt); el.append(el_('em', null, k.unter || ''), ok); el.hidden = false; save(); hud() }

// ---------- Fenster: Boutique und Kollektion ----------
const BOUT = { tab: 'laden', wahl: null, uhr: null, live: [], sig: '' };
// Nur neu aufbauen, wenn sich etwas Sichtbares ändert. Sonst laufen nur Balken und Zeiten weiter, damit kein Klick verloren geht.
function boutSig() { const b = boutStand(), { k, wert } = kasseStand(); return [BOUT.tab, BOUT.wahl, glowLevel().l, b.kasse, wert >= k.cap, wert < 1, b.regale.map(r => r ? r.w + (regalRest(r).rest <= 0) : '-').join()].join('|') }
function boutiqueAuf(tab) { boutStand(); if (typeof klinikZu === 'function') klinikZu(); if (INNEN) verlassen(); document.getElementById('card').hidden = true; offen = null; BOUT.tab = tab || 'laden'; BOUT.wahl = null; document.getElementById('bout').hidden = false; boutiqueZeichnen(); clearInterval(BOUT.uhr); BOUT.uhr = setInterval(() => { if (boutSig() !== BOUT.sig) boutiqueZeichnen(); else BOUT.live.forEach(f => f()) }, 1000) }
function boutiqueZu() { document.getElementById('bout').hidden = true; clearInterval(BOUT.uhr); document.querySelectorAll('#bBout,#bAlbum').forEach(x => x.classList.remove('an')) }
function el_(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e }
function boutiqueZeichnen() { const root = document.getElementById('bout'); if (!root || root.hidden) return; const body = root.querySelector('.bb'); body.replaceChildren(); BOUT.live = []; BOUT.sig = boutSig();
  root.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-pressed', b.dataset.tab === BOUT.tab));
  const g = glowLevel(); root.querySelector('.lv').textContent = `Level ${g.l}`;
  if (BOUT.tab === 'album') return albumZeichnen(body);
  if (BOUT.tab === 'freunde') return freundinnenZeichnen(body);
  const b = boutStand(), { k, wert } = kasseStand(), bon = setBonus();
  // Kasse
  const ka = el_('div', 'kasse' + (wert >= k.cap ? ' voll' : '')); const kl = el_('div'); kl.append(el_('small', null, `${k.name} · ${euro(Math.round(BQ.kasseProStunde(g.l) * bon))} pro Stunde`), el_('b', null, `${euro(wert)} / ${euro(k.cap)}`));
  const kb = el_('i'), kbar = el_('div', 'balken'), kz = el_('small'), kw = kl.querySelector('b'); kbar.append(kb); kl.append(kbar, kz);
  const kLive = () => { const w = kasseStand().wert; kw.textContent = `${euro(w)} / ${euro(k.cap)}`; kb.style.width = Math.round(w / k.cap * 100) + '%'; kz.textContent = w >= k.cap ? 'Kasse voll: Die Boutique verdient erst wieder, wenn du leerst.' : `Voll in ${dauer((k.cap - w) / (BQ.kasseProStunde(g.l) * bon) * 3600)}` }; kLive(); BOUT.live.push(kLive);
  const kbt = el_('button', 'cta', 'Kasse leeren'); kbt.disabled = wert < 1; kbt.onclick = kasseLeeren; ka.append(kl, kbt); body.append(ka);
  const nk = BQ.KASSE[(b.kasse || 0) + 1]; if (nk) { const r = el_('div', 'ausbau'); r.append(el_('span', null, `${nk.name}: fasst ${euro(nk.cap)}`)); const bt = el_('button', null, g.l < nk.lvl ? `ab Level ${nk.lvl}` : euro(nk.preis)); bt.disabled = g.l < nk.lvl || ST.geld < nk.preis; bt.onclick = kasseAusbauen; r.append(bt); body.append(r) }
  // Regale
  const fertig = b.regale.filter(r => r && regalRest(r).rest <= 0).length;
  const kopf = el_('div', 'kopf'); kopf.append(el_('h4', null, `Regale ${b.regale.length}/${BQ.REGALE.length}`)); if (fertig > 1) { const a = el_('button', 'cta', `Alle ${fertig} abholen`); a.onclick = () => { let s = 0; b.regale.forEach((r, i) => { const e = abholen(i, true); if (e) s += e }); toast(`${fertig} Regale verkauft · +${euro(s)}`); save(); hud(); boutiqueZeichnen() }; kopf.append(a) } body.append(kopf);
  if (BOUT.wahl != null) body.append(warenWahl(BOUT.wahl));
  const grid = el_('div', 'regale');
  b.regale.forEach((r, i) => { const t = el_('button', 'regal');
    if (!r) { t.classList.add('leer'); t.append(el_('span', 'ic', '🛍️'), el_('b', null, 'Regal leer'), el_('em', 'knopf', '+ Einräumen')); if (BOUT.wahl === i) t.classList.add('wahl'); t.onclick = () => { BOUT.wahl = BOUT.wahl === i ? null : i; boutiqueZeichnen() } }
    else { const { w, rest } = regalRest(r); t.append(el_('span', 'ic', w.icon), el_('b', null, w.name));
      if (rest <= 0) { t.classList.add('fertig'); t.append(el_('small', null, 'Verkauft!'), el_('em', 'knopf', `Abholen +${euro(Math.round(w.vk * bon))}`)); t.onclick = () => { abholen(i); save(); hud(); boutiqueZeichnen() } }
      else { const bar = el_('div', 'balken'), f = el_('i'), z = el_('small'); bar.append(f); t.append(bar, z); t.disabled = true;
        const live = () => { const x = regalRest(r).rest; f.style.width = Math.round((1 - x / w.zeit) * 100) + '%'; z.textContent = `noch ${dauer(x)}` }; live(); BOUT.live.push(live) } }
    grid.append(t) });
  const nr = BQ.REGALE[b.regale.length]; if (nr) { const t = el_('button', 'regal zu'); t.append(el_('span', 'ic', '🔒'), el_('b', null, `${b.regale.length + 1}. Regal`), g.l < nr.lvl ? el_('small', null, `ab Level ${nr.lvl}`) : el_('em', 'knopf', `Aufbauen ${euro(nr.preis)}`)); t.disabled = g.l < nr.lvl || ST.geld < nr.preis; t.onclick = () => regalKaufen(b.regale.length); grid.append(t) }
  body.append(grid);
  const hin = el_('p', 'hin', bon > 1 ? `Deine Sets und dein Ruhm (${ruhmStufe().name}) bringen +${Math.round((bon - 1) * 100)} % auf alles, was die Boutique verdient.` : 'Jeder Verkauf kann eine Tasche für die Kollektion bringen. Lange Ware findet öfter seltene Stücke.'); body.append(hin);
  const t1 = el_('button', 'test', 'Test: eine Stunde vorspulen'); t1.onclick = () => { b.vs = (b.vs || 0) + 3.6e6; save(); boutiqueZeichnen() }; body.append(t1) }
function warenWahl(i) { const box = el_('div', 'wahlbox'); const g = glowLevel().l, b = boutStand();
  for (const w of BQ.WARE) { const r = el_('div', 'ware'); const l = el_('div'); l.append(el_('b', null, `${w.icon} ${w.name}`), el_('small', null, `${dauer(w.zeit)} · Einkauf ${euro(w.ek)} · Erlös ${euro(Math.round(w.vk * setBonus()))} · +${w.xp} XP`));
    const ok = el_('button', 'cta', g < w.lvl ? `ab Level ${w.lvl}` : 'Einräumen'); ok.disabled = g < w.lvl || ST.geld < w.ek; ok.onclick = () => { einraeumen(i, w.id); BOUT.wahl = null; save(); hud(); boutiqueZeichnen() };
    const leer = b.regale.filter(x => !x).length; r.append(l, ok);
    if (leer > 1 && g >= w.lvl) { const alle = el_('button', null, `Alle ${leer}`); alle.disabled = ST.geld < w.ek * leer; alle.onclick = () => { b.regale.forEach((x, j) => { if (!x) einraeumen(j, w.id) }); BOUT.wahl = null; save(); hud(); boutiqueZeichnen() }; r.append(alle) }
    box.append(r) } return box }
function albumZeichnen(body) { const zahl = ALLE_TASCHEN.filter(t => ST.album[t.id]).length, sets = BQ.SETS.filter(setKomplett).length;
  const k = el_('div', 'albumkopf'); k.append(el_('b', null, `${zahl} / ${ALLE_TASCHEN.length} Taschen`), el_('span', null, `${sets} / ${BQ.SETS.length} Sets komplett`)); body.append(k);
  const so = el_('div', 'sammeln'); so.append(el_('b', null, 'So sammelst du Taschen'));
  for (const [ic, t] of [['💸', 'Mit deiner Boutique Geld verdienen: Ware einräumen, verkaufen, Kasse leeren.'], ['👜', 'Bei Maison du Sac kaufen: Dort gibt es alle Taschen der Kollektion, von 2.000 € bis zur Ikone. Gekauft heißt: sofort in deiner Kollektion.'], ['✨', 'Volles Set einer Marke: dauerhaft mehr Umsatz in deiner Boutique.']]) { const z = el_('div', 'weg'); z.append(el_('span', null, ic), el_('small', null, t)); so.append(z) }
  const los = el_('button', 'cta', 'Zu Maison du Sac'); los.onclick = () => { boutiqueZu(); const b = B.find(x => x.title === 'Maison du Sac'); if (b) { const [tx, ty] = tuer(b); laufeZu(tx, ty, b) } }; so.append(los); body.append(so);
  for (const s of BQ.SETS) { const n = s.taschen.filter(t => ST.album[t.id]).length; const sec = el_('div', 'set' + (n === 5 ? ' komplett' : ''));
    const h = el_('div', 'setkopf'); h.append(el_('b', null, s.name), el_('span', null, n === 5 ? `Komplett · +${Math.round(s.bonus * 100)} % Erlös` : `${n}/5 · Belohnung +${Math.round(s.bonus * 100)} % Erlös, +${s.stil} Stil`)); sec.append(h);
    const reihe = el_('div', 'taschen');
    for (const t of s.taschen) { const hat = !!ST.album[t.id]; const kachel = el_('button', 'tasche s' + t.selten + (hat ? '' : ' fehlt')); kachel.append(taschenBild(t, 64, hat));
      kachel.append(el_('small', null, hat ? t.name : `${BQ.SELTEN[t.selten].name} · ${euro(BQ.preisVonTasche(s.id, t, s.taschen.indexOf(t)))}`)); if (ST.traegtTasche === t.id) kachel.classList.add('traegt');
      if (hat) kachel.onclick = () => { ST.traegtTasche = ST.traegtTasche === t.id ? null : t.id; save(); hud(); toast(ST.traegtTasche ? `Du trägst jetzt ${t.name}` : 'Tasche abgelegt'); boutiqueZeichnen() }; else kachel.disabled = true;
      reihe.append(kachel) }
    sec.append(reihe); body.append(sec) }
  body.append(el_('p', 'hin', 'Tippe auf eine Tasche aus deiner Kollektion, um sie in der Stadt zu tragen.')) }

// ---------- Über dem Haus in der Stadt: was gerade los ist ----------
function boutiqueStatus() { const b = boutStand(), n = b.regale.filter(r => r && regalRest(r).rest <= 0).length, { k, wert } = kasseStand(), leer = b.regale.filter(r => !r).length;
  if (n) return { text: `${n} verkauft · abholen`, farbe: '#ff4fa3' }; if (wert >= k.cap) return { text: 'Kasse voll', farbe: '#ff4fa3' }; if (leer) return { text: `${leer} ${leer === 1 ? 'Regal' : 'Regale'} leer`, farbe: '#d9a92a' };
  const rest = Math.min(...b.regale.map(r => regalRest(r).rest)); return { text: `nächster Verkauf ${dauer(Math.ceil(rest / 60) * 60)}`, farbe: '#2a1e36' } }
function boutiqueBlase() { const h = B.find(b => b.meins === 'boutique'); if (!h) return; const [x, y] = pt(h.x + 2, h.y + 2, h.h + 34); if (x < -120 || x > W + 120 || y < -60 || y > H + 60) return;
  const st = boutiqueStatus(); const text = st.text, farbe = st.farbe === '#2a1e36' ? 'rgba(20,14,28,.85)' : st.farbe === '#d9a92a' ? '#e6c76a' : st.farbe;
  const s = Math.min(1.3, Math.max(.8, Z / DPR)) * DPR; g.save(); g.font = `800 ${11 * s}px Inter, sans-serif`; const w = g.measureText(text).width + 22 * s, hh = 22 * s;
  g.fillStyle = farbe; g.shadowColor = farbe === 'rgba(20,14,28,.85)' ? 'transparent' : farbe; g.shadowBlur = 14 * s; g.beginPath(); g.roundRect(x - w / 2, y - hh, w, hh, hh / 2); g.fill(); g.shadowBlur = 0;
  g.beginPath(); g.moveTo(x - 6 * s, y); g.lineTo(x + 6 * s, y); g.lineTo(x, y + 7 * s); g.fill();
  g.fillStyle = farbe === '#e6c76a' ? '#16171a' : '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, x, y - hh / 2 + .5 * s); g.restore() }

// ---------- Hinweise: Zähler am Knopf und Gruß beim Wiederkommen ----------
function boutiqueZaehler() { const b = boutStand(); const n = b.regale.filter(r => r && regalRest(r).rest <= 0).length + (kasseStand().wert >= kasseStand().k.cap ? 1 : 0);
  const k = document.getElementById('bBout'); if (k) k.dataset.n = n || '' }
function boutiqueWillkommen() { const b = boutStand(); const n = b.regale.filter(r => r && regalRest(r).rest <= 0).length, { wert } = kasseStand();
  if (n || wert > 200) banner('DEINE BOUTIQUE', n ? `${n} ${n === 1 ? 'Regal' : 'Regale'} ausverkauft` : 'Kundinnen waren da', `Kasse: ${euro(wert)}`) }
document.getElementById('bBout').onclick = () => boutiqueAuf('laden');
document.getElementById('bAlbum').onclick = () => boutiqueAuf('album');
document.querySelectorAll('#bout [data-tab]').forEach(b => b.onclick = () => { BOUT.tab = b.dataset.tab; BOUT.wahl = null; boutiqueZeichnen() });
document.querySelector('#bout .zu').onclick = boutiqueZu;
boutStand(); setInterval(boutiqueZaehler, 2000); setTimeout(() => { boutiqueZaehler(); xpLeiste() }, 2500);
