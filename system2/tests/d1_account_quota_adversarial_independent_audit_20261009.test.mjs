// CORR-003 independent adversarial acceptance replay after REMEDIATION hardening.
// This test remains offline/source-only. PASS means A1-A4 no longer reproduce in
// repository semantics; it does NOT mark the HIGH correction VERIFIED_CLOSED.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {
  evaluateD1AccountQuotaReservationV0_1,
  evaluateD1QuotaResultVarianceV0_1,
  summarizeD1QuotaLedgerRowsV0_1,
  verifyD1QuotaLedgerReceiptIdentityV0_1,
  D1_FREE_LIMITS,
} from "../runtime/d1_account_quota_budget_v0_1.mjs";

const registry=JSON.parse(await readFile(new URL(
 "../config/d1_account_writer_registry_v0_1.json",import.meta.url),"utf8"));
const find=id=>{
 const row=registry.writers.find(w=>w.id===id);
 assert.ok(row,"canonical writer is not registered: "+id);
 return row;
};
const fakeAuthorizedSystem1={
 evidenceState:"SYNTHETIC_ADVERSARIAL_AUDIT_NOT_OPERATIONAL",
 reserveNumberAuthorized:true,authorizedReserveRows:5000,
};
const mkUsage=(rowsWritten,rowsRead)=>({
 known:true,quotaDay:"2026-10-09",rowsWritten,rowsRead,
 source:"SYNTHETIC_ADVERSARIAL_AUDIT_NOT_CLOUDFLARE",
});

assert.equal(D1_FREE_LIMITS.rowsWrittenPerUtcDay,100000);
assert.equal(D1_FREE_LIMITS.rowsReadPerUtcDay,5000000);

// Baseline production-safe boundary remains unchanged.
const unknownReserve=evaluateD1AccountQuotaReservationV0_1({
 writer:find("HISTORICAL_ANNUAL_BACKFILL"),eventName:"workflow_dispatch",
 accountUsage:mkUsage(20000,1000),
 system1ReservePolicy:{reserveNumberAuthorized:false,authorizedReserveRows:null},
});
assert.equal(unknownReserve.physicalAllowed,false);
assert.equal(unknownReserve.state,"QUOTA_BUDGET_DEFER");

// A1 — original exploit must now fail specifically on the verified write minimum.
// Clone only read evidence so the test isolates write-underfunding behavior.
const annual=find("HISTORICAL_ANNUAL_BACKFILL");
const annualWithSyntheticReadEvidence={
 ...annual,
 readReservationModel:{type:"FIXED_MEASURED",rowsRead:40000,evidence:"SYNTHETIC_TEST_ONLY"},
};
const annualUnderfund=evaluateD1AccountQuotaReservationV0_1({
 writer:annualWithSyntheticReadEvidence,eventName:"workflow_dispatch",
 accountUsage:mkUsage(20000,1000),
 system1ReservePolicy:fakeAuthorizedSystem1,
 requestedRowsWritten:1,
 requestedRowsRead:40000,
});
assert.equal(annualUnderfund.state,"QUOTA_BUDGET_DEFER");
assert.equal(annualUnderfund.physicalAllowed,false);
assert.ok(annualUnderfund.reasonCodes.includes("WRITER_WRITE_RESERVATION_BELOW_VERIFIED_MINIMUM"));
assert.equal(annualUnderfund.verifiedMinimumRowsWritten,7358);

const annualAtFloor=evaluateD1AccountQuotaReservationV0_1({
 writer:annualWithSyntheticReadEvidence,eventName:"workflow_dispatch",
 accountUsage:mkUsage(20000,1000),
 system1ReservePolicy:fakeAuthorizedSystem1,
 requestedRowsWritten:7358,
 requestedRowsRead:40000,
});
assert.equal(annualAtFloor.state,"QUOTA_RESERVATION_GRANTED");
assert.equal(annualAtFloor.requestedRowsWritten,7358);

// A2 — unknown read cost cannot be represented as zero or one-row headroom.
const readBlindSpot=evaluateD1AccountQuotaReservationV0_1({
 writer:annual,eventName:"workflow_dispatch",
 accountUsage:mkUsage(20000,4999999),
 system1ReservePolicy:fakeAuthorizedSystem1,
 requestedRowsWritten:7358,
 requestedRowsRead:0,
});
assert.equal(readBlindSpot.state,"QUOTA_BUDGET_DEFER");
assert.equal(readBlindSpot.physicalAllowed,false);
assert.ok(readBlindSpot.reasonCodes.includes("WRITER_READ_RESERVATION_EVIDENCE_REQUIRED"));

const shadow=find("DAILY_SHADOW_DIAGNOSTIC");
const readHardLimit=evaluateD1AccountQuotaReservationV0_1({
 writer:shadow,eventName:"schedule",
 accountUsage:mkUsage(1000,5000000-shadow.readReservationModel.rowsRead+1),
 system1ReservePolicy:fakeAuthorizedSystem1,
});
assert.equal(readHardLimit.state,"QUOTA_BUDGET_DEFER");
assert.ok(readHardLimit.reasonCodes.includes("ROWS_READ_DAILY_BUDGET_EXCEEDED"));

const readOverrun=evaluateD1QuotaResultVarianceV0_1({
 reservedRowsWritten:100,
 reservedRowsRead:100,
 observedDeltaRowsWritten:100,
 observedDeltaRowsRead:101,
});
assert.equal(readOverrun.readOverrun,true);
assert.equal(readOverrun.releaseReservationWithinUtcDay,false);

// A3 — all physical writer finalizers must run after success/failure/partial completion.
let successOnly=0,alwaysFinalizer=0,outcomeBound=0;
for(const writer of registry.writers.filter(w=>w.physicalMutation)){
 const body=await readFile(new URL("../../"+writer.workflow,import.meta.url),"utf8");
 const i=body.indexOf("mode: result");
 assert.notEqual(i,-1,writer.id+" result action missing");
 const prefix=body.slice(Math.max(0,i-520),i);
 if(/if:\s*steps\.quota\.outputs\.physical_allowed == 'true' && success\(\)/.test(prefix)) successOnly++;
 if(/if:\s*always\(\) && steps\.quota\.outputs\.physical_allowed == 'true'/.test(prefix)) alwaysFinalizer++;
 const suffix=body.slice(i,Math.min(body.length,i+360));
 if(/execution_outcome:\s*\$\{\{ job\.status \}\}/.test(suffix)) outcomeBound++;
}
assert.equal(successOnly,0);
assert.equal(alwaysFinalizer,13);
assert.equal(outcomeBound,13);

// Failed result remains accounted and same-day reservation is not released.
const reservation={
 check_type:"SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
 observed_payload_json:JSON.stringify({
  runKey:"run:1",quotaDay:"2026-10-09",requestedRowsWritten:7358,requestedRowsRead:40000,
 }),
};
const failedResult={
 check_type:"SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1",
 observed_payload_json:JSON.stringify({
  runKey:"run:1",quotaDay:"2026-10-09",
  resultState:"RESULT_FAILURE_OBSERVED_NON_RELEASING",
  accountRowsWrittenAfter:30000,accountRowsReadAfter:90000,
 }),
};
const ledger=summarizeD1QuotaLedgerRowsV0_1([reservation,failedResult],{quotaDay:"2026-10-09"});
assert.equal(ledger.outstandingReservedRowsWritten,7358);
assert.equal(ledger.outstandingReservedRowsRead,40000);
assert.equal(ledger.sameDayReservationReleasePolicy,"NEVER_RELEASE_BEFORE_UTC_RESET");

// A4 — duplicate ID is accepted only for exact identity; any changed content blocks.
const intended={
 checkId:"S2-D1-BUDGET:2026-10-09:run:RESERVATION",
 checkType:"SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
 expectedPayloadJson:'{"directiveId":"S2-CORR-20261007-003"}',
 observedPayloadJson:'{"runKey":"run"}',
 status:"QUOTA_RESERVATION_GRANTED",
 checkHash:"hash-1",
};
const existing={
 check_id:intended.checkId,
 check_type:intended.checkType,
 expected_payload_json:intended.expectedPayloadJson,
 observed_payload_json:intended.observedPayloadJson,
 status:intended.status,
 check_hash:intended.checkHash,
};
assert.equal(verifyD1QuotaLedgerReceiptIdentityV0_1(existing,intended).idempotent,true);
assert.throws(
 ()=>verifyD1QuotaLedgerReceiptIdentityV0_1({...existing,observed_payload_json:'{"runKey":"tampered"}'},intended),
 /D1_QUOTA_LEDGER_IDEMPOTENCY_CONFLICT/,
);
assert.throws(
 ()=>verifyD1QuotaLedgerReceiptIdentityV0_1({...existing,check_hash:"hash-2"},intended),
 /D1_QUOTA_LEDGER_IDEMPOTENCY_CONFLICT/,
);

const gate=await readFile(new URL(
 "../scripts/run_d1_account_quota_gate_v0_1.mjs",import.meta.url),"utf8");
assert.match(gate,/readLedgerReceiptById/);
assert.match(gate,/verifyD1QuotaLedgerReceiptIdentityV0_1/);
assert.match(gate,/D1_QUOTA_LEDGER_RECEIPT_READBACK_MISSING/);
assert.match(gate,/reservationReleasePolicy:\s*"NEVER_RELEASE_BEFORE_UTC_RESET"/);
assert.match(gate,/freshnessGuarantee:\s*"NOT_DOCUMENTED_BY_VENDOR"/);

const report={
 schemaVersion:"S2_CORR_003_INDEPENDENT_ADVERSARIAL_REPLAY_V0_2",
 result:"SOURCE_LEVEL_A1_A2_A3_A4_REMEDIATED_PENDING_INDEPENDENT_PHYSICAL_REVERIFY",
 mechanism:"OFFLINE_DETERMINISTIC_NO_CLOUDFLARE_IO",
 protectedFormalCoreChanged:false,
 actualCloudflareD1ReadsPerformed:0,
 actualCloudflareD1WritesPerformed:0,
 paidPlanUpgradePerformed:false,
 physicalMultiWriterAcceptanceCertified:false,
 syntheticSystem1ReserveMustNeverBePromoted:true,
 scenarioCount:4,
 reproducedFindingCount:0,
 fixed:[
  "A1_FIXED_MEASURED_CALLER_UNDERESTIMATE",
  "A2_ZERO_READ_RESERVATION_NEAR_HARD_LIMIT",
  "A3_FAILURE_SKIP_RESULT_RECEIPT",
  "A4_LEDGER_COLLISION_IDEMPOTENCY_UNPROVEN",
 ],
 remaining:[
  "System1 after-market reserve remains not authorized",
  "bounded real multiwriter account-day physical acceptance remains pending",
  "later real System1 23:35/23:55 persistence remains pending",
 ],
};
assert.equal(report.reproducedFindingCount,0);
console.log("S2_CORR003_ADVERSARIAL_EVIDENCE "+JSON.stringify(report));
