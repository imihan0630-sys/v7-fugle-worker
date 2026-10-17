import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {marketTarget,classified} from "../ops/system1_p0_github_mobile_postclose_backup_v0_1.mjs";
const d="2026-10-16";
let t=marketTarget(new Date("2026-10-16T16:35:00.000Z"));
assert.deepEqual(t,{state:"MARKET_DAY",date:d});
t=marketTarget(new Date("2026-10-10T16:35:00.000Z"));
assert.equal(t.state,"MARKET_CLOSED_SKIP"); // Oct10 Sunday local, Oct10 Sat closed
t=marketTarget(new Date("2026-10-09T16:35:00.000Z"));
assert.equal(t.state,"MARKET_CLOSED_SKIP"); // Oct09 Taiwan observed holiday
t=marketTarget(new Date("2026-10-17T09:00:00.000Z"));
assert.equal(t.state,"SCHEDULE_TOO_LATE_OR_EARLY");
t=marketTarget(new Date("2027-01-06T16:35:00.000Z"));
assert.equal(t.state,"CALENDAR_YEAR_UNVERIFIED"); // no unverified 2027 calendar
const ok=(count=0)=>({targetDate:d,formalScanDate:d,formalSelectedCount:count,
 sourcesReady:true,formalPipelineComplete:true,formalSelectionAuthenticated:true,
 primaryMonitorReadbackVerified:true,dailyReportOutboxAccepted:true,
 category:"POSTCLOSE_PRIMARY_MONITOR_AND_DAILY_OUTBOX_ACCEPTED_NOT_HANDSET_RECEIPT",
 readErrors:{}});
let n=classified({date:d,chain:ok(0),stocks:[]});
assert.equal(n.kind,"ZERO");assert.equal(n.confirmedZero,true);
assert.match(n.title,/確認選股 0 檔/);
assert.equal(n.phoneReceivedProven,false);
n=classified({date:d,chain:ok(3),
 stocks:[{symbol:"2340"},{symbol:"8111"},{symbol:"2404"}]});
assert.equal(n.kind,"SELECTED");assert.match(n.body,/2340、8111、2404/);
n=classified({date:d,chain:{...ok(0),
 formalScanDate:null,formalSelectionAuthenticated:false,
 category:"FORMAL_SCAN_NOT_SAVED_AFTER_READY_SOURCES"},
 stocks:[]});
assert.equal(n.kind,"INCOMPLETE");assert.equal(n.confirmedZero,false);
assert.match(n.body,/不是確認 0 檔/);
n=classified({date:d,chain:{...ok(0),readErrors:{scan:"HTTP_503"},
 category:"GET_READ_ERROR"},stocks:[]});
assert.equal(n.kind,"UNKNOWN");assert.equal(n.confirmedZero,false);
n=classified({date:d,chain:{...ok(0),formalPipelineComplete:false},stocks:[]});
assert.notEqual(n.kind,"ZERO");
n=classified({date:d,chain:{...ok(0),formalScanDate:"2026-10-15"},stocks:[]});
assert.notEqual(n.kind,"ZERO");
n=classified({date:d,chain:ok(0),stocks:[{symbol:"2404"}]});
assert.equal(n.kind,"UNKNOWN");
n=classified({date:d,chain:{...ok(0),dailyReportOutboxAccepted:false},stocks:[]});
assert.equal(n.kind,"ZERO");assert.match(n.body,/未驗證/);
assert.throws(()=>classified({date:"2026-02-30",chain:ok(0)}),/DATE_INVALID/);
const script=await readFile(new URL("../ops/system1_p0_github_mobile_postclose_backup_v0_1.mjs",import.meta.url),"utf8");
assert.match(script,/GITHUB_EVENT_NAME==="schedule"/);
assert.match(script,/GITHUB_EVENT_SCHEDULE===CRON/);
assert.match(script,/GITHUB_REF==="refs\/heads\/main"/);
assert.match(script,/GITHUB_RUN_ATTEMPT/);
assert.match(script,/marketTarget\(new Date\(\)\)/);
assert.match(script,/V7_ADMIN_TOKEN/);
assert.match(script,/noSlackToken:true/);
assert.match(script,/issues\?state=all&since=/);
assert.match(script,/ALREADY_SENT_NO_DUPLICATE/);
assert.match(script,/ISSUE_LIST_TRUNCATED_FAIL_CLOSED/);
assert.match(script,/assignees:\[OWNER\]/);
assert.match(script,/noCloudflarePOST:true/);
assert.match(script,/method:"GET"/);
assert.doesNotMatch(script,/process\.env\.SYSTEM1_POSTCLOSE_SLACK_WEBHOOK_URL/);
assert.doesNotMatch(script,/process\.env\.CLOUDFLARE_API_TOKEN/);
assert.doesNotMatch(script,/\/api\/(?:scan\/run|push\/send|three-min\/verify|acceptance\/reconcile)/);
const wf=await readFile(new URL("../.github/workflows/system1-p0-github-mobile-postclose-backup.yml",import.meta.url),"utf8");
assert.match(wf,/workflow_dispatch:/);
assert.match(wf,/pull_request:/);
assert.match(wf,/schedule:/);
assert.match(wf,/30 16 \* \* 1-5/);
assert.doesNotMatch(wf,/^  push:/m);
assert.match(wf,/issues: write/);
assert.match(wf,/github\.event_name != 'schedule'/);
assert.match(wf,/github\.event_name == 'schedule' && github\.ref == 'refs\/heads\/main'/);
assert.match(wf,/secrets\.V7_ADMIN_TOKEN/);
assert.doesNotMatch(wf,/SYSTEM1_POSTCLOSE_SLACK_WEBHOOK_URL/);
assert.doesNotMatch(wf,/secrets\.CLOUDFLARE_API_TOKEN/);
assert.match(wf,/node tests\/test_system1_p0_github_mobile_backup_v0_1\.mjs/);
assert.match(wf,/--dry-run/);
console.log(JSON.stringify({suite:"System1 GitHub Mobile backup/no task slots",
 result:"PASS",noticeStates:["SELECTED","ZERO","INCOMPLETE","UNKNOWN"],
 authenticatedZeroOnly:true,source2026CalendarOnly:true,
 accountAssignedIssue:true,onePerDayDedupe:true,
 noChatGPTSlots:true,noSlackWebhook:true,manualAndPROffline:true,
 noCloudflareWrites:true,noTrade:true,noWorkerDeploy:true}));
