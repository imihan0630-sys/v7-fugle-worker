import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const worker=await readFile("Worker.js","utf8");
// Dynamically import original Worker module only as inert JS definitions;
// no fetch/scheduled invocation is performed.
const module=await import("data:text/javascript;base64,"+Buffer.from(
 worker+"\nexport {system1ShadowEpsCandidateStatus};\n").toString("base64"));
const check=module.system1ShadowEpsCandidateStatus;
let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++};
const c={symbol:"3236"};
const good={quarterEpsSource:"https://mopsov.twse.com.tw/mops/web/ajax_t164sb04",
 epsBasis:"MOPS合併綜合損益表直接公告單季EPS",
 quarterEpsYear:2026,quarterEpsQuarter:2,
 quarterEpsVerified:true,quarterEPS:0,previousQuarterEpsVerified:true,
 previousQuarterEpsYear:2026,previousQuarterEpsQuarter:1,previousQuarterEPS:-1};
const snap=(row=good,overrides={})=>({
 asOfDate:"2026-10-16",year:2026,quarter:2,count:1,
 stocks:{"3236":row},...overrides
});
eq(check(c,snap()).allowed,true);
eq(check(c,snap()).reason,null);
eq(check(c,snap({...good,quarterEPS:-2})).allowed,true);
eq(check(c,snap({...good,quarterEPS:null})).reason,"CURRENT_QUARTER_ACTUAL_EPS_MISSING");
eq(check(c,snap({...good,quarterEpsVerified:false})).allowed,false);
eq(check(c,snap({...good,previousQuarterEPS:null})).reason,"PREVIOUS_QUARTER_ACTUAL_EPS_MISSING");
eq(check(c,snap({...good,previousQuarterEpsVerified:false})).allowed,false);
eq(check(c,snap({...good,previousQuarterEpsQuarter:4})).allowed,false);
eq(check(c,snap({...good,quarterEpsYear:2025})).reason,"QUARTER_OR_ISSUER_PERIOD_MISMATCH");
eq(check(c,snap({...good,epsBasis:"MOPS個別綜合損益表"})).reason,"OFFICIAL_CONSOLIDATED_C_BASIS_NOT_VERIFIED");
eq(check(c,snap({...good,quarterEpsSource:"https://not-official.invalid"})).allowed,false);
eq(check({symbol:"5340"},snap()).reason,"MISSING_CANDIDATE_SOURCE");
eq(check(c,{...snap(),quarter:1}).allowed,false);
eq(check(c,{...snap(),quarter:1,stocks:{3236:{...good,quarterEpsQuarter:1,previousQuarterEpsVerified:false}}}).allowed,true);
const all=(needle)=>worker.split(needle).length-1;
const has=(needle)=>{assert.ok(worker.includes(needle));n++};
has("const epsQuarantineDryRun = dryRun && options?.epsQuarantineShadow===true && !epsReviewOnly;");
has('if(epsQuarantineDryRun) selectorEnv.__S1_EPS_QUARANTINE_DRYRUN_ONLY=quarterEps;');
has("const scan = selectTomorrowCandidates(marketState, rows, selectorEnv, marketDate);");
has("const thousandTop = (shadowEpsSnapshot ? thousandScored.filter(epsShadowEligible) : thousandScored).slice(0, MAX_STOCKS_PER_POOL);");
has("const generalTop = (shadowEpsSnapshot ? scored.filter(epsShadowEligible) : scored)");
has('throw new Error("OPEN_POSITION_PROTECTED：');
has('if(!dryRun && epsMissing.length) throw new Error');
has("zeroPicksCertified:false");
eq(all("const result = scoreCandidate(f, sector);"),2);
eq(all("if(epsQuarantineDryRun) selectorEnv.__S1_EPS_QUARANTINE_DRYRUN_ONLY=quarterEps;"),1);
eq(all("system1ShadowEpsCandidateStatus(candidate,quarterSnapshot)"),1);
eq(all("shadowEpsSnapshot ? thousandScored.filter(epsShadowEligible)"),1);
// Guard must be bounded within original daily engine before selection call.
const start=worker.indexOf("async function runAfterMarketScanCore(");
const end=worker.indexOf("function selectTomorrowCandidates(");
const daily=worker.slice(start,end);
assert.ok(daily.includes("const epsQuarantineDryRun = dryRun"));n++;
assert.ok(daily.indexOf("if(epsQuarantineDryRun)")<daily.indexOf("selectTomorrowCandidates("));n++;
// Actual Formal branch refuses open position replacement; no activation in
// production with options omitted or dryRun false.
const gate=(dryRun,epsReviewOnly,opts)=>dryRun&&opts?.epsQuarantineShadow===true&&!epsReviewOnly;
eq(gate(false,false,{epsQuarantineShadow:true}),false);
eq(gate(true,true,{epsQuarantineShadow:true}),false);
eq(gate(true,false,{}),false);
eq(gate(true,false,{epsQuarantineShadow:true}),true);
console.log("System1 dry-run-only original Worker EPS adapter: "+n+
 " assertions PASS; no POST, D1/KV writes, trading, dispatch or production deployment.");
