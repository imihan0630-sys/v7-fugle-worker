import assert from "node:assert/strict";
import {mkdir,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";

const ORIGIN="https://fugle-test.imihan0630.workers.dev";
const MARKET_DATE="2026-10-08";
const ENDPOINTS=[
 {name:"scan",path:"/api/scan/status"},
 {name:"market",path:"/api/market-data/status?marketDate="+MARKET_DATE},
 {name:"institution",path:"/api/institution-status?marketDate="+MARKET_DATE},
 {name:"quality",path:"/api/quality-status?marketDate="+MARKET_DATE}
];
export const safeNumber=x=>Number.isFinite(Number(x))&&x!==null&&x!==""?Number(x):null;
export function safeDateTokens(items){
 if(!Array.isArray(items))return [];
 return items.flatMap(value=>{
  if(typeof value!=="string")return [];
  const found=value.match(/20[0-9]{2}[-/][0-9]{2}[-/][0-9]{2}|20[0-9]{6}/);
  if(!found)return [];
  let date=found[0].replaceAll("/","-");
  if(date.length===8)date=date.slice(0,4)+"-"+date.slice(4,6)+"-"+date.slice(6);
  return [date];
 }).slice(0,5);
}

export function assessInstitutionPhysicalSnapshot(raw,targetDate) {
 if(raw?.marketDate!==targetDate||raw?.ready!==true||
   !Array.isArray(raw.validDates)||!Array.isArray(raw.missingDates)||
   !Array.isArray(raw.snapshotCounts))return false;
 const valid=raw.validDates,missing=raw.missingDates;
 if(missing.length!==0||valid.length!==3||new Set(valid).size!==3||
   !valid.includes(targetDate))return false;
 const currentMs=Date.parse(targetDate+"T00:00:00Z");
 if(!Number.isFinite(currentMs))return false;
 return valid.every(date=>{
   if(typeof date!=="string"||!/^20[0-9]{2}-[0-9]{2}-[0-9]{2}$/.test(date))return false;
   const dayMs=Date.parse(date+"T00:00:00Z");
   if(!Number.isFinite(dayMs)||new Date(dayMs).toISOString().slice(0,10)!==date||
     dayMs>currentMs||currentMs-dayMs>14*86400000)return false;
   const rows=raw.snapshotCounts.filter(entry=>entry?.date===date);
   return rows.length===1&&rows[0].complete===true&&
     Number.isInteger(rows[0].stockCount)&&rows[0].stockCount>=1500;
 });
}

export function assessReadiness(endpoints,marketDate=MARKET_DATE){
 const reasons=[];
 const s=endpoints?.scan||{},m=endpoints?.market||{},
  i=endpoints?.institution||{},q=endpoints?.quality||{};
 const formalScanDatePresent=s.httpStatus===200&&s.scanDate===marketDate;
 if(!formalScanDatePresent)
   reasons.push("FORMAL_SCAN_DATE_NOT_CONFIRMED");
 else if(s.pipelineComplete!==true)
   reasons.push("FORMAL_SCAN_PIPELINE_INCOMPLETE");
 if(m.httpStatus!==200||m.marketDate!==marketDate||m.ready!==true||
   m.twseReady!==true||m.tpexReady!==true)
   reasons.push("OFFICIAL_MARKET_READBACK_INCOMPLETE");
 if(i.httpStatus!==200||i.marketDate!==marketDate||i.ready!==true||
   i.physicalSnapshotsVerified!==true)
   reasons.push("THREE_TRADING_DAY_INSTITUTION_READBACK_INCOMPLETE");
 const datasets=["FINANCIAL","VALUATION","ANNOUNCEMENTS","QUARTER_EPS"];
 if(q.httpStatus!==200||q.marketDate!==marketDate||q.indexReady!==true||
   q.tdccReady!==true||datasets.some(k=>q.datasets?.[k]!==true))
   reasons.push("OFFICIAL_QUALITY_READBACK_INCOMPLETE");
 return {allInputReadbacksReady:!reasons.some(x=>!x.startsWith("FORMAL_SCAN_")),
  formalScanPresent:formalScanDatePresent,
  formalScanComplete:formalScanDatePresent&&s.pipelineComplete===true,
  operationalRecoveryPass:false, // Cannot promote retrospective scan to prospective C1/C2.
  blockers:reasons};
}
export function summarize(name,raw,status){
 const obj={httpStatus:status,accepted:status===200};
 if(status!==200||!raw||typeof raw!=="object")return obj;
 if(name==="scan"){
  obj.scanDate=typeof raw.scanDate==="string"?raw.scanDate:null;
  obj.selectedCount=safeNumber(raw.selectedCount);
  obj.generationId=typeof raw.generationId==="string"?raw.generationId:null;
  obj.pipelineComplete=raw.pipeline?.complete===true;
  obj.externalPlanVerified=raw.pipeline?.externalPlanVerified===true;
  obj.githubMirrorVerified=raw.planBridge?.github?.verified===true;
 } else if(name==="market"){
  obj.marketDate=typeof raw.marketDate==="string"?raw.marketDate:null;
  obj.ready=raw.ready===true;
  obj.twseReady=raw.markets?.TWSE?.ready===true;
  obj.tpexReady=raw.markets?.TPEx?.ready===true;
  obj.twseCount=safeNumber(raw.markets?.TWSE?.count);
  obj.tpexCount=safeNumber(raw.markets?.TPEx?.count);
 } else if(name==="institution"){
  obj.marketDate=typeof raw.marketDate==="string"?raw.marketDate:null;
  obj.ready=raw.ready===true;
  obj.physicalSnapshotsVerified=assessInstitutionPhysicalSnapshot(raw,obj.marketDate);
  // Only export date tokens; never pass unfiltered Worker strings into evidence.
  obj.validTradingDates=safeDateTokens(raw.validDates);
  obj.validTradingDateCount=Array.isArray(raw.validDates)?raw.validDates.length:null;
  obj.validDateEntryKinds=Array.isArray(raw.validDates)?
    [...new Set(raw.validDates.map(v=>Array.isArray(v)?"array":typeof v))].slice(0,3):[];
  obj.validDateStringLengths=Array.isArray(raw.validDates)?
    raw.validDates.filter(x=>typeof x==="string").map(x=>x.length).slice(0,3):[];
  obj.missingTradingDates=safeDateTokens(raw.missingDates);
  obj.missingTradingDateCount=Array.isArray(raw.missingDates)?raw.missingDates.length:null;
  const valid=new Set(obj.validTradingDates);
  obj.physicalSnapshots=Array.isArray(raw.snapshotCounts)?
    raw.snapshotCounts.filter(item=>valid.has(item?.date)).map(item=>({
      date:String(item.date),complete:item.complete===true,
      stockCount:Number.isInteger(item.stockCount)?item.stockCount:null
    })).slice(0,3):[];
 } else if(name==="quality"){
  obj.marketDate=typeof raw.marketDate==="string"?raw.marketDate:null;
  obj.indexReady=raw.index?.ready===true;
  obj.tdccReady=raw.tdcc?.ready===true;
  obj.datasets={};
  for(const k of ["FINANCIAL","VALUATION","ANNOUNCEMENTS","QUARTER_EPS"])
   obj.datasets[k]=raw.datasets?.[k]?.ready===true;
 }
 return obj;
}
async function getWorker(name,path,token){
 const obj={httpStatus:null,accepted:false};
 if(!token)return {...obj,errorClass:"ADMIN_TOKEN_NOT_CONFIGURED"};
 try {
  const rsp=await fetch(ORIGIN+path,{method:"GET",
   headers:{"x-admin-token":token,accept:"application/json"},
   signal:AbortSignal.timeout(18000)});
  if(rsp.status===401||rsp.status===403)return {...obj,httpStatus:rsp.status,errorClass:"AUTH_REJECTED"};
  if(!rsp.ok)return {...obj,httpStatus:rsp.status,errorClass:rsp.status>=500?"SERVER_ERROR":"HTTP_REJECTED"};
  const body=await rsp.json();
  return summarize(name,body,rsp.status);
 }catch(error){return {...obj,errorClass:error?.name==="TimeoutError"?"TIMEOUT":"FETCH_OR_JSON_ERROR"};}
}
async function dailyD1(accountId,token){
 const metric={status:"UNKNOWN",utcDate:new Date().toISOString().slice(0,10),
   analyticsSampled:true,realTimeRemainingNotProven:true,
   accountRowsRead:null,accountRowsWritten:null,freeRowsReadLimit:5000000,
   freeRowsWrittenLimit:100000};
 if(!accountId||!token){metric.reason="CLOUDFLARE_ANALYTICS_AUTH_NOT_CONFIGURED";return metric;}
 const gql=`query D1Today($accountTag: string!, $d: Date) {
 viewer { accounts(filter: {accountTag: $accountTag}) {
  d1AnalyticsAdaptiveGroups(limit:10000,filter:{date_geq:$d,date_leq:$d}) {
   sum {rowsRead rowsWritten} dimensions {date databaseId}
  }
 } }
}`;
 try{
  const response=await fetch("https://api.cloudflare.com/client/v4/graphql",{
    method:"POST",headers:{authorization:"Bearer "+token,"content-type":"application/json"},
    body:JSON.stringify({query:gql,variables:{accountTag:accountId,d:metric.utcDate}}),
    signal:AbortSignal.timeout(20000)});
  if(!response.ok){metric.reason="GRAPHQL_HTTP_"+response.status;return metric;}
  const body=await response.json();
  if(body.errors?.length){metric.reason="GRAPHQL_QUERY_REJECTED";return metric;}
  const groups=body?.data?.viewer?.accounts?.[0]?.d1AnalyticsAdaptiveGroups;
  if(!Array.isArray(groups)||groups.length===0){
   metric.reason="NO_CURRENT_DAY_ANALYTICS_GROUPS";return metric;
  }
  metric.status="SAMPLED_USAGE_OBSERVED";
  metric.databaseGroupCount=groups.length;
  metric.accountRowsRead=groups.reduce((a,g)=>a+Number(g?.sum?.rowsRead||0),0);
  metric.accountRowsWritten=groups.reduce((a,g)=>a+Number(g?.sum?.rowsWritten||0),0);
  metric.sampledAboveFreeReadLimit=metric.accountRowsRead>=metric.freeRowsReadLimit;
  metric.sampledAboveFreeWriteLimit=metric.accountRowsWritten>=metric.freeRowsWrittenLimit;
  metric.neverAuthorizeMutationsFromThisMetric=true;
  return metric;
 }catch(error){metric.reason=error?.name==="TimeoutError"?"GRAPHQL_TIMEOUT":"GRAPHQL_NETWORK_OR_PARSE_ERROR";return metric;}
}
async function main(){
 const report={
  schema:"SYSTEM1_AUTHENTICATED_READONLY_GATES_V0_1",
  generatedAt:new Date().toISOString(),targetMarketDate:MARKET_DATE,
  provenSource:"GITHUB_ACTIONS_AUTHENTICATED_GET_AND_ACCOUNT_ANALYTICS",
  noBusinessMutation:true,noWorkerPost:true,noTrade:true,noPush:true,noSelection:true,
  noTokenOrRawBodyInEvidence:true,
  endpoints:{}
 };
 const t=String(process.env.V7_ADMIN_TOKEN||"").trim();
 for(const e of ENDPOINTS)report.endpoints[e.name]=await getWorker(e.name,e.path,t);
 report.readiness=assessReadiness(report.endpoints);
 report.d1Today=await dailyD1(
  String(process.env.CLOUDFLARE_ACCOUNT_ID||"").trim(),
  String(process.env.CLOUDFLARE_API_TOKEN||"").trim());
 if(report.d1Today.status==="UNKNOWN")
  report.readiness.blockers.push("ACCOUNT_D1_HEADROOM_UNVERIFIED");
 report.promotionAuthorized=false;
 await mkdir("artifacts",{recursive:true});
 await writeFile("artifacts/system1-authenticated-readonly-gates.json",JSON.stringify(report,null,2)+"\n");
 console.log("SYSTEM1_AUTHENTICATED_READONLY_GATES="+JSON.stringify(report));
 if(!t)process.exitCode=2;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))
 main().catch(error=>{
   console.error("SYSTEM1_READONLY_PROBE_INTERNAL_ERROR:"+String(error?.name||"UNKNOWN"));
   process.exitCode=2;
 });
