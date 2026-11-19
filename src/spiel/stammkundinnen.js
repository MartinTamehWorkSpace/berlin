// Berlin · stammkundinnen.js · Stammkundinnen und Bewertungen der Klinik.
// Stammkundinnen kommen mit ihrer Geschichte wieder, wollen ihre Lieblingsbehandlung und zahlen pro Besuch 10 % mehr (bis 50 %).
// Ab dem 4. Besuch ist sie deine beste Kundin: Follower und ab dann VIP. Jede Behandlung bekommt eine Bewertung mit Sternen und einem Satz.
const STAMM = { neuAb: 3, wiederChance: .22, neuChance: .1, pause: 4 * 60000, treueProBesuch: .1, treueMax: .5, besteAb: 4, besteFollower: 2000 };
// Promi-Anfrage: selten, nur wenn du gerade da bist. Wartet nur kurz, zahlt das 5-Fache, bringt Follower und eine Stadt-News.
const PROMI = { abstand: 20 * 60000, chance: .08, geduld: 150, treue: 1.5, follower: 1500 };
function stammWahl(k, kd) { const KD = window.GLOW_KUNDINNEN; if (!KD || k.behandelt < STAMM.neuAb) return kd; k.kartei = k.kartei || {};
  if (aktiv(k) && k.behandelt >= 5 && Date.now() - (k.promiZuletzt || 0) > PROMI.abstand && Math.random() < PROMI.chance) { k.promiZuletzt = Date.now(); const name = KQ.VIP[Math.floor(Math.random() * KQ.VIP.length)];
    setTimeout(() => { banner('⭐ PROMI-ANFRAGE', `${name} will jetzt zu dir`, `Wartet nur ${PROMI.geduld / 60 | 0} Minuten · zahlt das 5-Fache`); if (typeof news === 'function') news(`${name} wurde gerade vor dem Alex Tower gesehen`) }, 300);
    return Object.assign(kd, { name, vip: true, promi: true, icon: '⭐', treue: PROMI.treue, geduld: PROMI.geduld }) }
  const da = new Set([...k.warte.map(w => w.name), ...k.liegen.filter(Boolean).map(l => l.kundin.name)]), jetzt = Date.now();
  const kann = s => !da.has(s.name) && (!k.kartei[s.name] || jetzt - k.kartei[s.name].zuletzt > STAMM.pause) && s.wunsch.some(id => { const b = behandlung(id); return b && k.geraete[b.geraet] && (!b.etage || k.etagen[b.etage]) });
  const bekannt = KD.filter(s => k.kartei[s.name] && kann(s)), neu = KD.filter(s => !k.kartei[s.name] && kann(s));
  const s = bekannt.length && Math.random() < STAMM.wiederChance ? bekannt[Math.floor(Math.random() * bekannt.length)] : neu.length && Math.random() < STAMM.neuChance ? neu[Math.floor(Math.random() * neu.length)] : null; if (!s) return kd;
  const b = s.wunsch.map(behandlung).find(b => b && k.geraete[b.geraet] && (!b.etage || k.etagen[b.etage])), besuch = ((k.kartei[s.name] || {}).besuche || 0) + 1;
  return Object.assign(kd, { name: s.name, beh: b.id, stamm: true, icon: s.icon, besuch, treue: Math.min(STAMM.treueMax, (besuch - 1) * STAMM.treueProBesuch), anlass: s.anlass[Math.min(besuch - 1, s.anlass.length - 1)], vip: besuch >= STAMM.besteAb || kd.vip }) }
// Nach dem Kassieren: Bewertung schreiben, Kartei führen, beste Kundin feiern
function stammBesuch(k, l, still) { const kd = l.kundin, BW = window.GLOW_BEWERTUNGEN || {};
  let sterne = still ? (Math.random() < .7 ? 4 : 3) : l.selbst != null ? (l.selbst >= 85 ? 5 : l.selbst >= 55 ? 4 : 3) : l.express ? 5 : l.persoenlich ? (Math.random() < .6 ? 5 : 4) : 4;
  if (kd.stamm && sterne < 5 && !still) sterne++;
  const saetze = BW[sterne] || BW[4] || ['Zufrieden'], text = saetze[Math.floor(Math.random() * saetze.length)];
  k.bewertungen = [{ name: kd.name, sterne, text, beh: kd.beh, t: Date.now() }, ...(k.bewertungen || [])].slice(0, 30);
  if (kd.promi) { ST.follower = (ST.follower || 0) + PROMI.follower; k.followerPlus = (k.followerPlus || 0) + PROMI.follower; if (typeof news === 'function') news(`${kd.name} postet ein Selfie aus der Klinik von ${(ST.profil && ST.profil.handle) || 'dir'}`) }
  if (kd.stamm) { k.kartei = k.kartei || {}; const e = k.kartei[kd.name] = k.kartei[kd.name] || { besuche: 0 }; e.besuche++; e.zuletzt = Date.now();
    if (e.besuche === STAMM.besteAb) { ST.follower = (ST.follower || 0) + STAMM.besteFollower; k.followerPlus = (k.followerPlus || 0) + STAMM.besteFollower; banner('BESTE KUNDIN', `${kd.icon} ${kd.name}: ${kd.anlass}`, `+${STAMM.besteFollower.toLocaleString('de-DE')} Follower · ab jetzt VIP`) } }
  return { sterne, text } }
// Im Social-Reiter: Schnitt der letzten Bewertungen, die Sätze der Kundinnen und deine Stammkundinnen mit Besuchen
function bewertungenBereich(k, body) { const liste = k.bewertungen || []; body.append(el_('h4', null, 'Bewertungen deiner Kundinnen'));
  if (!liste.length) { body.append(el_('p', 'hin', 'Nach jeder Behandlung bewertet dich die Kundin. Selbst behandeln und schnell drannehmen bringt 5 Sterne.')); }
  else { const schnitt = liste.reduce((s, b) => s + b.sterne, 0) / liste.length; body.append(el_('p', 'hin', `${schnitt.toFixed(1).replace('.', ',')} von 5 Sternen aus ${liste.length} Bewertungen`));
    for (const b of liste.slice(0, 6)) { const r = el_('div', 'bewertung'); r.append(el_('span', 'bsterne', sterneText(b.sterne)), el_('b', null, `„${b.text}“`), el_('small', null, `${b.name} · ${(behandlung(b.beh) || {}).name || ''}`)); body.append(r) } }
  const kartei = Object.entries(k.kartei || {}); if (!kartei.length) return; body.append(el_('h4', null, 'Deine Stammkundinnen'));
  for (const [name, e] of kartei.sort((a, b) => b[1].besuche - a[1].besuche)) { const s = (window.GLOW_KUNDINNEN || []).find(x => x.name === name) || {}, r = el_('div', 'freundin'), l = el_('div');
    l.append(el_('b', null, `${s.icon || '♥'} ${name}${e.besuche >= STAMM.besteAb ? ' · beste Kundin' : ''}`), el_('small', null, `${e.besuche} ${e.besuche === 1 ? 'Besuch' : 'Besuche'} · Treuebonus +${Math.round(Math.min(STAMM.treueMax, e.besuche * STAMM.treueProBesuch) * 100)} % beim nächsten Mal`)); r.append(l); body.append(r) } }
