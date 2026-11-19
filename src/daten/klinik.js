// Berlin City · klinik.js (Daten) · Deine Schönheitsklinik im Alex Tower: Behandlungen, Geräte, Liegen, Wartezimmer, Kundinnen
// Reine Daten. Zeiten in echten Sekunden. Neue Behandlung oder neues Gerät = ein Eintrag hier.
window.GLOW_KLINIK = (() => {
  // geraet: was du dafür besitzen musst. dauer in Sekunden, preis = Honorar pro Behandlung (Euro pro Sekunde steigt mit jedem Gerät, Balance 17.11.), xp = Erfahrung, wunsch = wie oft Kundinnen danach fragen
  const BEHANDLUNGEN = [
    { id: 'botox',   icon: '💉', name: 'Botox Stirn und Zornesfalte',  geraet: 'spritze', dauer: 60,    preis: 17,  xp: 20,  wunsch: 10 },
    { id: 'led',     icon: '💡', name: 'LED-Lichttherapie',             geraet: 'led',     dauer: 60,   preis: 18,  xp: 14,  wunsch: 6 },
    { id: 'lippen',  icon: '💋', name: 'Hyaluron Lippen',               geraet: 'filler',  dauer: 120,   preis: 38,  xp: 35,  wunsch: 9 },
    { id: 'hydra',   icon: '💧', name: 'HydraFacial Glow',              geraet: 'hydra',   dauer: 150,   preis: 50,  xp: 30,  wunsch: 8 },
    { id: 'needling', icon: '✳️', name: 'Microneedling mit Eigenblut',  geraet: 'needling', dauer: 180,  preis: 65,  xp: 50,  wunsch: 6 },
    { id: 'laser',   icon: '✨', name: 'Laser gegen Pigmente und Rötung', geraet: 'laser',  dauer: 210,  preis: 80,  xp: 80,  wunsch: 5 },
    { id: 'rf',      icon: '⚡', name: 'Radiofrequenz-Straffung',       geraet: 'rf',      dauer: 240,  preis: 98, xp: 140, wunsch: 4 },
    { id: 'kryo',    icon: '❄️', name: 'Kryolipolyse Bauch',            geraet: 'kryo',    dauer: 300,  preis: 130, xp: 220, wunsch: 3 },
    // OP-Etage
    { id: 'lid',     icon: '👁️', name: 'Lidstraffung',                  geraet: 'opsaal',  dauer: 300,   preis: 153,  xp: 400, wunsch: 2, etage: 'op' },
    { id: 'nase',    icon: '👃', name: 'Nasenkorrektur',                geraet: 'opsaal',  dauer: 300,   preis: 166, xp: 550, wunsch: 2, etage: 'op' },
    { id: 'lift',    icon: '🪞', name: 'Mini-Facelift',                 geraet: 'opsaal',  dauer: 300,   preis: 180, xp: 800, wunsch: 1, etage: 'op' },
    // Longevity- und Biohacking-Etage
    { id: 'drip',    icon: '💧', name: 'Vitamin-Drip',                  geraet: 'infusion', dauer: 120,  preis: 44,   xp: 40,  wunsch: 6, etage: 'longevity' },
    { id: 'nad',     icon: '🧬', name: 'NAD+-Infusion',                 geraet: 'infusion', dauer: 240,  preis: 109,  xp: 90,  wunsch: 4, etage: 'longevity' },
    { id: 'hbot',    icon: '🫧', name: 'Sauerstoffkammer-Session',      geraet: 'hbot',    dauer: 180,   preis: 76,  xp: 70,  wunsch: 4, etage: 'longevity' },
    { id: 'kammer',  icon: '🧊', name: 'Kryokammer -110 Grad',          geraet: 'kryokammer', dauer: 60, preis: 23,   xp: 30,  wunsch: 5, etage: 'longevity' },
    { id: 'check',   icon: '📊', name: 'Longevity-Check mit Bluttest',  geraet: 'labor',   dauer: 240,   preis: 115,  xp: 120, wunsch: 3, etage: 'longevity' }
  ];
  // Geräte: die Spritze hast du von Anfang an. Ab = nötige Sterne-Bewertung, damit die Kundschaft passt.
  const GERAETE = [
    { id: 'spritze',  name: 'Injektionsset',            preis: 0,      ab: 0 },
    { id: 'led',      name: 'LED-Maske Professional',   preis: 200,  ab: 0 },
    { id: 'filler',   name: 'Filler-Set Hyaluron',      preis: 750,  ab: 3.2 },
    { id: 'hydra',    name: 'HydraFacial-Station',      preis: 2400,  ab: 3.4 },
    { id: 'needling', name: 'Microneedling-Pen mit Zentrifuge', preis: 2600, ab: 3.6 },
    { id: 'laser',    name: 'Pico-Laser',               preis: 4600, ab: 3.9 },
    { id: 'rf',       name: 'Radiofrequenz-Plattform',  preis: 26000, ab: 4.2 },
    { id: 'kryo',     name: 'Kryolipolyse-System',      preis: 41000, ab: 4.5 },
    { id: 'opsaal',   name: 'Operationssaal mit Anästhesie-Team', preis: 170000, ab: 4.0, etage: 'op' },
    { id: 'infusion', name: 'Infusions-Lounge mit 6 Sesseln', preis: 120000, ab: 3.8, etage: 'longevity' },
    { id: 'kryokammer', name: 'Ganzkörper-Kryokammer',       preis: 310000, ab: 3.8, etage: 'longevity' },
    { id: 'hbot',     name: 'Hyperbare Sauerstoffkammer',     preis: 310000, ab: 4.0, etage: 'longevity' },
    { id: 'labor',    name: 'Longevity-Labor',                preis: 250000, ab: 4.0, etage: 'longevity' }
  ];
  // Liegen: die erste steht schon. Wartezimmer: so viele Kundinnen warten gleichzeitig.
  const LIEGEN = [0, 300, 1100, 2700, 9200, 16000, 45000, 120000, 250000, 680000, 790000, 2200000];
  const WARTEZIMMER = [{ plaetze: 3, preis: 0, name: 'Kleiner Empfang' }, { plaetze: 5, preis: 29000, name: 'Lounge mit Sofa' }, { plaetze: 7, preis: 120000, name: 'Private Lounge' }, { plaetze: 10, preis: 790000, name: 'VIP-Etage' }];
  // Kundinnen kommen schneller, je besser die Bewertung. Wer zu lange wartet, geht und die Bewertung sinkt.
  const ANKUNFT = sterne => Math.round(150 / (.5 + sterne * .3)); // Sekunden zwischen zwei Kundinnen
  const GEDULD = 300; // Sekunden im Wartezimmer
  const GEDULD_OHNE_GERAET = 90; // wer etwas will, wofür dir das Gerät fehlt, geht schnell zur Konkurrenz
  const MIN_ABSTAND = 30; // mit vollem Werbebudget etwa alle 30 Sekunden eine Kundin
  const GRUND_ABSTAND = 90; // ohne Werbebudget etwa alle 90 Sekunden
  const BONUS_PERSOENLICH = .25, BONUS_EXPRESS = .1, EXPRESS_SEK = 20; // aktiv spielen lohnt sich
  // Etagen im Alex Tower: schalten neue Geräte und Behandlungen frei
  const ETAGEN = [{ id: 'basis', name: 'Praxis-Etage', preis: 0 }, { id: 'op', name: 'OP-Etage', preis: 170000, ab: 3.9, text: 'Operationssaal: Lidstraffung, Nasenkorrektur, Mini-Facelift' }, { id: 'longevity', name: 'Longevity- und Biohacking-Etage', preis: 120000, ab: 4.1, text: 'Infusionen, Sauerstoffkammer, Kryokammer, Longevity-Check' }];
  const NAMEN = ['Lena', 'Sophie', 'Mia', 'Hannah', 'Lara', 'Nina', 'Julia', 'Chiara', 'Selin', 'Emma', 'Vanessa', 'Leonie', 'Paula', 'Clara', 'Zoe', 'Elif', 'Marie', 'Jana', 'Aylin', 'Romy'];
  const VIP = ['Valentina Vane', 'Sasha Montclair', 'Celeste Harrington', 'Margot Kessler', 'Carlotta Bloom']; // zahlen das Doppelte
  // Dr. Glatt als Mentor: ein Satz passend zum Stand deiner Klinik
  const TIPPS = [
    [k => !k.behandelt, 'Willkommen in deiner Praxis. Deine erste Kundin wartet schon. Tipp auf „Behandeln“.'],
    [k => k.behandelt && !k.geraete.led, 'Gut gemacht. Mit der LED-Maske kannst du nebenbei Lichttherapie anbieten.'],
    [k => !k.geraete.filler && k.sterne >= 3.2, 'Deine Bewertung reicht für das Filler-Set. Lippen sind das, was alle wollen.'],
    [k => k.liegen.length < 2, 'Eine zweite Liege verdoppelt deinen Umsatz. Behandeln, während die nächste wartet.'],
    [k => k.sterne < 3, 'Lass niemanden zu lange warten. Jede Kundin, die geht, kostet Bewertung.'],
    [k => true, 'Mehr Geräte bringen anspruchsvollere Kundinnen. Die zahlen auch mehr.']
  ];
  // Team: Einstellungsgebühr einmalig, Stundenlohn läuft in echter Zeit
  const TEAM = [
    { id: 'empfang',   icon: '💁‍♀️', name: 'Empfangskraft',            einstellen: 900,   lohn: 15,  effekt: 'Kundinnen warten 50 % länger' },
    { id: 'assistenz', icon: '🧑‍⚕️', name: 'Medizinische Assistenz',   einstellen: 800,  lohn: 40, effekt: 'Holt Kundinnen auf freie Liegen, wenn du nicht selbst behandelst' },
    { id: 'aerztin',   icon: '👩‍⚕️', name: 'Angestellte Ärztin',       einstellen: 2600,  lohn: 120, effekt: 'Rechnet selbst ab. Mit Assistenz läuft die Praxis allein, auch wenn du weg bist' }
  ];
  // Social Media: Beiträge planen. Produktion in echter Zeit, danach kommen Follower. Follower bringen mehr Kundinnen.
  const POSTS = [
    { id: 'story', icon: '📲', name: 'Story: Ein Tag in der Klinik', dauer: 180,  follower: [80, 260],    ab: 0 },
    { id: 'vorher', icon: '📸', name: 'Vorher-Nachher-Post',        dauer: 900,  follower: [350, 1100],  ab: 0, braucht: 'behandelt' },
    { id: 'reel', icon: '🎬', name: 'Reel aus dem Behandlungsraum',  dauer: 2400, follower: [900, 3200],  ab: 2000 },
    { id: 'live', icon: '🔴', name: 'Live-Fragestunde zu Botox',     dauer: 3600, follower: [2500, 7000], ab: 15000 },
    { id: 'kollab', icon: '🤝', name: 'Kooperation mit einer Influencerin', dauer: 7200, follower: [8000, 22000], ab: 60000 }
  ];
  const FOLLOWER_FAKTOR = f => 1 + Math.log10(1 + f / 1000) * .22;
  // Konkurrenz in der Stadt: andere Kliniken (Bewohner). Echte Spielerinnen kommen aus der Datenbank dazu.
  const RIVALEN = [
    { name: 'Dr. Ricco & Dr. Nico', haus: 'Doppelpraxis am Boulevard', behandlungen: 1800, aerzte: 5, sterne: 4.8, follower: 940000, umsatz: 2600000 },
    { name: 'Dr. Hana Kim', haus: 'Seoul Glow Studio', behandlungen: 620, aerzte: 2, sterne: 4.6, follower: 210000, umsatz: 640000 },
    { name: 'Maison Botox', haus: 'Galeries Lafayetto', behandlungen: 410, aerzte: 2, sterne: 4.2, follower: 64000, umsatz: 380000 },
    { name: 'Dr. Lia Sommer', haus: 'Skin Lab Ost', behandlungen: 150, aerzte: 1, sterne: 4.4, follower: 18000, umsatz: 120000 },
    { name: 'Glow & Go', haus: 'KaDeVe', behandlungen: 90, aerzte: 1, sterne: 3.7, follower: 6500, umsatz: 54000 }
  ];
  // Kongresse, Messen, Vorträge: du reist in echter Zeit ab, das Team führt die Praxis. Zurück gibt es Honorar, Follower, Sterne und einen Glow-Boost.
  // kosten = Reise und Hotel, honorar = Gage für deinen Vortrag, ab = Sterne, die du dafür brauchst. Jeder Kongress einmal pro Tag.
  const KONGRESSE = [
    { id: 'rivva',  icon: '🎤', ort: 'Berlin City',  name: 'Vortrag im Papillong Med Club',          art: 'Vortrag', dauer: 600,   kosten: 0,      honorar: 900,   follower: 300,   sterne: .05, boost: 15, ab: 0 },
    { id: 'miami',  icon: '🌴', ort: 'Miami',      name: 'Aesthetic Expo Miami',               art: 'Messe',   dauer: 1800,  kosten: 2400,   honorar: 0,      follower: 1500,  sterne: .1,  boost: 30, ab: 3.4 },
    { id: 'paris',  icon: '🗼', ort: 'Paris',      name: 'Anti-Aging Kongress Paris',          art: 'Vortrag', dauer: 3600,  kosten: 9000,  honorar: 16000,  follower: 4000,  sterne: .15, boost: 45, ab: 3.8 },
    { id: 'seoul',  icon: '🇰🇷', ort: 'Seoul',      name: 'K-Beauty Expo Seoul',                art: 'Messe',   dauer: 7200,  kosten: 24000,  honorar: 0,      follower: 15000, sterne: .15, boost: 60, ab: 4.1 },
    { id: 'monaco', icon: '🛥️', ort: 'Monaco',     name: 'Aesthetic World Forum Monaco',       art: 'Vortrag', dauer: 10800, kosten: 36000,  honorar: 84000, follower: 20000, sterne: .2,  boost: 60, ab: 4.4 },
    { id: 'dubai',  icon: '🏙️', ort: 'Dubai',      name: 'Keynote beim Dubai Glow Summit',     art: 'Keynote', dauer: 14400, kosten: 72000, honorar: 230000, follower: 45000, sterne: .25, boost: 90, ab: 4.7 }
  ];
  // Sterne: steigen langsam mit jeder Behandlung und sinken, wenn du länger als 2 Tage auf keinem Kongress warst
  const STERNE = { proBehandlung: .002, proVip: .006, verfallProTag: .12, verfallNach: 2 * 864e5, boden: 2.5 };
  const BOOST_ZIEL = { faktor: .5, minuten: 5 }; // jedes erreichte Ziel: Honorare +50 % für 5 Min.
  // Preise errechnet aus dem Zeitplan (Martin, 17.11.): Gerätestufe 5 nach etwa 5 Std. aktiv (1 bis 2 Tage), danach etwa 2 Tage je Stufe.
  // Kosten = Einkommen bis dahin × 70 % Reinvest × 60 % realistische Auslastung, über 5.000 € exponentiell aufgeschlagen (× (Preis/5.000) hoch 0,65).
  // So kostet jeder große Schritt deutlich mehr, als die Praxis gerade abwirft (Martin, 17.11.: höchstens 15 bis 20 % wieder drin).
  // Ausbau der Praxis: einmal kaufen, wirkt dauerhaft
  const AUSBAU = [
    { id: 'premiumliegen', icon: '🛏️', name: 'Premium-Liegen aus Leder',        preis: 3600,   effekt: 'Honorare +8 %',               honorar: .08 },
    { id: 'lounge',        icon: '🥂', name: 'Champagner-Lounge',                 preis: 16000,  effekt: 'Kundinnen warten 60 % länger', geduld: .6 },
    { id: 'wand',          icon: '📸', name: 'Instagram-Wand mit Neon',           preis: 45000,  effekt: 'Beiträge bringen 40 % mehr Follower', social: .4 },
    { id: 'duft',          icon: '🌸', name: 'Duft- und Klimakonzept',            preis: 150000,  effekt: 'Bewertung steigt doppelt so schnell', sterne: 1 },
    { id: 'vip',           icon: '👑', name: 'VIP-Suite mit eigenem Eingang',     preis: 14000,  effekt: 'Doppelt so viele VIP-Kundinnen', vip: 1 },
    { id: 'interior',      icon: '✨', name: 'Designer-Interior aus Mailand',     preis: 45000,  effekt: 'Honorare +10 %',              honorar: .1 },
    { id: 'rooftop',       icon: '🌇', name: 'Rooftop-Terrasse für Kundinnen',    preis: 210000, effekt: 'Honorare +12 %, mehr VIPs',    honorar: .12, vip: .5 }
  ];
  return { KONGRESSE, STERNE, BOOST_ZIEL, ETAGEN, GRUND_ABSTAND, BONUS_PERSOENLICH, BONUS_EXPRESS, EXPRESS_SEK, AUSBAU, GEDULD_OHNE_GERAET, MIN_ABSTAND, BEHANDLUNGEN, GERAETE, LIEGEN, WARTEZIMMER, ANKUNFT, GEDULD, NAMEN, VIP, TIPPS, TEAM, POSTS, FOLLOWER_FAKTOR, RIVALEN };
})();
