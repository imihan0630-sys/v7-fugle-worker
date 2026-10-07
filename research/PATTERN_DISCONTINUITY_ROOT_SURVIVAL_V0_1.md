# D01 DL-081 — Discontinuity vs Gradual-Drift Root Survival V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / ROOT_SURVIVAL_HETEROGENEITY / FORMAL_CORE_LOCKED

## Purpose

Test whether an old structural root should be treated differently after abrupt price discontinuity versus gradual regime drift.

No old root is automatically deleted at a break. No old root is automatically preserved.

## Discontinuity taxonomy

Keep distinct:
- EVENT_GAP
- PRICE_LIMIT_CATCHUP
- SUSPENSION_RESUMPTION_REPRICING
- CORPORATE_ACTION_MECHANICAL_RESET
- LIQUIDITY_GAP_CROSS
- MARKET_WIDE_GAP
- SYMBOL_SPECIFIC_INFORMATION_REPRICING
- UNKNOWN_DISCONTINUITY

Corporate-action and suspension mechanics must be resolved by prior D01 firewalls before any structural interpretation.

## Gradual drift taxonomy

- VOLATILITY_DRIFT
- TREND_DRIFT
- LIQUIDITY_DRIFT
- CORRELATION_REGIME_DRIFT
- MULTI_DIMENSIONAL_DRIFT

Gradual drift preserves a continuous observation path but can still erode root relevance.

## Root survival receipt

Preserve:
- structuralRootId
- rootFormationAt
- rootLastInteractionAt
- discontinuityOrDriftEventId
- eventType
- eventFirstObservableAt
- preEventDistanceToRoot
- postEventDistanceToRoot
- interveningPriceDiscoveryDistance
- rootFreshnessBefore
- rootFreshnessAfterCandidate
- corporateActionState
- suspensionState
- priceLimitState
- predictorFreezeAt
- replaySafe

## Denominator

Retain every pre-existing eligible root:
- survived_and_reacted
- survived_no_revisit
- crossed_without_reaction
- mechanically_rebased
- temporarily_blocked
- invalidated_by_new_price_discovery
- data_blocked

Do not reset the denominator at a regime break.

## Competing mechanisms

S1 BEHAVIORAL_MEMORY_SURVIVES
S2 INFORMATION_REPRICING_DOMINATES
S3 MECHANICAL_RESET_ONLY
S4 LIQUIDITY_GAP_ARTIFACT
S5 PRICE_LIMIT_DELAYED_DISCOVERY
S6 GRADUAL_DECAY
S7 ROOT_REACTIVATION_AFTER_DRIFT
S8 NOT_IDENTIFIED

## D16 ladder

D0 RAW_ROOT_SURVIVAL
D1 DISCONTINUITY_TYPE_CLASSIFIED
D2 MECHANICAL_RESET_REMOVED
D3 SUSPENSION_AND_LIMIT_STATE_CONTROLLED
D4 LIQUIDITY_GAP_CONTROLLED
D5 EVENT_INFORMATION_CONTEXT_CONTROLLED
D6 FRESHNESS_BEFORE_EVENT_CONTROLLED
D7 INTERVENING_PRICE_DISCOVERY_MEASURED
D8 ABRUPT_VS_GRADUAL_COMMON_SUPPORT
D9 FULL_PREEXISTING_ROOT_DENOMINATOR
D10 OOS_ROOT_SURVIVAL_HETEROGENEITY
D11 ROOT_SURVIVAL_RESIDUAL_CANDIDATE

## Current decision

ABRUPT_BREAK_AUTOMATICALLY_KILLS_ROOT = FALSE.
GRADUAL_DRIFT_AUTOMATICALLY_PRESERVES_ROOT = FALSE.
BREAK_DATE_RESETS_DENOMINATOR = FALSE.
MECHANICAL_GAP_EQUALS_INFORMATION_REPRICING = FALSE.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

DL-082: single-candle geometry normalized into PIT-safe, name-independent morphology with context and microstructure firewalls.
