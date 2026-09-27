function toNumberLike(v){
  if(v===null||v===undefined||v===""||v==="--") return null;
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export function decomposeInstitutionalScoreV2(row={}){
  const foreignDays=toNumberLike(row.foreignBuyDays ?? row["外資連買天數"]);
  const trustDays=toNumberLike(row.trustBuyDays ?? row["投信連買天數"]);
  const dealerDays=toNumberLike(row.dealerBuyDays);

  const foreignNet=toNumberLike(row.foreignNet);
  const trustNet=toNumberLike(row.trustNet);
  const dealerNet=toNumberLike(row.dealerNet);
  const institutionTotalNet=toNumberLike(row.institutionTotalNet);
  const avgVolume20Lots=toNumberLike(row.avgVolume20Lots);
  const chipConcentration=toNumberLike(row.chipConcentration ?? row["籌碼集中分數"]);

  const formalForeignDays=foreignDays??0;
  const formalTrustDays=trustDays??0;
  const formalDealerDays=dealerDays??0;
  const formalAligned=row.institutionsAligned===true || row["三大法人同步"]===true;
  const formalCurrentBuy=(foreignNet??0)>0 || (trustNet??0)>0 || (dealerNet??0)>0;
  const formalConcentration=chipConcentration??0;
  const avgVolumeShares=Math.max(1,(avgVolume20Lots??0)*1000);
  const formalNetRatio=Math.max(0,(institutionTotalNet??0)/avgVolumeShares);

  const streakLinear=8*formalForeignDays+10*formalTrustDays+4*formalDealerDays;
  const consensusInteraction=(formalAligned?15:0)+(formalCurrentBuy?6:0);
  const aggregateNetIntensity=clamp(formalNetRatio*25,0,25);
  const largeHolderConcentration=0.15*formalConcentration;
  const preClamp=streakLinear+consensusInteraction+aggregateNetIntensity+largeHolderConcentration;
  const score=clamp(preClamp,0,100);

  return {
    schemaVersion:"institutional-score-decomposition-v0.2",
    score,preClamp,streakLinear,consensusInteraction,aggregateNetIntensity,largeHolderConcentration,
    formal:{
      foreignBuyDays:formalForeignDays,trustBuyDays:formalTrustDays,dealerBuyDays:formalDealerDays,
      institutionsAligned:formalAligned,currentBuy:formalCurrentBuy,
      institutionTotalNet:institutionTotalNet??0,avgVolumeShares,chipConcentration:formalConcentration
    },
    evidence:{
      foreignBuyDaysObserved:foreignDays!==null,
      trustBuyDaysObserved:trustDays!==null,
      dealerBuyDaysObserved:dealerDays!==null,
      foreignNetObserved:foreignNet!==null,
      trustNetObserved:trustNet!==null,
      dealerNetObserved:dealerNet!==null,
      institutionTotalNetObserved:institutionTotalNet!==null,
      avgVolume20LotsObserved:avgVolume20Lots!==null,
      avgVolume20LotsPositive:avgVolume20Lots!==null&&avgVolume20Lots>0,
      chipConcentrationObserved:chipConcentration!==null
    },
    diagnostics:{
      scoreSaturated100:preClamp>=100,
      actorSignDivergence:[foreignNet,trustNet,dealerNet].every(v=>v!==null)
        ? ((foreignNet>0)+(trustNet>0)+(dealerNet>0)>0 && !formalAligned)
        : null,
      aggregateNetNegativeButAnyActorPositive:institutionTotalNet!==null &&
        [foreignNet,trustNet,dealerNet].every(v=>v!==null)
        ? institutionTotalNet<0&&formalCurrentBuy
        : null,
      ownershipShareOfPreClamp:preClamp>0?largeHolderConcentration/preClamp:null
    }
  };
}

export function decomposeInstitutionalScoreFromSnapshot(snapshot={}){
  const inst=snapshot?.institution||{};
  const vol=snapshot?.volume||{};
  const nets=[inst.foreignNet,inst.trustNet,inst.dealerNet].map(toNumberLike);
  const producerAligned=nets.every(v=>v!==null)?nets.every(v=>v>0):false;
  return decomposeInstitutionalScoreV2({
    foreignBuyDays:inst.foreignBuyDays,
    trustBuyDays:inst.trustBuyDays,
    dealerBuyDays:inst.dealerBuyDays,
    foreignNet:inst.foreignNet,
    trustNet:inst.trustNet,
    dealerNet:inst.dealerNet,
    institutionTotalNet:inst.institutionTotalNet,
    avgVolume20Lots:vol.avgVolume20Lots,
    chipConcentration:inst.chipConcentration,
    institutionsAligned:producerAligned
  });
}
