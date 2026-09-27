import assert from "node:assert/strict";
import {
  deployedInclusiveMedian,
  leaveOneOutMedianForAudit,
  observeValuationRelativeRisk
} from "../research/valuation_relative_risk_observer_v0_1.mjs";

{
  const x=observeValuationRelativeRisk({
    valuationObserved:true,priceEarningsRatio:45,priceBookRatio:3,
    sectorMedianPe:15,revenueQuarterYoY:20,epsYoY:null
  });
  assert.equal(x.formal.wouldReject,true);
  assert.equal(x.evidence.state,"FAIL_FORMAL_WITH_EPS_EXCEPTION_UNOBSERVED");
}
{
  const x=observeValuationRelativeRisk({
    valuationObserved:true,priceEarningsRatio:45,priceBookRatio:3,
    sectorMedianPe:15,revenueQuarterYoY:30,epsYoY:null
  });
  assert.equal(x.formal.wouldReject,false);
  assert.equal(x.evidence.state,"PASS_REVENUE_GROWTH_EXCEPTION");
}
{
  const x=observeValuationRelativeRisk({
    valuationObserved:true,priceEarningsRatio:45,priceBookRatio:3,
    sectorMedianPe:15,revenueQuarterYoY:20,epsYoY:30
  });
  assert.equal(x.formal.wouldReject,false);
  assert.equal(x.evidence.state,"PASS_EPS_GROWTH_EXCEPTION");
}
{
  const x=observeValuationRelativeRisk({
    valuationObserved:true,priceEarningsRatio:null,priceBookRatio:3,
    sectorMedianPe:15,revenueQuarterYoY:20,epsYoY:30
  });
  assert.equal(x.formal.wouldReject,false);
  assert.equal(x.evidence.state,"NOT_APPLICABLE_NO_POSITIVE_TTM_PE");
}
{
  const vals=[10,40,100];
  assert.equal(deployedInclusiveMedian(vals),40);
  assert.equal(leaveOneOutMedianForAudit(vals,100),25);
  const x=observeValuationRelativeRisk({
    valuationObserved:true,priceEarningsRatio:100,priceBookRatio:5,
    sectorMedianPe:40,revenueQuarterYoY:20,epsYoY:20
  },{industryPositivePeValues:vals});
  assert.equal(x.formal.relativePe,2.5);
  assert.equal(x.formal.wouldReject,false);
  assert.equal(x.constituentAudit.leaveOneOutMedian,25);
  assert.equal(100/x.constituentAudit.leaveOneOutMedian>2.5,true);
}
console.log(JSON.stringify({
  ok:true,
  missingEpsFormalSemanticsPreserved:true,
  inclusiveMedianSelfInfluenceCounterexample:true,
  formalCoreImpact:false
},null,2));
