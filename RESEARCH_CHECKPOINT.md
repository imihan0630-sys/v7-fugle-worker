# Research Checkpoint

Checkpoint sequence: B-99.
Updated: 2026-09-24 10:42 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-98 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Durable retained state through B-98
- Latest trusted owner-approved architecture remains 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid is Shadow-only and cannot silently become Formal BUY eligibility.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
- B-73..B-75 sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency != exchange-session adjacency; no historical calendar/Shadow backfill.
- Top5 provenance rules remain frozen: set-membership and ordering are separate; exact raw-score ties are UNKNOWN; `未分類` is structurally non-empty but semantically coarse; no repair/re-sort/de-dup/backfill.
- `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` because day rows are UPSERT-able and lack immutable origin provenance.
- Hybrid WATCH definitions changed materially across V8.9.3 -> V8.9.4 -> V8.9.5. These are Class-C signal/monitoring semantics even though the pool is named Shadow. Any performance cohort must be version-stratified; do not pool them as one frozen experiment.
- V8.9.6 source adds audit/output fields without a visible WATCH eligibility change; shared-runtime/deployment classification remains at least Class B. V8.9.3-8.9.5 owner authorization remains UNKNOWN absent durable owner evidence.
- 2026-09-22 and 2026-09-23 remain two adjacent observed completed Formal zero-pick dates; descriptive only. 2026-09-24 intraday monitoredCount=0 is not a completed daily zero-pick and stays outside the denominator.
- B-98 proved scheduled health queries `/api/version` but does not emit the literal version in its console payload; health success alone is not an activation timestamp.

## B-99 — V8.9.6 Production activation proven from durable deploy readback
### Fresh evidence
- Re-read governance, worklist and B-98 checkpoint first. Immediately before write, checkpoint blob SHA was `757c862b99384004b20a24a80d4043af44e0444c`; main head was B-98 commit `540a9f7a6f8a2f561d09bdfe15a615356c0327d1`. No newer A/B cursor appeared.
- Queried Actions by the V8.9.6 semantic commit `c322c13163016a76b77c0a7d0e19ee0d0caa82f7`. It has two completed-success runs: regression `35937377710` and Cloudflare deploy `35937377707`.
- Audited the actual deploy job/log instead of inferring from workflow success. Pre-deploy backup at 2026-09-24T00:13:05Z emitted literal runtime `8.9.5-hybrid-watch-directional`, proving the old version was still active immediately before deployment.
- The Worker content PUT then succeeded at 2026-09-24T00:13:07Z. Deployment verification succeeded.
- Crucially, the research-only readback at 2026-09-24T00:13:21Z emitted `expectedVersion=8.9.6-hybrid-watch-audit` and `observedVersion=8.9.6-hybrid-watch-audit`, then printed `Research readback verified on expected deployment: 8.9.6-hybrid-watch-audit`.
- The same live research readback reported Shadow total=62 across 2 archived dates (2026-09-21, 2026-09-22), execution selectedPlans=4/buyTriggeredPlans=1, regime usableDays=4, shadowIntegrity=`RESEARCH_DATA_GAP` with expectedScanDays=3/archivedScanDays=2, and all R01-R08 readiness statuses `DATA_QUALITY_BLOCKED`.
- External evidence in that live readback remained highly asymmetric: total=62, TWSE=53, TPEX=0, UNKNOWN=9; TPEx revenue available=0. This is direct evidence that TPEx evidence parity is still not achieved in the persisted prospective research cohort.

### Interpretation / falsification
- Falsified B-98's remaining activation UNKNOWN: V8.9.6 was durably observed live by 2026-09-24T00:13:21Z (08:13:21 Asia/Taipei). The activation boundary can therefore be used prospectively for version-stratified research; do not backdate it to commit/deploy intent.
- Also proved a narrow transition window: at 00:13:05Z Production was still V8.9.5; by 00:13:21Z it was V8.9.6. Any Hybrid observation inside that interval without its own runtime provenance remains UNKNOWN rather than assigned by guess.
- V8.9.6 may be treated as the same *source-defined eligibility regime* as V8.9.5 only for research comparisons that explicitly rely on the prior source audit showing no eligibility/state-transition change. It remains a distinct runtime version stratum for provenance.
- The live dashboard's `RESEARCH_DATA_GAP` and 0 TPEx rows are negative evidence against declaring R03/R06 or TPEx parity ready. Do not convert absent TPEx evidence to BAD/0 and do not reconstruct missing rows from current sources.
- No newer completed Formal after-market scan was found in this continuation point, so completed zero-pick coverage remains two dates only.

### Bias / governance controls
- Moving-target bias: V8.9.3/V8.9.4/V8.9.5 remain separate cohorts; V8.9.6 gets a proven activation timestamp and separate provenance label even if eligibility logic is source-equivalent to V8.9.5.
- Market-source bias is now directly visible in live research coverage (TWSE 53 vs TPEX 0); do not pool this as market-neutral evidence.
- Selection bias, look-ahead, data snooping, Factor Zoo, overfit, coverage, zero-pick, transaction-cost, date-cluster and redundancy controls remain active.
- Missing prospective Top5/`未分類` persisted-row evidence remains UNKNOWN; no denominator was invented from source definitions.

### R01-R08 / I01-I07 impact
- No experiment or contrast definition changed. R01-R08/I01-I07 remain frozen and research-only.
- R03/R06 readiness is not upgraded; live integrity remains DATA_QUALITY_BLOCKED and TPEx persisted coverage remains zero in the observed 62-row cohort.
- Execution Alpha evidence remains descriptive only (4 selected plans, 1 BUY-triggered plan) and far below maturity thresholds.

### Engineering / deployment
- Evidence inspection + checkpoint only. No Worker, workflow, D1/KV schema, dashboard, Formal selection, Hybrid WATCH definition, monitoring, notification or Production deployment was changed by B-99.
- The pre-existing V8.9.6 deploy run itself had rollback backup artifact and successful verification; B-99 did not initiate or re-run deployment.
- Class B observability proposal to emit runtime version in scheduled-health logs remains optional; it is no longer needed to establish the V8.9.6 activation boundary because the existing deploy log supplied durable literal readback.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write; merge a newer A/B cursor if present.
2. Treat `2026-09-24T00:13:21Z` as the earliest durably proven V8.9.6 live readback, with V8.9.5 proven at `00:13:05Z`; observations in the 16-second transition window without self-versioning remain UNKNOWN.
3. Wait for a completed later Formal scan before updating zero-pick coverage. Never count intraday `monitoredCount=0` as a completed daily zero-pick.
4. If a later trusted scan has >=1 Formal plan, immediately restore funnel priority: verify execution-recorder target-date coverage and 500-row non-truncation before signal interpretation; same-date `HUMAN_MOMENTUM_SHADOW` stays research-only on Formal SELECTED names.
5. Otherwise continue highest-priority TPEx Evidence Parity/PIT work using the live negative evidence: determine why the persisted prospective cohort has `byMarket.TPEX=0` despite V8.7.11 cross-market revenue support. Distinguish (a) no TPEx candidates in archived cohort, (b) symbol-to-market classification UNKNOWN, and (c) TPEx evidence fetch/persistence failure. Do not infer which one without row-level evidence.
6. Seek an existing read-only durable endpoint/artifact that exposes persisted row-level market/source provenance and `trade_research_days.market_json`/Top5. If unavailable, keep TPEx cause and `未分類` frequency UNKNOWN rather than reconstructing or changing runtime.
7. Structural Top5 membership and semantic-classification quality remain separate; no repair/re-sort/de-dup/raw-tie inference.
8. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; do not retroactively upgrade B-73/B-74 pairs.
9. Do not implement workflow/version logging, validator/helper, shared calendar/cache/date-resolution or source-routing changes on main without the applicable Class B decision.
