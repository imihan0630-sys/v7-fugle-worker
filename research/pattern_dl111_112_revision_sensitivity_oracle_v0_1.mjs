// D01 DL-111~112 revision blast-radius / sensitivity oracle v0.1

const FIRST_WAVE=new Set(["D01-02","D01-03","D01-07","D01-09"]);

export function classifyRevisionBlastRadius(r={}){
  const family=r.receiptFamily;
  if(family==="R1"){
    if(r.membershipOrSecurityIdentityChanged===true)return {status:"WINDOW_IDENTITY_CHANGED",affectedModules:"ALL"};
    return {status:"NO_MATERIAL_D01_CHANGE",affectedModules:[]};
  }
  if(family==="R2"){
    if(r.priceFieldsChanged===true)return {status:"RAW_PRICE_HISTORY_CHANGED",affectedModules:"PRICE_CONSUMERS"};
    if(r.volumeOnlyChanged===true)return {status:"NON_D01_FIELD_CHANGED",affectedModules:[]};
    return {status:"NO_MATERIAL_D01_CHANGE",affectedModules:[]};
  }
  if(family==="R3"){
    if(r.sessionEligibilityChanged===true)return {status:"WINDOW_IDENTITY_CHANGED",affectedModules:"ALL"};
    return {status:"NO_MATERIAL_D01_CHANGE",affectedModules:[]};
  }
  if(family==="R4"){
    if(r.continuityTransformChanged===true)return {status:"CONTINUITY_HISTORY_CHANGED",affectedModules:"CONTINUITY_CONSUMERS"};
    if(r.validationConfidenceOnly===true)return {status:"VALIDATION_CONFIDENCE_ONLY",affectedModules:[]};
    return {status:"NO_MATERIAL_D01_CHANGE",affectedModules:[]};
  }
  if(family==="R5"){
    if(r.referenceOrLimitChanged===true)return {status:"LEGAL_REFERENCE_CONTEXT_CHANGED",affectedModules:["D01-09"]};
    return {status:"NO_MATERIAL_D01_CHANGE",affectedModules:[]};
  }
  if(family==="R6"){
    if(r.matchingContextChanged===true)return {status:"MATCHING_CONTEXT_CHANGED",affectedModules:"CONTEXT_DEPENDENT"};
    return {status:"NO_MATERIAL_D01_CHANGE",affectedModules:[]};
  }
  return {status:"UNKNOWN_BLOCKED",affectedModules:null};
}

export function requiresDownstreamReplay({expectedSessionHashChanged,sourceHistoryHashChanged,continuityTransformHashChanged}={}){
  const reasons=[];
  if(expectedSessionHashChanged===true)reasons.push("EXPECTED_SESSION_HASH_CHANGED");
  if(sourceHistoryHashChanged===true)reasons.push("SOURCE_HISTORY_HASH_CHANGED");
  if(continuityTransformHashChanged===true)reasons.push("CONTINUITY_TRANSFORM_HASH_CHANGED");
  return {status:reasons.length?"DOWNSTREAM_REPLAY_REQUIRED":"NO_DOWNSTREAM_REPLAY_REQUIRED",reasons};
}

export function classifyRepresentationChange(oldR={},newR={}){
  if((oldR.exactSessionHash??null)!==(newR.exactSessionHash??null))
    return {status:"WINDOW_IDENTITY_CHANGE"};
  if((oldR.episodeId??null)!==(newR.episodeId??null))
    return {status:"EPISODE_IDENTITY_CHANGE"};
  if((oldR.firstObservableAt??null)!==(newR.firstObservableAt??null) ||
     (oldR.confirmedAt??null)!==(newR.confirmedAt??null))
    return {status:"CLOCK_CHANGE"};
  if((oldR.featureState??null)!==(newR.featureState??null)){
    if(oldR.featureState==="DATA_BLOCKED"&&newR.featureState!=="DATA_BLOCKED")return {status:"NEWLY_EVALUABLE"};
    if(oldR.featureState!=="DATA_BLOCKED"&&newR.featureState==="DATA_BLOCKED")return {status:"NO_LONGER_EVALUABLE"};
    return {status:"FEATURE_STATE_CHANGE"};
  }
  if((oldR.canonicalR7PayloadHash??null)!==(newR.canonicalR7PayloadHash??null))
    return {status:"VALUE_ONLY_CHANGE_SAME_STATE"};
  return {status:"UNCHANGED_REPRESENTATION"};
}

export function validateSensitivityPair(oldR={},newR={}){
  const fields=["opportunityId","moduleId","predictorDate","experimentFamilyId"];
  const drift=fields.filter(k=>(oldR[k]??null)!==(newR[k]??null));
  if(drift.length)return {status:"PAIR_IDENTITY_MISMATCH",drift};
  if(!FIRST_WAVE.has(oldR.moduleId))return {status:"MODULE_OUTSIDE_FIRST_WAVE",drift:[]};
  if(oldR.outcomeFieldsPresent===true||newR.outcomeFieldsPresent===true)return {status:"OUTCOME_CONTAMINATION",drift:[]};
  return {status:"SENSITIVITY_PAIR_VALID",drift:[]};
}

export function aggregateSensitivity(rows=[]){
  const counts={
    UNCHANGED_REPRESENTATION:0,
    VALUE_ONLY_CHANGE_SAME_STATE:0,
    FEATURE_STATE_CHANGE:0,
    EPISODE_IDENTITY_CHANGE:0,
    CLOCK_CHANGE:0,
    WINDOW_IDENTITY_CHANGE:0,
    NEWLY_EVALUABLE:0,
    NO_LONGER_EVALUABLE:0,
    UNKNOWN_BLOCKED:0
  };
  for(const r of rows){
    if(!(r.changeClass in counts))counts.UNKNOWN_BLOCKED++;
    else counts[r.changeClass]++;
  }
  const n=rows.length;
  const rates={};
  for(const [k,v] of Object.entries(counts))rates[k]=n?v/n:0;
  return {status:"SENSITIVITY_AGGREGATED",affectedOpportunityCount:n,counts,rates};
}

export function validateModuleFamilyStratification(rows=[]){
  const modules=new Set(rows.map(r=>r.moduleId));
  const families=new Set(rows.map(r=>r.receiptFamily));
  const invalidModules=[...modules].filter(x=>!FIRST_WAVE.has(x));
  const invalidFamilies=[...families].filter(x=>!["R1","R2","R3","R4","R5","R6"].includes(x));
  return {status:invalidModules.length||invalidFamilies.length?"STRATIFICATION_INVALID":"STRATIFICATION_VALID",invalidModules,invalidFamilies};
}

export function validateNoArbitraryRobustnessThreshold({thresholdPreregisteredBeforeCounts,thresholdUsedToDeclareRobustness}={}){
  if(thresholdUsedToDeclareRobustness===true&&thresholdPreregisteredBeforeCounts!==true)
    return {status:"POST_HOC_ROBUSTNESS_THRESHOLD_PROHIBITED"};
  return {status:"ROBUSTNESS_THRESHOLD_POLICY_VALID"};
}
