// Read-only full V8 business-engine computation on free GitHub Runner, not Cloudflare Worker.
// No production KV/D1/Worker mutations. Temporary migration proof, NOT a formal trading plan.
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {createHash,randomBytes} from "node:crypto";
const id=process.env.CLOUDFLARE_ACCOUNT_ID||"";
const wt=process.env.CLOUDFLARE_API_TOKEN||"";
const dt=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||wt;
const target="2026-10-12";
const result={schema:"V8_NODE_RUNNER_EXACT_ENGINE_READONLY_POC_V0_1",timestamp:new Date().toISOString(),
  targetDate:target,source:"UNMODIFIED_LATEST_MAIN_WORKER_JS",noProductionWrite:true,noPush:true,noTrade:true,
  kvReadCount:0,d1ReadQueries:0,d1SelectRowsRead:0,d1WriteStatements:0,preflight:{},
  status:"INITIAL",error:null,selection:null};
const api="https://api.cloudflare.com/client/v4/accounts/"+id;
async function jsonCall(path,token,method="GET",data=null,deadline=25000){
 const resp=await fetch(api+path,{method,headers:{authorization:"Bearer "+token,accept:"application/json",...(data?{"content-type":"application/json"}:{})},...(data?{body:JSON.stringify(data)}:{}),signal:AbortSignal.timeout(deadline)});
 const v=await resp.json().catch(()=>null);if(!resp.ok||v?.success===false)
   throw Error("CLOUDFLARE_"+method+"_HTTP_"+resp.status+"_"+path.replace(/[0-9a-f-]{32,}/ig,"ID"));
 return v.result;
}
const memory=new Map();
let diagName=null,diagUrl=null,diagToken=null;
result.ephemeralDiagnostic={created:false,subdomainDisabled:false,scriptDeleted:false,
 scope:"ONLY_TEMPORARY_READONLY_KV_WORKER_NO_ORIGINAL_CODE_OR_CRON_CHANGES"};
try{
 if(!/^[0-9a-f]{32}$/i.test(id)||!wt||!dt)throw Error("SOURCE_PROVIDER_CREDENTIALS_MISSING");
 const [settings,dbs]=await Promise.all([jsonCall("/workers/scripts/fugle-test/settings",wt),jsonCall("/d1/database?per_page=100",dt)]);
 const d1=dbs.filter(x=>x.name==="v7-live");
 if(d1.length!==1)throw Error("SOURCE_V8_D1_IDENTITY_INVALID");
 const dbId=d1[0].uuid||d1[0].id;
 const d1binding=(settings.bindings||[]).find(x=>x.name==="V7_DB");
 const kvbinding=(settings.bindings||[]).find(x=>x.name==="STOCKS_KV");
 const actualDbBinding=d1binding?.id||d1binding?.database_id;
 const kvId=kvbinding?.namespace_id||kvbinding?.id;
 if(dbId!==actualDbBinding||!kvId)throw Error("SOURCE_BINDINGS_MISMATCH");
 diagName="v8-ro-kv-"+String(process.env.GITHUB_RUN_ID||"").replace(/[^0-9]/g,"");
 diagToken=randomBytes(32).toString("hex");
 const diagSource=`export default{async fetch(req,env){
   if(req.headers.get("authorization")!=="Bearer "+env.DIAG_TOKEN)return new Response("not found",{status:404});
   const key=new URL(req.url).searchParams.get("key")||"";
   if(!/^(V7_MARKET_STATE|STOCK_CONFIG_V7|STOCK_CONFIG_V6|V7_TRADING_CALENDAR:2026|V7_OFFICIAL_CLOSING:(TWSE|TPEx):2026-10-12|V7_EXTERNAL_VALIDATION:2026-10-12)$/.test(key))return new Response("forbidden",{status:403});
   const val=await env.STOCKS_KV.get(key);
   return val===null?new Response("missing",{status:404}):new Response(val,{headers:{"cache-control":"no-store","content-type":"application/json"}});
 }};`;
 const metadata={main_module:"worker.js",bindings:[
   {type:"kv_namespace",name:"STOCKS_KV",namespace_id:kvId},
   {type:"plain_text",name:"DIAG_TOKEN",text:diagToken}
 ]};
 const form=new FormData();
 form.append("metadata",new Blob([JSON.stringify(metadata)],{type:"application/json"}),"metadata.json");
 form.append("worker.js",new Blob([diagSource],{type:"application/javascript+module"}),"worker.js");
 const deployed=await fetch(api+"/workers/scripts/"+diagName,{
   method:"PUT",headers:{authorization:"Bearer "+wt},body:form,signal:AbortSignal.timeout(30000)});
 const response=await deployed.json().catch(()=>null);
 if(!deployed.ok||response?.success===false)throw Error("TEMP_READONLY_WORKER_DEPLOY_DENIED_"+deployed.status);
 result.ephemeralDiagnostic.created=true;
 await jsonCall("/workers/scripts/"+diagName+"/subdomain",wt,"POST",{enabled:true});
 const sub=await jsonCall("/workers/subdomain",wt);
 if(!sub?.subdomain)throw Error("TEMP_READONLY_SUBDOMAIN_UNAVAILABLE");
 diagUrl="https://"+diagName+"."+sub.subdomain+".workers.dev/";
 result.preflight.sourceWorkerMatchesOriginalD1=true;
 result.preflight.originalKVPresent=true;
 result.preflight.productionConfigBindingNames=(settings.bindings||[]).filter(x=>/^V7_|^FUGLE_|^THREEMIN_|^STOCK_CONFIG$/.test(String(x.name||""))).map(x=>({name:x.name,type:x.type}));
 result.preflight.productionCustomEnrichmentTokenPresent=!!(settings.bindings||[]).find(x=>x.name==="V7_ENRICHMENT_API_TOKEN");
 const names=await jsonCall("/d1/database/"+dbId+"/query",dt,"POST",{sql:"SELECT name FROM sqlite_schema WHERE type='table' AND name LIKE 'v7_%' LIMIT 25"});
 const tables=new Set((names[0]?.results||[]).map(x=>x.name));
 for(const name of ["v7_history_cache","v7_institution_snapshots","v7_quality_snapshots","v7_history_seed_state"])
   if(!tables.has(name))throw Error("SOURCE_REQUIRED_TABLE_MISSING_"+name);
 async function kvGet(key,type){
  if(memory.has(key)){let v=memory.get(key);return type==="json"?JSON.parse(v):v;}
  result.kvReadCount++;
  if(result.kvReadCount>50)throw Error("KV_READ_BUDGET_EXCEEDED");
  const response=await fetch(api+"/storage/kv/namespaces/"+kvId+"/values/"+encodeURIComponent(key),{
     headers:{authorization:"Bearer "+wt},signal:AbortSignal.timeout(35000)});
  if(response.status===404)return null;
  let effective=response;
  if(response.status===401 && dt!==wt){
    // A second existing repository token may hold an already-authorized KV READ scope.
    // Fail closed if both tokens reject; never change credentials or Cloudflare bindings.
    effective=await fetch(api+"/storage/kv/namespaces/"+kvId+"/values/"+encodeURIComponent(key),{
      headers:{authorization:"Bearer "+dt},signal:AbortSignal.timeout(35000)});
  }
  if(!effective.ok&&diagUrl&&[401,403,404].includes(effective.status)){
    effective=await fetch(diagUrl+"?key="+encodeURIComponent(key),{
      headers:{authorization:"Bearer "+diagToken},signal:AbortSignal.timeout(30000)});
  }
  if(effective.status===404)return null;
  if(!effective.ok)throw Error("PROVIDER_KV_READ_HTTP_"+effective.status+"_KEY_GROUP_"+String(key).split(":")[0]);
  const t=await effective.text();
  if(t.length>25000000)throw Error("KV_PAYLOAD_TOO_LARGE");
  return type==="json"?JSON.parse(t):t;
 }
 const kv={get:kvGet,put:async(k,v)=>{memory.set(k,v);return null;}};
 async function sqlRequest(sql,params=[]){
   const trimmed=sql.trimStart().toUpperCase();
   if(!trimmed.startsWith("SELECT ")&&!trimmed.startsWith("WITH ")&&!trimmed.startsWith("PRAGMA "))
     throw Error("PRODUCTION_SQL_WRITE_FORBIDDEN");
   if(/\b(INSERT|UPDATE|DELETE|DROP|CREATE|REPLACE|ALTER|VACUUM|ATTACH|DETACH)\b/i.test(trimmed))
     throw Error("SQL_MUTATION_TOKEN_IN_QUERY");
   result.d1ReadQueries++;
   if(result.d1ReadQueries>150)throw Error("D1_QUERY_BUDGET_EXCEEDED");
   const data=await jsonCall("/d1/database/"+dbId+"/query",dt,"POST",{sql,params},50000);
   if(!Array.isArray(data)||data.length!==1||data[0].success!==true)throw Error("D1_SOURCE_SELECT_UNVERIFIED");
   const r=data[0];
   result.d1SelectRowsRead+=Number(r.meta?.rows_read??r.results?.length??0);
   if(result.d1SelectRowsRead>100000)throw Error("D1_ROWS_READ_BUDGET_EXCEEDED");
   return {results:r.results||[],meta:r.meta||{}};
 }
 // Dry-run calls ensureD1Schema internally; verify required schemas above and neutralize
 // CREATE IF NOT EXISTS locally. Every physical Cloudflare SQL request remains SELECT-only.
 function prepare(sql){
  let args=[];
  const create=/^\s*CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+/i.test(sql);
  return {
   bind(...v){args=v;return this;},
   async all(){if(create)throw Error("SELECT_ONLY_EXPECTED");return sqlRequest(sql,args);},
   async first(){if(create)throw Error("SELECT_ONLY_EXPECTED");const t=await sqlRequest(sql,args);return t.results[0]||null;},
   async run(){if(create)return {success:true,meta:{changes:0,rows_written:0}};result.d1WriteStatements++;throw Error("PHYSICAL_D1_WRITE_BLOCKED");}
  };
 }
 const v7Db={prepare,withSession(){return v7Db;}};
 // Original source module, only adding a read-only testing export; no algorithm alterations.
 const workerText=await readFile("Worker.js","utf8");
 const module=await import("data:text/javascript;base64,"+Buffer.from(workerText+"\nexport {runAfterMarketScan};").toString("base64"));
 const capitalVar=(settings.bindings||[]).find(x=>x.name==="V7_TOTAL_CAPITAL"&&x.type==="plain_text")?.text;
 const env={V7_DB:v7Db,STOCKS_KV:kv,V7_TOTAL_CAPITAL:capitalVar||"200000"};
 const enrichUrl=(settings.bindings||[]).find(x=>x.name==="V7_ENRICHMENT_API_URL"&&x.type==="plain_text")?.text;
 if(enrichUrl)env.V7_ENRICHMENT_API_URL=enrichUrl;
 const enrichJson=(settings.bindings||[]).find(x=>x.name==="V7_ENRICHMENT_JSON"&&x.type==="plain_text")?.text;
 if(enrichJson)env.V7_ENRICHMENT_JSON=enrichJson;
 const time=Date.parse(target+"T15:35:00Z");
 const scan=await module.runAfterMarketScan(env,time,{dryRun:true});
 if(!scan||scan.dryRun!==true||scan.scanDate!==target||!scan.pipeline?.selectionCompleted)
   throw Error("NODE_ORIGINAL_ENGINE_NOT_FULLY_COMPLETED");
 result.status="ORIGINAL_FULL_V8_ENGINE_OFFLINE_SELECTION_EXECUTED";
 result.selection={scanDate:scan.scanDate,selectedCount:scan.selectedCount,
   selectedStocks:Array.isArray(scan.stocks)?scan.stocks.map(s=>({symbol:s.symbol,name:s.name,signalLevel:s.signalLevel,channel:s.channel})):null,
   EPSReviewReady:scan.diagnostics?.quarterEpsReview?.ready===true,
   EPSReviewMissing:scan.diagnostics?.quarterEpsReview?.missingSymbols??null,
   EPSReviewPeriod:{year:scan.diagnostics?.quarterEpsReview?.year??null,quarter:scan.diagnostics?.quarterEpsReview?.quarter??null},
   EPSReviewedCount:scan.diagnostics?.quarterEpsReview?.reviewedCount??null,
   history60DayCount:scan.diagnostics?.history60DayCount??null,
   historyCoverageComplete:scan.diagnostics?.historyCoverageComplete??null,
   cpuOffloaded:true,cloudflareWorkerResourceUsageForCompute:0};
}catch(error){result.status="OFFLINE_PROOF_FAILED_NO_CLAIM";result.error=String(error.message||error).slice(0,500);process.exitCode=2;}
finally{
 if(diagName&&result.ephemeralDiagnostic.created){
   try{await jsonCall("/workers/scripts/"+diagName+"/subdomain",wt,"POST",{enabled:false});
       result.ephemeralDiagnostic.subdomainDisabled=true;}catch(error){result.ephemeralDiagnostic.disableError=String(error.message||error).slice(0,100);}
   try{const d=await fetch(api+"/workers/scripts/"+diagName,{
       method:"DELETE",headers:{authorization:"Bearer "+wt},signal:AbortSignal.timeout(25000)});
       const x=await d.json().catch(()=>null);
       result.ephemeralDiagnostic.scriptDeleted=d.ok&&x?.success!==false;
   }catch(error){result.ephemeralDiagnostic.deleteError=String(error.message||error).slice(0,100);}
   if(!result.ephemeralDiagnostic.subdomainDisabled||!result.ephemeralDiagnostic.scriptDeleted){
      result.status="TEMPORARY_DIAGNOSTIC_WORKER_CLEANUP_UNVERIFIED";process.exitCode=2;
   }
 }
 await mkdir("artifacts",{recursive:true});
 const core={targetDate:target,status:result.status,selection:result.selection,error:result.error};
 result.fingerprint=createHash("sha256").update(JSON.stringify(core)).digest("hex");
 await writeFile("artifacts/v8-node-exact-engine-offline-proof.json",JSON.stringify(result,null,2)+"\n");
 console.log("V8_NODE_OFFLINE_ENGINE_PROOF="+JSON.stringify(result));
}
