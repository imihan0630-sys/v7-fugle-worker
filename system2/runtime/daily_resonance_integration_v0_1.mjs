import { sha256Hex } from "./decision_archive.mjs";

export const DAILY_RESONANCE_INTEGRATION_VERSION = "0.1-RESEARCH";
export const DAILY_RESONANCE_HISTORY_SOURCE_ID =
  "FUGLE_MARKETDATA_V1_STOCK_HISTORICAL_DAILY_ADJUSTED";
export const DAILY_RESONANCE_POOL_MAX_SYMBOLS = 9;

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function dateText(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(`${field} must be YYYY-MM-DD`);
  return text;
}

function timestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

function finite(value, field) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`${field} must be finite`);
  return number;
}

function parseJson(value, fallback, field) {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(String(value));
  } catch {
    throw new Error(`${field} must be valid JSON`);
  }
}

export function taipeiMarketDateV0_1(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error("value must be a date");
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function taipeiClockPartsV0_1(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error("value must be a date");
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Taipei",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date).map((part) => [part.type, part.value]),
  );
  return Object.freeze({
    weekday: parts.weekday,
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  });
}

export function classifyResonanceScheduleTimeV0_1(value = new Date()) {
  const { weekday, hour, minute } = taipeiClockPartsV0_1(value);
  const weekdaySession = !["Sat", "Sun"].includes(weekday);
  const minutes = hour * 60 + minute;
  return Object.freeze({
    weekdaySession,
    intradayMonitor: weekdaySession && minutes >= 8 * 60 + 55 && minutes <= 13 * 60 + 40,
    afterMarketPoolRefresh: weekdaySession && hour === 19 && minute === 0,
    officialCloseConfirmedByClock: weekdaySession && minutes >= 13 * 60 + 30,
  });
}

function normalizeHistoryBar(raw, index) {
  if (!raw || typeof raw !== "object") throw new Error(`history.data[${index}] must be an object`);
  const date = dateText(raw.date, `history.data[${index}].date`);
  const open = finite(raw.open, `history.data[${index}].open`);
  const high = finite(raw.high, `history.data[${index}].high`);
  const low = finite(raw.low, `history.data[${index}].low`);
  const close = finite(raw.close, `history.data[${index}].close`);
  const volumeShares = raw.volume === null || raw.volume === undefined
    ? null
    : finite(raw.volume, `history.data[${index}].volume`);
  if ([open, high, low, close].some((x) => x <= 0)) throw new Error("history OHLC must be positive");
  if (high < low || high < open || high < close || low > open || low > close) {
    throw new Error(`history.data[${index}] has inconsistent OHLC`);
  }
  if (volumeShares !== null && volumeShares < 0) throw new Error("history volume cannot be negative");
  return Object.freeze({ date, open, high, low, close, volumeShares });
}

export async function normalizeFugleAdjustedDailyHistoryV0_1({
  symbol,
  marketDate,
  fetchedAt,
  rawHistory,
} = {}) {
  const code = requiredText(symbol, "symbol");
  const targetDate = dateText(marketDate, "marketDate");
  const capturedAt = timestamp(fetchedAt, "fetchedAt");
  if (!rawHistory || typeof rawHistory !== "object") throw new Error("rawHistory is required");
  if (String(rawHistory.symbol || "") !== code) throw new Error("history symbol mismatch");
  if (String(rawHistory.timeframe || "") !== "D") throw new Error("history timeframe must be D");
  if (rawHistory.adjusted !== true) throw new Error("history must explicitly be adjusted=true");

  const rows = (Array.isArray(rawHistory.data) ? rawHistory.data : []).map(normalizeHistoryBar);
  rows.sort((a, b) => a.date.localeCompare(b.date));
  if (new Set(rows.map((row) => row.date)).size !== rows.length) {
    throw new Error("history contains duplicate dates");
  }
  if (rows.some((row) => row.date >= targetDate)) {
    throw new Error("history must contain only finalized dates before marketDate");
  }
  if (rows.length < 64) throw new Error("history requires at least 64 finalized daily bars");

  const bars = Object.freeze(rows.slice(-180));
  const historyHash = await sha256Hex({
    sourceId: DAILY_RESONANCE_HISTORY_SOURCE_ID,
    symbol: code,
    marketDate: targetDate,
    adjusted: true,
    bars,
  });
  return Object.freeze({
    schemaVersion: "SYSTEM2_FUGLE_ADJUSTED_DAILY_HISTORY_V0_1",
    sourceId: DAILY_RESONANCE_HISTORY_SOURCE_ID,
    symbol: code,
    marketDate: targetDate,
    fetchedAt: capturedAt,
    adjusted: true,
    barCount: bars.length,
    firstDate: bars[0]?.date ?? null,
    lastDate: bars.at(-1)?.date ?? null,
    bars,
    historyHash,
  });
}

export function resolveAdjustedHistoryContinuityV0_1({ history, rawTicker } = {}) {
  if (!history || history.adjusted !== true || !Array.isArray(history.bars)) {
    throw new Error("adjusted history is required");
  }
  if (!rawTicker || typeof rawTicker !== "object") throw new Error("rawTicker is required");
  const referencePrice = Number(rawTicker.referencePrice);
  const previousAdjustedClose = Number(history.bars.at(-1)?.close);
  const relativeError = Number.isFinite(referencePrice) && referencePrice > 0
    && Number.isFinite(previousAdjustedClose) && previousAdjustedClose > 0
      ? Math.abs(previousAdjustedClose / referencePrice - 1)
      : null;
  const verified = relativeError !== null && relativeError <= 0.002;
  return Object.freeze({
    schemaVersion: "SYSTEM2_RESONANCE_ADJUSTED_CONTINUITY_RECEIPT_V0_1",
    state: verified ? "ADJUSTED_CONTINUITY" : "UNVERIFIED",
    referencePrice: Number.isFinite(referencePrice) ? referencePrice : null,
    previousAdjustedClose: Number.isFinite(previousAdjustedClose) ? previousAdjustedClose : null,
    relativeError,
    tolerance: 0.002,
    historyLastDate: history.lastDate,
    historyHash: history.historyHash,
    reason: verified
      ? "ADJUSTED_HISTORY_LAST_CLOSE_MATCHES_CURRENT_SESSION_REFERENCE_PRICE"
      : "ADJUSTED_HISTORY_REFERENCE_PRICE_MISMATCH_OR_MISSING",
  });
}

function normalizeActiveAssignments(raw) {
  const assignments = parseJson(raw, {}, "activeAssignments");
  if (!assignments || typeof assignments !== "object" || Array.isArray(assignments)) {
    throw new Error("activeAssignments must be an object");
  }
  const bySymbol = new Map();
  for (const [strategyIdRaw, rows] of Object.entries(assignments)) {
    const strategyId = requiredText(strategyIdRaw, "strategyId");
    if (!Array.isArray(rows)) throw new Error(`activeAssignments.${strategyId} must be an array`);
    if (rows.length > 3) throw new Error(`activeAssignments.${strategyId} exceeds per-strategy cap 3`);
    for (const rawRow of rows) {
      const symbol = requiredText(rawRow?.symbol, `activeAssignments.${strategyId}.symbol`);
      const existing = bySymbol.get(symbol) || {
        symbol,
        companyName: rawRow?.companyName || null,
        poolIds: [],
        strategyMemberships: [],
      };
      existing.poolIds.push(`ACTIVE_INTRADAY_MONITOR:${strategyId}`);
      existing.strategyMemberships.push(Object.freeze({
        strategyId,
        strategyVersion: rawRow?.strategyVersion || null,
        decisionId: rawRow?.decisionId || null,
        entryReadiness: rawRow?.entryReadiness || null,
        strategyLocalRank: Number.isInteger(rawRow?.strategyLocalRank)
          ? rawRow.strategyLocalRank
          : null,
      }));
      bySymbol.set(symbol, existing);
    }
  }
  return [...bySymbol.values()].map((row) => Object.freeze({
    ...row,
    poolIds: Object.freeze([...new Set(row.poolIds)]),
    strategyMemberships: Object.freeze(row.strategyMemberships),
  }));
}

export async function buildResonanceWatchPoolFromCapacityRowV0_1({
  capacityRow,
  activatedAt,
} = {}) {
  if (!capacityRow || typeof capacityRow !== "object") throw new Error("capacityRow is required");
  const capacityRunId = requiredText(
    capacityRow.capacity_run_id ?? capacityRow.capacityRunId,
    "capacityRunId",
  );
  const capacityHash = requiredText(
    capacityRow.capacity_hash ?? capacityRow.capacityHash,
    "capacityHash",
  );
  const marketDate = dateText(
    capacityRow.market_date ?? capacityRow.marketDate,
    "marketDate",
  );
  const decisionTimestamp = timestamp(
    capacityRow.decision_timestamp ?? capacityRow.decisionTimestamp,
    "decisionTimestamp",
  );
  const activated = timestamp(activatedAt, "activatedAt");
  const symbols = normalizeActiveAssignments(
    capacityRow.active_assignments_json ?? capacityRow.activeAssignments,
  );
  if (symbols.length > DAILY_RESONANCE_POOL_MAX_SYMBOLS) {
    throw new Error("bounded resonance watch pool cannot exceed 9 unique symbols");
  }
  const sorted = symbols.sort((a, b) => a.symbol.localeCompare(b.symbol));
  const poolBase = {
    sourceCapacityRunId: capacityRunId,
    sourceCapacityHash: capacityHash,
    sourceMarketDate: marketDate,
    sourceDecisionTimestamp: decisionTimestamp,
    mode: "BOUNDED_PRESELECTED_ONLY",
    maxUniqueSymbols: DAILY_RESONANCE_POOL_MAX_SYMBOLS,
    symbolCount: sorted.length,
    symbols: sorted,
    fullMarketScan: false,
  };
  const poolHash = await sha256Hex(poolBase);
  return Object.freeze({
    schemaVersion: "SYSTEM2_RESONANCE_WATCH_POOL_V0_1",
    poolId: `S2_RESONANCE_POOL:${capacityRunId}`,
    ...poolBase,
    activatedAt: activated,
    state: sorted.length ? "ACTIVE" : "ZERO_PICK_ACTIVE",
    poolHash,
    decisionImpact: false,
    notificationImpact: false,
    orderImpact: false,
  });
}

export function historyQueryRangeV0_1(marketDate) {
  const target = dateText(marketDate, "marketDate");
  const to = new Date(`${target}T00:00:00.000Z`);
  to.setUTCDate(to.getUTCDate() - 1);
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - 300);
  return Object.freeze({ from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) });
}
