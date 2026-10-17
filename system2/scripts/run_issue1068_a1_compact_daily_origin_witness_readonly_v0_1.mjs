// Generic per-new-T SOURCE schedule origin witness. Reads only two existing
// signed AUDIT tiny receipts + GH native REST Run/Job metadata (not provider).
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {witnessDailySourceOriginV0_1}
 from '../migration/issue1068_a1_compact_daily_origin_witness_v0_1.mjs';

const args=process.argv.slice(2);
async function main(){
 if(args.length!==6||args.some(x=>typeof x!=='string'||!x))
  throw Error('A1_COMPACT_SOURCE_WITNESS_EXACT_SIX_INPUT_PATHS_REQUIRED');
 const [auditPath,dualPath,sourceRunPath,auditRunPath,sourceJobsPath,dest]=args;
 const load=async p=>JSON.parse(await readFile(p,'utf8'));
 const [auditReceipt,dualReceipt,sourceRun,auditRun,jobs]=await Promise.all([
  load(auditPath),load(dualPath),load(sourceRunPath),load(auditRunPath),load(sourceJobsPath)
 ]);
 if(!Array.isArray(jobs?.jobs)||jobs.total_count!==1||jobs.jobs.length!==1)
  throw Error('A1_COMPACT_SOURCE_WITNESS_EXACT_ONE_SOURCE_JOB_REQUIRED');
 const receipt=await witnessDailySourceOriginV0_1({
  auditReceipt,dualReceipt,sourceRun,auditRun,sourceJob:jobs.jobs[0]
 });
 await mkdir(dest,{recursive:true,mode:0o700});
 await writeFile(resolve(dest,'source-origin-witness.json'),JSON.stringify(receipt,null,2)+'\n',
  {flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  marketDate:receipt.marketDate,sourceRunId:receipt.sourceRunId,
  auditRunId:receipt.independentAuditRunId,
  sourceRootWasScheduled:receipt.sourceRootWasScheduled,
  scheduledSlot:receipt.sourceRootScheduleExpression,
  enqueueDelayMinutes:receipt.sourceGitHubEnqueueDelayMinutes,
  beforePreferredCut:receipt.sourceAndAuditBeforePreferredCut,
  independentOriginalPairs:receipt.sourceOriginalMarketDatePairsIndependentlyAudited,
  buildConsumerCertified:false,selectionCertified:false,
  selectedCount:null,frozen:false,receiptHash:receipt.receiptHash
 }));
}
main().catch(e=>{console.error('A1_COMPACT_WITNESS_FAIL_CLOSED_'+String(e?.message||e));process.exitCode=2});
