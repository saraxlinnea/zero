import { useState, useEffect } from "react";
import { PHOTOS } from "./photos.js";

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap";

const BIRTHDAY = new Date("2024-09-16");

const NICKNAMES = [
  "Zerowski", "Little Zero", "Little Floof", "Little Dragon", "Little Polar Bear",
  "Baby Zero", "Baby Boy", "Cutie Pie", "Chicken Wing", "Mr. Zero",
  "Little Cloud", "Little Boy", "Sweetie Pie", "Little Bear", "Handsome boy", "Little Lamb",
];

const STAR_SIGN = {
  name: "Virgo",
  symbol: "♍",
  blurb:
    "Born under Virgo, Zero approaches every walk with the precision of a field researcher, nose to the ground, cataloguing each scent with methodical devotion. Virgos are loyal, attentive, and quietly industrious. He may appear to be simply sniffing a fire hydrant, but he is, in fact, conducting a thorough peer review.",
};

const CHINESE_ZODIAC = {
  name: "Wood Dragon",
  character: "龍",
  pinyin: "lóng",
  blurb:
    "The Wood Dragon is charismatic, confident, and perpetually convinced that the entire room has gathered specifically to admire him. He is correct. Wood Dragons are generous in spirit and vigorous in play. Zero embodies this sign fully: he enters every space like a visiting dignitary and accepts belly rubs as tribute.",
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

const ADVENTURES = [
  "Cross-country skiing — Nevada Nordic, Lake Tahoe",
  "Star Lake hike — Lake Tahoe",
  "Santa Cruz hike",
  "San Jose hills hike",
  "Fort Funston — South San Francisco",
];

const CUTOUTS = {
  happyFace: "zero-happy-face.png",
  running: "zero-running.png",
  headMassage: "zero-head-massage.png",
  dirty: "dirty-zero.png",
};

const DISLIKES = [
  "Putting on his harness",
  "Getting blow dried",
  "Getting washed",
  "Being alone",
  "Cuddling when too hot",
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
  { name: "Shake a Paw", note: null },
  { name: "Circus", note: null },
  { name: "Bow", note: "also known as Bow Chica Wow Wow" },
  { name: "Spin", note: null },
  { name: "Reverse Spin", note: "also known as Ambiturner" },
];

const INITIAL_TICKS = [
  { id: 1, date: "2025-05-03", location: "Coastal hike, Santa Cruz", count: 12, notes: "All 12 found and removed after the hike. Zero was unperturbed." },
];

const PAGE_MAX = 1200;

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "character", label: "Character" },
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
  mastheadRule: { borderTop: `1px solid ${pal.mastheadMuted}`, opacity: 0.3, margin: 0 },
  main: { maxWidth: PAGE_MAX, margin: "0 auto", padding: "44px 36px 80px" },
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
  },
  tabBtnActive: {
    color: pal.darkBrown, borderBottom: `2px solid ${pal.darkBrown}`, fontWeight: 500,
  },
  tabPanel: { minHeight: 320 },
  secHead: { display: "flex", alignItems: "baseline", gap: 16, marginBottom: 22, marginTop: 52 },
  secHeadFirst: { marginTop: 0 },
  secTitle: { fontFamily: ff.display, fontSize: 22, fontWeight: 600, color: pal.darkBrown, margin: 0, lineHeight: 1 },
  secRule: { flex: 1, height: 1, background: pal.rule, opacity: 0.45, border: "none" },
  statRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 0 },
  statSection: {
    display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "end",
    marginBottom: 32,
  },
  statCutout: {
    width: 140, height: 140, objectFit: "contain", objectPosition: "bottom",
    filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.2))",
  },
  statBox: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "16px 18px" },
  statNum: { fontFamily: ff.display, fontSize: 30, fontWeight: 700, color: pal.darkBrown, lineHeight: 1 },
  statLabel: { fontFamily: ff.body, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: pal.lightBrown, marginTop: 5 },
  statNote: { fontFamily: ff.body, fontStyle: "italic", fontSize: 12, color: pal.inkMuted, marginTop: 4, lineHeight: 1.4 },
  specimenCard: {
    background: pal.white, border: `1px solid ${pal.rule}`,
    padding: "30px 34px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px",
  },
  fieldLabel: { fontFamily: ff.body, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: pal.lightBrown, marginBottom: 2 },
  fieldValue: { fontFamily: ff.display, fontSize: 17, color: pal.darkBrown, fontWeight: 600, margin: 0, lineHeight: 1.3 },
  fieldSub: { fontFamily: ff.body, fontStyle: "italic", fontSize: 14, color: pal.inkMuted, lineHeight: 1.6, marginTop: 3 },
  fieldBlock: { marginBottom: 24 },
  dividerFull: { gridColumn: "1 / -1", borderTop: `1px solid ${pal.rule}`, opacity: 0.4, margin: "4px 0 22px" },
  // activities
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
  zodiacGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  zodiacCard: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "24px 28px" },
  zodiacSymbol: { fontFamily: ff.display, fontSize: 40, color: pal.accentLight, lineHeight: 1, marginBottom: 8 },
  zodiacName: { fontFamily: ff.display, fontSize: 20, fontWeight: 700, color: pal.darkBrown, margin: "0 0 10px" },
  zodiacBlurb: { fontFamily: ff.body, fontSize: 14.5, color: pal.inkMuted, lineHeight: 1.8, margin: 0 },
  factsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  factCard: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "16px 20px" },
  factLabel: { fontFamily: ff.body, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: pal.lightBrown, marginBottom: 3 },
  factValue: { fontFamily: ff.display, fontSize: 16, fontWeight: 600, color: pal.darkBrown, margin: "0 0 6px" },
  factDetail: { fontFamily: ff.body, fontSize: 13.5, color: pal.inkMuted, lineHeight: 1.7, margin: 0 },
  tricksGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 },
  trickCard: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "14px 18px" },
  trickNum: { fontFamily: ff.body, fontSize: 10, letterSpacing: "0.14em", color: pal.accentLight, textTransform: "uppercase", marginBottom: 3 },
  trickName: { fontFamily: ff.display, fontSize: 16, fontWeight: 600, color: pal.darkBrown, margin: 0 },
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
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 },
  photoCard: { background: pal.white, border: `1px solid ${pal.rule}`, overflow: "hidden", margin: 0, cursor: "pointer" },
  photoImg: { width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" },
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
  },
  lovesCard: { position: "relative" },
  lovesCutout: {
    width: "100%", maxWidth: 140, objectFit: "contain", display: "block",
    margin: "16px auto 0", filter: "drop-shadow(0 2px 6px rgba(44,26,14,0.12))",
  },
  adventureGrid: {
    display: "grid", gridTemplateColumns: "1fr auto", gap: 28, alignItems: "center",
    background: pal.white, border: `1px solid ${pal.rule}`, padding: "28px 32px",
  },
  adventureList: { margin: 0, padding: 0, listStyle: "none" },
  adventureItem: {
    fontFamily: ff.body, fontSize: 15, color: pal.inkMuted, lineHeight: 1,
    padding: "9px 0", borderBottom: `1px solid rgba(201,169,122,0.2)`,
    display: "flex", alignItems: "center", gap: 10,
  },
  adventureCutout: {
    width: 180, objectFit: "contain", display: "block",
    filter: "drop-shadow(0 3px 8px rgba(44,26,14,0.15))",
  },
  adventureCaption: {
    fontFamily: ff.body, fontStyle: "italic", fontSize: 12, color: pal.lightBrown,
    textAlign: "center", marginTop: 8,
  },
  ageGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 0 },
  ageBox: { background: pal.white, border: `1px solid ${pal.rule}`, padding: "18px 14px", textAlign: "center" },
  ageNum: { fontFamily: ff.display, fontSize: 28, fontWeight: 700, color: pal.darkBrown, lineHeight: 1, fontVariantNumeric: "tabular-nums" },
  ageLabel: { fontFamily: ff.body, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: pal.lightBrown, marginTop: 6 },
  ageNote: { fontFamily: ff.body, fontStyle: "italic", fontSize: 13, color: pal.inkMuted, marginTop: 14, lineHeight: 1.6 },
};

function cutoutSrc(name) {
  return `${import.meta.env.BASE_URL}cutouts/${name}`;
}

function SectionHead({ title, first = false }) {
  return (
    <div style={{ ...s.secHead, ...(first ? s.secHeadFirst : {}) }}>
      <h2 style={s.secTitle}>{title}</h2>
      <hr style={s.secRule} />
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
      <p style={s.ageNote}>Precise elapsed time since September 16, 2024. Zero has been on Earth for every second of it.</p>
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
            style={{ ...s.tabBtn, ...(isActive ? s.tabBtnActive : {}) }}
            onClick={() => onChange(id)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function PhotoGallery() {
  const [active, setActive] = useState(null);
  const base = import.meta.env.BASE_URL;

  return (
    <>
      <div style={s.photoGrid} className="photo-grid">
        {PHOTOS.map((name) => (
          <figure key={name} style={s.photoCard} onClick={() => setActive(name)}>
            <img
              style={s.photoImg}
              src={`${base}photos/${name}`}
              alt={`Zero — ${name.replace(/\.[^.]+$/, "")}`}
              loading="lazy"
            />
          </figure>
        ))}
      </div>
      {active && (
        <div style={s.lightbox} onClick={() => setActive(null)} role="dialog" aria-modal="true" aria-label="Photo preview">
          <button style={s.lightboxClose} onClick={() => setActive(null)} type="button">Close</button>
          <img
            style={s.lightboxImg}
            src={`${base}photos/${active}`}
            alt={`Zero — ${active.replace(/\.[^.]+$/, "")}`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

function TickTracker() {
  const today = new Date().toISOString().split("T")[0];
  const [incidents, setIncidents] = useState(INITIAL_TICKS);
  const [form, setForm] = useState({ date: today, location: "", count: "", notes: "" });
  const [showForm, setShowForm] = useState(false);
  const totalTicks = incidents.reduce((sum, i) => sum + (parseInt(i.count) || 0), 0);

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
              <td style={s.td}>{inc.location || "—"}</td>
              <td style={{ ...s.td, fontStyle: "italic" }}>{inc.notes || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("profile");
  const today = new Date();
  const nextBirthday = new Date(today.getFullYear(), 8, 16);
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

  return (
    <>
      <link rel="stylesheet" href={FONT_LINK} />
      <style>{`
        * { box-sizing: border-box; }
        input, select, textarea, button { font-size: 16px !important; }
        @media (max-width: 600px) {
          .masthead-inner { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; padding: 20px 20px 18px !important; }
          .masthead-meta { text-align: left !important; display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px 20px !important; width: 100% !important; }
          .masthead-meta-sub { opacity: 0.65; }
          .masthead-meta-sub:last-child { opacity: 0.55; }
          .stat-section { grid-template-columns: 1fr !important; }
          .stat-cutout { margin: 0 auto; width: 120px !important; height: 120px !important; }
          .masthead-title { font-size: 28px !important; }
          .main-content { padding: 28px 20px 60px !important; }
          .two-col-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .form-row-grid { grid-template-columns: 1fr !important; }
          .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .log-stat-row { flex-wrap: wrap; }
          .photo-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .masthead-left { align-items: flex-start !important; }
          .masthead-cutout { width: 72px !important; height: 72px !important; }
          .adventure-grid { grid-template-columns: 1fr !important; }
          .adventure-cutout-wrap { text-align: center; }
          .tab-bar { margin-left: -4px; }
          .age-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
      <div style={s.page}>

        <header style={s.masthead}>
          <div style={s.mastheadInner} className="masthead-inner">
            <div style={s.mastheadLeft} className="masthead-left">
              <img
                style={s.mastheadCutout}
                className="masthead-cutout"
                src={cutoutSrc(CUTOUTS.happyFace)}
                alt="Zero — happy face"
              />
              <div>
                <p style={s.siteLabel}>Specimen Record · Canine Division</p>
                <h1 style={s.mastheadTitle} className="masthead-title">Zero</h1>
                <p style={s.mastheadSub}>Samoyed · San Francisco, CA</p>
              </div>
            </div>
            <div style={s.mastheadMeta} className="masthead-meta">
              <div>Born September 16, 2024</div>
              <div className="masthead-meta-sub" style={s.mastheadMetaSub}>
                {STAR_SIGN.symbol} {STAR_SIGN.name} · {CHINESE_ZODIAC.character} {CHINESE_ZODIAC.name}
              </div>
              <div>{getAge(BIRTHDAY)}</div>
              <div className="masthead-meta-sub" style={s.mastheadMetaSub}>
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

          <TabBar active={tab} onChange={setTab} />

          {tab === "profile" && (
            <div style={s.tabPanel} role="tabpanel" id="panel-profile" aria-labelledby="tab-profile">
              <SectionHead title="Vital Statistics" first />
              <div style={s.statSection} className="stat-section">
                <div style={s.statRow} className="stat-grid">
                  <div style={s.statBox}>
                    <div style={s.statNum}>{ALL_TRICKS.length}</div>
                    <div style={s.statLabel}>Known tricks</div>
                    <div style={s.statNote}>Sit through Ambiturner</div>
                  </div>
                  <div style={s.statBox}>
                    <div style={{ ...s.statNum, fontSize: 18, paddingTop: 8 }}>20 quintillion</div>
                    <div style={s.statLabel}>Living animals (est.)</div>
                    <div style={s.statNote}>Mostly insects and roundworms. Zero intends to meet every one.</div>
                  </div>
                  <div style={s.statBox}>
                    <div style={s.statNum}>12+</div>
                    <div style={s.statLabel}>Ticks hosted</div>
                    <div style={s.statNote}>One coastal hike. He was a gracious host.</div>
                  </div>
                </div>
                <img
                  style={s.statCutout}
                  className="stat-cutout"
                  src={cutoutSrc(CUTOUTS.running)}
                  alt="Zero running"
                />
              </div>

              <SectionHead title="Field Notes" />
              <div style={s.specimenCard} className="two-col-grid">
                <div style={s.fieldBlock}>
                  <p style={s.fieldLabel}>Common Name</p>
                  <p style={s.fieldValue}>Zero</p>
                </div>
                <div style={s.fieldBlock}>
                  <p style={s.fieldLabel}>Species</p>
                  <p style={s.fieldValue}>Samoyed</p>
                  <p style={s.fieldSub}>Canis lupus familiaris</p>
                </div>
                <div style={s.fieldBlock}>
                  <p style={s.fieldLabel}>Date of Record</p>
                  <p style={s.fieldValue}>September 16, 2024</p>
                </div>
                <div style={s.fieldBlock}>
                  <p style={s.fieldLabel}>Location</p>
                  <p style={s.fieldValue}>San Francisco, CA</p>
                  <p style={s.fieldSub}>Marina neighborhood</p>
                </div>
                <div style={s.fieldBlock}>
                  <p style={s.fieldLabel}>Weight</p>
                  <p style={s.fieldValue}>50 lbs</p>
                </div>
                <div style={s.fieldBlock}>
                  <p style={s.fieldLabel}>Coat</p>
                  <p style={s.fieldValue}>Snow-white</p>
                  <p style={s.fieldSub}>A cloud in dog form, with party pants.</p>
                </div>
                <div style={s.fieldBlock}>
                  <p style={s.fieldLabel}>Eyes</p>
                  <p style={s.fieldValue}>Soulful black eyes</p>
                  <p style={s.fieldSub}>Deep, dark, and expressive. He knows exactly what he is doing with them.</p>
                </div>
                <div style={s.fieldBlock}>
                  <p style={s.fieldLabel}>Social Disposition</p>
                  <p style={s.fieldValue}>Loves everyone</p>
                  <p style={s.fieldSub}>20 quintillion living animals, without exception or reservation. He is working through the list.</p>
                </div>
                <div style={s.fieldBlock}>
                  <p style={s.fieldLabel}>AKC Classification</p>
                  <p style={s.fieldValue}>Working Group</p>
                  <p style={s.fieldSub}>Bred to pull sleds and guard homes. Currently applying this ethic to the couch.</p>
                </div>
              </div>

              <SectionHead title="Favorite Activities" />
              <div style={s.activitiesGrid} className="two-col-grid">
                <div style={{ ...s.activitiesCard, ...s.lovesCard }}>
                  <p style={s.activitiesCardTitle}>Loves</p>
                  {LIKES.map((item, i) => (
                    <div key={item} style={{ ...s.activityItem, borderBottom: i === LIKES.length - 1 ? "none" : s.activityItem.borderBottom }}>
                      <div style={s.activityDot} />
                      {item}
                    </div>
                  ))}
                  <img
                    style={s.lovesCutout}
                    src={cutoutSrc(CUTOUTS.headMassage)}
                    alt="Zero receiving a head massage"
                  />
                </div>
                <div style={s.activitiesCard}>
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
              <div style={s.adventureGrid} className="adventure-grid">
                <ul style={s.adventureList}>
                  {ADVENTURES.map((item, i) => (
                    <li key={item} style={{ ...s.adventureItem, borderBottom: i === ADVENTURES.length - 1 ? "none" : s.adventureItem.borderBottom }}>
                      <div style={s.activityDot} />
                      {item}
                    </li>
                  ))}
                </ul>
                <figure className="adventure-cutout-wrap" style={{ margin: 0 }}>
                  <img
                    style={s.adventureCutout}
                    src={cutoutSrc(CUTOUTS.dirty)}
                    alt="Zero after an adventure"
                  />
                  <figcaption style={s.adventureCaption}>Field condition: acceptable.</figcaption>
                </figure>
              </div>
            </div>
          )}

          {tab === "character" && (
            <div style={s.tabPanel} role="tabpanel" id="panel-character" aria-labelledby="tab-character">
              <SectionHead title="Time on Earth" first />
              <LiveAgeCounter />

              <SectionHead title="Celestial Profile" />
              <div style={s.zodiacGrid} className="two-col-grid">
                <div style={s.zodiacCard}>
                  <div style={s.zodiacSymbol}>{STAR_SIGN.symbol}</div>
                  <h3 style={s.zodiacName}>{STAR_SIGN.name}</h3>
                  <p style={s.zodiacBlurb}>{STAR_SIGN.blurb}</p>
                </div>
                <div style={s.zodiacCard}>
                  <div style={{ ...s.zodiacSymbol, fontFamily: ff.body }}>
                    {CHINESE_ZODIAC.character}
                    <span style={{ fontSize: 14, color: pal.lightBrown, marginLeft: 10, fontFamily: ff.body, fontStyle: "italic" }}>
                      {CHINESE_ZODIAC.pinyin}
                    </span>
                  </div>
                  <h3 style={s.zodiacName}>{CHINESE_ZODIAC.name}</h3>
                  <p style={s.zodiacBlurb}>{CHINESE_ZODIAC.blurb}</p>
                </div>
              </div>

              <SectionHead title="Repertoire" />
              <div style={s.tricksGrid}>
                {ALL_TRICKS.map((trick, i) => (
                  <div key={trick.name} style={s.trickCard}>
                    <p style={s.trickNum}>No. {String(i + 1).padStart(2, "0")}</p>
                    <p style={s.trickName}>{trick.name}</p>
                    {trick.note && <p style={s.trickNote}>{trick.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "breed" && (
            <div style={s.tabPanel} role="tabpanel" id="panel-breed" aria-labelledby="tab-breed">
              <SectionHead title="About the Samoyed" first />
              <div style={s.factsGrid} className="two-col-grid">
                {SAMOYED_FACTS.map(f => (
                  <div key={f.label} style={s.factCard}>
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
              <PhotoGallery />
            </div>
          )}

          {tab === "records" && (
            <div style={s.tabPanel} role="tabpanel" id="panel-records" aria-labelledby="tab-records">
              <SectionHead title="Tick Tracker" first />
              <TickTracker />
            </div>
          )}

        </main>
      </div>
    </>
  );
}
