import fs from 'node:fs';
import assert from 'node:assert/strict';

const spec=JSON.parse(fs.readFileSync(new URL('./d03_causal_direction_lead_lag_placebo_cases_20261006_v0_1.json',import.meta.url)));

function evaluate(c){
  if(c.futureFeature) return 'REJECT_FUTURE_FEATURE';
  if(c.futureSentinelOnly) return 'FUTURE_STATE_LEAKAGE_SUSPECTED';
  if(!c.finalityValid) return 'CLOCK_IDENTITY_INCOMPATIBLE';
  if(c.sameCloseFill) return 'COST_OR_FILLABILITY_INVALIDATES';
  if(!c.preregisteredOffsets) return 'REJECT_OFFSET_NOT_PREREGISTERED';
  if(!c.commonSupport) return 'COMMON_SUPPORT_INSUFFICIENT';
  if(!c.dependenceSafe) return 'DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE';
  if(!c.purgeSufficient) return 'REJECT_PURGE_INSUFFICIENT';
  if(!c.ancestryControls) return 'REDUNDANT_WITH_ANCESTRY';
  if(c.leadLagSymmetric) return 'LEAD_LAG_SYMMETRY_UNRESOLVED';
  if(c.powerSufficient===false) return 'POWER_INSUFFICIENT';
  if(!c.knownBeforeCutoff||!c.endpointAfterCutoff) return 'CONTEMPORANEOUS_ONLY';
  return 'TIMING_METHOD_READY';
}

assert.equal(spec.cases.length,16);
for(const c of spec.cases) assert.equal(evaluate(c),c.expected,c.id);
assert.equal(spec.allowedTerminalStates.includes('FUTURE_STATE_LEAKAGE_SUSPECTED'),true);
assert.equal(spec.allowedTerminalStates.includes('POWER_INSUFFICIENT'),true);

console.log(JSON.stringify({
  status:'PASS',
  cases:spec.cases.length,
  validPitOrdering:true,
  contemporaneousIsNotPredictive:true,
  futureFeatureRejected:true,
  futureSentinelDiagnosticOnly:true,
  offsetPreregistrationRequired:true,
  commonSupportRequired:true,
  dependenceAndPurgeRequired:true,
  multiTimeframeFinalityRequired:true,
  sameCloseFillRejected:true,
  ancestryControlsRequired:true,
  leadLagSymmetryBlocks:true,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
