import assert from "node:assert/strict";
import {observeQuotaScarcity} from "../research/quota_scarcity_observer_v0_1.mjs";

function row(symbol,pool,score,selected=false){
  return {
    symbol,pool,formalOk:true,selected,
    ranking:{
      priorityScore:score,rewardPerRisk:2,marketConsensusScore:0,
      setupQuality:70,sectorFlow:50,relativeStrength:10
    }
  };
}

// GENERAL quota binds at 5 while THOUSAND has only 1: cross-pool stranding.
{
  const d=[
    row("1001","GENERAL",100,true),row("1002","GENERAL",90,true),row("1003","GENERAL",80,true),
    row("1004","GENERAL",70,false),row("1005","GENERAL",60,false),
    row("9001","THOUSAND",95,true)
  ];
  const o=observeQuotaScarcity({scanDate:"2026-09-29",decisionStates:d,completeSameScanPopulation:true});
  assert.equal(o.state,"COMPLETE");
  assert.equal(o.pools.GENERAL.quotaState,"QUOTA_BINDING");
  assert.equal(o.pools.GENERAL.qualifiedCount,5);
  assert.equal(o.pools.GENERAL.cutlineNext.symbol,"1004");
  assert.equal(o.pools.GENERAL.rank4Plus.length,2);
  assert.equal(o.pools.THOUSAND.quotaState,"GATE_LIMITED");
  assert.equal(o.pools.THOUSAND.unusedSlots,2);
  assert.equal(o.crossPoolStranding,true);
}

// Exactly three is not quota-binding.
{
  const d=[
    row("1001","GENERAL",100,true),row("1002","GENERAL",90,true),row("1003","GENERAL",80,true),
    row("9001","THOUSAND",100,true),row("9002","THOUSAND",90,true),row("9003","THOUSAND",80,true)
  ];
  const o=observeQuotaScarcity({scanDate:"2026-09-29",decisionStates:d,completeSameScanPopulation:true});
  assert.equal(o.pools.GENERAL.quotaState,"EXACTLY_FILLED");
  assert.equal(o.pools.GENERAL.cutlineNext,null);
  assert.equal(o.crossPoolStranding,false);
}

// Selected flag must agree with deployed rank top-N on a complete parent.
{
  const d=[
    row("1001","GENERAL",100,true),
    row("1002","GENERAL",90,false),
    row("1003","GENERAL",80,true),
    row("1004","GENERAL",70,true)
  ];
  const o=observeQuotaScarcity({scanDate:"2026-09-29",decisionStates:d,completeSameScanPopulation:true});
  assert.equal(o.state,"INVARIANT_VIOLATION");
  assert.equal(o.pools.GENERAL.selectedRanksMatchDeployedTopN,false);
}

// Incomplete parent must fail closed.
{
  const o=observeQuotaScarcity({scanDate:"2026-09-29",decisionStates:[],completeSameScanPopulation:false});
  assert.equal(o.state,"UNKNOWN_INCOMPLETE_PARENT");
  assert.equal(o.pools,null);
}

console.log(JSON.stringify({
  ok:true,
  fullRank4Plus:true,
  crossPoolStranding:true,
  selectedRankInvariant:true,
  formalCoreImpact:false
},null,2));
