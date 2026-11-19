// Berlin City 3D · spaceport.js · Spree Spaceport hinter dem Flughafen: Betonrampe, Stahl-Startturm mit Greifarmen, Edelstahlrakete (Booster und Raumschiff mit Klappen),
// Kugeltanks, Wasserturm, Schild. Nachts angestrahlt (nur leuchtende Flächen, keine echten Lichter). Zur Viertelstunde nach jeder vollen Stunde startet die Rakete
// mit Feuer und Rauch und steht danach wieder auf der Rampe. Antippen zeigt den Ausblick: Mond und Mars, für Milliardäre, noch gesperrt.
import * as THREE from 'three';
import { M } from './haeuser.js?v=1795050653';
import { namensSchild } from './leben.js?v=1795050653';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .5 }, o));
export function spaceport(szene) { const g = new THREE.Group(), x0 = 87 * M, z0 = 6 * M; g.position.set(x0, 0, z0); szene.add(g);
  const BETON = std('#bdb9b2', { roughness: .95 }), STAHL = std('#3a3f47', { metalness: .7, roughness: .4 }), EDEL = std('#d7dbe0', { metalness: 1, roughness: .18 }), SCHWARZ = std('#16171a', { roughness: .6 });
  const LICHT = new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#ffffff', emissiveIntensity: .2 });
  const box = (w, h, d, m, x, y, z, p = g) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y + h / 2, z); o.castShadow = o.receiveShadow = true; p.add(o); return o };
  const zyl = (r1, r2, h, m, x, y, z, p = g, seg = 32) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m); o.position.set(x, y + h / 2, z); o.castShadow = true; p.add(o); return o };
  // Gelände: Betonfläche, Zufahrt zum Flughafen, Flammengraben
  const platz = new THREE.Mesh(new THREE.CircleGeometry(40, 64), BETON); platz.rotation.x = -Math.PI / 2; platz.position.y = .06; platz.receiveShadow = true; g.add(platz);
  const weg = new THREE.Mesh(new THREE.PlaneGeometry(36, 6), std('#55585e', { roughness: .9 })); weg.rotation.x = -Math.PI / 2; weg.position.set(-44, .05, 6); g.add(weg);
  box(16, 4, 16, BETON, 0, 0, 0); box(8, .3, 8, SCHWARZ, 0, 4, 0);
  // Startturm aus Stahlfachwerk mit zwei Greifarmen
  const turm = new THREE.Group(); turm.position.set(-9, 4, 0); g.add(turm); for (const [sx, sz] of [[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]]) box(.5, 72, .5, STAHL, sx, 0, sz, turm);
  for (let y = 0; y < 72; y += 4) { box(3.7, .3, .3, STAHL, 0, y, -1.6, turm); box(3.7, .3, .3, STAHL, 0, y, 1.6, turm); box(.3, .3, 3.7, STAHL, -1.6, y, 0, turm); box(.3, .3, 3.7, STAHL, 1.6, y, 0, turm); if (y % 8 === 0) { const d = box(.25, 5.6, .25, STAHL, 0, y, -1.6, turm); d.rotation.z = .7 } }
  for (const y of [44, 58]) { box(7, .9, 1.2, STAHL, 4.2, y, -1.2, turm); box(7, .9, 1.2, STAHL, 4.2, y, 1.2, turm) } box(3.2, 1.5, 3.2, SCHWARZ, 0, 72, 0, turm); const blitz = box(.5, .5, .5, std('#ff2a2a', { emissive: '#ff2a2a', emissiveIntensity: 2 }), 0, 73.6, 0, turm);
  // Rakete: Booster mit Gitterflossen, Raumschiff mit Klappen und Nase, Edelstahl mit Hitzeschild-Seite
  const rakete = new THREE.Group(); rakete.position.set(0, 4.3, 0); g.add(rakete); const R = 2.6;
  zyl(R, R, 38, EDEL, 0, 0, 0, rakete, 40); for (let i = 0; i < 4; i++) { const f = box(1.8, 1.8, .2, STAHL, Math.cos(i * Math.PI / 2) * (R + .4), 35, Math.sin(i * Math.PI / 2) * (R + .4), rakete); f.rotation.y = -i * Math.PI / 2 }
  for (let i = 0; i < 6; i++) box(R * 2.02, .08, .08, std('#b9bec4', { metalness: 1, roughness: .3 }), 0, 4 + i * 6, 0, rakete).rotation.y = i * .5;
  zyl(R, R, 32, EDEL, 0, 38.2, 0, rakete, 40); const schild = new THREE.Mesh(new THREE.CylinderGeometry(R + .03, R + .03, 32, 40, 1, true, Math.PI * .6, Math.PI * .8), SCHWARZ); schild.position.y = 38.2 + 16; rakete.add(schild);
  const nase = new THREE.Mesh(new THREE.SphereGeometry(R, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), EDEL); nase.scale.y = 2.4; nase.position.y = 70.2; rakete.add(nase);
  for (const [y, w, h] of [[40, 3.4, 5], [64, 2, 3.4]]) for (const s of [-1, 1]) { const k = box(.3, h, w, EDEL, s * (R + .2), y, 0, rakete); k.rotation.z = s * -.08 }
  // Flamme und Rauch beim Start
  const flamme = new THREE.Mesh(new THREE.ConeGeometry(3, 18, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#ffb347', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); flamme.rotation.x = Math.PI; flamme.position.y = -9; rakete.add(flamme);
  const RAUCH = [], rauchMat = new THREE.MeshStandardMaterial({ color: '#e9e6e1', transparent: true, opacity: .7, roughness: 1, depthWrite: false });
  // Kugeltanks, Wasserturm, Hangar, Schild
  for (const [x, z, r] of [[22, -14, 5], [32, -14, 5], [27, -24, 6]]) { const k = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 18), std('#f2f2f0', { roughness: .4 })); k.position.set(x, r + 1.5, z); k.castShadow = true; g.add(k); zyl(.4, .4, 2, STAHL, x, 0, z) }
  zyl(4, 4, 6, std('#e8e8e6'), -26, 22, -20); zyl(.6, .6, 22, STAHL, -26, 0, -20); box(26, 16, 18, std('#e4e6ea', { metalness: .3, roughness: .35 }), 22, 0, 22); box(26.2, 2, 18.2, LICHT, 22, 16, 22);
  const sch = namensSchild('🚀 SPACEPORT BERLIN · Mond · Mars', '#0b1020', '#ffffff'); sch.scale.set(18, 4.5, 1); sch.position.set(22, 22, 22); g.add(sch);
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; box(.3, 10, .3, STAHL, Math.cos(a) * 28, 0, Math.sin(a) * 28); box(1.4, .6, .8, LICHT, Math.cos(a) * 28, 10, Math.sin(a) * 28) }
  g.traverse(o => { o.userData.spaceport = true });
  // Start zur Viertelstunde nach jeder vollen Stunde (echte Zeit, für alle gleich), 40 Sekunden
  let startT = -1, letzte = -1;
  return { weiter(nacht, dt) { LICHT.emissiveIntensity = .2 + nacht * 2.5; blitz.visible = Math.sin(performance.now() / 300) > 0; const d = new Date();
    if (d.getMinutes() === 15 && letzte !== d.getHours()) { letzte = d.getHours(); startT = 0; if (typeof toast === 'function') toast('🚀 Start am Spree Spaceport') }
    if (startT >= 0) { startT += dt; const t = startT; flamme.material.opacity = t < 2 ? t / 2 * .9 : t < 30 ? .9 : Math.max(0, .9 - (t - 30)); flamme.scale.set(1 + Math.sin(t * 40) * .06, 1 + Math.sin(t * 23) * .1, 1);
      rakete.position.y = 4.3 + (t > 4 ? Math.pow(t - 4, 2.2) * 1.4 : 0); if (t < 12 && Math.random() < dt * 25) { const r = new THREE.Mesh(new THREE.SphereGeometry(3, 10, 8), rauchMat.clone()); r.position.set((Math.random() - .5) * 10, 4, (Math.random() - .5) * 10); g.add(r); RAUCH.push({ r, l: 8 }) }
      if (t > 40) { startT = -1; rakete.position.y = 4.3; flamme.material.opacity = 0 } }
    for (let i = RAUCH.length - 1; i >= 0; i--) { const p = RAUCH[i]; p.l -= dt; p.r.scale.multiplyScalar(1 + dt * .5); p.r.position.y += dt * 2; p.r.material.opacity = Math.max(0, p.l / 8) * .7; if (p.l <= 0) { g.remove(p.r); RAUCH.splice(i, 1) } } } } }
