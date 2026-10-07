# D16 Strategy-Clock Over-gating Reclassification 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / PRIOR_RUNTIME_DEFECT_HYPOTHESIS_SUPERSEDED / REVIEW_CLOCK_MISMATCH_WATCHLIST_RETAINED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
Runtime impact: NONE

## Purpose

Correct the earlier Room11 interpretation recorded in:
`research/D16_STRATEGY_CLOCK_OVERGATING_VALIDATION_20261007_V0_1.md`.

The earlier artifact correctly observed:
`GLOBAL_REQUIRED_SET != SHORT_MOMENTUM_NON_INCOMPLETE_REQUIRED_SET`.

However it inferred that the broader global Decision Clock was an active Stage-1 SHORT_MOMENTUM runtime gate.

Latest-main runtime readback disproves that coupling.

Historical research remains append-only.
The earlier artifact is not deleted.
Its CURRENT_RUNTIME_DEFECT classification is superseded by this reclassification.

## New authoritative evidence

Canonical independent verification:
`system2/evidence/S2_CORR_20261007_002_REJECTION_VERIFICATION_20261007_V0_1.json`.

Verified current runtime:

### Stage-1 preflight

`daily_shadow_input_preflight_v0_1.mjs` defines global readiness from:
- A1 source READY;
- PIT history global integrity READY;
- assessor readiness.

It does NOT depend on:
- B2;
- A5;
- global Decision Clock `requiredReady`.

### SHORT_MOMENTUM assessor

Frozen required families:
- TECHNICAL_STRUCTURE;
- PRICE_VOLUME;
- RISK_FRICTION.

B2/A5 are not launch-required.

### Limited Shadow strategy run

`daily_shadow_orchestrator_v0_1.mjs` requires:
- A1 batch;
- PIT history;
- strategy contract;
- assessor.

It does not consume the broader global review-clock gate.

### Capacity orchestration

Capacity consumes completed strategy runs.
Current code does not require B2/A5/global `requiredReady`.

## Correct D16 classification

The following remains TRUE:

`GLOBAL_REVIEW_CLOCK_REQUIRED_SET != SHORT_MOMENTUM_STAGE1_REQUIRED_SET`.

But the following is NOT CURRENTLY PROVEN:

`GLOBAL_REVIEW_CLOCK -> SHORT_MOMENTUM_RUNTIME_GATE`.

Therefore current classification is:

`REVIEW_CLOCK_SEMANTIC_MISMATCH / NO_CURRENT_RUNTIME_OVERGATING_PROVEN / FUTURE_WIRING_WATCHLIST`.

## Why this correction matters statistically

D16 must distinguish:
1. a broad research/review observability artifact;
2. the actual runtime admission gate;
3. the strategy-local decision clock.

A mismatch between 1 and 3 can mislead audit interpretation.
It does not create sample-selection bias unless 1 actually gates 2/3 or is used to define the analysis denominator.

The earlier statistical censoring consequences remain valid only conditionally:
IF a future runtime wires the broad clock into strategy admission,
THEN strategy-irrelevant missingness can create artificial censoring.

They are not current observed runtime effects.

## D16-14 consequence

D16-14 retains an important architecture result:
global review-clock semantics and strategy-stage decision-clock semantics are distinct estimands.

But current evidence now narrows the concern:
- runtime SHORT_MOMENTUM already uses strategy-appropriate dependencies;
- review-clock evidence can still understate or misdescribe launch readiness if used for audit/navigation;
- future integration must not accidentally make the broader clock authoritative for strategy admission.

No maturity promotion or demotion is justified.

## D16-09 consequence

Do not invalidate current SHORT_MOMENTUM runtime coverage merely because the broad review clock is not READY.

Instead bind each coverage statistic to its actual admission authority:
- Stage-1 preflight;
- strategy assessor;
- strategy run;
- capacity run.

Only if a coverage metric actually uses the broad review clock does the earlier censoring warning apply.

## D18 consequence

A missing strategy run must be classified from actual execution lineage.

Do not infer POLICY_DISABLED, DATA_UNKNOWN or infrastructure blocking from the global review clock alone.

The earlier D18 firewall remains useful, but its trigger must be an actual strategy-run/admission receipt.

## Governance lesson

A semantic inconsistency is not automatically a runtime defect.

Required future sequence:
1. identify the suspected dependency;
2. trace actual consumers;
3. verify imports/calls/readiness predicates;
4. inspect runtime regression tests;
5. only then classify sample-selection consequences as physically active.

This is now a D16 anti-self-confirmation rule.

## Maturity decision

No maturity change.

The value of this artifact is correction of an overclaim, not a new positive maturity signal.

## Exact next continuation

1. Treat S2-CORR-20261007-002 as REJECTED_WITH_EVIDENCE for current runtime.
2. Preserve the global-vs-strategy clock mismatch as a future-wiring watchlist.
3. Use actual Stage-1 admission receipts for D16/D18 denominator accounting.
4. If future code wires the global review clock into strategy execution, reopen the censoring test prospectively.
