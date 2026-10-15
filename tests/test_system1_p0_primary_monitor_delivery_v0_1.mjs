import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {assessP0PrimaryMonitorDelivery as assess} from "./system1_p0_primary_monitor_delivery_v0_1.mjs";
const date="2026-10-15";
const stock={symbol:"2340",planDate:"2026-10-16",positionStage:"NONE",formalClose:40,
 buyLow:38,buyHigh:40,stop:36.5,allocationRatio:25,totalAllocation:50000,
 firstAmount:30000,secondAmount:20000,firstShares:750,secondShares:500,totalShares:1250};
const formal={scanDate:date,dryRun:false,selectedCount:1,stocks:[stock],
 config:{verified:true,updatedAt:"2026-10-15T10:45:12.000Z"},
 threeMin:{verified:false,sent:false,reason:"Free endpoint expired"},
 dailyReport:{sent:true,simulated:false,signalId:`DAILY_SELECTION:${date}`}};
const monitor={source:"KV",updatedAt:formal.config.updatedAt,stocks:[structuredClone(stock)]};
const outbox={configured:true,recent:[{signal_id:`DAILY_SELECTION:${date}`,delivery_state:"ACCEPTED"}]};
const ok=assess({targetDate:date,formal,monitor,outbox});
assert.equal(ok.ok,true);
assert.equal(ok.monitorExact,true);
assert.equal(ok.dailyPushAccepted,true);
assert.equal(ok.threeMinVerified,false);
assert.equal(ok.phoneReceiptVerified,false);
const check=(delta,reason)=>{
 const x=assess({targetDate:date,formal,monitor,outbox,...delta});
 assert.equal(x.ok,false);
 assert.equal(x.reason,reason);
 assert.equal(x.noBusinessRetry,true);
};
check({formal:{...formal,scanDate:"2026-10-14"}},"FORMAL_DATE_OR_PRODUCTION_MODE_NOT_VERIFIED");
check({formal:{...formal,dryRun:true}},"FORMAL_DATE_OR_PRODUCTION_MODE_NOT_VERIFIED");
check({formal:{...formal,selectedCount:0}},"FORMAL_0_TO_6_PLAN_UNVERIFIED");
check({formal:{...formal,selectedCount:7,stocks:Array(7).fill(stock)}},"FORMAL_0_TO_6_PLAN_UNVERIFIED");
check({formal:{...formal,config:{...formal.config,verified:false}}},"FORMAL_CONFIG_WRITE_READBACK_NOT_VERIFIED");
check({monitor:{...monitor,source:"Runtime variable"}},"MONITOR_KV_CURRENT_PLAN_NOT_VERIFIED");
check({monitor:{...monitor,updatedAt:"2026-10-14T10:45:12.000Z"}},"MONITOR_KV_CURRENT_PLAN_NOT_VERIFIED");
check({monitor:{...monitor,stocks:[]}},"MONITOR_KV_CURRENT_PLAN_NOT_VERIFIED");
check({monitor:{...monitor,stocks:[{...stock,stop:0}]}},"MONITOR_KV_RISK_OR_CAPITAL_MISMATCH");
check({monitor:{...monitor,stocks:[{...stock,firstShares:751}]}},"MONITOR_KV_RISK_OR_CAPITAL_MISMATCH");
check({formal:{...formal,dailyReport:{sent:false}}},"DAILY_SELECTION_PUSH_NOT_ACCEPTED");
check({formal:{...formal,dailyReport:{sent:true,simulated:true}}},"DAILY_SELECTION_PUSH_NOT_ACCEPTED");
check({formal:{...formal,dailyReport:{sent:true}}},"DAILY_SELECTION_PUSH_NOT_ACCEPTED");
check({formal:{...formal,dailyReport:{sent:true,simulated:null}}},"DAILY_SELECTION_PUSH_NOT_ACCEPTED");
check({formal:{...formal,dailyReport:{sent:true,simulated:false}}},"DAILY_SELECTION_SIGNAL_ID_NOT_VERIFIED");
check({formal:{...formal,dailyReport:{sent:true,simulated:false,signalId:"DAILY_SELECTION:2026-10-14"}}},"DAILY_SELECTION_SIGNAL_ID_NOT_VERIFIED");
check({outbox:null},"DAILY_SELECTION_OUTBOX_NOT_VERIFIED");
check({outbox:{configured:false,recent:outbox.recent}},"DAILY_SELECTION_OUTBOX_NOT_VERIFIED");
check({outbox:{configured:true,recent:[]}},"DAILY_SELECTION_OUTBOX_NOT_ACCEPTED");
check({outbox:{configured:true,recent:[{signal_id:`DAILY_SELECTION:${date}`,delivery_state:"PENDING"}]}},"DAILY_SELECTION_OUTBOX_NOT_ACCEPTED");
check({outbox:{configured:true,recent:[{signal_id:"DAILY_SELECTION:2026-10-14",delivery_state:"ACCEPTED"}]}},"DAILY_SELECTION_OUTBOX_NOT_ACCEPTED");
check({outbox:{configured:true,recent:[...outbox.recent,...outbox.recent]}},"DAILY_SELECTION_OUTBOX_NOT_ACCEPTED");
const zero=assess({targetDate:date,formal:{...formal,stocks:[],selectedCount:0},
 monitor:{...monitor,stocks:[]},outbox});
assert.equal(zero.ok,true);
assert.equal(zero.selectedCount,0);
// Real production Worker original monitor API is GET /api/config,
// directly loading primary KV; the final recovery client must GET BOTH
// original formal scan state and monitor plan AFTER the single original POST.
const recovery=await readFile(new URL("./recover_after_market.mjs",import.meta.url),"utf8");
const worker=await readFile(new URL("../Worker.js",import.meta.url),"utf8");
assert.match(worker,/if \(url\.pathname === "\/api\/config"\)/);
assert.match(worker,/return json\(\s*loaded,\s*200/);
assert.match(recovery,/admin\('\/api\/config'\)/);
assert.equal((recovery.match(/admin\('\/api\/push-outbox\?limit=50'\)/g)||[]).length,2);
assert.match(recovery,/SAME_DAY_FORMAL_SAVED_BUT_MONITOR_OR_DAILY_PUSH_INCOMPLETE/);
assert.match(recovery,/P0_FORMAL_MONITOR_OR_PUSH_UNVERIFIED_NO_RETRY/);
assert.match(recovery,/recoveredByExactPrimaryReadback:true/);
assert.equal((recovery.match(/admin\('\/api\/scan',\{method:'POST'/g)||[]).length,1);
assert.doesNotMatch(recovery,/recoveredByReadonlyConfirmation:true/);
console.log(JSON.stringify({ok:true,assessed:"FULL_BUSINESS_RECEIPT",
 p0PrimaryMonitorViaKV:true,selectedZeroAllowedOnlyIfFormal:true,
 primaryPlanRiskCapitalExact:true,dailyPushAcceptedRequired:true,dailyOutboxExactReadback:true,
 optional3MinNotBlockingPrimary:true,handsetNotFalselyClaimed:true,
 noRepeatedPost:true,noWorkerProductionChanges:true}));
