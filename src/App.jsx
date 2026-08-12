import { useState, useEffect, useRef } from "react";
import { GALLERY_PHOTOS, PLAY_SEQUENCE } from "./photos.js";
import { ASPIRATION_GROUPS, SAMOYED_HISTORY, ADVENTURE_GROUPS, ADVENTURE_PINS, ZERO_MODES } from "./content.js";
import CosmosTab from "./CosmosTab.jsx";
import AlbedoTab from "./AlbedoTab.jsx";
import { setFootprintMode, clearFootprints, spawnChapterBeat } from "./footprint-system.js";
import { TAB_FOOTPRINT_MODES } from "./footprint-modes.js";
import LayerShell from "./cinematic/LayerShell.jsx";
import { getTabScene } from "./tabScenes.js";
import CoverGate from "./CoverGate.jsx";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Caveat:wght@400;500&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap";

const BIRTHDAY = new Date("2024-09-16T00:00:00");

const NICKNAMES = [
  "Little Zero", "Little Floof", "Little Dragon", "Little Polar Bear",
  "Little Cloud", "Little Boy", "Little Bear", "Little Lamb",
  "Little Sherlock", "Little Investigative Journalist",
  "Baby Zero", "Baby Boy",
  "Mr. Zero", "Cutie Pie", "Sweetie Pie", "Chicken Wing", "Handsome boy",
  "Little Wolf", "Zerowski",
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
    "Wood Dragons get described as bold. Zero brings fluff and a schedule: more walks, more friends, more lakes, and playtime counted as a need, not a treat. He does not guard the house so much as run it. Visitors are welcome. They should be ready to admire him.",
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
  happyFace: "happy-dog.png",
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
      "Working Group dogs were bred to assist humans in tasks requiring strength and intelligence: pulling sleds, guarding homes, search and rescue. Blue-collar by lineage. Zero's hard job is the couch.",
  },
  {
    label: "Weight",
    value: "35 to 65 lbs",
    detail:
      "Males stand 21 to 23.5 inches at the shoulder. Strong, and built to work.",
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
      "Will alarm bark, then greet the visitor with a wagging tail. An excellent watchdog and a poor guard dog. Loves everyone.",
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
  { id: 2, date: "2026-07-13", location: "Woods hike, Larkspur", count: 1, notes: "Tick identified at Hookfish restaurant after the hike." },
  { id: 1, date: "2025-05-03", location: "Coastal hike, Santa Cruz", count: 12, notes: "All 12 found and removed after the hike. Zero was unperturbed." },
];

const PAGE_MAX = 1320;

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "character", label: "Character" },
  { id: "cosmos", label: "Cosmos" },
  { id: "albedo", label: "Climate" },
  { id: "gallery", label: "Gallery" },
  { id: "records", label: "Records" },
];

const COVER_SESSION_KEY = "zero-entered";

function readInitialRoute() {
  let showCover = true;
  let tab = "profile";
  try {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace(/^#/, "");
    const paramTab = params.get("tab");
    if (paramTab && TABS.some((t) => t.id === paramTab)) tab = paramTab;
    else if (hash && TABS.some((t) => t.id === hash)) tab = hash;

    const forceEnter = params.get("enter") === "1" || params.get("cover") === "0";
    const deepLinked = Boolean(
      (hash && TABS.some((t) => t.id === hash)) ||
      (paramTab && TABS.some((t) => t.id === paramTab)),
    );
    const seen = sessionStorage.getItem(COVER_SESSION_KEY) === "1";
    if (forceEnter || deepLinked || seen) showCover = false;
  } catch {
    /* private mode / SSR */
  }
  return { showCover, tab };
}

function markCoverEntered() {
  try {
    sessionStorage.setItem(COVER_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

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
  cream: "#F2F5F7",
  parchment: "#EDE9E0",
  darkBrown: "#1A1A18",
  midBrown: "#6B4226",
  lightBrown: "#A67C52",
  ink: "#1A1A18",
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
  navy: "#6B8FA3",
};

const ff = {
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Source Serif 4', Georgia, serif",
  meta: "'Source Serif 4', Georgia, serif",
};

const s = {
  page: { fontFamily: ff.body, background: pal.cream, minHeight: "100vh", color: pal.ink },
  masthead: { background: pal.masthead, color: pal.mastheadText },
  mastheadInner: {
    maxWidth: PAGE_MAX, margin: "0 auto", padding: "32px 36px 28px",
    display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24,
  },
  siteLabel: {
    fontFamily: ff.meta, fontSize: 11, letterSpacing: "0.12em",
    textTransform: "uppercase", color: pal.mastheadMuted, marginBottom: 6,
  },
  mastheadTitle: {
    fontFamily: ff.display, fontSize: 54, fontWeight: 700,
    color: pal.mastheadText, lineHeight: 0.94, margin: 0,
    padding: 0, border: "none", background: "none", cursor: "pointer",
    textAlign: "left",
  },
  mastheadSub: {
    fontFamily: ff.body, fontStyle: "italic", fontSize: 16,
    color: pal.mastheadMuted, marginTop: 6,
  },
  mastheadMeta: {
    textAlign: "right", fontFamily: ff.meta, fontSize: 13,
    color: pal.mastheadMuted, lineHeight: 1.85, letterSpacing: "0.02em",
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
    fontFamily: ff.body, fontSize: 15, color: pal.inkMuted, lineHeight: 1.75,
    marginBottom: 26, fontStyle: "italic",
  },
  introStrong: {
    fontFamily: ff.body, fontStyle: "normal", fontWeight: 600,
    fontSize: 15, color: pal.darkBrown,
  },
  nicknameMany: {
    fontFamily: "inherit", fontSize: "inherit", fontStyle: "italic", fontWeight: "inherit",
    color: "inherit", background: "none", border: "none",
    borderBottom: `1px solid ${pal.rule}`, padding: 0, cursor: "pointer",
    lineHeight: "inherit",
  },
  tabBar: {
    display: "flex", gap: 0, borderBottom: `1px solid ${pal.rule}`,
    marginBottom: 36, overflowX: "auto", WebkitOverflowScrolling: "touch",
  },
  tabBtn: {
    fontFamily: ff.display, fontSize: 15, letterSpacing: "0.03em", textTransform: "none",
    fontWeight: 500, color: pal.lightBrown, background: "none", border: "none",
    borderBottom: "2px solid transparent", padding: "12px 20px", cursor: "pointer",
    whiteSpace: "nowrap", flexShrink: 0, marginBottom: -1,
    transition: "color 0.2s ease-in-out, border-color 0.2s ease-in-out",
  },
  tabBtnActive: {
    color: pal.darkBrown, borderBottom: `2px solid ${pal.accentLight}`, fontWeight: 600,
  },
  tabBtnCosmosActive: {
    color: pal.darkBrown, borderBottom: "2px solid #6B8FA3", fontWeight: 600,
  },
  tabPanel: {
    minHeight: 320,
  },
  secHead: { display: "flex", alignItems: "baseline", gap: 16, marginBottom: 26, marginTop: 56 },
  secHeadFirst: { marginTop: 0 },
  secTitle: { fontFamily: ff.display, fontSize: 27, fontWeight: 600, color: pal.darkBrown, margin: 0, lineHeight: 1.05 },
  secStamp: { fontFamily: ff.display, fontSize: 15, color: pal.navy, lineHeight: 1, flexShrink: 0 },
  secRule: { flex: 1, height: 1, background: pal.rule, opacity: 0.45, border: "none" },
  profileStatsCol: { display: "flex", flexDirection: "column", minHeight: 0, height: "100%" },
  profileRightCol: { display: "flex", flexDirection: "column", gap: 16, minWidth: 0, height: "100%" },
  profileAsideLabel: {
    fontFamily: ff.display, fontSize: 16, fontWeight: 600, color: pal.darkBrown,
    margin: "0 0 12px", letterSpacing: "0.02em",
  },
  statCard: {
    background: pal.white, border: `1px solid ${pal.rule}`,
    padding: "12px 14px", display: "flex", flexDirection: "column", flex: 1, minHeight: 0,
  },
  statAsideStack: {
    display: "flex", flexDirection: "column", gap: 10, flex: 1, justifyContent: "space-between",
  },
  statBox: {
    background: pal.parchment, border: `1px solid ${pal.rule}`,
    padding: "12px 14px", flex: "1 1 0", display: "flex", flexDirection: "column", justifyContent: "center",
  },
  statBoxLink: { cursor: "pointer", transition: "border-color 0.2s ease-in-out" },
  statCutoutFlow: {
    width: "78%", maxWidth: 118, height: "auto", objectFit: "contain", objectPosition: "center",
    display: "block", alignSelf: "center", marginTop: 2, marginBottom: 0,
    filter: "drop-shadow(0 4px 12px rgba(44,26,14,0.2))",
  },
  statNum: { fontFamily: ff.display, fontSize: 30, fontWeight: 700, color: pal.darkBrown, lineHeight: 1 },
  statLabel: { fontFamily: ff.meta, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: pal.lightBrown, marginTop: 4 },
  statNote: { fontFamily: ff.body, fontStyle: "italic", fontSize: 13, color: pal.inkMuted, marginTop: 3, lineHeight: 1.4 },
  specimenCard: {
    background: pal.parchment, border: `1px solid ${pal.rule}`,
    padding: "18px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px",
    alignItems: "start",
  },
  fieldLabel: { fontFamily: ff.meta, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: pal.lightBrown, marginBottom: 3 },
  fieldValue: { fontFamily: ff.display, fontSize: 18, color: pal.darkBrown, fontWeight: 600, margin: 0, lineHeight: 1.3 },
  fieldSub: { fontFamily: ff.body, fontStyle: "italic", fontSize: 14, color: pal.inkMuted, lineHeight: 1.35, marginTop: 2, minHeight: "1.35em" },
  fieldBlock: { marginBottom: 0, minHeight: 72 },
  galleryPreview: {
    display: "block", width: "100%", textAlign: "left", cursor: "pointer",
    background: pal.white, border: `1px solid ${pal.rule}`, padding: "14px 16px",
    transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  },
  galleryPreviewLabel: {
    fontFamily: ff.meta, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
    color: pal.lightBrown, margin: "0 0 10px",
  },
  galleryPreviewGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8,
  },
  galleryPreviewImg: { width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" },
  galleryPreviewLink: {
    fontFamily: ff.body, fontSize: 14, fontStyle: "italic", color: pal.midBrown,
    display: "block", marginTop: 10,
  },
  activitiesGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  activitiesCard: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "22px 26px" },
  activitiesCardTitle: { fontFamily: ff.display, fontSize: 19, fontWeight: 600, color: pal.darkBrown, margin: "0 0 14px" },
  activityItem: {
    fontFamily: ff.body, fontSize: 15.5, color: pal.inkMuted, lineHeight: 1.15,
    padding: "8px 0", borderBottom: `1px solid rgba(201,169,122,0.2)`,
    display: "flex", alignItems: "center", gap: 10,
  },
  activityDot: { width: 5, height: 5, background: pal.accentLight, flexShrink: 0 },
  dislikeDot: { width: 5, height: 5, background: pal.dislikeRed, flexShrink: 0 },
  factsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  factCard: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "16px 20px" },
  factLabel: { fontFamily: ff.meta, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: pal.lightBrown, marginBottom: 4 },
  factValue: { fontFamily: ff.display, fontSize: 18, fontWeight: 600, color: pal.darkBrown, margin: "0 0 6px" },
  factDetail: { fontFamily: ff.body, fontSize: 15, color: pal.inkMuted, lineHeight: 1.75, margin: 0 },
  tricksGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 },
  tricksGridTwoCol: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 },
  repertoireRow: {
    display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 40%)",
    gap: 24, alignItems: "stretch", marginBottom: 36,
  },
  repertoireTricks: { minWidth: 0 },
  playSequenceCard: {
    background: pal.white, border: `1px solid ${pal.rule}`, overflow: "hidden", margin: 0,
    height: "100%", display: "flex", flexDirection: "column", alignSelf: "stretch",
  },
  playSequenceFrame: {
    position: "relative", background: pal.parchment, overflow: "hidden",
    flex: 1, minHeight: 0, width: "100%", margin: 0,
  },
  playSequenceImg: {
    position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
    transition: "opacity 0.2s ease",
  },
  playSequenceCaption: {
    fontFamily: ff.body, fontSize: 13, color: pal.lightBrown, fontStyle: "italic",
    padding: "8px 10px", margin: 0, textAlign: "center", lineHeight: 1.5,
  },
  playSequenceLabel: {
    fontFamily: ff.meta, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
    color: pal.accentLight, padding: "10px 10px 0", margin: 0, textAlign: "center",
  },
  trickCard: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "13px 16px" },
  trickNum: { fontFamily: ff.meta, fontSize: 11, letterSpacing: "0.1em", color: pal.accentLight, textTransform: "uppercase", marginBottom: 3 },
  trickName: { fontFamily: ff.display, fontSize: 17, fontWeight: 600, color: pal.darkBrown, margin: 0 },
  trickNote: { fontFamily: ff.body, fontStyle: "italic", fontSize: 13.5, color: pal.lightBrown, margin: "3px 0 0" },
  tickBanner: {
    background: pal.tickRedLight,
    border: `1px solid ${pal.tickBorder}`,
    borderLeft: `3px solid ${pal.tickRed}`,
    padding: "18px 24px", marginBottom: 20,
  },
  tickBannerTitle: { fontFamily: ff.display, fontSize: 17, fontWeight: 700, color: pal.tickRed, margin: "0 0 6px" },
  tickBannerText: { fontFamily: ff.body, fontSize: 15, color: "#5C1A1A", lineHeight: 1.7, margin: 0 },
  logForm: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "24px 28px", marginBottom: 20 },
  logFormTitle: { fontFamily: ff.display, fontSize: 17, fontWeight: 600, color: pal.darkBrown, marginBottom: 16 },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
  formGroup: { display: "flex", flexDirection: "column", gap: 4 },
  lbl: { fontFamily: ff.meta, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: pal.lightBrown },
  inp: { fontFamily: ff.body, fontSize: 15, background: pal.cream, border: `1px solid ${pal.rule}`, color: pal.ink, padding: "7px 10px", outline: "none", borderRadius: 0 },
  sel: { fontFamily: ff.body, fontSize: 15, background: pal.cream, border: `1px solid ${pal.rule}`, color: pal.ink, padding: "7px 10px", outline: "none", borderRadius: 0, appearance: "none", cursor: "pointer" },
  ta: { fontFamily: ff.body, fontSize: 15, background: pal.cream, border: `1px solid ${pal.rule}`, color: pal.ink, padding: "7px 10px", outline: "none", borderRadius: 0, resize: "vertical", minHeight: 60 },
  addBtn: { fontFamily: ff.meta, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", background: pal.masthead, color: pal.mastheadText, border: "none", padding: "9px 22px", cursor: "pointer", marginTop: 8 },
  table: { width: "100%", borderCollapse: "collapse", fontFamily: ff.body, fontSize: 15, background: pal.white, border: `1px solid ${pal.rule}` },
  th: { fontFamily: ff.meta, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: pal.lightBrown, borderBottom: `1px solid ${pal.rule}`, padding: "10px 14px", textAlign: "left", background: pal.parchment },
  td: { padding: "10px 14px", color: pal.inkMuted, borderBottom: `1px solid rgba(201,169,122,0.25)`, verticalAlign: "top" },
  empty: { fontFamily: ff.body, fontStyle: "italic", fontSize: 15, color: pal.lightBrown, padding: "20px 14px", background: pal.white, border: `1px solid ${pal.rule}` },
  logStatRow: { display: "flex", gap: 14, marginBottom: 20 },
  logStatBox: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "14px 18px", minWidth: 100 },
  logStatNum: { fontFamily: ff.display, fontSize: 28, fontWeight: 700, color: pal.darkBrown, lineHeight: 1 },
  logStatLabel: { fontFamily: ff.meta, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: pal.lightBrown, marginTop: 4 },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 18 },
  photoCard: { background: pal.white, border: `1px solid ${pal.rule}`, overflow: "hidden", margin: 0, cursor: "pointer" },
  photoFrame: { width: "100%", aspectRatio: "1", background: pal.parchment, position: "relative", overflow: "hidden" },
  photoImg: { width: "100%", height: "100%", aspectRatio: "1", objectFit: "cover", display: "block" },
  lightbox: {
    position: "fixed", inset: 0, background: "rgba(28, 17, 10, 0.92)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: 24, cursor: "pointer",
  },
  lightboxFigure: {
    position: "relative", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    maxWidth: "calc(100vw - 140px)", maxHeight: "calc(100vh - 48px)", margin: 0, cursor: "default",
  },
  lightboxImg: {
    maxWidth: "100%", maxHeight: "calc(100vh - 100px)", width: "auto", height: "auto",
    objectFit: "contain", objectPosition: "center", border: `2px solid ${pal.rule}`,
    display: "block",
  },
  lightboxCaption: {
    fontFamily: "'Caveat', 'Segoe Script', cursive", fontSize: 20,
    color: pal.mastheadMuted, marginTop: 10, textAlign: "center",
  },
  lightboxClose: {
    position: "absolute", top: 20, right: 24,
    fontFamily: ff.meta, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
    color: "#F5ECD7", background: "none", border: "none", cursor: "pointer",
  },
  lightboxArrow: {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    width: 52, height: 72, border: `1px solid rgba(201,169,122,0.45)`,
    background: "rgba(44,26,14,0.35)", color: "#F5ECD7",
    fontFamily: ff.display, fontSize: 36, lineHeight: 1, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
    transition: "color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out",
  },
  mastheadLeft: { display: "flex", alignItems: "flex-end", gap: 20 },
  mastheadCutout: {
    width: 118, height: 148, objectFit: "contain", objectPosition: "bottom",
    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))",
    flexShrink: 0,
    transition: "transform 0.35s ease",
  },
  modesPanel: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(200px, 34%)",
    gap: 20,
    alignItems: "stretch",
  },
  modesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    alignContent: "start",
  },
  modeCardBtn: {
    textAlign: "left",
    cursor: "pointer",
    width: "100%",
    appearance: "none",
    WebkitAppearance: "none",
    border: `1px solid ${pal.rule}`,
    transition: "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
  },
  modesFigure: {
    margin: 0,
    background: pal.parchment,
    border: `1px solid ${pal.rule}`,
    padding: "18px 14px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    minHeight: 280,
    overflow: "visible",
    position: "relative",
  },
  modesCutout: {
    width: "100%",
    maxWidth: 260,
    maxHeight: 250,
    objectFit: "contain",
    objectPosition: "bottom center",
    filter: "drop-shadow(0 4px 14px rgba(44,26,14,0.18))",
    display: "block",
  },
  modesCaption: {
    fontFamily: ff.body,
    fontSize: 13,
    color: pal.lightBrown,
    fontStyle: "italic",
    margin: "10px 0 0",
    textAlign: "center",
    lineHeight: 1.45,
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
    fontFamily: ff.meta, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
    color: pal.lightBrown, margin: "0 0 4px",
  },
  adventureList: { margin: 0, paddingLeft: 18, listStyle: "disc" },
  adventureItem: {
    fontFamily: ff.body, fontSize: 15, color: pal.inkMuted, lineHeight: 1.35, padding: "3px 0",
  },
  adventureItemDetail: { color: pal.lightBrown, fontStyle: "italic" },
  adventureCaption: {
    fontFamily: ff.body, fontStyle: "italic", fontSize: 11, color: pal.lightBrown,
    textAlign: "center", lineHeight: 1.2, margin: "8px 0 0", flexShrink: 0,
    whiteSpace: "nowrap",
  },
  ageGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 0 },
  ageBox: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "18px 14px", textAlign: "center" },
  ageNum: { fontFamily: ff.display, fontSize: 30, fontWeight: 700, color: pal.darkBrown, lineHeight: 1, fontVariantNumeric: "tabular-nums" },
  ageLabel: { fontFamily: ff.meta, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: pal.lightBrown, marginTop: 6 },
  ageNote: { fontFamily: ff.body, fontStyle: "italic", fontSize: 14.5, color: pal.inkMuted, marginTop: 14, lineHeight: 1.7 },
  proseCard: {
    background: pal.white, border: `1px solid ${pal.rule}`, padding: "26px 30px",
    fontFamily: ff.body, fontSize: 16, color: pal.inkMuted, lineHeight: 1.9,
  },
  proseParagraph: { margin: "0 0 16px" },
  namingCard: {
    background: pal.parchment, border: `1px solid ${pal.rule}`,
    padding: "14px 18px", display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(88px, 120px)",
    gap: 14, alignItems: "center", marginBottom: 16,
  },
  namingImg: {
    width: "100%", height: "auto", maxHeight: 120, objectFit: "contain",
    filter: "drop-shadow(0 4px 14px rgba(44,26,14,0.2))",
  },
  namingCaption: {
    fontFamily: ff.body, fontStyle: "italic", fontSize: 12, color: pal.lightBrown,
    textAlign: "center", margin: "8px 0 0",
  },
  looksCard: {
    background: pal.parchment, border: `1px solid ${pal.rule}`,
    padding: "18px 20px", overflow: "hidden",
  },
  looksLead: {
    fontFamily: ff.body, fontStyle: "italic", fontSize: 15.5,
    color: pal.inkMuted, lineHeight: 1.55, margin: "0 0 16px",
  },
  looksCutout: {
    float: "right", width: "42%", maxWidth: 160, height: "auto",
    objectFit: "contain", objectPosition: "center top",
    margin: "0 0 8px 16px",
    filter: "drop-shadow(0 4px 12px rgba(44,26,14,0.18))",
  },
  looksField: { marginBottom: 14, minHeight: 0 },
  aspirationGroupLabel: {
    fontFamily: ff.display, fontSize: 15, fontWeight: 600, color: pal.midBrown,
    margin: "0 0 8px", letterSpacing: "0.02em",
  },
  aspirationGroupBlock: { marginBottom: 18 },
  photoCaption: {
    fontSize: 13, color: pal.midBrown, fontStyle: "normal",
    padding: 0, margin: 0, textAlign: "center",
  },
  gallerySortRow: {
    display: "flex", justifyContent: "flex-end", marginBottom: 18, marginTop: 12,
  },
  gallerySortBtn: {
    fontFamily: ff.meta, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
    color: pal.midBrown, background: pal.white, border: `1px solid ${pal.rule}`,
    padding: "8px 14px", cursor: "pointer",
  },
  aspirationItem: { marginBottom: 20 },
  aspirationTitle: { fontFamily: ff.display, fontSize: 17, fontWeight: 600, color: pal.darkBrown, margin: "0 0 6px" },
  aspirationDetail: { fontFamily: ff.body, fontSize: 15.5, color: pal.inkMuted, lineHeight: 1.75, margin: 0 },
  adventureMap: { height: 380, width: "100%", border: `1px solid ${pal.rule}`, marginTop: 24, zIndex: 0 },
  adventureMapWrap: { marginTop: 24 },
  adventureLegend: {
    display: "flex", flexWrap: "wrap", gap: "10px 18px",
    marginTop: 10, padding: "0 2px",
  },
  adventureLegendItem: {
    display: "inline-flex", alignItems: "center", gap: 8,
    fontFamily: ff.meta, fontSize: 11, letterSpacing: "0.08em",
    textTransform: "uppercase", color: pal.lightBrown,
  },
  adventureLegendSwatch: {
    width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
    border: `1px solid ${pal.rule}`,
  },
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
    <div
      style={{ ...s.secHead, ...(first ? s.secHeadFirst : {}) }}
      className={`sec-head archive-settle${first ? " sec-head-first" : ""}`}
    >
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

const NICKNAME_HOLD_MS = 3800;
const NICKNAME_FADE_MS = 320;

/** Cycles one nickname; click “many names” to show the full list. */
function NicknameShuffle() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const timerRef = useRef(null);
  const fadeRef = useRef(null);
  const busyRef = useRef(false);

  function goNext() {
    if (busyRef.current || expanded) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setIndex((i) => (i + 1) % NICKNAMES.length);
      return;
    }
    busyRef.current = true;
    setVisible(false);
    if (fadeRef.current) clearTimeout(fadeRef.current);
    fadeRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % NICKNAMES.length);
      setVisible(true);
      busyRef.current = false;
      fadeRef.current = null;
    }, NICKNAME_FADE_MS);
  }

  function clearTimers() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (fadeRef.current) {
      clearTimeout(fadeRef.current);
      fadeRef.current = null;
    }
    busyRef.current = false;
  }

  function restartTimer() {
    clearTimers();
    setVisible(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || expanded) return;
    timerRef.current = window.setInterval(() => goNext(), NICKNAME_HOLD_MS);
  }

  useEffect(() => {
    if (expanded) {
      clearTimers();
      setVisible(true);
      return () => clearTimers();
    }
    restartTimer();
    return () => clearTimers();
  }, [expanded]);

  function onManyNamesClick(event) {
    event.preventDefault();
    setExpanded((open) => !open);
  }

  const name = NICKNAMES[index];
  const fullList = NICKNAMES.map((n, i) => (
    <span key={n}>
      <em>{n}</em>
      {i < NICKNAMES.length - 2 ? ", " : i === NICKNAMES.length - 2 ? ", and " : ""}
    </span>
  ));

  return (
    <>
      <button
        type="button"
        style={s.nicknameMany}
        className="nickname-many"
        onClick={onManyNamesClick}
        aria-expanded={expanded}
        aria-label={expanded ? "Hide full nickname list" : "Show all nicknames"}
      >
        many names
      </button>
      {", among them "}
      {expanded ? (
        <span className="nickname-list">{fullList}</span>
      ) : (
        <em
          className={`nickname-cycle${visible ? " is-in" : " is-out"}`}
          aria-live="polite"
        >
          {name}
        </em>
      )}
    </>
  );
}

function MarginPhotos({ tab }) {
  const railRef = useRef(null);
  const byFile = new Map(GALLERY_PHOTOS.map((p) => [p.file, p]));
  const scene = getTabScene(tab);
  const photos = scene.photos
    .map(({ file, position }) => {
      const entry = byFile.get(file);
      return entry ? { ...entry, position } : null;
    })
    .filter(Boolean);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    let raf = 0;
    const update = () => {
      raf = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const t = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      rail.style.setProperty("--margin-drift", `${t * 36}`);
      rail.style.setProperty("--margin-breathe", String(0.82 + t * 0.12));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [tab]);

  return (
    <aside ref={railRef} className="margin-photo-rail" aria-hidden="true">
      <div key={tab} className="margin-photo-set">
        {photos.map(({ file, taken, position }, index) => (
          <figure key={`${tab}-${file}`} className={`margin-photo margin-photo--${index + 1}`}>
            <img
              src={photoSrc(file, "thumb")}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ objectPosition: position }}
            />
            <figcaption className="margin-photo__caption">{formatPhotoTaken(taken)}</figcaption>
          </figure>
        ))}
      </div>
    </aside>
  );
}

function AnimatedCount({ value, suffix = "", style }) {
  const accessibleValue = `${value}${suffix ? ` ${suffix}` : ""}`;
  return (
    <div style={style} aria-label={accessibleValue}>
      <span aria-hidden="true">
        {value}{suffix ? ` ${suffix}` : ""}
      </span>
    </div>
  );
}

/** One-shot ledger ink-fill for age / weight / ticks. */
function InkLedger({ children, className = "", style, "aria-label": ariaLabel }) {
  const ref = useRef(null);
  const [inked, setInked] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inked) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setInked(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setInked(true);
      },
      { threshold: 0.45 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inked]);

  return (
    <span
      ref={ref}
      className={`ink-ledger${inked ? " is-inked" : ""}${className ? ` ${className}` : ""}`}
      style={style}
      aria-label={ariaLabel}
    >
      <span className="ink-ledger__glyph" aria-hidden={ariaLabel ? "true" : undefined}>
        {children}
      </span>
    </span>
  );
}

/** One-shot rubber-seal press when host enters view. */
function SpecimenStamp({ label = "Specimen" }) {
  const ref = useRef(null);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || pressed) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const run = () => setPressed(true);

    if (reduce) {
      run();
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pressed]);

  return (
    <div
      ref={ref}
      className={`specimen-stamp${pressed ? " is-pressed" : ""}`}
      aria-hidden="true"
    >
      <div className="specimen-stamp__ring">
        <span className="specimen-stamp__label">{label}</span>
      </div>
    </div>
  );
}

function VitalStatsColumn({ onTabChange, totalTicks }) {
  return (
    <aside className="profile-stats-col archive-settle" style={s.profileStatsCol}>
      <SectionHead title="Vital Statistics" first />
      <div style={s.statCard} className="stat-card">
        <div style={s.statAsideStack}>
          <div style={s.statBox}>
            <div style={s.statLabel}>Species</div>
            <div style={{ ...s.fieldValue, marginTop: 4 }}>Samoyed</div>
            <div style={s.statNote}>Canis lupus familiaris</div>
          </div>
          <div style={s.statBox}>
            <div style={s.statLabel}>Birth date</div>
            <div style={{ ...s.fieldValue, marginTop: 4 }}>September 16, 2024</div>
            <div style={s.statNote}>Exactly 00:00:00. Of course.</div>
          </div>
          <div
            style={{ ...s.statBox, ...s.statBoxLink }}
            className="stat-box-link"
            role="button"
            tabIndex={0}
            onClick={() => onTabChange("character")}
            onKeyDown={(e) => statKeyActivate(e, () => onTabChange("character"))}
          >
            <AnimatedCount value={ALL_TRICKS.length} style={s.statNum} />
            <div style={s.statLabel}>Known tricks</div>
            <div style={s.statNote}>Sit through Go · see Trick Repertoire</div>
          </div>
          <div style={s.statBox}>
            <AnimatedCount value={20} suffix="quintillion" style={{ ...s.statNum, fontSize: 17, paddingTop: 2 }} />
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
            <InkLedger style={s.statNum} aria-label={`${totalTicks}`}>
              {totalTicks}
            </InkLedger>
            <div style={s.statLabel}>Ticks hosted</div>
            <div style={s.statNote}>Two hikes · see Tick Tracker</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function LooksBlock() {
  return (
    <div style={s.looksCard} className="looks-card specimen-stamp-host">
      <SpecimenStamp />
      <img
        style={s.looksCutout}
        className="looks-cutout"
        src={cutoutSrc(CUTOUTS.running)}
        alt="Zero running"
        loading="lazy"
        decoding="async"
      />
      <p style={s.looksLead}>
        The cutest little fluff ball you've ever seen. Everyone falls for him.
      </p>
      <div style={s.looksField}>
        <p style={s.fieldLabel}>Coat</p>
        <p style={s.fieldValue}>Snow-white</p>
        <p style={s.fieldSub}>A cloud in dog form, with party pants.</p>
      </div>
      <div style={s.looksField}>
        <p style={s.fieldLabel}>Weight</p>
        <p style={s.fieldValue}>
          <InkLedger aria-label="50 lbs">50 lbs</InkLedger>
        </p>
        <p style={s.fieldSub}>Approximately half is fur</p>
      </div>
      <div style={{ ...s.looksField, marginBottom: 0 }}>
        <p style={s.fieldLabel}>Eyes</p>
        <p style={s.fieldValue}>Black</p>
        <p style={s.fieldSub}>Deep, dark, and soul-piercing.</p>
      </div>
    </div>
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
        Elapsed time since September 16, 2024, 00:00:00.
      </p>
    </div>
  );
}

function Aspirations() {
  return (
    <div className="aspirations-board archive-settle">
      {ASPIRATION_GROUPS.map((group) => (
        <section key={group.group} className="aspiration-group">
          <h3 className="aspiration-group__title">{group.group}</h3>
          <div className="aspiration-group__items">
            {group.items.map((item) => (
              <div key={item.title} className="aspiration-item">
                <h4 style={s.aspirationTitle}>{item.title}</h4>
                <p style={s.aspirationDetail}>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SamoyedHistory() {
  return (
    <div style={{ ...s.proseCard, ...s.historyBlock }} className="prose-card">
      {SAMOYED_HISTORY.map((paragraph, i) => (
        <p key={i} style={{ ...s.proseParagraph, marginBottom: i === SAMOYED_HISTORY.length - 1 ? 0 : 16 }}>{paragraph}</p>
      ))}
    </div>
  );
}

function AdventureMap() {
  const wrapRef = useRef(null);
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [shouldInit, setShouldInit] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldInit(true);
        obs.disconnect();
      },
      { rootMargin: "220px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldInit || !containerRef.current || mapRef.current) return undefined;

    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView([37.2, -121.8], 8);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    const pinsWestToEast = [...ADVENTURE_PINS].sort((a, b) => a.lng - b.lng);
    pinsWestToEast.forEach((pin, i) => {
      const icon = L.divIcon({
        className: "adventure-pin",
        html: `<span class="adventure-pin__dot" style="--pin-accent:${pin.accent || pal.midBrown};--pin-delay:${i * 55}ms"></span>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      L.marker([pin.lat, pin.lng], { icon })
        .bindPopup(`<strong>${pin.name}</strong><br>${pin.detail}`)
        .addTo(map);
    });

    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [shouldInit]);

  return (
    <div ref={wrapRef} style={s.adventureMapWrap} className="adventure-map-wrap">
      <div
        ref={containerRef}
        style={{ ...s.adventureMap, marginTop: 0 }}
        className="adventure-map"
        aria-label="Map of Zero's adventures"
      />
      <div style={s.adventureLegend} className="adventure-map-legend" aria-label="Map legend">
        {ADVENTURE_GROUPS.map((group) => (
          <span key={group.type} style={s.adventureLegendItem}>
            <span
              style={{ ...s.adventureLegendSwatch, background: group.accent }}
              aria-hidden="true"
            />
            {group.type}
          </span>
        ))}
      </div>
    </div>
  );
}

function PlaySequence() {
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

  return (
    <figure style={s.playSequenceCard} className="play-sequence">
      <p style={s.playSequenceLabel}>At play</p>
      <div style={s.playSequenceFrame} className="play-sequence-frame">
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

function RepertoireBlock() {
  return (
    <div style={s.repertoireRow} className="repertoire-row archive-settle">
      <div style={s.repertoireTricks} className="repertoire-tricks">
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
      <PlaySequence />
    </div>
  );
}

function ModesOfOperation() {
  const [active, setActive] = useState(0);
  const mode = ZERO_MODES[active] ?? ZERO_MODES[0];

  return (
    <div style={s.modesPanel} className="modes-panel archive-settle">
      <div
        style={s.modesGrid}
        className="modes-grid"
        role="listbox"
        aria-label="Modes of operation"
      >
        {ZERO_MODES.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={item.name}
              type="button"
              role="option"
              aria-selected={isActive}
              className={`mode-card${isActive ? " is-active" : ""}`}
              style={{
                ...s.trickCard,
                ...s.modeCardBtn,
                background: isActive ? pal.white : (i % 2 === 0 ? pal.white : pal.parchment),
              }}
              onClick={() => setActive(i)}
            >
              <p style={s.trickNum}>Mode {String(i + 1).padStart(2, "0")}</p>
              <p style={s.trickName}>{item.name}</p>
              <p style={s.trickNote}>{item.blurb}</p>
            </button>
          );
        })}
      </div>
      <figure style={s.modesFigure} className="modes-figure">
        <img
          key={mode.cutout}
          style={s.modesCutout}
          className="modes-cutout"
          src={cutoutSrc(mode.cutout)}
          alt={`Zero, ${mode.name}`}
          loading="lazy"
          decoding="async"
        />
        <figcaption style={s.modesCaption}>{mode.caption}</figcaption>
      </figure>
    </div>
  );
}

function NamingNote() {
  return (
    <div style={s.namingCard} className="naming-card">
      <div>
        <p style={{ ...s.proseParagraph, marginBottom: 0 }}>
          Zero is named after Zero Skellington, the little ghost dog from <em>The Nightmare Before Christmas</em>.
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
      </figure>
    </div>
  );
}

function BirthRecord() {
  return (
    <div style={{ ...s.namingCard, marginBottom: 20 }} className="naming-card birth-record">
      <div className="birth-record__fields">
        <div className="birth-record__row">
          <p style={s.fieldLabel}>Birth Time</p>
          <p style={s.fieldValue}>00:00:00</p>
        </div>
        <div className="birth-record__row">
          <p style={s.fieldLabel}>Birth Date</p>
          <p style={s.fieldValue}>September 16, 2024</p>
        </div>
        <div className="birth-record__row">
          <p style={s.fieldLabel}>Given Name</p>
          <p style={s.fieldValue}>Zero*</p>
          <p style={{ ...s.fieldSub, marginTop: 4, lineHeight: 1.45, minHeight: 0 }}>
            * Named for Zero Skellington of <em>The Nightmare Before Christmas</em>, the ghost dog with the glowing nose.
          </p>
        </div>
      </div>
      <figure style={{ margin: 0, textAlign: "center" }}>
        <img
          style={{ ...s.namingImg, maxHeight: 240 }}
          src={cutoutSrc(CUTOUTS.skellington)}
          alt="Zero Skellington from The Nightmare Before Christmas"
          loading="lazy"
          decoding="async"
        />
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

  function activate() {
    onOpen(file, ref.current);
  }

  return (
    <figure
      ref={ref}
      style={s.photoCard}
      className="photo-card"
      data-photo-file={file}
    >
      <button
        type="button"
        className="photo-card__hit"
        onClick={activate}
        aria-label={`Open photo from ${caption}`}
      >
        <div style={s.photoFrame} className="photo-frame">
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
        <figcaption className="photo-archival-label">
          <p style={s.photoCaption} className="photo-caption">{caption}</p>
        </figcaption>
      </button>
    </figure>
  );
}

const GALLERY_BATCH = 12;

function PhotoGallery() {
  const [active, setActive] = useState(null);
  const [lightboxReady, setLightboxReady] = useState(false);
  const [lightboxClosing, setLightboxClosing] = useState(false);
  const [newestFirst, setNewestFirst] = useState(true);
  const [visibleCount, setVisibleCount] = useState(GALLERY_BATCH);
  const sentinelRef = useRef(null);
  const liftTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const returnFocusRef = useRef(null);
  const sorted = sortPhotosByTaken(newestFirst);
  const activePhoto = sorted.find((p) => p.file === active);
  const activeIndex = active ? sorted.findIndex((p) => p.file === active) : -1;
  const visible = sorted.slice(0, visibleCount);

  function showAdjacent(delta) {
    if (activeIndex < 0 || lightboxClosing) return;
    const nextIndex = (activeIndex + delta + sorted.length) % sorted.length;
    setActive(sorted[nextIndex].file);
    setLightboxReady(true);
  }

  function openPlate(file, plateEl) {
    if (liftTimerRef.current) {
      clearTimeout(liftTimerRef.current);
      liftTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    document.querySelectorAll(".photo-card.is-lifting").forEach((el) => {
      el.classList.remove("is-lifting");
    });

    returnFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLightboxClosing(false);

    if (reduce || !(plateEl instanceof HTMLElement)) {
      setActive(file);
      setLightboxReady(true);
      return;
    }

    plateEl.classList.add("is-lifting");
    setLightboxReady(false);
    liftTimerRef.current = setTimeout(() => {
      setActive(file);
      setLightboxReady(true);
      plateEl.classList.remove("is-lifting");
      liftTimerRef.current = null;
    }, 220);
  }

  function finishClose() {
    setActive(null);
    setLightboxReady(false);
    setLightboxClosing(false);
    const restore = returnFocusRef.current;
    returnFocusRef.current = null;
    if (restore instanceof HTMLElement) {
      requestAnimationFrame(() => restore.focus({ preventScroll: true }));
    }
  }

  function closeLightbox() {
    if (!active || lightboxClosing) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      finishClose();
      return;
    }

    setLightboxClosing(true);
    setLightboxReady(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      finishClose();
      closeTimerRef.current = null;
    }, 300);
  }

  useEffect(() => {
    setVisibleCount(GALLERY_BATCH);
  }, [newestFirst]);

  useEffect(() => () => {
    if (liftTimerRef.current) clearTimeout(liftTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

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

  useEffect(() => {
    if (!active || !lightboxReady || lightboxClosing) return undefined;

    const dialog = dialogRef.current;
    closeBtnRef.current?.focus({ preventScroll: true });

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }

      if (event.key === "Tab" && dialog) {
        const focusable = Array.from(
          dialog.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
        ).filter((node) => node instanceof HTMLElement && !node.hasAttribute("disabled"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const photos = sortPhotosByTaken(newestFirst);
      const currentIndex = photos.findIndex((p) => p.file === active);
      if (currentIndex < 0) return;
      const delta = event.key === "ArrowLeft" ? -1 : 1;
      const nextIndex = (currentIndex + delta + photos.length) % photos.length;
      setActive(photos[nextIndex].file);
      setLightboxReady(true);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, newestFirst, lightboxReady, lightboxClosing]);

  const lightboxClass = [
    "lightbox-shell",
    lightboxReady && !lightboxClosing ? "is-ready" : "",
    lightboxClosing ? "is-closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div style={s.gallerySortRow}>
        <button
          type="button"
          style={s.gallerySortBtn}
          className="gallery-sort-btn"
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
            onOpen={openPlate}
          />
        ))}
        {visibleCount < sorted.length && (
          <div ref={sentinelRef} style={{ gridColumn: "1 / -1", height: 4 }} aria-hidden="true" />
        )}
      </div>
      {active && activePhoto && (
        <div
          ref={dialogRef}
          style={s.lightbox}
          className={lightboxClass}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
        >
          <button ref={closeBtnRef} style={s.lightboxClose} onClick={closeLightbox} type="button">Close</button>
          <button
            type="button"
            className="lightbox-arrow"
            style={{ ...s.lightboxArrow, left: 22 }}
            aria-label="Previous photo"
            onClick={(event) => {
              event.stopPropagation();
              showAdjacent(-1);
            }}
          >
            ‹
          </button>
          <figure style={s.lightboxFigure} className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
            <img
              style={s.lightboxImg}
              src={photoSrc(active, "full")}
              alt={`Zero, ${formatPhotoTaken(activePhoto.taken)}`}
              decoding="async"
            />
            <figcaption style={s.lightboxCaption}>
              {formatPhotoTaken(activePhoto.taken)}
            </figcaption>
          </figure>
          <button
            type="button"
            className="lightbox-arrow"
            style={{ ...s.lightboxArrow, right: 22 }}
            aria-label="Next photo"
            onClick={(event) => {
              event.stopPropagation();
              showAdjacent(1);
            }}
          >
            ›
          </button>
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
  const initial = useRef(null);
  if (initial.current === null) initial.current = readInitialRoute();
  const [showCover, setShowCover] = useState(initial.current.showCover);
  const [coverExiting, setCoverExiting] = useState(false);
  const [tab, setTab] = useState(initial.current.tab);
  const [folioDir, setFolioDir] = useState(1);
  const [tickIncidents, setTickIncidents] = useState(INITIAL_TICKS);
  const [mastheadWagging, setMastheadWagging] = useState(false);
  const wagTimerRef = useRef(null);
  const totalTicks = tickIncidents.reduce((sum, i) => sum + (parseInt(i.count, 10) || 0), 0);
  const today = new Date();
  const nextBirthday = new Date(today.getFullYear(), 8, 16);
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
  const folioClass = folioDir < 0 ? "folio-back" : "folio-forward";
  const showArchive = !showCover || coverExiting;

  function handleTabChange(id) {
    if (id === tab) return;
    const from = TABS.findIndex((t) => t.id === tab);
    const to = TABS.findIndex((t) => t.id === id);
    setFolioDir(to >= from ? 1 : -1);
    setTab(id);
    try {
      window.history.replaceState(null, "", `#${id}`);
    } catch {
      /* ignore */
    }
    clearFootprints();
    setFootprintMode(TAB_FOOTPRINT_MODES[id] ?? "default");
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => {
      spawnChapterBeat(3);
    });
  }

  function finishEnterArchive() {
    markCoverEntered();
    setShowCover(false);
    setCoverExiting(false);
    setTab((prev) => prev || "profile");
    setFolioDir(1);
    clearFootprints();
    setFootprintMode(TAB_FOOTPRINT_MODES[tab] ?? TAB_FOOTPRINT_MODES.profile ?? "default");
    window.scrollTo({ top: 0, behavior: "auto" });
    try {
      window.history.replaceState(null, "", `#${tab || "profile"}`);
    } catch {
      /* ignore */
    }
    requestAnimationFrame(() => {
      spawnChapterBeat(3);
      const title = document.querySelector(".masthead-title");
      if (title instanceof HTMLElement) title.focus({ preventScroll: true });
    });
  }

  function beginCoverExit() {
    markCoverEntered();
    setCoverExiting(true);
    clearFootprints();
    setFootprintMode(TAB_FOOTPRINT_MODES[tab] ?? TAB_FOOTPRINT_MODES.profile ?? "default");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function openCover() {
    clearFootprints();
    window.scrollTo({ top: 0, behavior: "auto" });
    setCoverExiting(false);
    setShowCover(true);
  }

  function onMastheadCutoutClick(event) {
    if (event.detail !== 3) return;
    event.preventDefault();
    if (wagTimerRef.current) clearTimeout(wagTimerRef.current);
    setMastheadWagging(true);
    wagTimerRef.current = setTimeout(() => {
      setMastheadWagging(false);
      wagTimerRef.current = null;
    }, 800);
  }

  useEffect(() => () => {
    if (wagTimerRef.current) clearTimeout(wagTimerRef.current);
  }, []);

  useEffect(() => {
    if (showCover && !coverExiting) return undefined;
    setFootprintMode(TAB_FOOTPRINT_MODES[tab] ?? "default");
  }, [tab, showCover, coverExiting]);

  useEffect(() => {
    if (!showArchive) return undefined;
    const nodes = Array.from(document.querySelectorAll(".archive-settle"));
    if (!nodes.length) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      nodes.forEach((node) => {
        node.classList.remove("settle-pending");
        node.classList.add("is-settled");
      });
      return undefined;
    }

    nodes.forEach((node) => {
      node.classList.remove("is-settled", "settle-pending");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove("settle-pending");
          entry.target.classList.add("is-settled");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    const fold = window.innerHeight * 0.94;
    nodes.forEach((node) => {
      const top = node.getBoundingClientRect().top;
      if (top < fold) {
        node.classList.add("is-settled");
      } else {
        node.classList.add("settle-pending");
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [tab, showArchive]);

  const scene = getTabScene(tab);

  return (
    <>
      {showCover && (
        <CoverGate onEnter={finishEnterArchive} onExitStart={beginCoverExit} />
      )}
      {showArchive && (
    <LayerShell mood={scene.mood}>
      <link rel="stylesheet" href={FONT_LINK} />
      <style>{`
        * { box-sizing: border-box; }
        input, select, textarea, button:not(.masthead-title) { font-size: 16px !important; }
        @keyframes folio-forward {
          from {
            opacity: 0;
            transform: translateX(22px);
            box-shadow: -18px 0 28px rgba(44, 26, 14, 0.12);
          }
          to {
            opacity: 1;
            transform: translateX(0);
            box-shadow: 0 0 0 rgba(44, 26, 14, 0);
          }
        }
        @keyframes folio-back {
          from {
            opacity: 0;
            transform: translateX(-22px);
            box-shadow: 18px 0 28px rgba(44, 26, 14, 0.12);
          }
          to {
            opacity: 1;
            transform: translateX(0);
            box-shadow: 0 0 0 rgba(44, 26, 14, 0);
          }
        }
        .masthead-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          max-width: 16rem;
        }
        .masthead-meta-primary {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        .masthead-meta-zodiac {
          margin: 6px 0 0;
          padding: 0;
          color: ${pal.mastheadMuted};
          opacity: 0.75;
          font-size: 11px !important;
          letter-spacing: 0.04em;
          transition: color 0.2s ease, opacity 0.2s ease;
        }
        .masthead-meta-zodiac:hover {
          color: ${pal.accentLight};
          opacity: 1;
        }
        .masthead-meta-bday {
          opacity: 0.5;
          font-size: 11px !important;
          margin-top: 2px;
        }
        .masthead-cutout:hover { transform: translateY(-3px) rotate(-2deg); }
        .masthead-title:focus { outline: none; }
        .masthead-title:focus-visible {
          outline: 2px solid ${pal.mastheadMuted};
          outline-offset: 4px;
        }
        .masthead-title:hover { color: ${pal.accentLight}; }
        .masthead-title {
          font-size: 54px !important;
          line-height: 0.94 !important;
        }
        .tab-btn:hover { color: ${pal.darkBrown}; }
        .tab-btn.is-active {
          background: none !important;
          font-weight: 600;
          color: ${pal.darkBrown} !important;
        }
        .tab-btn-profile.is-active { border-bottom-color: ${pal.navy} !important; }
        .tab-btn-character.is-active { border-bottom-color: #C9893A !important; }
        .tab-btn-cosmos.is-active { border-bottom-color: #6B8FA3 !important; }
        .tab-btn-gallery.is-active { border-bottom-color: ${pal.accentLight} !important; }
        .tab-btn-records.is-active { border-bottom-color: ${pal.tickRed} !important; }
        .stat-box-link:hover {
          border-color: ${pal.accentLight} !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(44, 26, 14, 0.08);
        }
        .stat-box-link { transition: border-color 0.2s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; }
        .gallery-preview:hover { border-color: ${pal.accentLight}; }
        .photo-card { transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; }
        @media (min-width: 901px) {
          .profile-top-row {
            display: grid;
            grid-template-columns: minmax(280px, 320px) minmax(0, 1fr);
            gap: 28px;
            align-items: stretch;
          }
          .profile-stats-col,
          .profile-right-col {
            min-height: 0;
          }
          .profile-stats-col .stat-card {
            flex: 1;
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
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 4px !important;
            width: 100% !important;
            max-width: none !important;
            line-height: 1.45 !important;
          }
          .masthead-meta-primary {
            align-items: flex-start !important;
          }
          .masthead-meta-zodiac {
            margin: 4px 0 0 !important;
            text-align: left !important;
            max-width: none !important;
          }
          .masthead-meta-bday {
            opacity: 0.5 !important;
          }
          .masthead-title { font-size: 36px !important; }
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
          .masthead-cutout { width: 110px !important; height: 138px !important; }
          .adventure-card { grid-template-columns: 1fr minmax(110px, 140px) !important; gap: 14px !important; padding: 14px 16px !important; }
          .naming-card { grid-template-columns: 1fr !important; }
          .looks-cutout { float: none !important; display: block; width: 48% !important; max-width: 140px !important; margin: 0 auto 14px !important; }
          .pawmistry-card { grid-template-columns: 1fr !important; }
          .loves-cutout { width: 68px !important; max-height: 72% !important; }
          .modes-panel { grid-template-columns: 1fr !important; }
          .modes-grid { grid-template-columns: 1fr !important; }
          .modes-figure { min-height: 220px !important; order: -1; }
          .modes-cutout { max-height: 200px !important; }
          .tab-bar { margin-left: -4px; }
          .age-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .adventure-map { height: 260px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tab-panel, [role="tabpanel"] { animation: none !important; }
          .masthead-cutout, .stat-box-link, .photo-card, .tab-btn, .mode-card { transition: none !important; }
          .masthead-cutout:hover, .stat-box-link:hover, .photo-card:hover { transform: none !important; }
          .masthead-cutout.is-wagging { animation: none !important; }
          .modes-cutout { animation: none !important; }
          .photo-card.is-lifting { transform: none !important; }
          .lightbox-shell, .lightbox-shell.is-ready, .lightbox-shell.is-closing { opacity: 1 !important; transition: none !important; }
          .lightbox-shell.is-ready::before { animation: none !important; opacity: 0 !important; }
          .lightbox-shell.is-ready .lightbox-figure, .lightbox-shell.is-closing .lightbox-figure { animation: none !important; }
        }
        .leaflet-container { font-family: 'Source Serif 4', Georgia, serif; }
        .leaflet-popup-content-wrapper { border-radius: 0; border: 1px solid #C9A97A; }
        .cosmos-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(201, 169, 122, 0.35) 1px, transparent 1px);
          background-size: 52px 52px;
          opacity: 0.22;
          pointer-events: none;
        }
      `}</style>
      <div style={s.page} className="page-shell page-shell--layered">
        <MarginPhotos tab={tab} />

        <header style={s.masthead} className="site-masthead" data-tab={tab}>
          <div className="masthead-stars" aria-hidden="true">
            <span>✦</span>
            <span>✧</span>
            <span>·</span>
            <span>✦</span>
            <span>✧</span>
            <span>·</span>
            <span>✦</span>
            <span>✧</span>
            <span>·</span>
            <span>✦</span>
          </div>
          <div style={s.mastheadInner} className="masthead-inner">
            <div style={s.mastheadLeft} className="masthead-left">
              <div className="masthead-portrait">
                <img
                  style={s.mastheadCutout}
                  className={`masthead-cutout${mastheadWagging ? " is-wagging" : ""}`}
                  src={cutoutSrc(CUTOUTS.happyFace)}
                  alt="Zero, happy face"
                  fetchPriority="high"
                  decoding="async"
                  width={118}
                  height={148}
                  onClick={onMastheadCutoutClick}
                />
              </div>
              <div>
                <p style={s.siteLabel}>Specimen Record · Canine Division</p>
                <h1 style={{ margin: 0, lineHeight: 0.94 }}>
                  <button
                    type="button"
                    style={s.mastheadTitle}
                    className="masthead-title"
                    onClick={openCover}
                    aria-label="Return to cover portrait"
                  >
                    Zero
                  </button>
                </h1>
                <p style={s.mastheadSub}>Samoyed · San Francisco, CA</p>
              </div>
            </div>
            <div style={s.mastheadMeta} className="masthead-meta">
              <div className="masthead-meta-primary">
                <div className="masthead-meta-born">Born September 16, 2024</div>
                <div className="masthead-meta-age">
                  <InkLedger aria-label={getAge(BIRTHDAY)}>{getAge(BIRTHDAY)}</InkLedger>
                </div>
              </div>
              <button
                type="button"
                className="masthead-meta-zodiac"
                style={{ ...s.mastheadMetaSub, ...s.mastheadLink }}
                onClick={() => handleTabChange("cosmos")}
              >
                {STAR_SIGN.symbol} {STAR_SIGN.name} · {CHINESE_ZODIAC.character} {CHINESE_ZODIAC.name}
              </button>
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
            He goes by <NicknameShuffle />.
          </p>

          <TabBar active={tab} onChange={handleTabChange} />

          {tab === "profile" && (
            <div style={s.tabPanel} className={`tab-panel ${folioClass}`} key={tab} role="tabpanel" id="panel-profile" aria-labelledby="tab-profile">
              <SectionHead title="On the Name" first />
              <NamingNote />

              <div className="profile-top-row">
                <VitalStatsColumn onTabChange={handleTabChange} totalTicks={totalTicks} />

                <div className="profile-right-col" style={s.profileRightCol}>
                  <SectionHead title="Looks" first />
                  <LooksBlock />
                  <GalleryPreview onOpenGallery={() => handleTabChange("gallery")} />
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
            <div style={s.tabPanel} className={`tab-panel ${folioClass}`} key={tab} role="tabpanel" id="panel-character" aria-labelledby="tab-character">
              <SectionHead title="Trick Repertoire" first />
              <RepertoireBlock />

              <SectionHead title="Modes of Operation" />
              <ModesOfOperation />

              <SectionHead title="Favorite Activities" />
              <div style={s.activitiesGrid} className="two-col-grid">
                <div style={{ ...s.activitiesCard, ...s.lovesCard }} className="loves-card activities-card">
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
                <div style={{ ...s.activitiesCard, background: pal.white }} className="activities-card">
                  <p style={s.activitiesCardTitle}>Would rather not</p>
                  {DISLIKES.map((item, i) => (
                    <div key={item} style={{ ...s.activityItem, borderBottom: i === DISLIKES.length - 1 ? "none" : s.activityItem.borderBottom }}>
                      <div style={s.dislikeDot} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <SectionHead title="Aspirations" />
              <Aspirations />

              <SectionHead title="About the Samoyed" />
              <div style={s.factsGrid} className="two-col-grid">
                {SAMOYED_FACTS.map((f, i) => (
                  <div key={f.label} style={{ ...s.factCard, background: i % 2 === 0 ? pal.white : pal.parchment }} className="fact-card">
                    <p style={s.factLabel} className="fact-label">{f.label}</p>
                    <p style={s.factValue}>{f.value}</p>
                    <p style={s.factDetail}>{f.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "cosmos" && (
            <div
              className={`tab-panel ${folioClass}`}
              key="cosmos-folio"
              role="tabpanel"
              id="panel-cosmos"
              aria-labelledby="tab-cosmos"
            >
              <SectionHead title="Time on Earth" first />
              <LiveAgeCounter />
              <div style={{ marginTop: 28 }}>
                <CosmosTab starSign={STAR_SIGN} chineseZodiac={CHINESE_ZODIAC} />
              </div>
            </div>
          )}

          {tab === "albedo" && (
            <div
              className={`tab-panel ${folioClass}`}
              key="albedo-folio"
              role="tabpanel"
              id="panel-albedo"
              aria-labelledby="tab-albedo"
            >
              <AlbedoTab />
            </div>
          )}

          {tab === "gallery" && (
            <div style={s.tabPanel} className={`tab-panel ${folioClass}`} key={tab} role="tabpanel" id="panel-gallery" aria-labelledby="tab-gallery">
              <SectionHead title="Photographic Record" first />
              <div className="gallery-archive-shell archive-settle">
                <PhotoGallery />
              </div>
            </div>
          )}

          {tab === "records" && (
            <div style={s.tabPanel} className={`tab-panel ${folioClass} specimen-stamp-host`} key={tab} role="tabpanel" id="panel-records" aria-labelledby="tab-records">
              <SpecimenStamp />
              <SectionHead title="Birth Record" first />
              <BirthRecord />

              <SectionHead title="Tick Tracker" />
              <TickTracker incidents={tickIncidents} setIncidents={setTickIncidents} />

              <SectionHead title="Historical Record" />
              <SamoyedHistory />
            </div>
          )}

          <footer className="page-footer">
            <p className="page-footer__note">Record ongoing.</p>
            <p className="page-footer__meta">Zero · Samoyed · San Francisco</p>
          </footer>
        </main>
      </div>
    </LayerShell>
      )}
    </>
  );
}
