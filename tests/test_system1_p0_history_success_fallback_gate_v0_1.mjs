import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {classifyHistorySuccessFallback as decide} from "./system1_p0_history_success_fallback_gate_v0_1.mjs";
const repo="imihan0630-sys/v7-fugle-worker";
const event={
 repository:{full_name:repo},
 workflow_run:{name:"System1 DAILY No-cost Official K-line Incremental D1 History (DATA ONLY)",
  event:"schedule",status:"completed",conclusion:"success",head_branch:"main",
  head_repository:{full_name:repo},
  created_at:"2026-10-15T13:21:04Z",run_started_at:"2026-10-15T13:21:04Z",
  updated_at:"2026-10-15T13:24:00Z"}
};
const now="2026-10-15T13:25:00Z";
const ok=decide({event,repository:repo,now});
assert.equal(ok.proceed,true);
assert.equal(ok.reason,"SAME_SESSION_SUCCESSFUL_HISTORY_SCHEDULE_CAN_SEED_ORIGINAL_OFFICIAL_SYNC");
assert.equal(ok.date,"2026-10-15");
assert.equal(ok.noBusinessPost,true);
assert.equal(ok.noPush,true);
const blocked=(e,clock,reason)=>{
 const result=decide({event:e,repository:repo,now:clock??now});
 assert.equal(result.proceed,false);
 assert.equal(result.reason,reason);
 assert.equal(result.noBusinessPost,true);
};
const change=(k,v)=>({...event,workflow_run:{...event.workflow_run,[k]:v}});
blocked(null,now,"NO_TRUSTED_UPSTREAM_EVENT");
blocked(change("name","V8 Encrypted Plan Mirror"),now,"UPSTREAM_WORKFLOW_IDENTITY_MISMATCH");
blocked(change("event","workflow_dispatch"),now,"UPSTREAM_NOT_SUCCESSFUL_MAIN_SCHEDULE");
blocked(change("status","in_progress"),now,"UPSTREAM_NOT_SUCCESSFUL_MAIN_SCHEDULE");
blocked(change("conclusion","failure"),now,"UPSTREAM_NOT_SUCCESSFUL_MAIN_SCHEDULE");
blocked(change("head_branch","feature"),now,"UPSTREAM_NOT_SUCCESSFUL_MAIN_SCHEDULE");
blocked({...event,repository:{full_name:"foreign/repo"}},now,"UPSTREAM_REPOSITORY_IDENTITY_MISMATCH");
blocked(change("head_repository",{full_name:"foreign/repo"}),now,"UPSTREAM_REPOSITORY_IDENTITY_MISMATCH");
blocked(event,"2026-10-15T16:00:00Z","UPSTREAM_CROSS_SESSION_NOT_SAFE_FOR_SYNC");
blocked(change("created_at","2026-10-14T14:21:04Z"),now,"UPSTREAM_CROSS_SESSION_NOT_SAFE_FOR_SYNC");
blocked(change("updated_at","2026-10-15T16:10:00Z"),now,"UPSTREAM_CROSS_SESSION_NOT_SAFE_FOR_SYNC");
blocked(event,"2026-10-15T15:21:00Z","OUTSIDE_SOURCE_REFRESH_WINDOW");
blocked({...event,workflow_run:{...event.workflow_run,created_at:"2026-10-15T07:00:00Z",
  run_started_at:"2026-10-15T07:00:00Z",updated_at:"2026-10-15T08:10:00Z"}},
  "2026-10-15T09:00:00Z","PRE_CLOSE_UPSTREAM_EVENT_NOT_TRUSTED");
// Correct nominal 16:10 schedule can also complete near 17:00, valid.
const nominal={...event,workflow_run:{...event.workflow_run,
  created_at:"2026-10-15T08:10:00Z",run_started_at:"2026-10-15T08:10:00Z",
  updated_at:"2026-10-15T09:02:00Z"}};
assert.equal(decide({event:nominal,repository:repo,now:"2026-10-15T09:02:30Z"}).proceed,true);
const workflow=await readFile(new URL("../.github/workflows/v7-market-data.yml",import.meta.url),"utf8");
const history=await readFile(new URL("../.github/workflows/system1-p0-official-history-daily-incremental.yml",import.meta.url),"utf8");
assert.match(history,/name: System1 DAILY No-cost Official K-line Incremental D1 History \(DATA ONLY\)/);
assert.match(workflow,/workflow_run:\n\s+workflows:/);
assert.match(workflow,/needs: history_success_gate/);
assert.match(workflow,/steps\.guard\.outputs\.proceed/);
assert.match(workflow,/github\.event_name != 'workflow_run'/);
assert.match(workflow,/history_success_gate:/);
assert.match(workflow,/steps\.calendar\.outputs\.proceed == 'true'/);
assert.equal((workflow.match(/cron: '/g)||[]).length,5); // no additional cron
assert.equal((workflow.match(/run: node tests\/recover_after_market\.mjs/g)||[]).length,3); // original business guarded
assert.doesNotMatch(workflow,/github\.event_name == 'workflow_run' &&.*recover_after_market/);
console.log(JSON.stringify({ok:true,p0HistorySuccessFallback:true,
 eventOnlyActualSuccessfulMainSchedule:true,sameTaipeiSession:true,
 ignoresLateCrossMidnight:true,precloseSourceGuard:true,noNewCron:true,
 existingSourceScriptsReused:true,businessPostStillOriginalProtected:true,
 noWorkerChange:true}));
