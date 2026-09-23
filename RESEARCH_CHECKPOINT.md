# Research Checkpoint

Checkpoint sequence: B-88.
Updated: 2026-09-24 05:40 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-87 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Baseline retained
- No newer trusted live Production plan/readback established through B-88. Live plan status remains UNKNOWN.
- Last trusted prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 remains a formal zero-pick date; `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill.
- B-73..B-75 isolated sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency is not exchange-session adjacency; no historical calendar/Shadow backfill.
- Deployment coupling from B-81/B-82 remains: no purpose-fit non-deploy-triggered research harness proven; workflow-path changes are Class B proposal-first.

## Top5 provenance retained through B-87
- `buildResearchMarketContext(...)` sorts available full-precision `sectorStats.score` descending, slices Top20, then persists rounded score/breadth/avgChange and assigns `rank=index+1` after sorting.
- No explicit secondary tie-break exists. Exact raw-score ties inherit incidental upstream insertion order, not a durable semantic tie-break.
- Raw pre-round score is not separately durable in `market_json`; historical raw-tie status remains UNKNOWN.
- Current R03/R06 consumer takes `(market.topSectors||[]).slice(0,5)` and uses array names; it does not re-sort by persisted rank. Rank is an integrity check, not a repair source.
- V8.7.0 formal persistence serializes `researchMarket` directly to `trade_research_days.market_json` without a second sort/re-rank. Its current-snapshot backfill path is semantically different and must not be assumed equivalent to original full-formal-scan provenance.
- B-87 found no visible `trade_research_days.market_json` rewrite in audited V8.9.0/V8.9.1 patch scripts; current Worker blob identity alone is not historical provenance proof.

## B-88 — V8.7.2 through V8.8.1 migration rewrite audit
### Evidence
- Re-read governance/worklist/B-87 and latest main. Main head before this write was `e94fb5f3d77e53a17a6f0e078d0df080563fe5fb` (B-87 checkpoint); checkpoint blob SHA before write was `2dfd151b02ef27f3aacf1b3a49ef30b3c501015a`.
- Identified exact release commits from Git history: V8.7.2 `5d019778...`, V8.7.3 `8c033b94...`, V8.7.4 `6a5ee7b3...`, V8.7.5 `c4c0b348...`, V8.7.6 `dbef65fa...`, V8.7.7 `50a16a01...`, V8.7.8 `e025c317...`, V8.7.9 `1e087728...`, V8.7.10 `c6a4ce34...`, V8.7.11 `5075c3c5...`, V8.7.12 `1de974e3...`, V8.7.13 `6a3787fa...` plus follow-up fixes, V8.8.0 `e9fe3c94...`; V8.8.1 patch source is `scripts/apply_v8_8_1.py` and B-87 retained its redeploy baseline `1dea5e88...`.
- Inspected `scripts/apply_v8_7_3.py` through `apply_v8_7_8.py`: changes are validation/counterfactual/governance/anti-overfit/incremental/date-cluster diagnostics and dashboard wiring. No `trade_research_days` / `market_json` write, UPDATE, UPSERT or reconstruction logic appears in these full script contents.
- Inspected `scripts/apply_v8_7_9.py`: it adds `trade_research_external_evidence`, captures official research evidence, attaches it to Shadow outcomes, and extends dashboard diagnostics. It does not rewrite `trade_research_days.market_json`.
- Inspected `scripts/apply_v8_7_10.py` and `apply_v8_7_11.py`: readiness/cross-market evidence reader/collector changes only; no research-day market rewrite.
- Inspected `scripts/apply_v8_7_12.py` and `apply_v8_7_13.py`: after-market schedule and Slack/current-plan recovery changes; no research-day market rewrite.
- Inspected `scripts/apply_v8_8_0.py`: creates prospective `trade_research_execution_snapshots` and records monitoring-time execution evidence after formal signal/push/live-state processing; it does not update `trade_research_days` or `market_json`.
- Inspected `scripts/apply_v8_8_1.py`: extends execution-shadow quote passthrough/derived fields only; no research-day market rewrite.
- Inspected V8.7.2 release diff/source: it creates/persists prospective Shadow candidate archive and does not show a `trade_research_days.market_json` rewrite in the inspected patch content.
- Therefore, across the inspected V8.7.2..V8.8.1 patch-script interval, no later migration has been found that re-sorts/re-ranks or rewrites persisted `trade_research_days.market_json` after V8.7.0 persistence/backfill semantics.

### Falsification / interpretation
- The specific hypothesis “a V8.7.2..V8.8.1 migration later rewrote persisted research-day market Top5 semantics” is **not supported by the inspected migration sources** and is materially weakened.
- This does **not** prove every historical row is original full-formal-scan PIT evidence. V8.7.0 itself has a current-snapshot backfill/reconstruction semantic distinction already retained above; row-level origin is still required before historical ordering can be called original-scan provenance.
- No code-search miss was used as proof. Conclusions are based on full patch-script inspection plus the V8.7.2 release patch evidence.
- Historical raw-score tie status remains UNKNOWN because full-precision pre-round score was not durably stored; no later migration can restore that missing fact.

### Bias / safety / R01-R08-I01-I07 impact
- Primary impact: R03/R06 provenance uncertainty is narrowed from “possible later migration rewrite” to “row-origin/backfill provenance + malformed-boundary/raw-tie uncertainty.” This improves interpretability but does not upgrade readiness or Alpha evidence.
- R01/R02/R04/R05/R07/R08 and I01-I07 definitions/outcomes unchanged.
- PIT/look-ahead: source audit only; no historical value reconstruction or backfill.
- Selection bias/data snooping/Factor Zoo/overfit: no factor, threshold, experiment, window or tie-break added.
- Market-source bias/coverage/zero-pick/date clustering/transaction-cost semantics unchanged; missing evidence remains UNKNOWN.
- Engineering classification: research/source audit only; no engineering change. No Worker, D1/KV schema, workflow, dashboard, formal selection, monitoring, notification or Production deployment changed.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Stop repeating the V8.7.2..V8.8.1 rewrite audit unless new contradictory source evidence appears. Treat later-migration rewrite risk as materially reduced, but do not equate this with row-level original-scan provenance.
4. Audit malformed Top5 boundary next: duplicate/empty industry names, fewer than five unique names, malformed rank, rank/position mismatch, null/non-finite persisted score, and the writer `toNumber(score)||0` coercion. Separate `TOP5_SET_MEMBERSHIP` from `TOP5_ORDERING`; determine which defects invalidate membership versus ordering only. No new threshold/tie-break.
5. Trace whether any durable field distinguishes V8.7.0 current-snapshot backfill/reconstructed research-day rows from original full-formal-scan rows. If no durable origin marker exists, row origin stays UNKNOWN; do not infer from date alone.
6. Historical raw-tie status stays UNKNOWN; no tie-breaker or backfill.
7. Do not implement validator/helper on main; workflow-path change remains Class B proposal-first.
8. Do not modify shared calendar runtime/cache/date resolution or retroactively upgrade B-73/B-74 pairs.
9. B-73 tests may upgrade only after exact branch/head/blob verification and actual exit-0 fixture PASS.
10. Keep B-62 proposal-only; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
