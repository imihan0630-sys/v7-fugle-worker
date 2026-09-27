import assert from "node:assert/strict";
import {
  classifyInstitutionalActorTotal,
  summarizeInstitutionalActorTotal
} from "./institutional_actor_total_conflict_observer_v0_1.mjs";

const base={scanDate:"2026-09-29",avgVolume20Lots:1000};

// Positive actor exists while aggregate is negative: +6 direction bonus survives, net intensity is 0.
{
  const x=classifyInstitutionalActorTotal({
    ...base,foreignNet:200000,trustNet:-300000,dealerNet:0,institutionTotalNet:-100000
  });
  assert.equal(x.state,"CLEAN");
  assert.equal(x.conflictClass,"MIXED_ACTORS_TOTAL_NEGATIVE");
  assert.equal(x.interaction.anyPositiveBonus,6);
  assert.equal(x.interaction.allPositiveBonus,0);
  assert.equal(x.aggregate.aggregateNetIntensity,0);
  assert.equal(x.aggregate.negativeMagnitudeAdv,0.1);
  assert.equal(x.interaction.mixedPositiveDespiteNonpositiveTotal,true);
}

// Mixed actors with positive aggregate get +6 plus magnitude intensity, not +15 alignment.
{
  const x=classifyInstitutionalActorTotal({
    ...base,foreignNet:500000,trustNet:500000,dealerNet:-100000,institutionTotalNet:900000
  });
  assert.equal(x.conflictClass,"MIXED_ACTORS_TOTAL_POSITIVE");
  assert.equal(x.interaction.currentDirectionBonus,6);
  assert.equal(x.aggregate.aggregateNetIntensity,22.5);
}

// All three positive => +21 current-direction interaction.
{
  const x=classifyInstitutionalActorTotal({
    ...base,foreignNet:200000,trustNet:300000,dealerNet:100000,institutionTotalNet:600000
  });
  assert.equal(x.conflictClass,"ALL_POSITIVE_ALIGNED");
  assert.equal(x.interaction.currentDirectionBonus,21);
  assert.equal(x.aggregate.aggregateNetIntensity,15);
}

// Upper clipping: 1 ADV and 2 ADV have identical aggregate-intensity points.
{
  const a=classifyInstitutionalActorTotal({
    ...base,foreignNet:400000,trustNet:300000,dealerNet:300000,institutionTotalNet:1000000
  });
  const b=classifyInstitutionalActorTotal({
    ...base,foreignNet:800000,trustNet:600000,dealerNet:600000,institutionTotalNet:2000000
  });
  assert.equal(a.aggregate.aggregateNetIntensity,25);
  assert.equal(b.aggregate.aggregateNetIntensity,25);
  assert.equal(a.aggregate.positiveExcessAdv,0);
  assert.equal(b.aggregate.positiveExcessAdv,1);
}

// Lower clipping: zero and deeply negative totals both get zero aggregate-intensity.
{
  const a=classifyInstitutionalActorTotal({
    ...base,foreignNet:100000,trustNet:-100000,dealerNet:0,institutionTotalNet:0
  });
  const b=classifyInstitutionalActorTotal({
    ...base,foreignNet:100000,trustNet:-2100000,dealerNet:0,institutionTotalNet:-2000000
  });
  assert.equal(a.aggregate.aggregateNetIntensity,0);
  assert.equal(b.aggregate.aggregateNetIntensity,0);
  assert.equal(b.aggregate.negativeMagnitudeAdv,2);
}

// Source invariant must hold.
{
  const x=classifyInstitutionalActorTotal({
    ...base,foreignNet:1,trustNet:2,dealerNet:3,institutionTotalNet:99
  });
  assert.equal(x.state,"INVARIANT_VIOLATION");
}

// Complete parent summary keeps conflict classes separate.
{
  const rows=[
    {...base,symbol:"1001",foreignNet:200000,trustNet:-300000,dealerNet:0,institutionTotalNet:-100000},
    {...base,symbol:"1002",foreignNet:500000,trustNet:500000,dealerNet:-100000,institutionTotalNet:900000},
    {...base,symbol:"1003",foreignNet:200000,trustNet:300000,dealerNet:100000,institutionTotalNet:600000}
  ];
  const out=summarizeInstitutionalActorTotal({rows,completeCleanParent:true});
  const d=out.byDate["2026-09-29"];
  assert.equal(d.cleanRows,3);
  assert.equal(d.classCounts.MIXED_ACTORS_TOTAL_NEGATIVE,1);
  assert.equal(d.classCounts.MIXED_ACTORS_TOTAL_POSITIVE,1);
  assert.equal(d.classCounts.ALL_POSITIVE_ALIGNED,1);
  assert.equal(d.mixedPositiveDespiteNonpositiveTotalRows,1);
}
{
  const out=summarizeInstitutionalActorTotal({rows:[],completeCleanParent:false});
  assert.equal(out.state,"UNKNOWN_INCOMPLETE_PARENT");
}

console.log(JSON.stringify({
  ok:true,
  actorTotalConflictClassesFrozen:true,
  lowerAndUpperNetClippingProven:true,
  actorSumInvariantRequired:true,
  outcomesUsed:false
},null,2));
