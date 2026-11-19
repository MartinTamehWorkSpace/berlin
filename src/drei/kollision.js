// Berlin City 3D · kollision.js · Gegenstand geht nie durch Gegenstand: Möbel werden zu Rechtecken am Boden, Figuren gleiten an ihnen entlang.
// Wände und Böden (sehr groß oder flach), Hängendes (über 1,6 m) und Figuren zählen nicht als Hindernis.
import * as THREE from 'three';
export function hindernisseSammeln(...gruppen) { const rects = [], b = new THREE.Box3();
  for (const g of gruppen) g.traverse(o => { if (!o.isMesh || o.userData.boden || o.userData.person) return; let p = o; while (p) { if (p.userData.person) return; p = p.parent }
    b.setFromObject(o); const sx = b.max.x - b.min.x, sz = b.max.z - b.min.z, sy = b.max.y - b.min.y; if (b.min.y > 1.6 || sy < .25 || sx > 8 || sz > 8 || sx * sz < .02) return; rects.push([b.min.x, b.min.z, b.max.x, b.max.z]) }); return rects }
const drin = (rects, x, z, r) => rects.some(([x0, z0, x1, z1]) => x > x0 - r && x < x1 + r && z > z0 - r && z < z1 + r);
// Schritt mit Ausweichen: erst direkt, sonst nur in x oder nur in z. Gibt zurück, ob die Figur weiterkam.
export function schritt(pos, dx, dz, rects, r = .35) { if (drin(rects, pos.x, pos.z, r) || !drin(rects, pos.x + dx, pos.z + dz, r)) /* steckt die Figur schon fest (Startpunkt), darf sie heraus */ { pos.x += dx; pos.z += dz; return true }
  if (!drin(rects, pos.x + dx, pos.z, r)) { pos.x += dx; return true } if (!drin(rects, pos.x, pos.z + dz, r)) { pos.z += dz; return true } return false }
