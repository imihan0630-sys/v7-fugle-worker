import assert from "node:assert/strict";
import {
  classifyVariant,
  summarizeParameterFamily,
  validateFamilyFreeze,
  canonicalChoiceGuard
} from "./pattern_topology_parameter_robustness_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const freeze="2026-10-01T13:30:00+08:00";
const canonical={
  rootId:"ROOT-1",
  versionId:"V1",
  anchorIds:["A1","A2"],
  boundaryHash:"B1",
  lifecycleState:"ACTIVE"
};
const base={
  variantId:"V-A",
  emitted:true,
  rootId:"ROOT-1",
  versionId:"V1",
  anchorIds:["A1","A2"],
  boundaryHash:"B1",
  lifecycleState:"ACTIVE",
  firstObservableAt:"2026-09-20T13:30:00+08:00",
  confirmedAt:"2026-09-22T13:30:00+08:00",
  latestAnchorAt:"2026-09-22T13:30:00+08:00",
  replaySafe:true,
  futureBarRequired:false
};

t("PR01 exact same output is exact alias",()=>{
  assert.equal(classifyVariant({canonical,variant:base,predictorFreezeAt:freeze}).state,"EXACT_VARIANT_ALIAS");
});

t("PR02 same root with different legal version is same-root variation",()=>{
  const r=classifyVariant({canonical,variant:{...base,versionId:"V2",boundaryHash:"B2"},predictorFreezeAt:freeze});
  assert.equal(r.state,"SAME_ROOT_PARAMETER_VARIATION");
});

t("PR03 different root is identity conflict, not another vote",()=>{
  const r=classifyVariant({canonical,variant:{...base,rootId:"ROOT-2"},predictorFreezeAt:freeze});
  assert.equal(r.state,"PARAMETER_IDENTITY_CONFLICT");
});

t("PR04 no detection is preserved",()=>{
  const r=classifyVariant({canonical,variant:{...base,emitted:false},predictorFreezeAt:freeze});
  assert.equal(r.state,"NO_STRUCTURE");
  assert.equal(r.eligible,true);
});

t("PR05 future-bar variant is post hoc",()=>{
  const r=classifyVariant({canonical,variant:{...base,futureBarRequired:true},predictorFreezeAt:freeze});
  assert.equal(r.state,"POST_HOC_NOT_ELIGIBLE");
});

t("PR06 replay-unsafe variant cannot enter family support",()=>{
  const r=classifyVariant({canonical,variant:{...base,replaySafe:false},predictorFreezeAt:freeze});
  assert.equal(r.state,"POST_HOC_NOT_ELIGIBLE");
});

t("PR07 late confirmation is post hoc",()=>{
  const r=classifyVariant({
    canonical,
    variant:{...base,confirmedAt:"2026-10-02T13:30:00+08:00"},
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"POST_HOC_NOT_ELIGIBLE");
});

t("PR08 data-blocked variant stays visible",()=>{
  const r=classifyVariant({canonical,variant:{...base,dataBlocked:true},predictorFreezeAt:freeze});
  assert.equal(r.state,"UNKNOWN_DATA_BLOCKED");
});

t("PR09 denominator includes no-structure eligible variants",()=>{
  const s=summarizeParameterFamily({
    parameterFamilyId:"F1",parameterGridHash:"G1",registryFrozenAt:"2026-09-01",
    canonical,predictorFreezeAt:freeze,
    variants:[base,{...base,variantId:"V-B",emitted:false}]
  });
  assert.equal(s.eligibleVariantCount,2);
  assert.equal(s.exactAliasCount,1);
  assert.equal(s.noStructureCount,1);
  assert.equal(s.sameRootSupportRate,0.5);
});

t("PR10 successful-only denominator is impossible in summary",()=>{
  const s=summarizeParameterFamily({
    parameterFamilyId:"F1",parameterGridHash:"G1",registryFrozenAt:"2026-09-01",
    canonical,predictorFreezeAt:freeze,
    variants:[base,{...base,variantId:"V-B",emitted:false},{...base,variantId:"V-C",rootId:"ROOT-2"}]
  });
  assert.equal(s.eligibleVariantCount,3);
  assert.equal(s.rootEmittedCount,2);
  assert.equal(s.emissionRate,2/3);
});

t("PR11 many aliases still produce one effective evidence count",()=>{
  const s=summarizeParameterFamily({
    parameterFamilyId:"F1",parameterGridHash:"G1",registryFrozenAt:"2026-09-01",
    canonical,predictorFreezeAt:freeze,
    variants:[
      base,
      {...base,variantId:"V-B"},
      {...base,variantId:"V-C"}
    ]
  });
  assert.equal(s.rawVariantCount,3);
  assert.equal(s.exactAliasCount,3);
  assert.equal(s.effectiveIndependentEvidenceCount,1);
});

t("PR12 root conflict is a robustness failure, not majority rescue",()=>{
  const s=summarizeParameterFamily({
    parameterFamilyId:"F1",parameterGridHash:"G1",registryFrozenAt:"2026-09-01",
    canonical,predictorFreezeAt:freeze,
    variants:[
      base,
      {...base,variantId:"V-B"},
      {...base,variantId:"V-C",rootId:"ROOT-2"}
    ]
  });
  assert.equal(s.identityConflictCount,1);
  assert.ok(s.conflictRate>0);
});

t("PR13 robustness rate is not alpha",()=>{
  const s=summarizeParameterFamily({
    parameterFamilyId:"F1",parameterGridHash:"G1",registryFrozenAt:"2026-09-01",
    canonical,predictorFreezeAt:freeze,
    variants:[base]
  });
  assert.equal(s.robustnessRateIsAlpha,false);
  assert.equal(s.residualIncrementalityStatus,"NOT_VALIDATED");
});

t("PR14 post-outcome family mutation is prohibited",()=>{
  const r=validateFamilyFreeze({
    registryFrozenAt:"2026-09-01",
    outcomeInspectionAt:"2026-10-01",
    familyChangedAfterOutcome:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"POST_OUTCOME_FAMILY_MUTATION");
});

t("PR15 deleting losing variants after outcomes is prohibited",()=>{
  const r=validateFamilyFreeze({
    registryFrozenAt:"2026-09-01",
    outcomeInspectionAt:"2026-10-01",
    variantsRemovedAfterOutcome:true
  });
  assert.equal(r.reason,"POST_OUTCOME_VARIANT_REMOVAL");
});

t("PR16 family registry must predate outcome inspection",()=>{
  const r=validateFamilyFreeze({
    registryFrozenAt:"2026-10-02",
    outcomeInspectionAt:"2026-10-01"
  });
  assert.equal(r.status,"PROHIBITED");
});

t("PR17 majority variant root cannot define canonical truth",()=>{
  const r=canonicalChoiceGuard({
    ruleFrozenBeforeOutcome:true,
    selectedByMajority:true,
    selectedByBestOutcome:false
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"MAJORITY_VARIANT_IS_NOT_CANONICAL_TRUTH");
});

t("PR18 best-outcome parameter selection is prohibited",()=>{
  const r=canonicalChoiceGuard({
    ruleFrozenBeforeOutcome:true,
    selectedByMajority:false,
    selectedByBestOutcome:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"BEST_OUTCOME_SELECTION");
});

t("PR19 frozen deterministic canonical rule is valid",()=>{
  const r=canonicalChoiceGuard({
    ruleFrozenBeforeOutcome:true,
    selectedByMajority:false,
    selectedByBestOutcome:false
  });
  assert.equal(r.status,"VALID");
});

t("PR20 unresolved canonical root is explicit",()=>{
  const r=classifyVariant({
    canonical:{},
    variant:base,
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"CANONICAL_ROOT_UNRESOLVED");
});

console.log(`SUMMARY ${pass}/20 PASS`);
