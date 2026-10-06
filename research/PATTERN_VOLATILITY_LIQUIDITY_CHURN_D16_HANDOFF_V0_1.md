# D01 DL-051 — D16 Volatility/Liquidity Churn Confound Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes causal timing and zone-churn exposure semantics.
D16 owns residual/common-support inference.

The key question is whether apparent structural-zone churn survives:
- volatility level;
- volatility clustering;
- crossing-opportunity normalization;
- same-window realized-volatility burst;
- spread/depth/freshness deterioration;
- DL-050 market-mechanism controls.

## Required causal timing

PRE_WINDOW_CONTEXT may enter baseline conditioning.

WITHIN_WINDOW_MECHANISM is contemporaneous/mediating for a decision frozen before window completion.

Do not backfill:
- realized RV burst;
- spread widening;
- depth thinning;
- freshness deterioration

into an earlier predictor state.

## Required ladder

V0 RAW_ZONE_CHURN
V1 PRE_WINDOW_VOL_LEVEL_CONTROLLED
V2 PRE_WINDOW_VOL_CLUSTER_CONTROLLED
V3 OPPORTUNITY_NORMALIZED
V4 WITHIN_WINDOW_RV_BURST_STRATIFIED
V5 SPREAD_DEPTH_FRESHNESS_CONTROLLED
V6 DL050_MECHANISM_CONTROLLED
V7 RESIDUAL_ZONE_CHURN_CANDIDATE
V8 MULTI_DATE_MULTI_REGIME_REPLICATION

## Core falsifiers

Q0 volatility-level explanation.
Q1 volatility-cluster explanation.
Q2 crossing-opportunity explanation.
Q3 realized-burst explanation.
Q4 liquidity-deterioration explanation.
Q5 missingness sensitivity.
Q6 market-mechanism sensitivity.
Q7 residual structural churn.
Q8 not evaluable.

## Midquote / transaction RV

Where two-sided quote data are valid:
- midquote local volatility is primary;
- transaction RV is a noise diagnostic.

Transaction RV alone cannot identify efficient-price volatility versus bid-ask/discreteness noise.

## Missingness

Stale/reconnect/missing quote-book windows remain in the denominator and may be stress-endogenous.

Do not convert:
missing book -> zero depth;
stale quote -> stable spread.

## Opportunity normalization

Use the existing causal crossing-opportunity receipt.

Raw transition/side-flip counts may be compared only with exposure denominators preserved.

A zero/unknown denominator is UNKNOWN, not zero churn.

## Owner boundaries

D04 owns volatility.
D05 owns spread/depth/freshness.
D03 owns pathEfficiency10.
D01 owns zone-local structural relation.

No duplicated volatility/liquidity factor is authorized.

## Multiplicity

Most price volatility/churn descriptors share PRICE_OHLC ancestry.

Spread/depth may provide distinct owner primitives but do not become independent alpha votes automatically.

Default effectiveIndependentEvidenceCount=1 until D16 residual evidence.

## Promotion boundary

No DL-051 context changes Formal eligibility, ranking, Top6, weights, capital, runtime or trading behavior.

Formal Core remains LOCKED.
