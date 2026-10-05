import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const guard = JSON.parse(
  readFileSync(new URL('./d03_mixed_root_residual_graduation_guard_20261006_v0_1.json', import.meta.url))
);

const required = guard.residualChildRequiredFields;
const hex64 = v => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
const nonempty = v => typeof v === 'string' && v.trim().length > 0;

function assertChildShape(child) {
  for (const f of required) {
    if (!(f in child)) throw new Error('MISSING_CHILD_FIELD:' + f);
    const v = child[f];
    if (typeof v === 'string' && !nonempty(v)) throw new Error('EMPTY_CHILD_FIELD:' + f);
    if (Array.isArray(v) && !v.length) throw new Error('EMPTY_CHILD_FIELD:' + f);
  }
  for (const f of ['baselineFeatureSetHash','commonSupportHash','d16MethodReceiptHash','d16IncrementalityReceiptHash']) {
    if (!hex64(child[f])) throw new Error('INVALID_HASH:' + f);
  }
}

export function validateMixedRootGraduation(input) {
  if (!input || typeof input !== 'object') throw new Error('INPUT_REQUIRED');
  const {parentComposite,currentContext,residualChildren=[],baseEvidenceRoots=[]} = input;
  if (!parentComposite || !currentContext) throw new Error('PARENT_AND_CONTEXT_REQUIRED');
  if (!Array.isArray(parentComposite.informationRoots) || parentComposite.informationRoots.length < 2) {
    throw new Error('MIXED_ROOT_PARENT_REQUIRED');
  }
  if (new Set(parentComposite.informationRoots).size !== parentComposite.informationRoots.length) {
    throw new Error('DUPLICATE_PARENT_ROOT');
  }
  if (['RESIDUAL_INCREMENTAL_PROVEN','INDEPENDENT_SOURCE_PROVEN'].includes(parentComposite.independenceStatus)) {
    throw new Error('WHOLE_PARENT_GRADUATION_FORBIDDEN');
  }
  if (!Array.isArray(residualChildren) || !Array.isArray(baseEvidenceRoots)) throw new Error('ARRAYS_REQUIRED');

  const acceptedChildren = [];
  for (const child of residualChildren) {
    assertChildShape(child);
    if (child.parentCompositeFactorId !== parentComposite.factorId ||
        child.parentCompositeFactorVersion !== parentComposite.factorVersion) {
      throw new Error('PARENT_BINDING_MISMATCH');
    }
    if (!parentComposite.informationRoots.includes(child.isolatedInformationRoot)) {
      throw new Error('ISOLATED_ROOT_NOT_IN_PARENT');
    }
    if (!Array.isArray(child.conditionedOnInformationRoots) || !child.conditionedOnInformationRoots.length) {
      throw new Error('CONDITIONED_ROOTS_REQUIRED');
    }
    if (child.conditionedOnInformationRoots.includes(child.isolatedInformationRoot)) {
      throw new Error('ISOLATED_ROOT_CANNOT_CONDITION_ON_ITSELF');
    }
    if (child.conditionedOnInformationRoots.some(r => !parentComposite.informationRoots.includes(r))) {
      throw new Error('CONDITIONED_ROOT_NOT_IN_PARENT');
    }
    if (child.independenceStatus !== guard.residualChildRules.allowedIndependenceStatus) {
      throw new Error('RESIDUAL_CHILD_STATUS_INVALID');
    }

    const bindings = [
      ['parentCompositeFactorVersion', child.parentCompositeFactorVersion],
      ['baselineFeatureSetHash', child.baselineFeatureSetHash],
      ['commonSupportHash', child.commonSupportHash],
      ['residualizationMethodVersion', child.residualizationMethodVersion],
      ['d16MethodReceiptHash', child.d16MethodReceiptHash],
      ['parameterFamilyId', child.parameterFamilyId]
    ];
    for (const [field,value] of bindings) {
      if (currentContext[field] !== value) throw new Error('RESIDUAL_PROOF_REVALIDATION_REQUIRED:' + field);
    }
    acceptedChildren.push(child);
  }

  const base = new Set(baseEvidenceRoots);
  const residualRoots = new Set();
  for (const child of acceptedChildren) {
    if (!base.has(child.isolatedInformationRoot)) residualRoots.add(child.isolatedInformationRoot);
  }

  const effectiveIndependentEvidenceCount = base.size + residualRoots.size;
  const state = acceptedChildren.length ? 'ROOT_SPECIFIC_RESIDUAL_ACCOUNTING' : 'MIXED_ROOT_UNDECOMPOSED';

  return Object.freeze({
    status:'PASS',
    state,
    rawParentVisible:true,
    parentCompositeContributionToIndependentEvidence:0,
    provenResidualRoots:[...residualRoots].sort(),
    effectiveIndependentEvidenceCount,
    formalCoreImpact:'NONE_LOCKED',
    empiricalIncrementalityClaimed:false
  });
}

const H = ch => ch.repeat(64);
const parent = {
  factorId:'PV',
  factorVersion:'PV-V1',
  informationRoots:['PRICE_OHLC','VOLUME_TURNOVER'],
  independenceStatus:'PARTIAL_OVERLAP'
};
const context = {
  parentCompositeFactorVersion:'PV-V1',
  baselineFeatureSetHash:H('a'),
  commonSupportHash:H('b'),
  residualizationMethodVersion:'D16-RESID-V1',
  d16MethodReceiptHash:H('c'),
  parameterFamilyId:'PF_PV_V1'
};
const volumeChild = {
  componentFactorId:'PV::VOLUME_RESIDUAL',
  componentFactorVersion:'PV-V1::VR1',
  parentCompositeFactorId:'PV',
  parentCompositeFactorVersion:'PV-V1',
  isolatedInformationRoot:'VOLUME_TURNOVER',
  conditionedOnInformationRoots:['PRICE_OHLC'],
  residualizationMethodVersion:'D16-RESID-V1',
  baselineFeatureSetHash:H('a'),
  commonSupportHash:H('b'),
  d16MethodReceiptHash:H('c'),
  d16IncrementalityReceiptHash:H('d'),
  parameterFamilyId:'PF_PV_V1',
  decisionClock:'COMPLETED_SESSION_ONLY',
  firstObservableAt:'AFTER_DECISION_INPUT_FINALIZATION',
  provenance:'D16_ROOT_SPECIFIC_RESIDUAL_RECEIPT',
  independenceStatus:'RESIDUAL_INCREMENTAL_PROVEN'
};

const unproven = validateMixedRootGraduation({
  parentComposite:parent,currentContext:context,residualChildren:[],baseEvidenceRoots:['PRICE_OHLC']
});
assert.equal(unproven.effectiveIndependentEvidenceCount,1);
assert.equal(unproven.parentCompositeContributionToIndependentEvidence,0);
assert.equal(unproven.state,'MIXED_ROOT_UNDECOMPOSED');

const proven = validateMixedRootGraduation({
  parentComposite:parent,currentContext:context,residualChildren:[volumeChild],baseEvidenceRoots:['PRICE_OHLC']
});
assert.equal(proven.effectiveIndependentEvidenceCount,2);
assert.deepEqual(proven.provenResidualRoots,['VOLUME_TURNOVER']);
assert.equal(proven.parentCompositeContributionToIndependentEvidence,0);

const duplicateResidual = validateMixedRootGraduation({
  parentComposite:parent,currentContext:context,
  residualChildren:[volumeChild,{...volumeChild,componentFactorId:'PV::VOLUME_RESIDUAL_ALIAS',componentFactorVersion:'PV-V1::VR1-ALIAS'}],
  baseEvidenceRoots:['PRICE_OHLC']
});
assert.equal(duplicateResidual.effectiveIndependentEvidenceCount,2);

const rejects = (input, pattern) => assert.throws(() => validateMixedRootGraduation(input), pattern);

rejects({
  parentComposite:{...parent,independenceStatus:'RESIDUAL_INCREMENTAL_PROVEN'},
  currentContext:context,residualChildren:[volumeChild],baseEvidenceRoots:['PRICE_OHLC']
},/WHOLE_PARENT_GRADUATION_FORBIDDEN/);

rejects({
  parentComposite:{...parent,independenceStatus:'INDEPENDENT_SOURCE_PROVEN'},
  currentContext:context,residualChildren:[volumeChild],baseEvidenceRoots:['PRICE_OHLC']
},/WHOLE_PARENT_GRADUATION_FORBIDDEN/);

const missing = {...volumeChild}; delete missing.baselineFeatureSetHash;
rejects({parentComposite:parent,currentContext:context,residualChildren:[missing],baseEvidenceRoots:['PRICE_OHLC']},/MISSING_CHILD_FIELD/);

rejects({
  parentComposite:parent,currentContext:{...context,baselineFeatureSetHash:H('e')},
  residualChildren:[volumeChild],baseEvidenceRoots:['PRICE_OHLC']
},/RESIDUAL_PROOF_REVALIDATION_REQUIRED:baselineFeatureSetHash/);

rejects({
  parentComposite:parent,currentContext:{...context,commonSupportHash:H('e')},
  residualChildren:[volumeChild],baseEvidenceRoots:['PRICE_OHLC']
},/RESIDUAL_PROOF_REVALIDATION_REQUIRED:commonSupportHash/);

rejects({
  parentComposite:parent,currentContext:{...context,d16MethodReceiptHash:H('e')},
  residualChildren:[volumeChild],baseEvidenceRoots:['PRICE_OHLC']
},/RESIDUAL_PROOF_REVALIDATION_REQUIRED:d16MethodReceiptHash/);

rejects({
  parentComposite:parent,currentContext:context,
  residualChildren:[{...volumeChild,independenceStatus:'INDEPENDENT_SOURCE_PROVEN'}],
  baseEvidenceRoots:['PRICE_OHLC']
},/RESIDUAL_CHILD_STATUS_INVALID/);

rejects({
  parentComposite:parent,currentContext:context,
  residualChildren:[{...volumeChild,isolatedInformationRoot:'DERIVATIVES'}],
  baseEvidenceRoots:['PRICE_OHLC']
},/ISOLATED_ROOT_NOT_IN_PARENT/);

rejects({
  parentComposite:parent,currentContext:context,
  residualChildren:[{...volumeChild,conditionedOnInformationRoots:['VOLUME_TURNOVER']}],
  baseEvidenceRoots:['PRICE_OHLC']
},/ISOLATED_ROOT_CANNOT_CONDITION_ON_ITSELF/);

console.log(JSON.stringify({
  status:'PASS',
  cases:12,
  unprovenMixedRootEffectiveCount:unproven.effectiveIndependentEvidenceCount,
  provenVolumeResidualEffectiveCount:proven.effectiveIndependentEvidenceCount,
  duplicateResidualDoesNotInflate:duplicateResidual.effectiveIndependentEvidenceCount===2,
  wholeParentGraduationRejected:true,
  staleProofBindingsRejected:true,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
