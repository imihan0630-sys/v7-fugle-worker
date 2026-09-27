function finite(v){
  if(v===null||v===undefined||v==="") return null;
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export function classifyInstitutionalActorTotal(row={}){
  const foreignNet=finite(row.foreignNet);
  const trustNet=finite(row.trustNet);
  const dealerNet=finite(row.dealerNet);
  const totalNet=finite(row.institutionTotalNet);
  const avgLots=finite(row.avgVolume20Lots);

  if([foreignNet,trustNet,dealerNet,totalNet,avgLots].some(v=>v===null)||!(avgLots>0)){
    return {
      state:"UNKNOWN_INCOMPLETE_INPUT",
      reason:!(avgLots>0)?"AVG_VOLUME20_NOT_POSITIVE":"ACTOR_OR_TOTAL_NET_MISSING"
    };
  }

  const actorSum=foreignNet+trustNet+dealerNet;
  if(Math.abs(actorSum-totalNet)>1e-9){
    return {
      state:"INVARIANT_VIOLATION",
      reason:"ACTOR_SUM_NE_INSTITUTION_TOTAL",
      foreignNet,trustNet,dealerNet,totalNet,actorSum
    };
  }

  const actorSigns=[foreignNet,trustNet,dealerNet].map(v=>v>0?"POS":v<0?"NEG":"ZERO");
  const positiveCount=actorSigns.filter(x=>x==="POS").length;
  const negativeCount=actorSigns.filter(x=>x==="NEG").length;
  const zeroCount=3-positiveCount-negativeCount;
  const currentBuy=positiveCount>0;
  const aligned=positiveCount===3;
  const advShares=avgLots*1000;
  const rawNetRatio=totalNet/advShares;
  const nonnegativeNetRatio=Math.max(0,rawNetRatio);
  const clippedNetRatio=clamp(nonnegativeNetRatio,0,1);
  const aggregateNetIntensity=clippedNetRatio*25;

  let conflictClass;
  if(aligned) conflictClass="ALL_POSITIVE_ALIGNED";
  else if(!currentBuy) conflictClass=totalNet<0?"NO_POSITIVE_TOTAL_NEGATIVE":"NO_POSITIVE_TOTAL_ZERO";
  else if(totalNet>0) conflictClass="MIXED_ACTORS_TOTAL_POSITIVE";
  else if(totalNet<0) conflictClass="MIXED_ACTORS_TOTAL_NEGATIVE";
  else conflictClass="MIXED_ACTORS_TOTAL_ZERO";

  const currentDirectionBonus=(aligned?15:0)+(currentBuy?6:0);

  return {
    state:"CLEAN",
    conflictClass,
    actorSigns:{foreign:actorSigns[0],trust:actorSigns[1],dealer:actorSigns[2]},
    counts:{positive:positiveCount,negative:negativeCount,zero:zeroCount},
    currentBuy,aligned,
    totals:{foreignNet,trustNet,dealerNet,totalNet,actorSum,avgVolume20Lots:avgLots,advShares},
    aggregate:{
      rawNetRatio,
      nonnegativeNetRatio,
      clippedNetRatio,
      aggregateNetIntensity,
      lowerClipped:rawNetRatio<=0,
      upperClipped:rawNetRatio>=1,
      negativeMagnitudeAdv:rawNetRatio<0?-rawNetRatio:0,
      positiveExcessAdv:rawNetRatio>1?rawNetRatio-1:0
    },
    interaction:{
      currentDirectionBonus,
      anyPositiveBonus:currentBuy?6:0,
      allPositiveBonus:aligned?15:0,
      mixedPositiveDespiteNonpositiveTotal:currentBuy&&!aligned&&totalNet<=0
    },
    guards:{
      aggregateIntensityIsMagnitudeAfterSignClipping:true,
      currentBuyIsActorSignInformation:true,
      allPositiveAlignmentIsActorConsensusInformation:true,
      negativeTotalMagnitudeDoesNotReduceFormalScore:true,
      ratioAboveOneDoesNotIncreaseFormalScore:true,
      noOutcomeUse:true,
      formalCoreChanged:false
    }
  };
}

export function summarizeInstitutionalActorTotal({
  rows=[],
  completeCleanParent=false
}={}){
  if(completeCleanParent!==true){
    return {
      schemaVersion:"institutional-actor-total-conflict-observer-v0.1",
      state:"UNKNOWN_INCOMPLETE_PARENT",
      byDate:null,
      researchOnly:true
    };
  }
  const analyzed=(Array.isArray(rows)?rows:[]).map(row=>({
    scanDate:String(row?.scanDate||""),
    symbol:String(row?.symbol||""),
    analysis:classifyInstitutionalActorTotal(row)
  }));
  const byDate={};
  for(const item of analyzed){
    const d=byDate[item.scanDate||"UNKNOWN"] ||= {
      rows:0,cleanRows:0,unknownRows:0,invariantViolationRows:0,
      classCounts:{},
      lowerClippedRows:0,upperClippedRows:0,
      mixedPositiveDespiteNonpositiveTotalRows:0,
      totalNegativeMagnitudeAdv:0,totalPositiveExcessAdv:0
    };
    d.rows+=1;
    const a=item.analysis;
    if(a.state==="CLEAN"){
      d.cleanRows+=1;
      d.classCounts[a.conflictClass]=(d.classCounts[a.conflictClass]||0)+1;
      if(a.aggregate.lowerClipped)d.lowerClippedRows+=1;
      if(a.aggregate.upperClipped)d.upperClippedRows+=1;
      if(a.interaction.mixedPositiveDespiteNonpositiveTotal)d.mixedPositiveDespiteNonpositiveTotalRows+=1;
      d.totalNegativeMagnitudeAdv+=a.aggregate.negativeMagnitudeAdv;
      d.totalPositiveExcessAdv+=a.aggregate.positiveExcessAdv;
    }else if(a.state==="UNKNOWN_INCOMPLETE_INPUT") d.unknownRows+=1;
    else if(a.state==="INVARIANT_VIOLATION") d.invariantViolationRows+=1;
  }
  return {
    schemaVersion:"institutional-actor-total-conflict-observer-v0.1",
    state:"COMPLETE_PARENT_ANALYZED",
    rows:analyzed,
    byDate,
    interpretation:{
      lowerClip:"all institutionTotalNet<=0 receive zero aggregate-intensity points regardless of sell magnitude",
      upperClip:"all institutionTotalNet>=1*ADV receive the same 25 aggregate-intensity points",
      actorConflict:"any positive actor can still create currentBuy bonus when aggregate total is zero/negative",
      noEconomicDirectionClaimed:true
    },
    guards:{unitOfIndependence:"scanDate",noOutcomeUse:true,formalCoreChanged:false},
    researchOnly:true
  };
}
