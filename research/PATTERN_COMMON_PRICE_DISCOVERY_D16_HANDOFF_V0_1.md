# D01 DL-060 — D16 Common Price-Discovery Residual Handoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes attribution semantics.
D16 owns inference.

Question:
Does structural-zone response remain after market/sector/leader/futures-ETF/common-price-discovery controls?

## Owner boundaries

Consume:
- D03 canonical lead-lag clock/placebo semantics;
- D07 verified supply-chain relations;
- breadth/rotation sector leadership states;
- D05 event-clock / cross-impact context;
- D18 regime context.

Do not rebuild them in D01.

## Hard clock

leaderKnownAt <= followerPredictorFreeze < followerEndpointStart.

Same-bar association is contemporaneous, not predictive.

## Required ladder

L0 raw zone response
L1 own impact controlled
L2 initiating information controlled
L3 external flow controlled
L4 market prior move controlled
L5 sector/breadth controlled
L6 verified leader prior move controlled
L7 futures/ETF price discovery controlled
L8 nonsynchronous trading controlled
L9 generic common-discovery comparator controlled
L10 structural residual candidate
L11 multi-date/multi-symbol/multi-relation

## Independence

Different symbols are not automatically independent information.

Price-derived leader and follower states may share common PRICE_OHLC ancestry/common shocks.

## Promotion boundary

No Formal scoring/ranking/gating/capital/runtime change.

Formal Core remains LOCKED.
