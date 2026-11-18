// Glow City · liegen.js · Liegen aufwerten: jede Liege hat 20 Stufen. Pro Stufe 3 % kürzere Behandlung und 2 % mehr Honorar auf genau dieser Liege.
// Alle 5 Stufen ein sichtbar neues Modell im Klinikraum (praxis.js fragt liegeModell ab). Preise steigen pro Stufe um 45 %.
const LIEGE = { max: 20, zeit: .03, honorar: .02, grund: 400, faktor: 1.45,
  modelle: [{ ab: 0, name: 'Standard', farbe: '#ffffff' }, { ab: 5, name: 'Komfort', farbe: '#f2dfe6' }, { ab: 10, name: 'Premium-Leder', farbe: '#e7d3b0' }, { ab: 15, name: 'Medical Pro', farbe: '#2a2a30' }, { ab: 20, name: 'Signature Gold', farbe: '#16171a', gold: true }] };
const liegeStufe = (k, i) => ((k.liegenStufe || [])[i]) || 0;
const liegeModell = (k, i) => LIEGE.modelle.reduce((m, x) => liegeStufe(k, i) >= x.ab ? x : m, LIEGE.modelle[0]);
const liegeFaktor = (k, i) => 1 - liegeStufe(k, i) * LIEGE.zeit;
const liegeBonus = (k, i) => liegeStufe(k, i) * LIEGE.honorar;
const liegePreis = (k, i) => Math.round(LIEGE.grund * Math.pow(LIEGE.faktor, liegeStufe(k, i)) * (1 + i * .25) / 10) * 10;
function liegeAufwerten(i) { const k = klinikStand(), st = liegeStufe(k, i), p = liegePreis(k, i); if (st >= LIEGE.max || ST.geld < p) return; ausgeben(k, p, 'ausbau');
  k.liegenStufe = k.liegenStufe || []; k.liegenStufe[i] = st + 1; const m = liegeModell(k, i); if (LIEGE.modelle.some(x => x.ab === st + 1)) banner('🛏️ NEUE LIEGE', `Liege ${i + 1}: ${m.name}`, `${Math.round((st + 1) * LIEGE.zeit * 100)} % schneller · +${Math.round((st + 1) * LIEGE.honorar * 100)} % Honorar`); else toast(`Liege ${i + 1} auf Stufe ${st + 1}`);
  save(); hud(); klinikZeichnen() }
function liegenBereich(k, body) { body.append(el_('h4', null, '🛏️ Liegen aufwerten'), el_('p', 'hin', 'Jede Stufe: 3 % kürzere Behandlung und 2 % mehr Honorar auf dieser Liege. Alle 5 Stufen ein neues Modell.'));
  k.liegen.forEach((_, i) => { const st = liegeStufe(k, i), m = liegeModell(k, i), r = el_('div', 'ware'), l = el_('div'), bar = el_('i'), sb = el_('span', 'mbalken'); sb.append(bar); bar.style.width = st / LIEGE.max * 100 + '%';
    l.append(el_('b', null, `Liege ${i + 1} · ${m.name} · Stufe ${st}/${LIEGE.max}`), el_('small', null, `${Math.round(st * LIEGE.zeit * 100)} % schneller · +${Math.round(st * LIEGE.honorar * 100)} % Honorar`), sb);
    const bt = el_('button', 'cta', st >= LIEGE.max ? 'Höchste Stufe' : `⬆ ${euro(liegePreis(k, i))}`); bt.disabled = st >= LIEGE.max || ST.geld < liegePreis(k, i); bt.onclick = () => liegeAufwerten(i); r.append(l, bt); body.append(r) }) }
