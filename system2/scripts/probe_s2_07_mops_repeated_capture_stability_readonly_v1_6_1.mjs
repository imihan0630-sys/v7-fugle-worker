import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";
import { issuerScopeEligibleV0_5, familyMatchV0_5 } from "../runtime/s2_07_event_specific_linkage_v0_5.mjs";
import { buildMopsExactVersionObservationV1_6 } from "../runtime/s2_07_mops_exact_version_population_v1_6.mjs";
import { reconcileMopsRepeatedCapturesV1_6_1 } from "../runtime/s2_07_mops_repeated_capture_stability_v1_6_1.mjs";

const EVENT_START="2026-04-05";
const EVENT_END="2026-10-02";
const CAPTURE_END="2026-10-07";
const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const LANES={
  TWSE_CAPITAL_REDUCTION_REFERENCE:"CAPITAL_REDUCTION",
  TWSE_PAR_VALUE_CHANGE_REFERENCE:"PAR_VALUE_CHANGE",
  TPEX_CAPITAL_REDUCTION_REFERENCE:"CAPITAL_REDUCTION",
  TPEX_PAR_VALUE_CHANGE_REFERENCE:"PAR_VALUE_CHANGE",
};

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function minusDays(iso,n){return new Date(Date.parse(iso+"T00:00:00Z")-n*86400000).toISOString().slice(0,10);}
function monthRange(start,end){
  const a=new Date(start+"T00:00:00Z"),b=new Date(end+"T00:00:00Z"),out=[];
  let y=a.getUTCFullYear(),m=a.getUTCMonth()+1;
  while(y<b.getUTCFullYear()||(y===b.getUTCFullYear()&&m<=b.getUTCMonth()+1)){
    out.push({year:y,month:m});
    m+=1;
    if(m===13){m=1;y+=1;}
  }
  return out;
}

function curlHistory(symbol,year,month){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--retry","3","--retry-delay","1","--retry-all-errors","--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-S2-07-MOPS-Repeated-Capture/1.6.1",
    "--data-urlencode","firstin=1",
    "--data-urlencode","step=1",
    "--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+symbol,
    "--data-urlencode","year="+String(year-1911),
    "--data-urlencode","month="+String(month),
    "--data-urlencode","b_date=",
    "--data-urlencode","e_date=",
    MOPS_URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
  const observedAt=new Date().toISOString();
  if(p.error||p.status!==0){
    return {ok:false,rows:[],observedAt,noPaginationHint:false,error:String(p.stderr||p.error||"curl failure").slice(0,400)};
  }
  const html=p.stdout;
  let parsed;
  try{
    parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({html,stockCode:symbol,expectedDate:null,baseSubject:null});
  }catch(error){
    return {ok:false,rows:[],observedAt,noPaginationHint:false,error:String(error?.message||error)};
  }
  return {
    ok:true,
    rows:[...(parsed.rows||[])],
    observedAt,
    noPaginationHint:!/下一頁|下頁|next\s*page|pageNo|pageno|currPage|totalPage|total_page|pageIndex|step\s*=\s*["']?3|step=3/i.test(html),
    rowCount:Number(parsed.rowCount||0),
  };
}

async function fetchTextWithRetry(url,{attempts=4,timeoutMs=30000}={}){
  let last=null;
  for(let attempt=1;attempt<=attempts;attempt+=1){
    try{
      const response=await fetch(url,{
        headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-S2-07-MOPS-Repeated-Capture/1.6.1"},
        signal:AbortSignal.timeout(timeoutMs),
      });
      const rawText=await response.text();
      if(response.ok) return {rawText,observedAt:new Date().toISOString()};
      last=new Error("HTTP "+response.status);
    }catch(error){last=error;}
    if(attempt<attempts) await sleep(400*attempt);
  }
  throw last||new Error("official source fetch failed");
}

const sourceUrls=buildOfficialContinuitySourceUrlsV0_1({startDate:EVENT_START,endDate:EVENT_END});
const frozenEvents=[];
for(const [sourceId,family] of Object.entries(LANES)){
  const source=sourceUrls[sourceId];
  const f=await fetchTextWithRetry(source.url);
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,
    sourceUrl:source.url,
    rawText:f.rawText,
    fetchedAt:f.observedAt,
    requestedStartDate:EVENT_START,
    requestedEndDate:EVENT_END,
  });
  assert.equal(parsed.responseRangeVerified,true,sourceId+" range");
  assert.equal(parsed.parserComplete,true,sourceId+" parser");
  for(const event of parsed.events){
    frozenEvents.push({
      sourceId,
      symbol:event.symbol,
      effectiveDate:event.effectiveDate,
      family,
    });
  }
}
assert.equal(frozenEvents.length,23,"frozen low-volume event count drift");
assert.equal(new Set(frozenEvents.map(e=>e.symbol)).size,23,"frozen unique symbol count drift");

const stableEvents=frozenEvents.map(e=>({
  sourceId:e.sourceId,
  symbol:e.symbol,
  effectiveDate:e.effectiveDate,
  family:e.family,
})).sort((a,b)=>[a.sourceId,a.symbol,a.effectiveDate,a.family].join("|").localeCompare([b.sourceId,b.symbol,b.effectiveDate,b.family].join("|")));
const stableEventUniverseHash=await sha256Hex({
  interval:{startDate:EVENT_START,endDate:EVENT_END},
  events:stableEvents,
});

async function capturePass(label){
  const observationsByKey=new Map();
  const diagnostics=[];
  const payloadConflicts=new Set();

  for(const event of frozenEvents){
    const queryStart=minusDays(event.effectiveDate,400);
    const months=monthRange(queryStart,CAPTURE_END);
    let transportReady=true;
    let noPaginationHint=true;
    const eventKeys=new Set();

    for(const ym of months){
      const r=curlHistory(event.symbol,ym.year,ym.month);
      transportReady&&=r.ok;
      noPaginationHint&&=r.noPaginationHint;
      for(const row of r.rows){
        if(!row?.date||row.date<queryStart||row.date>CAPTURE_END) continue;
        if(!issuerScopeEligibleV0_5(row.rowText)||!familyMatchV0_5(row.rowText,event.family)) continue;
        const obs=await buildMopsExactVersionObservationV1_6({
          stockCode:event.symbol,
          row,
          observedAt:r.observedAt,
          sourceQueryRef:[label,event.symbol,ym.year,String(ym.month).padStart(2,"0")].join("|"),
        });
        if(obs.eligible!==true) continue;
        eventKeys.add(obs.versionKey);
        const prev=observationsByKey.get(obs.versionKey);
        if(prev&&prev.versionPayloadHash!==obs.versionPayloadHash){
          payloadConflicts.add(obs.versionKey);
        }else if(!prev||Date.parse(obs.firstObservedAt)<Date.parse(prev.firstObservedAt)){
          observationsByKey.set(obs.versionKey,obs);
        }
      }
      await sleep(35);
    }

    diagnostics.push({
      label,
      sourceId:event.sourceId,
      symbol:event.symbol,
      family:event.family,
      effectiveDate:event.effectiveDate,
      queryStartDate:queryStart,
      queryEndDate:CAPTURE_END,
      monthShardQueryCount:months.length,
      transportReady,
      noPaginationHint,
      exactVersionCount:eventKeys.size,
    });
  }

  const observations=[...observationsByKey.values()].sort((a,b)=>a.versionKey.localeCompare(b.versionKey));
  const coveredSymbols=new Set(observations.map(o=>o.stockCode));
  const captureReady=
    diagnostics.length===23
    && diagnostics.every(d=>d.transportReady===true&&d.noPaginationHint===true&&d.exactVersionCount>0)
    && coveredSymbols.size===23
    && payloadConflicts.size===0;

  return {
    label,
    capturedAt:new Date().toISOString(),
    stableEventUniverseHash,
    repeatedCaptureReady:captureReady,
    observations,
    diagnostics,
    payloadConflictVersionKeys:[...payloadConflicts].sort(),
  };
}

const captureA=await capturePass("A");
const captureB=await capturePass("B");

const reconciliation=await reconcileMopsRepeatedCapturesV1_6_1({
  captures:[captureA,captureB],
  requiredStableTailCount:3,
});

const artifact={
  schemaVersion:"S2_S2_07_MOPS_REPEATED_CAPTURE_STABILITY_V1_6_1_PHYSICAL",
  recordedDate:"2026-10-07",
  frozenEventInterval:{startDate:EVENT_START,endDate:EVENT_END},
  captureThroughDate:CAPTURE_END,
  stableEventUniverseHash,
  frozenEvents,
  captures:[
    {
      label:captureA.label,
      capturedAt:captureA.capturedAt,
      repeatedCaptureReady:captureA.repeatedCaptureReady,
      versionCount:captureA.observations.length,
      diagnostics:captureA.diagnostics,
      observations:captureA.observations,
    },
    {
      label:captureB.label,
      capturedAt:captureB.capturedAt,
      repeatedCaptureReady:captureB.repeatedCaptureReady,
      versionCount:captureB.observations.length,
      diagnostics:captureB.diagnostics,
      observations:captureB.observations,
    },
  ],
  reconciliation,
};
await writeFile("/tmp/S2_07_MOPS_REPEATED_CAPTURE_STABILITY_V1_6_1_PHYSICAL_20261007.json",JSON.stringify(artifact,null,2)+"\n","utf8");

console.log(JSON.stringify({
  result:"S2_07_MOPS_REPEATED_CAPTURE_STABILITY_V1_6_1_COMPLETE",
  state:reconciliation.state,
  stableEventUniverseHash,
  captureVersionCounts:reconciliation.perCaptureVersionCounts,
  unionVersionCount:reconciliation.unionVersionCount,
  intersectionVersionCount:reconciliation.intersectionVersionCount,
  membershipDriftObserved:reconciliation.membershipDriftObserved,
  transition:reconciliation.transitions[0],
  payloadConflictCount:reconciliation.payloadConflictCount,
  stableTailCount:reconciliation.stableTailCount,
  requiredStableTailCount:reconciliation.requiredStableTailCount,
  expectedMopsKeysetComplete:reconciliation.expectedMopsKeysetComplete,
  noRevisionGapThroughCut:reconciliation.noRevisionGapThroughCut,
  nextGate:"REPEATED_CAPTURE_STABILITY_PLUS_SOURCE_SEMANTICS",
},null,2));

assert.equal(captureA.repeatedCaptureReady,true,JSON.stringify(captureA.diagnostics.filter(d=>!d.transportReady||!d.noPaginationHint||d.exactVersionCount===0)));
assert.equal(captureB.repeatedCaptureReady,true,JSON.stringify(captureB.diagnostics.filter(d=>!d.transportReady||!d.noPaginationHint||d.exactVersionCount===0)));
assert.equal(reconciliation.reconciliationReady,true,JSON.stringify(reconciliation.blockers));
assert.equal(reconciliation.payloadConflictCount,0);
assert.equal(reconciliation.captureCount,2);
assert.equal(reconciliation.expectedMopsKeysetComplete,false);
assert.equal(reconciliation.noRevisionGapThroughCut,false);
assert.equal(reconciliation.preParentEvidenceCutReady,false);
assert.equal(reconciliation.technicalContinuityCertified,false);
assert.equal(reconciliation.scheduleAdded,false);
assert.equal(reconciliation.selectionAuthority,false);
assert.equal(reconciliation.system1RuntimeUsed,false);
