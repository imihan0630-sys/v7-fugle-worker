export const PVE289_SCHEMA="D02_PVE289_EXTERNAL_RECEIPT_CONVERGENCE_GUARD_V0_1";
const STATES=Object.freeze({
 d16:"WAITING_D16_METHOD_RECEIPTS",
 d14:"WAITING_D14_COST_QUALITY_RECEIPT",
 s1:"FUTURE_SCHEDULED_PHYSICAL_RECEIPT_NOT_YET_OBSERVED",
 baseline:"WAITING_PHYSICAL_DEPLOYED_PASS",
 quota:"OPEN",
 target:"NO_LEGAL_SOURCE"
});
export function evaluatePve289Snapshot(x={}){
 const r=[],l=x.lanes||{};
 if(x.schemaVersion!=="D02_PVE289_EXTERNAL_RECEIPT_CONVERGENCE_SNAPSHOT_V0_1")r.push("SNAPSHOT_SCHEMA_MISMATCH");
 if(x.status!=="WAITING_NEW_IMMUTABLE_PRODUCER_RECEIPTS")r.push("SNAPSHOT_STATUS_MISMATCH");
 if(Number(x.d02MaturityPct)!==60)r.push("D02_MATURITY_MISMATCH");
 if(Number(x.cleanProspectiveDates)!==0)r.push("CLEAN_DATE_COUNT_MUST_REMAIN_ZERO");
 if(x.gate7!=="CLOSED")r.push("GATE7_MUST_REMAIN_CLOSED");
 if(x.formalCore!=="LOCKED")r.push("FORMAL_CORE_MUST_REMAIN_LOCKED");
 if(l.d16PredictiveMethods?.state!==STATES.d16||Number(l.d16PredictiveMethods?.validFrozenReceiptCount)!==0)r.push("D16_METHOD_STATE_MISMATCH");
 if(l.d14D0211CostQuality?.state!==STATES.d14||l.d14D0211CostQuality?.receiptObserved!==false)r.push("D14_COST_STATE_MISMATCH");
 if(l.system1OperationalAcceptance?.state!==STATES.s1||l.system1OperationalAcceptance?.operationalReceiptObserved!==false)r.push("SYSTEM1_OPERATIONAL_STATE_MISMATCH");
 if(l.pve261BaselineRemediation?.state!==STATES.baseline||l.pve261BaselineRemediation?.physicalPassObserved!==false)r.push("PVE261_STATE_MISMATCH");
 if(l.corr003QuotaRemediation?.directiveId!=="S2-CORR-20261007-003"||l.corr003QuotaRemediation?.state!==STATES.quota||l.corr003QuotaRemediation?.physicalClosureObserved!==false)r.push("CORR003_STATE_MISMATCH");
 if(l.numericalTargetSource?.state!==STATES.target||Number(l.numericalTargetSource?.legalSourceCount)!==0)r.push("NUMERICAL_TARGET_SOURCE_STATE_MISMATCH");
 const f=new Set(Array.isArray(x.forbiddenTransitions)?x.forbiddenTransitions:[]);
 for(const v of [
   "NO_NEW_RECEIPT -> REPEAT_CLOSED_RESEARCH",
   "WORKFLOW_GREEN -> PHYSICAL_RECEIPT_PASS",
   "SYSTEM1_OPERATIONAL_PASS -> D02_CLEAN_DATE",
   "LATE_BASELINE_REMEDIATION -> RETROACTIVE_CLEAN_DATE",
   "FIXTURE_VALUE -> NUMERICAL_TARGET",
   "ONE_LANE_RECEIPT -> OTHER_LANE_ADVANCE"
 ]) if(!f.has(v))r.push("FORBIDDEN_TRANSITION_MISSING:"+v);
 if(x.outcomeAccessAuthorized!==false)r.push("OUTCOME_ACCESS_MUST_REMAIN_FALSE");
 if(x.maturityPromotionAuthorized!==false)r.push("MATURITY_PROMOTION_MUST_REMAIN_FALSE");
 if(x.formalCoreChangeAuthorized!==false)r.push("FORMAL_CHANGE_MUST_REMAIN_FALSE");
 return Object.freeze({
   schemaVersion:PVE289_SCHEMA,
   pass:r.length===0,
   reasons:Object.freeze([...new Set(r)]),
   state:r.length===0?"WAITING_EXTERNAL_RECEIPTS":"INVALID_CONVERGENCE_SNAPSHOT",
   safeToSkipClosedResearch:r.length===0,
   cleanProspectiveDateIncrementAuthorized:false,
   maturityPromotionAuthorized:false,
   formalCoreChangeAuthorized:false
 });
}
