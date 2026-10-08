import assert from "node:assert/strict";
import {simulateTaiwanLongDailyPlanV0_1} from "../runtime/execution_simulator_v0_1.mjs";

// AUDIT_LANE observational, source-isolated deterministic tests.
// "UNSAFE" means the original CORR-013 acceptance gate is NOT met;
// a green CI result only means the adversarial probe completed.
const base={
  simOrderId:"AUDIT13-V2-O",entryFillObservationId:"AUDIT13-V2-E",
  exitFillObservationId:"AUDIT13-V2-X",decisionId:"AUDIT13-V2-D",
  strategyId:"SHORT_MOMENTUM",strategyVersion:"AUDIT-V2",
  symbol:"2330",decisionMarketDate:"2026-09-29",
  decisionTimestamp:"2026-09-29T07:30:00Z",
  earliestEligibleMarketDate:"2026-09-30",
  orderType:"BUY_STOP",triggerPrice:100,requestedShares:1000,
  stopPrice:95,targetPrice:108,maxHoldingSessions:5,
  entryValiditySessions:2,priceSpace:"ADJUSTED",
  corporateActionState:"ADJUSTED",
  costModel:{costModelVersion:"AUDIT",taxRuleId:"AUDIT",
    commissionRate:0.001,minimumCommission:1,
    transactionTaxRate:0.003,entrySlippageRate:0.001,exitSlippageRate:0.001},
  simulatedAt:"2026-10-09T09:00:00Z",
};
const dateRow=(sessionNumber,marketDate,extra={})=>({
  sessionNumber,marketDate,availableAt:"2026-10-09T08:00:00Z",
  priceSpace:"ADJUSTED",tradingState:"NORMAL",
  executableLiquidity:"AVAILABLE",limitState:"NONE",volumeShares:5000000,
  sourceId:"AUDIT-OFFLINE-SYNTHETIC",open:90,high:92,low:89,close:91,...extra,
});
const findings=[];
async function negative(id, sessions, expectedProblem) {
  let actual=null, exception=null;
  try{
    actual=await simulateTaiwanLongDailyPlanV0_1({
      ...base,simOrderId:"AUDIT13-"+id,sessions,
    });
  }catch(error){exception=String(error.message||error);}
  const provenReject=!!exception || (
    actual && ["DATA_INCOMPLETE","INCOMPLETE","AMBIGUOUS","UNKNOWN"].includes(actual.state)
  );
  findings.push({id,expectedProblem,
    disposition:provenReject?"SAFE":"UNSAFE",
    state:actual?.state??null,
    fillQuality:actual?.fillQuality??null,
    blockerCount:actual?.blockedObservations?.length??null,
    performanceEligible:actual?.performanceEligible??null,
    exception,
  });
}
await negative("INVALID_NONEXISTENT_DAY",[dateRow(1,"2026-09-31")],"Strict calendar date validation");
await negative("NONPADDED_DATE",[dateRow(1,"2026-9-30")],"Canonical YYYY-MM-DD required");
await negative("SATURDAY_NO_EXCHANGE_CALENDAR",[dateRow(1,"2026-10-03")],"Market-open evidence required");
await negative("REVERSED_SESSION_DATES",[
  dateRow(1,"2026-10-01"),dateRow(2,"2026-09-30"),
],"Session numbers cannot override date chronology");
await negative("DUPLICATED_SESSION_DATES",[
  dateRow(1,"2026-09-30"),dateRow(2,"2026-09-30"),
],"Unique official market dates");
await negative("UNPROVED_CALENDAR_GAP",[
  dateRow(1,"2026-09-30"),dateRow(2,"2026-10-08"),
],"Missing official sessions cannot be marked no-touch");
await negative("ALL_OHLC_UNKNOWN_DAY_TWO",[
  dateRow(1,"2026-09-30"),dateRow(2,"2026-10-01",
  {open:null,high:null,low:null,close:null}),
],"UNKNOWN trigger window must not become NO_FILL");
await negative("PARTIAL_HIGH_UNKNOWN_DAY_TWO",[
  dateRow(1,"2026-09-30"),dateRow(2,"2026-10-01",{high:null}),
],"Partial UNKNOWN trigger window must not become NO_FILL");
await negative("PARTIAL_LOW_UNKNOWN_DAY_TWO",[
  dateRow(1,"2026-09-30"),dateRow(2,"2026-10-01",{low:null}),
],"Unknown low must remain an incomplete fill proof");

// A positive synthetic no-touch sequence is a reference only. Without an official
// session-calendar receipt, it is NOT real-market proofCompleteNoFill.
const reference=await simulateTaiwanLongDailyPlanV0_1({
  ...base,simOrderId:"AUDIT13-BASELINE",
  sessions:[dateRow(1,"2026-09-30"),dateRow(2,"2026-10-01")],
});
assert.equal(reference.state,"NO_FILL");
assert.equal(reference.performanceEligible,false);
for(const finding of findings){
  assert.ok(["SAFE","UNSAFE"].includes(finding.disposition));
  console.log("AUDIT_CORR013_V2 "+JSON.stringify(finding));
}
assert.equal(findings.length,9);
console.log("AUDIT_CORR013_V2_SUMMARY "+JSON.stringify({
  probeCount:findings.length,
  safe:findings.filter(x=>x.disposition==="SAFE").length,
  unsafe:findings.filter(x=>x.disposition==="UNSAFE").length,
  baselineState:reference.state,
  externalOfficialCalendarEvidence:"NONE",
  confidence:"OBSERVATIONAL_ONLY_NO_PRODUCTION_D1_OR_ORDER",
}));
