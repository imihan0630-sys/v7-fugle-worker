// D01 DL-054 quote flicker vs durable liquidity v0.1
function str(x){return String(x??"");}

export function validateQuotePersistenceSource({sourceMode,eventClockValidity,replaySafe}={}){
  if(replaySafe!==true) return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};
  if(eventClockValidity!=="VALID_FOR_QUOTE_PERSISTENCE")
    return {status:"EVENT_CLOCK_NOT_EVALUABLE",reason:"D05_EVENT_CLOCK_INVALID"};
  if(sourceMode==="SPARSE_SNAPSHOT")
    return {status:"SNAPSHOT_ONLY_UNKNOWN_PERSISTENCE",reason:"SPARSE_SNAPSHOT_CANNOT_IDENTIFY_LIFETIME"};
  return {status:"VALID"};
}

export function classifyDisplayedLiquidity({
  sourceValid,
  snapshotPresent,
  persistenceObserved,
  pressureObserved,
  survivedPressure,
  cancelRepostObserved,
  fleetingObserved,
  depletionThenRefill
}={}){
  if(sourceValid!==true){
    return snapshotPresent===true
      ?{state:"SNAPSHOT_ONLY_UNKNOWN_PERSISTENCE"}
      :{state:"EVENT_CLOCK_NOT_EVALUABLE"};
  }

  if(fleetingObserved===true) return {state:"FLEETING_DISPLAY_CANDIDATE"};
  if(cancelRepostObserved===true) return {state:"CANCEL_REPOST_CYCLING_CANDIDATE"};
  if(depletionThenRefill===true) return {state:"DEPLETION_REFILL_CANDIDATE"};

  if(persistenceObserved===true&&pressureObserved===true&&survivedPressure===true)
    return {state:"PRESSURE_SURVIVING_LIQUIDITY_CANDIDATE"};

  if(persistenceObserved===true)
    return {state:"PERSISTENT_UNTESTED_DISPLAY"};

  return {state:"SNAPSHOT_ONLY_UNKNOWN_PERSISTENCE"};
}

export function validatePersistenceTiming({
  predictorFreezeAt,
  firstDisplayedAt,
  lastDisplayedAt,
  firstCancellationAt,
  repostObservedAt,
  firstOpposingPressureAt,
  survivalAssessmentAt
}={}){
  const freeze=str(predictorFreezeAt);
  if(!freeze) return {status:"UNKNOWN",reason:"PREDICTOR_FREEZE_MISSING"};

  if(firstDisplayedAt&&str(firstDisplayedAt)>freeze)
    return {status:"UNKNOWN",reason:"DISPLAY_NOT_KNOWN_AT_FREEZE"};

  const futureFields={lastDisplayedAt,firstCancellationAt,repostObservedAt,firstOpposingPressureAt,survivalAssessmentAt};
  const timing={};
  for(const [k,v] of Object.entries(futureFields)){
    if(!v){ timing[k]="UNKNOWN"; continue; }
    timing[k]=str(v)>freeze?"POST_TREATMENT_MECHANISM":"KNOWN_BY_FREEZE";
  }
  return {status:"VALID",timing};
}

export function classifyIntentClaim({claim,externalAuthorityEvidence}={}){
  const prohibited=new Set([
    "SPOOFING_CONFIRMED",
    "MARKET_MAKER_DEFENSE",
    "SMART_MONEY_SUPPORT",
    "INVENTORY_REBALANCING_CONFIRMED"
  ]);
  if(prohibited.has(str(claim))&&externalAuthorityEvidence!==true)
    return {status:"PROHIBITED",reason:"INTENT_NOT_IDENTIFIED_FROM_PUBLIC_BOOK"};
  return {status:"ALLOWED_DESCRIPTIVE_LABEL"};
}

export function comparePersistenceProfile({
  genericComparatorVerified,
  zoneLocalized,
  pressureSurvivalResidualValidated
}={}){
  if(genericComparatorVerified!==true)
    return {state:"NOT_EVALUABLE",reason:"GENERIC_PERSISTENCE_COMPARATOR_MISSING"};
  if(pressureSurvivalResidualValidated===true)
    return {state:"STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE"};
  if(zoneLocalized===true)
    return {state:"ZONE_LOCALIZED_PERSISTENCE_ASSOCIATION"};
  return {state:"GENERIC_QUOTE_PERSISTENCE"};
}

export function evidenceIdentity({parentDecisionId,receiptCount}={}){
  if(!str(parentDecisionId)) return {status:"UNKNOWN",reason:"PARENT_ID_MISSING"};
  return {
    status:"VALID",
    parentDecisionId:str(parentDecisionId),
    rawReceiptCount:Number.isFinite(receiptCount)?receiptCount:0,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false
  };
}