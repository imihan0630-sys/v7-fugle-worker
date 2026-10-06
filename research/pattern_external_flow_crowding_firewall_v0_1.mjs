// D01 DL-059 external order-flow / crowding firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}

export function classifyExternalFlowReceipt({
  ownerState,
  dataBlocked,
  replaySafe,
  flowType
}={}){
  if(dataBlocked===true)
    return {state:"FLOW_DATA_BLOCKED",eligible:false};

  if(replaySafe!==true)
    return {state:"FLOW_DATA_BLOCKED",eligible:false,reason:"REPLAY_UNSAFE"};

  const s=str(ownerState);
  const allowed=new Set([
    "SAME_SYMBOL_DIRECTIONAL_FLOW_PRESENT",
    "SAME_SYMBOL_OPPOSING_FLOW_PRESENT",
    "MULTI_PARTICIPANT_CROWDING_PRESENT",
    "PASSIVE_BASKET_FLOW_PRESENT",
    "MECHANICAL_HEDGE_FLOW_PRESENT",
    "LEVERAGE_CROWDING_PRESENT",
    "COMMON_FACTOR_FLOW_PRESENT",
    "CROSS_ASSET_COIMPACT_CONTEXT_PRESENT",
    "MIXED_OR_CONFLICTING_FLOW"
  ]);

  if(allowed.has(s))
    return {state:s,eligible:true,flowType:str(flowType)||null};

  return {state:"EXTERNAL_FLOW_UNKNOWN",eligible:true};
}

export function validateExternalFlowTiming({
  firstObservableAt,
  knownAt,
  predictorFreezeAt,
  flowWindowEnd,
  replaySafe
}={}){
  const first=str(firstObservableAt);
  const known=str(knownAt);
  const freeze=str(predictorFreezeAt);
  const end=str(flowWindowEnd);

  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};

  if(!first||!known||!freeze)
    return {status:"UNKNOWN",reason:"FLOW_CLOCK_INCOMPLETE"};

  if(first>freeze||known>freeze)
    return {status:"POST_HOC_EXTERNAL_FLOW_NOT_BASELINE_ELIGIBLE"};

  if(end&&end>freeze)
    return {status:"BASELINE_WINDOW_PARTIAL",baselineEligiblePartOnly:true};

  return {status:"PRE_FREEZE_FLOW_ELIGIBLE",baselineEligiblePartOnly:false};
}

export function classifyFlowAlignment({
  structuralExpectedDirection,
  externalFlowDirection
}={}){
  const s=str(structuralExpectedDirection).toUpperCase();
  const f=str(externalFlowDirection).toUpperCase();

  if(!["UP","DOWN"].includes(s)||!["UP","DOWN","MIXED"].includes(f))
    return {state:"UNKNOWN"};

  if(f==="MIXED") return {state:"MIXED"};
  return {state:s===f?"ALIGNED":"OPPOSED"};
}

export function classifyCrowdingEvidence({
  highVolume,
  participantConcentrationVerified,
  correlatedSameDirectionVerified,
  ownerCrowdingState
}={}){
  if(ownerCrowdingState==="MULTI_PARTICIPANT_CROWDING_PRESENT")
    return {state:"CROWDING_OWNER_VERIFIED",crowdingVerified:true};

  if(participantConcentrationVerified===true&&correlatedSameDirectionVerified===true)
    return {state:"CROWDING_RECEIPT_CANDIDATE",crowdingVerified:false,ownerValidationRequired:true};

  if(highVolume===true)
    return {state:"HIGH_VOLUME_ONLY_NOT_CROWDING",crowdingVerified:false};

  return {state:"CROWDING_UNKNOWN",crowdingVerified:false};
}

export function classifyInformationIndependence({
  externalInformationRoot,
  structuralInformationRoot="PRICE_OHLC",
  residualIncrementalityValidated
}={}){
  const e=str(externalInformationRoot)||"UNKNOWN";
  const s=str(structuralInformationRoot)||"PRICE_OHLC";

  if(e==="UNKNOWN")
    return {status:"INFORMATION_ROOT_UNKNOWN",independentEvidenceAllowed:false};

  if(e===s)
    return {
      status:"SAME_INFORMATION_ROOT",
      independentEvidenceAllowed:residualIncrementalityValidated===true,
      residualIncrementalityStatus:residualIncrementalityValidated===true?"VALIDATED":"NOT_VALIDATED"
    };

  return {
    status:"DISTINCT_INFORMATION_ROOT_CANDIDATE",
    independentEvidenceAllowed:false,
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}

export function buildExternalFlowDenominator(rows=[]){
  const states=[
    "EXTERNAL_FLOW_UNKNOWN",
    "SAME_SYMBOL_DIRECTIONAL_FLOW_PRESENT",
    "SAME_SYMBOL_OPPOSING_FLOW_PRESENT",
    "MULTI_PARTICIPANT_CROWDING_PRESENT",
    "PASSIVE_BASKET_FLOW_PRESENT",
    "MECHANICAL_HEDGE_FLOW_PRESENT",
    "LEVERAGE_CROWDING_PRESENT",
    "COMMON_FACTOR_FLOW_PRESENT",
    "CROSS_ASSET_COIMPACT_CONTEXT_PRESENT",
    "MIXED_OR_CONFLICTING_FLOW",
    "FLOW_DATA_BLOCKED"
  ];
  const counts=Object.fromEntries(states.map(s=>[s,0]));
  for(const r of rows||[]){
    const s=str(r?.state);
    if(s in counts) counts[s]++;
    else counts.FLOW_DATA_BLOCKED++;
  }
  return {
    counts,
    total:(rows||[]).length,
    winnerOnlyFilteringAllowed:false,
    crowdedOnlyFilteringAllowed:false,
    effectiveIndependentEvidenceCount:1
  };
}
