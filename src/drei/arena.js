// Berlin 3D · arena.js · Spree Arena im Westen: offenes Stadion wie ein Fußballstadion, aber für Konzerte.
// Ränge in Stufen rundherum, offenes Dach mit weißem Ring, Bühne mit LED-Wand und Lichtrigg, Fans im Innenraum und auf den Rängen.
// Nachts Lichtkegel in den Himmel, zur halben Stunde Konzertfinale mit Feuerwerk über der Arena (feuerwerk.js).
import * as THREE from 'three';
import { M } from './haeuser.js?v=1795081513';
import { namensSchild } from './leben.js?v=1795081513';
import { parkplatz } from './parkplatz.js?v=1795081513';
import { feuerwerk } from './feuerwerk.js?v=1795081513';
import { fahrbahn } from './texturen.js?v=1795081513';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .55 }, o));
// Ellipsenring als flache Platte (für Ränge und Dachring)
function ring(rx, rz, breite, dicke, mat) { const s = new THREE.Shape(); s.absellipse(0, 0, rx + breite, rz + breite, 0, Math.PI * 2); const loch = new THREE.Path(); loch.absellipse(0, 0, rx, rz, 0, Math.PI * 2, true); s.holes.push(loch);
  const g = new THREE.ExtrudeGeometry(s, { depth: dicke, bevelEnabled: false, curveSegments: 64 }); g.rotateX(-Math.PI / 2); const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true; return m }
export function arena(szene) { const g = new THREE.Group(), cx = -36 * M, cz = 6 * M; g.position.set(cx, 0, cz); szene.add(g);
  const RX = 10 * M, RZ = 7 * M, STUFEN = 10, STUFE = 2.4, HOCH = 1.6;
  // Zufahrt von der Stadt und Vorplatz
  const weg = new THREE.Mesh(new THREE.PlaneGeometry(14 * M, 2 * M), std('#ffffff', { map: fahrbahn(14 * M), roughness: .85 })); weg.rotation.x = -Math.PI / 2; weg.position.set(-13 * M - cx, .03, 17 * M - cz); g.add(weg);
  const platz = new THREE.Mesh(new THREE.CircleGeometry(1, 64), std('#d9d4cc', { roughness: .9 })); platz.rotation.x = -Math.PI / 2; platz.scale.set(RX + STUFEN * STUFE + 14, RZ + STUFEN * STUFE + 14, 1); platz.position.y = .02; g.add(platz);
  // Innenraum: Rasen im Stadionmuster
  const rasenC = document.createElement('canvas'); rasenC.width = rasenC.height = 256; const rx = rasenC.getContext('2d'); for (let i = 0; i < 16; i++) { rx.fillStyle = i % 2 ? '#3f8a4a' : '#468f50'; rx.fillRect(i * 16, 0, 16, 256) }
  const rasen = new THREE.Mesh(new THREE.CircleGeometry(1, 64), new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(rasenC), roughness: .9 })); rasen.rotation.x = -Math.PI / 2; rasen.scale.set(RX, RZ, 1); rasen.position.y = .05; g.add(rasen);
  // Ränge: Stufe für Stufe nach außen und oben, abwechselnd dunkel und rosé
  for (let i = 0; i < STUFEN; i++) { const r = ring(RX + i * STUFE, RZ + i * STUFE, STUFE, (i + 1) * HOCH, std(i % 2 ? '#2a2f3a' : '#3a2f3d', { roughness: .7 })); g.add(r) }
  const aussen = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, STUFEN * HOCH + 3, 72, 1, true), std('#f2f1ee', { roughness: .35, side: THREE.DoubleSide })); aussen.scale.set(RX + STUFEN * STUFE, 1, RZ + STUFEN * STUFE); aussen.position.y = (STUFEN * HOCH + 3) / 2; g.add(aussen);
  // Offenes Dach: nur ein schwebender weißer Ring auf Stützen, die Mitte bleibt frei
  const dachH = STUFEN * HOCH + 9, dach = ring(RX + 4 * STUFE, RZ + 4 * STUFE, 7 * STUFE, .8, std('#ffffff', { roughness: .3 })); dach.position.y = dachH; g.add(dach);
  // Nachts angestrahlte Fassade: warme Lichtleisten neben jeder Stütze und ein Lichtband am Fuß des Stadions
  const ANGESTRAHLT = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffd9a8', emissiveIntensity: 0 });
  { const fuss = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, .5, 72, 1, true), ANGESTRAHLT); fuss.scale.set(RX + STUFEN * STUFE + .3, 1, RZ + STUFEN * STUFE + .3); fuss.position.y = .4; g.add(fuss) }
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, s = new THREE.Mesh(new THREE.CylinderGeometry(.35, .5, dachH, 8), std('#e8ecf0', { metalness: .6, roughness: .3 })); s.position.set(Math.cos(a) * (RX + STUFEN * STUFE + 1), dachH / 2, Math.sin(a) * (RZ + STUFEN * STUFE + 1)); g.add(s);
    const leiste = new THREE.Mesh(new THREE.BoxGeometry(.18, dachH * .85, .18), ANGESTRAHLT); leiste.position.set(Math.cos(a) * (RX + STUFEN * STUFE + 1.6), dachH * .45, Math.sin(a) * (RZ + STUFEN * STUFE + 1.6)); g.add(leiste) }
  // LED-Band unter dem Dachring mit Laufschrift
  const c = document.createElement('canvas'); c.width = 2048; c.height = 64; const x = c.getContext('2d'), led = new THREE.CanvasTexture(c); led.wrapS = THREE.RepeatWrapping; led.repeat.set(2, 1);
  function ledMalen(t) { const gr = x.createLinearGradient(0, 0, 2048, 0); [['#e6c76a', 0], ['#ff8fc7', .3], ['#ffffff', .5], ['#9fd8ff', .75], ['#e6c76a', 1]].forEach(([f, p]) => gr.addColorStop(p, f)); x.fillStyle = gr; x.fillRect(0, 0, 2048, 64); x.font = '800 42px Inter, sans-serif'; x.fillStyle = '#0d0e12'; const txt = 'LUBA ARENA  ·  LIVE TONIGHT  ·  GLOW NIGHT OPEN AIR  ·  '; const o = -(t * 60 % 1024); x.fillText(txt + txt, o, 46); led.needsUpdate = true }
  ledMalen(0); const ledMat = new THREE.MeshStandardMaterial({ map: led, emissive: '#ffffff', emissiveMap: led, emissiveIntensity: .7, side: THREE.DoubleSide });
  const band = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2.2, 72, 1, true), ledMat); band.scale.set(RX + STUFEN * STUFE + .2, 1, RZ + STUFEN * STUFE + .2); band.position.y = STUFEN * HOCH + 1.8; g.add(band);
  // Bühne am Westende: Podest, LED-Wand, Traversen, Boxentürme
  const bx = -RX + 6; const buehne = new THREE.Mesh(new THREE.BoxGeometry(10, 1.6, 18), std('#0d0e12', { roughness: .4 })); buehne.position.set(bx, .8, 0); g.add(buehne);
  const wandC = document.createElement('canvas'); wandC.width = 512; wandC.height = 256; const wx = wandC.getContext('2d'), wand = new THREE.CanvasTexture(wandC);
  function wandMalen(t) { const gr = wx.createRadialGradient(256, 128, 10, 256, 128, 300); gr.addColorStop(0, `hsl(${(t * 40) % 360},90%,70%)`); gr.addColorStop(1, '#120c1c'); wx.fillStyle = gr; wx.fillRect(0, 0, 512, 256); wx.fillStyle = '#ffffff'; wx.font = '400 76px Yellowtail, cursive'; wx.textAlign = 'center'; wx.fillText('Glow Night', 256, 150); wand.needsUpdate = true }
  wandMalen(0); const leinwand = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), new THREE.MeshStandardMaterial({ map: wand, emissive: '#ffffff', emissiveMap: wand, emissiveIntensity: .9 })); leinwand.position.set(bx - 4.5, 6.5, 0); leinwand.rotation.y = Math.PI / 2; g.add(leinwand);
  const trav = std('#c9ced6', { metalness: .8, roughness: .3 }); for (const z of [-9, 9]) { const t = new THREE.Mesh(new THREE.BoxGeometry(.5, 12, .5), trav); t.position.set(bx, 6, z); g.add(t); const box = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 2), std('#16171a')); box.position.set(bx + 3, 4.1, z * 1.15); g.add(box) }
  const oben = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, 18.5), trav); oben.position.set(bx, 12, 0); g.add(oben);
  // Fans: im Innenraum vor der Bühne und auf den Rängen, hüpfen im Takt
  const n = innerWidth < 760 ? 700 : 1600, fan = new THREE.InstancedMesh(new THREE.CapsuleGeometry(.28, .9, 3, 6), new THREE.MeshStandardMaterial({ roughness: .7 }), n), basis = [], o3 = new THREE.Object3D(), FARBEN = ['#ffffff', '#ff8fc7', '#16171a', '#e6c76a', '#9fd8ff', '#f4efe6'].map(f => new THREE.Color(f));
  for (let i = 0; i < n; i++) { let px, py, pz; if (i < n * .45) { const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()); px = bx + 8 + Math.random() * (RX * 1.3); pz = (Math.random() - .5) * RZ * 1.5; if ((px * px) / (RX * RX) + (pz * pz) / (RZ * RZ) > .85) { px = bx + 10; pz = (Math.random() - .5) * 10 } py = .7 }
    else { const st = Math.floor(Math.random() * STUFEN), a = Math.random() * Math.PI * 2; px = Math.cos(a) * (RX + st * STUFE + STUFE * .5); pz = Math.sin(a) * (RZ + st * STUFE + STUFE * .5); py = (st + 1) * HOCH + .7 }
    basis.push([px, py, pz, Math.random() * 6]); fan.setColorAt(i, FARBEN[i % FARBEN.length]) } g.add(fan);
  // Lichtrigg und Himmelsstrahler
  const kegel = ['#ffd36b', '#ff8fc7', '#ffffff', '#9fd8ff', '#ffd36b', '#ff8fc7'].map((f, i) => { const h = new THREE.Group(); h.position.set(bx, 12, -7.5 + i * 3); const k = new THREE.Mesh(new THREE.ConeGeometry(3, 30, 16, 1, true), new THREE.MeshBasicMaterial({ color: f, transparent: true, opacity: .06, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); k.position.x = 15; k.rotation.z = Math.PI / 2; h.add(k); g.add(h); return { h, k, ph: i } });
  const himmel = [0, 1, 2, 3].map(i => { const h = new THREE.Group(), a = i / 4 * Math.PI * 2; h.position.set(Math.cos(a) * (RX + 10), STUFEN * HOCH + 3, Math.sin(a) * (RZ + 10)); const k = new THREE.Mesh(new THREE.ConeGeometry(5, 120, 16, 1, true), new THREE.MeshBasicMaterial({ color: '#ffe2b8', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); k.position.y = 60; k.rotation.x = Math.PI; h.add(k); g.add(h); return { h, k, ph: i } });
  const sch = namensSchild('SPREE ARENA', '#0d0e12', '#ff8fc7'); sch.scale.set(22, 5.5, 1); sch.position.y = dachH + 10; g.add(sch);
  // Feuerwerk über der Arena: zur halben Stunde das Konzertfinale
  const FW = feuerwerk(szene, { x: cx, z: cz }, innerWidth < 760); let finale = -1, t = 0, bild = 0, letzteShow = 0;
  // Parkplätze rund um die Arena: an der Zufahrt, im Süden und im Westen
  const PARK = [parkplatz(g, 47, 49, { buchten: 10, schild: '🅿️ Parkplatz Spree Arena' }), parkplatz(g, -10, 66, { buchten: 14, schild: '🅿️ P2 Süd', belegt: .45 }), parkplatz(g, -74, 18, { buchten: 12, drehung: Math.PI / 2, schild: '🅿️ P3 West', belegt: .35 })];
  // Antippen des Stadions führt hinein (Tickets wie beim Gebäude Spree Arena)
  const haus = B.find(b => b.title === 'Spree Arena'); if (haus) g.traverse(o => { if (o.isMesh && !o.material.blending) o.userData.haus = haus });
  return { weiter(nacht, dt) { for (const p of PARK) p.weiter(nacht); ANGESTRAHLT.emissiveIntensity = nacht * 2.2; t += dt; if ((++bild) % 3 === 0) { ledMalen(t); wandMalen(t) } ledMat.emissiveIntensity = .6 + nacht * 1.4;
    for (let i = 0; i < n; i++) { const [px, py, pz, ph] = basis[i]; o3.position.set(px, py + Math.max(0, Math.sin(t * 7 + ph)) * .35, pz); o3.updateMatrix(); fan.setMatrixAt(i, o3.matrix) } fan.instanceMatrix.needsUpdate = true;
    for (const k of kegel) { k.h.rotation.y = Math.sin(t * .9 + k.ph) * .5; k.h.rotation.z = Math.sin(t * 1.3 + k.ph) * .25; k.k.material.opacity = .05 + nacht * .12 }
    for (const k of himmel) { k.h.rotation.z = Math.sin(t * .6 + k.ph) * .3; k.h.rotation.x = Math.cos(t * .5 + k.ph) * .25; k.k.material.opacity = nacht * .08 }
    const d = new Date(); if (d.getMinutes() === 30 && finale !== d.getHours()) { finale = d.getHours(); FW.zeigen(90); if (typeof toast === 'function') toast('🎆 Konzertfinale mit Feuerwerk in der Spree Arena') } if (window.ARENA_SHOW && window.ARENA_SHOW !== letzteShow) { letzteShow = window.ARENA_SHOW; FW.zeigen(70) } FW.weiter(dt) } } }
