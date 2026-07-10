const SYNODIC = 29.530588853;
const NEW_MOON = new Date("2000-01-06T18:14:00Z");

export const MOON_PHASES = [
  {
    name: "New Moon",
    symbol: "🌑",
    what: "The sky is darkest, with hardly any moon visible.",
    why: "Less light often means calmer days. Good for resting and recharging.",
    favors: "Naps, couch time, gentle cuddles (if not too hot), and easy walks around the Marina.",
  },
  {
    name: "Waxing Crescent",
    symbol: "🌒",
    what: "A thin crescent is growing. Light is coming back.",
    why: "Energy starts to build. Zero gets curious about new smells and routes.",
    favors: "Exploring new blocks, saying hi to friends, and trying a slightly longer walk.",
  },
  {
    name: "First Quarter",
    symbol: "🌓",
    what: "Half the moon is lit, a clear halfway point.",
    why: "A decisive kind of day. Zero picks a direction and commits.",
    favors: "Trails with forks, pick-a-path hikes, and confident leash leading.",
  },
  {
    name: "Waxing Gibbous",
    symbol: "🌔",
    what: "Almost full. The moon is bright and still building.",
    why: "More light usually means more alertness. He is gearing up, not winding down.",
    favors: "Tricks (sit, spin, bow chica wow wow), looking handsome, and showing off on walks.",
  },
  {
    name: "Full Moon",
    symbol: "🌕",
    what: "The brightest night of the cycle.",
    why: "Lots of dogs feel extra social and alert when the moon is full, Zero included.",
    favors: "Meeting people and dogs, play time, being a little extra dramatic, and Fort Funston-level enthusiasm.",
  },
  {
    name: "Waning Gibbous",
    symbol: "🌖",
    what: "Still bright, but the moon is starting to shrink.",
    why: "High energy, but softer, good for sharing attention instead of hoarding it.",
    favors: "Tug with Ender, sharing toys, head massages, and guardian check-ins with Kaan and Malina.",
  },
  {
    name: "Last Quarter",
    symbol: "🌗",
    what: "Half lit again, on the way down.",
    why: "A good day to let small annoyances go, including the harness and yesterday's bath.",
    favors: "Forgiving the blow dryer, shorter grooming sessions, and forgiving walks.",
  },
  {
    name: "Waning Crescent",
    symbol: "🌘",
    what: "A thin fading crescent before the next new moon.",
    why: "Low-key days. Zero saves his big adventures for later.",
    favors: "Couch, soft light, quiet supervision at home, and short Marina loops over big hikes.",
  },
];

export function getMoonPhaseInfo(date) {
  const days = (date.getTime() - NEW_MOON.getTime()) / 86_400_000;
  const phase = ((days % SYNODIC) + SYNODIC) % SYNODIC;
  const idx = Math.min(7, Math.floor((phase / SYNODIC) * 8));
  return { ...MOON_PHASES[idx], illumination: Math.round((1 - Math.cos((phase / SYNODIC) * 2 * Math.PI)) * 50) };
}
