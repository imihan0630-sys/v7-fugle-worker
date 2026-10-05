import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {parseMopsHistoricalMaterialInformationHtmlV0_1} from "../runtime/mops_revision_source_capability_v0_1.mjs";
import {diagnoseBoundedRevisionQueryIntegrityV0_4} from "../runtime/bounded_revision_query_integrity_v0_4.mjs";

const URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const TARGETS=[
 {symbol:"3591",startDate:"2025-08-17",endDate:"2026-09-21"},
 {symbol:"6949",startDate:"2025-08-03",endDate:"2026-09-07"},
 {symbol:"5381",startDate:"2025-03-09",endDate:"2026-04-13"},
 {symbol:"6241",startDate:"2025-07-21",endDate:"2026-08-25"},
 {symbol:"8937",startDate:"2025-03-09",endDate:"2026-04-13"},
 {symbol:"5904",startDate:"2025-07-06",endDate:"2026-08-10"},
 {symbol:"4747",startDate:"2025-07-27",endDate:"2026-08-31"},
];
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function k(r){return [r?.date||"",r?.time||"",r?.seqNo||""].join("|");}
function fetchHistory(symbol,year,month){
 const args=["--fail","--silent","--show-error","--location","--max-time","30","--request","POST",
 "--header","Content-Type: application/x-www-form-urlencoded","--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
 "--header","User-Agent: System2-Bounded-Revision-Query-Integrity/0.4","--data-urlencode","firstin=1","--data-urlencode","step=1",
 "--data-urlencode","TYPEK=all","--data-urlencode","co_id="+symbol,"--data-urlencode","year="+String(year-1911),"--data-urlencode","month="+String(month),
 "--data-urlencode","b_date=","--data-urlencode","e_date=",URL];
 const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
 if(p.error||p.status!==0) return {ok:false,rows:[],noPaginationHint:false,error:String(p.error||p.stderr||p.status)};
 const html=p.stdout;
 const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({html,stockCode:symbol,expectedDate:null,baseSubject:null});
 return {ok:true,rows:[...(parsed.rows||[])].filter(r=>r.date&&r.time&&r.seqNo),noPaginationHint:!/下一頁|下頁|next\s*page|pageNo|pageno|currPage|totalPage|total_page|pageIndex|step\s*=\s*["']?3|step=3/i.test(html)};
}
function monthsBetween(startDate,endDate){
 const s=new Date(startDate+"T00:00:00Z"),e=new Date(endDate+"T00:00:00Z");
 let y=s.getUTCFullYear(),m=s.getUTCMonth()+1;const out=[];
 while(y<e.getUTCFullYear()||(y===e.getUTCFullYear()&&m<=e.getUTCMonth()+1)){out.push({year:y,month:m});m++;if(m===13){m=1;y++;}}
 return out;
}
function yearsBetween(startDate,endDate){
 const a=Number(startDate.slice(0,4)),b=Number(endDate.slice(0,4));const out=[];for(let y=a;y<=b;y++)out.push(y);return out;
}
function inRange(rows,startDate,endDate){return rows.filter(r=>r.date>=startDate&&r.date<=endDate);}
async function allSnapshot(t){
 let rows=[],ok=true,noPaginationHint=true;
 for(const y of yearsBetween(t.startDate,t.endDate)){const r=fetchHistory(t.symbol,y,"all");ok&&=r.ok;noPaginationHint&&=r.noPaginationHint;rows.push(...r.rows);await sleep(80);}
 return {rows:inRange(rows,t.startDate,t.endDate),ok,noPaginationHint};
}
async function monthSnapshot(t){
 let rows=[],ok=true,noPaginationHint=true;
 for(const p of monthsBetween(t.startDate,t.endDate)){const r=fetchHistory(t.symbol,p.year,p.month);ok&&=r.ok;noPaginationHint&&=r.noPaginationHint;rows.push(...r.rows);await sleep(80);}
 return {rows:inRange(rows,t.startDate,t.endDate),ok,noPaginationHint};
}
function rowSamples(keys,snapshots,months){
 const wanted=new Set(keys);const map=new Map();
 for(const r of [...snapshots.flatMap(x=>x.rows),...months.rows]) if(wanted.has(k(r))&&!map.has(k(r))) map.set(k(r),{key:k(r),date:r.date,time:r.time,seqNo:r.seqNo,rowText:String(r.rowText||"").slice(0,500)});
 return [...map.values()];
}

const results=[];
for(const t of TARGETS){
 const a1=await allSnapshot(t);
 const a2=await allSnapshot(t);
 const months=await monthSnapshot(t);
 const a3=await allSnapshot(t);
 const diag=diagnoseBoundedRevisionQueryIntegrityV0_4({
  allSnapshots:[a1.rows,a2.rows,a3.rows],
  monthRows:months.rows,
  transportReady:a1.ok&&a2.ok&&a3.ok&&months.ok,
  noPaginationHint:a1.noPaginationHint&&a2.noPaginationHint&&a3.noPaginationHint&&months.noPaginationHint,
 });
 results.push({
  symbol:t.symbol,startDate:t.startDate,endDate:t.endDate,
  ...diag,
  onlyAllRows:rowSamples(diag.onlyAll,[a1,a2,a3],months),
  onlyMonthRows:rowSamples(diag.onlyMonth,[a1,a2,a3],months),
 });
}
assert.equal(results.length,7);
assert.equal(results.every(x=>x.revisionCoverageComplete===false),true);
assert.equal(results.every(x=>x.knownAtVersionClockCertified===false),true);
assert.equal(results.every(x=>x.technicalContinuityCertified===false),true);
assert.equal(results.every(x=>x.tradingAuthority===false),true);
const stateCounts={};for(const x of results)stateCounts[x.state]=(stateCounts[x.state]||0)+1;
console.log(JSON.stringify({result:"BOUNDED_REVISION_QUERY_INTEGRITY_V0_4_DIAGNOSTIC_COMPLETE",stateCounts,results,revisionCoverageComplete:false,knownAtVersionClockCertified:false,technicalContinuityCertified:false,tradingAuthority:false},null,2));
