# D01 DL-044 — Structural Boundary vs Prior-Close / Auction-Reference Price Anchors V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / REFERENCE_PRICE_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-043 separated overnight gaps, opening call auction and later continuous trading.

DL-044 adds a reference-price confound:

> Apparent support/resistance around the open can be mechanically close to the previous close or the legal opening-auction reference price. A return toward those reference prices can look like structural memory even when it is better explained by overnight reversal, gap fill or exchange reference mechanics.

The research must therefore distinguish:
- PRIOR_CLOSE_REFERENCE;
- AUCTION_REFERENCE_PRICE;
- FROZEN_STRUCTURAL_BOUNDARY.

They are not interchangeable.

No economic outcome is opened in this tranche.

## 2. Official Taiwan reference-price boundary

TWSE / TPEx daily price-limit mechanics are tied to an official session reference price.

For ordinary sessions this may align closely with the prior close, but special sessions can use different reference semantics.

Therefore:
priorClose is not a universal substitute for auctionReferencePrice.

Required fields:
- auctionReferencePrice;
- auctionReferenceSource;
- auctionReferenceRuleVersion;
- auctionReferenceKnownAt;
- specialReferenceState;
- upperLimit / lowerLimit where relevant.

Missing official reference provenance remains UNKNOWN.

## 3. Three price objects

### R0 — PRIOR_CLOSE_REFERENCE

The previous eligible session's closing price under verified continuity semantics.

### R1 — AUCTION_REFERENCE_PRICE

The official legal opening-auction reference used by the exchange for the session.

This is a market-mechanics object.

### R2 — STRUCTURAL_BOUNDARY

The pre-existing D01 frozen structural zone / boundary.

This is a technical-geometry object.

R0, R1 and R2 may coincide numerically.
Numerical coincidence does not make them the same causal object.

## 4. Behavioral caution

A prior close can function as a salient public reference price.

However chart data alone do not identify investor anchoring psychology.

Therefore D01 may use:
REFERENCE_PRICE_PROXIMITY / REFERENCE_PRICE_COINCIDENCE.

D01 may not infer:
- anchoring bias;
- trapped investors;
- breakeven motive;
- psychological magnet

from OHLC alone.

D20 owns behavioral-mechanism identification.

## 5. Structural-reference coincidence descriptors

For structural zone [lower, upper] and reference price P:

REFERENCE_INSIDE_ZONE =
lower <= P <= upper.

REFERENCE_DISTANCE_PRICE =
distance from P to the nearest zone edge, zero when inside.

REFERENCE_DISTANCE_ATR =
distance / current or frozen preregistered ATR receipt.

REFERENCE_DISTANCE_TICKS =
distance / legal tick size when owner receipt is valid.

Store separately for:
- priorClose;
- auctionReferencePrice.

No arbitrary "near" threshold is frozen.

## 6. Frozen coincidence states

### A0 — STRUCTURE_DISTINCT_FROM_REFERENCES

Neither prior close nor auction reference is inside the frozen zone.

### A1 — PRIOR_CLOSE_INSIDE_STRUCTURE

Prior close is inside the zone, auction reference is not.

### A2 — AUCTION_REFERENCE_INSIDE_STRUCTURE

Auction reference is inside the zone, prior close is not.

### A3 — BOTH_REFERENCES_INSIDE_STRUCTURE

Both are inside the zone.

### A4 — REFERENCE_CONTEXT_UNKNOWN

One or more required reference prices / continuity receipts are missing.

These are descriptive context states, not alpha labels.

## 7. Corporate-action / special-reference firewall

On ex-right, ex-dividend, split, capital reduction or other special sessions:

- raw prior close may not be comparable to current technical-continuity prices;
- auctionReferencePrice can be mechanically adjusted;
- daily legal limits can be based on the adjusted reference.

Therefore:
- do not calculate auctionReferencePrice from priorClose;
- do not call a mechanical reference reset an overnight reversal;
- do not call a raw discontinuity a structural break;
- use owner-certified TECHNICAL_CONTINUITY plus official session reference receipts.

If provenance is incomplete:
REFERENCE_CONTEXT_UNKNOWN / DATA_BLOCKED.

## 8. Overnight reversal is an outcome family, not a predictor assumption

A high open that later moves back toward prior close may be:
- overnight reversal;
- gap fill;
- market/sector gap normalization;
- event reaction normalization;
- structural resistance/support interaction;
- several mechanisms jointly.

D01 does not assume:
open gap -> prior close fill.

Future gap-fill / reversal measurements are outcomes or post-open path states.

They may not be injected into a pre-open or at-open predictor.

## 9. Structural root overlapping prior close

A structural root can legitimately exist around the prior close.

The correct interpretation is not to discard it.

Instead future D16 inference must ask:

Does the structural root add representation beyond a simple prior-close reference baseline?

This is an incrementality question.

## 10. Structural root overlapping auction reference

Likewise, a structural root may coincide with the legal session reference.

A bounce/reversal near that price may reflect:
- structural memory;
- auction / price-limit mechanics;
- round / salient reference effects;
- opening normalization.

Future inference must control official session-reference context before a structural claim.

## 11. Reference price does not create extra vote

priorClose, auctionReferencePrice and structural boundary are all derived from or tightly linked to the same price system.

Unless a direct independent primitive is introduced by another owner:

informationRoot = PRICE_OHLC / MARKET_MECHANICS_CONTEXT.

A reference coincidence is a context/control.
It is not an extra bullish/bearish confirmation.

effectiveIndependentEvidenceCount does not increase.

## 12. Pre-open / at-open clock

### PRE_OPEN

Known:
- prior close if verified;
- official auction reference if published / available;
- frozen structural boundary;
- scheduled event context where known.

Unknown:
- current open;
- later gap fill / reversal;
- later intraday path.

### AT_OPEN

Known:
- current open;
- overnight gap;
- opening-auction relationship to references / structure.

Still future:
- immediate-post-open path;
- gap fill;
- close.

No later reversal may backfill earlier predictor state.

## 13. Prior close vs auction reference can differ

The research manifest must preserve both even if equal on ordinary sessions.

If different:
- priorCloseDistanceToStructure;
- auctionReferenceDistanceToStructure;
- openDistanceFromPriorClose;
- openDistanceFromAuctionReference

must remain distinct.

Do not silently collapse them.

## 14. Market / sector reference controls

DL-043 / Event Risk already motivate relative gap decomposition.

Future inference should distinguish:
- stock gap relative to prior close;
- market gap;
- sector gap;
- residual stock gap.

A return toward prior close may simply reflect common-gap reversal.

D01 consumes D09/D18/D19/D13 owner context where available.

## 15. Future D16 comparison ladder

P0 RAW_STRUCTURAL_RESPONSE

P1 PRIOR_CLOSE_CONTEXT_CONTROLLED

P2 AUCTION_REFERENCE_CONTEXT_CONTROLLED

P3 OVERNIGHT_GAP_CONTEXT_CONTROLLED

P4 MARKET_SECTOR_GAP_CONTROLLED

P5 REFERENCE_DISTINCT_STRUCTURE_ONLY

P6 REFERENCE_ROBUST_PATTERN_REPLICATION

Future interpretation:

C0 PRIOR_CLOSE_REFERENCE_EXPLANATION

C1 AUCTION_REFERENCE_MECHANICS_EXPLANATION

C2 OVERNIGHT_REVERSAL_EXPLANATION

C3 COMMON_GAP_NORMALIZATION_EXPLANATION

C4 STRUCTURAL_RESIDUAL_AROUND_REFERENCE

C5 STRUCTURE_DISTINCT_FROM_REFERENCE_CANDIDATE

C6 REFERENCE_ROBUST_PATTERN_CANDIDATE

C7 NOT_EVALUABLE

None proves alpha.

## 16. Common support

Future comparison requires overlap in:
- overnight gap size / direction;
- reference-distance descriptors;
- opening-auction mechanism;
- volatility;
- liquidity;
- relative tick;
- price-limit state;
- event state;
- market/sector gap;
- beta/regime;
- structural age / path.

Failure:
REFERENCE_CONTEXT_EXTRAPOLATION_PROHIBITED.

## 17. No outcome-selected reference

Prohibited:
- choose prior close because the reversal touched it;
- choose auction reference because it looks better;
- choose previous high/low after seeing the path;
- add VWAP / round number / moving average only after outcome inspection.

Any enlarged reference family must be preregistered as a multiple-testing family.

DL-044 v0.1 freezes only prior close + official auction reference.

## 18. Required manifest fields

Per parent / opportunity:
- parentDecisionId;
- symbol;
- semanticSpace;
- predictorFreezeAt;
- structuralRootId;
- structuralVersionId;
- frozenBoundaryLower;
- frozenBoundaryUpper;
- priorClose;
- priorCloseKnownAt;
- priorCloseContinuityVerified;
- auctionReferencePrice;
- auctionReferenceKnownAt;
- auctionReferenceSource;
- auctionReferenceRuleVersion;
- specialReferenceState;
- upperLimit;
- lowerLimit;
- tickSize;
- atrReceipt;
- priorCloseInsideStructure;
- auctionReferenceInsideStructure;
- priorCloseDistancePrice;
- priorCloseDistanceAtr;
- priorCloseDistanceTicks;
- auctionReferenceDistancePrice;
- auctionReferenceDistanceAtr;
- auctionReferenceDistanceTicks;
- currentOpen if known;
- openDistanceFromPriorClose;
- openDistanceFromAuctionReference;
- coincidenceState;
- overnightGapReceipt;
- sessionMechanismReceipt;
- eventReceipt;
- marketSectorGapReceipt;
- informationRoot;
- effectiveIndependentEvidenceCount;
- manifestVersion/hash.

No future gap-fill / reversal outcome belongs in predictor state.

## 19. Current decision

PRIOR_CLOSE_EQUALS_AUCTION_REFERENCE_ALWAYS =
FALSE.

REFERENCE_PRICE_EQUALS_STRUCTURAL_BOUNDARY =
FALSE.

REFERENCE_COINCIDENCE_EQUALS_PATTERN_CONFIRMATION =
FALSE.

GAP_FILL_IS_PREOPEN_PREDICTOR =
FALSE.

BEHAVIORAL_ANCHORING_FROM_OHLC =
PROHIBITED.

AUCTION_REFERENCE_FROM_PRIOR_CLOSE_FALLBACK =
PROHIBITED_ON_UNVERIFIED_OR_SPECIAL_SESSIONS.

REFERENCE_CONTEXT_CREATES_EXTRA_VOTE =
FALSE.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 20. Exact next continuation

1. Build deterministic reference-distance / coincidence / predictor-clock helper and adversarial tests.
2. Preserve prior close and official auction reference as distinct fields even when numerically equal.
3. Preserve corporate-action / special-reference UNKNOWN and DATA_BLOCKED states.
4. Hand P0-P6 / C0-C7 reference-context incrementality inference to D16.
5. Keep behavioral anchoring UNIDENTIFIED unless D20 supplies behavior-specific observables.
6. Next D01 science: separate prior-close/reference effects from round-number / tick-grid salience so apparent support near 100 / 200 / 500 is not mislabeled as structural memory.
7. No outcome join / no runtime wiring / no Formal change.
