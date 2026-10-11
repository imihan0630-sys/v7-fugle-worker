import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assessCorr003MigrationQuotaAdmissionV0_1 as assess}
  from '../runtime/corr003_migration_quota_admission_firewall_v0_1.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../../'+p,import.meta.url),'utf8'));
const args={
 audit:read('system2/evidence/S2_CORR003_INDEPENDENT_PHYSICAL_AND_ORIGINAL19_REVERIFY_20261011_V0_1.json'),
 schema:read('system2/migration/evidence/S2_C19_C21_SCHEMA_ONLY_INDEPENDENT_FINAL_ACCEPTANCE_20261011_V0_1.json'),
 policy:read('system2/evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json'),
 queue:read('system2/SYSTEM2_CORRECTION_QUEUE.json')
};
const expected=read('system2/evidence/S2_CORR003_MIGRATION_QUOTA_ADMISSION_FIREWALL_20261011_V0_1.json').verdict;
assert.deepEqual(assess(args),expected);
const cases=[
 ['schema equals full migration',x=>x.schema.allSystem2MigrationComplete=true],
 ['schema erased',x=>x.schema.strict25.pass=24],
 ['schema not physically accepted',x=>x.schema.finalDisposition='PENDING'],
 ['schema source immutable spoof',x=>x.schema.limitations.sourceD1RowsImmutableNotProven=false],
 ['source backup spoof',x=>x.schema.limitations.sourceD1BackupProven=true],
 ['PIT spoof',x=>x.schema.limitations.pitAvailableAtAndFrozenSnapshotsProven=true],
 ['history import spoof',x=>x.schema.limitations.historyTransferred=true],
 ['R2 copy spoof',x=>x.schema.limitations.r2ObjectContentsVerified=true],
 ['Worker deployed spoof',x=>x.schema.limitations.workerCronDeployedToNewAccount=true],
 ['quota freshness invented',x=>x.schema.limitations.realTimeQuotaGuaranteed=true],
 ['reserve fixed from whole-day rows',x=>x.policy.authorizedReserveRows=2825],
 ['read reserve fixed from day aggregate',x=>x.policy.authorizedReadReserveRows=133037],
 ['reserve write unauthorized promotion',x=>x.policy.reserveNumberAuthorized=true],
 ['reserve read unauthorized promotion',x=>x.policy.readReserveNumberAuthorized=true],
 ['GraphQL always realtime spoof',x=>x.policy.analyticsFreshnessState='REALTIME'],
 ['P0/P03 false promotion',x=>x.audit.fivePhysicalGates[2].physicalAccepted=true],
 ['source-only becomes physical',x=>x.audit.supportEvidence.qualifiedPhysical=1],
 ['fake additional support',x=>x.audit.supportEvidence.documented=38],
 ['original physical gap closed',x=>x.audit.originalNineteen.independentlyFullyClosed=19],
 ['P04 completed',x=>x.audit.fivePhysicalGates[3].decision='PASS'],
 ['origin clock relabel accepts wrong instant',x=>x.audit.freshProducerIntake.pr1121.clockDefect.correctTaipeiExample=x.audit.freshProducerIntake.pr1121.clockDefect.invalidLabeledTaipeiExample],
 ['ignore UTC conversion defect',x=>x.audit.freshProducerIntake.pr1121.clockDefect.correctionRequired=false],
 ['producer PR automatically accepted',x=>x.audit.freshProducerIntake.pr1121.status='MERGED'],
 ['remediation PR automatically accepted',x=>x.audit.freshProducerIntake.pr1122.status='MERGED'],
 ['backfill zip unverified promotion',x=>x.audit.freshProducerIntake.pr1122.originalZipBusinessLogNewReplay=12],
 ['audit closure forged',x=>x.audit.final='VERIFIED_CLOSED'],
 ['queue audit closure forged',x=>x.queue.directives.find(d=>d.directiveId==='S2-CORR-20261007-003').status='VERIFIED_CLOSED'],
 ['remove account budget prerequisite',x=>x.schema.requiredSubsequentGates=x.schema.requiredSubsequentGates.filter(z=>!/source account D1 budget/i.test(z))],
 ['drop frozen proof prerequisite',x=>x.schema.requiredSubsequentGates=x.schema.requiredSubsequentGates.filter(z=>!/Frozen Snapshot/i.test(z))],
 ['reroute next stage from 1068',x=>x.schema.nextStageIssue=1079],
];
for(const [name,fn] of cases){
 const x=structuredClone(args);
 fn(x);assert.throws(()=>assess(x),undefined,name);
}
console.log('CORR003_MIGRATION_QUOTA_ADMISSION_30_ADVERSARIAL_AND_BASELINE_PASS physical=0/5 reserve=null schemaOnly=25/25 NO_BYPASS');
