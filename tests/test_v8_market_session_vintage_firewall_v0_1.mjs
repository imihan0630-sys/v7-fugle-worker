import assert from "node:assert/strict";
import {checkV8SelectionVintage} from "../ops/v8_market_session_vintage_firewall_v0_1.mjs";
const day="2026-10-13";
assert.equal(checkV8SelectionVintage({targetDate:day,sourceMarketLastDate:"2026-10-12",
 knownOfficialDates:[day,day,day]}).formalSelectionAuthorized,false);
assert.equal(checkV8SelectionVintage({targetDate:day,sourceMarketLastDate:null}).pitPublicationTimeVerified,false);
for(const [source,other] of [["2026-10-14",[]],["2026-10-15",[day]],
 ["2026-10-12",["2026-10-14"]],["2026-10-12",["2026-10-12"]]]){
 assert.throws(()=>checkV8SelectionVintage({targetDate:day,sourceMarketLastDate:source,
   knownOfficialDates:other}),/FUTURE_REPLAY_BLOCKED|MIXED_OFFICIAL_MARKET_SESSION_BLOCKED/);
}
assert.throws(()=>checkV8SelectionVintage({targetDate:day,sourceMarketLastDate:"tomorrow"}),/UNVERIFIED/);
assert.throws(()=>checkV8SelectionVintage({targetDate:"2026/10/13"}),/INVALID/);
console.log(JSON.stringify({pass:true,tests:8,scope:"PIT-future-only firewall; no Formal override"}));
