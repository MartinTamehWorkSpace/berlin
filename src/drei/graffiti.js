// Berlin · graffiti.js · Berlin-Look für die ganze Stadt: Graffitis und Paste-ups im Erdgeschoss fast jedes Hauses (Tags, Bubble-Letters, Kiez-Sprüche),
// Nur Texturen und leuchtende Flächen, keine echten Lichter (Tempo-Regel aus CLAUDE.md).
import * as THREE from 'three';
import { M } from './haeuser.js?v=1795050641';

const SPRUECHE = ['BERLIN', 'KREUZBERG 36', 'SPREE', 'KIEZ', 'LOVE', 'TECHNO', 'NEUKÖLLN', 'FHAIN', '030', 'BÄM', 'NO SLEEP', 'SPÄTI', 'MITTE', 'WEDDING', 'KATER', 'ROSA', 'ARM ABER SEXY', 'U8', 'BOOM'];
const FARBEN = [['#ff2fa0', '#ffd36b'], ['#2fe0d2', '#16171a'], ['#ffd400', '#ff2a2a'], ['#9b5cff', '#2fe0d2'], ['#39d353', '#16171a'], ['#ff7a1a', '#ffffff'], ['#ffffff', '#ff2fa0']];
const zufall = s => () => (s = (s * 9301 + 49297) % 233280) / 233280;

/* Eine Graffiti-Wand als Textur: Grundputz, Tropfen, mehrere Tags übereinander, ab und zu ein Paste-up */
function wandTextur(nr) { const r = zufall(nr * 77 + 13), c = document.createElement('canvas'); c.width = 512; c.height = 160; const x = c.getContext('2d');
  x.fillStyle = ['#8d8a84', '#a19d95', '#6f6c68', '#b4ada2'][nr % 4]; x.fillRect(0, 0, 512, 160);
  for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(0,0,0,${r() * .08})`; x.fillRect(r() * 512, r() * 160, 2 + r() * 6, 2 + r() * 6) }
  for (let i = 0; i < 3 + Math.floor(r() * 3); i++) { const [f1, f2] = FARBEN[Math.floor(r() * FARBEN.length)], text = SPRUECHE[Math.floor(r() * SPRUECHE.length)], gr = 34 + r() * 46, px = r() * 380, py = 40 + r() * 100;
    x.save(); x.translate(px, py); x.rotate((r() - .5) * .35); x.font = `${r() > .5 ? 'italic ' : ''}900 ${gr}px Impact, Arial Black, sans-serif`; x.lineJoin = 'round';
    x.lineWidth = gr * .22; x.strokeStyle = f2; x.strokeText(text, 0, 0); x.fillStyle = f1; x.fillText(text, 0, 0);
    x.fillStyle = f1; for (let t = 0; t < 4; t++) x.fillRect(r() * gr * text.length * .5, 2, 2, 6 + r() * 26); x.restore() }
  if (r() > .5) { x.save(); x.translate(380 + r() * 80, 20 + r() * 40); x.rotate((r() - .5) * .2); x.fillStyle = '#f4efe6'; x.fillRect(0, 0, 70, 90); x.fillStyle = '#16171a'; x.font = '900 16px Arial'; x.fillText('TECHNO', 6, 30); x.fillText('SA 23H', 6, 54); x.fillStyle = '#ff2fa0'; x.fillRect(6, 64, 58, 16); x.restore() }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t }

/* Berlin grau: alles, was bis hier gebaut ist (Boden, Straßen, Häuser), verliert die Miami-Farben. Leuchtendes (Neon, Fenster nachts, Wasser) bleibt. */
function grauMachen(szene) { const fertig = new Set(), hsl = {};
  szene.traverse(o => { if (!o.isMesh || o.userData.spaceport) return; for (const m of [].concat(o.material)) { if (!m || fertig.has(m) || !m.color || m.isShaderMaterial) continue; fertig.add(m);
    if (m.emissive && m.emissiveIntensity > .5 && m.emissive.getHex()) continue; if (m.transparent && m.opacity < .6) continue;
    m.color.getHSL(hsl); if (o.userData.haus) m.color.setHSL(hsl.h, hsl.s * .45, hsl.l * .8); else m.color.setHSL(hsl.h, hsl.s * .22, Math.min(.72, hsl.l * .82 + .04)) } }) }
export function graffiti(szene) { grauMachen(szene); const g = new THREE.Group(); szene.add(g); const mats = Array.from({ length: 10 }, (_, i) => new THREE.MeshStandardMaterial({ map: wandTextur(i), roughness: .95, polygonOffset: true, polygonOffsetFactor: -2 }));
  const r = zufall(42); let n = 0; const breite = 4 * M - 1.2;
  for (const b of B) { if (b.haupt || !b.drei || b.meins === 'boutique') continue; if (r() < .18) continue;
    const cx = (b.x + 2) * M, cz = (b.y + 2) * M, halb = 2 * M - .3;
    for (const seite of [0, 1]) { if (r() < .25) continue; const w = new THREE.Mesh(new THREE.PlaneGeometry(breite, breite * 160 / 512), mats[(n++) % mats.length]);
      if (seite === 0) w.position.set(cx, breite * 80 / 512 + .15, cz + halb + .06); else { w.position.set(cx + halb + .06, breite * 80 / 512 + .15, cz); w.rotation.y = Math.PI / 2 } g.add(w) } }
  /* Brandenburger Tor im Park: sechs Säulenpaare, Attika, Quadriga in Grünspan */
  const tor = new THREE.Group(), sand = new THREE.MeshStandardMaterial({ color: '#cbbf9f', roughness: .85 }), gruen = new THREE.MeshStandardMaterial({ color: '#4f7f6c', metalness: .5, roughness: .5 });
  tor.position.set((PARK.x + 2) * M, 0, (PARK.y + 2) * M); tor.scale.setScalar(.68); g.add(tor); const st = (geo, mat, x, y, z) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; tor.add(o); return o };
  st(new THREE.BoxGeometry(17, .8, 4.6), sand, 0, .4, 0); for (let i = 0; i < 6; i++) for (const z of [-1.5, 1.5]) st(new THREE.CylinderGeometry(.5, .55, 9, 14), sand, -7.5 + i * 3, 5.3, z);
  st(new THREE.BoxGeometry(17.6, 1.6, 4.8), sand, 0, 10.6, 0); st(new THREE.BoxGeometry(12, 1.6, 3.6), sand, 0, 12.2, 0);
  const wagen = st(new THREE.BoxGeometry(2.4, 1.2, 1.6), gruen, 0, 13.6, 0); for (let i = 0; i < 4; i++) { st(new THREE.BoxGeometry(.5, 1.3, 1.6), gruen, -1.8 + i * 1.2, 13.7, -1.3); st(new THREE.BoxGeometry(.35, .7, .4), gruen, -1.8 + i * 1.2, 14.6, -1.95) }
  st(new THREE.CylinderGeometry(.18, .18, 2.2, 8), gruen, 0, 15.2, .2); st(new THREE.SphereGeometry(.45, 10, 8), gruen, 0, 16.5, .2);
  const bahn = sBahn(g); spaetis(g); ryotei(g, mats);
  return { weiter(dt = .016) { bahn(dt) } } }
/* S-Bahn auf dem Viadukt am Nordrand: Ziegelbögen, Gleis, rot-gelber Zug pendelt hin und her */
function sBahn(g) { const y0 = -2.6 * M, x0 = -34 * M, x1 = 58 * M, H = 6.5, ziegel = new THREE.MeshStandardMaterial({ color: '#7a4a3a', roughness: .95 }), dunkel = new THREE.MeshStandardMaterial({ color: '#2a2b2f', roughness: .7 });
  const deck = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 1.2, 5.5), ziegel); deck.position.set((x0 + x1) / 2, H, y0); deck.castShadow = deck.receiveShadow = true; g.add(deck);
  for (let x = x0 + 4; x < x1; x += 9) { const p = new THREE.Mesh(new THREE.BoxGeometry(2.2, H, 5.2), ziegel); p.position.set(x, H / 2, y0); p.castShadow = true; g.add(p) }
  for (const z of [-1, 1]) { const s = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, .15, .15), new THREE.MeshStandardMaterial({ color: '#9aa0a6', metalness: .9, roughness: .3 })); s.position.set((x0 + x1) / 2, H + .7, y0 + z * .75); g.add(s) }
  const zug = new THREE.Group(); zug.position.set(x0, H + .6, y0); g.add(zug); const rot = new THREE.MeshStandardMaterial({ color: '#b3201c', roughness: .45 }), gelb = new THREE.MeshStandardMaterial({ color: '#f2b705', roughness: .45 });
  const fenster = new THREE.MeshStandardMaterial({ color: '#1b2430', emissive: '#ffe7b0', emissiveIntensity: .25, roughness: .2 });
  for (let i = 0; i < 4; i++) { const w = new THREE.Group(); w.position.x = i * 9.6; zug.add(w); const unten = new THREE.Mesh(new THREE.BoxGeometry(9.2, 1.6, 3), rot); unten.position.y = .9; w.add(unten);
    const oben = new THREE.Mesh(new THREE.BoxGeometry(9.2, 1.4, 3), gelb); oben.position.y = 2.4; w.add(oben); for (const z of [-1.51, 1.51]) { const f = new THREE.Mesh(new THREE.BoxGeometry(8.4, .8, .05), fenster); f.position.set(0, 2.4, z); w.add(f) }
    const dach = new THREE.Mesh(new THREE.BoxGeometry(9.2, .3, 2.8), dunkel); dach.position.y = 3.2; w.add(dach) }
  const schild = new THREE.Mesh(new THREE.PlaneGeometry(4, 1.2), new THREE.MeshBasicMaterial({ map: schildTextur('S', 'S-BAHN · RINGBAHN'), toneMapped: false })); schild.position.set((x0 + x1) / 2, H + 2.6, y0 + 2.9); g.add(schild);
  let t = 0; return dt => { t += dt; const L = x1 - x0 - 40, u = (t * 9) % (2 * L), x = u < L ? u : 2 * L - u; zug.position.x = x0 + 2 + x } }
function schildTextur(gross, klein) { const c = document.createElement('canvas'); c.width = 512; c.height = 160; const x = c.getContext('2d'); x.fillStyle = '#0b6a2e'; x.fillRect(0, 0, 512, 160);
  x.fillStyle = '#fff'; x.beginPath(); x.arc(80, 80, 58, 0, 7); x.fill(); x.fillStyle = '#0b6a2e'; x.font = '900 92px Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(gross, 80, 86);
  x.fillStyle = '#fff'; x.font = '800 40px Arial'; x.textAlign = 'left'; x.fillText(klein, 160, 86); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t }
/* Spätis an Straßenecken: kleiner Kiosk mit Leuchtschild, Getränkekiste und Bierbank davor */
function spaetis(g) { const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d'); x.fillStyle = '#16171a'; x.fillRect(0, 0, 256, 64); x.font = '900 40px Arial'; x.textAlign = 'center'; x.fillStyle = '#ffd400'; x.shadowColor = '#ffd400'; x.shadowBlur = 12; x.fillText('SPÄTI 24/7', 128, 46);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const schild = new THREE.MeshBasicMaterial({ map: t, toneMapped: false }), wand = new THREE.MeshStandardMaterial({ color: '#5a5d61', roughness: .9 }), kiste = new THREE.MeshStandardMaterial({ color: '#1f6f3a', roughness: .7 }), holz = new THREE.MeshStandardMaterial({ color: '#8a6a4a' });
  const r = zufall(7); let n = 0; for (const b of B) { if (b.haupt || n >= 9 || r() < .55) continue; n++; const k = new THREE.Group(); k.position.set((b.x - .45) * M, 0, (b.y - .45) * M); g.add(k);
    const haus = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 2.4), wand); haus.position.y = 1.3; haus.castShadow = true; k.add(haus); const s = new THREE.Mesh(new THREE.PlaneGeometry(2.3, .6), schild); s.position.set(0, 2.25, 1.22); k.add(s);
    for (let i = 0; i < 3; i++) { const c2 = new THREE.Mesh(new THREE.BoxGeometry(.6, .35, .4), kiste); c2.position.set(-.8 + i * .5, .18 + (i === 2 ? .35 : 0), 1.6); k.add(c2) }
    const bank = new THREE.Mesh(new THREE.BoxGeometry(2, .1, .45), holz); bank.position.set(0, .5, 2.6); k.add(bank) } }
/* Ryotei 398 (Vorbild 893 Ryotei, Kantstraße): ganzes Erdgeschoss Spiegelglas, über und über mit Tags, dazu ein kleines rotes Neonschild auf rohem Holzbrett */
function ryotei(g, mats) { const b = B.find(x => x.title === 'Ryotei 398'); if (!b) return; const cx = (b.x + 2) * M, cz = (b.y + 2) * M, halb = 2 * M - .25, br = 4 * M - 1;
  const spiegel = new THREE.MeshStandardMaterial({ color: '#2a2e33', metalness: 1, roughness: .12 });
  for (const seite of [0, 1]) for (let lage = 0; lage < 3; lage++) { const w = new THREE.Mesh(new THREE.PlaneGeometry(br, 3.6), lage ? mats[(lage * 3 + seite) % mats.length] : spiegel); if (lage) { w.material = w.material.clone(); w.material.transparent = true; w.material.opacity = .85 }
    const off = .07 + lage * .02; if (seite) { w.position.set(cx + halb + off, 2.1, cz); w.rotation.y = Math.PI / 2 } else w.position.set(cx, 2.1, cz + halb + off); g.add(w) }
  const c = document.createElement('canvas'); c.width = 256; c.height = 96; const x = c.getContext('2d'); x.fillStyle = '#8a6a4a'; x.fillRect(0, 0, 256, 96); for (let i = 0; i < 12; i++) { x.fillStyle = 'rgba(0,0,0,.12)'; x.fillRect(0, i * 8, 256, 2) }
  x.font = '900 64px Arial'; x.textAlign = 'center'; x.shadowColor = '#ff2a2a'; x.shadowBlur = 18; x.fillStyle = '#ff5a4a'; x.fillText('398', 128, 70); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const brett = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .6), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); brett.position.set(cx + 3, 3.4, cz + halb + .2); g.add(brett) }
