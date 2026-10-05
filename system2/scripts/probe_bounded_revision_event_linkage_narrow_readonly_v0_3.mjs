import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {buildOfficialContinuitySourceUrlsV0_1} from "../runtime/official_continuity_source_capability_v0_1.mjs";
import {parseOfficialHistoricalContinuityPayloadV0_1} from "../runtime/official_continuity_event_parser_v0_1.mjs";
import {parseMopsHistoricalMaterialInformationHtmlV0_1} from "../runtime/mops_revision_source_capability_v0_1.mjs";
import {classifyBoundedRevisionEventLinkageV0_2} from "../runtime/bounded_revision_event_linkage_v0_2.mjs";
import {classifyBoundedRevisionEventLinkageV0_3,summarizeBoundedRevisionEventLinkageV0_3} from "../runtime/bounded_revision_event_linkage_v0_3.mjs";

const START="2026-04-05",END="2026-10-02",YEARS=[2025,2026];
const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const LANES={
 TWSE_CAPITAL_REDUCTION_REFERENCE:"CAPITAL_REDUCTION",
 TWSE_PAR_VALUE_CHANGE_REFERENCE:"PAR_VALUE_CHANGE",
 TPEX_CAPITAL_REDUCTION_REFERENCE:"CAPITAL_REDUCTION",
 TPEX_PAR_VALUE_CHANGE_REFERENCE:"PAR_VALUE_CHANGE",
};
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function key(r){return [r?.date||"",r?.time||"",r?.seqNo||""].join("|");}
function familyRows(rows,family){
 if(family==="CAPITAL_REDUCTION") return rows.filter(r=>/減資/.test(String(r.rowText||"")));
 return rows.filter(r=>{const t=String(r.rowText||"");if(/財務報告|合併財務|個體財務|每股盈餘|每股淨值/.test(t)) return false;return /股票面額變更|變更股票面額|變更.*股票面額|每股面額變更|面額變更.*換發|換發.*股票面額/.test(t);});
}
function curlHistory(symbol,rocYear,month){
 const args=["--fail","--silent","--show-error","--location","--max-time","30","--request","POST",
 "--header","Content-Type: application/x-www-form-urlencoded","--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
 "--header","User-Agent: System2-Bounded-Revision-Linkage/0.3","--data-urlencode","firstin=1","--data-urlencode","step=1",
 "--data-urlencode","TYPEK=all","--data-urlencode","co_id="+symbol,"--data-urlencode","year="+rocYear,"--data-urlencode","month="+month,
 "--data-urlencode","b_date=","--data-urlencode","e_date=",MOPS_URL];
 const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
 if(p.error||p.status!==0) return {ok:false,rows:[],noPaginationHint:false};
 const html=p.stdout;
 const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({html,stockCode:symbol,expectedDate:null,baseSubject:null});
 return {
  ok:true,
  rows:[...(parsed.rows||[])].filter(r=>r.date&&r.time&&r.seqNo),
  noPaginationHint:!/下一頁|下頁|next\s*page|pageNo|pageno|currPage|totalPage|total_page|pageIndex|step\s*=\s*["']?3|step=3/i.test(html),
 };
}
function monthRangeForEvent(e){
 const end=new Date(e.effectiveDate+"T00:00:00Z");
 const start=new Date(end);start.setUTCDate(start.getUTCDate()-400);
 const out=[];let y=start.getUTCFullYear(),m=start.getUTCMonth()+1;
 while(y<end.getUTCFullYear()||(y===end.getUTCFullYear()&&m<=end.getUTCMonth()+1)){
  out.push({year:y,month:m});
  m++;if(m===13){m=1;y++;}
 }
 return out;
}
function reconcile(allRows,monthlyRows,startDate,endDate){
 const a=[...new Set(allRows.filter(r=>r.date>=startDate&&r.date<=endDate).map(key))].sort();
 const b=[...new Set(monthlyRows.filter(r=>r.date>=startDate&&r.date<=endDate).map(key))].sort();
 const as=new Set(a),bs=new Set(b);
 return {
  allCount:a.length,
  monthUnionCount:b.length,
  onlyAll:a.filter(x=>!bs.has(x)),
  onlyMonth:b.filter(x=>!as.has(x)),
  exactKeysetReconciliation:a.length===b.length&&a.every((x,i)=>x===b[i]),
 };
}

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const events=[];
for(const [sourceId,family] of Object.entries(LANES)){
 const source=urls[sourceId];
 const res=await fetch(source.url,{headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-Bounded-Revision-Linkage/0.3"},signal:AbortSignal.timeout(30000)});
 const raw=await res.text();assert.equal(res.ok,true);
 const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({sourceId,sourceUrl:source.url,rawText:raw,fetchedAt:new Date().toISOString(),requestedStartDate:START,requestedEndDate:END});
 assert.equal(parsed.responseRangeVerified,true);assert.equal(parsed.parserComplete,true);
 for(const e of parsed.events) events.push({eventKey:[sourceId,e.symbol,e.effectiveDate,e.eventVersionId||""].join("|"),sourceId,symbol:e.symbol,effectiveDate:e.effectiveDate,eventVersionId:e.eventVersionId,family});
}
assert.equal(events.length,23);

const yearCache=new Map();
async function getYear(symbol,year){
 const ck=symbol+"|"+year;if(yearCache.has(ck)) return yearCache.get(ck);
 const r=curlHistory(symbol,year-1911,"all");yearCache.set(ck,r);await sleep(120);return r;
}
const v02=[];
for(const e of events){
 let all=[],transport=true,noPagination=true,maxYearRowCount=0;
 for(const year of YEARS){
  const r=await getYear(e.symbol,year);transport&&=r.ok;noPagination&&=r.noPaginationHint;maxYearRowCount=Math.max(maxYearRowCount,r.rows.length);all.push(...r.rows);
 }
 const linked=classifyBoundedRevisionEventLinkageV0_2({event:e,familyRows:familyRows(all,e.family),queryEvidence:{transportReady:transport,parserComplete:transport,noPaginationHint:noPagination,maxYearRowCount}});
 v02.push({event:e,linked,all});
}
const ambiguous=v02.filter(x=>/^AMBIGUOUS_/.test(x.linked.state));
assert.equal(ambiguous.length,17);

const monthCache=new Map();
async function getMonth(symbol,year,month){
 const ck=[symbol,year,month].join("|");if(monthCache.has(ck)) return monthCache.get(ck);
 const r=curlHistory(symbol,year-1911,month);monthCache.set(ck,r);await sleep(120);return r;
}

const narrowed=[];
for(const x of ambiguous){
 const months=monthRangeForEvent(x.event);
 const monthlyRows=[];let monthTransport=true,noPagination=true;
 for(const p of months){
  const r=await getMonth(x.event.symbol,p.year,p.month);monthTransport&&=r.ok;noPagination&&=r.noPaginationHint;monthlyRows.push(...r.rows);
 }
 const startDate=new Date(new Date(x.event.effectiveDate+"T00:00:00Z").getTime()-400*86400000).toISOString().slice(0,10);
 const integrity=reconcile(x.all,monthlyRows,startDate,x.event.effectiveDate);
 integrity.transportReady=monthTransport;
 integrity.noPaginationHint=noPagination;
 integrity.exactKeysetReconciliation=integrity.exactKeysetReconciliation&&monthTransport&&noPagination;
 const v03=classifyBoundedRevisionEventLinkageV0_3({event:x.event,familyRows:familyRows(x.all,x.event.family),perSymbolQueryIntegrity:integrity});
 narrowed.push({...v03,queryIntegrity:{startDate,endDate:x.event.effectiveDate,allCount:integrity.allCount,monthUnionCount:integrity.monthUnionCount,onlyAllCount:integrity.onlyAll.length,onlyMonthCount:integrity.onlyMonth.length,transportReady:integrity.transportReady,noPaginationHint:integrity.noPaginationHint,exactKeysetReconciliation:integrity.exactKeysetReconciliation}});
}

const summary=summarizeBoundedRevisionEventLinkageV0_3(narrowed);
assert.equal(summary.eventCount,17);
assert.equal(summary.eventLinkageCoverageComplete,false);
assert.equal(summary.boundedRevisionHistoryCoverageComplete,false);
assert.equal(summary.knownAtVersionClockCertified,false);
assert.equal(summary.revisionCoverageComplete,false);
assert.equal(summary.technicalContinuityCertified,false);
assert.equal(summary.tradingAuthority,false);

console.log(JSON.stringify({result:"AMBIGUOUS_EVENT_NARROWING_V0_3_COMPLETE",summary,events:narrowed},null,2));
