# D01 DL-052 — D16 Post-Shock Snapback / Persistence Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes post-shock clocks, reference objects and structural-state semantics.

D16 owns familywise / dependence-aware economic inference.

The core distinction is:

immediate reversal after a shock != persistent structural rejection.

## Required clocks

T0 SHOCK_ANCHOR

T1 IMMEDIATE_REPAIR_WINDOW

T2 STRUCTURAL_TEST_WINDOW

T3 PERSISTENCE_FOLLOWUP

All T1/T2/T3 states are future relative to an earlier parent.

## Required reference objects

R0 PRE_SHOCK_REFERENCE

R1 SHOCK_OBSERVED_PRICE

R2 FROZEN_STRUCTURAL_ZONE

Return toward R0 is not the same estimand as rejection at R2.

## Horizon family

All persistence horizons belong to one preregistered family.

Report every frozen horizon.

No best-horizon selection, deletion or rescue after outcomes.

## Required future ladder

S0 RAW_IMMEDIATE_REVERSAL
S1 MICROSTRUCTURE_REFERENCE_CONTROLLED
S2 SHOCK_MECHANISM_CONTROLLED
S3 VOL_LIQUIDITY_CONTEXT_CONTROLLED
S4 FIRST_ZONE_TEST_SEPARATED
S5 PERSISTENCE_HORIZON_FAMILY
S6 REPEATED_SHOCK_EXCLUDED_OR_STRATIFIED
S7 PERSISTENT_REJECTION_RESIDUAL_CANDIDATE
S8 MULTI_DATE_MULTI_REGIME_REPLICATION

## Main falsifiers

Q0 temporary-impact snapback.
Q1 price-discovery completion.
Q2 microstructure bounce.
Q3 shock-mechanism explanation.
Q4 transient zone rejection only.
Q5 repeated-shock sensitivity.
Q6 persistent structural-rejection residual.
Q7 horizon sensitivity.
Q8 not evaluable.

## Microstructure reference

Where valid:
midquote / owner efficient-price proxy is preferred for persistence interpretation.

Transaction-price reversal without midquote control is insufficient because bid-ask / discreteness can generate apparent snapback.

## Repeated shocks

A second shock between the original impulse and persistence horizon breaks a naive single-shock interpretation.

Retain and stratify/censor under preregistered rules rather than silently dropping inconvenient cases.

## Information lineage

Most T1/T2/T3 price-path descriptors share PRICE_OHLC ancestry.

Default effectiveIndependentEvidenceCount=1.

Direct microstructure primitives require D16 residual validation before any independent contribution claim.

## Promotion boundary

No post-shock state changes Formal eligibility, ranking, Top6, weights, capital, execution or runtime.

Formal Core remains LOCKED.
