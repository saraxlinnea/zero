#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/Photos"
OUT="$ROOT/public/photos"
THUMBS="$OUT/thumbs"
MAX_EDGE=1400
THUMB_EDGE=480
JPEG_QUALITY=best

mkdir -p "$OUT" "$THUMBS"
rm -f "$OUT"/*.jpg "$THUMBS"/*.jpg

echo "Selecting sources from Photos/..."
while IFS=$'\t' read -r src stem taken; do
  out="$OUT/${stem}.jpg"
  thumb="$THUMBS/${stem}.jpg"
  sips -Z "$MAX_EDGE" -s format jpeg -s formatOptions "$JPEG_QUALITY" "$src" --out "$out" >/dev/null
  sips -Z "$THUMB_EDGE" -s format jpeg -s formatOptions "$JPEG_QUALITY" "$src" --out "$thumb" >/dev/null
  if [ -n "$taken" ]; then
    node "$ROOT/scripts/photo-utils.mjs" apply-date "$out" "$taken"
    node "$ROOT/scripts/photo-utils.mjs" apply-date "$thumb" "$taken"
  fi
  kb=$(du -k "$out" | cut -f1)
  tkb=$(du -k "$thumb" | cut -f1)
  echo "Converted $(basename "$src") → ${stem}.jpg (${kb}KB) + thumb (${tkb}KB)"
done < <(node "$ROOT/scripts/photo-utils.mjs" list-sources "$SRC")

node "$ROOT/scripts/generate-photo-manifest.mjs"
count=$(ls "$OUT"/*.jpg 2>/dev/null | wc -l | tr -d ' ')
echo "Done. ${count} photos in public/photos/ (max ${MAX_EDGE}px, thumbs ${THUMB_EDGE}px)."
