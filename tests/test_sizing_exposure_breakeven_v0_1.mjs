import assert from "node:assert/strict";
import {deriveExposureBreakEven} from "../research/sizing_exposure_breakeven_v0_1.mjs";

const currentPlanned=[
 {symbol:"2006",exposureNTD:50000},{symbol:"3105",exposureNTD:64000},{symbol:"6133",exposureNTD:54000}
];
let x=deriveExposureBreakEven(currentPlanned,[
 {symbol:"2006",exposureNTD:70000},{symbol:"3105",exposureNTD:41000},{symbol:"6133",exposureNTD:57000}
],168000,{layer:"PLANNED_PRE_SHARE_GRID"});
assert.equal(x.status,"READY");
assert.deepEqual(x.positiveTiltSymbols,["3105"]);
assert.equal(x.cashDeltaNTD,0);
assert.equal(x.singlePositiveThreshold.negativeReturnCoefficients.find(r=>r.symbol==="2006").coefficient,0.8695652174);
assert.equal(x.singlePositiveThreshold.negativeReturnCoefficients.find(r=>r.symbol==="6133").coefficient,0.1304347826);

x=deriveExposureBreakEven(currentPlanned,[
 {symbol:"2006",exposureNTD:70000},{symbol:"3105",exposureNTD:42000},{symbol:"6133",exposureNTD:56000}
],168000,{layer:"PLANNED_POST_SHARE_OPTIMUM"});
assert.equal(x.singlePositiveThreshold.negativeReturnCoefficients.find(r=>r.symbol==="2006").coefficient,0.9090909091);
assert.equal(x.singlePositiveThreshold.negativeReturnCoefficients.find(r=>r.symbol==="6133").coefficient,0.0909090909);

x=deriveExposureBreakEven([
 {symbol:"2006",exposureNTD:49885.92},{symbol:"3105",exposureNTD:63605.76},{symbol:"6133",exposureNTD:53979.45}
],[
 {symbol:"2006",exposureNTD:69993},{symbol:"3105",exposureNTD:41244.36},{symbol:"6133",exposureNTD:55990}
],168000,{layer:"PLAN_PREVIEW_POST_SHARE_GLOBAL"});
assert.equal(x.cashDeltaNTD,-243.77);
assert.deepEqual(x.positiveTiltSymbols,["3105"]);
assert.ok(x.singlePositiveThreshold.cashReturnCoefficient>0);
assert.equal(x.singlePositiveThreshold.negativeReturnCoefficients.find(r=>r.symbol==="2006").coefficient,0.8991869919);
assert.equal(x.singlePositiveThreshold.negativeReturnCoefficients.find(r=>r.symbol==="6133").coefficient,0.0899116334);

assert.equal(deriveExposureBreakEven([{symbol:"A",exposureNTD:1}],[{symbol:"B",exposureNTD:1}],10).status,"UNKNOWN");
assert.equal(deriveExposureBreakEven([{symbol:"A",exposureNTD:11},{symbol:"B",exposureNTD:0}],[{symbol:"A",exposureNTD:5},{symbol:"B",exposureNTD:5}],10).status,"UNKNOWN");

console.log(JSON.stringify({ok:true,plannedPreShareEquation:"R_3105 > 20/23 R_2006 + 3/23 R_6133",plannedPostShareEquation:"R_3105 > 20/22 R_2006 + 2/22 R_6133",previewCashExplicit:true},null,2));
