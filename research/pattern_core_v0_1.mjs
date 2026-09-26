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
  requireOpen = false,
  requireVolume = false,
  requireSymbolSession = false
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

  let symbolSessionSourceId=null;
  let symbolSessionPayloadHash=null;
  if (requireSymbolSession === true) {
    symbolSessionSourceId=String(provenance?.symbolSessionSourceId||"");
    symbolSessionPayloadHash=String(provenance?.symbolSessionPayloadHash||"");
    if (provenance?.symbolSessionReady !== true) {
      return { usable:false, status:"BLOCKED", reason:"SYMBOL_SESSION_PROVENANCE_UNKNOWN" };
    }
    if (!symbolSessionSourceId || !symbolSessionPayloadHash) {
      return { usable:false, status:"BLOCKED", reason:"SYMBOL_SESSION_PROVENANCE_INCOMPLETE" };
    }
  }

  const barCheck = validatePatternBars({ bars, requireOpen });
  if (!barCheck.usable) return barCheck;

  let volumeSemanticSpace=null;
  let volumePrecisionClass=null;
  let volumeExactShareCount=null;
  if (requireVolume === true) {
    const volumeSpaces=[
      "RAW_LOT_VOLUME",
      "RAW_SHARE_VOLUME",
      "REGISTERED_ISSUED_SHARE_TURNOVER",
      "EXCHANGE_LISTED_SHARE_TURNOVER",
      "FREE_FLOAT_TURNOVER"
    ];
    volumeSemanticSpace=String(provenance?.volumeSemanticSpace||"");
    volumePrecisionClass=String(provenance?.volumePrecisionClass||"");
    const volumeSourceId=String(provenance?.volumeSourceId||"");
    const volumePayloadHash=String(provenance?.volumePayloadHash||"");
    if (!volumeSourceId || !volumePayloadHash) {
      return { usable:false, status:"BLOCKED", reason:"VOLUME_SOURCE_PROVENANCE_INCOMPLETE" };
    }
    if (!volumeSpaces.includes(volumeSemanticSpace)) {
      return { usable:false, status:"BLOCKED", reason:"VOLUME_SEMANTIC_SPACE_UNKNOWN" };
    }
    if (barCheck.bars.some(x=>!Number.isFinite(Number(x.volume)) || Number(x.volume)<0)) {
      return { usable:false, status:"BLOCKED", reason:"VOLUME_DATA_INCOMPLETE" };
    }
    if (provenance?.shareUnitComparable !== true) {
      return { usable:false, status:"BLOCKED", reason:"VOLUME_SHARE_UNIT_COMPARABILITY_UNKNOWN" };
    }
    if (volumeSemanticSpace === "RAW_SHARE_VOLUME") {
      if (volumePrecisionClass !== "EXACT_SHARES") {
        return { usable:false, status:"BLOCKED", reason:"RAW_SHARE_VOLUME_PRECISION_UNKNOWN" };
      }
      volumeExactShareCount=true;
    } else if (volumeSemanticSpace === "RAW_LOT_VOLUME") {
      if (volumePrecisionClass !== "LOT_COUNT_WITH_UNKNOWN_SUBLOT_REMAINDER") {
        return { usable:false, status:"BLOCKED", reason:"RAW_LOT_VOLUME_PRECISION_UNKNOWN" };
      }
      volumeExactShareCount=false;
    } else {
      if (provenance?.denominatorReady !== true) {
        return { usable:false, status:"BLOCKED", reason:"VOLUME_DENOMINATOR_NOT_READY" };
      }
      if (!volumePrecisionClass) {
        return { usable:false, status:"BLOCKED", reason:"VOLUME_PRECISION_UNKNOWN" };
      }
      volumeExactShareCount=volumePrecisionClass==="EXACT_SHARES";
    }
  }

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
    symbolSessionRequired:requireSymbolSession===true,
    symbolSessionReady:requireSymbolSession===true ? true : null,
    symbolSessionSourceId:requireSymbolSession===true ? symbolSessionSourceId : null,
    symbolSessionPayloadHash:requireSymbolSession===true ? symbolSessionPayloadHash : null,
    volumeRequired:requireVolume===true,
    volumeSemanticSpace,
    volumePrecisionClass,
    volumeExactShareCount,
    volumeSourceId:requireVolume===true ? String(provenance?.volumeSourceId||"") : null,
    volumePayloadHash:requireVolume===true ? String(provenance?.volumePayloadHash||"") : null,
    shareUnitComparable:requireVolume===true ? true : null,
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

export function analyzeWLifecycle({
  bars,
  swings,
  asOfDate,
  priorTrendState = "UNKNOWN",
  atrPeriod = 20,
  supportAtrMultiple = 0.5
} = {}) {
  const validated = barsAsOf(bars, asOfDate);
  if (!validated.usable) return { status:"BLOCKED", reason:validated.reason, lifecycle:"UNKNOWN" };
  const series = validated.bars;
  const indexByDate = new Map(series.map((x, i) => [x.date, i]));
  const eligible = (Array.isArray(swings) ? swings : [])
    .filter(x => x?.confirmedAt <= asOfDate && indexByDate.has(x.pivotAt) && indexByDate.has(x.confirmedAt))
    .map(x => ({
      ...x,
      pivotIndex:indexByDate.get(x.pivotAt),
      confirmedIndex:indexByDate.get(x.confirmedAt),
      pivotPrice:Number(x.pivotPrice)
    }))
    .filter(x => Number.isFinite(x.pivotPrice));

  let low1 = null, mid = null, low2 = null;
  for (let i = 0; i < eligible.length; i += 1) {
    if (!low1 && eligible[i].type === "LOW") {
      low1 = eligible[i];
      continue;
    }
    if (low1 && !mid && eligible[i].type === "HIGH" && eligible[i].pivotIndex > low1.pivotIndex) {
      mid = eligible[i];
      continue;
    }
    if (low1 && mid && eligible[i].type === "LOW" && eligible[i].pivotIndex > mid.pivotIndex) {
      low2 = eligible[i];
    }
  }

  if (!low1) {
    return { status:"VALID", lifecycle:"NO_CONFIRMED_LOW", researchOnly:true, decisionImpact:false };
  }
  if (!mid) {
    return {
      status:"VALID", lifecycle:"W_FORMING_LOW1",
      low1Price:low1.pivotPrice, low1At:low1.pivotAt, low1ConfirmedAt:low1.confirmedAt,
      researchOnly:true, decisionImpact:false
    };
  }
  if (!low2) {
    const last = series.at(-1);
    const atrAtLow1 = simpleAtrBeforeIndex(series, low1.confirmedIndex, atrPeriod);
    const tick = researchTickSize(low1.pivotPrice);
    const supportHalfWidth = Math.max(tick ? 2*tick : 0, atrAtLow1 ? supportAtrMultiple*atrAtLow1 : 0);
    const revisiting = Number(last.low) <= low1.pivotPrice + supportHalfWidth;
    return {
      status:"VALID",
      lifecycle:revisiting ? "W_SECOND_TEST_FORMING" : "W_MID_HIGH_CONFIRMED",
      low1Price:low1.pivotPrice, midHighPrice:mid.pivotPrice,
      necklinePrice:mid.pivotPrice,
      supportHalfWidth,
      researchOnly:true, decisionImpact:false
    };
  }

  const neckline = mid.pivotPrice;
  const avgLow = (low1.pivotPrice + low2.pivotPrice) / 2;
  const troughDifferencePct = avgLow > 0 ? (low2.pivotPrice / low1.pivotPrice - 1) : null;
  const troughSimilarityAbsPct = troughDifferencePct === null ? null : Math.abs(troughDifferencePct);
  const atrAtLow2 = simpleAtrBeforeIndex(series, low2.confirmedIndex, atrPeriod);
  const tick = researchTickSize(avgLow);
  const supportHalfWidth = Math.max(tick ? 2*tick : 0, atrAtLow2 ? supportAtrMultiple*atrAtLow2 : 0);
  const supportLower = avgLow - supportHalfWidth;
  const supportUpper = avgLow + supportHalfWidth;

  const afterLow2 = series.slice(low2.confirmedIndex);
  const breakoutIndexLocal = afterLow2.findIndex(x => Number(x.close) > neckline);
  const breakoutIndex = breakoutIndexLocal >= 0 ? low2.confirmedIndex + breakoutIndexLocal : null;
  const close = Number(series.at(-1).close);
  const necklineDistancePct = neckline > 0 ? close / neckline - 1 : null;

  const low2Variant = low2.pivotPrice > low1.pivotPrice + supportHalfWidth
    ? "HIGHER_LOW_W"
    : low2.pivotPrice < low1.pivotPrice - supportHalfWidth
      ? "UNDERCUT_CANDIDATE_W"
      : "EQUAL_LOW_W";

  let undercutReclaim = false;
  if (low2.pivotPrice < supportLower) {
    undercutReclaim = afterLow2.some(x => Number(x.close) > supportUpper);
  }

  const postBreak = breakoutIndex === null ? [] : series.slice(breakoutIndex + 1);
  const retest = postBreak.length
    ? postBreak.some(x => Number(x.low) <= neckline + supportHalfWidth && Number(x.close) >= neckline - supportHalfWidth)
    : false;
  const failedAfterBreak = postBreak.length
    ? postBreak.some(x => Number(x.close) < supportLower)
    : false;
  const supportCollapsedBeforeBreak = breakoutIndex === null &&
    afterLow2.some(x => Number(x.close) < supportLower);

  let lifecycle = "W_STRUCTURE_VALID";
  if (supportCollapsedBeforeBreak) lifecycle = undercutReclaim ? "W_UNDERCUT_RECLAIM" : "W_FAILED";
  else if (breakoutIndex !== null) lifecycle = failedAfterBreak ? "W_FAILED" : retest ? "W_RETEST_CONFIRMING" : "W_BREAKOUT_CONFIRMED";
  else if (undercutReclaim) lifecycle = "W_UNDERCUT_RECLAIM";
  else if (necklineDistancePct !== null && necklineDistancePct <= 0) lifecycle = "W_NECKLINE_APPROACH";

  const trend = String(priorTrendState || "UNKNOWN").toUpperCase();
  const family = ["DOWNTREND","DECLINE","DAMAGED"].includes(trend)
    ? "REVERSAL_W"
    : ["UPTREND","ADVANCE","NON_BEARISH"].includes(trend)
      ? "CONTINUATION_W"
      : "W_CONTEXT_UNKNOWN";

  return {
    status:"VALID",
    lifecycle,
    family,
    low2Variant:undercutReclaim ? "UNDERCUT_RECLAIM_W" : low2Variant,
    low1Price:low1.pivotPrice,
    low1At:low1.pivotAt,
    low1ConfirmedAt:low1.confirmedAt,
    midHighPrice:mid.pivotPrice,
    midHighAt:mid.pivotAt,
    midHighConfirmedAt:mid.confirmedAt,
    low2Price:low2.pivotPrice,
    low2At:low2.pivotAt,
    low2ConfirmedAt:low2.confirmedAt,
    necklinePrice:neckline,
    troughDifferencePct,
    troughSimilarityAbsPct,
    necklineHeightPct:avgLow > 0 ? (neckline - avgLow) / avgLow : null,
    necklineDistancePct,
    supportZone:{lower:supportLower,center:avgLow,upper:supportUpper,halfWidth:supportHalfWidth},
    undercutReclaim,
    breakoutAt:breakoutIndex === null ? null : series[breakoutIndex].date,
    retestObserved:retest,
    researchOnly:true,
    decisionImpact:false
  };
}

export function analyzePlatformLifecycle({
  bars,
  swings,
  asOfDate,
  atrPeriod = 20,
  touchAtrMultiple = 0.5,
  minUpperTouches = 2,
  minLowerTouches = 2
} = {}) {
  const validated = barsAsOf(bars, asOfDate);
  if (!validated.usable) return { status:"BLOCKED", reason:validated.reason, lifecycle:"UNKNOWN" };
  const series = validated.bars;
  const indexByDate = new Map(series.map((x, i) => [x.date, i]));
  const eligible = (Array.isArray(swings) ? swings : [])
    .filter(x => x?.confirmedAt <= asOfDate && indexByDate.has(x.pivotAt))
    .map(x => ({...x,pivotIndex:indexByDate.get(x.pivotAt),pivotPrice:Number(x.pivotPrice)}))
    .filter(x => Number.isFinite(x.pivotPrice));
  const highs = eligible.filter(x => x.type === "HIGH");
  const lows = eligible.filter(x => x.type === "LOW");
  if (!highs.length || !lows.length) {
    return {
      status:"VALID", lifecycle:"PLATFORM_FORMING",
      upperTouchCount:highs.length, lowerTouchCount:lows.length,
      researchOnly:true, decisionImpact:false
    };
  }

  const resistanceLevel = medianFinite(highs.map(x => x.pivotPrice));
  const supportLevel = medianFinite(lows.map(x => x.pivotPrice));
  if (!(resistanceLevel > supportLevel && supportLevel > 0)) {
    return { status:"VALID", lifecycle:"PLATFORM_FORMING", researchOnly:true, decisionImpact:false };
  }
  const lastConfirmedIndex = Math.max(...eligible.map(x => indexByDate.get(x.confirmedAt) ?? x.pivotIndex));
  const atr = simpleAtrBeforeIndex(series, Math.max(atrPeriod,lastConfirmedIndex), atrPeriod);
  const center = (resistanceLevel + supportLevel) / 2;
  const tick = researchTickSize(center);
  const touchTolerance = Math.max(tick ? 2*tick : 0, atr ? touchAtrMultiple*atr : 0);
  const upperTouches = highs.filter(x => Math.abs(x.pivotPrice - resistanceLevel) <= touchTolerance);
  const lowerTouches = lows.filter(x => Math.abs(x.pivotPrice - supportLevel) <= touchTolerance);
  const topologyValid = upperTouches.length >= minUpperTouches && lowerTouches.length >= minLowerTouches;
  const platformStartIndex = topologyValid
    ? Math.min(...[...upperTouches,...lowerTouches].map(x => x.pivotIndex))
    : Math.min(...eligible.map(x => x.pivotIndex));
  const baseBars = series.slice(platformStartIndex);
  const tr = baseBars.map((_,j)=>barTrueRange(series,platformStartIndex+j)).filter(Number.isFinite);
  const split = Math.max(1,Math.floor(tr.length/2));
  const earlyRange = medianFinite(tr.slice(0,split));
  const lateRange = medianFinite(tr.slice(split));
  const rangeContractionRatio = earlyRange && lateRange !== null ? lateRange/earlyRange : null;

  const volumes = baseBars.map(x=>finite(x.volume)).filter(x=>x!==null && x>=0);
  const vSplit = Math.max(1,Math.floor(volumes.length/2));
  const earlyVol = medianFinite(volumes.slice(0,vSplit));
  const lateVol = medianFinite(volumes.slice(vSplit));
  const volumeContractionRatio = earlyVol && lateVol !== null ? lateVol/earlyVol : null;

  const close = Number(series.at(-1).close);
  const breakout = topologyValid && close > resistanceLevel + touchTolerance;
  const breakdown = topologyValid && close < supportLevel - touchTolerance;
  const inside = close >= supportLevel - touchTolerance && close <= resistanceLevel + touchTolerance;

  let lifecycle = topologyValid ? "PLATFORM_VALID" : "PLATFORM_FORMING";
  if (topologyValid && rangeContractionRatio !== null && rangeContractionRatio < 1 &&
      volumeContractionRatio !== null && volumeContractionRatio < 1 && inside) lifecycle = "PLATFORM_TIGHT";
  if (breakout) lifecycle = "PLATFORM_BREAKOUT_CONFIRMED";
  if (breakdown) lifecycle = "PLATFORM_FAILED";

  return {
    status:"VALID",
    lifecycle,
    topologyValid,
    platformStartAt:series[platformStartIndex]?.date || null,
    platformEndAt:series.at(-1).date,
    platformDurationBars:series.length-platformStartIndex,
    resistanceLevel,
    supportLevel,
    platformHeightPct:center>0?(resistanceLevel-supportLevel)/center:null,
    upperTouchCount:upperTouches.length,
    lowerTouchCount:lowerTouches.length,
    touchTolerance,
    rangeContractionRatio,
    volumeContractionRatio,
    closeLocationWithinPlatform:(resistanceLevel>supportLevel)?(close-supportLevel)/(resistanceLevel-supportLevel):null,
    pivotDistancePct:resistanceLevel>0?close/resistanceLevel-1:null,
    breakout,
    breakdown,
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

function roundToPrecision(value, digits = 8) {
  const m = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * m) / m;
}

function floorToTaiwanStockTick(value) {
  const x = finite(value);
  if (!(x > 0)) return null;
  const tick = researchTickSize(x);
  if (!(tick > 0)) return null;
  let candidate = Math.floor((x + 1e-12) / tick) * tick;
  candidate = roundToPrecision(candidate);
  // Price-bracket boundaries are legal prices shared by the adjacent grids.
  // Re-evaluate at the candidate itself to guard against crossing a tick bracket.
  const candidateTick = researchTickSize(candidate);
  if (!(candidateTick > 0)) return null;
  if (Math.abs(candidate / candidateTick - Math.round(candidate / candidateTick)) > 1e-8) {
    candidate = Math.floor((candidate + 1e-12) / candidateTick) * candidateTick;
  }
  return roundToPrecision(candidate);
}

function ceilToTaiwanStockTick(value) {
  const x = finite(value);
  if (!(x > 0)) return null;
  const tick = researchTickSize(x);
  if (!(tick > 0)) return null;
  let candidate = Math.ceil((x - 1e-12) / tick) * tick;
  candidate = roundToPrecision(candidate);
  const candidateTick = researchTickSize(candidate);
  if (!(candidateTick > 0)) return null;
  if (Math.abs(candidate / candidateTick - Math.round(candidate / candidateTick)) > 1e-8) {
    candidate = Math.ceil((candidate - 1e-12) / candidateTick) * candidateTick;
  }
  return roundToPrecision(candidate);
}

// Standard Taiwan listed/OTC stock daily price-limit calculator.
// TWSE's published example requires the computed +/- limit to ALSO be a legal tick:
// limit-up is the highest legal quote not exceeding ref*(1+p);
// limit-down is the lowest legal quote not below ref*(1-p).
// Caller must separately prove that the security/session is actually subject to the
// standard stock limit (e.g. not an IPO no-limit exception).
export function taiwanStockPriceLimits({
  referencePrice,
  priceLimitPct = 0.10,
  standardLimitApplies = null,
  referencePriceComparable = null
} = {}) {
  const ref = finite(referencePrice);
  const pct = finite(priceLimitPct);
  if (!(ref > 0) || !(pct > 0 && pct < 1)) {
    return { status:"BLOCKED", reason:"PRICE_LIMIT_INPUT_INVALID" };
  }
  if (standardLimitApplies !== true) {
    return {
      status:"BLOCKED",
      reason:standardLimitApplies === false ? "STANDARD_PRICE_LIMIT_NOT_APPLICABLE" : "PRICE_LIMIT_RULE_UNKNOWN",
      referencePrice:ref,
      priceLimitPct:pct,
      limitUp:null,
      limitDown:null
    };
  }
  if (referencePriceComparable !== true) {
    return {
      status:"BLOCKED",
      reason:referencePriceComparable === false ? "REFERENCE_PRICE_UNIT_MISMATCH" : "REFERENCE_PRICE_COMPARABILITY_UNKNOWN",
      referencePrice:ref,
      priceLimitPct:pct,
      limitUp:null,
      limitDown:null
    };
  }
  const rawUpper = ref * (1 + pct);
  const rawLower = ref * (1 - pct);
  const limitUp = floorToTaiwanStockTick(rawUpper);
  const limitDown = ceilToTaiwanStockTick(rawLower);
  if (!(limitUp > 0) || !(limitDown > 0)) {
    return { status:"BLOCKED", reason:"PRICE_LIMIT_TICK_RESOLUTION_FAILED" };
  }
  return {
    status:"VALID",
    referencePrice:ref,
    priceLimitPct:pct,
    rawUpper,
    rawLower,
    limitUp,
    limitDown,
    limitUpTick:researchTickSize(limitUp),
    limitDownTick:researchTickSize(limitDown),
    rule:"TWSE_TPEX_STOCK_STANDARD_LIMIT_WITH_LEGAL_TICK"
  };
}

export function classifyLimitBreakout({
  priorResistance,
  referencePrice,
  bar,
  priceLimitPct = 0.10,
  standardLimitApplies = null,
  referencePriceComparable = null
} = {}) {
  const resistance = finite(priorResistance);
  const close = finite(bar?.close);
  const high = finite(bar?.high);
  const limits = taiwanStockPriceLimits({
    referencePrice,
    priceLimitPct,
    standardLimitApplies,
    referencePriceComparable
  });
  const localBreakout = close !== null && resistance !== null && close > resistance;

  if (limits.status !== "VALID") {
    return {
      status:"BLOCKED",
      reason:limits.reason,
      localBreakout,
      limitTouched:null,
      closedAtLimitUp:null,
      priceLimitConstrained:null,
      acceptanceState:localBreakout ? "UNKNOWN" : "NO_BREAKOUT",
      limits
    };
  }

  const eps = Math.max(1e-9, (limits.limitUpTick || 0) * 1e-6);
  const limitTouched = high !== null && high >= limits.limitUp - eps;
  const closedAtLimitUp = close !== null && Math.abs(close - limits.limitUp) <= eps;
  const priceLimitConstrained = limitTouched && closedAtLimitUp;
  const censoringState = priceLimitConstrained
    ? "CLOSED_AT_LIMIT_UP"
    : limitTouched
      ? "TOUCHED_LIMIT_UP_NOT_LOCKED_AT_CLOSE"
      : "NO_LIMIT_TOUCH";

  return {
    status:"VALID",
    localBreakout,
    limitTouched,
    closedAtLimitUp,
    priceLimitConstrained,
    censoringState,
    acceptanceState:localBreakout && priceLimitConstrained ? "UNRESOLVED" : (localBreakout ? "OBSERVABLE" : "NO_BREAKOUT"),
    limits
  };
}

export function classifyDeadLiquidityTightBase({
  bars,
  tickSize,
  tightRangeThresholdPct = null,
  tickDominanceThreshold = null,
  minHealthyTurnover = null
} = {}) {
  const validated = validatePatternBars({ bars });
  if (!validated.usable) return { status: validated.status, reason: validated.reason };
  const highs = validated.bars.map(x => x.high);
  const lows = validated.bars.map(x => x.low);
  const closes = validated.bars.map(x => x.close);
  const center = closes.reduce((s, x) => s + x, 0) / closes.length;
  const rangePct = center > 0 ? (Math.max(...highs) - Math.min(...lows)) / center : Infinity;
  const tick = finite(tickSize);
  const barRangesInTicks = validated.bars.map(x => tick !== null && tick > 0 ? (x.high - x.low) / tick : null);
  const medianTicks = medianFinite(barRangesInTicks);
  const turnovers = validated.bars.map(x => finite(x.turnover)).filter(x => x !== null && x >= 0);
  const medianTurnover = medianFinite(turnovers);

  const tightThreshold = finite(tightRangeThresholdPct);
  const tickThreshold = finite(tickDominanceThreshold);
  const turnoverThreshold = finite(minHealthyTurnover);
  const geometricTightness = tightThreshold !== null && tightThreshold > 0
    ? rangePct <= tightThreshold
    : null;
  const tickDominanceHigh = tickThreshold !== null && tickThreshold > 0 && medianTicks !== null
    ? medianTicks <= tickThreshold
    : null;
  const liquidityQualityLow = turnoverThreshold !== null && turnoverThreshold > 0 && medianTurnover !== null
    ? medianTurnover < turnoverThreshold
    : null;

  const thresholdsReady = geometricTightness !== null &&
    tickDominanceHigh !== null &&
    liquidityQualityLow !== null;
  const healthyCompressionConfidence = !thresholdsReady
    ? "UNKNOWN_THRESHOLD_CONFIG"
    : geometricTightness && (tickDominanceHigh || liquidityQualityLow)
      ? "REDUCED_OR_UNKNOWN"
      : "NORMAL";

  return {
    status: "VALID",
    geometricTightness,
    tickDominanceHigh,
    liquidityQualityLow,
    healthyCompressionConfidence,
    rangePct,
    medianTicks,
    medianTurnover,
    thresholdConfig: {
      tightRangeThresholdPct: tightThreshold,
      tickDominanceThreshold: tickThreshold,
      minHealthyTurnover: turnoverThreshold
    },
    definitionNote: "Continuous liquidity/tick geometry is primary. Boolean labels require explicit preregistered thresholds; missing thresholds remain UNKNOWN.",
    researchOnly:true,
    decisionImpact:false
  };
}

export function classifyNestedResistance({
  localResistance,
  majorZoneCenter,
  currentClose,
  majorTolerancePct = null
} = {}) {
  const local = finite(localResistance);
  const major = finite(majorZoneCenter);
  const close = finite(currentClose);
  const tolerance = finite(majorTolerancePct);
  if (!(local > 0 && major > 0 && close > 0)) {
    return {
      status:"BLOCKED",
      reason:"NESTED_RESISTANCE_INPUT_INCOMPLETE",
      localBreakout:null,
      majorZoneConflict:null,
      nestedConflictState:"UNKNOWN",
      zoneRelation:"UNKNOWN",
      availableAirPct:null,
      researchOnly:true,
      decisionImpact:false
    };
  }
  if (!(tolerance !== null && tolerance > 0 && tolerance < 1)) {
    return {
      status:"BLOCKED",
      reason:"MAJOR_ZONE_TOLERANCE_NOT_PREREGISTERED",
      localBreakout:close > local,
      majorZoneConflict:null,
      nestedConflictState:"UNKNOWN",
      zoneRelation:"UNKNOWN",
      availableAirPct:null,
      researchOnly:true,
      decisionImpact:false
    };
  }
  const lower = major * (1 - tolerance);
  const upper = major * (1 + tolerance);
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
    status:"VALID",
    localBreakout,
    majorZoneConflict,
    nestedConflictState,
    zoneRelation,
    availableAirPct,
    majorZone: { center: major, lower, upper, tolerancePct:tolerance },
    researchOnly:true,
    decisionImpact:false
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


export function analyzeMajorZoneLifecycle({
  bars,
  asOfDate,
  zoneLower,
  zoneUpper
} = {}) {
  const validated=barsAsOf(bars,asOfDate);
  if(!validated.usable) return {status:"BLOCKED",reason:validated.reason,lifecycle:"UNKNOWN"};
  const lower=finite(zoneLower),upper=finite(zoneUpper);
  if(!(lower!==null && upper!==null && upper>=lower && lower>0)) {
    return {status:"BLOCKED",reason:"MAJOR_ZONE_INVALID",lifecycle:"UNKNOWN"};
  }
  const series=validated.bars;
  const relationOf=(close)=>{
    const x=finite(close);
    if(x===null) return "UNKNOWN";
    if(x>upper) return "ABOVE_ZONE";
    if(x<lower) return "BELOW_ZONE";
    return "INSIDE_ZONE";
  };

  const firstBreakIndex=series.findIndex(x=>finite(x.close)!==null && Number(x.close)>upper);
  const current=series.at(-1);
  const currentRelation=relationOf(current?.close);

  if(firstBreakIndex<0){
    return {
      status:"VALID",
      lifecycle:currentRelation==="INSIDE_ZONE"?"APPROACH_MAJOR_ZONE":"BELOW_MAJOR_ZONE",
      currentRelation,
      firstBreakAt:null,
      lastBreakAt:null,
      breakCount:0,
      aboveZoneCloseStreak:0,
      reentryCount:0,
      reenteredZoneAt:null,
      failedBelowZoneAt:null,
      zone:{lower,upper},
      researchOnly:true,
      decisionImpact:false
    };
  }

  let breakCount=0;
  let lastBreakAt=null;
  let wasAbove=false;
  let reentryCount=0;
  let reenteredZoneAt=null;
  let failedBelowZoneAt=null;

  for(let i=firstBreakIndex;i<series.length;i+=1){
    const relation=relationOf(series[i].close);
    if(relation==="ABOVE_ZONE" && !wasAbove){
      breakCount+=1;
      lastBreakAt=series[i].date;
      wasAbove=true;
    } else if(relation!=="ABOVE_ZONE" && wasAbove){
      reentryCount+=1;
      if(reenteredZoneAt===null) reenteredZoneAt=series[i].date;
      if(relation==="BELOW_ZONE" && failedBelowZoneAt===null) failedBelowZoneAt=series[i].date;
      wasAbove=false;
    } else if(relation==="BELOW_ZONE" && failedBelowZoneAt===null && i>firstBreakIndex){
      failedBelowZoneAt=series[i].date;
    }
  }

  let aboveZoneCloseStreak=0;
  for(let i=series.length-1;i>=firstBreakIndex;i-=1){
    if(relationOf(series[i].close)!=="ABOVE_ZONE") break;
    aboveZoneCloseStreak+=1;
  }

  let lifecycle;
  if(currentRelation==="ABOVE_ZONE") {
    lifecycle=series.at(-1).date===series[firstBreakIndex].date && breakCount===1
      ? "FIRST_BREAK_ABOVE_MAJOR_ZONE"
      : "HOLDING_ABOVE_MAJOR_ZONE";
  } else if(currentRelation==="INSIDE_ZONE") {
    lifecycle="REENTERED_MAJOR_ZONE";
  } else {
    lifecycle="FAILED_MAJOR_ZONE_BREAK";
  }

  return {
    status:"VALID",
    lifecycle,
    currentRelation,
    firstBreakAt:series[firstBreakIndex].date,
    lastBreakAt,
    breakCount,
    aboveZoneCloseStreak,
    reentryCount,
    reenteredZoneAt,
    failedBelowZoneAt,
    zone:{lower,upper},
    researchOnly:true,
    decisionImpact:false
  };
}


function candleBodyBounds(bar){
  const open=finite(bar?.open),close=finite(bar?.close);
  if(open===null || close===null) return null;
  return {lower:Math.min(open,close),upper:Math.max(open,close),size:Math.abs(close-open)};
}

function candleShape(bar, atr=null){
  const open=finite(bar?.open),high=finite(bar?.high),low=finite(bar?.low),close=finite(bar?.close);
  if([open,high,low,close].some(x=>x===null)) return null;
  const body=Math.abs(close-open);
  const range=high-low;
  const upperWick=high-Math.max(open,close);
  const lowerWick=Math.min(open,close)-low;
  return {
    direction:close>open?"BULLISH":close<open?"BEARISH":"DOJI",
    body,
    range,
    bodyAtrRatio:atr!==null && atr>0 ? body/atr : null,
    rangeAtrRatio:atr!==null && atr>0 ? range/atr : null,
    upperWickRatio:range>0?upperWick/range:null,
    lowerWickRatio:range>0?lowerWick/range:null,
    closeLocation:range>0?(close-low)/range:null
  };
}

// Outcome-free two-day candlestick relational encoder.
// These labels are morphology descriptors only; they are not trading signals and are
// intentionally NOT claimed to reproduce any single historical paper's exact thresholds.
export function analyzeTwoDayCandlestickMorphology({
  bars,
  asOfDate,
  semanticSpace = "TECHNICAL_CONTINUITY",
  priorTrendState = "UNKNOWN",
  atrPeriod = 20,
  corporateActionBoundary = false
} = {}) {
  if(String(semanticSpace||"")!=="TECHNICAL_CONTINUITY"){
    return {
      status:"BLOCKED",
      reason:"TWO_DAY_CANDLE_REQUIRES_TECHNICAL_CONTINUITY",
      researchOnly:true,
      decisionImpact:false
    };
  }
  const filtered=(Array.isArray(bars)?bars:[]).filter(x=>String(x?.date||"")<=String(asOfDate||"9999-12-31"));
  const validated=validatePatternBars({bars:filtered,requireOpen:true});
  if(!validated.usable){
    return {
      status:"BLOCKED",
      reason:validated.reason,
      researchOnly:true,
      decisionImpact:false
    };
  }
  const series=validated.bars;
  if(series.length<2){
    return {
      status:"BLOCKED",
      reason:"TWO_DAY_CANDLE_INSUFFICIENT_BARS",
      researchOnly:true,
      decisionImpact:false
    };
  }
  const prev=series.at(-2),curr=series.at(-1);
  const prevBody=candleBodyBounds(prev),currBody=candleBodyBounds(curr);
  const currentIndex=series.length-1;
  const atr=simpleAtrBeforeIndex(series,currentIndex,atrPeriod);
  const prevShape=candleShape(prev,atr);
  const currShape=candleShape(curr,atr);

  const prevBearish=prev.close<prev.open;
  const currBullish=curr.close>curr.open;
  const prevBodySpan=prev.open-prev.close;
  const midpoint=(prev.open+prev.close)/2;

  const overlapLower=Math.max(prevBody.lower,currBody.lower);
  const overlapUpper=Math.min(prevBody.upper,currBody.upper);
  const overlap=Math.max(0,overlapUpper-overlapLower);
  const bodyOverlapOfPrev=prevBody.size>0?overlap/prevBody.size:null;
  const currentBodyToPrevBody=prevBody.size>0?currBody.size/prevBody.size:null;
  const currentEngulfsPrev=currBody.lower<=prevBody.lower && currBody.upper>=prevBody.upper;
  const currentInsidePrev=currBody.lower>=prevBody.lower && currBody.upper<=prevBody.upper;

  const penetration=prevBearish && prevBodySpan>0
    ? (curr.close-prev.close)/prevBodySpan
    : null;

  const bullishEngulfingBodyRelation=prevBearish && currBullish &&
    curr.open<=prev.close && curr.close>=prev.open;
  const bullishHaramiBodyRelation=prevBearish && currBullish &&
    curr.open>=prev.close && curr.close<=prev.open;
  const piercingBodyRelation=prevBearish && currBullish &&
    curr.open<=prev.close && curr.close>midpoint && curr.close<prev.open;

  const trend=String(priorTrendState||"UNKNOWN").toUpperCase();
  const reversalContextCompatible=["DOWNTREND","DECLINE","BEARISH","DAMAGED"].includes(trend)
    ? true
    : ["UPTREND","ADVANCE","BULLISH"].includes(trend)
      ? false
      : null;

  const labels=[];
  if(bullishEngulfingBodyRelation) labels.push("BULLISH_ENGULFING_BODY_RELATION");
  if(bullishHaramiBodyRelation) labels.push("BULLISH_HARAMI_BODY_RELATION");
  if(piercingBodyRelation) labels.push("PIERCING_BODY_RELATION");

  return {
    status:"VALID",
    semanticSpace:"TECHNICAL_CONTINUITY",
    previousDate:prev.date,
    currentDate:curr.date,
    corporateActionBoundary:Boolean(corporateActionBoundary),
    atr,
    atrPeriod:Math.max(1,Math.floor(Number(atrPeriod)||20)),
    previous:prevShape,
    current:currShape,
    prevBearish,
    currentBullish:currBullish,
    prevBodyMidpoint:midpoint,
    currentBodyToPrevBody,
    bodyOverlapOfPrev,
    currentEngulfsPrev,
    currentInsidePrev,
    openVsPrevClosePct:prev.close>0?curr.open/prev.close-1:null,
    closeVsPrevOpenPct:prev.open>0?curr.close/prev.open-1:null,
    overnightReturn:prev.close>0?curr.open/prev.close-1:null,
    intradayReturn:curr.open>0?curr.close/curr.open-1:null,
    totalReturn:prev.close>0?curr.close/prev.close-1:null,
    returnDecompositionIdentity:
      prev.close>0&&curr.open>0
        ?(1+(curr.open/prev.close-1))*(1+(curr.close/curr.open-1))-1
        :null,
    closePenetrationOfPrevBearBody:penetration,
    bullishEngulfingBodyRelation,
    bullishHaramiBodyRelation,
    piercingBodyRelation,
    namedMorphologyLabels:labels,
    labelCount:labels.length,
    labelAmbiguity:labels.length>1,
    priorTrendState:trend,
    reversalContextCompatible,
    definitionNote:"Morphology-only body relations; no profitability, score, threshold optimization, or exact-paper replication claim.",
    researchOnly:true,
    decisionImpact:false
  };
}


function simpleLinearFit(points = []) {
  const xs=(Array.isArray(points)?points:[])
    .map(p=>({x:Number(p?.x),y:Number(p?.y)}))
    .filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));
  if(xs.length<2) return null;
  const mx=xs.reduce((s,p)=>s+p.x,0)/xs.length;
  const my=xs.reduce((s,p)=>s+p.y,0)/xs.length;
  const denom=xs.reduce((s,p)=>s+(p.x-mx)*(p.x-mx),0);
  if(!(denom>0)) return null;
  const slope=xs.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0)/denom;
  const intercept=my-slope*mx;
  const residuals=xs.map(p=>p.y-(intercept+slope*p.x));
  const rmse=Math.sqrt(residuals.reduce((s,e)=>s+e*e,0)/xs.length);
  return {slope,intercept,rmse,n:xs.length,xMean:mx,yMean:my};
}

// Outcome-free latent boundary geometry for platforms / flags / triangles.
// It deliberately emits continuous geometry instead of assigning a textbook directional label.
export function analyzeConfirmedBoundaryGeometry({
  bars,
  swings,
  asOfDate,
  minConfirmedTouchesPerSide = 2
} = {}) {
  const validated=barsAsOf(bars,asOfDate);
  if(!validated.usable){
    return {status:"BLOCKED",reason:validated.reason,researchOnly:true,decisionImpact:false};
  }
  const series=validated.bars;
  const indexByDate=new Map(series.map((x,i)=>[x.date,i]));
  const eligible=(Array.isArray(swings)?swings:[])
    .filter(x=>String(x?.confirmedAt||"")<=String(asOfDate||"") && indexByDate.has(String(x?.pivotAt||"")))
    .map(x=>({
      type:String(x.type||""),
      pivotAt:String(x.pivotAt||""),
      confirmedAt:String(x.confirmedAt||""),
      pivotPrice:finite(x.pivotPrice),
      pivotIndex:indexByDate.get(String(x.pivotAt||""))
    }))
    .filter(x=>["HIGH","LOW"].includes(x.type)&&x.pivotPrice!==null&&Number.isInteger(x.pivotIndex));

  const highs=eligible.filter(x=>x.type==="HIGH");
  const lows=eligible.filter(x=>x.type==="LOW");
  const minTouches=Math.max(2,Math.floor(Number(minConfirmedTouchesPerSide)||2));
  if(highs.length<minTouches || lows.length<minTouches){
    return {
      status:"VALID",
      readiness:"INSUFFICIENT_CONFIRMED_TOUCHES",
      upperTouchCount:highs.length,
      lowerTouchCount:lows.length,
      researchOnly:true,
      decisionImpact:false
    };
  }

  const upperFit=simpleLinearFit(highs.map(x=>({x:x.pivotIndex,y:x.pivotPrice})));
  const lowerFit=simpleLinearFit(lows.map(x=>({x:x.pivotIndex,y:x.pivotPrice})));
  if(!upperFit || !lowerFit){
    return {status:"BLOCKED",reason:"BOUNDARY_FIT_UNAVAILABLE",researchOnly:true,decisionImpact:false};
  }

  const firstIndex=Math.min(...eligible.map(x=>x.pivotIndex));
  const lastIndex=Math.max(...eligible.map(x=>x.pivotIndex));
  const upperAt=x=>upperFit.intercept+upperFit.slope*x;
  const lowerAt=x=>lowerFit.intercept+lowerFit.slope*x;
  const startUpper=upperAt(firstIndex),startLower=lowerAt(firstIndex);
  const endUpper=upperAt(lastIndex),endLower=lowerAt(lastIndex);
  const startWidth=startUpper-startLower;
  const endWidth=endUpper-endLower;
  const center=Math.abs((startUpper+startLower+endUpper+endLower)/4);
  const upperSlopeNorm=center>0?upperFit.slope/center:null;
  const lowerSlopeNorm=center>0?lowerFit.slope/center:null;
  const upperRmseNorm=center>0?upperFit.rmse/center:null;
  const lowerRmseNorm=center>0?lowerFit.rmse/center:null;
  const compressionRatio=startWidth>0?endWidth/startWidth:null;
  const slopeDifference=upperFit.slope-lowerFit.slope;
  let projectedApexIndex=null;
  if(Math.abs(slopeDifference)>1e-12){
    const x=(lowerFit.intercept-upperFit.intercept)/slopeDifference;
    if(Number.isFinite(x)) projectedApexIndex=x;
  }
  const projectedApexDistanceBars=projectedApexIndex===null?null:projectedApexIndex-lastIndex;
  const converging=Number.isFinite(compressionRatio) && compressionRatio<1 && endWidth>0;
  const boundarySlopeDifferenceNorm=center>0?slopeDifference/center:null;

  return {
    status:"VALID",
    readiness:"GEOMETRY_READY",
    upperTouchCount:highs.length,
    lowerTouchCount:lows.length,
    firstAnchorAt:series[firstIndex]?.date||null,
    lastAnchorAt:series[lastIndex]?.date||null,
    upperSlope:upperFit.slope,
    lowerSlope:lowerFit.slope,
    upperSlopeNorm,
    lowerSlopeNorm,
    upperFitRmse:upperFit.rmse,
    lowerFitRmse:lowerFit.rmse,
    upperFitRmseNorm:upperRmseNorm,
    lowerFitRmseNorm:lowerRmseNorm,
    startWidth,
    endWidth,
    compressionRatio,
    projectedApexIndex,
    projectedApexDistanceBars,
    converging,
    boundarySlopeDifferenceNorm,
    orientation:
      upperFit.slope<0 && lowerFit.slope>0 ? "CONVERGING_INWARD" :
      upperFit.slope<0 && lowerFit.slope<0 ? "BOTH_DOWN" :
      upperFit.slope>0 && lowerFit.slope>0 ? "BOTH_UP" :
      Math.abs(upperFit.slope)<1e-12 && Math.abs(lowerFit.slope)<1e-12 ? "FLAT" :
      "MIXED_OR_FLAT",
    confirmedAnchorIds:eligible.map(x=>x.type+":"+x.pivotAt+"@"+x.confirmedAt),
    definitionNote:"Continuous confirmed-boundary geometry only; orientation is descriptive and carries no bullish/bearish score.",
    researchOnly:true,
    decisionImpact:false
  };
}

// Anchor-based cup/bowl geometry. It measures a confirmed H-L-H structure but does not
// declare it bullish, mature or tradable. The caller supplies confirmed anchors explicitly.
export function analyzeCupGeometryFromAnchors({
  bars,
  asOfDate,
  leftRim,
  bottom,
  rightRim,
  bottomBandFraction = 0.20
} = {}) {
  const validated=barsAsOf(bars,asOfDate);
  if(!validated.usable){
    return {status:"BLOCKED",reason:validated.reason,researchOnly:true,decisionImpact:false};
  }
  const series=validated.bars;
  const indexByDate=new Map(series.map((x,i)=>[x.date,i]));
  const normalizeAnchor=(a,type)=>{
    const pivotAt=String(a?.pivotAt||"");
    const confirmedAt=String(a?.confirmedAt||"");
    const price=finite(a?.pivotPrice);
    const index=indexByDate.get(pivotAt);
    if(!pivotAt || !confirmedAt || confirmedAt>String(asOfDate||"") || price===null || !Number.isInteger(index)){
      return null;
    }
    return {type,pivotAt,confirmedAt,pivotPrice:price,pivotIndex:index};
  };
  const l=normalizeAnchor(leftRim,"HIGH");
  const b=normalizeAnchor(bottom,"LOW");
  const rr=normalizeAnchor(rightRim,"HIGH");
  if(!l||!b||!rr) return {status:"BLOCKED",reason:"CUP_ANCHOR_UNCONFIRMED_OR_MISSING",researchOnly:true,decisionImpact:false};
  if(!(l.pivotIndex<b.pivotIndex && b.pivotIndex<rr.pivotIndex)){
    return {status:"BLOCKED",reason:"CUP_ANCHOR_ORDER_INVALID",researchOnly:true,decisionImpact:false};
  }
  const rimMean=(l.pivotPrice+rr.pivotPrice)/2;
  if(!(rimMean>b.pivotPrice && rimMean>0)){
    return {status:"BLOCKED",reason:"CUP_GEOMETRY_INVALID",researchOnly:true,decisionImpact:false};
  }
  const depth=(rimMean-b.pivotPrice)/rimMean;
  const rimDifference=Math.abs(rr.pivotPrice-l.pivotPrice)/rimMean;
  const leftBars=b.pivotIndex-l.pivotIndex;
  const rightBars=rr.pivotIndex-b.pivotIndex;
  const duration=rr.pivotIndex-l.pivotIndex;
  const timeSymmetryRatio=Math.min(leftBars,rightBars)/Math.max(leftBars,rightBars);
  const rightRecovery=(rr.pivotPrice-b.pivotPrice)/(l.pivotPrice-b.pivotPrice);
  const segment=series.slice(l.pivotIndex,rr.pivotIndex+1);
  const bandFrac=Math.min(0.49,Math.max(0.01,Number(bottomBandFraction)||0.20));
  const bottomBandTop=b.pivotPrice+(rimMean-b.pivotPrice)*bandFrac;
  const bottomResidenceBars=segment.filter(x=>Number(x.close)<=bottomBandTop).length;
  const bottomResidenceRatio=segment.length?bottomResidenceBars/segment.length:null;

  // Descriptive normalized parabola residual. No assumption that smaller is always better.
  const normalized=segment.map((x,i)=>{
    const t=duration>0?(i/duration)*2-1:0;
    const p=(Number(x.close)-b.pivotPrice)/(rimMean-b.pivotPrice);
    return {t,p};
  });
  const residuals=normalized.map(x=>x.p-(x.t*x.t));
  const curvatureResidualRmse=residuals.length
    ?Math.sqrt(residuals.reduce((s,e)=>s+e*e,0)/residuals.length)
    :null;

  return {
    status:"VALID",
    topology:"CONFIRMED_H_L_H_BOWL_CANDIDATE",
    leftRimAt:l.pivotAt,
    bottomAt:b.pivotAt,
    rightRimAt:rr.pivotAt,
    leftRimPrice:l.pivotPrice,
    bottomPrice:b.pivotPrice,
    rightRimPrice:rr.pivotPrice,
    cupDurationBars:duration,
    cupDepthPct:depth,
    rimDifferencePct:rimDifference,
    leftDeclineBars:leftBars,
    rightRecoveryBars:rightBars,
    timeSymmetryRatio,
    rightSideRecoveryRatio:rightRecovery,
    bottomBandFraction:bandFrac,
    bottomResidenceBars,
    bottomResidenceRatio,
    curvatureResidualRmse,
    anchorIds:[l,b,rr].map(x=>x.type+":"+x.pivotAt+"@"+x.confirmedAt),
    definitionNote:"Anchor-based continuous bowl geometry only; no bullish sign, maturity threshold, or outcome-tuned roundness cutoff.",
    researchOnly:true,
    decisionImpact:false
  };
}


// Explicit-anchor impulse + consolidation geometry for flag/pennant research.
// It does not decide whether the impulse is "strong enough" or the retracement "too deep".
export function analyzeImpulseConsolidationGeometry({
  bars,
  asOfDate,
  poleStartAt,
  poleEndAt,
  consolidationEndAt = null
} = {}) {
  const validated=barsAsOf(bars,asOfDate);
  if(!validated.usable){
    return {status:"BLOCKED",reason:validated.reason,researchOnly:true,decisionImpact:false};
  }
  const series=validated.bars;
  const indexByDate=new Map(series.map((x,i)=>[x.date,i]));
  const start=indexByDate.get(String(poleStartAt||""));
  const poleEnd=indexByDate.get(String(poleEndAt||""));
  const consEnd=consolidationEndAt
    ?indexByDate.get(String(consolidationEndAt))
    :series.length-1;
  if(!Number.isInteger(start)||!Number.isInteger(poleEnd)||!Number.isInteger(consEnd)){
    return {status:"BLOCKED",reason:"IMPULSE_ANCHOR_MISSING",researchOnly:true,decisionImpact:false};
  }
  if(!(start<poleEnd && poleEnd<consEnd)){
    return {status:"BLOCKED",reason:"IMPULSE_ANCHOR_ORDER_INVALID",researchOnly:true,decisionImpact:false};
  }
  const pole=series.slice(start,poleEnd+1);
  const cons=series.slice(poleEnd,consEnd+1);
  const poleStart=Number(pole[0].close),poleFinish=Number(pole.at(-1).close);
  if(!(poleStart>0&&poleFinish>0)){
    return {status:"BLOCKED",reason:"IMPULSE_PRICE_INVALID",researchOnly:true,decisionImpact:false};
  }
  const poleReturnPct=poleFinish/poleStart-1;
  let pathLength=0;
  for(let i=1;i<pole.length;i+=1) pathLength+=Math.abs(Number(pole[i].close)-Number(pole[i-1].close));
  const netMove=Math.abs(poleFinish-poleStart);
  const polePathEfficiency=pathLength>0?netMove/pathLength:null;

  const consHigh=Math.max(...cons.map(x=>Number(x.high)));
  const consLow=Math.min(...cons.map(x=>Number(x.low)));
  const consRange=consHigh-consLow;
  const poleHigh=Math.max(...pole.map(x=>Number(x.high)));
  const poleLow=Math.min(...pole.map(x=>Number(x.low)));
  const poleRange=poleHigh-poleLow;
  const consolidationDepthFromPoleEnd=poleFinish>0?(poleFinish-consLow)/poleFinish:null;
  const consolidationRangeVsPoleRange=poleRange>0?consRange/poleRange:null;

  const poleVol=medianFinite(pole.map(x=>finite(x.volume)));
  const consVol=medianFinite(cons.map(x=>finite(x.volume)));
  const consolidationVolumeVsPole=poleVol!==null&&poleVol>0&&consVol!==null?consVol/poleVol:null;
  const poleTr=medianFinite(pole.map((_,j)=>barTrueRange(series,start+j)).filter(Number.isFinite));
  const consTr=medianFinite(cons.map((_,j)=>barTrueRange(series,poleEnd+j)).filter(Number.isFinite));
  const consolidationTrueRangeVsPole=poleTr!==null&&poleTr>0&&consTr!==null?consTr/poleTr:null;

  const closeNow=Number(cons.at(-1).close);
  const consolidationCloseRetracementOfPole=
    Math.abs(poleFinish-poleStart)>0
      ?(poleFinish-closeNow)/(poleFinish-poleStart)
      :null;

  return {
    status:"VALID",
    poleStartAt:series[start].date,
    poleEndAt:series[poleEnd].date,
    consolidationEndAt:series[consEnd].date,
    poleDurationBars:poleEnd-start,
    consolidationDurationBars:consEnd-poleEnd,
    poleReturnPct,
    polePathEfficiency,
    poleRange,
    consolidationRange:consRange,
    consolidationDepthFromPoleEnd,
    consolidationRangeVsPoleRange,
    consolidationCloseRetracementOfPole,
    consolidationVolumeVsPole,
    consolidationTrueRangeVsPole,
    definitionNote:"Continuous impulse/consolidation geometry only; no flag label, bullish sign, maturity cutoff or outcome-tuned threshold.",
    researchOnly:true,
    decisionImpact:false
  };
}


// Continuous repeated-resistance progression. Touch count is deliberately unsigned.
// The older binary C8 classifier remains for the frozen oracle; this function exposes
// the underlying progression dimensions for later redundancy/falsification work.
export function analyzeResistanceTestProgression(attempts = []) {
  const rows=(Array.isArray(attempts)?attempts:[])
    .map((x,i)=>({
      index:i,
      at:String(x?.at||x?.date||i),
      low:finite(x?.low),
      close:finite(x?.close),
      resistance:finite(x?.resistance),
      volume:finite(x?.volume),
      turnover:finite(x?.turnover)
    }));
  if(rows.length<2 || rows.some(x=>x.low===null||x.close===null||!(x.resistance>0))){
    return {status:"BLOCKED",reason:"RESISTANCE_TEST_INPUT_INCOMPLETE",researchOnly:true,decisionImpact:false};
  }

  const normalized=rows.map(x=>({
    ...x,
    lowDistancePct:(x.resistance-x.low)/x.resistance,
    closeDistancePct:(x.resistance-x.close)/x.resistance
  }));
  const fitLow=simpleLinearFit(normalized.map(x=>({x:x.index,y:x.lowDistancePct})));
  const fitClose=simpleLinearFit(normalized.map(x=>({x:x.index,y:x.closeDistancePct})));
  const rejectionAbs=normalized.map(x=>Math.abs(x.closeDistancePct));
  const firstRejection=rejectionAbs[0],lastRejection=rejectionAbs.at(-1);
  const rejectionCompressionRatio=firstRejection>0?lastRejection/firstRejection:null;

  let improvingLowPairs=0,improvingClosePairs=0;
  for(let i=1;i<normalized.length;i+=1){
    if(normalized[i].lowDistancePct<normalized[i-1].lowDistancePct) improvingLowPairs+=1;
    if(normalized[i].closeDistancePct<normalized[i-1].closeDistancePct) improvingClosePairs+=1;
  }
  const pairCount=normalized.length-1;
  const volumeFit=simpleLinearFit(
    normalized.filter(x=>x.volume!==null&&x.volume>=0).map(x=>({x:x.index,y:x.volume}))
  );
  const turnoverFit=simpleLinearFit(
    normalized.filter(x=>x.turnover!==null&&x.turnover>=0).map(x=>({x:x.index,y:x.turnover}))
  );

  return {
    status:"VALID",
    touchCount:normalized.length,
    lowDistanceSlopePerTest:fitLow?.slope??null,
    closeDistanceSlopePerTest:fitClose?.slope??null,
    lowDistanceRmse:fitLow?.rmse??null,
    closeDistanceRmse:fitClose?.rmse??null,
    improvingLowPairRatio:pairCount?improvingLowPairs/pairCount:null,
    improvingClosePairRatio:pairCount?improvingClosePairs/pairCount:null,
    firstCloseDistancePct:normalized[0].closeDistancePct,
    lastCloseDistancePct:normalized.at(-1).closeDistancePct,
    rejectionCompressionRatio,
    volumeSlopePerTest:volumeFit?.slope??null,
    turnoverSlopePerTest:turnoverFit?.slope??null,
    attempts:normalized,
    definitionNote:"Continuous approach/rejection progression only; lower distance slopes can describe absorption but carry no ex-ante bullish sign.",
    researchOnly:true,
    decisionImpact:false
  };
}


function isLegalTaiwanStockQuote(price) {
  const p=finite(price);
  if(!(p>0)) return false;
  const tick=researchTickSize(p);
  if(!(tick>0)) return false;
  return Math.abs(p/tick-Math.round(p/tick)) <= 1e-8;
}

function nearestLegalRoundAnchor(price, stepNtd) {
  const p=finite(price);
  const step=finite(stepNtd);
  if(!(p>0&&step>0)) return null;
  const base=Math.round(p/step);
  let best=null;
  // Search is deterministic and only enforces the current legal tick grid.
  // It does not choose an anchor family from outcomes.
  for(let offset=-64;offset<=64;offset+=1){
    const k=base+offset;
    if(k<=0) continue;
    const anchor=roundToPrecision(k*step);
    if(!isLegalTaiwanStockQuote(anchor)) continue;
    const distance=Math.abs(anchor-p);
    if(!best || distance<best.distance-1e-12 ||
       (Math.abs(distance-best.distance)<=1e-12 && anchor<best.anchor)){
      best={anchor,distance};
    }
  }
  return best;
}

// Literature-grounded Taiwan round-price proximity control.
// Pre-registered families: whole NT$, even NT$, 5 NT$, 10 NT$.
// Output is continuous distance only; no "near round price" cutoff or directional sign.
export function analyzeTaiwanRoundPriceProximity({
  structuralLevelPrice,
  currentClose = null
} = {}) {
  const level=finite(structuralLevelPrice);
  if(!(level>0)){
    return {
      status:"BLOCKED",
      reason:"ROUND_PRICE_STRUCTURAL_LEVEL_INVALID",
      researchOnly:true,
      decisionImpact:false
    };
  }
  const levelTick=researchTickSize(level);
  if(!(levelTick>0)){
    return {
      status:"BLOCKED",
      reason:"ROUND_PRICE_TICK_UNKNOWN",
      researchOnly:true,
      decisionImpact:false
    };
  }
  const families=[
    ["wholeNtd",1],
    ["evenNtd",2],
    ["fiveNtd",5],
    ["tenNtd",10]
  ];
  const proximity={};
  for(const [name,step] of families){
    const nearest=nearestLegalRoundAnchor(level,step);
    if(!nearest){
      proximity[name]={
        anchorStepNtd:step,
        nearestAnchor:null,
        distanceAbs:null,
        distancePct:null,
        distanceTicks:null,
        mechanicallyCoarseGrid:null
      };
      continue;
    }
    proximity[name]={
      anchorStepNtd:step,
      nearestAnchor:nearest.anchor,
      distanceAbs:nearest.distance,
      distancePct:nearest.distance/level,
      distanceTicks:nearest.distance/levelTick,
      mechanicallyCoarseGrid:
        levelTick>=step && Math.abs(levelTick/step-Math.round(levelTick/step))<=1e-8
    };
  }
  const close=finite(currentClose);
  return {
    status:"VALID",
    structuralLevelPrice:level,
    currentClose:close,
    structuralLevelTick:levelTick,
    currentCloseDistancePct:close!==null&&close>0?Math.abs(close-level)/level:null,
    proximity,
    primaryMetric:"DISTANCE_IN_LEGAL_TAIWAN_STOCK_TICKS",
    directionalSign:"UNKNOWN",
    controlRole:"CONFOUND_CONTROL_ONLY",
    definitionNote:"No proximity cutoff, weight, winner grid or return sign is encoded. Anchor family comparisons are separate registered variants.",
    researchOnly:true,
    decisionImpact:false
  };
}
