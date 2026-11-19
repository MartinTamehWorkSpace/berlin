// Berlin City 3D · taschen.js · Handtaschen als echte 3D-Modelle, je Form mit ihren Erkennungszeichen.
// Jede Tasche wird einmal gebaut, nach Material zusammengefasst (wenige Zeichenaufrufe) und dann für alle Figuren wiederverwendet.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { MUSTER } from './texturen.js?v=1795050164';

const GOLD = new THREE.MeshStandardMaterial({ color: '#f0cf6a', metalness: 1, roughness: .22 }), SILBER = new THREE.MeshStandardMaterial({ color: '#e4e8ee', metalness: 1, roughness: .2 });
const VACHETTA = new THREE.MeshStandardMaterial({ color: '#c9a46b', roughness: .55 });
const hell = (hex, f) => '#' + new THREE.Color(hex).multiplyScalar(f).getHexString();
function flechten(farbe) { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = farbe; x.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { const g = x.createLinearGradient(i * 16, j * 16, i * 16 + 16, j * 16 + 16); const a = (i + j) % 2; g.addColorStop(0, a ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.18)'); g.addColorStop(1, a ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.1)'); x.fillStyle = g; x.fillRect(i * 16 + 1, j * 16 + 1, 14, 14) }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); return t }
function lederMat(t) { const f = t.f; let map = null; const farbe = t.c;
  if (f === 'tonne') map = MUSTER.monogramm(); else if (f === 'stepp' || f === 'kette') map = MUSTER.stepp(farbe); else if (f === 'knoten') map = flechten(farbe);
  if (map && f !== 'knoten') { map = map.clone(); map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.set(f === 'tonne' ? 2.5 : 3, f === 'tonne' ? 1.6 : 2.2); map.needsUpdate = true }
  return new THREE.MeshStandardMaterial({ color: map && f === 'tonne' ? '#ffffff' : (map ? '#ffffff' : farbe), map, roughness: f === 'stepp' || f === 'kette' ? .35 : .5, metalness: .05 }) }
// Grundriss des Körpers als Fläche, wird mit Wölbung extrudiert
function form(f, w, h) { const s = new THREE.Shape(); const r = Math.min(w, h) * .12;
  if (f === 'birkin' || f === 'halb') { s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w * .42, h); s.lineTo(-w * .42, h); s.closePath() }
  else if (f === 'knoten') { s.absellipse(0, h / 2, w / 2, h / 2, 0, Math.PI * 2) }
  else { s.moveTo(-w / 2 + r, 0); s.lineTo(w / 2 - r, 0); s.quadraticCurveTo(w / 2, 0, w / 2, r); s.lineTo(w / 2, h - r); s.quadraticCurveTo(w / 2, h, w / 2 - r, h); s.lineTo(-w / 2 + r, h); s.quadraticCurveTo(-w / 2, h, -w / 2, h - r); s.lineTo(-w / 2, r); s.quadraticCurveTo(-w / 2, 0, -w / 2 + r, 0) }
  return s }
const CACHE = {};
export function tasche3d(t, schluessel) { const k = schluessel || t.id || (t.c + t.f); if (CACHE[k]) return CACHE[k].clone();
  const f = t.f || 'klappe', w = .3 * (t.w / 4.4), h = .3 * (t.h / 3.2), tief = f === 'tonne' ? .16 : f === 'birkin' ? .15 : .08;
  const metall = /c0c4cc|ffffff/.test(t.d || '') ? SILBER : GOLD, leder = lederMat(t), kante = new THREE.MeshStandardMaterial({ color: hell(t.c, f === 'tonne' ? 1 : .7), roughness: .5 });
  const teile = new Map(); const dazu = (geo, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.updateMatrix(); const g = geo.index ? geo.toNonIndexed() : geo.clone(); g.applyMatrix4(m.matrix); for (const n of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(n)) g.deleteAttribute(n); if (!teile.has(mat)) teile.set(mat, []); teile.get(mat).push(g) };
  // Körper
  if (f === 'tonne') { dazu(new THREE.CapsuleGeometry(h * .5, w - h, 6, 16), leder, 0, h * .5, 0, 0, 0, Math.PI / 2); for (const sx of [-1, 1]) dazu(new THREE.CylinderGeometry(h * .5 + .004, h * .5 + .004, .02, 16), VACHETTA, sx * (w / 2 - h * .25), h * .5, 0, 0, 0, Math.PI / 2) }
  else { const geo = new THREE.ExtrudeGeometry(form(f, w, h), { depth: tief, bevelEnabled: true, bevelThickness: tief * .25, bevelSize: Math.min(w, h) * .05, bevelSegments: 3, curveSegments: 12 }); geo.translate(0, 0, -tief / 2); dazu(geo, leder) }
  const vorne = tief / 2 + tief * .25 + .002;
  // Klappe
  if (f === 'birkin' || f === 'kette' || f === 'stepp' || f === 'klappe') { const kh = h * (f === 'birkin' ? .36 : .55); const kl = new THREE.Shape(); const kw = f === 'birkin' ? w * .86 : w;
    if (f === 'klappe') { kl.moveTo(-kw / 2, 0); kl.quadraticCurveTo(0, -kh * .35, kw / 2, 0); kl.lineTo(kw / 2, kh); kl.lineTo(-kw / 2, kh); kl.closePath() } else { kl.moveTo(-kw / 2, 0); kl.lineTo(kw / 2, 0); kl.lineTo(kw / 2, kh); kl.lineTo(-kw / 2, kh); kl.closePath() }
    dazu(new THREE.ExtrudeGeometry(kl, { depth: .012, bevelEnabled: true, bevelThickness: .004, bevelSize: .004, bevelSegments: 2 }), f === 'birkin' || f === 'klappe' ? kante : leder, 0, h - kh, vorne - .004) }
  // Beschläge
  if (f === 'birkin') { dazu(new THREE.BoxGeometry(w * .3, .022, .012), metall, 0, h * .66, vorne + .012); for (const sx of [-1, 1]) dazu(new THREE.BoxGeometry(.04, h * .48, .012), kante, sx * w * .2, h * .74, vorne + .008);
    dazu(new THREE.BoxGeometry(.045, .04, .02), metall, 0, h * .58, vorne + .018); dazu(new THREE.TorusGeometry(.017, .005, 6, 12, Math.PI), metall, 0, h * .5, vorne + .022); dazu(new THREE.BoxGeometry(.045, .04, .02), metall, 0, h * .44, vorne + .024);
    dazu(new THREE.ConeGeometry(.022, .07, 10), kante, w * .32, h * .78, vorne + .015); for (const sx of [-1, 1]) for (const sz of [-1, 1]) dazu(new THREE.SphereGeometry(.009, 6, 4), metall, sx * w * .4, -.004, sz * tief * .4) }
  else if (f === 'kette' || f === 'stepp') dazu(new THREE.BoxGeometry(.05, .03, .012), metall, 0, h * .48, vorne + .012);
  else if (f === 'klappe') dazu(new THREE.TorusGeometry(.022, .006, 6, 16), metall, 0, h * .38, vorne + .012);
  else if (f === 'halb') { const tr = new THREE.Shape(); tr.moveTo(-.035, 0); tr.lineTo(.035, 0); tr.lineTo(0, -.045); tr.closePath(); dazu(new THREE.ExtrudeGeometry(tr, { depth: .006, bevelEnabled: false }), /c0c4cc/.test(t.d || '') ? SILBER : GOLD, 0, h * .7, vorne) }
  else if (f === 'tonne') { dazu(new THREE.BoxGeometry(.035, .03, .02), metall, 0, h * .95, h * .5 * .2 + .02) }
  // Henkel und Riemen
  if (f === 'kette' || f === 'stepp') { const n = 22; for (let i = 0; i <= n; i++) { const u = i / n, x = (u - .5) * w * .85, y = h + Math.sin(u * Math.PI) * h * 1.25; dazu(new THREE.TorusGeometry(.011, .0035, 5, 10), metall, x, y, 0, 0, i % 2 ? Math.PI / 2 : 0, 0) } }
  else if (f === 'knoten') { dazu(new THREE.TorusGeometry(w * .22, .02, 8, 20, Math.PI), leder, 0, h * .92, 0); dazu(new THREE.SphereGeometry(.035, 10, 8), leder, 0, h * .92 + w * .22, 0) }
  else if (f === 'klappe') dazu(new THREE.TorusGeometry(w * .38, .008, 6, 24, Math.PI), kante, 0, h * .85, 0);
  else { const r = f === 'birkin' ? w * .17 : w * .15, griff = f === 'tonne' ? VACHETTA : kante; for (const sz of f === 'tonne' ? [-1, 1] : [-1, 1]) dazu(new THREE.TorusGeometry(r, f === 'birkin' ? .013 : .009, 8, 20, Math.PI), griff, 0, h * (f === 'tonne' ? .98 : .95), sz * (f === 'tonne' ? .02 : tief * .3)) }
  const g = new THREE.Group(); for (const [m, geos] of teile) { const mesh = new THREE.Mesh(mergeGeometries(geos, false), m); mesh.castShadow = true; g.add(mesh) }
  g.scale.setScalar(.75); CACHE[k] = g; return g.clone() }
