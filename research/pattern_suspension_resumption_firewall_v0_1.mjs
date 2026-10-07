// D01 DL-066 suspension/resumption firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function classifySessionGap({
  marketSessionExpected,
  verifiedSymbolSuspension,
  sourceBarPresent
}={}){
  if(verifiedSymbolSuspension===true){
    return {
      state:"VERIFIED_SUSPENSION_SESSION",
      sourceMissing:false,
      pseudoBarAllowed:false,
      expectedTradableSession:false
    };
  }

  if(marketSessionExpected===true&&sourceBarPresent!==true)
    return {
      state:"UNEXPLAINED_SOURCE_OR_SESSION_GAP",
      sourceMissing:true,
      pseudoBarAllowed:false,
      expectedTradableSession:true
    };

  return {
    state:"NORMAL_OR_NONMARKET_SESSION",
    sourceMissing:false,
    pseudoBarAllowed:false
  };
}

export function buildSuspensionAgeState({
  eligibleSessionAgeBefore,
  eligibleSessionsAfterResumption,
  suspensionCalendarDays,
  suspensionMarketSessions
}={}){
  if(!finite(eligibleSessionAgeBefore)||eligibleSessionAgeBefore<0||
     !finite(eligibleSessionsAfterResumption)||eligibleSessionsAfterResumption<0||
     !finite(suspensionCalendarDays)||suspensionCalendarDays<0||
     !finite(suspensionMarketSessions)||suspensionMarketSessions<0)
    return {status:"UNKNOWN",reason:"AGE_INPUT_INVALID"};

  return {
    status:"VALID",
    eligibleTradingSessionAge:eligibleSessionAgeBefore+eligibleSessionsAfterResumption,
    suspensionCalendarDays,
    suspensionMarketSessions,
    calendarInformationAgeIncrement:suspensionCalendarDays,
    tradingSessionAgeIncrementDuringSuspension:0,
    clocksCollapsed:false
  };
}

export function classifyResumptionPhase({
  suspensionVerified,
  acceptingOrders,
  indicativeOnly,
  firstCallPrint,
  continuousTrading,
  delayedOrDeferred
}={}){
  if(suspensionVerified!==true) return {state:"SUSPENSION_PROVENANCE_UNKNOWN"};
  if(delayedOrDeferred===true) return {state:"RESUMPTION_DELAYED_OR_DEFERRED"};
  if(firstCallPrint===true) return {state:"RESUMPTION_FIRST_CALL_PRINT",continuousTouch:false};
  if(indicativeOnly===true) return {state:"RESUMPTION_INDICATIVE_STATE",executedPrice:false};
  if(acceptingOrders===true) return {state:"RESUMPTION_ORDER_ACCEPTANCE"};
  if(continuousTrading===true) return {state:"POST_RESUMPTION_CONTINUOUS_TRADING",continuousTouch:true};
  return {state:"VERIFIED_SUSPENSION_ACTIVE"};
}

export function classifyResumptionGap({
  lastPreSuspensionPrice,
  resumptionFirstPrint,
  boundary
}={}){
  if(!finite(lastPreSuspensionPrice)||!finite(resumptionFirstPrint)||
     !finite(boundary?.lower)||!finite(boundary?.upper)||boundary.upper<boundary.lower)
    return {status:"UNKNOWN",reason:"PRICE_OR_BOUNDARY_INVALID"};

  const oldSide=lastPreSuspensionPrice<boundary.lower?"BELOW":
    lastPreSuspensionPrice>boundary.upper?"ABOVE":"INSIDE";
  const newSide=resumptionFirstPrint<boundary.lower?"BELOW":
    resumptionFirstPrint>boundary.upper?"ABOVE":"INSIDE";

  const gapCross=(oldSide==="BELOW"&&newSide==="ABOVE")||
    (oldSide==="ABOVE"&&newSide==="BELOW");

  return {
    status:gapCross?"RESUMPTION_GAP_CROSSING":"NO_OPPOSITE_SIDE_RESUMPTION_GAP",
    oldSide,newSide,
    continuousPathInvented:false
  };
}

export function validateSuspensionReceipt({
  firstObservableAt,
  knownAt,
  suspensionStartAt,
  suspensionEndAt,
  predictorFreezeAt,
  replaySafe
}={}){
  const first=str(firstObservableAt),known=str(knownAt),start=str(suspensionStartAt),end=str(suspensionEndAt),freeze=str(predictorFreezeAt);
  if(replaySafe!==true) return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};
  if(!first||!known||!start||!freeze) return {status:"UNKNOWN",reason:"CLOCK_INCOMPLETE"};
  if(first>freeze||known>freeze) return {status:"POST_FREEZE_SUSPENSION_RECEIPT_NOT_ELIGIBLE"};
  if(end&&end<start) return {status:"UNKNOWN",reason:"SUSPENSION_INTERVAL_INVALID"};
  return {status:"VALID",openEnded:!end};
}

export function classifyStaleAnchor({
  suspensionCalendarDays,
  marketMoveDuringSuspension,
  sectorMoveDuringSuspension,
  oldZoneStillDefined
}={}){
  if(oldZoneStillDefined!==true)
    return {status:"OLD_STRUCTURE_NOT_DEFINED"};

  return {
    status:"PRE_SUSPENSION_PRICE_STALE_ANCHOR_CANDIDATE",
    suspensionCalendarDays:finite(suspensionCalendarDays)?suspensionCalendarDays:null,
    marketMoveDuringSuspension:finite(marketMoveDuringSuspension)?marketMoveDuringSuspension:null,
    sectorMoveDuringSuspension:finite(sectorMoveDuringSuspension)?sectorMoveDuringSuspension:null,
    currentEquilibriumProven:false
  };
}

export function classifySuspensionComparator({
  atOldStructuralZone,
  suspensionContextVerified
}={}){
  if(suspensionContextVerified!==true)
    return {status:"UNKNOWN",reason:"SUSPENSION_CONTEXT_UNVERIFIED"};

  return {
    status:atOldStructuralZone===true
      ?"G1_RESUMPTION_EVENT_AT_OLD_STRUCTURAL_ZONE"
      :"G0_RESUMPTION_EVENT_AWAY_FROM_OLD_STRUCTURAL_ZONE"
  };
}

export function buildSuspensionLineage({
  priceRepresentations=0,
  newsContextPresent=false,
  orderBookContextPresent=false
}={}){
  return {
    informationRoot:"PRICE_OHLC",
    priceRepresentations,
    newsContextPresent:newsContextPresent===true,
    orderBookContextPresent:orderBookContextPresent===true,
    externalContextCreatesAutomaticVote:false,
    effectiveIndependentEvidenceCount:1
  };
}


export function classifySuspensionFreshness({
  provenanceVerified,
  sameSessionHalt,
  suspensionMarketSessions,
  canonicalExtendedSuspension
}={}){
  if(provenanceVerified!==true)
    return {state:"SUSPENSION_FRESHNESS_UNKNOWN"};
  if(sameSessionHalt===true)
    return {state:"SAME_SESSION_SHORT_HALT"};
  if(!finite(suspensionMarketSessions)||suspensionMarketSessions<0)
    return {state:"SUSPENSION_FRESHNESS_UNKNOWN"};
  if(canonicalExtendedSuspension===true)
    return {state:"CANONICAL_EXTENDED_SUSPENSION"};
  if(suspensionMarketSessions===1)
    return {state:"ONE_MARKET_SESSION_SUSPENSION"};
  if(suspensionMarketSessions>1)
    return {state:"MULTI_SESSION_SUSPENSION"};
  return {state:"SAME_SESSION_SHORT_HALT"};
}

export function classifyReopeningDiscovery({
  resumptionFirstCallPrintObserved,
  firstContinuousTradeObserved,
  registeredDiscoveryWindow,
  selectedWindowAfterOutcome
}={}){
  if(selectedWindowAfterOutcome===true)
    return {status:"PROHIBITED",reason:"POST_OUTCOME_DISCOVERY_WINDOW_SELECTION"};
  if(!str(registeredDiscoveryWindow))
    return {status:"UNKNOWN",reason:"DISCOVERY_WINDOW_UNREGISTERED"};
  if(resumptionFirstCallPrintObserved===true&&firstContinuousTradeObserved!==true)
    return {
      status:"FIRST_CALL_ONLY",
      confirmedBreakoutAllowed:false,
      rootReconfirmationAllowed:false
    };
  if(firstContinuousTradeObserved===true)
    return {
      status:"POST_RESUMPTION_DISCOVERY_OBSERVABLE",
      confirmedBreakoutAllowed:true,
      rootReconfirmationAllowed:true
    };
  return {status:"REOPENING_NOT_YET_OBSERVABLE"};
}

export function classifyReopeningRootState({
  oldRootDefined,
  corporateActionRebased,
  marketInvalidatedByKnownInformation,
  postReopeningConfirmation,
  breachedDuringDiscovery
}={}){
  if(oldRootDefined!==true)
    return {state:"ROOT_STATE_UNKNOWN"};
  if(corporateActionRebased===true)
    return {state:"ROOT_REBASED_BY_MECHANICAL_EVENT"};
  if(marketInvalidatedByKnownInformation===true)
    return {state:"ROOT_INVALIDATED_BY_NEW_INFORMATION"};
  if(postReopeningConfirmation===true)
    return {state:"ROOT_RECONFIRMED_AFTER_REOPENING"};
  if(breachedDuringDiscovery===true)
    return {state:"ROOT_BREACHED_DURING_REOPENING_DISCOVERY"};
  return {state:"ROOT_PERSISTS_BUT_STALE"};
}
