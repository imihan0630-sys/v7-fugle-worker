// System1 actual D1 history coverage census; pure SELECT, no Worker/KV/plan mutation.
import {mkdir,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
const account=process.env.CLOUDFLARE_ACCOUNT_ID;
const token=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||process.env.CLOUDFLARE_API_TOKEN;
const target=process.env.S1_P0_EXPECTED_MARKET_DATE||"2026-10-13";
if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(target))throw Error("HISTORY_CENSUS_EXPECTED_DATE_INVALID");
const cap=8000;
const base="https://api.cloudflare.com/client/v4/accounts/"+account;
if(!/^[a-f0-9]{32}$/i.test(account||"")||!token)throw Error("EXISTING_SOURCE_ACCOUNT_READ_SCOPE_REQUIRED");
async function cloud(path,method="GET",payload=null){
 const response=await fetch(base+path,{method,headers:{
  authorization:"Bearer "+token,accept:"application/json",
  ...(payload?{"content-type":"application/json"}:{})
 },...(payload?{body:JSON.stringify(payload)}:{}),signal:AbortSignal.timeout(40000)});
 const d=await response.json().catch(()=>null);
 if(!response.ok||d?.success!==true)throw Error("D1_READ_"+method+"_HTTP_"+response.status+"_"+path.split("?")[0]);
 return d.result;
}
const dbs=await cloud("/d1/database?per_page=100");
const db=dbs.filter(x=>x.name==="v7-live");
if(db.length!==1)throw Error("UNIQUE_V7_LIVE_D1_NOT_FOUND");
const id=db[0].uuid||db[0].id;
let readQueries=0,totalRowsRead=0;
async function select(sql,params=[]){
 if(!/^\s*SELECT\b/i.test(sql)||/\b(INSERT|UPDATE|DELETE|REPLACE|DROP|CREATE|ALTER|ATTACH|PRAGMA|VACUUM)\b/i.test(sql))
  throw Error("D1_SELECT_ONLY_POLICY");
 if(++readQueries>8)throw Error("CENSUS_QUERY_BUDGET_EXCEEDED");
 const q=await cloud("/d1/database/"+id+"/query","POST",{sql,params});
 if(!Array.isArray(q)||q.length!==1||q[0].success!==true)throw Error("D1_SQL_RECEIPT_NOT_VERIFIED");
 totalRowsRead+=Number(q[0].meta?.rows_read??q[0].results?.length??0);
 if(totalRowsRead>20000)throw Error("D1_ROWS_READ_CEILING_EXCEEDED");
 return q[0].results||[];
}
const seed=(await select("SELECT market_date, cursor, total, queue_json, updated_at FROM v7_history_seed_state WHERE id=1"))[0]||null;
let state={marketDate:seed?.market_date||null,cursor:Number(seed?.cursor||0),queueSize:Number(seed?.total||0),updatedAt:seed?.updated_at||null};
if(seed?.queue_json){try{const q=JSON.parse(seed.queue_json);state={
 ...state,seedSchema:q.seedSchema??null,coverageTarget:q.coverageTarget??null,
 coverageBase:q.coverageBase??null,resolvedCount:q.resolvedCount??null,
 insufficientCount:q.insufficientSymbols?.length??null,
 unresolvedCursorCount:Math.max(0,Number(seed.total||0)-Number(seed.cursor||0))
};}catch{state.parseError=true;}}
const agg=(await select(`SELECT COUNT(*) AS rowsTotal,
 SUM(CASE WHEN json_valid(history_json) THEN 1 ELSE 0 END) AS jsonValid,
 SUM(CASE WHEN json_valid(history_json) AND json_array_length(history_json)>=60 THEN 1 ELSE 0 END) AS length60,
 SUM(CASE WHEN json_valid(history_json) AND json_array_length(history_json)<60 THEN 1 ELSE 0 END) AS lengthInsufficient,
 MIN(updated_at) AS oldestWriteAt,MAX(updated_at) AS newestWriteAt
 FROM v7_history_cache`))[0]||{};
const recents=await select(`SELECT symbol,
 CASE WHEN json_valid(history_json) THEN json_array_length(history_json) ELSE -1 END AS barCount,
 CASE WHEN json_valid(history_json) THEN json_extract(history_json,'$[#-1].date') ELSE NULL END AS lastBarDate
 FROM v7_history_cache
 ORDER BY lastBarDate ASC,barCount ASC,symbol ASC LIMIT 35`);
const groups=await select(`SELECT lastBarDate,COUNT(*) AS symbols,
 SUM(CASE WHEN barCount>=60 THEN 1 ELSE 0 END) AS with60
 FROM (
 SELECT CASE WHEN json_valid(history_json) THEN json_extract(history_json,'$[#-1].date') ELSE NULL END AS lastBarDate,
 CASE WHEN json_valid(history_json) THEN json_array_length(history_json) ELSE -1 END AS barCount
 FROM v7_history_cache
 ) GROUP BY lastBarDate ORDER BY symbols DESC LIMIT 22`);
const outcome={
 schema:"SYSTEM1_V8_P0_HISTORY_CENSUS_PHYSICAL_V0_1",observedAt:new Date().toISOString(),
 targetMarketDate:target, source:"CLOUDFLARE_V7_LIVE_D1_PHYSICAL_SELECT_ONLY",
 noD1Write:true,noKVWrite:true,noSelection:true,noPush:true,noTrade:true,
 rowsRead:totalRowsRead,sqlReadCount:readQueries,
 seedState:state,historyRows:agg,latestBarDateGroups:groups,oldestOrShortestSamples:recents,
 targetCoverageWitness:{
  existing60Plus:Number(agg.length60||0),
  seedSameDate:state.marketDate===target,
  seedSchemaValid:state.seedSchema==="full-market-v2",
  seedResolved:Number.isFinite(Number(state.resolvedCount))?Number(state.resolvedCount):null
 },
 notFormalSelection:true,physicalCompletionClaim:false
};
const bytes=JSON.stringify(outcome);outcome.sha256=createHash("sha256").update(bytes).digest("hex");
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/system1-history60-source-census.json",JSON.stringify(outcome,null,2)+"\n");
console.log("SYSTEM1_HISTORY60_CENSUS="+JSON.stringify({
 seed:outcome.seedState,cache:outcome.historyRows,dates:outcome.latestBarDateGroups,
 samples:outcome.oldestOrShortestSamples.slice(0,18),
 rowsRead:outcome.rowsRead,queries:outcome.sqlReadCount,noD1Write:true,sha256:outcome.sha256
}));
