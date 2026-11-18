// Glow City · liga.js · Liga der Woche: Kliniken treten jede Woche (Montag bis Sonntag) mit ihrem Wochenumsatz gegeneinander an.
// Dabei: 5 Rivalinnen (wachsen mit deiner Klinik mit, damit es immer knapp bleibt), alle echten Spielerinnen derselben Woche und du.
// Am Wochenende gibt es für Platz 1 bis 3 einen Anteil am Wochenumsatz, Follower und einen Pokal. Der Abstand zum nächsten Platz steht immer da.
const LIGA = { preise: [{ anteil: .15, follower: 5000, name: 'Gold' }, { anteil: .08, follower: 2000, name: 'Silber' }, { anteil: .04, follower: 1000, name: 'Bronze' }], staerke: [1.9, 1.35, 1, .7, .45], stundenProTag: 3 };
const wocheId = (t = Date.now()) => Math.floor((t / 864e5 + 3) / 7);
const wocheEnde = id => ((id + 1) * 7 - 3) * 864e5;
function ligaZaehlen(k, betrag) { const id = wocheId(); if (!k.woche || k.woche.id !== id) { if (k.woche) ligaAbschluss(k); k.woche = { id, umsatz: 0, beh: 0 } } k.woche.umsatz += betrag; k.woche.beh++; k.woche.platz = ligaListe(k).findIndex(x => x.art === 'DU') + 1 }
// Rivalinnen: Stärke aus deinem eigenen Ertrag pro Stunde, Fortschritt nach Anteil der Woche, leicht schwankend
function ligaListe(k, ende) { const id = wocheId(), start = (id * 7 - 3) * 864e5, anteil = ende ? 1 : Math.min(1, (Date.now() - start) / (7 * 864e5)), basis = Math.max(20000, ertragProStunde(k, 'aktiv') * LIGA.stundenProTag * 7);
  const liste = KQ.RIVALEN.slice(0, LIGA.staerke.length).map((r, i) => ({ name: r.name, umsatz: Math.round(basis * LIGA.staerke[i] * anteil * (1 + Math.sin(id * 3.1 + i) * .12)), art: 'NPC' }));
  if (typeof SPIELER !== 'undefined') for (const [, x] of SPIELER) if (x.liga && x.liga.id === id) liste.push({ name: x.handle, umsatz: x.liga.umsatz || 0, art: 'LIVE' });
  liste.push({ name: (ST.profil && ST.profil.handle) || 'Du', umsatz: k.woche && k.woche.id === id ? k.woche.umsatz : 0, art: 'DU' }); return liste.sort((a, b) => b.umsatz - a.umsatz) }
function ligaAbschluss(k) { const w = k.woche, platz = w.platz || 0, p = LIGA.preise[platz - 1]; if (!p || !w.umsatz) return;
  const geld = Math.round(w.umsatz * p.anteil); ST.geld += geld; ST.follower = (ST.follower || 0) + p.follower; k.pokale = k.pokale || {}; k.pokale[p.name] = (k.pokale[p.name] || 0) + 1;
  setTimeout(() => banner(`🏆 LIGA: PLATZ ${platz}`, `Pokal ${p.name} für deine Klinik`, `+${euro(geld)} · +${p.follower.toLocaleString('de-DE')} Follower`), 1500) }
function ligaBereich(k, body) { if (!k.woche || k.woche.id !== wocheId()) { if (k.woche) { ligaAbschluss(k); save() } k.woche = { id: wocheId(), umsatz: 0, beh: 0 } } const liste = ligaListe(k), ich = liste.findIndex(x => x.art === 'DU'); k.woche.platz = ich + 1;
  const rest = Math.max(0, wocheEnde(k.woche.id) - Date.now()) / 1000; body.append(el_('h4', null, `🏆 Liga der Woche · endet in ${dauer(Math.ceil(rest))}`));
  const vor = liste[ich - 1]; body.append(el_('p', 'hin', ich === 0 ? 'Du führst. Halte den Vorsprung bis Sonntag.' : `Platz ${ich + 1}. Bis Platz ${ich} fehlen dir ${euro(vor.umsatz - liste[ich].umsatz + 1)} Umsatz.`));
  body.append(el_('p', 'hin', `Preise am Sonntag: ${LIGA.preise.map((p, i) => `${i + 1}. ${Math.round(p.anteil * 100)} % deines Wochenumsatzes und ${p.follower.toLocaleString('de-DE')} Follower`).join(' · ')}`));
  liste.slice(0, 10).forEach((c, i) => { const r = el_('div', 'freundin liga' + (c.art === 'DU' ? ' live' : '')), l = el_('div'), n = el_('b', null, `${['🥇', '🥈', '🥉'][i] || i + 1 + '.'} ${c.name}`); n.prepend(el_('span', 'marke', c.art)); l.append(n, el_('small', null, `${euro(c.umsatz)} diese Woche`)); r.append(l); body.append(r) });
  const pk = Object.entries(k.pokale || {}); if (pk.length) body.append(el_('p', 'hin', 'Deine Pokale: ' + pk.map(([n, z]) => `${z}× ${n}`).join(' · '))) }
