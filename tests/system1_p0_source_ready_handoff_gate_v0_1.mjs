// P0 actual source-ready -> same-day Formal scan admission.
// This pure gate authorizes at most the EXISTING one guarded business POST
// after a genuine same-day deployed Formal Cron pre-commit DATA_INCOMPLETE failure.
// Unknown CPU/transport/partial-write failures are NOT a safe retry.
const format=(instant)=>{
  const d=instant instanceof Date?instant:new Date(instant);
  if(!Number.isFinite(d.getTime()))throw Error("INVALID_SOURCE_HANDOFF_CLOCK");
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",
    month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(d);
  const v=k=>parts.find(x=>x.type===k)?.value;
  return {date:`${v("year")}-${v("month")}-${v("day")}`,time:`${v("hour")}:${v("minute")}`};
};
const DAY=/^20\d{2}-\d{2}-\d{2}$/;
export function classifySourceReadyFormalHandoff({now=new Date(),targetDate,
 scan=null,institution=null,quality=null,recommendations=null,cron=null}={}){
  const clock=format(now);
  const base={targetDate,localDate:clock.date,localTime:clock.time,
    eligible:false,mayPost:false,noRepeatedPost:true,
    noTrade:true,requiresExactSourceDate:true,retainsOriginalCore:true};
  const out=(reason,extra={})=>({...base,reason,...extra});
  if(!DAY.test(String(targetDate||""))||new Date(targetDate+"T00:00:00Z").toISOString().slice(0,10)!==targetDate)
    return out("INVALID_TARGET_SESSION");
  if(clock.date!==targetDate) return out("CROSS_MIDNIGHT_TARGET_FORBIDDEN");
  if(clock.time<"18:10"||clock.time>"23:54")return out("OUTSIDE_SOURCE_READY_BUSINESS_WINDOW");
  if(scan?.scanDate===targetDate)return out("FORMAL_ALREADY_SAVED_NO_REPLAY");
  if(scan?.scanDate && scan.scanDate>targetDate)return out("FORMAL_FUTURE_STATE_REJECTED");
  const institutional= institution?.marketDate===targetDate&&institution?.ready===true;
  const kinds=["FINANCIAL","VALUATION","ANNOUNCEMENTS","QUARTER_EPS"];
  const ready=quality?.marketDate===targetDate&&quality?.index?.ready===true&&
    quality?.tdcc?.ready===true&&kinds.every(k=>quality?.datasets?.[k]?.ready===true);
  if(!institutional||!ready)return out("OFFICIAL_SOURCE_NOT_READY",{institutionReady:institutional,qualityReady:ready});
  // Formal cron was migrated in deployment from 18:10 to 23:35 by V8.7.12.
  // Never assume Worker.js on main is identical to deployed runtime: its
  // actual admin GET /api/cron/status expected list is authoritative here.
  const expected=Array.isArray(cron?.expected)?cron.expected.map(x=>String(x||"").trim().toLowerCase()):[];
  const allowed=[{expression:"10 10 * * mon-fri",at:"18:10"},
    {expression:"35 15 * * mon-fri",at:"23:35"}].filter(x=>expected.includes(x.expression));
  if(allowed.length!==1)return out("DEPLOYED_FORMAL_CRON_NOT_UNAMBIGUOUS");
  const runtimeCron=allowed[0];
  if(clock.time<runtimeCron.at)return out("ORIGINAL_FORMAL_CRON_NOT_DUE",{scheduledClock:runtimeCron.at});
  // The public GET exposes the last persisted original attempt. It must be
  // paired with the original D1 cron error; generic FAILED alone is ambiguous.
  const attempt=recommendations?.attempt;
  if(!attempt || attempt?.status!=="FAILED" || attempt?.requestedDate!==targetDate)
    return out("PREVIOUS_FORMAL_ATTEMPT_NOT_SAFELY_ADJUDICATED");
  const rows=Array.isArray(cron?.recent)?cron.recent:[];
  const prior=rows.find(row=>row?.job_type==="AFTER_MARKET_SCAN"&&
    row?.scheduled_at?.slice(0,10)===targetDate&&
    String(row?.cron_expression||"").trim().toLowerCase()===runtimeCron.expression);
  if(!prior)return out("ORIGINAL_FORMAL_D1_CRON_RECEIPT_MISSING");
  if(prior.status!=="FAILED")return out("PREVIOUS_FORMAL_ATTEMPT_NOT_FAILED");
  if(!/^Error:\s*DATA_INCOMPLETE[:：]/.test(String(prior.error||"")))
    return out("PREVIOUS_FORMAL_FAILURE_MUTATION_UNCERTAIN");
  // Last-attempt KV can be overwritten by a later ambiguous manual POST.
  // Link its exact Taiwan clock to the original 18:10 D1 Cron or stop.
  const m=/^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2}):(\d{2})$/.exec(String(attempt.generatedAt||""));
  if(!m)return out("LATEST_ATTEMPT_NOT_CORRELATED_WITH_PRECOMMIT_CRON");
  const pad=x=>x.padStart(2,"0");
  const attemptMs=Date.parse([m[1],pad(m[2]),pad(m[3])].join("-")+"T"+[pad(m[4]),m[5],m[6]].join(":")+"+08:00");
  const finishedMs=Date.parse(String(prior.finished_at||""));
  if(!Number.isFinite(attemptMs)||!Number.isFinite(finishedMs)||
     finishedMs-attemptMs< -10000||finishedMs-attemptMs>300000)
    return out("LATEST_ATTEMPT_NOT_CORRELATED_WITH_PRECOMMIT_CRON");

  // Canonical Worker.js issues DATA_INCOMPLETE only ahead of the first Formal
  // market-state/plan KV write. Source resynchronization makes the preflight
  // reattempt safe, but neither D1 lease nor monitoring/push is bypassed.
  return {...base,eligible:true,mayPost:true,reason:"PRECOMMIT_SOURCE_FAILURE_AFTER_NEW_SOURCE_READY",
    precommitReceiptId:prior.id??null,
    officialReady:true,originalCoreUnchanged:true,originalD1LeaseStillRequired:true,
    noAdditionalBusinessRetry:true};
}

// Final authority immediately before the original legacy business POST:
// Worker ignores body.marketDate and uses its own Date.now(). An earlier
// GET/preflight can legitimately straddle midnight. NEVER rely on its clock.
export function classifyImmediateBusinessPostClock({now=new Date(),targetDate}={}){
  const clock=format(now);
  const valid=DAY.test(String(targetDate||""));
  const sameDay=valid&&clock.date===targetDate;
  const safeEvening=sameDay&&clock.time>="18:10"&&clock.time<="23:54";
  return {mayPost:safeEvening,reason:safeEvening?"SAME_DAY_BUSINESS_POST_CLOCK_VERIFIED":
    "BUSINESS_POST_CLOCK_ROLLOVER_OR_OUTSIDE_SAFE_EVENING",
    targetDate,observedDate:clock.date,observedTime:clock.time,noRetry:true};
}
