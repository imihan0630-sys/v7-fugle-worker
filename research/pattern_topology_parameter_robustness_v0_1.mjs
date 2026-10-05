// D01 DL-037 topology parameter-family robustness v0.1
// Research-only / outcome-blind / SDA-001 + SDA-002 remediation.

function str(x){return String(x??"");}
function uniq(xs=[]){return [...new Set((xs||[]).map(String).filter(Boolean))].sort();}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function sameSet(a=[],b=[]){
  const A=uniq(a),B=uniq(b);
  return A.length===B.length&&A.every((x,i)=>x===B[i]);
}

export function classifyVariant({
  canonical,
  variant,
  predictorFreezeAt
}={}){
  if(!variant) return {state:"UNKNOWN_DATA_BLOCKED",eligible:false};

  if(variant.dataBlocked===true)
    return {state:"UNKNOWN_DATA_BLOCKED",eligible:false};

  const freeze=str(predictorFreezeAt);
  const firstObservableAt=str(variant.firstObservableAt);
  const confirmedAt=str(variant.confirmedAt);
  const latestAnchorAt=str(variant.latestAnchorAt);

  if(variant.futureBarRequired===true)
    return {state:"POST_HOC_NOT_ELIGIBLE",eligible:false,reason:"FUTURE_BAR_REQUIRED"};

  if(variant.replaySafe!==true)
    return {state:"POST_HOC_NOT_ELIGIBLE",eligible:false,reason:"REPLAY_UNSAFE"};

  if(!freeze||!firstObservableAt||!confirmedAt||!latestAnchorAt)
    return {state:"UNKNOWN_DATA_BLOCKED",eligible:false,reason:"CLOCK_INCOMPLETE"};

  if(firstObservableAt>freeze||confirmedAt>freeze||latestAnchorAt>freeze)
    return {state:"POST_HOC_NOT_ELIGIBLE",eligible:false,reason:"NOT_AVAILABLE_AT_FREEZE"};

  if(variant.emitted!==true)
    return {state:"NO_STRUCTURE",eligible:true};

  if(!canonical?.rootId)
    return {state:"CANONICAL_ROOT_UNRESOLVED",eligible:true};

  const sameRoot=str(variant.rootId)===str(canonical.rootId);
  const sameVersion=str(variant.versionId)===str(canonical.versionId);
  const sameAnchors=sameSet(variant.anchorIds,canonical.anchorIds);
  const sameBoundary=str(variant.boundaryHash)===str(canonical.boundaryHash);
  const sameLifecycle=str(variant.lifecycleState)===str(canonical.lifecycleState);

  if(sameRoot&&sameVersion&&sameAnchors&&sameBoundary&&sameLifecycle)
    return {state:"EXACT_VARIANT_ALIAS",eligible:true};

  if(sameRoot)
    return {state:"SAME_ROOT_PARAMETER_VARIATION",eligible:true};

  return {
    state:"PARAMETER_IDENTITY_CONFLICT",
    eligible:true,
    canonicalRootId:str(canonical.rootId),
    variantRootId:str(variant.rootId)||null
  };
}

export function summarizeParameterFamily({
  parameterFamilyId,
  parameterGridHash,
  registryFrozenAt,
  canonical,
  variants=[],
  predictorFreezeAt
}={}){
  if(!str(parameterFamilyId)||!str(parameterGridHash)||!str(registryFrozenAt))
    return {status:"UNKNOWN",reason:"PARAMETER_FAMILY_REGISTRY_INCOMPLETE"};

  if(!Array.isArray(variants)||!variants.length)
    return {status:"UNKNOWN",reason:"VARIANT_FAMILY_EMPTY"};

  const classified=variants.map(v=>({
    variantId:str(v.variantId),
    ...classifyVariant({canonical,variant:v,predictorFreezeAt})
  }));

  const eligible=classified.filter(x=>x.state!=="UNKNOWN_DATA_BLOCKED"&&x.state!=="POST_HOC_NOT_ELIGIBLE");
  const count=s=>classified.filter(x=>x.state===s).length;
  const eligibleCount=eligible.length;
  const emittedStates=new Set(["EXACT_VARIANT_ALIAS","SAME_ROOT_PARAMETER_VARIATION","PARAMETER_IDENTITY_CONFLICT"]);
  const rootEmittedCount=classified.filter(x=>emittedStates.has(x.state)).length;
  const supportCount=count("EXACT_VARIANT_ALIAS")+count("SAME_ROOT_PARAMETER_VARIATION");

  return {
    status:"VALID",
    parameterFamilyId:str(parameterFamilyId),
    parameterGridHash:str(parameterGridHash),
    registryFrozenAt:str(registryFrozenAt),
    eligibleVariantCount:eligibleCount,
    rawVariantCount:variants.length,
    rootEmittedCount,
    exactAliasCount:count("EXACT_VARIANT_ALIAS"),
    sameRootVariationCount:count("SAME_ROOT_PARAMETER_VARIATION"),
    noStructureCount:count("NO_STRUCTURE"),
    dataBlockedCount:count("UNKNOWN_DATA_BLOCKED"),
    postHocCount:count("POST_HOC_NOT_ELIGIBLE"),
    identityConflictCount:count("PARAMETER_IDENTITY_CONFLICT"),
    canonicalUnresolvedCount:count("CANONICAL_ROOT_UNRESOLVED"),
    emissionRate:eligibleCount>0?rootEmittedCount/eligibleCount:null,
    sameRootSupportRate:eligibleCount>0?supportCount/eligibleCount:null,
    conflictRate:eligibleCount>0?count("PARAMETER_IDENTITY_CONFLICT")/eligibleCount:null,
    noStructureRate:eligibleCount>0?count("NO_STRUCTURE")/eligibleCount:null,
    informationRoot:"PRICE_OHLC",
    representationFamily:"D01_PRICE_GEOMETRY",
    redundancyGroup:"D01_PRICE_GEOMETRY_PARAMETER_FAMILY",
    effectiveIndependentEvidenceCount:1,
    residualIncrementalityStatus:"NOT_VALIDATED",
    robustnessRateIsAlpha:false,
    variants:classified
  };
}

export function validateFamilyFreeze({
  registryFrozenAt,
  outcomeInspectionAt,
  familyChangedAfterOutcome,
  variantsRemovedAfterOutcome
}={}){
  const frozen=str(registryFrozenAt);
  const inspected=str(outcomeInspectionAt);

  if(familyChangedAfterOutcome===true)
    return {status:"PROHIBITED",reason:"POST_OUTCOME_FAMILY_MUTATION"};

  if(variantsRemovedAfterOutcome===true)
    return {status:"PROHIBITED",reason:"POST_OUTCOME_VARIANT_REMOVAL"};

  if(frozen&&inspected&&frozen>=inspected)
    return {status:"PROHIBITED",reason:"REGISTRY_NOT_FROZEN_BEFORE_OUTCOME"};

  return {status:"VALID"};
}

export function canonicalChoiceGuard({
  ruleFrozenBeforeOutcome,
  selectedByMajority,
  selectedByBestOutcome
}={}){
  if(selectedByBestOutcome===true)
    return {status:"PROHIBITED",reason:"BEST_OUTCOME_SELECTION"};
  if(selectedByMajority===true)
    return {status:"PROHIBITED",reason:"MAJORITY_VARIANT_IS_NOT_CANONICAL_TRUTH"};
  if(ruleFrozenBeforeOutcome!==true)
    return {status:"UNKNOWN",reason:"CANONICAL_SELECTION_RULE_UNFROZEN"};
  return {status:"VALID"};
}
