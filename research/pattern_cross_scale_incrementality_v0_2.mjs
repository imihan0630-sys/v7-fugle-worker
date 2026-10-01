export function classifyCrossScaleEvidence(x) {
  if (!x || x.semanticSpaceMismatch || (x.partialHigherScaleBar && x.confirmedAtAvailable === false)) return { classification: "UNKNOWN", action: "DATA_BLOCKED", independentVoteIncrement: 0 };
  if (x.separatePITProvenanceLane === true && x.sameRootPricePath === false) return { classification: "INDEPENDENT_PROVENANCE", action: "CROSS_LANE_DEPENDENCY", independentVoteIncrement: null };
  if (x.sameRootPricePath === true && (x.higherScaleStateRecoverableFromLowerScalePrefix === true || (x.sharedPivotSet === true && x.sharedBoundaryLifecycle === true) || x.labelChangedOnly === true)) return { classification: "DETERMINISTIC_RESTATEMENT", action: "DEDUP_EVIDENCE_FAMILY", independentVoteIncrement: 0 };
  if (x.higherScaleAddsStableHierarchyState === true && x.higherScaleStateRecoverableFromLowerScalePrefix === false) return { classification: "TOPOLOGY_REVEAL", action: "PRESERVE_STATE_DESCRIPTOR", independentVoteIncrement: 0 };
  return { classification: "UNKNOWN", action: "DATA_BLOCKED", independentVoteIncrement: 0 };
}
