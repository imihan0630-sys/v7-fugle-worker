// External official TWSE trading calendar physical probe: public source only, no secrets, D1, KV or Worker calls.
import assert from "node:assert/strict";
import {buildOfficialTradingDatesV0_1} from "../system2/runtime/official_historical_backfill_source_v0_1.mjs";
const receipt=await buildOfficialTradingDatesV0_1({fromDate:"2026-09-30",toDate:"2026-10-13"});
const sessions=receipt.tradingDates;
assert.ok(Array.isArray(sessions)&&sessions.length>=6&&sessions.length<=12,"OFFICIAL_DAILY_CALENDAR_SESSION_COVERAGE_INVALID");
assert.equal(sessions.at(-1),"2026-10-13","LATEST_COMPLETED_MARKET_SESSION_NOT_PROVEN");
assert.equal(sessions.includes("2026-10-09"),false,"TAIWAN_OFFICIAL_HOLIDAY_IN_SESSION_LIST");
assert.equal(sessions.includes("2026-10-12"),true,"EXPECTED_REOPEN_SESSION_MISSING");
assert.ok(String(receipt.source||"").startsWith("TWSE_OFFICIAL"),"OFFICIAL_CALENDAR_SOURCE_UNKNOWN");
console.log("SYSTEM1_P0_PHYSICAL_OFFICIAL_CALENDAR_READONLY="+JSON.stringify({
 from:receipt.fromDate,to:receipt.toDate,source:receipt.source,
 sessionCount:sessions.length,latest:sessions.at(-1),noD1Write:true,noTrading:true
}));
