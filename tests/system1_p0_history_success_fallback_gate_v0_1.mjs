// A successful real scheduled System1 D1 history job is an independent
// calendar/event trigger for the EXISTING official market-quality sync.
// Never use this to replay a past trading day, enter Formal early, or add Cron.
import {readFile,appendFile} from "node:fs/promises";
const fmt=d=>{
  const x=d instanceof Date?d:new Date(d);
  if(!Number.isFinite(x.getTime()))return null;
  const p=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",
    month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(x);
  const g=k=>p.find(a=>a.type===k)?.value;
  return {date:`${g("year")}-${g("month")}-${g("day")}`,time:`${g("hour")}:${g("minute")}`};
};
export function classifyHistorySuccessFallback({event,now=new Date(),repository}={}){
  const fail=(reason)=>({proceed:false,reason,noSelection:true,noBusinessPost:true,noPlanChanges:true,noPush:true});
  if(!event||typeof event!=="object")return fail("NO_TRUSTED_UPSTREAM_EVENT");
  const run=event.workflow_run;
  if(!run||run.name!=="System1 DAILY No-cost Official K-line Incremental D1 History (DATA ONLY)")
    return fail("UPSTREAM_WORKFLOW_IDENTITY_MISMATCH");
  if(run.event!=="schedule"||run.conclusion!=="success"||run.status!=="completed"||
     run.head_branch!=="main")return fail("UPSTREAM_NOT_SUCCESSFUL_MAIN_SCHEDULE");
  if(!repository||event.repository?.full_name!==repository||
     run.head_repository?.full_name!==repository)
    return fail("UPSTREAM_REPOSITORY_IDENTITY_MISMATCH");
  const current=fmt(now),created=fmt(run.created_at),
    started=fmt(run.run_started_at||run.created_at),completed=fmt(run.updated_at);
  if(!current||!created||!started||!completed)
    return fail("UPSTREAM_CLOCK_UNVERIFIABLE");
  if(new Set([current.date,created.date,started.date,completed.date]).size!==1)
    return fail("UPSTREAM_CROSS_SESSION_NOT_SAFE_FOR_SYNC");
  if(current.time<"16:10"||current.time>"23:20")
    return fail("OUTSIDE_SOURCE_REFRESH_WINDOW");
  if(created.time<"16:10"||started.time<"16:10")
    return fail("PRE_CLOSE_UPSTREAM_EVENT_NOT_TRUSTED");
  return {proceed:true,reason:"SAME_SESSION_SUCCESSFUL_HISTORY_SCHEDULE_CAN_SEED_ORIGINAL_OFFICIAL_SYNC",
    date:current.date,localTime:current.time,
    noSelection:true,noBusinessPost:true,noPlanChanges:true,noPush:true};
}
if(process.argv[1] && import.meta.url.endsWith(process.argv[1].split(/[\\/]/).at(-1))){
  const p=process.env.GITHUB_EVENT_PATH;
  const event=p?JSON.parse(await readFile(p,"utf8")):null;
  const result=classifyHistorySuccessFallback({event,repository:process.env.GITHUB_REPOSITORY,now:new Date()});
  console.log(JSON.stringify({sourceHandoffGate:result}));
  if(process.env.GITHUB_OUTPUT)await appendFile(process.env.GITHUB_OUTPUT,`proceed=${result.proceed}\n`);
}
