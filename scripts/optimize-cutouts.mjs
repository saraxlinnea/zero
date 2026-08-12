import sharp from "sharp";
import { readdirSync, statSync, mkdirSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "cutout-photos");
const outDir = join(root, "public", "cutouts");
const albedoAssetDir = join(root, "src", "assets", "albedo");

/**
 * Output name → max width (display size × ~2 for retina).
 * More specific matches first. Albedo map stamps stay small for canvas batching.
 * Albedo stamps write to src/assets/albedo/ (Vite-bundled). Site cutouts stay in public/cutouts/.
 */
const CUTOUTS = [
  // Albedo map stamps (Subject extracts already have transparency)
  { match: /^Subject\.png$/i, out: "albedo-zero-1.png", maxWidth: 96, assetDir: true },
  { match: /^Subject 2\.png$/i, out: "albedo-zero-2.png", maxWidth: 96, assetDir: true },
  { match: /^Subject 3\.png$/i, out: "albedo-zero-3.png", maxWidth: 96, assetDir: true },
  { match: /^Subject 4\.png$/i, out: "albedo-zero-4.png", maxWidth: 96, assetDir: true },
  { match: /^Subject 5\.png$/i, out: "albedo-zero-5.png", maxWidth: 96, assetDir: true },
  { match: /^Subject 6\.png$/i, out: "albedo-zero-6.png", maxWidth: 96, assetDir: true },
  { match: /^happy-dog\.png$/i, out: "albedo-zero-face.png", maxWidth: 120, removeBlack: true, assetDir: true },

  // Site cutouts
  { match: /^happy-dog\.png$/i, out: "happy-dog.png", maxWidth: 480 },
  { match: /^Subject 4\.png$/i, out: "zero-mode-play.png", maxWidth: 640 },
  { match: /^Subject 2\.png$/i, out: "zero-mode-investigate.png", maxWidth: 420 },
  { match: /^Subject 5\.png$/i, out: "zero-mode-sleepy.png", maxWidth: 640 },
  { match: /^Subject\.png$/i, out: "zero-mode-show.png", maxWidth: 400 },
  { match: /zero_paw|pawmistry/i, out: "pawmistry-paw.png", maxWidth: 360, removeWhite: true },
  { match: /happy-zero-face/i, out: "zero-happy-face.png", maxWidth: 200, removeWhite: true },
  { match: /running/i, out: "zero-running.png", maxWidth: 280 },
  { match: /head-massage|massage/i, out: "zero-head-massage.png", maxWidth: 300 },
  { match: /dirty/i, out: "dirty-zero.png", maxWidth: 440 },
];

function isNearWhite(r, g, b, tolerance) {
  return r >= 255 - tolerance && g >= 255 - tolerance && b >= 255 - tolerance;
}

function isNearBlack(r, g, b, tolerance) {
  return r <= tolerance && g <= tolerance && b <= tolerance;
}

/** Flood-fill background from image edges; keeps interior white fur. */
function floodFillBackground(data, width, height, { isBg, tolerance }) {
  const size = width * height;
  const bg = new Uint8Array(size);
  const queue = [];

  const trySeed = (x, y) => {
    const idx = y * width + x;
    const i = idx * 4;
    if (isBg(data[i], data[i + 1], data[i + 2], tolerance)) queue.push(idx);
  };

  for (let x = 0; x < width; x++) {
    trySeed(x, 0);
    trySeed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    trySeed(0, y);
    trySeed(width - 1, y);
  }

  while (queue.length) {
    const idx = queue.pop();
    if (bg[idx]) continue;
    const x = idx % width;
    const y = (idx / width) | 0;
    const i = idx * 4;
    if (!isBg(data[i], data[i + 1], data[i + 2], tolerance)) continue;
    bg[idx] = 1;
    data[i + 3] = 0;
    if (x > 0) queue.push(idx - 1);
    if (x < width - 1) queue.push(idx + 1);
    if (y > 0) queue.push(idx - width);
    if (y < height - 1) queue.push(idx + width);
  }
}

async function removeBackground(inputPath, { mode = "white", tolerance = 22 } = {}) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buf = Buffer.from(data);
  floodFillBackground(buf, info.width, info.height, {
    isBg: mode === "black" ? isNearBlack : isNearWhite,
    tolerance: mode === "black" ? Math.max(tolerance, 28) : tolerance,
  });

  return sharp(buf, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function findSource(name) {
  const files = readdirSync(srcDir).filter((f) => statSync(join(srcDir, f)).isFile());
  return files.find((f) => name.test(f));
}

async function optimizeCutout({ match, out, maxWidth, removeWhite, removeBlack, assetDir }) {
  const srcName = findSource(match);
  if (!srcName) {
    console.warn(`  skip ${out}: no source matching ${match}`);
    return;
  }

  const srcPath = join(srcDir, srcName);
  const destDir = assetDir ? albedoAssetDir : outDir;
  const outPath = join(destDir, out);
  let pipeline;

  if (removeWhite || removeBlack) {
    const buf = await removeBackground(srcPath, {
      mode: removeBlack ? "black" : "white",
      tolerance: removeBlack ? 30 : 22,
    });
    pipeline = sharp(buf).resize({ width: maxWidth, withoutEnlargement: true });
  } else {
    pipeline = sharp(srcPath).ensureAlpha().resize({ width: maxWidth, withoutEnlargement: true });
  }

  await pipeline.png({ compressionLevel: 9 }).toFile(outPath);
  const meta = await sharp(outPath).metadata();
  const kb = Math.round(statSync(outPath).size / 1024);
  const where = assetDir ? "src/assets/albedo" : "public/cutouts";
  console.log(`  ${srcName} → ${where}/${out} (${meta.width}×${meta.height}, ${kb}KB)`);
}

console.log("Optimizing cutouts…");
mkdirSync(albedoAssetDir, { recursive: true });
mkdirSync(outDir, { recursive: true });
for (const spec of CUTOUTS) {
  await optimizeCutout(spec);
}
console.log("Done.");
