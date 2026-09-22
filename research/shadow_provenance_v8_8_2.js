// Research-only Shadow provenance diagnostics.
// Isolation rule: this file does not participate in formal selection, monitoring,
// notification, capital allocation, or existing counterfactual outcome calculation.

function finiteResearchNumber(value) {
  if(value===null || value===undefined || value==="") return null;
  const n=Number(value);
  return Number.isFinite(n)?n:null;
}

export function parseShadowSnapshot(snapshotJson) {
  try {
    const snapshot=JSON.parse(snapshotJson||"{}");
    return {snapshot,snapshotStatus:"SNAPSHOT_PARSE_OK"};
  } catch(_) {
    return {snapshot:{},snapshotStatus:"SNAPSHOT_PARSE_ERROR"};
  }
}

export function parseShadowHistory(historyRow) {
  if(!historyRow) return {bars:[],historyStatus:"HISTORY_ROW_MISSING"};
  let parsed;
  try { parsed=JSON.parse(historyRow.history_json||"[]"); }
  catch(_) { return {bars:[],historyStatus:"HISTORY_PARSE_ERROR"}; }
  if(!Array.isArray(parsed) || parsed.length===0) return {bars:[],historyStatus:"HISTORY_EMPTY"};
  return {bars:parsed,historyStatus:"HISTORY_OK"};
}

export function shadowHistoryObservation(scanDate,bars) {
  const date=String(scanDate||"").slice(0,10);
  const post=(Array.isArray(bars)?bars:[])
    .filter(bar=>String(bar?.date||"").slice(0,10)>date && finiteResearchNumber(bar?.close)!==null)
    .sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  return {
    postScanValidBars:post.length,
    historyLastDate:post.length?String(post.at(-1)?.date||"").slice(0,10):null
  };
}

export function shadowHorizonProvenance({snapshotStatus,baselineClose,historyStatus,postScanValidBars,outcome},horizon) {
  const h=Math.max(1,Number(horizon)||1);
  if(Number.isFinite(outcome?.returnPct)) return "OUTCOME_AVAILABLE";
  if(snapshotStatus==="SNAPSHOT_PARSE_ERROR") return "SNAPSHOT_PARSE_ERROR";
  if(!(finiteResearchNumber(baselineClose)>0)) return "BASELINE_UNAVAILABLE";
  if(historyStatus==="HISTORY_ROW_MISSING") return "HISTORY_ROW_MISSING";
  if(historyStatus==="HISTORY_PARSE_ERROR") return "HISTORY_PARSE_ERROR";
  if(historyStatus==="HISTORY_EMPTY") return "HISTORY_EMPTY";
  if(historyStatus==="HISTORY_OK" && Number(postScanValidBars)<h) return "OBSERVED_HISTORY_INSUFFICIENT";
  return "UNKNOWN";
}

export function buildShadowProvenanceDiagnostic({row,historyRow,outcome}) {
  const parsedSnapshot=parseShadowSnapshot(row?.snapshot_json);
  const baselineClose=finiteResearchNumber(parsedSnapshot.snapshot?.price?.close);
  const parsedHistory=parseShadowHistory(historyRow);
  const observation=shadowHistoryObservation(row?.scan_date,parsedHistory.bars);
  const horizons={};
  for(const h of [1,3,5,10,20]) {
    horizons["d"+h]=shadowHorizonProvenance({
      snapshotStatus:parsedSnapshot.snapshotStatus,
      baselineClose,
      historyStatus:parsedHistory.historyStatus,
      postScanValidBars:observation.postScanValidBars,
      outcome:outcome?.horizons?.["d"+h]
    },h);
  }
  return {
    scanDate:String(row?.scan_date||"").slice(0,10),
    symbol:String(row?.symbol||""),
    snapshotStatus:parsedSnapshot.snapshotStatus,
    baselineStatus:baselineClose>0?"BASELINE_CLOSE_OK":"BASELINE_CLOSE_MISSING",
    historyStatus:parsedHistory.historyStatus,
    historyLastDate:observation.historyLastDate,
    postScanValidBars:observation.postScanValidBars,
    calendarMaturity:"UNKNOWN",
    horizons
  };
}

export function summarizeShadowProvenance(rows) {
  const counts={snapshot:{},baseline:{},history:{},horizons:{}};
  for(const h of [1,3,5,10,20]) counts.horizons["d"+h]={};
  const bump=(bucket,key)=>bucket[key]=(bucket[key]||0)+1;
  for(const row of rows||[]) {
    bump(counts.snapshot,row.snapshotStatus||"UNKNOWN");
    bump(counts.baseline,row.baselineStatus||"UNKNOWN");
    bump(counts.history,row.historyStatus||"UNKNOWN");
    for(const h of [1,3,5,10,20]) bump(counts.horizons["d"+h],row.horizons?.["d"+h]||"UNKNOWN");
  }
  return {researchOnly:true,decisionImpact:false,calendarMaturity:"UNKNOWN",counts};
}
