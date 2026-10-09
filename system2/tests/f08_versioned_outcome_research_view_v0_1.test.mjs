import assert from "node:assert/strict";
import { buildDecisionOutcomeSnapshotV0_1 } from "../runtime/outcome_tracker_v0_1.mjs";
import { simulateTaiwanLongDailyPlanV0_1, toOutcomeSimulatedExecutionV0_1 }
  from "../runtime/execution_simulator_v0_1.mjs";
import { buildS2FrozenOutcomeRevisionV0_1, toS2FrozenOutcomeRevisionRowV0_1 }
  from "../runtime/outcome_revision_archive_v0_1.mjs";
import { buildS2F08VersionedOutcomeResearchViewV0_1 as buildView }
  from "../runtime/f08_versioned_outcome_research_view_v0_1.mjs";

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

const r1=await toS2FrozenOutcomeRevisionRowV0_1(first);
const r2=await toS2FrozenOutcomeRevisionRowV0_1(next);
const args={
  receiptChain:[first,next],
  readbackRows:[r1,r2],
  observedAt:"2026-10-03T09:00:00Z",
  maxRevisions:10,
};
const view=await buildView(args);
assert.equal(view.status,"RESEARCH_VIEW_ONLY_NO_PHYSICAL_OR_EXECUTION_CERTIFICATION");
assert.equal(view.versionCount,2);
assert.equal(view.latestRevisionHash,next.revisionHash);
assert.equal(view.revisions[0].revisionHash,first.revisionHash);
assert.equal(view.revisions[1].revisionHash,next.revisionHash);
assert.equal(view.revisions[0].previousRevisionHash,null);
assert.equal(view.revisions[1].previousRevisionHash,first.revisionHash);
assert.equal(view.revisions[0].observedSignalHorizons.length,5);
assert.equal(view.revisions[1].observedSignalHorizons.length,5);
assert.ok(view.revisions[0].observedSignalHorizons.every(x=>x.eligibleForStrategyPerformance===false));
assert.ok(view.revisions[1].observedSignalHorizons.every(x=>x.costAdjustedTradeReturn===null));
assert.equal(view.certifiedStrategyReturn,null);
assert.equal(view.certifiedTradeCount,null);
assert.equal(view.certifiedWinRate,null);
assert.equal(view.certifiedNoFillDenominator,null);
assert.equal(view.selectedToTriggeredDenominator,null);
assert.equal(view.independentSourcePITVerified,false);
assert.equal(view.physicalD1ReadbackVerified,false);
assert.equal(view.accountWideQuotaGranted,false);
assert.equal(view.performancePromotionAuthorized,false);
assert.equal(view.shadowFinalSelectionEnabled,false);
assert.equal(view.system1FormalCoreImpact,false);
assert.equal(Object.isFrozen(view),true);
assert.equal(Object.isFrozen(view.revisions[0]),true);
assert.equal((await buildView(args)).viewHash,view.viewHash);

// One-revision immature research run stays descriptive, not zero completed
// trades, and cannot be promoted simply because its hash is valid.
const genesis=await buildView({
  ...args,receiptChain:[first],readbackRows:[r1],
});
assert.equal(genesis.versionCount,1);
assert.equal(genesis.certifiedTradeCount,null);
assert.equal(genesis.revisions[0].confirmedNoFill,null);
assert.equal(genesis.revisions[0].realizedReturnAfterCost,null);

const negative=[
  {label:"missing revision",change:{readbackRows:[r1]},error:/COUNT_MISMATCH/},
  {label:"reordered storage",change:{readbackRows:[r2,r1]},error:/STORED_REVISION_MISMATCH/},
  {label:"stored cost tamper",change:{readbackRows:[r1,{...r2,cost_model_hash:"f".repeat(64)}]},error:/STORED_REVISION_MISMATCH/},
  {label:"stored outcome JSON tamper",change:{readbackRows:[r1,{...r2,outcome_json:"{}"}]},error:/STORED_REVISION_MISMATCH/},
  {label:"extra row",change:{readbackRows:[r1,r2,r2]},error:/COUNT_MISMATCH/},
  {label:"future outcome visibility",change:{observedAt:"2026-10-01T10:00:00Z"},error:/FUTURE_OUTCOME/},
  {label:"invalid clock",change:{observedAt:"not-a-timestamp"},error:/INVALID_TIMESTAMP/},
  {label:"wrong D1 binding",change:{bindingName:"V7_DB"},error:/FORBIDDEN_BINDING/},
  {label:"invalid limit",change:{maxRevisions:0},error:/UNSAFE_BOUNDED_LIMIT/},
  {label:"truncated by limit",change:{maxRevisions:1},error:/EXPECTED_RECEIPTS/},
  {label:"forged revision hash",change:{receiptChain:[first,{...next,revisionHash:"f".repeat(64)}]},error:/RECEIPT_HASH_MISMATCH/},
  {label:"missing genesis",change:{receiptChain:[next],readbackRows:[r2]},error:/GENESIS_REQUIRED/},
  {label:"certification flag in physical-shaped row",change:{readbackRows:[r1,{...r2,certified_performance:1}]},error:/STORED_REVISION_MISMATCH/},
];
for(const test of negative){
  await assert.rejects(()=>buildView({...args,...test.change}),test.error,test.label);
}
console.log("F08_VERSIONED_RESEARCH_VIEW_2_POSITIVE_13_NEGATIVE_SOURCE_UNCERTIFIED_PASS");
