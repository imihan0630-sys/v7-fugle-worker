// D01 DL-061 index-weight/passive-flow/constituent-arbitrage firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function classifyBenchmarkControl({
  targetIncluded,
  targetWeightAsOf,
  weightKnownAt,
  predictorFreezeAt,
  methodologyVerified,
  selfExcludedReceipt
}={}){
  const freeze=str(predictorFreezeAt);

  if(methodologyVerified!==true)
    return {state:"INDEX_METHODOLOGY_OR_VINTAGE_UNKNOWN",eligible:false};

  if(targetIncluded!==true)
    return {state:"TARGET_NOT_IN_BENCHMARK",eligible:true,selfExcludedRequired:false};

  if(!finite(targetWeightAsOf)||targetWeightAsOf<0)
    return {state:"TARGET_INCLUDED_WEIGHT_UNKNOWN",eligible:false,selfExcludedRequired:true};

  if(!str(weightKnownAt)||!freeze||str(weightKnownAt)>freeze)
    return {state:"TARGET_INCLUDED_WEIGHT_UNKNOWN",eligible:false,selfExcludedRequired:true};

  if(selfExcludedReceipt?.verified===true &&
     str(selfExcludedReceipt.knownAt) &&
     str(selfExcludedReceipt.knownAt)<=freeze){
    return {
      state:"SELF_EXCLUDED_BENCHMARK_VERIFIED",
      eligible:true,
      selfExcludedRequired:true,
      targetWeightAsOf
    };
  }

  return {
    state:"SELF_INCLUDED_BENCHMARK_ONLY",
    eligible:false,
    selfExcludedRequired:true,
    targetWeightAsOf
  };
}

export function classifyPassiveEvent({
  receipt,
  predictorFreezeAt
}={}){
  const freeze=str(predictorFreezeAt);
  if(!receipt)
    return {state:"NO_KNOWN_PASSIVE_EVENT",baselineEligible:true};

  if(receipt.dataBlocked===true)
    return {state:"PASSIVE_EVENT_DATA_BLOCKED",baselineEligible:false};

  const knownAt=str(receipt.knownAt);
  if(!knownAt||!freeze)
    return {state:"PASSIVE_EVENT_DATA_BLOCKED",baselineEligible:false};

  if(knownAt>freeze)
    return {state:"POST_OPPORTUNITY_MECHANICAL_CONTEXT",baselineEligible:false};

  if(receipt.actualExecutionVerified===true)
    return {state:"ACTUAL_PASSIVE_EXECUTION_VERIFIED",baselineEligible:true};

  if(receipt.modeledFlow===true)
    return {state:"PASSIVE_FLOW_MODELED_ONLY",baselineEligible:true};

  if(receipt.weightChangeKnown===true)
    return {state:"TARGET_WEIGHT_CHANGE_KNOWN",baselineEligible:true};

  if(receipt.addDeleteTransferKnown===true)
    return {state:"TARGET_ADD_DELETE_TRANSFER_KNOWN",baselineEligible:true};

  if(receipt.effectiveSessionKnown===true)
    return {state:"INDEX_EFFECTIVE_SESSION_KNOWN",baselineEligible:true};

  if(receipt.announcementKnown===true)
    return {state:"INDEX_ANNOUNCEMENT_KNOWN",baselineEligible:true};

  return {state:"ACTUAL_PASSIVE_EXECUTION_UNKNOWN",baselineEligible:true};
}

export function classifyEtfArbitrageContext({
  receipt,
  predictorFreezeAt
}={}){
  const freeze=str(predictorFreezeAt);
  if(!receipt)
    return {state:"NO_CERTIFIED_ARBITRAGE_CONTEXT",baselineEligible:true};

  if(receipt.dataBlocked===true)
    return {state:"ARBITRAGE_DATA_BLOCKED",baselineEligible:false};

  const knownAt=str(receipt.knownAt);
  if(!knownAt||!freeze)
    return {state:"ARBITRAGE_DATA_BLOCKED",baselineEligible:false};

  if(knownAt>freeze)
    return {state:"POST_OPPORTUNITY_MECHANICAL_CONTEXT",baselineEligible:false};

  const channels=[];
  if(receipt.etfPriorMove===true) channels.push("ETF_PRICE_DISCOVERY_PRIOR_MOVE");
  if(receipt.futuresPriorMove===true) channels.push("FUTURES_PRICE_DISCOVERY_PRIOR_MOVE");
  if(receipt.navOrBasisDislocation===true) channels.push("ETF_NAV_OR_BASIS_DISLOCATION_PRESENT");
  if(receipt.modeledBasketExposure===true) channels.push("MODELED_BASKET_ARBITRAGE_CONTEXT");
  if(receipt.actualConstituentExecutionVerified===true) channels.push("VERIFIED_CONSTITUENT_ARBITRAGE_EXECUTION");

  if(receipt.directionKnown===false && channels.length)
    return {
      state:"ARBITRAGE_DIRECTION_UNKNOWN",
      channels,
      baselineEligible:true,
      actualExecutionVerified:receipt.actualConstituentExecutionVerified===true
    };

  if(channels.length>1)
    return {
      state:"MULTIPLE_ARBITRAGE_CHANNELS",
      channels,
      baselineEligible:true,
      actualExecutionVerified:receipt.actualConstituentExecutionVerified===true
    };

  if(channels.length===1)
    return {
      state:channels[0],
      channels,
      baselineEligible:true,
      actualExecutionVerified:receipt.actualConstituentExecutionVerified===true
    };

  return {state:"NO_CERTIFIED_ARBITRAGE_CONTEXT",baselineEligible:true};
}

export function validateModeledVsActualExecution({
  modeledBasketExposure,
  actualExecutionVerified,
  claim
}={}){
  if(claim==="ACTUAL_EXECUTION" && actualExecutionVerified!==true)
    return {status:"PROHIBITED",reason:"MODELED_OR_UNVERIFIED_EXECUTION_CANNOT_BE_ACTUAL"};

  if(modeledBasketExposure===true && actualExecutionVerified!==true)
    return {status:"MODELED_PRIMARY_BASKET_EXPOSURE_ONLY",actualExecutionKnown:false};

  if(actualExecutionVerified===true)
    return {status:"ACTUAL_EXECUTION_VERIFIED",actualExecutionKnown:true};

  return {status:"EXECUTION_UNKNOWN",actualExecutionKnown:false};
}

export function buildMechanicalAttributionFrame({
  parentDecisionId,
  benchmarkControl,
  passiveEvent,
  arbitrageContext,
  targetIndexWeight,
  selfIncludedIndexUsed,
  representationCount=1
}={}){
  if(!str(parentDecisionId))
    return {status:"UNKNOWN",reason:"PARENT_DECISION_ID_MISSING"};

  const circularity =
    selfIncludedIndexUsed===true &&
    benchmarkControl?.state!=="SELF_EXCLUDED_BENCHMARK_VERIFIED";

  return {
    status:"VALID",
    parentDecisionId:str(parentDecisionId),
    benchmarkState:benchmarkControl?.state??"UNKNOWN",
    passiveState:passiveEvent?.state??"UNKNOWN",
    arbitrageState:arbitrageContext?.state??"UNKNOWN",
    targetIndexWeight:finite(targetIndexWeight)?targetIndexWeight:null,
    selfInclusionCircularity:circularity,
    rawRepresentationCount:representationCount,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    outcomeJoinAllowed:false
  };
}
