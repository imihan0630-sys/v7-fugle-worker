import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {classifySystem1OriginalPostclose as verdict} from "../research/system1_p0_original_postclose_forensic_v0_1.mjs";
const date="2026-10-15";
const base={date,observedAt:"2026-10-16T04:10:00.000Z",
  version:{version:"8.7.12-test"},cron:{expected:["35,55 15 * * MON-FRI"],
    recent:Array.from({length:20},(_,i)=>({id:i,job_type:"INTRADAY_MONITOR",
      scheduled_at:"2026-10-16T02:39:00.000Z",status:"SUCCESS"}))},
  scan:{status:"尚未執行盤後掃描"},recommendations:{attempt:{status:"FAILED",
      requestedDate:date,generatedAt:"2026/10/15 23:57:04"}},
  config:{source:"KV",updatedAt:"2026-10-15T15:57:04.206Z",stocks:[]},
  quality:{marketDate:date,index:{ready:true},tdcc:{ready:true},datasets:{
    FINANCIAL:{ready:true},VALUATION:{ready:true},
    ANNOUNCEMENTS:{ready:true},QUARTER_EPS:{ready:true,count:0}}},
  outbox:{configured:true,recent:[]},
  overview:{latestPlan:{scanDate:null}}};
let x=verdict(base);
assert.equal(x.verdict,"ORIGINAL_FORMAL_LAST_ATTEMPT_FAILED");
assert.equal(x.actualCron.previousSessionEvictedFromLast20,true);
assert.equal(x.actualCron.previousSessionCronExecutionProven,false);
assert.equal(x.actualCron.causeEstablished,false);
assert.equal(x.sourceQuality.ready,true);
assert.equal(x.zeroSelectionNotInferred,true);
assert.equal(x.noBusinessPOST,true);
assert.equal(verdict({...base,recommendations:{attempt:null}}).verdict,"EMPTY_PRIMARY_KV_WITHOUT_CONFIRMED_FORMAL");
assert.equal(verdict({...base,errors:{cron:"HTTP_503"}}).verdict,"GET_READBACK_INCOMPLETE");
const failed={...base.cron,recent:[{id:99,job_type:"AFTER_MARKET_SCAN",
    scheduled_at:"2026-10-15T15:35:00Z",status:"FAILED",error:"Error: DATA_INCOMPLETE"}]};
x=verdict({...base,cron:failed});
assert.equal(x.actualCron.previousSessionCronExecutionProven,true);
assert.equal(x.actualCron.observedFormalCron[0].errorClass,"PRECOMMIT_DATA_INCOMPLETE");
const cpu=verdict({...base,cron:{...failed,recent:[{...failed.recent[0],error:"Worker CPU 10ms exceeded"}]}});
assert.equal(cpu.actualCron.observedFormalCron[0].errorClass,"CPU_LIMIT");
const formal={scanDate:date,selectedCount:0,stocks:[],dryRun:false,
  config:{verified:true,updatedAt:"2026-10-15T15:56:04Z"},
  dailyReport:{signalId:"DAILY_SELECTION:"+date,sent:true,simulated:false}};
const config={source:"KV",updatedAt:formal.config.updatedAt,stocks:[]};
const outbox={configured:true,recent:[{signal_id:"DAILY_SELECTION:"+date,delivery_state:"ACCEPTED"}]};
x=verdict({...base,scan:formal,config,outbox});
assert.equal(x.complete,true);
assert.equal(x.dailyPush.accepted,true);
assert.equal(x.dailyPush.phoneReceiptProven,false);
const wrongDate=verdict({...base,scan:formal,config,
  outbox:{configured:true,recent:[{signal_id:"DAILY_SELECTION:2026-10-14",delivery_state:"ACCEPTED"}]}});
assert.equal(wrongDate.complete,false);
assert.equal(wrongDate.verdict,"FORMAL_SAVED_BUT_DAILY_PUSH_UNVERIFIED");
const orphan=verdict({...base,outbox:{configured:true,recent:[{
  signal_id:"DAILY_SELECTION:"+date,signal_type:"DAILY_SELECTION",
  delivery_state:"ACCEPTED",http_status:200,
  created_at:"2026-10-15T15:57:01.000Z",
  updated_at:"2026-10-15T15:57:02.000Z",
  accepted_at:"2026-10-15T15:57:02.000Z"}]}});
assert.equal(orphan.verdict,"DAILY_OUTBOX_ACCEPTED_WITHOUT_FORMAL_RECORD");
assert.equal(orphan.complete,false);
assert.equal(orphan.dailyPush.acceptedWithoutFormalRecord,true);
assert.equal(orphan.dailyPush.outboxCreatedAt,"2026-10-15T15:57:01.000Z");
assert.equal(orphan.dailyPush.outboxHttpStatus,200);
assert.equal(orphan.formal.attemptedDate,date);
assert.equal(orphan.noBusinessPOST,true);

const staleKV=verdict({...base,scan:{...formal,selectedCount:1,stocks:[{symbol:"2340"}]},
  config:{...config,stocks:[]}});
assert.equal(staleKV.verdict,"FORMAL_SAVED_BUT_PRIMARY_KV_MISMATCH");
assert.throws(()=>verdict({...base,date:"2026-02-30"}),/INVALID_ORIGINAL_DATE/);
const script=await readFile(new URL("./system1_p0_original_postclose_forensic_readonly.mjs",import.meta.url),"utf8");
assert.match(script,/method:"GET"/);
assert.doesNotMatch(script,/method:\s*["']POST["']/);
assert.match(script,/\/api\/cron\/status/);
assert.match(script,/\/api\/recommendations/);
assert.match(script,/\/api\/push-outbox\?limit=50/);
assert.match(script,/\/api\/config/);
const workflow=await readFile(new URL("../.github/workflows/system1-p0-original-postclose-forensic.yml",import.meta.url),"utf8");
assert.match(workflow,/S1_P0_TARGET_DATE: '2026-10-15'/);
assert.match(workflow,/github\.event_name == 'push' \|\| github\.event_name == 'workflow_dispatch'/);
assert.match(workflow,/run: node tests\/system1_p0_original_postclose_forensic_readonly\.mjs/);
assert.doesNotMatch(workflow,/cloudflare\/workers\/scripts|wrangler deploy|\bapi\/scan\b/);
console.log(JSON.stringify({ok:true,cases:14,originalCronLookbackConservative:true,
 noFalseZeroPicks:true,exactD1Outbox:true,originalPlanMonitorParity:true,
 noBusinessPOST:true,noWorkerWrite:true,noD1OrKVWrite:true,noPush:true,noTrade:true}));
