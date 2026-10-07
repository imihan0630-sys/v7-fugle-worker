import assert from "node:assert/strict";
import {deriveSameSlotBaselineCleanV01 as derive} from "../research/d02_pve256_same_slot_baseline_clean_guard_v0_1.mjs";

const base={
  marketDate:"2026-10-07",
  baselineAsOfDate:"2026-10-06",
  expectedLatestComparableSlotDate:"2026-10-06",
  slotHistoryCount:20,
  pvSlotRvol20:0.72,
  corporateActionContinuityState:"CLEAN",
  sameSlotHistoryValidityState:"PASS"
};

assert.deepEqual(derive(base),{state:"PASS",clean:true,reasons:[]});
assert.equal(derive({...base,baselineAsOfDate:null}).state,"UNKNOWN");
assert.equal(derive({...base,expectedLatestComparableSlotDate:null}).state,"UNKNOWN");
assert.equal(derive({...base,baselineAsOfDate:"2026-10-05"}).state,"FAIL");
assert.equal(derive({...base,corporateActionContinuityState:"UNKNOWN"}).state,"UNKNOWN");
assert.equal(derive({...base,sameSlotHistoryValidityState:"FAIL"}).state,"FAIL");
assert.equal(derive({...base,slotHistoryCount:19}).state,"FAIL");
assert.equal(derive({...base,pvSlotRvol20:null}).state,"FAIL");

const pve255={
  marketDate:"2026-10-07",
  slotHistoryCount:20,
  pvSlotRvol20:0.728744939271255,
  baselineTableLastMarketDate:"2026-10-05"
};
const out=derive(pve255);
assert.equal(out.state,"UNKNOWN");
assert.equal(out.clean,null);
assert.ok(out.reasons.includes("BASELINE_AS_OF_DATE_UNKNOWN"));

console.log(JSON.stringify({assertions:10,status:"PASS",pve255:out}));
