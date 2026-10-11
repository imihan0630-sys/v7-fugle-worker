// DATA_LANE #1068. Offline ONLY. No Cloudflare API/D1/R2, secrets, imports or Shadow.
// All PASS-shaped fixtures remain DOCUMENT_REVIEW_ONLY, never a physical audit grant.
import {createHash} from "node:crypto";
const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const sha=/^[0-9a-f]{64}$/;
const utc=s=>typeof s==="string"&&
 /^\d{4}-\d{2}-\d{2}T\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(s)&&
 Number.isFinite(Date.parse(s));
const validRef=s=>typeof s==="string"&&/^[A-Za-z0-9_:/@.|\-]{3,160}$/.test(s);
function failSet(xs){return [...new Set(xs)].sort();}
function pitAudit(evidence,blockers){
 const rows=evidence?.sourceVersions;
 if(!Array.isArray(rows)||!rows.length){
  blockers.push("PIT_REAL_SOURCE_VERSION_SET_MISSING");return {records:0,matched:0};
 }
 const seen=new Set();let valid=0;
 for(const x of rows){
  const id=x?.sourceRef;
  if(!validRef(id)||seen.has(id)){
   blockers.push("PIT_SOURCE_VERSION_DUPLICATE_OR_INVALID");continue;
  }seen.add(id);
  const clocks=[x.firstKnownAt,x.availableAt,x.observedAt,x.selectionCutAt];
  if(!clocks.every(utc)){
   blockers.push("PIT_VERSION_TIMESTAMPS_UNKNOWN");continue;
  }
  if(!validRef(x.sourceVersion)||!sha.test(x.sourceValueSha256||"")||
      x.sourceVersionPhysicalReadback!==true){
   blockers.push("PIT_SOURCE_VERSION_HASH_AND_PHYSICAL_LINEAGE_UNVERIFIED");continue;
  }
  // Conservative: observing a revision after a decision can never prove that
  // exact revision was available at its historic decision cut.
  const [first,available,observed,cut]=clocks.map(Date.parse);
  if(first>cut||available>cut||observed>cut){
   blockers.push("PIT_LOOKAHEAD_SOURCE_REVISION_AFTER_DECISION");continue;
  }
  if(x.pointInTimeEligible!==true||x.originalObservationCertified!==true){
   blockers.push("PIT_PROSPECTIVE_OBSERVATION_PROVENANCE_UNVERIFIED");continue;
  }
  valid++;
 }
 if(evidence?.fullSourceVersionInventoryPhysicallyReconciled!==true)
  blockers.push("PIT_FULL_REVISION_KEYSET_INCOMPLETE");
 return {records:rows.length,matched:valid,sourceRefs:seen};
}
function frozenAudit(evidence,pit,blockers){
 const rows=evidence?.frozenSnapshots;
 if(!Array.isArray(rows)||!rows.length){
  blockers.push("FROZEN_PHYSICAL_DECISION_ROWS_MISSING");return {records:0,matched:0};
 }
 // A snapshot is append-only only when the ENTIRE old prefix survives
 // unchanged. An independently observed older root is mandatory.
 const prior=evidence?.independentPriorAnchor;
 if(!Number.isSafeInteger(prior?.count)||prior.count<0||
    !sha.test(prior?.headHash||"")||!utc(prior?.observedAt)||prior?.auditAccepted!==true){
  blockers.push("FROZEN_INDEPENDENT_OLDER_PREFIX_ANCHOR_MISSING");
 }
 let last="0".repeat(64),n=0;const ids=new Set();let prefixOk=false;
 for(const s of rows){
  if(!Number.isSafeInteger(s?.sequence)||s.sequence!==n+1||
      !validRef(s?.snapshotId)||ids.has(s.snapshotId)||
      !utc(s.frozenAt)||!utc(s.decisionCutAt)||
      !sha.test(s.payloadSha256||"")||!sha.test(s.rawInputSha256||"")||
      !Array.isArray(s.sourceRefs)||!s.sourceRefs.length){
   blockers.push("FROZEN_DECISION_ROW_IDENTITY_INCOMPLETE");break;
  }
  ids.add(s.snapshotId);
  if(Date.parse(s.decisionCutAt)>Date.parse(s.frozenAt))
   blockers.push("FROZEN_DECISION_CUT_AFTER_FREEZE");
  if(s.sourceRefs.some(ref=>!pit.sourceRefs?.has(ref)))
   blockers.push("FROZEN_SOURCE_REVISION_NOT_PIT_VERIFIED");
  const expected=hash(["S2_ISSUE1068_FROZEN_CHAIN_V0_1",s.sequence,
   s.snapshotId,last,s.frozenAt,s.decisionCutAt,
   s.payloadSha256,s.rawInputSha256,s.sourceRefs]);
  if(s.prevChainHash!==last||s.chainHash!==expected){
   blockers.push("FROZEN_SNAPSHOT_CHAIN_HASH_MISMATCH");break;
  }
  last=expected;n++;
  if(n===prior?.count)prefixOk=last===prior.headHash;
 }
 if(prior?.count===0)prefixOk=prior.headHash==="0".repeat(64);
 if(!prefixOk)blockers.push("FROZEN_PREVIOUS_ACCEPTED_PREFIX_CHANGED");
 if(evidence?.physicalSourceDecisionCount!==rows.length||
    evidence?.sourceRowHashesRecomputedFromPhysicalBytes!==true||
    evidence?.originalFrozenPayloadPhysicalReadback!==true)
  blockers.push("FROZEN_PHYSICAL_ROW_COUNT_OR_BYTES_NOT_RECONCILED");
 return {records:rows.length,matched:n,headHash:last};
}
function physicalExportAudit(exportReceipt,attestation,blockers){
 if(!exportReceipt||attestation?.result!=="OFFLINE_DOCUMENT_REVIEW_ONLY"||
   attestation.blockers?.length){
  blockers.push("SOURCE_D1_PHYSICAL_SCHEMA_ROWS_TABLE_HASHES_NOT_ATTESTED");
  return {tableCount:0,totalRows:null};
 }
 if(!Array.isArray(exportReceipt.tables)||!exportReceipt.tables.length||
    exportReceipt.tables.some(x=>!Number.isSafeInteger(x.rows)||x.rows<0||
      !sha.test(x.sha256||"")||!sha.test(x.schemaSha256||""))){
  blockers.push("SOURCE_D1_PHYSICAL_TABLE_DIGEST_SET_INVALID");
  return {tableCount:0,totalRows:null};
 }
 const rows=exportReceipt.tables.reduce((s,x)=>s+x.rows,0);
 if(!Number.isSafeInteger(rows))blockers.push("SOURCE_D1_ROW_SUM_OVERFLOW");
 return {tableCount:exportReceipt.tables.length,totalRows:
   Number.isSafeInteger(rows)?rows:null};
}
function archiveAndR2Audit({backup,r2,source},blockers){
 if(backup?.restoreMode!=="ISOLATED_OFFLINE_RESTORE"||
    backup?.sourceDatabaseNeverMutated!==true||
    !sha.test(backup?.originalArchiveSha256||"")||
    backup?.originalArchiveSha256!==backup?.restoredArchiveSha256||
    backup?.restoreFullTableDigestEquality!==true||
    backup?.restoreSchemaDigestEquality!==true||
    backup?.restoreFrozenHashChainEquality!==true||
    !Number.isSafeInteger(backup?.restoreRunId)||
    !Number.isSafeInteger(backup?.restoreJobId)||
    !Number.isSafeInteger(backup?.restoreArtifactId)||
    !sha.test(backup?.restoreArtifactSha256||"")||
    backup?.independentRestorabilityAuditAccepted!==true)
   blockers.push("SOURCE_D1_BACKUP_RESTORE_PHYSICAL_BYTES_UNVERIFIED");
 const objects=r2?.objects;
 if(!Array.isArray(objects)||!r2?.fullSourceObjectInventoryPhysicallyComplete||
    objects.some(x=>!validRef(x?.key)||!Number.isSafeInteger(x?.bytes)||
      x.bytes<0||!sha.test(x?.byteSha256||"")||
      x.sourceObjectBytesActuallyHashed!==true)||
    new Set(objects?.map(x=>x.key)).size!==objects?.length)
   blockers.push("SOURCE_R2_ORIGINAL_OBJECT_CONTENT_HASHES_UNVERIFIED");
 if(source?.sourceR2MetadataOnly===true)
  blockers.push("SOURCE_R2_METADATA_CANNOT_PROVE_OBJECT_BYTES");
 return {r2Objects:Array.isArray(objects)?objects.length:null};
}
export function assessIssue1068SourceIntegrityOfflineV0_1({
 reservePolicy,sourceExport,sourceAttestation,pitEvidence,
 frozenEvidence,backupEvidence,r2Evidence,destinationEvidence,
}={}){
 const blockers=[];
 const reservesOk=reservePolicy?.reserveNumberAuthorized===true &&
   Number.isSafeInteger(reservePolicy.authorizedReserveRows)&&
   reservePolicy.authorizedReserveRows>0 &&
   reservePolicy.readReserveNumberAuthorized===true &&
   Number.isSafeInteger(reservePolicy.authorizedReadReserveRows)&&
   reservePolicy.authorizedReadReserveRows>0;
 if(!reservesOk)blockers.push("SYSTEM1_READ_WRITE_RESERVES_NOT_AUTHORIZED");
 if(sourceExport?.sourceReadBudget?.accountHeadroomCertified!==true||
    sourceExport?.sourceReadBudget?.system1ReadReserveVerified!==true||
    sourceExport?.sourceReadBudget?.readOnlyGuardPassed!==true)
  blockers.push("SOURCE_SAME_UTC_DAY_QUOTA_LAG_LEDGER_HEADROOM_NOT_VERIFIED");
 const source=physicalExportAudit(sourceExport,sourceAttestation,blockers);
 const pit=pitAudit(pitEvidence,blockers);
 const frozen=frozenAudit(frozenEvidence,pit,blockers);
 const archived=archiveAndR2Audit({
  backup:backupEvidence,r2:r2Evidence,source:sourceExport},blockers);
 if(sourceExport?.frozenDecisionRowCount!==frozen.records||
    sourceExport?.frozenSnapshotSha256!==frozen.headHash)
  blockers.push("FROZEN_CROSSCHECK_WITH_PHYSICAL_SOURCE_EXPORT_FAILED");
 if(destinationEvidence?.originalOwnerAuthorizedDataImport!==true||
    destinationEvidence?.independentDestinationTableContentAuditAccepted!==true||
    destinationEvidence?.sourceDestinationCanonicalTableDigestsEqual!==true||
    destinationEvidence?.sourceDestinationFrozenChainEqual!==true||
    destinationEvidence?.sourceDestinationR2ByteHashesEqual!==true)
  blockers.push("DESTINATION_DATA_READBACK_NOT_ACCEPTED");
 // This validator checks structured offline documents. It cannot authenticate
 // an actual Cloudflare run or immutable artifact, even if a JSON claims so.
 return Object.freeze({
  schemaVersion:"S2_ISSUE1068_SOURCE_PIT_FROZEN_RESTORE_REVIEW_V0_1",
  state:!reservesOk?"READ_ONLY_D1_BUDGET_EVIDENCE_DEFER":
    blockers.length?"PHYSICAL_EVIDENCE_INDEPENDENT_AUDIT_PENDING":
    "OFFLINE_SHAPE_REVIEW_ONLY_NEVER_PHYSICAL_AUTHORIZATION",
  blockers:failSet(blockers),
  sourcePhysicalTableReceipts:source.tableCount,
  sourcePhysicalRowsClaimed:source.totalRows,
  theoreticalMinimumDestinationQuotaDays:source.totalRows===null?null:
   Math.ceil(source.totalRows/100000),
  realAccountRowsReadHeadroom:"UNKNOWN",
  pitSourceVersionsExamined:pit.records,
  pitVersionsOfflineConsistent:pit.matched,
  frozenRowsExamined:frozen.records,
  frozenHashChainPrefixChecked:frozen.matched,
  sourceR2ObjectsClaimed:archived.r2Objects,
  physicalSourceD1ReadExecutedByThisAudit:0,
  physicalSourceD1WriteExecutedByThisAudit:0,
  r2ObjectReadExecutedByThisAudit:0,
  destinationDataWrittenByThisAudit:0,
  sourceD1BackupPhysicallyAccepted:false,
  pitPhysicallyAccepted:false,frozenPhysicallyAccepted:false,
  r2ContentPhysicallyAccepted:false,destinationReadbackAccepted:false,
  permissionToImport:false,shadowAuthorized:false,
  sourceSystem1FormalCoreTouched:false,paidTierAuthorized:false,
  independentAuditRequired:true,
 });
}
