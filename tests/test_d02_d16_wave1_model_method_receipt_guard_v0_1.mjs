import assert from 'node:assert/strict';
import {evaluateWave1MethodReceipt} from '../research/d02_d16_wave1_model_method_receipt_guard_v0_1.mjs';

const hz={
 'D02-02:H001':'B2',
 'D02-03:H20':'B2',
 'D02-06:H003':'ACTIVE_LIFECYCLE_ENTRY_TO_FIRST_TERMINAL_OR_13_00_CENSOR'
};
const out={
 'D02-02:H001':'STRUCTURAL_FAILURE_NO_FOLLOW_THROUGH_B2',
 'D02-03:H20':'D01_OWNED_BREAKOUT_STRUCTURAL_FAILURE_NO_FOLLOW_THROUGH_B2',
 'D02-06:H003':'CLEAN_ACTIVE_ACCEPTANCE_LIFECYCLE_TERMINAL_FAILURE'
};
const base=(key='D02-02:H001',o={})=>({
 owner:'D16-19',methodReceiptId:'MR1',methodVersion:'M1',evidenceKey:key,experimentVersion:'EXP1',
 primaryMetric:'DATE_BALANCED_BRIER_LOSS_IMPROVEMENT',outcomeId:out[key],outcomeHorizon:hz[key],
 baselineFeatureSetId:'BASE',challengerFeatureSetId:'CHAL',estimatorFamily:'FIXTURE_ESTIMATOR',
 calibrationMethod:'FIXTURE_CALIBRATOR',preprocessingVersion:'P1',featureSelectionPolicy:'FROZEN_NONE',
 regularizationPolicy:'FROZEN_POLICY',trainingWindowPolicy:'FORWARD_ONLY',validationPartitionPolicy:'DATE_BLOCKED',
 calibrationPartitionPolicy:'SEPARATE_DATE_BLOCK',refitPolicy:'FROZEN',randomSeedPolicy:'DETERMINISTIC',
 missingValuePolicy:'FAIL_CLOSED',classImbalancePolicy:'FROZEN',modelSearchFamilyId:'MSF1',candidateMethodCount:1,
 multipleTestingFamilyId:'F1',frozenAt:'2026-10-05T14:00:00+08:00',outcomeAccessStateAtFreeze:'OUTCOME_CLOSED',
 methodHash:'FIXTURE_HASH',status:'FROZEN',equalDateWeighting:true,identicalCommonSupport:true,identicalPartitions:true,
 baselineChallengerSameMethodFamily:true,predictionsFrozenBeforeLabels:true,postOutcomeMethodSelectionAllowed:false,
 unregisteredMethodFamilySearch:false,...o
});
for(const k of Object.keys(hz))assert.equal(evaluateWave1MethodReceipt(base(k)).pass,true);
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{owner:'D02'})).reasons.includes('D16_19_OWNER_REQUIRED'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{primaryMetric:'AUC'})).reasons.includes('PRIMARY_METRIC_MISMATCH'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{outcomeHorizon:'B1'})).reasons.includes('OUTCOME_HORIZON_MISMATCH'));
assert.ok(evaluateWave1MethodReceipt(base('D02-03:H20',{outcomeId:'OTHER'})).reasons.includes('OUTCOME_ID_MISMATCH'));
assert.ok(evaluateWave1MethodReceipt(base('D02-06:H003',{outcomeHorizon:'B2'})).reasons.includes('OUTCOME_HORIZON_MISMATCH'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{equalDateWeighting:false})).reasons.includes('EQUAL_DATE_WEIGHTING_REQUIRED'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{identicalCommonSupport:false})).reasons.includes('IDENTICAL_COMMON_SUPPORT_REQUIRED'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{identicalPartitions:false})).reasons.includes('IDENTICAL_PARTITIONS_REQUIRED'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{baselineChallengerSameMethodFamily:false})).reasons.includes('SAME_METHOD_FAMILY_REQUIRED_FOR_FEATURE_INCREMENT'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{predictionsFrozenBeforeLabels:false})).reasons.includes('PREDICTIONS_MUST_BE_FROZEN_BEFORE_LABELS'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{outcomeAccessStateAtFreeze:'OUTCOME_OPEN'})).reasons.includes('METHOD_FROZEN_AFTER_OUTCOME_ACCESS'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{status:'DRAFT'})).reasons.includes('METHOD_STATUS_NOT_FROZEN'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{candidateMethodCount:0})).reasons.includes('CANDIDATE_METHOD_COUNT_INVALID'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{postOutcomeMethodSelectionAllowed:true})).reasons.includes('POST_OUTCOME_METHOD_SELECTION_FORBIDDEN'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{unregisteredMethodFamilySearch:true})).reasons.includes('UNREGISTERED_METHOD_SEARCH_FORBIDDEN'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{frozenAt:'bad'})).reasons.includes('FROZEN_AT_INVALID'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{calibrationMethod:''})).reasons.includes('CALIBRATION_METHOD_MISSING'));
assert.ok(evaluateWave1MethodReceipt(base('D02-02:H001',{modelSearchFamilyId:''})).reasons.includes('MODEL_SEARCH_FAMILY_ID_MISSING'));
assert.equal(evaluateWave1MethodReceipt(base()).maturityPromotionAuthorized,false);
assert.equal(evaluateWave1MethodReceipt(base()).formalCoreChangeAuthorized,false);
console.log(JSON.stringify({status:'PASS',tests:21,contract:'D02_D16_WAVE1_METHOD_GUARD_V0_1'}));
