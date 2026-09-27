import {
  SOURCE_ARRIVAL_REGISTRY_V0_1,
  buildSourceProbeReceipt,
  taipeiMarketCloseTimestamp,
} from "./source_arrival_latency.mjs";

const DEFAULT_TIMEOUT_MS = 30_000;
const USER_AGENT = "System2-ReadOnly-Source-Arrival/0.2";

export const A1_DAILY_CLOSE_VALIDATION_VERSION = "S2_A1_DAILY_CLOSE_VALIDATION_V0_2";

function rocDate(marketDate) {
  const [year, month, day] = marketDate.split("-").map(Number);
  return `${year - 1911}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
}

export function normalizeOfficialDate(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 7) {
    return `${Number(digits.slice(0, 3)) + 1911}-${digits.slice(3, 5)}-${digits.slice(5, 7)}`;
  }
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return null;
}

export function officialSourceUrl(sourceId, marketDate) {
  const ymd = marketDate.replaceAll("-", "");
  const month = `${marketDate.slice(0, 7).replaceAll("-", "")}01`;
  const urls = {
    A1_TWSE_DAILY_CLOSE: "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL",
    A1_TPEX_DAILY_CLOSE: "https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes",
    A2_TAIEX_CLOSE: `https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=${month}`,
    A3_TWSE_INSTITUTION_FLOW: `https://www.twse.com.tw/rwd/zh/fund/T86?response=json&date=${ymd}&selectType=ALL`,
    A3_TPEX_INSTITUTION_FLOW: `https://www.tpex.org.tw/www/zh-tw/insti/dailyTrade?type=Daily&sect=EW&date=${encodeURIComponent(rocDate(marketDate))}&id=&response=json`,
    A6_TWSE_VALUATION: `https://www.twse.com.tw/exchangeReport/BWIBBU_d?response=json&date=${ymd}&selectType=ALL`,
    A6_TPEX_VALUATION: "https://www.tpex.org.tw/openapi/v1/tpex_mainboard_peratio_analysis",
  };
  if (!urls[sourceId]) throw new Error(`no official URL for sourceId: ${sourceId}`);
  return urls[sourceId];
}

function ordinarySymbol(value) {
  return /^[1-9][0-9]{3}$/.test(String(value || "").trim());
}

function numericPrice(value) {
  const raw = String(value ?? "").replaceAll(",", "").trim();
  if (!raw || raw === "--" || raw === "---" || raw.toUpperCase() === "N/A") return null;
  const n = Number(raw.replace(/^\+/, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseArrayRows(payload, marketDate, symbolField) {
  if (!Array.isArray(payload)) return { schemaValid: false, payloadDate: null, recordCount: null };
  const dates = new Set(payload.map((row) => normalizeOfficialDate(row?.Date)).filter(Boolean));
  const rows = payload.filter((row) =>
    normalizeOfficialDate(row?.Date) === marketDate && ordinarySymbol(row?.[symbolField]));
  const payloadDate = rows.length > 0
    ? marketDate
    : [...dates].sort().at(-1) || null;
  return { schemaValid: true, payloadDate, recordCount: rows.length };
}

function parseA1DailyCloseRows(payload, marketDate, symbolField, closeFields) {
  if (!Array.isArray(payload)) {
    return {
      schemaValid: false,
      payloadDate: null,
      recordCount: null,
      validationVersion: A1_DAILY_CLOSE_VALIDATION_VERSION,
      coverageDiagnostics: null,
    };
  }

  const datedOrdinaryRows = [];
  const targetRows = [];
  const dates = new Set();
  let undatedOrdinaryRowCount = 0;

  for (const row of payload) {
    const symbol = String(row?.[symbolField] ?? "").trim();
    if (!ordinarySymbol(symbol)) continue;
    const rowDate = normalizeOfficialDate(row?.Date);
    if (!rowDate) {
      undatedOrdinaryRowCount += 1;
      continue;
    }
    dates.add(rowDate);
    datedOrdinaryRows.push({ row, symbol, rowDate });
    if (rowDate === marketDate) targetRows.push({ row, symbol });
  }

  const uniqueSymbols = new Set();
  const usableCloseSymbols = new Set();
  let duplicateTargetSymbolRowCount = 0;
  for (const { row, symbol } of targetRows) {
    if (uniqueSymbols.has(symbol)) duplicateTargetSymbolRowCount += 1;
    uniqueSymbols.add(symbol);
    const closeValue = closeFields
      .map((field) => row?.[field])
      .find((value) => value !== undefined && value !== null && String(value).trim() !== "");
    if (numericPrice(closeValue) !== null) usableCloseSymbols.add(symbol);
  }

  const payloadDate = targetRows.length > 0
    ? marketDate
    : [...dates].sort().at(-1) || null;
  const hasDateSchema = payload.length === 0 || datedOrdinaryRows.length > 0;
  const schemaValid = hasDateSchema && duplicateTargetSymbolRowCount === 0;

  return {
    schemaValid,
    payloadDate,
    recordCount: usableCloseSymbols.size,
    validationVersion: A1_DAILY_CLOSE_VALIDATION_VERSION,
    coverageDiagnostics: {
      targetDateOrdinaryRowCount: targetRows.length,
      targetDateUniqueOrdinarySymbolCount: uniqueSymbols.size,
      usableCloseUniqueSymbolCount: usableCloseSymbols.size,
      duplicateTargetSymbolRowCount,
      undatedOrdinaryRowCount,
    },
  };
}

export function parseOfficialSourcePayload(sourceId, payload, marketDate) {
  if (!SOURCE_ARRIVAL_REGISTRY_V0_1[sourceId]) throw new Error(`unknown sourceId: ${sourceId}`);
  if (sourceId === "A1_TWSE_DAILY_CLOSE") {
    return parseA1DailyCloseRows(
      payload,
      marketDate,
      "Code",
      ["ClosingPrice", "Close", "收盤價"],
    );
  }
  if (sourceId === "A1_TPEX_DAILY_CLOSE") {
    return parseA1DailyCloseRows(
      payload,
      marketDate,
      "SecuritiesCompanyCode",
      ["Close", "ClosingPrice", "收盤"],
    );
  }
  if (sourceId === "A6_TPEX_VALUATION") {
    return parseArrayRows(payload, marketDate, "SecuritiesCompanyCode");
  }

  if (sourceId === "A2_TAIEX_CLOSE") {
    const fields = payload?.fields;
    const rows = payload?.data;
    if (String(payload?.stat || "").toUpperCase() !== "OK"
      || !Array.isArray(fields) || !Array.isArray(rows)
      || !fields.includes("日期") || !fields.includes("發行量加權股價指數")) {
      return { schemaValid: false, payloadDate: null, recordCount: null };
    }
    const dateIndex = fields.indexOf("日期");
    const dates = rows.map((row) => normalizeOfficialDate(row?.[dateIndex])).filter(Boolean);
    return {
      schemaValid: true,
      payloadDate: dates.includes(marketDate) ? marketDate : [...dates].sort().at(-1) || null,
      recordCount: dates.filter((date) => date === marketDate).length,
    };
  }

  if (sourceId === "A3_TWSE_INSTITUTION_FLOW" || sourceId === "A6_TWSE_VALUATION") {
    const fields = payload?.fields;
    const rows = payload?.data;
    const symbolField = "證券代號";
    if (String(payload?.stat || "").toUpperCase() !== "OK"
      || !Array.isArray(fields) || !Array.isArray(rows) || !fields.includes(symbolField)) {
      return { schemaValid: false, payloadDate: null, recordCount: null };
    }
    const symbolIndex = fields.indexOf(symbolField);
    return {
      schemaValid: true,
      payloadDate: normalizeOfficialDate(payload?.date),
      recordCount: rows.filter((row) => ordinarySymbol(row?.[symbolIndex])).length,
    };
  }

  if (sourceId === "A3_TPEX_INSTITUTION_FLOW") {
    const table = payload?.tables?.[0];
    if (String(payload?.stat || "").toUpperCase() !== "OK"
      || !Array.isArray(table?.fields) || !Array.isArray(table?.data)
      || table.fields[0] !== "代號") {
      return { schemaValid: false, payloadDate: null, recordCount: null };
    }
    return {
      schemaValid: true,
      payloadDate: normalizeOfficialDate(payload?.date),
      recordCount: table.data.filter((row) => ordinarySymbol(
        String(row?.[0] || "").replaceAll("=", "").replaceAll('"', ""),
      )).length,
    };
  }

  return { schemaValid: false, payloadDate: null, recordCount: null };
}

async function fetchJsonReadOnly(url, fetchImpl, timeoutMs) {
  const response = await fetchImpl(url, {
    method: "GET",
    redirect: "follow",
    headers: { accept: "application/json", "user-agent": USER_AGENT },
    signal: AbortSignal.timeout(timeoutMs),
  });
  const httpStatus = Number(response.status);
  if (!response.ok) return { transportOk: false, httpStatus, errorCode: `HTTP_${httpStatus}` };
  try {
    return { transportOk: true, httpStatus, payload: await response.json(), errorCode: null };
  } catch {
    return { transportOk: true, httpStatus, payload: null, errorCode: "NON_JSON_RESPONSE" };
  }
}

export async function probeOfficialSource({
  sourceId,
  marketDate,
  fetchImpl = fetch,
  now = () => new Date(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  const probeStartedAt = now().toISOString();
  let result;
  try {
    result = await fetchJsonReadOnly(
      officialSourceUrl(sourceId, marketDate),
      fetchImpl,
      timeoutMs,
    );
  } catch (error) {
    const causeCode = String(error?.cause?.code || "");
    result = {
      transportOk: false,
      httpStatus: null,
      errorCode: error?.name === "TimeoutError"
        ? "TIMEOUT"
        : causeCode.startsWith("UNABLE_TO_VERIFY_")
          ? "TLS_CERTIFICATE_ERROR"
          : "NETWORK_ERROR",
    };
  }
  const observedAt = now().toISOString();
  const parsed = result.transportOk
    ? parseOfficialSourcePayload(sourceId, result.payload, marketDate)
    : { schemaValid: false, payloadDate: null, recordCount: null };

  return buildSourceProbeReceipt({
    sourceId,
    marketDate,
    marketCloseTimestamp: taipeiMarketCloseTimestamp(marketDate),
    probeStartedAt,
    observedAt,
    transportOk: result.transportOk,
    httpStatus: result.httpStatus,
    schemaValid: result.transportOk && result.errorCode !== "NON_JSON_RESPONSE" && parsed.schemaValid,
    payloadDate: parsed.payloadDate,
    recordCount: parsed.recordCount,
    validationVersion: parsed.validationVersion || null,
    coverageDiagnostics: parsed.coverageDiagnostics || null,
    errorCode: result.errorCode,
  });
}

export async function probeOfficialSources(options = {}) {
  const sourceIds = options.sourceIds || Object.keys(SOURCE_ARRIVAL_REGISTRY_V0_1);
  if (new Set(sourceIds).size !== sourceIds.length) throw new Error("sourceIds contains duplicates");
  return Promise.all(sourceIds.map((sourceId) => probeOfficialSource({ ...options, sourceId })));
}
