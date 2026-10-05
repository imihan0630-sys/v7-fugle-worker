// D01 DL-045 round-number / tick-grid salience firewall v0.1
// Research-only / outcome-blind / SDA-001 remediation.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function positive(x){return finite(x)&&x>0;}
function str(x){return String(x??"");}

export function validateTickReceipt({
  tickSize,
  tickBandId,
  tickRuleVersion,
  tickKnownAt,
  predictorFreezeAt
}={}){
  if(!positive(tickSize)||!str(tickBandId)||!str(tickRuleVersion)||!str(tickKnownAt))
    return {status:"UNKNOWN",reason:"TICK_RECEIPT_INCOMPLETE"};

  if(!str(predictorFreezeAt))
    return {status:"UNKNOWN",reason:"PREDICTOR_FREEZE_MISSING"};

  if(str(tickKnownAt)>str(predictorFreezeAt))
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"TICK_RECEIPT_FUTURE"};

  return {
    status:"VALID",
    tickSize,
    tickBandId:str(tickBandId),
    tickRuleVersion:str(tickRuleVersion),
    tickKnownAt:str(tickKnownAt)
  };
}

export function validateRoundGridRegistry({
  roundGridFamilyId,
  roundGridVersion,
  registryFrozenAt,
  predictorFreezeAt,
  referenceLevels,
  mutatedAfterOutcome
}={}){
  if(!str(roundGridFamilyId)||!str(roundGridVersion)||!str(registryFrozenAt))
    return {status:"UNKNOWN",reason:"ROUND_GRID_REGISTRY_INCOMPLETE"};

  if(!str(predictorFreezeAt))
    return {status:"UNKNOWN",reason:"PREDICTOR_FREEZE_MISSING"};

  if(str(registryFrozenAt)>str(predictorFreezeAt))
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"ROUND_GRID_FROZEN_AFTER_PREDICTOR"};

  if(mutatedAfterOutcome===true)
    return {status:"PROHIBITED",reason:"OUTCOME_SELECTED_ROUND_GRID_MUTATION"};

  const levels=[...new Set((referenceLevels||[]).filter(finite))].sort((a,b)=>a-b);
  if(!levels.length)
    return {status:"UNKNOWN",reason:"ROUND_REFERENCE_LEVELS_EMPTY"};

  return {
    status:"VALID",
    roundGridFamilyId:str(roundGridFamilyId),
    roundGridVersion:str(roundGridVersion),
    registryFrozenAt:str(registryFrozenAt),
    referenceLevels:levels
  };
}

export function nearestReferenceDistance({price,referenceLevels,tickSize}={}){
  if(!finite(price))
    return {status:"UNKNOWN",reason:"PRICE_INVALID"};
  const levels=[...new Set((referenceLevels||[]).filter(finite))].sort((a,b)=>a-b);
  if(!levels.length)
    return {status:"UNKNOWN",reason:"REFERENCE_LEVELS_EMPTY"};

  let nearest=levels[0];
  let dist=Math.abs(price-nearest);
  for(const x of levels.slice(1)){
    const d=Math.abs(price-x);
    if(d<dist){
      dist=d;
      nearest=x;
    }
  }

  return {
    status:"VALID",
    nearestReferencePrice:nearest,
    distancePrice:dist,
    distanceTicks:positive(tickSize)?dist/tickSize:null,
    exactReferenceEquality:dist===0
  };
}

export function buildRoundTickContext({
  boundary,
  structuralRootId,
  predictorFreezeAt,
  tickReceipt,
  roundRegistry,
  tickBandTransitionPrice
}={}){
  const lower=boundary?.lower,upper=boundary?.upper;
  if(!finite(lower)||!finite(upper)||upper<lower)
    return {status:"UNKNOWN",reason:"BOUNDARY_INVALID"};

  const tick=validateTickReceipt({...tickReceipt,predictorFreezeAt});
  if(tick.status!=="VALID")
    return {status:tick.status,reason:tick.reason};

  const round=validateRoundGridRegistry({...roundRegistry,predictorFreezeAt});
  if(round.status!=="VALID")
    return {status:round.status,reason:round.reason};

  const center=(lower+upper)/2;
  const lowerRound=nearestReferenceDistance({
    price:lower,referenceLevels:round.referenceLevels,tickSize:tick.tickSize
  });
  const upperRound=nearestReferenceDistance({
    price:upper,referenceLevels:round.referenceLevels,tickSize:tick.tickSize
  });
  const centerRound=nearestReferenceDistance({
    price:center,referenceLevels:round.referenceLevels,tickSize:tick.tickSize
  });

  const transitionValid=finite(tickBandTransitionPrice);
  const transitionDistance=transitionValid?Math.abs(center-tickBandTransitionPrice):null;
  const transitionExact=transitionValid&&transitionDistance===0;
  const roundExact=centerRound.exactReferenceEquality===true;
  const hasStructure=Boolean(str(structuralRootId));

  let salienceCoincidenceState="S0_STRUCTURE_NONROUND_NONTRANSITION";
  if(!hasStructure&&roundExact&&!transitionExact) salienceCoincidenceState="S1_ROUND_REFERENCE_ONLY";
  else if(!hasStructure&&!roundExact&&transitionExact) salienceCoincidenceState="S2_TICK_BAND_TRANSITION_ONLY";
  else if(hasStructure&&roundExact&&!transitionExact) salienceCoincidenceState="S3_STRUCTURE_ROUND_COINCIDENT";
  else if(hasStructure&&!roundExact&&transitionExact) salienceCoincidenceState="S4_STRUCTURE_TICK_TRANSITION_COINCIDENT";
  else if(roundExact&&transitionExact) salienceCoincidenceState="S5_MULTI_SALIENCE_COINCIDENT";
  else if(!hasStructure) salienceCoincidenceState="S6_SALIENCE_CONTEXT_UNKNOWN";

  return {
    status:"VALID",
    structuralRootId:str(structuralRootId)||null,
    structuralCenterPrice:center,
    tickSize:tick.tickSize,
    tickBandId:tick.tickBandId,
    tickRuleVersion:tick.tickRuleVersion,
    roundGridFamilyId:round.roundGridFamilyId,
    roundGridVersion:round.roundGridVersion,
    nearestRoundReferencePrice:centerRound.nearestReferencePrice,
    centerDistanceToNearestRoundPrice:centerRound.distancePrice,
    centerDistanceToNearestRoundTicks:centerRound.distanceTicks,
    lowerBoundaryDistanceToNearestRoundPrice:lowerRound.distancePrice,
    upperBoundaryDistanceToNearestRoundPrice:upperRound.distancePrice,
    nearestTickBandTransitionPrice:transitionValid?tickBandTransitionPrice:null,
    centerDistanceToTickBandTransition:transitionDistance,
    salienceCoincidenceState,
    roundExact,
    tickTransitionExact:transitionExact,
    orderClusteringMechanism:"PLAUSIBLE_NOT_OBSERVED",
    behavioralAnchoring:"UNIDENTIFIED",
    informationRoot:"PRICE_OHLC",
    redundancyGroup:"D01_ROUND_TICK_REFERENCE_CONTEXT",
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    residualIncrementalityStatus:"NOT_VALIDATED",
    outcomeJoinAllowed:false
  };
}

export function validateTickMigration({
  formationTickReceipt,
  currentTickReceipt,
  formationFreezeAt,
  currentFreezeAt
}={}){
  const f=validateTickReceipt({...formationTickReceipt,predictorFreezeAt:formationFreezeAt});
  const c=validateTickReceipt({...currentTickReceipt,predictorFreezeAt:currentFreezeAt});

  if(f.status!=="VALID"||c.status!=="VALID")
    return {status:"UNKNOWN_OR_BLOCKED",formationStatus:f.status,currentStatus:c.status};

  return {
    status:"VALID",
    formationTickSize:f.tickSize,
    currentTickSize:c.tickSize,
    tickBandChanged:f.tickBandId!==c.tickBandId||f.tickSize!==c.tickSize,
    currentTickBackfilledToFormation:false
  };
}

export function buildPriceFamilyDedup({
  parentDecisionId,
  representations=[]
}={}){
  if(!str(parentDecisionId))
    return {status:"UNKNOWN",reason:"PARENT_ID_MISSING"};

  const reps=(representations||[]).map((r,i)=>({
    id:str(r.id)||`R${i+1}`,
    informationRoot:str(r.informationRoot)||"PRICE_OHLC"
  }));

  if(!reps.length)
    return {status:"UNKNOWN",reason:"REPRESENTATIONS_EMPTY"};

  const roots=[...new Set(reps.map(x=>x.informationRoot))];
  const allPrice=roots.length===1&&roots[0]==="PRICE_OHLC";

  return {
    status:"VALID",
    rawRepresentationCount:reps.length,
    informationRoots:roots,
    effectiveIndependentEvidenceCount:allPrice?1:roots.length,
    independentVoteAllowed:allPrice?false:null,
    redundancyGroup:allPrice?"D01_ROUND_TICK_REFERENCE_CONTEXT":"MIXED_INFORMATION_ROOTS",
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}
