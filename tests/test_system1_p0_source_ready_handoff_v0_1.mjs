import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {classifySourceReadyFormalHandoff as decide,classifyImmediateBusinessPostClock as immediate} from "./system1_p0_source_ready_handoff_gate_v0_1.mjs";
const date="2026-10-14";
const quality={marketDate:date,index:{ready:true},tdcc:{ready:true},datasets:{
 FINANCIAL:{ready:true,count:1881},VALUATION:{ready:true,count:1969},
 ANNOUNCEMENTS:{ready:true,count:108},QUARTER_EPS:{ready:true,count:11}}};
const source={marketDate:date,ready:true};
const cron={expected:["10 10 * * MON-FRI"],recent:[{id:1,job_type:"AFTER_MARKET_SCAN",
 scheduled_at:"2026-10-14T10:10:00.000Z",finished_at:"2026-10-14T10:10:18.000Z",
 cron_expression:"10 10 * * MON-FRI",status:"FAILED",
 error:"Error: DATA_INCOMPLETE：缺當日真實指數比較基期"}]};
const rec={attempt:{status:"FAILED",requestedDate:date,generatedAt:"2026/10/14 18:10:15"}};
const fixture={now:"2026-10-14T14:43:00.000Z",targetDate:date,
 scan:{scanDate:"2026-09-29"},quality,institution:source,recommendations:rec,cron};
const ok=decide(fixture);
assert.equal(ok.mayPost,true);
assert.equal(ok.reason,"PRECOMMIT_SOURCE_FAILURE_AFTER_NEW_SOURCE_READY");
assert.equal(ok.originalD1LeaseStillRequired,true);
// Production V8.7.12 deployment migrated actual Formal Cron to 23:35.
// Oct14 official sources at 22:43/23:13 were BEFORE that scan, not late.
const after2335={...cron,expected:["35 15 * * MON-FRI"],recent:[{
 ...cron.recent[0],cron_expression:"35 15 * * MON-FRI",
 scheduled_at:"2026-10-14T15:35:00.000Z",finished_at:"2026-10-14T15:35:18.000Z"}]};
const after2335Rec={attempt:{...rec.attempt,generatedAt:"2026/10/14 23:35:15"}};
const prodFixture={...fixture,cron:after2335,recommendations:after2335Rec};
assert.equal(decide({...prodFixture,now:"2026-10-14T14:43:41Z"}).reason,"ORIGINAL_FORMAL_CRON_NOT_DUE");
assert.equal(decide({...prodFixture,now:"2026-10-14T15:13:52Z"}).reason,"ORIGINAL_FORMAL_CRON_NOT_DUE");
assert.equal(decide({...prodFixture,now:"2026-10-14T15:43:00Z"}).mayPost,true);
assert.equal(decide({...prodFixture,now:"2026-10-14T15:55:00Z"}).mayPost,false);

const blocked=(override,expected)=>assert.equal(decide({...fixture,...override}).reason,expected);
blocked({now:"2026-10-14T15:54:59Z",targetDate:date},"PRECOMMIT_SOURCE_FAILURE_AFTER_NEW_SOURCE_READY");
blocked({now:"2026-10-14T15:55:00Z",targetDate:date},"OUTSIDE_SOURCE_READY_BUSINESS_WINDOW");
assert.equal(immediate({now:"2026-10-14T15:54:59Z",targetDate:date}).mayPost,true);
assert.equal(immediate({now:"2026-10-14T15:55:00Z",targetDate:date}).mayPost,false);
assert.equal(immediate({now:"2026-10-14T16:00:00Z",targetDate:date}).mayPost,false);
assert.equal(immediate({now:"2026-10-14T10:09:59Z",targetDate:date}).mayPost,false);
assert.equal(immediate({now:"2026-10-14T10:10:00Z",targetDate:date}).mayPost,true);
assert.equal(immediate({now:"2026-10-14T14:43:30Z",targetDate:"2026-10-13"}).mayPost,false);
blocked({now:"2026-10-14T10:09:00Z"},"OUTSIDE_SOURCE_READY_BUSINESS_WINDOW");
blocked({now:"2026-10-14T16:01:00Z"},"CROSS_MIDNIGHT_TARGET_FORBIDDEN");
blocked({targetDate:"2026-10-15"},"CROSS_MIDNIGHT_TARGET_FORBIDDEN");
blocked({targetDate:"2026-02-30"},"INVALID_TARGET_SESSION");
blocked({scan:{scanDate:date}},"FORMAL_ALREADY_SAVED_NO_REPLAY");
blocked({quality:{...quality,marketDate:"2026-10-13"}},"OFFICIAL_SOURCE_NOT_READY");
blocked({quality:{...quality,datasets:{...quality.datasets,QUARTER_EPS:{ready:false,count:11}}}},"OFFICIAL_SOURCE_NOT_READY");
blocked({institution:{...source,ready:false}},"OFFICIAL_SOURCE_NOT_READY");
blocked({recommendations:{}},"PREVIOUS_FORMAL_ATTEMPT_NOT_SAFELY_ADJUDICATED");
blocked({recommendations:{attempt:{status:"SUCCESS",requestedDate:date}}},"PREVIOUS_FORMAL_ATTEMPT_NOT_SAFELY_ADJUDICATED");
blocked({recommendations:{attempt:{status:"FAILED",requestedDate:"2026-10-13"}}},"PREVIOUS_FORMAL_ATTEMPT_NOT_SAFELY_ADJUDICATED");
blocked({cron:{...cron,recent:[]}},"ORIGINAL_FORMAL_D1_CRON_RECEIPT_MISSING");
blocked({cron:{recent:cron.recent}},"DEPLOYED_FORMAL_CRON_NOT_UNAMBIGUOUS");
blocked({cron:{...cron,expected:["10 10 * * MON-FRI","35 15 * * MON-FRI"]}},"DEPLOYED_FORMAL_CRON_NOT_UNAMBIGUOUS");
blocked({cron:{...cron,recent:[{...cron.recent[0],status:"SUCCESS"}]}},"PREVIOUS_FORMAL_ATTEMPT_NOT_FAILED");
for(const error of ["Error: exceededResources","Error: Worker CPU 10ms exceeded",
 "Error: OPEN_POSITION_PROTECTED：持倉","Error: POST 503 result unknown",
 "Error: D1 history cache read failed","Error: DATA_INCOMPLETE fake-prefix-not-colon"]){
 blocked({cron:{...cron,recent:[{...cron.recent[0],error}]}},"PREVIOUS_FORMAL_FAILURE_MUTATION_UNCERTAIN");
}
assert.equal(decide({...fixture,cron:{...cron,recent:[{...cron.recent[0],error:"Error: DATA_INCOMPLETE: missing verified quarter EPS"}]}}).mayPost,true);
blocked({recommendations:{attempt:{...rec.attempt,generatedAt:"2026/10/14 22:40:00"}}},"LATEST_ATTEMPT_NOT_CORRELATED_WITH_PRECOMMIT_CRON");
blocked({recommendations:{attempt:{...rec.attempt,generatedAt:null}}},"LATEST_ATTEMPT_NOT_CORRELATED_WITH_PRECOMMIT_CRON");
blocked({cron:{...cron,recent:[{...cron.recent[0],finished_at:null}]}},"LATEST_ATTEMPT_NOT_CORRELATED_WITH_PRECOMMIT_CRON");
blocked({cron:{...cron,recent:[{...cron.recent[0],cron_expression:"* 9 * * MON-FRI"}]}},"ORIGINAL_FORMAL_D1_CRON_RECEIPT_MISSING");
const worker=await readFile(new URL("../Worker.js",import.meta.url),"utf8");
const core=worker.slice(worker.indexOf("async function runAfterMarketScanCore("),
 worker.indexOf("async function ",worker.indexOf("async function runAfterMarketScanCore(")+6));
const mutation=core.indexOf("await env.STOCKS_KV.put(MARKET_STATE_KEY");
assert.ok(mutation>0);
const allErrors=[...core.matchAll(/DATA_INCOMPLETE/g)].map(m=>m.index);
assert.ok(allErrors.length>0 && allErrors.every(i=>i<mutation),"All allowed DATA_INCOMPLETE paths must remain pre-mutation");
const workflow=await readFile(new URL("../.github/workflows/v7-market-data.yml",import.meta.url),"utf8");
const recovery=await readFile(new URL("./recover_after_market.mjs",import.meta.url),"utf8");
assert.match(workflow,/P0 source-ready same-day Formal selection handoff/);
assert.match(workflow,/RECOVERY_SOURCE_READY_HANDOFF: 'true'/);
assert.match(workflow,/steps\.calendar\.outputs\.cross_midnight_fallback != 'true'/);
assert.match(recovery,/classifySourceReadyFormalHandoff/);
assert.match(recovery,/if\(!handoff\.mayPost\)/);
assert.match(recovery,/LEGACY_WORKER_PINNED_PRIOR_DAY_UNSUPPORTED_NO_BUSINESS_POST/);
assert.match(recovery,/SOURCE_READY_BUT_FORMAL_HANDOFF_BLOCKED_NO_RETRY/);
assert.match(recovery,/NO_BUSINESS_POST_AFTER_SESSION_ROLLOVER/);
assert.ok(recovery.includes("classifyImmediateBusinessPostClock({now:new Date(),targetDate:date})"));
assert.match(recovery,/ORIGINAL_FORMAL_CRON_NOT_DUE/);
assert.match(recovery,/SOURCE_READY_BUT_FORMAL_HANDOFF_BLOCKED_NO_RETRY/);
assert.match(recovery,/formalNotYetDue:true/);
assert.equal((recovery.match(/admin\('\/api\/scan',\{method:'POST'/g)||[]).length,1);
assert.equal((workflow.match(/run: node tests\/recover_after_market\.mjs/g)||[]).length,3);
console.log(JSON.stringify({ok:true,sourceReadyHandoff:true,
 sameDateOnly:true,originalSelectionAndDeliveryPath:true,
 precommitOnly:true,unknownCpuAnd503Blocked:true,noBackdatedScan:true,
 noTestProductionPOST:true,noPlanChanges:true,formalCoreUnchanged:true}));
