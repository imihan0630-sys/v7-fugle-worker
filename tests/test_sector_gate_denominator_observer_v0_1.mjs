import assert from "node:assert/strict";
import {observeSectorGateDenominators} from "../research/sector_gate_denominator_observer_v0_1.mjs";

// Missing changePercent is counted in breadth denominator as non-advance,
// but excluded from avgChange denominator.
{
  const rows=[
    {symbol:"1001",changePercent:1,tradeValue:100},
    {symbol:"1002",changePercent:-1,tradeValue:100},
    {symbol:"1003",changePercent:null,tradeValue:100},
    {symbol:"1004",changePercent:null,tradeValue:100}
  ];
  const features=rows.map(r=>({symbol:r.symbol,historyDays:30,avgAmount20:100}));
  const o=observeSectorGateDenominators({industryRows:rows,industryFeatures:features});
  assert.equal(o.deployed.breadth,25);
  assert.equal(o.evidence.observedOnlyBreadth,50);
  assert.equal(o.deployed.diagnostics.breadthDenominator,4);
  assert.equal(o.deployed.diagnostics.avgChangeDenominator,2);
  assert.equal(o.evidence.breadthAndAvgChangeUseDifferentDenominators,true);
}

// Candidate can help its own sector gate because current deployed sector stats are inclusive.
{
  const rows=[
    {symbol:"9999",changePercent:4,tradeValue:100},
    {symbol:"1001",changePercent:0.1,tradeValue:100},
    {symbol:"1002",changePercent:-2,tradeValue:100},
    {symbol:"1003",changePercent:-2,tradeValue:100}
  ];
  const features=rows.map(r=>({symbol:r.symbol,historyDays:30,avgAmount20:100}));
  const o=observeSectorGateDenominators({
    industryRows:rows,industryFeatures:features,candidateSymbol:"9999"
  });
  assert.equal(o.deployed.breadth,50);
  assert.equal(o.deployed.gate.pass,true);
  assert.ok(o.deployed.avgChange>=-1);
  assert.equal(o.leaveOneOut.gate.pass,false);
  assert.ok(o.leaveOneOut.breadth<40);
  assert.ok(o.leaveOneOut.avgChange<-1);
}

// historyDays>=20 alone enters the amount activity subset, even if avgAmount20 is missing.
{
  const rows=[
    {symbol:"1001",changePercent:1,tradeValue:100},
    {symbol:"1002",changePercent:1,tradeValue:100}
  ];
  const features=[
    {symbol:"1001",historyDays:30,avgAmount20:null},
    {symbol:"1002",historyDays:30,avgAmount20:100}
  ];
  const o=observeSectorGateDenominators({industryRows:rows,industryFeatures:features});
  assert.equal(o.deployed.historicalCoverage,2);
  assert.equal(o.deployed.diagnostics.activityAvgAmountObservedCount,1);
  assert.equal(o.deployed.amountVs20DayAverage,2);
  assert.equal(o.evidence.activityHistoryReadyCanIncludeMissingAvgAmount,true);
}

console.log(JSON.stringify({
  ok:true,
  mixedDenominatorsConfirmed:true,
  selfInclusionCounterexample:true,
  activityBaselineMissingnessCounterexample:true,
  formalCoreImpact:false
},null,2));
