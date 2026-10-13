// BUILD 00 support for #1128 G4: D1-only physical post-copy parity review.
// Pure function: NO Cloudflare clients, NO SQL, NO filesystem, NO secrets.
// DATA_LANE provides original source export + independent destination readback.
// AUDIT_LANE alone adjudicates original artifacts, PIT and full migration.
// It must never silently demand R2 entitlement just to compare D1, and must
// never call partial D1 parity "SYSTEM2_FULL_MIGRATION_PASS".
const SHA=/^[a-f0-9]{64}$/i;
const NAME=/^s2_[a-z][a-z0-9_]*$/;
const UTC=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const MANDATORY=Object.freeze(["s2_schema_meta","s2_decisions","s2_historical_a1_bars"]);
const validUTC=s=>typeof s==="string"&&UTC.test(s)&&Number.isFinite(Date.parse(s));
const nonNeg=n=>Number.isSafeInteger(n)&&n>=0;
const positive=n=>Number.isSafeInteger(n)&&n>0;
const summary=(source,destination,sMap,dMap)=>Object.freeze({
  sourcePhysicalTableCount:sMap.size,
  destinationPhysicalTableCount:dMap.size,
  sourceRowSum:[...sMap.values()].reduce((a,v)=>a+BigInt(nonNeg(v?.rows)?v.rows:0),0n).toString(),
  destinationRowSum:[...dMap.values()].reduce((a,v)=>a+BigInt(nonNeg(v?.rows)?v.rows:0),0n).toString(),
  sourceFrozenDecisionCount:nonNeg(source?.frozenDecisionRowCount)?source.frozenDecisionRowCount:null,
  destinationFrozenDecisionCount:nonNeg(destination?.frozenDecisionRowCount)?destination.frozenDecisionRowCount:null,
});
function tableMap(receipt,role,blockers){
 const result=new Map();
 if(!Array.isArray(receipt?.tables)||receipt.tables.length===0){
   blockers.push(role+"_PHYSICAL_TABLE_LIST_MISSING");return result;
 }
 for(const t of receipt.tables){
  if(!NAME.test(t?.name||"")||!nonNeg(t?.rows)||
     !SHA.test(t?.sha256||"")||!SHA.test(t?.schemaSha256||"")||
     result.has(t.name)){
     blockers.push(role+"_PHYSICAL_TABLE_IDENTITY_OR_HASH_INVALID");
     continue;
  }
  result.set(t.name,t);
 }
 for(const name of MANDATORY){
   if(!result.has(name))blockers.push(role+"_REQUIRED_TABLE_ABSENT:"+name);
 }
 return result;
}
function evidenceValid(value,role,blockers){
 if(!value||value.databaseName!=="system2-research"||
     value.physicalReadback!==true||
     value.verifiedFrom!==(role==="SOURCE"?"SOURCE_D1_PHYSICAL_READ_ONLY_EXPORT":"DESTINATION_D1_PHYSICAL_READBACK")||
     !validUTC(value.observedAtUtc)||
     !positive(value.runId)||!positive(value.artifactId)||
     !SHA.test(value.originalArtifactSha256||"")||
     !SHA.test(value.schemaSha256||"")||
     !SHA.test(value.frozenSnapshotSha256||"")||
     !(role==="SOURCE"?SHA.test(value.exportSha256||""):SHA.test(value.importSourceExportSha256||""))||
     !SHA.test(value.accountFingerprint||"")||
     !SHA.test(value.databaseFingerprint||"")||
     value.originalArtifactDownloadedAndShaVerified!==true){
     blockers.push(role+"_ORIGINAL_PROVIDER_ARTIFACT_AND_D1_PHYSICAL_EVIDENCE_MISSING");
 }
 if(value?.r2Copied===true&&role==="DESTINATION"){
   blockers.push("DESTINATION_R2_CLAIM_MUST_BE_ADJUDICATED_SEPARATELY");
 }
 if(!nonNeg(value?.frozenDecisionRowCount)||
     value?.frozenSnapshotPhysicalReadback!==true){
   blockers.push(role+"_FROZEN_DECISION_PHYSICAL_READBACK_MISSING");
 }
 if(value?.pit?.physicalLineageReadback!==true||
    !SHA.test(value?.pit?.lineageSha256||"")||
    value?.pit?.firstKnownAtAvailableAtVerified!==true)
   blockers.push(role+"_PIT_LINEAGE_EVIDENCE_MISSING");
}
export function reviewSystem2D1OnlyPostCopyV0_1({source,destination}={}){
 const blockers=[];
 evidenceValid(source,"SOURCE",blockers);
 evidenceValid(destination,"DESTINATION",blockers);
 const sMap=tableMap(source,"SOURCE",blockers);
 const dMap=tableMap(destination,"DESTINATION",blockers);
 if(SHA.test(source?.accountFingerprint||"")&&
    source.accountFingerprint===destination?.accountFingerprint)
  blockers.push("SOURCE_DESTINATION_ACCOUNT_COLLISION");
 if(SHA.test(source?.databaseFingerprint||"")&&
    source.databaseFingerprint===destination?.databaseFingerprint)
  blockers.push("SOURCE_DESTINATION_D1_PHYSICAL_IDENTITY_COLLISION");
 if(validUTC(source?.observedAtUtc)&&validUTC(destination?.observedAtUtc)&&
    Date.parse(destination.observedAtUtc)<Date.parse(source.observedAtUtc))
  blockers.push("DESTINATION_READBACK_EARLIER_THAN_SOURCE_EXPORT");
 if(source?.schemaSha256!==destination?.schemaSha256)
  blockers.push("D1_PHYSICAL_SCHEMA_HASH_MISMATCH");
 // The SOURCE dump SHA is a transport artifact digest, not the SHA of a
 // separately serialized destination SQL dump. The destination readback must
 // attest which exact source export it imported, while physical table contents
 // are checked independently below (rows + canonical table hashes).
 if(source?.exportSha256!==destination?.importSourceExportSha256)
  blockers.push("D1_DESTINATION_IMPORTED_SOURCE_EXPORT_IDENTITY_MISMATCH");
 if(source?.frozenSnapshotSha256!==destination?.frozenSnapshotSha256)
  blockers.push("D1_FROZEN_SNAPSHOT_ROOT_HASH_MISMATCH");
 if(source?.pit?.lineageSha256!==destination?.pit?.lineageSha256)
  blockers.push("PIT_LINEAGE_ROOT_HASH_MISMATCH");
 if(source?.frozenDecisionRowCount!==destination?.frozenDecisionRowCount)
  blockers.push("FROZEN_DECISION_ROW_COUNT_MISMATCH");
 if(sMap.get("s2_decisions")?.rows!==source?.frozenDecisionRowCount ||
    dMap.get("s2_decisions")?.rows!==destination?.frozenDecisionRowCount)
  blockers.push("FROZEN_DECISION_COUNT_VS_PHYSICAL_TABLE_MISMATCH");
 if(sMap.size!==dMap.size)blockers.push("D1_S2_TABLE_COUNT_MISMATCH");
 for(const [name,row] of sMap){
   const other=dMap.get(name);
   if(!other)blockers.push("D1_TABLE_NOT_COPIED:"+name);
   else if(row.rows!==other.rows||row.sha256!==other.sha256||row.schemaSha256!==other.schemaSha256)
     blockers.push("D1_TABLE_PHYSICAL_COUNT_OR_HASH_MISMATCH:"+name);
 }
 for(const name of dMap.keys())if(!sMap.has(name))blockers.push("D1_UNEXPECTED_DESTINATION_TABLE:"+name);
 const counts=summary(source,destination,sMap,dMap);
 const reasons=Object.freeze([...new Set(blockers)].sort());
 return Object.freeze({
   schemaVersion:"S2_BUILD00_D1_ONLY_POSTCOPY_READBACK_V0_1",
   state:reasons.length?"BLOCKED":"D1_PARITY_MATCHED_PENDING_INDEPENDENT_AUDIT",
   scope:"SOURCE_TO_DESTINATION_SYSTEM2_D1_ONLY",
   blockers:reasons,counts,
   // Never equate a D1-only receipt to a complete System2 migration.
   r2ObjectsCompared:false,r2HistoricalMigrationAccepted:false,
   workerDestinationPhysicallyProven:false,cronSwitchoverProven:false,
   noDualWriterPhysicallyProven:false,system1ProtectedQuotaAccepted:false,
   prospectiveSelectionAvailable:false,entireMigrationPassed:false,
   independentAuditCompletedByThisCode:false,
   permissionToRunCloudflareSql:false,permissionToImport:false,
   permissionToDeployWorker:false,permissionToEnableCron:false,
   permissionToCutover:false,sourceDBModified:false,destinationDBModified:false,
   originalArtifactAuthenticityIndependentlyVerifiedByThisCode:false,
 });
}
