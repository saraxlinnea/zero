export const ASPIRATION_GROUPS = [
  {
    group: "Out and about",
    items: [
      { title: "More adventures", detail: "More hikes, trips, and places where he can stop to smell everything." },
      { title: "Road trips", detail: "Come along whenever possible, preferably with a window seat." },
      { title: "Better swimming", detail: "Keep practicing until lakes and rivers feel easy." },
    ],
  },
  {
    group: "Home & Food",
    items: [
      { title: "Food at all times", detail: "Have food available whenever he wants it, or at least let him make a convincing case." },
      { title: "Wet food, please", detail: "Wet food is always preferred to plain kibble." },
      { title: "The dinner extras", detail: "Fish oil, dental chews, and plenty of accoutrements added to dinner." },
    ],
  },
  {
    group: "Friends & Family",
    items: [
      { title: "More friends at home", detail: "More animals around the house and more people who stay long enough to play." },
      { title: "Play every day", detail: "There should always be time to play." },
      { title: "See Ender, Kaan, and Malina more", detail: "He likes keeping an eye on them and helping them grow up right." },
    ],
  },
];

export const ASPIRATIONS = ASPIRATION_GROUPS.flatMap((g) => g.items);

export const SAMOYED_HISTORY = [
  "For thousands of years, Samoyeds worked beside the Samoyedic peoples of Siberia: herding reindeer, pulling sleds across the Arctic, and sleeping close to humans on the coldest nights. Their warmth was not metaphorical. It was measured in survival.",
  "In the late nineteenth and early twentieth centuries, the breed reached explorers and mapmakers. Samoyeds pulled sleds on polar expeditions, including Fridtjof Nansen's Arctic journey, where their endurance and temperament were treated as equipment as vital as any compass.",
  "Today the Samoyed remains a working dog in spirit if not always in employment. Zero upholds this lineage from San Francisco: he applies Arctic diligence to Marina walks, expedition-level enthusiasm to Fort Funston, and the same ancient conviction that every room has gathered to admire him.",
];

export const ADVENTURE_GROUPS = [
  {
    type: "Top Walks",
    accent: "#7A9B76",
    items: [
      { name: "Marina Green", detail: "Marina district, San Francisco" },
      { name: "Crissy Field", detail: "Presidio waterfront, San Francisco" },
      { name: "Marshall Beach", detail: "Lands End, San Francisco" },
    ],
  },
  {
    type: "Hikes",
    accent: "#D4956A",
    items: [
      { name: "Star Lake", detail: "Lake Tahoe" },
      { name: "Wilder Ranch", detail: "Santa Cruz" },
      { name: "Waterfall Loop", detail: "Uvas Canyon County Park, CA" },
      { name: "Fort Funston", detail: "South San Francisco" },
    ],
  },
  {
    type: "Cross-country",
    accent: "#6B8FA3",
    items: [
      { name: "Nevada Nordic", detail: "Lake Tahoe" },
    ],
  },
];

export const ADVENTURE_PINS = [
  { name: "Marina Green", lat: 37.804, lng: -122.437, detail: "Marina district", accent: "#7A9B76", flavor: "Morning walks and excellent hydrant density." },
  { name: "Crissy Field", lat: 37.804, lng: -122.465, detail: "Presidio waterfront", accent: "#7A9B76", flavor: "Wind, sand, and very serious stick negotiations." },
  { name: "Marshall Beach", lat: 37.788, lng: -122.483, detail: "Lands End", accent: "#7A9B76", flavor: "Cliffs, fog, and dramatic posing." },
  { name: "Star Lake", lat: 38.879, lng: -120.04, detail: "Lake Tahoe", accent: "#D4956A", flavor: "Alpine air and snow-sniffing." },
  { name: "Wilder Ranch", lat: 36.972, lng: -122.074, detail: "Santa Cruz", accent: "#D4956A", flavor: "Coastal trails and suspicious seagulls." },
  { name: "Waterfall Loop", lat: 37.159, lng: -121.785, detail: "Uvas Canyon County Park", accent: "#D4956A", flavor: "Mud on the party pants, worth it." },
  { name: "Fort Funston", lat: 37.715, lng: -122.501, detail: "South San Francisco", accent: "#D4956A", flavor: "Dunes, hang gliders, and off-leash joy." },
  { name: "Nevada Nordic", lat: 39.314, lng: -120.162, detail: "Lake Tahoe", accent: "#6B8FA3", flavor: "Snow days and Nordic ambition." },
];
