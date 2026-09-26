import assert from "node:assert/strict";
import {
  deployedCapitalHHI,
  riskyNameHHIOnTotalCapital,
  heatIntensityOnDeployedCapital,
  strategyRiskDecomposition,
  portfolioTierAV02
} from "../research/portfolio_risk_tier_a_v0_2.mjs";

{
  const one=[{code:"ONE",buyLow:100,buyHigh:105,stop:95,totalAllocation:70000}];
  const three=[
    {code:"A",buyLow:100,buyHigh:105,stop:95,totalAllocation:56000},
    {code:"B",buyLow:100,buyHigh:105,stop:95,totalAllocation:56000},
    {code:"C",buyLow:100,buyHigh:105,stop:95,totalAllocation:56000}
  ];
  const a=deployedCapitalHHI(one);
  const b=deployedCapitalHHI(three);
  assert.equal(a.deployedCapitalHHI,1);
  assert.equal(a.effectiveCapitalNames,1);
  assert.ok(Math.abs(b.deployedCapitalHHI-1/3)<0.00001);
  assert.equal(b.effectiveCapitalNames,3);

  const aTotal=riskyNameHHIOnTotalCapital(one,200000);
  const bTotal=riskyNameHHIOnTotalCapital(three,200000);
  assert.equal(aTotal.deploymentRatioPct,35);
  assert.equal(aTotal.riskyNameHHIOnTotalCapital,0.1225);
  assert.equal(bTotal.deploymentRatioPct,84);
  assert.equal(bTotal.riskyNameHHIOnTotalCapital,0.2352);

  // Falsification witness: fewer effective names does not necessarily mean
  // larger total-account risky-name concentration when deployment differs.
  assert.ok(a.deployedCapitalHHI>b.deployedCapitalHHI);
  assert.ok(aTotal.riskyNameHHIOnTotalCapital<bTotal.riskyNameHHIOnTotalCapital);
}

{
  const tier={
    deploymentRatioPct:84,
    projectedHeatPctLow:2.0221,
    projectedHeatPctHigh:3.2417
  };
  const x=heatIntensityOnDeployedCapital(tier);
  assert.equal(x.status,"READY");
  assert.equal(x.projectedStopRiskPctOfDeployedCapitalLow,2.4073);
  assert.equal(x.projectedStopRiskPctOfDeployedCapitalHigh,3.8592);
}

{
  const plans=[
    {code:"A",buyLow:100,buyHigh:105,stop:95,totalAllocation:56000},
    {code:"B",buyLow:200,buyHigh:210,stop:190,totalAllocation:56000},
    {code:"C",buyLow:50,buyHigh:52,stop:47,totalAllocation:56000}
  ];
  const out=portfolioTierAV02(plans,200000);
  assert.equal(out.researchOnly,true);
  assert.equal(out.decisionImpact,false);
  assert.equal(out.schemaVersion,"PORTFOLIO_RISK_TIER_A_V0_2");
  assert.equal(out.deploymentRatioPct,84);
  assert.equal(out.concentrationDecomposition.structuralReservePct,16);
  assert.equal(out.concentrationDecomposition.effectiveCapitalNames,3);
  assert.equal(out.concentrationDecomposition.riskyNameHHIOnTotalCapital,0.2352);
  assert.equal(out.heatIntensityOnDeployedCapital.status,"READY");
}

{
  const zero=portfolioTierAV02([],200000);
  assert.equal(zero.deploymentRatioPct,0);
  assert.equal(zero.concentrationDecomposition.riskyNameHHIOnTotalCapital,0);
  assert.equal(zero.heatIntensityOnDeployedCapital.status,"UNKNOWN");
  assert.equal(zero.cashState.state,"NO_ELIGIBLE_OPPORTUNITY");
}

console.log(JSON.stringify({
  ok:true,
  class:"A",
  researchOnly:true,
  decisionImpact:false,
  deploymentVsConcentrationSeparated:true,
  totalCapitalRiskyNameHHI:true,
  heatIntensityOnDeployedCapital:true,
  effectiveNamesStandaloneInterpretationFalsified:true
}));


{
  const plans=[
    {code:"A1",strategy:"A拉回承接",buyLow:99.5,buyHigh:101.8,stop:98,totalAllocation:50000},
    {code:"B1",strategy:"B突破後承接",buyLow:99.5,buyHigh:101,stop:98.8,totalAllocation:50000}
  ];
  const rows=strategyRiskDecomposition(plans);
  const a=rows.find(x=>x.strategy==="A");
  const b=rows.find(x=>x.strategy==="B");
  assert.equal(a.planCount,1);
  assert.equal(b.planCount,1);
  assert.ok(a.projectedStopRiskPctOfStrategyDeploymentHigh>b.projectedStopRiskPctOfStrategyDeploymentHigh);
}
