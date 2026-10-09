import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildDecisionOutcomeSnapshotV0_1 } from "../runtime/outcome_tracker_v0_1.mjs";
import { simulateTaiwanLongDailyPlanV0_1,toOutcomeSimulatedExecutionV0_1 }
  from "../runtime/execution_simulator_v0_1.mjs";
import { buildS2FrozenOutcomeRevisionV0_1 }
  from "../runtime/outcome_revision_archive_v0_1.mjs";
import { prepareS2F08QuotaRegisteredWriterDispatchV0_1 as prepare }
  from "../runtime/f08_quota_registered_writer_dispatch_preflight_v0_1.mjs";

const decision={
  decisionId:"F08-CAS-D1",decisionHash:"d".repeat(64),
  strategyId:"SWING_GROWTH",strategyVersion:"SHADOW-V1",symbol:"2330",
  marketDate:"2026-09-29",decisionTimestamp:"2026-09-29T07:30:00Z",
  regimeSnapshotId:"F08-CAS-REG",
};
const regime={
  regimeSnapshotId:"F08-CAS-REG",regimeHash:"e".repeat(64),
  marketDate:decision.marketDate,decisionTimestamp:decision.decisionTimestamp,
};
const cost={
  costModelVersion:"COST-F08",taxRuleId:"TW-TAX-1",commissionRate:0.001,
  minimumCommission:1,transactionTaxRate:0.003,
  entrySlippageRate:0.001,exitSlippageRate:0.001,
};
const bar=(n,date,close)=>({
 sessionNumber:n,marketDate:date,availableAt:date+"T08:30:00Z",
 priceSpace:"ADJUSTED",open:close,high:close+1,low:close-1,close,
 volumeShares:100000,tradingState:"NORMAL",executableLiquidity:"AVAILABLE",
 limitState:"NONE",sourceId:"F08_SYNTHETIC_NOT_PIT",
});
const bars=[bar(1,"2026-09-30",90),bar(2,"2026-10-01",92)];
const sim=await simulateTaiwanLongDailyPlanV0_1({
 simOrderId:"F08-CAS-ORDER",entryFillObservationId:"F08-ENTRY",
 exitFillObservationId:"F08-EXIT",decisionId:decision.decisionId,
 strategyId:decision.strategyId,strategyVersion:decision.strategyVersion,
 symbol:decision.symbol,decisionMarketDate:decision.marketDate,
 decisionTimestamp:decision.decisionTimestamp,
 earliestEligibleMarketDate:"2026-09-30",orderType:"BUY_STOP",
 triggerPrice:105,requestedShares:1000,stopPrice:85,targetPrice:120,
 maxHoldingSessions:5,entryValiditySessions:2,sessions:bars,
 priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",
 costModel:cost,simulatedAt:"2026-10-02T09:00:00Z",
});
const makeOutcome=(sessions,updatedAt)=>buildDecisionOutcomeSnapshotV0_1({
 decisionId:decision.decisionId,symbol:decision.symbol,
 decisionMarketDate:decision.marketDate,decisionTimestamp:decision.decisionTimestamp,
 referencePrice:89,entryPlan:{stopPrice:85,targets:[120]},
 priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",
 sessions,updatedAt,simulatedExecution:toOutcomeSimulatedExecutionV0_1(sim),
});
const o1=await makeOutcome([bars[0]],"2026-10-01T09:00:00Z");
const o2=await makeOutcome(bars,"2026-10-02T09:00:00Z");
const first=await buildS2FrozenOutcomeRevisionV0_1({
 outcome:o1,decision,regime,simulation:sim,corporateActionHash:"c".repeat(64),
});
const next=await buildS2FrozenOutcomeRevisionV0_1({
 outcome:o2,decision,regime,simulation:sim,corporateActionHash:"c".repeat(64),
 previousRevision:first,
});

const canonicalRegistry=JSON.parse(readFileSync(
  new URL("../config/d1_account_writer_registry_v0_1.json",import.meta.url),"utf8",
));
const registryIds=canonicalRegistry.writers.map(x=>x.id);
assert.ok(registryIds.length>0);
assert.equal(registryIds.includes("F08_OUTCOME_REVISION_APPEND"),false,
 "current main must not implicitly treat F08 as existing registered writer");

const base={receipt:next,previousReceipt:first,registry:canonicalRegistry};
const result=await prepare(base);
assert.equal(result.status,"QUOTA_BUDGET_DEFER_NO_WRITER_DISPATCH");
assert.equal(result.writerRegistryEntryObserved,false);
assert.ok(result.rejectionReasons.includes("F08_OUTCOME_WRITER_NOT_REGISTERED"));
assert.ok(result.rejectionReasons.includes("F08_SYSTEM1_WRITE_RESERVE_NOT_AUTHORIZED"));
assert.ok(result.rejectionReasons.includes("F08_SYSTEM1_READ_RESERVE_NOT_AUTHORIZED"));
assert.ok(result.rejectionReasons.includes("F08_ACCOUNT_WIDE_READ_WRITE_USAGE_NOT_PROVEN"));
assert.equal(result.acceptedTransportMethod,"NONE_DRYRUN_ONLY");
assert.equal(result.physicalD1WriteAuthorized,false);
assert.equal(result.physicalD1WriteAttempted,false);
assert.equal(result.physicalD1ReadAttempted,false);
assert.equal(result.quotaAccountReservationAuthorized,false);
assert.equal(result.system1FormalCoreImpact,false);
assert.equal(Object.isFrozen(result),true);
assert.equal((await prepare(base)).preflightHash,result.preflightHash);

const dummyWriter={
  id:"F08_OUTCOME_REVISION_APPEND",
  workflow:".github/workflows/system2-f08-outcome-revision-append.yml",
  writerClass:"P3_MAINTENANCE_PHYSICAL_SMOKE",
  priority:"P3",
  physicalMutation:true,pushPhysicalAllowed:false,
  reservationModel:{type:"FIXED_MEASURED",rowsWritten:35,evidence:"SYNTHETIC_TEST_ONLY"},
  readReservationModel:{type:"FIXED_MEASURED",rowsRead:700,evidence:"SYNTHETIC_TEST_ONLY"},
};
const fakeRegistry={...canonicalRegistry,writers:[...canonicalRegistry.writers,dummyWriter]};
const fakeApproval={
  registry:fakeRegistry,
  system1ReservePolicy:{
    reserveNumberAuthorized:true,authorizedReserveRows:5000,
    readReserveNumberAuthorized:true,authorizedReadReserveRows:100000,
  },
  accountUsage:{known:true,quotaDay:"2026-10-09",rowsWritten:100,rowsRead:1000},
  quotaDecision:{state:"QUOTA_RESERVATION_GRANTED",physicalAllowed:true},
};
const withForgedApproval=await prepare({...base,...fakeApproval});
assert.equal(withForgedApproval.writerRegistryEntryObserved,true);
assert.equal(withForgedApproval.reservationEstimateState,"RESERVATION_RESOLVED");
assert.equal(withForgedApproval.estimatedRowsWritten,35);
assert.equal(withForgedApproval.estimatedRowsRead,700);
assert.equal(withForgedApproval.physicalD1WriteAuthorized,false);
assert.ok(withForgedApproval.rejectionReasons.includes("F08_QUOTA_RECEIPT_IDENTITY_NOT_INDEPENDENTLY_VERIFIED"));
assert.ok(withForgedApproval.rejectionReasons.includes("F08_F07_SCHEMA_AND_SOURCE_PIT_NOT_PHYSICALLY_ACCEPTED"));
assert.ok(withForgedApproval.rejectionReasons.includes("F08_PHYSICAL_WRITER_NOT_CONNECTED"));
assert.equal(withForgedApproval.finalShadowSelectionEnabled,false);

// Registration and costs must be exact; no physical entrypoint can be
// enabled merely by a caller claiming an authorized decision.
const variations=[
  [{...dummyWriter,physicalMutation:false},"F08_WRITER_CONTRACT_UNSAFE"],
  [{...dummyWriter,pushPhysicalAllowed:true},"F08_WRITER_CONTRACT_UNSAFE"],
  [{...dummyWriter,priority:"NO_PRIORITY"},"F08_WRITER_CONTRACT_UNSAFE"],
  [{...dummyWriter,workflow:"../../../worker.mjs"},"F08_WRITER_CONTRACT_UNSAFE"],
  [{...dummyWriter,reservationModel:{type:"FIXED_MEASURED",rowsWritten:1,evidence:""}},"F08_MEASURED_ROWS_WRITTEN_COST_MISSING"],
  [{...dummyWriter,readReservationModel:{type:"CALLER_REQUIRED",minimumRowsRead:null,evidence:null}},"F08_MEASURED_ROWS_READ_COST_MISSING"],
];
for(const [writer,reason] of variations){
  const got=await prepare({...base,registry:{...canonicalRegistry,writers:[writer]}});
  assert.ok(got.rejectionReasons.includes(reason),reason);
  assert.equal(got.physicalD1WriteAttempted,false);
}
const dup=await prepare({...base,registry:{...canonicalRegistry,writers:[dummyWriter,dummyWriter]}});
assert.ok(dup.rejectionReasons.includes("F08_OUTCOME_WRITER_REGISTRATION_AMBIGUOUS"));
const push=await prepare({...base,...fakeApproval,eventName:"push"});
assert.ok(push.rejectionReasons.includes("F08_ORDINARY_PUSH_PHYSICAL_MUTATION_FORBIDDEN"));
assert.equal(push.physicalD1WriteAuthorized,false);
const badEvent=await prepare({...base,eventName:"manual_unsafe"});
assert.ok(badEvent.rejectionReasons.includes("F08_UNKNOWN_WORKFLOW_EVENT"));

await assert.rejects(()=>prepare({...base,db:{prepare(){throw Error("PHYSICAL SQL DISPATCH!");}}}),
  /PHYSICAL_DB_HANDLE_FORBIDDEN/);
await assert.rejects(()=>prepare({...base,bindingName:"V7_DB"}),/FORBIDDEN_BINDING/);
await assert.rejects(()=>prepare({receipt:next,registry:canonicalRegistry}),/PREVIOUS_RECEIPT_REQUIRED/);
await assert.rejects(()=>prepare({...base,receipt:{...next,revisionHash:"f".repeat(64)}}),
  /RECEIPT_HASH_MISMATCH/);
const genesis=await prepare({receipt:first,registry:canonicalRegistry});
assert.equal(genesis.physicalD1WriteAuthorized,false);
assert.equal(genesis.proposedRevisionId,first.revisionId);
console.log("F08_DRYRUN_UNREGISTERED_WRITER_2_BASE_13_ADVERSARIAL_NO_PHYSICAL_AUTHORITY_PASS");
