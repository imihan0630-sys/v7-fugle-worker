import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {TARGET_DATE,WINDOW_START,WINDOW_END,LEASE_KEY,CRON_SELECT,LEASE_SELECT,
  classifyHistoricalCronD1 as classify,requireVerifiedSelectMetrics as zeroMeta} from "../research/system1_p0_historical_cron_d1_readback_v0_1.mjs";
assert.equal(TARGET_DATE,"2026-10-15");
assert.equal(WINDOW_START,"2026-10-15T15:30:00.000Z");
assert.equal(WINDOW_END,"2026-10-15T16:06:00.000Z");
assert.equal(LEASE_KEY,"V7_AFTER_MARKET_LEASE:2026-10-15");
for(const sql of [CRON_SELECT,LEASE_SELECT]){
  assert.match(sql,/^SELECT\b/);
  assert.doesNotMatch(sql,/\b(INSERT|UPDATE|DELETE|CREATE|DROP|REPLACE|ALTER|PRAGMA|VACUUM|ATTACH)\b/i);
}
assert.match(CRON_SELECT,/LIMIT 10$/);
assert.match(LEASE_SELECT,/LIMIT 1$/);
assert.match(CRON_SELECT,/AFTER_MARKET_SCAN/);
let a=classify({cronRows:[],leaseRows:[]});
assert.equal(a.state,"NO_PERSISTED_CRON_OR_LEASE__INVOCATION_UNKNOWN");
assert.equal(a.historicalCronAbsenceProven,false);
assert.equal(a.persistedAuditSlots,0);
assert.equal(a.formalParentProven,false);
assert.equal(a.noBusinessPOST,true);
assert.equal(a.noD1Write,true);
a=classify({cronRows:[],leaseRows:[{state_key:LEASE_KEY,
 updated_at:"2026-10-15T15:56:00Z",snapshot_json:'{"status":"SUCCESS","scanDate":"2026-10-15"}'}]});
assert.equal(a.state,"LEASE_PRESENT__CRON_AUDIT_MISSING_OR_UNVERIFIED");
assert.equal(a.lease.present,true);
assert.equal(a.lease.snapshotStatus,"SUCCESS");
assert.equal(a.lease.sameInvocationProof,false);
assert.equal(a.historicalCronAbsenceProven,false);
const first={id:81,cron_expression:"35,55 15 * * MON-FRI",
 scheduled_time:Date.parse("2026-10-15T15:35:00.000Z"),
 scheduled_at:"2026-10-15T15:35:00.000Z",started_at:"2026-10-15T15:35:10.000Z",
 finished_at:"2026-10-15T15:35:49.000Z",job_type:"AFTER_MARKET_SCAN",
 status:"FAILED",skipped:0,error:"Cloudflare D1 Free daily row-write limit exceeded"};
a=classify({cronRows:[first],leaseRows:[]});
assert.equal(a.state,"PERSISTED_CRON_AUDIT__FORMAL_PARENT_UNVERIFIED");
assert.equal(a.persistedAuditSlots,1);
assert.equal(a.slotEvidence[0].errorClass,"D1_QUOTA_OR_WRITE_LIMIT");
assert.equal(a.slotEvidence[1].persistedCronAudit,false);
assert.equal(a.quotaRootCauseGloballyProven,false);
assert.equal(a.scheduledInvocationsProven,false);
const second={...first,id:82,scheduled_time:Date.parse("2026-10-15T15:55:00.000Z"),
 scheduled_at:"2026-10-15T15:55:00.000Z",status:"SUCCESS",error:null};
a=classify({cronRows:[first,second],leaseRows:[]});
assert.equal(a.persistedAuditSlots,2);
assert.equal(a.slotEvidence[1].status,"SUCCESS");
assert.equal(a.formalParentProven,false);
assert.equal(a.handsetReceiptProven,false);
a=classify({cronRows:[first,first],leaseRows:[]});
assert.equal(a.state,"CRON_READBACK_INCONSISTENT_FAIL_CLOSED");
const wrongType={...first,job_type:"INTRADAY_MONITOR"};
assert.equal(classify({cronRows:[wrongType],leaseRows:[]}).state,"CRON_READBACK_INCONSISTENT_FAIL_CLOSED");
const wrongTime={...first,scheduled_at:"2026-10-15T16:02:00.000Z"};
assert.equal(classify({cronRows:[wrongTime],leaseRows:[]}).state,"CRON_READBACK_INCONSISTENT_FAIL_CLOSED");
const wrongExpr={...first,cron_expression:"* 1-4 * * MON-FRI"};
assert.equal(classify({cronRows:[wrongExpr],leaseRows:[]}).state,"CRON_READBACK_INCONSISTENT_FAIL_CLOSED");
assert.throws(()=>classify({date:"2026-10-16",cronRows:[],leaseRows:[]}),/UNAUTHORIZED_HISTORICAL_TARGET/);
assert.throws(()=>classify({cronRows:[],leaseRows:[{state_key:"V7_AFTER_MARKET_LEASE:2026-10-14"}]}),/FOREIGN_LEASE_KEY/);
assert.throws(()=>classify({cronRows:Array(11).fill(first),leaseRows:[]}),/CRON_ROWS_MISSING_OR_UNBOUNDED/);
// No physical D1 certificate can be inferred from a LIMIT-10 full page.
const fullPage=Array.from({length:10},(_,i)=>({
  ...first,id:90+i,scheduled_time:first.scheduled_time,
  scheduled_at:first.scheduled_at
}));
assert.equal(classify({cronRows:fullPage,leaseRows:[]}).state,
 "CRON_READBACK_PAGE_LIMIT_REACHED_FAIL_CLOSED");
const badScheduledMs={...first,scheduled_time:first.scheduled_time+60000};
assert.equal(classify({cronRows:[badScheduledMs],leaseRows:[]}).state,
 "CRON_READBACK_INCONSISTENT_FAIL_CLOSED");
assert.equal(classify({cronRows:[{...first,id:null}],leaseRows:[]}).state,
 "CRON_READBACK_INCONSISTENT_FAIL_CLOSED");
assert.equal(classify({cronRows:[{...first,finished_at:null}],leaseRows:[]}).state,
 "CRON_READBACK_INCONSISTENT_FAIL_CLOSED");
assert.equal(classify({cronRows:[{...first,status:"SUCCESS",skipped:1}],leaseRows:[]}).state,
 "CRON_READBACK_INCONSISTENT_FAIL_CLOSED");
const goodMeta=zeroMeta({rows_written:0,rows_read:5},2);
assert.deepEqual(goodMeta,{written:0,read:5});
assert.deepEqual(zeroMeta({rows_written:0},2),{written:0,read:2});
for(const unsafe of [null,"0","",false,undefined,1,-1,0.1]){
  assert.throws(()=>zeroMeta({rows_written:unsafe},2),
    /D1_SELECT_WRITE_OR_METRICS_UNVERIFIED/);
}
assert.throws(()=>zeroMeta({},1),/D1_ROWS_WRITTEN_WITNESS_MISSING/);
assert.throws(()=>zeroMeta({rows_written:0,rows_read:"0"},1),
 /D1_SELECT_READ_METRICS_UNVERIFIED/);
assert.throws(()=>zeroMeta({rows_written:0,rows_read:null},1),
 /D1_SELECT_READ_METRICS_UNVERIFIED/);

const fail=classify({date:TARGET_DATE,readError:"CLOUDFLARE_READ_HTTP_403"});
assert.equal(fail.state,"PHYSICAL_D1_READ_UNAVAILABLE");
assert.equal(fail.scheduledInvocationsProven,false);
assert.equal(fail.noD1Write,true);
const script=await readFile(new URL("../ops/system1_p0_historical_cron_d1_select_readonly_20261015.mjs",import.meta.url),"utf8");
assert.match(script,/if\(sql!==CRON_SELECT&&sql!==LEASE_SELECT\)/);
assert.match(script,/requests\.select>2/);
assert.match(script,/database\?per_page=100/);
assert.match(script,/name==="v7-live"/);
assert.match(script,/rowsWritten/);
assert.match(script,/requireVerifiedSelectMetrics/);
assert.doesNotMatch(script,/wrangler deploy|workers\/scripts\/fugle-test\/deployments/);
assert.doesNotMatch(script,/INSERT INTO|UPDATE v7_|DELETE FROM|DROP TABLE|CREATE TABLE/i);
const workflow=await readFile(new URL("../.github/workflows/system1-p0-historical-cron-d1-readonly.yml",import.meta.url),"utf8");
assert.match(workflow,/workflow_dispatch:/);
assert.match(workflow,/pull_request:/);
assert.doesNotMatch(workflow,/^  push:/m);
assert.doesNotMatch(workflow,/^  schedule:/m);
assert.match(workflow,/if: github\.event_name == 'workflow_dispatch'/);
assert.match(workflow,/node tests\/test_system1_p0_historical_cron_d1_readback_v0_1\.mjs/);
console.log(JSON.stringify({ok:true,suite:"historical_20261015_select_only_and_falsification",
 noCronAbsenceInference:true,exactTwoSlotWindow:true,leaseIsNotParent:true,
 noAutomaticProductionQuery:true,noBusinessPOST:true,noD1Write:true,noWorkerDeploy:true,
 noPush:true,noTrade:true}));
