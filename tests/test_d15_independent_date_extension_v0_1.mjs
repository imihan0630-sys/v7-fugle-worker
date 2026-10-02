import assert from "node:assert/strict";
import {classifyD15PlanDate,summarizeIndependentDates} from "../research/d15_independent_date_extension_v0_1.mjs";

const z=classifyD15PlanDate({scanDate:"2026-09-22",selectedCount:0,planRows:[],dayStatus:"READY"});
assert.equal(z.status,"ZERO_SELECTED_NONIDENTIFYING");
assert.equal(z.eligible,false);

const one=classifyD15PlanDate({scanDate:"2026-09-21",selectedCount:1,planRows:[{symbol:"3006"}],dayStatus:"READY"});
assert.equal(one.status,"SINGLE_NAME_NONIDENTIFYING");

const multi=classifyD15PlanDate({scanDate:"2026-09-18",selectedCount:3,planRows:[{},{},{}],dayStatus:"READY"});
assert.equal(multi.status,"MULTI_NAME_IDENTIFYING");
assert.equal(multi.eligible,true);

const bad=classifyD15PlanDate({scanDate:"2026-10-01",selectedCount:2,planRows:[{}],dayStatus:"READY"});
assert.equal(bad.status,"PLAN_COUNT_MISMATCH");

const s=summarizeIndependentDates([
 multi,
 classifyD15PlanDate({scanDate:"2026-10-01",selectedCount:2,planRows:[{},{}],dayStatus:"READY"}),
 one,z,bad
]);
assert.equal(s.multiNameDates,2);
assert.equal(s.newMultiNameDatesAfterBaseline,1);
assert.deepEqual(s.newMultiNameDateList,["2026-10-01"]);
assert.equal(s.crossDateReadiness,"ADDITIONAL_MULTI_NAME_DATE_AVAILABLE");

console.log(JSON.stringify({ok:true,contract:"D15 independent-date extension classifier",rule:"zero/single-name dates do not identify cross-name allocation geometry; selected_count must equal plan rows"},null,2));
