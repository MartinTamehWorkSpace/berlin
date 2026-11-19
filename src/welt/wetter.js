// Berlin · wetter.js · Berliner Wetter: oft grau, häufig Nieselregen, selten Gewitter. Wechselt alle zwei Spielstunden.
const WETTER = { regen: 0, ziel: 0, naechste: UHR.min + 120, blitz: 0 };
const TROPFEN = Array.from({ length: 260 }, (_, i) => ({ x: Math.random(), y: Math.random(), v: .8 + Math.random() * .6, l: .6 + Math.random() * .6 }));
function wetterWeiter(dt) {
  if (UHR.min > WETTER.naechste) { WETTER.naechste = UHR.min + 120; const r = Math.random(); WETTER.ziel = r < .3 ? .25 + Math.random() * .2 : r < .4 ? .7 + Math.random() * .3 : 0; if (WETTER.ziel) toast(WETTER.ziel > .6 ? 'Platzregen über Berlin ☔' : 'Nieselregen. Typisch Berlin.') }
  WETTER.regen += (WETTER.ziel - WETTER.regen) * Math.min(1, dt * .4);
  const nachts = HIMMEL_JETZT.dunkel > .25; if (WETTER.regen > .5 && nachts && Math.random() < dt * .08) WETTER.blitz = 1; WETTER.blitz = Math.max(0, WETTER.blitz - dt * 3) }
function wetterZeichnen() { const r = WETTER.regen; if (r < .02 && WETTER.blitz <= 0) return;
  g.fillStyle = `rgba(40,50,80,${r * .22})`; g.fillRect(0, 0, W, H);
  g.strokeStyle = `rgba(200,220,255,${.35 * r})`; g.lineWidth = Math.max(1, DPR); g.beginPath(); const n = Math.round(TROPFEN.length * r);
  for (let i = 0; i < n; i++) { const d = TROPFEN[i]; d.y += d.v * .025; d.x -= .004; if (d.y > 1) { d.y -= 1; d.x = Math.random() } if (d.x < 0) d.x += 1;
    const x = d.x * W, y = d.y * H, l = 18 * d.l * DPR; g.moveTo(x, y); g.lineTo(x - l * .25, y + l) }
  g.stroke();
  if (WETTER.blitz > 0) { g.fillStyle = `rgba(230,220,255,${WETTER.blitz * .35})`; g.fillRect(0, 0, W, H) } }
