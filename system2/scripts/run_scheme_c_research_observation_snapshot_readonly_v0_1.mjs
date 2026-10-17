// Read-only, create-once supplementary research record for the exact
// already verified Scheme C report. A failure must not prevent the report
// itself from being displayed by the existing consumer.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {buildSchemeCResearchObservationSnapshotV0_1}
 from '../runtime/scheme_c_research_observation_snapshot_v0_1.mjs';
if(process.argv.length!==8)
 throw Error('USAGE: node run_scheme_c_research_observation_snapshot_readonly_v0_1.mjs <handoff.json> <origin.json> <report-meta.json> <report.md> <delivery-acceptance.json> <output.json>');
const [handoff,deliveryOrigin,reportMeta,rawReport,deliveryAcceptance]=
 await Promise.all(process.argv.slice(2,7).map(x=>readFile(x,'utf8')));
if(!rawReport.endsWith('\n'))
 throw Error('SCHEME_C_RESEARCH_OBSERVATION_SIGNED_REPORT_FINAL_NEWLINE_REQUIRED');
const result=await buildSchemeCResearchObservationSnapshotV0_1({
 handoff:JSON.parse(handoff),deliveryOrigin:JSON.parse(deliveryOrigin),
 reportMeta:JSON.parse(reportMeta),reportMarkdown:rawReport.slice(0,-1),
 deliveryAcceptance:JSON.parse(deliveryAcceptance),
 generatedAtUtc:new Date().toISOString()
});
const output=resolve(process.argv[7]);
await mkdir(dirname(output),{recursive:true});
await writeFile(output,JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
console.log(JSON.stringify({
 marketDate:result.marketDate,model:result.modelVersion,
 generatedAt:result.actualReportGeneratedAtUtc,
 delivery:result.deliveryMode,sourceScanned:result.sourceFourDigitSecuritiesScanned,
 descriptiveMatched:result.descriptiveMatched,
 displayed:result.displayedResearchRows,
 retentionDays:result.recordRetentionDays,
 pitA:false,pitB:false,selectedCount:null,
 forwardPerformanceCertified:false,snapshotHash:result.snapshotHash
}));
