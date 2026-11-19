// Glow City 3D · haeuser.js · Häuser aus dem Stadtplan (B): Art déco, Glas mit Solardach, Glow Tower. Schilder kommen aus brand() des Spiels.
// Ein Feld des Spiels = 3 Meter. Spiel-x wird 3D-X, Spiel-y wird 3D-Z.
import * as THREE from 'three';
import { markise, glasfassade } from './texturen.js?v=1795048730';

export const M = 3;
export const NEON = [], FENSTER = [], GLAS = []; // GLAS: Hochhausglas, nachts chromartig spiegelnd
const schatten = m => { m.castShadow = true; m.receiveShadow = true; return m };
const KANTE = new THREE.LineBasicMaterial({ color: '#0c0c10' });
export function kanten(mesh) { const l = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 20), KANTE); l.position.copy(mesh.position); l.rotation.copy(mesh.rotation); mesh.parent.add(l); return l }
export function box(w, h, d, mat, x, y, z, eltern) { const m = schatten(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)); m.position.set(x, y + h / 2, z); eltern.add(m); return m }
export const std = (farbe, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: farbe, roughness: .7 }, o));
export function neon(farbe, staerke = 3) { const m = new THREE.MeshStandardMaterial({ color: farbe, emissive: farbe, emissiveIntensity: staerke * .15, roughness: .4 }); m.userData.basis = staerke; NEON.push(m); return m }

// Markenschild: zeichnet mit brand() aus gebaeude.js auf eine eigene Leinwand
const SCHILD = {};
export function markenSchild(k) { if (SCHILD[k]) return SCHILD[k]; const c = document.createElement('canvas'); c.width = 1024; c.height = 256; const alt = g; g = c.getContext('2d'); g.translate(512, 128); g.scale(8, 8);
  try { brand(k, 126, 30) } catch (e) {} g = alt; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const m = new THREE.MeshStandardMaterial({ map: t, emissive: '#ffffff', emissiveMap: t, emissiveIntensity: .1, roughness: .4 }); m.userData.basis = 1.4; NEON.push(m); return SCHILD[k] = m }
export function schildNeu(k) { delete SCHILD[k] }

// Flaches Solardach: Kies, Attika, Module in Reihen
const MODUL = new THREE.MeshStandardMaterial({ color: '#1d2f5a', metalness: .45, roughness: .22 }), ATTIKA = std('#d5d8dc', { metalness: .5, roughness: .35 }), KIES = std('#b9b4ad', { roughness: 1 });
const MODUL_GEO = new THREE.BoxGeometry(1.5, .06, .95);
function solardach(eltern, w, d, y) { box(w, .2, d, KIES, 0, y, 0, eltern); for (const [ww, dd, x, z] of [[w, .35, 0, d / 2 - .17], [w, .35, 0, -d / 2 + .17], [.35, d, w / 2 - .17, 0], [.35, d, -w / 2 + .17, 0]]) box(ww, .7, dd, ATTIKA, x, y, z, eltern);
  const sp = Math.max(1, Math.floor((w - 1.6) / 1.7)), re = Math.max(1, Math.floor((d - 1.6) / 1.45)); const im = new THREE.InstancedMesh(MODUL_GEO, MODUL, sp * re); const o = new THREE.Object3D(); let i = 0;
  for (let a = 0; a < sp; a++) for (let b = 0; b < re; b++) { o.position.set(-((sp - 1) * 1.7) / 2 + a * 1.7, y + .45, -((re - 1) * 1.45) / 2 + b * 1.45); o.rotation.set(-.3, 0, 0); o.updateMatrix(); im.setMatrixAt(i++, o.matrix) }
  im.castShadow = true; eltern.add(im) }

// Schild auf einer Fassade: Seite 'L' liegt bei +Z (Spiel: y+4), Seite 'R' bei +X (Spiel: x+4)
function schildAn(eltern, k, seite, u0, u1, y, hoehe, abstand) { const breite = (u1 - u0) * M * .86; const s = new THREE.Mesh(new THREE.PlaneGeometry(breite, Math.min(hoehe, breite * .24)), markenSchild(k));
  const um = ((u0 + u1) / 2 - 2) * M; if (seite === 'L') s.position.set(um, y, abstand); else { s.position.set(abstand, y, -um); s.rotation.y = Math.PI / 2 } eltern.add(s); return s }

// Art déco: Pastell, weiße Bänder, runde Ecken vorn, Neonfinne, Markise, flaches Solardach
function deko(b, gr) { const p = b.pod, w = 4 * M - .8, d = w, stock = p.fl, h = 4.4 + (stock - 1) * 3.6 + .8, m = std(p.farbe, { roughness: .55 }), weiss = std('#fbf7f2', { roughness: .5 });
  box(w, h, d, m, 0, 0, 0, gr);
  for (const [sx, sz] of [[1, 1], [-1, 1], [1, -1]]) { const e = schatten(new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, h + 1.2, 20), m)); e.position.set(sx * (w / 2 - .7), (h + 1.2) / 2, sz * (d / 2 - .7)); gr.add(e);
    const k = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, .35, 20), weiss); k.position.set(sx * (w / 2 - .7), h + 1.35, sz * (d / 2 - .7)); gr.add(k) }
  for (let i = 1; i <= stock; i++) box(w + .2, .3, d + .2, weiss, 0, 4.4 + (i - 1) * 3.6 - .15, 0, gr);
  const glas = new THREE.MeshStandardMaterial({ color: '#2a3b4c', roughness: .12, metalness: .5, emissive: '#ffcf8a', emissiveIntensity: 0 }); glas.userData.basis = .45; FENSTER.push(glas);
  for (let i = 1; i < stock; i++) { box(w - 3.6, 1.8, .2, glas, 0, 4.4 + (i - 1) * 3.6 + .9, d / 2 + .05, gr); const q = box(.2, 1.8, d - 3.6, glas, w / 2 + .05, 4.4 + (i - 1) * 3.6 + .9, 0, gr) }
  const schau = new THREE.MeshStandardMaterial({ color: '#fff3e0', emissive: '#ffd9a8', emissiveIntensity: .3, roughness: .1 }); schau.userData.basis = .7; schau.userData.tag = .15; FENSTER.push(schau);
  box(w - 3.4, 2.6, .2, schau, 0, .2, d / 2 + .05, gr); box(.2, 2.6, d - 3.4, schau, w / 2 + .05, .2, 0, gr);
  const nf = neon(p.neon, 5); box(.45, h + 4, .45, nf, w / 2 + .1, 0, d / 2 + .1, gr); box(w + .3, .22, d + .3, nf, 0, h - .2, 0, gr);
  const mk = new THREE.Mesh(new THREE.BoxGeometry(w - 4, .2, 1.6), std('#fff', { map: markise(p.neon, '#ffffff') })); mk.position.set(0, 3.3, d / 2 + .8); mk.rotation.x = .2; mk.castShadow = true; gr.add(mk);
  const k = (p.shops[0] || [])[3]; if (k) { schildAn(gr, k, 'L', .4, 3.6, 3.95 + .6, 1.4, d / 2 + .12); schildAn(gr, k, 'R', .4, 3.6, 3.95 + .6, 1.4, w / 2 + .12) }
  solardach(gr, w - 1.2, d - 1.2, h); return h }

// Beton: Koloss aus einem alten Heizkraftwerk, fast fensterlos, hohe schmale Schlitze, Treppenturm, rotes Licht über der Tür
function beton(b, gr) { const p = b.pod, w = 4 * M - .8, d = w, h = 7 + p.fl * 2.4;
  const m = std(p.farbe || '#8a8781', { roughness: .95 }), sockel = std('#5f5d59', { roughness: .95 }), kranz = std('#9b978f', { roughness: .9 });
  box(w, h, d, m, 0, 0, 0, gr); box(w + .35, 2.2, d + .35, sockel, 0, 0, 0, gr); box(w + .3, .55, d + .3, kranz, 0, h - .55, 0, gr);
  for (const x of [-w / 2 + .35, w / 2 - .35]) for (const z of [-d / 2 + .35, d / 2 - .35]) box(.7, h, .7, std('#7e7b75', { roughness: .95 }), x, 0, z, gr);
  const tt = 2.4; box(tt, h + 5, tt, m, -w / 2 + tt / 2 + .4, 0, -d / 2 + tt / 2 + .4, gr);
  const schlitz = new THREE.MeshStandardMaterial({ color: '#2a2622', emissive: '#ffbf7a', emissiveIntensity: 0, roughness: .3 }); schlitz.userData.basis = .5; FENSTER.push(schlitz);
  for (let i = -2; i <= 2; i++) { box(.5, h * .34, .22, schlitz, i * 2.1, h * .5, d / 2 + .06, gr); box(.22, h * .34, .5, schlitz, w / 2 + .06, h * .5, -i * 2.1, gr) }
  box(1.9, 3.2, .35, std('#121116', { roughness: .6 }), -1.3, 0, d / 2 + .06, gr);
  box(2, .2, .4, neon(p.neon || '#ff3b2f', 4), -1.3, 3.2, d / 2 + .12, gr);
  return h }

// Ladensockel aus Glas mit Rahmen, darüber optional ein Glasturm mit sichtbaren Geschossdecken
const TOENE = { res: '#7f9fba', clinic: '#a9cdd6', null: '#8eaac2' }; // getöntes Glas: bei Tag blaugrau statt milchig weiß
function sockelUndTurm(b, gr) { const p = b.pod, w = 4 * M - .8, d = w, hs = 4.6 + (p.fl - 1) * 3.6; const rahmen = std(new THREE.Color(p.frame || '#e9e5de').multiplyScalar(.86), { roughness: .5 });
  const schau = new THREE.MeshStandardMaterial({ color: '#fff4e6', emissive: '#ffe1b8', emissiveIntensity: .25, roughness: .08, metalness: .2 }); schau.userData.basis = .6; schau.userData.tag = .12; FENSTER.push(schau);
  kanten(box(w, hs, d, rahmen, 0, 0, 0, gr)); for (let i = 0; i < p.fl; i++) { box(w - 1, 2.8, .2, schau, 0, .5 + i * 3.6, d / 2 + .05, gr); box(.2, 2.8, d - 1, schau, w / 2 + .05, .5 + i * 3.6, 0, gr) }
  for (const [seite, u0, u1, k] of p.shops) schildAn(gr, k, seite, u0, u1, hs - 1.1, 1.5, (seite === 'L' ? d : w) / 2 + .15);
  // Tiffanny: Vitrinen mit funkelnden Diamanten und Goldringen
  if (p.shops.some(s => s[3] === 'tif')) { const dia = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#dff6ff', emissiveIntensity: .9, metalness: .2, roughness: 0 }); dia.userData.basis = 1.2; NEON.push(dia); const gold = std('#f0c94e', { metalness: 1, roughness: .2 }), samt = std('#0b3b38', { roughness: .9 });
    for (const seite of ['L', 'R']) for (let i = 0; i < 6; i++) { const u = -w / 2 + 1.4 + i * (w - 2.8) / 5, gr2 = new THREE.Group(); if (seite === 'L') gr2.position.set(u, 0, d / 2 - .45); else { gr2.position.set(w / 2 - .45, 0, -u); gr2.rotation.y = Math.PI / 2 } gr.add(gr2);
      box(.7, 1.1, .5, std('#e8f4f3'), 0, 0, 0, gr2); box(.6, .06, .42, samt, 0, 1.1, 0, gr2);
      const r = new THREE.Mesh(new THREE.TorusGeometry(.12, .03, 10, 24), gold); r.position.set(-.12, 1.3, 0); gr2.add(r); const st = new THREE.Mesh(new THREE.OctahedronGeometry(.08), dia); st.position.set(-.12, 1.45, 0); gr2.add(st);
      const k = new THREE.Mesh(new THREE.TorusGeometry(.16, .015, 8, 28, Math.PI), gold); k.position.set(.16, 1.32, 0); k.rotation.z = Math.PI; gr2.add(k); const s2 = new THREE.Mesh(new THREE.OctahedronGeometry(.05), dia); s2.position.set(.16, 1.14, 0); gr2.add(s2) } }
  // Maison du Sac: Schaufenster voller Taschen der Kollektion
  if (p.shops.some(s => s[3] === 'sac') && typeof ALLE_TASCHEN !== 'undefined') { const geo = new THREE.BoxGeometry(.5, .38, .2); let n = 0;
    for (const seite of ['L', 'R']) for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) { const t = ALLE_TASCHEN[n++ % ALLE_TASCHEN.length]; const m = new THREE.Mesh(geo, std(t.c, { roughness: .35 })); const u = -w / 2 + 1.2 + i * (w - 2.4) / 8, hy = .9 + r * 1.1;
      if (seite === 'L') m.position.set(u, hy, d / 2 - .35); else { m.position.set(w / 2 - .35, hy, -u); m.rotation.y = Math.PI / 2 } m.castShadow = true; gr.add(m);
      const reg = new THREE.Mesh(new THREE.BoxGeometry(seite === 'L' ? w - 1.6 : .5, .06, seite === 'L' ? .5 : w - 1.6), std('#b59a6a')); if (i === 0) { reg.position.set(seite === 'L' ? 0 : w / 2 - .35, hy - .22, seite === 'L' ? d / 2 - .35 : 0); gr.add(reg) } } }
  let top = hs; const t = b.tow;
  if (t) { const tw = w - (t.tier ? 1.2 : .6), th = t.fl * 3.4; // Fassade: Fensterraster mit Rahmen und getöntem Glas, nachts brennt Licht in einzelnen Fenstern. Undurchsichtig, damit man ein Haus sieht.
    const fs = glasfassade(8, t.fl);
    const glas = new THREE.MeshPhysicalMaterial({ map: fs.farbe, emissive: '#ffffff', emissiveMap: fs.leucht, emissiveIntensity: 0, metalness: .55, roughness: .07, clearcoat: 1, clearcoatRoughness: .05, envMapIntensity: 2.2 }); glas.userData.basis = 1.2; FENSTER.push(glas);
    const huelle = new THREE.Mesh(new THREE.BoxGeometry(tw, th, tw), glas); huelle.position.y = hs + th / 2; huelle.castShadow = huelle.receiveShadow = true; gr.add(huelle); kanten(huelle);
    const decke = new THREE.MeshStandardMaterial({ color: '#d6d0c8', roughness: .7, emissive: '#ffd9a0', emissiveIntensity: 0 }); decke.userData.basis = .12; FENSTER.push(decke);
    const n = t.fl; const im = new THREE.InstancedMesh(new THREE.BoxGeometry(tw - .3, .28, tw - .3), decke, n); const o = new THREE.Object3D(); for (let i = 0; i < n; i++) { o.position.set(0, hs + i * 3.4 + .15, 0); o.updateMatrix(); im.setMatrixAt(i, o.matrix) } im.castShadow = true; gr.add(im);
    box(tw * .3, th, tw * .3, std('#bdb8b0'), 0, hs, 0, gr); const profil = std('#151519', { metalness: .6, roughness: .35 });
    for (const [px, pz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) box(.35, th, .35, profil, px * (tw / 2 - .17), hs, pz * (tw / 2 - .17), gr);
    for (let i = 1; i < 3; i++) { box(.18, th, .18, profil, -tw / 2 + i * tw / 3, hs, tw / 2, gr); box(.18, th, .18, profil, tw / 2, hs, -tw / 2 + i * tw / 3, gr) }
    if (t.led) { const led = new THREE.Mesh(new THREE.PlaneGeometry(tw * .8, th * .35), markenSchild(b.top || 'work')); led.position.set(0, hs + th * .55, tw / 2 + .05); gr.add(led) }
    top = hs + th; box(tw + .3, .4, tw + .3, neon(t.crown || '#8fe3f0', 4), 0, top - .4, 0, gr);
    if (t.spire) box(.3, 9, .3, std('#cfd8de', { metalness: .8, roughness: .2 }), 0, top + .6, 0, gr) }
  solardach(gr, (t ? w - .6 : w) - .4, (t ? w - .6 : w) - .4, top);
  if (b.top && b.top !== 'work') { const s = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.9), markenSchild(b.top)); s.position.set(0, top + 2.4, w / 2 - .6); gr.add(s); box(9.2, .3, .3, ATTIKA, 0, top + .5, w / 2 - .6, gr) }
  return top }

// Glow Tower: drei Flügel um einen Kern springen spiralförmig zurück, oben die Nadel. Erkennbar, aber nicht übertrieben hoch.
function glowTower(gr) { const glas = new THREE.MeshPhysicalMaterial({ color: '#d4dfe9', metalness: .55, roughness: .08, envMapIntensity: 1.5, emissive: '#ffe1b8', emissiveIntensity: 0 }); glas.userData.basis = .08; FENSTER.push(glas);
  const kante = neon('#ff4fa3', 6), weiss = std('#eef1f4', { metalness: .3, roughness: .3 }), schwarz = std('#0c0c10', { metalness: .7, roughness: .22 }); const ebene = 2.1, stufen = 26, kernH = ebene * stufen;
  const kern = schatten(new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.8, kernH, 6), glas)); kern.position.y = kernH / 2; gr.add(kern);
  for (let k = 0; k < 3; k++) { const winkel = k * Math.PI * 2 / 3 + Math.PI / 4;
    for (let i = 0; i < stufen; i++) { const ende = 8 + k * 5, anteil = Math.max(0, 1 - Math.max(0, i - ende) / (stufen - ende - 2)); if (anteil <= 0) break;
      const L = 3.6 * Math.pow(anteil, .8) + .8, B = 3.6 - i * .05; const fl = new THREE.Group(); fl.rotation.y = winkel; gr.add(fl);
      const m = schatten(new THREE.Mesh(new THREE.BoxGeometry(L, ebene, B), glas)); m.position.set(L / 2 + 1.4, i * ebene + ebene / 2, 0); fl.add(m);
      const r = schatten(new THREE.Mesh(new THREE.CylinderGeometry(B / 2, B / 2, ebene, 14), glas)); r.position.set(L + 1.4, i * ebene + ebene / 2, 0); fl.add(r);
      const naechst = Math.max(0, 1 - Math.max(0, i + 1 - ende) / (stufen - ende - 2)); if (naechst < anteil) { const n = new THREE.Mesh(new THREE.BoxGeometry(L + B / 2, .22, B + .2), kante); n.position.set(L / 2 + 1.4 + B / 4, (i + 1) * ebene, 0); fl.add(n) }
      if (i % 4 === 0) { const s = new THREE.Mesh(new THREE.BoxGeometry(L + B / 2, .15, B + .12), weiss); s.position.set(L / 2 + 1.4 + B / 4, i * ebene, 0); fl.add(s) }
      else if (i % 2 === 0) { const s = new THREE.Mesh(new THREE.BoxGeometry(L + B / 2 + .02, .06, B + .14), schwarz); s.position.set(L / 2 + 1.4 + B / 4, i * ebene, 0); fl.add(s) }
      // schwarze Lisene an der Flügelspitze und an beiden Flanken
      const li = new THREE.Mesh(new THREE.BoxGeometry(.14, ebene, .5), schwarz); li.position.set(L + 1.4 + B / 2, i * ebene + ebene / 2, 0); fl.add(li);
      for (const sz of [-1, 1]) { const f2 = new THREE.Mesh(new THREE.BoxGeometry(.08, ebene, .08), schwarz); f2.position.set(1.6, i * ebene + ebene / 2, sz * (B / 2 + .02)); fl.add(f2) } } }
  const kragen = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.9, 1.2, 6), schwarz); kragen.position.y = kernH + .6; gr.add(kragen);
  const nadel = schatten(new THREE.Mesh(new THREE.CylinderGeometry(.1, 1.1, 16, 10), weiss)); nadel.position.y = kernH + 8; gr.add(nadel);
  for (let i = 0; i < 5; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1.15 - i * .17, .07, 6, 20), kante); r.rotation.x = Math.PI / 2; r.position.y = kernH + 1.2 + i * 1.9; gr.add(r) }
  const rot = new THREE.Mesh(new THREE.SphereGeometry(.35, 10, 8), neon('#ff2a2a', 8)); rot.position.y = kernH + 16.2; gr.add(rot); gr.userData.blinkt = rot;
  const see = new THREE.Mesh(new THREE.CircleGeometry(5.6, 40), new THREE.MeshPhysicalMaterial({ color: '#2aa7bf', roughness: .05, clearcoat: 1, envMapIntensity: 1.4 })); see.rotation.x = -Math.PI / 2; see.position.y = .06; gr.add(see);
  return kernH + 16 }

export function eigeneMaterialien(gr) { const kopie = new Map();
  gr.traverse(o => { if (!o.material || o.isSprite) return; let k = kopie.get(o.material); if (!k) { k = o.material.clone(); k.userData = Object.assign({}, o.material.userData, { opazitaet: o.material.opacity, transparent: o.material.transparent, depthWrite: o.material.depthWrite });
    if (NEON.includes(o.material)) NEON.push(k); if (FENSTER.includes(o.material)) FENSTER.push(k); kopie.set(o.material, k) } o.material = k }); gr.userData.materialien = [...kopie.values()] }
// Häuser zwischen Kamera und dir: durchsichtig und nicht anklickbar, damit du dahinter weiterlaufen kannst
export function durchsicht(haeuser, kamera, ziel) { const v = ziel.clone().project(kamera), abstand = kamera.position.distanceTo(ziel), ecke = new THREE.Vector3();
  for (const h of haeuser) { if (h.userData.haupt && (h.userData.box || (h.userData.box = new THREE.Box3().setFromObject(h))).distanceToPoint(kamera.position) > 30) { if (h.userData.durch) { h.userData.durch = false; for (const m of h.userData.materialien) { m.transparent = m.userData.transparent; m.opacity = m.userData.opazitaet; m.depthWrite = m.userData.depthWrite; m.needsUpdate = true } } continue } // Glow Tower: von weitem immer sichtbar, nur ganz nah durchsichtig
    if (!h.userData.box) h.userData.box = new THREE.Box3().setFromObject(h); const b = h.userData.box; let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
    for (let k = 0; k < 8; k++) { ecke.set(k & 1 ? b.max.x : b.min.x, k & 2 ? b.max.y : b.min.y, k & 4 ? b.max.z : b.min.z).project(kamera); x0 = Math.min(x0, ecke.x); x1 = Math.max(x1, ecke.x); y0 = Math.min(y0, ecke.y); y1 = Math.max(y1, ecke.y) }
    const mitte = b.getCenter(ecke); const naeher = kamera.position.distanceTo(mitte) < abstand - 2; const rand = .06;
    const soll = naeher && v.x > x0 - rand && v.x < x1 + rand && v.y > y0 - rand && v.y < y1 + rand;
    if (h.userData.durch === soll) continue; h.userData.durch = soll;
    for (const m of h.userData.materialien) { m.transparent = soll || m.userData.transparent; m.opacity = soll ? Math.min(.05, m.userData.opazitaet) : m.userData.opazitaet; m.depthWrite = soll ? false : m.userData.depthWrite; m.needsUpdate = true }
    h.traverse(o => { if (o.isMesh || o.isInstancedMesh) o.castShadow = !soll }) } }
export function baueHaeuser(szene) { const alle = [];
  for (const b of B) { const gr = new THREE.Group(); gr.position.set((b.x + 2) * M, 0, (b.y + 2) * M); szene.add(gr);
    const h = b.haupt ? glowTower(gr) : b.pod.style === 'beton' ? beton(b, gr) : b.pod.style === 'deko' ? deko(b, gr) : sockelUndTurm(b, gr);
    gr.traverse(o => { o.userData.haus = b }); gr.userData.haupt = !!b.haupt; eigeneMaterialien(gr); gr.userData.hoehe = h; b.drei = gr; alle.push(gr) }
  return alle }
