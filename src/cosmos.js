export const PAW_LINES = [
  { pad: "Life line", zone: "Center pad", reading: "Long and worn down. Plenty of walks still ahead, most longer than you meant to take." },
  { pad: "Treat line", zone: "Inner left", reading: "Deep. He remembers which pocket had the good snacks yesterday and will check it again today." },
  { pad: "Squirrel line", zone: "Outer edge", reading: "Often interrupted. Bark first, look later. The squirrel remains unimpressed." },
  { pad: "Heart line", zone: "Upper pad", reading: "Open. Loves everyone, which makes him excellent company and a terrible guard dog." },
  { pad: "Head line", zone: "Toe beans", reading: "Short. Fast decisions. Wrong about birds more often than he admits." },
  { pad: "Dewclaw", zone: "Reserved", reading: "Saved for reverse spins, dramatic exits, and the occasional ambiturner." },
];

export const DAILY_PAW_LINES = [
  "Left front pad restless. He will want to meet someone new on the walk.",
  "Right rear pad calm. Couch is in play this afternoon.",
  "Center pad steady. The corner hydrant needs a proper inspection.",
  "Treat line showing. Bring snacks.",
  "Squirrel line active. Keep a loose grip on the leash near trees.",
  "All four pads aligned. He will look especially handsome at lunch.",
  "Dewclaw ready. Good day for a reverse spin.",
  "Heart line warm. Cuddles are fine if it is not too hot.",
];

export function getDailyPawLine(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - start) / 86_400_000);
  return DAILY_PAW_LINES[dayOfYear % DAILY_PAW_LINES.length];
}
