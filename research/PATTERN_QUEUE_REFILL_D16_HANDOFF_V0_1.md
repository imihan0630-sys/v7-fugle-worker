# D01 DL-053 — D16 Queue-Refill / Structural-Rejection Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes structural-zone coincidence and book-refill timing semantics.
D16 owns generic-resiliency versus zone-specific inference.

## Required ladder

Q0 RAW_ZONE_REFILL
Q1 SHOCK_TYPE_CONTROLLED
Q2 PRE_SHOCK_DEPTH_SPREAD_CONTROLLED
Q3 GENERIC_NONSTRUCTURAL_REFILL_CONTROLLED
Q4 CANCELLATION_FLEETING_DEPTH_CONTROLLED
Q5 EXECUTION_INTERACTION_CONTROLLED
Q6 DL052_RECOVERY_PHASE_CONTROLLED
Q7 STRUCTURE_SPECIFIC_REFILL_RESIDUAL
Q8 MULTI_DATE_MULTI_REGIME_REPLICATION

## Generic control

Primary falsifier:
matched non-structural refill under comparable shock, side, spread/depth, volatility, tick and market mechanism.

Refill at the zone must beat ordinary book resiliency before a structural interpretation is interesting.

## Displayed vs executed

Displayed depth is cancellable and partial.
It is not hidden liquidity or committed defense.

Executed interaction at the refill price is stronger observability, but still not structural-memory proof.

## Timing

Post-freeze refill/recovery data are mechanism/outcome states and may not enter an earlier predictor.

## Owner boundary

D05 owns depth/spread/quote resiliency.
D01 only owns the zone relation.

## Promotion boundary

No DL-053 descriptor changes Formal ranking, weights, capital, Top6 or runtime.

Formal Core remains LOCKED.
