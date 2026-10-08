import assert from "node:assert/strict";
import {validateMonotonicOutcomeUpdateV0_1} from "../runtime/outcome_tracker_v0_1.mjs";
import {simulateTaiwanLongDailyPlanV0_1} from "../runtime/execution_simulator_v0_1.mjs";

// AUDIT_LANE research-only independent observation. SAFE/UNSAFE is the measured
// security result, not the GitHub Actions workflow conclusion.
const findings=[];
const previous={
  decision_id:"AUDIT-012",d1_return:0.02,d3_return:null,d5_return:null,
  d10_return:null,d20_return:null,target_hit_session:null,
  stop_hit_session:null,ambiguous_same_bar:0,mfe:0.15,mae:-0.04,
  realized_return_after_cost:0.07,holding_sessions:4,
  outcome_json:JSON.stringify({strategyId:"SHORT_MOMENTUM",costModel:"COST_V1"}),
  updated_at:"2026-10-08T08:00:00Z",
};
function probeOutcome(id,changes){
  const next={...previous,...changes,updated_at:"2026-10-09T08:00:00Z"};
  const checked=validateMonotonicOutcomeUpdateV0_1(previous,next);
  findings.push({id,correction:"012",state:checked.updateAllowed?"UNSAFE":"SAFE",blockers:checked.blockers});
}
probeOutcome("COST_JSON_ONLY_CHANGE",{
  outcome_json:JSON.stringify({strategyId:"SHORT_MOMENTUM",costModel:"COST_V99"}),
});
probeOutcome("STRATEGY_JSON_ONLY_CHANGE",{
  outcome_json:JSON.stringify({strategyId:"SWING_GROWTH",costModel:"COST_V1"}),
});
probeOutcome("CLOSED_HOLDING_ONLY_CHANGE",{holding_sessions:11});
probeOutcome("MFE_ERASE_ONLY",{mfe:null});
probeOutcome("MAE_ERASE_ONLY",{mae:null});

const simBase={
  simOrderId:"AUDIT-013-O",entryFillObservationId:"AUDIT-013-E",
  exitFillObservationId:"AUDIT-013-X",decisionId:"AUDIT-013-D",
  strategyId:"SHORT_MOMENTUM",strategyVersion:"AUDIT-SHADOW",
  symbol:"2330",decisionMarketDate:"2026-09-29",
  decisionTimestamp:"2026-09-29T07:30:00Z",
  earliestEligibleMarketDate:"2026-09-30",
  orderType:"BUY_STOP",triggerPrice:100,requestedShares:1000,
  stopPrice:95,targetPrice:108,maxHoldingSessions:5,
  entryValiditySessions:2,priceSpace:"ADJUSTED",
  corporateActionState:"ADJUSTED",
  costModel:{costModelVersion:"AUDIT",taxRuleId:"AUDIT",
    commissionRate:0.001,minimumCommission:1,
    transactionTaxRate:0.003,entrySlippageRate:0.001,
    exitSlippageRate:0.001},
  simulatedAt:"2026-10-09T09:00:00Z",
};
const session=(n,date,extra={})=>({
  sessionNumber:n,marketDate:date,
  availableAt:"2026-10-09T08:00:00Z",
  priceSpace:"ADJUSTED",tradingState:"NORMAL",
  executableLiquidity:"AVAILABLE",limitState:"NONE",volumeShares:5000000,
  sourceId:"AUDIT-OFFLINE",open:90,high:92,low:89,close:91,...extra,
});
async function probeSim(id,sessions){
  let state=null,error=null;
  try{
    const receipt=await simulateTaiwanLongDailyPlanV0_1({...simBase,simOrderId:"AUDIT-"+id,sessions});
    state=receipt.state;
  }catch(e){error=String(e.message??e)}
  findings.push({
    id,correction:"013",
    state:error?"SAFE":"UNSAFE",
    accepted:!error,observedState:state,error,
  });
}
await probeSim("INVALID_SEPTEMBER_31",[session(1,"2026-09-31")]);
await probeSim("DUPLICATE_DATE",[
  session(1,"2026-09-30"),session(2,"2026-09-30"),
]);
await probeSim("UNPROVED_OFFICIAL_SESSION_GAP",[
  session(1,"2026-09-30"),session(2,"2026-10-08"),
]);
await probeSim("PARTIAL_UNKNOWN_OHLC_WINDOW",[
  session(1,"2026-09-30"),
  session(2,"2026-10-01",{open:null,high:null,low:null,close:null}),
]);

assert.equal(findings.length,9);
for(const f of findings){
  assert.ok(["SAFE","UNSAFE"].includes(f.state));
  console.log("SYSTEM2_AUDIT_CORR012013 "+JSON.stringify(f));
}
console.log("CORR-012/013 nine independent observational probes executed. A passing workflow is NOT a defect-closure signal.");
