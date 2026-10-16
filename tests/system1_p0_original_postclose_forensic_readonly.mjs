// Authorized GET-only incident evidence. This script is safe for GitHub Actions
// push on main: NO direct Cloudflare API mutations and no secret output.
import {mkdir,writeFile} from "node:fs/promises";
import {classifySystem1OriginalPostclose} from "../research/system1_p0_original_postclose_forensic_v0_1.mjs";
const date=process.env.S1_P0_TARGET_DATE||"2026-10-15";
const base=String(process.env.V7_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
const token=String(process.env.V7_ADMIN_TOKEN||"");
const urls={
  version:"/api/version",cron:"/api/cron/status",scan:"/api/scan/status",
  recommendations:"/api/recommendations",config:"/api/config",
  quality:"/api/quality-status?marketDate="+encodeURIComponent(date),
  outbox:"/api/push-outbox?limit=50",overview:"/api/system-overview"
};
const values={},errors={};
if(!token)errors.authorization="NO_ADMIN_TOKEN";
else await Promise.all(Object.entries(urls).map(async ([key,path])=>{
  try{
    const response=await fetch(base+path,{method:"GET",headers:{"x-admin-token":token,
      accept:"application/json","cache-control":"no-cache"},signal:AbortSignal.timeout(20000)});
    if(!response.ok){errors[key]="HTTP_"+response.status;return;}
    const value=await response.json();
    if(value===null||typeof value!=="object"||Array.isArray(value)){errors[key]="INVALID_JSON_OBJECT";return;}
    values[key]=value;
  }catch(_){errors[key]="TRANSPORT_OR_JSON_ERROR";}
}));
let verdict;
try{
  verdict=classifySystem1OriginalPostclose({date,observedAt:new Date().toISOString(),
    ...values,errors});
}catch(_){verdict={schema:"S1_P0_ORIGINAL_POSTCLOSE_GET_FORENSIC_V0_1",
  date,verdict:"INVALID_INCIDENT_TARGET_OR_CLASSIFIER",complete:false,readErrors:errors,
  diagnosticOnly:true,noBusinessPOST:true,noWorkerWrite:true,noD1Write:true,noKVWrite:true,noPush:true,noTrade:true};}
await mkdir("artifacts",{recursive:true});
const path="artifacts/system1-p0-original-postclose-forensic-"+date+".json";
await writeFile(path,JSON.stringify(verdict,null,2)+"\n");
console.log("SYSTEM1_P0_ORIGINAL_POSTCLOSE_FORENSIC="+JSON.stringify(verdict));
// Incident evidence must be emitted even if unfinished. CI success means only
// GET probe ran; never manufacture live system restoration.
if(Object.keys(errors).length||verdict.verdict==="INVALID_INCIDENT_TARGET_OR_CLASSIFIER")process.exitCode=2;
