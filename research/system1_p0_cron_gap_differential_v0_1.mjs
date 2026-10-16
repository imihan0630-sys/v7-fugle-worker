// Exact-date, read-only secondary witness. No missing-audit = no-Cron inference.
// Baseline spans LOCAL Taipei dates 2026-10-13 to 2026-10-15 inclusive.
export const INCIDENT_DATE="2026-10-15";
export const WINDOW_START="2026-10-15T15:20:00.000Z";
export const WINDOW_END="2026-10-15T16:20:00.000Z";
export const BASELINE_START="2026-10-12T16:00:00.000Z";
export const BASELINE_END="2026-10-15T16:00:00.000Z";
export const WINDOW_CAP=48,BASELINE_CAP=24;
// Unlike the first witness, deliberately do not constrain job_type. Check
// scheduled OR actual start time in case the scheduler metadata is malformed.
export const ANY_TYPE_SQL="SELECT id,cron_expression,scheduled_time,scheduled_at,started_at,finished_at,job_type,status,skipped,error FROM v7_cron_runs WHERE (scheduled_at>=?1 AND scheduled_at<?2) OR (started_at>=?1 AND started_at<?2) ORDER BY started_at ASC LIMIT 48";
export const BASELINE_SQL="SELECT date(scheduled_at,'+8 hours') AS tw_date,job_type,COUNT(*) AS row_count,MIN(scheduled_at) AS first_utc,MAX(scheduled_at) AS last_utc FROM v7_cron_runs WHERE scheduled_at>=?1 AND scheduled_at<?2 GROUP BY tw_date,job_type ORDER BY tw_date,job_type LIMIT 24";
const EXPECTED=["2026-10-15T15:35","2026-10-15T15:55"];
const iso=s=>{
 const n=Date.parse(String(s||""));
 return Number.isFinite(n)?new Date(n).toISOString():null;
};
function errorType(e){
 const text=String(e||"");
 if(!text)return null;
 if(/quota|rows.?written|row.?write|exceeded.?rows/i.test(text))return "D1_QUOTA_HINT_NOT_PROVEN";
 if(/cpu|exceededResources/i.test(text))return "CPU_HINT_NOT_PROVEN";
 if(/data_incomplete/i.test(text))return "DATA_INCOMPLETE_HINT_NOT_PROVEN";
 return "UNCLASSIFIED_ERROR";
}
export function classifyCronGap({date=INCIDENT_DATE,windowRows=null,baselineRows=null,observedAt=null,readError=null}={}){
 if(date!==INCIDENT_DATE)throw Error("UNAUTHORIZED_INCIDENT_DATE");
 const invariant={schema:"SYSTEM1_P0_ALL_JOB_TYPES_CRON_GAP_V0_1",date,observedAt,
   historicInvocationAbsentProven:false,formalParentProven:false,rootCauseProven:false,
   noD1Write:true,noKVWrite:true,noWorkerDeploy:true,noCronEdit:true,noTrade:true,noPush:true,
   queryOnly:true};
 if(readError)return {...invariant,state:"PHYSICAL_D1_READ_UNAVAILABLE",
   readErrorClass:/^[A-Z0-9_]{4,72}$/.test(String(readError))?readError:"READ_ERROR"};
 if(!Array.isArray(windowRows)||windowRows.length>WINDOW_CAP||
   !Array.isArray(baselineRows)||baselineRows.length>BASELINE_CAP)
   throw Error("RESPONSE_ROWS_MISSING_OR_UNBOUNDED");
 const truncated=windowRows.length===WINDOW_CAP||baselineRows.length===BASELINE_CAP;
 const window=windowRows.map(r=>{
   const schedule=iso(r?.scheduled_at),start=iso(r?.started_at);
   const time=Number(r?.scheduled_time);
   const scheduledTimeMatches=Number.isSafeInteger(time)&&
      Boolean(schedule)&&time===Date.parse(schedule);
   const scheduledSlot=schedule?.slice(0,16)||null;
   const expectedSlot=EXPECTED.includes(scheduledSlot)?scheduledSlot:null;
   const jobType=String(r?.job_type||"");
   const validId=Number.isSafeInteger(r?.id)&&r.id>0;
   const cron=String(r?.cron_expression||"").trim().toLowerCase().replace(/\s+/g," ");
   const expectedExpression=["35,55 15 * * mon-fri","35 15 * * mon-fri","55 15 * * mon-fri"].includes(cron);
   const end=iso(r?.finished_at);
   return {id:validId?r.id:null,scheduledAt:schedule,startedAt:start,finishedAt:end,
     jobType:jobType.slice(0,42),status:String(r?.status||"").slice(0,25),
     skipped:Number(r?.skipped)===1,errorClass:errorType(r?.error),
     expectedSlot,expectedExpression,
     scheduledTimeMatches,
     scheduleOrStartInWindow:([schedule,start].some(x=>x&&
       x>=WINDOW_START&&x<WINDOW_END)),
     chronological:!end||!start||end>=start};
 });
 const baseline=baselineRows.map(r=>({
   taipeiDate:String(r?.tw_date||""),jobType:String(r?.job_type||"").slice(0,42),
   count:Number(r?.row_count),firstUtc:iso(r?.first_utc),lastUtc:iso(r?.last_utc)
 }));
 const invalid=window.some(r=>!r.id||!r.scheduleOrStartInWindow||!r.chronological)
   ||baseline.some(r=>!["2026-10-13","2026-10-14","2026-10-15"].includes(r.taipeiDate)
      ||!Number.isSafeInteger(r.count)||r.count<0);
 const atSlots=window.filter(r=>r.expectedSlot);
 const otherTypeAtSlots=atSlots.filter(r=>r.jobType!=="AFTER_MARKET_SCAN");
 const classification=truncated?"READBACK_PAGE_LIMIT_FAIL_CLOSED":
    invalid?"READBACK_MALFORMED_FAIL_CLOSED":
    otherTypeAtSlots.length?"TARGET_SLOT_WITH_OTHER_JOB_TYPE_REQUIRES_REVIEW":
    atSlots.length?"TARGET_SLOT_AUDIT_PRESENT__FORMAL_UNVERIFIED":
    window.length?"NEARBY_AUDIT_ROWS_ONLY__TARGET_UNKNOWN":
    "NO_PERSISTED_CRON_IN_WINDOW__INVOCATION_UNKNOWN";
 return {...invariant,state:classification,
   window:{start:WINDOW_START,end:WINDOW_END,rows:window.length,
     pageLimitReached:windowRows.length===WINDOW_CAP,details:window},
   baseline:{fromTaipei:"2026-10-13",toTaipei:"2026-10-15",
     rows:baseline.length,pageLimitReached:baselineRows.length===BASELINE_CAP,
     byDayAndJobType:baseline},
   expectedSlots:EXPECTED,matchedSlotRecords:atSlots.length,
   unexpectedJobTypeAtSlots:otherTypeAtSlots.length,
   auditNoRowsDoesNotProveCronNeverRan:true,
   sourceRowsImmutable:true};
}
