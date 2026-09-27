import assert from "node:assert/strict";
import {allocationTiltPaperPathEdge} from "../research/priority_score_sizing_edge_v0_2.mjs";

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

let x=allocationTiltPaperPathEdge(current,equal,[
 {symbol:"2006",returnPct:5},{symbol:"3105",returnPct:5},{symbol:"6133",returnPct:5}
]);
assert.equal(x.status,"READY");
assert.equal(x.executablePnl,false);
assert.equal(x.realizedPnl,false);
assert.equal(x.grossPaperPathEdgeNTD,0);
assert.equal(x.transferredCapitalNTD,8000);

x=allocationTiltPaperPathEdge(current,equal,[
 {symbol:"2006",returnPct:4},{symbol:"3105",returnPct:8},{symbol:"6133",returnPct:0}
]);
assert.equal(x.positiveTiltWeightedPathReturnPct,8);
assert.equal(x.negativeTiltWeightedPathReturnPct,3);
assert.equal(x.paperTiltSpreadPct,5);
assert.equal(x.grossPaperPathEdgeNTD,400);
assert.ok(x.incrementalProjectedPlanRiskNTD>0);

x=allocationTiltPaperPathEdge(current,equal,[{symbol:"2006",returnPct:1}]);
assert.equal(x.status,"UNKNOWN");

x=allocationTiltPaperPathEdge([{code:"3006",totalAllocation:70000}],[{symbol:"3006",allocation:70000}],[{symbol:"3006",returnPct:3}]);
assert.equal(x.status,"INSUFFICIENT_CROSS_NAME_SAMPLE");

console.log(JSON.stringify({ok:true,version:"PRIORITY_SCORE_SIZING_EDGE_V0_2",semanticCorrection:"formal-close D1/D3/D5 allocation-weighted result is PAPER_PATH_EDGE, not realized P&L",witnessEquation:"R_3105 = 0.75*R_2006 + 0.25*R_6133"},null,2));
