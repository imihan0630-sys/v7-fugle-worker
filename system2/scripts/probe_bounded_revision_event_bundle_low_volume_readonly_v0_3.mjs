import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import {
  classifyBoundedRevisionEventBundleV0_3,
  summarizeBoundedRevisionEventBundlesV0_3,
} from "../runtime/bounded_revision_event_bundle_v0_3.mjs";

const START="2026-04-05";
const END="2026-10-02";
const HISTORY_START="2025-01-01";
const YEARS=[2025,2026];
const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const LEGACY_CAPTURE_SPECIFIC_UNIVERSE_HASH="3e31779c36582bd70378d4b393ce0d4b2510bb84fe557686a0e51d3a2f604049";
const EXPECTED_STABLE_EVENT_KEYS=Object.freeze([
  "TPEX_CAPITAL_REDUCTION_REFERENCE|3152|2026-06-30",
  "TPEX_CAPITAL_REDUCTION_REFERENCE|3710|2026-09-21",
  "TPEX_CAPITAL_REDUCTION_REFERENCE|4806|2026-10-02",
  "TPEX_CAPITAL_REDUCTION_REFERENCE|5381|2026-04-13",
  "TPEX_CAPITAL_REDUCTION_REFERENCE|6129|2026-09-14",
  "TPEX_CAPITAL_REDUCTION_REFERENCE|6241|2026-08-25",
  "TPEX_CAPITAL_REDUCTION_REFERENCE|6461|2026-09-09",
  "TPEX_CAPITAL_REDUCTION_REFERENCE|8059|2026-09-21",
  "TPEX_CAPITAL_REDUCTION_REFERENCE|8277|2026-09-21",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE|3086|2026-04-20",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE|4747|2026-08-31",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE|5904|2026-08-10",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE|8937|2026-04-13",
  "TWSE_CAPITAL_REDUCTION_REFERENCE|1441|2026-09-29",
  "TWSE_CAPITAL_REDUCTION_REFERENCE|1459|2026-08-03",
  "TWSE_CAPITAL_REDUCTION_REFERENCE|1563|2026-09-07",
  "TWSE_CAPITAL_REDUCTION_REFERENCE|2321|2026-09-21",
  "TWSE_CAPITAL_REDUCTION_REFERENCE|2380|2026-06-29",
  "TWSE_CAPITAL_REDUCTION_REFERENCE|3356|2026-09-21",
  "TWSE_CAPITAL_REDUCTION_REFERENCE|3591|2026-09-21",
  "TWSE_CAPITAL_REDUCTION_REFERENCE|6176|2026-08-24",
  "TWSE_CAPITAL_REDUCTION_REFERENCE|6550|2026-09-29",
  "TWSE_PAR_VALUE_CHANGE_REFERENCE|6949|2026-09-07"
]);
const LANES={
  TWSE_CAPITAL_REDUCTION_REFERENCE:"CAPITAL_REDUCTION",
  TWSE_PAR_VALUE_CHANGE_REFERENCE:"PAR_VALUE_CHANGE",
  TPEX_CAPITAL_REDUCTION_REFERENCE:"CAPITAL_REDUCTION",
  TPEX_PAR_VALUE_CHANGE_REFERENCE:"PAR_VALUE_CHANGE",
};

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function rowKey(r){return [r?.date||"",r?.time||"",r?.seqNo||""].join("|");}
function setDiff(a,b){const bs=new Set(b);return a.filter(x=>!bs.has(x));}
function paginationHints(html){
  return {
    nextPage:/下一頁|下頁|next\s*page/i.test(html),
    pageNo:/pageNo|pageno|currPage|totalPage|total_page|pageIndex/i.test(html),
    step3:/step\s*=\s*["']?3|step=3/i.test(html),
  };
}
function noPagination(h){return !h.nextPage&&!h.pageNo&&!h.step3;}

function familyRows(rows,family){
  if(family==="CAPITAL_REDUCTION") return rows.filter(r=>/減資/.test(String(r.rowText||"")));
  return rows.filter(r=>{
    const t=String(r.rowText||"");
    if(/財務報告|合併財務|個體財務|每股盈餘|每股淨值/.test(t)) return false;
    return /股票面額變更|變更股票面額|變更.*股票面額|每股面額變更|面額變更.*換發|換發.*股票面額/.test(t);
  });
}

function fetchMops(symbol,rocYear,month){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-Bounded-Revision-Bundle/0.3",
    "--data-urlencode","firstin=1","--data-urlencode","step=1","--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+symbol,"--data-urlencode","year="+rocYear,
    "--data-urlencode","month="+month,"--data-urlencode","b_date=","--data-urlencode","e_date=",
    MOPS_URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error) throw p.error;
  if(p.status!==0) return {ok:false,rows:[],rowCount:0,keys:[],noPaginationHint:false,error:String(p.stderr||"").slice(0,500)};
  const html=p.stdout;
  let parsed;
  try{
    parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({html,stockCode:symbol,expectedDate:null,baseSubject:null});
  }catch(error){
    return {ok:false,rows:[],rowCount:0,keys:[],noPaginationHint:false,error:String(error?.message||error)};
  }
  const rows=[...(parsed.rows||[])].filter(r=>r.date&&r.time&&r.seqNo);
  return {
    ok:true,
    rows,
    rowCount:Number(parsed.rowCount||0),
    keys:rows.map(rowKey).sort(),
    noPaginationHint:noPagination(paginationHints(html)),
  };
}

async function fetchOfficial(sourceId,startDate,endDate){
  const urls=buildOfficialContinuitySourceUrlsV0_1({startDate,endDate});
  const source=urls[sourceId];
  const response=await fetch(source.url,{
    headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-Bounded-Revision-Bundle/0.3"},
    signal:AbortSignal.timeout(30000),
  });
  const rawText=await response.text();
  assert.equal(response.ok,true,sourceId+" HTTP "+response.status);
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,sourceUrl:source.url,rawText,fetchedAt:new Date().toISOString(),
    requestedStartDate:startDate,requestedEndDate:endDate,
  });
  assert.equal(parsed.responseRangeVerified,true,sourceId+" range");
  assert.equal(parsed.parserComplete,true,sourceId+" parser");
  return parsed;
}

const currentEvents=[];
const historicalEventsByLane={};
for(const [sourceId,family] of Object.entries(LANES)){
  const bounded=await fetchOfficial(sourceId,START,END);
  for(const e of bounded.events){
    currentEvents.push({
      eventKey:[sourceId,e.symbol,e.effectiveDate,e.eventVersionId||""].join("|"),
      sourceId,symbol:e.symbol,effectiveDate:e.effectiveDate,eventVersionId:e.eventVersionId,
      actionFamilyId:family,officialSubtype:e.continuityEffect?.subtype||null,
    });
  }
  const history=await fetchOfficial(sourceId,HISTORY_START,END);
  historicalEventsByLane[sourceId]=history.events
    .map(e=>({symbol:e.symbol,effectiveDate:e.effectiveDate,eventVersionId:e.eventVersionId}))
    .sort((a,b)=>a.effectiveDate.localeCompare(b.effectiveDate)||a.symbol.localeCompare(b.symbol));
}
assert.equal(currentEvents.length,23);

const captureSpecificCanonical=currentEvents.map(e=>({
  eventKey:e.eventKey,sourceId:e.sourceId,symbol:e.symbol,effectiveDate:e.effectiveDate,eventVersionId:e.eventVersionId,
})).sort((a,b)=>a.eventKey.localeCompare(b.eventKey));
const freshCaptureSpecificUniverseHash=await sha256Hex({
  interval:{startDate:START,endDate:END},
  events:captureSpecificCanonical,
});

// PR #610's eventUniverseHash committed to eventVersionId, and eventVersionId
// intentionally commits to sourceCaptureId/observedAt. It is therefore a
// capture-specific immutable receipt, not a cross-fetch universe identity.
// Replays compare the exact frozen semantic keyset instead.
const actualStableEventKeys=currentEvents
  .map(e=>[e.sourceId,e.symbol,e.effectiveDate].join("|"))
  .sort();
assert.deepEqual(actualStableEventKeys,[...EXPECTED_STABLE_EVENT_KEYS].sort());
assert.equal(new Set(actualStableEventKeys).size,23);
const stableEventKeysetHash=await sha256Hex({
  interval:{startDate:START,endDate:END},
  stableEventKeys:actualStableEventKeys,
});

for(const event of currentEvents){
  const prior=(historicalEventsByLane[event.sourceId]||[])
    .filter(x=>x.symbol===event.symbol&&x.effectiveDate<event.effectiveDate)
    .sort((a,b)=>b.effectiveDate.localeCompare(a.effectiveDate))[0]||null;
  event.previousEffectiveDate=prior?.effectiveDate||null;
}

const symbols=[...new Set(currentEvents.map(e=>e.symbol))].sort();
const histories={};
for(let si=0;si<symbols.length;si++){
  const symbol=symbols[si];
  histories[symbol]={full:{},monthly:{},allRows:[]};
  for(let yi=0;yi<YEARS.length;yi++){
    const year=YEARS[yi];
    const r=fetchMops(symbol,year-1911,"all");
    histories[symbol].full[year]=r;
    histories[symbol].allRows.push(...r.rows.filter(x=>x.date&&x.date<=END));
    await sleep(350);
  }
}

for(let si=0;si<symbols.length;si++){
  const symbol=symbols[si];
  for(const year of YEARS){
    const maxMonth=year===2026?10:12;
    histories[symbol].monthly[year]=[];
    for(let month=1;month<=maxMonth;month++){
      const r=fetchMops(symbol,year-1911,month);
      histories[symbol].monthly[year].push({month,...r});
      await sleep(350);
    }
  }
}

const queryIntegrityBySymbol={};
for(const symbol of symbols){
  const yearResults=[];
  for(const year of YEARS){
    const full=histories[symbol].full[year];
    const monthly=histories[symbol].monthly[year];
    const cutoff=year===2026?END:`${year}-12-31`;
    const fullKeys=full.rows.filter(x=>x.date<=cutoff).map(rowKey).sort();
    const shardFlat=monthly.flatMap(m=>m.rows.filter(x=>x.date<=cutoff).map(rowKey));
    const shardUnion=[...new Set(shardFlat)].sort();
    const onlyAll=setDiff(fullKeys,shardUnion);
    const onlyShards=setDiff(shardUnion,fullKeys);
    const duplicates=[...new Set(shardFlat.filter((x,i,a)=>a.indexOf(x)!==i))].sort();
    const transportReady=full.ok&&monthly.every(m=>m.ok);
    const noPaginationHint=full.noPaginationHint&&monthly.every(m=>m.noPaginationHint);
    const exact=transportReady&&noPaginationHint&&onlyAll.length===0&&onlyShards.length===0&&duplicates.length===0;
    yearResults.push({
      year,transportReady,noPaginationHint,
      fullRowCount:fullKeys.length,monthShardUnionCount:shardUnion.length,
      onlyAllCount:onlyAll.length,onlyMonthShardCount:onlyShards.length,duplicateMonthKeyCount:duplicates.length,
      exactKeysetReconciliation:exact,
    });
  }
  queryIntegrityBySymbol[symbol]={
    transportReady:yearResults.every(y=>y.transportReady),
    parserComplete:yearResults.every(y=>y.transportReady),
    noPaginationHint:yearResults.every(y=>y.noPaginationHint),
    exactKeysetReconciliation:yearResults.every(y=>y.exactKeysetReconciliation),
    years:yearResults,
  };
}

const linked=currentEvents.map(event=>
  classifyBoundedRevisionEventBundleV0_3({
    event,
    familyRows:familyRows(histories[event.symbol].allRows,event.actionFamilyId),
    queryIntegrity:queryIntegrityBySymbol[event.symbol],
    historyStartDate:HISTORY_START,
  })
);
const summary=summarizeBoundedRevisionEventBundlesV0_3(linked);

assert.equal(summary.eventCount,23);
assert.equal(summary.exactQueryIntegrityCount,23);
assert.equal(summary.boundedRevisionHistoryCoverageComplete,false);
assert.equal(summary.correctionHistoryComplete,false);
assert.equal(summary.cancellationHistoryComplete,false);
assert.equal(summary.knownAtVersionClockCertified,false);
assert.equal(summary.revisionCoverageComplete,false);
assert.equal(summary.selectionAuthority,false);
assert.equal(summary.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:"LOW_VOLUME_EVENT_BUNDLE_V0_3_PHYSICAL_DIAGNOSTIC_COMPLETE",
  interval:{startDate:START,endDate:END},
  historyStartDate:HISTORY_START,
  legacyCaptureSpecificEventUniverseHash:LEGACY_CAPTURE_SPECIFIC_UNIVERSE_HASH,
  freshCaptureSpecificEventUniverseHash,
  stableEventKeysetHash,
  stableEventKeyCount:actualStableEventKeys.length,
  stableEventKeys:actualStableEventKeys,
  symbolCount:symbols.length,
  queryIntegrityBySymbol,
  summary,
  events:linked,
},null,2));
