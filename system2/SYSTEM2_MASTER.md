# System 2 — 台股多策略智慧選股平台

Updated: 2026-09-26 Asia/Taipei
Status: BOOTSTRAP / DESIGN_AND_RESEARCH
System ID: SYSTEM2
Production trading: NOT ENABLED

## Mission

Build a separate multi-strategy Taiwan-equity selection and monitoring platform that independently performs stock selection, entry/exit planning, intraday monitoring, notifications, simulated position management and performance learning, while preserving independent risk controls and measurable strategy performance.

System 2 is not a loosened copy of V8.

## Core design

Market environment -> strategy activation -> factor engines -> independent candidate ranking -> strategy-specific entry/exit plan -> intraday monitoring/notification -> simulated execution/position state -> performance attribution -> validated strategy versioning.

## Required dimensions

- market/index regime;
- global/macroeconomic transmission;
- industry cycle and future growth;
- fundamentals;
- valuation;
- technical structure;
- price-volume relationships;
- institutions/chips/ownership concentration;
- capital flow;
- news/events/catalysts and event half-life;
- supply/demand/capacity/inventory;
- strategy-specific weighting and minimum floors;
- multi-factor confluence;
- daily frozen decision records;
- independent simulated portfolios and performance comparison.

## Initial strategy families

1. SHORT_MOMENTUM
2. SWING_GROWTH
3. INSTITUTIONAL_ACCUMULATION
4. BLACK_HORSE_ACCUMULATION
5. INDUSTRY_TREND
6. FUNDAMENTAL_GROWTH
7. EVENT_DRIVEN
8. VALUE_REVERSION (research lane; not assumed useful until validated)

Weights are not authoritative yet. Initial weights are hypotheses and must be validated.

## Decision authority

System 2 is self-contained. It does not ask System 1 whether a stock may be selected or whether an entry/exit may trigger.

System 1/V8 may be used only as:
- a source of reusable validated market knowledge;
- a source-contract/data-experience reference;
- an independent comparison benchmark.

V8 A/B, Top6/3+3, capital rules and live-state machine are never prerequisites for System 2 decisions.

## Capacity rules

- Global System 2 candidate/watch pool: max 12 unique symbols.
- Per strategy ACTIVE_INTRADAY_MONITOR: max 3 symbols.
- No forced filling.
- One symbol may belong to multiple strategies; it counts once in the global candidate pool but remains separately tracked per strategy for monitoring and performance.

## Non-goals

- Do not alter V8 Formal Core during System 2 bootstrap.
- Do not force a fixed number of stocks.
- Do not optimize to a promised monthly profit target.
- Do not use future information in historical decisions.
- Do not hide zero-pick, low-utilization, or losing periods.

## Canonical files

- `system2/SYSTEM2_ARCHITECTURE.md`
- `system2/SYSTEM2_FACTOR_LIBRARY.md`
- `system2/SYSTEM2_STRATEGY_LIBRARY.md`
- `system2/SYSTEM2_PERFORMANCE_SPEC.md`
- `system2/SYSTEM2_BRIDGE_FROM_V8.md`
- `system2/SYSTEM2_CHECKPOINT.md`
- `system2/SYSTEM2_DATA_SOURCE_MATRIX.md`
- `system2/SYSTEM2_STORAGE_SCHEMA.md`
- `system2/SYSTEM2_STRATEGY_PREREGISTRY.md`
- `system2/SYSTEM2_EXECUTION_SIMULATOR_SPEC.md`
- `system2/SYSTEM2_MARKET_REGIME_V0.md`
- `system2/SYSTEM2_FACTOR_ENGINE_CONTRACT.md`
- `system2/SYSTEM2_SOURCE_CONTRACT_AUDIT.md`
- `shared-knowledge/SHARED_RESEARCH_MASTER_MAP.md`
- `system2/SYSTEM2_P1_IMPLEMENTATION_VERIFICATION.md`

## Phase plan

P0 Bootstrap shared knowledge/network and project governance.
P1 Data-source inventory and PIT feasibility.
P2 Factor engine contracts.
P3 Strategy definitions and Shadow scoring.
P4 Frozen daily signal archive and simulated execution.
P5 Performance dashboard/attribution.
P6 OOS/forward validation and strategy-version promotion gates.
P7 Optional integration with V8 execution/monitoring through explicit interfaces only.

## Success metrics

Evaluate opportunity quality and capital utilization using:
- candidate count and trigger rate;
- return distribution;
- win rate;
- average win/loss;
- expectancy;
- profit factor;
- MFE/MAE;
- max drawdown;
- holding period;
- capital utilization;
- turnover/cost/slippage;
- regime robustness;
- strategy correlation/diversification;
- version-to-version improvement.

Monthly profit can be observed but is not a guaranteed or optimization-only target.
