import { deepFreeze } from "./factor_snapshot.mjs";

export const OFFICIAL_HISTORICAL_A1_SOURCE_VERSION = "0.1-RESEARCH";

export const OFFICIAL_HISTORICAL_A1_SOURCES = deepFreeze({
  TWSE: {
    sourceId: "A1_TWSE_MI_INDEX_HISTORICAL_DAILY",
    sourceName: "TWSE MI_INDEX daily close historical report",
    sourceUrl: "https://www.twse.com.tw/exchangeReport/MI_INDEX",
    sourcePage: "https://www.twse.com.tw/zh/trading/historical/mi-index.html",
  },
  TPEX: {
    sourceId: "A1_TPEX_DAILY_QUOTES_HISTORICAL",
    sourceName: "TPEx afterTrading dailyQuotes historical report",
    sourceUrl: "https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes",
    sourcePage: "https://www.tpex.org.tw/zh-tw/mainboard/trading/info/pricing.html",
  },
});

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
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return text;
}

function compactDate(date) {
  return date.replaceAll("-", "");
}

function slashDate(date) {
  return date.replaceAll("-", "/");
}

function rocDateToIso(value) {
  const match = String(value || "").match(/(\d{2,3})[\/-](\d{1,2})[\/-](\d{1,2})/);
  if (!match) return null;
  const year = Number(match[1]) + 1911;
  const month = String(Number(match[2])).padStart(2, "0");
  const day = String(Number(match[3])).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function titleRocDateToIso(value) {
  const match = String(value || "").match(/(\d{2,3})年(\d{1,2})月(\d{1,2})日/);
  if (!match) return null;
  const year = Number(match[1]) + 1911;
  return `${year}-${String(Number(match[2])).padStart(2, "0")}-${String(Number(match[3])).padStart(2, "0")}`;
}

function payloadDateToIso(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return null;
}

function stripMarkup(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replaceAll("&nbsp;", " ")
    .trim();
}

function numberOrNull(value, { positive = false, nonNegative = false } = {}) {
  const text = stripMarkup(value)
    .replaceAll(",", "")
    .replaceAll("%", "")
    .replace(/^\+/, "")
    .trim();
  if (!text || text === "--" || text === "---" || text.toUpperCase() === "N/A") return null;
  const number = Number(text);
  if (!Number.isFinite(number)) return null;
  if (positive && number <= 0) return null;
  if (nonNegative && number < 0) return null;
  return number;
}

function ordinarySymbol(value) {
  return /^[1-9][0-9]{3}$/.test(String(value || "").trim());
}

function indexOfField(fields, aliases) {
  for (const alias of aliases) {
    const index = fields.findIndex((field) => stripMarkup(field) === alias);
    if (index >= 0) return index;
  }
  return -1;
}

function readField(row, fields, aliases) {
  const index = indexOfField(fields, aliases);
  return index >= 0 ? row[index] : null;
}

function candidateTables(payload) {
  if (Array.isArray(payload?.tables)) return payload.tables;
  const tables = [];
  for (const [key, fields] of Object.entries(payload || {})) {
    if (!/^fields\d*$/.test(key) || !Array.isArray(fields)) continue;
    const suffix = key.slice("fields".length);
    const data = payload["data" + suffix];
    if (Array.isArray(data)) tables.push({ title: payload["title" + suffix] || "", fields, data });
  }
  return tables;
}

function findTwseDailyTable(payload) {
  return candidateTables(payload).find((table) => {
    const fields = (table.fields || []).map(stripMarkup);
    return fields.includes("證券代號")
      && fields.includes("證券名稱")
      && fields.includes("成交股數")
      && fields.includes("開盤價")
      && fields.includes("最高價")
      && fields.includes("最低價")
      && fields.includes("收盤價");
  }) || null;
}

function findTpexDailyTable(payload) {
  return candidateTables(payload).find((table) => {
    const fields = (table.fields || []).map(stripMarkup);
    return fields.includes("代號")
      && fields.includes("名稱")
      && fields.includes("成交股數")
      && fields.includes("開盤")
      && fields.includes("最高")
      && fields.includes("最低")
      && fields.includes("收盤");
  }) || null;
}

function sourceDateEvidence(payload, table) {
  const direct = payloadDateToIso(payload?.date);
  if (direct) return { date: direct, basis: "PAYLOAD_DATE" };
  const tableDate = rocDateToIso(table?.date);
  if (tableDate) return { date: tableDate, basis: "TABLE_ROC_DATE" };
  const titleDate = titleRocDateToIso(table?.title);
  if (titleDate) return { date: titleDate, basis: "TABLE_TITLE_ROC_DATE" };
  return { date: null, basis: "MISSING" };
}

function afterCloseFinalityTimestamp(marketDate) {
  return marketDate + "T05:30:00Z";
}

function normalizeTwseRows(table, marketDate, observedAt) {
  const fields = table.fields.map(stripMarkup);
  return (table.data || []).flatMap((rawRow) => {
    const symbol = stripMarkup(readField(rawRow, fields, ["證券代號"]));
    if (!ordinarySymbol(symbol)) return [];
    const open = numberOrNull(readField(rawRow, fields, ["開盤價"]), { positive: true });
    const high = numberOrNull(readField(rawRow, fields, ["最高價"]), { positive: true });
    const low = numberOrNull(readField(rawRow, fields, ["最低價"]), { positive: true });
    const close = numberOrNull(readField(rawRow, fields, ["收盤價"]), { positive: true });
    if ([open, high, low, close].every(Number.isFinite)
      && (high < low || high < open || high < close || low > open || low > close)) {
      throw new Error("TWSE official historical OHLC inconsistency for " + symbol + " on " + marketDate);
    }
    return [{
      marketDate,
      market: "TWSE",
      symbol,
      companyName: stripMarkup(readField(rawRow, fields, ["證券名稱"])) || null,
      priceSpace: "RAW",
      open,
      high,
      low,
      close,
      volumeShares: numberOrNull(readField(rawRow, fields, ["成交股數"]), { nonNegative: true }),
      tradeValue: numberOrNull(readField(rawRow, fields, ["成交金額"]), { nonNegative: true }),
      transactions: numberOrNull(readField(rawRow, fields, ["成交筆數"]), { nonNegative: true }),
      change: numberOrNull(readField(rawRow, fields, ["漲跌價差"])),
      continuityState: "UNVERIFIED",
      observedAt,
      availableAt: afterCloseFinalityTimestamp(marketDate),
      availabilityBasis: "SESSION_CLOSE_FINALITY",
      sourceFields: {
        fields,
        row: rawRow,
      },
    }];
  });
}

function normalizeTpexRows(table, marketDate, observedAt) {
  const fields = table.fields.map(stripMarkup);
  return (table.data || []).flatMap((rawRow) => {
    const symbol = stripMarkup(readField(rawRow, fields, ["代號"]));
    if (!ordinarySymbol(symbol)) return [];
    const open = numberOrNull(readField(rawRow, fields, ["開盤"]), { positive: true });
    const high = numberOrNull(readField(rawRow, fields, ["最高"]), { positive: true });
    const low = numberOrNull(readField(rawRow, fields, ["最低"]), { positive: true });
    const close = numberOrNull(readField(rawRow, fields, ["收盤"]), { positive: true });
    if ([open, high, low, close].every(Number.isFinite)
      && (high < low || high < open || high < close || low > open || low > close)) {
      throw new Error("TPEx official historical OHLC inconsistency for " + symbol + " on " + marketDate);
    }
    return [{
      marketDate,
      market: "TPEX",
      symbol,
      companyName: stripMarkup(readField(rawRow, fields, ["名稱"])) || null,
      priceSpace: "RAW",
      open,
      high,
      low,
      close,
      volumeShares: numberOrNull(readField(rawRow, fields, ["成交股數"]), { nonNegative: true }),
      tradeValue: numberOrNull(readField(rawRow, fields, ["成交金額(元)", "成交金額"]), { nonNegative: true }),
      transactions: numberOrNull(readField(rawRow, fields, ["成交筆數"]), { nonNegative: true }),
      change: numberOrNull(readField(rawRow, fields, ["漲跌"])),
      continuityState: "UNVERIFIED",
      observedAt,
      availableAt: afterCloseFinalityTimestamp(marketDate),
      availabilityBasis: "SESSION_CLOSE_FINALITY",
      sourceFields: {
        fields,
        row: rawRow,
      },
    }];
  });
}

export function buildOfficialHistoricalA1UrlV0_1(market, marketDate) {
  const date = isoDate(marketDate, "marketDate");
  if (market === "TWSE") {
    return `${OFFICIAL_HISTORICAL_A1_SOURCES.TWSE.sourceUrl}?response=json&date=${compactDate(date)}&type=ALLBUT0999`;
  }
  if (market === "TPEX") {
    return `${OFFICIAL_HISTORICAL_A1_SOURCES.TPEX.sourceUrl}?response=json&date=${encodeURIComponent(slashDate(date))}`;
  }
  throw new Error("unsupported market: " + market);
}

export function parseOfficialHistoricalA1PayloadV0_1({
  market,
  marketDate,
  payload,
  observedAt,
} = {}) {
  const date = isoDate(marketDate, "marketDate");
  const observed = timestamp(observedAt, "observedAt");
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("official historical payload must be an object");
  }

  const table = market === "TWSE"
    ? findTwseDailyTable(payload)
    : market === "TPEX"
      ? findTpexDailyTable(payload)
      : null;
  if (!table) throw new Error("official historical daily table not found for " + market);

  const evidence = sourceDateEvidence(payload, table);
  if (!evidence.date) throw new Error("official historical source date evidence is missing");
  if (evidence.date !== date) {
    throw new Error(
      `SOURCE_DATE_MISMATCH:${market}:requested=${date}:received=${evidence.date}`,
    );
  }

  const rows = market === "TWSE"
    ? normalizeTwseRows(table, date, observed)
    : normalizeTpexRows(table, date, observed);
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.symbol)) {
      throw new Error("duplicate ordinary symbol in official historical payload: " + row.symbol);
    }
    seen.add(row.symbol);
  }

  return deepFreeze({
    market,
    marketDate: date,
    sourceId: OFFICIAL_HISTORICAL_A1_SOURCES[market].sourceId,
    sourceName: OFFICIAL_HISTORICAL_A1_SOURCES[market].sourceName,
    sourceUrl: buildOfficialHistoricalA1UrlV0_1(market, date),
    sourceDateEvidence: evidence.date,
    sourceDateEvidenceBasis: evidence.basis,
    ordinarySymbolCount: rows.length,
    rows: Object.freeze(rows),
    state: rows.length ? "READY" : "NO_DATA",
    rawPriceSpace: "RAW",
    continuityState: "UNVERIFIED",
    historicalPublicationTimestampProven: false,
    availabilitySemantics: "SESSION_CLOSE_FINALITY_NOT_HISTORICAL_ENDPOINT_PUBLICATION_TIME",
    schemaVersion: "S2_OFFICIAL_HISTORICAL_A1_DATE_V0_1",
  });
}

export async function fetchOfficialHistoricalA1DateV0_1({
  market,
  marketDate,
  observedAt = new Date().toISOString(),
  fetchImpl = globalThis.fetch,
} = {}) {
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  const url = buildOfficialHistoricalA1UrlV0_1(market, marketDate);
  const response = await fetchImpl(url, {
    method: "GET",
    headers: {
      Accept: "application/json,text/plain,*/*",
      "User-Agent": "System2-Historical-Research/0.1",
      Referer: OFFICIAL_HISTORICAL_A1_SOURCES[market]?.sourcePage || "",
    },
  });
  if (!response?.ok) {
    throw new Error(`official historical A1 source error ${market} ${marketDate}: HTTP ${response?.status}`);
  }
  const payload = await response.json();
  return parseOfficialHistoricalA1PayloadV0_1({
    market,
    marketDate,
    payload,
    observedAt,
  });
}

export function officialHistoricalA1SourceContractV0_1(market) {
  const source = OFFICIAL_HISTORICAL_A1_SOURCES[market];
  if (!source) throw new Error("unsupported market: " + market);
  return deepFreeze({
    ...source,
    contractVersion: OFFICIAL_HISTORICAL_A1_SOURCE_VERSION,
    fetchMode: "ONE_MARKET_ONE_TRADING_DATE",
    authenticationRequired: false,
    historicalDateRequired: true,
    sourceDateMustMatchRequestedDate: true,
    rawPriceSpace: "RAW",
    continuityState: "UNVERIFIED",
  });
}

export {
  afterCloseFinalityTimestamp,
  payloadDateToIso,
  rocDateToIso,
  titleRocDateToIso,
};
