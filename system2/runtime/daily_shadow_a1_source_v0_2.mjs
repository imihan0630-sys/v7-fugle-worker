import { deepFreeze } from "./factor_snapshot.mjs";
import { buildA1SymbolSnapshotBatch } from "./a1_symbol_snapshot_adapter.mjs";
import {
  OFFICIAL_HISTORICAL_A1_SOURCES,
  fetchOfficialHistoricalA1DateV0_1,
} from "./official_historical_a1_source_v0_1.mjs";

export const DAILY_SHADOW_A1_SOURCE_VERSION = "0.2-RESEARCH";
export const DAILY_SHADOW_A1_SOURCE_POLICY = "DATE_SCOPED_AFTER_TRADING_SOURCE_DATE_VERIFIED";

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

function compactDate(date) {
  return date.replaceAll("-", "");
}

function a1Rows(dataset) {
  if (!dataset || dataset.state !== "READY" || !Array.isArray(dataset.rows)) return [];
  const date = compactDate(dataset.marketDate);
  if (dataset.market === "TWSE") {
    return dataset.rows.map((row) => ({
      Code: row.symbol,
      Name: row.companyName || "",
      Date: date,
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
  if (dataset.market === "TPEX") {
    return dataset.rows.map((row) => ({
      SecuritiesCompanyCode: row.symbol,
      CompanyName: row.companyName || "",
      Date: date,
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
  throw new Error("unsupported A1 dataset market: " + dataset.market);
}

function safeError(error) {
  return String(error?.message || error || "UNKNOWN")
    .replace(/[A-Za-z0-9_-]{24,}/g, "<redacted>")
    .slice(0, 240);
}

async function fetchMarket({ market, marketDate, fetchImpl, observedAt }) {
  try {
    const dataset = await fetchOfficialHistoricalA1DateV0_1({
      market,
      marketDate,
      observedAt,
      fetchImpl,
      retryAttempts: 3,
      retryDelayMs: 400,
    });
    return deepFreeze({
      ok: true,
      market,
      dataset,
      errorCode: null,
      error: null,
    });
  } catch (error) {
    return deepFreeze({
      ok: false,
      market,
      dataset: null,
      errorCode: String(error?.message || "").includes("SOURCE_DATE_MISMATCH")
        ? "SOURCE_DATE_MISMATCH"
        : "SOURCE_FETCH_OR_INTEGRITY_ERROR",
      error: safeError(error),
    });
  }
}

export async function fetchDailyShadowA1SnapshotV0_2({
  marketDate,
  decisionTimestamp = null,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  minimumByMarket = undefined,
} = {}) {
  const date = isoDate(marketDate);
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");

  const startedAt = now().toISOString();
  const [twse, tpex] = await Promise.all([
    fetchMarket({ market: "TWSE", marketDate: date, fetchImpl, observedAt: startedAt }),
    fetchMarket({ market: "TPEX", marketDate: date, fetchImpl, observedAt: startedAt }),
  ]);
  const observedAt = now().toISOString();
  const clock = decisionTimestamp
    ? isoTimestamp(decisionTimestamp, "decisionTimestamp")
    : observedAt;
  const decisionClockMode = decisionTimestamp
    ? "FIXED_CALLER_CLOCK"
    : "DIAGNOSTIC_OBSERVATION_TIME_NOT_CAPTURE_CLOCK";

  const transports = deepFreeze(Object.fromEntries(
    [twse, tpex].map((result) => {
      const source = OFFICIAL_HISTORICAL_A1_SOURCES[result.market];
      return [result.market, {
        ok: result.ok,
        sourceId: source.sourceId,
        sourceName: source.sourceName,
        sourceDateVerified: result.dataset?.sourceDateEvidence === date,
        ordinarySymbolCount: result.dataset?.ordinarySymbolCount || 0,
        errorCode: result.errorCode,
        error: result.error,
      }];
    }),
  ));

  if (!twse.ok || !tpex.ok) {
    return deepFreeze({
      version: DAILY_SHADOW_A1_SOURCE_VERSION,
      sourcePolicy: DAILY_SHADOW_A1_SOURCE_POLICY,
      state: "SOURCE_ERROR",
      marketDate: date,
      decisionTimestamp: clock,
      decisionClockMode,
      startedAt,
      observedAt,
      transports,
      snapshotBatch: null,
      availabilitySemantics: "FIRST_OBSERVED_DATE_SCOPED_READY_UPPER_BOUND",
      externalMutationPerformed: false,
    });
  }

  const batch = await buildA1SymbolSnapshotBatch({
    batchId: `S2-A1-DAILY-V02:${date}:${observedAt}`,
    marketDate: date,
    decisionTimestamp: clock,
    observedAt,
    twseRows: a1Rows(twse.dataset),
    tpexRows: a1Rows(tpex.dataset),
    minimumByMarket,
  });

  return deepFreeze({
    version: DAILY_SHADOW_A1_SOURCE_VERSION,
    sourcePolicy: DAILY_SHADOW_A1_SOURCE_POLICY,
    state: batch.state === "READY" ? "READY" : "INCOMPLETE",
    marketDate: date,
    decisionTimestamp: clock,
    decisionClockMode,
    startedAt,
    observedAt,
    transports,
    snapshotBatch: batch,
    sourceDateVerified: twse.dataset.sourceDateEvidence === date
      && tpex.dataset.sourceDateEvidence === date,
    availabilitySemantics: "FIRST_OBSERVED_DATE_SCOPED_READY_UPPER_BOUND",
    externalMutationPerformed: false,
  });
}
