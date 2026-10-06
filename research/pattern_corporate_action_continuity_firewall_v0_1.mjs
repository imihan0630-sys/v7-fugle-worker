// D01 DL-065 corporate-action continuity firewall v0.1
// Research-only / outcome-blind. Consumes canonical Corporate Actions receipts.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function validateContinuityReceipt({
  canonicalOwner,
  firstKnownAt,
  finalScheduleKnownAt,
  effectiveDate,
  predictorFreezeAt,
  technicalPriceFactor,
  factorVersion,
  replaySafe
}={}){
  if(canonicalOwner!=="CORPORATE_ACTIONS_LANE")
    return {status:"DATA_BLOCKED",reason:"NONCANONICAL_ADJUSTMENT_OWNER"};

  const first=str(firstKnownAt),final=str(finalScheduleKnownAt),effective=str(effectiveDate),freeze=str(predictorFreezeAt);
  if(!first||!effective||!freeze||!str(factorVersion))
    return {status:"UNKNOWN",reason:"EVENT_OR_FACTOR_CLOCK_INCOMPLETE"};

  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};

  if(first>freeze)
    return {status:"POST_FREEZE_EVENT_VERSION_NOT_ELIGIBLE"};

  if(final&&final>freeze)
    return {status:"FINAL_SCHEDULE_NOT_KNOWN_AT_FREEZE"};

  if(!finite(technicalPriceFactor)||technicalPriceFactor<=0)
    return {status:"CORPORATE_ACTION_CONTINUITY_DATA_BLOCKED",reason:"TECHNICAL_FACTOR_INVALID"};

  return {
    status:"VALID",
    technicalPriceFactor,
    factorVersion:str(factorVersion),
    owner:"CORPORATE_ACTIONS_LANE"
  };
}

export function classifyRawVsContinuity({
  rawGap,
  continuityGap,
  rawCrossesZone,
  continuityCrossesZone,
  actionReceiptValid
}={}){
  if(actionReceiptValid!==true)
    return {status:"DATA_BLOCKED",reason:"ACTION_RECEIPT_INVALID"};

  const rg=finite(rawGap)?rawGap:null;
  const cg=finite(continuityGap)?continuityGap:null;

  if(rawCrossesZone===true&&continuityCrossesZone!==true)
    return {
      status:"RAW_CROSS_CONTINUITY_NO_CROSS",
      semanticInterpretation:"CORPORATE_ACTION_MECHANICAL_DISCONTINUITY",
      rawGap:rg,continuityGap:cg
    };

  if(rawCrossesZone!==true&&continuityCrossesZone===true)
    return {
      status:"CONTINUITY_CROSS_ONLY",
      semanticInterpretation:"CONTINUITY_SPACE_STRUCTURAL_CROSS",
      rawGap:rg,continuityGap:cg
    };

  if(rawCrossesZone===true&&continuityCrossesZone===true)
    return {
      status:"RAW_AND_CONTINUITY_AGREE_CROSS",
      semanticInterpretation:"STRUCTURAL_CROSS_CANDIDATE",
      rawGap:rg,continuityGap:cg
    };

  return {
    status:"NO_STRUCTURAL_CROSS",
    semanticInterpretation:rg!==cg?"RAW_CONTINUITY_DIVERGENCE_NO_CROSS":"NO_CROSS",
    rawGap:rg,continuityGap:cg
  };
}

export function classifyReferenceProvenance({
  previousRawClose,
  economicAdjustmentReference,
  exchangeOpeningReference,
  providerAdjustedAnchor,
  referenceConflictReasons=[]
}={}){
  const reasons=(referenceConflictReasons||[]).map(String).filter(Boolean);
  if(reasons.length)
    return {status:"REFERENCE_CONFLICT_DATA_BLOCKED",reasons};

  const known={
    previousRawClose:finite(previousRawClose),
    economicAdjustmentReference:finite(economicAdjustmentReference),
    exchangeOpeningReference:finite(exchangeOpeningReference),
    providerAdjustedAnchor:finite(providerAdjustedAnchor)
  };

  return {status:"REFERENCE_RECEIPTS_PRESERVED",known,collapsed:false};
}

export function classifyVolumeSemantic({
  volumeTransformMode,
  volumeReceiptVerified
}={}){
  const allowed=new Set(["NONE","UNIT_SCALE","SUPPLY_CHANGE","UNKNOWN"]);
  if(!allowed.has(volumeTransformMode))
    return {status:"UNKNOWN",reason:"VOLUME_MODE_INVALID"};

  if(volumeTransformMode==="UNKNOWN"||volumeReceiptVerified!==true)
    return {status:"VOLUME_SEMANTIC_DATA_BLOCKED",priceFactorUsedForVolume:false};

  return {
    status:"VOLUME_SEMANTIC_VALID",
    volumeTransformMode,
    priceFactorUsedForVolume:false
  };
}

export function buildDualSpaceLineage({
  rawExecutionPresent,
  technicalContinuityPresent,
  priceIndexComparablePresent,
  totalReturnComparablePresent
}={}){
  const spaces=[];
  if(rawExecutionPresent===true) spaces.push("RAW_EXECUTION");
  if(technicalContinuityPresent===true) spaces.push("TECHNICAL_CONTINUITY");
  if(priceIndexComparablePresent===true) spaces.push("PRICE_INDEX_COMPARABLE");
  if(totalReturnComparablePresent===true) spaces.push("TOTAL_RETURN_COMPARABLE");

  return {
    semanticSpaces:spaces,
    informationRoot:"PRICE_OHLC",
    rawRepresentationCount:spaces.length,
    effectiveIndependentEvidenceCount:spaces.length?1:0,
    dualSpaceCreatesIndependentConfirmation:false
  };
}

export function classifyCorporateActionComparator({
  atStructuralZone,
  actionContextVerified
}={}){
  if(actionContextVerified!==true)
    return {status:"UNKNOWN",reason:"ACTION_CONTEXT_UNVERIFIED"};

  return {
    status:atStructuralZone===true
      ?"G1_CORPORATE_ACTION_EVENT_AT_STRUCTURAL_ZONE"
      :"G0_CORPORATE_ACTION_EVENT_AWAY_FROM_STRUCTURAL_ZONE"
  };
}

export function classifyProviderHistory({
  pointInTimeAdjustmentVintageKnown,
  providerAdjusted,
  laterBasisPossible
}={}){
  if(providerAdjusted===true&&
     (pointInTimeAdjustmentVintageKnown!==true||laterBasisPossible===true))
    return {status:"PROVIDER_ADJUSTED_HISTORY_REPLAY_UNSAFE"};

  return {status:"PROVIDER_HISTORY_REPLAY_EVALUABLE"};
}

export function classifyStructuralVersionAcrossAction({
  sameRootCertified,
  mechanicalPriceResetOnly,
  continuityReceiptValid
}={}){
  if(continuityReceiptValid!==true)
    return {status:"DATA_BLOCKED"};

  if(sameRootCertified===true&&mechanicalPriceResetOnly===true)
    return {
      status:"CORPORATE_ACTION_CONTINUITY_VERSION",
      newIndependentRoot:false
    };

  return {status:"LINEAGE_REQUIRES_EXISTING_D01_RULES",newIndependentRoot:false};
}
