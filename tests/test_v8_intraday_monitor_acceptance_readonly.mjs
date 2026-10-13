import assert from "node:assert/strict";
import {evaluateMonitorReadback} from "../ops/v8_intraday_monitor_acceptance_readonly.mjs";
const day="2026-10-13";
const config={source:"KV",updatedAt:"2026-10-12T22:51:05Z",totalCapital:200000,
  stocks:[{symbol:"6226",planDate:day,positionStage:"NONE"},{symbol:"2609",planDate:day,positionStage:"NONE"}]};
const cron={recent:[{job_type:"INTRADAY_MONITOR",scheduled_at:"2026-10-13T01:02:00.000Z",
 finished_at:"2026-10-13T01:04:15.000Z",status:"SUCCESS",skipped:false}]};
const live={generatedAt:"2026/10/13 09:04:00"};
// Scheduled_at must use Taiwan date. At 01 UTC 13th, Oct 13 local, same date.
const now=Date.parse("2026-10-13T01:05:00.000Z");
const ready=evaluateMonitorReadback({config,cron,live,signals:{},scan:{scanDate:"2026-09-29"},day,now});
assert.equal(ready.ok,true);
assert.equal(ready.liveFresh,true);
assert.equal(ready.cronFresh,true);
assert.equal(ready.formalComplete,false);
assert.equal(ready.brokeragePositionsReconciled,false);
assert.equal(evaluateMonitorReadback({config,cron:{recent:[]},live,signals:{},day,now}).ok,false);
assert.equal(evaluateMonitorReadback({config,cron,live:{generatedAt:"2026/10/12 12:00"},signals:{},day,now}).ok,false);
assert.equal(evaluateMonitorReadback({config:{...config,stocks:[{symbol:"6226",planDate:"2026-10-12"}]},cron,live,signals:{},day,now}).ok,false);
assert.equal(evaluateMonitorReadback({config:{...config,stocks:[config.stocks[0],config.stocks[0]]},cron,live,signals:{},day,now}).ok,false);
assert.equal(evaluateMonitorReadback({config,cron:{recent:[{job_type:"INTRADAY_MONITOR",scheduled_at:"2026-10-13T01:00:00Z",status:"FAILED"}]},live,signals:{},day,now}).ok,false);
const staleSameDay=evaluateMonitorReadback({config,cron,live,signals:{},day,now:Date.parse("2026-10-13T04:46:00.000Z")});
assert.equal(staleSameDay.ok,false);
assert.equal(staleSameDay.state,"CRON_SUCCESS_STALE");
assert.equal(staleSameDay.liveToday,true);
assert.equal(staleSameDay.liveFresh,false);
console.log(JSON.stringify({ok:true,testCases:7,staleSameDayRejected:true,formalNeverInferred:true,noBrokerageAssumption:true}));
