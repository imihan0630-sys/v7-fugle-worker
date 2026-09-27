import assert from "node:assert/strict";
import {classifySequentialABSetupPopulation,summarizeSequentialABSetupPopulation} from "../research/ab_setup_sequential_population_observer_v0_1.mjs";

function margin({A=false,B=false,pool="GENERAL",symbol="X",nearest=null}={}){
  const aMask=A?"111111":"111110";
  const bMask=B?"111111":"111110";
  const aFail=A?0:1,bFail=B?0:1;
  return {
    scanDate:"2026-09-27",symbol,pool,
    A:{pass:A,bitmask:aMask,failedCount:aFail,failedChecks:A?[]:["notLate"],rawMargins:{x:1}},
    B:{pass:B,bitmask:bMask,failedCount:bFail,failedChecks:B?[]:["notLate"],rawMargins:{x:2}},
    failedACount:aFail,failedBCount:bFail,
    nearestChannel:nearest||(aFail<bFail?"A":bFail<aFail?"B":"TIE"),warnings:[]
  };
}
function stage({status="FAIL",A=false,B=false,pool="GENERAL",symbol="X",blocker=null}={}){
  return {
    scanDate:"2026-09-27",symbol,pool,
    rawSetup:{A,B,dualPass:A&&B},
    formalChannel:status==="PASS"?(B?"B":A?"A":null):null,
    setup:status==="NOT_REACHED"?{status,blocker:blocker||{gate:"SECTOR_GATE",kind:"FAIL"}}:{status}
  };
}

// Exact setup-first failure: prior gates cleared and both channels fail.
{
  const r=classifySequentialABSetupPopulation({
    channelStageRow:stage({status:"FAIL",A:false,B:false}),
    marginRow:margin({A:false,B:false,nearest:"A"})
  });
  assert.equal(r.state,"SETUP_FIRST_FAILURE");
  assert.equal(r.setupFirstFailureEligible,true);
}

// A/B geometry can look near even when setup was never reached; must be excluded.
{
  const r=classifySequentialABSetupPopulation({
    channelStageRow:stage({status:"NOT_REACHED",A:false,B:false,blocker:{gate:"SECTOR_GATE",kind:"FAIL"}}),
    marginRow:margin({A:false,B:false,nearest:"B"})
  });
  assert.equal(r.state,"PRE_SETUP_NOT_REACHED");
  assert.equal(r.setupFirstFailureEligible,false);
  assert.equal(r.blocker.gate,"SECTOR_GATE");
}

// Sequential pass belongs to setup-pass denominator and preserves B precedence on dual pass.
{
  const r=classifySequentialABSetupPopulation({
    channelStageRow:stage({status:"PASS",A:true,B:true}),
    marginRow:margin({A:true,B:true})
  });
  assert.equal(r.state,"SETUP_PASS");
  assert.equal(r.formalChannel,"B");
  assert.equal(r.setupFirstFailureEligible,false);
}

// Cross-row key mismatch fails closed.
{
  const r=classifySequentialABSetupPopulation({
    channelStageRow:stage({status:"FAIL",symbol:"A"}),
    marginRow:margin({A:false,B:false,symbol:"B"})
  });
  assert.equal(r.state,"UNKNOWN");
  assert.equal(r.reason,"ROW_KEY_MISMATCH");
}

// Geometry state mismatch fails closed instead of silently trusting either observer.
{
  const r=classifySequentialABSetupPopulation({
    channelStageRow:stage({status:"FAIL",A:false,B:false}),
    marginRow:margin({A:true,B:false})
  });
  assert.equal(r.state,"UNKNOWN");
  assert.equal(r.reason,"AB_GEOMETRY_STATE_MISMATCH");
}

// Aggregate proves raw geometry from pre-setup failures cannot inflate setup-first-failure denominator.
{
  const rows=[
    classifySequentialABSetupPopulation({channelStageRow:stage({status:"FAIL",A:false,B:false,symbol:"F1"}),marginRow:margin({A:false,B:false,symbol:"F1",nearest:"A"})}),
    classifySequentialABSetupPopulation({channelStageRow:stage({status:"NOT_REACHED",A:false,B:false,symbol:"E1"}),marginRow:margin({A:false,B:false,symbol:"E1",nearest:"A"})}),
    classifySequentialABSetupPopulation({channelStageRow:stage({status:"PASS",A:true,B:false,symbol:"P1",pool:"THOUSAND"}),marginRow:margin({A:true,B:false,symbol:"P1",pool:"THOUSAND"})})
  ];
  const s=summarizeSequentialABSetupPopulation(rows);
  assert.equal(s.setupFirstFailureTotal,1);
  assert.equal(s.setupPassTotal,1);
  assert.equal(s.byPool.GENERAL.preSetupNotReached,1);
  assert.equal(s.byPool.GENERAL.firstFailureByNearest.A,1);
}

console.log(JSON.stringify({ok:true,exactSequentialPopulation:true,preSetupExcluded:true,unknownFailsClosed:true,formalCoreImpact:false},null,2));
