import assert from "node:assert/strict";
import {buildEightLaneSourceCutPreflightV1_5,S2_07_REQUIRED_EIGHT_LANE_IDS_V1_5} from "../runtime/s2_07_eight_lane_source_cut_v1_5.mjs";

const H=c=>c.repeat(64);
const cutoff="2026-10-07T06:30:00Z";
const historicalIds=S2_07_REQUIRED_EIGHT_LANE_IDS_V1_5.filter(x=>!x.includes("DAILY_MATERIAL_INFORMATION"));
const hist=historicalIds.map((sourceId,i)=>({
  sourceId,
  exchange:sourceId.startsWith("TWSE")?"TWSE":"TPEX",
  laneClass:"HISTORICAL_ACTUAL_RESULT_RANGE",
  state:"READY",
  payloadHash:H(String((i+1)%10)),
  observedAt:"2026-10-07T06:00:00Z",
  responseRangeVerified:true,
  parserComplete:true,
  queryComplete:true,
  queryTruncated:false,
  events:[{
    symbol:String(1000+i+1),
    actionFamilyId:sourceId.includes("CAPITAL")?"CAPITAL_REDUCTION":sourceId.includes("PAR_VALUE")?"PAR_VALUE_CHANGE":"EX_DIVIDEND",
    effectiveDate:"2026-10-0"+String((i%6)+1),
    sourceRowHash:H("a"),
  }],
}));
const daily=[
  {sourceId:"TWSE_DAILY_MATERIAL_INFORMATION",exchange:"TWSE"},
  {sourceId:"TPEX_DAILY_MATERIAL_INFORMATION",exchange:"TPEX"},
].map((x,i)=>({
  ...x,laneClass:"DAILY_MATERIAL_INFORMATION_SNAPSHOT",state:"READY",payloadHash:H(i?"b":"c"),
  observedAt:"2026-10-07T06:05:00Z",parserComplete:true,queryComplete:true,queryTruncated:false,
  rowCount:12,distinctIdentityCount:12,emptySnapshotCertified:false,
}));

const ok=await buildEightLaneSourceCutPreflightV1_5({
  scanDate:"2026-10-07",evidenceCutoffAt:cutoff,intervalStartDate:"2026-08-15",intervalEndDate:"2026-10-07",
  historicalLanes:hist,dailyDisclosureLanes:daily,
});
assert.equal(ok.eightLaneSourceCutReady,true);
assert.equal(ok.state,"EIGHT_LANE_SOURCE_CUT_READY_MOPS_PENDING");
assert.equal(ok.observedLaneCount,8);
assert.equal(ok.readyLaneCount,8);
assert.equal(ok.historicalRangeLaneCount,6);
assert.equal(ok.dailyDisclosureLaneCount,2);
assert.equal(ok.requiredMopsLookupCount,6);
assert.equal(ok.mopsProspectiveExactVersionLayerReady,false);
assert.equal(ok.preCutManifestReady,false);
assert.equal(ok.noRevisionGapThroughCut,false);
assert.equal(ok.parentBindingPending,true);

const missing=await buildEightLaneSourceCutPreflightV1_5({
  scanDate:"2026-10-07",evidenceCutoffAt:cutoff,intervalStartDate:"2026-08-15",intervalEndDate:"2026-10-07",
  historicalLanes:hist.slice(0,5),dailyDisclosureLanes:daily,
});
assert.equal(missing.eightLaneSourceCutReady,false);
assert.ok(missing.blockers.includes("HISTORICAL_RANGE_LANE_COUNT_MISMATCH"));
assert.ok(missing.blockers.includes("REQUIRED_EIGHT_LANE_KEYSET_MISMATCH"));

const late=await buildEightLaneSourceCutPreflightV1_5({
  scanDate:"2026-10-07",evidenceCutoffAt:cutoff,intervalStartDate:"2026-08-15",intervalEndDate:"2026-10-07",
  historicalLanes:hist.map((x,i)=>i?x:{...x,observedAt:"2026-10-07T07:00:00Z"}),dailyDisclosureLanes:daily,
});
assert.equal(late.eightLaneSourceCutReady,false);
assert.ok(late.blockers.includes("EIGHT_LANE_SOURCE_NOT_READY"));

const emptyDaily=await buildEightLaneSourceCutPreflightV1_5({
  scanDate:"2026-10-07",evidenceCutoffAt:cutoff,intervalStartDate:"2026-08-15",intervalEndDate:"2026-10-07",
  historicalLanes:hist,dailyDisclosureLanes:daily.map((x,i)=>i?x:{...x,rowCount:0,distinctIdentityCount:0,emptySnapshotCertified:false}),
});
assert.equal(emptyDaily.eightLaneSourceCutReady,false);
assert.ok(emptyDaily.blockers.includes("EIGHT_LANE_SOURCE_NOT_READY"));

const certifiedEmpty=await buildEightLaneSourceCutPreflightV1_5({
  scanDate:"2026-10-07",evidenceCutoffAt:cutoff,intervalStartDate:"2026-08-15",intervalEndDate:"2026-10-07",
  historicalLanes:hist,dailyDisclosureLanes:daily.map((x,i)=>i?x:{...x,rowCount:0,distinctIdentityCount:0,emptySnapshotCertified:true}),
});
assert.equal(certifiedEmpty.eightLaneSourceCutReady,true);

console.log("S2-07 eight-lane source cut V1.5 tests PASS");
