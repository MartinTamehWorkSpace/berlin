// Berlin City · partys.js (Daten) · Was in den Wohnungen los ist: jede Wohnung hat jeden Tag ein Event mit Namen, Art und 4 bis 10 Gästen.
// art bestimmt die Einrichtung (dj, bar, kueche, dinner, beauty) und die Mitmach-Aktion. Neue Events sind nur ein Eintrag.
window.GLOW_PARTYS = {
  EVENTS: [
    { name: 'Techno-Brunch', klasse: 2, art: 'dj', gaeste: [6, 10], aktion: '💃 Mittanzen', text: 'Avocado, Mimosas und ein DJ am Fenster.' },
    { name: 'CEO-Dinner', klasse: 4, art: 'dinner', gaeste: [4, 6], aktion: '🍷 Mitessen und netzwerken', text: 'Lange Tafel, gutes Essen, große Pläne.' },
    { name: 'Beauty Night', klasse: 2, art: 'beauty', gaeste: [5, 8], aktion: '💅 Mitmachen', text: 'Masken, Nägel, Tratsch und Prosecco.' },
    { name: 'Rooftop Cocktails', klasse: 1, art: 'bar', gaeste: [6, 10], aktion: '🍸 Anstoßen', text: 'Ein Barkeeper mixt Signature Drinks.' },
    { name: 'Pasta-Abend', klasse: 0, art: 'kueche', gaeste: [4, 7], aktion: '🍝 Mitkochen', text: 'Alle stehen in der Küche, es duftet nach Knoblauch.' },
    { name: 'Sunset Session', klasse: 3, art: 'dj', gaeste: [5, 9], aktion: '🎧 Mittanzen', text: 'Deep House, Sonnenuntergang, Balkon offen.' },
    { name: 'Wein und Tratsch', klasse: 0, art: 'bar', gaeste: [4, 6], aktion: '🥂 Anstoßen', text: 'Naturwein und die neuesten Geschichten der Stadt.' },
    { name: 'Sushi-Workshop', klasse: 1, art: 'kueche', gaeste: [4, 8], aktion: '🍣 Mitrollen', text: 'Ein Koch zeigt, wie Maki gelingen.' },
    { name: 'Gründerinnen-Lunch', klasse: 3, art: 'dinner', gaeste: [4, 7], aktion: '💼 Pitchen', text: 'Start-ups, Investoren und Salat.' },
    { name: 'Glow Pyjama Party', klasse: 4, art: 'beauty', gaeste: [5, 9], aktion: '🛁 Mitfeiern', text: 'Seidenpyjamas, Popcorn, Gesichtsmasken.' }
  ],
  // Soziale Leiter: Klasse 0 normale Leute bis Klasse 4 die Elite der Stadt. Ab welcher Influencer-Stufe (1 bis 20) du reinkommst.
  KLASSEN: [{ name: 'Nachbarschaft', ab: 0, titel: ['Studentin', 'Barista', 'Yogalehrerin', 'Kellner', 'Friseurin'] },
    { name: 'Szene', ab: 3, titel: ['Fotografin', 'DJ', 'Model', 'Stylistin', 'Barkeeper'] },
    { name: 'Society', ab: 6, titel: ['Influencerin', 'Galeristin', 'Restaurantbesitzer', 'Moderatorin', 'Designerin'] },
    { name: 'Business', ab: 10, titel: ['Investorin', 'Gründer', 'Anwältin', 'Immobilienmogul', 'Managerin'] },
    { name: 'Elite', ab: 14, titel: ['Popstar', 'Reederin', 'Hotelerbin', 'Fußballstar', 'Filmproduzentin'] }],
  // Was du mit Gästen machen kannst. stufe: Mindest-Nähe in Prozent; je höher die Klasse des Gasts, desto bekannter musst du sein.
  AKTIONEN: [{ id: 'reden', icon: '💬', name: 'Reden', stufe: 0 }, { id: 'anstossen', icon: '🥂', name: 'Anstoßen', stufe: 10 }, { id: 'tanzen', icon: '💃', name: 'Tanzen', stufe: 25 },
    { id: 'selfie', icon: '🤳', name: 'Selfie zusammen', stufe: 35 }, { id: 'flirten', icon: '😏', name: 'Flirten', stufe: 50 }, { id: 'deal', icon: '🤝', name: 'Deal machen', stufe: 60 }, { id: 'kuessen', icon: '💋', name: 'Küssen', stufe: 80 }],
  // Was Gäste sagen, wenn du sie ansprichst
  SAETZE: ['Du bist doch die Ärztin aus dem Alex Tower, oder?', 'Komm, ich stell dir jemanden vor.', 'Hast du die neue Birkinn schon gesehen?', 'Wir sollten mal zusammen nach Mykonos.',
    'Ich brauche unbedingt einen Termin bei dir.', 'Der DJ ist ein Freund von mir.', 'Wer hat den Champagner mitgebracht? Respekt.', 'Nächste Woche feiere ich bei mir, du bist eingeladen.',
    'Ich habe dich in der Spree Arena gesehen.', 'Erzähl, wie läuft deine Praxis?', 'Du siehst unverschämt erholt aus.', 'Kennst du schon das Papillong? Bester Spritz der Stadt.']
};
