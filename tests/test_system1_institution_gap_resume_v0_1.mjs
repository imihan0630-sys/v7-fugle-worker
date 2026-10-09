import assert from "node:assert/strict";
import {planMissingInstitutionDates} from "./system1_institution_gap_resume_v0_1.mjs";
const status={
 marketDate:"2026-10-08",ready:false,historicalReadback:false,
 validDates:["2026-10-08","2026-10-07"],missingDates:["2026-10-06"]
};
assert.deepEqual(planMissingInstitutionDates(status,"2026-10-08"),{
 alreadyReady:false,repairDates:["2026-10-06"],tradingDateCount:3
});
const ready={...status,ready:true,historicalReadback:false,
 validDates:["2026-10-08","2026-10-07","2026-10-06"],missingDates:[],
 snapshotCounts:["2026-10-08","2026-10-07","2026-10-06"].map(date=>({date,stockCount:1800,complete:true}))};
assert.deepEqual(planMissingInstitutionDates(ready,"2026-10-08"),{
 alreadyReady:true,repairDates:[],tradingDateCount:3,physicalSnapshotsVerified:true
});
const invalid=[
 [{...status,marketDate:"2026-10-09"},"2026-10-08"],
 [{...status,missingDates:null},"2026-10-08"],
 [{...status,missingDates:[]},"2026-10-08"],
 [{...status,validDates:["2026-10-08","2026-10-08"]},"2026-10-08"],
 [{...status,missingDates:["2026-10-09"]},"2026-10-08"],
 [{...status,missingDates:["2026-09-01"]},"2026-10-08"],
 [{...status,ready:true},"2026-10-08"],
 [{...status,validDates:["2026-10-07","2026-10-06"],missingDates:["2026-10-05"]},"2026-10-08"],
 [{...status,validDates:["2026-10-08"]},"2026-10-08"],
 [{...ready,snapshotCounts:undefined},"2026-10-08"],
 [{...ready,snapshotCounts:[]},"2026-10-08"],
 [{...ready,snapshotCounts:ready.snapshotCounts.map(x=>x.date==="2026-10-08"?{...x,complete:false}:x)},"2026-10-08"],
 [{...ready,snapshotCounts:ready.snapshotCounts.map(x=>x.date==="2026-10-08"?{...x,stockCount:0}:x)},"2026-10-08"],
 [{...ready,snapshotCounts:ready.snapshotCounts.map(x=>x.date==="2026-10-08"?{...x,stockCount:1499}:x)},"2026-10-08"],
 [{...ready,snapshotCounts:ready.snapshotCounts.map(x=>x.date==="2026-10-08"?{...x,stockCount:1500.1}:x)},"2026-10-08"],
 [{...ready,snapshotCounts:[...ready.snapshotCounts,ready.snapshotCounts[0]]},"2026-10-08"]
];
for(const [bad,target] of invalid)assert.throws(()=>planMissingInstitutionDates(bad,target));
console.log(JSON.stringify({ok:true,oneDateResumed:true,readyNoWrite:true,threePhysicalSnapshotsRequired:true,nonexistentHistoricalReadbackNotRequired:true,
 refusals:invalid.length,manualOnly:true,noScan:true,noPush:true}));
