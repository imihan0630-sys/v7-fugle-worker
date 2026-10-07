// D01 DL-106~107 audit/readiness and D16 handoff oracle v0.1
const FIRST_WAVE=new Set(["D01-02","D01-03","D01-07","D01-09"]);
const PARENTS={
  "D01-02":"CONTINUOUS_SINGLE_BAR_OHLC_GEOMETRY",
  "D01-03":"ORDERED_N_BAR_OHLC_GEOMETRY",
  "D01-07":"PRIOR_TREND_COMPRESSION_GENERIC_BREAKOUT",
  "D01-09":"RAW_GAP_PLUS_LEGAL_LIMIT_CONTEXT"
};

export function classifySda002ResearchSide({
  geometryFrozen,clocksFrozen,lifecycleFrozen,negativeCasesRetained,
  prefixInvarianceTested,versionMigrationFrozen,physicalR7,SystemGuard,D16,Audit00
}={}){
  const research=[geometryFrozen,clocksFrozen,lifecycleFrozen,negativeCasesRetained,prefixInvarianceTested,versionMigrationFrozen].every(x=>x===true);
  const ticketClosed=research&&physicalR7===true&&SystemGuard===true&&D16===true&&Audit00===true;
  return {
    researchSide:research?"RESEARCH_SEMANTICS_COMPLETE":"RESEARCH_SEMANTICS_INCOMPLETE",
    ticketStatus:ticketClosed?"CLOSURE_ELIGIBLE":"REMEDIATION_IN_PROGRESS"
  };
}

export function classifySda001ResearchSide({
  informationRootFrozen,aliasDedupFrozen,parentComparatorsFrozen,redundancyGraphFrozen,
  crossScaleFirewallFrozen,crossDomainIntegration,D16,Audit00
}={}){
  const research=[informationRootFrozen,aliasDedupFrozen,parentComparatorsFrozen,redundancyGraphFrozen,crossScaleFirewallFrozen].every(x=>x===true);
  const ticketClosed=research&&crossDomainIntegration===true&&D16===true&&Audit00===true;
  return {
    researchSide:research?"D01_RESEARCH_SEMANTICS_COMPLETE":"D01_RESEARCH_SEMANTICS_INCOMPLETE",
    ticketStatus:ticketClosed?"CLOSURE_ELIGIBLE":"REMEDIATION_IN_PROGRESS"
  };
}

export function validateD16Handoff(h={}){
  if(!Array.isArray(h.modules)||h.modules.length!==4||h.modules.some(x=>!FIRST_WAVE.has(x)))
    return {status:"FIRST_WAVE_MODULE_SET_INVALID"};
  if(h.warmupYear!==2018||h.finalHoldoutYear!==2024||h.finalHoldoutLocked!==true)
    return {status:"CHRONOLOGY_DRIFT"};
  if([...(h.horizons||[])].sort((a,b)=>a-b).join(",")!=="1,5,20")
    return {status:"HORIZON_DRIFT"};
  if(h.outcomeJoin!=="CLOSED")return {status:"OUTCOME_FIREWALL_BREACH"};
  return {status:"D16_HANDOFF_VALID"};
}

export function validateCommonParent({moduleId,parentType}={}){
  return {status:PARENTS[moduleId]===parentType?"COMMON_PARENT_VALID":"COMMON_PARENT_INVALID"};
}

export function validateParentChildSupport(parent={},child={}){
  const fields=["universeVersion","foldId","symbol","predictorDate","exactSessionHash","sourceHistoryHash","predictorFreezeAt","blockedRowPolicyId","censoringPolicyId","horizon","costTreatmentId","detectorSearchFamilyId"];
  const drift=fields.filter(k=>(parent[k]??null)!==(child[k]??null));
  return {status:drift.length?"PAIRING_BLOCKED":"PAIRING_VALID",drift};
}

export function validatePromotionGate(g={}){
  const keys=["pitReplay","deterministicTests","physicalR1R7","oosOrProspectiveComplete","commonParentAvailable","multiplicityHandled","fullDenominator","noPostHoldoutTuning"];
  const missing=keys.filter(k=>g[k]!==true);
  return {status:missing.length?"L4_NOT_ELIGIBLE":"L4_CANDIDATE",missing};
}
