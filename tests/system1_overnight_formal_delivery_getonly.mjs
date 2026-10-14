// Existing 23:55 Taipei GitHub health Cron may start after midnight.
// This check NEVER calls Worker POST endpoints and NEVER creates a plan/push.
import {mkdir,writeFile} from "node:fs/promises";
import {resolveScheduledPostcloseTarget,classifyPostcloseBusinessChain} from "../research/system1_overnight_formal_delivery_readonly_v0_1.mjs";
const when=resolveScheduledPostcloseTarget(new Date());
const base=String(process.env.V7_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
const token=String(process.env.V7_ADMIN_TOKEN||"");
const output=String(process.env.S1_POSTCLOSE_READONLY_OUTPUT||"artifacts/system1-overnight-formal-delivery-getonly.json");
let verdict={schema:"S1_P0_OVERNIGHT_FORMAL_DELIVERY_GET_ONLY_V0_1",
  ...when,ok:false,readOnly:true,noBusinessPOST:true,noD1Write:true,
  noKVWrite:true,noPlanChanges:true,no3MinWrite:true,noPush:true,noTrade:true};
const safeWrite=async()=>{
  await mkdir("artifacts",{recursive:true});
  await writeFile(output,JSON.stringify({...verdict,observedAt:new Date().toISOString()},null,2)+"\n");
  console.log("SYSTEM1_OVERNIGHT_FORMAL_DELIVERY_GET_ONLY="+JSON.stringify(verdict));
  if(!verdict.ok)process.exitCode=2;
};
if(!when.targetDate){
  verdict.category="POSTCLOSE_DATE_UNRESOLVED_FAIL_CLOSED";
  await safeWrite();
}else if(!token){
  verdict.category="READONLY_AUTH_MISSING";
  await safeWrite();
}else{
  const resources={
    scanStatus:"/api/scan/status",
    institution:"/api/institution-status?marketDate="+encodeURIComponent(when.targetDate),
    quality:"/api/quality-status?marketDate="+encodeURIComponent(when.targetDate),
    outbox:"/api/push-outbox?limit=50"
  };
  const values={},readErrors={};
  await Promise.all(Object.entries(resources).map(async ([key,path])=>{
    try {
      // Exact routes are literal GET-only receipts; NEVER use request POST,
      // /api/three-min/verify or /api/acceptance/reconcile here.
      const response=await fetch(base+path,{method:"GET",
        headers:{"x-admin-token":token,accept:"application/json","cache-control":"no-cache"},
        signal:AbortSignal.timeout(25000)});
      if(!response.ok){readErrors[key]="HTTP_"+response.status;return;}
      const body=await response.json();
      if(!body||typeof body!=="object"||Array.isArray(body)){readErrors[key]="INVALID_OBJECT";return;}
      values[key]=body;
    }catch{readErrors[key]="TRANSPORT_OR_PARSE_FAILURE";}
  }));
  verdict={...verdict,...classifyPostcloseBusinessChain({targetDate:when.targetDate,
    scanStatus:values.scanStatus,institution:values.institution,
    quality:values.quality,outbox:values.outbox,readErrors}),
    clockState:when.status,localClock:when.localTime};
  await safeWrite();
}
