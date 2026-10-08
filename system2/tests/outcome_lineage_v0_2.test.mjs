import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import {
  buildDecisionOutcomeSnapshotV0_1,
  validateMonotonicOutcomeUpdateV0_1,
} from "../runtime/outcome_tracker_v0_1.mjs";
import { toOutcomeSimulatedExecutionV0_1 } from "../runtime/execution_simulator_v0_1.mjs";
import {
  buildOutcomeVersionRowV0_2,
  validateMonotonicOutcomeVersionUpdateV0_2,
  verifyOutcomeVersionRowV0_2,
} from "../runtime/outcome_lineage_v0_2.mjs";
import {
  buildOutcomePersistenceBatchV0_2,
  executeOutcomePersistenceBatchV0_2,
} from "../runtime/outcome_persistence_v0_2.mjs";

const marketDate="2026-10-01";
const decisionTimestamp="2026-10-01T07:30:00Z";
const decisionId="D-CORR012-2330";
const symbol="2330";
const decisionHash="d".repeat(64);
const regimeSnapshotId="REG-CORR012";
const regimeHash="e".repeat(64);
const corporateActionHash="c".repeat(64);

const costModel={
  costModelVersion:"COST-V1",
  taxRuleId:"TW-TAX-V1",
  commissionRate:0.001,
  minimumCommission:1,
  transactionTaxRate:0.003,
  entrySlippageRate:0.001,
  exitSlippageRate:0.001,
  commissionSemantics:"MAX_RATE_OR_MINIMUM_PER_FILL",
  taxSemantics:"SELL_SIDE_ONLY",
};

async function simulation(overrides={}){
  const base={
    order:{
      simOrderId:"SO-CORR012",
      decisionId,
      strategyId:"SHORT_MOMENTUM",
      strategyVersion:"V0.1-CONTRACT",
      symbol,
      decisionTimestamp,
      earliestEligibleMarketDate:"2026-10-02",
      side:"BUY",
      orderType:"BUY_STOP",
      triggerPrice:101,
      limitPrice:null,
      requestedShares:1000,
      stopPrice:95,
      targetPrice:110,
      maxHoldingSessions:5,
      entryValiditySessions:2,
      priceSpace:"ADJUSTED",
      corporateActionState:"ADJUSTED",
      costModel,
      sourceProvenance:{fixture:true},
      executionVersion:"S2_TW_DAILY_EXECUTION_SIMULATOR_V0_1",
    },
    sessions:[],
    fills:[],
    state:"CLOSED",
    entryFill:null,
    exitFill:null,
    holdingSessions:4,
    grossReturn:0.10,
    realizedReturnAfterCost:0.09,
    fillQuality:"FILLED_WITH_SLIPPAGE",
    ambiguityReason:null,
    possibleOutcomes:[],
    blockedObservations:[],
    simulatedAt:"2026-10-08T09:00:00Z",
    performanceEligible:true,
    executionVersion:"S2_TW_DAILY_EXECUTION_SIMULATOR_V0_1",
    ...overrides,
  };
  return {...base,executionHash:await sha256Hex(base)};
}

function session(n,date,close){
  return {
    sessionNumber:n,
    marketDate:date,
    availableAt:date+"T08:30:00Z",
    priceSpace:"ADJUSTED",
    open:close-1,
    high:close+2,
    low:close-2,
    close,
  };
}

async function snapshot(sessions,sim,updatedAt){
  return buildDecisionOutcomeSnapshotV0_1({
    decisionId,
    symbol,
    decisionMarketDate:marketDate,
    decisionTimestamp,
    referencePrice:100,
    entryPlan:{stopPrice:95,targets:[110]},
    sessions,
    benchmarkReferenceClose:1000,
    industryReferenceClose:200,
    costScenarios:[{
      scenarioId:"SIGNAL_COST_BASE",
      roundTripCostRate:0.004,
    }],
    priceSpace:"ADJUSTED",
    corporateActionState:"ADJUSTED",
    updatedAt,
    simulatedExecution:toOutcomeSimulatedExecutionV0_1(sim),
  });
}

const decisionLineage={
  decisionId,
  decisionHash,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  symbol,
  marketDate,
  decisionTimestamp,
  regimeSnapshotId,
};
const regimeLineage={regimeSnapshotId,regimeHash};

const sim=await simulation();
const day1=await snapshot([session(1,"2026-10-02",102)],sim,"2026-10-02T09:00:00Z");
const day3=await snapshot([
  session(1,"2026-10-02",102),
  session(2,"2026-10-05",104),
  session(3,"2026-10-06",108),
],sim,"2026-10-06T09:00:00Z");

const row1=await buildOutcomeVersionRowV0_2({
  snapshot:day1,decisionLineage,regimeLineage,corporateActionHash,simulation:sim,
});
const row3=await buildOutcomeVersionRowV0_2({
  snapshot:day3,decisionLineage,regimeLineage,corporateActionHash,simulation:sim,
});
assert.equal(row1.outcome_version_id,row3.outcome_version_id);
assert.equal(row1.lineage_hash,row3.lineage_hash);
assert.equal(row1.strategy_id,"SHORT_MOMENTUM");
assert.equal(row1.regime_hash,regimeHash);
assert.equal(row1.execution_hash,sim.executionHash);
assert.match(row1.cost_model_hash,/^[a-f0-9]{64}$/);
assert.equal(row1.cost_model_version,"COST-V1");
assert.equal(row1.tax_rule_id,"TW-TAX-V1");
assert.equal(row1.simulated_net_return_after_cost,0.09);
assert.equal(JSON.parse(row1.signal_cost_scenarios_json).SIGNAL_COST_BASE.roundTripCostRate,0.004);
assert.notEqual(
  JSON.parse(row1.signal_returns_json).stock.D1,
  row1.simulated_net_return_after_cost,
);
assert.equal((await verifyOutcomeVersionRowV0_2(row1)).valid,true);

const mature=await validateMonotonicOutcomeVersionUpdateV0_2(row1,row3);
assert.equal(mature.updateAllowed,true);
assert.deepEqual(mature.blockers,[]);

// AP-05 direct legacy witness must now fail closed explicitly.
const ap05Old={
  decision_id:"D-AP05",
  d1_return:0.05,d3_return:0.07,d5_return:null,d10_return:null,d20_return:null,
  mfe:0.15,mae:-0.04,target_hit_session:null,stop_hit_session:null,
  ambiguous_same_bar:0,realized_return_after_cost:0.09,holding_sessions:4,
  outcome_json:JSON.stringify({
    strategyId:"SHORT_MOMENTUM",
    costModel:"COST_V1",
    simulatedExecution:{state:"CLOSED"},
  }),
  updated_at:"2026-10-07T09:00:00Z",
};
const ap05Next={
  ...ap05Old,
  mfe:null,
  mae:null,
  holding_sessions:10,
  outcome_json:JSON.stringify({
    strategyId:"SWING_GROWTH",
    costModel:"COST_V99",
    simulatedExecution:{state:"CLOSED"},
  }),
  updated_at:"2026-10-08T09:00:00Z",
};
const ap05=validateMonotonicOutcomeUpdateV0_1(ap05Old,ap05Next);
assert.equal(ap05.updateAllowed,false);
assert.ok(ap05.blockers.includes("MFE_ERASURE"));
assert.ok(ap05.blockers.includes("MAE_ERASURE"));
assert.ok(ap05.blockers.includes("CLOSED_HOLDING_SESSIONS_REVISION"));
assert.ok(ap05.blockers.includes("OUTCOME_JSON_PROVENANCE_REVISION:strategyId"));
assert.ok(ap05.blockers.includes("OUTCOME_JSON_PROVENANCE_REVISION:costModel"));

// Cost/execution assumption change must be a distinct version.
const costV2={...costModel,costModelVersion:"COST-V2",commissionRate:0.002};
const sim2Base={
  ...sim,
  order:{...sim.order,costModel:costV2},
};
delete sim2Base.executionHash;
const sim2={...sim2Base,executionHash:await sha256Hex(sim2Base)};
const day3CostV2=await snapshot([
  session(1,"2026-10-02",102),
  session(2,"2026-10-05",104),
  session(3,"2026-10-06",108),
],sim2,"2026-10-06T09:00:00Z");
const rowCostV2=await buildOutcomeVersionRowV0_2({
  snapshot:day3CostV2,decisionLineage,regimeLineage,corporateActionHash,simulation:sim2,
});
assert.notEqual(rowCostV2.outcome_version_id,row3.outcome_version_id);
assert.notEqual(rowCostV2.execution_hash,row3.execution_hash);
assert.notEqual(rowCostV2.cost_model_hash,row3.cost_model_hash);
assert.equal(rowCostV2.cost_model_version,"COST-V2");

// Tamper detection.
await assert.rejects(
  ()=>verifyOutcomeVersionRowV0_2({...row3,outcome_hash:"0".repeat(64)}),
  /OUTCOME_ROW_HASH_MISMATCH/,
);
await assert.rejects(
  ()=>verifyOutcomeVersionRowV0_2({...row3,lineage_hash:"1".repeat(64)}),
  /OUTCOME_LINEAGE_HASH_MISMATCH/,
);

class MockStatement{
  constructor(db,sql){this.db=db;this.sql=sql;this.params=[];}
  bind(...params){this.params=params;return this;}
  async first(){
    const m=this.sql.match(/FROM\s+(s2_[A-Za-z0-9_]+)\s+WHERE\s+([A-Za-z0-9_]+)\s*=\s*\?/i);
    if(!m)return null;
    return this.db.rows.get(`${m[1]}|${this.params[0]}`)??null;
  }
}
class MockDb{
  constructor(){this.rows=new Map();this.batchCalls=0;}
  prepare(sql){return new MockStatement(this,sql);}
  async batch(statements){
    this.batchCalls+=1;
    const results=[];
    for(const s of statements){
      const insert=s.sql.match(/^INSERT INTO\s+(s2_[A-Za-z0-9_]+)\s*\(([^)]+)\)/i);
      if(insert){
        const table=insert[1];
        const cols=insert[2].split(",").map(x=>x.trim());
        const row=Object.fromEntries(cols.map((col,i)=>[col,s.params[i]]));
        const idCol=table==="s2_outcome_versions"?"outcome_version_id":
          table==="s2_sim_orders"?"sim_order_id":"sim_fill_id";
        this.rows.set(`${table}|${row[idCol]}`,row);
        results.push({success:true,meta:{changes:1}});
        continue;
      }
      const update=s.sql.match(/^UPDATE\s+s2_outcome_versions\s+SET\s+(.+)\s+WHERE\s+outcome_version_id\s*=\s*\?\s+AND\s+updated_at\s*=\s*\?/i);
      if(!update)throw new Error("unexpected SQL: "+s.sql);
      const cols=update[1].split(",").map(x=>x.trim().split(/\s*=\s*/)[0]);
      const id=s.params[cols.length];
      const priorAt=s.params[cols.length+1];
      const key=`s2_outcome_versions|${id}`;
      const old=this.rows.get(key);
      if(!old||old.updated_at!==priorAt){results.push({success:true,meta:{changes:0}});continue;}
      this.rows.set(key,{...old,...Object.fromEntries(cols.map((col,i)=>[col,s.params[i]]))});
      results.push({success:true,meta:{changes:1}});
    }
    return results;
  }
}

const db=new MockDb();
db.rows.set(`s2_decisions|${decisionId}`,{
  decision_id:decisionId,decision_hash:decisionHash,
  strategy_id:"SHORT_MOMENTUM",strategy_version:"V0.1-CONTRACT",symbol,
  market_date:marketDate,decision_timestamp:decisionTimestamp,
  regime_snapshot_id:regimeSnapshotId,
});
db.rows.set(`s2_market_regime_snapshots|${regimeSnapshotId}`,{
  regime_snapshot_id:regimeSnapshotId,market_date:marketDate,
  decision_timestamp:decisionTimestamp,snapshot_hash:regimeHash,
});

const batch1=await buildOutcomePersistenceBatchV0_2({
  batchId:"OPV2-D1",marketDate,decisionTimestamp,outcomeVersionRow:row1,
  createdAt:"2026-10-02T09:01:00Z",
});
const first=await executeOutcomePersistenceBatchV0_2({db,batch:batch1});
assert.equal(first.insertedCount,1);
assert.equal(first.updatedCount,0);
assert.equal(first.statementLedger.executedMutationKinds.includes("INSERT"),true);

const batch3=await buildOutcomePersistenceBatchV0_2({
  batchId:"OPV2-D3",marketDate,decisionTimestamp,outcomeVersionRow:row3,
  createdAt:"2026-10-06T09:01:00Z",
});
const updated=await executeOutcomePersistenceBatchV0_2({db,batch:batch3});
assert.equal(updated.updatedCount,1);
assert.equal(db.rows.get(`s2_outcome_versions|${row3.outcome_version_id}`).d3_return,row3.d3_return);

// New cost model is a distinct insert, never an in-place update.
const batchCostV2=await buildOutcomePersistenceBatchV0_2({
  batchId:"OPV2-COSTV2",marketDate,decisionTimestamp,outcomeVersionRow:rowCostV2,
  createdAt:"2026-10-06T09:02:00Z",
});
const costInserted=await executeOutcomePersistenceBatchV0_2({db,batch:batchCostV2});
assert.equal(costInserted.insertedCount,1);
assert.equal(costInserted.updatedCount,0);
assert.equal(db.rows.has(`s2_outcome_versions|${row3.outcome_version_id}`),true);
assert.equal(db.rows.has(`s2_outcome_versions|${rowCostV2.outcome_version_id}`),true);

const badParentDb=new MockDb();
badParentDb.rows.set(`s2_decisions|${decisionId}`,{
  decision_id:decisionId,decision_hash:"9".repeat(64),
  strategy_id:"SHORT_MOMENTUM",strategy_version:"V0.1-CONTRACT",symbol,
  market_date:marketDate,decision_timestamp:decisionTimestamp,
  regime_snapshot_id:regimeSnapshotId,
});
badParentDb.rows.set(`s2_market_regime_snapshots|${regimeSnapshotId}`,{
  regime_snapshot_id:regimeSnapshotId,market_date:marketDate,
  decision_timestamp:decisionTimestamp,snapshot_hash:regimeHash,
});
await assert.rejects(
  ()=>executeOutcomePersistenceBatchV0_2({db:badParentDb,batch:batch1}),
  /OUTCOME_V2_LINEAGE_MISMATCH:outcome.decisionHash/,
);
assert.equal(badParentDb.batchCalls,0);

console.log("System2 outcome lineage/persistence V0.2 tests PASS");
