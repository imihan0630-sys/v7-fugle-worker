import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url);
const source=await readFile(workerPath,"utf8");
const api=await import("data:text/javascript;base64,"+Buffer.from(source+`
export {
  pvShadowEnabled,pvCanonicalJson,pvMedian,pvTaipeiSlot,pvExtractCompletedSession15,
  pvNormalizeHistoricalSessions,pvMergeBaselineSessions,pvBaselineStats,pvEvaluateGuards,
  pvComputeResponse,pvAdvancePersistence,pvAdvanceAcceptance,pvSnapshotIdentity,
  pvDecideImmutableWrite,pvSnapshotFingerprint,pvInsertSnapshotImmutable,pvBuildSameSessionOutcome,
  pvOutcomeFingerprint,pvInsertOutcomeImmutable,pvFormalFingerprintPayload,pvBuildDailyFeature,pvBuildDailyOutcome
};`).toString("base64"));

const iso=(day,slot)=>`${day}T${String(Number(slot.slice(0,2))-8).padStart(2,"0")}:${slot.slice(3)}:00.000Z`;
const rawBar=(date,{open=100,high=102,low=99,close=101,volume=100}={})=>({date,open,high,low,close,volume});
const session=(marketDate,volume=100,range=2)=>({marketDate,bars:[{
  slotKey:"09:00",time:iso(marketDate,"09:00"),open:100,high:100+range,low:100,close:101,
  volume,trueRange:range,cumulativeVolume:volume,cumulativeValid:true
}]});

assert.equal(api.pvShadowEnabled({}),false,"PV must default OFF");
assert.equal(api.pvShadowEnabled({PV_SHADOW_ENABLED:"true"}),true);
assert.match(source,/const PV_SHADOW_SCHEMA_VERSION = "PV_SHADOW_V0_1"/);
assert.match(source,/decisionImpact:false/);
const pvHelperSource=source.slice(source.indexOf("function pvShadowEnabled"),source.indexOf("async function analyzeStockSmart"));
assert.equal((pvHelperSource.match(/fetchCandles\(/g)||[]).length,0,"PV helper layer must not add ordinary live candle calls");
assert.equal((pvHelperSource.match(/sendTrackedPush\(/g)||[]).length,0,"PV helper layer must not send pushes");

// T1: baseline is strictly prior-only; current/future sessions cannot leak.
const priorSessions=[];
for(let day=1;day<=20;day+=1) priorSessions.push(session(`2026-08-${String(day).padStart(2,"0")}`,100+day,2));
const leakSession=session("2026-09-01",999999,99);
const strictStats=api.pvBaselineStats({sessions:[...priorSessions,leakSession]},"2026-09-01","09:00");
assert.equal(strictStats.slotHistoryCount,20);
assert.equal(strictStats.slotVolumeMedian20,110.5);
assert.equal(strictStats.slotRangeMedian20,2);
assert.equal(strictStats.baselineAsOfDate,"2026-08-20");

// T2: a 15m bar becomes observable only after its end boundary.
const boundaryRaw={data:[rawBar("2026-09-24T01:00:00.000Z")]};
assert.equal(api.pvExtractCompletedSession15(boundaryRaw,Date.parse("2026-09-24T01:14:59.999Z"),99).bars.length,0);
assert.equal(api.pvExtractCompletedSession15(boundaryRaw,Date.parse("2026-09-24T01:15:00.000Z"),99).bars.length,1);

const normalGuard=api.pvEvaluateGuards({});
assert.deepEqual(normalGuard,{pvGuardState:"NORMAL_MARKET",pvGuardFlags:["NORMAL_MARKET"],pvInterpretability:"VALID"});

// T3: same-slot RVOL is independent of the existing local previous-five ratio.
const divergent=api.pvComputeResponse({open:100,high:103,low:99,close:102,volume:200,trueRange:4,cumulativeVolume:200,bodyShare:0.5,closePosition:0.75,upperShadowRatio:0.25,lowerShadowRatio:0.25},
  {slotVolumeMedian20:100,slotRangeMedian20:4,cumulativeVolumeMedian20:100},normalGuard);
assert.equal(divergent.pvSlotRvol20,2);
assert.equal(divergent.pvCumvolPace20,2);
assert.equal(divergent.formalLocalVolumeRatio,undefined);

// T4/T5: frozen response-state oracle fixtures.
const highEffort=api.pvComputeResponse({open:100,high:106,low:94,close:101,volume:300,trueRange:12,cumulativeVolume:300,bodyShare:1/12,closePosition:7/12,upperShadowRatio:5/12,lowerShadowRatio:6/12},
  {slotVolumeMedian20:100,slotRangeMedian20:10,cumulativeVolumeMedian20:100},normalGuard);
assert.equal(highEffort.participationBand,"EXTREME");
assert.equal(highEffort.pvResponseState,"HIGH_EFFORT_LOW_PROGRESS");
const efficientUp=api.pvComputeResponse({open:100,high:111,low:99,close:109,volume:180,trueRange:12,cumulativeVolume:180,bodyShare:9/12,closePosition:10/12,upperShadowRatio:2/12,lowerShadowRatio:1/12},
  {slotVolumeMedian20:100,slotRangeMedian20:10,cumulativeVolumeMedian20:100},normalGuard);
assert.equal(efficientUp.pvResponseState,"EFFICIENT_UP");
const lowEffort=api.pvComputeResponse({open:100,high:102,low:99,close:100.5,volume:60,trueRange:3,cumulativeVolume:60,bodyShare:0.5/3,closePosition:1.5/3,upperShadowRatio:1.5/3,lowerShadowRatio:1/3},
  {slotVolumeMedian20:100,slotRangeMedian20:10,cumulativeVolumeMedian20:100},normalGuard);
assert.equal(lowEffort.pvResponseState,"LOW_EFFORT_LOW_PROGRESS");

// T6: Taiwan price-limit/auction contexts guard, but do not create a trade veto.
const censoredGuard=api.pvEvaluateGuards({priceCensored:true,auctionMixed:true,gapDominated:true});
assert.equal(censoredGuard.pvGuardState,"PRICE_CENSORED");
assert.equal(censoredGuard.pvInterpretability,"GUARDED");
const guardedResponse=api.pvComputeResponse({open:100,high:111,low:99,close:109,volume:180,trueRange:12,cumulativeVolume:180,bodyShare:9/12,closePosition:10/12,upperShadowRatio:2/12,lowerShadowRatio:1/12},
  {slotVolumeMedian20:100,slotRangeMedian20:10,cumulativeVolumeMedian20:100},censoredGuard);
assert.equal(guardedResponse.pvResponseState,"GUARDED_RESPONSE");
assert.equal(guardedResponse.pvResponseDiagnosticSubstate,"EFFICIENT_UP");

const bPlan={breakout:100,buyLow:99.5,buyHigh:101,stop:96};
const bBar=(slot,values)=>({time:iso("2026-09-24",slot),slotKey:slot,open:99,high:100,low:99,close:99.8,volume:100,trueRange:1,cumulativeVolume:100,bodyShare:0.8,closePosition:0.8,upperShadowRatio:0.1,lowerShadowRatio:0.1,bullish:true,bearish:false,localVolumeRatio:1,...values});

// T7/T8: B lifecycle and immutable prior transition timestamps.
let b=api.pvAdvanceAcceptance({symbol:"2330",marketDate:"2026-09-24",channel:"B",bar:bBar("10:00",{high:100.2,close:99.9}),previousBar:null,plan:bPlan,previous:null,observedAt:iso("2026-09-24","10:00")});
assert.equal(b.state,"B_BREAKOUT_ATTEMPT");
b=api.pvAdvanceAcceptance({symbol:"2330",marketDate:"2026-09-24",channel:"B",bar:bBar("10:15",{open:100,high:102,low:99.8,close:101.5,localVolumeRatio:1.5,closePosition:0.8,upperShadowRatio:0.1}),previousBar:null,plan:bPlan,previous:b,observedAt:iso("2026-09-24","10:15")});
assert.equal(b.state,"B_INITIAL_ACCEPTANCE");
const initialTimestamp=b.stateHistory.at(-1).enteredAt;
b=api.pvAdvanceAcceptance({symbol:"2330",marketDate:"2026-09-24",channel:"B",bar:bBar("10:30",{open:101,high:102,low:100.2,close:100.4}),previousBar:null,plan:bPlan,previous:b,observedAt:iso("2026-09-24","10:30")});
assert.equal(b.state,"B_RETEST");
b=api.pvAdvanceAcceptance({symbol:"2330",marketDate:"2026-09-24",channel:"B",bar:bBar("10:45",{open:100.4,high:102.2,low:100.3,close:101.8,bullish:true}),previousBar:bBar("10:30",{close:100.4,high:102}),plan:bPlan,previous:b,observedAt:iso("2026-09-24","10:45")});
assert.equal(b.state,"B_REACCELERATION");
assert.equal(b.stateHistory.find(x=>x.state==="B_INITIAL_ACCEPTANCE").enteredAt,initialTimestamp);
const bFailed=api.pvAdvanceAcceptance({symbol:"2330",marketDate:"2026-09-24",channel:"B",bar:bBar("10:30",{close:99.4,low:99.2,bullish:false,bearish:true}),previousBar:null,plan:bPlan,previous:{...b,state:"B_INITIAL_ACCEPTANCE"},observedAt:iso("2026-09-24","10:30")});
assert.equal(bFailed.state,"B_FAILED_REENTRY");

// T9: A lifecycle uses existing pullback geometry only.
const aPlan={buyLow:95,buyHigh:98,stop:93};
let a=api.pvAdvanceAcceptance({symbol:"1301",marketDate:"2026-09-24",channel:"A",bar:bBar("10:00",{open:97,high:98,low:95.5,close:96.5,localVolumeRatio:1,closePosition:0.4,bullish:false}),previousBar:null,plan:aPlan,previous:null,observedAt:iso("2026-09-24","10:00")});
assert.equal(a.state,"A_PULLBACK_TEST");
const aAcceptedBar=bBar("10:15",{open:96,high:97.5,low:95.5,close:97.2,localVolumeRatio:0.8,closePosition:0.85,lowerShadowRatio:0.2,bodyShare:0.6,bullish:true});
a=api.pvAdvanceAcceptance({symbol:"1301",marketDate:"2026-09-24",channel:"A",bar:aAcceptedBar,previousBar:null,plan:aPlan,previous:a,observedAt:iso("2026-09-24","10:15")});
assert.equal(a.state,"A_INITIAL_ACCEPTANCE");
a=api.pvAdvanceAcceptance({symbol:"1301",marketDate:"2026-09-24",channel:"A",bar:bBar("10:30",{open:97.2,high:99,low:96,close:98.8,bullish:true}),previousBar:aAcceptedBar,plan:aPlan,previous:a,observedAt:iso("2026-09-24","10:30")});
assert.equal(a.state,"A_REACCELERATION");

// T10/T11/T12: persistence reignition, normalization and missing-observation pause.
let p=null;
for(const [index,value] of [1.4,1.6,1.2,1.5].entries()) p=api.pvAdvancePersistence(p,value,{scope:"INTRADAY_15M",symbol:"2330",observedAt:`t${index}`});
assert.equal(p.state,"REIGNITED");
const eventKey=p.eventKey;
assert.equal(p.eventKey,eventKey);
p=null;for(const [index,value] of [1.4,1.5,1.2,1.1].entries()) p=api.pvAdvancePersistence(p,value,{scope:"INTRADAY_15M",symbol:"2330",observedAt:`n${index}`});
assert.equal(p.state,"NORMALIZED");
let paused=api.pvAdvancePersistence(null,1.4,{scope:"INTRADAY_15M",symbol:"2330",observedAt:"m0"});
paused=api.pvAdvancePersistence(paused,null,{scope:"INTRADAY_15M",symbol:"2330",observedAt:"m1",comparable:false});
assert.equal(paused.state,"FRESH_SHOCK");assert.equal(paused.paused,true);
paused=api.pvAdvancePersistence(paused,1.2,{scope:"INTRADAY_15M",symbol:"2330",observedAt:"m2"});
assert.equal(paused.state,"DECAYING");

// T13: corporate-action reset excludes pre-reset sessions and requires 20 post-reset sessions.
const resetStats=api.pvBaselineStats({sessions:priorSessions,corporateActionResetAt:"2026-08-06"},"2026-09-01","09:00");
assert.equal(resetStats.slotHistoryCount,15);
assert.equal(resetStats.slotVolumeMedian20,null);

// T14: daily shares never enter the intraday ratio calculation.
const unitSafe=api.pvComputeResponse({open:100,high:102,low:99,close:101,volume:1000,dailyVolumeShares:1_000_000,trueRange:3,cumulativeVolume:1000,bodyShare:1/3,closePosition:2/3,upperShadowRatio:1/3,lowerShadowRatio:1/3},
  {slotVolumeMedian20:500,slotRangeMedian20:3,cumulativeVolumeMedian20:500},normalGuard);
assert.equal(unitSafe.pvSlotRvol20,2);
assert.equal("dailyToIntradayRatio" in unitSafe,false);

// T15: adding PV sidecar fields leaves the canonical Formal fingerprint payload identical.
const formalResult={ok:true,symbol:"2330",displayRank:1,plan:{channel:"B",mode:"MOMENTUM",sourceRank:1,buyLow:99.5,buyHigh:101,breakout:100,maxChase:105,stop:96,profitCheck:110,positionStage:"NONE",totalAllocation:70000,firstAmount:42000,secondAmount:28000},
  finalDecision:{level:"wait",text:"等待"},pullback:{level:"wait"},momentum10:{level:"wait"},momentum15:{level:"wait"},stop:{level:"ok"},profit:{level:"ok"},currentPrice:99,frame15:{latest:null},executionData:{formal15Fresh:true}};
const formalWithPv=structuredClone(formalResult);formalWithPv.pvShadow={schemaVersion:"PV_SHADOW_V0_1",decisionImpact:false,session15:{bars:[]}};
assert.equal(api.pvCanonicalJson(api.pvFormalFingerprintPayload(formalResult)),api.pvCanonicalJson(api.pvFormalFingerprintPayload(formalWithPv)));

// T16: the stable logical key plus immutable-write decision yields one row per bar.
const snapshotId=api.pvSnapshotIdentity("2330",iso("2026-09-24","10:00"),"INTRADAY_15M");
assert.equal(snapshotId,api.pvSnapshotIdentity("2330",iso("2026-09-24","10:00"),"INTRADAY_15M"));
assert.equal(api.pvDecideImmutableWrite("abc","abc"),"DUPLICATE");
assert.equal(api.pvDecideImmutableWrite("abc","def"),"MUTATION_CONFLICT");

// T17: snapshot/outcome fingerprints are deterministic and semantic changes conflict.
const snapshot={snapshotId,schemaVersion:"PV_SHADOW_V0_1",symbol:"2330",marketDate:"2026-09-24",observedAt:iso("2026-09-24","10:00"),observationType:"INTRADAY_15M",eventKey:"e1",features:{pvSlotRvol20:1.5},context:{anchorEligible:true},coverage:{slotHistoryCount:20},source:{slotKey:"10:00"},decisionImpact:false};
assert.equal(await api.pvSnapshotFingerprint(snapshot),await api.pvSnapshotFingerprint(structuredClone(snapshot)));
const outcome={horizon:"B1",outcomeComplete:1,directionReturn:0.01,mfe:0.02,mae:-0.01,rangeAtr:null,stopFirst:0,falseBreak:0,acceptanceResult:"B_FOLLOW_THROUGH_B1"};
assert.equal(await api.pvOutcomeFingerprint(snapshotId,outcome),await api.pvOutcomeFingerprint(snapshotId,structuredClone(outcome)));
assert.notEqual(await api.pvOutcomeFingerprint(snapshotId,outcome),await api.pvOutcomeFingerprint(snapshotId,{...outcome,mae:-0.02}));

// Exercise the insert path itself: duplicate retries do not add rows and semantic mutation is rejected.
const snapshotRows=new Map(),outcomeRows=new Map();
const statement=sql=>({bind(...args){return {
  async first(){
    if(sql.includes("FROM v7_pv_shadow_snapshots WHERE snapshot_id")) return snapshotRows.get(args[0])||null;
    if(sql.includes("FROM v7_pv_outcomes WHERE snapshot_id")) return outcomeRows.get(`${args[0]}|${args[1]}`)||null;
    return null;
  },
  async run(){
    if(sql.includes("INSERT INTO v7_pv_shadow_snapshots")) snapshotRows.set(args[0],{source_json:args[10]});
    if(sql.includes("INSERT INTO v7_pv_outcomes")) outcomeRows.set(`${args[0]}|${args[1]}`,{outcome_json:args[11],outcome_complete:args[10]});
    return {success:true};
  }
};},async run(){return {success:true};}});
const mockEnv={V7_DB:{prepare:statement,withSession(){return {prepare:statement};}}};
assert.equal((await api.pvInsertSnapshotImmutable(mockEnv,snapshot)).stored,true);
assert.equal((await api.pvInsertSnapshotImmutable(mockEnv,structuredClone(snapshot))).duplicate,true);
assert.equal((await api.pvInsertSnapshotImmutable(mockEnv,{...snapshot,features:{pvSlotRvol20:9}})).mutationConflict,true);
assert.equal(snapshotRows.size,1);
assert.equal((await api.pvInsertOutcomeImmutable(mockEnv,snapshotId,outcome)).stored,true);
assert.equal((await api.pvInsertOutcomeImmutable(mockEnv,snapshotId,structuredClone(outcome))).duplicate,true);
assert.equal((await api.pvInsertOutcomeImmutable(mockEnv,snapshotId,{...outcome,mae:-0.02})).mutationConflict,true);
assert.equal(outcomeRows.size,1);

// T18: same-session horizons never consume an overnight bar.
const anchorTime=iso("2026-09-24","13:00");
const outcomeSnapshot={context:{anchorBarStart:anchorTime,anchorClose:100,anchorHigh:101,anchorChannel:"B",frozenPlanLevels:{breakout:100,buyLow:99.5}}};
const bars=[{time:anchorTime,open:100,high:101,low:99.8,close:100.5},{time:iso("2026-09-25","09:00"),open:103,high:104,low:102,close:104}];
const incomplete=api.pvBuildSameSessionOutcome(outcomeSnapshot,bars,"B1",true);
assert.equal(incomplete.acceptanceResult,"INCOMPLETE_SESSION_END");
assert.equal(incomplete.directionReturn,null);

// Daily RVOL uses prior daily shares only, with no neutral substitution.
const dailyHistory=[];for(let day=1;day<=21;day+=1)dailyHistory.push({date:`2026-08-${String(day).padStart(2,"0")}`,open:100,high:102,low:99,close:101,volumeShares:1000+day});
dailyHistory.push({date:"2026-09-01",open:101,high:103,low:100,close:102,volumeShares:2021});
const daily=api.pvBuildDailyFeature(dailyHistory,"2026-09-01");
assert.equal(daily.dailyHistoryCount,20);assert.equal(daily.pvDailyRvol20,2021/1011.5);

// Overnight outcomes are separate and require the exact next official trading date.
const dailyAnchor={marketDate:"2026-09-24",context:{anchorClose:100,anchorChannel:"B",frozenPlanLevels:{breakout:100,buyLow:99.5}}};
const nextSessionHistory=[{date:"2026-09-29",open:102,high:105,low:99,close:104}];
const nextOpen=api.pvBuildDailyOutcome(dailyAnchor,nextSessionHistory,"NEXT_OPEN");
assert.ok(Math.abs(nextOpen.directionReturn-0.02)<1e-12);assert.equal(nextOpen.mfe,null);
const nextSession=api.pvBuildDailyOutcome(dailyAnchor,nextSessionHistory,"NEXT_SESSION");
assert.ok(Math.abs(nextSession.directionReturn-0.04)<1e-12);assert.ok(Math.abs(nextSession.mfe-0.05)<1e-12);assert.ok(Math.abs(nextSession.mae+0.01)<1e-12);
assert.equal(api.pvBuildDailyOutcome(dailyAnchor,[{date:"2026-09-30",open:102,high:105,low:99,close:104}],"NEXT_SESSION"),null,"missing exact next trading session must not be skipped");

assert.ok(source.lastIndexOf("recordPvIntradayShadowSafe(env,results")>source.indexOf("await writeLiveSnapshot(env, snapshot)"),"PV monitor hook must remain after Formal live-state persistence");
assert.ok(source.lastIndexOf("recordPvIntradayShadowSafe(env,results")>source.indexOf("processSignalState(result"),"PV monitor hook must remain after Formal signal processing");
assert.ok(source.lastIndexOf("bootstrapPvShadowBaselinesSafe(env,stocks,marketDate)")>source.indexOf("await env.STOCKS_KV.put(reportKey, JSON.stringify(report)"),"PV after-market hook must remain after Formal daily push persistence");
assert.match(source,/barStart:bar\.time,barEnd:new Date\(Date\.parse\(bar\.time\)\+15\*60000\)\.toISOString\(\)/);

console.log("PV_SHADOW_V0_1 Class-A LOG_ONLY tests passed");
