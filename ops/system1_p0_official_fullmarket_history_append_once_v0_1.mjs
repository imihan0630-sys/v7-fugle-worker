// S1 P0 approved factual daily K-line repair. Reuse certified official TWSE/TPEx research parser.
// BOUNDED BULK RUN capped at 400 verified existing D1 history cache rows. Zero trade/strategy/push/seed-state mutation.
import {writeFile,mkdir} from "node:fs/promises";
import {createHash} from "node:crypto";
import {fetchOfficialHistoricalA1DateV0_1} from "../system2/runtime/official_historical_a1_source_v0_1.mjs";

const TARGET="2026-10-13";
const SOURCE_START="2026-09-11";
const SYMBOL_CAP=400;
const account=process.env.CLOUDFLARE_ACCOUNT_ID||"";
const sourceToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||process.env.CLOUDFLARE_API_TOKEN||"";
const writeToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||process.env.CLOUDFLARE_API_TOKEN||"";
const admin=process.env.V7_ADMIN_TOKEN||"";
if(!/^[0-9a-f]{32}$/i.test(account)||!sourceToken||!writeToken||!admin)
 throw Error("EXISTING_CLOUDFLARE_SOURCE_AND_ADMIN_AUTH_REQUIRED_NO_WRITE");
const base="https://api.cloudflare.com/client/v4/accounts/"+account;
const journal={schema:"SYSTEM1_P0_OFFICIAL_TWO_MARKET_HISTORY_REPAIR_V0_1",targetDate:TARGET,
 fetchedFrom:SOURCE_START,runStarted:new Date().toISOString(),dataOnly:true,
 officialSourceHashes:[],dateCount:0,rawRowCount:0,
 D1ReadRows:0,D1Writes:0,sourceHttpCalls:0,
 noSeedStateWrite:true,noPlanWrite:true,noFormalSelection:true,noTrade:true,noPush:true,
 completed:[],skipped:[],unrepairedUniverse:true,status:"INITIAL"};
let queries=0,writeQueries=0;
async function cf(path,method="GET",body=null,token=sourceToken){
 const r=await fetch(base+path,{method,headers:{
  authorization:"Bearer "+token,accept:"application/json",...(body?{"content-type":"application/json"}:{})
 },...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(45000)});
 const data=await r.json().catch(()=>null);
 if(!r.ok||data?.success!==true)throw Error("CLOUDFLARE_HISTORY_"+method+"_HTTP_"+r.status);
 return data.result;
}
const dbs=await cf("/d1/database?per_page=100");
const chosen=dbs.filter(x=>x.name==="v7-live");
if(chosen.length!==1)throw Error("EXACT_SOURCE_V7_LIVE_DB_NOT_FOUND");
const id=chosen[0].uuid||chosen[0].id;
// Zero-row SQL permission probe: no stored history data is changed.
// Fail BEFORE downloading full-market official history when existing D1 write
// permission is absent. Only a fixed impossible ordinary-stock ticker is used.
const permissionProbe=await cf("/d1/database/"+id+"/query","POST",{
 sql:"UPDATE v7_history_cache SET updated_at=updated_at WHERE symbol='0000'",
 params:[]
},writeToken);
if(!Array.isArray(permissionProbe)||permissionProbe.length!==1||
   permissionProbe[0].success!==true||
   Number(permissionProbe[0].meta?.changes||0)!==0||
   Number(permissionProbe[0].meta?.rows_written||0)!==0)
 throw Error("EXISTING_SOURCE_TOKEN_D1_ZERO_ROW_WRITE_SCOPE_NOT_VERIFIED");
journal.d1ZeroRowWriteScopeVerified=true;

async function query(sql,params=[]){
 const isRead=/^\s*SELECT\s/i.test(sql);
 const isAppend=/^\s*UPDATE v7_history_cache SET history_json=/i.test(sql);
 if(!isRead&&!isAppend)throw Error("D1_NOT_HISTORY_CACHE_ONLY");
 if(!isRead&&++writeQueries>SYMBOL_CAP)throw Error("D1_HISTORY_WRITE_CEILING");
 if(++queries>SYMBOL_CAP*3+12)throw Error("D1_QUERY_CEILING");
 const reply=await cf("/d1/database/"+id+"/query","POST",{sql,params},isRead?sourceToken:writeToken);
 if(!Array.isArray(reply)||reply.length!==1||reply[0].success!==true)
   throw Error("OFFICIAL_HISTORY_D1_QUERY_NOT_VERIFIED");
 journal.D1ReadRows+=Number(reply[0].meta?.rows_read||0);
 journal.D1Writes+=Number(reply[0].meta?.rows_written||0);
 if(journal.D1ReadRows>18000||journal.D1Writes>SYMBOL_CAP)
  throw Error("D1_DAILY_QUOTA_GUARD");
 return reply[0];
}
function dateString(ms){return new Date(ms).toISOString().slice(0,10)}
const holidays=new Set(["2026-09-25","2026-09-28","2026-10-09"]);
const dates=[];
for(let d=Date.parse(SOURCE_START+"T00:00:00Z");d<=Date.parse(TARGET+"T00:00:00Z");d+=86400000){
 const day=dateString(d);
 if(![0,6].includes(new Date(d).getUTCDay())&&!holidays.has(day))dates.push(day);
}
if(dates.length<15||dates.length>24||dates.at(-1)!==TARGET)
 throw Error("PINNED_OFFICIAL_CALENDAR_SESSION_RANGE_INVALID");
const live=await fetch("https://fugle-test.imihan0630.workers.dev/api/live/sources",{
 headers:{"x-admin-token":admin,accept:"application/json"},signal:AbortSignal.timeout(25000)});
if(!live.ok)throw Error("APPROVED_LIVE_MONITOR_READ_FAILED_"+live.status);
const source=await live.json();
if(source.schema!=="SYSTEM1_V8_LIVE_SOURCES_READONLY_V0_2")throw Error("FORMAL_AIDEEN_MONITOR_SOURCE_UNVERIFIED");
const priority=[...new Set(["2617",...(source.configSymbols||[]),...(source.aideenSymbols||[])].map(String))];
const eligible=(await query("SELECT symbol,updated_at,CASE WHEN json_valid(history_json) THEN json_extract(history_json,'$[#-1].date') ELSE NULL END AS lastDay, CASE WHEN json_valid(history_json) THEN json_array_length(history_json) ELSE 0 END AS bars FROM v7_history_cache WHERE symbol BETWEEN '1000' AND '9999' ORDER BY lastDay ASC,symbol ASC LIMIT 1908")).results;
const index=new Map(eligible.map(x=>[String(x.symbol),x]));
const stale=x=>x&&(Number(x.bars)<65||String(x.lastDay||"")<TARGET);
const work=[...new Set([...priority.filter(symbol=>stale(index.get(symbol))),
  ...eligible.filter(stale).map(x=>String(x.symbol))])].slice(0,SYMBOL_CAP);
journal.workSymbols=work;
if(work.length===0) {
 journal.status="NO_STALE_EXISTING_HISTORY_SYMBOLS_ON_PINNED_DATE";
 journal.unrepairedUniverse=false;
 journal.completedCount=0;
 journal.boundedSymbolCap=SYMBOL_CAP;
 journal.d1QueryCount=queries;
 await mkdir("artifacts",{recursive:true});
 await writeFile("artifacts/system1-p0-official-wholemarket-firstbatch.json",JSON.stringify(journal,null,2)+"\n");
 console.log("SYSTEM1_P0_OFFICIAL_MARKET_HISTORY_RECEIPT="+JSON.stringify({
  state:journal.status,sourceRequests:0,d1RowsWritten:0,
  noFormalScan:true,noPush:true,staleCacheSymbols:0
 }));
 process.exit(0);
}
const rawBySymbol=new Map();
const receipts=[];
for(const tradingDate of dates){
 for(const market of ["TWSE","TPEX"]){
  if(++journal.sourceHttpCalls>50)throw Error("OFFICIAL_SOURCE_CALL_CEILING");
  const result=await fetchOfficialHistoricalA1DateV0_1({
   market,marketDate:tradingDate,retryAttempts:2,retryDelayMs:400,
   observedAt:()=>new Date().toISOString()
  });
  if(result.state!=="READY"||result.sourceDateEvidence!==tradingDate||
     result.ordinarySymbolCount<(market==="TWSE"?600:300)||
     result.rows.some(x=>x.priceSpace!=="RAW"||x.marketDate!==tradingDate))
    throw Error("OFFICIAL_SOURCE_DATE_MARKET_COMPLETENESS_INVALID_"+market+"_"+tradingDate);
  const digest=createHash("sha256").update(JSON.stringify(
   result.rows.map(x=>({symbol:x.symbol,date:x.marketDate,close:x.close,high:x.high,low:x.low}))
  )).digest("hex");
  receipts.push({market,date:tradingDate,rows:result.ordinarySymbolCount,sha256:digest});
  for(const x of result.rows){
   if(!(x.close>0)||!Number.isFinite(x.high)||!Number.isFinite(x.low)||
      !Number.isFinite(x.volumeShares)||!Number.isFinite(x.tradeValue))continue;
   const candle={date:tradingDate,close:x.close,high:x.high,low:x.low,
     volumeShares:x.volumeShares,tradeValue:x.tradeValue};
   let found=rawBySymbol.get(x.symbol);
   if(!found){found=[];rawBySymbol.set(x.symbol,found);}
   if(found.some(b=>b.date===tradingDate))throw Error("OFFICIAL_DUPLICATE_MARKET_SYMBOL_"+x.symbol);
   found.push(candle);
  }
 }
}
journal.dateCount=dates.length;
journal.rawRowCount=receipts.reduce((s,x)=>s+x.rows,0);
journal.officialSourceHashes=receipts;
for(const symbol of work){
 try{
  const old=(await query("SELECT symbol,history_json,updated_at FROM v7_history_cache WHERE symbol=?1",[symbol])).results[0];
  if(!old){journal.skipped.push({symbol,reason:"MISSING_SOURCE_ROW"});continue;}
  let bars;
  try{bars=JSON.parse(old.history_json);}catch{journal.skipped.push({symbol,reason:"INVALID_ORIGINAL_CACHE_JSON"});continue;}
  if(!Array.isArray(bars)||bars.some(x=>!x?.date||!(Number(x.close)>0))) {
   journal.skipped.push({symbol,reason:"ORIGINAL_BAR_ARRAY_UNVERIFIED"});continue;
  }
  const sourceBars=rawBySymbol.get(symbol)||[];
  const oldEnd=bars.at(-1)?.date||"";
  const anchor=sourceBars.find(x=>x.date===oldEnd);
  if(!anchor) {journal.skipped.push({symbol,reason:"PRIOR_LAST_BAR_OFFICIAL_ANCHOR_NOT_AVAILABLE",oldEnd});continue;}
  const prior=bars.at(-1);
  if(Math.abs(Number(prior.close)-anchor.close)/anchor.close>0.005){
   journal.skipped.push({symbol,reason:"RAW_PRICE_SPACE_ANCHOR_CONFLICT",oldEnd});continue;
  }
  const newer=sourceBars.filter(x=>x.date>oldEnd);
  if(!newer.length||newer.at(-1).date!==TARGET){
   journal.skipped.push({symbol,reason:"LACKS_CURRENT_COMPLETED_OFFICIAL_SESSION",oldEnd});continue;
  }
  const composed=[...bars,...newer].slice(-65);
  if(composed.length<60||composed.some((x,i)=>i&&x.date<=composed[i-1].date)){
   journal.skipped.push({symbol,reason:"INSUFFICIENT_OR_DUPLICATE_60_BAR_MERGE"});continue;
  }
  const payload=JSON.stringify(composed),writtenAt=new Date().toISOString();
  const changed=await query("UPDATE v7_history_cache SET history_json=?1,updated_at=?2 WHERE symbol=?3 AND updated_at=?4",
   [payload,writtenAt,symbol,String(old.updated_at)]);
  if(Number(changed.meta?.changes)!==1){
   journal.skipped.push({symbol,reason:"D1_CAS_RACE_PRESERVED"});continue;
  }
  const readback=(await query("SELECT history_json,updated_at FROM v7_history_cache WHERE symbol=?1",[symbol])).results[0];
  if(readback?.history_json!==payload||readback?.updated_at!==writtenAt)
   throw Error("D1_PHYSICAL_READBACK_MISMATCH");
  journal.completed.push({symbol,oldLast:oldEnd,newLast:TARGET,
    latest65:composed.length,source:"OFFICIAL_TWSE_TPEX",
    payloadSha256:createHash("sha256").update(payload).digest("hex")});
 }catch(error){
  const errorCode=String(error?.message||error).slice(0,90);
  journal.skipped.push({symbol,reason:"DATA_REPAIR_SOURCE_OR_WRITE_ERROR",errorCode});
  if(/QUOTA|HTTP_4|WRITE_CEILING|READ_CEILING/.test(errorCode)) {journal.status="WRITE_OR_QUOTA_BLOCKED";break;}
 }
}
journal.status=journal.status==="WRITE_OR_QUOTA_BLOCKED"?journal.status:
 journal.completed.length?"PHYSICAL_D1_OFFICIAL_BARS_PERSISTED_PARTIAL_UNIVERSE":"NO_PHYSICAL_SOURCE_ROWS_UPDATED";
journal.completedCount=journal.completed.length;
journal.boundedSymbolCap=SYMBOL_CAP;
journal.d1QueryCount=queries;
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/system1-p0-official-wholemarket-firstbatch.json",JSON.stringify(journal,null,2)+"\n");
console.log("SYSTEM1_P0_OFFICIAL_MARKET_HISTORY_RECEIPT="+JSON.stringify({
 state:journal.status,sourceDays:dates.length,sourceRequests:journal.sourceHttpCalls,
 sourceRows:journal.rawRowCount,d1RowsWritten:journal.D1Writes,
 completed:journal.completed.map(x=>({symbol:x.symbol,oldLast:x.oldLast,newLast:x.newLast})),
 skipped:journal.skipped,otherSourceDataUnaffected:true,noFormalScan:true,noPush:true
}));
if(!journal.completed.length)process.exitCode=2;
