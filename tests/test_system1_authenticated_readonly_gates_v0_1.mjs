import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {assessReadiness,safeNumber,safeDateTokens,assessInstitutionPhysicalSnapshot,summarize} from "./system1_authenticated_readonly_gates_v0_1.mjs";
assert.equal(safeNumber(undefined),null);
assert.equal(safeNumber(null),null);
assert.equal(safeNumber(""),null);
assert.equal(safeNumber("1036"),1036);
assert.deepEqual(safeDateTokens(["2026-10-08"]),["2026-10-08"]);
assert.deepEqual(safeDateTokens(["2026/10/08"]),["2026-10-08"]);
assert.deepEqual(safeDateTokens(["20261008"]),["2026-10-08"]);
assert.deepEqual(safeDateTokens(["private","2026-10-07"]),["2026-10-07"]);
const healthy={
 scan:{httpStatus:200,scanDate:"2026-10-08",pipelineComplete:true},
 market:{httpStatus:200,marketDate:"2026-10-08",ready:true,twseReady:true,tpexReady:true},
 institution:{httpStatus:200,marketDate:"2026-10-08",ready:true,physicalSnapshotsVerified:true},
 quality:{httpStatus:200,marketDate:"2026-10-08",indexReady:true,tdccReady:true,
  datasets:{FINANCIAL:true,VALUATION:true,ANNOUNCEMENTS:true,QUARTER_EPS:true}}
};
const valid=assessReadiness(healthy);
assert.equal(valid.allInputReadbacksReady,true);
assert.equal(valid.formalScanPresent,true);
assert.equal(valid.formalScanComplete,true);
assert.equal(valid.operationalRecoveryPass,false);
assert.deepEqual(valid.blockers,[]);
const noScan=assessReadiness({...healthy,scan:{...healthy.scan,scanDate:"2026-09-29"}});
assert.equal(noScan.allInputReadbacksReady,true);
assert.equal(noScan.formalScanPresent,false);
assert.deepEqual(noScan.blockers,["FORMAL_SCAN_DATE_NOT_CONFIRMED"]);
const partialScan=assessReadiness({...healthy,scan:{...healthy.scan,pipelineComplete:false}});
assert.equal(partialScan.allInputReadbacksReady,true);
assert.equal(partialScan.formalScanPresent,true);
assert.equal(partialScan.formalScanComplete,false);
assert.deepEqual(partialScan.blockers,["FORMAL_SCAN_PIPELINE_INCOMPLETE"]);
assert.equal(partialScan.operationalRecoveryPass,false);

const fail=assessReadiness({
 ...healthy,
 market:{...healthy.market,tpexReady:false},
 institution:{...healthy.institution,physicalSnapshotsVerified:false},
 quality:{...healthy.quality,datasets:{...healthy.quality.datasets,FINANCIAL:false}}
});
assert.equal(fail.allInputReadbacksReady,false);
assert.ok(fail.blockers.includes("OFFICIAL_MARKET_READBACK_INCOMPLETE"));
assert.ok(fail.blockers.includes("THREE_TRADING_DAY_INSTITUTION_READBACK_INCOMPLETE"));
assert.ok(fail.blockers.includes("OFFICIAL_QUALITY_READBACK_INCOMPLETE"));
const failAuth=assessReadiness({});
assert.equal(failAuth.allInputReadbacksReady,false);
assert.equal(failAuth.operationalRecoveryPass,false);
const target="2026-10-08";
const dates=["2026-10-08","2026-10-07","2026-10-06"];
const institutionalWorker={
 marketDate:target,ready:true,validDates:dates,missingDates:[],
 snapshotCounts:dates.map(date=>({date,stockCount:1800,complete:true}))
};
assert.equal(assessInstitutionPhysicalSnapshot(institutionalWorker,target),true);
const sourceShape=summarize("institution",institutionalWorker,200);
assert.equal(sourceShape.physicalSnapshotsVerified,true);
assert.equal(sourceShape.validTradingDateCount,3);
assert.equal(sourceShape.physicalSnapshots.length,3);
assert.ok(!("historicalReadback" in sourceShape));
assert.equal(assessReadiness({...healthy,institution:sourceShape}).allInputReadbacksReady,true);
const badInstitution=[
 {...institutionalWorker,ready:false},
 {...institutionalWorker,missingDates:[target],validDates:dates.slice(1)},
 {...institutionalWorker,snapshotCounts:institutionalWorker.snapshotCounts.slice(1)},
 {...institutionalWorker,snapshotCounts:institutionalWorker.snapshotCounts.map(x=>x.date===target?{...x,complete:false}:x)},
 {...institutionalWorker,snapshotCounts:institutionalWorker.snapshotCounts.map(x=>x.date===target?{...x,stockCount:1499}:x)},
 {...institutionalWorker,snapshotCounts:[...institutionalWorker.snapshotCounts,institutionalWorker.snapshotCounts[0]]},
 {...institutionalWorker,validDates:["2026-10-08","2026-10-07","2026-10-07"]},
 {...institutionalWorker,marketDate:"2026-10-07"},
 {...institutionalWorker,snapshotCounts:institutionalWorker.snapshotCounts.map(x=>x.date===target?{...x,stockCount:1800.5}:x)}
];
for(const invalid of badInstitution){
 assert.equal(assessInstitutionPhysicalSnapshot(invalid,target),false);
 assert.equal(summarize("institution",invalid,200).physicalSnapshotsVerified,false);
}
const qualityRaw={marketDate:target,index:{ready:true},tdcc:{ready:true},
 datasets:Object.fromEntries(["FINANCIAL","VALUATION","ANNOUNCEMENTS","QUARTER_EPS"].map(k=>[k,{ready:true}]))};
const summaryQuality=summarize("quality",qualityRaw,200);
assert.equal(summaryQuality.indexReady,true);
assert.equal(summaryQuality.tdccReady,true);
assert.equal(Object.values(summaryQuality.datasets).every(Boolean),true);
assert.equal(assessReadiness({...healthy,institution:sourceShape,quality:summaryQuality}).allInputReadbacksReady,true);
assert.equal(assessReadiness({...healthy,institution:sourceShape,quality:summarize("quality",{...qualityRaw,datasets:{...qualityRaw.datasets,VALUATION:{ready:false}}},200)}).allInputReadbacksReady,false);
const src=await readFile(new URL("./system1_authenticated_readonly_gates_v0_1.mjs",import.meta.url),"utf8");
assert.ok(src.includes('method:"GET"'));
assert.ok(src.includes('"/api/scan/status"'));
assert.ok(src.includes('"/api/institution-status?marketDate="'));
assert.ok(src.includes('"/api/quality-status?marketDate="'));
assert.ok(src.includes("neverAuthorizeMutationsFromThisMetric=true"));
assert.ok(src.includes("noTokenOrRawBodyInEvidence:true"));
assert.ok(!src.includes("console.log(t)"));
console.log(JSON.stringify({ok:true,fixtures:4,workerInstitutionPhysicalRejectCases:badInstitution.length,qualityWorkerShapeVerified:true,blockedOnPartialInputs:true,
 retrospectiveNotPromoted:true,d1AnalyticsCannotAuthorizeWrites:true,noSecretLeak:true}));
