import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec=JSON.parse(readFileSync(new URL('./d03_null_generator_validation_and_falsifier_disagreement_contract_20261006_v0_1.json',import.meta.url)));

function evaluateNullValidation(x){
  if(!x||typeof x!=='object') throw new Error('INPUT_REQUIRED');
  for(const f of spec.requiredValidationAxes){
    if(!(f in x)) throw new Error('MISSING_VALIDATION_AXIS:'+f);
  }
  if(!spec.validityStates.includes(x.validityState)) throw new Error('INVALID_VALIDITY_STATE');
  if(!spec.powerStates.includes(x.powerState)) throw new Error('INVALID_POWER_STATE');
  if(!spec.falsifierRoleStates.includes(x.falsifierRole)) throw new Error('INVALID_FALSIFIER_ROLE');

  if(x.targetRelationBreakState!=='PASS'){
    return {status:'TARGET_RELATION_NOT_BROKEN',promotionFalsifierEligible:false};
  }

  const preserveAxes=[
    'componentMarginalPreservation','conditionalStructurePreservation','dateCompositionPreservation',
    'sectorIndustryCompositionPreservation','regimeCompositionPreservation','liquiditySizeCompositionPreservation',
    'serialDependencePreservation','volatilityClusteringPreservation','crossSectionalCommonShockPreservation',
    'repeatedSymbolStructurePreservation','supportAdmissionPreservation','missingnessPreservation',
    'continuityVersionPreservation','marketMechanicalConstraintPass'
  ];
  if(preserveAxes.some(f=>x[f]!==true)){
    return {status:'NUISANCE_STRUCTURE_OVERBROKEN',promotionFalsifierEligible:false};
  }

  if(x.supportInflated===true) return {status:'SUPPORT_INFLATION',promotionFalsifierEligible:false};
  if(x.supportDegraded===true) return {status:'SUPPORT_DEGRADATION',promotionFalsifierEligible:false};

  if(x.nullGeneratorClass==='CONDITIONAL_PERMUTATION'||x.nullGeneratorClass==='CONDITIONAL_RANDOMIZATION'){
    for(const f of spec.conditionalNullDiagnostics){
      if(!(f in x)) throw new Error('MISSING_CONDITIONAL_DIAGNOSTIC:'+f);
    }
    if(x.misspecificationSensitivity!=='PASS'){
      return {status:'CONDITIONAL_NULL_MODEL_FRAGILE',promotionFalsifierEligible:false};
    }
  }

  if(x.nullGeneratorClass==='PATH_LEVEL_SURROGATE'||x.nullGeneratorClass==='TEMPORAL_ALIGNMENT_PLACEBO'){
    for(const f of spec.temporalNullDiagnostics){
      if(!(f in x)) throw new Error('MISSING_TEMPORAL_DIAGNOSTIC:'+f);
    }
    if(x.nullIdentifiableBySurrogateFamily===false){
      return {status:'NULL_NOT_IDENTIFIABLE_BY_SURROGATE_FAMILY',promotionFalsifierEligible:false};
    }
  }

  if(x.validityState==='INVALID'||x.validityState==='HEURISTIC_ONLY'||x.validityState==='UNKNOWN'){
    return {status:'METHOD_VALIDITY_BLOCKED',promotionFalsifierEligible:false};
  }

  if(x.powerState==='LOW_POWER'||x.powerState==='POWER_NOT_ESTABLISHED'){
    return {status:'FALSIFIER_POWER_INSUFFICIENT',promotionFalsifierEligible:false};
  }

  return {status:'NULL_GENERATOR_READY',promotionFalsifierEligible:true};
}

function resolveFalsifierDisagreement(a,b){
  if(a.nullClaimHash===b.nullClaimHash&&a.conclusion!==b.conclusion){
    return {status:'SAME_NULL_FALSIFIER_CONTRADICTION',thirdUnitEligible:false};
  }
  if(a.nullClaimHash!==b.nullClaimHash&&a.conclusion!==b.conclusion){
    return {status:'NULL_SPECIFIC_DISAGREEMENT',thirdUnitEligible:false};
  }
  return {status:'CONSISTENT',thirdUnitEligible:true};
}

const base={
  targetRelationBreakState:'PASS',
  componentMarginalPreservation:true,
  conditionalStructurePreservation:true,
  dateCompositionPreservation:true,
  sectorIndustryCompositionPreservation:true,
  regimeCompositionPreservation:true,
  liquiditySizeCompositionPreservation:true,
  serialDependencePreservation:true,
  volatilityClusteringPreservation:true,
  crossSectionalCommonShockPreservation:true,
  repeatedSymbolStructurePreservation:true,
  supportAdmissionPreservation:true,
  missingnessPreservation:true,
  continuityVersionPreservation:true,
  marketMechanicalConstraintPass:true,
  supportInflated:false,
  supportDegraded:false,
  nullGeneratorClass:'CONDITIONAL_PERMUTATION',
  conditionalCalibration:'PASS',
  conditionalResidualDiagnostics:'PASS',
  supportOverlapDiagnostics:'PASS',
  predictiveDistributionDiagnostics:'PASS',
  subgroupConditionalCalibration:'PASS',
  misspecificationSensitivity:'PASS',
  validityState:'ASYMPTOTICALLY_VALID',
  powerState:'ADEQUATE_FOR_CLAIM',
  falsifierRole:'PRIMARY'
};

assert.equal(evaluateNullValidation(base).status,'NULL_GENERATOR_READY');
assert.equal(evaluateNullValidation({...base,targetRelationBreakState:'FAIL'}).status,'TARGET_RELATION_NOT_BROKEN');
assert.equal(evaluateNullValidation({...base,dateCompositionPreservation:false}).status,'NUISANCE_STRUCTURE_OVERBROKEN');
assert.equal(evaluateNullValidation({...base,serialDependencePreservation:false}).status,'NUISANCE_STRUCTURE_OVERBROKEN');
assert.equal(evaluateNullValidation({...base,crossSectionalCommonShockPreservation:false}).status,'NUISANCE_STRUCTURE_OVERBROKEN');
assert.equal(evaluateNullValidation({...base,supportInflated:true}).status,'SUPPORT_INFLATION');
assert.equal(evaluateNullValidation({...base,supportDegraded:true}).status,'SUPPORT_DEGRADATION');
assert.equal(evaluateNullValidation({...base,misspecificationSensitivity:'FAIL'}).status,'CONDITIONAL_NULL_MODEL_FRAGILE');
assert.equal(evaluateNullValidation({...base,validityState:'HEURISTIC_ONLY'}).status,'METHOD_VALIDITY_BLOCKED');
assert.equal(evaluateNullValidation({...base,powerState:'LOW_POWER'}).status,'FALSIFIER_POWER_INSUFFICIENT');

const path={
  ...base,
  nullGeneratorClass:'PATH_LEVEL_SURROGATE',
  autocorrelationDiagnostics:'PASS',
  spectralDiagnostics:'PASS',
  volatilityClusteringDiagnostics:'PASS',
  localMeanVarianceDiagnostics:'PASS',
  regimeSegmentBoundaryDiagnostics:'PASS',
  calendarGapDiagnostics:'PASS',
  structuralVersionBoundaryDiagnostics:'PASS',
  nullIdentifiableBySurrogateFamily:true
};
delete path.conditionalCalibration;
delete path.conditionalResidualDiagnostics;
delete path.supportOverlapDiagnostics;
delete path.predictiveDistributionDiagnostics;
delete path.subgroupConditionalCalibration;
delete path.misspecificationSensitivity;
assert.equal(evaluateNullValidation(path).status,'NULL_GENERATOR_READY');
assert.equal(evaluateNullValidation({...path,nullIdentifiableBySurrogateFamily:false}).status,'NULL_NOT_IDENTIFIABLE_BY_SURROGATE_FAMILY');

const sameNull=resolveFalsifierDisagreement(
  {nullClaimHash:'N1',conclusion:'REJECT_NULL'},
  {nullClaimHash:'N1',conclusion:'DO_NOT_REJECT'}
);
assert.equal(sameNull.status,'SAME_NULL_FALSIFIER_CONTRADICTION');

const diffNull=resolveFalsifierDisagreement(
  {nullClaimHash:'N1',conclusion:'REJECT_NULL'},
  {nullClaimHash:'N2',conclusion:'DO_NOT_REJECT'}
);
assert.equal(diffNull.status,'NULL_SPECIFIC_DISAGREEMENT');

const consistent=resolveFalsifierDisagreement(
  {nullClaimHash:'N1',conclusion:'REJECT_NULL'},
  {nullClaimHash:'N1',conclusion:'REJECT_NULL'}
);
assert.equal(consistent.status,'CONSISTENT');

console.log(JSON.stringify({
  status:'PASS',
  cases:15,
  targetBreakAndNuisancePreservationBothRequired:true,
  supportInflationAndDegradationBothBlocked:true,
  conditionalMisspecificationSensitivityRequired:true,
  validLowPowerFalsifierBlocksStrongInference:true,
  sameNullContradictionBlocks:true,
  differentNullDisagreementIsNullSpecific:true,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
