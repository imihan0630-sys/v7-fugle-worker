// Class-A isolated technical-indicator research core.
// No Worker import, no market calls, no persistence, no Formal decision impact.

export const TECHNICAL_INDICATOR_FORMULA_VERSION = Object.freeze({
  kd: "TAI_KD_RSV9_K3_D3_INIT50_V0_1",
  rsi: "WILDER_RSI14_SMA_SEED_V0_1",
  macd: "EMA12_26_SIGNAL9_FIRST_CLOSE_SEED_V0_1",
  adx: "WILDER_ADX14_TALIB_STYLE_NO_ROUNDING_V0_1",
  bbands: "BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1",
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


const TA_DIMENSIONLESS_ZERO_EPSILON = 1e-14;

function adxOneBar(rows, i) {
  const high = Number(rows[i].high);
  const low = Number(rows[i].low);
  const prevHigh = Number(rows[i - 1].high);
  const prevLow = Number(rows[i - 1].low);
  const prevClose = Number(rows[i - 1].close);
  const upMove = high - prevHigh;
  const downMove = prevLow - low;
  const plusDM = (upMove > 0 && upMove > downMove) ? upMove : 0;
  const minusDM = (downMove > 0 && downMove > upMove) ? downMove : 0;
  const tr = Math.max(
    high - low,
    Math.abs(high - prevClose),
    Math.abs(low - prevClose),
  );
  return { tr, plusDM, minusDM };
}

export function computeADX(rows, { period = 14 } = {}) {
  const validation = validateIndicatorBars(rows);
  if (!validation.valid) return { ...validation, values: [] };
  if (!Number.isInteger(period) || period < 2) {
    return { valid: false, reason: "INVALID_PERIOD", values: [] };
  }

  const values = Array.from({ length: rows.length }, () => ({
    tr: null,
    plusDM: null,
    minusDM: null,
    trSmoothed: null,
    plusDMSmoothed: null,
    minusDMSmoothed: null,
    plusDI: null,
    minusDI: null,
    diSpread: null,
    dx: null,
    adx: null,
    adxUpdated: false,
    ready: false,
  }));

  const oneBar = Array(rows.length).fill(null);
  for (let i = 1; i < rows.length; i += 1) {
    oneBar[i] = adxOneBar(rows, i);
    values[i].tr = oneBar[i].tr;
    values[i].plusDM = oneBar[i].plusDM;
    values[i].minusDM = oneBar[i].minusDM;
  }

  if (rows.length <= period) {
    return {
      valid: true,
      reason: null,
      period,
      firstOutputIndex: (2 * period) - 1,
      values,
    };
  }

  let prevTR = 0;
  let prevPlusDM = 0;
  let prevMinusDM = 0;

  // TA-Lib-style seed: accumulate period-1 one-bar transitions first.
  for (let i = 1; i < period && i < rows.length; i += 1) {
    prevTR += oneBar[i].tr;
    prevPlusDM += oneBar[i].plusDM;
    prevMinusDM += oneBar[i].minusDM;
  }

  const firstOutputIndex = (2 * period) - 1;
  let sumDX = 0;
  let prevADX = null;

  for (let i = period; i < rows.length; i += 1) {
    const raw = oneBar[i];
    prevTR = prevTR - (prevTR / period) + raw.tr;
    prevPlusDM = prevPlusDM - (prevPlusDM / period) + raw.plusDM;
    prevMinusDM = prevMinusDM - (prevMinusDM / period) + raw.minusDM;

    let plusDI = 0;
    let minusDI = 0;
    let dx = null;
    if (prevTR > 0) {
      plusDI = 100 * (prevPlusDM / prevTR);
      minusDI = 100 * (prevMinusDM / prevTR);
      const sumDI = plusDI + minusDI;
      if (Math.abs(sumDI) > TA_DIMENSIONLESS_ZERO_EPSILON) {
        dx = 100 * (Math.abs(minusDI - plusDI) / sumDI);
      }
    }

    const point = values[i];
    point.trSmoothed = prevTR;
    point.plusDMSmoothed = prevPlusDM;
    point.minusDMSmoothed = prevMinusDM;
    point.plusDI = plusDI;
    point.minusDI = minusDI;
    point.diSpread = plusDI - minusDI;
    point.dx = dx;

    if (i <= firstOutputIndex) {
      if (dx !== null) sumDX += dx;
      if (i === firstOutputIndex) {
        prevADX = sumDX / period;
        point.adx = prevADX;
        point.adxUpdated = true;
        point.ready = true;
      }
      continue;
    }

    if (dx !== null) {
      prevADX = prevADX - ((prevADX - dx) / period);
      point.adxUpdated = true;
    }
    point.adx = prevADX;
    point.ready = prevADX !== null;
  }

  return {
    valid: true,
    reason: null,
    period,
    firstOutputIndex,
    values,
  };
}

export function computeBollingerBands(
  rows,
  { period = 20, upperMultiplier = 2, lowerMultiplier = 2 } = {},
) {
  const validation = validateIndicatorBars(rows);
  if (!validation.valid) return { ...validation, values: [] };
  if (!Number.isInteger(period) || period < 2) {
    return { valid: false, reason: "INVALID_PERIOD", values: [] };
  }
  const values = Array.from({ length: rows.length }, () => ({
    middle: null,
    sigma: null,
    upper: null,
    lower: null,
    bandWidthRatio: null,
    bandWidthPct: null,
    percentB: null,
    percentBReason: null,
    stdDefinition: "POPULATION_DIVIDE_BY_N",
    ready: false,
  }));

  for (let i = period - 1; i < rows.length; i += 1) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j += 1) {
      sum += Number(rows[j].close);
    }
    const middle = sum / period;
    let sq = 0;
    for (let j = i - period + 1; j <= i; j += 1) {
      const diff = Number(rows[j].close) - middle;
      sq += diff * diff;
    }
    const sigma = Math.sqrt(Math.max(0, sq / period));
    const upper = middle + upperMultiplier * sigma;
    const lower = middle - lowerMultiplier * sigma;
    const width = upper - lower;
    const bandWidthRatio = middle === 0 ? null : width / middle;
    const percentB = width > 0 ? (Number(rows[i].close) - lower) / width : null;

    values[i] = {
      middle,
      sigma,
      upper,
      lower,
      bandWidthRatio,
      bandWidthPct: bandWidthRatio === null ? null : 100 * bandWidthRatio,
      percentB,
      percentBReason: width > 0 ? null : "ZERO_BAND_WIDTH_UNDEFINED_LOCATION",
      stdDefinition: "POPULATION_DIVIDE_BY_N",
      ready: true,
    };
  }

  return {
    valid: true,
    reason: null,
    period,
    upperMultiplier,
    lowerMultiplier,
    firstOutputIndex: period - 1,
    values,
  };
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
