import assert from "node:assert/strict";
import { buildDecisionClockDailyEvidence } from "../runtime/decision_clock_daily_evidence.mjs";
import { aggregateDecisionClockEvidence } from "../runtime/decision_clock_evidence_aggregation.mjs";
import { buildDecisionClockReviewPacket } from "../runtime/decision_clock_review_packet.mjs";
import { auditFinalizedDecisionClockDateV01 } from "../runtime/decision_clock_finalized_date_acceptance_v0_1.mjs";

const marketDate = "2026-09-29";
const runId = "1000";
const workflowSha = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const fingerprint = "collector-fp-first-day";

function sourceArrivalReport({ precise = true } = {}) {
  return {
    measurement: {
      measurementRunId: "SAL-FIRST-DAY",
      marketDate,
      expectedTradingDay: true,
      dailyGateComplete: true,
      sourceSummaries: [
        {
          sourceId: "A1_TWSE_DAILY_CLOSE",
          readyObserved: true,
          firstReadyAt: "2026-09-29T05:35:00Z",
          lastObservedNotReadyAt: precise ? "2026-09-29T05:30:00Z" : null,
          latencyUpperBoundMinutes: 5,
          latencyLowerBoundMinutes: precise ? 0 : null,
          observationIntervalMinutes: precise ? 5 : null,
        },
        {
          sourceId: "A1_TPEX_DAILY_CLOSE",
          readyObserved: true,
          firstReadyAt: "2026-09-29T05:35:00Z",
          lastObservedNotReadyAt: precise ? "2026-09-29T05:30:00Z" : null,
          latencyUpperBoundMinutes: 5,
          latencyLowerBoundMinutes: precise ? 0 : null,
          observationIntervalMinutes: precise ? 5 : null,
        },
      ],
    },
  };
}

function dependencySeriesReport({ precise = true } = {}) {
  return {
    marketDate,
    expectedTradingDay: true,
    dependencyCoverage: {
      A5_QUARTERLY_FINANCIALS: true,
      B2_INDUSTRY_THESIS_PROSPECTIVE: true,
    },
    dependencySummaries: [
      {
        dependency: "A5_QUARTERLY_FINANCIALS",
        firstReadyAt: "2026-09-29T05:25:00Z",
        lastObservedNotReadyAt: null,
        observationIntervalMinutes: null,
        readyObserved: true,
        publicationTimestampProven: false,
      },
      {
        dependency: "B2_INDUSTRY_THESIS_PROSPECTIVE",
        firstReadyAt: "2026-09-29T05:35:00Z",
        lastObservedNotReadyAt: precise ? "2026-09-29T05:30:00Z" : null,
        observationIntervalMinutes: precise ? 5 : null,
        readyObserved: true,
        publicationTimestampProven: false,
      },
    ],
  };
}

function bundleFromEvidence(evidence) {
  return {
    bundleVersion: "S2_DECISION_CLOCK_DAILY_BUNDLE_V0_3",
    marketDate,
    collectorProvenance: {
      provenanceVersion: "S2_DECISION_CLOCK_COLLECTOR_PROVENANCE_V0_3",
      workflowRunId: runId,
      workflowRunAttempt: 1,
      workflowSha,
      collectorContractFingerprint: fingerprint,
    },
    evidence,
  };
}

function aggregateEvidence(evidence) {
  const aggregation = aggregateDecisionClockEvidence({
    scheduledRunCoverage: [{
      marketDate,
      runId,
      expectedTradingDay: true,
      artifactPresent: true,
      runConclusion: "success",
    }],
    candidates: [{
      runId,
      runAttempt: 1,
      runHeadSha: workflowSha,
      eventName: "schedule",
      runCreatedAt: "2026-09-29T05:25:00Z",
      artifactId: "A-FIRST-DAY",
      artifactName: "system2-decision-clock-daily-2026-09-29-1000",
      bundle: bundleFromEvidence(evidence),
    }],
  });

  const reviewPacket = buildDecisionClockReviewPacket(aggregation);
  const report = {
    reportVersion: "S2_DECISION_CLOCK_ARTIFACT_REPORT_V0_1",
    aggregation,
    reviewPacket,
    coverageIntegrity: {
      rows: [{
        marketDate,
        expectedTradingDay: true,
        coverageClass: "TRADING_DAY_COMPLETE",
        failureClass: null,
        promotionCoverageEligible: true,
        runId,
        runAttempt: 1,
        runConclusion: "success",
        dailyArtifactCount: 1,
      }],
    },
    coverageFinalization: {
      coverageStartDate: marketDate,
      coverageThroughDate: marketDate,
    },
  };
  return { aggregation, reviewPacket, report };
}

const preciseEvidence = buildDecisionClockDailyEvidence({
  evidenceId: "E-FIRST-DAY-PRECISE",
  sourceArrivalReport: sourceArrivalReport({ precise: true }),
  dependencySeriesReport: dependencySeriesReport({ precise: true }),
  createdAt: "2026-09-29T05:36:00Z",
});

assert.equal(preciseEvidence.requiredReady, true);
assert.equal(preciseEvidence.precisionEligible, true);
assert.equal(preciseEvidence.worstObservedRequiredUpperBoundMinutes, 5);
assert.equal(preciseEvidence.candidateMinutesAfterClose, 20);
assert.equal(preciseEvidence.candidateTaipeiTime, "13:50");
assert.equal(preciseEvidence.candidateTimestamp, "2026-09-29T05:50:00.000Z");
assert.equal(preciseEvidence.a5AvailableByCandidate, true);
assert.equal(preciseEvidence.publicationTimestampProven, false);
assert.equal(preciseEvidence.exactDecisionClockAuthorized, false);
assert.equal(preciseEvidence.cronAuthorized, false);
assert.equal(preciseEvidence.captureEnabled, false);

const precise = aggregateEvidence(preciseEvidence);
assert.equal(precise.aggregation.promotionGradeDateCount, 1);
assert.deepEqual(precise.aggregation.promotionGradeMarketDates, [marketDate]);
assert.equal(precise.aggregation.readiness.independentTradingDates, 1);
assert.equal(precise.aggregation.readiness.completeTradingDates, 1);
assert.equal(precise.aggregation.readiness.precisionEligibleDates, 1);
assert.equal(precise.aggregation.readiness.status, "INSUFFICIENT_DATES");
assert.equal(precise.aggregation.promotionCoverageComplete, true);
assert.equal(precise.aggregation.collectorContractConsistent, true);
assert.equal(precise.reviewPacket.reviewState, "ACCUMULATING");
assert.equal(precise.reviewPacket.exactDecisionClockAuthorized, false);
assert.equal(precise.reviewPacket.workerCronAuthorized, false);
assert.equal(precise.reviewPacket.captureEnabled, false);

const preciseAcceptance = auditFinalizedDecisionClockDateV01({
  report: precise.report,
});
assert.equal(preciseAcceptance.status, "COMPLETE_PRECISE");
assert.equal(preciseAcceptance.countsTowardIndependentDate, true);
assert.equal(preciseAcceptance.countsTowardPrecisionEligibleDate, true);
assert.equal(preciseAcceptance.pitSemantics.publicationTimestampProven, false);
assert.equal(preciseAcceptance.safety.exactDecisionClockAuthorized, false);

const impreciseEvidence = buildDecisionClockDailyEvidence({
  evidenceId: "E-FIRST-DAY-ALREADY-READY",
  sourceArrivalReport: sourceArrivalReport({ precise: false }),
  dependencySeriesReport: dependencySeriesReport({ precise: false }),
  createdAt: "2026-09-29T05:36:00Z",
});

assert.equal(impreciseEvidence.requiredReady, true);
assert.equal(impreciseEvidence.precisionEligible, false);
assert.equal(impreciseEvidence.candidateTaipeiTime, "13:50");

const imprecise = aggregateEvidence(impreciseEvidence);
assert.equal(imprecise.aggregation.promotionGradeDateCount, 1);
assert.equal(imprecise.aggregation.readiness.independentTradingDates, 1);
assert.equal(imprecise.aggregation.readiness.completeTradingDates, 1);
assert.equal(imprecise.aggregation.readiness.precisionEligibleDates, 0);
assert.equal(imprecise.aggregation.readiness.status, "INSUFFICIENT_DATES");

const impreciseAcceptance = auditFinalizedDecisionClockDateV01({
  report: imprecise.report,
});
assert.equal(impreciseAcceptance.status, "COMPLETE_IMPRECISE");
assert.equal(impreciseAcceptance.countsTowardIndependentDate, true);
assert.equal(impreciseAcceptance.countsTowardPrecisionEligibleDate, false);

console.log("System2 first prospective Decision Clock day drill V0.1 passed");
