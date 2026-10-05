# D01 DL-036 — D16 Inherited-vs-New Structure / SDA Handoff V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED / SDA_001_SDA_002_REMEDIATION

## 1. Purpose

D01 freezes causal structural lineage and no-lookahead eligibility.

D16 owns future residual/common-support inference.

The central questions are:

1. Does inherited old-role history add representation beyond a genuinely new post-break structure?
2. Does the new post-break structure add representation beyond inherited polarity history?
3. Does apparent dual-structure confluence survive common PRICE_OHLC residualization?

## 2. Required classes

Preserve:
- C0 INHERITED_ONLY;
- C1 NEW_ONLY;
- C2 DUAL_COLOCATED;
- C3 SAME_ROOT_EXTENSION;
- C4 POST_HOC_NEW_STRUCTURE.

Do not merge C3 into C1/C2.
Do not allow C4 into a pretest predictor set.

## 3. Same parent / information root

Even C2 has:
informationRoot = PRICE_OHLC.

Two structural roots are not two independent evidence families.

For raw-vs-dedup diagnostics report:
- rawRepresentationCount;
- distinctStructuralRootCount;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus.

Default effectiveIndependentEvidenceCount = 1 until D16 validates residual contribution.

## 4. Timing / hindsight

For every new candidate:
- firstObservableAt;
- confirmedAt;
- latestAnchorAt;
- predictorFreezeAt;
- replaySafe;
- futureBarRequired.

Any candidate requiring the tested retest bar or later confirmation is excluded from that test's predictor state.

This is mandatory SDA-002 evidence.

## 5. Total vs mediator interpretation

A new post-break structure may be caused by the breakout path.

Therefore:
- total inherited-polarity estimand should not casually control it away;
- path/mechanism-conditional estimands may include it with explicit post-treatment status.

D16 must name the estimand.

## 6. Common support

Future comparison should control:
- breakout quality;
- D02 acceptance/persistence;
- salience;
- volatility/liquidity/regime;
- age;
- scale migration;
- displacement/path;
- retest-arrival selection;
- pretest structural timing.

No extrapolation outside common support.

## 7. SDA-001 closure boundary

This handoff is not audit closure.

Still required:
- deterministic cross-representation alias/duplicate tests;
- System 1 / System 2 lineage + dedup implementation;
- common-parent residual comparison;
- D16 readback;
- independent 00 closure.

## 8. SDA-002 closure boundary

This handoff is not audit closure.

Still required:
- replay-safe pattern receipt implementation;
- deterministic future-bar adversarial tests in the consuming systems;
- negative/divergent case preservation;
- independent 00 readback.

## 9. Promotion boundary

No ranking, gating, Top6, score, weight, threshold, capital or runtime change is authorized.

Formal Core remains LOCKED.
