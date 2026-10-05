// D01 DL-044 prior-close / auction-reference / structural-boundary firewall v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function positive(x){return finite(x)&&x>0;}
function str(x){return String(x??"");}

function distanceToZone(price, lower, upper){
  if(!finite(price)||!finite(lower)||!finite(upper)||upper<lower) return null;
  if(price<lower) return lower-price;
  if(price>upper) return price-upper;
  return 0;
}

export function buildReferenceContext({
  boundary,
  priorClose,
  priorCloseKnownAt,
  priorCloseContinuityVerified,
  auctionReferencePrice,
  auctionReferenceKnownAt,
  auctionReferenceSource,
  auctionReferenceRuleVersion,
  specialReferenceState,
  tickSize,
  atr
}={}){
  const lower=boundary?.lower,upper=boundary?.upper;
  if(!finite(lower)||!finite(upper)||upper<lower)
    return {status:"UNKNOWN",reason:"BOUNDARY_INVALID"};

  if(priorCloseContinuityVerified!==true)
    return {status:"DATA_BLOCKED",reason:"PRIOR_CLOSE_CONTINUITY_UNVERIFIED"};

  if(!positive(priorClose))
    return {status:"UNKNOWN",reason:"PRIOR_CLOSE_INVALID"};

  const special=str(specialReferenceState)||"ORDINARY_OR_UNSPECIFIED";
  const specialSession=special!=="ORDINARY_OR_UNSPECIFIED"&&special!=="ORDINARY";

  if(!positive(auctionReferencePrice)){
    return {
      status:specialSession?"DATA_BLOCKED":"REFERENCE_CONTEXT_UNKNOWN",
      reason:specialSession?"SPECIAL_SESSION_REFERENCE_MISSING":"AUCTION_REFERENCE_MISSING"
    };
  }

  if(!str(auctionReferenceSource)||!str(auctionReferenceRuleVersion))
    return {status:"REFERENCE_CONTEXT_UNKNOWN",reason:"AUCTION_REFERENCE_PROVENANCE_INCOMPLETE"};

  const pcDist=distanceToZone(priorClose,lower,upper);
  const arDist=distanceToZone(auctionReferencePrice,lower,upper);
  const pcInside=pcDist===0;
  const arInside=arDist===0;

  let coincidenceState="STRUCTURE_DISTINCT_FROM_REFERENCES";
  if(pcInside&&arInside) coincidenceState="BOTH_REFERENCES_INSIDE_STRUCTURE";
  else if(pcInside) coincidenceState="PRIOR_CLOSE_INSIDE_STRUCTURE";
  else if(arInside) coincidenceState="AUCTION_REFERENCE_INSIDE_STRUCTURE";

  return {
    status:"VALID",
    priorClose,
    priorCloseKnownAt:str(priorCloseKnownAt)||null,
    auctionReferencePrice,
    auctionReferenceKnownAt:str(auctionReferenceKnownAt)||null,
    auctionReferenceSource:str(auctionReferenceSource),
    auctionReferenceRuleVersion:str(auctionReferenceRuleVersion),
    specialReferenceState:special,
    priorCloseInsideStructure:pcInside,
    auctionReferenceInsideStructure:arInside,
    priorCloseDistancePrice:pcDist,
    priorCloseDistanceAtr:positive(atr)?pcDist/atr:null,
    priorCloseDistanceTicks:positive(tickSize)?pcDist/tickSize:null,
    auctionReferenceDistancePrice:arDist,
    auctionReferenceDistanceAtr:positive(atr)?arDist/atr:null,
    auctionReferenceDistanceTicks:positive(tickSize)?arDist/tickSize:null,
    coincidenceState,
    referenceCoincidenceIsConfirmation:false,
    behavioralAnchoringIdentified:false,
    effectiveIndependentEvidenceCount:1
  };
}

export function validateReferenceFallback({
  priorClose,
  auctionReferencePrice,
  specialReferenceState,
  officialReferenceVerified
}={}){
  const special=str(specialReferenceState)||"ORDINARY_OR_UNSPECIFIED";
  const specialSession=special!=="ORDINARY_OR_UNSPECIFIED"&&special!=="ORDINARY";

  if(officialReferenceVerified===true&&positive(auctionReferencePrice))
    return {status:"VALID_OFFICIAL_REFERENCE"};

  if(specialSession)
    return {status:"PROHIBITED",reason:"SPECIAL_SESSION_PRIOR_CLOSE_FALLBACK_PROHIBITED"};

  if(positive(priorClose)&&positive(auctionReferencePrice)===false)
    return {status:"UNKNOWN",reason:"OFFICIAL_AUCTION_REFERENCE_NOT_VERIFIED"};

  return {status:"UNKNOWN",reason:"REFERENCE_INPUT_INCOMPLETE"};
}

export function classifyReferenceAvailability({
  predictorFreezeAt,
  priorCloseKnownAt,
  auctionReferenceKnownAt,
  openKnownAt,
  gapFillKnownAt
}={}){
  const freeze=str(predictorFreezeAt);
  if(!freeze) return {status:"UNKNOWN",reason:"PREDICTOR_FREEZE_MISSING"};
  const available=(t)=>str(t)&&str(t)<=freeze;
  return {
    status:"VALID",
    priorCloseAvailable:available(priorCloseKnownAt),
    auctionReferenceAvailable:available(auctionReferenceKnownAt),
    openAvailable:available(openKnownAt),
    gapFillAvailable:available(gapFillKnownAt),
    futureGapFillMayBackfillPredictor:false
  };
}

export function buildOpenReferenceDistances({
  currentOpen,
  priorClose,
  auctionReferencePrice
}={}){
  if(!positive(currentOpen)||!positive(priorClose)||!positive(auctionReferencePrice))
    return {status:"UNKNOWN",reason:"OPEN_OR_REFERENCE_INVALID"};

  return {
    status:"VALID",
    openDistanceFromPriorClose:currentOpen-priorClose,
    openDistancePctFromPriorClose:(currentOpen-priorClose)/priorClose,
    openDistanceFromAuctionReference:currentOpen-auctionReferencePrice,
    openDistancePctFromAuctionReference:(currentOpen-auctionReferencePrice)/auctionReferencePrice
  };
}

export function classifyReferenceCommonSupport({
  gapOverlap,
  referenceDistanceOverlap,
  auctionMechanismOverlap,
  volatilityLiquidityOverlap,
  constraintOverlap,
  eventOverlap,
  marketSectorGapOverlap,
  regimeOverlap
}={}){
  const checks={
    gapOverlap,
    referenceDistanceOverlap,
    auctionMechanismOverlap,
    volatilityLiquidityOverlap,
    constraintOverlap,
    eventOverlap,
    marketSectorGapOverlap,
    regimeOverlap
  };
  if(Object.values(checks).some(v=>v===false))
    return {status:"REFERENCE_CONTEXT_EXTRAPOLATION_PROHIBITED",checks};
  if(Object.values(checks).some(v=>v!==true))
    return {status:"UNKNOWN",checks};
  return {status:"COMMON_SUPPORT_VALID",checks};
}
