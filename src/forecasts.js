export const DAILY_FORECASTS = [
  "The fire hydrant will yield important data today. Take notes with your nose.",
  "A stranger may offer admiration. Accept it as tribute.",
  "Virgo precision favors the morning walk. Afternoon diva energy is also permitted.",
  "Cross-country ambitions stir. Even a block counts if you look fabulous doing it.",
  "Ender requires supervision. Your guardian duties are officially scheduled.",
  "The couch calls, but the trail calls louder. Compromise with a very slow sniff.",
  "Wood Dragon confidence peaks at noon. Schedule your best trick before lunch.",
  "Water holds opportunity. Wading is encouraged; full immersion is aspirational.",
  "Harness resistance is temporary. Treats are eternal.",
  "A bird will be seen. Alarm bark first, then friendship.",
  "Head massage probability: elevated. Position yourself accordingly.",
  "Today favors making friends with species you have not met yet. All of them.",
  "Play time is not optional. It is doctrine.",
  "Your smile is especially functional today. Deploy it liberally.",
  "A muddy adventure may present itself. Field condition: acceptable.",
  "Kaans and Melinas of the world benefit from your steady presence. Check in.",
  "Swimming practice is favored by the stars. Lakes are watching.",
  "Tug of war outcomes matter less than enthusiasm. Win spiritually.",
  "The harness is not your enemy. It is a poorly designed accessory.",
  "Fort Funston energy arrives in memory. Sand in the coat is a badge.",
  "Star Lake whispers from afar. Pack extra optimism.",
  "Today is excellent for circus, spin, or ambiturner. Reverse spin if feeling bold.",
  "Virgo minds love a routine. Disrupt it only for squirrels.",
  "Your coat is magnificent. Act like it.",
  "A quiet moment with your people will restore the soul. Demand cuddles if not too hot.",
  "Cross-country skiing memories fuel today's stride. Snow is a state of mind.",
  "Santa Cruz salt air lingers in the specimen record. Ocean dirt is honorable.",
  "Guardian mode: active. Ensure all household humans become good adults.",
  "More animal friends at home remains a top research priority.",
  "Hike frequency should increase. The hills are not going to sniff themselves.",
  "Treat negotiations favor the patient specimen. Bow chica wow wow if needed.",
  "Today the Wood Dragon accepts compliments without deflection.",
  "Lake crossings begin with confidence. Dog paddle with dignity.",
  "Marina Green social calendar: full. You are the main event.",
  "Tick vigilance remains high. You are not a gracious host to arachnids.",
  "Zero by name, legend by conduct. Proceed accordingly.",
];

export function getDailyForecast(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - start) / 86_400_000);
  return DAILY_FORECASTS[dayOfYear % DAILY_FORECASTS.length];
}

export function formatForecastDate(date = new Date()) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
