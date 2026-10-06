# D01 DL-054 — D16 Quote-Flicker / Depth-Persistence Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes mechanism semantics.
D16 owns future common-support / residual inference.

Main question:
Does zone-associated rejection survive after distinguishing economically durable displayed liquidity from same-price replacement and quote flicker?

## Required states

D0 DEPTH_PERSISTENCE_UNKNOWN
D1 FLICKERING_OR_REPLACED_DEPTH
D2 DEPTH_SURVIVAL_CERTIFIED
D3 DL053_REFILL_AFTER_DEPLETION
D4 NO_MEANINGFUL_DEPTH

## Required comparisons

F0 RAW_ZONE_REJECTION
F1 DL053_REFILL_STATE_CONTROLLED
F2 ORDER_SURVIVAL_VS_REPLACEMENT_SEPARATED
F3 CANCELLATION_REPOST_ACTIVITY_CONTROLLED
F4 GENERIC_FLICKER_CONTROLLED
F5 EVENT_CLOCK_COMPLETENESS_CONTROLLED
F6 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE
F7 MULTI_DATE_MULTI_TICK_TIER_REPLICATION

## Owner boundary

D05 supplies valid event-clock, order-survival/cancellation/repost/flicker receipts.

D01 must not reconstruct these from OHLCV or sparse snapshots.

## Timing

Future order survival is not baseline evidence unless the required survival horizon is already known by predictorFreezeAt.

Post-freeze persistence is mediator/outcome-side mechanism state.

## Anti-double-count

Zone, depth, cancel, repost and persistence receipts remain one causal parent.

effectiveIndependentEvidenceCount = 1 by default.

## Manipulation caution

Flicker/cancellation is not equivalent to spoofing/manipulation.
Do not infer intent without external owner/regulatory evidence.

## Promotion boundary

No ranking/gating/Top6/weight/capital/runtime change is authorized.
Formal Core remains LOCKED.
