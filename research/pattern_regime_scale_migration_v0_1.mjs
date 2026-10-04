// D01 DL-032 regime / volatility-scale migration firewall v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function positive(x){return finite(x)&&x>0;}

export function buildScaleMigrationSnapshot({
  boundary,
  formation,
  current,
  semanticSpaceReceipt
}={}){
  const lower=boundary?.lower, upper=boundary?.upper;
  if(!finite(lower)||!finite(upper)||upper<lower)
    return {status:"UNKNOWN",reason:"BOUNDARY_INVALID"};

  if(!semanticSpaceReceipt||
     semanticSpaceReceipt.verified!==true||
     semanticSpaceReceipt.formationSpace!=="TECHNICAL_CONTINUITY"||
     semanticSpaceReceipt.currentSpace!=="TECHNICAL_CONTINUITY"){
    return {status:"DATA_BLOCKED",reason:"SEMANTIC_SPACE_OR_CONTINUITY_INVALID"};
  }

  if(!formation||!current)
    return {status:"UNKNOWN",reason:"CONTEXT_MISSING"};

  if(formation.asOf && current.asOf && formation.asOf>current.asOf)
    return {status:"UNKNOWN",reason:"FUTURE_FORMATION_CONTEXT"};

  const width=upper-lower;
  const fRef=formation.referencePrice;
  const cRef=current.referencePrice;
  const fAtr=formation.atr;
  const cAtr=current.atr;
  const fNorm=formation.normalizedVolatility;
  const cNorm=current.normalizedVolatility;
  const fTick=formation.relativeTick;
  const cTick=current.relativeTick;

  return {
    status:"VALID",
    frozenBoundary:{lower,upper},
    zoneWidthPrice:width,
    formationZoneWidthAtr:positive(fAtr)?width/fAtr:null,
    currentZoneWidthAtr:positive(cAtr)?width/cAtr:null,
    formationZoneWidthPct:positive(fRef)?width/fRef:null,
    currentZoneWidthPct:positive(cRef)?width/cRef:null,
    volatilityScaleRatio:positive(fNorm)&&positive(cNorm)?cNorm/fNorm:null,
    relativeTickRatio:positive(fTick)&&positive(cTick)?cTick/fTick:null,
    boundaryMutated:false,
    regimeChangeResetsRootAge:false,
    regimeChangeResetsVersionAge:false,
    outcomeJoinAllowed:false,
    formationContext:{
      volatilityRegime:formation.volatilityRegime??null,
      marketRegime:formation.marketRegime??null,
      sectorRegime:formation.sectorRegime??null,
      liquidityState:formation.liquidityState??null
    },
    currentContext:{
      volatilityRegime:current.volatilityRegime??null,
      marketRegime:current.marketRegime??null,
      sectorRegime:current.sectorRegime??null,
      liquidityState:current.liquidityState??null
    }
  };
}

export function classifyContextEvaluability({formation,current}={}){
  if(!formation||!current)
    return {status:"UNKNOWN",reason:"CONTEXT_MISSING"};
  if(formation.ownerReceiptVerified!==true||current.ownerReceiptVerified!==true)
    return {status:"UNKNOWN",reason:"OWNER_CONTEXT_RECEIPT_UNVERIFIED"};
  if(formation.ownerVersion!==current.ownerVersion)
    return {status:"UNKNOWN",reason:"OWNER_CONTEXT_VERSION_MISMATCH"};
  return {status:"VALID",reason:null};
}

export function classifyCommonSupport({
  ageOverlap,
  volatilityOverlap,
  liquidityOverlap,
  tickOverlap,
  regimeOverlap,
  interactionHistoryOverlap
}={}){
  const checks={
    ageOverlap,
    volatilityOverlap,
    liquidityOverlap,
    tickOverlap,
    regimeOverlap,
    interactionHistoryOverlap
  };
  if(Object.values(checks).some(v=>v===false))
    return {status:"EXTRAPOLATION_PROHIBITED",checks};
  if(Object.values(checks).some(v=>v!==true))
    return {status:"UNKNOWN",checks};
  return {status:"COMMON_SUPPORT_VALID",checks};
}
