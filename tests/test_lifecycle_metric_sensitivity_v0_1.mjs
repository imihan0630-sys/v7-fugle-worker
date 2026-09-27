import assert from "node:assert/strict";
import {lifecycleMetricSensitivity} from "../research/lifecycle_metric_sensitivity_v0_1.mjs";
const x=lifecycleMetricSensitivity([
 {symbol:"A",totalAllocation:50000,buyHigh:100,stop:95},
 {symbol:"B",totalAllocation:64000,buyHigh:200,stop:180},
 {symbol:"C",totalAllocation:54000,buyHigh:300,stop:270}
],200000);
assert.equal(x.status,"READY");
assert.equal(x.feasibleStates,946);
assert.equal(x.directionalSummary.totalComparisons,15);
for(const st of ["FIRST","ADD","FULL"])for(const m of ["HHI","GINI","CV","MAX_SHARE","MAX_MIN"])assert.ok(x.stages[st].metrics[m].current>=x.stages[st].metrics[m].globalMin-1e-12);
assert.equal(lifecycleMetricSensitivity([{symbol:"A",totalAllocation:70000,buyHigh:100,stop:90}],200000).status,"INSUFFICIENT_CROSS_NAME_SAMPLE");
console.log(JSON.stringify({ok:true,comparisons:15,scope:"FIRST/ADD/FULL × HHI/GINI/CV/MAX_SHARE/MAX_MIN"},null,2));
