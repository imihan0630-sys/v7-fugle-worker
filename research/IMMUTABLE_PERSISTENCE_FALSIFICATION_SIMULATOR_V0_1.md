# Immutable Persistence Falsification Simulator V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / NO_D1_WRITES
Formal Core: LOCKED

## TI-492 — Purpose

Execute the two-phase publication contract against failure cases before any D1 schema is implemented.

## TI-493 — Partial parent generation

100 expected parents.
Only 73 staged.

Result:
UNPUBLISHED.

A physically present 73-row partial generation is invisible to inference because no final generation receipt exists.

## TI-494 — Exact retry

Retry the same first 73 identities/fingerprints with a later operational timestamp.

Result:
73 EXACT_DUPLICATE_NO_OP.

The original first capturedAt remains unchanged.

Then the missing 27 can be inserted without deleting/replacing the first 73.

This proves retry can be additive/idempotent instead of destructive.

## TI-495 — Conflicting retry

Same parent identity, changed semantic fingerprint.

Result:
PROVENANCE_CONFLICT.

Even if row count/keyset otherwise matches, final certification is blocked.

## TI-496 — Same-count wrong-set substitution

Expected set and observed set both contain 100 parents.
One identity is substituted.

Result:
UNPUBLISHED because parentKeysetHash differs.

Count equality alone is falsified as a completeness proof.

## TI-497 — Observer partial failure does not invalidate Formal

Formal generation already has a valid final generation receipt.

Technical observer reaches only 64/100 ROOT attempts.

Result:
- Formal generation remains valid/visible;
- Technical inference remains unpublished;
- no Formal rerun/mutation occurs.

This is the required fail-open separation.

## TI-498 — Complete observer

100/100 attempts,
exact parent keyset hash,
missing=0,
conflicts=0,
QA failures=0.

Result:
eligible for immutable final observer-run receipt.

This does not imply alpha maturity; it proves evidence-capture completeness only.

## Current status

PARTIAL_GENERATION_FIREWALL = PASS_SYNTHETIC
EXACT_RETRY_IDEMPOTENCY = PASS_SYNTHETIC
CONFLICT_FIREWALL = PASS_SYNTHETIC
SAME_COUNT_WRONG_SET_FIREWALL = PASS_SYNTHETIC
FORMAL_VS_RESEARCH_FAILURE_ISOLATION = PASS_SYNTHETIC
D1_RUNTIME = NOT_IMPLEMENTED
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.
