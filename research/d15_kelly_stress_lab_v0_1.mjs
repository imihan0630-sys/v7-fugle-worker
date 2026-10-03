import {expectedLogGrowth,gridScenarioKelly} from "./d15_kelly_eligibility_validator_v0_1.mjs";

export function normalizeScenarios(scenarios){
 const sum=scenarios.reduce((a,s)=>a+s.p,0);
 if(!(sum>0)) throw new Error("INVALID_PROBABILITY_MASS");
 return scenarios.map(s=>({p:s.p/sum,r:s.r}));
}
export function fractionalKelly({fullFraction,lambda}){
 if(!(fullFraction>=0)||!(lambda>=0&&lambda<=1)) throw new Error("INVALID_FRACTIONAL_KELLY");
 return fullFraction*lambda;
}
export function shrinkScenarioProbabilities({scenarios,lambda}){
 if(!(lambda>=0&&lambda<=1)) throw new Error("INVALID_SHRINKAGE");
 const n=scenarios.length, uniform=1/n;
 return normalizeScenarios(scenarios.map(s=>({r:s.r,p:lambda*s.p+(1-lambda)*uniform})));
}
export function perturbScenarioProbabilities({scenarios,index,delta}){
 const x=scenarios.map(s=>({...s}));
 x[index].p=Math.max(0,x[index].p+delta);
 return normalizeScenarios(x);
}
export function evaluateFractions({scenarios,fullFraction,lambdas=[1,.75,.5,.25,0]}){
 return lambdas.map(lambda=>{
   const fraction=fractionalKelly({fullFraction,lambda});
   return {lambda,fraction,expectedLogGrowth:expectedLogGrowth({fraction,scenarios})};
 });
}
export function estimationStress({estimatedScenarios,trueScenarioSets,maxFraction=1,step=.001,lambdas=[1,.75,.5,.25,0]}){
 const estimatedFull=gridScenarioKelly({scenarios:estimatedScenarios,maxFraction,step});
 return {
  estimatedFull,
  cases:trueScenarioSets.map((scenarios,i)=>({
    caseIndex:i,
    results:evaluateFractions({scenarios,fullFraction:estimatedFull.fraction,lambdas})
  }))
 };
}
export function worstCaseByLambda(stress){
 const map=new Map();
 for(const c of stress.cases) for(const r of c.results){
   const cur=map.get(r.lambda);
   if(!cur||r.expectedLogGrowth<cur.expectedLogGrowth) map.set(r.lambda,{...r,caseIndex:c.caseIndex});
 }
 return [...map.values()].sort((a,b)=>b.expectedLogGrowth-a.expectedLogGrowth);
}
export function drawdownConstrainedGrid({scenarios,maxFraction=1,step=.001,maxOnePeriodLoss}){
 if(!(maxOnePeriodLoss>=0&&maxOnePeriodLoss<1)) throw new Error("INVALID_LOSS_CONSTRAINT");
 let best={fraction:0,expectedLogGrowth:0};
 for(let f=0;f<=maxFraction+1e-12;f+=step){
  const ff=Math.min(maxFraction,Number(f.toFixed(12)));
  const worstLoss=Math.max(0,...scenarios.map(s=>-(ff*s.r)));
  if(worstLoss>maxOnePeriodLoss+1e-12) continue;
  const g=expectedLogGrowth({fraction:ff,scenarios});
  if(g>best.expectedLogGrowth) best={fraction:ff,expectedLogGrowth:g};
 }
 return best;
}
