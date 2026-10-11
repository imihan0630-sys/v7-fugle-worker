import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {evaluateD1AccountQuotaReservationV0_1 as decide}
  from "../runtime/d1_account_quota_budget_v0_1.mjs";
import {decideSourceAccountWriterQuarantineV0_1 as sourceGuard}
  from "../runtime/source_account_d1_writer_quarantine_v0_1.mjs";
const p=JSON.parse(readFileSync(new URL("../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json",import.meta.url),"utf8"));
const q=JSON.parse(readFileSync(new URL("../config/source_account_d1_writer_quarantine_v0_1.json",import.meta.url),"utf8"));
const r=JSON.parse(readFileSync(new URL("../config/d1_account_writer_registry_v0_1.json",import.meta.url),"utf8"));
const shadow=r.writers.find(w=>w.id==="DAILY_SHADOW_DIAGNOSTIC");
assert.equal(p.ownerV8ExtraQuotaReserveWaived,true);
assert.equal(p.ownerWaiverScope,"EXTRA_CROSS_SYSTEM_V8_HEADROOM_RESERVE_ONLY");
assert.equal(p.waiverIsNotEvidenceAuthorization,true);
assert.equal(p.reserveNumberAuthorized,false);
assert.equal(p.authorizedReserveRows,null);
assert.equal(p.readReserveNumberAuthorized,false);
assert.equal(p.authorizedReadReserveRows,null);
const u=(read,write)=>({known:true,quotaDay:"2026-10-11",rowsRead:read,rowsWritten:write});
const safe=decide({writer:shadow,eventName:"workflow_dispatch",accountUsage:u(200000,0),system1ReservePolicy:p});
assert.equal(safe.state,"QUOTA_RESERVATION_GRANTED");
assert.equal(safe.system1ReserveRows,0);
assert.equal(safe.system1ReadReserveRows,0);
assert.equal(safe.paidUpgradeAuthorized,false);
for(const incomplete of [{known:false,quotaDay:"2026-10-11"},undefined]){
 const d=decide({writer:shadow,eventName:"workflow_dispatch",accountUsage:incomplete,system1ReservePolicy:p});
 assert.equal(d.state,"QUOTA_BUDGET_DEFER");
 assert.equal(d.physicalAllowed,false);
}
const cappedRead=decide({writer:shadow,eventName:"workflow_dispatch",accountUsage:u(4999999,0),system1ReservePolicy:p});
assert.equal(cappedRead.state,"QUOTA_BUDGET_DEFER");
assert.ok(cappedRead.reasonCodes.includes("ROWS_READ_DAILY_BUDGET_EXCEEDED"));
const cappedWrite=decide({writer:shadow,eventName:"workflow_dispatch",accountUsage:u(100,99999),system1ReservePolicy:p});
assert.equal(cappedWrite.state,"QUOTA_BUDGET_DEFER");
assert.ok(cappedWrite.reasonCodes.includes("ROWS_WRITTEN_DAILY_BUDGET_EXCEEDED"));
const gate=sourceGuard({policy:q,mode:"reserve",writerId:"DAILY_SHADOW_DIAGNOSTIC"});
assert.equal(gate.shouldDefer,true); // SOURCE old S2 physical writer remains quarantined
assert.equal(gate.physicalAllowed,false);
// No protection cancellation can turn a fake reserve into a provider-truth claim.
const corrupt={...p,ownerWaiverScope:"ALL_D1_QUOTAS_DISABLED"};
const fail=decide({writer:shadow,eventName:"workflow_dispatch",accountUsage:u(200000,0),system1ReservePolicy:corrupt});
assert.equal(fail.state,"QUOTA_BUDGET_DEFER");
assert.ok(fail.reasonCodes.includes("SYSTEM1_AFTER_MARKET_RESERVE_NOT_AUTHORIZED"));
console.log("OWNER_V8_EXTRA_RESERVE_CANCELLED_HARD_D1_QUOTAS_AND_SOURCE_MIGRATION_QUARANTINE_STAY_PASS");
