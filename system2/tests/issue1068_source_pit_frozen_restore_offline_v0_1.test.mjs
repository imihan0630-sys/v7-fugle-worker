import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {assessIssue1068SourceIntegrityOfflineV0_1 as audit}
 from "../migration/issue1068_source_pit_frozen_restore_offline_v0_1.mjs";
const h=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const sha="a".repeat(64),shb="b".repeat(64);
const frozenAt="2026-10-10T06:00:00Z",cut="2026-10-10T05:00:00Z";
function fixture(){
 const data={sequence:1,snapshotId:"SHADOW-1",frozenAt,decisionCutAt:cut,
  payloadSha256:sha,rawInputSha256:shb,sourceRefs:["ABC-REV"],
  prevChainHash:"0".repeat(64)};
 const expected=h(["S2_ISSUE1068_FROZEN_CHAIN_V0_1",1,"SHADOW-1",
  "0".repeat(64),frozenAt,cut,sha,shb,["ABC-REV"]]);
 data.chainHash=expected;
 return {
  reservePolicy:{reserveNumberAuthorized:true,authorizedReserveRows:4000,
   readReserveNumberAuthorized:true,authorizedReadReserveRows:100000},
  sourceExport:{sourceReadBudget:{accountHeadroomCertified:true,
   system1ReadReserveVerified:true,readOnlyGuardPassed:true},
   tables:[{name:"s2_decisions",rows:1,sha256:sha,schemaSha256:shb}],
   frozenDecisionRowCount:1,frozenSnapshotSha256:expected},
  sourceAttestation:{result:"OFFLINE_DOCUMENT_REVIEW_ONLY",blockers:[]},
  pitEvidence:{fullSourceVersionInventoryPhysicallyReconciled:true,
   sourceVersions:[{sourceRef:"ABC-REV",sourceVersion:"REV-1",sourceValueSha256:sha,
    firstKnownAt:"2026-10-10T01:00:00Z",availableAt:"2026-10-10T02:00:00Z",
    observedAt:"2026-10-10T03:00:00Z",selectionCutAt:cut,
    sourceVersionPhysicalReadback:true,pointInTimeEligible:true,
    originalObservationCertified:true}]},
  frozenEvidence:{frozenSnapshots:[data],
   independentPriorAnchor:{count:0,headHash:"0".repeat(64),
    observedAt:"2026-10-09T01:00:00Z",auditAccepted:true},
   physicalSourceDecisionCount:1,sourceRowHashesRecomputedFromPhysicalBytes:true,
   originalFrozenPayloadPhysicalReadback:true},
  backupEvidence:{restoreMode:"ISOLATED_OFFLINE_RESTORE",sourceDatabaseNeverMutated:true,
   originalArchiveSha256:sha,restoredArchiveSha256:sha,
   restoreFullTableDigestEquality:true,restoreSchemaDigestEquality:true,
   restoreFrozenHashChainEquality:true,restoreRunId:38100000001,
   restoreJobId:114000000001,restoreArtifactId:11600000001,
   restoreArtifactSha256:shb,independentRestorabilityAuditAccepted:true},
  r2Evidence:{fullSourceObjectInventoryPhysicallyComplete:true,
   objects:[{key:"cold/2024-01",bytes:123,byteSha256:sha,
    sourceObjectBytesActuallyHashed:true}]},
  destinationEvidence:{originalOwnerAuthorizedDataImport:true,
   independentDestinationTableContentAuditAccepted:true,
   sourceDestinationCanonicalTableDigestsEqual:true,
   sourceDestinationFrozenChainEqual:true,
   sourceDestinationR2ByteHashesEqual:true},
 };
}
const noInput=audit();
assert.equal(noInput.state,"READ_ONLY_D1_BUDGET_EVIDENCE_DEFER");
assert(noInput.blockers.includes("SYSTEM1_READ_WRITE_RESERVES_NOT_AUTHORIZED"));
assert(noInput.blockers.includes("SOURCE_D1_BACKUP_RESTORE_PHYSICAL_BYTES_UNVERIFIED"));
assert.equal(noInput.realAccountRowsReadHeadroom,"UNKNOWN");
assert.equal(noInput.shadowAuthorized,false);
const x=audit(fixture());
assert.equal(x.state,"OFFLINE_SHAPE_REVIEW_ONLY_NEVER_PHYSICAL_AUTHORIZATION");
assert.deepEqual(x.blockers,[]);
assert.equal(x.sourcePhysicalRowsClaimed,1);
assert.equal(x.theoreticalMinimumDestinationQuotaDays,1);
assert.equal(x.frozenHashChainPrefixChecked,1);
assert.equal(x.pitVersionsOfflineConsistent,1);
for(const gate of ["sourceD1BackupPhysicallyAccepted","pitPhysicallyAccepted",
 "frozenPhysicallyAccepted","r2ContentPhysicallyAccepted",
 "destinationReadbackAccepted","permissionToImport","shadowAuthorized",
 "paidTierAuthorized"])assert.equal(x[gate],false,gate);
const cases=[
 ["source read reserve unknown",v=>v.reservePolicy.readReserveNumberAuthorized=false,
  "SYSTEM1_READ_WRITE_RESERVES_NOT_AUTHORIZED"],
 ["source write reserve unknown",v=>v.reservePolicy.reserveNumberAuthorized=false,
  "SYSTEM1_READ_WRITE_RESERVES_NOT_AUTHORIZED"],
 ["source budget fake",v=>v.sourceExport.sourceReadBudget.accountHeadroomCertified=false,
  "SOURCE_SAME_UTC_DAY_QUOTA_LAG_LEDGER_HEADROOM_NOT_VERIFIED"],
 ["schema-only",v=>v.sourceAttestation.result="EVIDENCE_BLOCKED",
  "SOURCE_D1_PHYSICAL_SCHEMA_ROWS_TABLE_HASHES_NOT_ATTESTED"],
 ["physical row count negative",v=>v.sourceExport.tables[0].rows=-1,
  "SOURCE_D1_PHYSICAL_TABLE_DIGEST_SET_INVALID"],
 ["missing PIT version",v=>v.pitEvidence.sourceVersions=[],
  "PIT_REAL_SOURCE_VERSION_SET_MISSING"],
 ["future firstKnownAt",v=>v.pitEvidence.sourceVersions[0].firstKnownAt="2026-10-10T05:01:00Z",
  "PIT_LOOKAHEAD_SOURCE_REVISION_AFTER_DECISION"],
 ["future availableAt",v=>v.pitEvidence.sourceVersions[0].availableAt="2026-10-10T05:01:00Z",
  "PIT_LOOKAHEAD_SOURCE_REVISION_AFTER_DECISION"],
 ["future observedAt",v=>v.pitEvidence.sourceVersions[0].observedAt="2026-10-10T05:01:00Z",
  "PIT_LOOKAHEAD_SOURCE_REVISION_AFTER_DECISION"],
 ["missing source version hash",v=>v.pitEvidence.sourceVersions[0].sourceValueSha256=null,
  "PIT_SOURCE_VERSION_HASH_AND_PHYSICAL_LINEAGE_UNVERIFIED"],
 ["retrospective observation",v=>v.pitEvidence.sourceVersions[0].originalObservationCertified=false,
  "PIT_PROSPECTIVE_OBSERVATION_PROVENANCE_UNVERIFIED"],
 ["incomplete PIT revisions",v=>v.pitEvidence.fullSourceVersionInventoryPhysicallyReconciled=false,
  "PIT_FULL_REVISION_KEYSET_INCOMPLETE"],
 ["bad frozen chain",v=>v.frozenEvidence.frozenSnapshots[0].chainHash=sha,
  "FROZEN_SNAPSHOT_CHAIN_HASH_MISMATCH"],
 ["bad older anchor",v=>v.frozenEvidence.independentPriorAnchor.headHash=sha,
  "FROZEN_PREVIOUS_ACCEPTED_PREFIX_CHANGED"],
 ["missing original freeze",v=>v.frozenEvidence.originalFrozenPayloadPhysicalReadback=false,
  "FROZEN_PHYSICAL_ROW_COUNT_OR_BYTES_NOT_RECONCILED"],
 ["decision source not PIT",v=>v.frozenEvidence.frozenSnapshots[0].sourceRefs=["NONEXIST"],
  "FROZEN_SOURCE_REVISION_NOT_PIT_VERIFIED"],
 ["source physical chain disagreement",v=>v.sourceExport.frozenSnapshotSha256=sha,
  "FROZEN_CROSSCHECK_WITH_PHYSICAL_SOURCE_EXPORT_FAILED"],
 ["altered backup content",v=>v.backupEvidence.restoredArchiveSha256=shb,
  "SOURCE_D1_BACKUP_RESTORE_PHYSICAL_BYTES_UNVERIFIED"],
 ["no independent restore",v=>v.backupEvidence.independentRestorabilityAuditAccepted=false,
  "SOURCE_D1_BACKUP_RESTORE_PHYSICAL_BYTES_UNVERIFIED"],
 ["R2 metadata only",v=>v.sourceExport.sourceR2MetadataOnly=true,
  "SOURCE_R2_METADATA_CANNOT_PROVE_OBJECT_BYTES"],
 ["R2 object hash missing",v=>v.r2Evidence.objects[0].byteSha256=null,
  "SOURCE_R2_ORIGINAL_OBJECT_CONTENT_HASHES_UNVERIFIED"],
 ["R2 incomplete",v=>v.r2Evidence.fullSourceObjectInventoryPhysicallyComplete=false,
  "SOURCE_R2_ORIGINAL_OBJECT_CONTENT_HASHES_UNVERIFIED"],
 ["no destination readback",v=>v.destinationEvidence.independentDestinationTableContentAuditAccepted=false,
  "DESTINATION_DATA_READBACK_NOT_ACCEPTED"],
 ["forbidden future cut",v=>v.frozenEvidence.frozenSnapshots[0].decisionCutAt=
  "2026-10-10T07:00:00Z","FROZEN_DECISION_CUT_AFTER_FREEZE"],
];
for(const [name,mutate,blocked] of cases){
 const v=fixture();mutate(v);
 const z=audit(v);
 assert(z.blockers.includes(blocked),name+": "+JSON.stringify(z.blockers));
 assert.equal(z.permissionToImport,false,name);
 assert.equal(z.shadowAuthorized,false,name);
 assert.equal(z.sourceD1BackupPhysicallyAccepted,false,name);
}
console.log("ISSUE1068_SOURCE_PIT_FROZEN_RESTORE_GATE 1 no-receipt + 1 shape + 24 adversarial PASS, PHYSICAL_NOT_ACCEPTED");
