// Berlin City · aufklaerung.js (Daten) · Was bei jeder Behandlung wirklich passiert, und die Merkblätter von Kongressen.
// Der Mehrwert der Klinik: Spielerinnen lernen nebenbei, was bei einer Behandlung gemacht wird, womit, was es kostet an Ausfallzeit und welche Risiken es gibt.
// Sachlich und vorsichtig formuliert. Allgemeine Information, keine ärztliche Beratung.
window.GLOW_AUFKLAERUNG = {
  BEHANDLUNGEN: {
    botox: {
      was: 'Botulinumtoxin entspannt gezielt die Muskeln, die Stirn- und Zornesfalten bilden. Die Haut darüber glättet sich, weil der Muskel weniger zieht.',
      material: 'Botulinumtoxin Typ A, in Kochsalzlösung verdünnt. Für Stirn und Zornesfalte meist 20 bis 50 Einheiten.',
      ablauf: 'Feine Nadel, 5 bis 10 kleine Einstiche, etwa 15 Minuten. Keine Betäubung nötig.',
      haelt: 'Wirkt nach 3 bis 14 Tagen, hält etwa 3 bis 4 Monate.',
      ausfall: 'Keine. Kleine Quaddeln sind nach 20 Minuten weg.',
      risiken: ['Blaue Flecken an den Einstichen', 'Leichte Kopfschmerzen in den ersten Tagen', 'Selten ein hängendes Lid oder eine schiefe Braue für einige Wochen', 'Nicht in Schwangerschaft und Stillzeit'],
      nachsorge: '4 Stunden aufrecht bleiben, Stelle nicht massieren. 24 Stunden kein Sport, keine Sauna.'
    },
    led: {
      was: 'Licht bestimmter Wellenlängen wird auf die Haut gestrahlt. Rotlicht soll die Regeneration unterstützen, Blaulicht wird bei unreiner Haut eingesetzt.',
      material: 'LED-Maske oder LED-Panel. Rot etwa 630 bis 660 nm, Nahinfrarot etwa 830 nm, Blau etwa 415 nm.',
      ablauf: 'Liegen, Augenschutz auf, etwa 20 Minuten. Keine Nadeln, keine Wärme.',
      haelt: 'Wirkt nur als Serie, meist 6 bis 10 Sitzungen.',
      ausfall: 'Keine.',
      risiken: ['Sehr gering', 'Augen immer schützen', 'Vorsicht bei Medikamenten, die lichtempfindlich machen'],
      nachsorge: 'Nichts Besonderes. Danach normal pflegen.'
    },
    lippen: {
      was: 'Hyaluronsäure wird in Lippenrot und Kontur gespritzt. Die Lippe wird voller und definierter, Fältchen am Lippenrand werden aufgefüllt.',
      material: 'Vernetzte Hyaluronsäure als Gel, meist mit Lidocain zur Betäubung. Üblich sind 0,5 bis 1 ml.',
      ablauf: 'Betäubungscreme, dann Nadel oder stumpfe Kanüle, etwa 30 Minuten.',
      haelt: 'Sofort sichtbar, endgültig nach 2 Wochen. Hält etwa 6 bis 12 Monate.',
      ausfall: '1 bis 3 Tage geschwollen, mögliche Blutergüsse.',
      risiken: ['Schwellung und Blutergüsse', 'Knötchen oder ungleichmäßige Verteilung', 'Ausbruch von Lippenherpes', 'Selten Gefäßverschluss: ein Notfall, der sofort mit Hyaluronidase aufgelöst wird'],
      nachsorge: 'Kühlen. 48 Stunden kein Sport, keine Sauna, kein Alkohol. Nicht massieren.'
    },
    hydra: {
      was: 'Eine Tiefenreinigung in mehreren Schritten: reinigen, sanft peelen, Poren absaugen, dann Seren einschleusen.',
      material: 'Gerät mit Vakuum-Spitze, milde Säuren (Glykol- und Salicylsäure), Seren mit Hyaluron und Antioxidantien.',
      ablauf: 'Etwa 30 bis 60 Minuten, schmerzfrei, fühlt sich an wie ein leichtes Saugen.',
      haelt: 'Frischer Teint für einige Tage. Für dauerhaft bessere Haut alle 4 Wochen.',
      ausfall: 'Keine, höchstens ein paar Stunden leichte Rötung.',
      risiken: ['Rötung', 'Selten Reizung bei sehr empfindlicher Haut', 'Nicht auf entzündeter Haut oder frischem Sonnenbrand'],
      nachsorge: 'Sonnenschutz. Am besten 24 Stunden kein Make-up.'
    },
    needling: {
      was: 'Feine Nadeln setzen tausende Mikroverletzungen. Die Haut repariert sich und bildet dabei neues Kollagen. Mit Eigenblut kommen Wachstumsfaktoren aus dem eigenen Plasma dazu.',
      material: 'Microneedling-Pen mit Nadeln von 0,5 bis 2 mm. Für Eigenblut (PRP): Blut abnehmen, zentrifugieren, das Plasma auftragen.',
      ablauf: 'Betäubungscreme, dann etwa 60 Minuten. Es kribbelt und kann leicht bluten.',
      haelt: 'Ergebnis nach 4 bis 6 Wochen. Meist 3 bis 4 Sitzungen im Abstand von 4 bis 6 Wochen.',
      ausfall: '1 bis 3 Tage Rötung wie ein Sonnenbrand.',
      risiken: ['Rötung und Schwellung', 'Selten Infektion', 'Pigmentflecken, vor allem mit Sonne', 'Nicht bei aktiver unreiner Haut im Behandlungsfeld'],
      nachsorge: '48 Stunden kein Make-up, keine Säuren, kein Retinol. Sonnenschutz LSF 50.'
    },
    laser: {
      was: 'Ein Laser zerlegt Pigment in winzige Teile, die der Körper abtransportiert. Gegen Rötungen zielt ein anderer Laser auf kleine Gefäße.',
      material: 'Pikosekunden-Laser für Pigment, Gefäßlaser für Rötungen. Kühlung der Haut während der Behandlung.',
      ablauf: 'Schutzbrille, kurze Impulse wie das Schnippen eines Gummibands, etwa 20 bis 30 Minuten.',
      haelt: 'Meist 2 bis 5 Sitzungen. Neue Flecken können mit Sonne wiederkommen.',
      ausfall: 'Einige Tage Rötung, Pigmentflecken werden dunkler und fallen als feine Kruste ab.',
      risiken: ['Rötung und Krusten', 'Hellere oder dunklere Flecken, vor allem bei gebräunter oder dunkler Haut', 'Nie direkt nach dem Urlaub in der Sonne'],
      nachsorge: '4 Wochen strikt Sonnenschutz, Krusten nicht abkratzen.'
    },
    rf: {
      was: 'Radiofrequenz erwärmt die tieferen Hautschichten. Das Kollagen zieht sich zusammen und wird neu gebildet. Die Haut wird straffer.',
      material: 'Radiofrequenz-Gerät, je nach Gerät mit Nadeln (RF-Microneedling) oder über die Oberfläche. Temperatur in der Haut etwa 40 bis 45 Grad.',
      ablauf: 'Etwa 45 bis 60 Minuten. Fühlt sich warm bis heiß an.',
      haelt: 'Straffung baut sich über 3 bis 6 Monate auf und hält etwa 1 bis 2 Jahre.',
      ausfall: 'Keine bis 2 Tage Rötung, mit Nadeln etwas mehr.',
      risiken: ['Rötung und Schwellung', 'Selten Verbrennungen', 'Nicht bei Herzschrittmacher oder Metallimplantaten im Gesicht'],
      nachsorge: 'Sonnenschutz, viel trinken, sanfte Pflege.'
    },
    kryo: {
      was: 'Fettzellen sind kälteempfindlicher als Haut. Ein Applikator kühlt eine Fettzone so stark, dass Fettzellen absterben und über Wochen abgebaut werden.',
      material: 'Kryolipolyse-Gerät mit Saug-Applikator, Schutzpad für die Haut. Kühlung auf etwa minus 10 Grad.',
      ablauf: 'Etwa 35 bis 60 Minuten je Zone. Am Anfang kalt und ziehend, dann taub.',
      haelt: 'Ergebnis nach 8 bis 12 Wochen. Die behandelte Zone wird schlanker. Kein Mittel zum Abnehmen.',
      ausfall: 'Keine. Die Stelle kann einige Wochen taub sein.',
      risiken: ['Rötung, Blutergüsse, Taubheit', 'Selten wächst das Fett an der Stelle stattdessen (paradoxe Fettvermehrung)', 'Nicht bei Kälteurtikaria oder Kryoglobulinämie'],
      nachsorge: 'Stelle nach der Behandlung massieren lassen, normal bewegen.'
    },
    lid: {
      was: 'Überschüssige Haut am Oberlid wird entfernt, manchmal auch etwas Fett. Der Blick wirkt wacher und offener.',
      material: 'Skalpell oder Laser, feine Nähte. Örtliche Betäubung, auf Wunsch Dämmerschlaf.',
      ablauf: 'Schnitt in der natürlichen Lidfalte, etwa 45 bis 60 Minuten. Fäden kommen nach 5 bis 7 Tagen raus.',
      haelt: 'Viele Jahre, oft dauerhaft.',
      ausfall: '7 bis 14 Tage Schwellung und Blutergüsse.',
      risiken: ['Schwellung, Blutergüsse, trockene Augen', 'Sichtbare Narbe, meist in der Falte versteckt', 'Selten Probleme beim Lidschluss oder Asymmetrie'],
      nachsorge: 'Kühlen, Kopf hoch lagern, 2 Wochen kein Sport, keine Kontaktlinsen.'
    },
    nase: {
      was: 'Die Nase wird in Form und Größe verändert: Höcker abtragen, Spitze formen, manchmal auch die Atmung verbessern.',
      material: 'Operation in Vollnarkose. Knorpel und Knochen werden geformt, oft eigener Knorpel als Stütze. Schiene außen, manchmal Tamponaden.',
      ablauf: 'Etwa 2 bis 3 Stunden, offen (kleiner Schnitt am Steg) oder geschlossen (nur innen).',
      haelt: 'Dauerhaft. Das Endergebnis ist erst nach etwa 12 Monaten zu sehen.',
      ausfall: '1 bis 2 Wochen gesellschaftsfähig, Schiene 7 Tage.',
      risiken: ['Schwellung und Blutergüsse um die Augen', 'Behinderte Nasenatmung', 'Asymmetrie, manchmal Nachkorrektur nötig', 'Risiken der Narkose'],
      nachsorge: 'Nicht schnäuzen, 6 Wochen keine Brille auf der Nase, kein Sport.'
    },
    lift: {
      was: 'Haut und die darunter liegende Bindegewebsschicht (SMAS) werden an Wangen und Kieferlinie gestrafft. Hängebäckchen und Falten am Kiefer werden weniger.',
      material: 'Operation mit Schnitt vor und hinter dem Ohr, Nähte. Örtliche Betäubung mit Dämmerschlaf oder Vollnarkose.',
      ablauf: 'Etwa 2 bis 3 Stunden.',
      haelt: 'Etwa 5 bis 10 Jahre. Die Alterung geht danach normal weiter.',
      ausfall: '2 bis 3 Wochen Schwellung und Blutergüsse.',
      risiken: ['Bluterguss unter der Haut, der behandelt werden muss', 'Reizung von Gesichtsnerven, meist vorübergehend', 'Narben und Taubheitsgefühl', 'Infektion, Risiken der Narkose'],
      nachsorge: 'Kopf hoch lagern, Kompression, 4 Wochen kein Sport, keine Sonne auf die Narben.'
    },
    drip: {
      was: 'Vitamine und Mineralstoffe laufen direkt in die Vene. Beliebt als Energie- oder Glow-Kur.',
      material: 'Kochsalzlösung mit zum Beispiel Vitamin C, B-Vitaminen, Magnesium und Zink. Zugang in die Armvene.',
      ablauf: 'Etwa 30 bis 45 Minuten im Sessel.',
      haelt: 'Ohne nachgewiesenen Mangel ist ein Nutzen für Gesunde wissenschaftlich nicht belegt. Sinnvoll ist erst zu messen, dann gezielt auszugleichen.',
      ausfall: 'Keine.',
      risiken: ['Bluterguss oder Reizung an der Vene', 'Selten allergische Reaktion', 'Vorsicht bei Nieren- oder Herzerkrankung'],
      nachsorge: 'Einstichstelle kurz drücken, normal trinken.'
    },
    nad: {
      was: 'NAD+ ist ein Molekül, das jede Zelle für den Energiestoffwechsel braucht. Die Infusion soll den Spiegel anheben.',
      material: 'NAD+ in Kochsalzlösung, sehr langsam über die Armvene.',
      ablauf: '2 bis 4 Stunden, weil eine schnelle Gabe unangenehm ist.',
      haelt: 'Die Studienlage zu Anti-Aging beim Menschen ist noch dünn. Vieles stammt aus Tierversuchen.',
      ausfall: 'Keine.',
      risiken: ['Bei zu schneller Gabe Druck in der Brust, Übelkeit, Hitzegefühl', 'Bluterguss an der Vene'],
      nachsorge: 'Danach etwas essen und trinken.'
    },
    hbot: {
      was: 'In einer Druckkammer wird reiner Sauerstoff bei erhöhtem Druck eingeatmet. Das Blut nimmt so deutlich mehr Sauerstoff auf.',
      material: 'Druckkammer, 100 % Sauerstoff über Maske oder Haube, Druck etwa 1,5 bis 2,4 bar.',
      ablauf: '60 bis 90 Minuten liegen. Beim Druckaufbau Druckausgleich wie im Flugzeug.',
      haelt: 'Medizinisch etabliert zum Beispiel nach Tauchunfällen und bei schlecht heilenden Wunden. Der Wellness-Nutzen ist nicht gesichert.',
      ausfall: 'Keine.',
      risiken: ['Ohrendruck bis zur Verletzung des Trommelfells', 'Platzangst', 'Selten Sauerstoffvergiftung', 'Nicht bei Erkältung oder bestimmten Lungenerkrankungen'],
      nachsorge: 'Nach der Sitzung kurz sitzen bleiben, nicht direkt fliegen oder tauchen.'
    },
    kammer: {
      was: 'Ganzkörper-Kältetherapie: wenige Minuten in sehr kalter, trockener Luft. Soll erfrischen und bei Muskelkater helfen.',
      material: 'Kältekammer mit minus 110 bis minus 140 Grad. Badekleidung, Handschuhe, Socken, Stirnband, Mundschutz.',
      ablauf: '2 bis 3 Minuten, immer mit Begleitung.',
      haelt: 'Kurzfristiges Frischegefühl. Belege für langfristige Effekte sind begrenzt.',
      ausfall: 'Keine.',
      risiken: ['Erfrierungen bei feuchter Haut oder Schmuck', 'Blutdruckanstieg', 'Nicht bei Herz-Kreislauf-Erkrankung, Raynaud oder Schwangerschaft'],
      nachsorge: 'Haut vorher komplett trocken, danach langsam aufwärmen.'
    },
    check: {
      was: 'Ein ausführlicher Gesundheitscheck mit Blutwerten und Messungen. Er zeigt, wo du stehst, bevor du irgendetwas optimierst.',
      material: 'Blutabnahme, zum Beispiel Blutbild, HbA1c, Blutfette mit ApoB und Lp(a), hsCRP, Vitamin D, Ferritin, Schilddrüse. Dazu Blutdruck und Körperzusammensetzung.',
      ablauf: 'Etwa 30 Minuten, nüchtern am Morgen.',
      haelt: 'Ergebnisse nach 3 bis 7 Tagen, dann Besprechung. Sinnvoll einmal im Jahr.',
      ausfall: 'Keine.',
      risiken: ['Bluterguss an der Einstichstelle', 'Auffällige Werte gehören in ärztliche Abklärung'],
      nachsorge: 'Nach der Abnahme frühstücken.'
    }
  },
  // Merkblätter: was du vom Kongress mitbringst
  KONGRESSE: {
    rivva: { thema: 'Natürliche Ergebnisse mit Botox', punkte: ['Dosis nach Muskelkraft, nicht nach Schema: kräftige Stirn braucht mehr, feine Haut weniger.', 'Kleine Dosen über mehr Punkte verteilt sehen natürlicher aus und lassen Mimik zu.', 'Mindestens 3 Monate Abstand zwischen zwei Behandlungen, damit der Körper keine Abwehr bildet.', 'Stirn nie ohne Zornesfalte behandeln, sonst sinken die Brauen.'] },
    miami: { thema: 'Neue Geräte auf der Expo', punkte: ['Kombinationen sind der Trend: RF-Microneedling verbindet Straffung und Kollagenaufbau in einer Sitzung.', 'Exosomen werden überall beworben, die Studienlage beim Menschen ist aber noch dünn.', 'Jedes Gerät ist nur so gut wie die Einstellung: Hauttyp und Bräune entscheiden über das Risiko.', 'Täglicher Sonnenschutz bleibt die wirksamste Anti-Aging-Maßnahme überhaupt.'] },
    paris: { thema: 'Wie Haut altert', punkte: ['Sonne ist der größte äußere Faktor für Falten und Pigmentflecken.', 'Retinoide sind der am besten untersuchte Wirkstoff für Hautalterung, Einstieg langsam wegen Reizung.', 'Rauchen und wenig Schlaf zeigen sich in der Haut schneller als im Spiegel gedacht.', 'Kollagen nimmt ab etwa 25 Jahren jedes Jahr ab. Vorbeugen ist leichter als Reparieren.'] },
    seoul: { thema: 'K-Beauty und Hautbarriere', punkte: ['Eine intakte Hautbarriere ist die Basis: lieber wenige milde Produkte als viele aggressive.', 'Double Cleansing: erst Öl, dann mild auf Wasserbasis, vor allem nach Sonnenschutz und Make-up.', 'Skinbooster mit Hyaluron oder Polynukleotiden spenden Feuchtigkeit von innen, Ergebnis nach mehreren Sitzungen.', 'Glass Skin heißt gut versorgte Haut, nicht perfekte Haut.'] },
    monaco: { thema: 'Komplikationen sicher beherrschen', punkte: ['Gefäßverschluss nach Filler erkennen: Schmerz, plötzliche Blässe, dann bläuliche Marmorierung.', 'Hyaluronidase muss in jeder Praxis griffbereit sein, die Filler spritzt.', 'Stumpfe Kanülen senken das Risiko in gefährlichen Zonen, ganz ausschließen können sie es nicht.', 'Ultraschall vor der Injektion zeigt die Gefäße und wird zum neuen Standard.'] },
    dubai: { thema: 'Longevity ohne Hype', punkte: ['Bewegung, Kraft, Schlaf und Ernährung bringen am meisten, lange vor jeder Infusion.', 'Die Fitness des Herz-Kreislauf-Systems (VO2max) gehört zu den stärksten Hinweisen auf ein langes Leben.', 'ApoB und Lp(a) zeigen das Gefäßrisiko besser als nur das Gesamtcholesterin. Lp(a) reicht einmal im Leben zu messen.', 'Infusionen und Supplements helfen bei einem gemessenen Mangel, ohne Mangel ist der Nutzen meist nicht belegt.'] }
  }
};
