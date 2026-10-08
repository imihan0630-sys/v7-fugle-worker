import assert from "node:assert/strict";

const accountId=String(process.env.CLOUDFLARE_ACCOUNT_ID||"").trim();
const apiToken=String(process.env.CLOUDFLARE_API_TOKEN||"").trim();
assert.ok(accountId,"Missing CLOUDFLARE_ACCOUNT_ID");
assert.ok(apiToken,"Missing CLOUDFLARE_API_TOKEN");
const cf="https://api.cloudflare.com/client/v4";
const headers={authorization:`Bearer ${apiToken}`,accept:"application/json"};

async function jsonFetch(url,options={},label=url){
  const r=await fetch(url,{...options,signal:AbortSignal.timeout(45000)});
  const text=await r.text();let j=null;try{j=JSON.parse(text);}catch{}
  if(!r.ok||j?.success===false)throw new Error(`${label} HTTP ${r.status}: ${String(j?.errors?.[0]?.message||text).slice(0,300)}`);
  return j;
}
const settings=await jsonFetch(`${cf}/accounts/${accountId}/workers/scripts/fugle-test/settings`,{headers},"Worker settings");
const binding=(settings?.result?.bindings||[]).find(x=>x?.name==="V7_DB");
const databaseId=binding?.id||binding?.database_id;
assert.ok(databaseId,"V7_DB database id missing");

async function select(sql,params=[]){
  assert.match(sql,/^\s*(SELECT|WITH|PRAGMA)\b/i);
  assert.doesNotMatch(sql,/\b(INSERT|UPDATE|DELETE|REPLACE|CREATE|DROP|ALTER|VACUUM|ATTACH|DETACH)\b/i);
  const body=await jsonFetch(`${cf}/accounts/${accountId}/d1/database/${databaseId}/query`,{
    method:"POST",headers:{...headers,"content-type":"application/json"},body:JSON.stringify({sql,params})
  },"D1 SELECT");
  const result=body?.result?.[0];
  assert.equal(result?.success,true,"D1 SELECT failed");
  assert.equal(Number(result?.meta?.rows_written||0),0,"read-only inventory wrote D1 rows");
  assert.notEqual(result?.meta?.changed_db,true,"read-only inventory changed D1");
  return {rows:result?.results||[],meta:result?.meta||{}};
}
const summary=(await select(`
SELECT
 COUNT(*) AS total,
 SUM(CASE WHEN json_valid(history_json) THEN 1 ELSE 0 END) AS valid_json,
 SUM(CASE WHEN json_valid(history_json) AND json_array_length(history_json)>=60 THEN 1 ELSE 0 END) AS ge60,
 SUM(CASE WHEN json_valid(history_json) AND json_array_length(history_json)=59 THEN 1 ELSE 0 END) AS eq59,
 SUM(CASE WHEN json_valid(history_json) AND json_array_length(history_json) BETWEEN 20 AND 58 THEN 1 ELSE 0 END) AS between20_58,
 SUM(CASE WHEN json_valid(history_json) AND json_array_length(history_json)<20 THEN 1 ELSE 0 END) AS lt20,
 MIN(CASE WHEN json_valid(history_json) THEN json_array_length(history_json) END) AS min_bars,
 MAX(CASE WHEN json_valid(history_json) THEN json_array_length(history_json) END) AS max_bars,
 MIN(updated_at) AS oldest_updated_at,
 MAX(updated_at) AS newest_updated_at
FROM v7_history_cache
`)).rows[0]||{};

let freshness=[],freshnessError=null;
try{
  freshness=(await select(`
    SELECT COALESCE(json_extract(history_json,'$[#-1].date'),'MISSING') AS last_date, COUNT(*) AS n
    FROM v7_history_cache
    WHERE json_valid(history_json)
    GROUP BY last_date
    ORDER BY last_date DESC
    LIMIT 20
  `)).rows;
}catch(e){freshnessError=String(e?.message||e).slice(0,300);}

const seedRow=(await select("SELECT market_date,queue_json,cursor,total,updated_at FROM v7_history_seed_state WHERE id=1")).rows[0]||null;
let seed=null;
if(seedRow){
  let q=null;try{q=JSON.parse(seedRow.queue_json||"null");}catch{}
  seed={
    marketDate:seedRow.market_date,cursor:Number(seedRow.cursor||0),total:Number(seedRow.total||0),updatedAt:seedRow.updated_at,
    queueLength:Array.isArray(q)?q.length:Array.isArray(q?.queue)?q.queue.length:null,
    coverageTarget:Array.isArray(q)?null:Number(q?.coverageTarget||0),
    coverageBase:Array.isArray(q)?null:Number(q?.coverageBase||0),
    resolvedCount:Array.isArray(q)?0:Number(q?.resolvedCount||0),
    insufficientCount:Array.isArray(q)?0:Array.isArray(q?.insufficientSymbols)?q.insufficientSymbols.length:0,
    seedSchema:Array.isArray(q)?null:String(q?.seedSchema||"")
  };
}
const total=Number(summary.total||0),ge60=Number(summary.ge60||0),eq59=Number(summary.eq59||0);
console.log(JSON.stringify({
  schemaVersion:"SYSTEM1_HISTORY_INVENTORY_READONLY_V0_1",
  observedAt:new Date().toISOString(),databaseBinding:"V7_DB",
  history:{...summary,total,ge60,eq59,formalUsableAfterCurrentCloseUpperBound:ge60+eq59,
    ge60Pct:total?Math.round(ge60/total*10000)/100:null},
  freshness,freshnessError,seed,
  interpretation:{
    seedResolvedIsNotHistoryRowCount:true,
    currentCloseCanPromote59To60:true,
    noFormalDecisionMade:true
  },
  readOnly:true,rowsWritten:0,mutationPerformed:false,noPlanChanges:true,noTrade:true,noPush:true
},null,2));
