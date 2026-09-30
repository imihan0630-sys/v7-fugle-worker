import assert from "node:assert/strict";
import {
  buildOutcomePersistenceBatchV0_1,
  executeOutcomePersistenceBatchV0_1,
} from "../runtime/outcome_persistence_v0_1.mjs";
import {
  buildDecisionOutcomeSnapshotV0_1,
  toS2OutcomeRowV0_1,
} from "../runtime/outcome_tracker_v0_1.mjs";

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
    const match = this.sql.match(/FROM\s+(s2_[A-Za-z0-9_]+)\s+WHERE\s+([A-Za-z0-9_]+)\s*=\s*\?/i);
    if (!match) return null;
    return this.db.rows.get(`${match[1]}|${this.params[0]}`) ?? null;
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
    const results = [];
    for (const statement of statements) {
      const insert = statement.sql.match(/^INSERT INTO\s+(s2_[A-Za-z0-9_]+)\s*\(([^)]+)\)/i);
      if (insert) {
        const table = insert[1];
        const columns = insert[2].split(",").map((x) => x.trim());
        const row = Object.fromEntries(columns.map((column, i) => [column, statement.params[i]]));
        const identityColumn = table === "s2_sim_orders"
          ? "sim_order_id"
          : table === "s2_sim_fills"
            ? "sim_fill_id"
            : "decision_id";
        const key = `${table}|${row[identityColumn]}`;
        if (this.rows.has(key)) return [{ success: false }];
        this.rows.set(key, row);
        results.push({ success: true, meta: { changes: 1 } });
        continue;
      }

      const update = statement.sql.match(/^UPDATE\s+s2_outcomes\s+SET\s+(.+)\s+WHERE\s+decision_id\s*=\s*\?\s+AND\s+updated_at\s*=\s*\?/i);
      if (!update) throw new Error(`unexpected SQL: ${statement.sql}`);
      const assignments = update[1].split(",").map((x) => x.trim().split(/\s*=\s*/)[0]);
      const decisionId = statement.params[assignments.length];
      const expectedUpdatedAt = statement.params[assignments.length + 1];
      const key = `s2_outcomes|${decisionId}`;
      const prior = this.rows.get(key);
      if (!prior || prior.updated_at !== expectedUpdatedAt) {
        results.push({ success: true, meta: { changes: 0 } });
        continue;
      }
      const next = {
        ...prior,
        ...Object.fromEntries(assignments.map((column, i) => [column, statement.params[i]])),
      };
      this.rows.set(key, next);
      results.push({ success: true, meta: { changes: 1 } });
    }
    return results;
  }
}

const decisionBase = {
  decisionId: "D-PERSIST-2330",
  symbol: "2330",
  decisionMarketDate: "2026-09-29",
  decisionTimestamp: "2026-09-29T07:30:00Z",
  referencePrice: 100,
  entryPlan: { stopPrice: 95, targets: [108] },
  benchmarkReferenceClose: null,
  industryReferenceClose: null,
  costScenarios: [],
  priceSpace: "ADJUSTED",
  corporateActionState: "ADJUSTED",
};

function session(sessionNumber, marketDate, close) {
  return {
    sessionNumber,
    marketDate,
    availableAt: `${marketDate}T08:30:00Z`,
    priceSpace: "ADJUSTED",
    open: close - 1,
    high: close + 2,
    low: close - 2,
    close,
  };
}

const day1 = await buildDecisionOutcomeSnapshotV0_1({
  ...decisionBase,
  sessions: [session(1, "2026-09-30", 102)],
  updatedAt: "2026-09-30T09:00:00Z",
});
const day3 = await buildDecisionOutcomeSnapshotV0_1({
  ...decisionBase,
  sessions: [
    session(1, "2026-09-30", 102),
    session(2, "2026-10-01", 104),
    session(3, "2026-10-02", 106),
  ],
  updatedAt: "2026-10-02T09:00:00Z",
});

const orderRow = {
  sim_order_id: "SO-PERSIST-2330",
  decision_id: decisionBase.decisionId,
  side: "BUY",
  order_type: "BUY_STOP",
  trigger_rule_version: "S2_TW_DAILY_EXECUTION_SIMULATOR_V0_1",
  order_json: "{}",
  created_at: decisionBase.decisionTimestamp,
  status: "SIMULATION_ORDER_FROZEN",
};
const fillRow = {
  sim_fill_id: "SF-PERSIST-2330",
  sim_order_id: orderRow.sim_order_id,
  fill_timestamp: "2026-09-30T01:00:00Z",
  raw_fill_price: 101,
  slippage: 10,
  commission: 100,
  transaction_tax: 0,
  all_in_price: 101.1,
  shares: 1000,
  fill_quality: "FILLED_WITH_SLIPPAGE",
  ambiguity_reason: null,
  feasibility_flags_json: "[]",
  fill_json: "{}",
};

const batch1 = await buildOutcomePersistenceBatchV0_1({
  batchId: "OPB-D1",
  marketDate: decisionBase.decisionMarketDate,
  decisionTimestamp: decisionBase.decisionTimestamp,
  simulationOrderRows: [orderRow],
  simulationFillRows: [fillRow],
  outcomeRow: toS2OutcomeRowV0_1(day1),
  createdAt: "2026-09-30T09:01:00Z",
});
assert.equal(batch1.operationCount, 3);
assert.equal(batch1.mutableTable, "s2_outcomes");
assert.match(batch1.batchHash, /^[0-9a-f]{64}$/);

const db = new MockDb();
const first = await executeOutcomePersistenceBatchV0_1({ db, batch: batch1 });
assert.equal(first.insertedCount, 3);
assert.equal(first.updatedCount, 0);

const replay = await executeOutcomePersistenceBatchV0_1({ db, batch: batch1 });
assert.equal(replay.insertedCount, 0);
assert.equal(replay.skippedIdenticalCount, 3);

const batch3 = await buildOutcomePersistenceBatchV0_1({
  batchId: "OPB-D3",
  marketDate: decisionBase.decisionMarketDate,
  decisionTimestamp: decisionBase.decisionTimestamp,
  simulationOrderRows: [orderRow],
  simulationFillRows: [fillRow],
  outcomeRow: toS2OutcomeRowV0_1(day3),
  createdAt: "2026-10-02T09:01:00Z",
});
const updated = await executeOutcomePersistenceBatchV0_1({ db, batch: batch3 });
assert.equal(updated.updatedCount, 1);
assert.equal(updated.skippedIdenticalCount, 2);
assert.ok(Math.abs(db.rows.get("s2_outcomes|D-PERSIST-2330").d3_return - 0.06) < 1e-12);

const changedDay1 = {
  ...toS2OutcomeRowV0_1(day3),
  d1_return: 0.5,
  updated_at: "2026-10-03T09:00:00Z",
};
const conflictBatch = await buildOutcomePersistenceBatchV0_1({
  batchId: "OPB-CONFLICT",
  marketDate: decisionBase.decisionMarketDate,
  decisionTimestamp: decisionBase.decisionTimestamp,
  outcomeRow: changedDay1,
  createdAt: "2026-10-03T09:01:00Z",
});
await assert.rejects(
  () => executeOutcomePersistenceBatchV0_1({ db, batch: conflictBatch }),
  /OUTCOME_REVISION_CONFLICT:IMMUTABLE_HORIZON_REVISION:d1_return/,
);

const immutableConflict = await buildOutcomePersistenceBatchV0_1({
  batchId: "OPB-IMMUTABLE-CONFLICT",
  marketDate: decisionBase.decisionMarketDate,
  decisionTimestamp: decisionBase.decisionTimestamp,
  simulationOrderRows: [{ ...orderRow, status: "CLOSED" }],
  outcomeRow: toS2OutcomeRowV0_1(day3),
  createdAt: "2026-10-03T09:01:00Z",
});
await assert.rejects(
  () => executeOutcomePersistenceBatchV0_1({ db, batch: immutableConflict }),
  /IMMUTABLE_CONFLICT existing row/,
);

await assert.rejects(
  () => executeOutcomePersistenceBatchV0_1({ db, batch: batch3, bindingName: "WRONG_DB" }),
  /refusing non-isolated binding name/,
);

await assert.rejects(
  () => buildOutcomePersistenceBatchV0_1({
    batchId: "OPB-DUPLICATE-OUTCOME",
    marketDate: decisionBase.decisionMarketDate,
    decisionTimestamp: decisionBase.decisionTimestamp,
    outcomeRows: [toS2OutcomeRowV0_1(day3), toS2OutcomeRowV0_1(day3)],
    createdAt: "2026-10-03T09:01:00Z",
  }),
  /duplicate persistence identity/,
);

console.log("System2 outcome persistence V0.1 tests passed");
