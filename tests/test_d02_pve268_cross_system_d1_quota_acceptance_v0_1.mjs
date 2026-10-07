import assert from "node:assert/strict";
import {evaluateQuotaAdmissionV0_1 as budget,evaluateCrossSystemPhysicalAcceptanceV0_1 as physical} from "../research/d02_pve268_cross_system_d1_quota_acceptance_v0_1.mjs";

const base={
 officialRowsWrittenLimit:100000,vendorContractSource:"CLOUDFLARE_D1_FREE_2026-09-01",
 utcQuotaDay:"2026-10-08",accountUsageKnown:true,accountRowsWrittenObserved:40000,
 system1AfterMarketReserveRows:10000,system1ReserveEvidenceSource:"MEASURED_V7_AFTER_MARKET_BUDGET_RECEIPT",
 requestedWriterReservationRows:20000,writerPriority:"P2",
 separateDatabaseIdsProvideQuotaIsolation:false,paidUpgradeAuthorized:false
};
assert.equal(budget(base).state,"QUOTA_RESERVATION_ADMISSIBLE");
assert.equal(budget({...base,accountRowsWrittenObserved:80000}).state,"QUOTA_BUDGET_DEFER");
assert.equal(budget({...base,accountRowsWrittenObserved:100000}).state,"QUOTA_EXHAUSTED");
assert.equal(budget({...base,accountUsageKnown:false}).state,"UNKNOWN_BLOCK");
assert.equal(budget({...base,system1AfterMarketReserveRows:null}).state,"UNKNOWN_BLOCK");
assert.equal(budget({...base,system1ReserveEvidenceSource:""}).state,"UNKNOWN_BLOCK");
assert.equal(budget({...base,separateDatabaseIdsProvideQuotaIsolation:true}).state,"UNKNOWN_BLOCK");
assert.equal(budget({...base,paidUpgradeAuthorized:true}).state,"UNKNOWN_BLOCK");
assert.equal(budget({...base,requestedWriterReservationRows:60000}).writerMayMutate,false);

const p={
 quotaGateAppliedBeforeAfterMarket:true,system1ReserveGranted:true,primary2355FamilyInvoked:true,
 businessScanSuccessCount:1,normalProductionReceiptPersisted:true,quotaRejectionObserved:false,
 triggerAbsenceVsWriteFailureDistinguishable:true,system1FormalCoreUnchanged:true,
 system2StrategySemanticsUnchanged:true,liveCapitalOrderAuthorityChanged:false,
 paidUpgradePerformed:false,retroactiveCleanDateGranted:false
};
assert.equal(physical(p).pass,true);
for(const [k,v] of [
 ["quotaGateAppliedBeforeAfterMarket",false],["system1ReserveGranted",false],["primary2355FamilyInvoked",false],
 ["businessScanSuccessCount",0],["businessScanSuccessCount",2],["normalProductionReceiptPersisted",false],
 ["quotaRejectionObserved",true],["triggerAbsenceVsWriteFailureDistinguishable",false],
 ["system1FormalCoreUnchanged",false],["system2StrategySemanticsUnchanged",false],
 ["liveCapitalOrderAuthorityChanged",true],["paidUpgradePerformed",true],["retroactiveCleanDateGranted",true]
]) assert.equal(physical({...p,[k]:v}).pass,false,k);

console.log(JSON.stringify({status:"PASS",assertions:22}));
