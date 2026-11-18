// Glow City 3D · flughafen.js · Glow Airport östlich der Stadt: Zufahrt, Vorfeld, Landebahn mit Befeuerung, Hangar, Tower und vier Glowstream-Jets.
// Gekaufte Jets stehen schwarz mit Goldstreifen, die anderen weiß mit Preisschild. Antippen deines Jets öffnet die Flugziele (src/spiel/jet.js).
import * as THREE from 'three';
import { M } from './haeuser.js';
import { namensSchild } from './leben.js';
import { parkplatz } from './parkplatz.js';
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .5 }, o));
const ASPHALT = std('#2a2c31', { roughness: .9 }), BETON = std('#c9c6c0', { roughness: .95 }), WEISS = std('#f6f6f4', { roughness: .25, metalness: .2 }), SCHWARZ = std('#0d0e12', { roughness: .2, metalness: .5 }),
  GOLD = std('#d9b44a', { roughness: .25, metalness: .8 }), GLAS = std('#0c1a26', { roughness: .05, metalness: .6 }), CHROM = std('#e8ecf0', { roughness: .15, metalness: 1 });
const BEFEUERUNG = new THREE.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffd59a', emissiveIntensity: .2 });
const BAHNBELAG = std('#6c6f76', { roughness: .85 }), LAUF = [0, 1, 2, 3].map(() => new THREE.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffe2a8', emissiveIntensity: .2 })), MITTE = new THREE.MeshStandardMaterial({ color: '#c9ffd9', emissive: '#3ee08f', emissiveIntensity: .2 });
function flach(w, d, mat, x, z, y, g) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; g.add(m); return m }
function kiste(w, h, d, mat, x, y, z, g) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y + h / 2, z); m.castShadow = m.receiveShadow = true; g.add(m); return m }
// Businessjet: gedrehter Rumpf aus einem Profil, gepfeilte Flügel mit Winglets, T-Leitwerk, zwei Hecktriebwerke, Fensterreihe
export function jetModell(L, lack, streifen) { const g = new THREE.Group(), r = L * .055;
  const profil = [[0, -L / 2], [r * .5, -L / 2 + .2], [r * .9, -L * .42], [r, -L * .25], [r, L * .2], [r * .85, L * .36], [r * .45, L * .46], [0, L / 2]].map(([a, b]) => new THREE.Vector2(a, b));
  const rumpf = new THREE.Mesh(new THREE.LatheGeometry(profil, 28), lack); rumpf.rotation.z = -Math.PI / 2; rumpf.position.y = r * 1.6; rumpf.castShadow = true; g.add(rumpf);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.005, r * 1.005, L * .62, 28, 1, true), streifen); band.rotation.z = Math.PI / 2; band.position.set(-L * .02, r * 1.6, 0); band.scale.set(1, 1, 1); g.add(band); band.geometry = new THREE.CylinderGeometry(r * 1.006, r * 1.006, L * .62, 28, 1, true, Math.PI * .45, Math.PI * .1);
  for (const s of [-1, 1]) for (let i = 0; i < 6; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(L * .03, r * .35, .05), GLAS); f.position.set(L * .22 - i * L * .07, r * 1.85, s * r * .98); g.add(f) }
  const scheibe = new THREE.Mesh(new THREE.SphereGeometry(r * .82, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2.4), GLAS); scheibe.rotation.z = -Math.PI / 2.6; scheibe.position.set(L * .38, r * 1.75, 0); g.add(scheibe);
  const fl = new THREE.Shape(); fl.moveTo(0, 0); fl.lineTo(-L * .16, L * .36); fl.lineTo(-L * .25, L * .36); fl.lineTo(-L * .2, 0); fl.closePath();
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.ExtrudeGeometry(fl, { depth: r * .18, bevelEnabled: false }), lack); w.rotation.x = s > 0 ? Math.PI / 2 : -Math.PI / 2; w.position.set(L * .08, r * 1.15, s * r * .5); w.castShadow = true; g.add(w);
    const wl = new THREE.Mesh(new THREE.BoxGeometry(L * .08, L * .07, .08), streifen); wl.position.set(-L * .12, r * 1.15 + L * .035, s * (L * .36 + r * .5)); wl.rotation.z = -.4; g.add(wl);
    const tw = new THREE.Mesh(new THREE.CapsuleGeometry(r * .42, L * .12, 6, 14), lack); tw.rotation.z = Math.PI / 2; tw.position.set(-L * .3, r * 2.1, s * r * 1.5); tw.castShadow = true; g.add(tw);
    const ein = new THREE.Mesh(new THREE.CylinderGeometry(r * .32, r * .32, .05, 16), std('#16171a')); ein.rotation.z = Math.PI / 2; ein.position.set(-L * .3 + L * .075, r * 2.1, s * r * 1.5); g.add(ein) }
  const fin = new THREE.Shape(); fin.moveTo(0, 0); fin.lineTo(-L * .1, L * .17); fin.lineTo(-L * .17, L * .17); fin.lineTo(-L * .15, 0); fin.closePath(); const fm = new THREE.Mesh(new THREE.ExtrudeGeometry(fin, { depth: .12, bevelEnabled: false }), lack); fm.position.set(-L * .33, r * 2.2, -.06); g.add(fm);
  const hs = new THREE.Mesh(new THREE.BoxGeometry(L * .09, .1, L * .3), lack); hs.position.set(-L * .46, r * 2.2 + L * .17, 0); g.add(hs); const hk = new THREE.Mesh(new THREE.BoxGeometry(L * .1, .12, .14), streifen); hk.position.set(-L * .44, r * 2.2 + L * .12, 0); g.add(hk);
  for (const [x, z] of [[L * .3, 0], [-L * .02, -r * 1.2], [-L * .02, r * 1.2]]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, r * 1.2, 6), CHROM); b.position.set(x, r * .6, z); g.add(b); const rad = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .16, 12), std('#16171a')); rad.rotation.x = Math.PI / 2; rad.position.set(x, .22, z); g.add(rad) }
  return g }
const PLAETZE = [[60.5, 18.5], [60.5, 23], [60.5, 27.5], [60.5, 32]], BAHN = [66, 36]; // Vorfeld vor dem Tower, Startposition am Bahnende
const LAENGE = { light: 15, mid: 19, long: 25, ultra: 30 };
export function flughafen(szene) { const g = new THREE.Group(); szene.add(g);
  flach(14 * M, 2 * M, ASPHALT, 49 * M, 17 * M, .03, g); // Zufahrt von der Stadt
  flach(14 * M, 13 * M, BETON, 56 * M, 24.5 * M, .02, g); // Vorfeld
  flach(5 * M, 46 * M, BAHNBELAG, 66 * M, 18 * M, .03, g); // Landebahn hellgrau, damit schwarze Jets sich abheben
  flach(2 * M, 2 * M, BAHNBELAG, 63 * M, 24 * M, .025, g); // Rollweg
  const strich = std('#f4f1ea'); for (let y = -3; y < 40; y += 3) flach(.4, 1.6 * M * .5, strich, 66 * M, y * M, .045, g); for (const x of [63.8, 68.2]) flach(.3, 46 * M, strich, x * M, 18 * M, .045, g);
  // Befeuerung: Randlichter in 4 Phasen (beim Start laufen sie als Lichterkette Richtung Abflug), grüne Mittellinie, Flutlichtmasten am Vorfeld, Drehfeuer auf dem Tower
  let n = 0; for (let y = 40; y >= -4; y -= 2, n++) { for (const x of [63.6, 68.4]) kiste(.35, .35, .35, LAUF[n % 4], x * M, 0, y * M, g); kiste(.25, .12, .25, MITTE, 66 * M, .03, y * M + 1.5, g) }
  const FLUT = []; for (const z of [12, 22, 32]) { kiste(.4, 13, .4, CHROM, 61.2 * M, 0, z * M, g); const kopf = new THREE.Mesh(new THREE.BoxGeometry(2.2, .5, .9), new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#fff4e0', emissiveIntensity: .3 })); kopf.position.set(61.2 * M, 13.2, z * M); kopf.rotation.y = .3; g.add(kopf);
    FLUT.push({ kopf }) }
  // Hangar als Halbtonne, Tower mit Glaskanzel
  const h = new THREE.Mesh(new THREE.CylinderGeometry(3 * M, 3 * M, 7 * M, 32, 1, false, 0, Math.PI), WEISS); h.rotation.z = Math.PI / 2; h.rotation.y = Math.PI / 2; h.position.set(54.5 * M, 0, 25 * M); h.castShadow = true; g.add(h);
  kiste(.4, 3 * M * .9, 7 * M, SCHWARZ, 51.4 * M, 0, 25 * M, g);
  const t = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 22, 20), WEISS); t.position.set(60 * M, 11, 13.5 * M); g.add(t); const kab = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 2.6, 3, 20), GLAS); kab.position.set(60 * M, 23.5, 13.5 * M); g.add(kab); const dach = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, .5, 20), WEISS); dach.position.set(60 * M, 25.2, 13.5 * M); g.add(dach);
  const DREH = new THREE.Group(); DREH.position.set(60 * M, 26, 13.5 * M); g.add(DREH); for (const [f, r] of [['#3ee08f', 0], ['#ffffff', Math.PI]]) { const k = new THREE.Mesh(new THREE.ConeGeometry(5, 40, 20, 1, true), new THREE.MeshBasicMaterial({ color: f, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); k.rotation.z = Math.PI / 2; k.position.x = 20; const h = new THREE.Group(); h.rotation.y = r; h.add(k); DREH.add(h) }
  // Jets: einer je Typ, eigene schwarz mit Gold
  const jets = WS.KATALOG.filter(i => i.kat === 'jet').sort((a, b) => a.rang - b.rang), modelle = {}; let stand = '';
  function aufstellen() { for (const k in modelle) { g.remove(modelle[k]); delete modelle[k] }
    jets.forEach((it, i) => { const mein = !!ST.besitz[it.id], j = jetModell(LAENGE[it.jet], mein ? SCHWARZ : WEISS, mein ? GOLD : std('#1d2b44', { metalness: .4, roughness: .3 })), [x, y] = PLAETZE[i];
      const [sx, sy] = mein ? BAHN : [x, y]; j.position.set(sx * M, 0, sy * M); j.rotation.y = mein ? Math.PI / 2 : 0; /* Nase weg vom Hangar, zur Bahn hin */ j.userData.platz = [sx, sy]; const sch = namensSchild(mein ? `Dein ${it.name}` : `${it.name} · ${euro(it.preis)}`, mein ? '#16171a' : 'rgba(16,18,26,.85)', mein ? '#e6c76a' : '#ffffff'); sch.scale.set(5.5, 1.4, 1); sch.position.y = 8; j.add(sch);
      j.traverse(o => o.userData.jet = it.id); g.add(j); modelle[it.id] = j; if (mein) { j.add(triebwerkLeuchten(LAENGE[it.jet])); } }) }
  let flugT = -1, flugId = null, T_ = 0; const SPUR = [], RAUCH = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .5, depthWrite: false });
  // Kondensstreifen hinter den Triebwerken
  function streifen(j, dt) { if (Math.random() > dt * 30) return; const m = new THREE.Mesh(new THREE.SphereGeometry(.8, 8, 6), RAUCH.clone()); m.position.copy(j.position).add(new THREE.Vector3(-12, 3, 0).applyQuaternion(j.quaternion)); g.add(m); SPUR.push({ m, leben: 6 }) }
  // Triebwerksglut und Blitzlichter am eigenen Jet
  function triebwerkLeuchten(L) { const grp = new THREE.Group(), glut = []; for (const s of [-1, 1]) { const m = new THREE.Mesh(new THREE.ConeGeometry(.5, 3, 12, 1, true), new THREE.MeshBasicMaterial({ color: '#ffb36b', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); m.rotation.z = Math.PI / 2; m.position.set(-L * .3 - L * .1, L * .055 * 2.1, s * L * .055 * 1.5); grp.add(m); glut.push(m) }
    for (const [x, z, f] of [[-L * .5, 0, '#ffffff'], [-L * .12, L * .42, '#ff3b3b'], [-L * .12, -L * .42, '#3bff7a']]) { const b = new THREE.Mesh(new THREE.SphereGeometry(.18, 8, 6), new THREE.MeshBasicMaterial({ color: f })); b.position.set(x, L * .1, z); b.userData.blitz = true; grp.add(b) }
    grp.userData.glut = glut; queueMicrotask(() => { if (grp.parent) grp.parent.userData.glut = glut }); return grp }
  // Parkplätze am Terminal: an der Zufahrt und vor dem Hangar
  const PARK = [parkplatz(g, 50 * M, 11 * M, { buchten: 12, schild: '🅿️ Glow Airport Terminal' }), parkplatz(g, 49 * M, 36 * M, { buchten: 8, drehung: Math.PI / 2, schild: '🅿️ Crew', belegt: .5 })];
  return { flugZeit: () => flugT, flugPunkt() { const j = flugT >= 0 && flugId && modelle[flugId]; return j ? j.position : null }, weiter(nacht, dt) { for (const p of PARK) p.weiter(nacht); const s = jets.map(i => ST.besitz[i.id] ? 1 : 0).join(''); if (s !== stand) { stand = s; aufstellen() } BEFEUERUNG.emissiveIntensity = .2 + nacht * 3; const startet = flugT >= 0, phase = Math.floor(T_ * 14) % 4;
    LAUF.forEach((m, i) => m.emissiveIntensity = startet ? (i === phase ? 9 : 1.2) : .3 + nacht * 3); MITTE.emissiveIntensity = startet ? 3 + Math.sin(T_ * 20) * 1.5 : .2 + nacht * 2.2;
    for (const f of FLUT) { f.kopf.material.emissiveIntensity = .3 + nacht * 3 + (startet ? 2 : 0) }
    DREH.rotation.y = T_ * 1.6; DREH.traverse(o => { if (o.material && o.material.blending === THREE.AdditiveBlending) o.material.opacity = nacht * .12 + (startet ? .1 : 0) });
    // Abflug: zum Rollweg, auf die Bahn, beschleunigen und steigen; danach steht der Jet wieder auf seinem Platz
    if (typeof JETFLUG !== 'undefined' && JETFLUG.start && JETFLUG.id !== flugId) { flugId = JETFLUG.id; flugT = 0 } const j = flugId && modelle[flugId];
    if (j && flugT >= 0) { flugT += dt; const [px, py] = j.userData.platz; let x = px, y = py, z = 0, rot = Math.PI / 2; const glut = j.userData.glut;
      if (flugT < 2) { if (glut) glut.forEach(m => m.material.opacity = flugT / 2) }
      else if (flugT < 12) { const u = (flugT - 2) / 10; y = py - u * u * 44; z = u > .5 ? (u - .5) * 2 * 60 : 0; if (z > 1) streifen(j, dt) }
      else if (flugT < 16) { y = py - 44 - (flugT - 12) * 12; z = 60 + (flugT - 12) * 18; streifen(j, dt) } else { flugT = -1; flugId = null; JETFLUG.start = 0; if (glut) glut.forEach(m => m.material.opacity = 0) }
      j.position.set(x * M, z, y * M); j.rotation.y = rot; j.rotation.z = z > 0 ? -.12 : 0 }
    for (let i = SPUR.length - 1; i >= 0; i--) { const p = SPUR[i]; p.leben -= dt; p.m.scale.multiplyScalar(1 + dt * .8); p.m.material.opacity = Math.max(0, p.leben / 6) * .5; if (p.leben <= 0) { g.remove(p.m); SPUR.splice(i, 1) } }
    // Blitzer und Positionslichter an allen Jets
    const blitz = Math.sin(T_ * 7) > .85; T_ += dt; for (const k in modelle) modelle[k].traverse(o => { if (o.userData.blitz) o.visible = blitz }) } } }
