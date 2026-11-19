// Berlin City 3D · leben.js · Menschen (P), Autos (CARS, dein Auto, Uber), Ampeln, Laternen, Palmen aus S. Alles folgt dem laufenden Spiel.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { M, box, std, neon } from './haeuser.js?v=1795067735';
import { MUSTER } from './texturen.js?v=1795067735';
import { tasche3d } from './taschen.js?v=1795067735';

const mat = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .6 }, o));

// ---------- Figuren: ein Pool, der immer den nahen Menschen zugeteilt wird ----------
const BEIN = new THREE.CylinderGeometry(.048, .032, .84, 8), ARM = new THREE.CylinderGeometry(.034, .027, .56, 8), HAND = new THREE.SphereGeometry(.035, 8, 6), ABSATZ = new THREE.BoxGeometry(.02, .09, .02), KOPF = new THREE.SphereGeometry(.12, 12, 10), HAAR = new THREE.SphereGeometry(.13, 12, 8, 0, Math.PI * 2, 0, Math.PI * .58), SCHUH = new THREE.BoxGeometry(.065, .04, .17), TASCHE = new THREE.PlaneGeometry(.52, .52);
const PROFIL = { kleid: [[.0, 1.5], [.14, 1.49], [.18, 1.42], [.16, 1.3], [.115, 1.13], [.16, 1.0], [.22, .82], [.27, .64], [.0, .64]], hose: [[.0, 1.5], [.15, 1.49], [.18, 1.4], [.15, 1.25], [.12, 1.12], [.16, .98], [.0, .98]] };
const AUGE = new THREE.SphereGeometry(.022, 10, 8), IRIS = new THREE.SphereGeometry(.013, 8, 6), BRAUE = new THREE.BoxGeometry(.042, .009, .01), LIPPE = new THREE.SphereGeometry(.02, 10, 6), ROUGE = new THREE.CircleGeometry(.02, 10);
const WEISS = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .3 }), ROUGE_M = new THREE.MeshBasicMaterial({ color: '#ff8fa3', transparent: true, opacity: .35 }), GOLD = new THREE.MeshStandardMaterial({ color: '#e6c76a', metalness: 1, roughness: .25 });
const BOB = new THREE.CylinderGeometry(.165, .175, .22, 16, 1, true, Math.PI * .28, Math.PI * 1.44), DUTT = new THREE.SphereGeometry(.075, 12, 10), LOCKEN = new THREE.IcosahedronGeometry(.21, 1), ZOPF = new THREE.CylinderGeometry(.035, .02, .4, 8);
const BRILLE = new THREE.BoxGeometry(.24, .05, .02), BRILLE_M = new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: .08, metalness: .5 }), KETTE = new THREE.TorusGeometry(.085, .011, 6, 20), CREOLE = new THREE.TorusGeometry(.028, .006, 6, 14);
const KLEID = new THREE.LatheGeometry(PROFIL.kleid.map(([r, y]) => new THREE.Vector2(r, y)), 20), OBERTEIL = new THREE.LatheGeometry(PROFIL.hose.map(([r, y]) => new THREE.Vector2(r, y)), 20), LANG = new THREE.CylinderGeometry(.12, .14, .42, 10, 1, true, Math.PI * .3, Math.PI * 1.4);
export function neueFigur() { const g = new THREE.Group(), m = { haut: mat('#e4b997', { roughness: .55 }), haar: mat('#3a2416', { roughness: .45 }), oben: mat('#ffffff', { side: THREE.DoubleSide }), unten: mat('#222'), tasche: mat('#111', { roughness: .35 }), schuh: mat('#111', { roughness: .3 }), auge: mat('#3a2a1e', { roughness: .2 }), lippe: mat('#c2185b', { roughness: .35 }) };
  const beine = []; for (const x of [-.09, .09]) { const b = new THREE.Group(); b.position.set(x, .86, 0); const bein = new THREE.Mesh(BEIN, m.unten); bein.position.y = -.41; b.add(bein); const s = new THREE.Mesh(SCHUH, m.schuh); s.position.set(0, -.82, .05); s.rotation.x = .35; b.add(s); const ab = new THREE.Mesh(ABSATZ, m.schuh); ab.position.set(0, -.84, -.03); b.add(ab); g.add(b); beine.push({ b, bein }) }
  const kleid = new THREE.Mesh(KLEID, m.oben), oberteil = new THREE.Mesh(OBERTEIL, m.oben); g.add(kleid, oberteil);
  // weicher runder Schatten unter den Füßen (günstig, bewusst nicht ganz realistisch)
  const schatten = new THREE.Mesh(SCHATTEN_GEO, SCHATTEN_M); schatten.rotation.x = -Math.PI / 2; schatten.position.y = .03; schatten.renderOrder = 1; g.add(schatten);
  const arme = []; for (const x of [-1, 1]) { const a = new THREE.Group(); a.position.set(x * .23, 1.42, 0); const arm = new THREE.Mesh(ARM, m.oben); arm.position.y = -.28; a.add(arm); const hd = new THREE.Mesh(HAND, m.haut); hd.position.y = -.58; a.add(hd); a.rotation.z = x * .1; g.add(a); arme.push(a) }
  const tasche = new THREE.Group(); tasche.position.set(.03, -.79, 0); tasche.rotation.y = Math.PI / 2; arme[1].add(tasche);
  const kopf = new THREE.Mesh(KOPF, m.haut); kopf.scale.set(.9, 1.08, .95); kopf.position.y = 1.68; g.add(kopf); const hals = new THREE.Mesh(new THREE.CylinderGeometry(.045, .05, .1, 6), m.haut); hals.position.y = 1.53; g.add(hals);
  // Gesicht: Augen mit Iris, Brauen, Lippen, etwas Rouge. Kopf etwas größer, damit man es aus der Stadtansicht erkennt.
  kopf.scale.set(1.12, 1.3, 1.15); kopf.position.y = 1.71; const ges = new THREE.Group(); ges.position.set(0, 1.71, .135); g.add(ges);
  for (const x of [-.045, .045]) { const w = new THREE.Mesh(AUGE, WEISS); w.position.set(x, .02, 0); w.scale.set(1.3, 1, .6); ges.add(w); const i = new THREE.Mesh(IRIS, m.auge); i.position.set(x, .02, .012); ges.add(i);
    const br = new THREE.Mesh(BRAUE, m.haar); br.position.set(x, .062, .004); br.rotation.z = x > 0 ? -.15 : .15; ges.add(br); const rg = new THREE.Mesh(ROUGE, ROUGE_M); rg.position.set(x * 1.45, -.035, -.012); ges.add(rg) }
  const lip = new THREE.Mesh(LIPPE, m.lippe); lip.position.set(0, -.062, .002); lip.scale.set(1.5, .55, .6); ges.add(lip);
  const haar = new THREE.Mesh(HAAR, m.haar); haar.position.y = 1.74; haar.scale.set(1.18, 1.18, 1.2); haar.rotation.x = -.3; g.add(haar);
  const lang = new THREE.Mesh(LANG, m.haar); lang.position.set(0, 1.5, -.03); lang.scale.set(1.15, 1.1, 1.15); g.add(lang);
  const bob = new THREE.Mesh(BOB, m.haar); bob.position.set(0, 1.66, -.01); g.add(bob);
  const dutt = new THREE.Mesh(DUTT, m.haar); dutt.position.set(0, 1.92, -.08); g.add(dutt);
  const locken = new THREE.Mesh(LOCKEN, m.haar); locken.position.set(0, 1.74, -.04); g.add(locken);
  const zopf = new THREE.Mesh(ZOPF, m.haar); zopf.position.set(0, 1.42, -.15); zopf.rotation.x = .25; g.add(zopf);
  const brille = new THREE.Mesh(BRILLE, BRILLE_M); brille.position.set(0, 1.735, .15); g.add(brille); /* Berliner Beanie */ const muetze = new THREE.Mesh(new THREE.SphereGeometry(.2, 12, 8, 0, Math.PI * 2, 0, Math.PI * .55), m.muetze = mat('#1c1d21', { roughness: .95 })); muetze.position.set(0, 1.84, 0); muetze.visible = false; g.add(muetze);
  const kette = new THREE.Mesh(KETTE, GOLD); kette.rotation.x = Math.PI / 2.3; kette.position.y = 1.5; g.add(kette);
  const creolen = new THREE.Group(); for (const x of [-.165, .165]) { const c = new THREE.Mesh(CREOLE, GOLD); c.position.set(x, 1.66, .01); c.rotation.y = Math.PI / 2; creolen.add(c) } g.add(creolen);
  g.traverse(o => { if (o.isMesh) o.castShadow = false }); g.userData = { m, beine, arme, kleid, oberteil, tasche, lang, bob, dutt, locken, zopf, haar, brille, kette, creolen, muetze, p: null }; g.visible = false; return g }
const TEX = {}, TASCHEN_TEX = {};
const SCHATTEN_GEO = new THREE.CircleGeometry(.42, 20), SCHATTEN_M = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const r = x.createRadialGradient(32, 32, 2, 32, 32, 32); r.addColorStop(0, 'rgba(0,0,0,.55)'); r.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = r; x.fillRect(0, 0, 64, 64);
  return new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }) })();
function taschenTextur(t, schluessel) { if (TASCHEN_TEX[schluessel]) return TASCHEN_TEX[schluessel]; const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  if (typeof taschenZeichnung === 'function') taschenZeichnung(x, t, 128, true); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return TASCHEN_TEX[schluessel] = tx }
export function einkleiden(f, p) { const { m, kleid, oberteil, tasche, lang, beine } = f.userData; m.haut.color.set(p.skin || '#e4b997'); m.haar.color.set(p.hair || '#3a2416');
  const muster = p.muster && MUSTER[p.muster] ? (TEX[p.muster] || (TEX[p.muster] = MUSTER[p.muster]())) : null; m.oben.map = muster; m.oben.color.set(muster ? '#ffffff' : (p.c1 || p.top || '#ffffff')); m.oben.needsUpdate = true;
  m.unten.color.set(p.dress ? (p.skin || '#e4b997') : (p.c2 || p.leg || '#222')); const kl = !!(p.dress || p.outfit === 'kleid'); kleid.visible = kl; oberteil.visible = !kl;
  const t = (p.bagK && FG.TASCHE[p.bagK]) || (p.tasche && FG.TASCHE[p.tasche]) || null; tasche.visible = !!(t || p.bag); const schl = p.bagK || p.tasche || p.bag || 'x'; if (tasche.userData.schl !== schl) { tasche.clear(); if (tasche.visible) tasche.add(tasche3d(t || { c: p.bag || '#111', d: '#c9a46b', w: 4.4, h: 3.2, f: 'klappe' }, schl)); tasche.userData.schl = schl } const fr = p.frisur || (p.w === 0 ? 'kurz' : ['welle', 'bob', 'dutt', 'kurz'][p.hs || 0]); const ud = f.userData;
  ud.lang.visible = fr === 'welle' || fr === 'glatt' || fr === 'zopf'; ud.bob.visible = fr === 'bob'; ud.dutt.visible = fr === 'dutt'; ud.locken.visible = fr === 'locken'; ud.zopf.visible = fr === 'zopf'; ud.haar.visible = fr !== 'locken';
  const acc = p.acc || []; ud.brille.visible = acc.includes('sonnenbrille'); ud.kette.visible = acc.includes('goldkette') || acc.includes('perlen'); ud.creolen.visible = acc.includes('creolen'); if (ud.muetze) { const mz = p.muetze ?? (p.echt || p.ctrl ? null : ((p.ph || 0) * 7 % 1 < .35 ? ['#1c1d21', '#3b3f2f', '#4a1e24', '#2c3a4f', '#c8a24a'][Math.floor((p.ph || 0) * 13) % 5] : null)); ud.muetze.visible = !!mz; if (mz) m.muetze.color.set(mz) }
  m.lippe.color.set(p.lippe || (p.w === 0 ? '#b07a6a' : '#c2185b')); m.auge.color.set(p.augen || '#3a2a1e') }
export function gehen(f, t, laeuft) { const { beine, arme } = f.userData, w = laeuft ? Math.sin(t * 7 + (f.userData.p ? f.userData.p.ph || 0 : 0)) * .45 : 0; beine[0].b.rotation.x = w; beine[1].b.rotation.x = -w; arme[0].rotation.x = -w * .6; arme[1].rotation.x = w * .25 }

// Tanzen: Arme hoch, Hüfte wippt, leichtes Drehen. ph verschiebt den Takt, damit nicht alle gleich tanzen.
export function tanzen(f, t, ph = 0) { const { beine, arme } = f.userData, b = Math.sin(t * 8 + ph), c = Math.sin(t * 4 + ph); arme[0].rotation.z = -2.3 - b * .35; arme[1].rotation.z = 2.3 + Math.sin(t * 8 + ph + 1.6) * .35; arme[0].rotation.x = arme[1].rotation.x = 0;
  beine[0].b.rotation.x = Math.max(0, b) * .35; beine[1].b.rotation.x = Math.max(0, -b) * .35; f.rotation.z = c * .06; return Math.abs(b) * .12 }
// Namensschild als Sprite
export function namensSchild(text, farbe = 'rgba(16,18,26,.85)', schrift = '#d8c39a') { const c = document.createElement('canvas'); c.width = 512; c.height = 128; const x = c.getContext('2d'); let gr = 50; x.font = `700 ${gr}px Inter, sans-serif`; while (x.measureText(text).width > 440 && gr > 18) { gr -= 2; x.font = `700 ${gr}px Inter, sans-serif` } /* Text passt immer ins Schild, nie abgeschnitten */
  const w = Math.min(500, x.measureText(text).width + 56); x.fillStyle = farbe; x.beginPath(); x.roundRect(256 - w / 2, 22, w, 80, 40); x.fill(); x.fillStyle = schrift; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 256, 63);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true })); s.scale.set(2.8, .7, 1); s.renderOrder = 30; return s }

export function menschen(szene) { const POOL = []; for (let i = 0; i < (innerWidth < 760 ? 45 : 70); i++) { const f = neueFigur(); szene.add(f); POOL.push(f) }
  const ich = neueFigur(); ich.scale.setScalar(1.35); ich.traverse(o => { if (o.isMesh) o.castShadow = true }); szene.add(ich); ich.visible = true; const du = namensSchild('DU', '#ff4fa3', '#ffffff'); du.position.y = 2.25; ich.add(du);
  const ring = new THREE.Mesh(new THREE.RingGeometry(.55, .78, 32), new THREE.MeshBasicMaterial({ color: '#ff4fa3', transparent: true, opacity: .9 })); ring.rotation.x = -Math.PI / 2; szene.add(ring);
  const NAMEN = new Map(); const vorher = new Map();
  let bild = 0, nah = [];
  const RINGE_ECHT = new Map();
  return { ich, ring, weiter(t, mitte, sichtweite) { bild++;
    // nächste Menschen zum Kamerapunkt bekommen eine Figur (Zuteilung alle 10 Bilder)
    if (bild % 10 === 1) nah = P.filter(p => p !== ICH && !p.drin && Math.abs(p.x - mitte.x) < sichtweite && Math.abs(p.y - mitte.y) < sichtweite).sort((a, b) => (Math.hypot(a.x - mitte.x, a.y - mitte.y)) - (Math.hypot(b.x - mitte.x, b.y - mitte.y))).slice(0, POOL.length);
    const frei = POOL.filter(f => !f.userData.p || !nah.includes(f.userData.p)); const vergeben = new Set(POOL.map(f => f.userData.p).filter(Boolean));
    for (const f of POOL) if (f.userData.p && !nah.includes(f.userData.p)) { f.userData.p = null; f.visible = false }
    for (const p of nah) { if (vergeben.has(p)) continue; const f = frei.pop(); if (!f) break; f.userData.p = p; einkleiden(f, p); f.visible = true; f.scale.setScalar(1.2 * (p.sz || 1)) }
    for (const f of POOL) { const p = f.userData.p; if (!p) continue; if (p.neuKleiden) { p.neuKleiden = 0; einkleiden(f, p) } const alt = vorher.get(p); const nx = p.x * M, nz = p.y * M; const dx = alt ? nx - alt[0] : 0, dz = alt ? nz - alt[1] : 0; vorher.set(p, [nx, nz]);
      f.position.set(nx, 0, nz); if (Math.abs(dx) + Math.abs(dz) > .001) f.rotation.y = Math.atan2(dx, dz); if ((p.tanzBis || 0) > Date.now()) f.position.y = tanzen(f, t, p.ph || 0); else gehen(f, t, Math.abs(dx) + Math.abs(dz) > .001);
      if (((p.star && p.name) || (p.nachbar && typeof AFFAERE !== 'undefined' && AFFAERE.an)) && p !== ICH) { let s = NAMEN.get(p); if (!s) { s = p.echt ? namensSchild('● LIVE · ' + p.name, 'rgba(24,160,96,.95)', '#ffffff') : p.nachbar ? namensSchild('💋 ' + p.nachbar, 'rgba(255,79,163,.92)', '#ffffff') : namensSchild(p.name); if (p.echt) s.scale.multiplyScalar(1.25); NAMEN.set(p, s); szene.add(s) } s.visible = true; s.position.set(nx, p.echt ? 3 : 2.7, nz) }
      // Echte Spielerinnen: grüner, pulsierender Ring am Boden, damit man sie unter den Bewohnern sofort erkennt
      if (p.echt) { let r = RINGE_ECHT.get(p); if (!r) { r = new THREE.Mesh(new THREE.RingGeometry(.55, .82, 32), new THREE.MeshBasicMaterial({ color: '#3ee08f', transparent: true })); r.rotation.x = -Math.PI / 2; RINGE_ECHT.set(p, r); szene.add(r) } r.visible = true; r.position.set(nx, .06, nz); r.material.opacity = .55 + Math.sin(t * 3 + p.ph) * .3 } }
    for (const [p, r] of RINGE_ECHT) if (!POOL.some(f => f.userData.p === p)) r.visible = false;
    for (const [p, s] of NAMEN) if (!POOL.some(f => f.userData.p === p)) s.visible = false;
    // du
    einkleidenIch(ich); const ax = ICH.x * M, az = ICH.y * M; const alt = vorher.get(ICH); const dx = alt ? ax - alt[0] : 0, dz = alt ? az - alt[1] : 0; vorher.set(ICH, [ax, az]);
    ich.position.set(ax, 0, az); if (Math.abs(dx) + Math.abs(dz) > .001) ich.rotation.y = Math.atan2(dx, dz); if (typeof PARTY !== 'undefined' && Date.now() < PARTY.tanzBis) ich.position.y = tanzen(ich, t); else { ich.rotation.z = 0; ich.userData.arme.forEach(x => x.rotation.z = 0); gehen(ich, t, !ICH.idle) } ich.visible = !ICH.faehrt && !MEINBOOT.an; ring.visible = !ICH.faehrt; ring.position.set(ax, .06, az); ring.material.opacity = .6 + Math.sin(t * 3) * .3 } } }
let ichStand = '';
function einkleidenIch(f) { const s = [ICH.skin, ICH.hair, ICH.top, ICH.leg, ICH.c1, ICH.c2, ICH.dress, ICH.bagK, ICH.muster, ICH.frisur, (ICH.acc || []).join()].join('|'); if (s === ichStand) return; ichStand = s; einkleiden(f, ICH) }

// ---------- Autos ----------
const STUFE = { twinga: 1, s5: 2, g63: 3, furioso: 4, roadster: 5, uber: 2 }; const MODELLE = {};
// Alle fünf Modelle gleichzeitig laden. Gezeichnet wird erst, wenn alle da sind, sonst bekäme ein Auto dauerhaft ein falsches Modell.
let MODELLE_FERTIG = false;
export async function autosLaden() { const lader = new GLTFLoader();
  await Promise.all([1, 2, 3, 4, 5].map(async i => { try { const b64 = await (await fetch(`autos/3d/auto${i}.txt`)).text(); const roh = Uint8Array.from(atob(b64.trim()), c => c.charCodeAt(0)); const gltf = await lader.parseAsync(roh.buffer, '');
      gltf.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; if (o.material) o.material.envMapIntensity = 1.4 } }); MODELLE[i] = gltf.scene } catch (e) { console.warn('Automodell', i, e) } }));
  MODELLE_FERTIG = true }
// Lackfarben je Stufe: Miami-bunt statt grau. Dein eigenes Auto behält seine Originalfarbe.
const LACKE = { 1: ['#c8102e', '#1f4fa0', '#ff7eb6', '#f4efe6', '#ffd400', '#2fe0d2'], 2: ['#f4f5f7', '#111214', '#1d3557', '#8fe3f0', '#b3202a'], 3: ['#0d0d10', '#f2efe8', '#c9b48a', '#3a4a33'], 4: ['#ec96be', '#39d353', '#ffd400', '#ff6a00'], 5: [] };
const LICHTMAT = new Set(); let lackZaehler = 0;
function neuesAuto(lvl, eigen) { const g = new THREE.Group(); const m = MODELLE[lvl] || MODELLE[2] || MODELLE[1];
  if (m) { const k = m.clone(); const pal = LACKE[lvl] || []; const farbe = !eigen && pal.length ? pal[lackZaehler++ % pal.length] : null;
    k.traverse(o => { if (!o.material) return; const n = o.material.name || ''; if (/Scheinwerfer|Ruecklicht|Blinker/.test(n)) LICHTMAT.add(o.material); if (farbe && /^Lack/.test(n)) { o.material = o.material.clone(); o.material.color.set(farbe) } }); g.add(k) }
  else box(4.4, .8, 1.9, mat('#ff4fa3', { metalness: .6, roughness: .25 }), 0, .35, 0, g);
  g.userData.lvl = lvl; return g }
// Für geparkte Autos an Orten wie der Arena: Modell erst nach dem Laden, sonst null
export const parkAuto = lvl => MODELLE_FERTIG ? neuesAuto(lvl) : null;
const richtungZuWinkel = r => ({ '90': 0, '270': Math.PI, '0': -Math.PI / 2, '180': Math.PI / 2 })[r] ?? 0;
export function verkehr(szene) { const stadt = new Map(); let mein = null, ruf = null, schild = null, uber = null; const lichter = [];
  return { weiter(nacht) { if (!MODELLE_FERTIG) return;
    for (const c of CARS) { let a = stadt.get(c); if (!a) { a = neuesAuto(c.lvl); szene.add(a); stadt.set(c, a) }
      a.position.set(c.x * M, (c.lift || 0) * .09, c.y * M); a.rotation.y = c.vert ? (c.v > 0 ? -Math.PI / 2 : Math.PI / 2) : (c.v > 0 ? 0 : Math.PI) }
    // Dein Auto: geparkt, gerufen oder du fährst. Uber nutzt das Modell der Stufe 2.
    const auto = ICH.auto; const lvl = auto ? STUFE[auto.id] || 2 : 0;
    if (lvl && (!mein || mein.userData.lvl !== lvl)) { if (mein) szene.remove(mein); mein = neuesAuto(lvl, true); szene.add(mein); mein.traverse(o => o.userData.meinAuto = true);
      if (schild) mein.remove(schild); schild = namensSchild('Dein ' + auto.name, '#ff4fa3', '#ffffff'); schild.scale.set(4.2, 1.05, 1); schild.position.y = 2.6; mein.add(schild) }
    if (mein) { mein.visible = !!lvl && !RUF; if (ICH.faehrt && !UBER.faehrt) { mein.position.set(ICH.x * M, (ICH.lift || 0) * (ICH.flugStart ? .9 : .09), ICH.y * M); mein.rotation.y = richtungZuWinkel(ICH.richtung || '90'); schild.visible = false }
      else { mein.position.set(PARK_ICH.x * M, 0, PARK_ICH.y * M); mein.rotation.y = 0; schild.visible = !UBER.faehrt } }
    if (RUF && ICH.auto) { if (!ruf || ruf.userData.lvl !== lvl) { if (ruf) szene.remove(ruf); ruf = neuesAuto(lvl, true); szene.add(ruf) } ruf.visible = true; ruf.position.set(RUF.x * M, (RUF.lift || 0) * .09, RUF.y * M); ruf.rotation.y = richtungZuWinkel(RUF.r) } else if (ruf) ruf.visible = false;
    // Uber: schwarzer Wagen, fährt erst zu dir, dann mit dir zum Ziel
    const uw = UBER.wagen, uf = UBER.faehrt && ICH.faehrt; if (uw || uf) { if (!uber) { uber = neuesAuto(2, true); uber.traverse(o => { if (o.material && /^Lack/.test(o.material.name || '')) { o.material = o.material.clone(); o.material.color.set('#0b0b0e'); o.material.metalness = .7; o.material.roughness = .2 } }); const us = namensSchild('Uber', '#16171a', '#ffffff'); us.scale.set(2.4, .6, 1); us.position.y = 2.4; uber.add(us); szene.add(uber) }
      uber.visible = true; if (uw) { uber.position.set(uw.x * M, 0, uw.y * M); uber.rotation.y = richtungZuWinkel(uw.r) } else { uber.position.set(ICH.x * M, 0, ICH.y * M); uber.rotation.y = richtungZuWinkel(ICH.richtung || '90') } } else if (uber) uber.visible = false;
    for (const m of LICHTMAT) { if (m.userData.basis == null) m.userData.basis = m.emissiveIntensity || 1; m.emissiveIntensity = m.userData.basis * (.25 + nacht * 1.6) } }, meinAuto: () => mein } }

// ---------- Ampeln, Laternen, Palmen, Bäume, Brunnen aus S ----------
const MAST = std('#2a2b30', { metalness: .6, roughness: .4 });
export function stadtmoebel(szene) { const AMP = [], LAMPEN = [], LAMPENFARBE = [];
  for (const o of S) {
    if (o.k === 'ampel') { const g = new THREE.Group(); g.position.set(o.x * M, 0, o.y * M); szene.add(g); box(.16, 4.2, .16, MAST, 0, 0, 0, g); const k = { kx: o.kx, ky: o.ky, l: {} };
      for (const [i, ax] of [[0, 'y'], [1, 'x']]) { const kg = new THREE.Group(); kg.position.set(0, 3.6, 0); kg.rotation.y = ax === 'y' ? Math.PI / 4 : -Math.PI / 4; g.add(kg); box(.45, 1.2, .35, std('#16171a'), 0, 0, i ? .3 : -.3, kg);
        k.l[ax] = {}; for (const [j, c, f] of [[0, 'r', '#ff3b3b'], [1, 'y', '#ffc93b'], [2, 'g', '#3bff7a']]) { const m = new THREE.MeshStandardMaterial({ color: '#222', emissive: f, emissiveIntensity: 0 }); const s = new THREE.Mesh(new THREE.SphereGeometry(.12, 8, 6), m); s.position.set(0, 1.0 - j * .34, (i ? .3 : -.3) + (i ? .19 : -.19)); kg.add(s); k.l[ax][c] = m } }
      AMP.push(k) }
    if (o.k === 'lamp') { /* Berliner Gaslaterne: dunkelgrüner Gussmast, Laternenkopf mit Glas und Dach */ const GRUEN = std('#1f3a2e', { metalness: .5, roughness: .5 }); box(.32, .5, .32, GRUEN, o.x * M, 0, o.y * M, szene); box(.12, 4.6, .12, GRUEN, o.x * M, .5, o.y * M, szene); box(.5, .08, .5, GRUEN, o.x * M, 5.05, o.y * M, szene);
      const dach = new THREE.Mesh(new THREE.ConeGeometry(.42, .35, 4), GRUEN); dach.rotation.y = Math.PI / 4; dach.position.set(o.x * M, 5.85, o.y * M); szene.add(dach); const kopf = new THREE.Mesh(new THREE.CylinderGeometry(.3, .2, .55, 4), neon('#ffd9a0', 4)); kopf.rotation.y = Math.PI / 4; kopf.position.set(o.x * M, 5.4, o.y * M); szene.add(kopf); LAMPEN.push(kopf.position); LAMPENFARBE.push(o.c || '#ffd9a0') }
    if (o.k === 'fount') { const f = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.6, .6, 32), std('#f4efe6')); f.position.set(o.x * M, .3, o.y * M); szene.add(f); const w = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.1, .1, 32), new THREE.MeshPhysicalMaterial({ color: '#5fd0e0', roughness: .05, clearcoat: 1 })); w.position.set(o.x * M, .62, o.y * M); szene.add(w);
      const s = new THREE.Mesh(new THREE.CylinderGeometry(.15, .5, 3, 12), new THREE.MeshStandardMaterial({ color: '#dff6ff', transparent: true, opacity: .6, emissive: '#bff0ff', emissiveIntensity: .3 })); s.position.set(o.x * M, 2, o.y * M); szene.add(s) } }
  // Palmen und Bäume als Instanzen: Stamm und Wedel
  /* Berlin (Martin 19.11.2026): keine Palmen mehr, überall Linden wie Unter den Linden */ const palmen = [], baeume = S.filter(o => o.k === 'tree' || o.k === 'palm');
  const stamm = new THREE.InstancedMesh(new THREE.CylinderGeometry(.16, .26, 1, 7), std('#8a6a4a', { roughness: .95 }), palmen.length);
  const blattGeo = (() => { const geo = new THREE.PlaneGeometry(.45, 2.1, 1, 6); const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i) + 1.05, w = Math.sin(y / 2.1 * Math.PI) * .9 + .1; p.setX(i, p.getX(i) * w); p.setZ(i, -Math.pow(y / 2.1, 2) * 1.1); p.setY(i, y) } geo.computeVertexNormals(); return geo })();
  const wedel = new THREE.InstancedMesh(blattGeo, new THREE.MeshStandardMaterial({ color: '#3f8f4a', roughness: .8, side: THREE.DoubleSide }), palmen.length * 8); const o3 = new THREE.Object3D(); let w = 0;
  palmen.forEach((o, i) => { const h = 6.5 * (o.s || 1); o3.position.set(o.x * M, h / 2, o.y * M); o3.rotation.set(0, 0, 0); o3.scale.set(1, h, 1); o3.updateMatrix(); stamm.setMatrixAt(i, o3.matrix);
    for (let k = 0; k < 8; k++) { o3.position.set(o.x * M, h, o.y * M); o3.scale.set(1, 1, 1); o3.rotation.set(0, 0, 0); o3.rotation.order = 'YXZ'; o3.rotation.y = k / 8 * Math.PI * 2 + i; o3.rotation.x = -1.05; o3.updateMatrix(); wedel.setMatrixAt(w++, o3.matrix) } });
  stamm.castShadow = wedel.castShadow = true; szene.add(stamm, wedel);
  const krone = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1.9, 2), std('#ffffff', { roughness: .95, flatShading: true }), baeume.length), st2 = new THREE.InstancedMesh(new THREE.CylinderGeometry(.16, .24, 2.6, 6), std('#3d352e', { roughness: .95 }), baeume.length);
  const LAUB = ['#5c6b3c', '#6f7440', '#8a7a3a', '#4f5e38', '#94692f'].map(c => new THREE.Color(c)); /* Linden im Herbst: Oliv, Senf, Rost */
  baeume.forEach((o, i) => { o3.rotation.set(0, 0, 0); o3.scale.setScalar(o.s || 1); o3.position.set(o.x * M, 1.2, o.y * M); o3.updateMatrix(); st2.setMatrixAt(i, o3.matrix); o3.position.set(o.x * M, 3.2 * (o.s || 1), o.y * M); o3.updateMatrix(); o3.scale.set((o.s || 1) * .72, (o.s || 1) * .92, (o.s || 1) * .72); o3.updateMatrix(); krone.setMatrixAt(i, o3.matrix); krone.setColorAt(i, LAUB[i % LAUB.length]) });
  krone.castShadow = st2.castShadow = true; szene.add(krone, st2);
  return { LAMPEN, LAMPENFARBE, weiter() { for (const k of AMP) for (const ax of ['x', 'y']) { const z = ampel(k.kx, k.ky, ax); for (const c of ['r', 'y', 'g']) k.l[ax][c].emissiveIntensity = z === c ? 3 : 0 } } } }
