// D01 DL-066 suspension/resumption stale-anchor firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function classifySuspensionState({
  suspensionVerified,
  sameSession,
  noTradeBusinessDays
}={}){
  if(suspensionVerified!==true)
    return {status:"SUSPENSION_STATE_UNKNOWN"};

  const d=Number.isInteger(noTradeBusinessDays)&&noTradeBusinessDays>=0?noTradeBusinessDays:null;
  if(sameSession===true)
    return {status:"SAME_SESSION_SHORT_HALT",noTradeBusinessDays:d??0};
  if(d===1) return {status:"ONE_BUSINESS_DAY_SUSPENSION",noTradeBusinessDays:d};
  if(d!==null&&d>1&&d<=10) return {status:"MULTI_SESSION_SUSPENSION",noTradeBusinessDays:d};
  if(d!==null&&d>10) return {status:"EXTENDED_SUSPENSION",noTradeBusinessDays:d};
  return {status:"SUSPENSION_STATE_UNKNOWN"};
}

export function validateReopeningReceipt({
  suspensionStartAt,
  resumptionAnnouncementAt,
  resumptionEffectiveAt,
  firstMatchingAt,
  predictorFreezeAt,
  reopeningReferencePrice,
  replaySafe
}={}){
  const s=str(suspensionStartAt),a=str(resumptionAnnouncementAt),r=str(resumptionEffectiveAt),
    m=str(firstMatchingAt),f=str(predictorFreezeAt);
  if(!s||!r||!m||!f)
    return {status:"UNKNOWN",reason:"SUSPENSION_OR_REOPENING_CLOCK_INCOMPLETE"};
  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};
  if(a&&a>f)
    return {status:"POST_FREEZE_RESUMPTION_ANNOUNCEMENT_NOT_ELIGIBLE"};
  if(!finite(reopeningReferencePrice)||reopeningReferencePrice<=0)
    return {status:"DATA_BLOCKED",reason:"REOPENING_REFERENCE_INVALID"};
  return {status:"VALID",reopeningReferencePrice};
}

export function classifyNoTradeGeometry({
  suspendedSessionCount,
  pseudoBarsPresent,
  forwardFilledCloseUsed,
  zeroVolumeBarsUsed
}={}){
  if(!Number.isInteger(suspendedSessionCount)||suspendedSessionCount<0)
    return {status:"UNKNOWN",reason:"SUSPENDED_SESSION_COUNT_INVALID"};
  if(pseudoBarsPresent===true||forwardFilledCloseUsed===true||zeroVolumeBarsUsed===true)
    return {status:"PSEUDO_BAR_CONTAMINATION"};
  return {status:"NO_TRADE_INTERVAL_EXCLUDED",suspendedSessionCount};
}

export function classifyReopeningGap({
  lastExecutedPrice,
  firstReopeningAuctionPrice,
  corporateActionOverlap,
  priceLimitConstraint,
  benchmarkCatchupMaterial,
  eventNewsMaterial
}={}){
  if(!finite(lastExecutedPrice)||!finite(firstReopeningAuctionPrice))
    return {status:"UNKNOWN",reason:"REOPENING_GAP_INPUT_MISSING"};

  const rawGap=firstReopeningAuctionPrice-lastExecutedPrice;
  const explanations=[];
  if(corporateActionOverlap===true) explanations.push("CORPORATE_ACTION_RESET_EXPLANATION");
  if(priceLimitConstraint===true) explanations.push("PRICE_LIMIT_CONSTRAINT_EXPLANATION");
  if(benchmarkCatchupMaterial===true) explanations.push("CROSS_MARKET_CATCHUP_EXPLANATION");
  if(eventNewsMaterial===true) explanations.push("INFORMATION_ACCUMULATION_EXPLANATION");

  return {
    status:explanations.length?"ATTRIBUTION_CONTAMINATED":"STRUCTURAL_RESPONSE_NOT_YET_PROVEN",
    rawGap,
    explanations
  };
}

export function classifyAnchorFreshness({
  structuralRootKnown,
  suspensionVerified,
  noTradeBusinessDays,
  informationArrivalKnown
}={}){
  if(structuralRootKnown!==true) return {status:"NO_STRUCTURAL_ROOT"};
  if(suspensionVerified!==true) return {status:"ANCHOR_FRESHNESS_UNKNOWN"};
  if(!Number.isInteger(noTradeBusinessDays)||noTradeBusinessDays<0)
    return {status:"ANCHOR_FRESHNESS_UNKNOWN"};
  return {
    status:noTradeBusinessDays===0?"ANCHOR_OBSERVED_CURRENT_SESSION":"ROOT_PERSISTS_BUT_FRESHNESS_REQUIRES_VALIDATION",
    noTradeBusinessDays,
    informationArrivalKnown:informationArrivalKnown===true,
    arbitraryDecayScoreDefined:false
  };
}

export function classifyFirstAuctionBreakout({
  firstAuctionCrossesZone,
  preregisteredConfirmationObserved,
  confirmationAt,
  predictorFreezeAt
}={}){
  if(firstAuctionCrossesZone!==true)
    return {status:"NO_FIRST_AUCTION_CROSS"};
  if(preregisteredConfirmationObserved!==true)
    return {status:"FIRST_AUCTION_CROSS_UNCONFIRMED"};
  if(!str(confirmationAt)||!str(predictorFreezeAt))
    return {status:"UNKNOWN",reason:"CONFIRMATION_CLOCK_MISSING"};
  if(str(confirmationAt)>str(predictorFreezeAt))
    return {status:"CONFIRMATION_NOT_AVAILABLE_AT_FREEZE"};
  return {status:"REOPENING_BREAKOUT_CONFIRMATION_OBSERVED"};
}

export function buildReopeningLineage({
  rootPresent,
  reopeningGapPresent,
  firstAuctionBreakoutPresent,
  earlyMomentumPresent
}={}){
  const representations=[
    ["STRUCTURAL_ROOT",rootPresent],
    ["REOPENING_GAP",reopeningGapPresent],
    ["FIRST_AUCTION_BREAKOUT",firstAuctionBreakoutPresent],
    ["EARLY_MOMENTUM",earlyMomentumPresent]
  ].filter(([,v])=>v===true).map(([k])=>k);

  return {
    representations,
    informationRoot:"PRICE_OHLC",
    rawRepresentationCount:representations.length,
    effectiveIndependentEvidenceCount:representations.length?1:0
  };
}

export function classifyReopeningComparator({
  atStructuralZone,
  suspensionContextVerified
}={}){
  if(suspensionContextVerified!==true)
    return {status:"UNKNOWN",reason:"SUSPENSION_CONTEXT_UNVERIFIED"};
  return {
    status:atStructuralZone===true
      ?"G1_SUSPENSION_REOPENING_AT_STRUCTURAL_ZONE"
      :"G0_SUSPENSION_REOPENING_AWAY_FROM_STRUCTURAL_ZONE"
  };
}
