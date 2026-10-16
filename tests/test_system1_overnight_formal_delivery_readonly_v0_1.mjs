import assert from "node:assert/strict";
import {resolveScheduledPostcloseTarget,resolveSourceReadyHandoffTarget,classifyPostcloseBusinessChain} from "../research/system1_overnight_formal_delivery_readonly_v0_1.mjs";
const day="2026-10-14";
const localBefore=resolveScheduledPostcloseTarget("2026-10-14T15:56:00Z");
assert.deepEqual([localBefore.status,localBefore.targetDate],["EXACT_SAME_EVENING",day]);
const late=resolveScheduledPostcloseTarget("2026-10-14T19:45:09Z"); // actual health job 10/15 03:45
assert.deepEqual([late.status,late.targetDate],["FROZEN_PRIOR_CALENDAR_DAY_READONLY",day]);
assert.equal(resolveScheduledPostcloseTarget("2026-10-14T22:59:59Z").targetDate,day); // 06:59
assert.equal(resolveScheduledPostcloseTarget("2026-10-14T23:00:00Z").targetDate,null); // 07:00
assert.equal(resolveScheduledPostcloseTarget("2026-10-14T12:15:00Z").status,"POSTCLOSE_DATE_UNRESOLVED_FAIL_CLOSED");
assert.throws(()=>resolveScheduledPostcloseTarget("not-a-date"),/INVALID_TAIPEI_TIME/);
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T14:43:00Z").status,"SOURCE_COMPLETED_BEFORE_FORMAL_DUE");
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T14:43:00Z").targetDate,null);
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T15:35:00Z").targetDate,day);
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T19:43:40Z").targetDate,day);
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T22:59:59Z").targetDate,day);
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T23:00:00Z").targetDate,null);
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T10:09:00Z").targetDate,null);
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T10:10:00Z").status,"SOURCE_COMPLETED_BEFORE_FORMAL_DUE");

const q={marketDate:day,index:{ready:true},tdcc:{ready:true},datasets:{
 FINANCIAL:{ready:true,count:1881},VALUATION:{ready:true,count:1969},
 ANNOUNCEMENTS:{ready:true,count:108},QUARTER_EPS:{ready:true,count:0}}};
const inst={marketDate:day,ready:true,validDates:[day,"2026-10-13","2026-10-12"]};
const stock={symbol:"2340",planDate:"2026-10-15",stop:36.5,totalAllocation:50000,firstShares:750};
const scan={scanDate:day,dryRun:false,testMode:false,selectedCount:1,stocks:[stock],
 config:{verified:true,updatedAt:"2026-10-14T15:56:12Z"},
 pipeline:{complete:false,externalPlanVerified:false},
 threeMin:{verified:false},
 dailyReport:{sent:true,simulated:false,signalId:"DAILY_SELECTION:"+day}};
const monitor={source:"KV",updatedAt:scan.config.updatedAt,stocks:[{...stock}]};
const outbox={configured:true,recent:[{signal_id:"DAILY_SELECTION:"+day,delivery_state:"ACCEPTED"}]};
const read={targetDate:day,institution:inst,quality:q,scanStatus:scan,monitor,outbox};
const check=(delta,reason)=>{
 const x=classifyPostcloseBusinessChain({...read,...delta});
 assert.equal(x.category,reason);
 assert.equal(x.ok,false);
 assert.equal(x.mayRetryAmbiguousPost,false);
 assert.equal(x.noBusinessPOST,true);
};
const accepted=classifyPostcloseBusinessChain(read);
assert.equal(accepted.ok,true);
assert.equal(accepted.primaryMonitorReadbackVerified,true);
assert.equal(accepted.optionalThreeMinVerified,false);
assert.equal(accepted.formalPipelineComplete,false);
assert.equal(accepted.handsetReceiptVerified,false);
check({scanStatus:{status:"尚未執行盤後掃描"}},"FORMAL_SCAN_NOT_SAVED_AFTER_READY_SOURCES");
check({scanStatus:{scanDate:"2026-09-29"}},"FORMAL_SCAN_STALE_DATE");
check({scanStatus:{...scan,dryRun:true}},"FORMAL_SCAN_NOT_COMPLETE");
check({scanStatus:{...scan,selectedCount:7,stocks:Array(7).fill(stock)}},"FORMAL_SCAN_NOT_COMPLETE");
check({scanStatus:{...scan,config:{verified:false}}},"FORMAL_SCAN_NOT_COMPLETE");
check({monitor:{...monitor,source:"RUNTIME"}},"PRIMARY_MONITOR_KV_NOT_VERIFIED");
check({monitor:{...monitor,updatedAt:"2026-10-13T15:56:12Z"}},"PRIMARY_MONITOR_KV_NOT_VERIFIED");
check({monitor:{...monitor,stocks:[{...stock,stop:0}]}},"PRIMARY_MONITOR_KV_NOT_VERIFIED");
check({monitor:{...monitor,stocks:[]}},"PRIMARY_MONITOR_KV_NOT_VERIFIED");
check({scanStatus:{...scan,dailyReport:{sent:false,simulated:false,signalId:"DAILY_SELECTION:"+day}}},"DAILY_SELECTION_REPORT_NOT_SENT");
check({scanStatus:{...scan,dailyReport:{sent:true,simulated:false}}},"DAILY_SELECTION_SIGNAL_ID_NOT_VERIFIED");
check({scanStatus:{...scan,dailyReport:{sent:true,simulated:true,signalId:"DAILY_SELECTION:"+day}}},"DAILY_SELECTION_REPORT_NOT_SENT");
check({outbox:{configured:false,recent:outbox.recent}},"DAILY_SELECTION_OUTBOX_NOT_ACCEPTED");
check({outbox:{configured:true,recent:[{signal_id:"DAILY_SELECTION:2026-10-13",delivery_state:"ACCEPTED"}]}},"DAILY_SELECTION_OUTBOX_NOT_ACCEPTED");
check({outbox:{configured:true,recent:[{signal_id:"DAILY_SELECTION:"+day,delivery_state:"PENDING"}]}},"DAILY_SELECTION_OUTBOX_NOT_ACCEPTED");
check({outbox:{configured:true,recent:[...outbox.recent,...outbox.recent]}},"DAILY_SELECTION_OUTBOX_NOT_ACCEPTED");
check({readErrors:{scanStatus:"HTTP_503"}},"GET_READ_ERROR");
check({institution:{...inst,ready:false},scanStatus:{}},"FORMAL_SCAN_NOT_SAVED_SOURCE_UNVERIFIED");
const zero={...scan,stocks:[],selectedCount:0};
const zeroRead={...read,scanStatus:zero,monitor:{...monitor,stocks:[]}};
assert.equal(classifyPostcloseBusinessChain(zeroRead).ok,true);
assert.equal(classifyPostcloseBusinessChain(zeroRead).mayCountAsZeroPicks,true);
const old={...read,scanStatus:{...scan,threeMin:{verified:true},pipeline:{complete:true}}};
assert.equal(classifyPostcloseBusinessChain(old).ok,true);
assert.throws(()=>classifyPostcloseBusinessChain({...read,targetDate:"2026-02-30"}),/ORIGINAL_SESSION_DATE_REQUIRED/);
console.log(JSON.stringify({ok:true,originalDateFrozen:true,
 doesNotRedAlertBefore2335:true,primaryMonitorKvParityRequired:true,
 rejectsWrongDateOutboxAndDuplicate:true,optional3MinNotP0Blocking:true,
 zeroPickRequiresOriginalFormal:true,ambiguous503NoRetry:true,
 noBusinessPOST:true,noD1Write:true,noPush:true,noTrade:true}));
