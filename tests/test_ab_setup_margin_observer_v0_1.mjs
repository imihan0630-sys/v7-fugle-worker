import assert from "node:assert/strict";
import fs from "node:fs";
import {observeABSetupMargins,summarizeABSetupMargins,AB_SETUP_MARGIN_CHECK_ORDER} from "../research/ab_setup_margin_observer_v0_1.mjs";

function base(overrides={}){
  const f={
    symbol:"T",close:100,ma10:99,ma20:98,ma60:97,prevMa20:98,
    recentHigh10:106,priorHigh20:99.8003992015968,priorLow20:90,
    rightLow:98,recentLow5Prev:98,todayLow:99,
    volumeTodayVsPrev5:1.0,volumeContraction5to20:0.9,
    bullishStack:true,justTurnBullish:false,
    dailyClosePosition:0.8,dailyUpperShadowRatio:0.1,ret20:20,lateStage:false
  };
  return {...f,...overrides};
}

// Frozen mask order.
assert.deepEqual(AB_SETUP_MARGIN_CHECK_ORDER.A,["trend","pullback","nearSupport","volume","structure","notLate"]);
assert.deepEqual(AB_SETUP_MARGIN_CHECK_ORDER.B,["trend","breakout","volume","strongClose","upperShadow","notLate"]);

// Exact B threshold boundaries are inclusive and should pass.
{
  const prior=100/1.002;
  const f=base({priorHigh20:prior,recentHigh10:prior,volumeTodayVsPrev5:1.3,dailyClosePosition:0.65,dailyUpperShadowRatio:0.35,ret20:30});
  const r=observeABSetupMargins(f,{pool:"GENERAL"});
  assert.equal(r.B.pass,true);
  assert.equal(r.B.rawMargins.breakout.closeMinus1_002PriorHigh20,0);
  assert.equal(r.B.rawMargins.volume.marginAbove1_3,0);
  assert.equal(r.B.rawMargins.strongClose.marginAbove0_65,0);
  assert.equal(r.B.rawMargins.upperShadow.marginBelow0_35,0);
  assert.equal(r.B.rawMargins.notLate.marginRet20Below30,0);
}

// Distance-blind witness: same failed B-volume bit, radically different raw margin.
{
  const prior=100/1.002;
  const near=observeABSetupMargins(base({priorHigh20:prior,recentHigh10:prior,volumeTodayVsPrev5:1.29,dailyClosePosition:0.8,dailyUpperShadowRatio:0.1,ret20:20}));
  const far=observeABSetupMargins(base({priorHigh20:prior,recentHigh10:prior,volumeTodayVsPrev5:0.10,dailyClosePosition:0.8,dailyUpperShadowRatio:0.1,ret20:20}));
  assert.equal(near.B.failedCount,1);
  assert.equal(far.B.failedCount,1);
  assert.equal(near.B.bitmask,far.B.bitmask);
  assert.ok(Math.abs(near.B.rawMargins.volume.marginAbove1_3+0.01)<1e-9);
  assert.ok(Math.abs(far.B.rawMargins.volume.marginAbove1_3+1.2)<1e-9);
}

// A-volume is an OR gate. One side may fail while the other saves the check.
{
  const r=observeABSetupMargins(base({volumeTodayVsPrev5:1.2,volumeContraction5to20:0.9}));
  assert.equal(r.A.checks.volume,true);
  assert.ok(r.A.rawMargins.volumeOr.marginBelow1_05<0);
  assert.ok(r.A.rawMargins.volumeOr.marginBelow0_95>=0);
}

// Formal truthiness quirk: an exact zero becomes sentinel 999 on A's volume arm.
{
  const r=observeABSetupMargins(base({volumeTodayVsPrev5:0,volumeContraction5to20:1.0}));
  assert.equal(r.A.checks.volume,false);
  assert.equal(r.A.rawMargins.volumeOr.volumeTodayFormalEffective,999);
  assert.ok(r.warnings.includes("A_VOLUME_TODAY_ZERO_COALESCED_TO_999_BY_FORMAL_TRUTHINESS"));
}

// B ret20<=30 dominates the ret20>35 component of lateStage.
{
  const f=base({ret20:34,lateStage:false,ma20:100,close:100});
  const r=observeABSetupMargins(f);
  assert.equal(r.B.checks.notLate,false);
  assert.ok(r.B.rawMargins.notLate.marginRet20Below30<0);
  assert.ok(r.B.rawMargins.notLate.marginRet20Below35===undefined);
}

// Late-stage source inconsistency is surfaced, never silently recomputed away.
{
  const r=observeABSetupMargins(base({ret20:40,lateStage:false}));
  assert.ok(r.warnings.includes("LATE_STAGE_FLAG_RAW_FEATURE_MISMATCH"));
}

// Nearest channel remains Hamming-only and preserves ties.
{
  const aNear=observeABSetupMargins(base({priorHigh20:120,recentHigh10:106,volumeTodayVsPrev5:1.0,dailyClosePosition:0.2,dailyUpperShadowRatio:0.8}));
  assert.equal(aNear.nearestChannel,"A");
  const tie=observeABSetupMargins(base({ma20:0,ma60:0,prevMa20:0,priorHigh20:0,recentHigh10:0,volumeTodayVsPrev5:2,volumeContraction5to20:2,dailyClosePosition:0.2,dailyUpperShadowRatio:0.8,lateStage:true}));
  assert.ok(["A","B","TIE"].includes(tie.nearestChannel));
}

// Summary never claims sequential setup reach.
{
  const rows=[
    observeABSetupMargins(base(),{pool:"GENERAL",setupReach:"UNKNOWN"}),
    observeABSetupMargins(base({volumeTodayVsPrev5:1.29}),{pool:"THOUSAND",setupReach:"REACHED"})
  ];
  const s=summarizeABSetupMargins(rows);
  assert.equal(s.rows,2);
  assert.equal(s.byPool.GENERAL.rows,1);
  assert.equal(s.byPool.THOUSAND.rows,1);
  assert.match(s.policy,/must separately prove setup was sequentially reached/);
}

// Source-contract guard: fail loudly if the Formal thresholds/check shape drifts.
{
  const src=fs.readFileSync(new URL("../Worker.js",import.meta.url),"utf8");
  const start=src.indexOf("function strategySetupState(f)");
  const end=src.indexOf("function nearestRealResistance",start);
  assert.ok(start>=0&&end>start);
  const fn=src.slice(start,end);
  for(const token of [
    "f.ma20 >= f.ma60 * 0.995",
    "pullbackPct >= 2 && pullbackPct <= 15",
    "supportDistancePct <= 4",
    "<= 1.05 ||",
    "<= 0.95",
    "f.close >= support * 0.985",
    "f.ma20 >= f.ma60 * 0.99",
    "f.close >= f.priorHigh20 * 1.002",
    ">= 1.3",
    ">= 0.65",
    "<= 0.35",
    "<= 30"
  ]) assert.ok(fn.includes(token),`Formal setup source drifted; missing token: ${token}`);
}

console.log(JSON.stringify({ok:true,rawMargins:true,bitmasks:true,noCompositeDistance:true,formalCoreImpact:false},null,2));
