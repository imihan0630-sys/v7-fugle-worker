import { deepFreeze } from "./factor_snapshot.mjs";

export const BOUNDED_REVISION_EVENT_LINKAGE_VERSION="0.2-RESEARCH";
export const HIGH_ROW_SOURCE_CONTRACT_MAX_VERIFIED_ROWS=391;

function text(v){return v==null?"":String(v).trim();}
function isRevision(row){return row?.correctionOrCancellationHint===true || /更正|修正/.test(text(row?.rowText));}
function isCancellation(row){return /取消|撤銷|廢止/.test(text(row?.rowText));}
function normalizeSubject(raw){
  return text(raw)
    .replace(/^\d+\s+\S+\s+\d{3}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}\s*/,"")
    .replace(/^[（(]?(?:更正|修正)[）)]?[-：:、\s]*/g,"")
    .replace(/(?:\(|（)(?:更正|修正)[^\)）]*(?:\)|）)/g,"")
    .replace(/公告本公司|本公司|公告/g,"")
    .replace(/[\s()（）:：,，。；;、\-_/]/g,"")
    .trim();
}
function versionKey(r){return [r?.date||"",r?.time||"",r?.seqNo||""].join("|");}

export function classifyBoundedRevisionEventLinkageV0_2({
  event,
  familyRows=[],
  queryEvidence={},
}={}){
  if(!event||typeof event!=="object") throw new Error("event is required");
  const effectiveDate=text(event.effectiveDate);
  const rows=(Array.isArray(familyRows)?familyRows:[])
    .filter(r=>r?.date && r.date<=effectiveDate)
    .map(r=>({...r,normalizedStem:normalizeSubject(r.rowText)}))
    .sort((a,b)=>versionKey(a).localeCompare(versionKey(b)));

  const groups=new Map();
  for(const r of rows){
    const key=r.normalizedStem||"__EMPTY__";
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(r);
  }
  const candidates=[...groups.entries()].map(([stem,rs])=>{
    const originals=rs.filter(r=>!isRevision(r)&&!isCancellation(r));
    const revisions=rs.filter(isRevision);
    const cancellations=rs.filter(isCancellation);
    return {
      stem,
      rowCount:rs.length,
      originalCount:originals.length,
      revisionCount:revisions.length,
      cancellationCount:cancellations.length,
      distinctVersionKeyCount:new Set(rs.map(versionKey)).size,
      latestDate:rs.map(r=>r.date).sort().at(-1)||null,
      rows:rs,
      hasRevisionChain:originals.length>=1&&revisions.length>=1&&new Set(rs.map(versionKey)).size>=2,
      hasCancellationChain:originals.length>=1&&cancellations.length>=1&&new Set(rs.map(versionKey)).size>=2,
    };
  }).sort((a,b)=>(b.latestDate||"").localeCompare(a.latestDate||"")||b.rowCount-a.rowCount);

  const revisionChains=candidates.filter(x=>x.hasRevisionChain);
  const cancellationChains=candidates.filter(x=>x.hasCancellationChain);
  const queryIntegritySupported=
    queryEvidence.transportReady===true &&
    queryEvidence.parserComplete===true &&
    queryEvidence.noPaginationHint===true &&
    Number(queryEvidence.maxYearRowCount)>=0 &&
    Number(queryEvidence.maxYearRowCount)<=HIGH_ROW_SOURCE_CONTRACT_MAX_VERIFIED_ROWS;

  let state;
  let selected=null;
  if(cancellationChains.length===1){
    state="CANCELLATION_CHAIN_OBSERVED";
    selected=cancellationChains[0];
  }else if(revisionChains.length===1){
    state="REVISION_CHAIN_OBSERVED";
    selected=revisionChains[0];
  }else if(revisionChains.length>1||cancellationChains.length>1){
    state="AMBIGUOUS_MULTIPLE_VERSION_CHAINS";
  }else if(candidates.length===1 && candidates[0].distinctVersionKeyCount===1 && queryIntegritySupported){
    state="SINGLE_VERSION_NO_REVISION_HINT_QUERY_SUPPORTED";
    selected=candidates[0];
  }else if(candidates.length>=1 && queryIntegritySupported){
    state="AMBIGUOUS_MULTIPLE_ACTION_GROUPS";
  }else if(candidates.length>=1){
    state="QUERY_INTEGRITY_NOT_SUPPORTED";
  }else{
    state="NO_PRE_EFFECTIVE_ACTION_FAMILY_ROWS";
  }

  return deepFreeze({
    schemaVersion:"S2_BOUNDED_REVISION_EVENT_LINKAGE_V0_2",
    version:BOUNDED_REVISION_EVENT_LINKAGE_VERSION,
    eventKey:event.eventKey||null,
    sourceId:event.sourceId||null,
    symbol:event.symbol||null,
    effectiveDate,
    state,
    queryIntegritySupported,
    candidateGroupCount:candidates.length,
    revisionChainCount:revisionChains.length,
    cancellationChainCount:cancellationChains.length,
    selectedStem:selected?.stem||null,
    selectedVersionKeys:Object.freeze((selected?.rows||[]).map(versionKey)),
    groups:Object.freeze(candidates.map(x=>deepFreeze({
      stem:x.stem,rowCount:x.rowCount,originalCount:x.originalCount,
      revisionCount:x.revisionCount,cancellationCount:x.cancellationCount,
      distinctVersionKeyCount:x.distinctVersionKeyCount,latestDate:x.latestDate,
      hasRevisionChain:x.hasRevisionChain,hasCancellationChain:x.hasCancellationChain,
    }))),
    boundedRevisionHistoryCoverageComplete:false,
    correctionHistoryComplete:false,
    cancellationHistoryComplete:false,
    knownAtVersionClockCertified:false,
    revisionCoverageComplete:false,
  });
}

export function summarizeBoundedRevisionEventLinkageV0_2(rows=[]){
  if(!Array.isArray(rows)) throw new Error("rows must be array");
  const counts={};
  for(const r of rows) counts[r.state]=(counts[r.state]||0)+1;
  const resolvedStates=new Set([
    "REVISION_CHAIN_OBSERVED",
    "CANCELLATION_CHAIN_OBSERVED",
    "SINGLE_VERSION_NO_REVISION_HINT_QUERY_SUPPORTED",
  ]);
  const resolvedCount=rows.filter(r=>resolvedStates.has(r.state)).length;
  const ambiguousCount=rows.length-resolvedCount;
  return deepFreeze({
    schemaVersion:"S2_BOUNDED_REVISION_EVENT_LINKAGE_SUMMARY_V0_2",
    eventCount:rows.length,
    stateCounts:deepFreeze(counts),
    resolvedCount,
    ambiguousCount,
    eventLinkageCoverageComplete:rows.length>0&&resolvedCount===rows.length,
    boundedRevisionHistoryCoverageComplete:false,
    correctionHistoryComplete:false,
    cancellationHistoryComplete:false,
    knownAtVersionClockCertified:false,
    revisionCoverageComplete:false,
  });
}
