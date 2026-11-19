// Glow City 3D · strand.js · Die Wasserfront: Holzpromenade (Palmen kommen aus S über leben.js), Terrassen über dem Wasser für Borchert, Huggo's, Rivva und Bootshus,
// Nicky Beach als Pool-Party (Pool, DJ, tanzende Gäste, Daybeds, Bar). Stilvoll in Teak, Creme und Marine. Nachts warmes Licht über den Terrassen.
import * as THREE from 'three';
import { M } from './haeuser.js?v=1795048394';
import { neueFigur, einkleiden, tanzen } from './leben.js?v=1795048394';
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
  for (let i = 0; i < 3; i++) gast(30 + i, px - pw * .25 + i * pw * .25, pz + (i - 1) * .8, g, true) }
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
    for (const d of TAENZER) d.f.position.y = d.y + tanzen(d.f, t, d.ph); for (const r of RINGE) { r.r.position.y = .45 + Math.sin(t * 1.5 + r.ph) * .06; r.r.rotation.z = t * .2 + r.ph }
    for (const s of SPOTS) { s.halter.rotation.z = Math.sin(t * 1.2 + s.ph) * .5; s.halter.rotation.x = Math.cos(t * .9 + s.ph) * .35; s.kegel.material.opacity = .05 + nacht * .16 + (Math.sin(t * 8 + s.ph) > .6 ? .05 : 0) } } } }
