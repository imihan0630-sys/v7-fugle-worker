// Exact one-date original System1 production diagnostics, AUTHENTICATED GET ONLY.
// DO NOT call /api/scan (POST), update official source, KV, D1, trade or push.
// This never determines zero picks from empty default NOT_SCANNED recommendations.
import {mkdir,writeFile} from "node:fs/promises";
const BASE="https://fugle-test.imihan0630.workers.dev";
const DAY="2026-10-16";
const MAX=125000;
const PATHS={
 version:"/api/version",
 recommendations:"/api/recommendations",
 scan:"/api/scan/status",
 cron:"/api/cron/status",
 quality:"/api/quality-status?marketDate="+DAY,
 config:"/api/config"
};
const safeTime=s=>typeof s==="string"&&s.length<80?s:null;
const safeType=s=>typeof s==="string"&&s.length<80?s:null;
const sameDay=(s)=>safeTime(s)?.slice(0,10)===DAY;
export function classifyOriginalFormalReadback(values,errors){
 const scan=values.scan||{},rec=values.recommendations||{},config=values.config||{};
 const valid=scan.scanDate===DAY&&scan.dryRun===false&&scan.config?.verified===true&&
   Number.isInteger(scan.selectedCount)&&scan.selectedCount>=0&&scan.selectedCount<=6&&
   Array.isArray(scan.stocks)&&scan.stocks.length===scan.selectedCount&&
   scan.incomplete!==true&&scan.pipeline?.selectionCompleted===true;
 const matched=valid&&config.source==="KV"&&
  config.updatedAt===scan.config?.updatedAt&&Array.isArray(config.stocks)&&
  config.stocks.length===scan.selectedCount&&
  scan.stocks.every((s,i)=>/^[1-9]\d{3}$/.test(String(s?.symbol||""))&&
    config.stocks.some(t=>t.symbol===s.symbol));
 const authorizedPrivateReads=["scan","cron","config","quality"]
  .every(k=>!errors[k]);
 const current=rec?.attempt?.requestedDate===DAY?rec.attempt.status:null;
 const cronRows=Array.isArray(values.cron?.recent)?values.cron.recent:[];
 const oct16=cronRows.filter(x=>String(x?.scheduled_at||x?.scheduledAt||"").slice(0,10)===DAY&&x.job_type==="AFTER_MARKET_SCAN");
 let status;
 if(!authorizedPrivateReads)status="SOURCE_OR_AUTH_READ_INCOMPLETE";
 else if(matched)status="FORMAL_DATE_KV_READBACK_VERIFIED_BUT_PUSH_SEPARATE";
 else if(current==="INCOMPLETE"||scan?.incomplete===true)status="FORMAL_UNSAVED_OR_INCOMPLETE";
 else if(!sameDay(scan?.scanDate))status="NO_CURRENT_SESSION_FORMAL_PARENT_VISIBLE";
 else status="FORMAL_READBACK_DISAGREEMENT_OR_UNVERIFIED";
 return {schema:"S1_20261016_ORIGINAL_FORMAL_READBACK_ONLY_V0_1",
  date:DAY,classification:status,verifiedSameDayFormal:matched,
  verifiedZeroSelection:matched&&scan.selectedCount===0,
  verifiableSelectedCount:matched?scan.selectedCount:null,
  sourceVersion:safeType(values.version?.version),
  testMode:values.version?.testMode===false?false:values.version?.testMode===true?true:null,
  publicRecommendationAttempt:safeType(current),
  publicRecommendationIsCurrent:rec.isCurrent===true,
  scanDate:safeTime(scan.scanDate),scanIncomplete:scan.incomplete===true,
  pipelineCompleted:scan.pipeline?.selectionCompleted===true,
  pipelineComplete:scan.pipeline?.complete===true,
  configReadbackMatched:matched,
  qualityDate:safeTime(values.quality?.marketDate),
  qualityStatus:safeType(values.quality?.status)||null,
  cronRowsForDate:oct16.slice(0,4).map(x=>({
   scheduledAt:safeTime(x.scheduled_at||x.scheduledAt),
   status:safeType(x.status),
   skipped:x.skipped===true||Number(x.skipped)===1,
   detailCode:/^[A-Z0-9_]{2,72}$/.test(String(x.detail||""))?x.detail:null,
   detailFieldPresent:Object.prototype.hasOwnProperty.call(x,"detail"),
   errorClass:/exceededResources|CPU/i.test(String(x.error||""))?"CPU_OR_RESOURCE":
    /DATA_INCOMPLETE/i.test(String(x.error||""))?"DATA_INCOMPLETE":
    x.error?"OTHER_OR_UNKNOWN":"NONE"
  })),
  cronRecentTruncated:cronRows.length>=20,
  cronMissingDoesNotProveNoInvocation:true,
  httpErrors:Object.fromEntries(Object.entries(errors).map(([k,v])=>[k,safeType(v)])),
  readOnly:true,noWorkerBusinessPost:true,noWrites:true,noTrade:true,noPush:true,
  canAutomaticallyReplayOrSelect:false};
}
async function fetchOriginal(path,token,request=fetch){
 const url=new URL(path,BASE);
 if(url.origin!==BASE||!Object.values(PATHS).includes(path))throw Error("PATH_NOT_ALLOWLISTED");
 const headers={accept:"application/json","cache-control":"no-cache"};
 if(token)headers["x-admin-token"]=token;
 const r=await request(url,{method:"GET",headers,signal:AbortSignal.timeout(12000)});
 if(!r.ok)throw Error([401,403].includes(r.status)?"AUTHORIZATION_BLOCKED":"HTTP_"+r.status);
 const raw=await r.text();
 if(raw.length>MAX)throw Error("BODY_TOO_LARGE");
 try{return JSON.parse(raw)}catch{throw Error("BAD_JSON")}
}
async function main(){
 const token=process.env.V7_ADMIN_TOKEN||"";
 const values={},errors={};
 if(!token)errors.authorization="NO_EXISTING_ADMIN_SECRET";
 for(const [k,p] of Object.entries(PATHS)){
  if(!token&&["scan","cron","quality","config"].includes(k)){
   errors[k]="AUTHORIZATION_BLOCKED";continue;
  }
  try{values[k]=await fetchOriginal(p,token)}
  catch(e){errors[k]=/AUTHORIZATION_BLOCKED/.test(String(e?.message||""))?
   "AUTHORIZATION_BLOCKED":/HTTP_[0-9]+/.test(String(e?.message||""))?
   "SOURCE_HTTP_ERROR":"TRANSPORT_OR_FORMAT_UNKNOWN";}
 }
 const result=classifyOriginalFormalReadback(values,errors);
 await mkdir("artifacts",{recursive:true});
 await writeFile("artifacts/system1-p0-20261016-original-getonly.json",
  JSON.stringify({...result,observedAt:new Date().toISOString()},null,2)+"\n");
 console.log("SYSTEM1_P0_ORIGINAL_GETONLY="+JSON.stringify(result));
}
if(process.argv[1]&&import.meta.url===new URL("file://"+process.argv[1]).href)
 await main();
