// System1 P0 read-only preincident breakpoint witness, fixed Oct 6-12 Taipei.
// Baseline is evidence of stored audit records, not proof of Cron invocation.
export const PRE_START="2026-10-05T16:00:00.000Z";
export const PRE_END="2026-10-12T16:00:00.000Z";
export const AGGREGATE_CAP=40;
export const SLOT_CAP=28;
export const AGGREGATE_SQL="SELECT date(scheduled_at,'+8 hours') AS tw_date,job_type,COUNT(*) AS row_count,MIN(scheduled_at) AS first_utc,MAX(scheduled_at) AS last_utc FROM v7_cron_runs WHERE scheduled_at>=?1 AND scheduled_at<?2 GROUP BY tw_date,job_type ORDER BY tw_date,job_type LIMIT 40";
export const SLOT_SQL="SELECT id,scheduled_at,started_at,finished_at,status,skipped,cron_expression,error FROM v7_cron_runs WHERE scheduled_at>=?1 AND scheduled_at<?2 AND job_type='AFTER_MARKET_SCAN' ORDER BY scheduled_at ASC LIMIT 28";
const iso=s=>{let n=Date.parse(String(s||""));return Number.isFinite(n)?new Date(n).toISOString():null;};
const dayOk=x=>typeof x==="string"&&x>="2026-10-06"&&x<="2026-10-12";
const slotTime=isoStr=>isoStr&&isoStr>="2026-10-05T16:00:00.000Z"&&isoStr<"2026-10-12T16:00:00.000Z";
function errType(e){
 const m=String(e||"");
 if(!m)return null;
 if(/quota|rows.?written|row.?write|exceeded.?rows/i.test(m))return "D1_QUOTA_HINT_NOT_ROOT_CAUSE_PROOF";
 if(/cpu|exceededResources/i.test(m))return "CPU_HINT_NOT_ROOT_CAUSE_PROOF";
 if(/time.?out/i.test(m))return "TIMEOUT_HINT_NOT_ROOT_CAUSE_PROOF";
 return "ERROR_REDACTED";
}
export function classifyPreincident({groups,slots,readError=null,observedAt=null}={}){
 const common={schema:"SYSTEM1_P0_CRON_PREINCIDENT_OCT06_12_V0_1",
  observedAt,incidentDate:"2026-10-15",baselineFrom:"2026-10-06",baselineTo:"2026-10-12",
  noInvocationAbsenceInference:true,formalParentProven:false,rootCauseProven:false,
  queryOnly:true,noD1Write:true,noKVWrite:true,noCronChange:true,noWorkerDeploy:true,noPush:true,noTrade:true};
 if(readError)return {...common,state:"PHYSICAL_READ_UNAVAILABLE",
  readErrorClass:/^[A-Z0-9_]{4,72}$/.test(readError)?readError:"READ_ERROR"};
 if(!Array.isArray(groups)||groups.length>AGGREGATE_CAP||!Array.isArray(slots)||slots.length>SLOT_CAP)
  throw Error("BASELINE_RESPONSE_UNBOUNDED");
 const reports=groups.map(g=>({date:String(g?.tw_date||""),
  jobType:String(g?.job_type||"").slice(0,40),count:Number(g?.row_count),
  first:iso(g?.first_utc),last:iso(g?.last_utc)}));
 const events=slots.map(x=>({id:Number(x?.id),scheduled:iso(x?.scheduled_at),
  started:iso(x?.started_at),finished:iso(x?.finished_at),
  status:String(x?.status||"").slice(0,25),skipped:Number(x?.skipped)===1,
  cronExpression:String(x?.cron_expression||"").slice(0,80),
  errorClass:errType(x?.error)}));
 const malformed=reports.some(g=>!dayOk(g.date)||!g.jobType||
  !Number.isSafeInteger(g.count)||g.count<1||!slotTime(g.first)||!slotTime(g.last))
  ||events.some(e=>!Number.isSafeInteger(e.id)||e.id<1||!slotTime(e.scheduled)||
   !e.started||(e.finished&&e.finished<e.started))
  ||slots.length>reports.filter(g=>g.jobType==="AFTER_MARKET_SCAN").reduce((sum,g)=>sum+g.count,0);
 const state=groups.length===AGGREGATE_CAP||slots.length===SLOT_CAP?
   "TRUNCATED_FAIL_CLOSED":malformed?"MALFORMED_FAIL_CLOSED":
   events.length?"PREINCIDENT_AFTERMARKET_AUDITS_EXIST":
   "NO_PREINCIDENT_AFTERMARKET_AUDITS_IN_RANGE";
 return {...common,state,counts:{groupRows:groups.length,afterMarketRows:events.length,
  truncated:groups.length===AGGREGATE_CAP||slots.length===SLOT_CAP},
  daily:reports,afterMarketSlots:events,
  missingAuditDoesNotProveCronNeverRan:true};
}
