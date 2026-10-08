export const LATE_TAIPEI_SCHEDULES=Object.freeze(["25 15 * * 1-5","45 15 * * 1-5"]);

function taipeiParts(now){
  const date=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
  const hour=Number(new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Taipei",hour:"2-digit",hourCycle:"h23"}).format(now));
  return {date,hour};
}
export function resolveScheduledMarketDate({now=new Date(),triggerSchedule=""}={}){
  const instant=now instanceof Date?now:new Date(now);
  if(!Number.isFinite(instant.getTime())) throw new Error("INVALID_SCHEDULE_CLOCK");
  const {date,hour}=taipeiParts(instant);
  if(LATE_TAIPEI_SCHEDULES.includes(String(triggerSchedule||"").trim())&&hour<12){
    return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"})
      .format(new Date(instant.getTime()-86400000));
  }
  return date;
}
export function resolveScheduledMarketContext({now=new Date(),triggerSchedule=""}={}){
  const instant=now instanceof Date?now:new Date(now);
  if(!Number.isFinite(instant.getTime())) throw new Error("INVALID_SCHEDULE_CLOCK");
  const {date:today}=taipeiParts(instant);
  const schedule=String(triggerSchedule||"").trim();
  const marketDate=resolveScheduledMarketDate({now:instant,triggerSchedule:schedule});
  return {
    marketDate,today,
    crossMidnightFallback:schedule==="45 15 * * 1-5"&&marketDate<today
  };
}
