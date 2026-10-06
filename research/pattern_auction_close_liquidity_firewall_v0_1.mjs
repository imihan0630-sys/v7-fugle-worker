// D01 DL-062 auction / close-liquidity firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function classifySessionPhase({
  localTime,
  isFinalPrint,
  isPostCloseFixedPrice,
  closeDelayed
}={}){
  const t=str(localTime);
  if(!t) return {state:"SESSION_PHASE_UNKNOWN"};

  if(isPostCloseFixedPrice===true)
    return {state:"POST_CLOSE_FIXED_PRICE"};

  if(t>="08:30:00"&&t<"09:00:00")
    return {state:isFinalPrint===true?"OPENING_CALL_FINAL_PRINT":"PREOPEN_INDICATIVE_ONLY"};

  if(t>="09:00:00"&&t<"13:25:00")
    return {state:"CONTINUOUS_TRADING_UNCONSTRAINED"};

  if(t>="13:25:00"&&t<="13:33:00"){
    if(closeDelayed===true)
      return {state:"CLOSING_CALL_DELAYED"};
    return {state:isFinalPrint===true?"CLOSING_CALL_FINAL_PRINT":"CLOSING_CALL_INDICATIVE_ONLY"};
  }

  return {state:"SESSION_PHASE_UNKNOWN"};
}

export function classifyAuctionReceipt({
  receiptType,
  firstObservableAt,
  knownAt,
  predictorFreezeAt,
  replaySafe
}={}){
  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};

  const first=str(firstObservableAt), known=str(knownAt), freeze=str(predictorFreezeAt);
  if(!first||!known||!freeze)
    return {status:"UNKNOWN",reason:"CLOCK_INCOMPLETE"};

  if(first>freeze||known>freeze)
    return {status:"POST_FREEZE_NOT_ELIGIBLE",eligible:false};

  if(receiptType==="INDICATIVE")
    return {status:"INDICATIVE_CONTEXT_ELIGIBLE",eligible:true,executedPrice:false};

  if(receiptType==="FINAL_PRINT")
    return {status:"FINAL_PRINT_ELIGIBLE",eligible:true,executedPrice:true};

  return {status:"UNKNOWN",reason:"RECEIPT_TYPE_UNKNOWN"};
}

export function classifyMixedBar({
  barStartLocalTime,
  barEndLocalTime,
  phaseSeparated
}={}){
  const s=str(barStartLocalTime), e=str(barEndLocalTime);
  if(!s||!e) return {status:"UNKNOWN"};

  const spansCloseCall=s<"13:25:00"&&e>="13:30:00";
  const spansOpen=s<"09:00:00"&&e>"09:00:00";

  if((spansCloseCall||spansOpen)&&phaseSeparated!==true)
    return {status:"AUCTION_MIXED_BAR",pureContinuous:false};

  return {status:"PHASE_SEPARATED_OR_SINGLE_PHASE",pureContinuous:true};
}

export function classifyStructuralInteraction({
  priorClose,
  finalPrice,
  boundary,
  sessionPhase,
  continuousTradeThroughZone,
  auctionDelayed
}={}){
  if(!finite(boundary?.lower)||!finite(boundary?.upper)||boundary.upper<boundary.lower)
    return {status:"UNKNOWN",reason:"BOUNDARY_INVALID"};

  if(auctionDelayed===true)
    return {status:"CLOSING_AUCTION_DELAYED"};

  if(sessionPhase==="OPENING_CALL_FINAL_PRINT"){
    const fromBelow=finite(priorClose)&&priorClose<boundary.lower&&finalPrice>boundary.upper;
    const fromAbove=finite(priorClose)&&priorClose>boundary.upper&&finalPrice<boundary.lower;
    if((fromBelow||fromAbove)&&continuousTradeThroughZone!==true)
      return {status:"OPENING_GAP_CROSSING",continuousCrossing:false};
  }

  const inside=finite(finalPrice)&&finalPrice>=boundary.lower&&finalPrice<=boundary.upper;
  const crossesAbove=finite(finalPrice)&&finalPrice>boundary.upper;
  const crossesBelow=finite(finalPrice)&&finalPrice<boundary.lower;

  if(sessionPhase==="CLOSING_CALL_FINAL_PRINT"&&continuousTradeThroughZone!==true&&(inside||crossesAbove||crossesBelow))
    return {status:"CLOSING_AUCTION_ONLY_INTERACTION",continuousInteraction:false};

  return {status:"STANDARD_OR_CONTINUOUS_INTERACTION",continuousInteraction:continuousTradeThroughZone===true};
}

export function classifyMechanicalContext({
  monthEnd,
  quarterEnd,
  rebalanceEventVerified,
  passiveFlowVerified,
  etfReceiptVerified,
  derivativeExpiryVerified,
  closeLiquidityReceiptVerified
}={}){
  const active=[];
  if(monthEnd===true) active.push("MONTH_END");
  if(quarterEnd===true) active.push("QUARTER_END");
  if(rebalanceEventVerified===true) active.push("INDEX_REBALANCE");
  if(passiveFlowVerified===true) active.push("PASSIVE_FLOW");
  if(etfReceiptVerified===true) active.push("ETF_CONTEXT");
  if(derivativeExpiryVerified===true) active.push("DERIVATIVE_EXPIRY");
  if(closeLiquidityReceiptVerified===true) active.push("CLOSE_LIQUIDITY_CONCENTRATION");

  return {
    status:active.length?"MECHANICAL_CONTEXT_PRESENT":"NO_VERIFIED_MECHANICAL_CONTEXT",
    active,
    passiveFlowInferredFromVolumeOnly:false,
    independentEvidenceCount:1
  };
}

export function classifyAuctionComparator({atZone,mechanicalContextVerified,opening}={}){
  if(mechanicalContextVerified!==true)
    return {status:"UNKNOWN",reason:"MECHANICAL_CONTEXT_UNVERIFIED"};

  if(opening===true)
    return {status:atZone===true?"O1_OPENING_CALL_EVENT_AT_ZONE":"O0_OPENING_CALL_EVENT_AWAY_FROM_ZONE"};

  return {status:atZone===true?"G1_AUCTION_OR_CLOSE_MECHANICAL_EVENT_AT_ZONE":"G0_AUCTION_OR_CLOSE_MECHANICAL_EVENT_AWAY_FROM_ZONE"};
}

export function validateEndpointClock({
  receiptKnownAt,
  predictorFreezeAt,
  endpointWindowStart
}={}){
  const r=str(receiptKnownAt), p=str(predictorFreezeAt), e=str(endpointWindowStart);
  if(!r||!p||!e) return {status:"UNKNOWN",reason:"CLOCK_INCOMPLETE"};
  if(r>p) return {status:"POST_FREEZE_NOT_ELIGIBLE"};
  if(!(p<e)) return {status:"OUTCOME_WINDOW_CLOCK_INVALID"};
  return {status:"VALID"};
}
