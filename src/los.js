// Berlin · los.js · startet die Spielschleife, nachdem alle Module geladen sind
aufgabenZaehler();setInterval(()=>{if(!document.getElementById('start').hidden)return;karten()},20000);setTimeout(erfolgePruefen,4000);
requestAnimationFrame(frame);
