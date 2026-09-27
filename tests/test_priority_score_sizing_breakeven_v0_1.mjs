import assert from "node:assert/strict";
import {allocationTiltBreakEven} from "../research/priority_score_sizing_breakeven_v0_1.mjs";

const current=[
 {code:"2006",totalAllocation:50000,conservativeStopRiskPct:2.6167},
 {code:"3105",totalAllocation:64000,conservativeStopRiskPct:5.0021},
 {code:"6133",totalAllocation:54000,conservativeStopRiskPct:3.6357}
];
const equal=[
 {symbol:"2006",allocation:56000},
 {symbol:"3105",allocation:56000},
 {symbol:"6133",allocation:56000}
];

let x=allocationTiltBreakEven(current,equal,[
 {symbol:"2006",returnPct:5},{symbol:"3105",returnPct:5},{symbol:"6133",returnPct:5}
]);
assert.equal(x.status,"READY");
assert.equal(x.transferredCapitalNTD,8000);
assert.equal(x.realizedTiltSpreadPct,0);
assert.equal(x.grossIncrementalPnlNTD,0);
assert.equal(x.costStatus,"UNKNOWN");
assert.equal(x.projectedRiskStatus,"KNOWN");
assert.ok(x.incrementalProjectedRiskNTD>0);

x=allocationTiltBreakEven(current,equal,[
 {symbol:"2006",returnPct:4},{symbol:"3105",returnPct:8},{symbol:"6133",returnPct:0}
]);
assert.equal(x.positiveTiltWeightedReturnPct,8);
assert.equal(x.negativeTiltWeightedReturnPct,3);
assert.equal(x.realizedTiltSpreadPct,5);
assert.equal(x.grossIncrementalPnlNTD,400);

x=allocationTiltBreakEven(current,equal,[
 {symbol:"2006",returnPct:8},{symbol:"3105",returnPct:4},{symbol:"6133",returnPct:4}
]);
assert.ok(x.grossIncrementalPnlNTD<0);

x=allocationTiltBreakEven(current,equal,[
 {symbol:"2006",returnPct:4},{symbol:"3105",returnPct:8},{symbol:"6133",returnPct:0}
],{incrementalCostNTD:80});
assert.equal(x.costAdjustedBreakEvenSpreadPct,1);
assert.equal(x.netIncrementalPnlNTD,320);

assert.equal(allocationTiltBreakEven(current,equal,[{symbol:"2006",returnPct:1}]).status,"UNKNOWN");
assert.equal(allocationTiltBreakEven([{code:"3006",totalAllocation:70000}],[{symbol:"3006",allocation:70000}],[{symbol:"3006",returnPct:3}]).status,"INSUFFICIENT_CROSS_NAME_SAMPLE");
assert.equal(allocationTiltBreakEven(current,[{symbol:"2006",allocation:50000},{symbol:"3105",allocation:50000},{symbol:"6133",allocation:50000}],[
 {symbol:"2006",returnPct:1},{symbol:"3105",returnPct:1},{symbol:"6133",returnPct:1}
]).status,"UNBALANCED_DEPLOYMENT");

console.log(JSON.stringify({ok:true,cases:7,breakevenIdentity:"For 2026-09-18 current vs equal capital: R_3105 must exceed 0.75*R_2006 + 0.25*R_6133 before incremental costs for gross sizing alpha."},null,2));
