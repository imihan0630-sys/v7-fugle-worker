import assert from "node:assert/strict";
import {localReferenceReallocation} from "../research/local_reference_reallocation_v0_1.mjs";
const x=localReferenceReallocation([
 {symbol:"A",totalAllocation:50000,buyLow:90,buyHigh:100,stop:80},
 {symbol:"B",totalAllocation:64000,buyLow:180,buyHigh:200,stop:150},
 {symbol:"C",totalAllocation:54000,buyLow:270,buyHigh:300,stop:240}
],200000);
assert.equal(x.status,"READY");
assert.equal(x.legalOneStepMoves,6);
assert.equal(x.totalCells,15);
assert.ok(x.moves.every(m=>m.improvedCount+m.worsenedCount+m.unchangedCount===15));
assert.equal(localReferenceReallocation([{symbol:"A",totalAllocation:70000,buyLow:90,buyHigh:100,stop:80}],200000).status,"INSUFFICIENT_CROSS_NAME_SAMPLE");
console.log(JSON.stringify({ok:true,scope:"six one-grid moves × buyLow/midpoint/buyHigh × five concentration metrics"},null,2));
