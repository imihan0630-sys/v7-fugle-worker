# Research Checkpoint

Checkpoint sequence: B-115.
Updated: 2026-09-24 19:12 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-114 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Durable retained state through B-114
- Latest trusted owner-approved architecture remains 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid is Shadow-only and cannot silently become Formal BUY eligibility.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
- B-73..B-75 sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency != exchange-session adjacency; no historical calendar/Shadow backfill.
- Top5 provenance rules remain frozen: set-membership and ordering are separate; exact raw-score ties are UNKNOWN; `未分類` is structurally non-empty but semantically coarse; no repair/re-sort/de-dup/backfill.
- `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` because day rows are UPSERT-able and lack immutable origin provenance.
- Hybrid WATCH definitions changed materially across V8.9.3 -> V8.9.4 -> V8.9.5. These are Class-C signal/monitoring semantics even though the pool is named Shadow. Any performance cohort must be version-stratified.
- 2026-09-22 and 2026-09-23 remain two adjacent observed completed Formal zero-pick dates; descriptive only. 2026-09-24 is not yet a completed Formal outcome at this cursor.
- V8.9.6 Production activation is durably proven: V8.9.5 at 2026-09-24T00:13:05Z and V8.9.6 at 00:13:21Z; the 16-second transition window remains UNKNOWN for observations without self-versioning.
- B-99 live research readback: Shadow total=62 across 2 archived dates; external evidence total=62, TWSE=53, TPEX=0, UNKNOWN=9; TPEx revenue available=0; shadow integrity RESEARCH_DATA_GAP; all R01-R08 readiness DATA_QUALITY_BLOCKED.
- B-100..B-104: `TPEX_ZERO_ROOT_CAUSE=UNKNOWN`; H1=no OTC candidates, H2=OTC unmatched -> UNKNOWN, H3=specific TPEx monthly-revenue research provider/path unavailable remain unresolved. Existing durable plaintext provenance search is exhausted; future row-level observability is Class B proposal-only.
- B-105..B-112: no later completed Formal scan or new durable prospective Top5 day row had become available; zero-pick denominator remained exactly 2 dates and R03/R06 remained WAITING_DATA.
- B-113: 18:00 official sync failed before same-day recovery; 9/24 not counted as zero-pick.
- B-114: 18:33 retry run `35987921399` also failed. Plaintext log proved upstream TWSE/TPEx market/institutions, INDEX, TDCC, VALUATION, ANNOUNCEMENTS and the first Q2 income parses succeeded; terminal error was timeout after TWSE Q2 parse. Broad TPEx outage hypothesis was weakened, but exact downstream operation remained UNKNOWN.

## B-115 — source-order inspection localizes timeout to the multi-period MOPS financial fetch loop
### Fresh evidence
- Re-read governance, worklist, B-114 checkpoint and latest main. Latest main before this write was B-114 commit `7ba9c07f68fbf490f98626c342eb11320ff333af`; no newer A/B checkpoint existed.
- Re-checked recent Actions: no later completed official-market-data recovery run than `35987921399` was visible at this cursor, so there is still no trusted completed 9/24 Formal scan.
- Inspected the exact main source `tests/sync_official_quality.mjs`. After ANNOUNCEMENTS it loads MOPS EPS CSV + market options, derives a set of current/prior comparison periods, then constructs `requests=[...periodKeys].flatMap(key=>['TWSE','TPEx'])` and fetches those MOPS income pages in batches of two via `Promise.all`.
- Each financial request uses the same official endpoint `https://mopsov.twse.com.tw/mops/web/ajax_t163sb04` with market-specific `TYPEK`; each request is protected by `publicSource()` with a 45-second AbortSignal timeout and retry logic.
- Only **after the entire multi-period request loop completes** does the script call `sync({kind:'FINANCIAL',...})`, then `/api/scan-preview` for EPS review. Therefore the B-114 terminal timeout, whose last log was within Q2 period parsing and which never logged FINANCIAL prevalidation/cache, is now localized to the **remaining multi-period MOPS financial fetch/parse loop before FINANCIAL ingestion**, not to later EPS-review `/api/scan-preview`.
- Exact market/period request that timed out remains UNKNOWN because concurrent batch completion/log ordering does not prove which outstanding request aborted, and the terminal error did not include the URL/market/period context.
- Re-read checkpoint immediately before write; blob remained `bff44bcca8b49caef497943e6a8862c73a2e0b41`, so no concurrent A/B cursor required merging.

### Interpretation / falsification
- `OFFICIAL_QUALITY_FAILURE_ROOT_CAUSE` is narrowed to `TIMEOUT_IN_MULTI_PERIOD_MOPS_FINANCIAL_FETCH_LOOP_BEFORE_FINANCIAL_INGESTION`; exact request = UNKNOWN.
- This falsifies later-stage candidates for run `35987921399`: FINANCIAL ingestion, EPS-review scan-preview, Q4 terms validation, per-symbol direct statement review, and downstream recovery were never reached.
- It does **not** prove TWSE vs TPEx culpability. The loop intentionally pairs TWSE+TPEx requests, and log order under Promise.all cannot identify the aborted member. No market-source blame is assigned.
- 9/24 remains prerequisite-failed/UNKNOWN, not a zero-pick. Completed Formal zero-pick denominator remains exactly 2 independent dates: 9/22 and 9/23.
- R03/R06 remains WAITING_DATA; no new durable prospective Top5 row established.
- `TPEX_ZERO_ROOT_CAUSE=UNKNOWN` remains unchanged; this quality-sync MOPS financial timeout is separate from historical TPEx monthly-revenue provenance H1/H2/H3.

### Bias / governance controls
- Prevented infrastructure failure from being coerced into a negative trading signal; prevented repeated-run/date-cluster inflation and market-source attribution from concurrent log order.
- No look-ahead, historical Shadow fabrication, post-hoc factor/window/threshold/split, selection-bias or data-snooping promotion.
- Factor Zoo, overfit, coverage, transaction-cost and redundancy controls unchanged.

### R01-R08 / I01-I07 impact
- R01-R08: no new mature outcome evidence; readiness unchanged / data-quality constrained.
- I01-I07: no new intervention experiment and no causal performance inference.

### Engineering classification / branch / tests / deployment
- Source inspection + checkpoint only; no runtime code change.
- No Worker/workflow/D1/KV/source-routing/Formal/Hybrid WATCH/monitoring/notification change.
- No deployment. Any timeout/retry/concurrency/log-context change to this shared quality workflow remains Class B proposal-first.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main; re-check checkpoint SHA before write and merge newer A/B progress if present.
2. First check for any official-market-data run after `35987921399`, especially the later 23:25/23:45 Taipei schedules. Only a trusted completed recovery/Formal scan can classify 9/24.
3. If a later trusted scan has >=1 Formal plan, immediately restore funnel priority: verify execution-recorder target-date coverage and 500-row non-truncation before signal interpretation; same-date `HUMAN_MOMENTUM_SHADOW` remains research-only on Formal SELECTED names.
4. If a later completed scan is zero-pick, only then extend completed zero-pick denominator from 2 to 3.
5. If quality sync fails again, inspect plaintext log for the **last successful market/year/quarter** in `officialFinancialPeriodParsed` and any wrapped `Public source ...` error. Use request construction order to narrow the exact outstanding market/period, but do not infer culprit from Promise.all log order alone.
6. Do not modify the shared quality workflow timeout/retry/concurrency/logging on main without Class B owner approval. A proposal may recommend per-request market/year/quarter context and bounded concurrency, but proposal != deployment.
7. If a new durable prospective Top5 day row exists, continue R03/R06 frequency with independent date count, valid Top5-set count, `未分類` rate and malformed/UNKNOWN count; no repair/re-sort/de-dup/tie inference.
8. If neither completed Formal scan nor new Top5 row exists, preserve WAITING_DATA; do not duplicate observations.
9. Keep `TPEX_ZERO_ROOT_CAUSE=UNKNOWN`; B-101..B-104 provenance search remains exhausted unless a genuinely new artifact/log/export class appears.
10. Preserve B-104 Class B row-level observability proposal only; no implementation/merge/deploy without approval.
11. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; do not retroactively upgrade B-73/B-74 pairs.
