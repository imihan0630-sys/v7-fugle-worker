import assert from "node:assert/strict";
import {auditAllocationScores,cappedWaterfillDiagnostic,nominalDeployRatio} from "../research/capital_deployment_cap_audit_v0_1.mjs";

assert.equal(nominalDeployRatio(0),0);
assert.equal(nominalDeployRatio(1),0.35);
assert.equal(nominalDeployRatio(2),0.60);
assert.equal(nominalDeployRatio(3),0.85);

{
  const x=auditAllocationScores([50,50],200000);
  assert.equal(x.capBoundNames,0);
  assert.equal(x.capClippingReserveNTD,0);
  assert.equal(x.actualFormulaCapital,120000);
}
{
  const x=auditAllocationScores([90,10],200000);
  assert.equal(x.capBoundNames,1);
  assert.equal(x.capClippingReservePctOfPool,19);
  assert.equal(x.actualFormulaCapital,82000);
  assert.equal(x.totalFormulaReserveVsNominalNTD,38000);
  const w=cappedWaterfillDiagnostic([90,10],200000);
  assert.equal(w.allocations[0].ratio,0.35);
  assert.equal(w.allocations[1].ratio,0.25);
  assert.equal(w.residualRatio,0);
}
{
  const x=auditAllocationScores([50,50,50],200000);
  assert.equal(x.capBoundNames,0);
  assert.equal(x.nominalDeployCapital,170000);
  assert.equal(x.actualFormulaCapital,168000);
  assert.equal(x.roundingReserveNTD,2000);
  assert.equal(x.roundingReservePctOfPool,1);
}
{
  const x=auditAllocationScores([100,1,1],200000);
  assert.equal(x.capBoundNames,1);
  assert.ok(x.capClippingReservePctOfPool>48);
  assert.ok(x.actualFormulaCapital<80000);
}
console.log(JSON.stringify({
  ok:true,researchOnly:true,decisionImpact:false,
  clipAndCashConfirmed:true,noRedistributionConfirmed:true,
  capReserveSeparatedFromRoundingReserve:true,
  waterfillIsDiagnosticOnly:true
}));
