import assert from "node:assert/strict";
import {prioritySizingInfluence} from "../research/priority_score_sizing_influence_v0_1.mjs";
const out=prioritySizingInfluence([
 {code:"2006",priorityScore:69.9,totalAllocation:50000,conservativeStopRiskPct:2.6167},
 {code:"3105",priorityScore:89.4,totalAllocation:64000,conservativeStopRiskPct:5.0021},
 {code:"6133",priorityScore:74.9,totalAllocation:54000,conservativeStopRiskPct:3.6357}
]);
assert.equal(out.status,"READY");
assert.deepEqual(out.positiveTiltSymbols,["3105"]);
const x=out.details.find(x=>x.symbol==="3105");
assert.ok(x.sizingTiltVsEqualNTD>0);
assert.ok(x.incrementalProjectedStopRiskVsEqualNTD>0);
assert.ok(out.maxAbsoluteImplementationResidualNTD<1000);
assert.equal(prioritySizingInfluence([{code:"3006",priorityScore:80,totalAllocation:70000}]).status,"INSUFFICIENT_CROSS_NAME_SAMPLE");
console.log(JSON.stringify({ok:true,witness:"2026-09-18 immutable journal geometry",result:out},null,2));
