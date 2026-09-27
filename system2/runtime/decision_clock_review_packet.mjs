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
    artifactCoverageAudited: aggregation.artifactCoverageAudited,
    promotionCoverageComplete: aggregation.promotionCoverageComplete,
    tradingDayArtifactGapCount: (aggregation.tradingDayArtifactGaps || []).length,
    duplicateScheduledArtifactCount: (aggregation.duplicateScheduledArtifacts || []).length,
    manualDiagnosticArtifactCount: aggregation.manualDiagnosticArtifactCount,
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
    outcomeDataUsedForClockSelection: false,
  });
}
