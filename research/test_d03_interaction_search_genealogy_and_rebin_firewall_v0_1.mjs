import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec = JSON.parse(
  readFileSync(new URL('./d03_interaction_search_genealogy_and_rebin_firewall_20261006_v0_1.json', import.meta.url))
);

const nonempty=v=>typeof v==='string'&&v.trim().length>0;
const hex64=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);

function req(x, fields, prefix){
  for(const f of fields){
    if(!(f in x)) throw new Error(`MISSING_${prefix}_FIELD:${f}`);
    if(typeof x[f]==='string'&&!nonempty(x[f])) throw new Error(`EMPTY_${prefix}_FIELD:${f}`);
  }
}

export function validateSearchFamily(family){
  if(!family||typeof family!=='object') throw new Error('FAMILY_REQUIRED');
  req(family,spec.requiredSearchFamilyFields,'FAMILY');
  if(!Array.isArray(family.variants)) throw new Error('VARIANTS_REQUIRED');
  if(family.researchStreamId!=='EXPLORATORY_ONLY'&&!nonempty(family.researchStreamId)) throw new Error('RESEARCH_STREAM_REQUIRED');

  const seen=new Set(), inspected=[];
  for(const v of family.variants){
    req(v,spec.requiredVariantFields,'VARIANT');
    const key=v.variantId+'@'+v.variantVersion;
    if(seen.has(key)) throw new Error('DUPLICATE_VARIANT_ID_VERSION');
    seen.add(key);
    if(!spec.allowedBirthReasonCodes.includes(v.birthReasonCode)) throw new Error('INVALID_BIRTH_REASON');
    if(!spec.resultStates.includes(v.resultState)) throw new Error('INVALID_RESULT_STATE');

    if(v.birthReasonCode==='OUTCOME_BLIND_SUPPORT_REDESIGN'){
      if(v.outcomeAccessed!==false) throw new Error('OUTCOME_BLIND_REDESIGN_WITH_OUTCOME_ACCESS');
      if(!Array.isArray(v.parentVariantRefs)||!v.parentVariantRefs.length) throw new Error('SUPPORT_REDESIGN_PARENT_REQUIRED');
      for(const f of ['supportSelectionPolicyHash','consideredCandidateSetHash','deterministicSelectionCriterion','tieBreakRuleHash']){
        if(!nonempty(v[f])) throw new Error('SUPPORT_SELECTION_POLICY_INCOMPLETE:'+f);
      }
    }

    if(v.birthReasonCode==='OUTCOME_DRIVEN_REDESIGN'){
      if(!Array.isArray(v.priorOutcomeReleaseRefsKnownAtBirth)||!v.priorOutcomeReleaseRefsKnownAtBirth.length){
        throw new Error('OUTCOME_DRIVEN_REDESIGN_RELEASE_LINEAGE_REQUIRED');
      }
      if(v.holdoutState!=='DEVELOPMENT_CONSUMED') throw new Error('OUTCOME_DRIVEN_REDESIGN_HOLDOUT_MUST_BE_CONSUMED');
      if(v.reuseSameHoldoutAsUntouched===true) throw new Error('CONSUMED_HOLDOUT_REUSE_FORBIDDEN');
    }

    if(v.outcomeAccessed===true){
      inspected.push(key);
      if(v.deleted===true) throw new Error('OUTCOME_INSPECTED_VARIANT_DELETION_FORBIDDEN');
      if(!nonempty(v.consumptionRef)) throw new Error('OUTCOME_INSPECTED_CONSUMPTION_REF_REQUIRED');
    }
  }

  if(family.deletedOutcomeInspectedVariantCount!==0) throw new Error('SEARCH_LEDGER_ATTRITION');
  if(family.aliasResetAllowed===true) throw new Error('ALIAS_RESET_FORBIDDEN');

  if(family.winnerSelected===true){
    if(!nonempty(family.winnerVariantRef)) throw new Error('WINNER_REF_REQUIRED');
    if(family.selectionPeriodCalledUntouchedValidation===true) throw new Error('WINNER_SELECTION_PERIOD_REUSE_FORBIDDEN');
    if(family.freshPostSelectionEvidenceAvailable!==true &&
       family.preFrozenSelectiveInferenceDesign!==true){
      return Object.freeze({
        status:'PASS',
        terminalState:'FRESH_POST_SELECTION_EVIDENCE_REQUIRED',
        confirmatoryWinnerEligible:false,
        inspectedVariantCount:inspected.length,
        formalCoreImpact:'NONE_LOCKED'
      });
    }
  }

  if(family.localMultiplicityDisposition!=='PASS'&&family.researchStreamId!=='EXPLORATORY_ONLY'){
    return Object.freeze({
      status:'PASS',
      terminalState:'LOCAL_MULTIPLICITY_PENDING',
      confirmatoryWinnerEligible:false,
      inspectedVariantCount:inspected.length,
      formalCoreImpact:'NONE_LOCKED'
    });
  }

  if(family.researchStreamId!=='EXPLORATORY_ONLY'&&family.outerStreamDisposition!=='PASS'){
    return Object.freeze({
      status:'PASS',
      terminalState:'OUTER_STREAM_CONTROL_PENDING',
      confirmatoryWinnerEligible:false,
      inspectedVariantCount:inspected.length,
      formalCoreImpact:'NONE_LOCKED'
    });
  }

  return Object.freeze({
    status:'PASS',
    terminalState:family.researchStreamId==='EXPLORATORY_ONLY'?'EXPLORATORY_ONLY':'SEARCH_GENEALOGY_VALID',
    confirmatoryWinnerEligible:
      family.winnerSelected===true &&
      (family.freshPostSelectionEvidenceAvailable===true||family.preFrozenSelectiveInferenceDesign===true) &&
      family.localMultiplicityDisposition==='PASS' &&
      (family.researchStreamId==='EXPLORATORY_ONLY'||family.outerStreamDisposition==='PASS'),
    inspectedVariantCount:inspected.length,
    formalCoreImpact:'NONE_LOCKED'
  });
}

const H=c=>c.repeat(64);
const baseVariant={
  variantId:'PV-INT-1',
  variantVersion:'V1',
  registeredAt:'2026-10-06T06:00:00+08:00',
  parentVariantRefs:[],
  birthReasonCode:'ORIGINAL_PREREGISTERED',
  candidateSource:'D03_PREREG',
  supportDiagnosisRefsKnownAtBirth:[],
  priorOutcomeReleaseRefsKnownAtBirth:[],
  representationClass:'CATEGORICAL_JOINT_CELL',
  formulaIdentityHash:H('1'),
  thresholdIdentityHash:H('2'),
  windowIdentityHash:H('3'),
  horizonIdentityHash:H('4'),
  resultState:'NOT_EVALUATED',
  retirementState:'ACTIVE',
  outcomeAccessed:false
};
const family={
  interactionSearchFamilyId:'ISF-PV-V1',
  multipleTestingFamilyId:'MTF-PV-V1',
  researchStreamId:'RS-D03-INT-V1',
  componentPairHash:H('a'),
  primaryMechanismClaimHash:H('b'),
  allowedSearchAxesHash:H('c'),
  candidateBirthPolicyHash:H('d'),
  retirementRuleHash:H('e'),
  representationChangePolicyHash:H('f'),
  supportOnlyRedesignPolicyHash:H('0'),
  outcomeReleaseBoundaryHash:H('9'),
  variants:[baseVariant],
  deletedOutcomeInspectedVariantCount:0,
  aliasResetAllowed:false,
  winnerSelected:false,
  localMultiplicityDisposition:'PASS',
  outerStreamDisposition:'PASS'
};

assert.equal(validateSearchFamily(family).terminalState,'SEARCH_GENEALOGY_VALID');

const supportChild={
  ...baseVariant,
  variantId:'PV-INT-2',
  variantVersion:'V2',
  registeredAt:'2026-10-06T06:05:00+08:00',
  parentVariantRefs:['PV-INT-1@V1'],
  birthReasonCode:'OUTCOME_BLIND_SUPPORT_REDESIGN',
  supportDiagnosisRefsKnownAtBirth:['SUPPORT-1'],
  supportSelectionPolicyHash:'SUPPORT_POLICY_V1',
  consideredCandidateSetHash:'CANDIDATES_V1',
  deterministicSelectionCriterion:'MAX_SUPPORT_MIN_CONCENTRATION',
  tieBreakRuleHash:'LEXICOGRAPHIC_V1'
};
assert.equal(validateSearchFamily({...family,variants:[baseVariant,supportChild]}).terminalState,'SEARCH_GENEALOGY_VALID');

assert.throws(()=>validateSearchFamily({...family,variants:[baseVariant,{...supportChild,outcomeAccessed:true}]}),/OUTCOME_BLIND_REDESIGN_WITH_OUTCOME_ACCESS/);

const inspectedParent={
  ...baseVariant,
  resultState:'DO_NOT_REJECT',
  outcomeAccessed:true,
  consumptionRef:'CONS-1'
};
const outcomeChild={
  ...supportChild,
  variantId:'PV-INT-3',
  variantVersion:'V3',
  birthReasonCode:'OUTCOME_DRIVEN_REDESIGN',
  priorOutcomeReleaseRefsKnownAtBirth:['REL-1'],
  outcomeAccessed:false,
  holdoutState:'DEVELOPMENT_CONSUMED',
  reuseSameHoldoutAsUntouched:false
};
assert.equal(validateSearchFamily({...family,variants:[inspectedParent,outcomeChild]}).terminalState,'SEARCH_GENEALOGY_VALID');

assert.throws(()=>validateSearchFamily({...family,variants:[inspectedParent,{...outcomeChild,reuseSameHoldoutAsUntouched:true}]}),/CONSUMED_HOLDOUT_REUSE/);
assert.throws(()=>validateSearchFamily({...family,variants:[{...inspectedParent,deleted:true}]}),/OUTCOME_INSPECTED_VARIANT_DELETION/);
assert.throws(()=>validateSearchFamily({...family,deletedOutcomeInspectedVariantCount:1,variants:[inspectedParent]}),/SEARCH_LEDGER_ATTRITION/);
assert.throws(()=>validateSearchFamily({...family,aliasResetAllowed:true}),/ALIAS_RESET/);

const selectedNoFresh=validateSearchFamily({
  ...family,
  variants:[inspectedParent],
  winnerSelected:true,
  winnerVariantRef:'PV-INT-1@V1',
  selectionPeriodCalledUntouchedValidation:false,
  freshPostSelectionEvidenceAvailable:false,
  preFrozenSelectiveInferenceDesign:false
});
assert.equal(selectedNoFresh.terminalState,'FRESH_POST_SELECTION_EVIDENCE_REQUIRED');

assert.throws(()=>validateSearchFamily({
  ...family,
  variants:[inspectedParent],
  winnerSelected:true,
  winnerVariantRef:'PV-INT-1@V1',
  selectionPeriodCalledUntouchedValidation:true,
  freshPostSelectionEvidenceAvailable:true
}),/WINNER_SELECTION_PERIOD_REUSE/);

const localPending=validateSearchFamily({
  ...family,
  variants:[inspectedParent],
  winnerSelected:true,
  winnerVariantRef:'PV-INT-1@V1',
  selectionPeriodCalledUntouchedValidation:false,
  freshPostSelectionEvidenceAvailable:true,
  preFrozenSelectiveInferenceDesign:false,
  localMultiplicityDisposition:'PENDING'
});
assert.equal(localPending.terminalState,'LOCAL_MULTIPLICITY_PENDING');

const outerPending=validateSearchFamily({
  ...family,
  variants:[inspectedParent],
  winnerSelected:true,
  winnerVariantRef:'PV-INT-1@V1',
  selectionPeriodCalledUntouchedValidation:false,
  freshPostSelectionEvidenceAvailable:true,
  preFrozenSelectiveInferenceDesign:false,
  localMultiplicityDisposition:'PASS',
  outerStreamDisposition:'PENDING'
});
assert.equal(outerPending.terminalState,'OUTER_STREAM_CONTROL_PENDING');

const winnerGood=validateSearchFamily({
  ...family,
  variants:[inspectedParent],
  winnerSelected:true,
  winnerVariantRef:'PV-INT-1@V1',
  selectionPeriodCalledUntouchedValidation:false,
  freshPostSelectionEvidenceAvailable:true,
  preFrozenSelectiveInferenceDesign:false,
  localMultiplicityDisposition:'PASS',
  outerStreamDisposition:'PASS'
});
assert.equal(winnerGood.confirmatoryWinnerEligible,true);

const exploratory=validateSearchFamily({
  ...family,researchStreamId:'EXPLORATORY_ONLY',outerStreamDisposition:'NOT_APPLICABLE'
});
assert.equal(exploratory.terminalState,'EXPLORATORY_ONLY');

console.log(JSON.stringify({
  status:'PASS',
  cases:13,
  supportOnlyRedesignWithoutOutcomes:'ALLOWED_WITH_LINEAGE',
  outcomeDrivenRedesign:'CONSUMED_FRESH_EVIDENCE_REQUIRED',
  inspectedVariantDeletion:'REJECT',
  aliasReset:'REJECT',
  winnerSelectionSampleReuse:'REJECT',
  winnerWithoutFreshEvidence:'FRESH_POST_SELECTION_EVIDENCE_REQUIRED',
  localMultiplicityPending:'BLOCK_CONFIRMATORY',
  outerStreamPending:'BLOCK_CONFIRMATORY',
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
