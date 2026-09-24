# Research Checkpoint

Checkpoint sequence: B-113.
Updated: 2026-09-24 18:12 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-112 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Durable retained state through B-112
- Latest trusted owner-approved architecture remains 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid is Shadow-only and cannot silently become Formal BUY eligibility.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
- B-73..B-75 sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency != exchange-session adjacency; no historical calendar/Shadow backfill.
- Top5 provenance rules remain frozen: set-membership and ordering are separate; exact raw-score ties are UNKNOWN; `未分類` is structurally non-empty but semantically coarse; no repair/re-sort/de-dup/backfill.
- `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` because day rows are UPSERT-able and lack immutable origin provenance.
- Hybrid WATCH definitions changed materially across V8.9.3 -> V8.9.4 -> V8.9.5. These are Class-C signal/monitoring semantics even though the pool is named Shadow. Any performance cohort must be version-stratified.
- 2026-09-22 and 2026-09-23 remain two adjacent observed completed Formal zero-pick dates; descriptive only. 2026-09-24 intraday monitoredCount=0 is not a completed daily zero-pick.
- V8.9.6 Production activation is durably proven: V8.9.5 at 2026-09-24T00:13:05Z and V8.9.6 at 00:13:21Z; the 16-second transition window remains UNKNOWN for observations without self-versioning.
- B-99 live research readback: Shadow total=62 across 2 archived dates; external evidence total=62, TWSE=53, TPEX=0, UNKNOWN=9; TPEx revenue available=0; shadow integrity RESEARCH_DATA_GAP; all R01-R08 readiness DATA_QUALITY_BLOCKED.
- B-100..B-104: `TPEX_ZERO_ROOT_CAUSE=UNKNOWN`; H1=no OTC candidates, H2=OTC unmatched -> UNKNOWN, H3=specific TPEx monthly-revenue research provider/path unavailable remain unresolved. Existing durable plaintext provenance search is exhausted; future row-level observability is Class B proposal-only.
- B-105..B-112: no later completed Formal scan or new durable prospective Top5 day row had become available; zero-pick denominator remained exactly 2 dates and R03/R06 remained WAITING_DATA.

## B-113 — 18:12 official market-data sync failed before recovery; do not count 9/24 as zero-pick
### Fresh evidence
- Re-read `RESEARCH_ENGINEERING_GOVERNANCE.md`, `RESEARCH_WORKLIST.md`, B-112 checkpoint and latest main commit before inspection.
- Entry checkpoint was B-112 at main commit `ca7b2b2982c2efbb6b90b4d074b79d1f47859856`; no newer A/B cursor was present.
- A genuinely new Action appeared: `V7 Official Market Data Sync` run `35984655979`, created 2026-09-24T10:00:17Z (18:00:17 Asia/Taipei), completed FAILURE at 18:03:35.
- Step-level evidence is asymmetric: `Sync today's official market data` SUCCESS; `Sync official institutions and missing recent trading days` SUCCESS; `Sync official index, quarterly financials, valuation and TDCC` FAILURE; `Recover missing same-day analysis after complete data (skip prior success)` SKIPPED.
- Workflow source confirms recovery is intentionally downstream of the quality sync and therefore does not run after that failure. The failed quality script covers official index, TDCC, valuation, announcements, quarterly financial/EPS verification and checks that quality ingestion cannot alter plans/capital.
- Available Actions jobs metadata identifies the failing step but does not expose the exact assertion/provider failure. The logs endpoint returned no plaintext log body through the connected read surface. Therefore `OFFICIAL_QUALITY_FAILURE_ROOT_CAUSE=UNKNOWN`; do not guess whether index freshness, TDCC, valuation, MOPS, TPEx, route readiness, timeout, parsing, or another assertion caused it.
- Re-read checkpoint immediately before write; it remained B-112 with blob `ae6f2ac0aad5cea6175c91fff4bc49913274b8f6`, so no concurrent A/B merge was required.

### Interpretation / falsification
- This is material new evidence, but it is **not** a completed Formal scan and is **not** a zero-pick observation. The same-day recovery path was skipped because prerequisite quality synchronization failed.
- Completed Formal zero-pick denominator therefore remains exactly 2 independent dates: 2026-09-22 and 2026-09-23. 2026-09-24 remains UNKNOWN/not-yet-completed at this cursor.
- The positive hypothesis "9/24 has no picks" is not supported by this run; an alternative mechanism is directly evidenced: upstream official-quality synchronization failed before recovery/analysis.
- R03/R06 prospective Top5/`未分類` frequency remains `WAITING_DATA`; no new durable Top5 day row was established by this failed run.
- `TPEX_ZERO_ROOT_CAUSE=UNKNOWN` remains unchanged. This new failure is a different evidence class, but because exact failure detail is unavailable it cannot be attributed specifically to TPEx or used to resolve H1/H2/H3.

### Bias / governance controls
- Prevented zero-pick denominator inflation from a failed prerequisite pipeline, sample/date-cluster inflation, look-ahead, historical Shadow fabrication, UNKNOWN coercion, and market-source substitution.
- No post-hoc factor/window/threshold/split introduced. Selection bias, data snooping, market-source bias, Factor Zoo, overfit, coverage, transaction-cost, date-cluster and redundancy controls remain active.
- A failed quality-provider path is treated as missing/UNKNOWN evidence, not BAD fundamentals and not zero selection.

### R01-R08 / I01-I07 impact
- R01-R08: no new mature outcome evidence; readiness unchanged. The failure reinforces data-quality blocking rather than a directional factor conclusion.
- I01-I07: no new intervention/engineering experiment and no causal performance inference.

### Engineering classification / branch / tests / deployment
- Evidence inspection + durable checkpoint only; no runtime engineering change.
- Branch: main checkpoint write only. No Worker/workflow/D1/KV/source-routing/Formal selection/Hybrid WATCH/monitoring/notification code changed.
- Tests: no code changed. Evidence validation used the new Actions run/jobs plus workflow and quality-sync source inspection.
- Deployment: none. Production untouched. Rollback is B-112 in Git history.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write; merge a newer A/B cursor if present.
2. First check whether a later scheduled/recovery Action after run `35984655979` succeeds and produces a completed 2026-09-24 Formal scan. Do not classify 9/24 from the failed 18:00 prerequisite run.
3. If a later trusted scan has >=1 Formal plan, immediately restore funnel priority: verify execution-recorder target-date coverage and 500-row non-truncation before signal interpretation; same-date `HUMAN_MOMENTUM_SHADOW` remains research-only on Formal SELECTED names.
4. If a later completed scan is zero-pick, only then extend the completed zero-pick denominator/date sequence from 2 to 3.
5. If the quality-sync failure repeats, inspect any newly available job log/artifact/error surface and narrow `OFFICIAL_QUALITY_FAILURE_ROOT_CAUSE`; missing exact error remains UNKNOWN. Do not change shared fetch/routing/calendar/workflow behavior on main without Class B approval.
6. If a new durable prospective Top5 day row exists, continue R03/R06 frequency: report independent date count, valid Top5-set count, `未分類`-present count/rate, malformed/UNKNOWN count; do not repair/re-sort/de-dup or infer raw ties.
7. If neither a completed Formal scan nor new durable Top5 row exists, preserve WAITING_DATA and do not duplicate old observations merely to create progress.
8. Treat B-101..B-104 TPEx plaintext provenance search as exhausted unless a genuinely new artifact/log/export class appears. Keep `TPEX_ZERO_ROOT_CAUSE=UNKNOWN`; H1/H2/H3 remain unresolved.
9. Preserve B-104 Class B row-level observability proposal only; do not implement/merge/deploy without owner approval.
10. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; do not retroactively upgrade B-73/B-74 pairs.
11. Do not implement workflow/version logging, validator/helper, shared calendar/cache/date-resolution or source-routing changes on main without the applicable Class B decision.
