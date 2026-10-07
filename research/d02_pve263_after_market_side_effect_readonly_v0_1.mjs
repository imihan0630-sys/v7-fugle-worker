import assert from "node:assert/strict";
import {randomBytes,createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.CLOUDFLARE_API_TOKEN;
assert.ok(accountId&&apiToken,"Cloudflare repository secrets required");

const cf="https://api.cloudflare.com/client/v4";
const formalScript="fugle-test";
const diagScript=("d02-pve263-ro-"+process.env.GITHUB_RUN_ID).toLowerCase();
const diagToken=randomBytes(32).toString("hex");
console.log("::add-mask::"+diagToken);
const sha=v=>typeof v==="string"?createHash("sha256").update(v).digest("hex"):null;

async function jsonFetch(url,options={},label=url){
 const res=await fetch(url,{...options,signal:AbortSignal.timeout(45000)});
 const text=await res.text();let data;try{data=JSON.parse(text)}catch{data=null}
 if(!res.ok||data?.success===false)throw new Error(label+" HTTP "+res.status+": "+String(data?.errors?.[0]?.message||text).slice(0,400));
 return data;
}
async function cfCall(path,options={}){
 return jsonFetch(cf+"/accounts/"+accountId+path,{...options,headers:{authorization:"Bearer "+apiToken,accept:"application/json",...(options.headers||{})}},path);
}
const settings=await cfCall("/workers/scripts/"+formalScript+"/settings");
const bindings=settings?.result?.bindings||[];
const d1=bindings.find(x=>x?.name==="V7_DB");
const kv=bindings.find(x=>x?.name==="STOCKS_KV");
const databaseId=d1?.id||d1?.database_id;
const namespaceId=kv?.namespace_id||kv?.id;
assert.ok(databaseId,"V7_DB binding missing");
assert.ok(namespaceId,"STOCKS_KV binding missing");

const workerSource=String.raw`
async function select(env,sql,params=[]){
 const upper=String(sql||"").trimStart().toUpperCase();
 const readPrefix=upper.startsWith("SELECT ")||upper.startsWith("WITH ")||upper.startsWith("PRAGMA ");
 const blocked=["INSERT ","UPDATE ","DELETE ","REPLACE ","CREATE ","DROP ","ALTER ","VACUUM","ATTACH ","DETACH "].some(token=>upper.includes(token));
 if(!readPrefix||blocked)throw new Error("READ_ONLY_SQL_REQUIRED");
 const r=await env.V7_DB.prepare(sql).bind(...params).all();return r.results||[];
}
export default{async fetch(req,env){
 if(req.headers.get("authorization")!=="Bearer "+env.DIAG_TOKEN)return new Response("Not found",{status:404});
 try{
  const [attempt,latestScan,lastMonitor,leases]=await Promise.all([
    env.STOCKS_KV.get("V7_LAST_SCAN_ATTEMPT"),
    env.STOCKS_KV.get("V7_LAST_AFTER_MARKET_SCAN"),
    env.STOCKS_KV.get("V7_LAST_MONITOR_RUN"),
    select(env,"SELECT state_key,snapshot_json,lease_until,updated_at FROM v7_signal_delivery_state WHERE state_key LIKE 'V7_AFTER_MARKET_LEASE:%' ORDER BY updated_at DESC LIMIT 8")
  ]);
  return Response.json({readOnly:true,mutationCount:0,attempt,latestScan,lastMonitor,leases});
 }catch(error){return Response.json({readOnly:true,error:String(error?.stack||error).slice(0,1400)},{status:500});}
}};`;

let cleanup={subdomainDisabled:false,scriptDeleted:false},raw=null;
try{
 const metadata={main_module:"worker.js",bindings:[
  {type:"d1",name:"V7_DB",id:databaseId},
  {type:"kv_namespace",name:"STOCKS_KV",namespace_id:namespaceId},
  {type:"plain_text",name:"DIAG_TOKEN",text:diagToken}
 ]};
 const body=new FormData();body.append("metadata",new Blob([JSON.stringify(metadata)],{type:"application/json"}),"metadata.json");body.append("worker.js",new Blob([workerSource],{type:"application/javascript+module"}),"worker.js");
 await cfCall("/workers/scripts/"+diagScript,{method:"PUT",body});
 await cfCall("/workers/scripts/"+diagScript+"/subdomain",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({enabled:true})});
 const subdomain=(await cfCall("/workers/subdomain")).result?.subdomain;
 const url="https://"+diagScript+"."+subdomain+".workers.dev/";
 for(let attempt=1;attempt<=30;attempt++){try{raw=await jsonFetch(url,{headers:{authorization:"Bearer "+diagToken}},"ephemeral D1/KV diagnostic");break;}catch(error){if(attempt===30)throw error;await new Promise(r=>setTimeout(r,2000));}}
}finally{
 try{await cfCall("/workers/scripts/"+diagScript+"/subdomain",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({enabled:false})});cleanup.subdomainDisabled=true;}catch{}
 try{await cfCall("/workers/scripts/"+diagScript,{method:"DELETE"});cleanup.scriptDeleted=true;}catch{}
}
assert.equal(raw?.mutationCount,0);assert.equal(cleanup.subdomainDisabled,true);assert.equal(cleanup.scriptDeleted,true);

const parse=text=>{if(typeof text!=="string"||!text)return null;try{return JSON.parse(text)}catch{return {unparsed:true}}};
const attempt=parse(raw.attempt),scan=parse(raw.latestScan),monitor=parse(raw.lastMonitor);
const sanitizeAttempt=x=>x?{
 status:x.status??null,requestedDate:x.requestedDate??null,scanDate:x.scanDate??null,selectedCount:x.selectedCount??null,
 generatedAt:x.generatedAt??null,error:x.error??null,failureAlertSent:x.failureAlert?.sent??null
}:null;
const sanitizeScan=x=>x?{
 scanDate:x.scanDate??null,generatedAt:x.generatedAt??null,selectedCount:x.selectedCount??null,
 pipelineComplete:x.pipeline?.complete??null,dailyReportGeneratedAt:x.dailyReport?.generatedAt??null
}:null;
const sanitizeMonitor=x=>x?{
 generatedAt:x.generatedAt??null,generatedAtIso:x.generatedAtIso??null,status:x.status??null
}:null;
const leases=(raw.leases||[]).map(row=>{
 let snapshot=null;try{snapshot=JSON.parse(row.snapshot_json||"null")}catch{}
 return {stateKey:row.state_key,updatedAt:row.updated_at,leaseUntil:row.lease_until,
   snapshot:snapshot?{status:snapshot.status??null,scanDate:snapshot.scanDate??null,generatedAt:snapshot.generatedAt??null,testMode:snapshot.testMode??null}:null};
});
const report={
 schemaVersion:"D02_PVE263_AFTER_MARKET_SIDE_EFFECT_READONLY_V0_1",generatedAt:new Date().toISOString(),readOnly:true,mutationCount:0,
 kv:{
  lastScanAttempt:sanitizeAttempt(attempt),lastAfterMarketScan:sanitizeScan(scan),lastMonitor:sanitizeMonitor(monitor),
  lastScanAttemptRawHash:sha(raw.attempt),lastAfterMarketScanRawHash:sha(raw.latestScan),lastMonitorRawHash:sha(raw.lastMonitor)
 },
 signalLeases:leases,cleanup
};
await mkdir("artifacts",{recursive:true});await writeFile("artifacts/d02-pve263-after-market-side-effect-readonly.json",JSON.stringify(report,null,2)+"\n");
console.log("D02_PVE263_RESULT="+JSON.stringify(report));
