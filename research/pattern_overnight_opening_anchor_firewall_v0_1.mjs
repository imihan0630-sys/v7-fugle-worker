// D01 DL-063 overnight/opening anchor firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function buildPriorCloseGeometry({priorClose,openingPrice,boundary,atr}={}){
  if(!finite(priorClose)||!finite(openingPrice)||
     !finite(boundary?.lower)||!finite(boundary?.upper)||boundary.upper<boundary.lower)
    return {status:"UNKNOWN",reason:"PRICE_OR_BOUNDARY_INVALID"};

  const center=(boundary.lower+boundary.upper)/2;
  const dist=(p)=>p<boundary.lower?boundary.lower-p:p>boundary.upper?p-boundary.upper:0;
  const gap=openingPrice-priorClose;
  const priorPos=priorClose<boundary.lower?"BELOW":priorClose>boundary.upper?"ABOVE":"INSIDE";
  const openPos=openingPrice<boundary.lower?"BELOW":openingPrice>boundary.upper?"ABOVE":"INSIDE";

  return {
    status:"VALID",
    priorCloseZoneDistance:dist(priorClose),
    openingZoneDistance:dist(openingPrice),
    priorCloseToZoneCenter:Math.abs(priorClose-center),
    openingToZoneCenter:Math.abs(openingPrice-center),
    overnightGapPrice:gap,
    overnightGapAtr:finite(atr)&&atr>0?gap/atr:null,
    priorPosition:priorPos,
    openingPosition:openPos,
    openingGapCrossing:
      (priorPos==="BELOW"&&openPos==="ABOVE")||
      (priorPos==="ABOVE"&&openPos==="BELOW"),
    arbitraryNearThresholdDefined:false
  };
}

export function classifyOvernightReceipt({
  channel,
  firstObservableAt,
  knownAt,
  predictorFreezeAt,
  replaySafe
}={}){
  const first=str(firstObservableAt), known=str(knownAt), freeze=str(predictorFreezeAt);
  if(replaySafe!==true) return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};
  if(!first||!known||!freeze) return {status:"UNKNOWN",reason:"CLOCK_INCOMPLETE"};
  if(first>freeze||known>freeze) return {status:"POST_FREEZE_OVERNIGHT_CONTEXT",eligible:false};

  const allowed=new Set([
    "CORPORATE_OR_FIRM_NEWS",
    "MARKET_OR_SECTOR_OVERNIGHT_MOVE",
    "GLOBAL_MACRO_OR_CROSS_ASSET_MOVE",
    "PREOPEN_INDEX_FUTURES_SIGNAL",
    "PREOPEN_INDEX_OPTIONS_SIGNAL",
    "PREOPEN_SPOT_INDICATIVE_SIGNAL"
  ]);
  if(!allowed.has(channel)) return {status:"UNKNOWN",reason:"CHANNEL_UNKNOWN"};
  return {status:"OVERNIGHT_CONTEXT_ELIGIBLE",channel,eligible:true};
}

export function validateOpeningPredictorClock({
  openingFinalPrintKnownAt,
  predictorFreezeAt,
  endpointWindowStart
}={}){
  const o=str(openingFinalPrintKnownAt), p=str(predictorFreezeAt), e=str(endpointWindowStart);
  if(!o||!p||!e) return {status:"UNKNOWN",reason:"CLOCK_INCOMPLETE"};
  if(o>p) return {status:"OPENING_PRINT_NOT_AVAILABLE_AT_FREEZE"};
  if(!(p<e)) return {status:"OUTCOME_WINDOW_CLOCK_INVALID"};
  return {status:"VALID"};
}

export function classifyOpeningContext({
  verifiedChannels=[],
  previousCloseAnchorReceipt,
  unknownContext
}={}){
  const channels=[...new Set((verifiedChannels||[]).map(String).filter(Boolean))];
  if(previousCloseAnchorReceipt===true) channels.push("PREVIOUS_CLOSE_ANCHOR_NEAR_ZONE");
  const unique=[...new Set(channels)];

  if(unknownContext===true&&unique.length===0)
    return {state:"OVERNIGHT_CONTEXT_UNKNOWN",channels:[]};

  if(unique.length===0)
    return {state:"NO_VERIFIED_OVERNIGHT_RECEIPT",channels:[]};

  if(unique.length===1){
    const map={
      CORPORATE_OR_FIRM_NEWS:"VERIFIED_CORPORATE_OR_FIRM_NEWS",
      MARKET_OR_SECTOR_OVERNIGHT_MOVE:"VERIFIED_MARKET_OR_SECTOR_OVERNIGHT_MOVE",
      GLOBAL_MACRO_OR_CROSS_ASSET_MOVE:"VERIFIED_GLOBAL_MACRO_OR_CROSS_ASSET_MOVE",
      PREOPEN_INDEX_FUTURES_SIGNAL:"PREOPEN_INDEX_FUTURES_SIGNAL",
      PREOPEN_INDEX_OPTIONS_SIGNAL:"PREOPEN_INDEX_OPTIONS_SIGNAL",
      PREOPEN_SPOT_INDICATIVE_SIGNAL:"PREOPEN_SPOT_INDICATIVE_SIGNAL",
      PREVIOUS_CLOSE_ANCHOR_NEAR_ZONE:"PREVIOUS_CLOSE_ANCHOR_NEAR_ZONE"
    };
    return {state:map[unique[0]]||"OVERNIGHT_CONTEXT_UNKNOWN",channels:unique};
  }

  return {state:"MULTIPLE_OVERNIGHT_CHANNELS",channels:unique};
}

export function classifyOvernightComparator({atZone,overnightContextVerified}={}){
  if(overnightContextVerified!==true)
    return {status:"UNKNOWN",reason:"OVERNIGHT_CONTEXT_UNVERIFIED"};
  return {
    status:atZone===true?"G1_OVERNIGHT_SHOCK_AT_ZONE":"G0_OVERNIGHT_SHOCK_AWAY_FROM_ZONE"
  };
}

export function classifyPreviousCloseComparator({nearZone,receiptVerified}={}){
  if(receiptVerified!==true)
    return {status:"UNKNOWN",reason:"PRIOR_CLOSE_GEOMETRY_UNVERIFIED"};
  return {status:nearZone===true?"P1_PRIOR_CLOSE_ANCHOR_NEAR_ZONE":"P0_PRIOR_CLOSE_ANCHOR_AWAY_FROM_ZONE"};
}

export function buildInformationLineage({directPriceRepresentations=0,externalContextChannels=0}={}){
  return {
    informationRoot:"PRICE_OHLC",
    directPriceRepresentations,
    externalContextChannels,
    effectiveIndependentEvidenceCount:1,
    independentConfirmationByDirectionOnly:false
  };
}
