// Berlin City Figuren: die 20 festen Charaktere und das Zeichnen jeder Figur (Stadt, Läden, Figurenbogen).
// zeichne(ctx, x, y, s, f, t): x/y = Füße, s = Maßstab (1 = etwa 46 px hoch), t = Zeit für Gehen und Mimik.
window.GLOW_FIGUREN = (() => {
  // Luxustaschen: jede mit eigener Form, damit man sie an der Figur erkennt
  const TASCHE = {
    speedi: { c: '#7a5236', d: '#c9a46b', w: 5.2, h: 3.6, f: 'tonne' }, reed: { c: '#1a1a1c', d: '#c9a46b', w: 4.6, h: 2.6, f: 'halb' },
    loulou: { c: '#151517', d: '#d8c39a', w: 4.4, h: 3.4, f: 'stepp' }, jackie: { c: '#e8d8c0', d: '#7a5236', w: 4.2, h: 3.4, f: 'halb' },
    triomphe: { c: '#8a5a34', d: '#d8c39a', w: 4, h: 3.2, f: 'klappe' }, baguetta: { c: '#e48fb0', d: '#d8c39a', w: 4.6, h: 2.4, f: 'klappe' },
    jodie: { c: '#2e8b57', d: '#2e8b57', w: 4.4, h: 3.6, f: 'knoten' }, lady: { c: '#151517', d: '#d8c39a', w: 4, h: 3.6, f: 'stepp' },
    flap: { c: '#0f0f11', d: '#e6c76a', w: 4.4, h: 3.2, f: 'kette' }, birkinn: { c: '#e07a1f', d: '#d8c39a', w: 6.2, h: 5, f: 'birkin' }
  };
  function tasche(g, t, x, y, s) {
    // Detaillierte Zeichnung aus der Kollektion, wenn vorhanden (boutique.js), etwas größer, damit man die Tasche an der Figur erkennt
    if (typeof taschenZeichnung === 'function' && t.f) { const G = t.w * s * 2.1, H = (t.w * s * 1.45) * (t.h / t.w); g.save(); g.translate(x - G / 2, y + H * .9 - G * .9); taschenZeichnung(g, t, G, true); g.restore(); return }
    const w = t.w * s, h = t.h * s; g.save(); g.translate(x, y);
    if (t.f === 'kette' || t.f === 'stepp') { g.strokeStyle = t.d; g.lineWidth = .7 * s; g.beginPath(); g.moveTo(-w * .3, 0); g.lineTo(-w * .6, -5 * s); g.moveTo(w * .3, 0); g.lineTo(w * .6, -5 * s); g.stroke() }
    else { g.strokeStyle = t.c; g.lineWidth = .9 * s; g.beginPath(); g.arc(0, 0, w * .32, Math.PI, 0); g.stroke() }
    g.fillStyle = t.c; g.beginPath();
    if (t.f === 'birkin' || t.f === 'halb') { g.moveTo(-w * .42, 0); g.lineTo(w * .42, 0); g.lineTo(w * .5, h); g.lineTo(-w * .5, h) }
    else if (t.f === 'tonne') g.roundRect(-w / 2, 0, w, h, h * .45); else g.roundRect(-w / 2, 0, w, h, .8 * s);
    g.fill();
    if (t.f === 'stepp' || t.f === 'kette') { g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = .4 * s; for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * w * .2 - w * .2, 0); g.lineTo(i * w * .2 + w * .2, h); g.stroke() } }
    if (t.f === 'klappe' || t.f === 'birkin') { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-w * .42, 0, w * .84, h * .35) }
    if (t.f === 'tonne') { g.fillStyle = t.d; for (let i = 0; i < 6; i++) g.fillRect(-w * .35 + i * w * .14, h * .35, .6 * s, .6 * s) }
    g.fillStyle = t.d; g.fillRect(-.8 * s, h * .32, 1.6 * s, 1.1 * s); g.restore();
  }

  // Die 20 Charaktere: zwei Drittel Frauen, ein Drittel Männer, alle Stufen von Starter bis Black Card
  // stil bestimmt die Kartenstufe; glow ist der Glow-Faktor von 1 bis 10; ort ist der Laden, in dem jemand arbeitet
  const CHARS = [
    { id: 'valentina', name: 'Valentina Vane', handle: '@valentina', w: 1, rolle: 'Investorin & It-Girl', stil: 62000, lohn: 8800, verm: 6400000, fol: 412000, glow: 9.6,
      skin: '#ecc6a8', hair: '#e6d3a3', frisur: 'welle', outfit: 'kleid', c1: '#f4efe6', c2: '#e6c76a', acc: ['sonnenbrille', 'goldkette', 'creolen'], tasche: 'birkinn', auto: 'Teslo Roadster', mimik: 'selbstbewusst', lippe: '#c2185b' },
    { id: 'carlotta', name: 'Carlotta Bloom', handle: '@carlotta.writes', w: 1, rolle: 'Kolumnistin „Glow Diaries“', stil: 24000, lohn: 4400, verm: 890000, fol: 268000, glow: 8.9,
      skin: '#f1d0b5', hair: '#7a4a2a', frisur: 'locken', outfit: 'rock', c1: '#ff7eb6', c2: '#f4efe6', acc: ['perlen', 'creolen', 'hut'], tasche: 'baguetta', auto: 'Audri S5', mimik: 'lachen', lippe: '#d81b60' },
    { id: 'mila', name: 'Mila Okafor', handle: '@mila', w: 1, rolle: 'Creatorin', stil: 21000, lohn: 5250, verm: 1200000, fol: 355000, glow: 9.1,
      skin: '#8d5b3d', hair: '#141414', frisur: 'dutt', outfit: 'mantel', c1: '#c9b48a', c2: '#16171a', acc: ['goldkette', 'creolen', 'uhr'], tasche: 'flap', auto: 'Lamborgia Furioso', mimik: 'zwinkern', lippe: '#8e2443' },
    { id: 'sasha', name: 'Sasha Montclair', handle: '@sasha.pr', w: 1, rolle: 'PR-Queen', stil: 16500, lohn: 3700, verm: 640000, fol: 190000, glow: 8.7,
      skin: '#f3d5bf', hair: '#f2e2b8', frisur: 'bob', outfit: 'jumpsuit', c1: '#d81b60', c2: '#16171a', acc: ['sonnenbrille', 'goldkette', 'uhr'], tasche: 'lady', auto: 'Mercedia G 63', mimik: 'selbstbewusst', lippe: '#b0003a' },
    { id: 'margot', name: 'Margot Kessler', handle: '@margot.law', w: 1, rolle: 'Anwältin, Partnerin', stil: 9800, lohn: 4400, verm: 980000, fol: 22000, glow: 8.0,
      skin: '#e4b997', hair: '#3a2416', frisur: 'bob', outfit: 'anzug', c1: '#1d2433', c2: '#f4efe6', acc: ['uhr', 'perlen'], tasche: 'triomphe', auto: 'Mercedia G 63', mimik: 'kuehl', lippe: '#a63d40' },
    { id: 'sofia', name: 'Sofia Lindqvist', handle: '@sofia.skin', w: 1, rolle: 'Gründerin Skincare', stil: 8700, lohn: 3000, verm: 720000, fol: 98000, glow: 9.0,
      skin: '#f6dcc8', hair: '#f4f0e6', frisur: 'glatt', outfit: 'blazer', c1: '#16171a', c2: '#e6c76a', acc: ['creolen', 'tuch'], tasche: 'lady', auto: 'Mercedia G 63', mimik: 'laecheln', lippe: '#c46a6a' },
    { id: 'celeste', name: 'Celeste Harrington', handle: '@celeste.art', w: 1, rolle: 'Galeristin', stil: 4600, lohn: 2450, verm: 310000, fol: 41000, glow: 8.4,
      skin: '#f1d3bd', hair: '#a8562a', frisur: 'welle', outfit: 'kleid', c1: '#2e8b57', c2: '#d8c39a', acc: ['perlen', 'creolen', 'hut'], tasche: 'jodie', auto: 'Audri S5', mimik: 'laecheln', lippe: '#c05a5a' },
    { id: 'hana', name: 'Dr. Hana Kim', handle: 'Ärztin · Ästhetik', w: 1, rolle: 'Ärztin bei Dr. Glatt', ort: 'klinik', stil: 4100, lohn: 2450, verm: 260000, fol: 15000, glow: 8.6,
      skin: '#f3dcc6', hair: '#121212', frisur: 'glatt', outfit: 'kittel', c1: '#ffffff', c2: '#1d2b33', acc: ['uhr'], tasche: null, auto: 'Mercedia G 63', mimik: 'laecheln', lippe: '#c27272' },
    { id: 'lea', name: 'Lea Hoffmann', handle: '@lea.pilates', w: 1, rolle: 'Pilates-Trainerin', stil: 1300, lohn: 1000, verm: 24000, fol: 18000, glow: 8.2,
      skin: '#f1d0b5', hair: '#e2c48a', frisur: 'zopf', outfit: 'sport', c1: '#c8b6e2', c2: '#c8b6e2', acc: ['creolen'], tasche: null, auto: 'Vesta Primavera Rosa', mimik: 'lachen', lippe: '#d77a8a' },
    { id: 'amira', name: 'Amira Saleh', handle: 'Beauty-Beraterin', w: 1, rolle: 'Verkäuferin bei Dougless', ort: 'doug', stil: 820, lohn: 800, verm: 9000, fol: 6400, glow: 8.5,
      skin: '#c48f6b', hair: '#1b1210', frisur: 'welle', outfit: 'kleid', c1: '#16171a', c2: '#e6c76a', acc: ['goldkette', 'creolen'], tasche: 'jackie', auto: 'Renaux Twinga', mimik: 'laecheln', lippe: '#9c2a4a' },
    { id: 'emma', name: 'Emma Schulz', handle: 'Style-Beraterin', w: 1, rolle: 'Verkäuferin bei Zahra', ort: 'zahra', stil: 260, lohn: 630, verm: 3200, fol: 2100, glow: 7.4,
      skin: '#f3d5bf', hair: '#6b4630', frisur: 'bob', outfit: 'uniform', c1: '#16171a', c2: '#f4efe6', acc: ['creolen'], tasche: null, auto: 'Hollandrad Amsterdam', mimik: 'laecheln', lippe: '#c46a6a' },
    { id: 'yasmin', name: 'Yasmin Haddad', handle: '@yas.daily', w: 1, rolle: 'Studentin', stil: 140, lohn: 500, verm: 1800, fol: 3400, glow: 7.9,
      skin: '#c99a76', hair: '#1a1210', frisur: 'locken', outfit: 'jeans', c1: '#f4efe6', c2: '#3a5070', acc: ['creolen'], tasche: 'speedi', auto: 'Nio E-Roller', mimik: 'zwinkern', lippe: '#b45a6a' },
    { id: 'jule', name: 'Jule Wagner', handle: '@jule.neu', w: 1, rolle: 'Neu in der Stadt', stil: 12, lohn: 500, verm: 10000, fol: 120, glow: 7.0,
      skin: '#f4dccb', hair: '#b5462c', frisur: 'bob', outfit: 'jeans', c1: '#e8d5c4', c2: '#2f3e56', acc: [], tasche: null, auto: null, mimik: 'laecheln', lippe: '#c98080' },
    { id: 'paula', name: 'Paula Novak', handle: 'Service im Papillong', w: 1, rolle: 'Kellnerin im Papillong', ort: 'riva', stil: 40, lohn: 500, verm: 900, fol: 600, glow: 7.6,
      skin: '#eac2a2', hair: '#2b1a12', frisur: 'dutt', outfit: 'uniform', c1: '#f4efe6', c2: '#16171a', acc: [], tasche: null, auto: 'Hollandrad Amsterdam', mimik: 'laecheln', lippe: '#b86a6a' },
    { id: 'thorne', name: 'Maximilian Thorne', handle: '@thorne', w: 0, rolle: 'Investor, Eigentümer Fabrik Coworking', stil: 71000, lohn: 8800, verm: 18000000, fol: 87000, glow: 8.8,
      skin: '#e4b997', hair: '#c9c4bc', frisur: 'kurz', outfit: 'anzug', c1: '#202226', c2: '#f4efe6', acc: ['uhr', 'sonnenbrille'], tasche: null, auto: 'Teslo Roadster', mimik: 'selbstbewusst' },
    { id: 'kerem', name: 'Kerem Aydin', handle: '@kerem.bootshus', w: 0, rolle: 'Clubbesitzer Grill Royale', ort: 'boot', stil: 18000, lohn: 4400, verm: 1500000, fol: 140000, glow: 8.3,
      skin: '#c99a76', hair: '#121212', frisur: 'glatt_m', outfit: 'leder', c1: '#141414', c2: '#2b2b30', acc: ['goldkette', 'uhr', 'sonnenbrille'], tasche: null, auto: 'Lamborgia Furioso', mimik: 'zwinkern' },
    { id: 'jonas', name: 'Jonas Weber', handle: '@jonas.lift', w: 0, rolle: 'Personal Trainer', ort: 'mcf', stil: 7400, lohn: 2000, verm: 160000, fol: 210000, glow: 8.5,
      skin: '#d7a985', hair: '#2b2118', frisur: 'kurz', outfit: 'sport', c1: '#6d6f73', c2: '#16171a', acc: ['goldkette'], tasche: null, auto: 'Audri S5', mimik: 'lachen' },
    { id: 'glatt', name: 'Dr. Felix Glatt', handle: 'Schönheitschirurg', w: 0, rolle: 'Chefarzt Ästhetik Klinik', ort: 'klinik', stil: 3900, lohn: 3700, verm: 2400000, fol: 33000, glow: 7.8,
      skin: '#f1d3bd', hair: '#cfc9c0', frisur: 'kurz', outfit: 'kittel', c1: '#ffffff', c2: '#2f3e46', acc: ['uhr'], tasche: null, auto: 'Mercedia G 63', mimik: 'laecheln' },
    { id: 'luca', name: 'Luca Moretti', handle: 'Spree Motors', w: 0, rolle: 'Verkäufer bei Spree Motors', ort: 'motors', stil: 2100, lohn: 1600, verm: 85000, fol: 9000, glow: 8.0,
      skin: '#e2b896', hair: '#1a1410', frisur: 'glatt_m', outfit: 'anzug', c1: '#1d2a44', c2: '#f4efe6', acc: ['uhr'], tasche: null, auto: 'Audri S5', mimik: 'selbstbewusst' },
    { id: 'ben', name: 'Ben Hartmann', handle: 'Barista', w: 0, rolle: 'Barista bei Café Zweistein', ort: 'star', stil: 520, lohn: 630, verm: 4200, fol: 2800, glow: 7.5,
      skin: '#f0cdb0', hair: '#5a3d2b', frisur: 'kurz', outfit: 'schuerze', c1: '#f4efe6', c2: '#1e6b4a', acc: [], tasche: null, auto: 'Nio E-Roller', mimik: 'lachen' }
  ];

  const FRISUR_ALT = ['kurz', 'welle', 'dutt', 'kurz'];
  function zeichne(g, x, y, s, f, t = 0, gehen = true) {
    const sw = gehen ? Math.sin(t * 7 + (f.ph || 0)) * 2 * s : 0;
    const frisur = f.frisur || FRISUR_ALT[f.hs || 0];
    const outfit = f.outfit || (f.dress ? 'kleid' : f.coat ? 'mantel' : 'basic');
    const c1 = f.c1 || f.top, c2 = outfit === 'jumpsuit' ? c1 : (f.c2 || f.leg), skin = f.skin, frau = f.w ?? (f.dress || f.hs === 1 || f.hs === 2 ? 1 : 0);
    const acc = f.acc || [], detail = s > 1.7;
    const lang = outfit === 'kleid' || outfit === 'mantel' || outfit === 'kittel';
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
    // Schatten
    g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(x, y, 5.5 * s, 1.9 * s, 0, 0, 7); g.fill();
    // Haare hinten (lange Frisuren)
    const hk = y - 27 * s;
    if (['welle', 'glatt', 'locken'].includes(frisur)) { g.fillStyle = f.hair; g.beginPath(); g.roundRect(x - 3.9 * s, hk - 2.5 * s, 7.8 * s, frisur === 'locken' ? 9 * s : 11 * s, 3 * s); g.fill() }
    // Beine
    const beinFarbe = (outfit === 'kleid' || outfit === 'rock') ? skin : (outfit === 'anzug' || (outfit === 'sport' && frau)) ? c1 : outfit === 'blazer' ? '#16171a' : c2;
    g.strokeStyle = beinFarbe; g.lineWidth = 2.1 * s;
    g.beginPath(); g.moveTo(x - 1.2 * s, y - 12 * s); g.lineTo(x - 1.1 * s + sw * .55, y - 1.2 * s); g.moveTo(x + 1.2 * s, y - 12 * s); g.lineTo(x + 1.1 * s - sw * .55, y - 1.2 * s); g.stroke();
    // Schuhe: Absätze bei Frauen
    for (const k of [-1, 1]) {
      const fx = x + k * 1.1 * s - k * sw * .55;
      g.fillStyle = frau ? (outfit === 'sport' ? '#f4efe6' : '#16171a') : '#1a1410';
      g.beginPath(); g.ellipse(fx + .5 * s, y - .7 * s, 1.6 * s, .8 * s, 0, 0, 7); g.fill();
      if (frau && outfit !== 'sport') { g.fillRect(fx - .9 * s, y - 1.2 * s, .5 * s, 1.2 * s) }
      if (acc.includes('rote_sohle')) { g.fillStyle = '#d0021b'; g.fillRect(fx - .9 * s, y - .4 * s, 2.8 * s, .4 * s) }
    }
    // Hose oder Rock
    if (outfit === 'rock') { g.fillStyle = c1; g.beginPath(); g.moveTo(x - 3.3 * s, y - 14 * s); g.lineTo(x + 3.3 * s, y - 14 * s); g.lineTo(x + 4.2 * s, y - 8.5 * s); g.lineTo(x - 4.2 * s, y - 8.5 * s); g.fill() }
    else if (!lang) { g.fillStyle = beinFarbe; g.beginPath(); g.moveTo(x - 3 * s, y - 13 * s); g.lineTo(x + 3 * s, y - 13 * s); g.lineTo(x + 2.6 * s, y - 10 * s); g.lineTo(x - 2.6 * s, y - 10 * s); g.fill() }
    // Oberkörper
    const saum = lang ? (outfit === 'kleid' ? -6.5 : -5) : -11.5, br = lang ? 4.4 : 3;
    const top = outfit === 'rock' ? c2 : c1;
    const kg = g.createLinearGradient(x - 4 * s, 0, x + 4 * s, 0); kg.addColorStop(0, shade(top, 1.15)); kg.addColorStop(1, shade(top, .82));
    g.fillStyle = kg; g.beginPath(); g.moveTo(x - 4 * s, y - 22 * s); g.lineTo(x + 4 * s, y - 22 * s); g.lineTo(x + br * s, y + saum * s); g.lineTo(x - br * s, y + saum * s); g.closePath(); g.fill();
    // Muster und Stoffe: damit man Marken-Looks an der Figur erkennt
    if (f.muster) { g.save(); g.clip(); const m = f.muster, ob = y - 22 * s, un = y + saum * s;
      if (m === 'tweed') { for (let yy = ob; yy < un; yy += 1.1 * s) for (let xx = x - 5 * s; xx < x + 5 * s; xx += 1.1 * s) { g.fillStyle = ((xx + yy) / s | 0) % 3 ? 'rgba(255,255,255,.28)' : 'rgba(0,0,0,.18)'; g.fillRect(xx, yy, .45 * s, .45 * s) }
        g.fillStyle = '#e6c76a'; for (const yy of [ob + 3 * s, ob + 6 * s, ob + 9 * s]) { g.beginPath(); g.arc(x, yy, .45 * s, 0, 7); g.fill() } g.fillStyle = '#16171a'; g.fillRect(x - 4 * s, ob, .5 * s, un - ob); g.fillRect(x + 3.5 * s, ob, .5 * s, un - ob) }
      if (m === 'satin') { const sg = g.createLinearGradient(x - 4 * s, ob, x + 4 * s, un); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.45, 'rgba(255,255,255,.45)'); sg.addColorStop(.55, 'rgba(255,255,255,.05)'); sg.addColorStop(1, 'rgba(255,255,255,.25)'); g.fillStyle = sg; g.fillRect(x - 5 * s, ob, 10 * s, un - ob) }
      if (m === 'gold') { g.fillStyle = '#f2c14e'; for (const yy of [ob + 2.5 * s, ob + 5 * s, ob + 7.5 * s]) for (const k of [-1, 1]) { g.beginPath(); g.arc(x + k * 1.3 * s, yy, .5 * s, 0, 7); g.fill() } g.fillRect(x - 4 * s, ob, 8 * s, .5 * s) }
      if (m === 'barock') { g.strokeStyle = '#f2c14e'; g.lineWidth = .35 * s; for (let yy = ob + 1.5 * s; yy < un; yy += 3 * s) for (let xx = x - 3 * s; xx < x + 4 * s; xx += 3 * s) { g.beginPath(); g.arc(xx, yy, 1 * s, 0, Math.PI * 1.5); g.stroke(); g.beginPath(); g.arc(xx + 1.5 * s, yy + 1.5 * s, .6 * s, Math.PI, Math.PI * 2.5); g.stroke() } }
      if (m === 'stepp') { g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = .4 * s; for (let yy = ob + 1.8 * s; yy < un; yy += 1.8 * s) { g.beginPath(); g.moveTo(x - 5 * s, yy); g.lineTo(x + 5 * s, yy); g.stroke() } g.fillStyle = 'rgba(255,255,255,.2)'; for (let yy = ob + .5 * s; yy < un; yy += 1.8 * s) g.fillRect(x - 4 * s, yy, 8 * s, .5 * s) }
      if (m === 'harness') { g.fillStyle = c1 || '#0d0d10'; g.fillRect(x - 5 * s, ob, 10 * s, un - ob); g.strokeStyle = 'rgba(226,230,238,.8)'; g.lineWidth = .55 * s; g.lineCap = 'round';
        g.beginPath(); g.moveTo(x - 3.2 * s, ob + .8 * s); g.lineTo(x + 2.4 * s, ob + 8 * s); g.moveTo(x + 3.2 * s, ob + .8 * s); g.lineTo(x - 2.4 * s, ob + 8 * s); g.moveTo(x - 3.6 * s, ob + 8 * s); g.lineTo(x + 3.6 * s, ob + 8 * s); g.stroke();
        g.fillStyle = '#9aa0ab'; for (const kx of [-1.6, 0, 1.6]) { g.beginPath(); g.arc(x + kx * s, ob + 8 * s, .35 * s, 0, 7); g.fill() } }
      if (m === 'latex') { const lg = g.createLinearGradient(x - 4 * s, ob, x + 4 * s, un); lg.addColorStop(0, 'rgba(255,255,255,.38)'); lg.addColorStop(.3, 'rgba(255,255,255,.04)'); lg.addColorStop(.62, 'rgba(255,255,255,.32)'); lg.addColorStop(1, 'rgba(255,255,255,.05)'); g.fillStyle = lg; g.fillRect(x - 5 * s, ob, 10 * s, un - ob) }
      if (m === 'netz') { g.fillStyle = skin || '#c99a76'; g.fillRect(x - 5 * s, ob, 10 * s, un - ob); g.strokeStyle = 'rgba(14,14,18,.9)'; g.lineWidth = .22 * s;
        for (let k = -12; k < 12; k++) { g.beginPath(); g.moveTo(x + k * s, ob); g.lineTo(x + k * s + (un - ob), un); g.moveTo(x + k * s, ob); g.lineTo(x + k * s - (un - ob), un); g.stroke() } }
      if (m === 'lack') { const lg2 = g.createLinearGradient(x - 4 * s, ob, x + 4 * s, ob); lg2.addColorStop(0, 'rgba(255,255,255,.06)'); lg2.addColorStop(.48, 'rgba(255,255,255,.46)'); lg2.addColorStop(.56, 'rgba(255,255,255,.4)'); lg2.addColorStop(1, 'rgba(255,255,255,.05)'); g.fillStyle = lg2; g.fillRect(x - 5 * s, ob, 10 * s, un - ob) }
      if (m === 'streifen') { g.fillStyle = f.c2 || '#ffffff'; g.fillRect(x - 4 * s, ob, .7 * s, un - ob); g.fillRect(x + 3.3 * s, ob, .7 * s, un - ob); g.fillRect(x - .25 * s, ob, .5 * s, 4 * s) }
      g.restore() }
    if (outfit === 'anzug' || outfit === 'blazer' || outfit === 'mantel' || outfit === 'kittel' || outfit === 'leder') {
      // Revers und Hemd
      g.fillStyle = outfit === 'kittel' ? '#cfe0e8' : c2; g.beginPath(); g.moveTo(x - 1.6 * s, y - 22 * s); g.lineTo(x + 1.6 * s, y - 22 * s); g.lineTo(x, y - 16.5 * s); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = .5 * s; g.beginPath(); g.moveTo(x - 1.8 * s, y - 22 * s); g.lineTo(x - .2 * s, y - 15 * s); g.moveTo(x + 1.8 * s, y - 22 * s); g.lineTo(x + .2 * s, y - 15 * s); g.stroke();
      if (outfit === 'anzug' && !frau) { g.strokeStyle = shade(c1, .6); g.lineWidth = .9 * s; g.beginPath(); g.moveTo(x, y - 20.5 * s); g.lineTo(x, y - 16 * s); g.stroke() }
    }
    if (outfit === 'schuerze' || outfit === 'uniform') { g.fillStyle = c2; g.beginPath(); g.moveTo(x - 2.8 * s, y - 19 * s); g.lineTo(x + 2.8 * s, y - 19 * s); g.lineTo(x + 3 * s, y - 10 * s); g.lineTo(x - 3 * s, y - 10 * s); g.fill() }
    if (outfit === 'kleid' && frau) { g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.moveTo(x - 4 * s, y - 22 * s); g.quadraticCurveTo(x, y - 19 * s, x + 4 * s, y - 22 * s); g.lineTo(x + 3.6 * s, y - 21 * s); g.quadraticCurveTo(x, y - 18 * s, x - 3.6 * s, y - 21 * s); g.fill() }
    if (f.muster === 'streifen' && outfit === 'sport') { g.strokeStyle = f.c2 || '#ffffff'; g.lineWidth = .5 * s; g.beginPath(); g.moveTo(x - 2 * s, y - 12 * s); g.lineTo(x - 1.8 * s + sw * .55, y - 1.5 * s); g.moveTo(x + 2 * s, y - 12 * s); g.lineTo(x + 1.8 * s - sw * .55, y - 1.5 * s); g.stroke() }
    // Arme
    g.strokeStyle = outfit === 'sport' && frau ? skin : shade(top, .88); g.lineWidth = 1.9 * s;
    g.beginPath(); g.moveTo(x - 3.8 * s, y - 21 * s); g.lineTo(x - 4.6 * s - sw * .45, y - 13 * s); g.moveTo(x + 3.8 * s, y - 21 * s); g.lineTo(x + 4.6 * s + sw * .45, y - 13 * s); g.stroke();
    g.fillStyle = skin; g.beginPath(); g.arc(x - 4.6 * s - sw * .45, y - 12.4 * s, 1 * s, 0, 7); g.arc(x + 4.6 * s + sw * .45, y - 12.4 * s, 1 * s, 0, 7); g.fill();
    if (acc.includes('guertel')) { g.fillStyle = '#16171a'; g.fillRect(x - 3.1 * s, y - 13.6 * s, 6.2 * s, .8 * s); g.fillStyle = '#f2c14e'; g.fillRect(x - .9 * s, y - 13.8 * s, 1.8 * s, 1.2 * s) }
    if (acc.includes('armreif')) { g.fillStyle = '#f2c14e'; g.fillRect(x + 3.9 * s + sw * .45, y - 14.2 * s, 1.5 * s, .8 * s) }
    if (acc.includes('tennis')) { for (let i = 0; i < 4; i++) { g.fillStyle = `rgba(255,255,255,${.6 + .4 * Math.sin(t * 6 + i)})`; g.beginPath(); g.arc(x + 4 * s + sw * .45 + i * .4 * s, y - 13.4 * s, .28 * s, 0, 7); g.fill() } }
    if (acc.includes('ring') || acc.includes('diamantring')) { g.fillStyle = '#f2c14e'; g.beginPath(); g.arc(x - 4.6 * s - sw * .45, y - 11.8 * s, .45 * s, 0, 7); g.fill() }
    if (acc.includes('diamantring')) { const k = .7 + .3 * Math.sin(t * 5); g.fillStyle = `rgba(255,255,255,${k})`; g.beginPath(); g.moveTo(x - 4.6 * s - sw * .45, y - 13.6 * s); g.lineTo(x - 4.2 * s - sw * .45, y - 12.2 * s); g.lineTo(x - 5 * s - sw * .45, y - 12.2 * s); g.fill() }
    if (acc.includes('uhr')) { g.fillStyle = '#e6c76a'; g.fillRect(x - 5.3 * s - sw * .45, y - 14 * s, 1.4 * s, .9 * s) }
    // Tasche
    const tk = f.tasche || f.bagK; if (tk && TASCHE[tk]) tasche(g, TASCHE[tk], x + 4.8 * s + sw * .45, y - 13 * s, s); else if (f.bag) { g.fillStyle = f.bag; g.beginPath(); g.roundRect(x + 4.4 * s + sw * .45, y - 12.5 * s, 3.8 * s, 4.4 * s, .8 * s); g.fill() }
    if (f.phone) { g.fillStyle = '#0d0d0f'; g.fillRect(x - 6.2 * s, y - 17 * s, 1.9 * s, 3.2 * s) }
    // Hals und Schmuck
    g.fillStyle = skin; g.fillRect(x - .9 * s, y - 24 * s, 1.8 * s, 2.6 * s);
    if (acc.includes('goldkette')) { g.strokeStyle = '#f2c14e'; g.lineWidth = .75 * s; g.beginPath(); g.arc(x, y - 23.2 * s, 2.1 * s, .15 * Math.PI, .85 * Math.PI); g.stroke(); g.fillStyle = '#ffd166'; g.beginPath(); g.arc(x, y - 21 * s, .55 * s, 0, 7); g.fill() }
    if (acc.includes('perlen')) { g.fillStyle = '#fbf6ee'; for (let i = 0; i < 7; i++) { const a = .15 * Math.PI + i * .7 * Math.PI / 6; g.beginPath(); g.arc(x + Math.cos(a) * 2.1 * s, y - 23.2 * s + Math.sin(a) * 2.1 * s, .45 * s, 0, 7); g.fill() } }
    // Kopf
    g.fillStyle = skin; g.beginPath(); g.ellipse(x, hk, 3.1 * s, 3.6 * s, 0, 0, 7); g.fill();
    // Gesicht mit Mimik, nur wenn nah genug
    if (detail) gesicht(g, x, hk, s, f, t, frau);
    // Haare vorne
    g.fillStyle = f.hair;
    if (frisur === 'kurz' || frisur === 'glatt_m') { g.beginPath(); g.ellipse(x, hk - 1.6 * s, 3.3 * s, 2.3 * s, 0, Math.PI, 0); g.fill(); if (frisur === 'glatt_m') { g.beginPath(); g.ellipse(x - .6 * s, hk - 2.6 * s, 3 * s, 1.4 * s, -.2, 0, 7); g.fill() } }
    else if (frisur === 'bob') { g.beginPath(); g.ellipse(x, hk - 1.2 * s, 3.6 * s, 3 * s, 0, Math.PI, 0); g.fill(); g.fillRect(x - 3.6 * s, hk - 1.2 * s, 1.3 * s, 4.2 * s); g.fillRect(x + 2.3 * s, hk - 1.2 * s, 1.3 * s, 4.2 * s) }
    else if (frisur === 'dutt') { g.beginPath(); g.ellipse(x, hk - 1.4 * s, 3.3 * s, 2.5 * s, 0, Math.PI, 0); g.fill(); g.beginPath(); g.arc(x, hk - 4.6 * s, 1.9 * s, 0, 7); g.fill() }
    else if (frisur === 'zopf') { g.beginPath(); g.ellipse(x, hk - 1.4 * s, 3.3 * s, 2.5 * s, 0, Math.PI, 0); g.fill(); g.strokeStyle = f.hair; g.lineWidth = 1.4 * s; g.beginPath(); g.moveTo(x + 2.4 * s, hk - 2.5 * s); g.quadraticCurveTo(x + 5.5 * s, hk, x + 3.5 * s, hk + 4 * s); g.stroke() }
    else if (frisur === 'locken') { for (let i = 0; i < 9; i++) { const a = Math.PI + i * Math.PI / 8; g.beginPath(); g.arc(x + Math.cos(a) * 3.4 * s, hk - .6 * s + Math.sin(a) * 3.2 * s, 1.4 * s, 0, 7); g.fill() } }
    else { g.beginPath(); g.ellipse(x, hk - 1.3 * s, 3.4 * s, 2.6 * s, 0, Math.PI, 0); g.fill(); g.beginPath(); g.ellipse(x - 1.6 * s, hk - 1.6 * s, 2 * s, 1.5 * s, .5, 0, 7); g.fill() }
    if (f.straehnen && frisur !== 'kurz') { g.strokeStyle = 'rgba(240,215,160,.75)'; g.lineWidth = .45 * s; for (const k of [-1.6, -.4, .8, 2]) { g.beginPath(); g.moveTo(x + k * s, hk - 3.2 * s); g.quadraticCurveTo(x + k * 1.25 * s, hk, x + k * 1.3 * s, hk + 3.5 * s); g.stroke() } }
    // Seidentuch, Sonnenhut
    if (acc.includes('tuch')) { g.fillStyle = f.c2 || '#e6c76a'; g.beginPath(); g.moveTo(x - 2.2 * s, y - 23.5 * s); g.lineTo(x + 2.2 * s, y - 23.5 * s); g.lineTo(x + .6 * s, y - 20 * s); g.lineTo(x - .6 * s, y - 20 * s); g.fill() }
    if (acc.includes('hut')) { g.fillStyle = '#e8d8c0'; g.beginPath(); g.ellipse(x, hk - 2.6 * s, 6.2 * s, 1.5 * s, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(x, hk - 3.4 * s, 3.2 * s, 2.2 * s, 0, Math.PI, 0); g.fill(); g.fillStyle = '#16171a'; g.fillRect(x - 3.1 * s, hk - 3.6 * s, 6.2 * s, .8 * s) }
    // Ohrringe, Sonnenbrille
    if (acc.includes('creolen')) { g.strokeStyle = '#f2c14e'; g.lineWidth = .45 * s; for (const k of [-1, 1]) { g.beginPath(); g.arc(x + k * 3.1 * s, hk + 1.4 * s, .9 * s, 0, 7); g.stroke() } }
    if (acc.includes('diamant')) { for (const k of [-1, 1]) { g.fillStyle = `rgba(255,255,255,${.7 + .3 * Math.sin(t * 6 + k)})`; g.beginPath(); g.arc(x + k * 3.1 * s, hk + .9 * s, .55 * s, 0, 7); g.fill() } }
    if (acc.includes('sonnenbrille')) { g.fillStyle = '#0d0d0f'; g.beginPath(); g.roundRect(x - 3 * s, hk - .9 * s, 2.7 * s, 1.5 * s, .6 * s); g.roundRect(x + .3 * s, hk - .9 * s, 2.7 * s, 1.5 * s, .6 * s); g.fill(); g.strokeStyle = '#e6c76a'; g.lineWidth = .3 * s; g.beginPath(); g.moveTo(x - .3 * s, hk - .4 * s); g.lineTo(x + .3 * s, hk - .4 * s); g.stroke() }
    g.restore();
  }
  function gesicht(g, x, hk, s, f, t, frau) {
    const m = f.mimik || 'laecheln', blink = (Math.sin(t * 1.3 + (f.ph || 0) * 3) > .985);
    const ey = hk - .2 * s;
    // Lidschatten nach dem Make-up
    if (f.makeup) { g.fillStyle = 'rgba(214,90,170,.45)'; for (const k of [-1, 1]) { g.beginPath(); g.ellipse(x + k * 1.2 * s, ey - .45 * s, .75 * s, .38 * s, 0, 0, 7); g.fill() } }
    // Augen
    g.fillStyle = '#1b1410';
    for (const k of [-1, 1]) {
      const zu = blink || (m === 'zwinkern' && k === 1 && Math.sin(t * .8 + (f.ph || 0)) > .2) || m === 'lachen';
      if (zu) { g.strokeStyle = '#1b1410'; g.lineWidth = .35 * s; g.beginPath(); g.arc(x + k * 1.2 * s, ey + .2 * s, .55 * s, Math.PI * 1.1, Math.PI * 1.9); g.stroke() }
      else { g.beginPath(); g.ellipse(x + k * 1.2 * s, ey, .42 * s, .52 * s, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.arc(x + k * 1.2 * s + .12 * s, ey - .15 * s, .13 * s, 0, 7); g.fill(); g.fillStyle = '#1b1410' }
      if (frau) { g.strokeStyle = '#1b1410'; g.lineWidth = .25 * s; g.beginPath(); g.moveTo(x + k * 1.65 * s, ey - .2 * s); g.lineTo(x + k * 2.05 * s, ey - .55 * s); g.stroke() }
    }
    // Brauen: kühl gerade, selbstbewusst eine hochgezogen
    g.strokeStyle = shade(f.hair, .7); g.lineWidth = .3 * s;
    for (const k of [-1, 1]) { const hoch = m === 'selbstbewusst' && k === 1 ? .35 : 0; g.beginPath(); g.moveTo(x + k * .6 * s, ey - 1.05 * s - hoch * s); g.lineTo(x + k * 1.8 * s, ey - (m === 'kuehl' ? 1.05 : 1.25) * s - hoch * s); g.stroke() }
    // Botox: glatter Glanz auf der Stirn
    if (f.botox) { g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(x - .6 * s, hk - 2 * s, 1.2 * s, .35 * s, -.2, 0, 7); g.fill() }
    // Wangen
    if (frau) { g.fillStyle = 'rgba(232,120,140,.22)'; for (const k of [-1, 1]) { g.beginPath(); g.ellipse(x + k * 1.9 * s, hk + 1.1 * s, .8 * s, .45 * s, 0, 0, 7); g.fill() } }
    // Mund
    const my = hk + 1.9 * s, lip = f.lippe || (frau ? '#b5596a' : '#9a5a4e');
    if (m === 'lachen') { g.fillStyle = '#5a1a22'; g.beginPath(); g.ellipse(x, my, 1.1 * s, .75 * s, 0, 0, Math.PI); g.fill(); g.fillStyle = '#fff'; g.fillRect(x - .8 * s, my, 1.6 * s, .25 * s) }
    else if (m === 'kuehl') { g.strokeStyle = lip; g.lineWidth = .55 * s; g.beginPath(); g.moveTo(x - .8 * s, my); g.lineTo(x + .8 * s, my); g.stroke() }
    else if (m === 'selbstbewusst') { g.strokeStyle = lip; g.lineWidth = .55 * s; g.beginPath(); g.moveTo(x - .8 * s, my + .1 * s); g.quadraticCurveTo(x + .2 * s, my + .35 * s, x + 1 * s, my - .3 * s); g.stroke() }
    else { g.strokeStyle = lip; g.lineWidth = (f.lippenVoll ? 1.1 : .6) * s; g.beginPath(); g.arc(x, my - .5 * s, .95 * s, .2 * Math.PI, .8 * Math.PI); g.stroke() }
    if (f.lippenVoll && m !== 'lachen') { g.fillStyle = lip; g.beginPath(); g.ellipse(x, my + .1 * s, .9 * s, .38 * s, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(x - .3 * s, my - .05 * s, .5 * s, .12 * s) }
  }
  function shade(hex, f) { if (!hex || hex[0] !== '#') return hex || '#888'; const n = parseInt(hex.slice(1), 16); return 'rgb(' + [n >> 16, n >> 8 & 255, n & 255].map(v => Math.min(255, Math.round(v * f))).join(',') + ')' }
  return { CHARS, TASCHE, tasche, zeichne };
})();
