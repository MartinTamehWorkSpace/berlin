// Glow City 3D · wohnung.js · Wohnungen als 3D-Raum im Pinterest-Stil: Fischgrätparkett, Fensterfront mit Skyline, Bouclé-Sofa, TV-Wand, Kücheninsel, Pflanzen, warmes Licht.
// Deine eigene Wohnung ist privat: Gäste nur, wenn du einlädst. Bei den Nachbarn läuft das Event des Tages mit Gästen. Gekaufte Möbel (kat 'wohnen') stehen sichtbar im Raum.
// Antippen: Gast ansprechen, TV oder Laptop öffnet das Internet (Bestellen und Möbel kaufen).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { neueFigur, einkleiden, gehen, tanzen } from './leben.js?v=1795048512';
import { hindernisseSammeln, schritt } from './kollision.js?v=1795048512';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .6 }, o));
const leinwand = (w, h, mal) => { const c = document.createElement('canvas'); c.width = w; c.height = h; mal(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t };
const PARKETT = leinwand(512, 512, (g, w, h) => { for (let r = 0; r < 16; r++) for (let c = 0; c < 8; c++) { const x = c * 64, y = r * 32, l = 40 + Math.random() * 25; g.fillStyle = `hsl(32,${30 + Math.random() * 8}%,${52 + Math.random() * 10}%)`; g.save(); g.translate(x + 32, y + 16); g.rotate((r + c) % 2 ? .785 : -.785); g.fillRect(-36, -9, 72, 18); g.restore() } g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(0, 0, w, h) });
PARKETT.wrapS = PARKETT.wrapT = THREE.RepeatWrapping; PARKETT.repeat.set(11, 7);
const SKY = leinwand(1024, 256, (g, w, h) => { const s = g.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#1b1838'); s.addColorStop(.6, '#5a3b6e'); s.addColorStop(1, '#f2a3a0'); g.fillStyle = s; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 60; i++) { const bw = 12 + Math.random() * 34, bh = 40 + Math.random() * 160, x = Math.random() * w; g.fillStyle = 'rgba(20,18,40,.9)'; g.fillRect(x, h - bh, bw, bh); for (let k = 0; k < 18; k++) { g.fillStyle = Math.random() < .5 ? '#ffd9a0' : '#9fd8ff'; g.fillRect(x + 2 + Math.random() * (bw - 4), h - bh + 4 + Math.random() * (bh - 8), 2, 3) } } });
const TV = leinwand(512, 288, (g, w, h) => { const s = g.createLinearGradient(0, 0, w, h); s.addColorStop(0, '#ff4fa3'); s.addColorStop(1, '#2fe0d2'); g.fillStyle = s; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, h - 70, w, 70); g.fillStyle = '#fff'; g.font = '800 34px Inter, sans-serif'; g.fillText('GLOW HOME', 24, h - 26); g.font = '600 22px Inter, sans-serif'; g.fillText('Bestellen · Möbel · Lieferdienste', 230, h - 28) });
const rbox = (w, h, d, r, m) => { const o = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, r), m); o.castShadow = o.receiveShadow = true; return o };
function setze(o, x, y, z, p) { o.position.set(x, y, z); p.add(o); return o }
export function wohnung(renderer) {
  const szene = new THREE.Scene(); szene.background = new THREE.Color('#1c1622'); const pm = new THREE.PMREMGenerator(renderer); szene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  const kamera = new THREE.PerspectiveCamera(42, 1, .5, 200); szene.add(new THREE.HemisphereLight('#fff1e6', '#b9a3b0', .8));
  const sonne = new THREE.DirectionalLight('#ffe1c4', 1.4); sonne.position.set(-8, 14, 6); sonne.castShadow = true; sonne.shadow.mapSize.set(1024, 1024); Object.assign(sonne.shadow.camera, { left: -14, right: 14, top: 10, bottom: -10 }); szene.add(sonne);
  for (const [x, z] of [[-5, 0], [5, 1]]) { const l = new THREE.PointLight('#ffd6a8', 10, 14, 1.6); l.position.set(x, 4.2, z); szene.add(l) }
  let HINDERNIS = [];
  const raum = new THREE.Group(), leute = new THREE.Group(); szene.add(raum, leute); const klickbar = []; let stand = '', winkel = .35, abstand = 20, figuren = [];
  const CREME = std('#efe6da', { roughness: .95 }), BOUCLE = std('#f4efe6', { roughness: 1 }), TRAVERTIN = std('#d9c7ad', { roughness: .7 }), MESSING = std('#c9a45c', { metalness: 1, roughness: .25 }), SCHWARZ = std('#141416', { roughness: .4 }), GRUEN = std('#6f8f5a', { roughness: .8 }), MARMOR = std('#f4f2ef', { roughness: .15 });
  function pflanze(x, z, p, gross = 1) { setze(new THREE.Mesh(new THREE.CylinderGeometry(.45 * gross, .35 * gross, .8 * gross, 24), std('#d8cbb8', { roughness: .9 })), x, .4 * gross, z, p); setze(new THREE.Mesh(new THREE.CylinderGeometry(.05, .07, 1.6 * gross, 8), std('#6b5340')), x, 1.4 * gross, z, p);
    for (let i = 0; i < 10; i++) { const b = setze(new THREE.Mesh(new THREE.SphereGeometry(.38 * gross, 10, 8), GRUEN), x + Math.cos(i * 2.4) * .5 * gross, (1.8 + (i % 4) * .35) * gross, z + Math.sin(i * 2.4) * .45 * gross, p); b.scale.set(1, .7, 1) } }
  function bauen(b) { raum.clear(); klickbar.length = 0; const eigen = b.top === 'home' && (b.stock || 0) === etagen(b).length - 1, besitz = ST.besitz || {};
    const boden = new THREE.Mesh(new THREE.PlaneGeometry(24, 15), new THREE.MeshStandardMaterial({ map: PARKETT, roughness: .45 })); boden.rotation.x = -Math.PI / 2; boden.receiveShadow = true; raum.add(boden);
    const wand = std('#f3ece4', { roughness: .9 }); for (const [w, x, z, ry] of [[24, 0, -7.5, 0], [15, -12, 0, Math.PI / 2], [15, 12, 0, -Math.PI / 2]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 5.5), wand); m.position.set(x, 2.75, z); m.rotation.y = ry; m.receiveShadow = true; raum.add(m) }
    // Fensterfront mit Skyline und schwarzen Profilen
    setze(new THREE.Mesh(new THREE.PlaneGeometry(14, 4.2), new THREE.MeshBasicMaterial({ map: SKY })), 2, 2.6, -7.46, raum); for (let i = 0; i <= 7; i++) setze(new THREE.Mesh(new THREE.BoxGeometry(.08, 4.3, .1), SCHWARZ), -5 + i * 2, 2.6, -7.4, raum);
    // Wohnbereich: Bouclé-Wolkensofa, runder Travertin-Tisch, Teppich, TV-Wand links
    const teppich = setze(new THREE.Mesh(new THREE.CircleGeometry(3.4, 48), std(besitz['w-teppich'] ? '#d8c6e6' : '#e9dfd2', { roughness: 1 })), -5, .02, 1.5, raum); teppich.rotation.x = -Math.PI / 2;
    const sofa = new THREE.Group(); setze(sofa, -5, 0, 3.6, raum); setze(rbox(5.2, .7, 1.6, .3, BOUCLE), 0, .45, 0, sofa); setze(rbox(5.2, .9, .5, .25, BOUCLE), 0, 1.1, .6, sofa); for (const sx of [-2.4, 2.4]) setze(rbox(.6, .8, 1.6, .28, BOUCLE), sx, .7, 0, sofa); for (let i = 0; i < 3; i++) setze(rbox(.9, .55, .3, .14, std(['#c9a07a', '#e8a6bf', '#9db5a0'][i], { roughness: 1 })), -1.6 + i * 1.6, .95, .3, sofa);
    setze(new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, .45, 40), TRAVERTIN), -5, .55, 1.3, raum).castShadow = true; setze(new THREE.Mesh(new THREE.CylinderGeometry(.6, .6, .5, 30), TRAVERTIN), -5, .25, 1.3, raum);
    const tvwand = setze(rbox(.3, 3, 5.6, .05, std('#2a2420', { roughness: .5 })), -11.8, 2.1, 1.3, raum), tv = setze(new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.5), new THREE.MeshBasicMaterial({ map: TV })), -11.62, 2.3, 1.3, raum); tv.rotation.y = Math.PI / 2; tv.userData.internet = true; klickbar.push(tv, tvwand); tvwand.userData.internet = true;
    setze(rbox(.6, .5, 4, .1, std('#3a302a')), -11.5, .25, 1.3, raum);
    // Küche mit Marmorinsel, Barhockern, Glas-Pendelleuchten
    setze(rbox(4.6, 1, 1.4, .08, MARMOR), 6, .5, -4.2, raum); for (let i = 0; i < 3; i++) { setze(new THREE.Mesh(new THREE.CylinderGeometry(.28, .22, .1, 20), BOUCLE), 4.6 + i * 1.4, .85, -3.1, raum); setze(new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .8, 8), MESSING), 4.6 + i * 1.4, .4, -3.1, raum);
      setze(new THREE.Mesh(new THREE.SphereGeometry(.3, 20, 14), new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#ffd9a8', emissiveIntensity: 1.6, transparent: true, opacity: .9 })), 4.6 + i * 1.4, 3.6, -4.2, raum) }
    setze(rbox(6, 2.4, .7, .05, std('#e9e1d6')), 6, 1.2, -7.1, raum);
    // Laptop auf der Insel: ebenfalls Internet
    const lap = setze(new THREE.Mesh(new THREE.BoxGeometry(.7, .04, .5), std('#c8ccd2', { metalness: .8, roughness: .2 })), 7.4, 1.03, -4.2, raum), bild = setze(new THREE.Mesh(new THREE.PlaneGeometry(.66, .42), new THREE.MeshBasicMaterial({ map: TV })), 7.4, 1.25, -4.43, raum); bild.rotation.x = -.25; for (const o of [lap, bild]) { o.userData.internet = true; klickbar.push(o) }
    // Schlafbereich rechts, Pflanzen, Bogenleuchte, Kunst
    setze(rbox(3.4, .6, 4, .2, std('#efe8de', { roughness: 1 })), 9.6, .3, 3.6, raum); setze(rbox(3.6, 1.8, .4, .2, BOUCLE), 9.6, .9, 5.7, raum); setze(rbox(3.2, .2, 2.6, .1, std('#d9cfc2', { roughness: 1 })), 9.6, .7, 3, raum);
    pflanze(-10.6, -6.3, raum, 1.2); pflanze(11, -6.3, raum); pflanze(-1, 5.8, raum, .8);
    const bogen = setze(new THREE.Mesh(new THREE.TorusGeometry(2.2, .05, 8, 40, Math.PI * .9), MESSING), -7.8, 2.4, 3.8, raum); bogen.rotation.z = Math.PI * .15; setze(new THREE.Mesh(new THREE.SphereGeometry(.35, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), MESSING), -5.9, 3.9, 3.8, raum).rotation.x = Math.PI;
    // Gekaufte Möbel: sichtbar im Raum
    if (besitz['w-sofa']) { const s2 = new THREE.Group(); setze(s2, 1.5, 0, 2.6, raum); s2.rotation.y = -Math.PI / 2; setze(rbox(3.4, .7, 1.4, .3, std('#e8a6bf', { roughness: .9 })), 0, .45, 0, s2); setze(rbox(3.4, .9, .45, .22, std('#e8a6bf', { roughness: .9 })), 0, 1.1, .55, s2) }
    if (besitz['w-tisch']) { setze(rbox(3, .12, 1.4, .06, MARMOR), 1, 1.05, -2.2, raum); setze(new THREE.Mesh(new THREE.CylinderGeometry(.3, .4, 1, 16), MARMOR), 1, .5, -2.2, raum) }
    if (besitz['w-kunst']) { const k = setze(new THREE.Mesh(new THREE.PlaneGeometry(3, 2), std('#ff7eb6', { emissive: '#ff7eb6', emissiveIntensity: .25 })), 11.95, 2.8, -2, raum); k.rotation.y = -Math.PI / 2 }
    if (besitz['w-leuchter']) for (let i = 0; i < 18; i++) setze(new THREE.Mesh(new THREE.OctahedronGeometry(.12), new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#fff2c4', emissiveIntensity: 1.2 })), -5 + Math.cos(i) * .8, 4.2 - (i % 3) * .25, 1.3 + Math.sin(i) * .8, raum);
    if (besitz['w-bett']) for (const [x, z] of [[8, 1.8], [11.2, 1.8], [8, 5.6], [11.2, 5.6]]) setze(new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 4, 8), MESSING), x, 2, z, raum);
    if (besitz['w-bar']) { setze(rbox(3, 1.1, .7, .06, SCHWARZ), 0, .55, -6.6, raum); setze(rbox(3, .06, .75, .02, MESSING), 0, 1.13, -6.6, raum) }
    if (besitz['w-fluegel']) setze(rbox(2, 1, 2.4, .3, std('#ffffff', { roughness: .1 })), 3.6, .8, 4.6, raum);
    if (besitz['w-aquarium']) { const a = setze(new THREE.Mesh(new THREE.BoxGeometry(.4, 2.2, 4), new THREE.MeshPhysicalMaterial({ color: '#2fb5d6', transparent: true, opacity: .6, emissive: '#1a7fa0', emissiveIntensity: .6 })), 11.7, 1.6, -4.6, raum) }
    if (besitz['w-sessel']) for (const x of [-8.6, -1.4]) setze(rbox(1.4, .9, 1.4, .45, BOUCLE), x, .5, .6, raum);
    if (besitz['w-olive']) pflanze(-2.4, -6.2, raum, 1.6);
    if (besitz['w-neon']) { const n = setze(new THREE.Mesh(new THREE.TorusGeometry(.9, .06, 8, 40), new THREE.MeshStandardMaterial({ color: '#ff4fa3', emissive: '#ff4fa3', emissiveIntensity: 2.5 })), -8, 3.6, -7.4, raum) }
    if (besitz['w-tv85']) { const t2 = setze(new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2), new THREE.MeshBasicMaterial({ map: TV })), 9.6, 2.6, -7.4, raum); t2.userData.internet = true; klickbar.push(t2) }
    if (besitz['w-kamin']) { setze(rbox(3.2, 1.4, .8, .05, TRAVERTIN), -8, .7, -6.9, raum); setze(new THREE.Mesh(new THREE.BoxGeometry(2.2, .4, .1), new THREE.MeshStandardMaterial({ color: '#ff9a3c', emissive: '#ff7a1c', emissiveIntensity: 2 })), -8, .7, -6.48, raum) }
    if (besitz['w-ankleide']) for (let i = 0; i < 4; i++) { setze(rbox(1, 3, .6, .04, std('#e9e1d6')), 7.5 + i * 1.05, 1.5, 6.9, raum); setze(new THREE.Mesh(new THREE.BoxGeometry(.9, .05, .5), new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#ffe6c2', emissiveIntensity: 1.5 })), 7.5 + i * 1.05, 2.4, 6.7, raum) }
    // Einrichtung des Events: DJ-Pult mit Lichtfeld, Bar, lange Tafel, Schminktische, Kochstation
    const ev = typeof partyFuer === 'function' ? partyFuer(b, b.stock || 0) : null, zeigeEvent = ev && (!eigen || (ST.einladung && ST.einladung.tag === new Date().toDateString()));
    if (zeigeEvent && ev.art === 'dj') { setze(rbox(2.4, 1.1, .9, .08, SCHWARZ), -3, .55, -5.6, raum); for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const f = setze(new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshBasicMaterial({ color: `hsl(${(i * 60 + j * 90) % 360},80%,60%)`, transparent: true, opacity: .55 })), -6.5 + i * 1.2, .03, -3.4 + j * 1.2, raum); f.rotation.x = -Math.PI / 2; f.userData.disco = i + j } }
    if (zeigeEvent && ev.art === 'bar') { setze(rbox(3.6, 1.1, .8, .06, SCHWARZ), -3, .55, -5.6, raum); setze(rbox(3.6, .06, .85, .02, MESSING), -3, 1.13, -5.6, raum); for (let i = 0; i < 6; i++) setze(new THREE.Mesh(new THREE.CylinderGeometry(.06, .05, .3, 10), std(['#ff8fc7', '#ffd166', '#9fe8ff'][i % 3], { emissive: ['#ff8fc7', '#ffd166', '#9fe8ff'][i % 3], emissiveIntensity: .6 })), -4.4 + i * .55, 1.3, -5.6, raum) }
    if (zeigeEvent && ev.art === 'dinner') { setze(rbox(5, .12, 1.4, .05, std('#7a5236', { roughness: .5 })), -3, 1.05, -2.6, raum); for (let i = 0; i < 6; i++) for (const z of [-3.6, -1.6]) setze(rbox(.6, .9, .6, .12, BOUCLE), -5.2 + i * .9, .45, z, raum) }
    if (zeigeEvent && ev.art === 'beauty') for (let i = 0; i < 3; i++) { setze(rbox(1.2, .9, .6, .06, std('#ffd6e6')), -6 + i * 2, .45, -6.6, raum); setze(new THREE.Mesh(new THREE.CircleGeometry(.5, 24), new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#ffe6f0', emissiveIntensity: 1 })), -6 + i * 2, 1.9, -7.4, raum) }
    // Menschen: bei Nachbarn das Event des Tages, bei dir nur nach Einladung
    leute.clear(); figuren = []; const gaeste = (b.innen || []).filter(q => q.partyGast || q.name), zeigen = eigen ? (ST.einladung && ST.einladung.tag === new Date().toDateString() ? gaeste : []) : gaeste;
    zeigen.slice(0, 10).forEach((q, i) => { const f = neueFigur(); einkleiden(f, q); f.visible = true; f.scale.setScalar(1.15); f.position.set(-7 + (i % 5) * 2.4 + Math.sin(i) * .4, 0, -1.6 + Math.floor(i / 5) * 2.2); f.rotation.y = i * 1.3; f.userData.q = q; f.traverse(o => { o.userData.q = q; if (o.isMesh) o.castShadow = true }); leute.add(f); klickbar.push(f); figuren.push(f) }) }
  // Du in der Wohnung und das Symbol über einer Aktion (💃 💋 🥂 …)
  const ich = neueFigur(); ich.visible = true; ich.scale.setScalar(1.2); ich.traverse(o => { if (o.isMesh) o.castShadow = true }); ich.position.set(-3, 0, 4.5); szene.add(ich); let ichLook = '';
  const symC = document.createElement('canvas'); symC.width = symC.height = 128; const symT = new THREE.CanvasTexture(symC), sym = new THREE.Sprite(new THREE.SpriteMaterial({ map: symT, transparent: true, depthTest: false })); sym.scale.set(1.3, 1.3, 1); sym.renderOrder = 40; szene.add(sym); let symText = '';
  const SYMBOL = { reden: '💬', anstossen: '🥂', tanzen: '💃', selfie: '🤳', flirten: '😏', deal: '🤝', kuessen: '💋', abblitzen: '🙅‍♀️' };
  const ray = new THREE.Raycaster(), maus = new THREE.Vector2();
  return {
    tippen(cx, cy) { maus.set(cx / innerWidth * 2 - 1, -cy / innerHeight * 2 + 1); ray.setFromCamera(maus, kamera); const t = ray.intersectObjects(klickbar, true)[0]; if (!t) return;
      if (t.object.userData.internet && typeof internetZeigen === 'function') return internetZeigen(INNEN); if (t.object.userData.q && typeof ansprechen === 'function') ansprechen(t.object.userData.q) },
    drehen(dx) { winkel = THREE.MathUtils.clamp(winkel - dx * .006, -1, 1) }, zoom(f) { abstand = THREE.MathUtils.clamp(abstand * f, 8, 26) },
    neu() { stand = '' },
    zeichne(dt, breite, hoehe, b) { const s = [b.title, b.stock, Object.keys(ST.besitz || {}).join(), (b.innen || []).length, ST.einladung && ST.einladung.tag].join('|'); if (s !== stand) { stand = s; bauen(b); HINDERNIS = hindernisseSammeln(raum) }
      const t = performance.now() / 1000, dj = typeof partyFuer === 'function' && partyFuer(b, b.stock || 0).art === 'dj', A = window.AKTION3D && Date.now() < window.AKTION3D.bis ? window.AKTION3D : null, ziel = A && figuren.find(f => f.userData.q === A.q);
      const lk = [ICH.skin, ICH.hair, ICH.top, ICH.leg, ICH.frisur].join(); if (lk !== ichLook) { ichLook = lk; einkleiden(ich, ICH) }
      figuren.forEach((f, i) => { if (f === ziel) return; if (dj) f.position.y = tanzen(f, t, i); else gehen(f, t, false) });
      if (ziel) { const hin = ziel.position.clone().add(new THREE.Vector3(1.1, 0, .5)), d = hin.clone().sub(ich.position); d.y = 0; const weg = d.length(); if (weg > .1) { d.normalize(); const st = Math.min(weg, dt * 5); if (!schritt(ich.position, d.x * st, d.z * st, HINDERNIS)) ich.position.addScaledVector(d, 0); ich.rotation.y = Math.atan2(d.x, d.z); gehen(ich, t, true) } else { ich.lookAt(ziel.position.x, 0, ziel.position.z); ziel.lookAt(ich.position.x, 0, ich.position.z);
          if (A.art === 'tanzen') { ich.position.y = tanzen(ich, t, 0); ziel.position.y = tanzen(ziel, t, 1.5) } else if (A.art === 'kuessen') { ich.rotation.x = .12; ziel.rotation.x = .12 } else if (A.art === 'abblitzen') ziel.rotation.y += Math.PI; else { gehen(ich, t, false); gehen(ziel, t, false) } }
        if (symText !== A.art) { symText = A.art; const g2 = symC.getContext('2d'); g2.clearRect(0, 0, 128, 128); g2.font = '96px sans-serif'; g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.fillText(SYMBOL[A.art] || '✨', 64, 70); symT.needsUpdate = true }
        sym.visible = true; sym.position.set((ich.position.x + ziel.position.x) / 2, 3.2 + Math.sin(t * 4) * .15, (ich.position.z + ziel.position.z) / 2) }
      else { sym.visible = false; ich.rotation.x = 0; figuren.forEach(f => f.rotation.x = 0); gehen(ich, t, false) } raum.children.forEach(o => { if (o.userData.disco != null) o.material.opacity = .3 + .3 * Math.max(0, Math.sin(t * 6 + o.userData.disco)) });
      kamera.position.set(Math.sin(winkel) * abstand, abstand * .7, 7 + Math.cos(winkel) * abstand * .6); kamera.lookAt(0, 1, 0); kamera.aspect = breite / hoehe; const fen = document.getElementById('card'), fb = fen && !fen.hidden && breite > 760 ? fen.offsetWidth : 0; if (fb) kamera.setViewOffset(breite, hoehe, fb / 2, 0, breite, hoehe); else kamera.clearViewOffset(); kamera.updateProjectionMatrix();
      return { szene, kamera } } } }
