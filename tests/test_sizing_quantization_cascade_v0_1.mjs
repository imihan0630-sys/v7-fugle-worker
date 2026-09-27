import assert from "node:assert/strict";
import {sizingQuantizationCascade,signalSideShareResidual} from "../research/sizing_quantization_cascade_v0_1.mjs";

const one=sizingQuantizationCascade([{
 symbol:"3006",priorityScore:66.3,totalAllocation:70000,buyHigh:287.08,firstShares:146,secondShares:97,stop:276.36
}],200000);
assert.equal(one.status,"READY");
assert.equal(one.nominalDeployTargetNTD,70000);
assert.equal(one.thousandFloorShortfallNTD,0);
assert.ok(one.shareFloorResidualNTD>0);
assert.ok(Number.isFinite(one.plannedProjectedStopRiskHHI));
assert.ok(Number.isFinite(one.previewProjectedStopRiskHHI));
assert.equal(one.details[0].expectedFirstShares,146);
assert.equal(one.details[0].expectedSecondShares,97);

const live=signalSideShareResidual({amount:42000,price:282.5,suggestedShares:148});
assert.equal(live.status,"READY");
assert.equal(live.suggestedShareNotionalNTD,41810);
assert.equal(live.residualCashNTD,190);

const preview=signalSideShareResidual({amount:42000,price:287.08,suggestedShares:146});
assert.equal(preview.status,"READY");
assert.equal(preview.residualCashNTD,86.32);
assert.ok(live.residualCashNTD>preview.residualCashNTD,"lower trigger price need not monotonically reduce integer-share residual");

const three=sizingQuantizationCascade([
 {symbol:"A",priorityScore:69.9,totalAllocation:50000,buyHigh:100,firstShares:300,secondShares:200,stop:95},
 {symbol:"B",priorityScore:89.4,totalAllocation:64000,buyHigh:200,firstShares:192,secondShares:128,stop:180},
 {symbol:"C",priorityScore:74.9,totalAllocation:54000,buyHigh:300,firstShares:108,secondShares:72,stop:270}
],200000);
assert.equal(three.status,"READY");
assert.equal(three.nominalDeployTargetNTD,170000);
assert.equal(three.plannedAllocationNTD,168000);
assert.ok(three.thousandFloorShortfallNTD>1900&&three.thousandFloorShortfallNTD<2100);
assert.ok(Number.isFinite(three.previewMinusPlannedRiskHHI));

assert.equal(sizingQuantizationCascade([{symbol:"A",priorityScore:1,totalAllocation:1000,buyHigh:100,firstShares:5,secondShares:5}],0).status,"UNKNOWN");
assert.equal(signalSideShareResidual({amount:1000,price:333,suggestedShares:2}).status,"SHARE_RECONSTRUCTION_MISMATCH");

console.log(JSON.stringify({ok:true,contract:"continuous score allocation -> NT$1000 floor -> 60/40 tranche -> integer-share floor; all output remains preview/signal geometry, not fills",productionWitness:"3006: plan preview first 146 shares at 287.08 leaves NT$86.32; live BUY 148 at 282.5 leaves NT$190; residual is non-monotonic in price due integer floor"},null,2));
