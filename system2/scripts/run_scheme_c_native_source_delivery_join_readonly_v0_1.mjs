// Build-only immutable offline cross-evidence result. All input bytes already
// exist in previously archived, exact GitHub source/independent audit artifacts.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {joinSchemeCNativeSourceAndDeliveryV0_1}
 from '../runtime/scheme_c_native_source_delivery_join_v0_1.mjs';
if(process.argv.length!==9)
 throw Error('USAGE: node run_scheme_c_native_source_delivery_join_readonly_v0_1.mjs <DATA-original-native-chain.json> <SchemeC-handoff.json> <SchemeC-origin.json> <SchemeC-report-meta.json> <SchemeC-report.md> <SchemeC-acceptance.json> <output.json>');
const [d,h,o,m,r,a]=await Promise.all(process.argv.slice(2,8).map(
 x=>readFile(x,'utf8')));
if(!r.endsWith('\n'))throw Error('SIGNED_HUMAN_REPORT_FINAL_NEWLINE_REQUIRED');
// Existing renderer writes the signed markdown plus exactly one final LF.
const receipt=await joinSchemeCNativeSourceAndDeliveryV0_1({
 dataNativeCronAuditReceipt:JSON.parse(d),
 schemeCHandoff:JSON.parse(h),schemeCOrigin:JSON.parse(o),
 schemeCReportMeta:JSON.parse(m),schemeCReportMarkdown:r.slice(0,-1),
 schemeCAcceptance:JSON.parse(a)
});
const dest=resolve(process.argv[8]);
await mkdir(dirname(dest),{recursive:true});
await writeFile(dest,JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
console.log(JSON.stringify({
 status:receipt.status,marketDate:receipt.marketDate,
 originalSourceScheduled:receipt.sourceScheduledEventVerified,
 originalAtCut:receipt.originalSourceAndAuditReadyAtT2345,
 sourceRun:receipt.dataOriginalSourceRunId,
 auditRun:receipt.dataIndependentAuditRunId,
 deliveryMode:receipt.schemeCDeliveryMode,
 fullScheduledChainAccepted:false,pitA:false,
 selectedCount:null,frozen:false,receiptHash:receipt.joinHash
}));
