const nonempty=v=>typeof v==='string'&&v.trim().length>0;
const finite=v=>Number.isFinite(Number(v));
const uniq=a=>[...new Set(a)];
const ok=(x={})=>({pass:true,reasons:[],...x});
const no=(r,x={})=>({pass:false,reasons:uniq(r),...x});
export const D02_L4_TARGET_FREEZE_PRECONDITION_VERSION='D02_L4_TARGET_FREEZE_PRECONDITION_V0_1';
export const ALLOWED_BASES=new Set(['COST_BENEFIT','THEORETICAL_BOUND','PRIOR_INDEPENDENT_EVIDENCE','PRECISION_REQUIREMENT','SEMANTIC_POLICY']);
export const FORBIDDEN_BASES=new Set(['CURRENT_D02_PROSPECTIVE_OUTCOME','POST_OUTCOME_WINNER_SELECTION','BEST_HORIZON_AFTER_RESULTS','BEST_METRIC_AFTER_RESULTS','TEST_FIXTURE_VALUE','GENERIC_BENCHMARK_WITHOUT_JUSTIFICATION','UNKNOWN_COST_AS_ZERO','ANOTHER_EVIDENCE_KEY_TARGET']);

export function evaluateTargetFreezeCandidate(x={}){
 const r=[];
 if(!nonempty(x.evidenceKey)) r.push('MISSING_EVIDENCE_KEY');
 if(!nonempty(x.targetId)) r.push('MISSING_TARGET_ID');
 if(!nonempty(x.targetVersion)) r.push('MISSING_TARGET_VERSION');
 if(!nonempty(x.estimandId)) r.push('MISSING_ESTIMAND_ID');
 if(!nonempty(x.metric)) r.push('MISSING_METRIC');
 if(!nonempty(x.unit)) r.push('MISSING_UNIT');
 if(!nonempty(x.direction)) r.push('MISSING_DIRECTION');
 if(!nonempty(x.comparatorId)) r.push('MISSING_COMPARATOR');
 if(!nonempty(x.outcomeHorizon)) r.push('MISSING_OUTCOME_HORIZON');
 if(!nonempty(x.costTreatment)) r.push('MISSING_COST_TREATMENT');
 if(!nonempty(x.rationaleBasis)) r.push('MISSING_RATIONALE_BASIS');
 if(FORBIDDEN_BASES.has(x.rationaleBasis)) r.push('FORBIDDEN_RATIONALE_BASIS');
 if(!ALLOWED_BASES.has(x.rationaleBasis)) r.push('RATIONALE_BASIS_NOT_ALLOWED');
 if(!nonempty(x.rationale)) r.push('MISSING_RATIONALE');
 if(x.outcomeAccessStateAtFreeze!=='OUTCOME_CLOSED') r.push('OUTCOME_ACCESS_NOT_CLOSED');
 if(x.frozenBeforeOutcome!==true) r.push('NOT_FROZEN_BEFORE_OUTCOME');
 if(!nonempty(x.frozenAt)||!Number.isFinite(Date.parse(x.frozenAt))) r.push('INVALID_FROZEN_AT');
 if(x.targetKind==='PRECISION_TARGET'){
   if(!finite(x.maxHalfWidth)||Number(x.maxHalfWidth)<=0) r.push('INVALID_PRECISION_HALF_WIDTH');
 } else {
   if(!finite(x.thresholdValue)||Number(x.thresholdValue)<=0) r.push('INVALID_THRESHOLD_VALUE');
 }
 if(x.targetKind==='SEMANTIC_MATERIALITY_TARGET' && x.rationaleBasis!=='SEMANTIC_POLICY') r.push('SEMANTIC_TARGET_REQUIRES_SEMANTIC_POLICY');
 if(x.rationaleBasis==='SEMANTIC_POLICY' && x.targetKind!=='SEMANTIC_MATERIALITY_TARGET') r.push('SEMANTIC_POLICY_ONLY_FOR_SEMANTIC_TARGET');

 if(x.rationaleBasis==='COST_BENEFIT'){
   if(!nonempty(x.costReceiptId)) r.push('COST_RECEIPT_REQUIRED');
   if(x.costQualityPass!==true) r.push('COST_QUALITY_NOT_PASS');
   if(x.unknownCommissionAsZero===true||x.unknownSlippageAsZero===true) r.push('UNKNOWN_COST_ZERO_FORBIDDEN');
 }
 if(x.rationaleBasis==='PRIOR_INDEPENDENT_EVIDENCE'){
   if(!nonempty(x.planningDataReceiptId)) r.push('PLANNING_DATA_RECEIPT_REQUIRED');
   if(!nonempty(x.planningDataHash)) r.push('PLANNING_DATA_HASH_REQUIRED');
   if(!nonempty(x.planningDataFrozenAt)||!Number.isFinite(Date.parse(x.planningDataFrozenAt))) r.push('PLANNING_DATA_FREEZE_CLOCK_INVALID');
   if(x.disjointFromPromotionEvidence!==true) r.push('PLANNING_DATA_NOT_DISJOINT');
   if(x.planningEvidenceRole!=='PLANNING_ONLY') r.push('PLANNING_EVIDENCE_ROLE_INVALID');
 }
 if(x.rationaleBasis==='PRECISION_REQUIREMENT'){
   if(x.targetKind!=='PRECISION_TARGET') r.push('PRECISION_BASIS_REQUIRES_PRECISION_TARGET');
   if(!nonempty(x.decisionConsequence)) r.push('PRECISION_DECISION_CONSEQUENCE_MISSING');
 }
 if(x.rationaleBasis==='THEORETICAL_BOUND'){
   if(!nonempty(x.theoryReceiptId)) r.push('THEORY_RECEIPT_REQUIRED');
   if(x.boundIndependentOfD02Outcome!==true) r.push('THEORY_BOUND_NOT_OUTCOME_INDEPENDENT');
 }

 if(['D02-02:H001','D02-03:H20','D02-06:H003'].includes(x.evidenceKey)){
   if(x.primaryShellMatch!==true) r.push('WAVE1_PRIMARY_SHELL_MISMATCH');
   if(x.metricRuleFrozen!==true) r.push('WAVE1_METRIC_RULE_NOT_FROZEN');
   if(x.horizonRuleFrozen!==true) r.push('WAVE1_HORIZON_RULE_NOT_FROZEN');
 }
 if(x.borrowedFromEvidenceKey && x.borrowedFromEvidenceKey!==x.evidenceKey) r.push('CROSS_KEY_TARGET_BORROWING_FORBIDDEN');
 if(x.testFixtureValue===true) r.push('TEST_FIXTURE_VALUE_FORBIDDEN');

 return r.length?no(r,{targetFreezeAllowed:false}):ok({targetFreezeAllowed:true,promotionGradeOutcomeAccessAuthorized:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false});
}