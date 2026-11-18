// Glow City · orte.js · Orte mit eigener Bühne statt nur Innenraum: Luba Arena (Auftritte) und CoWork Tower (Fortbildungen).
// Betritt man den Ort, öffnet sich zuerst das Ortsfenster; Tickets bzw. Büro bleiben über einen Knopf erreichbar.
// Jeder Auftritt und jede Fortbildung einmal am Tag. Neue Auftritte oder Kurse sind nur Einträge in AUFTRITTE bzw. SCHULUNGEN.
const AUFTRITTE = [
  { id: 'meet', icon: '🤳', name: 'Meet & Greet mit deinen Fans', ab: 1000, text: 'Selfies, Autogramme, Fragen zu Behandlungen.' },
  { id: 'keynote', icon: '🎤', name: 'Keynote: Die Zukunft der Ästhetik', ab: 50000, text: '8.000 Zuschauer, du erklärst, was moderne Ästhetik kann.' },
  { id: 'botox', icon: '💉', name: 'Massen-Botox-Event', ab: 250000, text: '15 Sekunden, so viele Kundinnen wie möglich. Tipp jede Kundin an, sobald sie erscheint.' },
  { id: 'konzert', icon: '🎸', name: 'Glow Night: Dein Auftritt als Rockstar', ab: 1000000, text: 'Du stehst auf der Bühne der Luba Arena. Feuerwerk inklusive.' }
];
const SCHULUNGEN = [
  { id: 'hygiene', icon: '🧼', name: 'Hygiene und Notfallmanagement', kosten: 500, wirkung: { sterne: .1 } },
  { id: 'botox', icon: '💉', name: 'Masterclass Botulinum im Gesicht', kosten: 2000, wirkung: { meister: ['botox', 15], anerkennung: 10 } },
  { id: 'lippen', icon: '💋', name: 'Masterclass Lippen und Konturen', kosten: 3000, wirkung: { meister: ['lippen', 15], anerkennung: 10 } },
  { id: 'social', icon: '📲', name: 'Social-Media-Workshop für Ärztinnen', kosten: 4000, wirkung: { follower: 1500 } },
  { id: 'fuehrung', icon: '👩‍⚕️', name: 'Teamführung in der Praxis', kosten: 6000, wirkung: { anerkennung: 20 } },
  { id: 'laser', icon: '🔆', name: 'Zertifikat Lasertherapie', kosten: 8000, wirkung: { meister: ['laser', 15], anerkennung: 15 } },
  { id: 'business', icon: '📈', name: 'Praxis-Business: Preise und Marketing', kosten: 12000, wirkung: { sterne: .05, follower: 800 } }
];
const heuteGemacht = (art, id) => ((ST[art] || {})[id]) === new Date().toDateString();
const merkeHeute = (art, id) => { ST[art] = ST[art] || {}; ST[art][id] = new Date().toDateString() };
function ortPanel(b) { if (b._direkt) { delete b._direkt; return false } if (b.title === 'Luba Arena') { arenaBuehne(b); return true } if (b.title === 'CoWork Tower') { fortbildung(b); return true } return false }
function ortKnopf(cb, text, b) { const z = el_('button', 'zweit ortknopf', text); z.onclick = () => { document.getElementById('card').hidden = true; b._direkt = true; betreten(b) }; cb.append(z) }
// ---------- Luba Arena ----------
function arenaBuehne(b) { const cb = panel('🎤 Luba Arena · Deine Bühne'), f = ST.follower || 0, k = klinikStand();
  cb.append(el_('p', 'hin', `Je bekannter du bist, desto größer die Bühne. Du hast ${f.toLocaleString('de-DE')} Follower.`));
  for (const a of AUFTRITTE) { const frei = f >= a.ab, heute = heuteGemacht('auftritte', a.id), r = el_('div', 'freundin' + (frei && !heute ? ' live' : '')), l = el_('div');
    l.append(el_('b', null, `${a.icon} ${a.name}`), el_('small', null, frei ? a.text : `ab ${a.ab.toLocaleString('de-DE')} Followern`));
    const bt = el_('button', 'cta', !frei ? 'Gesperrt' : heute ? 'Morgen wieder' : 'Auftreten'); bt.disabled = !frei || heute; bt.onclick = () => auftreten(a.id, k); r.append(l, bt); cb.append(r) }
  ortKnopf(cb, '🎟️ Zu den Tickets für Konzerte', b) }
function auftreten(id, k) { if (heuteGemacht('auftritte', id)) return; const f = ST.follower || 0;
  if (id === 'botox') { document.getElementById('card').hidden = true; massenBotox(); return } merkeHeute('auftritte', id); document.getElementById('card').hidden = true;
  if (id === 'meet') { const fol = Math.max(200, Math.round(f * .02)); ST.follower = f + fol; ST.stil += 10; banner('🤳 MEET & GREET', '300 Fans, 1.000 Selfies', `+${fol.toLocaleString('de-DE')} Follower · +10 Stil`) }
  if (id === 'keynote') { const gage = Math.max(5000, Math.round(ertragProStunde(k, 'aktiv') * 3)), fol = Math.round(f * .05); ST.geld += gage; ST.follower = f + fol; k.anerkennung = (k.anerkennung || 0) + 25; banner('🎤 STANDING OVATION', 'Deine Keynote in der Luba Arena', `+${euro(gage)} · +${fol.toLocaleString('de-DE')} Follower · Anerkennung +25`) }
  if (id === 'konzert') { const gage = Math.round(f * .5), fol = Math.round(f * .08); ST.geld += gage; ST.follower = f + fol; ST.stil += 200; window.ARENA_SHOW = Date.now(); banner('🎸 GLOW NIGHT', 'Die Luba Arena tobt', `+${euro(gage)} · +${fol.toLocaleString('de-DE')} Follower · +200 Stil`) }
  if (typeof news === 'function') news(`${(ST.profil && ST.profil.handle) || 'Eine Ärztin'} steht gerade auf der Bühne der Luba Arena`); save(); hud() }
// Massen-Botox: 15 Sekunden, Kundinnen erscheinen an zufälligen Plätzen im Saal, jeder Treffer zählt als Behandlung
function massenBotox() { let el = document.getElementById('massen'); if (!el) { el = document.createElement('div'); el.id = 'massen'; el.className = 'opspiel'; document.body.append(el) }
  el.replaceChildren(); const cv = document.createElement('canvas'), info = el_('p', 'opauftrag', 'Tipp jede Kundin an, sobald sie leuchtet'), fuss = el_('div', 'opfuss'); cv.width = cv.height = 360; cv.className = 'opfeld';
  el.append(el_('small', 'bkopf', '💉 Luba Arena · Massen-Botox-Event'), el_('h3', null, '15 Sekunden'), info, cv, fuss); el.hidden = false;
  const g = cv.getContext('2d'), ende = Date.now() + 15000; let ziel = null, treffer = 0, fehl = 0;
  const neu = () => { ziel = { x: 40 + Math.random() * 280, y: 40 + Math.random() * 280, bis: Date.now() + 900 } }; neu();
  cv.onpointerdown = e => { const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * 360 / r.width, y = (e.clientY - r.top) * 360 / r.height; if (ziel && Math.hypot(ziel.x - x, ziel.y - y) < 34) { treffer++; neu() } else fehl++ };
  (function lauf() { const t = Date.now(); if (t > ende) return fertig(); if (t > ziel.bis) neu();
    g.fillStyle = '#1d1426'; g.fillRect(0, 0, 360, 360); for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { g.fillStyle = 'rgba(255,255,255,.05)'; g.beginPath(); g.arc(30 + i * 60, 30 + j * 60, 22, 0, 7); g.fill() }
    g.fillStyle = '#ff4fa3'; g.beginPath(); g.arc(ziel.x, ziel.y, 26 + Math.sin(t / 80) * 3, 0, 7); g.fill(); g.font = '30px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('💁‍♀️', ziel.x, ziel.y);
    g.fillStyle = '#fff'; g.font = '800 16px Inter, sans-serif'; g.fillText(`${treffer} behandelt · ${Math.ceil((ende - t) / 1000)} Sek.`, 180, 344); requestAnimationFrame(lauf) })();
  function fertig() { merkeHeute('auftritte', 'botox'); const k = klinikStand(), b = behandlung('botox'), betrag = Math.round(honorar(b, k, false) * 4 * treffer), fol = treffer * 150;
    for (let i = 0; i < treffer; i++) if (typeof meisterZaehlen === 'function') meisterZaehlen(k, 'botox');
    g.fillStyle = 'rgba(18,12,28,.9)'; g.fillRect(0, 0, 360, 360); g.fillStyle = '#fff'; g.font = '900 54px Inter, sans-serif'; g.fillText(String(treffer), 180, 160); g.font = '700 15px Inter, sans-serif'; g.fillText('Kundinnen in 15 Sekunden', 180, 196);
    info.textContent = treffer >= 12 ? 'Rekordverdächtig.' : treffer >= 7 ? 'Starke Show.' : 'Das Publikum will mehr.';
    const ok = el_('button', 'cta opkasse', `💶 Kassieren ${euro(betrag)}`); ok.onclick = () => { ST.geld += betrag; ST.follower = (ST.follower || 0) + fol; k.umsatz += betrag; save(); hud(); el.hidden = true; banner('💉 MASSEN-BOTOX', `${treffer} Kundinnen in 15 Sekunden`, `+${euro(betrag)} · +${fol.toLocaleString('de-DE')} Follower`) };
    fuss.replaceChildren(el_('p', 'opinfo', `+${fol.toLocaleString('de-DE')} Follower · Botox-Meisterschaft +${treffer}`), ok) } }
// ---------- CoWork Tower: Fortbildungen ----------
// Vor jedem Kurs eine Lernfrage aus den Aufklärungsblättern: richtig beantwortet verdoppelt sich die Wirkung
function fortbildung(b) { const cb = panel('🎓 CoWork Tower · Fortbildungen'), k = klinikStand();
  cb.append(el_('p', 'hin', 'Bilde dich weiter wie eine echte Ästhetikärztin. Jeder Kurs einmal am Tag. Vorher eine Frage: richtig beantwortet, doppelte Wirkung.'));
  for (const s of SCHULUNGEN) { const heute = heuteGemacht('kurse', s.id), r = el_('div', 'freundin'), l = el_('div'), w = s.wirkung;
    const wtext = [w.sterne ? `+${w.sterne.toString().replace('.', ',')} ★` : '', w.meister ? `${behandlung(w.meister[0]) ? behandlung(w.meister[0]).name : ''} +${w.meister[1]} Meisterschaft` : '', w.anerkennung ? `Anerkennung +${w.anerkennung}` : '', w.follower ? `+${w.follower.toLocaleString('de-DE')} Follower` : ''].filter(Boolean).join(' · ');
    l.append(el_('b', null, `${s.icon} ${s.name}`), el_('small', null, wtext)); const bt = el_('button', 'cta', heute ? 'Morgen wieder' : euro(s.kosten)); bt.disabled = heute || ST.geld < s.kosten; bt.onclick = () => kursStarten(s.id); r.append(l, bt); cb.append(r) }
  ortKnopf(cb, '💼 Ins Büro (Arbeit einchecken)', b) }
function kursStarten(id) { const s = SCHULUNGEN.find(x => x.id === id); if (!s || heuteGemacht('kurse', id) || ST.geld < s.kosten) return; const cb = panel(`${s.icon} ${s.name}`), f = typeof kspielFrage === 'function' ? kspielFrage(new Set()) : null;
  if (!f) return kursFertig(s, false); cb.append(el_('p', 'hin', 'Einstiegsfrage des Kurses:'), el_('b', null, f.frage));
  for (const a of f.antworten) { const bt = el_('button', 'zweit kursantwort', a); bt.onclick = () => { const ok = a === f.richtig; cb.querySelectorAll('.kursantwort').forEach(x => { x.disabled = true; if (x.textContent === f.richtig) x.classList.add('richtig') }); if (!ok) bt.classList.add('falsch');
    cb.append(el_('p', 'hin', ok ? 'Richtig. Doppelte Wirkung.' : `Richtig wäre: ${f.richtig}`)); const w = el_('button', 'cta', 'Kurs abschließen'); w.onclick = () => kursFertig(s, ok); cb.append(w) }; cb.append(bt) } }
function kursFertig(s, doppelt) { if (heuteGemacht('kurse', s.id) || ST.geld < s.kosten) return; const k = klinikStand(), x = doppelt ? 2 : 1, w = s.wirkung; ST.geld -= s.kosten; merkeHeute('kurse', s.id);
  if (w.sterne) k.sterne = Math.min(5, k.sterne + w.sterne * x); if (w.anerkennung) k.anerkennung = (k.anerkennung || 0) + w.anerkennung * x; if (w.follower) ST.follower = (ST.follower || 0) + w.follower * x;
  if (w.meister && typeof meisterZaehlen === 'function') for (let i = 0; i < w.meister[1] * x; i++) meisterZaehlen(k, w.meister[0]);
  document.getElementById('card').hidden = true; banner('🎓 FORTBILDUNG ABGESCHLOSSEN', s.name, doppelt ? 'Doppelte Wirkung durch die richtige Antwort' : 'Zertifikat erhalten'); save(); hud() }
