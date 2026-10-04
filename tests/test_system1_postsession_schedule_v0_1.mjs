import assert from "node:assert/strict";
import {
  SYSTEM1_POSTSESSION_SCHEDULE_V0_1,
  resolveSystem1PostSessionSchedule
} from "../research/system1_postsession_schedule_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};

const open=new Set(["2026-10-05","2026-10-06"]);
const isTradingDate=date=>open.has(date);

const scheduledTrading=resolveSystem1PostSessionSchedule({
  eventName:"schedule",requestedTradeDate:"",taipeiToday:"2026-10-05",isTradingDate
});
eq(scheduledTrading.shouldRun,true);
eq(scheduledTrading.status,"RUN_TRADING_DAY");
eq(scheduledTrading.targetTradeDate,"2026-10-05");
eq(scheduledTrading.mayCountAsZeroPick,false);
eq(scheduledTrading.missingEvidenceMustFail,true);

const scheduledHoliday=resolveSystem1PostSessionSchedule({
  eventName:"schedule",requestedTradeDate:"",taipeiToday:"2026-10-10",isTradingDate
});
eq(scheduledHoliday.shouldRun,false);
eq(scheduledHoliday.status,"SKIP_NON_TRADING_DAY");
eq(scheduledHoliday.mayCountAsZeroPick,false);
eq(scheduledHoliday.eligibleForResearch,false);

const manual=resolveSystem1PostSessionSchedule({
  eventName:"workflow_dispatch",requestedTradeDate:"2026-10-05",taipeiToday:"2026-10-06",isTradingDate
});
eq(manual.shouldRun,true);
eq(manual.targetTradeDate,"2026-10-05");

assert.throws(()=>resolveSystem1PostSessionSchedule({
  eventName:"workflow_dispatch",requestedTradeDate:"2026-10-10",taipeiToday:"2026-10-10",isTradingDate
}),/MANUAL_TARGET_NOT_TRADING_DAY/);n++;

assert.throws(()=>resolveSystem1PostSessionSchedule({
  eventName:"workflow_dispatch",requestedTradeDate:"2026-10-06",taipeiToday:"2026-10-05",isTradingDate
}),/MANUAL_TARGET_IN_FUTURE/);n++;

assert.throws(()=>resolveSystem1PostSessionSchedule({
  eventName:"schedule",requestedTradeDate:"2026-10-05",taipeiToday:"2026-10-05",isTradingDate
}),/SCHEDULE_MUST_NOT_OVERRIDE_DATE/);n++;

assert.throws(()=>resolveSystem1PostSessionSchedule({
  eventName:"push",taipeiToday:"2026-10-05",isTradingDate
}),/EVENT_UNSUPPORTED/);n++;

eq(SYSTEM1_POSTSESSION_SCHEDULE_V0_1.cronUtc,"45 6 * * 1-5");
eq(SYSTEM1_POSTSESSION_SCHEDULE_V0_1.taipeiWallClock,"14:45");
eq(SYSTEM1_POSTSESSION_SCHEDULE_V0_1.timezone,"Asia/Taipei");
eq(SYSTEM1_POSTSESSION_SCHEDULE_V0_1.nonTradingDayBehavior,"SKIP_SUCCESS");
eq(SYSTEM1_POSTSESSION_SCHEDULE_V0_1.tradingDayMissingEvidenceBehavior,"FAIL_WITH_EXPLICIT_BLOCKER");
eq(SYSTEM1_POSTSESSION_SCHEDULE_V0_1.mayCountSkipAsZeroPick,false);

console.log(JSON.stringify({
  ok:true,assertions:n,tradingDayRuns:true,nonTradingDaySkips:true,
  manualHistoricalTradingDayRuns:true,holidayNotZeroPick:true,
  tradingDayMissingEvidenceMustFail:true,formalCoreImpact:false
}));
