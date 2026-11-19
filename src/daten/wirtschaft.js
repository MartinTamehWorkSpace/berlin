// Berlin City Wirtschaft: eine Quelle für Spiel, Autohaus und Wirtschaftsseite.
// Neue Dinge kommen nur hier hinzu. "rang" sortiert innerhalb einer Kategorie und lässt Lücken (100, 200, ...),
// damit später Modelle dazwischen passen, ohne dass sich etwas verschiebt.
window.GLOW_WIRTSCHAFT = (() => {
  // Karriere: zählt alle Tage, an denen man sich bei der Arbeit eingecheckt hat (nicht nur am Stück)
  const KARRIERE = [
    { ab: 0,   lohn: 500,  titel: 'Praktikum' },
    { ab: 1,   lohn: 630,  titel: 'Junior' },
    { ab: 2,  lohn: 800,  titel: 'Associate' },
    { ab: 3,  lohn: 1000,  titel: 'Professional' },
    { ab: 4,  lohn: 1250,  titel: 'Senior' },
    { ab: 6,  lohn: 1600,  titel: 'Lead' },
    { ab: 9,  lohn: 2000,  titel: 'Managerin' },
    { ab: 12,  lohn: 2450,  titel: 'Head of' },
    { ab: 17,  lohn: 3000,  titel: 'Direktorin' },
    { ab: 22, lohn: 3700,  titel: 'Vice President' },
    { ab: 30, lohn: 4400, titel: 'Partnerin' },
    { ab: 38, lohn: 5250, titel: 'Geschäftsführerin' },
    { ab: 45, lohn: 6300, titel: 'CEO' },
    { ab: 53, lohn: 7500, titel: 'Investorin' },
    { ab: 60, lohn: 8800, titel: 'Tycoon' }
  ];
  // Serie: jeder Tag am Stück gibt 2 % mehr, höchstens 30 %. Ein ausgelassener Tag setzt die Serie auf 0.
  const SERIE = { proTag: .02, max: .30 };
  // Einstieg: sofort Geld zum Ausgeben, dann schnelle erste Ziele, danach wird es zäher
  const START_GELD = 10000;
  const BOOST = [ { bis: 14, faktor: 2 }, { bis: 60, faktor: 1.5 } ];  // Neustart-Bonus nach Arbeitstagen
  const boost = tage => (BOOST.find(b => tage < b.bis) || { faktor: 1 }).faktor;
  const lohnStufe = tage => KARRIERE.reduce((s, k) => tage >= k.ab ? k : s, KARRIERE[0]);
  const naechsteStufe = tage => KARRIERE.find(k => k.ab > tage) || null;
  const tageslohn = (tage, serie) => Math.round(lohnStufe(tage).lohn * (1 + Math.min(SERIE.max, serie * SERIE.proTag)) * boost(tage));

  // Katalog. preis in €, stil = Stilpunkte einmalig, stilTag = Stilpunkte jeden Tag (nur Autos, Wohnungen)
  // ab = Karrieretage, ab denen man kaufen darf (zusätzlich zum Geld)
  // Freischalten (17.11.2026): viel in den ersten Tagen, danach immer langsamer. Das Teuerste kommt nach etwa 2 Monaten statt nach 2 Jahren.
  const KATALOG = [
    // Autos: große Lücken zwischen 300 und 500, damit 5 bis 10 weitere Modelle Platz haben
    // Einstiegsfahrzeuge: in den ersten Tagen erreichbar
    { id: 'rad',      kat: 'auto', rang: 10,  name: 'Hollandrad Amsterdam', preis: 1200,     stilTag: 0.5 },
    { id: 'roller',   kat: 'auto', rang: 30,  name: 'Nio E-Roller',         preis: 3200,     stilTag: 1 },
    { id: 'vespa',    kat: 'auto', rang: 50,  name: 'Vesta Primavera Rosa', preis: 9800,    stilTag: 1.5, ab: 1 },
    { id: 'twinga',   kat: 'auto', rang: 100, name: 'Renaux Twinga',     preis: 38000,   stilTag: 2,   ab: 2 },
    { id: 's5',       kat: 'auto', rang: 200, name: 'Audri S5',          preis: 240000,   stilTag: 9,   ab: 12 },
    { id: 'g63',      kat: 'auto', rang: 300, name: 'Mercedia G 63',     preis: 650000,  stilTag: 22,  ab: 30 },
    { id: 'furioso',  kat: 'auto', rang: 400, name: 'Lamborgia Furioso', preis: 1600000,  stilTag: 45,  ab: 45 },
    { id: 'roadster', kat: 'auto', rang: 900, name: 'Teslo Roadster',    preis: 4800000, stilTag: 120, ab: 60 },
    // Mode: zwei bis drei Teile kosten am Anfang einen Tageslohn. Farben wechseln ist kostenlos.
    { id: 'zahra-shirt',  kat: 'mode', rang: 100, laden: 'zahra', name: 'Shirt',      preis: 59,   stil: 2,  farben: ['#f2eee8','#16171a','#c9b48a','#8c2f39','#1d3557'] },
    { id: 'zahra-jeans',  kat: 'mode', rang: 110, laden: 'zahra', name: 'Jeans',      preis: 89,   stil: 3,  farben: ['#2f3e56','#16171a','#d9d2c3'] },
    { id: 'zahra-kleid',  kat: 'mode', rang: 120, laden: 'zahra', name: 'Kleid',      preis: 129,   stil: 4,  farben: ['#16171a','#f2eee8','#8c2f39','#4b5d4f','#c9b48a'] },
    { id: 'zahra-blazer', kat: 'mode', rang: 130, laden: 'zahra', name: 'Blazer',     preis: 169,   stil: 5,  farben: ['#16171a','#e8d5c4','#7a6a58','#3d405b'] },
    { id: 'zahra-mantel', kat: 'mode', rang: 140, laden: 'zahra', name: 'Mantel',     preis: 249,   stil: 7,  farben: ['#c9b48a','#16171a','#b8c4cc'] },
    { id: 'prado-loafer', kat: 'mode', rang: 500, laden: 'prado', name: 'Loafer',     preis: 1200,  stil: 22, ab: 6 },
    { id: 'prado-mantel', kat: 'mode', rang: 520, laden: 'prado', name: 'Mantel',     preis: 4900, stil: 48, ab: 12, look: { outfit: 'mantel', c1: '#16171a', c2: '#16171a' } },
    // Taschen: von 10 Tageslöhnen bis Warteliste
    { id: 'speedi',   kat: 'tasche', rang: 100, name: 'Luis Vuitong Speedi',   preis: 2400,  stil: 18 },
    { id: 'reed',     kat: 'tasche', rang: 150, name: 'Prado Re-Edition',      preis: 2200,  stil: 24 },
    { id: 'loulou',   kat: 'tasche', rang: 200, name: 'Saint Lorent Loulou',   preis: 3400,  stil: 26, ab: 4 },
    { id: 'jackie',   kat: 'tasche', rang: 250, name: 'Gucchi Jackie',         preis: 3700,  stil: 20, ab: 4 },
    { id: 'triomphe', kat: 'tasche', rang: 300, name: 'Celina Triomphe',       preis: 4200,  stil: 28, ab: 6 },
    { id: 'baguetta', kat: 'tasche', rang: 350, name: 'Fendy Baguetta',        preis: 4600,  stil: 22, ab: 6 },
    { id: 'jodie',    kat: 'tasche', rang: 400, name: 'Bottega Venetto Jodie', preis: 5200,  stil: 30, ab: 9 },
    { id: 'lady',     kat: 'tasche', rang: 500, name: 'Dioro Lady',            preis: 8900,  stil: 38, ab: 4, warte: 1 },
    { id: 'flap',     kat: 'tasche', rang: 600, name: 'Shanell Classic Flap',  preis: 14500, stil: 55, ab: 6, warte: 3, minStil: 300 },
    { id: 'birkinn',  kat: 'tasche', rang: 900, name: 'Hermez Birkinn',        preis: 38000, stil: 90, ab: 12, warte: 7, minStil: 1500 },
    // Verbrauch: immer wieder kaufbar, gibt Energie oder Laune statt Besitz
    { id: 'latte',     kat: 'konsum', rang: 10, laden: 'star',  name: 'Oat Latte',          preis: 5.9,  energie: 15 },
    { id: 'croissant', kat: 'konsum', rang: 20, laden: 'star',  name: 'Mandel-Croissant',   preis: 4.5,  energie: 8 },
    { id: 'matcha',    kat: 'konsum', rang: 30, laden: 'star',  name: 'Iced Matcha',        preis: 6.9,  energie: 12, stil: 1 },
    { id: 'schnitzel', kat: 'konsum', rang: 10, laden: 'borch', name: 'Wiener Schnitzel',   preis: 38,   energie: 30, follower: 20 },
    { id: 'champ',     kat: 'konsum', rang: 20, laden: 'borch', name: 'Glas Champagner',    preis: 24,   energie: 5, follower: 30, stil: 2 },
    { id: 'pizza',     kat: 'konsum', rang: 10, laden: 'hug',   name: 'Pizza Bianca',       preis: 24,   energie: 25 },
    { id: 'aperitivo', kat: 'konsum', rang: 20, laden: 'hug',   name: 'Aperitivo',          preis: 14,   energie: 5, follower: 15 },
    { id: 'spritz',    kat: 'konsum', rang: 10, laden: 'riva',  name: 'Spritz am Wasser',   preis: 16,   energie: 5, follower: 25 },
    { id: 'sushi',     kat: 'konsum', rang: 20, laden: 'riva',  name: 'Sushi-Platte',       preis: 42,   energie: 25, follower: 10 },
    { id: 'drinks',    kat: 'konsum', rang: 10, laden: 'boot',  name: 'Runde Drinks',       preis: 60,   energie: -20, follower: 80 },
    { id: 'einkauf',   kat: 'konsum', rang: 10, laden: 'lid',   name: 'Wocheneinkauf',      preis: 54,   energie: 40 },
    { id: 'pflege',    kat: 'konsum', rang: 10, laden: 'ross',  name: 'Pflegeset',          preis: 18,   stil: 2 },
    { id: 'vitamine',  kat: 'konsum', rang: 20, laden: 'dn',    name: 'Vitamine',           preis: 11,   energie: 10 },
    { id: 'protein',   kat: 'konsum', rang: 10, laden: 'mehr',  name: 'Proteinpulver',      preis: 39.9, energie: 15, stil: 1 },
    { id: 'parfum',    kat: 'konsum', rang: 10, laden: 'doug',  name: 'Parfum',             preis: 135,  stil: 9 },
    { id: 'training',  kat: 'konsum', rang: 10, laden: 'mcf',   name: 'Training',           preis: 0,    energie: -12, stil: 3 },
    { id: 'pt',        kat: 'konsum', rang: 20, laden: 'mcf',   name: 'Personal Trainer',   preis: 80,   energie: -8, stil: 6 },
    { id: 'rooftop',   kat: 'konsum', rang: 10, laden: 'hotel', name: 'Rooftop-Drink',      preis: 22,   follower: 50 },
    // Schmuck: trägt die Figur sichtbar
    { id: 'tif-creolen', kat: 'schmuck', rang: 100, laden: 'tif', name: 'Goldcreolen',  preis: 1400, stil: 14, acc: 'creolen', bild: 'ohr' },
    { id: 'tif-uhr',     kat: 'schmuck', rang: 200, laden: 'tif', name: 'Golduhr',      preis: 3900, stil: 30, acc: 'uhr', bild: 'uhr' },
    { id: 'tif-kette',   kat: 'schmuck', rang: 300, laden: 'tif', name: 'Goldkette',    preis: 4800, stil: 40, acc: 'goldkette', bild: 'kette' },
    { id: 'tif-perlen',  kat: 'schmuck', rang: 500, laden: 'tif', name: 'Perlenkette',  preis: 7900, stil: 55, acc: 'perlen', bild: 'perlen' },
    { id: 'prado-brille',kat: 'schmuck', rang: 150, laden: 'prado', name: 'Sonnenbrille', preis: 420, stil: 10, acc: 'sonnenbrille' },
    { id: 'tif-ring',     kat: 'schmuck', rang: 120, laden: 'tif', name: 'Goldring',              preis: 2200,  stil: 18,  acc: 'ring', bild: 'ring' },
    { id: 'tif-armreif',  kat: 'schmuck', rang: 350, laden: 'tif', name: 'Armreif Gelbgold',      preis: 6500,  stil: 45,  acc: 'armreif', bild: 'armreif' },
    { id: 'tif-diamant',  kat: 'schmuck', rang: 600, laden: 'tif', name: 'Diamant-Ohrstecker',    preis: 12000, stil: 70,  acc: 'diamant', bild: 'ohrdiamant' },
    { id: 'rolecks',      kat: 'schmuck', rang: 650, laden: 'tif', name: 'Rolecks Datejust',      preis: 14500, stil: 80,  acc: 'uhr', bild: 'uhr' },
    { id: 'tif-tennis',   kat: 'schmuck', rang: 700, laden: 'tif', name: 'Tennisarmband',         preis: 24000, stil: 110, acc: 'tennis', bild: 'tennis' },
    { id: 'tif-verlobung',kat: 'schmuck', rang: 950, laden: 'tif', name: 'Diamantring 3 Karat',   preis: 85000, stil: 300, acc: 'diamantring', bild: 'solitaer' },
    // Tiffanny: volles Sortiment, alles sofort kaufbar. bild = Art der Zeichnung, acc = was die Figur trägt
    { id: 'tif-herz',     kat: 'schmuck', rang: 105, laden: 'tif', name: 'Herz-Anhänger Silber',       preis: 950,    stil: 10,  acc: 'goldkette', bild: 'herz' },
    { id: 'tif-charm',    kat: 'schmuck', rang: 110, laden: 'tif', name: 'Charm-Armband Gold',         preis: 1800,   stil: 16,  acc: 'armreif', bild: 'armreif' },
    { id: 'tif-perlohr',  kat: 'schmuck', rang: 115, laden: 'tif', name: 'Perlen-Ohrstecker',          preis: 2400,   stil: 20,  acc: 'creolen', bild: 'perlohr' },
    { id: 'tif-love',     kat: 'schmuck', rang: 140, laden: 'tif', name: 'Love-Ring Gelbgold',         preis: 4900,   stil: 34,  acc: 'ring', bild: 'ring' },
    { id: 'tif-rose',     kat: 'schmuck', rang: 220, laden: 'tif', name: 'Roségold-Ring mit Pavé',     preis: 7800,   stil: 48,  acc: 'ring', bild: 'pave' },
    { id: 'tif-nagel',    kat: 'schmuck', rang: 360, laden: 'tif', name: 'Nagel-Armreif Gold',         preis: 9800,   stil: 58,  acc: 'armreif', bild: 'nagel' },
    { id: 'tif-knoten',   kat: 'schmuck', rang: 380, laden: 'tif', name: 'Knoten-Kollier Gold',        preis: 12500,  stil: 66,  acc: 'goldkette', bild: 'kette' },
    { id: 'tif-panthere', kat: 'schmuck', rang: 660, laden: 'tif', name: 'Cartiere Panthère Uhr',      preis: 21000,  stil: 95,  acc: 'uhr', bild: 'uhr' },
    { id: 'tif-solitaer1',kat: 'schmuck', rang: 680, laden: 'tif', name: 'Solitär 1 Karat',            preis: 24000,  stil: 105, acc: 'diamantring', bild: 'solitaer' },
    { id: 'tif-kronl',    kat: 'schmuck', rang: 690, laden: 'tif', name: 'Kronleuchter-Ohrringe Diamant', preis: 33000, stil: 130, acc: 'diamant', bild: 'ohrdiamant' },
    { id: 'tif-smaragd',  kat: 'schmuck', rang: 720, laden: 'tif', name: 'Smaragd-Ring',               preis: 38000,  stil: 150, acc: 'diamantring', bild: 'smaragd' },
    { id: 'tif-rubin',    kat: 'schmuck', rang: 740, laden: 'tif', name: 'Rubin-Cocktailring',         preis: 46000,  stil: 170, acc: 'diamantring', bild: 'rubin' },
    { id: 'tif-daytona',  kat: 'schmuck', rang: 760, laden: 'tif', name: 'Rolecks Daytona Gelbgold',   preis: 48000,  stil: 180, acc: 'uhr', bild: 'uhr' },
    { id: 'tif-solitaer2',kat: 'schmuck', rang: 800, laden: 'tif', name: 'Solitär 2 Karat',            preis: 52000,  stil: 200, acc: 'diamantring', bild: 'solitaer' },
    { id: 'tif-collier',  kat: 'schmuck', rang: 820, laden: 'tif', name: 'Diamant-Collier',            preis: 68000,  stil: 240, acc: 'goldkette', bild: 'collier' },
    { id: 'tif-tennis10', kat: 'schmuck', rang: 840, laden: 'tif', name: 'Tennisarmband 10 Karat',     preis: 79000,  stil: 260, acc: 'tennis', bild: 'tennis' },
    { id: 'tif-nautilus', kat: 'schmuck', rang: 880, laden: 'tif', name: 'Patec Philippa Nautilus',    preis: 120000, stil: 380, acc: 'uhr', bild: 'uhr' },
    { id: 'tif-victoria', kat: 'schmuck', rang: 899, laden: 'tif', name: 'Victoria-Collier mit Diamanten', preis: 140000, stil: 420, acc: 'goldkette', bild: 'collier' },
    { id: 'shan-ohr',     kat: 'schmuck', rang: 130, laden: 'shan', name: 'Shanell Ohrringe',     preis: 980,   stil: 12,  acc: 'creolen' },
    { id: 'shan-tweed',   kat: 'mode',    rang: 600, laden: 'shan', name: 'Tweed-Jacke',          preis: 6900,  stil: 50,  ab: 6, look: { outfit: 'blazer', muster: 'tweed', c2: '#16171a' }, farben: ['#f4efe6','#16171a','#f3a6c6'] },
    { id: 'shan-ballerina',kat:'mode',    rang: 610, laden: 'shan', name: 'Ballerinas',           preis: 890,   stil: 9 },
    { id: 'loubo',        kat: 'schmuck', rang: 160, laden: 'prado', name: 'Louboutan Heels, rote Sohle', preis: 895, stil: 14, acc: 'rote_sohle' },
    { id: 'gucchi-guertel',kat:'schmuck', rang: 170, laden: 'prado', name: 'Gucchi Gürtel',       preis: 590,   stil: 8,   acc: 'guertel' },
    { id: 'hermez-tuch',  kat: 'schmuck', rang: 180, laden: 'sac', name: 'Hermez Seidentuch',     preis: 450,   stil: 9,   acc: 'tuch' },
    { id: 'strohhut',     kat: 'schmuck', rang: 190, laden: 'sac', name: 'Strohhut Riviera',      preis: 320,   stil: 6,   acc: 'hut' },
    // Wohnen: Möbel für die eigene Wohnung, sichtbar im Penthouse
    { id: 'w-sofa',    kat: 'wohnen', rang: 100, name: 'Samtsofa Rosé',        preis: 4800,   stil: 25,  farbe: '#e8a6bf', platz: [.4, 2.6, 1.8, .7, 7] },
    { id: 'w-teppich', kat: 'wohnen', rang: 110, name: 'Seidenteppich',        preis: 2200,   stil: 12,  farbe: '#c8b6e2', platz: [.5, 1.2, 2.4, 1.6, .5] },
    { id: 'w-tisch',   kat: 'wohnen', rang: 150, name: 'Marmortisch',          preis: 6900,   stil: 30,  farbe: '#f2eee8', platz: [1.2, 1.6, .9, .9, 6] },
    { id: 'w-kunst',   kat: 'wohnen', rang: 200, name: 'Kunstwerk Pink Sunset', preis: 18000, stil: 70,  farbe: '#ff7eb6', platz: [.15, .3, 1.4, .08, 22, 14], ab: 4 },
    { id: 'w-leuchter',kat: 'wohnen', rang: 250, name: 'Kronleuchter Kristall', preis: 12000, stil: 55,  farbe: '#fff2c4', platz: [1.6, 1.6, .5, .5, 4, 40], ab: 6 },
    { id: 'w-bett',    kat: 'wohnen', rang: 300, name: 'Himmelbett Seide',     preis: 15000,  stil: 60,  farbe: '#f4efe6', platz: [2.4, .4, 1.4, 1.6, 9], ab: 6 },
    { id: 'w-bar',     kat: 'wohnen', rang: 350, name: 'Champagner-Bar',       preis: 24000,  stil: 90,  farbe: '#16171a', platz: [3.2, 2.2, .5, 1.4, 14], ab: 12 },
    { id: 'w-fluegel', kat: 'wohnen', rang: 500, name: 'Weißer Flügel',        preis: 68000,  stil: 180, farbe: '#ffffff', platz: [2.6, 2.8, 1.2, .9, 10], ab: 22 },
    { id: 'w-sessel',  kat: 'wohnen', rang: 120, name: 'Bouclé-Sessel im Paar',  preis: 3400,   stil: 18,  farbe: '#f4efe6' },
    { id: 'w-olive',   kat: 'wohnen', rang: 130, name: 'Olivenbaum XL',          preis: 1900,   stil: 10,  farbe: '#6f8f5a' },
    { id: 'w-neon',    kat: 'wohnen', rang: 160, name: 'Neonschrift Good Vibes', preis: 2600,   stil: 14,  farbe: '#ff4fa3' },
    { id: 'w-tv85',    kat: 'wohnen', rang: 180, name: 'Zweiter TV 85 Zoll',     preis: 8900,   stil: 35,  farbe: '#141416' },
    { id: 'w-kamin',   kat: 'wohnen', rang: 260, name: 'Bio-Kamin aus Travertin', preis: 14000, stil: 58,  farbe: '#d9c7ad' },
    { id: 'w-ankleide',kat: 'wohnen', rang: 400, name: 'Walk-in-Closet mit Licht', preis: 39000, stil: 140, farbe: '#e9e1d6' },
    { id: 'w-aquarium',kat: 'wohnen', rang: 600, name: 'Aquarium Wand',        preis: 95000,  stil: 240, farbe: '#2fb5d6', platz: [.15, 2.2, 1.6, .15, 20, 4], ab: 30 },
    // Jachten: liegen nach dem Kauf mit Namensschild am Steg vom Yachtclub
    // Boote in vielen Preisklassen, jedes sieht anders aus (boot = Modell, laenge in Feldern, lack und streifen = Farben). Namen nach Markenregel abgewandelt.
    { id: 'j-riva',  kat: 'jacht', rang: 80,  laden: 'nicky', name: 'Rivo Aquarama aus Mahagoni', preis: 95000,  stil: 22, boot: 'riva', laenge: 1.5 },
    { id: 'j-sport', kat: 'jacht', rang: 200, laden: 'nicky', name: 'Pershang 7X Sport',     preis: 420000,   stil: 55,  boot: 'speed', laenge: 2.4, lack: '#16171a', streifen: '#c0c4cc', ab: 4 },
    { id: 'j-ferr',  kat: 'jacht', rang: 400, laden: 'nicky', name: 'Ferrata 780 Flybridge',  preis: 1600000,  stil: 130, boot: 'jacht', laenge: 3.6, lack: '#f6f6f4', streifen: '#1d3557', ab: 9 },
    { id: 'j-kat',   kat: 'jacht', rang: 500, laden: 'nicky', name: 'Sonnenriff 80 Katamaran', preis: 3500000, stil: 190, boot: 'kat', laenge: 3.8, ab: 12 },
    { id: 'j-sunsi', kat: 'jacht', rang: 700, laden: 'nicky', name: 'Sunsicker 95 Yacht',      preis: 6500000,  stil: 280, boot: 'jacht', laenge: 4.6, lack: '#0b1f3a', streifen: '#d9b44a', ab: 22 },
    { id: 'j-expl',  kat: 'jacht', rang: 800, laden: 'nicky', name: 'Benetta Oasis 60 m',     preis: 22000000, stil: 520, boot: 'gross', laenge: 6.5, lack: '#f6f6f4', streifen: '#2f6fd6', ab: 30 },
    { id: 'j-azz',   kat: 'jacht', rang: 980, laden: 'nicky', name: 'Azzurro Explorer 140 m',  preis: 120000000, stil: 1600, boot: 'gross', laenge: 12, lack: '#0d1626', streifen: '#c0c4cc', ab: 60, warte: 14, minStil: 40000 },
    { id: 'j-giga',  kat: 'jacht', rang: 950, laden: 'nicky', name: 'Lürsen Gigayacht 110 m',  preis: 45000000, stil: 900, boot: 'gross', laenge: 9, lack: '#1a1a1d', streifen: '#e6c76a', ab: 53, warte: 10, minStil: 25000 },
    { id: 'j-speed', kat: 'jacht', rang: 100, laden: 'nicky', name: 'Speedboot Rosa',        preis: 180000,   stil: 30,  boot: 'speed' },
    { id: 'j-motor', kat: 'jacht', rang: 300, laden: 'nicky', name: 'Motorjacht Azzurra',    preis: 850000,   stil: 90,  boot: 'jacht', ab: 17 },
    // Privatjets am Flughafen Tempelhoff: Preise steigen stark, der kleinste ist nach etwa zwei Wochen aktivem Spielen drin
    { id: 'jet-light', kat: 'jet', rang: 100, laden: 'jets', name: 'Glowstream Light',      preis: 6000000,   stil: 150,  jet: 'light' },
    { id: 'jet-mid',   kat: 'jet', rang: 300, laden: 'jets', name: 'Glowstream Midsize',    preis: 18000000,  stil: 320,  jet: 'mid' },
    { id: 'jet-long',  kat: 'jet', rang: 600, laden: 'jets', name: 'Glowstream Long Range', preis: 45000000,  stil: 700,  jet: 'long' },
    { id: 'jet-ultra', kat: 'jet', rang: 900, laden: 'jets', name: 'Glowstream Ultra',      preis: 95000000,  stil: 1400, jet: 'ultra' },
    { id: 'j-super', kat: 'jacht', rang: 900, laden: 'nicky', name: 'Superjacht Glow One',   preis: 12000000, stil: 400, boot: 'gross', ab: 45, warte: 10, minStil: 10000 },
    // Designer-Etage in der Galeries Lafayetto: jedes Teil ist ein ganzer Look, den man an der Figur sieht
    { id: 'gucchi-anzug',   kat: 'mode', rang: 700, laden: 'designer', name: 'Gucchi Trainingsanzug', preis: 2400, stil: 26, look: { outfit: 'sport', muster: 'streifen', c2: '#ffffff' }, farben: ['#1d3557', '#16171a', '#f3a6c6', '#2e8b57'] },
    { id: 'versaci-bluse',  kat: 'mode', rang: 710, laden: 'designer', name: 'Versaci Barock-Bluse',  preis: 1300, stil: 18, look: { outfit: 'basic', muster: 'barock', c2: '#16171a' }, farben: ['#16171a', '#1d3557', '#f4efe6'] },
    { id: 'monclair-jacke', kat: 'mode', rang: 720, laden: 'designer', name: 'Monclair Steppjacke',   preis: 2100, stil: 22, look: { outfit: 'blazer', muster: 'stepp', c2: '#16171a' }, farben: ['#16171a', '#f4efe6', '#ff7eb6', '#c9b48a'] },
    { id: 'burbery-trench', kat: 'mode', rang: 730, laden: 'designer', name: 'Burbery Trenchcoat',    preis: 2900, stil: 28, look: { outfit: 'mantel', c2: '#16171a' }, farben: ['#c9b48a', '#16171a', '#e8d5c4'] },
    { id: 'dioro-satin',    kat: 'mode', rang: 740, laden: 'designer', name: 'Dioro Satinkleid',      preis: 3900, stil: 34, look: { outfit: 'kleid', muster: 'satin' }, farben: ['#f3c6d6', '#e6c76a', '#16171a', '#c8b6e2'] },
    { id: 'balmayn-kleid',  kat: 'mode', rang: 750, laden: 'designer', name: 'Balmayn Blazerkleid',   preis: 4500, stil: 38, look: { outfit: 'kleid', muster: 'gold' }, farben: ['#16171a', '#f4efe6', '#d81b60'], ab: 4 },
    { id: 'valentinoh-robe',kat: 'mode', rang: 790, laden: 'designer', name: 'Valentinoh Abendkleid', preis: 9800, stil: 70, look: { outfit: 'kleid', muster: 'satin' }, farben: ['#d81b60', '#ff4fa3', '#16171a'], ab: 6 },
    // Sport und Tech
    { id: 'lulu-leggings', kat: 'mode', rang: 200, laden: 'lulu', name: 'Leggings', preis: 118, stil: 4, look: { outfit: 'sport' }, farben: ['#16171a','#c8b6e2','#e8d5c4','#2f3e56'] },
    { id: 'lulu-jacke',    kat: 'mode', rang: 210, laden: 'lulu', name: 'Trainingsjacke', preis: 148, stil: 5, farben: ['#16171a','#f4efe6','#c8b6e2'] },
    { id: 'apfel-phone',   kat: 'tech', rang: 100, laden: 'apfel', name: 'Apfel Phone Pro', preis: 1299, stil: 6 },
    { id: 'apfel-book',    kat: 'tech', rang: 200, laden: 'apfel', name: 'Apfel Book', preis: 2499, stil: 8, ab: 2 },
    // Beauty-Meile, Spa, Friseur, Beach Club: immer wieder kaufbar
    { id: 'makeup',    kat: 'konsum', rang: 10, laden: 'seph',  name: 'Make-up-Set',        preis: 49,  stil: 3 },
    { id: 'serum',     kat: 'konsum', rang: 20, laden: 'seph',  name: 'Glow Serum',          preis: 120, stil: 5 },
    { id: 'dessous',   kat: 'konsum', rang: 10, laden: 'vic',   name: 'Dessous-Set',         preis: 89,  stil: 4 },
    { id: 'massage',   kat: 'konsum', rang: 10, laden: 'spa',   name: 'Massage 60 Min.',     preis: 140, energie: 40 },
    { id: 'facial',    kat: 'konsum', rang: 20, laden: 'spa',   name: 'Glow Facial',         preis: 190, energie: 10, stil: 6 },
    { id: 'blowout',   kat: 'konsum', rang: 10, laden: 'salon', name: 'Blowout',             preis: 85,  stil: 5 },
    { id: 'balayage',  kat: 'konsum', rang: 20, laden: 'salon', name: 'Balayage',            preis: 290, stil: 10 },
    // Spree Arena: Konzerte im Westen der Stadt
    { id: 'konzert',   kat: 'konsum', rang: 10, laden: 'arena', name: 'Konzertticket Glow Night', preis: 120, energie: -10, follower: 220, stil: 3 },
    { id: 'frontstage',kat: 'konsum', rang: 20, laden: 'arena', name: 'Front of Stage',          preis: 450, energie: -15, follower: 650, stil: 8 },
    { id: 'loge',      kat: 'konsum', rang: 30, laden: 'arena', name: 'VIP-Loge mit Champagner',  preis: 2500, energie: 5, follower: 1600, stil: 25 },
    { id: 'backstage', kat: 'konsum', rang: 40, laden: 'arena', name: 'Backstage mit dem Star',  preis: 9000, energie: 10, follower: 4500, stil: 60 },
    { id: 'daybed',    kat: 'konsum', rang: 10, laden: 'nicky', name: 'Daybed am Pool',      preis: 250, energie: 15, follower: 120, stil: 4 },
    { id: 'charter',   kat: 'konsum', rang: 30, laden: 'nicky', name: 'Jacht-Charter, 4 Stunden', preis: 2500, energie: 20, follower: 600, stil: 12 },
    { id: 'sunset',    kat: 'konsum', rang: 40, laden: 'nicky', name: 'Sunset-Segeltörn',    preis: 480, energie: 10, follower: 180, stil: 5 },
    { id: 'tower',     kat: 'konsum', rang: 20, laden: 'nicky', name: 'Champagner-Turm',     preis: 900, energie: -10, follower: 400, stil: 8 },
    // Beauty: schnell, aber nicht billig
    { id: 'botox',    kat: 'beauty', rang: 100, name: 'Botox Stirn',      preis: 390,  stil: 8 },
    { id: 'lippen',   kat: 'beauty', rang: 200, name: 'Hyaluron Lippen',  preis: 590,  stil: 10 },
    { id: 'nase',     kat: 'beauty', rang: 500, name: 'Nase korrigieren', preis: 9900, stil: 25, ab: 6, pause: 3 }
  ];
  const KATEGORIEN = { auto: 'Autos', mode: 'Mode', tasche: 'Taschen', beauty: 'Beauty', konsum: 'Essen, Trinken, Alltag', schmuck: 'Schmuck', tech: 'Tech', wohnen: 'Wohnen', jacht: 'Jachten' };

  // Wie viele Tage braucht eine aktive Spielerin, wenn sie jeden Tag eincheckt und den Anteil "spart" zurücklegt?
  function tageBis(preis, spart = .6) {
    let geld = START_GELD;
    for (let d = 1; d < 5000; d++) { geld += tageslohn(d - 1, Math.min(d - 1, 15)) * spart; if (geld >= preis) return d }
    return Infinity;
  }
  return { START_GELD, BOOST, boost, KARRIERE, SERIE, KATALOG, KATEGORIEN, lohnStufe, naechsteStufe, tageslohn, tageBis };
})();
