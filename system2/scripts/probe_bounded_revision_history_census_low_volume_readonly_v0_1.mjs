import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";
import { buildBoundedRevisionHistoryCensusV0_1 } from "../runtime/bounded_revision_history_census_v0_1.mjs";

const START="2026-04-05";
const END="2026-10-02";
const YEARS=[2025,2026];
const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const LOW_LANES=[
  "TWSE_CAPITAL_REDUCTION_REFERENCE",
  "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  "TPEX_CAPITAL_REDUCTION_REFERENCE",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE",
];

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

function familyRows(rows,family){
  if(family==="CAPITAL_REDUCTION"){
    return rows.filter(row=>/減資/.test(String(row.rowText||"")));
  }
  return rows.filter(row=>{
    const text=String(row.rowText||"");
    if(/財務報告|合併財務|個體財務|每股盈餘|每股淨值/.test(text)) return false;
    return /股票面額變更|變更股票面額|變更.*股票面額|每股面額變更|面額變更.*換發|換發.*股票面額/.test(text);
  });
}

function fetchMopsYear(stockCode,rocYear){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-Bounded-Revision-Census/0.1",
    "--data-urlencode","firstin=1",
    "--data-urlencode","step=1",
    "--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+stockCode,
    "--data-urlencode","year="+rocYear,
    "--data-urlencode","month=all",
    "--data-urlencode","b_date=",
    "--data-urlencode","e_date=",
    "--write-out","\n__STATUS__:%{http_code}\n",
    MOPS_URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error) throw p.error;
  if(p.status!==0) return {ok:false,httpStatus:0,rows:[],error:String(p.stderr||"").slice(0,500)};
  const marker="\n__STATUS__:";
  const pos=p.stdout.lastIndexOf(marker);
  if(pos<0) return {ok:false,httpStatus:0,rows:[],error:"status marker missing"};
  const html=p.stdout.slice(0,pos);
  const status=Number(p.stdout.slice(pos).match(/__STATUS__:(\d+)/)?.[1]||0);
  let parsed;
  try{
    parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
      html,stockCode,expectedDate:null,baseSubject:null,
    });
  }catch(error){
    return {ok:false,httpStatus:status,rows:[],error:String(error?.message||error)};
  }
  return {ok:status===200,httpStatus:status,rows:[...(parsed.rows||[])],rowCount:parsed.rowCount};
}

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const laneEvents={};
const finalDiagnostics=[];

for(const sourceId of LOW_LANES){
  const source=urls[sourceId];
  const response=await fetch(source.url,{
    headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-Bounded-Revision-Census/0.1"},
    signal:AbortSignal.timeout(30000),
  });
  const rawText=await response.text();
  assert.equal(response.ok,true,sourceId+" HTTP "+response.status);
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,sourceUrl:source.url,rawText,fetchedAt:new Date().toISOString(),
    requestedStartDate:START,requestedEndDate:END,
  });
  assert.equal(parsed.responseRangeVerified,true,sourceId+" range");
  assert.equal(parsed.parserComplete,true,sourceId+" parser");
  laneEvents[sourceId]=parsed.events.map(event=>({
    symbol:event.symbol,effectiveDate:event.effectiveDate,eventVersionId:event.eventVersionId,
  }));
  finalDiagnostics.push({sourceId,eventCount:parsed.eventCount,state:parsed.state});
}

const symbols=[...new Set(Object.values(laneEvents).flat().map(x=>x.symbol))].sort();
const issuerHistories={};

for(let si=0;si<symbols.length;si+=1){
  const symbol=symbols[si];
  const yearPayloads=[];
  let transportReady=true;
  const allRows=[];
  for(let yi=0;yi<YEARS.length;yi+=1){
    const year=YEARS[yi];
    const result=fetchMopsYear(symbol,year-1911);
    yearPayloads.push({year,httpStatus:result.httpStatus,rowCount:result.rowCount??0,ok:result.ok,error:result.error||null});
    if(!result.ok) transportReady=false;
    allRows.push(...result.rows);
    if(!(si===symbols.length-1 && yi===YEARS.length-1)) await sleep(350);
  }
  const boundedRows=allRows.filter(row=>row.date && row.date<=END);
  issuerHistories[symbol]={
    transportReady,
    queriedYears:[...YEARS],
    payloadCount:yearPayloads.length,
    payloads:yearPayloads,
    familyRowsByActionFamily:{
      CAPITAL_REDUCTION:familyRows(boundedRows,"CAPITAL_REDUCTION"),
      PAR_VALUE_CHANGE:familyRows(boundedRows,"PAR_VALUE_CHANGE"),
    },
  };
}

const census=await buildBoundedRevisionHistoryCensusV0_1({
  startDate:START,endDate:END,laneEvents,issuerHistories,generatedAt:new Date().toISOString(),
});

assert.equal(census.requiredLaneCount,4);
assert.equal(census.finalEventCount,23);
assert.equal(census.boundedEventUniverseFrozen,true);
assert.equal(census.boundedRevisionHistoryCoverageComplete,false);
assert.equal(census.knownAtVersionClockCertified,false);
assert.equal(census.revisionCoverageComplete,false);
assert.equal(census.selectionAuthority,false);
assert.equal(census.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:"LOW_VOLUME_BOUNDED_REVISION_HISTORY_CENSUS_COMPLETE",
  finalDiagnostics,
  symbolQueryCount:symbols.length,
  census,
},null,2));
