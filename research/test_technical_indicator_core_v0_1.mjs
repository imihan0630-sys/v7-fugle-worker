import assert from "node:assert/strict";
import {
  TECHNICAL_INDICATOR_FORMULA_VERSION,
  computeKD,
  computeRSI,
  computeMACD,
  computeADX,
  computeBollingerBands,
  buildIndicatorSnapshot,
} from "./technical_indicator_core_v0_1.mjs";

const bar = (close, extra = {}) => ({
  open: close,
  high: close + 0.5,
  low: close - 0.5,
  close,
  ...extra,
});

const strictBar = (close, extra = {}) => bar(close, {
  symbolSessionVerified: true,
  technicalContinuity: true,
  corporateActionContinuityResolved: true,
  ...extra,
});

const monotonicUp = Array.from({ length: 50 }, (_, i) => strictBar(100 + i));
const monotonicDown = Array.from({ length: 50 }, (_, i) => strictBar(150 - i));
const flat = Array.from({ length: 50 }, () => strictBar(100, { high: 100, low: 100 }));

const upKD = computeKD(monotonicUp).values.at(-1);
const upRSI = computeRSI(monotonicUp).values.at(-1);
assert.ok(upKD.k > 90 && upKD.d > 90, "monotonic rise should create persistent high KD");
assert.equal(upRSI.rsi, 100, "monotonic rise should create RSI=100 after warmup");

const downKD = computeKD(monotonicDown).values.at(-1);
const downRSI = computeRSI(monotonicDown).values.at(-1);
assert.ok(downKD.k < 10 && downKD.d < 10, "monotonic fall should create persistent low KD");
assert.equal(downRSI.rsi, 0, "monotonic fall should create RSI=0 after warmup");

const flatKD = computeKD(flat).values.at(-1);
const flatRSI = computeRSI(flat).values.at(-1);
const flatMACD = computeMACD(flat).values.at(-1);
assert.ok(Math.abs(flatKD.rsv - 50) < 1e-12);
assert.ok(Math.abs(flatKD.k - 50) < 1e-12);
assert.ok(Math.abs(flatKD.d - 50) < 1e-12);
assert.equal(flatRSI.rsi, 50);
assert.ok(Math.abs(flatMACD.dif) < 1e-12);
assert.ok(Math.abs(flatMACD.histogram) < 1e-12);

const breakoutCloses = [
  ...Array.from({ length: 35 }, (_, i) => 100 + Math.sin(i / 2)),
  102, 104, 106, 108, 110, 112, 114, 116, 118, 120,
];
const breakout = breakoutCloses.map(c => strictBar(c));
const breakoutSnapshot = buildIndicatorSnapshot(breakout, {
  strictSemantics: true,
  source: "SYNTHETIC",
  continuitySpace: "TECHNICAL_CONTINUITY",
});
assert.equal(breakoutSnapshot.dataQualityState, "VALID");
assert.ok(breakoutSnapshot.kd.k > 90);
assert.ok(breakoutSnapshot.rsi.rsi > 80);
assert.equal(breakoutSnapshot.interpretationState, "OBSERVABLE");
assert.equal(breakoutSnapshot.decisionImpact, false);

const constrained = buildIndicatorSnapshot(monotonicUp, {
  strictSemantics: true,
  source: "SYNTHETIC",
  continuitySpace: "TECHNICAL_CONTINUITY",
  priceLimitConstrained: true,
});
assert.equal(constrained.dataQualityState, "VALID");
assert.equal(constrained.interpretationState, "UNRESOLVED");
assert.ok(constrained.kd.k > 90);
assert.equal(constrained.rsi.rsi, 100);

const pseudo = monotonicUp.map(x => ({ ...x }));
pseudo[20].suspensionPseudoBar = true;
const pseudoSnapshot = buildIndicatorSnapshot(pseudo, {
  strictSemantics: true,
  source: "SYNTHETIC",
  continuitySpace: "TECHNICAL_CONTINUITY",
});
assert.equal(pseudoSnapshot.dataQualityState, "BLOCKED");
assert.equal(pseudoSnapshot.blockedReason, "PSEUDO_BAR_NOT_ELIGIBLE");
assert.equal(pseudoSnapshot.kd, null);

const unresolvedCA = monotonicUp.map(x => ({ ...x }));
unresolvedCA[20].corporateActionContinuityResolved = false;
const caSnapshot = buildIndicatorSnapshot(unresolvedCA, {
  strictSemantics: true,
  source: "SYNTHETIC",
  continuitySpace: "TECHNICAL_CONTINUITY",
});
assert.equal(caSnapshot.dataQualityState, "BLOCKED");
assert.equal(caSnapshot.blockedReason, "CORPORATE_ACTION_CONTINUITY_UNRESOLVED");

const fullKD = computeKD(monotonicUp).values;
const fullRSI = computeRSI(monotonicUp).values;
const fullMACD = computeMACD(monotonicUp).values;

for (let end = 35; end <= monotonicUp.length; end += 1) {
  const prefix = monotonicUp.slice(0, end);
  assert.deepEqual(computeKD(prefix).values.at(-1), fullKD[end - 1], "KD prefix mismatch at " + end);
  assert.deepEqual(computeRSI(prefix).values.at(-1), fullRSI[end - 1], "RSI prefix mismatch at " + end);
  assert.deepEqual(computeMACD(prefix).values.at(-1), fullMACD[end - 1], "MACD prefix mismatch at " + end);
}

assert.deepEqual(
  buildIndicatorSnapshot(monotonicUp, {
    strictSemantics: true,
    source: "SYNTHETIC",
    continuitySpace: "TECHNICAL_CONTINUITY",
  }),
  buildIndicatorSnapshot(monotonicUp, {
    strictSemantics: true,
    source: "SYNTHETIC",
    continuitySpace: "TECHNICAL_CONTINUITY",
  }),
  "replay must be exact"
);



const approx = (actual, expected, tolerance = 1e-10, message = "") => {
  assert.ok(
    Math.abs(Number(actual) - Number(expected)) <= tolerance,
    (message ? message + ": " : "") + "expected " + expected + ", got " + actual,
  );
};

// ADX14 deterministic oracle checks.
const adxUpBars = Array.from({ length: 40 }, (_, i) => strictBar(100 + i, {
  high: 101 + i,
  low: 99 + i,
}));
const adxDownBars = Array.from({ length: 40 }, (_, i) => strictBar(139 - i, {
  high: 140 - i,
  low: 138 - i,
}));
const adxFlatBars = Array.from({ length: 40 }, () => strictBar(100, { high: 100, low: 100 }));
const adxEqualOutsideBars = Array.from({ length: 40 }, (_, i) => strictBar(100, {
  high: 101 + i,
  low: 99 - i,
}));

const adxUp = computeADX(adxUpBars);
const adxDown = computeADX(adxDownBars);
const adxFlat = computeADX(adxFlatBars);
const adxEqualOutside = computeADX(adxEqualOutsideBars);

assert.equal(adxUp.firstOutputIndex, 27);
approx(adxUp.values[27].adx, 100, 1e-12, "ADX monotonic-up first value");
approx(adxUp.values.at(-1).adx, 100, 1e-12, "ADX monotonic-up final");
approx(adxUp.values[27].plusDI, 50, 1e-12, "ADX monotonic-up +DI");
approx(adxUp.values[27].minusDI, 0, 1e-12, "ADX monotonic-up -DI");

approx(adxDown.values[27].adx, 100, 1e-12, "ADX monotonic-down first value");
approx(adxDown.values.at(-1).adx, 100, 1e-12, "ADX monotonic-down final");
approx(adxDown.values[27].plusDI, 0, 1e-12, "ADX monotonic-down +DI");
approx(adxDown.values[27].minusDI, 50, 1e-12, "ADX monotonic-down -DI");

approx(adxFlat.values[27].adx, 0, 1e-12, "ADX flat first value");
approx(adxFlat.values.at(-1).adx, 0, 1e-12, "ADX flat final");
approx(adxEqualOutside.values[27].plusDI, 0, 1e-12, "ADX equal expansion +DI");
approx(adxEqualOutside.values[27].minusDI, 0, 1e-12, "ADX equal expansion -DI");
approx(adxEqualOutside.values[27].adx, 0, 1e-12, "ADX equal expansion");

const gapBars = [
  strictBar(100, { high: 100, low: 100 }),
  strictBar(110, { high: 110.5, low: 109.5 }),
];
approx(computeADX(gapBars).values[1].tr, 10.5, 1e-12, "ADX true-range gap fixture");

const adxUpScaled = computeADX(adxUpBars.map(row => ({
  ...row,
  open: Number(row.open) * 10,
  high: Number(row.high) * 10,
  low: Number(row.low) * 10,
  close: Number(row.close) * 10,
})));
for (let i = 27; i < adxUp.values.length; i += 1) {
  approx(adxUpScaled.values[i].plusDI, adxUp.values[i].plusDI, 1e-10, "ADX +DI scale invariance " + i);
  approx(adxUpScaled.values[i].minusDI, adxUp.values[i].minusDI, 1e-10, "ADX -DI scale invariance " + i);
  approx(adxUpScaled.values[i].adx, adxUp.values[i].adx, 1e-10, "ADX scale invariance " + i);
}


const asymmetricWaveBars = Array.from({ length: 50 }, (_, i) => {
  const close = 100 + 0.35 * i + 3 * Math.sin(i * 0.71) + 1.2 * Math.sin(i * 0.17);
  return strictBar(close, {
    high: close + 0.8 + (i % 4) * 0.17,
    low: close - 0.7 - (i % 5) * 0.11,
  });
});
const asymmetricADX = computeADX(asymmetricWaveBars).values;
approx(asymmetricADX[27].trSmoothed, 34.646000230548495, 1e-10, "ADX asymmetric TR14");
approx(asymmetricADX[27].plusDMSmoothed, 12.692588044888245, 1e-10, "ADX asymmetric +DM14");
approx(asymmetricADX[27].minusDMSmoothed, 7.095548052704646, 1e-10, "ADX asymmetric -DM14");
approx(asymmetricADX[27].plusDI, 36.63507464188256, 1e-10, "ADX asymmetric +DI");
approx(asymmetricADX[27].minusDI, 20.480136250903424, 1e-10, "ADX asymmetric -DI");
approx(asymmetricADX[27].dx, 28.284826648551533, 1e-10, "ADX asymmetric DX");
approx(asymmetricADX[27].adx, 24.06246596876735, 1e-10, "ADX asymmetric first ADX");
approx(asymmetricADX[28].adx, 24.74112347980112, 1e-10, "ADX asymmetric second ADX");
approx(asymmetricADX[49].adx, 30.109005583147688, 1e-10, "ADX asymmetric final ADX");

// Bollinger20x2 deterministic oracle checks.
const bbFlat = computeBollingerBands(Array.from({ length: 20 }, () => strictBar(100))).values.at(-1);
approx(bbFlat.middle, 100, 1e-12, "BB flat SMA");
approx(bbFlat.sigma, 0, 1e-12, "BB flat sigma");
approx(bbFlat.bandWidthRatio, 0, 1e-12, "BB flat width");
assert.equal(bbFlat.percentB, null);
assert.equal(bbFlat.percentBReason, "ZERO_BAND_WIDTH_UNDEFINED_LOCATION");

const bbSeqBars = Array.from({ length: 20 }, (_, i) => strictBar(101 + i));
const bbSeq = computeBollingerBands(bbSeqBars).values.at(-1);
approx(bbSeq.middle, 110.5, 1e-12, "BB sequence SMA");
approx(bbSeq.sigma, 5.766281297335398, 1e-12, "BB population sigma");
approx(bbSeq.upper, 122.0325625946708, 1e-12, "BB upper");
approx(bbSeq.lower, 98.9674374053292, 1e-12, "BB lower");
approx(bbSeq.bandWidthRatio, 0.20873416460942612, 1e-12, "BB width ratio");
approx(bbSeq.bandWidthPct, 20.87341646094261, 1e-12, "BB width pct");
approx(bbSeq.percentB, 0.911877235523957, 1e-12, "BB percentB");

const bbScaled = computeBollingerBands(bbSeqBars.map(row => ({
  ...row,
  open: Number(row.open) * 10,
  high: Number(row.high) * 10,
  low: Number(row.low) * 10,
  close: Number(row.close) * 10,
}))).values.at(-1);
approx(bbScaled.bandWidthRatio, bbSeq.bandWidthRatio, 1e-12, "BB scale width invariance");
approx(bbScaled.percentB, bbSeq.percentB, 1e-12, "BB scale %B invariance");

const bbShifted = computeBollingerBands(bbSeqBars.map(row => ({
  ...row,
  open: Number(row.open) + 100,
  high: Number(row.high) + 100,
  low: Number(row.low) + 100,
  close: Number(row.close) + 100,
}))).values.at(-1);
approx(bbShifted.middle, 210.5, 1e-12, "BB additive-shift SMA");
approx(bbShifted.sigma, bbSeq.sigma, 1e-12, "BB additive-shift sigma");
approx(bbShifted.bandWidthRatio, 0.10957304127953248, 1e-12, "BB additive-shift width");
approx(bbShifted.percentB, bbSeq.percentB, 1e-12, "BB additive-shift %B");

// Prefix invariance for newly implemented indicators.
const fullADX = computeADX(adxUpBars).values;
for (let end = 28; end <= adxUpBars.length; end += 1) {
  assert.deepEqual(computeADX(adxUpBars.slice(0, end)).values.at(-1), fullADX[end - 1], "ADX prefix mismatch at " + end);
}
const bbLongBars = Array.from({ length: 40 }, (_, i) => strictBar(100 + i * 0.7 + Math.sin(i / 3)));
const fullBB = computeBollingerBands(bbLongBars).values;
for (let end = 20; end <= bbLongBars.length; end += 1) {
  assert.deepEqual(computeBollingerBands(bbLongBars.slice(0, end)).values.at(-1), fullBB[end - 1], "Bollinger prefix mismatch at " + end);
}

assert.equal(TECHNICAL_INDICATOR_FORMULA_VERSION.kd, "TAI_KD_RSV9_K3_D3_INIT50_V0_1");
assert.equal(TECHNICAL_INDICATOR_FORMULA_VERSION.rsi, "WILDER_RSI14_SMA_SEED_V0_1");
assert.equal(TECHNICAL_INDICATOR_FORMULA_VERSION.macd, "EMA12_26_SIGNAL9_FIRST_CLOSE_SEED_V0_1");
assert.equal(TECHNICAL_INDICATOR_FORMULA_VERSION.adx, "WILDER_ADX14_TALIB_STYLE_NO_ROUNDING_V0_1");
assert.equal(TECHNICAL_INDICATOR_FORMULA_VERSION.bbands, "BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1");

console.log(JSON.stringify({
  ok: true,
  formulaVersion: TECHNICAL_INDICATOR_FORMULA_VERSION,
  monotonicUp: { kd: upKD, rsi: upRSI },
  breakout: breakoutSnapshot,
  constrainedInterpretation: constrained.interpretationState,
  adxOracle: { first: adxUp.values[27], final: adxUp.values.at(-1) },
  bbandsOracle: bbSeq,
  prefixReplay: "PASS",
}));
