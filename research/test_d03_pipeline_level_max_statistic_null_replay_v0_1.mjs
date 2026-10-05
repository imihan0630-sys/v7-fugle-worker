import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec=JSON.parse(readFileSync(new URL('./d03_pipeline_level_max_statistic_null_replay_contract_20261006_v0_1.json',import.meta.url)));
const nonempty=v=>typeof v==='string'&&v.trim().length>0;

function req(x,fields,prefix){
  for(const f of fields){
    if(!(f in x)) throw new Error(`MISSING_${prefix}_FIELD:${f}`);
    if(typeof x[f]==='string'&&!nonempty(x[f])) throw new Error(`EMPTY_${prefix}_FIELD:${f}`);
  }
}

export function evaluatePipelineNull(x){
  if(!x||typeof x!=='object') throw new Error('INPUT_REQUIRED');
  req(x,spec.requiredPipelineIdentity,'PIPELINE');

  const searched=x.observedCandidateCount>1||x.thresholdTuned||x.windowTuned||x.horizonSelected||x.representationSelected||x.rankSelected||x.tradingPolicySelected;
  if(searched&&x.nullReplayMode==='FIXED_WINNER') throw new Error('FIXED_WINNER_NULL_AFTER_SEARCH');

  if(x.nullGeneratorPass!==true){
    return {status:'NULL_GENERATOR_BLOCKED',promotionFalsifierEligible:false};
  }

  for(const k of [
    'sameCandidateUniversePolicy','sameSupportPolicy','sameFitRule','sameTuningRule',
    'sameSplitChronology','sameSelectionMetric','sameTieBreak','sameCostFillabilityRule',
    'sameStatisticScale','sameClockSemantics'
  ]){
    if(x[k]!==true) return {status:k==='sameStatisticScale'?'STATISTIC_SCALE_MISMATCH':'PIPELINE_ASYMMETRY',promotionFalsifierEligible:false};
  }

  if(x.supportDrawPolicySpecified!==true) return {status:'SUPPORT_DRAW_POLICY_UNSPECIFIED',promotionFalsifierEligible:false};
  if(x.computationalShortcutUsed===true&&x.computationalShortcutValidated!==true) return {status:'COMPUTATIONAL_SHORTCUT_UNVALIDATED',promotionFalsifierEligible:false};

  if(searched){
    if(x.nullReplayMode!=='FULL_PIPELINE') return {status:'FULL_PIPELINE_REPLAY_REQUIRED',promotionFalsifierEligible:false};
    if(x.nullCandidateUniverseHash!==x.candidateUniverseHash) return {status:'PIPELINE_ASYMMETRY',promotionFalsifierEligible:false};
    if(x.nullAllowsDifferentWinner!==true) return {status:'PIPELINE_ASYMMETRY',promotionFalsifierEligible:false};
  }

  if(!searched&&x.nullReplayMode==='FIXED_CANDIDATE'){
    return {status:'FIXED_CANDIDATE_NULL_ELIGIBLE',promotionFalsifierEligible:true};
  }

  if(x.drawLedgerAppendOnly!==true||x.failedDrawsVisible!==true||x.retryPolicyPreregistered!==true) {
    return {status:'PIPELINE_ASYMMETRY',promotionFalsifierEligible:false};
  }

  return {status:'PIPELINE_NULL_READY',promotionFalsifierEligible:true};
}

const base={
  candidateUniverseHash:'CU1',
  supportPolicyHash:'SP1',
  fitRuleHash:'FIT1',
  tuningRuleHash:'TUNE1',
  splitRuleHash:'SPLIT1',
  evaluationMetricHash:'METRIC1',
  selectionStatisticHash:'MAXT1',
  tieBreakRuleHash:'TIE1',
  costFillabilityRuleHash:'COST1',
  nullGeneratorRef:'NULL1',
  searchGenealogyRef:'SEARCH1',
  observedCandidateCount:54,
  thresholdTuned:true,
  windowTuned:true,
  horizonSelected:true,
  representationSelected:false,
  rankSelected:false,
  tradingPolicySelected:false,
  nullReplayMode:'FULL_PIPELINE',
  nullGeneratorPass:true,
  sameCandidateUniversePolicy:true,
  sameSupportPolicy:true,
  sameFitRule:true,
  sameTuningRule:true,
  sameSplitChronology:true,
  sameSelectionMetric:true,
  sameTieBreak:true,
  sameCostFillabilityRule:true,
  sameStatisticScale:true,
  sameClockSemantics:true,
  supportDrawPolicySpecified:true,
  computationalShortcutUsed:false,
  computationalShortcutValidated:false,
  nullCandidateUniverseHash:'CU1',
  nullAllowsDifferentWinner:true,
  drawLedgerAppendOnly:true,
  failedDrawsVisible:true,
  retryPolicyPreregistered:true
};

assert.equal(evaluatePipelineNull(base).status,'PIPELINE_NULL_READY');
assert.throws(()=>evaluatePipelineNull({...base,nullReplayMode:'FIXED_WINNER'}),/FIXED_WINNER_NULL_AFTER_SEARCH/);
assert.equal(evaluatePipelineNull({...base,nullGeneratorPass:false}).status,'NULL_GENERATOR_BLOCKED');
assert.equal(evaluatePipelineNull({...base,sameCandidateUniversePolicy:false}).status,'PIPELINE_ASYMMETRY');
assert.equal(evaluatePipelineNull({...base,sameSupportPolicy:false}).status,'PIPELINE_ASYMMETRY');
assert.equal(evaluatePipelineNull({...base,sameTuningRule:false}).status,'PIPELINE_ASYMMETRY');
assert.equal(evaluatePipelineNull({...base,sameSplitChronology:false}).status,'PIPELINE_ASYMMETRY');
assert.equal(evaluatePipelineNull({...base,sameCostFillabilityRule:false}).status,'PIPELINE_ASYMMETRY');
assert.equal(evaluatePipelineNull({...base,sameStatisticScale:false}).status,'STATISTIC_SCALE_MISMATCH');
assert.equal(evaluatePipelineNull({...base,supportDrawPolicySpecified:false}).status,'SUPPORT_DRAW_POLICY_UNSPECIFIED');
assert.equal(evaluatePipelineNull({...base,computationalShortcutUsed:true,computationalShortcutValidated:false}).status,'COMPUTATIONAL_SHORTCUT_UNVALIDATED');
assert.equal(evaluatePipelineNull({...base,nullCandidateUniverseHash:'CU2'}).status,'PIPELINE_ASYMMETRY');
assert.equal(evaluatePipelineNull({...base,nullAllowsDifferentWinner:false}).status,'PIPELINE_ASYMMETRY');
assert.equal(evaluatePipelineNull({...base,drawLedgerAppendOnly:false}).status,'PIPELINE_ASYMMETRY');

const fixed={
  ...base,
  observedCandidateCount:1,
  thresholdTuned:false,
  windowTuned:false,
  horizonSelected:false,
  representationSelected:false,
  rankSelected:false,
  tradingPolicySelected:false,
  nullReplayMode:'FIXED_CANDIDATE'
};
assert.equal(evaluatePipelineNull(fixed).status,'FIXED_CANDIDATE_NULL_ELIGIBLE');

console.log(JSON.stringify({
  status:'PASS',
  cases:15,
  fullReplayRequiredAfterSearch:true,
  fixedCandidateAllowedOnlyWhenActuallyFixed:true,
  nullCanSelectDifferentWinner:true,
  supportAndCostSymmetryRequired:true,
  statisticScaleMustMatch:true,
  failedNullDrawsRemainVisible:true,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
