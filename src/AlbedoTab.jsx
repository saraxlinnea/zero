import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ASSUMPTIONS,
  DOG_LADDER,
  FINAL_PROBLEMS,
  computeSamoyedAlbedo,
  earthDogLine,
  formatDogCount,
  formatEarthCoverageLabel,
  formatNaCoverageLabel,
  formatPowerWatts,
  formatRadiativeEffect,
  formatScientific,
  formatStageCoverageValue,
  getAddZeroLabel,
  getScaleLandmark,
  getStageMessage,
  isFinalStep,
  nextLadderIndex,
  representativeRenderCount,
  stageBenefitProgress,
  stageCoverageProgress,
} from "./albedo/samoyedAlbedoModel.js";
import { ZERO_MODES } from "./content.js";
import "./albedo/albedo.css";

const MODE_STAMP_URLS = ZERO_MODES.map(
  (m) => `${import.meta.env.BASE_URL}cutouts/${m.cutout}`,
);

/** Simplified lon/lat rings for a readable equirectangular map (illustrative). */
const LANDMASSES = [
  {
    id: "na",
    na: true,
    ring: [
      [-168, 65], [-140, 70], [-120, 72], [-90, 72], [-70, 68], [-55, 60], [-60, 50],
      [-65, 45], [-75, 40], [-80, 30], [-97, 26], [-105, 22], [-112, 28], [-120, 34],
      [-125, 42], [-130, 52], [-140, 58], [-155, 60], [-168, 65],
    ],
  },
  {
    id: "gl",
    ring: [[-55, 72], [-40, 75], [-25, 72], [-30, 65], [-45, 62], [-55, 68], [-55, 72]],
  },
  {
    id: "sa",
    ring: [
      [-80, 10], [-70, 12], [-50, 5], [-35, -5], [-40, -20], [-55, -35], [-70, -50],
      [-75, -40], [-75, -20], [-80, 0], [-80, 10],
    ],
  },
  {
    id: "eu",
    ring: [
      [-10, 36], [-5, 43], [0, 50], [10, 55], [25, 60], [40, 65], [40, 55], [30, 45],
      [20, 40], [10, 38], [0, 38], [-10, 36],
    ],
  },
  {
    id: "af",
    ring: [
      [-18, 15], [-10, 30], [10, 32], [32, 30], [40, 15], [50, 10], [40, -5], [35, -25],
      [20, -35], [15, -30], [10, -10], [-5, 5], [-18, 15],
    ],
  },
  {
    id: "as",
    ring: [
      [40, 55], [60, 65], [90, 70], [130, 65], [150, 55], [145, 40], [130, 30], [120, 20],
      [100, 10], [80, 20], [70, 25], [60, 35], [50, 40], [40, 45], [40, 55],
    ],
  },
  {
    id: "au",
    ring: [
      [115, -20], [125, -12], [145, -15], [150, -30], [140, -38], [120, -35], [115, -25], [115, -20],
    ],
  },
];

const SECONDARY = [
  {
    title: "Dog walks",
    ask: "Replacing short car trips with dog walks.",
    answer:
      "By turning an errand to the post office into a dog walk instead of a car trip, you reduce emissions, and everyone ends up healthier and happier.",
  },
  {
    title: "Dog fur jackets",
    ask: "Could shed undercoat become insulation?",
    answer:
      "Animal fiber traps air, so yes. Simply collect Samoyed hair and you'll have enough insulation to warm the world. Zero already donates generously to the house, the car, and every piece of clothing he even looks at!",
  },
  {
    title: "Billionaire enrichment",
    ask: "What if every billionaire had to keep a Samoyed?",
    answer:
      "Hypothesis: living with a good dog makes people softer and less interested in inventing new ways to warm the planet.",
  },
  {
    title: "Hurricane herding",
    ask: "Could Samoyeds herd a hurricane?",
    answer:
      "Send the dogs the other way and have them run hard enough to cancel the wind. Peer review status: not invited.",
  },
];

function useStampImages() {
  const [images, setImages] = useState({ body: [], ready: false, error: false });

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      MODE_STAMP_URLS.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
          }),
      ),
    ).then((loaded) => {
      if (cancelled) return;
      const body = loaded.filter(Boolean);
      setImages({
        body,
        ready: true,
        error: body.length === 0,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return images;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function project(lon, lat, w, h, view) {
  const lon0 = view.lonMin;
  const lon1 = view.lonMax;
  const lat0 = view.latMin;
  const lat1 = view.latMax;
  const x = ((lon - lon0) / (lon1 - lon0)) * w;
  const y = ((lat1 - lat) / (lat1 - lat0)) * h;
  return [x, y];
}

function pointInRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi || 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function viewForCoverage(naCoverage, earthCoverage) {
  // Early: NA-focused. Later: ease toward full world.
  const t = Math.min(1, Math.max(0, (earthCoverage - 0.02) / 0.5));
  const naView = { lonMin: -170, lonMax: -50, latMin: 15, latMax: 75 };
  const worldView = { lonMin: -180, lonMax: 180, latMin: -60, latMax: 80 };
  if (naCoverage < 0.9 && earthCoverage < 0.08) {
    return naView;
  }
  return {
    lonMin: naView.lonMin + (worldView.lonMin - naView.lonMin) * t,
    lonMax: naView.lonMax + (worldView.lonMax - naView.lonMax) * t,
    latMin: naView.latMin + (worldView.latMin - naView.latMin) * t,
    latMax: naView.latMax + (worldView.latMax - naView.latMax) * t,
  };
}

function buildDogPositions(dogCount, renderN, naCoverage, earthCoverage, landCoverage) {
  const rng = mulberry32((Math.round(dogCount) % 1e9) + renderN * 17 + 42);
  const positions = [];
  const naRings = LANDMASSES.filter((m) => m.na).map((m) => m.ring);
  const worldRings = LANDMASSES.map((m) => m.ring);
  const preferNa = Math.max(0.12, 1 - Math.min(1, earthCoverage) * 1.35);
  const oceanShare =
    landCoverage >= 1 ? Math.min(0.72, 0.2 + (landCoverage - 1) * 0.12) : 0;
  const stampCount = Math.max(MODE_STAMP_URLS.length, 1);
  const tryLimit = renderN * 55;
  let attempts = 0;

  while (positions.length < renderN && attempts < tryLimit) {
    attempts += 1;

    // Once land is full, spill dogs into the ocean as floating cities.
    if (oceanShare > 0 && rng() < oceanShare) {
      const lon = -180 + rng() * 360;
      const lat = -55 + rng() * 125;
      if (worldRings.some((ring) => pointInRing(lon, lat, ring))) continue;
      positions.push({
        lon,
        lat,
        rot: (rng() - 0.5) * 0.8,
        scaleJitter: 0.78 + rng() * 0.5,
        stamp: Math.floor(rng() * stampCount),
        ocean: true,
      });
      continue;
    }

    const useNa = rng() < preferNa || naCoverage < 1.05;
    const rings = useNa ? naRings : worldRings;
    const ring = rings[Math.floor(rng() * rings.length)];

    let minLon = Infinity;
    let maxLon = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;
    for (const [lon, lat] of ring) {
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }

    let lon;
    let lat;
    if (positions.length > 8 && rng() < 0.38) {
      const base = positions[Math.floor(rng() * positions.length)];
      lon = base.lon + (rng() - 0.5) * 10;
      lat = base.lat + (rng() - 0.5) * 7;
    } else {
      lon = minLon + rng() * (maxLon - minLon);
      lat = minLat + rng() * (maxLat - minLat);
    }

    if (!pointInRing(lon, lat, ring)) continue;

    positions.push({
      lon,
      lat,
      rot: (rng() - 0.5) * 0.8,
      scaleJitter: 0.78 + rng() * 0.5,
      stamp: Math.floor(rng() * stampCount),
      ocean: false,
    });
  }

  return positions;
}

function EarthDogMap({ dogCount, model, stepping }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const stamps = useStampImages();
  const renderN = representativeRenderCount(dogCount);
  const positions = useMemo(
    () =>
      buildDogPositions(
        dogCount,
        renderN,
        model.naCoverageFraction,
        model.earthCoverageFraction,
        model.landCoverageFraction,
      ),
    [
      dogCount,
      renderN,
      model.naCoverageFraction,
      model.earthCoverageFraction,
      model.landCoverageFraction,
    ],
  );
  const view = useMemo(
    () => viewForCoverage(model.naCoverageFraction, model.earthCoverageFraction),
    [model.naCoverageFraction, model.earthCoverageFraction],
  );

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (w < 2 || h < 2) return;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const ocean = ctx.createLinearGradient(0, 0, 0, h);
    ocean.addColorStop(0, "#7a9db0");
    ocean.addColorStop(1, "#5a7a8c");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(255,253,248,0.07)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 10; i += 1) {
      const x = (w * i) / 10;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    for (const mass of LANDMASSES) {
      ctx.beginPath();
      mass.ring.forEach(([lon, lat], i) => {
        const [x, y] = project(lon, lat, w, h, view);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = mass.na ? "#b5a57d" : "#c4b89a";
      ctx.fill();
      ctx.strokeStyle = "rgba(44, 26, 14, 0.2)";
      ctx.lineWidth = mass.na ? 1.5 : 1;
      ctx.stroke();
    }

    const naCov = Math.min(1.2, model.naCoverageFraction);
    const landCov = model.landCoverageFraction;
    const coverage = Math.min(1.5, model.earthCoverageFraction);
    const basePx =
      dogCount <= 1 ? 64 : dogCount <= 10 ? 44 : dogCount <= 1000 ? 30 : dogCount <= 1e9 ? 20 : 14;

    for (const p of positions) {
      const [x, y] = project(p.lon, p.lat, w, h, view);
      if (x < -40 || y < -40 || x > w + 40 || y > h + 40) continue;

      const img = stamps.body[p.stamp % Math.max(stamps.body.length, 1)];
      if (!img) continue;

      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const scale = (basePx * p.scaleJitter) / Math.max(iw, ih);
      const dw = iw * scale;
      const dh = ih * scale;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.ocean ? 0.92 : dogCount <= 10 ? 1 : 0.88;
      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();
    }

    if (naCov > 0.35 && landCov < 1) {
      const na = LANDMASSES.find((m) => m.na);
      ctx.beginPath();
      na.ring.forEach(([lon, lat], i) => {
        const [x, y] = project(lon, lat, w, h, view);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = `rgba(247, 242, 232, ${Math.min(0.7, (naCov - 0.35) * 0.8)})`;
      ctx.fill();
    }

    if (landCov >= 1) {
      for (const mass of LANDMASSES) {
        ctx.beginPath();
        mass.ring.forEach(([lon, lat], i) => {
          const [x, y] = project(lon, lat, w, h, view);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(247, 242, 232, 0.72)";
        ctx.fill();
      }
      const oceanWash = Math.min(0.55, 0.18 + (landCov - 1) * 0.08);
      ctx.fillStyle = `rgba(247, 242, 232, ${oceanWash})`;
      ctx.fillRect(0, 0, w, h);
    } else if (coverage > 0.15) {
      ctx.fillStyle = `rgba(247, 242, 232, ${Math.min(0.76, (coverage - 0.15) * 0.68)})`;
      ctx.fillRect(0, 0, w, h);
    }

    if (coverage > 1) {
      ctx.fillStyle = "rgba(255, 253, 248, 0.32)";
      ctx.fillRect(0, 0, w, h);
    }
  }, [
    dogCount,
    model.earthCoverageFraction,
    model.landCoverageFraction,
    model.naCoverageFraction,
    positions,
    stamps,
    view,
  ]);

  useEffect(() => {
    paint();
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(() => paint());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [paint]);

  const showNote = dogCount >= 1_000_000 && dogCount > renderN;
  const mapLabel =
    model.landCoverageFraction >= 1
      ? "Earth · land full · ocean cities forming"
      : "Earth · simplified landmasses (not to survey grade)";

  return (
    <div className={`albedo-map-wrap${stepping ? " is-stepping" : ""}`} ref={wrapRef}>
      <span className="albedo-map-label">{mapLabel}</span>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Map showing about ${renderN} representative Samoyeds for a true count of ${formatDogCount(dogCount)}`}
      />
      {stamps.error && (
        <p className="albedo-map-note">Could not load Zero mode cutouts.</p>
      )}
      {!stamps.error && showNote && (
        <p className="albedo-map-note">
          {formatDogCount(dogCount)} Samoyeds represented by {formatDogCount(renderN)} rendered dogs
        </p>
      )}
    </div>
  );
}

export default function AlbedoTab() {
  const [step, setStep] = useState(0);
  const [problemVisible, setProblemVisible] = useState(0);
  const [stepping, setStepping] = useState(false);
  const climaxRef = useRef(null);
  const dogCount = DOG_LADDER[step];
  const model = useMemo(() => computeSamoyedAlbedo(dogCount), [dogCount]);
  const landmark = useMemo(() => getScaleLandmark(dogCount), [dogCount]);
  const final = isFinalStep(dogCount);
  const sci = formatScientific(dogCount);
  const coverageFill = stageCoverageProgress(model.earthCoverageFraction);
  const benefitFill = stageBenefitProgress(model.additionalReflectedW);
  const coverageValue = formatStageCoverageValue(
    model.earthCoverageFraction,
    model.landCoverageFraction,
  );
  const benefitValue = formatPowerWatts(model.additionalReflectedW);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!final) {
      setProblemVisible(0);
      return undefined;
    }
    if (reduceMotion) {
      setProblemVisible(FINAL_PROBLEMS.length);
      return undefined;
    }
    setProblemVisible(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setProblemVisible(i);
      if (i >= FINAL_PROBLEMS.length) clearInterval(id);
    }, 480);
    return () => clearInterval(id);
  }, [final, reduceMotion]);

  useEffect(() => {
    if (!final || !climaxRef.current) return;
    climaxRef.current.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  }, [final, reduceMotion]);

  function addZero() {
    if (final) return;
    if (!reduceMotion) {
      setStepping(true);
      window.setTimeout(() => setStepping(false), 280);
    }
    setStep((s) => nextLadderIndex(s));
  }

  function tryAgain() {
    setStep(0);
    setProblemVisible(0);
  }

  function onKeyAdd(event) {
    if (event.key === "Enter" || event.key === "+") {
      event.preventDefault();
      addZero();
    }
  }

  return (
    <div className="albedo-tab">
      <p className="albedo-field-label">Field experiment · Earth albedo modification</p>

      <header className="albedo-hero-compact archive-settle">
        <h1>SOLVE CLIMATE CHANGE WITH ZEROS</h1>
        <p className="albedo-sub">
          White coat. High reflectivity. An irresponsible number of Samoyeds. Here is the math.
        </p>
        <p className="albedo-intro">
          Samoyeds are white. White things bounce sunlight back toward space. So the plan is
          simple: cover more of Earth with dogs, preferably this one, copied a lot. We will keep
          adding zeros until the planet looks correctly fluffy, then check whether we have
          invented worse problems.
        </p>
      </header>

      <div className="albedo-stage archive-settle">
        <div className="albedo-controls">
          <p className="albedo-count" aria-live="polite">
            {formatDogCount(dogCount)}
          </p>
          <p className="albedo-count-meta">
            Samoyeds
            {sci ? ` · ${sci}` : ""}
            <br />
            {formatNaCoverageLabel(model.naCoverageFraction)}
            {" · "}
            {formatEarthCoverageLabel(
              model.earthCoverageFraction,
              model.landCoverageFraction,
            )}
          </p>
          <p className="albedo-landmark">{landmark.phrase}</p>

          <div className="albedo-stage-bars" aria-live="polite">
            <div className={`albedo-progress${coverageFill >= 1 ? " is-done" : ""}`}>
              <div className="albedo-progress-head">
                <div className="albedo-progress-label">Zeros on Earth</div>
                <div className="albedo-progress-value">{coverageValue}</div>
              </div>
              <div className="albedo-progress-track">
                <div
                  className="albedo-progress-fill"
                  style={{
                    width: `${coverageFill > 0 ? Math.max(0.6, coverageFill * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className={`albedo-progress${benefitFill >= 1 ? " is-done" : ""}`}>
              <div className="albedo-progress-head">
                <div className="albedo-progress-label">Sunlight sent packing</div>
                <div className="albedo-progress-value">{benefitValue}</div>
              </div>
              <div className="albedo-progress-track">
                <div
                  className="albedo-progress-fill albedo-progress-fill--benefit"
                  style={{
                    width: `${benefitFill > 0 ? Math.max(0.6, benefitFill * 100) : 0}%`,
                  }}
                />
              </div>
              <p className="albedo-progress-sub">
                Global-average effect {formatRadiativeEffect(model.globalRadiativeEffectWm2)}
              </p>
            </div>
          </div>

          <p className="albedo-stage-msg" aria-live="polite">
            {getStageMessage(dogCount)}
          </p>

          <div className="albedo-controls-sticky">
            {!final && (
              <button
                type="button"
                className="albedo-btn"
                onClick={addZero}
                onKeyDown={onKeyAdd}
                aria-label="Add a zero to the Samoyed count, advancing by roughly an order of magnitude"
              >
                {getAddZeroLabel(step)}
              </button>
            )}
          </div>
        </div>

        <EarthDogMap dogCount={dogCount} model={model} stepping={stepping} />
      </div>

      {final && (
        <section className="albedo-climax archive-settle" ref={climaxRef} aria-live="polite">
          <h2>Climate change: solved (with notes)</h2>
          <p className="albedo-dog-line">{earthDogLine(model)}</p>
          <p className="albedo-problems-lead">
            Unfortunately, we appear to have created several new problems.
          </p>
          <ul className="albedo-problems">
            {FINAL_PROBLEMS.map((line, i) => (
              <li key={line} className={i < problemVisible ? "is-visible" : ""}>
                {line}
              </li>
            ))}
          </ul>
          <button type="button" className="albedo-btn" onClick={tryAgain}>
            Try Again
          </button>
        </section>
      )}

      <section className="albedo-math archive-settle">
        <h2>The very serious math</h2>
        <p className="albedo-math-note">
          Additional sunlight reflected (shortwave). Not heat shipped to space. No global
          temperature change is calculated from this forcing.
        </p>

        <p className="albedo-math-section-label">Assumptions (constants)</p>
        <dl className="albedo-math-grid">
          <div className="albedo-stat">
            <dt>Earth&apos;s surface</dt>
            <dd>{ASSUMPTIONS.earthSurfaceKm2.toLocaleString("en-US")} km²</dd>
          </div>
          <div className="albedo-stat">
            <dt>Earth&apos;s land</dt>
            <dd>{ASSUMPTIONS.earthLandKm2.toLocaleString("en-US")} km²</dd>
          </div>
          <div className="albedo-stat">
            <dt>North America&apos;s area</dt>
            <dd>{ASSUMPTIONS.northAmericaKm2.toLocaleString("en-US")} km²</dd>
          </div>
          <div className="albedo-stat">
            <dt>Assumed North American albedo</dt>
            <dd>{ASSUMPTIONS.baselineAlbedo.toFixed(2)}</dd>
          </div>
          <div className="albedo-stat">
            <dt>Assumed Samoyed albedo</dt>
            <dd>{ASSUMPTIONS.samoyedAlbedo.toFixed(2)}</dd>
          </div>
          <div className="albedo-stat">
            <dt>Effective Samoyed footprint</dt>
            <dd>{ASSUMPTIONS.footprintM2} m²</dd>
          </div>
          <div className="albedo-stat">
            <dt>Incoming solar radiation</dt>
            <dd>{ASSUMPTIONS.incomingSolarWm2} W/m²</dd>
          </div>
        </dl>

        <div className="albedo-math-live">
          <p className="albedo-math-section-label">Live outputs</p>
          <dl className="albedo-math-grid">
            <div className="albedo-stat albedo-stat--live">
              <dt>Additional sunlight reflected</dt>
              <dd aria-live="polite">{formatPowerWatts(model.additionalReflectedW)}</dd>
            </div>
            <div className="albedo-stat albedo-stat--live">
              <dt>Global-average radiative effect</dt>
              <dd aria-live="polite">{formatRadiativeEffect(model.globalRadiativeEffectWm2)}</dd>
            </div>
          </dl>
        </div>

        <details className="albedo-assumptions">
          <summary>Assumptions &amp; limitations</summary>
          <div className="albedo-assumptions-body">
            <p>
              North American albedo and Samoyed albedo are labeled assumptions for this educational
              visualization, not measured universal constants. Outgoing terrestrial heat is mostly
              longwave infrared and is a different part of Earth&apos;s energy budget. The
              calculation stops at a global-average radiative effect from shortwave reflection.
            </p>
            <p>This model does not account for:</p>
            <ul>
              <li>latitude</li>
              <li>season</li>
              <li>clouds</li>
              <li>atmospheric absorption</li>
              <li>snow and ice</li>
              <li>ocean coverage</li>
              <li>changing surface temperatures</li>
              <li>climate feedbacks</li>
              <li>actual Samoyed optical properties</li>
              <li>ecological consequences</li>
            </ul>
          </div>
        </details>
      </section>

      <section className="albedo-secondary archive-settle">
        <h2>Other dog-based climate solutions</h2>
        <div className="albedo-cards">
          {SECONDARY.map((card) => (
            <article key={card.title} className="albedo-card">
              <h3>{card.title}</h3>
              <p>{card.ask}</p>
              <p>{card.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
