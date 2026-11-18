#!/bin/sh
# Lädt das fertige Spiel (FINAL/seite) zu GitHub Pages hoch: kostenlos, beliebig oft. glow-city.netlify.app leitet dorthin weiter.
# Nur die Server-Funktion (Konten, Chat) liegt auf Netlify und braucht dort ein Update, wenn sie sich ändert.
cd "$(dirname "$0")/.." || exit 1
sh werkzeug/netlify_paket.sh >/dev/null || exit 1
T=$(mktemp -d); cp -R FINAL/seite/. "$T"/; rm -f "$T/netlify.toml"; touch "$T/.nojekyll"
cd "$T" && git init -q -b main && git add -A && git -c user.name="Glow City" -c user.email="glowcity@users.noreply.github.com" commit -qm "Spiel $(date '+%Y-%m-%d %H:%M')" \
  && git push -q --force "https://github.com/MartinTamehWorkSpace/glow-city.git" main && echo "HOCHGELADEN zu GitHub Pages"
rm -rf "$T"
