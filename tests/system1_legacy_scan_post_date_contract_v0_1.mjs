// Contract for the DEPLOYED legacy /api/scan endpoint.
// Production Worker currently calls runAfterMarketScan(env,Date.now(),...) and
// ignores JSON body.marketDate. Its market session is therefore Taipei *today*.
// Do not let a GitHub recovery job call that endpoint for a pinned prior day.
export function classifyLegacyScanPostDate({now=new Date(),targetDate}={}){
  const instant=now instanceof Date?now:new Date(now);
  if(!Number.isFinite(instant.getTime()))throw Error("INVALID_RECOVERY_CLOCK");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(targetDate||""))||
     new Date(targetDate+"T00:00:00Z").toISOString().slice(0,10)!==targetDate)
    throw Error("INVALID_RECOVERY_TARGET_DATE");
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",
    year:"numeric",month:"2-digit",day:"2-digit",
    hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(instant);
  const value=k=>parts.find(x=>x.type===k)?.value;
  const day=`${value("year")}-${value("month")}-${value("day")}`;
  const localTime=`${value("hour")}:${value("minute")}`;
  const currentDateMatches=targetDate===day;
  const inApprovedLateWindow=localTime>="23:35"&&localTime<="23:59";
  return {mayPost:currentDateMatches&&inApprovedLateWindow,
    targetDate,workerEffectiveDate:day,localTime,
    workerHonorsBodyMarketDate:false,
    reason:!currentDateMatches?"LEGACY_WORKER_IGNORES_PINNED_PRIOR_DAY":
      !inApprovedLateWindow?"OUTSIDE_ORIGINAL_SAME_DAY_RECOVERY_WINDOW":"SAME_DAY_WINDOW_ONLY",
    noBusinessPostOnMismatch:true,noTrade:true,noPush:true};
}

// Never probe capabilities for arbitrary historical dates or late (>07:00)
// dispatches; the only exception is the previous Taipei civil calendar day.
export function mayProbePinnedPriorDayCapability({targetDate,now=new Date(),scheduledFallback=false}={}){
  const base=classifyLegacyScanPostDate({targetDate,now});
  const day=base.workerEffectiveDate;
  const prior=new Date(Date.parse(day+"T12:00:00Z")-86400000).toISOString().slice(0,10);
  return scheduledFallback===true&&targetDate===prior&&base.localTime<"07:00";
}
export function verifiedPinnedPriorDayCapability(capability){
  return capability?.ok===true&&
    capability?.pinnedMarketDateSupported===true&&
    capability?.legacyDateBodyIgnored===false&&
    capability?.priorDayFallbackRequiresOnlyIfMissing===true&&
    capability?.priorDayTaipeiCutoff==="07:00"&&
    capability?.maxHistoricalRewindDays===1;
}
