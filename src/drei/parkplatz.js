// Berlin City 3D · parkplatz.js · Ein Parkplatz als Baustein: Belag, 2 Reihen Buchten mit weißen Linien, Lichtmasten, Schild, geparkte Autos.
// Benutzt von Arena und Flughafen. Ort, Drehung, Buchten und Schild kommen als Werte, nachts gehen die Masten an.
import * as THREE from 'three';
import { namensSchild, parkAuto } from './leben.js?v=1795050503';
const BELAG = new THREE.MeshStandardMaterial({ color: '#55585e', roughness: .85 }), LINIE = new THREE.MeshStandardMaterial({ color: '#f4f1ea', roughness: .6 }), MAST = new THREE.MeshStandardMaterial({ color: '#2a2f3a', metalness: .6, roughness: .4 });
export function parkplatz(eltern, x, z, { buchten = 10, drehung = 0, schild = '', belegt = .45 } = {}) { const B = 2.8, g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = drehung; eltern.add(g);
  const belag = new THREE.Mesh(new THREE.PlaneGeometry(buchten * B + 4, 20), BELAG); belag.rotation.x = -Math.PI / 2; belag.position.y = .04; belag.receiveShadow = true; g.add(belag);
  for (const zr of [-5.5, 5.5]) for (let i = 0; i <= buchten; i++) { const l = new THREE.Mesh(new THREE.PlaneGeometry(.14, 5), LINIE); l.rotation.x = -Math.PI / 2; l.position.set(-buchten * B / 2 + i * B, .06, zr); g.add(l) }
  const lampe = new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#ffe6c2', emissiveIntensity: .3 }), lichter = [];
  for (let mx = -buchten * B / 2 + 4; mx <= buchten * B / 2 - 3; mx += 10) { const m = new THREE.Mesh(new THREE.CylinderGeometry(.12, .16, 7, 8), MAST); m.position.set(mx, 3.5, 0); g.add(m); const k = new THREE.Mesh(new THREE.BoxGeometry(1.4, .25, .6), lampe); k.position.set(mx, 7, 0); g.add(k); }
  if (schild) { const s = namensSchild(schild, '#1d2b44', '#ffffff'); s.scale.set(7, 1.75, 1); s.position.set(-buchten * B / 2 - 2, 4.5, 0); g.add(s) }
  let geparkt = false; const parken = () => { if (geparkt || !parkAuto(1)) return; geparkt = true;
    for (const zr of [-5.5, 5.5]) for (let i = 0; i < buchten; i++) { if (((i * 7 + (zr > 0 ? 3 : 0)) % 10) / 10 >= belegt) continue; const a = parkAuto([1, 1, 2, 2, 3, 4][(i + (zr > 0 ? 2 : 0)) % 6]); if (!a) continue; a.position.set(-buchten * B / 2 + (i + .5) * B, 0, zr); a.rotation.y = zr > 0 ? -Math.PI / 2 : Math.PI / 2; a.traverse(o => { o.castShadow = false; o.matrixAutoUpdate = false; o.updateMatrix() }); a.updateMatrixWorld(true); g.add(a) } };
  return { weiter(nacht) { parken(); lampe.emissiveIntensity = .3 + nacht * 3; } } }
