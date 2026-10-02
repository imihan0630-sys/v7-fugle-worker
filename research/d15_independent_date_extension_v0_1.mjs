// D15 independent-date extension classifier v0.1 — research-only.
// Classifies plan/journal dates for whether they can identify cross-name portfolio-allocation geometry.
// No trading behavior or Formal Core impact.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function s(v){return String(v??"").trim()}

export function classifyD15PlanDate({scanDate,selectedCount,planRows=[],dayStatus}={}){
  const date=s(scanDate),count=n(selectedCount),rows=Array.isArray(planRows)?planRows:[];
  if(!date||!Number.isInteger(count)||count<0){
    return {status:"UNKNOWN",eligible:false,reason:"INVALID_DATE_OR_SELECTED_COUNT"};
  }
  if(rows.length!==count){
    return {status:"PLAN_COUNT_MISMATCH",eligible:false,scanDate:date,selectedCount:count,planRows:rows.length};
  }
  if(count===0){
    return {status:"ZERO_SELECTED_NONIDENTIFYING",eligible:false,scanDate:date,selectedCount:0,dayStatus:s(dayStatus)};
  }
  if(count===1){
    return {status:"SINGLE_NAME_NONIDENTIFYING",eligible:false,scanDate:date,selectedCount:1,dayStatus:s(dayStatus)};
  }
  return {status:"MULTI_NAME_IDENTIFYING",eligible:true,scanDate:date,selectedCount:count,dayStatus:s(dayStatus)};
}

export function summarizeIndependentDates(classifications=[],{baselineDate="2026-09-18"}={}){
  const rows=Array.isArray(classifications)?classifications:[];
  const multi=rows.filter(x=>x?.status==="MULTI_NAME_IDENTIFYING");
  const newMulti=multi.filter(x=>String(x.scanDate)>baselineDate);
  return {
    recordedDates:rows.length,
    zeroSelectedDates:rows.filter(x=>x?.status==="ZERO_SELECTED_NONIDENTIFYING").length,
    singleNameDates:rows.filter(x=>x?.status==="SINGLE_NAME_NONIDENTIFYING").length,
    multiNameDates:multi.length,
    newMultiNameDatesAfterBaseline:newMulti.length,
    multiNameDateList:multi.map(x=>x.scanDate).sort(),
    newMultiNameDateList:newMulti.map(x=>x.scanDate).sort(),
    countMismatchDates:rows.filter(x=>x?.status==="PLAN_COUNT_MISMATCH").map(x=>x.scanDate).filter(Boolean).sort(),
    crossDateReadiness:newMulti.length>=1
      ?"ADDITIONAL_MULTI_NAME_DATE_AVAILABLE"
      :"NO_NEW_MULTI_NAME_DATE"
  };
}
