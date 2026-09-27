import assert from "node:assert/strict";
import {localGridReallocation} from "../research/local_grid_reallocation_v0_1.mjs";
const x=localGridReallocation([
 {symbol:"A",totalAllocation:50000,buyHigh:100,stop:95},
 {symbol:"B",totalAllocation:64000,buyHigh:200,stop:180},
 {symbol:"C",totalAllocation:54000,buyHigh:300,stop:270}
],200000);
assert.equal(x.status,"READY");
assert.equal(x.legalOneStepMoves,6);
assert.equal(x.stageMetricCells,15);
assert.ok(x.moves.every(m=>m.improvedCount+m.worsenedCount+m.unchangedCount===15));
assert.equal(localGridReallocation([{symbol:"A",totalAllocation:70000,buyHigh:100,stop:90}],200000).status,"INSUFFICIENT_CROSS_NAME_SAMPLE");
console.log(JSON.stringify({ok:true,scope:"all legal directed NT$1,000 one-step transfers across 15 stage-metric cells"},null,2));
