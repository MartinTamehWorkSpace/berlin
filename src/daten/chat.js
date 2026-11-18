// Glow City · chat.js (Daten) · Was Bewohnerinnen im Stadt-Chat schreiben. Viele Sätze, damit sich nichts wiederholt.
// {n} = Name einer anderen Bewohnerin, {du} = dein Name. Gespräche: erst die Frage, dann passende Antworten anderer.
window.GLOW_CHAT = {
  TAGESZEIT: {
    morgen: ['Erst mal Oat Latte, dann reden wir', 'Wer ist schon wach? Ich steh im Stau am Boulevard', 'Gym um 7, ich hasse mich und liebe mich gleichzeitig', 'Guten Morgen Glow City ☀️', 'Mein Wecker hat 4 mal geklingelt, Rekord', 'Starbux hat die neue Pistazien-Latte, Leute', 'Heute Termin bei der Klinik im Tower, wünscht mir Glück', 'Wer joggt mit an der Promenade?'],
    mittag: ['Mittagspause im Rivva, Sushi ist heute top', 'Bin im CoWork und schlaf gleich ein', 'Wer hat Lust auf Salat bei Huggo\'s?', 'Sonne knallt, Promenade ist voll', 'Gerade 40 Minuten für einen Parkplatz gesucht', 'Habt ihr den neuen Pink-Lambo am Boulevard gesehen?', 'Lunch-Date abgesagt, also shoppen', 'Wer hat die Story von Valentina gesehen? 👀'],
    abend: ['Sunset im Rivva, ich bin schon da', 'Wer kommt mit ins Borchert?', 'Outfit-Check: schwarzes Kleid oder das Satin?', 'Rooftop im Glow Hotel, Musik ist mega', 'Hat jemand einen Tisch im Nicky Beach?', 'Feierabend! Endlich', 'Die Skyline glüht heute pink', 'Aperitivo bei Huggo\'s, Platz ist noch frei'],
    nacht: ['Bootshus ist heute komplett eskaliert', 'Wer ist noch wach?', 'Ich kann nicht schlafen, schaue Reels von Kliniken 😅', 'Uber kommt nicht, ich lauf jetzt heim', 'Afterparty bei wem?', 'Die Neonlichter im Hafen sind so schön nachts', 'Morgen bereue ich das', 'Ich hör nur noch den Bass vom Bootshus']
  },
  ALLGEMEIN: ['Hat jemand eine gute Nagelstudio-Empfehlung?', 'Meine Kollektion wächst, fehlt nur noch die Ikone', 'Tiffanny hat neue Solitäre im Fenster ✨', 'Ich spar auf den Roadster, noch 3 Jahre 😂', 'Maison du Sac war heute voll mit Touristen', 'Wer kennt einen guten Friseur für Balayage?', 'Die Kryo in der Klinik im Tower, hat das jemand gemacht?', 'Ich hab heute 3 Kundinnen in meiner Boutique gehabt, läuft', 'Mein Ranking steigt endlich', 'Wer geht zur Abstimmung? Pilates oder Sushi?', 'Endlich Senior, Lohn ist spürbar besser', 'Hab mich für den Uber entschieden, 10 € aber stressfrei', 'Wer hat den Hubschrauber über dem Hotel gesehen?', 'Neue Folge Glow City Gossip: wer datet wen?', 'Ich will einfach nur am Strand liegen', 'Die G-Klasse in Weiß ist ein Traum', 'Botox oder erst mal Urlaub?', 'Heute alles auf eine Karte: Birkinn gekauft', 'Mein Social-Media-Team hat heute 3 Reels gepostet', 'Kennt jemand die neue Ärztin im Glow Tower?', 'Ich hab mich verlaufen, wo ist nochmal Tiffanny?', 'Der Brunnen am Platz ist mein Lieblingsort', 'Wer hat Kopfhörer im Bus verloren? Rosa?', 'Unpopular opinion: Starbux ist überbewertet', 'Ich glaub Nachbar Marco hat was zu verbergen 👀'],
  // Kleine Gespräche: erste Zeile, dann bis zu zwei Antworten anderer
  GESPRAECHE: [
    ['Wer ist heute Abend im Rivva?', ['Ich! Ab 19 Uhr', 'Nur wenn ich einen Platz am Wasser kriege', 'Bin dabei, bringe {n} mit']],
    ['Botox in der Klinik im Tower, Erfahrungen?', ['Mega natürlich, keiner hat was gemerkt', 'Teuer, aber jeden Cent wert', 'Ich warte noch auf meinen Termin']],
    ['Welche Tasche ist die beste Einstiegs-Designertasche?', ['Speedi, ganz klar', 'Jackie von Gucchi, zeitlos', 'Spar lieber auf die Flap']],
    ['Hat jemand den Roadster fliegen sehen?', ['Ja über dem Glow Hotel!', 'Das war bestimmt {du}', 'Ich dachte erst, das wäre ein Hubschrauber']],
    ['Lohnt sich die Boutique am Wasser?', ['Bei mir läuft sie super, vor allem Parfum', 'Kasse leeren nicht vergessen 😅', 'Die It-Bag bringt am meisten']],
    ['Wer geht mit zum Pilates?', ['Ich, aber erst Kaffee', 'Mein Rücken sagt nein', 'Klar, 8 Uhr am Strand?']],
    ['Tiffanny oder Rolecks zuerst?', ['Ring. Immer zuerst der Ring', 'Uhr, die trägst du jeden Tag', 'Beides, man lebt nur einmal']],
    ['Kennt ihr Dr. Ricco und Dr. Nico?', ['Deren Praxis hat 900k Follower', 'Die Klinik im Tower holt auf', 'Ich hab bei denen 3 Monate Wartezeit']],
    ['Ist die Promenade heute voll?', ['Komplett, Parkplätze null', 'Geht noch, am Yachtclub ist Platz', 'Nimm ein Uber']],
    ['Was zieht ihr ins Borchert an?', ['Schwarzes Satin', 'Blazer und Jeans, lässig', 'Was Zahra so hergibt 😂']]
  ],
  // Antworten auf dich: Themen mit Stichwörtern
  THEMEN: [
    [/botox|filler|lippe|klinik|ärzt|arzt|glatt|behandl|spritze|laser|hydra|kryo/i, ['Ich will einen Termin bei dir, {du}!', 'Wie lange hält Botox bei dir?', 'Lippen bei dir sahen echt natürlich aus', 'Nimmst du noch Neukundinnen?', 'Was kostet bei dir HydraFacial?', 'Meine Schwester war bei dir, sie ist begeistert', 'Ist die Klinik im Tower deine? Krass', 'Ich hab Angst vor Nadeln, aber für dich mach ich das']],
    [/tasche|birkin|bag|speedi|flap|maison|hermez|shanell|kollektion|dioro|gucchi/i, ['Welche hast du? Foto bitte 😍', 'Die Rose Sakura ist mein Traum', 'Maison du Sac hat gerade neue im Fenster', 'Du hast echt die schönsten Taschen', 'Barbie-Pink Flap, ich sterbe', 'Wie viele fehlen dir noch in der Kollektion?', 'Ich hab die Speedi, aber träume von der Kellie']],
    [/auto|tesla|teslo|roadster|lambo|g ?63|g-klasse|fahr|uber|park/i, ['Gib mir mal eine Runde im Roadster 🙏', 'Parkplatz am Boulevard ist ein Witz', 'G-Klasse in Matt oder gar nicht', 'Ich nehm heute Uber', 'Der Teslo ist eben übers Hotel geflogen, warst du das?', 'Ich will den pinken Lambo, nur das']],
    [/boutique|laden|verkauf|kasse|regal|shop/i, ['Deine Boutique ist so schön geworden', 'Hab bei dir Lipgloss gekauft, schon leer 😂', 'Wann gibt es neue Ware bei dir?', 'Deine Schaufenster sind die besten am Wasser']],
    [/affäre|nachbar|schatz|date|liebe|flirt|ex/i, ['Uiii, erzähl mehr 👀', 'Ich sag nix, aber Nachbar Marco grinst die ganze Zeit', 'Die Wände im Penthouse sind dünn, nur so', 'Mein Mund ist versiegelt 🤐', 'Drama! Ich hol Popcorn 🍿']],
    [/hallo|hi\b|hey|servus|moin|guten|na\b/i, ['Hey {du}! 💕', 'Hiii, wo bist du gerade?', 'Na, auch wach?', '{du}! Endlich jemand Echtes hier', 'Hallo hallo 👋', 'Was geht, {du}?']],
    [/geld|reich|million|euro|teuer|bezahl/i, ['Geld kommt, Geld geht, Taschen bleiben', 'Bei mir reicht es gerade für Starbux 😂', 'Du bist doch eh schon Millionärin', 'Investier in die Klinik, das lohnt sich']],
    [/\?\s*$/, ['Gute Frage, ich glaub ja', 'Frag mal im Rivva, die wissen alles', 'Keine Ahnung, aber ich will es auch wissen', 'Einfach machen', 'Kommt drauf an, wie viel Zeit du hast']]
  ],
  NACHFRAGEN: ['Und du, {du}?', 'Wo bist du gerade?', 'Kommst du heute noch raus?', 'Erzähl!', 'Ernsthaft? 😂', 'Same', 'Haha nein', 'Stimmt eigentlich', 'Ich auch!', 'Uff']
};
