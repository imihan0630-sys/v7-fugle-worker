// D01 DL-064 no-public-event / opening-liquidity attribution firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function classifyPublicEventCoverage({
  requiredLanes=[],
  coveredLanes=[],
  coverageComplete,
  knownAt,
  predictorFreezeAt,
  eventIdentified,
  eventKnownAt,
  dataBlocked
}={}){
  if(dataBlocked===true)
    return {state:"SOURCE_COVERAGE_DATA_BLOCKED",baselineEligible:false};

  const freeze=str(predictorFreezeAt);
  if(!freeze||!str(knownAt))
    return {state:"PUBLIC_EVENT_STATUS_UNKNOWN",baselineEligible:false};

  if(str(knownAt)>freeze)
    return {state:"PUBLIC_EVENT_STATUS_UNKNOWN",baselineEligible:false,reason:"COVERAGE_RECEIPT_POST_FREEZE"};

  const req=[...new Set(requiredLanes.map(String))].sort();
  const got=new Set(coveredLanes.map(String));
  const laneComplete=req.every(x=>got.has(x));

  if(eventIdentified===true){
    if(!str(eventKnownAt)||str(eventKnownAt)>freeze)
      return {state:"PUBLIC_EVENT_DISCOVERED_AFTER_OPEN",baselineEligible:false};
    return {state:"PUBLIC_EVENT_IDENTIFIED",baselineEligible:true,coverageComplete:coverageComplete===true&&laneComplete};
  }

  if(coverageComplete===true&&laneComplete)
    return {state:"NO_PUBLIC_EVENT_IDENTIFIED_COVERAGE_COMPLETE",baselineEligible:true};

  return {state:"PUBLIC_EVENT_STATUS_UNKNOWN",baselineEligible:false};
}

export function classifyInventoryPressure({
  priorCloseOfi,
  priorCloseAuctionPressure,
  openingImbalance,
  pressureCoverageComplete,
  directionKnown,
  dataBlocked
}={}){
  if(dataBlocked===true)
    return {state:"INVENTORY_CONTEXT_DATA_BLOCKED",coverageComplete:false};

  if(pressureCoverageComplete!==true)
    return {state:"PRESSURE_CONTEXT_UNKNOWN",coverageComplete:false};

  const priorObserved=finite(priorCloseOfi)||priorCloseAuctionPressure===true;
  const openingObserved=openingImbalance?.observed===true;

  if(!priorObserved&&!openingObserved)
    return {state:"NO_CERTIFIED_INVENTORY_PRESSURE_CONTEXT",coverageComplete:true,observedPressure:false};

  if(directionKnown===false)
    return {state:"PRESSURE_DIRECTION_UNKNOWN",coverageComplete:true,observedPressure:true};

  if(priorObserved&&openingObserved)
    return {state:"PRIOR_CLOSE_AND_OPENING_PRESSURE_CHAIN",coverageComplete:true,observedPressure:true};

  if(openingObserved)
    return {state:"OPENING_LIQUIDITY_IMBALANCE_OBSERVED",coverageComplete:true,observedPressure:true};

  if(priorCloseAuctionPressure===true)
    return {state:"PRIOR_CLOSE_AUCTION_PRESSURE_OBSERVED",coverageComplete:true,observedPressure:true};

  if(finite(priorCloseOfi)){
    if(priorCloseOfi<0)
      return {state:"PRIOR_CLOSE_SELL_PRESSURE_OBSERVED",coverageComplete:true,observedPressure:true};
    if(priorCloseOfi>0)
      return {state:"PRIOR_CLOSE_BUY_PRESSURE_OBSERVED",coverageComplete:true,observedPressure:true};
    return {state:"NO_CERTIFIED_INVENTORY_PRESSURE_CONTEXT",coverageComplete:true,observedPressure:false};
  }

  return {state:"PRESSURE_DIRECTION_UNKNOWN",coverageComplete:true,observedPressure:true};
}

export function classifyEventPressureMatrix({
  eventCoverage,
  pressure
}={}){
  const e=eventCoverage?.state??"PUBLIC_EVENT_STATUS_UNKNOWN";
  const p=pressure?.observedPressure===true;
  const pressureKnown=pressure?.coverageComplete===true;

  if(e==="PUBLIC_EVENT_IDENTIFIED")
    return {state:p?"EVENT_IDENTIFIED_PRESSURE_OBSERVED":"EVENT_IDENTIFIED_PRESSURE_UNKNOWN"};

  if(e==="NO_PUBLIC_EVENT_IDENTIFIED_COVERAGE_COMPLETE"){
    if(!pressureKnown) return {state:"NO_EVENT_COMPLETE_PRESSURE_UNKNOWN"};
    return {state:p?"NO_EVENT_COMPLETE_PRESSURE_OBSERVED":"NO_EVENT_COMPLETE_NO_PRESSURE_OBSERVED"};
  }

  if(p) return {state:"EVENT_STATUS_UNKNOWN_PRESSURE_OBSERVED"};
  return {state:"BOTH_EVENT_AND_PRESSURE_UNKNOWN"};
}

export function validateStrictResidualCohort({
  eventCoverage,
  pressure,
  corporateActionResolved,
  auctionReplaySafe
}={}){
  if(corporateActionResolved!==true)
    return {status:"NOT_ELIGIBLE",reason:"CORPORATE_ACTION_UNRESOLVED"};

  if(auctionReplaySafe!==true)
    return {status:"NOT_ELIGIBLE",reason:"OPENING_AUCTION_CONTEXT_UNSAFE"};

  if(eventCoverage?.state!=="NO_PUBLIC_EVENT_IDENTIFIED_COVERAGE_COMPLETE")
    return {status:"NOT_ELIGIBLE",reason:"NO_EVENT_COMPLETENESS_NOT_PROVEN"};

  if(pressure?.coverageComplete!==true)
    return {status:"NOT_ELIGIBLE",reason:"PRESSURE_COVERAGE_INCOMPLETE"};

  if(pressure?.observedPressure===true)
    return {status:"NOT_ELIGIBLE",reason:"OBSERVED_PRESSURE_PRESENT"};

  return {
    status:"STRICT_NO_EVENT_NO_OBSERVED_PRESSURE",
    latentPressureExcluded:false,
    noInformationClaimAllowed:false
  };
}

export function validatePressureInference({
  inferOfiFromReturn,
  inferHiddenBookFromTopFive,
  inferInventoryFromReversal,
  inferTraderIntent
}={}){
  if(inferOfiFromReturn===true)
    return {status:"PROHIBITED",reason:"RETURN_CANNOT_RECONSTRUCT_OFI"};
  if(inferHiddenBookFromTopFive===true)
    return {status:"PROHIBITED",reason:"TOP_FIVE_CANNOT_RECONSTRUCT_FULL_BOOK"};
  if(inferInventoryFromReversal===true)
    return {status:"PROHIBITED",reason:"REVERSAL_DOES_NOT_IDENTIFY_INVENTORY"};
  if(inferTraderIntent===true)
    return {status:"PROHIBITED",reason:"PRICE_OR_BOOK_DOES_NOT_IDENTIFY_INTENT"};
  return {status:"VALID"};
}

export function buildNoEventLiquidityFrame({
  parentDecisionId,
  eventCoverage,
  pressure,
  matrix,
  rawRepresentationCount=1
}={}){
  if(!str(parentDecisionId))
    return {status:"UNKNOWN",reason:"PARENT_ID_MISSING"};
  return {
    status:"VALID",
    parentDecisionId:str(parentDecisionId),
    eventState:eventCoverage?.state??"UNKNOWN",
    pressureState:pressure?.state??"UNKNOWN",
    matrixState:matrix?.state??"UNKNOWN",
    informationRoot:"CROSS_SESSION_PRICE_ORDERFLOW",
    rawRepresentationCount,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    outcomeJoinAllowed:false
  };
}
