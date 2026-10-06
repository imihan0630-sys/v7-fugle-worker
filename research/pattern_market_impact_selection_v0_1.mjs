// D01 DL-057 market-impact selection firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function classifyImpactMeasurement({
  realOrderSubmitted,
  impactReceipt,
  modelProxy
}={}){
  if(realOrderSubmitted!==true)
    return {state:"NO_REAL_ORDER",verifiedImpact:false};

  if(impactReceipt?.dataBlocked===true)
    return {state:"IMPACT_DATA_BLOCKED",verifiedImpact:false};

  if(impactReceipt?.localVerified===true&&
     finite(impactReceipt?.executedQuantity)&&
     finite(impactReceipt?.marketVolumeInterval)){
    return {state:"LOCAL_IMPACT_RECEIPT_VALID",verifiedImpact:true};
  }

  if(impactReceipt&&(
    finite(impactReceipt.executedQuantity)||
    finite(impactReceipt.marketVolumeInterval)||
    finite(impactReceipt.startPrice)||
    finite(impactReceipt.endPrice)
  )){
    return {state:"IMPACT_MEASUREMENT_PARTIAL",verifiedImpact:false};
  }

  if(modelProxy?.available===true)
    return {state:"IMPACT_MODEL_PROXY_ONLY",verifiedImpact:false};

  return {state:"ORDER_SUBMITTED_IMPACT_UNMEASURED",verifiedImpact:false};
}

export function computeParticipationRate({
  executedQuantity,
  marketVolumeInterval,
  dailyVolumeProxy
}={}){
  if(finite(executedQuantity)&&executedQuantity>=0&&
     finite(marketVolumeInterval)&&marketVolumeInterval>0){
    return {
      status:"VALID_INTERVAL_PARTICIPATION",
      participationRate:executedQuantity/marketVolumeInterval,
      proxyUsed:false
    };
  }

  if(finite(executedQuantity)&&finite(dailyVolumeProxy)&&dailyVolumeProxy>0){
    return {
      status:"PROXY_ONLY",
      participationRateProxy:executedQuantity/dailyVolumeProxy,
      proxyUsed:true,
      promotionGrade:false
    };
  }

  return {status:"PARTICIPATION_RATE_UNKNOWN",proxyUsed:false};
}

export function classifyResponseWindow({
  structuralOpportunityAt,
  predictorFreezeAt,
  executionStartAt,
  executionEndAt,
  responseObservedAt,
  realOrderSubmitted
}={}){
  const opp=str(structuralOpportunityAt);
  const freeze=str(predictorFreezeAt);
  const start=str(executionStartAt);
  const end=str(executionEndAt);
  const obs=str(responseObservedAt);

  if(realOrderSubmitted!==true)
    return {state:"NO_EXECUTION_REFERENCE",baselineContaminated:false};

  if(!opp||!freeze||!start||!obs)
    return {state:"CONTAMINATION_UNKNOWN",baselineContaminated:null};

  if(start<=freeze)
    return {state:"EXECUTION_OVERLAP_RESPONSE",baselineContaminated:true};

  if(obs<start)
    return {state:"PRE_EXECUTION_RESPONSE",baselineContaminated:false};

  if(!end||obs<=end)
    return {state:"EXECUTION_OVERLAP_RESPONSE",baselineContaminated:false};

  return {state:"POST_EXECUTION_DECAY_WINDOW",baselineContaminated:false};
}

export function classifyOwnImpactAlignment({
  side,
  expectedStructuralDirection
}={}){
  const s=str(side).toUpperCase();
  const d=str(expectedStructuralDirection).toUpperCase();

  if(!["BUY","SELL"].includes(s)||
     !["UP","DOWN"].includes(d))
    return {state:"NEUTRAL_OR_UNKNOWN"};

  if((s==="BUY"&&d==="UP")||(s==="SELL"&&d==="DOWN"))
    return {state:"ALIGNED"};

  return {state:"OPPOSED"};
}

export function validateImpactModelReceipt({
  venue,
  instrument,
  calibrationVenue,
  calibrationInstrument,
  calibrationKnownAt,
  predictorFreezeAt,
  outOfSampleStatus
}={}){
  if(str(venue)!==str(calibrationVenue)||
     str(instrument)!==str(calibrationInstrument)){
    return {status:"LOCAL_CALIBRATION_NOT_VALID",reason:"VENUE_OR_INSTRUMENT_MISMATCH"};
  }

  if(!str(calibrationKnownAt)||!str(predictorFreezeAt)||
     str(calibrationKnownAt)>str(predictorFreezeAt)){
    return {status:"LOCAL_CALIBRATION_NOT_VALID",reason:"CALIBRATION_NOT_KNOWN_AT_FREEZE"};
  }

  return {
    status:"LOCAL_CALIBRATION_RECEIPT_VALID",
    outOfSampleStatus:str(outOfSampleStatus)||"UNKNOWN"
  };
}

export function buildImpactOpportunityDenominator(rows=[]){
  const states=[
    "NO_ORDER_SUBMITTED",
    "ORDER_REJECTED",
    "SUBMITTED_PENDING",
    "FILLED",
    "PARTIAL",
    "CANCELLED",
    "UNFILLED_STUDY_END",
    "DATA_BLOCKED"
  ];
  const counts=Object.fromEntries(states.map(s=>[s,0]));
  for(const r of rows||[]){
    const s=str(r?.state);
    if(s in counts) counts[s]++;
    else counts.DATA_BLOCKED++;
  }
  return {
    counts,
    total:(rows||[]).length,
    fillOnlySampleAllowed:false,
    effectiveIndependentEvidenceCount:1
  };
}
