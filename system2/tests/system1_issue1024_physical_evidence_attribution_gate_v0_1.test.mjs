import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {inspectS1Issue1024PhysicalEvidenceV0_1 as inspect}
  from "../../research/system1_issue1024_physical_evidence_attribution_gate_v0_1.mjs";

const prior=JSON.parse(readFileSync(new URL(
  "../../research/SYSTEM1_ISSUE1024_P01_P02_P04_REAL_GITHUB_D1_PRODUCER_EVIDENCE_20261009_V0_1.json",
  import.meta.url,
),"utf8"));
const source=prior.primarySources[0];
const healthyClock=prior.directRealCronRows[0];
const observedWholeDay=prior.accountUsageObservations[0];
const actual=inspect({
 marketDate:"2026-09-21",
 execution:{primary:{
   event:"OBSERVED_CRON_ROW_NOT_INDEPENDENT_BUSINESS_PROOF",
   scheduledAtUtc:healthyClock.utcScheduledAt,source,
   businessResult:healthyClock.status,skipped:false,
 },recovery:{state:"UNKNOWN"}},
 d1Costs:{wholeDayV7Db:{
   rowsWritten:observedWholeDay.V7_DB.rowsWritten,
   rowsRead:observedWholeDay.V7_DB.rowsRead,source,
 }},
});
assert.equal(actual.wholeDayV7DbObservedOnly.rowsWritten,2825);
assert.equal(actual.wholeDayV7DbObservedOnly.rowsRead,133037);
assert.equal(actual.actualOperationCostKnown.primaryRowsWritten,null);
assert.equal(actual.actualOperationCostKnown.primaryRowsRead,null);
assert.equal(actual.p01.independentlyAccepted,false);
assert.equal(actual.p02.independentlyAccepted,false);
assert.equal(actual.p04.independentlyAccepted,false);
assert.ok(actual.p01.missing.includes("EXACT_PRIMARY_D1_ROWS_WRITTEN_UNKNOWN"));
assert.ok(actual.p02.missing.includes("EXACT_PRIMARY_D1_ROWS_READ_UNKNOWN"));
assert.ok(actual.p04.missing.includes("NORMAL_SCAN_KV_SNAPSHOT_NOT_READBACK_VERIFIED"));

const s={runId:37694052477,jobId:113041122665,
  headSha:"6b56ed6421e21c77c6d7d83e3751c97f8d0f3667",artifactId:11514945619};
const day="2026-10-12";
const metric={measurementScope:"ACTUAL_OPERATION_D1_META",
  rowsWritten:52,rowsRead:915,
  utcQuotaDay:day,source:s,
  actualProviderMetaObserved:true,
  queryAndIndexAmplificationAccounted:true,
  retryAndPartialAttemptsAccounted:true};
const full={
 marketDate:day,
 officialTradingSession:{
   date:day,source:"TWSE_OFFICIAL_CALENDAR",isOrdinarySession:true,
 },
 execution:{
   primary:{event:"NATURAL_CRON",scheduledAtUtc:"2026-10-12T15:35:30Z",
     source:s,businessResult:"SUCCESS",skipped:false},
   recovery:{state:"NOT_INVOKED_PROVEN",
     absenceWindowReadbackVerified:true,source:s},
 },
 d1Costs:{primary:metric,wholeDayV7Db:{rowsWritten:800,rowsRead:2200,source:s}},
 account:{quotaCollisionObserved:false,utcQuotaDay:day,source:s,
   graphqlLagAssessed:true,sameDayAllWriterUsageReconciled:true},
 business:{
   source:s,scanDate:day,dryRun:false,lastScanAttemptStatus:"SUCCESS",
   pipelineComplete:true,latestAfterMarketScanKvReadbackVerified:true,
   configKvReadbackVerified:true,configMarketDate:day,
   dailyReportKvReadbackVerified:true,dailyReportMarketDate:day,
   threeMinExternalAcceptedAndVerified:true,
   cronD1AuditRowReadbackVerified:true,cronScanDate:day,
   signalLeaseD1ReadbackVerified:true,exactLeaseGenerationBound:true,
   zeroPickHonest:true,recoveryIdempotencyVerified:true,
 }
};
const structurallyComplete=inspect(full);
for(const p of ["p01","p02","p04"]){
 assert.equal(structurallyComplete[p].state,
   "STRUCTURALLY_COMPLETE_UNTRUSTED_PENDING_INDEPENDENT_PHYSICAL_REVIEW");
 assert.equal(structurallyComplete[p].independentlyAccepted,false);
}
assert.equal(structurallyComplete.actualOperationCostKnown.primaryRowsWritten,52);
assert.equal(structurallyComplete.actualOperationCostKnown.primaryRowsRead,915);
assert.equal(structurallyComplete.actualOperationCostKnown.recoveryRowsRead,null);
assert.equal(structurallyComplete.reserveNumberAuthorized,false);
assert.equal(structurallyComplete.authorizedReserveRows,null);
assert.equal(structurallyComplete.readReserveNumberAuthorized,false);
assert.equal(structurallyComplete.authorizedReadReserveRows,null);
assert.equal(structurallyComplete.actualPhysicalReadbackAuthenticated,false);
assert.equal(structurallyComplete.independentAuditClosureAuthorized,false);
assert.equal(structurallyComplete.physicalD1QueriesMade,0);
assert.equal(Object.isFrozen(structurallyComplete),true);
assert.equal(structurallyComplete.persistenceTopology.planAndConfig,"STOCKS_KV");
assert.equal(structurallyComplete.persistenceTopology.dailyReport,"STOCKS_KV");
assert.equal(structurallyComplete.persistenceTopology.cronAudit,"V7_DB");

// Caller completeness can only generate untrusted previews. Every altered
// negative input MUST lose the corresponding readiness.
const bad=[
 {label:"whole day masquerades as primary cost",edit:{d1Costs:{primary:{
   ...metric,measurementScope:"WHOLE_V7_DB_UTC_DAY"},
   wholeDayV7Db:full.d1Costs.wholeDayV7Db}},
   expect:"EXACT_PRIMARY_D1_ROWS_WRITTEN_UNKNOWN",p:"p01"},
 {label:"GraphQL daily sum is not operation read",edit:{d1Costs:{primary:{
   ...metric,measurementScope:"GRAPHQL_DAILY_SUM"},
   wholeDayV7Db:full.d1Costs.wholeDayV7Db}},
   expect:"EXACT_PRIMARY_D1_ROWS_READ_UNKNOWN",p:"p02"},
 {label:"unknown retries",edit:{d1Costs:{primary:{...metric,retryAndPartialAttemptsAccounted:false}}},
   expect:"EXACT_PRIMARY_D1_ROWS_READ_UNKNOWN",p:"p02"},
 {label:"read metric unknown",edit:{d1Costs:{primary:{...metric,rowsRead:null}}},
   expect:"EXACT_PRIMARY_D1_ROWS_READ_UNKNOWN",p:"p02"},
 {label:"unsourced cost",edit:{d1Costs:{primary:{...metric,source:{}}}},
   expect:"EXACT_PRIMARY_D1_ROWS_WRITTEN_UNKNOWN",p:"p01"},
 {label:"recovery unknown not fabricated",edit:{execution:{
   ...full.execution,recovery:{state:"UNKNOWN"}}},
   expect:"RECOVERY_INVOKED_OR_NOT_INVOKED_UNKNOWN",p:"p04"},
 {label:"recovery absence unwitnessed",edit:{execution:{
   ...full.execution,recovery:{state:"NOT_INVOKED_PROVEN",source:s}}},
   expect:"RECOVERY_ABSENCE_NOT_PHYSICALLY_WITNESSED",p:"p04"},
 {label:"duplicate recovery business",edit:{execution:{
   ...full.execution,recovery:{state:"EXECUTED",
     scheduledAtUtc:"2026-10-12T15:55:03Z",businessResult:"SUCCESS",
     skipped:false,source:s}}},
   expect:"EXACTLY_ONE_SUCCESSFUL_BUSINESS_SCAN_NOT_PROVEN",p:"p04"},
 {label:"recovery duplicate also requires cost",edit:{execution:{
   ...full.execution,recovery:{state:"EXECUTED",
     scheduledAtUtc:"2026-10-12T15:55:03Z",businessResult:"SKIPPED",
     skipped:true,source:s}}},
   expect:"EXACT_RECOVERY_D1_ROWS_READ_UNKNOWN",p:"p02"},
 {label:"quota collision overrides all",edit:{account:{
   ...full.account,quotaCollisionObserved:true}},
   expect:"D1_ACCOUNT_QUOTA_COLLISION_OBSERVED",p:"p04"},
 {label:"unassessed graphql lag",edit:{account:{
   ...full.account,graphqlLagAssessed:false}},
   expect:"ACCOUNT_WIDE_READ_USAGE_OR_GRAPHQL_LAG_UNVERIFIED",p:"p02"},
 {label:"missing KV report",edit:{business:{
   ...full.business,dailyReportKvReadbackVerified:false}},
   expect:"BUSINESS_CONFIG_OR_DAILY_REPORT_KV_READBACK_MISSING",p:"p04"},
 {label:"no D1 cron sink",edit:{business:{
   ...full.business,cronD1AuditRowReadbackVerified:false}},
   expect:"D1_CRON_AND_LEASE_READBACK_INCOMPLETE",p:"p04"},
 {label:"cron success no KV plan",edit:{business:{
   ...full.business,latestAfterMarketScanKvReadbackVerified:false}},
   expect:"NORMAL_SCAN_KV_SNAPSHOT_NOT_READBACK_VERIFIED",p:"p04"},
 {label:"holiday cannot count",edit:{officialTradingSession:{
   ...full.officialTradingSession,isOrdinarySession:false}},
   expect:"OFFICIAL_ORDINARY_SESSION_NOT_PROVEN",p:"p04"},
 {label:"manual scan cannot count",edit:{execution:{
   ...full.execution,primary:{...full.execution.primary,event:"workflow_dispatch"}}},
   expect:"NATURAL_23_35_PROVENANCE_MISSING",p:"p04"},
 {label:"timestamp wrong",edit:{execution:{
   ...full.execution,primary:{...full.execution.primary,scheduledAtUtc:"2026-10-12T15:55:30Z"}}},
   expect:"NATURAL_23_35_PROVENANCE_MISSING",p:"p04"},
 {label:"wrong account UTC day",edit:{account:{
   ...full.account,utcQuotaDay:"2026-10-11"}},
   expect:"SAME_UTC_DAY_ACCOUNT_NO_COLLISION_NOT_PROVEN",p:"p04"},
 {label:"incomplete business pipeline",edit:{business:{
   ...full.business,pipelineComplete:false}},
   expect:"NORMAL_SCAN_KV_SNAPSHOT_NOT_READBACK_VERIFIED",p:"p04"},
];
for(const t of bad){
 const x=inspect({...full,...t.edit});
 assert.ok(x[t.p].missing.includes(t.expect),t.label);
 assert.equal(x[t.p].independentlyAccepted,false,t.label);
 assert.equal(x.physicalD1WritesMade,0,t.label);
}
assert.throws(()=>inspect({marketDate:"2026-02-30"}),/INVALID_MARKET_DATE/);
assert.throws(()=>inspect({marketDate:"bad"}),/INVALID_MARKET_DATE/);
assert.throws(()=>inspect(null),/INVALID_EVIDENCE_OBJECT/);
console.log("S1_ISSUE1024_P01_P02_P04_2_SOURCE_AND_STRUCTURAL_19_NEGATIVE_UNTRUSTED_NO_D1_PASS");
