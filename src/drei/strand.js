// Berlin 3D · strand.js · Die Wasserfront: Holzpromenade (Palmen kommen aus S über leben.js), Terrassen über dem Wasser für Borchert, Ryotei 398, Papillong und Grill Royale,
// Scorpius Berlin als Boho-Beachclub (Steinpool, Schilfpergola, Rattanlampen, Feuer). Stilvoll in Stein, Leinen und Holz. Nachts warmes Licht über den Terrassen.
import * as THREE from 'three';
import { M } from './haeuser.js?v=1795081882';
import { neueFigur, einkleiden, tanzen } from './leben.js?v=1795081882';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .6 }, o));
const TEAK = std('#a9744a', { roughness: .7 }), TEAK_HELL = std('#c89a6a', { roughness: .75 }), CREME = std('#f5efe4', { roughness: .8 }), WEISS = std('#fbfaf7', { roughness: .5 }),
  MARINE = std('#1d2b44', { roughness: .5 }), CHROM = std('#e6eaee', { metalness: 1, roughness: .2 }), STAMM = std('#8a6a4a', { roughness: .9 }),
  POOL = new THREE.MeshPhysicalMaterial({ color: '#3b9aa6', roughness: .04, clearcoat: 1, emissive: '#1f7f8c', emissiveIntensity: 0 });
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
// Scorpius Berlin draußen (Martin 19.11.2026: kein Kitsch, Boho wie Scorpios Mykonos): weiß gekalktes Steindeck, großer Infinity-Pool mit Natursteinrand,
// Schilfpergola mit Rattanlampen über Leinen-Daybeds, Strohschirme, Olivenbäume und Pampasgras in Terrakotta, Amphitheater mit Feuerstelle,
// DJ-Pult aus Treibholz, Steinbar mit Strohdach, geschnitztes Holzschild. Keine Neonfarben, keine Laser, nur warmes Licht (keine echten Lichtquellen).
const KRASS = { feuer: [], lampen: [] };
const STEIN = std('#e9e1d2', { roughness: .95 }), STEIN_DUNKEL = std('#d6cab3', { roughness: .95 }), LEINEN = std('#f4efe6', { roughness: .9 }), RATTAN = std('#c99a5b', { roughness: .85 }),
  STROH = std('#cdb98e', { roughness: 1 }), TERRA = std('#b5643c', { roughness: .9 }), OLIV = std('#7d8c55', { roughness: .9, flatShading: true }), TREIBHOLZ = std('#9c8a74', { roughness: .95 });
function olive(x, z, g, s = 1) { teil(new THREE.CylinderGeometry(.55 * s, .4 * s, .9 * s, 14), TERRA, x, .45 * s, z, g); teil(new THREE.CylinderGeometry(.08 * s, .14 * s, 1.6 * s, 6), std('#6b5a48'), x, 1.6 * s, z, g);
  for (const [dx, dy, dz, r] of [[0, 2.6, 0, .9], [.5, 2.3, .2, .65], [-.45, 2.4, -.2, .7]]) teil(new THREE.IcosahedronGeometry(r * s, 0), OLIV, x + dx * s, dy * s, z + dz * s, g) }
function pampas(x, z, g) { teil(new THREE.CylinderGeometry(.35, .3, .6, 12), TERRA, x, .3, z, g); for (let i = 0; i < 7; i++) { const h = teil(new THREE.ConeGeometry(.09, 1.6, 6), std('#e8dcc2', { roughness: 1 }), x + Math.sin(i * 2.4) * .18, 1.4, z + Math.cos(i * 2.4) * .18, g); h.rotation.set(Math.sin(i) * .3, 0, Math.cos(i * 1.7) * .3) } }
function rattanLampe(x, y, z, g, r = .45) { const mat = new THREE.MeshStandardMaterial({ color: '#c99a5b', emissive: '#ffb866', emissiveIntensity: .1, roughness: .9, side: THREE.DoubleSide }); LICHT.push(mat); KRASS.lampen.push(mat);
  const l = teil(new THREE.SphereGeometry(r, 14, 10, 0, Math.PI * 2, 0, Math.PI * .62), mat, x, y, z, g); l.castShadow = false; teil(new THREE.CylinderGeometry(.01, .01, 1.2, 4), std('#3a2e22'), x, y + .9, z, g) }
function strohschirm(x, z, g) { teil(new THREE.CylinderGeometry(.06, .07, 2.8, 6), TREIBHOLZ, x, 1.4, z, g); const d = teil(new THREE.ConeGeometry(1.7, .7, 14, 1, true), STROH, x, 2.85, z, g); d.material.side = THREE.DoubleSide }
function daybed(x, z, g, kissen) { kiste(2, .45, 1.5, STEIN_DUNKEL, x, .03, z, g); kiste(1.85, .2, 1.35, LEINEN, x, .48, z, g); for (let i = 0; i < 3; i++) kiste(.45, .35, .18, std(kissen[i % kissen.length], { roughness: .95 }), x - .55 + i * .55, .68, z - .55, g) }
const GAESTE = [['#f6dcc8', '#e6d3a3', '#f4efe6', 'welle'], ['#8d5b3d', '#141414', '#e8dcc6', 'locken'], ['#e4b997', '#3a2416', '#c9a27a', 'glatt'], ['#f1d0b5', '#a8562a', '#ffffff', 'bob'], ['#c48f6b', '#141414', '#b5643c', 'dutt'], ['#f3d5bf', '#e6d3a3', '#efe6d6', 'zopf']];
const TAENZER = [], RINGE = [], SPOTS = [];
function gast(i, x, z, g, imPool) { const f = neueFigur(), [skin, hair, top, frisur] = GAESTE[i % GAESTE.length]; einkleiden(f, { skin, hair, top, c1: top, dress: imPool ? 0 : 1, w: 1, frisur, acc: i % 3 ? [] : ['sonnenbrille'] });
  f.visible = true; f.scale.setScalar(1.15); f.position.set(x, imPool ? -.55 : .25, z); f.rotation.y = Math.random() * 6; g.add(f); TAENZER.push({ f, ph: i * .9, y: f.position.y }) }
function beachclub(x0, x1, g) { const w = x1 - x0, mx = (x0 + x1) / 2, pz = 43.9 * M, pw = w * .58, pd = 2.3 * M, px = x0 + w * .42;
  kiste(w, .22, 3.6 * M, STEIN, mx, .02, 43.6 * M, g); /* weiß gekalktes Steindeck */
  /* Infinity-Pool: Natursteinrand, Stufen, tiefes klares Wasser */
  kiste(pw + 1.4, .4, pd + 1.4, STEIN_DUNKEL, px, 0, pz, g); teil(new THREE.BoxGeometry(pw, .12, pd), POOL, px, .36, pz, g);
  for (let i = 0; i < 3; i++) kiste(1.6, .12 + i * .1, .5, STEIN, px - pw / 2 + .9, .2, pz - pd / 2 + .3 + i * .45, g);
  kiste(pw + 1.4, .5, .25, STEIN_DUNKEL, px, 0, pz + pd / 2 + .7, g);
  /* Schilfpergola mit Rattanlampen über den Daybeds an der Wasserseite */
  const pz2 = 46.4 * M; for (const ox of [-.48, -.16, .16, .48]) for (const oz of [-1.3, 1.3]) kiste(.18, 3.4, .18, TREIBHOLZ, mx + ox * w, 0, pz2 + oz, g);
  for (let i = 0; i < 26; i++) kiste(w * .98, .06, .12, STROH, mx, 3.4, pz2 - 1.5 + i * .12, g);
  const KISSEN = [['#b5643c', '#e6c76a'], ['#8a9a5b', '#efe6d6'], ['#c9a27a', '#f4efe6'], ['#b5643c', '#8a9a5b']];
  for (let i = 0; i < 4; i++) { const x = x0 + w * (.17 + i * .22); daybed(x, pz2, g, KISSEN[i]); rattanLampe(x, 2.6, pz2, g) }
  /* Strohschirme und Daybeds an der Landseite des Pools */
  for (let i = 0; i < 3; i++) { const x = px - pw / 2 + i * pw / 2; daybed(x, 41.9 * M, g, KISSEN[(i + 1) % 4]); strohschirm(x + 1.3, 41.9 * M, g) }
  /* Olivenbäume und Pampasgras */
  for (const [ox, oz, s] of [[.04, 42.2, 1.1], [.96, 42.3, 1.2], [.98, 45.1, 1], [.03, 45.3, .9]]) olive(x0 + w * ox, oz * M, g, s);
  for (const [ox, oz] of [[.25, 42.1], [.6, 42.1], [.72, 45.4], [.1, 44.6]]) pampas(x0 + w * ox, oz * M, g);
  /* Amphitheater mit Feuerstelle rechts neben dem Pool */
  const fx = x0 + w * .86, fz = 44 * M; for (let r = 2; r >= 0; r--) for (let i = 0; i < 9; i++) { const a = Math.PI * (.95 + i * .14), rad = 1.6 + r * .75; kiste(.8, .25 + r * .25, .55, r % 2 ? STEIN : STEIN_DUNKEL, fx + Math.cos(a) * rad, .2, fz + Math.sin(a) * rad, g).rotation.y = -a }
  kiste(1, .45, 1, std('#4a4038', { roughness: .9 }), fx, .2, fz, g);
  for (let i = 0; i < 5; i++) { const fl = teil(new THREE.ConeGeometry(.22, .9, 8), new THREE.MeshStandardMaterial({ color: '#ff8a2a', emissive: '#ff7a1a', emissiveIntensity: 2, transparent: true, opacity: .9 }), fx + Math.cos(i * 1.3) * .2, 1.1, fz + Math.sin(i * 1.3) * .2, g); fl.castShadow = false; KRASS.feuer.push({ f: fl, ph: i * 1.7 }) }
  /* DJ-Pult aus Treibholz mit Steinsockel an der Hausseite */
  const dx = x0 + w * .55, dz = 42.25 * M; kiste(2.4, .8, 1, STEIN_DUNKEL, dx, .2, dz, g); kiste(2.6, .12, 1.2, TREIBHOLZ, dx, 1, dz, g); for (const sx of [-1.5, 1.5]) kiste(.5, 1.3, .5, TREIBHOLZ, dx + sx, .2, dz, g); rattanLampe(dx, 2.8, dz, g, .6);
  /* Steinbar mit Strohdach */
  const bx = x0 + w * .14, bz = 42.7 * M; kiste(3.2, 1.1, 1, STEIN_DUNKEL, bx, .2, bz, g); kiste(3.4, .12, 1.2, TREIBHOLZ, bx, 1.3, bz, g); const dach = teil(new THREE.ConeGeometry(2.6, 1, 8), STROH, bx, 3.5, bz, g); dach.rotation.y = .4;
  for (const [ex, ez] of [[-1.4, -.4], [1.4, -.4], [-1.4, .5], [1.4, .5]]) kiste(.14, 3, .14, TREIBHOLZ, bx + ex, .2, bz + ez, g);
  for (let i = 0; i < 7; i++) kiste(.1, .3, .1, std(['#e6c76a', '#f4efe6', '#8a9a5b'][i % 3], { roughness: .3 }), bx - 1.2 + i * .4, 1.42, bz, g);
  /* geschnitztes Holzschild SCORPIUS am Eingang */
  const c = document.createElement('canvas'); c.width = 1024; c.height = 220; const x = c.getContext('2d'); x.fillStyle = '#8a6a4a'; x.fillRect(0, 0, 1024, 220); for (let i = 0; i < 30; i++) { x.fillStyle = `rgba(60,40,25,${.05 + (i % 3) * .03})`; x.fillRect(0, i * 7.5, 1024, 2) }
  x.font = '600 128px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#f4e3c3'; x.fillText('S C O R P I U S', 512, 100); x.font = '500 30px Georgia, serif'; x.fillStyle = '#e8d5b0'; x.fillText('B E R L I N   ·   S U N S E T   R I T U A L', 512, 185);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const schild = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1.38), new THREE.MeshStandardMaterial({ map: tex, roughness: .9, emissive: '#ffcf8a', emissiveIntensity: 0, emissiveMap: tex })); LICHT.push(schild.material);
  schild.position.set(mx, 3.1, 41.75 * M); g.add(schild); for (const sx of [-3.4, 3.4]) kiste(.22, 3.9, .22, TREIBHOLZ, mx + sx, 0, 41.75 * M, g);
  /* Laternen auf dem Deck */
  for (let i = 0; i < 10; i++) { const m = new THREE.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffb866', emissiveIntensity: .1 }); LICHT.push(m); kiste(.22, .35, .22, m, x0 + w * (.05 + i * .1), .22, 45.1 * M + (i % 2) * .6, g) }
  /* Gäste: auf den Daybeds, am Pool, barfuß vor dem DJ, drei im Wasser, ein Kreis ums Feuer */
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; gast(i, px + Math.cos(a) * (pw / 2 + 1), pz + Math.sin(a) * (pd / 2 + .9), g, false) }
  for (let i = 0; i < 8; i++) gast(20 + i, dx - 2 + (i % 4) * 1.2, dz + 1.6 + Math.floor(i / 4) * 1.1, g, false);
  for (let i = 0; i < 3; i++) gast(30 + i, px - pw * .25 + i * pw * .25, pz + (i - 1) * .8, g, true);
  for (let i = 0; i < 6; i++) { const a = Math.PI * (1 + i * .2); gast(40 + i, fx + Math.cos(a) * 1.7, fz + Math.sin(a) * 1.7, g, false) } }
function krassWeiter(t, nacht) { for (const f of KRASS.feuer) f.f.scale.set(1 + Math.sin(t * 17 + f.ph) * .12, 1 + Math.sin(t * 11 + f.ph) * .25, 1);
  for (const m of KRASS.lampen) m.emissiveIntensity = .15 + nacht * 1.6 + Math.sin(t * 2) * .03 }
/* Yachtclub Spreeblick: Pfahlbau halb im Wasser, Glas und Teak, Steg mit Liegeplätzen. Antippen öffnet den Bootsverkauf (window.yachtclubZeigen) */
function yachtclub(g) { const x = 46 * M, z = 46.5 * M, yc = new THREE.Group(); yc.position.set(x, 0, z); g.add(yc);
  const teak = std('#9a6a42', { roughness: .7 }), weiss = std('#f4f4f2', { roughness: .4 }), glas = new THREE.MeshStandardMaterial({ color: '#2a3b4c', metalness: .6, roughness: .1, emissive: '#ffd59a', emissiveIntensity: .15 }); LICHT.push(glas);
  for (const ox of [-6, -2, 2, 6]) for (const oz of [-3, 3]) kiste(.5, 2, .5, std('#5a4636'), ox, -1.4, oz, yc);
  kiste(15, .4, 8, teak, 0, .4, 0, yc); kiste(10, 3.2, 5.5, glas, 0, .8, -.5, yc); kiste(11, .35, 6.5, weiss, 0, 4, -.5, yc); kiste(7, 2.4, 4, glas, 1, 4.35, -.5, yc); kiste(8, .3, 5, weiss, 1, 6.75, -.5, yc);
  for (let i = 0; i < 4; i++) { kiste(1.2, .25, 14, teak, -6 + i * 4, .2, 11, yc) }
  const c = document.createElement('canvas'); c.width = 768; c.height = 128; const t = c.getContext('2d'); t.fillStyle = '#0b1f3a'; t.fillRect(0, 0, 768, 128); t.font = '600 64px Georgia, serif'; t.textAlign = 'center'; t.fillStyle = '#e6c76a'; t.fillText('⚓ YACHTCLUB SPREEBLICK', 384, 84);
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; const sch = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.5), new THREE.MeshBasicMaterial({ map: tx, toneMapped: false })); sch.position.set(0, 8, 2.3); yc.add(sch);
  yc.traverse(o => { o.userData.yachtclub = true }) }
export function strand(szene) { const g = new THREE.Group(); szene.add(g);
  // Promenade: Holzplanken entlang der Kaikante, Palmen in festem Abstand, schlichte Laternen
  for (let x = 0; x < 48; x += 2) kiste(2 * M - .1, .08, 1 * M, (x / 2) % 2 ? TEAK_HELL : TEAK, (x + 1) * M, .02, 42.5 * M, g);
  const laterne = new THREE.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffd59a', emissiveIntensity: .1 }); LICHT.push(laterne);
  for (let x = 3.5; x < 48; x += 4) { kiste(.12, 3.2, .12, MARINE, x * M, 0, 42.9 * M, g); teil(new THREE.SphereGeometry(.22, 10, 8), laterne, x * M, 3.35, 42.9 * M, g) }
  // Terrassen über dem Wasser vor den Lokalen (Grundstücke 0 bis 3 in Reihe 4) und der Beachclub vor Scorpius Berlin
  const schirme = [CREME, std('#e9dcc6'), CREME, std('#dfe7ee')]; for (let k = 0; k < 4; k++) terrasse((8 * k + 3.2) * M, (8 * k + 6.8) * M, schirme[k], g);
  beachclub(33.6 * M, 41 * M, g); yachtclub(g);
  let t = 0;
  return { weiter(nacht, dt = .016) { t += dt; for (const m of LICHT) m.emissiveIntensity = .1 + nacht * 2.6; POOL.emissiveIntensity = .15 + nacht * .6;
    krassWeiter(t, nacht); for (const d of TAENZER) d.f.position.y = d.y + tanzen(d.f, t, d.ph); for (const r of RINGE) { r.r.position.y = .45 + Math.sin(t * 1.5 + r.ph) * .06; r.r.rotation.z = t * .2 + r.ph }
    for (const s of SPOTS) { s.halter.rotation.z = Math.sin(t * 1.2 + s.ph) * .5; s.halter.rotation.x = Math.cos(t * .9 + s.ph) * .35; s.kegel.material.opacity = .05 + nacht * .16 + (Math.sin(t * 8 + s.ph) > .6 ? .05 : 0) } } } }
