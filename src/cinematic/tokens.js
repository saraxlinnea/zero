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
  display: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  body: "'Source Serif 4', 'EB Garamond', Georgia, serif",
  meta: "'Source Serif 4', Georgia, serif",
};

/**
 * Shared ambient field. Page background stays the same across tabs;
 * tab accents live on the tab titles only.
 */
export const MOODS = {
  default: {
    base: "#FAF6ED",
    washOpacity: 0.5,
    textureOpacity: 0.4,
    warm: { color: "rgba(212, 149, 106, 0.24)", x: 50, y: 26 },
    cool: { color: "rgba(155, 138, 184, 0.1)", x: 82, y: 78 },
  },
};

export function getMood() {
  return MOODS.default;
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
