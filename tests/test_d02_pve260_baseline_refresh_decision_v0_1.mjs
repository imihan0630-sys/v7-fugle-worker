import assert from "node:assert/strict";
import {deriveBaselineRefreshDecisionV01 as derive} from "../research/d02_pve260_baseline_refresh_decision_v0_1.mjs";

const fresh={schemaMatches:true,validSessions:80,baselineAsOfDate:"2026-10-06",expectedLatestComparableSlotDate:"2026-10-06",sameSlotHistoryValidityState:"PASS"};
assert.deepEqual(derive(fresh),{state:"FRESH_READY",reason:"EXACT_SLOT_BASELINE_CURRENT",maySkipHistoricalRefresh:true});
assert.equal(derive({...fresh,schemaMatches:false}).state,"BOOTSTRAP_REQUIRED");
assert.equal(derive({...fresh,validSessions:19}).state,"BOOTSTRAP_REQUIRED");
assert.equal(derive({...fresh,expectedLatestComparableSlotDate:null}).state,"UNKNOWN_BLOCK");
assert.equal(derive({...fresh,baselineAsOfDate:null}).state,"REFRESH_REQUIRED");
assert.equal(derive({...fresh,baselineAsOfDate:"2026-10-05"}).reason,"BASELINE_STALE_DESPITE_MIN_HISTORY");
assert.equal(derive({...fresh,baselineAsOfDate:"2026-10-07"}).state,"IDENTITY_CONFLICT");
assert.equal(derive({...fresh,sameSlotHistoryValidityState:"FAIL"}).state,"REFRESH_REQUIRED");
assert.equal(derive({...fresh,sameSlotHistoryValidityState:"UNKNOWN"}).state,"UNKNOWN_BLOCK");

// Physical PVE-257/PVE-258/PVE-259 case: count sufficiency must never override freshness.
const physical=derive({
  schemaMatches:true,
  validSessions:80,
  baselineAsOfDate:"2026-10-05",
  expectedLatestComparableSlotDate:"2026-10-06",
  sameSlotHistoryValidityState:"PASS"
});
assert.deepEqual(physical,{state:"REFRESH_REQUIRED",reason:"BASELINE_STALE_DESPITE_MIN_HISTORY",maySkipHistoricalRefresh:false});

console.log(JSON.stringify({status:"PASS",assertions:10,physical}));
