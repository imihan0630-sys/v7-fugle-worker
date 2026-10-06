// D01 DL-048 time-at-price / inventory firewall v0.1
function s(x){return String(x??"");}
function f(x){return typeof x==="number"&&Number.isFinite(x);}

export function buildBarVisitOccupancy({bars=[],bin,predictorFreezeAt,requireCompleted=true}={}){
  if(!f(bin?.lower)||!f(bin?.upper)||bin.upper<bin.lower)
    return {status:"UNKNOWN",reason:"BIN_INVALID"};
  const freeze=s(predictorFreezeAt);
  if(!freeze) return {status:"UNKNOWN",reason:"FREEZE_CLOCK_MISSING"};

  let eligible=0,visited=0,consecutive=0,maxConsecutive=0,firstVisitedAt=null,lastVisitedAt=null;
  for(const b of bars||[]){
    const end=s(b?.completedAt);
    if(!end||end>freeze) continue;
    if(requireCompleted&&b?.completed!==true) continue;
    if(!f(b?.high)||!f(b?.low)) return {status:"DATA_BLOCKED",reason:"BAR_RANGE_MISSING"};
    eligible++;
    const hit=b.high>=bin.lower&&b.low<=bin.upper;
    if(hit){
      visited++;
      consecutive++;
      maxConsecutive=Math.max(maxConsecutive,consecutive);
      if(!firstVisitedAt) firstVisitedAt=end;
      lastVisitedAt=end;
    }else consecutive=0;
  }
  return {
    status:"VALID",
    occupancyKind:"BAR_VISIT_OCCUPANCY_PROXY",
    eligibleBarCount:eligible,
    visitedBarCount:visited,
    visitedBarShare:eligible?visited/eligible:null,
    maxConsecutiveVisitedBars:maxConsecutive,
    firstVisitedAt,
    lastVisitedAt,
    exactDwellSeconds:null,
    exactDwellClaimAllowed:false
  };
}

export function exactDwellEligibility({dataKind,timestampCoverageComplete,statePersistenceRuleFrozen,replaySafe}={}){
  const kind=s(dataKind);
  if(!["TRADE_EVENT_SEQUENCE","QUOTE_MID_SEQUENCE"].includes(kind))
    return {status:"NOT_AVAILABLE",reason:"EVENT_SEQUENCE_REQUIRED"};
  if(timestampCoverageComplete!==true)
    return {status:"DATA_BLOCKED",reason:"TIMESTAMP_COVERAGE_INCOMPLETE"};
  if(statePersistenceRuleFrozen!==true)
    return {status:"DATA_BLOCKED",reason:"STATE_DURATION_RULE_UNFROZEN"};
  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};
  return {status:"EXACT_DWELL_ELIGIBLE",dataKind:kind};
}

export function buildTimeVolumeDescriptors({occupancy,executedVolumeInZone,executedValueInZone,tradeCount}={}){
  if(occupancy?.status!=="VALID") return {status:"UNKNOWN",reason:"OCCUPANCY_INVALID"};
  const v=f(executedVolumeInZone)?executedVolumeInZone:null;
  const val=f(executedValueInZone)?executedValueInZone:null;
  const tc=f(tradeCount)?tradeCount:null;
  const n=occupancy.visitedBarCount;
  return {
    status:"VALID",
    visitedBarCount:n,
    visitedBarShare:occupancy.visitedBarShare,
    executedVolumeInZone:v,
    executedValueInZone:val,
    volumePerVisitedBar:v!==null&&n>0?v/n:null,
    executedValuePerVisitedBar:val!==null&&n>0?val/n:null,
    tradeCount:tc,
    occupancyEqualsVolume:false,
    tradeIntensityIdentified:tc!==null
  };
}

export function classifyInventoryReceipt({
  holdingQuantityObserved,
  acquisitionCostObserved,
  transactionLedgerComplete,
  netFlowOnly,
  asOfKnown,
  replaySafe
}={}){
  if(asOfKnown!==true||replaySafe!==true)
    return {status:"DATA_BLOCKED",inventoryState:"UNKNOWN",costBasisIdentified:false};
  if(netFlowOnly===true)
    return {status:"FLOW_ONLY",inventoryState:"UNKNOWN",costBasisIdentified:false};
  if(holdingQuantityObserved!==true)
    return {status:"INVENTORY_UNOBSERVED",inventoryState:"UNKNOWN",costBasisIdentified:false};
  if(acquisitionCostObserved===true)
    return {status:"INVENTORY_AND_COST_OBSERVED",inventoryState:"OBSERVED",costBasisIdentified:true};
  if(transactionLedgerComplete===true)
    return {status:"COST_RECONSTRUCTION_CANDIDATE",inventoryState:"OBSERVED",costBasisIdentified:false};
  return {status:"INVENTORY_ONLY_COST_UNKNOWN",inventoryState:"OBSERVED",costBasisIdentified:false};
}

export function buildInformationLineage({occupancyKind,hasVolume,hasQuoteDwell,hasInventory}={}){
  const roots=[];
  if(s(occupancyKind)==="BAR_VISIT_OCCUPANCY_PROXY") roots.push("PRICE_OHLC");
  if(s(occupancyKind)==="TRADE_EVENT_OCCUPANCY") roots.push("TRADE_TIME");
  if(s(occupancyKind)==="QUOTE_MID_DWELL_TIME"||hasQuoteDwell===true) roots.push("QUOTE_TIME");
  if(hasVolume===true) roots.push("TRADED_VOLUME");
  if(hasInventory===true) roots.push("PARTICIPANT_POSITION");
  return {
    informationRoots:[...new Set(roots)],
    independentVoteAllowed:false,
    effectiveIndependentEvidenceCount:1,
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}


export function validateOccupancyParameterFamily({
  parameterFamilyId,
  registryFrozenAt,
  barInterval,
  priceBinRuleId,
  tickRuleReceipt,
  semanticSpace,
  sessionMechanism,
  predictorFreezeAt,
  outcomeInspectionAt,
  familyChangedAfterOutcome,
  bestVariantSelectedAfterOutcome
}={}){
  const req=[
    ["parameterFamilyId",parameterFamilyId],
    ["registryFrozenAt",registryFrozenAt],
    ["barInterval",barInterval],
    ["priceBinRuleId",priceBinRuleId],
    ["semanticSpace",semanticSpace],
    ["sessionMechanism",sessionMechanism],
    ["predictorFreezeAt",predictorFreezeAt]
  ];
  const missing=req.filter(([,v])=>!s(v)).map(([k])=>k);
  if(missing.length) return {status:"UNKNOWN",reason:"OCCUPANCY_PARAMETER_FAMILY_INCOMPLETE",missing};

  if(semanticSpace!=="TECHNICAL_CONTINUITY")
    return {status:"DATA_BLOCKED",reason:"SEMANTIC_SPACE_INVALID"};

  if(!tickRuleReceipt||
     tickRuleReceipt.verified!==true||
     tickRuleReceipt.pointInTime!==true||
     !s(tickRuleReceipt.asOf))
    return {status:"DATA_BLOCKED",reason:"TICK_RULE_RECEIPT_INVALID"};

  if(s(tickRuleReceipt.asOf)>s(predictorFreezeAt))
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"TICK_RULE_AFTER_FREEZE"};

  if(outcomeInspectionAt&&s(registryFrozenAt)>=s(outcomeInspectionAt))
    return {status:"PROHIBITED",reason:"PARAMETER_FAMILY_NOT_FROZEN_BEFORE_OUTCOME"};

  if(familyChangedAfterOutcome===true)
    return {status:"PROHIBITED",reason:"POST_OUTCOME_PARAMETER_FAMILY_MUTATION"};

  if(bestVariantSelectedAfterOutcome===true)
    return {status:"PROHIBITED",reason:"BEST_OCCUPANCY_VARIANT_AFTER_OUTCOME"};

  return {
    status:"VALID",
    parameterFamilyId:s(parameterFamilyId),
    registryFrozenAt:s(registryFrozenAt),
    barInterval:s(barInterval),
    priceBinRuleId:s(priceBinRuleId),
    tickRuleId:s(tickRuleReceipt.ruleId)||null,
    tickRuleAsOf:s(tickRuleReceipt.asOf),
    semanticSpace:s(semanticSpace),
    sessionMechanism:s(sessionMechanism),
    outcomeTunedSelectionAllowed:false
  };
}
