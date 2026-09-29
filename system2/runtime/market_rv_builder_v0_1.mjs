import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const MARKET_RV_BUILDER_VERSION = "D04_MARKET_RV_V0_1_RESEARCH";
export const MARKET_RV_FACTOR_IDS = Object.freeze([
  "MARKET_RV5_CC_SIMPLE",
  "MARKET_RV20_CC_SIMPLE",
  "MARKET_RV_RATIO_5_20",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function assertTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

function validMarketDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function populationStd(values) {
  if (!values.length || values.some((x) => !Number.isFinite(x))) return null;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, x) => sum + (x - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function normalizeHistory(history, marketDate) {
  if (!Array.isArray(history)) throw new Error("history must be an array");
  const rows = history.map((row) => ({
    date: String(row?.date || row?.marketDate || ""),
    close: Number(row?.close),
  }));
  if (rows.some((row) => !validMarketDate(row.date))) {
    throw new Error("every history row requires YYYY-MM-DD date");
  }
  if (rows.some((row) => !Number.isFinite(row.close) || row.close <= 0)) {
    throw new Error("every history row requires positive finite close");
  }
  if (rows.some((row) => row.date > marketDate)) {
    throw new Error("history contains future row relative to marketDate");
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  const dates = rows.map((row) => row.date);
  if (new Set(dates).size !== dates.length) throw new Error("history contains duplicate market dates");
  return rows;
}

function simpleReturns(rows) {
  const out = [];
  for (let i = 1; i < rows.length; i += 1) {
    out.push(rows[i].close / rows[i - 1].close - 1);
  }
  return out;
}

function unknownObservation({
  factorId,
  marketDate,
  decisionTimestamp,
  provenance,
  sourceReceiptRef,
  reason,
  qualityFlags,
}) {
  return deepFreeze({
    factorId,
    factorVersion: MARKET_RV_BUILDER_VERSION,
    scope: "MARKET",
    scopeKey: "TAIEX",
    marketDate,
    decisionTimestamp,
    state: "UNKNOWN",
    rawValue: null,
    normalizedValue: null,
    confidence: null,
    provenance: deepFreeze({
      ...provenance,
      sourceReceiptRef,
    }),
    normalization: deepFreeze({
      method: "NONE",
      normalizationVersion: MARKET_RV_BUILDER_VERSION,
      referenceWindow: "OFFICIAL_TAIEX_CLOSE_TO_CLOSE_SIMPLE_RETURNS",
    }),
    unknownReason: reason,
    qualityFlags: Object.freeze([...(qualityFlags || [])]),
  });
}

function knownObservation({
  factorId,
  rawValue,
  marketDate,
  decisionTimestamp,
  provenance,
  sourceReceiptRef,
  qualityFlags,
}) {
  return deepFreeze({
    factorId,
    factorVersion: MARKET_RV_BUILDER_VERSION,
    scope: "MARKET",
    scopeKey: "TAIEX",
    marketDate,
    decisionTimestamp,
    state: "KNOWN",
    rawValue,
    normalizedValue: null,
    confidence: 1,
    provenance: deepFreeze({
      ...provenance,
      sourceReceiptRef,
    }),
    normalization: deepFreeze({
      method: "NONE",
      normalizationVersion: MARKET_RV_BUILDER_VERSION,
      referenceWindow: "OFFICIAL_TAIEX_CLOSE_TO_CLOSE_SIMPLE_RETURNS",
    }),
    unknownReason: undefined,
    qualityFlags: Object.freeze([...(qualityFlags || [])]),
  });
}

export async function buildMarketRvBundleV0_1({
  bundleId,
  marketDate,
  decisionTimestamp,
  observedAt,
  availableAt,
  capturedAt = null,
  sourceDate,
  sourceReceiptRef,
  sourceReceiptState = "READY",
  sourcePointInTimeEligible = false,
  sourceId = "A2_TAIEX_CLOSE",
  sourceName = "TWSE official TAIEX close history",
  sourceUrl = null,
  history = [],
} = {}) {
  const id = requiredText(bundleId, "bundleId");
  const date = requiredText(marketDate, "marketDate");
  if (!validMarketDate(date)) throw new Error("marketDate must be YYYY-MM-DD");
  const clock = assertTimestamp(decisionTimestamp, "decisionTimestamp");
  const seenAt = assertTimestamp(observedAt, "observedAt");
  const available = assertTimestamp(availableAt, "availableAt");
  const captured = capturedAt ? assertTimestamp(capturedAt, "capturedAt") : seenAt;
  const srcDate = requiredText(sourceDate, "sourceDate");
  if (!validMarketDate(srcDate)) throw new Error("sourceDate must be YYYY-MM-DD");
  const receiptRef = requiredText(sourceReceiptRef, "sourceReceiptRef");
  const srcId = requiredText(sourceId, "sourceId");
  const srcName = requiredText(sourceName, "sourceName");
  const rows = normalizeHistory(history, date);

  const structuralFlags = [];
  if (rows.length < 21) structuralFlags.push("HISTORY_LT_21");
  if (rows.at(-1)?.date !== date) structuralFlags.push("LAST_HISTORY_DATE_MISMATCH");
  if (srcDate !== date) structuralFlags.push("SOURCE_DATE_MISMATCH");
  if (sourceReceiptState !== "READY") structuralFlags.push(`SOURCE_RECEIPT_${String(sourceReceiptState)}`);
  if (Date.parse(available) > Date.parse(clock)) structuralFlags.push("SOURCE_AVAILABLE_AFTER_DECISION");
  if (Date.parse(seenAt) > Date.parse(captured)) structuralFlags.push("CAPTURE_BEFORE_OBSERVATION");

  const sourceEligible =
    sourcePointInTimeEligible === true
    && sourceReceiptState === "READY"
    && srcDate === date
    && Date.parse(available) <= Date.parse(clock)
    && Date.parse(seenAt) <= Date.parse(captured);

  const historyWindow = rows.slice(-21);
  const historyWindowHash = await sha256Hex(historyWindow);

  const provenance = {
    sourceId: srcId,
    sourceName: srcName,
    sourceUrl: sourceUrl || undefined,
    sourceDate: srcDate,
    observedAt: seenAt,
    availableAt: available,
    capturedAt: captured,
    pointInTimeEligible: sourceEligible,
    historyWindowHash,
  };

  let commonUnknownReason = null;
  if (!sourceEligible) {
    if (sourceReceiptState !== "READY") commonUnknownReason = "SOURCE_RECEIPT_NOT_READY";
    else if (srcDate !== date) commonUnknownReason = "SOURCE_DATE_MISMATCH";
    else if (Date.parse(available) > Date.parse(clock)) commonUnknownReason = "SOURCE_AVAILABLE_AFTER_DECISION";
    else if (Date.parse(seenAt) > Date.parse(captured)) commonUnknownReason = "CAPTURE_BEFORE_OBSERVATION";
    else commonUnknownReason = "SOURCE_NOT_PIT_ELIGIBLE";
  } else if (rows.length < 21) {
    commonUnknownReason = "INSUFFICIENT_21_SESSION_HISTORY";
  } else if (rows.at(-1)?.date !== date) {
    commonUnknownReason = "HISTORY_LAST_DATE_MISMATCH";
  }

  let rv5 = null;
  let rv20 = null;
  let ratio = null;
  if (!commonUnknownReason) {
    const returns20 = simpleReturns(historyWindow);
    const returns5 = returns20.slice(-5);
    rv5 = populationStd(returns5);
    rv20 = populationStd(returns20);
    ratio = Number.isFinite(rv20) && rv20 > 0 && Number.isFinite(rv5) ? rv5 / rv20 : null;
  }

  const commonArgs = {
    marketDate: date,
    decisionTimestamp: clock,
    provenance,
    sourceReceiptRef: receiptRef,
    qualityFlags: structuralFlags,
  };

  const factors = [];
  if (commonUnknownReason) {
    for (const factorId of MARKET_RV_FACTOR_IDS) {
      factors.push(unknownObservation({
        factorId,
        reason: commonUnknownReason,
        ...commonArgs,
      }));
    }
  } else {
    factors.push(knownObservation({
      factorId: "MARKET_RV5_CC_SIMPLE",
      rawValue: rv5,
      ...commonArgs,
    }));
    factors.push(knownObservation({
      factorId: "MARKET_RV20_CC_SIMPLE",
      rawValue: rv20,
      ...commonArgs,
    }));
    if (ratio === null) {
      factors.push(unknownObservation({
        factorId: "MARKET_RV_RATIO_5_20",
        reason: "RV20_ZERO_DENOMINATOR",
        ...commonArgs,
      }));
    } else {
      factors.push(knownObservation({
        factorId: "MARKET_RV_RATIO_5_20",
        rawValue: ratio,
        ...commonArgs,
      }));
    }
  }

  const base = {
    bundleId: id,
    marketDate: date,
    decisionTimestamp: clock,
    sourceReceiptRef: receiptRef,
    sourceReceiptState,
    sourcePointInTimeEligible,
    sourceEligible,
    historyWindowHash,
    historyCount: rows.length,
    firstHistoryDate: rows[0]?.date || null,
    lastHistoryDate: rows.at(-1)?.date || null,
    formula: deepFreeze({
      returnType: "SIMPLE_CLOSE_TO_CLOSE",
      rv5: "populationStd(last 5 official close-to-close simple returns)",
      rv20: "populationStd(last 20 official close-to-close simple returns)",
      ratio: "rv5 / rv20 when rv20 > 0",
      annualized: false,
    }),
    metrics: deepFreeze({ rv5, rv20, ratio }),
    factorObservations: Object.freeze(factors),
    strategyScoreAssigned: false,
    strategyThresholdApplied: false,
    selectionImpact: false,
    persistencePerformed: false,
    schemaVersion: "D04_MARKET_RV_BUNDLE_V0_1_RESEARCH",
  };
  const bundleHash = await sha256Hex(base);
  return deepFreeze({ ...base, bundleHash });
}
