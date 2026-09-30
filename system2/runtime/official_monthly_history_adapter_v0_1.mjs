import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const OFFICIAL_MONTHLY_HISTORY_ADAPTER_VERSION = "0.1-RESEARCH";

export const OFFICIAL_MONTHLY_HISTORY_SOURCES = deepFreeze({
  TWSE: {
    sourceId: "TWSE_STOCK_DAY_MONTHLY",
    sourceName: "TWSE STOCK_DAY monthly individual-security history",
    sourceUrlTemplate: "https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY?date={YYYYMM01}&stockNo={SYMBOL}&response=json",
    officialHost: "www.twse.com.tw",
  },
  TPEX: {
    sourceId: "TPEX_ST43_MONTHLY",
    sourceName: "TPEx individual mainboard stock daily history (monthly query)",
    sourceUrlTemplate: "https://www.tpex.org.tw/web/stock/aftertrading/daily_trading_info/st43_result.php?d={ROC_YYY/MM}&stkno={SYMBOL}",
    officialHost: "www.tpex.org.tw",
  },
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function assertMonth(value, field = "yearMonth") {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM");
  const month = Number(text.slice(5, 7));
  if (month < 1 || month > 12) throw new Error(field + " has invalid month");
  return text;
}

function assertTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return text;
}

function ordinarySymbol(value) {
  return /^[1-9][0-9]{3}$/.test(String(value || "").trim());
}

function numberOrNull(value, { positive = false, nonNegative = false } = {}) {
  if (value === null || value === undefined || value === "") return null;
  const raw = String(value)
    .replaceAll(",", "")
    .replaceAll("＋", "+")
    .replaceAll("－", "-")
    .replace(/^X/i, "")
    .trim();
  if (!raw || raw === "--" || raw === "---" || raw.toUpperCase() === "N/A") return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  if (positive && n <= 0) return null;
  if (nonNegative && n < 0) return null;
  return n;
}

function gregorianDateFromTwse(value) {
  const text = String(value || "").trim().replaceAll("/", "-");
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  return null;
}

function gregorianDateFromTpex(value) {
  const text = String(value || "").trim();
  const m = text.match(/^(\d{2,3})\/(\d{2})\/(\d{2})$/);
  if (!m) return null;
  const year = Number(m[1]) + 1911;
  return String(year).padStart(4, "0") + "-" + m[2] + "-" + m[3];
}

function assertOhlc(open, high, low, close, fieldPrefix) {
  const complete = [open, high, low, close].every(Number.isFinite);
  if (complete && (high < low || high < open || high < close || low > open || low > close)) {
    throw new Error(fieldPrefix + " has inconsistent OHLC");
  }
}

function normalizeCommon({
  market,
  symbol,
  companyName,
  marketDate,
  row,
  observedAt,
  availableAt,
  availabilityBasis,
  source,
}) {
  const volumeShares = numberOrNull(row.volumeShares, { nonNegative: true });
  const tradeValue = numberOrNull(row.tradeValue, { nonNegative: true });
  const open = numberOrNull(row.open, { positive: true });
  const high = numberOrNull(row.high, { positive: true });
  const low = numberOrNull(row.low, { positive: true });
  const close = numberOrNull(row.close, { positive: true });
  const change = numberOrNull(row.change);
  const transactions = numberOrNull(row.transactions, { nonNegative: true });
  assertOhlc(open, high, low, close, market + "|" + symbol + "|" + marketDate);

  return {
    marketDate,
    market,
    symbol,
    companyName: companyName || null,
    priceSpace: "RAW",
    open,
    high,
    low,
    close,
    volumeShares,
    tradeValue,
    transactions,
    change,
    continuityState: "UNVERIFIED",
    sourceId: source.sourceId,
    sourceName: source.sourceName,
    sourceUrl: row.sourceUrl || null,
    observedAt,
    availableAt,
    availabilityBasis,
    sourceFields: row.sourceFields,
  };
}

export function buildOfficialMonthlyHistoryUrl({ market, symbol, yearMonth } = {}) {
  const mkt = requiredText(market, "market");
  const code = requiredText(symbol, "symbol");
  if (!ordinarySymbol(code)) throw new Error("symbol must be an ordinary four-digit equity code");
  const ym = assertMonth(yearMonth);
  const source = OFFICIAL_MONTHLY_HISTORY_SOURCES[mkt];
  if (!source) throw new Error("unsupported market: " + mkt);
  const [year, month] = ym.split("-");
  if (mkt === "TWSE") {
    return source.sourceUrlTemplate
      .replace("{YYYYMM01}", year + month + "01")
      .replace("{SYMBOL}", code);
  }
  const rocYear = String(Number(year) - 1911);
  return source.sourceUrlTemplate
    .replace("{ROC_YYY/MM}", rocYear + "/" + month)
    .replace("{SYMBOL}", code);
}

function rowsFromTwsePayload(payload) {
  if (!payload || typeof payload !== "object") throw new Error("TWSE payload must be an object");
  if (!Array.isArray(payload.data)) {
    if (String(payload.stat || "").toUpperCase().includes("NO DATA")) return [];
    throw new Error("TWSE payload.data must be an array");
  }
  return payload.data.map((r, i) => {
    if (!Array.isArray(r) || r.length < 9) throw new Error("TWSE data row " + i + " is malformed");
    return {
      marketDate: gregorianDateFromTwse(r[0]),
      volumeShares: r[1],
      tradeValue: r[2],
      open: r[3],
      high: r[4],
      low: r[5],
      close: r[6],
      change: r[7],
      transactions: r[8],
      sourceFields: r,
    };
  });
}

function rowsFromTpexPayload(payload) {
  if (!payload || typeof payload !== "object") throw new Error("TPEx payload must be an object");
  const rows = Array.isArray(payload.aaData)
    ? payload.aaData
    : Array.isArray(payload.data)
      ? payload.data
      : null;
  if (!rows) {
    if (Number(payload.iTotalRecords) === 0) return [];
    throw new Error("TPEx payload aaData/data must be an array");
  }
  return rows.map((r, i) => {
    if (!Array.isArray(r) || r.length < 9) throw new Error("TPEx data row " + i + " is malformed");
    return {
      marketDate: gregorianDateFromTpex(r[0]),
      volumeShares: r[1],
      tradeValue: r[2],
      open: r[3],
      high: r[4],
      low: r[5],
      close: r[6],
      change: r[7],
      transactions: r[8],
      sourceFields: r,
    };
  });
}

export async function normalizeOfficialMonthlyHistoryPayloadV0_1({
  market,
  symbol,
  companyName = null,
  yearMonth,
  payload,
  observedAt,
  availableAtByDate = null,
  availabilityBasis = "SESSION_CLOSE_FINALITY",
} = {}) {
  const mkt = requiredText(market, "market");
  const code = requiredText(symbol, "symbol");
  if (!ordinarySymbol(code)) throw new Error("symbol must be an ordinary four-digit equity code");
  const ym = assertMonth(yearMonth);
  const observed = assertTimestamp(observedAt, "observedAt");
  const source = OFFICIAL_MONTHLY_HISTORY_SOURCES[mkt];
  if (!source) throw new Error("unsupported market: " + mkt);

  const rawRows = mkt === "TWSE" ? rowsFromTwsePayload(payload) : rowsFromTpexPayload(payload);
  const sourceUrl = buildOfficialMonthlyHistoryUrl({ market: mkt, symbol: code, yearMonth: ym });
  const seen = new Set();
  const rows = [];

  for (const raw of rawRows) {
    if (!raw.marketDate || raw.marketDate.slice(0, 7) !== ym) {
      throw new Error("source row market date is missing or outside requested month");
    }
    if (seen.has(raw.marketDate)) throw new Error("duplicate market date in monthly payload: " + raw.marketDate);
    seen.add(raw.marketDate);

    let availableAt = null;
    if (typeof availableAtByDate === "function") {
      availableAt = availableAtByDate(raw.marketDate);
    } else if (availableAtByDate && typeof availableAtByDate === "object") {
      availableAt = availableAtByDate[raw.marketDate] || null;
    }
    if (availableAt !== null && availableAt !== undefined && availableAt !== "") {
      availableAt = assertTimestamp(availableAt, "availableAtByDate." + raw.marketDate);
    } else if (availabilityBasis === "SESSION_CLOSE_FINALITY") {
      availableAt = raw.marketDate + "T05:30:00.000Z";
    }

    rows.push(normalizeCommon({
      market: mkt,
      symbol: code,
      companyName,
      marketDate: raw.marketDate,
      row: { ...raw, sourceUrl },
      observedAt: observed,
      availableAt,
      availabilityBasis: availableAt ? availabilityBasis : "UNKNOWN",
      source,
    }));
  }

  rows.sort((a, b) => a.marketDate.localeCompare(b.marketDate));
  const base = {
    market: mkt,
    symbol: code,
    companyName: companyName || null,
    yearMonth: ym,
    sourceId: source.sourceId,
    sourceName: source.sourceName,
    sourceUrl,
    observedAt: observed,
    rowCount: rows.length,
    firstMarketDate: rows[0]?.marketDate || null,
    lastMarketDate: rows.at(-1)?.marketDate || null,
    rows: Object.freeze(rows),
    payloadHash: null,
    schemaVersion: "S2_OFFICIAL_MONTHLY_HISTORY_PAYLOAD_V0_1",
  };
  const payloadHash = await sha256Hex({ ...base, payloadHash: undefined });
  return deepFreeze({ ...base, payloadHash });
}

export async function fetchOfficialMonthlyHistoryPayloadV0_1({
  market,
  symbol,
  yearMonth,
  fetchImpl = fetch,
  timeoutMs = 15000,
} = {}) {
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl must be a function");
  const url = buildOfficialMonthlyHistoryUrl({ market, symbol, yearMonth });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      method: "GET",
      headers: {
        Accept: "application/json,text/plain,*/*",
        "User-Agent": "System2-Research-HistoricalBackfill/0.1",
      },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("official history source HTTP " + response.status);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}
