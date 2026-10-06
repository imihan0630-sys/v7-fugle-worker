import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec=JSON.parse(readFileSync(new URL('./d03_factor_timing_receipt_schema_20261006_v0_1.json',import.meta.url)));

const byFactor=new Map(spec.factorRegistry.map(x=>[x.factorId,x]));
assert.equal(byFactor.size,12,'all active D03 modules must be registered exactly once');

function profileFor(factorId){
  const reg=byFactor.get(factorId);
  if(!reg) throw new Error('UNREGISTERED_FACTOR:'+factorId);
  const p=spec.timingProfiles[reg.profile];
  if(!p) throw new Error('UNREGISTERED_PROFILE:'+reg.profile);
  return {reg,p};
}

export function validateTimingReceipt(r){
  if(!r||typeof r!=='object') throw new Error('RECEIPT_REQUIRED');
  for(const f of spec.requiredReceiptFields){
    if(!(f in r)||r[f]===null||r[f]===undefined||r[f]==='') throw new Error('MISSING_FIELD:'+f);
  }
  if(!spec.allowedTerminalStates.includes(r.terminalState)) throw new Error('INVALID_TERMINAL_STATE');

  const {reg,p}=profileFor(r.factorId);
  if(r.featureLineageId!==reg.featureLineageId) throw new Error('FEATURE_LINEAGE_DRIFT');
  if(r.redundancyGroupId!==reg.redundancyGroupId) throw new Error('REDUNDANCY_GROUP_DRIFT');
  if(r.parameterFamilyId!==reg.parameterFamilyId) throw new Error('PARAMETER_FAMILY_DRIFT');
  if(r.timingProfileId!==reg.profile) throw new Error('TIMING_PROFILE_DRIFT');
  if(r.signalKnownAtRule!==p.signalKnownAtRule) throw new Error('SIGNAL_KNOWN_AT_RULE_DRIFT');
  if(r.executionClockRule!==p.executionClockRule) throw new Error('EXECUTION_CLOCK_RULE_DRIFT');
  if(r.legalOffsetFamilyId!==p.legalOffsetFamilyId) throw new Error('OFFSET_FAMILY_DRIFT');
  if(r.forbiddenFutureOffsetFamilyId!==spec.universalRules.futureOffsetFamilyId) throw new Error('FUTURE_OFFSET_POLICY_DRIFT');
  if(r.structuralCausalityClaimAllowed!==false) throw new Error('STRUCTURAL_CAUSALITY_FORBIDDEN');

  if(r.usesFutureOffsetAsPredictor===true) {
    return {status:'FUTURE_OFFSET_FORBIDDEN',predictivePrecedenceEligible:false};
  }
  if(r.consumerScopeMatches!==true) {
    return {status:'CONSUMER_SCOPE_MISMATCH',predictivePrecedenceEligible:false};
  }
  if(r.commonSupportBound!==true) {
    return {status:'COMMON_SUPPORT_INSUFFICIENT',predictivePrecedenceEligible:false};
  }
  if(r.ancestryBaselineBound!==true) {
    return {status:'ANCESTRY_BASELINE_UNBOUND',predictivePrecedenceEligible:false};
  }
  if(r.inferenceBindingComplete!==true) {
    return {status:'INFERENCE_BINDING_INCOMPLETE',predictivePrecedenceEligible:false};
  }
  if(r.multiplicityBound!==true) {
    return {status:'MULTIPLICITY_UNBOUND',predictivePrecedenceEligible:false};
  }

  if(r.factorId==='D03-04'){
    if(r.terminalState!=='OUTCOME_RELATION_NOT_SIGNAL') throw new Error('D03_04_MUST_NOT_BE_SIGNAL');
    if(r.predictivePrecedenceEligible===true) throw new Error('D03_04_PREDICTOR_USE_FORBIDDEN');
    return {status:'OUTCOME_RELATION_NOT_SIGNAL',predictivePrecedenceEligible:false};
  }

  if(r.sameCloseFill===true){
    return {status:'COST_FILLABILITY_UNBOUND',predictivePrecedenceEligible:false};
  }

  if(r.factorId==='D03-09'&&r.fullReplayOrTrustedState!==true){
    return {status:'WARMUP_OR_REPLAY_BLOCKED',predictivePrecedenceEligible:false};
  }

  if(r.factorId==='D03-10'&&r.exact20EligibleSessionContinuity!==true){
    return {status:'CONTINUITY_BLOCKED',predictivePrecedenceEligible:false};
  }

  if(r.factorId==='D03-05'&&r.provisionalSeedUsedAsFinal===true){
    return {status:'SIGNAL_CLOCK_UNCERTIFIED',predictivePrecedenceEligible:false};
  }

  if(r.factorId==='D03-12'&&r.signalBackdatedToPivotAt===true){
    return {status:'SIGNAL_CLOCK_UNCERTIFIED',predictivePrecedenceEligible:false};
  }

  if(r.factorId==='D03-13'){
    if(r.latestComponentFinalitySatisfied!==true) return {status:'FINALITY_BLOCKED',predictivePrecedenceEligible:false};
    if(r.closingM15Backfilled===true) return {status:'FINALITY_BLOCKED',predictivePrecedenceEligible:false};
    if(r.provisionalFinalVersionCollapsed===true) return {status:'VERSION_INCOMPATIBLE',predictivePrecedenceEligible:false};
  }

  if(r.costFillabilityBound!==true){
    return {status:'COST_FILLABILITY_UNBOUND',predictivePrecedenceEligible:false};
  }

  return {status:'TIMING_RECEIPT_READY',predictivePrecedenceEligible:true};
}

function makeReceipt(factorId,extra={}){
  const {reg,p}=profileFor(factorId);
  return {
    receiptVersion:'R1',
    factorId,
    factorVersion:'FV1',
    timingProfileId:reg.profile,
    timingProfileVersion:'TP1',
    featureLineageId:reg.featureLineageId,
    informationRoot:['PRICE_OHLC'],
    redundancyGroupId:reg.redundancyGroupId,
    parameterFamilyId:reg.parameterFamilyId,
    sourceLineageHash:'SRC',
    consumerScopeHash:'CONS',
    signalKnownAtRule:p.signalKnownAtRule,
    decisionCutoffRule:p.decisionCutoffRule,
    executionClockRule:p.executionClockRule,
    legalOffsetFamilyId:p.legalOffsetFamilyId,
    forbiddenFutureOffsetFamilyId:spec.universalRules.futureOffsetFamilyId,
    endpointFamilyId:'D5_D10_D20',
    ancestryBaselineHash:'BASE',
    commonSupportHash:'SUPPORT',
    purgeEmbargoRuleVersion:'PURGE1',
    dependenceMethodRef:'D16_DEP1',
    multipleTestingFamilyId:'MTF1',
    researchStreamId:'RS1',
    selectionPipelineHash:'PIPE1',
    costFillabilityContractHash:'COST1',
    continuityDisposition:'PASS',
    finalityState:'FINAL',
    terminalState:factorId==='D03-04'?'OUTCOME_RELATION_NOT_SIGNAL':'TIMING_RECEIPT_READY',
    predictivePrecedenceEligible:false,
    structuralCausalityClaimAllowed:false,
    usesFutureOffsetAsPredictor:false,
    consumerScopeMatches:true,
    commonSupportBound:true,
    ancestryBaselineBound:true,
    inferenceBindingComplete:true,
    multiplicityBound:true,
    costFillabilityBound:true,
    sameCloseFill:false,
    fullReplayOrTrustedState:true,
    exact20EligibleSessionContinuity:true,
    provisionalSeedUsedAsFinal:false,
    signalBackdatedToPivotAt:false,
    latestComponentFinalitySatisfied:true,
    closingM15Backfilled:false,
    provisionalFinalVersionCollapsed:false,
    ...extra
  };
}

for(const id of ['D03-01','D03-02','D03-03','D03-05','D03-06','D03-07','D03-08','D03-09','D03-10','D03-12','D03-13']){
  assert.equal(validateTimingReceipt(makeReceipt(id)).status,'TIMING_RECEIPT_READY',id);
}
assert.equal(validateTimingReceipt(makeReceipt('D03-04')).status,'OUTCOME_RELATION_NOT_SIGNAL');

assert.equal(validateTimingReceipt(makeReceipt('D03-01',{usesFutureOffsetAsPredictor:true})).status,'FUTURE_OFFSET_FORBIDDEN');
assert.equal(validateTimingReceipt(makeReceipt('D03-01',{sameCloseFill:true})).status,'COST_FILLABILITY_UNBOUND');
assert.equal(validateTimingReceipt(makeReceipt('D03-09',{fullReplayOrTrustedState:false})).status,'WARMUP_OR_REPLAY_BLOCKED');
assert.equal(validateTimingReceipt(makeReceipt('D03-10',{exact20EligibleSessionContinuity:false})).status,'CONTINUITY_BLOCKED');
assert.equal(validateTimingReceipt(makeReceipt('D03-05',{provisionalSeedUsedAsFinal:true})).status,'SIGNAL_CLOCK_UNCERTIFIED');
assert.equal(validateTimingReceipt(makeReceipt('D03-12',{signalBackdatedToPivotAt:true})).status,'SIGNAL_CLOCK_UNCERTIFIED');
assert.equal(validateTimingReceipt(makeReceipt('D03-13',{latestComponentFinalitySatisfied:false})).status,'FINALITY_BLOCKED');
assert.equal(validateTimingReceipt(makeReceipt('D03-13',{closingM15Backfilled:true})).status,'FINALITY_BLOCKED');
assert.equal(validateTimingReceipt(makeReceipt('D03-13',{provisionalFinalVersionCollapsed:true})).status,'VERSION_INCOMPATIBLE');
assert.equal(validateTimingReceipt(makeReceipt('D03-06',{ancestryBaselineBound:false})).status,'ANCESTRY_BASELINE_UNBOUND');
assert.equal(validateTimingReceipt(makeReceipt('D03-07',{commonSupportBound:false})).status,'COMMON_SUPPORT_INSUFFICIENT');
assert.equal(validateTimingReceipt(makeReceipt('D03-08',{inferenceBindingComplete:false})).status,'INFERENCE_BINDING_INCOMPLETE');
assert.equal(validateTimingReceipt(makeReceipt('D03-02',{multiplicityBound:false})).status,'MULTIPLICITY_UNBOUND');
assert.equal(validateTimingReceipt(makeReceipt('D03-01',{consumerScopeMatches:false})).status,'CONSUMER_SCOPE_MISMATCH');
assert.equal(validateTimingReceipt(makeReceipt('D03-03',{costFillabilityBound:false})).status,'COST_FILLABILITY_UNBOUND');

assert.throws(()=>validateTimingReceipt(makeReceipt('D03-01',{structuralCausalityClaimAllowed:true})),/STRUCTURAL_CAUSALITY_FORBIDDEN/);
assert.throws(()=>validateTimingReceipt(makeReceipt('D03-01',{featureLineageId:'DRIFT'})),/FEATURE_LINEAGE_DRIFT/);
assert.throws(()=>validateTimingReceipt(makeReceipt('D03-01',{timingProfileId:'DIVERGENCE_CONFIRMATION'})),/TIMING_PROFILE_DRIFT/);

console.log(JSON.stringify({
  status:'PASS',
  registeredActiveModules:12,
  readyPredictorProfiles:11,
  outcomeRelationNotSignal:1,
  adversarialCases:18,
  futureOffsetRejected:true,
  sameCloseFillRejected:true,
  adxReplayRequired:true,
  bollingerContinuityRequired:true,
  divergenceBackdateRejected:true,
  multiTimeframeFinalityRequired:true,
  d03_04PredictorUseForbidden:true,
  structuralCausalityClaimAllowed:false,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
