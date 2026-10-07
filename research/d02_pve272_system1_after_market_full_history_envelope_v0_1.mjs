import assert from "node:assert/strict";
import {mkdir,writeFile} from "node:fs/promises";
import {randomBytes} from "node:crypto";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.CLOUDFLARE_API_TOKEN;
const system2Token=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||"";
assert.ok(accountId&&apiToken,"Cloudflare credentials required");
const api="https://api.cloudflare.com/client/v4";

async function jsonFetch(url,options={},label=url){
  const res=await fetch(url,{...options,signal:AbortSignal.timeout(45000)});
  const text=await res.text();let data;try{data=JSON.parse(text)}catch{data=null}
  if(!res.ok||data?.success===false)throw new Error(label+" HTTP "+res.status+": "+String(data?.errors?.[0]?.message||text).slice(0,700));
  return data;
}
async function cf(path,options={}){
  return jsonFetch(api+"/accounts/"+accountId+path,{...options,headers:{authorization:"Bearer "+apiToken,accept:"application/json",...(options.headers||{})}},path);
}
const settings=await cf("/workers/scripts/fugle-test/settings");
const binding=(settings?.result?.bindings||[]).find(x=>x?.name==="V7_DB");
const dbId=binding?.id||binding?.database_id;
assert.ok(dbId,"V7_DB binding missing");

const diagScript=("d02-pve272-ro-"+process.env.GITHUB_RUN_ID).toLowerCase();
const diagToken=randomBytes(32).toString("hex");
console.log("::add-mask::"+diagToken);
const workerSource=String.raw`
async function select(env,sql,params=[]){
  const upper=String(sql||"").trimStart().toUpperCase();
  if(!(upper.startsWith("SELECT ")||upper.startsWith("WITH ")||upper.startsWith("PRAGMA ")))throw new Error("READ_ONLY_SQL_REQUIRED");
  if(["INSERT ","UPDATE ","DELETE ","REPLACE ","CREATE ","DROP ","ALTER ","VACUUM","ATTACH ","DETACH "].some(token=>upper.includes(token)))throw new Error("MUTATING_SQL_REJECTED");
  const r=await env.V7_DB.prepare(sql).bind(...params).all();return r.results||[];
}
export default{async fetch(req,env){
  if(req.headers.get("authorization")!=="Bearer "+env.DIAG_TOKEN)return new Response("Not found",{status:404});
  const bounds=await select(env,"SELECT MIN(scheduled_at) min_at, MAX(scheduled_at) max_at, COUNT(*) row_count FROM v7_cron_runs");
  const rows=await select(env,"SELECT id,cron_expression,scheduled_at,job_type,status,skipped,fugle_calls FROM v7_cron_runs WHERE job_type='AFTER_MARKET_SCAN' AND status='SUCCESS' AND skipped=0 ORDER BY scheduled_at ASC");
  return Response.json({readOnly:true,mutationCount:0,bounds:bounds[0]||null,rows});
}};`;
let raw=null,cleanup={subdomainDisabled:false,scriptDeleted:false};
try{
  const metadata={main_module:"worker.js",bindings:[
    {type:"d1",name:"V7_DB",id:dbId},
    {type:"plain_text",name:"DIAG_TOKEN",text:diagToken}
  ]};
  const body=new FormData();
  body.append("metadata",new Blob([JSON.stringify(metadata)],{type:"application/json"}),"metadata.json");
  body.append("worker.js",new Blob([workerSource],{type:"application/javascript+module"}),"worker.js");
  await cf("/workers/scripts/"+diagScript,{method:"PUT",body});
  await cf("/workers/scripts/"+diagScript+"/subdomain",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({enabled:true})});
  const subdomain=(await cf("/workers/subdomain")).result?.subdomain;
  const url="https://"+diagScript+"."+subdomain+".workers.dev/";
  for(let attempt=1;attempt<=30;attempt++){
    try{raw=await jsonFetch(url,{headers:{authorization:"Bearer "+diagToken}},"ephemeral V7 D1 read");break;}
    catch(error){if(attempt===30)throw error;await new Promise(r=>setTimeout(r,2000));}
  }
}finally{
  try{await cf("/workers/scripts/"+diagScript+"/subdomain",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({enabled:false})});cleanup.subdomainDisabled=true;}catch{}
  try{await cf("/workers/scripts/"+diagScript,{method:"DELETE"});cleanup.scriptDeleted=true;}catch{}
}
assert.equal(raw?.readOnly,true);assert.equal(raw?.mutationCount,0);
assert.equal(cleanup.subdomainDisabled,true);assert.equal(cleanup.scriptDeleted,true);

const dateFmt=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"});
const timeFmt=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Taipei",hour:"2-digit",minute:"2-digit",hour12:false});
const successes=(raw.rows||[]).map(r=>{
  const d=new Date(r.scheduled_at);
  return {...r,taipeiDate:dateFmt.format(d),taipeiClock:timeFmt.format(d)};
});
const healthy=[...new Set(successes.filter(r=>["23:35","23:55"].includes(r.taipeiClock)).map(r=>r.taipeiDate))].sort();
const minDate=healthy[0]||null,maxDate=healthy.at(-1)||null;

let daily=[];
let tokenRole=null;
if(minDate&&maxDate){
  const query=`query D1DailyRows($accountTag: string!, $start: Date, $end: Date) {
    viewer { accounts(filter:{accountTag:$accountTag}) {
      d1AnalyticsAdaptiveGroups(limit:10000,filter:{date_geq:$start,date_leq:$end},orderBy:[date_ASC]){
        sum { rowsRead rowsWritten readQueries writeQueries }
        dimensions { date databaseId }
      }
    }}
  }`;
  async function gqlWith(token){
    const res=await fetch(api+"/graphql",{method:"POST",headers:{authorization:"Bearer "+token,accept:"application/json","content-type":"application/json"},body:JSON.stringify({query,variables:{accountTag:accountId,start:minDate,end:maxDate}}),signal:AbortSignal.timeout(45000)});
    const text=await res.text();let data;try{data=JSON.parse(text)}catch{data=null}
    return {ok:res.ok&&!data?.errors?.length,status:res.status,data,error:data?.errors||text};
  }
  let ga=await gqlWith(apiToken);tokenRole="CLOUDFLARE_API_TOKEN";
  if(!ga.ok&&system2Token){ga=await gqlWith(system2Token);tokenRole="SYSTEM2_CLOUDFLARE_API_TOKEN";}
  if(!ga.ok)throw new Error("GraphQL unavailable "+ga.status+" "+JSON.stringify(ga.error).slice(0,700));
  const groups=ga.data?.data?.viewer?.accounts?.[0]?.d1AnalyticsAdaptiveGroups||[];
  const byDate=new Map();
  for(const g of groups){
    if(g?.dimensions?.databaseId!==dbId)continue;
    byDate.set(String(g.dimensions.date),{
      rowsWritten:Number(g?.sum?.rowsWritten||0),rowsRead:Number(g?.sum?.rowsRead||0),
      writeQueries:Number(g?.sum?.writeQueries||0),readQueries:Number(g?.sum?.readQueries||0)
    });
  }
  daily=healthy.map(d=>({date:d,...(byDate.get(d)||{rowsWritten:0,rowsRead:0,writeQueries:0,readQueries:0})}));
}
const writes=daily.map(x=>x.rowsWritten).filter(x=>Number.isFinite(x)&&x>0).sort((a,b)=>a-b);
const q=p=>writes.length?writes[Math.min(writes.length-1,Math.max(0,Math.ceil(writes.length*p)-1))]:null;
const state=healthy.length>=3&&writes.length===healthy.length?"HISTORICAL_HEALTHY_ENVELOPE_CALIBRATABLE":"INSUFFICIENT_FULL_HISTORY_HEALTHY_DAYS";
const report={
  schemaVersion:"D02_PVE272_SYSTEM1_AFTER_MARKET_FULL_HISTORY_ENVELOPE_V0_1",
  generatedAt:new Date().toISOString(),readOnly:true,mutationCount:0,cleanup,
  cronBounds:raw.bounds||null,
  successfulAfterMarketRows:successes,
  healthyAfterMarketDates:healthy,
  healthyDateCount:healthy.length,
  analyticsTokenRole:tokenRole,
  v7DailyUsage:daily,
  distribution:{min:q(0),median:q(0.5),p90:q(0.9),max:writes.length?writes.at(-1):null},
  state,
  interpretation:{
    wholeDayUpperEnvelopeOnly:true,
    exactAfterMarketWriteCostKnown:false,
    arbitrarySafetyMarginForbidden:true,
    reserveCandidateAuthorized:state==="HISTORICAL_HEALTHY_ENVELOPE_CALIBRATABLE",
    reserveCandidateMeaning:"At most a conservative whole-V7_DB healthy-day envelope; exact reserve still requires governance acceptance."
  }
};
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/d02-pve272-system1-after-market-full-history-envelope.json",JSON.stringify(report,null,2)+"\n");
console.log("D02_PVE272_RESULT="+JSON.stringify(report));
