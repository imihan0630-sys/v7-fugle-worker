import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const CURRENT_LISTING_METADATA_VERSION = "0.1-RESEARCH";

export const CURRENT_LISTING_METADATA_SOURCES = deepFreeze({
  TWSE: {
    sourceId: "MOPS_T187AP03_L_CURRENT_LISTED_COMPANY",
    sourceName: "TWSE OpenAPI / MOPS listed-company basic data",
    sourceUrl: "https://openapi.twse.com.tw/v1/opendata/t187ap03_L",
    listingDateField: "上市日期",
  },
  TPEX: {
    sourceId: "MOPS_T187AP03_O_CURRENT_LISTED_COMPANY",
    sourceName: "TPEx OpenAPI / MOPS OTC-company basic data",
    sourceUrl: "https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap03_O",
    listingDateField: "上櫃日期",
  },
});

function csvRows(text) {
  const source = String(text ?? "").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"' && source[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell.replace(/\r$/, ""));
      if (row.some((x) => x !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (quoted) throw new Error("unterminated CSV quote");
  row.push(cell.replace(/\r$/, ""));
  if (row.some((x) => x !== "")) rows.push(row);
  return rows;
}

function parseDate(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const digits = text.replace(/\D/g, "");
  if (digits.length === 8 && Number(digits.slice(0, 4)) >= 1912) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  const parts = text.split(/[\/-]/).map((x) => x.trim()).filter(Boolean);
  if (parts.length === 3) {
    let year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    if (year > 0 && year < 1912) year += 1911;
    if (year >= 1912 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }
  throw new Error("unsupported listing date: " + text);
}

function parseMarketObjects({ market, objects }) {
  const source = CURRENT_LISTING_METADATA_SOURCES[market];
  if (!source) throw new Error("unsupported market: " + market);
  if (!Array.isArray(objects) || !objects.length) throw new Error(market + " company-basic JSON is empty");
  const out = [];
  for (const object of objects) {
    if (!object || typeof object !== "object" || Array.isArray(object)) continue;
    const symbol = String(object["公司代號"] ?? object["公司代號 "] ?? "").trim();
    if (!/^[1-9][0-9]{3}$/.test(symbol)) continue;
    const listingDate = parseDate(object[source.listingDateField]);
    if (!listingDate) continue;
    out.push({
      market,
      symbol,
      companyName: String(object["公司名稱"] ?? "").trim() || null,
      industry: String(object["產業別"] ?? "").trim() || null,
      listingDate,
      sourceId: source.sourceId,
      sourceName: source.sourceName,
      sourceUrl: source.sourceUrl,
    });
  }
  out.sort((a, b) => a.symbol.localeCompare(b.symbol));
  const seen = new Set();
  for (const row of out) {
    if (seen.has(row.symbol)) throw new Error(market + " duplicate ordinary symbol: " + row.symbol);
    seen.add(row.symbol);
  }
  return out;
}

function parseMarketPayload({ market, text }) {
  const trimmed = String(text ?? "").replace(/^\uFEFF/, "").trim();
  if (!trimmed) throw new Error(market + " company-basic payload is empty");
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const payload = JSON.parse(trimmed);
    const objects = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : null;
    if (!objects) throw new Error(market + " company-basic JSON rows missing");
    return parseMarketObjects({ market, objects });
  }
  return parseMarketCsv({ market, text: trimmed });
}

function parseMarketCsv({ market, text }) {
  const source = CURRENT_LISTING_METADATA_SOURCES[market];
  if (!source) throw new Error("unsupported market: " + market);
  const rows = csvRows(text);
  if (rows.length < 2) throw new Error(market + " company-basic CSV is empty");
  const headers = rows[0].map((x) => String(x).trim());
  const index = Object.fromEntries(headers.map((name, i) => [name, i]));
  for (const field of ["公司代號", "公司名稱", source.listingDateField]) {
    if (!Number.isInteger(index[field])) throw new Error(market + " CSV missing field: " + field);
  }
  const out = [];
  for (const row of rows.slice(1)) {
    const symbol = String(row[index["公司代號"]] ?? "").trim();
    if (!/^[1-9][0-9]{3}$/.test(symbol)) continue;
    const listingDate = parseDate(row[index[source.listingDateField]]);
    if (!listingDate) continue;
    out.push({
      market,
      symbol,
      companyName: String(row[index["公司名稱"]] ?? "").trim() || null,
      industry: Number.isInteger(index["產業別"])
        ? String(row[index["產業別"]] ?? "").trim() || null
        : null,
      listingDate,
      sourceId: source.sourceId,
      sourceName: source.sourceName,
      sourceUrl: source.sourceUrl,
    });
  }
  out.sort((a, b) => a.symbol.localeCompare(b.symbol));
  const seen = new Set();
  for (const row of out) {
    if (seen.has(row.symbol)) throw new Error(market + " duplicate ordinary symbol: " + row.symbol);
    seen.add(row.symbol);
  }
  return out;
}

async function fetchText(url, fetchImpl, timeoutMs, retryAttempts, retryDelayMs) {
  let lastError = null;
  for (let attempt = 1; attempt <= retryAttempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        method: "GET",
        redirect: "follow",
        headers: {
          accept: "application/json,text/csv,text/plain,*/*",
          "user-agent": "System2-Current-Listing-Metadata/0.2",
          "cache-control": "no-cache",
        },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response?.ok) {
        const status = Number(response?.status);
        const error = new Error(`listing metadata HTTP ${status}`);
        if (status >= 400 && status < 500 && status !== 429) throw error;
        lastError = error;
      } else {
        return await response.text();
      }
    } catch (error) {
      lastError = error;
      const message = String(error?.message || error);
      if (/listing metadata HTTP 4\d\d/.test(message) && !message.includes("429")) throw error;
    }
    if (attempt < retryAttempts && retryDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs * attempt));
    }
  }
  throw new Error(
    `listing metadata transport exhausted after ${retryAttempts} attempts: ${String(lastError?.message || lastError)}`,
  );
}

export async function fetchCurrentListingMetadataV0_1({
  fetchImpl = globalThis.fetch,
  observedAt = null,
  now = () => new Date(),
  timeoutMs = 30_000,
  retryAttempts = 3,
  retryDelayMs = 500,
  minimumByMarket = { TWSE: 500, TPEX: 400 },
} = {}) {
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  if (observedAt !== null && !Number.isFinite(Date.parse(observedAt))) throw new Error("observedAt must be ISO");
  if (typeof now !== "function") throw new Error("now must be a function");
  if (!Number.isInteger(retryAttempts) || retryAttempts < 1 || retryAttempts > 8) {
    throw new Error("retryAttempts must be an integer from 1 to 8");
  }
  if (!Number.isInteger(retryDelayMs) || retryDelayMs < 0 || retryDelayMs > 10000) {
    throw new Error("retryDelayMs must be an integer from 0 to 10000");
  }
  const [twseText, tpexText] = await Promise.all([
    fetchText(CURRENT_LISTING_METADATA_SOURCES.TWSE.sourceUrl, fetchImpl, timeoutMs, retryAttempts, retryDelayMs),
    fetchText(CURRENT_LISTING_METADATA_SOURCES.TPEX.sourceUrl, fetchImpl, timeoutMs, retryAttempts, retryDelayMs),
  ]);
  const observed = observedAt || now().toISOString();
  if (!Number.isFinite(Date.parse(observed))) throw new Error("now must return a valid date");
  const rows = [
    ...parseMarketPayload({ market: "TWSE", text: twseText }),
    ...parseMarketPayload({ market: "TPEX", text: tpexText }),
  ];
  const counts = {
    TWSE: rows.filter((x) => x.market === "TWSE").length,
    TPEX: rows.filter((x) => x.market === "TPEX").length,
  };
  const blockers = [];
  for (const market of ["TWSE", "TPEX"]) {
    const minimum = Number(minimumByMarket?.[market] ?? 0);
    if (!Number.isInteger(minimum) || minimum < 1) throw new Error("minimumByMarket." + market + " must be positive");
    if (counts[market] < minimum) blockers.push(`${market}:LISTING_METADATA_COVERAGE_LOW`);
  }
  const byMarketSymbol = Object.fromEntries(
    rows.map((row) => [`${row.market}|${row.symbol}`, deepFreeze(row)]),
  );
  const receiptBase = {
    observedAt: observed,
    counts,
    sourceIds: Object.fromEntries(
      Object.entries(CURRENT_LISTING_METADATA_SOURCES).map(([market, source]) => [market, source.sourceId]),
    ),
    rows: rows.map((row) => ({
      market: row.market,
      symbol: row.symbol,
      listingDate: row.listingDate,
      companyName: row.companyName,
      industry: row.industry,
    })),
  };
  const metadataHash = await sha256Hex(receiptBase);
  return deepFreeze({
    schemaVersion: "SYSTEM2_CURRENT_LISTING_METADATA_V0_1",
    version: CURRENT_LISTING_METADATA_VERSION,
    state: blockers.length ? "INCOMPLETE" : "READY",
    observedAt: observed,
    counts,
    blockerCodes: deepFreeze(blockers),
    metadataHash,
    byMarketSymbol: deepFreeze(byMarketSymbol),
    externalMutationPerformed: false,
  });
}

export { csvRows as parseCsvRowsV0_1, parseDate as parseListingDateV0_1 };
