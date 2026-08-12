/**
 * Samoyed albedo thought experiment.
 * Editable model assumptions live in ASSUMPTIONS.
 * All outputs are derived; nothing is hardcoded for the final stage.
 */

/** Intentionally simplified educational assumptions (not measured universal constants). */
export const ASSUMPTIONS = {
  earthSurfaceKm2: 510_000_000,
  /** Approximate Earth land area (oceans excluded) */
  earthLandKm2: 149_000_000,
  northAmericaKm2: 24_700_000,
  /** Assumed average North American land-surface albedo */
  baselineAlbedo: 0.2,
  /** Assumed effective Samoyed albedo */
  samoyedAlbedo: 0.6,
  /** Effective horizontal footprint per dog */
  footprintM2: 0.5,
  /** Globally averaged incoming solar radiation (W/m²) */
  incomingSolarWm2: 340,
};

/**
 * Illustrative scale phrases keyed to the dog ladder.
 * Early steps are narrative; later steps use familiar place names.
 * Areas are not claimed as exact matches to dog footprint math.
 */
export const SCALE_BY_DOGS = [
  {
    minDogs: 1,
    id: "zero",
    label: "one cute fluffy Zero",
    phrase: "Illustrative scale: one cute fluffy Zero",
  },
  {
    minDogs: 10,
    id: "sheep",
    label: "a small herd of sheep",
    phrase: "Illustrative scale: a small herd of sheep",
  },
  {
    minDogs: 1_000,
    id: "field",
    label: "a football field",
    phrase: "Illustrative scale: on the order of a football field",
  },
  {
    minDogs: 1_000_000,
    id: "vatican",
    label: "Vatican City",
    phrase: "Illustrative scale: on the order of Vatican City",
  },
  {
    minDogs: 1_000_000_000,
    id: "nyc",
    label: "New York City",
    phrase: "Illustrative scale: on the order of New York City",
  },
  {
    minDogs: 1_000_000_000_000,
    id: "ca",
    label: "California",
    phrase: "Illustrative scale: on the order of California",
  },
  {
    minDogs: 49_000_000_000_000,
    id: "na",
    label: "North America",
    phrase: "Illustrative scale: on the order of North America",
  },
  {
    minDogs: 1_000_000_000_000_000,
    id: "land",
    label: "all of Earth's land",
    phrase:
      "Illustrative scale: 100% of Earth's land, plus floating cities on the ocean",
  },
  {
    minDogs: 10_000_000_000_000_000,
    id: "earth",
    label: "Earth's surface plus extra continents",
    phrase: "Illustrative scale: Earth's surface, plus extra continents of dog",
  },
];

/** @deprecated kept as named export alias for older imports; prefer SCALE_BY_DOGS */
export const SCALE_LANDMARKS = SCALE_BY_DOGS;

export const DOG_LADDER = [
  1,
  10,
  1_000,
  1_000_000,
  1_000_000_000,
  1_000_000_000_000,
  49_000_000_000_000,
  1_000_000_000_000_000,
  10_000_000_000_000_000,
];

const KM2_TO_M2 = 1_000_000;

export function km2ToM2(km2) {
  return km2 * KM2_TO_M2;
}

export function samoyedAreaM2(dogCount) {
  return dogCount * ASSUMPTIONS.footprintM2;
}

/**
 * Core radiative calculation.
 * Reflects additional incoming shortwave; does not claim longwave "heat to space"
 * or a global temperature change.
 */
export function computeSamoyedAlbedo(dogCount) {
  const dogs = Math.max(0, Number(dogCount));
  const earthM2 = km2ToM2(ASSUMPTIONS.earthSurfaceKm2);
  const landM2 = km2ToM2(ASSUMPTIONS.earthLandKm2);
  const naM2 = km2ToM2(ASSUMPTIONS.northAmericaKm2);
  const areaM2 = samoyedAreaM2(dogs);
  const naCoverage = areaM2 / naM2;
  const landCoverage = areaM2 / landM2;
  const earthCoverage = areaM2 / earthM2;
  const oceanOverflowKm2 = Math.max(0, (areaM2 - landM2) / KM2_TO_M2);
  const deltaAlbedo = ASSUMPTIONS.samoyedAlbedo - ASSUMPTIONS.baselineAlbedo;

  const coveredForPowerM2 = Math.min(areaM2, earthM2);
  const additionalReflectedW =
    coveredForPowerM2 * ASSUMPTIONS.incomingSolarWm2 * deltaAlbedo;
  const globalRadiativeEffectWm2 = additionalReflectedW / earthM2;

  return {
    dogCount: dogs,
    samoyedAreaM2: areaM2,
    samoyedAreaKm2: areaM2 / KM2_TO_M2,
    naCoverageFraction: naCoverage,
    landCoverageFraction: landCoverage,
    earthCoverageFraction: earthCoverage,
    oceanOverflowKm2,
    deltaAlbedo,
    additionalReflectedW,
    globalRadiativeEffectWm2,
    assumptions: { ...ASSUMPTIONS },
  };
}

export function formatDogCount(n) {
  return Math.round(n).toLocaleString("en-US");
}

export function formatScientific(n) {
  if (n < 1_000_000) return null;
  return Number(n).toExponential(2).replace("e+", " × 10^");
}

export function formatPowerWatts(w) {
  const abs = Math.abs(w);
  if (abs < 1) return "still rounding to nothing";
  if (abs >= 1e15) return `${(w / 1e15).toFixed(2)} PW`;
  if (abs >= 1e12) return `${(w / 1e12).toFixed(2)} TW`;
  if (abs >= 1e9) return `${(w / 1e9).toFixed(2)} GW`;
  if (abs >= 1e6) return `${(w / 1e6).toFixed(2)} MW`;
  if (abs >= 1e3) return `${(w / 1e3).toFixed(2)} kW`;
  return `${w.toFixed(1)} W`;
}

export function formatRadiativeEffect(wm2) {
  if (wm2 === 0) return "0 W/m²";
  if (Math.abs(wm2) < 1e-6) return "effectively zero";
  if (Math.abs(wm2) < 0.0001) return "still rounding to nothing";
  if (Math.abs(wm2) < 1) return `${wm2.toFixed(4)} W/m²`;
  return `${wm2.toFixed(2)} W/m²`;
}

export function formatCoveragePercent(fraction) {
  const pct = fraction * 100;
  if (pct < 0.0001) return `${pct.toExponential(2)}%`;
  if (pct < 0.01) return `${pct.toFixed(4)}%`;
  if (pct < 1) return `${pct.toFixed(2)}%`;
  if (pct < 10) return `${pct.toFixed(1)}%`;
  return `${Math.round(pct)}%`;
}

/** Chrome-friendly NA coverage (no absurd 2000% strings). */
export function formatNaCoverageLabel(naCoverageFraction) {
  if (naCoverageFraction < 1e-8) return "≈ 0% of North America";
  if (naCoverageFraction < 0.0001) return "still rounding to nothing over North America";
  if (naCoverageFraction >= 1) return "North America: fully dogged";
  return `North America ${formatCoveragePercent(naCoverageFraction)}`;
}

/** Chrome-friendly Earth / land coverage. */
export function formatEarthCoverageLabel(earthCoverageFraction, landCoverageFraction = 0) {
  if (landCoverageFraction >= 1 && earthCoverageFraction <= 1) {
    return "Land 100% dogged · floating ocean cities";
  }
  if (earthCoverageFraction < 1e-8) return "≈ 0% of Earth";
  if (earthCoverageFraction < 0.0001) return "Earth coverage still rounding to nothing";
  if (earthCoverageFraction > 1) {
    return `Earth covered · ${formatExtraContinents(extraContinentsFromEarthFrac(earthCoverageFraction))}`;
  }
  return `Earth ${formatCoveragePercent(earthCoverageFraction)}`;
}

/**
 * Extra dog-blanket area beyond Earth's full surface, counted in Earth-land units
 * ("continents" of reflective surface). Area only, not mass.
 */
export function extraContinentCount(samoyedAreaKm2) {
  const excess = Number(samoyedAreaKm2) - ASSUMPTIONS.earthSurfaceKm2;
  if (!(excess > 0)) return 0;
  return excess / ASSUMPTIONS.earthLandKm2;
}

export function extraContinentsFromEarthFrac(earthCoverageFraction) {
  const frac = Number(earthCoverageFraction) || 0;
  if (frac <= 1) return 0;
  return ((frac - 1) * ASSUMPTIONS.earthSurfaceKm2) / ASSUMPTIONS.earthLandKm2;
}

export function formatExtraContinents(count) {
  const n = Math.max(0, Number(count) || 0);
  if (n < 0.5) return "less than one extra continent of surface";
  if (n < 10) return `about ${n.toFixed(1)} extra continents of surface`;
  return `about ${Math.round(n)} extra continents of surface`;
}

/** Extra shortwave reflected if Samoyeds covered all of Earth's surface. */
export function maxEarthReflectedW() {
  const earthM2 = km2ToM2(ASSUMPTIONS.earthSurfaceKm2);
  const deltaAlbedo = ASSUMPTIONS.samoyedAlbedo - ASSUMPTIONS.baselineAlbedo;
  return earthM2 * ASSUMPTIONS.incomingSolarWm2 * deltaAlbedo;
}

/** 0–1 fill for Zeros-on-Earth bar (capped at full Earth). */
export function stageCoverageProgress(earthCoverageFraction) {
  return Math.min(1, Math.max(0, Number(earthCoverageFraction) || 0));
}

/** 0–1 fill for planetary-benefit bar vs full-Earth reflection. */
export function stageBenefitProgress(additionalReflectedW) {
  const maxW = maxEarthReflectedW();
  if (!(maxW > 0)) return 0;
  return Math.min(1, Math.max(0, (Number(additionalReflectedW) || 0) / maxW));
}

export function formatStageCoverageValue(earthCoverageFraction, landCoverageFraction = 0) {
  if (landCoverageFraction >= 1 && earthCoverageFraction <= 1) return "land full";
  if (earthCoverageFraction > 1) {
    const n = extraContinentsFromEarthFrac(earthCoverageFraction);
    return n < 10 ? `+${n.toFixed(1)} continents` : `+${Math.round(n)} continents`;
  }
  if (earthCoverageFraction < 1e-8) return "0%";
  const pct = earthCoverageFraction * 100;
  if (pct < 0.01) return "<0.01%";
  if (pct < 1) return `${pct.toFixed(2)}%`;
  if (pct < 10) return `${pct.toFixed(1)}%`;
  return `${Math.round(pct)}%`;
}

/**
 * Illustrative landmark for the current dog count (ladder-keyed storytelling).
 */
export function getScaleLandmark(dogCount) {
  const n = Math.max(0, Number(dogCount));
  let best = SCALE_BY_DOGS[0];
  for (const mark of SCALE_BY_DOGS) {
    if (n >= mark.minDogs) best = mark;
  }
  if (best.id === "earth") {
    const areaKm2 = samoyedAreaM2(n) / KM2_TO_M2;
    const continents = extraContinentCount(areaKm2);
    return {
      ...best,
      phrase: `Illustrative scale: Earth's surface, plus ${formatExtraContinents(continents)}`,
    };
  }
  return { ...best };
}

export function getStageMessage(dogCount) {
  if (dogCount >= 10_000_000_000_000_000) return "This may have gone too far.";
  if (dogCount >= 1_000_000_000_000_000) {
    return "All land covered. Bonus floating cities on the ocean.";
  }
  if (dogCount >= 49_000_000_000_000) return "NORTH AMERICA: DOGGED. Outstanding work!";
  if (dogCount >= 1_000_000_000_000) {
    return "Excellent coverage trajectory. The planet is looking fluffier.";
  }
  if (dogCount >= 1_000_000_000) return "Now we're getting somewhere. Keep adding zeros.";
  if (dogCount >= 1_000_000) return "Every Zero counts. North America remains a stretch goal.";
  if (dogCount >= 1_000) return "Still tiny, but the albedo is in the right direction.";
  if (dogCount >= 10) return "A small herd. Momentum building.";
  return "Promising start. One highly reflective Zero.";
}

export function getAddZeroLabel(stepIndex) {
  if (stepIndex >= 7) return "This may have gone too far";
  if (stepIndex >= 3) return "Add more zeros";
  return "Add Zero";
}

export function earthDogLine(modelOrFraction) {
  if (typeof modelOrFraction === "object" && modelOrFraction != null) {
    const { landCoverageFraction, earthCoverageFraction, samoyedAreaKm2 } = modelOrFraction;
    if (landCoverageFraction >= 1 && earthCoverageFraction <= 1) {
      return "All land is dog. The overflow has founded floating cities on the ocean.";
    }
    if (earthCoverageFraction > 1) {
      const continents =
        samoyedAreaKm2 != null
          ? extraContinentCount(samoyedAreaKm2)
          : extraContinentsFromEarthFrac(earthCoverageFraction);
      return `Earth's surface is fully dogged, with ${formatExtraContinents(continents)}.`;
    }
    return `Earth is now ${formatCoveragePercent(earthCoverageFraction)} dog surface.`;
  }
  if (modelOrFraction > 1) {
    return `Earth's surface is fully dogged, with ${formatExtraContinents(extraContinentsFromEarthFrac(modelOrFraction))}.`;
  }
  return `Earth is now ${formatCoveragePercent(modelOrFraction)} dog surface.`;
}

export const FINAL_PROBLEMS = [
  "Where do 10 quadrillion dogs sleep?",
  "Who feeds them?",
  "Why is the ocean barking?",
  "Was renewable energy perhaps the calmer idea?",
];

export function representativeRenderCount(dogCount) {
  const n = Math.max(0, Number(dogCount));
  if (n <= 1) return 1;
  if (n <= 10) return n;
  if (n <= 1_000) return Math.min(80, Math.max(10, Math.round(Math.sqrt(n) * 2.5)));
  if (n <= 1_000_000) return Math.min(400, 80 + Math.round(Math.log10(n) * 60));
  if (n <= 1_000_000_000) return Math.min(900, 400 + Math.round(Math.log10(n) * 40));
  if (n <= 49_000_000_000_000) return Math.min(2000, 900 + Math.round(Math.log10(n) * 70));
  if (n <= 1_000_000_000_000_000) return Math.min(2500, 2000 + Math.round(Math.log10(n) * 30));
  return 3000;
}

export function nextLadderIndex(currentIndex) {
  return Math.min(DOG_LADDER.length - 1, currentIndex + 1);
}

export function isFinalStep(dogCount) {
  return dogCount >= DOG_LADDER[DOG_LADDER.length - 1];
}
