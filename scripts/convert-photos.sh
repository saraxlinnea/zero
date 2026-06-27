#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/Photos"
OUT="$ROOT/public/photos"

mkdir -p "$OUT"

for f in "$SRC"/*; do
  [ -f "$f" ] || continue
  base="$(basename "$f" | sed 's/\.[^.]*$//')"
  sips -s format jpeg "$f" --out "$OUT/${base}.jpg" >/dev/null
  echo "Converted $(basename "$f") → ${base}.jpg"
done

node "$ROOT/scripts/generate-photo-manifest.mjs"
echo "Done. $(ls "$OUT"/*.jpg 2>/dev/null | wc -l | tr -d ' ') photos in public/photos/"
