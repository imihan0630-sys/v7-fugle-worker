import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {INCIDENT_DATE,WINDOW_START,WINDOW_END,BASELINE_START,BASELINE_END,
 WINDOW_CAP,BASELINE_CAP,ANY_TYPE_SQL,BASELINE_SQL,
 classifyCronGap} from "../research/system1_p0_cron_gap_differential_v0_1.mjs";
assert.equal(INCIDENT_DATE,"2026-10-15");
assert.deepEqual([WINDOW_START,WINDOW_END],[
 "2026-10-15T15:20:00.000Z","2026-10-15T16:20:00.000Z"]);
assert.deepEqual([BASELINE_START,BASELINE_END],[
 "2026-10-12T16:00:00.000Z","2026-10-15T16:00:00.000Z"]);
for(const [sql,cap] of [[ANY_TYPE_SQL,WINDOW_CAP],[BASELINE_SQL,BASELINE_CAP]]){
 assert.match(sql,/^SELECT\b/);
 assert.match(sql,new RegExp("LIMIT "+cap+"$"));
 assert.doesNotMatch(sql,/\b(INSERT|UPDATE|DELETE|CREATE|DROP|REPLACE|ALTER|PRAGMA|VACUUM|ATTACH)\b/i);
 assert.match(sql,/scheduled_at>=\?1/);
 assert.match(sql,/scheduled_at<\?2/);
}
assert.doesNotMatch(ANY_TYPE_SQL,/job_type\s*=/i);
assert.match(ANY_TYPE_SQL,/started_at>=\?1/);
assert.match(BASELINE_SQL,/GROUP BY tw_date,job_type/);
let v=classifyCronGap({windowRows:[],baselineRows:[]});
assert.equal(v.state,"NO_PERSISTED_CRON_IN_WINDOW__INVOCATION_UNKNOWN");
assert.equal(v.historicInvocationAbsentProven,false);
assert.equal(v.formalParentProven,false);
assert.equal(v.noD1Write,true);
const first={id:16,cron_expression:"35,55 15 * * mon-fri",
 scheduled_time:Date.parse("2026-10-15T15:35:00.000Z"),
 scheduled_at:"2026-10-15T15:35:00.000Z",
 started_at:"2026-10-15T15:35:12.000Z",
 finished_at:"2026-10-15T15:35:39.000Z",
 job_type:"AFTER_MARKET_SCAN",status:"FAILED",skipped:0,error:"D1 row-write quota exceeded"};
const baseline=[{tw_date:"2026-10-14",job_type:"AFTER_MARKET_SCAN",row_count:2,
 first_utc:"2026-10-14T15:35:00.000Z",last_utc:"2026-10-14T15:55:00.000Z"}];
v=classifyCronGap({windowRows:[first],baselineRows:baseline});
assert.equal(v.state,"TARGET_SLOT_AUDIT_PRESENT__FORMAL_UNVERIFIED");
assert.equal(v.matchedSlotRecords,1);
assert.equal(v.window.details[0].errorClass,"D1_QUOTA_HINT_NOT_PROVEN");
assert.equal(v.window.details[0].scheduledTimeMatches,true);
assert.equal(v.baseline.byDayAndJobType[0].count,2);
assert.equal(v.rootCauseProven,false);
v=classifyCronGap({windowRows:[{...first,job_type:"INTRADAY_MONITOR"}],
 baselineRows:baseline});
assert.equal(v.state,"TARGET_SLOT_WITH_OTHER_JOB_TYPE_REQUIRES_REVIEW");
assert.equal(v.unexpectedJobTypeAtSlots,1);
v=classifyCronGap({windowRows:[{...first,
 scheduled_at:"2026-10-15T15:40:00.000Z",
 started_at:"2026-10-15T15:40:01.000Z"}],baselineRows:[]});
assert.equal(v.state,"NEARBY_AUDIT_ROWS_ONLY__TARGET_UNKNOWN");
assert.equal(v.matchedSlotRecords,0);
v=classifyCronGap({windowRows:[{...first,scheduled_time:0}],baselineRows:[]});
assert.equal(v.window.details[0].scheduledTimeMatches,false);
assert.equal(v.formalParentProven,false);
v=classifyCronGap({windowRows:[],baselineRows:baseline});
assert.equal(v.state,"NO_PERSISTED_CRON_IN_WINDOW__INVOCATION_UNKNOWN");
v=classifyCronGap({windowRows:[{...first,id:null}],baselineRows:[]});
assert.equal(v.state,"READBACK_MALFORMED_FAIL_CLOSED");
v=classifyCronGap({windowRows:[],baselineRows:[{...baseline[0],tw_date:"2026-10-22"}]});
assert.equal(v.state,"READBACK_MALFORMED_FAIL_CLOSED");
v=classifyCronGap({windowRows:Array(WINDOW_CAP).fill(first),baselineRows:[]});
assert.equal(v.state,"READBACK_PAGE_LIMIT_FAIL_CLOSED");
v=classifyCronGap({windowRows:[],baselineRows:Array(BASELINE_CAP).fill(baseline[0])});
assert.equal(v.state,"READBACK_PAGE_LIMIT_FAIL_CLOSED");
assert.throws(()=>classifyCronGap({windowRows:Array(WINDOW_CAP+1).fill(first),baselineRows:[]}),
 /RESPONSE_ROWS_MISSING_OR_UNBOUNDED/);
assert.throws(()=>classifyCronGap({windowRows:[],baselineRows:null}),
 /RESPONSE_ROWS_MISSING_OR_UNBOUNDED/);
assert.throws(()=>classifyCronGap({date:"2026-10-16",windowRows:[],baselineRows:[]}),
 /UNAUTHORIZED_INCIDENT_DATE/);
v=classifyCronGap({readError:"CLOUDFLARE_READ_HTTP_403"});
assert.equal(v.state,"PHYSICAL_D1_READ_UNAVAILABLE");
assert.equal(v.historicInvocationAbsentProven,false);
const script=await readFile(new URL("../ops/system1_p0_cron_gap_d1_readonly_once_20261015.mjs",import.meta.url),"utf8");
assert.match(script,/SYSTEM1_P0_D1_READ_TOKEN/);
assert.match(script,/PINNED_SOURCE_ACCOUNT_SHA16/);
assert.match(script,/PINNED_SOURCE_DB_SHA16/);
assert.match(script,/requireVerifiedSelectMetrics/);
assert.match(script,/request\.sqlSelect>2/);
assert.match(script,/request\.rowsRead>50000/);
assert.match(script,/sha16\(account\)!==PINNED_SOURCE_ACCOUNT_SHA16/);
assert.match(script,/sha16\(id\)!==PINNED_SOURCE_DB_SHA16/);
assert.doesNotMatch(script,/process\.env\.CLOUDFLARE_API_TOKEN/);
assert.doesNotMatch(script,/process\.env\.SYSTEM2_CLOUDFLARE_API_TOKEN/);
assert.doesNotMatch(script,/wrangler deploy|workers\/scripts\/fugle-test\/deployments/);
const workflow=await readFile(new URL("../.github/workflows/system1-p0-cron-gap-differential-readonly.yml",import.meta.url),"utf8");
assert.match(workflow,/workflow_dispatch:/);
assert.match(workflow,/pull_request:/);
assert.doesNotMatch(workflow,/^  push:/m);
assert.doesNotMatch(workflow,/^  schedule:/m);
assert.match(workflow,/github\.event_name == 'workflow_dispatch' && github\.ref == 'refs\/heads\/main'/);
assert.match(workflow,/secrets\.SYSTEM1_P0_D1_READ_TOKEN/);
assert.doesNotMatch(workflow,/secrets\.CLOUDFLARE_API_TOKEN/);
assert.doesNotMatch(workflow,/secrets\.SYSTEM2_CLOUDFLARE_API_TOKEN/);
assert.match(workflow,/node tests\/test_system1_p0_cron_gap_differential_v0_1\.mjs/);
console.log(JSON.stringify({suite:"System1 P0 exact D1 all-type Cron audit gap",ok:true,
 manualPhysicalOnly:true,sourcePinned:true,windowRowsBounded:true,
 independentPriorDates:true,noWorkerMutation:true,noD1Write:true,
 noKVWrite:true,noBusinessPOST:true,noPush:true,noTrade:true,
 noFalseCronAbsenceInference:true}));
