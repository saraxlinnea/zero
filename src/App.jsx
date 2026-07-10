import { useState, useEffect, useRef } from "react";
import { GALLERY_PHOTOS, PLAY_SEQUENCE } from "./photos.js";
import { ASPIRATION_GROUPS, SAMOYED_HISTORY, ADVENTURE_GROUPS, ADVENTURE_PINS } from "./content.js";
import CosmosTab from "./CosmosTab.jsx";
import { setFootprintMode, clearFootprints } from "./footprint-system.js";
import { TAB_FOOTPRINT_MODES } from "./footprint-modes.js";
import LayerShell from "./cinematic/LayerShell.jsx";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap";

const BIRTHDAY = new Date("2024-09-16T00:00:00");

const NICKNAMES = [
  "Little Zero", "Little Floof", "Little Dragon", "Little Polar Bear",
  "Little Cloud", "Little Boy", "Little Bear", "Little Lamb",
  "Little Sherlock", "Little Investigative Journalist",
  "Baby Zero", "Baby Boy",
  "Zerowski", "Mr. Zero", "Cutie Pie", "Sweetie Pie", "Chicken Wing", "Handsome boy",
];

const STAR_SIGN = {
  name: "Virgo",
  symbol: "♍",
  paragraphs: [
    "Zero was born September 16 at exactly 00:00:00, a Virgo. Earth sign, neat about routine when it suits him. He has strong feelings about which side of the street smells right and treats the same hydrant like a standing appointment.",
    "Mercury rules Virgo, which here means alert barking, sustained eye contact, and noticeable silence if you forget to praise him. He likes a day with a shape: walk, breakfast, nap, a little watching over the household. He will love a stranger on the sidewalk and still regard the blow dryer as an insult. He has standards.",
  ],
};

const CHINESE_ZODIAC = {
  name: "Wood Dragon",
  character: "龍",
  pinyin: "lóng",
  paragraphs: [
    "Zero was born in 2024, the Year of the Wood Dragon: confident, a little theatrical, and fairly sure the room got better when he arrived. Hard to argue.",
    "Wood Dragons are meant to bring growth and big energy. Zero brings fluff and a fixed position on the important issues: more walks, more friends, more lakes, and playtime counted as a need, not a treat. He does not guard the house so much as run it. Visitors are welcome. They should be ready to admire him.",
  ],
};

const LIKES = [
  "Making friends",
  "Cross-country skiing",
  "Looking fabulous",
  "Playing tug of war",
  "Running around the couch",
  "Going on walks",
  "Being a diva",
  "Doing tricks",
  "Head massages",
  "Cuddling (when not too hot)",
  "Getting dirty in the ocean",
  "Bringing and receiving toys (with Ender especially)",
  "Swimming in lakes",
  "Being the best boy",
];

const CUTOUTS = {
  happyFace: "zero-happy-face.png",
  running: "zero-running.png",
  headMassage: "zero-head-massage.png",
  dirty: "dirty-zero.png",
  skellington: "zero-skellington.png",
};

const DISLIKES = [
  "Putting on his harness",
  "Getting blow dried",
  "Getting washed",
  "Being alone",
  "Cuddling when too hot",
  "Being around a vacuum",
  "Eating plain kibble",
];

const SAMOYED_FACTS = [
  {
    label: "Origin",
    value: "Siberia, Russia",
    detail:
      "Bred by the Samoyedic people near the Arctic Circle for herding reindeer, hauling sleds, and keeping humans warm on frigid nights. He has not forgotten any of this.",
  },
  {
    label: "AKC Group",
    value: "Working",
    detail:
      "Working Group dogs were bred to assist humans in tasks requiring strength and intelligence: pulling sleds, guarding homes, search and rescue. Blue-collar by lineage. Zero applies this ethic to the couch.",
  },
  {
    label: "Weight",
    value: "35 to 65 lbs",
    detail:
      "Males stand 21 to 23.5 inches at the shoulder. Powerful and tireless, perfectly beautiful and highly functional.",
  },
  {
    label: "Coat",
    value: "Double-layered",
    detail:
      "A harsh standoff outercoat over a dense woolly undercoat. Insulates against both cold and heat. Never shave it. It sheds twice a year, and also continuously.",
  },
  {
    label: "The Sammie Smile",
    value: "Functional, not decorative",
    detail:
      "The upturned corners of the mouth prevent drooling in subzero temperatures, where drool would freeze into icicles on the chest fur. In San Francisco this is less necessary. The smile remains.",
  },
  {
    label: "Lifespan",
    value: "12 to 15 years",
    detail:
      "Hardy and long-lived. Thrives on company, daily exercise, and consistent training. Does not do well left alone for long periods, and will let you know.",
  },
  {
    label: "Temperament",
    value: "Friendly. Very friendly.",
    detail:
      "Will alarm bark, then greet the visitor with a wagging tail. An excellent watchdog and a poor guard dog. Loves everyone unconditionally.",
  },
  {
    label: "Exercise",
    value: "Daily and enthusiastic",
    detail:
      "Built for Siberian winters. In warm climates: mornings or evenings, shade, cool water, and AC. He manages, but he notices the heat.",
  },
];

const ALL_TRICKS = [
  { name: "Sit", note: null },
  { name: "Down", note: null },
  { name: "Shake a Paw", note: "also other paw" },
  { name: "Circus", note: null },
  { name: "Bow Chica Wow Wow", note: "aka take a bow" },
  { name: "Spin", note: null },
  { name: "Ambiturner", note: "aka reverse spin" },
  { name: "Bang", note: "aka play dead" },
  { name: "Stop", note: null },
  { name: "Go", note: "aka freedom time to run" },
];

const INITIAL_TICKS = [
  { id: 1, date: "2025-05-03", location: "Coastal hike, Santa Cruz", count: 12, notes: "All 12 found and removed after the hike. Zero was unperturbed." },
];

const PAGE_MAX = 1320;

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "character", label: "Character" },
  { id: "cosmos", label: "Cosmos" },
  { id: "breed", label: "Breed" },
  { id: "gallery", label: "Gallery" },
  { id: "records", label: "Records" },
];

function getLiveAge(birthday) {
  const diff = Date.now() - birthday.getTime();
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

function getAge(birthday) {
  const now = new Date();
  const months =
    (now.getFullYear() - birthday.getFullYear()) * 12 +
    (now.getMonth() - birthday.getMonth());
  if (months < 24) return `${months} months old`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} old`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatPhotoTaken(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function sortPhotosByTaken(newestFirst, list = GALLERY_PHOTOS) {
  return [...list].sort((a, b) => {
    const diff = new Date(b.taken) - new Date(a.taken);
    return newestFirst ? diff : -diff;
  });
}

const pal = {
  masthead: "#2C1A0E",
  mastheadText: "#F5ECD7",
  mastheadMuted: "#C9A97A",
  cream: "#FAF6ED",
  parchment: "#F0E8D5",
  darkBrown: "#2C1A0E",
  midBrown: "#6B4226",
  lightBrown: "#A67C52",
  ink: "#1C110A",
  inkMuted: "#5C3D1E",
  rule: "#C9A97A",
  accentLight: "#D4956A",
  white: "#FFFDF8",
  tickRed: "#7A1A1A",
  tickRedLight: "#F0DADA",
  tickBorder: "#C0A0A0",
  dislikeRed: "#8B3A2A",
  walkGreen: "#7A9B76",
  hikeTerracotta: "#D4956A",
  xcBlue: "#6B8FA3",
  navy: "#22314F",
};

const ff = {
  display: "'Playfair Display', Georgia, serif",
  body: "'EB Garamond', Georgia, serif",
};

const s = {
  page: { fontFamily: ff.body, background: pal.cream, minHeight: "100vh", color: pal.ink },
  masthead: { background: pal.masthead, color: pal.mastheadText },
  mastheadInner: {
    maxWidth: PAGE_MAX, margin: "0 auto", padding: "28px 36px 24px",
    display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24,
  },
  siteLabel: {
    fontFamily: ff.body, fontSize: 11, letterSpacing: "0.18em",
    textTransform: "uppercase", color: pal.mastheadMuted, marginBottom: 4,
  },
  mastheadTitle: {
    fontFamily: ff.display, fontSize: 38, fontWeight: 700,
    color: pal.mastheadText, lineHeight: 1.05, margin: 0,
  },
  mastheadSub: {
    fontFamily: ff.body, fontStyle: "italic", fontSize: 15,
    color: pal.mastheadMuted, marginTop: 6,
  },
  mastheadMeta: {
    textAlign: "right", fontFamily: ff.body, fontSize: 13,
    color: pal.mastheadMuted, lineHeight: 1.9,
  },
  mastheadMetaSub: { fontSize: 12, lineHeight: 1.7 },
  mastheadLink: {
    background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer",
    font: "inherit", color: "inherit", textAlign: "inherit", lineHeight: "inherit",
  },
  mastheadRule: { borderTop: `1px solid ${pal.mastheadMuted}`, opacity: 0.3, margin: 0 },
  main: { maxWidth: PAGE_MAX, width: "100%", margin: "0 auto", padding: "40px 36px 80px" },
  // intro blurb
  introBlock: {
    fontFamily: ff.body, fontSize: 17, color: pal.inkMuted, lineHeight: 1.85,
    marginBottom: 28, fontStyle: "italic",
  },
  introStrong: { fontFamily: ff.display, fontStyle: "normal", fontWeight: 600, color: pal.darkBrown },
  tabBar: {
    display: "flex", gap: 0, borderBottom: `1px solid ${pal.rule}`,
    marginBottom: 36, overflowX: "auto", WebkitOverflowScrolling: "touch",
  },
  tabBtn: {
    fontFamily: ff.body, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase",
    color: pal.lightBrown, background: "none", border: "none",
    borderBottom: "2px solid transparent", padding: "12px 20px", cursor: "pointer",
    whiteSpace: "nowrap", flexShrink: 0, marginBottom: -1,
    transition: "color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
  },
  tabBtnActive: {
    color: pal.darkBrown, borderBottom: `2px solid ${pal.accentLight}`, fontWeight: 500,
  },
  tabBtnCosmosActive: {
    color: "#1A1428", borderBottom: "2px solid #9B8AB8", fontWeight: 500,
  },
  tabPanel: {
    minHeight: 320,
    animation: "tab-panel-in 0.28s ease",
  },
  secHead: { display: "flex", alignItems: "baseline", gap: 16, marginBottom: 22, marginTop: 52 },
  secHeadFirst: { marginTop: 0 },
  secTitle: { fontFamily: ff.display, fontSize: 22, fontWeight: 600, color: pal.darkBrown, margin: 0, lineHeight: 1 },
  secStamp: { fontFamily: ff.display, fontSize: 14, color: pal.navy, lineHeight: 1, flexShrink: 0 },
  secRule: { flex: 1, height: 1, background: pal.rule, opacity: 0.45, border: "none" },
  profileStatsCol: { display: "flex", flexDirection: "column" },
  profileRightCol: { display: "flex", flexDirection: "column", gap: 16, minWidth: 0 },
  profileAsideLabel: {
    fontFamily: ff.display, fontSize: 15, fontWeight: 600, color: pal.darkBrown,
    margin: "0 0 12px", letterSpacing: "0.02em",
  },
  statCard: {
    background: pal.white, border: `1px solid ${pal.rule}`,
    padding: "12px 14px 10px", display: "flex", flexDirection: "column",
  },
  statAsideStack: { display: "flex", flexDirection: "column", gap: 8 },
  statBox: { background: pal.parchment, border: `1px solid ${pal.rule}`, padding: "8px 12px" },
  statBoxLink: { cursor: "pointer", transition: "border-color 0.15s" },
  statCutoutFlow: {
    width: "78%", maxWidth: 118, height: "auto", objectFit: "contain", objectPosition: "center",
    display: "block", alignSelf: "center", marginTop: 2, marginBottom: 0,
    filter: "drop-shadow(0 3px 8px rgba(44,26,14,0.18))",
  },
  statNum: { fontFamily: ff.display, fontSize: 26, fontWeight: 700, color: pal.darkBrown, lineHeight: 1 },
  statLabel: { fontFamily: ff.body, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: pal.lightBrown, marginTop: 3 },
  statNote: { fontFamily: ff.body, fontStyle: "italic", fontSize: 12, color: pal.inkMuted, marginTop: 3, lineHeight: 1.35 },
  specimenCard: {
    background: pal.parchment, border: `1px solid ${pal.rule}`,
    padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px",
  },
  fieldLabel: { fontFamily: ff.body, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: pal.lightBrown, marginBottom: 2 },
  fieldValue: { fontFamily: ff.display, fontSize: 16, color: pal.darkBrown, fontWeight: 600, margin: 0, lineHeight: 1.3 },
  fieldSub: { fontFamily: ff.body, fontStyle: "italic", fontSize: 12.5, color: pal.inkMuted, lineHeight: 1.3, marginTop: 2 },
  fieldBlock: { marginBottom: 0 },
  galleryPreview: {
    display: "block", width: "100%", textAlign: "left", cursor: "pointer",
    background: pal.white, border: `1px solid ${pal.rule}`, padding: "14px 16px",
  },
  galleryPreviewLabel: {
    fontFamily: ff.body, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
    color: pal.lightBrown, margin: "0 0 10px",
  },
  galleryPreviewGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8,
  },
  galleryPreviewImg: { width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" },
  galleryPreviewLink: {
    fontFamily: ff.body, fontSize: 13, fontStyle: "italic", color: pal.midBrown,
    display: "block", marginTop: 10,
  },
  activitiesGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  activitiesCard: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "22px 26px" },
  activitiesCardTitle: { fontFamily: ff.display, fontSize: 17, fontWeight: 600, color: pal.darkBrown, margin: "0 0 14px" },
  activityItem: {
    fontFamily: ff.body, fontSize: 14.5, color: pal.inkMuted, lineHeight: 1,
    padding: "7px 0", borderBottom: `1px solid rgba(201,169,122,0.2)`,
    display: "flex", alignItems: "center", gap: 10,
  },
  activityDot: { width: 5, height: 5, background: pal.accentLight, flexShrink: 0 },
  dislikeDot: { width: 5, height: 5, background: pal.dislikeRed, flexShrink: 0 },
  factsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  factCard: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "16px 20px" },
  factLabel: { fontFamily: ff.body, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: pal.lightBrown, marginBottom: 3 },
  factValue: { fontFamily: ff.display, fontSize: 16, fontWeight: 600, color: pal.darkBrown, margin: "0 0 6px" },
  factDetail: { fontFamily: ff.body, fontSize: 13.5, color: pal.inkMuted, lineHeight: 1.7, margin: 0 },
  tricksGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 },
  tricksGridTwoCol: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 },
  repertoireRow: {
    display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 24, alignItems: "stretch", marginBottom: 32,
  },
  repertoireTricks: { minWidth: 0 },
  playSequenceCard: {
    background: pal.white, border: `1px solid ${pal.rule}`, overflow: "hidden", margin: 0,
    height: "100%", display: "flex", flexDirection: "column", alignSelf: "stretch",
  },
  playSequenceFrame: {
    position: "relative", background: pal.parchment, overflow: "hidden",
    flexShrink: 0, margin: "0 auto",
  },
  playSequenceImg: {
    position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
    transition: "opacity 0.2s ease",
  },
  playSequenceCaption: {
    fontFamily: ff.body, fontSize: 11, color: pal.lightBrown, fontStyle: "italic",
    padding: "8px 10px", margin: 0, textAlign: "center", lineHeight: 1.5,
  },
  playSequenceLabel: {
    fontFamily: ff.body, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
    color: pal.accentLight, padding: "10px 10px 0", margin: 0, textAlign: "center",
  },
  trickCard: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "13px 16px" },
  trickNum: { fontFamily: ff.body, fontSize: 10, letterSpacing: "0.14em", color: pal.accentLight, textTransform: "uppercase", marginBottom: 3 },
  trickName: { fontFamily: ff.display, fontSize: 15.5, fontWeight: 600, color: pal.darkBrown, margin: 0 },
  trickNote: { fontFamily: ff.body, fontStyle: "italic", fontSize: 12.5, color: pal.lightBrown, margin: "3px 0 0" },
  tickBanner: {
    background: pal.tickRedLight,
    border: `1px solid ${pal.tickBorder}`,
    borderLeft: `3px solid ${pal.tickRed}`,
    padding: "18px 24px", marginBottom: 20,
  },
  tickBannerTitle: { fontFamily: ff.display, fontSize: 16, fontWeight: 700, color: pal.tickRed, margin: "0 0 6px" },
  tickBannerText: { fontFamily: ff.body, fontSize: 14, color: "#5C1A1A", lineHeight: 1.7, margin: 0 },
  logForm: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "24px 28px", marginBottom: 20 },
  logFormTitle: { fontFamily: ff.display, fontSize: 16, fontWeight: 600, color: pal.darkBrown, marginBottom: 16 },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
  formGroup: { display: "flex", flexDirection: "column", gap: 4 },
  lbl: { fontFamily: ff.body, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: pal.lightBrown },
  inp: { fontFamily: ff.body, fontSize: 14, background: pal.cream, border: `1px solid ${pal.rule}`, color: pal.ink, padding: "7px 10px", outline: "none", borderRadius: 0 },
  sel: { fontFamily: ff.body, fontSize: 14, background: pal.cream, border: `1px solid ${pal.rule}`, color: pal.ink, padding: "7px 10px", outline: "none", borderRadius: 0, appearance: "none", cursor: "pointer" },
  ta: { fontFamily: ff.body, fontSize: 14, background: pal.cream, border: `1px solid ${pal.rule}`, color: pal.ink, padding: "7px 10px", outline: "none", borderRadius: 0, resize: "vertical", minHeight: 60 },
  addBtn: { fontFamily: ff.body, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", background: pal.masthead, color: pal.mastheadText, border: "none", padding: "9px 22px", cursor: "pointer", marginTop: 8 },
  table: { width: "100%", borderCollapse: "collapse", fontFamily: ff.body, fontSize: 14, background: pal.white, border: `1px solid ${pal.rule}` },
  th: { fontFamily: ff.body, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: pal.lightBrown, borderBottom: `1px solid ${pal.rule}`, padding: "10px 14px", textAlign: "left", background: pal.parchment },
  td: { padding: "10px 14px", color: pal.inkMuted, borderBottom: `1px solid rgba(201,169,122,0.25)`, verticalAlign: "top" },
  empty: { fontFamily: ff.body, fontStyle: "italic", fontSize: 14, color: pal.lightBrown, padding: "20px 14px", background: pal.white, border: `1px solid ${pal.rule}` },
  logStatRow: { display: "flex", gap: 14, marginBottom: 20 },
  logStatBox: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "14px 18px", minWidth: 100 },
  logStatNum: { fontFamily: ff.display, fontSize: 26, fontWeight: 700, color: pal.darkBrown, lineHeight: 1 },
  logStatLabel: { fontFamily: ff.body, fontSize: 11, letterSpacing: "0.13em", textTransform: "uppercase", color: pal.lightBrown, marginTop: 4 },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 },
  photoCard: { background: pal.white, border: `1px solid ${pal.rule}`, overflow: "hidden", margin: 0, cursor: "pointer" },
  photoFrame: { width: "100%", aspectRatio: "1", background: pal.parchment, position: "relative", overflow: "hidden" },
  photoImg: { width: "100%", height: "100%", aspectRatio: "1", objectFit: "cover", display: "block" },
  lightbox: {
    position: "fixed", inset: 0, background: "rgba(28, 17, 10, 0.92)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: 24, cursor: "pointer",
  },
  lightboxImg: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain", border: `2px solid ${pal.rule}` },
  lightboxClose: {
    position: "absolute", top: 20, right: 24,
    fontFamily: ff.body, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase",
    color: pal.mastheadMuted, background: "none", border: "none", cursor: "pointer",
  },
  mastheadLeft: { display: "flex", alignItems: "flex-end", gap: 20 },
  mastheadCutout: {
    width: 96, height: 96, objectFit: "contain", objectPosition: "bottom",
    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))",
    flexShrink: 0,
    transition: "transform 0.35s ease",
  },
  lovesCard: { position: "relative", background: pal.parchment, overflow: "hidden" },
  lovesList: { position: "relative" },
  lovesCutout: {
    position: "absolute", right: -8, bottom: 0, width: 140, maxHeight: "88%",
    objectFit: "contain", objectPosition: "bottom right", pointerEvents: "none",
    filter: "drop-shadow(0 2px 6px rgba(44,26,14,0.12))",
  },
  adventureCard: {
    display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(180px, 220px)",
    gap: 20, alignItems: "stretch",
    background: pal.parchment, border: `1px solid ${pal.rule}`, padding: "18px 22px",
  },
  adventureGroupBlock: { paddingLeft: 12, marginBottom: 4 },
  adventureFigure: {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
    minHeight: "100%",
  },
  adventureFigureImg: {
    width: "100%", height: "100%", flex: 1, minHeight: 0,
    objectFit: "contain", objectPosition: "bottom center",
    filter: "drop-shadow(0 3px 8px rgba(44,26,14,0.15))",
    transform: "scale(1.2)", transformOrigin: "bottom center",
  },
  adventureGroups: { display: "flex", flexDirection: "column", gap: 12 },
  adventureGroupLabel: {
    fontFamily: ff.body, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
    color: pal.lightBrown, margin: "0 0 4px",
  },
  adventureList: { margin: 0, paddingLeft: 18, listStyle: "disc" },
  adventureItem: {
    fontFamily: ff.body, fontSize: 14.5, color: pal.inkMuted, lineHeight: 1.35, padding: "3px 0",
  },
  adventureItemDetail: { color: pal.lightBrown, fontStyle: "italic" },
  adventureCaption: {
    fontFamily: ff.body, fontStyle: "italic", fontSize: 11, color: pal.lightBrown,
    textAlign: "center", lineHeight: 1.3, margin: "8px 0 0", flexShrink: 0,
  },
  ageGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 0 },
  ageBox: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "18px 14px", textAlign: "center" },
  ageNum: { fontFamily: ff.display, fontSize: 28, fontWeight: 700, color: pal.darkBrown, lineHeight: 1, fontVariantNumeric: "tabular-nums" },
  ageLabel: { fontFamily: ff.body, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: pal.lightBrown, marginTop: 6 },
  ageNote: { fontFamily: ff.body, fontStyle: "italic", fontSize: 13, color: pal.inkMuted, marginTop: 14, lineHeight: 1.6 },
  proseCard: {
    background: pal.white, border: `1px solid ${pal.rule}`, padding: "24px 28px",
    fontFamily: ff.body, fontSize: 15, color: pal.inkMuted, lineHeight: 1.85,
  },
  proseParagraph: { margin: "0 0 16px" },
  namingCard: {
    background: pal.parchment, border: `1px solid ${pal.rule}`,
    padding: "22px 26px", display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(100px, 140px)",
    gap: 20, alignItems: "center",
  },
  namingImg: {
    width: "100%", height: "auto", objectFit: "contain",
    filter: "drop-shadow(0 4px 14px rgba(44,26,14,0.2))",
  },
  namingCaption: {
    fontFamily: ff.body, fontStyle: "italic", fontSize: 11, color: pal.lightBrown,
    textAlign: "center", margin: "8px 0 0",
  },
  aspirationGroupLabel: {
    fontFamily: ff.display, fontSize: 14, fontWeight: 600, color: pal.midBrown,
    margin: "0 0 8px", letterSpacing: "0.02em",
  },
  aspirationGroupBlock: { marginBottom: 18 },
  photoCaption: {
    fontFamily: ff.body, fontSize: 11, color: pal.lightBrown, fontStyle: "italic",
    padding: "6px 8px", margin: 0, textAlign: "center",
  },
  gallerySortRow: {
    display: "flex", justifyContent: "flex-end", marginBottom: 16,
  },
  gallerySortBtn: {
    fontFamily: ff.body, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
    color: pal.midBrown, background: pal.white, border: `1px solid ${pal.rule}`,
    padding: "8px 14px", cursor: "pointer",
  },
  aspirationItem: { marginBottom: 20 },
  aspirationTitle: { fontFamily: ff.display, fontSize: 16, fontWeight: 600, color: pal.darkBrown, margin: "0 0 6px" },
  aspirationDetail: { fontFamily: ff.body, fontSize: 14.5, color: pal.inkMuted, lineHeight: 1.75, margin: 0 },
  adventureMap: { height: 380, width: "100%", border: `1px solid ${pal.rule}`, marginTop: 24, zIndex: 0 },
  historyBlock: { marginBottom: 28 },
};

function statKeyActivate(e, fn) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
}

function cutoutSrc(name) {
  return `${import.meta.env.BASE_URL}cutouts/${name}`;
}

function photoSrc(file, variant = "full") {
  const base = import.meta.env.BASE_URL;
  return variant === "thumb"
    ? `${base}photos/thumbs/${file}`
    : `${base}photos/${file}`;
}

function SectionHead({ title, first = false }) {
  return (
    <div style={{ ...s.secHead, ...(first ? s.secHeadFirst : {}) }}>
      <span style={s.secStamp} aria-hidden="true">✦</span>
      <h2 style={s.secTitle}>{title}</h2>
      <hr style={s.secRule} />
    </div>
  );
}

function GalleryPreview({ onOpenGallery }) {
  const preview = sortPhotosByTaken(true).slice(0, 4);

  return (
    <button type="button" style={s.galleryPreview} className="gallery-preview" onClick={onOpenGallery}>
      <p style={s.galleryPreviewLabel}>Photographic record</p>
      <div style={s.galleryPreviewGrid} className="gallery-preview-grid">
        {preview.map(({ file }) => (
          <LazyThumb key={file} file={file} style={s.galleryPreviewImg} />
        ))}
      </div>
      <span style={s.galleryPreviewLink}>View full gallery →</span>
    </button>
  );
}

function VitalStatsColumn({ onTabChange, totalTicks }) {
  return (
    <aside className="profile-stats-col" style={s.profileStatsCol}>
      <SectionHead title="Vital Statistics" first />
      <div style={s.statCard} className="stat-card">
        <div style={s.statAsideStack}>
          <div
            style={{ ...s.statBox, ...s.statBoxLink }}
            className="stat-box-link"
            role="button"
            tabIndex={0}
            onClick={() => onTabChange("character")}
            onKeyDown={(e) => statKeyActivate(e, () => onTabChange("character"))}
          >
            <div style={s.statNum}>{ALL_TRICKS.length}</div>
            <div style={s.statLabel}>Known tricks</div>
            <div style={s.statNote}>Sit through Go · see Repertoire</div>
          </div>
          <div style={s.statBox}>
            <div style={{ ...s.statNum, fontSize: 17, paddingTop: 2 }}>20 quintillion</div>
            <div style={s.statLabel}>Friends</div>
            <div style={s.statNote}>Est. all living animals on Earth. Mostly insects and roundworms. Zero intends to meet every one.</div>
          </div>
          <div
            style={{ ...s.statBox, ...s.statBoxLink }}
            className="stat-box-link"
            role="button"
            tabIndex={0}
            onClick={() => onTabChange("records")}
            onKeyDown={(e) => statKeyActivate(e, () => onTabChange("records"))}
          >
            <div style={s.statNum}>{totalTicks}</div>
            <div style={s.statLabel}>Ticks hosted</div>
            <div style={s.statNote}>One coastal hike · see Tick Tracker</div>
          </div>
        </div>
        <img
          style={s.statCutoutFlow}
          className="stat-cutout-flow"
          src={cutoutSrc(CUTOUTS.running)}
          alt="Zero running"
          loading="lazy"
          decoding="async"
        />
      </div>
    </aside>
  );
}

function LiveAgeCounter() {
  const [age, setAge] = useState(() => getLiveAge(BIRTHDAY));

  useEffect(() => {
    const id = setInterval(() => setAge(getLiveAge(BIRTHDAY)), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: age.days, label: "Days" },
    { value: age.hours, label: "Hours" },
    { value: age.minutes, label: "Minutes" },
    { value: age.seconds, label: "Seconds" },
  ];

  return (
    <div>
      <div style={s.ageGrid} className="age-grid">
        {units.map(u => (
          <div key={u.label} style={s.ageBox}>
            <div style={s.ageNum}>{u.value.toLocaleString()}</div>
            <div style={s.ageLabel}>{u.label}</div>
          </div>
        ))}
      </div>
      <p style={s.ageNote}>
        Precise elapsed time since September 16, 2024 at 00:00:00. Zero arrived on the stroke of midnight and has been on Earth for every second since.
      </p>
    </div>
  );
}

function Aspirations() {
  return (
    <div style={{ ...s.proseCard, background: pal.parchment }}>
      {ASPIRATION_GROUPS.map((group, gi) => (
        <div key={group.group} style={{ ...s.aspirationGroupBlock, marginBottom: gi === ASPIRATION_GROUPS.length - 1 ? 0 : 18 }}>
          <p style={s.aspirationGroupLabel}>{group.group}</p>
          {group.items.map((item, ii) => (
            <div key={item.title} style={{ ...s.aspirationItem, marginBottom: ii === group.items.length - 1 ? 0 : 12 }}>
              <p style={s.aspirationTitle}>{item.title}</p>
              <p style={s.aspirationDetail}>{item.detail}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SamoyedHistory() {
  return (
    <div style={{ ...s.proseCard, ...s.historyBlock }}>
      {SAMOYED_HISTORY.map((paragraph, i) => (
        <p key={i} style={{ ...s.proseParagraph, marginBottom: i === SAMOYED_HISTORY.length - 1 ? 0 : 16 }}>{paragraph}</p>
      ))}
    </div>
  );
}

function AdventureMap() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView([37.2, -121.8], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    ADVENTURE_PINS.forEach((pin) => {
      L.circleMarker([pin.lat, pin.lng], {
        radius: 8,
        fillColor: pin.accent || pal.midBrown,
        color: pal.darkBrown,
        weight: 2,
        fillOpacity: 0.95,
      })
        .bindPopup(`<strong>${pin.name}</strong><br>${pin.detail}`)
        .addTo(map);
    });

    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} style={s.adventureMap} className="adventure-map" aria-label="Map of Zero's adventures" />;
}

function PlaySequence({ frameSize }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (PLAY_SEQUENCE.length <= 1) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PLAY_SEQUENCE.length);
    }, 420);
    return () => clearInterval(id);
  }, []);

  if (!PLAY_SEQUENCE.length) return null;

  const frameStyle = frameSize
    ? { ...s.playSequenceFrame, width: frameSize, height: frameSize }
    : s.playSequenceFrame;

  return (
    <figure style={s.playSequenceCard} className="play-sequence">
      <p style={s.playSequenceLabel}>At play</p>
      <div style={frameStyle} className="play-sequence-frame">
        {PLAY_SEQUENCE.map(({ file }, i) => (
          <img
            key={file}
            src={photoSrc(file, "thumb")}
            alt={i === index ? "Zero at play" : ""}
            aria-hidden={i !== index}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            style={{
              ...s.playSequenceImg,
              opacity: i === index ? 1 : 0,
              zIndex: i === index ? 1 : 0,
            }}
          />
        ))}
      </div>
      <figcaption style={s.playSequenceCaption}>
        March 15, 2026 · play session
      </figcaption>
    </figure>
  );
}

const PLAY_CHROME_HEIGHT = 58;

function RepertoireBlock() {
  const tricksRef = useRef(null);
  const [frameSize, setFrameSize] = useState(null);

  useEffect(() => {
    const el = tricksRef.current;
    if (!el) return;

    const update = () => {
      const h = el.offsetHeight;
      setFrameSize(Math.max(140, h - PLAY_CHROME_HEIGHT));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div style={s.repertoireRow} className="repertoire-row">
      <div ref={tricksRef} style={s.repertoireTricks} className="repertoire-tricks">
        <div style={s.tricksGridTwoCol} className="tricks-grid-two-col">
          {ALL_TRICKS.map((trick, i) => (
            <div key={trick.name} style={{ ...s.trickCard, background: i % 2 === 0 ? pal.white : pal.parchment }}>
              <p style={s.trickNum}>No. {String(i + 1).padStart(2, "0")}</p>
              <p style={s.trickName}>{trick.name}</p>
              {trick.note && <p style={s.trickNote}>{trick.note}</p>}
            </div>
          ))}
        </div>
      </div>
      <PlaySequence frameSize={frameSize} />
    </div>
  );
}

function NamingNote() {
  return (
    <div style={s.namingCard} className="naming-card">
      <div>
        <p style={{ ...s.proseParagraph, marginBottom: 0 }}>
          Zero is named after Zero Skellington, the little ghost dog from <em>The Nightmare Before Christmas</em>.
          Same bright loyalty, same habit of lighting up a room, and the same conviction that wherever his people go, he goes too.
        </p>
      </div>
      <figure style={{ margin: 0, textAlign: "center" }}>
        <img
          style={s.namingImg}
          src={cutoutSrc(CUTOUTS.skellington)}
          alt="Zero Skellington from The Nightmare Before Christmas"
          loading="lazy"
          decoding="async"
        />
        <figcaption style={s.namingCaption}>Zero Skellington</figcaption>
      </figure>
    </div>
  );
}

function BirthRecord() {
  return (
    <div style={{ ...s.namingCard, marginBottom: 28 }} className="naming-card birth-record">
      <div>
        <div style={{ ...s.fieldBlock, marginBottom: 14 }}>
          <p style={s.fieldLabel}>Birth Time</p>
          <p style={s.fieldValue}>00:00:00</p>
        </div>
        <div style={{ ...s.fieldBlock, marginBottom: 14 }}>
          <p style={s.fieldLabel}>Birth Date</p>
          <p style={s.fieldValue}>September 16, 2024</p>
        </div>
        <div style={s.fieldBlock}>
          <p style={s.fieldLabel}>Given Name</p>
          <p style={s.fieldValue}>Zero*</p>
          <p style={{ ...s.fieldSub, marginTop: 8, lineHeight: 1.55 }}>
            * Named for Zero Skellington of <em>The Nightmare Before Christmas</em>. A ghost dog with a glowing nose, and a snow dog with a glowing personality.
          </p>
        </div>
      </div>
      <figure style={{ margin: 0, textAlign: "center" }}>
        <img
          style={s.namingImg}
          src={cutoutSrc(CUTOUTS.skellington)}
          alt="Zero Skellington from The Nightmare Before Christmas"
          loading="lazy"
          decoding="async"
        />
        <figcaption style={s.namingCaption}>Zero Skellington</figcaption>
      </figure>
    </div>
  );
}

function TabBar({ active, onChange }) {
  return (
    <div style={s.tabBar} role="tablist" aria-label="Specimen sections" className="tab-bar">
      {TABS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${id}`}
            id={`tab-${id}`}
            className={`tab-btn tab-btn-${id}${isActive ? " is-active" : ""}`}
            style={{
              ...s.tabBtn,
              ...(isActive && id === "cosmos" ? s.tabBtnCosmosActive : {}),
              ...(isActive && id !== "cosmos" ? s.tabBtnActive : {}),
            }}
            onClick={() => onChange(id)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function LazyThumb({ file, style, alt = "" }) {
  const ref = useRef(null);
  const [showSrc, setShowSrc] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShowSrc(true); },
      { rootMargin: "200px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={style}>
      {showSrc && (
        <img
          src={photoSrc(file, "thumb")}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
    </div>
  );
}

function LazyGalleryPhoto({ file, taken, onOpen }) {
  const ref = useRef(null);
  const [showSrc, setShowSrc] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const caption = formatPhotoTaken(taken);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShowSrc(true); },
      { rootMargin: "320px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <figure ref={ref} style={s.photoCard} className="photo-card" onClick={() => onOpen(file)}>
      <div style={s.photoFrame}>
        {showSrc && (
          <img
            style={{ ...s.photoImg, opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
            src={photoSrc(file, "thumb")}
            alt={`Zero, ${caption}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>
      <figcaption style={s.photoCaption}>{caption}</figcaption>
    </figure>
  );
}

const GALLERY_BATCH = 12;

function PhotoGallery() {
  const [active, setActive] = useState(null);
  const [newestFirst, setNewestFirst] = useState(true);
  const [visibleCount, setVisibleCount] = useState(GALLERY_BATCH);
  const sentinelRef = useRef(null);
  const sorted = sortPhotosByTaken(newestFirst);
  const activePhoto = sorted.find((p) => p.file === active);
  const visible = sorted.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(GALLERY_BATCH);
  }, [newestFirst]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visibleCount >= sorted.length) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((c) => Math.min(c + GALLERY_BATCH, sorted.length));
        }
      },
      { rootMargin: "480px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visibleCount, sorted.length]);

  return (
    <>
      <div style={s.gallerySortRow}>
        <button
          type="button"
          style={s.gallerySortBtn}
          onClick={() => setNewestFirst((v) => !v)}
        >
          {newestFirst ? "Newest first" : "Oldest first"}
        </button>
      </div>
      <div style={s.photoGrid} className="photo-grid">
        {visible.map(({ file, taken }) => (
          <LazyGalleryPhoto
            key={file}
            file={file}
            taken={taken}
            onOpen={setActive}
          />
        ))}
        {visibleCount < sorted.length && (
          <div ref={sentinelRef} style={{ gridColumn: "1 / -1", height: 4 }} aria-hidden="true" />
        )}
      </div>
      {active && activePhoto && (
        <div style={s.lightbox} onClick={() => setActive(null)} role="dialog" aria-modal="true" aria-label="Photo preview">
          <button style={s.lightboxClose} onClick={() => setActive(null)} type="button">Close</button>
          <img
            style={s.lightboxImg}
            src={photoSrc(active, "full")}
            alt={`Zero, ${formatPhotoTaken(activePhoto.taken)}`}
            decoding="async"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

function TickTracker({ incidents, setIncidents }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ date: today, location: "", count: "", notes: "" });
  const [showForm, setShowForm] = useState(false);
  const totalTicks = incidents.reduce((sum, i) => sum + (parseInt(i.count, 10) || 0), 0);

  function add() {
    if (!form.date) return;
    setIncidents([{ id: Date.now(), ...form }, ...incidents]);
    setForm({ date: today, location: "", count: "", notes: "" });
    setShowForm(false);
  }

  return (
    <div>
      <div style={s.tickBanner}>
        <p style={s.tickBannerTitle}>Total ticks hosted: {totalTicks} confirmed</p>
        <p style={s.tickBannerText}>
          Zero has graciously provided temporary accommodation to at least {totalTicks} ticks over the course of his outdoor career.
          Each one was removed. He remained handsome throughout and bore no ill will.
        </p>
      </div>
      {showForm && (
        <div style={s.logForm}>
          <p style={s.logFormTitle}>Log a Tick Incident</p>
          <div style={s.formRow} className="form-row-grid">
            <div style={s.formGroup}>
              <label style={s.lbl}>Date</label>
              <input style={s.inp} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div style={s.formGroup}>
              <label style={s.lbl}>Number of ticks</label>
              <input style={s.inp} type="number" min="1" placeholder="1" value={form.count} onChange={e => setForm({ ...form, count: e.target.value })} />
            </div>
          </div>
          <div style={{ ...s.formGroup, marginBottom: 12 }}>
            <label style={s.lbl}>Location / activity</label>
            <input style={s.inp} type="text" placeholder="Trail name, area, activity..." value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
          <div style={{ ...s.formGroup, marginBottom: 0 }}>
            <label style={s.lbl}>Notes</label>
            <textarea style={s.ta} placeholder="Any concerns, vet follow-up needed..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button style={s.addBtn} onClick={add}>+ Log Incident</button>
        </div>
      )}
      {!showForm && (
        <button style={{ ...s.addBtn, marginBottom: 20 }} onClick={() => setShowForm(true)}>
          + Log New Incident
        </button>
      )}
      <div className="table-wrap"><table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Date</th>
            <th style={s.th}>Ticks</th>
            <th style={s.th}>Location / Activity</th>
            <th style={s.th}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(inc => (
            <tr key={inc.id}>
              <td style={s.td}>{formatDate(inc.date)}</td>
              <td style={{ ...s.td, fontFamily: ff.display, fontWeight: 600, color: pal.tickRed }}>
                {inc.count}
              </td>
              <td style={s.td}>{inc.location || "-"}</td>
              <td style={{ ...s.td, fontStyle: "italic" }}>{inc.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("profile");
  const [tickIncidents, setTickIncidents] = useState(INITIAL_TICKS);
  const totalTicks = tickIncidents.reduce((sum, i) => sum + (parseInt(i.count, 10) || 0), 0);
  const today = new Date();
  const nextBirthday = new Date(today.getFullYear(), 8, 16);
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

  function handleTabChange(id) {
    setTab(id);
    clearFootprints();
    setFootprintMode(TAB_FOOTPRINT_MODES[id] ?? "default");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    setFootprintMode(TAB_FOOTPRINT_MODES[tab] ?? "default");
  }, [tab]);

  return (
    <LayerShell mood="default">
      <link rel="stylesheet" href={FONT_LINK} />
      <style>{`
        * { box-sizing: border-box; }
        input, select, textarea, button { font-size: 16px !important; }
        @keyframes tab-panel-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .masthead-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        .masthead-meta-zodiac {
          margin-bottom: 4px;
          color: ${pal.mastheadMuted};
          transition: color 0.2s ease;
        }
        .masthead-meta-zodiac:hover { color: ${pal.accentLight}; }
        .masthead-cutout:hover { transform: translateY(-3px) rotate(-2deg); }
        .tab-btn:hover { color: ${pal.darkBrown}; }
        .tab-btn-profile.is-active {
          border-bottom-color: ${pal.navy} !important;
          color: ${pal.navy} !important;
          background: rgba(34, 49, 79, 0.08);
        }
        .tab-btn-character.is-active {
          border-bottom-color: #C9893A !important;
          color: #6B4226 !important;
          background: rgba(201, 137, 58, 0.12);
        }
        .tab-btn-cosmos.is-active {
          border-bottom-color: #9B8AB8 !important;
          color: #1A1428 !important;
          background: rgba(155, 138, 184, 0.14);
        }
        .tab-btn-breed.is-active {
          border-bottom-color: #8B6B45 !important;
          color: #5C3D1E !important;
          background: rgba(139, 107, 69, 0.12);
        }
        .tab-btn-gallery.is-active {
          border-bottom-color: ${pal.accentLight} !important;
          color: ${pal.darkBrown} !important;
          background: rgba(212, 149, 106, 0.14);
        }
        .tab-btn-records.is-active {
          border-bottom-color: ${pal.tickRed} !important;
          color: ${pal.tickRed} !important;
          background: rgba(122, 26, 26, 0.08);
        }
        .stat-box-link:hover {
          border-color: ${pal.accentLight} !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(44, 26, 14, 0.08);
        }
        .stat-box-link { transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease; }
        .gallery-preview:hover { border-color: ${pal.accentLight}; }
        .photo-card { transition: transform 0.25s ease, border-color 0.25s ease; }
        .photo-card:hover { transform: translateY(-3px); border-color: ${pal.accentLight} !important; }
        @media (min-width: 901px) {
          .profile-top-row {
            display: grid;
            grid-template-columns: minmax(280px, 320px) minmax(0, 1fr);
            gap: 28px;
            align-items: start;
          }
          .facts-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .profile-top-row { display: flex; flex-direction: column; gap: 24px; }
          .profile-stats-col { order: -1; }
          .gallery-preview-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .masthead-inner { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; padding: 16px 20px 14px !important; }
          .masthead-meta {
            text-align: left !important;
            display: grid !important;
            grid-template-columns: 1fr auto !important;
            column-gap: 16px !important;
            row-gap: 2px !important;
            align-items: start !important;
            width: 100% !important;
            line-height: 1.45 !important;
          }
          .masthead-meta-born { grid-column: 1; grid-row: 1; }
          .masthead-meta-age { grid-column: 1; grid-row: 2; }
          .masthead-meta-bday { grid-column: 1; grid-row: 3; opacity: 0.65; }
          .masthead-meta-zodiac {
            grid-column: 2;
            grid-row: 1 / span 3;
            align-self: center;
            justify-self: end;
            text-align: right;
            max-width: 9.5em;
            line-height: 1.35;
            margin-bottom: 0 !important;
            opacity: 0.85;
          }
          .masthead-title { font-size: 28px !important; }
          .main-content { padding: 28px 20px 60px !important; }
          .two-col-grid { grid-template-columns: 1fr !important; }
          .specimen-card { grid-template-columns: 1fr !important; gap: 10px !important; padding: 14px 16px !important; }
          .gallery-preview-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .form-row-grid { grid-template-columns: 1fr !important; }
          .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .log-stat-row { flex-wrap: wrap; }
          .photo-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .repertoire-row { grid-template-columns: 1fr !important; }
          .repertoire-tricks { max-width: none !important; }
          .play-sequence { max-width: 100%; width: 100%; margin: 0 auto; height: auto !important; }
          .play-sequence-frame { max-width: min(100%, 360px) !important; width: min(100%, 360px) !important; height: auto !important; aspect-ratio: 1 / 1 !important; }
          .masthead-left { align-items: center !important; gap: 14px !important; }
          .masthead-cutout { width: 108px !important; height: 108px !important; }
          .adventure-card { grid-template-columns: 1fr minmax(110px, 140px) !important; gap: 14px !important; padding: 14px 16px !important; }
          .naming-card { grid-template-columns: 1fr !important; }
          .loves-cutout { width: 68px !important; max-height: 72% !important; }
          .tab-bar { margin-left: -4px; }
          .age-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .adventure-map { height: 260px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tab-panel, [role="tabpanel"] { animation: none !important; }
          .masthead-cutout, .stat-box-link, .photo-card, .tab-btn { transition: none !important; }
          .masthead-cutout:hover, .stat-box-link:hover, .photo-card:hover { transform: none !important; }
        }
        .leaflet-container { font-family: 'EB Garamond', Georgia, serif; }
        .leaflet-popup-content-wrapper { border-radius: 0; border: 1px solid #C9A97A; }
        .cosmos-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(155, 138, 184, 0.28) 1px, transparent 1px);
          background-size: 52px 52px;
          opacity: 0.35;
          pointer-events: none;
        }
      `}</style>
      <div style={s.page} className="page-shell page-shell--layered">

        <header style={s.masthead}>
          <div style={s.mastheadInner} className="masthead-inner">
            <div style={s.mastheadLeft} className="masthead-left">
              <img
                style={s.mastheadCutout}
                className="masthead-cutout"
                src={cutoutSrc(CUTOUTS.happyFace)}
                alt="Zero, happy face"
                fetchPriority="high"
                decoding="async"
                width={96}
                height={96}
              />
              <div>
                <p style={s.siteLabel}>Specimen Record · Canine Division</p>
                <h1 style={s.mastheadTitle} className="masthead-title">Zero</h1>
                <p style={s.mastheadSub}>Samoyed · San Francisco, CA</p>
              </div>
            </div>
            <div style={s.mastheadMeta} className="masthead-meta">
              <button
                type="button"
                className="masthead-meta-zodiac"
                style={{ ...s.mastheadMetaSub, ...s.mastheadLink }}
                onClick={() => handleTabChange("cosmos")}
              >
                {STAR_SIGN.symbol} {STAR_SIGN.name} · {CHINESE_ZODIAC.character} {CHINESE_ZODIAC.name}
              </button>
              <div className="masthead-meta-born">Born September 16, 2024</div>
              <div className="masthead-meta-age">{getAge(BIRTHDAY)}</div>
              <div className="masthead-meta-bday" style={s.mastheadMetaSub}>
                {daysUntilBirthday === 0
                  ? "Happy Birthday, Zero!"
                  : `${daysUntilBirthday} days until next birthday`}
              </div>
            </div>
          </div>
          <hr style={s.mastheadRule} />
        </header>

        <main style={s.main} className="main-content">

          <p style={s.introBlock}>
            <span style={s.introStrong}>Zero is the goodest little boy in the world.</span>{" "}
            He goes by many names, among them{" "}
            {NICKNAMES.map((n, i) => (
              <span key={n}>
                <em>{n}</em>
                {i < NICKNAMES.length - 2 ? ", " : i === NICKNAMES.length - 2 ? ", and " : ""}
              </span>
            ))}.
          </p>

          <TabBar active={tab} onChange={handleTabChange} />

          {tab === "profile" && (
            <div style={s.tabPanel} role="tabpanel" id="panel-profile" aria-labelledby="tab-profile">
              <div className="profile-top-row">
                <VitalStatsColumn onTabChange={handleTabChange} totalTicks={totalTicks} />

                <div className="profile-right-col" style={s.profileRightCol}>
                  <SectionHead title="Field Notes" first />
                  <div style={s.specimenCard} className="specimen-card">
                    <div style={s.fieldBlock}>
                      <p style={s.fieldLabel}>Species</p>
                      <p style={s.fieldValue}>Samoyed</p>
                      <p style={s.fieldSub}>Canis lupus familiaris</p>
                    </div>
                    <div style={s.fieldBlock}>
                      <p style={s.fieldLabel}>Location</p>
                      <p style={s.fieldValue}>San Francisco, CA</p>
                      <p style={s.fieldSub}>Marina neighborhood</p>
                    </div>
                    <div style={s.fieldBlock}>
                      <p style={s.fieldLabel}>Birth date</p>
                      <p style={s.fieldValue}>September 16, 2024</p>
                      <p style={s.fieldSub}>Exactly 00:00:00. Of course.</p>
                    </div>
                    <div style={s.fieldBlock}>
                      <p style={s.fieldLabel}>Coat</p>
                      <p style={s.fieldValue}>Snow-white</p>
                      <p style={s.fieldSub}>A cloud in dog form, with party pants.</p>
                    </div>
                    <div style={s.fieldBlock}>
                      <p style={s.fieldLabel}>Weight</p>
                      <p style={s.fieldValue}>50 lbs</p>
                    </div>
                    <div style={s.fieldBlock}>
                      <p style={s.fieldLabel}>Eyes</p>
                      <p style={s.fieldValue}>Soulful black eyes</p>
                      <p style={s.fieldSub}>Deep, dark, and expressive. He knows exactly what he is doing with them.</p>
                    </div>
                  </div>
                  <GalleryPreview onOpenGallery={() => handleTabChange("gallery")} />
                </div>
              </div>

              <SectionHead title="Favorite Activities" />
              <div style={s.activitiesGrid} className="two-col-grid">
                <div style={{ ...s.activitiesCard, ...s.lovesCard }} className="loves-card">
                  <p style={s.activitiesCardTitle}>Loves</p>
                  <div style={s.lovesList} className="loves-list">
                    {LIKES.map((item, i) => (
                      <div key={item} style={{ ...s.activityItem, borderBottom: i === LIKES.length - 1 ? "none" : s.activityItem.borderBottom }}>
                        <div style={s.activityDot} />
                        {item}
                      </div>
                    ))}
                  </div>
                  <img
                    style={s.lovesCutout}
                    className="loves-cutout"
                    src={cutoutSrc(CUTOUTS.headMassage)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div style={{ ...s.activitiesCard, background: pal.white }}>
                  <p style={s.activitiesCardTitle}>Would rather not</p>
                  {DISLIKES.map((item, i) => (
                    <div key={item} style={{ ...s.activityItem, borderBottom: i === DISLIKES.length - 1 ? "none" : s.activityItem.borderBottom }}>
                      <div style={s.dislikeDot} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <SectionHead title="Adventure Highlights" />
              <div style={s.adventureCard} className="adventure-card">
                <div style={s.adventureGroups}>
                  {ADVENTURE_GROUPS.map((group, gi) => (
                    <div
                      key={group.type}
                      style={{ ...s.adventureGroupBlock, borderLeft: `3px solid ${group.accent}`, marginTop: gi === 0 ? 0 : 8 }}
                    >
                      <p style={{ ...s.adventureGroupLabel, marginTop: 0 }}>{group.type}</p>
                      <ul style={s.adventureList}>
                        {group.items.map((item) => (
                          <li key={item.name} style={s.adventureItem}>
                            {item.name}
                            <span style={s.adventureItemDetail}> · {item.detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <figure style={s.adventureFigure} className="adventure-figure">
                  <img
                    style={s.adventureFigureImg}
                    className="adventure-figure-img"
                    src={cutoutSrc(CUTOUTS.dirty)}
                    alt="Zero after an adventure"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption style={s.adventureCaption}>Field condition: acceptable.</figcaption>
                </figure>
              </div>
              <AdventureMap />
            </div>
          )}

          {tab === "character" && (
            <div style={s.tabPanel} role="tabpanel" id="panel-character" aria-labelledby="tab-character">
              <SectionHead title="Repertoire" first />
              <RepertoireBlock />

              <SectionHead title="On the Name" />
              <NamingNote />

              <SectionHead title="Time on Earth" />
              <LiveAgeCounter />

              <SectionHead title="Aspirations" />
              <Aspirations />
            </div>
          )}

          {tab === "cosmos" && (
            <CosmosTab starSign={STAR_SIGN} chineseZodiac={CHINESE_ZODIAC} />
          )}

          {tab === "breed" && (
            <div style={s.tabPanel} role="tabpanel" id="panel-breed" aria-labelledby="tab-breed">
              <SectionHead title="Historical Record" first />
              <SamoyedHistory />

              <SectionHead title="About the Samoyed" />
              <div style={s.factsGrid} className="two-col-grid">
                {SAMOYED_FACTS.map((f, i) => (
                  <div key={f.label} style={{ ...s.factCard, background: i % 2 === 0 ? pal.white : pal.parchment }}>
                    <p style={s.factLabel}>{f.label}</p>
                    <p style={s.factValue}>{f.value}</p>
                    <p style={s.factDetail}>{f.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "gallery" && (
            <div style={s.tabPanel} role="tabpanel" id="panel-gallery" aria-labelledby="tab-gallery">
              <SectionHead title="Photographic Record" first />
              <div style={{ background: pal.parchment, border: `1px solid ${pal.rule}`, padding: "20px 22px" }}>
                <PhotoGallery />
              </div>
            </div>
          )}

          {tab === "records" && (
            <div style={s.tabPanel} role="tabpanel" id="panel-records" aria-labelledby="tab-records">
              <SectionHead title="Birth Record" first />
              <BirthRecord />

              <SectionHead title="Tick Tracker" />
              <TickTracker incidents={tickIncidents} setIncidents={setTickIncidents} />
            </div>
          )}

        </main>
      </div>
    </LayerShell>
  );
}
