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
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T14:43:00Z").targetDate,day);
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T19:43:40Z").targetDate,day);
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T22:59:59Z").targetDate,day);
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T23:00:00Z").targetDate,null);
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T10:09:00Z").targetDate,null);
assert.equal(resolveSourceReadyHandoffTarget("2026-10-14T10:10:00Z").targetDate,day);
const q={marketDate:day,index:{ready:true},tdcc:{ready:true},datasets:{
 FINANCIAL:{ready:true,count:1881},VALUATION:{ready:true,count:1969},
 ANNOUNCEMENTS:{ready:true,count:108},QUARTER_EPS:{ready:true,count:11}}};
const inst={marketDate:day,ready:true,validDates:[day,"2026-10-13","2026-10-12"]};
const read={targetDate:day,institution:inst,quality:q,outbox:{recent:[]}};
const noScan=classifyPostcloseBusinessChain({...read,scanStatus:{status:"尚未執行盤後掃描"}});
assert.equal(noScan.category,"FORMAL_SCAN_NOT_SAVED_AFTER_READY_SOURCES");
assert.equal(noScan.sourcesReady,true);
assert.equal(noScan.mayCountAsZeroPicks,false);
assert.equal(noScan.mayRetryAmbiguousPost,false);
assert.equal(noScan.noBusinessPOST,true);
assert.equal(classifyPostcloseBusinessChain({...read,scanStatus:{scanDate:"2026-09-29"}}).category,"FORMAL_SCAN_STALE_DATE");
assert.equal(classifyPostcloseBusinessChain({...read,readErrors:{scanStatus:"HTTP_503"}}).category,"GET_READ_ERROR");
assert.equal(classifyPostcloseBusinessChain({...read,institution:{...inst,ready:false},scanStatus:{}}).category,"FORMAL_SCAN_NOT_SAVED_SOURCE_UNVERIFIED");
const baseScan={scanDate:day,dryRun:false,testMode:false,selectedCount:5,stocks:Array.from({length:5},(_,i)=>({symbol:String(1000+i)})),
 pipeline:{complete:true}};
assert.equal(classifyPostcloseBusinessChain({...read,scanStatus:baseScan}).category,"EXTERNAL_MONITOR_PLAN_NOT_VERIFIED");
const genericOnly={...baseScan,pipeline:{...baseScan.pipeline,externalPlanVerified:true}};
assert.equal(classifyPostcloseBusinessChain({...read,scanStatus:genericOnly}).category,"EXTERNAL_MONITOR_PLAN_NOT_VERIFIED");
const providerOnly={...baseScan,planBridge:{github:{verified:true}}};
assert.equal(classifyPostcloseBusinessChain({...read,scanStatus:providerOnly}).category,"EXTERNAL_MONITOR_PLAN_NOT_VERIFIED");
const saved={...genericOnly,planBridge:{provider:"D1_GITHUB_ENCRYPTED",github:{verified:true}}};
assert.equal(classifyPostcloseBusinessChain({...read,scanStatus:saved}).category,"DAILY_SELECTION_REPORT_NOT_SENT");
const reported={...saved,dailyReport:{sent:true,simulated:false,signalId:"DAILY_SELECTION:"+day}};
assert.equal(classifyPostcloseBusinessChain({...read,scanStatus:reported}).category,"DAILY_SELECTION_OUTBOX_NOT_ACCEPTED");
const accepted=classifyPostcloseBusinessChain({...read,scanStatus:reported,
 outbox:{recent:[{signal_id:"DAILY_SELECTION:"+day,delivery_state:"ACCEPTED"}]}});
assert.equal(accepted.category,"POSTCLOSE_GET_CHAIN_CONFIRMED_NOT_HANDSET_RECEIPT");
assert.equal(accepted.ok,true);
assert.equal(accepted.handsetReceiptVerified,false);
const zero={scanDate:day,dryRun:false,testMode:false,selectedCount:0,stocks:[],
 pipeline:{complete:true},dailyReport:{sent:true,simulated:false}};
assert.equal(classifyPostcloseBusinessChain({...read,scanStatus:zero,
 outbox:{recent:[{signal_id:"DAILY_SELECTION:"+day,delivery_state:"ACCEPTED"}]}}).ok,true);
assert.equal(classifyPostcloseBusinessChain({...read,scanStatus:zero}).mayCountAsZeroPicks,true);
assert.equal(classifyPostcloseBusinessChain({...read,scanStatus:zero,
 outbox:{recent:[{signal_id:"DAILY_SELECTION:"+day,delivery_state:"ACCEPTED"}]}}).externalPlanReadbackVerified,false);
assert.equal(classifyPostcloseBusinessChain({...read,scanStatus:{...reported,stocks:[]}}).category,"FORMAL_SCAN_NOT_COMPLETE");
assert.throws(()=>classifyPostcloseBusinessChain({...read,targetDate:"2026-02-30"}),/ORIGINAL_SESSION_DATE_REQUIRED/);
console.log(JSON.stringify({ok:true,originalOct15_0345FrozenToOct14:true,
 officialOct14ReadyButNoFormalClassification:true,ambiguous503NoReplay:true,
 zeroPickRequiresProvenScan:true,externalReadbackAndPushAreSeparate:true,
 no3MinPOST:true,noBusinessPOST:true,noD1OrKvWrite:true,noPush:true,noTrade:true}));
