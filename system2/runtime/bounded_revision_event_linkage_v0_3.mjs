import { deepFreeze } from "./factor_snapshot.mjs";

export const BOUNDED_REVISION_EVENT_LINKAGE_VERSION="0.3-RESEARCH";

function text(v){return v==null?"":String(v).trim();}
function versionKey(r){return [r?.date||"",r?.time||"",r?.seqNo||""].join("|");}
function isRevision(r){return r?.correctionOrCancellationHint===true || /更正|修正/.test(text(r?.rowText));}
function isCancellation(r){return /取消|撤銷|廢止/.test(text(r?.rowText));}
function isSubsidiaryDisclosure(r){return /代(?:重要)?子公司|子公司/.test(text(r?.rowText));}
function familyMatch(r,family){
  const t=text(r?.rowText);
  if(family==="CAPITAL_REDUCTION") return /減資/.test(t);
  if(family==="PAR_VALUE_CHANGE") return /股票面額變更|變更股票面額|每股面額變更|面額變更.*換發|換發.*股票面額/.test(t) && !/財務報告|合併財務|個體財務|每股盈餘|每股淨值/.test(t);
  return false;
}
function canonicalSubject(raw){
  return text(raw)
    .replace(/^\d+\s+\S+\s+\d{3}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}\s*/,"")
    .replace(/^\s*[\[【（(]?(?:更正[^\]】）)]*|修正)[\]】）)]?[-：:、\s]*/g,"")
    .replace(/(?:\(|（|\[|【)(?:更正|修正)[^\)）\]】]*(?:\)|）|\]|】)/g,"")
    .replace(/公告本公司|本公司|公告/g,"")
    .replace(/[\s()（）\[\]【】:：,，。；;、\-_/]/g,"")
    .trim();
}
function eventDateTokens(iso){
  const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(text(iso));
  if(!m) return [];
  const y=Number(m[1]),mo=Number(m[2]),d=Number(m[3]),roc=y-1911;
  return [
    `${y}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`,
    `${y}/${mo}/${d}`,
    `${y}年${mo}月${d}日`,
    `${roc}/${mo}/${d}`,
    `${roc}年${mo}月${d}日`,
    `${roc}${String(mo).padStart(2,"0")}${String(d).padStart(2,"0")}`,
  ];
}
function hasEventDateAnchor(r,effectiveDate){
  const t=text(r?.rowText).replace(/\s/g,"");
  return eventDateTokens(effectiveDate).some(x=>t.includes(x.replace(/\s/g,"")));
}

export function classifyBoundedRevisionEventLinkageV0_3({
  event,
  familyRows=[],
  perSymbolQueryIntegrity={},
}={}){
  if(!event||typeof event!=="object") throw new Error("event is required");
  const family=text(event.family);
  const effectiveDate=text(event.effectiveDate);
  const exactQueryIntegrity=perSymbolQueryIntegrity.exactKeysetReconciliation===true;

  const rows=(Array.isArray(familyRows)?familyRows:[])
    .filter(r=>r?.date && r.date<=effectiveDate)
    .map(r=>({
      ...r,
      canonicalStem:canonicalSubject(r.rowText),
      issuerScopeEligible:!isSubsidiaryDisclosure(r),
      familyEligible:familyMatch(r,family),
      eventDateAnchor:hasEventDateAnchor(r,effectiveDate),
    }))
    .sort((a,b)=>versionKey(a).localeCompare(versionKey(b)));

  const anchored=rows.filter(r=>r.issuerScopeEligible&&r.familyEligible&&r.eventDateAnchor);
  const groups=new Map();
  for(const r of anchored){
    const key=r.canonicalStem||"__EMPTY__";
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(r);
  }

  const candidates=[...groups.entries()].map(([stem,rs])=>{
    const originals=rs.filter(r=>!isRevision(r)&&!isCancellation(r));
    const revisions=rs.filter(isRevision);
    const cancellations=rs.filter(isCancellation);
    const distinctVersionKeyCount=new Set(rs.map(versionKey)).size;
    return {
      stem,
      rowCount:rs.length,
      originalCount:originals.length,
      revisionCount:revisions.length,
      cancellationCount:cancellations.length,
      distinctVersionKeyCount,
      hasRevisionChain:originals.length>=1&&revisions.length>=1&&distinctVersionKeyCount>=2,
      hasCancellationChain:originals.length>=1&&cancellations.length>=1&&distinctVersionKeyCount>=2,
      versionKeys:rs.map(versionKey),
    };
  });

  let state="AMBIGUOUS_NO_EVENT_SPECIFIC_ANCHOR";
  let selected=null;
  if(!exactQueryIntegrity){
    state="PER_SYMBOL_QUERY_INTEGRITY_NOT_CERTIFIED";
  }else if(candidates.length===1){
    selected=candidates[0];
    if(selected.hasCancellationChain) state="EVENT_ANCHORED_CANCELLATION_CHAIN_OBSERVED";
    else if(selected.hasRevisionChain) state="EVENT_ANCHORED_REVISION_CHAIN_OBSERVED";
    else if(selected.distinctVersionKeyCount===1) state="EVENT_ANCHORED_SINGLE_VERSION_OBSERVED";
    else state="EVENT_ANCHORED_MULTI_VERSION_UNRESOLVED";
  }else if(candidates.length>1){
    state="AMBIGUOUS_MULTIPLE_EVENT_ANCHORED_GROUPS";
  }

  return deepFreeze({
    schemaVersion:"S2_BOUNDED_REVISION_EVENT_LINKAGE_V0_3",
    version:BOUNDED_REVISION_EVENT_LINKAGE_VERSION,
    eventKey:event.eventKey||null,
    sourceId:event.sourceId||null,
    symbol:event.symbol||null,
    effectiveDate,
    family,
    state,
    perSymbolQueryIntegrityCertified:exactQueryIntegrity,
    eligibleFamilyRowCount:rows.filter(r=>r.issuerScopeEligible&&r.familyEligible).length,
    eventAnchoredRowCount:anchored.length,
    eventAnchoredGroupCount:candidates.length,
    selectedStem:selected?.stem||null,
    selectedVersionKeys:Object.freeze(selected?.versionKeys||[]),
    candidateGroups:Object.freeze(candidates.map(x=>deepFreeze({
      stem:x.stem,rowCount:x.rowCount,originalCount:x.originalCount,
      revisionCount:x.revisionCount,cancellationCount:x.cancellationCount,
      distinctVersionKeyCount:x.distinctVersionKeyCount,
      hasRevisionChain:x.hasRevisionChain,hasCancellationChain:x.hasCancellationChain,
    }))),
    eventLinkageCoverageComplete:false,
    boundedRevisionHistoryCoverageComplete:false,
    correctionHistoryComplete:false,
    cancellationHistoryComplete:false,
    knownAtVersionClockCertified:false,
    revisionCoverageComplete:false,
    technicalContinuityCertified:false,
    tradingAuthority:false,
  });
}

export function summarizeBoundedRevisionEventLinkageV0_3(rows=[]){
  if(!Array.isArray(rows)) throw new Error("rows must be array");
  const stateCounts={};
  for(const r of rows) stateCounts[r.state]=(stateCounts[r.state]||0)+1;
  return deepFreeze({
    schemaVersion:"S2_BOUNDED_REVISION_EVENT_LINKAGE_SUMMARY_V0_3",
    eventCount:rows.length,
    stateCounts:deepFreeze(stateCounts),
    queryIntegrityCertifiedCount:rows.filter(r=>r.perSymbolQueryIntegrityCertified).length,
    eventAnchoredCount:rows.filter(r=>r.eventAnchoredRowCount>0).length,
    eventLinkageCoverageComplete:false,
    boundedRevisionHistoryCoverageComplete:false,
    correctionHistoryComplete:false,
    cancellationHistoryComplete:false,
    knownAtVersionClockCertified:false,
    revisionCoverageComplete:false,
    technicalContinuityCertified:false,
    tradingAuthority:false,
  });
}
