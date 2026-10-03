import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {
  buildSystem1ZeroPickRankObservation,
  ZERO_PICK_RANK_OBSERVER_V0_1
} from "../research/system1_zero_pick_rank_input_observer_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};
const hash=s=>createHash("sha256").update(s).digest("hex");

function src(o={}){
  return {
    schemaVersion:"SYSTEM1_ZERO_PICK_RANK_OBSERVER_SOURCE_V0_1",
    scanDate:"2026-10-05",symbol:"2330",pool:"THOUSAND",captureGeneration:"C1:g1",
    decisionAt:"2026-10-05T16:00:00+08:00",preSortOrdinal:7,
    sourceKnownAt:{
      feature:"2026-10-05T15:58:00+08:00",
      sector:"2026-10-05T15:58:30+08:00",
      consensus:"2026-10-05T15:59:00+08:00"
    },
    marketConsensusState:"EXACT_DATE_REFERENCE",
    marketConsensusReferenceDate:"2026-10-05",
    observed:{
      rewardPerRisk:2.5,setupQuality:80,sectorFlow:70,ret20:15,marketReturn20:5,
      institutionalScore:60,fundamentalScore:50,marketConsensusSourceCount:3
    },
    ...o
  };
}

eq(ZERO_PICK_RANK_OBSERVER_V0_1.rankComparatorVersion,"PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30");

const a=buildSystem1ZeroPickRankObservation(src(),hash);
eq(a.rankInputStatus,"COMPLETE");
eq(a.rankInput.relativeStrength,10);
eq(a.rankInput.decomposition.rsComponent,70);
eq(a.rankInput.decomposition.rrComponent,50);
eq(a.rankInput.decomposition.preConsensusPriorityScore,65.6);
eq(a.rankInput.marketConsensusScore,65);
eq(a.rankInput.decomposition.marketConsensusBonus,4);
eq(a.rankInput.postConsensusPriorityScore,69.6);
eq(a.rankInput.rankingTupleKnownAt,"2026-10-05T15:59:00+08:00");
eq(a.rankInput.preSortOrdinal,7);
eq(a.rankInput.rankingTupleProvenance,"COUNTERFACTUAL_SAME_SCAN_FORMULA_NOT_ACTUAL_FORMAL_RANK");
eq(a.actualFormalRank,false);
eq(a.formalCoreImpact,false);
ok(/^[0-9a-f]{64}$/.test(a.rankInput.rankingTupleFingerprint));

const again=buildSystem1ZeroPickRankObservation(src(),hash);
eq(again.rankInput.rankingTupleFingerprint,a.rankInput.rankingTupleFingerprint);

const changed=buildSystem1ZeroPickRankObservation(src({
  observed:{...src().observed,setupQuality:81}
}),hash);
ok(changed.rankInput.rankingTupleFingerprint!==a.rankInput.rankingTupleFingerprint);

const oneSource=buildSystem1ZeroPickRankObservation(src({
  observed:{...src().observed,marketConsensusSourceCount:1}
}),hash);
eq(oneSource.rankInput.marketConsensusScore,0);
eq(oneSource.rankInput.decomposition.marketConsensusBonus,0);

const absent=buildSystem1ZeroPickRankObservation(src({
  marketConsensusState:"ABSENT_OR_WRONG_DATE_AT_DECISION",
  marketConsensusReferenceDate:null,
  observed:{...src().observed,marketConsensusSourceCount:0}
}),hash);
eq(absent.rankInput.marketConsensusScore,0);
eq(absent.rankInput.postConsensusPriorityScore,65.6);

const missing=buildSystem1ZeroPickRankObservation(src({
  observed:{...src().observed,sectorFlow:null}
}),hash);
eq(missing.rankInputStatus,"INCOMPLETE");
eq(missing.rankInput,null);
ok(missing.missingFields.includes("sectorFlow"));

const numericZero=buildSystem1ZeroPickRankObservation(src({
  observed:{...src().observed,fundamentalScore:0}
}),hash);
eq(numericZero.rankInputStatus,"COMPLETE");
eq(numericZero.rankInput.decomposition.fundamentalScore,0);

assert.throws(()=>buildSystem1ZeroPickRankObservation(src({
  sourceKnownAt:{...src().sourceKnownAt,sector:"2026-10-05T16:01:00+08:00"}
}),hash),/NON_PIT_SOURCE_sector/);n++;

assert.throws(()=>buildSystem1ZeroPickRankObservation(src({
  marketConsensusReferenceDate:"2026-10-02"
}),hash),/CONSENSUS_DATE_MISMATCH/);n++;

assert.throws(()=>buildSystem1ZeroPickRankObservation(src({
  marketConsensusState:"ABSENT_OR_WRONG_DATE_AT_DECISION",
  marketConsensusReferenceDate:null,
  observed:{...src().observed,marketConsensusSourceCount:2}
}),hash),/ABSENT_CONSENSUS_REQUIRES_ZERO_SOURCES/);n++;

const noOrdinal=buildSystem1ZeroPickRankObservation(src({preSortOrdinal:null}),hash);
eq(noOrdinal.rankInputStatus,"INCOMPLETE");
ok(noOrdinal.missingFields.includes("preSortOrdinal"));

assert.throws(()=>buildSystem1ZeroPickRankObservation(src({pool:"OTHER"}),hash),/INVALID_pool/);n++;

console.log(JSON.stringify({
  ok:true,assertions:n,pureResearchObserver:true,sameScanPIT:true,noImputation:true,
  actualFormalRank:false,noProviderCalls:true,formalCoreImpact:false
}));
