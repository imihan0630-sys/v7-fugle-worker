import {validateKellyInput,gridScenarioKelly,expectedLogGrowth} from "./d15_kelly_eligibility_validator_v0_1.mjs";

const LAMBDAS=Object.freeze([1,.75,.5,.25,0]);
const req=["decisionReceiptId","opportunitySetId","predictionId","generationId","symbol","decisionAt","targetDefinition","outcomeHorizon","exitPolicy","predictionDistribution","calibrationMethodId","calibrationTrainingCutoff"];

export function validateReplayReceipt(r={}){
 const missing=req.filter(k=>r[k]===undefined||r[k]===null||r[k]==="");
 const base=validateKellyInput(r);
 const reasons=[...missing.map(k=>"MISSING_"+k.toUpperCase()),...(base.reasons||[])];
 if(r.outcomeMatured!==true) reasons.push("OUTCOME_NOT_MATURED");
 if(r.outcomeFirstKnownAt&&r.decisionAt&&Date.parse(r.outcomeFirstKnownAt)<=Date.parse(r.decisionAt)) reasons.push("OUTCOME_TIME_INVALID");
 if(r.frozenDecisionUniverseCount===undefined) reasons.push("MISSING_FROZEN_DECISION_UNIVERSE_COUNT");
 if(r.maturedEvaluationCount===undefined) reasons.push("MISSING_MATURED_EVALUATION_COUNT");
 if(r.maturedEvaluationCount>r.frozenDecisionUniverseCount) reasons.push("MATURED_COUNT_EXCEEDS_FROZEN_UNIVERSE");
 return {eligible:base.status==="ELIGIBLE"&&reasons.length===0,reasons,base};
}

export function replayKellyReceipt(r,{maxFraction=1,step=.001,lambdas=LAMBDAS}={}){
 const v=validateReplayReceipt(r);
 if(!v.eligible) return {status:"INELIGIBLE",reasons:v.reasons};
 const scenarios=r.predictionDistribution;
 const full=gridScenarioKelly({scenarios,maxFraction,step});
 const challengers=lambdas.map(lambda=>{
  const fraction=full.fraction*lambda;
  return {id:"KELLY_"+lambda.toFixed(2),lambda,fraction,predictedLogGrowth:expectedLogGrowth({fraction,scenarios})};
 });
 return {
  status:"READY",
  key:[r.decisionReceiptId,r.opportunitySetId,r.symbol].join("|"),
  decisionAt:r.decisionAt,
  frozenDecisionUniverseCount:r.frozenDecisionUniverseCount,
  maturedEvaluationCount:r.maturedEvaluationCount,
  full,
  challengers,
  unknown:v.base.unknown
 };
}

export function assertCommonSupport(rows){
 const ready=rows.filter(x=>x.status==="READY");
 const keys=new Set(ready.map(x=>x.key));
 return {readyCount:ready.length,uniqueKeys:keys.size,allUnique:keys.size===ready.length};
}

export const FROZEN_KELLY_LAMBDAS=LAMBDAS;
