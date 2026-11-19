#!/bin/sh
# Lädt alle Module aus index.html einzeln in der richtigen Reihenfolge (wie der Browser) und lässt die Spielschleife laufen.
cd "$(dirname "$0")/.." && node -e "
require('./werkzeug/test/dom-attrappe.js');global.MutationObserver=class{observe(){}};const ce=global.document.createElement;global.document.createElement=()=>Object.assign(ce(),{width:0,height:0});
const vm=require('vm'),fs=require('fs');const srcs=[...fs.readFileSync('index.html','utf8').matchAll(/<script src=\"([^\"]+)\"><\/script>/g)].map(m=>m[1].split("?")[0]);
for(const f of srcs){try{vm.runInThisContext(fs.readFileSync(f,'utf8'),{filename:f})}catch(e){console.log('FEHLER in',f,':',e.message);process.exit(1)}}
setTimeout(()=>{try{vm.runInThisContext('for(let k=0;k<3;k++)frame(100+k*16);for(const b of B){betreten(b);frame(300);verlassen()};ranking();abstimmung();karten();');console.log('OK:',srcs.length,'Module geladen, Spiel läuft')}catch(e){console.log('FEHLER zur Laufzeit:',e.message);process.exit(1)}process.exit(0)},300)"
