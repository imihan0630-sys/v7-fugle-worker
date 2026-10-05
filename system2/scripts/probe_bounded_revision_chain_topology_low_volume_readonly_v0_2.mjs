import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";
import { buildBoundedRevisionChainTopologyV0_2 } from "../runtime/bounded_revision_chain_topology_v0_2.mjs";

const START="2026-04-05";
const END="2026-10-02";
const YEARS=[2025,2026];
const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const LANES=[
  "TWSE_CAPITAL_REDUCTION_REFERENCE",
  "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  "TPEX_CAPITAL_REDUCTION_REFERENCE",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE",
];

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function fetchMopsYear(stockCode,rocYear){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-Revision-Chain-Topology/0.2",
    "--data-urlencode","firstin=1","--data-urlencode","step=1",
    "--data-urlencode","TYPEK=all","--data-urlencode","co_id="+stockCode,
    "--data-urlencode","year="+rocYear,"--data-urlencode","month=all",
    "--data-urlencode","b_date=","--data-urlencode","e_date=",MOPS_URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error) throw p.error;
  if(p.status!==0) throw new Error("curl failed "+stockCode+"/"+rocYear+": "+String(p.stderr||"").slice(0,500));
  const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
    html:p.stdout,stockCode,expectedDate:null,baseSubject:null,
  });
  return [...(parsed.rows||[])];
}
function familyRows(rows,family){
  if(family==="CAPITAL_REDUCTION") return rows.filter(r=>/減資/.test(String(r.rowText||"")));
  return rows.filter(r=>{
    const t=String(r.rowText||"");
    if(/財務報告|合併財務|個體財務|每股盈餘|每股淨值/.test(t)) return false;
    return /股票面額變更|變更股票面額|變更.*股票面額|每股面額變更|面額變更.*換發|換發.*股票面額/.test(t);
  });
}

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const laneEvents={};
for(const sourceId of LANES){
  const source=urls[sourceId];
  const response=await fetch(source.url,{
    headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-Revision-Chain-Topology/0.2"},
    signal:AbortSignal.timeout(30000),
  });
  const rawText=await response.text();
  assert.equal(response.ok,true,sourceId+" HTTP "+response.status);
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,sourceUrl:source.url,rawText,fetchedAt:new Date().toISOString(),
    requestedStartDate:START,requestedEndDate:END,
  });
  assert.equal(parsed.responseRangeVerified,true);
  assert.equal(parsed.parserComplete,true);
  laneEvents[sourceId]=parsed.events.map(x=>({
    symbol:x.symbol,effectiveDate:x.effectiveDate,eventVersionId:x.eventVersionId,
  }));
}

const symbols=[...new Set(Object.values(laneEvents).flat().map(x=>x.symbol))].sort();
const issuerFamilyRowsBySymbol={};
for(let si=0;si<symbols.length;si+=1){
  const symbol=symbols[si];
  const rows=[];
  for(let yi=0;yi<YEARS.length;yi+=1){
    rows.push(...fetchMopsYear(symbol,YEARS[yi]-1911));
    if(!(si===symbols.length-1&&yi===YEARS.length-1)) await sleep(300);
  }
  const bounded=rows.filter(x=>x.date&&x.date<=END);
  issuerFamilyRowsBySymbol[symbol]={
    CAPITAL_REDUCTION:familyRows(bounded,"CAPITAL_REDUCTION"),
    PAR_VALUE_CHANGE:familyRows(bounded,"PAR_VALUE_CHANGE"),
  };
}

const topology=await buildBoundedRevisionChainTopologyV0_2({
  startDate:START,endDate:END,laneEvents,issuerFamilyRowsBySymbol,
  generatedAt:new Date().toISOString(),
});
assert.equal(topology.finalEventCount,23);
assert.equal(topology.versionChainTopologyAssessed,true);
assert.equal(topology.noRevisionNegativeClaimQualifiedCount,0);
assert.equal(topology.noRevisionAbsenceSemanticsCertified,false);
assert.equal(topology.boundedRevisionHistoryCoverageComplete,false);
assert.equal(topology.revisionCoverageComplete,false);
assert.equal(topology.selectionAuthority,false);
assert.equal(topology.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:"LOW_VOLUME_REVISION_CHAIN_TOPOLOGY_ASSESSED",
  topology,
  unresolvedRevisionEvents:topology.laneResults.flatMap(l=>l.events)
    .filter(x=>x.state==="REVISION_HINT_CHAIN_TOPOLOGY_UNRESOLVED")
    .map(x=>({sourceId:x.sourceId,symbol:x.symbol,effectiveDate:x.effectiveDate,unresolvedRevisionVersionKeys:x.unresolvedRevisionVersionKeys})),
  noRevisionHintEvents:topology.laneResults.flatMap(l=>l.events)
    .filter(x=>x.noRevisionHintObserved)
    .map(x=>({sourceId:x.sourceId,symbol:x.symbol,effectiveDate:x.effectiveDate})),
},null,2));
