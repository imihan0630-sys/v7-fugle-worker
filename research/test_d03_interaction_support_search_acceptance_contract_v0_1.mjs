import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec = JSON.parse(
  readFileSync(new URL('./d03_interaction_support_search_acceptance_contract_20261006_v0_1.json', import.meta.url))
);

const nonempty=v=>typeof v==='string'&&v.trim().length>0;

export function bindInteractionAcceptance({supportReceipt,searchReceipt,incrementReceipt}={}){
  if(!supportReceipt||!searchReceipt||!incrementReceipt) throw new Error('ALL_RECEIPTS_REQUIRED');
  const fields=spec.requiredIdentityBindings;
  for(const f of fields){
    for(const [name,r] of [['support',supportReceipt],['search',searchReceipt],['increment',incrementReceipt]]){
      if(!(f in r)||r[f]===null||r[f]===undefined||(typeof r[f]==='string'&&!nonempty(r[f]))){
        throw new Error('MISSING_BINDING:'+name+':'+f);
      }
    }
    const vals=[supportReceipt[f],searchReceipt[f],incrementReceipt[f]].map(x=>JSON.stringify(x));
    if(new Set(vals).size!==1) throw new Error('INTERACTION_ACCEPTANCE_RECEIPT_BINDING_MISMATCH:'+f);
  }

  if(supportReceipt.terminalState!=='SUPPORT_READY') {
    return Object.freeze({status:'BLOCKED_SUPPORT',thirdUnitReviewEligible:false,formalCoreImpact:'NONE_LOCKED'});
  }
  if(!['SEARCH_GENEALOGY_VALID','EXPLORATORY_ONLY'].includes(searchReceipt.terminalState)) {
    return Object.freeze({status:'BLOCKED_SEARCH_GENEALOGY',thirdUnitReviewEligible:false,formalCoreImpact:'NONE_LOCKED'});
  }
  if(searchReceipt.deletedOutcomeInspectedVariantCount!==0||searchReceipt.aliasResetAllowed===true) {
    throw new Error('SEARCH_LEDGER_INTEGRITY_FAIL');
  }
  if(searchReceipt.winnerSelected===true){
    if(searchReceipt.selectionPeriodCalledUntouchedValidation===true) throw new Error('WINNER_SELECTION_PERIOD_REUSE_FORBIDDEN');
    if(searchReceipt.freshPostSelectionEvidenceAvailable!==true&&searchReceipt.preFrozenSelectiveInferenceDesign!==true){
      return Object.freeze({status:'FRESH_POST_SELECTION_EVIDENCE_REQUIRED',thirdUnitReviewEligible:false,formalCoreImpact:'NONE_LOCKED'});
    }
  }
  if(incrementReceipt.interactionIncrementGuardPass!==true) {
    return Object.freeze({status:'BLOCKED_INCREMENT_GUARD',thirdUnitReviewEligible:false,formalCoreImpact:'NONE_LOCKED'});
  }
  if(incrementReceipt.selectionIdentificationPass!==true) {
    return Object.freeze({status:'BLOCKED_SELECTION_IDENTIFICATION',thirdUnitReviewEligible:false,formalCoreImpact:'NONE_LOCKED'});
  }
  if(incrementReceipt.genuineOosOrProspectiveEvidence!==true) {
    return Object.freeze({status:'GENUINE_EVIDENCE_PENDING',thirdUnitReviewEligible:false,formalCoreImpact:'NONE_LOCKED'});
  }
  if(searchReceipt.terminalState==='EXPLORATORY_ONLY') {
    return Object.freeze({status:'EXPLORATORY_ONLY_NO_CONFIRMATORY_PROMOTION',thirdUnitReviewEligible:false,formalCoreImpact:'NONE_LOCKED'});
  }
  if(searchReceipt.localMultiplicityDisposition!=='PASS') {
    return Object.freeze({status:'LOCAL_MULTIPLICITY_PENDING',thirdUnitReviewEligible:false,formalCoreImpact:'NONE_LOCKED'});
  }
  if(searchReceipt.outerStreamDisposition!=='PASS') {
    return Object.freeze({status:'OUTER_STREAM_PENDING',thirdUnitReviewEligible:false,formalCoreImpact:'NONE_LOCKED'});
  }
  if(incrementReceipt.room00ClosureState!=='PASS') {
    return Object.freeze({status:'ROOM00_CLOSURE_PENDING',thirdUnitReviewEligible:false,formalCoreImpact:'NONE_LOCKED'});
  }

  return Object.freeze({
    status:'THIRD_UNIT_REVIEW_ELIGIBLE',
    thirdUnitReviewEligible:true,
    formalCoreImpact:'NONE_LOCKED'
  });
}

const ids={
  interactionFamilyId:'IF1',
  interactionVersion:'I1',
  interactionSearchFamilyId:'ISF1',
  variantId:'V1',
  variantVersion:'1',
  componentPairHash:'a'.repeat(64),
  formulaIdentityHash:'b'.repeat(64),
  parameterCandidateSetHash:'c'.repeat(64),
  targetPopulationHash:'d'.repeat(64),
  commonSupportHash:'e'.repeat(64),
  consumerScopeHash:'f'.repeat(64),
  estimandScope:'TARGET_POPULATION_ESTIMAND',
  outcomeHorizonId:'D5',
  multipleTestingFamilyId:'MTF1',
  researchStreamId:'RS1',
  supportFloorPreregistrationHash:'1'.repeat(64),
  supportSelectionPolicyHash:'2'.repeat(64),
  d16MethodReceiptHash:'3'.repeat(64),
  sda016ConsumptionRef:'SDA016-C1'
};
const support={...ids,terminalState:'SUPPORT_READY'};
const search={
  ...ids,
  terminalState:'SEARCH_GENEALOGY_VALID',
  deletedOutcomeInspectedVariantCount:0,
  aliasResetAllowed:false,
  winnerSelected:false,
  selectionPeriodCalledUntouchedValidation:false,
  freshPostSelectionEvidenceAvailable:false,
  preFrozenSelectiveInferenceDesign:false,
  localMultiplicityDisposition:'PASS',
  outerStreamDisposition:'PASS'
};
const inc={
  ...ids,
  interactionIncrementGuardPass:true,
  selectionIdentificationPass:true,
  genuineOosOrProspectiveEvidence:true,
  room00ClosureState:'PASS'
};

assert.equal(bindInteractionAcceptance({supportReceipt:support,searchReceipt:search,incrementReceipt:inc}).status,'THIRD_UNIT_REVIEW_ELIGIBLE');

const mismatch={...support,commonSupportHash:'9'.repeat(64)};
assert.throws(()=>bindInteractionAcceptance({supportReceipt:mismatch,searchReceipt:search,incrementReceipt:inc}),/BINDING_MISMATCH:commonSupportHash/);

assert.equal(bindInteractionAcceptance({
  supportReceipt:{...support,terminalState:'POWER_INSUFFICIENT'},
  searchReceipt:search,incrementReceipt:inc
}).status,'BLOCKED_SUPPORT');

assert.equal(bindInteractionAcceptance({
  supportReceipt:support,
  searchReceipt:{...search,terminalState:'FRESH_POST_SELECTION_EVIDENCE_REQUIRED'},
  incrementReceipt:inc
}).status,'BLOCKED_SEARCH_GENEALOGY');

assert.equal(bindInteractionAcceptance({
  supportReceipt:support,searchReceipt:search,
  incrementReceipt:{...inc,interactionIncrementGuardPass:false}
}).status,'BLOCKED_INCREMENT_GUARD');

assert.equal(bindInteractionAcceptance({
  supportReceipt:support,searchReceipt:search,
  incrementReceipt:{...inc,selectionIdentificationPass:false}
}).status,'BLOCKED_SELECTION_IDENTIFICATION');

assert.equal(bindInteractionAcceptance({
  supportReceipt:support,searchReceipt:search,
  incrementReceipt:{...inc,genuineOosOrProspectiveEvidence:false}
}).status,'GENUINE_EVIDENCE_PENDING');

assert.equal(bindInteractionAcceptance({
  supportReceipt:support,
  searchReceipt:{...search,researchStreamId:'EXPLORATORY_ONLY',terminalState:'EXPLORATORY_ONLY'},
  incrementReceipt:{...inc,researchStreamId:'EXPLORATORY_ONLY'}
}).status,'EXPLORATORY_ONLY_NO_CONFIRMATORY_PROMOTION');

const winNoFresh={...search,winnerSelected:true,freshPostSelectionEvidenceAvailable:false,preFrozenSelectiveInferenceDesign:false};
assert.equal(bindInteractionAcceptance({supportReceipt:support,searchReceipt:winNoFresh,incrementReceipt:inc}).status,'FRESH_POST_SELECTION_EVIDENCE_REQUIRED');

assert.throws(()=>bindInteractionAcceptance({
  supportReceipt:support,
  searchReceipt:{...search,winnerSelected:true,selectionPeriodCalledUntouchedValidation:true,freshPostSelectionEvidenceAvailable:true},
  incrementReceipt:inc
}),/WINNER_SELECTION_PERIOD_REUSE/);

assert.equal(bindInteractionAcceptance({
  supportReceipt:support,
  searchReceipt:{...search,localMultiplicityDisposition:'PENDING'},
  incrementReceipt:inc
}).status,'LOCAL_MULTIPLICITY_PENDING');

assert.equal(bindInteractionAcceptance({
  supportReceipt:support,
  searchReceipt:{...search,outerStreamDisposition:'PENDING'},
  incrementReceipt:inc
}).status,'OUTER_STREAM_PENDING');

assert.equal(bindInteractionAcceptance({
  supportReceipt:support,
  searchReceipt:search,
  incrementReceipt:{...inc,room00ClosureState:'PENDING'}
}).status,'ROOM00_CLOSURE_PENDING');

console.log(JSON.stringify({
  status:'PASS',
  cases:13,
  exactBindingRequired:true,
  supportAndSearchMustReferenceSameVariant:true,
  exploratoryCannotConfirm:true,
  freshWinnerEvidenceRequired:true,
  room00ClosureRequired:true,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
