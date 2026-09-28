import assert from "node:assert/strict";
import {portfolioHeatFrontier} from "../research/portfolio_heat_frontier_v0_1.mjs";
const plans=[
 {symbol:"A",totalAllocation:50000,buyHigh:100,stop:95},
 {symbol:"B",totalAllocation:64000,buyHigh:200,stop:180},
 {symbol:"C",totalAllocation:54000,buyHigh:300,stop:270}
];
const x=portfolioHeatFrontier(plans,200000);
assert.equal(x.status,"READY");
assert.equal(x.legalStates,946);
assert.ok(x.paretoFrontierCount>0);
assert.ok(x.oneGridNeighbors>0);
assert.equal(typeof x.currentParetoDominated,"boolean");
for(const s of x.localDominators){assert.ok(s.heatPctOfCapital<=x.current.heatPctOfCapital+1e-12);assert.ok(s.hhi<=x.current.hhi+1e-12)}
assert.equal(portfolioHeatFrontier([plans[0]],200000).status,"INSUFFICIENT_CROSS_NAME_SAMPLE");
console.log(JSON.stringify({ok:true,purpose:"separate total planned heat from concentration and test whether current plan is Pareto-dominated on pure risk geometry"},null,2));
