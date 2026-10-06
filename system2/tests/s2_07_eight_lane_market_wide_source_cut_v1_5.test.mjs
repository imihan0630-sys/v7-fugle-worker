import assert from "node:assert/strict";
import {
  REQUIRED_SOURCE_LANE_IDS_V1_5,
  buildEightLaneMarketWideSourceCutV1_5,
} from "../runtime/s2_07_eight_lane_market_wide_source_cut_v1_5.mjs";

const H=(c)=>c.repeat(64);
const exchange=(id)=>id.startsWith("TWSE_")?"TWSE":"TPEX";
const sourceClass=(id)=>id.includes("DAILY_MATERIAL")
  ?"CURRENT_DAILY_MATERIAL_INFORMATION_SNAPSHOT"
  :"HISTORICAL_ACTUAL_RESULT_RANGE";

function lane(id,overrides={}){
  const range=!id.includes("DAILY_MATERIAL");
  return {
    sourceId:id,
    exchange:exchange(id),
    sourceClass:sourceClass(id),
    state:"READY",
    payloadHash:H(String((REQUIRED_SOURCE_LANE_IDS_V1_5.indexOf(id)+1)%10)),
    observedAt:"2026-10-07T05:00:00Z",
    rowCount:10,
    ordinarySymbolCount:8,
    parserComplete:true,
    queryComplete:true,
    queryTruncated:false,
    requiresRangeIdentity:range,
    responseRangeVerified:range,
    ...overrides,
  };
}

const lanes=REQUIRED_SOURCE_LANE_IDS_V1_5.map((id)=>lane(id));
const ready=await buildEightLaneMarketWideSourceCutV1_5({
  scanDate:"2026-10-07",
  evidenceCutoffAt:"2026-10-07T05:30:00Z",
  sourceLanes:lanes,
});
assert.equal(ready.state,"EIGHT_LANE_MARKET_WIDE_SOURCE_CUT_READY");
assert.equal(ready.eightLaneSourceCutReady,true);
assert.equal(ready.sourceLaneCount,8);
assert.equal(ready.eligibleSourceLaneCount,8);
assert.equal(ready.twseLaneCount,4);
assert.equal(ready.tpexLaneCount,4);
assert.equal(ready.expectedMopsKeysetComplete,false);
assert.equal(ready.noRevisionGapThroughCut,false);
assert.equal(ready.preParentEvidenceCutReady,false);
assert.equal(ready.technicalContinuityCertified,false);
assert.equal(ready.scheduleAdded,false);
assert.equal(ready.selectionAuthority,false);
assert.equal(ready.system1RuntimeUsed,false);
assert.match(ready.sourceLaneManifestHash,/^[0-9a-f]{64}$/);
assert.match(ready.sourceCutId,/^S2-8LANE:[0-9a-f]{64}$/);

const missing=await buildEightLaneMarketWideSourceCutV1_5({
  scanDate:"2026-10-07",
  evidenceCutoffAt:"2026-10-07T05:30:00Z",
  sourceLanes:lanes.slice(0,7),
});
assert.equal(missing.eightLaneSourceCutReady,false);
assert.ok(missing.blockers.includes("EIGHT_LANE_COUNT_MISMATCH"));
assert.ok(missing.blockers.includes("REQUIRED_SOURCE_LANE_SET_MISMATCH"));

const duplicate=await buildEightLaneMarketWideSourceCutV1_5({
  scanDate:"2026-10-07",
  evidenceCutoffAt:"2026-10-07T05:30:00Z",
  sourceLanes:[...lanes.slice(0,7),lanes[0]],
});
assert.equal(duplicate.eightLaneSourceCutReady,false);
assert.ok(duplicate.blockers.includes("DUPLICATE_SOURCE_LANE"));
assert.ok(duplicate.blockers.includes("REQUIRED_SOURCE_LANE_SET_MISMATCH"));

const lateLanes=lanes.map((x)=>({...x}));
lateLanes[0].observedAt="2026-10-07T06:00:00Z";
const late=await buildEightLaneMarketWideSourceCutV1_5({
  scanDate:"2026-10-07",
  evidenceCutoffAt:"2026-10-07T05:30:00Z",
  sourceLanes:lateLanes,
});
assert.equal(late.eightLaneSourceCutReady,false);
assert.ok(late.blockers.includes("SOURCE_LANE_NOT_CUTOFF_READY"));
assert.deepEqual(late.ineligibleSourceLaneIds,[lateLanes[0].sourceId]);

const rangeLanes=lanes.map((x)=>({...x}));
rangeLanes[1].responseRangeVerified=false;
const rangeBlocked=await buildEightLaneMarketWideSourceCutV1_5({
  scanDate:"2026-10-07",
  evidenceCutoffAt:"2026-10-07T05:30:00Z",
  sourceLanes:rangeLanes,
});
assert.equal(rangeBlocked.eightLaneSourceCutReady,false);
assert.ok(rangeBlocked.blockers.includes("SOURCE_LANE_NOT_CUTOFF_READY"));

const wrongExchange=lanes.map((x)=>({...x}));
wrongExchange[7].exchange="TWSE";
const exchangeBlocked=await buildEightLaneMarketWideSourceCutV1_5({
  scanDate:"2026-10-07",
  evidenceCutoffAt:"2026-10-07T05:30:00Z",
  sourceLanes:wrongExchange,
});
assert.equal(exchangeBlocked.eightLaneSourceCutReady,false);
assert.ok(exchangeBlocked.blockers.includes("SOURCE_LANE_NOT_CUTOFF_READY"));
assert.ok(exchangeBlocked.blockers.includes("DUAL_MARKET_LANE_COVERAGE_MISMATCH"));

console.log("S2-07 eight-lane market-wide source cut V1.5 tests PASS");
