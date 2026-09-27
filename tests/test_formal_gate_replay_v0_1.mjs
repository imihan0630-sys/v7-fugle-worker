import assert from "node:assert/strict";
import {replaySingleGateRemoval,summarizeSingleGateRemoval,FORMAL_GATE_ORDER} from "../research/formal_gate_replay_v0_1.mjs";

function observer(overrides={}){
  const gates=Object.fromEntries(FORMAL_GATE_ORDER.map(id=>[id,{status:"PASS"}]));
  for(const [id,row] of Object.entries(overrides)) gates[id]={...gates[id],...row};
  return {gates,formalResult:{ok:false,firstFailure:null,basePassed:false,rrPassed:false}};
}

{
  const o=observer({LIQUIDITY:{status:"FAIL"}});
  const r=replaySingleGateRemoval(o,"LIQUIDITY");
  assert.equal(r.status,"ALL_OTHER_OBSERVED_GATES_CLEAR");
}

{
  const o=observer({LIQUIDITY:{status:"FAIL"},SECTOR_GATE:{status:"FAIL"}});
  const r=replaySingleGateRemoval(o,"LIQUIDITY");
  assert.equal(r.status,"NEXT_OBSERVED_FAIL");
  assert.equal(r.nextGate,"SECTOR_GATE");
}

{
  const o=observer({MARKET_CAP_FLOOR:{status:"FAIL"},LIQUIDITY:{status:"FAIL"}});
  const r=replaySingleGateRemoval(o,"LIQUIDITY");
  assert.equal(r.status,"EARLIER_OBSERVED_FAIL");
  assert.equal(r.nextGate,"MARKET_CAP_FLOOR");
}

{
  const o=observer({LIQUIDITY:{status:"FAIL"},FINANCIAL_SOURCE_COMPLETENESS:{status:"UNKNOWN",reason:"SOURCE_COMPLETENESS_NOT_PROVEN"},SECTOR_GATE:{status:"FAIL"}});
  const r=replaySingleGateRemoval(o,"LIQUIDITY");
  assert.equal(r.status,"NEXT_STATE_UNKNOWN");
  assert.equal(r.nextGate,"FINANCIAL_SOURCE_COMPLETENESS");
}

{
  const o=observer({
    AB_SETUP:{status:"FAIL"},
    TARGET_AVAILABLE:{status:"NOT_EVALUABLE",reason:"NO_FORMAL_CHANNEL"},
    REWARD_RISK:{status:"NOT_EVALUABLE",reason:"TARGET_NOT_AVAILABLE"}
  });
  const r=replaySingleGateRemoval(o,"AB_SETUP");
  assert.equal(r.status,"NEXT_STATE_NOT_EVALUABLE");
  assert.equal(r.nextGate,"TARGET_AVAILABLE");
}

{
  const o=observer({
    VALUATION_RELATIVE_RISK:{status:"NOT_EVALUABLE",reason:"NO_POSITIVE_TTM_PE"},
    SECTOR_GATE:{status:"FAIL"}
  });
  const r=replaySingleGateRemoval(o,"SECTOR_GATE");
  assert.equal(r.status,"ALL_OTHER_OBSERVED_GATES_CLEAR","safe not-applicable valuation gate must not block replay");
}

{
  const o=observer({LIQUIDITY:{status:"PASS"}});
  const r=replaySingleGateRemoval(o,"LIQUIDITY");
  assert.equal(r.status,"REMOVED_GATE_NOT_OBSERVED_FAIL");
}

{
  const list=[
    observer({LIQUIDITY:{status:"FAIL"}}),
    observer({LIQUIDITY:{status:"FAIL"},SECTOR_GATE:{status:"FAIL"}}),
    observer({LIQUIDITY:{status:"FAIL"},FINANCIAL_SOURCE_COMPLETENESS:{status:"UNKNOWN"}})
  ];
  const s=summarizeSingleGateRemoval(list,"LIQUIDITY");
  assert.equal(s.uniqueObservedClear,1);
  assert.equal(s.nextFailureCounts.SECTOR_GATE,1);
  assert.equal(s.unresolved,1);
  assert.equal(s.policy.includes("not recovered selectedCount"),true);
}

assert.throws(()=>replaySingleGateRemoval(observer(),"NO_SUCH_GATE"),/UNKNOWN_GATE/);

console.log(JSON.stringify({
  ok:true,
  singleGateOnly:true,
  nextFailureTransition:true,
  unknownFailClosed:true,
  dependentNotEvaluablePreserved:true,
  noRecoveredCandidateClaim:true,
  outcomeFree:true,
  formalCoreImpact:false
}));
