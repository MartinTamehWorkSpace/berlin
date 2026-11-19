// Berlin City · nachbarn.js · Beziehungen zu den Nachbarn: Reden, Flirten, Wohnung besuchen, Freundschaft, Date, Club, Yacht, Urlaub, Affäre. Frech wie Sex and the City.
// Jede Aktion bringt Nähe (0 bis 100), Stil (Glow-Punkte) und Follower. Die Daten stehen in src/daten/nachbarn.js.
const NB = window.GLOW_NACHBARN;
function beziehung(id) { ST.nachbarn = ST.nachbarn || {}; return ST.nachbarn[id] = ST.nachbarn[id] || { nahe: 0, freund: false, zuletzt: {}, reden: { tag: '', n: 0 } } }
function aktionFrei(bz, a) { const z = bz.zuletzt[a.id] || 0, jetzt = Date.now();
  if (a.pro === 'einmal') return !bz.freund; if (a.pro === 'mehrmals') { const tag = new Date().toDateString(); if (bz.reden.tag !== tag) bz.reden = { tag, n: 0 }; return bz.reden.n < a.max }
  return jetzt - z > (a.pro === 'drei' ? 3 : 1) * 864e5 }
// Dein Stil im Verhältnis zum Anspruch: unter dem Anspruch wächst die Nähe langsamer, darüber schneller (0,5 bis 1,5)
const reizFaktor = n => Math.max(.5, Math.min(1.5, (ST.stil || 0) / Math.max(1, n.anspruch)));
function aktionGrund(bz, a, n) { if (bz.nahe < a.ab) return `ab ${a.ab} Nähe`; if ((a.anspruch || a.id === 'affaere') && n && (ST.stil || 0) < n.anspruch) return `will ${n.anspruch.toLocaleString('de-DE')} Stil`; if (a.freund && !bz.freund) return 'erst Freundschaft'; if (a.boot && !(typeof bootBesitz === 'function' && bootBesitz())) return 'eigenes Boot nötig';
  if (!aktionFrei(bz, a)) return a.pro === 'einmal' ? 'schon befreundet' : a.pro === 'mehrmals' ? 'morgen wieder' : a.pro === 'drei' ? 'in ein paar Tagen' : 'morgen wieder'; if (a.kosten && ST.geld < a.kosten) return `${euro(a.kosten)} nötig`; return '' }
function nachbarAktion(n, a) { const bz = beziehung(n.id); if (aktionGrund(bz, a, n)) return; if (a.kosten) ST.geld -= a.kosten;
  if (a.pro === 'mehrmals') bz.reden.n++; else bz.zuletzt[a.id] = Date.now(); if (a.id === 'freund') bz.freund = true;
  bz.nahe = Math.min(100, bz.nahe + a.bringt.nahe * reizFaktor(n)); ST.stil = (ST.stil || 0) + a.bringt.stil; ST.follower = (ST.follower || 0) + a.bringt.fol; xpGeben(a.bringt.stil * 2);
  const vorname = n.name.split(' ')[0], liste = NB.TEXTE[a.id] || ['']; bz.satz = bz.satz || {}; let nr; do { nr = Math.floor(Math.random() * liste.length) } while (liste.length > 1 && nr === bz.satz[a.id]); bz.satz[a.id] = nr; const satz = liste[nr].replace(/\{n\}/g, vorname);
  const text = a.id === 'wohnung' ? `${n.wohnung.art} im ${n.wohnung.haus}. ${n.wohnung.text} ${satz}` : satz;
  if (a.id !== 'reden' && typeof news === 'function' && Math.random() < .6) { const k = NB.KLATSCH[Math.floor(Math.random() * NB.KLATSCH.length)]; news(k.replace('{du}', (ST.profil && ST.profil.handle) || 'Jemand').replace('{n}', vorname)) }
  if (INNEN && offen && typeof zeigeEtage === 'function') setTimeout(() => zeigeEtage(offen));
  banner(`${a.icon} ${a.name.toUpperCase()}`, text, `+${a.bringt.stil} Stil · +${a.bringt.fol} Follower · Nähe ${Math.round(bz.nahe)}`); save(); hud(); karten() }
// In der Personenkarte: Beruf, Nähe-Balken und alle Aktionen
function nachbarAktionen(d, p) { const n = NB.LEUTE.find(x => x.id === p.nachbarId); if (!n) return; const bz = beziehung(n.id);
  const kopf = document.createElement('div'); kopf.className = 'nbkopf'; const b = document.createElement('b'); b.textContent = `${n.beruf}${bz.freund ? ' · befreundet' : ''}`; const leiste = document.createElement('div'); leiste.className = 'nbleiste'; const i = document.createElement('i'); i.style.width = Math.round(bz.nahe) + '%'; leiste.append(i);
  const s = document.createElement('small'), mag = (ST.stil || 0) >= n.anspruch; s.textContent = `Nähe ${Math.round(bz.nahe)} von 100 · ${mag ? 'findet dich interessant' : `will ${n.anspruch.toLocaleString('de-DE')} Stil, du hast ${(ST.stil || 0).toLocaleString('de-DE')}`}`; kopf.append(b, leiste, s); d.append(kopf);
  const raster = document.createElement('div'); raster.className = 'nbraster';
  for (const a of NB.AKTIONEN) { const grund = aktionGrund(bz, a, n), k = document.createElement('button'); k.className = 'nbknopf'; k.disabled = !!grund; const t = document.createElement('span'); t.textContent = `${a.icon} ${a.name}`; const u = document.createElement('small'); u.textContent = grund || (a.kosten ? euro(a.kosten) : `+${a.bringt.stil} Stil`); k.append(t, u); k.onclick = () => nachbarAktion(n, a); raster.append(k) }
  if (typeof affaere === 'function' && AFFAERE.an) { const k = document.createElement('button'), ok = bz.nahe >= 40 && (ST.stil || 0) >= n.anspruch; k.className = 'nbknopf affaere'; k.disabled = !ok; const t = document.createElement('span'); t.textContent = '💋 Affäre riskieren'; const u = document.createElement('small'); u.textContent = ok ? '50:50 um 500 Follower' : bz.nahe < 40 ? 'ab 40 Nähe' : `will ${n.anspruch.toLocaleString('de-DE')} Stil`; k.append(t, u); k.onclick = () => affaere(p); raster.append(k) }
  d.append(raster) }
// Zu Hause bei einem Nachbarn: Szene des Tages, Wohnungstext und alle Aktionen direkt in der Hauskarte
const SZENEN = ['Hausparty, die Playlist läuft seit Stunden', 'Weinabend mit zwei Freundinnen', 'Pre-Drinks vor dem Club', 'Late-Night-Talk auf der Terrasse', 'Sushi bestellt, Serie läuft, keiner schaut hin', 'Fotoshooting im Wohnzimmer, Ringlicht an'];
function nachbarZuHause(cb, id) { const n = NB.LEUTE.find(x => x.id === id), p = P.find(x => x.nachbarId === id); if (!n || !p) return; const tag = new Date().getDate(), szene = SZENEN[(tag + n.id.length) % SZENEN.length];
  const h = document.createElement('h4'); h.textContent = `Bei ${n.name.split(' ')[0]} zu Hause`; const t = document.createElement('p'); t.className = 'hin'; t.textContent = `${szene}. ${n.wohnung.text}`; const box = document.createElement('div'); nachbarAktionen(box, p); cb.append(h, t, box) }
