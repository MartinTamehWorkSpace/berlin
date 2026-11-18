// Glow City · klinik.js · Deine Schönheitsklinik im Glow Tower: du bist Ästhetikärztin, Dr. Glatt ist dein Mentor.
// Kundinnen kommen in echter Zeit ins Wartezimmer, du behandelst sie auf deinen Liegen, rechnest ab und baust aus. Hier liegt die hohe Verdienststufe.
const KQ = window.GLOW_KLINIK;
function klinikStand() { if (!ST.klinik) ST.klinik = { liegen: [null], warte: [], geraete: { spritze: 1 }, raum: 0, sterne: 3, behandelt: 0, umsatz: 0, naechste: Date.now() + 8000 }; ST.klinik.team = ST.klinik.team || {}; ST.klinik.posts = ST.klinik.posts || []; if (ST.klinik.marketing == null) ST.klinik.marketing = ST.klinik.team.social ? 1 : 0; delete ST.klinik.team.social; ST.klinik.budget = ST.klinik.budget || 0; ST.klinik.ausbau = ST.klinik.ausbau || {}; ST.klinik.etagen = ST.klinik.etagen || { basis: 1 }; ST.klinik.lohnBis = ST.klinik.lohnBis || Date.now(); if ((ST.klinik.ausgabenBestand || 0) < 4) bestandSchaetzen(ST.klinik); return ST.klinik }
function bestandSchaetzen(k) { const a = k.ausgaben = k.ausgaben || {}, summe = (l, f) => l.reduce((s, x) => s + (f(x) || 0), 0);
  a.geraete = summe(KQ.GERAETE.filter(g => k.geraete[g.id]), g => g.preis); a.einrichtung = summe(KQ.LIEGEN.slice(0, k.liegen.length), p => p) + summe(KQ.WARTEZIMMER.slice(0, k.raum + 1), r => r.preis);
  a.team = summe(KQ.TEAM.filter(t => k.team[t.id]), t => t.einstellen); a.marketing = summe(RUHM.MARKETING.slice(0, k.marketing + 1), m => m.einstellen); a.etagen = summe(KQ.ETAGEN.filter(e => k.etagen[e.id]), e => e.preis);
  a.ausbau = summe(KQ.AUSBAU.filter(x => k.ausbau[x.id]), x => x.preis); a.laufend = 0; k.umsatz = Math.min(k.umsatz, summe(Object.values(a), x => x)); k.ausgabenBestand = 4 } // 4 = neu geschätzt nach den exponentiellen Preisen vom 17.11.
// Sekunden bis zur nächsten Kundin: Bewertung, Ruhm, Marketing und Werbebudget zusammen
const zulauf = k => ruhmStufe().kunden * RUHM.MARKETING[k.marketing].kunden * RUHM.BUDGET[k.budget].kunden;
// Drei Stufen (Martin, 17.11.):
// 1 Aktiv pushen: Klinik offen und in den letzten 90 Sek. etwas getan. Alle 5 bis 15 Sek. eine Kundin, du behandelst selbst (+25 %, Combo bis x2).
// 2 Team läuft: Klinik offen, du tust nichts. Grundtakt 90 Sek. ohne, 30 Sek. mit vollem Werbebudget; ein eingespieltes Team schafft ihn 1,5-mal so schnell.
// 3 Passiv: Spiel zu. Das Team verdient das Minimum (halber Grundtakt), höchstens 12 Std. werden gutgeschrieben.
const unterwegs = k => !!(k.reise && Date.now() < k.reise.bis);
const aktiv = k => typeof KLINIK !== 'undefined' && KLINIK.offen && !unterwegs(k) && Date.now() < (k.aktivBis || 0);
const grundAbstand = k => Math.max(KQ.MIN_ABSTAND, KQ.GRUND_ABSTAND / RUHM.BUDGET[k.budget].kunden);
const ABSTAND = { aktiv: k => Math.max(5, grundAbstand(k) / 6), team: k => grundAbstand(k) / 1.5, passiv: k => grundAbstand(k) * 2 };
const abstandKundin = k => aktiv(k) ? ABSTAND.aktiv(k) : ABSTAND.team(k);
const PASSIV_MAX_STD = 12, TEAM_VORSPRUNG = 30;
const teamKomplett = k => !!(k.team.assistenz && k.team.aerztin);
// Was eine Stunde in jeder Stufe bringt (brutto), aus Angebot, Liegen, Takt und Honoraren geschätzt
function ertragProStunde(k, stufe) { const angebot = KQ.BEHANDLUNGEN.filter(b => k.geraete[b.geraet] && (!b.etage || k.etagen[b.etage])); if (!angebot.length) return 0; if (stufe !== 'aktiv' && !teamKomplett(k)) return 0;
  const ue = Math.max(0, ruhmStufe().kunden * RUHM.MARKETING[k.marketing].kunden - 1), vip = vipChance(k), gw = angebot.reduce((s, b) => s + b.wunsch, 0);
  const preis = angebot.reduce((s, b) => s + b.wunsch * honorar(b, k, false), 0) / gw * (1 + vip), zeit = angebot.reduce((s, b) => s + b.wunsch * b.dauer, 0) / gw;
  const aktivJa = stufe === 'aktiv', proStd = Math.min(3600 / ABSTAND[stufe](k), k.liegen.length * 3600 / (zeit * (aktivJa ? .75 : 1)));
  return proStd * preis * (aktivJa ? (1 + KQ.BONUS_PERSOENLICH + KQ.BONUS_EXPRESS) * 1.3 : 1) }
function aktivSein(k) { if (!unterwegs(k)) k.aktivBis = Date.now() + 90000 }
// Wirtschaftlichkeit: jede Ausgabe und jede Einnahme der Praxis wird mitgeschrieben
function ausgeben(k, betrag, art) { ST.geld -= betrag; k.ausgaben = k.ausgaben || {}; k.ausgaben[art] = (k.ausgaben[art] || 0) + betrag }
// Selbst Hand anlegen: ein Tipp spart 5 % der Dauer (mind. 3 Sek.), danach 4 Sek. Pause, je Behandlung höchstens 30 %. Macht sie persönlich (+25 %).
const SCHNELL_ANTEIL = .05, SCHNELL_MAX = .3, SCHNELL_PAUSE = 4000;
const schnellOffen = l => { const b = behandlung(l.kundin.beh); return Math.max(0, b.dauer * SCHNELL_MAX - (l.gespart || 0)) };
function beschleunigen(i) { const k = klinikStand(), l = k.liegen[i]; if (!l) return; if (unterwegs(k)) { toast('Du bist unterwegs. Dein Team kümmert sich'); return } const r = liegeRest(l); if (r <= 0) return abrechnen(i); const b = behandlung(l.kundin.beh);
  if (Date.now() < (l.schnellBis || 0) || schnellOffen(l) <= 0) return; const spar = Math.min(r, schnellOffen(l), Math.max(3, b.dauer * SCHNELL_ANTEIL));
  l.t0 -= spar * 1000; l.gespart = (l.gespart || 0) + spar; l.schnellBis = Date.now() + SCHNELL_PAUSE; l.persoenlich = true; aktivSein(k); save(); toast(`Du behandelst selbst · ${Math.round(spar)} Sek. schneller`); klinikZeichnen() }
// Combo: persönliche Behandlungen kurz hintereinander steigern den Multiplikator bis x2, Pause setzt zurück
function comboWert(k) { if (!k.comboBis || Date.now() > k.comboBis) k.combo = 1; return k.combo || 1 }
const ausbauWert = (k, feld) => KQ.AUSBAU.filter(a => k.ausbau[a.id]).reduce((s, a) => s + (a[feld] || 0), 0);
const boostWert = k => Date.now() < (k.boostBis || 0) ? k.boost || 0 : 0;
// Dritter Wert: die Kundin selbst (VIP doppelt, Stammkundinnen mit Treuebonus) oder nur wahr/falsch für VIP
const honorar = (b, k, kd) => { const vip = kd && typeof kd === 'object' ? kd.vip : kd, treue = kd && typeof kd === 'object' ? kd.treue || 0 : 0; return Math.round(b.preis * ruhmStufe().preis * (vip ? 2 : 1) * (1 + treue) * (.85 + k.sterne * .06) * (1 + ausbauWert(k, 'honorar') + boostWert(k) + (typeof meisterBonus === 'function' ? meisterBonus(k, b.id) : 0)) * (1 + (typeof starBonus === 'function' ? starBonus() : 0))) };
function boostGeben(k, faktor, minuten, grund) { k.boost = Math.max(boostWert(k), faktor); k.boostBis = Math.max(k.boostBis || 0, Date.now()) + minuten * 60000; banner('GLOW-BOOST', grund, `Honorare +${Math.round(faktor * 100)} % für ${minuten} Min.`) }
// VIPs: höchstens jede vierte Kundin
const VIP_MAX = .25;
function vipChance(k) { const ue = Math.max(0, ruhmStufe().kunden * RUHM.MARKETING[k.marketing].kunden - 1); return Math.min(VIP_MAX, (.04 + k.sterne * .006 + Math.min(.08, ue * .02)) * (1 + ausbauWert(k, 'vip') * .5)) }
const behandlung = id => KQ.BEHANDLUNGEN.find(b => b.id === id);
const sterneText = s => '★'.repeat(Math.round(s)) + '☆'.repeat(5 - Math.round(s));
// Neue Kundinnen und Geduld, auch für die Zeit, in der das Spiel zu war
function klinikWeiter() { const k = klinikStand(), jetzt = Date.now(), plaetze = KQ.WARTEZIMMER[k.raum].plaetze; let neu = 0, weg = 0; const warZu = k.zuletztDa && jetzt - k.zuletztDa > 60000; const weg_s = k.zuletztDa ? (jetzt - k.zuletztDa) / 1000 : 0; k.zuletztDa = jetzt;
  // Stufe 3: Spiel war zu, das Team hat allein gearbeitet
  if (warZu) { const plus = Math.round(ertragProStunde(k, 'passiv') * Math.min(weg_s, PASSIV_MAX_STD * 3600) / 3600); if (plus > 0) { ST.geld += plus; k.umsatz += plus; banner('WÄHREND DU WEG WARST', `Dein Team hat ${dauer(Math.min(weg_s, PASSIV_MAX_STD * 3600))} gearbeitet`, `+${euro(plus)}`) } else if (!teamKomplett(k)) toast('Ohne Assistenz und Ärztin verdient die Praxis nichts, wenn du weg bist'); k.naechste = jetzt + abstandKundin(k) * 1000 }
  if (typeof kongressWeiter === 'function') kongressWeiter(k, jetzt);
  // Löhne für das Team, stundengenau in echter Zeit
  const stunden = (jetzt - k.lohnBis) / 3.6e6; if (stunden > .01) { const lohn = Math.round((KQ.TEAM.filter(t => k.team[t.id]).reduce((s, t) => s + t.lohn, 0) + RUHM.MARKETING[k.marketing].lohn + RUHM.BUDGET[k.budget].proStunde) * stunden); if (lohn) { ausgeben(k, lohn, 'laufend'); k.loehne = (k.loehne || 0) + lohn } k.lohnBis = jetzt }
  const geduld = KQ.GEDULD * (k.team.empfang ? 1.5 : 1) * (1 + ausbauWert(k, 'geduld')); let konkurrenz = 0;
  k.warte = k.warte.filter(w => { const b = behandlung(w.beh); if (!k.geraete[b.geraet] && jetzt - w.ankunft > KQ.GEDULD_OHNE_GERAET * 1000) { konkurrenz++; return false } if (jetzt - w.ankunft > (w.geduld || geduld) * 1000) { weg++; return false } return true });
  if (konkurrenz) toast(`${konkurrenz} ${konkurrenz === 1 ? 'Kundin ist' : 'Kundinnen sind'} zur Konkurrenz gegangen: Gerät fehlt`);
  if (weg) { k.sterne = Math.max(1, k.sterne - .08 * weg); toast(`${weg} ${weg === 1 ? 'Kundin ist' : 'Kundinnen sind'} gegangen, weil niemand Zeit hatte`) }
  let schleifen = 0; while (k.naechste <= jetzt && schleifen++ < 30) { if (k.warte.length < plaetze) { k.warte.push(neueKundin(k, k.naechste)); neu++ } k.naechste += abstandKundin(k) * 1000 * (.7 + Math.random() * .6) }
  if (k.naechste < jetzt) k.naechste = jetzt + abstandKundin(k) * 1000;
  // Fertige Beiträge gehen online und bringen Follower
  for (const p of [...k.posts]) { const d = KQ.POSTS.find(x => x.id === p.id); if (jetzt >= p.t0 + d.dauer * 1000) { k.posts.splice(k.posts.indexOf(p), 1); const plus = Math.round((d.follower[0] + Math.random() * (d.follower[1] - d.follower[0])) * (1 + k.marketing * .25 + ausbauWert(k, 'social')) * (.8 + k.sterne * .08));
      ST.follower = (ST.follower || 0) + plus; k.followerPlus = (k.followerPlus || 0) + plus; banner('BEITRAG ONLINE', d.name, `+${plus.toLocaleString('de-DE')} Follower`); weg = weg || 0; neu++ } }
  // Team arbeitet selbst: Ärztin rechnet ab, Assistenz holt die nächste Kundin
  // Die Assistenz holt erst Kundinnen, die schon 30 Sek. warten. So siehst du sie immer zuerst im Wartezimmer.
  let auto = 0; const selbst = aktiv(k); if (k.team.aerztin && !selbst) k.liegen.forEach((l, i) => { if (l && liegeRest(l) <= 0) { abrechnen(i, true); auto++ } });
  if (k.team.assistenz && !selbst) for (const w of [...k.warte]) { const b = behandlung(w.beh); if (Date.now() - w.ankunft >= TEAM_VORSPRUNG * 1000 && k.geraete[b.geraet] && k.liegen.some(l => !l)) { behandeln(w.id, true); auto++ } }
  if (neu || weg || auto) { save(); if (KLINIK.offen) klinikZeichnen() } return neu }
function neueKundin(k, ankunft) { // meist etwas, das du anbietest, manchmal etwas, wofür dir noch das Gerät fehlt
  const offen = KQ.BEHANDLUNGEN.filter(b => !b.etage || k.etagen[b.etage]), angebot = offen.filter(b => k.geraete[b.geraet]), premium = kampagneAktiv(k) && angebot.length ? [...angebot].sort((a, b) => b.preis - a.preis).slice(0, Math.max(2, Math.ceil(angebot.length * .35))) : null, alle = premium || (Math.random() < .2 ? offen : angebot.length ? angebot : offen);
  let z = Math.random() * alle.reduce((s, b) => s + b.wunsch, 0), b = alle[0]; for (const x of alle) { z -= x.wunsch; if (z < 0) { b = x; break } }
  const vip = Math.random() < (kampagneAktiv(k) ? KAMPAGNE.vip : vipChance(k)); const kd = { id: Math.random().toString(36).slice(2, 8), name: vip ? KQ.VIP[Math.floor(Math.random() * KQ.VIP.length)] : KQ.NAMEN[Math.floor(Math.random() * KQ.NAMEN.length)], vip, beh: b.id, ankunft }; return typeof stammWahl === 'function' ? stammWahl(k, kd) : kd }
function behandeln(id, still) { const k = klinikStand(), i = k.warte.findIndex(w => w.id === id), w = k.warte[i]; if (!w) return; const b = behandlung(w.beh); if (!still && unterwegs(k)) { toast('Du bist unterwegs. Dein Team kümmert sich'); return } if (!still) aktivSein(k);
  if (!k.geraete[b.geraet]) { toast(`Dafür brauchst du: ${KQ.GERAETE.find(g => g.id === b.geraet).name}`); return }
  const frei = k.liegen.findIndex(l => !l); if (frei < 0) { toast('Alle Liegen sind belegt'); return }
  const express = !still && (Date.now() - w.ankunft) / 1000 <= KQ.EXPRESS_SEK; k.warte.splice(i, 1); k.liegen[frei] = { kundin: w, t0: Date.now(), persoenlich: !still, express, dauerFaktor: typeof liegeFaktor === 'function' ? liegeFaktor(k, frei) : 1 }; save(); if (!still) { toast(`${w.name} liegt auf Liege ${frei + 1}: ${b.name}${express ? ' · Express +10 %' : ''} · persönlich +25 %`); klinikZeichnen() } setTimeout(() => ereignis('behandlung', { b })) }
function liegeRest(l) { const b = behandlung(l.kundin.beh); return Math.max(0, l.t0 + b.dauer * (l.dauerFaktor || 1) * 1000 - Date.now()) / 1000 }
function abrechnen(i, still) { const k = klinikStand(), l = k.liegen[i]; if (!l || liegeRest(l) > 0) return; const b = behandlung(l.kundin.beh); let combo = 1; if (!still) { aktivSein(k); combo = comboWert(k); if (l.persoenlich) { k.combo = Math.min(2, combo + .1); k.comboBis = Date.now() + 120000 } }
  const trink = Math.round(b.preis * (Math.random() * .15) * (k.sterne / 5)), betrag = Math.round(honorar(b, k, l.kundin) * (1 + (typeof liegeBonus === 'function' ? liegeBonus(k, i) : 0)) * (1 + (l.persoenlich ? KQ.BONUS_PERSOENLICH : 0) + (l.express ? KQ.BONUS_EXPRESS : 0)) * (l.persoenlich ? combo : 1) * (1 + (l.selbst || 0) / 100)) + trink;
  k.liegen[i] = null; ST.geld += betrag; k.umsatz += betrag; if (typeof ligaZaehlen === 'function') ligaZaehlen(k, betrag); if (typeof meisterZaehlen === 'function') meisterZaehlen(k, b.id); k.behandelt++; const bew = typeof stammBesuch === 'function' ? stammBesuch(k, l, still) : null; k.sterne = Math.min(5, k.sterne + (l.kundin.vip ? KQ.STERNE.proVip : KQ.STERNE.proBehandlung) * (1 + ausbauWert(k, 'sterne'))); xpGeben(b.xp); save(); hud();
  if (!still) toast(`${l.kundin.name} ${bew ? sterneText(bew.sterne) + ' „' + bew.text + '“' : 'ist begeistert'} · +${euro(betrag)}${combo > 1 && l.persoenlich ? ` · Combo x${combo.toFixed(1)}` : ''}${trink ? ` (davon ${euro(trink)} Trinkgeld)` : ''}`); if (k.behandelt === 1 || k.behandelt % 25 === 0) banner('DEINE KLINIK', `${k.behandelt} zufriedene Kundinnen`, `Bewertung ${k.sterne.toFixed(1)} von 5`); if (!still) klinikZeichnen() }
// Ablehnen: 20-mal am Tag aussortieren. Danach geht es heute nicht mehr, und der Bildschirm zeigt, wie viel Honorar abgelehnt wurde.
const ABLEHNEN_MAX = 20;
function ablehnenStand(k) { const tag = new Date().toDateString(); if (!k.abgelehnt || k.abgelehnt.tag !== tag) k.abgelehnt = { tag, n: 0, verlust: 0 }; return k.abgelehnt }
const ablehnenRest = k => Math.max(0, ABLEHNEN_MAX - ablehnenStand(k).n);
function ablehnen(id) { const k = klinikStand(), i = k.warte.findIndex(w => w.id === id); if (i < 0 || !ablehnenRest(k)) return; const a = ablehnenStand(k), w = k.warte[i], b = behandlung(w.beh);
  k.warte.splice(i, 1); a.n++; a.verlust = (a.verlust || 0) + honorar(b, k, w); aktivSein(k);
  if (!ablehnenRest(k)) banner('HEUTE KEINE ABSAGEN MEHR', `Du hast ${ABLEHNEN_MAX} Kundinnen abgelehnt und ${euro(a.verlust)} Honorar verloren`, 'Du kannst heute keine Kundinnen mehr ablehnen'); else if (ablehnenRest(k) === 5) banner('NUR NOCH 5 ABSAGEN', 'Heute kannst du noch 5 Kundinnen ablehnen', 'Danach behandelst du jede, die kommt'); else toast(`${w.name} abgelehnt · heute noch ${ablehnenRest(k)}-mal möglich`); save(); klinikZeichnen() }
// Premium-Kampagne: 10 Minuten nur Kundinnen für die teuersten Behandlungen, jede zweite VIP, 3-mal am Tag
const KAMPAGNE = { minuten: 10, proTag: 3, vip: .5 };
const kampagneAktiv = k => Date.now() < ((k.kampagne || {}).bis || 0);
function kampagneStand(k) { const tag = new Date().toDateString(); if (!k.kampagne || k.kampagne.tag !== tag) k.kampagne = { tag, n: 0, bis: (k.kampagne || {}).bis || 0 }; return k.kampagne }
const kampagneRest = k => Math.max(0, KAMPAGNE.proTag - kampagneStand(k).n);
function kampagneStarten() { const k = klinikStand(), c = kampagneStand(k); if (kampagneAktiv(k) || !kampagneRest(k)) return; c.n++; c.bis = Date.now() + KAMPAGNE.minuten * 60000; aktivSein(k); k.naechste = Date.now() + 2000;
  banner('PREMIUM-KAMPAGNE', `${KAMPAGNE.minuten} Minuten nur Kundinnen für deine teuersten Behandlungen`, `Jede zweite ist VIP · heute noch ${kampagneRest(k)}-mal`); save(); klinikZeichnen() }
function hereinbitten() { const k = klinikStand(); if (Date.now() < (k.bitteBis || 0) || unterwegs(k)) return; if (k.warte.length >= KQ.WARTEZIMMER[k.raum].plaetze) { toast('Wartezimmer ist voll'); return }
  aktivSein(k); k.warte.push(neueKundin(k, Date.now())); k.bitteBis = Date.now() + 8000; save(); klinikZeichnen() }
function geraetKaufen(id) { const k = klinikStand(), g = KQ.GERAETE.find(x => x.id === id); if (!g || k.geraete[id] || ST.geld < g.preis || k.sterne < g.ab || (g.etage && !k.etagen[g.etage])) return;
  ausgeben(k, g.preis, 'geraete'); k.geraete[id] = 1; xpGeben(Math.round(g.preis / 400)); save(); hud(); banner('NEUES GERÄT', g.name, 'Neue Behandlungen freigeschaltet'); klinikZeichnen() }
function liegeKaufen() { const k = klinikStand(), p = KQ.LIEGEN[k.liegen.length]; if (p == null || ST.geld < p) return; ausgeben(k, p, 'einrichtung'); k.liegen.push(null); save(); hud(); toast(`Liege ${k.liegen.length} steht bereit`); klinikZeichnen() }
function raumKaufen() { const k = klinikStand(), n = KQ.WARTEZIMMER[k.raum + 1]; if (!n || ST.geld < n.preis) return; ausgeben(k, n.preis, 'einrichtung'); k.raum++; save(); hud(); toast(`${n.name}: ${n.plaetze} Plätze im Wartezimmer`); klinikZeichnen() }
function marketingHoch() { const k = klinikStand(), nx = RUHM.MARKETING[k.marketing + 1]; if (!nx || ST.geld < nx.einstellen) return; ausgeben(k, nx.einstellen, 'marketing'); k.marketing++; banner('MARKETING', nx.name, 'Mehr VIP-Kundinnen, die das Doppelte zahlen'); save(); hud(); klinikZeichnen() }
function teamEinstellen(id) { const k = klinikStand(), t = KQ.TEAM.find(x => x.id === id); if (!t || k.team[id] || ST.geld < t.einstellen) return; ausgeben(k, t.einstellen, 'team'); k.team[id] = 1; banner('NEU IM TEAM', t.name, t.effekt); save(); hud(); klinikZeichnen() }
function etageKaufen(id) { const k = klinikStand(), e = KQ.ETAGEN.find(x => x.id === id); if (!e || k.etagen[id] || k.sterne < (e.ab || 0) || ST.geld < e.preis) return; ausgeben(k, e.preis, 'etagen'); k.etagen[id] = 1; banner('NEUE ETAGE', e.name, 'Mit dem Aufzug hinfahren und die Geräte dafür kaufen'); save(); hud(); klinikZeichnen() }
function ausbauKaufen(id) { const k = klinikStand(), a = KQ.AUSBAU.find(x => x.id === id); if (!a || k.ausbau[id] || ST.geld < a.preis) return; ausgeben(k, a.preis, 'ausbau'); k.ausbau[id] = 1; banner('PRAXIS VEREDELT', a.name, a.effekt); save(); hud(); klinikZeichnen() }
// Nächstes Ziel: Dr. Glatt sucht unter allem, was du jetzt kaufen könntest, das mit dem besten Verhältnis aus Mehrverdienst und Preis.
// Immer genau ein Ziel, knapp außer Reichweite, mit Balken. Ist es gekauft, steht sofort das nächste da. So endet die Kette nie.
function zielKandidaten(k) { const c = [], mit = (aend) => { const x = JSON.parse(JSON.stringify(k)); aend(x); return x };
  const np = KQ.LIEGEN[k.liegen.length]; if (np != null) c.push({ name: `Liege ${k.liegen.length + 1}`, icon: '🛏️', preis: np, neu: mit(x => x.liegen.push(null)), kaufen: liegeKaufen });
  for (const g of KQ.GERAETE) if (!k.geraete[g.id] && (!g.etage || k.etagen[g.etage])) c.push({ name: g.name, icon: '🧪', preis: g.preis, ab: g.ab, neu: mit(x => x.geraete[g.id] = 1), kaufen: () => geraetKaufen(g.id) });
  for (const t of KQ.TEAM) if (!k.team[t.id] && t.id !== 'empfang') c.push({ name: t.name, icon: t.icon, preis: t.einstellen, neu: mit(x => { x.team.assistenz = 1; x.team.aerztin = 1 }), kaufen: () => teamEinstellen(t.id), team: 1 });
  const nb = RUHM.BUDGET[k.budget + 1]; if (nb) c.push({ name: `Werbebudget ${nb.name} · ${euro(nb.proStunde)} pro Std.`, icon: '📈', preis: 0, laufend: nb.proStunde - RUHM.BUDGET[k.budget].proStunde, neu: mit(x => x.budget++), kaufen: () => { k.budget++; save(); toast(`Werbebudget ${nb.name}: mehr Kundinnen`); klinikZeichnen() } });
  const nm = RUHM.MARKETING[k.marketing + 1]; if (nm) c.push({ name: nm.name, icon: '📣', preis: nm.einstellen, neu: mit(x => x.marketing++), kaufen: marketingHoch });
  for (const a of KQ.AUSBAU) if (!k.ausbau[a.id] && (a.honorar || a.vip)) c.push({ name: a.name, icon: a.icon, preis: a.preis, neu: mit(x => x.ausbau[a.id] = 1), kaufen: () => ausbauKaufen(a.id) });
  for (const e of KQ.ETAGEN) if (!k.etagen[e.id]) { const g = KQ.GERAETE.find(x => x.etage === e.id); c.push({ name: e.name, icon: '🛗', preis: e.preis + (g ? g.preis : 0), ab: e.ab, neu: mit(x => { x.etagen[e.id] = 1; if (g) x.geraete[g.id] = 1 }), kaufen: () => etageKaufen(e.id), etage: 1 }) }
  return c.filter(x => k.sterne >= (x.ab || 0)) }
function naechstesZiel(k) { const vorher = Math.max(1, ertragProStunde(k, 'aktiv')), vorherT = ertragProStunde(k, 'team'); let best = null;
  for (const c of zielKandidaten(k)) { const plus = Math.max(ertragProStunde(c.neu, 'aktiv') - vorher, (ertragProStunde(c.neu, 'team') - vorherT) * .6) - (c.laufend || 0); if (plus <= 0) continue; const wert = plus / Math.max(1, c.preis); if (!best || wert > best.wert) best = { ...c, plus, wert } }
  return best ? { ...best, stunden: Math.max(0, best.preis - ST.geld) / vorher } : null }
function zielKarte(k) { const z = naechstesZiel(k), box = el_('div', 'ziel'); if (!z) { box.append(el_('b', null, 'Alles ausgebaut. Jetzt zählt das Ranking.')); return box }
  const kopf = el_('div', 'zkopf'); const zt = el_('div'); zt.append(el_('small', null, 'Nächstes Ziel'), el_('b', null, z.name)); kopf.append(el_('span', 'ic', z.icon), zt); box.append(kopf);
  const bar = el_('div', 'balken'), f = el_('i'); bar.append(f); const txt = el_('small'), bt = el_('button', 'cta'); bt.onclick = () => { const vor = ST.geld; z.kaufen(); if (ST.geld < vor || !z.preis) boostGeben(klinikStand(), KQ.BOOST_ZIEL.faktor, KQ.BOOST_ZIEL.minuten, `Ziel erreicht: ${z.name}`) };
  const live = () => { const anteil = z.preis ? Math.min(1, ST.geld / z.preis) : 1, fehlt = Math.max(0, z.preis - ST.geld); f.style.width = Math.round(anteil * 100) + '%';
    txt.textContent = fehlt ? `noch ${euro(Math.round(fehlt))} · etwa ${dauer(Math.round(fehlt / Math.max(1, ertragProStunde(k, 'aktiv')) * 3600))} aktiv` : `bringt etwa +${euro(Math.round(z.plus))} pro Stunde`;
    bt.textContent = fehlt ? euro(z.preis) : z.preis ? `Jetzt kaufen · ${euro(z.preis)}` : 'Einschalten'; bt.disabled = !!fehlt };
  live(); KLINIK_LIVE.push(live); const unten = el_('div', 'zunten'); unten.append(txt, bt); box.append(bar, unten); return box }
// Aufzug im Praxis-Reiter: Etage wählen, die 3D-Praxis fährt mit
function etagenLeiste(k) { const r = el_('div', 'etagenleiste'); r.append(el_('span', 'ic', '🛗'));
  for (const e of KQ.ETAGEN) { const offen = !!k.etagen[e.id], b = el_('button', KLINIK.etage === e.id ? 'an' : null, offen ? e.name.replace('-Etage', '').replace('Longevity- und Biohacking', 'Longevity') : '🔒 ' + e.name.replace('-Etage', '').replace('Longevity- und Biohacking', 'Longevity'));
    b.onclick = () => { if (!offen) { KLINIK.tab = 'ausbau'; return klinikZeichnen() } KLINIK.etage = e.id; aktivSein(k); if (window.DREI && DREI.etage) DREI.etage(e.id); klinikZeichnen() }; r.append(b) }
  return r }

// Status für die Blase über dem Glow Tower und den Zähler am Knopf
function klinikStatus() { const k = klinikStand(), fertig = k.liegen.filter(l => l && liegeRest(l) <= 0).length, warten = k.warte.length;
  if (fertig) return { text: `${fertig} fertig · kassieren`, farbe: '#ff4fa3', n: fertig + warten }; if (warten) return { text: `${warten} ${warten === 1 ? 'Kundin wartet' : 'Kundinnen warten'}`, farbe: '#2fbfb0', n: warten };
  return { text: 'Klinik · Glow Tower', farbe: '#2a1e36', n: 0 } }

// Wirtschaftlichkeit: Umsatz, Ausgaben, Verdienst pro Stunde aktiv und passiv, wann die Investition wieder drin ist
function wirtschaftZahlen(k) { const aus = k.ausgaben || {}, invest = ['geraete', 'einrichtung', 'team', 'marketing', 'etagen', 'ausbau'].reduce((s, x) => s + (aus[x] || 0), 0), laufend = aus.laufend || 0;
  const proH = KQ.TEAM.filter(t => k.team[t.id]).reduce((s, t) => s + t.lohn, 0) + RUHM.MARKETING[k.marketing].lohn + RUHM.BUDGET[k.budget].proStunde;
  const netto = st => Math.max(0, ertragProStunde(k, st) - proH), eA = netto('aktiv'), eT = netto('team'), eP = netto('passiv');
  const offen = Math.max(0, invest + laufend - k.umsatz), stundenAktiv = eA > 0 ? offen / eA : null, tagePassiv = eP > 0 ? offen / (eP * PASSIV_MAX_STD) : null;
  return { invest, laufend, proH, eA, eT, eP, offen, stundenAktiv, tagePassiv } }
// Drei Aussagen, nichts doppelt: wie viel schon wieder drin ist, wann der Rest drin ist, was jede Stufe am Tag bringt
function wirtschaftBlock(k) { const w = wirtschaftZahlen(k), aus = w.invest + w.laufend, anteil = aus ? Math.min(1, k.umsatz / aus) : 1, box = el_('details', 'wirtschaft');
  box.open = !!KLINIK.wirtschaftAuf; box.ontoggle = () => { KLINIK.wirtschaftAuf = box.open };
  const kopf = el_('summary'); kopf.append(el_('b', null, 'Wirtschaftlichkeit'), el_('small', null, w.offen ? `${Math.floor(anteil * 100)} % wieder drin` : 'Alles wieder drin')); box.append(kopf);
  const bar = el_('div', 'balken'), f = el_('i'); f.style.width = Math.round(anteil * 100) + '%'; bar.append(f); const leg = el_('small', 'wleg', `Eingenommen ${euro(k.umsatz)} von ${euro(aus)} ausgegeben`);
  const wieder = !w.offen ? 'Ab jetzt ist alles Gewinn' : [w.stundenAktiv != null ? `${dauer(Math.round(w.stundenAktiv * 3600))} aktiv` : null, w.tagePassiv != null ? `${w.tagePassiv < 1 ? 'unter 1 Tag' : Math.ceil(w.tagePassiv) + ' Tagen'} passiv` : null].filter(Boolean).join(' oder ');
  const satz = el_('p', 'wsatz', w.offen ? `Wieder drin in ${wieder || 'wenigen Behandlungen, spiel kurz aktiv'}` : wieder);
  const g = el_('div', 'wgrid'), feld = (t, v, cls) => { const d = el_('div', cls); d.append(el_('small', null, t), el_('b', null, v)); return d };
  // Pro Tag: aktiv und Team bei 12 Std. offen, passiv bei 12 Std. Gutschrift
  const tag = v => v > 0 ? `${euro(Math.round(v * 12 / 1000) * 1000)} am Tag` : 'Assistenz und Ärztin fehlen';
  g.append(feld('1 · Aktiv pushen', tag(w.eA), 'gut'), feld('2 · Team läuft, du bist da', tag(w.eT)), feld('3 · Passiv, Spiel zu', tag(w.eP)));
  box.append(bar, leg, satz, g); return box }

// ---------- Fenster ----------
const KLINIK = { offen: false, tab: 'praxis', uhr: null, etage: 'basis' };
function klinikAuf(tab) { KLINIK.offen = true; aktivSein(klinikStand()); klinikWeiter(); /* erst aktiv, dann nachrechnen: sonst verteilt das Team beim Öffnen alle Wartenden */ if (INNEN) verlassen(); if (typeof boutiqueZu === 'function') boutiqueZu(); document.getElementById('card').hidden = true; offen = null; KLINIK.tab = tab || KLINIK.tab; KLINIK.offen = true; aktivSein(ST.klinik);
  document.getElementById('klinik').hidden = false; document.body && document.body.classList.add('in-klinik'); klinikZeichnen(); clearInterval(KLINIK.uhr); KLINIK.uhr = setInterval(() => { klinikWeiter(); klinikLive() }, 1000) }
function klinikZu() { KLINIK.offen = false; document.getElementById('klinik').hidden = true; document.body && document.body.classList.remove('in-klinik'); clearInterval(KLINIK.uhr) }
let KLINIK_LIVE = [];
function klinikLive() { KLINIK_LIVE.forEach(f => f()) }
function doktorBild() { const c = document.createElement('canvas'); c.width = 96; c.height = 120; c.className = 'doktor'; const x = c.getContext('2d'); const d = FG.CHARS.find(ch => ch.id === 'glatt'); if (d) try { FG.zeichne(x, 48, 116, 2.2, d, 0, false) } catch (e) {} return c }
function klinikZeichnen() { const root = document.getElementById('klinik'); if (!root || root.hidden) return; const body = root.querySelector('.bb'); body.replaceChildren(); KLINIK_LIVE = [];
  root.querySelectorAll('[data-ktab]').forEach(b => b.setAttribute('aria-pressed', b.dataset.ktab === KLINIK.tab)); const k = klinikStand();
  root.querySelector('.lv').textContent = `${k.sterne.toFixed(1)} ★`;
  // Dr. Glatt mit einem Satz
  const mentor = el_('div', 'mentor'); const tipp = KQ.TIPPS.find(([w]) => w(k))[1]; const txt = el_('div'); txt.append(el_('b', null, 'Dr. Felix Glatt'), el_('span', null, tipp)); mentor.append(doktorBild(), txt); body.append(mentor);
  if (KLINIK.tab === 'praxis') {
    const kopf = el_('div', 'praxiskopf'), k1 = el_('div'), k2 = el_('div'); k1.append(el_('small', null, 'Bewertung'), el_('b', null, `${sterneText(k.sterne)} ${k.sterne.toFixed(1)}`)); k2.append(el_('small', null, 'Umsatz gesamt'), el_('b', null, euro(k.umsatz))); kopf.append(k1, k2); body.append(kopf);
    const rs = ruhmStufe(), rn = ruhmNaechste(); const zl = el_('div', 'praxiskopf'), z1 = el_('div'), z2 = el_('div'); z1.append(el_('small', null, rn ? `Ruhm · noch ${(rn.ab - ruhmPunkte()).toLocaleString('de-DE')} bis ${rn.name}` : 'Ruhm · höchste Stufe'), el_('b', null, `${rs.name} · Preise +${Math.round((rs.preis - 1) * 100)} %`)); z2.append(el_('small', null, aktiv(k) ? 'Stufe 1 · du pushst selbst' : 'Stufe 2 · Team läuft, tipp an zum Pushen'), el_('b', null, `1 Kundin alle ${dauer(abstandKundin(k))}`)); zl.append(z1, z2); body.append(zl);
    body.append(statusLeiste(k), etagenLeiste(k), zielKarte(k));
    // Liegen
    body.append(el_('h4', null, `Behandlungsraum · ${k.liegen.length} ${k.liegen.length === 1 ? 'Liege' : 'Liegen'}`)); const grid = el_('div', 'regale');
    // Jede Kachel hat dieselbe Bauform: Icon, Name, Zeile, Fortschritt, Knopf unten. So steht alles bündig.
    const kachel = (cls, icon, name, zeile, knopf, knopfCls) => { const t = el_('button', 'regal ' + cls); const bar = el_('div', 'balken'), f = el_('i'); bar.append(f); const kn = el_('em', 'knopf' + (knopfCls ? ' ' + knopfCls : ''), knopf);
      t.append(el_('span', 'ic', icon), el_('b', null, name), el_('small', null, zeile), bar, kn); return { t, f, kn, bar } };
    const mitBonus = (b, l) => Math.round(honorar(b, k, l.kundin) * (1 + (l.persoenlich ? KQ.BONUS_PERSOENLICH : 0) + (l.express ? KQ.BONUS_EXPRESS : 0)) * (1 + (l.selbst || 0) / 100));
    k.liegen.forEach((l, i) => { let c;
      if (!l) { c = kachel('leer', '🛏️', `Liege ${i + 1}`, 'frei', 'Frei', 'still'); c.bar.classList.add('aus'); c.t.disabled = true }
      else { const b = behandlung(l.kundin.beh); c = kachel('', b.icon, l.kundin.name + (l.kundin.vip ? ' ★' : ''), euro(mitBonus(b, l)), '', ''); c.t.querySelector('small').className = 'kpreis'; c.t.title = b.name;
        c.t.onclick = e => { if (!e.target.closest('.knopf')) behandlungInfo(b.id, l.kundin.name) };
        if (liegeRest(l) <= 0) { c.t.classList.add('fertig'); c.f.style.width = '100%'; c.kn.textContent = '💶 Kassieren'; c.kn.classList.add('kasse'); c.kn.onclick = () => abrechnen(i) }
        else { c.kn.onclick = () => kannSelbst(l) ? opStarten(i) : beschleunigen(i); const live = () => { const r = liegeRest(l), pause = Date.now() < (l.schnellBis || 0), voll = schnellOffen(l) <= 0; c.f.style.width = Math.round((1 - r / b.dauer) * 100) + '%';
            if (kannSelbst(l)) { c.kn.textContent = '🩺 Selbst machen'; c.kn.classList.remove('still') } else { c.kn.textContent = r <= 0 ? 'Fertig' : voll ? `noch ${dauer(r)}` : `⚡ ${dauer(r)}`; c.kn.classList.toggle('still', voll || pause) } if (r <= 0) klinikZeichnen() }; live(); KLINIK_LIVE.push(live) } }
      grid.append(c.t) });
    const np = KQ.LIEGEN[k.liegen.length]; if (np != null) { const c = kachel('zu', '🛏️', `Liege ${k.liegen.length + 1}`, 'aufstellen', euro(np)); c.bar.classList.add('aus'); c.t.disabled = ST.geld < np; c.t.onclick = liegeKaufen; grid.append(c.t) } body.append(grid);
    // Wartezimmer
    const akt = el_('div', 'praxiskopf'), a1 = el_('div'), a2 = el_('div'); a1.append(el_('small', null, 'Combo bei persönlichen Behandlungen'), el_('b', null, `x${comboWert(k).toFixed(1)}`));
    const hb = el_('button', 'cta', 'Nächste Kundin hereinbitten'); hb.disabled = Date.now() < (k.bitteBis || 0) || k.warte.length >= KQ.WARTEZIMMER[k.raum].plaetze; hb.onclick = hereinbitten; a2.append(hb); akt.append(a1, a2); body.append(akt);
    { const kr = el_('div', 'kampagne' + (kampagneAktiv(k) ? ' an' : '')), kt = el_('div'), ks = el_('small'), kb = el_('button', 'cta'); kt.append(el_('b', null, '📣 Premium-Kampagne'), ks); kr.append(kt, kb); kb.onclick = kampagneStarten;
      const live = () => { const an = kampagneAktiv(k), rest = kampagneRest(k); kr.classList.toggle('an', an); ks.textContent = an ? `Läuft noch ${dauer(Math.ceil((k.kampagne.bis - Date.now()) / 1000))} · nur Top-Behandlungen, jede zweite VIP` : rest ? `${KAMPAGNE.minuten} Min. nur hochpreisige Kundinnen · heute noch ${rest}-mal` : 'Morgen wieder 3 Kampagnen';
        kb.textContent = an ? 'Läuft' : 'Starten'; kb.disabled = an || !rest }; live(); KLINIK_LIVE.push(live); body.append(kr) }
    const raum = KQ.WARTEZIMMER[k.raum], wk = el_('h4', 'wkopf'); wk.append(el_('span', null, `Wartezimmer · ${k.warte.length}/${raum.plaetze}`), el_('small', null, ablehnenRest(k) > 5 ? '' : ablehnenRest(k) ? `Du kannst heute noch ${ablehnenRest(k)}-mal ablehnen` : 'Heute keine Absagen mehr')); body.append(wk);
    if (!k.warte.length) { const p = el_('p', 'hin'); const live = () => { const s = Math.max(0, Math.round((k.naechste - Date.now()) / 1000)); p.textContent = `Nächste Kundin in etwa ${dauer(s)}.` }; live(); KLINIK_LIVE.push(live); body.append(p) }
    // Eine Zeile je Kundin, immer gleich gebaut: Icon · Name und Behandlung · Honorar grün · Behandeln · ✕ ablehnen. Darunter die Geduld als dünner Balken.
    for (const w of k.warte) { const b = behandlung(w.beh), hat = !!k.geraete[b.geraet], r = el_('div', 'kzeile' + (w.vip ? ' vip' : '') + (w.promi ? ' promi' : ''));
      const txt = el_('div', 'ktext'); txt.append(el_('b', null, (w.icon ? w.icon + ' ' : w.vip ? '★ ' : '') + w.name + (w.promi ? ' · Promi, zahlt 5-fach' : '')), el_('small', null, `${b.name}${typeof meisterStufe === 'function' && meisterStufe(k, b.id) ? ' ' + '◆' + meisterStufe(k, b.id) : ''} ⓘ`)); if (w.stamm) txt.append(el_('small', 'kstamm', `♥ ${w.besuch}. Besuch${w.treue ? ` · +${Math.round(w.treue * 100)} % Treue` : ''} · ${w.anlass}`)); txt.onclick = () => behandlungInfo(b.id, w.name);
      const bt = el_('button', 'kja', hat ? 'Behandeln' : 'Gerät fehlt'); bt.disabled = !hat || !k.liegen.some(x => !x); bt.onclick = () => behandeln(w.id);
      const nein = el_('button', 'knein', '✕'); nein.title = 'Ablehnen'; nein.setAttribute('aria-label', 'Ablehnen'); nein.disabled = !ablehnenRest(k); nein.onclick = () => ablehnen(w.id);
      const geduld = el_('i', 'kgeduld'); const live = () => { geduld.style.width = Math.max(0, 100 - (Date.now() - w.ankunft) / 10 / (w.geduld || KQ.GEDULD)) + '%' }; live(); KLINIK_LIVE.push(live);
      r.append(el_('span', 'kic', b.icon), txt, el_('em', 'kbetrag', euro(honorar(b, k, w))), bt, nein, geduld); body.append(r) } body.append(wirtschaftBlock(k)) }
  else if (KLINIK.tab === 'geraete') { body.append(el_('p', 'hin', 'Jedes Gerät schaltet Behandlungen frei. Bessere Bewertung, anspruchsvollere Kundinnen, höhere Honorare.')); if (typeof meisterBereich === 'function') meisterBereich(k, body); body.append(el_('h4', null, 'Geräte'));
    for (const g of KQ.GERAETE) { const hat = !!k.geraete[g.id], r = el_('div', 'ware'); const l = el_('div'); const behs = KQ.BEHANDLUNGEN.filter(b => b.geraet === g.id);
      l.append(el_('b', null, `${behs.map(b => b.icon).join(' ')} ${g.name}`), el_('small', null, behs.map(b => `${b.name} · ${euro(b.preis)} · ${dauer(b.dauer)}`).join(' / ')));
      const etFehlt = g.etage && !k.etagen[g.etage]; const bt = el_('button', hat ? null : 'cta', hat ? 'In deiner Praxis' : etFehlt ? `erst ${KQ.ETAGEN.find(e => e.id === g.etage).name}` : k.sterne < g.ab ? `ab ${g.ab.toFixed(1)} ★` : euro(g.preis)); bt.disabled = hat || etFehlt || k.sterne < g.ab || ST.geld < g.preis; bt.onclick = () => geraetKaufen(g.id); r.append(l, bt); body.append(r) } }
  else if (KLINIK.tab === 'social') { if (typeof influencerBereich === 'function') influencerBereich(k, body); if (typeof kongressBereich === 'function') kongressBereich(k, body); if (typeof bewertungenBereich === 'function') bewertungenBereich(k, body); const f = ST.follower || 0; const kopf = el_('div', 'praxiskopf'), k1 = el_('div'), k2 = el_('div'); k1.append(el_('small', null, 'Follower'), el_('b', null, f.toLocaleString('de-DE'))); k2.append(el_('small', null, 'Deine Ruhm-Stufe'), el_('b', null, ruhmStufe().name)); kopf.append(k1, k2); body.append(kopf);
    body.append(el_('p', 'hin', 'Plane deine Beiträge. Sie werden in echter Zeit produziert und gehen dann online. Bis zu drei Beiträge im Content-Kalender.' + (k.marketing ? ` Dein Marketing (${RUHM.MARKETING[k.marketing].name}) holt ${k.marketing * 25} % mehr raus.` : '')));
    for (const p of k.posts) { const d = KQ.POSTS.find(x => x.id === p.id), r = el_('div', 'freundin live'), l = el_('div'), z = el_('small'); l.append(el_('b', null, `${d.icon} ${d.name}`), z); const live = () => { z.textContent = `geht online in ${dauer(Math.max(0, (p.t0 + d.dauer * 1000 - Date.now()) / 1000))}` }; live(); KLINIK_LIVE.push(live); r.append(l, el_('span', 'marke', 'GEPLANT')); body.append(r) }
    body.append(el_('h4', null, 'Neuer Beitrag'));
    for (const d of KQ.POSTS) { const r = el_('div', 'ware'), l = el_('div'); const gesperrt = f < d.ab, fehlt = d.braucht === 'behandelt' && !k.behandelt; l.append(el_('b', null, `${d.icon} ${d.name}`), el_('small', null, `${d.follower[0].toLocaleString('de-DE')} bis ${d.follower[1].toLocaleString('de-DE')} Follower · Produktion ${dauer(d.dauer)}${gesperrt ? ` · ab ${d.ab.toLocaleString('de-DE')} Follower` : ''}${fehlt ? ' · erst nach deiner ersten Behandlung' : ''}`));
      const bt = el_('button', 'cta', 'Planen'); bt.disabled = gesperrt || fehlt || k.posts.length >= 3; bt.onclick = () => { k.posts.push({ id: d.id, t0: Date.now() + k.posts.reduce((s, p) => s, 0) }); save(); toast(`${d.name} ist in Produktion`); klinikZeichnen() }; r.append(l, bt); body.append(r) } }
  else if (KLINIK.tab === 'rang') { if (typeof ligaBereich === 'function') { ligaBereich(k, body); body.append(el_('h4', null, 'Alle Kliniken der Stadt')) } const liste = KQ.RIVALEN.map(r => { const tage = Math.floor((Date.now() / 864e5) - 20400); return { name: r.name, haus: r.haus, beh: r.behandlungen + tage * Math.round(r.aerzte * 6), aerzte: r.aerzte, sterne: r.sterne, follower: r.follower + tage * Math.round(r.follower / 400), umsatz: r.umsatz + tage * r.aerzte * 2400, art: 'NPC' } });
    if (typeof SPIELER !== 'undefined') for (const [id, x] of SPIELER) { let st = {}; try { st = x.klinik ? { klinik: x.klinik } : JSON.parse(x.stand || '{}') } catch (e) {} if (!st.klinik) continue; liste.push({ name: x.handle, haus: 'Glow Tower', beh: st.klinik.behandelt || 0, aerzte: 1 + (st.klinik.team && st.klinik.team.aerztin ? 1 : 0), sterne: st.klinik.sterne || 3, follower: x.fol || 0, umsatz: st.klinik.umsatz || 0, art: 'LIVE' }) }
    liste.push({ name: (ST.profil && ST.profil.handle) || 'Du', haus: 'Glow Tower', beh: k.behandelt, aerzte: 1 + (k.team.aerztin ? 1 : 0), sterne: k.sterne, follower: ST.follower || 0, umsatz: k.umsatz, art: 'DU' });
    KLINIK.sort = KLINIK.sort || 'beh'; const sw = el_('div', 'tabs'); sw.style.alignSelf = 'flex-start'; for (const [key, n] of [['beh', 'Behandlungen'], ['umsatz', 'Umsatz'], ['follower', 'Follower'], ['sterne', 'Bewertung']]) { const b = el_('button', null, n); b.setAttribute('aria-pressed', KLINIK.sort === key); b.onclick = () => { KLINIK.sort = key; klinikZeichnen() }; sw.append(b) } body.append(sw);
    liste.sort((a, b) => b[KLINIK.sort] - a[KLINIK.sort]).forEach((c, i) => { const r = el_('div', 'freundin' + (c.art === 'DU' ? ' live' : '')), l = el_('div'); const n = el_('b', null, `${i + 1}. ${c.name}`); n.prepend(el_('span', 'marke', c.art)); l.append(n, el_('small', null, `${c.haus} · ${c.beh.toLocaleString('de-DE')} Behandlungen · ${c.aerzte} ${c.aerzte === 1 ? 'Ärztin' : 'Ärztinnen'} · ${c.sterne.toFixed(1)} ★ · ${Math.round(c.follower).toLocaleString('de-DE')} Follower · ${euro(Math.round(c.umsatz))}`)); r.append(l); body.append(r) }) }
  else if (KLINIK.tab === 'team') { body.append(el_('h4', null, 'Marketing'));
    const mk = RUHM.MARKETING[k.marketing], nx = RUHM.MARKETING[k.marketing + 1]; const rm = el_('div', 'freundin live'), lm = el_('div'); lm.append(el_('b', null, `📣 ${mk.name}`), el_('small', null, `Stufe ${k.marketing} von 7 · mehr VIP-Kundinnen${mk.lohn ? ` · ${euro(mk.lohn)} pro Stunde` : ''}`));
    const bm = el_('button', nx ? 'cta' : null, nx ? `${nx.name} · ${euro(nx.einstellen)}` : 'Höchste Stufe'); bm.disabled = !nx || ST.geld < nx.einstellen; bm.onclick = marketingHoch; rm.append(lm, bm); body.append(rm);
    body.append(el_('h4', null, 'Werbebudget pro Stunde')); const bb = el_('div', 'tabs'); bb.style.alignSelf = 'flex-start'; bb.style.flexWrap = 'wrap';
    RUHM.BUDGET.forEach((x, i) => { const b = el_('button', null, x.proStunde ? `${x.name} · ${euro(x.proStunde)}` : 'Aus'); b.setAttribute('aria-pressed', k.budget === i); b.onclick = () => { k.budget = i; save(); toast(x.proStunde ? `Werbebudget ${euro(x.proStunde)} pro Stunde: 1 Kundin alle ${dauer(Math.max(KQ.MIN_ABSTAND, KQ.GRUND_ABSTAND / x.kunden))}` : 'Werbebudget aus: 1 Kundin alle 1:30 Min.'); klinikZeichnen() }; bb.append(b) }); body.append(bb);
    body.append(el_('h4', null, 'Praxisteam')); const lohn = KQ.TEAM.filter(t => k.team[t.id]).reduce((s, t) => s + t.lohn, 0); body.append(el_('p', 'hin', `Dein Team arbeitet auch, wenn du nicht in der Klinik bist. Löhne laufen stündlich: zurzeit ${euro(lohn)} pro Stunde${k.loehne ? `, bisher ${euro(k.loehne)} gezahlt` : ''}.`));
    for (const t of KQ.TEAM) { const hat = !!k.team[t.id], r = el_('div', 'freundin' + (hat ? ' live' : '')); const l = el_('div'); l.append(el_('b', null, `${t.icon} ${t.name}`), el_('small', null, `${t.effekt} · ${euro(t.lohn)} pro Stunde`));
      const bt = el_('button', hat ? null : 'cta', hat ? 'Entlassen' : `Einstellen ${euro(t.einstellen)}`); bt.disabled = !hat && ST.geld < t.einstellen; bt.onclick = () => { if (hat) { delete k.team[t.id]; toast(`${t.name} arbeitet nicht mehr bei dir`) } else return teamEinstellen(t.id); save(); hud(); klinikZeichnen() }; r.append(l, bt); body.append(r) } }
  else if (KLINIK.tab === 'ausbau') { if (typeof liegenBereich === 'function') liegenBereich(k, body); const n = KQ.WARTEZIMMER[k.raum + 1]; const r = el_('div', 'ware'); const l = el_('div'); l.append(el_('b', null, `🛋️ Wartezimmer: ${KQ.WARTEZIMMER[k.raum].name}`), el_('small', null, n ? `Nächste Stufe: ${n.name} mit ${n.plaetze} Plätzen` : 'Höchste Stufe erreicht'));
    const bt = el_('button', 'cta', n ? euro(n.preis) : 'Fertig'); bt.disabled = !n || ST.geld < n.preis; bt.onclick = raumKaufen; r.append(l, bt); body.append(r);
    const np = KQ.LIEGEN[k.liegen.length]; const r2 = el_('div', 'ware'); const l2 = el_('div'); l2.append(el_('b', null, `🛏️ Liegen: ${k.liegen.length} von ${KQ.LIEGEN.length}`), el_('small', null, 'Jede Liege behandelt eine Kundin gleichzeitig.'));
    const b2 = el_('button', 'cta', np != null ? euro(np) : 'Fertig'); b2.disabled = np == null || ST.geld < np; b2.onclick = liegeKaufen; r2.append(l2, b2); body.append(r2);
    body.append(el_('h4', null, 'Neue Etagen im Glow Tower'));
    for (const e of KQ.ETAGEN.slice(1)) { const hat = !!k.etagen[e.id], r = el_('div', 'freundin' + (hat ? ' live' : '')), l = el_('div'); l.append(el_('b', null, `🏢 ${e.name}`), el_('small', null, e.text));
      const bt = el_('button', hat ? null : 'cta', hat ? 'Eröffnet' : k.sterne < e.ab ? `ab ${e.ab.toFixed(1)} ★` : euro(e.preis)); bt.disabled = hat || k.sterne < e.ab || ST.geld < e.preis; bt.onclick = () => etageKaufen(e.id); r.append(l, bt); body.append(r) }
    body.append(el_('h4', null, 'Praxis veredeln'));
    for (const a of KQ.AUSBAU) { const hat = !!k.ausbau[a.id], r = el_('div', 'ware'), l = el_('div'); l.append(el_('b', null, `${a.icon} ${a.name}`), el_('small', null, a.effekt));
      const bt = el_('button', hat ? null : 'cta', hat ? 'In deiner Praxis' : euro(a.preis)); bt.disabled = hat || ST.geld < a.preis; bt.onclick = () => ausbauKaufen(a.id); r.append(l, bt); body.append(r) }
    body.append(el_('p', 'hin', `Bisher ${k.behandelt} Behandlungen, ${euro(k.umsatz)} Umsatz.`)) }
  else if (KLINIK.tab === 'dich') { body.append(el_('p', 'hin', 'Behandlungen von Dr. Glatt für dich selbst. Deine Figur verändert sich sichtbar.')); const box = el_('div'); box.style.cssText = 'display:flex;flex-direction:column;gap:5px'; box.className = 'card'; box.style.position = 'static'; box.style.transform = 'none'; box.style.width = 'auto'; box.style.background = 'none'; box.style.border = '0'; box.style.padding = '0'; box.style.maxHeight = 'none';
    box.append(...WS.KATALOG.filter(VERKAUF.klinik).sort((a, b) => a.rang - b.rang).map(zeile)); body.append(box) } }
document.querySelectorAll('#klinik [data-ktab]').forEach(b => b.onclick = () => { KLINIK.tab = b.dataset.ktab; klinikZeichnen() });
document.querySelector('#klinik .zu').onclick = klinikZu;
document.querySelector('#klinik .klappe').onclick = () => document.getElementById('klinik').classList.toggle('eingeklappt');
document.getElementById('bKlinik').onclick = () => klinikAuf('praxis');
// Zähler am Knopf, auch wenn das Fenster zu ist
setInterval(() => { if (!document.getElementById('start').hidden) return; klinikWeiter(); const s = klinikStatus(); const b = document.getElementById('bKlinik'); if (b) b.dataset.n = s.n || '' }, 3000);
