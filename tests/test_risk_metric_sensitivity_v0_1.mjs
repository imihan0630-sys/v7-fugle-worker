import assert from "node:assert/strict";
import {concentrationMetrics,exhaustiveRiskMetricSensitivity} from "../research/risk_metric_sensitivity_v0_1.mjs";

const equal=concentrationMetrics([1,1,1]);
assert.equal(equal.HHI,0.3333333333);
assert.equal(equal.GINI,0);
assert.equal(equal.CV,0);
assert.equal(equal.MAX_SHARE,0.3333333333);
assert.equal(equal.MAX_MIN,1);

const unequal=concentrationMetrics([1,2,4]);
assert.ok(unequal.HHI>equal.HHI);
assert.ok(unequal.GINI>0);
assert.ok(unequal.CV>0);
assert.ok(unequal.MAX_SHARE>equal.MAX_SHARE);
assert.ok(unequal.MAX_MIN>1);

const plans=[
 {symbol:"A",totalAllocation:50000,buyLow:90,buyHigh:100,stop:80},
 {symbol:"B",totalAllocation:64000,buyLow:180,buyHigh:200,stop:150},
 {symbol:"C",totalAllocation:54000,buyLow:270,buyHigh:300,stop:240}
];
const x=exhaustiveRiskMetricSensitivity(plans,200000);
assert.equal(x.status,"READY");
for(const mode of ["BUY_LOW","MIDPOINT","BUY_HIGH"]){
 assert.equal(x.modes[mode].feasibleStates,946);
 for(const metric of ["HHI","GINI","CV","MAX_SHARE","MAX_MIN"]){
   const m=x.modes[mode].metrics[metric];
   assert.ok(m.current>=m.globalMin-1e-12);
   assert.ok(m.equalCapital>=m.globalMin-1e-12);
 }
}
console.log(JSON.stringify({ok:true,metrics:["HHI","GINI","CV","MAX_SHARE","MAX_MIN"],purpose:"falsify single-metric HHI artifact across three entry references"},null,2));
