import assert from "node:assert/strict";
import {
  TECHNICAL_INDICATOR_FORMULA_VERSION,
  computeKD,
  computeRSI,
  computeMACD,
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

assert.equal(TECHNICAL_INDICATOR_FORMULA_VERSION.kd, "TAI_KD_RSV9_K3_D3_INIT50_V0_1");
assert.equal(TECHNICAL_INDICATOR_FORMULA_VERSION.rsi, "WILDER_RSI14_SMA_SEED_V0_1");
assert.equal(TECHNICAL_INDICATOR_FORMULA_VERSION.macd, "EMA12_26_SIGNAL9_FIRST_CLOSE_SEED_V0_1");

console.log(JSON.stringify({
  ok: true,
  formulaVersion: TECHNICAL_INDICATOR_FORMULA_VERSION,
  monotonicUp: { kd: upKD, rsi: upRSI },
  breakout: breakoutSnapshot,
  constrainedInterpretation: constrained.interpretationState,
  prefixReplay: "PASS",
}));
