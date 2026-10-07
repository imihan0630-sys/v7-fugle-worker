export const PVE269_SCHEMA="D02_PVE269_SCHEDULE_EVIDENCE_FUSION_V0_1";

const text=v=>typeof v==="string"?v:"";
const rows=v=>Array.isArray(v)?v:[];

function isSuccess(row){
  const status=text(row?.status).toUpperCase();
  return ["SUCCESS","COMPLETE","COMPLETED"].includes(status) && Number(row?.skipped||0)!==1;
}
function isFailure(row){
  const status=text(row?.status).toUpperCase();
  return ["FAILED","FAILURE","ERROR"].includes(status);
}
function clock(row){return text(row?.taipeiClock||row?.clock);}
function quotaError(value){return /D1.*(?:row write|write limit)|free tier daily row write limit|quota/i.test(text(value));}

export function deriveAfterMarketScheduleEvidenceV0_1(input={}){
  const configured=input.familyConfigured===true;
  const cronRows=rows(input.cronRows).filter(r=>["23:35","23:55"].includes(clock(r)));
  const attempt=input.lastScanAttempt&&typeof input.lastScanAttempt==="object"?input.lastScanAttempt:null;
  const leases=rows(input.leaseReceipts);
  const successes=cronRows.filter(isSuccess);
  const failures=cronRows.filter(isFailure);
  const primaryRow=cronRows.find(r=>clock(r)==="23:35")||null;
  const recoveryRow=cronRows.find(r=>clock(r)==="23:55")||null;
  const primaryAttemptSeen=Boolean(attempt&&/23:3[5-9]/.test(text(attempt.generatedAtTaipei||attempt.generatedAt)));
  const attemptFailed=text(attempt?.status).toUpperCase()==="FAILED";
  const quotaFailure=attemptFailed&&quotaError(attempt?.error);
  const recoveryLeaseSeen=leases.some(x=>/23:5[5-9]/.test(text(x.updatedAtTaipei||x.updatedAt)));
  const invocationProven=Boolean(cronRows.length||primaryAttemptSeen||recoveryLeaseSeen);

  const reasons=[];
  let state="UNOBSERVED";
  if(!configured){
    state="FAMILY_NOT_CONFIGURED";
    reasons.push("PRIMARY_RECOVERY_FAMILY_NOT_CONFIGURED");
  }else if(successes.length>1){
    state="DUPLICATE_BUSINESS_EXECUTION";
    reasons.push("MORE_THAN_ONE_SUCCESSFUL_BUSINESS_EXECUTION");
  }else if(successes.length===1){
    state="BUSINESS_EXECUTION_SUCCESS";
    if(!primaryRow&&!recoveryRow) reasons.push("SUCCESS_CLOCK_IDENTITY_MISSING");
  }else if(quotaFailure){
    state="INVOKED_EXECUTION_FAILED_D1_QUOTA";
    reasons.push("D1_ACCOUNT_WRITE_QUOTA_EXHAUSTED");
  }else if(failures.length){
    state="INVOKED_EXECUTION_FAILED";
    reasons.push("CRON_EXECUTION_FAILURE");
  }else if(invocationProven){
    state="INVOKED_AUDIT_ROW_UNAVAILABLE";
    reasons.push("INDEPENDENT_INVOCATION_EVIDENCE_WITHOUT_D1_CRON_ROW");
  }else{
    reasons.push("NO_INVOCATION_EVIDENCE");
  }

  return Object.freeze({
    schemaVersion:PVE269_SCHEMA,
    state,
    configured,
    invocationProven,
    primaryAttemptSeen,
    recoveryLeaseSeen,
    cronRowCount:cronRows.length,
    successfulBusinessExecutionCount:successes.length,
    reasons:Object.freeze(reasons),
    scheduleFamilyPass:state==="BUSINESS_EXECUTION_SUCCESS"&&successes.length===1,
    cleanH001DateAuthorized:false,
    maturityPromotionAuthorized:false,
    formalCoreChangeAuthorized:false
  });
}
