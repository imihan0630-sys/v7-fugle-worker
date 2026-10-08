import assert from "node:assert/strict";
import { buildSystem2PersistenceBatch } from "../runtime/persistence_batch.mjs";
import { executeSystem2PersistenceBatch } from "../runtime/persistence_executor.mjs";
import { validateMonotonicOutcomeUpdateV0_1 } from "../runtime/outcome_tracker_v0_1.mjs";
import { simulateTaiwanLongDailyPlanV0_1 } from "../runtime/execution_simulator_v0_1.mjs";

// AUDIT_LANE only. This is a non-blocking *observational* adversarial witness,
// not a "security tests passed" or production acceptance claim. On each CI run
// emit SAFE/UNSAFE for each frozen negative probe. BUILD owns implementation.
const results = [];

class DryRunStatement {
  constructor(sql) { this.sql=sql; this.params=[]; }
  bind(...params) { this.params=params; return this; }
  async first() { return null; }
}
class DryRunDb {
  prepared=[];
  transportCalls=0;
  executed=[];
  prepare(sql) { this.prepared.push(sql); return new DryRunStatement(sql); }
  async batch(statements) {
    this.transportCalls++;
    this.executed.push(...statements.map(x=>x.sql));
    return statements.map(()=>({success:true}));
  }
}

const baseBatch = await buildSystem2PersistenceBatch({
  batchId:"AUDIT-AP08-20261008",
  marketDate:"2026-10-08",
  decisionTimestamp:"2026-10-08T07:30:00Z",
  createdAt:"2026-10-08T07:31:00Z",
  records:[{table:"s2_source_session_receipts",row:{
    receipt_id:"AUDIT-AP08",market_date:"2026-10-08",
    decision_timestamp:"2026-10-08T07:30:00Z",
    source_session_state:"SOURCE_SESSION_READY"
  }}]
});
const tamperedBatch=JSON.parse(JSON.stringify(baseBatch));
tamperedBatch.operations[0].sql.insertSql=
  "UPDATE s2_decisions SET symbol = '9999' WHERE decision_id = 'FOREIGN'";
tamperedBatch.operations[0].sql.insertParams=[];
const dryDb=new DryRunDb();
let mutationError=null,mutationReceipt=null;
try {
  mutationReceipt=await executeSystem2PersistenceBatch({db:dryDb,batch:tamperedBatch});
} catch (error) { mutationError=String(error?.message??error); }
const mutationSent=dryDb.executed.some(sql=>/^UPDATE\s+s2_decisions/i.test(sql.trim()));
assert.equal(dryDb.transportCalls,mutationSent?1:0,
  "dry-run must account for every SQL dispatch");
results.push({
  directive:"S2-CORR-20261008-011",
  probe:"AP-08-CALLER-UPDATE-AS-INSERT",
  state:mutationSent?"UNSAFE":"SAFE",
  mutationTransportCalls:dryDb.transportCalls,
  reportedInsert:mutationReceipt?.insertedCount??null,
  rejectedReason:mutationError,
  sqlWasDryRunOnly:true
});

const oldOutcome={
  decision_id:"AUDIT-AP05",d1_return:0.02,d3_return:null,
  d5_return:null,d10_return:null,d20_return:null,
  target_hit_session:null,stop_hit_session:null,
  ambiguous_same_bar:0,mfe:0.15,mae:-0.04,
  realized_return_after_cost:0.09,
  holding_sessions:4,
  outcome_json:JSON.stringify({strategyId:"SHORT_MOMENTUM",costModel:"COST_V1"}),
  updated_at:"2026-10-07T09:00:00Z"
};
const tamperedOutcome={
  ...oldOutcome,mfe:null,mae:null,holding_sessions:10,
  outcome_json:JSON.stringify({strategyId:"SWING_GROWTH",costModel:"COST_V99"}),
  updated_at:"2026-10-08T09:00:00Z"
};
const updateResult=validateMonotonicOutcomeUpdateV0_1(oldOutcome,tamperedOutcome);
assert.equal(updateResult.updateAllowed,updateResult.blockers.length===0,
  "validator updateAllowed must match returned blockers");
results.push({
  directive:"S2-CORR-20261008-012",
  probe:"AP-05-MFE-MAE-HOLDING-COST-LINEAGE-REVISION",
  state:updateResult.updateAllowed?"UNSAFE":"SAFE",
  blockerCodes:[...updateResult.blockers],
  previousMfe:oldOutcome.mfe,nextMfe:tamperedOutcome.mfe,
  previousHolding:oldOutcome.holding_sessions,
  nextHolding:tamperedOutcome.holding_sessions
});

const simBase={
  simOrderId:"AUDIT-AP06-ORDER",entryFillObservationId:"AUDIT-AP06-E",
  exitFillObservationId:"AUDIT-AP06-X",decisionId:"AUDIT-AP06-D",
  strategyId:"SHORT_MOMENTUM",strategyVersion:"V0.1-CONTRACT",
  symbol:"2330",decisionMarketDate:"2026-09-29",
  decisionTimestamp:"2026-09-29T07:30:00Z",
  earliestEligibleMarketDate:"2026-09-30",
  orderType:"BUY_STOP",triggerPrice:100,requestedShares:1000,
  stopPrice:95,targetPrice:108,maxHoldingSessions:5,
  entryValiditySessions:1,priceSpace:"ADJUSTED",
  corporateActionState:"ADJUSTED",
  costModel:{costModelVersion:"AUDIT-COST-V1",taxRuleId:"AUDIT-TAX-V1",
    commissionRate:0.001,minimumCommission:1,
    transactionTaxRate:0.003,entrySlippageRate:0.001,
    exitSlippageRate:0.001},
  simulatedAt:"2026-10-03T09:00:00Z"
};
function session(number,date,prices={}) {
  return {sessionNumber:number,marketDate:date,availableAt:date+"T08:30:00Z",
    priceSpace:"ADJUSTED",tradingState:"NORMAL",
    executableLiquidity:"AVAILABLE",limitState:"NONE",
    volumeShares:5000000,sourceId:"AUDIT-DRYRUN",...prices};
}
const missingOhlc=await simulateTaiwanLongDailyPlanV0_1({
  ...simBase,sessions:[session(1,"2026-09-30",
    {open:null,high:null,low:null,close:null})]
});
const unknownIsNoFill=missingOhlc.state==="NO_FILL";
results.push({
  directive:"S2-CORR-20261008-013",
  probe:"AP-06-MISSING-OHLC-PROOF-INCOMPLETE-NO-FILL",
  state:unknownIsNoFill?"UNSAFE":"SAFE",
  observedState:missingOhlc.state,
  observedFillQuality:missingOhlc.fillQuality,
  blockedObservationCount:missingOhlc.blockedObservations?.length??null
});
let reverseDateError=null,reverseDateAccepted=false,reverseDateState=null;
try {
  const value=await simulateTaiwanLongDailyPlanV0_1({
    ...simBase,simOrderId:"AUDIT-AP06-REVERSE",entryValiditySessions:2,
    sessions:[
      session(1,"2026-10-01",{open:90,high:92,low:89,close:91}),
      session(2,"2026-09-30",{open:90,high:92,low:89,close:91})
    ]
  });
  reverseDateAccepted=true;
  reverseDateState=value.state;
} catch(error){reverseDateError=String(error?.message??error);}
results.push({
  directive:"S2-CORR-20261008-013",
  probe:"AP-06-REVERSED-MARKET-DATE-SEQUENCE",
  state:reverseDateAccepted?"UNSAFE":"SAFE",
  accepted:reverseDateAccepted,
  observedState:reverseDateState,
  rejectedReason:reverseDateError
});

assert.equal(results.length,4,"all four independent adversarial probes must execute");
assert.deepEqual(
  [...new Set(results.map(x=>x.directive))].sort(),
  ["S2-CORR-20261008-011","S2-CORR-20261008-012","S2-CORR-20261008-013"]
);
// Observational probes do not assert a defective state forever: SAFE means
// BUILD may have fixed the issue and the independent auditor must re-verify.
// UNSAFE means a current, reproducible blocker. Neither grants closure.
for(const row of results){
  assert.ok(["SAFE","UNSAFE"].includes(row.state));
  console.log("SYSTEM2_INDEPENDENT_AUDIT_PROBE "+JSON.stringify(row));
}
console.log("Independent audit probes executed; SAFE/UNSAFE findings are in logs, not a closure claim.");
