#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/Photos"
OUT="$ROOT/public/photos"
MAX_EDGE=2000
JPEG_QUALITY=best

mkdir -p "$OUT"
rm -f "$OUT"/*.jpg

echo "Selecting sources from Photos/..."
while IFS=$'\t' read -r src stem taken; do
  out="$OUT/${stem}.jpg"
  sips -Z "$MAX_EDGE" -s format jpeg -s formatOptions "$JPEG_QUALITY" "$src" --out "$out" >/dev/null
  if [ -n "$taken" ]; then
    node "$ROOT/scripts/photo-utils.mjs" apply-date "$out" "$taken"
  fi
  kb=$(du -k "$out" | cut -f1)
  echo "Converted $(basename "$src") → ${stem}.jpg (${kb}KB)"
done < <(node "$ROOT/scripts/photo-utils.mjs" list-sources "$SRC")

node "$ROOT/scripts/generate-photo-manifest.mjs"
count=$(ls "$OUT"/*.jpg 2>/dev/null | wc -l | tr -d ' ')
echo "Done. ${count} photos in public/photos/ (max ${MAX_EDGE}px, quality ${JPEG_QUALITY})."
