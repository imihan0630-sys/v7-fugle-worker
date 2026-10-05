import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {buildOfficialContinuitySourceUrlsV0_1} from "../runtime/official_continuity_source_capability_v0_1.mjs";
import {parseOfficialHistoricalContinuityPayloadV0_1} from "../runtime/official_continuity_event_parser_v0_1.mjs";
import {parseMopsHistoricalMaterialInformationHtmlV0_1} from "../runtime/mops_revision_source_capability_v0_1.mjs";
import {
 reconcileActionFamilyQueryIntegrityV0_5,
 buildEventSpecificLinkageDiagnosticV0_5,
 summarizeEventSpecificLinkageDiagnosticsV0_5,
} from "../runtime/s2_07_event_specific_linkage_v0_5.mjs";

const START="2026-04-05",END="2026-10-02",MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const FROZEN=[
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","6176","2026-08-24","CAPITAL_REDUCTION"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","1563","2026-09-07","CAPITAL_REDUCTION"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","3356","2026-09-21","CAPITAL_REDUCTION"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","3591","2026-09-21","CAPITAL_REDUCTION"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","1441","2026-09-29","CAPITAL_REDUCTION"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","6550","2026-09-29","CAPITAL_REDUCTION"],
 ["TWSE_PAR_VALUE_CHANGE_REFERENCE","6949","2026-09-07","PAR_VALUE_CHANGE"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","5381","2026-04-13","CAPITAL_REDUCTION"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","6241","2026-08-25","CAPITAL_REDUCTION"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","6129","2026-09-14","CAPITAL_REDUCTION"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","3710","2026-09-21","CAPITAL_REDUCTION"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","8277","2026-09-21","CAPITAL_REDUCTION"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","4806","2026-10-02","CAPITAL_REDUCTION"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","8937","2026-04-13","PAR_VALUE_CHANGE"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","3086","2026-04-20","PAR_VALUE_CHANGE"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","5904","2026-08-10","PAR_VALUE_CHANGE"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","4747","2026-08-31","PAR_VALUE_CHANGE"],
].map(([sourceId,symbol,effectiveDate,family])=>({sourceId,symbol,effectiveDate,family}));

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function minusDays(iso,n){return new Date(new Date(iso+"T00:00:00Z").getTime()-n*86400000).toISOString().slice(0,10);}
function monthRange(s,e){const a=new Date(s+"T00:00:00Z"),b=new Date(e+"T00:00:00Z"),out=[];let y=a.getUTCFullYear(),m=a.getUTCMonth()+1;while(y<b.getUTCFullYear()||(y===b.getUTCFullYear()&&m<=b.getUTCMonth()+1)){out.push({year:y,month:m});if(++m===13){m=1;y++;}}return out;}
function curlHistory(symbol,rocYear,month){
 const args=["--fail","--silent","--show-error","--location","--max-time","30","--request","POST",
 "--header","Content-Type: application/x-www-form-urlencoded","--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
 "--header","User-Agent: System2-S2-07-Event-Linkage/0.5","--data-urlencode","firstin=1","--data-urlencode","step=1",
 "--data-urlencode","TYPEK=all","--data-urlencode","co_id="+symbol,"--data-urlencode","year="+rocYear,"--data-urlencode","month="+month,
 "--data-urlencode","b_date=","--data-urlencode","e_date=",MOPS_URL];
 const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
 if(p.error||p.status!==0)return {ok:false,rows:[],noPaginationHint:false,error:String(p.stderr||p.error||"curl failure").slice(0,300)};
 const html=p.stdout;
 const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({html,stockCode:symbol,expectedDate:null,baseSubject:null});
 return {ok:true,rows:[...(parsed.rows||[])].filter(r=>r.date&&r.time&&r.seqNo),noPaginationHint:!/下一頁|下頁|next\s*page|pageNo|pageno|currPage|totalPage|total_page|pageIndex|step\s*=\s*["']?3|step=3/i.test(html)};
}
async function fetchTextWithRetry(url,{attempts=4,timeoutMs=30000}={}){
 let last=null;
 for(let i=1;i<=attempts;i++){
  try{const res=await fetch(url,{headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-S2-07-Event-Linkage/0.5"},signal:AbortSignal.timeout(timeoutMs)});const raw=await res.text();if(res.ok)return {res,raw};last=new Error("HTTP "+res.status);}catch(e){last=e;}
  if(i<attempts)await sleep(500*i);
 }
 throw last||new Error("official-source fetch failed");
}

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END}),parsedBySource={};
for(const sourceId of [...new Set(FROZEN.map(x=>x.sourceId))]){
 const source=urls[sourceId],f=await fetchTextWithRetry(source.url);
 const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({sourceId,sourceUrl:source.url,rawText:f.raw,fetchedAt:new Date().toISOString(),requestedStartDate:START,requestedEndDate:END});
 assert.equal(parsed.responseRangeVerified,true);assert.equal(parsed.parserComplete,true);parsedBySource[sourceId]=parsed;
}

const ycache=new Map(),mcache=new Map();
async function yr(symbol,year){const k=symbol+"|"+year;if(ycache.has(k))return ycache.get(k);const r=curlHistory(symbol,year-1911,"all");ycache.set(k,r);await sleep(100);return r;}
async function mo(symbol,year,month){const k=[symbol,year,month].join("|");if(mcache.has(k))return mcache.get(k);const r=curlHistory(symbol,year-1911,month);mcache.set(k,r);await sleep(100);return r;}

const diagnostics=[];
for(const e of FROZEN){
 const official=parsedBySource[e.sourceId].events.find(x=>x.symbol===e.symbol&&x.effectiveDate===e.effectiveDate);assert.ok(official);
 const startDate=minusDays(e.effectiveDate,400),months=monthRange(startDate,e.effectiveDate),years=[...new Set(months.map(x=>x.year))];
 let yearRows=[],monthRows=[],transport=true,noPagination=true;
 for(const y of years){const r=await yr(e.symbol,y);transport&&=r.ok;noPagination&&=r.noPaginationHint;yearRows.push(...r.rows);}
 for(const p of months){const r=await mo(e.symbol,p.year,p.month);transport&&=r.ok;noPagination&&=r.noPaginationHint;monthRows.push(...r.rows);}
 const integrity=reconcileActionFamilyQueryIntegrityV0_5({yearRows,monthRows,family:e.family,startDate,endDate:e.effectiveDate});
 const event={
  eventKey:[e.sourceId,e.symbol,e.effectiveDate,official.eventVersionId||""].join("|"),
  sourceId:e.sourceId,symbol:e.symbol,effectiveDate:e.effectiveDate,family:e.family,
  officialSubtype:official.continuityEffect?.subtype||null,
  officialDetail:official.continuityEffect?.detail||null,
 };
 const diag=buildEventSpecificLinkageDiagnosticV0_5({event,issuerFamilyRows:yearRows,actionFamilyQueryIntegrity:integrity});
 diagnostics.push({...diag,transportReady:transport,noPaginationHint:noPagination,queryIntegrity:integrity});
}
const summary=summarizeEventSpecificLinkageDiagnosticsV0_5(diagnostics);
assert.equal(summary.eventCount,17);
assert.equal(summary.promotionLinkageEstablishedCount,0);
assert.equal(summary.eventLinkageCoverageComplete,false);
assert.equal(summary.cancellationHistoryComplete,false);
assert.equal(summary.knownAtVersionClockCertified,false);
assert.equal(summary.technicalContinuityCertified,false);
assert.equal(summary.tradingAuthority,false);
console.log(JSON.stringify({result:"S2_07_EVENT_SPECIFIC_LINKAGE_V0_5_COMPLETE",summary,events:diagnostics},null,2));
