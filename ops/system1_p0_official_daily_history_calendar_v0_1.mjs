// Pure date guards for zero-paid official TWSE/TPEx daily history repair.
// Trading sessions must come from the OFFICIAL TWSE calendar contract, not weekday guesses.
export function dateOffset(day,days) {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(String(day||""))||!Number.isInteger(days)||Math.abs(days)>400)
  throw Error("INVALID_DATE_OFFSET_INPUT");
 const d=new Date(day+"T00:00:00Z");
 if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==day)throw Error("INVALID_CALENDAR_DATE");
 d.setUTCDate(d.getUTCDate()+days);
 return d.toISOString().slice(0,10);
}
export function taipeiNowParts(now=new Date()){
 if(Number.isNaN(new Date(now).getTime()))throw Error("INVALID_NOW");
 const parts=new Intl.DateTimeFormat("en-CA",{
  timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit",
  hour:"2-digit",minute:"2-digit",hour12:false,hourCycle:"h23"
 }).formatToParts(new Date(now));
 const field=k=>parts.find(x=>x.type===k)?.value;
 return {day:field("year")+"-"+field("month")+"-"+field("day"),
  hour:Number(field("hour")),minute:Number(field("minute"))};
}
export function planOfficialSourceWindow({now,officialTradingDates,minimumTaipeiTime="15:45",maxWindowDays=15}={}){
 const tp=taipeiNowParts(now);
 const hhmm=String(tp.hour).padStart(2,"0")+":"+String(tp.minute).padStart(2,"0");
 if(hhmm<minimumTaipeiTime)throw Error("DAILY_OFFICIAL_NOT_AFTER_FINAL_SESSION");
 const floor=dateOffset(tp.day,-14);
 const list=Array.isArray(officialTradingDates)?officialTradingDates:[];
 if(!list.length||list.length>maxWindowDays||
   new Set(list).size!==list.length||
   list.some(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x)||x<floor||x>tp.day))
   throw Error("OFFICIAL_SESSION_CALENDAR_INVALID");
 const sessions=[...list].sort();
 const target=sessions.at(-1);
 if(!target||target<dateOffset(tp.day,-5))
   throw Error("LATEST_COMPLETED_OFFICIAL_SESSION_TOO_OLD");
 return {target,sourceStart:floor,tradingDates:sessions,
   calculatedForTaipeiDate:tp.day,source:"TWSE_OFFICIAL_TRADING_CALENDAR",
   actualSessionRequired:true,quoteDayNotInferredFromCron:true};
}
