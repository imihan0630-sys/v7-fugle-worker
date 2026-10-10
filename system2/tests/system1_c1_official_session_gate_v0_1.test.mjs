import assert from "node:assert/strict";
import {decideSystem1C1OfficialSessionV0_1 as decide}
 from "../../research/system1_c1_official_session_gate_v0_1.mjs";
const saturday=new Date("2026-10-09T16:24:30Z"); // 10/10 00:24 Taipei
const base={now:saturday,requestedDate:"2026-10-09",calendarDate:"2026-10-09"};
const holiday=decide({...base,isTradingDay:false});
assert.equal(holiday.scanDate,"2026-10-09");
assert.equal(holiday.previousTaipeiCalendarDate,"2026-10-09");
assert.equal(holiday.proceed,false);
assert.equal(holiday.classification,"OFFICIAL_NONTRADING_SESSION_SKIP_C1");
assert.equal(holiday.mayCountAsZeroPick,false);
assert.equal(holiday.formalScanConfirmed,false);
assert.equal(holiday.c1GenerationObserved,false);
assert.equal(holiday.noScan,true);
assert.equal(holiday.noPush,true);
assert.equal(holiday.noTrade,true);
assert.equal(holiday.accountD1QuotaCertified,false);
const monday=new Date("2026-10-12T16:10:00Z"); // 10/13 00:10 Taipei
const eligible=decide({now:monday,calendarDate:"2026-10-12",isTradingDay:true});
assert.equal(eligible.proceed,true);
assert.equal(eligible.scanDate,"2026-10-12");
assert.equal(eligible.evidenceState,"READINESS_NOT_YET_VERIFIED");
assert.equal(eligible.formalScanConfirmed,false); // eligible != verified
const weekend=decide({now:new Date("2026-10-11T16:10:00Z"),
  calendarDate:"2026-10-11",isTradingDay:false});
assert.equal(weekend.proceed,false);
const earlier=decide({now:monday,requestedDate:"2026-10-08",
  calendarDate:"2026-10-08",isTradingDay:true});
assert.equal(earlier.proceed,true); // explicitly requested historical research, NOT business scan
const negatives=[
  ["calendar missing",{...base},"C1_OFFICIAL_SESSION_CALENDAR_UNVERIFIED"],
  ["unknown trading status",{...base,isTradingDay:"false"},"C1_OFFICIAL_SESSION_CALENDAR_UNVERIFIED"],
  ["calendar date mismatch",{...base,calendarDate:"2026-10-08",isTradingDay:false},"C1_OFFICIAL_SESSION_CALENDAR_UNVERIFIED"],
  ["invalid calendar date",{...base,calendarDate:"2026-02-30",isTradingDay:false},"C1_OFFICIAL_SESSION_CALENDAR_UNVERIFIED"],
  ["invalid scan date",{...base,requestedDate:"2026-02-30",isTradingDay:false},"C1_OFFICIAL_SESSION_INVALID_DATE"],
  ["future target",{...base,requestedDate:"2026-10-12",calendarDate:"2026-10-12",isTradingDay:true},"C1_OFFICIAL_SESSION_FUTURE_OR_UNCLOSED_DATE"],
  ["same local day unclosed",{now:new Date("2026-10-12T07:00:00Z"),
     requestedDate:"2026-10-12",calendarDate:"2026-10-12",isTradingDay:true},"C1_OFFICIAL_SESSION_FUTURE_OR_UNCLOSED_DATE"],
  ["garbled target",{...base,requestedDate:"bogus",isTradingDay:true},"C1_OFFICIAL_SESSION_INVALID_DATE"]
];
for(const [name,params,code] of negatives)
 assert.throws(()=>decide(params),new RegExp(code),name);
assert.equal(Object.isFrozen(holiday),true);
console.log("S1_C1_OFFICIAL_HOLIDAY_SKIP_2_POSITIVE_8_NEGATIVE_NO_ZERO_PICK_PASS");
