// Berlin · glowscore.js · Der Respekt: ein Hauptwert, auf den alles einzahlt. Er bestimmt deinen Rang in der Stadt.
// Alle Einzelwerte bleiben (Stil, Vermögen, Follower, Klinik, Meisterschaft, Pokale, Anerkennung), der Score fasst sie zusammen.
// Große Zahlen wachsen über Wurzeln, damit niemand mit nur einem Wert davonzieht: wer überall gut ist, steht oben.
const SCORE_TEILE = [
  { id: 'stil', name: 'Stil', icon: '💅', wert: () => (ST.stil || 0) * 10 },
  { id: 'verm', name: 'Vermögen', icon: '💰', wert: () => Math.sqrt(Math.max(0, meinVermoegen())) * 2 },
  { id: 'fol', name: 'Follower', icon: '📱', wert: () => Math.sqrt(ST.follower || 0) * 25 },
  { id: 'klinik', name: 'Klinik', icon: '🩺', wert: () => { const k = ST.klinik; return k ? Math.sqrt(k.umsatz || 0) * 4 + (k.sterne || 3) * 600 + (k.behandelt || 0) * 15 : 0 } },
  { id: 'meister', name: 'Meisterschaft', icon: '◆', wert: () => typeof meisterStufe === 'function' && ST.klinik ? KQ.BEHANDLUNGEN.reduce((s, b) => s + meisterStufe(ST.klinik, b.id), 0) * 400 : 0 },
  { id: 'pokale', name: 'Pokale', icon: '🏆', wert: () => { const p = (ST.klinik && ST.klinik.pokale) || {}; return (p.Gold || 0) * 5000 + (p.Silber || 0) * 3000 + (p.Bronze || 0) * 1500 } },
  { id: 'anerkennung', name: 'Anerkennung', icon: '🎤', wert: () => ((ST.klinik && ST.klinik.anerkennung) || 0) * 25 },
  { id: 'marke', name: 'Eigene Marke', icon: '🧴', wert: () => ST.marke ? 4000 + Object.keys(ST.marke.produkte).length * 3000 : 0 },
  { id: 'kollektion', name: 'Kollektion', icon: '👜', wert: () => Object.keys(ST.album || {}).length * 150 }
];
const glowScore = () => Math.round(SCORE_TEILE.reduce((s, t) => s + t.wert(), 0));
// Bewohnerinnen ohne Klinik: Score aus Stil, Vermögen und Followern; echte Spielerinnen bringen ihren Score aus dem Profil mit
const scoreVon = pr => pr.p === ICH ? glowScore() : pr.score != null ? pr.score : Math.round((pr.stil || 0) * 10 + Math.sqrt(pr.verm || 0) * 2 + Math.sqrt(pr.fol || 0) * 25);
function scoreAufbau(cb) { const h = el_('h4', null, 'So setzt sich dein Respekt zusammen'), box = el_('div', 'scoreteile'), ges = glowScore() || 1;
  for (const t of SCORE_TEILE) { const w = Math.round(t.wert()), r = el_('div', 'scoreteil'), bar = el_('i'); const sb = el_('em', 'sbalken'); sb.append(bar); r.append(el_('span', null, `${t.icon} ${t.name}`), el_('b', null, w.toLocaleString('de-DE')), sb); bar.style.width = Math.min(100, w / ges * 100) + '%'; box.append(r) }
  cb.append(h, box) }
