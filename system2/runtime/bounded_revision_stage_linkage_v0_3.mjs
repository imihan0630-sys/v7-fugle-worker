import { deepFreeze } from "./factor_snapshot.mjs";

export const BOUNDED_REVISION_STAGE_LINKAGE_VERSION="0.3-RESEARCH";
const LOOKBACK_DAYS=210;

function text(v){return v==null?"":String(v).trim();}
function versionKey(r){return [r?.date||"",r?.time||"",r?.seqNo||""].join("|");}
function isRevision(r){return r?.correctionOrCancellationHint===true || /更正|修正/.test(text(r?.rowText));}
function isCancellation(r){return /取消|撤銷|廢止/.test(text(r?.rowText));}
function daysBetween(a,b){return Math.round((Date.parse(b+"T00:00:00Z")-Date.parse(a+"T00:00:00Z"))/86400000);}
function normalize(raw){
  return text(raw)
    .replace(/^\d+\s+\S+\s+\d{3}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}\s*/,"")
    .replace(/^[（(]?(?:更正|修正)[）)]?[-：:、\s]*/g,"")
    .replace(/(?:\(|（)(?:更正|修正)[^\)）]*(?:\)|）)/g,"")
    .replace(/公告本公司|本公司|公告/g,"")
    .replace(/[\s()（）:：,，。；;、\-_/]/g,"")
    .trim();
}
function stageEligible(eventStage,row){
  const t=text(row?.rowText);
  if(!t) return false;
  if(/代子公司/.test(t)) return false;
  if(eventStage==="ACTUAL_CAPITAL_REDUCTION_RESUME_REFERENCE"){
    if(/庫藏股|註銷庫藏/.test(t)) return false;
    return /減資/.test(t) && /(換發|換股|停止買賣|恢復買賣|新股上市|作業計畫|基準日)/.test(t);
  }
  if(eventStage==="ACTUAL_PAR_VALUE_CHANGE_RESUME_REFERENCE"){
    return /(面額|每股面額|股票面額)/.test(t) && /(換發|停止買賣|恢復買賣|新股上市|作業計畫|基準日|變更)/.test(t);
  }
  return false;
}

export function classifyBoundedRevisionStageLinkageV0_3({event,familyRows=[],queryEvidence={}}={}){
  if(!event||typeof event!=="object") throw new Error("event is required");
  const effectiveDate=text(event.effectiveDate);
  const eligible=(Array.isArray(familyRows)?familyRows:[])
    .filter(r=>r?.date && r.date<=effectiveDate)
    .filter(r=>daysBetween(r.date,effectiveDate)>=0 && daysBetween(r.date,effectiveDate)<=LOOKBACK_DAYS)
    .filter(r=>stageEligible(event.eventStage,r))
    .map(r=>({...r,stem:normalize(r.rowText)}))
    .sort((a,b)=>versionKey(a).localeCompare(versionKey(b)));

  const groups=new Map();
  for(const r of eligible){
    if(!groups.has(r.stem)) groups.set(r.stem,[]);
    groups.get(r.stem).push(r);
  }
  const grouped=[...groups.entries()].map(([stem,rows])=>({
    stem,rows,
    originalCount:rows.filter(r=>!isRevision(r)&&!isCancellation(r)).length,
    revisionCount:rows.filter(isRevision).length,
    cancellationCount:rows.filter(isCancellation).length,
    distinctVersionKeyCount:new Set(rows.map(versionKey)).size,
    latestDate:rows.map(r=>r.date).sort().at(-1)||null,
  })).sort((a,b)=>(b.latestDate||"").localeCompare(a.latestDate||""));

  const queryIntegritySupported=
    queryEvidence.transportReady===true &&
    queryEvidence.parserComplete===true &&
    queryEvidence.noPaginationHint===true &&
    Number(queryEvidence.maxYearRowCount)>=0 &&
    Number(queryEvidence.maxYearRowCount)<=391;

  const revisionGroups=grouped.filter(g=>g.originalCount>=1&&g.revisionCount>=1&&g.distinctVersionKeyCount>=2);
  const cancellationGroups=grouped.filter(g=>g.originalCount>=1&&g.cancellationCount>=1&&g.distinctVersionKeyCount>=2);

  let state;
  if(cancellationGroups.length>=1) state="STAGE_LINKED_CANCELLATION_CHAIN_OBSERVED";
  else if(revisionGroups.length>=1) state="STAGE_LINKED_REVISION_CHAIN_OBSERVED";
  else if(grouped.length>=1 && queryIntegritySupported) state="STAGE_LINKED_NO_REVISION_HINT_QUERY_SUPPORTED";
  else if(grouped.length>=1) state="STAGE_LINKED_QUERY_INTEGRITY_NOT_SUPPORTED";
  else state="NO_STAGE_LINKED_ISSUER_ROWS";

  return deepFreeze({
    schemaVersion:"S2_BOUNDED_REVISION_STAGE_LINKAGE_V0_3",
    version:BOUNDED_REVISION_STAGE_LINKAGE_VERSION,
    eventKey:event.eventKey||null,sourceId:event.sourceId||null,symbol:event.symbol||null,
    effectiveDate,eventStage:event.eventStage||null,lookbackDays:LOOKBACK_DAYS,state,
    queryIntegritySupported,stageLinkedGroupCount:grouped.length,
    revisionGroupCount:revisionGroups.length,cancellationGroupCount:cancellationGroups.length,
    stageLinkedVersionKeys:Object.freeze(eligible.map(versionKey)),
    groups:Object.freeze(grouped.map(g=>deepFreeze({
      stem:g.stem,rowCount:g.rows.length,originalCount:g.originalCount,
      revisionCount:g.revisionCount,cancellationCount:g.cancellationCount,
      distinctVersionKeyCount:g.distinctVersionKeyCount,latestDate:g.latestDate,
    }))),
    boundedRevisionHistoryCoverageComplete:false,correctionHistoryComplete:false,
    cancellationHistoryComplete:false,knownAtVersionClockCertified:false,revisionCoverageComplete:false,
  });
}

export function summarizeBoundedRevisionStageLinkageV0_3(rows=[]){
  const counts={};for(const r of rows) counts[r.state]=(counts[r.state]||0)+1;
  const unresolved=rows.filter(r=>["STAGE_LINKED_QUERY_INTEGRITY_NOT_SUPPORTED","NO_STAGE_LINKED_ISSUER_ROWS"].includes(r.state));
  return deepFreeze({
    schemaVersion:"S2_BOUNDED_REVISION_STAGE_LINKAGE_SUMMARY_V0_3",
    eventCount:rows.length,stateCounts:deepFreeze(counts),
    stageLinkageResolvedCount:rows.length-unresolved.length,unresolvedCount:unresolved.length,
    stageLinkageCoverageComplete:rows.length>0&&unresolved.length===0,
    boundedRevisionHistoryCoverageComplete:false,correctionHistoryComplete:false,
    cancellationHistoryComplete:false,knownAtVersionClockCertified:false,revisionCoverageComplete:false,
  });
}
