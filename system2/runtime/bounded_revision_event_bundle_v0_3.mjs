import { deepFreeze } from "./factor_snapshot.mjs";

export const BOUNDED_REVISION_EVENT_BUNDLE_VERSION="0.3-RESEARCH";

function text(v){return v==null?"":String(v).trim();}
function versionKey(r){return [r?.date||"",r?.time||"",r?.seqNo||""].join("|");}

function subjectFromRow(row){
  return text(row?.rowText)
    .replace(/^\d+\s+\S+\s+\d{3}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}\s*/,"")
    .trim();
}

function delegatedSubsidiary(subject){
  return /^(?:代重要子公司|代子公司)/.test(text(subject));
}

function isCancellation(subject){
  return /取消|撤銷|廢止/.test(text(subject));
}

function isExplicitCorrection(row,subject){
  return row?.correctionOrCancellationHint===true || /更正|修正/.test(text(subject));
}

function isSemanticAmendment(subject){
  const s=text(subject);
  if(/更新|更改|補充說明|補充公告|調整/.test(s)) return true;
  if(/(?:變更|改訂).*(?:減資.*(?:換股|換發)|股票面額變更.*(?:換股|換發)|(?:換股|換發).*(?:基準日|作業計畫|作業計劃))/.test(s)
    && !/變更登記完成/.test(s)) return true;
  return false;
}

function normalizedStem(subject){
  return text(subject)
    .replace(/^[\[【（(]?(?:更正|修正)[^\]】）)]*[\]】）)]?\s*/,"")
    .replace(/^(?:更正|修正|更新|更改|補充說明|補充公告|調整)\s*/,"")
    .replace(/^\d{7,8}\s*/,"")
    .replace(/公告本公司|本公司|公告/g,"")
    .replace(/[\s()（）\[\]【】:：,，。；;、\-_/「」『』]/g,"")
    .trim();
}

function stageFor(family,subject){
  const s=text(subject);
  if(family==="CAPITAL_REDUCTION"){
    if(/公司債|停止轉換/.test(s)) return "SECURITY_SIDE_EFFECT";
    if(/庫藏股/.test(s)) return "TREASURY_STOCK_REDUCTION";
    if(
      /減資.*(?:換股|換發).*(?:基準日|作業計畫|作業計劃|相關事宜|核准)/.test(s) ||
      /(?:換股|換發股票|換發有價證券).*(?:基準日|作業計畫|作業計劃)/.test(s)
    ) return "OPERATIONAL_PLAN";
    if(/(?:減資|資本額|實收資本額).*(?:變更登記|登記完成)|(?:變更登記|登記完成).*(?:減資|資本額|實收資本額)/.test(s)) return "REGISTRATION";
    if(/減資基準日/.test(s)) return "BASE_DATE";
    if(/(?:董事會|股東會|股東常會).*(?:減資)/.test(s)) return "DECISION";
    if(/減資.*債權人/.test(s)) return "CREDITOR_NOTICE";
    return "OTHER_ACTION";
  }
  if(family==="PAR_VALUE_CHANGE"){
    if(
      /(?:股票面額變更|面額變更).*(?:換發|換股).*(?:基準日|作業計畫|作業計劃)/.test(s) ||
      /(?:換發股票|換股).*(?:基準日|作業計畫|作業計劃)/.test(s)
    ) return "OPERATIONAL_PLAN";
    if(/(?:股票面額|每股面額|面額變更).*(?:變更登記|登記完成)|(?:變更登記|登記完成).*(?:股票面額|每股面額)/.test(s)) return "REGISTRATION";
    if(/股票面額變更相關事宜/.test(s)) return "MARKET_NOTICE";
    if(/(?:董事會|股東會|股東常會).*(?:股票面額變更|面額變更)/.test(s)) return "DECISION";
    return "OTHER_ACTION";
  }
  return "OTHER_ACTION";
}

function rowView(row,family){
  const subject=subjectFromRow(row);
  const stage=stageFor(family,subject);
  const cancellation=isCancellation(subject);
  const explicitCorrection=isExplicitCorrection(row,subject);
  const semanticAmendment=!cancellation && !explicitCorrection && isSemanticAmendment(subject);
  return {
    ...row,
    subject,
    normalizedStem:normalizedStem(subject),
    stage,
    delegatedSubsidiary:delegatedSubsidiary(subject),
    cancellation,
    explicitCorrection,
    semanticAmendment,
    amendment:cancellation||explicitCorrection||semanticAmendment,
  };
}

function inCycle(row,event,historyStartDate){
  if(!row?.date) return false;
  const upper=text(event.effectiveDate);
  const previous=text(event.previousEffectiveDate);
  const lower=text(historyStartDate);
  if(row.date>upper) return false;
  if(previous) return row.date>previous;
  if(lower) return row.date>=lower;
  return true;
}

function primaryOwnIssuerRows(rows,event){
  const officialSubtype=text(event.officialSubtype);
  const allowTreasury=/庫藏股/.test(officialSubtype);
  return rows.filter(r=>{
    if(r.delegatedSubsidiary) return false;
    if(r.stage==="SECURITY_SIDE_EFFECT") return false;
    if(r.stage==="TREASURY_STOCK_REDUCTION" && !allowTreasury) return false;
    return true;
  });
}

function anchorStage(stage){
  return stage==="OPERATIONAL_PLAN" || stage==="REGISTRATION" || stage==="BASE_DATE";
}

export function classifyBoundedRevisionEventBundleV0_3({
  event,
  familyRows=[],
  queryIntegrity={},
  historyStartDate="2025-01-01",
}={}){
  if(!event||typeof event!=="object") throw new Error("event is required");
  const family=text(event.actionFamilyId||event.family);
  if(!["CAPITAL_REDUCTION","PAR_VALUE_CHANGE"].includes(family)) throw new Error("supported event action family is required");

  const cycleRows=(Array.isArray(familyRows)?familyRows:[])
    .filter(r=>inCycle(r,event,historyStartDate))
    .map(r=>rowView(r,family))
    .sort((a,b)=>versionKey(a).localeCompare(versionKey(b)));

  const ownRows=primaryOwnIssuerRows(cycleRows,event);
  const anchors=ownRows.filter(r=>anchorStage(r.stage));
  const cancellations=ownRows.filter(r=>r.cancellation);
  const amendments=ownRows.filter(r=>r.amendment&&!r.cancellation);
  const explicitCorrections=amendments.filter(r=>r.explicitCorrection);
  const semanticAmendments=amendments.filter(r=>r.semanticAmendment);

  const originals=ownRows.filter(r=>!r.amendment);
  const originalStems=new Set(originals.map(r=>r.normalizedStem).filter(Boolean));
  const pairedAmendments=amendments.filter(r=>originalStems.has(r.normalizedStem));

  const exactQueryIntegrity=
    queryIntegrity.exactKeysetReconciliation===true &&
    queryIntegrity.noPaginationHint===true &&
    queryIntegrity.transportReady===true &&
    queryIntegrity.parserComplete===true;

  let state;
  if(cancellations.length>0 && anchors.length>0){
    state="EVENT_BUNDLE_CANCELLATION_OBSERVED";
  }else if(amendments.length>0 && anchors.length>0){
    state="EVENT_BUNDLE_AMENDMENT_OBSERVED";
  }else if(anchors.length>0 && exactQueryIntegrity){
    state="EVENT_BUNDLE_NO_REVISION_OR_CANCELLATION_QUERY_CERTIFIED";
  }else if(!exactQueryIntegrity){
    state="QUERY_INTEGRITY_NOT_CERTIFIED";
  }else if(ownRows.length>0){
    state="EVENT_BUNDLE_OPERATIONAL_ANCHOR_NOT_ESTABLISHED";
  }else{
    state="NO_OWN_ISSUER_ACTION_ROWS_IN_EVENT_CYCLE";
  }

  const stageCounts={};
  for(const row of ownRows) stageCounts[row.stage]=(stageCounts[row.stage]||0)+1;

  return deepFreeze({
    schemaVersion:"S2_BOUNDED_REVISION_EVENT_BUNDLE_V0_3",
    version:BOUNDED_REVISION_EVENT_BUNDLE_VERSION,
    eventKey:event.eventKey||null,
    sourceId:event.sourceId||null,
    symbol:event.symbol||null,
    actionFamilyId:family,
    effectiveDate:event.effectiveDate||null,
    previousEffectiveDate:event.previousEffectiveDate||null,
    officialSubtype:event.officialSubtype||null,
    historyStartDate,
    state,
    exactQueryIntegrity,
    queryIntegrity:deepFreeze({
      transportReady:queryIntegrity.transportReady===true,
      parserComplete:queryIntegrity.parserComplete===true,
      noPaginationHint:queryIntegrity.noPaginationHint===true,
      exactKeysetReconciliation:queryIntegrity.exactKeysetReconciliation===true,
      years:Object.freeze([...(queryIntegrity.years||[])]),
    }),
    cycleFamilyRowCount:cycleRows.length,
    ownIssuerRowCount:ownRows.length,
    delegatedSubsidiaryExcludedCount:cycleRows.filter(r=>r.delegatedSubsidiary).length,
    operationalAnchorCount:anchors.length,
    cancellationRowCount:cancellations.length,
    amendmentRowCount:amendments.length,
    explicitCorrectionRowCount:explicitCorrections.length,
    semanticAmendmentRowCount:semanticAmendments.length,
    pairedAmendmentCount:pairedAmendments.length,
    stageCounts:deepFreeze(stageCounts),
    amendmentVersionKeys:Object.freeze(amendments.map(versionKey)),
    cancellationVersionKeys:Object.freeze(cancellations.map(versionKey)),
    ownIssuerRows:Object.freeze(ownRows.map(r=>deepFreeze({
      date:r.date||null,time:r.time||null,seqNo:r.seqNo||null,
      subject:r.subject,normalizedStem:r.normalizedStem,stage:r.stage,
      explicitCorrection:r.explicitCorrection,
      semanticAmendment:r.semanticAmendment,
      cancellation:r.cancellation,
    }))),

    boundedRevisionHistoryCoverageComplete:false,
    correctionHistoryComplete:false,
    cancellationHistoryComplete:false,
    knownAtVersionClockCertified:false,
    revisionCoverageComplete:false,
  });
}

export function summarizeBoundedRevisionEventBundlesV0_3(rows=[]){
  if(!Array.isArray(rows)) throw new Error("rows must be array");
  const resolvedStates=new Set([
    "EVENT_BUNDLE_CANCELLATION_OBSERVED",
    "EVENT_BUNDLE_AMENDMENT_OBSERVED",
    "EVENT_BUNDLE_NO_REVISION_OR_CANCELLATION_QUERY_CERTIFIED",
  ]);
  const stateCounts={};
  for(const row of rows) stateCounts[row.state]=(stateCounts[row.state]||0)+1;
  const resolvedCount=rows.filter(r=>resolvedStates.has(r.state)).length;
  const exactQueryIntegrityCount=rows.filter(r=>r.exactQueryIntegrity===true).length;

  const byLane=new Map();
  for(const row of rows){
    if(!byLane.has(row.sourceId)) byLane.set(row.sourceId,[]);
    byLane.get(row.sourceId).push(row);
  }
  const laneResults=[...byLane.entries()].sort(([a],[b])=>String(a).localeCompare(String(b))).map(([sourceId,events])=>{
    const resolved=events.filter(r=>resolvedStates.has(r.state)).length;
    const exact=events.filter(r=>r.exactQueryIntegrity===true).length;
    return deepFreeze({
      sourceId,
      eventCount:events.length,
      resolvedEventCount:resolved,
      exactQueryIntegrityEventCount:exact,
      amendmentObservedEventCount:events.filter(r=>r.state==="EVENT_BUNDLE_AMENDMENT_OBSERVED").length,
      cancellationObservedEventCount:events.filter(r=>r.state==="EVENT_BUNDLE_CANCELLATION_OBSERVED").length,
      noRevisionCertifiedEventCount:events.filter(r=>r.state==="EVENT_BUNDLE_NO_REVISION_OR_CANCELLATION_QUERY_CERTIFIED").length,
      eventBundleLinkageComplete:events.length>0&&resolved===events.length,
      issuerCorrectionSearchCoverageComplete:events.length>0&&resolved===events.length&&exact===events.length,
      issuerCancellationSearchCoverageComplete:events.length>0&&resolved===events.length&&exact===events.length,
    });
  });

  const allResolved=rows.length>0&&resolvedCount===rows.length;
  const allExact=rows.length>0&&exactQueryIntegrityCount===rows.length;

  return deepFreeze({
    schemaVersion:"S2_BOUNDED_REVISION_EVENT_BUNDLE_SUMMARY_V0_3",
    version:BOUNDED_REVISION_EVENT_BUNDLE_VERSION,
    eventCount:rows.length,
    stateCounts:deepFreeze(stateCounts),
    resolvedCount,
    unresolvedCount:rows.length-resolvedCount,
    exactQueryIntegrityCount,
    eventBundleLinkageCoverageComplete:allResolved,
    lowVolumeIssuerCorrectionSearchCoverageComplete:allResolved&&allExact,
    lowVolumeIssuerCancellationSearchCoverageComplete:allResolved&&allExact,
    laneResults:Object.freeze(laneResults),

    // These remain global/system-wide gates and are intentionally not promoted
    // by low-volume issuer-side query completeness alone.
    boundedRevisionHistoryCoverageComplete:false,
    correctionHistoryComplete:false,
    cancellationHistoryComplete:false,
    publicAvailabilityLatencyCertified:false,
    knownAtVersionClockCertified:false,
    authorityRevisionCoverageComplete:false,
    revisionCoverageComplete:false,
    noEventMayBeClaimed:false,
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
