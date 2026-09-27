import assert from "node:assert/strict";
import { aggregateDecisionClockEvidence } from "../runtime/decision_clock_evidence_aggregation.mjs";

function bundle(marketDate, {
  upper = 20,
  requiredReady = true,
  precisionEligible = true,
} = {}) {
  return {
    bundleVersion: "S2_DECISION_CLOCK_DAILY_BUNDLE_V0_2",
    marketDate,
    evidence: {
      evidenceId: `E-${marketDate}`,
      evidenceVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2",
      marketDate,
      requiredReady,
      precisionEligible,
      worstObservedRequiredUpperBoundMinutes: upper,
    },
  };
}

const result = aggregateDecisionClockEvidence({
  scheduledRunCoverage: [
    {
      marketDate: "2026-09-28",
      runId: "100",
      expectedTradingDay: false,
      artifactPresent: false,
      runConclusion: "success",
    },
    {
      marketDate: "2026-09-29",
      runId: "200",
      expectedTradingDay: true,
      artifactPresent: true,
      runConclusion: "success",
    },
    {
      marketDate: "2026-09-30",
      runId: "300",
      expectedTradingDay: true,
      artifactPresent: true,
      runConclusion: "success",
    },
  ],
  candidates: [
    {
      runId: "200",
      runAttempt: 1,
      eventName: "schedule",
      runCreatedAt: "2026-09-29T05:25:10Z",
      artifactId: "A200",
      artifactName: "system2-decision-clock-daily-2026-09-29-200",
      bundle: bundle("2026-09-29", { upper: 25 }),
    },
    {
      runId: "201",
      runAttempt: 1,
      eventName: "schedule",
      runCreatedAt: "2026-09-29T06:00:00Z",
      artifactId: "A201",
      artifactName: "system2-decision-clock-daily-2026-09-29-201",
      bundle: bundle("2026-09-29", { upper: 5 }),
    },
    {
      runId: "202",
      runAttempt: 1,
      eventName: "workflow_dispatch",
      runCreatedAt: "2026-09-29T05:20:00Z",
      artifactId: "A202",
      artifactName: "system2-decision-clock-daily-2026-09-29-202",
      bundle: bundle("2026-09-29", { upper: 1 }),
    },
    {
      runId: "300",
      runAttempt: 1,
      eventName: "schedule",
      runCreatedAt: "2026-09-30T05:25:05Z",
      artifactId: "A300",
      artifactName: "system2-decision-clock-daily-2026-09-30-300",
      bundle: bundle("2026-09-30", { upper: 15 }),
    },
  ],
});

assert.equal(result.promotionPolicy, "EARLIEST_SCHEDULED_ARTIFACT_PER_MARKET_DATE");
assert.equal(result.candidateArtifactCount, 4);
assert.equal(result.scheduledArtifactCount, 3);
assert.equal(result.manualDiagnosticArtifactCount, 1);
assert.equal(result.promotionGradeDateCount, 2);
assert.deepEqual(result.promotionGradeMarketDates, ["2026-09-29", "2026-09-30"]);
assert.equal(result.selectedArtifacts[0].runId, "200");
assert.equal(result.selectedArtifacts[0].candidateTaipeiTime, undefined);
assert.equal(result.duplicateScheduledArtifacts[0].excludedRunId, "201");
assert.equal(result.manualDiagnosticArtifacts[0].runId, "202");
assert.equal(result.readiness.independentTradingDates, 2);
assert.equal(result.readiness.status, "INSUFFICIENT_DATES");
assert.equal(result.artifactCoverageAudited, true);
assert.equal(result.promotionCoverageComplete, true);
assert.equal(result.promotionReadinessStatus, "INSUFFICIENT_DATES");
assert.equal(result.nonTradingScheduledRuns.length, 1);
assert.equal(result.tradingDayArtifactGaps.length, 0);
assert.equal(result.exactDecisionClockAuthorized, false);
assert.equal(result.cronAuthorized, false);
assert.equal(result.captureEnabled, false);

const gap = aggregateDecisionClockEvidence({
  scheduledRunCoverage: [
    {
      marketDate: "2026-10-01",
      runId: "400",
      expectedTradingDay: true,
      artifactPresent: false,
      runConclusion: "failure",
    },
  ],
  candidates: [],
});
assert.equal(gap.artifactCoverageAudited, true);
assert.equal(gap.promotionCoverageComplete, false);
assert.equal(gap.promotionReadinessStatus, "SCHEDULED_TRADING_DAY_ARTIFACT_GAPS");
assert.equal(gap.tradingDayArtifactGaps[0].marketDate, "2026-10-01");

console.log("System2 decision-clock evidence aggregation tests passed");
