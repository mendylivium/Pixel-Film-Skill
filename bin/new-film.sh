#!/usr/bin/env bash
# Makes a new pixel short film project from the template.
#   ~/.claude/skills/pixel-film/bin/new-film.sh <folder>
# Then: cd <folder> && npm run studio
set -euo pipefail
DEST=${1:?usage: new-film.sh <folder>}
SKILL=$(cd "$(dirname "$0")/.." && pwd)
if [ -e "$DEST" ] && [ -n "$(ls -A "$DEST" 2>/dev/null)" ]; then
  echo "$DEST exists and is not empty; pick a new folder" >&2
  exit 1
fi
mkdir -p "$DEST"
cp -R "$SKILL/template/." "$DEST/"
cd "$DEST"
npm install --no-audit --no-fund
node scripts/make-music.mjs
node scripts/make-sfx.mjs
npx tsc --noEmit -p .
echo
echo "Ready: $(pwd)"
echo "  npm run studio      preview (pick the Film composition; CharSheet shows every person and pose)"
echo "  npm run stills 100 500 900   check framing"
echo "  npm run render      → out/film.mp4 (needs --gl=swangle without a GPU; the script has it)"
