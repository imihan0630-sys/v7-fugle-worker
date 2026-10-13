import assert from "node:assert/strict";
import {evaluateMonitorReadback} from "../ops/v8_intraday_monitor_acceptance_readonly.mjs";

const day="2026-10-13";
const config={source:"KV",updatedAt:"2026-10-12T22:51:05Z",totalCapital:200000,
  stocks:[{symbol:"6226",planDate:day,positionStage:"NONE"},{symbol:"2609",planDate:day,positionStage:"NONE"}]};
const cron={recent:[{job_type:"INTRADAY_MONITOR",scheduled_at:"2026-10-13T01:02:00.000Z",
  status:"SUCCESS",skipped:false}]};
const live={generatedAt:"2026/10/13 09:04:00",monitoredCount:2,results:[{symbol:"6226"},{symbol:"2609"}]};
const signals={generatedAt:"2026/10/13 09:04:05"};
const now="2026-10-13T01:05:00.000Z"; // 09:05 Asia/Taipei
const verify=(change={})=>{
  const {live:overrideLive,...rest}=change;
  return evaluateMonitorReadback({
    config,cron,live:overrideLive===undefined?live:{...live,...overrideLive},
    signals,scan:{scanDate:"2026-09-29"},day,now,...rest
  });
};
let checked=0;
const check=(condition,message)=>{assert.ok(condition,message);checked++;};
const ready=verify();
check(ready.ok===true&&ready.state==="PASS_INTRADAY_MONITOR_FRESHNESS","recent real cron/live/signals PASS");
check(ready.formalComplete===false&&ready.brokeragePositionsReconciled===false,"no Formal or brokerage claim");
check(verify({cron:{recent:[]}}).state==="RECENT_INTRADAY_CRON_NOT_VERIFIED","missing cron rejects");
check(verify({live:{generatedAt:"2026/10/12 12:00"}}).state==="LIVE_SNAPSHOT_STALE_OR_MISSING","previous day live rejects");
check(verify({config:{...config,stocks:[{symbol:"6226",planDate:"2026-10-12"}]}}).ok===false,"wrong-date plan rejects");
check(verify({config:{...config,stocks:[config.stocks[0],config.stocks[0]]}}).ok===false,"duplicate rejects");
check(verify({cron:{recent:[{job_type:"INTRADAY_MONITOR",scheduled_at:"2026-10-13T01:02:00Z",status:"FAILED"}]}}).ok===false,"failed cron rejects");
// The Oct13 12:46 false-PASS incident: 10:46 is TODAY but TWO HOURS stale.
const delayed=verify({now:"2026-10-13T04:46:51.000Z",
  cron:{recent:[{job_type:"INTRADAY_MONITOR",scheduled_at:"2026-10-13T04:45:13Z",status:"SUCCESS",skipped:0}]},
  live:{generatedAt:"2026/10/13 10:46:21"},
  signals:{generatedAt:"2026/10/13 10:46:21"}});
check(delayed.ok===false&&delayed.state==="LIVE_SNAPSHOT_STALE_OR_MISSING"
  &&delayed.liveAgeSeconds>7000,"same-date 10:46 snapshot at 12:46 must FAIL");
check(verify({now:"2026-10-13T04:46:51Z",
  cron:{recent:[{job_type:"INTRADAY_MONITOR",scheduled_at:"2026-10-13T02:45:13Z",status:"SUCCESS"}]},
  live:{generatedAt:"2026/10/13 12:45:00"},
  signals:{generatedAt:"2026/10/13 12:45:00"}}).state==="RECENT_INTRADAY_CRON_NOT_VERIFIED","old cron with fresh GET rejects");
check(verify({signals:{generatedAt:"2026/10/13 08:59:00"}}).state==="SIGNAL_SNAPSHOT_STALE_OR_MISSING","stale signal with fresh live rejects");
check(verify({live:{generatedAt:null,checkedAt:"2026/10/13 09:05:00",marketDate:day}}).state==="LIVE_SNAPSHOT_STALE_OR_MISSING","checkedAt or date cannot fabricate a fresh snapshot");
check(verify({live:{generatedAt:"2026-10-13T01:04:00.000Z"}}).ok===true,"UTC timestamp of genuine snapshot PASS");
check(verify({live:{generatedAt:"2026-10-13T13:04:00+08:00"}}).state==="LIVE_SNAPSHOT_STALE_OR_MISSING","future timestamp cannot PASS");
check(verify({now:"2026-10-13T06:01:00Z"}).notAssessed===true
  &&verify({now:"2026-10-13T06:01:00Z"}).ok===false,"after-close must not request moving quotes or claim PASS");
check(verify({now:"2026-10-13T00:30:00Z"}).state==="OUTSIDE_TAIPEI_INTRADAY_WINDOW_NOT_ASSESSED","premarket not assessed");
check(verify({now:"2026-10-17T01:05:00Z",day:"2026-10-17"}).notAssessed===true,"weekend not assessed");
check(verify({cron:{recent:[...cron.recent,{job_type:"INTRADAY_MONITOR",scheduled_at:"2026-10-12T23:59:00Z",status:"SUCCESS"}]}}).cronTodayCount===2,"UTC date boundary counted in Taipei day");
check(verify({live:{generatedAt:"2026/10/13 09:06:00"}}).ok===true,"one-minute clock skew tolerated");
check(verify({live:{generatedAt:"2026/10/13 09:07:30"}}).ok===false,"excess future clock skew rejected");
check(verify({live:{results:[{symbol:"6226"},{symbol:"2454"}]}}).state==="MONITOR_TARGETS_MISMATCH",
  "fresh snapshot for unexpected symbol must not PASS");
check(verify({live:{monitoredCount:3}}).state==="MONITOR_TARGETS_MISMATCH",
  "inconsistent reported monitor count rejects");
check(verify({live:{results:[{symbol:"6226"},{symbol:"6226"}]}}).state==="MONITOR_TARGETS_MISMATCH",
  "duplicate actual monitored symbols reject");
check(verify({now:"2026-10-13T05:24:53.000Z",
  cron:{recent:[{job_type:"INTRADAY_MONITOR",scheduled_at:"2026-10-13T05:24:13Z",status:"SUCCESS",skipped:0}]},
  live:{generatedAt:"2026/10/13 13:24:21"},
  signals:{generatedAt:"2026/10/13 13:24:21"}}).ok===true,"13:24 actual fresh evidence can PASS when membership agrees");


const validAideen={stocks:[{symbol:"6213",strategyPool:"AIDEEN_APP"},{symbol:"3189",strategyPool:"AIDEEN_APP"}]};
const combinedResults=[...live.results,{symbol:"6213",plan:{strategyPool:"AIDEEN_APP"}},{symbol:"3189",plan:{strategyPool:"AIDEEN_APP"}}];
const poolProof=verify({aideen:validAideen,live:{monitoredCount:4,results:combinedResults}});
check(poolProof.ok===true&&poolProof.aideenMonitorCount===2&&poolProof.expectedMonitorKeys.length===4,
  "legitimate Formal+Aideen multi-pool union must pass");
check(verify({aideen:validAideen,live:{monitoredCount:4,results:[...live.results,{symbol:"6213",plan:{strategyPool:"AIDEEN_APP"}},{symbol:"9999",plan:{strategyPool:"AIDEEN_APP"}}]}}).state==="MONITOR_TARGETS_MISMATCH",
  "unknown Aideen symbol must fail");
check(verify({aideen:validAideen,live:{monitoredCount:2,results:live.results}}).state==="MONITOR_TARGETS_MISMATCH",
  "missing expected independent Aideen pool must fail");
const overlapAideen={stocks:[{symbol:"6226",strategyPool:"AIDEEN_APP"}]};
check(verify({aideen:overlapAideen,live:{monitoredCount:3,results:[...live.results,{symbol:"6226",plan:{strategyPool:"AIDEEN_APP"}}]}}).ok===true,
  "same ticker independently monitored in Formal and Aideen is permitted");
console.log(JSON.stringify({ok:true,testCases:checked,
  detection:"cron+live+signal age bounded to 5min, Taipei session-aware",
  noProductionMutation:true,formalNeverInferred:true,noBrokerageAssumption:true}));
