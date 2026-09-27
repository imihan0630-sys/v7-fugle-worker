import assert from "node:assert/strict";
import {GATE_STATE,observeFormalGateOverlap,replayOneGateRemoval,replayObservedFailGates,summarizeGateOverlapObservers} from "../research/formal_gate_overlap_observer_v0_1.mjs";

const goodFeature={
  close:100,historyDays:80,marketReturn20:3,sectorReturn20:5,marketCapYi:200,changePercent:1,
  avgVolume20Lots:1500,avgAmount20:80000000,spreadPercent:0.2,orderBookDepthGood:true,depthScore:90,
  chipConcentration:60,quarterRevenue:100,financialBasis:true,revenueQoQ:3,revenueQuarterYoY:20,
  valuationObserved:true,priceBookRatio:2,announcementsVerified:true,officialAnnouncements:[],
  priceEarningsRatio:18,sectorMedianPe:15,epsYoY:10,atrPercent:3
};
const goodSector={breadth:55,avgChange:0.5,amountVs20DayAverage:1.1};
const goodDerived={
  institutionalScore:75,fundamentalCount:6,fundamentalScore:60,
  setupState:{A:{pass:true},B:{pass:false}},
  targetState:"FOUND",target:120,rewardPerRisk:2.5,setupQuality:75
};

{
  const out=observeFormalGateOverlap({feature:goodFeature,sector:goodSector,derived:goodDerived,formalResult:{ok:true,basePassed:true,rrPassed:true}});
  assert.equal(out.counts.FAIL,0);
  assert.equal(out.counts.UNKNOWN,0);
  assert.equal(out.counts.NOT_EVALUABLE,0);
  assert.equal(out.gates.REWARD_RISK.status,GATE_STATE.PASS);
  assert.equal(out.formalResult.ok,true);
}

{
  const feature={...goodFeature}; delete feature.marketCapYi;
  const out=observeFormalGateOverlap({feature,sector:goodSector,derived:goodDerived,formalResult:{ok:false,reason:"缺市值資料"}});
  assert.equal(out.gates.MARKET_CAP_FLOOR.status,GATE_STATE.UNKNOWN);
  assert.notEqual(out.gates.MARKET_CAP_FLOOR.status,GATE_STATE.FAIL);
}

{
  const feature={...goodFeature,avgVolume20Lots:200}; delete feature.spreadPercent; delete feature.orderBookDepthGood; delete feature.depthScore;
  const out=observeFormalGateOverlap({feature,sector:goodSector,derived:goodDerived});
  assert.equal(out.gates.LIQUIDITY.status,GATE_STATE.UNKNOWN);
}

{
  const out=observeFormalGateOverlap({feature:goodFeature,sector:goodSector,derived:{...goodDerived,targetState:"NONE",target:null,rewardPerRisk:null}});
  assert.equal(out.gates.TARGET_AVAILABLE.status,GATE_STATE.FAIL);
  assert.equal(out.gates.REWARD_RISK.status,GATE_STATE.NOT_EVALUABLE);
  assert.equal(out.gates.FINAL_SIGNAL_GRADE.status,GATE_STATE.NOT_EVALUABLE);
}

{
  const out=observeFormalGateOverlap({feature:goodFeature,sector:goodSector,derived:{...goodDerived,fundamentalCount:2,fundamentalScore:null}});
  assert.equal(out.gates.FUNDAMENTAL_COMPONENT_COUNT.status,GATE_STATE.FAIL);
  assert.equal(out.gates.FUNDAMENTAL_QUALITY.status,GATE_STATE.NOT_EVALUABLE);
}

{
  const feature={...goodFeature,announcementsVerified:false}; delete feature.officialAnnouncements;
  const out=observeFormalGateOverlap({feature,sector:goodSector,derived:goodDerived});
  assert.equal(out.gates.FINANCIAL_SOURCE_COMPLETENESS.status,GATE_STATE.UNKNOWN);
  assert.equal(out.gates.ANNOUNCEMENT_RISK.status,GATE_STATE.UNKNOWN);
}

{
  const out=observeFormalGateOverlap({feature:goodFeature,sector:{...goodSector,breadth:35},derived:goodDerived});
  assert.equal(out.gates.SECTOR_GATE.status,GATE_STATE.FAIL);
}

{
  const out=observeFormalGateOverlap({feature:goodFeature,sector:goodSector,derived:{...goodDerived,setupQuality:60},formalResult:{ok:false,reason:"策略品質低於B級，不列入推薦",basePassed:true,rrPassed:true}});
  assert.equal(out.gates.FINAL_SIGNAL_GRADE.status,GATE_STATE.FAIL);
  assert.equal(out.formalResult.firstFailure,"策略品質低於B級，不列入推薦");
  assert.equal(out.formalResult.rrPassed,true);
}

{
  const out=observeFormalGateOverlap({feature:{},sector:{},derived:{},formalResult:{ok:false,reason:"unknown"}});
  assert.equal(out.counts.FAIL,0,"missing evidence must not be converted into FAIL");
  assert.ok(out.counts.UNKNOWN>0);
}

console.log(JSON.stringify({
  ok:true,
  fourStateSemantics:true,
  missingNeverBecomesFail:true,
  conditionalNotEvaluable:true,
  originalFormalResultPreserved:true,
  marketCalls:0,
  formalCoreImpact:false
}));


// one-gate removal exposes next failure rather than assuming acceptance.
{
  const out=observeFormalGateOverlap({
    feature:{...goodFeature,avgVolume20Lots:200,avgAmount20:10000000,spreadPercent:1,orderBookDepthGood:false,marketCapYi:200},
    sector:{...goodSector,breadth:35},
    derived:goodDerived,
    formalResult:{ok:false,reason:"20日流動性不足",basePassed:false,rrPassed:false}
  });
  assert.equal(out.gates.LIQUIDITY.status,GATE_STATE.FAIL);
  assert.equal(out.gates.SECTOR_GATE.status,GATE_STATE.FAIL);
  const replay=replayOneGateRemoval(out,"LIQUIDITY");
  assert.equal(replay.result,"NEXT_FAILURE","one-gate removal must expose later observed failure, not acceptance");
  assert.equal(replay.nextFailureGateId,"SECTOR_GATE");
  assert.equal(replay.acceptedDelta,0);
}

// unresolved evidence before a later known fail blocks exact next-failure attribution.
{
  const feature={...goodFeature,avgVolume20Lots:200}; delete feature.spreadPercent; delete feature.orderBookDepthGood; delete feature.depthScore;
  const out=observeFormalGateOverlap({
    feature,sector:{...goodSector,breadth:35},derived:goodDerived,
    formalResult:{ok:false,reason:"20日流動性不足",basePassed:false,rrPassed:false}
  });
  assert.equal(out.gates.LIQUIDITY.status,GATE_STATE.UNKNOWN);
  const replay=replayOneGateRemoval(out,"PRICE_FLOOR");
  assert.equal(replay.result,"COUNTERFACTUAL_UNRESOLVED");
  assert.equal(replay.blockerGateId,"LIQUIDITY");
  assert.equal(replay.laterKnownFailGateId,"SECTOR_GATE");
  assert.equal(replay.acceptedDelta,null);
}

// removing setup failure cannot pretend target/RR exist.
{
  const out=observeFormalGateOverlap({
    feature:goodFeature,sector:goodSector,
    derived:{...goodDerived,setupState:{A:{pass:false},B:{pass:false}},targetState:"UNKNOWN",rewardPerRisk:null,setupQuality:null},
    formalResult:{ok:false,reason:"A拉回承接/B突破後承接皆未形成候選",basePassed:true,rrPassed:false}
  });
  assert.equal(out.gates.AB_SETUP.status,GATE_STATE.FAIL);
  assert.equal(out.gates.TARGET_AVAILABLE.status,GATE_STATE.NOT_EVALUABLE);
  const replay=replayOneGateRemoval(out,"AB_SETUP");
  assert.equal(replay.result,"COUNTERFACTUAL_UNRESOLVED");
  assert.equal(replay.blockerGateId,"TARGET_AVAILABLE");
}

// only all-other-observed PASS can yield replay acceptance.
{
  const out=observeFormalGateOverlap({
    feature:{...goodFeature,atrPercent:0.5},
    sector:goodSector,derived:goodDerived,
    formalResult:{ok:false,reason:"波動品質不合格",basePassed:true,rrPassed:false}
  });
  assert.equal(out.gates.ATR_QUALITY.status,GATE_STATE.FAIL);
  const replay=replayOneGateRemoval(out,"ATR_QUALITY");
  assert.equal(replay.result,"REPLAY_ACCEPTED");
  assert.equal(replay.acceptedDelta,1);
  assert.equal(replay.formalCoreImpact,false);
}

// overlap summary is intentionally non-additive.
{
  const a=observeFormalGateOverlap({feature:{...goodFeature,atrPercent:0.5},sector:{...goodSector,breadth:35},derived:goodDerived});
  const b=observeFormalGateOverlap({feature:goodFeature,sector:{...goodSector,breadth:35},derived:goodDerived});
  const summary=summarizeGateOverlapObservers([a,b]);
  assert.equal(summary.rows,2);
  assert.equal(summary.byGate.SECTOR_GATE.FAIL,2);
  assert.equal(summary.byGate.ATR_QUALITY.FAIL,1);
  assert.match(summary.rule,/not additive/);
  const replays=replayObservedFailGates(a);
  assert.equal(replays.replayCount,2);
}
