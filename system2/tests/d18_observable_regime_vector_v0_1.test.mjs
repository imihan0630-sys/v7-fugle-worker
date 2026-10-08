import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import {
  buildD18ObservableRegimeVectorV0_1,
  validateD18ObservableRegimeVectorV0_1,
} from "../runtime/d18_observable_regime_vector_v0_1.mjs";

const marketDate = "2026-10-02";
const decisionTimestamp = "2026-10-02T06:30:00.000Z";

async function withReceiptHash(base) {
  return { ...base, receiptHash: await sha256Hex(base) };
}

function withFeatureHash(base) {
  return {
    ...base,
    featureHash: createHash("sha256").update(JSON.stringify(base)).digest("hex"),
  };
}

const taiexContext = await withReceiptHash({
  marketDate,
  decisionTimestamp,
  state: "KNOWN",
  sourceId: "A2_TAIEX_CLOSE",
  pointInTimeEligible: true,
  availableAt: "2026-10-02T06:20:00.000Z",
  historyWindowHash: "h1",
  officialSessionWindowHash: "s1",
  trendContext: "UP_TREND_CONTEXT",
  volatilityDirection: "VOL_CONTRACTING",
  metrics: {
    close: 25000,
    ma20: 24500,
    ma20Slope5: 180,
    return20: 0.04,
    realizedVol5: 0.008,
    realizedVol20: 0.012,
    volRatio5to20: 2/3,
  },
});

const directionBreadth = withFeatureHash({
  marketDate,
  decisionTimestamp,
  state: "KNOWN",
  pointInTimeEligible: true,
  availableAt: "2026-10-02T06:20:00.000Z",
  featureId: "D18.DIRECTION_BREADTH",
  sourceBatchId: "A1-BATCH-1",
  sourceBatchHash: "c".repeat(64),
  total: {
    advanceShareKnown: 0.57,
    declineShareKnown: 0.39,
    flatShareKnown: 0.04,
    netBreadthShareKnown: 0.18,
    comparableCoveragePct: 0.97,
    notComparablePct: 0.02,
    unknownPct: 0.01,
  },
  byMarket: {
    TWSE: { advanceShareKnown: 0.55 },
    TPEX: { advanceShareKnown: 0.60 },
  },
});

const sectorRotation = await withReceiptHash({
  marketDate,
  priorMarketDate: "2026-10-01",
  decisionTimestamp,
  state: "KNOWN",
  pointInTimeEligible: true,
  availableAt: "2026-10-02T06:20:00.000Z",
  receiptId: "SECTOR-ROT-1",
  commonIndustryCount: 20,
  industries: [{ industryKey: "TWSE:電子", currentRank: 1, priorRank: 3, rankImprovement: 2 }],
});

const base = {
  receiptId: "D18-RV-1",
  marketDate,
  decisionTimestamp,
  taiexContext,
  directionBreadth,
  sectorRotation,
};

const out = await buildD18ObservableRegimeVectorV0_1(base);
assert.equal(out.state, "KNOWN_PARTIAL_VECTOR");
assert.equal(out.pointInTimeEligible, true);
assert.equal(out.dimensions.trendContext.value, "UP_TREND_CONTEXT");
assert.equal(out.dimensions.volatilityDirection.value, "VOL_CONTRACTING");
assert.equal(out.dimensions.breadthContext.state, "CONTEXT_RAW");
assert.equal(out.dimensions.breadthContext.reason, "MEDIAN_RETURN_U2B_NOT_CONTINUITY_CERTIFIED");
assert.equal(out.dimensions.activityDirection.state, "UNKNOWN");
assert.equal(out.dimensions.sizeLeadership.state, "UNKNOWN");
assert.equal(out.dimensions.globalTransmission.state, "UNKNOWN");
assert.equal(out.dimensions.sectorRotationContext.state, "CONTEXT_RAW");
assert.equal(out.scalarRiskScoreProduced, false);
assert.equal(out.compositeRiskOnOffAssigned, false);
assert.equal(out.policyApplied, false);
assert.equal(out.selectionImpact, false);
assert.equal(out.strategyWeightImpact, false);
assert.equal(out.capitalImpact, false);
assert.equal(out.dimensions.trendContext.pointInTimeEligible, true);
assert.match(out.dimensions.trendContext.evidenceHash, /^[a-f0-9]{64}$/);
assert.equal(out.dimensions.breadthContext.pointInTimeEligible, true);
const validated = await validateD18ObservableRegimeVectorV0_1(out);
assert.equal(validated.valid, true);
assert.deepEqual(validated.blockers, []);

const replay = await buildD18ObservableRegimeVectorV0_1(base);
assert.equal(replay.receiptHash, out.receiptHash);

const changed = await buildD18ObservableRegimeVectorV0_1({
  ...base,
  receiptId: "D18-RV-2",
  taiexContext: await withReceiptHash({
    ...Object.fromEntries(Object.entries(taiexContext).filter(([key]) => key !== "receiptHash")),
    metrics: { ...taiexContext.metrics, close: 25100 },
  }),
});
assert.notEqual(changed.receiptHash, out.receiptHash);

const wrongClock = await buildD18ObservableRegimeVectorV0_1({
  ...base,
  receiptId: "D18-RV-clock",
  directionBreadth: { ...directionBreadth, decisionTimestamp: "2026-10-02T06:31:00.000Z" },
});
assert.equal(wrongClock.state, "UNKNOWN");
assert(wrongClock.unknownReasons.includes("DIRECTION_BREADTH_DECISION_CLOCK_MISMATCH"));

const notPit = await buildD18ObservableRegimeVectorV0_1({
  ...base,
  receiptId: "D18-RV-notpit",
  taiexContext: { ...taiexContext, pointInTimeEligible: false },
});
assert.equal(notPit.state, "UNKNOWN");
assert(notPit.unknownReasons.includes("TAIEX_CONTEXT_PIT_INELIGIBLE"));

const activity = await buildD18ObservableRegimeVectorV0_1({
  ...base,
  receiptId: "D18-RV-activity",
  activityContext: await withReceiptHash({
    marketDate,
    decisionTimestamp,
    state: "KNOWN",
    receiptId: "ACTIVITY-1",
    pointInTimeEligible: true,
    availableAt: "2026-10-02T06:20:00.000Z",
    totalTradeValueVs20D: 1.12,
  }),
  concentrationContext: await withReceiptHash({
    marketDate,
    decisionTimestamp,
    state: "KNOWN",
    receiptId: "CONC-1",
    pointInTimeEligible: true,
    availableAt: "2026-10-02T06:20:00.000Z",
    top10TradeValueShare: 0.31,
    top20TradeValueShare: 0.44,
    returnDispersion: 0.021,
  }),
  institutionalContext: await withReceiptHash({
    marketDate,
    decisionTimestamp,
    state: "KNOWN",
    receiptId: "INST-1",
    pointInTimeEligible: true,
    availableAt: "2026-10-02T06:20:00.000Z",
    foreignNet: 100,
    trustNet: -20,
    dealerNet: 5,
  }),
});
assert.equal(activity.dimensions.activityDirection.value, "ACTIVITY_EXPANDING");
assert.equal(activity.dimensions.concentrationContext.state, "CONTEXT_RAW");
assert.equal(activity.dimensions.institutionalContext.state, "CONTEXT_RAW");
assert.equal(activity.compositeRiskOnOffAssigned, false);

const ap07 = await buildD18ObservableRegimeVectorV0_1({
  ...base,
  receiptId: "D18-RV-AP07",
  globalTransmission: await withReceiptHash({
    receiptId: "GLOBAL-FUTURE",
    marketDate: "2030-01-01",
    decisionTimestamp: "2030-01-01T06:30:00.000Z",
    state: "KNOWN",
    value: "RISK_ON",
    pointInTimeEligible: false,
    availableAt: "2030-01-01T06:20:00.000Z",
  }),
});
assert.equal(ap07.state, "KNOWN_PARTIAL_VECTOR");
assert.equal(ap07.pointInTimeEligible, true);
assert.equal(ap07.dimensions.globalTransmission.state, "UNKNOWN");
assert.equal(ap07.dimensions.globalTransmission.pointInTimeEligible, false);
assert.ok(ap07.dimensions.globalTransmission.blockerCodes.includes("GLOBAL_TRANSMISSION_MARKET_DATE_MISMATCH"));
assert.ok(ap07.dimensions.globalTransmission.blockerCodes.includes("GLOBAL_TRANSMISSION_DECISION_CLOCK_MISMATCH"));
assert.ok(ap07.dimensions.globalTransmission.blockerCodes.includes("GLOBAL_TRANSMISSION_PIT_INELIGIBLE"));
assert.ok(ap07.dimensions.globalTransmission.blockerCodes.includes("GLOBAL_TRANSMISSION_AVAILABLE_AFTER_DECISION"));
const ap07Validation = await validateD18ObservableRegimeVectorV0_1(ap07);
assert.equal(ap07Validation.valid, true);

const tamperedDimension = {
  ...out,
  dimensions: {
    ...out.dimensions,
    trendContext: {
      ...out.dimensions.trendContext,
      value: "DOWN_TREND_CONTEXT",
    },
  },
};
const badDimensionValidation = await validateD18ObservableRegimeVectorV0_1(tamperedDimension);
assert.equal(badDimensionValidation.valid, false);
assert.ok(badDimensionValidation.blockers.some((x) => x.includes("DIMENSION_EVIDENCE_HASH_MISMATCH")));

const tamperedVector = { ...out, receiptHash: "4".repeat(64) };
const badVectorValidation = await validateD18ObservableRegimeVectorV0_1(tamperedVector);
assert.equal(badVectorValidation.valid, false);
assert.ok(badVectorValidation.blockers.includes("REGIME_VECTOR_HASH_MISMATCH"));

console.log("D18 observable regime vector tests: PASS");
