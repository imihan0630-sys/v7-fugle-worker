const finite=v=>Number.isFinite(Number(v)), nonempty=v=>typeof v==='string'&&v.trim().length>0, uniq=xs=>[...new Set(xs)];
const pass=(x={})=>({pass:true,reasons:[],...x}), fail=(r,x={})=>({pass:false,reasons:uniq(r),...x});
export const D02_D16_L4_RECEIPT_GUARD_VERSION='D02_D16_L4_RECEIPT_GUARD_V0_2';
export const D02_EVIDENCE_REGISTRY={
'D02-01:SEMANTIC_GOVERNANCE':{family:'F0',kind:'SEMANTIC',admission:'D02_01_L4_SEMANTIC_ADMISSION_V0_1'},
'D02-02:H001':{family:'F1',kind:'ECONOMIC',admission:'D02_L4_WAVE1_GATE_V0_1_1'},
'D02-03:H20':{family:'F1',kind:'ECONOMIC',admission:'D02_L4_WAVE1_GATE_V0_1_1'},
'D02-04:DRYUP':{family:'F1',kind:'ECONOMIC',admission:'D02_L4_WAVE2_ADMISSION_V0_1'},
'D02-05:EXTREME_PARTICIPATION':{family:'F2',kind:'ECONOMIC',admission:'D02_L4_WAVE2_ADMISSION_V0_1'},
'D02-06:H003':{family:'F2',kind:'ECONOMIC',admission:'D02_L4_WAVE1_GATE_V0_1_1'},
'D02-07:SVB20':{family:'F3',kind:'ECONOMIC',admission:'D02_L4_WAVE2_ADMISSION_V0_1'},
'D02-08:PROVIDER_PRESSURE':{family:'F4',kind:'ECONOMIC',admission:'D02_L4_WAVE2_ADMISSION_V0_1'},
'D02-09:PIVOT_SIGNED_VOLUME':{family:'F3',kind:'ECONOMIC',admission:'D02_L4_WAVE2_ADMISSION_V0_1'},
'D02-09:PARTICIPATION_TRAJECTORY':{family:'F3',kind:'ECONOMIC',admission:'D02_L4_WAVE2_ADMISSION_V0_1'},
'D02-10:TREND_VOLUME_INTERACTION':{family:'F5',kind:'ECONOMIC',admission:'D02_L4_WAVE2_ADMISSION_V0_1'},
'D02-11:LIQUIDITY_COUNTERFACTUAL':{family:'F5',kind:'ECONOMIC',admission:'D02_L4_WAVE2_ADMISSION_V0_1'},
'D02-12:TIME_OF_DAY_VOLUME_CURVE':{family:'F5',kind:'ECONOMIC',admission:'D02_L4_WAVE2_ADMISSION_V0_1'},
'D02-12:PRICE_BY_VOLUME_PROFILE':{family:'F5',kind:'ECONOMIC',admission:'D02_L4_WAVE2_ADMISSION_V0_1'}};
const candidates=new Set(['VALIDATION_PASS_CANDIDATE','SEMANTIC_GOVERNANCE_CANDIDATE']);
const statuses=new Set(['WAITING_METHOD_OWNER','WAITING_DATA','DATA_QUALITY_BLOCKED','ACCUMULATING','INSUFFICIENT_EVIDENCE','NO_INCREMENTAL_VALUE','REDUNDANT','FRAGILE_DATE_DEPENDENCE','OUTCOME_WINDOW_DEPENDENCE','REGIME_OR_INDUSTRY_CONCENTRATED','COST_FRAGILE',...candidates]);
export function evaluateD16Receipt(x={},expected={}){
 const r=[], key=String(expected.evidenceKey||x.evidenceKey||''), reg=D02_EVIDENCE_REGISTRY[key];
 if(!reg)r.push('UNKNOWN_D02_EVIDENCE_KEY'); if(x.owner!=='D16')r.push('D16_OWNER_REQUIRED'); if(x.evidenceKey!==key)r.push('EVIDENCE_KEY_MISMATCH');
 if(reg&&x.multipleTestingFamilyId!==reg.family)r.push('MULTIPLE_TESTING_FAMILY_MISMATCH'); if(reg&&x.admissionVersion!==reg.admission)r.push('ADMISSION_VERSION_MISMATCH');
 if(nonempty(expected.experimentVersion)&&x.experimentVersion!==expected.experimentVersion)r.push('EXPERIMENT_VERSION_MISMATCH');
 if(!nonempty(x.receiptId))r.push('MISSING_RECEIPT_ID'); if(!nonempty(x.outcomeContractVersion))r.push('MISSING_OUTCOME_CONTRACT_VERSION');
 if(!finite(x.commonSupportCount)||Number(x.commonSupportCount)<1)r.push('COMMON_SUPPORT_COUNT_INVALID');
 if(!finite(x.independentScanDateCount)||Number(x.independentScanDateCount)<1)r.push('INDEPENDENT_DATE_COUNT_INVALID');
 if(!finite(x.independentSymbolCount)||Number(x.independentSymbolCount)<1)r.push('INDEPENDENT_SYMBOL_COUNT_INVALID');
 if(!nonempty(x.dateDependenceMethod))r.push('DATE_DEPENDENCE_METHOD_MISSING'); if(!nonempty(x.smallClusterTreatment))r.push('SMALL_CLUSTER_TREATMENT_MISSING');
 if(!nonempty(x.overlapControl))r.push('OVERLAP_CONTROL_MISSING'); if(x.purgeResult!=='PASS')r.push('PURGE_RESULT_NOT_PASS');
 if(!x.coverageMissingnessSummary||typeof x.coverageMissingnessSummary!=='object')r.push('COVERAGE_MISSINGNESS_SUMMARY_MISSING');
 if(!x.effectTarget||typeof x.effectTarget!=='object')r.push('EFFECT_OR_PRECISION_TARGET_MISSING'); else {
  const et=x.effectTarget;
  if(!['MDE','PRECISION_TARGET','SEMANTIC_MATERIALITY_TARGET'].includes(et.kind))r.push('EFFECT_TARGET_KIND_INVALID');
  if(et.frozenBeforeOutcome!==true)r.push('EFFECT_TARGET_NOT_FROZEN_BEFORE_OUTCOME');
  if(et.outcomeAccessStateAtFreeze!=='OUTCOME_CLOSED')r.push('EFFECT_TARGET_FROZEN_AFTER_OUTCOME_ACCESS');
  if(et.status!=='FROZEN')r.push('EFFECT_TARGET_STATUS_NOT_FROZEN');
  for(const [name,val] of [['TARGET_ID',et.targetId],['TARGET_VERSION',et.targetVersion],['ESTIMAND_ID',et.estimandId],['METRIC',et.metric],['UNIT',et.unit],['DIRECTION',et.direction],['COMPARATOR_ID',et.comparatorId],['OUTCOME_HORIZON',et.outcomeHorizon],['COST_TREATMENT',et.costTreatment],['FROZEN_AT',et.frozenAt],['TARGET_HASH',et.targetHash],['RATIONALE',et.rationale]]) if(!nonempty(val))r.push('EFFECT_'+name+'_MISSING');
  const frozenMs=Number.isFinite(Date.parse(et.frozenAt))?Date.parse(et.frozenAt):null;
  if(frozenMs===null)r.push('EFFECT_TARGET_FROZEN_AT_INVALID');
  const dir=new Set(['GREATER_THAN_OR_EQUAL','LESS_THAN_OR_EQUAL','TWO_SIDED_ABSOLUTE']);
  if(et.kind==='PRECISION_TARGET'){
    if(et.direction!=='TWO_SIDED_PRECISION')r.push('PRECISION_TARGET_DIRECTION_INVALID');
    if(!finite(et.maxHalfWidth)||Number(et.maxHalfWidth)<=0)r.push('PRECISION_TARGET_MAX_HALF_WIDTH_INVALID');
  } else {
    if(!dir.has(et.direction))r.push('EFFECT_TARGET_DIRECTION_INVALID');
    if(!finite(et.thresholdValue)||Number(et.thresholdValue)<=0)r.push('EFFECT_TARGET_THRESHOLD_INVALID');
  }
  if(reg?.kind==='SEMANTIC'&&et.kind!=='SEMANTIC_MATERIALITY_TARGET')r.push('SEMANTIC_TARGET_KIND_MISMATCH');
  if(reg?.kind==='ECONOMIC'&&et.kind==='SEMANTIC_MATERIALITY_TARGET')r.push('ECONOMIC_TARGET_KIND_MISMATCH');
  const bindingRequired=x.sampleAdequacyStatus==='ADEQUATE'||candidates.has(x.resultStatus);
  if(bindingRequired){
    if(!nonempty(expected.effectTargetId)||!nonempty(expected.effectTargetVersion)||!nonempty(expected.effectTargetHash))r.push('EXPECTED_EFFECT_TARGET_BINDING_MISSING');
    else {
      if(et.targetId!==expected.effectTargetId)r.push('EFFECT_TARGET_ID_MISMATCH');
      if(et.targetVersion!==expected.effectTargetVersion)r.push('EFFECT_TARGET_VERSION_MISMATCH');
      if(et.targetHash!==expected.effectTargetHash)r.push('EFFECT_TARGET_HASH_MISMATCH');
    }
  }
 }
 if(!['NOT_ASSESSED','INSUFFICIENT','ADEQUATE'].includes(x.sampleAdequacyStatus))r.push('SAMPLE_ADEQUACY_STATUS_INVALID');
 if(x.sampleAdequacyStatus==='ADEQUATE'){
  if(x.d16MethodFrozen!==true)r.push('D16_METHOD_NOT_FROZEN'); if(x.dependenceAssessmentPass!==true)r.push('DEPENDENCE_ASSESSMENT_NOT_PASS');
  if(!x.effectiveSampleReport||typeof x.effectiveSampleReport!=='object')r.push('EFFECTIVE_SAMPLE_REPORT_MISSING');
  if(x.multipleTestingReviewPass!==true)r.push('MULTIPLE_TESTING_REVIEW_NOT_PASS'); if(x.concentrationReviewPass!==true)r.push('CONCENTRATION_REVIEW_NOT_PASS');
 }
 if(!statuses.has(x.resultStatus))r.push('RESULT_STATUS_INVALID');
 if(reg?.kind==='ECONOMIC'&&candidates.has(x.resultStatus)&&x.costLiquidityReviewPass!==true)r.push('COST_LIQUIDITY_REVIEW_NOT_PASS');
 if(reg?.kind==='SEMANTIC'&&x.resultStatus==='VALIDATION_PASS_CANDIDATE')r.push('SEMANTIC_MODULE_WRONG_CANDIDATE_STATUS');
 if(reg?.kind==='ECONOMIC'&&x.resultStatus==='SEMANTIC_GOVERNANCE_CANDIDATE')r.push('ECONOMIC_MODULE_WRONG_CANDIDATE_STATUS');
 const eligible=r.length===0&&x.sampleAdequacyStatus==='ADEQUATE'&&candidates.has(x.resultStatus);
 return r.length?fail(r,{promotionReviewEligible:false,evidenceKey:key}):pass({promotionReviewEligible:eligible,evidenceKey:key,resultStatus:x.resultStatus,sampleAdequacyStatus:x.sampleAdequacyStatus,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false});
}
export function evaluateD16ReceiptSet(receipts=[],expectedByKey={}){
 const a=Array.isArray(receipts)?receipts:[], seen=new Set(), dup=[], rk=new Map(), cross=[];
 const evaluated=a.map(x=>{if(nonempty(x?.receiptId)){if(seen.has(x.receiptId))dup.push(x.receiptId);else seen.add(x.receiptId);const prior=rk.get(x.receiptId);if(prior&&prior!==x.evidenceKey)cross.push(x.receiptId);else rk.set(x.receiptId,x.evidenceKey);}return{receiptId:x?.receiptId??null,evidenceKey:x?.evidenceKey??null,validation:evaluateD16Receipt(x,expectedByKey[x?.evidenceKey]||{evidenceKey:x?.evidenceKey})};});
 const byEvidenceKey={}; for(const row of evaluated){if(row.evidenceKey)(byEvidenceKey[row.evidenceKey]??=[]).push(row);}
 return{schemaVersion:'0.1',guardVersion:D02_D16_L4_RECEIPT_GUARD_VERSION,receiptCount:a.length,fatalIntegrity:dup.length>0||cross.length>0,duplicateReceiptIds:uniq(dup),crossEvidenceKeyReceiptReuse:uniq(cross),byEvidenceKey,promotionReviewEligibleKeys:uniq(evaluated.filter(x=>x.validation.pass&&x.validation.promotionReviewEligible).map(x=>x.evidenceKey)),crossModuleSampleBorrowingAllowed:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false};
}