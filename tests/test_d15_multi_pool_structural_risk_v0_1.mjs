import assert from "node:assert/strict";
import {reconstructPoolFromFormalClose,multiPoolStructuralRisk} from "../research/d15_multi_pool_structural_risk_v0_1.mjs";

assert.equal(reconstructPoolFromFormalClose(999.5).pool,"GENERAL");
assert.equal(reconstructPoolFromFormalClose(1000).pool,"THOUSAND");
assert.equal(reconstructPoolFromFormalClose(null).status,"UNKNOWN");

let x=multiPoolStructuralRisk([
 {symbol:"G1",formalClose:500,totalAllocation:50000,buyHigh:510,stop:490},
 {symbol:"T1",formalClose:1200,totalAllocation:50000,buyHigh:1210,stop:1160}
],{selectedCount:2});
assert.equal(x.status,"READY");
assert.equal(x.bothPoolsRepresented,true);
assert.equal(x.crossPoolRiskIdentifiable,true);
assert.equal(x.poolCounts.GENERAL,1);
assert.equal(x.poolCounts.THOUSAND,1);
assert.equal(x.poolStats.GENERAL.withinPoolRiskHHI,1);
assert.equal(x.poolStats.THOUSAND.withinPoolRiskHHI,1);

x=multiPoolStructuralRisk([
 {symbol:"G1",formalClose:500,totalAllocation:50000,buyHigh:510,stop:490},
 {symbol:"G2",formalClose:800,totalAllocation:50000,buyHigh:810,stop:790}
],{selectedCount:2});
assert.equal(x.bothPoolsRepresented,false);
assert.equal(x.crossPoolRiskIdentifiable,false);
assert.equal(x.poolRiskHHI,1);

assert.equal(multiPoolStructuralRisk([]).status,"ZERO_SELECTED");
assert.equal(multiPoolStructuralRisk([{symbol:"A",formalClose:100,totalAllocation:1000,buyHigh:110,stop:100}],{selectedCount:2}).status,"UNKNOWN");

console.log(JSON.stringify({
 ok:true,
 contract:"3+3 price-tier pool membership is reconstructable from immutable formalClose, but pool count is not correlation diversification",
 cases:7
},null,2));
