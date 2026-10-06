# D01 DL-052 — D16 Shock Snapback / Price-Discovery Separation Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes shock timing, structural-opportunity identity and recovery-clock semantics.

D16 owns future mechanism separation and economic inference.

The central question is whether an apparent structural rejection survives temporary-impact, liquidity-recovery and price-discovery explanations.

## Required future ladder

R0 RAW_TOUCH_RESPONSE
R1 DL050_MARKET_MECHANICS_CONTROLLED
R2 PREEXISTING_VOLATILITY_SHOCK_CONTROLLED
R3 PREEXISTING_LIQUIDITY_SHOCK_CONTROLLED
R4 PRE_SHOCK_REFERENCE_SNAPBACK_CONTROLLED
R5 LIQUIDITY_RECOVERY_VS_PRICE_RECOVERY_SEPARATED
R6 PRICE_DISCOVERY_CONTEXT_CONTROLLED
R7 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE
R8 MULTI_DATE_MULTI_REGIME_REPLICATION

## Timing

Only pre-freeze context may enter baseline conditioning.

Later:
- liquidity recovery;
- price recovery;
- price-discovery completion;
- maximum snapback

are mechanism/outcome states.

Do not backfill them.

## Temporary impact vs price discovery

A reversion toward pre-shock midquote may represent temporary-impact recovery.

Stabilization away from the pre-shock reference after information arrival may represent permanent price discovery.

Neither interpretation is available from a touch-and-bounce candle alone.

## Price reference

Prefer owner-certified pre-shock midquote where valid.

Transaction-price proxy retains noise-separation warning because bid-ask/discreteness can contaminate apparent snapback.

## Recovery clocks

Liquidity recovery and price recovery are distinct processes.

Report both clocks separately.
Do not define one generic recoveredAt.

## Horizon governance

No universal recovery horizon is frozen by D01.

D16 must preregister horizon families or consume canonical owner recovery events before opening outcomes.

## Owner boundaries

D04: volatility shock/burst.
D05: spread/depth/freshness, resiliency and microstructure noise.
D11: event identity/timing.
D01: zone relation and structural-opportunity semantics.

## Promotion boundary

No DL-052 state changes Formal eligibility, ranking, Top6, weights, capital or runtime.

Formal Core remains LOCKED.
