// D01 DL-073 zone-width precision firewall v0.1
const FAMILIES=new Set(["TICK_FIXED","SPREAD_SCALED","VOLATILITY_SCALED","EXECUTION_DISTRIBUTION","HYBRID_PREREGISTERED"]);
export function validateZone({family,lowerBound,upperBound,predictorFreezeAt,definedAt,outcomeBasedResize}={}){
  if(!FAMILIES.has(family)) return {status:"ZONE_FAMILY_UNSUPPORTED"};
  if(!Number.isFinite(lowerBound)||!Number.isFinite(upperBound)||lowerBound>upperBound) return {status:"ZONE_INVALID"};
  if(outcomeBasedResize===true) return {status:"WIDTH_SELECTION_LOOKAHEAD"};
  if(!definedAt||!predictorFreezeAt||definedAt>predictorFreezeAt) return {status:"ZONE_NOT_AVAILABLE_AT_FREEZE"};
  return {status:"ZONE_VALID",family,width:upperBound-lowerBound};
}
export function classifyCrossing({low,high,close,lowerBound,upperBound}={}){
  const vals=[low,high,close,lowerBound,upperBound];
  if(vals.some(x=>!Number.isFinite(x))) return {status:"DATA_BLOCKED"};
  if(high<lowerBound||low>upperBound) return {status:"OUTSIDE_ZONE"};
  if(low>=lowerBound&&high<=upperBound) return {status:"INSIDE_ZONE"};
  if(low<lowerBound&&high>upperBound) return {status:"FULL_ZONE_CROSS"};
  if(close>upperBound||close<lowerBound) return {status:"CLOSE_BEYOND_ZONE"};
  return {status:"PARTIAL_PENETRATION"};
}
export function normalizeWidth({lowerBound,upperBound,tickSize,midPrice,volatilityUnit}={}){
  if([lowerBound,upperBound,tickSize,midPrice,volatilityUnit].some(x=>!Number.isFinite(x)||x<=0)) return {status:"UNKNOWN"};
  const w=upperBound-lowerBound;
  return {status:"VALID",widthTicks:w/tickSize,widthBps:w/midPrice*10000,widthVolatilityUnits:w/volatilityUnit};
}
export function buildZoneFamilyLineage({families=[]}={}){
  const n=families.filter(x=>FAMILIES.has(x)).length;
  return {representationCount:n,informationRoot:"STRUCTURAL_ZONE_GEOMETRY",effectiveIndependentEvidenceCount:n?1:0};
}
