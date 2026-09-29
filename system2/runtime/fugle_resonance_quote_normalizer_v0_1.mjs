// System2 research-only Fugle v1 intraday quote normalizer for the bounded daily resonance monitor.
// Pure normalization/validation: no HTTP calls, no secrets, no persistence, no push, no orders.

export const FUGLE_RESONANCE_QUOTE_NORMALIZER_VERSION = "0.1-RESEARCH";
export const FUGLE_RESONANCE_SOURCE_ID = "FUGLE_MARKETDATA_V1_STOCK_INTRADAY_QUOTE";
export const FUGLE_RESONANCE_SEMANTIC_CONTRACT =
  "VERIFIED_SESSION_OHLC_CUMULATIVE_VOLUME_V0_1";

const ORDINARY_SECURITY_TYPE = "01";
const NORMAL_SECURITY_STATUS = "NORMAL";
const SUPPORTED_REQUEST_TYPE = "REGULAR";
const SUPPORTED_TICKER_TYPE = "EQUITY";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function optionalText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function marketDateText(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
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

function booleanOrFalse(value) {
  return value === true;
}

function taipeiDateFromMs(ms) {
  // Taiwan has no DST; +08:00 conversion is stable for the market dates in scope.
  return new Date(ms + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function fugleMicrosecondsToIsoV0_1(value, field = "timestamp") {
  const n = finiteOrNull(value);
  if (n === null) return null;
  if (!Number.isInteger(n) || n < 1e14 || n > 9e15) {
    throw new Error(field + " must be a Unix-microsecond integer");
  }
  return new Date(Math.trunc(n / 1000)).toISOString();
}

function assertSameMarketDate(timestampIso, marketDate, field) {
  if (!timestampIso) return;
  const ms = Date.parse(timestampIso);
  if (!Number.isFinite(ms)) throw new Error(field + " is not parseable");
  if (taipeiDateFromMs(ms) !== marketDate) {
    throw new Error(field + " does not belong to marketDate in Asia/Taipei");
  }
}

function normalizeTickerMeta(rawTicker, symbol, marketDate) {
  if (!rawTicker || typeof rawTicker !== "object") {
    return Object.freeze({
      valid: false,
      blockers: Object.freeze(["TICKER_METADATA_MISSING"]),
      securityType: null,
      securityStatus: null,
      boardLot: null,
      tradingCurrency: null,
      exchange: null,
      market: null,
    });
  }

  const blockers = [];
  const tickerSymbol = optionalText(rawTicker.symbol);
  const tickerDate = optionalText(rawTicker.date);
  const tickerType = optionalText(rawTicker.type);
  const securityType = optionalText(rawTicker.securityType);
  const securityStatus = optionalText(rawTicker.securityStatus);
  const boardLot = positiveOrNull(rawTicker.boardLot);
  const tradingCurrency = optionalText(rawTicker.tradingCurrency);
  const exchange = optionalText(rawTicker.exchange);
  const market = optionalText(rawTicker.market);

  if (tickerSymbol !== symbol) blockers.push("TICKER_SYMBOL_MISMATCH");
  if (tickerDate !== marketDate) blockers.push("TICKER_DATE_MISMATCH");
  if (tickerType !== SUPPORTED_TICKER_TYPE) blockers.push("TICKER_TYPE_NOT_EQUITY");
  if (securityType !== ORDINARY_SECURITY_TYPE) blockers.push("SECURITY_TYPE_NOT_ORDINARY_STOCK");
  if (securityStatus !== NORMAL_SECURITY_STATUS) blockers.push("SECURITY_STATUS_NOT_NORMAL");
  if (!Number.isFinite(boardLot)) blockers.push("BOARD_LOT_MISSING");
  if (tradingCurrency !== "TWD") blockers.push("TRADING_CURRENCY_NOT_TWD");
  if (!exchange) blockers.push("TICKER_EXCHANGE_MISSING");
  if (!market) blockers.push("TICKER_MARKET_MISSING");

  return Object.freeze({
    valid: blockers.length === 0,
    blockers: Object.freeze(blockers),
    securityType,
    securityStatus,
    boardLot,
    tradingCurrency,
    exchange,
    market,
  });
}

function verifyRegularEquityVolumeUnit({
  tradeValue,
  tradeVolume,
  avgPrice,
  boardLot,
  noTradeYet,
}) {
  if (noTradeYet) {
    return Object.freeze({
      state: "NO_TRADE_ZERO_VOLUME",
      cumulativeVolumeShares: 0,
      impliedAveragePrice: null,
      relativeAveragePriceError: null,
    });
  }

  if (
    !Number.isFinite(tradeValue)
    || !Number.isFinite(tradeVolume)
    || tradeVolume <= 0
    || !Number.isFinite(avgPrice)
    || avgPrice <= 0
    || !Number.isFinite(boardLot)
    || boardLot <= 0
  ) {
    return Object.freeze({
      state: "UNVERIFIED_REQUIRED_FIELDS_MISSING",
      cumulativeVolumeShares: null,
      impliedAveragePrice: null,
      relativeAveragePriceError: null,
    });
  }

  const cumulativeVolumeShares = tradeVolume * boardLot;
  const impliedAveragePrice = tradeValue / cumulativeVolumeShares;
  const relativeAveragePriceError = Math.abs(impliedAveragePrice / avgPrice - 1);
  // avgPrice is rounded in provider payloads; allow a conservative 0.2% consistency band.
  const verified = relativeAveragePriceError <= 0.002;

  return Object.freeze({
    state: verified ? "VERIFIED_BY_VALUE_VOLUME_AVGPRICE" : "MISMATCH_VALUE_VOLUME_AVGPRICE",
    cumulativeVolumeShares: verified ? cumulativeVolumeShares : null,
    impliedAveragePrice,
    relativeAveragePriceError,
  });
}

function normalizeFugleQuote(rawQuote, symbol, marketDate) {
  if (!rawQuote || typeof rawQuote !== "object") throw new Error("rawQuote must be an object");

  const blockers = [];
  const quoteSymbol = optionalText(rawQuote.symbol);
  const quoteDate = optionalText(rawQuote.date);
  const quoteType = optionalText(rawQuote.type);
  const exchange = optionalText(rawQuote.exchange);
  const market = optionalText(rawQuote.market);

  if (quoteSymbol !== symbol) blockers.push("QUOTE_SYMBOL_MISMATCH");
  if (quoteDate !== marketDate) blockers.push("QUOTE_DATE_MISMATCH");
  if (quoteType !== SUPPORTED_TICKER_TYPE) blockers.push("QUOTE_TYPE_NOT_EQUITY");
  if (!exchange) blockers.push("QUOTE_EXCHANGE_MISSING");
  if (!market) blockers.push("QUOTE_MARKET_MISSING");

  const open = positiveOrNull(rawQuote.openPrice);
  const high = positiveOrNull(rawQuote.highPrice);
  const low = positiveOrNull(rawQuote.lowPrice);
  // Fugle documents closePrice as the actual latest/closing trade price.
  // lastPrice can include trial matching, so it is deliberately not used as the OHLC close.
  const close = positiveOrNull(rawQuote.closePrice);
  const lastActualTradePrice = positiveOrNull(rawQuote?.lastTrade?.price);
  const avgPrice = positiveOrNull(rawQuote.avgPrice);
  const tradeValue = nonNegativeOrNull(rawQuote?.total?.tradeValue);
  const tradeVolume = nonNegativeOrNull(rawQuote?.total?.tradeVolume);
  const transaction = nonNegativeOrNull(rawQuote?.total?.transaction);

  const noTradeYet =
    open === null
    && high === null
    && low === null
    && close === null
    && (tradeVolume === null || tradeVolume === 0);

  const completeOhlc = [open, high, low, close].every(Number.isFinite);
  if (!noTradeYet && !completeOhlc) blockers.push("QUOTE_OHLC_INCOMPLETE_AFTER_TRADING_BEGAN");
  if (
    completeOhlc
    && (high < low || high < open || high < close || low > open || low > close)
  ) {
    blockers.push("QUOTE_OHLC_INCONSISTENT");
  }

  if (
    Number.isFinite(close)
    && Number.isFinite(lastActualTradePrice)
    && Math.abs(close - lastActualTradePrice) > 1e-9
  ) {
    blockers.push("CLOSE_PRICE_LAST_ACTUAL_TRADE_MISMATCH");
  }

  const providerTimestamp = fugleMicrosecondsToIsoV0_1(
    rawQuote.lastUpdated ?? rawQuote?.total?.time,
    "quote.lastUpdated",
  );
  const totalTimestamp = fugleMicrosecondsToIsoV0_1(rawQuote?.total?.time, "quote.total.time");
  const lastTradeAt = fugleMicrosecondsToIsoV0_1(
    rawQuote?.lastTrade?.time ?? rawQuote.closeTime,
    "quote.lastTrade.time",
  );
  const closeTime = fugleMicrosecondsToIsoV0_1(rawQuote.closeTime, "quote.closeTime");
  const openTime = fugleMicrosecondsToIsoV0_1(rawQuote.openTime, "quote.openTime");
  const highTime = fugleMicrosecondsToIsoV0_1(rawQuote.highTime, "quote.highTime");
  const lowTime = fugleMicrosecondsToIsoV0_1(rawQuote.lowTime, "quote.lowTime");

  for (const [field, value] of [
    ["quote.lastUpdated", providerTimestamp],
    ["quote.total.time", totalTimestamp],
    ["quote.lastTrade.time", lastTradeAt],
    ["quote.closeTime", closeTime],
    ["quote.openTime", openTime],
    ["quote.highTime", highTime],
    ["quote.lowTime", lowTime],
  ]) {
    assertSameMarketDate(value, marketDate, field);
  }

  if (
    providerTimestamp
    && totalTimestamp
    && Date.parse(totalTimestamp) > Date.parse(providerTimestamp)
  ) {
    blockers.push("TOTAL_TIMESTAMP_AFTER_LAST_UPDATED");
  }
  if (
    providerTimestamp
    && lastTradeAt
    && Date.parse(lastTradeAt) > Date.parse(providerTimestamp)
  ) {
    blockers.push("LAST_TRADE_AFTER_LAST_UPDATED");
  }

  return Object.freeze({
    blockers: Object.freeze(blockers),
    quoteType,
    exchange,
    market,
    open,
    high,
    low,
    close,
    avgPrice,
    tradeValue,
    tradeVolume,
    transaction,
    noTradeYet,
    providerTimestamp,
    totalTimestamp,
    lastTradeAt,
    closeTime,
    openTime,
    highTime,
    lowTime,
    isTrial: booleanOrFalse(rawQuote.isTrial),
    isClose: booleanOrFalse(rawQuote.isClose),
    isOpen: booleanOrFalse(rawQuote.isOpen),
    isDelayedOpen: booleanOrFalse(rawQuote.isDelayedOpen),
    isDelayedClose: booleanOrFalse(rawQuote.isDelayedClose),
    isVolatilityInterrupted:
      booleanOrFalse(rawQuote.isLimitDownHalt) || booleanOrFalse(rawQuote.isLimitUpHalt),
    isHalted: booleanOrFalse(rawQuote?.tradingHalt?.isHalted),
    isLimitUpPrice: booleanOrFalse(rawQuote.isLimitUpPrice),
    isLimitDownPrice: booleanOrFalse(rawQuote.isLimitDownPrice),
    serial: finiteOrNull(rawQuote.serial),
  });
}

export function normalizeFugleIntradayQuoteForDailyResonanceV0_1({
  symbol,
  marketDate,
  fetchedAt,
  rawQuote,
  rawTicker,
  requestType = SUPPORTED_REQUEST_TYPE,
} = {}) {
  const code = requiredText(symbol, "symbol");
  const date = marketDateText(marketDate, "marketDate");
  const capturedAt = isoTimestamp(fetchedAt, "fetchedAt");
  const request = requiredText(requestType, "requestType");

  const quote = normalizeFugleQuote(rawQuote, code, date);
  const ticker = normalizeTickerMeta(rawTicker, code, date);
  const blockers = [...quote.blockers, ...ticker.blockers];

  if (request !== SUPPORTED_REQUEST_TYPE) blockers.push("ODDLOT_OR_NONREGULAR_REQUEST_NOT_SUPPORTED");
  if (
    ticker.exchange
    && quote.exchange
    && String(ticker.exchange).toUpperCase() !== String(quote.exchange).toUpperCase()
  ) {
    blockers.push("QUOTE_TICKER_EXCHANGE_MISMATCH");
  }
  if (
    ticker.market
    && quote.market
    && String(ticker.market).toUpperCase() !== String(quote.market).toUpperCase()
  ) {
    blockers.push("QUOTE_TICKER_MARKET_MISMATCH");
  }

  if (quote.providerTimestamp && Date.parse(quote.providerTimestamp) > Date.parse(capturedAt)) {
    blockers.push("PROVIDER_TIMESTAMP_AFTER_FETCH");
  }

  const volumeCheck = verifyRegularEquityVolumeUnit({
    tradeValue: quote.tradeValue,
    tradeVolume: quote.tradeVolume,
    avgPrice: quote.avgPrice,
    boardLot: ticker.boardLot,
    noTradeYet: quote.noTradeYet,
  });

  if (
    !quote.noTradeYet
    && volumeCheck.state !== "VERIFIED_BY_VALUE_VOLUME_AVGPRICE"
  ) {
    blockers.push("QUOTE_VOLUME_UNIT_NOT_VERIFIED");
  }

  const uniqueBlockers = Object.freeze([...new Set(blockers)]);
  const semanticVerified = uniqueBlockers.length === 0;

  const securityStatus = ticker.securityStatus;
  const isSuspended = securityStatus === "SUSPENDED" || securityStatus === "TERMINATED";
  const sourceFinality =
    quote.isClose === true && quote.isDelayedClose !== true ? "FINAL" : "LIVE";

  return Object.freeze({
    schemaVersion: "SYSTEM2_FUGLE_RESONANCE_QUOTE_NORMALIZED_V0_1",
    normalizerVersion: FUGLE_RESONANCE_QUOTE_NORMALIZER_VERSION,
    sourceId: FUGLE_RESONANCE_SOURCE_ID,
    sourceName: "Fugle MarketData v1 Stock Intraday Quote + Ticker",
    symbol: code,
    marketDate: date,
    fetchedAt: capturedAt,
    requestType: request,
    sourceTuple: Object.freeze({
      quoteType: quote.quoteType,
      exchange: quote.exchange,
      market: quote.market,
      securityType: ticker.securityType,
      securityStatus: ticker.securityStatus,
      boardLot: ticker.boardLot,
      tradingCurrency: ticker.tradingCurrency,
    }),
    semanticVerified,
    semanticBlockers: uniqueBlockers,
    volumeUnitCheck: volumeCheck,
    normalizedQuote: Object.freeze({
      marketDate: date,
      observedAt: capturedAt,
      providerTimestamp: quote.providerTimestamp,
      lastTradeAt: quote.lastTradeAt,
      open: quote.open,
      high: quote.high,
      low: quote.low,
      lastPrice: quote.close,
      cumulativeVolumeShares: volumeCheck.cumulativeVolumeShares,
      cumulativeTradeValue: quote.tradeValue,
      cumulativeTransactionCount: quote.transaction,
      sourceFinality,
      semanticContract: semanticVerified ? FUGLE_RESONANCE_SEMANTIC_CONTRACT : null,
      isTrial: quote.isTrial,
      isHalted: quote.isHalted,
      isSuspended,
      isDelayedOpen: quote.isDelayedOpen,
      isDelayedClose: quote.isDelayedClose,
      isVolatilityInterrupted: quote.isVolatilityInterrupted,
      isOpen: quote.isOpen,
      isClose: quote.isClose,
      isLimitUpPrice: quote.isLimitUpPrice,
      isLimitDownPrice: quote.isLimitDownPrice,
    }),
    rawTiming: Object.freeze({
      providerTimestamp: quote.providerTimestamp,
      totalTimestamp: quote.totalTimestamp,
      lastTradeAt: quote.lastTradeAt,
      openTime: quote.openTime,
      highTime: quote.highTime,
      lowTime: quote.lowTime,
      closeTime: quote.closeTime,
    }),
    decisionImpact: false,
    notificationImpact: false,
    orderImpact: false,
    fullMarketScan: false,
  });
}
