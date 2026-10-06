import assert from "node:assert/strict";
import {mkdir,writeFile} from "node:fs/promises";
import {randomBytes} from "node:crypto";
import {evaluatePve247} from "./d02_pve247_remediation_acceptance_oracle_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.CLOUDFLARE_API_TOKEN;
assert.ok(accountId&&apiToken,"Cloudflare repository secrets required");

const cf="https://api.cloudflare.com/client/v4";
const formalOrigin="https://fugle-test.imihan0630.workers.dev";
const formalScript="fugle-test";
const diagScript=("d02-pve251-ro-"+process.env.GITHUB_RUN_ID).toLowerCase();
const diagToken=randomBytes(32).toString("hex");
console.log("::add-mask::"+diagToken);

const tzDate=d=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
const tzClock=d=>new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Taipei",hour:"2-digit",minute:"2-digit",hour12:false}).format(d);
const nonEmpty=v=>typeof v==="string"&&v.trim().length>0;
const hash64=v=>typeof v==="string"&&/^[0-9a-f]{64}$/i.test(v);

async function jsonFetch(url,options={},label=url){
  const res=await fetch(url,{...options,signal:AbortSignal.timeout(45000)});
  const text=await res.text();
  let data; try{data=JSON.parse(text)}catch{data=null}
  if(!res.ok||data?.success===false) throw new Error(label+" HTTP "+res.status+": "+String(data?.errors?.[0]?.message||text).slice(0,400));
  return data;
}
async function cfCall(path,options={}){
  return jsonFetch(cf+"/accounts/"+accountId+path,{...options,headers:{authorization:"Bearer "+apiToken,accept:"application/json",...(options.headers||{})}},path);
}

const [settings,runtime,schedules]=await Promise.all([
  cfCall("/workers/scripts/"+formalScript+"/settings"),
  jsonFetch(formalOrigin+"/api/version?d02pve251="+Date.now(),{headers:{accept:"application/json","cache-control":"no-cache"}},"runtime"),
  cfCall("/workers/scripts/"+formalScript+"/schedules")
]);
const db=(settings?.result?.bindings||[]).find(x=>x?.name==="V7_DB");
const databaseId=db?.id||db?.database_id;
assert.ok(databaseId,"V7_DB binding missing");
const configuredSchedules=(Array.isArray(schedules?.result)?schedules.result:Array.isArray(schedules?.result?.schedules)?schedules.result.schedules:[]).map(x=>String(x?.cron||x));

const workerSource=String.raw`
async function select(env,sql,params=[]){
  const upper=String(sql||"").trimStart().toUpperCase();
  const readPrefix=upper.startsWith("SELECT ")||upper.startsWith("WITH ")||upper.startsWith("PRAGMA ");
  const blocked=["INSERT ","UPDATE ","DELETE ","REPLACE ","CREATE ","DROP ","ALTER ","VACUUM","ATTACH ","DETACH "].some(token=>upper.includes(token));
  if(!readPrefix||blocked) throw new Error("READ_ONLY_SQL_REQUIRED");
  const r=await env.V7_DB.prepare(sql).bind(...params).all();
  return r.results||[];
}
export default {
  async fetch(req,env){
    if(req.headers.get("authorization")!=="Bearer "+env.DIAG_TOKEN)return new Response("Not found",{status:404});
    if(req.method!=="GET")return new Response("Method not allowed",{status:405});
    try{
      const snapshots=await select(env,"SELECT snapshot_id,symbol,market_date,observed_at,features_json,context_json,coverage_json,source_json,decision_impact,created_at FROM v7_pv_shadow_snapshots WHERE observation_type='INTRADAY_15M' ORDER BY created_at DESC LIMIT 1000");
      const baselines=await select(env,"SELECT symbol,schema_version,valid_sessions,last_market_date,slot_stats_json,corporate_action_reset_at,updated_at FROM v7_pv_intraday_baselines ORDER BY updated_at DESC");
      const crons=await select(env,"SELECT id,cron_expression,scheduled_at,started_at,finished_at,job_type,status,skipped,fugle_calls,detail,error FROM v7_cron_runs ORDER BY id DESC LIMIT 120");
      return Response.json({readOnly:true,snapshots,baselines,crons,mutationCount:0});
    }catch(error){return Response.json({readOnly:true,error:String(error?.stack||error).slice(0,1400)},{status:500});}
  }
};`;

let cleanup={subdomainDisabled:false,scriptDeleted:false};
let raw=null;
try{
  const metadata={main_module:"worker.js",bindings:[
    {type:"d1",name:"V7_DB",id:databaseId},
    {type:"plain_text",name:"DIAG_TOKEN",text:diagToken}
  ]};
  const body=new FormData();
  body.append("metadata",new Blob([JSON.stringify(metadata)],{type:"application/json"}),"metadata.json");
  body.append("worker.js",new Blob([workerSource],{type:"application/javascript+module"}),"worker.js");
  await cfCall("/workers/scripts/"+diagScript,{method:"PUT",body});
  await cfCall("/workers/scripts/"+diagScript+"/subdomain",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({enabled:true})});
  const subdomain=(await cfCall("/workers/subdomain")).result?.subdomain;
  assert.ok(subdomain,"Workers.dev account subdomain unavailable");
  const url="https://"+diagScript+"."+subdomain+".workers.dev/";
  let lastError=null;
  for(let attempt=1;attempt<=30;attempt++){
    try{
      raw=await jsonFetch(url,{headers:{authorization:"Bearer "+diagToken,accept:"application/json"}},"ephemeral D1 diagnostic");
      break;
    }catch(error){
      lastError=error;
      if(attempt===30) throw error;
      await new Promise(resolve=>setTimeout(resolve,2000));
    }
  }
  if(!raw) throw lastError||new Error("ephemeral D1 diagnostic unavailable");
}finally{
  try{await cfCall("/workers/scripts/"+diagScript+"/subdomain",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({enabled:false})});cleanup.subdomainDisabled=true;}catch(error){cleanup.subdomainDisableError=String(error?.message||error).slice(0,300);}
  try{await cfCall("/workers/scripts/"+diagScript,{method:"DELETE"});cleanup.scriptDeleted=true;}catch(error){cleanup.scriptDeleteError=String(error?.message||error).slice(0,300);}
}

assert.equal(cleanup.subdomainDisabled,true,"diagnostic subdomain cleanup failed");
assert.equal(cleanup.scriptDeleted,true,"diagnostic Worker cleanup failed");
assert.equal(raw?.mutationCount,0,"read-only audit mutation count must stay zero");

const now=new Date();
const marketDate=tzDate(now);
const snapshots=(raw.snapshots||[]).map(row=>{
  let features={},context={},coverage={},source={};
  try{features=JSON.parse(row.features_json||"{}")}catch{}
  try{context=JSON.parse(row.context_json||"{}")}catch{}
  try{coverage=JSON.parse(row.coverage_json||"{}")}catch{}
  try{source=JSON.parse(row.source_json||"{}")}catch{}
  return {...row,features,context,coverage,source};
}).filter(row=>row.market_date===marketDate&&Number(row.decision_impact||0)===0);

const eligible=snapshots.find(row=>
  Number(row.coverage?.slotHistoryCount)>=20 &&
  Number.isFinite(Number(row.features?.pvSlotRvol20)) &&
  row.coverage?.sameSlotBaselineClean===true &&
  nonEmpty(row.source?.provider) &&
  nonEmpty(row.source?.endpoint) &&
  hash64(row.source?.rawPayloadHash) &&
  row.source?.rawPayloadHashBasis==="EXACT_PROVIDER_RESPONSE_SHA256" &&
  nonEmpty(row.source?.sourceFetchedAt||row.source?.capturedAt) &&
  nonEmpty(row.source?.normalizationVersion) &&
  nonEmpty(row.source?.semanticFingerprint)
) || snapshots[0] || null;

const baselineRows=(raw.baselines||[]).map(row=>{
  let payload={}; try{payload=JSON.parse(row.slot_stats_json||"{}")}catch{}
  return {...row,payload,bootstrapReceipt:payload?.bootstrapReceipt||null};
});
const baselineRow=eligible?baselineRows.find(row=>String(row.symbol)===String(eligible.symbol)):baselineRows[0]||null;
const receipt=baselineRow?.bootstrapReceipt||{};

const cronRows=(raw.crons||[]).map(row=>{
  const d=new Date(row.scheduled_at);
  return {...row,taipeiDate:tzDate(d),taipeiClock:tzClock(d)};
});
const family=cronRows.filter(row=>["23:35","23:55"].includes(row.taipeiClock)&&String(row.cron_expression||"").toLowerCase().includes("15 * *"));
const latestFamilyDate=family.map(x=>x.taipeiDate).sort().at(-1)||null;
const afterMarketRows=family.filter(x=>x.taipeiDate===latestFamilyDate).map(row=>({
  taipeiClock:row.taipeiClock,jobType:row.job_type,status:row.status,reason:row.detail||row.error||null,detail:row.detail||null
}));

const baselineInput={
  bootstrapAttemptAt:receipt.bootstrapAttemptAt??null,
  symbol:receipt.symbol??baselineRow?.symbol??eligible?.symbol??null,
  from:receipt.from??null,
  to:receipt.to??null,
  providerStatus:receipt.providerStatus??null,
  rawRowCount:Number.isInteger(receipt.rawRowCount)?receipt.rawRowCount:null,
  normalizedSessionCount:Number.isInteger(receipt.normalizedSessionCount)?receipt.normalizedSessionCount:null,
  rejectedSessionCount:Number.isInteger(receipt.rejectedSessionCount)?receipt.rejectedSessionCount:null,
  rejectedSessionReasons:Array.isArray(receipt.rejectedSessionReasons)?receipt.rejectedSessionReasons:null,
  finalValidSessions:Number.isInteger(receipt.finalValidSessions)?receipt.finalValidSessions:(Number.isInteger(baselineRow?.valid_sessions)?baselineRow.valid_sessions:null),
  slotHistoryCount:eligible?.coverage?.slotHistoryCount??null,
  pvSlotRvol20:Number.isFinite(Number(eligible?.features?.pvSlotRvol20))?Number(eligible.features.pvSlotRvol20):null,
  sameSlotBaselineClean:eligible?.coverage?.sameSlotBaselineClean===true
};
const provenanceInput={
  provider:eligible?.source?.provider??null,
  endpoint:eligible?.source?.endpoint??null,
  rawPayloadHash:eligible?.source?.rawPayloadHash??null,
  rawPayloadHashBasis:eligible?.source?.rawPayloadHashBasis??null,
  capturedAt:eligible?.source?.sourceFetchedAt??eligible?.source?.capturedAt??null,
  normalizationVersion:eligible?.source?.normalizationVersion??null,
  semanticFingerprint:eligible?.source?.semanticFingerprint??null
};
const scheduleInput={cloudflareSchedules:configuredSchedules,afterMarketRows};
const oracle=evaluatePve247({schedule:scheduleInput,baseline:baselineInput,provenance:provenanceInput,futureReceipt:{}});

const report={
  schemaVersion:"D02_PVE251_LIVE_REMEDIATION_READONLY_V0_1",
  generatedAt:new Date().toISOString(),
  marketDate,
  readOnly:true,
  mutationCount:0,
  runtimeVersion:runtime?.version??null,
  configuredSchedules,
  latestAfterMarketDate:latestFamilyDate,
  afterMarketRows,
  selectedDiagnosticRow:eligible?{
    snapshotId:eligible.snapshot_id,symbol:eligible.symbol,marketDate:eligible.market_date,observedAt:eligible.observed_at,
    createdAt:eligible.created_at,slotHistoryCount:eligible.coverage?.slotHistoryCount??null,
    pvSlotRvol20:eligible.features?.pvSlotRvol20??null,sameSlotBaselineClean:eligible.coverage?.sameSlotBaselineClean??null,
    provider:eligible.source?.provider??null,endpoint:eligible.source?.endpoint??null,
    rawPayloadHash:eligible.source?.rawPayloadHash??null,rawPayloadHashBasis:eligible.source?.rawPayloadHashBasis??null,
    sourceFetchedAt:eligible.source?.sourceFetchedAt??null,normalizationVersion:eligible.source?.normalizationVersion??null,
    semanticFingerprint:eligible.source?.semanticFingerprint??null
  }:null,
  baseline:{
    symbol:baselineRow?.symbol??null,validSessions:baselineRow?.valid_sessions??null,lastMarketDate:baselineRow?.last_market_date??null,
    updatedAt:baselineRow?.updated_at??null,bootstrapReceipt:receipt
  },
  oracle,
  cleanup
};
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/d02-pve251-live-remediation-readonly.json",JSON.stringify(report,null,2)+"\n");
console.log("D02_PVE251_RESULT="+JSON.stringify(report));
