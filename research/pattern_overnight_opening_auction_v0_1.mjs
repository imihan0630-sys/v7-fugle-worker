// D01 DL-043 overnight / opening-auction response decomposition v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function str(x){return String(x??"");}

export function validateOpeningReceipt({receipt,predictorFreezeAt}={}){
  const freeze=str(predictorFreezeAt);
  if(!receipt) return {status:"OPENING_DATA_MISSING",reason:"RECEIPT_MISSING"};

  const capturedAt=str(receipt.capturedAt);
  const tradeDate=str(receipt.tradeDate);

  if(!tradeDate||!capturedAt)
    return {status:"OPENING_DATA_MISSING",reason:"RECEIPT_IDENTITY_INCOMPLETE"};

  if(freeze&&capturedAt<=freeze)
    return {status:"POST_HOC_CLOCK_CONFLICT",reason:"FUTURE_SESSION_OPEN_CAPTURED_BEFORE_OR_AT_PREDICTOR"};

  if(receipt.suspensionState==="SUSPENDED_NO_OPEN")
    return {status:"SUSPENDED_NO_OPEN",evaluable:false};

  if(receipt.priceLimitState==="PRICE_LIMIT_CONSTRAINED")
    return {status:"PRICE_LIMIT_CONSTRAINED",evaluable:true};

  if(!finite(receipt.openPrice))
    return {status:"OPENING_DATA_MISSING",reason:"OPEN_PRICE_MISSING",evaluable:false};

  if(!str(receipt.openTime))
    return {status:"AUCTION_STATE_UNKNOWN",reason:"OPEN_TIME_MISSING",evaluable:false};

  return {
    status:"NORMAL_OPEN",
    evaluable:true,
    previousClose:finite(receipt.previousClose)?receipt.previousClose:null,
    referencePrice:finite(receipt.referencePrice)?receipt.referencePrice:null,
    openPrice:receipt.openPrice,
    openTime:receipt.openTime,
    openingAuctionState:str(receipt.openingAuctionState)||"UNKNOWN"
  };
}

export function classifyCorporateActionGap({
  continuityState,
  previousClose,
  referencePrice,
  openPrice
}={}){
  if(!finite(openPrice))
    return {status:"OPENING_DATA_MISSING"};

  if(continuityState==="CORPORATE_ACTION_OR_REFERENCE_RESET"){
    if(!finite(referencePrice)||referencePrice<=0)
      return {status:"CORPORATE_ACTION_GAP_DATA_BLOCKED",rawGapAllowed:false};

    return {
      status:"CORPORATE_ACTION_CONTEXT_KNOWN",
      rawGapAllowed:false,
      referenceGap:openPrice/referencePrice-1,
      rawOvernightGap:finite(previousClose)&&previousClose>0?openPrice/previousClose-1:null
    };
  }

  if(continuityState!=="CONTINUITY_VERIFIED")
    return {status:"CORPORATE_ACTION_GAP_DATA_BLOCKED",rawGapAllowed:false};

  if(!finite(previousClose)||previousClose<=0)
    return {status:"CORPORATE_ACTION_GAP_DATA_BLOCKED",reason:"PREVIOUS_CLOSE_INVALID",rawGapAllowed:false};

  return {
    status:"CONTINUITY_VERIFIED",
    rawGapAllowed:true,
    rawOvernightGap:openPrice/previousClose-1,
    referenceGap:finite(referencePrice)&&referencePrice>0?openPrice/referencePrice-1:null
  };
}

export function decomposeSessionPath({
  previousClose,
  openPrice,
  closePrice,
  continuityVerified
}={}){
  if(continuityVerified!==true)
    return {status:"DATA_BLOCKED",reason:"CONTINUITY_NOT_VERIFIED"};

  if(!finite(previousClose)||previousClose<=0||
     !finite(openPrice)||openPrice<=0||
     !finite(closePrice)||closePrice<=0)
    return {status:"DATA_BLOCKED",reason:"PRICE_INPUT_INVALID"};

  const overnightReturn=openPrice/previousClose-1;
  const intradayReturn=closePrice/openPrice-1;
  const closeToCloseReturn=closePrice/previousClose-1;
  const recomposed=(1+overnightReturn)*(1+intradayReturn)-1;

  return {
    status:"VALID",
    overnightReturn,
    intradayReturn,
    closeToCloseReturn,
    recomposedCloseToClose:recomposed,
    identityError:Math.abs(recomposed-closeToCloseReturn),
    totalEqualsIntraday:false,
    outcomeJoinAllowed:false
  };
}

export function classifyPathMechanism({
  overnightComponentKnown,
  intradayComponentKnown,
  earlyContinuousComponentKnown,
  priceLimitConstrained,
  corporateActionContaminated,
  openingAuctionStateKnown
}={}){
  if(corporateActionContaminated===true)
    return {status:"P6_CORPORATE_ACTION_CONTAMINATION"};

  if(priceLimitConstrained===true)
    return {status:"P5_LIMIT_OR_AUCTION_CONSTRAINT_EXPLANATION"};

  if(overnightComponentKnown!==true||intradayComponentKnown!==true)
    return {status:"P8_NOT_EVALUABLE"};

  if(openingAuctionStateKnown!==true)
    return {status:"PATH_COMPONENTS_READY_AUCTION_STATE_UNKNOWN"};

  if(earlyContinuousComponentKnown!==true)
    return {status:"PATH_COMPONENTS_READY_EARLY_CONTINUOUS_UNKNOWN"};

  return {status:"PATH_COMPONENTS_READY_FOR_D16"};
}

export function classifyPathCoverage({
  expectedOpenCapture,
  observedOpenCapture,
  referencePriceKnown,
  openTimeKnown,
  suspensionStateKnown,
  corporateActionStateKnown
}={}){
  const checks={
    expectedOpenCapture,
    observedOpenCapture,
    referencePriceKnown,
    openTimeKnown,
    suspensionStateKnown,
    corporateActionStateKnown
  };

  if(expectedOpenCapture!==true)
    return {status:"UNKNOWN",reason:"OPEN_CAPTURE_EXPECTATION_UNKNOWN",checks};

  if(observedOpenCapture!==true)
    return {status:"OPENING_DATA_MISSING",checks};

  if(referencePriceKnown!==true||
     openTimeKnown!==true||
     suspensionStateKnown!==true||
     corporateActionStateKnown!==true)
    return {status:"DATA_QUALITY_BLOCKED_PARTIAL",checks};

  return {status:"OPENING_PATH_RECEIPT_READY",checks};
}

export function futurePathLeakageGuard({
  predictorFreezeAt,
  openKnownAt,
  closeKnownAt,
  earlyPathKnownAt
}={}){
  const freeze=str(predictorFreezeAt);
  if(!freeze) return {status:"UNKNOWN",reason:"PREDICTOR_FREEZE_MISSING"};

  const futureFields=[
    ["OPEN",str(openKnownAt)],
    ["CLOSE",str(closeKnownAt)],
    ["EARLY_PATH",str(earlyPathKnownAt)]
  ];

  const leaked=futureFields.filter(([,at])=>at&&at<=freeze).map(([name])=>name);

  // For an after-market predictor of session t, next-session path must not be known at freeze.
  if(leaked.length)
    return {status:"CLOCK_CONFLICT",fields:leaked};

  return {status:"FUTURE_PATH_NOT_IN_PREDICTOR"};
}
