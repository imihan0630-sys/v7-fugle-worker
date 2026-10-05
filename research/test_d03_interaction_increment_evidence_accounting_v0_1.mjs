import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const guard = JSON.parse(
  readFileSync(new URL('./d03_interaction_increment_evidence_accounting_guard_20261006_v0_1.json', import.meta.url))
);

const nonempty = v => typeof v === 'string' && v.trim().length > 0;
const hex64 = v => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);

function requireInteractionFields(x) {
  for (const f of guard.requiredInteractionFields) {
    if (!(f in x)) throw new Error('MISSING_INTERACTION_FIELD:' + f);
    if (typeof x[f] === 'string' && !nonempty(x[f])) throw new Error('EMPTY_INTERACTION_FIELD:' + f);
    if (Array.isArray(x[f]) && !x[f].length) throw new Error('EMPTY_INTERACTION_FIELD:' + f);
  }
  for (const f of [
    'commonSupportHash','jointSupportHash','mainEffectsBaselineHash',
    'd16MethodReceiptHash','d16InteractionIncrementalityReceiptHash',
    'supportRuleHash'
  ]) if (!hex64(x[f])) throw new Error('INVALID_HASH:' + f);
}

function canonicalPair(refs=[]) {
  return refs.map(x => x.factorId + '@' + x.factorVersion).sort().join('|');
}

export function evaluateInteractionEvidence(input) {
  if (!input || typeof input !== 'object') throw new Error('INPUT_REQUIRED');
  const {acceptedMainEffects=[],interactions=[]} = input;
  if (!Array.isArray(acceptedMainEffects) || !Array.isArray(interactions)) throw new Error('ARRAYS_REQUIRED');

  const mainMap = new Map();
  for (const m of acceptedMainEffects) {
    if (!nonempty(m.factorId) || !nonempty(m.factorVersion) || !nonempty(m.informationRoot) || !hex64(m.evidenceReceiptHash)) {
      throw new Error('INVALID_MAIN_EFFECT');
    }
    mainMap.set(m.factorId + '@' + m.factorVersion, m);
  }

  const roots = new Set([...mainMap.values()].map(x => x.informationRoot));
  const acceptedFamilies = new Set();
  const familyResults = [];

  for (const x of interactions) {
    requireInteractionFields(x);
    if (x.independenceStatus === guard.states.forbiddenInteractionSourceState) {
      throw new Error('INTERACTION_SOURCE_INDEPENDENCE_LABEL_FORBIDDEN');
    }
    if (x.independenceStatus !== guard.states.allowedInteractionEvidenceState) {
      familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'NOT_PROVEN',increment:0});
      continue;
    }
    if (!Array.isArray(x.componentRefs) || x.componentRefs.length !== 2) throw new Error('EXACT_TWO_COMPONENT_REFS_REQUIRED');
    if (!Array.isArray(x.componentInformationRoots) || x.componentInformationRoots.length !== 2) throw new Error('EXACT_TWO_COMPONENT_ROOTS_REQUIRED');
    if (!Array.isArray(x.componentEvidenceReceiptHashes) || x.componentEvidenceReceiptHashes.length !== 2) throw new Error('EXACT_TWO_COMPONENT_RECEIPTS_REQUIRED');

    const pair = canonicalPair(x.componentRefs);
    const components = x.componentRefs.map(r => mainMap.get(r.factorId + '@' + r.factorVersion));
    if (components.some(c => !c)) {
      familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'COMPONENT_BINDING_INCOMPLETE',increment:0});
      continue;
    }
    const componentRoots = components.map(c=>c.informationRoot).sort();
    if (componentRoots.join('|') !== [...x.componentInformationRoots].sort().join('|')) throw new Error('COMPONENT_ROOT_MAPPING_MISMATCH');
    const componentReceipts = components.map(c=>c.evidenceReceiptHash).sort();
    if (componentReceipts.join('|') !== [...x.componentEvidenceReceiptHashes].sort().join('|')) throw new Error('COMPONENT_EVIDENCE_RECEIPT_MISMATCH');

    if (x.mainEffectsCompleteComparator !== true) {
      familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'MAIN_EFFECT_BASELINE_INCOMPLETE',increment:0});
      continue;
    }
    if (x.marginalMisspecificationControlled !== true) {
      familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'MAIN_EFFECT_MISSPECIFICATION_NOT_INTERACTION',increment:0});
      continue;
    }
    if (x.jointSupportAdequate !== true) {
      familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'INTERACTION_JOINT_SUPPORT_INSUFFICIENT',increment:0});
      continue;
    }
    if (x.pitClockPass !== true) {
      familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'INTERACTION_PIT_CLOCK_INVALID',increment:0});
      continue;
    }
    if (x.multiplicityFrozen !== true || x.postOutcomeRetuning === true) {
      familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'INTERACTION_MULTIPLICITY_NOT_FROZEN',increment:0});
      continue;
    }
    if (x.selectionIdentificationPass !== true) {
      familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'INTERACTION_SELECTION_IDENTIFICATION_BLOCKED',increment:0});
      continue;
    }
    if (x.estimandScope === 'OBSERVED_SUBPOPULATION_ESTIMAND') {
      familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'INTERACTION_SELECTION_IDENTIFICATION_BLOCKED',increment:0});
      continue;
    }
    if (x.estimandScope === 'RESTRICTED_SUPPORT_ESTIMAND' && x.consumerSupportRuleHash !== x.supportRuleHash) {
      familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'INTERACTION_SELECTION_IDENTIFICATION_BLOCKED',increment:0});
      continue;
    }
    if (x.oosOrProspectivePass !== true || x.dateDependenceAwarePass !== true || x.negativeControlsPass !== true) {
      familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'INTERACTION_VALIDATION_INCOMPLETE',increment:0});
      continue;
    }
    if (x.tradableSelectionImpact === true && x.costFillabilityPass !== true) {
      familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'INTERACTION_COST_FILLABILITY_BLOCKED',increment:0});
      continue;
    }
    if (Date.parse(x.firstObservableAt) < Math.max(...x.componentFirstObservableAt.map(Date.parse))) {
      throw new Error('INTERACTION_PIT_CLOCK_INVALID');
    }

    const familyKey = [x.interactionFamilyId,pair].join('::');
    if (acceptedFamilies.has(familyKey)) {
      familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'DUPLICATE_INTERACTION_FAMILY_ALIAS',increment:0});
      continue;
    }
    acceptedFamilies.add(familyKey);
    familyResults.push({interactionFamilyId:x.interactionFamilyId,state:'RESIDUAL_INTERACTION_INCREMENT_PROVEN',increment:1});
  }

  const provenInteractionIncrementCount=[...familyResults].filter(x=>x.increment===1).length;
  return Object.freeze({
    status:'PASS',
    effectiveIndependentSourceRootCount:roots.size,
    provenInteractionIncrementCount,
    effectiveEvidenceCount:roots.size + provenInteractionIncrementCount,
    familyResults,
    formalCoreImpact:'NONE_LOCKED',
    empiricalInteractionIncrementalityClaimed:false
  });
}

const H = ch => ch.repeat(64);
const t0='2026-10-06T05:00:00+08:00';
const t1='2026-10-06T05:05:00+08:00';
const mains=[
  {factorId:'P',factorVersion:'P1',informationRoot:'PRICE_OHLC',evidenceReceiptHash:H('a')},
  {factorId:'V',factorVersion:'V1',informationRoot:'VOLUME_TURNOVER',evidenceReceiptHash:H('b')}
];

const interaction = {
  interactionHypothesisId:'PV-H1',
  interactionFamilyId:'IF_PV_BREAKOUT_PARTICIPATION_V1',
  interactionVersion:'I1',
  componentRefs:[{factorId:'P',factorVersion:'P1'},{factorId:'V',factorVersion:'V1'}],
  componentInformationRoots:['PRICE_OHLC','VOLUME_TURNOVER'],
  componentEvidenceReceiptHashes:[H('a'),H('b')],
  formulaVersion:'PRODUCT_OR_EQUIVALENT_FROZEN_V1',
  decisionClock:'MAX_COMPONENT_CLOCK',
  firstObservableAt:t1,
  componentFirstObservableAt:[t0,t1],
  commonSupportHash:H('c'),
  jointSupportHash:H('d'),
  mainEffectsBaselineHash:H('e'),
  marginalControlDecision:'FLEXIBLE_MARGINAL_CONTROL_FROZEN',
  d16MethodReceiptHash:H('f'),
  d16InteractionIncrementalityReceiptHash:H('1'),
  multiplicityFamilyId:'MF_PV_INTERACTION_V1',
  selectionIdentificationDisposition:'TARGET_POPULATION_INCREMENTALITY_IDENTIFIED',
  estimandScope:'TARGET_POPULATION_ESTIMAND',
  supportRuleHash:H('2'),
  consumerSupportRuleHash:H('2'),
  independenceStatus:'RESIDUAL_INTERACTION_INCREMENT_PROVEN',
  mainEffectsCompleteComparator:true,
  marginalMisspecificationControlled:true,
  jointSupportAdequate:true,
  pitClockPass:true,
  multiplicityFrozen:true,
  postOutcomeRetuning:false,
  selectionIdentificationPass:true,
  oosOrProspectivePass:true,
  dateDependenceAwarePass:true,
  negativeControlsPass:true,
  tradableSelectionImpact:true,
  costFillabilityPass:true
};

const noInteraction=evaluateInteractionEvidence({acceptedMainEffects:mains,interactions:[]});
assert.equal(noInteraction.effectiveIndependentSourceRootCount,2);
assert.equal(noInteraction.provenInteractionIncrementCount,0);
assert.equal(noInteraction.effectiveEvidenceCount,2);

const proven=evaluateInteractionEvidence({acceptedMainEffects:mains,interactions:[interaction]});
assert.equal(proven.effectiveIndependentSourceRootCount,2);
assert.equal(proven.provenInteractionIncrementCount,1);
assert.equal(proven.effectiveEvidenceCount,3);

const duplicate=evaluateInteractionEvidence({
  acceptedMainEffects:mains,
  interactions:[interaction,{...interaction,interactionVersion:'I1_ALIAS',formulaVersion:'LOGICAL_AND_ALIAS'}]
});
assert.equal(duplicate.effectiveEvidenceCount,3);
assert.equal(duplicate.provenInteractionIncrementCount,1);

const oneMain=evaluateInteractionEvidence({acceptedMainEffects:[mains[0]],interactions:[interaction]});
assert.equal(oneMain.effectiveEvidenceCount,1);
assert.equal(oneMain.provenInteractionIncrementCount,0);

const weakBaseline=evaluateInteractionEvidence({acceptedMainEffects:mains,interactions:[{...interaction,mainEffectsCompleteComparator:false}]});
assert.equal(weakBaseline.effectiveEvidenceCount,2);

const misspecified=evaluateInteractionEvidence({acceptedMainEffects:mains,interactions:[{...interaction,marginalMisspecificationControlled:false}]});
assert.equal(misspecified.effectiveEvidenceCount,2);

const jointThin=evaluateInteractionEvidence({acceptedMainEffects:mains,interactions:[{...interaction,jointSupportAdequate:false}]});
assert.equal(jointThin.effectiveEvidenceCount,2);

const observedOnly=evaluateInteractionEvidence({acceptedMainEffects:mains,interactions:[{
  ...interaction,
  estimandScope:'OBSERVED_SUBPOPULATION_ESTIMAND',
  selectionIdentificationDisposition:'ROOT_SPECIFIC_MECHANISM_SUPPORTED_BUT_POPULATION_INCREMENTALITY_NOT_IDENTIFIED'
}]});
assert.equal(observedOnly.effectiveEvidenceCount,2);

const restrictedMismatch=evaluateInteractionEvidence({acceptedMainEffects:mains,interactions:[{
  ...interaction,
  estimandScope:'RESTRICTED_SUPPORT_ESTIMAND',
  consumerSupportRuleHash:H('9')
}]});
assert.equal(restrictedMismatch.effectiveEvidenceCount,2);

const postTune=evaluateInteractionEvidence({acceptedMainEffects:mains,interactions:[{...interaction,postOutcomeRetuning:true}]});
assert.equal(postTune.effectiveEvidenceCount,2);

const negativeFail=evaluateInteractionEvidence({acceptedMainEffects:mains,interactions:[{...interaction,negativeControlsPass:false}]});
assert.equal(negativeFail.effectiveEvidenceCount,2);

const costFail=evaluateInteractionEvidence({acceptedMainEffects:mains,interactions:[{...interaction,costFillabilityPass:false}]});
assert.equal(costFail.effectiveEvidenceCount,2);

assert.throws(()=>evaluateInteractionEvidence({acceptedMainEffects:mains,interactions:[{
  ...interaction,independenceStatus:'INDEPENDENT_SOURCE_PROVEN'
}]}),/INTERACTION_SOURCE_INDEPENDENCE_LABEL_FORBIDDEN/);

assert.throws(()=>evaluateInteractionEvidence({acceptedMainEffects:mains,interactions:[{
  ...interaction,firstObservableAt:'2026-10-06T04:59:00+08:00'
}]}),/INTERACTION_PIT_CLOCK_INVALID/);

console.log(JSON.stringify({
  status:'PASS',
  cases:14,
  twoRootsNoInteractionEffectiveEvidence:noInteraction.effectiveEvidenceCount,
  twoRootsOneInteractionEffectiveEvidence:proven.effectiveEvidenceCount,
  duplicateAliasEffectiveEvidence:duplicate.effectiveEvidenceCount,
  sourceRootCountAfterInteraction:proven.effectiveIndependentSourceRootCount,
  interactionIncrementCount:proven.provenInteractionIncrementCount,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
