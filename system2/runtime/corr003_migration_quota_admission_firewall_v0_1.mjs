// Class A, offline only: no Cloudflare client, no D1/R2, no quota grant.
// Deliberately separate from active migration workflows and the actual quota gate.
// This snapshot evaluator prevents Schema-only success from being mistaken for
// Source D1/PIT/Frozen migration, System1 cost reserves, or CORR003 physical PASS.
import assert from "node:assert/strict";
const physical=["P01_SYSTEM1_WRITE_RESERVE","P02_SYSTEM1_READ_RESERVE",
 "P03_MULTIWRITER_UTC_DAY","P04_LATER_TRADING_DAY_SYSTEM1_PERSISTENCE",
 "P05_ORIGINAL_PHYSICAL_CRITERIA"];
export function assessCorr003MigrationQuotaAdmissionV0_1({audit,schema,policy,queue}={}){
 assert.equal(audit?.documentId,"S2_CORR003_INDEPENDENT_PHYSICAL_5GATE_ORIGINAL19_REVERIFY_20261011_V0_1");
 assert.equal(audit?.ticketId,"S2-CORR-20261007-003");
 assert.equal(audit?.auditLane,"AUDIT_LANE");
 assert.equal(audit?.severity,"HIGH");
 assert.equal(audit?.queueStatusAtAudit,"VERIFYING");
 assert.equal(audit?.final,"BLOCKED_NOT_ELIGIBLE_FOR_VERIFIED_CLOSED");
 assert.equal(audit?.supportEvidence?.total,38);
 assert.equal(audit?.supportEvidence?.documented,15);
 assert.equal(audit?.supportEvidence?.missing,23);
 assert.equal(audit?.supportEvidence?.qualifiedPhysical,0);
 assert.equal(audit?.supportEvidence?.requiredPhysical,5);
 assert.equal(audit?.originalNineteen?.total,19);
 assert.equal(audit?.originalNineteen?.sourceOnlyPriorAccepted,15);
 assert.deepEqual(audit?.originalNineteen?.prospectivePhysicalPendingIds,[10,14,15]);
 assert.equal(audit?.originalNineteen?.historicalNegativeNotForwardPassId,16);
 assert.equal(audit?.originalNineteen?.independentlyFullyClosed,0);
 assert.deepEqual(audit?.fivePhysicalGates?.map(g=>g.id),physical);
 const expected=[[3,7],[3,7],[3,8],[2,7],[4,9]];
 audit.fivePhysicalGates.forEach((g,i)=>{
   assert.equal(g.documented,expected[i][0]);
   assert.equal(g.total,expected[i][1]);
   assert.equal(g.missing,expected[i][1]-expected[i][0]);
   assert.equal(g.physicalAccepted,false);
   assert.equal(g.decision,"BLOCKED_PROOF_NOT_YET_QUALIFIED");
 });
 assert.equal(audit?.separateDestinationSchemaMilestone?.accepted,true);
 assert.equal(audit?.separateDestinationSchemaMilestone?.gates,"25/25");
 assert.equal(audit?.separateDestinationSchemaMilestone?.newAccountOnly,true);
 assert.equal(audit?.separateDestinationSchemaMilestone?.sourceRowsImported,0);
 assert.equal(audit?.separateDestinationSchemaMilestone?.doesNotQualifySharedOldAccountQuotaOrProductionPersistence,true);
 assert.equal(audit?.separateDestinationSchemaMilestone?.doesNotProvideSourceD1HistoryOrPIT,true);
 assert.equal(audit?.freshProducerIntake?.pr1121?.status,"OPEN_UNMERGED");
 assert.equal(audit?.freshProducerIntake?.pr1122?.status,"OPEN_UNMERGED");
 assert.equal(audit?.freshProducerIntake?.pr1121?.head,"b8fa41920c1fc16ca735dc0959314fc835448a8a");
 assert.equal(audit?.freshProducerIntake?.pr1122?.head,"7f6664a27209d93af3e8fea7c247f5f74f9cade0");
 assert.equal(audit?.freshProducerIntake?.pr1121?.clockDefect?.count,12);
 const clock=audit.freshProducerIntake.pr1121.clockDefect;
 assert.equal(clock.correctionRequired,true);
 assert.equal(Date.parse(clock.actualUtcExample),Date.parse(clock.correctTaipeiExample));
 assert.equal(Date.parse(clock.actualUtcExample)-Date.parse(clock.invalidLabeledTaipeiExample),8*3600000);
 assert.equal(audit?.freshProducerIntake?.pr1122?.cannotChangeAuditOrReserve,true);
 assert.equal(audit?.freshProducerIntake?.pr1122?.originalZipBusinessLogNewReplay,0);
 assert.equal(audit?.freshProducerIntake?.pr1122?.original19Preserved,true);
 assert.equal(policy?.directiveId,"S2-CORR-20261007-003");
 assert.equal(policy?.reserveNumberAuthorized,false);
 assert.equal(policy?.authorizedReserveRows,null);
 assert.equal(policy?.readReserveNumberAuthorized,false);
 assert.equal(policy?.authorizedReadReserveRows,null);
 assert.equal(policy?.analyticsFreshnessState,"GRAPHQL_REALTIME_FRESHNESS_NOT_DOCUMENTED");
 assert.equal(queue?.directives?.find(d=>d.directiveId==="S2-CORR-20261007-003")?.status,"VERIFYING");
 assert.equal(schema?.evidenceVersion,"S2_C19_C21_SCHEMA_ONLY_INDEPENDENT_FINAL_ACCEPTANCE_20261011_V0_1");
 assert.equal(schema?.auditLane,"AUDIT_LANE");
 assert.equal(schema?.strict25?.total,25);
 assert.equal(schema?.strict25?.pass,25);
 assert.equal(schema?.strict25?.fail,0);
 assert.equal(schema?.strict25?.blocked,0);
 assert.equal(schema?.finalDisposition,"PASS_CLOUDFLARE_DESTINATION_SCHEMA_ONLY_PHYSICAL_STAGE");
 assert.equal(schema?.schemaInstalledOnNewAccount,true);
 assert.equal(schema?.allSystem2MigrationComplete,false);
 assert.equal(schema?.nextStageIssue,1068);
 for(const key of ["sourceD1RowsImmutableNotProven","sourceD1BackupProven",
   "pitAvailableAtAndFrozenSnapshotsProven","historyTransferred",
   "r2ObjectContentsVerified","workerCronDeployedToNewAccount",
   "realTimeQuotaGuaranteed"]){
   const expected=key==="sourceD1RowsImmutableNotProven";
   assert.equal(schema?.limitations?.[key],expected,`Schema-only ${key} cannot provide physical authority`);
 }
 const stage=[...schema?.requiredSubsequentGates||[]];
 assert.ok(stage.some(x=>/source account D1 budget/i.test(x)));
 assert.ok(stage.some(x=>/frozen snapshot/i.test(x)));
 assert.ok(stage.some(x=>/destination quota-safe/i.test(x)));
 return Object.freeze({
  state:"MIGRATION_QUOTA_ADMISSION_FAIL_CLOSED",
  schemaOnly:"INDEPENDENT_PASS_25_OF_25",
  system2DataMigrationAccepted:false,
  corr003AcceptedPhysical:0,
  corr003TotalPhysical:5,
  corr003SupportChecks:"15/38",
  originalCriteria:"15_SOURCE_ONLY_3_PHYSICAL_PENDING_1_HISTORICAL_NEGATIVE",
  system1WriteReserveAuthorized:false,system1ReadReserveAuthorized:false,
  system1AuthorizedWriteRows:null,system1AuthorizedReadRows:null,
  realTimeAccountHeadroomAttested:false,
  sourceD1PITFrozenRestoreAccepted:false,hotD1ScoutAccepted:false,hotD1CensusAccepted:false,
  producerPr1121CanAutoMerge:false,remediationPr1122CanAutoMerge:false,
  sourceClockCorrectionRequired:12,
  quotaGrantEligible:false,d1SqlReadAuthorized:false,d1SqlWriteAuthorized:false,
  r2TransferAuthorized:false,shadowStartAuthorized:false,
  requiresIndependentAuditor:true,
  nextProducerIssues:[1024,1026,1068]
 });
}
