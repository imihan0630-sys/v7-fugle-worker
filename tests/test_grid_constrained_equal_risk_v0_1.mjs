import assert from "node:assert/strict";
import {gridConstrainedEqualRisk} from "../research/grid_constrained_equal_risk_v0_1.mjs";

const plans=[
 {code:"2006",buyLow:83.50,buyHigh:84.84,stop:82.62,totalAllocation:50000},
 {code:"3105",buyLow:480.00,buyHigh:496.92,stop:472.06,totalAllocation:64000},
 {code:"6133",buyLow:24.90,buyHigh:25.45,stop:24.52,totalAllocation:54000}
];
const x=gridConstrainedEqualRisk(plans,200000);
assert.equal(x.status,"READY");
assert.equal(x.allocationTotalNTD,168000);
assert.deepEqual(x.allocations.map(r=>[r.symbol,r.gridAllocationNTD]),[
 ["2006",70000],["3105",41000],["6133",57000]
]);
assert.ok(x.projectedRiskHHI<0.335);
assert.ok(x.maxToMinProjectedRiskRatio<1.14);
assert.deepEqual(x.allocationOrder.map(x=>x.symbol),["6133"]);

assert.equal(gridConstrainedEqualRisk([{code:"A",buyLow:90,buyHigh:100,stop:90,totalAllocation:10500}],200000).status,"CURRENT_DEPLOYMENT_NOT_ON_GRID");
assert.equal(gridConstrainedEqualRisk([],200000).status,"UNKNOWN");

console.log(JSON.stringify({ok:true,witness:"2026-09-18",gridAllocations:x.allocations,projectedRiskHHI:x.projectedRiskHHI,allocationOrder:x.allocationOrder},null,2));
