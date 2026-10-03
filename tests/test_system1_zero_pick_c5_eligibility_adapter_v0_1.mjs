import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {
  extractSystem1P1AF9Eligibility,
  buildSystem1ZeroPickResearchPipelineFromC5
} from "../research/system1_zero_pick_c5_eligibility_adapter_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};
const hash=s=>createHash("sha256").update(s).digest("hex");

function src(symbol,pool,ord,patch={}){
  const base={
    schemaVersion:"SYSTEM1_ZERO_PICK_RANK_OBSERVER_SOURCE_V0_1",
    scanDate:"2026-10-05",symbol,pool,captureGeneration:"C1:g1",
    decisionAt:"2026-10-05T16:00:00+08:00",preSortOrdinal:ord,
    sourceKnownAt:{
      feature:"2026-10-05T15:58:00+08:00",
      sector:"2026-10-05T15:58:30+08:00",
      consensus:"2026-10-05T15:59:00+08:00"
    },
    marketConsensusState:"EXACT_DATE_REFERENCE",
    marketConsensusReferenceDate:"2026-10-05",
    observed:{
      rewardPerRisk:2.5,setupQuality:70,sectorFlow:60,ret20:12,marketReturn20:5,
      institutionalScore:55,fundamentalScore:50,marketConsensusSourceCount:2
    }
  };
  return {...base,...patch,observed:{...base.observed,...(patch.observed||{})}};
}

const symbols=["G1","G2","G3","G4","T1","T2","T3","T4"];
const sources=symbols.map((s,i)=>src(s,s.startsWith("T")?"THOUSAND":"GENERAL",i%4,{
  observed:{setupQuality:90-i}
}));

function c5(rows=symbols.map(s=>({
  symbol:s,sessionDate:"2026-10-05",generationId:"C5:g1",
  p1aBlockSet:["RS_CONTEXT"],reachStage:"F9_RANKABLE"
}))){
  return {
    schemaVersion:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
    sessionDate:"2026-10-05",generationId:"C5:g1",rows,
    researchOnly:true,formalCoreLocked:true,economicSuperiority:"UNKNOWN",
    formalOptimizationCandidate:"NONE"
  };
}

const e=extractSystem1P1AF9Eligibility(c5());
eq(e.eligibleN,8);
eq(e.eligibleSymbols,symbols);
eq(e.outcomeBlind,true);

const out=buildSystem1ZeroPickResearchPipelineFromC5({
  observerSources:sources,c5Diagnostic:c5(),formalSelectedCount:0,hashFn:hash
});
eq(out.pipeline.status,"COUNTERFACTUAL_MEMBERSHIP_FROZEN_RESEARCH_ONLY");
eq(out.pipeline.selection.selectedN,6);
eq(out.pipeline.eligibleN,8);
eq(out.eligibility.eligibleReachStage,"F9_RANKABLE");
eq(out.formalCoreImpact,false);

const mixedRows=[
  ...symbols.slice(0,6).map(s=>({
    symbol:s,sessionDate:"2026-10-05",generationId:"C5:g1",
    p1aBlockSet:["RS_CONTEXT"],reachStage:"F9_RANKABLE"
  })),
  {symbol:"G4",sessionDate:"2026-10-05",generationId:"C5:g1",p1aBlockSet:["RS_CONTEXT"],reachStage:"F4_AB_EVALUABLE"},
  {symbol:"T4",sessionDate:"2026-10-05",generationId:"C5:g1",p1aBlockSet:[],reachStage:"F9_RANKABLE"}
];
const mixed=extractSystem1P1AF9Eligibility(c5(mixedRows));
eq(mixed.eligibleN,6);
eq(mixed.eligibleSymbols.includes("G4"),false);
eq(mixed.eligibleSymbols.includes("T4"),false);

const missingSource=buildSystem1ZeroPickResearchPipelineFromC5({
  observerSources:sources.slice(0,-1),c5Diagnostic:c5(),formalSelectedCount:0,hashFn:hash
});
eq(missingSource.pipeline.status,"BLOCKED_MISSING_ELIGIBLE_SOURCE");
eq(missingSource.pipeline.missingSourceSymbols,["T4"]);

assert.throws(()=>extractSystem1P1AF9Eligibility({
  ...c5(),researchOnly:false
}),/RESEARCH_FIREWALL_REQUIRED/);n++;

assert.throws(()=>extractSystem1P1AF9Eligibility(c5([
  {symbol:"G1",sessionDate:"2026-10-05",generationId:"C5:g1",p1aBlockSet:["RS_CONTEXT"],reachStage:"F9_RANKABLE"},
  {symbol:"G1",sessionDate:"2026-10-05",generationId:"C5:g1",p1aBlockSet:["RS_CONTEXT"],reachStage:"F9_RANKABLE"}
])),/DUPLICATE_SYMBOL/);n++;

assert.throws(()=>extractSystem1P1AF9Eligibility(c5([
  {symbol:"G1",sessionDate:"2026-10-04",generationId:"C5:g1",p1aBlockSet:["RS_CONTEXT"],reachStage:"F9_RANKABLE"}
])),/ROW_DATE_MISMATCH/);n++;

assert.throws(()=>buildSystem1ZeroPickResearchPipelineFromC5({
  observerSources:[src("G1","GENERAL",0,{scanDate:"2026-10-04"})],
  c5Diagnostic:c5([{symbol:"G1",sessionDate:"2026-10-05",generationId:"C5:g1",p1aBlockSet:["RS_CONTEXT"],reachStage:"F9_RANKABLE"}]),
  formalSelectedCount:0,hashFn:hash
}),/OBSERVER_DATE_MISMATCH/);n++;

ok(out.pipeline.noTrade===true&&out.pipeline.noPush===true);
console.log(JSON.stringify({
  ok:true,assertions:n,c5AutoEligibility:true,noManualEligibleInjection:true,
  outcomeBlind:true,formalZeroPickOnly:true,formalCoreImpact:false
}));
