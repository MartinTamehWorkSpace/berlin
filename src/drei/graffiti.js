// Berlin · graffiti.js · Berlin-Look für die ganze Stadt: Graffitis und Paste-ups im Erdgeschoss fast jedes Hauses (Tags, Bubble-Letters, Kiez-Sprüche),
// Nur Texturen und leuchtende Flächen, keine echten Lichter (Tempo-Regel aus CLAUDE.md).
import * as THREE from 'three';
import { M } from './haeuser.js?v=1795050164';

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
    m.color.getHSL(hsl); m.color.setHSL(hsl.h, hsl.s * .22, Math.min(.72, hsl.l * .82 + .04)) } }) }
export function graffiti(szene) { grauMachen(szene); const g = new THREE.Group(); szene.add(g); const mats = Array.from({ length: 10 }, (_, i) => new THREE.MeshStandardMaterial({ map: wandTextur(i), roughness: .95, polygonOffset: true, polygonOffsetFactor: -2 }));
  const r = zufall(42); let n = 0; const breite = 4 * M - 1.2;
  for (const b of B) { if (b.haupt || !b.drei || b.meins === 'boutique') continue; if (r() < .18) continue;
    const cx = (b.x + 2) * M, cz = (b.y + 2) * M, halb = 2 * M - .3;
    for (const seite of [0, 1]) { if (r() < .25) continue; const w = new THREE.Mesh(new THREE.PlaneGeometry(breite, breite * 160 / 512), mats[(n++) % mats.length]);
      if (seite === 0) w.position.set(cx, breite * 80 / 512 + .15, cz + halb + .06); else { w.position.set(cx + halb + .06, breite * 80 / 512 + .15, cz); w.rotation.y = Math.PI / 2 } g.add(w) } }
  /* Wandbilder über ganze Hochhausfassaden, wie die Murals in Kreuzberg und Friedrichshain */
  const murals = Array.from({ length: 5 }, (_, i) => new THREE.MeshStandardMaterial({ map: muralTextur(i), roughness: .9, polygonOffset: true, polygonOffsetFactor: -2 }));
  let m = 0; for (const b of B) { if (b.haupt || !b.drei || (b.drei.userData.hoehe || 0) < 22) continue; const hh = b.drei.userData.hoehe * .82, br = 4 * M - 1.6, cx = (b.x + 2) * M, cz = (b.y + 2) * M, halb = 2 * M - .2;
    const w = new THREE.Mesh(new THREE.PlaneGeometry(br, hh), murals[(m++) % murals.length]); if (m % 2) w.position.set(cx, hh / 2 + 3, cz + halb + .1); else { w.position.set(cx + halb + .1, hh / 2 + 3, cz); w.rotation.y = Math.PI / 2 } g.add(w) }
  /* Brandenburger Tor im Park: sechs Säulenpaare, Attika, Quadriga in Grünspan */
  const tor = new THREE.Group(), sand = new THREE.MeshStandardMaterial({ color: '#cbbf9f', roughness: .85 }), gruen = new THREE.MeshStandardMaterial({ color: '#4f7f6c', metalness: .5, roughness: .5 });
  tor.position.set((PARK.x + 2) * M, 0, (PARK.y + 2) * M); tor.scale.setScalar(.68); g.add(tor); const st = (geo, mat, x, y, z) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; tor.add(o); return o };
  st(new THREE.BoxGeometry(17, .8, 4.6), sand, 0, .4, 0); for (let i = 0; i < 6; i++) for (const z of [-1.5, 1.5]) st(new THREE.CylinderGeometry(.5, .55, 9, 14), sand, -7.5 + i * 3, 5.3, z);
  st(new THREE.BoxGeometry(17.6, 1.6, 4.8), sand, 0, 10.6, 0); st(new THREE.BoxGeometry(12, 1.6, 3.6), sand, 0, 12.2, 0);
  const wagen = st(new THREE.BoxGeometry(2.4, 1.2, 1.6), gruen, 0, 13.6, 0); for (let i = 0; i < 4; i++) { st(new THREE.BoxGeometry(.5, 1.3, 1.6), gruen, -1.8 + i * 1.2, 13.7, -1.3); st(new THREE.BoxGeometry(.35, .7, .4), gruen, -1.8 + i * 1.2, 14.6, -1.95) }
  st(new THREE.CylinderGeometry(.18, .18, 2.2, 8), gruen, 0, 15.2, .2); st(new THREE.SphereGeometry(.45, 10, 8), gruen, 0, 16.5, .2);
  return { weiter() {} } }
/* Ein Mural: großer Farbverlauf, Berliner Bär, Kreise, senkrechte Schrift */
function muralTextur(nr) { const r = zufall(nr * 31 + 7), c = document.createElement('canvas'); c.width = 256; c.height = 768; const x = c.getContext('2d');
  const p = [['#ff2fa0', '#2fe0d2', '#ffd400'], ['#9b5cff', '#ff7a1a', '#ffffff'], ['#39d353', '#ff2a2a', '#16171a'], ['#2fe0d2', '#ffd36b', '#ff2fa0'], ['#ff7a1a', '#16171a', '#2fe0d2']][nr % 5];
  const gr = x.createLinearGradient(0, 0, 0, 768); gr.addColorStop(0, p[0]); gr.addColorStop(1, p[1]); x.fillStyle = gr; x.fillRect(0, 0, 256, 768);
  for (let i = 0; i < 9; i++) { x.globalAlpha = .35 + r() * .4; x.fillStyle = p[i % 3]; x.beginPath(); x.arc(r() * 256, r() * 768, 20 + r() * 90, 0, 7); x.fill() } x.globalAlpha = 1;
  x.font = '120px serif'; x.textAlign = 'center'; x.fillText(['🐻', '🌈', '🕊️', '🐻', '✊'][nr % 5], 128, 330);
  x.save(); x.translate(150, 740); x.rotate(-Math.PI / 2); x.font = '900 92px Impact, Arial Black, sans-serif'; x.lineWidth = 12; x.strokeStyle = p[2] === '#16171a' ? '#ffffff' : '#16171a'; const t = ['BERLIN', 'KIEZ LIEBE', 'SPREE', 'ARM ABER SEXY', '030'][nr % 5]; x.strokeText(t, 0, 0); x.fillStyle = p[2]; x.fillText(t, 0, 0); x.restore();
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return tx }
