function finite(v){
  if(v===null||v===undefined||v==="") return null;
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const actorWeights={foreign:8,trust:10,dealer:4};

function cleanDays(v){
  const n=finite(v);
  return n!==null && Number.isInteger(n) && n>=0 && n<=3 ? n : null;
}

export function decomposeInstitutionalOverlap(row={}){
  const foreignDays=cleanDays(row.foreignBuyDays);
  const trustDays=cleanDays(row.trustBuyDays);
  const dealerDays=cleanDays(row.dealerBuyDays);
  const foreignNet=finite(row.foreignNet);
  const trustNet=finite(row.trustNet);
  const dealerNet=finite(row.dealerNet);
  const totalNet=finite(row.institutionTotalNet);
  const avgLots=finite(row.avgVolume20Lots);
  const concentration=finite(row.chipConcentration);

  const required=[foreignDays,trustDays,dealerDays,foreignNet,trustNet,dealerNet,totalNet,avgLots,concentration];
  if(required.some(v=>v===null) || !(avgLots>0)){
    return {state:"UNKNOWN_INCOMPLETE_INPUT"};
  }

  const currentBuy=foreignNet>0||trustNet>0||dealerNet>0;
  const aligned=foreignNet>0&&trustNet>0&&dealerNet>0;
  const streakCurrentBuy=foreignDays>0||trustDays>0||dealerDays>0;
  const streakAligned=foreignDays>0&&trustDays>0&&dealerDays>0;
  if(currentBuy!==streakCurrentBuy || aligned!==streakAligned){
    return {
      state:"INVARIANT_VIOLATION",
      reason:"ACTOR_STREAK_CURRENT_SIGN_MISMATCH",
      currentBuy,aligned,streakCurrentBuy,streakAligned
    };
  }

  const currentDayDirectionBase=
    (foreignDays>0?actorWeights.foreign:0)+
    (trustDays>0?actorWeights.trust:0)+
    (dealerDays>0?actorWeights.dealer:0);

  const persistenceBeyondDay1=
    Math.max(0,foreignDays-1)*actorWeights.foreign+
    Math.max(0,trustDays-1)*actorWeights.trust+
    Math.max(0,dealerDays-1)*actorWeights.dealer;

  const nonlinearCurrentDirectionBonus=(aligned?15:0)+(currentBuy?6:0);
  const aggregateNetIntensity=clamp((totalNet/(avgLots*1000))*25,0,25);
  const ownershipConcentration=0.15*concentration;

  const streakLinear=currentDayDirectionBase+persistenceBeyondDay1;
  const preClamp=streakLinear+nonlinearCurrentDirectionBonus+aggregateNetIntensity+ownershipConcentration;
  const formalScore=clamp(preClamp,0,100);
  const saturationLostHeadroom=Math.max(0,preClamp-100);
  const sameSessionDirectionPoints=currentDayDirectionBase+nonlinearCurrentDirectionBonus;

  return {
    state:"CLEAN",
    inputs:{foreignDays,trustDays,dealerDays,foreignNet,trustNet,dealerNet,totalNet,avgLots,concentration},
    components:{
      currentDayDirectionBase,
      persistenceBeyondDay1,
      nonlinearCurrentDirectionBonus,
      aggregateNetIntensity,
      ownershipConcentration,
      streakLinear,
      sameSessionDirectionPoints
    },
    preClamp,
    formalScore,
    formalPriorityContribution:formalScore*0.16,
    saturation:{
      saturated:preClamp>=100,
      lostHeadroom:saturationLostHeadroom,
      lostInstitutionalPriorityContribution:saturationLostHeadroom*0.16
    },
    shares:preClamp>0?{
      currentDayDirectionBase:currentDayDirectionBase/preClamp,
      persistenceBeyondDay1:persistenceBeyondDay1/preClamp,
      nonlinearCurrentDirectionBonus:nonlinearCurrentDirectionBonus/preClamp,
      sameSessionDirectionPoints:sameSessionDirectionPoints/preClamp,
      aggregateNetIntensity:aggregateNetIntensity/preClamp,
      ownershipConcentration:ownershipConcentration/preClamp
    }:null,
    guards:{
      sameSessionDirectionPointsAreNotIndependentEvidence:true,
      persistenceBeyondDay1IsTheOnlyStreakPointsBeyondCurrentSession:true,
      ownershipConcentrationIsNotInstitutionIdentity:true,
      uncappedHeadroomIsDiagnosticOnly:true
    }
  };
}

function pairCountWithDifferentPreClamp(rows){
  let count=0;
  for(let i=0;i<rows.length;i++){
    for(let j=i+1;j<rows.length;j++){
      if(Math.abs(rows[i].preClamp-rows[j].preClamp)>1e-12) count+=1;
    }
  }
  return count;
}

export function summarizeInstitutionalRankCompression({
  rows=[],
  completeCleanParent=false
}={}){
  if(completeCleanParent!==true){
    return {
      schemaVersion:"institutional-rank-compression-observer-v0.1",
      state:"UNKNOWN_INCOMPLETE_PARENT",
      byDate:null,
      fullPopulationPrevalenceIdentifiable:false,
      researchOnly:true
    };
  }

  const enriched=(Array.isArray(rows)?rows:[]).map(row=>({
    scanDate:String(row?.scanDate||""),
    symbol:String(row?.symbol||""),
    analysis:decomposeInstitutionalOverlap(row)
  }));

  const byDate={};
  for(const item of enriched){
    const date=item.scanDate||"UNKNOWN";
    const bucket=byDate[date] ||= {items:[]};
    bucket.items.push(item);
  }

  for(const [date,bucket] of Object.entries(byDate)){
    const clean=bucket.items.filter(x=>x.analysis.state==="CLEAN");
    const unknown=bucket.items.filter(x=>x.analysis.state==="UNKNOWN_INCOMPLETE_INPUT");
    const invariant=bucket.items.filter(x=>x.analysis.state==="INVARIANT_VIOLATION");
    const saturated=clean.filter(x=>x.analysis.saturation.saturated);
    const scoreGroups=new Map();
    for(const x of clean){
      const key=String(x.analysis.formalScore);
      const arr=scoreGroups.get(key)||[];
      arr.push(x);
      scoreGroups.set(key,arr);
    }
    const tiedGroups=[...scoreGroups.values()].filter(x=>x.length>1);

    bucket.summary={
      scanDate:date,
      rows:bucket.items.length,
      cleanRows:clean.length,
      unknownRows:unknown.length,
      invariantViolationRows:invariant.length,
      saturatedRows:saturated.length,
      saturationRate:clean.length?saturated.length/clean.length:null,
      totalLostHeadroom:saturated.reduce((s,x)=>s+x.analysis.saturation.lostHeadroom,0),
      maxLostHeadroom:saturated.length?Math.max(...saturated.map(x=>x.analysis.saturation.lostHeadroom)):0,
      saturatedDistinctPreClampCount:new Set(saturated.map(x=>x.analysis.preClamp.toFixed(12))).size,
      flattenedDistinctPreClampPairs:pairCountWithDifferentPreClamp(saturated.map(x=>x.analysis)),
      uniqueFormalInstitutionalScores:scoreGroups.size,
      tiedFormalScoreGroups:tiedGroups.length,
      maxFormalScoreTieSize:tiedGroups.length?Math.max(...tiedGroups.map(x=>x.length)):1,
      sameSessionDirectionPointsTotal:clean.reduce((s,x)=>s+x.analysis.components.sameSessionDirectionPoints,0),
      persistenceBeyondDay1PointsTotal:clean.reduce((s,x)=>s+x.analysis.components.persistenceBeyondDay1,0),
      ownershipConcentrationPointsTotal:clean.reduce((s,x)=>s+x.analysis.components.ownershipConcentration,0)
    };
  }

  return {
    schemaVersion:"institutional-rank-compression-observer-v0.1",
    state:"COMPLETE_PARENT_ANALYZED",
    rows:enriched,
    byDate:Object.fromEntries(Object.entries(byDate).map(([d,b])=>[d,b.summary])),
    interpretation:{
      rankCompressionScope:"INSTITUTIONAL_COMPONENT_ONLY",
      finalFormalRankCompressionClaimed:false,
      reason:"Overall Formal order also depends on post-consensus PriorityScore and lexicographic RR/consensus/setup/sector/RS fields.",
      noOutcomeUse:true
    },
    researchOnly:true,
    formalCoreImpact:false
  };
}
