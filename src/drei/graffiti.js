// Berlin · graffiti.js · Berlin-Look für die ganze Stadt: Graffitis und Paste-ups im Erdgeschoss fast jedes Hauses (Tags, Bubble-Letters, Kiez-Sprüche),
// Nur Texturen und leuchtende Flächen, keine echten Lichter (Tempo-Regel aus CLAUDE.md).
import * as THREE from 'three';
import { M } from './haeuser.js?v=1795049814';

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
  return { weiter() {} } }
