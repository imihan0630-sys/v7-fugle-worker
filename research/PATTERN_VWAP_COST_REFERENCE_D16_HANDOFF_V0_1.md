# D01 DL-047 — D16 VWAP / Cost-Reference / Liquidity Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes reference-object identity and causal clocks.

D16 owns future common-support / residual inference.

The central task is to avoid treating numerically similar reference prices as the same mechanism.

## 2. Separate objects

Preserve:
- SESSION_AVERAGE_PRICE_REFERENCE;
- EVENT_ANCHORED_VOLUME_WEIGHTED_REFERENCE;
- AGGREGATE_COST_REFERENCE_PROXY;
- LIVE_ORDER_BOOK_LIQUIDITY.

Never substitute one for another.

## 3. Owner boundaries

- D02: session average / VWAP-style price-volume acceptance.
- D20: behavioral cost/reference proxies.
- D05: live spread/depth/queue/liquidity.

D01 only measures geometry / coincidence with the structural boundary.

## 4. Anchored-reference family

All anchor classes must be frozen before outcomes.

Report:
- anchor family size;
- post-hoc anchors;
- no-reference cases;
- data-blocked cases;
- anchor-source distribution.

No best-anchor result without familywise accounting.

## 5. Cost-reference caution

Turnover-weighted or other aggregate cost references are proxies.

Do not call them actual:
- investor cost basis;
- institutional cost;
- trapped-holder inventory.

If D20 long-side cost reference is unavailable:
keep UNKNOWN.

## 6. Live-liquidity caution

VWAP / AVWAP / cost proxies are historical/reference-price objects.

Current depth/spread is contemporaneous D05 state.

A structural/reference coincidence does not establish current liquidity support.

## 7. Future ladder

A0 RAW_STRUCTURAL
A1 SESSION_REFERENCE_CONTROLLED
A2 ANCHORED_REFERENCE_CONTROLLED
A3 COST_REFERENCE_CONTROLLED
A4 VOLUME_PROFILE_CONTROLLED
A5 LIVE_LIQUIDITY_CONTROLLED
A6 MULTI_REFERENCE_DEDUP
A7 STRUCTURAL_RESIDUAL_REPLICATION

Report common support and coverage at every step.

## 8. Anti-double-count

A single zone can coincide with multiple reference objects.

rawRepresentationCount may be high.

Default effectiveIndependentEvidenceCount = 1.

Even an out-of-family D20/D05 primitive is a context input, not an automatic extra selection vote.

## 9. SDA-002

No tested bar may create its own AVWAP anchor.
No future pivot anchor.
No late source fetch.
No later cost estimate relabeled as prior knowledge.

## 10. Promotion boundary

No reference object changes Formal score/rank/Top6/capital/runtime.

Formal Core remains LOCKED.
