# Technical Indicator Class-B Implementation Impact Audit V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / BOUNDED_IMPACT_AUDIT / IMPLEMENTATION_NOT_READY
Formal Core: LOCKED

## Purpose

Audit the smallest safe production-runtime shape for a future prospective Technical Indicator observer without implementing it.

The question is:
Would a Class-B observer be technically bounded and architecturally reusable enough to justify later owner review?

This document does NOT request approval and does NOT authorize code/schema/runtime changes.

## TI-379 — Do not use legacy mutable Shadow as promotion-grade parent

Current trade_research_shadow_candidates:
- PRIMARY KEY(scan_date,symbol);
- deletes a scan date before rewriting;
- row-by-row insert/upsert;
- one mutually exclusive cohort field;
- no immutable captureGeneration/semantic fingerprint parent.

The current builder also uses a used set.

Therefore a symbol sampled into one focal cohort cannot simultaneously appear in another membership in the legacy row model.

Existing research has already concluded:
legacy snapshot_json flexibility does not repair immutable lineage.

Technical Indicator must not create new evidence on top of this mutable identity and call it promotion-grade.

## TI-380 — Current legacy daily upper-bound is small but not the future sizing authority

From the current V8.7.2 builder:

- SELECTED: Formal max <=6;
- QUALIFIED_NOT_SELECTED: up to 6 GENERAL + 6 THOUSAND;
- NEAR_MISS: up to 12;
- REJECTED_AFTER_BASE: up to 12;
- BROAD_CONTROL: up to 12.

Because used prevents duplicates, a theoretical legacy maximum is:

6 + 12 + 12 + 12 + 12 = 54 rows per scan date.

This is useful only as a bounded current-archive reference.

It is NOT the correct sizing assumption for the future immutable decision-state parent, which may preserve a much larger pre-sampling population.

Do not design storage/latency around 54 until future parent scope is frozen.

## TI-381 — Reuse immutable decision-state parent architecture

Preferred future shape:

PARENT:
shared immutable per-symbol decision-state receipt
owned by the unified Shadow evidence architecture.

CHILD:
Technical Indicator evidence keyed by:
- parentDecisionReceiptId;
- captureGeneration;
- observerVersion;
- formula bundle version;
- asOf.

RUN:
one Technical Indicator observer run receipt per scan date/generation.

Do not create:
- a second candidate universe;
- a second population denominator;
- a second membership model.

## TI-382 — Minimal storage delta

If a generic immutable evidence-child table is created by the shared architecture:
prefer one typed Technical Indicator child payload in that generic table.

If no generic child exists:
minimum dedicated additive schema would be only:

1. technical_indicator_observer_snapshots
2. technical_indicator_observer_runs

The child does not need to duplicate:
- Formal state;
- cohort memberships;
- corporate-action registry;
- continuity event details;
- session calendar;
- outcome rows.

It references their immutable receipts.

This minimizes schema duplication.

## TI-383 — Write-amplification scenarios

Per scan date:

snapshot writes =
expected Technical Indicator parent attempts.

run writes =
1 run receipt.

Scenario A — legacy-bounded reference:
<=54 snapshot attempts + 1 run receipt.

Scenario B — future complete per-symbol decision-state parent:
potentially hundreds to ~full-market scale.
Current repo comments indicate roughly 1,800+ market symbols and HISTORY_CACHE_TARGET=2000.

Because future parent scope is not frozen:
PRODUCTION_WRITE_VOLUME = UNKNOWN_BOUNDED_BY_PARENT_SCOPE.

Do not claim low write cost from the legacy 54-row archive.

## TI-384 — Provider-call delta

Formula computation itself can add zero market-data calls when required history/receipts are already present.

Known:
- current daily cache already contains enough raw bars for KD/MACD/Bollinger mechanics;
- raw 65-bar cache does not by itself certify RSI canonical state;
- ADX state also needs replay lineage;
- TECHNICAL_CONTINUITY runtime is not yet available.

Potential steady state:
- zero new quote/candle calls if shared continuity history + replay-certified prior states are available.

Bootstrap/rebuild:
- may require deeper causal history and/or Corporate Actions registry materialization.

Therefore:

STEADY_STATE_FORMULA_CALL_DELTA = POTENTIALLY_ZERO.
BOOTSTRAP_SOURCE_CALL_DELTA = UNKNOWN.
CONTINUITY_RUNTIME_CALL_DELTA = DEPENDENCY_OWNED / NOT_YET_PROVEN_ZERO.

A future Class-B proposal must measure these separately.

## TI-385 — Compute complexity

Core formula complexity is O(parentCount * historyLength) for replay computation.

The formulas are computationally small:
- rolling extrema/RSI/MACD/ADX/Bollinger over daily histories.

The expensive risk is not arithmetic.
It is:
- source/history loading;
- continuity transformation;
- immutable persistence;
- large-parent keyset reads/writes.

Optimization priority:
reuse same-scan already-loaded history and shared receipts.

Do not add per-indicator provider fetches.

## TI-386 — Recursive-state cache can reduce steady-state work but is not authority

Optional state cache may retain:
- KD K/D;
- RSI avgGain/avgLoss;
- MACD EMA12/EMA26/Signal;
- ADX Wilder states.

Benefits:
- O(1) update per new eligible bar.

Risks:
- dirty state after source correction;
- continuity-engine version changes;
- event-registry revision;
- session correction.

Therefore:
cached state is a performance optimization only.
Canonical replay lineage remains truth.

A rebuild path is mandatory.

## TI-387 — Failure isolation

Technical Indicator observer must run AFTER protected Formal decision state is frozen/persisted.

Required fail-open behavior:
- observer exception does not alter Formal selected symbols/order;
- no plan/capital mutation;
- no monitoring/signal/push suppression;
- failed observer run persists INCOMPLETE/QA_FAIL if possible;
- no retry may re-run or mutate the Formal decision.

This matches the project Class-A/Shadow safety philosophy, even though shared persistence/wiring makes implementation Class B.

## TI-388 — Scheduling shape

Preferred initial scope:
AFTER_MARKET only.

Do not add intraday Technical Indicator persistence initially.

Reason:
- current research question is after-market selection incremental value;
- daily KD/RSI/MACD/ADX/Bollinger are selection/context features;
- 15m execution remains a separate lane;
- adding intraday persistence multiplies rows, timing semantics and price-limit/session complexity before daily evidence exists.

If integrated into the existing after-market run:
measure incremental wall time and memory before deployment.

If a separate scheduled job is proposed:
that changes runtime scheduling and remains Class B.

No schedule choice is authorized here.

## TI-389 — Shared-parent dependency prevents a clean proposal today

A technically minimal Technical Indicator child is feasible.

But implementation is not ready for owner approval because three upstream shared dependencies remain unresolved:

1. immutable decision-state parent / captureGeneration architecture;
2. production TECHNICAL_CONTINUITY handoff;
3. runtime-complete symbol-session / price-limit provenance.

Implementing the child before these dependencies would create another provisional lineage that later needs migration.

Decision:
CLASS_B_IMPLEMENTATION_PROPOSAL = PREMATURE.

Continue design/source QA.
Do not ask owner to approve implementation yet.

## TI-390 — Impact-audit conclusion

Feasible eventual shape:
- no Formal logic change;
- no rank/quota/capital/signal/push change;
- after-market research child only;
- exact immutable parent linkage;
- canonical continuity receipt;
- potentially zero steady-state new market calls;
- one evidence row per expected parent plus one run receipt;
- fail-open;
- prospective-only.

Unknowns that must be resolved before proposal:
- future parent population size;
- continuity runtime source/call cost;
- bootstrap/rebuild cost;
- D1 write/latency impact at real parent scale;
- shared generic evidence-child schema availability.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Do not implement Class B yet.
2. Reuse the unified immutable Shadow parent proposal; do not invent Technical-Indicator-specific parent storage.
3. Continue bounded feasibility work on:
   - parent scope/row counts;
   - shared generic child schema;
   - continuity runtime cost/source contract.
4. When those are resolved, prepare one consolidated Class-B research-infrastructure proposal for owner review rather than separate Pattern/Technical child migrations where possible.
5. No alpha/outcome inference before prospective capture.
