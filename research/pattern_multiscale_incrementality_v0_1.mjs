// D01 Pattern multi-scale incrementality firewall v0.1
// Class A research-only. Outcome-blind. No runtime / Formal dependency.

const CROSS_SCALE_RELATIONS = new Set([
  "CONTAINS",
  "REFINES",
  "CONTRADICTS",
  "DISTANCE_TO_PARENT_BOUNDARY",
  "SHARES_TRIGGER",
  "SHARES_ANCHORS"
]);

function finiteNumber(x) {
  return typeof x === "number" && Number.isFinite(x);
}

function isoLeq(a, b) {
  return typeof a === "string" && typeof b === "string" && a <= b;
}

function sortedUnique(xs = []) {
  return [...new Set(xs)].sort();
}

function jaccard(a = [], b = []) {
  const A = new Set(a), B = new Set(b);
  if (!A.size || !B.size) return null;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = new Set([...A, ...B]).size;
  return union ? inter / union : null;
}

export function aggregateOHLC(bars) {
  if (!Array.isArray(bars) || bars.length === 0) {
    return { status: "UNKNOWN", reason: "NO_BARS" };
  }

  const sorted = [...bars].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const semanticSpaces = sortedUnique(sorted.map(x => x.semanticSpaceId).filter(Boolean));
  if (semanticSpaces.length !== 1) {
    return { status: "DATA_BLOCKED", reason: "SEMANTIC_SPACE_MIXED" };
  }

  for (const b of sorted) {
    if (!b.date || !finiteNumber(b.open) || !finiteNumber(b.high) || !finiteNumber(b.low) || !finiteNumber(b.close)) {
      return { status: "UNKNOWN", reason: "BAR_FIELD_MISSING" };
    }
    if (b.symbolSessionVerified !== true || b.technicalContinuityVerified !== true) {
      return { status: "DATA_BLOCKED", reason: "SESSION_OR_CONTINUITY_UNVERIFIED", blockedAt: b.date };
    }
  }

  return {
    status: "VALID",
    semanticSpaceId: semanticSpaces[0],
    open: sorted[0].open,
    high: Math.max(...sorted.map(x => x.high)),
    low: Math.min(...sorted.map(x => x.low)),
    close: sorted[sorted.length - 1].close,
    sourceBarIds: sorted.map(x => x.id ?? x.date),
    firstDate: sorted[0].date,
    lastDate: sorted[sorted.length - 1].date,
    deterministicFromConstituentBars: true
  };
}

export function sameAggregateDifferentPath(pathA, pathB) {
  const a = aggregateOHLC(pathA), b = aggregateOHLC(pathB);
  if (a.status !== "VALID" || b.status !== "VALID") {
    return { status: "UNKNOWN", reason: "AGGREGATE_NOT_VALID", a, b };
  }
  const sameAggregate =
    a.open === b.open &&
    a.high === b.high &&
    a.low === b.low &&
    a.close === b.close &&
    a.semanticSpaceId === b.semanticSpaceId;

  const signature = xs => [...xs]
    .sort((x, y) => String(x.date).localeCompare(String(y.date)))
    .map(x => [x.open, x.high, x.low, x.close]);

  return {
    status: "VALID",
    sameAggregate,
    sameOrderedPath: JSON.stringify(signature(pathA)) === JSON.stringify(signature(pathB)),
    provesManyToOneAggregationWhenTrue: sameAggregate && JSON.stringify(signature(pathA)) !== JSON.stringify(signature(pathB))
  };
}

export function classifyCrossScaleEvidence(input) {
  const {
    asOf,
    higher,
    lower,
    relationType = "UNKNOWN",
    higherDerivedFromLower = false,
    equalClockHorizon = false,
    sharedEventIds = [],
    requireCompletedHigher = true,
    contractVersion = "pattern-multiscale-v0.1"
  } = input || {};

  const missing = [];
  for (const [side, obj] of [["higher", higher], ["lower", lower]]) {
    if (!obj) {
      missing.push(side);
      continue;
    }
    for (const key of ["timeframe", "confirmedAt", "sourceFamily", "semanticSpaceId"]) {
      if (obj[key] === undefined || obj[key] === null || obj[key] === "") missing.push(`${side}.${key}`);
    }
  }
  if (!asOf) missing.push("asOf");
  if (missing.length) {
    return {
      status: "UNKNOWN",
      reason: "PROVENANCE_INCOMPLETE",
      missing,
      independentVoteEligible: false,
      predictiveIncrementality: "UNKNOWN"
    };
  }

  if (!isoLeq(higher.confirmedAt, asOf) || !isoLeq(lower.confirmedAt, asOf)) {
    return {
      status: "DATA_BLOCKED",
      reason: "FUTURE_CONFIRMATION",
      independentVoteEligible: false,
      predictiveIncrementality: "UNKNOWN"
    };
  }

  if (requireCompletedHigher && higher.barCompletionState === "PARTIAL_ASOF_HIGHER_TIMEFRAME_BAR") {
    return {
      status: "DATA_BLOCKED",
      reason: "PARTIAL_HIGHER_TIMEFRAME",
      independentVoteEligible: false,
      predictiveIncrementality: "UNKNOWN"
    };
  }

  if (higher.semanticSpaceId !== lower.semanticSpaceId) {
    return {
      status: "DATA_BLOCKED",
      reason: "SEMANTIC_SPACE_CONFLICT",
      independentVoteEligible: false,
      predictiveIncrementality: "UNKNOWN"
    };
  }

  const sameRoot = higher.sourceFamily === lower.sourceFamily;
  const overlap = jaccard(higher.sourceBarIds || [], lower.sourceBarIds || []);
  const sameEvent = Array.isArray(sharedEventIds) && sharedEventIds.length > 0;

  let rawInformationClass;
  if (sameRoot && higherDerivedFromLower) {
    rawInformationClass = "DETERMINISTIC_AGGREGATION_NO_NEW_RAW_INFO";
  } else if (sameRoot && overlap !== null && overlap > 0) {
    rawInformationClass = "SHARED_ROOT_OVERLAPPING_OBSERVATIONS";
  } else if (sameRoot) {
    rawInformationClass = "SAME_ROOT_DISTINCT_HORIZON_HISTORY";
  } else {
    rawInformationClass = "DISTINCT_SOURCE_FAMILY_OUTSIDE_PATTERN_ROOT";
  }

  let overlapClass = "UNKNOWN";
  if (sameEvent) overlapClass = "SAME_EVENT_DUPLICATE";
  else if (equalClockHorizon) overlapClass = "NESTED_HORIZON";
  else if (sameRoot && overlap !== null && overlap > 0) overlapClass = "SHARED_COMPONENT";
  else if (CROSS_SCALE_RELATIONS.has(relationType)) overlapClass = "DISTINCT_HORIZON_CONTEXT";

  let representationClass = "UNKNOWN";
  if (overlapClass === "SAME_EVENT_DUPLICATE" || overlapClass === "NESTED_HORIZON") {
    representationClass = "REENCODING_OR_OVERLAPPING_REPRESENTATION";
  } else if (CROSS_SCALE_RELATIONS.has(relationType) && sameRoot) {
    representationClass = "CROSS_SCALE_RELATION_REPRESENTATION_CANDIDATE";
  } else if (sameRoot) {
    representationClass = "HIERARCHICAL_CONTEXT_REPRESENTATION_CANDIDATE";
  } else {
    representationClass = "CROSS_LANE_REPRESENTATION_REQUIRES_SEPARATE_GOVERNANCE";
  }

  const timeframes = sortedUnique([higher.timeframe, lower.timeframe]);
  const multipleTestingFamilyKey = [
    contractVersion,
    timeframes.join("+"),
    relationType,
    higher.featureFamily || "UNKNOWN_HIGHER_FAMILY",
    lower.featureFamily || "UNKNOWN_LOWER_FAMILY"
  ].join("::");

  return {
    status: "VALID",
    sameRoot,
    observationOverlapJaccard: overlap,
    rawInformationClass,
    representationClass,
    overlapClass,
    independentVoteEligible: false,
    scaleAgreementVoteCount: null,
    predictiveIncrementality: "UNKNOWN_REQUIRES_PREREGISTERED_OUTCOME_TEST",
    effectiveSamplePolicy: "SCAN_DATE_AND_EPISODE_CLUSTER_NOT_SCALE_COUNT",
    multipleTestingFamilyKey,
    requiredControls: [
      "priorHigh60_or_majorStructuralHigh",
      "MA60_120_where_available",
      "ret20_60_or_equivalent_long_horizon_return",
      "ATR_or_realized_volatility",
      "close_location",
      "Pattern_major_zone_state",
      "PriceVolume_acceptance_where_applicable",
      "sector_and_market_regime",
      "liquidity",
      "current_daily_setup_quality"
    ],
    formalCoreImpact: "NONE"
  };
}

export function dedupCrossScaleEpisodes(records = []) {
  const keys = new Set();
  for (const r of records) {
    const key = [
      r.symbol ?? "UNKNOWN_SYMBOL",
      r.parentEpisodeId ?? "UNKNOWN_PARENT",
      r.childEpisodeId ?? "UNKNOWN_CHILD",
      r.relationType ?? "UNKNOWN_RELATION"
    ].join("::");
    keys.add(key);
  }
  return {
    snapshotCount: records.length,
    independentEpisodeCount: keys.size,
    scaleOrSnapshotCountDoesNotIncreaseN: true
  };
}
