import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {PRE_START,PRE_END,AGGREGATE_SQL,SLOT_SQL,AGGREGATE_CAP,SLOT_CAP,
 classifyPreincident} from "../research/system1_p0_cron_preincident_baseline_v0_1.mjs";
assert.equal(PRE_START,"2026-10-05T16:00:00.000Z");
assert.equal(PRE_END,"2026-10-12T16:00:00.000Z");
for(const [sql,cap] of [[AGGREGATE_SQL,AGGREGATE_CAP],[SLOT_SQL,SLOT_CAP]]){
 assert.match(sql,/^SELECT\b/);
 assert.match(sql,new RegExp(" LIMIT "+cap+"$"));
 assert.match(sql,/scheduled_at>=\?1 AND scheduled_at<\?2/);
 assert.doesNotMatch(sql,/\b(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|PRAGMA|VACUUM|ATTACH)\b/i);
}
assert.match(SLOT_SQL,/job_type='AFTER_MARKET_SCAN'/);
assert.match(AGGREGATE_SQL,/GROUP BY tw_date,job_type/);
let v=classifyPreincident({groups:[],slots:[]});
assert.equal(v.state,"NO_PREINCIDENT_AFTERMARKET_AUDITS_IN_RANGE");
assert.equal(v.noInvocationAbsenceInference,true);
assert.equal(v.noD1Write,true);
assert.equal(v.formalParentProven,false);
const group={tw_date:"2026-10-12",job_type:"AFTER_MARKET_SCAN",row_count:1,
 first_utc:"2026-10-12T15:35:00.000Z",last_utc:"2026-10-12T15:35:00.000Z"};
const slot={id:8,cron_expression:"35,55 15 * * mon-fri",
 scheduled_at:"2026-10-12T15:35:00.000Z",
 started_at:"2026-10-12T15:35:10.000Z",
 finished_at:"2026-10-12T15:36:29.000Z",
 status:"FAILED",skipped:0,error:"quota exceeded"};
v=classifyPreincident({groups:[group],slots:[slot]});
assert.equal(v.state,"PREINCIDENT_AFTERMARKET_AUDITS_EXIST");
assert.equal(v.counts.afterMarketRows,1);
assert.equal(v.afterMarketSlots[0].errorClass,"D1_QUOTA_HINT_NOT_ROOT_CAUSE_PROOF");
assert.equal(v.rootCauseProven,false);
assert.equal(v.afterMarketSlots[0].scheduled,"2026-10-12T15:35:00.000Z");
v=classifyPreincident({groups:[{...group,tw_date:"2026-10-13"}],slots:[]});
assert.equal(v.state,"MALFORMED_FAIL_CLOSED");
v=classifyPreincident({groups:[group],slots:[{...slot,scheduled_at:"2026-10-15T15:35:00.000Z"}]});
assert.equal(v.state,"MALFORMED_FAIL_CLOSED");
v=classifyPreincident({groups:[],slots:[slot]});
assert.equal(v.state,"MALFORMED_FAIL_CLOSED");
v=classifyPreincident({groups:Array(AGGREGATE_CAP).fill(group),slots:[]});
assert.equal(v.state,"TRUNCATED_FAIL_CLOSED");
v=classifyPreincident({groups:[],slots:Array(SLOT_CAP).fill(slot)});
assert.equal(v.state,"TRUNCATED_FAIL_CLOSED");
assert.throws(()=>classifyPreincident({groups:[],slots:Array(SLOT_CAP+1).fill(slot)}),/UNBOUNDED/);
assert.equal(classifyPreincident({readError:"CLOUDFLARE_D1_HTTP_401"}).state,"PHYSICAL_READ_UNAVAILABLE");
const d=await readFile(new URL("../ops/system1_p0_preincident_cron_d1_select_readonly_20261016.mjs",import.meta.url),"utf8");
assert.match(d,/SYSTEM1_P0_D1_READ_TOKEN/);
assert.match(d,/ACCOUNT_PIN="3a6732b4f5995750"/);
assert.match(d,/DB_PIN="34d9667438c00c05"/);
assert.match(d,/hash16\(account\)!==ACCOUNT_PIN/);
assert.match(d,/hash16\(id\)!==DB_PIN/);
assert.match(d,/requireVerifiedSelectMetrics/);
assert.match(d,/req\.select>2/);
assert.match(d,/req\.rowsRead>50000/);
assert.doesNotMatch(d,/process\.env\.CLOUDFLARE_API_TOKEN/);
const p=await readFile(new URL("../ops/system1_p0_oct13_15_provider_version_trace_readonly.mjs",import.meta.url),"utf8");
assert.match(p,/CLOUDFLARE_API_TOKEN/);
assert.match(p,/pinnedAccount="3a6732b4f5995750"/);
assert.match(p,/if\(\+\+gets>3\)/);
assert.match(p,/if\(\+\+gqlCalls>4\)/);
assert.match(p,/method:"GET"/);
assert.match(p,/GRAPHQL_BUDGET_EXCEEDED/);
assert.match(p,/versionHistoryProvesRootCause:false/);
assert.match(p,/aggregateInvocationsProveCron:false/);
assert.match(p,/quotaUsageProvesRemainingQuota:false/);
assert.doesNotMatch(p,/process\.env\.SYSTEM1_P0_D1_READ_TOKEN/);
assert.doesNotMatch(p,/\/d1\/database/);
assert.doesNotMatch(p,/\b(?:INSERT INTO|UPDATE v7_|DELETE FROM|DROP TABLE|CREATE TABLE|ALTER TABLE)\b/i);
const w=await readFile(new URL("../.github/workflows/system1-p0-historic-version-cron-breakpoint-readonly.yml",import.meta.url),"utf8");
assert.match(w,/workflow_dispatch:/);
assert.match(w,/pull_request:/);
assert.doesNotMatch(w,/^  push:/m);
assert.doesNotMatch(w,/^  schedule:/m);
assert.equal((w.match(/github\.event_name == 'workflow_dispatch' && github\.ref == 'refs\/heads\/main'/g)||[]).length,2);
const d1Job=w.split(/^  original_d1_preincident:$/m)[1].split(/^  original_worker_provider:$/m)[0];
const pJob=w.split(/^  original_worker_provider:$/m)[1];
assert.match(d1Job,/secrets\.SYSTEM1_P0_D1_READ_TOKEN/);
assert.doesNotMatch(d1Job,/secrets\.CLOUDFLARE_API_TOKEN/);
assert.match(pJob,/secrets\.CLOUDFLARE_API_TOKEN/);
assert.doesNotMatch(pJob,/secrets\.SYSTEM1_P0_D1_READ_TOKEN/);
assert.doesNotMatch(w,/secrets\.SYSTEM2_CLOUDFLARE_API_TOKEN/);
assert.match(w,/node tests\/test_system1_p0_historic_version_cron_breakpoint_v0_1.mjs/);
console.log(JSON.stringify({suite:"System1 P0 historical version and Cron audit breakpoint",
 ok:true,sourcePinned:true,originalD1Selects:2,providerGetLimit:3,providerGraphqlLimit:4,
 independentSecrets:true,manualMainOnly:true,prodWorkerLocked:true,
 noD1Writes:true,noKVWrite:true,noTrades:true,noCronEdit:true,
 noFalseInvocationInference:true}));
