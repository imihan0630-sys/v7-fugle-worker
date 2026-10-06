import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec=JSON.parse(readFileSync(new URL('./d03_d16_timing_method_receipt_schema_20261006_v0_1.json',import.meta.url)));

export function validateTimingMethodReceipt(r){
  if(!r||typeof r!=='object') throw new Error('RECEIPT_REQUIRED');

  for(const f of spec.requiredIdentityFields){
    if(!(f in r)||r[f]===null||r[f]===undefined||r[f]==='') throw new Error('MISSING_IDENTITY:'+f);
  }
  for(const f of spec.requiredMethodFields){
    if(!(f in r)||r[f]===null||r[f]===undefined||r[f]==='') throw new Error('MISSING_METHOD_FIELD:'+f);
  }
  if(!spec.allowedTerminalStates.includes(r.terminalState)) throw new Error('INVALID_TERMINAL_STATE');
  if(r.structuralCausalityClaimAllowed!==false) throw new Error('STRUCTURAL_CAUSALITY_FORBIDDEN');

  if(r.factorId==='D03-04'){
    if(r.terminalState!=='OUTCOME_RELATION_NOT_SIGNAL') throw new Error('D03_04_READY_FORBIDDEN');
    return {
      status:'PASS_STRUCTURAL_RECEIPT',
      terminalState:r.terminalState,
      blockingScientificResultAccepted:true,
      outcomeExecutionAuthorized:false,
      maturityImpact:'NONE'
    };
  }

  if(r.terminalState==='TIMING_METHOD_READY'){
    if(r.unresolvedLeakageState!=='NONE') throw new Error('READY_WITH_UNRESOLVED_LEAKAGE');
    if(r.futureSentinelPolicy!=='SENTINEL_ONLY_NO_CANDIDATE_USE') throw new Error('READY_WITH_BAD_SENTINEL_POLICY');
    if(r.representationCompatibilityState!=='PASS') throw new Error('READY_WITH_REPRESENTATION_INCOMPATIBLE');
    if(r.costFillabilityDisposition!=='PASS') throw new Error('READY_WITH_COST_FILLABILITY_BLOCK');
    if(r.factorId==='D03-09'&&r.stateCertification!=='FULL_REPLAY_OR_TRUSTED_STATE') throw new Error('ADX_STATE_CERTIFICATION_REQUIRED');
    if(r.factorId==='D03-10'&&r.exact20EligibleSessionContinuity!==true) throw new Error('BOLLINGER_CONTINUITY_REQUIRED');
    if(r.factorId==='D03-12'&&r.signalClockAuthority!=='FIRST_OBSERVABLE_AT_NOT_PIVOT_AT') throw new Error('DIVERGENCE_CLOCK_AUTHORITY_REQUIRED');
    if(r.factorId==='D03-13'){
      if(r.latestComponentFinalitySatisfied!==true) throw new Error('MULTITIMEFRAME_FINALITY_REQUIRED');
      if(r.provisionalFinalSeparationSatisfied!==true) throw new Error('MULTITIMEFRAME_VERSION_SEPARATION_REQUIRED');
    }
  }

  const blocking=r.terminalState!=='TIMING_METHOD_READY';
  return {
    status:'PASS_STRUCTURAL_RECEIPT',
    terminalState:r.terminalState,
    blockingScientificResultAccepted:blocking,
    outcomeExecutionAuthorized:false,
    predictiveIncrementalityProven:false,
    exactLagIdentified:false,
    structuralCausalityClaimed:false,
    maturityImpact:'NONE',
    formalCoreImpact:'NONE_LOCKED'
  };
}

const base={
  timingMethodReceiptVersion:'TMR1',
  factorId:'D03-08',
  factorVersion:'FV1',
  timingProfileId:'DAILY_COMPLETED',
  timingProfileVersion:'TP1',
  factorTimingReceiptHash:'FTR1',
  lineageRegistryHash:'LIN1',
  signalKnownAtRule:'AFTER_REQUIRED_SESSION_FINALIZATION',
  decisionCutoffRule:'AT_OR_AFTER_SIGNAL_KNOWN_AT_WITH_NO_FUTURE_INPUT',
  executionClockRule:'FIRST_EXECUTABLE_EVENT_AFTER_SIGNAL_KNOWN_AT',
  legalOffsetFamilyId:'OF_DAILY_COMPLETED_NONFUTURE_V0_1',
  endpointFamilyId:'D5_D10_D20',
  targetPopulationHash:'POP1',
  commonSupportHash:'SUP1',
  consumerScopeHash:'CONS1',
  temporalNoninterferenceContractVersion:'TNI1',
  registeredPerturbationFamilySetHash:'PSET1',
  latestTwoRunValidationReceiptHash:'TWORUN1',
  memoryClass:'RECURSIVE_IIR',
  memoryKernelOrReplayVersion:'MEM1',
  rawRootControlHash:'RAW1',
  lagCandidateSetHash:'LAG1',
  temporalAggregationVersion:'AGG1',
  lagCorrelationDiagnostics:'LC1',
  outcomeFootprintOverlapDiagnostics:'OFO1',
  multipleTestingFamilyId:'MTF1',
  researchStreamId:'RS1',
  selectionPipelineHash:'PIPE1',
  sda016ConsumptionRef:'SDA16-1',
  holdoutIdentity:'H1',
  terminalState:'TIMING_METHOD_READY',
  structuralCausalityClaimAllowed:false,
  unresolvedLeakageState:'NONE',
  futureSentinelPolicy:'SENTINEL_ONLY_NO_CANDIDATE_USE',
  primaryTimingEstimand:'PREDICTIVE_PRECEDENCE',
  neighborLagComparisonRule:'FROZEN',
  boundaryPeakPolicy:'BLOCK',
  plateauPolicy:'INTERVAL_OR_PLATEAU',
  lagMultiplicityMethod:'D16_FROZEN',
  representationCompatibilityState:'PASS',
  dependenceMethodRef:'D16_DEP',
  costFillabilityDisposition:'PASS',
  stateCertification:'FULL_REPLAY_OR_TRUSTED_STATE',
  exact20EligibleSessionContinuity:true,
  signalClockAuthority:'FIRST_OBSERVABLE_AT_NOT_PIVOT_AT',
  latestComponentFinalitySatisfied:true,
  provisionalFinalSeparationSatisfied:true
};

const ready=validateTimingMethodReceipt(base);
assert.equal(ready.terminalState,'TIMING_METHOD_READY');
assert.equal(ready.outcomeExecutionAuthorized,false);
assert.equal(ready.predictiveIncrementalityProven,false);
assert.equal(ready.exactLagIdentified,false);
assert.equal(ready.structuralCausalityClaimed,false);

for(const s of [
  'CONTEMPORANEOUS_ONLY',
  'TEMPORAL_NONINTERFERENCE_BLOCKED',
  'COMMON_SUPPORT_INSUFFICIENT',
  'LAG_MEMORY_CONFOUND_UNRESOLVED',
  'TEMPORAL_AGGREGATION_CONFOUND',
  'LAG_PEAK_UNIDENTIFIED',
  'BOUNDARY_PEAK_SEARCH_INCOMPLETE',
  'RAW_ROOT_EXPLAINS_EFFECT',
  'FILTER_DIRECTIONALITY_SENSITIVE',
  'SUPPORT_THIN_AT_LAG',
  'COST_OR_FILLABILITY_INVALIDATES'
]){
  const out=validateTimingMethodReceipt({...base,terminalState:s});
  assert.equal(out.blockingScientificResultAccepted,true,s);
  assert.equal(out.outcomeExecutionAuthorized,false,s);
}

const d0304=validateTimingMethodReceipt({...base,factorId:'D03-04',terminalState:'OUTCOME_RELATION_NOT_SIGNAL'});
assert.equal(d0304.blockingScientificResultAccepted,true);
assert.throws(()=>validateTimingMethodReceipt({...base,factorId:'D03-04',terminalState:'TIMING_METHOD_READY'}),/D03_04_READY_FORBIDDEN/);

assert.throws(()=>validateTimingMethodReceipt({...base,structuralCausalityClaimAllowed:true}),/STRUCTURAL_CAUSALITY_FORBIDDEN/);
assert.throws(()=>validateTimingMethodReceipt({...base,unresolvedLeakageState:'FUTURE_CACHE_STATE_CONTAMINATION'}),/UNRESOLVED_LEAKAGE/);
assert.throws(()=>validateTimingMethodReceipt({...base,futureSentinelPolicy:'ALLOW_AS_CANDIDATE'}),/BAD_SENTINEL_POLICY/);
assert.throws(()=>validateTimingMethodReceipt({...base,representationCompatibilityState:'UNKNOWN'}),/REPRESENTATION_INCOMPATIBLE/);
assert.throws(()=>validateTimingMethodReceipt({...base,costFillabilityDisposition:'FAIL'}),/COST_FILLABILITY_BLOCK/);
assert.throws(()=>validateTimingMethodReceipt({...base,factorId:'D03-09',stateCertification:'UNKNOWN'}),/ADX_STATE_CERTIFICATION/);
assert.throws(()=>validateTimingMethodReceipt({...base,factorId:'D03-10',exact20EligibleSessionContinuity:false}),/BOLLINGER_CONTINUITY/);
assert.throws(()=>validateTimingMethodReceipt({...base,factorId:'D03-12',signalClockAuthority:'PIVOT_AT'}),/DIVERGENCE_CLOCK_AUTHORITY/);
assert.throws(()=>validateTimingMethodReceipt({...base,factorId:'D03-13',latestComponentFinalitySatisfied:false}),/MULTITIMEFRAME_FINALITY/);
assert.throws(()=>validateTimingMethodReceipt({...base,factorId:'D03-13',provisionalFinalSeparationSatisfied:false}),/MULTITIMEFRAME_VERSION_SEPARATION/);

console.log(JSON.stringify({
  status:'PASS',
  readyCase:1,
  acceptedBlockingStates:11,
  d03_04OutcomeRelationGuard:2,
  adversarialReadyRejections:10,
  totalCases:24,
  methodReadyDoesNotAuthorizeOutcomes:true,
  methodReadyDoesNotProvePredictiveIncrementality:true,
  methodReadyDoesNotIdentifyExactLag:true,
  structuralCausalityClaimed:false,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
