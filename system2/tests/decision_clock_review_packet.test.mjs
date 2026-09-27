import assert from "node:assert/strict";
import { buildDecisionClockReviewPacket } from "../runtime/decision_clock_review_packet.mjs";

function aggregation({
  status = "INSUFFICIENT_DATES",
  dates = 2,
  allPrecise = true,
  coverage = true,
  gapCount = 0,
} = {}) {
  return {
    aggregationVersion: "S2_DECISION_CLOCK_EVIDENCE_AGGREGATION_V0_1",
    promotionPolicy: "EARLIEST_SCHEDULED_ARTIFACT_PER_MARKET_DATE",
    artifactCoverageAudited: true,
    promotionCoverageComplete: coverage,
    tradingDayArtifactGaps: Array.from({ length: gapCount }, (_, i) => ({
      marketDate: "2026-10-" + String(i + 1).padStart(2, "0"),
    })),
    duplicateScheduledArtifacts: [],
    manualDiagnosticArtifactCount: 0,
    collectorContractConsistencyVersion: "S2_DECISION_CLOCK_COLLECTOR_CONSISTENCY_V0_3",
    collectorContractFingerprints: ["collector-fp-A"],
    collectorContractConsistent: true,
    readiness: {
      assessmentVersion: "S2_DECISION_CLOCK_READINESS_V0_2",
      status,
      independentTradingDates: dates,
      completeTradingDates: dates,
      precisionEligibleDates: allPrecise ? dates : dates - 1,
      freezeIndependentDates: 20,
      allPrecise,
      includedMarketDates: Array.from({ length: dates }, (_, i) =>
        "2026-10-" + String(i + 1).padStart(2, "0")),
      worstObservedRequiredUpperBoundMinutes: 20,
      safetyBufferMinutes: 15,
      candidateMinutesAfterClose: 35,
      candidateTaipeiTime: "14:05",
    },
  };
}

const accumulating = buildDecisionClockReviewPacket(aggregation());
assert.equal(accumulating.reviewState, "ACCUMULATING");
assert.ok(accumulating.blockers.includes("READINESS_NOT_FREEZE_ELIGIBLE"));
assert.equal(accumulating.exactDecisionClockAuthorized, false);
assert.equal(accumulating.workerCronAuthorized, false);

const blocked = buildDecisionClockReviewPacket(aggregation({
  status: "FREEZE_ELIGIBLE",
  dates: 20,
  coverage: false,
  gapCount: 1,
}));
assert.equal(blocked.reviewState, "BLOCKED");
assert.ok(blocked.blockers.includes("TRADING_DAY_ARTIFACT_GAPS"));

const eligible = buildDecisionClockReviewPacket(aggregation({
  status: "FREEZE_ELIGIBLE",
  dates: 20,
  allPrecise: true,
  coverage: true,
  gapCount: 0,
}));
assert.equal(eligible.reviewState, "OWNER_REVIEW_ELIGIBLE");
assert.deepEqual(eligible.blockers, []);
assert.equal(eligible.candidateTaipeiTime, "14:05");
assert.equal(eligible.outcomeDataUsedForClockSelection, false);
assert.equal(eligible.exactDecisionClockAuthorized, false);
assert.equal(eligible.workerCronAuthorized, false);


const driftBlocked = buildDecisionClockReviewPacket({
  ...aggregation({
    status: "FREEZE_ELIGIBLE",
    dates: 20,
    allPrecise: true,
    coverage: false,
    gapCount: 0,
  }),
  promotionCoverageComplete: false,
  collectorContractFingerprints: ["collector-fp-A", "collector-fp-B"],
  collectorContractConsistent: false,
});
assert.equal(driftBlocked.reviewState, "BLOCKED");
assert.ok(driftBlocked.blockers.includes("COLLECTOR_CONTRACT_DRIFT"));
assert.equal(driftBlocked.collectorContractConsistent, false);

console.log("System2 decision-clock review packet tests passed");
