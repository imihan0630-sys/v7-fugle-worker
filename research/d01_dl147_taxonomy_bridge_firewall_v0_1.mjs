// D01 DL-147. Research-only taxonomy context adapter; never edits PRICE_OHLC pattern nodes.
const BLOCK=(reason)=>({state:"CONTEXT_BLOCKED",reason,sectorComparisonAllowed:false});
const ms=x=>Date.parse(x);
const clock=x=>typeof x==="string"&&Number.isFinite(ms(x));
export function applyTaxonomyBridge({priceNode,origin,target,bridge,decisionAt}){
 if(!priceNode?.securityId||!priceNode?.priceRootHash||!priceNode?.episodeId)
   return BLOCK("PRICE_NODE_NOT_CERTIFIED");
 if(!clock(decisionAt)||!origin||!target)return BLOCK("CLOCK_OR_INDUSTRY_UNKNOWN");
 const immutablePrice={securityId:priceNode.securityId,
   priceRootHash:priceNode.priceRootHash,episodeId:priceNode.episodeId};
 if(origin.securityId!==priceNode.securityId||target.securityId!==priceNode.securityId)
   return BLOCK("CROSS_SECURITY_IDENTITY");
 if(!origin.scheme||!target.scheme||!origin.version||!target.version)
   return BLOCK("SCHEME_VERSION_UNKNOWN");
 if(!clock(origin.availableAt)||!clock(target.availableAt)||
   ms(origin.availableAt)>ms(decisionAt)||ms(target.availableAt)>ms(decisionAt))
   return BLOCK("HISTORICAL_CLASSIFICATION_NOT_YET_KNOWN");
 if(!clock(origin.effectiveFrom)||!clock(target.effectiveFrom))
   return BLOCK("EFFECTIVE_TIME_UNKNOWN");
 if(ms(origin.effectiveFrom)>ms(decisionAt)||ms(target.effectiveFrom)>ms(decisionAt))
   return BLOCK("FUTURE_CLASSIFICATION_NOT_ACTIVE");
 if(origin.scheme===target.scheme&&origin.version===target.version)
   return origin.sector===target.sector&&origin.memberReceipt===target.memberReceipt
     ?{state:"SAME_TAXONOMY_CONTEXT",sectorComparisonAllowed:true,price:immutablePrice}
     :BLOCK("SAME_VERSION_MEMBERSHIP_CONFLICT");
 if(!bridge?.ownerReceiptId||bridge.ownerDomain!=="D09"||bridge.ownerCertified!==true||
    bridge.fromScheme!==origin.scheme||bridge.fromVersion!==origin.version||
    bridge.toScheme!==target.scheme||bridge.toVersion!==target.version)
   return BLOCK("BRIDGE_OWNER_VERSION_MISSING");
 if(!clock(bridge.availableAt)||ms(bridge.availableAt)>ms(decisionAt))
   return BLOCK("BRIDGE_NOT_KNOWN_AT_DECISION");
 if(!clock(bridge.effectiveFrom)||ms(bridge.effectiveFrom)>ms(decisionAt))
   return BLOCK("BRIDGE_NOT_YET_EFFECTIVE");
 if(bridge.mappingType==="LABEL_ALIAS_ONLY")
   return {state:"DISPLAY_ONLY_BRIDGE_NO_SECTOR_METRIC",sectorComparisonAllowed:false,
     price:immutablePrice,ownerReceiptId:bridge.ownerReceiptId};
 if(bridge.mappingType!=="RECOMPUTED_COMMON_SUPPORT")
   return BLOCK("BRIDGE_COMPARISON_MODE_UNKNOWN");
 if(bridge.peerMembershipCoverageComplete!==true||
   !bridge.originPeerSetHash||!bridge.targetPeerSetHash||
   !bridge.commonSupportHash||bridge.metricRecomputedAtDecision!==true)
   return BLOCK("PEER_SUPPORT_OR_RECOMPUTATION_UNKNOWN");
 if(bridge.unknownPeerCount!==0||bridge.conflictPeerCount!==0)
   return BLOCK("UNKNOWN_PEER_DENOMINATOR");
 return {state:"RECOMPUTED_SECTOR_CONTEXT_CERTIFIED",sectorComparisonAllowed:true,
   price:immutablePrice,ownerReceiptId:bridge.ownerReceiptId,
   commonSupportHash:bridge.commonSupportHash,antiDoubleCount:"PRICE_OHLC_IS_ONE_ROOT"};
}
export function tallyContextStates(rows){
 const counts={total:0,same:0,recomputed:0,displayOnly:0,blocked:0};
 for(const r of rows){
   counts.total++;
   if(r?.state==="SAME_TAXONOMY_CONTEXT")counts.same++;
   else if(r?.state==="RECOMPUTED_SECTOR_CONTEXT_CERTIFIED")counts.recomputed++;
   else if(r?.state==="DISPLAY_ONLY_BRIDGE_NO_SECTOR_METRIC")counts.displayOnly++;
   else counts.blocked++;
 }
 return {...counts,eligibleForSectorComparison:counts.same+counts.recomputed};
}
