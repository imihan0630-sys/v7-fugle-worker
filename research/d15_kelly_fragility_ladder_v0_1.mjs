import {gridScenarioKelly,expectedLogGrowth} from "./d15_kelly_eligibility_validator_v0_1.mjs";
import {leftTailStress,evaluateEstimatedVsTrue} from "./d15_kelly_model_risk_firewall_v0_1.mjs";

const clamp01=x=>Math.max(0,Math.min(1,x));
export function tailFragility({nativeScenarios,tailProb,tailReturn,maxFraction=1,step=.001}){
 const stressed=leftTailStress({scenarios:nativeScenarios,tailProb,tailReturn});
 const x=evaluateEstimatedVsTrue({estimatedScenarios:nativeScenarios,trueScenarios:stressed,maxFraction,step});
 const f0=x.estimatedOpt.fraction, f1=x.trueOpt.fraction;
 const contraction=f0>0?clamp01((f0-f1)/f0):0;
 const regretScale=Math.abs(x.trueOpt.expectedLogGrowth)+1e-12;
 const regretRatio=Math.max(0,x.logGrowthRegret)/regretScale;
 return {...x,tailProb,tailReturn,fractionContraction:contraction,regretRatio};
}
export function fragilityScore({tailContraction=0,regimeSignFlipRate=0,dependenceContraction=0,costEdgeErosion=0}){
 const xs=[tailContraction,regimeSignFlipRate,dependenceContraction,costEdgeErosion].map(clamp01);
 return xs.reduce((a,b)=>a+b,0)/xs.length;
}
export function degradationDecision({eligibility,fragility,robustEdgePositive,riskBudgetEligible=true}){
 if(eligibility!=="ELIGIBLE") return {tier:"ABSTAIN",reason:"KELLY_INPUT_NOT_ELIGIBLE"};
 if(!robustEdgePositive) return {tier:riskBudgetEligible?"RISK_BUDGET":"ABSTAIN",reason:"ROBUST_KELLY_EDGE_NOT_POSITIVE"};
 if(fragility>=.75) return {tier:riskBudgetEligible?"RISK_BUDGET":"ABSTAIN",reason:"EXTREME_MODEL_FRAGILITY"};
 if(fragility>=.50) return {tier:"QUARTER_KELLY_OR_LOWER",reason:"HIGH_MODEL_FRAGILITY"};
 if(fragility>=.25) return {tier:"HALF_KELLY_OR_LOWER",reason:"MODERATE_MODEL_FRAGILITY"};
 return {tier:"FULL_KELLY_RESEARCH_COMPARATOR",reason:"LOW_SYNTHETIC_FRAGILITY"};
}
export function tailSurface({nativeScenarios,tailProbs=[.005,.01,.02,.05],tailReturns=[-.2,-.4,-.6,-.8],maxFraction=1,step=.001}){
 return tailProbs.flatMap(tailProb=>tailReturns.map(tailReturn=>tailFragility({nativeScenarios,tailProb,tailReturn,maxFraction,step})));
}
export function evaluateFrozenFraction({scenarios,fraction}){
 return expectedLogGrowth({fraction,scenarios});
}
