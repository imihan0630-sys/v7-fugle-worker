// System2 M01/M02 post-SCHEMA-only target reconciliation, READ-ONLY / OFFLINE.
// This is NOT the pre-provision gate, a Cloudflare API client or deployment authority.
// Inputs are caller-supplied: even DESIGN_REVIEW_ONLY is never native provider proof.
import {assertD1OnlyDisabledStagingConfigV0_1} from "./d1_only_disabled_staging_config_v0_1.mjs";

export const POST_SCHEMA_D1_ONLY_STAGING_VERSION = "S2_POST_SCHEMA_D1_ONLY_STAGING_V0_1";
const HEX32=/^[a-f0-9]{32}$/i;
const SHA=/^[a-f0-9]{64}$/i;
const SCHEMA_DIGEST="f9bb690e481b78183ec225f450673a90aec5d3ee637f55da0fa4154584c58c3c";
const SCHEMA_PLAN="99a74747cbd3220afb84608c1ed8a9cf72e8eff71f2f23859227dbf7c56afe4f";
const isList=a=>Array.isArray(a);
const exactUTC=x=>typeof x==="string"&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(x)&&
  !Number.isNaN(Date.parse(x))&&new Date(x).toISOString()===(
    x.includes(".")?x:x.replace("Z",".000Z"));
const add=(a,code,okay)=>{if(!okay)a.push(code)};
const names=(arr,key)=>Array.isArray(arr)?arr.map(x=>typeof x==="string"?x:x?.[key]):[];

export function assessPostSchemaD1OnlyStagingV0_1({source,destination,expected,stagingConfig,schemaEvidence}={}) {
  const blockers=[];
  const sourceId=source?.accountId, destId=destination?.accountId;
  const expectedSourceId=expected?.sourceAccountId,expectedDestId=expected?.destinationAccountId;
  add(blockers,"ACCOUNT_IDENTITY_NOT_AUTHENTICATED",
    [sourceId,destId,expectedSourceId,expectedDestId].every(x=>typeof x==="string"&&HEX32.test(x)));
  if([sourceId,destId,expectedSourceId,expectedDestId].every(x=>typeof x==="string"&&HEX32.test(x))) {
    add(blockers,"ACCOUNT_IDENTITY_COLLISION",sourceId.toLowerCase()!==destId.toLowerCase());
    add(blockers,"ACCOUNT_TARGET_FINGERPRINT_MISMATCH",
      sourceId.toLowerCase()===expectedSourceId.toLowerCase()&&
      destId.toLowerCase()===expectedDestId.toLowerCase());
  }
  add(blockers,"SOURCE_READ_ONLY_TOPOLOGY_UNVERIFIED",
    source?.verifiedBy==="CLOUDFLARE_READ_ONLY_API"&&exactUTC(source?.observedAtUtc)&&
    source?.workerName==="system2-shadow-research"&&
    Number.isSafeInteger(source?.system2CronCount)&&source.system2CronCount===0&&
    source?.system1WorkerName==="fugle-test"&&source?.system1CronCount===4);
  add(blockers,"DESTINATION_READ_ONLY_TOPOLOGY_UNVERIFIED",
    destination?.verifiedBy==="CLOUDFLARE_READ_ONLY_API"&&exactUTC(destination?.observedAtUtc)&&
    isList(destination.databases)&&isList(destination.workers)&&
    isList(destination.crons)&&isList(destination.routes)&&isList(destination.kvNamespaces));
  if(isList(destination?.workers))
    add(blockers,"DESTINATION_WORKER_PREEXISTS_RECONCILIATION",
      destination.workers.length===0);
  if(isList(destination?.crons)&&isList(destination?.routes)&&isList(destination?.kvNamespaces))
    add(blockers,"DESTINATION_RUNTIME_MUST_REMAIN_EMPTY",
      destination.crons.length===0&&destination.routes.length===0&&destination.kvNamespaces.length===0);
  add(blockers,"DESTINATION_R2_ENTITLEMENT_UNRESOLVED_OR_ENABLED",
    destination?.r2Status==="NOT_ENTITLED"||destination?.r2Status==="ABSENT_VERIFIED");
  const dbs=isList(destination?.databases)?destination.databases:[];
  const exact=dbs.filter(db=>db?.name==="system2-research");
  const target=exact.length===1?exact[0]:null;
  add(blockers,"DESTINATION_D1_NOT_UNIQUELY_PRESENT",exact.length===1);
  add(blockers,"DESTINATION_D1_IDENTITY_NOT_MATCHED",
    !!target&&typeof target.id==="string"&&HEX32.test(target.id)&&
    HEX32.test(expected?.destinationD1Id||"")&&
    target.id.toLowerCase()===expected.destinationD1Id.toLowerCase()&&dbs.length===1);
  add(blockers,"APPROVED_SCHEMA_118_OBJECTS_OR_PLAN_NOT_MATCHED",
    schemaEvidence?.status==="PASS_CLOUDFLARE_DESTINATION_SCHEMA_ONLY_PHYSICAL_STAGE"&&
    schemaEvidence?.tables===55&&schemaEvidence?.indexes===63&&
    schemaEvidence?.schemaObjectDigestSha256===SCHEMA_DIGEST&&
    schemaEvidence?.approved125SqlPlanSha256===SCHEMA_PLAN&&
    Number.isSafeInteger(schemaEvidence?.nativeRunId)&&schemaEvidence.nativeRunId>0&&
    SHA.test(schemaEvidence?.originalArtifactSha256||""));
  let configValid=false;
  try {
    assertD1OnlyDisabledStagingConfigV0_1(stagingConfig);
    configValid=target?.id?.toLowerCase()===(
      stagingConfig.match(/^database_id = "([a-f0-9]{32})"$/im)?.[1]||"").toLowerCase();
  } catch {}
  add(blockers,"STAGING_WORKER_CONFIG_NOT_EXACT_DISABLED_TARGET",configValid);
  const unique=[...new Set(blockers)];
  return Object.freeze({
    version:POST_SCHEMA_D1_ONLY_STAGING_VERSION,
    phase:"EXISTING_DESTINATION_D1_POST_SCHEMA_ONLY",
    state:unique.length?"BLOCKED":"DESIGN_REVIEW_ONLY",
    blockers:Object.freeze(unique),
    expectedWorkerName:"system2-shadow-research-staging",
    expectedD1Binding:"SYSTEM2_DB",
    // Caller can forge source/dest observations. Only a separate independently
    // authenticated and time-bounded native audit may declare physical acceptance.
    callerSuppliedEvidenceOnly:true,
    cloudflareLiveReadbackByThisModule:false,
    schemaObjectBodiesRehashedByThisModule:false,
    sourceNoNewScheduledEventsVerified:false,
    destinationWorkerDeployed:false,
    httpHealthReadbackVerified:false,
    authorizedToMutate:false,
    authorizedToDeploy:false,
    cronCutoverAuthorized:false,
    nextGate:unique.length?"READ_ONLY_OR_OFFLINE_RECONCILIATION":
      "OWNER_APPROVAL_AND_INDEPENDENT_NATIVE_CLOUDFLARE_AUDIT"
  });
}
