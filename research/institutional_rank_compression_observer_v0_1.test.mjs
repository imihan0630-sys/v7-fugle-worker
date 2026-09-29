import assert from "node:assert/strict";
import {
  decomposeInstitutionalOverlap,
  summarizeInstitutionalRankCompression,
  enumerateInstitutionalStreakGeometry
} from "./institutional_rank_compression_observer_v0_1.mjs";

const base={
  scanDate:"2026-09-29",symbol:"1001",
  foreignNet:100,trustNet:100,dealerNet:100,
  institutionTotalNet:0,avgVolume20Lots:1000,chipConcentration:0
};

// One current positive session: 22 first-day streak points + 21 nonlinear current-direction points.
{
  const x=decomposeInstitutionalOverlap({...base,foreignBuyDays:1,trustBuyDays:1,dealerBuyDays:1});
  assert.equal(x.state,"CLEAN");
  assert.equal(x.components.currentDayDirectionBase,22);
  assert.equal(x.components.persistenceBeyondDay1,0);
  assert.equal(x.components.nonlinearCurrentDirectionBonus,21);
  assert.equal(x.components.sameSessionDirectionPoints,43);
  assert.equal(x.preClamp,43);
}

// Three-session persistence adds 44 points beyond the first day; current-day direction stays 43.
{
  const x=decomposeInstitutionalOverlap({...base,foreignBuyDays:3,trustBuyDays:3,dealerBuyDays:3});
  assert.equal(x.components.currentDayDirectionBase,22);
  assert.equal(x.components.persistenceBeyondDay1,44);
  assert.equal(x.components.nonlinearCurrentDirectionBonus,21);
  assert.equal(x.preClamp,87);
}

// Ownership remains a separate semantic component.
{
  const x=decomposeInstitutionalOverlap({
    ...base,foreignBuyDays:1,trustBuyDays:1,dealerBuyDays:1,chipConcentration:100
  });
  assert.equal(x.components.ownershipConcentration,15);
  assert.equal(x.preClamp,58);
}

// Ready-history invariant: current positive signs and streak endpoint must agree.
{
  const x=decomposeInstitutionalOverlap({
    ...base,foreignBuyDays:0,trustBuyDays:0,dealerBuyDays:0
  });
  assert.equal(x.state,"INVARIANT_VIOLATION");
  assert.equal(x.reason,"ACTOR_STREAK_CURRENT_SIGN_MISMATCH");
}

// Two different pre-clamp strengths can be flattened to the same formal institutionalScore=100.
{
  const a={
    ...base,symbol:"1001",foreignBuyDays:3,trustBuyDays:3,dealerBuyDays:3,
    institutionTotalNet:500000,chipConcentration:50
  };
  const b={
    ...base,symbol:"1002",foreignBuyDays:3,trustBuyDays:3,dealerBuyDays:3,
    institutionTotalNet:1000000,chipConcentration:100
  };
  const out=summarizeInstitutionalRankCompression({rows:[a,b],completeCleanParent:true});
  const d=out.byDate["2026-09-29"];
  assert.equal(d.cleanRows,2);
  assert.equal(d.saturatedRows,2);
  assert.equal(d.uniqueFormalInstitutionalScores,1);
  assert.equal(d.flattenedDistinctPreClampPairs,1);
  assert.ok(d.totalLostHeadroom>0);
  assert.equal(out.interpretation.finalFormalRankCompressionClaimed,false);
}

// Incomplete parent fails closed.
{
  const out=summarizeInstitutionalRankCompression({rows:[],completeCleanParent:false});
  assert.equal(out.state,"UNKNOWN_INCOMPLETE_PARENT");
  assert.equal(out.byDate,null);
}

{
  const g=enumerateInstitutionalStreakGeometry();
  assert.equal(g.stateCount,64);
  assert.equal(g.uniqueScoreCount,41);
  assert.equal(g.maxStreakInteractionPoints,87);
  assert.equal(g.statesAtOrAbove70,9);
  assert.deepEqual(g.scoresAtOrAbove70,[71,73,75,77,79,83,87]);
  assert.ok(g.collisionScoreCount>0);
  assert.equal(g.interpretation.prevalenceClaimed,false);
}


console.log(JSON.stringify({
  ok:true,
  currentDayVsPersistenceSeparated:true,
  nonlinearDirectionOverlapMeasured:true,
  ownershipSeparated:true,
  saturationPairFlatteningMeasured:true,
  streakStateSpaceFrozen:true,
  outcomesUsed:false
},null,2));
