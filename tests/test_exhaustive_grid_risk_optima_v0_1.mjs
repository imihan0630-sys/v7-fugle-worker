import assert from "node:assert/strict";
import {exhaustiveGridRiskOptima} from "../research/exhaustive_grid_risk_optima_v0_1.mjs";

const plans=[
 {code:"2006",buyLow:83.50,buyHigh:84.84,stop:82.62,totalAllocation:50000},
 {code:"3105",buyLow:480.00,buyHigh:496.92,stop:472.06,totalAllocation:64000},
 {code:"6133",buyLow:24.90,buyHigh:25.45,stop:24.52,totalAllocation:54000}
];
const x=exhaustiveGridRiskOptima(plans,200000);
assert.equal(x.status,"READY");
assert.ok(x.stateCount>0&&x.stateCount<10000);
assert.equal(x.preShare.hhiOptimumCount,1);
assert.equal(x.postShare.hhiOptimumCount,1);
assert.deepEqual(x.preShare.hhiOptima[0].allocations.map(r=>r.allocationNTD),[70000,41000,57000]);
assert.deepEqual(x.preShare.maxMinOptima[0].allocations.map(r=>r.allocationNTD),[70000,41000,57000]);
assert.deepEqual(x.postShare.hhiOptima[0].allocations.map(r=>r.allocationNTD),[70000,42000,56000]);
assert.deepEqual(x.postShare.maxMinOptima[0].allocations.map(r=>r.allocationNTD),[70000,42000,56000]);
assert.ok(x.postShare.minHHI<x.preShare.minHHI);
assert.ok(x.postShare.hhiOptima[0].postShare.projectedRiskHHI<0.335);
assert.equal(exhaustiveGridRiskOptima(plans,200000,{maxStates:10}).status,"STATE_SPACE_TOO_LARGE");

console.log(JSON.stringify({
 ok:true,
 stateCount:x.stateCount,
 preShareOptimum:x.preShare.hhiOptima[0].allocations,
 postShareOptimum:x.postShare.hhiOptima[0].allocations,
 preShareHHI:x.preShare.minHHI,
 postShareHHI:x.postShare.minHHI,
 conclusion:"Exact grid optimum shifts after share flooring; structural low-concentration conclusion survives, exact comparator allocation is objective/quantization-sensitive."
},null,2));
