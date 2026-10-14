// System 2 Safe Executor V0.1: GitHub runner-local read-only evidence only.
// NO Cloudflare, external AI/API, D1 SQL, Worker/Cron, secret, git writes, or PR auto-merge.
import {readFile,writeFile,mkdir} from "node:fs/promises";
import {spawn} from "node:child_process";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {join,resolve} from "node:path";
const ROOT=resolve(fileURLToPath(new URL("../../",import.meta.url)));
const FILES={
 source:".github/workflows/system2-resonance-deploy.yml",
 daily:".github/workflows/system2-daily-shadow-diagnostic.yml",
 raw:".github/workflows/system2-owner-override-raw-d1-copy-20261012.yml",
 warmup:".github/workflows/system2-recent-a1-hot-history-warmup.yml",
 sourceQuarantine:"system2/config/source_account_d1_writer_quarantine_v0_1.json",
 registry:"system2/config/d1_account_writer_registry_v0_1.json",
 destRegistry:"system2/config/dest_d1_cross_workflow_writer_interlock_v0_1.json",
 rawImporter:"system2/migration/owner_override_raw_d1_import_20261012.mjs"
};
const hash=x=>createHash("sha256").update(typeof x==="string"?x:JSON.stringify(x)).digest("hex");
const eq=a=>a.map(z=>z.id).sort().join(",")==="M08,M12";
export function validateRegistry(manifest,registry){
 const validIds=manifest.tasks.map(t=>t.id).sort();
 if(manifest.schemaVersion!=="S2_COMMANDER_PLAN_V0_1"||registry.schemaVersion!=="S2_COMMANDER_SAFE_EXECUTION_REGISTRY_V0_1"||validIds.length!==14)throw Error("PLAN_OR_REGISTRY_DRIFT");
 if(Object.keys(registry.taskTypes).sort().join("|")!==validIds.join("|"))throw Error("UNREGISTERED_TASK");
 if(registry.autoTaskIds.join("|")!=="M08|M12"||registry.maxDurationMinutes>12||registry.manualLiveApprovalNotGranted!==true||registry.neverAutoCloseIssues!==true||registry.neverClaimPhysicalCloudPass!==true)throw Error("EXECUTOR_SCOPE_ESCALATION");
 if(registry.forbiddenActions.length<6||Object.keys(registry.allowlistedTests).join("|")!=="M08|M12")throw Error("UNSAFE_EXECUTOR_ALLOWLIST");
 const allTests=[...Object.values(registry.allowlistedTests).flat()];
 if(new Set(allTests).size!==6)throw Error("UNEXPECTED_TEST_SET");
 for(const p of allTests)if(!/^system2\/tests\/[a-z0-9_]+\.test\.mjs$/.test(p))throw Error("BAD_TEST_PATH");
 return true;
}
export function assessSourceRoute({source,daily,raw,quarantine,sourceQuarantine}){
 const input=quarantine??sourceQuarantine;
 const q=typeof input==="string"?JSON.parse(input):input;
 if(!q||typeof q!=="object")throw Error("SOURCE_QUARANTINE_NOT_LOADED");
 const assertions={
  oldDeployCronQuarantined:/if:\s*\$\{\{\s*false\s*\}\}/.test(source),
  sourceQuarantineActive:q.active===true&&q.automaticRelease===false,
  dailyDestinationEnvironment:/environment:\s*system2-schema-only/.test(daily),
  rawCopyDestinationEnvironment:/environment:\s*system2-schema-only/.test(raw),
  dailyNotSourceEnvironment:!/environment:\s*system2-research/.test(daily),
  rawNotSourceEnvironment:!/environment:\s*system2-research/.test(raw),
  rawImportOwnerBounded:/S2_OWNER_OVERRIDE_RAW_COPY_20261012/.test(raw),
  dailyPushCloudWriterDisabled:/github\.event_name\s*!=\s*'push'/.test(daily)
 };
 return {assertions,findings:Object.entries(assertions).filter(([,ok])=>!ok).map(([name])=>name),
  sourceOnlyOfflineScope:true,observedCloudflareWorkerConfig:false,accountCredentialMatchPhysicallyObserved:false};
}
export function assessQuotaInterlock({daily,raw,warmup,registry,destRegistry,importer,rawImporter}){
 const importSource=importer??rawImporter;
 if(typeof importSource!=="string")throw Error("RAW_IMPORTER_NOT_LOADED");
 const old=(daily.match(/^\s*group:\s*(\S+)/m)||[])[1]||null;
 const history=(raw.match(/^\s*group:\s*(\S+)/m)||[])[1]||null;
 const writers=registry.writers||[];
 const diag=writers.find(w=>w.id==="DAILY_SHADOW_DIAGNOSTIC");
 const dest=typeof destRegistry==="string"?JSON.parse(destRegistry):destRegistry;
 const expected="s2-dest-d1-historical-and-diagnostic-writer";
 const liveWriters=dest?.writers??[];
 const liveRaw=liveWriters.some(w=>w.id==="RAW_COPY"&&w.workflow===".github/workflows/system2-owner-override-raw-d1-copy-20261012.yml");
 const liveDiag=liveWriters.some(w=>w.id==="DAILY_DIAGNOSTIC"&&w.workflow===".github/workflows/system2-daily-shadow-diagnostic.yml");
 const liveWarm=liveWriters.some(w=>w.id==="RECENT_A1_WARMUP"&&w.workflow===".github/workflows/system2-recent-a1-hot-history-warmup.yml");
 const rawRegistry=liveRaw&&liveDiag&&liveWarm&&dest?.sharedJobConcurrencyGroup===expected&&dest?.accountWideWriterCensusComplete===false;
 const getJobLock=(source,job)=>(source.match(new RegExp("^  "+job+":\\n    concurrency:\\n      group: (\\S+)","m"))||[])[1]||null;
 const diagJobLock=getJobLock(daily,"diagnostic"),rawJobLock=getJobLock(raw,"destination_copy"),warmJobLock=getJobLock(warmup||"","warmup");
 const fixed=diag?.reservationModel?.rowsWritten??null;
 const dailyHistoricalCharge=71322; // 2026-10-13 actual historic witness; NOT current usage.
 const userOperationalMax=80000;
 const assertions={
  diagnosticWriterInSourceRegistry:!!diag,
  diagnosticReservation13130:fixed===13130,
  rawCopyBilledWriteBudgetBounded:/const limit=80000, stopAt=75000, maxStatementRows=80/.test(importSource),
  rawCopyUsesOwnConcurrencyGroup:history!==null,
  diagnosticUsesOwnConcurrencyGroup:old!==null,
  sameGroupSerializesWriters:!!diagJobLock&&diagJobLock===expected&&diagJobLock===rawJobLock&&diagJobLock===warmJobLock,
  rawWriterRegisteredInDestRegistry:rawRegistry,
  failClosedGitHubDayGuardOnAllThree:/S2_DEST_WRITER_CLASS: RAW_COPY/.test(raw)&&/S2_DEST_WRITER_CLASS: DAILY_DIAGNOSTIC/.test(daily)&&
   /S2_DEST_WRITER_CLASS: RECENT_A1_WARMUP/.test(warmup||"")&&
   [raw,daily,warmup].every(x=>/if: steps\.day_interlock\.outputs\.allowed == 'true'/.test(x||"")),
  atomicCrossWorkflowLedgerPhysicallyVerified:false // Explicitly unknown until native D1 lock proven.
 };
 const collisionScenario={historicalRunDateUtc:"2026-10-13",billedHistoryWrites71322:dailyHistoricalCharge,priorMeasuredDiagnosticReserve13130:fixed,
   sum:dailyHistoricalCharge+(fixed||0),ownerMaxBilledWrites:userOperationalMax,
   wouldExceedUserCap:fixed===null?null:dailyHistoricalCharge+fixed>userOperationalMax,
   notCurrentUtcDayBalance:true};
 return {assertions,findings:Object.entries(assertions).filter(([,ok])=>!ok).map(([name])=>name),
  groupDiagnostic:old,groupRawCopy:history,sharedDestinationJobLock:diagJobLock,warmupJobLock:warmJobLock,collisionScenario,
  authorizedConcurrentWrite:false,verifiedDestinationAccountSpendableQuota:false};
}
export async function runOneTest(path,opts={}){
 if(!/^system2\/tests\/[a-z0-9_]+\.test\.mjs$/.test(path))throw Error("UNREGISTERED_PATH");
 const timeout=opts.timeout??70000;
 return await new Promise((resolvePromise)=>{
  const start=Date.now();
  const ch=spawn(process.execPath,["--test",path],{cwd:ROOT,env:{PATH:process.env.PATH,HOME:process.env.HOME,CI:"true",TZ:"Asia/Taipei"},stdio:["ignore","pipe","pipe"]});
  let bytes=0,stdout="",stderr="";
  const collect=(key,b)=>{
   bytes+=b.length;
   if(bytes>131072){ch.kill("SIGKILL");return;}
   if(key==="out")stdout+=b.toString("utf8");else stderr+=b.toString("utf8");
  };
  ch.stdout.on("data",b=>collect("out",b));ch.stderr.on("data",b=>collect("err",b));
  const timer=setTimeout(()=>ch.kill("SIGKILL"),timeout);
  ch.on("error",()=>{clearTimeout(timer);resolvePromise({path,exit:"SPAWN_ERROR",passed:false,durationMs:Date.now()-start})});
  ch.on("close",(code,signal)=>{
   clearTimeout(timer);
   const summary={path,exit:code??signal,passed:code===0&&bytes<=131072,durationMs:Date.now()-start,
    testCount:Number([...stdout.matchAll(/# tests\s+(\d+)/g)].at(-1)?.[1]??0),
    failCount:Number([...stdout.matchAll(/# fail\s+(\d+)/g)].at(-1)?.[1]??0),
    outputSha256:hash(stdout+"\n"+stderr)};
   resolvePromise(summary);
  });
 });
}
export async function evaluateSafeJobs({manifest,registry,readText=async p=>readFile(join(ROOT,p),"utf8"),testRunner=runOneTest}){
 validateRegistry(manifest,registry);
 const inputs={};
 for(const [name,path] of Object.entries(FILES))inputs[name]=await readText(path);
 const source=assessSourceRoute(inputs);
 const quota=assessQuotaInterlock({...inputs,registry:JSON.parse(inputs.registry)});
 const results={M08:{assessment:source,tests:[]},M12:{assessment:quota,tests:[]}};
 for(const id of registry.autoTaskIds){
  for(const p of registry.allowlistedTests[id])results[id].tests.push(await testRunner(p));
  const testsOK=results[id].tests.every(x=>x.passed);
  results[id].state=!testsOK?"BLOCKED_OFFLINE_TEST_FAILURE":results[id].assessment.findings.length?"FINDINGS_REMEDIATION_REQUIRED":"OFFLINE_CHECKS_PASS_NOT_PHYSICAL";
  results[id].allUnitTestsPassed=testsOK;
  results[id].taskFormallyAccepted=false;
  results[id].physicalCloudflareChecked=false;
 }
 const registryView=Object.fromEntries(Object.entries(registry.taskTypes).map(([id,type])=>[id,{
  type,sourceExecution:id==="M08"||id==="M12"?"ALLOWLISTED_OFFLINE_ACTIONS_EXECUTED":"NO_EXECUTOR_CONNECTED_OR_AUTHORIZATION"
 }]));
 const fingerprints=Object.fromEntries(Object.entries(FILES).map(([name,path])=>[name,{path,sha256:hash(inputs[name]),bytes:Buffer.byteLength(inputs[name])}]));
 return {schemaVersion:"S2_COMMANDER_SAFE_EXECUTION_RECEIPT_V0_1",kind:"OFFLINE_GITHUB_ACTIONS_SCRIPTED_TASK_EXECUTION",
  results,registry:registryView,fingerprints,selected:["M08","M12"],actualCloudflareCalls:0,actualCloudflareWrites:0,
  apiKeyOrPersonalDataIncluded:false,aiCodeAgentExecuted:false,autoIssueClosed:false,selectionOrFrozenPerformed:false};
}
export async function main(){
 const registry=JSON.parse(await readFile(new URL("./safe_job_registry_v0_1.json",import.meta.url),"utf8"));
 const manifest=JSON.parse(await readFile(new URL("./dispatch_plan_v0_1.json",import.meta.url),"utf8"));
 const receipt=await evaluateSafeJobs({manifest,registry});
 receipt.observedAtUtc=new Date().toISOString();
 receipt.github={runId:process.env.GITHUB_RUN_ID||"LOCAL",headSha:process.env.GITHUB_SHA||"UNKNOWN",eventName:process.env.GITHUB_EVENT_NAME||"LOCAL"};
 const base=process.env.RUNNER_TEMP||"/tmp";
 const folder=join(base,"s2commander-safe-executor");await mkdir(folder,{recursive:true});
 const artifactPath=join(folder,"receipt.json");
 await writeFile(artifactPath,JSON.stringify(receipt,null,2)+"\n",{flag:"w",mode:0o600});
 const states=Object.fromEntries(Object.entries(receipt.results).map(([id,v])=>[id,{state:v.state,tests:v.tests.length,failedTests:v.tests.filter(z=>!z.passed).length,failedTestPaths:v.tests.filter(z=>!z.passed).map(z=>z.path),findings:v.assessment.findings}]));
 console.log(JSON.stringify({status:"REAL_OFFLINE_ALLOWLIST_EXECUTED",artifactPath,states,cloudflareResourceOperations:0}));
 if(Object.values(receipt.results).some(x=>!x.allUnitTestsPassed))process.exitCode=2;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1]))main().catch(e=>{console.error("S2_SAFE_EXECUTOR_FAIL_CLOSED",String(e.message).slice(0,200));process.exitCode=2});
