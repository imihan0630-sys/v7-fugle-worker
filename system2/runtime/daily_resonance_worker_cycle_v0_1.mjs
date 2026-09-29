import { sha256Hex } from "./decision_archive.mjs";
import { normalizeFugleIntradayQuoteForDailyResonanceV0_1 } from "./fugle_resonance_quote_normalizer_v0_1.mjs";
import { buildCurrentDailyBarFromNormalizedQuoteV0_1 } from "./daily_resonance_live_adapter_v0_1.mjs";
import { buildDailyResonanceMonitorBatch } from "./daily_resonance_monitor_v0_1.mjs";
import { advanceDailyResonanceEpisodeV0_1 } from "./daily_resonance_episode_v0_1.mjs";
import { buildDailyResonanceReadModelV0_1 } from "./daily_resonance_read_model_v0_1.mjs";
import {
  DAILY_RESONANCE_HISTORY_SOURCE_ID,
  historyQueryRangeV0_1,
  normalizeFugleAdjustedDailyHistoryV0_1,
  resolveAdjustedHistoryContinuityV0_1,
} from "./daily_resonance_integration_v0_1.mjs";
import {
  loadResonanceSessionCacheV0_1,
  persistResonanceSessionCacheV0_1,
  loadLatestResonanceEpisodeV0_1,
  resolveResonancePriorLifecycleStateV0_1,
  persistResonanceObservationV0_1,
  persistResonanceRunV0_1,
} from "./daily_resonance_persistence_v0_1.mjs";

export const DAILY_RESONANCE_WORKER_CYCLE_VERSION = "0.1-RESEARCH";
const FUGLE_ORIGIN = "https://api.fugle.tw/marketdata/v1.0/stock";

async function fetchFugleJson(fetchImpl, apiKey, path) {
  const response = await fetchImpl(`${FUGLE_ORIGIN}${path}`, {
    headers: { "X-API-KEY": apiKey, accept: "application/json" },
    signal: AbortSignal.timeout(20_000),
  });
  const text = await response.text();
  let data = null;
  try { data = JSON.parse(text); } catch {}
  if (!response.ok || !data) {
    throw new Error(`FUGLE_HTTP_${response.status}:${String(data?.message || text).slice(0, 160)}`);
  }
  return data;
}

async function loadOrFetchSessionInputs({
  db,
  fetchImpl,
  apiKey,
  symbol,
  marketDate,
  asOf,
}) {
  const cached = await loadResonanceSessionCacheV0_1(db, marketDate, symbol);
  if (cached) return cached;

  const range = historyQueryRangeV0_1(marketDate);
  const fields = "open,high,low,close,volume";
  const [ticker, rawHistory] = await Promise.all([
    fetchFugleJson(fetchImpl, apiKey, `/intraday/ticker/${encodeURIComponent(symbol)}`),
    fetchFugleJson(
      fetchImpl,
      apiKey,
      `/historical/candles/${encodeURIComponent(symbol)}?from=${range.from}&to=${range.to}`
        + `&timeframe=D&adjusted=true&fields=${fields}&sort=asc`,
    ),
  ]);
  const history = await normalizeFugleAdjustedDailyHistoryV0_1({
    symbol,
    marketDate,
    fetchedAt: asOf,
    rawHistory,
  });
  const continuityReceipt = resolveAdjustedHistoryContinuityV0_1({ history, rawTicker: ticker });
  const cacheId = `S2_RESONANCE_CACHE:${marketDate}:${symbol}:${history.historyHash}`;
  const cache = Object.freeze({
    cacheId,
    marketDate,
    symbol,
    sourceId: DAILY_RESONANCE_HISTORY_SOURCE_ID,
    ticker,
    history,
    continuityReceipt,
    capturedAt: asOf,
  });
  await persistResonanceSessionCacheV0_1(db, cache);
  return cache;
}

function safeError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/[A-Za-z0-9_-]{24,}/g, "<redacted>").slice(0, 300);
}

export async function runBoundedDailyResonanceWorkerCycleV0_1({
  db,
  pool,
  marketDate,
  asOf,
  officialSessionCloseConfirmed,
  fugleApiKey,
  fetchImpl = fetch,
} = {}) {
  if (!db || typeof db.prepare !== "function") throw new Error("SYSTEM2_DB is required");
  if (!pool || pool.mode !== "BOUNDED_PRESELECTED_ONLY") throw new Error("bounded watch pool is required");
  if (!Array.isArray(pool.symbols) || pool.symbols.length > 9) {
    throw new Error("bounded watch pool must contain at most 9 symbols");
  }
  if (typeof fugleApiKey !== "string" || !fugleApiKey) throw new Error("FUGLE_API_KEY is required");
  const runId = `S2_RESONANCE_RUN:${marketDate}:${asOf}`;
  const diagnostics = [];
  let succeededCount = 0;
  let blockedCount = 0;
  let failureCount = 0;

  for (const item of pool.symbols) {
    const symbol = String(item.symbol);
    try {
      const cache = await loadOrFetchSessionInputs({
        db,
        fetchImpl,
        apiKey: fugleApiKey,
        symbol,
        marketDate,
        asOf,
      });
      const rawQuote = await fetchFugleJson(
        fetchImpl,
        fugleApiKey,
        `/intraday/quote/${encodeURIComponent(symbol)}`,
      );
      const normalized = normalizeFugleIntradayQuoteForDailyResonanceV0_1({
        symbol,
        marketDate,
        fetchedAt: asOf,
        rawQuote,
        rawTicker: cache.ticker,
      });
      const adapter = buildCurrentDailyBarFromNormalizedQuoteV0_1({
        symbol,
        marketDate,
        asOf,
        quote: normalized.normalizedQuote,
        continuityState: cache.continuityReceipt.state,
        sourceId: normalized.sourceId,
        sourceName: normalized.sourceName,
        officialSessionCloseConfirmed,
      });
      const priorLifecycleState = await resolveResonancePriorLifecycleStateV0_1(db, symbol);

      const monitorBatch = buildDailyResonanceMonitorBatch({
        marketDate,
        asOf,
        items: [{
          symbol,
          historyBars: cache.history.bars,
          currentDailyBar: adapter.monitorEligible ? adapter.currentDailyBar : null,
          currentDailyBarState: adapter.monitorEligible ? adapter.currentDailyBarState : null,
          continuityState: adapter.monitorEligible ? adapter.continuityState : "UNVERIFIED",
          poolIds: item.poolIds || [],
          strategyMemberships: (item.strategyMemberships || []).map((row) => row.strategyId || row),
          priorLifecycleState,
          intraday15mContext: null,
        }],
      });
      const snapshot = monitorBatch.snapshots[0];
      const previousEpisode = await loadLatestResonanceEpisodeV0_1(db, symbol, marketDate);
      const episodeUpdate = advanceDailyResonanceEpisodeV0_1({
        symbol,
        marketDate,
        asOf,
        snapshot,
        previousEpisode,
        priorSequence: Number(previousEpisode?.sequence || 0),
      });
      const readModel = buildDailyResonanceReadModelV0_1({
        monitorBatch,
        liveAdapterBatch: {
          schemaVersion: "SYSTEM2_DAILY_RESONANCE_LIVE_ADAPTER_BATCH_V0_1",
          outputs: [adapter],
        },
        episodeUpdates: [episodeUpdate],
        includeCharts: snapshot.series.length === snapshot.bars.length,
      });
      await persistResonanceObservationV0_1({
        db,
        runId,
        poolId: pool.poolId,
        adapter,
        snapshot,
        episodeUpdate,
        readModel,
        sourceReceipt: {
          normalizerVersion: normalized.normalizerVersion,
          sourceId: normalized.sourceId,
          semanticVerified: normalized.semanticVerified,
          semanticBlockers: normalized.semanticBlockers,
          volumeUnitCheck: normalized.volumeUnitCheck,
          continuityReceipt: cache.continuityReceipt,
        },
      });
      if (adapter.monitorEligible) succeededCount += 1;
      else blockedCount += 1;
      diagnostics.push(Object.freeze({
        symbol,
        state: adapter.monitorEligible ? "PERSISTED" : "BLOCKED_PERSISTED",
        blockers: adapter.blockers,
        lifecycleState: snapshot.lifecycleState,
        displaySignal: snapshot.displaySignal,
        confirmationState: snapshot.signalConfirmationState,
        priorLifecycleState,
        episodeEvents: episodeUpdate.events.map((event) => event.type),
      }));
    } catch (error) {
      failureCount += 1;
      diagnostics.push(Object.freeze({ symbol, state: "FAILED", error: safeError(error) }));
    }
  }

  const runBase = {
    runId,
    marketDate,
    asOf,
    poolId: pool.poolId,
    symbolCount: pool.symbols.length,
    succeededCount,
    blockedCount,
    failureCount,
    diagnostics,
    fullMarketScan: false,
    decisionImpact: false,
    notificationImpact: false,
    orderImpact: false,
  };
  const runHash = await sha256Hex(runBase);
  const receipt = Object.freeze({
    ...runBase,
    runState: failureCount === 0 ? "COMPLETE" : succeededCount + blockedCount > 0 ? "PARTIAL" : "FAILED",
    runHash,
    schemaVersion: "SYSTEM2_DAILY_RESONANCE_RUN_V0_1",
  });
  await persistResonanceRunV0_1(db, receipt);
  return receipt;
}
