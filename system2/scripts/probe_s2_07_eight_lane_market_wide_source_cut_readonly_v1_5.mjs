import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import {
  REQUIRED_SOURCE_LANE_IDS_V1_5,
  buildEightLaneMarketWideSourceCutV1_5,
} from "../runtime/s2_07_eight_lane_market_wide_source_cut_v1_5.mjs";

const START="2026-04-05";
const END="2026-10-07";
const RANGE_IDS=REQUIRED_SOURCE_LANE_IDS_V1_5.filter((x)=>!x.includes("DAILY_MATERIAL"));
const DAILY_SOURCES={
  TWSE_DAILY_MATERIAL_INFORMATION:{
    exchange:"TWSE",
    url:"https://openapi.twse.com.tw/v1/opendata/t187ap04_L",
    symbolFields:["公司代號","CompanyCode","SecuritiesCompanyCode"],
  },
  TPEX_DAILY_MATERIAL_INFORMATION:{
    exchange:"TPEX",
    url:"https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap04_O",
    symbolFields:["SecuritiesCompanyCode","公司代號","CompanyCode"],
  },
};

function sleep(ms){return new Promise((resolve)=>setTimeout(resolve,ms));}

async function fetchTextWithRetry(url,{attempts=4,timeoutMs=30000}={}){
  let last=null;
  for(let attempt=1;attempt<=attempts;attempt+=1){
    try{
      const response=await fetch(url,{
        method:"GET",
        redirect:"follow",
        headers:{
          accept:"application/json,text/plain,*/*",
          "user-agent":"System2-S2-07-Eight-Lane-Source-Cut/1.5",
        },
        signal:AbortSignal.timeout(timeoutMs),
      });
      const rawText=await response.text();
      const observedAt=new Date().toISOString();
      if(response.ok) return {response,rawText,observedAt,attempt};
      last=new Error("HTTP "+response.status);
    }catch(error){
      last=error;
    }
    if(attempt<attempts) await sleep(500*attempt);
  }
  throw last||new Error("official source fetch failed");
}

function ordinarySymbolCount(rows,fields){
  const symbols=new Set();
  for(const row of rows){
    if(!row||typeof row!=="object"||Array.isArray(row)) continue;
    let value=null;
    for(const field of fields){
      if(row[field]!=null&&String(row[field]).trim()){
        value=String(row[field]).trim();
        break;
      }
    }
    if(/^[1-9][0-9]{3}$/.test(value||"")) symbols.add(value);
  }
  return symbols.size;
}

const sources=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const lanes=[];

for(const sourceId of RANGE_IDS){
  const source=sources[sourceId];
  assert.ok(source,"missing source contract "+sourceId);
  const fetched=await fetchTextWithRetry(source.url);
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,
    sourceUrl:source.url,
    rawText:fetched.rawText,
    fetchedAt:fetched.observedAt,
    requestedStartDate:START,
    requestedEndDate:END,
  });
  lanes.push({
    sourceId,
    exchange:source.exchange,
    sourceClass:"HISTORICAL_ACTUAL_RESULT_RANGE",
    state:parsed.responseRangeVerified===true&&parsed.parserComplete===true?"READY":"BLOCKED",
    payloadHash:parsed.payloadHash,
    observedAt:fetched.observedAt,
    rowCount:parsed.rawRowCount,
    ordinarySymbolCount:parsed.ordinaryRowCount,
    parserComplete:parsed.parserComplete===true,
    queryComplete:parsed.responseRangeVerified===true&&parsed.parserComplete===true,
    queryTruncated:false,
    requiresRangeIdentity:true,
    responseRangeVerified:parsed.responseRangeVerified===true,
    transportAttempt:fetched.attempt,
    parserState:parsed.state,
  });
}

for(const [sourceId,source] of Object.entries(DAILY_SOURCES)){
  const fetched=await fetchTextWithRetry(source.url);
  let rows=null;
  let parseError=null;
  try{
    const parsed=JSON.parse(fetched.rawText);
    if(Array.isArray(parsed)) rows=parsed;
    else parseError="TOP_LEVEL_NOT_ARRAY";
  }catch(error){
    parseError=String(error?.message||error);
  }
  const parserComplete=Array.isArray(rows)&&rows.every((row)=>row&&typeof row==="object"&&!Array.isArray(row));
  lanes.push({
    sourceId,
    exchange:source.exchange,
    sourceClass:"CURRENT_DAILY_MATERIAL_INFORMATION_SNAPSHOT",
    state:parserComplete?"READY":"BLOCKED",
    payloadHash:await sha256Hex(fetched.rawText),
    observedAt:fetched.observedAt,
    rowCount:Array.isArray(rows)?rows.length:0,
    ordinarySymbolCount:Array.isArray(rows)?ordinarySymbolCount(rows,source.symbolFields):0,
    parserComplete,
    queryComplete:parserComplete,
    queryTruncated:false,
    requiresRangeIdentity:false,
    responseRangeVerified:false,
    transportAttempt:fetched.attempt,
    parserState:parserComplete?"TOP_LEVEL_OBJECT_ARRAY_READY":"PARSE_BLOCKED",
    parseError,
  });
}

const evidenceCutoffAt=new Date().toISOString();
const cut=await buildEightLaneMarketWideSourceCutV1_5({
  scanDate:END,
  evidenceCutoffAt,
  sourceLanes:lanes,
});

const artifact={
  schemaVersion:"S2_S2_07_EIGHT_LANE_MARKET_WIDE_SOURCE_CUT_V1_5_PHYSICAL",
  recordedDate:"2026-10-07",
  interval:{startDate:START,endDate:END},
  evidenceCutoffAt,
  sourceLanes:lanes,
  cut,
  authority:{
    scheduleAdded:cut.scheduleAdded,
    expectedMopsKeysetComplete:cut.expectedMopsKeysetComplete,
    noRevisionGapThroughCut:cut.noRevisionGapThroughCut,
    preParentEvidenceCutReady:cut.preParentEvidenceCutReady,
    symbolSessionCompletenessCertified:cut.symbolSessionCompletenessCertified,
    technicalContinuityCertified:cut.technicalContinuityCertified,
    historyMutationPerformed:cut.historyMutationPerformed,
    selectionAuthority:cut.selectionAuthority,
    finalSelectionEnabled:cut.finalSelectionEnabled,
    livePushEnabled:cut.livePushEnabled,
    capitalImpact:cut.capitalImpact,
    orderImpact:cut.orderImpact,
    system1RuntimeUsed:cut.system1RuntimeUsed,
  },
};

await writeFile("/tmp/S2_07_EIGHT_LANE_MARKET_WIDE_SOURCE_CUT_V1_5_PHYSICAL_20261007.json",JSON.stringify(artifact,null,2)+"\n","utf8");

assert.equal(cut.eightLaneSourceCutReady,true,JSON.stringify(cut.blockers));
assert.equal(cut.sourceLaneCount,8);
assert.equal(cut.eligibleSourceLaneCount,8);
assert.equal(cut.twseLaneCount,4);
assert.equal(cut.tpexLaneCount,4);
assert.equal(cut.expectedMopsKeysetComplete,false);
assert.equal(cut.noRevisionGapThroughCut,false);
assert.equal(cut.preParentEvidenceCutReady,false);
assert.equal(cut.symbolSessionCompletenessCertified,false);
assert.equal(cut.technicalContinuityCertified,false);
assert.equal(cut.scheduleAdded,false);
assert.equal(cut.selectionAuthority,false);
assert.equal(cut.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:"S2_07_EIGHT_LANE_MARKET_WIDE_SOURCE_CUT_V1_5_COMPLETE",
  evidenceCutoffAt,
  state:cut.state,
  sourceCutId:cut.sourceCutId,
  sourceLaneManifestHash:cut.sourceLaneManifestHash,
  lanes:lanes.map((x)=>({
    sourceId:x.sourceId,
    exchange:x.exchange,
    state:x.state,
    payloadHash:x.payloadHash,
    observedAt:x.observedAt,
    rowCount:x.rowCount,
    ordinarySymbolCount:x.ordinarySymbolCount,
    responseRangeVerified:x.responseRangeVerified,
  })),
  remainingGates:{
    expectedMopsKeysetComplete:cut.expectedMopsKeysetComplete,
    noRevisionGapThroughCut:cut.noRevisionGapThroughCut,
    preParentEvidenceCutReady:cut.preParentEvidenceCutReady,
    symbolSessionCompletenessCertified:cut.symbolSessionCompletenessCertified,
    technicalContinuityCertified:cut.technicalContinuityCertified,
  },
},null,2));
