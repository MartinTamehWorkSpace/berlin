// Berlin · scorpius.js · Scorpius Berlin, unser Beachclub an der Spree (Konkurrenz: Berghain von Leon). Vorbild Scorpios Mykonos:
// Boho statt Disco. Weißer Kalkputz, Naturstein, Holzpergola, große Rattanlampen, Leinen-Daybeds, Olivenbäume, Feuer und Weihrauch zum Sonnenuntergang.
// Drei Etagen: Terrasse (Restaurant mit großer Karte), Sunset Ritual (Amphitheater mit Feuer, Trommeln, barfuß tanzen), Bazaar & Spa (Beduinenzelt mit Boutique).
// Haken in innen.js: etagen, innen, innenLeute, zeigeEtage. Antippen von Gästen über window.scorpiusAntippen (stadt.js).
const SC = {
  etagen: [
    { n: 'Terrasse', a: 'sc_terrasse', t: 'Restaurant, Bar und DJ' },
    { n: 'Sunset Ritual', a: 'sc_ritual', t: 'Feuer, Weihrauch, Trommeln' },
    { n: 'Bazaar & Spa', a: 'sc_bazaar', t: 'Beduinenzelt mit Boutique' }],
  karte: [
    ['Essen', [
      ['🫒 Mezze-Platte', 38, 'Hummus, Taramas, Fava, warmes Pita', { fol: 40, energie: 10 }],
      ['🐙 Gegrillter Oktopus', 46, 'mit Fava und Kapern', { fol: 60, energie: 12 }],
      ['🐟 Wolfsbarsch in Salzkruste', 120, 'am Tisch aufgeschlagen', { fol: 150, stil: 4, energie: 18 }],
      ['🥩 Wagyu-Souvlaki', 89, 'vom Holzkohlegrill', { fol: 110, energie: 20 }],
      ['🍯 Baklava mit Tahini-Eis', 19, 'zum Teilen', { fol: 25, energie: 6 }]]],
    ['Drinks', [
      ['🍹 Scorpius Spritz', 24, 'Mastiha, Prosecco, Rosmarin', { fol: 30 }],
      ['🍸 Mastiha Sour', 22, 'Eiweiß, Zitrone, Harz', { fol: 30 }],
      ['🍷 Rosé Magnum', 480, 'für den Tisch', { fol: 400, stil: 6 }],
      ['🥃 Ouzo-Runde fürs ganze Deck', 2500, 'alle stoßen mit dir an', { fol: 1200, stil: 10 }],
      ['🍾 Champagner Jeroboam', 12000, 'mit Wunderkerzen-Parade durchs Restaurant', { fol: 4000, stil: 25 }]]],
    ['Plätze', [
      ['🛏️ Daybed in der ersten Reihe', 1600, 'Leinen, Kissen, Blick aufs Wasser', { fol: 500, stil: 8 }],
      ['⛺ Private Cabana', 16000, 'mit eigenem Butler bis Sonnenuntergang', { fol: 2500, stil: 30 }]]]],
  ritual: [
    ['🔥 Ans Feuer setzen', 0, 'Wärme, Weihrauch, Gespräche', { fol: 60, energie: 8 }, 120],
    ['🌿 Weihrauch entzünden', 0, 'das Ritual beginnt mit dir', { fol: 250, stil: 5 }, 600],
    ['🥁 Bei den Trommeln mitspielen', 0, 'alle Blicke auf dich', { fol: 400, stil: 6 }, 600],
    ['💃 Barfuß tanzen', 0, 'bis die Sterne kommen', { fol: 300, stil: 4, tanz: 30 }, 300],
    ['📸 Sunset-Selfie auf den Stufen', 0, 'das Foto des Tages', { fol: 800, stil: 8 }, 900]],
  bazaar: [
    ['👗 Leinenkleid in Sand', 680, 'handgenäht', { stil: 18 }],
    ['👜 Rattan-Tasche', 420, 'geflochten auf Naxos', { stil: 12 }],
    ['💛 Goldene Kreolen', 1900, 'Statement zum Sonnenuntergang', { stil: 30 }],
    ['🧥 Seidenkaftan', 950, 'fließt beim Tanzen', { stil: 22 }],
    ['🕯️ Räucherset Myrrhe', 60, 'riecht nach Mykonos', { stil: 3 }],
    ['💆 Massage unter dem Zeltdach', 240, 'Energie voll', { energie: 100 }]],
  leute: [
    { n: 'Ilias', t: 'Gastgeber', s: 'Willkommen im Scorpius. Schuhe aus, wenn du willst. Hier zählt nur der Moment.', a: [['Was ist heute besonders?', 'Um sechs zünden wir das Feuer. Dann kommt der DJ aus Athen.', { fol: 30 }], ['Habt ihr noch ein Daybed?', 'Für dich finde ich eins. Erste Reihe.', { stil: 4 }]] },
    { n: 'Sofia', t: 'Barchefin', s: 'Mastiha Sour? Oder lieber etwas, das nach Sommer schmeckt?', a: [['Überrasch mich', 'Rosmarin, Mastiha, ein Hauch Honig. Prost.', { fol: 40, energie: 6 }], ['Was trinkt Berlin hier?', 'Spritz am Tag, Champagner, wenn die Sonne sinkt.', { fol: 20 }]] },
    { n: 'Noor', t: 'Künstlerin aus Kreuzberg', s: 'Ich male gerade das Licht über der Spree. Siehst du, wie es golden wird?', a: [['Darf ich ein Foto von dir machen?', 'Nur wenn ich dich auch male.', { fol: 120, stil: 3 }], ['Kommst du oft her?', 'Jeden Sonntag. Das Berghain ist mir zu dunkel.', { fol: 50 }]] },
    { n: 'Theo', t: 'DJ', s: 'Ich spiele, bis die letzte Person barfuß geht.', a: [['Spielst du meinen Wunsch?', 'Wenn du dich traust zu tanzen.', { fol: 90, tanz: 20 }], ['Was ist dein Lieblingsmoment?', 'Wenn die Sonne weg ist und keiner aufhört.', { fol: 30 }]] },
    { n: 'Mara', t: 'Model', s: 'Das Leinenkleid aus dem Bazaar? Steht dir sicher.', a: [['Komm, wir posen zusammen', 'Sunset im Rücken, Kinn leicht runter. Perfekt.', { fol: 260, stil: 6 }], ['Was ist dein Trick?', 'Weniger Make-up, mehr Schlaf.', { stil: 2 }]] },
    { n: 'Jonas', t: 'Gründer aus Mitte', s: 'Ich hab gerade meine Firma verkauft. Darum die Cabana.', a: [['Glückwunsch! Lädst du ein?', 'Champagner für den Tisch. Setz dich.', { fol: 180, stil: 5, energie: 8 }], ['Was machst du jetzt?', 'Nichts. Endlich.', { fol: 20 }]] },
    { n: 'Lena', t: 'Yogalehrerin', s: 'Atme mit dem Feuer. Ein, aus. Spürst du das?', a: [['Mach ich mit', 'Siehst du. Der Tag fällt ab.', { energie: 25 }], ['Ich will lieber tanzen', 'Tanzen ist auch Atmen.', { fol: 40, tanz: 15 }]] },
    { n: 'Karim', t: 'Koch', s: 'Der Wolfsbarsch kommt gleich aus der Salzkruste. Willst du zuschauen?', a: [['Unbedingt', 'Ein Schlag, und der Duft ist überall. Das filmen alle.', { fol: 150, energie: 10 }], ['Was ist dein Geheimnis?', 'Gutes Salz, gutes Feuer, keine Eile.', { fol: 20 }]] }]
};
const scDran = id => { ST.scorpius = ST.scorpius || {}; return ST.scorpius[id] || 0 };
function scWirkung(w, kosten, titel) { if (kosten && ST.geld < kosten) { toast('Dafür reicht dein Geld nicht'); return false } if (kosten) ST.geld -= kosten;
  if (w.fol) ST.follower = (ST.follower || 0) + w.fol; if (w.stil) ST.stil = (ST.stil || 0) + w.stil; if (w.energie) ST.energie = Math.max(0, Math.min(100, (ST.energie ?? 70) + w.energie));
  if (w.tanz) { ICH.tanzBis = Date.now() + w.tanz * 1000; if (typeof PARTY !== 'undefined') PARTY.tanzBis = ICH.tanzBis } save(); hud();
  const txt = [w.fol ? `+${w.fol} Follower` : '', w.stil ? `+${w.stil} Stil` : '', w.energie ? `Energie +${w.energie}` : ''].filter(Boolean).join(' · ');
  if (titel) banner('SCORPIUS', titel, txt); return true }

/* ---------- Haken für innen.js ---------- */
function scorpiusEtagen(E) { const k = E[0].k; return SC.etagen.map(e => Object.assign({ k }, e)) }
const scIst = b => b && etagen(b)[0].a === 'sc_terrasse';

/* Gäste je Etage: Leinen, Sand, Weiß, Terrakotta, Gold. Gesprächspartner tragen p.sc (Index in SC.leute) */
function scorpiusLeute(b) { if (!scIst(b)) return null; const a = etagen(b)[b.stock || 0].a, L = [], x = b.x, y = b.y;
  const LOOK = [['#f4efe6', '#e8dcc6'], ['#c9a27a', '#f4efe6'], ['#b5643c', '#efe6d6'], ['#efe6d6', '#8a9a5b'], ['#ffffff', '#c9a27a'], ['#e6c76a', '#f4efe6']];
  const gast = (ox, oy, i, extra = {}) => { const k = human({}), [top, leg] = LOOK[i % LOOK.length]; Object.assign(k, { x: x + ox, y: y + oy, idle: 1, ph: i * 1.3, top, c1: top, leg, dress: i % 3 !== 1 ? 1 : 0, sz: 1, acc: i % 4 === 0 ? ['sonnenbrille'] : [] }, extra); L.push(k); return k };
  if (a === 'sc_terrasse') { for (let i = 0; i < 8; i++) gast(.7 + (i % 4) * .55, 1.35 + (i < 4 ? 0 : .9), i);
    for (let i = 0; i < 10; i++) gast(2.7 + (i % 3) * .38 + Math.random() * .1, .6 + Math.floor(i / 3) * .45, i + 3, { tanzt: 1 });
    gast(.5, .45, 0, Object.assign({ sc: 1, name: 'Sofia', top: '#16171a' })); gast(3.6, 3.4, 1, { sc: 0, name: 'Ilias', top: '#efe6d6' }); gast(3.35, .35, 2, { sc: 3, name: 'Theo', top: '#16171a' }); gast(1.6, 3.2, 3, { sc: 7, name: 'Karim', top: '#ffffff' }) }
  else if (a === 'sc_ritual') { for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { const w = Math.PI * (.15 + i * .14), rad = 1.1 + r * .55; gast(2 + Math.cos(w) * rad, 2.6 - Math.sin(w) * rad * .9, r * 6 + i, { sitzt: 1 }) }
    for (let i = 0; i < 6; i++) gast(1.4 + (i % 3) * .5, 2.9 + Math.floor(i / 3) * .4, i + 20, { tanzt: 1 });
    gast(3.4, 3.4, 4, { sc: 6, name: 'Lena' }); gast(.6, 3.3, 2, { sc: 2, name: 'Noor' }) }
  else { for (let i = 0; i < 6; i++) gast(.8 + (i % 3) * 1, 1.6 + Math.floor(i / 3) * 1.2, i + 30);
    gast(3.3, 1.2, 5, { sc: 4, name: 'Mara' }); gast(1.2, 3.3, 1, { sc: 5, name: 'Jonas' }) }
  return L }

/* ---------- Zeichnen ---------- */
function scKreis(x, y, z, r, farbe, rand) { const [a, b] = pt(x, y, z), [c] = pt(x + r, y, z); const rr = Math.abs(c - a) || 4; g.beginPath(); g.ellipse(a, b, rr, rr * .62, 0, 0, Math.PI * 2); g.fillStyle = farbe; g.fill(); if (rand) { g.lineWidth = Math.max(1, rr * .08); g.strokeStyle = rand; g.stroke() } }
function scLampe(x, y, z, r) { const [a, b] = pt(x, y, z), [c] = pt(x + r, y, z), rr = Math.abs(c - a) || 6, [, top] = pt(x, y, 96);
  g.strokeStyle = 'rgba(60,45,30,.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(a, top); g.lineTo(a, b - rr * .9); g.stroke();
  const gl = g.createRadialGradient(a, b + rr * .3, 1, a, b + rr * .3, rr * 2.6); gl.addColorStop(0, 'rgba(255,200,120,.35)'); gl.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gl; g.fillRect(a - rr * 3, b - rr * 2, rr * 6, rr * 5);
  g.beginPath(); g.ellipse(a, b, rr, rr * .95, 0, Math.PI, 0); g.closePath(); g.fillStyle = '#c99a5b'; g.fill(); g.strokeStyle = '#8a6136'; g.lineWidth = Math.max(1, rr * .06);
  for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(a + i * rr * .28, b); g.lineTo(a + i * rr * .12, b - rr * .95); g.stroke() } g.beginPath(); g.ellipse(a, b, rr, rr * .25, 0, 0, Math.PI * 2); g.fillStyle = '#ffd59a'; g.fill() }
function scFeuer(x, y, T) { kiste(x - .3, y - .3, .6, .6, 4, '#4a4038'); for (let i = 0; i < 5; i++) { const [a, b] = pt(x + (i - 2) * .07, y, 4), h = 14 + Math.sin(T * 9 + i * 2) * 5;
  g.beginPath(); g.moveTo(a - 5, b); g.quadraticCurveTo(a, b - h * 1.4, a + 5, b); g.fillStyle = ['#ff7a1a', '#ffb347', '#ff5a1a', '#ffd36b', '#ff7a1a'][i]; g.fill() }
  for (let i = 0; i < 4; i++) { const [a, b] = pt(x, y, 30 + ((T * 12 + i * 18) % 70)); g.fillStyle = `rgba(230,225,215,${.25 - i * .05})`; g.beginPath(); g.arc(a + Math.sin(T + i) * 8, b, 8 + i * 4, 0, 7); g.fill() } }
function scOlive(x, y) { kiste(x - .18, y - .18, .36, .36, 8, '#b5643c'); for (const [dx, dy, z] of [[0, 0, 26], [.15, .05, 22], [-.12, .08, 24]]) scKreis(x + dx, y + dy, z, .32, '#7d8c55', '#5f6b3e') }
function scorpiusInnen(b) { if (!scIst(b)) return false; const x = b.x, y = b.y, a = etagen(b)[b.stock || 0].a, WH = 70, T = performance.now() / 1000;
  const STEIN = a === 'sc_bazaar' ? ['#e9dcc3', '#e2d3b8'] : ['#efe6d6', '#e6dac5'];
  top4(x, y, 4, 4, 0, STEIN[0]); for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if ((i * 3 + j * 5) % 7 === 0) top4(x + i * .5 + .03, y + j * .5 + .03, .44, .44, 0, STEIN[1]);
  /* Kalkwände mit Rundbögen, durch die der Sonnenuntergang über der Spree leuchtet */
  poly([pt(x, y, 0), pt(x + 4, y, 0), pt(x + 4, y, WH), pt(x, y, WH)], '#f6f0e6'); poly([pt(x, y, 0), pt(x, y + 4, 0), pt(x, y + 4, WH), pt(x, y, WH)], '#e9e1d4');
  const himmel = (u0, u1, seite) => { const P = []; const z0 = 10, z1 = a === 'sc_ritual' ? 58 : 46, m = (u0 + u1) / 2, r = (u1 - u0) / 2;
    const p = (u, z) => seite ? pt(x, y + u, z) : pt(x + u, y, z); P.push(p(u0, z0), p(u1, z0)); for (let k = 0; k <= 8; k++) { const w = k / 8 * Math.PI; P.push(p(m + Math.cos(w) * r, z1 + Math.sin(w) * 10)) } P.push(p(u0, z0));
    const [, top] = p(m, z1 + 10), [, bot] = p(m, z0); const gr = g.createLinearGradient(0, top, 0, bot); gr.addColorStop(0, '#f6c27a'); gr.addColorStop(.5, '#ec8f5e'); gr.addColorStop(.85, '#c8687a'); gr.addColorStop(1, '#6f8fa8'); poly(P, gr) };
  if (a === 'sc_ritual') { himmel(.3, 3.7, 0); himmel(.4, 3.6, 1) } else for (const [u0, u1] of [[.35, 1.55], [1.85, 3.05]]) { himmel(u0, u1, 0); himmel(u0 + .25, u1 + .25, 1) }
  poly([pt(x, y, WH - 4), pt(x + 4, y, WH - 4), pt(x + 4, y, WH), pt(x, y, WH)], '#d9cbb4'); poly([pt(x, y, WH - 4), pt(x, y + 4, WH - 4), pt(x, y + 4, WH), pt(x, y, WH)], '#cfc0a8');
  const O = [], add = (ox, oy, f) => O.push({ x: x + ox, y: y + oy, f });
  if (a === 'sc_terrasse') {
    /* Holzpergola, lange Tafel mit Leinen und Kerzen, Bar aus Naturstein, DJ-Pult aus Treibholz, Sandtanzfläche */
    add(.2, .2, () => { for (const [px, py] of [[.15, .15], [3.85, .15], [.15, 3.85]]) kiste(x + px - .06, y + py - .06, .12, .12, 64, '#8a6a4a'); for (let i = 0; i < 9; i++) kiste(x + .1, y + .1 + i * .45, 3.8, .08, 2, '#a07a52', 62) });
    add(1.4, 1.8, () => { kiste(x + .5, y + 1.6, 2, .5, 12, '#a07a52'); top4(x + .45, y + 1.55, 2.1, .6, 12.2, '#f4efe6'); for (let i = 0; i < 6; i++) { const [c, d] = pt(x + .7 + i * .33, y + 1.85, 13); g.fillStyle = '#fff3d6'; g.fillRect(c - 1.5, d - 7, 3, 7); g.fillStyle = `rgba(255,190,90,${.6 + Math.sin(T * 7 + i) * .3})`; g.beginPath(); g.arc(c, d - 9, 2.5, 0, 7); g.fill() }
      for (const yy of [1.35, 2.15]) { kiste(x + .5, y + yy, 2, .18, 7, '#8a6a4a'); top4(x + .5, y + yy, 2, .18, 7.2, '#e8dcc6') } });
    add(.3, .5, () => { kiste(x + .1, y + .1, 1.4, .45, 16, '#d8ccb6'); top4(x + .08, y + .08, 1.45, .5, 16.2, '#a07a52'); for (let i = 0; i < 5; i++) kiste(x + .18 + i * .25, y + .14, .08, .08, 5, ['#e6c76a', '#ec8f5e', '#ffffff', '#8a9a5b', '#c8687a'][i], 16.2) });
    add(3.3, .4, () => { kiste(x + 3, y + .15, .8, .45, 14, '#7a5a3c'); kiste(x + 3.05, y + .2, .7, .3, 2, '#2a2b2f', 14); for (let i = 0; i < 4; i++) kiste(x + 3.1 + i * .17, y + .25, .1, .1, 1, `hsl(${(T * 60 + i * 40) % 360},70%,60%)`, 16) });
    add(3, 1.2, () => { top4(x + 2.5, y + .5, 1.4, 1.6, .2, '#e6d3ae') }); for (const [ox, oy] of [[.35, 3.6], [3.7, 2.6], [3.7, 3.7]]) add(ox, oy, () => scOlive(x + ox, y + oy));
    for (const [ox, oy] of [[.9, 1.8], [1.8, 1.8], [3.1, .9]]) add(ox, oy - .01, () => scLampe(x + ox, y + oy, 40, .32));
    add(.4, 2.9, () => { for (let i = 0; i < 2; i++) { kiste(x + .25 + i * .9, y + 2.7, .75, .9, 4, '#f4efe6'); for (let k = 0; k < 3; k++) kiste(x + .3 + i * .9 + k * .22, y + 2.75, .18, .12, 4, ['#b5643c', '#8a9a5b', '#e6c76a'][k], 4) } }) }
  else if (a === 'sc_ritual') {
    /* Amphitheater aus Naturstein, Feuer in der Mitte, Weihrauch, Trommler, Laternen auf den Stufen */
    add(2, 2.4, () => { for (let r = 3; r >= 0; r--) for (let i = 0; i < 9; i++) { const w = Math.PI * (.08 + i * .105), rad = 1 + r * .55; kiste(x + 2 + Math.cos(w) * rad - .2, y + 2.6 - Math.sin(w) * rad * .9 - .14, .42, .28, 3 + r * 3, r % 2 ? '#d8ccb6' : '#cfc2aa') } });
    add(2, 2.6, () => scFeuer(x + 2, y + 2.6, T)); for (const [ox, oy] of [[.4, 3.5], [3.6, 3.5]]) add(ox, oy, () => { kiste(x + ox - .15, y + oy - .15, .3, .3, 6, '#7a5a3c'); kiste(x + ox - .12, y + oy - .12, .24, .24, 4, '#b5643c', 6) });
    for (let i = 0; i < 6; i++) { const w = Math.PI * (.1 + i * .16); add(2 + Math.cos(w) * 2.2, 2.6 - Math.sin(w) * 1.95, () => { const [c, d] = pt(x + 2 + Math.cos(w) * 2.2, y + 2.6 - Math.sin(w) * 1.95, 14); g.fillStyle = `rgba(255,190,90,${.7 + Math.sin(T * 5 + i) * .25})`; g.beginPath(); g.arc(c, d, 3.5, 0, 7); g.fill() }) } }
  else {
    /* Beduinenzelt: Stoffbahnen, Teppiche, Kleiderstangen, Körbe, Hängematte, Teetisch mit Kissen */
    add(.1, .1, () => { for (let i = 0; i < 5; i++) poly([pt(x + i * .8, y, 64), pt(x + i * .8 + .8, y, 64), pt(x + i * .8 + .4, y + 2, 72)], i % 2 ? 'rgba(232,220,198,.85)' : 'rgba(214,196,168,.85)') });
    for (const [ox, oy, f] of [[.4, .6, ['#b5643c', '#e6c76a']], [2.2, 2.4, ['#8a9a5b', '#efe6d6']], [.6, 2.6, ['#c8687a', '#f4efe6']]]) add(ox, oy, () => { top4(x + ox - .1, y + oy - .1, 1.3, .9, .3, f[0]); top4(x + ox, y + oy, 1.1, .7, .4, f[1]); top4(x + ox + .2, y + oy + .15, .7, .4, .5, f[0]) });
    add(2.6, .5, () => { kiste(x + 2.2, y + .3, 1.5, .06, 24, '#8a6a4a'); for (let i = 0; i < 6; i++) kiste(x + 2.28 + i * .24, y + .33, .18, .05, 14, ['#f4efe6', '#e6c76a', '#c9a27a', '#ffffff', '#b5643c', '#efe6d6'][i], 8) });
    add(3.5, 1.6, () => { for (let i = 0; i < 4; i++) kiste(x + 3.3 + (i % 2) * .3, y + 1.4 + Math.floor(i / 2) * .3, .24, .24, 6 + i * 2, '#c99a5b') });
    add(3.2, 3.4, () => { const [a1, b1] = pt(x + 2.8, y + 3.1, 20), [a2, b2] = pt(x + 3.8, y + 3.7, 20); g.strokeStyle = '#efe6d6'; g.lineWidth = 6; g.beginPath(); g.moveTo(a1, b1); g.quadraticCurveTo((a1 + a2) / 2, (b1 + b2) / 2 + 18, a2, b2); g.stroke() });
    add(1.6, 1.7, () => { kiste(x + 1.4, y + 1.5, .5, .5, 4, '#7a5a3c'); kiste(x + 1.55, y + 1.65, .1, .1, 2, '#e6c76a', 4); scLampe(x + 1.65, y + 1.75, 34, .28) }) }
  const tanz = p => () => { const d = (p.tanzt || (p.tanzBis || 0) > Date.now()) ? Math.abs(Math.sin(T * 5.2 + (p.ph || 0))) * .1 : 0; p.y -= d; p.x -= d; person(p); p.y += d; p.x += d };
  const LIVE = typeof window.liveImRaum === 'function' ? window.liveImRaum(b) : [];
  for (const p of [...(b.innen || []), ...LIVE]) O.push({ x: p.x, y: p.y, f: tanz(p) }); O.push({ x: ICH.x, y: ICH.y, f: tanz(ICH) });
  O.sort((p, q) => (p.x + p.y) - (q.x + q.y)).forEach(o => o.f());
  for (const p of b.innen || []) if (p.sc != null) { const [c, d] = pt(p.x, p.y, 44); g.font = `700 ${Math.max(9, Z * 4)}px system-ui`; g.textAlign = 'center'; g.fillStyle = 'rgba(22,23,26,.75)'; const w = g.measureText(p.name).width + 10; g.fillRect(c - w / 2, d - 12, w, 16); g.fillStyle = '#ffe9c4'; g.fillText(p.name, c, d) }
  const f = { x, y, w: 4, d: 4 }; fL(f, 0, 4, 0, 5, 'rgba(239,230,214,.6)'); fR(f, 0, 4, 0, 5, 'rgba(226,214,195,.6)'); fL(f, 0, 4, 5, 6, '#a07a52'); fR(f, 0, 4, 5, 6, '#8a6a4a');
  return true }

/* ---------- Bedienung im Kartenfenster ---------- */
function scKnopf(cb, text, klick, aus) { const bt = document.createElement('button'); bt.className = 'big test'; bt.style.marginTop = '5px'; bt.textContent = text; bt.disabled = !!aus; bt.onclick = klick; cb.append(bt); return bt }
function scorpiusBereich(cb, b) { if (!scIst(b)) return; const a = etagen(b)[b.stock || 0].a; const h = document.createElement('h4');
  if (a === 'sc_terrasse') { h.textContent = 'Die Karte'; cb.append(h);
    for (const [gruppe, liste] of SC.karte) { const u = document.createElement('p'); u.className = 'hin'; u.textContent = gruppe; cb.append(u);
      for (const [n, preis, info, w] of liste) scKnopf(cb, `${n} · ${euro(preis)}`, () => { if (scWirkung(w, preis, `${n.slice(2).trim()} · ${info}`)) zeigeEtage(b) }) } }
  else if (a === 'sc_ritual') { h.textContent = 'Sunset Ritual'; cb.append(h);
    for (const [n, , info, w, pause] of SC.ritual) { const rest = Math.ceil((scDran(n) - Date.now()) / 1000);
      scKnopf(cb, rest > 0 ? `${n.split(' ')[0]} wieder in ${dauer(rest)}` : n, () => { ST.scorpius[n] = Date.now() + pause * 1000; if (scWirkung(w, 0, `${n.slice(2).trim()} · ${info}`)) zeigeEtage(b) }, rest > 0) } }
  else { h.textContent = 'Bazaar & Spa'; cb.append(h);
    for (const [n, preis, info, w] of SC.bazaar) scKnopf(cb, `${n} · ${euro(preis)}`, () => { if (scWirkung(w, preis, `${n.slice(2).trim()} · ${info}`)) zeigeEtage(b) }) }
  const hin = document.createElement('p'); hin.className = 'hin'; hin.textContent = 'Tippe Gäste mit Namen an, um sie anzusprechen.'; cb.append(hin) }
function scorpiusGespraech(p) { const d = SC.leute[p.sc % SC.leute.length], b = INNEN; const cb = panel(`${d.n} · ${d.t}`); const s = document.createElement('p'); s.className = 'hin'; s.textContent = d.s; cb.append(s);
  for (const [frage, antwort, w] of d.a) scKnopf(cb, frage, () => { const c2 = panel(`${d.n} · ${d.t}`); const q = document.createElement('p'); q.className = 'hin'; q.textContent = 'Du: ' + frage; const a2 = document.createElement('p'); a2.textContent = `${d.n}: ${antwort}`; c2.append(q, a2);
    scWirkung(w, 0, ''); scKnopf(c2, 'Zurück zur Party', () => zeigeEtage(b)) });
  scKnopf(cb, 'Weitergehen', () => zeigeEtage(b)) }
window.scorpiusAntippen = (wx2, wy2) => { const b = INNEN; if (!scIst(b) || !b.innen) return false; let best = null, bd = .55;
  for (const q of b.innen) { if (q.sc == null) continue; const dd = Math.hypot(q.x - wx2, q.y - wy2); if (dd < bd) { bd = dd; best = q } }
  if (!best) return false; document.getElementById('card').hidden = false; scorpiusGespraech(best); return true };
