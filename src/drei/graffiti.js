// Berlin · graffiti.js · Berlin-Look für die ganze Stadt: Graffitis und Paste-ups im Erdgeschoss fast jedes Hauses (Tags, Bubble-Letters, Kiez-Sprüche),
// Nur Texturen und leuchtende Flächen, keine echten Lichter (Tempo-Regel aus CLAUDE.md).
import * as THREE from 'three';
import { M } from './haeuser.js?v=1795067735';

const SPRUECHE = ['BERLIN', 'KREUZBERG 36', 'SPREE', 'KIEZ', 'LOVE', 'TECHNO', 'NEUKÖLLN', 'FHAIN', '030', 'BÄM', 'NO SLEEP', 'SPÄTI', 'MITTE', 'WEDDING', 'KATER', 'ROSA', 'ARM ABER SEXY', 'U8', 'BOOM'];
const FARBEN = [['#ff2fa0', '#ffd36b'], ['#2fe0d2', '#16171a'], ['#ffd400', '#ff2a2a'], ['#9b5cff', '#2fe0d2'], ['#39d353', '#16171a'], ['#ff7a1a', '#ffffff'], ['#ffffff', '#ff2fa0']];
const zufall = s => () => (s = (s * 9301 + 49297) % 233280) / 233280;

/* Eine Graffiti-Wand als Textur: Grundputz, Tropfen, mehrere Tags übereinander, ab und zu ein Paste-up */
function wandTextur(nr) { const r = zufall(nr * 77 + 13), c = document.createElement('canvas'); c.width = 512; c.height = 160; const x = c.getContext('2d');
  x.fillStyle = ['#8d8a84', '#a19d95', '#6f6c68', '#b4ada2'][nr % 4]; x.fillRect(0, 0, 512, 160);
  for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(0,0,0,${r() * .08})`; x.fillRect(r() * 512, r() * 160, 2 + r() * 6, 2 + r() * 6) }
  for (let i = 0; i < 3 + Math.floor(r() * 3); i++) { const [f1, f2] = FARBEN[Math.floor(r() * FARBEN.length)], text = SPRUECHE[Math.floor(r() * SPRUECHE.length)], gr = 34 + r() * 46, px = r() * 380, py = 40 + r() * 100;
    x.save(); x.translate(px, py); x.rotate((r() - .5) * .35); x.font = `${r() > .5 ? 'italic ' : ''}900 ${gr}px Impact, Arial Black, sans-serif`; x.lineJoin = 'round';
    x.lineWidth = gr * .22; x.strokeStyle = f2; x.strokeText(text, 0, 0); x.fillStyle = f1; x.fillText(text, 0, 0);
    x.fillStyle = f1; for (let t = 0; t < 4; t++) x.fillRect(r() * gr * text.length * .5, 2, 2, 6 + r() * 26); x.restore() }
  if (r() > .5) { x.save(); x.translate(380 + r() * 80, 20 + r() * 40); x.rotate((r() - .5) * .2); x.fillStyle = '#f4efe6'; x.fillRect(0, 0, 70, 90); x.fillStyle = '#16171a'; x.font = '900 16px Arial'; x.fillText('TECHNO', 6, 30); x.fillText('SA 23H', 6, 54); x.fillStyle = '#ff2fa0'; x.fillRect(6, 64, 58, 16); x.restore() }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t }

/* Berlin grau: alles, was bis hier gebaut ist (Boden, Straßen, Häuser), verliert die Miami-Farben. Leuchtendes (Neon, Fenster nachts, Wasser) bleibt. */
function grauMachen(szene) { const fertig = new Set(), hsl = {};
  szene.traverse(o => { if (!o.isMesh || o.userData.spaceport) return; for (const m of [].concat(o.material)) { if (!m || fertig.has(m) || !m.color || m.isShaderMaterial) continue; fertig.add(m);
    if (m.emissive && m.emissiveIntensity > .5 && m.emissive.getHex()) continue; if (m.transparent && m.opacity < .6) continue;
    m.color.getHSL(hsl); if (o.userData.haus) m.color.setHSL(hsl.h, hsl.s * .45, Math.min(.56, hsl.l * .74)); else m.color.setHSL(hsl.h, hsl.s * .22, Math.min(.58, hsl.l * .76 + .03)) } }) }
export function graffiti(szene) { grauMachen(szene); const g = new THREE.Group(); szene.add(g); const mats = Array.from({ length: 10 }, (_, i) => new THREE.MeshStandardMaterial({ map: wandTextur(i), roughness: .95, polygonOffset: true, polygonOffsetFactor: -2 }));
  const r = zufall(42); let n = 0; const breite = 4 * M - 1.2;
  for (const b of B) { if (b.haupt || !b.drei || b.meins === 'boutique') continue; if (r() < .18) continue;
    const cx = (b.x + 2) * M, cz = (b.y + 2) * M, halb = 2 * M - .3;
    for (const seite of [0, 1]) { if (r() < .25) continue; const w = new THREE.Mesh(new THREE.PlaneGeometry(breite, breite * 160 / 512), mats[(n++) % mats.length]);
      if (seite === 0) w.position.set(cx, breite * 80 / 512 + .15, cz + halb + .06); else { w.position.set(cx + halb + .06, breite * 80 / 512 + .15, cz); w.rotation.y = Math.PI / 2 } g.add(w) } }
  /* Brandenburger Tor im Park: sechs Säulenpaare, Attika, Quadriga in Grünspan */
  const tor = new THREE.Group(), sand = new THREE.MeshStandardMaterial({ color: '#cbbf9f', roughness: .85 }), gruen = new THREE.MeshStandardMaterial({ color: '#4f7f6c', metalness: .5, roughness: .5 });
  tor.position.set((PARK.x + 2) * M, 0, (PARK.y + 2) * M); tor.scale.setScalar(.68); g.add(tor); const st = (geo, mat, x, y, z) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; tor.add(o); return o };
  st(new THREE.BoxGeometry(17, .8, 4.6), sand, 0, .4, 0); for (let i = 0; i < 6; i++) for (const z of [-1.5, 1.5]) st(new THREE.CylinderGeometry(.5, .55, 9, 14), sand, -7.5 + i * 3, 5.3, z);
  st(new THREE.BoxGeometry(17.6, 1.6, 4.8), sand, 0, 10.6, 0); st(new THREE.BoxGeometry(12, 1.6, 3.6), sand, 0, 12.2, 0);
  const wagen = st(new THREE.BoxGeometry(2.4, 1.2, 1.6), gruen, 0, 13.6, 0); for (let i = 0; i < 4; i++) { st(new THREE.BoxGeometry(.5, 1.3, 1.6), gruen, -1.8 + i * 1.2, 13.7, -1.3); st(new THREE.BoxGeometry(.35, .7, .4), gruen, -1.8 + i * 1.2, 14.6, -1.95) }
  st(new THREE.CylinderGeometry(.18, .18, 2.2, 8), gruen, 0, 15.2, .2); st(new THREE.SphereGeometry(.45, 10, 8), gruen, 0, 16.5, .2);
  const bahn = sBahn(g); const tram = strassenbahn(g); spaetis(g); ryotei(g, mats); strassenbild(g); weltzeituhr(g); oberbaum(g); buddyBaeren(g); doener(g); eastSide(g); const streife = polizei(g);
  /* Zielringe der Karriere: gelb pulsierende Ringe an Deal-Ecken oder Hotspots */
  const ringe = {}, ringMat = new THREE.MeshBasicMaterial({ color: '#ffb21a', transparent: true, opacity: .7, depthWrite: false });
  const zielringe = () => { if (typeof ORTE === 'undefined' || typeof ST === 'undefined') return; const ids = ST.karriere === 'dealer' ? ['goerli', 'raw', 'kotti'] : ST.karriere === 'influ' ? ['tor', 'alex', 'ufer', 'berg', 'scorp', 'kadeve'] : [];
    if (ST.karriere === 'gastro' && ST.gastro && typeof lokalPos === 'function') for (const id of Object.keys(ST.gastro)) ids.push('l_' + id);
    for (const k in ringe) ringe[k].visible = ids.includes(k); for (const id of ids) { let r = ringe[id]; if (!r) { const q = id.startsWith('l_') ? lokalPos(id.slice(2)) : ORTE[id].p(); if (!q) continue; r = new THREE.Mesh(new THREE.RingGeometry(1.6, 2.1, 40), ringMat); r.rotation.x = -Math.PI / 2; r.position.set(q.x * M, .12, q.y * M); g.add(r); ringe[id] = r } }
    ringMat.opacity = .45 + Math.sin(performance.now() / 300) * .3 };
  return { weiter(dt = .016) { bahn(dt); tram(dt); streife(); zielringe() } } }
/* S-Bahn auf dem Viadukt am Nordrand: Ziegelbögen, Gleis, rot-gelber Zug pendelt hin und her */
function sBahn(g) { const y0 = -2.6 * M, x0 = -34 * M, x1 = 58 * M, H = 6.5, ziegel = new THREE.MeshStandardMaterial({ color: '#7a4a3a', roughness: .95 }), dunkel = new THREE.MeshStandardMaterial({ color: '#2a2b2f', roughness: .7 });
  const deck = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 1.2, 5.5), ziegel); deck.position.set((x0 + x1) / 2, H, y0); deck.castShadow = deck.receiveShadow = true; g.add(deck);
  for (let x = x0 + 4; x < x1; x += 9) { const p = new THREE.Mesh(new THREE.BoxGeometry(2.2, H, 5.2), ziegel); p.position.set(x, H / 2, y0); p.castShadow = true; g.add(p) }
  for (const z of [-1, 1]) { const s = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, .15, .15), new THREE.MeshStandardMaterial({ color: '#9aa0a6', metalness: .9, roughness: .3 })); s.position.set((x0 + x1) / 2, H + .7, y0 + z * .75); g.add(s) }
  const zug = new THREE.Group(); zug.position.set(x0, H + .6, y0); g.add(zug); const rot = new THREE.MeshStandardMaterial({ color: '#b3201c', roughness: .45 }), gelb = new THREE.MeshStandardMaterial({ color: '#f2b705', roughness: .45 });
  const fenster = new THREE.MeshStandardMaterial({ color: '#1b2430', emissive: '#ffe7b0', emissiveIntensity: .25, roughness: .2 });
  for (let i = 0; i < 4; i++) { const w = new THREE.Group(); w.position.x = i * 9.6; zug.add(w); const unten = new THREE.Mesh(new THREE.BoxGeometry(9.2, 1.6, 3), rot); unten.position.y = .9; w.add(unten);
    const oben = new THREE.Mesh(new THREE.BoxGeometry(9.2, 1.4, 3), gelb); oben.position.y = 2.4; w.add(oben); for (const z of [-1.51, 1.51]) { const f = new THREE.Mesh(new THREE.BoxGeometry(8.4, .8, .05), fenster); f.position.set(0, 2.4, z); w.add(f) }
    const dach = new THREE.Mesh(new THREE.BoxGeometry(9.2, .3, 2.8), dunkel); dach.position.y = 3.2; w.add(dach) }
  const schild = new THREE.Mesh(new THREE.PlaneGeometry(4, 1.2), new THREE.MeshBasicMaterial({ map: schildTextur('S', 'S-BAHN · RINGBAHN'), toneMapped: false })); schild.position.set((x0 + x1) / 2, H + 2.6, y0 + 2.9); g.add(schild);
  let t = 0; return dt => { t += dt; const L = x1 - x0 - 40, u = (t * 9) % (2 * L), x = u < L ? u : 2 * L - u; zug.position.x = x0 + 2 + x } }
function schildTextur(gross, klein) { const c = document.createElement('canvas'); c.width = 512; c.height = 160; const x = c.getContext('2d'); x.fillStyle = '#0b6a2e'; x.fillRect(0, 0, 512, 160);
  x.fillStyle = '#fff'; x.beginPath(); x.arc(80, 80, 58, 0, 7); x.fill(); x.fillStyle = '#0b6a2e'; x.font = '900 92px Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(gross, 80, 86);
  x.fillStyle = '#fff'; x.font = '800 40px Arial'; x.textAlign = 'left'; x.fillText(klein, 160, 86); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t }
/* Spätis an Straßenecken: kleiner Kiosk mit Leuchtschild, Getränkekiste und Bierbank davor */
function spaetis(g) { const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d'); x.fillStyle = '#16171a'; x.fillRect(0, 0, 256, 64); x.font = '900 40px Arial'; x.textAlign = 'center'; x.fillStyle = '#ffd400'; x.shadowColor = '#ffd400'; x.shadowBlur = 12; x.fillText('SPÄTI 24/7', 128, 46);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const schild = new THREE.MeshBasicMaterial({ map: t, toneMapped: false }), wand = new THREE.MeshStandardMaterial({ color: '#5a5d61', roughness: .9 }), kiste = new THREE.MeshStandardMaterial({ color: '#1f6f3a', roughness: .7 }), holz = new THREE.MeshStandardMaterial({ color: '#8a6a4a' });
  const r = zufall(7); let n = 0; for (const b of B) { if (b.haupt || n >= 9 || r() < .55) continue; n++; const k = new THREE.Group(); k.position.set((b.x - .45) * M, 0, (b.y - .45) * M); g.add(k);
    const haus = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 2.4), wand); haus.position.y = 1.3; haus.castShadow = true; k.add(haus); const s = new THREE.Mesh(new THREE.PlaneGeometry(2.3, .6), schild); s.position.set(0, 2.25, 1.22); k.add(s);
    for (let i = 0; i < 3; i++) { const c2 = new THREE.Mesh(new THREE.BoxGeometry(.6, .35, .4), kiste); c2.position.set(-.8 + i * .5, .18 + (i === 2 ? .35 : 0), 1.6); k.add(c2) }
    const bank = new THREE.Mesh(new THREE.BoxGeometry(2, .1, .45), holz); bank.position.set(0, .5, 2.6); k.add(bank) } }
/* Ryotei 398 (Vorbild 893 Ryotei, Kantstraße): ganzes Erdgeschoss Spiegelglas, über und über mit Tags, dazu ein kleines rotes Neonschild auf rohem Holzbrett */
function ryotei(g, mats) { const b = B.find(x => x.title === 'Ryotei 398'); if (!b) return; const cx = (b.x + 2) * M, cz = (b.y + 2) * M, halb = 2 * M - .25, br = 4 * M - 1;
  const spiegel = new THREE.MeshStandardMaterial({ color: '#2a2e33', metalness: 1, roughness: .12 });
  for (const seite of [0, 1]) for (let lage = 0; lage < 3; lage++) { const w = new THREE.Mesh(new THREE.PlaneGeometry(br, 3.6), lage ? mats[(lage * 3 + seite) % mats.length] : spiegel); if (lage) { w.material = w.material.clone(); w.material.transparent = true; w.material.opacity = .85 }
    const off = .07 + lage * .02; if (seite) { w.position.set(cx + halb + off, 2.1, cz); w.rotation.y = Math.PI / 2 } else w.position.set(cx, 2.1, cz + halb + off); g.add(w) }
  const c = document.createElement('canvas'); c.width = 256; c.height = 96; const x = c.getContext('2d'); x.fillStyle = '#8a6a4a'; x.fillRect(0, 0, 256, 96); for (let i = 0; i < 12; i++) { x.fillStyle = 'rgba(0,0,0,.12)'; x.fillRect(0, i * 8, 256, 2) }
  x.font = '900 64px Arial'; x.textAlign = 'center'; x.shadowColor = '#ff2a2a'; x.shadowBlur = 18; x.fillStyle = '#ff5a4a'; x.fillText('398', 128, 70); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const brett = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .6), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); brett.position.set(cx + 3, 3.4, cz + halb + .2); g.add(brett) }
/* Berliner Straßenbild: Litfaßsäulen mit Plakaten, U-Bahn-Eingänge mit blauem U, Ampelmännchen an Kreuzungen, Fahrräder an Laternen */
function plakat(nr) { const c = document.createElement('canvas'); c.width = 256; c.height = 256; const x = c.getContext('2d'); const F = [['#ff2f7d', '#16171a'], ['#ffb21a', '#16171a'], ['#2fe0d2', '#16171a'], ['#16171a', '#ffffff'], ['#e9e1d2', '#c8211b']];
  for (let i = 0; i < 4; i++) { const [a, b] = F[(nr + i) % F.length]; x.fillStyle = a; x.fillRect(i * 64, 0, 64, 256); x.fillStyle = b; x.font = '900 22px Arial'; x.save(); x.translate(i * 64 + 44, 230); x.rotate(-Math.PI / 2); x.fillText(['TECHNO', 'KONZERT', 'THEATER', 'AUSSTELLUNG', 'RAVE'][(nr + i) % 5], 0, 0); x.restore() }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; return t }
function uSchild() { const c = document.createElement('canvas'); c.width = 128; c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#1452a0'; x.fillRect(0, 0, 128, 128); x.fillStyle = '#fff'; x.font = '900 100px Arial'; x.textAlign = 'center'; x.fillText('U', 64, 102); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t }
function strassenbild(g) { const r = zufall(99), gruen = new THREE.MeshStandardMaterial({ color: '#1f3a2e', metalness: .4, roughness: .5 }), grau = new THREE.MeshStandardMaterial({ color: '#4a4c50', roughness: .8 });
  const STR = [1, 9, 17, 25, 33]; const ecke = (i, j, dx, dy) => [(STR[i] + dx) * M, (STR[j] + dy) * M];
  /* Litfaßsäulen */
  for (let n = 0; n < 8; n++) { const [x, z] = ecke(Math.floor(r() * 5), Math.floor(r() * 5), 1.6, 1.6); const s = new THREE.Mesh(new THREE.CylinderGeometry(.75, .75, 3, 20), new THREE.MeshStandardMaterial({ map: plakat(n), roughness: .8 })); s.position.set(x, 1.7, z); s.castShadow = true; g.add(s);
    const fuss = new THREE.Mesh(new THREE.CylinderGeometry(.85, .9, .3, 20), gruen); fuss.position.set(x, .15, z); g.add(fuss); const d = new THREE.Mesh(new THREE.CylinderGeometry(.5, .9, .5, 20), gruen); d.position.set(x, 3.45, z); g.add(d) }
  /* U-Bahn-Eingänge: Treppe in den Boden, Geländer, blauer Würfel mit U */
  const U = new THREE.MeshBasicMaterial({ map: uSchild(), toneMapped: false });
  for (let n = 0; n < 5; n++) { const [x, z] = ecke(Math.floor(r() * 5), Math.floor(r() * 5), -1.7, 1.7); const loch = new THREE.Mesh(new THREE.BoxGeometry(1.4, .05, 2.6), new THREE.MeshStandardMaterial({ color: '#0b0b0d' })); loch.position.set(x, .06, z); g.add(loch);
    for (const sx of [-.75, .75]) { const gel = new THREE.Mesh(new THREE.BoxGeometry(.06, .9, 2.6), gruen); gel.position.set(x + sx, .5, z); g.add(gel) }
    const mast = new THREE.Mesh(new THREE.BoxGeometry(.08, 2.8, .08), grau); mast.position.set(x + .9, 1.4, z - 1.4); g.add(mast); const w = new THREE.Mesh(new THREE.BoxGeometry(.6, .6, .6), U); w.position.set(x + .9, 3.1, z - 1.4); g.add(w) }
  /* Ampelmännchen-Ampeln an jeder zweiten Kreuzung */
  const rot = new THREE.MeshStandardMaterial({ color: '#ff2a2a', emissive: '#ff2a2a', emissiveIntensity: 1.6 }), gruenL = new THREE.MeshStandardMaterial({ color: '#39d353', emissive: '#39d353', emissiveIntensity: 1.6 });
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { if ((i + j) % 2) continue; const [x, z] = ecke(i, j, 1.9, -1.9); const m = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 2.6, 8), grau); m.position.set(x, 1.3, z); g.add(m);
    const k = new THREE.Mesh(new THREE.BoxGeometry(.32, .7, .22), new THREE.MeshStandardMaterial({ color: '#16171a' })); k.position.set(x, 2.5, z); g.add(k);
    const mann = new THREE.Mesh(new THREE.BoxGeometry(.18, .22, .02), (i + j) % 4 ? rot : gruenL); mann.position.set(x, 2.6, z + .12); g.add(mann); const hut = new THREE.Mesh(new THREE.BoxGeometry(.22, .04, .02), mann.material); hut.position.set(x, 2.74, z + .12); g.add(hut) }
  /* Fahrräder an Gittern */
  const rad = new THREE.MeshStandardMaterial({ color: '#2b2d31', metalness: .6, roughness: .4 });
  for (let n = 0; n < 16; n++) { const [x, z] = ecke(Math.floor(r() * 5), Math.floor(r() * 5), (r() - .5) * 3, 1.9 + r() * .3); const f = new THREE.Group(); f.position.set(x, 0, z); f.rotation.y = r() * .4; g.add(f);
    for (const sx of [-.45, .45]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(.33, .03, 6, 16), rad); ring.position.set(sx, .36, 0); f.add(ring) } const rahmen = new THREE.Mesh(new THREE.BoxGeometry(.9, .05, .05), new THREE.MeshStandardMaterial({ color: ['#c8211b', '#16171a', '#e9e1d2', '#2c3a4f'][n % 4] })); rahmen.position.set(0, .55, 0); rahmen.rotation.z = .2; f.add(rahmen) } }
/* Weltzeituhr am Alexanderplatz: hier wählt man die Karriere (karriere.js zeigt den Knopf, wenn man davor steht) */
function weltzeituhr(g) { const x = (PLAZA.x + 2) * M, z = (PLAZA.y + 2) * M, stahl = new THREE.MeshStandardMaterial({ color: '#b9bec4', metalness: .9, roughness: .3 });
  const saeule = new THREE.Mesh(new THREE.CylinderGeometry(.35, .5, 4, 12), stahl); saeule.position.set(x, 2, z); g.add(saeule);
  const c = document.createElement('canvas'); c.width = 512; c.height = 64; const t = c.getContext('2d'); const st = ['BERLIN', 'NEW YORK', 'TOKIO', 'PARIS', 'MOSKAU', 'RIO', 'KAIRO', 'SYDNEY'];
  t.fillStyle = '#e9e1d2'; t.fillRect(0, 0, 512, 64); st.forEach((n, i) => { t.fillStyle = ['#c8211b', '#1452a0', '#e6a01a', '#2b7a3d'][i % 4]; t.fillRect(i * 64, 0, 62, 64); t.fillStyle = '#fff'; t.font = '700 11px Arial'; t.textAlign = 'center'; t.fillText(n, i * 64 + 31, 38) });
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; const ring = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1.2, 8, 1, true), new THREE.MeshStandardMaterial({ map: tx, side: THREE.DoubleSide, roughness: .6 })); ring.position.set(x, 4.6, z); g.add(ring);
  const deckel = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.05, .12, 8), stahl); deckel.position.set(x, 5.25, z); g.add(deckel); const atom = new THREE.Group(); atom.position.set(x, 6.4, z); g.add(atom);
  for (let i = 0; i < 3; i++) { const o = new THREE.Mesh(new THREE.TorusGeometry(.8, .04, 6, 24), stahl); o.rotation.set(i * 1.05, i * .7, 0); atom.add(o) } const k = new THREE.Mesh(new THREE.SphereGeometry(.2, 10, 8), stahl); atom.add(k) }
/* Streifenwagen: Berliner Polizei in Blau-Silber, Blaulicht blinkt bei Fahndung. Positionen kommen aus karriere.js (window.POLIZEI) */
function polizei(g) { const autos = [], silber = new THREE.MeshStandardMaterial({ color: '#d9dde2', metalness: .6, roughness: .35 }), blau = new THREE.MeshStandardMaterial({ color: '#1452a0', roughness: .4 }), glas = new THREE.MeshStandardMaterial({ color: '#1a2230', metalness: .5, roughness: .1 });
  const l1 = new THREE.MeshStandardMaterial({ color: '#2a6bff', emissive: '#2a6bff', emissiveIntensity: 0 }), l2 = l1.clone();
  for (let i = 0; i < 4; i++) { const a = new THREE.Group(); g.add(a); const k = new THREE.Mesh(new THREE.BoxGeometry(4.2, .9, 1.9), silber); k.position.y = .7; k.castShadow = true; a.add(k);
    const streif = new THREE.Mesh(new THREE.BoxGeometry(4.22, .25, 1.92), blau); streif.position.y = .75; a.add(streif); const dach = new THREE.Mesh(new THREE.BoxGeometry(2.2, .7, 1.7), glas); dach.position.set(-.2, 1.45, 0); a.add(dach);
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(.3, .18, .6), l1); b1.position.set(-.2, 1.9, -.35); a.add(b1); const b2 = new THREE.Mesh(new THREE.BoxGeometry(.3, .18, .6), l2); b2.position.set(-.2, 1.9, .35); a.add(b2);
    for (const [rx, rz] of [[-1.4, -.95], [1.4, -.95], [-1.4, .95], [1.4, .95]]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(.38, .38, .25, 12), new THREE.MeshStandardMaterial({ color: '#111' })); r.rotation.x = Math.PI / 2; r.position.set(rx, .38, rz); a.add(r) }
    a.userData.alt = null; autos.push(a) }
  /* Hubschrauber ab 4 Sternen: kreist über dir, Suchscheinwerfer als heller Kegel */
  const heli = new THREE.Group(); heli.visible = false; g.add(heli); const rumpf = new THREE.Mesh(new THREE.CapsuleGeometry(.9, 2.6, 6, 12), new THREE.MeshStandardMaterial({ color: '#1452a0', roughness: .4 })); rumpf.rotation.z = Math.PI / 2; heli.add(rumpf);
  const heck = new THREE.Mesh(new THREE.BoxGeometry(3.2, .3, .3), silber); heck.position.x = -2.6; heli.add(heck); const rotor = new THREE.Mesh(new THREE.BoxGeometry(7, .06, .3), new THREE.MeshStandardMaterial({ color: '#111' })); rotor.position.y = 1.1; heli.add(rotor);
  const kegel = new THREE.Mesh(new THREE.ConeGeometry(4, 26, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#fff7d6', transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); kegel.position.y = -13; heli.add(kegel);
  const fleck = new THREE.Mesh(new THREE.CircleGeometry(4, 28), new THREE.MeshBasicMaterial({ color: '#fff7d6', transparent: true, opacity: .25, depthWrite: false })); fleck.rotation.x = -Math.PI / 2; g.add(fleck); fleck.visible = false;
  return () => { const P = window.POLIZEI; if (!P) return; const t = performance.now() / 1000; let blink = false;
    P.forEach((p, i) => { const a = autos[i]; if (!a) return; const nx = p.x * M, nz = p.y * M; if (a.userData.alt) { const dx = nx - a.userData.alt[0], dz = nz - a.userData.alt[1]; if (Math.abs(dx) + Math.abs(dz) > .01) a.rotation.y = Math.atan2(-dz, dx) } a.userData.alt = [nx, nz]; a.position.set(nx, 0, nz); if (p.blau > 0) blink = true });
    const hoch = typeof ST !== 'undefined' && (ST.fahndung || 0) >= 4 && typeof ICH !== 'undefined'; heli.visible = fleck.visible = hoch;
    if (hoch) { const w = t * .5, hx = ICH.x * M + Math.cos(w) * 6, hz = ICH.y * M + Math.sin(w) * 6; heli.position.set(hx, 26, hz); heli.rotation.y = -w; rotor.rotation.y = t * 30; fleck.position.set(ICH.x * M + Math.sin(t * 1.3) * 1.5, .15, ICH.y * M + Math.cos(t * 1.1) * 1.5); kegel.lookAt(fleck.position); kegel.rotateX(Math.PI / 2) }
    l1.emissiveIntensity = blink && Math.sin(t * 14) > 0 ? 4 : 0; l2.emissiveIntensity = blink && Math.sin(t * 14) <= 0 ? 4 : 0 } }
/* Oberbaumbrücke über die Spree: rote Ziegelbögen, zwei Türme mit Zinnen, oben die U-Bahn-Trasse in Gelb */
function oberbaum(g) { const x0 = 2 * M, z0 = 44 * M, L = 40, ziegel = new THREE.MeshStandardMaterial({ color: '#8a3b2c', roughness: .95 }), hell = new THREE.MeshStandardMaterial({ color: '#b5654a', roughness: .9 });
  const b = new THREE.Group(); b.position.set(x0, 0, z0); g.add(b); const st = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; b.add(o); return o };
  st(new THREE.BoxGeometry(10, 2, L), ziegel, 0, 4.5, L / 2); for (let i = 0; i < 6; i++) { st(new THREE.BoxGeometry(10, 5, 1.6), ziegel, 0, 1.5, i * 7.5 + 1) ; st(new THREE.BoxGeometry(10.2, .4, 1.8), hell, 0, 4, i * 7.5 + 1) }
  for (const z of [L * .38, L * .62]) { st(new THREE.BoxGeometry(3, 12, 3), ziegel, 3.2, 6, z); for (let k = 0; k < 4; k++) st(new THREE.BoxGeometry(.7, 1, .7), ziegel, 2.2 + (k % 2) * 2, 12.5, z - 1 + Math.floor(k / 2) * 2) }
  st(new THREE.BoxGeometry(3, 1.2, L), hell, -2.5, 6.1, L / 2); const zug = st(new THREE.BoxGeometry(2.4, 2.2, 12), new THREE.MeshStandardMaterial({ color: '#f2b705', roughness: .5 }), -2.5, 7.8, L / 2);
  const f = new THREE.MeshStandardMaterial({ color: '#1b2430', emissive: '#ffe7b0', emissiveIntensity: .3 }); for (const sx of [-1.21, 1.21]) st(new THREE.BoxGeometry(.05, .8, 10.5), f, -2.5 + sx, 8.1, L / 2) }
/* Buddy Bären: bunt bemalte Bären mit erhobenen Armen an Straßenecken */
function buddyBaeren(g) { const r = zufall(31), STR = [1, 9, 17, 25, 33], F = [['#c8211b', '#ffd400'], ['#1452a0', '#ffffff'], ['#2b7a3d', '#ffb21a'], ['#ff2f7d', '#16171a'], ['#ffd400', '#1452a0'], ['#ffffff', '#c8211b']];
  for (let n = 0; n < 7; n++) { const [f1, f2] = F[n % F.length], m1 = new THREE.MeshStandardMaterial({ color: f1, roughness: .5 }), m2 = new THREE.MeshStandardMaterial({ color: f2, roughness: .5 });
    const b = new THREE.Group(), x = (STR[Math.floor(r() * 5)] - 1.6) * M, z = (STR[Math.floor(r() * 5)] + 1.6) * M; b.position.set(x, 0, z); b.rotation.y = r() * 6; g.add(b);
    const teil = (geo, m, px, py, pz, rz = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(px, py, pz); o.rotation.z = rz; o.castShadow = true; b.add(o); return o };
    teil(new THREE.BoxGeometry(1.4, .3, 1), m2, 0, .15, 0); teil(new THREE.CapsuleGeometry(.55, .9, 4, 10), m1, 0, 1.25, 0); teil(new THREE.SphereGeometry(.42, 12, 10), m1, 0, 2.4, 0);
    for (const s of [-1, 1]) { teil(new THREE.SphereGeometry(.14, 8, 6), m2, s * .3, 2.75, 0); teil(new THREE.CapsuleGeometry(.16, .7, 4, 8), m1, s * .72, 2.1, 0, s * -.5); teil(new THREE.CapsuleGeometry(.18, .5, 4, 8), m1, s * .28, .55, 0) }
    teil(new THREE.SphereGeometry(.22, 10, 8), m2, 0, 1.45, .45); teil(new THREE.SphereGeometry(.12, 8, 6), m2, 0, 2.33, .38) } }
/* Straßenbahn M10: Schienen auf der Mittelachse einer Hauptstraße, gelbe Tram fährt hin und her */
function strassenbahn(g) { const z0 = 17 * M + 1.5, x0 = -2 * M, x1 = 42 * M, stahl = new THREE.MeshStandardMaterial({ color: '#8a8f96', metalness: .9, roughness: .3 });
  for (const dz of [-.7, .7]) { const sch = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, .06, .12), stahl); sch.position.set((x0 + x1) / 2, .09, z0 + dz); g.add(sch) }
  const gelb = new THREE.MeshStandardMaterial({ color: '#f2c200', roughness: .45 }), grau = new THREE.MeshStandardMaterial({ color: '#d9dde2', roughness: .5 }), fen = new THREE.MeshStandardMaterial({ color: '#1b2430', emissive: '#ffe7b0', emissiveIntensity: .25, roughness: .2 });
  const tram = new THREE.Group(); g.add(tram); for (let i = 0; i < 3; i++) { const w = new THREE.Group(); w.position.x = i * 6.2; tram.add(w); const k = new THREE.Mesh(new THREE.BoxGeometry(6, 2.4, 2.3), gelb); k.position.y = 1.5; k.castShadow = true; w.add(k);
    const r = new THREE.Mesh(new THREE.BoxGeometry(6, .5, 2.32), grau); r.position.y = .45; w.add(r); for (const sz of [-1.16, 1.16]) { const f = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1, .04), fen); f.position.set(0, 1.9, sz); w.add(f) } }
  const bug = new THREE.Mesh(new THREE.BoxGeometry(.6, .1, .1), stahl); bug.position.set(6.2, 3.1, 0); tram.add(bug);
  const c = document.createElement('canvas'); c.width = 128; c.height = 48; const x = c.getContext('2d'); x.fillStyle = '#111'; x.fillRect(0, 0, 128, 48); x.fillStyle = '#ffb21a'; x.font = '700 30px Arial'; x.textAlign = 'center'; x.fillText('M10', 64, 35);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const anz = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .5), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); anz.position.set(-3.02, 2.4, 0); anz.rotation.y = -Math.PI / 2; tram.add(anz);
  let u = 0; return dt => { u += dt * 5; const L = x1 - x0 - 20, p = u % (2 * L), xx = p < L ? p : 2 * L - p; tram.position.set(x0 + xx, 0, z0); tram.rotation.y = p < L ? 0 : Math.PI } }
/* Dönerbude „Mostafas Gemüsekebap“ mit Schlange (Vorbild: die Bude am Mehringdamm). Position: window.DOENER für den Knopf in karriere.js */
function doener(g) { const x = 9 * M + 1.8, z = 25 * M + 1.8; window.DOENER = { x: x / M, y: z / M + 1.6 }; const b = new THREE.Group(); b.position.set(x, 0, z); g.add(b);
  const st = (geo, m, px, py, pz) => { const o = new THREE.Mesh(geo, m); o.position.set(px, py, pz); o.castShadow = true; b.add(o); return o };
  st(new THREE.BoxGeometry(3.2, 2.6, 2.2), new THREE.MeshStandardMaterial({ color: '#e9e1d2', roughness: .8 }), 0, 1.3, 0); st(new THREE.BoxGeometry(3.4, .2, 2.6), new THREE.MeshStandardMaterial({ color: '#1f6f3a' }), 0, 2.7, .1);
  st(new THREE.BoxGeometry(2.6, 1, .1), new THREE.MeshStandardMaterial({ color: '#1b2430', emissive: '#ffd9a0', emissiveIntensity: .4 }), 0, 1.6, 1.12);
  const c = document.createElement('canvas'); c.width = 512; c.height = 96; const t = c.getContext('2d'); t.fillStyle = '#1f6f3a'; t.fillRect(0, 0, 512, 96); t.fillStyle = '#fff'; t.font = '900 46px Arial'; t.textAlign = 'center'; t.fillText('MOSTAFAS GEMÜSEKEBAP', 256, 64);
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; const sch = new THREE.Mesh(new THREE.PlaneGeometry(3.2, .6), new THREE.MeshBasicMaterial({ map: tx, toneMapped: false })); sch.position.set(0, 3.15, 1.25); b.add(sch);
  const spiess = st(new THREE.CylinderGeometry(.18, .28, .9, 10), new THREE.MeshStandardMaterial({ color: '#a8562a', roughness: .7 }), .9, 1.6, .9);
  /* Schlange aus wartenden Leuten, alle dunkel angezogen */
  const kl = ['#16171a', '#2b2d31', '#3b3f2f', '#2c3a4f', '#4a1e24'];
  for (let i = 0; i < 9; i++) { const p = new THREE.Group(); p.position.set(-.6 + Math.sin(i * .7) * .25, 0, 2 + i * .75); b.add(p); const k = new THREE.Mesh(new THREE.CapsuleGeometry(.22, .8, 4, 8), new THREE.MeshStandardMaterial({ color: kl[i % 5] })); k.position.y = .75; p.add(k);
    const h = new THREE.Mesh(new THREE.SphereGeometry(.17, 8, 6), new THREE.MeshStandardMaterial({ color: ['#e4b997', '#c48f6b', '#8d5b3d', '#f3d5bf'][i % 4] })); h.position.y = 1.45; p.add(h) } }
/* East Side Gallery: Mauerstück am Spreeufer, Segmente mit eigenen Bildern (frei gestaltet: Farbfelder, Köpfe, Tauben, Sprüche) */
function mauerBild(nr) { const r = zufall(nr * 17 + 3), c = document.createElement('canvas'); c.width = 256; c.height = 256; const x = c.getContext('2d');
  const P = [['#ffd400', '#1452a0', '#c8211b'], ['#2fe0d2', '#ff2f7d', '#16171a'], ['#f4efe6', '#2b7a3d', '#ffb21a'], ['#9b5cff', '#ffd36b', '#16171a'], ['#ff7a1a', '#ffffff', '#1d2a3f']][nr % 5];
  x.fillStyle = P[0]; x.fillRect(0, 0, 256, 256); for (let i = 0; i < 6; i++) { x.fillStyle = P[1 + i % 2]; x.globalAlpha = .8; x.beginPath(); x.arc(r() * 256, r() * 256, 20 + r() * 70, 0, 7); x.fill() } x.globalAlpha = 1;
  x.fillStyle = P[2]; x.font = '900 34px Impact, Arial Black'; x.textAlign = 'center'; x.fillText(['FREIHEIT', 'WIND OF CHANGE', 'NIE WIEDER', 'LIEBE', 'TEAR DOWN', 'ZUSAMMEN'][nr % 6], 128, 230);
  for (let i = 0; i < 3; i++) { x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 2; x.beginPath(); x.moveTo(i * 85 + 85, 0); x.lineTo(i * 85 + 85, 256); x.stroke() }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t }
function eastSide(g) { const z = 41.4 * M, beton = new THREE.MeshStandardMaterial({ color: '#c9c6c0', roughness: .95 });
  for (let i = 0; i < 12; i++) { const x = (1 + i * 2.6) * M; const w = new THREE.Mesh(new THREE.BoxGeometry(2.55 * M, 3.6, .35), [beton, beton, beton, beton, new THREE.MeshStandardMaterial({ map: mauerBild(i), roughness: .9 }), beton]); w.position.set(x, 1.8, z); w.castShadow = true; g.add(w);
    const kappe = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, 2.55 * M, 10), beton); kappe.rotation.z = Math.PI / 2; kappe.position.set(x, 3.65, z); g.add(kappe) } }
