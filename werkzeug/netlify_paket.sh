#!/bin/sh
# Baut FINAL/glow-city.zip für Netlify. Claude setzt beim Veröffentlichen den Seitenrahmen (doctype, charset, viewport) selbst,
# Netlify nicht: deshalb bekommt die index.html im Paket hier ihren vollständigen Rahmen. Ohne ihn läuft der Browser im Quirks-Modus.
# Dazu die Regel, dass [hidden] immer unsichtbar ist (setzt Claude ebenfalls), sonst stehen Klinik- und Boutique-Leisten über dem Start.
cd "$(dirname "$0")/.." || exit 1
T=$(mktemp -d); cp -R src autos autohaus.html figuren.html wirtschaft.html admin.html vorschau.jpg "$T"/
# Saubere Fassung: Titel einmal im Kopf, Rest im Körper
python3 - "$T" <<'PY'
import sys,re
t=sys.argv[1]; s=open('index.html').read()
titel=re.search(r'<title>.*?</title>',s).group(0); rest=s.replace(titel,'',1)
open(t+'/index.html','w').write('<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<style>html,body{margin:0;padding:0}[hidden]:not(#_a):not(#_b){display:none}</style>\n'+titel+'\n<meta name="description" content="Bau deine eigene Beauty-Klinik in einer Neon-Stadt am Meer. Spiel mit Freundinnen, werde zur Star-Ärztin.">\n<meta property="og:title" content="Glow City · Werde zur Star-Ärztin">\n<meta property="og:description" content="Klinik, Boutique, Yachten, Partys. Kostenlos im Browser, mit Freundinnen.">\n<meta property="og:image" content="https://glow-city.netlify.app/vorschau.jpg">\n<meta property="og:url" content="https://glow-city.netlify.app/">\n<meta name="twitter:card" content="summary_large_image">\n</head>\n<body>\n'+rest+'\n</body>\n</html>\n')
PY
find "$T" -name .DS_Store -delete
mkdir -p FINAL; rm -f FINAL/glow-city.zip; (cd "$T" && zip -qr - .) > FINAL/glow-city.zip
# Für den Upload mit Server (netlify deploy): derselbe Inhalt als Ordner FINAL/seite, Funktionen kommen aus netlify/functions
rm -rf FINAL/seite; mv "$T" FINAL/seite; echo "FERTIG FINAL/glow-city.zip und FINAL/seite"
