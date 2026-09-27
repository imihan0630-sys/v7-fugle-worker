import assert from "node:assert/strict";
import {classifyInstitutionalScoreSnapshot,summarizeInstitutionalCoverage} from "./institutional_score_prospective_coverage_observer_v0_1.mjs";

function snapshot(){
  return {
    sourceCompleteness:"FULL_FORMAL_SCAN",scanDate:"2026-09-29",symbol:"2330",
    institution:{
      score:50.51,
      foreignBuyDays:1,trustBuyDays:1,dealerBuyDays:1,
      foreignNet:100,trustNet:100,dealerNet:100,
      institutionTotalNet:300,
      chipConcentration:50
    },
    volume:{avgVolume20Lots:1000}
  };
}

// Score is reproducible, but persisted buy-day zeros/values do not carry raw streak readiness.
{
  const x=classifyInstitutionalScoreSnapshot({snapshot:snapshot()});
  assert.equal(x.formalReproducible,true);
  assert.equal(x.state,"FORMAL_REPRODUCIBLE_BUT_STREAK_PROVENANCE_UNCERTIFIED");
  assert.equal(x.metrics,null);
}

// Same-generation readiness + 3 institution history days upgrades to CLEAN.
{
  const x=classifyInstitutionalScoreSnapshot({
    snapshot:snapshot(),
    streakEvidence:{sameGeneration:true,ready:true,institutionHistoryDays:3}
  });
  assert.equal(x.state,"CLEAN");
  assert.equal(x.metrics.scoreSaturated100,false);
}

// Missing raw current net remains source-incomplete even if deployed fallback can reproduce a stored score.
{
  const s=snapshot();
  s.institution.foreignNet=null;
  s.institution.score=35.51;
  const x=classifyInstitutionalScoreSnapshot({
    snapshot:s,
    streakEvidence:{sameGeneration:true,ready:true,institutionHistoryDays:3}
  });
  assert.equal(x.formalReproducible,true);
  assert.equal(x.state,"FORMAL_REPRODUCIBLE_BUT_SOURCE_INCOMPLETE");
}

// Score mismatch is provenance/schema conflict, not an economic observation.
{
  const s=snapshot(); s.institution.score=99;
  const x=classifyInstitutionalScoreSnapshot({
    snapshot:s,
    streakEvidence:{sameGeneration:true,ready:true,institutionHistoryDays:3}
  });
  assert.equal(x.state,"SCORE_MISMATCH");
}

// Non-FULL parent fails closed.
{
  const s=snapshot(); s.sourceCompleteness="RECONSTRUCTED_PRICE_ONLY";
  const x=classifyInstitutionalScoreSnapshot({snapshot:s});
  assert.equal(x.state,"UNKNOWN_PARENT");
}

{
  const clean={snapshot:snapshot(),streakEvidence:{sameGeneration:true,ready:true,institutionHistoryDays:3}};
  const uncertain={snapshot:snapshot()};
  const out=summarizeInstitutionalCoverage([clean,uncertain]);
  assert.equal(out.byDate["2026-09-29"].eligibleRows,2);
  assert.equal(out.byDate["2026-09-29"].cleanRows,1);
  assert.equal(out.byDate["2026-09-29"].streakProvenanceUncertifiedRows,1);
}

console.log(JSON.stringify({
  ok:true,
  snapshotAloneCannotSelfCertifyStreakSource:true,
  cleanRequiresSameGenerationReadiness:true,
  outcomesUsed:false
},null,2));
