import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {buildOfficialContinuitySourceUrlsV0_1} from "../runtime/official_continuity_source_capability_v0_1.mjs";
import {parseOfficialHistoricalContinuityPayloadV0_1} from "../runtime/official_continuity_event_parser_v0_1.mjs";
import {parseMopsHistoricalMaterialInformationHtmlV0_1} from "../runtime/mops_revision_source_capability_v0_1.mjs";

const START="2026-04-05",END="2026-10-02";
const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const FROZEN=[
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","6176","2026-08-24","CAPITAL_REDUCTION",true],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","1563","2026-09-07","CAPITAL_REDUCTION",true],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","3356","2026-09-21","CAPITAL_REDUCTION",true],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","3591","2026-09-21","CAPITAL_REDUCTION",false],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","1441","2026-09-29","CAPITAL_REDUCTION",true],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","6550","2026-09-29","CAPITAL_REDUCTION",true],
 ["TWSE_PAR_VALUE_CHANGE_REFERENCE","6949","2026-09-07","PAR_VALUE_CHANGE",false],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","5381","2026-04-13","CAPITAL_REDUCTION",false],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","6241","2026-08-25","CAPITAL_REDUCTION",false],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","6129","2026-09-14","CAPITAL_REDUCTION",true],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","3710","2026-09-21","CAPITAL_REDUCTION",true],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","8277","2026-09-21","CAPITAL_REDUCTION",true],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","4806","2026-10-02","CAPITAL_REDUCTION",true],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","8937","2026-04-13","PAR_VALUE_CHANGE",false],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","3086","2026-04-20","PAR_VALUE_CHANGE",true],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","5904","2026-08-10","PAR_VALUE_CHANGE",false],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","4747","2026-08-31","PAR_VALUE_CHANGE",false],
].map(([sourceId,symbol,effectiveDate,family,v03Exact])=>({sourceId,symbol,effectiveDate,family,v03Exact}));

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
async function fetchTextWithRetry(url,{attempts=4,timeoutMs=30000,userAgent="System2-S2-07-Linkage-Diagnostics/0.4"}={}){
 let lastError=null;
 for(let i=1;i<=attempts;i++){
  try{
   const res=await fetch(url,{headers:{accept:"application/json,text/plain,*/*","user-agent":userAgent},signal:AbortSignal.timeout(timeoutMs)});
   const raw=await res.text();
   if(res.ok) return {res,raw,attempt:i};
   lastError=new Error("HTTP "+res.status);
  }catch(error){lastError=error;}
  if(i<attempts) await sleep(500*i);
 }
 throw lastError||new Error("fetch failed after retries");
}
function key(r){return [r?.date||"",r?.time||"",r?.seqNo||""].join("|");}
function dateMinusDays(iso,days){return new Date(new Date(iso+"T00:00:00Z").getTime()-days*86400000).toISOString().slice(0,10);}
function monthRange(startDate,endDate){
 const s=new Date(startDate+"T00:00:00Z"),e=new Date(endDate+"T00:00:00Z"),out=[];
 let y=s.getUTCFullYear(),m=s.getUTCMonth()+1;
 while(y<e.getUTCFullYear()||(y===e.getUTCFullYear()&&m<=e.getUTCMonth()+1)){out.push({year:y,month:m});m++;if(m===13){m=1;y++;}}
 return out;
}
function familyMatch(row,family){
 const t=String(row?.rowText||"");
 if(family==="CAPITAL_REDUCTION") return /減資/.test(t);
 return /股票面額變更|變更股票面額|每股面額變更|面額變更.*換發|換發.*股票面額/.test(t) && !/財務報告|合併財務|個體財務|每股盈餘|每股淨值/.test(t);
}
function issuerScope(row){return !/代(?:重要)?子公司|子公司/.test(String(row?.rowText||""));}
function stage(row){
 const t=String(row?.rowText||"");
 if(/公司債.*停止轉換|停止轉換期間/.test(t)) return "BOND_CONVERSION";
 if(/庫藏股|限制員工權利新股/.test(t)) return "OTHER_CAPITAL_CHANGE";
 if(/換股基準日|換發股票基準日|換發有價證券|換股作業計畫|換發股票作業計畫/.test(t)) return "EXCHANGE_PLAN";
 if(/主管機關核准|業經核准/.test(t)) return "AUTHORITY_APPROVAL";
 if(/變更登記完成|資本額變更登記|資本變更登記/.test(t)) return "REGISTRATION";
 if(/減資基準日/.test(t)) return "BASE_DATE";
 if(/債權人/.test(t)) return "CREDITOR_NOTICE";
 if(/董事會決議|股東常會決議|股東會決議/.test(t)) return "CORPORATE_DECISION";
 if(/股票面額變更相關事宜/.test(t)) return "PAR_VALUE_NOTICE";
 return "OTHER";
}
function curlHistory(symbol,rocYear,month){
 const args=["--fail","--silent","--show-error","--location","--max-time","30","--request","POST",
 "--header","Content-Type: application/x-www-form-urlencoded","--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
 "--header","User-Agent: System2-S2-07-Linkage-Diagnostics/0.4","--data-urlencode","firstin=1","--data-urlencode","step=1",
 "--data-urlencode","TYPEK=all","--data-urlencode","co_id="+symbol,"--data-urlencode","year="+rocYear,"--data-urlencode","month="+month,
 "--data-urlencode","b_date=","--data-urlencode","e_date=",MOPS_URL];
 const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
 if(p.error||p.status!==0) return {ok:false,rows:[],noPaginationHint:false,error:String(p.stderr||p.error||"curl failure").slice(0,300)};
 const html=p.stdout;
 const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({html,stockCode:symbol,expectedDate:null,baseSubject:null});
 return {ok:true,rows:[...(parsed.rows||[])].filter(r=>r.date&&r.time&&r.seqNo),noPaginationHint:!/下一頁|下頁|next\s*page|pageNo|pageno|currPage|totalPage|total_page|pageIndex|step\s*=\s*["']?3|step=3/i.test(html)};
}

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const parsedBySource={};
for(const sourceId of [...new Set(FROZEN.map(x=>x.sourceId))]){
 const source=urls[sourceId];
 const fetched=await fetchTextWithRetry(source.url,{attempts:4,timeoutMs:30000});
 const res=fetched.res,raw=fetched.raw;assert.equal(res.ok,true);
 const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({sourceId,sourceUrl:source.url,rawText:raw,fetchedAt:new Date().toISOString(),requestedStartDate:START,requestedEndDate:END});
 assert.equal(parsed.responseRangeVerified,true);assert.equal(parsed.parserComplete,true);
 parsedBySource[sourceId]=parsed;
}

const yearCache=new Map(),monthCache=new Map();
async function getYear(symbol,year){
 const ck=symbol+"|"+year;if(yearCache.has(ck))return yearCache.get(ck);
 const r=curlHistory(symbol,year-1911,"all");yearCache.set(ck,r);await sleep(100);return r;
}
async function getMonth(symbol,year,month){
 const ck=[symbol,year,month].join("|");if(monthCache.has(ck))return monthCache.get(ck);
 const r=curlHistory(symbol,year-1911,month);monthCache.set(ck,r);await sleep(100);return r;
}
function rowMap(rows){return new Map(rows.map(r=>[key(r),r]));}

const out=[];
for(const e of FROZEN){
 const official=parsedBySource[e.sourceId].events.find(x=>x.symbol===e.symbol&&x.effectiveDate===e.effectiveDate);
 assert.ok(official,"frozen official event missing "+e.sourceId+" "+e.symbol+" "+e.effectiveDate);
 const startDate=dateMinusDays(e.effectiveDate,400);
 const years=[...new Set(monthRange(startDate,e.effectiveDate).map(x=>x.year))];
 let yearRows=[],yearOk=true,yearNoPagination=true;
 for(const year of years){const r=await getYear(e.symbol,year);yearOk&&=r.ok;yearNoPagination&&=r.noPaginationHint;yearRows.push(...r.rows);}
 const boundedYear=yearRows.filter(r=>r.date>=startDate&&r.date<=e.effectiveDate);
 const issuerCandidates=boundedYear.filter(r=>issuerScope(r)&&familyMatch(r,e.family)).map(r=>({
   key:key(r),date:r.date,time:r.time,seqNo:r.seqNo,stage:stage(r),
   correctionOrCancellationHint:r.correctionOrCancellationHint===true,rowText:r.rowText,
 }));
 let discrepancy=null;
 if(!e.v03Exact){
   let monthRows=[],monthOk=true,monthNoPagination=true;
   for(const p of monthRange(startDate,e.effectiveDate)){const r=await getMonth(e.symbol,p.year,p.month);monthOk&&=r.ok;monthNoPagination&&=r.noPaginationHint;monthRows.push(...r.rows);}
   const boundedMonth=monthRows.filter(r=>r.date>=startDate&&r.date<=e.effectiveDate);
   const ym=rowMap(boundedYear),mm=rowMap(boundedMonth);
   const onlyAll=[...ym.keys()].filter(k=>!mm.has(k)).map(k=>({key:k,rowText:ym.get(k)?.rowText||null}));
   const onlyMonth=[...mm.keys()].filter(k=>!ym.has(k)).map(k=>({key:k,rowText:mm.get(k)?.rowText||null}));
   discrepancy={monthTransportReady:monthOk,monthNoPaginationHint:monthNoPagination,yearCount:ym.size,monthCount:mm.size,onlyAll,onlyMonth};
 }
 const stageCounts={};for(const r of issuerCandidates)stageCounts[r.stage]=(stageCounts[r.stage]||0)+1;
 out.push({
   sourceId:e.sourceId,symbol:e.symbol,effectiveDate:e.effectiveDate,family:e.family,v03Exact:e.v03Exact,
   officialEvent:{
     eventVersionId:official.eventVersionId||null,
     eventStage:official.eventStage||null,
     continuityEffectState:official.continuityEffectState||null,
     subtype:official.continuityEffect?.subtype||null,
     detail:official.continuityEffect?.detail||null,
     preActionClose:official.continuityEffect?.preActionClose??null,
     officialReferencePrice:official.continuityEffect?.officialReferencePrice??null,
     referencePriceRatio:official.continuityEffect?.referencePriceRatio??null,
     sourceRowHash:official.sourceRowHash||null,
   },
   yearTransportReady:yearOk,
   yearNoPaginationHint:yearNoPagination,
   boundedYearRowCount:boundedYear.length,
   issuerActionFamilyCandidateCount:issuerCandidates.length,
   issuerStageCounts:stageCounts,
   issuerCandidates,
   discrepancy,
   promotionLinkageEstablished:false,
   cancellationHistoryComplete:false,
   knownAtVersionClockCertified:false,
   technicalContinuityCertified:false,
   tradingAuthority:false,
 });
}
const discrepancyEvents=out.filter(x=>x.discrepancy);
const summary={
 schemaVersion:"S2_S2_07_LINKAGE_DIAGNOSTICS_V0_4",
 eventCount:out.length,
 v03ExactCount:out.filter(x=>x.v03Exact).length,
 discrepancyEventCount:discrepancyEvents.length,
 discrepancyOnlyAllTotal:discrepancyEvents.reduce((n,x)=>n+x.discrepancy.onlyAll.length,0),
 discrepancyOnlyMonthTotal:discrepancyEvents.reduce((n,x)=>n+x.discrepancy.onlyMonth.length,0),
 officialSubtypePresentCount:out.filter(x=>x.officialEvent.subtype).length,
 officialDetailPresentCount:out.filter(x=>x.officialEvent.detail).length,
 promotionLinkageEstablishedCount:0,
 eventLinkageCoverageComplete:false,
 boundedRevisionHistoryCoverageComplete:false,
 cancellationHistoryComplete:false,
 knownAtVersionClockCertified:false,
 revisionCoverageComplete:false,
 technicalContinuityCertified:false,
 tradingAuthority:false,
};
assert.equal(summary.eventCount,17);
assert.equal(summary.v03ExactCount,10);
assert.equal(summary.discrepancyEventCount,7);
assert.equal(summary.promotionLinkageEstablishedCount,0);
assert.equal(summary.tradingAuthority,false);
console.log(JSON.stringify({result:"S2_07_LINKAGE_DIAGNOSTICS_V0_4_COMPLETE",summary,events:out},null,2));
