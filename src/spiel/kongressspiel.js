// Berlin City · kongressspiel.js · Dein Vortrag auf dem Kongress: das Publikum stellt Fragen aus den Aufklärungsblättern, du antwortest unter Zeitdruck.
// Richtig = Applaus (Serie und Tempo geben mehr), falsch oder zu langsam = ein Mikrofon weniger (3 Mikros). Applaus voll = Standing Ovations:
// sofort zurück mit voller Gage und Siegerbonus. Sonst verkürzt sich die Reise um den erreichten Applaus. Ein Vortrag pro Reise.
// Am Ende steht, was du mitnimmst: jede Frage mit der richtigen Antwort.
const VORTRAG = { zeit: 9, fragen: 12, mikros: 3, applausRichtig: 11, serie: 4, schnell: 5 };
// Fragen entstehen aus den Aufklärungsblättern: richtige Antwort von dieser Behandlung, falsche von zwei anderen
function kspielFrage(benutzt) { const A = window.GLOW_AUFKLAERUNG && window.GLOW_AUFKLAERUNG.BEHANDLUNGEN; if (!A) return null;
  const ids = Object.keys(A).filter(id => behandlung(id)), arten = [['haelt', b => `Wie lange hält ${b}?`], ['ausfall', b => `Wie lange ist die Ausfallzeit nach ${b}?`], ['ablauf', b => `Wie läuft ${b} ab?`], ['material', b => `Womit wird bei ${b} gearbeitet?`]];
  for (let n = 0; n < 30; n++) { const id = ids[Math.floor(Math.random() * ids.length)], [feld, frage] = arten[Math.floor(Math.random() * arten.length)], key = id + feld; if (benutzt.has(key)) continue;
    const richtig = A[id][feld]; if (!richtig) continue; const falsch = [...new Set(ids.filter(x => x !== id).map(x => A[x][feld]).filter(t => t && t !== richtig))].sort(() => Math.random() - .5).slice(0, 2); if (falsch.length < 2) continue;
    benutzt.add(key); return { frage: frage(behandlung(id).name), richtig, antworten: [richtig, ...falsch].sort(() => Math.random() - .5) } } return null }
function kongressSpiel() { const k = klinikStand(); if (!unterwegs(k)) return; if (k.reise.spiel) { toast('Auf dieser Reise hast du schon vorgetragen'); return }
  const kg = KQ.KONGRESSE.find(x => x.id === k.reise.id); let el = document.getElementById('kSpiel'); if (!el) { el = document.createElement('div'); el.id = 'kSpiel'; el.className = 'opspiel kspiel'; document.body.append(el) }
  el.replaceChildren(); const zu = el_('button', 'bzu', '×'); zu.onclick = () => { aus = true; el.hidden = true };
  const kopf = el_('small', 'bkopf', `${kg.icon} ${kg.name}`), titel = el_('h3', null, '🎤 Dein Vortrag'), publikum = el_('div', 'vpublikum'), applaus = el_('div', 'vapplaus'), abar = el_('i'), atext = el_('span'),
    status = el_('div', 'vstatus'), frageEl = el_('div', 'vfrage'), zeit = el_('div', 'vzeit'), zbar = el_('i'), antworten = el_('div', 'vantworten'), fuss = el_('div', 'opfuss');
  applaus.append(abar, atext); zeit.append(zbar); el.append(zu, kopf, titel, publikum, applaus, status, zeit, frageEl, antworten, fuss); el.hidden = false;
  let wert = 0, serie = 0, mikros = VORTRAG.mikros, nr = 0, aus = false, timer = null; const benutzt = new Set(), gelernt = [];
  function zeichnen() { abar.style.width = Math.min(100, wert) + '%'; atext.textContent = `Applaus ${Math.min(100, Math.round(wert))} %`; status.textContent = `${'🎤'.repeat(mikros)}${'·'.repeat(VORTRAG.mikros - mikros)}   Frage ${Math.min(nr + 1, VORTRAG.fragen)}/${VORTRAG.fragen}${serie > 1 ? `   🔥 Serie x${serie}` : ''}`;
    publikum.textContent = '👩‍⚕️🧑‍⚕️👨‍⚕️👩‍🔬🧑‍💼👩‍💼👨‍⚕️👩‍⚕️'.slice(0, 2 * 8).replace(/(\p{Extended_Pictographic})/gu, (m, _, i) => i / 2 < wert / 12.5 ? '👏' : m) }
  function naechste() { if (aus) return; if (wert >= 100) return ende(true); if (mikros <= 0 || nr >= VORTRAG.fragen) return ende(false); const f = kspielFrage(benutzt); if (!f) return ende(wert >= 100);
    frageEl.textContent = '🙋 ' + f.frage; antworten.replaceChildren(); const start = Date.now(); let fertig = false;
    const werten = (ok, bt) => { if (fertig) return; fertig = true; clearInterval(timer); const dauer = (Date.now() - start) / 1000; antworten.querySelectorAll('button').forEach(x => { x.disabled = true; if (x.textContent === f.richtig) x.classList.add('richtig') }); if (bt && !ok) bt.classList.add('falsch');
      gelernt.push({ frage: f.frage, antwort: f.richtig, ok }); if (ok) { serie++; wert += VORTRAG.applausRichtig + (serie - 1) * VORTRAG.serie + (dauer < 3 ? VORTRAG.schnell : 0); el.classList.add('jubel'); setTimeout(() => el.classList.remove('jubel'), 500) } else { serie = 0; mikros--; wert = Math.max(0, wert - 6) }
      nr++; zeichnen(); setTimeout(naechste, ok ? 700 : 1800) };
    for (const a of f.antworten) { const bt = el_('button', null, a); bt.onclick = () => werten(a === f.richtig, bt); antworten.append(bt) }
    clearInterval(timer); timer = setInterval(() => { const rest = VORTRAG.zeit - (Date.now() - start) / 1000; zbar.style.width = Math.max(0, rest / VORTRAG.zeit * 100) + '%'; zbar.style.background = rest < 3 ? '#e0344f' : '#3ee08f'; if (rest <= 0) werten(false, null) }, 100) }
  function ende(sieg) { aus = true; clearInterval(timer); const kk = klinikStand(); if (!unterwegs(kk)) { el.hidden = true; return } const richtig = gelernt.filter(g => g.ok).length; kk.reise.spiel = true; kk.anerkennung = (kk.anerkennung || 0) + richtig * 3; kk.wissen = (kk.wissen || 0) + richtig;
    frageEl.textContent = sieg ? '🏆 Standing Ovations!' : `Applaus ${Math.round(Math.min(100, wert))} %`; antworten.replaceChildren(); zeit.hidden = true;
    if (sieg) { const bonus = Math.round(kg.honorar * anerkennungStufe(kk).faktor * .25 + kg.follower * 2); kk.reise.anteil = 1; kk.reise.bis = Date.now(); ST.geld += bonus; kk.umsatz += bonus; setTimeout(() => toast(`Siegerbonus +${euro(bonus)}`), 2500) }
    else kk.reise.bis = Date.now() + Math.max(0, (kk.reise.bis - Date.now()) * (1 - Math.min(100, wert) / 100));
    const mit = el_('div', 'kmit'); mit.append(el_('h4', null, 'Das nimmst du mit'), el_('p', 'hin', `${richtig} von ${gelernt.length} Fragen richtig · Anerkennung +${richtig * 3}${sieg ? ' · du fliegst sofort zurück' : ` · Reise ${Math.round(Math.min(100, wert))} % kürzer`}`));
    for (const g of gelernt) { const z = el_('div', 'klern ' + (g.ok ? 'ok' : 'neu')); z.append(el_('b', null, g.frage), el_('span', null, g.antwort)); mit.append(z) }
    mit.append(el_('p', 'hin', 'Allgemeine Information im Spiel, keine medizinische Empfehlung. Behandlungen immer mit Ärztin oder Arzt abklären.'));
    const weiter = el_('button', 'cta opkasse', sieg ? '✈️ Zurück nach Berlin City' : 'Weiter'); weiter.onclick = () => { el.hidden = true; klinikWeiter(); if (KLINIK.offen) klinikZeichnen() }; fuss.replaceChildren(mit, weiter); save(); hud() }
  frageEl.textContent = 'Der Saal ist voll. Beantworte die Fragen schnell und richtig, Serien bringen extra Applaus.'; const los = el_('button', 'cta opkasse', '🎤 Vortrag starten'); los.onclick = () => { antworten.replaceChildren(); naechste() }; antworten.append(los); zeichnen() }
