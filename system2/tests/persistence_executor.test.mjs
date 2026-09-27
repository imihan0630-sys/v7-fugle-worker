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
  constructor() {
    this.rows = new Map();
  }
  prepare(sql) {
    return new MockStatement(this, sql);
  }
  async batch(statements) {
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
      this.rows.set(`${table}|${row[identityColumn]}`, row);
      out.push({ success: true });
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

console.log("System2 persistence executor tests passed");
