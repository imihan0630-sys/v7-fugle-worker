# D01 DL-086 — Remaining L2 to L3 PIT-Feasibility Promotion Audit V0.1

Updated: 2026-10-07 Asia/Taipei
Status: GOVERNANCE_AUDIT / RESEARCH_ONLY / FORMAL_CORE_LOCKED

## Purpose

Audit whether the four remaining D01 L2 modules now satisfy the tracker definition of L3: Taiwan point-in-time data feasibility.

This is not an alpha promotion. L3 means the research object can be reconstructed replay-safely from Taiwan-market point-in-time inputs under explicit contamination and hindsight guards.

## D01-02 — Single-candle patterns

Evidence:
- normalized OHLC morphology contract;
- session/bar-close first-observable semantics;
- zero-trade, tick, price-limit, corporate-action and suspension controls;
- name aliases deduped to PRICE_OHLC;
- raw-geometry comparator frozen;
- 8 deterministic adversarial tests PASS under V8-equivalent execution.

Decision:
L3 PIT FEASIBLE.

Remaining beyond L3:
historical/OOS incremental value versus raw geometry; costs/execution; Formal use.

## D01-03 — Multi-candle combinations

Evidence:
- explicit sourceBarIds sequence grammar;
- overlapping-window dedup;
- firstObservableAt equals final required bar availability, not pattern start;
- failed/unresolved sequences retained;
- raw N-bar geometry comparator;
- 8 deterministic adversarial tests PASS.

Decision:
L3 PIT FEASIBLE.

Remaining beyond L3:
Taiwan historical/OOS named-sequence incrementality; multiplicity-adjusted validation.

## D01-07 — Cup / rounded base / bottom base

Evidence:
- online lifecycle from candidate through failure/expiry;
- no retrospective backpainting;
- preregistered parameter-family requirement;
- failed/expired denominator;
- generic trend/range-compression/breakout controls;
- 8 deterministic adversarial tests PASS.

Decision:
L3 PIT FEASIBLE.

Remaining beyond L3:
historical/OOS base-pattern residual value and parameter stability.

## D01-09 — Gap and price-limit constrained patterns

Evidence:
- Taiwan-specific gap taxonomy;
- price-limit delayed-discovery state;
- corporate-action/suspension/liquidity-gap routing;
- complete gap-fill denominator;
- fill definition preregistration;
- official Taiwan market-structure evidence;
- 8 deterministic adversarial tests PASS.

Decision:
L3 PIT FEASIBLE.

Remaining beyond L3:
Taiwan historical/OOS gap residual value after market/sector/event controls.

## Cross-module audit

All four modules now satisfy:
1. mechanism + falsifier definition;
2. predictor-time feature receipt;
3. firstObservableAt/predictorFreezeAt semantics;
4. no-lookahead lifecycle;
5. deterministic executable contract;
6. Taiwan continuity/trading-mechanism routing;
7. raw-price/redundancy controls;
8. explicit evidence still required for L4/L5.

## Promotion recommendation

D01-02: L2 / 40 -> L3 / 60
D01-03: L2 / 40 -> L3 / 60
D01-07: L2 / 40 -> L3 / 60
D01-09: L2 / 40 -> L3 / 60

D01 weighted maturity:
before = 52.7%
after = 60.0%

This promotion reflects PIT feasibility only.
It does not assert alpha, OOS, Shadow or Formal readiness.

SDA-001 and SDA-002 remain OPEN.
Formal Core remains LOCKED.
