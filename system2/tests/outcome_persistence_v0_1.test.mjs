import assert from "node:assert/strict";
import {
  buildOutcomePersistenceBatchV0_1,
  executeOutcomePersistenceBatchV0_1,
} from "../runtime/outcome_persistence_v0_1.mjs";
import {
  buildDecisionOutcomeSnapshotV0_1,
  toS2OutcomeVersionRowV0_2,
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
            : table === "s2_outcome_versions"
              ? "outcome_version_id"
              : "decision_id";
        const key = `${table}|${row[identityColumn]}`;
        if (this.rows.has(key)) return [{ success: false }];
        this.rows.set(key, row);
        results.push({ success: true, meta: { changes: 1 } });
        continue;
      }

      const update = statement.sql.match(/^UPDATE\s+s2_outcome_versions\s+SET\s+(.+)\s+WHERE\s+outcome_version_id\s*=\s*\?\s+AND\s+updated_at\s*=\s*\?/i);
      if (!update) throw new Error(`unexpected SQL: ${statement.sql}`);
      const assignments = update[1].split(",").map((x) => x.trim().split(/\s*=\s*/)[0]);
      const outcomeVersionId = statement.params[assignments.length];
      const expectedUpdatedAt = statement.params[assignments.length + 1];
      const key = `s2_outcome_versions|${outcomeVersionId}`;
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
  decisionHash: "a".repeat(64),
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  regimeSnapshotId: "REG-PERSIST-1",
  regimeHash: "b".repeat(64),
  corporateActionLineageHash: "c".repeat(64),
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
  order_json: JSON.stringify({
    simOrderId: "SO-PERSIST-2330",
    decisionId: decisionBase.decisionId,
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0.1-CONTRACT",
    symbol: decisionBase.symbol,
    decisionTimestamp: decisionBase.decisionTimestamp,
  }),
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
  fill_json: JSON.stringify({
    simFillId: "SF-PERSIST-2330",
    simOrderId: orderRow.sim_order_id,
  }),
};

const batch1 = await buildOutcomePersistenceBatchV0_1({
  batchId: "OPB-D1",
  marketDate: decisionBase.decisionMarketDate,
  decisionTimestamp: decisionBase.decisionTimestamp,
  simulationOrderRows: [orderRow],
  simulationFillRows: [fillRow],
  outcomeRow: toS2OutcomeVersionRowV0_2(day1),
  createdAt: "2026-09-30T09:01:00Z",
});
assert.equal(batch1.operationCount, 3);
assert.equal(batch1.mutableTable, "s2_outcome_versions");
assert.match(batch1.batchHash, /^[0-9a-f]{64}$/);

const db = new MockDb();
db.rows.set(`s2_decisions|${decisionBase.decisionId}`, {
  decision_id: decisionBase.decisionId,
  decision_hash: decisionBase.decisionHash,
  strategy_id: decisionBase.strategyId,
  strategy_version: decisionBase.strategyVersion,
  symbol: decisionBase.symbol,
  market_date: decisionBase.decisionMarketDate,
  decision_timestamp: decisionBase.decisionTimestamp,
  regime_snapshot_id: decisionBase.regimeSnapshotId,
});
db.rows.set(`s2_market_regime_snapshots|${decisionBase.regimeSnapshotId}`, {
  regime_snapshot_id: decisionBase.regimeSnapshotId,
  market_date: decisionBase.decisionMarketDate,
  decision_timestamp: decisionBase.decisionTimestamp,
  snapshot_hash: decisionBase.regimeHash,
});
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
  outcomeRow: toS2OutcomeVersionRowV0_2(day3),
  createdAt: "2026-10-02T09:01:00Z",
});
const updated = await executeOutcomePersistenceBatchV0_1({ db, batch: batch3 });
assert.equal(updated.updatedCount, 1);
assert.equal(updated.skippedIdenticalCount, 2);
assert.equal(day1.outcomeVersionId, day3.outcomeVersionId);
assert.ok(Math.abs(db.rows.get(`s2_outcome_versions|${day3.outcomeVersionId}`).d3_return - 0.06) < 1e-12);

const scalarTamper = {
  ...toS2OutcomeVersionRowV0_2(day3),
  d1_return: 0.5,
  updated_at: "2026-10-03T09:00:00Z",
};
const scalarTamperBatch = await buildOutcomePersistenceBatchV0_1({
  batchId: "OPB-SCALAR-TAMPER",
  marketDate: decisionBase.decisionMarketDate,
  decisionTimestamp: decisionBase.decisionTimestamp,
  outcomeRow: scalarTamper,
  createdAt: "2026-10-03T09:01:00Z",
});
await assert.rejects(
  () => executeOutcomePersistenceBatchV0_1({ db, batch: scalarTamperBatch }),
  /LINEAGE_MISMATCH:outcome\.row\.d1_return/,
);

// A fully recomputed snapshot with the same frozen identity but revised mature D1
// passes row/snapshot integrity, then fails the monotonic historical-revision gate.
const revisedDay3 = await buildDecisionOutcomeSnapshotV0_1({
  ...decisionBase,
  sessions: [
    session(1, "2026-09-30", 150),
    session(2, "2026-10-01", 104),
    session(3, "2026-10-02", 106),
  ],
  updatedAt: "2026-10-03T09:00:00Z",
});
assert.equal(revisedDay3.outcomeVersionId, day3.outcomeVersionId);
assert.notEqual(revisedDay3.horizonReturns.D1, day3.horizonReturns.D1);
const conflictBatch = await buildOutcomePersistenceBatchV0_1({
  batchId: "OPB-MATURE-HORIZON-REVISION",
  marketDate: decisionBase.decisionMarketDate,
  decisionTimestamp: decisionBase.decisionTimestamp,
  outcomeRow: toS2OutcomeVersionRowV0_2(revisedDay3),
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
  outcomeRow: toS2OutcomeVersionRowV0_2(day3),
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
    outcomeRows: [toS2OutcomeVersionRowV0_2(day3), toS2OutcomeVersionRowV0_2(day3)],
    createdAt: "2026-10-03T09:01:00Z",
  }),
  /duplicate persistence identity/,
);

const tamperedSql = JSON.parse(JSON.stringify(batch1));
tamperedSql.records[0].insert.text =
  "UPDATE s2_decisions SET symbol = '9999' WHERE decision_id = 'FOREIGN'";
const sqlDb = new MockDb();
sqlDb.rows.set(`s2_decisions|${decisionBase.decisionId}`, {
  decision_id: decisionBase.decisionId,
  decision_hash: decisionBase.decisionHash,
  strategy_id: decisionBase.strategyId,
  strategy_version: decisionBase.strategyVersion,
  symbol: decisionBase.symbol,
  market_date: decisionBase.decisionMarketDate,
  decision_timestamp: decisionBase.decisionTimestamp,
  regime_snapshot_id: decisionBase.regimeSnapshotId,
});
sqlDb.rows.set(`s2_market_regime_snapshots|${decisionBase.regimeSnapshotId}`, {
  regime_snapshot_id: decisionBase.regimeSnapshotId,
  market_date: decisionBase.decisionMarketDate,
  decision_timestamp: decisionBase.decisionTimestamp,
  snapshot_hash: decisionBase.regimeHash,
});
await assert.rejects(
  () => executeOutcomePersistenceBatchV0_1({ db: sqlDb, batch: tamperedSql }),
  /OUTCOME_SQL_PLAN_MISMATCH|OUTCOME_BATCH_CANONICAL_MISMATCH/,
);

const missingDecisionDb = new MockDb();
await assert.rejects(
  () => executeOutcomePersistenceBatchV0_1({ db: missingDecisionDb, batch: batch1 }),
  /LINEAGE_PARENT_MISSING:s2_sim_orders.decision_id/,
);

const wrongOrderBatch = await buildOutcomePersistenceBatchV0_1({
  batchId: "OPB-WRONG-ORDER-LINEAGE",
  marketDate: decisionBase.decisionMarketDate,
  decisionTimestamp: decisionBase.decisionTimestamp,
  simulationOrderRows: [{
    ...orderRow,
    order_json: JSON.stringify({
      ...JSON.parse(orderRow.order_json),
      strategyId: "SWING_GROWTH",
    }),
  }],
  outcomeRow: toS2OutcomeVersionRowV0_2(day1),
  createdAt: "2026-09-30T09:02:00Z",
});
await assert.rejects(
  () => executeOutcomePersistenceBatchV0_1({ db, batch: wrongOrderBatch }),
  /LINEAGE_MISMATCH:order-decision.strategy_id/,
);

const orphanFillBatch = await buildOutcomePersistenceBatchV0_1({
  batchId: "OPB-ORPHAN-FILL",
  marketDate: decisionBase.decisionMarketDate,
  decisionTimestamp: decisionBase.decisionTimestamp,
  simulationFillRows: [{
    ...fillRow,
    sim_fill_id: "SF-ORPHAN",
    sim_order_id: "SO-MISSING",
    fill_json: JSON.stringify({ simFillId: "SF-ORPHAN", simOrderId: "SO-MISSING" }),
  }],
  outcomeRow: toS2OutcomeVersionRowV0_2(day1),
  createdAt: "2026-09-30T09:03:00Z",
});
await assert.rejects(
  () => executeOutcomePersistenceBatchV0_1({ db, batch: orphanFillBatch }),
  /LINEAGE_PARENT_MISSING:s2_sim_fills.sim_order_id/,
);

const wrongOutcomeRow = {
  ...toS2OutcomeVersionRowV0_2(day1),
  outcome_json: JSON.stringify({
    ...day1,
    decisionId: "D-FOREIGN",
  }),
};
const wrongOutcomeBatch = await buildOutcomePersistenceBatchV0_1({
  batchId: "OPB-WRONG-OUTCOME-LINEAGE",
  marketDate: decisionBase.decisionMarketDate,
  decisionTimestamp: decisionBase.decisionTimestamp,
  outcomeRow: wrongOutcomeRow,
  createdAt: "2026-09-30T09:04:00Z",
});
await assert.rejects(
  () => executeOutcomePersistenceBatchV0_1({ db, batch: wrongOutcomeBatch }),
  /OUTCOME_SNAPSHOT_INTEGRITY:.*OUTCOME_HASH_MISMATCH/,
);


const alternateCost = await buildDecisionOutcomeSnapshotV0_1({
  ...decisionBase,
  costScenarios: [{ scenarioId: "ALT_COST", roundTripCostRate: 0.01, note: "alternate" }],
  sessions: [session(1, "2026-09-30", 102)],
  updatedAt: "2026-09-30T09:00:00Z",
});
assert.notEqual(alternateCost.outcomeVersionId, day1.outcomeVersionId);
const alternateBatch = await buildOutcomePersistenceBatchV0_1({
  batchId: "OPB-ALT-COST",
  marketDate: decisionBase.decisionMarketDate,
  decisionTimestamp: decisionBase.decisionTimestamp,
  outcomeRow: toS2OutcomeVersionRowV0_2(alternateCost),
  createdAt: "2026-09-30T09:05:00Z",
});
const alternatePersisted = await executeOutcomePersistenceBatchV0_1({ db, batch: alternateBatch });
assert.equal(alternatePersisted.insertedCount, 1);
assert.equal(alternatePersisted.updatedCount, 0);
assert.ok(db.rows.has(`s2_outcome_versions|${day1.outcomeVersionId}`));
assert.ok(db.rows.has(`s2_outcome_versions|${alternateCost.outcomeVersionId}`));

console.log("System2 outcome persistence V0.2 lineage tests passed");
