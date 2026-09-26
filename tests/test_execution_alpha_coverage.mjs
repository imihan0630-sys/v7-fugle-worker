import assert from "node:assert/strict";
import {classifyExecutionPlan,executionAlphaDiagnostics,stratifyExecution} from "../research/execution_alpha_coverage.js";
assert.equal(classifyExecutionPlan({recorderComplete:false,buyObserved:false}),"UNKNOWN_RECORDER_INCOMPLETE");
assert.equal(classifyExecutionPlan({recorderComplete:true,monitorComplete:true,signalPersistenceComplete:true,sourceFresh:true,buyObserved:false}),"NO_BUY_OBSERVED_COMPLETE_COVERAGE");
assert.equal(classifyExecutionPlan({recorderComplete:true,monitorComplete:true,signalPersistenceComplete:true,sourceFresh:true,buyObserved:true}),"BUY_OBSERVED_COMPLETE_COVERAGE");
const rows=[
 {strategy:"A",recorderComplete:true,monitorComplete:true,signalPersistenceComplete:true,sourceFresh:true,buyObserved:true,formalClose:100,buyPrice:98},
 {strategy:"A",recorderComplete:true,monitorComplete:true,signalPersistenceComplete:true,sourceFresh:true,buyObserved:false,benchmarkReturnPct:6},
 {strategy:"B",recorderComplete:true,monitorComplete:true,signalPersistenceComplete:true,sourceFresh:true,buyObserved:false,benchmarkReturnPct:-5},
 {strategy:"B",recorderComplete:false,buyObserved:false,benchmarkReturnPct:20}
];
const d=executionAlphaDiagnostics(rows,30);
assert.equal(d.selectedPlans,4); assert.equal(d.completeCoveragePlans,3); assert.equal(d.unknownPlans,1);
assert.equal(d.buyObservedPlans,1); assert.equal(d.noBuyObservedPlans,2);
assert.equal(d.noBuyMissedUpsideCount,1); assert.equal(d.noBuyAvoidanceBenefitCount,1);
assert.ok(Math.abs(d.conditionalEntryPriceImprovementPct-1.7)<1e-9);
assert.equal(d.buyTriggerRateCompleteCoverageOnlyPct,100/3);
const s=stratifyExecution(rows,"strategy",30);
assert.equal(s.A.completeCoveragePlans,2); assert.equal(s.B.unknownPlans,1);
console.log(JSON.stringify({ok:true,tests:11,diagnostics:d}));
