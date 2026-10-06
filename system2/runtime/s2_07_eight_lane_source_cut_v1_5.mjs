import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const S2_07_EIGHT_LANE_SOURCE_CUT_VERSION = "1.5-RESEARCH";

export const S2_07_REQUIRED_EIGHT_LANE_IDS_V1_5 = deepFreeze([
  "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  "TWSE_CAPITAL_REDUCTION_REFERENCE",
  "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  "TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
  "TPEX_CAPITAL_REDUCTION_REFERENCE",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE",
  "TWSE_DAILY_MATERIAL_INFORMATION",
  "TPEX_DAILY_MATERIAL_INFORMATION",
]);

function text(v){ return v == null ? "" : String(v).trim(); }
function hash64(v){ return /^[0-9a-f]{64}$/i.test(text(v)); }
function isoTime(v){
  const s=text(v);
  return s && Number.isFinite(Date.parse(s)) ? new Date(s).toISOString() : null;
}
function isoDay(v){
  const s=text(v);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d=new Date(s+"T00:00:00Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10)===s ? s : null;
}
function uniqSorted(xs){ return [...new Set(xs.filter(Boolean))].sort(); }

function normalizeHistoricalLane(row, cutoffAt){
  if(!row || typeof row!=="object" || Array.isArray(row)) return null;
  const sourceId=text(row.sourceId);
  const observedAt=isoTime(row.observedAt);
  const events=Array.isArray(row.events) ? row.events : [];
  const eligible=
    S2_07_REQUIRED_EIGHT_LANE_IDS_V1_5.includes(sourceId)
    && row.laneClass==="HISTORICAL_ACTUAL_RESULT_RANGE"
    && row.state==="READY"
    && hash64(row.payloadHash)
    && observedAt!==null
    && Date.parse(observedAt)<=Date.parse(cutoffAt)
    && row.responseRangeVerified===true
    && row.parserComplete===true
    && row.queryComplete===true
    && row.queryTruncated!==true;
  return deepFreeze({
    sourceId,
    exchange:text(row.exchange).toUpperCase()||null,
    laneClass:"HISTORICAL_ACTUAL_RESULT_RANGE",
    state:text(row.state)||null,
    payloadHash:text(row.payloadHash)||null,
    observedAt,
    responseRangeVerified:row.responseRangeVerified===true,
    parserComplete:row.parserComplete===true,
    queryComplete:row.queryComplete===true,
    queryTruncated:row.queryTruncated===true,
    eventCount:events.length,
    events:deepFreeze(events.map((e)=>deepFreeze({
      symbol:text(e?.symbol)||null,
      actionFamilyId:text(e?.actionFamilyId)||null,
      effectiveDate:text(e?.effectiveDate)||null,
      sourceRowHash:text(e?.sourceRowHash)||null,
    }))),
    eligible,
  });
}

function normalizeDailyLane(row, cutoffAt){
  if(!row || typeof row!=="object" || Array.isArray(row)) return null;
  const sourceId=text(row.sourceId);
  const observedAt=isoTime(row.observedAt);
  const eligible=
    S2_07_REQUIRED_EIGHT_LANE_IDS_V1_5.includes(sourceId)
    && row.laneClass==="DAILY_MATERIAL_INFORMATION_SNAPSHOT"
    && row.state==="READY"
    && hash64(row.payloadHash)
    && observedAt!==null
    && Date.parse(observedAt)<=Date.parse(cutoffAt)
    && row.parserComplete===true
    && row.queryComplete===true
    && row.queryTruncated!==true
    && Number.isInteger(Number(row.rowCount))
    && Number(row.rowCount)>=0
    && (Number(row.rowCount)>0 || row.emptySnapshotCertified===true);
  return deepFreeze({
    sourceId,
    exchange:text(row.exchange).toUpperCase()||null,
    laneClass:"DAILY_MATERIAL_INFORMATION_SNAPSHOT",
    state:text(row.state)||null,
    payloadHash:text(row.payloadHash)||null,
    observedAt,
    parserComplete:row.parserComplete===true,
    queryComplete:row.queryComplete===true,
    queryTruncated:row.queryTruncated===true,
    rowCount:Number.isFinite(Number(row.rowCount))?Number(row.rowCount):null,
    distinctIdentityCount:Number.isFinite(Number(row.distinctIdentityCount))?Number(row.distinctIdentityCount):null,
    emptySnapshotCertified:row.emptySnapshotCertified===true,
    eligible,
  });
}

export async function buildEightLaneSourceCutPreflightV1_5({
  scanDate,
  evidenceCutoffAt,
  intervalStartDate,
  intervalEndDate,
  historicalLanes=[],
  dailyDisclosureLanes=[],
}={}){
  const date=isoDay(scanDate);
  const start=isoDay(intervalStartDate);
  const end=isoDay(intervalEndDate);
  const cutoff=isoTime(evidenceCutoffAt);
  if(!date) throw new Error("scanDate must be YYYY-MM-DD");
  if(!start) throw new Error("intervalStartDate must be YYYY-MM-DD");
  if(!end) throw new Error("intervalEndDate must be YYYY-MM-DD");
  if(end<start) throw new Error("intervalEndDate cannot precede intervalStartDate");
  if(!cutoff) throw new Error("evidenceCutoffAt must be ISO timestamp");

  const blockers=[];
  const history=(Array.isArray(historicalLanes)?historicalLanes:[])
    .map(x=>normalizeHistoricalLane(x,cutoff)).filter(Boolean);
  const daily=(Array.isArray(dailyDisclosureLanes)?dailyDisclosureLanes:[])
    .map(x=>normalizeDailyLane(x,cutoff)).filter(Boolean);
  const lanes=[...history,...daily];
  const ids=lanes.map(x=>x.sourceId);
  const expected=[...S2_07_REQUIRED_EIGHT_LANE_IDS_V1_5].sort();
  const observed=[...ids].sort();

  if(history.length!==6) blockers.push("HISTORICAL_RANGE_LANE_COUNT_MISMATCH");
  if(daily.length!==2) blockers.push("DAILY_DISCLOSURE_LANE_COUNT_MISMATCH");
  if(ids.length!==new Set(ids).size) blockers.push("DUPLICATE_SOURCE_LANE");
  if(JSON.stringify(expected)!==JSON.stringify(observed)) blockers.push("REQUIRED_EIGHT_LANE_KEYSET_MISMATCH");

  const ineligible=lanes.filter(x=>x.eligible!==true);
  if(ineligible.length) blockers.push("EIGHT_LANE_SOURCE_NOT_READY");
  if(history.some(x=>x.queryTruncated===true)||daily.some(x=>x.queryTruncated===true)) blockers.push("SOURCE_QUERY_TRUNCATED");

  const eventKeys=[];
  const lookupKeys=[];
  const malformedEvents=[];
  for(const lane of history){
    for(const e of lane.events){
      const symbol=text(e.symbol);
      const effectiveDate=isoDay(e.effectiveDate);
      const family=text(e.actionFamilyId);
      if(!/^[1-9][0-9]{3}$/.test(symbol) || !effectiveDate || !family){
        malformedEvents.push({sourceId:lane.sourceId,symbol,effectiveDate:e.effectiveDate||null,family:family||null});
        continue;
      }
      eventKeys.push([lane.sourceId,symbol,family,effectiveDate].join("|"));
      lookupKeys.push(symbol+"|"+effectiveDate.slice(0,7));
    }
  }
  if(malformedEvents.length) blockers.push("EVENT_LOOKUP_POPULATION_MALFORMED");
  const uniqueEventKeys=uniqSorted(eventKeys);
  const uniqueLookupKeys=uniqSorted(lookupKeys);
  if(uniqueEventKeys.length===0) blockers.push("EVENT_LOOKUP_POPULATION_EMPTY_UNCERTIFIED");

  const uniqueBlockers=[...new Set(blockers)];
  const eightLaneSourceCutReady=uniqueBlockers.length===0;
  const laneManifest=lanes.map(x=>({
    sourceId:x.sourceId,
    exchange:x.exchange,
    laneClass:x.laneClass,
    payloadHash:x.payloadHash,
    observedAt:x.observedAt,
    parserComplete:x.parserComplete,
    queryComplete:x.queryComplete,
    queryTruncated:x.queryTruncated,
    eventCount:x.eventCount??null,
    rowCount:x.rowCount??null,
  })).sort((a,b)=>a.sourceId.localeCompare(b.sourceId));
  const sourceLaneManifestHash=await sha256Hex({
    version:S2_07_EIGHT_LANE_SOURCE_CUT_VERSION,
    scanDate:date,
    intervalStartDate:start,
    intervalEndDate:end,
    evidenceCutoffAt:cutoff,
    lanes:laneManifest,
    eventKeys:uniqueEventKeys,
    mopsLookupKeys:uniqueLookupKeys,
  });
  const sourceCutPreflightId="S2-8LANE:"+await sha256Hex({sourceLaneManifestHash,evidenceCutoffAt:cutoff});

  return deepFreeze({
    schemaVersion:"S2_S2_07_EIGHT_LANE_SOURCE_CUT_PREFLIGHT_V1_5",
    version:S2_07_EIGHT_LANE_SOURCE_CUT_VERSION,
    state:eightLaneSourceCutReady
      ?"EIGHT_LANE_SOURCE_CUT_READY_MOPS_PENDING"
      :"EIGHT_LANE_SOURCE_CUT_BLOCKED",
    blockers:deepFreeze(uniqueBlockers),
    scanDate:date,
    intervalStartDate:start,
    intervalEndDate:end,
    evidenceCutoffAt:cutoff,
    sourceCutPreflightId,
    sourceLaneManifestHash,
    requiredLaneCount:8,
    observedLaneCount:lanes.length,
    historicalRangeLaneCount:history.length,
    dailyDisclosureLaneCount:daily.length,
    readyLaneCount:lanes.filter(x=>x.eligible).length,
    laneManifest:deepFreeze(laneManifest.map(deepFreeze)),
    corporateActionEventCount:uniqueEventKeys.length,
    corporateActionEventKeys:deepFreeze(uniqueEventKeys),
    requiredMopsLookupCount:uniqueLookupKeys.length,
    requiredMopsLookupKeys:deepFreeze(uniqueLookupKeys),
    malformedEventCount:malformedEvents.length,
    eightLaneSourceCutReady,
    marketWideSourceLayerReady:eightLaneSourceCutReady,
    mopsProspectiveExactVersionLayerReady:false,
    expectedMopsKeysetComplete:false,
    noRevisionGapThroughCut:false,
    preCutManifestReady:false,
    parentBindingPending:true,
    selectedOnlyCaptureAuthorized:false,
    symbolSessionCompletenessCertified:false,
    technicalContinuityCertified:false,
    historyMutationPerformed:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}
