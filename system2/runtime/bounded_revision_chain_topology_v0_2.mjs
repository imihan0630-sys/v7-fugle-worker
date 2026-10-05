import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const BOUNDED_REVISION_CHAIN_TOPOLOGY_VERSION = "0.2-RESEARCH";

export const LOW_VOLUME_TOPOLOGY_LANES_V0_2 = deepFreeze({
  TWSE_CAPITAL_REDUCTION_REFERENCE: { exchange:"TWSE", actionFamilyId:"CAPITAL_REDUCTION" },
  TWSE_PAR_VALUE_CHANGE_REFERENCE: { exchange:"TWSE", actionFamilyId:"PAR_VALUE_CHANGE" },
  TPEX_CAPITAL_REDUCTION_REFERENCE: { exchange:"TPEX", actionFamilyId:"CAPITAL_REDUCTION" },
  TPEX_PAR_VALUE_CHANGE_REFERENCE: { exchange:"TPEX", actionFamilyId:"PAR_VALUE_CHANGE" },
});

function requiredText(value,field){
  if(typeof value!=="string"||!value.trim()) throw new Error(field+" is required");
  return value.trim();
}
function isoDate(value,field){
  const t=requiredText(value,field);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(t)) throw new Error(field+" must be YYYY-MM-DD");
  const d=new Date(t+"T00:00:00.000Z");
  if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==t) throw new Error(field+" invalid");
  return t;
}
function versionKey(row){ return [row?.date||"",row?.time||"",row?.seqNo||""].join("|"); }

export function mopsSubjectFromRowTextV0_2(rowText,symbol){
  return String(rowText||"")
    .replace(new RegExp("^"+String(symbol)+"\\s+\\S+\\s+\\d{3}\\/\\d{2}\\/\\d{2}\\s+\\d{2}:\\d{2}:\\d{2}\\s*"),"")
    .trim();
}

export function normalizeMopsRevisionSubjectV0_2(subject){
  return String(subject||"")
    .replace(/^[（(]?(?:更正|修正|補充公告|補充)[）)]?[-：:、\s]*/g,"")
    .replace(/(?:更正|修正|補充公告|補充)/g,"")
    .replace(/公告本公司|本公司|公告/g,"")
    .replace(/民國\s*\d+\s*年\s*\d+\s*月\s*\d+\s*日/g,"")
    .replace(/\d{2,4}[\/.-]\d{1,2}[\/.-]\d{1,2}/g,"")
    .replace(/[0-9０-９]+(?:\.[0-9０-９]+)?/g,"")
    .replace(/[\s()（）\[\]【】:：,，。；;、\-_/％%]/g,"")
    .trim();
}

export function compatibleRevisionStemV0_2(a,b){
  const x=String(a||"");
  const y=String(b||"");
  if(!x||!y||x.length<6||y.length<6) return false;
  if(x===y) return true;
  const shorter=x.length<=y.length?x:y;
  const longer=x.length>y.length?x:y;
  return longer.includes(shorter) && shorter.length/longer.length>=0.72;
}

function isCancellation(row){
  return /取消|撤銷|廢止/.test(String(row?.rowText||""));
}

function assessFamilyRows(symbol,rows,endDate){
  const prepared=(Array.isArray(rows)?rows:[])
    .filter(row=>row?.date && row.date<=endDate)
    .map(row=>{
      const subject=mopsSubjectFromRowTextV0_2(row.rowText,symbol);
      const stem=normalizeMopsRevisionSubjectV0_2(subject);
      return {
        ...row,
        subject,
        normalizedStem:stem,
        versionKey:versionKey(row),
        cancellationHint:isCancellation(row),
      };
    })
    .sort((a,b)=>a.versionKey.localeCompare(b.versionKey));

  const originals=prepared.filter(x=>x.correctionOrCancellationHint!==true);
  const revisions=prepared.filter(x=>x.correctionOrCancellationHint===true);
  const revisionLinks=[];
  const unresolvedRevisions=[];

  for(const revision of revisions){
    const matches=originals
      .filter(original=>
        original.versionKey<revision.versionKey &&
        compatibleRevisionStemV0_2(original.normalizedStem,revision.normalizedStem)
      )
      .sort((a,b)=>b.versionKey.localeCompare(a.versionKey));
    if(!matches.length){
      unresolvedRevisions.push(revision);
      continue;
    }
    const original=matches[0];
    revisionLinks.push({
      originalVersionKey:original.versionKey,
      revisionVersionKey:revision.versionKey,
      originalSubject:original.subject,
      revisionSubject:revision.subject,
      exactStem:original.normalizedStem===revision.normalizedStem,
      cancellationHint:revision.cancellationHint,
    });
  }

  const cancellationRows=revisions.filter(x=>x.cancellationHint);
  const linkedCancellationKeys=new Set(
    revisionLinks.filter(x=>x.cancellationHint).map(x=>x.revisionVersionKey)
  );

  return {
    rowCount:prepared.length,
    originalCount:originals.length,
    revisionHintCount:revisions.length,
    cancellationHintCount:cancellationRows.length,
    resolvedRevisionLinkCount:revisionLinks.length,
    unresolvedRevisionCount:unresolvedRevisions.length,
    unresolvedCancellationCount:cancellationRows.filter(x=>!linkedCancellationKeys.has(x.versionKey)).length,
    revisionLinks,
    unresolvedRevisionVersionKeys:unresolvedRevisions.map(x=>x.versionKey),
  };
}

export async function buildBoundedRevisionChainTopologyV0_2({
  startDate,
  endDate,
  laneEvents={},
  issuerFamilyRowsBySymbol={},
  generatedAt=new Date().toISOString(),
}={}){
  const start=isoDate(startDate,"startDate");
  const end=isoDate(endDate,"endDate");
  if(end<start) throw new Error("endDate cannot be earlier than startDate");
  if(!Number.isFinite(Date.parse(generatedAt))) throw new Error("generatedAt must be ISO");

  const eventResults=[];
  const laneResults=[];

  for(const [sourceId,contract] of Object.entries(LOW_VOLUME_TOPOLOGY_LANES_V0_2)){
    const events=Array.isArray(laneEvents[sourceId])?laneEvents[sourceId]:[];
    const laneEventRows=[];

    for(const event of events){
      const symbol=requiredText(event.symbol,"event.symbol");
      const effectiveDate=isoDate(event.effectiveDate,"event.effectiveDate");
      const rows=issuerFamilyRowsBySymbol?.[symbol]?.[contract.actionFamilyId]||[];
      const topology=assessFamilyRows(symbol,rows,end);
      const hasRevisionHint=topology.revisionHintCount>0;
      const revisionChainTopologyResolved=
        hasRevisionHint &&
        topology.unresolvedRevisionCount===0 &&
        topology.resolvedRevisionLinkCount===topology.revisionHintCount;
      const noRevisionHintObserved=!hasRevisionHint;

      const state=hasRevisionHint
        ? revisionChainTopologyResolved
          ? "REVISION_HINT_CHAIN_TOPOLOGY_RESOLVED"
          : "REVISION_HINT_CHAIN_TOPOLOGY_UNRESOLVED"
        : "NO_REVISION_HINT_UNQUALIFIED";

      const row=deepFreeze({
        sourceId,exchange:contract.exchange,actionFamilyId:contract.actionFamilyId,
        symbol,effectiveDate,eventVersionId:event.eventVersionId||null,
        familyRowCount:topology.rowCount,
        originalRowCount:topology.originalCount,
        revisionHintRowCount:topology.revisionHintCount,
        cancellationHintRowCount:topology.cancellationHintCount,
        resolvedRevisionLinkCount:topology.resolvedRevisionLinkCount,
        unresolvedRevisionCount:topology.unresolvedRevisionCount,
        unresolvedCancellationCount:topology.unresolvedCancellationCount,
        revisionChainTopologyResolved,
        noRevisionHintObserved,
        noRevisionNegativeClaimQualified:false,
        revisionLinks:Object.freeze(topology.revisionLinks),
        unresolvedRevisionVersionKeys:Object.freeze(topology.unresolvedRevisionVersionKeys),
        state,
      });
      laneEventRows.push(row);
      eventResults.push(row);
    }

    laneResults.push(deepFreeze({
      sourceId,exchange:contract.exchange,actionFamilyId:contract.actionFamilyId,
      finalEventCount:laneEventRows.length,
      revisionHintEventCount:laneEventRows.filter(x=>x.revisionHintRowCount>0).length,
      resolvedRevisionTopologyEventCount:laneEventRows.filter(x=>x.revisionChainTopologyResolved).length,
      unresolvedRevisionTopologyEventCount:laneEventRows.filter(x=>x.state==="REVISION_HINT_CHAIN_TOPOLOGY_UNRESOLVED").length,
      noRevisionHintEventCount:laneEventRows.filter(x=>x.noRevisionHintObserved).length,
      noRevisionNegativeClaimQualifiedCount:0,
      cancellationHintEventCount:laneEventRows.filter(x=>x.cancellationHintRowCount>0).length,
      unresolvedCancellationEventCount:laneEventRows.filter(x=>x.unresolvedCancellationCount>0).length,
      events:Object.freeze(laneEventRows),
    }));
  }

  const topologyHash=await sha256Hex({
    interval:{startDate:start,endDate:end},
    events:eventResults.map(x=>({
      sourceId:x.sourceId,symbol:x.symbol,effectiveDate:x.effectiveDate,
      revisionHintRowCount:x.revisionHintRowCount,
      resolvedRevisionLinkCount:x.resolvedRevisionLinkCount,
      unresolvedRevisionCount:x.unresolvedRevisionCount,
      state:x.state,
    })).sort((a,b)=>[a.sourceId,a.symbol,a.effectiveDate].join("|").localeCompare([b.sourceId,b.symbol,b.effectiveDate].join("|"))),
  });

  return deepFreeze({
    schemaVersion:"S2_BOUNDED_REVISION_CHAIN_TOPOLOGY_V0_2",
    version:BOUNDED_REVISION_CHAIN_TOPOLOGY_VERSION,
    interval:deepFreeze({startDate:start,endDate:end}),
    generatedAt:new Date(generatedAt).toISOString(),
    requiredLaneCount:laneResults.length,
    finalEventCount:eventResults.length,
    revisionHintEventCount:eventResults.filter(x=>x.revisionHintRowCount>0).length,
    resolvedRevisionTopologyEventCount:eventResults.filter(x=>x.revisionChainTopologyResolved).length,
    unresolvedRevisionTopologyEventCount:eventResults.filter(x=>x.state==="REVISION_HINT_CHAIN_TOPOLOGY_UNRESOLVED").length,
    noRevisionHintEventCount:eventResults.filter(x=>x.noRevisionHintObserved).length,
    noRevisionNegativeClaimQualifiedCount:0,
    cancellationHintEventCount:eventResults.filter(x=>x.cancellationHintRowCount>0).length,
    unresolvedCancellationEventCount:eventResults.filter(x=>x.unresolvedCancellationCount>0).length,
    topologyHash,
    versionChainTopologyAssessed:true,
    allObservedRevisionHintsResolved:
      eventResults.filter(x=>x.revisionHintRowCount>0).every(x=>x.revisionChainTopologyResolved),
    laneResults:Object.freeze(laneResults),

    noRevisionAbsenceSemanticsCertified:false,
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
