import assert from "node:assert/strict";
import {FORMAL_GATE_ORDER} from "../research/formal_gate_replay_v0_1.mjs";
import {classifyChannelStageRow,summarizeChannelStageDenominators} from "../research/channel_stage_denominator_observer_v0_1.mjs";

function obs({A=false,B=false,gateOverrides={},ok=false,firstFailure=""}={}){
  const gates=Object.fromEntries(FORMAL_GATE_ORDER.map(id=>[id,{status:"PASS"}]));
  gates.AB_SETUP={status:(A||B)?"PASS":"FAIL",A,B};
  for(const [id,row] of Object.entries(gateOverrides)) gates[id]={...gates[id],...row};
  return {gates,formalResult:{ok,firstFailure,basePassed:true,rrPassed:gates.REWARD_RISK.status==="PASS"}};
}
function row(opts={}){
  return classifyChannelStageRow({
    observer:opts.observer,
    scanDate:"2026-09-27",
    symbol:opts.symbol||"X",
    pool:opts.pool||"GENERAL",
    selectedFlag:opts.selectedFlag===true
  });
}

// Clean A: full sequential denominator path.
{
  const r=row({symbol:"A1",observer:obs({A:true,B:false,ok:true}),selectedFlag:true});
  assert.equal(r.formalChannel,"A");
  assert.equal(r.setup.status,"PASS");
  assert.equal(r.postSetupPrecisionPass,true);
  assert.equal(r.targetPass,true);
  assert.equal(r.rrPass,true);
  assert.equal(r.gradePass,true);
  assert.equal(r.qualified,true);
  assert.equal(r.selected,true);
  assert.deepEqual(r.invariantViolations,[]);
}

// Clean B and dual-pass precedence: dual pass belongs to B under current Formal precedence.
{
  const r=row({symbol:"B1",observer:obs({A:true,B:true,ok:true})});
  assert.equal(r.rawSetup.dualPass,true);
  assert.equal(r.formalChannel,"B");
  assert.equal(r.gradePass,true);
}

// A can pass setup/RR and then fail final grade.
{
  const r=row({symbol:"A2",observer:obs({
    A:true,B:false,ok:false,firstFailure:"策略品質低於B級，不列入推薦",
    gateOverrides:{FINAL_SIGNAL_GRADE:{status:"FAIL",value:60}}
  })});
  assert.equal(r.formalChannel,"A");
  assert.equal(r.rrPass,true);
  assert.equal(r.gradePass,false);
  assert.equal(r.stages.FINAL_SIGNAL_GRADE.status,"FAIL");
  assert.deepEqual(r.invariantViolations,[]);
}

// B final-grade failure is a structural negative-control violation.
{
  const r=row({symbol:"B2",observer:obs({
    A:false,B:true,ok:false,
    gateOverrides:{FINAL_SIGNAL_GRADE:{status:"FAIL",value:60}}
  })});
  assert.equal(r.formalChannel,"B");
  assert.ok(r.invariantViolations.includes("B_RR_PASS_FINAL_GRADE_FAIL_SHOULD_BE_STRUCTURAL_ZERO"));
}

// Earlier gate failure means observed setup geometry is NOT a sequential setup-pass denominator.
{
  const r=row({symbol:"E1",observer:obs({
    A:true,B:false,ok:false,
    gateOverrides:{SECTOR_GATE:{status:"FAIL"}}
  })});
  assert.equal(r.rawSetup.A,true);
  assert.equal(r.formalChannel,null);
  assert.equal(r.setup.status,"NOT_REACHED");
  assert.equal(r.setup.blocker.gate,"SECTOR_GATE");
}

// Post-setup fundamental failure stops target/RR/grade denominators.
{
  const r=row({symbol:"F1",observer:obs({
    A:true,B:false,ok:false,
    gateOverrides:{FUNDAMENTAL_QUALITY:{status:"FAIL"}}
  })});
  assert.equal(r.formalChannel,"A");
  assert.equal(r.postSetupPrecisionPass,false);
  assert.equal(r.stages.FUNDAMENTAL_QUALITY.status,"FAIL");
  assert.equal(r.stages.TARGET_AVAILABLE.status,"NOT_REACHED");
  assert.equal(r.rrPass,false);
  assert.equal(r.gradePass,false);
  assert.equal(r.firstPostSetupBlocker.gate,"FUNDAMENTAL_QUALITY");
}

// Missing target is UNKNOWN, not FAIL and does not flow into RR.
{
  const r=row({symbol:"U1",observer:obs({
    A:true,B:false,ok:false,
    gateOverrides:{TARGET_AVAILABLE:{status:"UNKNOWN",reason:"TARGET_EVALUATION_NOT_CAPTURED"}}
  })});
  assert.equal(r.stages.TARGET_AVAILABLE.status,"UNKNOWN");
  assert.equal(r.stages.REWARD_RISK.status,"NOT_REACHED");
  assert.equal(r.firstPostSetupBlocker.kind,"UNKNOWN");
}

// Safe not-applicable valuation state does not block reaching setup.
{
  const r=row({symbol:"NA1",observer:obs({
    A:true,B:false,ok:true,
    gateOverrides:{VALUATION_RELATIVE_RISK:{status:"NOT_EVALUABLE",reason:"NO_POSITIVE_TTM_PE"}}
  })});
  assert.equal(r.formalChannel,"A");
  assert.equal(r.setup.status,"PASS");
}

// Aggregate by pool/channel and prove raw setup != sequential setup denominator.
{
  const rows=[
    row({symbol:"A1",observer:obs({A:true,B:false,ok:true}),selectedFlag:true}),
    row({symbol:"A2",observer:obs({A:true,B:false,ok:false,gateOverrides:{FINAL_SIGNAL_GRADE:{status:"FAIL"}}})}),
    row({symbol:"B1",pool:"THOUSAND",observer:obs({A:true,B:true,ok:true})}),
    row({symbol:"E1",observer:obs({A:true,B:false,ok:false,gateOverrides:{SECTOR_GATE:{status:"FAIL"}}})}),
    row({symbol:"F1",observer:obs({A:true,B:false,ok:false,gateOverrides:{FUNDAMENTAL_QUALITY:{status:"FAIL"}}})}),
    row({symbol:"U1",observer:obs({A:true,B:false,ok:false,gateOverrides:{TARGET_AVAILABLE:{status:"UNKNOWN"}}})})
  ];
  const s=summarizeChannelStageDenominators(rows);
  assert.equal(s.rawSetupByPool.GENERAL.A,5);
  assert.equal(s.byPool.GENERAL.A.formalChannelAssigned,4);
  assert.equal(s.byPool.GENERAL.A.rrPass,2);
  assert.equal(s.byPool.GENERAL.A.gradePass,1);
  assert.equal(s.byPool.GENERAL.A.qualified,1);
  assert.equal(s.byPool.GENERAL.A.selected,1);
  assert.equal(s.byPool.THOUSAND.B.formalChannelAssigned,1);
  assert.equal(s.rawSetupByPool.THOUSAND.DUAL,1);
  assert.equal(s.setupNotReached.FAIL,1);
  assert.equal(s.byPool.GENERAL.A.firstPostSetupBlockerCounts.FUNDAMENTAL_QUALITY,1);
  assert.equal(s.byPool.GENERAL.A.firstPostSetupBlockerCounts.TARGET_AVAILABLE,1);
}

console.log(JSON.stringify({
  ok:true,
  sequentialDenominators:true,
  channelSpecific:true,
  bPrecedence:true,
  unknownPreserved:true,
  bGradeFailNegativeControl:true,
  formalCoreImpact:false
},null,2));
