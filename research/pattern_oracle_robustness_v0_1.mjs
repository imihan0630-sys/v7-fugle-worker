// D01 DL-033 detector-oracle zone comparator v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function compareOracleZones({
  primary,
  alternative,
  atr=null
}={}){
  if(!primary||!alternative)
    return {status:"UNKNOWN",reason:"ZONE_OBJECT_MISSING"};

  if(primary.symbol!==alternative.symbol)
    return {status:"DATA_BLOCKED",reason:"CROSS_SYMBOL_COMPARISON"};

  if(primary.asOf!==alternative.asOf)
    return {status:"DATA_BLOCKED",reason:"ASOF_MISMATCH"};

  if(primary.semanticSpaceId!==alternative.semanticSpaceId)
    return {status:"DATA_BLOCKED",reason:"SEMANTIC_SPACE_CONFLICT"};

  for(const [name,z] of [["primary",primary],["alternative",alternative]]){
    if(!finite(z.lower)||!finite(z.upper)||z.lower>z.upper)
      return {status:"UNKNOWN",reason:`${name.toUpperCase()}_GEOMETRY_INVALID`};
    if(z.confirmedAt>z.asOf)
      return {status:"DATA_BLOCKED",reason:`${name.toUpperCase()}_FUTURE_CONFIRMATION`};
  }

  const lo=Math.max(primary.lower,alternative.lower);
  const hi=Math.min(primary.upper,alternative.upper);
  const intersection=Math.max(0,hi-lo);
  const union=Math.max(primary.upper,alternative.upper)-Math.min(primary.lower,alternative.lower);
  const pc=finite(primary.center)?primary.center:(primary.lower+primary.upper)/2;
  const ac=finite(alternative.center)?alternative.center:(alternative.lower+alternative.upper)/2;
  const dist=Math.abs(pc-ac);

  const pa=new Set(primary.anchorTimes||[]);
  const aa=new Set(alternative.anchorTimes||[]);
  let interA=0;
  for(const x of pa) if(aa.has(x)) interA++;
  const unionA=new Set([...pa,...aa]).size;

  return {
    status:"VALID",
    boundaryOverlapJaccard:union>0?intersection/union:null,
    centerDistanceAbs:dist,
    centerDistancePct:pc!==0?dist/Math.abs(pc):null,
    centerDistanceATR:finite(atr)&&atr>0?dist/atr:null,
    anchorTimeJaccard:unionA?interA/unionA:null,
    independentVoteEligible:false,
    representationClass:"ORACLE_ROBUSTNESS_DIAGNOSTIC"
  };
}

export function oracleMappingState({alternativeCount=0,provenanceComplete=true}={}){
  if(provenanceComplete!==true) return "UNKNOWN";
  if(alternativeCount===0) return "NO_ALTERNATIVE_OBJECT";
  if(alternativeCount===1) return "UNIQUE_COMPARABLE_OBJECT";
  return "MULTI_OBJECT_AMBIGUOUS";
}
