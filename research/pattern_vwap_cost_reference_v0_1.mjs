// D01 DL-047 VWAP / anchored-reference / cost-proxy / live-liquidity firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function positive(x){return finite(x)&&x>0;}
function stamp(x){
  const t=Date.parse(str(x));
  return Number.isFinite(t)?t:null;
}

export function validateSessionAverageReceipt({
  sourceId,
  sourceVersion,
  sourceFieldName,
  formulaCertified,
  sessionStart,
  asOf,
  sourceFetchedAt,
  predictorFreezeAt,
  marketType,
  sessionPhase,
  coverageState,
  replaySafe
}={}){
  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"SESSION_REFERENCE_REPLAY_UNSAFE"};

  if(!str(sourceId)||!str(sourceVersion)||!str(sourceFieldName)||!str(marketType)||!str(sessionPhase))
    return {status:"UNKNOWN",reason:"SESSION_REFERENCE_SOURCE_INCOMPLETE"};

  const times=[sessionStart,asOf,sourceFetchedAt,predictorFreezeAt].map(stamp);
  if(times.some(x=>x===null))
    return {status:"UNKNOWN",reason:"SESSION_REFERENCE_CLOCK_INCOMPLETE"};

  const [start,refAsOf,fetched,freeze]=times;
  if(start>refAsOf)
    return {status:"UNKNOWN",reason:"SESSION_REFERENCE_WINDOW_INVALID"};

  if(refAsOf>freeze||fetched>freeze)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"SESSION_REFERENCE_NOT_AVAILABLE_AT_FREEZE"};

  if(!["COMPLETE_TO_ASOF","PARTIAL_KNOWN"].includes(str(coverageState)))
    return {status:"UNKNOWN",reason:"SESSION_REFERENCE_COVERAGE_UNKNOWN"};

  return {
    status:"VALID",
    label:formulaCertified===true?"CERTIFIED_SESSION_VWAP":"SESSION_AVERAGE_PRICE_PROXY",
    formulaCertified:formulaCertified===true,
    replaySafe:true
  };
}

export function validateAnchoredReferenceReceipt({
  anchorClass,
  anchorRuleId,
  anchorRuleFrozenAt,
  outcomeInspectionAt,
  anchorAt,
  anchorKnownAt,
  anchorSource,
  anchorVersion,
  priceVolumeWindowStart,
  priceVolumeWindowEnd,
  referenceAsOf,
  predictorFreezeAt,
  sourceFetchedAt,
  replaySafe,
  futureBarRequired,
  outcomeSelectedAnchor
}={}){
  if(outcomeSelectedAnchor===true)
    return {status:"PROHIBITED",reason:"OUTCOME_SELECTED_ANCHOR"};

  if(futureBarRequired===true)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"FUTURE_BAR_REQUIRED"};

  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"ANCHORED_REFERENCE_REPLAY_UNSAFE"};

  if(!str(anchorClass)||!str(anchorRuleId)||!str(anchorSource)||!str(anchorVersion))
    return {status:"UNKNOWN",reason:"ANCHOR_IDENTITY_INCOMPLETE"};

  const frozen=stamp(anchorRuleFrozenAt);
  const inspected=stamp(outcomeInspectionAt);
  if(frozen===null)
    return {status:"UNKNOWN",reason:"ANCHOR_RULE_FREEZE_UNKNOWN"};

  if(inspected!==null&&frozen>=inspected)
    return {status:"PROHIBITED",reason:"ANCHOR_RULE_NOT_FROZEN_BEFORE_OUTCOME"};

  const times=[
    anchorAt,anchorKnownAt,priceVolumeWindowStart,priceVolumeWindowEnd,
    referenceAsOf,predictorFreezeAt,sourceFetchedAt
  ].map(stamp);

  if(times.some(x=>x===null))
    return {status:"UNKNOWN",reason:"ANCHORED_REFERENCE_CLOCK_INCOMPLETE"};

  const [anchor,known,start,end,refAsOf,freeze,fetched]=times;
  if(start<anchor||start>end)
    return {status:"UNKNOWN",reason:"ANCHORED_REFERENCE_WINDOW_INVALID"};

  if(anchor>freeze||known>freeze||end>freeze||refAsOf>freeze||fetched>freeze)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"ANCHORED_REFERENCE_NOT_AVAILABLE_AT_FREEZE"};

  return {
    status:"VALID",
    anchorClass:str(anchorClass),
    anchorRuleId:str(anchorRuleId),
    replaySafe:true,
    label:"EVENT_ANCHORED_VOLUME_WEIGHTED_REFERENCE"
  };
}

export function validateCostReferenceReceipt({
  owner,
  referencePrice,
  referenceMethod,
  asOf,
  predictorFreezeAt,
  sourceKnownAt,
  sourceLineage,
  ruleVintage,
  proxyType,
  coverageState,
  replaySafe,
  directHoldingsEvidence
}={}){
  if(str(owner)!=="D20")
    return {status:"UNKNOWN",reason:"COST_REFERENCE_OWNER_INVALID"};

  if(!positive(referencePrice)||!str(referenceMethod)||!str(sourceLineage)||!str(ruleVintage)||!str(proxyType))
    return {status:"UNKNOWN",reason:"COST_REFERENCE_RECEIPT_INCOMPLETE"};

  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"COST_REFERENCE_REPLAY_UNSAFE"};

  const refTs=stamp(asOf),freezeTs=stamp(predictorFreezeAt),knownTs=stamp(sourceKnownAt);
  if([refTs,freezeTs,knownTs].some(x=>x===null))
    return {status:"UNKNOWN",reason:"COST_REFERENCE_CLOCK_INCOMPLETE"};

  if(refTs>freezeTs||knownTs>freezeTs)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"COST_REFERENCE_NOT_AVAILABLE_AT_FREEZE"};

  if(!["COMPLETE","BOUNDED_VALID","PARTIAL_KNOWN"].includes(str(coverageState)))
    return {status:"UNKNOWN",reason:"COST_REFERENCE_COVERAGE_UNKNOWN"};

  return {
    status:"VALID",
    label:directHoldingsEvidence===true
      ?"DIRECT_HOLDINGS_COST_REFERENCE_RECEIPT"
      :"AGGREGATE_COST_REFERENCE_PROXY",
    trueAllInvestorCostBasisObserved:directHoldingsEvidence===true,
    institutionalCostObserved:false
  };
}

export function validateLiveLiquidityReceipt({
  owner,
  asOf,
  predictorFreezeAt,
  sourceFetchedAt,
  spreadKnown,
  depthKnown,
  replaySafe
}={}){
  if(str(owner)!=="D05")
    return {status:"UNKNOWN",reason:"LIVE_LIQUIDITY_OWNER_INVALID"};

  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"LIVE_LIQUIDITY_REPLAY_UNSAFE"};

  const a=stamp(asOf),f=stamp(predictorFreezeAt),s=stamp(sourceFetchedAt);
  if([a,f,s].some(x=>x===null))
    return {status:"UNKNOWN",reason:"LIVE_LIQUIDITY_CLOCK_INCOMPLETE"};

  if(a>f||s>f)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"LIVE_LIQUIDITY_NOT_AVAILABLE_AT_FREEZE"};

  if(spreadKnown!==true&&depthKnown!==true)
    return {status:"UNKNOWN",reason:"LIVE_LIQUIDITY_OBSERVABLES_MISSING"};

  return {
    status:"VALID",
    label:"LIVE_ORDER_BOOK_LIQUIDITY"
  };
}

export function referenceDistanceToZone({
  boundary,
  referencePrice,
  tickSize,
  atr
}={}){
  const lower=boundary?.lower,upper=boundary?.upper;
  if(!finite(lower)||!finite(upper)||upper<lower||!positive(referencePrice))
    return {status:"UNKNOWN",reason:"BOUNDARY_OR_REFERENCE_INVALID"};

  let edgeDistance=0,side="INSIDE_ZONE";
  if(referencePrice>upper){
    edgeDistance=referencePrice-upper;
    side="ABOVE_ZONE";
  }else if(referencePrice<lower){
    edgeDistance=lower-referencePrice;
    side="BELOW_ZONE";
  }

  const center=(lower+upper)/2;
  const centerDistance=Math.abs(referencePrice-center);

  return {
    status:"VALID",
    referenceInsideZone:referencePrice>=lower&&referencePrice<=upper,
    referenceDistancePrice:edgeDistance,
    referenceDistanceTicks:positive(tickSize)?edgeDistance/tickSize:null,
    referenceDistanceAtr:positive(atr)?edgeDistance/atr:null,
    zoneCenterDistancePrice:centerDistance,
    sideRelativeToZone:side
  };
}

export function classifyReferenceCoincidence({
  structuralCertified,
  sessionReferenceCoincident,
  anchoredReferenceCoincident,
  costProxyCoincident,
  liveLiquidityCoincident,
  allRequiredReceiptsEvaluable
}={}){
  if(allRequiredReceiptsEvaluable===false)
    return {status:"C6_REFERENCE_NOT_EVALUABLE"};

  if(structuralCertified!==true)
    return {status:"NO_CERTIFIED_STRUCTURE"};

  const flags=[
    sessionReferenceCoincident===true,
    anchoredReferenceCoincident===true,
    costProxyCoincident===true,
    liveLiquidityCoincident===true
  ];
  const count=flags.filter(Boolean).length;

  if(count===0) return {status:"C0_STRUCTURAL_ONLY"};
  if(count>1) return {status:"C5_MULTI_REFERENCE_COINCIDENT"};
  if(sessionReferenceCoincident===true) return {status:"C1_SESSION_REFERENCE_COINCIDENT"};
  if(anchoredReferenceCoincident===true) return {status:"C2_ANCHORED_REFERENCE_COINCIDENT"};
  if(costProxyCoincident===true) return {status:"C3_COST_PROXY_COINCIDENT"};
  return {status:"C4_LIVE_LIQUIDITY_COINCIDENT"};
}

export function buildReferenceLineage({
  parentDecisionId,
  hasPriceStructure,
  hasSessionReference,
  hasAnchoredReference,
  hasCostProxy,
  hasLiveLiquidity
}={}){
  if(!str(parentDecisionId))
    return {status:"UNKNOWN",reason:"PARENT_ID_MISSING"};

  const raw=[
    hasPriceStructure&&"STRUCTURE",
    hasSessionReference&&"SESSION_REFERENCE",
    hasAnchoredReference&&"ANCHORED_REFERENCE",
    hasCostProxy&&"COST_PROXY",
    hasLiveLiquidity&&"LIVE_LIQUIDITY"
  ].filter(Boolean);

  const roots=new Set();
  if(hasPriceStructure||hasSessionReference||hasAnchoredReference) roots.add("PRICE_OHLC");
  if(hasSessionReference||hasAnchoredReference) roots.add("TRADED_VOLUME");
  if(hasCostProxy) roots.add("BEHAVIORAL_REFERENCE_RECEIPT");
  if(hasLiveLiquidity) roots.add("LIVE_ORDER_BOOK_RECEIPT");

  return {
    status:"VALID",
    parentDecisionId:str(parentDecisionId),
    rawRepresentationCount:raw.length,
    informationRoots:[...roots].sort(),
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}

export function validateAnchorFamilyFreeze({
  anchorFamilyId,
  registryFrozenAt,
  outcomeInspectionAt,
  familyChangedAfterOutcome,
  anchorVariantsRemovedAfterOutcome
}={}){
  if(!str(anchorFamilyId)||!str(registryFrozenAt))
    return {status:"UNKNOWN",reason:"ANCHOR_FAMILY_RECEIPT_INCOMPLETE"};

  if(familyChangedAfterOutcome===true)
    return {status:"PROHIBITED",reason:"POST_OUTCOME_ANCHOR_FAMILY_MUTATION"};

  if(anchorVariantsRemovedAfterOutcome===true)
    return {status:"PROHIBITED",reason:"POST_OUTCOME_ANCHOR_VARIANT_REMOVAL"};

  const frozen=stamp(registryFrozenAt),inspected=stamp(outcomeInspectionAt);
  if(inspected!==null&&frozen!==null&&frozen>=inspected)
    return {status:"PROHIBITED",reason:"ANCHOR_FAMILY_NOT_FROZEN_BEFORE_OUTCOME"};

  return {status:"VALID"};
}
