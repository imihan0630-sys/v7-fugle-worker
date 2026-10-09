import assert from "node:assert/strict";
import {simulateTaiwanLongDailyPlanV0_1} from "../runtime/execution_simulator_v0_1.mjs";

// AUDIT_LANE exploratory negative probes, no Cloudflare/D1/R2 and no real orders.
// Successful CI means probes executed, NOT that the risk is fixed.
const plan={
  simOrderId:"AUDIT13-V3",entryFillObservationId:"AUDIT13-V3-E",
  exitFillObservationId:"AUDIT13-V3-X",decisionId:"AUDIT13-V3-D",
  strategyId:"SHORT_MOMENTUM",strategyVersion:"AUDIT",
  symbol:"2330",decisionMarketDate:"2026-09-29",
  decisionTimestamp:"2026-09-29T07:30:00Z",
  earliestEligibleMarketDate:"2026-09-30",
  orderType:"BUY_STOP",triggerPrice:100,
  requestedShares:1000,stopPrice:95,targetPrice:108,
  maxHoldingSessions:5,entryValiditySessions:2,
  priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",
  costModel:{costModelVersion:"AUDIT",taxRuleId:"AUDIT",
    commissionRate:0.001,minimumCommission:1,
    transactionTaxRate:0.003,entrySlippageRate:0.001,
    exitSlippageRate:0.001},
  simulatedAt:"2026-10-09T09:00:00Z",
};
const bar=(sessionNumber,marketDate,override={})=>({
  sessionNumber,marketDate,
  availableAt:"2026-10-09T08:00:00Z",
  priceSpace:"ADJUSTED",tradingState:"NORMAL",
  executableLiquidity:"AVAILABLE",limitState:"NONE",
  volumeShares:100000,sourceId:"AUDIT-OFFLINE",
  open:99,high:103,low:97,close:101,
  ...override,
});
const entry=bar(1,"2026-09-30");
const unknownOHLC=bar(2,"2026-10-01",{open:null,high:null,low:null,close:null});
const target=bar(3,"2026-10-02",{open:101,high:110,low:99,close:108});
const stop=bar(3,"2026-10-02",{open:100,high:101,low:94,close:96});
const unknownLiquidity=bar(2,"2026-10-01",{open:101,high:110,low:99,close:108,executableLiquidity:"UNKNOWN"});
const cases=[
  {name:"UNKNOWN_EXIT_THEN_TARGET",sessions:[entry,unknownOHLC,target]},
  {name:"UNKNOWN_EXIT_THEN_STOP",sessions:[entry,unknownOHLC,stop]},
  {name:"UNKNOWN_LIQUIDITY_AT_TARGET_THEN_STOP",sessions:[entry,unknownLiquidity,stop]},
  {name:"UNKNOWN_ENTRY_THEN_LATE_ENTRY_THEN_TARGET",sessions:[
    bar(1,"2026-09-30",{open:null,high:null,low:null,close:null}),
    bar(2,"2026-10-01"),target,
  ]},
];
let unsafe=0,safe=0;
for(const c of cases){
  let output=null,err=null;
  try{output=await simulateTaiwanLongDailyPlanV0_1({...plan,simOrderId:"AUDIT13-"+c.name,sessions:c.sessions});}
  catch(e){err=String(e?.message||e);}
  const unknownWasSeen=(output?.blockedObservations||[]).some(x=>
    x.fillQuality==="DATA_UNKNOWN");
  const silentlyCounted=output?.state==="CLOSED"&&output?.performanceEligible===true&&unknownWasSeen;
  const disposition=silentlyCounted?"UNSAFE":"SAFE";
  if(silentlyCounted)unsafe++;else safe++;
  console.log("AUDIT_CORR013_V3 "+JSON.stringify({
    id:c.name,disposition,
    state:output?.state??null,
    performanceEligible:output?.performanceEligible??null,
    blockedObservations:output?.blockedObservations??[],
    realizedReturnAfterCost:output?.realizedReturnAfterCost??null,
    exception:err,
    reason:"Earlier unobserved potential entry/exit should not be scored as fully proven profitable or losing virtual fill",
  }));
}
assert.equal(cases.length,4);
const clean=await simulateTaiwanLongDailyPlanV0_1({
  ...plan,simOrderId:"AUDIT13-V3-CLEAN",sessions:[entry,bar(2,"2026-10-01",{open:101,high:110,low:99,close:108})],
});
assert.equal(clean.state,"CLOSED");
assert.equal(clean.performanceEligible,true);
assert.equal(clean.blockedObservations.length,0);
console.log("AUDIT_CORR013_V3_SUMMARY "+JSON.stringify({
  total:cases.length,unsafe,safe,
  positiveCleanCloseEligible:clean.performanceEligible,
  confidence:"RESEARCH_OBSERVATION_ONLY_NOT_PHYSICAL_TRADE",
}));
