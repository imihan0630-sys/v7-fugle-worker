import assert from "node:assert/strict";
import { auditFinalizedDecisionClockDateV01 } from "../runtime/decision_clock_finalized_date_acceptance_v0_1.mjs";

function report({
  date = "2026-09-29",
  expectedTradingDay = true,
  coverageEligible = true,
  failureClass = null,
  runId = "100",
  selectedRunId = runId,
  requiredReady = true,
  precisionEligible = true,
  sameSessionClockReady = true,
  a5AvailableByCandidate = true,
  promotionGrade,
  includeSelected = true,
} = {}) {
  const effectivePromotionGrade = promotionGrade
    ?? (coverageEligible && includeSelected && selectedRunId === runId);
  return {
    reportVersion: "S2_DECISION_CLOCK_ARTIFACT_REPORT_V0_1",
    coverageFinalization: {
      coverageStartDate: "2026-09-29",
      coverageThroughDate: date,
    },
    coverageIntegrity: {
      rows: [{
        marketDate: date,
        expectedTradingDay,
        coverageClass: expectedTradingDay
          ? (coverageEligible ? "TRADING_DAY_COMPLETE" : "TRADING_DAY_GAP")
          : "OFFICIAL_NON_TRADING_DAY",
        failureClass,
        promotionCoverageEligible: coverageEligible,
        runId: expectedTradingDay ? runId : null,
        runAttempt: expectedTradingDay ? 1 : null,
        runConclusion: expectedTradingDay ? (coverageEligible ? "success" : "failure") : null,
        dailyArtifactCount: coverageEligible ? 1 : 0,
      }],
    },
    aggregation: {
      promotionQualificationVersion: "S2_DECISION_CLOCK_PROMOTION_QUALIFICATION_V0_1",
      promotionGradeMarketDates: effectivePromotionGrade ? [date] : [],
      collectorContractConsistent: true,
      selectedArtifacts: includeSelected ? [{
        marketDate: date,
        runId: selectedRunId,
        runAttempt: 1,
        evidenceSemanticsVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_SEMANTICS_V0_2_1",
        requiredReady,
        precisionEligible,
        sameSessionClockReady,
        a5ObservedAtDecisionBoundary: "2026-09-29T05:35:00.000Z",
        a5AvailableByCandidate,
        candidateTimestamp: "2026-09-29T06:00:00.000Z",
        candidateTaipeiTime: "14:00",
        collectorContractFingerprint: "collector-fp-A",
        workflowSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      }] : [],
    },
  };
}

const precise = auditFinalizedDecisionClockDateV01({ report: report() });
assert.equal(precise.status, "COMPLETE_PRECISE");
assert.equal(precise.countsTowardIndependentDate, true);
assert.equal(precise.countsTowardCompleteTradingDate, true);
assert.equal(precise.countsTowardPrecisionEligibleDate, true);
assert.equal(precise.selectedCountedByAggregation, true);
assert.equal(precise.pitSemantics.publicationTimestampProven, false);
assert.equal(precise.pitSemantics.capturedAtIsNotAvailableAt, true);
assert.equal(precise.safety.exactDecisionClockAuthorized, false);
assert.equal(precise.safety.workerCronAuthorized, false);
assert.equal(precise.safety.captureEnabled, false);

const imprecise = auditFinalizedDecisionClockDateV01({
  report: report({ precisionEligible: false }),
});
assert.equal(imprecise.status, "COMPLETE_IMPRECISE");
assert.equal(imprecise.countsTowardIndependentDate, true);
assert.equal(imprecise.countsTowardCompleteTradingDate, true);
assert.equal(imprecise.countsTowardPrecisionEligibleDate, false);

const rejected = auditFinalizedDecisionClockDateV01({
  report: report({
    coverageEligible: false,
    failureClass: "SCHEDULED_RUN_NOT_SUCCESS",
    includeSelected: true,
    promotionGrade: false,
  }),
});
assert.equal(rejected.status, "COVERAGE_REJECTED");
assert.equal(rejected.countsTowardIndependentDate, false);
assert.equal(rejected.coverageFailureClass, "SCHEDULED_RUN_NOT_SUCCESS");

const nonTrading = auditFinalizedDecisionClockDateV01({
  report: report({
    expectedTradingDay: false,
    coverageEligible: true,
    includeSelected: false,
    promotionGrade: false,
  }),
});
assert.equal(nonTrading.status, "NON_TRADING_DAY_SKIP");
assert.equal(nonTrading.countsTowardIndependentDate, false);

const missingSelected = auditFinalizedDecisionClockDateV01({
  report: report({
    coverageEligible: true,
    includeSelected: false,
    promotionGrade: false,
  }),
});
assert.equal(missingSelected.status, "PROMOTION_ARTIFACT_MISSING");
assert.equal(missingSelected.countsTowardIndependentDate, false);

const runMismatch = auditFinalizedDecisionClockDateV01({
  report: report({
    selectedRunId: "101",
    promotionGrade: false,
  }),
});
assert.equal(runMismatch.status, "COVERAGE_ANCHOR_RUN_MISMATCH");
assert.equal(runMismatch.countsTowardIndependentDate, false);

const incomplete = auditFinalizedDecisionClockDateV01({
  report: report({
    sameSessionClockReady: false,
    requiredReady: false,
    a5AvailableByCandidate: false,
  }),
});
assert.equal(incomplete.status, "INCOMPLETE_REQUIRED_EVIDENCE");
assert.equal(incomplete.countsTowardIndependentDate, true);
assert.equal(incomplete.countsTowardCompleteTradingDate, false);
assert.equal(incomplete.countsTowardPrecisionEligibleDate, false);

const a5Blocked = auditFinalizedDecisionClockDateV01({
  report: report({
    sameSessionClockReady: true,
    requiredReady: false,
    a5AvailableByCandidate: false,
  }),
});
assert.equal(a5Blocked.status, "A5_NOT_AVAILABLE_BY_CANDIDATE");
assert.equal(a5Blocked.countsTowardIndependentDate, true);
assert.equal(a5Blocked.countsTowardCompleteTradingDate, false);
assert.equal(a5Blocked.countsTowardPrecisionEligibleDate, false);

const outsideWindowReport = report();
outsideWindowReport.coverageFinalization.coverageThroughDate = "2026-09-28";
outsideWindowReport.aggregation.promotionGradeMarketDates = [];
const outsideWindow = auditFinalizedDecisionClockDateV01({
  report: outsideWindowReport,
  marketDate: "2026-09-29",
});
assert.equal(outsideWindow.status, "NOT_IN_FINALIZED_WINDOW");
assert.equal(outsideWindow.finalizedWindow.included, false);
assert.equal(outsideWindow.countsTowardIndependentDate, false);

assert.throws(
  () => auditFinalizedDecisionClockDateV01({
    report: report({ promotionGrade: false }),
  }),
  /disagrees with aggregation promotion-grade membership/,
);

console.log("System2 finalized Decision Clock date acceptance V0.1 tests passed");
