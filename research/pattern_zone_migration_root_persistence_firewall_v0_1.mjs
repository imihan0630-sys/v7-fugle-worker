// D01 DL-079 zone migration/root persistence firewall v0.1
export function classifyMigration({sameRoot,centerShiftTicks,widthBefore,widthAfter,merged,split}={}){
  if(sameRoot!==true)return {status:"NEW_ROOT_CANDIDATE"};
  if(merged===true)return {status:"SAME_ROOT_MERGE"};
  if(split===true)return {status:"SAME_ROOT_SPLIT"};
  if(Number.isFinite(widthBefore)&&Number.isFinite(widthAfter)){
    if(widthAfter>widthBefore)return {status:"SAME_ROOT_WIDENING"};
    if(widthAfter<widthBefore)return {status:"SAME_ROOT_NARROWING"};
  }
  if(Number.isFinite(centerShiftTicks)&&centerShiftTicks!==0)return {status:"SAME_ROOT_TRANSLATION"};
  return {status:"SAME_ROOT_RESHAPE"};
}
export function observationOverlap({parentIds=[],childIds=[]}={}){
  const p=new Set(parentIds.filter(Boolean)), c=new Set(childIds.filter(Boolean));
  let inter=0; for(const id of c)if(p.has(id))inter++;
  const union=new Set([...p,...c]).size;
  return {status:"VALID",intersectionCount:inter,unionCount:union,overlapRatio:union?inter/union:0,newObservationShare:c.size?([...c].filter(x=>!p.has(x)).length/c.size):0};
}
export function classifyRootRenewal({priorRootClosed,newObservationSetDistinct,deterministicTransform,firstObservableAt,predictorFreezeAt,minSeparationSatisfied,usesFutureOutcome}={}){
  if(usesFutureOutcome===true)return {status:"ROOT_RENEWAL_SELECTION_BIAS"};
  if(deterministicTransform===true)return {status:"KEEP_EXISTING_ROOT"};
  if(priorRootClosed!==true||newObservationSetDistinct!==true||minSeparationSatisfied!==true)return {status:"KEEP_EXISTING_ROOT"};
  if(!firstObservableAt||!predictorFreezeAt)return {status:"ROOT_RENEWAL_CLOCK_UNKNOWN"};
  if(firstObservableAt>predictorFreezeAt)return {status:"ROOT_RENEWAL_LOOKAHEAD"};
  return {status:"GENUINE_NEW_ROOT_CANDIDATE"};
}
export function classifyVersionLineage({structuralRootId,zoneVersionId,parentZoneVersionId}={}){
  if(!structuralRootId||!zoneVersionId)return {status:"LINEAGE_UNKNOWN"};
  return {status:"ZONE_VERSION_LINEAGE_VALID",structuralRootId,zoneVersionId,parentZoneVersionId:parentZoneVersionId??null,effectiveIndependentEvidenceCount:1};
}
