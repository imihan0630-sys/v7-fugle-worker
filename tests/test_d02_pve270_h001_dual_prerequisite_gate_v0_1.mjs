import assert from "node:assert/strict";
import {evaluatePve270H001Reopen as gate} from "../research/d02_pve270_h001_dual_prerequisite_gate_v0_1.mjs";

const baseline={
 ownerApproved:true,deployed:true,productionRemediationAccepted:true,
 marketDate:"2026-10-09",baselineAsOfDate:"2026-10-08",expectedLatestComparableSlotDate:"2026-10-08",
 sameSlotHistoryValidityState:"PASS",corporateActionContinuityState:"CLEAN",
 currentSessionExcludedFromBaseline:true,futureDatesAbsent:true,
 rawPayloadHash:"a".repeat(64),rawPayloadHashBasis:"EXACT_PROVIDER_RESPONSE_SHA256",
 featureCapturedAt:"2026-10-09T03:45:00.000Z",deployedAt:"2026-10-08T00:30:00.000Z",
 decisionImpact:0,retroactiveCleanDateGranted:false
};
const quotaSchedule={
 corr003IndependentVerificationPass:true,accountQuotaGateActive:true,
 system1AfterMarketReserveProtected:true,accountUsageKnownOrConservativeBlock:true,
 scheduleEvidenceState:"BUSINESS_EXECUTION_SUCCESS",successfulBusinessExecutionCount:1,
 normalProductionReceiptPersisted:true,quotaRejectionObserved:false,
 triggerAbsenceVsWriteFailureDistinguishable:true,paidUpgradePerformed:false,
 system1FormalCoreUnchanged:true,system2StrategySemanticsUnchanged:true,
 verifiedAt:"2026-10-08T15:58:00.000Z"
};

const valid=gate({candidateMarketDate:"2026-10-09",baseline,quotaSchedule,outcomeAccessOpened:false,maturityPromotionRequested:false});
assert.equal(valid.reopenEligible,true);
assert.equal(valid.state,"H001_PROSPECTIVE_ADMISSION_REOPEN_ELIGIBLE");
assert.equal(valid.outcomeAccessAuthorized,false);
assert.equal(valid.maturityPromotionAuthorized,false);

for(const [path,value] of [
 ["ownerApproved",false],["deployed",false],["productionRemediationAccepted",false],
 ["baselineAsOfDate","2026-10-07"],["sameSlotHistoryValidityState","FAIL"],
 ["corporateActionContinuityState","UNKNOWN"],["currentSessionExcludedFromBaseline",false],
 ["futureDatesAbsent",false],["rawPayloadHash","bad"],["decisionImpact",1],["retroactiveCleanDateGranted",true]
]){
 const r=gate({candidateMarketDate:"2026-10-09",baseline:{...baseline,[path]:value},quotaSchedule,outcomeAccessOpened:false,maturityPromotionRequested:false});
 assert.equal(r.reopenEligible,false,path);
}

for(const [path,value] of [
 ["corr003IndependentVerificationPass",false],["accountQuotaGateActive",false],
 ["system1AfterMarketReserveProtected",false],["accountUsageKnownOrConservativeBlock",false],
 ["scheduleEvidenceState","INVOKED_EXECUTION_FAILED_D1_QUOTA"],["successfulBusinessExecutionCount",0],
 ["successfulBusinessExecutionCount",2],["normalProductionReceiptPersisted",false],
 ["quotaRejectionObserved",true],["triggerAbsenceVsWriteFailureDistinguishable",false],
 ["paidUpgradePerformed",true],["system1FormalCoreUnchanged",false],["system2StrategySemanticsUnchanged",false]
]){
 const r=gate({candidateMarketDate:"2026-10-09",baseline,quotaSchedule:{...quotaSchedule,[path]:value},outcomeAccessOpened:false,maturityPromotionRequested:false});
 assert.equal(r.reopenEligible,false,path+"="+value);
}

assert.equal(gate({candidateMarketDate:"2026-10-10",baseline,quotaSchedule,outcomeAccessOpened:false,maturityPromotionRequested:false}).reopenEligible,false);
assert.equal(gate({candidateMarketDate:"2026-10-09",baseline,quotaSchedule:{...quotaSchedule,verifiedAt:"2026-10-09T04:00:00.000Z"},outcomeAccessOpened:false,maturityPromotionRequested:false}).reopenEligible,false);
assert.equal(gate({candidateMarketDate:"2026-10-09",baseline,quotaSchedule,outcomeAccessOpened:true,maturityPromotionRequested:false}).reopenEligible,false);
assert.equal(gate({candidateMarketDate:"2026-10-09",baseline,quotaSchedule,outcomeAccessOpened:false,maturityPromotionRequested:true}).reopenEligible,false);

console.log(JSON.stringify({status:"PASS",assertions:32,state:valid.state}));
