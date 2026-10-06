// D01 DL-058 information-content firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}

export function classifyInformationReceipt({
  exAnteSignalReceipt,
  externalInformationReceipt,
  adverseSelectionProxy,
  informationProxy,
  dataBlocked
}={}){
  if(dataBlocked===true)
    return {state:"INFORMATION_RECEIPT_DATA_BLOCKED",baselineEligible:false};

  if(externalInformationReceipt?.verified===true)
    return {state:"EXTERNAL_INFORMATION_RECEIPT_PRESENT",baselineEligible:true};

  if(exAnteSignalReceipt?.verified===true)
    return {state:"EX_ANTE_SIGNAL_RECEIPT_PRESENT",baselineEligible:true};

  if(adverseSelectionProxy?.available===true)
    return {state:"MICROSTRUCTURE_ADVERSE_SELECTION_PROXY_PRESENT",baselineEligible:false,postTreatmentLikely:true};

  if(informationProxy?.available===true)
    return {state:"INFORMATION_PROXY_ONLY",baselineEligible:false};

  return {state:"INFORMATION_CONTENT_UNKNOWN",baselineEligible:false};
}

export function validateInformationTiming({
  informationKnownAt,
  predictorFreezeAt,
  replaySafe
}={}){
  const known=str(informationKnownAt);
  const freeze=str(predictorFreezeAt);

  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};

  if(!known||!freeze)
    return {status:"UNKNOWN",reason:"INFORMATION_CLOCK_INCOMPLETE"};

  if(known>freeze)
    return {status:"POST_HOC_INFORMATION_NOT_ELIGIBLE"};

  return {status:"PRE_FREEZE_INFORMATION_ELIGIBLE"};
}

export function classifySignalLineage({
  signalInformationRoot,
  structuralInformationRoot="PRICE_OHLC",
  residualIncrementalityValidated
}={}){
  const s=str(signalInformationRoot)||"UNKNOWN";
  const p=str(structuralInformationRoot)||"PRICE_OHLC";

  if(s==="UNKNOWN")
    return {status:"INFORMATION_ROOT_UNKNOWN",independentEvidenceAllowed:false};

  if(s===p){
    return {
      status:"SAME_INFORMATION_ROOT",
      independentEvidenceAllowed:residualIncrementalityValidated===true,
      residualIncrementalityStatus:residualIncrementalityValidated===true?"VALIDATED":"NOT_VALIDATED"
    };
  }

  return {
    status:"DISTINCT_INFORMATION_ROOT_CANDIDATE",
    independentEvidenceAllowed:false,
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}

export function classifyMarkoutUsage({
  markoutKnownAt,
  predictorFreezeAt
}={}){
  const mark=str(markoutKnownAt);
  const freeze=str(predictorFreezeAt);

  if(!mark)
    return {state:"MARKOUT_UNKNOWN",baselineAllowed:false};

  if(!freeze||mark>freeze)
    return {state:"POST_TRADE_MARKOUT",baselineAllowed:false};

  return {state:"MARKOUT_PREEXISTING_RECEIPT",baselineAllowed:true};
}

export function classifyMechanismCell({
  informationState,
  ownImpactHigh
}={}){
  const highInfo=[
    "EX_ANTE_SIGNAL_RECEIPT_PRESENT",
    "EXTERNAL_INFORMATION_RECEIPT_PRESENT"
  ].includes(str(informationState));

  if(highInfo&&ownImpactHigh===true) return {state:"M3_INFORMATION_PROXY_PLUS_HIGH_OWN_IMPACT"};
  if(highInfo) return {state:"M1_INFORMATION_PROXY_PLUS_LOW_OR_UNKNOWN_OWN_IMPACT"};
  if(ownImpactHigh===true) return {state:"M2_LOW_OR_UNKNOWN_INFORMATION_PLUS_HIGH_OWN_IMPACT"};
  return {state:"M0_LOW_OR_UNKNOWN_INFORMATION_PLUS_LOW_OR_UNKNOWN_OWN_IMPACT"};
}

export function buildInformationOpportunityDenominator(rows=[]){
  const counts={
    NO_ORDER:0,
    INFORMATION_UNKNOWN:0,
    EX_ANTE_SIGNAL:0,
    EXTERNAL_INFORMATION:0,
    PROXY_ONLY:0,
    DATA_BLOCKED:0
  };

  for(const r of rows||[]){
    const s=str(r?.state);
    if(s in counts) counts[s]++;
    else counts.DATA_BLOCKED++;
  }

  return {
    counts,
    total:(rows||[]).length,
    profitableCaseFilteringAllowed:false,
    persistentMoveFilteringAllowed:false,
    effectiveIndependentEvidenceCount:1
  };
}
