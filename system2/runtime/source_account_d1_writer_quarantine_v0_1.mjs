// Safety-only reservation gate for pre-migration System2 GitHub writers.
// This cannot change System1 Worker/Cron or remotely suspend a deployed
// System2 Worker Cron; it blocks new grants via the shared GitHub quota gate.
export const SOURCE_QUARANTINE_SCHEMA="S2_SOURCE_ACCOUNT_D1_WRITER_QUARANTINE_V0_1";
export function decideSourceAccountWriterQuarantineV0_1({policy,mode,writerId}={}) {
  if(!policy || typeof policy!=="object" ||
     policy.schemaVersion!==SOURCE_QUARANTINE_SCHEMA ||
     policy.active!==true || policy.denyNewPhysicalD1Reservations!==true ||
     policy.automaticRelease!==false)
    throw new Error("SOURCE_ACCOUNT_QUARANTINE_POLICY_MISSING_OR_NOT_ACTIVE");
  if(!["reserve","result"].includes(mode))throw new Error("SOURCE_QUARANTINE_MODE_INVALID");
  if(typeof writerId!=="string" || !/^[A-Z0-9_]{3,80}$/.test(writerId))
    throw new Error("SOURCE_QUARANTINE_WRITER_ID_INVALID");
  return Object.freeze({
    shouldDefer:mode==="reserve",
    state:mode==="reserve"?"QUOTA_BUDGET_DEFER":"RESULT_RECONCILIATION_ONLY",
    reasonCodes:mode==="reserve"?Object.freeze(["SOURCE_ACCOUNT_SYSTEM1_V8_PROTECTION_QUARANTINE"]):Object.freeze([]),
    physicalAllowed:false,
    sourceAccountQuotaUnknown:true,
    sourceUsageGraphqlQueried:false,
    sourceD1SqlRead:false,
    sourceD1SqlWrite:false,
    destinationDataMigrationAccepted:false,
    system1FormalCoreChanged:false,
    noPaidUpgrade:true
  });
}
