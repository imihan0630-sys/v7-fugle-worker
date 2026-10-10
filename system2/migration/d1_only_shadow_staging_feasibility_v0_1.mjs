// Pure, offline-only Phase-1 suitability analysis. Never authorize provisioning or cutover.
export const S2_FREE_D1_SINGLE_DATABASE_LIMIT_BYTES = 500_000_000;
const SHA = /^[a-f0-9]{64}$/i;
const REQUIRED_SOURCE_D1 = "system2-research";
const EXPECTED_SOURCE_WORKER = "system2-shadow-research";
const EXPECTED_SOURCE_R2 = "system2-historical-research";
const REQUIRED_D1_BINDING = "SYSTEM2_DB";
const REQUIRED_R2_BINDING = "SYSTEM2_HISTORY_BUCKET";

function hasExactlyOne(items,pred) {return Array.isArray(items) && items.filter(pred).length===1}
function strings(items,key) {return (Array.isArray(items)?items:[]).map(x=>x?.[key]).filter(x=>typeof x==="string")}
function containsForbiddenName(x) {return x==="fugle-test" || x==="v7-live" || x==="V7_DB";}
function validPhysicalTimestamp(s) {return typeof s==="string"&&!Number.isNaN(Date.parse(s));}

export function assessD1OnlyShadowStagingV0_1({source,destination,sourceManifest,serviceReceipt}={}) {
 const reasons=[];
 if(!source || source.complete!==true||source.verifiedBy!=="CLOUDFLARE_READ_ONLY_API"||
    !validPhysicalTimestamp(source.verifiedAt)||source.r2BucketsVerified!==true)
   reasons.push("SOURCE_INVENTORY_NOT_FULLY_VERIFIED");
 if(!destination || destination.complete!==false ||
    destination.verifiedBy!=="CLOUDFLARE_READ_ONLY_API_PARTIAL"||
    destination.r2BucketsVerified!==false||destination.r2Status!=="NOT_ENTITLED"||
    !validPhysicalTimestamp(destination.verifiedAt))
   reasons.push("DESTINATION_PARTIAL_R2_ENTITLEMENT_UNVERIFIED");
 if(source?.accountFingerprint && destination?.accountFingerprint &&
    source.accountFingerprint===destination.accountFingerprint) reasons.push("ACCOUNT_COLLISION");
 if(!hasExactlyOne(source?.databases,x=>x.name===REQUIRED_SOURCE_D1))
   reasons.push("SOURCE_D1_MISSING_OR_AMBIGUOUS");
 if(!hasExactlyOne(source?.workers,x=>x.id===EXPECTED_SOURCE_WORKER))
   reasons.push("SOURCE_WORKER_MISSING_OR_AMBIGUOUS");
 if(!hasExactlyOne(source?.buckets,x=>x.name===EXPECTED_SOURCE_R2))
   reasons.push("SOURCE_R2_ARCHIVE_MISSING_OR_AMBIGUOUS");
 const bindings=source?.workers?.find(x=>x?.id===EXPECTED_SOURCE_WORKER)?.bindings;
 if(!hasExactlyOne(bindings,x=>x?.name===REQUIRED_D1_BINDING) ||
    !hasExactlyOne(bindings,x=>x?.name===REQUIRED_R2_BINDING) ||
    bindings?.some(x=>containsForbiddenName(x?.name)))
   reasons.push("SOURCE_WORKER_BINDINGS_UNVERIFIED_OR_FORMAL_BOUND");
 for(const category of ["databases","workers","kvNamespaces","crons"]) {
   if(!Array.isArray(destination?.[category]) || destination[category].length!==0)
     reasons.push("DESTINATION_"+category.toUpperCase()+"_NOT_EMPTY");
 }
 if(source?.databases?.some(x=>x?.name===REQUIRED_SOURCE_D1 && x.sizeBytes === undefined))
   reasons.push("SOURCE_D1_SIZE_UNVERIFIED");
 const db=source?.databases?.find(x=>x?.name===REQUIRED_SOURCE_D1);
 const size=Number.isSafeInteger(db?.sizeBytes)&&db.sizeBytes>=0 ? db.sizeBytes : null;
 if(size===null) reasons.push("SOURCE_D1_SIZE_UNKNOWN");
 else if(size>=S2_FREE_D1_SINGLE_DATABASE_LIMIT_BYTES) reasons.push("FREE_SINGLE_D1_CAP_EXCEEDED");
 if(serviceReceipt?.source?.role!=="SOURCE"||serviceReceipt?.destination?.role!=="DESTINATION")
   reasons.push("SERVICE_READ_RECEIPT_MISSING");
 else {
   const lookup=(item,name)=>item.services?.find(x=>x.service===name);
   if(!["D1","WORKERS","KV","R2"].every(n=>lookup(serviceReceipt.source,n)?.classification==="READ_GRANTED"))
     reasons.push("SOURCE_SERVICE_READ_NOT_VERIFIED");
   if(!["D1","WORKERS","KV"].every(n=>lookup(serviceReceipt.destination,n)?.classification==="READ_GRANTED"))
     reasons.push("DESTINATION_SERVICE_READ_NOT_VERIFIED");
   const r2=lookup(serviceReceipt.destination,"R2");
   if(r2?.classification!=="R2_ACCOUNT_NOT_ENTITLED"||r2.httpStatus!==403||r2.errorCode!==10042)
     reasons.push("DESTINATION_R2_NOT_ENTITLED_RECEIPT_MISSING");
 }
 // A source schema/row-level manifest cannot be fabricated from account metadata.
 const sourceDataManifestComplete=sourceManifest?.complete===true &&
   sourceManifest?.physicalReadback===true &&
   sourceManifest?.verifiedFrom==="SOURCE_READ_ONLY_EXPORT" &&
   SHA.test(sourceManifest?.schemaSha256||"")&&
   SHA.test(sourceManifest?.frozenSnapshotSha256||"")&&
   Array.isArray(sourceManifest?.tables)&&sourceManifest.tables.length>0;
 if(!sourceDataManifestComplete) reasons.push("SOURCE_TABLE_AND_FROZEN_MANIFEST_NOT_VERIFIED");
 // Even a perfect source manifest never gives permission to create or deploy.
 const capacityHeadroomBytes=size===null?null:Math.max(0,S2_FREE_D1_SINGLE_DATABASE_LIMIT_BYTES-size);
 const usedPercent=size===null?null:Math.round(1000*size/S2_FREE_D1_SINGLE_DATABASE_LIMIT_BYTES)/10;
 return Object.freeze({
   schemaVersion:"S2_D1_ONLY_STAGING_FEASIBILITY_V0_1",
   state:reasons.length?"EVIDENCE_GATED":"PHASE1_OFFLINE_CANDIDATE_ONLY",
   migrationReady:false,
   deployAuthorized:false,
   activateCronAuthorized:false,
   enableR2SubscriptionAuthorized:false,
   cloudResourcesCreated:false,
   physicalDataCopied:false,
   capacity:Object.freeze({
     sizeBytes:size,
     freeSingleDatabaseLimitBytes:S2_FREE_D1_SINGLE_DATABASE_LIMIT_BYTES,
     headroomBytes:capacityHeadroomBytes,
     usedPercent,
     fitByCurrentFileSizeOnly:size!==null && size<S2_FREE_D1_SINGLE_DATABASE_LIMIT_BYTES,
     note:"No allowance for import/index changes, quota, row counts or future data growth",
   }),
   sourceR2ArchiveRequired:true,
   destinationR2Available:false,
   phase1Scope:"D1_ONLY_STAGING_NO_R2_NO_CRON_NO_LIVE_WRITES",
   blockers:Object.freeze([...new Set(reasons)]),
 });
}
