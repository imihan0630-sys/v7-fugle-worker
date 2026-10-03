import {expectedLogGrowth,gridScenarioKelly} from "./d15_kelly_eligibility_validator_v0_1.mjs";

export function leftTailStress({scenarios,tailReturn,tailProb}){
 if(!(tailProb>=0&&tailProb<1)||!(tailReturn<0)) throw new Error("INVALID_TAIL_STRESS");
 const kept=scenarios.map(s=>({p:s.p*(1-tailProb),r:s.r}));
 return [...kept,{p:tailProb,r:tailReturn}];
}

export function evaluateEstimatedVsTrue({estimatedScenarios,trueScenarios,maxFraction=1,step=.001}){
 const estimatedOpt=gridScenarioKelly({scenarios:estimatedScenarios,maxFraction,step});
 const trueOpt=gridScenarioKelly({scenarios:trueScenarios,maxFraction,step});
 const estimatedFractionUnderTruth=expectedLogGrowth({fraction:estimatedOpt.fraction,scenarios:trueScenarios});
 return {
  estimatedOpt,
  trueOpt,
  estimatedFractionUnderTruth,
  logGrowthRegret:trueOpt.expectedLogGrowth-estimatedFractionUnderTruth,
  oversizing:Math.max(0,estimatedOpt.fraction-trueOpt.fraction)
 };
}

export function regimeStress({estimatedScenarios,regimes,maxFraction=1,step=.001}){
 const estimatedOpt=gridScenarioKelly({scenarios:estimatedScenarios,maxFraction,step});
 return {
  estimatedOpt,
  regimes:regimes.map((scenarios,index)=>{
    const trueOpt=gridScenarioKelly({scenarios,maxFraction,step});
    const applied=expectedLogGrowth({fraction:estimatedOpt.fraction,scenarios});
    return {index,trueOpt,applied,regret:trueOpt.expectedLogGrowth-applied};
  })
 };
}

export function twoAssetGrowth({weights,scenarios}){
 let g=0,p=0;
 for(const s of scenarios){
  const r=weights[0]*s.r1+weights[1]*s.r2;
  const wealth=1+r;
  if(!(wealth>0)) return -Infinity;
  g+=s.p*Math.log(wealth); p+=s.p;
 }
 if(Math.abs(p-1)>1e-9) throw new Error("PROBABILITIES_MUST_SUM_TO_ONE");
 return g;
}

export function correlationWitness({weight=.2}={}){
 const independent=[
  {p:.36,r1:1,r2:1},{p:.24,r1:1,r2:-1},{p:.24,r1:-1,r2:1},{p:.16,r1:-1,r2:-1}
 ];
 const perfectlyCorrelated=[
  {p:.6,r1:1,r2:1},{p:.4,r1:-1,r2:-1}
 ];
 return {
  independentGrowth:twoAssetGrowth({weights:[weight,weight],scenarios:independent}),
  correlatedGrowth:twoAssetGrowth({weights:[weight,weight],scenarios:perfectlyCorrelated})
 };
}

export function kellyKillSwitch({
 calibrationEligible,
 distributionEligible,
 tailEvidenceStatus,
 regimeEvidenceStatus,
 dependenceRequired=false,
 dependenceEvidenceStatus,
 costEvidenceStatus,
 executionEvidenceStatus
}){
 const hard=[];
 const soft=[];
 if(calibrationEligible!==true) hard.push("CALIBRATION_INELIGIBLE");
 if(distributionEligible!==true) hard.push("DISTRIBUTION_INELIGIBLE");
 if(tailEvidenceStatus!=="KNOWN") soft.push("TAIL_RISK_UNKNOWN");
 if(regimeEvidenceStatus!=="KNOWN") soft.push("REGIME_ROBUSTNESS_UNKNOWN");
 if(dependenceRequired&&dependenceEvidenceStatus!=="KNOWN") hard.push("DEPENDENCE_REQUIRED_BUT_UNKNOWN");
 if(costEvidenceStatus!=="KNOWN") soft.push("COST_UNKNOWN");
 if(executionEvidenceStatus!=="KNOWN") soft.push("EXECUTION_UNKNOWN");
 return {
  activeKellyAllowed:hard.length===0,
  formalCandidateAllowed:hard.length===0&&soft.length===0,
  hard,soft
 };
}
