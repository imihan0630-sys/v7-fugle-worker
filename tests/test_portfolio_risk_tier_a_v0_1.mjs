import assert from "node:assert/strict";
import {
  projectedStopRisk,effectiveCapitalNames,sectorCapitalShares,classifyProjectedCashState,
  equalCapitalCounterfactual,equalPlannedStopRiskCounterfactual,portfolioTierA
} from "../research/portfolio_risk_tier_a_v0_1.mjs";

const plans=[
  {code:"AAA1",buyLow:100,buyHigh:105,stop:95,totalAllocation:50000,sector:"PCB"},
  {code:"BBB2",buyLow:200,buyHigh:210,stop:190,totalAllocation:30000,sector:"PCB"},
  {code:"CCC3",buyLow:50,buyHigh:52,stop:47,totalAllocation:20000,sector:"OPTICAL"}
];

{
  const r=projectedStopRisk(plans[0]);
  assert.equal(r.ok,true);
  assert.equal(r.riskNTDLow,2500);
  assert.equal(r.riskNTDHigh,4761.9);
  assert.equal(r.semantics,"PROJECTED_PLAN_RISK_RANGE_NOT_EXECUTED_LOSS");
}

{
  const bad=projectedStopRisk({code:"X",buyLow:100,buyHigh:105,stop:101,totalAllocation:50000});
  assert.equal(bad.ok,false);
  assert.equal(bad.reason,"STOP_NOT_BELOW_ENTRY_RANGE");
}

{
  const n=effectiveCapitalNames(plans);
  assert.ok(Math.abs(n-2.6316)<0.0002);
}

{
  const s=sectorCapitalShares(plans);
  assert.equal(s.status,"COMPLETE");
  assert.equal(s.shares[0].sector,"PCB");
  assert.equal(s.shares[0].sharePct,80);
}

{
  const zero=classifyProjectedCashState({selectedCount:0,totalCapital:200000,totalPlannedAllocation:0,dataStatus:"COMPLETE"});
  assert.equal(zero.state,"NO_ELIGIBLE_OPPORTUNITY");
  const blocked=classifyProjectedCashState({selectedCount:0,totalCapital:200000,totalPlannedAllocation:0,dataStatus:"INCOMPLETE"});
  assert.equal(blocked.state,"DATA_OR_SIGNAL_BLOCKED");
  const pending=classifyProjectedCashState({selectedCount:3,totalCapital:200000,totalPlannedAllocation:100000,dataStatus:"COMPLETE"});
  assert.equal(pending.state,"PENDING_ENTRY");
  assert.equal(pending.structuralReserveNTD,100000);
}

{
  const e=equalCapitalCounterfactual(plans,200000);
  assert.equal(e.status,"READY");
  assert.equal(e.totalAllocation,100000);
  assert.equal(e.allocations.length,3);
  assert.ok(e.allocations.every(x=>Math.abs(x.allocation-33333.33)<0.02));
}

{
  const e=equalPlannedStopRiskCounterfactual(plans,200000);
  assert.equal(e.status,"READY");
  assert.equal(e.totalAllocation,100000);
  assert.equal(e.allocations.length,3);
  assert.ok(e.allocations[0].allocation!==50000);
}

{
  const out=portfolioTierA(plans,200000);
  assert.equal(out.researchOnly,true);
  assert.equal(out.decisionImpact,false);
  assert.equal(out.plannedDeploymentNTD,100000);
  assert.equal(out.deploymentRatioPct,50);
  assert.equal(out.knownRiskSymbols,3);
  assert.equal(out.correlation20Status,"PIT_HISTORY_REQUIRED");
  assert.equal(out.correlation60Status,"PIT_HISTORY_REQUIRED");
  assert.equal(out.empiricalClusterStatus,"PIT_HISTORY_REQUIRED");
  assert.equal(out.cashState.state,"PENDING_ENTRY");
}

console.log(JSON.stringify({
  ok:true,
  class:"A",
  researchOnly:true,
  decisionImpact:false,
  projectedRiskRange:true,
  portfolioHeat:true,
  effectiveCapitalNames:true,
  sectorCapitalShare:true,
  equalCapitalCounterfactual:true,
  equalPlannedStopRiskCounterfactual:true,
  correlationAndClusterFailClosedWithoutPITHistory:true
}));
