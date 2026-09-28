import assert from "node:assert/strict";
import {
  CORE_HISTORY_START_DATE,
  buildHistoricalStoreIngestBatch,
  toHistoricalPersistenceRecords,
} from "../runtime/historical_store_v0_1.mjs";

function row(overrides = {}) {
  return {
    market: "TWSE",
    symbol: "2330",
    companyName: "台積電",
    marketDate: "2026-09-24",
    priceSpace: "RAW",
    open: 100,
    high: 105,
    low: 99,
    close: 104,
    volumeShares: 1_500_000,
    tradeValue: 156_000_000,
    transactions: 2500,
    change: 4,
    continuityState: "CLEAR_NO_ACTION",
    observedAt: "2026-09-24T06:00:00Z",
    availableAt: "2026-09-24T05:30:00Z",
    availabilityBasis: "SESSION_CLOSE_FINALITY",
    sourceFields: { fixture: true, date: "2026-09-24", symbol: "2330" },
    ...overrides,
  };
}

const batch = await buildHistoricalStoreIngestBatch({
  batchId: "HIST-A1-20260924",
  datasetLane: "CORE_2017_PLUS",
  sourceId: "TWSE_OFFICIAL_HISTORY_FIXTURE",
  sourceName: "TWSE official historical fixture",
  sourceUrl: "https://example.invalid/twse",
  capturedAt: "2026-09-28T08:00:00Z",
  rows: [
    row(),
    row({
      market: "TPEX",
      symbol: "6488",
      companyName: "環球晶",
      marketDate: "2026-09-24",
      sourceFields: { fixture: true, date: "2026-09-24", symbol: "6488" },
    }),
    row({
      symbol: "2317",
      companyName: "鴻海",
      marketDate: "2026-09-23",
      availableAt: null,
      availabilityBasis: "UNKNOWN",
      sourceFields: { fixture: true, date: "2026-09-23", symbol: "2317" },
    }),
  ],
});

assert.equal(CORE_HISTORY_START_DATE, "2017-01-01");
assert.equal(batch.rowCount, 3);
assert.equal(batch.pitEligibleCount, 2);
assert.equal(batch.unknownAvailabilityCount, 1);
assert.equal(batch.firstMarketDate, "2026-09-23");
assert.equal(batch.lastMarketDate, "2026-09-24");
assert.equal(batch.marketCounts.TWSE, 2);
assert.equal(batch.marketCounts.TPEX, 1);
assert.equal(batch.rows[0].pitReplayEligible, false);
assert.equal(batch.rows[1].pitAvailabilityClass, "CONSERVATIVE_SESSION_FINALITY");
assert.equal(batch.immutable, true);
assert.equal(batch.replayPolicy, "AVAILABLE_AT_LTE_DECISION_AND_NO_AMBIGUOUS_REVISION");

const replay = await buildHistoricalStoreIngestBatch({
  batchId: "HIST-A1-20260924",
  datasetLane: "CORE_2017_PLUS",
  sourceId: "TWSE_OFFICIAL_HISTORY_FIXTURE",
  sourceName: "TWSE official historical fixture",
  sourceUrl: "https://example.invalid/twse",
  capturedAt: "2026-09-28T08:00:00Z",
  rows: [
    row(),
    row({
      market: "TPEX",
      symbol: "6488",
      companyName: "環球晶",
      marketDate: "2026-09-24",
      sourceFields: { fixture: true, date: "2026-09-24", symbol: "6488" },
    }),
    row({
      symbol: "2317",
      companyName: "鴻海",
      marketDate: "2026-09-23",
      availableAt: null,
      availabilityBasis: "UNKNOWN",
      sourceFields: { fixture: true, date: "2026-09-23", symbol: "2317" },
    }),
  ],
});
assert.equal(batch.batchHash, replay.batchHash);

const records = toHistoricalPersistenceRecords(batch);
assert.equal(records.length, 4);
assert.equal(records[0].table, "s2_historical_ingest_batches");
assert.equal(records[1].table, "s2_historical_a1_bars");
assert.equal(records[1].row.market_date, "2026-09-23");
assert.equal(records[1].row.pit_replay_eligible, 0);

await assert.rejects(
  () => buildHistoricalStoreIngestBatch({
    batchId: "PRE-CORE",
    sourceId: "fixture",
    sourceName: "fixture",
    capturedAt: "2026-09-28T08:00:00Z",
    rows: [row({ marketDate: "2016-12-30" })],
  }),
  /precedes dataset lane start/,
);

await assert.rejects(
  () => buildHistoricalStoreIngestBatch({
    batchId: "DUP",
    sourceId: "fixture",
    sourceName: "fixture",
    capturedAt: "2026-09-28T08:00:00Z",
    rows: [row(), row()],
  }),
  /duplicate canonical history row/,
);

await assert.rejects(
  () => buildHistoricalStoreIngestBatch({
    batchId: "BAD-OHLC",
    sourceId: "fixture",
    sourceName: "fixture",
    capturedAt: "2026-09-28T08:00:00Z",
    rows: [row({ high: 90, low: 99 })],
  }),
  /inconsistent OHLC/,
);

await assert.rejects(
  () => buildHistoricalStoreIngestBatch({
    batchId: "BAD-AVAIL",
    sourceId: "fixture",
    sourceName: "fixture",
    capturedAt: "2026-09-28T08:00:00Z",
    rows: [row({ availableAt: null, availabilityBasis: "SOURCE_TIMESTAMP" })],
  }),
  /requires availableAt/,
);

console.log("System2 historical store v0.1 tests passed");
