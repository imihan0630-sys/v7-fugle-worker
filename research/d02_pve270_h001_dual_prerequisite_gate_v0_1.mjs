export const PVE270_SCHEMA="D02_PVE270_H001_DUAL_PREREQUISITE_GATE_V0_1";

const nonEmpty=v=>typeof v==="string"&&v.trim().length>0;
const sha256=v=>typeof v==="string"&&/^[0-9a-f]{64}$/i.test(v);
const iso=v=>Number.isFinite(Date.parse(v));
const date=v=>/^\d{4}-\d{2}-\d{2}$/.test(String(v||""));

function fail(reasons,code,condition){if(!condition)reasons.push(code);}

export function evaluateBaselinePrerequisite(input={}){
  const reasons=[];
  fail(reasons,"BASELINE_REMEDIATION_NOT_OWNER_APPROVED",input.ownerApproved===true);
  fail(reasons,"BASELINE_REMEDIATION_NOT_DEPLOYED",input.deployed===true);
  fail(reasons,"BASELINE_REMEDIATION_NOT_PHYSICALLY_ACCEPTED",input.productionRemediationAccepted===true);
  fail(reasons,"BASELINE_MARKET_DATE_INVALID",date(input.marketDate));
  fail(reasons,"BASELINE_AS_OF_DATE_INVALID",date(input.baselineAsOfDate));
  fail(reasons,"EXPECTED_PRIOR_SLOT_DATE_INVALID",date(input.expectedLatestComparableSlotDate));
  fail(reasons,"BASELINE_NOT_EXACT_PRIOR_SLOT",
    date(input.baselineAsOfDate)&&date(input.expectedLatestComparableSlotDate)&&input.baselineAsOfDate===input.expectedLatestComparableSlotDate);
  fail(reasons,"BASELINE_NOT_STRICTLY_PRE_FEATURE",
    date(input.marketDate)&&date(input.baselineAsOfDate)&&input.baselineAsOfDate<input.marketDate);
  fail(reasons,"EXACT_SLOT_VALIDITY_NOT_PASS",input.sameSlotHistoryValidityState==="PASS");
  fail(reasons,"CORPORATE_ACTION_CONTINUITY_NOT_PROVEN",
    ["CLEAN","BRIDGE_VERIFIED","RESET_CLEAN_GE20"].includes(input.corporateActionContinuityState));
  fail(reasons,"CURRENT_SESSION_LEAKAGE_NOT_EXCLUDED",input.currentSessionExcludedFromBaseline===true);
  fail(reasons,"FUTURE_LEAKAGE_NOT_EXCLUDED",input.futureDatesAbsent===true);
  fail(reasons,"RAW_PROVIDER_HASH_INVALID",sha256(input.rawPayloadHash));
  fail(reasons,"RAW_PROVIDER_HASH_BASIS_INVALID",input.rawPayloadHashBasis==="EXACT_PROVIDER_RESPONSE_SHA256");
  fail(reasons,"FEATURE_CAPTURE_TIME_INVALID",iso(input.featureCapturedAt));
  fail(reasons,"DEPLOY_TIME_INVALID",iso(input.deployedAt));
  fail(reasons,"FEATURE_NOT_POST_DEPLOY",iso(input.featureCapturedAt)&&iso(input.deployedAt)&&Date.parse(input.featureCapturedAt)>Date.parse(input.deployedAt));
  fail(reasons,"DECISION_IMPACT_NOT_ZERO",input.decisionImpact===0);
  fail(reasons,"RETROACTIVE_DATE_FORBIDDEN",input.retroactiveCleanDateGranted===false);
  return Object.freeze({pass:reasons.length===0,reasons:Object.freeze(reasons)});
}

export function evaluateQuotaSchedulePrerequisite(input={}){
  const reasons=[];
  fail(reasons,"CORR003_NOT_INDEPENDENTLY_VERIFIED",input.corr003IndependentVerificationPass===true);
  fail(reasons,"ACCOUNT_LEVEL_QUOTA_GATE_NOT_ACTIVE",input.accountQuotaGateActive===true);
  fail(reasons,"SYSTEM1_AFTER_MARKET_RESERVE_NOT_PROTECTED",input.system1AfterMarketReserveProtected===true);
  fail(reasons,"ACCOUNT_USAGE_NOT_KNOWN_OR_CONSERVATIVELY_BLOCKED",input.accountUsageKnownOrConservativeBlock===true);
  fail(reasons,"SCHEDULE_STATE_NOT_SUCCESS",input.scheduleEvidenceState==="BUSINESS_EXECUTION_SUCCESS");
  fail(reasons,"BUSINESS_SCAN_SUCCESS_COUNT_NOT_ONE",input.successfulBusinessExecutionCount===1);
  fail(reasons,"NORMAL_PRODUCTION_RECEIPT_MISSING",input.normalProductionReceiptPersisted===true);
  fail(reasons,"QUOTA_REJECTION_PRESENT",input.quotaRejectionObserved===false);
  fail(reasons,"TRIGGER_WRITE_FAILURE_OBSERVABILITY_INCOMPLETE",input.triggerAbsenceVsWriteFailureDistinguishable===true);
  fail(reasons,"PAID_UPGRADE_OCCURRED",input.paidUpgradePerformed===false);
  fail(reasons,"SYSTEM1_FORMAL_CORE_CHANGE_DETECTED",input.system1FormalCoreUnchanged===true);
  fail(reasons,"SYSTEM2_STRATEGY_CHANGE_DETECTED",input.system2StrategySemanticsUnchanged===true);
  fail(reasons,"QUOTA_VERIFICATION_TIME_INVALID",iso(input.verifiedAt));
  return Object.freeze({pass:reasons.length===0,reasons:Object.freeze(reasons)});
}

export function evaluatePve270H001Reopen(input={}){
  const baseline=evaluateBaselinePrerequisite(input.baseline||{});
  const quota=evaluateQuotaSchedulePrerequisite(input.quotaSchedule||{});
  const reasons=[...baseline.reasons,...quota.reasons];

  if(input.candidateMarketDate&&input.baseline?.marketDate&&input.candidateMarketDate!==input.baseline.marketDate){
    reasons.push("CANDIDATE_BASELINE_MARKET_DATE_MISMATCH");
  }
  if(iso(input.quotaSchedule?.verifiedAt)&&iso(input.baseline?.featureCapturedAt)&&
     Date.parse(input.quotaSchedule.verifiedAt)>=Date.parse(input.baseline.featureCapturedAt)){
    reasons.push("QUOTA_ACCEPTANCE_NOT_PRE_FEATURE");
  }
  if(input.outcomeAccessOpened===true) reasons.push("OUTCOME_ACCESS_MUST_REMAIN_CLOSED_AT_REOPEN_GATE");
  if(input.maturityPromotionRequested===true) reasons.push("MATURITY_PROMOTION_NOT_AUTHORIZED_BY_REOPEN_GATE");

  const reopenEligible=baseline.pass&&quota.pass&&reasons.length===0;
  return Object.freeze({
    schemaVersion:PVE270_SCHEMA,
    baselinePrerequisite:baseline,
    quotaSchedulePrerequisite:quota,
    reopenEligible,
    state:reopenEligible?"H001_PROSPECTIVE_ADMISSION_REOPEN_ELIGIBLE":"H001_FAIL_CLOSED",
    reasons:Object.freeze(reasons),
    outcomeAccessAuthorized:false,
    maturityPromotionAuthorized:false,
    formalCoreChangeAuthorized:false,
    retroactiveAdmissionAuthorized:false
  });
}
