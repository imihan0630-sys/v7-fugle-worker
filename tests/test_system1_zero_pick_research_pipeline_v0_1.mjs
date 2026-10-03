import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {buildSystem1ZeroPickResearchPipeline} from "../research/system1_zero_pick_research_pipeline_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};
const hash=s=>createHash("sha256").update(s).digest("hex");

function src(symbol,pool,ord,patch={}){
  const base={
    schemaVersion:"SYSTEM1_ZERO_PICK_RANK_OBSERVER_SOURCE_V0_1",
    scanDate:"2026-10-05",
    symbol,pool,
    captureGeneration:"C1:2026-10-05:g1",
    decisionAt:"2026-10-05T16:00:00+08:00",
    preSortOrdinal:ord,
    sourceKnownAt:{
      feature:"2026-10-05T15:58:00+08:00",
      sector:"2026-10-05T15:58:30+08:00",
      consensus:"2026-10-05T15:59:00+08:00"
    },
    marketConsensusState:"EXACT_DATE_REFERENCE",
    marketConsensusReferenceDate:"2026-10-05",
    observed:{
      rewardPerRisk:2.5,
      setupQuality:70,
      sectorFlow:60,
      ret20:12,
      marketReturn20:5,
      institutionalScore:55,
      fundamentalScore:50,
      marketConsensusSourceCount:2
    }
  };
  return {
    ...base,
    ...patch,
    sourceKnownAt:{...base.sourceKnownAt,...(patch.sourceKnownAt||{})},
    observed:{...base.observed,...(patch.observed||{})}
  };
}

const sources=[
  src("G1","GENERAL",0,{observed:{setupQuality:90}}),
  src("G2","GENERAL",1,{observed:{setupQuality:85}}),
  src("G3","GENERAL",2,{observed:{setupQuality:80}}),
  src("G4","GENERAL",3,{observed:{setupQuality:75}}),
  src("T1","THOUSAND",0,{observed:{setupQuality:92}}),
  src("T2","THOUSAND",1,{observed:{setupQuality:88}}),
  src("T3","THOUSAND",2,{observed:{setupQuality:82}}),
  src("T4","THOUSAND",3,{observed:{setupQuality:74}}),
  src("X","GENERAL",9,{observed:{sectorFlow:null}})
];
const eligible=["G1","G2","G3","G4","T1","T2","T3","T4"];

const good=buildSystem1ZeroPickResearchPipeline({
  observerSources:sources,
  eligibleSymbols:eligible,
  eligibilitySourceSchema:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
  eligibilityOutcomeBlind:true,
  formalSelectedCount:0,
  hashFn:hash
});

eq(good.status,"COUNTERFACTUAL_MEMBERSHIP_FROZEN_RESEARCH_ONLY");
eq(good.eligibleN,8);
eq(good.selection.selectedN,6);
eq(good.selection.poolCounts,{GENERAL:4,THOUSAND:4});
eq(good.selection.selectedSymbols.includes("G4"),false);
eq(good.selection.selectedSymbols.includes("T4"),false);
eq(good.selection.selectedSymbols.includes("X"),false);
eq(good.incompleteEligibleSymbols,[]);
eq(good.formalCoreImpact,false);
eq(good.economicSuperiority,"UNKNOWN");

const blocked=buildSystem1ZeroPickResearchPipeline({
  observerSources:sources.map(x=>x.symbol==="G4"?src("G4","GENERAL",3,{observed:{sectorFlow:null}}):x),
  eligibleSymbols:eligible,
  eligibilitySourceSchema:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
  eligibilityOutcomeBlind:true,
  formalSelectedCount:0,
  hashFn:hash
});
eq(blocked.status,"BLOCKED_INCOMPLETE_ELIGIBLE_RANK_INPUT");
eq(blocked.selection,null);
eq(blocked.incompleteEligibleSymbols,["G4"]);

const missing=buildSystem1ZeroPickResearchPipeline({
  observerSources:sources.filter(x=>x.symbol!=="T4"),
  eligibleSymbols:eligible,
  eligibilitySourceSchema:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
  eligibilityOutcomeBlind:true,
  formalSelectedCount:0,
  hashFn:hash
});
eq(missing.status,"BLOCKED_MISSING_ELIGIBLE_SOURCE");
eq(missing.selection,null);
eq(missing.missingSourceSymbols,["T4"]);

const none=buildSystem1ZeroPickResearchPipeline({
  observerSources:[sources[0]],
  eligibleSymbols:[],
  eligibilitySourceSchema:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
  eligibilityOutcomeBlind:true,
  formalSelectedCount:0,
  hashFn:hash
});
eq(none.status,"NO_P1A_F9_ELIGIBLE");
eq(none.selection,null);

assert.throws(()=>buildSystem1ZeroPickResearchPipeline({
  observerSources:sources,
  eligibleSymbols:eligible,
  eligibilitySourceSchema:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
  eligibilityOutcomeBlind:false,
  formalSelectedCount:0,
  hashFn:hash
}),/OUTCOME_BLIND_ELIGIBILITY_REQUIRED/);n++;

assert.throws(()=>buildSystem1ZeroPickResearchPipeline({
  observerSources:sources,
  eligibleSymbols:eligible,
  eligibilitySourceSchema:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
  eligibilityOutcomeBlind:true,
  formalSelectedCount:1,
  hashFn:hash
}),/REQUIRES_FORMAL_ZERO_PICK_DATE/);n++;

assert.throws(()=>buildSystem1ZeroPickResearchPipeline({
  observerSources:[sources[0],src("G2","GENERAL",1,{captureGeneration:"C1:2026-10-05:g2"})],
  eligibleSymbols:["G1","G2"],
  eligibilitySourceSchema:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
  eligibilityOutcomeBlind:true,
  formalSelectedCount:0,
  hashFn:hash
}),/MIXED_DECISION_GENERATION/);n++;

assert.throws(()=>buildSystem1ZeroPickResearchPipeline({
  observerSources:[sources[0],sources[0]],
  eligibleSymbols:["G1"],
  eligibilitySourceSchema:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
  eligibilityOutcomeBlind:true,
  formalSelectedCount:0,
  hashFn:hash
}),/DUPLICATE_OBSERVER_SYMBOL/);n++;

assert.throws(()=>buildSystem1ZeroPickResearchPipeline({
  observerSources:sources,
  eligibleSymbols:["G1","G1"],
  eligibilitySourceSchema:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
  eligibilityOutcomeBlind:true,
  formalSelectedCount:0,
  hashFn:hash
}),/DUPLICATE_ELIGIBLE_SYMBOL/);n++;

ok(good.selection.noTrade===true&&good.selection.noPush===true);
console.log(JSON.stringify({
  ok:true,assertions:n,endToEndPureResearch:true,formalZeroPickOnly:true,
  outcomeBlindEligibilityRequired:true,eligibleIncompleteBlocksWholeDate:true,
  nonEligibleIncompleteDoesNotBlock:true,noCrossPool:true,formalCoreImpact:false
}));
