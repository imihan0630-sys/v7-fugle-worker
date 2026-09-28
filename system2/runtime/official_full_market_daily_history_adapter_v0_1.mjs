import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const OFFICIAL_FULL_MARKET_DAILY_HISTORY_VERSION = "0.1-RESEARCH";
export const DEFAULT_HISTORICAL_DECISION_SAFE_TIME_UTC = "10:10:00.000Z";

export const OFFICIAL_FULL_MARKET_DAILY_SOURCES = deepFreeze({
  TWSE: {
    sourceId: "TWSE_MI_INDEX_ALLBUT0999",
    sourceName: "TWSE MI_INDEX daily all securities excluding warrants/CBBC",
    sourceUrlTemplate: "https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date={YYYYMMDD}&type=ALLBUT0999&response=json",
  },
  TPEX: {
    sourceId: "TPEX_OTC_DAILY_QUOTES_ALL",
    sourceName: "TPEx daily close quotes all mainboard securities",
    sourceUrlTemplate: "https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes_no1430/stk_wn1430_result.php?l=zh-tw&d={ROC_YYY/MM/DD}&se=EW&o=json",
  },
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoDate(value, field = "marketDate") {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return text;
}

function ordinarySymbol(value) {
  return /^[1-9][0-9]{3}$/.test(String(value || "").trim());
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#43;", "+")
    .replaceAll("&#45;", "-")
    .replaceAll("＋", "+")
    .replaceAll("－", "-")
    .trim();
}

function numberOrNull(value, { positive = false, nonNegative = false } = {}) {
  const raw = cleanText(value)
    .replaceAll(",", "")
    .replaceAll("%", "")
    .replace(/^X/i, "")
    .trim();
  if (!raw || raw === "--" || raw === "---" || raw.toUpperCase() === "N/A") return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  if (positive && n <= 0) return null;
  if (nonNegative && n < 0) return null;
  return n;
}

function fieldIndex(fields, aliases) {
  const normalized = fields.map(cleanText);
  for (const alias of aliases) {
    const index = normalized.indexOf(alias);
    if (index >= 0) return index;
  }
  return -1;
}

function readByAliases(row, fields, aliases, fallbackIndex = -1) {
  const index = fieldIndex(fields, aliases);
  if (index >= 0) return row[index];
  return fallbackIndex >= 0 ? row[fallbackIndex] : null;
}

function candidateTables(payload) {
  const out = [];
  if (Array.isArray(payload?.tables)) {
    for (const table of payload.tables) {
      if (Array.isArray(table?.fields) && Array.isArray(table?.data)) {
        out.push({ fields: table.fields, data: table.data, title: table.title || null });
      }
    }
  }

  if (Array.isArray(payload?.fields) && Array.isArray(payload?.data)) {
    out.push({ fields: payload.fields, data: payload.data, title: payload.title || null });
  }

  for (const [key, fields] of Object.entries(payload || {})) {
    if (!/^fields\d*$/.test(key) || !Array.isArray(fields)) continue;
    const suffix = key.slice("fields".length);
    const data = payload["data" + suffix];
    if (Array.isArray(data)) out.push({ fields, data, title: payload["title" + suffix] || null });
  }

  return out;
}

function findTable(payload, requiredAliases) {
  for (const table of candidateTables(payload)) {
    const normalized = table.fields.map(cleanText);
    if (requiredAliases.every((aliases) => aliases.some((x) => normalized.includes(x)))) {
      return table;
    }
  }
  return null;
}

function assertOhlc({ open, high, low, close }, key) {
  if ([open, high, low, close].every(Number.isFinite)) {
    if (high < low || high < open || high < close || low > open || low > close) {
      throw new Error("inconsistent OHLC: " + key);
    }
  }
}

function signedTwseChange(signRaw, deltaRaw) {
  const sign = cleanText(signRaw);
  const delta = numberOrNull(deltaRaw, { nonNegative: true });
  if (delta === null) return null;
  if (sign === "+") return delta;
  if (sign === "-") return -delta;
  if (sign === "" && delta === 0) return 0;
  return null;
}

function normalizedBase({
  market,
  symbol,
  companyName,
  marketDate,
  open,
  high,
  low,
  close,
  volumeShares,
  tradeValue,
  transactions,
  change,
  source,
  sourceUrl,
  sourceFields,
  observedAt,
  availableAt,
}) {
  assertOhlc({ open, high, low, close }, market + "|" + symbol + "|" + marketDate);
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
    sourceUrl,
    observedAt,
    availableAt,
    availabilityBasis: "SESSION_CLOSE_FINALITY",
    sourceFields,
  };
}

function normalizeTwseRows(payload, marketDate, observedAt, availableAt, sourceUrl) {
  const table = findTable(payload, [
    ["證券代號"],
    ["收盤價"],
    ["成交股數"],
  ]);
  if (!table) {
    if (String(payload?.stat || "").toUpperCase().includes("NO DATA")) return [];
    throw new Error("TWSE MI_INDEX security table not found");
  }
  const source = OFFICIAL_FULL_MARKET_DAILY_SOURCES.TWSE;
  const out = [];
  for (const row of table.data) {
    if (!Array.isArray(row)) continue;
    const symbol = cleanText(readByAliases(row, table.fields, ["證券代號"], 0));
    if (!ordinarySymbol(symbol)) continue;
    const companyName = cleanText(readByAliases(row, table.fields, ["證券名稱"], 1)) || null;
    const volumeShares = numberOrNull(readByAliases(row, table.fields, ["成交股數"]), { nonNegative: true });
    const transactions = numberOrNull(readByAliases(row, table.fields, ["成交筆數"]), { nonNegative: true });
    const tradeValue = numberOrNull(readByAliases(row, table.fields, ["成交金額"]), { nonNegative: true });
    const open = numberOrNull(readByAliases(row, table.fields, ["開盤價"]), { positive: true });
    const high = numberOrNull(readByAliases(row, table.fields, ["最高價"]), { positive: true });
    const low = numberOrNull(readByAliases(row, table.fields, ["最低價"]), { positive: true });
    const close = numberOrNull(readByAliases(row, table.fields, ["收盤價"]), { positive: true });
    const change = signedTwseChange(
      readByAliases(row, table.fields, ["漲跌(+/-)", "漲跌(+／-)"]),
      readByAliases(row, table.fields, ["漲跌價差"]),
    );
    out.push(normalizedBase({
      market: "TWSE",
      symbol,
      companyName,
      marketDate,
      open,
      high,
      low,
      close,
      volumeShares,
      tradeValue,
      transactions,
      change,
      source,
      sourceUrl,
      sourceFields: Object.freeze([...row]),
      observedAt,
      availableAt,
    }));
  }
  return out;
}

function normalizeTpexRows(payload, marketDate, observedAt, availableAt, sourceUrl) {
  const table = findTable(payload, [
    ["代號", "證券代號"],
    ["收盤", "收盤價"],
  ]) || (
    Array.isArray(payload?.aaData)
      ? {
          fields: [
            "代號", "名稱", "收盤", "漲跌", "開盤", "最高", "最低",
            "均價", "成交股數", "成交金額", "成交筆數",
          ],
          data: payload.aaData,
          title: null,
        }
      : null
  );
  if (!table) {
    if (Number(payload?.iTotalRecords) === 0) return [];
    throw new Error("TPEx daily quote security table not found");
  }

  const source = OFFICIAL_FULL_MARKET_DAILY_SOURCES.TPEX;
  const out = [];
  for (const row of table.data) {
    if (!Array.isArray(row)) continue;
    const symbol = cleanText(readByAliases(row, table.fields, ["代號", "證券代號"], 0));
    if (!ordinarySymbol(symbol)) continue;
    const companyName = cleanText(readByAliases(row, table.fields, ["名稱", "證券名稱"], 1)) || null;
    const close = numberOrNull(readByAliases(row, table.fields, ["收盤", "收盤價"], 2), { positive: true });
    const change = numberOrNull(readByAliases(row, table.fields, ["漲跌", "漲跌價差"], 3));
    const open = numberOrNull(readByAliases(row, table.fields, ["開盤", "開盤價"], 4), { positive: true });
    const high = numberOrNull(readByAliases(row, table.fields, ["最高", "最高價"], 5), { positive: true });
    const low = numberOrNull(readByAliases(row, table.fields, ["最低", "最低價"], 6), { positive: true });
    const volumeShares = numberOrNull(
      readByAliases(row, table.fields, ["成交股數", "成交量"], 8),
      { nonNegative: true },
    );
    const tradeValue = numberOrNull(
      readByAliases(row, table.fields, ["成交金額", "成交金額(元)"], 9),
      { nonNegative: true },
    );
    const transactions = numberOrNull(
      readByAliases(row, table.fields, ["成交筆數"], 10),
      { nonNegative: true },
    );
    out.push(normalizedBase({
      market: "TPEX",
      symbol,
      companyName,
      marketDate,
      open,
      high,
      low,
      close,
      volumeShares,
      tradeValue,
      transactions,
      change,
      source,
      sourceUrl,
      sourceFields: Object.freeze([...row]),
      observedAt,
      availableAt,
    }));
  }
  return out;
}

export function buildOfficialFullMarketDailyUrl({ market, marketDate } = {}) {
  const mkt = requiredText(market, "market");
  const date = isoDate(marketDate);
  const source = OFFICIAL_FULL_MARKET_DAILY_SOURCES[mkt];
  if (!source) throw new Error("unsupported market: " + mkt);
  const [year, month, day] = date.split("-");
  if (mkt === "TWSE") {
    return source.sourceUrlTemplate.replace("{YYYYMMDD}", year + month + day);
  }
  return source.sourceUrlTemplate.replace(
    "{ROC_YYY/MM/DD}",
    String(Number(year) - 1911) + "/" + month + "/" + day,
  );
}

export function conservativeHistoricalAvailableAt(marketDate) {
  const date = isoDate(marketDate);
  return date + "T" + DEFAULT_HISTORICAL_DECISION_SAFE_TIME_UTC;
}

export async function normalizeOfficialFullMarketDailyPayloadV0_1({
  market,
  marketDate,
  payload,
  observedAt,
  availableAt = null,
} = {}) {
  const mkt = requiredText(market, "market");
  const date = isoDate(marketDate);
  const observed = isoTimestamp(observedAt, "observedAt");
  const available = isoTimestamp(
    availableAt || conservativeHistoricalAvailableAt(date),
    "availableAt",
  );
  const source = OFFICIAL_FULL_MARKET_DAILY_SOURCES[mkt];
  if (!source) throw new Error("unsupported market: " + mkt);
  const sourceUrl = buildOfficialFullMarketDailyUrl({ market: mkt, marketDate: date });

  const rows = mkt === "TWSE"
    ? normalizeTwseRows(payload, date, observed, available, sourceUrl)
    : normalizeTpexRows(payload, date, observed, available, sourceUrl);

  const seen = new Set();
  for (const row of rows) {
    const key = row.market + "|" + row.symbol + "|" + row.marketDate;
    if (seen.has(key)) throw new Error("duplicate ordinary symbol in full-market payload: " + key);
    seen.add(key);
  }
  rows.sort((a, b) => a.symbol.localeCompare(b.symbol));

  const base = {
    market: mkt,
    marketDate: date,
    sourceId: source.sourceId,
    sourceName: source.sourceName,
    sourceUrl,
    observedAt: observed,
    availableAt: available,
    ordinarySymbolCount: rows.length,
    rows: Object.freeze(rows),
    universeEvidenceSemantics: "ACTUAL_DAILY_MARKET_PRESENCE_NOT_CURRENT-LIST_SURVIVORSHIP_PROXY",
    continuityStateAssigned: "UNVERIFIED",
    schemaVersion: "S2_OFFICIAL_FULL_MARKET_DAILY_PAYLOAD_V0_1",
  };
  const payloadHash = await sha256Hex(base);
  return deepFreeze({ ...base, payloadHash });
}

export async function fetchOfficialFullMarketDailyPayloadV0_1({
  market,
  marketDate,
  fetchImpl = fetch,
  timeoutMs = 15000,
} = {}) {
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl must be a function");
  const url = buildOfficialFullMarketDailyUrl({ market, marketDate });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      method: "GET",
      headers: {
        Accept: "application/json,text/plain,*/*",
        "User-Agent": "System2-Research-FullMarketBackfill/0.1",
      },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("official full-market source HTTP " + response.status);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}
