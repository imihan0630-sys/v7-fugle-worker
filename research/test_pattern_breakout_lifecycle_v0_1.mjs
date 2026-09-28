import assert from "node:assert/strict";
import { analyzeBreakoutLifecycle } from "./pattern_breakout_lifecycle_v0_1.mjs";

const B={boundaryId:"R1",lower:99,upper:101,version:"ZONE_V1"};
const bar=(date,low,high,close,extra={})=>({date,low,high,close,...extra});

// Intraday pierce rejected: not a confirmed false breakout.
const rejected=analyzeBreakoutLifecycle({
 direction:"UP",boundary:B,bars:[
  bar("2026-09-01",98,100,99),
  bar("2026-09-02",99,102,100),
 ]
});
assert.equal(rejected.firstConfirmedBreakAt,null);
assert.equal(rejected.falseBreakoutState,"REJECTED_PIERCE_ONLY");
assert.equal(rejected.latestState,"REJECTED_UPPER_PIERCE");

// Confirmed break -> retest -> hold: not false.
const healthy=analyzeBreakoutLifecycle({
 direction:"UP",boundary:B,bars:[
  bar("2026-09-01",98,100,99),
  bar("2026-09-02",100,103,102),
  bar("2026-09-03",100.5,104,103),
  bar("2026-09-04",101.2,105,104),
 ]
});
assert.equal(healthy.firstConfirmedBreakAt,"2026-09-02");
assert.equal(healthy.firstReentryAt,null);
assert.equal(healthy.falseBreakoutState,"CONFIRMED_BREAK_NOT_FAILED");

// Confirmed break -> reentry into zone: causal reentry, not yet below-zone failure.
const reentry=analyzeBreakoutLifecycle({
 direction:"UP",boundary:B,bars:[
  bar("2026-09-01",98,100,99),
  bar("2026-09-02",100,103,102),
  bar("2026-09-03",99.5,102,100),
 ]
});
assert.equal(reentry.firstReentryAt,"2026-09-03");
assert.equal(reentry.firstFailureAt,null);
assert.equal(reentry.falseBreakoutState,"REENTRY_OBSERVED");
assert.equal(reentry.barsToReentry,1);

// Confirmed break -> below-zone failure.
const failed=analyzeBreakoutLifecycle({
 direction:"UP",boundary:B,bars:[
  bar("2026-09-01",98,100,99),
  bar("2026-09-02",100,103,102),
  bar("2026-09-03",97,100,98),
 ]
});
assert.equal(failed.firstFailureAt,"2026-09-03");
assert.equal(failed.falseBreakoutState,"FAILURE_CONFIRMED");

// Failure -> reclaim is different from permanent failure.
const reclaimed=analyzeBreakoutLifecycle({
 direction:"UP",boundary:B,bars:[
  bar("2026-09-01",98,100,99),
  bar("2026-09-02",100,103,102),
  bar("2026-09-03",97,100,98),
  bar("2026-09-04",100,104,103),
 ]
});
assert.equal(reclaimed.firstFailureAt,"2026-09-03");
assert.equal(reclaimed.firstReclaimAt,"2026-09-04");
assert.equal(reclaimed.falseBreakoutState,"FAILED_THEN_RECLAIMED");

// Constrained breakout remains unresolved until first eligible unconstrained session.
const constrained=analyzeBreakoutLifecycle({
 direction:"UP",boundary:B,bars:[
  bar("2026-09-01",98,100,99),
  bar("2026-09-02",101,105,105,{priceLimitConstrained:true}),
  bar("2026-09-03",105,110,110,{priceLimitConstrained:true}),
  bar("2026-09-04",108,112,109,{priceLimitConstrained:false}),
 ]
});
assert.equal(constrained.firstConfirmedBreakAt,"2026-09-02");
assert.equal(constrained.firstObservableAfterConstrainedBreakAt,"2026-09-04");
assert.equal(constrained.acceptanceState,"OBSERVABLE");
assert.equal(constrained.falseBreakoutState,"CONFIRMED_BREAK_NOT_FAILED");

// Prefix before unconstrained resolution remains unresolved.
const constrainedPrefix=analyzeBreakoutLifecycle({
 direction:"UP",boundary:B,bars:[
  bar("2026-09-01",98,100,99),
  bar("2026-09-02",101,105,105,{priceLimitConstrained:true}),
  bar("2026-09-03",105,110,110,{priceLimitConstrained:true}),
 ]
});
assert.equal(constrainedPrefix.acceptanceState,"UNRESOLVED");
assert.equal(constrainedPrefix.falseBreakoutState,"UNRESOLVED_CONSTRAINED");

// Downside mirror: breakdown then reentry/failure above zone.
const downFail=analyzeBreakoutLifecycle({
 direction:"DOWN",boundary:B,bars:[
  bar("2026-09-01",100,103,102),
  bar("2026-09-02",96,100,98),
  bar("2026-09-03",100,103,102),
 ]
});
assert.equal(downFail.firstConfirmedBreakAt,"2026-09-02");
assert.equal(downFail.firstFailureAt,"2026-09-03");
assert.equal(downFail.latestState,"FAILED_ABOVE_ZONE");

// Non-eligible pseudo/session bar is ignored.
const ignorePseudo=analyzeBreakoutLifecycle({
 direction:"UP",boundary:B,bars:[
  bar("2026-09-01",98,100,99),
  bar("2026-09-02",0,0,0,{eligibleSymbolSession:false}),
  bar("2026-09-03",100,103,102),
 ]
});
assert.equal(ignorePseudo.firstConfirmedBreakAt,"2026-09-03");

console.log(JSON.stringify({ok:true,status:"PATTERN_BREAKOUT_LIFECYCLE_PASS"}));
