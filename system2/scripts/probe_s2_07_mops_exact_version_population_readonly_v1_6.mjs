import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";
import { issuerScopeEligibleV0_5, familyMatchV0_5 } from "../runtime/s2_07_event_specific_linkage_v0_5.mjs";
import {
  buildMopsExactVersionObservationV1_6,
  buildProspectiveMopsExactVersionPopulationReceiptV1_6,
} from "../runtime/s2_07_mops_exact_version_population_v1_6.mjs";

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
    m+=1;if(m===13){m=1;y+=1;}
  }
  return out;
}
function localVersionKey(row){return [row?.date||"",row?.time||"",row?.seqNo||""].join("|");}

function curlHistory(symbol,year,month){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30","--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-S2-07-MOPS-Exact-Version/1.6",
    "--data-urlencode","firstin=1","--data-urlencode","step=1","--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+symbol,
    "--data-urlencode","year="+String(year-1911),
    "--data-urlencode","month="+String(month),
    "--data-urlencode","b_date=","--data-urlencode","e_date=",
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
  const noPaginationHint=!/下一頁|下頁|next\s*page|pageNo|pageno|currPage|totalPage|total_page|pageIndex|step\s*=\s*["']?3|step=3/i.test(html);
  return {ok:true,rows:[...(parsed.rows||[])],observedAt,noPaginationHint,rowCount:Number(parsed.rowCount||0)};
}

async function fetchTextWithRetry(url,{attempts=4,timeoutMs=30000}={}){
  let last=null;
  for(let attempt=1;attempt<=attempts;attempt+=1){
    try{
      const response=await fetch(url,{
        headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-S2-07-MOPS-Exact-Version/1.6"},
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
    sourceId,sourceUrl:source.url,rawText:f.rawText,fetchedAt:f.observedAt,
    requestedStartDate:EVENT_START,requestedEndDate:EVENT_END,
  });
  assert.equal(parsed.responseRangeVerified,true,sourceId+" range");
  assert.equal(parsed.parserComplete,true,sourceId+" parser");
  for(const event of parsed.events){
    frozenEvents.push({sourceId,symbol:event.symbol,effectiveDate:event.effectiveDate,family});
  }
}
assert.equal(frozenEvents.length,23,"frozen low-volume event count drift");
assert.equal(new Set(frozenEvents.map(e=>e.symbol)).size,23,"frozen unique symbol count drift");

const annualCache=new Map();
const monthCache=new Map();
async function annual(symbol,year){
  const k=symbol+"|"+year;
  if(annualCache.has(k)) return annualCache.get(k);
  const r=curlHistory(symbol,year,"all");
  annualCache.set(k,r);
  await sleep(40);
  return r;
}
async function month(symbol,year,mon){
  const k=[symbol,year,mon].join("|");
  if(monthCache.has(k)) return monthCache.get(k);
  const r=curlHistory(symbol,year,mon);
  monthCache.set(k,r);
  await sleep(40);
  return r;
}

const observations=[];
const queryDiagnostics=[];

for(const event of frozenEvents){
  const queryStart=minusDays(event.effectiveDate,400);
  const months=monthRange(queryStart,CAPTURE_END);
  const years=[...new Set(months.map(x=>x.year))];

  const annualObserved=[];
  let transportReady=true,annualQueriesReady=true,monthShardQueriesReady=true,noPaginationHint=true;
  for(const year of years){
    const r=await annual(event.symbol,year);
    transportReady&&=r.ok;annualQueriesReady&&=r.ok;noPaginationHint&&=r.noPaginationHint;
    for(const row of r.rows){
      if(row?.date&&row.date>=queryStart&&row.date<=CAPTURE_END&&issuerScopeEligibleV0_5(row.rowText)&&familyMatchV0_5(row.rowText,event.family)){
        const o=await buildMopsExactVersionObservationV1_6({
          stockCode:event.symbol,row,observedAt:r.observedAt,sourceQueryRef:event.symbol+"|"+year+"|all",
        });
        annualObserved.push(o);
      }
    }
  }

  const monthObserved=[];
  for(const ym of months){
    const r=await month(event.symbol,ym.year,ym.month);
    transportReady&&=r.ok;monthShardQueriesReady&&=r.ok;noPaginationHint&&=r.noPaginationHint;
    for(const row of r.rows){
      if(row?.date&&row.date>=queryStart&&row.date<=CAPTURE_END&&issuerScopeEligibleV0_5(row.rowText)&&familyMatchV0_5(row.rowText,event.family)){
        const o=await buildMopsExactVersionObservationV1_6({
          stockCode:event.symbol,row,observedAt:r.observedAt,sourceQueryRef:event.symbol+"|"+ym.year+"|"+String(ym.month).padStart(2,"0"),
        });
        monthObserved.push(o);
      }
    }
  }

  const annualMap=new Map(annualObserved.filter(x=>x.eligible).map(x=>[x.versionKey,x]));
  const monthMap=new Map(monthObserved.filter(x=>x.eligible).map(x=>[x.versionKey,x]));
  const yearOnly=[...annualMap.keys()].filter(k=>!monthMap.has(k));
  const monthOnly=[...monthMap.keys()].filter(k=>!annualMap.has(k));
  const common=[...annualMap.keys()].filter(k=>monthMap.has(k));
  const payloadMismatch=common.filter(k=>annualMap.get(k).versionPayloadHash!==monthMap.get(k).versionPayloadHash);

  // Month-shard union is the more inclusive prospective capture population.
  observations.push(...monthMap.values());
  queryDiagnostics.push({
    sourceId:event.sourceId,
    symbol:event.symbol,
    family:event.family,
    effectiveDate:event.effectiveDate,
    queryStartDate:queryStart,
    queryEndDate:CAPTURE_END,
    queriedYearCount:years.length,
    monthShardQueryCount:months.length,
    transportReady,
    annualQueriesReady,
    monthShardQueriesReady,
    noPaginationHint,
    annualFamilyVersionCount:annualMap.size,
    monthFamilyVersionCount:monthMap.size,
    annualVsMonthKeysetExact:yearOnly.length===0&&monthOnly.length===0&&payloadMismatch.length===0,
    yearOnlyVersionCount:yearOnly.length,
    monthOnlyVersionCount:monthOnly.length,
    commonPayloadMismatchCount:payloadMismatch.length,
    yearOnlyVersionKeys:yearOnly.sort(),
    monthOnlyVersionKeys:monthOnly.sort(),
    payloadMismatchVersionKeys:payloadMismatch.sort(),
    sourceSemanticsCertified:false,
    monthShardCoverageComplete:false,
  });
}

const capturedAt=new Date().toISOString();
const receipt=await buildProspectiveMopsExactVersionPopulationReceiptV1_6({
  frozenEvents,observations,queryDiagnostics,capturedAt,
});

assert.equal(receipt.frozenEventCount,23);
assert.equal(receipt.frozenUniqueSymbolCount,23);
assert.equal(receipt.coveredSymbolCount,23);
assert.equal(receipt.prospectiveExactVersionCaptureReady,true,JSON.stringify(receipt.blockers));
assert.equal(receipt.expectedMopsKeysetComplete,false);
assert.equal(receipt.noRevisionGapThroughCut,false);
assert.equal(receipt.preParentEvidenceCutReady,false);
assert.equal(receipt.sourceSemanticsCertified,false);
assert.equal(receipt.monthShardCoverageComplete,false);
assert.equal(receipt.technicalContinuityCertified,false);
assert.equal(receipt.scheduleAdded,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);

const artifact={
  schemaVersion:"S2_S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_PHYSICAL",
  recordedDate:"2026-10-07",
  frozenEventInterval:{startDate:EVENT_START,endDate:EVENT_END},
  captureThroughDate:CAPTURE_END,
  frozenEvents,
  queryDiagnostics,
  receipt,
};
await writeFile("/tmp/S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_PHYSICAL_20261007.json",JSON.stringify(artifact,null,2)+"\n","utf8");

console.log(JSON.stringify({
  result:"S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_COMPLETE",
  capturedAt,
  state:receipt.state,
  frozenEventCount:receipt.frozenEventCount,
  frozenUniqueSymbolCount:receipt.frozenUniqueSymbolCount,
  stableEventUniverseHash:receipt.stableEventUniverseHash,
  prospectivePopulationHash:receipt.prospectivePopulationHash,
  uniqueGlobalVersionKeyCount:receipt.uniqueGlobalVersionKeyCount,
  coveredSymbolCount:receipt.coveredSymbolCount,
  queryKeysetExactEventCount:receipt.queryKeysetExactEventCount,
  monthOnlyVersionCount:receipt.monthOnlyVersionCount,
  yearOnlyVersionCount:receipt.yearOnlyVersionCount,
  sourceClockVersionKeyCollisionCount:receipt.sourceClockVersionKeyCollisionCount,
  expectedMopsKeysetComplete:receipt.expectedMopsKeysetComplete,
  noRevisionGapThroughCut:receipt.noRevisionGapThroughCut,
  nextGate:"MOPS_MONTH_SHARD_SOURCE_SEMANTICS_AND_COMPLETE_EXPECTED_KEYSET",
},null,2));
