// Glow City · traum.js · Dein nächster Traum: oben unter der Uhr steht immer das nächste große Statusziel mit Fortschritt.
// Gewählt wird das günstigste Statusstück, das du dir gerade noch nicht leisten kannst (mindestens 20 % über deinem Konto): erreichbar, aber nie geschenkt.
// Ist es leistbar, wird die Leiste grün und führt dich mit einem Tipp direkt in den Laden. Neue Statusgüter sind nur Einträge im Katalog.
const TRAUM_KAT = ['auto', 'tasche', 'jacht', 'jet', 'wohnen', 'schmuck'];
function traumZiel() { const frei = WS.KATALOG.filter(i => TRAUM_KAT.includes(i.kat) && !ST.besitz[i.id]).sort((a, b) => preisVon(a) - preisVon(b));
  const leistbar = frei.filter(i => preisVon(i) <= ST.geld), offen = frei.find(i => preisVon(i) > ST.geld * 1.2);
  // Ein leistbares Stück bleibt Traum, bis es gekauft ist, sonst wäre der grüne Moment nach Sekunden wieder weg
  const alt = ST.traum && frei.find(i => i.id === ST.traum); if (alt) return alt; const neu = offen || leistbar[leistbar.length - 1] || null; if (neu) ST.traum = neu.id; return neu }
function traumLaden(it) { return B.find(b => b.pod && (b.pod.shops || []).some(s => s[3] === it.laden)) }
function traumZeigen() { let el = document.getElementById('traum'); if (!el) { el = document.createElement('button'); el.id = 'traum'; el.className = 'traum'; document.body.append(el) }
  const it = traumZiel(); if (!it || !document.getElementById('start').hidden || INNEN) { el.hidden = true; return } const p = preisVon(it), anteil = Math.min(1, ST.geld / p), da = anteil >= 1;
  el.hidden = false; el.classList.toggle('da', da); el.replaceChildren(el_('i', null), el_('span', null, da ? `✨ Jetzt leistbar: ${it.name} ›` : `✨ Dein Traum: ${it.name} · ${Math.floor(anteil * 100)} %`)); el.firstChild.style.width = anteil * 100 + '%';
  el.title = `${it.name} · ${euro(p)}`; el.onclick = () => { const b = traumLaden(it); if (b && typeof wohinFahren === 'function') wohinFahren(b); else toast(`${it.name} · ${euro(p)}`) } }
setInterval(traumZeigen, 1500);
