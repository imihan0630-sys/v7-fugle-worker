// D01 DL-129~131 early-life price discovery / placebo / survivorship oracle v0.1

const DISCOVERY_CLASSES=new Set([
  "NEW_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY",
  "SAME_SECURITY_TRANSFER_LISTING_PRICE_DISCOVERY",
  "SUCCESSOR_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY",
  "RELISTING_REENTRY_PRICE_DISCOVERY",
  "MATURE_CONTINUOUS_TRADING"
]);

export function classifyPriceDiscovery(r={}){
  if(r.matureContinuous===true)return {status:"MATURE_CONTINUOUS_TRADING"};
  if(r.transitionClass==="NEW_SECURITY_INITIAL_LISTING")return {status:"NEW_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY"};
  if(r.transitionClass==="SAME_SECURITY_TRANSFER_LISTING")return {status:"SAME_SECURITY_TRANSFER_LISTING_PRICE_DISCOVERY"};
  if(r.transitionClass==="SUCCESSOR_SECURITY_INITIAL_LISTING")return {status:"SUCCESSOR_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY"};
  if(r.transitionClass==="SAME_SECURITY_RELISTING_REENTRY")return {status:"RELISTING_REENTRY_PRICE_DISCOVERY"};
  return {status:"PRICE_DISCOVERY_CLASS_UNKNOWN"};
}

export function validateEarlyLifeModule(moduleId,r={}){
  if(!DISCOVERY_CLASSES.has(r.priceDiscoveryClass))return {status:"PRICE_DISCOVERY_CLASS_UNKNOWN"};
  if(!Number.isInteger(r.listingAgeEligibleSessions)||r.listingAgeEligibleSessions<1)
    return {status:"LISTING_AGE_INVALID"};

  if(moduleId==="D01-02"){
    if(r.completedBar!==true)return {status:"FIRST_BAR_NOT_OBSERVABLE"};
    return {status:"D0102_EARLY_LIFE_GEOMETRY_ELIGIBLE"};
  }

  if(moduleId==="D01-03"){
    if(!Number.isInteger(r.requiredBars)||r.requiredBars<2)return {status:"SEQUENCE_REQUIREMENT_INVALID"};
    return {status:r.sameSecurityBarsAvailable>=r.requiredBars?"D0103_SEQUENCE_HISTORY_READY":"D0103_SEQUENCE_HISTORY_TOO_SHORT"};
  }

  if(moduleId==="D01-07"){
    if(!Number.isInteger(r.requiredBaseWidth)||r.requiredBaseWidth<=0)return {status:"BASE_REQUIREMENT_INVALID"};
    return {status:r.sameSecurityBarsAvailable>=r.requiredBaseWidth?"D0107_BASE_HISTORY_READY":"D0107_BASE_HISTORY_TOO_SHORT"};
  }

  if(moduleId==="D01-09"){
    if(r.priceDiscoveryClass==="NEW_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY" ||
       r.priceDiscoveryClass==="SUCCESSOR_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY"){
      if(r.usedReferenceBasisAsPriorClose===true)return {status:"LISTING_REFERENCE_NOT_PRIOR_CLOSE"};
      return {status:"ORDINARY_GAP_NOT_EVALUABLE_LISTING_DAY"};
    }
    if(r.priceDiscoveryClass==="SAME_SECURITY_TRANSFER_LISTING_PRICE_DISCOVERY")
      return {status:r.dl123Pass===true?"MARKET_MIGRATION_BOUNDARY_GAP_CONTEXT":"TRANSFER_GAP_BLOCKED"};
    return {status:"D0109_MATURE_GAP_CONTEXT"};
  }

  return {status:"MODULE_OUTSIDE_FIRST_WAVE"};
}

export function validatePlaceboPair(signal={},control={}){
  const common=["moduleId","priceDiscoveryClass","listingAgeSupportId","identityTransitionClass","blockedRowPolicyId"];
  const drift=common.filter(k=>(signal[k]??null)!==(control[k]??null));
  if(drift.length)return {status:"PLACEBO_COMMON_SUPPORT_MISMATCH",drift};
  if(signal.outcomeOpened===true||control.outcomeOpened===true)return {status:"PLACEBO_OUTCOME_CONTAMINATED",drift:[]};
  return {status:"PLACEBO_PAIR_VALID",drift:[]};
}

export function validateReferenceMechanicControl(r={}){
  if(r.transitionClass==="NEW_SECURITY_INITIAL_LISTING" && r.referenceBasisType!=="PUBLIC_OFFERING_OR_INITIAL_LISTING_REFERENCE")
    return {status:"NEW_LISTING_REFERENCE_CONTROL_MISSING"};
  if(r.transitionClass==="SAME_SECURITY_TRANSFER_LISTING" && r.referenceBasisType!=="PRIOR_MARKET_LAST_CLOSE_OR_OFFICIAL_TRANSFER_REFERENCE")
    return {status:"TRANSFER_LISTING_REFERENCE_CONTROL_MISSING"};
  if(r.transitionClass==="SUCCESSOR_SECURITY_INITIAL_LISTING" && r.referenceBasisType!=="SUCCESSOR_EXCHANGE_RATIO_OR_OFFICIAL_REFERENCE")
    return {status:"SUCCESSOR_REFERENCE_CONTROL_MISSING"};
  return {status:"REFERENCE_MECHANIC_CONTROL_VALID"};
}

export function validateListingCohortPredictor(r={}){
  if(!r.securityIdentity||!r.listingStart||!Number.isInteger(r.listingAgeEligibleSessions)||r.listingAgeEligibleSessions<0)
    return {status:"LISTING_COHORT_IDENTITY_INCOMPLETE"};
  if(r.futureDelistingHidden!==true)return {status:"FUTURE_DELISTING_LEAK"};
  if(r.futureMigrationStateUsed===true)return {status:"FUTURE_MIGRATION_LEAK"};
  if(r.futureSuccessorIdentityUsed===true)return {status:"FUTURE_SUCCESSOR_LEAK"};
  if(r.futureSurvivalDurationUsed===true)return {status:"FUTURE_SURVIVAL_LEAK"};
  if(r.currentListingStatusUsedAsHistoricalEligibility===true)return {status:"CURRENT_SURVIVORSHIP_LEAK"};
  return {status:"LISTING_COHORT_PIT_VALID"};
}

export function validateCohortDenominator(r={}){
  const required=["historicalUniverseVersion","listingCohortYear","cohortMemberCount","laterDelistedCount","laterMigratedCount","laterConvertedCount","shortLivedCount"];
  const missing=required.filter(k=>r[k]===undefined||r[k]===null);
  if(missing.length)return {status:"COHORT_DENOMINATOR_INCOMPLETE",missing};
  const parts=r.laterDelistedCount+r.laterMigratedCount+r.laterConvertedCount+r.shortLivedCount;
  if(r.currentSurvivorsOnly===true)return {status:"CURRENT_SURVIVORS_ONLY_PROHIBITED",missing:[]};
  if(parts>r.cohortMemberCount)return {status:"COHORT_COUNTS_INVALID",missing:[]};
  return {status:"COHORT_DENOMINATOR_VALID",missing:[]};
}

export function validateTerminalStateUnlock({terminalStateUsedInPredictor,terminalStateUnlockedForOutcomeSide}={}){
  if(terminalStateUsedInPredictor===true)return {status:"TERMINAL_STATE_PREDICTOR_LEAK"};
  return {status:terminalStateUnlockedForOutcomeSide===true?"TERMINAL_STATE_OUTCOME_SIDE_ALLOWED":"TERMINAL_STATE_STILL_LOCKED"};
}
