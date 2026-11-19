// Berlin · kongresse.js · Kongresse, Messen und Vorträge der Ärztin, Sterneverfall und die Statusleiste (Reise, Glow-Boost)
// Du reist in echter Zeit ab. In der Zeit führt dein Team die Praxis (Stufe 2), du kannst nicht selbst behandeln.
// Zurück gibt es Honorar, Follower, Sterne und einen Glow-Boost. Wer länger als 2 Tage auf keinem Kongress war, verliert langsam Sterne.
function kongressWeiter(k, jetzt) { const S = KQ.STERNE;
  if (k.reise && jetzt >= k.reise.bis) { const kg = KQ.KONGRESSE.find(x => x.id === k.reise.id); const anteilWar = (k.reise || {}).anteil || 1; k.reise = null; if (kg) { const fol = Math.round(kg.follower * anteilWar);
      const anteil = anteilWar, gage = Math.round(kg.honorar * anerkennungStufe(k).faktor * anteil); ST.geld += gage; ST.follower = (ST.follower || 0) + fol; k.followerPlus = (k.followerPlus || 0) + fol; k.sterne = Math.min(5, k.sterne + kg.sterne * anteilWar); k.kongressZuletzt = jetzt; k.verfallStand = 0;
      boostGeben(k, .3, kg.boost, `Zurück aus ${kg.ort}`); banner(kg.art.toUpperCase() + ' · ' + kg.ort.toUpperCase(), kg.name, [gage ? `+${euro(gage)}` : '', `+${fol.toLocaleString('de-DE')} Follower`, `+${(kg.sterne * anteilWar).toFixed(2).replace('.', ',')} ★`].filter(Boolean).join(' · ')); xpGeben(Math.round(fol / 20)); merkblattMerken(k, kg.id); save(); hud() } }
  const seit = k.kongressZuletzt || (k.kongressZuletzt = jetzt), ab = Math.max(seit + S.verfallNach, k.verfallStand || 0);
  if (!unterwegs(k) && jetzt > ab + 6e4 && k.sterne > S.boden) { k.sterne = Math.max(S.boden, k.sterne - (jetzt - ab) / 864e5 * S.verfallProTag); k.verfallStand = jetzt } }
// Früher zurückfliegen: du bekommst den Anteil an Gage, Followern und Sternen, der der Zeit vor Ort entspricht (mindestens ein Viertel)
function kongressAbbrechen() { const k = klinikStand(); if (!unterwegs(k)) return; const kg = KQ.KONGRESSE.find(x => x.id === k.reise.id), start = k.reise.bis - kg.dauer * 1000;
  k.reise.anteil = Math.max(.25, Math.min(1, (Date.now() - start) / (kg.dauer * 1000))); k.reise.bis = Date.now(); klinikWeiter(); aktivSein(k); save(); hud(); if (KLINIK.offen) klinikZeichnen() }
const kongressFrei = (k, kg) => !k.kongressTag || !k.kongressTag[kg.id] || Date.now() - k.kongressTag[kg.id] > 864e5;
function kongressStarten(id) { const k = klinikStand(), kg = KQ.KONGRESSE.find(x => x.id === id); if (!kg || unterwegs(k) || k.sterne < kg.ab || ST.geld < kg.kosten || !kongressFrei(k, kg)) return;
  if (kg.kosten) ausgeben(k, kg.kosten, 'reisen'); k.reise = { id, bis: Date.now() + kg.dauer * 1000 }; k.aktivBis = 0; k.kongressTag = k.kongressTag || {}; k.kongressTag[id] = Date.now();
  banner('GUTE REISE', `${kg.icon} ${kg.ort}`, `Dein Team führt die Praxis. Zurück in ${dauer(kg.dauer)}`); save(); hud(); klinikZeichnen() }
// Kongresse im Social-Reiter
function kongressBereich(k, body) { body.append(el_('h4', null, 'Kongresse und Messen'));
  const st = anerkennungStufe(k), nx = ANERKENNUNG.find(x => x.ab > (k.anerkennung || 0)); body.append(el_('p', 'hin', `Deine Anerkennung: ${k.anerkennung || 0} · ${st.name}${st.faktor > 1 ? ` · Vortragsgagen x${st.faktor}` : ''}${nx ? ` · ab ${nx.ab} Gagen x${nx.faktor}. Anerkennung sammelst du, wenn du selbst behandelst und operierst.` : ''}`));
  const tage = (Date.now() - (k.kongressZuletzt || Date.now())) / 864e5; body.append(el_('p', 'hin', tage > 2 ? 'Deine Sterne sinken, weil du über 2 Tage auf keinem Kongress warst.' : 'Halte Vorträge und zeig dich auf Messen. Wer 2 Tage fehlt, verliert langsam Sterne.'));
  if (unterwegs(k)) { if (!k.reise.spiel) { const sp = el_('button', 'cta', '🎲 Kongress-Spiel: gewinnen und sofort zurück'); sp.onclick = kongressSpiel; body.append(sp) } const z = el_('button', 'cta', '✈️ Jetzt zurückfliegen'); z.onclick = kongressAbbrechen; body.append(z) }
  for (const kg of KQ.KONGRESSE) { const r = el_('div', 'freundin'), l = el_('div'), n = el_('b', null, `${kg.icon} ${kg.name}`);
    l.append(n, el_('small', null, `${kg.ort} · ${kg.art} · ${dauer(kg.dauer)} · ${[kg.honorar ? '+' + euro(kg.honorar * anerkennungStufe(k).faktor) : '', '+' + kg.follower.toLocaleString('de-DE') + ' Follower', '+' + kg.sterne.toFixed(2).replace('.', ',') + ' ★'].filter(Boolean).join(' · ')}`));
    const frei = kongressFrei(k, kg), weg = unterwegs(k), bt = el_('button', 'cta', weg ? 'Unterwegs' : k.sterne < kg.ab ? `ab ${kg.ab.toFixed(1).replace('.', ',')} ★` : !frei ? 'Morgen wieder' : kg.kosten ? `Reisen · ${euro(kg.kosten)}` : 'Hingehen');
    bt.disabled = weg || k.sterne < kg.ab || !frei || ST.geld < kg.kosten; bt.onclick = () => kongressStarten(kg.id); r.append(l, bt); body.append(r) }
  // Gesammelte Merkblätter
  if ((k.merkblaetter || []).length) { body.append(el_('h4', null, 'Deine Merkblätter')); const reihe = el_('div', 'merkreihe');
    for (const id of k.merkblaetter) { const kg = KQ.KONGRESSE.find(x => x.id === id); if (!kg) continue; const b = el_('button', null, `${kg.icon} ${kg.ort}`); b.onclick = () => merkblattZeigen(id); reihe.append(b) } body.append(reihe) } }
// Statusleiste im Praxis-Reiter: unterwegs oder Glow-Boost
function statusLeiste(k) { const r = el_('div', 'statusleiste'), t = el_('span'), sp = el_('button', 'spiel', '🎲 Spielen'), zur = el_('button', null, '✈️ Zurück'); zur.onclick = kongressAbbrechen; sp.onclick = kongressSpiel; r.append(t, sp, zur);
  const live = () => { const jetzt = Date.now(); if (unterwegs(k)) { const kg = KQ.KONGRESSE.find(x => x.id === k.reise.id); r.hidden = false; r.className = 'statusleiste reise'; zur.hidden = false; sp.hidden = !!k.reise.spiel; t.textContent = `Du bist in ${kg.ort}. Dein Team führt die Praxis · zurück in ${dauer(Math.ceil((k.reise.bis - jetzt) / 1000))}` }
    else if (boostWert(k)) { r.hidden = false; r.className = 'statusleiste boost'; zur.hidden = true; sp.hidden = true; t.textContent = `✨ Glow-Boost · Honorare +${Math.round(boostWert(k) * 100)} % · noch ${dauer(Math.ceil((k.boostBis - jetzt) / 1000))}` } else r.hidden = true };
  live(); KLINIK_LIVE.push(live); return r }
