import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import {
  A1_SYMBOL_SNAPSHOT_SOURCES,
  buildA1SymbolSnapshotBatch,
} from "./a1_symbol_snapshot_adapter.mjs";
import { fetchOfficialHistoricalA1DateV0_1 } from "./official_historical_a1_source_v0_1.mjs";
import { fetchCurrentListingMetadataV0_1 } from "./current_listing_metadata_v0_1.mjs";

export const DAILY_SHADOW_A1_SOURCE_VERSION = "0.3-RESEARCH";
const DEFAULT_TIMEOUT_MS = 30_000;
const USER_AGENT = "System2-Daily-Shadow-A1-Readonly/0.2";

const EXACT_DATE_PROSPECTIVE_SOURCES = deepFreeze({
  TWSE: {
    sourceId: "A1_TWSE_MI_INDEX_EXACT_DATE_PROSPECTIVE",
    sourceName: "TWSE MI_INDEX exact-date daily close prospective observation",
  },
  TPEX: {
    sourceId: "A1_TPEX_DAILY_QUOTES_EXACT_DATE_PROSPECTIVE",
    sourceName: "TPEx dailyQuotes exact-date prospective observation",
  },
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function isoDate(value) {
  const text = requiredText(value, "marketDate");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error("marketDate must be YYYY-MM-DD");
  return text;
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

function rocDateDigits(marketDate) {
  const [year, month, day] = marketDate.split("-");
  return String(Number(year) - 1911).padStart(3, "0") + month + day;
}

function dateTokens(marketDate) {
  return new Set([
    marketDate.replaceAll("-", ""),
    rocDateDigits(marketDate),
  ]);
}

function payloadReportedDates(payload) {
  if (!Array.isArray(payload)) return [];
  return [...new Set(payload.map((row) => String(row?.Date || "UNDATED")))].sort();
}

function payloadHasTargetDate(payload, marketDate) {
  const tokens = dateTokens(marketDate);
  return Array.isArray(payload) && payload.some((row) => {
    const digits = String(row?.Date || "").replace(/\D/g, "");
    return tokens.has(digits);
  });
}

async function fetchJson(url, fetchImpl, timeoutMs) {
  try {
    const response = await fetchImpl(url, {
      method: "GET",
      redirect: "follow",
      headers: { accept: "application/json", "user-agent": USER_AGENT },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const httpStatus = Number(response.status);
    if (!response.ok) {
      return deepFreeze({
        ok: false,
        httpStatus,
        payload: null,
        errorCode: `HTTP_${httpStatus}`,
      });
    }
    try {
      return deepFreeze({
        ok: true,
        httpStatus,
        payload: await response.json(),
        errorCode: null,
      });
    } catch {
      return deepFreeze({
        ok: false,
        httpStatus,
        payload: null,
        errorCode: "NON_JSON_RESPONSE",
      });
    }
  } catch (error) {
    return deepFreeze({
      ok: false,
      httpStatus: null,
      payload: null,
      errorCode: error?.name === "TimeoutError" ? "TIMEOUT" : "NETWORK_ERROR",
    });
  }
}

function mapExactDateRowsToA1Raw(market, marketDate, rows) {
  const date = market === "TWSE"
    ? rocDateDigits(marketDate)
    : rocDateDigits(marketDate).replace(/^(\d{3})(\d{2})(\d{2})$/, "$1/$2/$3");
  if (market === "TWSE") {
    return rows.map((row) => ({
      Date: date,
      Code: row.symbol,
      Name: row.companyName,
      OpeningPrice: row.open,
      HighestPrice: row.high,
      LowestPrice: row.low,
      ClosingPrice: row.close,
      TradeVolume: row.volumeShares,
      TradeValue: row.tradeValue,
      Transaction: row.transactions,
      Change: row.change,
    }));
  }
  return rows.map((row) => ({
    Date: date,
    SecuritiesCompanyCode: row.symbol,
    CompanyName: row.companyName,
    Open: row.open,
    High: row.high,
    Low: row.low,
    Close: row.close,
    TradingShares: row.volumeShares,
    TransactionAmount: row.tradeValue,
    TransactionNumber: row.transactions,
    Change: row.change,
  }));
}

async function primaryAudit(result) {
  return {
    ok: result.ok,
    httpStatus: result.httpStatus,
    errorCode: result.errorCode,
    payloadHash: result.ok ? await sha256Hex(result.payload) : null,
    rawRowCount: Array.isArray(result.payload) ? result.payload.length : null,
    reportedDates: payloadReportedDates(result.payload),
  };
}

// Shared by the read-only Decision Clock A1 observer to prevent a stale
// latest-OpenAPI endpoint from diverging from Stage-1 source selection.
// Export only: selection behavior and live Shadow authority remain unchanged.
export async function resolveMarketPayload({
  market,
  marketDate,
  primary,
  exactDateFetch,
  fetchImpl,
}) {
  const primaryEvidence = await primaryAudit(primary);
  if (primary.ok && payloadHasTargetDate(primary.payload, marketDate)) {
    return {
      ok: true,
      rows: primary.payload,
      sourceOverride: null,
      selection: "PRIMARY_LATEST_OPENAPI_TARGET_DATE",
      primary: primaryEvidence,
      fallback: { attempted: false, ok: null, errorCode: null },
    };
  }

  let exact = null;
  let fallbackError = null;
  try {
    exact = await exactDateFetch({ market, marketDate, fetchImpl });
    if (!exact || exact.marketDate !== marketDate || exact.state !== "READY") {
      throw new Error("EXACT_DATE_RESULT_NOT_READY");
    }
  } catch (error) {
    fallbackError = String(error?.message || error || "EXACT_DATE_FALLBACK_FAILED").slice(0, 180);
  }

  if (exact) {
    const rows = mapExactDateRowsToA1Raw(market, marketDate, exact.rows || []);
    return {
      ok: true,
      rows,
      sourceOverride: {
        ...EXACT_DATE_PROSPECTIVE_SOURCES[market],
        sourceUrl: exact.sourceUrl,
      },
      selection: "EXACT_DATE_FALLBACK",
      primary: primaryEvidence,
      fallback: {
        attempted: true,
        ok: true,
        errorCode: null,
        sourceUrl: exact.sourceUrl,
        sourceDateEvidence: exact.sourceDateEvidence,
        sourceDateEvidenceBasis: exact.sourceDateEvidenceBasis,
        normalizedRowCount: rows.length,
      },
    };
  }

  if (primary.ok) {
    // Preserve the stale/empty primary payload for explicit target-date filtering.
    // This remains INCOMPLETE rather than being relabeled as a source success.
    return {
      ok: true,
      rows: primary.payload,
      sourceOverride: null,
      selection: "PRIMARY_NON_TARGET_DATE_FALLBACK_FAILED",
      primary: primaryEvidence,
      fallback: {
        attempted: true,
        ok: false,
        errorCode: fallbackError || "EXACT_DATE_FALLBACK_FAILED",
      },
    };
  }

  return {
    ok: false,
    rows: null,
    sourceOverride: null,
    selection: "NO_USABLE_SOURCE",
    primary: primaryEvidence,
    fallback: {
      attempted: true,
      ok: false,
      errorCode: fallbackError || "EXACT_DATE_FALLBACK_FAILED",
    },
  };
}

export async function fetchDailyShadowA1SnapshotV0_1({
  marketDate,
  decisionTimestamp = null,
  fetchImpl = globalThis.fetch,
  exactDateFetch = fetchOfficialHistoricalA1DateV0_1,
  listingMetadataFetch = fetchCurrentListingMetadataV0_1,
  now = () => new Date(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  minimumByMarket = undefined,
} = {}) {
  const date = isoDate(marketDate);
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  if (typeof exactDateFetch !== "function") throw new Error("exactDateFetch is required");
  if (typeof listingMetadataFetch !== "function") throw new Error("listingMetadataFetch is required");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 60_000) {
    throw new Error("timeoutMs must be an integer from 1000 to 60000");
  }

  const [twsePrimary, tpexPrimary, listingMetadataResult] = await Promise.all([
    fetchJson(A1_SYMBOL_SNAPSHOT_SOURCES.TWSE.sourceUrl, fetchImpl, timeoutMs),
    fetchJson(A1_SYMBOL_SNAPSHOT_SOURCES.TPEX.sourceUrl, fetchImpl, timeoutMs),
    listingMetadataFetch({
      fetchImpl,
      timeoutMs,
      now,
    }).catch((error) => ({
      schemaVersion: "SYSTEM2_CURRENT_LISTING_METADATA_V0_1",
      version: "0.1-RESEARCH",
      state: "SOURCE_ERROR",
      observedAt: now().toISOString(),
      counts: { TWSE: 0, TPEX: 0 },
      blockerCodes: ["LISTING_METADATA_SOURCE_ERROR"],
      metadataHash: null,
      byMarketSymbol: {},
      safeError: String(error?.message || error).slice(0, 160),
      externalMutationPerformed: false,
    })),
  ]);
  const [twse, tpex] = await Promise.all([
    resolveMarketPayload({
      market: "TWSE", marketDate: date, primary: twsePrimary, exactDateFetch, fetchImpl,
    }),
    resolveMarketPayload({
      market: "TPEX", marketDate: date, primary: tpexPrimary, exactDateFetch, fetchImpl,
    }),
  ]);

  // Availability for prospective use is the time after every selected source
  // response/fallback was actually observed, never a historical publication guess.
  const observedAt = now().toISOString();
  const fixedClock = decisionTimestamp
    ? isoTimestamp(decisionTimestamp, "decisionTimestamp")
    : observedAt;
  const decisionClockMode = decisionTimestamp
    ? "FIXED_CALLER_CLOCK"
    : "DIAGNOSTIC_OBSERVATION_TIME_NOT_CAPTURE_CLOCK";

  const transportFor = async (market, selected) => ({
    ok: selected.ok,
    httpStatus: selected.selection === "EXACT_DATE_FALLBACK" ? 200 : selected.primary.httpStatus,
    errorCode: selected.ok ? null : selected.primary.errorCode || selected.fallback.errorCode,
    sourceId: selected.sourceOverride?.sourceId || A1_SYMBOL_SNAPSHOT_SOURCES[market].sourceId,
    selection: selected.selection,
    payloadHash: selected.ok ? await sha256Hex(selected.rows) : null,
    rowCount: Array.isArray(selected.rows) ? selected.rows.length : null,
    rowCountSemantics: selected.selection === "EXACT_DATE_FALLBACK"
      ? "NORMALIZED_EXACT_DATE_ROWS"
      : "PRIMARY_RAW_ROWS",
    reportedDates: selected.selection === "EXACT_DATE_FALLBACK"
      ? [date]
      : selected.primary.reportedDates,
    primary: selected.primary,
    fallback: selected.fallback,
  });
  const [twseTransport, tpexTransport] = await Promise.all([
    transportFor("TWSE", twse),
    transportFor("TPEX", tpex),
  ]);
  const transports = deepFreeze({ TWSE: twseTransport, TPEX: tpexTransport });

  if (!twse.ok || !tpex.ok) {
    return deepFreeze({
      version: DAILY_SHADOW_A1_SOURCE_VERSION,
      state: "SOURCE_ERROR",
      marketDate: date,
      decisionTimestamp: fixedClock,
      decisionClockMode,
      observedAt,
      transports,
      listingMetadata: listingMetadataResult,
      snapshotBatch: null,
      externalMutationPerformed: false,
    });
  }

  const sourceByMarket = {};
  if (twse.sourceOverride) sourceByMarket.TWSE = twse.sourceOverride;
  if (tpex.sourceOverride) sourceByMarket.TPEX = tpex.sourceOverride;
  const batch = await buildA1SymbolSnapshotBatch({
    batchId: `S2-A1-DAILY-PREFLIGHT:${date}:${observedAt}`,
    marketDate: date,
    decisionTimestamp: fixedClock,
    observedAt,
    twseRows: twse.rows,
    tpexRows: tpex.rows,
    minimumByMarket,
    sourceByMarket,
  });

  return deepFreeze({
    version: DAILY_SHADOW_A1_SOURCE_VERSION,
    state: batch.state === "READY" ? "READY" : "INCOMPLETE",
    marketDate: date,
    decisionTimestamp: fixedClock,
    decisionClockMode,
    observedAt,
    transports,
    listingMetadata: listingMetadataResult,
    snapshotBatch: batch,
    externalMutationPerformed: false,
  });
}
