// Research-only Pattern Selection Shadow prototype v0.1.
// Pure detector primitives only. No Worker.js import, no network, no storage, no decision impact.
// Definitions are outcome-agnostic and exist to execute the frozen C1-C8 adversarial suite.

import { createHash } from "node:crypto";

export const PATTERN_CORE_VERSION = "PATTERN_CORE_V0_1";
export const RESEARCH_ONLY = true;
export const DECISION_IMPACT = false;

function finite(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const x = Number(value);
  return Number.isFinite(x) ? x : null;
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]));
  }
  return value;
}

export function stableHash(value) {
  return createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
}

export function buildShadowParentReference({ scanDate, symbol, parentSnapshot } = {}) {
  const date = String(scanDate || "");
  const stock = String(symbol || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !stock) {
    return { status: "BLOCKED", reason: "SHADOW_PARENT_IDENTITY_INCOMPLETE" };
  }
  if (!parentSnapshot || typeof parentSnapshot !== "object") {
    return { status: "BLOCKED", reason: "SHADOW_PARENT_SNAPSHOT_MISSING" };
  }
  return {
    status: "VALID",
    identityVersion: "SHADOW_PARENT_V0_1",
    shadowParentKey: date + "|" + stock,
    scanDate: date,
    symbol: stock,
    parentSnapshotHash: stableHash(parentSnapshot),
    researchOnly: true,
    decisionImpact: false
  };
}

export function compareShadowParentReferences(a, b) {
  if (!a || !b || a.status !== "VALID" || b.status !== "VALID") {
    return { status: "BLOCKED", reason: "INVALID_PARENT_REFERENCE" };
  }
  if (a.shadowParentKey !== b.shadowParentKey) {
    return { status: "DIFFERENT_PARENT", sameIdentity: false, provenanceConflict: false };
  }
  const sameHash = a.parentSnapshotHash === b.parentSnapshotHash;
  return {
    status: sameHash ? "SAME_PARENT_EXACT" : "PROVENANCE_CONFLICT",
    sameIdentity: true,
    sameSnapshotHash: sameHash,
    provenanceConflict: !sameHash
  };
}

export function validatePatternSeriesEnvelope({
  role,
  semanticSpace,
  bars,
  provenance = {},
  requireOpen = false
} = {}) {
  const normalizedRole = String(role || "");
  const normalizedSpace = String(semanticSpace || "");
  const sourceId = String(provenance?.sourceId || "");
  const payloadHash = String(provenance?.payloadHash || "");

  if (!["GEOMETRY", "RAW_EXECUTION"].includes(normalizedRole)) {
    return { usable:false, status:"BLOCKED", reason:"SERIES_ROLE_UNKNOWN" };
  }
  if (!sourceId || !payloadHash) {
    return { usable:false, status:"BLOCKED", reason:"SOURCE_PROVENANCE_INCOMPLETE" };
  }
  if (provenance?.pointInTimeEligible !== true) {
    return { usable:false, status:"BLOCKED", reason:"POINT_IN_TIME_PROVENANCE_UNKNOWN" };
  }

  if (normalizedRole === "GEOMETRY" && normalizedSpace !== "TECHNICAL_CONTINUITY") {
    return { usable:false, status:"BLOCKED", reason:"GEOMETRY_REQUIRES_TECHNICAL_CONTINUITY" };
  }
  if (normalizedRole === "RAW_EXECUTION" && normalizedSpace !== "RAW_EXECUTION") {
    return { usable:false, status:"BLOCKED", reason:"EXECUTION_REQUIRES_RAW_EXECUTION" };
  }

  const requested = provenance?.requestedAdjustmentMode;
  const returned = provenance?.returnedAdjustmentMode;
  if (normalizedRole === "RAW_EXECUTION" &&
      requested === false && returned === true) {
    return { usable:false, status:"BLOCKED", reason:"ADJUSTMENT_MODE_MISMATCH" };
  }

  if (provenance?.corporateActionSemanticsReady !== true) {
    return { usable:false, status:"BLOCKED", reason:"CORPORATE_ACTION_SEMANTICS_UNKNOWN" };
  }

  const barCheck = validatePatternBars({ bars, requireOpen });
  if (!barCheck.usable) return barCheck;
  return {
    usable:true,
    status:"VALID",
    reason:null,
    role:normalizedRole,
    semanticSpace:normalizedSpace,
    sourceId,
    payloadHash,
    pointInTimeEligible:true,
    corporateActionSemanticsReady:true,
    bars:barCheck.bars
  };
}

export function validatePatternBars({ bars, requireOpen = false } = {}) {
  if (!Array.isArray(bars) || bars.length === 0) {
    return { usable: false, status: "BLOCKED", reason: "NO_BARS", bars: [] };
  }
  const out = [];
  const seen = new Set();
  let previousDate = null;
  for (const raw of bars) {
    const date = String(raw?.date || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { usable: false, status: "BLOCKED", reason: "INVALID_DATE", bars: [] };
    }
    if (seen.has(date)) return { usable: false, status: "BLOCKED", reason: "DUPLICATE_BAR_DATE", bars: [] };
    if (previousDate && date <= previousDate) {
      return { usable: false, status: "BLOCKED", reason: "OUT_OF_ORDER_BAR_DATE", bars: [] };
    }
    seen.add(date);
    previousDate = date;

    const open = finite(raw?.open);
    const high = finite(raw?.high);
    const low = finite(raw?.low);
    const close = finite(raw?.close);
    const volume = finite(raw?.volume);
    const turnover = finite(raw?.turnover);

    if (requireOpen && open === null) {
      return { usable: false, status: "BLOCKED", reason: "OPEN_MISSING", bars: [] };
    }
    if (high === null || low === null || close === null) {
      return { usable: false, status: "BLOCKED", reason: "OHLC_INCOMPLETE", bars: [] };
    }
    const effectiveOpen = open === null ? close : open;
    if (high < Math.max(effectiveOpen, close) || low > Math.min(effectiveOpen, close) || high < low) {
      return { usable: false, status: "BLOCKED", reason: "OHLC_GEOMETRY_INVALID", bars: [] };
    }

    out.push({ date, open, high, low, close, volume, turnover });
  }
  return { usable: true, status: "VALID", reason: null, bars: out };
}

function barsAsOf(bars, asOfDate) {
  const filtered = Array.isArray(bars)
    ? bars.filter(x => String(x?.date || "") <= String(asOfDate || "9999-12-31"))
    : [];
  return validatePatternBars({ bars: filtered });
}

export function detectDirectionalChangeSwings({
  bars,
  asOfDate,
  thresholdPct = 0.05
} = {}) {
  const threshold = finite(thresholdPct);
  if (!(threshold > 0 && threshold < 1)) throw new Error("thresholdPct must be between 0 and 1");
  const validated = barsAsOf(bars, asOfDate);
  if (!validated.usable || validated.bars.length < 2) {
    return { status: validated.status, reason: validated.reason, swings: [] };
  }
  const series = validated.bars;
  const swings = [];
  let state = "UNKNOWN";
  let runningHigh = { price: series[0].high, close: series[0].close, date: series[0].date, index: 0 };
  let runningLow = { price: series[0].low, close: series[0].close, date: series[0].date, index: 0 };

  const pushSwing = (type, pivot, confirmedAt, confirmedIndex) => {
    const last = swings.at(-1);
    if (last && last.type === type && last.pivotAt === pivot.date) return;
    swings.push({
      type,
      pivotAt: pivot.date,
      confirmedAt,
      pivotPrice: type === "HIGH" ? pivot.price : pivot.price,
      pivotClose: pivot.close,
      pivotIndex: pivot.index,
      confirmedIndex,
      thresholdPct: threshold
    });
  };

  for (let i = 1; i < series.length; i += 1) {
    const bar = series[i];

    if (state === "UNKNOWN") {
      if (bar.high > runningHigh.price) runningHigh = { price: bar.high, close: bar.close, date: bar.date, index: i };
      if (bar.low < runningLow.price) runningLow = { price: bar.low, close: bar.close, date: bar.date, index: i };

      const upFromLow = bar.close / runningLow.price - 1;
      const downFromHigh = 1 - bar.close / runningHigh.price;
      if (upFromLow >= threshold && runningLow.index < i) {
        pushSwing("LOW", runningLow, bar.date, i);
        state = "UP";
        runningHigh = { price: bar.high, close: bar.close, date: bar.date, index: i };
      } else if (downFromHigh >= threshold && runningHigh.index < i) {
        pushSwing("HIGH", runningHigh, bar.date, i);
        state = "DOWN";
        runningLow = { price: bar.low, close: bar.close, date: bar.date, index: i };
      }
      continue;
    }

    if (state === "UP") {
      if (bar.high >= runningHigh.price) runningHigh = { price: bar.high, close: bar.close, date: bar.date, index: i };
      const decline = 1 - bar.close / runningHigh.price;
      if (decline >= threshold && runningHigh.index < i) {
        pushSwing("HIGH", runningHigh, bar.date, i);
        state = "DOWN";
        runningLow = { price: bar.low, close: bar.close, date: bar.date, index: i };
      }
      continue;
    }

    if (state === "DOWN") {
      if (bar.low <= runningLow.price) runningLow = { price: bar.low, close: bar.close, date: bar.date, index: i };
      const rebound = bar.close / runningLow.price - 1;
      if (rebound >= threshold && runningLow.index < i) {
        pushSwing("LOW", runningLow, bar.date, i);
        state = "UP";
        runningHigh = { price: bar.high, close: bar.close, date: bar.date, index: i };
      }
    }
  }

  return { status: "VALID", reason: null, swings };
}

export function simpleAtrBeforeIndex(bars, index, period = 20) {
  const p = Math.max(1, Math.floor(Number(period) || 20));
  if (!Array.isArray(bars) || index < p || index > bars.length) return null;
  const start = index - p;
  const ranges = [];
  for (let i = start; i < index; i += 1) {
    const bar = bars[i];
    const previousClose = i > 0 ? Number(bars[i - 1].close) : Number(bar.close);
    const high = Number(bar.high);
    const low = Number(bar.low);
    if (![previousClose, high, low].every(Number.isFinite)) return null;
    ranges.push(Math.max(high - low, Math.abs(high - previousClose), Math.abs(low - previousClose)));
  }
  return ranges.reduce((sum, x) => sum + x, 0) / ranges.length;
}

function frozenAtrThreshold(bars, legStartIndex, scaleK, atrPeriod) {
  const atr = simpleAtrBeforeIndex(bars, legStartIndex, atrPeriod);
  const priorClose = legStartIndex > 0 ? Number(bars[legStartIndex - 1].close) : null;
  if (!(atr > 0) || !(priorClose > 0) || !(scaleK > 0)) return null;
  return {
    thresholdPct: scaleK * atr / priorClose,
    atr,
    priorClose,
    thresholdFrozenAt: bars[legStartIndex - 1].date
  };
}

// Architecture-faithful swing engine for research histories.
// The threshold is k * lagged ATR% and is frozen at each leg start.
// It intentionally does not use the current confirmation bar to redefine the threshold.
export function detectDirectionalChangeSwingsAtr({
  bars,
  asOfDate,
  scaleK = 2,
  atrPeriod = 20
} = {}) {
  const validated = barsAsOf(bars, asOfDate);
  const k = Number(scaleK);
  const period = Math.max(1, Math.floor(Number(atrPeriod) || 20));
  if (!(k > 0)) throw new Error("scaleK must be positive");
  if (!validated.usable) return { status: validated.status, reason: validated.reason, swings: [] };

  const series = validated.bars;
  if (series.length <= period) {
    return { status: "BLOCKED", reason: "ATR_WARMUP_INSUFFICIENT", swings: [] };
  }

  const startIndex = period;
  let frozen = frozenAtrThreshold(series, startIndex, k, period);
  if (!frozen) return { status: "BLOCKED", reason: "ATR_THRESHOLD_UNKNOWN", swings: [] };

  const swings = [];
  let state = "UNKNOWN";
  let legStartIndex = startIndex;
  let legStartConfirmedAt = null;
  let runningHigh = {
    price: series[startIndex].high,
    close: series[startIndex].close,
    date: series[startIndex].date,
    index: startIndex
  };
  let runningLow = {
    price: series[startIndex].low,
    close: series[startIndex].close,
    date: series[startIndex].date,
    index: startIndex
  };

  const pushSwing = (type, pivot, confirmedAt, confirmedIndex) => {
    swings.push({
      type,
      pivotAt: pivot.date,
      confirmedAt,
      pivotPrice: pivot.price,
      pivotClose: pivot.close,
      pivotIndex: pivot.index,
      confirmedIndex,
      scaleK: k,
      atrPeriod: period,
      thresholdPct: frozen.thresholdPct,
      thresholdAtr: frozen.atr,
      thresholdPriorClose: frozen.priorClose,
      thresholdFrozenAt: frozen.thresholdFrozenAt,
      legStartIndex,
      legStartConfirmedAt
    });
  };

  const beginNextLeg = (confirmationIndex, nextState) => {
    // New-leg threshold is frozen from data ending on the prior completed bar.
    // This avoids letting the confirmation bar itself resize the reversal threshold.
    const nextFrozen = frozenAtrThreshold(series, confirmationIndex, k, period);
    if (!nextFrozen) return false;
    frozen = nextFrozen;
    legStartIndex = confirmationIndex;
    legStartConfirmedAt = series[confirmationIndex].date;
    state = nextState;
    return true;
  };

  for (let i = startIndex + 1; i < series.length; i += 1) {
    const bar = series[i];

    if (state === "UNKNOWN") {
      if (bar.high >= runningHigh.price) runningHigh = { price: bar.high, close: bar.close, date: bar.date, index: i };
      if (bar.low <= runningLow.price) runningLow = { price: bar.low, close: bar.close, date: bar.date, index: i };

      const rebound = bar.close / runningLow.price - 1;
      const decline = 1 - bar.close / runningHigh.price;
      if (rebound >= frozen.thresholdPct && runningLow.index < i) {
        pushSwing("LOW", runningLow, bar.date, i);
        if (!beginNextLeg(i, "UP")) return { status: "BLOCKED", reason: "ATR_THRESHOLD_UNKNOWN", swings };
        runningHigh = { price: bar.high, close: bar.close, date: bar.date, index: i };
      } else if (decline >= frozen.thresholdPct && runningHigh.index < i) {
        pushSwing("HIGH", runningHigh, bar.date, i);
        if (!beginNextLeg(i, "DOWN")) return { status: "BLOCKED", reason: "ATR_THRESHOLD_UNKNOWN", swings };
        runningLow = { price: bar.low, close: bar.close, date: bar.date, index: i };
      }
      continue;
    }

    if (state === "UP") {
      if (bar.high >= runningHigh.price) runningHigh = { price: bar.high, close: bar.close, date: bar.date, index: i };
      const decline = 1 - bar.close / runningHigh.price;
      if (decline >= frozen.thresholdPct && runningHigh.index < i) {
        pushSwing("HIGH", runningHigh, bar.date, i);
        if (!beginNextLeg(i, "DOWN")) return { status: "BLOCKED", reason: "ATR_THRESHOLD_UNKNOWN", swings };
        runningLow = { price: bar.low, close: bar.close, date: bar.date, index: i };
      }
      continue;
    }

    if (state === "DOWN") {
      if (bar.low <= runningLow.price) runningLow = { price: bar.low, close: bar.close, date: bar.date, index: i };
      const rebound = bar.close / runningLow.price - 1;
      if (rebound >= frozen.thresholdPct && runningLow.index < i) {
        pushSwing("LOW", runningLow, bar.date, i);
        if (!beginNextLeg(i, "UP")) return { status: "BLOCKED", reason: "ATR_THRESHOLD_UNKNOWN", swings };
        runningHigh = { price: bar.high, close: bar.close, date: bar.date, index: i };
      }
    }
  }

  return {
    status: "VALID",
    reason: null,
    scaleK: k,
    atrPeriod: period,
    warmupBars: period,
    swings
  };
}

export function detectSwingScaleFamily({
  bars,
  asOfDate,
  atrPeriod = 20,
  scaleKs = { MICRO: 1, BASE: 2, MAJOR: 3 }
} = {}) {
  const entries = Object.entries(scaleKs || {});
  const scales = {};
  for (const [name, k] of entries) {
    scales[name] = detectDirectionalChangeSwingsAtr({ bars, asOfDate, scaleK: Number(k), atrPeriod });
  }
  return {
    detectorVersion: PATTERN_CORE_VERSION,
    method: "DIRECTIONAL_CHANGE_LAGGED_ATR_FROZEN",
    atrPeriod,
    scales,
    researchOnly: true,
    decisionImpact: false
  };
}

export function researchTickSize(price) {
  const p = finite(price);
  if (!(p > 0)) return null;
  if (p < 10) return 0.01;
  if (p < 50) return 0.05;
  if (p < 100) return 0.1;
  if (p < 500) return 0.5;
  if (p < 1000) return 1;
  return 5;
}

function median(values) {
  const xs = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!xs.length) return null;
  const mid = Math.floor(xs.length / 2);
  return xs.length % 2 ? xs[mid] : (xs[mid - 1] + xs[mid]) / 2;
}

function zoneVersionFromAnchors({ anchors, scaleName, version, createdAt, atrAtCreation, atrWidthMultiple }) {
  const prices = anchors.map(x => x.pivotPrice);
  const center = median(prices);
  const tick = researchTickSize(center);
  const tickFloorWidth = tick === null ? 0 : 2 * tick;
  const atrToleranceWidth = Number.isFinite(atrAtCreation) ? atrWidthMultiple * atrAtCreation : 0;
  const constituentDispersionWidth = Math.max(...prices.map(x => Math.abs(x - center)));
  const halfWidth = Math.max(tickFloorWidth, atrToleranceWidth, constituentDispersionWidth);
  return {
    zoneId: stableHash({
      scaleName,
      seed: anchors.slice(0, 2).map(x => [x.pivotAt, x.confirmedAt, x.pivotPrice])
    }).slice(0, 20),
    scaleName,
    version,
    createdAt,
    center,
    lower: center - halfWidth,
    upper: center + halfWidth,
    halfWidth,
    widthComponents: {
      tickFloorWidth,
      atrToleranceWidth,
      constituentDispersionWidth
    },
    touchCount: anchors.length,
    anchorPivotDates: anchors.map(x => x.pivotAt),
    anchorConfirmedDates: anchors.map(x => x.confirmedAt),
    anchorPrices: prices,
    immutable: true,
    researchOnly: true,
    decisionImpact: false
  };
}

// Frozen-zone prototype from confirmed swing highs.
// Compatibility is based on overlap of contemporaneous anchor tolerance with the
// latest immutable zone version. Later touches create successor versions.
export function buildFrozenResistanceZoneVersions({
  bars,
  swings,
  asOfDate,
  scaleName = "BASE",
  lookbackSessions = 120,
  atrPeriod = 20,
  atrWidthMultiple = 0.25,
  minTouches = 2
} = {}) {
  const validated = barsAsOf(bars, asOfDate);
  if (!validated.usable) return { status: validated.status, reason: validated.reason, zones: [], versions: [] };
  const series = validated.bars;
  const indexByDate = new Map(series.map((x, i) => [x.date, i]));
  const endIndex = series.length - 1;
  const startIndex = Math.max(0, endIndex - Math.max(1, Number(lookbackSessions) || 120) + 1);

  const highs = (Array.isArray(swings) ? swings : [])
    .filter(x => x?.type === "HIGH" && x.confirmedAt <= asOfDate && indexByDate.has(x.pivotAt) && indexByDate.has(x.confirmedAt))
    .filter(x => indexByDate.get(x.pivotAt) >= startIndex)
    .map(x => ({ ...x, pivotPrice: Number(x.pivotPrice) }))
    .filter(x => Number.isFinite(x.pivotPrice) && x.pivotPrice > 0)
    .sort((a, b) => a.confirmedAt.localeCompare(b.confirmedAt) || a.pivotAt.localeCompare(b.pivotAt));

  const candidates = [];
  const versions = [];

  for (const high of highs) {
    const confirmedIndex = indexByDate.get(high.confirmedAt);
    const atr = simpleAtrBeforeIndex(series, confirmedIndex, atrPeriod);
    const tick = researchTickSize(high.pivotPrice);
    if (!(atr > 0) || tick === null) continue;
    const anchorHalfWidth = Math.max(2 * tick, atrWidthMultiple * atr);
    const anchorLower = high.pivotPrice - anchorHalfWidth;
    const anchorUpper = high.pivotPrice + anchorHalfWidth;

    let chosen = null;
    for (const candidate of candidates) {
      const current = candidate.current;
      const overlaps = anchorLower <= current.upper && anchorUpper >= current.lower;
      if (!overlaps) continue;
      const distance = Math.abs(high.pivotPrice - current.center);
      if (!chosen || distance < chosen.distance) chosen = { candidate, distance };
    }

    if (!chosen) {
      candidates.push({
        anchors: [high],
        current: {
          center: high.pivotPrice,
          lower: anchorLower,
          upper: anchorUpper,
          touchCount: 1
        },
        nextVersion: 1
      });
      continue;
    }

    const candidate = chosen.candidate;
    candidate.anchors = [...candidate.anchors, high];
    const next = zoneVersionFromAnchors({
      anchors: candidate.anchors,
      scaleName,
      version: candidate.nextVersion,
      createdAt: high.confirmedAt,
      atrAtCreation: atr,
      atrWidthMultiple
    });
    candidate.nextVersion += 1;
    candidate.current = next;
    if (next.touchCount >= minTouches) versions.push(next);
  }

  const latestByZone = new Map();
  for (const version of versions) latestByZone.set(version.zoneId, version);
  return {
    status: "VALID",
    reason: null,
    scaleName,
    lookbackSessions,
    atrPeriod,
    atrWidthMultiple,
    minTouches,
    zones: [...latestByZone.values()],
    versions
  };
}

export function buildResistanceZones(swings, {
  tolerancePct = 0.015,
  minTouches = 2
} = {}) {
  const highs = (Array.isArray(swings) ? swings : [])
    .filter(x => x?.type === "HIGH" && Number.isFinite(Number(x.pivotPrice)))
    .map(x => ({ ...x, pivotPrice: Number(x.pivotPrice) }))
    .sort((a, b) => a.pivotPrice - b.pivotPrice || a.pivotAt.localeCompare(b.pivotAt));

  const zones = [];
  for (const high of highs) {
    let best = null;
    for (const zone of zones) {
      const distance = Math.abs(high.pivotPrice / zone.center - 1);
      if (distance <= tolerancePct && (!best || distance < best.distance)) best = { zone, distance };
    }
    if (!best) {
      zones.push({
        center: high.pivotPrice,
        members: [high],
        firstPivotAt: high.pivotAt,
        lastConfirmedAt: high.confirmedAt
      });
    } else {
      best.zone.members.push(high);
      best.zone.center = best.zone.members.reduce((s, x) => s + x.pivotPrice, 0) / best.zone.members.length;
      best.zone.lastConfirmedAt = [best.zone.lastConfirmedAt, high.confirmedAt].sort().at(-1);
    }
  }

  return zones
    .map(z => ({
      center: z.center,
      lower: z.center * (1 - tolerancePct),
      upper: z.center * (1 + tolerancePct),
      touchCount: z.members.length,
      pivotDates: z.members.map(x => x.pivotAt),
      confirmedDates: z.members.map(x => x.confirmedAt),
      firstPivotAt: z.firstPivotAt,
      lastConfirmedAt: z.lastConfirmedAt,
      tolerancePct,
      stable: z.members.length >= minTouches
    }))
    .filter(z => z.touchCount >= minTouches)
    .sort((a, b) => a.center - b.center);
}

export function detectWFromSwings(swings, { lowTolerancePct = 0.08 } = {}) {
  const s = Array.isArray(swings) ? swings : [];
  let found = null;
  for (let i = 0; i <= s.length - 3; i += 1) {
    const a = s[i], b = s[i + 1], c = s[i + 2];
    if (a.type !== "LOW" || b.type !== "HIGH" || c.type !== "LOW") continue;
    const lowSimilarity = Math.abs(c.pivotPrice / a.pivotPrice - 1);
    if (lowSimilarity > lowTolerancePct) continue;
    found = {
      formed: true,
      low1: a.pivotPrice,
      neckline: b.pivotPrice,
      low2: c.pivotPrice,
      low1At: a.pivotAt,
      necklineAt: b.pivotAt,
      low2At: c.pivotAt,
      undercut: c.pivotPrice < a.pivotPrice,
      rightFootHigher: c.pivotPrice > a.pivotPrice,
      lowSimilarityPct: lowSimilarity
    };
  }
  return found || { formed: false };
}

function contractionPairs(swings) {
  const out = [];
  for (let i = 0; i < swings.length - 1; i += 1) {
    const hi = swings[i];
    const lo = swings[i + 1];
    if (hi.type !== "HIGH" || lo.type !== "LOW") continue;
    if (!(hi.pivotPrice > 0 && lo.pivotPrice > 0 && lo.pivotAt > hi.pivotAt)) continue;
    out.push({
      high: hi.pivotPrice,
      low: lo.pivotPrice,
      highAt: hi.pivotAt,
      lowAt: lo.pivotAt,
      depthPct: (hi.pivotPrice - lo.pivotPrice) / hi.pivotPrice
    });
  }
  return out;
}

export function detectVcpFromSwings(swings, {
  minContractions = 2,
  wideLooseDepthPct = null
} = {}) {
  const contractions = contractionPairs(Array.isArray(swings) ? swings : []);
  const depths = contractions.map(x => x.depthPct);
  let monotonePairs = 0;
  for (let i = 1; i < depths.length; i += 1) if (depths[i] < depths[i - 1]) monotonePairs += 1;
  const depthMonotonicity = depths.length > 1 ? monotonePairs / (depths.length - 1) : 0;
  let improvingLowPairs = 0;
  for (let i = 1; i < contractions.length; i += 1) if (contractions[i].low >= contractions[i - 1].low) improvingLowPairs += 1;
  const lowProgression = contractions.length > 1 ? improvingLowPairs / (contractions.length - 1) : 0;
  const medianDepth = depths.length
    ? [...depths].sort((a, b) => a - b)[Math.floor(depths.length / 2)]
    : null;
  const explicitWideLooseThreshold = finite(wideLooseDepthPct);
  const wideLoose = explicitWideLooseThreshold !== null && medianDepth !== null
    ? medianDepth > explicitWideLooseThreshold
    : null;
  const topologyCandidate = contractions.length >= minContractions;

  // Full VCP maturity also requires range/volume context from the frozen spec.
  // This swing-only primitive therefore cannot emit VCP_MATURE=true.
  return {
    contractionCount: contractions.length,
    contractions,
    depthMonotonicity,
    lowProgression,
    medianDepth,
    wideLoose,
    topologyCandidate,
    maturityStatus: topologyCandidate ? "TOPOLOGY_ONLY_NEEDS_RANGE_VOLUME" : "INSUFFICIENT_CONTRACTIONS",
    mature: false
  };
}

function medianFinite(values) {
  return median((Array.isArray(values) ? values : []).map(Number).filter(Number.isFinite));
}

function barTrueRange(series, index) {
  const bar = series[index];
  if (!bar) return null;
  const high = Number(bar.high);
  const low = Number(bar.low);
  const prev = index > 0 ? Number(series[index - 1].close) : Number(bar.close);
  if (![high, low, prev].every(Number.isFinite)) return null;
  return Math.max(high - low, Math.abs(high - prev), Math.abs(low - prev));
}

export function analyzeVcpContext({
  bars,
  swings,
  asOfDate,
  priorTrendState = "UNKNOWN",
  finalWindowBars = 5
} = {}) {
  const validated = barsAsOf(bars, asOfDate);
  if (!validated.usable) {
    return { status:"BLOCKED", reason:validated.reason, maturityState:"UNKNOWN" };
  }
  const series = validated.bars;
  const indexByDate = new Map(series.map((x, i) => [x.date, i]));
  const eligibleSwings = (Array.isArray(swings) ? swings : [])
    .filter(x => x?.confirmedAt <= asOfDate && indexByDate.has(x.pivotAt))
    .map(x => ({
      ...x,
      pivotIndex:Number.isInteger(x.pivotIndex) ? x.pivotIndex : indexByDate.get(x.pivotAt),
      pivotPrice:Number(x.pivotPrice)
    }))
    .filter(x => Number.isInteger(x.pivotIndex) && Number.isFinite(x.pivotPrice));

  const topology = detectVcpFromSwings(eligibleSwings);
  const contractions = [];
  for (let i = 0; i < eligibleSwings.length - 1; i += 1) {
    const hi = eligibleSwings[i], lo = eligibleSwings[i + 1];
    if (hi.type !== "HIGH" || lo.type !== "LOW" || lo.pivotIndex <= hi.pivotIndex) continue;
    const legBars = series.slice(hi.pivotIndex, lo.pivotIndex + 1);
    const volumes = legBars.map(x => finite(x.volume)).filter(x => x !== null && x >= 0);
    const ranges = legBars.map((_, j) => barTrueRange(series, hi.pivotIndex + j)).filter(Number.isFinite);
    contractions.push({
      high:hi.pivotPrice,
      low:lo.pivotPrice,
      highAt:hi.pivotAt,
      lowAt:lo.pivotAt,
      highIndex:hi.pivotIndex,
      lowIndex:lo.pivotIndex,
      depthPct:(hi.pivotPrice - lo.pivotPrice) / hi.pivotPrice,
      durationBars:lo.pivotIndex - hi.pivotIndex,
      medianDownVolume:medianFinite(volumes),
      medianDownTrueRange:medianFinite(ranges)
    });
  }

  const depths = contractions.map(x => x.depthPct);
  let depthImprovementPairs = 0;
  for (let i = 1; i < depths.length; i += 1) if (depths[i] < depths[i - 1]) depthImprovementPairs += 1;
  const depthMonotonicity = depths.length > 1 ? depthImprovementPairs / (depths.length - 1) : 0;

  let lowImprovementPairs = 0;
  for (let i = 1; i < contractions.length; i += 1) if (contractions[i].low > contractions[i - 1].low) lowImprovementPairs += 1;
  const lowProgression = contractions.length > 1 ? lowImprovementPairs / (contractions.length - 1) : 0;

  const downVolumes = contractions.map(x => x.medianDownVolume).filter(Number.isFinite);
  const downRanges = contractions.map(x => x.medianDownTrueRange).filter(Number.isFinite);
  const downVolumeDecay = downVolumes.length >= 2 ? downVolumes.at(-1) < downVolumes[0] : null;
  const downRangeDecay = downRanges.length >= 2 ? downRanges.at(-1) < downRanges[0] : null;

  const firstBaseIndex = contractions.length ? contractions[0].highIndex : null;
  const lastLowIndex = contractions.length ? contractions.at(-1).lowIndex : null;
  const windowSize = Math.max(3, Math.floor(Number(finalWindowBars) || 5));
  let finalDryUpRatio = null;
  let finalRangeRatio = null;
  let finalWindowCount = 0;
  if (firstBaseIndex !== null && lastLowIndex !== null) {
    const finalStart = Math.max(lastLowIndex, series.length - windowSize);
    const finalBars = series.slice(finalStart);
    const earlierBars = series.slice(firstBaseIndex, finalStart);
    finalWindowCount = finalBars.length;
    const finalVol = medianFinite(finalBars.map(x => finite(x.volume)));
    const earlierVol = medianFinite(earlierBars.map(x => finite(x.volume)));
    if (finalVol !== null && earlierVol !== null && earlierVol > 0) finalDryUpRatio = finalVol / earlierVol;

    const finalRanges = finalBars.map((_, j) => barTrueRange(series, finalStart + j)).filter(Number.isFinite);
    const earlierRanges = earlierBars.map((_, j) => barTrueRange(series, firstBaseIndex + j)).filter(Number.isFinite);
    const finalRange = medianFinite(finalRanges);
    const earlierRange = medianFinite(earlierRanges);
    if (finalRange !== null && earlierRange !== null && earlierRange > 0) finalRangeRatio = finalRange / earlierRange;
  }

  const trend = String(priorTrendState || "UNKNOWN").toUpperCase();
  const continuationContext = ["ADVANCE","UPTREND","NON_BEARISH"].includes(trend)
    ? true
    : trend === "BEARISH" || trend === "DOWNTREND"
      ? false
      : null;

  const enough = contractions.length >= 2;
  const improvingStructure = depthMonotonicity > 0 && lowProgression > 0;
  const volumeImproving = downVolumeDecay === true && finalDryUpRatio !== null && finalDryUpRatio < 1;
  const rangeImproving = downRangeDecay === true && finalRangeRatio !== null && finalRangeRatio < 1;

  let maturityState = "FORMING";
  if (enough) maturityState = "VALID";
  if (enough && continuationContext === null) maturityState = "VALID_CONTEXT_UNKNOWN";
  if (enough && continuationContext === false) maturityState = "GENERIC_COMPRESSION_NOT_CONTINUATION_VCP";
  if (enough && continuationContext === true && improvingStructure && volumeImproving && rangeImproving) {
    maturityState = "MATURE";
  }

  return {
    status:"VALID",
    reason:null,
    contractionCount:contractions.length,
    contractions,
    depthMonotonicity,
    lowProgression,
    downVolumeDecay,
    downRangeDecay,
    finalDryUpRatio,
    finalRangeRatio,
    finalWindowCount,
    priorTrendState:trend,
    continuationContext,
    topologyCandidate:topology.topologyCandidate,
    maturityState,
    researchOnly:true,
    decisionImpact:false
  };
}

export function detectPlatform(bars, {
  asOfDate,
  minBars = 5,
  maxRangePct = 0.06
} = {}) {
  const validated = barsAsOf(bars, asOfDate);
  if (!validated.usable) return { formed: false, status: validated.status, reason: validated.reason };
  if (validated.bars.length < minBars) return { formed: false, status: "INSUFFICIENT_BARS" };
  const window = validated.bars.slice(-minBars);
  const high = Math.max(...window.map(x => x.high));
  const low = Math.min(...window.map(x => x.low));
  const mid = (high + low) / 2;
  const rangePct = mid > 0 ? (high - low) / mid : Infinity;
  return { formed: rangePct <= maxRangePct, rangePct, high, low, bars: minBars };
}

export function classifyVShape(bars, { asOfDate } = {}) {
  const validated = barsAsOf(bars, asOfDate);
  if (!validated.usable || validated.bars.length < 5) {
    return { vShapedBase: false, highConfidenceCup: false, status: validated.status };
  }
  const closes = validated.bars.map(x => x.close);
  const min = Math.min(...closes);
  const minIndex = closes.indexOf(min);
  if (minIndex <= 0 || minIndex >= closes.length - 1) {
    return { vShapedBase: false, highConfidenceCup: false, bottomResidenceBars: 0 };
  }
  const left = Math.max(...closes.slice(0, minIndex));
  const right = closes.at(-1);
  const dropPct = left > 0 ? (left - min) / left : 0;
  const recoveryRatio = left > min ? (right - min) / (left - min) : 0;
  const bottomResidenceBars = closes.filter(x => x <= min * 1.03).length;
  const descentBars = minIndex;
  const recoveryBars = closes.length - 1 - minIndex;
  const vShapedBase = dropPct >= 0.15 && recoveryRatio >= 0.8 &&
    bottomResidenceBars <= 2 && descentBars <= 5 && recoveryBars <= 5;
  const highConfidenceCup = dropPct >= 0.12 && recoveryRatio >= 0.85 &&
    bottomResidenceBars >= 3 && descentBars >= 3 && recoveryBars >= 3 && !vShapedBase;
  return {
    vShapedBase,
    highConfidenceCup,
    bottomResidenceBars,
    descentBars,
    recoveryBars,
    dropPct,
    recoveryRatio
  };
}

export function classifyCorporateActionGap({
  rawPrev,
  rawCurrent,
  morphologyPrev,
  morphologyCurrent,
  corporateActionTag = false,
  adjustmentReady = true,
  gapThresholdPct = null
} = {}) {
  if (!adjustmentReady) {
    return {
      status: "DATA_BLOCKED",
      reason: "ADJUSTMENT_MODE_MISMATCH_OR_PROVENANCE_UNKNOWN",
      rawGapPct: null,
      morphologyGapPct: null,
      residualPatternGapFlag: null,
      rawGapPatternEligible: false,
      morphologyGapPatternEligible: false
    };
  }

  const rawPreviousClose = Number(rawPrev?.close);
  const rawOpen = Number(rawCurrent?.open);
  const morphologyPreviousClose = Number(morphologyPrev?.close);
  const morphologyOpen = Number(morphologyCurrent?.open);
  if (![rawPreviousClose, rawOpen, morphologyPreviousClose, morphologyOpen].every(Number.isFinite) ||
      !(rawPreviousClose > 0 && morphologyPreviousClose > 0)) {
    return {
      status: "DATA_BLOCKED",
      reason: "CORPORATE_ACTION_GAP_INPUT_INCOMPLETE",
      rawGapPct: null,
      morphologyGapPct: null,
      residualPatternGapFlag: null,
      rawGapPatternEligible: false,
      morphologyGapPatternEligible: false
    };
  }

  const rawGapPct = rawOpen / rawPreviousClose - 1;
  const morphologyGapPct = morphologyOpen / morphologyPreviousClose - 1;
  const adjustmentFactorObserved = morphologyPreviousClose / rawPreviousClose;
  const threshold = finite(gapThresholdPct);
  const residualPatternGapFlag = threshold !== null && threshold > 0
    ? Math.abs(morphologyGapPct) >= threshold
    : null;

  // A corporate action does not mean the day has "no gap".
  // It means raw pre/post prices are not the correct morphology comparison.
  // Any residual move versus the continuity reference remains genuine market information.
  return {
    status: "VALID",
    corporateActionTag: Boolean(corporateActionTag),
    rawGapPct,
    morphologyGapPct,
    adjustmentFactorObserved,
    mechanicalDiscontinuityNeutralized: Boolean(corporateActionTag),
    patternGapPct: morphologyGapPct,
    residualPatternGapFlag,
    rawGapPatternEligible: !corporateActionTag,
    morphologyGapPatternEligible: true,
    rawWUndercutEligible: !corporateActionTag,
    morphologyWUndercutEligible: true,
    semanticSpace: "TECHNICAL_CONTINUITY_RESIDUAL"
  };
}

export function classifyLimitBreakout({
  priorResistance,
  referencePrice,
  bar,
  priceLimitPct = 0.10,
  tolerancePct = 0.002
} = {}) {
  const resistance = Number(priorResistance);
  const ref = Number(referencePrice);
  const close = Number(bar?.close);
  const high = Number(bar?.high);
  const localBreakout = Number.isFinite(close) && Number.isFinite(resistance) && close > resistance;
  const limitPrice = ref * (1 + Number(priceLimitPct));
  const priceLimitConstrained = Number.isFinite(limitPrice) && Number.isFinite(close) &&
    Math.abs(close / limitPrice - 1) <= tolerancePct &&
    Number.isFinite(high) && Math.abs(high / close - 1) <= tolerancePct;
  return {
    localBreakout,
    priceLimitConstrained,
    acceptanceState: localBreakout && priceLimitConstrained ? "UNRESOLVED" : (localBreakout ? "OBSERVABLE" : "NO_BREAKOUT")
  };
}

export function classifyDeadLiquidityTightBase({
  bars,
  tickSize,
  minHealthyTurnover = 1_000_000
} = {}) {
  const validated = validatePatternBars({ bars });
  if (!validated.usable) return { status: validated.status, reason: validated.reason };
  const highs = validated.bars.map(x => x.high);
  const lows = validated.bars.map(x => x.low);
  const closes = validated.bars.map(x => x.close);
  const center = closes.reduce((s, x) => s + x, 0) / closes.length;
  const rangePct = center > 0 ? (Math.max(...highs) - Math.min(...lows)) / center : Infinity;
  const tick = Number(tickSize);
  const barRangesInTicks = validated.bars.map(x => tick > 0 ? (x.high - x.low) / tick : Infinity);
  const medianTicks = [...barRangesInTicks].sort((a, b) => a - b)[Math.floor(barRangesInTicks.length / 2)];
  const turnovers = validated.bars.map(x => x.turnover).filter(Number.isFinite);
  const medianTurnover = turnovers.length
    ? [...turnovers].sort((a, b) => a - b)[Math.floor(turnovers.length / 2)]
    : null;
  const geometricTightness = rangePct <= 0.01;
  const tickDominanceHigh = Number.isFinite(medianTicks) && medianTicks <= 1.5;
  const liquidityQualityLow = medianTurnover === null || medianTurnover < minHealthyTurnover;
  return {
    status: "VALID",
    geometricTightness,
    tickDominanceHigh,
    liquidityQualityLow,
    healthyCompressionConfidence: geometricTightness && (tickDominanceHigh || liquidityQualityLow) ? "REDUCED_OR_UNKNOWN" : "NORMAL",
    rangePct,
    medianTicks,
    medianTurnover
  };
}

export function classifyNestedResistance({
  localResistance,
  majorZoneCenter,
  currentClose,
  majorTolerancePct = 0.01
} = {}) {
  const local = Number(localResistance);
  const major = Number(majorZoneCenter);
  const close = Number(currentClose);
  const lower = major * (1 - majorTolerancePct);
  const upper = major * (1 + majorTolerancePct);
  const localBreakout = close > local;
  const availableAirPct = (lower - close) / close;
  const zoneRelation = close < lower ? "BELOW_ZONE" : close <= upper ? "INSIDE_ZONE" : "ABOVE_ZONE";
  const majorZoneConflict = localBreakout && zoneRelation !== "ABOVE_ZONE";
  const nestedConflictState = !localBreakout
    ? "NO_LOCAL_BREAKOUT"
    : zoneRelation === "BELOW_ZONE"
      ? "LOCAL_BREAKOUT_BELOW_MAJOR_ZONE"
      : zoneRelation === "INSIDE_ZONE"
        ? "LOCAL_BREAKOUT_INSIDE_MAJOR_ZONE"
        : "LOCAL_BREAKOUT_ABOVE_MAJOR_ZONE";
  return {
    localBreakout,
    majorZoneConflict,
    nestedConflictState,
    zoneRelation,
    availableAirPct,
    majorZone: { center: major, lower, upper }
  };
}

export function classifyEventGapBreakout({
  previousClose,
  resistance,
  bar,
  eventProvenanceKnown = true
} = {}) {
  const prev = Number(previousClose);
  const open = Number(bar?.open);
  const close = Number(bar?.close);
  const gapBreakout = open > Number(resistance);
  const overnightReturn = open / prev - 1;
  const intradayReturn = close / open - 1;
  return {
    gapBreakout,
    eventCreated: eventProvenanceKnown,
    overnightReturn,
    intradayReturn,
    attribution: eventProvenanceKnown ? "EVENT_AND_PRIOR_PATTERN_SEPARATE" : "UNKNOWN"
  };
}

export function classifyRepeatedResistanceTests(attempts = []) {
  const a = Array.isArray(attempts) ? attempts : [];
  if (a.length < 2) return { touchCount: a.length, progression: "UNKNOWN" };
  const lowDeltas = [];
  const closeDeltas = [];
  const rejection = [];
  for (let i = 1; i < a.length; i += 1) {
    lowDeltas.push(Number(a[i].low) - Number(a[i - 1].low));
    closeDeltas.push(Number(a[i].close) - Number(a[i - 1].close));
  }
  for (const x of a) rejection.push(Number(x.resistance) - Number(x.close));
  const lowsProgress = lowDeltas.every(x => x > 0);
  const closesProgress = closeDeltas.every(x => x > 0);
  let rejectionWeakens = true;
  for (let i = 1; i < rejection.length; i += 1) if (!(rejection[i] < rejection[i - 1])) rejectionWeakens = false;
  const progression = lowsProgress && closesProgress && rejectionWeakens
    ? "ABSORPTION_LIKE"
    : "BARRIER_PERSISTENT_OR_AMBIGUOUS";
  return { touchCount: a.length, lowsProgress, closesProgress, rejectionWeakens, progression };
}

export function buildPatternSnapshot({
  bars,
  asOfDate,
  swingThresholdPct = 0.05,
  zoneTolerancePct = 0.015,
  platformBars = 5,
  platformMaxRangePct = 0.06
} = {}) {
  const validated = barsAsOf(bars, asOfDate);
  if (!validated.usable) {
    return {
      detectorVersion: PATTERN_CORE_VERSION,
      researchOnly: true,
      decisionImpact: false,
      asOfDate,
      status: "BLOCKED",
      reason: validated.reason
    };
  }
  const swingResult = detectDirectionalChangeSwings({ bars: validated.bars, asOfDate, thresholdPct: swingThresholdPct });
  const swings = swingResult.swings;
  const snapshot = {
    detectorVersion: PATTERN_CORE_VERSION,
    researchOnly: true,
    decisionImpact: false,
    asOfDate,
    status: "VALID",
    sourceBarCount: validated.bars.length,
    sourceHash: stableHash(validated.bars),
    swings,
    w: detectWFromSwings(swings),
    vcp: detectVcpFromSwings(swings),
    platform: detectPlatform(validated.bars, { asOfDate, minBars: platformBars, maxRangePct: platformMaxRangePct }),
    resistanceZones: buildResistanceZones(swings, { tolerancePct: zoneTolerancePct }),
    vShape: classifyVShape(validated.bars, { asOfDate })
  };
  return { ...snapshot, snapshotHash: stableHash(snapshot) };
}

export function replayPatternSnapshot(args = {}) {
  const replay = buildPatternSnapshot(args);
  return {
    replay,
    replayHash: replay.snapshotHash || stableHash(replay),
    researchOnly: true,
    decisionImpact: false
  };
}
