// Class-A structural observer for channel-vs-signal-grade semantics.
// No Worker import, no persistence, no outcomes, no Formal decision impact.

export const SIGNAL_GRADE_A_MIN=80;
export const SIGNAL_GRADE_B_MIN=65;

function clamp(x,lo,hi){return Math.min(hi,Math.max(lo,x));}
function n(v){const x=Number(v);return Number.isFinite(x)?x:null;}

export function setupQualityA({pullbackPct,supportDistancePct,volumeTodayVsPrev5}={}){
  const p=n(pullbackPct),s=n(supportDistancePct),v=n(volumeTodayVsPrev5);
  if([p,s,v].some(x=>x===null)) return null;
  return clamp(70-Math.abs(p-7)*3-s*3+(v<=0.9?12:4),0,100);
}

export function setupQualityB({volumeTodayVsPrev5,dailyClosePosition,dailyUpperShadowRatio}={}){
  const v=n(volumeTodayVsPrev5),c=n(dailyClosePosition),u=n(dailyUpperShadowRatio);
  if([v,c,u].some(x=>x===null)) return null;
  return clamp(55+Math.min(25,v*8)+c*20-u*25,0,100);
}

export function signalGrade(setupQuality){
  const q=n(setupQuality);
  if(q===null) return "UNKNOWN";
  return q>=SIGNAL_GRADE_A_MIN?"A":q>=SIGNAL_GRADE_B_MIN?"B":"C";
}

export function observeSignalGrade({strategyChannel,metrics,channelPass=true}={}){
  const channel=String(strategyChannel||"");
  if(channel!=="A"&&channel!=="B") return {
    status:"UNKNOWN",reason:"STRATEGY_CHANNEL_UNKNOWN",
    researchOnly:true,decisionImpact:false
  };
  const setupQuality=channel==="A"?setupQualityA(metrics):setupQualityB(metrics);
  if(setupQuality===null) return {
    status:"UNKNOWN",reason:"SETUP_INPUT_MISSING",strategyChannel:channel,
    researchOnly:true,decisionImpact:false
  };
  const grade=signalGrade(setupQuality);
  return {
    status:"OBSERVED",
    researchOnly:true,decisionImpact:false,
    strategyChannel:channel,
    channelPass:channelPass===true,
    setupQuality,
    signalGrade:grade,
    finalGradeReject:channelPass===true&&grade==="C",
    semantics:"STRATEGY_CHANNEL_AND_SIGNAL_GRADE_ARE_DISTINCT_LABELS"
  };
}

export function structuralBounds(){
  const bMin=setupQualityB({
    volumeTodayVsPrev5:1.3,
    dailyClosePosition:0.65,
    dailyUpperShadowRatio:0.35
  });
  const bMax=setupQualityB({
    volumeTodayVsPrev5:100,
    dailyClosePosition:1,
    dailyUpperShadowRatio:0
  });
  const aWitnessMin=setupQualityA({
    pullbackPct:15,
    supportDistancePct:4,
    volumeTodayVsPrev5:2
  });
  const aBestLooseVolume=setupQualityA({
    pullbackPct:7,
    supportDistancePct:0,
    volumeTodayVsPrev5:0.91
  });
  const aBestContractedVolume=setupQualityA({
    pullbackPct:7,
    supportDistancePct:0,
    volumeTodayVsPrev5:0.9
  });
  return {
    bPassBoundaryMin:bMin,
    bTheoreticalMax:bMax,
    bFinalGradeCReachable:bMin<SIGNAL_GRADE_B_MIN,
    aPassCompatibleLowWitness:aWitnessMin,
    aFinalGradeCReachable:aWitnessMin<SIGNAL_GRADE_B_MIN,
    aBestWhenVolumeGt0_9:aBestLooseVolume,
    aSignalGradeAReachableWhenVolumeGt0_9:aBestLooseVolume>=SIGNAL_GRADE_A_MIN,
    aBestWhenVolumeLe0_9:aBestContractedVolume,
    note:"A low witness assumes other A.pass checks are satisfied and volume gate passes through contraction<=0.95; observer does not alter or bypass Formal."
  };
}
