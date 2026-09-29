// System2 research-only live adapter for the bounded daily resonance monitor.
// It normalizes an already-fetched quote snapshot into today's partial/final daily bar.
// No network access, no persistence, no push, no orders, and no System1/V8 dependency.

export const DAILY_RESONANCE_LIVE_ADAPTER_VERSION = "0.1-RESEARCH";
export const DAILY_RESONANCE_LIVE_ADAPTER_MAX_SYMBOLS = 9;
export const DAILY_RESONANCE_QUOTE_SEMANTIC_CONTRACT =
  "VERIFIED_SESSION_OHLC_CUMULATIVE_VOLUME_V0_1";

const CONTINUITY_STATES = new Set([
  "CLEAR_NO_ACTION",
  "ADJUSTED_CONTINUITY",
  "UNVERIFIED",
  "BROKEN",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return text;
}

function marketDateText(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function finiteOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(String(value).replaceAll(",", "").trim());
  return Number.isFinite(n) ? n : null;
}

function positiveOrNull(value) {
  const n = finiteOrNull(value);
  return n !== null && n > 0 ? n : null;
}

function nonNegativeOrNull(value) {
  const n = finiteOrNull(value);
  return n !== null && n >= 0 ? n : null;
}

function officialCloseUtc(marketDate) {
  return Date.parse(marketDate + "T05:30:00.000Z");
}

function normalizeQuote(raw, marketDate) {
  if (!raw || typeof raw !== "object") throw new Error("quote must be an object");
  const quoteDate = marketDateText(raw.marketDate, "quote.marketDate");
  if (quoteDate !== marketDate) throw new Error("quote.marketDate must equal marketDate");
  const observedAt = isoTimestamp(raw.observedAt, "quote.observedAt");
  const providerTimestamp = raw.providerTimestamp
    ? isoTimestamp(raw.providerTimestamp, "quote.providerTimestamp")
    : null;
  const lastTradeAt = raw.lastTradeAt
    ? isoTimestamp(raw.lastTradeAt, "quote.lastTradeAt")
    : null;

  if (providerTimestamp && Date.parse(providerTimestamp) > Date.parse(observedAt)) {
    throw new Error("quote.providerTimestamp cannot be after observedAt");
  }
  if (lastTradeAt && Date.parse(lastTradeAt) > Date.parse(observedAt)) {
    throw new Error("quote.lastTradeAt cannot be after observedAt");
  }

  const open = positiveOrNull(raw.open);
  const high = positiveOrNull(raw.high);
  const low = positiveOrNull(raw.low);
  const lastPrice = positiveOrNull(raw.lastPrice ?? raw.close);
  const volumeShares = nonNegativeOrNull(raw.cumulativeVolumeShares ?? raw.volumeShares);
  const tradeValue = nonNegativeOrNull(raw.cumulativeTradeValue ?? raw.tradeValue);
  const transactionCount = nonNegativeOrNull(raw.cumulativeTransactionCount ?? raw.transactionCount);

  const noTradeYet = open === null && high === null && low === null && lastPrice === null
    && (volumeShares === null || volumeShares === 0);

  const completeOhlc = [open, high, low, lastPrice].every(Number.isFinite);
  if (!noTradeYet && !completeOhlc) throw new Error("quote must provide complete OHLC after trading begins");
  if (completeOhlc && (high < low || high < open || high < lastPrice || low > open || low > lastPrice)) {
    throw new Error("quote contains inconsistent OHLC");
  }

  return Object.freeze({
    marketDate: quoteDate,
    observedAt,
    providerTimestamp,
    lastTradeAt,
    open,
    high,
    low,
    lastPrice,
    volumeShares,
    tradeValue,
    transactionCount,
    sourceFinality: raw.sourceFinality === "FINAL" ? "FINAL" : "LIVE",
    semanticContract: raw.semanticContract ?? null,
    isTrial: raw.isTrial === true,
    isHalted: raw.isHalted === true,
    isSuspended: raw.isSuspended === true,
    noTradeYet,
  });
}

export function buildCurrentDailyBarFromNormalizedQuoteV0_1({
  symbol,
  marketDate,
  asOf,
  quote,
  continuityState = "UNVERIFIED",
  sourceId,
  sourceName,
  officialSessionCloseConfirmed = false,
} = {}) {
  const code = requiredText(symbol, "symbol");
  const date = marketDateText(marketDate, "marketDate");
  const clock = isoTimestamp(asOf, "asOf");
  const continuity = requiredText(continuityState, "continuityState");
  if (!CONTINUITY_STATES.has(continuity)) throw new Error("unsupported continuityState");
  const srcId = requiredText(sourceId, "sourceId");
  const srcName = requiredText(sourceName, "sourceName");
  const q = normalizeQuote(quote, date);

  if (Date.parse(q.observedAt) > Date.parse(clock)) {
    throw new Error("quote observation is after adapter asOf");
  }

  const warnings = [];
  const blockers = [];

  if (q.semanticContract !== DAILY_RESONANCE_QUOTE_SEMANTIC_CONTRACT) {
    blockers.push("QUOTE_OHLC_SEMANTICS_UNVERIFIED");
  }
  if (q.isTrial) blockers.push("TRIAL_QUOTE_NOT_ELIGIBLE");
  if (q.isSuspended) blockers.push("SYMBOL_SUSPENDED");
  if (q.isHalted) blockers.push("SYMBOL_HALTED");
  if (continuity !== "CLEAR_NO_ACTION" && continuity !== "ADJUSTED_CONTINUITY") {
    blockers.push("PRICE_CONTINUITY_NOT_VERIFIED");
  }
  if (q.noTradeYet) blockers.push("NO_TRADE_YET");

  const afterOfficialClose = Date.parse(q.observedAt) >= officialCloseUtc(date);
  const canConfirmFinal =
    q.sourceFinality === "FINAL"
    && officialSessionCloseConfirmed === true
    && afterOfficialClose
    && blockers.length === 0;

  if (q.sourceFinality === "FINAL" && !officialSessionCloseConfirmed) {
    warnings.push("SOURCE_FINALITY_NOT_INDEPENDENTLY_CONFIRMED");
  }
  if (q.sourceFinality === "FINAL" && !afterOfficialClose) {
    warnings.push("FINAL_FLAG_BEFORE_OFFICIAL_CLOSE");
  }
  if (!canConfirmFinal && blockers.length === 0) {
    warnings.push("CURRENT_DAILY_BAR_IS_PROVISIONAL");
  }

  const currentDailyBar = q.noTradeYet ? null : Object.freeze({
    date,
    open: q.open,
    high: q.high,
    low: q.low,
    close: q.lastPrice,
    volumeShares: q.volumeShares,
    tradeValue: q.tradeValue,
    transactionCount: q.transactionCount,
  });

  return Object.freeze({
    schemaVersion: "SYSTEM2_DAILY_RESONANCE_LIVE_ADAPTER_OUTPUT_V0_1",
    adapterVersion: DAILY_RESONANCE_LIVE_ADAPTER_VERSION,
    symbol: code,
    marketDate: date,
    asOf: clock,
    sourceId: srcId,
    sourceName: srcName,
    quoteObservedAt: q.observedAt,
    quoteProviderTimestamp: q.providerTimestamp,
    quoteLastTradeAt: q.lastTradeAt,
    sourceFinality: q.sourceFinality,
    officialSessionCloseConfirmed: officialSessionCloseConfirmed === true,
    afterOfficialClose,
    continuityState: continuity,
    monitorEligible: blockers.length === 0,
    currentDailyBar,
    currentDailyBarState: canConfirmFinal ? "FINAL" : "LIVE",
    finalityState: blockers.length
      ? "BLOCKED"
      : canConfirmFinal
        ? "CONFIRMED_DAILY_CLOSE"
        : "PROVISIONAL_DAILY_BAR",
    blockers: Object.freeze(blockers),
    warnings: Object.freeze(warnings),
    monitorInput: Object.freeze({
      symbol: code,
      marketDate: date,
      currentDailyBar,
      currentDailyBarState: canConfirmFinal ? "FINAL" : "LIVE",
      continuityState: continuity,
    }),
    decisionImpact: false,
    notificationImpact: false,
    orderImpact: false,
    fullMarketScan: false,
  });
}

export function buildDailyResonanceLiveAdapterBatchV0_1({
  marketDate,
  asOf,
  items,
  maxUniqueSymbols = DAILY_RESONANCE_LIVE_ADAPTER_MAX_SYMBOLS,
} = {}) {
  const date = marketDateText(marketDate, "marketDate");
  const clock = isoTimestamp(asOf, "asOf");
  if (!Array.isArray(items)) throw new Error("items must be an array");
  if (!Number.isInteger(maxUniqueSymbols) || maxUniqueSymbols < 1 || maxUniqueSymbols > 9) {
    throw new Error("maxUniqueSymbols must be between 1 and 9");
  }
  const symbols = items.map((item) => requiredText(item?.symbol, "item.symbol"));
  if (new Set(symbols).size !== symbols.length) throw new Error("duplicate symbols are not allowed");
  if (symbols.length > maxUniqueSymbols) {
    throw new Error("bounded resonance live adapter cannot exceed " + maxUniqueSymbols + " symbols");
  }

  const outputs = items.map((item) => buildCurrentDailyBarFromNormalizedQuoteV0_1({
    ...item,
    marketDate: date,
    asOf: clock,
  }));

  return Object.freeze({
    schemaVersion: "SYSTEM2_DAILY_RESONANCE_LIVE_ADAPTER_BATCH_V0_1",
    adapterVersion: DAILY_RESONANCE_LIVE_ADAPTER_VERSION,
    marketDate: date,
    asOf: clock,
    mode: "BOUNDED_PRESELECTED_ONLY",
    maxUniqueSymbols,
    symbolCount: outputs.length,
    outputs: Object.freeze(outputs),
    eligibleCount: outputs.filter((x) => x.monitorEligible).length,
    blockedCount: outputs.filter((x) => !x.monitorEligible).length,
    fullMarketScan: false,
    decisionImpact: false,
    notificationImpact: false,
    orderImpact: false,
  });
}
