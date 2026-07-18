import { execSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const IMAGE_EXT = new Set([".heic", ".jpeg", ".jpg"]);
const VIDEO_EXT = new Set([".mov", ".mp4", ".m4v"]);
const EXT_PRIORITY = [".heic", ".jpeg", ".jpg"];

export function normalizeStem(filename) {
  return filename.replace(/\.[^.]+$/i, "").replace(/ 2$/, "");
}

export function isVideo(name) {
  return VIDEO_EXT.has(extname(name).toLowerCase());
}

export function isImage(name) {
  return IMAGE_EXT.has(extname(name).toLowerCase());
}

export function getTakenDate(filePath) {
  const out = execSync(`sips -g creation "${filePath}"`, { encoding: "utf8" });
  const match = out.match(/creation:\s*(.+)/);
  if (match && match[1].trim() !== "<nil>") {
    const [datePart, timePart] = match[1].trim().split(" ");
    return `${datePart.replace(/:/g, "-")}T${timePart}`;
  }

  const stats = statSync(filePath);
  const fallback = stats.birthtimeMs > 0 ? stats.birthtime : stats.mtime;
  if (Number.isNaN(fallback.getTime())) return null;

  const pad = (value) => String(value).padStart(2, "0");
  return `${fallback.getFullYear()}-${pad(fallback.getMonth() + 1)}-${pad(fallback.getDate())}T${pad(fallback.getHours())}:${pad(fallback.getMinutes())}:${pad(fallback.getSeconds())}`;
}

export function applyCreationDate(filePath, iso) {
  const [date, time] = iso.split("T");
  const [y, m, d] = date.split("-");
  const [h, mi, s = "00"] = time.split(":");
  const touchStamp = `${y}${m}${d}${h}${mi}.${s.padStart(2, "0").slice(0, 2)}`;
  execSync(`touch -t ${touchStamp} "${filePath}"`);
}

export function selectSources(srcDir) {
  const skipped = { video: [], nonImage: [], duplicate: [] };
  const groups = new Map();

  for (const name of readdirSync(srcDir)) {
    const path = join(srcDir, name);
    if (!statSync(path).isFile()) continue;

    if (isVideo(name)) {
      skipped.video.push(name);
      continue;
    }
    if (!isImage(name)) {
      skipped.nonImage.push(name);
      continue;
    }

    const stem = normalizeStem(name);
    const fileStem = name.replace(/\.[^.]+$/i, "");
    const isDupCopy = / 2$/i.test(fileStem);

    if (!groups.has(stem)) groups.set(stem, []);
    groups.get(stem).push({ name, path, isDupCopy, ext: extname(name).toLowerCase() });
  }

  const selected = [];

  for (const [stem, candidates] of groups) {
    const hasPrimary = candidates.some((c) => !c.isDupCopy);
    let pool = hasPrimary ? candidates.filter((c) => !c.isDupCopy) : candidates;

    for (const c of candidates) {
      if (c.isDupCopy && hasPrimary) skipped.duplicate.push(c.name);
    }

    pool.sort((a, b) => {
      const ai = EXT_PRIORITY.indexOf(a.ext);
      const bi = EXT_PRIORITY.indexOf(b.ext);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    const pick = pool[0];
    if (!pick) continue;

    for (const c of pool.slice(1)) {
      skipped.duplicate.push(c.name);
    }

    const taken = getTakenDate(pick.path);
    selected.push({
      stem,
      source: pick.path,
      sourceName: pick.name,
      outName: `${stem}.jpg`,
      taken,
    });
  }

  selected.sort((a, b) => a.stem.localeCompare(b.stem, undefined, { numeric: true }));
  return { selected, skipped };
}

export function getSourceDateForOutput(srcDir, outFileName) {
  const stem = outFileName.replace(/\.[^.]+$/i, "");
  const { selected } = selectSources(srcDir);
  const match = selected.find((s) => s.stem === stem);
  if (match?.taken) return match.taken;
  return null;
}

function printSkipped(skipped) {
  if (skipped.video.length) {
    console.error(`Skipped ${skipped.video.length} video(s): ${skipped.video.join(", ")}`);
  }
  if (skipped.nonImage.length) {
    console.error(`Skipped ${skipped.nonImage.length} non-image file(s): ${skipped.nonImage.join(", ")}`);
  }
  if (skipped.duplicate.length) {
    console.error(`Skipped ${skipped.duplicate.length} duplicate(s): ${skipped.duplicate.join(", ")}`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const cmd = process.argv[2];

  if (cmd === "list-sources") {
    const srcDir = process.argv[3] || join(process.cwd(), "Photos");
    const { selected, skipped } = selectSources(srcDir);
    printSkipped(skipped);
    for (const item of selected) {
      process.stdout.write(`${item.source}\t${item.stem}\t${item.taken ?? ""}\n`);
    }
  } else if (cmd === "apply-date") {
    const filePath = process.argv[3];
    const iso = process.argv[4];
    if (!filePath || !iso) {
      console.error("Usage: photo-utils.mjs apply-date <file> <iso-datetime>");
      process.exit(1);
    }
    applyCreationDate(filePath, iso);
  }
}
