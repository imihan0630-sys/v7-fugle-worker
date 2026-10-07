# System1 Selected→BUY Cause Classifier V0.1 — 2026-10-07

Status: CLASS-A OFFLINE CLASSIFIER / FORMAL CORE LOCKED / NO RUNTIME CAPTURE ADDED

## Why this exists

The existing selected-to-BUY research established that missing BUY rows cannot prove NO_BUY because the current execution recorder is not exhaustive. It also established two separate maxChase layers:

- B-channel 15-minute close maxChase inside evaluateMomentum;
- operation-layer current quote maxChase inside evaluateOperationSignals.

This classifier turns **certified complete monitor/session receipts** into machine-readable no-BUY causes without changing Formal behavior.

## Hard evidence rules

A negative session can be called `NO_BUY_COMPLETE` only when:

- expected monitor run IDs are frozen;
- every expected run is present;
- the plan is present in every expected run;
- every expected run completed;
- no foreign/unexpected run contaminates the receipt;
- negative signal coverage is independently certified;
- no BUY signal exists.

If any negative-coverage prerequisite is missing:
`NO_BUY_UNKNOWN_COVERAGE`.

Positive same-symbol BUY evidence remains usable even when negative coverage is incomplete:
`BUY_SIGNAL_OBSERVED_NO_FILL_EVIDENCE`.

Actual fill remains UNKNOWN.

## maxChase semantics

`MAX_CHASE_15M_BLOCK_B` requires the exact numeric predicate:
latest completed 15m close > plan.maxChase.

`MAX_CHASE_QUOTE_BLOCK` requires:
finalDecision=buy AND currentPrice > plan.maxChase.

They are separate causes. One symbol may encounter both during the same session. The receipt therefore preserves:

- cause event counts;
- cause membership set;
- unique maxChase symbol count.

The bridge-facing row is one row per symbol/session, preventing two maxChase layers from becoming two fake stocks.

## Other frozen causes

The classifier also recognizes:
- source freshness;
- plan-date validity;
- trial quote;
- stop invalidation;
- A never reached zone;
- A zone failed/no confirm;
- B no valid breakout;
- B valid breakout/no retest;
- B retest failed/no reacceleration.

Text-based causes are bound to frozen current Formal phrases and fail to unresolved if wording/semantics drift. They are not inferred from approximate price paths.

## Boundary

This file does not create exhaustive monitor receipts. Existing runtime remains unable to prove historical NO_BUY by absence.

Any exact-date exhaustive monitor recorder/persistence remains Class-B proposal-first.
Any BUY/maxChase/retest rule change remains Class-C owner approval.

No Worker, D1, scheduled capture, A/B, ranking, Top6/3+3, capital, signals, push, orders or System2 changes.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
