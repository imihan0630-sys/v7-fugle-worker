import assert from "node:assert/strict";
import {planMissingInstitutionDates} from "./system1_institution_gap_resume_v0_1.mjs";
const status={
 marketDate:"2026-10-08",ready:false,historicalReadback:false,
 validDates:["2026-10-08","2026-10-07"],missingDates:["2026-10-06"]
};
assert.deepEqual(planMissingInstitutionDates(status,"2026-10-08"),{
 alreadyReady:false,repairDates:["2026-10-06"],tradingDateCount:3
});
assert.deepEqual(planMissingInstitutionDates({...status,ready:true,historicalReadback:true,
 validDates:["2026-10-08","2026-10-07","2026-10-06"],missingDates:[]},"2026-10-08").repairDates,[]);
const invalid=[
 [{...status,marketDate:"2026-10-09"},"2026-10-08"],
 [{...status,missingDates:null},"2026-10-08"],
 [{...status,missingDates:[]},"2026-10-08"],
 [{...status,validDates:["2026-10-08","2026-10-08"]},"2026-10-08"],
 [{...status,missingDates:["2026-10-09"]},"2026-10-08"],
 [{...status,missingDates:["2026-09-01"]},"2026-10-08"],
 [{...status,ready:true},"2026-10-08"],
 [{...status,validDates:["2026-10-07","2026-10-06"],missingDates:["2026-10-05"]},"2026-10-08"],
 [{...status,validDates:["2026-10-08"]},"2026-10-08"]
];
for(const [bad,target] of invalid)assert.throws(()=>planMissingInstitutionDates(bad,target));
console.log(JSON.stringify({ok:true,oneDateResumed:true,readyNoWrite:true,
 refusals:invalid.length,manualOnly:true,noScan:true,noPush:true}));
