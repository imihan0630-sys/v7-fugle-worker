# D01 DL-051 — D16 Volatility / Liquidity Churn Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes zone-local churn semantics and timing classes.
D16 owns future residual/common-support inference.

The core question is whether apparent structural-zone churn remains informative after accounting for volatility/liquidity state without confusing baseline context with contemporaneous mechanism.

## Timing split

PRE_EPISODE_CONTEXT:
available before the churn episode.

WITHIN_EPISODE_CONTEXT:
observed during the episode and potentially downstream of the structural interaction.

Do not automatically treat within-episode volatility/spread/depth as baseline confounders.

## Required nested comparison

C0:
structural geometry + DL-050 transition mechanism.

C1:
C0 + DL-049 churn/path.

C2:
C1 + PRE_EPISODE volatility/liquidity/session context.

C3:
C2 + WITHIN_EPISODE volatility/spread/depth context.

C4:
C3 + exact trade-vs-midpoint / quote reconstruction where available.

## Interpretation

R0_CHURN_REDUNDANT:
C1 adds no residual representation.

R1_CHURN_PRECONTEXT_INCREMENT:
C1 remains after C2.

R2_MICROSTRUCTURE_MEDIATED:
increment weakens materially after C3.

R3_QUOTE_MICROSTRUCTURE_EXPLANATION:
trade-price churn disappears after midpoint/quote controls.

R4_CONTEXT_SPECIFIC:
effect survives only in preregistered volatility/liquidity strata.

R5_NOT_EVALUABLE:
common support / quote freshness / PIT provenance inadequate.

## Required context

Report:
- raw churn/path;
- realized/normalized volatility;
- owner burst state;
- quoted/effective spread;
- depth;
- quote freshness;
- session position;
- DL-050 mechanism class;
- zone-width normalization;
- price/tick regime.

## Taiwan market-quality warning

TWSE research shows:
- spread and intraday volatility can rise while depth falls after market-design changes;
- transitory volatility, spread, depth and trading time influence order choices;
- spread/volatility and depth have strong intraday patterns.

Therefore session and market-quality context must not be omitted.

## Owner boundary

D04/D05:
volatility, spread, depth, quote quality and microstructure state.

D03:
pathEfficiency10 / trend-quality controls.

D01:
zone-local structural path relation.

## De-duplication

PRICE_OHLC churn plus quote/book context does not automatically create multiple alpha votes.

Default effectiveIndependentEvidenceCount = 1.
Residual incrementality remains NOT_VALIDATED.

## Promotion boundary

No churn/volatility/liquidity descriptor changes Formal ranking, A/B, Top6, weights, capital or runtime by default.

Formal Core remains LOCKED.
