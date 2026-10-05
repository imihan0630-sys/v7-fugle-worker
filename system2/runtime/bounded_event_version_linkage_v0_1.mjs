import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { LOW_VOLUME_REVISION_LANES_V0_1 } from "./bounded_revision_history_census_v0_1.mjs";

export const BOUNDED_EVENT_VERSION_LINKAGE_VERSION = "0.1-RESEARCH";

function requiredText(value, field){
  if(typeof value!=="string"||!value.trim()) throw new Error(field+" is required");
  return value.trim();
}

function isoDate(value, field){
  const text=requiredText(value,field);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field+" must be YYYY-MM-DD");
  const d=new Date(text+"T00:00:00.000Z");
  if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==text) throw new Error(field+" invalid");
  return text;
}

function toIsoDate(year, month, day){
  const y=Number(year),m=Number(month),d=Number(day);
  if(!Number.isInteger(y)||!Number.isInteger(m)||!Number.isInteger(d)) return null;
  const iso=String(y).padStart(4,"0")+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0");
  const parsed=new Date(iso+"T00:00:00.000Z");
  return Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===iso ? iso : null;
}

export function extractDateTokensV0_1(value){
  const text=String(value||"");
  const out=new Set();
  for(const m of text.matchAll(/(?<!\d)(\d{3})(?!\d)\s*[年\/.-]\s*(\d{1,2})\s*[月\/.-]\s*(\d{1,2})\s*日?/g)){
    const iso=toIsoDate(Number(m[1])+1911,m[2],m[3]);
    if(iso) out.add(iso);
  }
  for(const m of text.matchAll(/(?<!\d)(\d{4})(?!\d)\s*[\/.-]\s*(\d{1,2})\s*[\/.-]\s*(\d{1,2})/g)){
    const iso=toIsoDate(m[1],m[2],m[3]);
    if(iso) out.add(iso);
  }
  return Object.freeze([...out].sort());
}

function canonicalSubject(value, symbol){
  let text=String(value||"");
  const symbolText=String(symbol||"");
  if(symbolText) text=text.split(symbolText).join(" ");
  return text
    .replace(/(?<!\d)\d{3}(?!\d)\s*[年\/.-]\s*\d{1,2}\s*[月\/.-]\s*\d{1,2}\s*日?/g," ")
    .replace(/(?<!\d)\d{4}(?!\d)\s*[\/.-]\s*\d{1,2}\s*[\/.-]\s*\d{1,2}/g," ")
    .replace(/\b\d{2}:\d{2}:\d{2}\b/g," ")
    .replace(/更正|修正|補充|更新|重新公告|取消|撤銷|廢止/g," ")
    .replace(/[()（）【】\[\]：:，,。．;；、_\-\s]+/g,"")
    .trim();
}

function isCancellation(row){
  return /取消|撤銷|廢止/.test(String(row?.rowText||""));
}

function eventKey(sourceId,event){
  return [sourceId,event.symbol,event.effectiveDate,event.eventVersionId||""].join("|");
}

function historyKey(symbol){
  return String(symbol||"").trim();
}

function rowVersionKey(row){
  const date=typeof row?.date==="string" ? row.date : "";
  const time=typeof row?.time==="string" ? row.time : "";
  const seq=typeof row?.seqNo==="string" ? row.seqNo : "";
  return [date,time,seq].join("|");
}

function queryIntegrityForHistory(history, expectedYears){
  const queried=[...(history?.queriedYears||[])].map(Number).filter(Number.isInteger).sort((a,b)=>a-b);
  const payloads=Array.isArray(history?.payloads) ? history.payloads : [];
  const payloadByYear=new Map();
  for(const p of payloads){
    const year=Number(p?.year);
    if(!Number.isInteger(year)) continue;
    if(!payloadByYear.has(year)) payloadByYear.set(year,[]);
    payloadByYear.get(year).push(p);
  }
  const expected=[...expectedYears].map(Number).sort((a,b)=>a-b);
  const expectedYearsQueried=expected.every((year)=>queried.includes(year));
  const perYear=expected.map((year)=>{
    const rows=payloadByYear.get(year)||[];
    const successful=rows.filter((p)=>p?.ok===true&&Number(p?.httpStatus)===200);
    return deepFreeze({
      year,
      payloadObservationCount:rows.length,
      successfulPayloadCount:successful.length,
      complete:rows.length===1&&successful.length===1,
    });
  });
  const complete=
    history?.transportReady===true &&
    expectedYearsQueried &&
    Number(history?.payloadCount)===expected.length &&
    perYear.every((x)=>x.complete);
  return deepFreeze({
    state:complete ? "QUERY_INTEGRITY_COMPLETE" : "QUERY_INTEGRITY_INCOMPLETE",
    expectedYears:Object.freeze(expected),
    queriedYears:Object.freeze(queried),
    transportReady:history?.transportReady===true,
    expectedYearsQueried,
    payloadCount:Number(history?.payloadCount||0),
    perYear:Object.freeze(perYear),
    complete,
  });
}

async function buildRowEvidence(row, symbol, effectiveDate){
  const rowText=String(row?.rowText||"");
  const listMentionedDates=extractDateTokensV0_1(rowText);
  const announcementDate=typeof row?.date==="string" ? row.date : null;
  const listExplicitEffectiveDateMention=
    listMentionedDates.includes(effectiveDate) &&
    announcementDate!==effectiveDate;
  const listAmbiguousSameDateMention=
    listMentionedDates.includes(effectiveDate) &&
    announcementDate===effectiveDate;

  const detailBodyDateTokens=Object.freeze(
    Array.isArray(row?.detailBodyDateTokens)
      ? [...new Set(row.detailBodyDateTokens.filter((x)=>typeof x==="string"))].sort()
      : []
  );
  const detailTransportReady=row?.detailTransportReady===true;
  const detailIdentityObserved=row?.detailIdentityObserved===true;
  const detailBodyTextHash=typeof row?.detailBodyTextHash==="string"&&row.detailBodyTextHash
    ? row.detailBodyTextHash
    : null;
  const detailPayloadHash=typeof row?.detailPayloadHash==="string"&&row.detailPayloadHash
    ? row.detailPayloadHash
    : null;
  const detailEvidenceReady=
    detailTransportReady &&
    detailIdentityObserved &&
    Boolean(detailBodyTextHash) &&
    Boolean(detailPayloadHash);
  const detailEffectiveDateMention=
    detailEvidenceReady &&
    detailBodyDateTokens.includes(effectiveDate);

  const subject=canonicalSubject(rowText,symbol);
  const subjectFingerprintHash=await sha256Hex(subject);
  const rowTextHash=await sha256Hex(rowText);
  const versionKey=rowVersionKey(row);
  const versionKeyComplete=Boolean(row?.date&&row?.time&&row?.seqNo);

  return deepFreeze({
    date:announcementDate,
    time:row?.time||null,
    seqNo:row?.seqNo||null,
    spokeDateRaw:row?.spokeDateRaw||null,
    spokeTimeRaw:row?.spokeTimeRaw||null,
    correctionOrCancellationHint:row?.correctionOrCancellationHint===true,
    cancellationHint:isCancellation(row),
    listMentionedDates,
    listExplicitEffectiveDateMention,
    listAmbiguousSameDateMention,
    detailTransportReady,
    detailIdentityObserved,
    detailEvidenceReady,
    detailBodyDateTokens,
    detailBodyTextHash,
    detailPayloadHash,
    detailTransportMode:typeof row?.detailTransportMode==="string" ? row.detailTransportMode : null,
    detailEffectiveDateMention,
    versionKey,
    versionKeyComplete,
    subjectFingerprintHash,
    rowTextHash,
  });
}

function summarizeChains(rows){
  const groups=new Map();
  for(const row of rows){
    if(!groups.has(row.subjectFingerprintHash)) groups.set(row.subjectFingerprintHash,[]);
    groups.get(row.subjectFingerprintHash).push(row);
  }
  const chains=[];
  for(const [subjectFingerprintHash,raw] of groups.entries()){
    const sorted=[...raw].sort((a,b)=>{
      const ka=[a.date||"",a.time||"",a.seqNo||""].join("|");
      const kb=[b.date||"",b.time||"",b.seqNo||""].join("|");
      return ka.localeCompare(kb);
    });
    const keys=sorted.map((x)=>x.versionKey);
    const duplicateVersionKeyCount=keys.length-new Set(keys).size;
    const originalCount=sorted.filter((x)=>!x.correctionOrCancellationHint).length;
    const revisionHintCount=sorted.filter((x)=>x.correctionOrCancellationHint).length;
    const cancellationHintCount=sorted.filter((x)=>x.cancellationHint).length;
    const versionKeyComplete=sorted.every((x)=>x.versionKeyComplete);
    const state=!versionKeyComplete
      ? "VERSION_KEY_INCOMPLETE"
      : duplicateVersionKeyCount>0
        ? "DUPLICATE_VERSION_KEY"
        : revisionHintCount>0&&originalCount===0
          ? "REVISION_WITHOUT_ORIGINAL_IN_QUERY"
          : "CHAIN_OBSERVED";
    chains.push(deepFreeze({
      subjectFingerprintHash,
      state,
      rowCount:sorted.length,
      originalCount,
      revisionHintCount,
      cancellationHintCount,
      versionKeyComplete,
      duplicateVersionKeyCount,
      versionKeys:Object.freeze(keys),
      rowTextHashes:Object.freeze(sorted.map((x)=>x.rowTextHash)),
      detailBodyTextHashes:Object.freeze(sorted.map((x)=>x.detailBodyTextHash).filter(Boolean)),
      detailPayloadHashes:Object.freeze(sorted.map((x)=>x.detailPayloadHash).filter(Boolean)),
    }));
  }
  return Object.freeze(chains.sort((a,b)=>a.subjectFingerprintHash.localeCompare(b.subjectFingerprintHash)));
}

export async function buildBoundedEventVersionLinkageV0_1({
  startDate,
  endDate,
  laneEvents = {},
  issuerHistories = {},
  expectedQueryYears = [2025,2026],
  generatedAt = new Date().toISOString(),
} = {}){
  const start=isoDate(startDate,"startDate");
  const end=isoDate(endDate,"endDate");
  if(end<start) throw new Error("endDate cannot be earlier than startDate");
  if(!laneEvents||typeof laneEvents!=="object"||Array.isArray(laneEvents)) throw new Error("laneEvents must be object");
  if(!issuerHistories||typeof issuerHistories!=="object"||Array.isArray(issuerHistories)) throw new Error("issuerHistories must be object");
  if(!Array.isArray(expectedQueryYears)||!expectedQueryYears.length) throw new Error("expectedQueryYears required");
  if(!Number.isFinite(Date.parse(generatedAt))) throw new Error("generatedAt must be ISO");

  const laneResults=[];
  const universe=[];

  for(const [sourceId,contract] of Object.entries(LOW_VOLUME_REVISION_LANES_V0_1)){
    const events=Array.isArray(laneEvents[sourceId]) ? laneEvents[sourceId] : [];
    const eventResults=[];
    for(const event of events){
      const symbol=requiredText(event.symbol,"event.symbol");
      const effectiveDate=isoDate(event.effectiveDate,"event.effectiveDate");
      if(effectiveDate<start||effectiveDate>end) throw new Error(sourceId+" event outside interval");
      const history=issuerHistories[historyKey(symbol)]||null;
      const queryIntegrity=queryIntegrityForHistory(history,expectedQueryYears);
      const allFamilyRows=Array.isArray(history?.familyRowsByActionFamily?.[contract.actionFamilyId])
        ? history.familyRowsByActionFamily[contract.actionFamilyId]
        : [];
      const boundedRows=allFamilyRows.filter((row)=>typeof row?.date==="string"&&row.date<=end);
      const rowEvidence=[];
      for(const row of boundedRows) rowEvidence.push(await buildRowEvidence(row,symbol,effectiveDate));

      const detailReadyRows=rowEvidence.filter((x)=>x.detailEvidenceReady);
      const strictRows=rowEvidence.filter((x)=>x.detailEffectiveDateMention);
      const listOnlyCandidateRows=rowEvidence.filter((x)=>x.listExplicitEffectiveDateMention&&!x.detailEffectiveDateMention);
      const ambiguousSameDateRows=rowEvidence.filter((x)=>x.listAmbiguousSameDateMention);
      const strictChains=summarizeChains(strictRows);
      const strictChainAmbiguityCount=strictChains.filter((x)=>x.state!=="CHAIN_OBSERVED").length;
      const detailCoverageComplete=
        rowEvidence.length>0 &&
        detailReadyRows.length===rowEvidence.length;

      // Positive event-to-version linkage and negative-history completeness are
      // separate gates. Missing detail on an unrelated same-family row must not
      // erase a directly observed event link; it only blocks later exhaustive
      // revision/cancellation claims.
      const state=boundedRows.length===0
        ? "NO_ACTION_FAMILY_HISTORY"
        : strictRows.length===0
          ? "DETAIL_HISTORY_ONLY_UNRESOLVED"
          : strictChainAmbiguityCount>0
            ? "STRICT_LINKAGE_CHAIN_AMBIGUOUS"
            : "STRICT_LINKAGE_OBSERVED";
      const negativeCompletenessInputReady=
        queryIntegrity.complete &&
        detailCoverageComplete &&
        state==="STRICT_LINKAGE_OBSERVED";

      const canonical={
        eventKey:eventKey(sourceId,event),
        sourceId,
        exchange:contract.exchange,
        actionFamilyId:contract.actionFamilyId,
        symbol,
        effectiveDate,
        finalEventVersionId:event.eventVersionId||null,
        queryIntegrityState:queryIntegrity.state,
        queryIntegrityComplete:queryIntegrity.complete,
        boundedFamilyRowCount:rowEvidence.length,
        detailReadyRowCount:detailReadyRows.length,
        detailCoverageComplete,
        negativeCompletenessInputReady,
        strictLinkedRowCount:strictRows.length,
        listOnlyCandidateRowCount:listOnlyCandidateRows.length,
        ambiguousSameDateRowCount:ambiguousSameDateRows.length,
        strictChainCount:strictChains.length,
        strictChainAmbiguityCount,
        correctionHintCount:strictRows.filter((x)=>x.correctionOrCancellationHint).length,
        cancellationHintCount:strictRows.filter((x)=>x.cancellationHint).length,
        state,
        strictRowHashes:strictRows.map((x)=>x.rowTextHash).sort(),
        strictDetailBodyHashes:strictRows.map((x)=>x.detailBodyTextHash).filter(Boolean).sort(),
        strictDetailPayloadHashes:strictRows.map((x)=>x.detailPayloadHash).filter(Boolean).sort(),
        strictSubjectFingerprintHashes:strictChains.map((x)=>x.subjectFingerprintHash).sort(),
      };
      const linkageHash=await sha256Hex(canonical);

      const result=deepFreeze({
        schemaVersion:"S2_BOUNDED_EVENT_VERSION_LINKAGE_EVENT_V0_1",
        ...canonical,
        queryIntegrity,
        strictChains,
        strictRows:Object.freeze(strictRows),
        listOnlyCandidateRows:Object.freeze(listOnlyCandidateRows),
        ambiguousSameDateRows:Object.freeze(ambiguousSameDateRows),
        linkageHash,
        exactPublicKnownAtCertified:false,
        negativeNoRevisionClaimQualified:false,
        negativeNoCancellationClaimQualified:false,
        revisionCompletenessPromoted:false,
      });
      eventResults.push(result);
      universe.push(result);
    }

    const strictLinkedCount=eventResults.filter((x)=>x.state==="STRICT_LINKAGE_OBSERVED").length;
    const unresolvedCount=eventResults.length-strictLinkedCount;
    const queryIntegrityCompleteCount=eventResults.filter((x)=>x.queryIntegrityComplete).length;
    const detailCoverageCompleteCount=eventResults.filter((x)=>x.detailCoverageComplete).length;
    laneResults.push(deepFreeze({
      sourceId,
      exchange:contract.exchange,
      actionFamilyId:contract.actionFamilyId,
      finalEventCount:eventResults.length,
      queryIntegrityCompleteEventCount:queryIntegrityCompleteCount,
      detailCoverageCompleteEventCount:detailCoverageCompleteCount,
      strictLinkedEventCount:strictLinkedCount,
      unresolvedEventCount:unresolvedCount,
      correctionHintEventCount:eventResults.filter((x)=>x.correctionHintCount>0).length,
      cancellationHintEventCount:eventResults.filter((x)=>x.cancellationHintCount>0).length,
      boundedEventVersionLinkageComplete:
        eventResults.length>0&&
        strictLinkedCount===eventResults.length,
      negativeCompletenessInputReadyEventCount:
        eventResults.filter((x)=>x.negativeCompletenessInputReady).length,
      events:Object.freeze(eventResults),
    }));
  }

  const canonicalUniverse=universe.map((x)=>({
    eventKey:x.eventKey,
    finalEventVersionId:x.finalEventVersionId,
    linkageHash:x.linkageHash,
    state:x.state,
  })).sort((a,b)=>a.eventKey.localeCompare(b.eventKey));
  const linkageUniverseHash=await sha256Hex({
    interval:{startDate:start,endDate:end},
    events:canonicalUniverse,
  });

  const finalEventCount=universe.length;
  const strictLinkedEventCount=universe.filter((x)=>x.state==="STRICT_LINKAGE_OBSERVED").length;
  const queryIntegrityCompleteEventCount=universe.filter((x)=>x.queryIntegrityComplete).length;
  const detailCoverageCompleteEventCount=universe.filter((x)=>x.detailCoverageComplete).length;
  const unresolvedEventCount=finalEventCount-strictLinkedEventCount;

  return deepFreeze({
    schemaVersion:"S2_BOUNDED_EVENT_VERSION_LINKAGE_V0_1",
    version:BOUNDED_EVENT_VERSION_LINKAGE_VERSION,
    interval:deepFreeze({startDate:start,endDate:end}),
    generatedAt:new Date(generatedAt).toISOString(),
    expectedQueryYears:Object.freeze([...expectedQueryYears].map(Number).sort((a,b)=>a-b)),
    requiredLaneCount:laneResults.length,
    finalEventCount,
    strictLinkedEventCount,
    unresolvedEventCount,
    queryIntegrityCompleteEventCount,
    detailCoverageCompleteEventCount,
    linkageUniverseHash,
    boundedEventVersionLinkageComplete:
      finalEventCount>0&&
      strictLinkedEventCount===finalEventCount,
    negativeCompletenessInputReadyEventCount:
      universe.filter((x)=>x.negativeCompletenessInputReady).length,
    laneResults:Object.freeze(laneResults),

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
    historyMutationPerformed:false,
    strategyEvaluationPerformed:false,
    capacityRunProduced:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}
