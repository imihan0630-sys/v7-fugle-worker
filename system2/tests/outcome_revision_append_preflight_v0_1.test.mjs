import assert from "node:assert/strict";
import { buildDecisionOutcomeSnapshotV0_1 } from "../runtime/outcome_tracker_v0_1.mjs";
import {
  simulateTaiwanLongDailyPlanV0_1,toOutcomeSimulatedExecutionV0_1,
} from "../runtime/execution_simulator_v0_1.mjs";
import {
  buildS2FrozenOutcomeRevisionV0_1,toS2FrozenOutcomeRevisionRowV0_1,
} from "../runtime/outcome_revision_archive_v0_1.mjs";
import {
  inspectS2OutcomeRevisionAppendV0_1,
} from "../runtime/outcome_revision_append_preflight_v0_1.mjs";

const decision={
  decisionId:"F08-DRY-D",decisionHash:"d".repeat(64),strategyId:"SHORT_MOMENTUM",
  strategyVersion:"RESEARCH-V1",symbol:"2330",marketDate:"2026-09-29",
  decisionTimestamp:"2026-09-29T07:30:00Z",regimeSnapshotId:"F08-REG",
};
const regime={
  regimeSnapshotId:"F08-REG",regimeHash:"e".repeat(64),
  marketDate:decision.marketDate,decisionTimestamp:decision.decisionTimestamp,
};
const bar=(n,date,close)=>({
  sessionNumber:n,marketDate:date,availableAt:date+"T08:30:00Z",
  priceSpace:"ADJUSTED",open:close,high:close+1,low:close-1,close,
  volumeShares:100000,tradingState:"NORMAL",executableLiquidity:"AVAILABLE",
  limitState:"NONE",sourceId:"SYNTHETIC-TEST",
});
const bars=[bar(1,"2026-09-30",90),bar(2,"2026-10-01",92)];
const sim=await simulateTaiwanLongDailyPlanV0_1({
  simOrderId:"F08-SIM",entryFillObservationId:"F08-ENTRY",
  exitFillObservationId:"F08-EXIT",decisionId:decision.decisionId,
  strategyId:decision.strategyId,strategyVersion:decision.strategyVersion,
  symbol:decision.symbol,decisionMarketDate:decision.marketDate,
  decisionTimestamp:decision.decisionTimestamp,
  earliestEligibleMarketDate:"2026-09-30",orderType:"BUY_STOP",
  triggerPrice:105,requestedShares:1000,stopPrice:85,targetPrice:120,
  maxHoldingSessions:5,entryValiditySessions:2,sessions:bars,
  priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",
  costModel:{
    costModelVersion:"COST-V1",taxRuleId:"TW-TAX-V1",commissionRate:0.001,
    minimumCommission:1,transactionTaxRate:0.003,entrySlippageRate:0.001,
    exitSlippageRate:0.001,
  },
  simulatedAt:"2026-10-02T09:00:00Z",
});
const makeOutcome=(sessions,updatedAt)=>buildDecisionOutcomeSnapshotV0_1({
  decisionId:decision.decisionId,symbol:decision.symbol,
  decisionMarketDate:decision.marketDate,
  decisionTimestamp:decision.decisionTimestamp,
  referencePrice:89,entryPlan:{stopPrice:85,targets:[120]},
  priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",
  sessions,updatedAt,simulatedExecution:toOutcomeSimulatedExecutionV0_1(sim),
});
const outcome1=await makeOutcome([bars[0]],"2026-10-01T09:00:00Z");
const outcome2=await makeOutcome(bars,"2026-10-02T09:00:00Z");
const genesis=await buildS2FrozenOutcomeRevisionV0_1({
  outcome:outcome1,decision,regime,simulation:sim,corporateActionHash:"c".repeat(64),
});
const revision=await buildS2FrozenOutcomeRevisionV0_1({
  outcome:outcome2,decision,regime,simulation:sim,corporateActionHash:"c".repeat(64),
  previousRevision:genesis,
});
const genesisRow=await toS2FrozenOutcomeRevisionRowV0_1(genesis);
const revisionRow=await toS2FrozenOutcomeRevisionRowV0_1(revision);
const parentDecision={
  decision_id:decision.decisionId,decision_hash:decision.decisionHash,
  strategy_id:decision.strategyId,strategy_version:decision.strategyVersion,
  symbol:decision.symbol,market_date:decision.marketDate,
  decision_timestamp:decision.decisionTimestamp,
  regime_snapshot_id:decision.regimeSnapshotId,
};
const parentRegime={
  regime_snapshot_id:regime.regimeSnapshotId,snapshot_hash:regime.regimeHash,
  market_date:regime.marketDate,decision_timestamp:regime.decisionTimestamp,
};

class ReadonlyDb {
  constructor(){this.decision={...parentDecision};this.regime={...parentRegime};
    this.rows=new Map();this.queries=[];this.batchCalls=0;}
  prepare(sql){
    if(!/^SELECT /i.test(sql))throw Error("NON_READ_ONLY_STATEMENT");
    this.queries.push(sql);
    return {bind:(...params)=>({first:async()=>{
      if(sql.includes("FROM s2_decisions "))return this.decision;
      if(sql.includes("FROM s2_market_regime_snapshots "))return this.regime;
      if(sql.includes("WHERE revision_id ="))return this.rows.get(params[0])||null;
      if(sql.includes("WHERE revision_hash ="))return [...this.rows.values()].find(x=>x.revision_hash===params[0])||null;
      if(sql.includes("WHERE decision_id ="))return [...this.rows.values()].find(x=>
        x.decision_id===params[0]&&x.lineage_hash===params[1]&&x.revision_number===params[2])||null;
      throw new Error("UNEXPECTED_SQL");
    }})};
  }
  async batch(){this.batchCalls++;throw Error("WRITES_FORBIDDEN_IN_READONLY_DB");}
}
const db=new ReadonlyDb();
const probe=(receipt,changes={})=>inspectS2OutcomeRevisionAppendV0_1({db,receipt,...changes});
const ready=await probe(genesis);
assert.equal(ready.preflightState,"READY_FOR_ATOMIC_WRITER_REVALIDATION");
assert.equal(ready.readStatementCount,4);
assert.equal(ready.writeAuthorization,false);
assert.equal(ready.costReservationVerified,false);
assert.equal(ready.physicalWriteExecuted,false);
assert.equal(ready.authorizesFinalSelection,false);
assert.equal(ready.system1FormalCoreImpact,false);
assert.equal(Object.isFrozen(ready),true);
assert.ok(ready.readonlyQueries.every(q=>q.sql.startsWith("SELECT ")));

db.rows.set(genesisRow.revision_id,genesisRow);
const repeated=await probe(genesis);
assert.equal(repeated.preflightState,"ALREADY_PRESENT_IDENTICAL");
assert.equal(repeated.readStatementCount,4);
const next=await probe(revision);
assert.equal(next.preflightState,"READY_FOR_ATOMIC_WRITER_REVALIDATION");
assert.equal(next.readStatementCount,5);
db.rows.set(revisionRow.revision_id,revisionRow);
const repeatedNext=await probe(revision);
assert.equal(repeatedNext.preflightState,"ALREADY_PRESENT_IDENTICAL");

await assert.rejects(()=>probe(genesis,{bindingName:"DB"}),/FORBIDDEN_BINDING/);
db.decision={...parentDecision,decision_hash:"f".repeat(64)};
await assert.rejects(()=>probe(genesis),/PARENT_MISMATCH:decision.decisionHash/);
db.decision={...parentDecision,strategy_version:"HINDSIGHT"};
await assert.rejects(()=>probe(genesis),/PARENT_MISMATCH:decision.strategyVersion/);
db.decision={...parentDecision};
db.regime={...parentRegime,snapshot_hash:"f".repeat(64)};
await assert.rejects(()=>probe(genesis),/PARENT_MISMATCH:regime.regimeHash/);
db.regime={...parentRegime};
db.decision=null;
await assert.rejects(()=>probe(genesis),/DECISION_PARENT_MISSING/);
db.decision={...parentDecision};
db.regime=null;
await assert.rejects(()=>probe(genesis),/REGIME_PARENT_MISSING/);
db.regime={...parentRegime};

// Corrupt, non-canonical or missing previous revision is never replaced with a
// synthetic parent. This is a strict physical dependency for F08.
db.rows.delete(genesisRow.revision_id);
await assert.rejects(()=>probe(revision),/PREVIOUS_REVISION_MISSING/);
db.rows.set(genesisRow.revision_id,{...genesisRow,decision_hash:"f".repeat(64)});
await assert.rejects(()=>probe(revision),/STORED_SCALAR_CONFLICT:PREVIOUS/);
db.rows.set(genesisRow.revision_id,genesisRow);
db.rows.set(revisionRow.revision_id,{...revisionRow,observed_at:"1900-01-01T00:00:00Z"});
await assert.rejects(()=>probe(revision),/STORED_SCALAR_CONFLICT:EXISTING/);
db.rows.delete(revisionRow.revision_id);
db.rows.set("FORGED-ID",{
  ...revisionRow,revision_id:"FORGED-ID",revision_hash:"f".repeat(64),
});
await assert.rejects(()=>probe(revision),/REVISION_ID_CONFLICT/);
db.rows.delete("FORGED-ID");
assert.equal(db.batchCalls,0);
assert.ok(db.queries.every(x=>x.startsWith("SELECT ")));
console.log("F08 parent/Regime/previous-revision readback preflight PASS; 0 physical writes");
