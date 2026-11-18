// Glow City · meisterschaft.js · Meisterschaft je Behandlung: Wer eine Behandlung oft macht, steigt in 5 Stufen auf (10, 30, 80, 200, 500 Mal).
// Jede Stufe bringt 6 % mehr Honorar für genau diese Behandlung. Aufstieg mit Banner, Fortschritt im Geräte-Reiter, Stufe als ◆ im Wartezimmer.
// 20 Stufen je Behandlung (ab 5 bis rund 2.300 Behandlungen), jede Stufe +3 % Honorar für genau diese Behandlung, ganz oben +60 %
const MEISTER = { ab: Array.from({ length: 20 }, (_, i) => Math.round(5 * Math.pow(1.38, i))), bonus: .03,
  namen: ['Anfängerin', ...Array.from({ length: 20 }, (_, i) => ['Routiniert', 'Erfahren', 'Expertin', 'Meisterin', 'Legende'][Math.min(4, Math.floor(i / 4))] + ' ' + (i % 4 + 1))] };
const meisterStufe = (k, id) => { const n = (k.meister || {})[id] || 0; return MEISTER.ab.filter(x => n >= x).length };
const meisterBonus = (k, id) => meisterStufe(k, id) * MEISTER.bonus;
function meisterZaehlen(k, id) { k.meister = k.meister || {}; const vor = meisterStufe(k, id); k.meister[id] = (k.meister[id] || 0) + 1; const nach = meisterStufe(k, id);
  if (nach > vor) { const b = behandlung(id); setTimeout(() => banner(`◆ ${MEISTER.namen[nach].toUpperCase()}`, `${b.icon} ${b.name} · Stufe ${nach}`, `Honorar für ${b.name} +${Math.round(nach * MEISTER.bonus * 100)} %`), 800) } }
function meisterBereich(k, body) { const behs = KQ.BEHANDLUNGEN.filter(b => k.geraete[b.geraet]); if (!behs.length) return; body.append(el_('h4', null, '◆ Deine Meisterschaft'));
  body.append(el_('p', 'hin', 'Je öfter du eine Behandlung machst, desto besser wirst du: jede Stufe bringt 6 % mehr Honorar für diese Behandlung.'));
  for (const b of behs) { const n = (k.meister || {})[b.id] || 0, st = meisterStufe(k, b.id), ziel = MEISTER.ab[st], vor = MEISTER.ab[st - 1] || 0, r = el_('div', 'meister'), bar = el_('i');
    r.append(el_('b', null, `${b.icon} ${b.name}`), el_('small', null, `Stufe ${st}/20 · ${MEISTER.namen[st]} · ${ziel ? `${n}/${ziel}` : `${n} · höchste Stufe`}${st ? ` · +${Math.round(st * MEISTER.bonus * 100)} %` : ''}`), el_('span', 'mbalken'));
    r.lastChild.append(bar); bar.style.width = (ziel ? (n - vor) / (ziel - vor) : 1) * 100 + '%'; body.append(r) } }
