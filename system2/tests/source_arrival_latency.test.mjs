import assert from "node:assert/strict";
import {
  SOURCE_PROBE_STATE,
  assessDecisionClockReadiness,
  buildSourceArrivalMeasurement,
  buildSourceProbeReceipt,
  taipeiMarketCloseTimestamp,
} from "../runtime/source_arrival_latency.mjs";

function receipt({
  sourceId,
  marketDate = "2026-09-28",
  startedAt = "2026-09-28T06:00:00Z",
  observedAt = "2026-09-28T06:00:30Z",
  payloadDate = marketDate,
  transportOk = true,
  schemaValid = true,
  recordCount,
  errorCode = null,
} = {}) {
  return buildSourceProbeReceipt({
    sourceId,
    marketDate,
    probeStartedAt: startedAt,
    observedAt,
    transportOk,
    httpStatus: transportOk ? 200 : null,
    schemaValid,
    payloadDate,
    recordCount: recordCount ?? (sourceId.includes("TPEX") ? 500 : 700),
    errorCode,
  });
}

const beforeClose = receipt({
  sourceId: "A1_TWSE_DAILY_CLOSE",
  startedAt: "2026-09-28T05:20:00Z",
  observedAt: "2026-09-28T05:20:01Z",
});
assert.equal(beforeClose.state, SOURCE_PROBE_STATE.NOT_READY);
assert.equal(beforeClose.reason, "BEFORE_MARKET_CLOSE_FINALITY_NOT_ASSUMED");
assert.equal(beforeClose.prospectiveSameDateEligible, true);

const previousDate = receipt({
  sourceId: "A1_TWSE_DAILY_CLOSE",
  payloadDate: "2026-09-25",
});
assert.equal(previousDate.state, SOURCE_PROBE_STATE.NOT_READY);
assert.equal(previousDate.reason, "TARGET_DATE_NOT_PRESENT");

const sourceError = receipt({
  sourceId: "A1_TWSE_DAILY_CLOSE",
  transportOk: false,
  schemaValid: false,
  payloadDate: null,
  recordCount: null,
  errorCode: "TIMEOUT",
});
assert.equal(sourceError.state, SOURCE_PROBE_STATE.SOURCE_ERROR);
assert.notEqual(sourceError.state, SOURCE_PROBE_STATE.NOT_READY);

const thin = receipt({ sourceId: "A1_TWSE_DAILY_CLOSE", recordCount: 599 });
assert.equal(thin.state, SOURCE_PROBE_STATE.INVALID_PAYLOAD);
assert.equal(thin.reason, "COVERAGE_BELOW_CONTRACT_MINIMUM");

const attempts = [
  receipt({
    sourceId: "A1_TWSE_DAILY_CLOSE",
    observedAt: "2026-09-28T06:00:00Z",
    payloadDate: "2026-09-25",
  }),
  receipt({
    sourceId: "A1_TWSE_DAILY_CLOSE",
    startedAt: "2026-09-28T06:05:00Z",
    observedAt: "2026-09-28T06:05:00Z",
  }),
  receipt({
    sourceId: "A1_TPEX_DAILY_CLOSE",
    observedAt: "2026-09-28T06:00:00Z",
    payloadDate: "2026-09-25",
  }),
  receipt({
    sourceId: "A1_TPEX_DAILY_CLOSE",
    startedAt: "2026-09-28T06:05:00Z",
    observedAt: "2026-09-28T06:05:00Z",
  }),
];
const measurement = buildSourceArrivalMeasurement({
  measurementRunId: "M1",
  marketDate: "2026-09-28",
  expectedTradingDay: true,
  attempts,
  createdAt: "2026-09-28T06:06:00Z",
});
assert.equal(measurement.dailyGateComplete, true);
assert.equal(measurement.probeReceipts.length, 4);
const twseSummary = measurement.sourceSummaries.find(
  (item) => item.sourceId === "A1_TWSE_DAILY_CLOSE",
);
assert.equal(twseSummary.latencyLowerBoundMinutes, 30);
assert.equal(twseSummary.latencyUpperBoundMinutes, 35);
assert.equal(twseSummary.observationIntervalMinutes, 5);
assert.equal(twseSummary.publicationTimestampProven, false);
assert.equal(measurement.captureEnabled, false);
assert.equal(measurement.cronAuthorized, false);

assert.throws(
  () => buildSourceArrivalMeasurement({
    measurementRunId: "HISTORICAL-PROBE",
    marketDate: "2026-09-28",
    expectedTradingDay: true,
    attempts: [receipt({
      sourceId: "A1_TWSE_DAILY_CLOSE",
      observedAt: "2026-09-29T06:00:00Z",
      startedAt: "2026-09-29T05:59:59Z",
    })],
    createdAt: "2026-09-29T06:01:00Z",
  }),
  /not a prospective same-Taipei-date observation/,
);

function completedMeasurement(marketDate, index) {
  const close = taipeiMarketCloseTimestamp(marketDate);
  const closeMs = Date.parse(close);
  const notReadyAt = new Date(closeMs + 30 * 60_000).toISOString();
  const readyAt = new Date(closeMs + 35 * 60_000).toISOString();
  const rows = ["A1_TWSE_DAILY_CLOSE", "A1_TPEX_DAILY_CLOSE"].flatMap((sourceId) => [
    receipt({
      sourceId,
      marketDate,
      startedAt: notReadyAt,
      observedAt: notReadyAt,
      payloadDate: "2026-09-01",
    }),
    receipt({ sourceId, marketDate, startedAt: readyAt, observedAt: readyAt }),
  ]);
  return buildSourceArrivalMeasurement({
    measurementRunId: `M-${index}`,
    marketDate,
    expectedTradingDay: true,
    attempts: rows,
    createdAt: new Date(closeMs + 40 * 60_000).toISOString(),
  });
}

const dates = Array.from({ length: 20 }, (_, index) => `2026-10-${String(index + 1).padStart(2, "0")}`);
const measurements = dates.map(completedMeasurement);

const blocked = assessDecisionClockReadiness({ measurements });
assert.equal(blocked.status, "BLOCKED_DEPENDENCIES");
assert.deepEqual(blocked.dependencyGaps, [
  "A5_QUARTERLY_FINANCIALS",
  "B2_INDUSTRY_THESIS_PROSPECTIVE",
]);
assert.equal(blocked.exactCronFrozen, false);

const provisional = assessDecisionClockReadiness({
  measurements: measurements.slice(0, 10),
  dependencyCoverage: {
    A5_QUARTERLY_FINANCIALS: true,
    B2_INDUSTRY_THESIS_PROSPECTIVE: true,
  },
});
assert.equal(provisional.status, "PROVISIONAL_ELIGIBLE");
assert.equal(provisional.candidateTaipeiTime, "14:20");
assert.equal(provisional.candidateIsAuthorizedDecisionClock, false);

const freezeEligible = assessDecisionClockReadiness({
  measurements,
  dependencyCoverage: {
    A5_QUARTERLY_FINANCIALS: true,
    B2_INDUSTRY_THESIS_PROSPECTIVE: true,
  },
});
assert.equal(freezeEligible.status, "FREEZE_ELIGIBLE");
assert.equal(freezeEligible.independentTradingDates, 20);
assert.equal(freezeEligible.candidateIsAuthorizedDecisionClock, false);
assert.equal(freezeEligible.cronAuthorized, false);

console.log("System2 source-arrival latency contract tests passed");
