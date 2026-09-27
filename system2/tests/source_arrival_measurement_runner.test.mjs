import assert from "node:assert/strict";
import { runReadOnlySourceArrivalMeasurement } from "../scripts/measure_source_arrival_readonly.mjs";
import {
  buildSourceProbeReceipt,
  taipeiMarketCloseTimestamp,
} from "../runtime/source_arrival_latency.mjs";

const marketDate = "2026-09-29";
let probeCall = 0;
let waitCall = 0;
const requestedSourceIds = [];

function receipt(sourceId, observedAt, payloadDate) {
  return buildSourceProbeReceipt({
    sourceId,
    marketDate,
    marketCloseTimestamp: taipeiMarketCloseTimestamp(marketDate),
    probeStartedAt: observedAt,
    observedAt,
    transportOk: true,
    httpStatus: 200,
    schemaValid: true,
    payloadDate,
    recordCount: sourceId.includes("TPEX") ? 500 : 700,
  });
}

const probe = async ({ sourceIds } = {}) => {
  probeCall += 1;
  requestedSourceIds.push(sourceIds ? [...sourceIds] : null);
  const observedAt = probeCall === 1
    ? "2026-09-29T05:35:00Z"
    : "2026-09-29T05:40:00Z";
  const payloadDate = probeCall === 1 ? "2026-09-24" : marketDate;
  return [
    receipt("A1_TWSE_DAILY_CLOSE", observedAt, payloadDate),
    receipt("A1_TPEX_DAILY_CLOSE", observedAt, payloadDate),
  ];
};

let nowCall = 0;
const nowValues = [
  "2026-09-29T05:34:59Z",
  "2026-09-29T05:40:01Z",
];
const now = () => new Date(nowValues[Math.min(nowCall++, nowValues.length - 1)]);

const report = await runReadOnlySourceArrivalMeasurement({
  marketDate,
  attempts: 10,
  intervalSeconds: 300,
  expectedTradingDay: true,
  stopWhenDailyGateReady: true,
  requiredDailyOnly: true,
  probe,
  now,
  wait: async () => { waitCall += 1; },
});

assert.equal(probeCall, 2);
assert.equal(waitCall, 1);
assert.deepEqual(requestedSourceIds, [
  ["A1_TWSE_DAILY_CLOSE", "A1_TPEX_DAILY_CLOSE"],
  ["A1_TWSE_DAILY_CLOSE", "A1_TPEX_DAILY_CLOSE"],
]);
assert.equal(report.collectionScope, "REQUIRED_DAILY_CLOCK_SOURCES_ONLY");
assert.deepEqual(report.requestedSourceIds, [
  "A1_TWSE_DAILY_CLOSE",
  "A1_TPEX_DAILY_CLOSE",
]);
assert.equal(report.measurement.dailyGateComplete, true);
assert.equal(
  report.measurement.sourceSummaries.find((x) => x.sourceId === "A1_TWSE_DAILY_CLOSE")
    .observationIntervalMinutes,
  5,
);

console.log("System2 source-arrival measurement runner tests passed");
