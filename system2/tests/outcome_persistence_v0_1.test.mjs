import assert from "node:assert/strict";
import {
  buildOutcomePersistenceBatchV0_1,
  executeOutcomePersistenceBatchV0_1,
} from "../runtime/outcome_persistence_v0_1.mjs";

const outcomeRow={
  decision_id:"D-LEGACY",
  d1_return:0.01,d3_return:null,d5_return:null,d10_return:null,d20_return:null,
  mfe:0.02,mae:-0.01,target_hit_session:null,stop_hit_session:null,
  ambiguous_same_bar:0,realized_return_after_cost:null,holding_sessions:null,
  outcome_json:JSON.stringify({
    decisionId:"D-LEGACY",
    symbol:"2330",
    decisionMarketDate:"2026-10-01",
    decisionTimestamp:"2026-10-01T07:30:00Z",
    priceSpace:"ADJUSTED",
    corporateActionState:"ADJUSTED",
  }),
  updated_at:"2026-10-02T09:00:00Z",
};

const batch=await buildOutcomePersistenceBatchV0_1({
  batchId:"LEGACY-BATCH",
  marketDate:"2026-10-01",
  decisionTimestamp:"2026-10-01T07:30:00Z",
  outcomeRow,
  createdAt:"2026-10-02T09:01:00Z",
});
assert.equal(batch.operationCount,1);
assert.equal(batch.mutableTable,"s2_outcomes");
assert.match(batch.batchHash,/^[a-f0-9]{64}$/);

const db={
  prepare(){ throw new Error("legacy writer must fail before prepare"); },
  async batch(){ throw new Error("legacy writer must fail before batch"); },
};
await assert.rejects(
  ()=>executeOutcomePersistenceBatchV0_1({db,batch}),
  /LEGACY_OUTCOME_PERSISTENCE_V0_1_DISABLED_USE_V0_2/,
);

await assert.rejects(
  ()=>buildOutcomePersistenceBatchV0_1({
    batchId:"LEGACY-DUP",
    marketDate:"2026-10-01",
    decisionTimestamp:"2026-10-01T07:30:00Z",
    outcomeRows:[outcomeRow,outcomeRow],
    createdAt:"2026-10-02T09:01:00Z",
  }),
  /duplicate persistence identity/,
);

console.log("System2 legacy outcome persistence V0.1 is builder-only; execution disabled PASS");
