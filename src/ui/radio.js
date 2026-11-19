// Berlin City · radio.js · Drei Radiosender mit selbst erzeugter Musik im 80er-Stil (Web Audio, keine Fremdmusik)
// Knopf "Radio" schaltet weiter: aus, Glow FM, Palm Radio, Club Neon. Startet erst nach einem Klick (Browser-Regel).
const SENDER = [
  { name: 'Glow FM', stil: 'Synthwave', bpm: 104, akk: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], arp: true, drums: 'gross', farbe: '#ff4fa3' },
  { name: 'Palm Radio', stil: 'Chill', bpm: 84, akk: [[50, 53, 57, 60], [55, 59, 62, 65], [48, 52, 55, 59], [53, 57, 60, 64]], arp: false, drums: 'leise', farbe: '#2fe0d2' },
  { name: 'Club Neon', stil: 'Dance', bpm: 124, akk: [[57, 60, 64], [57, 60, 64], [53, 57, 60], [55, 59, 62]], arp: true, drums: 'club', farbe: '#b79cff' }
];
const RADIO = { an: -1, ctx: null, master: null, hall: null, takt: 0, naechste: 0, uhr: null };
const hz = n => 440 * Math.pow(2, (n - 69) / 12);
function radioStart() { if (RADIO.ctx) return; const c = new (window.AudioContext || window.webkitAudioContext)(); RADIO.ctx = c;
  RADIO.master = c.createGain(); RADIO.master.gain.value = .32; RADIO.master.connect(c.destination);
  // Echo für den Raumklang
  const d = c.createDelay(); d.delayTime.value = .33; const fb = c.createGain(); fb.gain.value = .28; const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2400;
  d.connect(f); f.connect(fb); fb.connect(d); f.connect(RADIO.master); RADIO.hall = d }
function ton(typ, n, t, dauer, laut, ziel, filt) { const c = RADIO.ctx, o = c.createOscillator(), gn = c.createGain(); o.type = typ; o.frequency.value = hz(n);
  let k = o; if (filt) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(filt, t); f.frequency.exponentialRampToValueAtTime(Math.max(200, filt / 4), t + dauer); o.connect(f); k = f }
  k.connect(gn); gn.connect(RADIO.master); if (ziel) gn.connect(ziel);
  gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(laut, t + Math.min(.02, dauer / 4)); gn.gain.exponentialRampToValueAtTime(.0001, t + dauer); o.start(t); o.stop(t + dauer + .05) }
function rauschen(t, dauer, laut, hp) { const c = RADIO.ctx, len = Math.floor(c.sampleRate * dauer), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len); const s = c.createBufferSource(); s.buffer = buf; const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; const gn = c.createGain(); gn.gain.value = laut;
  s.connect(f); f.connect(gn); gn.connect(RADIO.master); s.start(t) }
function kick(t, laut) { const c = RADIO.ctx, o = c.createOscillator(), gn = c.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + .18);
  gn.gain.setValueAtTime(laut, t); gn.gain.exponentialRampToValueAtTime(.001, t + .3); o.connect(gn); gn.connect(RADIO.master); o.start(t); o.stop(t + .32) }
// Ein Sechzehntel nach dem anderen planen, immer etwas voraus
function radioTakt() { const s = SENDER[RADIO.an]; if (!s) return; const c = RADIO.ctx, sech = 60 / s.bpm / 4;
  while (RADIO.naechste < c.currentTime + .2) { const t = RADIO.naechste, i = RADIO.takt % 16, akk = s.akk[Math.floor(RADIO.takt / 16) % s.akk.length];
    if (i === 0) for (const n of akk) ton('sawtooth', n, t, sech * 16, .035, RADIO.hall, 1800);
    if (s.drums !== 'leise' ? i % 2 === 0 : i % 4 === 0) ton('sawtooth', akk[0] - 24 + (i % 8 === 6 ? 7 : 0), t, sech * 1.8, .12, null, 900);
    if (s.arp && i % 2 === 0) ton('square', akk[(i / 2) % akk.length] + 12, t, sech * 1.5, .035, RADIO.hall, 3200);
    if (!s.arp && i % 4 === 2) ton('triangle', akk[(i / 4 | 0) % akk.length] + 24, t, sech * 3, .05, RADIO.hall);
    if (s.drums === 'club' ? i % 4 === 0 : i % 8 === 0) kick(t, s.drums === 'leise' ? .35 : .7);
    if (s.drums !== 'leise' && i % 8 === 4) rauschen(t, .22, .25, 1200);
    if (s.drums !== 'leise' && i % 2 === 1) rauschen(t, .05, s.drums === 'club' ? .12 : .07, 7000);
    RADIO.naechste += sech; RADIO.takt++ } }
function radioWeiter() { radioStart(); if (RADIO.ctx.state === 'suspended') RADIO.ctx.resume();
  RADIO.an = RADIO.an + 1 >= SENDER.length ? -1 : RADIO.an + 1; const el = document.getElementById('radioAnz'), btn = document.getElementById('bRadio');
  clearInterval(RADIO.uhr);
  if (RADIO.an < 0) { RADIO.master.gain.setTargetAtTime(0, RADIO.ctx.currentTime, .1); el.hidden = true; btn.textContent = 'Radio'; return }
  const s = SENDER[RADIO.an]; RADIO.master.gain.setTargetAtTime(.32, RADIO.ctx.currentTime, .1); RADIO.takt = 0; RADIO.naechste = RADIO.ctx.currentTime + .05; RADIO.uhr = setInterval(radioTakt, 50);
  el.hidden = false; el.style.setProperty('--sender', s.farbe); el.querySelector('b').textContent = s.name; el.querySelector('span').textContent = s.stil; btn.textContent = s.name }
document.getElementById('bRadio').onclick = radioWeiter;
