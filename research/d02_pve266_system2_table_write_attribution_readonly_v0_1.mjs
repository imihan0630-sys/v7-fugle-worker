import assert from "node:assert/strict";
import {mkdir,writeFile} from "node:fs/promises";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const token=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
const settingsToken=process.env.CLOUDFLARE_API_TOKEN;
assert.ok(accountId&&token&&settingsToken,"System2 Cloudflare credentials required");
const origin="https://api.cloudflare.com/client/v4";

async function cf(path,options={},authToken=token){
 const res=await fetch(origin+"/accounts/"+accountId+path,{...options,headers:{authorization:"Bearer "+authToken,accept:"application/json","content-type":"application/json",...(options.headers||{})},signal:AbortSignal.timeout(45000)});
 const text=await res.text();let data;try{data=JSON.parse(text)}catch{data=null}
 if(!res.ok||data?.success===false) throw new Error("Cloudflare HTTP "+res.status+": "+String(data?.errors?.[0]?.message||text).slice(0,700));
 return data;
}
const settings=await cf("/workers/scripts/system2-shadow-research/settings",{},settingsToken);
const binding=(settings?.result?.bindings||[]).find(x=>x?.name==="SYSTEM2_DB");
const dbId=binding?.id||binding?.database_id;
assert.ok(dbId,"SYSTEM2_DB binding missing");

async function sql(query,params=[]){
 const d=await cf("/d1/database/"+dbId+"/query",{method:"POST",body:JSON.stringify({sql:query,params})});
 return d?.result?.[0]?.results||[];
}
const tables=(await sql("SELECT name, sql FROM sqlite_schema WHERE type='table' AND name LIKE 's2_%' ORDER BY name")).map(x=>({name:x.name,sql:x.sql}));
const cols={};
for(const t of tables){
 cols[t.name]=(await sql("PRAGMA table_info("+t.name+")")).map(x=>String(x.name));
}
const start="2026-10-07T00:00:00.000Z",end="2026-10-08T00:00:00.000Z";
const preferred=["captured_at","created_at","updated_at","persisted_at","observed_at","as_of","event_at","activated_at","received_at"];
const counts=[];
for(const t of tables){
 const column=preferred.find(c=>cols[t.name].includes(c));
 if(!column) continue;
 try{
  const row=(await sql(`SELECT COUNT(*) AS n, MIN(${column}) AS first_at, MAX(${column}) AS last_at FROM ${t.name} WHERE ${column}>=? AND ${column}<?`,[start,end]))[0]||{};
  counts.push({table:t.name,timeColumn:column,rowCount:Number(row.n||0),firstAt:row.first_at||null,lastAt:row.last_at||null});
 }catch(error){
  counts.push({table:t.name,timeColumn:column,rowCount:null,error:String(error).slice(0,240)});
 }
}
counts.sort((a,b)=>(b.rowCount??-1)-(a.rowCount??-1));
const historicalBars=(await sql("SELECT COUNT(*) AS n, MIN(captured_at) AS first_at, MAX(captured_at) AS last_at FROM s2_historical_a1_bars WHERE captured_at>=? AND captured_at<?",[start,end]))[0]||{};
const historicalBatches=(await sql("SELECT COUNT(*) AS n, SUM(row_count) AS declared_rows, MIN(captured_at) AS first_at, MAX(captured_at) AS last_at FROM s2_historical_ingest_batches WHERE captured_at>=? AND captured_at<?",[start,end]))[0]||{};
const resonanceSnapshots=(await sql("SELECT COUNT(*) AS n, MIN(as_of) AS first_at, MAX(as_of) AS last_at FROM s2_resonance_snapshots WHERE as_of>=? AND as_of<?",[start,end]))[0]||{};
const report={
 schemaVersion:"D02_PVE266_SYSTEM2_TABLE_WRITE_ATTRIBUTION_READONLY_V0_1",
 generatedAt:new Date().toISOString(),readOnly:true,mutationCount:0,
 utcWindow:[start,end],
 tableTimeWindowCounts:counts,
 focused:{
  historicalA1Bars:{rowCount:Number(historicalBars.n||0),firstAt:historicalBars.first_at||null,lastAt:historicalBars.last_at||null},
  historicalIngestBatches:{rowCount:Number(historicalBatches.n||0),declaredRows:Number(historicalBatches.declared_rows||0),firstAt:historicalBatches.first_at||null,lastAt:historicalBatches.last_at||null},
  resonanceSnapshots:{rowCount:Number(resonanceSnapshots.n||0),firstAt:resonanceSnapshots.first_at||null,lastAt:resonanceSnapshots.last_at||null}
 }
};
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/d02-pve266-system2-table-write-attribution-readonly.json",JSON.stringify(report,null,2)+"\n");
console.log("D02_PVE266_RESULT="+JSON.stringify(report));
