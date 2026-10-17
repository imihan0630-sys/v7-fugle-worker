// Reconcile three EXISTING GitHub original artifacts. No external market GET,
// Actions dispatch, D1/R2 writes, Worker change, or PIT strategy admission.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {reconcileNativeA1CronSourceAuditChainV0_1}
 from '../migration/issue1068_a1_native_cron_source_audit_chain_v0_1.mjs';

async function run(){
 const [sourceDir,auditFile,dualFile,sourceRunFile,auditRunFile,sourceJobsFile,outputDir]=
  process.argv.slice(2);
 if(![sourceDir,auditFile,dualFile,sourceRunFile,auditRunFile,sourceJobsFile,outputDir]
  .every(x=>typeof x==='string'&&x.length>0))
  throw Error('S2_DATA_A1_CRON_CHAIN_REQUIRED_EXISTING_ORIGINAL_PATHS');
 const load=async path=>JSON.parse(await readFile(path,'utf8'));
 const [origin,manifest,sourceReceipt,auditReceipt,dualReceipt,
  sourceRun,auditRun,sourceJobs]=await Promise.all([
   load(resolve(sourceDir,'source-github-origin.json')),
   load(resolve(sourceDir,'shared-official-a1-manifest.json')),
   load(resolve(sourceDir,'official-61-2026-10-16.json')),
   load(auditFile),load(dualFile),load(sourceRunFile),load(auditRunFile),load(sourceJobsFile)
  ]);
 if(!Array.isArray(sourceJobs.jobs)||sourceJobs.jobs.length!==1||
    sourceJobs.jobs[0]?.run_id!==sourceRun.id)
  throw Error('S2_DATA_A1_CRON_CHAIN_JOB_API_WRONG_RUN');
 const receipt=await reconcileNativeA1CronSourceAuditChainV0_1({
  origin,manifest,sourceReceipt,auditReceipt,dualReceipt,
  sourceRun,auditRun,sourceJob:sourceJobs.jobs[0],
  producerArtifactId:12060640574,auditArtifactId:12060227504,
  dualArtifactId:12058994846
 });
 await mkdir(outputDir,{recursive:true,mode:0o700});
 await writeFile(resolve(outputDir,'native-github-source-cron-audit-chain.json'),
  JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  marketDate:receipt.marketDate,
  sourceRunId:receipt.sourceRunId,
  independentAuditRunId:receipt.independentAuditRunId,
  sourceSchedulerObserved:receipt.sourceScheduleEventIndependentlyVerified,
  originalCron:receipt.exactEventCron,
  enqueueDelayMinutes:receipt.scheduleEnqueueDelayMinutes,
  originalTargetDecisionCutSourceReady:receipt.originalTargetDecisionCutSourceReady,
  sourcePairs:receipt.originalSourceMarketPairsIndependentlyAudited,
  completeSourceAuditToSchemeC:false,formalPIT:false,
  frozen:false,receiptHash:receipt.receiptHash
 }));
}
run().catch(e=>{
 console.error('S2_DATA_A1_CRON_CHAIN_FAIL_CLOSED_'+String(e?.message||e));
 process.exitCode=2;
});
