// Berlin City · foto.js · Fotomodus: Selfie am aktuellen Ort, Follower je nach Ort, Outfit und Uhrzeit
// Bester Ort: Promenade und Yachtclub zum Sonnenuntergang. Ein Foto alle 60 Sekunden.
const FOTO_ORTE = { 'Scorpius Berlin': 2.2, Papillong: 2, Borchert: 1.8, 'Galeries Lafayetto': 1.6, "Ryotei 398": 1.5, 'Maison du Sac': 1.5, 'Tiffanny & Co.': 1.5, 'Spree Spa': 1.2 };
let fotoBereit = 0;
function fotoMachen() { if (T < fotoBereit) { toast(`Nächstes Foto in ${Math.ceil(fotoBereit - T)} Sekunden`); return } fotoBereit = T + 60;
  // Ort: Gebäude, in dem oder vor dem man steht, sonst die Straße
  const nah = INNEN || B.find(b => Math.hypot(ICH.x - (b.x + 2), ICH.y - (b.y + 4.4)) < 2.2);
  const ort = nah ? nah.title : (ICH.y > 41 ? 'East Side Ufer' : 'Berlin City');
  const h = stunde(), goldeneStunde = h > 17.5 && h < 20 ? 1.6 : (h > 21 || h < 5) ? 1.2 : 1;
  const schmuck = (ICH.acc || []).length, tasche = ICH.bagK ? WS.KATALOG.find(i => i.id === ICH.bagK) : null;
  const faktor = (FOTO_ORTE[ort] || (ort === 'East Side Ufer' ? 1.7 : 1)) * goldeneStunde;
  const fol = Math.round((40 + ST.stil / 25 + schmuck * 25 + (tasche ? tasche.rang / 3 : 0)) * faktor);
  ST.follower = (ST.follower || 0) + fol; ST.stil += 2; save(); hud(); setTimeout(() => ereignis('foto'));
  fotoZeigen(ort, fol, goldeneStunde > 1.4) }
function fotoZeigen(ort, fol, gold) { const el = document.getElementById('foto'), cv = el.querySelector('canvas'), c = cv.getContext('2d'); const w = cv.width, h = cv.height;
  // Hintergrund: Himmel der aktuellen Uhrzeit, Sonne, Palmen-Silhouetten, Ort als Leuchtschrift
  const f = HIMMEL_JETZT.farben, sk = c.createLinearGradient(0, 0, 0, h); f.forEach((x, i) => sk.addColorStop([0, .45, .75, 1][i], x)); c.fillStyle = sk; c.fillRect(0, 0, w, h);
  c.fillStyle = gold ? 'rgba(255,214,140,.85)' : 'rgba(255,255,255,.25)'; c.beginPath(); c.arc(w * .7, h * .5, w * .2, 0, 7); c.fill();
  c.fillStyle = 'rgba(20,8,30,.75)'; c.fillRect(0, h * .78, w, h * .22);
  for (const px of [w * .1, w * .88]) { c.strokeStyle = 'rgba(20,8,30,.85)'; c.lineWidth = 6; c.beginPath(); c.moveTo(px, h * .8); c.quadraticCurveTo(px + 10, h * .5, px + 4, h * .32); c.stroke();
    for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; c.lineWidth = 5; c.beginPath(); c.moveTo(px + 4, h * .32); c.quadraticCurveTo(px + 4 + Math.cos(a) * 30, h * .32 + Math.sin(a) * 12 - 14, px + 4 + Math.cos(a) * 50, h * .32 + Math.sin(a) * 20 + 8); c.stroke() } }
  FG.zeichne(c, w * .48, h * .95, h / 34, Object.assign({}, ICH, { mimik: 'zwinkern', ph: 2 }), T, false);
  c.font = '400 46px Yellowtail, cursive'; c.textAlign = 'center'; c.fillStyle = '#ff7eb6'; c.shadowColor = '#ff4fa3'; c.shadowBlur = 16; c.fillText(ort, w / 2, h * .14); c.shadowBlur = 0;
  el.querySelector('figcaption').textContent = `${(ST.profil && ST.profil.handle) || 'Du'} · ${ort} · ${uhrText()}  +${fol.toLocaleString('de-DE')} Follower${gold ? ' · goldene Stunde' : ''}`;
  el.hidden = false; clearTimeout(fotoZeigen.t); fotoZeigen.t = setTimeout(() => el.hidden = true, 4200) }
document.getElementById('bFoto').onclick = fotoMachen;
document.getElementById('foto').onclick = () => document.getElementById('foto').hidden = true;
