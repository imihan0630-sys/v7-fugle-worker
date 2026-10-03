import assert from "node:assert/strict";
import {auditC3LiveInputs,buildC4DailyComparison,buildC5DailyReport,evaluateFormalSwitchMaturity,FORMAL_SWITCH_MATURITY_V0_1} from "../research/system1_evidence_automation_v0_1.mjs";
import {buildC3EntryExperiment} from "../research/system1_c3_c4_c5_shadow_v0_1.mjs";
import {C3_CAPTURE_SLOTS} from "../research/system1_c3_capture_contract_v0_1.mjs";

let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++};const ok=x=>{assert.ok(x);n++};
const decisionAt="2026-10-02T23:35:00+08:00",sessionDate="2026-10-02",generationId="gen-live-1";
const mkPair=(symbol,{formalOk=false,shortStatus="PASS",missingSafety=[],withoutSafety="PASS",channel="A",lateStage=false,depthScore=70,geometry=null}={})=>({
  symbol,pool:"GENERAL",
  selectionContext:{
    close:99,depthScore,spreadPercent:.2,orderBookDepthGood:true,lateStage,ret20:10,maDistance20Pct:5,channel,
    entryGeometry:geometry||{entry:101,stop:95,target:118,support:channel==="A"?100:null,breakout:channel==="B"?100:null},
    provenance:{authenticated:true,parentId:generationId,sessionDate,knownAt:decisionAt}
  },
  formal:{qualified:formalOk,selected:formalOk,firstFailure:formalOk?null:"AB_SETUP"},
  short:{gateStatus:shortStatus,missingSafety,withoutSafetyGateStatus:withoutSafety},
  swing:{gateStatus:"UNKNOWN",missingSafety:["FUNDAMENTAL_QUALITY"]}
});
const pairs=[
  mkPair("AAA",{channel:"A",geometry:{entry:101,stop:95,target:118,support:100,breakout:null}}),
  mkPair("BBB",{channel:"B",geometry:{entry:101,stop:94,target:118,support:null,breakout:100}}),
  mkPair("CCC",{shortStatus:"UNKNOWN",missingSafety:["ACCOUNT_RISK"],channel:"A"})
];
const c2={schemaVersion:"SYSTEM1_C2_PAIRED_LEDGER_V0_1",generationId,sessionDate,decisionAt,
  fingerprint:"f".repeat(64),completeMatchedCohort:true,researchOnly:true,formalCoreLocked:true,
  pairs,tally:{populationN:pairs.length,formalRejectedButConditionalShortGatesPassN:1}};

function isoForSlot(slot){
  const [h,m]=slot.split(":").map(Number);
  const utcH=(h+24-8)%24;
  return `2026-10-05T${String(utcH).padStart(2,"0")}:${String(m).padStart(2,"0")}:00.000Z`;
}
function capture(symbol,slot,i){
  const start=isoForSlot(slot),end=new Date(Date.parse(start)+15*60000).toISOString();
  const open=100+i*0.1;
  return {generation_id:generationId,target_trade_date:"2026-10-05",symbol,bar_start:start,bar_end:end,completed_bar:1,
    bar_json:JSON.stringify({time:start,open,high:open+2,low:open-1,close:open+1,volume:1000+i,volumeRatio:1.3})};
}
const captureRows=[
  ...C3_CAPTURE_SLOTS.map((slot,i)=>capture("AAA",slot,i)),
  ...C3_CAPTURE_SLOTS.map((slot,i)=>capture("BBB",slot,i))
];
const geometryReceipts=[];
const priorCloseReceipts=[];
const formalBaselineReceipts=[
  {symbol:"AAA",verified:true,parentId:generationId,sessionDate,knownAt:"2026-10-05T13:31:00+08:00",status:"NO_TRIGGER"},
  {symbol:"BBB",verified:true,parentId:generationId,sessionDate,knownAt:"2026-10-05T13:31:00+08:00",status:"NO_TRIGGER"}
];
const statesAAA=C3_CAPTURE_SLOTS.map(slot=>{
  const barStart=isoForSlot(slot);
  return {symbol:"AAA",barStart,verified:true,limitUp:false,marketState:"CONTINUOUS"};
});
const statesBBB=C3_CAPTURE_SLOTS.slice(0,-1).map(slot=>{
  const barStart=isoForSlot(slot);
  return {symbol:"BBB",barStart,verified:true,limitUp:false,marketState:"CONTINUOUS"};
});

const audit=auditC3LiveInputs(c2,{captureRows,geometryReceipts,formalBaselineReceipts,priorCloseReceipts,barStateReceipts:[...statesAAA,...statesBBB]});
eq(audit.schemaVersion,"SYSTEM1_C3_LIVE_INPUT_AUDIT_V0_3");
eq(audit.eligibleN,2);
eq(audit.readyN,1);
eq(audit.blockedN,1);
eq(audit.rows.find(x=>x.symbol==="AAA").status,"READY");
eq(audit.rows.find(x=>x.symbol==="BBB").status,"INPUT_BLOCKED");
ok(audit.rows.find(x=>x.symbol==="BBB").blockers.includes("BAR_MICROSTRUCTURE_UNVERIFIED"));
eq(audit.rows.find(x=>x.symbol==="AAA").barCount,17);
eq(audit.rows.find(x=>x.symbol==="AAA").missingSlots,[]);
eq(audit.selectionDepthNeverImputed,true);
eq(audit.selectionLateStageNeverImputed,true);
eq(audit.limitStateNeverImputed,true);
eq(audit.readyReceipts.length,1);
eq(audit.readyReceipts[0].formalBaseline.verified,true);
eq(audit.readyReceipts[0].bars.length,17);
ok(audit.readyReceipts[0].bars.every(x=>typeof x.limitUp==="boolean"&&typeof x.lateStage==="boolean"));
eq(audit.rows.find(x=>x.symbol==="AAA").selectionDepthVerified,true);
eq(audit.rows.find(x=>x.symbol==="AAA").selectionLateStageVerified,true);
ok(audit.readyReceipts[0].bars.every(x=>Number.isFinite(x.gapPct)));

const c2NullDepth={...c2,pairs:c2.pairs.map(x=>x.symbol==="AAA"?{...x,selectionContext:{...x.selectionContext,depthScore:null}}:x)};
const auditNullDepth=auditC3LiveInputs(c2NullDepth,{captureRows,geometryReceipts,formalBaselineReceipts,priorCloseReceipts,barStateReceipts:[...statesAAA,...statesBBB]});
eq(auditNullDepth.rows.find(x=>x.symbol==="AAA").status,"INPUT_BLOCKED");
ok(auditNullDepth.rows.find(x=>x.symbol==="AAA").blockers.includes("SELECTION_DEPTH_UNVERIFIED"));

const auditNoFormalBaseline=auditC3LiveInputs(c2,{captureRows,geometryReceipts,formalBaselineReceipts:[],priorCloseReceipts,barStateReceipts:[...statesAAA,...statesBBB]});
eq(auditNoFormalBaseline.rows.find(x=>x.symbol==="AAA").status,"READY");
eq(auditNoFormalBaseline.readyReceipts[0].formalBaseline.status,"UNKNOWN");
eq(auditNoFormalBaseline.readyReceipts[0].formalBaseline.verified,false);
eq(auditNoFormalBaseline.formalBaselineMissingDoesNotBlockChallenger,true);
eq(auditNoFormalBaseline.formalBaselineUnknownNeverCountedAsNoTrigger,true);
const c3NoBaseline=buildC3EntryExperiment(c2,auditNoFormalBaseline.readyReceipts,{costs:{brokerFeeBpsPerSide:14.25,sellTaxBps:30,slippageBpsPerSide:5}});
eq(c3NoBaseline.tally.formalBaselineUnknownN,1);
eq(c3NoBaseline.tally.formalNoTriggerChallengerSimFillN,0);

const c3=buildC3EntryExperiment(c2,audit.readyReceipts,{costs:{brokerFeeBpsPerSide:14.25,sellTaxBps:30,slippageBpsPerSide:5}});
eq(c3.tally.receiptN,1);
eq(c3.tally.eligiblePairN,2);
eq(c3.tally.missingEntryReceiptN,1);
eq(c3.missingEntryReceiptSymbols,["BBB"]);
assert.throws(()=>buildC3EntryExperiment(c2,[{...audit.readyReceipts[0],bars:audit.readyReceipts[0].bars.map((x,i)=>i===0?{...x,limitUp:null}:x)}],
  {costs:{brokerFeeBpsPerSide:14.25,sellTaxBps:30,slippageBpsPerSide:5}}),/C3_BAR_STATE_REQUIRED/);n++;

const pass={status:"PASS"},fail={status:"FAIL"},unk={status:"UNKNOWN"};
const gates={SOURCE_AUTHENTICITY:pass,SESSION_CONTINUITY:pass,CORPORATE_ACTION_CONTINUITY:pass,EXECUTION_FEASIBILITY:pass,ACCOUNT_RISK:pass,
  PRICE_FLOOR:pass,HISTORY_60D:pass,DAILY_ABNORMALITY:pass,LIQUIDITY:pass,ANNOUNCEMENT_RISK:pass,RS_CONTEXT:pass,ATR_QUALITY:pass,
  SECTOR_GATE:pass,AB_SETUP:pass,VALUATION_RELATIVE_RISK:pass,FUNDAMENTAL_QUALITY:pass,FINANCIAL_SOURCE_COMPLETENESS:pass};
const c1={schemaVersion:"SYSTEM1_C1_ISOLATED_V0_1",sessionDate,populationN:3,observations:[
  {symbol:"AAA",pool:"GENERAL",formalResult:{ok:false},firstFailureReason:"VALUATION_RELATIVE_RISK",gates:{...gates,VALUATION_RELATIVE_RISK:fail}},
  {symbol:"BBB",pool:"GENERAL",formalResult:{ok:false},firstFailureReason:"AB_SETUP",gates:{...gates,AB_SETUP:fail}},
  {symbol:"CCC",pool:"GENERAL",formalResult:{ok:false},firstFailureReason:"ACCOUNT_RISK",gates:{...gates,ACCOUNT_RISK:unk}}
]};
const c5=buildC5DailyReport(c1,c2);
eq(c5.schemaVersion,"SYSTEM1_C5_DAILY_REPORT_V0_2");
eq(c5.denominatorN,3);
eq(c5.short.formalRejectedN,3);
eq(c5.short.p1aRejectedN,0);
eq(c5.short.hardBlockedN,0);
eq(c5.short.p1aRankableN,0);
eq(c5.short.unknownContaminatedN,1);
eq(c5.short.topUnknownGates[0].key,"ACCOUNT_RISK");
eq(c5.short.topUnknownGates[0].count,1);
eq(c5.short.topFailedGates[0].count,1);
eq(c5.firstFailureIsNotCausalAttribution,true);
eq(c5.unknownNeverPasses,true);
eq(c5.p1aRankableIsNotCandidate,true);
eq(c5.formalOptimizationCandidate,"NONE");

const c4=buildC4DailyComparison([
  {symbol:"AAA",priorityScore:90,entry:100,stop:95},
  {symbol:"BBB",priorityScore:60,entry:100,stop:90},
  {symbol:"DDD",priorityScore:30,entry:100,stop:98}
],{totalCapital:200000,gridNTD:1000,perNameCapRatio:0.35});
eq(c4.schemaVersion,"SYSTEM1_C4_DAILY_COMPARISON_V0_1");
eq(c4.selectedCount,3);
eq(c4.comparators.length,3);
eq(c4.preferredAllocator,null);
eq(c4.economicSuperiority,"UNKNOWN");
ok(c4.comparators.every(x=>x.rows.length===3));

const immature=evaluateFormalSwitchMaturity({
  matureD5Rows:59,completeProspectiveSnapshots:29,
  scanDates:Array.from({length:14},(_,i)=>`2026-09-${String(i+1).padStart(2,"0")}`),
  calendarYears:[2025],marketRegimes:["TREND"],dateClusterDirectionAgreementPct:69,
  sourceCoveragePass:true,purgedHoldoutPass:true,multipleTestingPass:true,redundancyPass:true,costStressPass:true,
  afterCostReturnAvailable:true,drawdownTailAvailable:true,mfeMaeAvailable:true,triggerFillFunnelAvailable:true,
  turnoverConcentrationAvailable:true,deploymentReserveAvailable:true,brokerFillsCashComplete:true
});
eq(immature.eligibleForClassCReview,false);
eq(immature.formalOptimizationCandidate,"NO");
ok(immature.blockers.includes("matureD5Rows"));
ok(immature.blockers.includes("calendarYears"));

const mature=evaluateFormalSwitchMaturity({
  matureD5Rows:60,completeProspectiveSnapshots:30,
  scanDates:Array.from({length:15},(_,i)=>`2026-09-${String(i+1).padStart(2,"0")}`),
  calendarYears:[2025,2026],marketRegimes:["TREND","RANGE"],dateClusterDirectionAgreementPct:70,
  sourceCoveragePass:true,purgedHoldoutPass:true,multipleTestingPass:true,redundancyPass:true,costStressPass:true,
  afterCostReturnAvailable:true,drawdownTailAvailable:true,mfeMaeAvailable:true,triggerFillFunnelAvailable:true,
  turnoverConcentrationAvailable:true,deploymentReserveAvailable:true,brokerFillsCashComplete:true
});
eq(mature.eligibleForClassCReview,true);
eq(mature.formalOptimizationCandidate,"EVIDENCE_GATE_PASSED_REVIEW_REQUIRED");
eq(mature.autoSwitchAuthorized,false);
eq(FORMAL_SWITCH_MATURITY_V0_1.matureD5Rows,60);
eq(FORMAL_SWITCH_MATURITY_V0_1.independentScanDates,15);

console.log(JSON.stringify({ok:true,assertions:n,c3LiveAudit:true,c4Daily:true,c5Daily:true,maturityGate:true,
  selectionDepthNeverImputed:true,selectionLateStageNeverImputed:true,missingLimitStateNeverImputed:true,autoFormalSwitch:false,formalCoreImpact:false,system2Touched:false}));
