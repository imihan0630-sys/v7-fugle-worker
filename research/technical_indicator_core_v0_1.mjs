// Class-A isolated technical-indicator research core.
// No Worker import, no market calls, no persistence, no Formal decision impact.

export const TECHNICAL_INDICATOR_FORMULA_VERSION = Object.freeze({
  kd: "TAI_KD_RSV9_K3_D3_INIT50_V0_1",
  rsi: "WILDER_RSI14_SMA_SEED_V0_1",
  macd: "EMA12_26_SIGNAL9_FIRST_CLOSE_SEED_V0_1",
  contract: "TECHNICAL_INDICATOR_RESEARCH_CORE_V0_1",
});

const finite = value => Number.isFinite(Number(value));

export function validateIndicatorBars(rows, { strictSemantics = false } = {}) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { valid: false, reason: "NO_BARS" };
  }
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i] || {};
    if (!finite(row.close) || !finite(row.high) || !finite(row.low)) {
      return { valid: false, reason: "INVALID_OHLC", index: i };
    }
    if (Number(row.high) < Number(row.low)) {
      return { valid: false, reason: "HIGH_BELOW_LOW", index: i };
    }
    if (strictSemantics) {
      if (row.symbolSessionVerified !== true) {
        return { valid: false, reason: "SYMBOL_SESSION_UNVERIFIED", index: i };
      }
      if (row.technicalContinuity !== true) {
        return { valid: false, reason: "TECHNICAL_CONTINUITY_UNVERIFIED", index: i };
      }
      if (row.suspensionPseudoBar === true || row.noTradePseudoBar === true) {
        return { valid: false, reason: "PSEUDO_BAR_NOT_ELIGIBLE", index: i };
      }
      if (row.corporateActionContinuityResolved !== true) {
        return { valid: false, reason: "CORPORATE_ACTION_CONTINUITY_UNRESOLVED", index: i };
      }
    }
  }
  return { valid: true, reason: null };
}

export function computeKD(rows, { period = 9, initialK = 50, initialD = 50 } = {}) {
  const validation = validateIndicatorBars(rows);
  if (!validation.valid) return { ...validation, values: [] };
  const values = [];
  let k = initialK;
  let d = initialD;
  for (let i = 0; i < rows.length; i += 1) {
    if (i < period - 1) {
      values.push({ rsv: null, k: null, d: null, ready: false });
      continue;
    }
    let highest = -Infinity;
    let lowest = Infinity;
    for (let j = i - period + 1; j <= i; j += 1) {
      highest = Math.max(highest, Number(rows[j].high));
      lowest = Math.min(lowest, Number(rows[j].low));
    }
    const denominator = highest - lowest;
    const rsv = denominator === 0 ? 50 : 100 * (Number(rows[i].close) - lowest) / denominator;
    k = (2 / 3) * k + (1 / 3) * rsv;
    d = (2 / 3) * d + (1 / 3) * k;
    values.push({ rsv, k, d, ready: true });
  }
  return { valid: true, reason: null, values };
}

export function computeRSI(rows, { period = 14 } = {}) {
  const validation = validateIndicatorBars(rows);
  if (!validation.valid) return { ...validation, values: [] };
  const closes = rows.map(row => Number(row.close));
  const values = Array(rows.length).fill(null).map(() => ({ rsi: null, ready: false }));
  if (rows.length <= period) return { valid: true, reason: null, values };

  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i <= period; i += 1) {
    const delta = closes[i] - closes[i - 1];
    avgGain += Math.max(delta, 0);
    avgLoss += Math.max(-delta, 0);
  }
  avgGain /= period;
  avgLoss /= period;

  const toRSI = () => {
    if (avgGain === 0 && avgLoss === 0) return 50;
    if (avgLoss === 0) return 100;
    if (avgGain === 0) return 0;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  };

  values[period] = { rsi: toRSI(), ready: true };
  for (let i = period + 1; i < closes.length; i += 1) {
    const delta = closes[i] - closes[i - 1];
    const gain = Math.max(delta, 0);
    const loss = Math.max(-delta, 0);
    avgGain = ((period - 1) * avgGain + gain) / period;
    avgLoss = ((period - 1) * avgLoss + loss) / period;
    values[i] = { rsi: toRSI(), ready: true };
  }
  return { valid: true, reason: null, values };
}

function ema(values, period) {
  const alpha = 2 / (period + 1);
  const out = [];
  let previous = null;
  for (const value of values) {
    previous = previous === null ? Number(value) : alpha * Number(value) + (1 - alpha) * previous;
    out.push(previous);
  }
  return out;
}

export function computeMACD(rows, { fast = 12, slow = 26, signal = 9 } = {}) {
  const validation = validateIndicatorBars(rows);
  if (!validation.valid) return { ...validation, values: [] };
  const closes = rows.map(row => Number(row.close));
  const fastEMA = ema(closes, fast);
  const slowEMA = ema(closes, slow);
  const dif = closes.map((_, i) => fastEMA[i] - slowEMA[i]);
  const signalEMA = ema(dif, signal);
  const warmupBars = slow + signal - 1;
  const values = closes.map((_, i) => ({
    dif: dif[i],
    signal: signalEMA[i],
    histogram: dif[i] - signalEMA[i],
    ready: i + 1 >= warmupBars,
  }));
  return { valid: true, reason: null, warmupBars, values };
}

export function buildIndicatorSnapshot(rows, context = {}) {
  const strict = context.strictSemantics === true;
  const validation = validateIndicatorBars(rows, { strictSemantics: strict });
  const base = {
    schemaVersion: "TECHNICAL_INDICATOR_SNAPSHOT_V0_1",
    decisionImpact: false,
    formulaVersion: TECHNICAL_INDICATOR_FORMULA_VERSION,
    dataQualityState: validation.valid ? "VALID" : "BLOCKED",
    blockedReason: validation.valid ? null : validation.reason,
    priceLimitConstrained: context.priceLimitConstrained === true,
    interpretationState: context.priceLimitConstrained === true ? "UNRESOLVED" : (validation.valid ? "OBSERVABLE" : "BLOCKED"),
    source: context.source ?? null,
    continuitySpace: context.continuitySpace ?? null,
  };
  if (!validation.valid) return { ...base, kd: null, rsi: null, macd: null };

  const kd = computeKD(rows);
  const rsi = computeRSI(rows);
  const macd = computeMACD(rows);
  return {
    ...base,
    kd: kd.values.at(-1) ?? null,
    rsi: rsi.values.at(-1) ?? null,
    macd: macd.values.at(-1) ?? null,
  };
}
