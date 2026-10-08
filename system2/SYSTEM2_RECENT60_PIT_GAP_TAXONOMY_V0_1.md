# System 2 近期 60 交易日 PIT-eligible 缺口分類 V0.1

Status: DATA_LANE / RESEARCH_ONLY / SOURCE_HONEST
Scope: System 2 daily Shadow *read-only input preflight*; System 1 Formal impact NONE.

## Why

Latest prior physical preflight reported 1,972 current ordinary symbols, only 46 with
exact-expected-session PIT-eligible history ready, and 0 with certified technical
continuity. A single number cannot tell whether the problem lies in source
date membership, the D1 history population, the PIT eligibility filter, listing
boundary or missing corporate-action continuity evidence.

## What this classification does

The existing historical reader already produces immutable per-symbol diagnostics.
This helper only summarizes those outputs and adds no SQL request:

- Exact denominator: TWSE / TPEx / UNKNOWN market, total/current symbol count.
- Exclusive *first-blocker* primary causes, with separate nonexclusive blocker incidence.
- PIT-eligible selected date-count histogram and counts of missing expected
  sessions, unexpected selected sessions and ambiguous revisions.
- New listing age-limited count and listing/expected-calendar uncertainty.
- History-ready vs continuity-ready split. A symbol with exact PIT history but no
  verified continuity is classified as a *continuity proof* gap, not a missing bar.
- Bounded examples (at most 12 ticker symbols, with at most 8 sampled missing dates each).

Crucial semantics: a missing row in **selected PIT-eligible history** is NOT
proof the historical raw row was never stored. The raw row may exist in D1 but
be filtered by decisionTimestamp / pit_replay_eligible / priceSpace. The report
marks this distinction as NOT_DISTINGUISHED_BY_THIS_READ_ONLY_RESULT and
never labels missing A1 raw physical bars without independent read-only checks.

The first-blocker categories are mutually exclusive for prioritization, NOT
a claim that a single causal failure exists. Nonexclusive blocker incidence
preserves combinations and denominator fairness. No nontrading gap is automatically
classified as ordinary trading, and missing sessions are never synthesized.

## Data integrity and gates

The output cannot be constructed if universe accounting is incomplete, reader
historyReady/continuityReady counts differ, symbols duplicate, or counts violate
basic exact-session invariants. In these cases the runner remains fail closed.
When the current source is unavailable, no zero-gap distribution is asserted.

The resulting report does NOT:
- modify historical bars, D1, R2, source clocks or snapshot freezes;
- certify PIT provenance of earlier 2026 Jan–Jun timestamps;
- declare clear-no-action, infer official suspension without event coverage,
  or satisfy NC-T01 corporate-action continuity by itself;
- allow final stock selection, zero picks, live push, capital or orders.

## Next source-honest DATA_LANE work

1. Run the updated preflight against the latest trading day without mutations.
2. Review per-market mutually exclusive cause distribution and blocker incidence.
3. If history-ready but continuity unverified, request a real hash-bound
   continuity receipt from the official halt/resumption + corporate-action
   source evidence; absence of records does NOT certify no event.
4. If an expected PIT-eligible session is missing, perform an independent,
   bounded, read-only D1 check to split **physical A1 row missing** vs
   **PIT-ineligible/clock-filtered A1 row** before scheduling any D1 writes.
5. Respect account-level D1 write-budget ownership in REMEDIATION_LANE and
   NC-T01 strategy orchestration ownership in BUILD_LANE.

No System1 Formal Core, Cloudflare production Worker, or trading behavior changed.
