const SYNODIC = 29.530588853;
const NEW_MOON = new Date("2000-01-06T18:14:00Z");

export const MOON_PHASES = [
  {
    name: "New Moon",
    symbol: "🌑",
    meaning:
      "A quiet reset. Zero naps with strategic intent, conserving energy for the next great sniffing campaign.",
  },
  {
    name: "Waxing Crescent",
    symbol: "🌒",
    meaning:
      "Momentum builds. Zero approaches new routes with optimism and an unusually confident tail carriage.",
  },
  {
    name: "First Quarter",
    symbol: "🌓",
    meaning:
      "Decisive energy. Zero chooses a direction at every fork in the trail and refuses to reconsider.",
  },
  {
    name: "Waxing Gibbous",
    symbol: "🌔",
    meaning:
      "Refinement phase. Zero rehearses tricks, polishes his smile, and audits his friend list.",
  },
  {
    name: "Full Moon",
    symbol: "🌕",
    meaning:
      "Peak visibility. Zero is convinced the entire room assembled to admire him. He is correct.",
  },
  {
    name: "Waning Gibbous",
    symbol: "🌖",
    meaning:
      "Generous aftermath. Zero shares toys, belly rubs, and unsolicited life advice with everyone.",
  },
  {
    name: "Last Quarter",
    symbol: "🌗",
    meaning:
      "Release and review. Zero forgives the harness, the blow dryer, and yesterday's bath.",
  },
  {
    name: "Waning Crescent",
    symbol: "🌘",
    meaning:
      "Restorative stillness. Zero prefers the couch, soft light, and quiet supervision of his household.",
  },
];

export function getMoonPhaseInfo(date) {
  const days = (date.getTime() - NEW_MOON.getTime()) / 86_400_000;
  const phase = ((days % SYNODIC) + SYNODIC) % SYNODIC;
  const idx = Math.min(7, Math.floor((phase / SYNODIC) * 8));
  return { ...MOON_PHASES[idx], illumination: Math.round((1 - Math.cos((phase / SYNODIC) * 2 * Math.PI)) * 50) };
}
