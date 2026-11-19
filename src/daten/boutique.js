// Berlin City · boutique.js (Daten) · Ware für die eigene Boutique, Regale, Kasse, Level und das Kollektion
// Reine Daten. Zeiten in echten Sekunden: Ware verkauft sich auch, wenn das Spiel zu ist.
window.GLOW_BOUTIQUE = (() => {
  // Ware fürs Regal: zeit = Sekunden bis verkauft, ek = Einkauf, vk = Erlös, xp = Erfahrung, lvl = ab Level, fund = Chance auf eine Albumtasche
  const WARE = [
    { id: 'gloss',   icon: '💄', name: 'Glow Lipgloss',         zeit: 60,     ek: 20,   vk: 70,    xp: 8,   lvl: 1,  fund: .04 },
    { id: 'lack',    icon: '💅', name: 'Nagellack Rosé',         zeit: 300,    ek: 40,   vk: 170,   xp: 20,  lvl: 1,  fund: .07 },
    { id: 'brille',  icon: '🕶️', name: 'Cat-Eye Sonnenbrille',   zeit: 1200,   ek: 120,  vk: 560,   xp: 45,  lvl: 2,  fund: .12 },
    { id: 'tuch',    icon: '🧣', name: 'Seidentuch Riviera',     zeit: 3600,   ek: 300,  vk: 1450,  xp: 90,  lvl: 3,  fund: .2 },
    { id: 'parfum',  icon: '🌸', name: 'Parfum Rose Noire',      zeit: 10800,  ek: 700,  vk: 3700,  xp: 200, lvl: 5,  fund: .3 },
    { id: 'sneaker', icon: '👟', name: 'Designer-Sneaker',       zeit: 21600,  ek: 1200, vk: 7200,  xp: 360, lvl: 7,  fund: .4 },
    { id: 'clutch',  icon: '👛', name: 'Abendclutch Strass',     zeit: 28800,  ek: 2000, vk: 12800, xp: 520, lvl: 9,  fund: .55 },
    { id: 'itbag',   icon: '👜', name: 'It-Bag der Saison',      zeit: 43200,  ek: 4000, vk: 26500, xp: 800, lvl: 12, fund: .75 }
  ];
  // Regale: die ersten drei sind frei, jedes weitere kostet und braucht ein Level
  const REGALE = [
    { preis: 0, lvl: 1 }, { preis: 0, lvl: 1 }, { preis: 0, lvl: 1 },
    { preis: 2000, lvl: 2 }, { preis: 6000, lvl: 4 }, { preis: 15000, lvl: 6 },
    { preis: 40000, lvl: 8 }, { preis: 90000, lvl: 10 }, { preis: 200000, lvl: 13 }, { preis: 500000, lvl: 16 }
  ];
  // Kasse: Laufkundschaft füllt sie, bis sie voll ist. Dann verdient die Boutique nichts mehr, bis man leert.
  const KASSE = [
    { cap: 1500, preis: 0, lvl: 1, name: 'Kleine Kasse' }, { cap: 4000, preis: 5000, lvl: 3, name: 'Theke mit Kasse' },
    { cap: 10000, preis: 20000, lvl: 6, name: 'Marmortheke' }, { cap: 25000, preis: 80000, lvl: 10, name: 'Concierge-Theke' },
    { cap: 60000, preis: 250000, lvl: 15, name: 'Private Shopping Lounge' }
  ];
  const kasseProStunde = lvl => 150 + 40 * lvl;
  // Level: die ersten gehen schnell, danach wird es langsamer
  const xpFuer = lvl => Math.round(30 * Math.pow(lvl, 1.5));
  const LEVEL_MAX = 100;
  const levelLohn = lvl => lvl * 1000;
  // XP für alles andere in der Stadt
  const XP_EREIGNIS = { kauf: 5, betreten: 2, arbeit: 25, foto: 12, chat: 3, vote: 5, fahren: 1 };

  // Kollektion: 8 Sets zu je 5 Taschen. selten = 1 (gewöhnlich), 2 (selten), 3 (Ikone)
  // Form f wie an den Figuren: tonne, halb, stepp, klappe, knoten, kette, birkin
  const SETS = [
    { id: 'lv', name: 'Luis Vuitong Monogramm', bonus: .08, stil: 60, taschen: [
      { id: 'lv_speedi', name: 'Speedi 25', selten: 1, c: '#7a5236', d: '#c9a46b', w: 5.2, h: 3.6, f: 'tonne' },
      { id: 'lv_never', name: 'Neverfoll', selten: 1, c: '#6e4a30', d: '#d8b47a', w: 5.8, h: 4.4, f: 'halb' },
      { id: 'lv_alma', name: 'Almah BB', selten: 1, c: '#8a5a38', d: '#e6c76a', w: 4.6, h: 3.6, f: 'tonne' },
      { id: 'lv_keep', name: 'Keepal Reise', selten: 2, c: '#5a3a24', d: '#c9a46b', w: 6.4, h: 3.8, f: 'tonne' },
      { id: 'lv_pink', name: 'Speedi Rosé Monogramm', selten: 3, c: '#ff8fc7', d: '#ffffff', w: 5.2, h: 3.6, f: 'tonne' } ] },
    { id: 'sh', name: 'Shanell Paris', bonus: .1, stil: 90, taschen: [
      { id: 'sh_boy', name: 'Boy Bag', selten: 1, c: '#15151a', d: '#c0c4cc', w: 4.6, h: 3.2, f: 'kette' },
      { id: 'sh_woc', name: 'Wallet on Chain', selten: 1, c: '#e9e2d6', d: '#e6c76a', w: 3.8, h: 2.6, f: 'kette' },
      { id: 'sh_gab', name: 'Gabriella Hobo', selten: 1, c: '#2a2a30', d: '#e6c76a', w: 4.4, h: 4, f: 'stepp' },
      { id: 'sh_255', name: '2.55 Reissue', selten: 2, c: '#3a3a40', d: '#e6c76a', w: 4.4, h: 3.2, f: 'kette' },
      { id: 'sh_pink', name: 'Classic Flap Barbie Pink', selten: 3, c: '#ff4fa3', d: '#e6c76a', w: 4.4, h: 3.2, f: 'kette' } ] },
    { id: 'di', name: 'Dioro Couture', bonus: .1, stil: 80, taschen: [
      { id: 'di_saddle', name: 'Saddel Bag', selten: 1, c: '#2e4a7a', d: '#e6c76a', w: 4.8, h: 3, f: 'klappe' },
      { id: 'di_book', name: 'Book Tote', selten: 1, c: '#e8dcc8', d: '#2e4a7a', w: 5.4, h: 4.6, f: 'halb' },
      { id: 'di_bobby', name: 'Bobbi', selten: 1, c: '#9a7a5a', d: '#e6c76a', w: 4.4, h: 3.2, f: 'klappe' },
      { id: 'di_lady', name: 'Lady Mini Lack', selten: 2, c: '#0f0f12', d: '#e6c76a', w: 3.6, h: 3.2, f: 'stepp' },
      { id: 'di_rose', name: 'Lady Rosé des Vents', selten: 3, c: '#f7b7cf', d: '#ffffff', w: 4, h: 3.6, f: 'stepp' } ] },
    { id: 'gu', name: 'Gucchi Roma', bonus: .08, stil: 60, taschen: [
      { id: 'gu_jackie', name: 'Jackie 1961', selten: 1, c: '#e8d8c0', d: '#7a5236', w: 4.2, h: 3.4, f: 'halb' },
      { id: 'gu_marm', name: 'Marmonte Matelassé', selten: 1, c: '#7a1f2b', d: '#e6c76a', w: 4.4, h: 3, f: 'stepp' },
      { id: 'gu_dion', name: 'Dionisos', selten: 1, c: '#d9cbb2', d: '#c0c4cc', w: 4.4, h: 3, f: 'klappe' },
      { id: 'gu_horse', name: 'Horsbit 1955', selten: 2, c: '#3a2a1e', d: '#e6c76a', w: 4.6, h: 3.2, f: 'klappe' },
      { id: 'gu_bamboo', name: 'Bamboo Kirschrot', selten: 3, c: '#c8102e', d: '#d8b47a', w: 4.2, h: 3.6, f: 'halb' } ] },
    { id: 'pr', name: 'Prado Milano', bonus: .06, stil: 50, taschen: [
      { id: 'pr_reed', name: 'Re-Edition Nylon', selten: 1, c: '#1a1a1c', d: '#c0c4cc', w: 4.6, h: 2.6, f: 'halb' },
      { id: 'pr_gall', name: 'Galleria Saffiano', selten: 1, c: '#5a3a2a', d: '#e6c76a', w: 5, h: 4, f: 'halb' },
      { id: 'pr_cleo', name: 'Cleo Glanz', selten: 1, c: '#f2efe8', d: '#c0c4cc', w: 4.6, h: 2.8, f: 'klappe' },
      { id: 'pr_tri', name: 'Triangel Bag', selten: 2, c: '#2f6b4f', d: '#c0c4cc', w: 4.2, h: 3, f: 'halb' },
      { id: 'pr_pink', name: 'Re-Edition Bubblegum', selten: 3, c: '#ff7eb6', d: '#ffffff', w: 4.6, h: 2.6, f: 'halb' } ] },
    { id: 'bv', name: 'Bottega Venetto', bonus: .06, stil: 50, taschen: [
      { id: 'bv_jodie', name: 'Jodie Intreccio', selten: 1, c: '#2e8b57', d: '#2e8b57', w: 4.4, h: 3.6, f: 'knoten' },
      { id: 'bv_pouch', name: 'The Pouche', selten: 1, c: '#d8c39a', d: '#d8c39a', w: 5.4, h: 3, f: 'knoten' },
      { id: 'bv_cass', name: 'Cassett', selten: 1, c: '#1f1f22', d: '#c0c4cc', w: 4.2, h: 2.8, f: 'klappe' },
      { id: 'bv_arco', name: 'Arco Tote', selten: 2, c: '#7a4a2a', d: '#7a4a2a', w: 5.2, h: 4.4, f: 'halb' },
      { id: 'bv_green', name: 'Jodie Parakeet Grün', selten: 3, c: '#39d353', d: '#39d353', w: 4.4, h: 3.6, f: 'knoten' } ] },
    { id: 'fe', name: 'Fendy Roma', bonus: .06, stil: 50, taschen: [
      { id: 'fe_bag', name: 'Baguetta', selten: 1, c: '#e48fb0', d: '#d8c39a', w: 4.6, h: 2.4, f: 'klappe' },
      { id: 'fe_peek', name: 'Peekabu', selten: 1, c: '#c9b28f', d: '#c0c4cc', w: 5, h: 3.8, f: 'halb' },
      { id: 'fe_first', name: 'Fendy First', selten: 1, c: '#f4efe6', d: '#e6c76a', w: 4.6, h: 3, f: 'klappe' },
      { id: 'fe_sun', name: 'Sunshine Shopper', selten: 2, c: '#e6c76a', d: '#1a1a1c', w: 5.4, h: 4.4, f: 'halb' },
      { id: 'fe_pail', name: 'Baguetta Paillette', selten: 3, c: '#b79cff', d: '#ffffff', w: 4.6, h: 2.4, f: 'klappe' } ] },
    { id: 'he', name: 'Hermez Faubourg', bonus: .15, stil: 150, taschen: [
      { id: 'he_evelyn', name: 'Evelynn', selten: 1, c: '#a0522d', d: '#e6c76a', w: 4.4, h: 4, f: 'halb' },
      { id: 'he_pico', name: 'Picotinn', selten: 1, c: '#e8dcc8', d: '#e6c76a', w: 3.8, h: 3.6, f: 'halb' },
      { id: 'he_const', name: 'Constanze', selten: 2, c: '#1a1a1c', d: '#e6c76a', w: 4.2, h: 3, f: 'klappe' },
      { id: 'he_kelly', name: 'Kellie 28', selten: 2, c: '#e07a1f', d: '#e6c76a', w: 5.4, h: 4.2, f: 'birkin' },
      { id: 'he_birkin', name: 'Birkinn Rose Sakura', selten: 3, c: '#f6c1d6', d: '#e6c76a', w: 6.2, h: 5, f: 'birkin' } ] }
  ];
  const SELTEN = { 1: { name: 'Gewöhnlich', gewicht: 76, farbe: '#a9a6a0' }, 2: { name: 'Selten', gewicht: 20, farbe: '#ff8fc7' }, 3: { name: 'Ikone', gewicht: 4, farbe: '#e6c76a' } };
  const doppeltWert = selten => [0, 400, 2500, 12000][selten];
  // Preise bei Maison du Sac: gewöhnlich, selten, Ikone. Je Set leicht gestaffelt, Hermez am teuersten.
  const MARKE = { lv: 'Luis Vuitong', sh: 'Shanell', di: 'Dioro', gu: 'Gucchi', pr: 'Prado', bv: 'Bottega Venetto', fe: 'Fendy', he: 'Hermez' };
  const AUFSCHLAG = { lv: 1, sh: 1.5, di: 1.3, gu: 1, pr: .9, bv: 1.1, fe: 1, he: 2.4 };
  const preisVonTasche = (set, t, i) => Math.round((({ 1: 2200, 2: 9500, 3: 48000 })[t.selten] * AUFSCHLAG[set] * (1 + i * .12)) / 100) * 100;
  return { WARE, REGALE, KASSE, kasseProStunde, xpFuer, LEVEL_MAX, levelLohn, XP_EREIGNIS, SETS, SELTEN, doppeltWert, MARKE, preisVonTasche };
})();
