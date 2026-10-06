// D01 DL-052 post-shock snapback vs persistent rejection v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function str(x){return String(x??"");}
function ts(x){
  const v=Date.parse(str(x));
  return Number.isFinite(v)?v:null;
}

export function validateHorizonFamily({
  followupHorizonFamilyId,
  horizonRegistryFrozenAt,
  outcomeInspectionAt,
  horizons=[],
  familyChangedAfterOutcome,
  horizonsRemovedAfterOutcome
}={}){
  if(!str(followupHorizonFamilyId)||!str(horizonRegistryFrozenAt)||!Array.isArray(horizons)||!horizons.length)
    return {status:"UNKNOWN",reason:"HORIZON_FAMILY_INCOMPLETE"};

  const frozen=ts(horizonRegistryFrozenAt);
  const inspected=ts(outcomeInspectionAt);

  if(familyChangedAfterOutcome===true)
    return {status:"PROHIBITED",reason:"POST_OUTCOME_HORIZON_FAMILY_MUTATION"};

  if(horizonsRemovedAfterOutcome===true)
    return {status:"PROHIBITED",reason:"POST_OUTCOME_HORIZON_REMOVAL"};

  if(inspected!==null&&frozen!==null&&frozen>=inspected)
    return {status:"PROHIBITED",reason:"HORIZON_FAMILY_NOT_FROZEN_BEFORE_OUTCOME"};

  const ids=horizons.map(h=>str(h.id)).filter(Boolean);
  if(ids.length!==horizons.length||new Set(ids).size!==ids.length)
    return {status:"UNKNOWN",reason:"HORIZON_ID_INVALID"};

  return {status:"VALID",horizonCount:horizons.length};
}

export function buildShockReference({
  shockReceipt,
  preShockReference,
  shockObservedPrice
}={}){
  if(shockReceipt?.valid!==true||shockReceipt?.replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"SHOCK_RECEIPT_INVALID"};

  if(preShockReference?.valid!==true||!finite(preShockReference?.price))
    return {status:"DATA_BLOCKED",reason:"PRE_SHOCK_REFERENCE_INVALID"};

  if(!finite(shockObservedPrice))
    return {status:"UNKNOWN",reason:"SHOCK_OBSERVED_PRICE_INVALID"};

  const d=shockObservedPrice-preShockReference.price;

  return {
    status:"VALID",
    shockAt:str(shockReceipt.shockAt),
    preShockReferenceType:str(preShockReference.type)||"UNKNOWN",
    preShockReferencePrice:preShockReference.price,
    shockObservedPrice,
    shockDisplacementPrice:d,
    retentionRatioEligible:d!==0
  };
}

export function displacementRetention({
  shockReference,
  followupPrice
}={}){
  if(shockReference?.status!=="VALID"||!finite(followupPrice))
    return {status:"UNKNOWN",reason:"REFERENCE_OR_FOLLOWUP_INVALID"};

  const d=shockReference.shockDisplacementPrice;
  if(!finite(d)||d===0)
    return {status:"UNKNOWN",reason:"ZERO_OR_UNKNOWN_SHOCK_DISPLACEMENT"};

  const follow=followupPrice-shockReference.preShockReferencePrice;
  return {
    status:"VALID",
    followupDisplacementFromPreShock:follow,
    displacementRetentionRatio:follow/d,
    reversionTowardPreShockPrice:Math.abs(d)-Math.abs(follow),
    thresholdedPermanentStateDefined:false
  };
}

export function classifyPostShockPath({
  shockReference,
  immediateRepairReceipt,
  firstZoneTestReceipt,
  persistenceReceipts=[],
  repeatedShockReceipt,
  midquoteReceipt,
  transactionPriceReceipt
}={}){
  if(shockReference?.status!=="VALID")
    return {status:"NOT_EVALUABLE",reason:"SHOCK_REFERENCE_INVALID"};

  if(immediateRepairReceipt?.complete!==true)
    return {status:"NOT_EVALUABLE",reason:"IMMEDIATE_REPAIR_INCOMPLETE"};

  if(repeatedShockReceipt?.interveningShock===true)
    return {
      status:"REPEATED_SHOCK_OR_MIXED_MECHANISM",
      persistentStructuralClaimAllowed:false
    };

  const txSnap=transactionPriceReceipt?.snapbackObserved===true;
  const midAvailable=midquoteReceipt?.valid===true&&midquoteReceipt?.replaySafe===true;
  const midSnap=midquoteReceipt?.snapbackObserved===true;

  if(txSnap&&!midAvailable){
    return {
      status:"TRANSACTION_SNAPBACK_MICROSTRUCTURE_CONTROL_INCOMPLETE",
      persistentStructuralClaimAllowed:false
    };
  }

  if(txSnap&&midAvailable&&!midSnap){
    return {
      status:"MICROSTRUCTURE_BOUNCE_COMPATIBLE",
      persistentStructuralClaimAllowed:false
    };
  }

  if(firstZoneTestReceipt?.valid!==true){
    if(immediateRepairReceipt.snapbackObserved===true)
      return {status:"IMMEDIATE_SNAPBACK_CANDIDATE",persistentStructuralClaimAllowed:false};
    if(immediateRepairReceipt.newLevelRetentionObserved===true)
      return {status:"PRICE_DISCOVERY_COMPLETION_CANDIDATE",persistentStructuralClaimAllowed:false};
    return {status:"SHOCK_NO_VALID_ZONE_TEST",persistentStructuralClaimAllowed:false};
  }

  if(firstZoneTestReceipt.predictorFreezeBeforeResponse!==true)
    return {status:"NOT_EVALUABLE",reason:"ZONE_TEST_LOOKAHEAD_RISK"};

  const rejection=firstZoneTestReceipt.rejectionCandidate===true;
  const continuation=firstZoneTestReceipt.continuationThroughZone===true;

  if(continuation)
    return {status:"SHOCK_CONTINUATION_THROUGH_ZONE",persistentStructuralClaimAllowed:false};

  if(!rejection)
    return {status:"SHOCK_NO_VALID_ZONE_TEST",persistentStructuralClaimAllowed:false};

  if(!Array.isArray(persistenceReceipts)||!persistenceReceipts.length)
    return {status:"TRANSIENT_ZONE_REJECTION_CANDIDATE",persistentStructuralClaimAllowed:false};

  for(const r of persistenceReceipts){
    if(r?.complete!==true||r?.replaySafe!==true)
      return {status:"NOT_EVALUABLE",reason:"PERSISTENCE_RECEIPT_INCOMPLETE"};
    if(r?.newShock===true)
      return {status:"REPEATED_SHOCK_OR_MIXED_MECHANISM",persistentStructuralClaimAllowed:false};
  }

  const allCompatible=persistenceReceipts.every(r=>r.rejectionOrientationRetained===true);

  return allCompatible
    ?{
      status:"PERSISTENT_STRUCTURAL_REJECTION_CANDIDATE",
      persistentStructuralClaimAllowed:true,
      alphaClaimAllowed:false
    }
    :{
      status:"TRANSIENT_ZONE_REJECTION_CANDIDATE",
      persistentStructuralClaimAllowed:false
    };
}

export function classifyClockOrder({
  shockAt,
  immediateRepairEndAt,
  firstZoneTestOpportunityAt,
  persistenceAts=[]
}={}){
  const s=ts(shockAt),i=ts(immediateRepairEndAt);
  if(s===null||i===null||i<=s)
    return {status:"UNKNOWN",reason:"T0_T1_CLOCK_INVALID"};

  let prev=i;
  if(firstZoneTestOpportunityAt){
    const z=ts(firstZoneTestOpportunityAt);
    if(z===null||z<=i)
      return {status:"UNKNOWN",reason:"T2_CLOCK_INVALID"};
    prev=z;
  }

  for(const x of persistenceAts||[]){
    const v=ts(x);
    if(v===null||v<=prev)
      return {status:"UNKNOWN",reason:"T3_CLOCK_INVALID"};
    prev=v;
  }

  return {status:"VALID"};
}

export function buildInformationLineage({
  pricePathRepresentationCount=0,
  directMicrostructurePrimitivePresent=false
}={}){
  return {
    informationRoot:"PRICE_OHLC",
    rawPricePathRepresentationCount:pricePathRepresentationCount,
    directMicrostructurePrimitivePresent:directMicrostructurePrimitivePresent===true,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}
