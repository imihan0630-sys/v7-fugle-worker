import assert from "node:assert/strict";
import {
  SIGNAL_GRADE_A_MIN,SIGNAL_GRADE_B_MIN,
  setupQualityA,setupQualityB,signalGrade,observeSignalGrade,structuralBounds
} from "../research/signal_grade_channel_observer_v0_1.mjs";

{
  const b=setupQualityB({volumeTodayVsPrev5:1.3,dailyClosePosition:0.65,dailyUpperShadowRatio:0.35});
  assert.ok(Math.abs(b-69.65)<1e-10);
  assert.equal(signalGrade(b),"B");
  const o=observeSignalGrade({strategyChannel:"B",channelPass:true,metrics:{
    volumeTodayVsPrev5:1.3,dailyClosePosition:0.65,dailyUpperShadowRatio:0.35
  }});
  assert.equal(o.finalGradeReject,false);
}

{
  const a=setupQualityA({pullbackPct:15,supportDistancePct:4,volumeTodayVsPrev5:2});
  assert.equal(a,38);
  const o=observeSignalGrade({strategyChannel:"A",channelPass:true,metrics:{
    pullbackPct:15,supportDistancePct:4,volumeTodayVsPrev5:2
  }});
  assert.equal(o.signalGrade,"C");
  assert.equal(o.finalGradeReject,true);
}

{
  const best=setupQualityA({pullbackPct:7,supportDistancePct:0,volumeTodayVsPrev5:0.91});
  assert.equal(best,74);
  assert.ok(best<SIGNAL_GRADE_A_MIN);
}

{
  const best=setupQualityA({pullbackPct:7,supportDistancePct:0,volumeTodayVsPrev5:0.9});
  assert.equal(best,82);
  assert.equal(signalGrade(best),"A");
}

{
  const q=setupQualityA({pullbackPct:7.5,supportDistancePct:0.5,volumeTodayVsPrev5:0.9});
  assert.equal(q,79);
  assert.equal(signalGrade(q),"B");
}

{
  assert.equal(signalGrade(80),"A");
  assert.equal(signalGrade(65),"B");
  assert.equal(signalGrade(64.999),"C");
  assert.equal(SIGNAL_GRADE_A_MIN,80);
  assert.equal(SIGNAL_GRADE_B_MIN,65);
}

{
  const b=observeSignalGrade({strategyChannel:"B",channelPass:false,metrics:{
    volumeTodayVsPrev5:1.3,dailyClosePosition:0.65,dailyUpperShadowRatio:0.35
  }});
  assert.equal(b.finalGradeReject,false);
  assert.equal(b.channelPass,false);
}

{
  const unknown=observeSignalGrade({strategyChannel:"A",metrics:{pullbackPct:7}});
  assert.equal(unknown.status,"UNKNOWN");
  assert.equal(unknown.reason,"SETUP_INPUT_MISSING");
}

{
  const b=structuralBounds();
  assert.ok(Math.abs(b.bPassBoundaryMin-69.65)<1e-10);
  assert.equal(b.bFinalGradeCReachable,false);
  assert.equal(b.aPassCompatibleLowWitness,38);
  assert.equal(b.aFinalGradeCReachable,true);
  assert.equal(b.aBestWhenVolumeGt0_9,74);
  assert.equal(b.aSignalGradeAReachableWhenVolumeGt0_9,false);
  assert.equal(b.aBestWhenVolumeLe0_9,82);
}

console.log(JSON.stringify({
  ok:true,
  observer:"SIGNAL_GRADE_CHANNEL_OBSERVER_V0_1",
  bFinalGradeGateStructurallyRedundantAfterBPass:true,
  aFinalGradeGateStructurallyActive:true,
  aGradeAImpossibleWhenVolumeTodayVsPrev5Gt0_9:true,
  outcomesUsed:false,
  decisionImpact:false
}));
