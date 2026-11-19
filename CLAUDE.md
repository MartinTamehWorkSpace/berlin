# Berlin

Lifestyle-Spiel in Berlin (eigene Kopie von Glow City, getrennt). Live: https://berlin-city.netlify.app, Code: github.com/MartinTamehWorkSpace/berlin (Martin und Leon).

## Arbeitsweise (Stand 19.11.2026)
- Hochladen nur mit `sh werkzeug/hochladen.sh "Was geändert wurde"` (holt Leons Stand, stempelt Versionen, prüft, lädt zu GitHub; Netlify reicht nur durch, kostet nichts). Offene Spiele laden sich binnen 1 Minute selbst neu.
- Netlify selbst (Server in netlify/functions) nur mit Martins Ja, kostet Credits.
- Martin 19.11. nachts: Werkstatt-Stand nur lokal committen, NICHT hochladen, bis Martin nachgebessert hat.
- Berghain baut Leon, Scorpius Berlin baut Martins Seite. Nicht gleichzeitig dieselben Dateien.

## Was neu ist (Werkstatt 19.11.)
- GTA-Look: Schrift Anton, Kanten statt Rundungen, Neonpink #ff2f7d und Amber #ffb21a. Logo BERLIN 030.
- Karrieren statt Klinik als Hauptspiel: src/spiel/karriere.js (Dealer mit Polizei und Fahndungssternen, Gastro-Boss mit Lokalen und Ausbauten, Influencer mit Hotspots und Kooperationen). Wahl an der Weltzeituhr am Alex oder unten über „Karriere“.
- Stadtbild: src/drei/graffiti.js (Graffitis, Fernsehturm, Brandenburger Tor, Oberbaumbrücke, East Side Gallery, S-Bahn-Viadukt, Tram M10, Spätis, Litfaßsäulen, U-Bahn, Ampelmännchen, Fahrräder, Buddy Bären, Döner Mostafas, Weltzeituhr, Polizeiwagen, Fußstreife, Hubschrauber ab 4 Sternen, Zielringe). Häuser: Berliner Putz, Flachdächer mit Teerpappe. Gaslaternen, Linden, Beanies, gefärbte Haare, Autos in Berliner Lacken. Wetter mit Nieselregen.
- Prüfen ohne Upload: Werkstatt-Kopie im Scratchpad mit python http.server (Port 8092), Tageszeit für Tests über window.TESTSTUNDE in der Kopie.

(Unten die alte Anleitung aus Glow City, gilt sinngemäß weiter.)

## Aufbau

```
index.html            Spiel: HTML, CSS und die Module in fester Ladereihenfolge
autohaus.html         Begleitseite Autohaus
figuren.html          Begleitseite Figurenbogen
wirtschaft.html       Begleitseite Balance und Preisleiter
src/daten/            Reine Daten, keine Zeichnung
  wirtschaft.js       Löhne, Karriere, Katalog aller kaufbaren Dinge, Rechner tageBis()
  figuren.js          Die 20 Charaktere, Taschen und das Zeichnen jeder Figur
  marken.js           Läden und Marken: Texte, Angebote, Leuchtfarben
  stadtplan.js        Welches Gebäude auf welchem Grundstück steht
  kundinnen.js        Stammkundinnen der Klinik und Sätze für Bewertungen
  nachbarn.js         Die Nachbarschaft: Männer und Frauen mit Beruf, Wohnung, Look und die Aktionen mit ihnen
  klinik.js           Klinik im Glow Tower: Behandlungen, Geräte, Liegen, Wartezimmer, Team, Social-Posts, Rivalen, Kongresse
  aufklaerung.js      Was bei jeder Behandlung passiert (Material, Ablauf, Risiken) und Merkblätter der Kongresse
  boutique.js         Ware, Regale, Kasse, Glow-Level-Kurve und die 8 Sets des Taschenalbums (40 Taschen)
src/kern/             Grundlagen: Zeichenfläche, Zufall, Kamera, Formen, Spielschleife, Wegesuche
src/welt/             Alles, was in der Stadt sichtbar ist: Boden, Gebäude (Glas und Art déco), Natur, Boote, Autos, Bewohner, Innenräume,
                      zeit.js (Uhr nach echter Zeit: ein Spieltag = 4 Stunden, für alle gleich; Energie), wetter.js (Regen, Wetterleuchten),
                      boden.js mit Parkbuchten vor jedem Haus
src/spiel/            Spielstand und Kaufen, eigenes-auto.js (rufen, auf der Straße fahren mit Spur und Ampel, parken, Uber für 10 €; nur der Roadster fliegt frei), aufgaben.js (Tagesaufgaben, Erfolge, Banner),
                      boutique.js (der tägliche Kreislauf: eigene Boutique, Glow-Level 1–100, Taschenfunde fürs Kollektion),
                      klinik.js (Hauptspiel: deine Schönheitsklinik im Glow Tower, Kundinnen in echter Zeit, Team, Social Media, Klinik-Ranking, Zielkette),
                      kongresse.js (Kongresse, Messen, Vorträge in echter Zeit, Sterneverfall, Glow-Boost), aufklaerung.js (Aufklärungsblatt je Behandlung, Merkblätter), op.js (selbst behandeln und operieren als Geschicklichkeitsspiel, Anerkennung),
                      stammkundinnen.js (Stammkundinnen mit Geschichte und Treuebonus, Promi-Anfragen, Bewertungen), liga.js (Liga der Woche unter Kliniken),
                      meisterschaft.js (5 Stufen je Behandlung), kongressspiel.js (Würfelrennen mit Lernfragen während der Reise),
                      nachbarn.js (Beziehungen zu den Nachbarn: Reden, Wohnung, Freundschaft, Club, Yacht, Urlaub, Affäre),
                      jet.js (eigener Privatjet: Ziele wählen, Abflug am Glow Airport, Stil und Follower),
                      boot.js (eigenes Boot am Anleger: an Bord gehen, aufs Wasser tippen, hinfahren, anlegen), party.js (Mittanzen bei der Pool-Party von Nicky Beach),
                      tagesserie.js (Tagesbonus 7 Tage, Tag 7 Ikone), freundinnen.js (Boutiquen besuchen, Bonus über die Datenbank),
                      events.js (Flash-Sale, Happy Hour, Promi-Sichtung, Rabattpreise)
src/ui/               Setcard, Ranking, Abstimmung, Chat mit News, wohin.js (Zielliste aller Orte), traum.js (nächstes Statusziel oben), einfuehrung.js (erste Schritte), Startbildschirm, Bedienung, foto.js (Selfie), radio.js (drei Sender)
src/konto/            Echte Konten: auf claude.ai über die Artifact-Datenbank und den Room; auf Netlify über server.js (Name und Passwort) und netlify/functions/api.mjs
src/drei/             3D-Darstellung (three.js als Modul): welt.js (Renderer, Himmel nach Spieluhr, Boden, Kamera, Antippen), haeuser.js (Häuser aus B, Solardach, Glas, Glow Tower),
                      leben.js (Menschen aus P, Autos aus CARS, Ampeln, Laternen, Palmen), taschen.js (Handtaschen in 3D), praxis.js (3D-Klinikraum), strand.js (Holzpromenade, Terrassen über dem Wasser, Pool-Party Nicky Beach), flughafen.js (Glow Airport: Landebahn, Hangar, Tower, Jets), arena.js (Luba Arena im Westen: Stadion mit LED-Fassade und Lichtshow), feuerwerk.js, wasser.js (Jachten, Hubschrauber), texturen.js. Zeichnet nur; die Logik bleibt in frame(). Innenräume zeichnet weiter 2D.
autos/3d/             Blender-Automodelle als Base64-GLB-Text (.glb wird beim Veröffentlichen nicht angenommen)
src/los.js            Startet die Spielschleife, immer als letztes Modul
autos/                Gerenderte Bilder: Autohaus, Stadt-Sprites, Boote
werkzeug/             Blender-Skripte für Autos und Boote
archiv/               Was nicht mehr gebraucht wird, mit Datum im Dateinamen
```

Alle Module sind klassische Skripte mit gemeinsamem globalem Bereich. Die Reihenfolge der `<script>`-Tags in `index.html` zählt: Ein Modul darf beim Laden nur Funktionen aufrufen, die in ihm selbst oder davor stehen. Alles andere erst zur Laufzeit (Klick, Spielschleife).

## Wie Module miteinander reden

- Spielstand liegt in `ST`, gespeichert mit `save()`; `hud()` und `karten()` zeichnen Leiste und Setcard neu.
- Was passiert, meldet ein Modul mit `ereignis(typ, daten)` (kauf, betreten, fahren, vote, chat, arbeit, foto). Aufgaben und Erfolge hören darauf. Neue Aufgabe = Eintrag in `AUFGABEN_POOL`.
- Preise immer über `preisVon(it)`, damit Rabatte aus Events greifen.
- Große Meldungen über `banner(kopf, text, lohn)`, kleine über `toast(text)`, Stadt-News über `news(text)`.

## Der tägliche Kreislauf

Der Kern, der Spielerinnen jeden Tag zurückholt, ist die Boutique: Ware einräumen (1 Min. bis 12 Std., echte Zeit), wiederkommen, abholen, Kasse leeren, bevor sie voll ist, ausbauen. Jeder Verkauf gibt XP für das Glow-Level und kann eine Tasche fürs Kollektion bringen (spätestens nach 8 Verkäufen). Komplette Sets geben dauerhaft mehr Erlös. Neue Ware, Taschen oder Sets sind nur Einträge in `src/daten/boutique.js`. Keine Glückskisten gegen echtes Geld.

## Regeln

- **Neue Inhalte nur in `src/daten/`.** Ein neues Auto, eine Tasche, ein Laden oder eine Figur ist ein Eintrag in den Daten, kein neuer Code. `rang` lässt Lücken (100, 200 …), damit später etwas dazwischen passt.
- **Ändern statt daneben bauen.** Eine Funktion wird an ihrer Stelle angepasst. Keine Kopien wie `zeichne2`, keine Dateinamen mit v2, neu, alt, final.
- **Altes ins Archiv.** Was ersetzt wird, kommt im selben Schritt nach `archiv/` mit Datum (`JJJJ-MM-TT name`), oder wird gelöscht, wenn Git es ohnehin hat.
- **Kommentare in langen Einzeilern nur als `/* … */`.** Ein `//` mitten in der Zeile schneidet allen Code dahinter ab (17.11.2026: Wasser verschwand).
- **Gegenstand geht nie durch Gegenstand** (Martin, 17.11.2026): Figuren laufen um Möbel herum, Fahrzeuge stehen frei.
- **Ein Modul, ein Thema.** Wird eine Datei größer als etwa 400 Zeilen, wird sie nach Thema geteilt.
- **Jede Änderung testen, bevor sie live geht:** alle Module einzeln laden (Skript in `werkzeug/pruefen.sh`), dann im Browser ansehen.
- **Marken:** erkennbare Anlehnung mit geändertem Namen (Martins Entscheidung). Kein Nachbau geschützter Spiele, Logos oder Figuren, auch nicht von Vice City. Der 80er-Miami-Stil ist frei.
- **Konten:** Spielstand liegt in der Datenbank-Sammlung `spieler/<id>`, jede Person schreibt nur ihr eigenes Dokument. Bewohner sind als NPC gekennzeichnet, echte Spielerinnen als LIVE.

## Veröffentlichen

`index.html` als Seite, alle Dateien aus `src/` und die benötigten Bilder aus `autos/` als `files`. Die Fähigkeiten `db`, `user`, `room` bleiben erhalten, solange `capabilities` beim Veröffentlichen weggelassen wird.

## Welten (Ziel: neue Welt per Kopie)

Glow City (Miami-Stil) ist die erste Welt. Später kommen weitere, zum Beispiel Las Vegas oder ein ganz anderes Thema. Deshalb gilt:

- **Spiellogik ist weltunabhängig.** Klinik, Boutique, Kongresse, Konten, Chat und Wirtschaft kennen keine Ortsnamen.
- **Alles Weltspezifische steht in Daten.** Stadtplan, Marken und Läden, Namen der Bewohner, Farben, Himmel und Wasser, Orte der Zielliste (`src/ui/wohin.js`), Kongressorte, News-Sätze. Nächster Umbau: diese Teile in einen Ordner `src/welten/<welt>/` ziehen, eine Welt wählt man über eine Zeile in `index.html`.
- **Server pro Welt getrennt.** Spielstände, Spielerliste und Chat bekommen einen Weltnamen als Vorsatz im Speicher, damit Welten sich nicht mischen.
- **Tempo (17.11.2026, Spiel wurde unfassbar langsam):** In der Stadt höchstens 8 echte Lichtquellen (PointLight). Neue Laternen, Flutlichter, Schilder nur leuchtend (emissive), ohne eigenes Licht. Deko-Autos ohne Schatten. Spiegelwasser aus. Kein Bloom-Leuchteffekt (gemessen 21 statt 59 Bilder pro Sekunde). Tempo messen: Seite mit ?fps öffnen.
- **Für 100 Spieler gleichzeitig:** Spielerliste und Chat kommen aus dem Netlify-Zwischenspeicher (Funktion höchstens alle paar Sekunden), Spielstand nur bei Änderung und höchstens alle 20 Sekunden, verdeckte Tabs fragen nicht nach.

## Fahrplan ab 17.11.2026

1. Klinik auf 50 %: mehr Behandlungsspiele, Räume sichtbar ausbauen, Kundinnen mit Geschichten und Wiederkehr, Teamführung, Klinik-Ranking und Besuche zwischen echten Spielerinnen.
2. Grafik: Wasser und Licht, Gebäude-Details, Klinikraum in 3D schöner.
3. Miteinander: echte Spielerinnen sehen, ansprechen, beschenken, Wettbewerbe unter Kliniken.
4. Welten-Umbau wie oben, dann eine zweite Welt als Probe.
