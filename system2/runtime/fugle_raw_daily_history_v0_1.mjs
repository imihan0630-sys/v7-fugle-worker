import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const FUGLE_RAW_DAILY_HISTORY_VERSION = "0.1-RESEARCH";
export const FUGLE_RAW_DAILY_HISTORY_SOURCE_ID =
  "FUGLE_MARKETDATA_V1_STOCK_HISTORICAL_DAILY_RAW_PROSPECTIVE";
export const FUGLE_RAW_DAILY_HISTORY_SOURCE_NAME =
  "Fugle MarketData historical daily raw prospective bootstrap";
export const FUGLE_RAW_DAILY_HISTORY_ORIGIN =
  "https://api.fugle.tw/marketdata/v1.0/stock";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function timestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be ISO");
  return text;
}

function positiveNumber(value, field) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) throw new Error(field + " must be positive");
  return n;
}

function nonNegativeOrNull(value, field) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) throw new Error(field + " must be non-negative when present");
  return n;
}

function finiteOrNull(value, field) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(field + " must be finite when present");
  return n;
}

function ordinarySymbol(value) {
  const symbol = requiredText(value, "symbol");
  if (!/^[1-9][0-9]{3}$/.test(symbol)) throw new Error("symbol must be an ordinary four-digit equity");
  return symbol;
}

function marketText(value) {
  const market = requiredText(value, "market").toUpperCase();
  if (!["TWSE", "TPEX"].includes(market)) throw new Error("market must be TWSE or TPEX");
  return market;
}

function daySpan(fromDate, toDate) {
  return Math.floor(
    (Date.parse(toDate + "T00:00:00Z") - Date.parse(fromDate + "T00:00:00Z")) / 86400000,
  );
}

export function buildFugleRawDailyHistoryUrlV0_1({
  symbol,
  fromDate,
  toDate,
} = {}) {
  const code = ordinarySymbol(symbol);
  const from = isoDate(fromDate, "fromDate");
  const to = isoDate(toDate, "toDate");
  if (to < from) throw new Error("toDate cannot be earlier than fromDate");
  if (daySpan(from, to) > 330) throw new Error("Fugle raw daily bootstrap range must be <=330 calendar days");
  const fields = "open,high,low,close,volume,turnover";
  return FUGLE_RAW_DAILY_HISTORY_ORIGIN
    + "/historical/candles/" + encodeURIComponent(code)
    + "?from=" + encodeURIComponent(from)
    + "&to=" + encodeURIComponent(to)
    + "&timeframe=D&adjusted=false&fields=" + fields + "&sort=asc";
}

export async function normalizeFugleRawDailyHistoryV0_1({
  symbol,
  market,
  companyName = null,
  listingDate = null,
  fromDate,
  toDate,
  observedAt,
  rawHistory,
} = {}) {
  const code = ordinarySymbol(symbol);
  const mkt = marketText(market);
  const from = isoDate(fromDate, "fromDate");
  const to = isoDate(toDate, "toDate");
  const observed = timestamp(observedAt, "observedAt");
  const listed = listingDate ? isoDate(listingDate, "listingDate") : null;
  if (!rawHistory || typeof rawHistory !== "object" || Array.isArray(rawHistory)) {
    throw new Error("rawHistory is required");
  }
  if (String(rawHistory.symbol || "") !== code) throw new Error("Fugle history symbol mismatch");
  if (String(rawHistory.timeframe || "") !== "D") throw new Error("Fugle history timeframe must be D");
  if (rawHistory.adjusted === true) throw new Error("Fugle history must not be adjusted");
  if (rawHistory.adjusted !== undefined && rawHistory.adjusted !== false) {
    throw new Error("Fugle history adjusted flag is invalid");
  }
  const exchange = String(rawHistory.exchange || "").toUpperCase();
  if (!exchange) throw new Error("Fugle history exchange is required");
  if (exchange !== mkt) throw new Error("Fugle history exchange mismatch");
  if (rawHistory.type && String(rawHistory.type).toUpperCase() !== "EQUITY") {
    throw new Error("Fugle history must be equity data");
  }

  const data = Array.isArray(rawHistory.data) ? rawHistory.data : null;
  if (!data) throw new Error("Fugle history data must be an array");
  const seen = new Set();
  const rows = [];
  for (let index = 0; index < data.length; index += 1) {
    const raw = data[index];
    if (!raw || typeof raw !== "object") throw new Error("Fugle history row must be an object");
    const marketDate = isoDate(raw.date, "rawHistory.data[" + index + "].date");
    if (marketDate < from || marketDate > to) throw new Error("Fugle history row is outside requested range");
    if (listed && marketDate < listed) throw new Error("Fugle history row precedes official listing date");
    if (seen.has(marketDate)) throw new Error("Fugle history contains duplicate market dates");
    seen.add(marketDate);
    const open = positiveNumber(raw.open, "open");
    const high = positiveNumber(raw.high, "high");
    const low = positiveNumber(raw.low, "low");
    const close = positiveNumber(raw.close, "close");
    if (high < low || high < open || high < close || low > open || low > close) {
      throw new Error("Fugle history has inconsistent OHLC");
    }
    const volumeShares = nonNegativeOrNull(raw.volume, "volume");
    const tradeValue = nonNegativeOrNull(raw.turnover, "turnover");
    // Fugle daily change uses an action-aware reference basis.  Keep it out of
    // the RAW continuity lane so it cannot be mistaken for raw close-to-close change.
    const sourceChange = finiteOrNull(raw.change, "change");
    const sourceFields = {
      symbol: code,
      exchange: rawHistory.exchange,
      market: rawHistory.market ?? null,
      timeframe: rawHistory.timeframe,
      requestedAdjusted: false,
      date: marketDate,
      open,
      high,
      low,
      close,
      volume: volumeShares,
      turnover: tradeValue,
      sourceChange,
    };
    rows.push({
      marketDate,
      market: mkt,
      symbol: code,
      companyName: companyName ? String(companyName).trim() : null,
      priceSpace: "RAW",
      open,
      high,
      low,
      close,
      volumeShares,
      tradeValue,
      transactions: null,
      change: null,
      continuityState: "UNVERIFIED",
      observedAt: observed,
      availableAt: observed,
      availabilityBasis: "PROSPECTIVE_OBSERVATION",
      sourceFields,
      sourceRowHash: await sha256Hex(sourceFields),
    });
  }
  rows.sort((a, b) => a.marketDate.localeCompare(b.marketDate));
  const sourceUrl = buildFugleRawDailyHistoryUrlV0_1({ symbol: code, fromDate: from, toDate: to });
  const payloadHash = await sha256Hex({
    symbol: code,
    market: mkt,
    fromDate: from,
    toDate: to,
    requestedAdjusted: false,
    rows: rows.map((row) => row.sourceFields),
  });
  return deepFreeze({
    schemaVersion: "SYSTEM2_FUGLE_RAW_DAILY_HISTORY_V0_1",
    version: FUGLE_RAW_DAILY_HISTORY_VERSION,
    state: rows.length ? "READY" : "NO_DATA",
    sourceId: FUGLE_RAW_DAILY_HISTORY_SOURCE_ID,
    sourceName: FUGLE_RAW_DAILY_HISTORY_SOURCE_NAME,
    sourceUrl,
    symbol: code,
    market: mkt,
    fromDate: from,
    toDate: to,
    listingDate: listed,
    observedAt: observed,
    requestedAdjusted: false,
    priceSpace: "RAW",
    volumeUnit: "SHARES",
    continuityState: "UNVERIFIED",
    barCount: rows.length,
    firstMarketDate: rows[0]?.marketDate || null,
    lastMarketDate: rows.at(-1)?.marketDate || null,
    payloadHash,
    rows: Object.freeze(rows),
    selectionAuthority: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}

export async function fetchFugleRawDailyHistoryV0_1({
  apiKey,
  symbol,
  market,
  companyName = null,
  listingDate = null,
  fromDate,
  toDate,
  observedAt = new Date().toISOString(),
  fetchImpl = globalThis.fetch,
  retryAttempts = 2,
  retryDelayMs = 1200,
  timeoutMs = 30_000,
} = {}) {
  const key = requiredText(apiKey, "apiKey");
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  if (!Number.isInteger(retryAttempts) || retryAttempts < 1 || retryAttempts > 3) {
    throw new Error("retryAttempts must be 1..3");
  }
  if (!Number.isInteger(retryDelayMs) || retryDelayMs < 0 || retryDelayMs > 10000) {
    throw new Error("retryDelayMs must be 0..10000");
  }
  const url = buildFugleRawDailyHistoryUrlV0_1({ symbol, fromDate, toDate });
  let lastError = null;
  for (let attempt = 1; attempt <= retryAttempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        method: "GET",
        headers: { "X-API-KEY": key, accept: "application/json" },
        signal: AbortSignal.timeout(timeoutMs),
      });
      const status = Number(response?.status);
      if (status === 404) {
        return normalizeFugleRawDailyHistoryV0_1({
          symbol, market, companyName, listingDate, fromDate, toDate, observedAt,
          rawHistory: {
            symbol: String(symbol),
            exchange: String(market),
            timeframe: "D",
            adjusted: false,
            data: [],
          },
        });
      }
      if (!response?.ok) {
        throw new Error("FUGLE_RAW_HISTORY_HTTP_" + status);
      }
      const payload = await response.json();
      return normalizeFugleRawDailyHistoryV0_1({
        symbol, market, companyName, listingDate, fromDate, toDate, observedAt, rawHistory: payload,
      });
    } catch (error) {
      lastError = error;
      const msg = String(error?.message || error);
      const retryable =
        msg.includes("HTTP_429")
        || /HTTP_5\d\d/.test(msg)
        || error?.name === "TimeoutError"
        || error?.name === "AbortError"
        || error instanceof TypeError;
      if (!retryable || attempt >= retryAttempts) throw error;
      if (retryDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs * attempt));
      }
    }
  }
  throw lastError || new Error("Fugle raw history fetch failed");
}
