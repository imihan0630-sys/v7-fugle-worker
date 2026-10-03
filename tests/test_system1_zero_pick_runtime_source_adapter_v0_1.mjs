import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {buildSystem1ZeroPickObserverSourceFromRuntime} from "../research/system1_zero_pick_runtime_source_adapter_v0_1.mjs";
import {buildSystem1ZeroPickRankObservation} from "../research/system1_zero_pick_rank_input_observer_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};
const hash=s=>createHash("sha256").update(s).digest("hex");

const base={
  scanDate:"2026-10-05",
  symbol:"2330",
  pool:"THOUSAND",
  captureGeneration:"C1:2026-10-05:g1",
  decisionAt:"2026-10-05T16:00:00+08:00",
  preSortOrdinal:0,
  feature:{ret20:12,marketReturn20:5},
  sector:{score:68},
  derived:{rewardPerRisk:2.4,setupQuality:78,institutionalScore:62,fundamentalScore:55},
  consensusReference:{
    marketDate:"2026-10-05",
    updatedAt:"2026-10-05T15:50:00+08:00",
    bySymbol:{"2330":{sourceCount:3}}
  }
};

const source=buildSystem1ZeroPickObserverSourceFromRuntime(base);
eq(source.sourceKnownAt.feature,base.decisionAt);
eq(source.sourceKnownAt.sector,base.decisionAt);
eq(source.sourceKnownAt.consensus,base.decisionAt);
eq(source.sourceKnownAtProvenance.notSourceEventTime,true);
eq(source.sourceEventAt.featureSourceEventAt,null);
eq(source.sourceEventAt.sectorSourceEventAt,null);
eq(source.sourceEventAt.consensusReferenceUpdatedAt,"2026-10-05T15:50:00+08:00");
eq(source.marketConsensusState,"EXACT_DATE_REFERENCE");
eq(source.marketConsensusReferenceDate,"2026-10-05");
eq(source.observed.marketConsensusSourceCount,3);
eq(source.runtimeProvenance.newProviderCalls,0);
eq(source.runtimeProvenance.actualFormalRank,false);

const obs=buildSystem1ZeroPickRankObservation(source,hash);
eq(obs.rankInputStatus,"COMPLETE");
eq(obs.rankInput.marketConsensusScore,65);
eq(obs.rankInput.decomposition.marketConsensusBonus,4);
eq(obs.rankInput.rankingTupleKnownAt,base.decisionAt);
eq(obs.rankInput.rankingTupleProvenance,"COUNTERFACTUAL_SAME_SCAN_FORMULA_NOT_ACTUAL_FORMAL_RANK");

const wrongDate=buildSystem1ZeroPickObserverSourceFromRuntime({
  ...base,
  consensusReference:{
    marketDate:"2026-10-04",
    updatedAt:"2026-10-04T16:00:00+08:00",
    bySymbol:{"2330":{sourceCount:99}}
  }
});
eq(wrongDate.marketConsensusState,"ABSENT_OR_WRONG_DATE_AT_DECISION");
eq(wrongDate.marketConsensusReferenceDate,null);
eq(wrongDate.consensusObservedReferenceDate,"2026-10-04");
eq(wrongDate.observed.marketConsensusSourceCount,0);

const absentSymbol=buildSystem1ZeroPickObserverSourceFromRuntime({
  ...base,
  consensusReference:{marketDate:"2026-10-05",updatedAt:"2026-10-05T15:50:00+08:00",bySymbol:{}}
});
eq(absentSymbol.marketConsensusState,"EXACT_DATE_REFERENCE");
eq(absentSymbol.observed.marketConsensusSourceCount,0);

const incomplete=buildSystem1ZeroPickObserverSourceFromRuntime({
  ...base,
  derived:{...base.derived,rewardPerRisk:null}
});
const incompleteObs=buildSystem1ZeroPickRankObservation(incomplete,hash);
eq(incompleteObs.rankInputStatus,"INCOMPLETE");
ok(incompleteObs.missingFields.includes("rewardPerRisk"));

assert.throws(()=>buildSystem1ZeroPickObserverSourceFromRuntime({
  ...base,
  consensusReference:{...base.consensusReference,updatedAt:"2026-10-05T16:00:01+08:00"}
}),/CONSENSUS_UPDATED_AFTER_DECISION/);n++;

assert.throws(()=>buildSystem1ZeroPickObserverSourceFromRuntime({
  ...base,
  consensusReference:{...base.consensusReference,updatedAt:"not-a-time"}
}),/INVALID_consensusReference.updatedAt/);n++;

assert.throws(()=>buildSystem1ZeroPickObserverSourceFromRuntime({...base,feature:null}),/FEATURE_ROW_REQUIRED/);n++;
assert.throws(()=>buildSystem1ZeroPickObserverSourceFromRuntime({...base,sector:null}),/SECTOR_STATE_REQUIRED/);n++;
assert.throws(()=>buildSystem1ZeroPickObserverSourceFromRuntime({...base,derived:null}),/DERIVED_STATE_REQUIRED/);n++;

console.log(JSON.stringify({
  ok:true,assertions:n,
  knownAtIsRequestLocalUpperBound:true,
  sourceEventTimeNotFabricated:true,
  wrongDateConsensusIgnored:true,
  futureConsensusRejected:true,
  zeroProviderCalls:true,
  formalCoreImpact:false
}));
