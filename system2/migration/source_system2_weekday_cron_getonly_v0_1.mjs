// System2 G6 SOURCE post-pause WEEKDAY Cloudflare GET-only original receipt.
// Reuses the existing owner-authorized sourceCronPauseV0_1(mode: INSPECT),
// whose Cloudflare requests are GET-only. Never touches destination or D1 SQL.
import {sourceCronPauseV0_1} from "./source_system2_cron_pause_owner_approved_v0_1.mjs";
import {mkdir,writeFile,readFile} from "node:fs/promises";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";

const firstCompletedWeekdayWindowUtc="2026-10-12T06:00:00.000Z";
const outputDir="/tmp/system2-source-g6-weekday-getonly";
const FAIL="SOURCE_G6_WEEKDAY_READONLY_";
const strictUtc=s=>typeof s==="string"&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(s)&&
 !Number.isNaN(Date.parse(s))&&new Date(s).toISOString()===s;
function fail(code){throw Error(FAIL+code);}
export function safeG6FailureCodeV0_1(error){
 const msg=String(error?.message||"");
 return /^SOURCE_(?:G6_WEEKDAY_READONLY_|S2_CRON_PAUSE_FAIL_CLOSED_)[A-Z0-9_]+$/.test(msg)?
  msg:FAIL+"UNCLASSIFIED_FAIL_CLOSED";
}
export function assessG6WeekdayCronReceiptV0_1(receipt,{observedAtUtc,deployQuarantined}={}){
 if(!strictUtc(observedAtUtc))fail("OBSERVATION_UTC_INVALID");
 if(!receipt||receipt.state!=="SOURCE_S2_CRON_ALREADY_EMPTY_READONLY_NOT_ORIGINAL_PAUSE_PROOF"||
    receipt.cloudMutationsRequested!==0||receipt.pausedConfirmed!==true||
    receipt.system1Mutated!==false||receipt.sourceD1Mutated!==false||
    receipt.sourceR2Mutated!==false||receipt.destinationWorkerActivated!==false||
    receipt.destinationCronActivated!==false||receipt.sourceWorker!=="system2-shadow-research"||
    receipt.system1Worker!=="fugle-test"||receipt.nonTargetScheduleCount!==4||
    !Array.isArray(receipt.sourceCronBefore)||receipt.sourceCronBefore.length!==0||
    !Array.isArray(receipt.sourceCronAfter)||receipt.sourceCronAfter.length!==0)
   fail("SCOPED_SOURCE_V8_CRON_READBACK_NOT_MATCHED");
 if(deployQuarantined!==true)fail("SOURCE_REDEPLOY_QUARANTINE_NOT_VERIFIED");
 if(Date.parse(observedAtUtc)<Date.parse(firstCompletedWeekdayWindowUtc))
   fail("NO_COMPLETED_WEEKDAY_CRON_WINDOW_YET");
 if(!strictUtc(receipt.observedAtUtc)||Math.abs(Date.parse(receipt.observedAtUtc)-Date.parse(observedAtUtc))>5*60*1000)
   fail("SOURCE_RECEIPT_CLOCK_NOT_FRESH");
 return Object.freeze({
   schemaVersion:"S2_SOURCE_G6_WEEKDAY_CRON_ORIGINAL_READONLY_RECEIPT_V0_1",
   observedAtUtc, sourceWorker:"system2-shadow-research",system1Worker:"fugle-test",
   sourceCronConfigCount:0, system1CronConfigCount:4,
   sourceCronConfigZeroObservedAfterCompletedWeekdayWindow:true,
   sourceCronPauseOriginalActorProvenByThisReadback:false,
   sourceCronNoScheduledEventsObserved:false,
   sourceScheduledEventTypeTelemetricEvidenceAvailable:false,
   inFlightEventClosureVerified:false,
   system1FourCronExpressionsExactHistoricalParityVerified:false,
   system1BusinessSignalsParityVerified:false,
   dataWritersQuiescentVerified:false,
   cloudflareRequestsByUnderlyingMode:"GET_ONLY_SOURCE_INSPECT",
   providerOriginalReceiptRequiresIndependentAudit:true,
   cloudMutations:0,d1SQL:0,workerDeployments:0,
   destinationWorkerDeploymentVerified:false,
   destinationCronDeploymentVerified:false,
   independentlyAccepted:false,
   nextGate:"AUDIT_ORIGINAL_RUN_JOB_ARTIFACT_AND_EVENT_TYPE_SPECIFIC_WEEKDAY_TELEMETRY"
 });
}
export async function executeG6WeekdayCronReadonlyV0_1({
 accountId,token,now=()=>new Date().toISOString(),
 sourceInspect=sourceCronPauseV0_1,readGuard=async()=>{
  const base=resolve(fileURLToPath(new URL("../../",import.meta.url)));
  const q=JSON.parse(await readFile(resolve(base,"system2/config/source_account_d1_writer_quarantine_v0_1.json"),"utf8"));
  const y=await readFile(resolve(base,".github/workflows/system2-resonance-deploy.yml"),"utf8");
  return q?.active===true&&q?.automaticRelease===false&&
    /deploy:\s*\n(?:[^\n]*\n){0,8}\s*if:\s*\$\{\{\s*false\s*\}\}/.test(y);
 }
}={}){
 if(!/^[a-f0-9]{32}$/i.test(accountId||"")||typeof token!=="string"||!token)
   fail("EXISTING_SOURCE_ENV_CREDENTIALS_MISSING");
 const guard=await readGuard();
 // Fail before all Cloudflare GET if old deploy quarantine is unknown or inactive.
 if(guard!==true)fail("SOURCE_REDEPLOY_QUARANTINE_NOT_VERIFIED");
 const before=now();
 if(!strictUtc(before)||Date.parse(before)<Date.parse(firstCompletedWeekdayWindowUtc))
   fail("NO_COMPLETED_WEEKDAY_CRON_WINDOW_YET");
 const receipt=await sourceInspect({accountId,token,workersToken:token,mode:"INSPECT"});
 const after=now();
 if(Date.parse(after)<Date.parse(before)||Date.parse(after)-Date.parse(before)>8*60000)
   fail("OBSERVATION_WINDOW_EXCEEDED");
 return assessG6WeekdayCronReceiptV0_1(receipt,{observedAtUtc:after,deployQuarantined:guard});
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
 try{
  const result=await executeG6WeekdayCronReadonlyV0_1({
   accountId:process.env.CLOUDFLARE_ACCOUNT_ID,token:process.env.SYSTEM2_CLOUDFLARE_API_TOKEN
  });
  await mkdir(outputDir,{recursive:true});
  await writeFile(resolve(outputDir,"receipt.json"),JSON.stringify(result,null,2)+"\n",{flag:"wx",mode:0o600});
  console.log(JSON.stringify({state:"ORIGINAL_SOURCE_GET_ONLY_WEEKDAY_CONFIG_READBACK",
   observedAtUtc:result.observedAtUtc,sourceCronConfigCount:0,system1CronConfigCount:4,
   independentlyAccepted:false,noScheduledEventsClaim:false,
   cloudMutations:0,d1SQL:0}));
 }catch(e){
  const msg=String(e?.message||"");
  // Underlying INSPECT errors are from a fixed, locally defined error-code
  // domain. They contain no provider JSON, token, account ID or D1 UUID.
  // Never print arbitrary exception text or native response bodies.
  const reason=safeG6FailureCodeV0_1(e);
  try {
   await mkdir(outputDir,{recursive:true});
   await writeFile(resolve(outputDir,"receipt.json"),JSON.stringify({
    schemaVersion:"S2_SOURCE_G6_WEEKDAY_CRON_READONLY_FAILURE_V0_1",
    state:"BLOCKED_READONLY_NO_CONFIG_PROOF",reason,
    observedAtUtc:new Date().toISOString(),
    originalProviderEvidenceAvailable:false,
    independentAuditCompleted:false,
    sourceCronZeroVerifiedByThisRun:false,
    system1CronCountVerifiedByThisRun:false,
    noScheduledEventsVerified:false,
    destinationDeploymentVerified:false,
    cloudMutations:0,d1SQL:0
   },null,2)+"\n",{flag:"wx",mode:0o600});
  }catch{ /* deny rather than emit sensitive provider detail */ }
  console.error(reason);
  process.exitCode=2;
 }
}
