import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec=JSON.parse(readFileSync(new URL('./d03_d16_interaction_falsification_method_receipt_schema_20261006_v0_1.json',import.meta.url)));
const nonempty=v=>typeof v==='string'&&v.trim().length>0;

export function validateMethodReceipt(r){
  if(!r||typeof r!=='object') throw new Error('RECEIPT_REQUIRED');
  for(const f of spec.requiredIdentityFields){
    if(!(f in r)||r[f]===null||r[f]===undefined||(typeof r[f]==='string'&&!nonempty(r[f]))) throw new Error('MISSING_IDENTITY:'+f);
  }
  for(const f of spec.methodReadinessFields){
    if(!(f in r)||r[f]===null||r[f]===undefined||(typeof r[f]==='string'&&!nonempty(r[f]))) throw new Error('MISSING_METHOD_FIELD:'+f);
  }
  if(!spec.allowedTerminalStates.includes(r.terminalState)) throw new Error('INVALID_TERMINAL_STATE');

  if(r.terminalState==='FALSIFICATION_METHOD_READY'){
    for(const [f,v] of Object.entries({
      nullGeneratorValidationState:'PASS',
      targetBreakValidationState:'PASS',
      nuisancePreservationValidationState:'PASS',
      lineageMechanicalValidityState:'PASS',
      supportAdmissionSymmetryState:'PASS'
    })){
      if(r[f]!==v) throw new Error('READY_REQUIREMENT_FAIL:'+f);
    }
    if(r.selectionAdjustmentMethod==='FIXED_WINNER_NULL_AFTER_SEARCH') throw new Error('READY_WITH_INVALID_SELECTION_ADJUSTMENT');
    if(r.resamplingUsed===true&&!nonempty(r.monteCarloDesignHash)) throw new Error('READY_MONTE_CARLO_DESIGN_MISSING');
    if(!nonempty(r.falsifierDisagreementPolicyHash)) throw new Error('READY_DISAGREEMENT_POLICY_MISSING');
  }

  const blocking=r.terminalState!=='FALSIFICATION_METHOD_READY';
  return Object.freeze({
    status:'PASS_STRUCTURAL_RECEIPT',
    terminalState:r.terminalState,
    blockingScientificResultAccepted:blocking,
    outcomeExecutionAuthorized:false,
    thirdUnitReviewEligible:false,
    maturityImpact:'NONE',
    formalCoreImpact:'NONE_LOCKED'
  });
}

const ids={
  falsificationMethodReceiptVersion:'V0_1',
  d03InteractionFamilyId:'IF1',
  d03InteractionVersion:'I1',
  variantId:'VAR1',
  variantVersion:'V1',
  interactionSearchFamilyId:'ISF1',
  componentPairHash:'A',
  componentRootHash:'B',
  primaryNullClaimHash:'C',
  primaryFalsifierFamilyId:'FF1',
  primaryFalsifierVersion:'F1',
  nullGeneratorVersion:'NG1',
  targetPopulationHash:'TP1',
  commonSupportHash:'CS1',
  consumerScopeHash:'SC1',
  decisionClock:'D1',
  outcomeHorizonId:'D5',
  d16MethodVersion:'M1',
  multipleTestingFamilyId:'MTF1',
  researchStreamId:'RS1',
  sda016ConsumptionRef:'SDA16-1'
};
const method={
  nullGeneratorValidationState:'PASS',
  targetBreakValidationState:'PASS',
  nuisancePreservationValidationState:'PASS',
  lineageMechanicalValidityState:'PASS',
  supportAdmissionSymmetryState:'PASS',
  conditionalMisspecificationSensitivityState:'PASS',
  powerCalibrationState:'PASS',
  selectionAdjustmentMethod:'FULL_PIPELINE_MAX_NULL',
  monteCarloDesignHash:'MC1',
  falsifierDisagreementPolicyHash:'FD1',
  resamplingUsed:true
};

const ready=validateMethodReceipt({...ids,...method,terminalState:'FALSIFICATION_METHOD_READY'});
assert.equal(ready.blockingScientificResultAccepted,false);
assert.equal(ready.outcomeExecutionAuthorized,false);

for(const s of [
  'NO_VALID_COMPONENTWISE_PERMUTATION',
  'NULL_NOT_IDENTIFIABLE_BY_SURROGATE_FAMILY',
  'CONDITIONAL_NULL_MODEL_UNRELIABLE',
  'POWER_INSUFFICIENT',
  'DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE',
  'FALSIFIER_DISAGREEMENT_UNRESOLVED'
]){
  const out=validateMethodReceipt({...ids,...method,terminalState:s});
  assert.equal(out.blockingScientificResultAccepted,true);
  assert.equal(out.outcomeExecutionAuthorized,false);
}

assert.throws(()=>validateMethodReceipt({...ids,...method,terminalState:'FALSIFICATION_METHOD_READY',targetBreakValidationState:'FAIL'}),/READY_REQUIREMENT_FAIL/);
assert.throws(()=>validateMethodReceipt({...ids,...method,terminalState:'FALSIFICATION_METHOD_READY',selectionAdjustmentMethod:'FIXED_WINNER_NULL_AFTER_SEARCH'}),/INVALID_SELECTION_ADJUSTMENT/);
assert.throws(()=>validateMethodReceipt({...ids,...method,terminalState:'FALSIFICATION_METHOD_READY',monteCarloDesignHash:''}),/MISSING_METHOD_FIELD|MONTE_CARLO/);
assert.throws(()=>validateMethodReceipt({...ids,...method,terminalState:'MAGIC_PASS'}),/INVALID_TERMINAL_STATE/);

const missing={...ids,...method,terminalState:'POWER_INSUFFICIENT'}; delete missing.commonSupportHash;
assert.throws(()=>validateMethodReceipt(missing),/MISSING_IDENTITY:commonSupportHash/);

console.log(JSON.stringify({
  status:'PASS',
  cases:12,
  methodReadyStillDoesNotAuthorizeOutcomes:true,
  legitimateBlockingStatesAccepted:true,
  invalidReadyReceiptRejected:true,
  fixedWinnerAfterSearchRejected:true,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
