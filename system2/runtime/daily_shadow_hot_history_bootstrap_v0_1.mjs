import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { buildOfficialTradingDatesV0_1 } from "./official_historical_backfill_source_v0_1.mjs";
import { fetchOfficialHistoricalA1DateV0_1 } from "./official_historical_a1_source_v0_1.mjs";
import {
  buildHistoricalStoreIngestBatch,
  toHistoricalA1BarRows,
} from "./historical_store_v0_1.mjs";
import { executeHistoricalIngestBatchBulkV0_1 } from "./historical_bulk_persistence_v0_1.mjs";

export const DAILY_SHADOW_HOT_HISTORY_BOOTSTRAP_VERSION = "0.1-RESEARCH";
export const HOT_HISTORY_MAX_SESSIONS_PER_RUN = 3;
export const HOT_HISTORY_LOOKBACK_CALENDAR_DAYS = 140;
export const HOT_HISTORY_MAX_SOURCE_ROWS_PER_MARKET_DATE = 1500;

const MINIMUM_SYMBOLS = Object.freeze({ TWSE: 500, TPEX: 450 });
const SOURCE_IDS = Object.freeze({
  TWSE: "A1_TWSE_MI_INDEX_HOT_PROSPECTIVE_BOOTSTRAP",
  TPEX: "A1_TPEX_DAILY_QUOTES_HOT_PROSPECTIVE_BOOTSTRAP",
});
const SOURCE_NAMES = Object.freeze({
  TWSE: "TWSE MI_INDEX hot-history prospective bootstrap",
  TPEX: "TPEx dailyQuotes hot-history prospective bootstrap",
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function timestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be ISO");
  return text;
}

function safeRunId(value) {
  const text = requiredText(value, "runId");
  if (!/^[A-Za-z0-9._:-]+$/.test(text)) throw new Error("runId contains unsafe characters");
  return text;
}

function taipeiDate(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error("invalid asOf");
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function shiftDate(date, days) {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function numericEqual(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) {
    return (a === null || a === undefined) && (b === null || b === undefined);
  }
  const left = Number(a);
  const right = Number(b);
  return Number.isFinite(left) && Number.isFinite(right) && left === right;
}

function economicMatch(existing, row) {
  return numericEqual(existing.open_price, row.open)
    && numericEqual(existing.high_price, row.high)
    && numericEqual(existing.low_price, row.low)
    && numericEqual(existing.close_price, row.close)
    && numericEqual(existing.volume_shares, row.volumeShares)
    && numericEqual(existing.trade_value, row.tradeValue)
    && numericEqual(existing.transactions, row.transactions)
    && numericEqual(existing.change_value, row.change);
}

function coverageKey(date, market) {
  return date + "|" + market;
}

async function loadRecentCoverage(db, dates) {
  if (!dates.length) return new Map();
  const placeholders = dates.map(() => "?").join(",");
  const result = await db.prepare(
    `SELECT market_date, market,
            COUNT(*) AS row_count,
            COUNT(DISTINCT symbol) AS symbol_count,
            SUM(CASE WHEN pit_replay_eligible = 1 AND available_at IS NOT NULL THEN 1 ELSE 0 END) AS pit_eligible_count
       FROM s2_historical_a1_bars
      WHERE price_space = 'RAW' AND market_date IN (${placeholders})
      GROUP BY market_date, market`,
  ).bind(...dates).all();
  const rows = Array.isArray(result?.results) ? result.results : [];
  const map = new Map();
  for (const row of rows) {
    const rowCount = Number(row.row_count || 0);
    const symbolCount = Number(row.symbol_count || 0);
    if (rowCount > symbolCount) {
      throw new Error("HOT_HISTORY_EXISTING_CANONICAL_AMBIGUITY:" + row.market + ":" + row.market_date);
    }
    map.set(coverageKey(String(row.market_date), String(row.market)), {
      rowCount,
      symbolCount,
      pitEligibleCount: Number(row.pit_eligible_count || 0),
    });
  }
  return map;
}

function coverageReady(map, date, market) {
  const row = map.get(coverageKey(date, market));
  if (!row) return false;
  return row.symbolCount >= MINIMUM_SYMBOLS[market]
    && row.rowCount === row.symbolCount
    && row.pitEligibleCount === row.rowCount;
}

async function verifyInsertedRows(db, expectedRows) {
  for (let i = 0; i < expectedRows.length; i += 80) {
    const group = expectedRows.slice(i, i + 80);
    const placeholders = group.map(() => "?").join(",");
    const result = await db.prepare(
      `SELECT bar_id, canonical_key, bar_hash, source_row_hash, available_at,
              pit_replay_eligible, continuity_state
         FROM s2_historical_a1_bars
        WHERE bar_id IN (${placeholders})`,
    ).bind(...group.map((row) => row.bar_id)).all();
    const saved = new Map((result?.results || []).map((row) => [String(row.bar_id), row]));
    for (const expected of group) {
      const actual = saved.get(String(expected.bar_id));
      if (!actual
        || String(actual.canonical_key) !== String(expected.canonical_key)
        || String(actual.bar_hash) !== String(expected.bar_hash)
        || String(actual.source_row_hash) !== String(expected.source_row_hash)
        || String(actual.available_at) !== String(expected.available_at)
        || Number(actual.pit_replay_eligible) !== 1
        || String(actual.continuity_state) !== "UNVERIFIED") {
        throw new Error("HOT_HISTORY_READBACK_MISMATCH:" + expected.canonical_key);
      }
    }
  }
}

async function existingDateRows(db, marketDate, market) {
  const result = await db.prepare(
    `SELECT canonical_key, market_date, market, symbol, price_space,
            open_price, high_price, low_price, close_price, volume_shares,
            trade_value, transactions, change_value, available_at,
            pit_replay_eligible, bar_hash
       FROM s2_historical_a1_bars
      WHERE market_date = ? AND market = ? AND price_space = 'RAW'`,
  ).bind(marketDate, market).all();
  const rows = Array.isArray(result?.results) ? result.results : [];
  const byKey = new Map();
  for (const row of rows) {
    const key = String(row.canonical_key);
    if (byKey.has(key)) throw new Error("HOT_HISTORY_EXISTING_CANONICAL_AMBIGUITY:" + key);
    byKey.set(key, row);
  }
  return byKey;
}

export async function planDailyShadowHotHistoryBootstrapV0_1({
  db,
  asOf,
  sessionCount = HOT_HISTORY_MAX_SESSIONS_PER_RUN,
  fetchImpl = globalThis.fetch,
  tradingDateResolver = buildOfficialTradingDatesV0_1,
} = {}) {
  if (!db?.prepare) throw new Error("SYSTEM2_DB adapter required");
  const clock = timestamp(asOf, "asOf");
  const count = Number(sessionCount);
  if (!Number.isInteger(count) || count < 1 || count > HOT_HISTORY_MAX_SESSIONS_PER_RUN) {
    throw new Error("sessionCount must be an integer from 1 to " + HOT_HISTORY_MAX_SESSIONS_PER_RUN);
  }
  const localDate = taipeiDate(clock);
  const toDate = shiftDate(localDate, -1);
  const fromDate = shiftDate(toDate, -HOT_HISTORY_LOOKBACK_CALENDAR_DAYS);
  const trading = await tradingDateResolver({ fromDate, toDate, fetchImpl });
  if (!Array.isArray(trading?.tradingDates) || trading.tradingDates.length < 60) {
    throw new Error("HOT_HISTORY_TRADING_CALENDAR_INSUFFICIENT");
  }
  const recent = trading.tradingDates.slice(-80);
  const coverage = await loadRecentCoverage(db, recent);
  const incomplete = recent.filter((date) =>
    !coverageReady(coverage, date, "TWSE") || !coverageReady(coverage, date, "TPEX"));
  const targetDates = incomplete.slice(-count);
  return deepFreeze({
    schemaVersion: "S2_DAILY_SHADOW_HOT_HISTORY_PLAN_V0_1",
    asOf: clock,
    targetEndDate: toDate,
    targetDates: Object.freeze(targetDates),
    requestedSessionCount: count,
    recentTradingDateCount: recent.length,
    missingRecentDateCount: incomplete.length,
    minimumSymbols: MINIMUM_SYMBOLS,
    selectionAuthority: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}

export async function runDailyShadowHotHistoryBootstrapV0_1({
  db,
  runId,
  asOf = new Date().toISOString(),
  sessionCount = HOT_HISTORY_MAX_SESSIONS_PER_RUN,
  fetchImpl = globalThis.fetch,
  tradingDateResolver = buildOfficialTradingDatesV0_1,
  historicalFetch = fetchOfficialHistoricalA1DateV0_1,
} = {}) {
  if (!db?.prepare || !db?.batch) throw new Error("SYSTEM2_DB adapter required");
  const id = safeRunId(runId);
  const clock = timestamp(asOf, "asOf");
  const plan = await planDailyShadowHotHistoryBootstrapV0_1({
    db, asOf: clock, sessionCount, fetchImpl, tradingDateResolver,
  });

  // Phase 1: fetch and validate every required market/date before any D1 mutation.
  // This prevents a transient failure on the second market from creating a
  // new half-populated date in this run. Existing rows from an interrupted
  // earlier run are handled idempotently in phase 2.
  const sourcePlans = [];
  for (const marketDate of plan.targetDates) {
    for (const market of ["TWSE", "TPEX"]) {
      const source = await historicalFetch({
        market,
        marketDate,
        observedAt: clock,
        fetchImpl,
        retryAttempts: 5,
        retryDelayMs: 1000,
      });
      if (!source || source.state !== "READY" || source.marketDate !== marketDate
        || source.sourceDateEvidence !== marketDate) {
        throw new Error("HOT_HISTORY_SOURCE_NOT_READY:" + market + ":" + marketDate);
      }
      if (Number(source.ordinarySymbolCount || 0) < MINIMUM_SYMBOLS[market]) {
        throw new Error("HOT_HISTORY_SOURCE_COVERAGE_LOW:" + market + ":" + marketDate);
      }
      if (Number(source.ordinarySymbolCount || 0) > HOT_HISTORY_MAX_SOURCE_ROWS_PER_MARKET_DATE) {
        throw new Error("HOT_HISTORY_SOURCE_COVERAGE_UNEXPECTEDLY_HIGH:" + market + ":" + marketDate);
      }
      sourcePlans.push(deepFreeze({ marketDate, market, source }));
    }
  }

  // Phase 2: only after the full source set is valid do we inspect existing
  // canonical rows and persist missing immutable bars.
  const receipts = [];
  let insertedBarCount = 0;
  let reusedExistingCount = 0;
  for (const item of sourcePlans) {
    const { marketDate, market, source } = item;
    const existing = await existingDateRows(db, marketDate, market);
    const pending = [];
    let reused = 0;
    for (const row of source.rows || []) {
      const key = [market, row.symbol, marketDate, "RAW"].join("|");
      const prior = existing.get(key);
      if (prior) {
        if (!economicMatch(prior, row)) {
          throw new Error("HOT_HISTORY_EXISTING_ECONOMIC_CONFLICT:" + key);
        }
        if (Number(prior.pit_replay_eligible) !== 1 || !prior.available_at
          || Date.parse(prior.available_at) > Date.parse(clock)) {
          throw new Error("HOT_HISTORY_EXISTING_PIT_INELIGIBLE:" + key);
        }
        reused += 1;
        continue;
      }
      pending.push({
        marketDate,
        market,
        symbol: row.symbol,
        companyName: row.companyName || null,
        priceSpace: "RAW",
        open: row.open,
        high: row.high,
        low: row.low,
        close: row.close,
        volumeShares: row.volumeShares,
        tradeValue: row.tradeValue,
        transactions: row.transactions,
        change: row.change,
        continuityState: "UNVERIFIED",
        observedAt: clock,
        availableAt: clock,
        availabilityBasis: "PROSPECTIVE_OBSERVATION",
        sourceFields: row.sourceFields,
        sourceRowHash: row.sourceRowHash || await sha256Hex(row.sourceFields),
      });
    }

    let persisted = null;
    if (pending.length) {
      const batch = await buildHistoricalStoreIngestBatch({
        batchId: "S2-HOT-HISTORY:" + id + ":" + market + ":" + marketDate,
        datasetLane: "CORE_2017_PLUS",
        sourceId: SOURCE_IDS[market],
        sourceName: SOURCE_NAMES[market],
        sourceUrl: source.sourceUrl,
        capturedAt: clock,
        rows: pending,
      });
      persisted = await executeHistoricalIngestBatchBulkV0_1({
        db,
        ingestBatch: batch,
        lookupChunkSize: 80,
        insertChunkSize: 80,
      });
      await verifyInsertedRows(db, toHistoricalA1BarRows(batch));
      insertedBarCount += Number(persisted.insertedBarCount || 0);
    }
    reusedExistingCount += reused;
    receipts.push(deepFreeze({
      marketDate,
      market,
      sourceId: source.sourceId,
      sourceDateEvidence: source.sourceDateEvidence,
      sourceOrdinarySymbolCount: source.ordinarySymbolCount,
      pendingRowCount: pending.length,
      reusedExistingCount: reused,
      persistenceState: persisted?.state || "NO_MISSING_ROWS",
      insertedBarCount: Number(persisted?.insertedBarCount || 0),
      readbackVerified: pending.length ? true : null,
    }));
  }

  return deepFreeze({
    schemaVersion: "S2_DAILY_SHADOW_HOT_HISTORY_BOOTSTRAP_V0_1",
    version: DAILY_SHADOW_HOT_HISTORY_BOOTSTRAP_VERSION,
    runId: id,
    asOf: clock,
    plan,
    sourceSetValidatedBeforeMutation: true,
    sourceRetryAttempts: 5,
    state: plan.targetDates.length
      ? "BOUNDED_HOT_HISTORY_BOOTSTRAP_COMPLETE"
      : "HOT_HISTORY_ALREADY_SUFFICIENT_IN_WINDOW",
    insertedBarCount,
    reusedExistingCount,
    receipts: Object.freeze(receipts),
    continuityState: "UNVERIFIED",
    continuityPromotionPerformed: false,
    assessorPolicyChanged: false,
    selectionAuthority: false,
    capacityWriteAuthorized: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}
