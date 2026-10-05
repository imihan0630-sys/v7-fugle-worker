// D01 DL-043 overnight-gap / opening-auction / continuous-session firewall v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function positive(x){return finite(x)&&x>0;}
function str(x){return String(x??"");}

export function computeOvernightGap({
  priorClose,
  currentOpen,
  atr,
  continuityVerified,
  corporateActionDiscontinuity
}={}){
  if(continuityVerified!==true)
    return {status:"DATA_BLOCKED",reason:"CONTINUITY_UNVERIFIED"};
  if(corporateActionDiscontinuity===true)
    return {status:"DATA_BLOCKED",reason:"CORPORATE_ACTION_DISCONTINUITY"};
  if(!positive(priorClose)||!positive(currentOpen))
    return {status:"UNKNOWN",reason:"OPEN_OR_PRIOR_CLOSE_INVALID"};

  const gapPrice=currentOpen-priorClose;
  return {
    status:"VALID",
    overnightGapPrice:gapPrice,
    overnightGapPct:gapPrice/priorClose,
    overnightGapAtr:positive(atr)?gapPrice/atr:null,
    pathContinuityImplied:false
  };
}

export function classifyBoundaryCrossing({
  priorClose,
  currentOpen,
  boundary,
  openingSessionState,
  constrained,
  continuousCrossObserved,
  continuityVerified
}={}){
  const lower=boundary?.lower, upper=boundary?.upper;
  if(continuityVerified!==true||
     !positive(priorClose)||
     !positive(currentOpen)||
     !finite(lower)||
     !finite(upper)||
     upper<lower){
    return {state:"CROSSING_UNKNOWN"};
  }

  if(continuousCrossObserved===true)
    return {state:"CONTINUOUS_CROSS"};

  if(openingSessionState!=="OPEN_CALL_AUCTION")
    return {state:"CROSSING_UNKNOWN"};

  const priorBelow=priorClose<lower;
  const priorAbove=priorClose>upper;
  const openBelow=currentOpen<lower;
  const openAbove=currentOpen>upper;
  const openInside=currentOpen>=lower&&currentOpen<=upper;

  if(openInside)
    return {
      state:constrained===true?"CONSTRAINED_OPENING_CROSS":"AUCTION_AT_BOUNDARY",
      pathContinuityImplied:false
    };

  const crossed=(priorBelow&&openAbove)||(priorAbove&&openBelow);
  if(crossed){
    return {
      state:constrained===true?"CONSTRAINED_OPENING_CROSS":"OPENING_GAP_CROSS",
      pathContinuityImplied:false
    };
  }

  return {state:"NO_BOUNDARY_CROSS"};
}

export function validateSessionSegmentation({
  openingWindowId,
  laterWindowId,
  frozenBeforeOutcome,
  sessionOwnerReceiptVerified
}={}){
  if(sessionOwnerReceiptVerified!==true)
    return {status:"UNKNOWN",reason:"SESSION_OWNER_RECEIPT_UNVERIFIED"};

  if(frozenBeforeOutcome!==true)
    return {status:"PROHIBITED",reason:"SESSION_WINDOWS_NOT_PREREGISTERED"};

  if(!str(openingWindowId)||!str(laterWindowId))
    return {status:"UNKNOWN",reason:"SESSION_WINDOW_ID_MISSING"};

  if(openingWindowId===laterWindowId)
    return {status:"UNKNOWN",reason:"SESSION_WINDOWS_NOT_DISTINCT"};

  return {status:"VALID"};
}

export function classifyPredictorAvailability({
  predictorFreezeAt,
  openKnownAt,
  immediatePostOpenKnownAt,
  laterContinuousKnownAt
}={}){
  const freeze=str(predictorFreezeAt);
  if(!freeze) return {status:"UNKNOWN",reason:"PREDICTOR_FREEZE_MISSING"};

  const availableAtFreeze=(t)=>str(t)&&str(t)<=freeze;

  return {
    status:"VALID",
    openAvailable:availableAtFreeze(openKnownAt),
    immediatePostOpenAvailable:availableAtFreeze(immediatePostOpenKnownAt),
    laterContinuousAvailable:availableAtFreeze(laterContinuousKnownAt),
    laterSessionComponentsMayBackfillPredictor:false
  };
}

export function buildSessionDecomposition({
  parentDecisionId,
  priorClose,
  currentOpen,
  atr,
  continuityVerified,
  corporateActionDiscontinuity,
  sessionStateAtFreeze,
  openingWindow,
  laterWindow,
  boundary,
  constrained,
  continuousCrossObserved,
  predictorFreezeAt,
  openKnownAt,
  immediatePostOpenKnownAt,
  laterContinuousKnownAt
}={}){
  const gap=computeOvernightGap({
    priorClose,currentOpen,atr,continuityVerified,corporateActionDiscontinuity
  });

  const crossing=classifyBoundaryCrossing({
    priorClose,currentOpen,boundary,
    openingSessionState:sessionStateAtFreeze,
    constrained,
    continuousCrossObserved,
    continuityVerified
  });

  const availability=classifyPredictorAvailability({
    predictorFreezeAt,
    openKnownAt,
    immediatePostOpenKnownAt,
    laterContinuousKnownAt
  });

  return {
    status:gap.status==="VALID"&&availability.status==="VALID"?"VALID":"PARTIAL_OR_BLOCKED",
    parentDecisionId:str(parentDecisionId)||null,
    gap,
    crossing,
    availability,
    openingWindow:openingWindow??null,
    laterWindow:laterWindow??null,
    informationRoot:"PRICE_OHLC",
    representationFamily:"D01_PRICE_GEOMETRY",
    effectiveIndependentEvidenceCount:1,
    outcomeJoinAllowed:false
  };
}

export function classifySessionRobustness({
  overnightEvaluable,
  openingEvaluable,
  immediatePostOpenEvaluable,
  laterContinuousEvaluable,
  continuousResidualPresent,
  gapOnlyPresent
}={}){
  if(
    overnightEvaluable!==true||
    openingEvaluable!==true||
    immediatePostOpenEvaluable!==true||
    laterContinuousEvaluable!==true
  ){
    return {state:"M7_NOT_EVALUABLE"};
  }

  if(gapOnlyPresent===true&&continuousResidualPresent!==true)
    return {state:"M0_OVERNIGHT_GAP_EXPLANATION"};

  if(continuousResidualPresent===true&&gapOnlyPresent!==true)
    return {state:"M3_CONTINUOUS_SESSION_RESIDUAL"};

  if(continuousResidualPresent===true&&gapOnlyPresent===true)
    return {state:"M6_SESSION_ROBUST_PATTERN_CANDIDATE"};

  return {state:"M7_NOT_EVALUABLE"};
}
