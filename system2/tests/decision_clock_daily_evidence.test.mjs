import assert from "node:assert/strict";
import { buildDecisionClockDailyEvidence } from "../runtime/decision_clock_daily_evidence.mjs";

const sourceArrivalReport = {
  measurement: {
    measurementRunId: "SAL-1",
    marketDate: "2026-09-29",
    expectedTradingDay: true,
    dailyGateComplete: true,
    sourceSummaries: [
      {
        sourceId: "A1_TWSE_DAILY_CLOSE",
        readyObserved: true,
        firstReadyAt: "2026-09-29T05:40:00Z",
        lastObservedNotReadyAt: "2026-09-29T05:35:00Z",
        latencyUpperBoundMinutes: 10,
        latencyLowerBoundMinutes: 5,
        observationIntervalMinutes: 5,
      },
      {
        sourceId: "A1_TPEX_DAILY_CLOSE",
        readyObserved: true,
        firstReadyAt: "2026-09-29T05:45:00Z",
        lastObservedNotReadyAt: "2026-09-29T05:40:00Z",
        latencyUpperBoundMinutes: 15,
        latencyLowerBoundMinutes: 10,
        observationIntervalMinutes: 5,
      },
    ],
  },
};

const dependencySeriesReport = {
  marketDate: "2026-09-29",
  expectedTradingDay: true,
  dependencyCoverage: {
    A5_QUARTERLY_FINANCIALS: true,
    B2_INDUSTRY_THESIS_PROSPECTIVE: true,
  },
  dependencySummaries: [
    {
      dependency: "A5_QUARTERLY_FINANCIALS",
      readyObserved: true,
      firstReadyAt: "2026-09-29T05:30:00Z",
      lastObservedNotReadyAt: null,
      observationIntervalMinutes: null,
    },
    {
      dependency: "B2_INDUSTRY_THESIS_PROSPECTIVE",
      readyObserved: true,
      firstReadyAt: "2026-09-29T05:45:00Z",
      lastObservedNotReadyAt: "2026-09-29T05:40:00Z",
      observationIntervalMinutes: 5,
    },
  ],
};

const result = buildDecisionClockDailyEvidence({
  evidenceId: "E1",
  sourceArrivalReport,
  dependencySeriesReport,
  createdAt: "2026-09-29T05:46:00Z",
});
assert.equal(result.requiredReady, true);
assert.equal(result.precisionEligible, true);
assert.equal(result.worstObservedRequiredUpperBoundMinutes, 15);
assert.equal(result.candidateMinutesAfterClose, 30);
assert.equal(result.candidateTaipeiTime, "14:00");
assert.equal(result.exactDecisionClockAuthorized, false);
assert.equal(result.cronAuthorized, false);

const imprecise = buildDecisionClockDailyEvidence({
  evidenceId: "E2",
  sourceArrivalReport: {
    measurement: {
      ...sourceArrivalReport.measurement,
      sourceSummaries: sourceArrivalReport.measurement.sourceSummaries.map((x) =>
        x.sourceId === "A1_TWSE_DAILY_CLOSE"
          ? { ...x, lastObservedNotReadyAt: null, observationIntervalMinutes: null }
          : x),
    },
  },
  dependencySeriesReport,
  createdAt: "2026-09-29T05:46:00Z",
});
assert.equal(imprecise.requiredReady, true);
assert.equal(imprecise.precisionEligible, false);

console.log("System2 daily decision-clock evidence tests passed");
