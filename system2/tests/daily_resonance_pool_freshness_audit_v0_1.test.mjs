import assert from "node:assert/strict";
import {
  loadLatestCapacityRunForResonanceV0_1,
  loadActiveResonanceWatchPoolV0_1,
} from "../runtime/daily_resonance_persistence_v0_1.mjs";
import {
  persistResonancePoolRefreshAuditV0_1,
  readResonanceOperationsV0_1,
} from "../runtime/daily_resonance_operations_v0_1.mjs";

function fixtureDb({ capacities = [], pools = [], audits = [], monitors = [] } = {}) {
  const state = { capacities, pools, audits, monitors };
  function query(sql, args) {
    if (sql.includes("INSERT OR IGNORE INTO s2_resonance_runs")) {
      return {
        run: async () => {
          const [run_id, market_date, as_of, pool_id, run_state, symbol_count,
            succeeded_count, blocked_count, failure_count, diagnostics_json,
            run_hash, schema_version] = args;
          if (!state.audits.some(row => row.run_id === run_id)) {
            state.audits.push({ run_id, market_date, as_of, pool_id, run_state,
              symbol_count, succeeded_count, blocked_count, failure_count,
              diagnostics_json, run_hash, schema_version });
          }
          return { meta: { changes: 1 } };
        },
      };
    }
    if (sql.includes("FROM s2_capacity_runs")) {
      const current = sql.includes("WHERE market_date =")
        ? state.capacities.filter(row => row.market_date === args[0]
          && row.decision_timestamp <= args[1] && row.captured_at <= args[2])
        : state.capacities;
      return { first: async () => [...current].sort((a, b) =>
        b.market_date.localeCompare(a.market_date)
        || b.decision_timestamp.localeCompare(a.decision_timestamp))[0] || null };
    }
    if (sql.includes("FROM s2_resonance_watch_pools")) {
      const current = sql.includes("WHERE pool_id =")
        ? state.pools.filter(row => row.pool_id === args[0] && row.source_market_date === args[1])
        : state.pools;
      return { first: async () => [...current].sort((a, b) =>
        b.activated_at.localeCompare(a.activated_at))[0] || null };
    }
    if (sql.includes("FROM s2_resonance_runs")) {
      let rows;
      if (sql.includes("run_state NOT IN")) rows = state.monitors;
      else if (sql.includes("market_date <")) rows = state.audits
        .filter(row => row.market_date < args[0]);
      else rows = state.audits;
      return { first: async () => [...rows].sort((a, b) =>
        b.market_date.localeCompare(a.market_date) || b.as_of.localeCompare(a.as_of))[0] || null };
    }
    throw new Error("unexpected test SQL: " + sql);
  }
  return {
    state,
    prepare(sql) {
      return {
        bind(...args) { return query(sql, args); },
        first() { return query(sql, []).first(); },
      };
    },
  };
}

const validCapacity = {
  capacity_run_id: "CAP-OCT-01", market_date: "2026-10-01",
  decision_timestamp: "2026-10-01T10:00:00.000Z",
  captured_at: "2026-10-01T10:15:00.000Z",
};
const staleCapacity = { ...validCapacity, capacity_run_id: "CAP-SEP-30",
  market_date: "2026-09-30",
  decision_timestamp: "2026-09-30T10:00:00.000Z",
  captured_at: "2026-09-30T10:15:00.000Z" };
const futureCaptured = { ...validCapacity, capacity_run_id: "CAP-FUTURE",
  captured_at: "2026-10-01T12:00:00.000Z" };
const capacityDb = fixtureDb({ capacities: [staleCapacity, validCapacity, futureCaptured] });
assert.equal((await loadLatestCapacityRunForResonanceV0_1(
  capacityDb, "2026-10-01", "2026-10-01T11:00:00.000Z",
)).capacity_run_id, "CAP-OCT-01");
assert.equal(await loadLatestCapacityRunForResonanceV0_1(
  capacityDb, "2026-10-02", "2026-10-02T11:00:00.000Z",
), null, "stale older capacity cannot be reused");
assert.equal(await loadLatestCapacityRunForResonanceV0_1(
  capacityDb, "2026-10-01", "2026-10-01T09:00:00.000Z",
), null, "capacity unknown at decision clock cannot be used");
await assert.rejects(() => loadLatestCapacityRunForResonanceV0_1(
  capacityDb, "tomorrow", "2026-10-02T11:00:00.000Z",
), /marketDate/);

const oldPool = {
  pool_id: "POOL-SEP-30",
  source_market_date: "2026-09-30",
  activated_at: "2026-09-30T11:00:00.000Z",
  source_capacity_run_id: "CAP-SEP-30",
  source_capacity_hash: "hash-old",
  source_decision_timestamp: "2026-09-30T10:00:00.000Z",
  state: "ACTIVE", symbol_count: 1,
  symbols_json: '[{"symbol":"2330"}]', memberships_json: "{}",
  schema_version: "SYSTEM2_RESONANCE_WATCH_POOL_V0_1", pool_hash: "old-hash",
};
const freshPool = {
  ...oldPool, pool_id: "POOL-OCT-01", source_market_date: "2026-10-01",
  activated_at: "2026-10-01T11:00:00.000Z",
  source_capacity_run_id: "CAP-OCT-01", source_capacity_hash: "hash-new",
  source_decision_timestamp: "2026-10-01T10:00:00.000Z",
  pool_hash: "new-hash",
};
const db = fixtureDb({ capacities: [staleCapacity, validCapacity],
  pools: [oldPool, freshPool] });
const oldAudit = await persistResonancePoolRefreshAuditV0_1({
  db, marketDate: "2026-09-30", asOf: "2026-09-30T11:00:00.000Z",
  pool: { sourceMarketDate: "2026-09-30", sourceCapacityRunId: "CAP-SEP-30",
    poolId: "POOL-SEP-30", symbolCount: 1 },
});
assert.equal(oldAudit.runState, "POOL_REFRESH_ACTIVE");
const failedRefresh = await persistResonancePoolRefreshAuditV0_1({
  db, marketDate: "2026-10-01", asOf: "2026-10-01T11:00:00.000Z",
});
assert.equal(failedRefresh.runState, "POOL_REFRESH_NO_CAPACITY_RECEIPT");
assert.equal(await loadActiveResonanceWatchPoolV0_1(db, "2026-10-02"), null,
  "latest failed refresh must invalidate older preselected pool");
assert.equal(db.state.audits.length, 2);
await persistResonancePoolRefreshAuditV0_1({
  db, marketDate: "2026-10-01", asOf: "2026-10-01T11:00:00.000Z",
});
assert.equal(db.state.audits.length, 2, "duplicate scheduled invocation must be idempotent");
const status = await readResonanceOperationsV0_1(db, { marketDate: "2026-10-02" });
assert.equal(status.state, "LATEST_POOL_REFRESH_NO_CAPACITY_RECEIPT");
assert.equal(status.upstreamCapacity.capacityRunId, "CAP-OCT-01");
assert.equal(status.lastPoolRefresh.state, "POOL_REFRESH_NO_CAPACITY_RECEIPT");
assert.equal(status.activeSymbolCount, 0);
assert.equal(status.fullMarketScan, false);
assert.equal(status.livePushEnabled, false);
assert.equal(status.orderImpact, false);

const freshDb = fixtureDb({ capacities: [validCapacity], pools: [freshPool] });
const goodAudit = await persistResonancePoolRefreshAuditV0_1({
  db: freshDb, marketDate: "2026-10-01", asOf: "2026-10-01T11:00:00.000Z",
  pool: { sourceMarketDate: "2026-10-01", sourceCapacityRunId: "CAP-OCT-01",
    poolId: "POOL-OCT-01", symbolCount: 1 },
});
assert.equal(goodAudit.runState, "POOL_REFRESH_ACTIVE");
assert.equal((await loadActiveResonanceWatchPoolV0_1(freshDb, "2026-10-02")).symbolCount, 1);
assert.equal((await readResonanceOperationsV0_1(freshDb, {
  marketDate: "2026-10-02",
})).state, "BOUNDED_POOL_READY");
const missingDb = fixtureDb();
assert.equal((await readResonanceOperationsV0_1(missingDb, {
  marketDate: "2026-10-02",
})).state, "UPSTREAM_CAPACITY_RECEIPT_MISSING");
await assert.rejects(() => persistResonancePoolRefreshAuditV0_1({
  db, marketDate: "2026-10-02", asOf: "2026-10-02T11:00:00.000Z",
  pool: { sourceMarketDate: "2026-10-01" },
}), /source market date/);

console.log("System2 resonance pool freshness and durable refresh audit tests passed");
