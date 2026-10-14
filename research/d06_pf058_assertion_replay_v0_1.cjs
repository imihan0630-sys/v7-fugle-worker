// D06 PF058 research-only reproducibility check; no trading or outcome join.
"use strict";
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const REPO_56 = "c2db8a47ceeccd2290a235c4bdbb05c8897d01af";
const REPO_57 = "37cc2ea60481e372678bb19c176d8d7f05dda484";
function read(sha, path) {
  return JSON.parse(execFileSync("git", ["show", sha + ":" + path], {encoding:"utf8", maxBuffer:2*1024*1024}));
}
const p56=read(REPO_56,"research/d06_pf056_continuation_checkpoint_20261014_v0_1.json");
const r56=read(REPO_56,"research/d06_pf056_etf_retrieval_vintage_falsification_20261014_v0_1.json");
const p57=read(REPO_57,"research/d06_pf057_continuation_checkpoint_20261014_v0_1.json");
const r57=read(REPO_57,"research/d06_pf057_field_clock_nav_rounding_audit_20261014_v0_1.json");
const t57=read(REPO_57,"research/d06_pf057_test_receipt_20261014_v0_1.json");
const checks=[
["use-date is not first-known",()=>p56.independentDecisionDatesAdded===1 && p56.officialFirstKnownAt==="UNKNOWN"],
["raw bytes missing",()=>p56.rawSourceBytes==="UNKNOWN"],
["raw hash missing",()=>p56.rawSourceHash==="UNKNOWN"],
["basket missing",()=>p56.completeBasket==="UNKNOWN"],
["AP execution missing",()=>p56.actualAPExecution==="UNKNOWN"],
["prereg pending",()=>p56.preregReview==="PENDING_D16_00"],
["outcomes closed",()=>p56.outcomes==="CLOSED"],
["no market outcomes",()=>p56.independentMarketOutcomesAdded===0],
["test receipt raw unknown",()=>t57.rawBytes==="UNKNOWN"],
["test receipt zero OOS",()=>t57.realOOS===0],
["test receipt zero independent dates",()=>t57.independentNewDates===0],
["test receipt 30 values",()=>t57.tests.length===30],
["test entries are pairs",()=>t57.tests.every(x=>Array.isArray(x)&&x.length===2)],
["receipt not a standalone runner",()=>!["runner","assertions","inputs","expected","observed","executionLog"].some(k=>Object.hasOwn(t57,k))],
["formal locked",()=>p57.formalCore==="LOCKED"],
["no maturity change",()=>p57.maturityChange===false],
["first known still unknown",()=>r57.observation.firstKnownAt==="UNKNOWN"],
["same use date",()=>r57.observation.useDate==="2026-10-15" && r56.funds["0050"].useDate==="2026-10-15"],
["retrieval vintage conflict",()=>String(p56.sourceConflict).includes("VINTAGE")],
["PCF preview incomplete",()=>r57.observation.previewIncomplete===true],
["PIT date not admitted",()=>p56.officialFirstKnownAt==="UNKNOWN"&&r57.observation.firstKnownAt==="UNKNOWN"],
["no optimization candidate",()=>r57.formalOptimizationCandidate==="NONE"]
];
let passed=0; const failed=[];
for(const [name,test] of checks){try{assert.equal(test(),true,name);passed++}catch(e){failed.push(name)}}
const result={schemaVersion:"D06_PF058_ASSERTION_REPLAY_V0_1",kind:"REPOSITORY_METADATA_NOT_MARKET_OOS",passed,failed:failed.length,total:checks.length,failures:failed,formalCore:"LOCKED"};
process.stdout.write(JSON.stringify(result,null,2)+"\\n");
if(failed.length)process.exitCode=1;
