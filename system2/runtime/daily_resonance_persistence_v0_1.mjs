import { sha256Hex } from "./decision_archive.mjs";

export const DAILY_RESONANCE_PERSISTENCE_VERSION = "0.1-RESEARCH";

function assertDb(db) {
  if (!db || typeof db.prepare !== "function") throw new Error("SYSTEM2_DB binding is required");
  return db;
}

function parseJson(value, fallback = null) {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") return value;
  return JSON.parse(String(value));
}

export async function loadLatestCapacityRunForResonanceV0_1(db, marketDate, asOf) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(marketDate || ""))) {
    throw new Error("a current refresh marketDate is required");
  }
  if (!Number.isFinite(Date.parse(asOf))) throw new Error("refresh asOf is required");
  return assertDb(db).prepare(
    `SELECT capacity_run_id, market_date, decision_timestamp, active_assignments_json,
            capacity_hash, captured_at
       FROM s2_capacity_runs
      WHERE market_date = ? AND decision_timestamp <= ? AND captured_at <= ?
      ORDER BY decision_timestamp DESC, captured_at DESC
      LIMIT 1`,
  ).bind(marketDate, asOf, asOf).first();
}

export async function persistResonanceWatchPoolV0_1(db, pool) {
  assertDb(db);
  const memberships = Object.fromEntries(
    pool.symbols.map((row) => [row.symbol, row.strategyMemberships]),
  );
  await db.prepare(
    `INSERT INTO s2_resonance_watch_pools (
       pool_id, source_capacity_run_id, source_capacity_hash, source_market_date,
       source_decision_timestamp, activated_at, state, symbol_count, symbols_json,
       memberships_json, pool_hash, schema_version
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(source_capacity_run_id) DO UPDATE SET
       activated_at = excluded.activated_at,
       state = excluded.state
     WHERE s2_resonance_watch_pools.pool_hash = excluded.pool_hash`,
  ).bind(
    pool.poolId,
    pool.sourceCapacityRunId,
    pool.sourceCapacityHash,
    pool.sourceMarketDate,
    pool.sourceDecisionTimestamp,
    pool.activatedAt,
    pool.state,
    pool.symbolCount,
    JSON.stringify(pool.symbols),
    JSON.stringify(memberships),
    pool.poolHash,
    pool.schemaVersion,
  ).run();
  return pool;
}

export async function loadActiveResonanceWatchPoolV0_1(db, marketDate) {
  // The most recent earlier pool refresh is authoritative. A later empty
  // refresh invalidates an old pool; missing audit evidence fails closed.
  const audit = await assertDb(db).prepare(
    `SELECT market_date, pool_id, run_state FROM s2_resonance_runs
      WHERE market_date < ?
        AND run_state IN ('POOL_REFRESH_ACTIVE','POOL_REFRESH_ZERO_PICK_ACTIVE','POOL_REFRESH_NO_CAPACITY_RECEIPT')
      ORDER BY market_date DESC, as_of DESC LIMIT 1`,
  ).bind(marketDate).first();
  if (!audit || audit.run_state === "POOL_REFRESH_NO_CAPACITY_RECEIPT" || !audit.pool_id) return null;
  const row = await db.prepare(
    `SELECT * FROM s2_resonance_watch_pools
      WHERE pool_id = ? AND source_market_date = ?
        AND state IN ('ACTIVE', 'ZERO_PICK_ACTIVE')
      LIMIT 1`,
  ).bind(audit.pool_id, audit.market_date).first();
  if (!row) return null;
  return Object.freeze({
    schemaVersion: row.schema_version,
    poolId: row.pool_id,
    sourceCapacityRunId: row.source_capacity_run_id,
    sourceCapacityHash: row.source_capacity_hash,
    sourceMarketDate: row.source_market_date,
    sourceDecisionTimestamp: row.source_decision_timestamp,
    activatedAt: row.activated_at,
    state: row.state,
    symbolCount: Number(row.symbol_count),
    symbols: Object.freeze(parseJson(row.symbols_json, [])),
    memberships: Object.freeze(parseJson(row.memberships_json, {})),
    poolHash: row.pool_hash,
    mode: "BOUNDED_PRESELECTED_ONLY",
    maxUniqueSymbols: 9,
    fullMarketScan: false,
  });
}

export async function loadResonanceSessionCacheV0_1(db, marketDate, symbol) {
  const row = await assertDb(db).prepare(
    `SELECT * FROM s2_resonance_session_cache WHERE market_date = ? AND symbol = ? LIMIT 1`,
  ).bind(marketDate, symbol).first();
  if (!row) return null;
  return Object.freeze({
    cacheId: row.cache_id,
    marketDate: row.market_date,
    symbol: row.symbol,
    sourceId: row.source_id,
    ticker: parseJson(row.ticker_json),
    history: Object.freeze({
      schemaVersion: "SYSTEM2_FUGLE_ADJUSTED_DAILY_HISTORY_V0_1",
      sourceId: row.source_id,
      symbol: row.symbol,
      marketDate: row.market_date,
      adjusted: Number(row.adjusted) === 1,
      historyHash: row.history_hash,
      firstDate: row.history_first_date,
      lastDate: row.history_last_date,
      barCount: Number(row.history_bar_count),
      bars: Object.freeze(parseJson(row.history_json, [])),
      fetchedAt: row.captured_at,
    }),
    continuityState: row.continuity_state,
    continuityReceipt: parseJson(row.continuity_receipt_json),
    capturedAt: row.captured_at,
    schemaVersion: row.schema_version,
  });
}

export async function persistResonanceSessionCacheV0_1(db, cache) {
  await assertDb(db).prepare(
    `INSERT INTO s2_resonance_session_cache (
       cache_id, market_date, symbol, source_id, ticker_json, history_json, history_hash,
       history_first_date, history_last_date, history_bar_count, adjusted, continuity_state,
       continuity_receipt_json, captured_at, schema_version
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(market_date, symbol) DO NOTHING`,
  ).bind(
    cache.cacheId,
    cache.marketDate,
    cache.symbol,
    cache.sourceId,
    JSON.stringify(cache.ticker),
    JSON.stringify(cache.history.bars),
    cache.history.historyHash,
    cache.history.firstDate,
    cache.history.lastDate,
    cache.history.barCount,
    cache.history.adjusted ? 1 : 0,
    cache.continuityReceipt.state,
    JSON.stringify(cache.continuityReceipt),
    cache.capturedAt,
    "SYSTEM2_RESONANCE_SESSION_CACHE_V0_1",
  ).run();
  return cache;
}

export async function loadLatestResonanceEpisodeV0_1(db, symbol, marketDate) {
  const row = await assertDb(db).prepare(
    `SELECT episode_json FROM s2_resonance_episodes
      WHERE symbol = ? AND market_date = ?
      ORDER BY sequence DESC LIMIT 1`,
  ).bind(symbol, marketDate).first();
  return row ? parseJson(row.episode_json) : null;
}

export async function resolveResonancePriorLifecycleStateV0_1(db, symbol) {
  const row = await assertDb(db).prepare(
    `SELECT position_id FROM s2_positions
      WHERE symbol = ?
        AND closed_at IS NULL
        AND state NOT IN ('CLOSED', 'EXITED', 'CANCELLED')
      ORDER BY opened_at DESC
      LIMIT 1`,
  ).bind(String(symbol)).first();
  return row ? "HOLD" : "WATCH";
}

export async function persistResonanceObservationV0_1({
  db,
  runId,
  poolId,
  adapter,
  snapshot,
  episodeUpdate,
  readModel,
  sourceReceipt,
} = {}) {
  assertDb(db);
  const snapshotHash = await sha256Hex({
    poolId,
    symbol: snapshot.symbol,
    marketDate: snapshot.marketDate,
    quoteObservedAt: adapter.quoteObservedAt,
    providerTimestamp: adapter.quoteProviderTimestamp,
    finality: snapshot.finality,
    lifecycleState: snapshot.lifecycleState,
    latest: snapshot.latest,
  });
  const snapshotId = `S2_RESONANCE_SNAPSHOT:${snapshotHash}`;
  const symbolModel = readModel.symbols.find((row) => row.symbol === snapshot.symbol);
  const episode = episodeUpdate.episode;
  const statements = [];

  if (episode) {
    statements.push(db.prepare(
      `INSERT INTO s2_resonance_episodes (
         episode_id, symbol, market_date, side, sequence, state, first_observed_at,
         confirmed_at, released_at, release_reason, updated_at, episode_json, schema_version
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(episode_id) DO UPDATE SET
         state = excluded.state,
         confirmed_at = excluded.confirmed_at,
         released_at = excluded.released_at,
         release_reason = excluded.release_reason,
         updated_at = excluded.updated_at,
         episode_json = excluded.episode_json
       WHERE excluded.updated_at >= s2_resonance_episodes.updated_at`,
    ).bind(
      episode.episodeId,
      episode.symbol,
      episode.marketDate,
      episode.side,
      episode.sequence,
      episode.state,
      episode.firstObservedAt,
      episode.confirmedAt,
      episode.releasedAt,
      episode.releaseReason,
      episode.updatedAt,
      JSON.stringify(episode),
      episode.schemaVersion,
    ));
  }

  for (const event of episodeUpdate.events) {
    const eventId = `S2_RESONANCE_EVENT:${await sha256Hex({
      episodeId: event.episodeId,
      type: event.type,
      at: event.at,
    })}`;
    statements.push(db.prepare(
      `INSERT OR IGNORE INTO s2_resonance_episode_events (
         event_id, episode_id, symbol, market_date, event_type, side, event_at,
         reason, event_json, schema_version
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      eventId,
      event.episodeId,
      snapshot.symbol,
      snapshot.marketDate,
      event.type,
      event.side,
      event.at,
      event.reason || null,
      JSON.stringify(event),
      "SYSTEM2_RESONANCE_EPISODE_EVENT_V0_1",
    ));
  }

  statements.push(db.prepare(
    `INSERT OR IGNORE INTO s2_resonance_snapshots (
       snapshot_id, run_id, pool_id, market_date, symbol, as_of, quote_observed_at,
       provider_timestamp, finality, lifecycle_state, display_signal, confirmation_state,
       entry_count, exit_count, monitor_eligible, source_receipt_json, snapshot_json,
       read_model_json, snapshot_hash, schema_version
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    snapshotId,
    runId,
    poolId,
    snapshot.marketDate,
    snapshot.symbol,
    snapshot.asOf,
    adapter.quoteObservedAt,
    adapter.quoteProviderTimestamp,
    snapshot.finality,
    snapshot.lifecycleState,
    snapshot.displaySignal,
    snapshot.signalConfirmationState,
    snapshot.latest?.entryCount ?? 0,
    snapshot.latest?.exitCount ?? 0,
    adapter.monitorEligible ? 1 : 0,
    JSON.stringify(sourceReceipt),
    JSON.stringify(snapshot),
    JSON.stringify(symbolModel),
    snapshotHash,
    snapshot.schemaVersion,
  ));

  statements.push(db.prepare(
    `INSERT INTO s2_resonance_latest (
       symbol, market_date, snapshot_id, pool_id, as_of, finality, lifecycle_state,
       display_signal, confirmation_state, entry_count, exit_count, episode_id,
       episode_state, read_model_json, updated_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(symbol, market_date) DO UPDATE SET
       snapshot_id = excluded.snapshot_id,
       pool_id = excluded.pool_id,
       as_of = excluded.as_of,
       finality = excluded.finality,
       lifecycle_state = excluded.lifecycle_state,
       display_signal = excluded.display_signal,
       confirmation_state = excluded.confirmation_state,
       entry_count = excluded.entry_count,
       exit_count = excluded.exit_count,
       episode_id = excluded.episode_id,
       episode_state = excluded.episode_state,
       read_model_json = excluded.read_model_json,
       updated_at = excluded.updated_at
     WHERE excluded.updated_at >= s2_resonance_latest.updated_at`,
  ).bind(
    snapshot.symbol,
    snapshot.marketDate,
    snapshotId,
    poolId,
    snapshot.asOf,
    snapshot.finality,
    snapshot.lifecycleState,
    snapshot.displaySignal,
    snapshot.signalConfirmationState,
    snapshot.latest?.entryCount ?? 0,
    snapshot.latest?.exitCount ?? 0,
    episode?.episodeId || null,
    episode?.state || null,
    JSON.stringify(symbolModel),
    snapshot.asOf,
  ));

  if (typeof db.batch === "function") await db.batch(statements);
  else for (const statement of statements) await statement.run();
  return Object.freeze({ snapshotId, snapshotHash });
}

export async function persistResonanceRunV0_1(db, receipt) {
  await assertDb(db).prepare(
    `INSERT OR IGNORE INTO s2_resonance_runs (
       run_id, market_date, as_of, pool_id, run_state, symbol_count, succeeded_count,
       blocked_count, failure_count, diagnostics_json, run_hash, schema_version
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    receipt.runId,
    receipt.marketDate,
    receipt.asOf,
    receipt.poolId || null,
    receipt.runState,
    receipt.symbolCount,
    receipt.succeededCount,
    receipt.blockedCount,
    receipt.failureCount,
    JSON.stringify(receipt.diagnostics || []),
    receipt.runHash,
    receipt.schemaVersion,
  ).run();
  return receipt;
}

export async function readLatestResonanceApiV0_1(db, { marketDate = null, symbol = null } = {}) {
  assertDb(db);
  let resolvedDate = marketDate;
  if (!resolvedDate) {
    const dateRow = await db.prepare(
      "SELECT market_date FROM s2_resonance_latest ORDER BY market_date DESC LIMIT 1",
    ).first();
    resolvedDate = dateRow?.market_date || null;
  }
  if (!resolvedDate) return Object.freeze({ marketDate: null, symbolCount: 0, symbols: [] });

  const result = symbol
    ? await db.prepare(
      `SELECT * FROM s2_resonance_latest WHERE market_date = ? AND symbol = ? ORDER BY updated_at DESC`,
    ).bind(resolvedDate, symbol).all()
    : await db.prepare(
      `SELECT * FROM s2_resonance_latest WHERE market_date = ? ORDER BY symbol`,
    ).bind(resolvedDate).all();
  const rows = Array.isArray(result?.results) ? result.results : [];
  const symbols = rows.map((row) => ({
    ...parseJson(row.read_model_json, {}),
    snapshotId: row.snapshot_id,
    poolId: row.pool_id,
    episodeId: row.episode_id,
    episodeState: row.episode_state,
    updatedAt: row.updated_at,
  }));
  return Object.freeze({
    schemaVersion: "SYSTEM2_DAILY_RESONANCE_API_V0_1",
    marketDate: resolvedDate,
    symbolCount: symbols.length,
    provisionalResonanceCount: symbols.filter((row) => row.signalConfirmationState === "PROVISIONAL").length,
    confirmedResonanceCount: symbols.filter((row) => row.signalConfirmationState === "CONFIRMED").length,
    symbols: Object.freeze(symbols),
    fullMarketScan: false,
    decisionImpact: false,
    notificationImpact: false,
    orderImpact: false,
  });
}
