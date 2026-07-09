export const DAILY_FORECASTS = [
  "Want a long sniff at the fire hydrant. No shortcuts.",
  "Will accept compliments from strangers. Please and thank you.",
  "Morning walk hits different today. Save spin for after breakfast.",
  "Feeling cross-country energy even on a city block.",
  "Ender needs watching. Zero will help.",
  "Couch is nice but Crissy Field is nicer. Compromise: slow sniff walk.",
  "Extra handsome at lunch. Plan your best trick before noon.",
  "Lake or ocean nearby? He will consider getting his paws wet.",
  "The harness is annoying. Treats help. Still annoying.",
  "Bird spotted means bark first, friends second.",
  "Head massage weather. Position accordingly.",
  "Make a new friend today, dog or human or pigeon.",
  "Play time comes first.",
  "Smile extra big today. It works.",
  "Mud may happen. Field condition: acceptable.",
  "Check in on Kaan and Melina. They benefit from Zero energy.",
  "Good day to practice swimming, even at the edge of the lake.",
  "Tug of war is about heart, not winning.",
  "Bath memory fading. Harness memory less so.",
  "Fort Funston on the mind. Sand in the coat is a badge.",
  "Star Lake energy. Pack optimism and snacks.",
  "Circus, spin, or ambiturner. Reverse spin if bold.",
  "Routine is good. Squirrels are the exception.",
  "Coat looks magnificent. Act like it.",
  "Quiet time with his people will hit the spot. Cuddles if not too hot.",
  "Cross-country skiing memories. Snow is a state of mind.",
  "Ocean dirt from Santa Cruz still counts.",
  "Help the household humans become good adults.",
  "More animal friends at home would be ideal.",
  "The hills are not going to sniff themselves.",
  "Patient waiting earns treats. Bow chica wow wow helps.",
  "Accept compliments without modesty.",
  "Lake crossings start with confidence and a steady paddle.",
  "Marina Green social calendar is full. He is the main event.",
  "Tick check after hikes. He is not hosting arachnids willingly.",
  "Being the goodest boy. As usual.",
];

export function getDailyForecast(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - start) / 86_400_000);
  return DAILY_FORECASTS[dayOfYear % DAILY_FORECASTS.length];
}

export function formatForecastDate(date = new Date()) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
