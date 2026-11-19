// Berlin City · aufgaben.js · Tagesaufgaben, Erfolge und das große Belohnungsbanner
// Andere Module melden, was passiert ist: ereignis('kauf', {it}) usw. Neue Aufgaben sind nur ein Eintrag in AUFGABEN_POOL.
const AUFGABEN_POOL = [
  { id: 'latte',   text: 'Hol dir einen Oat Latte bei Café Zweistein',         typ: 'kauf',    wenn: d => d.it.id === 'latte',             geld: 300,  stil: 3 },
  { id: 'zahra',   text: 'Kauf ein Teil bei Zahra',                      typ: 'kauf',    wenn: d => d.it.laden === 'zahra',          geld: 500,  stil: 5 },
  { id: 'spa',     text: 'Gönn dir eine Massage im Spree Spa',            typ: 'kauf',    wenn: d => d.it.id === 'massage',           geld: 600,  stil: 6 },
  { id: 'schmuck', text: 'Kauf ein Schmuckstück',                        typ: 'kauf',    wenn: d => d.it.kat === 'schmuck',          geld: 1500, stil: 12 },
  { id: 'tasche',  text: 'Hol dir eine neue Tasche',                     typ: 'kauf',    wenn: d => d.it.kat === 'tasche',           geld: 2500, stil: 20 },
  { id: 'rivva',   text: 'Geh ins Papillong am Wasser',                      typ: 'betreten', wenn: d => d.b.title === 'Papillong',          geld: 400,  stil: 4 },
  { id: 'borch',   text: 'Lass dich im Borchert sehen',                  typ: 'betreten', wenn: d => d.b.title === 'Borchert',       geld: 400,  stil: 4 },
  { id: 'nicky',   text: 'Besuch den Scorpius Berlin',             typ: 'betreten', wenn: d => /Nicky/.test(d.b.title),        geld: 800,  stil: 8 },
  { id: 'klinik',  text: 'Lass dich bei Dr. Glatt beraten',              typ: 'betreten', wenn: d => /Glatt/.test(d.b.title),        geld: 400,  stil: 4 },
  { id: 'fahren',  text: 'Fahr 40 Straßen weit mit deinem Auto',          typ: 'fahren',  ziel: 40,                                   geld: 1000, stil: 10 },
  { id: 'vote',    text: 'Stimm ab, was in die Stadt kommt',             typ: 'vote',                                                geld: 300,  stil: 3 },
  { id: 'chat',    text: 'Schreib etwas in den Stadt-Chat',              typ: 'chat',                                                geld: 200,  stil: 2 },
  { id: 'arbeit',  text: 'Check bei der Arbeit ein',                     typ: 'arbeit',                                              geld: 500,  stil: 5 },
  { id: 'foto',    text: 'Poste ein Selfie',                             typ: 'foto',                                                geld: 600,  stil: 6 },
  { id: 'klinik',  text: 'Behandle 4 Kundinnen in deiner Klinik',        typ: 'behandlung', ziel: 4,                                 geld: 3000, stil: 20 },
  { id: 'verkauf', text: 'Verkauf 6 Teile in deiner Boutique',           typ: 'verkauf', ziel: 6,                                    geld: 1500, stil: 12 },
  { id: 'besuch',  text: 'Besuch zwei Boutiquen von Freundinnen',        typ: 'besuch',  ziel: 2,                                    geld: 800,  stil: 8 }
];
// Erfolge: einmalig, prüfen den Spielstand
const ERFOLGE = [
  { id: 'erstes',   name: 'Erster Einkauf',      wenn: () => Object.keys(ST.besitz).length >= 1, stil: 10 },
  { id: 'bronze',   name: 'Bronze Card',         wenn: () => ST.stil >= 100,  stil: 0 },
  { id: 'silber',   name: 'Silber Card',         wenn: () => ST.stil >= 500,  stil: 0 },
  { id: 'gold',     name: 'Gold Card',           wenn: () => ST.stil >= 1500, stil: 0 },
  { id: 'platin',   name: 'Platin Card',         wenn: () => ST.stil >= 5000, stil: 0 },
  { id: 'auto',     name: 'Eigene Wagen',        wenn: () => WS.KATALOG.some(i => i.kat === 'auto' && ST.besitz[i.id]), stil: 25 },
  { id: 'birkinn',  name: 'Die Birkinn gehört dir', wenn: () => !!ST.besitz.birkinn, stil: 150 },
  { id: 'schmuck5', name: 'Schmuckschatulle',    wenn: () => WS.KATALOG.filter(i => i.kat === 'schmuck' && ST.besitz[i.id]).length >= 5, stil: 60 },
  { id: 'serie7',   name: 'Eine Woche am Stück', wenn: () => ST.serie >= 7,   stil: 40 },
  { id: 'million',  name: 'Millionärin',         wenn: () => meinVermoegen() >= 1e6, stil: 50 },
  { id: 'aufg10',   name: '10 Aufgaben geschafft', wenn: () => (ST.aufgZahl || 0) >= 10, stil: 50 },
  { id: 'flug',     name: 'Abgehoben',           wenn: () => (ST.fluege || 0) >= 1, stil: 30 },
  { id: 'set1',     name: 'Erstes Set komplett', wenn: () => typeof setKomplett === 'function' && BQ.SETS.some(setKomplett), stil: 80 },
  { id: 'woche',    name: 'Sieben Tage Glow',    wenn: () => (ST.kal && ST.kal.n) >= 7, stil: 70 },
  { id: 'album20',  name: 'Halbe Kollektion',        wenn: () => Object.keys(ST.album || {}).length >= 20, stil: 100 }
];
function tagesAufgaben() { const h = heute(); if (ST.aufg && ST.aufg.tag === h) return ST.aufg.liste;
  let z = [...h].reduce((a, c) => a * 31 + c.charCodeAt(0) >>> 0, 7); const pool = [...AUFGABEN_POOL], liste = [];
  while (liste.length < 4) { z = (z * 1103515245 + 12345) >>> 0; liste.push({ id: pool.splice(z % pool.length, 1)[0].id, fort: 0, fertig: false }) }
  ST.aufg = { tag: h, liste }; save(); return liste }
function ereignis(typ, d = {}) { const liste = tagesAufgaben(); let neu = false;
  for (const a of liste) { if (a.fertig) continue; const def = AUFGABEN_POOL.find(x => x.id === a.id); if (!def || def.typ !== typ) continue;
    if (def.ziel) { a.fort += d.menge || 1; if (a.fort < def.ziel) { neu = true; continue } } else if (def.wenn && !def.wenn(d)) continue;
    a.fertig = true; ST.geld += def.geld; ST.stil += def.stil; ST.aufgZahl = (ST.aufgZahl || 0) + 1; neu = true;
    banner('AUFGABE GESCHAFFT', def.text, `+${euro(def.geld)} · +${def.stil} Stil`) }
  if (typeof xpGeben === 'function' && BQ.XP_EREIGNIS[typ]) { xpGeben(BQ.XP_EREIGNIS[typ] * (d.menge || 1)); neu = true }
  if (neu) { save(); hud(); aufgabenZaehler() } erfolgePruefen() }
function erfolgePruefen() { ST.erfolge = ST.erfolge || {};
  for (const e of ERFOLGE) { if (ST.erfolge[e.id] || !e.wenn()) continue; ST.erfolge[e.id] = heute(); ST.stil += e.stil; save(); hud();
    banner('ERFOLG FREIGESCHALTET', e.name, e.stil ? `+${e.stil} Stil` : 'Neue Kartenstufe'); return } }
// Großes Banner in der Bildmitte, kommt und geht von selbst
const BANNER = [];
function banner(kopf, text, lohn) { if (BANNER.length > 3) BANNER.splice(1, 1); BANNER.push({ kopf, text, lohn }); if (BANNER.length === 1) bannerZeigen() }
function bannerZeigen() { const b = BANNER[0]; if (!b) return; const el = document.getElementById('banner'); el.replaceChildren();
  const k = document.createElement('b'); k.textContent = b.kopf; const t = document.createElement('span'); t.textContent = b.text; const l = document.createElement('em'); l.textContent = b.lohn; el.append(k, t, l);
  el.hidden = false; el.classList.remove('weg'); void el.offsetWidth; el.classList.add('an');
  setTimeout(() => { el.classList.add('weg'); setTimeout(() => { el.hidden = true; el.classList.remove('an', 'weg'); BANNER.shift(); bannerZeigen() }, 350) }, BANNER.length > 1 ? 1600 : 2400) }
function aufgabenZaehler() { const n = tagesAufgaben().filter(a => !a.fertig).length; const b = document.getElementById('bAufg'); if (b) b.dataset.n = n || '' }
function aufgabenPanel() { if (INNEN) return; const cb = panel('Aufgaben des Tages'); const liste = tagesAufgaben();
  const p = document.createElement('p'); p.textContent = 'Vier Aufgaben pro Tag. Um Mitternacht kommen neue.'; cb.append(p);
  const box = document.createElement('div'); box.className = 'vo';
  for (const a of liste) { const def = AUFGABEN_POOL.find(x => x.id === a.id); const r = document.createElement('button'); r.disabled = true; if (a.fertig) r.className = 'meins';
    const w = def.ziel ? Math.min(100, a.fort / def.ziel * 100) : (a.fertig ? 100 : 0);
    r.innerHTML = `<i style="width:${w}%"></i><span><b></b><em style="font-style:normal">${a.fertig ? 'Geschafft' : `+${euro(def.geld)} · +${def.stil} Stil`}</em></span>`; r.querySelector('b').textContent = (a.fertig ? '✓ ' : '') + def.text + (def.ziel && !a.fertig ? ` (${Math.floor(a.fort)}/${def.ziel})` : ''); box.append(r) }
  const h = document.createElement('h4'); h.textContent = 'Erfolge'; const eb = document.createElement('div'); eb.className = 'erfolge';
  for (const e of ERFOLGE) { const x = document.createElement('span'); x.textContent = e.name; if (ST.erfolge && ST.erfolge[e.id]) x.className = 'hat'; eb.append(x) }
  cb.append(box, h, eb) }
