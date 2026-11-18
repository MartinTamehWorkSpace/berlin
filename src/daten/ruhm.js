// Glow City · ruhm.js (Daten) · Ruhm-Stufen, Marketing-Leiter und Werbebudget
// Ruhm = Follower + Stilpunkte × 20. Je höher die Stufe, desto mehr Kundinnen (Klinik, Boutique) und desto höher deine Preise.
const RUHM = {
  STUFEN: [
    { ab: 0,       name: 'Newcomerin',         kunden: 1,    preis: 1 },
    { ab: 3000,    name: 'Local Glow',         kunden: 1.25, preis: 1.05 },
    { ab: 15000,   name: 'Micro-Influencerin', kunden: 1.55, preis: 1.1 },
    { ab: 60000,   name: 'Influencerin',       kunden: 1.95, preis: 1.15 },
    { ab: 200000,  name: 'Star-Ärztin',        kunden: 2.5,  preis: 1.2 },
    { ab: 700000,  name: 'Celebrity',          kunden: 3.2,  preis: 1.25 },
    { ab: 2500000, name: 'Ikone',              kunden: 4.2,  preis: 1.3 }
  ],
  // Marketing in sieben Stufen: Einstellung einmalig, Kosten pro Stunde in echter Zeit, kunden = mehr Zulauf
  MARKETING: [
    { name: 'Kein Marketing',                 einstellen: 0,        lohn: 0,     kunden: 1 },
    { name: 'Social-Media-Managerin',         einstellen: 1700,    lohn: 7,   kunden: 1.3 },
    { name: 'Content-Team mit Fotografin',    einstellen: 14000,    lohn: 19,   kunden: 1.6 },
    { name: 'Head of Marketing',              einstellen: 59000,   lohn: 38,   kunden: 2 },
    { name: 'Marketing-Team mit 5 Leuten',    einstellen: 190000,   lohn: 80,  kunden: 2.6 },
    { name: 'PR-Agentur',                     einstellen: 680000,  lohn: 160,  kunden: 3.3 },
    { name: 'Influencer-Kampagnen',           einstellen: 1600000,  lohn: 350,  kunden: 4.2 },
    { name: 'Globale Markenkampagne',         einstellen: 3800000, lohn: 750, kunden: 5.5 }
  ],
  // Werbebudget pro Stunde: verkürzt den Takt von 90 auf 30 Sek. (Grundtakt), das Team arbeitet noch etwas schneller
  BUDGET: [{ proStunde: 0, kunden: 1, name: 'Aus' }, { proStunde: 20, kunden: 1.3, name: 'Klein' }, { proStunde: 80, kunden: 1.7, name: 'Mittel' }, { proStunde: 300, kunden: 2.3, name: 'Groß' }, { proStunde: 1000, kunden: 3, name: 'Maximal' }]
};
const ruhmPunkte = () => Math.round((ST.follower || 0) + (ST.stil || 0) * 20);
const ruhmStufe = () => { const p = ruhmPunkte(); return RUHM.STUFEN.reduce((s, x) => p >= x.ab ? x : s, RUHM.STUFEN[0]) };
const ruhmNaechste = () => RUHM.STUFEN.find(x => x.ab > ruhmPunkte()) || null;
