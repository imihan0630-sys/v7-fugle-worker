import assert from "node:assert/strict";
import {evaluateD16Receipt} from "../research/d02_d16_l4_validation_receipt_guard_v0_2.mjs";
import {evaluatePve276D16Wave1Binding as gate} from "../research/d02_pve276_d16_wave1_admission_binding_v0_1.mjs";

let id=0;
const target=(key)=>({
 targetId:"T:"+key,targetVersion:"V1",kind:"MDE",estimandId:"E:"+key,
 metric:"DATE_BALANCED_BRIER_LOSS_IMPROVEMENT",unit:"brier_score_points",
 direction:"GREATER_THAN_OR_EQUAL",thresholdValue:1,comparatorId:"C:"+key,
 outcomeHorizon:"B2",costTreatment:"FIXTURE",frozenAt:"2026-10-08T01:00:00+08:00",
 frozenBeforeOutcome:true,outcomeAccessStateAtFreeze:"OUTCOME_CLOSED",
 targetHash:"HASH:"+key,rationale:"FIXTURE_ONLY",status:"FROZEN"
});
const family=k=>k==="D02-06:H003"?"F2":"F1";
const base=(key)=>({
 owner:"D16",receiptId:"R"+(++id),evidenceKey:key,multipleTestingFamilyId:family(key),
 admissionVersion:"D02_L4_WAVE1_GATE_V0_1_1",experimentVersion:"EXP1",outcomeContractVersion:"OC1",
 commonSupportCount:120,independentScanDateCount:35,independentSymbolCount:6,
 dateDependenceMethod:"DATE_CLUSTER_ROBUST",smallClusterTreatment:"FINITE_SAMPLE_REVIEW",
 overlapControl:"PURGED_FORWARD_HOLDOUT",purgeResult:"PASS",coverageMissingnessSummary:{unknownShare:0.01},
 effectTarget:target(key),sampleAdequacyStatus:"ADEQUATE",d16MethodFrozen:true,dependenceAssessmentPass:true,
 effectiveSampleReport:{rowN:120,independentDateN:35},multipleTestingReviewPass:true,concentrationReviewPass:true,
 costLiquidityReviewPass:true,resultStatus:"VALIDATION_PASS_CANDIDATE",
 d16InputDatasetHash:"b".repeat(64),firstOutcomeAccessAt:"2026-10-08T10:00:00+08:00"
});
const exp=(key)=>({evidenceKey:key,experimentVersion:"EXP1",effectTargetId:"T:"+key,effectTargetVersion:"V1",effectTargetHash:"HASH:"+key});
const admission=(key,over={})=>({
 schemaVersion:"D02_PVE275_WAVE1_ANTI_BYPASS_FIREWALL_V0_1",evidenceKey:key,pass:true,
 state:"WAVE1_PREOUTCOME_ADMISSION_FIREWALL_PASS",legacyGateDirectUseAuthorized:false,
 outcomeAccessAuthorized:false,maturityPromotionAuthorized:false,outcomeBlind:true,
 receiptHash:"a".repeat(64),admittedDatasetHash:"b".repeat(64),admittedRowCount:120,
 createdAt:"2026-10-08T09:00:00+08:00",...over
});

for(const key of ["D02-02:H001","D02-03:H20","D02-06:H003"]){
 const legacy=base(key);
 assert.equal(evaluateD16Receipt(legacy,exp(key)).pass,true);
 assert.equal(gate(legacy,exp(key)).pass,false);
 assert.ok(gate(legacy,exp(key)).reasons.includes("WAVE1_PVE275_ADMISSION_RECEIPT_REQUIRED"));
 const bound={...legacy,preOutcomeAdmissionReceipt:admission(key)};
 const r=gate(bound,exp(key));
 assert.equal(r.pass,true);
 assert.equal(r.promotionReviewEligible,true);
 assert.equal(r.directLegacyD16ConsumptionAuthorized,false);
}

const key="D02-03:H20",good={...base(key),preOutcomeAdmissionReceipt:admission(key)};
for(const [scope,k,v] of [
 ["a","schemaVersion","OLD"],["a","evidenceKey","D02-02:H001"],["a","pass",false],
 ["a","legacyGateDirectUseAuthorized",true],["a","outcomeAccessAuthorized",true],
 ["a","maturityPromotionAuthorized",true],["a","receiptHash","bad"],["a","admittedDatasetHash","c".repeat(64)],
 ["a","admittedRowCount",119],["a","createdAt","2026-10-08T10:30:00+08:00"],["a","outcomeBlind",false],
 ["r","d16InputDatasetHash","bad"],["r","firstOutcomeAccessAt","bad"]
]){
 const x={...good,preOutcomeAdmissionReceipt:{...good.preOutcomeAdmissionReceipt}};
 if(scope==="a")x.preOutcomeAdmissionReceipt[k]=v;else x[k]=v;
 assert.equal(gate(x,exp(key)).pass,false,k);
}
assert.equal(gate(good,exp(key)).maturityPromotionAuthorized,false);
assert.equal(gate(good,exp(key)).formalCoreChangeAuthorized,false);
console.log(JSON.stringify({status:"PASS",assertions:32,legacyD16BypassReproduced:true}));
