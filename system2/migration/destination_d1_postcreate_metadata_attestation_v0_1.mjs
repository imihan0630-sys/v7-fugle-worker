// Compares independently produced sanitized GET-only Cloudflare inventories.
// It makes NO network calls, reads NO credentials and is NEVER a migration/deploy authority.
export const POST_CREATE_VERSION="S2_DESTINATION_D1_POSTCREATE_METADATA_ATTESTATION_V0_1";
const SHA=/^[a-f0-9]{64}$/i;
const TARGET_NAME="system2-research";
function validDate(x){return typeof x==="string"&&!Number.isNaN(Date.parse(x));}
function names(x,key="name"){return Array.isArray(x)?x.map(v=>v?.[key]).filter(v=>typeof v==="string").sort():null;}
function unique(x){return Array.isArray(x)&&new Set(x).size===x.length;}
function identical(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function knownInventory(v,kind){
  return v&&SHA.test(v.accountFingerprint||"")&&validDate(v.verifiedAt)&&
    Array.isArray(v.databases)&&Array.isArray(v.workers)&&
    Array.isArray(v.kvNamespaces)&&Array.isArray(v.crons)&&
    (kind==="source" ? v.complete===true&&v.verifiedBy==="CLOUDFLARE_READ_ONLY_API"&&
      Array.isArray(v.buckets)&&v.r2BucketsVerified===true:
    v.complete===false&&v.verifiedBy==="CLOUDFLARE_READ_ONLY_API_PARTIAL"&&
      v.r2BucketsVerified===false&&v.r2Status==="NOT_ENTITLED");
}
const sourceResources=v=>({
  databases:names(v?.databases),workers:names(v?.workers,"id"),
  kvNamespaces:names(v?.kvNamespaces),buckets:names(v?.buckets),
  crons:(Array.isArray(v?.crons)?v.crons.map(x=>String(x?.worker)+":"+String(x?.cron)).sort():null),
});
export function assessDestinationD1PostCreateV0_1({sourceBefore,destinationBefore,sourceAfter,destinationAfter,uiObservation}={}){
  const blockers=[];
  if(!knownInventory(sourceBefore,"source")||!knownInventory(sourceAfter,"source"))
    blockers.push("SOURCE_BEFORE_AFTER_API_METADATA_UNVERIFIED");
  if(!knownInventory(destinationBefore,"target")||!knownInventory(destinationAfter,"target"))
    blockers.push("DESTINATION_BEFORE_AFTER_API_METADATA_UNVERIFIED");
  if(![sourceBefore,destinationBefore,sourceAfter,destinationAfter].every(v=>validDate(v?.verifiedAt)))
    blockers.push("OBSERVATION_TIME_UNVERIFIED");
  else if(Date.parse(sourceAfter.verifiedAt)<=Date.parse(sourceBefore.verifiedAt)||
    Date.parse(destinationAfter.verifiedAt)<=Date.parse(destinationBefore.verifiedAt))
    blockers.push("POSTCREATE_API_INVENTORY_NOT_FRESH");
  if(!SHA.test(sourceBefore?.accountFingerprint||"")||!SHA.test(destinationBefore?.accountFingerprint||"")||
    sourceBefore?.accountFingerprint!==sourceAfter?.accountFingerprint||
    destinationBefore?.accountFingerprint!==destinationAfter?.accountFingerprint||
    sourceAfter?.accountFingerprint===destinationAfter?.accountFingerprint)
    blockers.push("ACCOUNT_FINGERPRINT_CHANGED_OR_COLLIDED");
  if(knownInventory(sourceBefore,"source")&&knownInventory(sourceAfter,"source")){
    const before=sourceResources(sourceBefore),after=sourceResources(sourceAfter);
    if(!identical(before,after))blockers.push("SOURCE_RESOURCE_SET_CHANGED_REQUIRES_REVIEW");
    if(!names(sourceAfter.databases).includes(TARGET_NAME) ||
      !names(sourceAfter.workers,"id").includes("fugle-test"))
      blockers.push("SOURCE_FORMAL_OR_S2_RESOURCES_MISSING");
  }
  if(!Array.isArray(destinationBefore?.databases)||destinationBefore.databases.length!==0||
     !Array.isArray(destinationBefore?.workers)||destinationBefore.workers.length!==0||
     !Array.isArray(destinationBefore?.kvNamespaces)||destinationBefore.kvNamespaces.length!==0||
     !Array.isArray(destinationBefore?.crons)||destinationBefore.crons.length!==0)
    blockers.push("DESTINATION_BASELINE_NOT_EMPTY");
  if(!Array.isArray(destinationAfter?.databases)||destinationAfter.databases.length!==1||
      destinationAfter.databases[0]?.name!==TARGET_NAME||
      !SHA.test(destinationAfter.databases[0]?.idFingerprint||""))
    blockers.push("DESTINATION_EXPECTED_SINGLE_D1_NOT_ATTESTED");
  if(!Array.isArray(destinationAfter?.workers)||destinationAfter.workers.length!==0||
     !Array.isArray(destinationAfter?.kvNamespaces)||destinationAfter.kvNamespaces.length!==0||
     !Array.isArray(destinationAfter?.crons)||destinationAfter.crons.length!==0)
    blockers.push("DESTINATION_RUNTIME_KV_OR_CRON_UNEXPECTED");
  const sourceD1=sourceAfter?.databases?.find(x=>x.name===TARGET_NAME);
  const targetD1=destinationAfter?.databases?.find(x=>x.name===TARGET_NAME);
  if(SHA.test(sourceD1?.idFingerprint||"")&&SHA.test(targetD1?.idFingerprint||"")&&
    sourceD1.idFingerprint===targetD1.idFingerprint)
    blockers.push("SOURCE_AND_DESTINATION_DATABASE_ID_COLLISION");
  if(!uiObservation||uiObservation.evidenceType!=="OWNER_SUPPLIED_CLOUDFLARE_UI_SCREENSHOT"||
    uiObservation.tableCount!==0||uiObservation.rowsRead!==0||
    uiObservation.rowsWritten!==0||uiObservation.storageDisplay!=="12.29 kB"||
    !validDate(uiObservation.observedAt))
    blockers.push("UI_EMPTY_DATABASE_OBSERVATION_MISSING_OR_DIFFERENT");
  const ok=blockers.length===0;
  return Object.freeze({
    version:POST_CREATE_VERSION,
    result:ok?"API_RESOURCE_READBACK_PASS_TABLES_UI_ONLY":"EVIDENCE_GATED",
    blockers:Object.freeze([...new Set(blockers)]),
    sourceTargetIdentityVerified:ok,
    destinationD1CountApiVerified:ok?1:null,
    destinationD1NameApiVerified:ok?TARGET_NAME:null,
    destinationDbIdentityFingerprint:ok?targetD1.idFingerprint:null,
    destinationD1SizeBytesApiVerified:ok&&Number.isSafeInteger(targetD1?.sizeBytes)?targetD1.sizeBytes:null,
    destZeroTablesProof:"OWNER_UI_ONLY_NOT_API_SQL",
    destinationTablesSqlVerified:false,
    sourceFrozenBackupVerified:false,
    ownerUiObservedTables:uiObservation?.tableCount??null,
    sourceDataRowsMigrated:0,
    physicalMigrationAccepted:false,
    cloudWritesAuthorized:false,
    cloudReadsPerformedByThisModule:0,
    workerDeployAuthorized:false,
    enableCronAuthorized:false,
    sourceFormalChangedByThisModule:false,
    physicalAuditRequired:true,
  });
}
