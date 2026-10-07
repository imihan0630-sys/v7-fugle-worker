import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.CLOUDFLARE_API_TOKEN;
assert.ok(accountId&&apiToken,"Cloudflare repository secrets required");

const cf="https://api.cloudflare.com/client/v4";
const formalScript="fugle-test";
const diagScript=("d02-pve259-ro-"+process.env.GITHUB_RUN_ID).toLowerCase();
const diagToken=randomBytes(32).toString("hex");
console.log("::add-mask::"+diagToken);
const targetDate="2026-10-06", symbol="2454";

async function jsonFetch(url,options={},label=url){
  const res=await fetch(url,{...options,signal:AbortSignal.timeout(45000)});
  const text=await res.text(); let data; try{data=JSON.parse(text)}catch{data=null}
  if(!res.ok||data?.success===false) throw new Error(label+" HTTP "+res.status+": "+String(data?.errors?.[0]?.message||text).slice(0,400));
  return data;
}
async function cfCall(path,options={}){
  return jsonFetch(cf+"/accounts/"+accountId+path,{...options,headers:{authorization:"Bearer "+apiToken,accept:"application/json",...(options.headers||{})}},path);
}
const settings=await cfCall("/workers/scripts/"+formalScript+"/settings");
const db=(settings?.result?.bindings||[]).find(x=>x?.name==="V7_DB");
const databaseId=db?.id||db?.database_id;
assert.ok(databaseId,"V7_DB binding missing");

const workerSource=String.raw`
async function select(env,sql,params=[]){
  const upper=String(sql||"").trimStart().toUpperCase();
  const readPrefix=upper.startsWith("SELECT ")||upper.startsWith("WITH ")||upper.startsWith("PRAGMA ");
  const blocked=["INSERT ","UPDATE ","DELETE ","REPLACE ","CREATE ","DROP ","ALTER ","VACUUM","ATTACH ","DETACH "].some(token=>upper.includes(token));
  if(!readPrefix||blocked) throw new Error("READ_ONLY_SQL_REQUIRED");
  const r=await env.V7_DB.prepare(sql).bind(...params).all(); return r.results||[];
}
export default {
  async fetch(req,env){
    if(req.headers.get("authorization")!=="Bearer "+env.DIAG_TOKEN)return new Response("Not found",{status:404});
    try{
      const snapshots=await select(env,"SELECT snapshot_id,market_date,observed_at,coverage_json,source_json,created_at FROM v7_pv_shadow_snapshots WHERE observation_type='INTRADAY_15M' AND symbol=?1 AND market_date=?2 ORDER BY observed_at ASC",["2454","2026-10-06"]);
      const baselines=await select(env,"SELECT symbol,valid_sessions,last_market_date,updated_at FROM v7_pv_intraday_baselines WHERE symbol=?1",["2454"]);
      return Response.json({readOnly:true,mutationCount:0,snapshots,baselines});
    }catch(error){return Response.json({readOnly:true,error:String(error?.stack||error).slice(0,1400)},{status:500});}
  }
};`;

let cleanup={subdomainDisabled:false,scriptDeleted:false},raw=null;
try{
  const metadata={main_module:"worker.js",bindings:[{type:"d1",name:"V7_DB",id:databaseId},{type:"plain_text",name:"DIAG_TOKEN",text:diagToken}]};
  const body=new FormData();
  body.append("metadata",new Blob([JSON.stringify(metadata)],{type:"application/json"}),"metadata.json");
  body.append("worker.js",new Blob([workerSource],{type:"application/javascript+module"}),"worker.js");
  await cfCall("/workers/scripts/"+diagScript,{method:"PUT",body});
  await cfCall("/workers/scripts/"+diagScript+"/subdomain",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({enabled:true})});
  const subdomain=(await cfCall("/workers/subdomain")).result?.subdomain;
  const url="https://"+diagScript+"."+subdomain+".workers.dev/";
  for(let attempt=1;attempt<=30;attempt++){
    try{raw=await jsonFetch(url,{headers:{authorization:"Bearer "+diagToken}},"ephemeral D1 diagnostic");break;}
    catch(error){if(attempt===30)throw error;await new Promise(r=>setTimeout(r,2000));}
  }
} finally {
  try{await cfCall("/workers/scripts/"+diagScript+"/subdomain",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({enabled:false})});cleanup.subdomainDisabled=true;}catch{}
  try{await cfCall("/workers/scripts/"+diagScript,{method:"DELETE"});cleanup.scriptDeleted=true;}catch{}
}
assert.equal(raw?.mutationCount,0);
assert.equal(cleanup.subdomainDisabled,true);
assert.equal(cleanup.scriptDeleted,true);

const rows=(raw.snapshots||[]).map(row=>{
  let coverage={},source={};try{coverage=JSON.parse(row.coverage_json||"{}")}catch{}try{source=JSON.parse(row.source_json||"{}")}catch{}
  const ms=Date.parse(row.observed_at);
  const clock=Number.isFinite(ms)?new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Taipei",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(ms)):null;
  return {snapshotId:row.snapshot_id,observedAt:row.observed_at,clock,createdAt:row.created_at,slotHistoryCount:coverage.slotHistoryCount??null,baselineAsOfDate:coverage.baselineAsOfDate??null,coverageReasons:coverage.coverageReasons??null,sourceFetchedAt:source.sourceFetchedAt??source.capturedAt??null};
});
const clocks=rows.map(x=>x.clock).filter(Boolean);
const report={
  schemaVersion:"D02_PVE259_ROLL_PATH_READONLY_V0_1",generatedAt:new Date().toISOString(),readOnly:true,mutationCount:0,
  symbol,targetDate,snapshotCount:rows.length,observedClocks:clocks,latestObservedClock:clocks.at(-1)??null,
  has1300Snapshot:clocks.includes("13:00"),snapshotReceipts:rows,
  currentBaseline:raw.baselines?.[0]??null,cleanup
};
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/d02-pve259-roll-path-readonly.json",JSON.stringify(report,null,2)+"\n");
console.log("D02_PVE259_RESULT="+JSON.stringify(report));
