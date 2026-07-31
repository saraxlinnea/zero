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
 * Ambient field per tab. Quieter fog canvas; warm washes on archive objects.
 * Cosmos cool wash stays slate/ocean (not purple SaaS).
 */
export const MOODS = {
  default: {
    base: "#F7F6F3",
    washOpacity: 0.42,
    textureOpacity: 0.32,
    warm: { color: "rgba(201, 169, 122, 0.18)", x: 50, y: 26 },
    cool: { color: "rgba(107, 143, 163, 0.08)", x: 82, y: 78 },
  },
  profile: {
    base: "#F7F6F3",
    washOpacity: 0.44,
    textureOpacity: 0.34,
    warm: { color: "rgba(201, 169, 122, 0.22)", x: 28, y: 22 },
    cool: { color: "rgba(122, 155, 118, 0.1)", x: 78, y: 72 },
  },
  character: {
    base: "#F7F6F3",
    washOpacity: 0.46,
    textureOpacity: 0.32,
    warm: { color: "rgba(212, 149, 106, 0.22)", x: 62, y: 30 },
    cool: { color: "rgba(122, 155, 118, 0.12)", x: 18, y: 78 },
  },
  cosmos: {
    base: "#F3F5F7",
    washOpacity: 0.5,
    textureOpacity: 0.3,
    warm: { color: "rgba(201, 169, 122, 0.12)", x: 40, y: 20 },
    cool: { color: "rgba(74, 98, 120, 0.2)", x: 74, y: 68 },
  },
  breed: {
    base: "#F6F4EF",
    washOpacity: 0.44,
    textureOpacity: 0.34,
    warm: { color: "rgba(166, 124, 82, 0.16)", x: 55, y: 18 },
    cool: { color: "rgba(107, 143, 130, 0.12)", x: 22, y: 80 },
  },
  gallery: {
    base: "#F7F6F3",
    washOpacity: 0.4,
    textureOpacity: 0.36,
    warm: { color: "rgba(212, 149, 106, 0.14)", x: 48, y: 34 },
    cool: { color: "rgba(166, 124, 82, 0.08)", x: 80, y: 70 },
  },
  records: {
    base: "#F6F3EC",
    washOpacity: 0.42,
    textureOpacity: 0.34,
    warm: { color: "rgba(166, 124, 82, 0.18)", x: 34, y: 28 },
    cool: { color: "rgba(107, 143, 163, 0.1)", x: 76, y: 76 },
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
