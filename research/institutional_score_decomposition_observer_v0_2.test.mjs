import assert from "node:assert/strict";
import {
  decomposeInstitutionalScoreV2,
  decomposeInstitutionalScoreFromSnapshot
} from "./institutional_score_decomposition_observer_v0_2.mjs";

// Exact Formal interactions use current-day net signs, not streak-day positivity.
{
  const x=decomposeInstitutionalScoreV2({
    foreignBuyDays:0,trustBuyDays:0,dealerBuyDays:0,
    foreignNet:100,trustNet:100,dealerNet:100,
    institutionsAligned:true,
    institutionTotalNet:300,
    avgVolume20Lots:1000,
    chipConcentration:0
  });
  assert.equal(x.streakLinear,0);
  assert.equal(x.consensusInteraction,21);
  assert.equal(x.formal.currentBuy,true);
  assert.equal(x.formal.institutionsAligned,true);
}

// Positive historical streaks do not independently authorize current-day interaction points.
{
  const x=decomposeInstitutionalScoreV2({
    foreignBuyDays:3,trustBuyDays:3,dealerBuyDays:3,
    foreignNet:-100,trustNet:-100,dealerNet:-100,
    institutionsAligned:false,
    institutionTotalNet:-300,
    avgVolume20Lots:1000,
    chipConcentration:0
  });
  assert.equal(x.streakLinear,66);
  assert.equal(x.consensusInteraction,0);
  assert.equal(x.score,66);
}

// Current FULL_FORMAL_SCAN producer defines institutionsAligned from the three current nets;
// snapshot helper mirrors that producer contract.
{
  const x=decomposeInstitutionalScoreFromSnapshot({
    institution:{
      foreignBuyDays:1,trustBuyDays:1,dealerBuyDays:1,
      foreignNet:50,trustNet:60,dealerNet:70,
      institutionTotalNet:180,chipConcentration:20
    },
    volume:{avgVolume20Lots:1000}
  });
  assert.equal(x.formal.institutionsAligned,true);
  assert.equal(x.formal.currentBuy,true);
  assert.equal(x.consensusInteraction,21);
}

console.log(JSON.stringify({
  ok:true,
  formalInteractionsUseCurrentNets:true,
  streakInteractionSubstitutionRejected:true
},null,2));
