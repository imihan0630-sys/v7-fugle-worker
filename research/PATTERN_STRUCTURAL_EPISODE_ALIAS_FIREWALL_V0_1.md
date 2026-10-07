# D01 DL-075 — Structural Episode Identity / Multi-Signal Alias Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / EPISODE_ALIAS_FIREWALL / FORMAL_CORE_LOCKED

## Purpose

Prevent one underlying price-path episode from being transformed into multiple apparently independent signals.

A single structural episode can sequentially emit:
- breakout;
- breakout confirmation;
- retest;
- reclaim;
- continuation;
- higher-low;
- momentum confirmation;
- moving-average confirmation.

These are often representations of one evolving path, not independent evidence.

## Immutable episode identity

Freeze:
- structuralEpisodeId
- structuralRootId
- episodeStartAt
- firstObservableAt
- breakoutAt
- retestAt
- reclaimAt
- continuationAt
- invalidationAt
- episodeEndAt
- predictorFreezeAt
- source/version/hash
- replaySafe

No later phase creates a new episode unless an explicit new-root rule is satisfied.

## Representation family

Default price-derived aliases:
- BREAKOUT_REPRESENTATION
- RETEST_REPRESENTATION
- RECLAIM_REPRESENTATION
- CONTINUATION_REPRESENTATION
- HIGHER_LOW_REPRESENTATION
- PRICE_MOMENTUM_REPRESENTATION
- TREND_FILTER_REPRESENTATION

Default:
informationRoot = PRICE_OHLC
redundancyGroup = structuralEpisodeId
effectiveIndependentEvidenceCount = 1

## New-root test

A new structural episode requires preregistered criteria such as:
- prior episode formally invalidated or completed;
- sufficient independent price discovery after completion;
- new structural root formed without future-bar lookahead;
- new episode firstObservableAt after new-root formation.

A retest of the same broken resistance is not automatically a new root.

## Signal inflation firewall

If one episode emits four price-derived states, raw signal count may equal four while effective independent evidence remains one.

Required diagnostics:
- rawSignalCount
- effectiveIndependentEvidenceCount
- aliasFamilyCount
- episodeCount
- newRootCount

## Timing quality vs structural value

Entry on breakout, retest, reclaim, or continuation can produce different execution timing and risk geometry even if structural information is the same.

Therefore separate:
- STRUCTURAL_INFORMATION_VALUE
- ENTRY_TIMING_VALUE
- EXECUTION_QUALITY
- RISK_GEOMETRY_VALUE

A better retest entry does not prove retest contains new alpha.

## Failure lifecycle

One episode preserves failure transitions:
- BREAKOUT_FAILED
- RETEST_FAILED
- RECLAIM_FAILED
- CONTINUATION_FAILED
- EPISODE_INVALIDATED

Do not delete failed states when a later reclaim succeeds.

## D16 ladder

E0 RAW_MULTI_SIGNAL_PERFORMANCE
E1 EPISODE_IDENTITY_RECONSTRUCTED
E2 REPRESENTATION_ALIASES_DEDUPED
E3 NEW_ROOT_RULE_APPLIED
E4 FIRST_OBSERVABLE_CLOCK_VALIDATED
E5 ENTRY_TIMING_SEPARATED
E6 EXECUTION_QUALITY_SEPARATED
E7 RISK_GEOMETRY_SEPARATED
E8 FAILED_PHASES_RETAINED
E9 SAME_EPISODE_COMMON_SUPPORT
E10 RAW_VS_DEDUP_INCREMENTAL_COMPARISON
E11 OOS_EPISODE_LEVEL_VALIDATION
E12 STRUCTURAL_EPISODE_RESIDUAL_CANDIDATE

## Interpretation states

Q0 SIGNAL_ALIAS_INFLATION
Q1 ENTRY_TIMING_EXPLANATION
Q2 EXECUTION_EXPLANATION
Q3 RISK_GEOMETRY_EXPLANATION
Q4 FAILURE_SURVIVORSHIP_EXPLANATION
Q5 GENUINE_NEW_ROOT
Q6 STRUCTURAL_EPISODE_RESIDUAL
Q7 EPISODE_CLOCK_UNKNOWN
Q8 NOT_EVALUABLE

## SDA

This tranche directly remediates SDA-001 and SDA-002 but does not close them.

SDA-001: price-derived aliases remain one vote until D16 incrementality and engineering readback exist.
SDA-002: firstObservableAt/confirmedAt/newRoot clocks remain PIT replay requirements.

## Current decision

BREAKOUT_RETEST_RECLAIM_CONTINUATION_EQUAL_FOUR_VOTES = FALSE.
BETTER_ENTRY_TIMING_EQUALS_NEW_STRUCTURAL_ALPHA = FALSE.
LATER_SUCCESS_MAY_DELETE_EARLIER_FAILURE = FALSE.
RETEST_AUTOMATICALLY_CREATES_NEW_ROOT = FALSE.
DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT = 1.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Implement deterministic episode alias/new-root classifier.
2. Add adversarial tests for signal-count inflation, failed-breakout then reclaim, same-root retest and future-bar new-root leakage.
3. Hand E0-E12/Q0-Q8 to D16.
4. Continue DL-076: retest path-quality decomposition and confirmation-delay tradeoff.
