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

console.log("System2 persistence batch tests passed");
