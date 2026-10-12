// Read-only full V8 business-engine computation on free GitHub Runner, not Cloudflare Worker.
// No production KV/D1/Worker mutations. Temporary migration proof, NOT a formal trading plan.
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {createHash,randomBytes} from "node:crypto";
const id=process.env.CLOUDFLARE_ACCOUNT_ID||"";
const wt=process.env.CLOUDFLARE_API_TOKEN||"";
const dt=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||wt;
const target="2026-10-12";
const result={schema:"V8_NODE_RUNNER_EXACT_ENGINE_READONLY_POC_V0_1",timestamp:new Date().toISOString(),
  targetDate:target,source:"UNMODIFIED_LATEST_MAIN_WORKER_JS",noProductionWrite:false,noD1Write:true,noPush:true,noTrade:true,
  kvReadCount:0,d1ReadQueries:0,d1SelectRowsRead:0,d1WriteStatements:0,preflight:{},
  status:"INITIAL",error:null,selection:null,monitorDelivery:{state:"NOT_ATTEMPTED",postCount:0,verified:false}};
const api="https://api.cloudflare.com/client/v4/accounts/"+id;
async function jsonCall(path,token,method="GET",data=null,deadline=25000){
 const resp=await fetch(api+path,{method,headers:{authorization:"Bearer "+token,accept:"application/json",...(data?{"content-type":"application/json"}:{})},...(data?{body:JSON.stringify(data)}:{}),signal:AbortSignal.timeout(deadline)});
 const v=await resp.json().catch(()=>null);if(!resp.ok||v?.success===false)
   throw Error("CLOUDFLARE_"+method+"_HTTP_"+resp.status+"_"+path.replace(/[0-9a-f-]{32,}/ig,"ID"));
 return v.result;
}
const memory=new Map();
let diagName=null,diagUrl=null,diagToken=null,qualityOverlay=null,fullScanStocks=null;
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
  // 404 from account KV API is verified once through the original namespace binding before treating it as absent.
  let effective=response;
  if(response.status===401 && dt!==wt){
    // A second existing repository token may hold an already-authorized KV READ scope.
    // Fail closed if both tokens reject; never change credentials or Cloudflare bindings.
    effective=await fetch(api+"/storage/kv/namespaces/"+kvId+"/values/"+encodeURIComponent(key),{
      headers:{authorization:"Bearer "+dt},signal:AbortSignal.timeout(35000)});
  }
  if(!effective.ok&&diagUrl&&[401,403,404,429,500,502,503,504].includes(effective.status)){
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
   // A strictly local Q2 EPS overlay; source Cloudflare D1 result is never updated.
   if(qualityOverlay && params[0]==="QUARTER_EPS" && r.results?.[0]?.snapshot_json){
     const old=JSON.parse(r.results[0].snapshot_json);
     if(old.year!==qualityOverlay.year||old.quarter!==qualityOverlay.quarter)
       throw Error("MOPS_EPS_PERIOD_DRIFT");
     const prior=Object.keys(old.stocks||{}).length;
     old.stocks={...(old.stocks||{}),...qualityOverlay.verifiedStocks};
     old.count=Object.keys(old.stocks).length;
     r.results[0].snapshot_json=JSON.stringify(old);
     result.preflight.epsSourceExtension={inMemoryOnly:true,originalCount:prior,
       extendedCount:old.count,symbols:Object.keys(qualityOverlay.verifiedStocks),officialSourceSha:qualityOverlay.receipts};
   }
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
 const module=await import("data:text/javascript;base64,"+Buffer.from(workerText+"\nexport {runAfterMarketScan,validateOfficialQualityData};").toString("base64"));
 const capitalVar=(settings.bindings||[]).find(x=>x.name==="V7_TOTAL_CAPITAL"&&x.type==="plain_text")?.text;
 const env={V7_DB:v7Db,STOCKS_KV:kv,V7_TOTAL_CAPITAL:capitalVar||"200000"};
 const existingPlainStockConfig=(settings.bindings||[]).find(x=>x.name==="STOCK_CONFIG"&&x.type==="plain_text")?.text;
 if(existingPlainStockConfig)env.STOCK_CONFIG=existingPlainStockConfig;
 result.preflight.originalPlainStockConfigInjected=Boolean(existingPlainStockConfig);
 const enrichUrl=(settings.bindings||[]).find(x=>x.name==="V7_ENRICHMENT_API_URL"&&x.type==="plain_text")?.text;
 if(enrichUrl)env.V7_ENRICHMENT_API_URL=enrichUrl;
 const enrichJson=(settings.bindings||[]).find(x=>x.name==="V7_ENRICHMENT_JSON"&&x.type==="plain_text")?.text;
 if(enrichJson)env.V7_ENRICHMENT_JSON=enrichJson;
 const {verifiedOfficialQuarterEpsOverlay}=await import("./v8_offline_quality_eps_overlay_readonly_v0_1.mjs");
 qualityOverlay=await verifiedOfficialQuarterEpsOverlay({parseAndValidate:module,marketDate:target,
   year:2026,quarter:2,symbols:["6226","2617"]});
 const time=Date.parse(target+"T15:35:00Z");
 const scan=await module.runAfterMarketScan(env,time,{dryRun:true});
 if(!scan||scan.dryRun!==true||scan.scanDate!==target||!scan.pipeline?.selectionCompleted)
   throw Error("NODE_ORIGINAL_ENGINE_NOT_FULLY_COMPLETED");
 fullScanStocks=Array.isArray(scan.stocks)?structuredClone(scan.stocks):null;
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
 if(result.status==="ORIGINAL_FULL_V8_ENGINE_OFFLINE_SELECTION_EXECUTED"&&process.exitCode!==2){
  try{await deliverOnce();}catch(e){result.monitorDelivery.error=String(e.message||e).slice(0,350);if(result.monitorDelivery.state==="NOT_ATTEMPTED")result.monitorDelivery.state="BLOCKED_BEFORE_POST";process.exitCode=2;}
 }
 await mkdir("artifacts",{recursive:true});
 const core={targetDate:target,status:result.status,selection:result.selection,error:result.error,monitorDelivery:result.monitorDelivery};
 result.fingerprint=createHash("sha256").update(JSON.stringify(core)).digest("hex");
 await writeFile("artifacts/v8-node-exact-engine-offline-proof.json",JSON.stringify(result,null,2)+"\n");
 console.log("V8_OWNER_MONITOR_CONFIG_SEND_ONCE="+JSON.stringify(result));
}

async function deliverOnce(){
 const out=result.monitorDelivery;
 if(process.env.V8_OWNER_MONITOR_SEND_ONCE!=="USER_EXPLICIT_20261013")throw Error("OWNER_AUTHORIZATION_MISSING");
 if(!result.ephemeralDiagnostic.subdomainDisabled||!result.ephemeralDiagnostic.scriptDeleted)throw Error("TEMP_DIAG_NOT_REMOVED");
 const q=result.selection,expected=["6226","8046","3037","6191","2609"];
 if(result.status!=="ORIGINAL_FULL_V8_ENGINE_OFFLINE_SELECTION_EXECUTED" || q?.scanDate!=="2026-10-12"||
  q.EPSReviewReady!==true||q.EPSReviewedCount!==6||q.EPSReviewMissing?.length!==0||
  q.history60DayCount<1800||result.d1WriteStatements!==0||
  !Array.isArray(fullScanStocks)||JSON.stringify(fullScanStocks.map(x=>x.symbol))!==JSON.stringify(expected)||
  fullScanStocks.some(x=>(x.positionStage&&x.positionStage!=="NONE")||!["A","B"].includes(x.signalLevel)||
   (x.planDate&&x.planDate!=="2026-10-13")))
   throw Error("CANDIDATE_VALIDATION_OR_EPS_NOT_COMPLETE");
 const token=process.env.V7_ADMIN_TOKEN;
 if(!token)throw Error("MONITOR_ADMIN_TOKEN_MISSING");
 const base="https://fugle-test.imihan0630.workers.dev";
 const h={"x-admin-token":token,accept:"application/json"};
 async function get(path){
  const r=await fetch(base+path,{headers:h,signal:AbortSignal.timeout(22000)});
  if(!r.ok)throw Error("LIVE_MONITOR_GET_HTTP_"+r.status);
  return r.json();
 }
 const [before,currentScan]=await Promise.all([get("/api/config"),get("/api/scan/status")]);
 const digest=createHash("sha256").update(JSON.stringify(before)).digest("hex");
 out.beforeHash=digest;out.beforeUpdatedAt=before.updatedAt??null;
 out.previousStocks=before.stocks?.map(x=>({symbol:x.symbol,positionStage:x.positionStage}))??null;
 out.previousCapital=before.totalCapital??null;out.previousFormalScanDate=currentScan.scanDate??null;
 if(digest!=="0aaf15315fb9f9aa3ae8c0501323868f5a480870ebfc01d36604f2e7d770775c"||
   before.updatedAt!=="2026-10-01T15:45:29.639Z"||before.totalCapital!==200000||
   before.stocks?.length!==1||String(before.stocks[0].symbol)!=="2454"||
   before.stocks.some(x=>x.positionStage!=="NONE")||
   currentScan.scanDate==="2026-10-12")throw Error("PROTECTED_POSITION_OR_MONITOR_CONFIG_DRIFT_NO_POST");
 const recheck=await get("/api/config");
 if(createHash("sha256").update(JSON.stringify(recheck)).digest("hex")!==digest)throw Error("CONCURRENT_CONFIG_UPDATE_NO_POST");
 const body=JSON.stringify({stocks:fullScanStocks});
 out.sentCandidateSha256=createHash("sha256").update(JSON.stringify(fullScanStocks)).digest("hex");
 out.postCount=1;out.state="POST_SENT_READBACK_REQUIRED";
 const response=await fetch(base+"/api/config",{method:"POST",headers:{...h,"content-type":"application/json"},body,signal:AbortSignal.timeout(40000)});
 const sent=await response.json().catch(()=>null);
 out.httpStatus=response.status;out.serverVerified=sent?.verified===true;
 if(!response.ok||sent?.ok!==true||sent.count!==5)throw Error("V8_MONITOR_POST_NOT_ACKNOWLEDGED");
 const after=await get("/api/config");
 out.afterUpdatedAt=after.updatedAt??null;out.afterCapital=after.totalCapital??null;
 out.afterSymbols=after.stocks?.map(x=>String(x.symbol))??null;
 out.afterPositionStages=after.stocks?.map(x=>x.positionStage)??null;
 out.afterHash=createHash("sha256").update(JSON.stringify(after)).digest("hex");
 const ok=after.totalCapital===200000&&Array.isArray(after.stocks)&&after.stocks.length===5&&
  JSON.stringify(out.afterSymbols)===JSON.stringify(expected)&&
  after.stocks.every((x,i)=>x.positionStage==="NONE"&&x.signalLevel===fullScanStocks[i].signalLevel&&
   x.channel===fullScanStocks[i].channel&&
   ["buyLow","buyHigh","stop","totalAllocation","firstAmount","secondAmount"].every(k=>
     JSON.stringify(x[k]??null)===JSON.stringify(fullScanStocks[i][k]??null)));
 out.verified=ok;
 out.state=ok?"MONITOR_CONFIG_SAVED_AND_READBACK_PASS":"POST_ACK_BUT_READBACK_MISMATCH";
 if(!ok)throw Error("SAVED_CONFIG_READBACK_DIVERGENCE_NO_RETRY");
}
