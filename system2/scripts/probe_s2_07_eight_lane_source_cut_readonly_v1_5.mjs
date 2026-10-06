import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { normalizeOfficialDisclosureSnapshot } from "../../research/d17_disclosure_snapshot_observer_v0_1.mjs";
import { buildEightLaneSourceCutPreflightV1_5 } from "../runtime/s2_07_eight_lane_source_cut_v1_5.mjs";

const START="2026-08-15";
const taipeiDate=()=>new Intl.DateTimeFormat("en-CA",{
  timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"
}).format(new Date());
const END=process.env.S2_SCAN_DATE || taipeiDate();

async function fetchText(url,userAgent){
  const response=await fetch(url,{
    method:"GET",redirect:"follow",
    headers:{accept:"application/json,text/plain,*/*","user-agent":userAgent},
    signal:AbortSignal.timeout(30000),
  });
  const rawText=await response.text();
  assert.equal(response.ok,true,url+" HTTP "+response.status);
  return {rawText,capturedAt:new Date().toISOString(),httpStatus:response.status};
}

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const historicalLanes=[];
for(const [sourceId,source] of Object.entries(urls)){
  if(source.sourceClass!=="HISTORICAL_ACTUAL_RESULT_RANGE") continue;
  const fetched=await fetchText(source.url,"System2-S2-07-Eight-Lane-Cut/1.5");
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,sourceUrl:source.url,rawText:fetched.rawText,fetchedAt:fetched.capturedAt,
    requestedStartDate:START,requestedEndDate:END,
  });
  historicalLanes.push({
    sourceId,
    exchange:source.exchange,
    laneClass:"HISTORICAL_ACTUAL_RESULT_RANGE",
    state:parsed.responseRangeVerified===true&&parsed.parserComplete===true?"READY":"BLOCKED",
    payloadHash:parsed.payloadHash,
    observedAt:fetched.capturedAt,
    responseRangeVerified:parsed.responseRangeVerified,
    parserComplete:parsed.parserComplete,
    queryComplete:parsed.responseRangeVerified===true&&parsed.parserComplete===true,
    queryTruncated:false,
    events:parsed.events,
  });
}
assert.equal(historicalLanes.length,6,"expected six historical actual/reference lanes");

const dailyConfigs=[
  {
    sourceId:"TWSE_DAILY_MATERIAL_INFORMATION",
    exchange:"TWSE",
    d17SourceId:"TWSE",
    url:"https://openapi.twse.com.tw/v1/opendata/t187ap04_L",
  },
  {
    sourceId:"TPEX_DAILY_MATERIAL_INFORMATION",
    exchange:"TPEX",
    d17SourceId:"TPEX",
    url:"https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap04_O",
  },
];
const dailyDisclosureLanes=[];
for(const cfg of dailyConfigs){
  const fetched=await fetchText(cfg.url,"System2-S2-07-Eight-Lane-Cut/1.5");
  let rows;
  try{ rows=JSON.parse(fetched.rawText); }catch(error){ throw new Error(cfg.sourceId+" JSON parse failed: "+error.message); }
  assert.ok(Array.isArray(rows),cfg.sourceId+" must return JSON array");
  const snapshot=normalizeOfficialDisclosureSnapshot(cfg.d17SourceId,rows,fetched.capturedAt);
  const parserComplete=snapshot.items.every((item)=>
    /^[1-9][0-9]{3}$/.test(String(item.symbol||""))
    && /^[0-9a-f]{64}$/.test(String(item.derivedIdentitySha256||""))
    && /^[0-9a-f]{64}$/.test(String(item.contentSha256||""))
  );
  dailyDisclosureLanes.push({
    sourceId:cfg.sourceId,
    exchange:cfg.exchange,
    laneClass:"DAILY_MATERIAL_INFORMATION_SNAPSHOT",
    state:parserComplete?"READY":"BLOCKED",
    payloadHash:await sha256Hex(fetched.rawText),
    observedAt:fetched.capturedAt,
    parserComplete,
    queryComplete:parserComplete,
    queryTruncated:false,
    rowCount:snapshot.rowCount,
    distinctIdentityCount:snapshot.distinctDerivedIdentityCount,
    emptySnapshotCertified:false,
  });
}
assert.equal(dailyDisclosureLanes.length,2);

const evidenceCutoffAt=new Date().toISOString();
const preflight=await buildEightLaneSourceCutPreflightV1_5({
  scanDate:END,
  evidenceCutoffAt,
  intervalStartDate:START,
  intervalEndDate:END,
  historicalLanes,
  dailyDisclosureLanes,
});

console.log(JSON.stringify({
  result:"S2_07_EIGHT_LANE_SOURCE_CUT_V1_5_PHYSICAL",
  interval:{startDate:START,endDate:END},
  evidenceCutoffAt,
  historicalLanes:historicalLanes.map(x=>({
    sourceId:x.sourceId,state:x.state,payloadHash:x.payloadHash,observedAt:x.observedAt,
    responseRangeVerified:x.responseRangeVerified,parserComplete:x.parserComplete,eventCount:x.events.length,
  })),
  dailyDisclosureLanes,
  preflight:{
    state:preflight.state,
    blockers:preflight.blockers,
    sourceCutPreflightId:preflight.sourceCutPreflightId,
    sourceLaneManifestHash:preflight.sourceLaneManifestHash,
    observedLaneCount:preflight.observedLaneCount,
    readyLaneCount:preflight.readyLaneCount,
    corporateActionEventCount:preflight.corporateActionEventCount,
    requiredMopsLookupCount:preflight.requiredMopsLookupCount,
    requiredMopsLookupKeys:preflight.requiredMopsLookupKeys,
    eightLaneSourceCutReady:preflight.eightLaneSourceCutReady,
    mopsProspectiveExactVersionLayerReady:preflight.mopsProspectiveExactVersionLayerReady,
    preCutManifestReady:preflight.preCutManifestReady,
    noRevisionGapThroughCut:preflight.noRevisionGapThroughCut,
    parentBindingPending:preflight.parentBindingPending,
  },
  authority:{
    technicalContinuityCertified:preflight.technicalContinuityCertified,
    selectionAuthority:preflight.selectionAuthority,
    finalSelectionEnabled:preflight.finalSelectionEnabled,
    livePushEnabled:preflight.livePushEnabled,
    capitalImpact:preflight.capitalImpact,
    orderImpact:preflight.orderImpact,
    system1RuntimeUsed:preflight.system1RuntimeUsed,
  },
},null,2));

assert.equal(preflight.observedLaneCount,8);
assert.equal(preflight.readyLaneCount,8);
assert.equal(preflight.eightLaneSourceCutReady,true);
assert.equal(preflight.state,"EIGHT_LANE_SOURCE_CUT_READY_MOPS_PENDING");
assert.ok(preflight.requiredMopsLookupCount>0);
assert.equal(preflight.mopsProspectiveExactVersionLayerReady,false);
assert.equal(preflight.preCutManifestReady,false);
assert.equal(preflight.noRevisionGapThroughCut,false);
assert.equal(preflight.technicalContinuityCertified,false);
assert.equal(preflight.selectionAuthority,false);
assert.equal(preflight.system1RuntimeUsed,false);
