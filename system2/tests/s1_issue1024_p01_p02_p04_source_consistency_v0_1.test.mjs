import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const x=JSON.parse(readFileSync(new URL(
  "../../research/SYSTEM1_ISSUE1024_P01_P02_P04_REAL_GITHUB_D1_PRODUCER_EVIDENCE_20261009_V0_1.json",
  import.meta.url,
),"utf8"));
assert.equal(x.schemaVersion,"SYSTEM1_ISSUE1024_P01_P02_P04_READONLY_SOURCE_INTAKE_V0_1");
assert.equal(x.primarySources.length,7);
assert.equal(new Set(x.primarySources.map(v=>v.runId)).size,x.primarySources.length);
assert.ok(x.primarySources.every(v=>v.readOnly && Number.isInteger(v.jobId) && Number.isInteger(v.runId)));
for(const s of x.primarySources.filter(v=>v.headSha)){
  assert.match(s.headSha,/^[0-9a-f]{40}$/);
}
for(const s of x.primarySources.filter(v=>v.artifactId)){
  assert.match(s.artifactZipSha256,/^[0-9a-f]{64}$/);
}
const cron=x.directRealCronRows;
assert.deepEqual(cron.map(v=>v.cronRowId),[1893,2173]);
assert.deepEqual(cron.map(v=>v.status),["SUCCESS","SUCCESS"]);
assert.ok(cron.every(v=>v.exactBusinessPersistenceReadbackVerified===false));
assert.deepEqual(x.sourceCoverage.healthyAfterMarketCronDates,["2026-09-21","2026-09-22"]);
assert.equal(x.sourceCoverage.healthyDatesCount,2);
const days=x.accountUsageObservations;
const sept21=days.find(v=>v.utcDay==="2026-09-21");
const sept22=days.find(v=>v.utcDay==="2026-09-22");
const incident=days.find(v=>v.utcDay==="2026-10-07");
assert.equal(sept21.V7_DB.rowsWritten,2825);
assert.equal(sept21.V7_DB.rowsRead,133037);
assert.equal(sept22.V7_DB.rowsWritten,1635);
assert.equal(sept22.V7_DB.rowsRead,19533);
assert.ok([sept21,sept22].every(v=>v.per2335CostKnown===false &&
  v.per2355CostKnown===false && v.physicalBusinessReadbackSameGeneration===false));
assert.equal(incident.V7_DB.rowsWritten+incident.SYSTEM2_DB.rowsWritten,126498);
assert.equal(incident.V7_DB.rowsRead+incident.SYSTEM2_DB.rowsRead,4374959);
assert.equal(incident.accountTotals.rowsWritten,126498);
assert.equal(incident.accountTotals.rowsRead,4374959);
assert.equal(incident.quotaCollisionWitnessed,true);
assert.equal(incident.recoverySuccessfulBusinessPersisted,false);
assert.equal(x.businessPersistence.lastScanAttemptFromPVE263.status,"FAILED");
assert.equal(x.businessPersistence.lastAfterMarketScanFromPVE263.pipelineComplete,false);
assert.equal(x.businessPersistence.scheduledC1AfterOct08.conclusion,"FAILURE");
assert.equal(x.businessPersistence.scheduledC1AfterOct08.genuineProspective,false);
assert.equal(x.businessPersistence.exactPlanReportCronD1Readback,false);
assert.equal(x.tradingCalendar.marketHoliday,"2026-10-09");
assert.equal(x.tradingCalendar.earliestNextOrdinaryTradeDay,"2026-10-12");
assert.deepEqual(x.workPackages.map(w=>w.supportChecksDocumented),[3,3,2]);
assert.deepEqual(x.workPackages.map(w=>w.supportChecksTotal),[7,7,7]);
assert.ok(x.workPackages.every(w=>w.qualified===false));
assert.deepEqual([x.physicalQualification.authorizedReserveRows,
  x.physicalQualification.authorizedReadReserveRows],[null,null]);
assert.equal(x.physicalQualification.allPhysicalGatesQualified,0);
assert.equal(x.physicalQualification.correctionStatus,"VERIFYING");
assert.equal(x.changeSafety.newD1Queries,0);
assert.equal(x.changeSafety.newD1Writes,0);
assert.equal(x.changeSafety.newProductionCronRuns,0);
assert.equal(x.changeSafety.system1FormalCoreChanged,false);
console.log("S1_ISSUE1024_REAL_SOURCE_CROSSCHECK_PASS_READONLY_NO_RESERVE_AUTHORITY");
