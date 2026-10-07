import assert from "node:assert/strict";
import { buildHistoricalStoreIngestBatch } from "../runtime/historical_store_v0_1.mjs";
import { buildPitReplayWindow } from "../runtime/pit_replay_v0_1.mjs";

function datePlus(start, days) {
  const d = new Date(start + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const rows = Array.from({ length: 70 }, (_, i) => {
  const marketDate = datePlus("2026-07-22", i);
  const close = 100 + i;
  return {
    market: "TWSE",
    symbol: "2330",
    companyName: "台積電",
    marketDate,
    priceSpace: "RAW",
    open: close - 1,
    high: close + 2,
    low: close - 2,
    close,
    volumeShares: 1_000_000 + i * 1_000,
    tradeValue: (1_000_000 + i * 1_000) * close,
    transactions: 1000 + i,
    change: 1,
    continuityState: "CLEAR_NO_ACTION",
    observedAt: marketDate + "T06:00:00Z",
    availableAt: marketDate + "T05:30:00Z",
    availabilityBasis: "SESSION_CLOSE_FINALITY",
    sourceFields: { marketDate, symbol: "2330", close },
  };
});

const batch = await buildHistoricalStoreIngestBatch({
  batchId: "PIT-WINDOW-FIXTURE",
  sourceId: "TWSE_FIXTURE",
  sourceName: "TWSE fixture",
  capturedAt: "2026-09-29T10:30:00Z",
  rows,
});

const window = await buildPitReplayWindow({
  replayId: "PIT-2330-20260929",
  symbol: "2330",
  marketDate: "2026-09-29",
  decisionTimestamp: "2026-09-29T10:10:00Z",
  lookbackSessions: 61,
  historicalBars: batch.rows,
});

assert.equal(window.state, "READY");
assert.equal(window.pointInTimeEligible, true);
assert.equal(window.selectedSessionCount, 61);
assert.equal(window.lastSelectedDate, "2026-09-29");
assert.equal(window.bars.at(-1).close, 169);
assert.equal(window.blockerCodes.length, 0);

const unavailableTargetBatch = await buildHistoricalStoreIngestBatch({
  batchId: "PIT-UNAVAILABLE-TARGET",
  sourceId: "TWSE_FIXTURE",
  sourceName: "TWSE fixture",
  capturedAt: "2026-09-29T12:30:00Z",
  rows: rows.map((x, i) => i === rows.length - 1
    ? {
        ...x,
        observedAt: "2026-09-29T12:00:00Z",
        availableAt: "2026-09-29T11:00:00Z",
        availabilityBasis: "SOURCE_TIMESTAMP",
      }
    : x),
});
const incomplete = await buildPitReplayWindow({
  replayId: "PIT-2330-LATE",
  symbol: "2330",
  marketDate: "2026-09-29",
  decisionTimestamp: "2026-09-29T10:10:00Z",
  lookbackSessions: 61,
  historicalBars: unavailableTargetBatch.rows,
});
assert.equal(incomplete.state, "INCOMPLETE");
assert.equal(incomplete.targetBarPresent, false);
assert.ok(incomplete.blockerCodes.includes("TARGET_DATE_BAR_NOT_PIT_ELIGIBLE"));
assert.equal(incomplete.excludedCounts.unavailableByDecision, 1);

const shortWindow = await buildPitReplayWindow({
  replayId: "PIT-2330-SHORT",
  symbol: "2330",
  marketDate: "2026-09-29",
  decisionTimestamp: "2026-09-29T10:10:00Z",
  lookbackSessions: 80,
  historicalBars: batch.rows,
});
assert.equal(shortWindow.state, "INCOMPLETE");
assert.ok(shortWindow.blockerCodes.includes("INSUFFICIENT_PIT_HISTORY"));

const revision = {
  ...batch.rows.at(-1),
  barHash: "different-revision-hash",
  close: 999,
};
await assert.rejects(
  () => buildPitReplayWindow({
    replayId: "PIT-2330-REVISION",
    symbol: "2330",
    marketDate: "2026-09-29",
    decisionTimestamp: "2026-09-29T10:10:00Z",
    lookbackSessions: 61,
    historicalBars: [...batch.rows, revision],
  }),
  /REVISION_AMBIGUITY/,
);

const prospectiveRevision = {
  ...batch.rows.at(-1),
  sourceId: "TWSE_FIXTURE_REVISION",
  sourceName: "TWSE fixture revised",
  barHash: "prospective-revision-hash",
  sourceRowHash: "prospective-source-revision-hash",
  close: 999,
  observedAt: "2026-10-01T00:00:00Z",
  availableAt: "2026-10-01T00:00:00Z",
  capturedAt: "2026-10-01T00:00:00Z",
  availabilityBasis: "PROSPECTIVE_OBSERVATION",
  pitReplayEligible: true,
};

const preRevisionWindow = await buildPitReplayWindow({
  replayId: "PIT-2330-PRE-REVISION",
  symbol: "2330",
  marketDate: "2026-09-29",
  decisionTimestamp: "2026-09-29T10:10:00Z",
  lookbackSessions: 61,
  historicalBars: [...batch.rows, prospectiveRevision],
});
assert.equal(preRevisionWindow.state, "READY");
assert.equal(preRevisionWindow.bars.at(-1).close, 169);
assert.equal(preRevisionWindow.bars.at(-1).sourceId, "TWSE_FIXTURE");
assert.equal(preRevisionWindow.bars.at(-1).sourceRowHash, batch.rows.at(-1).sourceRowHash);
assert.equal(preRevisionWindow.bars.at(-1).barHash, batch.rows.at(-1).barHash);
assert.equal(preRevisionWindow.resolvedRevisionKeyCount, 0);

const postRevisionWindow = await buildPitReplayWindow({
  replayId: "PIT-2330-POST-REVISION",
  symbol: "2330",
  marketDate: "2026-09-29",
  decisionTimestamp: "2026-10-01T00:00:00Z",
  lookbackSessions: 61,
  historicalBars: [...batch.rows, prospectiveRevision],
});
assert.equal(postRevisionWindow.state, "READY");
assert.equal(postRevisionWindow.bars.at(-1).close, 999);
assert.equal(postRevisionWindow.bars.at(-1).sourceId, "TWSE_FIXTURE_REVISION");
assert.equal(postRevisionWindow.bars.at(-1).sourceRowHash, "prospective-source-revision-hash");
assert.equal(postRevisionWindow.bars.at(-1).barHash, "prospective-revision-hash");
assert.equal(postRevisionWindow.resolvedRevisionKeyCount, 1);
assert.equal(
  postRevisionWindow.revisionPolicy,
  "LATEST_AVAILABLE_REVISION_BY_AVAILABLE_AT_FAIL_CLOSED_ON_SAME_AVAILABILITY_CONFLICT",
);

console.log("System2 PIT replay v0.1 tests passed");
