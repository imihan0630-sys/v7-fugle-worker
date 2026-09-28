import assert from "node:assert/strict";
import { buildA1HistoryPrimitiveBundle } from "../runtime/a1_history_primitives_v0_1.mjs";

function isoDatePlus(start, days) {
  const d = new Date(start + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const bars = Array.from({ length: 65 }, (_, i) => {
  const close = 100 + i;
  return {
    date: isoDatePlus("2026-07-27", i),
    open: close - 1,
    high: close + 2,
    low: close - 2,
    close,
    volume: 1_000_000 + i * 10_000,
    turnover: (1_000_000 + i * 10_000) * close,
  };
});

const input = {
  bundleId: "A1-HIST-2330-20260929",
  symbol: "2330",
  marketDate: "2026-09-29",
  decisionTimestamp: "2026-09-29T08:00:00Z",
  observedAt: "2026-09-29T07:50:00Z",
  bars,
  sourceId: "FUGLE_HISTORICAL_DAILY_RESEARCH",
  sourceName: "fixture provider",
  sourceUrl: "https://example.invalid/history",
  priceSpace: "RAW",
  volumeUnit: "SHARES",
  continuityState: "CLEAR_NO_ACTION",
};

const bundle = await buildA1HistoryPrimitiveBundle(input);
const replay = await buildA1HistoryPrimitiveBundle(input);

assert.equal(bundle.bundleHash, replay.bundleHash);
assert.equal(bundle.pointInTimeEligible, true);
assert.equal(bundle.continuityEligible, true);
assert.equal(bundle.barCount, 65);
assert.equal(bundle.lastBarDate, "2026-09-29");
assert.equal(bundle.coreMetrics.close, 164);
assert.equal(bundle.coreMetrics.volumeShares, 1_640_000);
assert.equal(bundle.coreMetrics.volumeLots, 1640);
assert.equal(bundle.coreMetrics.maOrder5gt10gt20, true);
assert.ok(bundle.coreMetrics.ma5 > bundle.coreMetrics.ma10);
assert.ok(bundle.coreMetrics.ma10 > bundle.coreMetrics.ma20);
assert.ok(bundle.coreMetrics.ma20 > bundle.coreMetrics.ma60);
assert.ok(bundle.coreMetrics.ret20 > 0);
assert.ok(bundle.coreMetrics.ret60 > 0);
assert.ok(bundle.coreMetrics.relativeVolume20Prior > 1);
assert.ok(bundle.coreMetrics.avgAmount20Prior > 0);
assert.ok(bundle.coreMetrics.atr14Pct > 0);
assert.ok(bundle.coreMetrics.priorHigh20 < bundle.coreMetrics.high);
assert.equal(bundle.strategyScoreAssigned, false);
assert.equal(bundle.strategyThresholdApplied, false);

const observations = Object.fromEntries(
  bundle.factorObservations.map((x) => [x.factorId, x]),
);
for (const id of [
  "TECH.TREND",
  "TECH.STRUCTURE",
  "PV.RELATIVE_VOLUME",
  "PV.ACCEPTANCE",
  "PV.RESPONSE",
  "RISK.LIQUIDITY",
  "RISK.EXTENSION",
]) {
  assert.equal(observations[id].state, "KNOWN", id);
  assert.equal(observations[id].normalizedValue, null);
  assert.equal(observations[id].provenance.pointInTimeEligible, true);
}
assert.equal(observations["TECH.TREND"].rawValue.maOrder5gt10gt20, true);
assert.equal(observations["PV.RELATIVE_VOLUME"].rawValue.volumeLots, 1640);

const unverified = await buildA1HistoryPrimitiveBundle({
  ...input,
  bundleId: "A1-HIST-UNVERIFIED",
  continuityState: "UNVERIFIED",
});
const unverifiedObs = Object.fromEntries(
  unverified.factorObservations.map((x) => [x.factorId, x]),
);
assert.equal(unverified.continuityEligible, false);
assert.equal(unverifiedObs["TECH.TREND"].state, "UNKNOWN");
assert.equal(unverifiedObs["TECH.TREND"].unknownReason, "PRICE_CONTINUITY_NOT_VERIFIED");
assert.equal(unverifiedObs["PV.RELATIVE_VOLUME"].state, "KNOWN");
assert.equal(unverifiedObs["RISK.LIQUIDITY"].state, "KNOWN");
assert.ok(unverified.qualityFlags.includes("CONTINUITY_UNVERIFIED"));

const late = await buildA1HistoryPrimitiveBundle({
  ...input,
  bundleId: "A1-HIST-LATE",
  observedAt: "2026-09-29T08:01:00Z",
});
assert.equal(late.pointInTimeEligible, false);
for (const obs of late.factorObservations) {
  assert.equal(obs.state, "UNKNOWN");
  assert.equal(obs.unknownReason, "SOURCE_NOT_AVAILABLE_BY_DECISION_TIMESTAMP");
}

const shortHistory = await buildA1HistoryPrimitiveBundle({
  ...input,
  bundleId: "A1-HIST-SHORT",
  bars: bars.slice(-20),
});
assert.ok(shortHistory.qualityFlags.includes("HISTORY_LT_61"));
assert.equal(
  shortHistory.factorObservations.find((x) => x.factorId === "TECH.TREND").state,
  "UNKNOWN",
);
assert.equal(
  shortHistory.factorObservations.find((x) => x.factorId === "PV.RELATIVE_VOLUME").state,
  "UNKNOWN",
);

const lots = await buildA1HistoryPrimitiveBundle({
  ...input,
  bundleId: "A1-HIST-LOTS",
  bars: bars.map((x) => ({ ...x, volume: x.volume / 1000 })),
  volumeUnit: "LOTS",
});
assert.equal(lots.coreMetrics.volumeShares, bundle.coreMetrics.volumeShares);
assert.equal(lots.coreMetrics.volumeLots, bundle.coreMetrics.volumeLots);

await assert.rejects(
  () => buildA1HistoryPrimitiveBundle({
    ...input,
    bundleId: "A1-HIST-DUP",
    bars: [...bars, { ...bars.at(-1) }],
  }),
  /duplicate market dates/,
);

await assert.rejects(
  () => buildA1HistoryPrimitiveBundle({
    ...input,
    bundleId: "A1-HIST-FUTURE",
    bars: [...bars, {
      ...bars.at(-1),
      date: "2026-09-30",
    }],
  }),
  /future bar/,
);

await assert.rejects(
  () => buildA1HistoryPrimitiveBundle({
    ...input,
    bundleId: "A1-HIST-BAD-OHLC",
    bars: bars.map((x, i) => i === 64 ? { ...x, high: x.low - 1 } : x),
  }),
  /inconsistent OHLC/,
);

console.log("System2 A1 historical primitive engine tests passed");
