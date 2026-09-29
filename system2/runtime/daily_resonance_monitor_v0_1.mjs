// System2 research-only daily resonance monitor.
// Pure computation only: no market fetch, no persistence, no push, no orders, no System1/V8 dependency.

export const DAILY_RESONANCE_MONITOR_VERSION = "0.1-RESEARCH";
export const DAILY_RESONANCE_FORMULA_VERSION = Object.freeze({
  ema: "EMA_FIRST_VALUE_SEED_ALPHA_2_OVER_N_PLUS_1_V0_1",
  fastEma: 16,
  slowEma: 64,
  impulseMacd: "LAZYBEAR_STYLE_IMPULSE_SMM34_ZLEMA34_SIGNAL_SMA9_INTERNAL_V0_1",
  impulseLength: 34,
  impulseSignalLength: 9,
  impulseSource: "HLC3",
  contract: "SYSTEM2_DAILY_RESONANCE_MONITOR_V0_1",
  officialCloseConfirmation: "13:30_ASIA_TAIPEI",
});

export const DAILY_RESONANCE_MAX_UNIQUE_SYMBOLS = 9;

const ALLOWED_CONTINUITY = new Set(["CLEAR_NO_ACTION", "ADJUSTED_CONTINUITY"]);
const ALLOWED_LIFECYCLE = new Set(["WATCH", "FLAT", "HOLD"]);
const ALLOWED_BAR_STATE = new Set(["LIVE", "FINAL"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function finite(value, field) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(field + " must be finite");
  return n;
}

function optionalFinite(value, field) {
  if (value === null || value === undefined || value === "") return null;
  return finite(value, field);
}

function normalizeDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function normalizeBar(raw, index, expectedDate = null) {
  if (!raw || typeof raw !== "object") throw new Error("bar[" + index + "] must be an object");
  const date = normalizeDate(raw.date || raw.marketDate, "bar[" + index + "].date");
  if (expectedDate && date !== expectedDate) throw new Error("currentDailyBar date must equal marketDate");
  const open = finite(raw.open, "bar[" + index + "].open");
  const high = finite(raw.high, "bar[" + index + "].high");
  const low = finite(raw.low, "bar[" + index + "].low");
  const close = finite(raw.close, "bar[" + index + "].close");
  if (open <= 0 || high <= 0 || low <= 0 || close <= 0) throw new Error("OHLC must be positive");
  if (high < low || high < open || high < close || low > open || low > close) {
    throw new Error("bar[" + index + "] has inconsistent OHLC");
  }
  const volume = optionalFinite(raw.volumeShares ?? raw.volume, "bar[" + index + "].volume");
  if (volume !== null && volume < 0) throw new Error("volume cannot be negative");
  return Object.freeze({ date, open, high, low, close, volume });
}

function normalizeBars(historyBars, currentDailyBar, marketDate) {
  if (!Array.isArray(historyBars)) throw new Error("historyBars must be an array");
  const historical = historyBars.map((row, index) => normalizeBar(row, index));
  historical.sort((a, b) => a.date.localeCompare(b.date));
  const dates = historical.map((x) => x.date);
  if (new Set(dates).size !== dates.length) throw new Error("historyBars contains duplicate dates");
  if (historical.some((row) => row.date >= marketDate)) {
    throw new Error("historyBars must contain only dates before marketDate");
  }

  const out = [...historical];
  if (currentDailyBar) {
    out.push(normalizeBar(currentDailyBar, historical.length, marketDate));
  }
  return Object.freeze(out);
}

function emaSeries(values, period) {
  if (!Number.isInteger(period) || period < 2) throw new Error("EMA period must be >= 2");
  const alpha = 2 / (period + 1);
  const out = [];
  let previous = null;
  for (const value of values) {
    const x = finite(value, "EMA input");
    previous = previous === null ? x : alpha * x + (1 - alpha) * previous;
    out.push(previous);
  }
  return out;
}

function smmaSeries(values, period) {
  if (!Number.isInteger(period) || period < 2) throw new Error("SMMA period must be >= 2");
  const out = Array(values.length).fill(null);
  if (values.length < period) return out;
  let previous = 0;
  for (let i = 0; i < period; i += 1) previous += finite(values[i], "SMMA input");
  previous /= period;
  out[period - 1] = previous;
  for (let i = period; i < values.length; i += 1) {
    previous = ((period - 1) * previous + finite(values[i], "SMMA input")) / period;
    out[i] = previous;
  }
  return out;
}

function smaReadySeries(values, period) {
  const out = Array(values.length).fill(null);
  for (let i = period - 1; i < values.length; i += 1) {
    const window = values.slice(i - period + 1, i + 1);
    if (window.some((x) => !Number.isFinite(x))) continue;
    out[i] = window.reduce((a, b) => a + b, 0) / period;
  }
  return out;
}

function zlemaSeries(values, period) {
  const ema1 = emaSeries(values, period);
  const ema2 = emaSeries(ema1, period);
  return ema1.map((value, index) => value + (value - ema2[index]));
}

function crossState(previousFast, previousSlow, currentFast, currentSlow) {
  if (![previousFast, previousSlow, currentFast, currentSlow].every(Number.isFinite)) return "UNKNOWN";
  if (previousFast <= previousSlow && currentFast > currentSlow) return "GOLDEN_CROSS";
  if (previousFast >= previousSlow && currentFast < currentSlow) return "DEATH_CROSS";
  return "NONE";
}

export function computeImpulseMacdSeries(
  bars,
  { length = 34, signalLength = 9, epsilon = 1e-12 } = {},
) {
  if (!Array.isArray(bars)) throw new Error("bars must be an array");
  if (!Number.isInteger(length) || length < 2) throw new Error("Impulse length must be >= 2");
  if (!Number.isInteger(signalLength) || signalLength < 2) throw new Error("Impulse signalLength must be >= 2");

  const highs = bars.map((x) => finite(x.high, "bar.high"));
  const lows = bars.map((x) => finite(x.low, "bar.low"));
  const source = bars.map((x) => (finite(x.high, "bar.high") + finite(x.low, "bar.low") + finite(x.close, "bar.close")) / 3);
  const highEnvelope = smmaSeries(highs, length);
  const lowEnvelope = smmaSeries(lows, length);
  const zlema = zlemaSeries(source, length);

  const md = bars.map((_, index) => {
    const hi = highEnvelope[index];
    const lo = lowEnvelope[index];
    const mi = zlema[index];
    if (!Number.isFinite(hi) || !Number.isFinite(lo) || !Number.isFinite(mi)) return null;
    if (mi > hi) return mi - hi;
    if (mi < lo) return mi - lo;
    return 0;
  });

  const signal = smaReadySeries(md, signalLength);
  const histogram = md.map((value, index) => (
    Number.isFinite(value) && Number.isFinite(signal[index]) ? value - signal[index] : null
  ));

  return bars.map((bar, index) => {
    const previousMd = index > 0 ? md[index - 1] : null;
    const previousSignal = index > 0 ? signal[index - 1] : null;
    const currentMd = md[index];
    const currentSignal = signal[index];
    const currentHistogram = histogram[index];
    const ready = Number.isFinite(currentMd) && Number.isFinite(currentSignal);
    let direction = "WARMUP";
    if (ready) {
      if (currentMd > currentSignal + epsilon) direction = "BULLISH";
      else if (currentMd < currentSignal - epsilon) direction = "BEARISH";
      else direction = "NEUTRAL";
    }
    return Object.freeze({
      date: bar.date,
      source: source[index],
      highEnvelope: highEnvelope[index],
      lowEnvelope: lowEnvelope[index],
      zlema: zlema[index],
      md: currentMd,
      signal: currentSignal,
      histogram: currentHistogram,
      direction,
      crossState: ready && Number.isFinite(previousMd) && Number.isFinite(previousSignal)
        ? crossState(previousMd, previousSignal, currentMd, currentSignal)
        : "UNKNOWN",
      ready,
    });
  });
}

export function computeDailyResonanceSeries(bars, options = {}) {
  if (!Array.isArray(bars)) throw new Error("bars must be an array");
  const fastPeriod = options.fastPeriod ?? 16;
  const slowPeriod = options.slowPeriod ?? 64;
  if (fastPeriod !== 16 || slowPeriod !== 64) {
    throw new Error("V0.1 contract is frozen to EMA16/EMA64; parameter challengers require a new version");
  }
  const closes = bars.map((x) => finite(x.close, "bar.close"));
  const ema16 = emaSeries(closes, fastPeriod);
  const ema64 = emaSeries(closes, slowPeriod);
  const impulse = computeImpulseMacdSeries(bars, {
    length: options.impulseLength ?? 34,
    signalLength: options.impulseSignalLength ?? 9,
  });

  return bars.map((bar, index) => {
    const previous = index > 0 ? {
      close: closes[index - 1],
      ema16: ema16[index - 1],
      ema64: ema64[index - 1],
    } : null;
    const ema16Slope = index > 0 ? ema16[index] - ema16[index - 1] : null;
    const ema16SlopePct = index > 0 && ema16[index - 1] !== 0 ? ema16[index] / ema16[index - 1] - 1 : null;
    const priceVsEma16Cross = previous
      ? crossState(previous.close, previous.ema16, closes[index], ema16[index])
      : "UNKNOWN";
    const emaCross = previous
      ? crossState(previous.ema16, previous.ema64, ema16[index], ema64[index])
      : "UNKNOWN";

    const ready = index + 1 >= slowPeriod && impulse[index]?.ready === true;
    const entryConditions = Object.freeze({
      priceAboveEma16AndRising: ready ? closes[index] > ema16[index] && ema16Slope > 0 : false,
      ema16AboveEma64: ready ? ema16[index] > ema64[index] : false,
      impulseMacdBullish: ready ? impulse[index].direction === "BULLISH" : false,
    });
    const exitConditions = Object.freeze({
      priceBelowEma16AndFalling: ready ? closes[index] < ema16[index] && ema16Slope < 0 : false,
      ema16BelowEma64: ready ? ema16[index] < ema64[index] : false,
      impulseMacdBearish: ready ? impulse[index].direction === "BEARISH" : false,
    });
    const entryCount = Object.values(entryConditions).filter(Boolean).length;
    const exitCount = Object.values(exitConditions).filter(Boolean).length;

    return Object.freeze({
      date: bar.date,
      open: finite(bar.open, "bar.open"),
      high: finite(bar.high, "bar.high"),
      low: finite(bar.low, "bar.low"),
      close: closes[index],
      volume: optionalFinite(bar.volumeShares ?? bar.volume, "bar.volume"),
      ema16: ema16[index],
      ema64: ema64[index],
      ema16Slope,
      ema16SlopePct,
      priceVsEma16Cross,
      emaCross,
      impulseMacd: impulse[index],
      entryConditions,
      exitConditions,
      entryCount,
      exitCount,
      ready,
    });
  });
}

function resolveLifecycle({ priorLifecycleState, latest, finality }) {
  if (!latest?.ready) {
    return {
      state: "WARMUP",
      visualSignal: null,
      displaySignal: null,
      signalConfirmationState: "NONE",
      warningLevel: 0,
    };
  }
  if (latest.exitCount === 3) {
    const confirmed = finality === "CONFIRMED_DAILY_CLOSE";
    return {
      state: confirmed ? "EXIT_RESONANCE_CONFIRMED" : "EXIT_RESONANCE_PROVISIONAL",
      visualSignal: "EXIT",
      displaySignal: "EXIT_RESONANCE",
      signalConfirmationState: confirmed ? "CONFIRMED" : "PROVISIONAL",
      warningLevel: 3,
    };
  }
  if (latest.entryCount === 3) {
    const confirmed = finality === "CONFIRMED_DAILY_CLOSE";
    return {
      state: confirmed ? "ENTRY_RESONANCE_CONFIRMED" : "ENTRY_RESONANCE_PROVISIONAL",
      visualSignal: "ENTRY",
      displaySignal: "BUY_RESONANCE",
      signalConfirmationState: confirmed ? "CONFIRMED" : "PROVISIONAL",
      warningLevel: 3,
    };
  }
  if (priorLifecycleState === "HOLD") {
    if (latest.exitCount >= 1) {
      return {
        state: "EXIT_WARNING_" + latest.exitCount + "_OF_3",
        visualSignal: "WARNING",
        displaySignal: null,
        signalConfirmationState: "NONE",
        warningLevel: latest.exitCount,
      };
    }
    return {
      state: "HOLD",
      visualSignal: "HOLD",
      displaySignal: null,
      signalConfirmationState: "NONE",
      warningLevel: 0,
    };
  }
  if (latest.entryCount >= 1) {
    return {
      state: "ENTRY_FORMING_" + latest.entryCount + "_OF_3",
      visualSignal: "WATCH",
      displaySignal: null,
      signalConfirmationState: "NONE",
      warningLevel: latest.entryCount,
    };
  }
  return {
    state: "WATCH",
    visualSignal: null,
    displaySignal: null,
    signalConfirmationState: "NONE",
    warningLevel: 0,
  };
}

export function buildDailyResonanceSnapshot({
  symbol,
  marketDate,
  historyBars,
  currentDailyBar = null,
  currentDailyBarState = null,
  asOf,
  continuityState = "UNVERIFIED",
  priorLifecycleState = "WATCH",
  poolIds = [],
  strategyMemberships = [],
  intraday15mContext = null,
} = {}) {
  const code = requiredText(symbol, "symbol");
  const date = normalizeDate(marketDate, "marketDate");
  const observedAt = requiredText(asOf, "asOf");
  if (!Number.isFinite(Date.parse(observedAt))) throw new Error("asOf must be an ISO timestamp");
  const continuity = requiredText(continuityState, "continuityState");
  const lifecycle = requiredText(priorLifecycleState, "priorLifecycleState");
  if (!ALLOWED_LIFECYCLE.has(lifecycle)) throw new Error("unsupported priorLifecycleState");

  let barState = currentDailyBarState;
  const currentBarEligible = Boolean(currentDailyBar);
  if (currentDailyBar) {
    barState = requiredText(barState, "currentDailyBarState");
    if (!ALLOWED_BAR_STATE.has(barState)) throw new Error("unsupported currentDailyBarState");
  } else {
    barState = null;
  }

  const bars = normalizeBars(historyBars, currentDailyBar, date);
  const continuityEligible = ALLOWED_CONTINUITY.has(continuity);
  const series = continuityEligible ? computeDailyResonanceSeries(bars) : [];
  const latest = continuityEligible && currentBarEligible ? (series.at(-1) ?? null) : null;

  const finality = !currentBarEligible
    ? "CURRENT_DAILY_BAR_MISSING"
    : barState === "LIVE"
      ? "PROVISIONAL_DAILY_BAR"
      : "CONFIRMED_DAILY_CLOSE";

  const resolved = continuityEligible && currentBarEligible
    ? resolveLifecycle({ priorLifecycleState: lifecycle, latest, finality })
    : {
        state: "BLOCKED",
        visualSignal: null,
        displaySignal: null,
        signalConfirmationState: "NONE",
        warningLevel: 0,
      };

  const qualityWarnings = [];
  if (!currentBarEligible) qualityWarnings.push("CURRENT_DAILY_BAR_MISSING");
  if (!continuityEligible) qualityWarnings.push("PRICE_CONTINUITY_NOT_VERIFIED");
  if (bars.length < 64) qualityWarnings.push("INSUFFICIENT_HISTORY_LT_64");
  else if (bars.length < 128) qualityWarnings.push("EMA64_SEED_WARMUP_SENSITIVITY");
  if (finality === "PROVISIONAL_DAILY_BAR") qualityWarnings.push("CURRENT_DAILY_BAR_CAN_REPAINT_UNTIL_CLOSE");

  return Object.freeze({
    schemaVersion: "SYSTEM2_DAILY_RESONANCE_SNAPSHOT_V0_1",
    monitorVersion: DAILY_RESONANCE_MONITOR_VERSION,
    formulaVersion: DAILY_RESONANCE_FORMULA_VERSION,
    symbol: code,
    marketDate: date,
    asOf: observedAt,
    timeframe: "1D",
    finality,
    currentDailyBarState: barState,
    continuityState: continuity,
    continuityEligible,
    poolIds: Object.freeze([...new Set(Array.isArray(poolIds) ? poolIds.map(String) : [])]),
    strategyMemberships: Object.freeze([...new Set(Array.isArray(strategyMemberships) ? strategyMemberships.map(String) : [])]),
    priorLifecycleState: lifecycle,
    lifecycleState: resolved.state,
    visualSignal: resolved.visualSignal,
    displaySignal: resolved.displaySignal,
    signalConfirmationState: resolved.signalConfirmationState,
    officialCloseConfirmation: "13:30_ASIA_TAIPEI",
    warningLevel: resolved.warningLevel,
    latest,
    bars,
    series: Object.freeze(series),
    intraday15mContext: intraday15mContext ? Object.freeze({ ...intraday15mContext }) : null,
    intraday15mAffectsDailyResonance: false,
    sameFamilyIndependenceClaim: false,
    evidenceFamily: "PRICE_DERIVED_TREND_MOMENTUM_STATE",
    decisionImpact: false,
    notificationImpact: false,
    orderImpact: false,
    fullMarketScan: false,
    qualityWarnings: Object.freeze(qualityWarnings),
    notes: Object.freeze([
      "EMA16/EMA64 and Impulse MACD are calculated from daily bars only.",
      "LIVE daily-bar signals are PROVISIONAL and may disappear before the official 13:30 Asia/Taipei close.",
      "A 3-of-3 resonance becomes CONFIRMED only when the current market-date daily bar exists, is FINAL, and all 3 conditions still hold.",
      "The 3 conditions are correlated price-derived states, not 3 independent votes.",
      "15-minute context is auxiliary execution context and cannot alter this daily resonance state.",
      "This V0.1 output is a research/shadow candidate, not validated production trading authority.",
    ]),
  });
}

export function buildDailyResonanceMonitorBatch({
  marketDate,
  asOf,
  items,
  maxUniqueSymbols = DAILY_RESONANCE_MAX_UNIQUE_SYMBOLS,
} = {}) {
  const date = normalizeDate(marketDate, "marketDate");
  const observedAt = requiredText(asOf, "asOf");
  if (!Number.isFinite(Date.parse(observedAt))) throw new Error("asOf must be an ISO timestamp");
  if (!Array.isArray(items)) throw new Error("items must be an array");
  if (!Number.isInteger(maxUniqueSymbols) || maxUniqueSymbols < 1 || maxUniqueSymbols > DAILY_RESONANCE_MAX_UNIQUE_SYMBOLS) {
    throw new Error("maxUniqueSymbols must be between 1 and 9");
  }

  const symbols = items.map((item) => requiredText(item?.symbol, "item.symbol"));
  if (new Set(symbols).size !== symbols.length) {
    throw new Error("batch must contain each symbol once; preserve multi-strategy membership inside strategyMemberships");
  }
  if (symbols.length > maxUniqueSymbols) {
    throw new Error("bounded intraday monitor cannot exceed " + maxUniqueSymbols + " unique symbols");
  }

  const snapshots = items.map((item) => buildDailyResonanceSnapshot({
    ...item,
    marketDate: date,
    asOf: observedAt,
  }));

  return Object.freeze({
    schemaVersion: "SYSTEM2_DAILY_RESONANCE_MONITOR_BATCH_V0_1",
    monitorVersion: DAILY_RESONANCE_MONITOR_VERSION,
    marketDate: date,
    asOf: observedAt,
    mode: "BOUNDED_PRESELECTED_ONLY",
    fullMarketScan: false,
    maxUniqueSymbols,
    symbolCount: snapshots.length,
    symbols: Object.freeze(symbols),
    snapshots: Object.freeze(snapshots),
    decisionImpact: false,
    notificationImpact: false,
    orderImpact: false,
  });
}
