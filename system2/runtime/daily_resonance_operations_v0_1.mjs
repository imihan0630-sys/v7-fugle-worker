import { sha256Hex } from "./decision_archive.mjs";
import {
  loadActiveResonanceWatchPoolV0_1,
} from "./daily_resonance_persistence_v0_1.mjs";

export const RESONANCE_POOL_AUDIT_VERSION = "0.1-RESEARCH";

const REFRESH_STATES = Object.freeze([
  "POOL_REFRESH_ACTIVE",
  "POOL_REFRESH_ZERO_PICK_ACTIVE",
  "POOL_REFRESH_NO_CAPACITY_RECEIPT",
]);

function assertDb(db) {
  if (!db || typeof db.prepare !== "function") throw new Error("SYSTEM2_DB is required");
  return db;
}

function dateText(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("marketDate must be YYYY-MM-DD");
  }
  return value;
}

export async function persistResonancePoolRefreshAuditV0_1({
  db, marketDate, asOf, pool = null,
} = {}) {
  assertDb(db);
  const date = dateText(marketDate);
  if (!Number.isFinite(Date.parse(asOf))) throw new Error("asOf must be an ISO timestamp");
  if (pool && pool.sourceMarketDate !== date) {
    throw new Error("pool source market date does not match the refresh date");
  }
  const state = !pool ? REFRESH_STATES[2]
    : pool.symbolCount === 0 ? REFRESH_STATES[1] : REFRESH_STATES[0];
  const base = Object.freeze({
    event: "POOL_REFRESH",
    marketDate: date,
    asOf,
    state,
    poolId: pool?.poolId || null,
    sourceCapacityRunId: pool?.sourceCapacityRunId || null,
    symbolCount: pool?.symbolCount || 0,
  });
  const runHash = await sha256Hex(base);
  const receipt = Object.freeze({
    runId: `S2_RESONANCE_POOL_REFRESH:${date}:${asOf}`,
    marketDate: date,
    asOf,
    poolId: base.poolId,
    runState: state,
    symbolCount: base.symbolCount,
    succeededCount: base.symbolCount,
    blockedCount: 0,
    failureCount: 0,
    diagnostics: [{
      event: "POOL_REFRESH",
      sourceCapacityRunId: base.sourceCapacityRunId,
      sourceMarketDate: pool?.sourceMarketDate || null,
      state,
    }],
    runHash,
    schemaVersion: "SYSTEM2_RESONANCE_POOL_REFRESH_AUDIT_V0_1",
  });
  await db.prepare(
    `INSERT OR IGNORE INTO s2_resonance_runs (
       run_id, market_date, as_of, pool_id, run_state, symbol_count,
       succeeded_count, blocked_count, failure_count, diagnostics_json,
       run_hash, schema_version
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    receipt.runId, receipt.marketDate, receipt.asOf, receipt.poolId,
    receipt.runState, receipt.symbolCount, receipt.succeededCount,
    receipt.blockedCount, receipt.failureCount, JSON.stringify(receipt.diagnostics),
    receipt.runHash, receipt.schemaVersion,
  ).run();
  return receipt;
}

export async function readResonanceOperationsV0_1(db, { marketDate } = {}) {
  assertDb(db);
  const date = dateText(marketDate);
  const [capacity, latestPool, refresh, monitor, activePool] = await Promise.all([
    db.prepare(
      `SELECT capacity_run_id, market_date, decision_timestamp, captured_at
         FROM s2_capacity_runs
        ORDER BY market_date DESC, decision_timestamp DESC LIMIT 1`,
    ).first(),
    db.prepare(
      `SELECT pool_id, source_market_date, activated_at, state, symbol_count
         FROM s2_resonance_watch_pools
        ORDER BY activated_at DESC LIMIT 1`,
    ).first(),
    db.prepare(
      `SELECT run_id, market_date, as_of, pool_id, run_state, symbol_count
         FROM s2_resonance_runs
        WHERE run_state IN ('POOL_REFRESH_ACTIVE','POOL_REFRESH_ZERO_PICK_ACTIVE','POOL_REFRESH_NO_CAPACITY_RECEIPT')
        ORDER BY as_of DESC LIMIT 1`,
    ).first(),
    db.prepare(
      `SELECT run_id, market_date, as_of, run_state, symbol_count,
              succeeded_count, blocked_count, failure_count
         FROM s2_resonance_runs
        WHERE run_state NOT IN ('POOL_REFRESH_ACTIVE','POOL_REFRESH_ZERO_PICK_ACTIVE','POOL_REFRESH_NO_CAPACITY_RECEIPT')
        ORDER BY as_of DESC LIMIT 1`,
    ).first(),
    loadActiveResonanceWatchPoolV0_1(db, date),
  ]);
  const noActivePool = !activePool;
  const state = activePool
    ? activePool.symbolCount ? "BOUNDED_POOL_READY" : "ZERO_PICK_ACTIVE"
    : !capacity ? "UPSTREAM_CAPACITY_RECEIPT_MISSING"
      : !refresh ? "POOL_REFRESH_NOT_YET_OBSERVED"
        : refresh.run_state === REFRESH_STATES[2]
          ? "LATEST_POOL_REFRESH_NO_CAPACITY_RECEIPT"
          : "NO_CURRENT_ELIGIBLE_POOL";
  return Object.freeze({
    schemaVersion: "SYSTEM2_RESONANCE_OPERATIONS_API_V0_1",
    marketDate: date,
    state,
    upstreamCapacity: capacity ? {
      capacityRunId: capacity.capacity_run_id,
      marketDate: capacity.market_date,
      decisionTimestamp: capacity.decision_timestamp,
      capturedAt: capacity.captured_at,
    } : null,
    latestPool: latestPool ? {
      poolId: latestPool.pool_id,
      sourceMarketDate: latestPool.source_market_date,
      activatedAt: latestPool.activated_at,
      state: latestPool.state,
      symbolCount: Number(latestPool.symbol_count),
    } : null,
    lastPoolRefresh: refresh ? {
      runId: refresh.run_id,
      marketDate: refresh.market_date,
      asOf: refresh.as_of,
      state: refresh.run_state,
      symbolCount: Number(refresh.symbol_count),
    } : null,
    lastIntradayCycle: monitor ? {
      runId: monitor.run_id,
      marketDate: monitor.market_date,
      asOf: monitor.as_of,
      state: monitor.run_state,
      symbolCount: Number(monitor.symbol_count),
      succeededCount: Number(monitor.succeeded_count),
      blockedCount: Number(monitor.blocked_count),
      failureCount: Number(monitor.failure_count),
    } : null,
    activePoolId: activePool?.poolId || null,
    activeSymbolCount: activePool?.symbolCount || 0,
    fullMarketScan: false,
    captureEnabled: false,
    livePushEnabled: false,
    orderImpact: false,
  });
}
