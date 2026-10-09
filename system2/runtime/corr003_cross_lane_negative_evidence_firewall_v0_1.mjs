// REMEDIATION_LANE | CORR-003 Class-A offline cross-producer evidence firewall.
// NOT a quota budget evaluator, reserve authorizer, independent auditor or D1 adapter.
// A green GitHub job, cron row, source receipt or lower-bound GraphQL observation
// must never promote P01-P05 to PHYSICAL PASS without independent audit.
import assert from "node:assert/strict";
import {validateIssue1026P03DeferMatrixV0_1}
 from "./issue1026_p03_cross_writer_defer_validate_v0_1.mjs";

const EXPECTED="S2-CORR-20261007-003";
const pending=["P01_SYSTEM1_WRITE_RESERVE","P02_SYSTEM1_READ_RESERVE",
 "P03_MULTIWRITER_UTC_DAY","P04_LATER_TRADING_DAY_SYSTEM1_PERSISTENCE",
 "P05_ORIGINAL_PHYSICAL_CRITERIA"];

export function reconcileCorr003CrossLaneNegativeEvidenceV0_1({
 system1Producer,system1CronSink,dataMatrix,dataMetadata,registry,
 reservePolicy,physicalAudit,correctionQueue,priorIntake,
}={}){
 assert.equal(system1Producer?.schemaVersion,"SYSTEM1_ISSUE1024_P01_P02_P04_READONLY_SOURCE_INTAKE_V0_1");
 assert.equal(system1CronSink?.schemaVersion,"SYSTEM1_ISSUE1024_CRON_SINK_FAILURE_TRIANGULATION_V0_1");
 assert.equal(system1CronSink?.parentEvidence,
  "research/SYSTEM1_ISSUE1024_P01_P02_P04_REAL_GITHUB_D1_PRODUCER_EVIDENCE_20261009_V0_1.json");
 assert.equal(dataMetadata?.schemaVersion,"S2_ISSUE1026_P03_P05_ACCOUNT_GRAPHQL_NONAUTHORIZING_REAL_PHYSICAL_OBSERVATION_V0_1");
 assert.equal(priorIntake?.schemaVersion,"S2_CORR003_P01_P05_PRODUCER_RECEIPT_RECONCILIATION_V0_1");
 assert.equal(priorIntake?.sourceReceipts?.length,2);
 assert.deepEqual(priorIntake.sourceReceipts.map(x=>x.issue),[1024,1026]);
 assert.equal(priorIntake?.gateStatus?.independentlyQualified,0);
 assert.equal(priorIntake?.originalCriteriaMapped,19);

 // Validate actual DATA lane's five real job/step observations with its own
 // validator and the current immutable upstream policy/registry/closure evidence.
 const witness=validateIssue1026P03DeferMatrixV0_1({
   matrix:dataMatrix,registry,system1Producer,reservePolicy,
   p03P05Metadata:dataMetadata,physicalClosure:physicalAudit,
 });
 assert.equal(witness.observedRealGateRuns,5);
 assert.equal(witness.writerClasses,4);
 assert.equal(witness.realGrantedReservationCount,0);
 assert.equal(witness.physicalD1MutationAuthorized,false);
 assert.equal(dataMatrix?.accountMetadataObservation?.runId,
   dataMetadata?.realAccountObservation?.runId);
 assert.equal(dataMatrix?.accountMetadataObservation?.rowsReadLowerBound,
   dataMetadata?.realAccountObservation?.rowsReadLowerBound);
 assert.equal(dataMatrix?.accountMetadataObservation?.rowsWrittenLowerBound,
   dataMetadata?.realAccountObservation?.rowsWrittenLowerBound);
 assert.equal(dataMatrix?.utcQuotaDay,dataMetadata?.realAccountObservation?.quotaDay);
 assert.equal(dataMetadata?.realAccountObservation?.readHeadroomProven,false);
 assert.equal(dataMetadata?.realAccountObservation?.writeHeadroomProven,false);
 assert.equal(dataMetadata?.realAccountObservation?.analyticsLagGuarantee,"NOT_DOCUMENTED_BY_VENDOR");
 assert.equal(dataMetadata?.physicalImpact?.cloudflareD1SqlQueries,0);
 assert.equal(dataMetadata?.physicalImpact?.cloudflareD1Writes,0);

 // Independently observed absent cron audit row + real failed primary business
 // side-effect MUST mean attempted-but-failed, never "not invoked" or "success".
 assert.equal(system1CronSink?.runs?.find(x=>x.key==="PVE262")?.originalResult
  ?.rawD1CronWindowRowCount,0);
 assert.equal(system1CronSink?.independentBusinessSideEffects?.attempt?.status,"FAILED");
 assert.match(system1CronSink?.independentBusinessSideEffects?.attempt?.error||"",
  /exceeded D1's free tier daily row write limit/i);
 assert.equal(system1CronSink?.negativeEvidenceLogic?.expectedFusionState,
  "INVOKED_EXECUTION_FAILED_D1_QUOTA");
 assert.equal(system1CronSink?.negativeEvidenceLogic?.canConcludeCronNotInvoked,false);
 assert.equal(system1CronSink?.negativeEvidenceLogic?.canConcludeRecoveryBusinessSucceeded,false);
 assert.equal(system1CronSink?.negativeEvidenceLogic?.canConcludeBusinessPersistenceVerified,false);
 assert.equal(system1CronSink?.remainingAcceptance?.independentlyAcceptedCorr003PhysicalGates,0);
 assert.equal(system1CronSink?.quotaAttribution?.physicalRowsWrittenPer2355Or2335,null);
 assert.equal(system1Producer?.sourceCoverage?.healthyDatesCount,2);
 assert.equal(system1Producer?.businessPersistence?.subsequentNaturallyScheduledHealthyRealBusinessPersisted,false);
 assert.equal(system1Producer?.physicalQualification?.readReserveAuthorized,false);
 assert.equal(system1Producer?.physicalQualification?.writeReserveAuthorized,false);

 // Independent AUDIT_LANE owns the only accepted physical PASS status.
 const directive=correctionQueue?.directives?.find(x=>x.directiveId===EXPECTED);
 assert.equal(directive?.assignedLane,"REMEDIATION_LANE");
 assert.equal(directive?.severity,"HIGH");
 assert.equal(directive?.status,"VERIFYING");
 assert.equal(directive?.acceptanceCriteria?.length,19);
 assert.equal(physicalAudit?.directiveId,EXPECTED);
 assert.equal(physicalAudit?.closureState,"PHYSICAL_GATES_PENDING_NO_VERIFIED_CLOSED");
 assert.deepEqual(physicalAudit?.prerequisiteGates?.map(x=>x.id),pending);
 for(const gate of physicalAudit.prerequisiteGates){
   assert.equal(gate.state,"PENDING");
   assert.equal(gate.evidenceQualified,false);
 }
 assert.equal(reservePolicy?.reserveNumberAuthorized,false);
 assert.equal(reservePolicy?.readReserveNumberAuthorized,false);
 assert.equal(reservePolicy?.authorizedReserveRows,null);
 assert.equal(reservePolicy?.authorizedReadReserveRows,null);
 assert.equal(dataMatrix?.p03?.qualifiedSameUtcDayPostFixMultiwriterGrantAndResultCount,0);
 assert.equal(dataMatrix?.p03?.realP0ProtectedAndP2P3DeferConfirmedFromThisMatrix,false);
 assert.equal(dataMatrix?.p05?.realOctoberD1ScoutKeysRead,0);
 assert.equal(dataMatrix?.p05?.realOctoberD1CensusKeysRead,0);
 assert.equal(dataMatrix?.p05?.physicalMissingKeys,"UNKNOWN");
 assert.equal(priorIntake?.supportingEvidence?.checksDocumented,15);
 assert.equal(priorIntake?.supportingEvidence?.checksTotal,38);
 return Object.freeze({
  disposition:"INTEGRATED_NEGATIVE_PHYSICAL_EVIDENCE_NO_PROMOTION",
  scope:"REMEDIATION_READONLY_OFFLINE_SOURCE_LEVEL",
  auditOwner:"AUDIT_LANE",correctionStatus:"HIGH_VERIFYING",
  originalCriteriaTraced:19,supportChecksDocumented:15,supportChecksTotal:38,
  observedRealGateRuns:witness.observedRealGateRuns,
  observedWriterClasses:witness.writerClasses,
  accountUsageBasis:"GRAPHQL_LOWER_BOUND_NOT_SPENDABLE_HEADROOM",
  cronFailureClassification:"INVOKED_EXECUTION_FAILED_D1_QUOTA",
  physicalGatesAccepted:0,physicalGatesTotal:5,
  physicalD1ReadAuthorized:false,physicalD1WriteAuthorized:false,
  physicalQuotaGrantConfirmed:false,
  blockers:Object.freeze([
   "P01_SYSTEM1_WRITE_RESERVE_NOT_AUTHORIZED",
   "P02_SYSTEM1_READ_RESERVE_NOT_AUTHORIZED",
   "P03_MULTIWRITER_REAL_GRANT_RESULT_CHAIN_MISSING",
   "P04_LATER_NORMAL_SYSTEM1_PERSISTENCE_NOT_VERIFIED",
   "P05_HOT_D1_36_AND_11843_NOT_RUN",
   "ACCOUNT_GRAPHQL_LAG_AND_HEADROOM_UNKNOWN",
   "AUDIT_INDEPENDENT_PHYSICAL_APPROVAL_PENDING",
  ]),
 });
}
