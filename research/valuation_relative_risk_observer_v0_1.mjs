function finite(v){
  if(v===null||v===undefined||v==="") return null;
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}
function percentile(sortedValues,p){
  const values=Array.isArray(sortedValues)?sortedValues:[];
  if(!values.length) return null;
  if(values.length===1) return values[0];
  const pos=(values.length-1)*Math.min(100,Math.max(0,p))/100;
  const lo=Math.floor(pos),hi=Math.ceil(pos);
  if(lo===hi) return values[lo];
  const w=pos-lo;
  return values[lo]*(1-w)+values[hi]*w;
}
export function deployedInclusiveMedian(values=[]){
  const clean=values.map(finite).filter(v=>v!==null&&v>0).sort((a,b)=>a-b);
  return clean.length>=3?percentile(clean,50):null;
}
export function leaveOneOutMedianForAudit(values=[],candidatePe){
  const target=finite(candidatePe);
  const clean=values.map(finite).filter(v=>v!==null&&v>0).sort((a,b)=>a-b);
  if(target===null||target<=0) return null;
  const idx=clean.findIndex(v=>v===target);
  if(idx<0) return null;
  clean.splice(idx,1);
  return clean.length>=1?percentile(clean,50):null;
}

export function observeValuationRelativeRisk(feature={},{
  industryPositivePeValues=null
}={}){
  const pe=finite(feature.priceEarningsRatio);
  const pb=finite(feature.priceBookRatio);
  const deployedMedian=finite(feature.sectorMedianPe);
  const revQ=finite(feature.revenueQuarterYoY);
  const epsYoY=finite(feature.epsYoY);
  const valuationObserved=feature.valuationObserved===true;

  // Mirror deployed JS comparison semantics exactly for the decision bit.
  const formalPositivePe=feature.priceEarningsRatio>0;
  const formalPositiveMedian=feature.sectorMedianPe>0;
  const formalRelativePe=formalPositivePe&&formalPositiveMedian
    ? Number(feature.priceEarningsRatio)/Number(feature.sectorMedianPe)
    : null;
  const formalRevenueException=feature.revenueQuarterYoY>25;
  const formalEpsException=feature.epsYoY>25;
  const formalWouldReject=Boolean(
    formalPositivePe&&formalPositiveMedian&&formalRelativePe>2.5&&
    !(formalRevenueException||formalEpsException)
  );

  let evidenceState;
  if(!valuationObserved) evidenceState="UNKNOWN_VALUATION_SOURCE_NOT_OBSERVED";
  else if(pe===null||pe<=0) evidenceState="NOT_APPLICABLE_NO_POSITIVE_TTM_PE";
  else if(deployedMedian===null||deployedMedian<=0) evidenceState="UNKNOWN_POSITIVE_SECTOR_MEDIAN_NOT_DEFINED";
  else if(revQ===null) evidenceState="UNKNOWN_UPSTREAM_REVENUE_GROWTH_MISSING";
  else if(formalRelativePe<=2.5) evidenceState="PASS_RELATIVE_PE_WITHIN_BOUND";
  else if(revQ>25) evidenceState="PASS_REVENUE_GROWTH_EXCEPTION";
  else if(epsYoY!==null&&epsYoY>25) evidenceState="PASS_EPS_GROWTH_EXCEPTION";
  else if(epsYoY===null) evidenceState="FAIL_FORMAL_WITH_EPS_EXCEPTION_UNOBSERVED";
  else evidenceState="FAIL_FULLY_OBSERVED_NO_GROWTH_EXCEPTION";

  let constituentAudit=null;
  if(Array.isArray(industryPositivePeValues)){
    const inclusive=deployedInclusiveMedian(industryPositivePeValues);
    const loo=leaveOneOutMedianForAudit(industryPositivePeValues,pe);
    constituentAudit={
      suppliedPositivePeCount:industryPositivePeValues.map(finite).filter(v=>v!==null&&v>0).length,
      recomputedInclusiveMedian:inclusive,
      deployedMedian,
      deployedMedianMatchesSuppliedInclusive:inclusive!==null&&deployedMedian!==null?Math.abs(inclusive-deployedMedian)<1e-12:null,
      leaveOneOutMedian:loo,
      deployedUsesInclusiveSelf:true,
      leaveOneOutIsCounterfactualAuditOnly:true
    };
  }

  return {
    schemaVersion:"valuation-relative-risk-observer-v0.1",
    thresholds:{relativePe:2.5,growthExceptionPct:25},
    inputs:{
      valuationObserved,priceEarningsRatio:pe,priceBookRatio:pb,
      sectorMedianPe:deployedMedian,revenueQuarterYoY:revQ,epsYoY
    },
    formal:{
      positivePe:formalPositivePe,
      positiveSectorMedian:formalPositiveMedian,
      relativePe:formalRelativePe,
      revenueGrowthException:formalRevenueException,
      epsGrowthException:formalEpsException,
      wouldReject:formalWouldReject,
      exactReason:formalWouldReject?"本益比明顯高於族群但成長未配合，估值風險過高":null,
      missingEpsActsAsNoException:feature.epsYoY==null
    },
    evidence:{
      state:evidenceState,
      epsGrowthEvidenceObserved:epsYoY!==null,
      revenueGrowthEvidenceObserved:revQ!==null,
      valuationSourceObserved:valuationObserved,
      deployedMedianObserved:deployedMedian!==null
    },
    constituentAudit,
    guards:{
      deployedMedianIsAuthoritative:true,
      doNotReplaceWithLeaveOneOut:true,
      positivePeConstituentCountIncludesCandidateWhenPePositive:true,
      noOutcomeUse:true,
      formalCoreChanged:false
    }
  };
}
