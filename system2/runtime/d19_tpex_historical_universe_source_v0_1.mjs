import { createHash } from "node:crypto";
import { deepFreeze } from "./factor_snapshot.mjs";
import { buildHistoricalUniverseRegistryV0_1, buildHistoricalUniverseSnapshotV0_1 } from "./historical_universe_registry_v0_1.mjs";
import {
  fetchOfficialMonthlyHistoryPayloadV0_1,
  normalizeOfficialMonthlyHistoryPayloadV0_1,
} from "./official_monthly_history_adapter_v0_1.mjs";

export const D19_TPEX_HISTORICAL_UNIVERSE_SOURCE_VERSION = "0.1-RESEARCH";

const BASE = "https://www.tpex.org.tw";
const CURRENT_URL = BASE + "/openapi/v1/mopsfin_t187ap03_O";
const DELISTED_URL = BASE + "/www/zh-tw/company/deListed";
const NEW_LISTED_DOWNLOAD_URL = BASE + "/www/zh-tw/company/applicantStatDl?type=list&date=";
const NEW_LISTED_ARCHIVE_START_YEAR = 2005;

function shaBytes(value) {
  return createHash("sha256").update(value).digest("hex");
}
function shaJson(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function ordinary(value) {
  return /^[1-9][0-9]{3}$/.test(String(value ?? "").trim());
}
function isoTimestamp(value, field) {
  const text = String(value ?? "").trim();
  if (!text || !Number.isFinite(Date.parse(text))) throw new Error(field + " must be ISO timestamp");
  return text;
}
function isoDate(value, field) {
  const text = String(value ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}
function compactGregorianDate(value) {
  const text = String(value ?? "").trim();
  const m = text.match(/^(\d{4})(\d{2})(\d{2})$/);
  return m ? m[1] + "-" + m[2] + "-" + m[3] : null;
}
function slashGregorianDate(value) {
  const text = String(value ?? "").trim();
  const m = text.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  return m ? m[1] + "-" + m[2] + "-" + m[3] : null;
}
function rocDashDate(value) {
  const text = String(value ?? "").trim();
  const m = text.match(/^(\d{2,3})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return String(Number(m[1]) + 1911).padStart(4, "0") + "-" + m[2] + "-" + m[3];
}
function monthKey(date) {
  return date.slice(0, 7);
}
function yearsInclusive(fromYear, toYear) {
  const out = [];
  for (let year = fromYear; year <= toYear; year += 1) out.push(year);
  return out;
}

function parseCsvLine(line) {
  const out = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        value += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        value += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      out.push(value);
      value = "";
    } else {
      value += ch;
    }
  }
  out.push(value);
  return out;
}

export function parseTpexNewListedCsvV0_1(text, { year = null } = {}) {
  if (typeof text !== "string") throw new Error("new-listed CSV text is required");
  const rows = [];
  for (const rawLine of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const fields = parseCsvLine(line).map((x) => x.trim());
    if (fields.length < 4) continue;
    const symbol = fields[1];
    const listingDate = slashGregorianDate(fields[3]);
    if (!ordinary(symbol) || !listingDate) continue;
    if (year !== null && Number(listingDate.slice(0, 4)) !== Number(year)) {
      throw new Error("new-listed row year mismatch: " + symbol + "|" + listingDate);
    }
    rows.push({
      symbol,
      companyName: fields[2] || null,
      listingDate,
      sourceFields: fields,
    });
  }
  const seen = new Set();
  for (const row of rows) {
    const key = row.symbol + "|" + row.listingDate;
    if (seen.has(key)) throw new Error("duplicate new-listed row: " + key);
    seen.add(key);
  }
  return rows.sort((a, b) => a.listingDate.localeCompare(b.listingDate) || a.symbol.localeCompare(b.symbol));
}

export function parseTpexDelistedPayloadV0_1(payload, { requestedYear = null } = {}) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("TPEx delisted payload must be an object");
  }
  if (String(payload.stat ?? "").toLowerCase() !== "ok") {
    throw new Error("TPEx delisted payload status invalid");
  }
  const table = Array.isArray(payload.tables) ? payload.tables[0] : null;
  if (!table || !Array.isArray(table.fields) || !Array.isArray(table.data)) {
    throw new Error("TPEx delisted payload table invalid");
  }
  const expected = ["股票代號", "公司名稱", "終止上櫃日期", "終止上櫃原因", "公司資料網址"];
  for (const field of expected) {
    if (!table.fields.includes(field)) throw new Error("TPEx delisted field missing: " + field);
  }
  const idx = Object.fromEntries(table.fields.map((field, i) => [field, i]));
  const rows = table.data.map((raw, i) => {
    if (!Array.isArray(raw)) throw new Error("TPEx delisted row malformed: " + i);
    const symbol = String(raw[idx["股票代號"]] ?? "").trim();
    const delistingDate = rocDashDate(raw[idx["終止上櫃日期"]]);
    return {
      symbol,
      companyName: String(raw[idx["公司名稱"]] ?? "").trim() || null,
      delistingDate,
      reason: String(raw[idx["終止上櫃原因"]] ?? "").trim() || null,
      companyUrl: String(raw[idx["公司資料網址"]] ?? "").trim() || null,
      sourceFields: raw,
    };
  }).filter((row) => ordinary(row.symbol) && row.delistingDate);
  if (requestedYear !== null) {
    for (const row of rows) {
      if (Number(row.delistingDate.slice(0, 4)) !== Number(requestedYear)) {
        throw new Error("delisted row year mismatch: " + row.symbol + "|" + row.delistingDate);
      }
    }
  }
  if (Number.isFinite(Number(table.totalCount)) && Number(table.totalCount) !== rows.length) {
    throw new Error("TPEx delisted totalCount mismatch");
  }
  return rows.sort((a, b) => a.delistingDate.localeCompare(b.delistingDate) || a.symbol.localeCompare(b.symbol));
}

async function fetchBytes(url, fetchImpl, { accept = "*/*", retries = 3 } = {}) {
  let lastError = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        headers: {
          accept,
          "user-agent": "Mozilla/5.0 D19-TPEx-Universe-Research/0.1",
          referer: BASE + "/zh-tw/mainboard/listed/company.html",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(45000),
      });
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!response.ok) throw new Error("HTTP " + response.status + " " + url);
      return {
        url,
        bytes,
        contentType: response.headers.get("content-type"),
        contentHash: shaBytes(bytes),
      };
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
      }
    }
  }
  throw lastError;
}

async function fetchJson(url, fetchImpl) {
  const raw = await fetchBytes(url, fetchImpl, { accept: "application/json,text/plain,*/*" });
  const text = raw.bytes.toString("utf8");
  return { ...raw, text, payload: JSON.parse(text) };
}

async function fetchBig5Csv(url, fetchImpl) {
  const raw = await fetchBytes(url, fetchImpl, { accept: "text/csv,text/plain,*/*" });
  const decoder = new TextDecoder("big5");
  return { ...raw, text: decoder.decode(raw.bytes) };
}

function normalizeCurrentRows(payload) {
  if (!Array.isArray(payload) || payload.length < 500) throw new Error("TPEx current company payload unexpectedly small");
  const rows = payload.map((raw) => ({
    market: "TPEX",
    symbol: String(raw.SecuritiesCompanyCode ?? "").trim(),
    companyName: String(raw.CompanyName ?? "").trim() || null,
    memberState: "CURRENT",
    listingDate: compactGregorianDate(raw.DateOfListing),
    delistingDate: null,
    industry: null,
    sourceId: "TPEX_OPENAPI_MOPSFIN_T187AP03_O",
    sourceName: "TPEx current OTC-company basic data",
    sourceUrl: CURRENT_URL,
    sourceRowHash: shaJson(raw),
  })).filter((row) => ordinary(row.symbol) && row.listingDate);
  if (rows.length < 500) throw new Error("TPEx normalized current-company rows unexpectedly small");
  return rows;
}

function newestPriorListing(listingsBySymbol, symbol, delistingDate) {
  const rows = (listingsBySymbol.get(symbol) || [])
    .filter((row) => row.listingDate <= delistingDate)
    .sort((a, b) => a.listingDate.localeCompare(b.listingDate));
  return rows.at(-1) || null;
}

async function datasetStartWitness({
  symbol,
  datasetStartDate,
  observedAt,
  fetchImpl,
}) {
  const yearMonth = monthKey(datasetStartDate);
  let payload = null;
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      payload = await fetchOfficialMonthlyHistoryPayloadV0_1({
        market: "TPEX",
        symbol,
        yearMonth,
        fetchImpl,
        timeoutMs: 45000,
      });
      lastError = null;
      break;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
    }
  }
  if (lastError) throw lastError;
  const normalized = await normalizeOfficialMonthlyHistoryPayloadV0_1({
    market: "TPEX",
    symbol,
    yearMonth,
    payload,
    observedAt,
  });
  const rows = normalized.rows.filter((row) => row.marketDate >= datasetStartDate);
  if (!rows.length) {
    throw new Error("UNRESOLVED_OLD_DELISTED_DATASET_START:" + symbol);
  }
  return {
    firstTradingDate: rows[0].marketDate,
    payloadHash: normalized.payloadHash,
    sourceUrl: normalized.sourceUrl,
    sourceId: normalized.sourceId,
  };
}

export async function buildD19TpexHistoricalUniverseSourceV0_1({
  datasetStartDate = "2023-01-01",
  observedAt = new Date().toISOString(),
  archiveStartYear = NEW_LISTED_ARCHIVE_START_YEAR,
  throughYear = null,
  fetchImpl = globalThis.fetch,
} = {}) {
  const datasetStart = isoDate(datasetStartDate, "datasetStartDate");
  const observed = isoTimestamp(observedAt, "observedAt");
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  const observationYear = Number(observed.slice(0, 4));
  const endYear = throughYear === null ? observationYear : Number(throughYear);
  if (!Number.isInteger(endYear) || endYear < Number(datasetStart.slice(0, 4))) {
    throw new Error("throughYear invalid");
  }
  if (!Number.isInteger(archiveStartYear) || archiveStartYear < 1994 || archiveStartYear > endYear) {
    throw new Error("archiveStartYear invalid");
  }

  const currentRaw = await fetchJson(CURRENT_URL, fetchImpl);
  const currentRows = normalizeCurrentRows(currentRaw.payload);

  const newListed = [];
  const newListedSourceHashes = {};
  for (const year of yearsInclusive(archiveStartYear, endYear)) {
    const url = NEW_LISTED_DOWNLOAD_URL + year;
    const raw = await fetchBig5Csv(url, fetchImpl);
    const rows = parseTpexNewListedCsvV0_1(raw.text, { year });
    newListed.push(...rows.map((row) => ({ ...row, sourceContentHash: raw.contentHash, sourceUrl: url })));
    newListedSourceHashes[String(year)] = raw.contentHash;
  }

  const delisted = [];
  const delistedSourceHashes = {};
  for (const year of yearsInclusive(Number(datasetStart.slice(0, 4)), endYear)) {
    const url = DELISTED_URL + "?code=&date=" + year + "&reason=-1";
    const raw = await fetchJson(url, fetchImpl);
    const rows = parseTpexDelistedPayloadV0_1(raw.payload, { requestedYear: year })
      .filter((row) => row.delistingDate >= datasetStart);
    delisted.push(...rows.map((row) => ({ ...row, sourceContentHash: raw.contentHash, sourceUrl: url })));
    delistedSourceHashes[String(year)] = raw.contentHash;
  }

  const listingsBySymbol = new Map();
  for (const row of newListed) {
    if (!listingsBySymbol.has(row.symbol)) listingsBySymbol.set(row.symbol, []);
    listingsBySymbol.get(row.symbol).push(row);
  }

  const firstTradingDateByMarketSymbol = {};
  const datasetStartFallbacks = [];
  const delistedRows = [];
  for (const row of delisted) {
    const listing = newestPriorListing(listingsBySymbol, row.symbol, row.delistingDate);
    let listingDate = listing?.listingDate || null;
    let sourceId = "TPEX_NEWLISTED_ARCHIVE_PLUS_DELISTED";
    let sourceName = "TPEx annual new-listed archive + official delisted-company table";
    let sourceUrl = (listing?.sourceUrl || "") + " | " + row.sourceUrl;
    let witness = null;

    if (!listingDate) {
      witness = await datasetStartWitness({
        symbol: row.symbol,
        datasetStartDate: datasetStart,
        observedAt: observed,
        fetchImpl,
      });
      firstTradingDateByMarketSymbol["TPEX|" + row.symbol] = witness.firstTradingDate;
      sourceId = "TPEX_DATASET_START_HISTORY_PLUS_DELISTED";
      sourceName = "TPEx dataset-start individual history + official delisted-company table";
      sourceUrl = witness.sourceUrl + " | " + row.sourceUrl;
      datasetStartFallbacks.push({
        symbol: row.symbol,
        firstTradingDate: witness.firstTradingDate,
        monthlyPayloadHash: witness.payloadHash,
      });
    }

    delistedRows.push({
      market: "TPEX",
      symbol: row.symbol,
      companyName: row.companyName || listing?.companyName || null,
      memberState: "DELISTED",
      listingDate,
      delistingDate: row.delistingDate,
      industry: null,
      sourceId,
      sourceName,
      sourceUrl,
      sourceRowHash: shaJson({
        listing: listing ? {
          symbol: listing.symbol,
          listingDate: listing.listingDate,
          sourceContentHash: listing.sourceContentHash,
        } : null,
        datasetStartWitness: witness,
        delisted: {
          symbol: row.symbol,
          delistingDate: row.delistingDate,
          reason: row.reason,
          sourceContentHash: row.sourceContentHash,
        },
      }),
    });
  }

  const registry = await buildHistoricalUniverseRegistryV0_1({
    registryId: "D19-TPEX-" + datasetStart.slice(0, 4) + "-" + endYear + "-OFFICIAL-UNION-V0.1",
    sourceRows: [...currentRows, ...delistedRows],
    firstTradingDateByMarketSymbol,
    datasetStartDate: datasetStart,
    observedAt: observed,
  });
  if (registry.unknownStartCount !== 0 || registry.replayEligibleCount !== registry.membershipCount) {
    throw new Error("D19 TPEx historical universe registry incomplete");
  }

  return deepFreeze({
    registry,
    sourceReceipt: {
      sourceVersion: D19_TPEX_HISTORICAL_UNIVERSE_SOURCE_VERSION,
      datasetStartDate: datasetStart,
      archiveStartYear,
      throughYear: endYear,
      currentCount: currentRows.length,
      newListedArchiveCount: newListed.length,
      delistedCount: delistedRows.length,
      datasetStartFallbackCount: datasetStartFallbacks.length,
      datasetStartFallbacks: Object.freeze(datasetStartFallbacks),
      currentSourceHash: currentRaw.contentHash,
      newListedSourceHashes: deepFreeze(newListedSourceHashes),
      delistedSourceHashes: deepFreeze(delistedSourceHashes),
      currentSourceUrl: CURRENT_URL,
      delistedSourceUrl: DELISTED_URL,
      newListedDownloadBaseUrl: NEW_LISTED_DOWNLOAD_URL,
      currentIndustryUsedForHistoricalReplay: false,
      survivorshipSafeIntent: true,
      futureDelistingInfoExposedToStrategy: false,
      schemaVersion: "D19_TPEX_HISTORICAL_UNIVERSE_SOURCE_RECEIPT_V0_1",
    },
  });
}

export async function buildD19TpexUniverseSnapshotV0_1({
  source,
  marketDate,
  capturedAt,
} = {}) {
  if (!source?.registry) throw new Error("source.registry is required");
  return buildHistoricalUniverseSnapshotV0_1({
    snapshotId: "D19-TPEX-" + marketDate,
    registry: source.registry,
    marketDate,
    capturedAt,
  });
}
