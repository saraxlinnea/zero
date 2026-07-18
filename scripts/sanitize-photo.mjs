import { rename, unlink } from "node:fs/promises";
import { dirname, extname, join, basename } from "node:path";
import sharp from "sharp";

async function sanitizePhoto(filePath) {
  const ext = extname(filePath);
  const tempPath = join(
    dirname(filePath),
    `.${basename(filePath, ext)}.sanitized-${process.pid}${ext}`,
  );

  try {
    await sharp(filePath)
      .rotate()
      .toColourspace("srgb")
      .jpeg({
        quality: 92,
        chromaSubsampling: "4:4:4",
        mozjpeg: true,
      })
      .toFile(tempPath);

    const metadata = await sharp(tempPath).metadata();
    if (metadata.exif || metadata.xmp || metadata.iptc) {
      throw new Error(`Metadata remained after sanitizing ${filePath}`);
    }

    await rename(tempPath, filePath);
  } catch (error) {
    await unlink(tempPath).catch(() => {});
    throw error;
  }
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error("Usage: node scripts/sanitize-photo.mjs <photo.jpg> [...]");
  process.exit(1);
}

for (const file of files) {
  await sanitizePhoto(file);
}

console.log(`Sanitized ${files.length} photo${files.length === 1 ? "" : "s"}.`);
