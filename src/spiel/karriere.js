// Berlin · karriere.js · Drei Karrieren statt Kosmetikinstitut (Martin 19.11.2026): am Alexanderplatz (Weltzeituhr) wählt man
// Dealer, Gastro-Boss oder Influencer. Jede Karriere hat eigene Aktionen an echten Orten, eine Missionskette und eigene Ränge.
// Dealer: Deals an Görli, RAW und Kotti bringen Geld und Fahndungssterne; Streifenwagen fahren durch die Stadt und jagen dich.
// Gastro: Restaurants kaufen, Einnahmen laufen in Echtzeit, Kasse vor Ort leeren, Events geben. Influencer: an Hotspots Content drehen.
const KARRIEREN = {
  dealer: { n: 'Dealer', ic: '💊', t: 'Ecken, Kunden, Cash. Und immer ein Auge auf die Polizei.', raenge: ['Läufer', 'Straßenverkäufer', 'Kiezgröße', 'Großhändler', 'Pate von Kreuzberg'] },
  gastro: { n: 'Gastro-Boss', ic: '🍽️', t: 'Kauf die Läden, die ganz Berlin liebt. Jeder Tisch zahlt mit.', raenge: ['Kellnerin', 'Barbesitzerin', 'Gastronomin', 'Gastro-Imperium', 'Stern-Legende'] },
  influ: { n: 'Influencer', ic: '📸', t: 'Zeig dich an den richtigen Orten. Reichweite ist Macht.', raenge: ['Newcomer', 'Micro', 'Kiez-Ikone', 'Berlin-Star', 'Mega-Influencer'] } };
/* Orte in Spielfeldern (x, y). Gebäude werden über ihren Titel gefunden, damit der Stadtplan frei bleibt */
const haus = t => { const b = B.find(x => x.title === t); return b ? { x: b.x + 2, y: b.y + 4.6 } : null };
const ORTE = {
  goerli: { n: 'Görlitzer Park', p: () => haus('Lofts Kreuzberg') }, raw: { n: 'RAW-Gelände', p: () => haus('Berghain') }, kotti: { n: 'Kottbusser Tor', p: () => haus('Platte Friedrichshain') },
  tor: { n: 'Brandenburger Tor', p: () => ({ x: PARK.x + 2, y: PARK.y + 4.4 }) }, alex: { n: 'Fernsehturm', p: () => haus('Alex Tower') }, ufer: { n: 'East Side Ufer', p: () => ({ x: 14, y: 42.4 }) },
  berg: { n: 'Schlange vorm Berghain', p: () => haus('Berghain') }, scorp: { n: 'Scorpius Sunset', p: () => ({ x: 37, y: 42.6 }) }, kadeve: { n: 'KaDeVe', p: () => haus('KaDeVe') } };
const LAEDEN = [
  { id: 'star', t: 'Café Zweistein', preis: 250000, proMin: 900 }, { id: 'hug', t: 'Ryotei 398', preis: 900000, proMin: 3200 }, { id: 'riva', t: 'Papillong', preis: 2500000, proMin: 9000 },
  { id: 'boot', t: 'Grill Royale', preis: 4000000, proMin: 15000 }, { id: 'borch', t: 'Borchert', preis: 8000000, proMin: 32000 }, { id: 'nicky', t: 'Scorpius Berlin', preis: 20000000, proMin: 90000 }];
const MISSIONEN = {
  dealer: [
    { t: 'Erster Deal am Görlitzer Park', ok: k => k.deals >= 1, lohn: 5000 }, { t: '3 Deals ohne erwischt zu werden', ok: k => k.serie >= 3, lohn: 20000 },
    { t: 'Deal am RAW-Gelände', ok: k => k.orte.raw, lohn: 30000 }, { t: 'Deal am Kottbusser Tor', ok: k => k.orte.kotti, lohn: 30000 },
    { t: 'Entkomme mit 3 Sternen der Polizei', ok: k => k.entkommen3, lohn: 80000 }, { t: '25 Deals insgesamt', ok: k => k.deals >= 25, lohn: 250000 },
    { t: 'Eine Million auf der Straße verdient', ok: k => k.umsatz >= 1e6, lohn: 500000 }],
  gastro: [
    { t: 'Kauf dein erstes Lokal', ok: k => k.laeden >= 1, lohn: 20000 }, { t: 'Leere zum ersten Mal die Kasse', ok: k => k.kassen >= 1, lohn: 15000 },
    { t: 'Besitze 3 Lokale', ok: k => k.laeden >= 3, lohn: 300000 }, { t: 'Gib einen Promi-Abend', ok: k => k.events >= 1, lohn: 200000 },
    { t: '50.000 € pro Minute Einnahmen', ok: k => gastroProMin() >= 50000, lohn: 1e6 }, { t: 'Kauf das Scorpius', ok: () => !!(ST.gastro && ST.gastro.nicky), lohn: 5e6 }],
  influ: [
    { t: 'Dreh Content am Brandenburger Tor', ok: k => k.orte.tor, lohn: 5000 }, { t: 'Zeig dich am Fernsehturm', ok: k => k.orte.alex, lohn: 8000 },
    { t: 'Sunset-Reel im Scorpius', ok: k => k.orte.scorp, lohn: 15000 }, { t: 'Story aus der Berghain-Schlange', ok: k => k.orte.berg, lohn: 20000 },
    { t: 'Ein Video geht viral', ok: k => k.viral >= 1, lohn: 50000 }, { t: 'An allen 6 Hotspots gedreht', ok: k => ['tor', 'alex', 'ufer', 'berg', 'scorp', 'kadeve'].every(o => k.orte[o]), lohn: 300000 },
    { t: '1 Million Follower', ok: () => (ST.follower || 0) >= 1e6, lohn: 1e6 }] };
const kst = () => { ST.kar = ST.kar || { deals: 0, serie: 0, umsatz: 0, orte: {}, laeden: 0, kassen: 0, events: 0, viral: 0, posts: 0, m: { dealer: 0, gastro: 0, influ: 0 }, pause: {} }; return ST.kar };
const nahAn = (o, r = 2.2) => { const p = ORTE[o] && ORTE[o].p(); return p && !INNEN && Math.hypot(ICH.x - p.x, ICH.y - p.y) < r };
const gastroProMin = () => LAEDEN.filter(l => ST.gastro && ST.gastro[l.id]).reduce((s, l) => s + l.proMin, 0);
function karRang(k) { const m = kst().m[k] || 0, R = KARRIEREN[k].raenge; return R[Math.min(R.length - 1, Math.floor(m * R.length / (MISSIONEN[k].length + 1)))] }

/* ---------- Polizei: 4 Streifenwagen fahren auf den Straßen, bei Fahndung jagt der nächste dich ---------- */
const POLIZEI = Array.from({ length: 4 }, (_, i) => ({ x: 1 + 8 * (i + 1), y: 1 + 8 * ((i * 2) % 4 + 1), ziel: null, jagd: false, blau: 0 }));
window.POLIZEI = POLIZEI;
const STR = [1, 9, 17, 25, 33, 41];
function polizeiWeiter(dt) { const k = ST.kar, sterne = (ST.fahndung || 0);
  for (const p of POLIZEI) { const d = Math.hypot(ICH.x - p.x, ICH.y - p.y); p.jagd = sterne > 0 && d < 7 + sterne * 3 && !INNEN;
    if (p.jagd) { const v = (2.4 + sterne * .35) * dt; p.x += (ICH.x - p.x) / Math.max(d, .01) * Math.min(v, d); p.y += (ICH.y - p.y) / Math.max(d, .01) * Math.min(v, d); p.blau += dt;
      if (d < 1.1) return erwischt() }
    else { if (!p.ziel || Math.hypot(p.ziel[0] - p.x, p.ziel[1] - p.y) < .1) { const gx = STR.reduce((a, b) => Math.abs(b - p.x) < Math.abs(a - p.x) ? b : a), gy = STR.reduce((a, b) => Math.abs(b - p.y) < Math.abs(a - p.y) ? b : a), r = Math.random();
        p.ziel = r < .5 ? [STR[Math.max(0, Math.min(4, STR.indexOf(gx) + (Math.random() < .5 ? -1 : 1)))], gy] : [gx, STR[Math.max(0, Math.min(4, STR.indexOf(gy) + (Math.random() < .5 ? -1 : 1)))]] }
      const dx = p.ziel[0] - p.x, dy = p.ziel[1] - p.y, dd = Math.hypot(dx, dy), v = Math.min(dd, 2.2 * dt); p.x += dx / (dd || 1) * v; p.y += dy / (dd || 1) * v; p.blau = sterne ? p.blau + dt : 0 } }
  /* Abtauchen: ohne Streife in der Nähe verliert man alle 20 Sekunden einen Stern */
  if (sterne > 0) { const nah = POLIZEI.some(p => Math.hypot(ICH.x - p.x, ICH.y - p.y) < 9); ST.fahndungUhr = (ST.fahndungUhr || 0) + (nah ? 0 : dt);
    if (ST.fahndungUhr > 20) { ST.fahndungUhr = 0; if (sterne >= 3 && k) k.entkommen3 = true; ST.fahndung = sterne - 1; toast(ST.fahndung ? `Abgetaucht: noch ${ST.fahndung} ★` : 'Die Polizei hat dich verloren'); missionPruefen(); save() } } }
function erwischt() { const k = kst(), strafe = Math.min(ST.geld * .1, 250000 * (ST.fahndung || 1)); ST.geld -= strafe; ST.fahndung = 0; ST.fahndungUhr = 0; k.serie = 0;
  for (const p of POLIZEI) { p.x += 6; p.jagd = false } banner('🚓 FESTGENOMMEN', 'Die Polizei hat dich am Wickel. Ware weg, Kaution bezahlt.', `−${euro(Math.round(strafe))}`); save(); hud() }

/* ---------- Aktionen an Orten ---------- */
function deal(o) { const k = kst(), t = Date.now(); if ((k.pause['d_' + o] || 0) > t) return toast('Hier ist gerade zu viel los. Komm gleich wieder.');
  const basis = [1500, 4000, 12000, 30000, 80000][Math.min(4, Math.floor((k.m.dealer || 0) / 1.5))], geld = Math.round(basis * (.7 + Math.random() * .8));
  k.pause['d_' + o] = t + 25000; ST.geld += geld; k.deals++; k.serie++; k.umsatz += geld; k.orte[o] = 1; ST.fahndung = Math.min(5, (ST.fahndung || 0) + (Math.random() < .55 ? 1 : 0)); ST.fahndungUhr = 0;
  banner('💊 DEAL', `${ORTE[o].n}: Kunde zufrieden`, `+${euro(geld)}${ST.fahndung ? ' · ' + '★'.repeat(ST.fahndung) : ''}`); missionPruefen(); save(); hud() }
function content(o) { const k = kst(), t = Date.now(); if ((k.pause['c_' + o] || 0) > t) return toast(`Hier hast du gerade gedreht. Wieder in ${dauer(Math.ceil(((k.pause['c_' + o]) - t) / 1000))}`);
  const viral = Math.random() < .12, fol = Math.round((200 + (k.m.influ || 0) * 400) * (viral ? 25 : 1) * (.7 + Math.random() * .6));
  k.pause['c_' + o] = t + 90000; k.orte[o] = 1; k.posts++; if (viral) k.viral++; ST.follower = (ST.follower || 0) + fol; ST.geld += Math.round(fol * 2.5); ICH.tanzBis = Date.now() + 6000;
  banner(viral ? '🔥 VIRAL' : '📸 CONTENT', `${ORTE[o].n}${viral ? ': Dein Video explodiert' : ''}`, `+${fol.toLocaleString('de-DE')} Follower · +${euro(Math.round(fol * 2.5))}`); missionPruefen(); save(); hud() }
function gastroKasse(l) { ST.gastroKasse = ST.gastroKasse || {}; const seit = Math.min(240, (Date.now() - (ST.gastroKasse[l.id] || ST.gastro[l.id])) / 60000), geld = Math.round(seit * l.proMin);
  if (geld < 1) return toast('Die Kasse ist noch leer'); ST.gastroKasse[l.id] = Date.now(); ST.geld += geld; kst().kassen++; banner('💶 KASSE', `${l.t}: Abend gut gelaufen`, `+${euro(geld)}`); missionPruefen(); save(); hud() }
function lokalKaufen(l) { if (ST.geld < l.preis) return toast('Dafür reicht dein Geld nicht'); ST.geld -= l.preis; ST.gastro = ST.gastro || {}; ST.gastro[l.id] = Date.now(); kst().laeden = Object.keys(ST.gastro).length;
  banner('🍽️ GEKAUFT', `${l.t} gehört jetzt dir`, `+${euro(l.proMin)} pro Minute`); missionPruefen(); save(); hud() }
function promiAbend(l) { const kosten = 150000; if (ST.geld < kosten) return toast('Ein Promi-Abend kostet 150.000 €'); ST.geld -= kosten; kst().events++; ST.follower = (ST.follower || 0) + 20000; ST.stil = (ST.stil || 0) + 40;
  ST.gastroKasse = ST.gastroKasse || {}; ST.gastroKasse[l.id] = (ST.gastroKasse[l.id] || Date.now()) - 60 * 60000; banner('🥂 PROMI-ABEND', `${l.t}: halb Mitte ist da`, '+20.000 Follower · Kasse +60 Min'); missionPruefen(); save(); hud() }

/* ---------- Missionen ---------- */
function missionPruefen() { const k = kst(), kar = ST.karriere; if (!kar) return; const L = MISSIONEN[kar];
  while (k.m[kar] < L.length && L[k.m[kar]].ok(k)) { const m = L[k.m[kar]]; k.m[kar]++; ST.geld += m.lohn; banner('✅ MISSION', m.t, `+${euro(m.lohn)} · ${karRang(kar)}`) } }
setInterval(() => { if (typeof ST !== 'undefined' && ST.karriere) missionPruefen() }, 3000);

/* ---------- Fenster: Karriere wählen und Überblick ---------- */
function karriereZeigen() { const kar = ST.karriere, cb = panel(kar ? `${KARRIEREN[kar].ic} ${KARRIEREN[kar].n} · ${karRang(kar)}` : '🕰️ Weltzeituhr · Wähl deine Karriere'); const k = kst();
  const absatz = t => { const p = document.createElement('p'); p.className = 'hin'; p.textContent = t; cb.append(p) }, knopf = (t, f, aus) => { const b = document.createElement('button'); b.className = 'big test'; b.style.marginTop = '5px'; b.textContent = t; b.disabled = !!aus; b.onclick = f; cb.append(b) };
  if (!kar) { absatz('Am Alexanderplatz entscheidest du, wer du in Berlin sein willst. Du kannst später wechseln, dein Fortschritt bleibt.');
    for (const [id, K] of Object.entries(KARRIEREN)) knopf(`${K.ic} ${K.n} · ${K.t}`, () => { ST.karriere = id; save(); banner('NEUE KARRIERE', `${K.ic} ${K.n}`, K.raenge[0]); karriereZeigen() }); return }
  const L = MISSIONEN[kar], i = k.m[kar] || 0; const h = document.createElement('h4'); h.textContent = 'Missionen'; cb.append(h);
  L.forEach((m, j) => absatz(`${j < i ? '✅' : j === i ? '▶️' : '▫️'} ${m.t} · ${euro(m.lohn)}`));
  const h2 = document.createElement('h4'); cb.append(h2);
  if (kar === 'dealer') { h2.textContent = 'Deine Ecken'; absatz(`Deals: ${k.deals} · Umsatz: ${euro(k.umsatz)} · Fahndung: ${'★'.repeat(ST.fahndung || 0) || 'keine'}`); absatz('Geh zum Görlitzer Park (bei den Lofts Kreuzberg), zum RAW-Gelände (am Berghain) oder zum Kotti (an der Platte). Dort erscheint der Knopf „Deal“. Streifenwagen mit Blaulicht jagen dich, solange du Sterne hast. Tauch ab, bis sie dich verlieren.') }
  if (kar === 'gastro') { h2.textContent = 'Lokale'; for (const l of LAEDEN) { const meins = ST.gastro && ST.gastro[l.id]; knopf(meins ? `✓ ${l.t} · ${euro(l.proMin)}/Min · Kasse vor Ort leeren` : `${l.t} kaufen · ${euro(l.preis)} · ${euro(l.proMin)}/Min`, () => { if (!meins) { lokalKaufen(l); karriereZeigen() } }, meins) }
    absatz(`Einnahmen gesamt: ${euro(gastroProMin())} pro Minute. Die Kasse füllt sich bis zu 4 Stunden, dann ist sie voll.`) }
  if (kar === 'influ') { h2.textContent = 'Hotspots'; for (const o of ['tor', 'alex', 'ufer', 'berg', 'scorp', 'kadeve']) absatz(`${k.orte[o] ? '✅' : '📍'} ${ORTE[o].n}`); absatz(`Posts: ${k.posts} · Viral: ${k.viral}. Am Hotspot erscheint der Knopf „Content drehen“.`) }
  const h3 = document.createElement('h4'); h3.textContent = 'Karriere wechseln'; cb.append(h3);
  for (const [id, K] of Object.entries(KARRIEREN)) if (id !== kar) knopf(`${K.ic} ${K.n}`, () => { ST.karriere = id; save(); karriereZeigen() }) }
window.karriereZeigen = karriereZeigen;

/* ---------- Kontextknopf unten: erscheint nur, wenn an diesem Ort etwas geht ---------- */
setInterval(() => { if (typeof ICH === 'undefined' || typeof ST === 'undefined') return; polizeiWeiter(.25); const leiste = aktionsLeiste(); let b = document.getElementById('bKarriere');
  if (!b) { b = document.createElement('button'); b.id = 'bKarriere'; b.className = 'anlegen'; leiste.append(b) }
  const kar = ST.karriere; let f = null, t = '';
  if (!INNEN && Math.hypot(ICH.x - (PLAZA.x + 2), ICH.y - (PLAZA.y + 2)) < 3.5) { t = kar ? '🕰️ Karriere & Missionen' : '🕰️ Karriere wählen'; f = karriereZeigen }
  else if (kar === 'dealer') { const o = ['goerli', 'raw', 'kotti'].find(o => nahAn(o)); if (o) { t = `💊 Deal · ${ORTE[o].n}`; f = () => deal(o) } }
  else if (kar === 'influ') { const o = ['tor', 'alex', 'ufer', 'berg', 'scorp', 'kadeve'].find(o => nahAn(o, 2.6)); if (o) { t = `📸 Content drehen · ${ORTE[o].n}`; f = () => content(o) } }
  else if (kar === 'gastro' && ST.gastro) { const l = LAEDEN.find(l => ST.gastro[l.id] && (INNEN ? INNEN.title === l.t : (() => { const p = haus(l.t); return p && Math.hypot(ICH.x - p.x, ICH.y - p.y) < 2.4 })()));
    if (l) { t = `💶 Kasse leeren · ${l.t}`; f = () => gastroKasse(l); let e = document.getElementById('bPromi'); if (!e) { e = document.createElement('button'); e.id = 'bPromi'; e.className = 'anlegen'; leiste.append(e) } e.textContent = '🥂 Promi-Abend · 150.000 €'; e.hidden = false; e.onclick = () => promiAbend(l) } }
  const pr = document.getElementById('bPromi'); if (pr && !(kar === 'gastro' && f)) pr.hidden = true;
  b.hidden = !f; if (f) { b.textContent = t; b.onclick = f }
  /* Fahndungssterne und Karriere oben in der Leiste */
  let c = document.getElementById('hKar'); if (!c) { const hud0 = document.querySelector('.hud'); if (!hud0) return; const d = document.createElement('div'); d.className = 'chip karriere'; d.innerHTML = '<span>Karriere</span><b id="hKar"></b>'; d.style.pointerEvents = 'auto'; d.style.cursor = 'pointer'; d.onclick = karriereZeigen; hud0.append(d); c = document.getElementById('hKar') }
  c.textContent = kar ? `${KARRIEREN[kar].ic} ${karRang(kar)}${ST.fahndung ? ' ' + '★'.repeat(ST.fahndung) : ''}` : 'Wählen'; c.style.color = ST.fahndung ? '#ff3b3b' : '' }, 250);
