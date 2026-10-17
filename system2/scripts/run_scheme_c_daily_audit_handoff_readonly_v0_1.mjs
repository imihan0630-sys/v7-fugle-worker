// Consume only already persisted source-audit + derived preliminary receipts.
// Outputs one source-only JSON, no network/provider API or production mutation.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {buildSchemeCDailyAuditHandoffV0_1}
 from '../runtime/scheme_c_daily_audit_handoff_v0_1.mjs';

const args=process.argv.slice(2);
if(args.length<3||args.length>4)
 throw Error('USAGE: node run_scheme_c_daily_audit_handoff_readonly_v0_1.mjs <audit.json> <preliminary.json> <audit-run-id> [historical-pinned]');
const [auditPath,previewPath,runIdText,mode='current']=args;
if(!/^[1-9]\d+$/.test(runIdText))throw Error('AUDIT_RUN_ID_NOT_INTEGER');
const audit=JSON.parse(await readFile(auditPath,'utf8'));
const preview=JSON.parse(await readFile(previewPath,'utf8'));
const result=await buildSchemeCDailyAuditHandoffV0_1({
 auditReceipt:audit,preliminaryReceipt:preview,auditRunId:Number(runIdText),
 sourceKind:mode==='historical-pinned'
  ?'PINNED_HISTORIC_V02_REPLAY':'SAME_RUN_SOURCE_ONLY_AUDIT_ARTIFACT',
 auditLinkedExternally:mode==='historical-pinned'
});
if(process.env.S2_SCHEME_C_OUTPUT_PATH){
 const p=resolve(process.env.S2_SCHEME_C_OUTPUT_PATH);
 await mkdir(resolve(p,'..'),{recursive:true});
 await writeFile(p,JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
}
console.log(JSON.stringify({
 marketDate:result.marketDate,state:result.state,
 sourceAuditRunId:result.auditRunId,
 displayed:result.observedPreviewCount,
 descriptiveMatches:result.descriptiveSourceMatches,
 sourceOnlyPreview:true,
 PIT_A_CERTIFIED:false,PIT_B_CERTIFIED:false,selectedCount:null,
 frozenD1Written:false,sourceReadOnly:true,
 receiptHash:result.receiptHash
}));
