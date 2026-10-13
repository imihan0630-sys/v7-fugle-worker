// OWNER APPROVED: DATA ONLY. Strictly bounded Fugle daily-bar repair into EXISTING V7 D1 history table.
// No seed state impersonation, no Formal scan, no plan/push/trade, no cron/Worker changes.
import {mkdir,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
const account=process.env.CLOUDFLARE_ACCOUNT_ID||"";
const token=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||process.env.CLOUDFLARE_API_TOKEN||"";
const fugle=process.env.FUGLE_API_KEY||"";
const admin=process.env.V7_ADMIN_TOKEN||"";
const target="2026-10-13"; // LAST COMPLETED SESSION, pinned to user-confirmed repair incident.
const LIMIT=24;
const REASONABLE_OLD="2026-09-01";
const base="https://api.cloudflare.com/client/v4/accounts/"+account;
if(!/^[0-9a-f]{32}$/i.test(account)||!token||!fugle||!admin)
 throw Error("EXISTING_AUTHORIZED_ACCOUNT_D1_FUGLE_ADMIN_SCOPE_REQUIRED");
const receipt={schema:"S1_P0_HISTORY60_SOURCE_VERIFIED_BOUNDED_REPAIR_V0_1",
 targetDate:target,observedAt:new Date().toISOString(),provider:"FUGLE_ORIGINAL_RAW_DAILY",
 maximumProviderCalls:LIMIT,noFormalSelection:true,noPortfolioChanges:true,noPush:true,noTrade:true,
 noCronChange:true,noSeedStateMutation:true,queries:0,reads:0,writes:0,providerCalls:0,
 selectedSymbols:[],saved:[],skipped:[],error:null,readbackVerified:false};
let writes=0,reads=0;
async function cf(path,method="GET",body=null){
 const response=await fetch(base+path,{method,headers:{
  authorization:"Bearer "+token,accept:"application/json",
  ...(body?{"content-type":"application/json"}:{})
 },...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(45000)});
 const d=await response.json().catch(()=>null);
 if(!response.ok||d?.success!==true)
  throw Error("CLOUDFLARE_SOURCE_"+method+"_HTTP_"+response.status);
 return d.result;
}
function checkSql(sql){
 const s=sql.trimStart().toUpperCase();
 const write=s.startsWith("UPDATE V7_HISTORY_CACHE ")||s.startsWith("INSERT INTO V7_HISTORY_CACHE ");
 const read=s.startsWith("SELECT ");
 if(!write&&!read)throw Error("BLOCKED_NON_HISTORY_SQL");
 if(/\b(V7_HISTORY_SEED_STATE|V7_STOCK_CONFIG|V7_TRADE|DROP|DELETE|ALTER|CREATE|VACUUM|ATTACH|DETACH)\b/i.test(s))
  throw Error("D1_TABLE_PROTECTION");
 if(write&&++writes>LIMIT)throw Error("HISTORY_D1_WRITE_BUDGET_EXCEEDED");
 if(read&&++reads>125)throw Error("HISTORY_D1_READ_BUDGET_EXCEEDED");
 return {write,read};
}
const dbs=await cf("/d1/database?per_page=100");
const v7=dbs.filter(x=>x.name==="v7-live");
if(v7.length!==1)throw Error("V7_LIVE_DB_UNIQUE_ID_REQUIRED");
const dbid=v7[0].uuid||v7[0].id;
async function sql(q,params=[]){
 const op=checkSql(q);
 receipt.queries++;
 const out=await cf("/d1/database/"+dbid+"/query","POST",{sql:q,params});
 if(!Array.isArray(out)||out.length!==1||out[0].success!==true)
  throw Error("D1_QUERY_RECEIPT_MALFORMED");
 receipt.reads+=Number(out[0].meta?.rows_read||0);
 receipt.writes+=Number(out[0].meta?.rows_written||0);
 if(receipt.reads>30000)throw Error("D1_ROWS_READ_QUOTA_SAFETY");
 return out[0];
}
function date(s){return /^\d{4}-\d{2}-\d{2}$/.test(String(s))?String(s):null;}
function amount(s){const n=Number(String(s??"").replaceAll(",",""));return Number.isFinite(n)&&n>=0?n:null;}
async function getPriority(){
 const r=await fetch("https://fugle-test.imihan0630.workers.dev/api/live/sources",{
 headers:{"x-admin-token":admin,accept:"application/json"},
 signal:AbortSignal.timeout(20000)});
 if(!r.ok)throw Error("EXISTING_AUTHORIZED_MONITOR_READ_HTTP_"+r.status);
 const x=await r.json();
 if(x?.schema!=="SYSTEM1_V8_LIVE_SOURCES_READONLY_V0_2")
  throw Error("GUARDED_MONITOR_POPULATION_UNVERIFIED");
 return [...new Set(["2617",...(x.configSymbols||[]),...(x.aideenSymbols||[])].map(String)
  .filter(x=>/^[1-9]\d{3}$/.test(x)))];
}
const priority=await getPriority();
const samples=(await sql("SELECT symbol, updated_at, CASE WHEN json_valid(history_json) THEN json_array_length(history_json) ELSE 0 END AS barCount, CASE WHEN json_valid(history_json) THEN json_extract(history_json, '$[#-1].date') ELSE NULL END AS lastBarDate FROM v7_history_cache WHERE symbol BETWEEN '1000' AND '9999' ORDER BY lastBarDate ASC,barCount ASC,symbol ASC LIMIT 1908")).results;
const bySymbol=new Map(samples.map(x=>[String(x.symbol),x]));
const stale=row=>row&&(Number(row.barCount)<65||String(row.lastBarDate||"")<target);
const selected=[...new Set([...priority.filter(x=>stale(bySymbol.get(x))),
  ...samples.filter(stale).map(x=>String(x.symbol))])].slice(0,LIMIT);
receipt.selectedSymbols=selected;
async function original(symbol){
 const from="2026-06-15";
 const url="https://api.fugle.tw/marketdata/v1.0/stock/historical/candles/"+symbol+
  "?from="+from+"&to="+target+"&timeframe=D&fields=open,high,low,close,volume,turnover,change&sort=asc";
 receipt.providerCalls++;
 const r=await fetch(url,{headers:{"X-API-KEY":fugle},signal:AbortSignal.timeout(22000)});
 if(!r.ok)throw Error("FUGLE_HISTORY_HTTP_"+r.status);
 const p=await r.json();
 if(!Array.isArray(p?.data))throw Error("FUGLE_HISTORY_DATA_ARRAY_MISSING");
 const out=p.data.map(x=>({
  date:date(String(x.date||"").slice(0,10)),
  close:amount(x.close),high:amount(x.high),low:amount(x.low),
  volumeShares:amount(x.volume)||0,tradeValue:amount(x.turnover)||0
 }));
 if(out.some(x=>!x.date||!(x.close>0)||!(x.high>=x.close)||!(x.low<=x.close)||
   x.date>target)||out.length>120)
  throw Error("FUGLE_HISTORY_BAR_SCHEMA_INVALID");
 const ordered=out.sort((a,b)=>a.date.localeCompare(b.date));
 if(new Set(ordered.map(x=>x.date)).size!==ordered.length)
  throw Error("FUGLE_HISTORY_DUPLICATE_SESSION");
 return ordered;
}
async function saveOne(symbol){
 const pre=(await sql("SELECT symbol,history_json,updated_at FROM v7_history_cache WHERE symbol=?1",[symbol])).results[0];
 if(!pre) return {symbol,state:"SOURCE_SYMBOL_NOT_IN_EXISTING_CACHE_UNCHANGED"};
 let prior;
 try{prior=JSON.parse(pre.history_json);}catch{return {symbol,state:"PRIOR_JSON_INVALID_NOT_OVERWRITTEN"};}
 if(!Array.isArray(prior)||prior.some(x=>!date(x.date)||!(amount(x.close)>0)))
  return {symbol,state:"PRIOR_BAR_SCHEMA_UNVERIFIED"};
 if(prior.length>=65&&String(prior.at(-1)?.date)>=target)
  return {symbol,state:"ALREADY_CURRENT"};
 const fresh=await original(symbol);
 if(fresh.length<60||fresh.at(-1)?.date!==target)
  return {symbol,state:"NO_CONFIRMED_60_CLOSED_BARS_TO_TARGET",received:fresh.length,last:fresh.at(-1)?.date||null};
 const overlap=new Map(prior.map(x=>[String(x.date),x]));
 for(const candle of fresh.slice(-65)){
  const old=overlap.get(candle.date);if(!old)continue;
  const oldClose=amount(old.close);
  if(!(oldClose>0)||Math.abs(candle.close-oldClose)/oldClose>0.005)
   return {symbol,state:"PRICE_SPACE_CONFLICT_NO_OVERWRITE",date:candle.date};
 }
 const accepted=fresh.slice(-65);
 if(accepted.length<60)return {symbol,state:"LESS_THAN_60_AFTER_REBASE"};
 const oldLast=String(prior.at(-1)?.date||"");
 if(!(accepted.at(-1).date>oldLast))return {symbol,state:"NO_ADVANCING_SOURCE_CANDLE"};
 const serialized=JSON.stringify(accepted);
 const latest=new Date().toISOString();
 const done=await sql("UPDATE v7_history_cache SET history_json=?1,updated_at=?2 WHERE symbol=?3 AND updated_at=?4",
 [serialized,latest,symbol,String(pre.updated_at)]);
 if(Number(done.meta?.changes||0)!==1)return {symbol,state:"CAS_NOT_UPDATED_PRESERVE_CONCURRENT"};
 const witness=(await sql("SELECT history_json,updated_at FROM v7_history_cache WHERE symbol=?1",[symbol])).results[0];
 if(witness?.history_json!==serialized||witness?.updated_at!==latest)
  throw Error("D1_WRITE_PHYSICAL_READBACK_MISMATCH_"+symbol);
 return {symbol,state:"D1_HISTORY_SOURCE_UPSERT_PHYSICALLY_VERIFIED",
  oldLast,newLast:accepted.at(-1).date,barCount:accepted.length,
  sha256:createHash("sha256").update(serialized).digest("hex")};
}
for(const symbol of selected) {
 try{
  const out=await saveOne(symbol);
  if(out.state==="D1_HISTORY_SOURCE_UPSERT_PHYSICALLY_VERIFIED")receipt.saved.push(out);
  else receipt.skipped.push(out);
  if(receipt.providerCalls>=LIMIT)break;
 }catch(e){
  const reason=String(e?.message||e).slice(0,120);
  receipt.skipped.push({symbol,state:"REPAIR_EXCEPTION_NO_SUCCESS_CLAIM",error:reason});
  if(/HTTP_(401|402|403|429)|QUOTA|BUDGET|AUTH/.test(reason)) {
   receipt.error="FUGLE_OR_D1_PROVIDER_BUDGET_OR_AUTH_BLOCK"; break;
  }
 }
}
receipt.readbackVerified=receipt.saved.length>0&&receipt.saved.every(x=>x.newLast===target);
receipt.summary={
 prioritySymbols:priority.length,physicallyPersisted:receipt.saved.length,
 incompleteOrSkipped:receipt.skipped.length,stillUnrepairedUniverse:true
};
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/system1-history60-dataonly-backfill.json",JSON.stringify(receipt,null,2)+"\n");
console.log("SYSTEM1_P0_HISTORY_BACKFILL_RECEIPT="+JSON.stringify({
 target,providerCalls:receipt.providerCalls,physicalD1Writes:receipt.saved.length,
 skipped:receipt.skipped,updated:receipt.saved.map(x=>({symbol:x.symbol,barCount:x.barCount,newLast:x.newLast})),
 error:receipt.error,stillUnrepairedUniverse:true,noTrade:true,noPlanChanges:true}));
if(!receipt.readbackVerified)process.exitCode=2;
