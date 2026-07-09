const MIN_FOOTPRINTS = 28;
const SPAWN_MIN_PX = 30;
const SPAWN_MAX_PX = 55;
const WAVE_FREQ = 0.72;
const ANCHOR_RATIO = 0.5;
const WAVE_LEAN = 10;
const BASE_X_RATIO = 0.78;
const WAVE_AMP_BASE = 22;
const WAVE_AMP_MAX = 58;
const FOOT_SPREAD = 20;
const FOOT_STAGGER = 24;
const VALID_MODES = new Set(["default", "palmistry", "tracker", "map"]);

const PEAK_OPACITY = {
  default: 0.3,
  palmistry: 0.38,
  tracker: 0.26,
  map: 0.32,
};

const isMobile =
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 600px), (pointer: coarse)").matches;

const MAX_FOOTPRINTS_CAP = isMobile ? 100 : 160;
const FADE_START_MS = isMobile ? 1_400 : 2_500;
const FADE_DURATION_MS = isMobile ? 2_400 : 4_500;
const FADE_STAGGER_MS = isMobile ? 90 : 150;

let layer = null;
let mode = "default";
let lastScrollY = 0;
let lastDocumentY = null;
let accumulatedDelta = 0;
let nextSpawnAt = randomSpawnThreshold();
let footprints = [];
let spawnIndex = 0;
let rafId = null;
let scrollPending = false;
let initialized = false;

function randomSpawnThreshold() {
  const progress = getScrollProgress();
  const scale = 1 - progress * 0.35;
  return (SPAWN_MIN_PX + Math.random() * (SPAWN_MAX_PX - SPAWN_MIN_PX)) * scale;
}

function getScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) return 0;
  return Math.min(1, Math.max(0, scrollTop / scrollHeight));
}

function getMaxFootprints() {
  const progress = getScrollProgress();
  return Math.round(MIN_FOOTPRINTS + progress * (MAX_FOOTPRINTS_CAP - MIN_FOOTPRINTS));
}

/** North (top of paw art) points along movement vector (dx, dy). */
function movementRotation(dx, dy) {
  return (Math.atan2(dx, -dy) * 180) / Math.PI;
}

function repositionFootprints() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  for (const fp of footprints) {
    fp.el.style.top = `${fp.documentY - scrollY}px`;
  }
}

function placeFootprint(documentX, documentY, rotation, scale) {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const el = document.createElement("div");
  el.className = `footprint footprint-${mode}`;
  el.style.left = `${documentX}px`;
  el.style.top = `${documentY - scrollY}px`;
  el.style.setProperty("--fp-rot", `${rotation}deg`);
  el.style.setProperty("--fp-scale", String(scale));

  layer.appendChild(el);
  footprints.push({
    el,
    created: Date.now(),
    documentX,
    documentY,
    peak: PEAK_OPACITY[mode] ?? 0.3,
  });
}

function spawnFootprintPair(direction, stepPx) {
  if (!layer) return;

  spawnIndex += 1;
  const progress = getScrollProgress();
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const waveAmp = WAVE_AMP_BASE + progress * (WAVE_AMP_MAX - WAVE_AMP_BASE);
  const phase = spawnIndex * WAVE_FREQ;
  const waveX = Math.sin(phase) * waveAmp;
  const centerX = vw * BASE_X_RATIO + waveX;

  // Anchor each print to the scroll position so the trail spans the whole
  // scrolled region instead of drifting into a short viewport band.
  const documentY = scrollY + vh * ANCHOR_RATIO;
  lastDocumentY = documentY;

  // Vertical travel (real scroll distance) dominates the heading so paws point
  // along movement both up and down; the wave adds only a gentle lean.
  const dy = stepPx * direction;
  const dx = Math.cos(phase) * WAVE_LEAN;
  const rotation = movementRotation(dx, dy);
  const scale = 0.68 + Math.random() * 0.12;

  const len = Math.hypot(dx, dy) || 1;
  const tx = dx / len;
  const ty = dy / len;
  const perpX = -ty;
  const perpY = tx;
  const lead = FOOT_STAGGER * 0.5;

  const rightX = centerX + perpX * FOOT_SPREAD + tx * lead;
  const rightY = documentY + perpY * FOOT_SPREAD + ty * lead;
  const leftX = centerX - perpX * FOOT_SPREAD - tx * lead;
  const leftY = documentY - perpY * FOOT_SPREAD - ty * lead;

  placeFootprint(rightX, rightY, rotation, scale);
  placeFootprint(leftX, leftY, rotation, scale * 0.96);

  const cap = getMaxFootprints();
  while (footprints.length > cap) {
    const oldest = footprints.shift();
    oldest.el.remove();
  }
}

function processScroll() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const delta = scrollY - lastScrollY;

  repositionFootprints();

  if (delta !== 0) {
    const direction = delta > 0 ? 1 : -1;
    accumulatedDelta += Math.abs(delta);
    while (accumulatedDelta >= nextSpawnAt) {
      const step = nextSpawnAt;
      accumulatedDelta -= nextSpawnAt;
      spawnFootprintPair(direction, step);
      nextSpawnAt = randomSpawnThreshold();
    }
  }

  lastScrollY = scrollY;
}

function updateFootprintOpacity() {
  const now = Date.now();
  const ordered = [...footprints].sort((a, b) => a.created - b.created);

  for (let i = 0; i < ordered.length; i++) {
    const fp = ordered[i];
    const age = now - fp.created;
    const fadeStart = FADE_START_MS + i * FADE_STAGGER_MS;

    if (age < fadeStart) continue;

    const fadeT = Math.min(1, (age - fadeStart) / FADE_DURATION_MS);
    fp.el.style.opacity = String(fp.peak * (1 - fadeT));

    if (fadeT >= 1) fp.el.remove();
  }

  footprints = footprints.filter((fp) => fp.el.isConnected);
}

function loop() {
  if (scrollPending) {
    scrollPending = false;
    processScroll();
  } else {
    repositionFootprints();
  }
  updateFootprintOpacity();
  rafId = requestAnimationFrame(loop);
}

function onScroll() {
  scrollPending = true;
}

export function setFootprintMode(newMode) {
  if (VALID_MODES.has(newMode)) mode = newMode;
}

export function clearFootprints() {
  for (const fp of footprints) fp.el.remove();
  footprints = [];
  accumulatedDelta = 0;
  spawnIndex = 0;
  lastDocumentY = null;
}

export function getFootprintMode() {
  return mode;
}

export function getFootprintProgress() {
  return getScrollProgress();
}

export function initFootprintSystem(options = {}) {
  if (initialized) return;
  initialized = true;

  layer = document.getElementById("footprint-layer");
  if (!layer) {
    console.warn("footprint-system: #footprint-layer not found");
    return;
  }

  mode = VALID_MODES.has(options.mode) ? options.mode : "default";
  lastScrollY = window.scrollY || document.documentElement.scrollTop;

  window.addEventListener("scroll", onScroll, { passive: true });
  rafId = requestAnimationFrame(loop);
}
