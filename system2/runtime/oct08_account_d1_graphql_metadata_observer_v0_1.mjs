// DATA_LANE Class A: observe Cloudflare ACCOUNT GraphQL counters, never D1 SQL.
// Strictly informational. Missing metrics or unverifiable reserves fail closed.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";

export const OCT08_D1_METADATA_LIMITS=Object.freeze({
 dailyRowsRead:5000000,dailyRowsWritten:100000,
 sample36LocalHardCap:35000,full11843LocalHardCap:150000,
 protectedDailyShadowMeasuredRowsRead:583256,
});
const isCount=n=>Number.isSafeInteger(n)&&n>=0;
const sha=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
export function parseOct08AccountD1GraphqlV0_1({payload,quotaDay}={}){
 assert.match(quotaDay||"",/^\d{4}-\d{2}-\d{2}$/,"UTC quota date required");
 assert.ok(payload&&typeof payload==="object","GRAPHQL_RESPONSE_MISSING");
 assert.ok(!Array.isArray(payload.errors)||payload.errors.length===0,
  "GRAPHQL_PARTIAL_OR_ERROR_RESPONSE");
 assert.ok(payload.errors===undefined||payload.errors===null||Array.isArray(payload.errors),
  "GRAPHQL_ERRORS_MALFORMED");
 const accounts=payload?.data?.viewer?.accounts;
 assert.ok(Array.isArray(accounts)&&accounts.length===1,
  "ACCOUNT_GRAPHQL_EXACT_ONE_ACCOUNT_REQUIRED");
 const groups=accounts[0]?.d1AnalyticsAdaptiveGroups;
 assert.ok(Array.isArray(groups)&&groups.length>0&&groups.length<10000,
  "ACCOUNT_GRAPHQL_GROUPS_ABSENT_EMPTY_OR_TRUNCATED");
 let rowsRead=0,rowsWritten=0;
 const seen=new Set(),normalized=[];
 for(const [index,group] of groups.entries()){
  const date=group?.dimensions?.date,databaseId=group?.dimensions?.databaseId;
  assert.equal(date,quotaDay,"ACCOUNT_GRAPHQL_WRONG_QUOTA_DAY_"+index);
  assert.ok(typeof databaseId==="string"&&databaseId.length>0,
   "ACCOUNT_GRAPHQL_DATABASE_ID_MISSING_"+index);
  assert.ok(!seen.has(databaseId),"ACCOUNT_GRAPHQL_DUPLICATE_DATABASE_GROUP_"+index);
  seen.add(databaseId);
  const read=group?.sum?.rowsRead,written=group?.sum?.rowsWritten;
  // A5 firewall: never use numeric fallback for a missing/NULL/NaN metric.
  assert.ok(isCount(read)&&isCount(written),
   "ACCOUNT_GRAPHQL_MISSING_OR_INVALID_READ_WRITE_COUNTER_"+index);
  assert.ok(Number.isSafeInteger(rowsRead+read)&&Number.isSafeInteger(rowsWritten+written),
   "ACCOUNT_GRAPHQL_AGGREGATE_COUNTER_OVERFLOW");
  rowsRead+=read;rowsWritten+=written;
  normalized.push({databaseId,date,rowsRead:read,rowsWritten:written});
 }
 normalized.sort((a,b)=>a.databaseId.localeCompare(b.databaseId));
 return Object.freeze({
  schemaVersion:"S2_OCT08_ACCOUNT_GRAPHQL_METADATA_STRICT_OBSERVATION_V0_1",
  quotaDay,source:"CLOUDFLARE_D1_GRAPHQL_ACCOUNT_ANALYTICS",
  usageSemantics:"ACCOUNT_DAILY_AGGREGATE_LOWER_BOUND",
  freshnessGuarantee:"NOT_DOCUMENTED_BY_VENDOR",
  databaseGroupCount:groups.length,
  rowsReadLowerBound:rowsRead,rowsWrittenLowerBound:rowsWritten,
  normalizedCounterDigest:sha(normalized),
 });
}
export function assessOct08D1ReadMetadataOnlyV0_1({
 observation,reservePolicy,observedAt,
}={}){
 assert.equal(observation?.schemaVersion,
  "S2_OCT08_ACCOUNT_GRAPHQL_METADATA_STRICT_OBSERVATION_V0_1");
 assert.ok(isCount(observation.rowsReadLowerBound)&&isCount(observation.rowsWrittenLowerBound));
 assert.ok(typeof observedAt==="string"&&Number.isFinite(Date.parse(observedAt)));
 assert.equal(observation.quotaDay,new Date(observedAt).toISOString().slice(0,10),
  "READ_USAGE_QUOTA_DAY_DRIFT");
 assert.equal(reservePolicy?.directiveId,"S2-CORR-20261007-003");
 const readReserveAuthorized=reservePolicy.readReserveNumberAuthorized===true&&
  isCount(reservePolicy.authorizedReadReserveRows);
 const writeReserveAuthorized=reservePolicy.reserveNumberAuthorized===true&&
  isCount(reservePolicy.authorizedReserveRows);
 // Pure diagnostics, NEVER a reservation, D1 read grant, or System1 reserve estimate.
 const protectedMeasured=OCT08_D1_METADATA_LIMITS.protectedDailyShadowMeasuredRowsRead;
 const budgetScenarios=[
  {probe:"36_KEY",localQueryHardCap:OCT08_D1_METADATA_LIMITS.sample36LocalHardCap},
  {probe:"11843_KEY",localQueryHardCap:OCT08_D1_METADATA_LIMITS.full11843LocalHardCap},
 ].map(x=>{
  const floorProjection=observation.rowsReadLowerBound+protectedMeasured+x.localQueryHardCap;
  return {...x,measuredProtectedP0ReadCost:protectedMeasured,
   indicativeLowerBoundProjection:floorProjection,
   exceedsPublishedDailyReadLimit:floorProjection>OCT08_D1_METADATA_LIMITS.dailyRowsRead,
   evidenceQualifiedHeadroom:false,physicalD1ReadAuthorized:false};
 });
 const reasons=[
  "GRAPHQL_ACCOUNT_USAGE_IS_LOWER_BOUND_NO_REALTIME_FRESHNESS_CERTIFICATE",
  "D1_RESERVATION_LEDGER_NOT_PHYSICALLY_RECONCILED_BY_METADATA_ONLY_AUDIT",
  ...(readReserveAuthorized?[]:["SYSTEM1_READ_RESERVE_NOT_EVIDENCE_AUTHORIZED"]),
  ...(writeReserveAuthorized?[]:["SYSTEM1_WRITE_RESERVE_NOT_EVIDENCE_AUTHORIZED"]),
  ...(budgetScenarios.some(x=>x.exceedsPublishedDailyReadLimit)?
   ["OBSERVED_READ_BUDGET_PROJECTION_EXCEEDS_DAILY_LIMIT"]:[]),
 ];
 return Object.freeze({
  schemaVersion:"S2_OCT08_ACCOUNT_D1_GRAPHQL_METADATA_ONLY_READINESS_V0_1",
  state:"OBSERVED_ACCOUNT_USAGE_ONLY_READ_HEADROOM_NOT_CERTIFIED",
  observedAt,quotaDay:observation.quotaDay,observation,
  sample36:budgetScenarios[0],full11843:budgetScenarios[1],
  system1ReadReserveAuthorized:readReserveAuthorized,
  system1ReadReserveRows:readReserveAuthorized?
   reservePolicy.authorizedReadReserveRows:null,
  system1WriteReserveAuthorized:writeReserveAuthorized,
  system1WriteReserveRows:writeReserveAuthorized?
   reservePolicy.authorizedReserveRows:null,
  ledgerComplete:false,accountReadHeadroomCertified:false,
  physicalD1ReadAuthorized:false,physicalD1WriteAuthorized:false,
  missingKeyCensusAccepted:false,originalPITCertified:false,
  noManualBooleanBecameApproval:true,reasonCodes:reasons,
  cloudflareGraphqlRequestsToProduceObservation:1,
  d1SqlQueriesByObserver:0,d1RowsReadByObserver:0,
  d1RowsWrittenByObserver:0,r2CallsByObserver:0,
  system1FormalRuntimeChanged:false,paidUpgradeAuthorized:false,
 });
}
