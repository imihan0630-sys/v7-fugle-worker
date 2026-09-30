import assert from "node:assert/strict";
import { buildHistoricalStoreIngestBatch } from "../runtime/historical_store_v0_1.mjs";
import { executeHistoricalIngestBatchBulkV0_1 } from "../runtime/historical_bulk_persistence_v0_1.mjs";

class MockStatement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
    this.params = [];
  }
  bind(...params) {
    this.params = params;
    return this;
  }
  async all() {
    if (!/FROM\s+s2_historical_a1_bars/i.test(this.sql)) return { results: [] };
    return {
      results: this.params
        .map((id) => this.db.rows.get("s2_historical_a1_bars|" + id))
        .filter(Boolean),
    };
  }
  async first() {
    const table = this.sql.match(/FROM\s+(s2_[A-Za-z0-9_]+)/i)?.[1];
    if (!table) return null;
    const id = this.params[0];
    const keyColumn = table === "s2_historical_ingest_batches" ? "batch_id" : "bar_id";
    return this.db.rows.get(table + "|" + id) || null;
  }
}

class MockDb {
  constructor() {
    this.rows = new Map();
    this.insertOrder = [];
  }
  prepare(sql) {
    return new MockStatement(this, sql);
  }
  async batch(statements) {
    const out = [];
    for (const statement of statements) {
      const match = statement.sql.match(/^INSERT INTO\s+(s2_[A-Za-z0-9_]+)\s*\(([^)]+)\)/i);
      if (!match) throw new Error("unexpected insert SQL");
      const table = match[1];
      const columns = match[2].split(",").map((x) => x.trim());
      const row = Object.fromEntries(columns.map((column, i) => [column, statement.params[i]]));
      const id = table === "s2_historical_ingest_batches" ? row.batch_id : row.bar_id;
      this.rows.set(table + "|" + id, row);
      this.insertOrder.push(table + "|" + id);
      out.push({ success: true });
    }
    return out;
  }
}

function histRow(symbol, close) {
  return {
    market: "TWSE",
    symbol,
    companyName: "C" + symbol,
    marketDate: "2017-01-03",
    priceSpace: "RAW",
    open: close - 1,
    high: close + 2,
    low: close - 2,
    close,
    volumeShares: 1000000,
    tradeValue: 1000000 * close,
    transactions: 1000,
    change: 1,
    continuityState: "UNVERIFIED",
    observedAt: "2026-09-28T12:00:00Z",
    availableAt: "2017-01-03T05:30:00Z",
    availabilityBasis: "SESSION_CLOSE_FINALITY",
    sourceFields: { symbol, close },
  };
}

const ingest = await buildHistoricalStoreIngestBatch({
  batchId: "TWSE|2017-01-03|SMOKE",
  datasetLane: "CORE_2017_PLUS",
  sourceId: "A1_TWSE_MI_INDEX_HISTORICAL_DAILY",
  sourceName: "TWSE historical fixture",
  capturedAt: "2026-09-28T12:00:00Z",
  rows: [
    histRow("2330", 185),
    histRow("2317", 80),
    histRow("2454", 250),
  ],
});

const db = new MockDb();
const first = await executeHistoricalIngestBatchBulkV0_1({
  db,
  ingestBatch: ingest,
  lookupChunkSize: 2,
  insertChunkSize: 2,
});
assert.equal(first.insertedBarCount, 3);
assert.equal(first.identicalBarCount, 0);
assert.equal(first.allBarsAccounted, true);
assert.equal(first.completionReceiptWrittenLast, true);
assert.equal(db.insertOrder.at(-1), "s2_historical_ingest_batches|TWSE|2017-01-03|SMOKE");

const reobserved = await buildHistoricalStoreIngestBatch({
  batchId: "TWSE|2017-01-03|SMOKE-REOBSERVED",
  datasetLane: "CORE_2017_PLUS",
  sourceId: "A1_TWSE_MI_INDEX_HISTORICAL_DAILY",
  sourceName: "TWSE historical fixture",
  capturedAt: "2026-10-01T12:00:00Z",
  rows: [
    histRow("2330", 185),
    histRow("2317", 80),
    histRow("2454", 250),
  ].map((x) => ({ ...x, observedAt: "2026-10-01T11:00:00Z" })),
});

const second = await executeHistoricalIngestBatchBulkV0_1({
  db,
  ingestBatch: reobserved,
  lookupChunkSize: 2,
  insertChunkSize: 2,
});
assert.equal(second.insertedBarCount, 0);
assert.equal(second.identicalBarCount, 3);
assert.equal(second.allBarsAccounted, true);
assert.equal(second.completionReceiptInsertedCount, 1);

const changed = await buildHistoricalStoreIngestBatch({
  batchId: "TWSE|2017-01-03|CHANGED",
  datasetLane: "CORE_2017_PLUS",
  sourceId: "A1_TWSE_MI_INDEX_HISTORICAL_DAILY",
  sourceName: "TWSE historical fixture",
  capturedAt: "2026-10-02T12:00:00Z",
  rows: [histRow("2330", 186)],
});
const changedResult = await executeHistoricalIngestBatchBulkV0_1({
  db,
  ingestBatch: changed,
});
assert.equal(changedResult.insertedBarCount, 1);
assert.equal(changedResult.allBarsAccounted, true);

console.log("System2 historical bulk persistence v0.1 tests passed");
