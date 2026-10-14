// System1 P0 CPU sharding v0.2: PURE OFFLINE gating contracts, no runtime use.
// Key discovery: original Worker.js LIVE_STALE_SECONDS=90. Three-minute single-Cron
// rotation is NOT viable without semantic downgrade. Analyze concurrent CPU-isolated
// invocations and exact original 10/15-minute completed-candle time/lease rules.
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const SYMBOL=/^[1-9][0-9]{3}$/;
const ROLE=new Set(["FORMAL","AIDEEN_APP"]);
const ENTRY_TYPES=new Set(["BUY","ADD","EARLY_ALERT_10M"]);
const VALID_TYPES=new Set(["BUY","ADD","EARLY_ALERT_10M","REDUCE","PROFIT_CHECK","SELL","STOP_LOSS","PLAN_INVALIDATED"]);
const tpDay=date=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(date);
const epoch=d=>{const v=Date.parse(d);if(!Number.isFinite(v))throw Error("INVALID_OBSERVATION_TIMESTAMP");return v;};
function checkMarketClock(day,now){
 if(!DAY.test(String(day))||tpDay(new Date(epoch(now)))!==day)throw Error("CANDLE_TRADING_DAY_CLOCK_MISMATCH");
 const ms=epoch(now),start=Date.parse(day+"T09:00:00+08:00");
 if(ms<start||ms>=Date.parse(day+"T13:25:00+08:00"))throw Error("OUTSIDE_ORIGINAL_09_00_TO_13_24_WINDOW");
 return {ms,start,minutes:Math.floor((ms-start)/60000)};
}
// Pure feasibility check – 90-second legacy eligibility must NEVER be
// widened to 180s/300s to declare an originally equivalent live system.
export function evaluateCpuShardCadence({plan,parallelInvocationsPerMinute=1,
 originalQuoteFreshSeconds=90,originalCronMinuteInterval=60}={}){
 if(!plan?.notAuthorizedForProduction||plan.expectedKeys?.length!==9||
    !Number.isInteger(parallelInvocationsPerMinute)||parallelInvocationsPerMinute<1||
    parallelInvocationsPerMinute>3||
    originalQuoteFreshSeconds!==90||originalCronMinuteInterval!==60)
  throw Error("ORIGINAL_WORKER_FRESHNESS_CONTRACT_UNVERIFIED");
 const shards=plan.groups?.length;
 if(!Number.isInteger(shards)||shards<1)throw Error("SHARD_GROUP_COUNT_INVALID");
 const coveragePerMinute=Math.min(shards,parallelInvocationsPerMinute);
 const worstCaseRefreshSeconds=Math.ceil(shards/coveragePerMinute)*originalCronMinuteInterval;
 const originalFreshnessGuaranteedByCadence=worstCaseRefreshSeconds<=originalQuoteFreshSeconds;
 return {status:originalFreshnessGuaranteedByCadence?
   "CADENCE_ONLY_FEASIBLE_REQUIRES_REAL_PROVIDER_AND_ATOMIC_PROOF":
   "NOT_VIABLE_90_SECOND_ORIGINAL_FRESHNESS",
  parallelInvocationsPerMinute,shards,worstCaseRefreshSeconds,
  originalQuoteFreshSeconds,originalFreshnessGuaranteedByCadence,
  // 3 physical invocations from one Cron would require protected internal
  // fan-out and atomic reassembly. No such resource has been created.
  freeWorkerFanoutActuallyDeployed:false,
  finalSnapshotReadbackVerified:false,
  original10m15mBarAndSignalIdempotenceVerified:false,
  productionApproval:false,canDeploy:false,
  mayModifyExistingWorker:false,maySendPush:false,noSourceMutation:true};
}
export function originalCompletedFrameExpectation({tradeDate,now,timeframeMinutes}={}){
 if(timeframeMinutes!==10&&timeframeMinutes!==15)throw Error("ORIGINAL_ONLY_10_OR_15_MIN_FRAMES");
 const {start,minutes}=checkMarketClock(tradeDate,now);
 // Original code starts a 10m request at 09:11, 15m at 09:16,
 // i.e. one full minute AFTER the bar's close; never 09:10/09:15.
 const completedCount=Math.max(0,Math.floor((minutes-1)/timeframeMinutes));
 const frameStartMs=completedCount>0?start+(completedCount-1)*timeframeMinutes*60000:null;
 return {tradeDate,timeframeMinutes,completedCount,expectedLatestStart:
  frameStartMs===null?null:new Date(frameStartMs).toISOString(),
  expectedLatestEnd:frameStartMs===null?null:new Date(frameStartMs+timeframeMinutes*60000).toISOString(),
  oneMinuteCloseGraceKept:true,originalIntradayWindowKept:true};
}
export function auditOriginalCandleFreshness({tradeDate,now,previousFrame,receivedFrame,
 timeframeMinutes,originalQuoteFresh,providerQuoteTimestampMicroseconds}={}){
 const expected=originalCompletedFrameExpectation({tradeDate,now,timeframeMinutes});
 const clock=epoch(now);
 const rawQuote=Number(providerQuoteTimestampMicroseconds);
 const quoteTime=Number.isFinite(rawQuote)&&rawQuote>=1e14&&rawQuote<1e17?
  rawQuote/1000:NaN;
 const quoteAge=(clock-quoteTime)/1000;
 const quoteValid=originalQuoteFresh===true&&Number.isFinite(quoteTime)&&
  tpDay(new Date(quoteTime))===tradeDate&&quoteAge>=-5&&quoteAge<=90;
 const previouslyStamped=Date.parse(previousFrame?.latest?.time);
 const alreadyCurrent=expected.expectedLatestStart!==null&&
  previouslyStamped===Date.parse(expected.expectedLatestStart);
 const fetchRequired=expected.expectedLatestStart!==null&&!alreadyCurrent;
 const candidate=receivedFrame??previousFrame;
 const latestStart=Date.parse(candidate?.latest?.time);
 const expectedMs=Date.parse(expected.expectedLatestStart);
 const barVerified=expected.expectedLatestStart!==null&&
  Number.isFinite(latestStart)&&latestStart===expectedMs&&
  candidate?.timeframe===timeframeMinutes&&candidate?.completedBars>=expected.completedCount;
 // Match original Worker executionDataStatus freshness bound:
 // now - bar_end <= timeframe*60000 + LIVE_STALE_SECONDS*1000.
 const originalBarFresh=barVerified&&
  clock-(latestStart+timeframeMinutes*60000)<=timeframeMinutes*60000+90000&&
  latestStart+timeframeMinutes*60000<=clock;
 const valid=Boolean(quoteValid&&originalBarFresh);
 return {tradeDate,timeframeMinutes,...expected,
  quoteAgeSeconds:Number.isFinite(quoteAge)?quoteAge:null,
  quoteValid,barVerified,originalBarFresh,valid,
  mustFetchCompletedFrame:fetchRequired,alreadyCurrent,
  cannotUseUnclosedCandle:true,cannotWiden90SecondQuoteLimit:true,
  // A validated candle is not equivalent to a stateful original signal.
  productionSignalAuthorized:false,maySendPush:false,noProductionMutation:true};
}
// A D1 lease and idempotence proof is required BEFORE any new signal would
// be considered in a staging-only experiment. Original Worker.js must remain
// responsible for live signal state transitions, actual pushes and position locks.
export function auditOriginalSignalLease({tradeDate,now,symbol,pool,signalType,
 positionStage,planDate,lease,previousState,episode=1,signalId,
 originalQuoteFresh,formal15Fresh,auxiliary10Fresh}={}){
 if(!DAY.test(String(tradeDate))||!SYMBOL.test(String(symbol))||
    !ROLE.has(pool)||!VALID_TYPES.has(signalType)||!Number.isInteger(episode)||episode<1)
   throw Error("ORIGINAL_SIGNAL_LEASE_INPUT_INVALID");
 const time=epoch(now);
 const reasons=[];
 const key="V7_SIGNAL_STATE:"+symbol;
 const suffix=positionStage+":"+signalType;
 if(tpDay(new Date(time))!==tradeDate)reasons.push("WRONG_TRADING_EPOCH");
 if(typeof positionStage!=="string"||!positionStage)reasons.push("UNKNOWN_POSITION_STAGE");
 if(planDate!==tradeDate)reasons.push("PLAN_DATE_NOT_FRESH");
 if(lease?.source!=="D1_PRIMARY"||lease?.granted!==true||lease?.stateKey!==key||
   typeof lease?.token!=="string"||lease.token.length<12||
   !Number.isFinite(Date.parse(lease?.leaseUntil))||Date.parse(lease.leaseUntil)<=time||
   Date.parse(lease.leaseUntil)>time+180000)
  reasons.push("AUTHORITATIVE_D1_LEASE_NOT_PROVEN");
 if(previousState?.tradeDate!==tradeDate||
    previousState?.positionStage!==positionStage||
    typeof previousState?.testMode!=="boolean")
  reasons.push("PREVIOUS_D1_STATE_EPOCH_STAGE_UNVERIFIED");
 if(originalQuoteFresh!==true||
   (signalType==="EARLY_ALERT_10M"?auxiliary10Fresh!==true:formal15Fresh!==true))
  reasons.push("ORIGINAL_QUOTE_OR_CANDLE_GATE_BLOCKED");
 if(!Number.isInteger(previousState?.episodes?.[suffix]??0)||
   Number(previousState?.episodes?.[suffix]??0)>=episode)
  reasons.push("EPISODE_NOT_MONOTONE");
 const exactId=tradeDate+":"+symbol+":"+positionStage+":"+signalType+":episode-"+episode;
 if(signalId!==exactId)reasons.push("ORIGINAL_EPISODE_SIGNAL_ID_MISMATCH");
 if(previousState?.pendingDeliveries?.[suffix])
  reasons.push("PENDING_DELIVERY_MUST_NEVER_BLIND_RETRY");
 if(previousState?.fired?.includes(suffix))
  reasons.push("ALREADY_FIRED_THIS_POSITION_STAGE");
 // Staging says only "would pass contract guard", never a license to invoke
 // original stateful Worker, nor a claim D1 CAS readback happened.
 return {symbol,pool,tradeDate,signalType,positionStage,
  stagingContractSatisfied:reasons.length===0,reasons,
  originalLeaseKey:key,expectedSignalId:exactId,
  maySendPush:false,mayWriteD1:false,mayModifyPosition:false,
  releaseLeaseMustRemainInFinally:true,
  actualProductionD1CASVerified:false,
  repeatedRuntimePushSafetyProven:false,
  requiresExistingOriginalStateMachine:true};
}
