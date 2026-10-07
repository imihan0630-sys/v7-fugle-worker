// D01 DL-083 multi candle sequence grammar v0.1
export function buildSequence({sourceBarIds=[],barCloseTimes=[],predictorFreezeAt}={}){
  if(!sourceBarIds.length||sourceBarIds.length!==barCloseTimes.length||!predictorFreezeAt)return {status:"UNKNOWN"};
  const last=[...barCloseTimes].sort().at(-1);
  return {status:last<=predictorFreezeAt?"SEQUENCE_AVAILABLE":"SEQUENCE_LOOKAHEAD",sourceBarIds:[...sourceBarIds],firstObservableAt:last};
}
export function overlapRatio({a=[],b=[]}={}){
  const A=new Set(a),B=new Set(b);let i=0;for(const x of A)if(B.has(x))i++;
  const u=new Set([...A,...B]).size;
  return u?i/u:0;
}
export function classifySequenceAlias({patternNames=[],sourceBarIds=[]}={}){
  return {status:"SEQUENCE_ALIAS_FAMILY",rawAliasCount:new Set(patternNames.filter(Boolean)).size,informationRoot:"PRICE_OHLC",redundancyGroup:sourceBarIds.join("|"),effectiveIndependentEvidenceCount:sourceBarIds.length?1:0};
}
export function preserveSequenceLifecycle({formed,confirmed,invalidated,unresolved}={}){
  return {status:"LIFECYCLE_PRESERVED",formed:!!formed,confirmed:!!confirmed,invalidated:!!invalidated,unresolved:!!unresolved,failedUnresolvedRetained:true};
}
