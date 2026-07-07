/** Parallax depth tokens — higher = more movement (ambient/motion only). */
export const DEPTH = {
  none: 0,
  subtle: 0.04,
  medium: 0.12,
  deep: 0.22,
};

export const PAL = {
  cream: "#FAF6ED",
  parchment: "#F0E8D5",
  darkBrown: "#2C1A0E",
  midBrown: "#6B4226",
  lightBrown: "#A67C52",
  inkMuted: "#5C3D1E",
  rule: "#C9A97A",
  accentLight: "#D4956A",
  mastheadMuted: "#C9A97A",
};

export const FF = {
  display: "'Playfair Display', Georgia, serif",
  body: "'EB Garamond', Georgia, serif",
};

/**
 * Per-tab ambient moods. Two washes (warm/cool corners) give an uneven,
 * mottled field. Color reinforces each section's meaning; base stays cream.
 */
export const MOODS = {
  default: {
    base: "#FAF6ED",
    washOpacity: 0.5,
    textureOpacity: 0.4,
    warm: { color: "rgba(212, 149, 106, 0.24)", x: 50, y: 26 },
    cool: { color: "rgba(155, 138, 184, 0.1)", x: 82, y: 78 },
  },
  profile: {
    base: "#FAF6ED",
    washOpacity: 0.62,
    textureOpacity: 0.42,
    warm: { color: "rgba(212, 149, 106, 0.28)", x: 44, y: 22 },
    cool: { color: "rgba(34, 49, 79, 0.2)", x: 84, y: 82 },
  },
  character: {
    base: "#FBF6E8",
    washOpacity: 0.62,
    textureOpacity: 0.4,
    warm: { color: "rgba(224, 170, 96, 0.3)", x: 40, y: 22 },
    cool: { color: "rgba(212, 149, 106, 0.16)", x: 82, y: 76 },
  },
  cosmos: {
    base: "#F6F3EE",
    washOpacity: 0.66,
    textureOpacity: 0.36,
    warm: { color: "rgba(155, 138, 184, 0.26)", x: 40, y: 24 },
    cool: { color: "rgba(107, 96, 148, 0.18)", x: 82, y: 80 },
  },
  breed: {
    base: "#F7F1E4",
    washOpacity: 0.6,
    textureOpacity: 0.48,
    warm: { color: "rgba(150, 110, 66, 0.24)", x: 44, y: 26 },
    cool: { color: "rgba(107, 66, 38, 0.14)", x: 82, y: 80 },
  },
  gallery: {
    base: "#FAF7F0",
    washOpacity: 0.4,
    textureOpacity: 0.3,
    warm: { color: "rgba(212, 149, 106, 0.16)", x: 50, y: 24 },
    cool: { color: "rgba(155, 138, 184, 0.08)", x: 82, y: 80 },
  },
  records: {
    base: "#FAF5EC",
    washOpacity: 0.5,
    textureOpacity: 0.4,
    warm: { color: "rgba(196, 128, 128, 0.16)", x: 46, y: 24 },
    cool: { color: "rgba(122, 26, 26, 0.08)", x: 84, y: 82 },
  },
};

export function getMood(tab) {
  return MOODS[tab] ?? MOODS.default;
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
