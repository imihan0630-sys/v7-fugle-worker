import assert from "node:assert/strict";
import {evaluateBollingerPostResetParentShortcutV0_1 as e} from "./d03_bollinger_post_reset_parent_shortcut_v0_1.mjs";
const sessions=(start=1)=>Array.from({length:20},(_,i)=>`2026-09-${String(start+i).padStart(2,"0")}`);
const parent={decisionCutoffAt:"2026-09-30T13:30:00+08:00"};
const base={bindingEligible:true,exactEligibleSessions:sessions(5)};
const reset={lastCertifiedPriceResetDate:"2026-09-04",resetKnownAt:"2026-09-04T08:00:00+08:00",sameSecurityIdentityContinuing:true,identityTransitionDisposition:"SAME_SECURITY_CONTINUING",priceResetFamilySetVersion:"D03_PRICE_RESET_FAMILY_SET_V0_1",unresolvedResetEventCount:0,pseudoBarCount:0};

assert.equal(e({parent,boundContinuity:base,resetReceipt:reset}).shortcutEligible,true);
assert.equal(e({parent,boundContinuity:{...base,exactEligibleSessions:["2026-09-04",...sessions(6).slice(0,19)]},resetReceipt:reset}).shortcutEligible,false);
assert.equal(e({parent,boundContinuity:base,resetReceipt:{...reset,sameSecurityIdentityContinuing:false,identityTransitionDisposition:"IDENTITY_TERMINATED"}}).shortcutEligible,false);
assert.equal(e({parent,boundContinuity:base,resetReceipt:{...reset,resetKnownAt:"2026-10-01T08:00:00+08:00"}}).shortcutEligible,false);
assert.equal(e({parent,boundContinuity:base,resetReceipt:{...reset,unresolvedResetEventCount:1}}).shortcutEligible,false);
assert.equal(e({parent,boundContinuity:{...base,exactEligibleSessions:sessions(5).slice(0,19)},resetReceipt:reset}).shortcutEligible,false);

console.log(JSON.stringify({status:"PASS",cases:6,rule:"POST_RESET_20_CLEAN_PARENT_SESSIONS"}));
