// System2 research-only chart payload for the daily EMA16/64 + Impulse MACD resonance monitor.
// Produces UI-ready data only. No HTML, no network, no persistence, no push, no trading action.

export const DAILY_RESONANCE_CHART_VERSION = "0.1-RESEARCH";

function requiredObject(value, field) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(field + " must be an object");
  }
  return value;
}

function boundedInteger(value, fallback, min, max, field) {
  const n = value === undefined || value === null ? fallback : Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new Error(field + " must be an integer between " + min + " and " + max);
  }
  return n;
}

function markerFor(row, previous, isLatest, snapshot) {
  if (!row?.ready) return [];
  const out = [];
  const prevEntry = previous?.entryCount ?? 0;
  const prevExit = previous?.exitCount ?? 0;
  if (row.entryCount === 3 && prevEntry < 3) {
    out.push(Object.freeze({
      date: row.date,
      type: "BUY_RESONANCE",
      side: "ENTRY",
      value: row.close,
      conditionCount: 3,
      confirmationState: isLatest
        ? snapshot.signalConfirmationState
        : "CONFIRMED",
    }));
  }
  if (row.exitCount === 3 && prevExit < 3) {
    out.push(Object.freeze({
      date: row.date,
      type: "EXIT_RESONANCE",
      side: "EXIT",
      value: row.close,
      conditionCount: 3,
      confirmationState: isLatest
        ? snapshot.signalConfirmationState
        : "CONFIRMED",
    }));
  }
  return out;
}

export function buildDailyResonanceChartModel(snapshot, { maxBars = 120 } = {}) {
  const s = requiredObject(snapshot, "snapshot");
  if (s.schemaVersion !== "SYSTEM2_DAILY_RESONANCE_SNAPSHOT_V0_1") {
    throw new Error("unsupported snapshot schemaVersion");
  }
  if (!Array.isArray(s.bars) || !Array.isArray(s.series)) {
    throw new Error("snapshot bars/series are required");
  }
  if (s.bars.length !== s.series.length) {
    throw new Error("snapshot bars/series length mismatch");
  }
  const limit = boundedInteger(maxBars, 120, 20, 500, "maxBars");
  const start = Math.max(0, s.series.length - limit);
  const bars = s.bars.slice(start);
  const series = s.series.slice(start);

  const candles = bars.map((bar) => Object.freeze({
    date: bar.date,
    open: bar.open,
    high: bar.high,
    low: bar.low,
    close: bar.close,
    volume: bar.volume ?? null,
    finality: bar.date === s.marketDate ? s.finality : "CONFIRMED_DAILY_CLOSE",
  }));

  const ema16 = series.map((row) => Object.freeze({ date: row.date, value: row.ema16 }));
  const ema64 = series.map((row) => Object.freeze({ date: row.date, value: row.ema64 }));
  const impulseMacd = series.map((row) => Object.freeze({
    date: row.date,
    md: row.impulseMacd?.md ?? null,
    signal: row.impulseMacd?.signal ?? null,
    histogram: row.impulseMacd?.histogram ?? null,
    direction: row.impulseMacd?.direction ?? "WARMUP",
  }));
  const resonance = series.map((row) => Object.freeze({
    date: row.date,
    entryCount: row.entryCount,
    exitCount: row.exitCount,
    entryReady: row.entryCount === 3,
    exitReady: row.exitCount === 3,
  }));

  const markers = [];
  for (let localIndex = 0; localIndex < series.length; localIndex += 1) {
    const absoluteIndex = start + localIndex;
    const row = s.series[absoluteIndex];
    const previous = absoluteIndex > 0 ? s.series[absoluteIndex - 1] : null;
    const isLatest = absoluteIndex === s.series.length - 1;
    markers.push(...markerFor(row, previous, isLatest, s));
  }

  return Object.freeze({
    schemaVersion: "SYSTEM2_DAILY_RESONANCE_CHART_MODEL_V0_1",
    chartVersion: DAILY_RESONANCE_CHART_VERSION,
    symbol: s.symbol,
    marketDate: s.marketDate,
    timeframe: "1D",
    asOf: s.asOf,
    finality: s.finality,
    title: s.symbol + "｜日K EMA16/EMA64 + Impulse MACD 共振",
    candles: Object.freeze(candles),
    ema16: Object.freeze(ema16),
    ema64: Object.freeze(ema64),
    impulseMacd: Object.freeze(impulseMacd),
    resonance: Object.freeze(resonance),
    markers: Object.freeze(markers),
    currentState: Object.freeze({
      lifecycleState: s.lifecycleState,
      displaySignal: s.displaySignal,
      signalConfirmationState: s.signalConfirmationState,
      warningLevel: s.warningLevel,
      entryCount: s.latest?.entryCount ?? 0,
      exitCount: s.latest?.exitCount ?? 0,
      officialCloseConfirmation: s.officialCloseConfirmation,
    }),
    intraday15mContext: s.intraday15mContext,
    intraday15mRole: "EXECUTION_AUXILIARY_ONLY",
    intraday15mAffectsDailyResonance: false,
    fullMarketScan: false,
    decisionImpact: false,
    notificationImpact: false,
    orderImpact: false,
  });
}
