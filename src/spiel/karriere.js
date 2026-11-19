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
/* Lokal über seinen Laden-Code finden (Titel des Hauses und Name des Lokals sind oft verschieden) */
const lokalHaus = id => B.find(b => b.pod && b.pod.shops.some(s => s[3] === id));
const lokalPos = id => { const b = lokalHaus(id); return b ? { x: b.x + 2, y: b.y + 4.6 } : null };
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
const AUSBAU = [{ id: 'koch', n: '👨‍🍳 Sternekoch einstellen', f: .5 }, { id: 'dj', n: '🎧 Resident-DJ', f: .3 }, { id: 'terr', n: '🌿 Dachterrasse', f: .4 }, { id: 'pr', n: '📰 PR-Agentur aus Mitte', f: .6 }];
const lokalFaktor = id => 1 + AUSBAU.filter(a => ST.ausbau && ST.ausbau[id + a.id]).reduce((s, a) => s + a.f, 0);
const lokalProMin = l => Math.round(l.proMin * lokalFaktor(l.id));
const gastroProMin = () => LAEDEN.filter(l => ST.gastro && ST.gastro[l.id]).reduce((s, l) => s + lokalProMin(l), 0);
/* Influencer: Kooperationen schalten mit Followern frei und zahlen einmalig */
const KOOPS = [{ id: 'mate', n: '🧉 Club-Mate-Story', ab: 5000, geld: 25000 }, { id: 'sneak', n: '👟 Sneaker-Drop aus Kreuzberg', ab: 25000, geld: 120000 }, { id: 'parfum', n: '🖤 Parfum-Kampagne', ab: 100000, geld: 600000 },
  { id: 'auto', n: '🚗 Autohaus-Testfahrt', ab: 300000, geld: 1500000 }, { id: 'mode', n: '🧥 Eigene Modelinie im KaDeVe', ab: 1000000, geld: 8000000 }];
/* Dealer: Fahndung loswerden gegen Geld */
function bestechen() { const s = ST.fahndung || 0; if (!s) return toast('Gerade sucht dich niemand'); const preis = 40000 * s * s; if (ST.geld < preis) return toast(`Ein Anwalt kostet ${euro(preis)}`); ST.geld -= preis; ST.fahndung = 0; ST.fahndungUhr = 0; banner('⚖️ ANWALT', 'Akte verschwunden, Sterne weg', `−${euro(preis)}`); save(); hud() }
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
  const jagt = POLIZEI.some(p => p.jagd); if (jagt && !ST.jagdAn) toast('🚨 Streife hinter dir! Lauf und tauch ab.'); ST.jagdAn = jagt;
  /* Abtauchen: ohne Streife in der Nähe verliert man alle 20 Sekunden einen Stern */
  if (sterne > 0) { const nah = POLIZEI.some(p => Math.hypot(ICH.x - p.x, ICH.y - p.y) < 9); ST.fahndungUhr = (ST.fahndungUhr || 0) + (nah ? 0 : dt);
    if (ST.fahndungUhr > 20) { ST.fahndungUhr = 0; if (sterne >= 3 && k) k.entkommen3 = true; ST.fahndung = sterne - 1; toast(ST.fahndung ? `Abgetaucht: noch ${ST.fahndung} ★` : 'Die Polizei hat dich verloren'); missionPruefen(); save() } } }
function erwischt() { const k = kst(), strafe = Math.min(ST.geld * .1, 250000 * (ST.fahndung || 1)); ST.geld -= strafe; ST.fahndung = 0; ST.fahndungUhr = 0; k.serie = 0;
  for (const p of POLIZEI) { p.x += 6; p.jagd = false } banner('🚓 FESTGENOMMEN', 'Die Polizei hat dich am Wickel. Ware weg, Kaution bezahlt.', `−${euro(Math.round(strafe))}`); save(); hud() }

/* ---------- Aktionen an Orten ---------- */
function deal(o) { const k = kst(), t = Date.now(); if ((k.pause['d_' + o] || 0) > t) return toast('Hier ist gerade zu viel los. Komm gleich wieder.');
  if ((ST.ware || 0) < 1) return toast('Keine Ware mehr. Nachschub gibt es beim Kontakt am Kotti.'); ST.ware--;
  const basis = [1500, 4000, 12000, 30000, 80000][Math.min(4, Math.floor((k.m.dealer || 0) / 1.5))], geld = Math.round(basis * (.7 + Math.random() * .8));
  k.pause['d_' + o] = t + 25000; ST.geld += geld; k.deals++; k.serie++; k.umsatz += geld; k.orte[o] = 1; ST.fahndung = Math.min(5, (ST.fahndung || 0) + (Math.random() < .55 ? 1 : 0)); ST.fahndungUhr = 0;
  banner('💊 DEAL', `${ORTE[o].n}: Kunde zufrieden`, `+${euro(geld)}${ST.fahndung ? ' · ' + '★'.repeat(ST.fahndung) : ''}`); missionPruefen(); save(); hud() }
function nachschub() { const preis = 6000 + (kst().m.dealer || 0) * 4000; if (ST.geld < preis) return toast(`Nachschub kostet ${euro(preis)}`); ST.geld -= preis; ST.ware = (ST.ware || 0) + 10; banner('📦 NACHSCHUB', 'Kontakt am Kotti: 10 Päckchen', `−${euro(preis)} · Ware ${ST.ware}`); save(); hud() }
function content(o) { const k = kst(), t = Date.now(); if ((k.pause['c_' + o] || 0) > t) return toast(`Hier hast du gerade gedreht. Wieder in ${dauer(Math.ceil(((k.pause['c_' + o]) - t) / 1000))}`);
  const viral = Math.random() < .12, fol = Math.round((200 + (k.m.influ || 0) * 400) * (viral ? 25 : 1) * (.7 + Math.random() * .6));
  k.pause['c_' + o] = t + 90000; k.orte[o] = 1; k.posts++; if (viral) k.viral++; ST.follower = (ST.follower || 0) + fol; ST.geld += Math.round(fol * 2.5); ICH.tanzBis = Date.now() + 6000;
  banner(viral ? '🔥 VIRAL' : '📸 CONTENT', `${ORTE[o].n}${viral ? ': Dein Video explodiert' : ''}`, `+${fol.toLocaleString('de-DE')} Follower · +${euro(Math.round(fol * 2.5))}`); missionPruefen(); save(); hud() }
function gastroKasse(l) { ST.gastroKasse = ST.gastroKasse || {}; const seit = Math.min(240, (Date.now() - (ST.gastroKasse[l.id] || ST.gastro[l.id])) / 60000), geld = Math.round(seit * lokalProMin(l));
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
    for (const [id, K] of Object.entries(KARRIEREN)) knopf(`${K.ic} ${K.n} · ${K.t}`, () => { ST.karriere = id; if (id === 'dealer' && ST.ware == null) ST.ware = 5; save(); banner('NEUE KARRIERE', `${K.ic} ${K.n}`, K.raenge[0]); karriereZeigen() }); return }
  const L = MISSIONEN[kar], i = k.m[kar] || 0; const h = document.createElement('h4'); h.textContent = 'Missionen'; cb.append(h);
  L.forEach((m, j) => absatz(`${j < i ? '✅' : j === i ? '▶️' : '▫️'} ${m.t} · ${euro(m.lohn)}`));
  const h2 = document.createElement('h4'); cb.append(h2);
  if (kar === 'dealer' && ST.fahndung) knopf(`⚖️ Anwalt anrufen · Sterne weg · ${euro(40000 * ST.fahndung * ST.fahndung)}`, () => { bestechen(); karriereZeigen() });
  if (kar === 'dealer') { h2.textContent = 'Deine Ecken'; absatz(`Ware: ${ST.ware || 0} · Deals: ${k.deals} · Umsatz: ${euro(k.umsatz)} · Fahndung: ${'★'.repeat(ST.fahndung || 0) || 'keine'}`); absatz('Geh zum Görlitzer Park (bei den Lofts Kreuzberg), zum RAW-Gelände (am Berghain) oder zum Kotti (an der Platte). Dort erscheint der Knopf „Deal“. Ware kaufst du beim Kontakt am Kotti. Streifenwagen mit Blaulicht jagen dich, solange du Sterne hast. Tauch ab, bis sie dich verlieren.') }
  if (kar === 'gastro') { h2.textContent = 'Lokale'; for (const l of LAEDEN) { const meins = ST.gastro && ST.gastro[l.id]; knopf(meins ? `✓ ${l.t} · ${euro(lokalProMin(l))}/Min · Kasse vor Ort leeren` : `${l.t} kaufen · ${euro(l.preis)} · ${euro(l.proMin)}/Min`, () => { if (!meins) { lokalKaufen(l); karriereZeigen() } }, meins);
      if (meins) for (const a of AUSBAU) { const hat = ST.ausbau && ST.ausbau[l.id + a.id], preis = Math.round(l.preis * a.f); if (!hat) knopf(`   ${a.n} · ${euro(preis)} · +${Math.round(a.f * 100)} %`, () => { if (ST.geld < preis) return toast('Dafür reicht dein Geld nicht'); ST.geld -= preis; ST.ausbau = ST.ausbau || {}; ST.ausbau[l.id + a.id] = 1; banner('🔨 AUSBAU', `${l.t}: ${a.n.slice(2).trim()}`, `+${Math.round(a.f * 100)} % Einnahmen`); save(); hud(); karriereZeigen() }) } }
    absatz(`Einnahmen gesamt: ${euro(gastroProMin())} pro Minute. Die Kasse füllt sich bis zu 4 Stunden, dann ist sie voll.`) }
  if (kar === 'influ') knopf('🔴 Jetzt live gehen · überall möglich', () => { liveGehen(); karriereZeigen() });
  if (kar === 'influ') { h2.textContent = 'Kooperationen'; for (const c of KOOPS) { const fertig = ST.koops && ST.koops[c.id], frei = (ST.follower || 0) >= c.ab;
      knopf(fertig ? `✓ ${c.n}` : frei ? `${c.n} · ${euro(c.geld)} annehmen` : `🔒 ${c.n} · ab ${c.ab.toLocaleString('de-DE')} Followern`, () => { ST.koops = ST.koops || {}; ST.koops[c.id] = 1; ST.geld += c.geld; banner('🤝 KOOPERATION', c.n.slice(2).trim(), `+${euro(c.geld)}`); save(); hud(); karriereZeigen() }, fertig || !frei) } }
  if (kar === 'influ') { const hh = document.createElement('h4'); hh.textContent = 'Hotspots'; cb.append(hh); for (const o of ['tor', 'alex', 'ufer', 'berg', 'scorp', 'kadeve']) absatz(`${k.orte[o] ? '✅' : '📍'} ${ORTE[o].n}`); absatz(`Posts: ${k.posts} · Viral: ${k.viral}. Am Hotspot erscheint der Knopf „Content drehen“.`) }
  const h3 = document.createElement('h4'); h3.textContent = 'Karriere wechseln'; cb.append(h3);
  for (const [id, K] of Object.entries(KARRIEREN)) if (id !== kar) knopf(`${K.ic} ${K.n}`, () => { ST.karriere = id; save(); karriereZeigen() }) }
window.karriereZeigen = karriereZeigen;

/* ---------- Kontextknopf unten: erscheint nur, wenn an diesem Ort etwas geht ---------- */
setInterval(() => { if (typeof ICH === 'undefined' || typeof ST === 'undefined') return; polizeiWeiter(.25); const leiste = aktionsLeiste(); let b = document.getElementById('bKarriere');
  if (!b) { b = document.createElement('button'); b.id = 'bKarriere'; b.className = 'anlegen'; leiste.append(b) }
  const kar = ST.karriere; let f = null, t = '';
  if (!INNEN && Math.hypot(ICH.x - (PLAZA.x + 2), ICH.y - (PLAZA.y + 2)) < 3.5) { t = kar ? '🕰️ Karriere & Missionen' : '🕰️ Karriere wählen'; f = karriereZeigen }
  else if (kar === 'dealer') { const o = ['goerli', 'raw', 'kotti'].find(o => nahAn(o)); if (o) { t = `💊 Deal · ${ORTE[o].n} · Ware ${ST.ware || 0}`; f = () => deal(o) }
    let w = document.getElementById('bWare'); if (!w) { w = document.createElement('button'); w.id = 'bWare'; w.className = 'anlegen'; w.onclick = nachschub; leiste.append(w) } w.hidden = o !== 'kotti'; w.textContent = `📦 Nachschub · ${euro(6000 + (kst().m.dealer || 0) * 4000)}` }
  else if (kar === 'influ') { const o = ['tor', 'alex', 'ufer', 'berg', 'scorp', 'kadeve'].find(o => nahAn(o, 2.6)); if (o) { t = `📸 Content drehen · ${ORTE[o].n}`; f = () => content(o) } }
  else if (kar === 'gastro' && ST.gastro) { const l = LAEDEN.find(l => ST.gastro[l.id] && (INNEN ? INNEN === lokalHaus(l.id) : (() => { const p = lokalPos(l.id); return p && Math.hypot(ICH.x - p.x, ICH.y - p.y) < 2.6 })()));
    if (l) { t = `💶 Kasse leeren · ${l.t}`; f = () => gastroKasse(l); let e = document.getElementById('bPromi'); if (!e) { e = document.createElement('button'); e.id = 'bPromi'; e.className = 'anlegen'; leiste.append(e) } e.textContent = '🥂 Promi-Abend · 150.000 €'; e.hidden = false; e.onclick = () => promiAbend(l) } }
  const bw = document.getElementById('bWare'); if (bw && kar !== 'dealer') bw.hidden = true; const pr = document.getElementById('bPromi'); if (pr && !(kar === 'gastro' && f)) pr.hidden = true;
  const startOffen = document.getElementById('start') && !document.getElementById('start').hidden; if (startOffen) { f = null; const w2 = document.getElementById('bWare'); if (w2) w2.hidden = true }
  b.hidden = !f; if (f) { b.textContent = t; b.onclick = f }
  /* Fahndungssterne und Karriere oben in der Leiste */
  let c = document.getElementById('hKar'); if (!c) { const hud0 = document.querySelector('.hud'); if (!hud0) return; const d = document.createElement('div'); d.className = 'chip karriere'; d.innerHTML = '<span>Karriere</span><b id="hKar"></b>'; d.style.pointerEvents = 'auto'; d.style.cursor = 'pointer'; d.onclick = karriereZeigen; hud0.append(d); c = document.getElementById('hKar') }
  c.textContent = kar ? `${KARRIEREN[kar].ic} ${karRang(kar)}${ST.fahndung ? ' ' + '★'.repeat(ST.fahndung) : ''}` : 'Wählen'; c.style.color = ST.fahndung ? '#ff3b3b' : '' }, 250);

/* Oben in der Tagesleiste steht der Karriere-Rang statt „Praktikum“ */
function tagTitel() { const k = ST.karriere; return k ? `${KARRIEREN[k].n} · ${karRang(k)}` : 'Neu in Berlin' }

/* Wer noch keine Karriere hat, bekommt sie nach dem Betreten der Stadt einmal angeboten */
setTimeout(function frage() { if (typeof ST === 'undefined' || !document.getElementById('start') || !document.getElementById('start').hidden) return setTimeout(frage, 3000); if (!ST.karriere && !ST.karriereGefragt) { ST.karriereGefragt = 1; save(); karriereZeigen() } }, 8000);
/* Influencer: überall live gehen, kostet Energie, bringt Follower je nach Uhrzeit (abends am meisten) */
function liveGehen() { const k = kst(), t = Date.now(); if ((k.pause.live || 0) > t) return toast(`Wieder live in ${dauer(Math.ceil((k.pause.live - t) / 1000))}`); if ((ST.energie ?? 70) < 15) return toast('Zu müde zum Streamen. Schlaf erst.');
  const h = typeof stunde === 'function' ? stunde() : 20, faktor = h >= 19 || h < 2 ? 2 : h >= 12 ? 1.2 : .6, fol = Math.round((150 + (k.m.influ || 0) * 300) * faktor * (.7 + Math.random() * .6));
  k.pause.live = t + 180000; ST.energie = Math.max(0, (ST.energie ?? 70) - 12); ST.follower = (ST.follower || 0) + fol; k.posts++; banner('🔴 LIVE', h >= 19 || h < 2 ? 'Prime Time, alle schauen zu' : 'Stream läuft', `+${fol.toLocaleString('de-DE')} Follower`); missionPruefen(); save(); hud() }

/* Döner am Mostafa: überall in der Stadt, unabhängig von der Karriere. Energie für die Nacht */
setInterval(() => { if (typeof ICH === 'undefined' || !window.DOENER) return; const leiste = aktionsLeiste(); let d = document.getElementById('bDoener');
  if (!d) { d = document.createElement('button'); d.id = 'bDoener'; d.className = 'anlegen'; d.textContent = '🥙 Gemüsekebap · 7 € · Energie +30'; d.onclick = () => { if (ST.geld < 7) return toast('7 € hast du nicht mal?'); ST.geld -= 7; ST.energie = Math.min(100, (ST.energie ?? 70) + 30); banner('🥙 MOSTAFAS', 'Nach 20 Minuten Schlange: der beste Döner der Stadt', 'Energie +30'); save(); hud() }; leiste.append(d) }
  const st = document.getElementById('start'); d.hidden = !!INNEN || (st && !st.hidden) || Math.hypot(ICH.x - DOENER.x, ICH.y - DOENER.y) > 2.6 }, 500);
