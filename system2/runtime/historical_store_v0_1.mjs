import { deepFreeze } from "./factor_snapshot.mjs";
import { canonicalStringify, sha256Hex } from "./decision_archive.mjs";

export const HISTORICAL_STORE_VERSION = "0.1-RESEARCH";
export const CORE_HISTORY_START_DATE = "2017-01-01";
export const EXTENDED_TECHNICAL_START_DATE = "2010-01-01";

const DATASET_LANES = new Set(["CORE_2017_PLUS", "EXTENDED_TECHNICAL_2010_2016"]);
const MARKETS = new Set(["TWSE", "TPEX"]);
const PRICE_SPACES = new Set(["RAW", "ADJUSTED"]);
const CONTINUITY_STATES = new Set([
  "CLEAR_NO_ACTION",
  "ADJUSTED_CONTINUITY",
  "UNVERIFIED",
  "BROKEN",
]);
const AVAILABILITY_BASES = new Set([
  "SOURCE_TIMESTAMP",
  "SESSION_CLOSE_FINALITY",
  "PROSPECTIVE_OBSERVATION",
  "UNKNOWN",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function assertIsoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function assertTimestamp(value, field, { optional = false } = {}) {
  if ((value === null || value === undefined || value === "") && optional) return null;
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return text;
}

function numberOrNull(value, { positive = false, nonNegative = false } = {}) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(String(value).replaceAll(",", "").trim());
  if (!Number.isFinite(n)) return null;
  if (positive && n <= 0) return null;
  if (nonNegative && n < 0) return null;
  return n;
}

function ordinarySymbol(value) {
  return /^[1-9][0-9]{3}$/.test(String(value || "").trim());
}

function minDateForLane(lane) {
  return lane === "CORE_2017_PLUS" ? CORE_HISTORY_START_DATE : EXTENDED_TECHNICAL_START_DATE;
}

function pitAvailabilityClass(availableAt, availabilityBasis) {
  if (!availableAt || availabilityBasis === "UNKNOWN") return "UNKNOWN";
  if (availabilityBasis === "SOURCE_TIMESTAMP") return "PROVEN_SOURCE_TIMESTAMP";
  if (availabilityBasis === "PROSPECTIVE_OBSERVATION") return "OBSERVED_AVAILABLE_UPPER_BOUND";
  return "CONSERVATIVE_SESSION_FINALITY";
}

async function normalizeHistoricalBar({
  batchId,
  datasetLane,
  sourceId,
  sourceName,
  sourceUrl,
  capturedAt,
  row,
}) {
  if (!row || typeof row !== "object" || Array.isArray(row)) throw new Error("history row must be an object");

  const market = requiredText(row.market, "row.market");
  if (!MARKETS.has(market)) throw new Error("unsupported market: " + market);

  const symbol = requiredText(row.symbol, "row.symbol");
  if (!ordinarySymbol(symbol)) throw new Error("historical store accepts ordinary four-digit equities only");

  const marketDate = assertIsoDate(row.marketDate, "row.marketDate");
  const laneStart = minDateForLane(datasetLane);
  if (marketDate < laneStart) {
    throw new Error("marketDate precedes dataset lane start: " + laneStart);
  }

  const priceSpace = requiredText(row.priceSpace || "RAW", "row.priceSpace");
  if (!PRICE_SPACES.has(priceSpace)) throw new Error("unsupported priceSpace: " + priceSpace);

  const continuityState = requiredText(row.continuityState || "UNVERIFIED", "row.continuityState");
  if (!CONTINUITY_STATES.has(continuityState)) {
    throw new Error("unsupported continuityState: " + continuityState);
  }

  const availabilityBasis = requiredText(row.availabilityBasis || "UNKNOWN", "row.availabilityBasis");
  if (!AVAILABILITY_BASES.has(availabilityBasis)) {
    throw new Error("unsupported availabilityBasis: " + availabilityBasis);
  }

  const observedAt = assertTimestamp(row.observedAt || capturedAt, "row.observedAt");
  const availableAt = assertTimestamp(row.availableAt, "row.availableAt", { optional: true });
  if (availabilityBasis === "PROSPECTIVE_OBSERVATION" &&
      (!availableAt || Date.parse(availableAt) !== Date.parse(observedAt))) {
    throw new Error("PROSPECTIVE_OBSERVATION requires availableAt equal to first observedAt");
  }
  if (availabilityBasis === "SOURCE_TIMESTAMP" && !availableAt) {
    throw new Error("SOURCE_TIMESTAMP requires availableAt");
  }
  if (availabilityBasis !== "UNKNOWN" && !availableAt) {
    throw new Error("non-UNKNOWN availabilityBasis requires availableAt");
  }
  if (availableAt && Date.parse(availableAt) > Date.parse(capturedAt)) {
    throw new Error("availableAt cannot be later than capturedAt");
  }

  const open = numberOrNull(row.open, { positive: true });
  const high = numberOrNull(row.high, { positive: true });
  const low = numberOrNull(row.low, { positive: true });
  const close = numberOrNull(row.close, { positive: true });
  const completeOhlc = [open, high, low, close].every(Number.isFinite);
  if (completeOhlc && (high < low || high < open || high < close || low > open || low > close)) {
    throw new Error("historical row has inconsistent OHLC");
  }

  const volumeShares = numberOrNull(row.volumeShares, { nonNegative: true });
  const tradeValue = numberOrNull(row.tradeValue, { nonNegative: true });
  const transactions = numberOrNull(row.transactions, { nonNegative: true });
  const change = numberOrNull(row.change);

  const sourceFields = row.sourceFields && typeof row.sourceFields === "object"
    ? row.sourceFields
    : {
        marketDate,
        market,
        symbol,
        open,
        high,
        low,
        close,
        volumeShares,
        tradeValue,
        transactions,
        change,
      };
  const sourceRowHash = row.sourceRowHash || await sha256Hex(sourceFields);
  const canonicalKey = [market, symbol, marketDate, priceSpace].join("|");
  const availabilityClass = pitAvailabilityClass(availableAt, availabilityBasis);

  // Content identity must be stable across repeated fetch batches.  Batch/capture
  // metadata proves when we observed the row, but must not turn an identical
  // official row into a false historical revision on re-ingest.
  const contentIdentity = {
    canonicalKey,
    marketDate,
    market,
    symbol,
    companyName: row.companyName ? String(row.companyName).trim() : null,
    priceSpace,
    open,
    high,
    low,
    close,
    volumeShares,
    tradeValue,
    transactions,
    change,
    continuityState,
    sourceId,
    sourceName,
    sourceUrl: sourceUrl || null,
    sourceRowHash,
    availableAt,
    availabilityBasis,
    pitAvailabilityClass: availabilityClass,
    pitReplayEligible: availabilityClass !== "UNKNOWN",
    schemaVersion: "S2_HISTORICAL_A1_BAR_V0_2",
  };
  const contentHash = await sha256Hex(contentIdentity);
  const barHash = contentHash;
  const barId = "S2H-A1-" + contentHash;

  const base = {
    batchId,
    datasetLane,
    ...contentIdentity,
    observedAt,
    capturedAt,
    contentHash,
  };
  return deepFreeze({ ...base, barId, barHash });
}

export async function buildHistoricalStoreIngestBatch({
  batchId,
  datasetLane = "CORE_2017_PLUS",
  sourceId,
  sourceName,
  sourceUrl = null,
  capturedAt,
  rows = [],
} = {}) {
  const id = requiredText(batchId, "batchId");
  const lane = requiredText(datasetLane, "datasetLane");
  if (!DATASET_LANES.has(lane)) throw new Error("unsupported datasetLane: " + lane);
  const srcId = requiredText(sourceId, "sourceId");
  const srcName = requiredText(sourceName, "sourceName");
  const captured = assertTimestamp(capturedAt, "capturedAt");
  if (!Array.isArray(rows) || rows.length === 0) throw new Error("rows must be a non-empty array");

  const normalized = [];
  for (const row of rows) {
    normalized.push(await normalizeHistoricalBar({
      batchId: id,
      datasetLane: lane,
      sourceId: srcId,
      sourceName: srcName,
      sourceUrl,
      capturedAt: captured,
      row,
    }));
  }

  normalized.sort((a, b) =>
    a.marketDate.localeCompare(b.marketDate)
      || a.market.localeCompare(b.market)
      || a.symbol.localeCompare(b.symbol)
      || a.priceSpace.localeCompare(b.priceSpace),
  );

  const seen = new Map();
  for (const bar of normalized) {
    const prior = seen.get(bar.canonicalKey);
    if (prior && prior.barHash !== bar.barHash) {
      throw new Error("conflicting duplicate canonical history row: " + bar.canonicalKey);
    }
    if (prior) throw new Error("duplicate canonical history row: " + bar.canonicalKey);
    seen.set(bar.canonicalKey, bar);
  }

  const firstMarketDate = normalized[0].marketDate;
  const lastMarketDate = normalized.at(-1).marketDate;
  const pitEligibleCount = normalized.filter((x) => x.pitReplayEligible).length;
  const unknownAvailabilityCount = normalized.length - pitEligibleCount;

  const base = {
    batchId: id,
    datasetLane: lane,
    datasetStartBoundary: minDateForLane(lane),
    sourceId: srcId,
    sourceName: srcName,
    sourceUrl,
    capturedAt: captured,
    firstMarketDate,
    lastMarketDate,
    rowCount: normalized.length,
    pitEligibleCount,
    unknownAvailabilityCount,
    marketCounts: {
      TWSE: normalized.filter((x) => x.market === "TWSE").length,
      TPEX: normalized.filter((x) => x.market === "TPEX").length,
    },
    rows: Object.freeze(normalized),
    immutable: true,
    replayPolicy: "AVAILABLE_AT_LTE_DECISION_AND_NO_AMBIGUOUS_REVISION",
    schemaVersion: "S2_HISTORICAL_INGEST_BATCH_V0_1",
  };
  const batchHash = await sha256Hex(base);
  return deepFreeze({ ...base, batchHash });
}

export function toHistoricalIngestBatchRow(batch) {
  if (!batch || typeof batch !== "object") throw new Error("batch is required");
  return Object.freeze({
    batch_id: requiredText(batch.batchId, "batch.batchId"),
    dataset_lane: requiredText(batch.datasetLane, "batch.datasetLane"),
    dataset_start_boundary: requiredText(batch.datasetStartBoundary, "batch.datasetStartBoundary"),
    source_id: requiredText(batch.sourceId, "batch.sourceId"),
    source_name: requiredText(batch.sourceName, "batch.sourceName"),
    source_url: batch.sourceUrl || null,
    first_market_date: requiredText(batch.firstMarketDate, "batch.firstMarketDate"),
    last_market_date: requiredText(batch.lastMarketDate, "batch.lastMarketDate"),
    row_count: Number(batch.rowCount),
    pit_eligible_count: Number(batch.pitEligibleCount),
    unknown_availability_count: Number(batch.unknownAvailabilityCount),
    captured_at: requiredText(batch.capturedAt, "batch.capturedAt"),
    batch_hash: requiredText(batch.batchHash, "batch.batchHash"),
    schema_version: requiredText(batch.schemaVersion, "batch.schemaVersion"),
  });
}

export function toHistoricalA1BarRows(batch) {
  if (!batch || !Array.isArray(batch.rows)) throw new Error("batch.rows is required");
  return Object.freeze(batch.rows.map((bar) => Object.freeze({
    bar_id: requiredText(bar.barId, "bar.barId"),
    batch_id: requiredText(batch.batchId, "batch.batchId"),
    canonical_key: requiredText(bar.canonicalKey, "bar.canonicalKey"),
    market_date: requiredText(bar.marketDate, "bar.marketDate"),
    market: requiredText(bar.market, "bar.market"),
    symbol: requiredText(bar.symbol, "bar.symbol"),
    company_name: bar.companyName || null,
    price_space: requiredText(bar.priceSpace, "bar.priceSpace"),
    open_price: bar.open,
    high_price: bar.high,
    low_price: bar.low,
    close_price: bar.close,
    volume_shares: bar.volumeShares,
    trade_value: bar.tradeValue,
    transactions: bar.transactions,
    change_value: bar.change,
    continuity_state: requiredText(bar.continuityState, "bar.continuityState"),
    source_id: requiredText(bar.sourceId, "bar.sourceId"),
    source_name: requiredText(bar.sourceName, "bar.sourceName"),
    source_url: bar.sourceUrl || null,
    source_row_hash: requiredText(bar.sourceRowHash, "bar.sourceRowHash"),
    observed_at: requiredText(bar.observedAt, "bar.observedAt"),
    available_at: bar.availableAt || null,
    availability_basis: requiredText(bar.availabilityBasis, "bar.availabilityBasis"),
    pit_availability_class: requiredText(bar.pitAvailabilityClass, "bar.pitAvailabilityClass"),
    pit_replay_eligible: bar.pitReplayEligible ? 1 : 0,
    captured_at: requiredText(bar.capturedAt, "bar.capturedAt"),
    bar_hash: requiredText(bar.barHash, "bar.barHash"),
    schema_version: requiredText(bar.schemaVersion, "bar.schemaVersion"),
  })));
}

export function toHistoricalPersistenceRecords(batch) {
  return Object.freeze([
    { table: "s2_historical_ingest_batches", row: toHistoricalIngestBatchRow(batch) },
    ...toHistoricalA1BarRows(batch).map((row) => ({ table: "s2_historical_a1_bars", row })),
  ]);
}

export { DATASET_LANES, MARKETS, PRICE_SPACES, CONTINUITY_STATES, AVAILABILITY_BASES, canonicalStringify };
