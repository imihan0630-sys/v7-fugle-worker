import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {buildOfficialContinuitySourceUrlsV0_1} from "../runtime/official_continuity_source_capability_v0_1.mjs";
import {parseOfficialHistoricalContinuityPayloadV0_1} from "../runtime/official_continuity_event_parser_v0_1.mjs";
import {parseMopsHistoricalMaterialInformationHtmlV0_1} from "../runtime/mops_revision_source_capability_v0_1.mjs";
import {detailDateTokensV0_5,familyMatchV0_5,issuerScopeEligibleV0_5,versionKeyV0_5} from "../runtime/s2_07_event_specific_linkage_v0_5.mjs";
import {classifyParValueMonthOnlyRowV0_6,classifyCancellationEvidenceV0_6} from "../runtime/s2_07_par_value_divergence_v0_6.mjs";

const START="2026-04-05",END="2026-10-02",URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const CASES=[
 ["TWSE_PAR_VALUE_CHANGE_REFERENCE","6949","2026-09-07"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","8937","2026-04-13"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","5904","2026-08-10"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","4747","2026-08-31"],
].map(([sourceId,symbol,effectiveDate])=>({sourceId,symbol,effectiveDate}));
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function minusDays(iso,n){return new Date(new Date(iso+"T00:00:00Z").getTime()-n*86400000).toISOString().slice(0,10);}
function months(s,e){const a=new Date(s+"T00:00:00Z"),b=new Date(e+"T00:00:00Z"),o=[];let y=a.getUTCFullYear(),m=a.getUTCMonth()+1;while(y<b.getUTCFullYear()||(y===b.getUTCFullYear()&&m<=b.getUTCMonth()+1)){o.push({year:y,month:m});if(++m===13){m=1;y++;}}return o;}
function curlHistory(symbol,rocYear,month){
 const args=["--fail","--silent","--show-error","--location","--max-time","30","--request","POST",
 "--header","Content-Type: application/x-www-form-urlencoded","--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
 "--header","User-Agent: System2-S2-07-Par-Value-Divergence/0.6","--data-urlencode","firstin=1","--data-urlencode","step=1",
 "--data-urlencode","TYPEK=all","--data-urlencode","co_id="+symbol,"--data-urlencode","year="+rocYear,"--data-urlencode","month="+month,
 "--data-urlencode","b_date=","--data-urlencode","e_date=",URL];
 const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
 if(p.error||p.status!==0) return {ok:false,rows:[],noPaginationHint:false};
 const html=p.stdout;
 const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({html,stockCode:symbol,expectedDate:null,baseSubject:null});
 return {ok:true,rows:[...(parsed.rows||[])].filter(r=>r.date&&r.time&&r.seqNo),noPaginationHint:!/下一頁|下頁|next\s*page|pageNo|pageno|currPage|totalPage|total_page|pageIndex|step\s*=\s*["']?3|step=3/i.test(html)};
}
async function fetchText(url){
 let last=null;
 for(let i=1;i<=4;i++){try{const r=await fetch(url,{headers:{"user-agent":"System2-S2-07-Par-Value-Divergence/0.6"},signal:AbortSignal.timeout(30000)});const t=await r.text();if(r.ok)return t;last=new Error("HTTP "+r.status);}catch(e){last=e;}if(i<4)await sleep(500*i);}
 throw last;
}

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END}),officialBySource={};
for(const sourceId of [...new Set(CASES.map(x=>x.sourceId))]){
 const src=urls[sourceId],raw=await fetchText(src.url);
 const p=await parseOfficialHistoricalContinuityPayloadV0_1({sourceId,sourceUrl:src.url,rawText:raw,fetchedAt:new Date().toISOString(),requestedStartDate:START,requestedEndDate:END});
 assert.equal(p.responseRangeVerified,true);assert.equal(p.parserComplete,true);officialBySource[sourceId]=p;
}

const events=[];
for(const e of CASES){
 const official=officialBySource[e.sourceId].events.find(x=>x.symbol===e.symbol&&x.effectiveDate===e.effectiveDate);assert.ok(official);
 const startDate=minusDays(e.effectiveDate,400),ms=months(startDate,e.effectiveDate),ys=[...new Set(ms.map(x=>x.year))];
 let yr=[],mo=[],transport=true,noPagination=true;
 for(const y of ys){const r=curlHistory(e.symbol,y-1911,"all");transport&&=r.ok;noPagination&&=r.noPaginationHint;yr.push(...r.rows);await sleep(100);}
 for(const p of ms){const r=curlHistory(e.symbol,p.year-1911,p.month);transport&&=r.ok;noPagination&&=r.noPaginationHint;mo.push(...r.rows);await sleep(100);}
 const keep=r=>r.date>=startDate&&r.date<=e.effectiveDate&&issuerScopeEligibleV0_5(r.rowText)&&familyMatchV0_5(r.rowText,"PAR_VALUE_CHANGE");
 const ymap=new Map(yr.filter(keep).map(r=>[versionKeyV0_5(r),r]));
 const mmap=new Map(mo.filter(keep).map(r=>[versionKeyV0_5(r),r]));
 const onlyYear=[...ymap.keys()].filter(k=>!mmap.has(k)).map(k=>ymap.get(k));
 const onlyMonth=[...mmap.keys()].filter(k=>!ymap.has(k)).map(k=>mmap.get(k));
 const detailDates=detailDateTokensV0_5(official.continuityEffect?.detail||"");
 const classified=onlyMonth.map(row=>classifyParValueMonthOnlyRowV0_6({row,officialDetailDateTokens:detailDates}));
 const cancellation=classifyCancellationEvidenceV0_6([...mmap.values()]);
 events.push({
  sourceId:e.sourceId,symbol:e.symbol,effectiveDate:e.effectiveDate,
  officialEventVersionId:official.eventVersionId||null,
  officialDetailDateTokens:detailDates,
  transportReady:transport,noPaginationHint:noPagination,
  yearFamilyRowCount:ymap.size,monthFamilyRowCount:mmap.size,
  yearAllSubsetOfMonthUnion:onlyYear.length===0,
  onlyYearCount:onlyYear.length,onlyMonthCount:onlyMonth.length,
  onlyMonthClassifications:classified,
  cancellation,
  sourceSemanticsCertified:false,
  monthShardCoverageComplete:false,
  promotionLinkageEstablished:false,
  knownAtVersionClockCertified:false,
  technicalContinuityCertified:false,
  tradingAuthority:false,
 });
}
const classCounts={};for(const e of events)for(const r of e.onlyMonthClassifications)classCounts[r.state]=(classCounts[r.state]||0)+1;
const summary={
 schemaVersion:"S2_S2_07_PAR_VALUE_DIVERGENCE_SUMMARY_V0_6",
 eventCount:events.length,
 yearAllSubsetOfMonthUnionCount:events.filter(e=>e.yearAllSubsetOfMonthUnion).length,
 monthOnlyRowCount:events.reduce((n,e)=>n+e.onlyMonthCount,0),
 monthOnlyClassificationCounts:classCounts,
 cancellationDisclosureObservedCount:events.filter(e=>e.cancellation.state==="CANCELLATION_DISCLOSURE_OBSERVED").length,
 noCancellationCertifiedCount:0,
 sourceSemanticsCertified:false,
 monthShardCoverageComplete:false,
 promotionLinkageEstablishedCount:0,
 knownAtVersionClockCertified:false,
 technicalContinuityCertified:false,
 tradingAuthority:false,
};
assert.equal(summary.eventCount,4);
assert.equal(summary.noCancellationCertifiedCount,0);
assert.equal(summary.promotionLinkageEstablishedCount,0);
assert.equal(summary.tradingAuthority,false);
console.log(JSON.stringify({result:"S2_07_PAR_VALUE_DIVERGENCE_V0_6_COMPLETE",summary,events},null,2));
