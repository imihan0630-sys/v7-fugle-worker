# D16 Strategy-Stage Clock Dependency Audit V0.1

Updated: 2026-10-02 Asia/Taipei
Status: RESEARCH-ONLY / CONTRACT-INCONSISTENCY IDENTIFIED / NO RUNTIME CHANGE
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Audit whether one global after-close Decision Clock is semantically aligned with the strategy contracts that actually consume evidence.

The key question is not:
"Can we make one clock earlier?"

It is:
"Which evidence must be known for which strategy stage before that stage may proceed?"

System 2 already separates:
- Strategy Validity（策略有效性）;
- Entry Readiness（進場準備度）.

Therefore a single all-source clock may be over-constrained if it waits for evidence that a given strategy/stage does not require.

No runtime change is authorized by this audit.

## 1. Current global Decision Clock contract

Current daily evidence requires:

Same-session candidate layer:
- A1_TWSE_DAILY_CLOSE;
- A1_TPEX_DAILY_CLOSE;
- B2_INDUSTRY_THESIS_PROSPECTIVE.

Periodic boundary layer:
- A5_QUARTERLY_FINANCIALS must be prospectively READY no later than the computed candidate timestamp.

Therefore global `requiredReady` is false unless:
1. both A1 markets are ready;
2. B2 is ready;
3. a candidate timestamp can be computed;
4. A5 was ready by that boundary.

This is a system-wide clock contract, not yet a per-strategy dependency contract.

## 2. SHORT_MOMENTUM Limited Shadow contract

Frozen Limited Shadow:
`S2-SM-LS-001 — SHORT_MOMENTUM V0.1-CONTRACT`.

Required source/evidence families for a non-INCOMPLETE evaluation:
- TECHNICAL_STRUCTURE;
- PRICE_VOLUME;
- RISK_FRICTION.

Current source mapping:
- TECHNICAL_STRUCTURE -> A1 daily OHLCV / derived history, subject to continuity guards;
- PRICE_VOLUME -> A1 daily OHLCV / derived volume/amount fields;
- RISK_FRICTION -> A1-derived liquidity/extension/reward-risk inputs plus execution semantics.

Explicitly allowed to remain UNKNOWN in the frozen Limited Shadow contract:
- TPEx/small-cap regime where unavailable;
- prospective breadth and sector-rotation gaps;
- same-slot RVOL / cumulative volume pace before clean baselines;
- advanced pattern lifecycle gaps;
- global/macro context without canonical source.

Implication:

For SHORT_MOMENTUM non-INCOMPLETE strategy evaluation:
- A5 quarterly financials are NOT a REQUIRED evidence family;
- B2 breadth/sector state is explicitly allowed to remain UNKNOWN;
- the current global Decision Clock therefore waits for evidence beyond the strategy's frozen minimum required set.

This is direct evidence of a potential slowest-source tax.

It does NOT yet prove that an earlier Short Momentum selection/action is safe, because downstream shared ranking/capacity/execution layers may introduce additional dependencies.

## 3. SWING_GROWTH Limited Shadow contract

Frozen Limited Shadow:
`S2-SG-LS-001 — SWING_GROWTH V0.1-CONTRACT`.

Required families:
- FUNDAMENTAL_QUALITY;
- INDUSTRY_THESIS.

Current mapping:
- FUNDAMENTAL_QUALITY -> A5 quarterly financials plus other PIT-safe fundamentals when used;
- INDUSTRY_THESIS -> B2/industry evidence only if the actual strategy-thesis semantics are satisfied.

Important boundary:
the current B2 prospective observer is descriptive industry breadth/participation.
It explicitly does NOT itself assign an INDUSTRY_TREND thesis direction or strategy score.

Therefore:
- "B2 source READY" is not automatically equivalent to "SWING_GROWTH industry thesis READY";
- source readiness and strategy-semantic readiness are separate layers.

A1 technical timing may later be needed for Entry Readiness even if Strategy Validity is already known.

## 4. Stage-specific evidence graph

A safer conceptual model is a stage graph, not immediately a set of independent clocks.

### Stage A — SOURCE_READY
Question:
Are required raw/derived source contracts available with valid PIT provenance?

Examples:
- A1;
- A5;
- B2 transport/observer.

### Stage B — STRATEGY_VALIDITY_READY
Question:
Can the strategy thesis be evaluated as VALID / WEAKENING / INVALIDATED / INCOMPLETE?

Uses only families frozen as REQUIRED or HARD_INVALIDATION for that strategy.

### Stage C — ENTRY_READINESS_READY
Question:
Can the strategy's timing state be evaluated as WATCH / NEAR_ENTRY / BUY_ELIGIBLE / WAIT / BLOCKED?

May require additional technical/price-volume/intraday evidence.

### Stage D — SHARED_SELECTION_READY
Question:
Can cross-strategy capacity/ranking/portfolio constraints be evaluated on a common comparable snapshot?

This may legitimately impose additional shared context.

### Stage E — EXECUTION_READY
Question:
Can an order/monitor action be evaluated under session, liquidity, price-limit and execution semantics?

A date/time may be ready for an earlier stage while later stages remain blocked.

## 5. Why "strategy-specific clock" is too coarse a phrase

A strategy can have:
- thesis evidence ready;
- entry timing not ready;
- shared ranking not ready;
- execution not ready.

Therefore replacing one global clock with one clock per strategy can still collapse distinct readiness states.

The more precise research object is:

`strategyId × stageId -> required evidence dependencies -> readiness timestamp/state`.

Do not call this a deployable clock architecture until the dependency graph is complete.

## 6. Minimum machine-readable dependency schema

Future research-only schema should include:

- strategyId;
- strategyVersion;
- stageId;
- evidenceFamily;
- role = REQUIRED / SUPPORTIVE / CONTEXT_ONLY / HARD_INVALIDATION / WARNING;
- sourceOrDerivedContractIds[];
- readinessRule;
- UNKNOWN behavior;
- PIT requirement;
- continuity requirement;
- next-session / intraday action semantics;
- dependencyVersion.

A change in REQUIRED/HARD_INVALIDATION composition requires a strategy/dependency version change.

## 7. Falsification tests for the slowest-source-tax hypothesis

The hypothesis:
"Global clock delays a strategy because of sources that strategy/stage does not require."

It is falsified or weakened if:
1. downstream shared selection always legally requires the allegedly non-required source before any actionable output;
2. the strategy contract is incomplete and actually relies on that source through an undocumented hard dependency;
3. earlier readiness would create cross-strategy snapshot inconsistency that cannot be versioned safely;
4. source omission materially changes eligibility via an indirect derived field;
5. after PIT/continuity guards, A1 itself is later than all disputed dependencies so no practical delay exists.

It is supported if:
1. a frozen strategy-stage dependency graph excludes the source;
2. all required evidence for the stage is prospectively ready earlier;
3. the stage output can be reproduced and versioned without the omitted source;
4. later source arrival changes only SUPPORTIVE/CONTEXT fields;
5. common downstream gates can consume stage-ready outputs without hidden look-ahead.

## 8. First contract inconsistency found

SHORT_MOMENTUM Limited Shadow explicitly allows breadth/sector gaps to remain UNKNOWN and does not require A5.

Global Decision Clock requires B2 and A5 boundary integrity for global `requiredReady`.

Therefore:
`GLOBAL_REQUIRED_SET != SHORT_MOMENTUM_NON_INCOMPLETE_REQUIRED_SET`.

This is a documented contract inconsistency.

It is not yet a production bug because the global clock may intentionally govern a later shared stage.

The missing object is an explicit declaration of which stage the global clock is supposed to authorize.

## 9. New required naming

Future Decision Clock documents/reports should avoid ambiguous "ready" where possible.

Prefer:
- SOURCE_READY;
- STRATEGY_VALIDITY_READY;
- ENTRY_READINESS_READY;
- SHARED_SELECTION_READY;
- EXECUTION_READY;
- GLOBAL_REVIEW_READY.

Without the stage qualifier, "Decision Clock READY" can hide dependency overreach.

## 10. Relationship to D18 Regime

Market Regime/Breadth should usually enter a strategy according to its declared evidence role.

If Regime is:
- REQUIRED: UNKNOWN can block that strategy stage;
- SUPPORTIVE: UNKNOWN cannot become zero/negative evidence;
- CONTEXT_ONLY: late arrival should not retroactively invalidate an otherwise PIT-valid earlier stage;
- HARD_INVALIDATION: source/readiness semantics must be especially strict.

D18 must not make Market Regime globally REQUIRED for every strategy merely because the Regime layer exists.

That would convert context into a universal hidden gate.

## 11. Promotion / runtime boundary

This audit authorizes NO:
- Decision Clock split;
- earlier strategy evaluation;
- Cron change;
- capture schedule change;
- ranking/capacity change;
- signal/push change;
- Formal Core change.

Before any runtime proposal:
1. complete the strategy-stage dependency graph;
2. identify the exact stage governed by today's global clock;
3. measure real timing deltas on prospective dates;
4. run fail-closed tests;
5. verify no hidden downstream dependency;
6. classify the change under engineering governance;
7. require owner review where applicable.

## Current conclusion

Status:
`CONTRACT_INCONSISTENCY_CONFIRMED / SLOWEST_SOURCE_TAX_PLAUSIBLE / RUNTIME_VALUE_UNPROVEN`.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## Exact next continuation

1. Build a research-only dependency matrix for SHORT_MOMENTUM and SWING_GROWTH across Strategy Validity / Entry Readiness / Shared Selection.
2. Resolve whether B2 descriptive observer is sufficient for any INDUSTRY_THESIS REQUIRED role; current evidence says not automatically.
3. Map A1/A5/B2 plus any execution/portfolio dependencies to exact stages.
4. On prospective dates, record first-ready time for each stage without changing actual behavior.
5. Compare global ready time versus stage-ready time only after the graph is frozen.
6. Treat any measured delta as operational evidence, not alpha.


## 12. 2026-10-03 continuation — readiness estimand firewall

Latest main/tracker readback confirms the machine-readable dependency matrix is frozen, while exact stage roles, shared-selection dependencies and execution dependencies remain unresolved.

New statistical conclusion:
- A measured difference between GLOBAL_REVIEW_READY and an earlier strategy-stage readiness timestamp is an **operational latency estimand**, not strategy alpha.
- It must not be tested by choosing the stage/dependency subset that maximizes later returns. Dependency composition must be frozen from strategy semantics before outcome inspection.
- The primary prospective comparison should be paired within the same immutable date/source epoch: global-ready timestamp minus stage-ready timestamp, with UNKNOWN retained whenever any required stage dependency lacks PIT/continuity proof.
- Report availability/coverage and latency distribution separately. A faster stage with materially lower valid-date coverage is not automatically superior.
- Any later policy experiment must use a separate preregistered OOS/Shadow layer with identical strategy logic/cost assumptions; timing evidence alone cannot authorize activation, ranking, capital, execution or notification changes.

Falsification strengthened:
1. If A1/technical continuity remains the slowest required dependency, the apparent global over-constraint has no practical timing benefit.
2. If shared selection or execution legally requires B2/A5, an earlier Strategy Validity timestamp does not imply earlier actionable readiness.
3. If missing stage-ready timestamps cluster by market regime, complete-case timing estimates are selected and must not be promoted.
4. If dependency definitions change, begin a new evidence epoch rather than recomputing prior prospective dates.

This creates a clean separation among three questions:
- semantic dependency correctness;
- operational readiness latency;
- economic strategy value.

Only the first two are currently researchable from the frozen evidence. Economic value remains untested.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

### Exact next continuation
1. Resolve exact stageRole for SHORT_MOMENTUM TECHNICAL_STRUCTURE / PRICE_VOLUME / RISK_FRICTION and SWING_GROWTH entry timing from frozen strategy contracts.
2. Freeze shared-selection and execution dependencies; unresolved dependencies remain UNKNOWN.
3. Add prospective paired stage-ready/global-ready timestamps only after dependencyVersion is frozen; stratify by source/evidence epoch and preserve failed dates.
4. Audit missing stage-ready timestamps for regime dependence before any latency summary is treated as representative.
5. Keep policy/OOS/Shadow outcome testing separate and later.
