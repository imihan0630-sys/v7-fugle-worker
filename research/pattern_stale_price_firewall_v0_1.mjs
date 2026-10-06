// D01 DL-065 stale/non-synchronous/thin-trading price firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

const TYPES=new Set([
  "TRADE","QUOTE_MID","BEST_BID","BEST_ASK","AUCTION_MATCH",
  "ODD_LOT_TRADE","PSEUDO_BAR","CARRY_FORWARD_PRICE","UNKNOWN"
]);

export function classifyObservation({
  observationType,
  timestamp,
  replaySafe,
  tradeSize,
  sessionPhase
}={}){
  const type=str(observationType)||"UNKNOWN";
  if(!TYPES.has(type))
    return {state:"OBSERVATION_IDENTITY_UNKNOWN",tradeOccurred:false};

  if(replaySafe!==true||!str(timestamp))
    return {state:"OBSERVATION_IDENTITY_UNKNOWN",tradeOccurred:false};

  if(type==="PSEUDO_BAR"||type==="CARRY_FORWARD_PRICE")
    return {state:"NO_TRADE_STALE_OBSERVATION",tradeOccurred:false,structureEventEligible:false};

  if(["QUOTE_MID","BEST_BID","BEST_ASK"].includes(type))
    return {state:"QUOTE_ONLY_OBSERVATION",tradeOccurred:false,structureEventEligible:false};

  if(type==="ODD_LOT_TRADE")
    return {state:"ODD_LOT_TRADE_OBSERVED",tradeOccurred:true,structureEventEligible:false};

  if(type==="AUCTION_MATCH")
    return {state:"AUCTION_TRADE_OBSERVED",tradeOccurred:true,structureEventEligible:true,sessionPhase:str(sessionPhase)||null};

  if(type==="TRADE")
    return {
      state:"BOARD_OR_CANONICAL_TRADE_OBSERVED",
      tradeOccurred:true,
      structureEventEligible:true,
      tradeSize:finite(tradeSize)?tradeSize:null
    };

  return {state:"OBSERVATION_IDENTITY_UNKNOWN",tradeOccurred:false};
}

export function classifyOpenIdentity({
  scheduledOpenAt,
  openingAuctionMatchAt,
  firstTradeAt,
  firstContinuousTradeAt,
  dailyOpenSource
}={}){
  const source=str(dailyOpenSource)||"SOURCE_UNRESOLVED";
  const allowed=new Set([
    "OPENING_AUCTION_MATCH","FIRST_CONTINUOUS_TRADE",
    "ODD_LOT_ONLY","PSEUDO_BAR_OR_CARRY","SOURCE_UNRESOLVED"
  ]);
  if(!allowed.has(source)) return {state:"SOURCE_UNRESOLVED"};

  const scheduled=str(scheduledOpenAt);
  const first=str(firstTradeAt);
  const continuous=str(firstContinuousTradeAt);

  const firstDelay=scheduled&&first?Math.max(0,(Date.parse(first)-Date.parse(scheduled))/1000):null;
  const continuousDelay=scheduled&&continuous?Math.max(0,(Date.parse(continuous)-Date.parse(scheduled))/1000):null;

  return {
    state:source,
    openingAuctionMatchAt:str(openingAuctionMatchAt)||null,
    firstTradeDelaySeconds:Number.isFinite(firstDelay)?firstDelay:null,
    firstContinuousTradeDelaySeconds:Number.isFinite(continuousDelay)?continuousDelay:null,
    staleThresholdDefined:false
  };
}

export function classifyZoneInteraction({
  observationState,
  price,
  zone,
  touchTradeCount,
  boardLotObserved,
  oddLotOnly,
  quoteOnly
}={}){
  if(!finite(price)||!finite(zone?.lower)||!finite(zone?.upper)||zone.upper<zone.lower)
    return {state:"INTERACTION_IDENTITY_UNKNOWN",executedInteraction:false};

  const inZone=price>=zone.lower&&price<=zone.upper;
  if(!inZone) return {state:"NO_ZONE_CONTACT",executedInteraction:false};

  const obs=observationState?.state;

  if(obs==="NO_TRADE_STALE_OBSERVATION")
    return {state:"PSEUDO_OR_STALE_PRICE_OVERLAPS_ZONE",executedInteraction:false};

  if(quoteOnly===true||obs==="QUOTE_ONLY_OBSERVATION")
    return {state:"QUOTE_ONLY_ZONE_CONTACT",executedInteraction:false};

  if(oddLotOnly===true||obs==="ODD_LOT_TRADE_OBSERVED")
    return {state:"ODD_LOT_ONLY_ZONE_INTERACTION",executedInteraction:true,normalBoardLotCandidate:false};

  if(obs==="AUCTION_TRADE_OBSERVED")
    return {state:"AUCTION_ZONE_INTERACTION",executedInteraction:true,normalBoardLotCandidate:false};

  if(obs==="BOARD_OR_CANONICAL_TRADE_OBSERVED"){
    if(finite(touchTradeCount)&&touchTradeCount<=1)
      return {state:"ISOLATED_THIN_TRADE_ZONE_INTERACTION",executedInteraction:true,normalBoardLotCandidate:true};
    return {state:"EXECUTED_CONTEMPORANEOUS_ZONE_INTERACTION",executedInteraction:true,normalBoardLotCandidate:boardLotObserved!==false};
  }

  return {state:"INTERACTION_IDENTITY_UNKNOWN",executedInteraction:false};
}

export function classifyTimestampAlignment({
  targetPriceTimestamp,
  benchmarkPriceTimestamp,
  targetLastTradeAgeSeconds,
  benchmarkLastTradeAgeSeconds,
  ownerSynchronous
}={}){
  const t=str(targetPriceTimestamp),b=str(benchmarkPriceTimestamp);
  if(!t||!b) return {state:"TIMESTAMP_ALIGNMENT_UNKNOWN"};

  const gap=Math.abs((Date.parse(t)-Date.parse(b))/1000);
  if(!Number.isFinite(gap)) return {state:"TIMESTAMP_ALIGNMENT_UNKNOWN"};

  if(ownerSynchronous===true)
    return {state:"SYNCHRONOUS_ENOUGH_BY_OWNER_CONTRACT",timestampGapSeconds:gap};

  const targetStale=finite(targetLastTradeAgeSeconds)&&targetLastTradeAgeSeconds>0;
  const benchStale=finite(benchmarkLastTradeAgeSeconds)&&benchmarkLastTradeAgeSeconds>0;

  if(targetStale&&!benchStale)
    return {state:"TARGET_PRICE_STALE_BENCHMARK_FRESH",timestampGapSeconds:gap};
  if(!targetStale&&benchStale)
    return {state:"TARGET_FRESH_BENCHMARK_STALE",timestampGapSeconds:gap};
  if(targetStale&&benchStale)
    return {state:"BOTH_STALE",timestampGapSeconds:gap};

  return {state:"TIMESTAMP_ALIGNMENT_UNKNOWN",timestampGapSeconds:gap};
}

export function validateDailyBarPath({
  barProvenanceVerified,
  noTradeOrPseudoPossible,
  intradayTimestampsAvailable,
  claimExactIntradayPath
}={}){
  if(barProvenanceVerified!==true)
    return {status:"DATA_BLOCKED",reason:"BAR_PROVENANCE_UNVERIFIED"};

  if(noTradeOrPseudoPossible===true)
    return {status:"DATA_BLOCKED",reason:"NO_TRADE_OR_PSEUDO_BAR_POSSIBLE"};

  if(claimExactIntradayPath===true&&intradayTimestampsAvailable!==true)
    return {status:"PROHIBITED",reason:"DAILY_OHLC_CANNOT_PROVE_EXACT_INTRADAY_PATH"};

  return {status:"VALID_FOR_BROAD_GEOMETRY"};
}

export function buildStalePriceFrame({
  parentDecisionId,
  observation,
  interaction,
  alignment,
  rawRepresentationCount=1
}={}){
  if(!str(parentDecisionId))
    return {status:"UNKNOWN",reason:"PARENT_ID_MISSING"};

  return {
    status:"VALID",
    parentDecisionId:str(parentDecisionId),
    observationState:observation?.state??"UNKNOWN",
    interactionState:interaction?.state??"UNKNOWN",
    alignmentState:alignment?.state??"UNKNOWN",
    informationRoot:"PRICE_LIQUIDITY_TIMESTAMP",
    rawRepresentationCount,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    outcomeJoinAllowed:false
  };
}
