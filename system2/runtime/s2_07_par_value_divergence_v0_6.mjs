import { deepFreeze } from "./factor_snapshot.mjs";

export const S2_07_PAR_VALUE_DIVERGENCE_VERSION="0.6-RESEARCH";

function text(v){return v==null?"":String(v).trim();}

export function classifyParValueMonthOnlyRowV0_6({row,officialDetailDateTokens=[]}={}){
  if(!row||typeof row!=="object") throw new Error("row is required");
  const t=text(row.rowText);
  const dates=Array.isArray(officialDetailDateTokens)?officialDetailDateTokens:[];
  const stopDate=dates.length?dates[0]:null;
  let state="UNCLASSIFIED_MONTH_ONLY_ACTION_FAMILY_ROW";
  if(/公告期間/.test(t)&&/股票面額.*變更|變更.*股票面額/.test(t)){
    state="MONTH_ONLY_RECURRING_NOTICE_COPY";
  }else if(stopDate&&row.date===stopDate&&/股票面額.*變更|變更.*股票面額/.test(t)){
    state="MONTH_ONLY_STOP_DATE_FACE_VALUE_NOTICE";
  }
  return deepFreeze({
    state,
    key:[row.date||"",row.time||"",row.seqNo||""].join("|"),
    date:row.date||null,
    stopDate,
    rowText:row.rowText||null,
    sourceSemanticsCertified:false,
    mayBeDiscardedFromHistory:false,
  });
}

export function classifyCancellationEvidenceV0_6(rows=[]){
  if(!Array.isArray(rows)) throw new Error("rows must be array");
  const cancellationRows=rows.filter(r=>/取消|撤銷|廢止/.test(text(r?.rowText)));
  return deepFreeze({
    state:cancellationRows.length
      ?"CANCELLATION_DISCLOSURE_OBSERVED"
      :"CANCELLATION_DISCLOSURE_NOT_OBSERVED_HISTORY_INCOMPLETE",
    observedCount:cancellationRows.length,
    observedKeys:Object.freeze(cancellationRows.map(r=>[r.date||"",r.time||"",r.seqNo||""].join("|"))),
    noCancellationMayBeClaimed:false,
    cancellationHistoryComplete:false,
  });
}
