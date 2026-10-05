# D01 DL-044 — D16 Prior-Close / Auction-Reference Incrementality Handoff V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes reference-price semantics.

D16 owns future economic incrementality.

The central question is:

> Does a frozen structural boundary add information beyond simple proximity to prior close, official auction reference and ordinary overnight-gap reversal mechanics?

## 2. Required reference objects

Preserve separately:
- PRIOR_CLOSE_REFERENCE;
- AUCTION_REFERENCE_PRICE;
- STRUCTURAL_BOUNDARY.

Do not collapse prior close and auction reference even when numerically equal.

## 3. Special-session provenance

Special-session auction reference must come from official / owner-certified provenance.

Do not reconstruct it from raw prior close.

If unavailable:
REFERENCE_CONTEXT_UNKNOWN / DATA_BLOCKED.

## 4. Behavioral boundary

Reference-price proximity is observable.

Anchoring psychology is not identified from OHLC alone.

D20 owns behavior-specific observables.

## 5. Future comparison ladder

P0 RAW_STRUCTURAL_RESPONSE
P1 PRIOR_CLOSE_CONTEXT_CONTROLLED
P2 AUCTION_REFERENCE_CONTEXT_CONTROLLED
P3 OVERNIGHT_GAP_CONTEXT_CONTROLLED
P4 MARKET_SECTOR_GAP_CONTROLLED
P5 REFERENCE_DISTINCT_STRUCTURE_ONLY
P6 REFERENCE_ROBUST_PATTERN_REPLICATION

Interpretation:
- disappears after P1 -> prior-close explanation;
- disappears after P2 -> auction-reference mechanics;
- disappears after P3 -> overnight reversal/gap-fill mechanism;
- disappears after P4 -> common-gap normalization;
- survives P5/P6 -> stronger structural residual candidate.

## 6. Predictor clocks

Gap fill / same-day reversal is post-open information.

Do not use it in pre-open or at-open predictor adjustment.

## 7. Common support

Require overlap in:
- overnight gap;
- reference distance;
- opening mechanism;
- volatility/liquidity;
- price limits;
- event context;
- market/sector gap;
- beta/regime.

## 8. Information lineage

Prior close / auction reference / structural zone remain tightly linked price-system objects.

No extra independent confirmation is created by reference coincidence.

## 9. Promotion boundary

No reference-price descriptor changes Formal eligibility, ranking, Top6, weights, capital or execution.

Formal Core remains LOCKED.
