import assert from "node:assert/strict";
import {
  buildSystem2PersistenceBatch,
  compareExistingRow,
} from "../runtime/persistence_batch.mjs";

const sourceRow = {
  receipt_id: "SS1",
  market_date: "2026-09-27",
  decision_timestamp: "2026-09-27T07:30:00Z",
  source_session_state: "SOURCE_SESSION_READY",
};

const decisionRow = {
  decision_id: "D1",
  market_date: "2026-09-27",
  decision_timestamp: "2026-09-27T07:30:00Z",
  symbol: "2330",
};

const fingerprintRow = {
  fingerprint_id: "FP1",
  market_date: "2026-09-27",
  decision_timestamp: "2026-09-27T07:30:00Z",
  run_fingerprint_hash: "fp-hash",
};

const batch = await buildSystem2PersistenceBatch({
  batchId: "B1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  records: [
    { table: "s2_shadow_run_fingerprints", row: fingerprintRow },
    { table: "s2_decisions", row: decisionRow },
    { table: "s2_source_session_receipts", row: sourceRow },
    { table: "s2_source_session_receipts", row: sourceRow },
  ],
  createdAt: "2026-09-27T07:31:00Z",
});

assert.equal(batch.bindingName, "SYSTEM2_DB");
assert.equal(batch.operationCount, 3);
assert.deepEqual(
  batch.operations.map((x) => x.table),
  [
    "s2_source_session_receipts",
    "s2_decisions",
    "s2_shadow_run_fingerprints",
  ],
);
assert.equal(batch.operations.at(-1).table, "s2_shadow_run_fingerprints");
assert.equal(batch.outcomeRowsAllowed, false);

await assert.rejects(
  () =>
    buildSystem2PersistenceBatch({
      batchId: "BAD1",
      marketDate: "2026-09-27",
      decisionTimestamp: "2026-09-27T07:30:00Z",
      records: [{ table: "v7_live_state", row: { id: "x" } }],
      createdAt: "2026-09-27T07:31:00Z",
    }),
  /s2_ namespace/,
);

await assert.rejects(
  () =>
    buildSystem2PersistenceBatch({
      batchId: "BAD2",
      marketDate: "2026-09-27",
      decisionTimestamp: "2026-09-27T07:30:00Z",
      records: [{ table: "s2_not_whitelisted", row: { id: "x" } }],
      createdAt: "2026-09-27T07:31:00Z",
    }),
  /not whitelisted/,
);

await assert.rejects(
  () =>
    buildSystem2PersistenceBatch({
      batchId: "BAD3",
      marketDate: "2026-09-27",
      decisionTimestamp: "2026-09-27T07:30:00Z",
      records: [
        { table: "s2_source_session_receipts", row: sourceRow },
        {
          table: "s2_source_session_receipts",
          row: { ...sourceRow, source_session_state: "SOURCE_SESSION_INCOMPLETE" },
        },
      ],
      createdAt: "2026-09-27T07:31:00Z",
    }),
  /IMMUTABLE_CONFLICT/,
);

const sourceOp = batch.operations[0];
assert.deepEqual(compareExistingRow(sourceOp, sourceOp.row), {
  state: "IDENTICAL",
  insertAllowed: false,
});
assert.equal(compareExistingRow(sourceOp, null).state, "ABSENT");
assert.equal(
  compareExistingRow(sourceOp, { ...sourceOp.row, source_session_state: "SOURCE_SESSION_INCOMPLETE" }).state,
  "IMMUTABLE_CONFLICT",
);

const historicalBatch = await buildSystem2PersistenceBatch({
  batchId: "HIST-REFETCH-COMPARE",
  marketDate: "2017-01-03",
  decisionTimestamp: "2017-01-03T10:10:00Z",
  records: [{
    table: "s2_historical_a1_bars",
    row: {
      bar_id: "S2H-A1-CONTENT",
      batch_id: "INGEST-1",
      canonical_key: "TWSE|2330|2017-01-03|RAW",
      market_date: "2017-01-03",
      market: "TWSE",
      symbol: "2330",
      company_name: "台積電",
      price_space: "RAW",
      open_price: 181.5,
      high_price: 185.5,
      low_price: 181,
      close_price: 185,
      volume_shares: 32000000,
      trade_value: 5920000000,
      transactions: 12000,
      change_value: 4,
      continuity_state: "UNVERIFIED",
      source_id: "A1_TWSE_MI_INDEX_HISTORICAL_DAILY",
      source_name: "TWSE MI_INDEX daily close historical report",
      source_url: "https://www.twse.com.tw/exchangeReport/MI_INDEX",
      source_row_hash: "SRC-CONTENT",
      observed_at: "2026-09-28T12:00:00Z",
      available_at: "2017-01-03T05:30:00Z",
      availability_basis: "SESSION_CLOSE_FINALITY",
      pit_availability_class: "CONSERVATIVE_SESSION_FINALITY",
      pit_replay_eligible: 1,
      captured_at: "2026-09-28T12:00:00Z",
      bar_hash: "CONTENT-HASH",
      schema_version: "S2_HISTORICAL_A1_BAR_V0_2",
    },
  }],
  createdAt: "2026-09-28T12:00:00Z",
});
const historicalOp = historicalBatch.operations[0];
const reobservedExisting = {
  ...historicalOp.row,
  batch_id: "INGEST-OLDER",
  observed_at: "2026-09-27T12:00:00Z",
  captured_at: "2026-09-27T12:00:00Z",
};
assert.equal(
  compareExistingRow(historicalOp, reobservedExisting).state,
  "IDENTICAL",
  "re-fetch metadata must not create a false immutable conflict for content-addressed history",
);
assert.equal(
  compareExistingRow(historicalOp, { ...reobservedExisting, close_price: 999 }).state,
  "IMMUTABLE_CONFLICT",
  "actual historical content drift must still fail closed",
);

console.log("System2 persistence batch tests passed");
