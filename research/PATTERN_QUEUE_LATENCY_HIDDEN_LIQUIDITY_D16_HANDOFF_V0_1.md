# D01 DL-055 — D16 Queue / Latency / Hidden-Liquidity Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes interpretation semantics.
D16 owns future common-support / residual inference.

Main question:
Does structural-zone rejection retain residual representation after queue-priority, latency, hidden-liquidity and generic execution-mechanics context are controlled?

## Queue states

Q0 EXACT_QUEUE_POSITION_KNOWN
Q1 QUEUE_AHEAD_PROXY_ONLY
Q2 QUEUE_POSITION_UNKNOWN

Public top-five alone cannot enter Q0.

## Hidden-liquidity states

H0 DISPLAYED_ONLY_OBSERVED
H1 HIDDEN_LIQUIDITY_CANDIDATE
H2 OWNER_CONFIRMED_HIDDEN_LIQUIDITY
H3 HIDDEN_LIQUIDITY_UNKNOWN

H1 != H2.

## Exact execution claims

Require own-order lifecycle where applicable:
- decision timestamp;
- submit timestamp;
- ack timestamp;
- order id / queue semantics;
- fill receipt.

Hypothetical touch is not fill.

## Timing

Any queue/hidden-liquidity/fill state known after predictorFreezeAt is post-treatment for the baseline structural predictor.

## Comparison ladder

E0 RAW_ZONE_REJECTION
E1 DL054_DEPTH_PERSISTENCE_CONTROLLED
E2 QUEUE_PRIORITY_CONTEXT_CONTROLLED
E3 LATENCY_CONTEXT_CONTROLLED
E4 HIDDEN_LIQUIDITY_CONTEXT_CONTROLLED
E5 GENERIC_EXECUTION_ADVANTAGE_CONTROLLED
E6 OWN_ORDER_LIFECYCLE_CONFIRMED
E7 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE
E8 MULTI_DATE_MULTI_TICK_TIER_REPLICATION

## Anti-double-count

Zone, queue, latency, hidden-liquidity and fill receipts remain one causal parent.

effectiveIndependentEvidenceCount = 1 by default.

## Promotion boundary

No queue/fill/hidden-liquidity context is a stock-selection vote by default.
No ranking/gating/Top6/weight/capital/runtime change is authorized.
Formal Core remains LOCKED.
