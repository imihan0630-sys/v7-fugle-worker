// Offline BUILD joins ONLY preexisting DATA/GitHub receipts; never re-fetches
// official market source or triggers original collector/audit workflows.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {reconcileSchemeCSourceCronReadinessV0_1}
 from '../runtime/scheme_c_source_cron_natural_chain_readiness_v0_1.mjs';
const [sourceFile,sourceRunFile,auditRunFile,firstCommitFile,outputFile]=
 process.argv.slice(2);
if(![sourceFile,sourceRunFile,auditRunFile,firstCommitFile,outputFile].every(x=>
 typeof x==='string'&&x.length>0)||process.argv.length!==7)
 throw Error('S2_BUILD_SCHEME_C_CRON_READINESS_FIVE_EXACT_FILES_REQUIRED');
const read=async p=>JSON.parse(await readFile(resolve(p),'utf8'));
const [sourceChain,sourceRun,auditRun,firstSchemeCCommit]=
 await Promise.all([sourceFile,sourceRunFile,auditRunFile,firstCommitFile].map(read));
const result=await reconcileSchemeCSourceCronReadinessV0_1({
 sourceChain,sourceRun,auditRun,firstSchemeCCommit
});
const out=resolve(outputFile);
await mkdir(dirname(out),{recursive:true});
await writeFile(out,JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
console.log(JSON.stringify({marketDate:result.marketDate,mode:result.mode,
 sourceScheduleProven:result.independentlyDataReconciledSourceCron,
 sourceOriginalCutReady:result.sourceOriginalCutReady,
 naturalConsumerReceiptReconciled:false,fullP0Accepted:false,
 pitA:false,selectedCount:null,frozen:false,receiptHash:result.readinessHash}));
