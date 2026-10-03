# System1 Zero-Pick End-to-End Research Pipeline V0.1 — 2026-10-03

Status: CLASS-A PURE PIPELINE / FORMAL CORE LOCKED / NO WORKER OR D1 INTEGRATION

## Purpose

Join the already-frozen Class-A pieces into one outcome-blind zero-pick research path:

same-scan observer source
→ counterfactual rank-input observer
→ P1-A F9 eligibility filter
→ frozen 3+3 counterfactual comparator
→ research-only challenger membership.

## New invariant

The pipeline is valid only when the actual Formal selected count for that decision date is exactly 0.

A non-zero Formal selected count fails closed with:

`ZERO_PICK_PIPELINE_REQUIRES_FORMAL_ZERO_PICK_DATE`

This prevents the zero-pick challenger from being silently reused as a general replacement selector.

## Eligibility firewall

P1-A eligibility must be explicitly declared:

- source schema = `SYSTEM1_C5_SEMANTIC_REPAIR_V0_2`;
- outcomeBlind = true.

The pipeline itself does not inspect returns, MFE, MAE, future bars or later prices.

## Whole-date fail closed

For every eligible symbol:

- an observer source must exist;
- rank input must be COMPLETE;
- scanDate / captureGeneration / decisionAt must match the same decision generation.

If even one eligible symbol is missing or incomplete, the entire date is blocked.
No partial 3+3 challenger is emitted.

An incomplete non-eligible observer row does not block the date because it is not part of
the frozen P1-A F9 challenger population.

## Output states

- `NO_P1A_F9_ELIGIBLE`
- `BLOCKED_MISSING_ELIGIBLE_SOURCE`
- `BLOCKED_INCOMPLETE_ELIGIBLE_RANK_INPUT`
- `COUNTERFACTUAL_MEMBERSHIP_FROZEN_RESEARCH_ONLY`

No state authorizes allocation, execution, WATCH, BUY, push or orders.

## Current System1 zero-pick readiness

Class-A completed:

1. historical data-gap proof;
2. frozen 3+3 comparator;
3. Class-B prospective capture proposal;
4. pure same-scan rank-input observer;
5. end-to-end outcome-blind zero-pick research pipeline.

Still requires explicit Class-B owner approval:

- Worker C1 observer integration;
- immutable prospective persistence;
- production readback verification.

Still requires genuine future evidence after Class-B capture:

- clean zero-pick dates;
- challenger allocation/execution/cost receipts;
- mature outcome comparison;
- date-cluster / regime / anti-overfit validation.

Economic superiority remains UNKNOWN.
FORMAL_OPTIMIZATION_CANDIDATE remains NONE.
Formal Core remains LOCKED.
