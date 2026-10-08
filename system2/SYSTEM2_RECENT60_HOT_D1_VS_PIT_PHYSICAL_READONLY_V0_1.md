# System 2 Recent60 Hot-D1 Presence vs PIT-Eligibility Readonly Sample V0.1

Status: DATA_LANE / CLASS A / IMPLEMENTED IN PR CANDIDATE; physical readback pending.
Market-date anchor: 2026-10-08, an already-completed TWSE/TPEx calendar session.
Scope: bounded retrospective physical root-cause classification; NO trading or snapshot authority.

## Why
The existing PIT 60-session history reader samples only rows that satisfy
`pit_replay_eligible=1`, RAW priceSpace and `available_at<=decisionTimestamp`.
Missing expected PIT-eligible sessions do not prove a physical D1 row is absent;
the row may exist but be filtered by PIT readiness, price-space or revision fields.
The merged #898 taxonomy correctly distinguishes these but cannot physically
prove which class applies to any particular missing market-symbol-date.

## This bounded diagnostic
1. Use an explicitly already-ended market date, never the current unclosed session.
2. Reuse official A1 snapshot, exact session calendar, listing/lifecycle read-only
   evidence and the same PIT history reader; refuse missing global integrity.
3. Select at most 6 symbols per market with genuine exact-session missing dates,
   at most 8 already-observed missing dates each; do not invent any missing date.
4. Issue only SELECT against isolated `system2-research.s2_historical_a1_bars`,
   bounded by exact market, ordinary stock symbol and explicit dates.
5. Classify hot-D1 physical absence, RAW-space absence, ineligible PIT flag,
   missing or later `available_at`, and source-reader discrepancy separately.
6. Preserve original per-symbol samples, measured rows and cause counts in one
   success/blocked immutable GitHub Action artifact, even on source failures.

Maximum bounded sample: 12 symbols and 96 market-symbol-date identities.
No INSERT/UPDATE/CREATE, Worker deploy, R2 PUT, capital, order or push path.

## Very important evidence semantics
- `HOT_D1_ROW_ABSENT` means NO row returned by isolated *hot D1* for that
  exact market-symbol-date only. It does NOT mean the official TWSE/TPEx
  original source or R2 cold packs lack the bar.
- `PIT_REPLAY_ELIGIBILITY_NOT_GRANTED` means hot rows exist, but metadata does
  not presently grant replay; never silently change it to eligible.
- `AVAILABLE_AFTER_DIAGNOSTIC_CUTOFF` is evaluated using the actual time the
  diagnostic fetched the historical date, NOT a fabricated historical cutoff.
- The entire workflow is `RETROSPECTIVE_DIAGNOSTIC_POST_FACTO`, not
  prospective firstKnownAt/availableAt evidence for 2026-10-08.
- A physically present/eligible row inconsistent with history reader is a
  mismatch needing independent investigation, NOT authorization to repair.
- If listing/calendar/source/global accounting is insufficient, the workflow
  records BLOCKED rather than a zero-data or zero-pick statement.
- No corporate-action `NO_EVENT`, `CLEAR_NO_ACTION`, technical continuity
  or NC-T01 executable certification is inferred by this tool.

## Handoff after physical result
If most sampled dates have no hot D1 rows, investigate existing cold R2
source/physical pack existence and stage-specific hot-history writer quotas.
If rows are present but PIT-filtered, inspect source clocks and conservative
eligibility provenance; never retrospectively grant PIT or rewrite snapshots.
Separately, symbols with 60/60 PIT sessions but continuity unknown require
complete exact-window corporate-action and lifecycle evidence, not more bars.

Acceptance: CI + V8 regression, merged-main source readback, bounded GitHub
physical Action PASS or detailed BLOCKED receipt, then a versioned evidence
and Checkpoint citation without claiming aggregate replay or Stage1 launch.
