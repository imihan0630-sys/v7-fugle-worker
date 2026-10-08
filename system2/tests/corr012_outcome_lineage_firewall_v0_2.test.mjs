import assert from "node:assert/strict";
import {
  buildDecisionOutcomeSnapshotV0_1,
  toS2OutcomeVersionRowV0_2,
  validateMonotonicOutcomeUpdateV0_1,
  verifyDecisionOutcomeSnapshotV0_2,
} from "../runtime/outcome_tracker_v0_1.mjs";

// Reproduce the five independent CORR-012 negative witnesses exactly enough
// to preserve their original semantics.
const previous={
  decision_id:"AUDIT-012",d1_return:0.02,d3_return:null,d5_return:null,
  d10_return:null,d20_return:null,target_hit_session:null,
  stop_hit_session:null,ambiguous_same_bar:0,mfe:0.15,mae:-0.04,
  realized_return_after_cost:0.07,holding_sessions:4,
  outcome_json:JSON.stringify({strategyId:"SHORT_MOMENTUM",costModel:"COST_V1"}),
  updated_at:"2026-10-08T08:00:00Z",
};

function checked(changes){
  return validateMonotonicOutcomeUpdateV0_1(previous,{
    ...previous,
    ...changes,
    updated_at:"2026-10-09T08:00:00Z",
  });
}

const costRewrite=checked({
  outcome_json:JSON.stringify({strategyId:"SHORT_MOMENTUM",costModel:"COST_V99"}),
});
assert.equal(costRewrite.updateAllowed,false);
assert.ok(costRewrite.blockers.includes("IMMUTABLE_OUTCOME_PROVENANCE_REVISION:costModel"));

const strategyRewrite=checked({
  outcome_json:JSON.stringify({strategyId:"SWING_GROWTH",costModel:"COST_V1"}),
});
assert.equal(strategyRewrite.updateAllowed,false);
assert.ok(strategyRewrite.blockers.includes("IMMUTABLE_OUTCOME_PROVENANCE_REVISION:strategyId"));

const holdingRewrite=checked({holding_sessions:11});
assert.equal(holdingRewrite.updateAllowed,false);
assert.ok(holdingRewrite.blockers.includes("CLOSED_HOLDING_SESSIONS_REVISION"));

const mfeErase=checked({mfe:null});
assert.equal(mfeErase.updateAllowed,false);
assert.ok(mfeErase.blockers.includes("MFE_ERASED"));

const maeErase=checked({mae:null});
assert.equal(maeErase.updateAllowed,false);
assert.ok(maeErase.blockers.includes("MAE_ERASED"));

// Legal monotonic maturation remains allowed.
const immature={
  ...previous,
  realized_return_after_cost:null,
  holding_sessions:1,
  mfe:null,
  mae:null,
  outcome_json:JSON.stringify({strategyId:"SHORT_MOMENTUM",costModel:"COST_V1"}),
};
const matured={
  ...immature,
  d3_return:0.03,
  mfe:0.18,
  mae:-0.06,
  holding_sessions:3,
  updated_at:"2026-10-09T08:00:00Z",
};
const maturation=validateMonotonicOutcomeUpdateV0_1(immature,matured);
assert.equal(maturation.updateAllowed,true);
assert.deepEqual(maturation.blockers,[]);

// V0.2 closed-lineage identity changes when cost scenario assumptions change.
const common={
  decisionId:"D-CORR012",
  decisionHash:"a".repeat(64),
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  regimeSnapshotId:"REG-CORR012",
  regimeHash:"b".repeat(64),
  corporateActionLineageHash:"c".repeat(64),
  symbol:"2330",
  decisionMarketDate:"2026-10-08",
  decisionTimestamp:"2026-10-08T07:30:00Z",
  referencePrice:100,
  entryPlan:{stopPrice:95,targets:[108]},
  sessions:[{
    sessionNumber:1,
    marketDate:"2026-10-09",
    availableAt:"2026-10-09T08:30:00Z",
    priceSpace:"ADJUSTED",
    open:100,high:103,low:98,close:102,
  }],
  priceSpace:"ADJUSTED",
  corporateActionState:"ADJUSTED",
  updatedAt:"2026-10-09T09:00:00Z",
};
const v1=await buildDecisionOutcomeSnapshotV0_1({
  ...common,
  costScenarios:[{scenarioId:"BASE",roundTripCostRate:0.004,note:"base"}],
});
const v2=await buildDecisionOutcomeSnapshotV0_1({
  ...common,
  costScenarios:[{scenarioId:"BASE",roundTripCostRate:0.006,note:"changed"}],
});
assert.notEqual(v1.costScenarioSetHash,v2.costScenarioSetHash);
assert.notEqual(v1.outcomeVersionId,v2.outcomeVersionId);
assert.equal((await verifyDecisionOutcomeSnapshotV0_2(v1)).valid,true);
assert.equal((await verifyDecisionOutcomeSnapshotV0_2(v2)).valid,true);

// Signal return remains physically separate from simulated realized return columns.
const row=toS2OutcomeVersionRowV0_2(v1);
assert.equal(row.realized_return_after_cost,null);
assert.equal(row.simulated_execution_json,null);
const signalPayload=JSON.parse(row.signal_return_json);
assert.equal(
  signalPayload.semantics,
  "SIGNAL_PRICE_RETURNS_AND_SCENARIO_ESTIMATES_NOT_SIMULATED_REALIZED_RETURN",
);
assert.notEqual(signalPayload.horizonReturns.D1,null);

// Full snapshot tampering is detected even if the stored claimed hash is left unchanged.
const tampered={
  ...v1,
  horizonReturns:{...v1.horizonReturns,D1:0.99},
};
const tamperedCheck=await verifyDecisionOutcomeSnapshotV0_2(tampered);
assert.equal(tamperedCheck.valid,false);
assert.ok(tamperedCheck.blockers.includes("OUTCOME_HASH_MISMATCH"));

console.log("CORR-012 outcome lineage firewall V0.2 adversarial tests PASS");
