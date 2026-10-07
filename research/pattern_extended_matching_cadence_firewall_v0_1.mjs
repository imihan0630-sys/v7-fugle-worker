// D01 DL-068 extended matching cadence firewall v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function str(x){return String(x??"");}

export function classifyMatchingCadence({
  receiptVerified,
  intervalMinutes,
  alteredTradingMethod,
  periodicCallAuction,
  canonicalCustomClass
}={}){
  if(receiptVerified!==true)
    return {state:"MATCHING_CADENCE_UNKNOWN"};

  if(str(canonicalCustomClass))
    return {state:"CANONICAL_CUSTOM_MATCHING_INTERVAL",intervalMinutes};

  if(!finite(intervalMinutes)||intervalMinutes<=0)
    return {state:"MATCHING_CADENCE_UNKNOWN"};

  if(periodicCallAuction===true&&intervalMinutes>=60)
    return {state:"PERIODIC_CALL_APPROX_60M",intervalMinutes};

  if(periodicCallAuction===true&&intervalMinutes>=45)
    return {state:"PERIODIC_CALL_APPROX_45M",intervalMinutes};

  if(alteredTradingMethod===true&&intervalMinutes>=25)
    return {state:"ALTERED_METHOD_APPROX_25M",intervalMinutes};

  if(alteredTradingMethod===true&&intervalMinutes>=10)
    return {state:"ALTERED_METHOD_APPROX_10M",intervalMinutes};

  if(intervalMinutes>=2)
    return {state:"EXTENDED_MATCHING_APPROX_2M",intervalMinutes};

  return {state:"REGULAR_CONTINUOUS_MATCHING",intervalMinutes};
}

export function classifyObservedMarketState({
  scheduledMatchOpportunity,
  quoteObserved,
  indicativeComputedPrice,
  actualTradeObserved,
  actualTradePrice
}={}){
  if(scheduledMatchOpportunity!==true)
    return {state:"NO_EXECUTABLE_MATCH_OPPORTUNITY",executed:false};

  if(actualTradeObserved===true&&finite(actualTradePrice))
    return {
      state:"EXECUTED_MATCH",
      executed:true,
      actualTradePrice
    };

  if(quoteObserved===true&&finite(indicativeComputedPrice))
    return {
      state:"QUOTE_ONLY_ZONE_RELATION",
      executed:false,
      indicativeComputedPrice
    };

  return {state:"SCHEDULED_MATCH_NO_EXECUTION",executed:false};
}

export function classifyBarIntegrity({
  actualTradeCount,
  scheduledMatchOpportunityCount,
  executedMatchCount,
  staleCarryForwardUsed
}={}){
  if(!finite(actualTradeCount)||actualTradeCount<0||
     !finite(scheduledMatchOpportunityCount)||scheduledMatchOpportunityCount<0||
     !finite(executedMatchCount)||executedMatchCount<0)
    return {status:"UNKNOWN",reason:"BAR_COUNTS_INVALID"};

  if(staleCarryForwardUsed===true)
    return {
      status:"PROHIBITED",
      reason:"STALE_CARRY_FORWARD_PSEUDO_BAR"
    };

  return {
    status:"VALID",
    actualTradeCount,
    scheduledMatchOpportunityCount,
    executedMatchCount,
    noExecutionEqualsPriceAcceptance:false
  };
}

export function classifyPeriodicGap({
  previousExecutedPrice,
  currentExecutedPrice,
  boundary,
  continuousPathObserved
}={}){
  if(!finite(previousExecutedPrice)||!finite(currentExecutedPrice)||
     !finite(boundary?.lower)||!finite(boundary?.upper)||boundary.upper<boundary.lower)
    return {status:"UNKNOWN",reason:"PRICE_OR_BOUNDARY_INVALID"};

  const oldSide=previousExecutedPrice<boundary.lower?"BELOW":
    previousExecutedPrice>boundary.upper?"ABOVE":"INSIDE";
  const newSide=currentExecutedPrice<boundary.lower?"BELOW":
    currentExecutedPrice>boundary.upper?"ABOVE":"INSIDE";
  const opposite=(oldSide==="BELOW"&&newSide==="ABOVE")||
    (oldSide==="ABOVE"&&newSide==="BELOW");

  if(opposite&&continuousPathObserved!==true)
    return {
      status:"PERIODIC_MATCH_GAP_CROSSING",
      oldSide,newSide,
      continuousBreakout:false
    };

  return {
    status:"EXECUTED_ZONE_RELATION",
    oldSide,newSide,
    continuousBreakout:continuousPathObserved===true&&opposite
  };
}

export function classifyStructuralOpportunity({
  scheduledMatchOpportunity,
  actualTradeObserved,
  actualTradePrice,
  boundary,
  matchPostponedByStabilization
}={}){
  if(matchPostponedByStabilization===true)
    return {state:"MATCH_POSTPONED_BY_STABILIZATION",executed:false};

  if(scheduledMatchOpportunity!==true)
    return {state:"NO_EXECUTABLE_MATCH_OPPORTUNITY",executed:false};

  if(actualTradeObserved!==true||!finite(actualTradePrice))
    return {state:"SCHEDULED_MATCH_NO_EXECUTION",executed:false};

  if(!finite(boundary?.lower)||!finite(boundary?.upper)||boundary.upper<boundary.lower)
    return {state:"MATCHING_CADENCE_DATA_BLOCKED",executed:false};

  if(actualTradePrice<boundary.lower)
    return {state:"EXECUTED_MATCH_BELOW_ZONE",executed:true};
  if(actualTradePrice>boundary.upper)
    return {state:"EXECUTED_MATCH_ABOVE_ZONE",executed:true};
  return {state:"EXECUTED_MATCH_INSIDE_ZONE",executed:true};
}

export function validateDispositionReceipt({
  firstObservableAt,
  knownAt,
  effectiveFrom,
  effectiveTo,
  predictorFreezeAt,
  matchingIntervalSeconds,
  measureVersion,
  replaySafe
}={}){
  const first=str(firstObservableAt),known=str(knownAt),from=str(effectiveFrom),
    to=str(effectiveTo),freeze=str(predictorFreezeAt),version=str(measureVersion);

  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};

  if(!first||!known||!from||!freeze||!version||!finite(matchingIntervalSeconds)||matchingIntervalSeconds<=0)
    return {status:"UNKNOWN",reason:"DISPOSITION_RECEIPT_INCOMPLETE"};

  if(first>freeze||known>freeze||from>freeze)
    return {status:"POST_FREEZE_DISPOSITION_RECEIPT_NOT_ELIGIBLE"};

  if(to&&to<from)
    return {status:"UNKNOWN",reason:"DISPOSITION_INTERVAL_INVALID"};

  return {status:"VALID",openEnded:!to};
}

export function buildCadenceLineage({
  priceRepresentations=0,
  matchingRegimeReceiptPresent=false,
  orderRestrictionReceiptPresent=false
}={}){
  return {
    informationRoot:"PRICE_OHLC",
    priceRepresentations,
    matchingRegimeReceiptPresent:matchingRegimeReceiptPresent===true,
    orderRestrictionReceiptPresent:orderRestrictionReceiptPresent===true,
    regulatoryContextCreatesAutomaticVote:false,
    effectiveIndependentEvidenceCount:1
  };
}
