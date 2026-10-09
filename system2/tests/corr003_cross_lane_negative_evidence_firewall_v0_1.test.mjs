import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {reconcileCorr003CrossLaneNegativeEvidenceV0_1 as reconcile}
 from "../runtime/corr003_cross_lane_negative_evidence_firewall_v0_1.mjs";
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const inputs={
 system1Producer:read("../../research/SYSTEM1_ISSUE1024_P01_P02_P04_REAL_GITHUB_D1_PRODUCER_EVIDENCE_20261009_V0_1.json"),
 system1CronSink:read("../../research/SYSTEM1_ISSUE1024_CRON_SINK_FAILURE_TRIANGULATION_20261009_V0_1.json"),
 dataMatrix:read("../evidence/S2_ISSUE1026_P03_REAL_MULTIWRITER_QUOTA_DEFER_MATRIX_20261009_V0_1.json"),
 dataMetadata:read("../evidence/S2_ISSUE1026_P03_P05_ACCOUNT_GRAPHQL_NONAUTHORIZING_REAL_RUN_20261009_V0_1.json"),
 registry:read("../config/d1_account_writer_registry_v0_1.json"),
 reservePolicy:read("../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json"),
 physicalAudit:read("../evidence/S2_CORR003_INDEPENDENT_PHYSICAL_CLOSURE_GATE_20261009_V0_1.json"),
 correctionQueue:read("../SYSTEM2_CORRECTION_QUEUE.json"),
 priorIntake:read("../evidence/S2_CORR003_P01_P05_PRODUCER_RECEIPT_RECONCILIATION_20261009_V0_1.json"),
};
const frozen=read("../evidence/S2_CORR003_CROSS_LANE_NEGATIVE_EVIDENCE_FIREWALL_20261009_V0_1.json");
const verdict=reconcile(inputs);
assert.deepEqual(verdict,frozen.verdict);
assert.equal(verdict.physicalGatesAccepted,0);
assert.equal(verdict.observedRealGateRuns,5);
assert.equal(verdict.observedWriterClasses,4);
assert.equal(verdict.originalCriteriaTraced,19);
assert.equal(verdict.cronFailureClassification,"INVOKED_EXECUTION_FAILED_D1_QUOTA");
assert.equal(verdict.accountUsageBasis,"GRAPHQL_LOWER_BOUND_NOT_SPENDABLE_HEADROOM");
assert.equal(verdict.physicalD1ReadAuthorized,false);
assert.equal(verdict.physicalD1WriteAuthorized,false);
assert.equal(verdict.physicalQuotaGrantConfirmed,false);
assert.equal(verdict.blockers.length,7);
assert.equal(frozen.readOnlyEvidenceOnly,true);
assert.equal(frozen.sourceBlobHashes.system1CronSink,"322348f3c0509d2aec56724dc85afeebf7b39f7d");
assert.equal(frozen.sourceBlobHashes.dataMatrix,"36b4f2f869603a4329d14243e08e248b9156532a");
const tamper=(field,fn)=>{const clone=structuredClone(inputs);fn(clone[field]);assert.throws(()=>reconcile(clone),undefined,field);};
tamper("system1CronSink",x=>x.negativeEvidenceLogic.canConcludeCronNotInvoked=true);
tamper("system1CronSink",x=>x.negativeEvidenceLogic.expectedFusionState="UNOBSERVED");
tamper("system1CronSink",x=>x.independentBusinessSideEffects.attempt.status="SUCCESS");
tamper("system1CronSink",x=>x.quotaAttribution.physicalRowsWrittenPer2355Or2335=133037);
tamper("system1Producer",x=>x.physicalQualification.readReserveAuthorized=true);
tamper("system1Producer",x=>x.businessPersistence.subsequentNaturallyScheduledHealthyRealBusinessPersisted=true);
tamper("dataMatrix",x=>x.observedRuns[0].gateState="QUOTA_RESERVATION_GRANTED");
tamper("dataMatrix",x=>x.p03.qualifiedSameUtcDayPostFixMultiwriterGrantAndResultCount=1);
tamper("dataMatrix",x=>x.accountMetadataObservation.rowsReadLowerBound=0);
tamper("dataMatrix",x=>x.p05.realOctoberD1ScoutKeysRead=36);
tamper("dataMetadata",x=>x.realAccountObservation.writeHeadroomProven=true);
tamper("dataMetadata",x=>x.realAccountObservation.analyticsLagGuarantee="REALTIME_CERTIFIED");
tamper("reservePolicy",x=>x.authorizedReserveRows=2825);
tamper("reservePolicy",x=>x.readReserveNumberAuthorized=true);
tamper("physicalAudit",x=>x.prerequisiteGates[2].evidenceQualified=true);
tamper("correctionQueue",x=>x.directives.find(d=>d.directiveId==="S2-CORR-20261007-003").status="VERIFIED_CLOSED");
tamper("priorIntake",x=>x.supportingEvidence.checksDocumented=38);
tamper("registry",x=>x.writers.find(w=>w.id==="DAILY_SHADOW_DIAGNOSTIC").priority="P2");
console.log("CORR003_CROSS_LANE_FIREWALL_PASS realGateRuns=5 cronFailed=true physical=0/5 adversarial=18 protected=true");
