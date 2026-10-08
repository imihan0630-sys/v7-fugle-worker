import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const D18_TAIEX_CONTEXT_VERSION = "D18_TAIEX_CONTEXT_V0_1_RESEARCH";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const HASH_RE = /^[a-f0-9]{64}$/;

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function validDate(value) {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const d = new Date(value + "T00:00:00Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function iso(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be ISO timestamp`);
  return new Date(text).toISOString();
}

function popStd(values) {
  if (!values.length || values.some((x) => !Number.isFinite(x))) return null;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(values.reduce((s, x) => s + (x - mean) ** 2, 0) / values.length);
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) throw new Error("history must be array");
  const rows = history.map((row) => ({
    date: String(row?.date ?? row?.marketDate ?? ""),
    close: Number(row?.close),
  }));
  if (rows.some((x) => !validDate(x.date))) throw new Error("invalid history date");
  if (rows.some((x) => !Number.isFinite(x.close) || x.close <= 0)) {
    throw new Error("history close must be positive finite");
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  if (new Set(rows.map((x) => x.date)).size !== rows.length) {
    throw new Error("duplicate history date");
  }
  return rows;
}

function normalizeSessions(sessionDates) {
  if (!Array.isArray(sessionDates)) throw new Error("officialSessionDates must be array");
  const xs = sessionDates.map(String);
  if (xs.some((x) => !validDate(x))) throw new Error("invalid official session date");
  if (new Set(xs).size !== xs.length) throw new Error("duplicate official session date");
  if (xs.some((x, i) => i > 0 && x <= xs[i - 1])) throw new Error("official sessions not ascending");
  return xs;
}

function simpleReturns(rows) {
  return rows.slice(1).map((row, i) => row.close / rows[i].close - 1);
}

function mean(xs) {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function unknownOutput(base, reasons, historyHash, sessionHash) {
  return deepFreeze({
    ...base,
    state: "UNKNOWN",
    pointInTimeEligible: false,
    unknownReasons: Object.freeze([...new Set(reasons)]),
    metrics: null,
    trendContext: "UNKNOWN",
    volatilityDirection: "UNKNOWN",
    historyWindowHash: historyHash,
    officialSessionWindowHash: sessionHash,
    selectionImpact: false,
    policyApplied: false,
    schemaVersion: D18_TAIEX_CONTEXT_VERSION,
  });
}

export async function buildD18TaiexContextV0_1({
  receiptId,
  marketDate,
  decisionTimestamp,
  history,
  officialSessionDates,
  sourceProbeReceipt,
  calendarReceipt = null,
} = {}) {
  const id = requiredText(receiptId, "receiptId");
  const date = requiredText(marketDate, "marketDate");
  if (!validDate(date)) throw new Error("marketDate must be YYYY-MM-DD");
  const decisionAt = iso(decisionTimestamp, "decisionTimestamp");
  const rows = normalizeHistory(history);
  const sessions = normalizeSessions(officialSessionDates);

  if (rows.some((x) => x.date > date)) throw new Error("future history row");
  if (sessions.some((x) => x > date)) throw new Error("future official session");

  const last25Rows = rows.slice(-25);
  const last25Sessions = sessions.slice(-25);
  const historyHash = await sha256Hex(last25Rows);
  const sessionHash = await sha256Hex(last25Sessions);

  const base = {
    receiptId: id,
    marketDate: date,
    decisionTimestamp: decisionAt,
    contextVersion: D18_TAIEX_CONTEXT_VERSION,
    sourceId: "A2_TAIEX_CLOSE",
    sourceProbeContractVersion: sourceProbeReceipt?.contractVersion || null,
    sourceObservedAt: sourceProbeReceipt?.observedAt || null,
    availableAt: sourceProbeReceipt?.observedAt || null,
    sourceState: sourceProbeReceipt?.state || null,
    sourceProspectiveSameDateEligible: sourceProbeReceipt?.prospectiveSameDateEligible === true,
    calendarReceiptRef: calendarReceipt?.receiptRef || null,
  };

  const reasons = [];
  if (last25Rows.length < 25) reasons.push("INSUFFICIENT_25_SESSION_HISTORY");
  if (last25Sessions.length < 25) reasons.push("INSUFFICIENT_25_OFFICIAL_SESSIONS");
  if (last25Rows.at(-1)?.date !== date) reasons.push("HISTORY_LAST_DATE_MISMATCH");
  if (last25Sessions.at(-1) !== date) reasons.push("CALENDAR_LAST_DATE_MISMATCH");
  if (last25Rows.length === 25 && last25Sessions.length === 25) {
    if (last25Rows.some((row, i) => row.date !== last25Sessions[i])) {
      reasons.push("HISTORY_OFFICIAL_SESSION_WINDOW_MISMATCH");
    }
  }

  if (!sourceProbeReceipt || typeof sourceProbeReceipt !== "object") {
    reasons.push("MISSING_A2_SOURCE_PROBE_RECEIPT");
  } else {
    if (sourceProbeReceipt.sourceId !== "A2_TAIEX_CLOSE") reasons.push("WRONG_A2_SOURCE_ID");
    if (sourceProbeReceipt.marketDate !== date) reasons.push("A2_MARKET_DATE_MISMATCH");
    if (sourceProbeReceipt.state !== "READY") reasons.push("A2_SOURCE_NOT_READY");
    if (sourceProbeReceipt.prospectiveSameDateEligible !== true) {
      reasons.push("A2_NOT_PROSPECTIVE_SAME_DATE");
    }
    const observed = Date.parse(sourceProbeReceipt.observedAt || "");
    if (!Number.isFinite(observed)) reasons.push("A2_OBSERVED_AT_INVALID");
    else if (observed > Date.parse(decisionAt)) reasons.push("A2_OBSERVED_AFTER_DECISION");
  }

  if (!calendarReceipt || typeof calendarReceipt !== "object") {
    reasons.push("MISSING_CALENDAR_RECEIPT");
  } else {
    if (calendarReceipt.throughDate !== date) reasons.push("CALENDAR_THROUGH_DATE_MISMATCH");
    if (calendarReceipt.state !== "READY") reasons.push("CALENDAR_NOT_READY");
    if (!HASH_RE.test(String(calendarReceipt.rawPayloadHash || ""))) {
      reasons.push("CALENDAR_RAW_HASH_MISSING");
    }
    if (calendarReceipt.officialSessionWindowHash !== sessionHash) {
      reasons.push("CALENDAR_SESSION_HASH_MISMATCH");
    }
    const observed = Date.parse(calendarReceipt.observedAt || "");
    if (!Number.isFinite(observed)) reasons.push("CALENDAR_OBSERVED_AT_INVALID");
    else if (observed > Date.parse(decisionAt)) reasons.push("CALENDAR_OBSERVED_AFTER_DECISION");
  }

  if (reasons.length) return unknownOutput(base, reasons, historyHash, sessionHash);

  const closes = last25Rows.map((x) => x.close);
  const currentClose = closes.at(-1);
  const ma20 = mean(closes.slice(-20));
  const ma20FiveSessionsAgo = mean(closes.slice(0, 20));
  const ma20Slope5 = ma20 - ma20FiveSessionsAgo;
  const return5 = currentClose / closes.at(-6) - 1;
  const return20 = currentClose / closes.at(-21) - 1;

  const returns20 = simpleReturns(last25Rows.slice(-21));
  const realizedVol20 = popStd(returns20);
  const realizedVol5 = popStd(returns20.slice(-5));
  const volRatio5to20 =
    Number.isFinite(realizedVol20) && realizedVol20 > 0
      ? realizedVol5 / realizedVol20
      : null;

  let trendContext = "RANGE_OR_MIXED";
  if (currentClose > ma20 && ma20Slope5 > 0) trendContext = "UP_TREND_CONTEXT";
  else if (currentClose < ma20 && ma20Slope5 < 0) trendContext = "DOWN_TREND_CONTEXT";

  let volatilityDirection = "VOL_EQUAL";
  if (realizedVol5 > realizedVol20) volatilityDirection = "VOL_EXPANDING";
  else if (realizedVol5 < realizedVol20) volatilityDirection = "VOL_CONTRACTING";

  const payload = {
    ...base,
    state: "KNOWN",
    pointInTimeEligible: true,
    unknownReasons: Object.freeze([]),
    metrics: deepFreeze({
      close: currentClose,
      ma20,
      ma20FiveSessionsAgo,
      ma20Slope5,
      return5,
      return20,
      realizedVol5,
      realizedVol20,
      volRatio5to20,
    }),
    trendContext,
    volatilityDirection,
    historyWindowHash: historyHash,
    officialSessionWindowHash: sessionHash,
    formula: deepFreeze({
      trend: "close_vs_MA20_AND_MA20_change_over_5_official_sessions",
      volatility: "population_std_close_to_close_simple_returns_5_vs_20",
      annualized: false,
      outcomeTunedThreshold: false,
    }),
    selectionImpact: false,
    policyApplied: false,
    schemaVersion: D18_TAIEX_CONTEXT_VERSION,
  };
  const receiptHash = await sha256Hex(payload);
  return deepFreeze({ ...payload, receiptHash });
}
