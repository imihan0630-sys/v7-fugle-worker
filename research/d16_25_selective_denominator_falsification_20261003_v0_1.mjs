import assert from 'node:assert/strict';
import { evaluateBinaryPredictionsV01 } from './d16_25_probability_validation_v0_1.mjs';

// Synthetic audit of the existing evaluator. No real market evidence or policy search.
const identity = {
  strategyId:'AUDIT_ONLY', strategyVersion:'AUDIT_V0_1',
  decisionStage:'STRATEGY_VALIDITY', targetId:'D5_NET_POSITIVE', horizon:'D5',
  referenceBasis:'DECISION_CLOSE', costModelVersion:'COST_AUDIT',
  outcomeRuleVersion:'OUTCOME_AUDIT', baseRateCohortVersion:'PRIOR_AUDIT',
  modelVersion:'MODEL_AUDIT', calibrationVersion:'CAL_AUDIT',
  scanDate:'2026-09-01', decisionAt:'2026-09-01T08:00:00Z',
  predictedProbability:0.7, uncertaintyScore:0.1,
};
const rows = [
  {...identity, predictionId:'A', predictedNetUtility:0.01, outcome:1,
    outcomeMaturedAt:'2026-09-08T08:00:00Z', realizedAfterCostValue:0.01},
  {...identity, predictionId:'B', predictedNetUtility:-0.01, outcome:0,
    outcomeMaturedAt:'2026-09-08T08:00:00Z', realizedAfterCostValue:-0.01},
  {...identity, predictionId:'C', predictedNetUtility:0.02, outcome:1,
    outcomeMaturedAt:'2026-10-10T08:00:00Z', realizedAfterCostValue:null},
  {...identity, predictionId:'D', predictedNetUtility:0.02, outcome:null,
    outcomeMaturedAt:null, realizedAfterCostValue:null},
];
const policy = {policyVersion:'FROZEN_AUDIT', minPredictedNetUtility:0};
const args = {records:rows, evaluationCutoff:'2026-10-03T00:00:00Z',
  referenceBaseRate:0.5, selectivePolicy:policy};
const before = evaluateBinaryPredictionsV01(args);
assert.equal(before.selectivePolicyEvaluation.acceptedCoverage, 0.5);
assert.equal(before.selectivePolicyEvaluation.stateByPrediction.C, undefined);
assert.equal(before.selectivePolicyEvaluation.stateByPrediction.D, undefined);
// Same frozen predictions/policy; only one formerly missing label arrives later.
const afterRows = rows.map(r => r.predictionId === 'D'
  ? {...r, outcome:0, outcomeMaturedAt:'2026-09-08T08:00:00Z', realizedAfterCostValue:-0.02}
  : r);
const after = evaluateBinaryPredictionsV01({...args, records:afterRows});
assert.equal(after.selectivePolicyEvaluation.acceptedCoverage, 2/3);
const frozenDecisionAcceptedCount = rows.filter(r => r.predictedNetUtility > 0).length;
assert.equal(frozenDecisionAcceptedCount, 3);
assert.equal(frozenDecisionAcceptedCount / rows.length, 0.75);
const allImmature = rows.map(r => ({...r, outcome:1,
  outcomeMaturedAt:'2026-10-10T08:00:00Z', realizedAfterCostValue:null}));
const noMatured = evaluateBinaryPredictionsV01({...args, records:allImmature});
assert.equal(noMatured.status, 'NO_MATURED_OUTCOMES');
assert.equal(noMatured.selectivePolicyEvaluation, undefined);

console.log(JSON.stringify({
  schemaVersion:'D16_25_SELECTIVE_DENOMINATOR_FALSIFICATION_V0_1',
  syntheticOnly:true, realTaiwanPIT:false, formalCoreImpact:'NONE',
  finding:'MATURED_SUBSET_COVERAGE_IS_NOT_DECISION_POPULATION_COVERAGE',
  frozenPolicyVersion:policy.policyVersion,
  totalPredictionCount:rows.length, frozenDecisionAcceptedCount,
  decisionPopulationCoverage:0.75,
  before:{maturedCount:before.eligibleMaturedCount, unknownCount:before.unknownOutcomeCount,
    immatureCount:before.immatureCount, reportedMaturedSubsetCoverage:0.5},
  afterOneLabelArrives:{maturedCount:after.eligibleMaturedCount,
    reportedMaturedSubsetCoverage:2/3, frozenDecisionPopulationCoverage:0.75},
  noMatured:{status:noMatured.status, operationalCoverageOmitted:true},
  limitation:'Not a failure of conditional matured-subset metrics; promotion misuse arises if interpreted as operational coverage.',
  evaluatorChanged:false, sizingEligible:false,
}, null, 2));
