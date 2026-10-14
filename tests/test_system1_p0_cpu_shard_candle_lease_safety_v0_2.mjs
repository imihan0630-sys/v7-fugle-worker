import assert from "node:assert/strict";
import {buildIndependentMonitorShards} from "../ops/system1_p0_free_cpu_shard_oracle_v0_1.mjs";
import {evaluateCpuShardCadence,originalCompletedFrameExpectation,
 auditOriginalCandleFreshness,auditOriginalSignalLease} from
 "../ops/system1_p0_cpu_shard_candle_lease_safety_v0_2.mjs";
import {readFileSync} from "node:fs";
let cases=0;
const yes=(condition,reason)=>{assert.ok(condition,reason);cases++};
const equal=(a,b,reason)=>{assert.deepEqual(a,b,reason);cases++};
const throws=(fun,re,reason)=>{assert.throws(fun,re,reason);cases++};
const source=readFileSync(new URL("../Worker.js",import.meta.url),"utf8");
yes(source.includes("const LIVE_STALE_SECONDS = 90;"),"exact original Worker 90s freshness constant kept");
yes(source.includes("const SIGNAL_STATE_PREFIX = \"V7_SIGNAL_STATE:\";"),"original D1 signal-state key preserved");
yes(source.includes("const need10 = minutesSinceOpen >= 11"),"original 10m grace gate preserved");
yes(source.includes("const need15 = minutesSinceOpen >= 16"),"original 15m grace gate preserved");
yes(source.includes("await acquireSignalStateLease(env,key)"),"real D1 primary lease function unchanged");
yes(source.includes('finally {\n    await env.V7_DB.withSession("first-primary").prepare("UPDATE v7_signal_delivery_state SET lease_token=NULL,lease_until=0 WHERE state_key=?1 AND lease_token=?2")'),"original signal finally explicitly releases D1 lease with matching token");
const p=buildIndependentMonitorShards({
 formal:["6226","8046","3037","6191","2609"].map(symbol=>({symbol})),
 aideen:["6213","3189","6672","2404"].map(symbol=>({symbol})),
 shardSize:3
});
const rotation=evaluateCpuShardCadence({plan:p});
equal(rotation.worstCaseRefreshSeconds,180,"one invocation per minute gives three-minute revisit");
equal(rotation.status,"NOT_VIABLE_90_SECOND_ORIGINAL_FRESHNESS","3-minute rotation is BLOCKED for production");
yes(!rotation.canDeploy&&!rotation.originalFreshnessGuaranteedByCadence,"cannot falsely approve stale rotation");
const parallel=evaluateCpuShardCadence({plan:p,parallelInvocationsPerMinute:3});
equal(parallel.worstCaseRefreshSeconds,60,"three independent CPU-bound invocations within each minute only one-minute nominal revisit");
yes(parallel.originalFreshnessGuaranteedByCadence&&!parallel.canDeploy,
 "parallel schedule feasibility is NOT deployed technical proof");
yes(parallel.freeWorkerFanoutActuallyDeployed===false,"no imaginary Cloudflare Service Binding");
throws(()=>evaluateCpuShardCadence({plan:p,parallelInvocationsPerMinute:2,originalQuoteFreshSeconds:180}),
 /ORIGINAL_WORKER_FRESHNESS_CONTRACT_UNVERIFIED/,"disallow fake 180-second relaxation");
throws(()=>evaluateCpuShardCadence({plan:p,parallelInvocationsPerMinute:4}),
 /ORIGINAL_WORKER_FRESHNESS_CONTRACT_UNVERIFIED/,"max 3 separate invocations in proposed design");
const tradeDate="2026-10-14";
const local=time=>tradeDate+"T"+time+"+08:00";
const frame=(tf,time,count=1)=>({timeframe:tf,completedBars:count,latest:{time:local(time)}});
const expectation=(time,tf)=>originalCompletedFrameExpectation({
 tradeDate,now:local(time),timeframeMinutes:tf});
equal(expectation("09:10:00",10).expectedLatestStart,null,"09:10 newly closed 10m candle must not be used");
equal(expectation("09:11:00",10).expectedLatestStart,"2026-10-14T01:00:00.000Z","09:11 permits 09:00 ten-minute completed bar");
equal(expectation("09:15:00",15).expectedLatestStart,null,"09:15 newly closed 15m candle blocked");
equal(expectation("09:16:00",15).expectedLatestStart,"2026-10-14T01:00:00.000Z","09:16 permits completed 09:00 15m candle");
equal(expectation("09:21:00",10).expectedLatestStart,"2026-10-14T01:10:00.000Z","09:21 newer completed 10m bar");
equal(expectation("09:31:00",15).expectedLatestStart,"2026-10-14T01:15:00.000Z","09:31 newer completed 15m bar");
equal(expectation("09:34:00",15).expectedLatestStart,"2026-10-14T01:15:00.000Z","staggered group still expects 09:15 15m at 09:34");
equal(expectation("13:24:00",15).expectedLatestStart,"2026-10-14T05:00:00.000Z","13:24 latest 15m start 13:00");
throws(()=>expectation("08:59:00",10),/OUTSIDE_ORIGINAL/,"cannot scan before 09:00");
throws(()=>expectation("13:25:00",10),/OUTSIDE_ORIGINAL/,"cannot scan after 13:24");
throws(()=>originalCompletedFrameExpectation({tradeDate:"2026-10-13",now:local("09:16:00"),timeframeMinutes:15}),
 /CANDLE_TRADING_DAY_CLOCK_MISMATCH/,"wrong date rejected");
throws(()=>expectation("09:16:00",5),/ORIGINAL_ONLY/,"no invented 5-minute strategy");
// Simulate independent group delayed 2 minutes beyond exact candle boundary.
const quoteUs=time=>Date.parse(local(time))*1000;
const args=(time,tf,before,after,quoteTime=time)=>({
 tradeDate,now:local(time),timeframeMinutes:tf,
 previousFrame:before,receivedFrame:after,originalQuoteFresh:true,
 providerQuoteTimestampMicroseconds:quoteUs(quoteTime)
});
const ten=auditOriginalCandleFreshness(args("09:13:00",10,frame(10,"09:00:00"),null));
yes(ten.valid&&!ten.mustFetchCompletedFrame&&ten.alreadyCurrent,"reused 10m bar exact and newest within grace");
const fifteen=auditOriginalCandleFreshness(args("09:18:00",15,null,frame(15,"09:00:00")));
yes(fifteen.valid&&fifteen.mustFetchCompletedFrame,"9:18 delayed group still fetches 09:00 15m");
const staleFrame=auditOriginalCandleFreshness(args("09:32:00",15,frame(15,"09:00:00"),null));
yes(!staleFrame.valid&&staleFrame.mustFetchCompletedFrame,"missing new 09:15 frame fail closed");
const updated=auditOriginalCandleFreshness(args("09:32:00",15,frame(15,"09:00:00"),frame(15,"09:15:00",2)));
yes(updated.valid&&updated.mustFetchCompletedFrame,"09:32 catches up without changing 15m closed-bar strategy");
yes(!auditOriginalCandleFreshness(args("09:10:00",10,null,frame(10,"09:00:00"))).valid,
 "cannot use 10m candle at unconfirmed closure minute");
yes(!auditOriginalCandleFreshness(args("09:16:00",15,null,frame(15,"09:15:00"))).valid,
 "ongoing 09:15 15m bar cannot be used as already closed");
yes(!auditOriginalCandleFreshness(args("09:18:00",15,null,frame(15,"09:00:00"),"09:16:00")).valid,
 "original 90s quote validity not weakened under shard merge");
yes(!auditOriginalCandleFreshness({...args("09:18:00",15,null,frame(15,"09:00:00")),originalQuoteFresh:false}).valid,
 "producer quote invalid remains blocked");
yes(!auditOriginalCandleFreshness({...args("09:18:00",15,null,frame(15,"09:00:00")),providerQuoteTimestampMicroseconds:0}).valid,
 "missing real microsecond quote time blocks a valid candle");
yes(!auditOriginalCandleFreshness({...args("09:18:00",15,null,frame(15,"09:00:00")),providerQuoteTimestampMicroseconds:quoteUs("09:20:00")}).valid,
 "future vendor time blocked");
// Original single-symbol D1 lease + exactly-once episode idempotence.
const time=local("09:31:40");
const lease={source:"D1_PRIMARY",granted:true,stateKey:"V7_SIGNAL_STATE:6226",
 token:"valid-production-like-but-synthetic-token",leaseUntil:local("09:33:00")};
const prior={tradeDate,positionStage:"FIRST",testMode:false,episodes:{},fired:[],pendingDeliveries:{}};
const base={tradeDate,now:time,symbol:"6226",pool:"FORMAL",signalType:"BUY",
 positionStage:"FIRST",planDate:tradeDate,lease,previousState:prior,episode:1,
 signalId:"2026-10-14:6226:FIRST:BUY:episode-1",
 originalQuoteFresh:true,formal15Fresh:true,auxiliary10Fresh:true};
const leaseResult=auditOriginalSignalLease(base);
yes(leaseResult.stagingContractSatisfied,"valid isolated mock D1 lease contract");
yes(!leaseResult.maySendPush&&!leaseResult.mayWriteD1&&
 leaseResult.actualProductionD1CASVerified===false,"never authorize push by offline oracle");
const blocked=(change,reason)=>yes(!auditOriginalSignalLease({...base,...change}).stagingContractSatisfied,reason);
blocked({planDate:"2026-10-13"},"yesterday plan blocks new signal");
blocked({lease:{...lease,granted:false}},"lease denied blocks new signal");
blocked({lease:{...lease,source:"KV_FALLBACK"}},"KV is not authoritative push lock");
blocked({lease:{...lease,stateKey:"V7_SIGNAL_STATE:6225"}},"other stock lease disallowed");
blocked({lease:{...lease,leaseUntil:local("09:31:00")}},"expired D1 lease refused");
blocked({lease:{...lease,leaseUntil:local("09:45:00")}},"excessively extended D1 lease refused");
blocked({previousState:{...prior,tradeDate:"2026-10-13"}},"previous-day D1 snapshot cannot be silently promoted");
blocked({previousState:{...prior,positionStage:"SECOND"}},"position-stage mismatch blocks state writes");
blocked({originalQuoteFresh:false},"stale quote blocks push");
blocked({formal15Fresh:false},"unconfirmed 15m bar blocks formal signal");
blocked({signalId:"2026-10-14:6226:FIRST:BUY:episode-2"},"wrong episode id blocked");
blocked({previousState:{...prior,pendingDeliveries:{"FIRST:BUY":{status:"RESERVED"}}}},
 "pending unknown delivery cannot be retried");
blocked({previousState:{...prior,fired:["FIRST:BUY"]}},
 "already fired stage cannot duplicate");
blocked({previousState:{...prior,episodes:{"FIRST:BUY":1}}},
 "non-incrementing episode blocked");
blocked({tradeDate:"2026-10-13",planDate:"2026-10-13"},"wrong trading-date epoch cannot mix");
const early={...base,signalType:"EARLY_ALERT_10M",
 signalId:"2026-10-14:6226:FIRST:EARLY_ALERT_10M:episode-1",formal15Fresh:false};
yes(auditOriginalSignalLease(early).stagingContractSatisfied,"10m auxiliary only remains distinguishable");
blocked({signalType:"EARLY_ALERT_10M",signalId:early.signalId,auxiliary10Fresh:false},
 "unclosed/stale 10m prevents early alert");
console.log("SYSTEM1_CPU_SHARD_90S_CANDLE_LEASE_SAFETY_PASS="+JSON.stringify({
 cases,offlineOnly:true,strictOriginalQuoteFreshSeconds:90,
 threeMinuteRotationBlocked:true,parallelFanoutNotDeployed:true,
 tenMinuteBarCloseGraceMinute:1,fifteenMinuteBarCloseGraceMinute:1,
 noPush:true,noD1Writes:true,noWorkerDeploy:true}));
