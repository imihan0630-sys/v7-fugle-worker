import {
  inspectCanonicalFinancialEntry,
  inspectCanonicalValuationEntry
} from "./financial_source_completeness_readiness_observer_v0_1.mjs";

function num(v){
  if(v===null||v===undefined||v==="") return null;
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}
function truthyEvidence(v){
  if(v===null||v===undefined||v==="") return null;
  return Boolean(v);
}

export function inspectFormalMergedFinancialFields(row={}){
  const quarterRevenue=num(row.quarterRevenue);
  const financialBasis=truthyEvidence(row.financialBasis);
  const revenueQoQ=num(row.revenueQoQ);
  const revenueQuarterYoY=num(row.revenueQuarterYoY);
  const valuationObserved=row.valuationObserved===true;
  const priceBookRatio=num(row.priceBookRatio);
  const announcementsVerified=row.announcementsVerified===true;
  return {
    quarterRevenuePositive:quarterRevenue!==null&&quarterRevenue>0,
    financialBasisTruthy:financialBasis===true,
    revenueQoQObserved:revenueQoQ!==null,
    revenueQuarterYoYObserved:revenueQuarterYoY!==null,
    valuationObserved,
    priceBookRatioObserved:priceBookRatio!==null,
    announcementsVerified,
    complete:quarterRevenue!==null&&quarterRevenue>0&&financialBasis===true&&
      revenueQoQ!==null&&revenueQuarterYoY!==null&&valuationObserved&&
      priceBookRatio!==null&&announcementsVerified
  };
}

export function compareCanonicalSourceToFormalMerged({
  row={},
  financialEntry=null,
  valuationEntry=null,
  announcementsSourcesVerified=null
}={}){
  const financial=inspectCanonicalFinancialEntry(financialEntry);
  const valuation=inspectCanonicalValuationEntry(valuationEntry);
  const announcementGlobal=announcementsSourcesVerified===true;
  const sourceComplete=financial.complete&&valuation.complete&&announcementGlobal;
  const merged=inspectFormalMergedFinancialFields(row);
  let alignment;
  if(sourceComplete&&merged.complete) alignment="ALIGNED_COMPLETE";
  else if(!sourceComplete&&merged.complete) alignment="FORMAL_FIELD_PASS_WITH_CANONICAL_SOURCE_GAP";
  else if(sourceComplete&&!merged.complete) alignment="INVARIANT_VIOLATION_SOURCE_COMPLETE_FIELD_FAIL";
  else alignment="BOTH_INCOMPLETE";
  return {
    schemaVersion:"financial-source-merge-provenance-observer-v0.1",
    sourceComplete,
    mergedFormalFieldComplete:merged.complete,
    alignment,
    source:{
      financial,
      valuation,
      announcementsSourcesVerified:announcementGlobal
    },
    merged,
    interpretation:alignment==="FORMAL_FIELD_PASS_WITH_CANONICAL_SOURCE_GAP"
      ?"Merged Formal fields are complete although current canonical FINANCIAL/VALUATION source membership is incomplete. Alternate/custom/legacy pre-quality fields are feasible; live provenance is UNKNOWN without capture."
      : alignment==="INVARIANT_VIOLATION_SOURCE_COMPLETE_FIELD_FAIL"
        ?"Under the current overlay order, complete canonical source entries should populate the required merged fields. Treat as version/order/observer mismatch until proven otherwise."
        :"No source-versus-merged contradiction observed.",
    researchOnly:true,
    outcomeDataUsed:false,
    formalCoreImpact:false
  };
}
