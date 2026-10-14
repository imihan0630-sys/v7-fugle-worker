export const LATE_TAIPEI_SCHEDULES=Object.freeze(["25 15 * * 1-5","45 15 * * 1-5"]);

function taipeiParts(now){
  const date=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
  const clock=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Taipei",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(now);
  const [hour,minute]=clock.split(":").map(Number);
  return {date,hour,minute};
}
// A delayed evening official-data workflow must never run before its nominal
// Taipei start time on the next calendar day (including the afternoon).
// 23:45 historical recovery remains independent with frozen prior-day GETs.
export const SOURCE_SYNC_EARLIEST_TAIPEI_MINUTE=Object.freeze({
  "55 9 * * 1-5":17*60+55,
  "5 10 * * 1-5":18*60+5,
  "20 10 * * 1-5":18*60+20,
  "25 15 * * 1-5":23*60+25
});
export function shouldSkipOvernightDelayedSourceSync({now=new Date(),triggerSchedule=""}={}){
  const instant=now instanceof Date?now:new Date(now);
  if(!Number.isFinite(instant.getTime())) throw new Error("INVALID_SCHEDULE_CLOCK");
  const schedule=String(triggerSchedule||"").trim();
  const earliest=SOURCE_SYNC_EARLIEST_TAIPEI_MINUTE[schedule];
  if(earliest===undefined) return false;
  const {hour,minute}=taipeiParts(instant);
  return hour*60+minute<earliest;
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
    crossMidnightFallback:schedule==="45 15 * * 1-5"&&marketDate<today,
    overnightSourceSyncSkip:shouldSkipOvernightDelayedSourceSync({now:instant,triggerSchedule:schedule})
  };
}

/**
 * Fail-closed source-only trading-day gate; dependency injection makes real
 * calendar I/O bypass behavior executable in CI (not merely text-matched).
 * This never invokes business scan, D1, KV, Cloudflare deployment or push.
 */
export async function resolveScheduledTradingGate({context,marketDate,loadTradingCalendar,isTradingDate}={}){
  if(!context||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(String(marketDate||""))) {
    throw new Error("S1_TRADING_GATE_CONTEXT_INVALID");
  }
  if(context.overnightSourceSyncSkip===true){
    return {tradingDay:null,proceed:false,calendarChecked:false};
  }
  if(typeof loadTradingCalendar!=="function"||typeof isTradingDate!=="function"){
    throw new Error("S1_TRADING_CALENDAR_DEPENDENCIES_REQUIRED");
  }
  await loadTradingCalendar({},Number(marketDate.slice(0,4)));
  const tradingDay=isTradingDate(marketDate);
  if(typeof tradingDay!=="boolean") throw new Error("S1_TRADING_DAY_VERDICT_NOT_BOOLEAN");
  return {tradingDay,proceed:tradingDay,calendarChecked:true};
}
