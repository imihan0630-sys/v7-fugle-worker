import { deepFreeze, buildFactorObservation } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const A1_HISTORY_PRIMITIVE_VERSION = "0.1-RESEARCH";
const CONTINUITY_STATES = new Set([
  "CLEAR_NO_ACTION",
  "ADJUSTED_CONTINUITY",
  "UNVERIFIED",
  "BROKEN",
]);
const PRICE_SPACES = new Set(["RAW", "ADJUSTED"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function assertTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
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

function dateOf(raw) {
  const direct = raw?.date || raw?.marketDate;
  if (typeof direct === "string" && /^\d{4}-\d{2}-\d{2}$/.test(direct)) return direct;
  const time = raw?.time || raw?.timestamp;
  if (time && Number.isFinite(Date.parse(time))) return new Date(time).toISOString().slice(0, 10);
  return null;
}

function pick(raw, keys) {
  for (const key of keys) {
    if (raw?.[key] !== undefined && raw?.[key] !== null && raw?.[key] !== "") return raw[key];
  }
  return null;
}

function normalizeBar(raw, volumeUnit) {
  const date = dateOf(raw);
  const open = positiveOrNull(pick(raw, ["open", "OpeningPrice"]));
  const high = positiveOrNull(pick(raw, ["high", "HighestPrice"]));
  const low = positiveOrNull(pick(raw, ["low", "LowestPrice"]));
  const close = positiveOrNull(pick(raw, ["close", "ClosingPrice"]));
  const rawVolume = nonNegativeOrNull(pick(raw, ["volumeShares", "volume", "TradeVolume", "TradingShares"]));
  const volumeShares = rawVolume === null
    ? null
    : volumeUnit === "LOTS"
      ? rawVolume * 1000
      : rawVolume;
  const tradeValue = nonNegativeOrNull(pick(raw, ["tradeValue", "turnover", "TradeValue", "TransactionAmount"]));
  const completeOhlc = [open, high, low, close].every(Number.isFinite);
  const ohlcConsistent = !completeOhlc
    || (high >= low && high >= open && high >= close && low <= open && low <= close);

  return {
    date,
    open,
    high,
    low,
    close,
    volumeShares,
    tradeValue,
    completeOhlc,
    ohlcConsistent,
  };
}

function mean(values) {
  const xs = values.filter(Number.isFinite);
  return xs.length === values.length && xs.length
    ? xs.reduce((a, b) => a + b, 0) / xs.length
    : null;
}

function populationStd(values) {
  if (!values.length || values.some((x) => !Number.isFinite(x))) return null;
  const avg = mean(values);
  const variance = values.reduce((sum, x) => sum + (x - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function tail(values, n, offset = 0) {
  const end = values.length - offset;
  if (end < n) return null;
  return values.slice(end - n, end);
}

function movingAverage(bars, n, offset = 0) {
  const xs = tail(bars, n, offset);
  return xs ? mean(xs.map((x) => x.close)) : null;
}

function averageVolumeShares(bars, n, offset = 0) {
  const xs = tail(bars, n, offset);
  return xs ? mean(xs.map((x) => x.volumeShares)) : null;
}

function averageTradeValue(bars, n, offset = 0) {
  const xs = tail(bars, n, offset);
  return xs ? mean(xs.map((x) => x.tradeValue)) : null;
}

function priorExtreme(bars, n, field) {
  const prior = tail(bars, n, 1);
  if (!prior) return null;
  const xs = prior.map((x) => x[field]);
  if (xs.some((x) => !Number.isFinite(x))) return null;
  return field === "low" ? Math.min(...xs) : Math.max(...xs);
}

function periodReturn(bars, sessions) {
  if (bars.length < sessions + 1) return null;
  const current = bars.at(-1)?.close;
  const prior = bars.at(-(sessions + 1))?.close;
  return Number.isFinite(current) && Number.isFinite(prior) && prior > 0
    ? current / prior - 1
    : null;
}

function dailyReturns(bars, n) {
  if (bars.length < n + 1) return null;
  const xs = bars.slice(-(n + 1));
  const out = [];
  for (let i = 1; i < xs.length; i += 1) {
    if (!Number.isFinite(xs[i].close) || !Number.isFinite(xs[i - 1].close) || xs[i - 1].close <= 0) {
      return null;
    }
    out.push(xs[i].close / xs[i - 1].close - 1);
  }
  return out;
}

function atr(bars, n) {
  if (bars.length < n + 1) return null;
  const xs = bars.slice(-(n + 1));
  const trs = [];
  for (let i = 1; i < xs.length; i += 1) {
    const row = xs[i];
    const prevClose = xs[i - 1].close;
    if (![row.high, row.low, prevClose].every(Number.isFinite)) return null;
    trs.push(Math.max(
      row.high - row.low,
      Math.abs(row.high - prevClose),
      Math.abs(row.low - prevClose),
    ));
  }
  return mean(trs);
}

function safeRatio(a, b) {
  return Number.isFinite(a) && Number.isFinite(b) && b !== 0 ? a / b : null;
}

function coreMetrics(bars) {
  const current = bars.at(-1) || null;
  const previous = bars.at(-2) || null;
  const ma5 = movingAverage(bars, 5);
  const ma10 = movingAverage(bars, 10);
  const ma20 = movingAverage(bars, 20);
  const ma60 = movingAverage(bars, 60);
  const prevMa5 = movingAverage(bars, 5, 1);
  const prevMa10 = movingAverage(bars, 10, 1);
  const prevMa20 = movingAverage(bars, 20, 1);
  const avgVolume5PriorShares = averageVolumeShares(bars, 5, 1);
  const avgVolume20PriorShares = averageVolumeShares(bars, 20, 1);
  const avgVolume60PriorShares = averageVolumeShares(bars, 60, 1);
  const avgAmount20Prior = averageTradeValue(bars, 20, 1);
  const priorHigh20 = priorExtreme(bars, 20, "high");
  const priorHigh60 = priorExtreme(bars, 60, "high");
  const priorLow20 = priorExtreme(bars, 20, "low");
  const atr14 = atr(bars, 14);
  const returns20 = dailyReturns(bars, 20);
  const range = current && Number.isFinite(current.high) && Number.isFinite(current.low)
    ? current.high - current.low
    : null;

  return {
    historyDays: bars.length,
    currentDate: current?.date || null,
    open: current?.open ?? null,
    high: current?.high ?? null,
    low: current?.low ?? null,
    close: current?.close ?? null,
    volumeShares: current?.volumeShares ?? null,
    volumeLots: Number.isFinite(current?.volumeShares) ? current.volumeShares / 1000 : null,
    tradeValue: current?.tradeValue ?? null,
    ma5,
    ma10,
    ma20,
    ma60,
    prevMa5,
    prevMa10,
    prevMa20,
    ma5Slope1Pct: Number.isFinite(ma5) && Number.isFinite(prevMa5) && prevMa5 > 0 ? ma5 / prevMa5 - 1 : null,
    ma10Slope1Pct: Number.isFinite(ma10) && Number.isFinite(prevMa10) && prevMa10 > 0 ? ma10 / prevMa10 - 1 : null,
    ma20Slope1Pct: Number.isFinite(ma20) && Number.isFinite(prevMa20) && prevMa20 > 0 ? ma20 / prevMa20 - 1 : null,
    ret20: periodReturn(bars, 20),
    ret60: periodReturn(bars, 60),
    volatility20: returns20 ? populationStd(returns20) : null,
    priorHigh20,
    priorHigh60,
    priorLow20,
    distanceToPriorHigh20: Number.isFinite(current?.close) && Number.isFinite(priorHigh20) && priorHigh20 > 0
      ? current.close / priorHigh20 - 1
      : null,
    distanceToMa20: Number.isFinite(current?.close) && Number.isFinite(ma20) && ma20 > 0
      ? current.close / ma20 - 1
      : null,
    gapPct: Number.isFinite(current?.open) && Number.isFinite(previous?.close) && previous.close > 0
      ? current.open / previous.close - 1
      : null,
    closePosition: Number.isFinite(range) && range > 0 && Number.isFinite(current?.close)
      ? (current.close - current.low) / range
      : null,
    upperShadowRatio: Number.isFinite(range) && range > 0 && Number.isFinite(current?.open) && Number.isFinite(current?.close)
      ? (current.high - Math.max(current.open, current.close)) / range
      : null,
    lowerShadowRatio: Number.isFinite(range) && range > 0 && Number.isFinite(current?.open) && Number.isFinite(current?.close)
      ? (Math.min(current.open, current.close) - current.low) / range
      : null,
    atr14,
    atr14Pct: Number.isFinite(atr14) && Number.isFinite(current?.close) && current.close > 0
      ? atr14 / current.close
      : null,
    avgVolume5PriorLots: Number.isFinite(avgVolume5PriorShares) ? avgVolume5PriorShares / 1000 : null,
    avgVolume20PriorLots: Number.isFinite(avgVolume20PriorShares) ? avgVolume20PriorShares / 1000 : null,
    avgVolume60PriorLots: Number.isFinite(avgVolume60PriorShares) ? avgVolume60PriorShares / 1000 : null,
    avgAmount20Prior,
    relativeVolume20Prior: safeRatio(current?.volumeShares, avgVolume20PriorShares),
    volumeContraction5to20Prior: safeRatio(avgVolume5PriorShares, avgVolume20PriorShares),
    maOrder5gt10gt20:
      [ma5, ma10, ma20].every(Number.isFinite) ? ma5 > ma10 && ma10 > ma20 : null,
  };
}

function factorState(metricValues, pitEligible, continuityEligible, needsContinuity = true) {
  if (!pitEligible) return { state: "UNKNOWN", reason: "SOURCE_NOT_AVAILABLE_BY_DECISION_TIMESTAMP" };
  if (needsContinuity && !continuityEligible) return { state: "UNKNOWN", reason: "PRICE_CONTINUITY_NOT_VERIFIED" };
  if (metricValues.some((x) => x === null || x === undefined)) return { state: "UNKNOWN", reason: "INSUFFICIENT_HISTORY_OR_SOURCE_FIELDS" };
  return { state: "KNOWN", reason: null };
}

function observation({
  factorId,
  symbol,
  marketDate,
  decisionTimestamp,
  rawValue,
  state,
  unknownReason,
  provenance,
  qualityFlags,
}) {
  return buildFactorObservation({
    factorId,
    factorVersion: A1_HISTORY_PRIMITIVE_VERSION,
    scope: "SYMBOL",
    scopeKey: symbol,
    marketDate,
    decisionTimestamp,
    state,
    rawValue: state === "KNOWN" ? rawValue : null,
    normalizedValue: null,
    confidence: state === "KNOWN" ? 1 : null,
    provenance,
    normalization: {
      method: "NONE",
      normalizationVersion: A1_HISTORY_PRIMITIVE_VERSION,
      referenceWindow: "RAW_DESCRIPTIVE_PRIMITIVE",
    },
    unknownReason,
    qualityFlags,
  });
}

export async function buildA1HistoryPrimitiveBundle({
  bundleId,
  symbol,
  marketDate,
  decisionTimestamp,
  observedAt,
  bars,
  sourceId,
  sourceName,
  sourceUrl = null,
  priceSpace,
  volumeUnit = "SHARES",
  continuityState = "UNVERIFIED",
} = {}) {
  const id = requiredText(bundleId, "bundleId");
  const code = requiredText(symbol, "symbol");
  const date = requiredText(marketDate, "marketDate");
  const clock = assertTimestamp(decisionTimestamp, "decisionTimestamp");
  const seenAt = assertTimestamp(observedAt, "observedAt");
  const srcId = requiredText(sourceId, "sourceId");
  const srcName = requiredText(sourceName, "sourceName");
  const space = requiredText(priceSpace, "priceSpace");
  if (!PRICE_SPACES.has(space)) throw new Error("unsupported priceSpace");
  if (!["SHARES", "LOTS"].includes(volumeUnit)) throw new Error("unsupported volumeUnit");
  const continuity = requiredText(continuityState, "continuityState");
  if (!CONTINUITY_STATES.has(continuity)) throw new Error("unsupported continuityState");
  if (!Array.isArray(bars)) throw new Error("bars must be an array");

  const normalized = bars.map((bar) => normalizeBar(bar, volumeUnit));
  if (normalized.some((bar) => !bar.date)) throw new Error("every history bar must have a market date");
  if (normalized.some((bar) => bar.date > date)) throw new Error("history contains future bar relative to marketDate");
  normalized.sort((a, b) => a.date.localeCompare(b.date));
  const dates = normalized.map((x) => x.date);
  if (new Set(dates).size !== dates.length) throw new Error("history contains duplicate market dates");
  if (normalized.some((bar) => !bar.ohlcConsistent)) throw new Error("history contains inconsistent OHLC");

  const pitEligible = Date.parse(seenAt) <= Date.parse(clock);
  const continuityEligible = continuity === "CLEAR_NO_ACTION" || continuity === "ADJUSTED_CONTINUITY";
  const metrics = coreMetrics(normalized);
  const sourcePayloadHash = await sha256Hex(normalized);

  const provenance = {
    sourceId: srcId,
    sourceName: srcName,
    sourceUrl: sourceUrl || undefined,
    sourceDate: date,
    observedAt: seenAt,
    availableAt: seenAt,
    capturedAt: seenAt,
    pointInTimeEligible: pitEligible,
    payloadHash: sourcePayloadHash,
  };

  const qualityFlags = [];
  if (!continuityEligible) qualityFlags.push(`CONTINUITY_${continuity}`);
  if (metrics.historyDays < 61) qualityFlags.push("HISTORY_LT_61");
  if (!normalized.at(-1)?.completeOhlc) qualityFlags.push("CURRENT_OHLC_INCOMPLETE");
  if (!Number.isFinite(normalized.at(-1)?.volumeShares)) qualityFlags.push("CURRENT_VOLUME_MISSING");

  const specs = [
    {
      factorId: "TECH.TREND",
      value: {
        ma5: metrics.ma5,
        ma10: metrics.ma10,
        ma20: metrics.ma20,
        ma60: metrics.ma60,
        ma5Slope1Pct: metrics.ma5Slope1Pct,
        ma10Slope1Pct: metrics.ma10Slope1Pct,
        ma20Slope1Pct: metrics.ma20Slope1Pct,
        ret20: metrics.ret20,
        ret60: metrics.ret60,
        maOrder5gt10gt20: metrics.maOrder5gt10gt20,
      },
      required: [metrics.ma5, metrics.ma10, metrics.ma20, metrics.ma60, metrics.ret20, metrics.ret60],
      continuity: true,
    },
    {
      factorId: "TECH.STRUCTURE",
      value: {
        priorHigh20: metrics.priorHigh20,
        priorHigh60: metrics.priorHigh60,
        priorLow20: metrics.priorLow20,
        distanceToPriorHigh20: metrics.distanceToPriorHigh20,
        distanceToMa20: metrics.distanceToMa20,
        gapPct: metrics.gapPct,
        closePosition: metrics.closePosition,
        atr14Pct: metrics.atr14Pct,
      },
      required: [metrics.priorHigh20, metrics.priorHigh60, metrics.priorLow20, metrics.distanceToMa20, metrics.atr14Pct],
      continuity: true,
    },
    {
      factorId: "PV.RELATIVE_VOLUME",
      value: {
        volumeLots: metrics.volumeLots,
        avgVolume5PriorLots: metrics.avgVolume5PriorLots,
        avgVolume20PriorLots: metrics.avgVolume20PriorLots,
        avgVolume60PriorLots: metrics.avgVolume60PriorLots,
        relativeVolume20Prior: metrics.relativeVolume20Prior,
        volumeContraction5to20Prior: metrics.volumeContraction5to20Prior,
      },
      required: [metrics.volumeLots, metrics.avgVolume20PriorLots, metrics.relativeVolume20Prior],
      continuity: false,
    },
    {
      factorId: "PV.ACCEPTANCE",
      value: {
        closePosition: metrics.closePosition,
        upperShadowRatio: metrics.upperShadowRatio,
        lowerShadowRatio: metrics.lowerShadowRatio,
        distanceToPriorHigh20: metrics.distanceToPriorHigh20,
      },
      required: [metrics.closePosition, metrics.upperShadowRatio, metrics.lowerShadowRatio, metrics.distanceToPriorHigh20],
      continuity: true,
    },
    {
      factorId: "PV.RESPONSE",
      value: {
        ret20: metrics.ret20,
        ret60: metrics.ret60,
        gapPct: metrics.gapPct,
        volatility20: metrics.volatility20,
      },
      required: [metrics.ret20, metrics.ret60, metrics.volatility20],
      continuity: true,
    },
    {
      factorId: "RISK.LIQUIDITY",
      value: {
        avgVolume20PriorLots: metrics.avgVolume20PriorLots,
        avgAmount20Prior: metrics.avgAmount20Prior,
        currentTradeValue: metrics.tradeValue,
      },
      required: [metrics.avgVolume20PriorLots, metrics.avgAmount20Prior],
      continuity: false,
    },
    {
      factorId: "RISK.EXTENSION",
      value: {
        distanceToMa20: metrics.distanceToMa20,
        distanceToPriorHigh20: metrics.distanceToPriorHigh20,
        atr14Pct: metrics.atr14Pct,
      },
      required: [metrics.distanceToMa20, metrics.distanceToPriorHigh20, metrics.atr14Pct],
      continuity: true,
    },
  ];

  const factorObservations = specs.map((spec) => {
    const s = factorState(spec.required, pitEligible, continuityEligible, spec.continuity);
    return observation({
      factorId: spec.factorId,
      symbol: code,
      marketDate: date,
      decisionTimestamp: clock,
      rawValue: spec.value,
      state: s.state,
      unknownReason: s.reason,
      provenance,
      qualityFlags,
    });
  });

  const base = {
    bundleId: id,
    symbol: code,
    marketDate: date,
    decisionTimestamp: clock,
    observedAt: seenAt,
    sourceId: srcId,
    sourceName: srcName,
    sourceUrl,
    priceSpace: space,
    volumeUnit,
    continuityState: continuity,
    continuityEligible,
    pointInTimeEligible: pitEligible,
    sourcePayloadHash,
    barCount: normalized.length,
    firstBarDate: normalized[0]?.date || null,
    lastBarDate: normalized.at(-1)?.date || null,
    bars: Object.freeze(normalized),
    coreMetrics: deepFreeze(metrics),
    factorObservations: Object.freeze(factorObservations),
    qualityFlags: Object.freeze(qualityFlags),
    strategyScoreAssigned: false,
    strategyThresholdApplied: false,
    schemaVersion: "S2_A1_HISTORY_PRIMITIVE_BUNDLE_V0_1",
  };
  const bundleHash = await sha256Hex(base);
  return deepFreeze({ ...base, bundleHash });
}

export { CONTINUITY_STATES, PRICE_SPACES };
