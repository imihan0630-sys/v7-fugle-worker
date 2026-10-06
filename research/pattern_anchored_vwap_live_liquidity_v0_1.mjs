// D01 DL-047 anchored-VWAP / live-liquidity firewall v0.1
function s(x){return String(x??"");}
function f(x){return typeof x==="number"&&Number.isFinite(x);}

export function classifyAnchor({anchorLineage,anchorAt,anchorKnownAt,predictorFreezeAt,outcomeSelected}={}){
  const line=s(anchorLineage), a=s(anchorAt), k=s(anchorKnownAt), p=s(predictorFreezeAt);
  if(outcomeSelected===true||line==="OUTCOME_SELECTED_ANCHOR")
    return {status:"PROHIBITED",reason:"OUTCOME_SELECTED_ANCHOR"};
  const allowed=new Set(["SESSION_MECHANIC_ANCHOR","EXTERNAL_EVENT_ANCHOR","D01_STRUCTURAL_EVENT_ANCHOR","MANUAL_PREDECLARED_ANCHOR"]);
  if(!allowed.has(line)) return {status:"UNKNOWN",reason:"ANCHOR_LINEAGE_UNKNOWN"};
  if(!a||!k||!p) return {status:"UNKNOWN",reason:"ANCHOR_CLOCK_INCOMPLETE"};
  if(a>p||k>p) return {status:"POST_HOC_NOT_ELIGIBLE",reason:"ANCHOR_NOT_KNOWN_AT_FREEZE"};
  return {status:"VALID",anchorLineage:line,structuralDependence:line==="D01_STRUCTURAL_EVENT_ANCHOR"};
}

export function validateVwapReceipt({kind,sourceSemanticsVerified,flowStart,flowEnd,predictorFreezeAt,coverageComplete,syntheticFromOhlcv}={}){
  if(syntheticFromOhlcv===true) return {status:"PROHIBITED",reason:"OHLCV_SYNTHETIC_VWAP"};
  const k=s(kind);
  if(k==="PROVIDER_AVERAGE_PRICE_PROXY")
    return {status:"VALID_PROXY",exactVwap:false};
  if(!["EXACT_SESSION_VWAP","ANCHORED_VWAP_CANDIDATE"].includes(k))
    return {status:"UNKNOWN",reason:"VWAP_KIND_UNKNOWN"};
  if(sourceSemanticsVerified!==true) return {status:"DATA_BLOCKED",reason:"VWAP_SEMANTICS_UNVERIFIED"};
  if(coverageComplete!==true) return {status:"DATA_BLOCKED",reason:"TRADE_FLOW_COVERAGE_INCOMPLETE"};
  const start=s(flowStart),end=s(flowEnd),freeze=s(predictorFreezeAt);
  if(!start||!end||!freeze||start>end) return {status:"UNKNOWN",reason:"TRADE_FLOW_CLOCK_INVALID"};
  if(end>freeze) return {status:"POST_HOC_NOT_ELIGIBLE",reason:"TRADE_FLOW_AFTER_FREEZE"};
  return {status:"VALID_EXACT",exactVwap:true};
}

export function classifyBookReceipt({snapshotAt,sourceFetchedAt,predictorFreezeAt,freshnessState,sessionMechanism,coverageComplete}={}){
  const snap=s(snapshotAt),fetch=s(sourceFetchedAt),freeze=s(predictorFreezeAt);
  if(!snap||!fetch||!freeze) return {status:"UNKNOWN",reason:"BOOK_CLOCK_INCOMPLETE"};
  if(snap>freeze||fetch>freeze) return {status:"POST_HOC_NOT_ELIGIBLE",reason:"BOOK_AFTER_FREEZE"};
  if(coverageComplete!==true) return {status:"DATA_BLOCKED",reason:"BOOK_COVERAGE_INCOMPLETE"};
  if(s(freshnessState)!=="FRESH") return {status:"BOOK_CONTEXT_STALE",reason:"BOOK_NOT_FRESH"};
  if(!s(sessionMechanism)) return {status:"UNKNOWN",reason:"SESSION_MECHANISM_MISSING"};
  return {status:"VALID_FRESH_BOOK",sessionMechanism:s(sessionMechanism)};
}

export function referenceDistance({referencePrice,lower,upper,tickSize,atr}={}){
  if(!f(referencePrice)||!f(lower)||!f(upper)||upper<lower) return {status:"UNKNOWN",reason:"PRICE_OR_BOUNDARY_INVALID"};
  const inside=referencePrice>=lower&&referencePrice<=upper;
  const distance=inside?0:referencePrice<lower?lower-referencePrice:referencePrice-upper;
  return {
    status:"VALID",
    referenceInsideZone:inside,
    referenceDistancePrice:distance,
    referenceDistanceTicks:f(tickSize)&&tickSize>0?distance/tickSize:null,
    referenceDistanceAtr:f(atr)&&atr>0?distance/atr:null,
    structuralCenterMinusReferencePrice:(lower+upper)/2-referencePrice
  };
}

export function buildLineageDiagnostics({anchorLineage,hasProfile,hasFreshBook}={}){
  const roots=["PRICE_OHLC","TRADED_VOLUME"];
  if(hasFreshBook===true) roots.push("LIVE_ORDER_BOOK");
  if(s(anchorLineage)==="EXTERNAL_EVENT_ANCHOR") roots.push("EVENT_CLOCK");
  return {
    informationRoots:[...new Set(roots)],
    independentVoteAllowed:false,
    effectiveIndependentEvidenceCount:1,
    residualIncrementalityStatus:"NOT_VALIDATED",
    structuralAnchorDependence:s(anchorLineage)==="D01_STRUCTURAL_EVENT_ANCHOR",
    volumeProfileSharesTradeRoots:hasProfile===true
  };
}

export function classifyContext({hasStructure,hasVwap,hasProfile,hasFreshBook,evaluable}={}){
  if(evaluable!==true) return "C6_CONTEXT_NOT_EVALUABLE";
  if(hasStructure&&hasVwap&&hasFreshBook) return "C5_STRUCTURE_VWAP_BOOK_COINCIDENT";
  if(hasStructure&&hasFreshBook) return "C4_STRUCTURE_BOOK_COINCIDENT";
  if(hasStructure&&hasProfile&&hasVwap) return "C3_STRUCTURE_PROFILE_VWAP_COINCIDENT";
  if(hasStructure&&hasVwap) return "C2_STRUCTURE_VWAP_COINCIDENT";
  if(!hasStructure&&hasVwap) return "C1_VWAP_REFERENCE_NONSTRUCTURAL";
  if(hasStructure) return "C0_STRUCTURAL_ONLY";
  return "C6_CONTEXT_NOT_EVALUABLE";
}
