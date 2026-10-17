import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {classifyPostcloseNotice} from "../research/system1_p0_postclose_notice_contract_v0_1.mjs";
const date="2026-10-16";
const type="POSTCLOSE_PRIMARY_MONITOR_AND_DAILY_OUTBOX_ACCEPTED_NOT_HANDSET_RECEIPT";
const good=(count=0)=>({
 category:type,targetDate:date,ok:true,formalScanDate:date,
 formalSelectedCount:count,formalSelectionAuthenticated:true,
 primaryMonitorReadbackVerified:true,dailyReportOutboxAccepted:true,
 readErrors:{},sourcesReady:true});
let x=classifyPostcloseNotice({targetDate:date,chain:good(0)});
assert.equal(x.kind,"VERIFIED_ZERO");
assert.equal(x.actualZeroProven,true);
assert.equal(x.shouldSendBackup,false);
assert.equal(x.phoneReceiptProven,false);
assert.equal(x.signalId,"SYSTEM1_POSTCLOSE_STATUS:"+date);
x=classifyPostcloseNotice({targetDate:date,chain:good(3)});
assert.equal(x.kind,"VERIFIED_SELECTION");
assert.equal(x.actualZeroProven,false);
assert.equal(x.shouldSendBackup,false);
x=classifyPostcloseNotice({targetDate:date,chain:{...good(0),
 category:"DAILY_SELECTION_OUTBOX_NOT_ACCEPTED",ok:false,
 dailyReportOutboxAccepted:false}});
assert.equal(x.kind,"VERIFIED_ZERO");
assert.equal(x.shouldSendBackup,true);
x=classifyPostcloseNotice({targetDate:date,chain:{...good(0),
 formalSelectionAuthenticated:false,primaryMonitorReadbackVerified:false,
 category:"FORMAL_SCAN_NOT_SAVED_AFTER_READY_SOURCES",ok:false}});
assert.equal(x.kind,"POSTCLOSE_FAILED_OR_INCOMPLETE");
assert.equal(x.actualZeroProven,false);
assert.equal(x.shouldSendBackup,true);
assert.match(x.message,/不是 0 檔/);
x=classifyPostcloseNotice({targetDate:date,chain:{...good(0),
 category:"FORMAL_SCAN_STALE_DATE",formalScanDate:"2026-10-15",ok:false}});
assert.equal(x.kind,"POSTCLOSE_FAILED_OR_INCOMPLETE");
x=classifyPostcloseNotice({targetDate:date,chain:{...good(0),
 category:"GET_READ_ERROR",readErrors:{monitor:"HTTP_503"},ok:false}});
assert.equal(x.kind,"POSTCLOSE_STATUS_UNVERIFIED");
assert.equal(x.actualZeroProven,false);
assert.equal(x.shouldSendBackup,true);
x=classifyPostcloseNotice({targetDate:date,chain:good(0),
 attempt:{status:"FAILED",requestedDate:date}});
assert.equal(x.kind,"POSTCLOSE_FAILED_OR_INCOMPLETE");
assert.equal(x.actualZeroProven,false);
x=classifyPostcloseNotice({targetDate:date,chain:null});
assert.equal(x.kind,"POSTCLOSE_STATUS_UNVERIFIED");
assert.equal(x.shouldSendBackup,true);
assert.throws(()=>classifyPostcloseNotice({targetDate:"2026-10-00",chain:good(0)}),
 /EXACT_MARKET_DATE_REQUIRED/);
assert.throws(()=>classifyPostcloseNotice({targetDate:"2026-02-30",chain:good(0)}),
 /EXACT_MARKET_DATE_REQUIRED/);
assert.throws(()=>classifyPostcloseNotice({targetDate:"yesterday",chain:good(0)}),
 /EXACT_MARKET_DATE_REQUIRED/);
for(const chain of [{...good(0),formalSelectedCount:7},
 {...good(0),formalSelectedCount:-1},{...good(0),formalSelectedCount:null}]){
 x=classifyPostcloseNotice({targetDate:date,chain});
 assert.notEqual(x.kind,"VERIFIED_ZERO");
 assert.equal(x.actualZeroProven,false);
}
const script=await readFile(new URL("../ops/system1_p0_postclose_backup_slack_notice_v0_1.mjs",import.meta.url),"utf8");
assert.match(script,/--dry-run/);
assert.match(script,/SYSTEM1_POSTCLOSE_SLACK_WEBHOOK_URL/);
assert.match(script,/V7_ADMIN_TOKEN/);
assert.match(script,/GITHUB_EVENT_NAME/);
assert.match(script,/GITHUB_RUN_ATTEMPT/);
assert.match(script,/event!=="schedule"/);
assert.match(script,/attempt!==1/);
assert.match(script,/redirect:"error"/);
assert.match(script,/hooks\\\.slack\\\.com/);
assert.match(script,/noBusinessPOST:true/);
assert.doesNotMatch(script,/\/api\/(?:push|scan\/run|three-min\/verify|import|acceptance\/reconcile)/);
assert.doesNotMatch(script,/process\.env\.CLOUDFLARE_API_TOKEN/);
assert.doesNotMatch(script,/process\.env\.SYSTEM1_P0_D1_READ_TOKEN/);
assert.doesNotMatch(script,/https:\/\/api\.cloudflare\.com/);
const workflow=await readFile(new URL("../.github/workflows/system1-p0-postclose-backup-slack-status.yml",import.meta.url),"utf8");
assert.match(workflow,/workflow_dispatch:/);
assert.match(workflow,/pull_request:/);
assert.match(workflow,/schedule:/);
assert.match(workflow,/15 16 \* \* 1-5/);
assert.doesNotMatch(workflow,/^  push:/m);
assert.match(workflow,/github\.event_name == 'schedule' && github\.ref == 'refs\/heads\/main'/);
assert.match(workflow,/SYSTEM1_POSTCLOSE_SLACK_WEBHOOK_URL: \$\{\{ secrets\.SYSTEM1_POSTCLOSE_SLACK_WEBHOOK_URL \}\}/);
assert.doesNotMatch(workflow,/secrets\.CLOUDFLARE_API_TOKEN/);
assert.match(workflow,/node ops\/system1_p0_postclose_backup_slack_notice_v0_1\.mjs --dry-run/);
assert.match(workflow,/node tests\/test_system1_p0_postclose_notice_contract_v0_1\.mjs/);
console.log(JSON.stringify({suite:"system1 independent postclose notice offline guard",
 result:"PASS",noFalseZero:true,retainsPlanOnFailure:true,
 successZeroNeedsVerifiedFormalAndKV:true,sourceFailureAlerts:true,
 githubRunnerIndependentOfWorkerCpu:true,actualPushOnlyWhenApprovedScheduled:true,
 noCronModification:true,noWorkerDeployment:true,noTrade:true,
 noBusinessPOST:true,noD1Write:true,noKvWrite:true}));
