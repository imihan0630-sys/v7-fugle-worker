# Pattern Breakout / False-Break Lifecycle v0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_FREE / FROZEN_V0_1
Formal Core: LOCKED

## Purpose

Replace the loose phrase "false breakout" with causal, as-of lifecycle states usable across:
- W / M;
- Cup;
- VCP;
- Platform;
- other versioned structural boundaries.

No future-return threshold is used.

## D01-FB01 — A rejected intraday pierce is not the same as a failed confirmed breakout

UP example:
- High trades above resistance;
- Close finishes back inside/below the zone;
- no prior close-confirmed break exists.

State:
REJECTED_UPPER_PIERCE.

This may support an Upthrust-like / rejection description.

It is NOT:
"confirmed breakout failed"
because no confirmed close break existed.

DOWN mirror:
REJECTED_LOWER_PIERCE / Spring-like candidate.

## D01-FB02 — Confirmed break is a structural event, not acceptance proof

UP:
Close > upper boundary.

DOWN:
Close < lower boundary.

This freezes firstConfirmedBreakAt.

It does not by itself assert:
- future continuation;
- profitability;
- market acceptance;
- BUY/SELL.

## D01-FB03 — Retest is not failure

After an UP close break:
- Low may revisit the upper boundary;
- Close can remain above.

State:
RETESTING_FROM_ABOVE.

That is materially different from:
REENTERED_ZONE
or
FAILED_BELOW_ZONE.

The mirror applies to downside breakdowns.

## D01-FB04 — Reentry and deeper failure are distinct

UP breakout:

REENTERED_ZONE:
later Close returns inside [lower, upper].

FAILED_BELOW_ZONE:
later Close moves through the full zone and closes below lower.

Therefore "price came back" has at least two severities.

No fixed 3-day/5-day window is embedded.
Store barsToReentry continuously.

## D01-FB05 — Failure can later reclaim

A failed/reentered break may later close beyond the same versioned boundary again.

State:
RECLAIMED_ABOVE / RECLAIMED_BELOW.

Do not permanently label the entire episode as dead after first reentry.

Reclaim timing is a separate descriptive path variable.

## D01-FB06 — No follow-through is not automatically false breakout

If price:
- remains above an UP boundary;
- but advances very little,

there is no structural reentry/failure yet.

Call it:
confirmed break with weak/no follow-through context,
not false breakout.

Future research may study max extension / time-above separately.

## D01-FB07 — Price-limit constrained break remains unresolved

If a structural break occurs on a price-limit-constrained session:

preserve:
- structuralBreakObserved=true;
- firstConfirmedBreakAt.

But ordinary acceptance interpretation is:
UNRESOLVED.

Continue through constrained eligible sessions.

The first later eligible unconstrained symbol-session becomes the first ordinary observability point.

This follows the existing 5314 real-source stress witness.

## D01-FB08 — Session-invalid pseudo-bars cannot create failure

A provider bar on a verified non-symbol-session / suspension pseudo-date is not eligible lifecycle evidence.

It cannot:
- create a breakout;
- create a reentry;
- shorten barsToReentry.

Lifecycle duration counts eligible observed symbol sessions.

## D01-FB09 — Corporate-action mechanical reset is outside false-break semantics

Breakout/failure geometry consumes TECHNICAL_CONTINUITY.

A mechanical ex-right / split / capital-reduction reset must not create:
- rejected pierce;
- breakdown;
- false breakout.

Residual non-mechanical market movement after continuity processing remains observable.

## D01-FB10 — False-breakout state vocabulary

NO_BREAK_EVENT

REJECTED_PIERCE_ONLY

CONFIRMED_BREAK_NOT_FAILED

REENTRY_OBSERVED

FAILURE_CONFIRMED

REENTERED_THEN_RECLAIMED

FAILED_THEN_RECLAIMED

UNRESOLVED_CONSTRAINED

These are descriptive lifecycle states, not trade directions.

## D01-FB11 — W/M, Cup and VCP consume the same lifecycle engine

The family supplies:
- its versioned boundary zone;
- direction;
- episode identity.

The lifecycle engine supplies:
- break/retest/reentry/failure/reclaim chronology.

Therefore each named family must not implement its own incompatible definition of "false breakout."

One shared trigger boundary event can be referenced by multiple labels through the dedup contract.

## D01-FB12 — Research variables for future prospective study

Outcome-free capture may store:
- firstPierceAt;
- firstConfirmedBreakAt;
- firstObservableAfterConstrainedBreakAt;
- firstReentryAt;
- firstFailureAt;
- firstReclaimAt;
- barsToReentry;
- maxObservedExtension;
- current lifecycle state;
- acceptance observability state.

Later outcome studies may compare these paths only after prospective coverage gates clear.

No fixed barsToReentry threshold is promoted now.

## Current status

FALSE_BREAK_TAXONOMY = FROZEN_V0_1
CAUSAL_LIFECYCLE = EXECUTABLE_RESEARCH_ONLY
PRICE_LIMIT_UNRESOLVED = REQUIRED
SESSION_PSEUDO_BAR = IGNORED/BLOCKED_BY_PROVENANCE
DIRECTIONAL_ALPHA = UNKNOWN
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Run adversarial lifecycle tests.
2. Add prefix-invariance tests: historical state at t must not change when future bars are appended.
3. Add boundary-version-change falsification: lifecycle cannot silently continue across changed neckline/rim/pivot definition.
4. Connect W/M, Cup, VCP and Sakata micro context through shared episode/boundary references, not duplicate scores.
5. No outcomes and no Formal change.
