// Berlin 3D · wasser.js · Jachten (am Steg, fahrend, deine eigene) und drei Hubschrauber zwischen den Hochhausdächern
import * as THREE from 'three';
import { M } from './haeuser.js?v=1795081882';
import { namensSchild, neueFigur, einkleiden, tanzen } from './leben.js?v=1795081882';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// Echte Bootsmodelle aus Blender (werkzeug/boote_blender.py): Superjacht, Motorjacht, Speedboot. Bug zeigt nach +X.
const BOOT_MODELL = {}, MODELL_DATEI = { gross: 'super', jacht: 'motor', speed: 'speed' }, MODELL_L = { gross: 32, jacht: 18, speed: 9 }, MODELL_H = { gross: 2.4, jacht: 1.7, speed: 1 };
const bootsLaden = Promise.all(Object.entries(MODELL_DATEI).map(async ([typ, d]) => { try { const b64 = await (await fetch(`autos/3d/boot_${d}.txt`)).text(); const roh = Uint8Array.from(atob(b64.trim()), c => c.charCodeAt(0)); BOOT_MODELL[typ] = (await new GLTFLoader().parseAsync(roh.buffer, '')).scene } catch (e) {} }));
// Modell in Spielgröße, eigene Boote schwarz mit Gold
function modellBoot(typ, L, eigen, farben) { if (typ === 'riva') return rivaBoot(L); if (typ === 'kat') return katamaran(L); const m = BOOT_MODELL[typ]; if (!m) return null; const g = new THREE.Group(), k = m.clone(true), sk = L / MODELL_L[typ]; k.scale.setScalar(sk); k.position.y = -.35;
  k.traverse(o => { if (!o.isMesh) return; o.castShadow = true; if (eigen) { const n = o.material.name; if (n === 'Rumpf' || n === 'Unterrumpf' || n === 'Streifen') { o.material = o.material.clone(); o.material.color.set(n === 'Streifen' ? (farben && farben.streifen) || '#d9b44a' : n === 'Rumpf' ? (farben && farben.lack) || '#0d0e12' : (farben && farben.lack) || '#16171a'); if (n === 'Streifen') { o.material.metalness = .8; o.material.roughness = .2 } } } }); g.add(k); g.userData.deck = MODELL_H[typ] * sk - .3; g.userData.L = L; return g }

const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .4 }, o));
// Eigene Yacht veredeln: leuchtende Fensterbänder an beiden Seiten, goldene Deckskante, Jacuzzi am Bug, ab 40 m Helipad oben
const LICHTBAND = new THREE.MeshStandardMaterial({ color: '#0b1520', emissive: '#9fd8ff', emissiveIntensity: .8 }), DECKGOLD = new THREE.MeshStandardMaterial({ color: '#e6c76a', emissive: '#e6c76a', emissiveIntensity: .6, metalness: .8, roughness: .3 });
// Liegeplatz: kleine Boote am Steg, große Yachten (über 15 m) frei draußen vor Anker, damit nichts auf Steg, Terrassen oder Pool liegt
function ankerplatz(o, g) { const L = (g && g.userData.L) || 8; if (L <= 15) return [o.x * M, 0, o.y * M]; return [o.x * M - L * .25, 0, 49 * M + L * .12] }
function veredeln(g, L, it) { g.updateMatrixWorld(true); const box = new THREE.Box3(); for (const c of g.children) if (!c.isSprite) box.expandByObject(c); /* Schild nicht mitmessen */ const oben = box.max.y - g.position.y, deck = g.userData.deck || 1, B = (box.max.z - box.min.z) || L * .2;
  for (const sz of [-1, 1]) { for (let r = 0; r < (L > 40 ? 3 : L > 15 ? 2 : 1); r++) { const band = new THREE.Mesh(new THREE.BoxGeometry(L * .55, .18, .05), LICHTBAND); band.position.set(-L * .05, deck * .45 + r * Math.max(.6, (oben - deck) / 4), sz * (B / 2 + .03)); g.add(band) }
    const kante = new THREE.Mesh(new THREE.BoxGeometry(L * .9, .06, .06), DECKGOLD); kante.position.set(0, deck + .05, sz * (B / 2 - .05)); g.add(kante) }
  /* Unterwasserlicht entfernt (Martin 19.11.2026): die türkise Fläche färbte das Wasser rund ums eigene Boot anders */
  if (L > 12) { const pool = new THREE.Mesh(new THREE.CylinderGeometry(B * .18, B * .18, .3, 28), new THREE.MeshStandardMaterial({ color: '#4fd8f0', emissive: '#2ab8d8', emissiveIntensity: .5, roughness: .05 })); pool.position.set(L * .36, deck + .1, 0); g.add(pool) }
  if (L > 40) { const pad = new THREE.Mesh(new THREE.CylinderGeometry(B * .35, B * .35, .12, 36), new THREE.MeshStandardMaterial({ color: '#2a2f38', roughness: .6 })); pad.position.set(-L * .12, oben + .1, 0); g.add(pad);
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.strokeStyle = '#ffffff'; x.lineWidth = 6; x.beginPath(); x.arc(64, 64, 54, 0, 7); x.stroke(); x.fillStyle = '#ffffff'; x.font = '900 70px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('H', 64, 68);
    const h = new THREE.Mesh(new THREE.CircleGeometry(B * .33, 36), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true })); h.rotation.x = -Math.PI / 2; h.position.set(-L * .12, oben + .17, 0); g.add(h) } }
// Klassischer Holz-Runabout (Riva-Stil): Mahagonirumpf mit hellen Fugen, cremefarbene Polster, Chromwindschutz
function rivaBoot(L) { const g = new THREE.Group(), B = L * .3, holz = std('#7a3b1e', { roughness: .25, metalness: .1 }), fuge = std('#f2e3c6', { roughness: .5 }), polster = std('#f4ecdc', { roughness: .9 });
  const r = platte(rumpfForm(L, B), .7, holz, -.3); g.add(r); const deck = platte(rumpfForm(L * .96, B * .92), .06, holz, .42); g.add(deck); for (let i = -3; i <= 3; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(L * .7, .02, .03), fuge); f.position.set(-L * .05, .49, i * B * .12); g.add(f) }
  for (const x of [-L * .12, -L * .3]) { const p = new THREE.Mesh(new THREE.BoxGeometry(L * .14, .3, B * .78), polster); p.position.set(x, .62, 0); g.add(p) } const w = new THREE.Mesh(new THREE.BoxGeometry(.06, .35, B * .8), new THREE.MeshPhysicalMaterial({ color: '#dff3ff', transparent: true, opacity: .4, metalness: .3 })); w.position.set(L * .02, .68, 0); w.rotation.z = -.4; g.add(w);
  g.traverse(o => { if (o.isMesh) o.castShadow = true }); g.userData.deck = .5; g.userData.L = L; return g }
// Katamaran: zwei schlanke Rümpfe, breites Deck, gläserner Salon mit dunklen Scheiben
function katamaran(L) { const g = new THREE.Group(), B = L * .45, weiss = std('#fbfbfa', { roughness: .25 });
  for (const z of [-B * .36, B * .36]) { const r = platte(rumpfForm(L, B * .26), .9, weiss, -.4); r.position.z = z; g.add(r) } const deck = new THREE.Mesh(new THREE.BoxGeometry(L * .78, .25, B), weiss); deck.position.set(-L * .05, .65, 0); g.add(deck);
  const salon = new THREE.Mesh(new THREE.BoxGeometry(L * .4, .9, B * .8), weiss); salon.position.set(-L * .12, 1.2, 0); g.add(salon); const sch = new THREE.Mesh(new THREE.BoxGeometry(L * .41, .45, B * .82), GLAS); sch.position.set(-L * .12, 1.25, 0); g.add(sch);
  const fly = new THREE.Mesh(new THREE.BoxGeometry(L * .28, .1, B * .7), weiss); fly.position.set(-L * .15, 1.75, 0); g.add(fly); g.traverse(o => { if (o.isMesh) o.castShadow = true }); g.userData.deck = .9; g.userData.L = L; return g }
const WEISS = std('#fbfbfa', { roughness: .25 }), HOLZ = std('#b98a5a', { roughness: .6 }), GLAS = std('#14202c', { roughness: .05, metalness: .6 }), CHROM = std('#e8ecf0', { metalness: 1, roughness: .15 });
// Rumpf von oben gesehen: spitzer Bug nach +X, extrudiert in die Höhe
function rumpfForm(L, B) { const s = new THREE.Shape(); s.moveTo(-L / 2, -B / 2); s.lineTo(L * .18, -B / 2); s.quadraticCurveTo(L * .45, -B * .42, L / 2, 0); s.quadraticCurveTo(L * .45, B * .42, L * .18, B / 2); s.lineTo(-L / 2, B / 2); s.closePath(); return s }
function platte(form, hoehe, mat, y) { const g = new THREE.ExtrudeGeometry(form, { depth: hoehe, bevelEnabled: true, bevelThickness: .08, bevelSize: .08, bevelSegments: 2 }); g.rotateX(-Math.PI / 2); const m = new THREE.Mesh(g, mat); m.position.y = y; m.castShadow = m.receiveShadow = true; return m }
export function jacht(L, typ = 'jacht', streifen = '#1d3557') { const g = new THREE.Group(), B = L * (typ === 'speed' ? .32 : .26), h = typ === 'speed' ? .9 : L * .09;
  g.add(platte(rumpfForm(L, B), h, WEISS, -.5)); g.add(platte(rumpfForm(L * .985, B * 1.01), .18, std(streifen, { roughness: .3 }), -.5 + h * .45));
  g.add(platte(rumpfForm(L * .92, B * .9), .06, HOLZ, -.5 + h + .02));
  if (typ === 'speed') { const sch = new THREE.Mesh(new THREE.BoxGeometry(.08, .6, B * .7), GLAS); sch.position.set(L * .05, h - .1, 0); sch.rotation.z = .5; g.add(sch); for (const z of [-B * .2, B * .2]) { const s = new THREE.Mesh(new THREE.BoxGeometry(.7, .5, .6), std('#f4efe6')); s.position.set(-L * .1, h, z); g.add(s) } return g }
  // Aufbauten: zwei bis drei Decks, dunkles Fensterband, Radar
  const decks = typ === 'gross' ? 3 : 2; for (let d = 0; d < decks; d++) { const lang = L * (.55 - d * .13), breit = B * (.8 - d * .1), y = -.5 + h + .1 + d * 1.25, x = -L * .08 - d * L * .04;
    const o = new THREE.Mesh(new THREE.BoxGeometry(lang, 1.1, breit), WEISS); o.position.set(x, y + .55, 0); o.castShadow = true; g.add(o);
    const f = new THREE.Mesh(new THREE.BoxGeometry(lang * .96, .45, breit * 1.02), GLAS); f.position.set(x + .05, y + .62, 0); g.add(f) }
  // Rumpffenster, Reling am Vordeck, Badeplattform am Heck, Flybridge mit Sonnendach
  for (const sz of [-1, 1]) for (let i = 0; i < 4; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(L * .07, .16, .04), GLAS); f.position.set(-L * .15 + i * L * .1, -.5 + h * .7, sz * (B / 2 + .02)); g.add(f) }
  for (const sz of [-1, 1]) { const r = new THREE.Mesh(new THREE.BoxGeometry(L * .42, .04, .04), CHROM); r.position.set(L * .2, -.5 + h + .75, sz * B * .4); r.rotation.y = sz * .12; g.add(r); for (let i = 0; i < 5; i++) { const st = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .7, 4), CHROM); st.position.set(L * .02 + i * L * .09, -.5 + h + .4, sz * B * (.42 - i * .04)); g.add(st) } }
  const bad = new THREE.Mesh(new THREE.BoxGeometry(L * .08, .1, B * .85), HOLZ); bad.position.set(-L / 2 - L * .03, -.5 + h * .35, 0); g.add(bad);
  const fy = -.5 + h + .1 + decks * 1.25, sonne = new THREE.Mesh(new THREE.BoxGeometry(L * .22, .06, B * .62), WEISS); sonne.position.set(-L * .2, fy + 1.3, 0); g.add(sonne);
  for (const [dx, dz] of [[-.09, -.28], [-.09, .28], [.09, -.28], [.09, .28]]) { const st = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 1.3, 6), CHROM); st.position.set(-L * .2 + dx * L, fy + .65, dz * B); g.add(st) }
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(.05, .07, 1.6, 8), CHROM); mast.position.set(-L * .12, -.5 + h + decks * 1.25 + .9, 0); g.add(mast);
  const radar = new THREE.Mesh(new THREE.BoxGeometry(.9, .08, .14), WEISS); radar.position.set(-L * .12, -.5 + h + decks * 1.25 + 1.4, 0); g.add(radar); g.userData.radar = radar; return g }

export function boote(szene) { const liste = [];
  for (const o of YACHT) { const j = jacht(o.L * M, 'jacht', ['#1d3557', '#ff4fa3', '#2fe0d2', '#c9b48a'][liste.length % 4]); j.position.set((o.x + o.L / 2) * M, 0, (o.y + .25) * M); szene.add(j); liste.push({ o, j }) }
  for (const o of SCHIFFE) { const j = jacht(o.L * M, o.typ === 'speed' ? 'speed' : o.typ === 'gross' ? 'gross' : 'jacht', o.typ === 'speed' ? '#ff4fa3' : '#1d3557'); szene.add(j); liste.push({ o, j, faehrt: true }) }
  const LAENGE = { speed: 1.8, jacht: 3.2, gross: 6 }; let mein = null, meinTyp = '', party = null;
  bootsLaden.then(() => { for (const b of liste) { const typ = b.faehrt ? (b.o.typ === 'speed' ? 'speed' : b.o.typ === 'gross' ? 'gross' : 'jacht') : 'jacht', neu = modellBoot(typ, b.o.L * M, false); if (!neu) continue; neu.position.copy(b.j.position); neu.rotation.copy(b.j.rotation); szene.remove(b.j); szene.add(neu); b.j = neu } meinTyp = '' });
  // Bootsparty: Gäste tanzen dauerhaft an Deck, solange die Party läuft
  function partyAn(boot, typ) { const g = new THREE.Group(), n = { speed: 4, jacht: 8, gross: 14 }[typ] || 6, L = boot.userData.L || 8, y = boot.userData.deck || 1;
    for (let i = 0; i < n; i++) { const f = neueFigur(); einkleiden(f, { skin: ['#f6dcc8', '#8d5b3d', '#e4b997', '#f1d0b5', '#c48f6b'][i % 5], hair: ['#e6d3a3', '#141414', '#3a2416', '#a8562a'][i % 4], top: ['#ffffff', '#ff8fc7', '#16171a', '#e6c76a', '#2fe0d2'][i % 5], dress: 1, w: 1, frisur: ['welle', 'bob', 'glatt', 'locken'][i % 4] }); f.visible = true; f.scale.setScalar(1.1);
      const hinten = i < n * .55, u = (i % 4) / 3, breit = L * .045; /* nur freie Decks: Heck und Vorschiff, nie in den Aufbauten */ f.position.set(hinten ? -L * .47 + u * L * .04 : L * .33 + u * L * .06, y, (((i >> 1) % 3) - 1) * breit); f.userData.ph = i * .8; g.add(f) }
    boot.add(g); return g }
  return { weiter(t) {
    for (const b of liste) { const { o, j } = b; if (b.faehrt) { j.position.set(o.x * M, 0, o.y * M); j.rotation.y = o.v > 0 ? 0 : Math.PI } j.position.y = Math.sin(t * 1.3 + (o.ph || 0)) * .12; j.rotation.z = Math.sin(t * 1.1 + (o.ph || 0)) * .015; if (j.userData.radar) j.userData.radar.rotation.y = t * 2 }
    // Deine Jacht am Steg vom Yachtclub
    const besitz = WS.KATALOG.filter(i => i.kat === 'jacht' && ST.besitz[i.id]).sort((a, b) => b.rang - a.rang)[0]; const typ = besitz ? besitz.boot + '|' + besitz.id : '';
    if (typ !== meinTyp) { if (mein) szene.remove(mein); mein = null; meinTyp = typ; const bootTyp = besitz ? besitz.boot : ''; const o = S.find(x => x.k === 'meinejacht');
      if (besitz && o) { const lang = (besitz.laenge || LAENGE[bootTyp] || 3) * M; mein = modellBoot(bootTyp, lang, true, besitz) || jacht(lang, bootTyp === 'kat' || bootTyp === 'riva' ? 'jacht' : bootTyp, '#ff4fa3'); party = null; mein.position.set(...ankerplatz(o, mein)); mein.traverse(x => x.userData.meinBoot = true); const s = namensSchild('Deine ' + besitz.name, '#2fe0d2', '#062026'); s.scale.set(4.6 + lang * .08, 1.15 + lang * .02, 1); s.position.y = 6 + lang * .32; mein.add(s); veredeln(mein, lang, besitz); szene.add(mein) } }
    if (mein) { const an = typeof MEINBOOT !== 'undefined' && MEINBOOT.party; if (an && !party) party = partyAn(mein, meinTyp.split('|')[0]); if (party) { party.visible = !!an; if (an) party.children.forEach(f => f.position.y = (mein.userData.deck || 1) + tanzen(f, t, f.userData.ph)) } }
    // An Bord: das Boot fährt dorthin, wo du aufs Wasser getippt hast, und neigt sich bei voller Fahrt leicht
    if (mein) { const o = S.find(x => x.k === 'meinejacht'); if (MEINBOOT.an) { mein.position.set(MEINBOOT.x * M, Math.sin(t * 2) * .1, MEINBOOT.y * M); mein.rotation.y = -MEINBOOT.h; mein.rotation.z = MEINBOOT.ziel ? .05 : 0 } else { if (o) { const [ax, , az] = ankerplatz(o, mein); mein.position.set(ax, Math.sin(t * 1.2) * .12, az) } mein.rotation.y = 0; mein.rotation.z = 0 } } } } }

// ---------- Hubschrauber: drei, zwischen den Dächern der höchsten Häuser ----------
function hubschrauber(farbe) { const g = new THREE.Group(), lack = std(farbe, { metalness: .4, roughness: .25 });
  const rumpf = new THREE.Mesh(new THREE.CapsuleGeometry(.9, 2.2, 6, 14), lack); rumpf.rotation.z = Math.PI / 2; rumpf.position.y = 1.4; rumpf.castShadow = true; g.add(rumpf);
  const kanzel = new THREE.Mesh(new THREE.SphereGeometry(.85, 16, 12, 0, Math.PI), GLAS); kanzel.position.set(1.1, 1.5, 0); kanzel.rotation.y = -Math.PI / 2; g.add(kanzel);
  const heck = new THREE.Mesh(new THREE.CylinderGeometry(.12, .3, 4, 10), lack); heck.rotation.z = Math.PI / 2; heck.position.set(-3, 1.7, 0); g.add(heck);
  const flosse = new THREE.Mesh(new THREE.BoxGeometry(.7, 1, .08), lack); flosse.position.set(-4.8, 2.1, 0); g.add(flosse);
  for (const z of [-.75, .75]) { const k = new THREE.Mesh(new THREE.BoxGeometry(3, .08, .08), CHROM); k.position.set(0, .05, z); g.add(k); for (const x of [-.8, .8]) { const st = new THREE.Mesh(new THREE.BoxGeometry(.06, .55, .06), CHROM); st.position.set(x, .3, z * .8); g.add(st) } }
  const leit = new THREE.Mesh(new THREE.BoxGeometry(.5, .06, 1.6), lack); leit.position.set(-4.2, 1.75, 0); g.add(leit);
  const turbine = new THREE.Mesh(new THREE.CapsuleGeometry(.42, 1.2, 4, 12), lack); turbine.rotation.z = Math.PI / 2; turbine.position.set(-.3, 2.25, 0); g.add(turbine);
  for (const sz of [-1, 1]) { const fe = new THREE.Mesh(new THREE.BoxGeometry(1.3, .5, .05), GLAS); fe.position.set(.1, 1.6, sz * .88); g.add(fe); const zs = new THREE.Mesh(new THREE.BoxGeometry(3.2, .1, .04), CHROM); zs.position.set(-.3, 1.05, sz * .9); g.add(zs) }
  const nabe = new THREE.Mesh(new THREE.CylinderGeometry(.18, .22, .35, 10), CHROM); nabe.position.set(0, 2.5, 0); g.add(nabe);
  const scheinw = new THREE.Mesh(new THREE.SphereGeometry(.12, 8, 6), new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#fff3d6', emissiveIntensity: 2 })); scheinw.position.set(1.85, .9, 0); g.add(scheinw);
  const rotor = new THREE.Group(); rotor.position.y = 2.7; g.add(rotor); for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(5.6, .03, .22), std('#1b1c20', { metalness: .3 })); b.rotation.y = i * Math.PI / 2; b.position.set(Math.cos(i * Math.PI / 2) * 2.8, 0, -Math.sin(i * Math.PI / 2) * 2.8); rotor.add(b) }
  const heckRotor = new THREE.Mesh(new THREE.BoxGeometry(.06, 1.2, .14), std('#1b1c20')); heckRotor.position.set(-4.8, 2.1, .12); g.add(heckRotor);
  const blink = new THREE.Mesh(new THREE.SphereGeometry(.12, 8, 6), new THREE.MeshStandardMaterial({ color: '#ff2a2a', emissive: '#ff2a2a', emissiveIntensity: 3 })); blink.position.set(-4.8, 2.7, 0); g.add(blink);
  g.userData = { rotor, heckRotor, blink }; g.scale.setScalar(.8); return g }
export function helis(szene) { const pads = B.filter(b => b.drei && b.tow && !b.haupt).map(b => ({ x: (b.x + 2) * M, z: (b.y + 2) * M, y: b.drei.userData.hoehe + .6 })).sort((a, b) => b.y - a.y).slice(0, 7).filter(p => p.y < 40);
  if (pads.length < 2) return { weiter() {} }; const flieger = [['#ff4fa3', 'GLOW AIR'], ['#f4f4f2', 'NEWS'], ['#16171a', 'VIP']].map(([farbe], i) => { const h = hubschrauber(farbe); szene.add(h); return { h, a: i % pads.length, b: (i + 2) % pads.length, t: i * 4 } });
  return { weiter(t, dt) { for (const f of flieger) { const A = pads[f.a], Bp = pads[f.b], weg = Math.hypot(Bp.x - A.x, Bp.z - A.z), flug = weg / 16, ph = [5, 3, flug, 3], tot = ph.reduce((a, b) => a + b); f.t += dt;
    if (f.t > tot) { f.t = 0; f.a = f.b; do { f.b = Math.floor(Math.random() * pads.length) } while (f.b === f.a) }
    let tt = f.t, x = A.x, y = A.y, z = A.z, dreh = .15; const oben = Math.max(A.y, Bp.y) + 22;
    if (tt < ph[0]) dreh = tt > ph[0] - 1.5 ? 1 : .15; else if ((tt -= ph[0]) < ph[1]) { y = A.y + (oben - A.y) * (tt / ph[1]); dreh = 1 } else if ((tt -= ph[1]) < ph[2]) { const u = tt / ph[2], e = u * u * (3 - 2 * u); x = A.x + (Bp.x - A.x) * e; z = A.z + (Bp.z - A.z) * e; y = oben + Math.sin(u * Math.PI) * 8; dreh = 1 } else { tt -= ph[2]; x = Bp.x; z = Bp.z; y = oben + (Bp.y - oben) * (tt / ph[3]); dreh = 1 }
    f.h.position.set(x, y, z); f.h.rotation.y = -Math.atan2(Bp.z - A.z, Bp.x - A.x); f.h.rotation.z = dreh > .5 && f.t > ph[0] + ph[1] && f.t < ph[0] + ph[1] + ph[2] ? -.12 : 0;
    f.h.userData.rotor.rotation.y += dt * (dreh > .5 ? 26 : 3); f.h.userData.heckRotor.rotation.z += dt * 30 * dreh; f.h.userData.blink.visible = Math.sin(t * 6) > 0 } } } }
