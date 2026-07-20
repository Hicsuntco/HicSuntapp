#!/usr/bin/env bash
# Copie dans www/ uniquement ce que l'app native doit embarquer — le reste du
# dépôt (NOTES_*.sql, supabase-functions/, tools/, .claude/, package.json…)
# ne concerne que le web/le développement et ne doit jamais finir dans le
# binaire iOS. À lancer avant chaque `npx cap sync ios` (voir `npm run ios:sync`).
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf www
mkdir -p www

# Fichiers app à la racine (HTML/CSS/JS/manifest/icônes) — tout .html/.css/.js
# du dépôt SAUF les scripts d'outillage (aucun actuellement à la racine).
cp index.html www/
cp *.css www/
cp *.js www/
cp manifest.json www/
cp favicon.ico www/
cp apple-touch-icon.png www/
cp -r icons www/
cp -r images www/
cp privacy.html www/ 2>/dev/null || true
cp support.html www/ 2>/dev/null || true

echo "www/ prêt ($(du -sh www | cut -f1))"
