import assert from "node:assert/strict";
import {buildSystem1P1AOutcomeEvaluation,P1A_OUTCOME_GATE_V0_1} from "../research/system1_p1a_outcome_evaluator_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};
const pad=x=>String(x).padStart(2,"0");

function dateOf(i){return i<8?"2026-09-"+pad(i+1):"2026-10-"+pad(i-7);}
function c1(scanDate,i){
  return {
    schemaVersion:"SYSTEM1_C1_ISOLATED_V0_1",sessionDate:scanDate,populationN:2,
    observations:[
      {symbol:"F"+i,formalResult:{ok:true},gates:{}},
      {symbol:"P"+i,formalResult:{ok:false},gates:{}}
    ]
  };
}
function c5(scanDate,i,{rankable=true}={}){
  return {
    schemaVersion:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",sessionDate:scanDate,generationId:"g"+i,
    rows:rankable?[{symbol:"P"+i,p1aBlockSet:["RS_CONTEXT"],reachStage:"F9_RANKABLE"}]:
      [{symbol:"P"+i,p1aBlockSet:["RS_CONTEXT"],reachStage:"F4_AB_EVALUABLE"}],
    researchOnly:true,formalCoreLocked:true,economicSuperiority:"UNKNOWN"
  };
}
function d5(scanDate,symbol,generationId,ret,mfe=2,mae=-1){
  return {
    schemaVersion:"SYSTEM1_D5_MATURITY_RECEIPT_V0_1",scanDate,symbol,parentGenerationId:generationId,mature:true,
    afterCostReturnPct:ret,mfePct:mfe,maePct:mae,observedAt:scanDate+"T13:35:00+08:00"
  };
}
function regime(scanDate,value){
  return {schemaVersion:"SYSTEM1_MARKET_REGIME_RECEIPT_V0_1",scanDate,regime:value,verified:true,knownAt:scanDate+"T15:00:00+08:00"};
}
const validation={
  sourceCoveragePass:true,matchedStrataPass:true,costStressPass:true,redundancyPass:true,
  purgedHoldoutPass:true,multipleTestingPass:true,riskSafetyPass:true,regimeStabilityPass:true
};

eq(P1A_OUTCOME_GATE_V0_1.minIndependentDates,15);
eq(P1A_OUTCOME_GATE_V0_1.minMarketRegimes,2);
eq(P1A_OUTCOME_GATE_V0_1.minDateDirectionAgreementPct,70);

const dates=Array.from({length:15},(_,i)=>dateOf(i));
const c1s=dates.map((d,i)=>c1(d,i));
const c5s=dates.map((d,i)=>c5(d,i));
const regs=dates.map((d,i)=>regime(d,i<8?"TREND":"RANGE"));
const positiveD5=dates.flatMap((d,i)=>[
  d5(d,"F"+i,"g"+i,0.5,2,-1.2),
  d5(d,"P"+i,"g"+i,1.5,3,-0.8)
]);

const positive=buildSystem1P1AOutcomeEvaluation({c1Diagnoses:c1s,c5Diagnostics:c5s,d5Receipts:positiveD5,regimeReceipts:regs,validation});
eq(positive.schemaVersion,"SYSTEM1_P1A_OUTCOME_EVALUATION_V0_1");
eq(positive.classification,"P1A_POSITIVE_ECONOMIC_EVIDENCE");
eq(positive.population.diagnosticDates,15);
eq(positive.population.totalFormalAdmittedRows,15);
eq(positive.population.totalP1aRankableRows,15);
eq(positive.population.eligibleComparisonDates,15);
eq(positive.population.cleanComparableDates,15);
eq(positive.dateCluster.independentDates,15);
eq(positive.dateCluster.regimeCount,2);
eq(positive.dateCluster.dateCoveragePct,100);
eq(positive.dateCluster.afterCostDeltaMeanPct,1);
eq(positive.dateCluster.afterCostDeltaMedianPct,1);
eq(positive.dateCluster.directionAgreementPct,100);
eq(positive.dateCluster.lodoDirectionAgreementPct,100);
eq(positive.readiness.completeOutcomeCoverage,true);
eq(positive.readiness.maturityReady,true);
eq(positive.readiness.validationReady,true);
eq(positive.readiness.economicGatePass,true);
eq(positive.economicSuperiority,"RESEARCH_EVIDENCE_POSITIVE");
eq(positive.formalOptimizationCandidate,"NONE");
eq(positive.autoSwitchAuthorized,false);
eq(positive.interpretation.symbolsWithinDateAreNotIndependent,true);
eq(positive.interpretation.positiveEvidenceDoesNotAuthorizeFormalChange,true);

const missing=buildSystem1P1AOutcomeEvaluation({
  c1Diagnoses:c1s,c5Diagnostics:c5s,d5Receipts:positiveD5.slice(0,-1),regimeReceipts:regs,validation
});
eq(missing.classification,"P1A_FUNNEL_MATERIAL_OUTCOME_UNKNOWN");
eq(missing.population.eligibleComparisonDates,15);
eq(missing.population.cleanComparableDates,14);
eq(missing.readiness.completeOutcomeCoverage,false);
eq(missing.readiness.maturityReady,false);
eq(missing.dates.find(x=>x.scanDate===dates.at(-1)).complete,false);

const negativeD5=dates.flatMap((d,i)=>[
  d5(d,"F"+i,"g"+i,1.0,2,-1),
  d5(d,"P"+i,"g"+i,0.0,1,-1.5)
]);
const negative=buildSystem1P1AOutcomeEvaluation({c1Diagnoses:c1s,c5Diagnostics:c5s,d5Receipts:negativeD5,regimeReceipts:regs,validation});
eq(negative.classification,"P1A_MATERIAL_NO_ECONOMIC_GAIN");
eq(negative.dateCluster.afterCostDeltaMeanPct,-1);
eq(negative.readiness.maturityReady,true);
eq(negative.readiness.economicGatePass,false);

const noP1=buildSystem1P1AOutcomeEvaluation({
  c1Diagnoses:[c1(dates[0],0)],c5Diagnostics:[c5(dates[0],0,{rankable:false})],
  d5Receipts:[],regimeReceipts:[regs[0]],validation:{}
});
eq(noP1.classification,"P1A_NOT_MATERIAL");
eq(noP1.population.totalP1aRankableRows,0);
eq(noP1.formalOptimizationCandidate,"NONE");

const immature=buildSystem1P1AOutcomeEvaluation({
  c1Diagnoses:c1s.slice(0,2),c5Diagnostics:c5s.slice(0,2),d5Receipts:positiveD5.slice(0,4),
  regimeReceipts:regs.slice(0,2),validation
});
eq(immature.classification,"P1A_FUNNEL_MATERIAL_OUTCOME_UNKNOWN");
eq(immature.dateCluster.independentDates,2);
eq(immature.readiness.maturityReady,false);

assert.throws(()=>buildSystem1P1AOutcomeEvaluation({
  c1Diagnoses:[c1s[0],c1s[0]],c5Diagnostics:[c5s[0]]
}),/DUPLICATE_C1_DATE/);n++;

assert.throws(()=>buildSystem1P1AOutcomeEvaluation({
  c1Diagnoses:[c1s[0]],c5Diagnostics:[c5s[0]],d5Receipts:[positiveD5[0],positiveD5[0]]
}),/DUPLICATE_D5/);n++;

ok(positive.dateCluster.regimeStats.TREND.dateN===8&&positive.dateCluster.regimeStats.RANGE.dateN===7);
console.log(JSON.stringify({
  ok:true,assertions:n,failClosedIncompleteDates:true,equalDatePrimary:true,dateClustered:true,
  minIndependentDates:15,minRegimes:2,directionAgreementFloorPct:70,
  positiveEvidenceNotFormalCandidate:true,autoFormalSwitch:false,formalCoreImpact:false
}));
