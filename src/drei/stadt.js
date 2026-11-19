// Berlin 3D · welt.js · Die Stadt in 3D: Renderer, Himmel nach der Spieluhr, Boden und Straßen, Kamera folgt dir, Antippen.
// Die Spiellogik bleibt im Spiel (frame() in ablauf.js). Hier wird nur gezeichnet und angetippt. Innenräume zeichnet weiter das 2D-Spiel.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { Water } from 'three/addons/objects/Water.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { graffiti } from './graffiti.js?v=1795067735';
import { M, NEON, FENSTER, GLAS, baueHaeuser, box, std, durchsicht } from './haeuser.js?v=1795067735';
import { menschen, verkehr, stadtmoebel, autosLaden } from './leben.js?v=1795067735';
import { fahrbahn, pflaster, sand, blase, rasen } from './texturen.js?v=1795067735';
import { praxis } from './praxis.js?v=1795067735';
import { wohnung } from './wohnung.js?v=1795067735';
import { boote, helis } from './wasser.js?v=1795067735';
import { feuerwerk } from './feuerwerk.js?v=1795067735';
import { strand } from './strand.js?v=1795067735';
import { flughafen } from './flughafen.js?v=1795067735';
import { arena } from './arena.js?v=1795067735';
import { spaceport } from './spaceport.js?v=1795067735';
let PRAXIS = null, WOHNUNG = null, inWohnungJetzt = false;

const handy = innerWidth < 760;
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, handy ? 1.2 : 1.4)); renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .42;
const leinwand = renderer.domElement; leinwand.id = 'c3'; leinwand.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;touch-action:none;cursor:grab';
cv.parentNode.insertBefore(leinwand, cv); cv.style.position = 'fixed'; cv.style.inset = '0';
const szene = new THREE.Scene(); szene.fog = new THREE.Fog('#a7abb0', 110, 380); /* Berlin: grauer Dunst */
const kamera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 2, 3000); // Nahgrenze 2 statt 0,3: 7-mal genauere Tiefe, Böden flackern nicht mehr übereinander
const steuer = new OrbitControls(kamera, leinwand); steuer.enableDamping = true; steuer.maxPolarAngle = Math.PI * .47; steuer.minPolarAngle = Math.PI * .06; steuer.minDistance = 7; steuer.maxDistance = 170; steuer.enablePan = true; steuer.screenSpacePanning = false; steuer.panSpeed = 1.4;
// Bedienung (Martin, 17.11.2026): Ziehen dreht die Kamera um dich oder dein Boot, rechte Maustaste oder zwei Finger verschieben die Stadt, Scrollen zoomt
steuer.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }; steuer.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE }; steuer.screenSpacePanning = false; /* Martin 19.11.2026: Ziehen schiebt über die Stadt, rechte Taste dreht */
let frei = false; steuer.addEventListener('start', () => { if (typeof MEINBOOT !== 'undefined' && MEINBOOT.an) return; /* an Bord bleibt die Kamera am Boot und dreht nur */ frei = true; fokusPunkt = null });

// Himmel und Licht
const himmel = new Sky(); himmel.scale.setScalar(5000); szene.add(himmel); const hu = himmel.material.uniforms; hu.turbidity.value = 9; hu.rayleigh.value = .55; /* Berlin: bedeckter, grauer Himmel */ hu.mieCoefficient.value = .004; hu.mieDirectionalG.value = .86;
const sonne = new THREE.DirectionalLight('#ffe6c8', 3.6); sonne.castShadow = true; sonne.shadow.mapSize.set(handy ? 1024 : 1536, handy ? 1024 : 1536);
Object.assign(sonne.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, near: 5, far: 500 }); sonne.shadow.bias = -.0004; sonne.shadow.normalBias = .04; szene.add(sonne, sonne.target);
const halb = new THREE.HemisphereLight('#b9d4ff', '#f0c9b8', .55); szene.add(halb);
const pmrem = new THREE.PMREMGenerator(renderer); let umwelt = null, letzteStunde = -9;
const sterne = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: 1800 }, () => (Math.random() - .5) * 3000).map((v, i) => i % 3 === 1 ? Math.abs(v) * .5 + 300 : v), 3)), new THREE.PointsMaterial({ color: '#fff', size: 2.5, sizeAttenuation: false, transparent: true, opacity: 0, fog: false }));
szene.add(sterne);
const himmelKopie = new Sky(); himmelKopie.scale.setScalar(1000); const hs = new THREE.Scene(); hs.add(himmelKopie);
const LAMPENLICHT = []; for (let i = 0; i < (handy ? 4 : 8); i++) { const l = new THREE.PointLight('#ffd9a0', 0, 18, 1.6); szene.add(l); LAMPENLICHT.push(l) }

// ---------- Boden: Wiese, Gehwege, Straßen, Grundstücke, Park, Platz, Ufer, Wasser, Parkbuchten ----------
const flach = (w, d, matl, x, z, y = .02) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), matl); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; szene.add(m); return m };
const RASEN = rasen(); RASEN.repeat.set(((X1 - X0) * M + 400) / 26, ((YW - Y0) * M + 300) / 26); flach((X1 - X0) * M + 400, (YW - Y0) * M + 300, std('#ffffff', { map: RASEN, roughness: 1 }), (X0 + X1) / 2 * M, (Y0 + YW) / 2 * M - 150, -.05);
const gw = pflaster('#ddd2d0', '#d6cac8', 12); gw.repeat.set(22, 22); flach(44 * M, 43 * M, std('#fff', { map: gw, roughness: .9 }), 21 * M, 20.5 * M, 0);
for (let k = 0; k < 6; k++) { const t1 = fahrbahn(43 * M); flach(43 * M, 2 * M, std('#fff', { map: t1, roughness: .85 }), (8 * k + 1) * M, 20.5 * M, .04).rotation.z = Math.PI / 2;
  const t2 = fahrbahn(44 * M); flach(44 * M, 2 * M, std('#fff', { map: t2, roughness: .85 }), 21 * M, (8 * k + 1) * M, .08) }
for (let kx = 0; kx < 6; kx++) for (let ky = 0; ky < 6; ky++) flach(2 * M, 2 * M, std('#2b2d33', { roughness: .9 }), (8 * kx + 1) * M, (8 * ky + 1) * M, .12);
const zebra = std('#f4f1ea', { roughness: .6 }); for (let kx = 0; kx < 6; kx++) for (let ky = 0; ky < 6; ky++) for (let i = 0; i < 5; i++) for (const [dx, dz, quer] of [[0, -.5, 0], [0, 2.5, 0], [-.5, 0, 1], [2.5, 0, 1]]) {
  const x = (8 * kx + (quer ? dx : .2 + i * .4)) * M, z = (8 * ky + (quer ? .2 + i * .4 : dz)) * M; flach(quer ? 1.4 : .5, quer ? .5 : 1.4, zebra, x + (quer ? 0 : .3), z + (quer ? .3 : 0), .15) }
for (const l of lots) { const k = new THREE.Mesh(new THREE.BoxGeometry(4.16 * M, .18, 4.16 * M), std('#e4dccf', { roughness: .8 })); k.position.set((l.x + 2) * M, .09, (l.y + 2) * M); k.receiveShadow = true; szene.add(k) }
const parkRasen = rasen(); parkRasen.repeat.set(1, 1); flach(4 * M, 4 * M, std('#e8ffe0', { map: parkRasen, roughness: 1 }), (PARK.x + 2) * M, (PARK.y + 2) * M, .2);
const pl = pflaster('#f6e3ea', '#efd3de', 8); pl.repeat.set(2, 2); flach(4 * M, 4 * M, std('#fff', { map: pl }), (PLAZA.x + 2) * M, (PLAZA.y + 2) * M, .2);
flach((X1 - X0) * M + 400, 1 * M, std('#d9cbb6', { roughness: .9 }), (X0 + X1) / 2 * M, 42.5 * M, .02);
const sa = sand(); sa.repeat.set(6, 2); flach((X1 - 33.5) * M, 3.2 * M, std('#fff', { map: sa, roughness: 1 }), (33.5 + X1) / 2 * M, 43.6 * M, .07); // Sand klar über Promenade (.02) und Wasser, sonst flackern die Flächen
// Wasser: glatte Fläche mit zwei gegeneinander laufenden Wellenkarten (Normalmap aus Sinuswellen, nahtlos kachelbar).
// Spiegelt Himmel und Lichter scharf, kostet fast nichts, weil keine Ecke pro Bild neu gerechnet wird.
function wellenKarte(n, seed) { const c = document.createElement('canvas'); c.width = c.height = n; const x = c.getContext('2d'), bild = x.createImageData(n, n), d = bild.data;
  const wellen = []; let z = seed; const r = () => (z = (z * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 14; i++) wellen.push({ fx: Math.round((r() - .5) * 16), fy: Math.round((r() - .5) * 16) || 1, a: .3 + r(), ph: r() * 6.3 });
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let dx = 0, dy = 0; for (const w of wellen) { const k = (w.fx * i + w.fy * j) / n * Math.PI * 2 + w.ph, c_ = Math.cos(k) * w.a / Math.hypot(w.fx, w.fy); dx += c_ * w.fx; dy += c_ * w.fy }
    const nx = -dx * .045, ny = -dy * .045, nz = 1, l = Math.hypot(nx, ny, nz), o = (j * n + i) * 4; d[o] = (nx / l * .5 + .5) * 255; d[o + 1] = (ny / l * .5 + .5) * 255; d[o + 2] = (nz / l * .5 + .5) * 255; d[o + 3] = 255 }
  x.putImageData(bild, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t }
const WELLEN = wellenKarte(256, 7);
// Echte Spiegelung: Himmel, Häuser und die Lichter der Promenade spiegeln sich im Wasser (eigene Spiegelkamera, am Mobilgerät in halber Auflösung)
const wasser = new Water(new THREE.PlaneGeometry(1600, 600), { textureWidth: handy ? 192 : 320, textureHeight: handy ? 192 : 320, waterNormals: WELLEN, sunDirection: new THREE.Vector3(.3, 1, .2).normalize(), sunColor: '#fff2dc', waterColor: '#2e4a4c', distortionScale: 2.6, fog: !!szene.fog });
wasser.material.uniforms.size.value = 3.5; { const spiegeln = wasser.onBeforeRender; let n = 0; wasser.onBeforeRender = function (...a) { if (n++ % 3 === 0) spiegeln.apply(this, a) } } /* Spiegelbild nur jedes 3. Bild neu: kaum sichtbar, spart viel */ wasser.rotation.x = -Math.PI / 2; wasser.position.set(21 * M, -.6, 43 * M + 300); szene.add(wasser);
// Günstiges Wasser ohne Spiegelkamera (Wellenkarte, Glanz): Standard auf dem Mobilgerät und sobald das Spiel ruckelt
const WELLEN2 = WELLEN.clone(); WELLEN2.repeat.set(80, 30);
const wasserBillig = new THREE.Mesh(new THREE.PlaneGeometry(1600, 600), new THREE.MeshStandardMaterial({ color: '#2b4547', roughness: .12, metalness: .35, normalMap: WELLEN2, normalScale: new THREE.Vector2(.6, .6), envMapIntensity: 1.5 }));
wasserBillig.rotation.x = -Math.PI / 2; wasserBillig.position.set(21 * M, -.6, 43 * M + 300); /* fest im Meer: vorher lag die Fläche auf Bodenhöhe unter der ganzen Stadt und flackerte überall blau */ szene.add(wasserBillig);
// Automatische Qualität: misst laufend die Bilder pro Sekunde. Unter 40 wird Stufe für Stufe abgeschaltet: Spiegelung, Auflösung, Schatten und Leuchten.
const QUAL = { stufe: 0, zeit: 0, bilder: 0, bps: 60 };
function qualitaet(st) { QUAL.stufe = st; wasser.visible = st === 0; wasserBillig.visible = st > 0;
  if (st >= 2) { renderer.setPixelRatio(1); komp.setPixelRatio(1); komp.renderTarget1.samples = komp.renderTarget2.samples = 0 }
  if (st >= 3) { renderer.shadowMap.enabled = false; bloom.enabled = false; szene.traverse(o => { if (o.material) [].concat(o.material).forEach(m => m.needsUpdate = true) }) } }
qualitaet(1); // Spiegelwasser ist aus: es zeichnet die ganze Stadt ein zweites Mal (Martin, 17.11.2026)
const BPS_EL = /[?&]fps/.test(location.search) ? Object.assign(document.body.appendChild(document.createElement('div')), { className: 'bpsanzeige' }) : null;

for (let i = 0; i < 8; i++) box(1 * M, .3, 4.6 * M, std('#b89a74'), (1.9 + i * 4.1) * M, -.1, 45.3 * M, szene);
const strich = new THREE.MeshBasicMaterial({ color: '#f4f1ea' }), PSCHILD = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.beginPath(); x.roundRect(6, 6, 116, 116, 18); x.fill(); x.strokeStyle = '#ff4fa3'; x.lineWidth = 8; x.stroke(); x.fillStyle = '#ff4fa3'; x.font = '900 86px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('P', 64, 70); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return new THREE.MeshBasicMaterial({ map: t }) })();
for (const b of B) { const x0 = (b.x + 2) * M, z0 = (b.y + 5.02) * M, z1 = (b.y + 5.58) * M;
  for (let k = 0; k <= 2; k++) for (let z = z0; z < z1; z += .5) flach(.08, .28, strich, x0 + k * 1.1 * M, z + .14, .05);
  for (let x = x0; x < x0 + 2.2 * M; x += .5) flach(.28, .08, strich, x + .14, z0, .05);
  const pfahl = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 2.2, 6), std('#2a2b30', { metalness: .6 })); pfahl.position.set(x0 - .3, 1.1, (b.y + 4.95) * M); szene.add(pfahl);
  const schild = new THREE.Mesh(new THREE.PlaneGeometry(.55, .55), PSCHILD); schild.position.set(x0 - .3, 2.1, (b.y + 4.95) * M + .05); szene.add(schild) }

// ---------- Häuser, Menschen, Autos, Stadtmöbel ----------
const haeuser = baueHaeuser(szene); const graffitiWelt = graffiti(szene); const leute = menschen(szene); const autos = verkehr(szene); const moebel = stadtmoebel(szene); autosLaden();
// Nachts: unter jeder Laterne ein warmweißer Lichtkegel auf der Straße, dazu die echten Lichter in der Nähe. Stilvoll, keine Casino-Farben.
const KEGEL = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c) })();
const LICHTKEGEL = moebel.LAMPEN.map((p, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshBasicMaterial({ map: KEGEL, color: '#ffd9a8', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.set(p.x, .06, p.z); m.renderOrder = 2; szene.add(m); return m });
const boutique = B.find(b => b.meins === 'boutique'), tower = B.find(b => b.haupt); const STRAND = strand(szene); const FLUGHAFEN = flughafen(szene); let JETKAM = false; const ARENA = arena(szene); const SPACEPORT = spaceport(szene);
const FEUERWERK = feuerwerk(szene, tower ? { x: (tower.x + 2) * M, z: (tower.y + 2) * M } : { x: 80, z: 80 }, handy); window.FEUERWERK = FEUERWERK;
const BOOTE = boote(szene), HELIS3 = helis(szene);
// Alex Tower als Treffpunkt: leuchtender Doppelring am Boden und ein festes Schild, damit alle wissen: hier ist deine Klinik, hier treffen sich die Spielerinnen
const turmRing = new THREE.Group(); if (tower) { const mx = (tower.x + 2) * M, mz = (tower.y + 2) * M; turmRing.position.set(mx, 0, mz);
  // Medizinisch blauer Lichtsaum: niedrige, nach oben ausblendende Wand aus Licht
  const saumTex = (() => { const c = document.createElement('canvas'); c.width = 4; c.height = 64; const g2 = c.getContext('2d'), v = g2.createLinearGradient(0, 64, 0, 0); v.addColorStop(0, 'rgba(120,200,255,.55)'); v.addColorStop(1, 'rgba(120,200,255,0)'); g2.fillStyle = v; g2.fillRect(0, 0, 4, 64); return new THREE.CanvasTexture(c) })();
  const saum = new THREE.Mesh(new THREE.CylinderGeometry(3.3 * M, 3.3 * M, 1.4, 96, 1, true), new THREE.MeshBasicMaterial({ map: saumTex, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })); saum.position.y = .7; turmRing.add(saum);
  // Drei weiche Wellen, die nacheinander nach außen laufen und ausklingen
  for (let w = 0; w < 3; w++) { const r = new THREE.Mesh(new THREE.RingGeometry(3.2 * M, 3.32 * M, 96), new THREE.MeshBasicMaterial({ color: '#7cc8ff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); r.rotation.x = -Math.PI / 2; r.position.y = .2; r.userData.welle = w; turmRing.add(r) }
  szene.add(turmRing) }
// Eingang zur Klinik: freistehendes Glasportal vor dem Tower, Chromrahmen, Glastüren, Vordach mit Leuchtschrift, roter Teppich. Antippen = hineingehen.
function leuchtschrift(text, farbe, w = 1024, h = 160) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.fillStyle = '#0d0e12'; g.fillRect(0, 0, w, h);
  g.font = `800 ${h * .5}px Inter, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = farbe; g.shadowBlur = 24; g.fillStyle = farbe; g.fillText(text, w / 2, h / 2 + 4); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t }
if (tower) { const pg = new THREE.Group(), px = (tower.x + 2) * M - 2.5, pz = (tower.y + 4) * M - .8; pg.position.set(px, 0, pz); szene.add(pg);
  const chrom = std('#e9ecf0', { metalness: 1, roughness: .12 }), glasT = new THREE.MeshPhysicalMaterial({ color: '#cfe9f2', transparent: true, opacity: .35, roughness: .03, metalness: .2, emissive: '#ffe6c2', emissiveIntensity: .25 });
  for (const sx of [-2.3, 2.3]) box(.35, 4.6, .35, chrom, sx, 0, 0, pg); box(5.4, .3, 2.6, chrom, 0, 4.6, .9, pg);
  for (const sx of [-1.05, 1.05]) { const t = new THREE.Mesh(new THREE.BoxGeometry(2, 4.2, .08), glasT); t.position.set(sx, 2.1, 0); pg.add(t); box(.06, 1.2, .1, chrom, sx > 0 ? .25 : -.25, 1.4, .1, pg) }
  const schrift = new THREE.Mesh(new THREE.PlaneGeometry(5.2, .8), new THREE.MeshBasicMaterial({ map: leuchtschrift('EINGANG · KLINIK', '#ff4fa3') })); schrift.position.set(0, 4.75, 2.22); pg.add(schrift);
  const teppich = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 5), std('#b3123a', { roughness: .95 })); teppich.rotation.x = -Math.PI / 2; teppich.position.set(0, .05, 2.6); teppich.receiveShadow = true; pg.add(teppich);
  for (const sx of [-1.6, 1.6]) for (const sz of [1.2, 3.8]) { box(.12, .9, .12, std('#e6c76a', { metalness: 1, roughness: .2 }), sx, 0, sz, pg) }
  
  pg.traverse(o => { o.userData.haus = tower }) }
// Dein Zuhause: blauer Ring mit Lichtsaum und Schild über dem Wohnhaus, damit du es sofort findest
const zuhause = B.find(b => b.top === 'home'), heimRing = new THREE.Group(); if (zuhause) { heimRing.position.set((zuhause.x + 2) * M, 0, (zuhause.y + 2) * M); szene.add(heimRing);
  for (let w = 0; w < 2; w++) { const r = new THREE.Mesh(new THREE.RingGeometry(2.4 * M, 2.5 * M, 80), new THREE.MeshBasicMaterial({ color: '#4fa8ff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); r.rotation.x = -Math.PI / 2; r.position.y = .2; r.userData.welle = w; heimRing.add(r) }
  const hs = new THREE.Sprite(new THREE.SpriteMaterial({ map: blase('🏠 DEIN ZUHAUSE', '#2f6fd6'), depthTest: false, transparent: true })); hs.scale.set(10, 2.5, 1); hs.renderOrder = 41; hs.position.y = ((zuhause.drei && zuhause.drei.userData.hoehe) || 30) + 5; heimRing.add(hs) }
const turmSchild = new THREE.Sprite(new THREE.SpriteMaterial({ map: blase('🩺 ALEX TOWER', '#16171a'), depthTest: false, transparent: true })); turmSchild.scale.set(11, 2.75, 1); turmSchild.renderOrder = 41; if (tower) szene.add(turmSchild);
const towerSprite = new THREE.Sprite(new THREE.SpriteMaterial({ depthTest: false, transparent: true })); towerSprite.scale.set(10, 2.5, 1); towerSprite.renderOrder = 40; szene.add(towerSprite); let towerText = '';
const blasenSprite = new THREE.Sprite(new THREE.SpriteMaterial({ depthTest: false, transparent: true })); blasenSprite.scale.set(9, 2.25, 1); blasenSprite.renderOrder = 40; szene.add(blasenSprite); let blasenText = '';

// Bloom für Neon
const komp = new EffectComposer(renderer); komp.renderTarget1.samples = komp.renderTarget2.samples = handy ? 0 : 2; /* Kanten glatt auch mit Nachbearbeitung */ komp.addPass(new RenderPass(szene, kamera)); const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), .3, .55, .85); komp.addPass(bloom); komp.addPass(new OutputPass());
bloom.enabled = false; // Leuchteffekt kostete gemessen 2/3 des Tempos (21 statt 59 Bilder pro Sekunde, 17.11.2026). Neon leuchtet über sein Material.

// ---------- Tag und Nacht nach der Spieluhr (zeit.js) ----------
const glatt = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) };
const farbe = (a, b, t) => new THREE.Color(a).lerp(new THREE.Color(b), t);
function licht(mitte) { const h = Math.round(stunde() * 4) / 4, /* Sonne wandert in Viertelstunden, sonst flimmern die Schatten */ hoehe = Math.sin((h - 6.2) / 13.6 * Math.PI) * 58, azimut = (h - 6) / 14 * 180 - 90;
  const sp = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - hoehe), THREE.MathUtils.degToRad(azimut + 200)); hu.sunPosition.value.copy(sp);
  const nacht = 1 - glatt(-6, 3, hoehe), gold = glatt(-2, 4, hoehe) * (1 - glatt(8, 22, hoehe));
  const raster = new THREE.Vector3(Math.round(mitte.x / 6) * 6, 0, Math.round(mitte.z / 6) * 6); /* Schatten springt in 6-m-Schritten statt bei jeder Bewegung zu zittern */ sonne.position.copy(sp).multiplyScalar(300).add(raster); sonne.target.position.copy(raster); sonne.intensity = 3.6 * glatt(-2, 6, hoehe); sonne.color.copy(farbe('#ffe6c8', '#ff9a6a', gold));
  halb.intensity = .28 + .27 * (1 - nacht); halb.color.copy(farbe('#b9d4ff', '#4a4f9e', nacht)); halb.groundColor.copy(farbe('#f0c9b8', '#2a1f3a', nacht));
  renderer.toneMappingExposure = .34 - nacht * .02; sterne.material.opacity = nacht * .9; szene.fog.color.copy(farbe(farbe('#a7abb0', '#b9a99a', gold * .5).getStyle(), '#14161c', nacht));
  for (const m of NEON) m.emissiveIntensity = m.userData.basis * (.12 + nacht * .5); for (const m of FENSTER) { const pu = m.userData.puls; m.emissiveIntensity = (m.userData.tag || 0) + m.userData.basis * nacht * (pu ? 1 + pu * Math.sin(performance.now() / 1000 * 13.4 + (m.userData.ph || 0)) : 1) }
  bloom.strength = .18 + nacht * .28;
  // Laternenlicht: die nächsten Laternen leuchten wirklich
  const nah = moebel.LAMPEN.map(p => [p, p.distanceToSquared(mitte)]).sort((a, b) => a[1] - b[1]); LAMPENLICHT.forEach((l, i) => { const e = nah[i]; if (e) l.position.copy(e[0]); l.intensity = nacht * 55 });
  for (const m of LICHTKEGEL) m.material.opacity = nacht * .42; STRAND.weiter(nacht, LETZT_DT); FLUGHAFEN.weiter(nacht, LETZT_DT); ARENA.weiter(nacht, LETZT_DT); SPACEPORT.weiter(nacht, LETZT_DT);
  // Glas nachts wie Chrom: mehr Metall, stärkere Spiegelung, kaum Durchsicht
  for (const g of GLAS) { g.metalness = .4 + nacht * .4; g.roughness = .04 - nacht * .02; g.envMapIntensity = 1.3 + nacht * 2.7; g.opacity = .68 + nacht * .17 }
  if (Math.abs(h - letzteStunde) > .3) { letzteStunde = h; const u = himmelKopie.material.uniforms; for (const k of ['turbidity', 'rayleigh', 'mieCoefficient', 'mieDirectionalG']) u[k].value = hu[k].value; u.sunPosition.value.copy(sp); const rt = pmrem.fromScene(hs); if (umwelt) umwelt.dispose(); umwelt = rt; szene.environment = rt.texture }
  return nacht }

// ---------- Kamera: folgt dir (oder deinem Auto), Ziehen dreht, Scrollen und Knöpfe zoomen ----------
const ziel = new THREE.Vector3(ICH.x * M, 1.5, ICH.y * M); steuer.target.copy(ziel); kamera.position.set(ziel.x + 17, 19, ziel.z + 17);
let fokusPunkt = null; const tmp = new THREE.Vector3();
const zoom = f => { tmp.subVectors(kamera.position, steuer.target).multiplyScalar(f); if (tmp.length() > 6 && tmp.length() < 180) kamera.position.copy(steuer.target).add(tmp) };
// Kino-Modus für Reels: Oberfläche aus, Kamera fliegt langsam um den Alex Tower, über die Promenade und zurück. Tippen beendet.
const KINO = { an: false, t: 0 }; document.getElementById('zkino').onclick = () => { KINO.an = true; KINO.t = 0; document.body.classList.add('kino'); const h = document.body.appendChild(Object.assign(document.createElement('div'), { className: 'kinohinweis', textContent: 'Kino-Modus · tippen zum Beenden' })); setTimeout(() => h.style.opacity = 0, 2000); setTimeout(() => h.remove(), 3200) };
addEventListener('pointerdown', () => { if (!KINO.an || KINO.t < .5) return; KINO.an = false; document.body.classList.remove('kino') }, true);
/* Steuerkreuz (Martin 19.11.2026): ⟲ ⟳ drehen die Kamera um den Blickpunkt, gedrückt halten dreht weiter */
{ const achse = new THREE.Vector3(0, 1, 0), dreh = new THREE.Vector3(); const drehen = w => { dreh.subVectors(kamera.position, steuer.target).applyAxisAngle(achse, w); kamera.position.copy(steuer.target).add(dreh); steuer.update() };
  for (const [id, w] of [['zlinks', .06], ['zrechts', -.06]]) { const k = document.getElementById(id); let t = null; const stopp = () => { clearInterval(t); t = null };
    k.onpointerdown = e => { e.preventDefault(); drehen(w * 2); stopp(); t = setInterval(() => drehen(w), 30) }; k.onpointerup = k.onpointerleave = k.onpointercancel = stopp } }
document.getElementById('zin').onclick = () => zoom(.75); document.getElementById('zout').onclick = () => zoom(1.33); document.getElementById('zich').onclick = () => { fokusPunkt = null; frei = false; tmp.subVectors(kamera.position, steuer.target).setLength(26); kamera.position.copy(steuer.target).add(tmp) };

// ---------- Antippen: wie im 2D-Spiel (Haus = hingehen, Figur = Setcard, eigenes Auto = ein- und aussteigen) ----------
const ray = new THREE.Raycaster(), maus = new THREE.Vector2(), bodenEbene = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); let runter = null;
/* Gehen in Gebäuden: Boden antippen, die Figur läuft hin (wird auch von der 2D-Fläche aus bedienung.js gerufen, die drinnen obenauf liegt) */
window.innenTippen = (cx, cy) => { if (!INNEN) return; maus.set(cx / innerWidth * 2 - 1, -cy / innerHeight * 2 + 1); ray.setFromCamera(maus, kamera); const boden = new THREE.Vector3(); if (ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), boden)) { const b = INNEN; const wx2 = boden.x / M, wy2 = boden.z / M; if (typeof window.klubAntippen === 'function' && window.klubAntippen(wx2, wy2, cx, cy)) return; if (typeof window.scorpiusAntippen === 'function' && window.scorpiusAntippen(wx2, wy2)) return; ICH.innenZiel = [Math.min(b.x + 3.75, Math.max(b.x + .25, wx2)), Math.min(b.y + 3.75, Math.max(b.y + .25, wy2))] } };
leinwand.addEventListener('pointerdown', e => { runter = [e.clientX, e.clientY]; zieh = [e.clientX, e.clientY] });
// In der Praxis: Ziehen dreht die Kamera um dich, Scrollen zoomt, Tippen läuft oder handelt
let zieh = null; leinwand.addEventListener('pointermove', e => { if (!zieh) return; if (inWohnungJetzt && WOHNUNG) { WOHNUNG.drehen(e.clientX - zieh[0]); zieh = [e.clientX, e.clientY]; return } if (typeof KLINIK === 'undefined' || !KLINIK.offen || !PRAXIS) return; PRAXIS.drehen(e.clientX - zieh[0]); zieh = [e.clientX, e.clientY] });
addEventListener('pointerup', () => zieh = null);
leinwand.addEventListener('wheel', e => { if (inWohnungJetzt && WOHNUNG) return WOHNUNG.zoom(Math.exp(e.deltaY * .0012)); if (typeof KLINIK !== 'undefined' && KLINIK.offen && PRAXIS) PRAXIS.zoom(Math.exp(e.deltaY * .0012)) }, { passive: true });
leinwand.addEventListener('pointerup', e => { if (!runter || Math.hypot(e.clientX - runter[0], e.clientY - runter[1]) > 6) return; if (inWohnungJetzt && WOHNUNG) { WOHNUNG.tippen(e.clientX, e.clientY); return } if (INNEN) { window.innenTippen(e.clientX, e.clientY); return } if (typeof KLINIK !== 'undefined' && KLINIK.offen) { if (PRAXIS) PRAXIS.tippen(e.clientX, e.clientY); return } maus.set(e.clientX / innerWidth * 2 - 1, -e.clientY / innerHeight * 2 + 1); ray.setFromCamera(maus, kamera);
  let haus = null, person = null, auto = false, boot = false; for (const t of ray.intersectObjects(szene.children, true)) { let o = t.object; if (!o.visible) continue; while (o && !o.userData.haus && !o.userData.p && !o.userData.meinAuto && !o.userData.meinBoot && !o.userData.jet && !o.userData.spaceport && !o.userData.yachtclub && o.parent) o = o.parent;
    if (o.userData.haus && o.userData.haus.drei && o.userData.haus.drei.userData.durch) continue;
    if (o.userData.spaceport) { if (typeof spaceportZeigen === 'function') spaceportZeigen(); return } if (o.userData.yachtclub) { if (typeof yachtclubZeigen === 'function') yachtclubZeigen(); return }
    if (o.userData.jet) { if (ST.besitz[o.userData.jet]) jetZiele(); else { const t = B.find(b => b.title === 'Flughafen Tempelhoff'); if (t) laufeZu(t.x + 2, t.y + 2, t); toast('Dieser Jet ist zu verkaufen. Ab ins Terminal.') } return }
    if (o.userData.meinBoot) { boot = true; break } if (o.userData.meinAuto) { auto = true; break } if (o.userData.p) { person = o.userData.p; break } if (o.userData.haus) { haus = o.userData.haus; break } }
  const p = new THREE.Vector3(); ray.ray.intersectPlane(bodenEbene, p); const x = p.x / M, y = p.z / M; fokusPunkt = null; frei = false;
  // Boot: antippen = an Bord gehen; an Bord tippt man aufs Wasser, um hinzufahren
  if (MEINBOOT.an) { bootZiel(x, y); return } if (boot) { bootAnBord(); return }
  if (auto && ICH.auto) { if (ICH.faehrt) { if (ICH.auto.id === 'roadster') laufeZu(ICH.x, ICH.y, null); else fahrZu(ICH.x, ICH.y, null); toast('Du parkst in der nächsten Parkbucht') }
    else { if (Math.hypot(ICH.x - PARK_ICH.x, ICH.y - PARK_ICH.y) > 1.5) { laufeZu(PARK_ICH.x, PARK_ICH.y, null, true); ICH.einsteigen = 1; return } ICH.faehrt = 1; ICH.x = PARK_ICH.x; ICH.y = PARK_ICH.y; toast(`Du fährst deinen ${ICH.auto.name}. Antippen zum Parken.`) } return }
  if (person && person !== ICH) { FREMD = person; karten(); return }
  sel = null; document.getElementById('card').hidden = true; offen = null;
  if (!haus) haus = B.find(b => x > b.x - .1 && x < b.x + 4.1 && y > b.y - .1 && y < b.y + 4.1) || null;
  if (haus) { const [tx, ty] = tuer(haus); laufeZu(tx, ty, haus) } else laufeZu(x, y, null) });
addEventListener('resize', () => { kamera.aspect = innerWidth / innerHeight; kamera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); komp.setSize(innerWidth, innerHeight) });

// ---------- Ein Bild: wird von frame() in ablauf.js aufgerufen, solange niemand in einem Haus ist ----------
let T3 = 0, bildNr = 0;
let LETZT_DT = .016;
function zeichne(dt) { T3 += dt; LETZT_DT = dt;
  QUAL.zeit += dt; QUAL.bilder++; if (QUAL.zeit > 2) { QUAL.bps = QUAL.bilder / QUAL.zeit; QUAL.zeit = 0; QUAL.bilder = 0; if (QUAL.bps < 40 && QUAL.stufe < 3 && T3 > 6) qualitaet(QUAL.stufe + 1); if (BPS_EL) BPS_EL.textContent = `${Math.round(QUAL.bps)} B/s · Stufe ${QUAL.stufe}` }
  WELLEN2.offset.set(T3 * .006, T3 * .004);
  if (KINO.an) { KINO.t += dt; const tw = tower ? new THREE.Vector3((tower.x + 2) * M, 0, (tower.y + 2) * M) : new THREE.Vector3(60, 0, 60), u = KINO.t * .05, r = 70 + Math.sin(KINO.t * .13) * 35;
    steuer.target.lerp(tmp.set(tw.x + Math.sin(KINO.t * .07) * 30, 6 + Math.sin(KINO.t * .21) * 4, tw.z + 25 + Math.sin(KINO.t * .05) * 40), Math.min(1, dt * .8)); kamera.position.lerp(tmp.set(tw.x + Math.cos(u) * r, 22 + Math.sin(KINO.t * .17) * 14, tw.z + Math.sin(u) * r), Math.min(1, dt * .8)); frei = true }
  // Klinik offen: deine Praxis im Alex Tower statt der Stadt
  const inPraxis = typeof KLINIK !== 'undefined' && KLINIK.offen; steuer.enabled = !inPraxis;
  // Wohnungen: eigener 3D-Raum statt der alten 2D-Ansicht
  inWohnungJetzt = !inPraxis && typeof INNEN !== 'undefined' && INNEN && typeof etagen === 'function' && etagen(INNEN)[INNEN.stock || 0].a === 'home'; const inWohnung = inWohnungJetzt; if (inWohnung) steuer.enabled = false;
  if (inWohnung) { WOHNUNG = WOHNUNG || wohnung(renderer); const { szene: ws, kamera: wk } = WOHNUNG.zeichne(dt, innerWidth, innerHeight, INNEN); renderer.toneMappingExposure = .75; renderer.render(ws, wk); return }
  if (inPraxis) { PRAXIS = PRAXIS || praxis(renderer); const { szene: ps, kamera: pk } = PRAXIS.zeichne(dt, innerWidth, innerHeight); renderer.toneMappingExposure = .6; renderer.render(ps, pk); return }
  // „Stadt“-Knopf und andere Kameraziele des 2D-Spiels übernehmen
  if (ZIEL) { const a = ZIEL.cx / 32, b = (ZIEL.cy + 50) / 16; fokusPunkt = new THREE.Vector3((a + b) / 2 * M, 1.5, (b - a) / 2 * M); ZIEL = null; frei = false }
  // Abflug des eigenen Jets: Kamera fliegt mit, danach zurück zu dir
  const fp = FLUGHAFEN.flugPunkt(); if (fp) { fokusPunkt = (fokusPunkt || new THREE.Vector3()).set(fp.x, fp.y + 2, fp.z); frei = false; JETKAM = true } else if (JETKAM) { fokusPunkt = null; JETKAM = false }
  const wer = ICH.faehrt ? new THREE.Vector3(ICH.x * M, (ICH.lift || 0) * (ICH.flugStart ? .9 : .09) + 1, ICH.y * M) : new THREE.Vector3(ICH.x * M, 1.5, ICH.y * M); const zielPunkt = fokusPunkt || wer;
  if (!frei) { tmp.subVectors(zielPunkt, steuer.target).multiplyScalar(Math.min(1, dt * 3)); steuer.target.add(tmp); kamera.position.add(tmp) }
  else { const ax = THREE.MathUtils.clamp(steuer.target.x, -62 * M, 96 * M), az = THREE.MathUtils.clamp(steuer.target.z, -14 * M, 56 * M); tmp.set(ax - steuer.target.x, 0, az - steuer.target.z); steuer.target.add(tmp); kamera.position.add(tmp); steuer.target.y = 1.5 }
  // Beim Start fliegt die Kamera dicht hinter dem Jet her (Verfolgerblick), wackelt beim Rollen leicht
  if (fp) { const ft = FLUGHAFEN.flugZeit(), wackel = ft > 2 && ft < 7 ? .12 : 0; kamera.position.lerp(tmp.set(fp.x + 7 + (Math.random() - .5) * wackel, fp.y + 5 + Math.min(14, Math.max(0, ft - 7) * 1.5), fp.z + 24), Math.min(1, dt * 1.8)) }
  CX = wx(ICH.x, ICH.y); CY = wy(ICH.x, ICH.y, 0);
  const nacht = licht(steuer.target); const mitte = { x: steuer.target.x / M, y: steuer.target.z / M }; const weite = Math.min(30, 10 + kamera.position.distanceTo(steuer.target) / M * .9);
  if ((++bildNr) % 4 === 0) durchsicht(haeuser, kamera, new THREE.Vector3(ICH.x * M, 1.2, ICH.y * M)); leute.weiter(T3, mitte, weite); autos.weiter(nacht); graffitiWelt.weiter(dt); moebel.weiter(); BOOTE.weiter(T3); FEUERWERK.weiter(dt); HELIS3.weiter(T3, dt);
  for (const h of haeuser) h.visible = h.userData.haus !== INNEN; if (tower && tower.drei && tower.drei.userData.blinkt) tower.drei.userData.blinkt.visible = Math.sin(T3 * 3) > 0;
  // Blase über deiner Boutique
  if (boutique && typeof boutiqueStatus === 'function') { const s = boutiqueStatus(); if (s && s.text !== blasenText) { blasenText = s.text; blasenSprite.material.map = blase(s.text, s.farbe); blasenSprite.material.needsUpdate = true } blasenSprite.visible = !!s;
    blasenSprite.position.set((boutique.x + 2) * M, (boutique.drei ? boutique.drei.userData.hoehe : 10) + 4 + Math.sin(T3 * 2) * .3, (boutique.y + 2) * M) }
  if (tower && typeof klinikStatus === 'function') { const s = klinikStatus(); if (s.text !== towerText) { towerText = s.text; towerSprite.material.map = blase(s.text, s.farbe); towerSprite.material.needsUpdate = true }
    towerSprite.position.set((tower.x + 2) * M, 14 + Math.sin(T3 * 2 + 1) * .3, (tower.y + 2) * M + 7) }
  heimRing.children.forEach(r => { if (r.userData.welle == null) return; const u = ((T3 * .3 + r.userData.welle / 2) % 1); r.scale.setScalar(1 + u * .3); r.material.opacity = Math.sin(u * Math.PI) * .6 });
  if (tower) { turmSchild.position.set((tower.x + 2) * M, 19 + Math.sin(T3 * 1.5) * .3, (tower.y + 2) * M + 7); turmRing.children.forEach(r => { if (r.userData.welle == null) return; const u = ((T3 * .25 + r.userData.welle / 3) % 1); r.scale.setScalar(1 + u * .35); r.material.opacity = Math.sin(u * Math.PI) * .5 }) }
  { const u = wasser.material.uniforms; u.time.value = T3 * .35; u.sunDirection.value.copy(sonne.position).normalize(); u.sunColor.value.set(nacht > .5 ? '#3a4660' : '#fff2dc'); u.waterColor.value.copy(new THREE.Color('#16a3bd').lerp(new THREE.Color('#06303d'), nacht)) }
  if (KINO.an) kamera.lookAt(steuer.target); else steuer.update(); komp.render() }
window.DREI = { an: true, zeichne, etage: id => PRAXIS && PRAXIS.fahren(id), qualitaet, QUAL, intern: () => ({ szene, renderer, wasser, bloom, komp }), messen: () => { let lichter = 0, schatten = 0; szene.traverse(o => { if (o.isLight && o.visible) { lichter++; if (o.castShadow) schatten++ } }); return { aufrufe: renderer.info.render.calls, dreiecke: renderer.info.render.triangles, lichter, schatten, pixel: renderer.getPixelRatio() } } };
