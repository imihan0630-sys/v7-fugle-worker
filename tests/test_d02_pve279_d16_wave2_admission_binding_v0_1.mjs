import assert from "node:assert/strict";
import {evaluateD16Receipt} from "../research/d02_d16_l4_validation_receipt_guard_v0_2.mjs";
import {evaluatePve279D16Wave2Binding as gate} from "../research/d02_pve279_d16_wave2_admission_binding_v0_1.mjs";

let id=0;
const keys=[
 "D02-04:DRYUP","D02-05:EXTREME_PARTICIPATION","D02-07:SVB20","D02-08:PROVIDER_PRESSURE",
 "D02-09:PIVOT_SIGNED_VOLUME","D02-09:PARTICIPATION_TRAJECTORY","D02-10:TREND_VOLUME_INTERACTION",
 "D02-11:LIQUIDITY_COUNTERFACTUAL","D02-12:TIME_OF_DAY_VOLUME_CURVE","D02-12:PRICE_BY_VOLUME_PROFILE"
];
const fam=k=>k.startsWith("D02-04")?"F1":k.startsWith("D02-05")?"F2":k.startsWith("D02-07")||k.startsWith("D02-09")?"F3":k.startsWith("D02-08")?"F4":"F5";
const target=k=>({targetId:"T:"+k,targetVersion:"V1",kind:"MDE",estimandId:"E:"+k,metric:"FIXTURE",unit:"fixture",direction:"GREATER_THAN_OR_EQUAL",thresholdValue:1,comparatorId:"C:"+k,outcomeHorizon:"H",costTreatment:"FIXTURE",frozenAt:"2026-10-08T01:00:00+08:00",frozenBeforeOutcome:true,outcomeAccessStateAtFreeze:"OUTCOME_CLOSED",targetHash:"HASH:"+k,rationale:"FIXTURE_ONLY",status:"FROZEN"});
const base=k=>({owner:"D16",receiptId:"R"+(++id),evidenceKey:k,multipleTestingFamilyId:fam(k),admissionVersion:"D02_L4_WAVE2_ADMISSION_V0_1",experimentVersion:"EXP1",outcomeContractVersion:"OC1",commonSupportCount:120,independentScanDateCount:35,independentSymbolCount:6,dateDependenceMethod:"DATE_CLUSTER_ROBUST",smallClusterTreatment:"FINITE_SAMPLE_REVIEW",overlapControl:"PURGED_FORWARD_HOLDOUT",purgeResult:"PASS",coverageMissingnessSummary:{unknownShare:.01},effectTarget:target(k),sampleAdequacyStatus:"ADEQUATE",d16MethodFrozen:true,dependenceAssessmentPass:true,effectiveSampleReport:{rowN:120,independentDateN:35},multipleTestingReviewPass:true,concentrationReviewPass:true,costLiquidityReviewPass:true,resultStatus:"VALIDATION_PASS_CANDIDATE",d16InputDatasetHash:"b".repeat(64),firstOutcomeAccessAt:"2026-10-08T10:00:00+08:00"});
const exp=k=>({evidenceKey:k,experimentVersion:"EXP1",effectTargetId:"T:"+k,effectTargetVersion:"V1",effectTargetHash:"HASH:"+k});
const spec=k=>{
 if(k.startsWith("D02-09:"))return {moduleId:"D02-09",family:k.split(":")[1]};
 if(k.startsWith("D02-12:"))return {moduleId:"D02-12",family:k.split(":")[1]};
 return {moduleId:k.split(":")[0],family:null};
};
const admission=k=>({...spec(k),schemaVersion:"D02_PVE278_WAVE2_ANTI_BYPASS_FIREWALL_V0_1",pass:true,outcomeAccessAuthorized:false,maturityPromotionAuthorized:false,outcomeBlind:true,receiptHash:"a".repeat(64),admittedDatasetHash:"b".repeat(64),admittedRowCount:120,createdAt:"2026-10-08T09:00:00+08:00"});

for(const k of keys){
 const legacy=base(k);
 assert.equal(evaluateD16Receipt(legacy,exp(k)).pass,true,k+" legacy");
 assert.equal(gate(legacy,exp(k)).pass,false,k+" missing PVE278");
 const bound={...legacy,preOutcomeAdmissionReceipt:admission(k)};
 assert.equal(gate(bound,exp(k)).pass,true,k+" bound");
 assert.equal(gate(bound,exp(k)).promotionReviewEligible,true,k+" eligible");
}
const k="D02-12:TIME_OF_DAY_VOLUME_CURVE",good={...base(k),preOutcomeAdmissionReceipt:admission(k)};
for(const [scope,field,value] of [
 ["a","schemaVersion","OLD"],["a","pass",false],["a","moduleId","D02-11"],["a","family","PRICE_BY_VOLUME_PROFILE"],
 ["a","outcomeAccessAuthorized",true],["a","maturityPromotionAuthorized",true],["a","outcomeBlind",false],
 ["a","receiptHash","bad"],["a","admittedDatasetHash","c".repeat(64)],["a","admittedRowCount",119],
 ["a","createdAt","2026-10-08T11:00:00+08:00"],["r","d16InputDatasetHash","bad"],["r","firstOutcomeAccessAt","bad"]
]){
 const x={...good,preOutcomeAdmissionReceipt:{...good.preOutcomeAdmissionReceipt}};
 if(scope==="a")x.preOutcomeAdmissionReceipt[field]=value;else x[field]=value;
 assert.equal(gate(x,exp(k)).pass,false,field);
}
assert.equal(gate(good,exp(k)).maturityPromotionAuthorized,false);
assert.equal(gate(good,exp(k)).formalCoreChangeAuthorized,false);
console.log(JSON.stringify({status:"PASS",assertions:55,legacyWave2D16BypassReproduced:true}));
