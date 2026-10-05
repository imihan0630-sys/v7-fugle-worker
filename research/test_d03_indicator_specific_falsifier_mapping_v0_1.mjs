import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec=JSON.parse(readFileSync(new URL('./d03_indicator_specific_falsifier_mapping_20261006_v0_1.json',import.meta.url)));
const byFamily=new Map(spec.mappings.map(x=>[x.family,x]));

export function validateIndicatorFalsifier({family,method,descendantsRecomputed=true,clockSymmetry=true,continuitySymmetry=true}={}){
  const m=byFamily.get(family);
  if(!m) throw new Error('UNKNOWN_FAMILY');
  if(m.invalidPrimary.includes(method)) return {status:'REJECT_INVALID_PRIMARY',family,method};
  if(!m.plausiblePrimary.includes(method)) return {status:'UNREGISTERED_METHOD_REQUIRES_D16_REVIEW',family,method};
  if(spec.universalRules.descendantRecomputeRequiredWhenPrimitivePerturbed&&descendantsRecomputed!==true) return {status:'REJECT_DESCENDANT_RECOMPUTE_MISSING',family,method};
  if(clockSymmetry!==true) return {status:'REJECT_CLOCK_ASYMMETRY',family,method};
  if(continuitySymmetry!==true) return {status:'REJECT_CONTINUITY_ASYMMETRY',family,method};
  return {status:'METHOD_CLASS_PLAUSIBLE_NOT_EMPIRICALLY_APPROVED',family,method};
}

assert.equal(validateIndicatorFalsifier({family:'BOLLINGER_LOCATION_WIDTH',method:'COMPONENTWISE_FIELD_SHUFFLE'}).status,'REJECT_INVALID_PRIMARY');
assert.equal(validateIndicatorFalsifier({family:'BOLLINGER_LOCATION_WIDTH',method:'PATH_LEVEL_SURROGATE'}).status,'METHOD_CLASS_PLAUSIBLE_NOT_EMPIRICALLY_APPROVED');
assert.equal(validateIndicatorFalsifier({family:'ADX_DIRECTION_RANGE',method:'COMPONENTWISE_DM_TR_SHUFFLE'}).status,'REJECT_INVALID_PRIMARY');
assert.equal(validateIndicatorFalsifier({family:'ADX_DIRECTION_RANGE',method:'FINAL_ADX_VALUE_SHUFFLE'}).status,'REJECT_INVALID_PRIMARY');
assert.equal(validateIndicatorFalsifier({family:'ADX_DIRECTION_RANGE',method:'PATH_LEVEL_SURROGATE'}).status,'METHOD_CLASS_PLAUSIBLE_NOT_EMPIRICALLY_APPROVED');
assert.equal(validateIndicatorFalsifier({family:'PRICE_VOLUME',method:'RAW_VOLUME_GLOBAL_SHUFFLE'}).status,'REJECT_INVALID_PRIMARY');
assert.equal(validateIndicatorFalsifier({family:'PRICE_VOLUME',method:'CONDITIONAL_PERMUTATION'}).status,'METHOD_CLASS_PLAUSIBLE_NOT_EMPIRICALLY_APPROVED');
assert.equal(validateIndicatorFalsifier({family:'NESTED_TIMEFRAME',method:'FINAL_TIMEFRAME_INDICATOR_SHUFFLE_WITHOUT_ANCESTRY_CONTROL'}).status,'REJECT_INVALID_PRIMARY');
assert.equal(validateIndicatorFalsifier({family:'OSCILLATOR_TREND',method:'DERIVED_OSCILLATOR_SHUFFLE'}).status,'REJECT_INVALID_PRIMARY');
assert.equal(validateIndicatorFalsifier({family:'DIVERGENCE',method:'DIVERGENCE_LABEL_SHUFFLE'}).status,'REJECT_INVALID_PRIMARY');
assert.equal(validateIndicatorFalsifier({family:'DIVERGENCE',method:'PIVOT_RECOMPUTED_PATH_SURROGATE',descendantsRecomputed:false}).status,'REJECT_DESCENDANT_RECOMPUTE_MISSING');
assert.equal(validateIndicatorFalsifier({family:'BOLLINGER_LOCATION_WIDTH',method:'PATH_LEVEL_SURROGATE',clockSymmetry:false}).status,'REJECT_CLOCK_ASYMMETRY');
assert.equal(validateIndicatorFalsifier({family:'ADX_DIRECTION_RANGE',method:'PATH_LEVEL_SURROGATE',continuitySymmetry:false}).status,'REJECT_CONTINUITY_ASYMMETRY');
assert.equal(validateIndicatorFalsifier({family:'PRICE_VOLUME',method:'UNSEEN_MAGIC_SHUFFLE'}).status,'UNREGISTERED_METHOD_REQUIRES_D16_REVIEW');

console.log(JSON.stringify({
 status:'PASS',
 cases:14,
 bollingerComponentShuffleRejected:true,
 adxDmTrShuffleRejected:true,
 rawVolumeGlobalShuffleRejected:true,
 descendantRecomputeRequired:true,
 clockContinuitySymmetryRequired:true,
 formalCoreImpact:'NONE_LOCKED',
 outcomeDataUsed:false
}));
