import assert from "node:assert/strict";
import {firstTrancheRiskConcentration} from "../research/first_tranche_risk_concentration_v0_1.mjs";
const x=firstTrancheRiskConcentration([
 {symbol:"A",totalAllocation:50000,buyHigh:100,stop:95},
 {symbol:"B",totalAllocation:64000,buyHigh:200,stop:180},
 {symbol:"C",totalAllocation:54000,buyHigh:300,stop:270}
],200000);
assert.equal(x.status,"READY");
assert.equal(x.exhaustiveGrid.feasibleStates,946);
assert.ok(x.current.firstProjectedRiskHHI>=x.exhaustiveGrid.minHHI-1e-12);
assert.ok(Number.isFinite(x.current.firstMinusFullHHI));
assert.equal(firstTrancheRiskConcentration([{symbol:"A",totalAllocation:70000,buyHigh:100,stop:90}],200000).status,"INSUFFICIENT_CROSS_NAME_SAMPLE");
console.log(JSON.stringify({ok:true,scope:"60% FIRST plan-preview risk vs equal-capital and exhaustive grid minimum; no fill claim"},null,2));
