export const PVE286_SCHEMA="D02_PVE286_SYSTEM1_FIRST_ELIGIBLE_ACCEPTANCE_CLOCK_V0_1";
const VALID_EVENT="schedule",VALID_SCHEDULE="10 16 * * 1-5";
const ms=v=>Number.isFinite(Date.parse(v))?Date.parse(v):null;
function taipeiDate(iso){
 const t=new Date(iso);
 return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(t);
}
function prevTaipeiDate(iso){
 const t=new Date(Date.parse(iso)-86400000);
 return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(t);
}
export function evaluatePve286Clock(x={}){
 const r=[],deploy=ms(x.mainAvailableAt),run=ms(x.scheduledRunAt);
 if(deploy===null)r.push("MAIN_AVAILABILITY_CLOCK_INVALID");
 if(run===null)r.push("SCHEDULED_RUN_CLOCK_INVALID");
 if(x.eventName!==VALID_EVENT)r.push("SCHEDULE_EVENT_REQUIRED");
 if(x.schedule!==VALID_SCHEDULE)r.push("EXPECTED_0010_TAIPEI_SCHEDULE_REQUIRED");
 if(deploy!==null&&run!==null&&run<=deploy)r.push("RUN_NOT_POST_DEPLOY");
 if(run!==null&&x.scanDate!==prevTaipeiDate(x.scheduledRunAt))r.push("SCAN_DATE_NOT_PREVIOUS_TAIPEI_DATE");
 if(run!==null){
   const local=x.scheduledRunAt.endsWith("Z")?new Date(x.scheduledRunAt):new Date(x.scheduledRunAt);
   const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Taipei",hour:"2-digit",minute:"2-digit",hour12:false}).format(local);
   if(parts!=="00:10")r.push("RUN_NOT_0010_TAIPEI");
 }
 return Object.freeze({
  schemaVersion:PVE286_SCHEMA,pass:r.length===0,reasons:Object.freeze([...new Set(r)]),
  scheduledTaipeiDate:run!==null?taipeiDate(x.scheduledRunAt):null,
  scanDate:x.scanDate??null,
  mayBecomeGenuineProspective:r.length===0,
  cleanProspectiveDateIncrementAuthorized:false,
  requiresPhysicalOperationalReceipt:true,
  maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false
 });
}
