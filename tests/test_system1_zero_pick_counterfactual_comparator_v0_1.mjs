import assert from "node:assert/strict";
import {
  buildSystem1ZeroPickCounterfactualSelection,
  compareZeroPickRankRows,
  ZERO_PICK_COMPARATOR_V0_1,
} from "../research/system1_zero_pick_counterfactual_comparator_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const row=(symbol,pool,ord,o={})=>({
  schemaVersion:"SYSTEM1_ZERO_PICK_COUNTERFACTUAL_RANK_INPUT_V0_1",
  scanDate:"2026-10-05",symbol,pool,captureGeneration:"g1",
  decisionAt:"2026-10-05T16:00:00+08:00",
  rankingTupleKnownAt:"2026-10-05T15:59:00+08:00",
  rankComparatorVersion:"PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30",
  rankingTupleProvenance:"COUNTERFACTUAL_RANK_INPUT_RESEARCH_ONLY",
  rankingTupleFingerprint:"fp-"+symbol,
  preSortOrdinal:ord,
  postConsensusPriorityScore:100,
  rewardPerRisk:2,
  marketConsensusScore:5,
  setupQuality:80,
  sectorFlow:3,
  relativeStrength:4,
  ...o,
});

eq(ZERO_PICK_COMPARATOR_V0_1.generalMax,3);
eq(ZERO_PICK_COMPARATOR_V0_1.thousandMax,3);

const out=buildSystem1ZeroPickCounterfactualSelection({rows:[
  row("G1","GENERAL",0,{postConsensusPriorityScore:101}),
  row("G2","GENERAL",1,{rewardPerRisk:3}),
  row("G3","GENERAL",2,{marketConsensusScore:6}),
  row("G4","GENERAL",3,{setupQuality:90}),
  row("T1","THOUSAND",0,{postConsensusPriorityScore:104}),
  row("T2","THOUSAND",1,{postConsensusPriorityScore:103}),
  row("T3","THOUSAND",2,{postConsensusPriorityScore:102}),
  row("T4","THOUSAND",3,{postConsensusPriorityScore:99}),
]});
eq(out.poolCounts,{GENERAL:4,THOUSAND:4});
eq(out.selectedN,6);
eq(out.selectedSymbols.includes("G4"),false);
eq(out.selectedSymbols.includes("T4"),false);
eq(out.comparator.poolPolicy.crossPoolTransfer,false);
eq(out.economicSuperiority,"UNKNOWN");
eq(out.formalOptimizationCandidate,"NONE");
eq(out.formalCoreImpact,false);

const sparse=buildSystem1ZeroPickCounterfactualSelection({rows:[
  row("G1","GENERAL",0),
  row("T1","THOUSAND",0,{postConsensusPriorityScore:103}),
  row("T2","THOUSAND",1,{postConsensusPriorityScore:102}),
  row("T3","THOUSAND",2,{postConsensusPriorityScore:101}),
  row("T4","THOUSAND",3,{postConsensusPriorityScore:99}),
]});
eq(sparse.selectedN,4);
eq(sparse.poolCounts.GENERAL,1);
eq(sparse.selectedSymbols.includes("T4"),false);

const tie=[row("A","GENERAL",2),row("B","GENERAL",1)];
tie.sort(compareZeroPickRankRows);
eq(tie.map(x=>x.symbol),["B","A"]);

assert.throws(()=>buildSystem1ZeroPickCounterfactualSelection({rows:[
  row("A","GENERAL",0,{marketConsensusScore:null})
]}),/INVALID_marketConsensusScore/);n++;

assert.throws(()=>buildSystem1ZeroPickCounterfactualSelection({rows:[
  row("A","GENERAL",0,{rankingTupleKnownAt:"2026-10-05T16:01:00+08:00"})
]}),/NOT_KNOWN_BY_DECISION/);n++;

assert.throws(()=>buildSystem1ZeroPickCounterfactualSelection({rows:[
  row("A","GENERAL",0),row("A","GENERAL",1)
]}),/DUPLICATE_SYMBOL/);n++;

assert.throws(()=>buildSystem1ZeroPickCounterfactualSelection({rows:[
  row("A","GENERAL",0),row("B","GENERAL",0)
]}),/DUPLICATE_PRESORT/);n++;

assert.throws(()=>buildSystem1ZeroPickCounterfactualSelection({rows:[
  row("A","GENERAL",0,{captureGeneration:"g1"}),
  row("B","GENERAL",1,{captureGeneration:"g2"})
]}),/MIXED_DECISION_GENERATION/);n++;

assert.throws(()=>buildSystem1ZeroPickCounterfactualSelection({rows:[
  row("A","GENERAL",0,{rankComparatorVersion:"NEW"})
]}),/COMPARATOR_VERSION_MISMATCH/);n++;

console.log(JSON.stringify({
  ok:true,assertions:n,classAResearchOnly:true,noCrossPool:true,
  fullTupleRequired:true,pitKnownAtRequired:true,formalCoreImpact:false,
}));\nawait import("./test_system1_zero_pick_rank_input_observer_v0_1.mjs");\n