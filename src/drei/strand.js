// Glow City 3D · strand.js · Die Wasserfront: Holzpromenade (Palmen kommen aus S über leben.js), Terrassen über dem Wasser für Borchert, Huggo's, Rivva und Bootshus,
// Nicky Beach als Pool-Party (Pool, DJ, tanzende Gäste, Daybeds, Bar). Stilvoll in Teak, Creme und Marine. Nachts warmes Licht über den Terrassen.
import * as THREE from 'three';
import { M } from './haeuser.js?v=1795048919';
import { neueFigur, einkleiden, tanzen } from './leben.js?v=1795048919';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .6 }, o));
const TEAK = std('#a9744a', { roughness: .7 }), TEAK_HELL = std('#c89a6a', { roughness: .75 }), CREME = std('#f5efe4', { roughness: .8 }), WEISS = std('#fbfaf7', { roughness: .5 }),
  MARINE = std('#1d2b44', { roughness: .5 }), CHROM = std('#e6eaee', { metalness: 1, roughness: .2 }), STAMM = std('#8a6a4a', { roughness: .9 }),
  POOL = new THREE.MeshPhysicalMaterial({ color: '#4fc3d8', roughness: .05, clearcoat: 1, emissive: '#2aa7bf', emissiveIntensity: 0 });
const LICHT = []; // Lichterketten und Laternen, nachts warm an
function teil(geo, mat, x, y, z, eltern) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; eltern.add(m); return m }
const kiste = (w, h, d, mat, x, y, z, g) => teil(new THREE.BoxGeometry(w, h, d), mat, x, y + h / 2, z, g);
function schirm(x, z, g, farbe = CREME) { teil(new THREE.CylinderGeometry(.05, .05, 2.6, 6), TEAK, x, 1.3, z, g); const d = teil(new THREE.ConeGeometry(1.2, .45, 12, 1, true), farbe, x, 2.55, z, g); d.material.side = THREE.DoubleSide }
function lichterkette(a, b, g, n = 10) { const mat = new THREE.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffd59a', emissiveIntensity: .1 }); LICHT.push(mat);
  for (let i = 0; i <= n; i++) { const u = i / n, x = a.x + (b.x - a.x) * u, z = a.z + (b.z - a.z) * u, y = a.y + (b.y - a.y) * u - Math.sin(u * Math.PI) * .5; teil(new THREE.SphereGeometry(.08, 6, 5), mat, x, y, z, g) } }
// Terrasse über dem Wasser vor einem Lokal: Holzdeck auf Pfählen, Tische mit Stühlen, Schirme, Geländer, Lichterkette
function terrasse(x0, x1, farbeSchirm, g) { const w = x1 - x0, z0 = 42.2 * M, z1 = 45.6 * M, d = z1 - z0, mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
  kiste(w, .25, d, TEAK, mx, .35, mz, g); for (const px of [x0 + .4, mx, x1 - .4]) for (const pz of [z1 - .3]) kiste(.3, .8, .3, STAMM, px, -.45, pz, g);
  for (const px of [x0 + .2, x1 - .2]) kiste(.08, 1, d, CHROM, px, .6, mz, g); kiste(w, 1, .08, CHROM, mx, .6, z1 - .1, g);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const tx = x0 + w * (.22 + i * .28), tz = z0 + d * (.32 + j * .4); kiste(1.1, .08, 1.1, WEISS, tx, 1.15, tz, g); kiste(.12, .75, .12, CHROM, tx, .45, tz, g);
    for (const [cx, cz] of [[-.85, 0], [.85, 0]]) { kiste(.6, .5, .6, MARINE, tx + cx, .6, tz + cz, g); kiste(.6, .5, .1, MARINE, tx + cx * 1.25, .95, tz + cz, g) } if ((i + j) % 2 === 0) schirm(tx, tz, g, farbeSchirm) }
  const pf1 = { x: x0 + .2, y: 3, z: z1 - .1 }, pf2 = { x: x1 - .2, y: 3, z: z1 - .1 }; for (const p of [pf1, pf2]) kiste(.1, 3, .1, TEAK, p.x, .45, p.z, g); lichterkette(pf1, pf2, g, 14) }
// Nicky Beach in krass (Martin 19.11.2026: „Wir sind Nicky Beach, Berghain ist die Konkurrenz“): Neonschild über dem DJ, LED-Wand mit Equalizer,
// Laser, Wasserfontänen am Pool, Riesenflamingo, Champagnerturm, Feuerschalen, VIP-Cabana in Gold, Konfetti. Alles nur leuchtend, kein echtes Licht (Tempo-Regel).
const KRASS = { laser: [], fontaenen: [], feuer: [], eq: null, konfetti: null, flamingo: null, schild: null };
const leucht = (c, i = 1.5, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, emissive: c, emissiveIntensity: i, roughness: .4 }, o));
function krass(k, g) { const { x0, w, px, pz, pw, pd, dx, dz, bx, bz } = k;
  /* Neonschild NICKY BEACH auf Stahlrahmen hinter dem DJ */
  const c = document.createElement('canvas'); c.width = 1024; c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#0b0710'; x.fillRect(0, 0, 1024, 256);
  x.font = 'italic 900 150px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.shadowColor = '#ff4fa3'; x.shadowBlur = 40; x.fillStyle = '#ffd1e8'; x.fillText('Nicky Beach', 512, 120);
  x.shadowBlur = 0; x.font = '700 34px Arial'; x.fillStyle = '#2fe0d2'; x.fillText('P O O L   ·   P A R T Y   ·   E V E R Y   D A Y', 512, 222);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const schild = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.25), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  schild.position.set(dx, 7.2, dz - 1.2); g.add(schild); KRASS.schild = schild; for (const sx of [-4.6, 4.6]) kiste(.18, 8.4, .18, CHROM, dx + sx, 0, dz - 1.25, g);
  /* LED-Wand mit Equalizer hinter dem Pult */
  const ec = document.createElement('canvas'); ec.width = 256; ec.height = 96; const et = new THREE.CanvasTexture(ec); et.colorSpace = THREE.SRGBColorSpace;
  const wand = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 2.1), new THREE.MeshBasicMaterial({ map: et, toneMapped: false })); wand.position.set(dx, 2.9, dz - .75); g.add(wand); KRASS.eq = { c: ec, x: ec.getContext('2d'), t: et, n: 0 };
  /* Laser vom Lichtrigg über die Menge */
  ['#ff2fa0', '#2fe0d2', '#9b5cff', '#ffd36b', '#ff2fa0', '#2fe0d2'].forEach((farbe, i) => { const h = new THREE.Group(); h.position.set(dx - 2 + i * .8, 4.3, dz - .4);
    const strahl = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 22, 5), new THREE.MeshBasicMaterial({ color: farbe, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false }));
    strahl.position.y = -11; h.add(strahl); g.add(h); KRASS.laser.push({ h, s: strahl, ph: i * 1.1 }) });
  /* Fontänen an den vier Poolecken */
  const wasserMat = new THREE.MeshBasicMaterial({ color: '#bff6ff', transparent: true, opacity: .5, blending: THREE.AdditiveBlending, depthWrite: false });
  for (const [ex, ez] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const f = teil(new THREE.CylinderGeometry(.06, .16, 1, 8, 1, true), wasserMat, px + ex * (pw / 2 + .2), .4, pz + ez * (pd / 2 + .2), g); f.castShadow = false; KRASS.fontaenen.push({ f, ph: (ex + ez + 2) * .8 }) }
  /* Riesenflamingo im Pool */
  const fl = new THREE.Group(), rosa = std('#ff8fc7', { roughness: .35 }); fl.position.set(px + pw * .25, .45, pz); g.add(fl);
  const koerper = teil(new THREE.SphereGeometry(.9, 16, 12), rosa, 0, .2, 0, fl); koerper.scale.set(1.4, .6, .9); const hals = teil(new THREE.TorusGeometry(.6, .13, 8, 16, Math.PI * 1.2), rosa, -.9, .9, 0, fl); hals.rotation.z = -.4;
  teil(new THREE.SphereGeometry(.22, 10, 8), rosa, -1.25, 1.65, 0, fl); teil(new THREE.ConeGeometry(.08, .35, 8), std('#16171a'), -1.5, 1.6, 0, fl).rotation.z = Math.PI / 2; KRASS.flamingo = fl;
  /* Champagnerturm auf der Bar */
  const glas = std('#f3dc8a', { metalness: .3, roughness: .1, transparent: true, opacity: .85, emissive: '#ffcf5a', emissiveIntensity: .25 }); LICHT.push(glas);
  for (let r = 0; r < 4; r++) for (let i = 0; i <= r; i++) for (let j = 0; j <= r; j++) teil(new THREE.ConeGeometry(.09, .16, 8), glas, bx - .6 + (i - r / 2) * .19, 1.38 + (3 - r) * .17, bz + (j - r / 2) * .19, g).rotation.x = Math.PI;
  /* Feuerschalen am Eingang zum Deck */
  for (let i = 0; i < 4; i++) { const fx = x0 + w * (.05 + i * .3), fz = 42.3 * M; kiste(.5, .6, .5, std('#2b2b30', { metalness: .6, roughness: .3 }), fx, .2, fz, g);
    const flamme = teil(new THREE.ConeGeometry(.28, .9, 10), leucht('#ff7a1a', 2.2, { transparent: true, opacity: .9 }), fx, 1.25, fz, g); flamme.castShadow = false; KRASS.feuer.push({ f: flamme, ph: i * 1.7 }) }
  /* VIP-Cabana in Gold mit Vorhängen */
  const vx = x0 + w * .5, vz = 46.3 * M, gold = std('#e6c76a', { metalness: .8, roughness: .25 }); for (const [ox, oz] of [[-1.3, -1], [1.3, -1], [-1.3, 1], [1.3, 1]]) kiste(.12, 3, .12, gold, vx + ox, .2, vz + oz, g);
  kiste(2.9, .12, 2.3, gold, vx, 3.2, vz, g); kiste(2.4, .4, 1.8, WEISS, vx, .2, vz, g); kiste(2.2, .2, 1.6, std('#1d2b44'), vx, .6, vz, g);
  const vorhang = std('#fbfaf7', { transparent: true, opacity: .7, side: THREE.DoubleSide }); for (const ox of [-1.3, 1.3]) kiste(.03, 2.9, 2.2, vorhang, vx + ox, .3, vz, g);
  const vip = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .4), leucht('#e6c76a', 1.2)); vip.position.set(vx, 3.6, vz + 1.16); g.add(vip);
  /* Konfetti über der Tanzfläche */
  const n = 400, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), farben = ['#ff4fa3', '#2fe0d2', '#ffd36b', '#ffffff', '#9b5cff'].map(f => new THREE.Color(f));
  for (let i = 0; i < n; i++) { pos[i * 3] = px + (Math.random() - .5) * (pw + 8); pos[i * 3 + 1] = Math.random() * 9; pos[i * 3 + 2] = pz + (Math.random() - .5) * (pd + 6); const fc = farben[i % 5]; col.set([fc.r, fc.g, fc.b], i * 3) }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const konfetti = new THREE.Points(geo, new THREE.PointsMaterial({ size: .18, vertexColors: true, transparent: true, opacity: .9, depthWrite: false })); g.add(konfetti); KRASS.konfetti = { p: konfetti, pos, y0: 0 };
  /* mehr Gäste auf dem Deck vor dem DJ */
  for (let i = 0; i < 14; i++) gast(40 + i, dx - 3.5 + (i % 7) * 1.1, dz + 3.2 + Math.floor(i / 7) * 1.2, g, false) }
function krassWeiter(t, nacht) {
  if (KRASS.eq && (KRASS.eq.n++ % 3 === 0)) { const { x, c, t: tx } = KRASS.eq; x.fillStyle = '#07050b'; x.fillRect(0, 0, c.width, c.height); const balken = 24;
    for (let i = 0; i < balken; i++) { const h = (.25 + .75 * Math.abs(Math.sin(t * (3 + i * .37) + i) * Math.sin(t * 2.1 + i * .5))) * c.height; const gr = x.createLinearGradient(0, c.height, 0, 0); gr.addColorStop(0, '#ff2fa0'); gr.addColorStop(.6, '#9b5cff'); gr.addColorStop(1, '#2fe0d2'); x.fillStyle = gr; x.fillRect(i * (c.width / balken) + 2, c.height - h, c.width / balken - 4, h) } tx.needsUpdate = true }
  const beat = Math.sin(t * 13.4) > .3; for (const l of KRASS.laser) { l.h.rotation.z = Math.sin(t * .9 + l.ph) * .9; l.h.rotation.x = .5 + Math.cos(t * .7 + l.ph) * .4; l.s.material.opacity = (beat ? .65 : .35) * (.4 + nacht * .6) }
  for (const f of KRASS.fontaenen) { const h = 1.2 + Math.abs(Math.sin(t * 2 + f.ph)) * 2.8; f.f.scale.y = h; f.f.position.y = .4 + h / 2 }
  for (const f of KRASS.feuer) { f.f.scale.set(1 + Math.sin(t * 17 + f.ph) * .1, 1 + Math.sin(t * 11 + f.ph) * .2, 1) }
  if (KRASS.flamingo) { KRASS.flamingo.rotation.y = Math.sin(t * .3) * .6; KRASS.flamingo.position.y = .45 + Math.sin(t * 1.4) * .08 }
  if (KRASS.schild) KRASS.schild.material.color.setScalar(Math.sin(t * 2.3) > -.85 ? 1 : .55);
  if (KRASS.konfetti) { const p = KRASS.konfetti.pos; for (let i = 1; i < p.length; i += 3) { p[i] -= .02 + (i % 7) * .002; if (p[i] < 0) p[i] = 9 } KRASS.konfetti.p.geometry.attributes.position.needsUpdate = true } }
// Nicky Beach: Beachclub im Sand mit Daybeds, Schirmen, Pool, Bar und Palmen
// Nicky Beach: Pool-Party. Großer leuchtender Pool mit Schwimmringen, DJ-Pult mit Lichtrigg, tanzende Gäste, Daybeds, Bar.
const TAENZER = [], RINGE = [], SPOTS = [];
const GAESTE = [['#f6dcc8', '#e6d3a3', '#ffffff', 'welle'], ['#8d5b3d', '#141414', '#ff4fa3', 'locken'], ['#e4b997', '#3a2416', '#16171a', 'glatt'], ['#f1d0b5', '#a8562a', '#2fe0d2', 'bob'], ['#c48f6b', '#141414', '#ffd36b', 'dutt'], ['#f3d5bf', '#e6d3a3', '#c9b48a', 'zopf']];
function gast(i, x, z, g, imPool) { const f = neueFigur(), [skin, hair, top, frisur] = GAESTE[i % GAESTE.length]; einkleiden(f, { skin, hair, top, c1: top, dress: imPool ? 0 : 1, w: 1, frisur, acc: i % 3 ? [] : ['sonnenbrille'] });
  f.visible = true; f.scale.setScalar(1.15); f.position.set(x, imPool ? -.55 : .25, z); f.rotation.y = Math.random() * 6; g.add(f); TAENZER.push({ f, ph: i * .9, y: f.position.y }) }
function beachclub(x0, x1, g) { const w = x1 - x0, mx = (x0 + x1) / 2, pz = 43.7 * M, pw = w * .62, pd = 2.1 * M, px = x0 + w * .4;
  kiste(w, .2, 3.2 * M, TEAK_HELL, mx, .03, 43.3 * M, g); // großes Holzdeck
  kiste(pw + .8, .35, pd + .8, WEISS, px, 0, pz, g); teil(new THREE.BoxGeometry(pw, .1, pd), POOL, px, .32, pz, g); // Pool mit weißem Rand
  // Schwimmringe in Weiß, Gold und Rosé
  for (let i = 0; i < 6; i++) { const r = teil(new THREE.TorusGeometry(.55, .2, 10, 24), [WEISS, std('#e6c76a', { metalness: .4, roughness: .3 }), std('#ffb3d1')][i % 3], px - pw * .4 + i * pw * .16, .45, pz + (i % 2 ? .9 : -.9), g); r.rotation.x = Math.PI / 2; RINGE.push({ r, ph: i }) }
  // Daybeds an der Wasserseite
  for (let i = 0; i < 4; i++) { const x = x0 + w * (.12 + i * .22), z = 45.7 * M; kiste(1.8, .35, 2.2, WEISS, x, .03, z, g); kiste(1.6, .18, 2, CREME, x, .38, z, g); if (i % 2 === 0) schirm(x + 1.3, z, g) }
  // DJ-Pult mit Boxen und Lichtrigg
  const dx = x0 + w * .86, dz = 42.9 * M; kiste(2.6, 1.1, 1, MARINE, dx, .23, dz, g); const front = new THREE.MeshStandardMaterial({ color: '#16171a', emissive: '#ff8fc7', emissiveIntensity: .4 }); LICHT.push(front); kiste(2.5, .25, .05, front, dx, .6, dz + .52, g);
  for (const sx of [-1.8, 1.8]) kiste(.7, 1.8, .7, std('#0e0f12', { roughness: .4 }), dx + sx, .23, dz, g);
  for (const sx of [-2.2, 2.2]) kiste(.1, 4, .1, CHROM, dx + sx, .23, dz - .4, g); kiste(4.5, .12, .12, CHROM, dx, 4.2, dz - .4, g);
  ['#ffd36b', '#ff8fc7', '#9fe8ff', '#ffffff'].forEach((c, i) => { const kegel = new THREE.Mesh(new THREE.ConeGeometry(1.6, 5, 16, 1, true), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .08, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    const halter = new THREE.Group(); halter.position.set(dx - 1.6 + i * 1.07, 4.2, dz - .4); kegel.position.y = -2.5; halter.add(kegel); g.add(halter); SPOTS.push({ halter, kegel, ph: i * 1.3 }) });
  // Bar mit Strohdach
  const bx = x0 + w * .12, bz = 42.7 * M; kiste(3.4, 1.1, 1.1, TEAK, bx, .23, bz, g); kiste(3.6, .1, 1.3, WEISS, bx, 1.33, bz, g); const dach = teil(new THREE.ConeGeometry(2.8, 1.1, 8), std('#d8c39a', { roughness: .95 }), bx, 3.5, bz, g); dach.rotation.y = .4;
  for (const [ex, ez] of [[-1.5, -.4], [1.5, -.4], [-1.5, .5], [1.5, .5]]) kiste(.14, 3, .14, TEAK, bx + ex, .23, bz + ez, g);
  lichterkette({ x: bx + 1.5, y: 3, z: bz }, { x: dx - 2.2, y: 3.8, z: dz - .4 }, g, 18);
  // Gäste: am Beckenrand und auf dem Deck tanzend, drei im Pool
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; gast(i, px + Math.cos(a) * (pw / 2 + 1.1), pz + Math.sin(a) * (pd / 2 + 1), g, false) }
  for (let i = 0; i < 4; i++) gast(20 + i, dx - 2 + i * 1.3, dz + 2, g, false);
  for (let i = 0; i < 3; i++) gast(30 + i, px - pw * .25 + i * pw * .25, pz + (i - 1) * .8, g, true);
  krass({ x0, x1, w, px, pz, pw, pd, dx, dz, bx, bz }, g) }
export function strand(szene) { const g = new THREE.Group(); szene.add(g);
  // Promenade: Holzplanken entlang der Kaikante, Palmen in festem Abstand, schlichte Laternen
  for (let x = 0; x < 48; x += 2) kiste(2 * M - .1, .08, 1 * M, (x / 2) % 2 ? TEAK_HELL : TEAK, (x + 1) * M, .02, 42.5 * M, g);
  const laterne = new THREE.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffd59a', emissiveIntensity: .1 }); LICHT.push(laterne);
  for (let x = 3.5; x < 48; x += 4) { kiste(.12, 3.2, .12, MARINE, x * M, 0, 42.9 * M, g); teil(new THREE.SphereGeometry(.22, 10, 8), laterne, x * M, 3.35, 42.9 * M, g) }
  // Terrassen über dem Wasser vor den Lokalen (Grundstücke 0 bis 3 in Reihe 4) und der Beachclub vor Nicky Beach
  const schirme = [CREME, std('#e9dcc6'), CREME, std('#dfe7ee')]; for (let k = 0; k < 4; k++) terrasse((8 * k + 3.2) * M, (8 * k + 6.8) * M, schirme[k], g);
  beachclub(33.6 * M, 41 * M, g);
  let t = 0;
  return { weiter(nacht, dt = .016) { t += dt; for (const m of LICHT) m.emissiveIntensity = .1 + nacht * 2.6; POOL.emissiveIntensity = .15 + nacht * .6;
    krassWeiter(t, nacht); for (const d of TAENZER) d.f.position.y = d.y + tanzen(d.f, t, d.ph); for (const r of RINGE) { r.r.position.y = .45 + Math.sin(t * 1.5 + r.ph) * .06; r.r.rotation.z = t * .2 + r.ph }
    for (const s of SPOTS) { s.halter.rotation.z = Math.sin(t * 1.2 + s.ph) * .5; s.halter.rotation.x = Math.cos(t * .9 + s.ph) * .35; s.kegel.material.opacity = .05 + nacht * .16 + (Math.sin(t * 8 + s.ph) > .6 ? .05 : 0) } } } }
