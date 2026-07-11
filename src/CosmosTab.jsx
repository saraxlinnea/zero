import { getMoonPhaseInfo } from "./moon.js";
import { getDailyForecast, formatForecastDate } from "./forecasts.js";
import { getDailySkyNote } from "./sky.js";
import { PAW_LINES } from "./cosmos.js";

const BIRTHDAY = new Date("2024-09-16T00:00:00");

const cosmosPal = {
  ink: "#1A1428",
  inkMuted: "#4A3F5C",
  silver: "#7A6B94",
  gold: "#C9A97A",
  lavender: "#E8E0F5",
  lavenderMid: "#EDE8F4",
  lavenderLight: "#F7F3FC",
  border: "#C9B8E0",
  borderSoft: "rgba(201, 184, 224, 0.55)",
  glow: "rgba(155, 138, 184, 0.18)",
  night: "#2A2340",
  moonLit: "#F5ECD7",
};

const ff = {
  display: "'Playfair Display', Georgia, serif",
  body: "'EB Garamond', Georgia, serif",
};

const cs = {
  panel: {
    position: "relative",
    background: `linear-gradient(180deg, ${cosmosPal.lavenderLight} 0%, ${cosmosPal.lavenderMid} 55%, ${cosmosPal.lavender} 100%)`,
    border: `1px solid ${cosmosPal.border}`,
    padding: "28px 32px 36px",
    overflow: "hidden",
  },
  inner: { position: "relative", zIndex: 1 },
  secHead: { display: "flex", alignItems: "baseline", gap: 16, marginBottom: 22, marginTop: 48 },
  secHeadFirst: { marginTop: 0 },
  secStamp: { fontFamily: ff.display, fontSize: 15, color: cosmosPal.gold, lineHeight: 1, flexShrink: 0 },
  secTitle: { fontFamily: ff.display, fontSize: 22, fontWeight: 600, color: cosmosPal.ink, margin: 0, lineHeight: 1 },
  secRule: { flex: 1, height: 1, background: cosmosPal.border, opacity: 0.5, border: "none" },
  heroCard: {
    background: `linear-gradient(145deg, ${cosmosPal.lavenderLight} 0%, #F0EBFA 100%)`,
    border: `1px solid ${cosmosPal.borderSoft}`,
    borderLeft: `3px solid ${cosmosPal.gold}`,
    padding: "26px 30px",
    boxShadow: `0 8px 28px ${cosmosPal.glow}`,
  },
  heroDate: {
    fontFamily: ff.body, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
    color: cosmosPal.silver, marginBottom: 12,
  },
  heroText: {
    fontFamily: ff.display, fontSize: 21, color: cosmosPal.ink, lineHeight: 1.55,
    margin: 0, fontStyle: "italic",
  },
  heroNote: {
    fontFamily: ff.body, fontSize: 13.5, color: cosmosPal.inkMuted, marginTop: 16,
    lineHeight: 1.65, fontStyle: "italic",
  },
  zodiacGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  zodiacCard: {
    background: `linear-gradient(180deg, #FFFDF8 0%, ${cosmosPal.lavender} 100%)`,
    border: `1px solid ${cosmosPal.borderSoft}`,
    padding: "24px 28px",
    position: "relative",
  },
  cardOrnament: {
    position: "absolute", top: 12, right: 14,
    fontFamily: ff.display, fontSize: 12, color: cosmosPal.border, opacity: 0.7,
  },
  zodiacSymbol: { fontFamily: ff.display, fontSize: 44, color: cosmosPal.gold, lineHeight: 1, marginBottom: 8 },
  zodiacName: { fontFamily: ff.display, fontSize: 20, fontWeight: 700, color: cosmosPal.ink, margin: "0 0 10px" },
  zodiacBlurb: { fontFamily: ff.body, fontSize: 14.5, color: cosmosPal.inkMuted, lineHeight: 1.8, margin: "0 0 14px" },
  zodiacBlurbLast: { fontFamily: ff.body, fontSize: 14.5, color: cosmosPal.inkMuted, lineHeight: 1.8, margin: 0 },
  moonGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  moonCard: {
    background: `linear-gradient(180deg, #FFFDF8 0%, #EEF0F8 100%)`,
    border: `1px solid ${cosmosPal.borderSoft}`,
    padding: "24px 28px",
  },
  moonTop: { display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12 },
  fieldLabel: {
    fontFamily: ff.body, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
    color: cosmosPal.silver, marginBottom: 4,
  },
  moonIllum: { fontFamily: ff.body, fontSize: 12, color: cosmosPal.silver, fontStyle: "italic", margin: "4px 0 10px" },
  moonPhaseLine: { fontFamily: ff.body, fontSize: 13.5, color: cosmosPal.inkMuted, lineHeight: 1.55, margin: "0 0 8px" },
  moonPhaseLabel: {
    fontFamily: ff.body, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: cosmosPal.silver,
  },
  illumBar: { height: 4, background: cosmosPal.border, borderRadius: 2, marginTop: 6, overflow: "hidden" },
  illumFill: { height: "100%", background: cosmosPal.gold, borderRadius: 2 },
  pawCard: {
    background: `linear-gradient(180deg, #FFFDF8 0%, ${cosmosPal.lavenderMid} 100%)`,
    border: `1px solid ${cosmosPal.borderSoft}`,
    padding: "16px 18px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(120px, 160px)",
    gap: 16,
    alignItems: "start",
  },
  pawGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 },
  pawLineCard: {
    background: "rgba(255, 253, 248, 0.7)",
    border: `1px solid ${cosmosPal.borderSoft}`,
    padding: "8px 10px",
  },
  pawLine: {
    fontFamily: ff.body, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
    color: cosmosPal.gold, marginBottom: 1,
  },
  pawPad: { fontFamily: ff.body, fontSize: 10, color: cosmosPal.silver, fontStyle: "italic", marginBottom: 3 },
  pawReading: { fontFamily: ff.body, fontSize: 12.5, color: cosmosPal.inkMuted, lineHeight: 1.4, margin: 0 },
  pawFigure: { margin: 0, textAlign: "center", alignSelf: "center" },
  pawImg: {
    width: "100%", maxWidth: 150, height: "auto", objectFit: "contain",
    filter: "drop-shadow(0 4px 12px rgba(26, 20, 40, 0.18))",
  },
  pawCaption: {
    fontFamily: ff.body, fontStyle: "italic", fontSize: 10, color: cosmosPal.silver,
    margin: "6px 0 0",
  },
};

function CosmosSectionHead({ title, stamp = "✦", first = false }) {
  return (
    <div style={{ ...cs.secHead, ...(first ? cs.secHeadFirst : {}) }}>
      <span style={cs.secStamp} aria-hidden="true">{stamp}</span>
      <h2 style={cs.secTitle}>{title}</h2>
      <hr style={cs.secRule} />
    </div>
  );
}

function MoonPhaseDisc({ illumination }) {
  const pct = Math.max(0, Math.min(100, illumination));
  return (
    <div
      aria-hidden="true"
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        flexShrink: 0,
        background: cosmosPal.night,
        boxShadow: `inset 0 0 8px rgba(0,0,0,0.35), 0 2px 10px ${cosmosPal.glow}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `conic-gradient(from -90deg, ${cosmosPal.moonLit} 0deg ${pct * 3.6}deg, transparent ${pct * 3.6}deg 360deg)`,
          opacity: 0.95,
        }}
      />
    </div>
  );
}

function CosmosMoonCard({ label, date, info }) {
  return (
    <div style={cs.moonCard}>
      <div style={cs.moonTop}>
        <MoonPhaseDisc illumination={info.illumination} />
        <div style={{ minWidth: 0 }}>
          <p style={cs.fieldLabel}>{label}</p>
          <h3 style={cs.zodiacName}>{info.name}</h3>
          <div style={{ fontSize: 28, lineHeight: 1, marginBottom: 4 }} aria-hidden="true">{info.symbol}</div>
        </div>
      </div>
      <p style={cs.moonIllum}>{date} · {info.illumination}% illuminated</p>
      <div style={cs.illumBar} aria-hidden="true">
        <div style={{ ...cs.illumFill, width: `${info.illumination}%` }} />
      </div>
      <p style={{ ...cs.moonPhaseLine, marginTop: 14 }}>
        <span style={cs.moonPhaseLabel}>What: </span>{info.what}
      </p>
      <p style={cs.moonPhaseLine}>
        <span style={cs.moonPhaseLabel}>Why it matters: </span>{info.why}
      </p>
      <p style={{ ...cs.moonPhaseLine, marginBottom: 0 }}>
        <span style={cs.moonPhaseLabel}>Zero might favor: </span>{info.favors}
      </p>
    </div>
  );
}

function CosmosLunarRecord() {
  const birthMoon = getMoonPhaseInfo(BIRTHDAY);
  const todayMoon = getMoonPhaseInfo(new Date());
  return (
    <div style={cs.moonGrid} className="two-col-grid cosmos-moon-grid">
      <CosmosMoonCard label="At birth" date="September 16, 2024 · 00:00:00" info={birthMoon} />
      <CosmosMoonCard
        label="Today"
        date={new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        info={todayMoon}
      />
    </div>
  );
}

function CosmosDailyDispatch() {
  const today = new Date();
  const forecast = getDailyForecast(today);
  const moon = getMoonPhaseInfo(today);
  const sky = getDailySkyNote(today);
  return (
    <div style={cs.heroCard}>
      <p style={cs.heroDate}>Today Zero might… · {formatForecastDate(today)}</p>
      <p style={cs.heroText}>{forecast}</p>
      <p style={cs.heroNote}>
        Today's moon: {moon.name} ({moon.symbol}). {moon.what} {moon.why} Zero might favor: {moon.favors}
      </p>
      <p style={cs.heroNote}>
        Sky note: {sky.planet} {sky.placement}. {sky.mood}
      </p>
    </div>
  );
}

function ZodiacParagraphs({ paragraphs }) {
  return paragraphs.map((text, i) => (
    <p key={i} style={i === paragraphs.length - 1 ? cs.zodiacBlurbLast : cs.zodiacBlurb}>
      {text}
    </p>
  ));
}

function Pawmistry() {
  const base = import.meta.env.BASE_URL;
  return (
    <div style={cs.pawCard} className="pawmistry-card">
      <div>
        <div style={cs.pawGrid} className="cosmos-paw-grid">
          {PAW_LINES.map((entry) => (
            <div key={entry.line} style={cs.pawLineCard}>
              <p style={cs.pawLine}>{entry.line}</p>
              <p style={cs.pawPad}>{entry.pad}</p>
              <p style={cs.pawReading}>{entry.reading}</p>
            </div>
          ))}
        </div>
      </div>
      <figure style={cs.pawFigure}>
        <img
          style={cs.pawImg}
          src={`${base}cutouts/pawmistry-paw.png`}
          alt="Zero's paw for pawmistry"
          loading="lazy"
          decoding="async"
        />
        <figcaption style={cs.pawCaption}>Specimen paw</figcaption>
      </figure>
    </div>
  );
}

export default function CosmosTab({ starSign, chineseZodiac }) {
  return (
    <div style={cs.panel} className="cosmos-panel" role="tabpanel" id="panel-cosmos" aria-labelledby="tab-cosmos">
      <div style={cs.inner}>
        <CosmosSectionHead title="Today's Dispatch" stamp="☽" first />
        <CosmosDailyDispatch />

        <CosmosSectionHead title="Birth Chart" stamp="♍" />
        <div style={cs.zodiacGrid} className="two-col-grid cosmos-zodiac-grid">
          <div style={cs.zodiacCard}>
            <span style={cs.cardOrnament} aria-hidden="true">✧</span>
            <div style={cs.zodiacSymbol}>{starSign.symbol}</div>
            <h3 style={cs.zodiacName}>{starSign.name}</h3>
            <ZodiacParagraphs paragraphs={starSign.paragraphs} />
          </div>
          <div style={cs.zodiacCard}>
            <span style={cs.cardOrnament} aria-hidden="true">✧</span>
            <div style={{ ...cs.zodiacSymbol, fontFamily: ff.body }}>
              {chineseZodiac.character}
              <span style={{ fontSize: 14, color: cosmosPal.silver, marginLeft: 10, fontFamily: ff.body, fontStyle: "italic" }}>
                {chineseZodiac.pinyin}
              </span>
            </div>
            <h3 style={cs.zodiacName}>{chineseZodiac.name}</h3>
            <ZodiacParagraphs paragraphs={chineseZodiac.paragraphs} />
          </div>
        </div>

        <CosmosSectionHead title="Lunar Record" stamp="◐" />
        <CosmosLunarRecord />

        <CosmosSectionHead title="Pawmistry" stamp="✧" />
        <Pawmistry />
      </div>
    </div>
  );
}
