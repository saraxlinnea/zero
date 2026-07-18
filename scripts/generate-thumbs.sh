#!/usr/bin/env bash
# Generate thumbs from existing public/photos/*.jpg (no re-import from Photos/).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/photos"
THUMBS="$OUT/thumbs"
THUMB_EDGE=480
JPEG_QUALITY=best

mkdir -p "$THUMBS"

for out in "$OUT"/*.jpg; do
  [ -f "$out" ] || continue
  stem=$(basename "$out")
  thumb="$THUMBS/$stem"
  sips -Z "$THUMB_EDGE" -s format jpeg -s formatOptions "$JPEG_QUALITY" "$out" --out "$thumb" >/dev/null
  node "$ROOT/scripts/sanitize-photo.mjs" "$thumb" >/dev/null
  tkb=$(du -k "$thumb" | cut -f1)
  echo "Thumb ${stem} (${tkb}KB)"
done

echo "Done. $(ls "$THUMBS"/*.jpg 2>/dev/null | wc -l | tr -d ' ') thumbs in public/photos/thumbs/"
