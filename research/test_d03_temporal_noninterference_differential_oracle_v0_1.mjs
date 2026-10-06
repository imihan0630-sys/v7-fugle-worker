import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec=JSON.parse(readFileSync(new URL('./d03_temporal_noninterference_differential_oracle_20261006_v0_1.json',import.meta.url)));

function validateTwoRun(r){
  if(!r||typeof r!=='object') throw new Error('RECEIPT_REQUIRED');
  for(const f of spec.requiredReceiptFields){
    if(!(f in r)||r[f]===null||r[f]===undefined||r[f]==='') throw new Error('MISSING_FIELD:'+f);
  }
  if(!spec.allowedTerminalStates.includes(r.terminalState)) throw new Error('INVALID_TERMINAL_STATE');
  if(r.worldAPrefixHash!==r.worldBPrefixHash) throw new Error('PREFIX_MISMATCH_NOT_FUTURE_ONLY_PERTURBATION');
  if(r.futureSentinelAccepted===true) return {status:'TEMPORAL_NONINTERFERENCE_FAIL'};
  if(r.randomnessControlled!==true) return {status:'NONDETERMINISTIC_REPLAY_UNRESOLVED'};

  if(r.outputSemanticHashA===r.outputSemanticHashB){
    return {status:'REGISTERED_CHANNELS_CLEAR'};
  }

  switch(r.earliestDifferenceLayer){
    case 'OUTCOME_TO_FEATURE': return {status:'OUTCOME_TO_FEATURE_LEAKAGE'};
    case 'CACHE': return {status:'FUTURE_CACHE_STATE_CONTAMINATION'};
    case 'CORPORATE_ACTION': return {status:'FUTURE_CORPORATE_ACTION_REWRITE'};
    case 'SOURCE_VERSION': return {status:'FUTURE_VERSION_REWRITE'};
    case 'UNIVERSE': return {status:'FUTURE_UNIVERSE_SURVIVORSHIP_LEAK'};
    case 'NORMALIZATION': return {status:'FUTURE_NORMALIZATION_LEAK'};
    case 'REGIME': return {status:'FUTURE_REGIME_LABEL_LEAK'};
    case 'FINALITY': return {status:'FINALITY_BACKFILL_LEAK'};
    default: return {status:'TEMPORAL_NONINTERFERENCE_FAIL'};
  }
}

const base={
  receiptVersion:'R1',
  decisionEpoch:'2026-09-30T13:40:00+08:00',
  decisionClockVersion:'DC1',
  authorizedInformationSetHash:'AUTH1',
  worldAPrefixHash:'PREFIX1',
  worldBPrefixHash:'PREFIX1',
  futurePerturbationFamilyId:'FUTURE_PRICE_PATH',
  futurePerturbationFamilyVersion:'V1',
  outputSemanticHashA:'OUT1',
  outputSemanticHashB:'OUT1',
  factorId:'D03-08',
  factorVersion:'FV1',
  sourceVersion:'SRC1',
  continuityVersion:'CONT1',
  calendarVersion:'CAL1',
  modelPreprocessingVersion:'PREP1',
  trainingCutoff:'2026-09-30T13:40:00+08:00',
  randomSeedLedgerHash:'SEED1',
  terminalState:'REGISTERED_CHANNELS_CLEAR',
  futureSentinelAccepted:false,
  randomnessControlled:true,
  earliestDifferenceLayer:'NONE'
};

assert.equal(validateTwoRun(base).status,'REGISTERED_CHANNELS_CLEAR');
assert.throws(()=>validateTwoRun({...base,worldBPrefixHash:'DIFF'}),/PREFIX_MISMATCH/);
assert.equal(validateTwoRun({...base,futureSentinelAccepted:true}).status,'TEMPORAL_NONINTERFERENCE_FAIL');
assert.equal(validateTwoRun({...base,randomnessControlled:false}).status,'NONDETERMINISTIC_REPLAY_UNRESOLVED');

for(const [layer,status] of [
  ['OUTCOME_TO_FEATURE','OUTCOME_TO_FEATURE_LEAKAGE'],
  ['CACHE','FUTURE_CACHE_STATE_CONTAMINATION'],
  ['CORPORATE_ACTION','FUTURE_CORPORATE_ACTION_REWRITE'],
  ['SOURCE_VERSION','FUTURE_VERSION_REWRITE'],
  ['UNIVERSE','FUTURE_UNIVERSE_SURVIVORSHIP_LEAK'],
  ['NORMALIZATION','FUTURE_NORMALIZATION_LEAK'],
  ['REGIME','FUTURE_REGIME_LABEL_LEAK'],
  ['FINALITY','FINALITY_BACKFILL_LEAK'],
  ['INDICATOR_COMPUTE','TEMPORAL_NONINTERFERENCE_FAIL']
]){
  assert.equal(validateTwoRun({...base,outputSemanticHashB:'OUT2',earliestDifferenceLayer:layer}).status,status);
}

const perturbationCases=[
  'FUTURE_OUTCOME',
  'FUTURE_PRICE_PATH',
  'FUTURE_ROLLING_WINDOW_INPUT',
  'FUTURE_CROSS_SECTION_MEMBER',
  'FUTURE_UNIVERSE_MEMBERSHIP',
  'FUTURE_CORPORATE_ACTION',
  'FUTURE_SOURCE_CORRECTION',
  'FUTURE_CALENDAR_REVISION',
  'FUTURE_CACHE_LOAD',
  'FUTURE_MODEL_TRAINING_DATA',
  'FUTURE_HYPERPARAMETER_LABEL',
  'FUTURE_REGIME_INPUT',
  'FUTURE_PIVOT_CONFIRMATION_PATH',
  'FUTURE_HIGHER_TIMEFRAME_COMPLETION',
  'FUTURE_PROVISIONAL_TO_FINAL_EVOLUTION'
];
for(const p of perturbationCases){
  assert.ok(spec.perturbationFamilies.includes(p),p);
}

assert.equal(spec.factorPerturbationMapping.find(x=>x.family==='DIVERGENCE').factors.includes('D03-12'),true);
assert.equal(spec.factorPerturbationMapping.find(x=>x.family==='MULTITIMEFRAME').factors.includes('D03-13'),true);
assert.equal(spec.factorPerturbationMapping.find(x=>x.family==='OUTCOME_RELATION').predictorUseAllowed,false);
assert.equal(spec.invariants.fullSampleNormalizationForbidden,true);
assert.equal(spec.invariants.survivorUniverseBackfillForbidden,true);
assert.equal(spec.invariants.passingFiniteSentinelsProvesUniversalFreedom,false);

console.log(JSON.stringify({
  status:'PASS',
  coreAdversarialCases:13,
  registeredFuturePerturbationFamilies:15,
  factorMappingChecks:3,
  governanceChecks:3,
  totalChecks:34,
  futureOutcomeLeakDetected:true,
  cacheContaminationDetected:true,
  corporateActionRewriteDetected:true,
  survivorLeakDetected:true,
  normalizationLeakDetected:true,
  regimeLeakDetected:true,
  finalityBackfillDetected:true,
  finiteSentinelPassIsNotUniversalProof:true,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
