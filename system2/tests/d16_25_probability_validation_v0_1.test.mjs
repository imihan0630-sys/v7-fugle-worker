import assert from "node:assert/strict";
import {
  computeBinaryExpectedValueV01,
  evaluateBinaryPredictionsV01,
  evaluateFrozenSelectivePolicySetV01,
  updateBetaBinomialPriorV01,
} from "../../research/d16_25_probability_validation_v0_1.mjs";

const base = {
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"SHORT_MOMENTUM_V0_1",
  decisionStage:"STRATEGY_VALIDITY_READY",
  targetId:"AFTER_COST_D5_POSITIVE",
  horizon:"D5",
  referenceBasis:"FROZEN_DECISION_CLOSE",
  costModelVersion:"COST_V0_1",
  outcomeRuleVersion:"OUTCOME_V0_1",
  baseRateCohortVersion:"BASE_RATE_SHORT_D5_V0_1",
  modelVersion:"MODEL_V0_1",
  calibrationVersion:"CAL_V0_1",
};

const records = [
  {
    ...base,
    predictionId:"P1",
    scanDate:"2026-09-01",
    decisionAt:"2026-09-01T08:00:00Z",
    predictedProbability:0.8,
    regimeId:"TREND",
    uncertaintyScore:0.1,
    predictedNetUtility:0.02,
    outcome:1,
    outcomeMaturedAt:"2026-09-08T08:00:00Z",
    realizedAfterCostValue:0.03,
  },
  {
    ...base,
    predictionId:"P2",
    scanDate:"2026-09-02",
    decisionAt:"2026-09-02T08:00:00Z",
    predictedProbability:0.2,
    regimeId:"TREND",
    uncertaintyScore:0.1,
    predictedNetUtility:-0.01,
    outcome:0,
    outcomeMaturedAt:"2026-09-09T08:00:00Z",
    realizedAfterCostValue:-0.02,
  },
  {
    ...base,
    predictionId:"P3",
    scanDate:"2026-09-03",
    decisionAt:"2026-09-03T08:00:00Z",
    predictedProbability:0.5,
    regimeId:"RANGE",
    uncertaintyScore:0.05,
    predictedNetUtility:0.01,
    outcome:1,
    outcomeMaturedAt:"2026-09-10T08:00:00Z",
    realizedAfterCostValue:0.01,
  },
  {
    ...base,
    predictionId:"P4",
    scanDate:"2026-09-04",
    decisionAt:"2026-09-04T08:00:00Z",
    predictedProbability:0.9,
    regimeId:"STRESS",
    uncertaintyScore:0.9,
    predictedNetUtility:0.03,
    outcome:1,
    outcomeMaturedAt:"2026-10-10T08:00:00Z",
    realizedAfterCostValue:0.05,
  },
  {
    ...base,
    predictionId:"P5",
    scanDate:"2026-09-05",
    decisionAt:"2026-09-05T08:00:00Z",
    predictedProbability:0.7,
    regimeId:"RANGE",
    uncertaintyScore:null,
    predictedNetUtility:0.02,
    outcome:0,
    outcomeMaturedAt:"2026-09-12T08:00:00Z",
    realizedAfterCostValue:-0.01,
  },
];

const result = evaluateBinaryPredictionsV01({
  records,
  evaluationCutoff:"2026-10-03T00:00:00Z",
  referenceBaseRate:0.4,
  selectivePolicy:{
    policyVersion:"SEL_V0_1",
    maxUncertaintyScore:0.2,
    minPredictedNetUtility:0,
  },
});

assert.equal(result.status,"MATURED_EVALUATION_AVAILABLE");
assert.equal(result.totalPredictionCount,5);
assert.equal(result.eligibleMaturedCount,4);
assert.equal(result.immatureCount,1);
assert.deepEqual(result.immaturePredictionIds,["P4"]);
assert.equal(result.unknownOutcomeCount,0);
assert.equal(result.independentScanDateCount,4);
assert.equal(result.empiricalOutcomeRate,0.5);
assert.equal(result.referenceBaseRate,0.4);
assert.equal(result.regimeDiagnostics.TREND.n,2);
assert.equal(result.regimeDiagnostics.TREND.independentScanDateCount,2);
assert.ok(Math.abs(result.regimeDiagnostics.TREND.brierScore - 0.04) < 1e-12);
assert.equal(result.regimeDiagnostics.RANGE.n,2);
assert.equal(result.regimeDiagnostics.STRESS,undefined); // P4 is not matured at cutoff.
assert.equal(result.safeguards.empiricalOutcomeRateUsedAsFrozenReferenceBaseRate,false);
assert.equal(result.safeguards.immatureOutcomeCoercedToLoss,false);
assert.equal(result.safeguards.probabilityClippingApplied,false);
assert.equal(result.safeguards.probabilityNearHalfUsedAsUncertaintyProxy,false);
assert.equal(result.safeguards.thresholdOptimizationPerformed,false);

// Exact Brier for P1/P2/P3/P5: .04 + .04 + .25 + .49 = .82 / 4.
assert.ok(Math.abs(result.brierScore - 0.205) < 1e-12);

// p=0.5 with explicitly low uncertainty is accepted; p near half is NOT an uncertainty proxy.
assert.equal(result.selectivePolicyEvaluation.stateByPrediction.P3.state,"ACCEPT");

// Missing uncertainty fails closed under a frozen uncertainty gate.
assert.equal(result.selectivePolicyEvaluation.stateByPrediction.P5.state,"DATA_BLOCKED");
assert.equal(
  result.selectivePolicyEvaluation.stateByPrediction.P5.reason,
  "UNCERTAINTY_REQUIRED_BUT_MISSING",
);

// Negative predicted utility abstains even when uncertainty is low.
assert.equal(result.selectivePolicyEvaluation.stateByPrediction.P2.state,"ABSTAIN");
assert.equal(result.selectivePolicyEvaluation.acceptedCount,2);
assert.equal(result.selectivePolicyEvaluation.abstainedCount,1);
assert.equal(result.selectivePolicyEvaluation.dataBlockedCount,1);
assert.equal(result.selectivePolicyEvaluation.acceptedCoverage,0.5);
assert.equal(result.selectivePolicyEvaluation.opportunityCapture,1);
assert.equal(result.selectivePolicyEvaluation.falseAcceptanceRate,0);

// A 70% win rate can still have negative EV when losses are much larger.
const negativeEv = computeBinaryExpectedValueV01({
  pWin:0.7,
  averageWin:0.01,
  averageLossMagnitude:0.04,
  tradingCost:0,
});
assert.ok(Math.abs(negativeEv + 0.005) < 1e-12);

// Wrong exact 0%/100% forecasts retain infinite log loss; no silent clipping.
const infiniteLog = evaluateBinaryPredictionsV01({
  records:[
    {
      ...base,
      predictionId:"Z1",
      scanDate:"2026-09-01",
      decisionAt:"2026-09-01T08:00:00Z",
      predictedProbability:0,
      outcome:1,
      outcomeMaturedAt:"2026-09-08T08:00:00Z",
    },
  ],
  evaluationCutoff:"2026-10-03T00:00:00Z",
});
assert.equal(infiniteLog.logLoss,Number.POSITIVE_INFINITY);
assert.equal(infiniteLog.safeguards.probabilityClippingApplied,false);

// Mixed targets/horizons are not silently pooled into one calibration score.
assert.throws(
  () => evaluateBinaryPredictionsV01({
    records:[
      records[0],
      {...records[1],predictionId:"MIX",targetId:"TARGET_FIRST_BEFORE_STOP"},
    ],
    evaluationCutoff:"2026-10-03T00:00:00Z",
  }),
  /MIXED_TARGETID_NOT_ALLOWED/,
);

// Different payoff/cost semantics cannot be pooled into one calibration family.
assert.throws(
  () => evaluateBinaryPredictionsV01({
    records:[
      records[0],
      {...records[1],predictionId:"COST_MIX",costModelVersion:"COST_V0_2"},
    ],
    evaluationCutoff:"2026-10-03T00:00:00Z",
  }),
  /MIXED_COSTMODELVERSION_NOT_ALLOWED/,
);

// Duplicate predictions fail rather than double-count evidence.
assert.throws(
  () => evaluateBinaryPredictionsV01({
    records:[records[0],{...records[0]}],
    evaluationCutoff:"2026-10-03T00:00:00Z",
  }),
  /DUPLICATE_PREDICTION_ID/,
);

// Beta-Binomial update uses only outcomes matured by the as-of timestamp.
const prior = updateBetaBinomialPriorV01({
  priorId:"SHORT_D5_BASE_RATE_V0_1",
  alpha:2,
  beta:2,
  asOf:"2026-10-03T00:00:00Z",
  observations:[
    {observationId:"O1",outcome:1,outcomeMaturedAt:"2026-09-20T00:00:00Z"},
    {observationId:"O2",outcome:0,outcomeMaturedAt:"2026-09-21T00:00:00Z"},
    {observationId:"O3",outcome:1,outcomeMaturedAt:"2026-10-10T00:00:00Z"},
    {observationId:"O4",outcome:null,outcomeMaturedAt:null},
  ],
});
assert.equal(prior.successes,1);
assert.equal(prior.failures,1);
assert.equal(prior.eligibleObservationCount,2);
assert.equal(prior.immatureObservationCount,1);
assert.equal(prior.unknownObservationCount,1);
assert.equal(prior.posteriorAlpha,3);
assert.equal(prior.posteriorBeta,3);
assert.equal(prior.posteriorMean,0.5);

// No matured label is not misread as a loss or weak probability.
const noneMature = evaluateBinaryPredictionsV01({
  records:[
    {
      ...base,
      predictionId:"IMMATURE_ONLY",
      scanDate:"2026-10-01",
      decisionAt:"2026-10-01T08:00:00Z",
      predictedProbability:0.9,
      outcome:1,
      outcomeMaturedAt:"2026-10-10T08:00:00Z",
    },
  ],
  evaluationCutoff:"2026-10-03T00:00:00Z",
});
assert.equal(noneMature.status,"NO_MATURED_OUTCOMES");
assert.equal(noneMature.eligibleMaturedCount,0);
assert.equal(noneMature.immatureCount,1);

console.log("D16-25 probability validation v0.1 tests passed");


// Multiple preregistered selective operating points may be compared,
// but the evaluator must never choose a winner from outcomes.
const policySet = evaluateFrozenSelectivePolicySetV01({
  records,
  evaluationCutoff:"2026-10-03T00:00:00Z",
  referenceBaseRate:0.4,
  policies:[
    {policyVersion:"SEL_TIGHT",maxUncertaintyScore:0.1,minPredictedNetUtility:0},
    {policyVersion:"SEL_LOOSE",maxUncertaintyScore:0.3,minPredictedNetUtility:-0.02},
  ],
});
assert.equal(policySet.policyCount,2);
assert.equal(policySet.bestPolicySelected,false);
assert.equal(policySet.selectionRule,"NO_OUTCOME_TUNED_POLICY_SELECTION");
assert.deepEqual(
  policySet.policyResults.map((x)=>x.policyVersion),
  ["SEL_TIGHT","SEL_LOOSE"],
);
assert.throws(
  () => evaluateFrozenSelectivePolicySetV01({
    records,
    evaluationCutoff:"2026-10-03T00:00:00Z",
    policies:[
      {policyVersion:"DUP",maxUncertaintyScore:0.1},
      {policyVersion:"DUP",maxUncertaintyScore:0.2},
    ],
  }),
  /DUPLICATE_POLICY_VERSION/,
);


// Date-balanced diagnostics prevent a large same-date cross-section from masquerading
// as many independent calibration dates. Row-weighted and date-balanced scores are
// both valid estimands, but they answer different questions and must be reported separately.
const clusteredDateResult = evaluateBinaryPredictionsV01({
  records:[
    {
      ...base,
      predictionId:"D1_A",
      scanDate:"2026-09-01",
      decisionAt:"2026-09-01T08:00:00Z",
      predictedProbability:0.9,
      outcome:0,
      outcomeMaturedAt:"2026-09-08T08:00:00Z",
    },
    {
      ...base,
      predictionId:"D1_B",
      scanDate:"2026-09-01",
      decisionAt:"2026-09-01T08:00:00Z",
      predictedProbability:0.9,
      outcome:0,
      outcomeMaturedAt:"2026-09-08T08:00:00Z",
    },
    {
      ...base,
      predictionId:"D2_A",
      scanDate:"2026-09-02",
      decisionAt:"2026-09-02T08:00:00Z",
      predictedProbability:0.1,
      outcome:0,
      outcomeMaturedAt:"2026-09-09T08:00:00Z",
    },
  ],
  evaluationCutoff:"2026-10-03T00:00:00Z",
});
assert.equal(clusteredDateResult.independentScanDateCount,2);
assert.equal(Object.keys(clusteredDateResult.dateDiagnostics).length,2);
assert.ok(Math.abs(clusteredDateResult.brierScore - ((0.81 + 0.81 + 0.01) / 3)) < 1e-12);
assert.ok(Math.abs(clusteredDateResult.dateBalancedBrierScore - ((0.81 + 0.01) / 2)) < 1e-12);
assert.notEqual(clusteredDateResult.brierScore,clusteredDateResult.dateBalancedBrierScore);
assert.equal(clusteredDateResult.safeguards.dateBalancedDiagnosticsReported,true);
assert.equal(clusteredDateResult.safeguards.rowWeightedScoresNotTreatedAsIndependentDateCount,true);

// Calibration-in-the-large is a signed descriptive gap, not a substitute for full reliability.
assert.ok(Math.abs(clusteredDateResult.meanPredictedProbability - (1.9 / 3)) < 1e-12);
assert.ok(Math.abs(clusteredDateResult.calibrationInTheLargeGap - ((1.9 / 3) - 0)) < 1e-12);
