# Research Checkpoint

Checkpoint sequence: B-98.
Updated: 2026-09-24 10:11 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-97 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Durable retained state through B-97
- Latest trusted owner-approved architecture remains 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid is Shadow-only and cannot silently become Formal BUY eligibility.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
- B-73..B-75 sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency != exchange-session adjacency; no historical calendar/Shadow backfill.
- Top5 provenance rules remain frozen: set-membership and ordering are separate; exact raw-score ties are UNKNOWN; `未分類` is structurally non-empty but semantically coarse; no repair/re-sort/de-dup/backfill.
- `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` because day rows are UPSERT-able and lack immutable origin provenance.
- Hybrid WATCH definitions changed materially across V8.9.3 -> V8.9.4 -> V8.9.5. These are Class-C signal/monitoring semantics even though the pool is named Shadow. Any performance cohort must be version-stratified; do not pool them as one frozen experiment.
- V8.9.6 inspected source adds audit/output fields without a visible WATCH eligibility change, but it is shared-runtime/deployment work and therefore at least Class B. V8.9.3-8.9.5 owner authorization remains UNKNOWN absent durable owner evidence.
- B-96 proved trusted Production runtime at 2026-09-24T00:13Z was still `8.9.5-hybrid-watch-directional`, despite V8.9.6 deploy intent. Latest trusted completed scan remained 2026-09-23 with Formal selectedCount=0 and Hybrid selectedCount=0. 2026-09-22 and 2026-09-23 are two adjacent observed Formal zero-pick dates; descriptive only, not a threshold-change basis.
- B-97 observed 2026-09-24 09:26 Asia/Taipei intraday health with monitoredCount=0/formal15Ready=0 and no push backlog. This is not a completed daily zero-pick and must not enter the zero-pick denominator.

## B-98 — runtime-version observability gap isolated; no false activation upgrade
### Fresh evidence
- Re-read governance, worklist and B-97 checkpoint first. Immediately before write, checkpoint blob SHA was `9c15da0026083679fbdc34c1832764dfd71d3940` and main head was B-97 commit `85413f2c160a67cec1b24b13c7e4de6a90192d89`; no newer A/B cursor or semantic code commit appeared.
- Latest listed Actions evidence remained scheduled health run `35942927209`; no newer completed after-market Formal scan was available at this continuation point.
- Audited `.github/workflows/v7-health.yml` and `tests/scheduled_health.mjs` rather than inferring from the B-97 log. The health test **does** perform a public GET to Production `/api/version`, requires HTTP success, parses the JSON into `runtime`, and uses `runtime.version` to require exact equality with `/api/watchlist` version in after-market mode.
- However, the current console payloads do **not** emit `runtime.version`. Intraday output prints health/Cron/outbox/receipt fields; after-market output prints scan/watch/storage/journal/outbox/receipt fields. Therefore a SUCCESS health run proves the version endpoint was readable and, in after-market mode, internally consistent with watchlist, but the durable Actions log cannot by itself identify the literal runtime version string.
- Current committed root `Worker.js` still advertises legacy `7.5.26-q1-statement-column-validation`; repository root source is therefore not a valid substitute for the deployed V8.9.x runtime literal. This reinforces the existing rule that deployed readback, not repository version strings, determines Production activation.

### Interpretation / falsification
- Falsified the stronger interpretation that B-97 health SUCCESS meant `/api/version` was not queried at all. It **was queried**; the problem is evidence emission, not endpoint absence.
- Also falsified the opposite overreach that health SUCCESS is enough to declare V8.9.6 active. Because the literal value is not printed, V8.9.6 activation remains `UNKNOWN`; latest trusted literal Production version remains B-96's `8.9.5-hybrid-watch-directional` until a newer durable readback emits the actual value.
- This distinction matters for Hybrid moving-target control: a version-stratified cohort needs an auditable activation boundary. An unprinted in-memory version comparison cannot assign a durable V8.9.6 activation timestamp without additional evidence.
- No new completed Formal scan exists at this checkpoint, so zero-pick coverage remains exactly two completed observed dates (2026-09-22, 2026-09-23). The 2026-09-24 intraday no-monitor observation remains excluded.

### Bias / governance controls
- No selection threshold, factor, WATCH eligibility, signal semantics, capital, monitoring or push behavior changed.
- No historical Shadow/calendar/version activation was backfilled from current repository state. Missing literal runtime activation remains UNKNOWN.
- Version-stratification remains mandatory for V8.9.3/V8.9.4/V8.9.5 Hybrid cohorts; do not pool across moving definitions. V8.9.6 cannot be assigned to a cohort start date from deploy intent alone.
- Selection bias, look-ahead, data snooping, market-source bias, Factor Zoo, overfit, coverage, zero-pick, transaction-cost, date-cluster and redundancy controls remain active.

### Engineering / deployment
- Identified a minimal observability improvement: include literal `runtime.version` in read-only health console evidence. But the existing workflow/deployment path means changing shared test/workflow behavior is not treated as an autonomous main edit here; retain as Class B proposal-first under the existing B-81 deployment-path finding.
- Evidence inspection + checkpoint only. No Worker, D1/KV schema, workflow, dashboard, Formal selection, Hybrid WATCH definition, monitoring, notification or Production deployment changed by B-98.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write; merge a newer A/B cursor if present.
2. Seek a trusted authorized read-only Production artifact/log that **emits** literal `/api/version`; do not treat a successful but non-emitting health check as an activation timestamp. Keep V8.9.6 activation UNKNOWN until proven.
3. Wait for a completed later Formal scan before updating zero-pick coverage. Never count intraday `monitoredCount=0` as a completed daily zero-pick.
4. If a later trusted scan has >=1 Formal plan, immediately restore funnel priority: verify execution-recorder target-date coverage and 500-row non-truncation before signal interpretation; same-date `HUMAN_MOMENTUM_SHADOW` stays research-only on Formal SELECTED names.
5. For Hybrid WATCH research, keep V8.9.3/V8.9.4/V8.9.5 cohorts version-stratified. Treat V8.9.6 as same eligibility regime only after trusted activation date plus source evidence confirms no intervening semantic patch.
6. If no newer completed formal-plan evidence is available, continue R03/R06 supplied-row work. First look for an existing read-only durable research endpoint/artifact that exposes persisted `trade_research_days.market_json`/Top5 without modifying runtime. If such evidence is absent, record `未分類` frequency as UNKNOWN rather than inventing a denominator from source definitions or reconstructed rows.
7. Structural Top5 membership and semantic-classification quality remain separate: `未分類` can satisfy non-empty membership but is semantically coarse; do not drop dates, repair names, re-sort, de-dup or infer raw ties.
8. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; keep malformed rules and historical raw-tie UNKNOWN semantics frozen.
9. Do not implement version logging, validator/helper, workflow-path, shared calendar/cache/date-resolution changes on main without the applicable Class B decision. Do not retroactively upgrade B-73/B-74 pairs.
