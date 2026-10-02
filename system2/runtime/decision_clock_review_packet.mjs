import { deepFreeze } from "./factor_snapshot.mjs";

export function buildDecisionClockReviewPacket(aggregation) {
  if (!aggregation || aggregation.aggregationVersion !== "S2_DECISION_CLOCK_EVIDENCE_AGGREGATION_V0_1") {
    throw new Error("V0.1 decision-clock aggregation is required");
  }
  const readiness = aggregation.readiness;
  if (!readiness || readiness.assessmentVersion !== "S2_DECISION_CLOCK_READINESS_V0_2") {
    throw new Error("V0.2 decision-clock readiness is required");
  }

  let reviewState = "ACCUMULATING";
  const blockers = [];

  if (aggregation.artifactCoverageAudited !== true) {
    blockers.push("ARTIFACT_COVERAGE_UNAUDITED");
  }
  if (aggregation.promotionCoverageComplete !== true) {
    blockers.push("PROMOTION_COVERAGE_INCOMPLETE");
  }
  if ((aggregation.tradingDayArtifactGaps || []).length > 0) {
    blockers.push("TRADING_DAY_ARTIFACT_GAPS");
  }
  if ((aggregation.coverageArtifactCandidateMismatches || []).length > 0) {
    blockers.push("COVERAGE_ARTIFACT_PROVENANCE_MISMATCH");
  }
  if (aggregation.collectorContractConsistent !== true) {
    blockers.push("COLLECTOR_CONTRACT_DRIFT");
  }
  if ((aggregation.a5BoundaryFailureDates || []).length > 0) {
    blockers.push("A5_NOT_AVAILABLE_BY_CANDIDATE");
  }
  if (readiness.status !== "FREEZE_ELIGIBLE") {
    blockers.push("READINESS_NOT_FREEZE_ELIGIBLE");
  }
  if (readiness.independentTradingDates < readiness.freezeIndependentDates) {
    blockers.push("INSUFFICIENT_INDEPENDENT_DATES");
  }
  if (readiness.allPrecise !== true) {
    blockers.push("REQUIRED_INTERVALS_NOT_ALL_PRECISE");
  }

  if (blockers.length === 0) {
    reviewState = "OWNER_REVIEW_ELIGIBLE";
  } else if (
    aggregation.artifactCoverageAudited === true
    && aggregation.promotionCoverageComplete === false
  ) {
    reviewState = "BLOCKED";
  }

  return deepFreeze({
    packetVersion: "S2_DECISION_CLOCK_OWNER_REVIEW_PACKET_V0_1",
    reviewState,
    artifactSelectionPolicy: aggregation.promotionPolicy,
    attemptOneProvenanceVersion: aggregation.attemptOneProvenanceVersion || null,
    promotionQualificationVersion: aggregation.promotionQualificationVersion || null,
    artifactCoverageAudited: aggregation.artifactCoverageAudited,
    promotionCoverageComplete: aggregation.promotionCoverageComplete,
    tradingDayArtifactGapCount: (aggregation.tradingDayArtifactGaps || []).length,
    coverageExcludedScheduledArtifactCount:
      (aggregation.coverageExcludedScheduledArtifacts || []).length,
    coverageArtifactCandidateMismatchCount:
      (aggregation.coverageArtifactCandidateMismatches || []).length,
    coverageArtifactCandidateMismatchDates:
      (aggregation.coverageArtifactCandidateMismatches || []).map((x) => x.marketDate),
    duplicateScheduledArtifactCount: (aggregation.duplicateScheduledArtifacts || []).length,
    rerunDiagnosticArtifactCount: aggregation.rerunDiagnosticArtifactCount || 0,
    manualDiagnosticArtifactCount: aggregation.manualDiagnosticArtifactCount,
    collectorContractConsistencyVersion: aggregation.collectorContractConsistencyVersion || null,
    collectorContractFingerprints: aggregation.collectorContractFingerprints || [],
    collectorContractConsistent: aggregation.collectorContractConsistent === true,
    a5BoundaryIntegrityVersion: aggregation.a5BoundaryIntegrityVersion || null,
    a5BoundaryEvaluableDates: aggregation.a5BoundaryEvaluableDates || [],
    a5BoundaryEvaluableCount: (aggregation.a5BoundaryEvaluableDates || []).length,
    a5BoundaryPassDates: aggregation.a5BoundaryPassDates || [],
    a5BoundaryPassCount: (aggregation.a5BoundaryPassDates || []).length,
    a5BoundaryFailureDates: aggregation.a5BoundaryFailureDates || [],
    a5BoundaryFailureCount: (aggregation.a5BoundaryFailureDates || []).length,
    a5BoundaryNotEvaluableDates: aggregation.a5BoundaryNotEvaluableDates || [],
    a5BoundaryNotEvaluableCount: (aggregation.a5BoundaryNotEvaluableDates || []).length,
    independentTradingDates: readiness.independentTradingDates,
    completeTradingDates: readiness.completeTradingDates,
    precisionEligibleDates: readiness.precisionEligibleDates,
    requiredFreezeDates: readiness.freezeIndependentDates,
    allPrecise: readiness.allPrecise,
    includedMarketDates: readiness.includedMarketDates,
    worstObservedRequiredUpperBoundMinutes:
      readiness.worstObservedRequiredUpperBoundMinutes,
    safetyBufferMinutes: readiness.safetyBufferMinutes,
    candidateMinutesAfterClose: readiness.candidateMinutesAfterClose,
    candidateTaipeiTime: readiness.candidateTaipeiTime,
    blockers,
    exactDecisionClockAuthorized: false,
    workerCronAuthorized: false,
    captureEnabled: false,
    system1RuntimeUsed: false,
    attemptOneAnchorInvariant: true,
    laterRerunAttemptsCanRepairAttemptOne: false,
    laterRerunAttemptsCanInvalidateValidAttemptOne: false,
    outcomeDataUsedForClockSelection: false,
  });
}
