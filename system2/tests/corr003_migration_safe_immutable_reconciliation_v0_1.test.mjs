import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const file='../evidence/S2_CORR003_MIGRATION_SAFE_IMMUTABLE_RECONCILIATION_20261011_V0_1.json';
const bytes=readFileSync(new URL(file,import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
const e=JSON.parse(bytes);
const load=p=>JSON.parse(readFileSync(new URL('../../'+p,import.meta.url),'utf8'));
const queue=load('system2/SYSTEM2_CORRECTION_QUEUE.json').directives.find(d=>d.directiveId===e.directiveId);
const audit=load('system2/evidence/S2_CORR003_AUDIT_5_PHYSICAL_19_ORIGINAL_FINAL_DISPOSITION_20261009_V0_1.json');
const policy=load('system2/evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json');
assert.equal(sha(bytes),readFileSync(new URL(file+'.sha256',import.meta.url),'utf8').split(/\s/)[0]);
for(const pin of e.canonicalSourcePins){
 let b=readFileSync(new URL('../../'+pin.path,import.meta.url));
 if(pin.path==='system2/SYSTEM2_REMEDIATION_CHECKPOINT.md'){
  const text=b.toString('utf8'),marker='\n\n## 2026-10-11 migration-safe CORR-003 immutable evidence intake';
  assert.ok(text.includes(marker)); b=Buffer.from(text.slice(0,text.indexOf(marker)));
 }
 assert.equal(sha(b),pin.sha256,'Pinned main source changed: '+pin.path);
 assert.equal(pin.commitSha,e.mainSha);
}
function validate(x){
 assert.equal(queue.status,'VERIFYING'); assert.equal(queue.severity,'HIGH');
 assert.equal(x.auditSubmission.closureAuthority,false); assert.equal(x.auditSubmission.queueMutationAllowed,false);
 assert.equal(x.producerPr.mustNotMerge,true); assert.equal(x.producerPr.state,'OPEN_UNMERGED');
 assert.equal(x.original19Criteria.length,queue.acceptanceCriteria.length);
 for(const [i,c] of x.original19Criteria.entries()){
  assert.equal(c.criterionNumber,i+1); assert.equal(c.exactCanonicalCriterion,queue.acceptanceCriteria[i]);
  assert.equal(c.independentPhysicalAcceptance,false);
  assert.equal(c.status,[10,14,15].includes(i+1)?'PENDING':i===15?'BLOCKED':'PASS');
  if(c.status==='PASS')assert.equal(c.statusScope,'INHERITED_INDEPENDENT_SOURCE_LEVEL_ONLY');
 }
 assert.equal(x.fivePhysicalGates.length,audit.fivePhysicalGates.length);
 for(const [i,g] of x.fivePhysicalGates.entries()){
  assert.equal(g.id,audit.fivePhysicalGates[i].id);
  assert.equal(g.documentedSupportChecks,audit.fivePhysicalGates[i].documentedSupportChecks);
  assert.equal(g.totalSupportChecks,audit.fivePhysicalGates[i].totalSupportChecks);
  assert.equal(g.independentlyPhysicalQualified,false); assert.equal(g.acceptanceStatus,'PENDING');
 }
 assert.equal(x.progress.supportCompleted,x.fivePhysicalGates.reduce((n,g)=>n+g.documentedSupportChecks,0));
 assert.equal(x.progress.supportTotal,x.fivePhysicalGates.reduce((n,g)=>n+g.totalSupportChecks,0));
 assert.equal(x.progress.independentPhysicalAccepted,0);
 assert.deepEqual([x.reserve.reserveNumberAuthorized,x.reserve.authorizedReserveRows,x.reserve.readReserveNumberAuthorized,x.reserve.authorizedReadReserveRows],[policy.reserveNumberAuthorized,policy.authorizedReserveRows,policy.readReserveNumberAuthorized,policy.authorizedReadReserveRows]);
 assert.equal(x.reserve.numericalWriteCandidate,null); assert.equal(x.reserve.numericalReadCandidate,null);
 assert.equal(x.clockDefect.affectedRunCount,12);
 for(const r of x.system1NativeReconciliation){
  assert.equal(Date.parse(r.correctCreatedAtTaipei),Date.parse(r.createdAtUtc),'UTC instant must survive conversion');
  assert.equal(Date.parse(r.producerCreatedAtTaipei)-Date.parse(r.createdAtUtc),-8*3600000);
  assert.equal(r.clockErrorMilliseconds,-28800000); assert.equal(r.producerClockStatus,'BLOCKED_OFFSET_RELABELLED_8_HOURS');
  assert.ok(r.correctCreatedAtTaipei.endsWith('+08:00'));
  assert.equal(r.rawBusinessLogsReplayedThisTurn,false);
  for(const a of r.artifacts){assert.equal(a.zipBytesReplayedThisTurn,false);assert.equal(a.innerContentVerifiedThisTurn,false);}
 }
 // C1 UTC Oct08 16:28 belongs to Taipei Oct09, while original target trading date remains Oct08.
 assert.equal(x.system1NativeReconciliation.find(r=>r.runId===37808995747).correctCreatedAtTaipei,'2026-10-09T00:28:00.000+08:00');
 assert.equal(x.recentRunIndex.originalPageHashReplayStatus,'PENDING_RAW_THREE_PAGE_RESPONSES_ABSENT_FROM_PR_ARCHIVE');
 assert.equal(x.recentRunIndex.originalPageBytesCommitted,false);
 assert.equal(x.verificationLimits.originalZipReplayPassCountThisTurn,0);
 assert.equal(x.verificationLimits.rawBusinessLogReplayPassCountThisTurn,0);
 for(const r of x.dataP03Reconciliation){
  assert.ok(['QUOTA_BUDGET_DEFER','PUSH_READ_ONLY_ONLY'].includes(r.gateState));
  assert.ok(r.physicalBusinessSteps.every(s=>s.result==='skipped'));
  assert.equal(r.zipBytesReplayedThisTurn,false);
 }
 for(const k of ['primary2335OperationRowsWritten','primary2335OperationRowsRead','recovery2355OperationRowsWritten','recovery2355OperationRowsRead'])assert.equal(x.costScope[k],null);
 assert.equal(x.costScope.historicalAccountCollision.combinedRowsWritten,124629+1869);
 assert.equal(x.costScope.historicalAccountCollision.combinedRowsRead,3943636+431323);
 assert.equal(x.dataAndMigration.hotD1ScoutAccepted,0); assert.equal(x.dataAndMigration.hotD1CensusAccepted,0);
 assert.equal(x.dataAndMigration.destinationSchemaIndependent,'INHERITED_PASS_25_OF_25_SCHEMA_ONLY_PR1116');
 assert.equal(x.dataAndMigration.destinationSourceRowsImported,0);
 assert.equal(x.dataAndMigration.fullMigrationAccepted,false); assert.equal(x.dataAndMigration.shadowLaunchAccepted,false);
 assert.equal(x.dataAndMigration.noSchemaApplyOrRerun,true); assert.equal(x.dataAndMigration.noSourceOrDestinationD1R2Io,true);
}
validate(e);
const attacks=[
 x=>x.original19Criteria[9].status='PASS',
 x=>x.original19Criteria[15].status='PASS',
 x=>x.original19Criteria[0].exactCanonicalCriterion='rewritten requirement',
 x=>x.fivePhysicalGates[3].independentlyPhysicalQualified=true,
 x=>x.progress.independentPhysicalAccepted=1,
 x=>x.reserve.authorizedReserveRows=2825,
 x=>x.reserve.authorizedReadReserveRows=133037,
 x=>x.costScope.primary2335OperationRowsWritten=2825,
 x=>x.costScope.recovery2355OperationRowsRead=0,
 x=>x.system1NativeReconciliation[6].correctCreatedAtTaipei=x.system1NativeReconciliation[6].producerCreatedAtTaipei,
 x=>x.system1NativeReconciliation[0].artifacts[0].innerContentVerifiedThisTurn=true,
 x=>x.recentRunIndex.originalPageHashReplayStatus='PASS',
 x=>x.dataP03Reconciliation[1].gateState='QUOTA_RESERVATION_GRANTED',
 x=>x.dataAndMigration.hotD1ScoutAccepted=36,
 x=>x.dataAndMigration.hotD1CensusAccepted=11843,
 x=>x.dataAndMigration.destinationSchemaIndependent='PENDING_20_OF_25',
 x=>x.dataAndMigration.fullMigrationAccepted=true,
 x=>x.dataAndMigration.noSchemaApplyOrRerun=false,
 x=>x.auditSubmission.closureAuthority=true,
 x=>x.producerPr.mustNotMerge=false,
];
for(const mutate of attacks){const forged=structuredClone(e);mutate(forged);assert.throws(()=>validate(forged));}
console.log('CORR003_MIGRATION_SAFE_RECONCILIATION_PASS 19 exact criteria, 12 offset-aware clocks, 20 false promotions rejected; physical 0/5 reserves null');
