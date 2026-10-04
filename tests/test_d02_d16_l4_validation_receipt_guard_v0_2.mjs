import assert from 'node:assert/strict';
import {evaluateD16Receipt,evaluateD16ReceiptSet} from '../research/d02_d16_l4_validation_receipt_guard_v0_2.mjs';

let id=0;
const familyFor=key=>key.startsWith('D02-01')?'F0':key.startsWith('D02-02')||key.startsWith('D02-03')||key.startsWith('D02-04')?'F1':key.startsWith('D02-05')||key.startsWith('D02-06')?'F2':key.startsWith('D02-07')||key.startsWith('D02-09')?'F3':key.startsWith('D02-08')?'F4':'F5';
const admissionFor=key=>key.startsWith('D02-01')?'D02_01_L4_SEMANTIC_ADMISSION_V0_1':(key.startsWith('D02-02')||key.startsWith('D02-03')||key.startsWith('D02-06'))?'D02_L4_WAVE1_GATE_V0_1_1':'D02_L4_WAVE2_ADMISSION_V0_1';
const target=(key,kind=(key.startsWith('D02-01')?'SEMANTIC_MATERIALITY_TARGET':'MDE'),over={})=>({
  targetId:`FIXTURE_TARGET:${key}`,
  targetVersion:'FIXTURE_TARGET_V0_1',
  kind,
  estimandId:`FIXTURE_ESTIMAND:${key}`,
  metric:key.startsWith('D02-01')?'fixture_classification_delta_share':'fixture_incremental_net_bps',
  unit:key.startsWith('D02-01')?'fixture_share':'fixture_bps',
  direction:kind==='PRECISION_TARGET'?'TWO_SIDED_PRECISION':'GREATER_THAN_OR_EQUAL',
  thresholdValue:kind==='PRECISION_TARGET'?null:1,
  maxHalfWidth:kind==='PRECISION_TARGET'?1:null,
  comparatorId:'FIXTURE_COMPARATOR',
  outcomeHorizon:'FIXTURE_D1',
  costTreatment:'FIXTURE_IDENTICAL_COSTS',
  frozenAt:'2026-10-04T20:00:00+08:00',
  frozenBeforeOutcome:true,
  outcomeAccessStateAtFreeze:'OUTCOME_CLOSED',
  targetHash:`FIXTURE_HASH:${key}`,
  rationale:'TEST_FIXTURE_ONLY_NOT_A_RESEARCH_THRESHOLD',
  status:'FROZEN',
  ...over
});
const expected=(key='D02-02:H001',experimentVersion=null,over={})=>{
  const t=target(key);
  return {
    evidenceKey:key,
    ...(experimentVersion?{experimentVersion}:{}),
    effectTargetId:t.targetId,
    effectTargetVersion:t.targetVersion,
    effectTargetHash:t.targetHash,
    ...over
  };
};
const base=(key='D02-02:H001',over={})=>({
  owner:'D16',
  receiptId:`R${++id}`,
  evidenceKey:key,
  multipleTestingFamilyId:familyFor(key),
  admissionVersion:admissionFor(key),
  experimentVersion:key==='D02-02:H001'?'H001_W1_V0_1':'FIXTURE_EXPERIMENT_V0_1',
  outcomeContractVersion:'D1_V0_1',
  commonSupportCount:120,
  independentScanDateCount:35,
  independentSymbolCount:6,
  dateDependenceMethod:'DATE_CLUSTER_ROBUST',
  smallClusterTreatment:'FINITE_SAMPLE_REVIEW',
  overlapControl:'PURGED_FORWARD_HOLDOUT',
  purgeResult:'PASS',
  coverageMissingnessSummary:{unknownShare:0.01},
  effectTarget:target(key),
  sampleAdequacyStatus:'ADEQUATE',
  d16MethodFrozen:true,
  dependenceAssessmentPass:true,
  effectiveSampleReport:{rowN:120,independentDateN:35},
  multipleTestingReviewPass:true,
  concentrationReviewPass:true,
  costLiquidityReviewPass:true,
  resultStatus:key.startsWith('D02-01')?'SEMANTIC_GOVERNANCE_CANDIDATE':'VALIDATION_PASS_CANDIDATE',
  ...over
});

assert.equal(evaluateD16Receipt(base(),expected('D02-02:H001','H001_W1_V0_1')).promotionReviewEligible,true);
assert.ok(evaluateD16Receipt(base('D02-02:H001',{owner:'D02'}),expected('D02-02:H001')).reasons.includes('D16_OWNER_REQUIRED'));
assert.ok(evaluateD16Receipt(base(),expected('D02-03:H20')).reasons.includes('EVIDENCE_KEY_MISMATCH'));
assert.equal(evaluateD16Receipt(base('D02-03:H20'),expected('D02-03:H20')).pass,true);
assert.ok(evaluateD16Receipt(base('D02-03:H20',{multipleTestingFamilyId:'F2'}),expected('D02-03:H20')).reasons.includes('MULTIPLE_TESTING_FAMILY_MISMATCH'));
assert.ok(evaluateD16Receipt(base(),expected('D02-02:H001','OTHER')).reasons.includes('EXPERIMENT_VERSION_MISMATCH'));

assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectTarget:null}),expected('D02-02:H001')).reasons.includes('EFFECT_OR_PRECISION_TARGET_MISSING'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectTarget:target('D02-02:H001','MDE',{frozenBeforeOutcome:false})}),expected('D02-02:H001')).reasons.includes('EFFECT_TARGET_NOT_FROZEN_BEFORE_OUTCOME'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectTarget:target('D02-02:H001','MDE',{outcomeAccessStateAtFreeze:'OUTCOME_OPEN'})}),expected('D02-02:H001')).reasons.includes('EFFECT_TARGET_FROZEN_AFTER_OUTCOME_ACCESS'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectTarget:target('D02-02:H001','MDE',{status:'DRAFT'})}),expected('D02-02:H001')).reasons.includes('EFFECT_TARGET_STATUS_NOT_FROZEN'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectTarget:target('D02-02:H001','MDE',{targetId:''})}),expected('D02-02:H001')).reasons.includes('EFFECT_TARGET_ID_MISSING'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectTarget:target('D02-02:H001','MDE',{metric:''})}),expected('D02-02:H001')).reasons.includes('EFFECT_METRIC_MISSING'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectTarget:target('D02-02:H001','MDE',{comparatorId:''})}),expected('D02-02:H001')).reasons.includes('EFFECT_COMPARATOR_ID_MISSING'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectTarget:target('D02-02:H001','MDE',{thresholdValue:null})}),expected('D02-02:H001')).reasons.includes('EFFECT_TARGET_THRESHOLD_INVALID'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectTarget:target('D02-02:H001','MDE',{thresholdValue:0})}),expected('D02-02:H001')).reasons.includes('EFFECT_TARGET_THRESHOLD_INVALID'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectTarget:target('D02-02:H001','MDE',{frozenAt:'bad-time'})}),expected('D02-02:H001')).reasons.includes('EFFECT_TARGET_FROZEN_AT_INVALID'));

const precision=target('D02-02:H001','PRECISION_TARGET');
assert.equal(evaluateD16Receipt(base('D02-02:H001',{effectTarget:precision}),expected('D02-02:H001')).pass,true);
assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectTarget:target('D02-02:H001','PRECISION_TARGET',{direction:'GREATER_THAN_OR_EQUAL'})}),expected('D02-02:H001')).reasons.includes('PRECISION_TARGET_DIRECTION_INVALID'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectTarget:target('D02-02:H001','PRECISION_TARGET',{maxHalfWidth:null})}),expected('D02-02:H001')).reasons.includes('PRECISION_TARGET_MAX_HALF_WIDTH_INVALID'));

assert.ok(evaluateD16Receipt(base(),{evidenceKey:'D02-02:H001'}).reasons.includes('EXPECTED_EFFECT_TARGET_BINDING_MISSING'));
assert.ok(evaluateD16Receipt(base(),expected('D02-02:H001',null,{effectTargetId:'OTHER'})).reasons.includes('EFFECT_TARGET_ID_MISMATCH'));
assert.ok(evaluateD16Receipt(base(),expected('D02-02:H001',null,{effectTargetVersion:'OTHER'})).reasons.includes('EFFECT_TARGET_VERSION_MISMATCH'));
assert.ok(evaluateD16Receipt(base(),expected('D02-02:H001',null,{effectTargetHash:'OTHER'})).reasons.includes('EFFECT_TARGET_HASH_MISMATCH'));

assert.ok(evaluateD16Receipt(base('D02-02:H001',{independentScanDateCount:0}),expected('D02-02:H001')).reasons.includes('INDEPENDENT_DATE_COUNT_INVALID'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{dateDependenceMethod:''}),expected('D02-02:H001')).reasons.includes('DATE_DEPENDENCE_METHOD_MISSING'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{overlapControl:''}),expected('D02-02:H001')).reasons.includes('OVERLAP_CONTROL_MISSING'));

const insufficient=base('D02-02:H001',{sampleAdequacyStatus:'INSUFFICIENT',resultStatus:'INSUFFICIENT_EVIDENCE'});
assert.equal(evaluateD16Receipt(insufficient,{evidenceKey:'D02-02:H001'}).promotionReviewEligible,false);

assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectiveSampleReport:null}),expected('D02-02:H001')).reasons.includes('EFFECTIVE_SAMPLE_REPORT_MISSING'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{multipleTestingReviewPass:false}),expected('D02-02:H001')).reasons.includes('MULTIPLE_TESTING_REVIEW_NOT_PASS'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{concentrationReviewPass:false}),expected('D02-02:H001')).reasons.includes('CONCENTRATION_REVIEW_NOT_PASS'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{costLiquidityReviewPass:false}),expected('D02-02:H001')).reasons.includes('COST_LIQUIDITY_REVIEW_NOT_PASS'));

const sem=base('D02-01:SEMANTIC_GOVERNANCE',{costLiquidityReviewPass:false});
assert.equal(evaluateD16Receipt(sem,expected('D02-01:SEMANTIC_GOVERNANCE')).promotionReviewEligible,true);
assert.ok(evaluateD16Receipt(base('D02-01:SEMANTIC_GOVERNANCE',{effectTarget:target('D02-01:SEMANTIC_GOVERNANCE','MDE')}),expected('D02-01:SEMANTIC_GOVERNANCE')).reasons.includes('SEMANTIC_TARGET_KIND_MISMATCH'));
assert.ok(evaluateD16Receipt(base('D02-02:H001',{effectTarget:target('D02-02:H001','SEMANTIC_MATERIALITY_TARGET')}),expected('D02-02:H001')).reasons.includes('ECONOMIC_TARGET_KIND_MISMATCH'));
assert.ok(evaluateD16Receipt({...sem,resultStatus:'VALIDATION_PASS_CANDIDATE'},expected('D02-01:SEMANTIC_GOVERNANCE')).reasons.includes('SEMANTIC_MODULE_WRONG_CANDIDATE_STATUS'));

const p=base('D02-09:PIVOT_SIGNED_VOLUME');
assert.equal(evaluateD16Receipt(p,expected('D02-09:PIVOT_SIGNED_VOLUME')).pass,true);
assert.ok(evaluateD16Receipt(p,expected('D02-09:PARTICIPATION_TRAJECTORY')).reasons.includes('EVIDENCE_KEY_MISMATCH'));

const prof=base('D02-12:PRICE_BY_VOLUME_PROFILE');
assert.equal(evaluateD16Receipt(prof,expected('D02-12:PRICE_BY_VOLUME_PROFILE')).pass,true);
assert.ok(evaluateD16Receipt(prof,expected('D02-12:TIME_OF_DAY_VOLUME_CURVE')).reasons.includes('EVIDENCE_KEY_MISMATCH'));

const neg=base('D02-07:SVB20',{sampleAdequacyStatus:'ADEQUATE',resultStatus:'NO_INCREMENTAL_VALUE'});
assert.equal(evaluateD16Receipt(neg,expected('D02-07:SVB20')).pass,true);
assert.equal(evaluateD16Receipt(neg,expected('D02-07:SVB20')).promotionReviewEligible,false);

let a=base();
let set=evaluateD16ReceiptSet([a,{...a}],{[a.evidenceKey]:expected(a.evidenceKey)});
assert.equal(set.fatalIntegrity,true);
assert.ok(set.duplicateReceiptIds.includes(a.receiptId));

a=base();
set=evaluateD16ReceiptSet([a,{...a,evidenceKey:'D02-03:H20'}],{
  'D02-02:H001':expected('D02-02:H001'),
  'D02-03:H20':expected('D02-03:H20')
});
assert.equal(set.fatalIntegrity,true);
assert.ok(set.crossEvidenceKeyReceiptReuse.includes(a.receiptId));

const h=base('D02-02:H001'),b=base('D02-03:H20');
set=evaluateD16ReceiptSet([h,b],{
  'D02-02:H001':expected('D02-02:H001'),
  'D02-03:H20':expected('D02-03:H20')
});
assert.equal(set.crossModuleSampleBorrowingAllowed,false);
assert.equal(set.maturityPromotionAuthorized,false);
assert.equal(set.formalCoreChangeAuthorized,false);

console.log(JSON.stringify({status:'PASS',tests:39,contract:'D02_D16_L4_RECEIPT_GUARD_V0_2',fixtureTargetsAreResearchThresholds:false}));
