import assert from 'node:assert/strict';
import {evaluateTargetFreezeCandidate} from '../research/d02_l4_target_freeze_precondition_guard_v0_1.mjs';

const base=(o={})=>({evidenceKey:'D02-07:SVB20',targetId:'T',targetVersion:'V1',targetKind:'MDE',estimandId:'E',metric:'risk_difference',unit:'percentage_points',direction:'GREATER_THAN_OR_EQUAL',comparatorId:'D_VS_C',outcomeHorizon:'D5',costTreatment:'D14_STRATIFIED',rationaleBasis:'THEORETICAL_BOUND',rationale:'independent decision boundary',outcomeAccessStateAtFreeze:'OUTCOME_CLOSED',frozenBeforeOutcome:true,frozenAt:'2026-10-05T08:00:00+08:00',thresholdValue:1,theoryReceiptId:'THEORY1',boundIndependentOfD02Outcome:true,...o});
assert.equal(evaluateTargetFreezeCandidate(base()).targetFreezeAllowed,true);
assert.ok(evaluateTargetFreezeCandidate(base({rationaleBasis:'CURRENT_D02_PROSPECTIVE_OUTCOME'})).reasons.includes('FORBIDDEN_RATIONALE_BASIS'));
assert.ok(evaluateTargetFreezeCandidate(base({rationaleBasis:'TEST_FIXTURE_VALUE',testFixtureValue:true})).reasons.includes('TEST_FIXTURE_VALUE_FORBIDDEN'));
assert.ok(evaluateTargetFreezeCandidate(base({thresholdValue:null})).reasons.includes('INVALID_THRESHOLD_VALUE'));
assert.ok(evaluateTargetFreezeCandidate(base({outcomeAccessStateAtFreeze:'OUTCOME_OPEN'})).reasons.includes('OUTCOME_ACCESS_NOT_CLOSED'));
assert.ok(evaluateTargetFreezeCandidate(base({frozenBeforeOutcome:false})).reasons.includes('NOT_FROZEN_BEFORE_OUTCOME'));

let x=base({rationaleBasis:'COST_BENEFIT',costReceiptId:null,costQualityPass:false,theoryReceiptId:null,boundIndependentOfD02Outcome:null});
assert.ok(evaluateTargetFreezeCandidate(x).reasons.includes('COST_RECEIPT_REQUIRED'));
assert.ok(evaluateTargetFreezeCandidate({...x,costReceiptId:'D14',costQualityPass:true,unknownCommissionAsZero:true}).reasons.includes('UNKNOWN_COST_ZERO_FORBIDDEN'));
assert.equal(evaluateTargetFreezeCandidate({...x,costReceiptId:'D14',costQualityPass:true,unknownCommissionAsZero:false,unknownSlippageAsZero:false}).targetFreezeAllowed,true);

x=base({rationaleBasis:'PRIOR_INDEPENDENT_EVIDENCE',planningDataReceiptId:null,planningDataHash:null,planningDataFrozenAt:null,disjointFromPromotionEvidence:false,planningEvidenceRole:'EVIDENCE',theoryReceiptId:null,boundIndependentOfD02Outcome:null});
let q=evaluateTargetFreezeCandidate(x);assert.ok(q.reasons.includes('PLANNING_DATA_RECEIPT_REQUIRED'));assert.ok(q.reasons.includes('PLANNING_DATA_NOT_DISJOINT'));
assert.equal(evaluateTargetFreezeCandidate({...x,planningDataReceiptId:'P',planningDataHash:'H',planningDataFrozenAt:'2026-10-05T07:00:00+08:00',disjointFromPromotionEvidence:true,planningEvidenceRole:'PLANNING_ONLY'}).targetFreezeAllowed,true);

x=base({targetKind:'PRECISION_TARGET',thresholdValue:null,maxHalfWidth:2,rationaleBasis:'PRECISION_REQUIREMENT',decisionConsequence:'uncertainty wider than this cannot resolve the action',theoryReceiptId:null,boundIndependentOfD02Outcome:null});
assert.equal(evaluateTargetFreezeCandidate(x).targetFreezeAllowed,true);
assert.ok(evaluateTargetFreezeCandidate({...x,decisionConsequence:''}).reasons.includes('PRECISION_DECISION_CONSEQUENCE_MISSING'));

x=base({evidenceKey:'D02-01:SEMANTIC_GOVERNANCE',targetKind:'SEMANTIC_MATERIALITY_TARGET',rationaleBasis:'SEMANTIC_POLICY',thresholdValue:1,theoryReceiptId:null,boundIndependentOfD02Outcome:null});
assert.equal(evaluateTargetFreezeCandidate(x).targetFreezeAllowed,true);
assert.ok(evaluateTargetFreezeCandidate({...x,rationaleBasis:'THEORETICAL_BOUND',theoryReceiptId:'T',boundIndependentOfD02Outcome:true}).reasons.includes('SEMANTIC_TARGET_REQUIRES_SEMANTIC_POLICY'));

for(const key of ['D02-02:H001','D02-03:H20','D02-06:H003']){
 const w=base({evidenceKey:key,primaryShellMatch:true,metricRuleFrozen:true,horizonRuleFrozen:true});
 assert.equal(evaluateTargetFreezeCandidate(w).targetFreezeAllowed,true);
 assert.ok(evaluateTargetFreezeCandidate({...w,metricRuleFrozen:false}).reasons.includes('WAVE1_METRIC_RULE_NOT_FROZEN'));
 assert.ok(evaluateTargetFreezeCandidate({...w,horizonRuleFrozen:false}).reasons.includes('WAVE1_HORIZON_RULE_NOT_FROZEN'));
}

assert.ok(evaluateTargetFreezeCandidate(base({borrowedFromEvidenceKey:'D02-09:PIVOT_SIGNED_VOLUME'})).reasons.includes('CROSS_KEY_TARGET_BORROWING_FORBIDDEN'));
assert.ok(evaluateTargetFreezeCandidate(base({metric:''})).reasons.includes('MISSING_METRIC'));
assert.ok(evaluateTargetFreezeCandidate(base({comparatorId:''})).reasons.includes('MISSING_COMPARATOR'));
assert.ok(evaluateTargetFreezeCandidate(base({outcomeHorizon:''})).reasons.includes('MISSING_OUTCOME_HORIZON'));

console.log(JSON.stringify({status:'PASS',tests:24,contract:'D02_L4_TARGET_FREEZE_PRECONDITION_V0_1'}));
