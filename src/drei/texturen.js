// Berlin City 3D · texturen.js · Alle Bilder auf Leinwand gemalt: Schilder, Markenmuster, Fenster, Straße
import * as THREE from 'three';

const leinwand = (w, h, mal) => { const c = document.createElement('canvas'); c.width = w; c.height = h; mal(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t };

// Ladenschild: Hintergrund, Schrift, feine Linie unten
export function schild(text, { bg = '#111', fg = '#fff', font = '600 110px "Bodoni Moda", Georgia, serif', linie = null, breite = 1024, hoehe = 256, sperr = 0 } = {}) {
  return leinwand(breite, hoehe, (g, w, h) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); if (linie) { g.fillStyle = linie; g.fillRect(0, h - 14, w, 14) }
    g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = font; g.letterSpacing = sperr + 'px';
    let s = 1; const m = g.measureText(text).width; if (m > w * .86) { s = w * .86 / m; g.font = font.replace(/(\d+)px/, (_, n) => Math.floor(n * s) + 'px') } g.fillText(text, w / 2, h / 2 + 4) }) }

// Markenmuster für Taschen und Kleidung: erkennbare Anlehnung, keine echten Logos
export const MUSTER = {
  // Monogramm-Leinwand: Braun mit goldenen Blüten und Ringen
  monogramm: () => leinwand(256, 256, (g) => { g.fillStyle = '#6e4a30'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#d9b46a';
    for (let y = 0; y < 256; y += 64) for (let x = 0; x < 256; x += 64) { const o = (y / 64) % 2 ? 32 : 0, cx = x + o + 16, cy = y + 16;
      for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(cx + Math.cos(k * Math.PI / 2) * 7, cy + Math.sin(k * Math.PI / 2) * 7, 6, 3.4, k * Math.PI / 2, 0, 7); g.fill() }
      g.beginPath(); g.arc(cx + 32, cy + 32, 9, 0, 7); g.lineWidth = 3; g.strokeStyle = '#d9b46a'; g.stroke() } }),
  // Karo wie beim britischen Trenchcoat: Beige, schwarze, rote und weiße Linien
  karo: () => leinwand(256, 256, (g) => { g.fillStyle = '#c9ad84'; g.fillRect(0, 0, 256, 256);
    const l = (p, b, c, a = 1) => { g.globalAlpha = a; g.fillStyle = c; g.fillRect(p, 0, b, 256); g.fillRect(0, p, 256, b) };
    l(40, 26, '#1a1a1a', .9); l(120, 6, '#ffffff', .9); l(170, 26, '#1a1a1a', .9); l(210, 5, '#b3202a', 1); g.globalAlpha = 1 }),
  // Steppung mit Rauten, schwarzes Lammleder
  stepp: (farbe = '#121214') => leinwand(256, 256, (g) => { g.fillStyle = farbe; g.fillRect(0, 0, 256, 256); g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 3;
    for (let k = -256; k < 512; k += 42) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + 256, 256); g.moveTo(k + 256, 0); g.lineTo(k, 256); g.stroke() } }),
  // Bouclé-Tweed in Rosa mit Goldfäden
  tweed: () => leinwand(256, 256, (g) => { g.fillStyle = '#f2a9c4'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) { g.fillStyle = ['#ffffff', '#d97aa0', '#ffd6e6', '#e6c76a'][i % 4]; g.globalAlpha = .55; g.fillRect(Math.random() * 256, Math.random() * 256, 3, 1.6) } g.globalAlpha = 1 }),
  // Grün-Rot-Grün-Streifen auf Canvas-Beige mit kleinem Rautenmuster
  streifen: () => leinwand(256, 256, (g) => { g.fillStyle = '#d6c6a6'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#7a5a3a';
    for (let y = 6; y < 256; y += 16) for (let x = (y / 16 % 2) * 8; x < 256; x += 16) { g.save(); g.translate(x, y); g.rotate(Math.PI / 4); g.fillRect(-3, -3, 6, 6); g.restore() }
    g.fillStyle = '#1f6b3a'; g.fillRect(104, 0, 16, 256); g.fillStyle = '#b3202a'; g.fillRect(120, 0, 16, 256); g.fillStyle = '#1f6b3a'; g.fillRect(136, 0, 16, 256) }),
  // Nylon in Schwarz mit kleinem Dreieck-Emblem
  nylon: () => leinwand(256, 256, (g) => { g.fillStyle = '#18181b'; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 256; i += 4) { g.fillStyle = 'rgba(255,255,255,.03)'; g.fillRect(0, i, 256, 1) }
    g.fillStyle = '#c0c4cc'; g.beginPath(); g.moveTo(128, 100); g.lineTo(156, 150); g.lineTo(100, 150); g.closePath(); g.fill(); g.fillStyle = '#18181b'; g.font = '700 12px Inter'; g.textAlign = 'center'; g.fillText('PRADO', 128, 140) }),
  // Glattleder einfarbig mit leichter Narbung
  leder: (farbe) => leinwand(128, 128, (g) => { g.fillStyle = farbe; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 400; i++) { g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2) } }),
  uni: (farbe) => leinwand(16, 16, (g) => { g.fillStyle = farbe; g.fillRect(0, 0, 16, 16) })
};
for (const k of ['monogramm', 'karo', 'stepp', 'tweed', 'streifen', 'nylon']) { const f = MUSTER[k]; let t; MUSTER[k] = (a) => { if (a) return f(a); if (!t) { t = f(); t.wrapS = t.wrapT = THREE.RepeatWrapping } return t } }

// Fassaden: Fensterraster. farbe = Tagesbild, leucht = Nachtbild mit zufällig erleuchteten Fenstern
export function fenster(spalten, reihen, { rahmen = '#d9d4cc', glas = '#2c3e50', warm = '#ffcf8a' } = {}) {
  const W = spalten * 32, H = reihen * 48; let z = 7;
  const farbe = leinwand(W, H, (g) => { g.fillStyle = rahmen; g.fillRect(0, 0, W, H); for (let r = 0; r < reihen; r++) for (let s = 0; s < spalten; s++) { const gr = g.createLinearGradient(0, r * 48, 0, r * 48 + 40); gr.addColorStop(0, glas); gr.addColorStop(1, '#6f8fae'); g.fillStyle = gr; g.fillRect(s * 32 + 4, r * 48 + 6, 24, 34) } });
  const leucht = leinwand(W, H, (g) => { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); for (let r = 0; r < reihen; r++) for (let s = 0; s < spalten; s++) { z = (z * 9301 + 49297) % 233280; if (z / 233280 < .45) { g.fillStyle = z % 3 ? warm : '#ffe9c4'; g.fillRect(s * 32 + 4, r * 48 + 6, 24, 34) } } });
  return { farbe, leucht } }

// Moderne Glasfassade: dunkelblaue bis schwarze Scheiben mit feinen schwarzen Profilen, leichter Himmelsverlauf im Glas.
// Nachtbild: einzelne warm erleuchtete Scheiben, darin Silhouetten von Menschen, damit man sieht: hier wohnt und arbeitet jemand.
export function glasfassade(spalten, reihen) { const W = spalten * 32, H = reihen * 48; let z = 11;
  const farbe = leinwand(W, H, (g) => { g.fillStyle = '#05070c'; g.fillRect(0, 0, W, H); for (let r = 0; r < reihen; r++) for (let s = 0; s < spalten; s++) { const gr = g.createLinearGradient(s * 32, r * 48, s * 32 + 30, r * 48 + 46); gr.addColorStop(0, '#26405e'); gr.addColorStop(.5, '#0f1c30'); gr.addColorStop(1, '#070b14'); g.fillStyle = gr; g.fillRect(s * 32 + 1.5, r * 48 + 1.5, 29, 43) } g.fillStyle = '#000'; for (let r = 0; r < reihen; r++) g.fillRect(0, r * 48 + 44, W, 4) });
  const leucht = leinwand(W, H, (g) => { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); for (let r = 0; r < reihen; r++) for (let s = 0; s < spalten; s++) { z = (z * 9301 + 49297) % 233280; const u = z / 233280; if (u < .32) { g.fillStyle = u < .1 ? '#ffe2b0' : '#ffc777'; g.globalAlpha = .55 + u; g.fillRect(s * 32 + 2, r * 48 + 2, 28, 42); g.globalAlpha = 1;
      if (u < .2) { g.fillStyle = 'rgba(20,12,10,.75)'; const px = s * 32 + 8 + (u * 100 % 12); g.beginPath(); g.arc(px, r * 48 + 20, 4, 0, 7); g.fill(); g.fillRect(px - 5, r * 48 + 25, 10, 17) } } } });
  return { farbe, leucht } }

// Fahrbahn mit Mittellinie und Randstreifen
export function fahrbahn(laenge) { const t = leinwand(512, 128, (g) => { g.fillStyle = '#2b2d33'; g.fillRect(0, 0, 512, 128); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * .04})`; g.fillRect(Math.random() * 512, Math.random() * 128, 2, 2) }
  g.fillStyle = '#f2c14e'; g.fillRect(0, 60, 512, 3); g.fillRect(0, 66, 512, 3); g.fillStyle = 'rgba(255,255,255,.75)'; g.fillRect(0, 6, 512, 3); g.fillRect(0, 119, 512, 3) });
  t.wrapS = THREE.RepeatWrapping; t.repeat.set(laenge / 24, 1); return t }

// Rasen: Grundgrün mit hellen und dunklen Flecken, feine Halme und leichte Mähstreifen, nahtlos kachelbar
export function rasen() { const t = leinwand(512, 512, (g) => { g.fillStyle = '#7b9e55'; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 90; i++) { const x = Math.random() * 512, y = Math.random() * 512, r = 20 + Math.random() * 60, h = Math.random() < .5; const v = g.createRadialGradient(x, y, 0, x, y, r); v.addColorStop(0, h ? 'rgba(170,200,110,.22)' : 'rgba(60,90,40,.2)'); v.addColorStop(1, 'rgba(0,0,0,0)');
      for (const [ox, oy] of [[0, 0], [512, 0], [-512, 0], [0, 512], [0, -512]]) { g.save(); g.translate(ox, oy); g.fillStyle = v; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore() } }
    for (let i = 0; i < 9000; i++) { g.fillStyle = Math.random() < .5 ? 'rgba(200,230,140,.18)' : 'rgba(40,70,30,.16)'; g.fillRect(Math.random() * 512, Math.random() * 512, 1, 3) }
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.03)'; g.fillRect(i * 64, 0, 64, 512) } });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t }

export function pflaster(farbe1, farbe2, n = 8) { const t = leinwand(256, 256, (g) => { const s = 256 / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { g.fillStyle = (i + j) % 2 ? farbe1 : farbe2; g.fillRect(i * s, j * s, s, s) } g.strokeStyle = 'rgba(0,0,0,.08)'; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, 256); g.moveTo(0, i * s); g.lineTo(256, i * s); g.stroke() } });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; return t }

export function sand() { const t = leinwand(256, 256, (g) => { g.fillStyle = '#efd9b4'; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 4000; i++) { g.fillStyle = Math.random() < .5 ? 'rgba(255,255,255,.25)' : 'rgba(160,120,70,.12)'; g.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5) } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t }

// Markise mit Streifen
export function markise(a, b) { const t = leinwand(256, 64, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(i * 32, 0, 32, 64) } }); return t }

// Textblase über der Boutique
export function blase(text, farbe = '#ff4fa3') { return leinwand(512, 128, (g) => { g.fillStyle = farbe; g.beginPath(); g.roundRect(8, 8, 496, 96, 48); g.fill(); g.beginPath(); g.moveTo(236, 100); g.lineTo(276, 100); g.lineTo(256, 124); g.fill();
  g.fillStyle = '#fff'; g.font = '800 46px Inter, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 58) }) }
