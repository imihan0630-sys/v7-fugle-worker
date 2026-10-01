export function classifyCrossScaleEvidence(x) {
  if (!x || x.semanticSpaceMismatch || x.partialHigherScaleBar && x.confirmedAtAvailable === false) {
    return { classification: "UNKNOWN", action: "DATA_BLOCKED", independentVoteIncrement: 0 };
  }
  if (x.separatePITProvenanceLane === true && x.sameRootPricePath === false) {
    return { classification: "INDEPENDENT_PROVENANCE", action: "CROSS_LANE_DEPENDENCY", independentVoteIncrement: null };
  }
  if (x.higherScaleAddsStableHierarchyState === true && x.higherScaleStateRecoverableFromLowerScalePrefix !== true) {
    return { classification: "TOPOLOGY_REVEAL", action: "PRESERVE_STATE_DESCRIPTOR", independentVoteIncrement: 0 };
  }
  if (x.sameRootPricePath === true && (x.higherScaleStateRecoverableFromLowerScalePrefix === true || x.sharedPivotSet === true && x.sharedBoundaryLifecycle === true || x.labelChangedOnly === true)) {
    return { classification: "DETERMINISTIC_RESTATEMENT", action: "DEDUP_EVIDENCE_FAMILY", independentVoteIncrement: 0 };
  }
  return { classification: "UNKNOWN", action: "DATA_BLOCKED", independentVoteIncrement: 0 };
}

export function assertPrefixAppendOnly({ priorChild, laterChild, futureParentConfirmedAt, asOf }) {
  const immutable = ["pivotAt", "confirmedAt", "semanticSpaceId"];
  const changed = immutable.some(k => priorChild?.[k] !== laterChild?.[k]);
  if (changed) return { ok: false, reason: "HISTORICAL_CHILD_REWRITE" };
  if (futureParentConfirmedAt && asOf && futureParentConfirmedAt > asOf) {
    return { ok: true, parentVisible: false, action: "APPEND_ANCESTRY_ONLY" };
  }
  return { ok: true, parentVisible: true, action: "APPEND_ANCESTRY_ONLY" };
}
