import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "cutout-photos");
const outDir = join(root, "public", "cutouts");

/** Output name → max width (display size × ~2 for retina). */
const CUTOUTS = [
  { match: /happy/i, out: "zero-happy-face.png", maxWidth: 200, removeWhite: true },
  { match: /running/i, out: "zero-running.png", maxWidth: 280 },
  { match: /head-massage|massage/i, out: "zero-head-massage.png", maxWidth: 300 },
  { match: /dirty/i, out: "dirty-zero.png", maxWidth: 440 },
];

function isNearWhite(r, g, b, tolerance) {
  return r >= 255 - tolerance && g >= 255 - tolerance && b >= 255 - tolerance;
}

/** Flood-fill background from image edges; keeps interior white fur. */
function floodFillBackground(data, width, height, tolerance) {
  const size = width * height;
  const bg = new Uint8Array(size);
  const queue = [];

  const trySeed = (x, y) => {
    const idx = y * width + x;
    const i = idx * 4;
    if (isNearWhite(data[i], data[i + 1], data[i + 2], tolerance)) queue.push(idx);
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
    if (!isNearWhite(data[i], data[i + 1], data[i + 2], tolerance)) continue;
    bg[idx] = 1;
    data[i + 3] = 0;
    if (x > 0) queue.push(idx - 1);
    if (x < width - 1) queue.push(idx + 1);
    if (y > 0) queue.push(idx - width);
    if (y < height - 1) queue.push(idx + width);
  }
}

async function removeWhiteBackground(inputPath, tolerance = 22) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buf = Buffer.from(data);
  floodFillBackground(buf, info.width, info.height, tolerance);

  return sharp(buf, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
}

function findSource(name) {
  const files = readdirSync(srcDir).filter((f) => statSync(join(srcDir, f)).isFile());
  return files.find((f) => name.test(f));
}

async function optimizeCutout({ match, out, maxWidth, removeWhite }) {
  const srcName = findSource(match);
  if (!srcName) {
    console.warn(`  skip ${out}: no source matching ${match}`);
    return;
  }

  const srcPath = join(srcDir, srcName);
  const outPath = join(outDir, out);
  let pipeline;

  if (removeWhite) {
    const buf = await removeWhiteBackground(srcPath);
    pipeline = sharp(buf).resize({ width: maxWidth, withoutEnlargement: true });
  } else {
    pipeline = sharp(srcPath).resize({ width: maxWidth, withoutEnlargement: true });
    if (extname(srcName).toLowerCase() === ".png") {
      pipeline = pipeline.png({ compressionLevel: 9, palette: true });
    }
  }

  await pipeline.png({ compressionLevel: 9, palette: true }).toFile(outPath);
  const meta = await sharp(outPath).metadata();
  const kb = Math.round(statSync(outPath).size / 1024);
  console.log(`  ${srcName} → ${out} (${meta.width}×${meta.height}, ${kb}KB)`);
}

console.log("Optimizing cutouts…");
for (const spec of CUTOUTS) {
  await optimizeCutout(spec);
}
console.log("Done.");
