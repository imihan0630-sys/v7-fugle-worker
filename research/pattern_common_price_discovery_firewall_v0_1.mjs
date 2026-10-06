// D01 DL-060 common-price-discovery firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}

export function validateLeadReceipt({
  relationFrozenAt,
  leaderSignalFirstObservableAt,
  leaderSignalKnownAt,
  followerPredictorFreezeAt,
  followerEndpointWindowStart,
  replaySafe,
  outcomeSelectedLeader
}={}){
  const rel=str(relationFrozenAt);
  const first=str(leaderSignalFirstObservableAt);
  const known=str(leaderSignalKnownAt);
  const freeze=str(followerPredictorFreezeAt);
  const endpoint=str(followerEndpointWindowStart);

  if(outcomeSelectedLeader===true)
    return {status:"POST_HOC_RELATION_NOT_ELIGIBLE"};

  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};

  if(!rel||!first||!known||!freeze||!endpoint)
    return {status:"UNKNOWN",reason:"LEAD_CLOCK_INCOMPLETE"};

  if(rel>freeze||first>freeze||known>freeze)
    return {status:"POST_HOC_LEADER_NOT_ELIGIBLE"};

  if(!(known<=freeze&&freeze<endpoint))
    return {status:"TIMING_IDENTITY_INVALID"};

  return {status:"PRE_FREEZE_LEAD_CONTEXT_ELIGIBLE"};
}

export function classifyDiscoveryContext({
  marketPrior,
  sectorPrior,
  verifiedLeaderPrior,
  futuresEtfPrior,
  supplyChainPrior,
  contemporaneousOnly,
  dataBlocked
}={}){
  if(dataBlocked===true)
    return {state:"PRICE_DISCOVERY_DATA_BLOCKED"};

  const prior=[
    ["MARKET_INDEX_PRIOR_MOVE_PRESENT",marketPrior===true],
    ["SECTOR_PRIOR_MOVE_PRESENT",sectorPrior===true],
    ["VERIFIED_LEADER_PRIOR_MOVE_PRESENT",verifiedLeaderPrior===true],
    ["FUTURES_OR_ETF_PRICE_DISCOVERY_PRIOR_MOVE_PRESENT",futuresEtfPrior===true],
    ["SUPPLY_CHAIN_PRIOR_MOVE_PRESENT",supplyChainPrior===true]
  ].filter(x=>x[1]).map(x=>x[0]);

  if(prior.length>1)
    return {state:"MULTIPLE_COMMON_DISCOVERY_CHANNELS",channels:prior};

  if(prior.length===1)
    return {state:prior[0],channels:prior};

  if(contemporaneousOnly===true)
    return {state:"CONTEMPORANEOUS_SYNCHRONIZATION_ONLY",channels:[]};

  return {state:"SELF_STRUCTURE_CONTEXT_ONLY",channels:[]};
}

export function classifySynchronizationEvidence({
  leaderKnownAt,
  followerKnownAt,
  sameBarOnly,
  directionResolved
}={}){
  if(directionResolved!==true)
    return {state:"LEAD_LAG_DIRECTION_UNKNOWN",predictiveEvidence:false};

  if(sameBarOnly===true||str(leaderKnownAt)===str(followerKnownAt))
    return {state:"CONTEMPORANEOUS_SYNCHRONIZATION_ONLY",predictiveEvidence:false};

  if(str(leaderKnownAt)&&str(followerKnownAt)&&str(leaderKnownAt)<str(followerKnownAt))
    return {state:"LEADER_PRECEDES_FOLLOWER",predictiveEvidence:true};

  return {state:"LEAD_LAG_DIRECTION_UNKNOWN",predictiveEvidence:false};
}

export function classifyNonsynchronousRisk({
  stalePrice,
  lastTradeFresh,
  liquidityAdequate,
  sessionConstraint
}={}){
  if(sessionConstraint&&sessionConstraint!=="NORMAL")
    return {state:"SESSION_CONSTRAINT_PRESENT",leadLagClean:false};

  if(stalePrice===true||lastTradeFresh===false||liquidityAdequate===false)
    return {state:"NONSYNCHRONOUS_TRADING_RISK",leadLagClean:false};

  if(stalePrice===false&&lastTradeFresh===true&&liquidityAdequate===true)
    return {state:"NONSYNCHRONOUS_RISK_CONTROLLED",leadLagClean:true};

  return {state:"NONSYNCHRONOUS_STATE_UNKNOWN",leadLagClean:false};
}

export function classifyInformationIndependence({
  leaderInformationRoot,
  followerStructuralInformationRoot="PRICE_OHLC",
  residualIncrementalityValidated
}={}){
  const l=str(leaderInformationRoot)||"UNKNOWN";
  const f=str(followerStructuralInformationRoot)||"PRICE_OHLC";

  if(l==="UNKNOWN")
    return {status:"INFORMATION_ROOT_UNKNOWN",independentEvidenceAllowed:false};

  if(l===f){
    return {
      status:"CORRELATED_PRICE_INFORMATION_ROOT",
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

export function buildDiscoveryDenominator(rows=[]){
  const states=[
    "SELF_STRUCTURE_CONTEXT_ONLY",
    "MARKET_INDEX_PRIOR_MOVE_PRESENT",
    "SECTOR_PRIOR_MOVE_PRESENT",
    "VERIFIED_LEADER_PRIOR_MOVE_PRESENT",
    "FUTURES_OR_ETF_PRICE_DISCOVERY_PRIOR_MOVE_PRESENT",
    "SUPPLY_CHAIN_PRIOR_MOVE_PRESENT",
    "CONTEMPORANEOUS_SYNCHRONIZATION_ONLY",
    "MULTIPLE_COMMON_DISCOVERY_CHANNELS",
    "LEAD_LAG_DIRECTION_UNKNOWN",
    "PRICE_DISCOVERY_DATA_BLOCKED"
  ];
  const counts=Object.fromEntries(states.map(s=>[s,0]));
  for(const r of rows||[]){
    const s=str(r?.state);
    if(s in counts) counts[s]++;
    else counts.PRICE_DISCOVERY_DATA_BLOCKED++;
  }
  return {
    counts,
    total:(rows||[]).length,
    leaderOnlyFilteringAllowed:false,
    successfulFollowerFilteringAllowed:false,
    effectiveIndependentEvidenceCount:1
  };
}
