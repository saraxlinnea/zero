/** Parallax depth tokens — higher = more movement (ambient/motion only). */
export const DEPTH = {
  none: 0,
  subtle: 0.04,
  medium: 0.12,
  deep: 0.22,
};

export const PAL = {
  cream: "#F7F6F3",
  parchment: "#EDE9E0",
  darkBrown: "#1A1A18",
  midBrown: "#6B4226",
  lightBrown: "#A67C52",
  inkMuted: "#5C3D1E",
  rule: "#C9A97A",
  accentLight: "#D4956A",
  mastheadMuted: "#C9A97A",
};

export const FF = {
  display: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  body: "'Source Serif 4', 'EB Garamond', Georgia, serif",
  meta: "'Source Serif 4', 'EB Garamond', Georgia, serif",
};

/**
 * Ambient field per tab: muted cool fog + wallpaper (not loud flora).
 * Cool slate/ocean blue; cards stay parchment on top.
 */
export const MOODS = {
  default: {
    base: "#F2F5F7",
    washOpacity: 0.38,
    textureOpacity: 0.05,
    wallpaperOpacity: 0.03,
    warm: { color: "rgba(201, 169, 122, 0.04)", x: 50, y: 20 },
    cool: { color: "rgba(107, 143, 163, 0.16)", x: 70, y: 72 },
  },
  profile: {
    base: "#F2F5F7",
    washOpacity: 0.4,
    textureOpacity: 0.05,
    wallpaperOpacity: 0.03,
    warm: { color: "rgba(201, 169, 122, 0.05)", x: 30, y: 18 },
    cool: { color: "rgba(107, 143, 163, 0.18)", x: 74, y: 70 },
  },
  character: {
    base: "#F1F4F7",
    washOpacity: 0.4,
    textureOpacity: 0.05,
    wallpaperOpacity: 0.03,
    warm: { color: "rgba(201, 169, 122, 0.04)", x: 58, y: 24 },
    cool: { color: "rgba(107, 143, 163, 0.17)", x: 22, y: 76 },
  },
  cosmos: {
    base: "#EEF3F6",
    washOpacity: 0.44,
    textureOpacity: 0.055,
    wallpaperOpacity: 0.03,
    warm: { color: "rgba(201, 169, 122, 0.05)", x: 40, y: 18 },
    cool: { color: "rgba(107, 143, 163, 0.22)", x: 72, y: 68 },
  },
  breed: {
    base: "#F2F5F7",
    washOpacity: 0.38,
    textureOpacity: 0.05,
    wallpaperOpacity: 0.03,
    warm: { color: "rgba(201, 169, 122, 0.04)", x: 55, y: 18 },
    cool: { color: "rgba(107, 143, 163, 0.16)", x: 24, y: 78 },
  },
  gallery: {
    base: "#F3F6F8",
    washOpacity: 0.36,
    textureOpacity: 0.05,
    wallpaperOpacity: 0.03,
    warm: { color: "rgba(201, 169, 122, 0.04)", x: 48, y: 30 },
    cool: { color: "rgba(107, 143, 163, 0.14)", x: 78, y: 72 },
  },
  records: {
    base: "#F1F4F6",
    washOpacity: 0.38,
    textureOpacity: 0.05,
    wallpaperOpacity: 0.03,
    warm: { color: "rgba(201, 169, 122, 0.05)", x: 34, y: 26 },
    cool: { color: "rgba(107, 143, 163, 0.16)", x: 76, y: 74 },
  },
};

export function getMood(mood = "default") {
  return MOODS[mood] ?? MOODS.default;
}

/** Ease scroll progress into scene beats (0→1). */
export function sceneEase(t) {
  return t * t * (3 - 2 * t);
}

export function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}
