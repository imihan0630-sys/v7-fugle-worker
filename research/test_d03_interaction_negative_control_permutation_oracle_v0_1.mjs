import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec = JSON.parse(
  readFileSync(new URL('./d03_interaction_negative_control_permutation_oracle_20261006_v0_1.json', import.meta.url))
);

const nonempty=v=>typeof v==='string'&&v.trim().length>0;
const hex64=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);

function req(obj, fields, prefix){
  for(const f of fields){
    if(!(f in obj)) throw new Error(`MISSING_${prefix}_FIELD:${f}`);
    if(typeof obj[f]==='string'&&!nonempty(obj[f])) throw new Error(`EMPTY_${prefix}_FIELD:${f}`);
  }
}
function plusOneP(exceed,M){return (1+exceed)/(1+M);}

export function evaluateFalsifier(x){
  if(!x||typeof x!=='object') throw new Error('INPUT_REQUIRED');
  req(x,spec.requiredFalsifierFields,'FALSIFIER');
  if(spec.invalidDefaultClasses.includes(x.nullGeneratorClass)) throw new Error('INVALID_DEFAULT_NULL_GENERATOR:'+x.nullGeneratorClass);
  if(!spec.nullGeneratorClasses.includes(x.nullGeneratorClass)) throw new Error('UNKNOWN_NULL_GENERATOR_CLASS');
  if(!spec.validityScopes.includes(x.validityScope)) throw new Error('INVALID_VALIDITY_SCOPE');
  if(!spec.exchangeabilityDispositions.includes(x.exchangeabilityDisposition)) throw new Error('INVALID_EXCHANGEABILITY_DISPOSITION');
  if(!hex64(x.preregistrationHash)||!hex64(x.preservedStructureHash)||!hex64(x.deliberatelyBrokenRelationHash)||!hex64(x.conditioningSetHash)) throw new Error('INVALID_HASH_BINDING');

  for(const f of spec.requiredPreservationDiagnostics){
    if(!(f in x)) throw new Error('MISSING_PRESERVATION_DIAGNOSTIC:'+f);
  }

  const out={
    status:'PASS',
    terminalState:'NULL_GENERATOR_READY',
    confirmatoryFalsifierEligible:true,
    formalCoreImpact:'NONE_LOCKED'
  };

  if(x.exchangeabilityDisposition==='NOT_PROVEN' &&
     !['CONDITIONAL_PERMUTATION','CONDITIONAL_RANDOMIZATION','PRIMITIVE_LINEAGE_SURROGATE','PATH_LEVEL_SURROGATE','LEAKAGE_SENTINEL','MECHANISM_MATCHED_PSEUDO_FEATURE'].includes(x.nullGeneratorClass)){
    out.terminalState='EXCHANGEABILITY_NOT_PROVEN';
    out.confirmatoryFalsifierEligible=false;
  }

  if(['CONDITIONAL_PERMUTATION','CONDITIONAL_RANDOMIZATION'].includes(x.nullGeneratorClass)){
    req(x,spec.conditionalNullRequirements,'CONDITIONAL');
    if(x.targetOutcomeUsedForSamplerSelection===true) throw new Error('OUTCOME_TUNED_CONDITIONAL_SAMPLER');
    if(x.conditionalMisspecificationState!=='PASS'){
      out.terminalState='CONDITIONAL_NULL_MODEL_UNRELIABLE';
      out.confirmatoryFalsifierEligible=false;
    }
  }

  if(['PRIMITIVE_LINEAGE_SURROGATE','PATH_LEVEL_SURROGATE'].includes(x.nullGeneratorClass)){
    req(x,spec.lineageSurrogateRequirements,'LINEAGE');
    if(x.descendantRecomputed!==true || x.lineageConsistent!==true){
      out.terminalState='LINEAGE_INCONSISTENT_SURROGATE';
      out.confirmatoryFalsifierEligible=false;
    }
  }

  if(x.datePanelPreservation!==true ||
     x.serialDependencePreservationOrModeled!==true ||
     x.repeatedSymbolStructurePreservation!==true){
    out.terminalState='DEPENDENCE_STRUCTURE_NOT_PRESERVED';
    out.confirmatoryFalsifierEligible=false;
  }

  if(x.mechanicalConstraintPass!==true){
    out.terminalState='MECHANICAL_STATE_INVALID';
    out.confirmatoryFalsifierEligible=false;
  }

  if(x.supportAdmissionPreservation!==true){
    out.terminalState='SUPPORT_DENOMINATOR_DRIFT';
    out.confirmatoryFalsifierEligible=false;
  }

  if(x.targetRelationBreakVerified!==true){
    throw new Error('TARGET_RELATION_NOT_BROKEN');
  }

  if(x.usesMonteCarlo===true){
    req(x,spec.monteCarloRequirements,'MONTE_CARLO');
    if(!Number.isInteger(x.realizedReplications)||x.realizedReplications<1) throw new Error('INVALID_REPLICATION_COUNT');
    if(!Number.isInteger(x.exceedanceCount)||x.exceedanceCount<0||x.exceedanceCount>x.realizedReplications) throw new Error('INVALID_EXCEEDANCE_COUNT');
    if(x.pValueMethod==='PLUS_ONE_MONTE_CARLO_RANK'){
      const p=plusOneP(x.exceedanceCount,x.realizedReplications);
      if(!(p>0&&p<=1)) throw new Error('INVALID_PLUS_ONE_P');
      out.pValue=p;
    }
    if(x.reportedPValue===0) throw new Error('ZERO_P_VALUE_FORBIDDEN');
    if(x.monteCarloResolutionPass!==true){
      out.terminalState='MONTE_CARLO_RESOLUTION_INSUFFICIENT';
      out.confirmatoryFalsifierEligible=false;
    }
  }

  if(x.pipelineReplayRequired===true){
    for(const f of spec.pipelineReplayRequirements){
      if(!(f in x)||x[f]!==true) {
        out.terminalState='PIPELINE_NULL_MISMATCH';
        out.confirmatoryFalsifierEligible=false;
      }
    }
  }

  if(x.primaryOrSensitivityRole==='PRIMARY' && x.falsifierDisagreementState==='UNRESOLVED'){
    out.terminalState='FALSIFIER_DISAGREEMENT_UNRESOLVED';
    out.confirmatoryFalsifierEligible=false;
  }

  if(x.validityScope==='HEURISTIC_SENSITIVITY_ONLY'||x.validityScope==='INVALID'){
    out.confirmatoryFalsifierEligible=false;
    if(out.terminalState==='NULL_GENERATOR_READY') out.terminalState='METHOD_INCOMPATIBLE';
  }

  return Object.freeze(out);
}

const H=c=>c.repeat(64);
const base={
  falsifierFamilyId:'FF-PV-1',
  falsifierVersion:'V1',
  targetInteractionFamilyId:'IF-PV-1',
  targetInteractionVersion:'I1',
  nullClaimHash:H('a'),
  preservedStructureHash:H('b'),
  deliberatelyBrokenRelationHash:H('c'),
  conditioningSetHash:H('d'),
  representationClass:'MIXED_THRESHOLD_CONTINUOUS',
  consumerScopeHash:H('e'),
  decisionClock:'COMPLETED_SESSION_ONLY',
  outcomeHorizonId:'D5',
  preregistrationHash:H('f'),
  permutationUnit:'DECISION_DATE_CONDITIONAL_COMPONENT_ROOT',
  exchangeabilityDisposition:'CONDITIONAL_MODEL_REQUIRED',
  validityScope:'ASYMPTOTIC',
  nullGeneratorClass:'CONDITIONAL_PERMUTATION',
  nullGeneratorValidationState:'PASS',
  primaryOrSensitivityRole:'PRIMARY',
  datePanelPreservation:true,
  sectorIndustryCompositionPreservation:true,
  regimeCompositionPreservation:true,
  repeatedSymbolStructurePreservation:true,
  serialDependencePreservationOrModeled:true,
  supportAdmissionPreservation:true,
  continuityVersionPreservation:true,
  mechanicalConstraintPass:true,
  componentMarginalPreservationWhereRequired:true,
  targetRelationBreakVerified:true,
  conditionalSamplerId:'CPT-PV',
  conditionalSamplerVersion:'V1',
  conditionalTrainingCutoff:'2026-09-30',
  conditionalPredictorSetHash:H('1'),
  conditionalValidationHash:H('2'),
  conditionalMisspecificationState:'PASS',
  targetOutcomeUsedForSamplerSelection:false,
  usesMonteCarlo:true,
  requestedReplications:999,
  realizedReplications:999,
  exceedanceCount:49,
  pValueMethod:'PLUS_ONE_MONTE_CARLO_RANK',
  reportedPValue:0.05,
  randomSeedLedgerHash:H('3'),
  rngAlgorithmVersion:'RNG-V1',
  replicationRulePreregistrationHash:H('4'),
  monteCarloPrecisionRuleHash:H('5'),
  monteCarloResolutionPass:true,
  pipelineReplayRequired:false,
  falsifierDisagreementState:'NONE'
};

const good=evaluateFalsifier(base);
assert.equal(good.terminalState,'NULL_GENERATOR_READY');
assert.equal(good.confirmatoryFalsifierEligible,true);
assert.equal(good.pValue,0.05);

assert.throws(()=>evaluateFalsifier({...base,nullGeneratorClass:'NAIVE_ROW_SHUFFLE'}),/INVALID_DEFAULT_NULL_GENERATOR/);
assert.throws(()=>evaluateFalsifier({...base,nullGeneratorClass:'ARBITRARY_DERIVED_FIELD_SHUFFLE'}),/INVALID_DEFAULT_NULL_GENERATOR/);

const misspec=evaluateFalsifier({...base,conditionalMisspecificationState:'FAIL'});
assert.equal(misspec.terminalState,'CONDITIONAL_NULL_MODEL_UNRELIABLE');

assert.throws(()=>evaluateFalsifier({...base,targetOutcomeUsedForSamplerSelection:true}),/OUTCOME_TUNED_CONDITIONAL_SAMPLER/);

const depBreak=evaluateFalsifier({...base,datePanelPreservation:false});
assert.equal(depBreak.terminalState,'DEPENDENCE_STRUCTURE_NOT_PRESERVED');

const repeatedBreak=evaluateFalsifier({...base,repeatedSymbolStructurePreservation:false});
assert.equal(repeatedBreak.terminalState,'DEPENDENCE_STRUCTURE_NOT_PRESERVED');

const mech=evaluateFalsifier({...base,mechanicalConstraintPass:false});
assert.equal(mech.terminalState,'MECHANICAL_STATE_INVALID');

const denom=evaluateFalsifier({...base,supportAdmissionPreservation:false});
assert.equal(denom.terminalState,'SUPPORT_DENOMINATOR_DRIFT');

assert.throws(()=>evaluateFalsifier({...base,targetRelationBreakVerified:false}),/TARGET_RELATION_NOT_BROKEN/);
assert.throws(()=>evaluateFalsifier({...base,reportedPValue:0}),/ZERO_P_VALUE_FORBIDDEN/);

const coarse=evaluateFalsifier({...base,monteCarloResolutionPass:false});
assert.equal(coarse.terminalState,'MONTE_CARLO_RESOLUTION_INSUFFICIENT');

const path={
  ...base,
  nullGeneratorClass:'PATH_LEVEL_SURROGATE',
  exchangeabilityDisposition:'NOT_APPLICABLE',
  primitiveSurrogateId:'PATH-SURR-1',
  primitiveRootIdentity:'PRICE_OHLC',
  descendantRecomputeReceiptHash:H('6'),
  factorDagVersion:'DAG-V1',
  continuityDisposition:'PASS',
  supportDisposition:'PASS',
  descendantRecomputed:true,
  lineageConsistent:true
};
delete path.conditionalSamplerId;
delete path.conditionalSamplerVersion;
delete path.conditionalTrainingCutoff;
delete path.conditionalPredictorSetHash;
delete path.conditionalValidationHash;
delete path.conditionalMisspecificationState;
delete path.targetOutcomeUsedForSamplerSelection;
assert.equal(evaluateFalsifier(path).terminalState,'NULL_GENERATOR_READY');

const pathBad=evaluateFalsifier({...path,descendantRecomputed:false});
assert.equal(pathBad.terminalState,'LINEAGE_INCONSISTENT_SURROGATE');

const unproven={
  ...path,
  nullGeneratorClass:'EXCHANGEABILITY_BLOCK_PERMUTATION',
  exchangeabilityDisposition:'NOT_PROVEN'
};
assert.equal(evaluateFalsifier(unproven).terminalState,'EXCHANGEABILITY_NOT_PROVEN');

const heuristic=evaluateFalsifier({...path,validityScope:'HEURISTIC_SENSITIVITY_ONLY'});
assert.equal(heuristic.confirmatoryFalsifierEligible,false);

const disagreement=evaluateFalsifier({...base,falsifierDisagreementState:'UNRESOLVED'});
assert.equal(disagreement.terminalState,'FALSIFIER_DISAGREEMENT_UNRESOLVED');

const pipe={
  ...path,
  nullGeneratorClass:'PIPELINE_MAX_STATISTIC_NULL',
  exchangeabilityDisposition:'DEPENDENCE_AWARE_METHOD_APPROVED',
  pipelineReplayRequired:true,
  sameCandidateSetHash:true,
  sameSupportSelectionPolicyHash:true,
  sameRankingMetricHash:true,
  sameTieBreakRuleHash:true,
  sameModelFitRuleHash:true,
  sameTuningRuleHash:true,
  sameCostFillabilityRuleHashWhereApplicable:true,
  sameObservedAndNullClock:true
};
assert.equal(evaluateFalsifier(pipe).terminalState,'NULL_GENERATOR_READY');

const pipeBad=evaluateFalsifier({...pipe,sameCandidateSetHash:false});
assert.equal(pipeBad.terminalState,'PIPELINE_NULL_MISMATCH');

const seedRepeat={...base,exceedanceCount:0,realizedReplications:99,requestedReplications:99,reportedPValue:0.01};
const seedOut=evaluateFalsifier(seedRepeat);
assert.equal(seedOut.pValue,0.01);

assert.throws(()=>evaluateFalsifier({...base,realizedReplications:0}),/INVALID_REPLICATION_COUNT/);
assert.throws(()=>evaluateFalsifier({...base,exceedanceCount:1000}),/INVALID_EXCEEDANCE_COUNT/);

const invalidScope=evaluateFalsifier({...path,validityScope:'INVALID'});
assert.equal(invalidScope.confirmatoryFalsifierEligible,false);

console.log(JSON.stringify({
  status:'PASS',
  cases:21,
  naiveRowShuffleRejected:true,
  arbitraryDerivedShuffleRejected:true,
  conditionalMisspecificationBlocks:true,
  dependenceBreakBlocks:true,
  lineageRecomputeRequired:true,
  zeroPermutationPRejected:true,
  pipelineReplayMismatchBlocks:true,
  unresolvedFalsifierDisagreementBlocks:true,
  plusOnePForZeroExceedancesM99:seedOut.pValue,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
