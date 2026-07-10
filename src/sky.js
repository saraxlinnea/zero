/** Fake daily sky notes. Speculative, Zero-flavored, not real ephemeris. */
export const DAILY_SKY_NOTES = [
  { planet: "Mercury", placement: "in Virgo", mood: "Zero may bark at mail trucks and insist on the left side of the street." },
  { planet: "Venus", placement: "near the Marina", mood: "Extra friendly to strangers. Compliments land well." },
  { planet: "Mars", placement: "in the leash hand", mood: "Pulls a little harder toward every interesting smell." },
  { planet: "Jupiter", placement: "over Fort Funston", mood: "Big energy. Sand in the coat is likely." },
  { planet: "Saturn", placement: "beside the harness", mood: "Harness still annoying. Treats help a little." },
  { planet: "Moon", placement: "over the couch", mood: "Soft afternoon. Cuddles if it is not too hot." },
  { planet: "Mercury", placement: "near the hydrant", mood: "That corner needs a proper, unhurried inspection." },
  { planet: "Venus", placement: "with Ender", mood: "Toy sharing is on the table. Tug may follow." },
  { planet: "Mars", placement: "at Crissy Field", mood: "Wants a longer walk than you planned." },
  { planet: "Jupiter", placement: "in the treat pocket", mood: "He remembers which pocket had snacks yesterday." },
  { planet: "Saturn", placement: "near the blow dryer", mood: "Grooming patience is low. Keep sessions short." },
  { planet: "Moon", placement: "over Star Lake", mood: "Water on the mind. Paws may get wet." },
  { planet: "Mercury", placement: "in reverse spin", mood: "Good day for ambiturner if he is feeling bold." },
  { planet: "Venus", placement: "on Marina Green", mood: "Social calendar is full. He is the main event." },
  { planet: "Mars", placement: "after breakfast", mood: "Save the best trick for after the morning walk." },
  { planet: "Jupiter", placement: "with Kaan and Malina", mood: "Guardian check-ins feel important today." },
  { planet: "Saturn", placement: "on the trail", mood: "Tick check after the hike. He is not hosting." },
  { planet: "Moon", placement: "in soft light", mood: "Quiet supervision at home beats a big outing." },
  { planet: "Mercury", placement: "near the birds", mood: "Bark first, friends second. Keep a loose leash by trees." },
  { planet: "Venus", placement: "in the smile", mood: "Smile extra big. It works." },
  { planet: "Mars", placement: "around the couch", mood: "Running laps indoors may happen before dinner." },
  { planet: "Jupiter", placement: "toward the hills", mood: "The hills are not going to sniff themselves." },
  { planet: "Saturn", placement: "after a bath", mood: "Bath memory fading. Harness memory less so." },
  { planet: "Moon", placement: "over the ocean", mood: "Santa Cruz dirt still counts. Field condition: acceptable." },
];

export function getDailySkyNote(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - start) / 86_400_000);
  return DAILY_SKY_NOTES[dayOfYear % DAILY_SKY_NOTES.length];
}
