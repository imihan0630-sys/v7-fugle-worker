// System2 G6 SOURCE-only Cloudflare Worker list identity differential evidence.
// GET-only; never prints worker names other than the two pre-registered expectations,
// account ID, tokens, raw provider payloads, routes or settings.
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
const path="/tmp/system2-source-g6-worker-identity-diagnosis/receipt.json";
const expectedSource="system2-shadow-research",expectedV8="fugle-test";
const fail=stage=>{throw Error("SOURCE_G6_WORKER_IDENTITY_DIAG_"+stage)};
function staticClock(s){return typeof s==="string"&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(s)&&new Date(s).toISOString()===s}
export async function inspectSourceWorkerIdentitiesV0_1({accountId,token,fetchImpl=globalThis.fetch,now=()=>new Date().toISOString()}={}){
 if(!/^[a-f0-9]{32}$/i.test(accountId||"")||typeof token!=="string"||!token)fail("SOURCE_ENV_CREDENTIALS_MISSING");
 if(typeof fetchImpl!=="function")fail("NO_FETCH");
 const observedAtUtc=now();
 if(!staticClock(observedAtUtc))fail("BAD_UTC");
 const scripts=[],seen=new Set();let pages=0,completed=false;
 let totalCount=null;
 for(let page=1;page<=5;page++){
  pages=page;
  const url="https://api.cloudflare.com/client/v4/accounts/"+accountId+"/workers/scripts?per_page=100&page="+page;
  const r=await fetchImpl(url,{method:"GET",headers:{authorization:"Bearer "+token,accept:"application/json"},signal:AbortSignal.timeout(13000)});
  if(!r?.ok)fail("NATIVE_GET_HTTP_"+(r?.status===403?"403":r?.status===401?"401":"OTHER"));
  const b=await r.json();
  if(b?.success!==true||!Array.isArray(b.result))fail("NATIVE_WORKER_LIST_INVALID");
  if(b.result_info?.total_count!==undefined){
   const n=b.result_info.total_count;
   if(!Number.isSafeInteger(n)||n<0)fail("NATIVE_TOTAL_INVALID");
   if(totalCount===null)totalCount=n;
   if(totalCount!==n)fail("NATIVE_TOTAL_CHANGED");
  }
  for(const item of b.result){
   if(typeof item?.id!=="string"||!item.id||seen.has(item.id))fail("DUPLICATE_OR_UNKNOWN_WORKER_ID");
   seen.add(item.id);scripts.push(item.id);
  }
  if(totalCount!==null&&scripts.length===totalCount){completed=true;break;}
  if(totalCount!==null&&scripts.length>totalCount)fail("NATIVE_WORKER_TOTAL_OVERFLOW");
  if(b.result.length<100){if(totalCount!==null&&scripts.length!==totalCount)fail("NATIVE_WORKER_TOTAL_UNDERFLOW");completed=true;break;}
 }
 if(!completed)fail("WORKER_LIST_OVER_FIVE_PAGES");
 const sourceCount=scripts.filter(x=>x===expectedSource).length,v8Count=scripts.filter(x=>x===expectedV8).length;
 const matched=sourceCount===1&&v8Count===1;
 return Object.freeze({
  schemaVersion:"S2_G6_SOURCE_WORKER_IDENTITY_GETONLY_DIAG_V0_1",
  observedAtUtc,
  accountFingerprintSha256:createHash("sha256").update(accountId.toLowerCase()).digest("hex"),
  originalCloudflareWorkerListCompleted:true,
  providerReadOnlyMethod:"GET",
  pagesRead:pages,totalWorkersObserved:scripts.length,
  onlyExpectedWorkerPresenceReported:true,
  sourceExpectedWorkerPresent:sourceCount===1,
  system1ExpectedWorkerPresent:v8Count===1,
  state:matched?"TWO_SOURCE_WORKERS_LISTED_BUT_CRON_NOT_PROVEN":"SOURCE_WORKER_IDENTITY_LIST_MISMATCH",
  noWorkerScheduleReadByThisModule:true,
  sourceCronConfigurationVerified:false,
  system1CronConfigurationVerified:false,
  sourceNoNewScheduledEventsVerified:false,
  cloudMutations:0,d1SqlStatements:0,workerDeployments:0,
  independentAuditCompleted:false,
  nextGate:matched?"VERIFY_NEXT_G6_READONLY_ORIGINAL_LOGS":
   "RECONCILE_ACCOUNT_ROLE_AND_PROVIDER_LIST_SCOPE_WITH_AUDIT"
 });
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
 try{
  const r=await inspectSourceWorkerIdentitiesV0_1({
   accountId:process.env.CLOUDFLARE_ACCOUNT_ID,token:process.env.CLOUDFLARE_API_TOKEN
  });
  await mkdir(resolve("/tmp/system2-source-g6-worker-identity-diagnosis"),{recursive:true});
  await writeFile(path,JSON.stringify(r,null,2)+"\n",{flag:"wx",mode:0o600});
  console.log(JSON.stringify({state:r.state,originalCloudflareWorkerListCompleted:r.originalCloudflareWorkerListCompleted,
   pagesRead:r.pagesRead,totalWorkersObserved:r.totalWorkersObserved,
   sourceExpectedWorkerPresent:r.sourceExpectedWorkerPresent,system1ExpectedWorkerPresent:r.system1ExpectedWorkerPresent,
   sourceCronConfigurationVerified:false,cloudMutations:0}));
 }catch{
  // Intentionally do not expose raw exception or native Cloudflare response.
  console.error("SOURCE_G6_WORKER_IDENTITY_DIAG_FAIL_CLOSED");
  process.exitCode=2;
 }
}
