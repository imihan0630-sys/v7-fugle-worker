import assert from "node:assert/strict";
import {verifyManualQualityPrereqs,canReuseHeavyMopsSources} from "./system1_manual_quality_prereqs_v0_1.mjs";
const d="2026-10-08";
const valid=["2026-10-08","2026-10-07","2026-10-06"];
const market={marketDate:d,ready:true,markets:{TWSE:{ready:true,count:1036},TPEx:{ready:true,count:847}}};
const inst={marketDate:d,ready:true,validDates:valid,missingDates:[],
 snapshotCounts:valid.map(date=>({date,stockCount:1700,complete:true}))};
assert.deepEqual(verifyManualQualityPrereqs(market,inst,d),{
 ready:true,marketDate:d,marketCounts:{TWSE:1036,TPEx:847},
 institutionValidTradingDateCount:3,selectedCount:null,
 noPlanMutation:true,noSelection:true,noPush:true
});
const bads=[
 [null,inst],[{...market,marketDate:"2026-10-07"},inst],
 [{...market,ready:false},inst],
 [{...market,markets:{...market.markets,TWSE:{ready:false,count:1036}}},inst],
 [{...market,markets:{...market.markets,TPEx:{ready:true,count:0}}},inst],
 [market,{...inst,ready:false,validDates:valid.slice(1),missingDates:[d]}],
 [market,{...inst,snapshotCounts:inst.snapshotCounts.slice(1)}],
 [market,{...inst,snapshotCounts:inst.snapshotCounts.map(x=>x.date===d?{...x,complete:false}:x)}],
 [market,{...inst,missingDates:[d],validDates:valid.slice(1)}]
];
for(const [a,z] of bads)assert.throws(()=>verifyManualQualityPrereqs(a,z,d));
const allCached={datasets:{FINANCIAL:{ready:true},QUARTER_EPS:{ready:true}}};
assert.equal(canReuseHeavyMopsSources(true,allCached),true);
assert.equal(canReuseHeavyMopsSources(false,allCached),false);
assert.equal(canReuseHeavyMopsSources(true,null),false);
assert.equal(canReuseHeavyMopsSources(true,{}),false);
assert.equal(canReuseHeavyMopsSources(true,{datasets:{FINANCIAL:{ready:true}}}),false);
assert.equal(canReuseHeavyMopsSources(true,{datasets:{QUARTER_EPS:{ready:true}}}),false);
assert.equal(canReuseHeavyMopsSources(true,{datasets:{FINANCIAL:{ready:1},QUARTER_EPS:{ready:true}}}),false);
assert.equal(canReuseHeavyMopsSources(true,{datasets:{FINANCIAL:{ready:true},QUARTER_EPS:{ready:"true"}}}),false);
console.log(JSON.stringify({ok:true,approvedReceiptCount:1,heavySourceReuseCases:8,rejectedPartialCases:bads.length,
 authorizationFromMarketAndInstitutions:true,noProductionWrite:true,noSelection:true,noPush:true}));
