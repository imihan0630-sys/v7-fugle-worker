// D01 DL-063 prior-day structure vs overnight/opening attribution v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

function side(price,zone){
  if(!finite(price)||!finite(zone?.lower)||!finite(zone?.upper)||zone.upper<zone.lower)
    return null;
  if(price>zone.upper) return "ABOVE";
  if(price<zone.lower) return "BELOW";
  return "INSIDE";
}

export function classifyPriorZoneCarry({
  structuralRootId,
  priorStructureConfirmedAt,
  priorSessionEndAt,
  replaySafe,
  continuityVerified
}={}){
  if(!str(structuralRootId)||!str(priorStructureConfirmedAt)||!str(priorSessionEndAt))
    return {status:"UNKNOWN",reason:"PRIOR_STRUCTURE_IDENTITY_INCOMPLETE"};

  if(replaySafe!==true||continuityVerified!==true)
    return {status:"DATA_BLOCKED",reason:"PRIOR_STRUCTURE_REPLAY_OR_CONTINUITY_INVALID"};

  if(str(priorStructureConfirmedAt)>str(priorSessionEndAt))
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"PRIOR_STRUCTURE_CONFIRMED_AFTER_SESSION_END"};

  return {status:"PRIOR_STRUCTURE_CARRY_VALID",structuralRootId:str(structuralRootId)};
}

export function classifyOvernightContext({
  receipt,
  predictorFreezeAt
}={}){
  const freeze=str(predictorFreezeAt);
  if(!receipt)
    return {state:"OVERNIGHT_CONTEXT_UNKNOWN",baselineEligible:false};

  if(receipt.corporateActionUnresolved===true)
    return {state:"OVERNIGHT_GAP_DATA_BLOCKED",baselineEligible:false};

  if(receipt.replaySafe!==true)
    return {state:"OVERNIGHT_CONTEXT_DATA_BLOCKED",baselineEligible:false};

  const knownAt=str(receipt.knownAt);
  if(!knownAt||!freeze)
    return {state:"OVERNIGHT_CONTEXT_DATA_BLOCKED",baselineEligible:false};

  if(knownAt>freeze)
    return {state:"POST_OPEN_DISCOVERED_CONTEXT",baselineEligible:false};

  const channels=[];
  if(receipt.issuerEvent===true) channels.push("ISSUER_EVENT");
  if(receipt.macroEvent===true) channels.push("MACRO_EVENT");
  if(receipt.globalMarketMove===true) channels.push("GLOBAL_MARKET_MOVE");
  if(receipt.sectorMove===true) channels.push("SECTOR_MOVE");
  if(receipt.nightFuturesMove===true) channels.push("NIGHT_FUTURES_MOVE");
  if(receipt.fxRatesCommodityMove===true) channels.push("FX_RATES_COMMODITY_MOVE");

  return {
    state:channels.length?"CERTIFIED_OVERNIGHT_CONTEXT":"NO_CERTIFIED_OVERNIGHT_EVENT",
    channels,
    baselineEligible:true
  };
}

export function classifyOpeningGapTopology({
  priorPrice,
  openingPrice,
  zone,
  corporateActionResolved
}={}){
  if(corporateActionResolved!==true)
    return {state:"CORPORATE_ACTION_BLOCKED",tradableZoneCrossObserved:false};

  const p=side(priorPrice,zone);
  const o=side(openingPrice,zone);
  if(!p||!o)
    return {state:"GAP_PATH_UNKNOWN",tradableZoneCrossObserved:false};

  if(o==="INSIDE")
    return {state:"GAP_INTO_ZONE",priorSide:p,openingSide:o,tradableZoneCrossObserved:false};

  if(p==="BELOW"&&o==="ABOVE")
    return {state:"GAP_FROM_BELOW_TO_ABOVE_ZONE",priorSide:p,openingSide:o,zoneSkippedCompletely:true,tradableZoneCrossObserved:false};

  if(p==="ABOVE"&&o==="BELOW")
    return {state:"GAP_FROM_ABOVE_TO_BELOW_ZONE",priorSide:p,openingSide:o,zoneSkippedCompletely:true,tradableZoneCrossObserved:false};

  if(p===o)
    return {state:"GAP_AWAY_FROM_ZONE_SAME_SIDE",priorSide:p,openingSide:o,zoneSkippedCompletely:false,tradableZoneCrossObserved:false};

  return {state:"OPEN_FROM_ZONE_TO_SIDE",priorSide:p,openingSide:o,tradableZoneCrossObserved:false};
}

export function classifyFirstContinuousOpportunity({
  gapTopology,
  firstContinuousObservation,
  zone,
  constrained
}={}){
  if(constrained===true)
    return {state:"LIMIT_OR_AUCTION_CONSTRAINED",intradayRetest:false};

  if(!gapTopology||gapTopology.state==="GAP_PATH_UNKNOWN"||gapTopology.state==="CORPORATE_ACTION_BLOCKED")
    return {state:"OPPORTUNITY_UNKNOWN",intradayRetest:false};

  if(!firstContinuousObservation)
    return {state:"NO_CONTINUOUS_RETEST",intradayRetest:false};

  const s=side(firstContinuousObservation.price,zone);
  if(!s)
    return {state:"OPPORTUNITY_UNKNOWN",intradayRetest:false};

  if(s==="INSIDE")
    return {
      state:"FIRST_CONTINUOUS_RETEST_AFTER_GAP",
      at:str(firstContinuousObservation.at)||null,
      intradayRetest:true
    };

  if(
    (gapTopology.state==="GAP_FROM_BELOW_TO_ABOVE_ZONE"&&s==="BELOW")||
    (gapTopology.state==="GAP_FROM_ABOVE_TO_BELOW_ZONE"&&s==="ABOVE")
  ){
    return {
      state:"CONTINUOUS_RECLAIM_AFTER_GAP",
      at:str(firstContinuousObservation.at)||null,
      intradayRetest:true
    };
  }

  return {state:"NO_CONTINUOUS_RETEST",intradayRetest:false};
}

export function validateOpeningTrialUsage({
  historical,
  nativeTrialReceipt,
  inferFromOpenPrice,
  trialKnownAt,
  predictorFreezeAt
}={}){
  if(inferFromOpenPrice===true)
    return {status:"PROHIBITED",reason:"OPEN_PRICE_CANNOT_BACKFILL_PREOPEN_TRIAL"};

  if(historical===true&&nativeTrialReceipt!==true)
    return {status:"PREOPEN_TRIAL_UNKNOWN"};

  if(nativeTrialReceipt===true){
    if(!str(trialKnownAt)||!str(predictorFreezeAt))
      return {status:"DATA_BLOCKED",reason:"TRIAL_CLOCK_INCOMPLETE"};
    if(str(trialKnownAt)>str(predictorFreezeAt))
      return {status:"POST_OPPORTUNITY_TRIAL",eligible:false};
    return {status:"VALID_TRIAL_RECEIPT",eligible:true};
  }

  return {status:"PREOPEN_TRIAL_UNKNOWN"};
}

export function buildOvernightOpeningFrame({
  parentDecisionId,
  priorZoneCarry,
  overnightContext,
  gapTopology,
  continuousOpportunity,
  rawRepresentationCount=1
}={}){
  if(!str(parentDecisionId))
    return {status:"UNKNOWN",reason:"PARENT_DECISION_ID_MISSING"};

  return {
    status:"VALID",
    parentDecisionId:str(parentDecisionId),
    priorZoneState:priorZoneCarry?.status??"UNKNOWN",
    overnightState:overnightContext?.state??"UNKNOWN",
    gapState:gapTopology?.state??"UNKNOWN",
    continuousOpportunityState:continuousOpportunity?.state??"UNKNOWN",
    informationRoot:"CROSS_SESSION_PRICE_INFORMATION",
    redundancyGroup:"D01_OVERNIGHT_OPENING_SHARED_PARENT",
    rawRepresentationCount,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    outcomeJoinAllowed:false
  };
}
