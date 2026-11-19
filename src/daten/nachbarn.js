// Berlin · nachbarn.js (Daten) · Die Nachbarschaft: Männer und Frauen mit Beruf, eigener Wohnung und Look.
// Mit jeder Person baust du eine Beziehung auf (0 bis 100). Aktionen bringen Stil (Glow-Punkte), Follower und Nähe.
// anspruch = Stil, ab dem diese Person mit dir flirtet, ausgeht, verreist oder eine Affäre riskiert. Nicht jeder will jeden: Klamotten, Autos, Taschen heben deinen Stil.
window.GLOW_NACHBARN = {
  LEUTE: [
    { id: 'jessy',  name: 'Jessy Laurent',    w: 1, anspruch: 600, beruf: 'Model',                          look: { top: '#f4efe6', hair: '#e6d3a3', skin: '#f6dcc8' }, wohnung: { haus: 'Penthouse Mitte', art: 'Penthouse mit Pool-Terrasse', text: 'Weiße Lounge, eine ganze Wand aus Spiegeln, ein Ankleidezimmer voller Kleider und ein Pool mit Blick aufs Meer.' } },
    { id: 'marco',  name: 'Marco Valenti',    w: 0, anspruch: 1200, beruf: 'Investmentbanker',               look: { top: '#1d2b44', leg: '#1d2b44', hair: '#141414', skin: '#e4b997' }, wohnung: { haus: 'Fabrik Coworking', art: 'Loft im 12. Stock', text: 'Schwarzer Marmor, ein Weinkühlschrank, drei Bildschirme mit Börsenkursen und ein Flügel, auf dem nie jemand spielt.' } },
    { id: 'bea',    name: 'Bea Hartmann',     w: 1, anspruch: 400, beruf: 'Gründerin eines Skincare-Labels', look: { top: '#ffb3d1', hair: '#a8562a', skin: '#f1d0b5' }, wohnung: { haus: 'Spreeufer Residenz', art: 'Maisonette mit Dachgarten', text: 'Pastellfarben, frische Pfingstrosen, ein Regal voller eigener Produkte und ein Ringlicht für die Reels.' } },
    { id: 'tobi',   name: 'Tobi Ramos',       w: 0, anspruch: 150, beruf: 'DJ',                             look: { top: '#16171a', leg: '#16171a', hair: '#3a2416', skin: '#c48f6b' }, wohnung: { haus: 'Platte Friedrichshain', art: 'Studio mit Tonstudio', text: 'Plattenwand, Neonröhren, ein Mischpult mitten im Wohnzimmer und eine Couch, auf der schon halb Berlin geschlafen hat.' } },
    { id: 'alex',   name: 'Alexander Brandt', w: 0, anspruch: 4000, beruf: 'CEO einer Reederei',             look: { top: '#f4efe6', leg: '#c9b48a', hair: '#e6d3a3', skin: '#f3d5bf' }, wohnung: { haus: 'Penthouse Mitte', art: 'Penthouse über zwei Etagen', text: 'Kunst an jeder Wand, ein Schiffsmodell seiner Flotte im Eingang und eine Terrasse, von der man die Yachten zählen kann.' } },
    { id: 'nora',   name: 'Nora Kessler',     w: 1, anspruch: 800, beruf: 'Anwältin',                       look: { top: '#16171a', hair: '#141414', skin: '#e4b997' }, wohnung: { haus: 'Galeries Lafayetto', art: 'Altbauwohnung mit Stuck', text: 'Bücherwände bis zur Decke, ein schwarzer Konzertflügel und ein Kühlschrank mit nur Champagner und Oliven.' } },
    { id: 'leon',   name: 'Leon Fischer',     w: 0, anspruch: 250, beruf: 'Fitnesscoach und Model',         look: { top: '#ffffff', leg: '#3a3d46', hair: '#3a2416', skin: '#d9a37b' }, wohnung: { haus: 'Platte Friedrichshain', art: 'Apartment mit Home-Gym', text: 'Hanteln statt Deko, ein Smoothie-Mixer auf Dauerbetrieb und ein Balkon, auf dem er morgens um 6 trainiert.' } },
    { id: 'sofia',  name: 'Sofia Marquez',    w: 1, anspruch: 2000, beruf: 'Unternehmerin, Beachclubs',      look: { top: '#2fe0d2', hair: '#3a2416', skin: '#c48f6b' }, wohnung: { haus: 'Spreeufer Residenz', art: 'Villa-Apartment am Wasser', text: 'Hängesessel, Leinenvorhänge, eine Bar aus Treibholz und ein eigener Steg vor der Tür.' } }
  ],
  // Aktionen: ab = nötige Beziehung, kosten in €, pro = wie oft (tag = 1 Tag, drei = 3 Tage), bringt = Beziehung, Stil, Follower
  AKTIONEN: [
    { id: 'reden',     icon: '💬', name: 'Reden',                ab: 0,  kosten: 0,    pro: 'mehrmals', max: 3, bringt: { nahe: 6,  stil: 2,  fol: 20 } },
    { id: 'flirten',   icon: '😏', name: 'Flirten',              ab: 8,  anspruch: true,  kosten: 0,    pro: 'tag',               bringt: { nahe: 8,  stil: 4,  fol: 60 } },
    { id: 'wohnung',   icon: '🏠', name: 'Wohnung besuchen',     ab: 10, kosten: 0,    pro: 'tag',               bringt: { nahe: 4,  stil: 3,  fol: 40 } },
    { id: 'date',      icon: '🍷', name: 'Date im Papillong',        ab: 35, anspruch: true, kosten: 400,  pro: 'tag',               bringt: { nahe: 12, stil: 12, fol: 250 } },
    { id: 'freund',    icon: '🤝', name: 'Freundschaft schließen', ab: 25, kosten: 0,  pro: 'einmal',            bringt: { nahe: 10, stil: 20, fol: 150 } },
    { id: 'club',      icon: '🍸', name: 'Zusammen in den Club', ab: 30, kosten: 300,  pro: 'tag', freund: true, bringt: { nahe: 10, stil: 8,  fol: 150 } },
    { id: 'yacht',     icon: '🛥️', name: 'Zusammen auf die Yacht', ab: 40, kosten: 0, pro: 'tag', freund: true, boot: true, bringt: { nahe: 15, stil: 20, fol: 400 } },
    { id: 'urlaub',    icon: '✈️', name: 'Zusammen in Urlaub',   ab: 60, anspruch: true, kosten: 5000, pro: 'drei', freund: true, bringt: { nahe: 25, stil: 40, fol: 800 } }
  ],
  // Frech und mit Augenzwinkern wie in Sex and the City. {n} = Vorname. Pro Aktion mehrere Sätze, damit es frisch bleibt.
  TEXTE: {
    reden: ['{n} erzählt dir, wer im Penthouse Mitte gerade mit wem frühstückt. Du schweigst. Natürlich.', 'Ihr lästert 20 Minuten über den neuen Lambo am Boulevard. Ergebnis: zu laut, zu pink, du willst ihn trotzdem.', '{n} fragt, ob du Single bist. Du sagst: Es ist kompliziert. Es ist nicht kompliziert.', '{n} schwört, nie wieder Tequila. Ihr wisst beide, wie das endet.', 'Ihr redet über Männer, Taschen und Männer mit Taschen. Ein guter Abend.'],
    flirten: ['{n} hält dir die Aufzugtür auf. Etwas länger als nötig.', 'Du lachst über einen schlechten Witz von {n}. {n} weiß es. Du weißt es.', '{n} fragt, ob du immer so gut riechst. Du sagst: nur dienstags.', 'Blickkontakt über die Pool-Bar. Drei Sekunden. Berlin hat es gesehen.', '{n} schreibt dir „Gute Nacht 🌙“. Um 0:47 Uhr. Interessant.'],
    wohnung: ['Du stehst in der Wohnung von {n} und denkst nur: Wer putzt hier? Und wie viel kostet das?', '{n} zeigt dir die Wohnung. Du zählst 14 Kerzen, 3 Spiegel und keine einzige Spur von Alltag.', 'Bei {n} gibt es Champagner aus Gläsern, die mehr kosten als deine erste Miete.'],
    freund: ['Ab heute offiziell: {n} gehört zu deinem Kreis. Gruppenchat-Name folgt.', '{n} und du, Freundschaft besiegelt mit einem Espresso Martini. Die Stadt nimmt es zur Kenntnis.'],
    date: ['Papillong, Kerzenlicht, Austern. {n} bestellt den teuersten Champagner und tut so, als wäre das jeden Dienstag so.', '{n} rückt dir den Stuhl zurecht. Am Nebentisch zückt jemand das Mobilgerät. Morgen steht es im Stadt-Chat.', 'Das Dessert teilt ihr euch. Die Rechnung nicht. Gute Zeichen.'],
    club: ['Du und {n} tanzt bis 3 Uhr bei Scorpius Berlin. Deine Schuhe sind beleidigt, dein Feed ist begeistert.', '{n} hat den DJ bestochen. Euer Song läuft dreimal. Niemand beschwert sich.'],
    yacht: ['Du und {n} fahrt mit deiner Yacht raus. Sonnenuntergang, Rosé, 47 Fotos, eins davon perfekt.', 'Auf deiner Yacht erzählt {n} Geheimnisse, die das Festland nie erfahren wird.'],
    urlaub: ['Du und {n} fliegt übers Wochenende nach Mykonos. Was dort passiert, bleibt dort. Fast.', 'Saint-Tropez mit {n}: drei Tage, zwölf Outfits, null Reue.']
  },
  // Klatsch, der danach im Stadt-Chat landet. {du} = dein Name, {n} = Nachbar
  KLATSCH: ['Berlin Gossip: {du} und {n} wurden zusammen gesehen 👀', 'Wer hat {du} heute mit {n} lachen sehen? Ich frag für eine Freundin.', 'Stadt-Chat-Exklusiv: {du} und {n}, was läuft da? 🍸', '{n} und {du} schon wieder zusammen. Zufall? Glaubt hier keiner.']
};
