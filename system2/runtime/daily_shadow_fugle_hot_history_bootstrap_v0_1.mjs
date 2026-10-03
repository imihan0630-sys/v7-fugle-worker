import { deepFreeze } from "./factor_snapshot.mjs";
import { canonicalStringify, sha256Hex } from "./decision_archive.mjs";
import { fetchCurrentListingMetadataV0_1 } from "./current_listing_metadata_v0_1.mjs";
import {
  fetchFugleRawDailyHistoryV0_1,
  FUGLE_RAW_DAILY_HISTORY_SOURCE_ID,
  FUGLE_RAW_DAILY_HISTORY_SOURCE_NAME,
} from "./fugle_raw_daily_history_v0_1.mjs";
import { buildHistoricalStoreIngestBatch, toHistoricalA1BarRows } from "./historical_store_v0_1.mjs";
import { executeHistoricalIngestBatchBulkV0_1 } from "./historical_bulk_persistence_v0_1.mjs";
import { buildSystem2PersistenceBatch } from "./persistence_batch.mjs";
import { executeSystem2PersistenceBatch } from "./persistence_executor.mjs";

export const DAILY_SHADOW_FUGLE_HOT_HISTORY_BOOTSTRAP_VERSION = "0.1-RESEARCH";
export const FUGLE_HOT_HISTORY_SYMBOL_COMPLETE_CHECK =
  "FUGLE_RAW_HOT_HISTORY_SYMBOL_COMPLETE_V0_1";
export const FUGLE_HOT_HISTORY_DEFAULT_SYMBOL_LIMIT = 45;
export const FUGLE_HOT_HISTORY_MAX_SYMBOL_LIMIT = 50;
export const FUGLE_HOT_HISTORY_LOOKBACK_CALENDAR_DAYS = 300;
export const FUGLE_HOT_HISTORY_REQUIRED_BARS = 60;

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function timestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be ISO");
  return text;
}

function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function shiftDate(date, days) {
  const d = new Date(date + "T00:00:00.000Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function maxDate(a, b) {
  return a > b ? a : b;
}

function taipeiDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function assertDb(db) {
  if (!db?.prepare || !db?.batch) throw new Error("isolated SYSTEM2_DB adapter is required");
  return db;
}

function roundRobinMarkets(rows, limit) {
  const byMarket = {
    TWSE: rows.filter((x) => x.market === "TWSE").sort((a, b) => a.symbol.localeCompare(b.symbol)),
    TPEX: rows.filter((x) => x.market === "TPEX").sort((a, b) => a.symbol.localeCompare(b.symbol)),
  };
  const out = [];
  let index = 0;
  while (out.length < limit) {
    let added = false;
    for (const market of ["TWSE", "TPEX"]) {
      if (byMarket[market][index] && out.length < limit) {
        out.push(byMarket[market][index]);
        added = true;
      }
    }
    if (!added) break;
    index += 1;
  }
  return out;
}

async function loadCoverage(db, asOf, toDate) {
  const result = await db.prepare(`
    WITH per_date AS (
      SELECT market, symbol, market_date, COUNT(DISTINCT bar_hash) AS revision_count
        FROM s2_historical_a1_bars
       WHERE market_date <= ?
         AND price_space='RAW'
         AND pit_replay_eligible=1
         AND available_at IS NOT NULL
         AND available_at <= ?
       GROUP BY market, symbol, market_date
    )
    SELECT market, symbol,
           COUNT(*) AS date_count,
           SUM(CASE WHEN revision_count > 1 THEN 1 ELSE 0 END) AS ambiguous_date_count,
           MIN(market_date) AS first_market_date,
           MAX(market_date) AS last_market_date
      FROM per_date
     GROUP BY market, symbol
  `).bind(toDate, asOf).all();
  return new Map((result?.results || []).map((row) => [
    String(row.market) + "|" + String(row.symbol),
    {
      dateCount: Number(row.date_count || 0),
      ambiguousDateCount: Number(row.ambiguous_date_count || 0),
      firstMarketDate: row.first_market_date || null,
      lastMarketDate: row.last_market_date || null,
    },
  ]));
}

async function loadCompletedKeys(db) {
  const result = await db.prepare(
    "SELECT observed_payload_json FROM s2_infrastructure_checks WHERE check_type=?",
  ).bind(FUGLE_HOT_HISTORY_SYMBOL_COMPLETE_CHECK).all();
  const keys = new Set();
  for (const row of result?.results || []) {
    try {
      const payload = JSON.parse(row.observed_payload_json);
      if (payload?.market && payload?.symbol) keys.add(payload.market + "|" + payload.symbol);
    } catch {
      throw new Error("invalid completed Fugle hot-history marker payload");
    }
  }
  return keys;
}

async function loadExistingCanonicalRows(db, { market, symbol, fromDate, toDate }) {
  const result = await db.prepare(`
    SELECT canonical_key, market_date, bar_hash
      FROM s2_historical_a1_bars
     WHERE market=? AND symbol=? AND price_space='RAW'
       AND market_date BETWEEN ? AND ?
     ORDER BY market_date, observed_at, bar_hash
  `).bind(market, symbol, fromDate, toDate).all();
  const byKey = new Map();
  for (const row of result?.results || []) {
    const key = String(row.canonical_key);
    const prior = byKey.get(key);
    if (prior && String(prior.bar_hash) !== String(row.bar_hash)) {
      throw new Error("FUGLE_HOT_HISTORY_EXISTING_AMBIGUITY:" + key);
    }
    byKey.set(key, row);
  }
  return byKey;
}

async function verifyHistoricalRows(db, batch) {
  const rows = toHistoricalA1BarRows(batch);
  for (let i = 0; i < rows.length; i += 80) {
    const part = rows.slice(i, i + 80);
    const placeholders = part.map(() => "?").join(",");
    const result = await db.prepare(
      `SELECT bar_id, canonical_key, bar_hash, available_at, continuity_state
         FROM s2_historical_a1_bars WHERE bar_id IN (${placeholders})`,
    ).bind(...part.map((x) => x.bar_id)).all();
    const saved = new Map((result?.results || []).map((row) => [String(row.bar_id), row]));
    for (const expected of part) {
      const actual = saved.get(String(expected.bar_id));
      if (!actual
        || String(actual.canonical_key) !== String(expected.canonical_key)
        || String(actual.bar_hash) !== String(expected.bar_hash)
        || String(actual.available_at) !== String(expected.available_at)
        || String(actual.continuity_state) !== "UNVERIFIED") {
        throw new Error("FUGLE_HOT_HISTORY_READBACK_MISMATCH:" + expected.canonical_key);
      }
    }
  }
}

async function persistCompletionMarker(db, payload) {
  const checkId = "S2-FUGLE-RAW-HOT-HISTORY-V0.1:" + payload.market + ":" + payload.symbol;
  const checkHash = await sha256Hex(payload);
  const record = {
    table: "s2_infrastructure_checks",
    row: {
      check_id: checkId,
      check_type: FUGLE_HOT_HISTORY_SYMBOL_COMPLETE_CHECK,
      check_timestamp: payload.observedAt,
      environment: "system2-research",
      binding_name: "SYSTEM2_DB",
      schema_version: "1.1",
      expected_payload_json: canonicalStringify({
        historyOnly: true,
        continuityPromotionPerformed: false,
        selectionAuthority: false,
      }),
      observed_payload_json: canonicalStringify(payload),
      status: payload.state,
      check_hash: checkHash,
      notes: "One-time bounded raw Fugle history bootstrap marker; no continuity or selection authority.",
    },
  };
  const batch = await buildSystem2PersistenceBatch({
    batchId: checkId + "|MARKER",
    marketDate: payload.toDate,
    decisionTimestamp: payload.observedAt,
    records: [record],
    createdAt: payload.observedAt,
  });
  await executeSystem2PersistenceBatch({ db, batch, bindingName: "SYSTEM2_DB" });
  const saved = await db.prepare(
    "SELECT observed_payload_json, check_hash FROM s2_infrastructure_checks WHERE check_id=? LIMIT 1",
  ).bind(checkId).first();
  if (!saved || saved.check_hash !== checkHash || saved.observed_payload_json !== canonicalStringify(payload)) {
    throw new Error("FUGLE_HOT_HISTORY_MARKER_READBACK_MISMATCH:" + payload.market + "|" + payload.symbol);
  }
  return checkId;
}

export async function planDailyShadowFugleHotHistoryBootstrapV0_1({
  db,
  listingMetadata,
  asOf = new Date().toISOString(),
  toDate = null,
  symbolLimit = FUGLE_HOT_HISTORY_DEFAULT_SYMBOL_LIMIT,
} = {}) {
  assertDb(db);
  const clock = timestamp(asOf, "asOf");
  const limit = Number(symbolLimit);
  if (!Number.isInteger(limit) || limit < 1 || limit > FUGLE_HOT_HISTORY_MAX_SYMBOL_LIMIT) {
    throw new Error("symbolLimit must be 1.." + FUGLE_HOT_HISTORY_MAX_SYMBOL_LIMIT);
  }
  if (!listingMetadata || listingMetadata.state !== "READY" || !listingMetadata.byMarketSymbol) {
    throw new Error("READY current listing metadata is required");
  }
  const targetToDate = toDate
    ? isoDate(toDate, "toDate")
    : shiftDate(taipeiDate(new Date(clock)), -1);
  const coverage = await loadCoverage(db, clock, targetToDate);
  const completed = await loadCompletedKeys(db);
  const blocked = [];
  const eligible = [];
  for (const item of Object.values(listingMetadata.byMarketSymbol)) {
    if (!item || !["TWSE", "TPEX"].includes(item.market)) continue;
    if (!/^[1-9][0-9]{3}$/.test(String(item.symbol || ""))) continue;
    if (!item.listingDate || item.listingDate > targetToDate) continue;
    const key = item.market + "|" + item.symbol;
    const existing = coverage.get(key) || {
      dateCount: 0, ambiguousDateCount: 0, firstMarketDate: null, lastMarketDate: null,
    };
    if (existing.ambiguousDateCount > 0) {
      blocked.push({
        market: item.market,
        symbol: item.symbol,
        state: "EXISTING_HISTORY_AMBIGUITY",
        ambiguousDateCount: existing.ambiguousDateCount,
      });
      continue;
    }
    if (completed.has(key)) continue;
    if (existing.dateCount >= FUGLE_HOT_HISTORY_REQUIRED_BARS) continue;
    const lowerBound = shiftDate(targetToDate, -FUGLE_HOT_HISTORY_LOOKBACK_CALENDAR_DAYS);
    eligible.push({
      market: item.market,
      symbol: item.symbol,
      companyName: item.companyName || null,
      listingDate: item.listingDate,
      fromDate: maxDate(item.listingDate, lowerBound),
      toDate: targetToDate,
      existingPitDateCount: existing.dateCount,
      existingFirstMarketDate: existing.firstMarketDate,
      existingLastMarketDate: existing.lastMarketDate,
    });
  }
  const selected = roundRobinMarkets(eligible, limit);
  return deepFreeze({
    schemaVersion: "SYSTEM2_DAILY_SHADOW_FUGLE_HOT_HISTORY_PLAN_V0_1",
    asOf: clock,
    toDate: targetToDate,
    symbolLimit: limit,
    requiredBars: FUGLE_HOT_HISTORY_REQUIRED_BARS,
    lookbackCalendarDays: FUGLE_HOT_HISTORY_LOOKBACK_CALENDAR_DAYS,
    eligibleSymbolCount: eligible.length,
    selectedSymbolCount: selected.length,
    selected: Object.freeze(selected),
    blocked: Object.freeze(blocked),
    sourceId: FUGLE_RAW_DAILY_HISTORY_SOURCE_ID,
    rawPriceSpaceOnly: true,
    continuityPromotionPerformed: false,
    selectionAuthority: false,
    livePushEnabled: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}

export async function runDailyShadowFugleHotHistoryBootstrapV0_1({
  db,
  fugleApiKey,
  asOf = new Date().toISOString(),
  toDate = null,
  symbolLimit = FUGLE_HOT_HISTORY_DEFAULT_SYMBOL_LIMIT,
  pauseMs = 1100,
  fetchImpl = globalThis.fetch,
  listingMetadataFetch = fetchCurrentListingMetadataV0_1,
  historicalFetch = fetchFugleRawDailyHistoryV0_1,
  historicalPersist = executeHistoricalIngestBatchBulkV0_1,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
} = {}) {
  assertDb(db);
  const apiKey = requiredText(fugleApiKey, "fugleApiKey");
  const clock = timestamp(asOf, "asOf");
  if (!Number.isInteger(pauseMs) || pauseMs < 0 || pauseMs > 5000) {
    throw new Error("pauseMs must be 0..5000");
  }
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  if (typeof listingMetadataFetch !== "function") throw new Error("listingMetadataFetch is required");
  if (typeof historicalFetch !== "function") throw new Error("historicalFetch is required");
  if (typeof historicalPersist !== "function") throw new Error("historicalPersist is required");
  if (typeof sleep !== "function") throw new Error("sleep is required");

  const listingMetadata = await listingMetadataFetch({
    fetchImpl,
    observedAt: clock,
  });
  if (listingMetadata.state !== "READY") {
    throw new Error("FUGLE_HOT_HISTORY_LISTING_METADATA_NOT_READY");
  }
  const plan = await planDailyShadowFugleHotHistoryBootstrapV0_1({
    db, listingMetadata, asOf: clock, toDate, symbolLimit,
  });

  const receipts = [];
  let insertedBarCount = 0;
  let reusedExistingCount = 0;
  let noDataCount = 0;
  for (let index = 0; index < plan.selected.length; index += 1) {
    const item = plan.selected[index];
    const source = await historicalFetch({
      apiKey,
      symbol: item.symbol,
      market: item.market,
      companyName: item.companyName,
      listingDate: item.listingDate,
      fromDate: item.fromDate,
      toDate: item.toDate,
      fetchImpl,
    });
    if (!["READY", "NO_DATA"].includes(source.state)) {
      throw new Error("FUGLE_HOT_HISTORY_SOURCE_NOT_READY:" + item.market + "|" + item.symbol);
    }
    const existing = await loadExistingCanonicalRows(db, item);
    const missingRows = (source.rows || []).filter((row) =>
      !existing.has([row.market, row.symbol, row.marketDate, "RAW"].join("|")));
    let persistence = null;
    let batch = null;
    if (missingRows.length) {
      batch = await buildHistoricalStoreIngestBatch({
        batchId: "S2-FUGLE-RAW-HOT-HISTORY-V0.1:"
          + item.market + ":" + item.symbol + ":" + source.observedAt,
        datasetLane: "CORE_2017_PLUS",
        sourceId: FUGLE_RAW_DAILY_HISTORY_SOURCE_ID,
        sourceName: FUGLE_RAW_DAILY_HISTORY_SOURCE_NAME,
        sourceUrl: source.sourceUrl,
        capturedAt: source.observedAt,
        rows: missingRows,
      });
      if (batch.rows.some((row) =>
        row.continuityState !== "UNVERIFIED"
        || row.availabilityBasis !== "PROSPECTIVE_OBSERVATION"
        || row.pitAvailabilityClass !== "OBSERVED_AVAILABLE_UPPER_BOUND"
        || row.priceSpace !== "RAW")) {
        throw new Error("FUGLE_HOT_HISTORY_PIT_OR_CONTINUITY_FIREWALL");
      }
      persistence = await historicalPersist({
        db,
        ingestBatch: batch,
        lookupChunkSize: 80,
        insertChunkSize: 80,
      });
      await verifyHistoricalRows(db, batch);
      insertedBarCount += Number(persistence.insertedBarCount || 0);
    }
    const reused = (source.rows || []).length - missingRows.length;
    reusedExistingCount += reused;
    if (source.state === "NO_DATA") noDataCount += 1;
    const markerPayload = deepFreeze({
      schemaVersion: "SYSTEM2_FUGLE_RAW_HOT_HISTORY_SYMBOL_RECEIPT_V0_1",
      state: source.state === "NO_DATA"
        ? "NO_DATA_AT_PROSPECTIVE_BOOTSTRAP"
        : "RAW_HISTORY_BOOTSTRAP_COMPLETE",
      market: item.market,
      symbol: item.symbol,
      companyName: item.companyName,
      listingDate: item.listingDate,
      fromDate: item.fromDate,
      toDate: item.toDate,
      observedAt: source.observedAt,
      sourceId: source.sourceId,
      sourcePayloadHash: source.payloadHash,
      sourceBarCount: source.barCount,
      existingCanonicalCount: existing.size,
      attemptedMissingBarCount: missingRows.length,
      insertedBarCount: Number(persistence?.insertedBarCount || 0),
      identicalBarCount: Number(persistence?.identicalBarCount || 0),
      reusedExistingCount: reused,
      completionReceiptWrittenLast: persistence?.completionReceiptWrittenLast ?? null,
      rawPriceSpaceOnly: true,
      continuityState: "UNVERIFIED",
      continuityPromotionPerformed: false,
      strategyEvaluationPerformed: false,
      capacityRunProduced: false,
      selectionAuthority: false,
      livePushEnabled: false,
      orderImpact: false,
      system1RuntimeUsed: false,
    });
    const markerId = await persistCompletionMarker(db, markerPayload);
    receipts.push(deepFreeze({ ...markerPayload, markerId }));
    if (pauseMs > 0 && index + 1 < plan.selected.length) await sleep(pauseMs);
  }

  return deepFreeze({
    schemaVersion: "SYSTEM2_DAILY_SHADOW_FUGLE_HOT_HISTORY_BOOTSTRAP_V0_1",
    version: DAILY_SHADOW_FUGLE_HOT_HISTORY_BOOTSTRAP_VERSION,
    state: plan.selected.length ? "BOUNDED_BOOTSTRAP_COMPLETE" : "NO_ELIGIBLE_SYMBOLS",
    asOf: clock,
    plan,
    processedSymbolCount: receipts.length,
    insertedBarCount,
    reusedExistingCount,
    noDataCount,
    receipts: Object.freeze(receipts),
    sourceRateLimitSafety: {
      sequentialRequests: true,
      pauseMs,
      maxSymbolsPerRun: FUGLE_HOT_HISTORY_MAX_SYMBOL_LIMIT,
    },
    rawPriceSpaceOnly: true,
    availabilityBasis: "PROSPECTIVE_OBSERVATION",
    continuityState: "UNVERIFIED",
    continuityPromotionPerformed: false,
    strategyEvaluationPerformed: false,
    capacityRunProduced: false,
    zeroPickClaimed: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}
