# D01 DL-080 — Structural Break / Regime Reset Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / REGIME_RESET_FIREWALL / FORMAL_CORE_LOCKED

## Purpose

Define when a genuine market-state change may alter the relevance of historical structural roots without allowing retrospective regime labels to erase failures or create hindsight-perfect resets.

Financial time series can experience abrupt or gradual distributional change. A regime shift can modify volatility, trend, liquidity, correlation, price-limit interaction, and the reliability of old structural levels. But the regime receipt must be observable online.

## Ownership boundary

D01 does not build a second global regime engine.

D01 consumes owner-certified regime/change-point receipts from the canonical domain owners and asks only:
- was the receipt known by predictor freeze?
- should historical structural roots remain active, downgraded, transformed, or blocked?
- does structural response retain incremental value within the new regime?

## Canonical regime receipt

Required:
- regimeEventId
- regimeOwner
- detectionMethodVersion
- changeCandidateAt
- firstObservableAt
- confirmedAt
- effectiveFrom
- predictorFreezeAt
- priorRegimeId
- currentRegimeId
- confidenceState
- replaySafe
- source/version/hash

Retrospective best-fit break dates are research labels only unless their firstObservableAt semantics are reconstructed.

## Root treatment states

- ROOT_ACTIVE_UNCHANGED
- ROOT_ACTIVE_WITH_REGIME_CONTEXT
- ROOT_FRESHNESS_REEVALUATION_REQUIRED
- ROOT_GEOMETRY_REESTIMATION_REQUIRED
- ROOT_TEMPORARILY_BLOCKED
- ROOT_INVALIDATED_BY_MECHANICAL_EVENT
- ROOT_INVALIDATED_BY_NEW_PRICE_DISCOVERY
- ROOT_STATE_UNKNOWN

Regime change alone does not automatically invalidate all old roots.

## No retrospective reset

Forbidden:
- detect a break using future data;
- move the break date backward after observing outcomes;
- delete pre-break failures;
- declare every post-break signal a new independent root;
- compare "before/after" using a break date unavailable at the time.

## Abrupt vs gradual change

Preserve separately:
- ABRUPT_CHANGE_CANDIDATE
- GRADUAL_DRIFT_CANDIDATE
- VOLATILITY_ONLY_CHANGE
- TREND_ONLY_CHANGE
- LIQUIDITY_ONLY_CHANGE
- MULTI_DIMENSIONAL_CHANGE
- CHANGE_TYPE_UNKNOWN

Different changes may affect structural geometry differently.

## Root survival hypothesis

Do not assume:
OLD_ROOTS_ALWAYS_FAIL_AFTER_REGIME_CHANGE
or
OLD_ROOTS_ALWAYS_PERSIST_AFTER_REGIME_CHANGE.

Future testing stratifies roots by:
- root age/freshness;
- distance from current price;
- price discovery since formation;
- regime-change type;
- volatility/liquidity changes;
- corporate-action/suspension/disposition overlap.

## Comparator design

A: same structural-root family under stable vs changed regime.
B: pre-existing roots vs newly formed post-change roots.
C: roots near vs far from new price-discovery zones.

All use predictor-time regime receipts and common support.

## D16 ladder

B0 RAW_PRE_POST_REGIME_RESPONSE
B1 REGIME_RECEIPT_PIT_VALIDATED
B2 RETROSPECTIVE_BREAK_LABEL_REMOVED
B3 ROOT_LINEAGE_PRESERVED
B4 CHANGE_TYPE_CLASSIFIED
B5 VOLATILITY_LIQUIDITY_TREND_CONTEXT_CONTROLLED
B6 ROOT_FRESHNESS_CONTROLLED
B7 NEW_PRICE_DISCOVERY_CONTROLLED
B8 PRE_EXISTING_VS_NEW_ROOT_COMPARATOR
B9 STABLE_REGIME_COMPARATOR
B10 OOS_REGIME_CONDITIONAL_INCREMENTALITY
B11 ROOT_SURVIVAL_OR_RESET_CANDIDATE

## Interpretation states

Q0 RETROSPECTIVE_BREAK_LOOKAHEAD
Q1 VOLATILITY_REGIME_EXPLANATION
Q2 TREND_REGIME_EXPLANATION
Q3 LIQUIDITY_REGIME_EXPLANATION
Q4 NEW_PRICE_DISCOVERY_EXPLANATION
Q5 OLD_ROOT_SURVIVAL
Q6 OLD_ROOT_DECAY
Q7 REGIME_RESET_RESIDUAL
Q8 REGIME_RECEIPT_UNKNOWN
Q9 NOT_EVALUABLE

## SDA

SDA-001 remains open: regime state is context, not an automatic extra vote on top of price structure.
SDA-002 remains open: retrospective break labels cannot enter live predictors.

## Current decision

REGIME_CHANGE_AUTOMATICALLY_INVALIDATES_ALL_ROOTS = FALSE.
RETROSPECTIVE_BREAK_DATE_MAY_ENTER_LIVE_FEATURES = FALSE.
POST_BREAK_ROOT_EQUALS_INDEPENDENT_ALPHA = FALSE.
REGIME_CONTEXT_EQUALS_EXTRA_CONFIRMATION_VOTE = FALSE.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Implement PIT regime-receipt validator and root-treatment classifier.
2. Add adversarial tests for retrospective break leakage, volatility-only change, unchanged root, new price discovery and unknown receipt.
3. Hand B0-B11/Q0-Q9 to D16.
4. Next D01 science: root survival after large discontinuities versus gradual regime drift, with explicit separation from corporate action and suspension mechanics already covered in DL-064~067.
