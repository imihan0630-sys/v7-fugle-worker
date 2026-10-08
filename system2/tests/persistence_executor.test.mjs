import assert from "node:assert/strict";
import { buildSystem2PersistenceBatch } from "../runtime/persistence_batch.mjs";
import { executeSystem2PersistenceBatch } from "../runtime/persistence_executor.mjs";

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
  async first() {
    const table = this.sql.match(/FROM\s+(s2_[A-Za-z0-9_]+)/i)?.[1];
    if (!table) return null;
    const id = this.params[0];
    return this.db.rows.get(`${table}|${id}`) ?? null;
  }
}

class MockDb {
  constructor({ mutateInsertedRow = null } = {}) {
    this.rows = new Map();
    this.prepareCount = 0;
    this.batchCalls = 0;
    this.mutateInsertedRow = mutateInsertedRow;
  }
  prepare(sql) {
    this.prepareCount += 1;
    return new MockStatement(this, sql);
  }
  async batch(statements) {
    this.batchCalls += 1;
    const out = [];
    for (const statement of statements) {
      const match = statement.sql.match(
        /^INSERT INTO\s+(s2_[A-Za-z0-9_]+)\s*\(([^)]+)\)/i,
      );
      if (!match) throw new Error("unexpected insert SQL");
      const table = match[1];
      const columns = match[2].split(",").map((x) => x.trim());
      const row = Object.fromEntries(
        columns.map((column, i) => [column, statement.params[i]]),
      );
      const identityColumn =
        table === "s2_decisions" ? "decision_id" :
        table === "s2_shadow_run_fingerprints" ? "fingerprint_id" :
        "receipt_id";
      const persisted = this.mutateInsertedRow
        ? this.mutateInsertedRow({ table, row: { ...row } })
        : row;
      this.rows.set(`${table}|${persisted[identityColumn]}`, persisted);
      out.push({ success: true, meta: { changes: 1 } });
    }
    return out;
  }
}

const sourceRow = {
  receipt_id: "SS1",
  market_date: "2026-09-27",
  decision_timestamp: "2026-09-27T07:30:00Z",
  source_session_state: "SOURCE_SESSION_READY",
};

const batch = await buildSystem2PersistenceBatch({
  batchId: "B1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  records: [{ table: "s2_source_session_receipts", row: sourceRow }],
  createdAt: "2026-09-27T07:31:00Z",
});

const db = new MockDb();
const first = await executeSystem2PersistenceBatch({ db, batch });
assert.equal(first.insertedCount, 1);
assert.equal(first.skippedIdenticalCount, 0);
assert.equal(first.statementLedger.insertStatementCount, 1);
assert.equal(first.statementLedger.postWriteReadbackCount, 1);
assert.equal(first.statementLedger.verifiedInsertedRowCount, 1);
assert.deepEqual(first.statementLedger.executedMutationKinds, ["INSERT"]);
assert.equal(first.statementLedger.transportReportedChanges, 1);
assert.equal(first.outcomes[0].identityDigest, batch.operations[0].identityDigest);

const second = await executeSystem2PersistenceBatch({ db, batch });
assert.equal(second.insertedCount, 0);
assert.equal(second.skippedIdenticalCount, 1);

db.rows.set("s2_source_session_receipts|SS1", {
  ...sourceRow,
  source_session_state: "SOURCE_SESSION_INCOMPLETE",
});

await assert.rejects(
  () => executeSystem2PersistenceBatch({ db, batch }),
  /IMMUTABLE_CONFLICT/,
);

await assert.rejects(
  () => executeSystem2PersistenceBatch({ db: new MockDb(), batch, bindingName: "WRONG_DB" }),
  /refusing non-isolated binding name/,
);

const tamperedSql = JSON.parse(JSON.stringify(batch));
tamperedSql.operations[0].sql.insertSql =
  "UPDATE s2_decisions SET symbol = '9999' WHERE decision_id = 'FOREIGN'";
tamperedSql.operations[0].sql.insertParams = [];
const sqlDb = new MockDb();
await assert.rejects(
  () => executeSystem2PersistenceBatch({ db: sqlDb, batch: tamperedSql }),
  /PERSISTENCE_SQL_PLAN_MISMATCH|PERSISTENCE_BATCH_CANONICAL_MISMATCH/,
);
assert.equal(sqlDb.prepareCount, 0);
assert.equal(sqlDb.batchCalls, 0);

const tamperedBatchHash = JSON.parse(JSON.stringify(batch));
tamperedBatchHash.batchHash = "0".repeat(64);
const hashDb = new MockDb();
await assert.rejects(
  () => executeSystem2PersistenceBatch({ db: hashDb, batch: tamperedBatchHash }),
  /PERSISTENCE_BATCH_HASH_MISMATCH/,
);
assert.equal(hashDb.prepareCount, 0);
assert.equal(hashDb.batchCalls, 0);

const tamperedRowDigest = JSON.parse(JSON.stringify(batch));
tamperedRowDigest.operations[0].rowDigest = "1".repeat(64);
const rowDigestDb = new MockDb();
await assert.rejects(
  () => executeSystem2PersistenceBatch({ db: rowDigestDb, batch: tamperedRowDigest }),
  /PERSISTENCE_ROW_DIGEST_MISMATCH|PERSISTENCE_BATCH_CANONICAL_MISMATCH/,
);
assert.equal(rowDigestDb.prepareCount, 0);
assert.equal(rowDigestDb.batchCalls, 0);

const tamperedIdentity = JSON.parse(JSON.stringify(batch));
tamperedIdentity.operations[0].identity.receipt_id = "FOREIGN";
tamperedIdentity.operations[0].identityKey =
  's2_source_session_receipts|{"receipt_id":"FOREIGN"}';
const identityDb = new MockDb();
await assert.rejects(
  () => executeSystem2PersistenceBatch({ db: identityDb, batch: tamperedIdentity }),
  /PERSISTENCE_IDENTITY|PERSISTENCE_BATCH_CANONICAL_MISMATCH/,
);
assert.equal(identityDb.prepareCount, 0);
assert.equal(identityDb.batchCalls, 0);

const tamperedTable = JSON.parse(JSON.stringify(batch));
tamperedTable.operations[0].table = "s2_decisions";
const tableDb = new MockDb();
await assert.rejects(
  () => executeSystem2PersistenceBatch({ db: tableDb, batch: tamperedTable }),
  /column is not whitelisted|PERSISTENCE_/,
);
assert.equal(tableDb.prepareCount, 0);
assert.equal(tableDb.batchCalls, 0);

const tamperedColumn = JSON.parse(JSON.stringify(batch));
tamperedColumn.operations[0].row.unapproved_column = "NOPE";
const columnDb = new MockDb();
await assert.rejects(
  () => executeSystem2PersistenceBatch({ db: columnDb, batch: tamperedColumn }),
  /column is not whitelisted/,
);
assert.equal(columnDb.prepareCount, 0);
assert.equal(columnDb.batchCalls, 0);

const concurrentDb = new MockDb({
  mutateInsertedRow: ({ table, row }) =>
    table === "s2_source_session_receipts"
      ? { ...row, source_session_state: "SOURCE_SESSION_INCOMPLETE" }
      : row,
});
await assert.rejects(
  () => executeSystem2PersistenceBatch({ db: concurrentDb, batch }),
  /POST_WRITE_VERIFICATION_FAILED/,
);
assert.equal(concurrentDb.batchCalls, 1);

console.log("System2 persistence executor tests passed");
