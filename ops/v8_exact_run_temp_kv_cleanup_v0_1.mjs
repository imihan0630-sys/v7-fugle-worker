// Remove ONLY the temporary read-only KV Worker created by THIS GitHub run.
// This job is independent of candidate computation and runs even when it fails.
// Never list, redeploy or change fugle-test, routes, schedules, D1, KV, plan or trade.
import {mkdir,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
export function validateEphemeralCleanupIdentity({accountId,runId}){
 const account=String(accountId||"").trim(),run=String(runId||"").trim();
 if(!/^[0-9a-f]{32}$/i.test(account))throw Error("SOURCE_ACCOUNT_ID_INVALID");
 if(!/^[1-9][0-9]{5,16}$/.test(run))throw Error("EXACT_GITHUB_RUN_ID_INVALID");
 return Object.freeze({account,run,script:"v8-ro-kv-"+run});
}
async function provider(base,path,method,token,body){
 const response=await fetch(base+path,{method,headers:{authorization:"Bearer "+token,accept:"application/json",
  ...(body?{"content-type":"application/json"}:{})},...(body?{body:JSON.stringify(body)}:{}),
  signal:AbortSignal.timeout(28000)});
 const payload=await response.json().catch(()=>null);
 if(response.status===404)return {missing:true,status:404};
 if(!response.ok||payload?.success===false)throw Error("PROVIDER_"+method+"_HTTP_"+response.status);
 return {missing:false,status:response.status,success:true};
}
export async function cleanupEphemeralWorker({accountId,runId,token}){
 const identity=validateEphemeralCleanupIdentity({accountId,runId});
 if(!token)throw Error("SOURCE_ACCOUNT_TOKEN_REQUIRED");
 const base="https://api.cloudflare.com/client/v4/accounts/"+identity.account;
 const path="/workers/scripts/"+identity.script;
 const out={schema:"V8_EXACT_RUN_TEMP_KV_CLEANUP_V0_1",observedAt:new Date().toISOString(),
   runId:identity.run,ephemeralScript:identity.script,scope:"ONLY_THIS_GITHUB_RUN_TEMP_WORKER",
   originalFormalWorkerUntouched:true,noD1OrKVValueWrite:true,noMonitoringPlanWrite:true,
   noTrade:true,no3Min:true,noPush:true,state:"UNKNOWN",verifiedAbsent:false};
 try{
   const before=await provider(base,path,"GET",token);
   if(before.missing)out.state="ALREADY_ABSENT";
   else{
     const disabled=await provider(base,path+"/subdomain","POST",token,{enabled:false});
     out.subdomainDisableAccepted=!disabled.missing;
     await provider(base,path,"DELETE",token);
     out.state="DELETE_SENT";
   }
   const after=await provider(base,path,"GET",token);
   if(!after.missing)throw Error("EXACT_TEMP_WORKER_STILL_PRESENT_AFTER_CLEANUP");
   out.verifiedAbsent=true;
   out.state=before.missing?"ALREADY_ABSENT_VERIFIED":"DELETED_AND_VERIFIED";
 }catch(e){out.state="CLEANUP_FAILED_REQUIRES_ATTENTION";out.error=String(e.message||e).slice(0,230);}
 return out;
}
async function main(){
 const result=await cleanupEphemeralWorker({accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
   runId:process.env.GITHUB_RUN_ID,token:process.env.CLOUDFLARE_API_TOKEN});
 await mkdir("artifacts",{recursive:true});
 await writeFile("artifacts/v8-temp-cleanup-"+result.runId+".json",JSON.stringify(result,null,2)+"\n");
 console.log("V8_EXACT_RUN_TEMP_WORKER_CLEANUP="+JSON.stringify(result));
 if(!result.verifiedAbsent)process.exitCode=2;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await main();
