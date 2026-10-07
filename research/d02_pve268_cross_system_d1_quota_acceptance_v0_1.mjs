export const PVE268_SCHEMA="D02_PVE268_CROSS_SYSTEM_D1_QUOTA_ACCEPTANCE_V0_1";

const nonEmpty=v=>typeof v==="string"&&v.trim().length>0;
const int=v=>Number.isInteger(v)&&v>=0;

export function evaluateQuotaAdmissionV0_1(input={}){
  const reasons=[];
  if(!int(input.officialRowsWrittenLimit)||input.officialRowsWrittenLimit<=0) reasons.push("OFFICIAL_WRITE_LIMIT_INVALID");
  if(!nonEmpty(input.vendorContractSource)) reasons.push("VENDOR_CONTRACT_SOURCE_MISSING");
  if(!nonEmpty(input.utcQuotaDay)) reasons.push("UTC_QUOTA_DAY_MISSING");
  if(input.accountUsageKnown!==true) reasons.push("ACCOUNT_USAGE_UNKNOWN");
  if(input.accountUsageKnown===true&&!int(input.accountRowsWrittenObserved)) reasons.push("ACCOUNT_USAGE_INVALID");
  if(!int(input.system1AfterMarketReserveRows)||input.system1AfterMarketReserveRows<=0) reasons.push("SYSTEM1_RESERVE_UNKNOWN");
  if(!nonEmpty(input.system1ReserveEvidenceSource)) reasons.push("SYSTEM1_RESERVE_EVIDENCE_MISSING");
  if(!int(input.requestedWriterReservationRows)) reasons.push("REQUESTED_WRITER_RESERVATION_INVALID");
  if(!["P0","P1","P2","P3"].includes(input.writerPriority)) reasons.push("WRITER_PRIORITY_INVALID");
  if(input.separateDatabaseIdsProvideQuotaIsolation!==false) reasons.push("SEPARATE_DB_QUOTA_ISOLATION_FALSE_REQUIRED");
  if(input.paidUpgradeAuthorized!==false) reasons.push("PAID_UPGRADE_MUST_REMAIN_UNAUTHORIZED");

  const numericReady=reasons.every(x=>![
    "OFFICIAL_WRITE_LIMIT_INVALID","ACCOUNT_USAGE_UNKNOWN","ACCOUNT_USAGE_INVALID",
    "SYSTEM1_RESERVE_UNKNOWN","REQUESTED_WRITER_RESERVATION_INVALID"
  ].includes(x));
  let projected=null,state="UNKNOWN_BLOCK";
  if(numericReady){
    projected=input.accountRowsWrittenObserved+input.system1AfterMarketReserveRows+input.requestedWriterReservationRows;
    if(input.accountRowsWrittenObserved>=input.officialRowsWrittenLimit) state="QUOTA_EXHAUSTED";
    else if(projected>input.officialRowsWrittenLimit) state="QUOTA_BUDGET_DEFER";
    else state="QUOTA_RESERVATION_ADMISSIBLE";
  }
  if(reasons.length) state="UNKNOWN_BLOCK";
  return Object.freeze({
    schemaVersion:PVE268_SCHEMA,state,reasons:Object.freeze(reasons),
    projectedRowsWritten:projected,
    writerMayMutate:state==="QUOTA_RESERVATION_ADMISSIBLE",
    system1ReserveProtected:state==="QUOTA_RESERVATION_ADMISSIBLE",
    billingMutationAuthorized:false,
    formalCoreChangeAuthorized:false
  });
}

export function evaluateCrossSystemPhysicalAcceptanceV0_1(input={}){
  const reasons=[];
  if(input.quotaGateAppliedBeforeAfterMarket!==true) reasons.push("QUOTA_GATE_NOT_PROVEN_BEFORE_AFTER_MARKET");
  if(input.system1ReserveGranted!==true) reasons.push("SYSTEM1_RESERVE_NOT_GRANTED");
  if(input.primary2355FamilyInvoked!==true) reasons.push("PRIMARY_RECOVERY_FAMILY_INVOCATION_NOT_PROVEN");
  if(input.businessScanSuccessCount!==1) reasons.push("EXACTLY_ONE_BUSINESS_SCAN_SUCCESS_REQUIRED");
  if(input.normalProductionReceiptPersisted!==true) reasons.push("NORMAL_PRODUCTION_RECEIPT_MISSING");
  if(input.quotaRejectionObserved!==false) reasons.push("QUOTA_REJECTION_PRESENT_OR_UNKNOWN");
  if(input.triggerAbsenceVsWriteFailureDistinguishable!==true) reasons.push("TRIGGER_WRITE_FAILURE_OBSERVABILITY_INCOMPLETE");
  if(input.system1FormalCoreUnchanged!==true) reasons.push("SYSTEM1_FORMAL_CORE_UNCHANGED_NOT_PROVEN");
  if(input.system2StrategySemanticsUnchanged!==true) reasons.push("SYSTEM2_STRATEGY_SEMANTICS_UNCHANGED_NOT_PROVEN");
  if(input.liveCapitalOrderAuthorityChanged!==false) reasons.push("LIVE_CAPITAL_ORDER_AUTHORITY_MUST_NOT_CHANGE");
  if(input.paidUpgradePerformed!==false) reasons.push("PAID_UPGRADE_MUST_NOT_OCCUR");
  if(input.retroactiveCleanDateGranted!==false) reasons.push("RETROACTIVE_CLEAN_DATE_FORBIDDEN");
  return Object.freeze({
    schemaVersion:PVE268_SCHEMA,pass:reasons.length===0,reasons:Object.freeze(reasons),
    correctionClosureEvidenceEligible:reasons.length===0,
    maturityPromotionAuthorized:false,
    formalCoreChangeAuthorized:false
  });
}
