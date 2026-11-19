// Berlin · zufall.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Zufall ----------
let s0=11;const R=()=>((s0=Math.imul(s0^s0>>>15,2246822507)^Math.imul(s0^s0>>>13,3266489909))>>>0)/4294967296;
const pick=a=>a[Math.floor(R()*a.length)];
