export function barSpanAmbiguity(low, high, lower, upper) {
  if (![low, high, lower, upper].every(Number.isFinite) || upper < lower) {
    return { status: "UNKNOWN" };
  }
  const spans = low < lower && high > upper;
  return {
    status: "VALID",
    spansEntireZone: spans,
    exactCrossingCount: null,
    firstEdgeTouched: null,
    exactOrderKnown: false
  };
}

export function zonePathLineage(hasExactEventSequence = false) {
  const roots = ["PRICE_OHLC"];
  if (hasExactEventSequence) roots.push("EVENT_TIME");
  return {
    informationRoots: roots,
    d03PathEfficiencyOwnerPreserved: true,
    effectiveIndependentEvidenceCount: 1,
    independentVoteAllowed: false,
    residualIncrementalityStatus: "NOT_VALIDATED",
    entropyFactorDefined: false
  };
}
