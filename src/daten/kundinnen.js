// Berlin · kundinnen.js (Daten) · Stammkundinnen der Klinik: feste Personen mit Lieblingsbehandlungen und einer Geschichte, die sich von Besuch zu Besuch weiterentwickelt.
// Neue Stammkundin = ein Eintrag. wunsch: Behandlungs-ids in Reihenfolge der Vorliebe. anlass: ein Satz je Besuch, der letzte wiederholt sich.
window.GLOW_KUNDINNEN = [
  { name: 'Sasha Montclair', icon: '💍', wunsch: ['botox', 'hydra', 'lippen'], anlass: ['Heiratet in 3 Wochen und will auf den Fotos strahlen', 'Probetermin für das Brautstyling', 'Letzter Feinschliff vor der Hochzeit', 'Zurück aus den Flitterwochen, erzählt allen von dir'] },
  { name: 'Valentina Ricci', icon: '📸', wunsch: ['lippen', 'botox', 'laser'], anlass: ['Influencerin, 80.000 Follower, testet dich', 'Hat dich in ihrer Story erwähnt', 'Kommt mit einer Freundin und filmt alles', 'Nennt dich öffentlich ihre Ärztin'] },
  { name: 'Nora Lindberg', icon: '💼', wunsch: ['hydra', 'led', 'drip'], anlass: ['Anwältin, kaum Zeit, will frisch wirken', 'Großer Prozess morgen, braucht Energie', 'Kommt jetzt jeden Monat fest', 'Hat ihre ganze Kanzlei zu dir geschickt'] },
  { name: 'Mira Okafor', icon: '🎤', wunsch: ['drip', 'needling', 'botox'], anlass: ['Sängerin auf Tour, 3 Tage in Berlin', 'Konzert in der Spree Arena heute Abend', 'Bucht dich für die ganze Tour', 'Dankt dir auf der Bühne'] },
  { name: 'Elena Varga', icon: '🛥️', wunsch: ['laser', 'rf', 'lift'], anlass: ['Reederin, will nichts Übertriebenes', 'Gala auf der eigenen Yacht am Wochenende', 'Vertraut nur noch dir', 'Lädt dich auf ihre Yacht ein'] },
  { name: 'Jade Kim', icon: '🎮', wunsch: ['led', 'hydra', 'needling'], anlass: ['Streamerin, die Kamera zeigt jede Pore', 'Livestream mit 20.000 Zuschauern heute', 'Hat einen Rabattcode für dich erfunden', 'Streamt live aus deiner Klinik'] },
  { name: 'Carla Benedetti', icon: '🍷', wunsch: ['botox', 'rf', 'nad'], anlass: ['Restaurantbesitzerin, steht 14 Stunden am Tag', 'Eröffnet ein zweites Lokal', 'Bringt dir Tiramisu mit', 'Ihr Personal kommt jetzt auch zu dir'] },
  { name: 'Amara Diallo', icon: '👠', wunsch: ['lippen', 'kryo', 'laser'], anlass: ['Model, Shooting in Paris nächste Woche', 'Zurück aus Paris, will den Look halten', 'Neue Kampagne für ein Modehaus', 'Empfiehlt dich ihrer Agentur'] },
  { name: 'Helena Brandt', icon: '🏛️', wunsch: ['lid', 'lift', 'botox'], anlass: ['Galeristin, 52, will nur besser aussehen, nicht anders', 'Kontrolltermin, sehr zufrieden', 'Vernissage am Freitag', 'Hat dir ein Bild geschenkt'] },
  { name: 'Lou Fontaine', icon: '🧘', wunsch: ['nad', 'drip', 'hbot'], anlass: ['Yogalehrerin, interessiert sich für Longevity', 'Will verstehen, was ihr Körper braucht', 'Kommt mit ihrem Partner', 'Schickt dir ihre ganze Yoga-Gruppe'] }
];
// Was Kundinnen nach der Behandlung sagen, nach Sternen
window.GLOW_BEWERTUNGEN = {
  5: ['Ich fühle mich wie neu', 'Beste Ärztin der Stadt', 'Niemand hat etwas gemerkt, nur dass ich frisch aussehe', 'Ich komme wieder, ganz sicher', 'So natürlich, genau wie gewünscht', 'Meine Freundinnen fragen schon, wo ich war'],
  4: ['Sehr zufrieden', 'Schöne Klinik, tolles Team', 'Hat sich gelohnt', 'Kaum Wartezeit, sehr angenehm'],
  3: ['Ganz gut, aber etwas lange gewartet', 'Ok, beim nächsten Mal mehr Zeit für mich', 'In Ordnung'],
  2: ['Zu lange gewartet', 'Hatte mir mehr erwartet']
};
