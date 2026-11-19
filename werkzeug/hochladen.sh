#!/bin/sh
# Berlin hochladen (kostenlos über GitHub, nach ca. 1 Minute live auf https://berlin-city.netlify.app).
# Stempelt alle Skripte in index.html mit einer neuen Versionsnummer (?v=…), damit kein Browser alte Dateien festhält.
# Offene Spiele merken die neue Nummer innerhalb einer Minute und laden sich selbst neu. Aufruf: sh werkzeug/hochladen.sh "Was geändert wurde"
cd "$(dirname "$0")/.." || exit 1
git pull -q --rebase --autostash || exit 1
V=$(date +%s)
python3 - "$V" <<'PY'
import re,sys
v=sys.argv[1];p='index.html';s=open(p).read()
s=re.sub(r'(src="src/[^"?]+\.js)(\?v=\d+)?"',lambda m:m.group(1)+'?v='+v+'"',s)
s=re.sub(r'<meta name="berlin-version" content="\d+">','<meta name="berlin-version" content="'+v+'">',s)
open(p,'w').write(s)
import glob
for f in glob.glob('src/**/*.js',recursive=True):
  t=open(f).read();n=re.sub(r"(from\s+'\./[^'?]+\.js)(\?v=\d+)?'",lambda m:m.group(1)+'?v='+v+"'",t)
  if n!=t:open(f,'w').write(n)
PY
sh werkzeug/pruefen.sh | tail -1
git add -A && git commit -qm "${1:-Update} (Version $V)" && git push -q && echo "HOCHGELADEN, Version $V"
