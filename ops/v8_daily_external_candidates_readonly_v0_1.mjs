// Scheduled V8 exact original selector on GitHub Runner. External PIT provenance and
// formal C1/D1/3Min/trading acceptance remain separate; this produces candidate evidence only.
// Original stock rules unchanged. No production D1/KV/config writes and no phone push or orders.
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {createHash,randomBytes} from "node:crypto";
import {checkV8SelectionVintage} from "./v8_market_session_vintage_firewall_v0_1.mjs";
const id=process.env.CLOUDFLARE_ACCOUNT_ID||"";
const wt=process.env.CLOUDFLARE_API_TOKEN||"";
const dt=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||wt;
const localDay=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const dayBefore=new Date(Date.parse(localDay+"T00:00:00Z")-86400000).toISOString().slice(0,10);
const target=String(process.env.V8_TARGET_MARKET_DATE||dayBefore).trim();
if(!/^20\d{2}-\d{2}-\d{2}$/.test(target)||target>localDay||
   Date.parse(localDay+"T00:00:00Z")-Date.parse(target+"T00:00:00Z")>7*86400000)
  throw Error("V8_MARKET_DATE_NOT_IN_GUARDED_WINDOW");
const result={schema:"V8_DAILY_EXTERNAL_EXACT_SELECTOR_READONLY_V0_1",timestamp:new Date().toISOString(),
  targetDate:target,source:"UNMODIFIED_ORIGINAL_V8_WORKER_JS",noProductionWrite:true,noPush:true,noTrade:true,
  noPlanChanges:true,no3MinWrite:true,notFormalPlan:true,pitPublicationTimeVerified:false,
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
let diagName=null,diagUrl=null,diagToken=null,qualityOverlay=null;
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
   if(!/^(V7_MARKET_STATE|STOCK_CONFIG_V7|STOCK_CONFIG_V6|V7_TRADING_CALENDAR:${target.slice(0,4)}|V7_OFFICIAL_CLOSING:(TWSE|TPEx):${target}|V7_EXTERNAL_VALIDATION:${target})$/.test(key))return new Response("forbidden",{status:403});
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
 // Existing live MARKET_STATE may be newer than the requested replay date.
 // Refuse any replay with future-state leakage before doing full-market computation.
 const readMarketState=await kvGet("V7_MARKET_STATE","json");
 result.preflight.sourceVintageCheck=checkV8SelectionVintage({
   targetDate:target,sourceMarketLastDate:readMarketState?.lastDate??null
 });
 // First independently confirm the deployed source session is complete. Incomplete is NOT zero picks.
 const h={"x-admin-token":process.env.V7_ADMIN_TOKEN||"",accept:"application/json"};
 if(!process.env.V7_ADMIN_TOKEN)throw Error("V8_PRODUCTION_ADMIN_STATUS_AUTH_REQUIRED");
 const checks=[
   ["market","/api/market-data/status?marketDate="+target],
   ["institution","/api/institution-status?marketDate="+target],
   ["quality","/api/quality-status?marketDate="+target]
 ];
 const sourceStatus={};
 for(const [name,path] of checks){
   const response=await fetch("https://fugle-test.imihan0630.workers.dev"+path,{method:"GET",headers:h,signal:AbortSignal.timeout(23000)});
   if(!response.ok)throw Error("V8_OFFICIAL_"+name+"_STATUS_HTTP_"+response.status);
   const data=await response.json();
   if(data.marketDate!==target||(name!=="quality"&&data.ready!==true)||
      (name==="market"&&(!data.markets?.TWSE?.ready||!data.markets?.TPEx?.ready))||
      (name==="quality"&&(!data.index?.ready||!data.tdcc?.ready||
        !["FINANCIAL","VALUATION","ANNOUNCEMENTS","QUARTER_EPS"].every(k=>data.datasets?.[k]?.ready===true))))
     throw Error("V8_OFFICIAL_"+name+"_NOT_READY_NOT_ZERO_PICK");
   sourceStatus[name]={sourceMarketDate:data.marketDate,ready:true};
 }
 result.preflight.officialSourceStatuses=sourceStatus;
 result.preflight.sourceVintageCheck=checkV8SelectionVintage({
   targetDate:target,sourceMarketLastDate:readMarketState?.lastDate??null,
   knownOfficialDates:Object.values(sourceStatus).map(x=>x.sourceMarketDate)
 });
 const time=Date.parse(target+"T15:35:00Z");
 // Compute original selector once using same-date cached snapshots and original unmodified rules.
 let scan=await module.runAfterMarketScan(env,time,{dryRun:true});
 const review=scan?.diagnostics?.quarterEpsReview||{};
 const missing=Array.isArray(review.missingSymbols)?[...new Set(review.missingSymbols)]:[];
 result.preflight.firstPass={selectedCount:scan?.selectedCount??null,
   EPSReviewReady:review.ready===true,missingSymbols:missing,year:review.year,quarter:review.quarter};
 if(missing.length){
   if(missing.length>12||!Number.isInteger(review.year)||!Number.isInteger(review.quarter)||
      review.quarter<2||review.quarter>3||missing.some(x=>!/^\d{4}$/.test(x)))
     throw Error("DYNAMIC_MOPS_EPS_VERIFICATION_UNSUPPORTED_OR_UNBOUNDED");
   qualityOverlay=await verifiedOfficialQuarterEpsOverlay({parseAndValidate:module,marketDate:target,
      year:review.year,quarter:review.quarter,symbols:missing});
   scan=await module.runAfterMarketScan(env,time,{dryRun:true});
 }
 if(scan.diagnostics?.quarterEpsReview?.ready!==true||
    scan.diagnostics?.quarterEpsReview?.missingSymbols?.length!==0)
   throw Error("FINAL_QUARTER_EPS_NOT_VERIFIED");
 if(scan.selectedCount===0 && scan?.diagnostics?.historyCoverageComplete!==true)
   throw Error("PARTIAL_HISTORY_CANNOT_CLAIM_ZERO_STOCK_SELECTION");
 if(!Array.isArray(scan.stocks)||scan.stocks.length>6||scan.selectedCount!==scan.stocks.length||
    new Set(scan.stocks.map(x=>x.symbol)).size!==scan.stocks.length||
    scan.stocks.some(x=>!["A","B"].includes(x.signalLevel)||
       !/^[1-9][0-9]{3}$/.test(String(x.symbol))))
   throw Error("FINAL_V8_SELECTION_INTEGRITY_INVALID");
 result.preflight.qualityOverlayUsed=Boolean(qualityOverlay);
 if(!scan||scan.dryRun!==true||scan.scanDate!==target||!scan.pipeline?.selectionCompleted)
   throw Error("NODE_ORIGINAL_ENGINE_NOT_FULLY_COMPLETED");
 result.status=scan?.diagnostics?.historyCoverageComplete===true ?
   "VERIFIED_DAILY_V8_CANDIDATES_EPS_PASS" :
   "V8_CANDIDATES_EPS_PASS_HISTORY_INCOMPLETE_NOT_FORMAL";
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
 await writeFile("artifacts/v8-daily-external-candidates-"+target+".json",JSON.stringify(result,null,2)+"\n");
 console.log("V8_DAILY_CANDIDATE_CERTIFICATE="+JSON.stringify(result));
}
