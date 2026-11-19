// Berlin · aufgaben.js · Tagesaufgaben, Erfolge und das große Belohnungsbanner
// Andere Module melden, was passiert ist: ereignis('kauf', {it}) usw. Neue Aufgaben sind nur ein Eintrag in AUFGABEN_POOL.
const AUFGABEN_POOL = [
  /* Berlin (Martin 19.11.2026): Tagesjobs nach Karriere. kar leer = für alle */
  { id: 'doener',  text: 'Hol dir einen Gemüsekebap bei Mostafas',          typ: 'doener',                    geld: 300,   stil: 3 },
  { id: 'ubahn',   text: 'Fahr zweimal mit der U-Bahn',                     typ: 'ubahn',   ziel: 2,          geld: 500,   stil: 4 },
  { id: 'berg',    text: 'Komm am Türsteher vom Berghain vorbei',           typ: 'betreten', wenn: d => d.b.title === 'Berghain', geld: 600, stil: 8 },
  { id: 'scorp',   text: 'Sunset im Scorpius Berlin',                       typ: 'betreten', wenn: d => /Scorpius/.test(d.b.title), geld: 800, stil: 8 },
  { id: 'chat',    text: 'Schreib etwas in den Stadt-Chat',                 typ: 'chat',                      geld: 200,   stil: 2 },
  { id: 'foto',    text: 'Mach ein Selfie in der Stadt',                    typ: 'foto',                      geld: 600,   stil: 5 },
  { id: 'deal3',   text: 'Mach heute 3 Deals',            kar: 'dealer',    typ: 'deal',    ziel: 3,          geld: 15000, stil: 10 },
  { id: 'ware',    text: 'Hol Nachschub beim Kontakt am Kotti', kar: 'dealer', typ: 'nachschub',              geld: 5000,  stil: 4 },
  { id: 'flucht',  text: 'Häng die Polizei ab',           kar: 'dealer',    typ: 'entkommen',                 geld: 25000, stil: 12 },
  { id: 'kasse2',  text: 'Leer zweimal eine Kasse',       kar: 'gastro',    typ: 'kasse',   ziel: 2,          geld: 20000, stil: 8 },
  { id: 'promi',   text: 'Gib einen Promi-Abend',         kar: 'gastro',    typ: 'promi',                     geld: 50000, stil: 15 },
  { id: 'ausbau',  text: 'Bau eins deiner Lokale aus',    kar: 'gastro',    typ: 'ausbau',                    geld: 30000, stil: 10 },
  { id: 'cont3',   text: 'Dreh 3 Mal Content an Hotspots', kar: 'influ',    typ: 'content', ziel: 3,          geld: 12000, stil: 10 },
  { id: 'live',    text: 'Geh einmal live',               kar: 'influ',     typ: 'live',                      geld: 6000,  stil: 6 },
  { id: 'koop',    text: 'Nimm eine Kooperation an',      kar: 'influ',     typ: 'koop',                      geld: 20000, stil: 10 }
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
    { id: 'woche',    name: 'Sieben Tage Berlin',    wenn: () => (ST.kal && ST.kal.n) >= 7, stil: 70 }
];
function tagesAufgaben() { const h = heute(); if (ST.aufg && ST.aufg.tag === h && ST.aufg.kar === (ST.karriere || '')) return ST.aufg.liste;
  let z = [...h].reduce((a, c) => a * 31 + c.charCodeAt(0) >>> 0, 7); const pool = AUFGABEN_POOL.filter(a => !a.kar || a.kar === ST.karriere), liste = [];
  while (liste.length < 4) { z = (z * 1103515245 + 12345) >>> 0; liste.push({ id: pool.splice(z % pool.length, 1)[0].id, fort: 0, fertig: false }) }
  ST.aufg = { tag: h, kar: ST.karriere || '', liste }; save(); return liste }
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
