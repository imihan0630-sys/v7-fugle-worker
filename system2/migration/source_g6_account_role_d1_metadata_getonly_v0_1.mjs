// SOURCE G6 account-role metadata diagnostic, GET /d1/database only.
// NEVER D1 SQL, Worker/Cron PUT/deploy, secrets, account IDs or raw database IDs
// in log/output. This classification alone cannot authorize source migration.
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
const out="/tmp/system2-source-g6-account-role-d1-readonly/receipt.json";
function deny(code){throw Error("SOURCE_G6_ACCOUNT_ROLE_GETONLY_"+code)}
export async function classifySourceD1AccountRoleV0_1({accountId,token,fetchImpl=globalThis.fetch,now=()=>new Date().toISOString()}={}){
 if(!/^[0-9a-f]{32}$/i.test(accountId||"")||typeof token!=="string"||!token)deny("CREDENTIALS_MISSING");
 const seen=new Set();let pageCount=0,total=null,done=false,sourceS2=0,system1=0;
 for(let page=1;page<=5;page++){
  pageCount=page;
  const url="https://api.cloudflare.com/client/v4/accounts/"+accountId+"/d1/database?per_page=100&page="+page;
  const r=await fetchImpl(url,{method:"GET",headers:{Authorization:"Bearer "+token,accept:"application/json"},signal:AbortSignal.timeout(13000)});
  if(!r?.ok)deny("METADATA_HTTP_"+(r?.status===403?"403":r?.status===401?"401":"OTHER"));
  const data=await r.json();
  if(data?.success!==true||!Array.isArray(data.result))deny("PROVIDER_RESULT_INVALID");
  if(data.result_info?.total_count!==undefined){
   const n=data.result_info.total_count;
   if(!Number.isSafeInteger(n)||n<0||total!==null&&n!==total)deny("PROVIDER_TOTAL_INVALID");
   total=n;
  }
  for(const d of data.result){
   if(typeof d?.name!=="string"||!d.name||typeof d?.uuid!=="string"||!d.uuid||
      seen.has(d.uuid))deny("PROVIDER_DATABASE_IDENTITY_INVALID");
   seen.add(d.uuid);
   if(d.name==="system2-research")sourceS2++;
   if(d.name==="v7-live")system1++;
  }
  if(total!==null&&seen.size===total){done=true;break;}
  if(total!==null&&seen.size>total)deny("PROVIDER_COUNT_OVERFLOW");
  if(data.result.length<100){
   if(total!==null&&seen.size!==total)deny("PROVIDER_COUNT_UNDERFLOW");
   done=true;break;
  }
 }
 if(!done)deny("PROVIDER_PAGINATION_LIMIT");
 const both=sourceS2===1&&system1===1;
 return Object.freeze({
  schemaVersion:"S2_SOURCE_G6_ACCOUNT_ROLE_D1_METADATA_GETONLY_V0_1",
  observedAtUtc:now(),
  accountFingerprintSha256:createHash("sha256").update(accountId.toLowerCase()).digest("hex"),
  cloudflareMetadataGetOnly:true,
  accountD1ListCompletelyRead:true,
  providerPagesRead:pageCount,visibleD1DatabaseCount:seen.size,
  expectedSourceS2D1PresentExactlyOnce:sourceS2===1,
  expectedSystem1V8D1PresentExactlyOnce:system1===1,
  accountRoleInference:both?"SOURCE_LIKE_D1_NAMES_METADATA_ONLY":"SOURCE_ROLE_UNVERIFIED_D1_NAMES",
  accountRoleIndependentlyAccepted:false,
  sourceSystem2WorkerIdentified:false,
  oldSourceCronCurrentConfigVerified:false,
  system1CronCurrentConfigVerified:false,
  noNewSourceScheduledEventsVerified:false,
  sourceD1RowsRead:0,d1SQLStatements:0,cloudMutations:0,
  nextGate:both?"RECONCILE_WORKER_TOKEN_SCOPE_AND_NATIVE_SOURCE_WORKER_IDENTITY":
   "OWNER_VALIDATE_EXISTING_SOURCE_CLOUDFLARE_ENV_ROLE_WITH_AUDIT"
 });
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
 try{
  const r=await classifySourceD1AccountRoleV0_1({
   accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
   token:process.env.SYSTEM2_CLOUDFLARE_API_TOKEN
  });
  await mkdir(resolve("/tmp/system2-source-g6-account-role-d1-readonly"),{recursive:true});
  await writeFile(out,JSON.stringify(r,null,2)+"\n",{flag:"wx",mode:0o600});
  console.log(JSON.stringify({status:r.accountRoleInference,visibleD1DatabaseCount:r.visibleD1DatabaseCount,
   system2D1:r.expectedSourceS2D1PresentExactlyOnce,system1D1:r.expectedSystem1V8D1PresentExactlyOnce,
   oldSourceCronCurrentConfigVerified:false,system1CronCurrentConfigVerified:false,
   d1SQLStatements:0,cloudMutations:0}));
 }catch{console.error("SOURCE_G6_ACCOUNT_ROLE_GETONLY_BLOCKED");process.exitCode=2;}
}
