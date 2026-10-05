// D01 DL-046 volume-at-price / historical traded-volume concentration v0.1
// Research-only / outcome-blind / prospective profile only.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function positive(x){return finite(x)&&x>0;}
function str(x){return String(x??"");}
function ts(x){
  const v=Date.parse(str(x));
  return Number.isFinite(v)?v:null;
}

export function validateProspectiveProfileReceipt({
  sourceFetchedAt,
  profileAsOf,
  predictorFreezeAt,
  profileWindowStart,
  profileWindowEnd,
  sourceId,
  sourceVersion,
  owner,
  sessionPhase,
  marketType,
  priceBins,
  binConstructionRuleId,
  tickReceipt,
  profileCoverageState,
  replaySafe,
  syntheticFromOHLCV,
  includesTradesAfterFreeze
}={}){
  if(syntheticFromOHLCV===true)
    return {status:"PROHIBITED",reason:"HISTORICAL_PROFILE_FROM_OHLCV_PROHIBITED",eligible:false};

  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"PROFILE_REPLAY_UNSAFE",eligible:false};

  if(str(owner)!=="D02-12_PRICE_BY_VOLUME_PROFILE")
    return {status:"UNKNOWN",reason:"OWNER_RECEIPT_INVALID",eligible:false};

  if(!str(sourceId)||!str(sourceVersion)||!str(sessionPhase)||!str(marketType))
    return {status:"UNKNOWN",reason:"SOURCE_OR_SESSION_RECEIPT_INCOMPLETE",eligible:false};

  if(!str(binConstructionRuleId))
    return {status:"UNKNOWN",reason:"BIN_RULE_MISSING",eligible:false};

  if(tickReceipt?.verified!==true)
    return {status:"UNKNOWN",reason:"PROFILE_TICK_CONTEXT_UNKNOWN",eligible:false};

  if(!Array.isArray(priceBins)||priceBins.length===0)
    return {status:"UNKNOWN",reason:"PRICE_BINS_EMPTY",eligible:false};

  const fetchTs=ts(sourceFetchedAt);
  const asOfTs=ts(profileAsOf);
  const freezeTs=ts(predictorFreezeAt);
  const startTs=ts(profileWindowStart);
  const endTs=ts(profileWindowEnd);

  if([fetchTs,asOfTs,freezeTs,startTs,endTs].some(x=>x===null))
    return {status:"UNKNOWN",reason:"PROFILE_CLOCK_INCOMPLETE",eligible:false};

  if(startTs>endTs)
    return {status:"UNKNOWN",reason:"PROFILE_WINDOW_INVALID",eligible:false};

  if(includesTradesAfterFreeze===true||asOfTs>freezeTs||endTs>freezeTs||fetchTs>freezeTs)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"PROFILE_NOT_AVAILABLE_AT_FREEZE",eligible:false};

  for(const b of priceBins){
    if(!finite(b?.price)||!finite(b?.volume)||b.volume<0)
      return {status:"DATA_BLOCKED",reason:"PRICE_BIN_INVALID",eligible:false};
  }

  if(!["COMPLETE_TO_ASOF","PARTIAL_KNOWN"].includes(str(profileCoverageState)))
    return {status:"UNKNOWN",reason:"PROFILE_COVERAGE_UNKNOWN",eligible:false};

  return {
    status:"VALID",
    eligible:true,
    sourceFetchedAt:str(sourceFetchedAt),
    profileAsOf:str(profileAsOf),
    predictorFreezeAt:str(predictorFreezeAt),
    profileCoverageState:str(profileCoverageState),
    binConstructionRuleId:str(binConstructionRuleId),
    tickRuleVersion:str(tickReceipt?.version)||null,
    historicalReplayCertified:false,
    prospectiveOnly:true
  };
}

export function computeZoneVolumeDescriptors({
  boundary,
  priceBins=[],
  tickSize,
  atr,
  profileCoveredVolumeShare=null
}={}){
  const lower=boundary?.lower;
  const upper=boundary?.upper;
  if(!finite(lower)||!finite(upper)||upper<lower)
    return {status:"UNKNOWN",reason:"BOUNDARY_INVALID"};

  if(!Array.isArray(priceBins)||priceBins.length===0)
    return {status:"UNKNOWN",reason:"PRICE_BINS_EMPTY"};

  const bins=[];
  for(const b of priceBins){
    if(!finite(b?.price)||!finite(b?.volume)||b.volume<0)
      return {status:"DATA_BLOCKED",reason:"PRICE_BIN_INVALID"};
    bins.push({price:b.price,volume:b.volume});
  }

  const total=bins.reduce((s,b)=>s+b.volume,0);
  if(!(total>0))
    return {status:"UNKNOWN",reason:"TOTAL_EXECUTED_VOLUME_NONPOSITIVE"};

  const zoneVolume=bins
    .filter(b=>b.price>=lower&&b.price<=upper)
    .reduce((s,b)=>s+b.volume,0);

  const maxVol=Math.max(...bins.map(b=>b.volume));
  const maxPrices=bins.filter(b=>b.volume===maxVol).map(b=>b.price).sort((a,b)=>a-b);
  const center=(lower+upper)/2;
  const distances=maxPrices.map(p=>Math.abs(p-center));
  const nearest=Math.min(...distances);

  return {
    status:"VALID",
    zoneExecutedVolume:zoneVolume,
    zoneVolumeShare:zoneVolume/total,
    totalExecutedVolume:total,
    maxVolumePrices:maxPrices,
    maxNodeTieCount:maxPrices.length,
    maxNodeVolumeShare:maxVol/total,
    structuralCenterDistanceToNearestMaxNodePrice:nearest,
    structuralCenterDistanceToNearestMaxNodeTicks:positive(tickSize)?nearest/tickSize:null,
    structuralCenterDistanceToNearestMaxNodeAtr:positive(atr)?nearest/atr:null,
    structuralZoneContainsAnyMaxNode:maxPrices.some(p=>p>=lower&&p<=upper),
    distinctPriceLevelCount:new Set(bins.map(b=>b.price)).size,
    profileCoveredVolumeShare:finite(profileCoveredVolumeShare)?profileCoveredVolumeShare:null,
    highVolumeNodeThresholdDefined:false,
    timeAtPriceControlled:false,
    currentLiquidityObserved:false,
    remainingInvestorCostBasisObserved:false
  };
}

export function classifyStructureVolumeContext({
  structuralCertified,
  profileEvaluable,
  volumeNodeEligible,
  volumeNodeEligibilityRuleFrozenBeforeOutcome,
  structuralZoneContainsEligibleNode,
  roundOrReferenceCoincident
}={}){
  if(profileEvaluable!==true)
    return {status:"V4_PROFILE_NOT_EVALUABLE"};

  if(volumeNodeEligible===true&&volumeNodeEligibilityRuleFrozenBeforeOutcome!==true)
    return {status:"UNKNOWN",reason:"VOLUME_NODE_RULE_UNFROZEN"};

  const s=structuralCertified===true;
  const v=volumeNodeEligible===true;

  if(s&&v&&structuralZoneContainsEligibleNode===true){
    return {
      status:roundOrReferenceCoincident===true
        ?"V3_ROUND_REFERENCE_VOLUME_NODE"
        :"V2_STRUCTURE_VOLUME_COINCIDENT"
    };
  }

  if(!s&&v) return {status:"V1_VOLUME_NODE_NONSTRUCTURAL"};
  if(s&&!v) return {status:"V0_STRUCTURAL_ONLY"};

  return {status:"NO_STRUCTURAL_OR_VOLUME_NODE_SIGNAL"};
}

export function buildPriceVolumeLineage({
  parentDecisionId,
  rawRepresentationCount=2
}={}){
  if(!str(parentDecisionId))
    return {status:"UNKNOWN",reason:"PARENT_ID_MISSING"};

  return {
    status:"VALID",
    parentDecisionId:str(parentDecisionId),
    informationRoots:["PRICE_OHLC","TRADED_VOLUME"],
    representationFamily:"D02_PRICE_BY_VOLUME_PROFILE_CONTEXT",
    redundancyGroup:"D01_D02_PRICE_VOLUME_LEVEL_CONTEXT",
    rawRepresentationCount,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}

export function validateBinFamilyFreeze({
  binConstructionRuleId,
  ruleFrozenAt,
  outcomeInspectionAt,
  ruleChangedAfterOutcome,
  losingBinsRemovedAfterOutcome
}={}){
  if(!str(binConstructionRuleId)||!str(ruleFrozenAt))
    return {status:"UNKNOWN",reason:"BIN_FAMILY_RECEIPT_INCOMPLETE"};

  if(ruleChangedAfterOutcome===true)
    return {status:"PROHIBITED",reason:"POST_OUTCOME_BIN_RULE_MUTATION"};

  if(losingBinsRemovedAfterOutcome===true)
    return {status:"PROHIBITED",reason:"POST_OUTCOME_BIN_PRUNING"};

  const frozen=ts(ruleFrozenAt);
  const inspected=ts(outcomeInspectionAt);
  if(inspected!==null&&frozen!==null&&frozen>=inspected)
    return {status:"PROHIBITED",reason:"BIN_RULE_NOT_FROZEN_BEFORE_OUTCOME"};

  return {status:"VALID"};
}

export function classifyMechanismClaim({
  claim,
  hasD05OrderBookReceipt,
  hasInventoryObservable,
  hasTimeAtPriceControl
}={}){
  if(claim==="CURRENT_LIQUIDITY_WALL"&&hasD05OrderBookReceipt!==true)
    return {status:"UNIDENTIFIED",reason:"EXECUTED_VOLUME_IS_NOT_STANDING_LIQUIDITY"};

  if(claim==="REMAINING_INVESTOR_COST_BASIS"&&hasInventoryObservable!==true)
    return {status:"UNIDENTIFIED",reason:"EXECUTED_VOLUME_IS_NOT_REMAINING_INVENTORY"};

  if(claim==="VOLUME_DENSITY_CONVICTION"&&hasTimeAtPriceControl!==true)
    return {status:"PARTIALLY_IDENTIFIED",reason:"TIME_AT_PRICE_CONFOUND"};

  return {status:"EVALUABLE"};
}
