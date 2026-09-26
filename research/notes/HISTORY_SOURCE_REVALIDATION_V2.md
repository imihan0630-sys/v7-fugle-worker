# HISTORY_SOURCE_REVALIDATION_V2 — research-only falsification note

Date: 2026-09-26 Asia/Taipei  
Status: FALSIFICATION_IN_PROGRESS / CLASS-A PROTOTYPE  
Formal Core: LOCKED / unchanged

## Question

Can the B-130 stale-history defect be repaired without the false rejection introduced by PR #100's strict market-session continuity rule?

## Positive evidence

- B-130 proves a stale 60+ bar cache can materially alter existing Formal A/B feature results and eligibility.
- Current history-seed logic already has a bounded batch refetch path.
- Fugle Historical Candles supports explicit `adjusted=false`; the research contract pins raw-price semantics instead of relying on an undocumented default.
- Current after-market selection is already intersected with today's official market rows, so a symbol with no current traded bar cannot become a Formal candidate that day.

## Counterevidence that falsifies PR #100 as a final design

Strict `latest prior bar == previous market session` and exact last-60 market-session continuity is not a valid *final* admission rule:
- TWSE 8422 has a verified multi-session suspension before its 2025-11-17 resumption.
- TPEx 5314 has a verified 2025-03-20..2025-03-28 suspension before 2025-03-31 resumption.
- No-transaction sessions can also create legitimate calendar gaps.

Those cases may look identical to stale cache when only dates are inspected.

## V2 design under test

1. Treat market-session mismatch as a **suspicion trigger only**.
2. If the cache is structurally healthy and exactly aligned, keep the zero-call fast path.
3. If suspicious, refetch that symbol's historical daily bars with explicit `adjusted=false`.
4. Validate the freshly fetched series as an **actual-bar sequence**:
   - valid dates;
   - strict order;
   - no duplicates;
   - no future leakage;
   - at least the required prior bars.
5. Do **not** require every market session to have a bar in the fresh provider series.
6. Fresh provider failure/ambiguity => UNKNOWN/DATA_INCOMPLETE, never stale-cache fallback.
7. Strategy filters (price >= 10, ETF/etc exclusions) must not define raw bar-presence truth.

## Important source-boundary correction

Current `normalizeMarketRow()` is unsuitable as a historical bar-presence denominator because it applies Formal eligibility filters, including `close < MIN_CLOSE_PRICE`. Presence/revalidation evidence must be sourced before those filters.

## Why this is not yet a Formal optimization candidate

This prototype still needs:
- executable deterministic CI evidence;
- performance/call-budget analysis for revalidation queues;
- integration design against the current history-seed state machine;
- proof that clean-cache cases preserve current Formal outputs;
- bounded failure/rollback semantics;
- explicit separation from the corporate-action price-continuity problem.

No Worker.js/runtime/D1/KV/selection/ranking/threshold/capital/monitor/push behavior is changed by this branch.
