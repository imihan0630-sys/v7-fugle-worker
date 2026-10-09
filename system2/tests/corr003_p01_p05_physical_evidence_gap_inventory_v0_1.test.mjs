import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const evidence = JSON.parse(readFileSync(
  new URL("../evidence/S2_CORR003_P01_P05_PHYSICAL_EVIDENCE_GAP_INVENTORY_20261009_V0_1.json", import.meta.url), "utf8"
));
const canonicalAudit = JSON.parse(readFileSync(
  new URL("../evidence/S2_CORR003_INDEPENDENT_PHYSICAL_CLOSURE_GATE_20261009_V0_1.json", import.meta.url), "utf8"
));
const policy = JSON.parse(readFileSync(
  new URL("../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json", import.meta.url), "utf8"
));

assert.equal(evidence.directiveId, "S2-CORR-20261007-003");
assert.equal(evidence.status, "EVIDENCE_INVENTORY_AND_HANDOFF_ONLY_NO_PHYSICAL_GATE_PROMOTION");
assert.equal(evidence.verifiedCodeScope, "A1_TO_A7_INDEPENDENT_SOURCE_LEVEL_PASS");
assert.equal(evidence.reviewedOriginalAcceptanceCriteriaCount, 19);
assert.equal(evidence.physicalGateCount, 5);
assert.equal(evidence.qualifiedPhysicalGateCount, 0);
assert.equal(canonicalAudit.prerequisiteGates.length, 5);
assert.ok(canonicalAudit.prerequisiteGates.every(x => x.state === "PENDING" && !x.evidenceQualified));

const expected = [
  ["P01_SYSTEM1_WRITE_RESERVE", 3, 7],
  ["P02_SYSTEM1_READ_RESERVE", 3, 7],
  ["P03_MULTIWRITER_UTC_DAY", 3, 8],
  ["P04_LATER_TRADING_DAY_SYSTEM1_PERSISTENCE", 2, 7],
  ["P05_ORIGINAL_PHYSICAL_CRITERIA", 4, 9],
];
assert.deepEqual(evidence.workPackages.map(w => [
  w.id, w.supportChecksDocumented, w.supportChecksTotal,
]), expected);
assert.equal(evidence.workPackages.length, 5);
assert.equal(evidence.supportChecksDocumentedTotal, 15);
assert.equal(evidence.supportChecksTotal, 38);
for (const w of evidence.workPackages) {
  assert.equal(w.qualifyingPhysicalAcceptance, false);
  assert.equal(w.supportChecks.filter(s => s[1] === "EVIDENCE_DOCUMENTED").length, w.supportChecksDocumented);
  assert.equal(w.supportChecks.length, w.supportChecksTotal);
  assert.equal(w.supportChecks.filter(s => s[1] === "MISSING").length, w.supportChecksMissing);
  assert.ok(w.missingOwnerInputs.length > 0);
}

const dates = evidence.system1MeasuredDailyUsage;
assert.deepEqual(dates.map(x=>x.quotaDay), ["2026-09-21","2026-09-22","2026-10-07"]);
assert.deepEqual(dates.map(x=>x.v7RowsWritten), [2825,1635,1869]);
assert.deepEqual(dates.map(x=>x.v7RowsRead), [133037,19533,431323]);
assert.deepEqual(dates.map(x=>x.businessHealthy), [true,true,false]);
assert.ok(dates.every(x=>x.measurementScope.startsWith("WHOLE_V7_DB_UTC_DAY")));
assert.equal(policy.observedWholeV7DailyRowsWritten.max,2825);
assert.equal(policy.healthyAfterMarketDateCount,2);
assert.equal(policy.reserveNumberAuthorized,false);
assert.equal(policy.authorizedReserveRows,null);
assert.equal(policy.readReserveNumberAuthorized,false);
assert.equal(policy.authorizedReadReserveRows,null);

const collision=evidence.historicalCollision;
assert.equal(collision.accountRowsWritten,collision.system1RowsWritten+collision.system2RowsWritten);
assert.equal(collision.accountRowsRead,collision.system1RowsRead+collision.system2RowsRead);
assert.equal(collision.accountRowsWritten,126498);
assert.equal(collision.accountRowsRead,4374959);
assert.ok(collision.accountRowsWritten>collision.hardWrittenLimit);
assert.equal(collision.system1FailureClass,"INVOKED_EXECUTION_FAILED_D1_QUOTA");

assert.equal(evidence.accountObservations.length,2);
assert.ok(evidence.accountObservations.every(x=>x.physicalWrite===false));
assert.ok(evidence.accountObservations.every(x=>x.rowsReadLowerBound>0 && x.rowsWrittenLowerBound>0));
assert.equal(evidence.laterScheduledAttempt.result,"BLOCKED");
assert.equal(evidence.laterScheduledAttempt.genuineProspective,false);
assert.equal(evidence.laterScheduledAttempt.cannotCertifyNormal23_35Persistence,true);

const oct=evidence.workPackages.find(x=>x.id==="P05_ORIGINAL_PHYSICAL_CRITERIA");
assert.equal(oct.oct08OfficialSourceDaysAccepted,12);
assert.equal(oct.oct08OfficialSourceKeys,11843);
assert.equal(oct.physicalD1ScoutExecuted,0);
assert.equal(oct.physicalD1CensusExecuted,0);
assert.equal(oct.physicalMissingKeyCount,"UNKNOWN");

for(const [key,value] of Object.entries(evidence.safety)){
  if(key==="noSyntheticReserveApproval"||key==="syntheticCiDoesNotCountAsPhysical"||key==="sourceOnlyIsNotHotD1"||key==="codePassIsNotPhysicalPass")assert.equal(value,true);
  else if(typeof value==="boolean")assert.equal(value,false);
  else if(key.startsWith("physicalD1"))assert.equal(value,0);
}
assert.equal(evidence.physicalEvidenceSources.length,7);
assert.deepEqual(evidence.handoffs.map(x=>x.to),[
 "System 1｜建置總控室","System 2｜歷史資料工程室",
 "System 2｜獨立稽核顧問室","System 2｜補強修復室"
]);
console.log("CORR003_P01_P05_EVIDENCE_INVENTORY_PASS documented=15/38 physical=0/5 source=7 readOnly=true");
