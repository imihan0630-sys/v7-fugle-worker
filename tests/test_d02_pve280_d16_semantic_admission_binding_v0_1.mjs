import assert from "node:assert/strict";
import {evaluateD16Receipt} from "../research/d02_d16_l4_validation_receipt_guard_v0_2.mjs";
import {evaluatePve280D16SemanticBinding as gate} from "../research/d02_pve280_d16_semantic_admission_binding_v0_1.mjs";

const key="D02-01:SEMANTIC_GOVERNANCE";
let id=0;
const target=()=>({
 targetId:"T:SEM",targetVersion:"V1",kind:"SEMANTIC_MATERIALITY_TARGET",estimandId:"E:SEM",
 metric:"classification_delta_share",unit:"share",direction:"GREATER_THAN_OR_EQUAL",thresholdValue:0.01,
 comparatorId:"GOVERNED_VS_FROZEN_UNGOVERNED",outcomeHorizon:"SEMANTIC_CLASSIFICATION_AT_FEATURE_TIME",
 costTreatment:"NOT_APPLICABLE_SEMANTIC",frozenAt:"2026-10-08T01:00:00+08:00",
 frozenBeforeOutcome:true,outcomeAccessStateAtFreeze:"OUTCOME_CLOSED",targetHash:"HASH:SEM",
 rationale:"FIXTURE_ONLY_NOT_RESEARCH_THRESHOLD",status:"FROZEN"
});
const base=()=>({
 owner:"D16",receiptId:"R"+(++id),evidenceKey:key,multipleTestingFamilyId:"F0",
 admissionVersion:"D02_01_L4_SEMANTIC_ADMISSION_V0_1",experimentVersion:"D02_01_SEM_V0_1",
 outcomeContractVersion:"SEMANTIC_V1",commonSupportCount:40,independentScanDateCount:20,independentSymbolCount:8,
 dateDependenceMethod:"DATE_CLUSTER_ROBUST",smallClusterTreatment:"FINITE_SAMPLE_REVIEW",
 overlapControl:"SEMANTIC_EVENT_DEDUP",purgeResult:"PASS",coverageMissingnessSummary:{unknownShare:0},
 effectTarget:target(),sampleAdequacyStatus:"ADEQUATE",d16MethodFrozen:true,dependenceAssessmentPass:true,
 effectiveSampleReport:{rowN:40,independentDateN:20},multipleTestingReviewPass:true,concentrationReviewPass:true,
 costLiquidityReviewPass:false,resultStatus:"SEMANTIC_GOVERNANCE_CANDIDATE",
 d16InputDatasetHash:"b".repeat(64),firstOutcomeAccessAt:"2026-10-08T10:00:00+08:00"
});
const expected={evidenceKey:key,experimentVersion:"D02_01_SEM_V0_1",effectTargetId:"T:SEM",effectTargetVersion:"V1",effectTargetHash:"HASH:SEM"};
const admission=(over={})=>({
 admissionVersion:"D02_01_L4_SEMANTIC_ADMISSION_V0_1",evidenceKey:key,
 l4SemanticEvidenceAdmissionReady:true,fatalIntegrity:false,outcomeBlind:true,
 economicOutcomeAccessAuthorized:false,l4MaturityAuthorized:false,
 receiptHash:"a".repeat(64),admittedDatasetHash:"b".repeat(64),admittedRowCount:40,
 createdAt:"2026-10-08T09:00:00+08:00",...over
});

const legacy=base();
assert.equal(evaluateD16Receipt(legacy,expected).pass,true);
assert.equal(evaluateD16Receipt(legacy,expected).promotionReviewEligible,true);
const missing=gate(legacy,expected);
assert.equal(missing.pass,false);
assert.ok(missing.reasons.includes("D02_01_SEMANTIC_ADMISSION_RECEIPT_REQUIRED"));

const good={...base(),preOutcomeSemanticAdmissionReceipt:admission()};
assert.equal(gate(good,expected).pass,true);
assert.equal(gate(good,expected).promotionReviewEligible,true);

for(const [scope,k,v] of [
 ["a","admissionVersion","OLD"],["a","evidenceKey","D02-02:H001"],
 ["a","l4SemanticEvidenceAdmissionReady",false],["a","fatalIntegrity",true],
 ["a","outcomeBlind",false],["a","economicOutcomeAccessAuthorized",true],
 ["a","l4MaturityAuthorized",true],["a","receiptHash","bad"],
 ["a","admittedDatasetHash","c".repeat(64)],["a","admittedRowCount",39],
 ["a","createdAt","2026-10-08T10:30:00+08:00"],
 ["r","d16InputDatasetHash","bad"],["r","firstOutcomeAccessAt","bad"]
]){
 const x={...good,preOutcomeSemanticAdmissionReceipt:{...good.preOutcomeSemanticAdmissionReceipt}};
 if(scope==="a")x.preOutcomeSemanticAdmissionReceipt[k]=v;else x[k]=v;
 assert.equal(gate(x,expected).pass,false,k);
}
assert.equal(gate(good,expected).maturityPromotionAuthorized,false);
assert.equal(gate(good,expected).formalCoreChangeAuthorized,false);
assert.equal(gate(good,expected).directLegacySemanticD16ConsumptionAuthorized,false);

console.log(JSON.stringify({status:"PASS",assertions:23,legacySemanticD16BypassReproduced:true}));
