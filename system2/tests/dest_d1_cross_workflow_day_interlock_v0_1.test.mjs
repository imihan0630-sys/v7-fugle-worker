import assert from "node:assert/strict";
import test from "node:test";
import {readFile} from "node:fs/promises";
import {decideDestinationD1DayGuard,validateProviderRunList,inspectRealGuard,WORKFLOWS,DEST_WRITER_LOCK} from "../scripts/dest_d1_writer_run_interlock_v0_1.mjs";
const utcDay="2026-10-14",prevDay="2026-10-13",repo="imihan0630-sys/v7-fugle-worker";
const makeRun=(id,time,extra={})=>({id,created_at:time,head_branch:"main",event:"schedule",status:"completed",conclusion:"success",...extra});
function okResult(day,otherRuns=[],total=otherRuns.length){
 return{ok:true,status:200,async json(){return{total_count:total,workflow_runs:otherRuns}}};
}
test("all three auto destination workflows are explicit, not source V8",()=>{
 assert.equal(WORKFLOWS.RAW_COPY,"system2-owner-override-raw-d1-copy-20261012.yml");
 assert.equal(WORKFLOWS.DAILY_DIAGNOSTIC,"system2-daily-shadow-diagnostic.yml");
 assert.equal(WORKFLOWS.RECENT_A1_WARMUP,"system2-recent-a1-hot-history-warmup.yml");
 assert.equal(DEST_WRITER_LOCK,"s2-dest-d1-historical-and-diagnostic-writer");
});
test("no-other-writer preflight can permit check, but cannot authorize Cloudflare D1 charge",()=>{
 const d=decideDestinationD1DayGuard({writerId:"RAW_COPY",utcDay,currentRuns:[],previousRuns:[]});
 assert.equal(d.allowed,true);
 assert.equal(d.atomicCloudflareLedgerProven,false);
 assert.equal(d.nonCloudflareBudgetAssertion,true);
 assert.equal(d.coversExactlyRegisteredDestinationWriters,3);
 assert.equal(d.excludesOnlyTwoRegisteredDestinationWriters,false);
});
test("competitor same-UTC-day ANY original run blocks even skipped/queued, fail closed",()=>{
 for(const writerId of ["RAW_COPY","DAILY_DIAGNOSTIC","RECENT_A1_WARMUP"]){
 for(const status of ["completed","in_progress","queued"]){
  const d=decideDestinationD1DayGuard({writerId,utcDay,currentRuns:[
   makeRun(200,"2026-10-14T02:30:00.000Z",{status,conclusion:status==="completed"?"skipped":null})
  ],previousRuns:[]});
  assert.equal(d.allowed,false);assert.equal(d.sameDayOtherRunCount,1);
  assert.deepEqual(d.reasons,["COMPETING_WORKFLOW_OCCURRED_THIS_UTC_DAY"]);
 }
 }
});
test("proven inert diagnostic PUSH does not starve authorized historical importer",()=>{
 const r=makeRun(38503703641,"2026-10-14T02:59:00.000Z",{event:"push",status:"completed",conclusion:"skipped",originWriterId:"DAILY_DIAGNOSTIC"});
 const safe=decideDestinationD1DayGuard({writerId:"RAW_COPY",utcDay,currentRuns:[r],previousRuns:[]});
 assert.equal(safe.allowed,true);assert.equal(safe.ignoredProvenInertDiagnosticPushRunCount,1);
 const pending=decideDestinationD1DayGuard({writerId:"RAW_COPY",utcDay,currentRuns:[{...r,status:"in_progress",conclusion:null}],previousRuns:[]});
 assert.equal(pending.allowed,false);
 const scheduled=decideDestinationD1DayGuard({writerId:"RAW_COPY",utcDay,currentRuns:[{...r,event:"schedule"}],previousRuns:[]});
 assert.equal(scheduled.allowed,false);
 const fromRaw=decideDestinationD1DayGuard({writerId:"DAILY_DIAGNOSTIC",utcDay,currentRuns:[{...r,originWriterId:"RAW_COPY"}],previousRuns:[]});
 assert.equal(fromRaw.allowed,false,"never infer unknown RAW copy is inert from diagnostic guard");
});
test("warmup can neither consume A1 writes after raw copy nor after daily diagnostics",()=>{
 for(const competing of ["RAW_COPY","DAILY_DIAGNOSTIC"]){
  const run=makeRun(250,"2026-10-14T09:30:00.000Z",{originWriterId:competing});
  const result=decideDestinationD1DayGuard({writerId:"RECENT_A1_WARMUP",utcDay,currentRuns:[run],previousRuns:[]});
  assert.equal(result.allowed,false);
  assert.equal(result.sameDayOtherRunCount,1);
 }
});
test("malformed run with no event/status is not valid upstream attestation",()=>{
 assert.throws(()=>validateProviderRunList({total_count:1,workflow_runs:[{id:1,created_at:utcDay+"T00:00:00Z",head_branch:"main"}]}),/INCOMPLETE/);
});
test("previous UTC day 22Z potential cross-midnight is blocked, older benign run is ignored",()=>{
 const b=decideDestinationD1DayGuard({writerId:"DAILY_DIAGNOSTIC",utcDay,currentRuns:[],previousRuns:[makeRun(11,prevDay+"T23:49:00.000Z")]});
 assert.equal(b.allowed,false);
 assert.deepEqual(b.reasons,["PREVIOUS_DAY_LATE_RUN_POSSIBLE_SPILLOVER"]);
 const a=decideDestinationD1DayGuard({writerId:"DAILY_DIAGNOSTIC",utcDay,currentRuns:[],previousRuns:[makeRun(12,prevDay+"T11:00:00.000Z")]});
 assert.equal(a.allowed,true);
});
test("REST integrity and full pagination are required",()=>{
 assert.throws(()=>validateProviderRunList({total_count:101,workflow_runs:[]}),/PAGINATION_INCOMPLETE/);
 assert.throws(()=>validateProviderRunList({total_count:4,workflow_runs:[makeRun(1,utcDay+"T01:00:00.000Z")]}),/PAGINATION_INCOMPLETE/);
 assert.throws(()=>validateProviderRunList({workflow_runs:[]}),/MALFORMED/);
 assert.throws(()=>validateProviderRunList({total_count:1,workflow_runs:[{id:1}]}),/DATA_INCOMPLETE/);
});
test("authenticated provider GET_ONLY origin and next-day query, no Cloudflare token",async()=>{
 const requested=[];
 const r=await inspectRealGuard({writerId:"RAW_COPY",now:new Date(utcDay+"T02:31:00.000Z"),repo,token:"TEST_GITHUB_TOKEN",
  fetchImpl:async(url,opts)=>{
   requested.push({url,method:opts.method,authorization:opts.headers.authorization});
   const day=decodeURIComponent(url.split("created=")[1]);
   return okResult(day,day===utcDay?[makeRun(123,utcDay+"T01:00:00.000Z")]:[]);
  }});
 assert.equal(r.allowed,false);assert.equal(r.sameDayOtherRunCount,1);
 assert.equal(requested.length,4);
 for(const x of requested){assert.match(x.url,/system2-(daily-shadow-diagnostic|recent-a1-hot-history-warmup).yml\/runs/);
  assert.equal(x.method,"GET");assert.equal(x.authorization,"Bearer TEST_GITHUB_TOKEN");}
 assert.deepEqual(requested.map(x=>x.url.split("created=")[1]),[utcDay,prevDay,utcDay,prevDay]);
});
test("any GitHub read 403/network/error is a fatal guard error not presumed permission",async()=>{
 const args={writerId:"DAILY_DIAGNOSTIC",now:new Date(utcDay+"T02:31:00.000Z"),repo,token:"TEST_GITHUB_TOKEN"};
 await assert.rejects(()=>inspectRealGuard({...args,fetchImpl:async()=>({ok:false,status:403,async json(){return{}}})}),/GITHUB_CROSS_WORKFLOW_READ_403/);
 await assert.rejects(()=>inspectRealGuard({...args,fetchImpl:async()=>{throw Error("ETIMEDOUT")}}),/ETIMEDOUT/);
 await assert.rejects(()=>inspectRealGuard({...args,repo:"other/repo"}),/DEST_DAY_INTERLOCK_ENV_INVALID/);
});
test("both real workflow jobs serialize identically BEFORE any D1/query/write step",async()=>{
 const raw=await readFile(new URL("../../.github/workflows/system2-owner-override-raw-d1-copy-20261012.yml",import.meta.url),"utf8");
 const diag=await readFile(new URL("../../.github/workflows/system2-daily-shadow-diagnostic.yml",import.meta.url),"utf8");
 const warmup=await readFile(new URL("../../.github/workflows/system2-recent-a1-hot-history-warmup.yml",import.meta.url),"utf8");
 const registry=JSON.parse(await readFile(new URL("../config/dest_d1_cross_workflow_writer_interlock_v0_1.json",import.meta.url),"utf8"));
 assert.deepEqual(registry.writers.map(x=>x.id),["RAW_COPY","DAILY_DIAGNOSTIC","RECENT_A1_WARMUP"]);
 assert.equal(registry.sharedJobConcurrencyGroup,DEST_WRITER_LOCK);
 assert.equal(registry.atomicD1LeaseOrReservationAccepted,false);
 for(const [id,w] of [["RAW_COPY",raw],["DAILY_DIAGNOSTIC",diag],["RECENT_A1_WARMUP",warmup]]){
  const job=id==="RAW_COPY"?"destination_copy":id==="DAILY_DIAGNOSTIC"?"diagnostic":"warmup";
  assert.match(w,new RegExp("  "+job+":\\n    concurrency:\\n      group: "+DEST_WRITER_LOCK+"\\n      cancel-in-progress: false"));
  assert.match(w,new RegExp("S2_DEST_WRITER_CLASS: "+id));
  assert.match(w,/node system2\/scripts\/dest_d1_writer_run_interlock_v0_1\.mjs/);
  assert.match(w,/if: steps\.day_interlock\.outputs\.allowed == 'true'/);
  assert.ok(w.indexOf("node system2/scripts/dest_d1_writer_run_interlock_v0_1.mjs")<w.indexOf("secrets.S2_SCHEMA_DEST_D1_WRITE_TOKEN"));
  assert.match(w,/s2-dest-d1-writer-day-interlock\/receipt\.json/);
 }
 assert.match(diag,/if: steps\.day_interlock\.outputs\.allowed == 'true'\n        id: quota\n        uses: \.\/\.github\/actions\/system2-d1-budget-gate/);
 assert.match(raw,/name: Do owner-authorized target-only RAW_A1 transport under 80k billed row limit\n        if: steps\.day_interlock\.outputs\.allowed == 'true'/);
});
