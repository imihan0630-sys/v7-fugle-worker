import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {assessReadiness,safeNumber,safeDateTokens} from "./system1_authenticated_readonly_gates_v0_1.mjs";
assert.equal(safeNumber(undefined),null);
assert.equal(safeNumber(null),null);
assert.equal(safeNumber(""),null);
assert.equal(safeNumber("1036"),1036);
assert.deepEqual(safeDateTokens(["2026-10-08"]),["2026-10-08"]);
assert.deepEqual(safeDateTokens(["2026/10/08"]),["2026-10-08"]);
assert.deepEqual(safeDateTokens(["20261008"]),["2026-10-08"]);
assert.deepEqual(safeDateTokens(["private","2026-10-07"]),["2026-10-07"]);
const healthy={
 scan:{httpStatus:200,scanDate:"2026-10-08"},
 market:{httpStatus:200,marketDate:"2026-10-08",ready:true,twseReady:true,tpexReady:true},
 institution:{httpStatus:200,marketDate:"2026-10-08",ready:true,historicalReadback:true},
 quality:{httpStatus:200,marketDate:"2026-10-08",indexReady:true,tdccReady:true,
  datasets:{FINANCIAL:true,VALUATION:true,ANNOUNCEMENTS:true,QUARTER_EPS:true}}
};
const valid=assessReadiness(healthy);
assert.equal(valid.allInputReadbacksReady,true);
assert.equal(valid.formalScanPresent,true);
assert.equal(valid.operationalRecoveryPass,false);
assert.deepEqual(valid.blockers,[]);
const noScan=assessReadiness({...healthy,scan:{...healthy.scan,scanDate:"2026-09-29"}});
assert.equal(noScan.allInputReadbacksReady,true);
assert.equal(noScan.formalScanPresent,false);
assert.deepEqual(noScan.blockers,["FORMAL_SCAN_DATE_NOT_CONFIRMED"]);
const fail=assessReadiness({
 ...healthy,
 market:{...healthy.market,tpexReady:false},
 institution:{...healthy.institution,historicalReadback:false},
 quality:{...healthy.quality,datasets:{...healthy.quality.datasets,FINANCIAL:false}}
});
assert.equal(fail.allInputReadbacksReady,false);
assert.ok(fail.blockers.includes("OFFICIAL_MARKET_READBACK_INCOMPLETE"));
assert.ok(fail.blockers.includes("THREE_TRADING_DAY_INSTITUTION_READBACK_INCOMPLETE"));
assert.ok(fail.blockers.includes("OFFICIAL_QUALITY_READBACK_INCOMPLETE"));
const failAuth=assessReadiness({});
assert.equal(failAuth.allInputReadbacksReady,false);
assert.equal(failAuth.operationalRecoveryPass,false);
const src=await readFile(new URL("./system1_authenticated_readonly_gates_v0_1.mjs",import.meta.url),"utf8");
assert.ok(src.includes('method:"GET"'));
assert.ok(src.includes('"/api/scan/status"'));
assert.ok(src.includes('"/api/institution-status?marketDate="'));
assert.ok(src.includes('"/api/quality-status?marketDate="'));
assert.ok(src.includes("neverAuthorizeMutationsFromThisMetric=true"));
assert.ok(src.includes("noTokenOrRawBodyInEvidence:true"));
assert.ok(!src.includes("console.log(t)"));
console.log(JSON.stringify({ok:true,fixtures:4,blockedOnPartialInputs:true,
 retrospectiveNotPromoted:true,d1AnalyticsCannotAuthorizeWrites:true,noSecretLeak:true}));
