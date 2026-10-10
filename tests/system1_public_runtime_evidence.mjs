import { mkdir, writeFile } from "node:fs/promises";

const origin="https://fugle-test.imihan0630.workers.dev";
const endpoints=[
  {name:"runtime",path:"/api/version"},
  {name:"storage",path:"/api/storage/status"},
  {name:"scan",path:"/api/scan/status"}
];
const result={
  schemaVersion:"SYSTEM1_PUBLIC_RUNTIME_READONLY_V0_1",
  observedAt:new Date().toISOString(),
  provenance:"LIVE_PUBLIC_GET_ONLY_GITHUB_ACTIONS",
  noCredentials:true,noPost:true,noPlanChanges:true,noPush:true,noTrade:true,
  endpoints:{}
};
for(const e of endpoints) {
  const record={httpStatus:null,reachable:false,errorClass:null};
  try {
    const resp=await fetch(origin+e.path,{method:"GET",headers:{accept:"application/json"},signal:AbortSignal.timeout(16000)});
    record.httpStatus=resp.status;
    record.reachable=true;
    if(resp.ok) {
      const body=await resp.json();
      if(e.name==="runtime") {
        record.version=typeof body?.version==="string" ? body.version : null;
        record.testMode=typeof body?.testMode==="boolean" ? body.testMode : null;
        record.kvConfigured=body?.bindings?.kv===true;
        record.d1Configured=body?.bindings?.d1===true;
        record.planStorageMode=body?.readiness?.planStorageMode??null;
      } else if(e.name==="storage") {
        record.mode=typeof body?.mode==="string" ? body.mode : null;
        record.d1Configured=body?.d1?.configured===true;
        record.latestArchived=body?.d1?.latestArchived===true;
        record.latestScanDate=typeof body?.d1?.scanDate==="string" ? body.d1.scanDate : null;
        record.encryptedMirrorVerified=body?.github?.verified===true;
        record.mirrorScanDate=typeof body?.github?.scanDate==="string" ? body.github.scanDate : null;
      } else if(e.name==="scan") {
        // Public response can be unauthorized; capture only coarse safe fields.
        // Neither HTTP 200 nor a latest snapshot is fresh Formal evidence.
        record.scanDate=typeof body?.scanDate==="string" ? body.scanDate : null;
        record.pipelineComplete=body?.pipeline?.complete===true;
        record.selectedCount=Number.isSafeInteger(body?.selectedCount) && body.selectedCount>=0
          ? body.selectedCount : null;
        record.c1GenerationVerified=false;
      }
    } else record.errorClass="HTTP_"+resp.status;
  } catch(error) {
    record.errorClass=error?.name==="TimeoutError" ? "TIMEOUT" : "NETWORK_OR_PARSE_ERROR";
  }
  result.endpoints[e.name]=record;
}
result.recoveryScan20261008Confirmed=result.endpoints.storage?.latestScanDate==="2026-10-08";
result.publicScanReadbackAuthorized=result.endpoints.scan?.httpStatus===200;
result.publicRuntimeInsufficientForFormalAcceptance=true;
result.operationalRecoveryPass=false; // Public GET cannot prove C1/C2 or full formal scan.
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/system1-public-runtime-readonly.json",JSON.stringify(result,null,2)+"\n");
console.log("SYSTEM1_PUBLIC_RUNTIME_READONLY="+JSON.stringify(result));
