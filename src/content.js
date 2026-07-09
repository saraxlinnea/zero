export const ASPIRATION_GROUPS = [
  {
    group: "Out and about",
    items: [
      { title: "More adventures", detail: "Hikes, trips, and new smells. Always." },
      { title: "Cross-country travel", detail: "Come on road trips whenever possible, ideally with a window seat." },
      { title: "Better swimming", detail: "Get strong enough to cross lakes and rivers without looking panicked." },
    ],
  },
  {
    group: "Home & friends",
    items: [
      { title: "More friends at home", detail: "More animals under the same roof and more people who hang out properly." },
      { title: "Play time, always", detail: "Play is not a reward. It is the point." },
    ],
  },
  {
    group: "Family",
    items: [
      { title: "See Ender, Kaan, and Melina more", detail: "Help them grow up right. Zero takes guardian duty seriously." },
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
  { name: "Marina Green", lat: 37.804, lng: -122.437, detail: "Marina district", accent: "#7A9B76" },
  { name: "Crissy Field", lat: 37.804, lng: -122.465, detail: "Presidio waterfront", accent: "#7A9B76" },
  { name: "Marshall Beach", lat: 37.788, lng: -122.483, detail: "Lands End", accent: "#7A9B76" },
  { name: "Star Lake", lat: 38.879, lng: -120.04, detail: "Lake Tahoe", accent: "#D4956A" },
  { name: "Wilder Ranch", lat: 36.972, lng: -122.074, detail: "Santa Cruz", accent: "#D4956A" },
  { name: "Waterfall Loop", lat: 37.159, lng: -121.785, detail: "Uvas Canyon County Park", accent: "#D4956A" },
  { name: "Fort Funston", lat: 37.715, lng: -122.501, detail: "South San Francisco", accent: "#D4956A" },
  { name: "Nevada Nordic", lat: 39.314, lng: -120.162, detail: "Lake Tahoe", accent: "#6B8FA3" },
];
