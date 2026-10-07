// D01 DL-075 structural episode alias firewall v0.1
export function buildEpisodeLineage({structuralEpisodeId,representations=[]}={}){
  const valid=representations.filter(Boolean);
  if(!structuralEpisodeId)return {status:"EPISODE_ID_UNKNOWN"};
  return {status:"EPISODE_LINEAGE_VALID",structuralEpisodeId,rawSignalCount:valid.length,
    effectiveIndependentEvidenceCount:valid.length?1:0,redundancyGroup:structuralEpisodeId,informationRoot:"PRICE_OHLC"};
}
export function classifyNewRoot({priorEpisodeClosed,newRootFormed,newRootFirstObservableAt,predictorFreezeAt}={}){
  if(priorEpisodeClosed!==true||newRootFormed!==true)return {status:"SAME_EPISODE"};
  if(!newRootFirstObservableAt||!predictorFreezeAt)return {status:"NEW_ROOT_CLOCK_UNKNOWN"};
  if(newRootFirstObservableAt>predictorFreezeAt)return {status:"NEW_ROOT_LOOKAHEAD"};
  return {status:"GENUINE_NEW_ROOT"};
}
export function validatePhaseClock({phaseAt,predictorFreezeAt}={}){
  if(!phaseAt||!predictorFreezeAt)return {status:"UNKNOWN"};
  return {status:phaseAt<=predictorFreezeAt?"PHASE_KNOWN_AT_FREEZE":"PHASE_NOT_KNOWN_AT_FREEZE"};
}
export function classifyValueSource({sameStructuralEpisode,entryTimingChanged,executionChanged,riskGeometryChanged}={}){
  return {status:"VALUE_SOURCES_SEPARATED",structuralInformationChanged:sameStructuralEpisode!==true,
    entryTimingChanged:!!entryTimingChanged,executionChanged:!!executionChanged,riskGeometryChanged:!!riskGeometryChanged};
}
export function preserveFailureLifecycle({states=[]}={}){
  const s=new Set(states.filter(Boolean));
  return {status:"FAILURE_LIFECYCLE_PRESERVED",states:[...s],failedStateCount:[...s].filter(x=>x.includes("FAILED")||x==="EPISODE_INVALIDATED").length};
}
