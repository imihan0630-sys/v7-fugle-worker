import assert from "node:assert/strict";
import {classifyShadowSemanticPopulation} from "../research/shadow_semantic_classifier_v0_1.mjs";

const R={priorityScore:80,rewardPerRisk:3,marketConsensusScore:60,setupQuality:70,sectorFlow:55,relativeStrength:4};

function pop(states){
  return classifyShadowSemanticPopulation({scanDate:"2026-09-29",decisionStates:states});
}

// Exact comparator ties WITHOUT preSortOrdinal: observed stable order exists, but replay rank is not certified.
{
  const p=pop([
    {symbol:"9002",pool:"GENERAL",formalOk:true,ranking:{...R}},
    {symbol:"1001",pool:"GENERAL",formalOk:true,ranking:{...R}}
  ]);
  const a=p.rows.find(x=>x.symbol==="9002"),b=p.rows.find(x=>x.symbol==="1001");
  assert.equal(a.observedPoolRank,1);
  assert.equal(b.observedPoolRank,2);
  assert.equal(a.formalPoolRank,null);
  assert.equal(b.formalPoolRank,null);
  assert.equal(a.rankCertification,"TIE_LINEAGE_UNKNOWN");
  assert.equal(b.rankCertification,"TIE_LINEAGE_UNKNOWN");
  // Critical negative control: symbol 1001 must NOT jump ahead merely because it is lexicographically smaller.
  assert.equal(a.observedPoolRank,1);
}

// Reversing input order reverses only the uncertified observed order; it must not create fake exact rank.
{
  const p=pop([
    {symbol:"1001",pool:"GENERAL",formalOk:true,ranking:{...R}},
    {symbol:"9002",pool:"GENERAL",formalOk:true,ranking:{...R}}
  ]);
  assert.equal(p.rows.find(x=>x.symbol==="1001").observedPoolRank,1);
  assert.equal(p.rows.find(x=>x.symbol==="1001").formalPoolRank,null);
  assert.equal(p.counts.rankQuality.TIE_LINEAGE_UNKNOWN,2);
}

// Unique preSortOrdinal certifies exact stable-sort lineage independent of serialized input order.
{
  const p=pop([
    {symbol:"1001",pool:"GENERAL",formalOk:true,preSortOrdinal:9,ranking:{...R}},
    {symbol:"9002",pool:"GENERAL",formalOk:true,preSortOrdinal:3,ranking:{...R}}
  ]);
  const first=p.rows.find(x=>x.symbol==="9002"),second=p.rows.find(x=>x.symbol==="1001");
  assert.equal(first.formalPoolRank,1);
  assert.equal(second.formalPoolRank,2);
  assert.equal(first.rankCertification,"CERTIFIED");
  assert.equal(second.rankCertification,"CERTIFIED");
}

// Duplicate ordinals do not certify a tie.
{
  const p=pop([
    {symbol:"1001",pool:"GENERAL",formalOk:true,preSortOrdinal:2,ranking:{...R}},
    {symbol:"1002",pool:"GENERAL",formalOk:true,preSortOrdinal:2,ranking:{...R}}
  ]);
  assert.equal(p.rows.find(x=>x.symbol==="1001").formalPoolRank,null);
  assert.equal(p.counts.rankQuality.TIE_LINEAGE_UNKNOWN,2);
}

// Non-tied rows remain certified even without preSortOrdinal.
{
  const p=pop([
    {symbol:"1001",pool:"GENERAL",formalOk:true,ranking:{...R,priorityScore:81}},
    {symbol:"1002",pool:"GENERAL",formalOk:true,ranking:{...R,priorityScore:80}}
  ]);
  assert.equal(p.rows.find(x=>x.symbol==="1001").formalPoolRank,1);
  assert.equal(p.rows.find(x=>x.symbol==="1002").formalPoolRank,2);
  assert.equal(p.counts.rankQuality.CERTIFIED,2);
}

// Missing comparator inputs fail closed even when ordering happens to be unique.
{
  const bad={...R};
  delete bad.relativeStrength;
  const p=pop([
    {symbol:"1001",pool:"GENERAL",formalOk:true,ranking:{...R,priorityScore:81}},
    {symbol:"1002",pool:"GENERAL",formalOk:true,ranking:bad}
  ]);
  assert.equal(p.rows.find(x=>x.symbol==="1002").formalPoolRank,null);
  assert.equal(p.rows.find(x=>x.symbol==="1002").rankCertification,"RANKING_INPUT_INCOMPLETE");
}

console.log(JSON.stringify({
  ok:true,
  symbolFallbackRemoved:true,
  exactTieRequiresPreSortOrdinal:true,
  missingComparatorFailsClosed:true,
  nonTieBackwardCompatible:true,
  formalCoreImpact:false
},null,2));
