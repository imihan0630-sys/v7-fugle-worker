import assert from "node:assert/strict";
import {evaluatePve281CanonicalD02Lineage as gate,D02_ALL_EVIDENCE_KEYS} from "../research/d02_pve281_canonical_end_to_end_admission_lineage_v0_1.mjs";

let id=0;
const family=k=>k.startsWith("D02-01")?"F0":k.startsWith("D02-02")||k.startsWith("D02-03")||k.startsWith("D02-04")?"F1":k.startsWith("D02-05")||k.startsWith("D02-06")?"F2":k.startsWith("D02-07")||k.startsWith("D02-09")?"F3":k.startsWith("D02-08")?"F4":"F5";
const admissionVersion=k=>k.startsWith("D02-01")?"D02_01_L4_SEMANTIC_ADMISSION_V0_1":(["D02-02:H001","D02-03:H20","D02-06:H003"].includes(k)?"D02_L4_WAVE1_GATE_V0_1_1":"D02_L4_WAVE2_ADMISSION_V0_1");
const target=k=>({
 targetId:"T:"+k,targetVersion:"V1",kind:k.startsWith("D02-01")?"SEMANTIC_MATERIALITY_TARGET":"MDE",
 estimandId:"E:"+k,metric:"FIXTURE",unit:"fixture",direction:"GREATER_THAN_OR_EQUAL",thresholdValue:1,
 comparatorId:"C:"+k,outcomeHorizon:"H",costTreatment:"FIXTURE",frozenAt:"2026-10-08T01:00:00+08:00",
 frozenBeforeOutcome:true,outcomeAccessStateAtFreeze:"OUTCOME_CLOSED",targetHash:"HASH:"+k,
 rationale:"FIXTURE_ONLY",status:"FROZEN"
});
const expected=k=>({evidenceKey:k,experimentVersion:"EXP1",effectTargetId:"T:"+k,effectTargetVersion:"V1",effectTargetHash:"HASH:"+k});
function base(k){
 const x={owner:"D16",receiptId:"R"+(++id),evidenceKey:k,multipleTestingFamilyId:family(k),admissionVersion:admissionVersion(k),experimentVersion:"EXP1",outcomeContractVersion:"OC1",commonSupportCount:120,independentScanDateCount:35,independentSymbolCount:6,dateDependenceMethod:"DATE_CLUSTER_ROBUST",smallClusterTreatment:"FINITE_SAMPLE_REVIEW",overlapControl:"PURGED_FORWARD_HOLDOUT",purgeResult:"PASS",coverageMissingnessSummary:{unknownShare:.01},effectTarget:target(k),sampleAdequacyStatus:"ADEQUATE",d16MethodFrozen:true,dependenceAssessmentPass:true,effectiveSampleReport:{rowN:120,independentDateN:35},multipleTestingReviewPass:true,concentrationReviewPass:true,costLiquidityReviewPass:!k.startsWith("D02-01"),resultStatus:k.startsWith("D02-01")?"SEMANTIC_GOVERNANCE_CANDIDATE":"VALIDATION_PASS_CANDIDATE",d16InputDatasetHash:"b".repeat(64),firstOutcomeAccessAt:"2026-10-08T10:00:00+08:00"};
 if(k==="D02-01:SEMANTIC_GOVERNANCE"){
   x.preOutcomeSemanticAdmissionReceipt={admissionVersion:"D02_01_L4_SEMANTIC_ADMISSION_V0_1",evidenceKey:k,l4SemanticEvidenceAdmissionReady:true,fatalIntegrity:false,outcomeBlind:true,economicOutcomeAccessAuthorized:false,l4MaturityAuthorized:false,receiptHash:"a".repeat(64),admittedDatasetHash:"b".repeat(64),admittedRowCount:120,createdAt:"2026-10-08T09:00:00+08:00"};
 }else if(["D02-02:H001","D02-03:H20","D02-06:H003"].includes(k)){
   x.preOutcomeAdmissionReceipt={schemaVersion:"D02_PVE275_WAVE1_ANTI_BYPASS_FIREWALL_V0_1",evidenceKey:k,pass:true,state:"WAVE1_PREOUTCOME_ADMISSION_FIREWALL_PASS",legacyGateDirectUseAuthorized:false,outcomeAccessAuthorized:false,maturityPromotionAuthorized:false,outcomeBlind:true,receiptHash:"a".repeat(64),admittedDatasetHash:"b".repeat(64),admittedRowCount:120,createdAt:"2026-10-08T09:00:00+08:00"};
 }else{
   let moduleId=k.split(":")[0],familyId=null;
   if(moduleId==="D02-09"||moduleId==="D02-12")familyId=k.split(":")[1];
   x.preOutcomeAdmissionReceipt={schemaVersion:"D02_PVE278_WAVE2_ANTI_BYPASS_FIREWALL_V0_1",moduleId,family:familyId,pass:true,outcomeAccessAuthorized:false,maturityPromotionAuthorized:false,outcomeBlind:true,receiptHash:"a".repeat(64),admittedDatasetHash:"b".repeat(64),admittedRowCount:120,createdAt:"2026-10-08T09:00:00+08:00"};
 }
 return x;
}

assert.equal(D02_ALL_EVIDENCE_KEYS.length,14);
for(const k of D02_ALL_EVIDENCE_KEYS){
 const r=gate(base(k),expected(k));
 assert.equal(r.pass,true,k);
 assert.equal(r.promotionReviewEligible,true,k);
 assert.equal(r.exactAdmissionDatasetBindingRequired,true,k);
 assert.equal(r.directLegacyAdmissionConsumptionAuthorized,false,k);
 assert.equal(r.maturityPromotionAuthorized,false,k);
 assert.equal(r.formalCoreChangeAuthorized,false,k);
}
assert.equal(gate({}, {evidenceKey:"D02-99:UNKNOWN"}).pass,false);

for(const k of ["D02-01:SEMANTIC_GOVERNANCE","D02-02:H001","D02-04:DRYUP"]){
 const x=base(k);
 if(k.startsWith("D02-01")) delete x.preOutcomeSemanticAdmissionReceipt;
 else delete x.preOutcomeAdmissionReceipt;
 assert.equal(gate(x,expected(k)).pass,false,k+" missing strengthened admission receipt");
}
assert.equal(gate(base("D02-01:SEMANTIC_GOVERNANCE"),expected("D02-01:SEMANTIC_GOVERNANCE")).lane,"SEMANTIC");
assert.equal(gate(base("D02-02:H001"),expected("D02-02:H001")).lane,"WAVE1");
assert.equal(gate(base("D02-04:DRYUP"),expected("D02-04:DRYUP")).lane,"WAVE2");

console.log(JSON.stringify({status:"PASS",assertions:95,evidenceKeyCount:D02_ALL_EVIDENCE_KEYS.length}));
