# D03 Pre-Parent Continuity Clock Audit V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_BLIND / SHARED-OWNER_HANDOFF_REQUIRED
Formal Core: LOCKED

## TI-636 — parent existence is not continuity-clock readiness

The first genuine V8.17 parent is expected from the normal System 1 after-market scan.

Current production schedule:
- 17:00-17:59 Asia/Taipei: history warmup;
- 18:10 Asia/Taipei: after-market scan / immutable C1 parent generation.

C1 decisionAt is actual runtime `new Date().toISOString()`, not a fabricated fixed clock.

A promotion-grade Technical child requires continuity evidence that was causally known no later than that parent decisionAt.

Therefore:
`FIRST_GENUINE_PARENT_EXISTS != CUTOFF_SAFE_CONTINUITY_RECEIPT_EXISTS`.

## TI-637 — existing 16:30 raw-history warmup cannot fill the continuity gate

The scheduled `system2-recent-a1-hot-history-warmup` runs at 16:30 Taipei and can provide bounded recent raw A1 history.

Its own authority contract says:
- historyCoverageOnly=true;
- continuityStateForNewRows=UNVERIFIED;
- continuityPromotionPerformed=false.

Thus it is useful raw-history substrate but not a certified TECHNICAL_CONTINUITY receipt.

## TI-638 — existing 18:35 diagnostic is too late for the 18:10 parent

The existing System 2 daily diagnostic is scheduled at 18:35 Taipei.

Even if it later obtains perfect source content, a newly captured revision/version at 18:35 cannot be relabeled as evidence known by an 18:10 parent.

Historical sourceReportedAt is not a substitute because current shared research explicitly keeps exact historical firstKnownAt uncertified.

Therefore:
`18:35_CAPTURE -> 18:10_PARENT = SOURCE_CAPTURE_AFTER_PARENT`.

## TI-639 — continuity capability workflows are not an automatic pre-parent observer

Repository continuity/MOPS/official-source capability workflows are currently triggered by:
- manual workflow dispatch; and/or
- push/path changes.

The audit found no automatic recurring pre-18:10 promotion-grade continuity capture among those workflows.

Their physical source capability evidence remains valuable, but capability workflows are not a daily causal observer.

## TI-640 — frozen pre-parent clock acceptance

A future promotion-grade pre-parent continuity capture must satisfy:
- same marketDate as parent scanDate;
- capturedAt <= parent knownAt;
- continuityState=CERTIFIED;
- exactVersionObserved=true;
- firstObservedAtCertified=true;
- noRevisionGapThroughParent=true;
- symbolSessionCoverageComplete=true.

These are deliberately stricter than "we fetched the page sometime that day."

## TI-641 — current first-parent promotion readiness

Current outcome-blind clock audit:

`PRE_PARENT_CERTIFIED_CONTINUITY_CAPTURE_NOT_PRESENT`

Therefore, under today's runtime/schedules:
- first genuine V8.17 parent alone cannot promote Bollinger;
- first genuine V8.17 parent alone cannot promote ADX;
- Monday must not be described as an automatic 58.3%/60.0% unlock.

A shared continuity-owner implementation is needed to create the cutoff-safe receipt clock.

D03 should not fork a local corporate-action observer or silently add Formal provider calls.

## TI-642 — owner handoff requirement

The shared continuity owner must decide/implement the causal source clock.

Acceptable architecture classes may include:
- an owner-managed immutable prospective source observer whose final certified state is available no later than the parent cutoff; or
- another owner-certified mechanism proving exact source-version availability at the parent cutoff.

D03 does not prescribe a new Production cron from inside the indicator lane.

Any solution must preserve:
- no historical knownAt fabrication;
- immutable revision/version rows;
- symbol-session completeness;
- parent cutoff causality;
- source/version hashes;
- no Formal signal/selection/capital impact.

## TI-643 — maturity decision

This audit finds a new real blocker rather than a new maturity level.

D03 remains 56.7%.

This is a stricter and more accurate continuation point:
the next genuine parent is necessary, but **pre-parent certified continuity capture is independently necessary**.

Current:
`PRE_PARENT_CERTIFIED_CONTINUITY_CAPTURE = ABSENT`
`FIRST_GENUINE_V8_17_PARENT = PENDING`
`BOLLINGER_FIRST_PARENT_PROMOTION_READY = FALSE`
`ADX_FIRST_PARENT_PROMOTION_READY = FALSE`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`
