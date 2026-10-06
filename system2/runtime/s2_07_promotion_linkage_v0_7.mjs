import { deepFreeze } from "./factor_snapshot.mjs";

export const S2_07_PROMOTION_LINKAGE_VERSION="0.7-RESEARCH";

function text(v){return v==null?"":String(v).trim();}
function validIsoDate(v){return /^\d{4}-\d{2}-\d{2}$/.test(text(v));}
function officialEventVersionId(eventKey){
  const token=text(eventKey).split("|").at(-1)||"";
  return /^S2-CA-EVENT:[0-9a-f]{64}$/.test(token)?token:null;
}
function sortedUniqueStrings(values=[]){
  return [...new Set((Array.isArray(values)?values:[]).filter(Boolean).map(String))].sort();
}

export function evaluatePromotionLinkageV0_7(diag={}){
  if(!diag||typeof diag!=="object") throw new Error("diag is required");
  const sourceId=text(diag.sourceId);
  const symbol=text(diag.symbol);
  const family=text(diag.family);
  const effectiveDate=text(diag.effectiveDate);
  const eventKey=text(diag.eventKey);
  const eventVersionId=officialEventVersionId(eventKey);
  const detailDates=sortedUniqueStrings(diag.officialDetailDateTokens);
  const alignedKeys=sortedUniqueStrings(diag.semanticAlignedVersionKeys);
  const correctionKeys=sortedUniqueStrings(diag.correctionObservedVersionKeys);
  const identityReady=
    Boolean(sourceId)&&Boolean(symbol)&&validIsoDate(effectiveDate)&&Boolean(eventVersionId)&&
    eventKey=== [sourceId,symbol,effectiveDate,eventVersionId].join("|");
  const detailChronologyReady=
    detailDates.length>0 &&
    detailDates.every(validIsoDate) &&
    detailDates.every(d=>d<=effectiveDate);
  const alignedChronologyReady=
    alignedKeys.length>0 &&
    alignedKeys.every(k=>validIsoDate(k.slice(0,10))) &&
    alignedKeys.every(k=>k.slice(0,10)<=effectiveDate);
  const alignedEpisodeReady=
    Number(diag.semanticAlignedRowCount)>0 &&
    alignedKeys.length===Number(diag.semanticAlignedRowCount) &&
    alignedChronologyReady;
  const familyEpisodeReady=family==="CAPITAL_REDUCTION"
    ?(["RETURN_CAPITAL","LOSS_OFFSET"].includes(text(diag.officialSubtypeSemantic)) &&
      Boolean(diag.semanticSeedVersionKey) &&
      validIsoDate(diag.semanticSeedDate) &&
      diag.semanticSeedDate<=effectiveDate)
    :family==="PAR_VALUE_CHANGE"
      ? alignedEpisodeReady
      : false;
  const correctionContained=
    correctionKeys.every(k=>alignedKeys.includes(k));
  const cancellationObserved=diag.cancellationObserved===true;

  const blockers=[];
  if(diag.transportReady!==true) blockers.push("TRANSPORT_NOT_READY");
  if(diag.noPaginationHint!==true) blockers.push("PAGINATION_NOT_CERTIFIED");
  if(diag.actionFamilyQueryIntegrityExact!==true) blockers.push("SOURCE_QUERY_INTEGRITY_NOT_EXACT");
  if(diag.eventSpecificAnchorCandidate!==true) blockers.push("EVENT_SPECIFIC_ANCHOR_NOT_ESTABLISHED");
  if(!identityReady) blockers.push("OFFICIAL_EVENT_IDENTITY_NOT_CERTIFIED");
  if(!detailChronologyReady) blockers.push("OFFICIAL_DETAIL_CHRONOLOGY_NOT_CERTIFIED");
  if(!alignedEpisodeReady||!familyEpisodeReady) blockers.push("SEMANTIC_EPISODE_NOT_CERTIFIED");
  if(!correctionContained) blockers.push("CORRECTION_OUTSIDE_SEMANTIC_EPISODE");
  if(cancellationObserved) blockers.push("CANCELLATION_DISCLOSURE_OBSERVED");

  const promotionEvidenceReady=blockers.length===0;
  const state=promotionEvidenceReady
    ?"PROMOTION_EVIDENCE_READY_BOUNDED"
    :"PROMOTION_EVIDENCE_BLOCKED";

  return deepFreeze({
    schemaVersion:"S2_S2_07_PROMOTION_LINKAGE_EVALUATION_V0_7",
    version:S2_07_PROMOTION_LINKAGE_VERSION,
    eventKey:eventKey||null,
    sourceId:sourceId||null,
    symbol:symbol||null,
    family:family||null,
    effectiveDate:effectiveDate||null,
    officialEventVersionId:eventVersionId,
    state,
    blockers:Object.freeze(blockers),
    identityReady,
    detailChronologyReady,
    alignedChronologyReady,
    alignedEpisodeReady,
    familyEpisodeReady,
    correctionContained,
    cancellationState:cancellationObserved
      ?"CANCELLATION_DISCLOSURE_OBSERVED"
      :"CANCELLATION_DISCLOSURE_NOT_OBSERVED_HISTORY_INCOMPLETE",
    promotionEvidenceReady,
    promotionLinkageEstablished:promotionEvidenceReady,
    noCancellationMayBeClaimed:false,
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

export function summarizePromotionLinkageV0_7(rows=[]){
  if(!Array.isArray(rows)) throw new Error("rows must be array");
  const blockerCounts={};
  for(const row of rows){
    for(const blocker of row?.blockers||[]) blockerCounts[blocker]=(blockerCounts[blocker]||0)+1;
  }
  return deepFreeze({
    schemaVersion:"S2_S2_07_PROMOTION_LINKAGE_SUMMARY_V0_7",
    eventCount:rows.length,
    promotionEvidenceReadyCount:rows.filter(r=>r?.promotionEvidenceReady===true).length,
    promotionEvidenceBlockedCount:rows.filter(r=>r?.promotionEvidenceReady!==true).length,
    promotionLinkageEstablishedCount:rows.filter(r=>r?.promotionLinkageEstablished===true).length,
    cancellationObservedCount:rows.filter(r=>r?.cancellationState==="CANCELLATION_DISCLOSURE_OBSERVED").length,
    noCancellationCertifiedCount:0,
    blockerCounts:deepFreeze(blockerCounts),
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
