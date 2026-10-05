import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const BOUNDED_REVISION_HISTORY_CENSUS_VERSION = "0.1-RESEARCH";

export const LOW_VOLUME_REVISION_LANES_V0_1 = deepFreeze({
  TWSE_CAPITAL_REDUCTION_REFERENCE: {
    exchange: "TWSE",
    actionFamilyId: "CAPITAL_REDUCTION",
  },
  TWSE_PAR_VALUE_CHANGE_REFERENCE: {
    exchange: "TWSE",
    actionFamilyId: "PAR_VALUE_CHANGE",
  },
  TPEX_CAPITAL_REDUCTION_REFERENCE: {
    exchange: "TPEX",
    actionFamilyId: "CAPITAL_REDUCTION",
  },
  TPEX_PAR_VALUE_CHANGE_REFERENCE: {
    exchange: "TPEX",
    actionFamilyId: "PAR_VALUE_CHANGE",
  },
});

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

function eventKey(sourceId,event){
  return [sourceId,event.symbol,event.effectiveDate,event.eventVersionId||""].join("|");
}

function historyKey(symbol){
  return String(symbol||"").trim();
}

function rowDate(row){
  return typeof row?.date==="string" ? row.date : null;
}

function isCancellation(row){
  return /取消|撤銷|廢止/.test(String(row?.rowText||""));
}

export async function buildBoundedRevisionHistoryCensusV0_1({
  startDate,
  endDate,
  laneEvents = {},
  issuerHistories = {},
  generatedAt = new Date().toISOString(),
} = {}){
  const start=isoDate(startDate,"startDate");
  const end=isoDate(endDate,"endDate");
  if(end<start) throw new Error("endDate cannot be earlier than startDate");
  if(!laneEvents||typeof laneEvents!=="object"||Array.isArray(laneEvents)) throw new Error("laneEvents must be object");
  if(!issuerHistories||typeof issuerHistories!=="object"||Array.isArray(issuerHistories)) throw new Error("issuerHistories must be object");
  if(!Number.isFinite(Date.parse(generatedAt))) throw new Error("generatedAt must be ISO");

  const universe=[];
  const laneResults=[];

  for(const [sourceId,contract] of Object.entries(LOW_VOLUME_REVISION_LANES_V0_1)){
    const events=Array.isArray(laneEvents[sourceId]) ? laneEvents[sourceId] : [];
    const eventRows=[];

    for(const event of events){
      const symbol=requiredText(event.symbol,"event.symbol");
      const effectiveDate=isoDate(event.effectiveDate,"event.effectiveDate");
      if(effectiveDate<start||effectiveDate>end) throw new Error(sourceId+" event outside interval");
      const history=issuerHistories[historyKey(symbol)] || null;
      const allFamilyRows=Array.isArray(history?.familyRowsByActionFamily?.[contract.actionFamilyId])
        ? history.familyRowsByActionFamily[contract.actionFamilyId]
        : [];
      const boundedFamilyRows=allFamilyRows.filter((row)=>{
        const date=rowDate(row);
        return date && date<=end;
      });
      const preOrOnEffectiveRows=boundedFamilyRows.filter((row)=>row.date<=effectiveDate);
      const revisionRows=boundedFamilyRows.filter((row)=>row.correctionOrCancellationHint===true);
      const cancellationRows=boundedFamilyRows.filter(isCancellation);
      const transportReady=history?.transportReady===true;
      const issuerFamilyHistoryObserved=transportReady && boundedFamilyRows.length>0;
      const preEffectiveIssuerEvidenceObserved=transportReady && preOrOnEffectiveRows.length>0;

      const state=!transportReady
        ? "ISSUER_HISTORY_TRANSPORT_NOT_READY"
        : !issuerFamilyHistoryObserved
          ? "NO_ISSUER_ACTION_FAMILY_ROWS_OBSERVED"
          : preEffectiveIssuerEvidenceObserved
            ? "ISSUER_ACTION_FAMILY_HISTORY_OBSERVED"
            : "ISSUER_ACTION_FAMILY_ROWS_POST_EFFECTIVE_ONLY";

      const row=deepFreeze({
        eventKey:eventKey(sourceId,event),
        sourceId,
        exchange:contract.exchange,
        actionFamilyId:contract.actionFamilyId,
        symbol,
        effectiveDate,
        eventVersionId:event.eventVersionId||null,
        issuerQueryYears:Object.freeze([...(history?.queriedYears||[])]),
        issuerHistoryTransportReady:transportReady,
        issuerHistoryPayloadCount:Number(history?.payloadCount||0),
        boundedFamilyRowCount:boundedFamilyRows.length,
        preOrOnEffectiveFamilyRowCount:preOrOnEffectiveRows.length,
        revisionHintRowCount:revisionRows.length,
        cancellationHintRowCount:cancellationRows.length,
        issuerFamilyHistoryObserved,
        preEffectiveIssuerEvidenceObserved,
        state,
      });
      eventRows.push(row);
      universe.push(row);
    }

    const linkedCount=eventRows.filter(x=>x.issuerFamilyHistoryObserved).length;
    const preEffectiveCount=eventRows.filter(x=>x.preEffectiveIssuerEvidenceObserved).length;
    const transportReadyCount=eventRows.filter(x=>x.issuerHistoryTransportReady).length;
    laneResults.push(deepFreeze({
      sourceId,
      exchange:contract.exchange,
      actionFamilyId:contract.actionFamilyId,
      finalEventCount:eventRows.length,
      uniqueSymbolCount:new Set(eventRows.map(x=>x.symbol)).size,
      issuerTransportReadyEventCount:transportReadyCount,
      issuerFamilyHistoryObservedEventCount:linkedCount,
      preEffectiveIssuerEvidenceEventCount:preEffectiveCount,
      revisionHintEventCount:eventRows.filter(x=>x.revisionHintRowCount>0).length,
      cancellationHintEventCount:eventRows.filter(x=>x.cancellationHintRowCount>0).length,
      issuerTransportCoverageComplete:eventRows.length>0 && transportReadyCount===eventRows.length,
      issuerFamilyObservabilityCoverageComplete:eventRows.length>0 && linkedCount===eventRows.length,
      preEffectiveIssuerEvidenceCoverageComplete:eventRows.length>0 && preEffectiveCount===eventRows.length,
      events:Object.freeze(eventRows),
    }));
  }

  const canonicalUniverse=universe
    .map(x=>({
      eventKey:x.eventKey,sourceId:x.sourceId,symbol:x.symbol,
      effectiveDate:x.effectiveDate,eventVersionId:x.eventVersionId,
    }))
    .sort((a,b)=>a.eventKey.localeCompare(b.eventKey));
  const eventUniverseHash=await sha256Hex({
    interval:{startDate:start,endDate:end},
    events:canonicalUniverse,
  });

  const finalEventCount=universe.length;
  const transportReadyEventCount=universe.filter(x=>x.issuerHistoryTransportReady).length;
  const issuerFamilyObservedEventCount=universe.filter(x=>x.issuerFamilyHistoryObserved).length;
  const preEffectiveIssuerEvidenceEventCount=universe.filter(x=>x.preEffectiveIssuerEvidenceObserved).length;

  return deepFreeze({
    schemaVersion:"S2_BOUNDED_REVISION_HISTORY_CENSUS_V0_1",
    version:BOUNDED_REVISION_HISTORY_CENSUS_VERSION,
    interval:deepFreeze({startDate:start,endDate:end}),
    generatedAt:new Date(generatedAt).toISOString(),
    requiredLaneCount:laneResults.length,
    finalEventCount,
    uniqueSymbolCount:new Set(universe.map(x=>x.symbol)).size,
    eventUniverseHash,
    issuerTransportReadyEventCount:transportReadyEventCount,
    issuerFamilyObservedEventCount,
    preEffectiveIssuerEvidenceEventCount,
    issuerTransportCoverageComplete:finalEventCount>0 && transportReadyEventCount===finalEventCount,
    issuerFamilyObservabilityCoverageComplete:finalEventCount>0 && issuerFamilyObservedEventCount===finalEventCount,
    preEffectiveIssuerEvidenceCoverageComplete:finalEventCount>0 && preEffectiveIssuerEvidenceEventCount===finalEventCount,
    laneResults:Object.freeze(laneResults),

    // This census freezes the bounded event universe and observes issuer-side
    // history. It does not prove exhaustive correction/cancellation semantics.
    boundedEventUniverseFrozen:true,
    boundedIssuerHistoryObservabilityAssessed:true,
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
