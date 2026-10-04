const DATE=/^\d{4}-\d{2}-\d{2}$/;

function validDate(value,label){
  const date=String(value||"").trim();
  if(!DATE.test(date)||!Number.isFinite(Date.parse(date+"T00:00:00Z"))) throw new Error(label);
  return date;
}

export const SYSTEM1_POSTSESSION_SCHEDULE_V0_1=Object.freeze({
  schemaVersion:"SYSTEM1_POSTSESSION_SCHEDULE_V0_1",
  cronUtc:"45 6 * * 1-5",
  taipeiWallClock:"14:45",
  timezone:"Asia/Taipei",
  nonTradingDayBehavior:"SKIP_SUCCESS",
  tradingDayMissingEvidenceBehavior:"FAIL_WITH_EXPLICIT_BLOCKER",
  mayCountSkipAsZeroPick:false,
  researchOnly:true,
  formalCoreImpact:false
});

export function resolveSystem1PostSessionSchedule({
  eventName,requestedTradeDate="",taipeiToday,isTradingDate
}={}){
  const event=String(eventName||"");
  if(!["schedule","workflow_dispatch"].includes(event)) throw new Error("C3_POSTSESSION_EVENT_UNSUPPORTED");
  const today=validDate(taipeiToday,"C3_POSTSESSION_TAIPEI_DATE_INVALID");
  if(typeof isTradingDate!=="function") throw new Error("C3_POSTSESSION_TRADING_CALENDAR_REQUIRED");

  let targetTradeDate;
  if(event==="workflow_dispatch"){
    targetTradeDate=validDate(requestedTradeDate,"C3_POSTSESSION_MANUAL_TARGET_DATE_REQUIRED");
    if(targetTradeDate>today) throw new Error("C3_POSTSESSION_MANUAL_TARGET_IN_FUTURE");
  }else{
    if(String(requestedTradeDate||"").trim()) throw new Error("C3_POSTSESSION_SCHEDULE_MUST_NOT_OVERRIDE_DATE");
    targetTradeDate=today;
  }

  const trading=isTradingDate(targetTradeDate)===true;
  if(!trading&&event==="workflow_dispatch") throw new Error("C3_POSTSESSION_MANUAL_TARGET_NOT_TRADING_DAY");
  if(!trading){
    return {
      schemaVersion:"SYSTEM1_POSTSESSION_SCHEDULE_DECISION_V0_1",
      eventName:event,targetTradeDate,shouldRun:false,status:"SKIP_NON_TRADING_DAY",
      mayCountAsZeroPick:false,eligibleForResearch:false,noPlanChanges:true,noTrade:true,noPush:true,
      researchOnly:true,decisionImpact:false,formalCoreImpact:false
    };
  }
  return {
    schemaVersion:"SYSTEM1_POSTSESSION_SCHEDULE_DECISION_V0_1",
    eventName:event,targetTradeDate,shouldRun:true,status:"RUN_TRADING_DAY",
    missingEvidenceMustFail:true,mayCountAsZeroPick:false,eligibleForResearch:true,
    noPlanChanges:true,noTrade:true,noPush:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}
