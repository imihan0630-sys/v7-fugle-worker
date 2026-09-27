import assert from "node:assert/strict";
import { aggregateDecisionClockEvidence } from "../runtime/decision_clock_evidence_aggregation.mjs";

function bundle(marketDate, {
  runId,
  runAttempt = 1,
  workflowSha,
  fingerprint = "collector-fp-A",
  upper = 20,
  requiredReady = true,
  precisionEligible = true,
} = {}) {
  return {
    bundleVersion: "S2_DECISION_CLOCK_DAILY_BUNDLE_V0_3",
    marketDate,
    collectorProvenance: {
      provenanceVersion: "S2_DECISION_CLOCK_COLLECTOR_PROVENANCE_V0_3",
      workflowRunId: String(runId),
      workflowRunAttempt: runAttempt,
      workflowSha,
      collectorContractFingerprint: fingerprint,
    },
    evidence: {
      evidenceId: `E-${marketDate}`,
      evidenceVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2",
      evidenceSemanticsVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_SEMANTICS_V0_2_1",
      marketDate,
      sameSessionClockReady: true,
      a5ObservedAtDecisionBoundary: `${marketDate}T05:30:00Z`,
      a5AvailableByCandidate: requiredReady,
      candidateTimestamp: `${marketDate}T06:00:00Z`,
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
      runHeadSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      eventName: "schedule",
      runCreatedAt: "2026-09-29T05:25:10Z",
      artifactId: "A200",
      artifactName: "system2-decision-clock-daily-2026-09-29-200",
      bundle: bundle("2026-09-29", { runId: "200", workflowSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", upper: 25 }),
    },
    {
      runId: "201",
      runAttempt: 1,
      runHeadSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      eventName: "schedule",
      runCreatedAt: "2026-09-29T06:00:00Z",
      artifactId: "A201",
      artifactName: "system2-decision-clock-daily-2026-09-29-201",
      bundle: bundle("2026-09-29", { runId: "201", workflowSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", upper: 5 }),
    },
    {
      runId: "202",
      runAttempt: 1,
      runHeadSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      eventName: "workflow_dispatch",
      runCreatedAt: "2026-09-29T05:20:00Z",
      artifactId: "A202",
      artifactName: "system2-decision-clock-daily-2026-09-29-202",
      bundle: bundle("2026-09-29", { runId: "202", workflowSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", upper: 1 }),
    },
    {
      runId: "300",
      runAttempt: 1,
      runHeadSha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      eventName: "schedule",
      runCreatedAt: "2026-09-30T05:25:05Z",
      artifactId: "A300",
      artifactName: "system2-decision-clock-daily-2026-09-30-300",
      bundle: bundle("2026-09-30", { runId: "300", workflowSha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", upper: 15 }),
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
assert.deepEqual(result.a5BoundaryFailureDates, []);
assert.equal(result.collectorContractConsistent, true);
assert.deepEqual(result.collectorContractFingerprints, ["collector-fp-A"]);
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


const drift = aggregateDecisionClockEvidence({
  scheduledRunCoverage: [
    { marketDate: "2026-10-01", runId: "500", expectedTradingDay: true, artifactPresent: true, runConclusion: "success" },
    { marketDate: "2026-10-02", runId: "600", expectedTradingDay: true, artifactPresent: true, runConclusion: "success" },
  ],
  candidates: [
    {
      runId: "500",
      runAttempt: 1,
      runHeadSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      eventName: "schedule",
      runCreatedAt: "2026-10-01T05:25:00Z",
      bundle: bundle("2026-10-01", {
        runId: "500",
        workflowSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        fingerprint: "collector-fp-A",
      }),
    },
    {
      runId: "600",
      runAttempt: 1,
      runHeadSha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      eventName: "schedule",
      runCreatedAt: "2026-10-02T05:25:00Z",
      bundle: bundle("2026-10-02", {
        runId: "600",
        workflowSha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        fingerprint: "collector-fp-B",
      }),
    },
  ],
});
assert.equal(drift.collectorContractConsistent, false);
assert.deepEqual(drift.collectorContractFingerprints, ["collector-fp-A", "collector-fp-B"]);
assert.equal(drift.promotionCoverageComplete, false);
assert.equal(drift.promotionReadinessStatus, "COLLECTOR_CONTRACT_DRIFT");


const lateA5 = aggregateDecisionClockEvidence({
  scheduledRunCoverage: [
    {
      marketDate: "2026-10-03",
      runId: "700",
      expectedTradingDay: true,
      artifactPresent: true,
      runConclusion: "success",
    },
  ],
  candidates: [
    {
      runId: "700",
      runAttempt: 1,
      runHeadSha: "cccccccccccccccccccccccccccccccccccccccc",
      eventName: "schedule",
      runCreatedAt: "2026-10-03T05:25:00Z",
      bundle: {
        ...bundle("2026-10-03", {
          runId: "700",
          workflowSha: "cccccccccccccccccccccccccccccccccccccccc",
          requiredReady: false,
          precisionEligible: false,
        }),
        evidence: {
          ...bundle("2026-10-03", {
            runId: "700",
            workflowSha: "cccccccccccccccccccccccccccccccccccccccc",
            requiredReady: false,
            precisionEligible: false,
          }).evidence,
          a5ObservedAtDecisionBoundary: "2026-10-03T06:10:00Z",
          a5AvailableByCandidate: false,
          candidateTimestamp: "2026-10-03T06:00:00Z",
        },
      },
    },
  ],
});
assert.deepEqual(lateA5.a5BoundaryFailureDates, ["2026-10-03"]);
assert.equal(lateA5.readiness.status, "INCOMPLETE_REQUIRED_EVIDENCE");

console.log("System2 decision-clock evidence aggregation tests passed");
