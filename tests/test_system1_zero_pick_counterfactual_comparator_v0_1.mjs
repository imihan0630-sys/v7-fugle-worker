import assert from "node:assert/strict";
import {
  ZERO_PICK_COMPARATOR_VERSION_V0_1,
  ZERO_PICK_INPUT_SCHEMA_V0_1,
  ZERO_PICK_OUTPUT_SCHEMA_V0_1,
  ZERO_PICK_ORDERED_FIELDS_V0_1,
  computeZeroPickTupleFingerprintV0_1,
  compareZeroPickRankTupleV0_1,
  selectP1AZeroPickCounterfactualV0_1
} from "../research/system1_zero_pick_counterfactual_comparator_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};

const decisionAt="2026-10-03T13:20:00+08:00";
const generation="C1:2026-10-03:fixture-zero-pick";
let ordinal=0;

function row(symbol,pool,overrides={}){
  const x={
    schemaVersion:ZERO_PICK_INPUT_SCHEMA_V0_1,
    symbol,pool,captureGeneration:generation,decisionAt,knownAt:decisionAt,
    rankComparatorVersion:ZERO_PICK_COMPARATOR_VERSION_V0_1,
    postConsensusPriorityScore:80,
    rewardPerRisk:2.5,
    marketConsensusScore:50,
    setupQuality:70,
    sectorFlow:1.1,
    relativeStrength:3.0,
    preSortOrdinal:ordinal++,
    provenanceComplete:true,
    researchOnly:true,
    decisionImpact:false,
    ...overrides
  };
  x.rankingTupleFingerprint=computeZeroPickTupleFingerprintV0_1(x);
  return x;
}

eq(ZERO_PICK_ORDERED_FIELDS_V0_1,[
  "postConsensusPriorityScore","rewardPerRisk","marketConsensusScore",
  "setupQuality","sectorFlow","relativeStrength"
]);

// Verify every comparator layer is descending and the final stable tie is preSortOrdinal ascending.
const layers=[
  ["postConsensusPriorityScore",81],
  ["rewardPerRisk",2.6],
  ["marketConsensusScore",51],
  ["setupQuality",71],
  ["sectorFlow",1.2],
  ["relativeStrength",3.1]
];
for(const [field,value] of layers){
  const a=row("A_"+field,"GENERAL");
  const b=row("B_"+field,"GENERAL",{[field]:value});
  ok(compareZeroPickRankTupleV0_1(a,b)>0);
}
const t1=row("T1","GENERAL",{preSortOrdinal:100});
const t2=row("T2","GENERAL",{preSortOrdinal:99});
t1.rankingTupleFingerprint=computeZeroPickTupleFingerprintV0_1(t1);
t2.rankingTupleFingerprint=computeZeroPickTupleFingerprintV0_1(t2);
ok(compareZeroPickRankTupleV0_1(t1,t2)>0);

// GENERAL has 4 candidates, THOUSAND only 2: select 3 + 2, never move the unused thousand slot.
ordinal=0;
const receipts=[
  row("G_LOW","GENERAL",{postConsensusPriorityScore:70}),
  row("G_RR","GENERAL",{postConsensusPriorityScore:90,rewardPerRisk:2.4}),
  row("G_CONS","GENERAL",{postConsensusPriorityScore:90,rewardPerRisk:2.4,marketConsensusScore:60}),
  row("G_TOP","GENERAL",{postConsensusPriorityScore:91,rewardPerRisk:2.0}),
  row("T_A","THOUSAND",{postConsensusPriorityScore:88}),
  row("T_B","THOUSAND",{postConsensusPriorityScore:87})
];
const out=selectP1AZeroPickCounterfactualV0_1(receipts);
eq(out.schemaVersion,ZERO_PICK_OUTPUT_SCHEMA_V0_1);
eq(out.rankComparatorVersion,ZERO_PICK_COMPARATOR_VERSION_V0_1);
eq(out.captureGeneration,generation);
eq(out.decisionAt,decisionAt);
eq(out.poolQuota,3);
eq(out.selectedN,5);
eq(out.selectedByPool.GENERAL,["G_TOP","G_CONS","G_RR"]);
eq(out.selectedByPool.THOUSAND,["T_A","T_B"]);
eq(out.rankedByPool.GENERAL,["G_TOP","G_CONS","G_RR","G_LOW"]);
eq(out.rejectedByQuota.GENERAL,["G_LOW"]);
eq(out.slotSummary.generalUnusedSlots,0);
eq(out.slotSummary.thousandUnusedSlots,1);
eq(out.slotSummary.crossPoolTransfer,false);
eq(out.allocationAuthorized,false);
eq(out.executionAuthorized,false);
eq(out.economicConclusion,"UNKNOWN");
eq(out.formalOptimizationCandidate,"NONE");
eq(out.autoSwitchAuthorized,false);
eq(out.formalCoreLocked,true);
eq(out.noTrade,true);
eq(out.noPush,true);

function reject(mutator,pattern){
  ordinal=0;
  const x=row("X","GENERAL");
  mutator(x);
  assert.throws(()=>selectP1AZeroPickCounterfactualV0_1([x]),pattern);n++;
}

reject(x=>{x.marketConsensusScore=null;x.rankingTupleFingerprint=computeZeroPickTupleFingerprintV0_1(x);},/TUPLE_INCOMPLETE_marketConsensusScore/);
reject(x=>{x.rankingTupleFingerprint="0".repeat(64);},/TUPLE_FINGERPRINT_MISMATCH/);
reject(x=>{x.knownAt="2026-10-03T13:21:00+08:00";x.rankingTupleFingerprint=computeZeroPickTupleFingerprintV0_1(x);},/NON_PIT_TUPLE/);
reject(x=>{x.rankComparatorVersion="OTHER";x.rankingTupleFingerprint=computeZeroPickTupleFingerprintV0_1(x);},/COMPARATOR_VERSION_MISMATCH/);
reject(x=>{x.provenanceComplete=false;},/PROVENANCE_INCOMPLETE/);

ordinal=0;
const mixedA=row("M1","GENERAL");
const mixedB=row("M2","GENERAL",{captureGeneration:"OTHER"});
mixedB.rankingTupleFingerprint=computeZeroPickTupleFingerprintV0_1(mixedB);
assert.throws(()=>selectP1AZeroPickCounterfactualV0_1([mixedA,mixedB]),/MIXED_GENERATION/);n++;

ordinal=0;
const clockA=row("C1","GENERAL");
const clockB=row("C2","GENERAL",{decisionAt:"2026-10-03T13:19:00+08:00",knownAt:"2026-10-03T13:19:00+08:00"});
clockB.rankingTupleFingerprint=computeZeroPickTupleFingerprintV0_1(clockB);
assert.throws(()=>selectP1AZeroPickCounterfactualV0_1([clockA,clockB]),/MIXED_DECISION_CLOCK/);n++;

ordinal=0;
const dupA=row("DUP","GENERAL");
const dupB=row("DUP","THOUSAND");
assert.throws(()=>selectP1AZeroPickCounterfactualV0_1([dupA,dupB]),/DUPLICATE_SYMBOL/);n++;

ordinal=0;
const ordA=row("O1","GENERAL",{preSortOrdinal:7});
const ordB=row("O2","GENERAL",{preSortOrdinal:7});
ordA.rankingTupleFingerprint=computeZeroPickTupleFingerprintV0_1(ordA);
ordB.rankingTupleFingerprint=computeZeroPickTupleFingerprintV0_1(ordB);
assert.throws(()=>selectP1AZeroPickCounterfactualV0_1([ordA,ordB]),/DUPLICATE_PRE_SORT_ORDINAL/);n++;

console.log(JSON.stringify({
  ok:true,assertions:n,
  comparatorVersion:ZERO_PICK_COMPARATOR_VERSION_V0_1,
  fullTupleRequired:true,
  poolQuota:3,crossPoolTransfer:false,
  allocationAuthorized:false,executionAuthorized:false,
  formalOptimizationCandidate:"NONE",formalCoreImpact:false
}));
