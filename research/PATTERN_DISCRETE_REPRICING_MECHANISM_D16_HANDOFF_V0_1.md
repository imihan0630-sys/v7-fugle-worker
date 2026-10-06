# D01 DL-050 — D16 Discrete Repricing / Microstructure Mechanism Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes zone-path mechanism labels.
D16 owns future residual/common-support inference.

The key question is whether apparent zone churn/rejection survives removal or explicit control of:
- auction clearing;
- volatility-interruption restart;
- price-limit constraints;
- event-coincident discrete repricing;
- microstructure bounce/noise.

## Required future ladder

R0 RAW_ZONE_CHURN
R1 EXCLUDE_AUCTION_AND_RESTART
R2 EXCLUDE_LIMIT_CONSTRAINED
R3 EVENT_CLOCK_CONTROLLED
R4 MICROSTRUCTURE_CONTROLLED
R5 UNCONSTRAINED_CONTINUOUS_ONLY
R6 MULTI_MECHANISM_ROBUST

Interpretations:
Q0 AUCTION_MECHANISM_EXPLANATION
Q1 LIMIT_CONSTRAINT_EXPLANATION
Q2 EVENT_COINCIDENT_EXPLANATION
Q3 MICROSTRUCTURE_NOISE_COMPATIBLE
Q4 MIXED_MECHANISM_DEPENDENCE
Q5 UNCONSTRAINED_CONTINUOUS_RESIDUAL
Q6 MULTI_MECHANISM_ROBUST_PATTERN_CANDIDATE
Q7 NOT_EVALUABLE

## Owner receipts

Consume, do not recreate:
- D04/D05 session, auction, limit, VI, halt, spread/depth/quote/trade semantics;
- D11/D17 event clock;
- D03 pathEfficiency10;
- D01 DL-043 session decomposition and DL-049 zone path/churn.

## Event caution

Event timing compatibility is not causation.
Report EVENT_COINCIDENT, not EVENT_CAUSED, unless a separate identification design exists.

## Microstructure caution

OHLC-only cases cannot identify bid-ask bounce.
Keep them separate from direct quote/trade-evaluable cases.

## Common support

Require overlap in:
- zone geometry;
- age/path state;
- volatility/liquidity/spread;
- tick/price tier;
- event state;
- session/limit/VI/halt state;
- market/sector regime;
- gap size;
- DL-049 churn;
- D03 path efficiency.

## Multiplicity

Mechanism labels are not new votes.
Default effectiveIndependentEvidenceCount = 1.

Any quote/order-book residual contribution remains NOT_VALIDATED until D16 establishes it.

## Promotion boundary

No mechanism label changes Formal eligibility, ranking, Top6, weight, capital or runtime.

Formal Core remains LOCKED.
