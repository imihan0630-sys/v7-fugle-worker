// D01 DL-078 confluence topology firewall v0.1
export function classifyConfluence({objects=[]}={}){
  const roots=new Set(objects.map(x=>x?.informationRoot).filter(Boolean));
  return {status:"CONFLUENCE_CLASSIFIED",rawObjectCount:objects.length,effectiveIndependentRootCount:roots.size};
}
export function classifyOverlap({aLower,aUpper,bLower,bUpper}={}){
  const vals=[aLower,aUpper,bLower,bUpper];
  if(vals.some(x=>!Number.isFinite(x)))return {status:"UNKNOWN"};
  const lo=Math.max(aLower,bLower), hi=Math.min(aUpper,bUpper);
  const intersection=Math.max(0,hi-lo);
  const union=Math.max(aUpper,bUpper)-Math.min(aLower,bLower);
  return {status:intersection>0?"ZONES_OVERLAP":"ZONES_DISJOINT",intersectionWidth:intersection,unionWidth:union};
}
export function classifyMerge({sameInformationRoot,sameEpisode,deterministicTransform,zonesOverlap}={}){
  if(zonesOverlap!==true)return {status:"NO_MERGE"};
  if(sameInformationRoot===true&&(sameEpisode===true||deterministicTransform===true))
    return {status:"TOPOLOGICAL_MERGE",evidenceMultiplier:1};
  return {status:"DISTINCTNESS_REQUIRES_VALIDATION"};
}
export function validateSplit({rulePreregistered,usesFutureOutcome,distinctRootsObservable}={}){
  if(usesFutureOutcome===true)return {status:"MERGE_SPLIT_SELECTION_BIAS"};
  if(rulePreregistered!==true)return {status:"SPLIT_NOT_PREREGISTERED"};
  return {status:distinctRootsObservable===true?"SPLIT_ELIGIBLE":"KEEP_MERGED"};
}
export function classifyDistinctRoot({priceRootPresent,independentNonPriceRootCertified}={}){
  if(priceRootPresent===true&&independentNonPriceRootCertified===true)
    return {status:"GENUINE_DISTINCT_ROOT_CANDIDATE",effectiveIndependentRootCount:2};
  return {status:"SAME_OR_UNCERTIFIED_ROOT",effectiveIndependentRootCount:priceRootPresent?1:0};
}
