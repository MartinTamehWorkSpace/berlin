// Berlin City · op.js · Selbst behandeln und operieren: kurzes Geschicklichkeitsspiel direkt an der Liege.
// Spritze und Zugang: Zielring zieht sich zusammen, tippen wenn er die Mitte trifft. Schnitt: Linie mit dem Finger nachfahren.
// Naht: Punkte der Reihe nach, der Faden folgt. Gerät: Fläche abfahren, bevor die Zeit abläuft.
// Ergebnis 0 bis 100: Behandlung ist sofort fertig, das Honorar steigt bis aufs Doppelte, du sammelst Anerkennung.
// Anerkennung macht dich zur gefragten Referentin: ab 100 doppelte, ab 300 dreifache Kongress-Gagen.
const OP_ART = { botox: ['spritze'], lippen: ['spritze'], drip: ['zugang'], nad: ['zugang'], check: ['zugang'], lid: ['schnitt', 'naht'], nase: ['schnitt', 'naht'], lift: ['schnitt', 'naht'],
  needling: ['flaeche'], laser: ['flaeche'], rf: ['flaeche'], hydra: ['flaeche'], led: ['flaeche'], kryo: ['flaeche'] };
const OP_TEXT = { spritze: 'Tipp, wenn der Ring den Punkt umschließt', zugang: 'Tipp auf die Vene, wenn der Ring sie trifft', schnitt: 'Fahr die gestrichelte Linie mit dem Finger nach', naht: 'Tipp die Punkte der Reihe nach: 1, 2, 3 …', flaeche: 'Fahr mit dem Finger die ganze Fläche ab' };
const OP_NAME = { spritze: 'Injektion', zugang: 'Zugang legen', schnitt: 'Schnitt', naht: 'Naht', flaeche: 'Gerät führen' };
const ANERKENNUNG = [{ ab: 0, faktor: 1, name: 'Ärztin' }, { ab: 100, faktor: 2, name: 'Gefragte Referentin' }, { ab: 300, faktor: 3, name: 'Koryphäe' }];
const anerkennungStufe = k => ANERKENNUNG.reduce((s, x) => (k.anerkennung || 0) >= x.ab ? x : s, ANERKENNUNG[0]);
const kannSelbst = (l) => !!(l && OP_ART[l.kundin.beh] && l.selbst == null && liegeRest(l) > 0);
function opStarten(i) { const k = klinikStand(), l = k.liegen[i]; if (!kannSelbst(l) || unterwegs(k)) return; aktivSein(k);
  const b = behandlung(l.kundin.beh), schritte = OP_ART[b.id]; let el = document.getElementById('opSpiel'); if (!el) { el = document.createElement('div'); el.id = 'opSpiel'; el.className = 'opspiel'; document.body.append(el) }
  el.replaceChildren(); const kopf = el_('small', 'bkopf', `${b.icon} Du behandelst selbst · ${l.kundin.name}`), titel = el_('h3', null, b.name), punkteLeiste = el_('div', 'opschritte'), auftrag = el_('p', 'opauftrag'),
    cv = document.createElement('canvas'), fuss = el_('div', 'opfuss'), zu = el_('button', 'bzu', '×');
  cv.width = 360; cv.height = 360; cv.className = 'opfeld'; zu.title = 'Abbrechen, die Behandlung läuft normal weiter'; zu.onclick = () => { el.hidden = true; aus = true }; el.append(zu, kopf, titel, punkteLeiste, auftrag, cv, fuss); el.hidden = false;
  const g = cv.getContext('2d'), R = Math.random; let nr = 0, gesamt = 0, ziele = [], linie = [], spur = [], faden = [], gedrueckt = false, abgedeckt = new Set(), bis = 0, aus = false, ringT = 0, meldung = null;
  function leiste() { punkteLeiste.replaceChildren(...schritte.map((a, j) => el_('span', j < nr ? 'fertig' : j === nr ? 'jetzt' : '', `${j + 1} ${OP_NAME[a]}`))) }
  // Gesicht als Bühne, damit klar ist, wo man arbeitet
  function gesicht() { g.clearRect(0, 0, 360, 360); g.fillStyle = '#1d1426'; g.fillRect(0, 0, 360, 360);
    g.fillStyle = '#3a2416'; g.beginPath(); g.ellipse(180, 150, 140, 150, 0, Math.PI, 0); g.fill();
    const v = g.createLinearGradient(0, 40, 0, 340); v.addColorStop(0, '#f6e1d3'); v.addColorStop(1, '#e3b9a0'); g.fillStyle = v; g.beginPath(); g.ellipse(180, 190, 118, 150, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(90,50,40,.55)'; g.lineWidth = 3; g.lineCap = 'round';
    for (const s of [-1, 1]) { g.beginPath(); g.moveTo(180 + s * 30, 140); g.quadraticCurveTo(180 + s * 55, 128, 180 + s * 80, 138); g.stroke(); g.beginPath(); g.ellipse(180 + s * 52, 160, 18, 7, 0, 0, Math.PI * 2); g.stroke() }
    g.beginPath(); g.moveTo(180, 170); g.quadraticCurveTo(172, 215, 182, 228); g.stroke();
    g.strokeStyle = 'rgba(190,90,100,.8)'; g.lineWidth = 4; g.beginPath(); g.moveTo(150, 262); g.quadraticCurveTo(180, 276, 210, 262); g.stroke() }
  function arm() { g.clearRect(0, 0, 360, 360); g.fillStyle = '#1d1426'; g.fillRect(0, 0, 360, 360); const v = g.createLinearGradient(0, 110, 0, 250); v.addColorStop(0, '#f2d5c2'); v.addColorStop(1, '#ddb197'); g.fillStyle = v;
    g.beginPath(); g.roundRect(20, 120, 320, 120, 60); g.fill(); g.strokeStyle = 'rgba(70,110,200,.55)'; g.lineWidth = 6; g.beginPath(); g.moveTo(30, 190); g.bezierCurveTo(120, 170, 220, 205, 330, 182); g.stroke() }
  const venePunkt = u => { const t = u, x = (1 - t) ** 3 * 30 + 3 * (1 - t) ** 2 * t * 120 + 3 * (1 - t) * t * t * 220 + t ** 3 * 330, y = (1 - t) ** 3 * 190 + 3 * (1 - t) ** 2 * t * 170 + 3 * (1 - t) * t * t * 205 + t ** 3 * 182; return { x, y } };
  function schrittStarten() { const art = schritte[nr]; leiste(); auftrag.textContent = OP_TEXT[art]; ziele = []; linie = []; spur = []; faden = []; abgedeckt = new Set(); ringT = 0;
    if (art === 'spritze') { const orte = [[128, 132], [232, 132], [180, 112], [150, 250], [210, 250]]; for (const [x, y] of orte) ziele.push({ x: x + (R() - .5) * 10, y: y + (R() - .5) * 10, t: false }) }
    if (art === 'zugang') { const p = venePunkt(.35 + R() * .3); ziele.push({ x: p.x, y: p.y, t: false }) }
    if (art === 'schnitt') { const y0 = 110 + R() * 30; for (let x = 90; x <= 270; x += 5) linie.push({ x, y: y0 + Math.sin((x - 90) / 180 * Math.PI) * 22 }) }
    if (art === 'naht') { const y0 = 120 + R() * 30; for (let j = 0; j < 6; j++) ziele.push({ x: 95 + j * 34, y: y0 + Math.sin(j / 5 * Math.PI) * 20 + (j % 2 ? 12 : -12), t: false, nr: j }) }
    if (art === 'flaeche') bis = Date.now() + 10000 }
  function text(t, x, y, f) { meldung = { t, x, y, f, bis: Date.now() + 700 } }
  // Zeichnen läuft als Animation, damit Ringe pulsieren und Rückmeldungen schweben
  function zeichnen() { if (aus || el.hidden) return; const art = schritte[nr]; if (!art) return; art === 'zugang' ? arm() : gesicht(); ringT += 1 / 60;
    if (art === 'flaeche') { g.fillStyle = 'rgba(47,224,210,.14)'; g.fillRect(100, 120, 160, 160); g.fillStyle = 'rgba(47,224,210,.6)'; for (const c of abgedeckt) { const [cx, cy] = c.split(',').map(Number); g.fillRect(100 + cx * 20, 120 + cy * 20, 20, 20) }
      g.strokeStyle = '#2fe0d2'; g.lineWidth = 2; g.setLineDash([6, 5]); g.strokeRect(100, 120, 160, 160); g.setLineDash([]);
      const rest = Math.max(0, (bis - Date.now()) / 1000), anteil = abgedeckt.size / 64; g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(20, 322, 320, 22); g.fillStyle = '#2fe0d2'; g.fillRect(20, 322, 320 * anteil, 22);
      g.fillStyle = '#fff'; g.font = '800 13px Inter, sans-serif'; g.textAlign = 'center'; g.fillText(`${Math.round(anteil * 100)} % · noch ${Math.ceil(rest)} Sek.`, 180, 338) }
    if (linie.length) { g.strokeStyle = '#7a3a5a'; g.setLineDash([8, 6]); g.lineWidth = 3; g.beginPath(); linie.forEach((p, j) => j ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.stroke(); g.setLineDash([]);
      g.fillStyle = '#ff4fa3'; g.beginPath(); g.arc(linie[0].x, linie[0].y, 9, 0, Math.PI * 2); g.fill(); g.fillStyle = '#fff'; g.font = '800 11px Inter, sans-serif'; g.textAlign = 'center'; g.fillText('Start', linie[0].x, linie[0].y - 14) }
    if (spur.length) for (let j = 1; j < spur.length; j++) { const p = spur[j]; g.strokeStyle = p.gut ? '#1fb5a5' : '#e0344f'; g.lineWidth = 4; g.beginPath(); g.moveTo(spur[j - 1].x, spur[j - 1].y); g.lineTo(p.x, p.y); g.stroke() }
    if (faden.length > 1) { g.strokeStyle = '#3c2a6a'; g.lineWidth = 2.5; g.beginPath(); faden.forEach((p, j) => j ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.stroke() }
    const naechstes = art === 'naht' ? ziele.filter(q => !q.t).sort((a, b) => a.nr - b.nr)[0] : null;
    for (const p of ziele) { if (p.t) { g.fillStyle = '#1fb5a5'; g.beginPath(); g.arc(p.x, p.y, 7, 0, Math.PI * 2); g.fill(); continue }
      g.fillStyle = '#ff4fa3'; g.beginPath(); g.arc(p.x, p.y, 5, 0, Math.PI * 2); g.fill();
      if (art === 'spritze' || art === 'zugang') { const r = ringRadius(); g.strokeStyle = r < 14 ? '#3ee08f' : 'rgba(255,255,255,.85)'; g.lineWidth = 3; g.beginPath(); g.arc(p.x, p.y, r, 0, Math.PI * 2); g.stroke() }
      if (art === 'naht') { const an = p === naechstes; g.strokeStyle = an ? '#ffd166' : 'rgba(255,79,163,.6)'; g.lineWidth = an ? 4 : 2; g.beginPath(); g.arc(p.x, p.y, an ? 15 + Math.sin(ringT * 8) * 2 : 12, 0, Math.PI * 2); g.stroke();
        g.fillStyle = '#16171a'; g.font = '800 12px Inter, sans-serif'; g.textAlign = 'center'; g.fillText(String(p.nr + 1), p.x, p.y - 20) } }
    if (meldung && Date.now() < meldung.bis) { g.fillStyle = meldung.f; g.font = '900 20px Inter, sans-serif'; g.textAlign = 'center'; g.fillText(meldung.t, meldung.x, meldung.y - 24 - (700 - (meldung.bis - Date.now())) / 30) }
    if (art === 'flaeche' && Date.now() > bis) return schrittFertig(abgedeckt.size / 64 * 100);
    requestAnimationFrame(zeichnen) }
  // Ring: zieht sich in 1,6 Sekunden von 60 auf 0 zusammen und beginnt von vorn
  const ringRadius = () => 60 * (1 - (ringT % 1.6) / 1.6);
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * 360 / r.width, y: (e.clientY - r.top) * 360 / r.height } };
  function schrittFertig(wert) { gesamt += Math.max(0, Math.min(100, wert)); nr++; if (nr < schritte.length) { schrittStarten(); return } leiste(); abschluss(Math.round(gesamt / schritte.length)) }
  cv.onpointerdown = e => { const p = pos(e), art = schritte[nr]; if (!art) return; gedrueckt = true; cv.setPointerCapture(e.pointerId);
    if (art === 'spritze' || art === 'zugang') { const offen = ziele.filter(q => !q.t).sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y)), z = offen[0]; if (!z) return;
      const d = Math.hypot(z.x - p.x, z.y - p.y); if (d > 45) { text('Daneben', p.x, p.y, '#ff6b6b'); return } const zeit = Math.max(0, 100 - ringRadius() * 2.2), lage = Math.max(0, 100 - d * 3), w = Math.round(zeit * .6 + lage * .4);
      z.t = true; z.wert = w; text(w >= 85 ? 'Perfekt' : w >= 60 ? 'Gut' : 'Knapp', z.x, z.y, w >= 85 ? '#3ee08f' : w >= 60 ? '#ffd166' : '#ff8fc7'); ringT = 0; if (ziele.every(q => q.t)) setTimeout(() => schrittFertig(ziele.reduce((s, q) => s + q.wert, 0) / ziele.length), 500) }
    if (art === 'naht') { const z = ziele.filter(q => !q.t).sort((a, b) => a.nr - b.nr)[0]; if (!z) return; const d = Math.hypot(z.x - p.x, z.y - p.y); if (d > 40) { text('Erst Punkt ' + (z.nr + 1), p.x, p.y, '#ff6b6b'); return }
      z.t = true; z.wert = Math.max(0, 100 - d * 3); faden.push({ x: z.x, y: z.y }); text(z.wert >= 80 ? 'Sauber' : 'Ok', z.x, z.y, '#3ee08f'); if (ziele.every(q => q.t)) setTimeout(() => schrittFertig(ziele.reduce((s, q) => s + q.wert, 0) / ziele.length), 500) }
    if (art === 'schnitt') { spur = []; bewegen(p) } if (art === 'flaeche') bewegen(p) };
  function bewegen(p) { const art = schritte[nr];
    if (art === 'schnitt') { const ab = Math.min(...linie.map(r => Math.hypot(r.x - p.x, r.y - p.y))); spur.push({ x: p.x, y: p.y, ab, gut: ab < 10 }) }
    if (art === 'flaeche') { for (const [ox, oy] of [[0, 0], [12, 0], [-12, 0], [0, 12], [0, -12]]) { const cx = Math.floor((p.x + ox - 100) / 20), cy = Math.floor((p.y + oy - 120) / 20); if (cx >= 0 && cx < 8 && cy >= 0 && cy < 8) abgedeckt.add(cx + ',' + cy) } if (abgedeckt.size >= 64) schrittFertig(100) } }
  cv.onpointermove = e => { if (gedrueckt) bewegen(pos(e)) };
  cv.onpointerup = () => { gedrueckt = false; if (schritte[nr] === 'schnitt' && spur.length > 5) { const ab = spur.reduce((s, q) => s + q.ab, 0) / spur.length, laenge = (Math.max(...spur.map(q => q.x)) - Math.min(...spur.map(q => q.x))) / 180;
    const w = (100 - ab * 4) * Math.max(0, Math.min(1, laenge)); text(w >= 80 ? 'Präzise' : w >= 50 ? 'Gut' : 'Zu ungenau', 180, 90, w >= 50 ? '#3ee08f' : '#ff6b6b'); setTimeout(() => schrittFertig(w), 500) } };
  function abschluss(wert) { aus = true; const kk = klinikStand(), ll = kk.liegen[i]; if (!ll || ll.kundin.id !== l.kundin.id) { el.hidden = true; return }
    ll.selbst = wert; ll.persoenlich = true; ll.t0 = Date.now() - behandlung(ll.kundin.beh).dauer * 1000; const plus = Math.round(wert / 10); kk.anerkennung = (kk.anerkennung || 0) + plus; aktivSein(kk); save();
    const st = anerkennungStufe(kk), sterne = wert >= 85 ? 3 : wert >= 60 ? 2 : 1;
    // Ergebnis groß: Sterne, Punkte, was es bringt, ein klarer Knopf zum Kassieren
    g.fillStyle = 'rgba(18,12,28,.88)'; g.fillRect(0, 0, 360, 360); g.textAlign = 'center'; g.font = '40px sans-serif'; g.fillText('⭐'.repeat(sterne) + '☆'.repeat(3 - sterne), 180, 140);
    g.fillStyle = '#fff'; g.font = '900 54px Inter, sans-serif'; g.fillText(String(wert), 180, 210); g.font = '700 14px Inter, sans-serif'; g.fillStyle = '#b9b2c9'; g.fillText('von 100 Punkten', 180, 234);
    auftrag.textContent = wert >= 85 ? 'Perfekt gearbeitet.' : wert >= 60 ? 'Sauber gearbeitet.' : 'Geschafft, da geht noch mehr.';
    const info = el_('p', 'opinfo', `Honorar +${wert} % · Anerkennung +${plus} (${st.name})`), ok = el_('button', 'cta opkasse', `💶 Kassieren ${euro(Math.round(honorar(behandlung(ll.kundin.beh), kk, ll.kundin) * (1 + KQ.BONUS_PERSOENLICH + (ll.express ? KQ.BONUS_EXPRESS : 0)) * (1 + wert / 100)))}`);
    ok.onclick = () => { el.hidden = true; abrechnen(i) }; fuss.replaceChildren(info, ok); klinikZeichnen() }
  schrittStarten(); requestAnimationFrame(zeichnen) }
