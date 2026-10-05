import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {buildOfficialContinuitySourceUrlsV0_1} from "../runtime/official_continuity_source_capability_v0_1.mjs";
import {parseOfficialHistoricalContinuityPayloadV0_1} from "../runtime/official_continuity_event_parser_v0_1.mjs";
import {parseMopsHistoricalMaterialInformationHtmlV0_1} from "../runtime/mops_revision_source_capability_v0_1.mjs";
import {classifyBoundedRevisionEventLinkageV0_2,summarizeBoundedRevisionEventLinkageV0_2} from "../runtime/bounded_revision_event_linkage_v0_2.mjs";

const START="2026-04-05",END="2026-10-02",YEARS=[2025,2026];
const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const LANES={
 TWSE_CAPITAL_REDUCTION_REFERENCE:"CAPITAL_REDUCTION",
 TWSE_PAR_VALUE_CHANGE_REFERENCE:"PAR_VALUE_CHANGE",
 TPEX_CAPITAL_REDUCTION_REFERENCE:"CAPITAL_REDUCTION",
 TPEX_PAR_VALUE_CHANGE_REFERENCE:"PAR_VALUE_CHANGE",
};
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function familyRows(rows,family){
 if(family==="CAPITAL_REDUCTION") return rows.filter(r=>/減資/.test(String(r.rowText||"")));
 return rows.filter(r=>{const t=String(r.rowText||"");if(/財務報告|合併財務|個體財務|每股盈餘|每股淨值/.test(t)) return false;return /股票面額變更|變更股票面額|變更.*股票面額|每股面額變更|面額變更.*換發|換發.*股票面額/.test(t);});
}
function fetchYear(symbol,rocYear){
 const args=["--fail","--silent","--show-error","--location","--max-time","30","--request","POST",
 "--header","Content-Type: application/x-www-form-urlencoded","--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
 "--header","User-Agent: System2-Bounded-Revision-Linkage/0.2","--data-urlencode","firstin=1","--data-urlencode","step=1",
 "--data-urlencode","TYPEK=all","--data-urlencode","co_id="+symbol,"--data-urlencode","year="+rocYear,"--data-urlencode","month=all",
 "--data-urlencode","b_date=","--data-urlencode","e_date=",MOPS_URL];
 const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
 if(p.error||p.status!==0) return {ok:false,rows:[],rowCount:0,noPaginationHint:false};
 const html=p.stdout;
 const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({html,stockCode:symbol,expectedDate:null,baseSubject:null});
 const noPaginationHint=!/下一頁|下頁|next\s*page|pageNo|pageno|currPage|totalPage|total_page|pageIndex|step\s*=\s*["']?3|step=3/i.test(html);
 return {ok:true,rows:[...(parsed.rows||[])],rowCount:Number(parsed.rowCount||0),noPaginationHint};
}

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const events=[];
for(const [sourceId,family] of Object.entries(LANES)){
 const source=urls[sourceId];
 const res=await fetch(source.url,{headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-Bounded-Revision-Linkage/0.2"},signal:AbortSignal.timeout(30000)});
 const raw=await res.text();assert.equal(res.ok,true);
 const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({sourceId,sourceUrl:source.url,rawText:raw,fetchedAt:new Date().toISOString(),requestedStartDate:START,requestedEndDate:END});
 assert.equal(parsed.responseRangeVerified,true);assert.equal(parsed.parserComplete,true);
 for(const e of parsed.events) events.push({eventKey:[sourceId,e.symbol,e.effectiveDate,e.eventVersionId||""].join("|"),sourceId,symbol:e.symbol,effectiveDate:e.effectiveDate,eventVersionId:e.eventVersionId,family});
}
assert.equal(events.length,23);

const symbols=[...new Set(events.map(e=>e.symbol))].sort();
const histories={};
for(let si=0;si<symbols.length;si++){
 const symbol=symbols[si];let all=[];let transport=true;let parserComplete=true;let noPagination=true;let maxRows=0;
 for(let yi=0;yi<YEARS.length;yi++){
  const r=fetchYear(symbol,YEARS[yi]-1911);transport&&=r.ok;parserComplete&&=r.ok;noPagination&&=r.noPaginationHint;maxRows=Math.max(maxRows,r.rowCount);all.push(...r.rows);
  if(!(si===symbols.length-1&&yi===YEARS.length-1)) await sleep(300);
 }
 histories[symbol]={all,queryEvidence:{transportReady:transport,parserComplete,noPaginationHint:noPagination,maxYearRowCount:maxRows}};
}

const linked=events.map(e=>classifyBoundedRevisionEventLinkageV0_2({
 event:e,
 familyRows:familyRows(histories[e.symbol].all.filter(r=>r.date&&r.date<=END),e.family),
 queryEvidence:histories[e.symbol].queryEvidence,
}));
const summary=summarizeBoundedRevisionEventLinkageV0_2(linked);
assert.equal(summary.eventCount,23);
assert.equal(summary.boundedRevisionHistoryCoverageComplete,false);
assert.equal(summary.knownAtVersionClockCertified,false);
assert.equal(summary.revisionCoverageComplete,false);

console.log(JSON.stringify({result:"LOW_VOLUME_EVENT_LINKAGE_DIAGNOSTICS_COMPLETE",summary,events:linked},null,2));