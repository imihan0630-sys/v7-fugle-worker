import { deepFreeze } from "./factor_snapshot.mjs";

export const S2_07_SYMBOL_SESSION_INTEGRATION_VERSION="0.8-RESEARCH";

function text(v){return v==null?"":String(v).trim();}
function validDate(v){return /^\d{4}-\d{2}-\d{2}$/.test(text(v));}
function uniqSorted(values=[]){return [...new Set((Array.isArray(values)?values:[]).map(String).filter(Boolean))].sort();}
function inSuspension(date,interval){
  if(date<interval.suspendedFrom)return false;
  return interval.resumedOn?date<interval.resumedOn:date<=interval.coverageTo;
}
function normalizeInterval(row){
  if(!row||typeof row!=="object")return null;
  const market=text(row.market);
  const symbol=text(row.symbol);
  const suspendedFrom=text(row.suspendedFrom);
  const resumedOn=row.resumedOn?text(row.resumedOn):null;
  const coverageTo=text(row.coverageTo||resumedOn||suspendedFrom);
  if(!["TWSE","TPEX"].includes(market)||!/^[1-9][0-9]{3}$/.test(symbol)||!validDate(suspendedFrom))return null;
  if(resumedOn&&!validDate(resumedOn))return null;
  if(!validDate(coverageTo))return null;
  return deepFreeze({
    market,symbol,suspendedFrom,resumedOn,coverageTo,
    sourceId:text(row.sourceId)||null,
    sourceContractId:text(row.sourceContractId)||null,
    sourceRowHash:text(row.sourceRowHash)||null,
    sourceArtifactHash:text(row.sourceArtifactHash)||null,
    sourceCoverageState:text(row.sourceCoverageState)||"UNKNOWN",
  });
}

export function evaluateSymbolSessionIntegrationV0_8({
  event,
  promotion,
  marketSessions=[],
  suspensionIntervals=[],
}={}){
  if(!event||typeof event!=="object")throw new Error("event is required");
  const market=text(event.market);
  const symbol=text(event.symbol);
  const family=text(event.family);
  const effectiveDate=text(event.effectiveDate);
  if(!["TWSE","TPEX"].includes(market))throw new Error("event.market must be TWSE or TPEX");
  if(!/^[1-9][0-9]{3}$/.test(symbol))throw new Error("event.symbol must be four digits");
  if(!validDate(effectiveDate))throw new Error("event.effectiveDate must be YYYY-MM-DD");
  const sessions=uniqSorted(marketSessions);
  if(!sessions.every(validDate))throw new Error("marketSessions must contain YYYY-MM-DD dates");

  const normalizedIntervals=(Array.isArray(suspensionIntervals)?suspensionIntervals:[])
    .map(normalizeInterval).filter(Boolean)
    .filter(x=>x.market===market&&x.symbol===symbol);

  const exactResumeMatches=normalizedIntervals.filter(x=>x.resumedOn===effectiveDate);
  const resumeDateObserved=exactResumeMatches.length===1;
  const ambiguousResumeMatch=exactResumeMatches.length>1;
  const matchedInterval=resumeDateObserved?exactResumeMatches[0]:null;
  const effectiveDateIsMarketSession=sessions.includes(effectiveDate);
  const suspendedMarketSessions=matchedInterval
    ?sessions.filter(d=>inSuspension(d,matchedInterval))
    :[];
  const expectedSymbolSessions=matchedInterval
    ?sessions.filter(d=>!inSuspension(d,matchedInterval))
    :sessions;

  const promotionReady=promotion?.state==="PROMOTION_EVIDENCE_READY_BOUNDED"
    || promotion?.promotionEvidenceReady===true
    || promotion?.promotionLinkageEstablished===true;

  const blockers=[];
  if(!promotionReady)blockers.push("EVENT_LINKAGE_PROMOTION_NOT_READY");
  if(ambiguousResumeMatch)blockers.push("AMBIGUOUS_SUSPENSION_RESUME_MATCH");
  else if(!resumeDateObserved)blockers.push("SUSPENSION_RESUMPTION_MATCH_NOT_OBSERVED");
  if(resumeDateObserved&&!effectiveDateIsMarketSession)blockers.push("RESUME_MARKET_SESSION_NOT_VERIFIED");
  if(matchedInterval&&!matchedInterval.sourceRowHash&&!matchedInterval.sourceArtifactHash){
    blockers.push("SUSPENSION_SOURCE_PROVENANCE_MISSING");
  }

  const boundedSymbolSessionEvidenceReady=blockers.length===0;
  const state=boundedSymbolSessionEvidenceReady
    ?"BOUNDED_SYMBOL_SESSION_EVIDENCE_READY"
    :blockers.includes("AMBIGUOUS_SUSPENSION_RESUME_MATCH")
      ?"AMBIGUOUS_SYMBOL_SESSION_EVIDENCE"
      :"SYMBOL_SESSION_EVIDENCE_BLOCKED";

  return deepFreeze({
    schemaVersion:"S2_S2_07_SYMBOL_SESSION_INTEGRATION_V0_8",
    version:S2_07_SYMBOL_SESSION_INTEGRATION_VERSION,
    market,symbol,family:family||null,effectiveDate,
    promotionState:promotion?.state||null,
    promotionEvidenceReady:promotionReady,
    state,
    blockers:Object.freeze(blockers),
    resumeDateObserved,
    effectiveDateIsMarketSession,
    suspensionMatchCount:exactResumeMatches.length,
    matchedSuspensionInterval:matchedInterval,
    suspendedMarketSessions:Object.freeze(suspendedMarketSessions),
    expectedSymbolSessions:Object.freeze(expectedSymbolSessions),
    boundedSymbolSessionEvidenceReady,
    noSuspensionMayBeClaimed:false,
    suspensionCoverageComplete:false,
    symbolSessionCompletenessCertified:false,
    technicalContinuityCertified:false,
    continuityTransformPerformed:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}

export function summarizeSymbolSessionIntegrationV0_8(rows=[]){
  if(!Array.isArray(rows))throw new Error("rows must be array");
  const blockerCounts={};
  for(const row of rows){
    for(const blocker of row?.blockers||[]) blockerCounts[blocker]=(blockerCounts[blocker]||0)+1;
  }
  return deepFreeze({
    schemaVersion:"S2_S2_07_SYMBOL_SESSION_INTEGRATION_SUMMARY_V0_8",
    eventCount:rows.length,
    boundedSymbolSessionEvidenceReadyCount:rows.filter(x=>x?.boundedSymbolSessionEvidenceReady===true).length,
    blockedCount:rows.filter(x=>x?.boundedSymbolSessionEvidenceReady!==true).length,
    resumeDateObservedCount:rows.filter(x=>x?.resumeDateObserved===true).length,
    promotionReadyCount:rows.filter(x=>x?.promotionEvidenceReady===true).length,
    blockerCounts:deepFreeze(blockerCounts),
    noSuspensionCertifiedCount:0,
    suspensionCoverageComplete:false,
    symbolSessionCompletenessCertified:false,
    technicalContinuityCertified:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}
