// D01 DL-040 sector/industry composition firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function uniq(xs=[]){return [...new Set((xs||[]).map(String).filter(Boolean))].sort();}

export function validateClassificationReceipt({
  receipt,
  predictorFreezeAt
}={}){
  if(!receipt||receipt.verified!==true)
    return {status:"DATA_BLOCKED",reason:"CLASSIFICATION_RECEIPT_UNVERIFIED"};

  const knownAt=str(receipt.knownAt);
  const freeze=str(predictorFreezeAt);
  if(!knownAt||!freeze)
    return {status:"UNKNOWN",reason:"CLASSIFICATION_CLOCK_INCOMPLETE"};

  if(knownAt>freeze)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"CLASSIFICATION_KNOWN_AFTER_FREEZE"};

  if(receipt.currentClassificationBackfilled===true)
    return {status:"PROHIBITED",reason:"CURRENT_CLASSIFICATION_BACKFILL"};

  if(receipt.outcomeSelectedTaxonomy===true)
    return {status:"PROHIBITED",reason:"OUTCOME_SELECTED_TAXONOMY"};

  if(!str(receipt.sectorTaxonomyId)||!str(receipt.classificationLevel)||!str(receipt.classificationVersion))
    return {status:"UNKNOWN",reason:"CLASSIFICATION_VERSION_INCOMPLETE"};

  return {
    status:"VALID",
    sectorId:str(receipt.sectorId)||null,
    classificationState:str(receipt.classificationState)||"UNCLASSIFIED_UNKNOWN"
  };
}

export function buildLeaveOneOutSectorContext({
  candidateSymbol,
  members=[]
}={}){
  const symbol=str(candidateSymbol);
  if(!symbol) return {status:"UNKNOWN",reason:"CANDIDATE_SYMBOL_MISSING"};

  const valid=(members||[]).filter(r=>r&&str(r.symbol)&&finite(r.returnValue));
  const peers=valid.filter(r=>str(r.symbol)!==symbol);

  if(!peers.length)
    return {
      status:"LOO_SECTOR_CONTEXT_UNAVAILABLE",
      reason:"NO_VALID_PEERS_AFTER_EXCLUSION",
      fullMemberCount:valid.length,
      peerCount:0
    };

  const avg=peers.reduce((s,r)=>s+r.returnValue,0)/peers.length;
  const adv=peers.filter(r=>r.returnValue>0).length;
  const dec=peers.filter(r=>r.returnValue<0).length;

  return {
    status:"VALID",
    candidateExcluded:true,
    peerCount:peers.length,
    sectorReturnExCandidate:avg,
    sectorBreadthExCandidate:(adv+dec)>0?adv/(adv+dec):null,
    independentConfirmationAssigned:false
  };
}

export function summarizeSectorComposition(rows=[]){
  const valid=(rows||[]).filter(r=>r&&r.targetUniverseEligible===true);
  if(!valid.length) return {status:"UNKNOWN",reason:"ROWS_EMPTY"};

  const classified=valid.filter(r=>str(r.classificationState)==="CLASSIFIED"&&str(r.sectorId));
  const unclassified=valid.length-classified.length;

  const opportunities=classified.filter(r=>r.opportunityReady===true);
  const bySector=new Map();
  for(const r of opportunities){
    const s=str(r.sectorId);
    bySector.set(s,(bySector.get(s)||0)+1);
  }
  const vals=[...bySector.values()].sort((a,b)=>b-a);
  const total=vals.reduce((a,b)=>a+b,0);

  return {
    status:"VALID",
    targetEligibleCount:valid.length,
    classifiedCount:classified.length,
    unclassifiedCount:unclassified,
    classificationUnknownRate:valid.length?unclassified/valid.length:null,
    uniqueSectorCount:uniq(classified.map(r=>r.sectorId)).length,
    opportunityCount:total,
    top1SectorOpportunityShare:total&&vals.length?vals[0]/total:null,
    top3SectorOpportunityShare:total?vals.slice(0,3).reduce((a,b)=>a+b,0)/total:null,
    sectorOpportunityHHI:total?vals.reduce((s,n)=>s+(n/total)**2,0):null,
    genericPatternClaimAssigned:false
  };
}

export function classifySelfInclusion({
  candidateIncludedInSectorReturn,
  candidateIncludedInSectorBreadth,
  leaveOneOutVerified
}={}){
  if(candidateIncludedInSectorReturn===true||candidateIncludedInSectorBreadth===true){
    if(leaveOneOutVerified!==true)
      return {
        status:"SELF_INCLUSION_UNRESOLVED",
        independentConfirmationAllowed:false
      };
  }

  return {
    status:"SELF_INCLUSION_CONTROLLED",
    independentConfirmationAllowed:false
  };
}

export function classifySectorCommonSupport({
  sizeLiquidityOverlap,
  listingAgeOverlap,
  priceTickOverlap,
  marketOverlap,
  regimeOverlap,
  sectorContextOverlap
}={}){
  const checks={sizeLiquidityOverlap,listingAgeOverlap,priceTickOverlap,marketOverlap,regimeOverlap,sectorContextOverlap};
  if(Object.values(checks).some(v=>v===false))
    return {status:"CROSS_SECTOR_EXTRAPOLATION_PROHIBITED",checks};
  if(Object.values(checks).some(v=>v!==true))
    return {status:"UNKNOWN",checks};
  return {status:"COMMON_SUPPORT_VALID",checks};
}

export function summarizeSectorReplication(rows=[]){
  const valid=(rows||[]).filter(r=>r&&str(r.sectorId)&&str(r.marketDate));
  const stockObservations=valid.length;
  const uniqueSymbols=uniq(valid.map(r=>r.symbol)).length;
  const uniqueRoots=uniq(valid.map(r=>r.structuralRootId)).length;
  const uniqueSectors=uniq(valid.map(r=>r.sectorId)).length;
  const sectorDateClusters=uniq(valid.map(r=>`${r.marketDate}|${r.sectorId}`)).length;
  const marketDateClusters=uniq(valid.map(r=>r.marketDate)).length;

  return {
    status:"VALID",
    stockObservationCount:stockObservations,
    uniqueSymbolCount:uniqueSymbols,
    uniqueStructuralRootCount:uniqueRoots,
    uniqueSectorCount:uniqueSectors,
    independentSectorDateClusterCount:sectorDateClusters,
    marketDateClusterCount:marketDateClusters,
    stockRowsEqualIndependentSectorReplications:false
  };
}

export function classifyPatternClaim({
  classificationReady,
  leaveOneOutReady,
  withinSectorIncrement,
  crossSectorReplicated,
  onlyOneSectorSupported
}={}){
  if(classificationReady!==true)
    return {status:"C6_NOT_EVALUABLE",claimScope:"UNKNOWN"};

  if(onlyOneSectorSupported===true)
    return {status:"C4_SECTOR_SPECIFIC_PATTERN",claimScope:"SECTOR_SPECIFIC"};

  if(withinSectorIncrement!==true)
    return {status:"C0_TO_C2_SECTOR_EXPLANATION_NOT_REJECTED",claimScope:"NOT_GENERIC"};

  if(crossSectorReplicated===true&&leaveOneOutReady===true)
    return {status:"C5_CROSS_SECTOR_PATTERN_CANDIDATE",claimScope:"CROSS_SECTOR_RESEARCH_CANDIDATE"};

  return {status:"C3_WITHIN_SECTOR_PATTERN_INCREMENT",claimScope:"WITHIN_SECTOR_ONLY"};
}
