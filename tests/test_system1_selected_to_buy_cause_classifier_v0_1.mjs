import assert from "node:assert/strict";
import {
  classifySelectedToBuyMonitorRun,
  buildSelectedToBuySessionCauseReceipt
} from "../research/system1_selected_to_buy_cause_classifier_v0_1.mjs";

const sessionDate="2026-10-07",generationId="C1:2026-10-07:g1";
const plan={
  symbol:"2330",planIdentity:"PLAN:2330:2026-10-07",generationId,
  positionStage:"NONE",mode:"MOMENTUM",planDate:sessionDate,maxChase:105
};
const baseRun=(runId,overrides={})=>({
  runId,sessionDate,generationId,symbol:plan.symbol,planIdentity:plan.planIdentity,
  observedAt:sessionDate+"T"+(runId==="r1"?"10:31":"10:46")+":00+08:00",
  completed:true,planPresent:true,
  result:{
    ok:true,currentPrice:104,
    executionData:{quoteFresh:true,formal15Fresh:true,auxiliary10Fresh:true},
    quote:{isTrial:false},stop:{level:"ok"},
    frame15:{latest:{close:104}},
    momentum15:{level:"watch",text:"15分KB突破已確認，等待回測突破位，不直接追"},
    finalDecision:{level:"wait",text:"等待"}
  },
  ...overrides
});
const r1=baseRun("r1",{result:{
  ok:true,currentPrice:106,
  executionData:{quoteFresh:true,formal15Fresh:true,auxiliary10Fresh:true},
  quote:{isTrial:false},stop:{level:"ok"},
  frame15:{latest:{close:106}},
  momentum15:{level:"wait",text:"15分K已離突破位過遠，不追；等待回測承接區"},
  finalDecision:{level:"wait",text:"等待"}
}});
const r2=baseRun("r2",{result:{
  ok:true,currentPrice:106,
  executionData:{quoteFresh:true,formal15Fresh:true,auxiliary10Fresh:true},
  quote:{isTrial:false},stop:{level:"ok"},
  frame15:{latest:{close:104}},
  momentum15:{level:"buy",text:"15分KB突破後承接成立：已有效突破＋回測守住＋量縮/不爆量＋轉強"},
  finalDecision:{level:"buy",text:"B突破後承接：15分K回測確認成立，可第一筆"}
}});

const a=classifySelectedToBuyMonitorRun(r1,plan);
assert.equal(a.cause,"MAX_CHASE_15M_BLOCK_B");
assert.equal(a.observed.latest15Close,106);
const b=classifySelectedToBuyMonitorRun(r2,plan);
assert.equal(b.cause,"MAX_CHASE_QUOTE_BLOCK");
assert.equal(b.observed.currentPrice,106);

const complete=buildSelectedToBuySessionCauseReceipt({
  sessionDate,generationId,plan,expectedRunIds:["r1","r2"],
  monitorRuns:[r2,r1],signalRows:[],signalCoverageComplete:true
});
assert.equal(complete.monitorCoverageComplete,true);
assert.equal(complete.noBuyCoverageComplete,true);
assert.equal(complete.sessionState,"NO_BUY_COMPLETE");
assert.deepEqual(complete.causeSet,["MAX_CHASE_15M_BLOCK_B","MAX_CHASE_QUOTE_BLOCK"]);
assert.equal(complete.maxChase.uniqueSymbolN,1);
assert.equal(complete.maxChase.causeMembershipN,2);
assert.equal(complete.maxChase.eventN,2);
assert.equal(complete.bridgeCauseRow.cause,"MAX_CHASE_15M_BLOCK_B");
assert.deepEqual(complete.bridgeCauseRow.secondaryCauses,["MAX_CHASE_QUOTE_BLOCK"]);
assert.equal(complete.bridgeCauseRow.coverageComplete,true);

const reordered=buildSelectedToBuySessionCauseReceipt({
  sessionDate,generationId,plan,expectedRunIds:["r1","r2"],
  monitorRuns:[r1,r2],signalRows:[],signalCoverageComplete:true
});
assert.equal(reordered.fingerprint,complete.fingerprint);

const missing=buildSelectedToBuySessionCauseReceipt({
  sessionDate,generationId,plan,expectedRunIds:["r1","r2","r3"],
  monitorRuns:[r1,r2],signalRows:[],signalCoverageComplete:true
});
assert.equal(missing.monitorCoverageComplete,false);
assert.equal(missing.noBuyCoverageComplete,false);
assert.equal(missing.sessionState,"NO_BUY_UNKNOWN_COVERAGE");
assert.deepEqual(missing.missingRunIds,["r3"]);
assert.equal(missing.bridgeCauseRow.coverageComplete,false);

const noSignalProof=buildSelectedToBuySessionCauseReceipt({
  sessionDate,generationId,plan,expectedRunIds:["r1","r2"],
  monitorRuns:[r1,r2],signalRows:[],signalCoverageComplete:false
});
assert.equal(noSignalProof.sessionState,"NO_BUY_UNKNOWN_COVERAGE");
assert.equal(noSignalProof.noBuyCoverageComplete,false);

const buy=buildSelectedToBuySessionCauseReceipt({
  sessionDate,generationId,plan,expectedRunIds:["r1","r2","r3"],
  monitorRuns:[r1,r2],signalRows:[{
    sessionDate,generationId,symbol:plan.symbol,planIdentity:plan.planIdentity,
    occurredAt:sessionDate+"T11:01:00+08:00",signalType:"BUY"
  }],signalCoverageComplete:false
});
assert.equal(buy.buyObserved,true);
assert.equal(buy.sessionState,"BUY_SIGNAL_OBSERVED_NO_FILL_EVIDENCE");
assert.equal(buy.evidenceRules.positiveBuyDoesNotRequireNegativeCoverage,true);

const stale=baseRun("r1",{result:{
  ...baseRun("r1").result,
  executionData:{quoteFresh:true,formal15Fresh:false,auxiliary10Fresh:true}
}});
assert.equal(classifySelectedToBuyMonitorRun(stale,plan).cause,"SOURCE_FRESHNESS_BLOCK");

const oldPlan={...plan,planDate:"2026-10-06"};
assert.equal(classifySelectedToBuyMonitorRun(r1,oldPlan).cause,"PLAN_VALIDITY_BLOCK");

const trial=baseRun("r1",{result:{
  ...baseRun("r1").result,quote:{isTrial:true},finalDecision:{level:"watch",text:"試撮行情不產生正式買進或加碼指令"}
}});
assert.equal(classifySelectedToBuyMonitorRun(trial,plan).cause,"TRIAL_QUOTE_BLOCK");

const stopped=baseRun("r1",{result:{...baseRun("r1").result,stop:{level:"risk"}}});
assert.equal(classifySelectedToBuyMonitorRun(stopped,plan).cause,"STOP_PLAN_INVALIDATED");

const noRetest=baseRun("r1");
assert.equal(classifySelectedToBuyMonitorRun(noRetest,plan).cause,"B_VALID_BREAKOUT_NO_RETEST");

const noBreakout=baseRun("r1",{result:{
  ...baseRun("r1").result,
  momentum15:{level:"watch",text:"15分K已站上突破價，但尚未完成量價確認"}
}});
assert.equal(classifySelectedToBuyMonitorRun(noBreakout,plan).cause,"B_NO_VALID_BREAKOUT");

const retestNoTurn=baseRun("r1",{result:{
  ...baseRun("r1").result,
  momentum15:{level:"watch",text:"15分K已回測承接區並守住，等待完整K轉強確認"}
}});
assert.equal(classifySelectedToBuyMonitorRun(retestNoTurn,plan).cause,"B_RETEST_FAILED_OR_NO_REACCELERATION");

const pullPlan={...plan,mode:"PULLBACK"};
const pullWait=baseRun("r1",{result:{
  ...baseRun("r1").result,
  pullback:{level:"wait",text:"A等待拉回至承接區，不追價"},
  momentum15:{level:"wait",text:"此股設定為拉回承接型"}
}});
assert.equal(classifySelectedToBuyMonitorRun(pullWait,pullPlan).cause,"A_NEVER_REACHED_ZONE");

assert.throws(()=>buildSelectedToBuySessionCauseReceipt({
  sessionDate,generationId,plan,expectedRunIds:["r1","r1"],monitorRuns:[],signalRows:[]
}),/EXPECTED_RUN_IDS_INVALID/);

assert.throws(()=>buildSelectedToBuySessionCauseReceipt({
  sessionDate,generationId,plan:{...plan,generationId:"wrong"},expectedRunIds:["r1"],monitorRuns:[r1],signalRows:[]
}),/SESSION_IDENTITY_REQUIRED/);

console.log(JSON.stringify({
  ok:true,assertions:34,maxChaseLayersSeparated:true,maxChaseUniqueSymbolN:1,
  noBuyRequiresMonitorAndSignalCoverage:true,positiveBuyEvidenceIndependent:true,
  exactPlanDateGuard:true,trialGuard:true,stopInvalidation:true,
  bNoRetestSeparated:true,deterministicFingerprint:true,
  economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE",formalCoreImpact:false
}));
