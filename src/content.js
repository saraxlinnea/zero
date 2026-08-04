export const ASPIRATION_GROUPS = [
  {
    group: "Out and about",
    items: [
      { title: "More adventures", detail: "More hikes, trips, and walks where he can stop to smell the roses." },
      { title: "Road trips", detail: "Zero always wants to join for whatever adventure. He prefers lots of AC and an open window." },
      { title: "Good swimming", detail: "Zero enjoys any body of water besides when it's bathtime. Oceans, lakes, and rivers are all fantastic for cooling off." },
    ],
  },
  {
    group: "Home & Food",
    items: [
      { title: "Treats at all times", detail: "Being that he is such a good boy he should have treats available whenever he wants." },
      { title: "Wet food", detail: "Wet food is always preferred to plain kibble." },
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

export const ZERO_MODES = [
  {
    name: "At Play",
    blurb:
      "Running with friends, scampering around on hikes, tugging toys, spinning around the furniture. Favorite mode. Once this starts, he is hard to interrupt.",
  },
  {
    name: "Investigative Journalist",
    blurb:
      "Aka. Little Sherlock. Investigating everything whether at home or on walks. Will smell and boop all things especially if they're expensive. Does the rounds at home of rooms, doors, and windows to ensure we are safe and secure.",
  },
  {
    name: "Sleepy Eepy & Cuddly",
    blurb:
      "Zero knows how to rest and relax. He loves a good nap and appreciates a good back massage and ear scratch. This is usually when he is most cuddly and will lay with you as long as he doesn't get too hot.",
  },
  {
    name: "Show-and-Tell",
    blurb:
      "He brings you things. A toy, a stick, the good spot on the couch. He wants you to look properly and probably play with him.",
  },
];

export const SAMOYED_HISTORY = [
  "For thousands of years, Samoyeds worked beside the Samoyedic peoples of Siberia: herding reindeer, pulling sleds across the Arctic, and sleeping close to humans on the coldest nights.",
  "In the late nineteenth and early twentieth centuries, the breed reached explorers and mapmakers. Samoyeds pulled sleds on polar expeditions, including Fridtjof Nansen's Arctic journey.",
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
  { name: "Marina Green", lat: 37.804, lng: -122.437, detail: "Marina district", accent: "#7A9B76" },
  { name: "Crissy Field", lat: 37.804, lng: -122.465, detail: "Presidio waterfront", accent: "#7A9B76" },
  { name: "Marshall Beach", lat: 37.788, lng: -122.483, detail: "Lands End", accent: "#7A9B76" },
  { name: "Star Lake", lat: 38.879, lng: -120.04, detail: "Lake Tahoe", accent: "#D4956A" },
  { name: "Wilder Ranch", lat: 36.972, lng: -122.074, detail: "Santa Cruz", accent: "#D4956A" },
  { name: "Waterfall Loop", lat: 37.159, lng: -121.785, detail: "Uvas Canyon County Park", accent: "#D4956A" },
  { name: "Fort Funston", lat: 37.715, lng: -122.501, detail: "South San Francisco", accent: "#D4956A" },
  { name: "Nevada Nordic", lat: 39.314, lng: -120.162, detail: "Lake Tahoe", accent: "#6B8FA3" },
];
