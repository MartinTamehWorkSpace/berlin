// Glow City 3D · feuerwerk.js · Feuerwerk über dem Glow Tower: zu jeder vollen Stunde (echte Zeit) 90 Sekunden lang.
// Edle Farben (Gold, Weiß, Champagner). Ein Punktsystem für alle Funken, additiv gemischt, damit der Bloom sie leuchten lässt.
import * as THREE from 'three';
const FARBEN = ['#ffd36b', '#ffffff', '#ffe2b8', '#ff8fc7', '#9fd8ff']; // Gold, Weiß, Champagner, ein Hauch Rosé und Eisblau: stilvoll statt bunt
export function feuerwerk(szene, mitte, klein) {
  const MAX = klein ? 1500 : 4000, pos = new Float32Array(MAX * 3), col = new Float32Array(MAX * 3), v = new Float32Array(MAX * 3), leben = new Float32Array(MAX), farbe = new Float32Array(MAX * 3);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const punkte = new THREE.Points(geo, new THREE.PointsMaterial({ size: klein ? 1.6 : 1.2, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
  punkte.frustumCulled = false; punkte.renderOrder = 40; szene.add(punkte);
  const raketen = []; let frei = 0, bisNaechste = 0, testBis = 0, war = false;
  function knall(x, y, z) { const f = new THREE.Color(FARBEN[Math.floor(Math.random() * FARBEN.length)]), f2 = new THREE.Color(FARBEN[Math.floor(Math.random() * FARBEN.length)]), n = klein ? 90 : 160, kraft = 14 + Math.random() * 10;
    for (let j = 0; j < n; j++) { const i = frei; frei = (frei + 1) % MAX; const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), s = kraft * (.85 + Math.random() * .15);
      pos.set([x, y, z], i * 3); v.set([Math.sin(ph) * Math.cos(th) * s, Math.cos(ph) * s, Math.sin(ph) * Math.sin(th) * s], i * 3); leben[i] = 1.6 + Math.random() * .8; const c = j % 3 ? f : f2; farbe.set([c.r, c.g, c.b], i * 3) } }
  function starten() { raketen.push({ x: mitte.x + (Math.random() - .5) * 90, y: 2, z: mitte.z + (Math.random() - .5) * 90, vy: 48 + Math.random() * 14, bis: 70 + Math.random() * 50 }) }
  const laeuft = () => { const d = new Date(); return d.getMinutes() === 0 && d.getSeconds() < 90 || Date.now() < testBis };
  return {
    zeigen(sek = 30) { testBis = Date.now() + sek * 1000 },
    laeuft,
    weiter(dt) { dt = Math.min(dt, .05); const an = laeuft(); if (an && !war && typeof toast === 'function') toast('🎆 Feuerwerk über dem Glow Tower'); war = an;
      if (an) { bisNaechste -= dt; if (bisNaechste <= 0) { starten(); bisNaechste = .35 + Math.random() * .6 } }
      for (let r = raketen.length - 1; r >= 0; r--) { const k = raketen[r]; k.y += k.vy * dt; const i = frei; frei = (frei + 1) % MAX; pos.set([k.x + (Math.random() - .5) * .3, k.y, k.z], i * 3); v.set([0, -2, 0], i * 3); leben[i] = .5; farbe.set([1, .85, .6], i * 3); if (k.y >= k.bis) { knall(k.x, k.y, k.z); raketen.splice(r, 1) } }
      let aktiv = false; for (let i = 0; i < MAX; i++) { if (leben[i] <= 0) { col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = 0; continue } aktiv = true; leben[i] -= dt;
        v[i * 3 + 1] -= 9 * dt; v[i * 3] *= .985; v[i * 3 + 1] *= .985; v[i * 3 + 2] *= .985; pos[i * 3] += v[i * 3] * dt; pos[i * 3 + 1] += v[i * 3 + 1] * dt; pos[i * 3 + 2] += v[i * 3 + 2] * dt;
        const h = Math.max(0, Math.min(1, leben[i] / 1.2)); col[i * 3] = farbe[i * 3] * h; col[i * 3 + 1] = farbe[i * 3 + 1] * h; col[i * 3 + 2] = farbe[i * 3 + 2] * h }
      punkte.visible = aktiv || raketen.length > 0; if (punkte.visible) { geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true } } } }
