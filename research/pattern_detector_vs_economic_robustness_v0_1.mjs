// D01 DL-038 detector robustness vs economic robustness v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function uniq(xs=[]){return [...new Set((xs||[]).map(String).filter(Boolean))].sort();}

export function validateEconomicValidationReadiness(design={}){
  const required=[
    "experimentId","semanticRuleId","detectorFamilyId","parameterFamilyId",
    "parameterGridHash","targetDefinitionId","benchmarkId","horizonId",
    "costPolicyId","parentIdentityContractId","structuralIdentityContractId",
    "symbolUniverseVersion","dateWindowId","regimeOwner","regimeVersion",
    "dependenceUnit","holdoutId","coveragePolicyId","missingnessPolicyId"
  ];
  const missing=required.filter(k=>!str(design[k]));
  if(missing.length)
    return {status:"ECONOMIC_VALIDATION_NOT_READY",reason:"REQUIRED_CONTRACT_MISSING",missing};

  if(design.outcomeJoinState!=="CLOSED")
    return {status:"PROHIBITED",reason:"D01_OUTCOME_JOIN_MUST_REMAIN_CLOSED"};

  if(design.regimeDefinedFromPatternPerformance===true)
    return {status:"PROHIBITED",reason:"POST_HOC_REGIME_MINING"};

  if(design.holdoutUseCount>0)
    return {status:"HOLDOUT_ALREADY_CONSUMED",reason:"HOLDOUT_REUSE_REQUIRES_D16_GOVERNANCE"};

  return {
    status:"READY_FOR_D16_PREREGISTRATION",
    outcomeJoinAllowedInD01:false,
    economicEvidenceAssigned:false
  };
}

export function summarizeReplicationUnits(rows=[]){
  const valid=(rows||[]).filter(r=>r&&r.eligible!==false);
  const rawRepresentationCount=valid.reduce((n,r)=>n+(Number.isFinite(r.rawRepresentationCount)?r.rawRepresentationCount:1),0);
  return {
    status:"VALID",
    observationCount:valid.length,
    rawRepresentationCount,
    uniqueParentCount:uniq(valid.map(r=>r.parentDecisionId)).length,
    uniqueStructuralRootCount:uniq(valid.map(r=>r.structuralRootId)).length,
    uniqueEpisodeCount:uniq(valid.map(r=>r.objectEpisodeId)).length,
    uniqueSymbolCount:uniq(valid.map(r=>r.symbol)).length,
    independentClusterCount:uniq(valid.map(r=>r.independentClusterId)).length,
    regimeCount:uniq(valid.map(r=>r.regimeState)).length,
    priceInformationRootCount:valid.length?1:0,
    effectiveIndependentEvidenceCount:valid.length?1:0,
    economicReplicationCount:uniq(valid.map(r=>r.independentClusterId)).length
  };
}

export function summarizeCoverage({
  eligibleCount,
  evaluableCount,
  dataBlockedCount=0,
  noOpportunityCount=0,
  missingCount=0
}={}){
  const vals=[eligibleCount,evaluableCount,dataBlockedCount,noOpportunityCount,missingCount];
  if(vals.some(x=>!Number.isInteger(x)||x<0))
    return {status:"UNKNOWN",reason:"COVERAGE_COUNTS_INVALID"};

  if(evaluableCount+dataBlockedCount+noOpportunityCount+missingCount>eligibleCount)
    return {status:"UNKNOWN",reason:"COVERAGE_COUNTS_EXCEED_ELIGIBLE"};

  return {
    status:"VALID",
    eligibleCount,
    evaluableCount,
    dataBlockedCount,
    noOpportunityCount,
    missingCount,
    evaluableRate:eligibleCount?evaluableCount/eligibleCount:null,
    blockedOrMissingRate:eligibleCount?(dataBlockedCount+missingCount)/eligibleCount:null,
    silentDroppingAllowed:false
  };
}

export function classifyDesignReadiness({
  crossSymbolFrozen,
  independentDateClustersFrozen,
  exAnteRegimeFrozen,
  prospectiveFlag,
  holdoutFresh,
  costPolicyFrozen
}={}){
  let stage="G0_LOCAL_DETECTOR_ONLY";
  if(crossSymbolFrozen===true) stage="G1_CROSS_SYMBOL";
  else return {status:"VALID",readinessStage:stage,economicEvidenceAssigned:false};

  if(independentDateClustersFrozen===true) stage="G2_CROSS_DATE";
  else return {status:"VALID",readinessStage:stage,economicEvidenceAssigned:false};

  if(exAnteRegimeFrozen===true) stage="G3_CROSS_REGIME";
  else return {status:"VALID",readinessStage:stage,economicEvidenceAssigned:false};

  if(prospectiveFlag===true&&holdoutFresh===true) stage="G4_PROSPECTIVE_OOS";
  else return {status:"VALID",readinessStage:stage,economicEvidenceAssigned:false};

  if(costPolicyFrozen===true) stage="G5_COST_AWARE";

  return {status:"VALID",readinessStage:stage,economicEvidenceAssigned:false};
}

export function holdoutUseGuard({
  holdoutId,
  holdoutFirstOpenedAt,
  holdoutUseCount
}={}){
  if(!str(holdoutId))
    return {status:"UNKNOWN",reason:"HOLDOUT_ID_MISSING"};

  if(!Number.isInteger(holdoutUseCount)||holdoutUseCount<0)
    return {status:"UNKNOWN",reason:"HOLDOUT_USE_COUNT_INVALID"};

  if(holdoutUseCount===0)
    return {status:"FRESH_HOLDOUT",developmentLike:false};

  return {
    status:"HOLDOUT_CONSUMED",
    developmentLike:true,
    holdoutFirstOpenedAt:str(holdoutFirstOpenedAt)||null,
    holdoutUseCount
  };
}

export function regimeDefinitionGuard({
  regimeOwner,
  regimeVersion,
  frozenAt,
  performanceUsedToDefine
}={}){
  if(performanceUsedToDefine===true)
    return {status:"PROHIBITED",reason:"REGIME_DEFINED_FROM_PATTERN_PERFORMANCE"};
  if(!str(regimeOwner)||!str(regimeVersion)||!str(frozenAt))
    return {status:"UNKNOWN",reason:"REGIME_RECEIPT_INCOMPLETE"};
  return {status:"VALID",exAnte:true};
}
