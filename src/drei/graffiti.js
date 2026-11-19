// Berlin · graffiti.js · Berlin-Look für die ganze Stadt: Graffitis und Paste-ups im Erdgeschoss fast jedes Hauses (Tags, Bubble-Letters, Kiez-Sprüche),
// dazu der Fernsehturm-Kopf auf dem Alex Tower (Kugel mit Antenne, rotes Blinklicht) und ein paar Spätis an Straßenecken.
// Nur Texturen und leuchtende Flächen, keine echten Lichter (Tempo-Regel aus CLAUDE.md).
import * as THREE from 'three';
import { M } from './haeuser.js?v=1795049691';

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

export function graffiti(szene) { const g = new THREE.Group(); szene.add(g); const mats = Array.from({ length: 10 }, (_, i) => new THREE.MeshStandardMaterial({ map: wandTextur(i), roughness: .95, polygonOffset: true, polygonOffsetFactor: -2 }));
  const r = zufall(42); let n = 0; const breite = 4 * M - 1.2;
  for (const b of B) { if (b.haupt || !b.drei || b.meins === 'boutique') continue; if (r() < .18) continue;
    const cx = (b.x + 2) * M, cz = (b.y + 2) * M, halb = 2 * M - .3;
    for (const seite of [0, 1]) { if (r() < .25) continue; const w = new THREE.Mesh(new THREE.PlaneGeometry(breite, breite * 160 / 512), mats[(n++) % mats.length]);
      if (seite === 0) w.position.set(cx, breite * 80 / 512 + .15, cz + halb + .06); else { w.position.set(cx + halb + .06, breite * 80 / 512 + .15, cz); w.rotation.y = Math.PI / 2 } g.add(w) } }
  /* Fernsehturm-Kopf auf dem Alex Tower */
  const turm = B.find(b => b.haupt); let blink = null;
  if (turm && turm.drei) { const box = new THREE.Box3().setFromObject(turm.drei), oben = box.max.y, tx = (turm.x + 2) * M, tz = (turm.y + 2) * M;
    const stahl = new THREE.MeshStandardMaterial({ color: '#d9dde2', metalness: .8, roughness: .3 });
    const schaft = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.6, 22, 24), new THREE.MeshStandardMaterial({ color: '#e9e6df', roughness: .7 })); schaft.position.set(tx, oben + 11, tz); g.add(schaft);
    const kugel = new THREE.Mesh(new THREE.SphereGeometry(5.2, 32, 24), stahl); kugel.position.set(tx, oben + 25, tz); g.add(kugel);
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(5.3, 5.3, .8, 32), new THREE.MeshStandardMaterial({ color: '#1a1c22', emissive: '#ff4fa3', emissiveIntensity: .6 })); ring.position.set(tx, oben + 25, tz); g.add(ring);
    const antenne = new THREE.Mesh(new THREE.CylinderGeometry(.35, .6, 26, 12), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .5 })); antenne.position.set(tx, oben + 43, tz); g.add(antenne);
    for (let i = 0; i < 4; i++) { const band = new THREE.Mesh(new THREE.CylinderGeometry(.62 - i * .05, .62 - i * .05, 1.6, 12), new THREE.MeshStandardMaterial({ color: '#d0201b' })); band.position.set(tx, oben + 33 + i * 4.5, tz); g.add(band) }
    blink = new THREE.Mesh(new THREE.SphereGeometry(.6, 10, 8), new THREE.MeshStandardMaterial({ color: '#ff2a2a', emissive: '#ff2a2a', emissiveIntensity: 3 })); blink.position.set(tx, oben + 56.5, tz); g.add(blink) }
  return { weiter() { if (blink) blink.visible = Math.sin(performance.now() / 400) > 0 } } }
