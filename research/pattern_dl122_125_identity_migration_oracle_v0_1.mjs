// D01 DL-122~125 security identity / migration / successor oracle v0.1

const CONTINUITY_RELATIONS=new Set([
  "SAME_SECURITY",
  "SAME_SECURITY_MARKET_MIGRATION_PROVEN",
  "SAME_SECURITY_CODE_CHANGED_PROVEN_EQUIVALENT"
]);

const BREAK_RELATIONS=new Set([
  "SUCCESSOR_SECURITY",
  "MULTI_SUCCESSOR",
  "TERMINATED_NO_SUCCESSOR"
]);

export function classifyIdentityTransition(r={}){
  if(!r.identityRelation)return {status:"IDENTITY_RELATION_UNKNOWN"};
  if(CONTINUITY_RELATIONS.has(r.identityRelation)){
    if(r.unitSemanticsCompatible!==true && r.unitTransformCertified!==true)
      return {status:"CONTINUITY_BLOCKED_UNIT_SEMANTICS"};
    if(r.membershipBoundaryConflict===true)
      return {status:"CONTINUITY_BLOCKED_MEMBERSHIP_CONFLICT"};
    if(r.exchangeOrConsiderationEvent===true && r.identityRelation!=="SAME_SECURITY")
      return {status:"CONTINUITY_BLOCKED_CONSIDERATION_EVENT"};
    return {status:"CONTINUITY_ELIGIBLE"};
  }
  if(BREAK_RELATIONS.has(r.identityRelation))
    return {status:"CONTINUITY_BLOCKED_IDENTITY_TRANSITION"};
  if(r.identityRelation==="IDENTITY_EQUIVALENCE_UNKNOWN")
    return {status:"CONTINUITY_BLOCKED_IDENTITY_UNKNOWN"};
  return {status:"IDENTITY_RELATION_UNSUPPORTED"};
}

export function validateCrossMarketContinuity(r={}){
  if(r.priorMarket===r.currentMarket)return {status:"NOT_A_MARKET_MIGRATION"};
  const id=classifyIdentityTransition(r).status;
  if(id!=="CONTINUITY_ELIGIBLE")return {status:"CROSS_MARKET_CONTINUITY_BLOCKED",reason:id};
  if(r.oldMembershipClosed!==true||r.newMembershipOpened!==true)
    return {status:"CROSS_MARKET_MEMBERSHIP_BOUNDARY_INCOMPLETE"};
  if(r.overlappingMembershipAmbiguity===true)
    return {status:"CROSS_MARKET_OVERLAP_CONFLICT"};
  if(r.transitionIntervalClassified!==true)
    return {status:"CROSS_MARKET_INTERVAL_UNKNOWN"};
  if(r.priceSpaceComparable!==true && r.priceTransformCertified!==true)
    return {status:"CROSS_MARKET_PRICE_SPACE_BLOCKED"};
  if(r.successorSecurityEvent===true)
    return {status:"CROSS_MARKET_SUCCESSOR_BREAK"};
  return {
    status:"CROSS_MARKET_CONTINUITY_ELIGIBLE",
    marketRegimeBoundary:true,
    effectiveIndependentOpportunityCount:1
  };
}

export function classifyBoundaryGap(r={}){
  if(r.identityRelation==="SUCCESSOR_SECURITY"||r.identityRelation==="MULTI_SUCCESSOR")
    return {status:"IDENTITY_TRANSITION_REFERENCE_DISTANCE"};
  if(r.marketMigrationBoundary===true){
    if(r.sameSecurityProven!==true||r.priceSpaceComparable!==true)
      return {status:"MIGRATION_BOUNDARY_GAP_BLOCKED"};
    return {status:"MARKET_MIGRATION_BOUNDARY_GAP"};
  }
  if(r.sameSecurityProven===true && Number.isFinite(r.priorClose) && Number.isFinite(r.currentOpen))
    return {status:"ORDINARY_SAME_SECURITY_RAW_GAP",rawGap:r.currentOpen-r.priorClose};
  return {status:"GAP_IDENTITY_UNKNOWN"};
}

export function validateSuccessorBreak(r={}){
  if(!["SUCCESSOR_SECURITY","MULTI_SUCCESSOR","TERMINATED_NO_SUCCESSOR"].includes(r.identityRelation))
    return {status:"NOT_A_SUCCESSOR_BREAK_CASE"};
  const forbidden=[
    "episodeIdInherited","opportunityIdInherited","sourceHistoryHashInherited",
    "exactSessionHashInherited","sourceBarsInherited","firstObservableAtInherited",
    "confirmedAtInherited","redundancyGroupInherited","featureHashInherited"
  ];
  const violations=forbidden.filter(k=>r[k]===true);
  return {status:violations.length?"SUCCESSOR_INHERITANCE_PROHIBITED":"SUCCESSOR_BREAK_VALID",violations};
}

export function classifyOpportunityRelation(a={},b={}){
  if(!a.securityIdentity||!b.securityIdentity)return {status:"OPPORTUNITY_IDENTITY_UNKNOWN"};
  if(a.securityIdentity!==b.securityIdentity){
    if(a.eventContextId&&b.eventContextId&&a.eventContextId===b.eventContextId)
      return {status:"DISTINCT_SECURITY_DEPENDENCY_LINKED"};
    return {status:"DISTINCT_SECURITY_NEW_OPPORTUNITY"};
  }
  if(a.episodeId&&b.episodeId&&a.episodeId===b.episodeId){
    if(a.market!==b.market)return {status:"SAME_SECURITY_MIGRATION_DUPLICATE_ROOT"};
    if(a.symbol!==b.symbol)return {status:"SAME_SECURITY_CODE_CHANGE_DUPLICATE_ROOT"};
    return {status:"SAME_SECURITY_SAME_EPISODE_DUPLICATE_ROOT"};
  }
  return {status:"SAME_SECURITY_DISTINCT_EPISODE_CANDIDATE"};
}

export function validateDurableOpportunityKey(k={}){
  const required=["securityIdentity","membershipIntervalId","detectorFamilyId","episodeId","predictorFreezeAt","exactSessionHash","sourceHistoryHash"];
  const missing=required.filter(x=>!k[x]);
  if(missing.length)return {status:"DURABLE_OPPORTUNITY_KEY_INCOMPLETE",missing};
  if(k.marketSymbolOnly===true)return {status:"MARKET_SYMBOL_KEY_PROHIBITED",missing:[]};
  return {status:"DURABLE_OPPORTUNITY_KEY_VALID",missing:[]};
}

export function validateNoSyntheticTransitionBars(r={}){
  if(r.syntheticBarInserted===true)return {status:"SYNTHETIC_TRANSITION_BAR_PROHIBITED"};
  if(r.transitionIntervalClassified!==true)return {status:"TRANSITION_INTERVAL_UNKNOWN"};
  return {status:"TRANSITION_CHRONOLOGY_VALID"};
}

export function validateModuleTransition(moduleId,r={}){
  if(moduleId==="D01-02"){
    return {status:r.identityBreak===true?"SUCCESSOR_FIRST_BAR_ONLY":"MODULE_TRANSITION_VALID"};
  }
  if(moduleId==="D01-03"){
    return {status:r.crossIdentitySequence===true?"CROSS_IDENTITY_SEQUENCE_PROHIBITED":"MODULE_TRANSITION_VALID"};
  }
  if(moduleId==="D01-07"){
    if(r.identityBreak===true&&r.predecessorEpisodeContinued===true)return {status:"SUCCESSOR_BASE_INHERITANCE_PROHIBITED"};
    return {status:"MODULE_TRANSITION_VALID"};
  }
  if(moduleId==="D01-09"){
    if(r.identityBreak===true&&r.classifiedAsOrdinaryGap===true)return {status:"CROSS_IDENTITY_ORDINARY_GAP_PROHIBITED"};
    return {status:"MODULE_TRANSITION_VALID"};
  }
  return {status:"MODULE_OUTSIDE_FIRST_WAVE"};
}

export function aggregateIdentityDenominator(rows=[]){
  const counts={
    sameSecurityContinuationN:0,
    codeChangeContinuationN:0,
    marketMigrationContinuationN:0,
    successorNewOpportunityN:0,
    multiSuccessorDependencyN:0,
    symbolReuseDifferentSecurityN:0,
    identityUnknownBlockedN:0
  };
  for(const r of rows){
    if(r.state in counts)counts[r.state]++;
    else counts.identityUnknownBlockedN++;
  }
  return {status:"IDENTITY_DENOMINATOR_ACCOUNTED",counts,total:rows.length};
}
