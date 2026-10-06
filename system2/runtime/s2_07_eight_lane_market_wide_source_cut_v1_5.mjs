import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const S2_07_EIGHT_LANE_SOURCE_CUT_VERSION_V1_5 = "1.5-RESEARCH";

export const REQUIRED_SOURCE_LANE_IDS_V1_5 = Object.freeze([
  "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  "TWSE_CAPITAL_REDUCTION_REFERENCE",
  "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  "TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
  "TPEX_CAPITAL_REDUCTION_REFERENCE",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE",
  "TWSE_DAILY_MATERIAL_INFORMATION",
  "TPEX_DAILY_MATERIAL_INFORMATION",
]);

const EXPECTED_EXCHANGE = Object.freeze({
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL: "TWSE",
  TWSE_CAPITAL_REDUCTION_REFERENCE: "TWSE",
  TWSE_PAR_VALUE_CHANGE_REFERENCE: "TWSE",
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL: "TPEX",
  TPEX_CAPITAL_REDUCTION_REFERENCE: "TPEX",
  TPEX_PAR_VALUE_CHANGE_REFERENCE: "TPEX",
  TWSE_DAILY_MATERIAL_INFORMATION: "TWSE",
  TPEX_DAILY_MATERIAL_INFORMATION: "TPEX",
});

const RANGE_LANES = new Set([
  "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  "TWSE_CAPITAL_REDUCTION_REFERENCE",
  "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  "TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
  "TPEX_CAPITAL_REDUCTION_REFERENCE",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE",
]);

const text=(v)=>v==null?"":String(v).trim();
const hash64=(v)=>/^[0-9a-f]{64}$/i.test(text(v));

function isoTimestamp(v,field){
  const s=text(v);
  if(!s||!Number.isFinite(Date.parse(s))) throw new Error(field+" must be ISO timestamp");
  return new Date(s).toISOString();
}

function isoDate(v,field){
  const s=text(v);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||!Number.isFinite(Date.parse(s+"T00:00:00Z"))){
    throw new Error(field+" must be YYYY-MM-DD");
  }
  return s;
}

function normalizeLane(lane,cutoff){
  if(!lane||typeof lane!=="object"||Array.isArray(lane)) return null;
  const sourceId=text(lane.sourceId);
  const observedAt=text(lane.observedAt);
  const requiresRangeIdentity=RANGE_LANES.has(sourceId);
  const exchange=text(lane.exchange).toUpperCase();
  const expectedExchange=EXPECTED_EXCHANGE[sourceId]||null;
  const eligible=
    Boolean(sourceId)
    && REQUIRED_SOURCE_LANE_IDS_V1_5.includes(sourceId)
    && exchange===expectedExchange
    && lane.state==="READY"
    && hash64(lane.payloadHash)
    && observedAt
    && Number.isFinite(Date.parse(observedAt))
    && Date.parse(observedAt)<=Date.parse(cutoff)
    && lane.parserComplete===true
    && lane.queryComplete===true
    && lane.queryTruncated!==true
    && (!requiresRangeIdentity || lane.responseRangeVerified===true);

  return deepFreeze({
    sourceId:sourceId||null,
    exchange:exchange||null,
    sourceClass:text(lane.sourceClass)||null,
    payloadHash:text(lane.payloadHash)||null,
    observedAt:observedAt?new Date(observedAt).toISOString():null,
    rowCount:Number.isFinite(Number(lane.rowCount))?Number(lane.rowCount):null,
    ordinarySymbolCount:Number.isFinite(Number(lane.ordinarySymbolCount))?Number(lane.ordinarySymbolCount):null,
    requiresRangeIdentity,
    responseRangeVerified:lane.responseRangeVerified===true,
    parserComplete:lane.parserComplete===true,
    queryComplete:lane.queryComplete===true,
    queryTruncated:lane.queryTruncated===true,
    eligible,
  });
}

export async function buildEightLaneMarketWideSourceCutV1_5({
  scanDate,
  evidenceCutoffAt,
  sourceLanes=[],
}={}){
  const date=isoDate(scanDate,"scanDate");
  const cutoff=isoTimestamp(evidenceCutoffAt,"evidenceCutoffAt");
  const blockers=[];
  const lanes=sourceLanes.map((x)=>normalizeLane(x,cutoff)).filter(Boolean);

  const ids=lanes.map((x)=>x.sourceId).filter(Boolean);
  const expected=[...REQUIRED_SOURCE_LANE_IDS_V1_5].sort();
  const observed=[...ids].sort();

  if(lanes.length!==8) blockers.push("EIGHT_LANE_COUNT_MISMATCH");
  if(new Set(ids).size!==ids.length) blockers.push("DUPLICATE_SOURCE_LANE");
  if(JSON.stringify(expected)!==JSON.stringify(observed)) blockers.push("REQUIRED_SOURCE_LANE_SET_MISMATCH");

  const ineligible=lanes.filter((x)=>x.eligible!==true);
  if(ineligible.length) blockers.push("SOURCE_LANE_NOT_CUTOFF_READY");

  const twseCount=lanes.filter((x)=>x.exchange==="TWSE").length;
  const tpexCount=lanes.filter((x)=>x.exchange==="TPEX").length;
  if(twseCount!==4||tpexCount!==4) blockers.push("DUAL_MARKET_LANE_COVERAGE_MISMATCH");

  const uniqueBlockers=[...new Set(blockers)];
  const manifestIdentity={
    version:S2_07_EIGHT_LANE_SOURCE_CUT_VERSION_V1_5,
    scanDate:date,
    evidenceCutoffAt:cutoff,
    sourceLanes:lanes.map((x)=>({
      sourceId:x.sourceId,
      exchange:x.exchange,
      sourceClass:x.sourceClass,
      payloadHash:x.payloadHash,
      observedAt:x.observedAt,
      rowCount:x.rowCount,
      ordinarySymbolCount:x.ordinarySymbolCount,
      requiresRangeIdentity:x.requiresRangeIdentity,
      responseRangeVerified:x.responseRangeVerified,
      parserComplete:x.parserComplete,
      queryComplete:x.queryComplete,
    })).sort((a,b)=>String(a.sourceId).localeCompare(String(b.sourceId))),
  };
  const sourceLaneManifestHash=await sha256Hex(manifestIdentity);
  const sourceCutId="S2-8LANE:"+await sha256Hex({sourceLaneManifestHash,evidenceCutoffAt:cutoff});
  const eightLaneSourceCutReady=uniqueBlockers.length===0;

  return deepFreeze({
    schemaVersion:"S2_S2_07_EIGHT_LANE_MARKET_WIDE_SOURCE_CUT_V1_5",
    version:S2_07_EIGHT_LANE_SOURCE_CUT_VERSION_V1_5,
    state:eightLaneSourceCutReady
      ?"EIGHT_LANE_MARKET_WIDE_SOURCE_CUT_READY"
      :"EIGHT_LANE_MARKET_WIDE_SOURCE_CUT_BLOCKED",
    blockers:uniqueBlockers,
    scanDate:date,
    evidenceCutoffAt:cutoff,
    sourceCutId,
    sourceLaneManifestHash,
    requiredSourceLaneIds:REQUIRED_SOURCE_LANE_IDS_V1_5,
    sourceLanes:manifestIdentity.sourceLanes,
    sourceLaneCount:lanes.length,
    eligibleSourceLaneCount:lanes.length-ineligible.length,
    ineligibleSourceLaneIds:ineligible.map((x)=>x.sourceId).filter(Boolean).sort(),
    twseLaneCount:twseCount,
    tpexLaneCount:tpexCount,
    scopeClass:"MARKET_WIDE_DUAL_MARKET_OFFICIAL_SOURCE_LANES",
    selectedOnlyCaptureAuthorized:false,
    eightLaneSourceCutReady,

    // V1.5 closes only the eight-lane snapshot layer. MOPS exact-version
    // completeness and no-revision-gap remain separate V1.4.1 gates.
    expectedMopsKeysetComplete:false,
    noRevisionGapThroughCut:false,
    noRevisionGapThroughCutCertified:false,
    preParentEvidenceCutReady:false,
    symbolSessionCompletenessCertified:false,
    technicalContinuityCertified:false,
    historyMutationPerformed:false,
    scheduleAdded:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}
