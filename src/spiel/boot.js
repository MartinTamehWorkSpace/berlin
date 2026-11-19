// Berlin · boot.js · Dein eigenes Boot fahren: am Anleger antippen, an Bord gehen, aufs Wasser tippen und hinfahren, mit „Anlegen“ zurück.
const MEINBOOT = { an: false, x: 0, y: 0, h: 0, ziel: null, party: false, abgerechnet: 0 };
// Bootsparty: läuft dauerhaft, bis du sie beendest. Sprit kostet pro Minute, dafür gibt es Stil und Follower pro Minute.
const BOOTSPARTY = { speed: { kosten: 60, stil: 1, fol: 30 }, jacht: { kosten: 250, stil: 2, fol: 80 }, gross: { kosten: 900, stil: 4, fol: 200 } };
const BOOT_TEMPO = { speed: 7, jacht: 4, gross: 3 };
const anleger = () => S.find(o => o.k === 'meinejacht');
function bootBesitz() { return WS.KATALOG.filter(i => i.kat === 'jacht' && ST.besitz[i.id]).sort((a, b) => b.rang - a.rang)[0] || null }
function bootAnBord() { const b = bootBesitz(), a = anleger(); if (!b || !a || MEINBOOT.an || INNEN) return; if (ICH.faehrt) { toast('Erst das Auto parken, dann an Bord gehen'); return }
  Object.assign(MEINBOOT, { an: true, x: a.x, y: a.y, h: 0, ziel: null }); ICH.path = []; ICH.x = a.x; ICH.y = a.y; anlegerKnopf(true); toast(`An Bord: ${b.name}. Tipp aufs Wasser, dann fährst du hin.`) }
function bootAnlegen() { if (!MEINBOOT.an) return; const a = anleger(); MEINBOOT.an = false; MEINBOOT.ziel = null; ICH.x = a.x; ICH.y = 42.7; ICH.path = []; anlegerKnopf(false); toast('Angelegt. Willkommen zurück an Land.') }
function bootZiel(x, y) { MEINBOOT.ziel = [Math.max(-15, Math.min(60, x)), Math.max(44.8, Math.min(62, y))] }
function bootsparty(an) { const b = bootBesitz(); if (!b) return; MEINBOOT.party = an; MEINBOOT.abgerechnet = Date.now(); const p = BOOTSPARTY[b.boot]; toast(an ? `🎉 Party auf deiner ${b.name}. Sprit ${euro(p.kosten)} pro Minute, +${p.stil} Stil und +${p.fol} Follower pro Minute.` : 'Party beendet. Die Gäste gehen an Land.'); partyKnopf() }
function partyAbrechnen() { if (!MEINBOOT.party) return; const b = bootBesitz(); if (!b) { MEINBOOT.party = false; return } const p = BOOTSPARTY[b.boot], min = Math.floor((Date.now() - MEINBOOT.abgerechnet) / 60000); if (min < 1) return;
  const kosten = p.kosten * min; if (ST.geld < kosten) { MEINBOOT.party = false; toast('Kein Geld mehr für Sprit. Die Party ist vorbei.'); partyKnopf(); return }
  ST.geld -= kosten; ST.stil = (ST.stil || 0) + p.stil * min; ST.follower = (ST.follower || 0) + p.fol * min; MEINBOOT.abgerechnet += min * 60000; save(); hud() }
function partyKnopf() { let k = document.getElementById('bParty'); const b = bootBesitz(), a = anleger(), nah = b && a && (MEINBOOT.an || Math.hypot(ICH.x - a.x, ICH.y - 42.7) < 4);
  if (!k) { k = document.createElement('button'); k.id = 'bParty'; k.className = 'anlegen party'; k.onclick = () => bootsparty(!MEINBOOT.party); aktionsLeiste().append(k) }
  k.hidden = !nah && !MEINBOOT.party; k.textContent = MEINBOOT.party ? `🎉 Party läuft · beenden` : '🎉 Bootsparty starten' }
function bootWeiter(dt) { if ((bootWeiter.t = (bootWeiter.t || 0) + dt) > 1) { bootWeiter.t = 0; partyAbrechnen(); partyKnopf() } if (!MEINBOOT.an) return; const b = bootBesitz(); if (!b) return bootAnlegen(); const v = BOOT_TEMPO[b.boot] || 4;
  if (MEINBOOT.ziel) { const [tx, ty] = MEINBOOT.ziel, dx = tx - MEINBOOT.x, dy = ty - MEINBOOT.y, d = Math.hypot(dx, dy); if (d < .2) MEINBOOT.ziel = null; else { const s = Math.min(d, v * dt); MEINBOOT.x += dx / d * s; MEINBOOT.y += dy / d * s; MEINBOOT.h = Math.atan2(dy, dx) } }
  ICH.x = MEINBOOT.x; ICH.y = MEINBOOT.y; ICH.path = [] }
// Eine gemeinsame Leiste für Anlegen, Bootsparty und Mittanzen: nebeneinander, nie über Karten
function aktionsLeiste() { let d = document.getElementById('aktionsleiste'); if (!d) { d = document.createElement('div'); d.id = 'aktionsleiste'; d.className = 'aktionsleiste'; document.body.append(d) } return d }
function anlegerKnopf(an) { let k = document.getElementById('bAnlegen'); if (!k) { k = document.createElement('button'); k.id = 'bAnlegen'; k.className = 'anlegen'; k.textContent = '⚓ Anlegen'; k.onclick = bootAnlegen; aktionsLeiste().append(k) } k.hidden = !an }
