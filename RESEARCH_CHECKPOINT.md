# Research Checkpoint

Checkpoint sequence: B-87.
Updated: 2026-09-24 05:14 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-86 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Baseline retained
- No newer trusted live Production plan/readback established through B-87. Live plan status remains UNKNOWN.
- Last trusted prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 remains a formal zero-pick date; `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill.
- B-73..B-75 isolated sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency is not exchange-session adjacency; no historical calendar/Shadow backfill.
- Deployment coupling from B-81/B-82 remains: no purpose-fit non-deploy-triggered research harness proven; workflow-path changes are Class B proposal-first.

## Top5 provenance retained through B-86
- `buildResearchMarketContext(...)` sorts available full-precision `sectorStats.score` descending, slices Top20, then persists rounded score/breadth/avgChange and assigns `rank=index+1` after sorting.
- No explicit secondary tie-break exists. Exact raw-score ties inherit incidental upstream insertion order, not a durable semantic tie-break.
- Raw pre-round score is not separately durable in `market_json`; historical raw-tie status remains UNKNOWN.
- Current R03/R06 consumer takes `(market.topSectors||[]).slice(0,5)` and uses array names; it does not re-sort by persisted rank. Rank is an integrity check, not a repair source.
- V8.7.0 formal persistence serializes `researchMarket` directly to `trade_research_days.market_json` without a second sort/re-rank. Its current-snapshot backfill path is semantically different and must not be assumed equivalent to original full-formal-scan provenance.

## B-87 — post-V8.8.1 rewrite audit
### Evidence
- Re-read governance/worklist/B-86 and latest main. Main head before this write was `ee792eb9cdc90f87f07ba9c790e4ef92e6345b95` (B-86 checkpoint).
- GitHub path history shows current `Worker.js` blob `e6b0fc496b49feba9bb74239e172aef95a907dfa` is unchanged from commit `1dea5e88bff742144ac1699bdd0c9435c6902c86` (V8.8.1 redeploy baseline) through current main.
- Compare `1dea5e88...main` reports 181 commits but no `Worker.js` file delta. Post-baseline runtime evolution is represented by patch scripts/workflow/test/research files rather than a committed changed Worker blob.
- Inspected `scripts/apply_v8_9_0.py`: it patches Worker for the three-pool Hybrid Shadow architecture and creates/uses `v9_strategy_pool_plans`; no `trade_research_days` / `market_json` rewrite was found in the inspected script response.
- Inspected `scripts/apply_v8_9_1.py`: it adds three-pool dashboard/performance readers over `v9_strategy_pool_plans` and history cache; no `trade_research_days` / `market_json` rewrite was found in the inspected script response.
- Code-search index returned no `trade_research_days market_json` hit, but per checkpoint rule this absence is **not** treated as proof because code-search misses can be incomplete.
- Therefore the narrower claim “V8.9.0/V8.9.1 scripts visibly rewrite `trade_research_days.market_json`” is not supported by inspected source; however the full V8.7.2..V8.8.1 migration interval is not yet exhaustively source-audited and remains UNKNOWN.

### Falsification / interpretation
- The hypothesis that every later version necessarily reorders Top5 during persistence is weakened: no such rewrite is visible in the audited V8.9.0/V8.9.1 patch scripts.
- The stronger hypothesis that all historical research-day rows preserve original formal-scan semantics is still **not proven**. V8.7.2..V8.8.1 and any executed migration/backfill path before the V8.8.1 baseline still require exact audit.
- Do not infer historical provenance from current Worker blob identity alone; patch scripts may have been applied in deployment without committing the resulting Worker source.

### Bias / safety
- PIT/look-ahead: source/path audit only; no historical values reconstructed.
- Selection bias/data snooping/Factor Zoo: no factor, threshold, window, tie-break or outcome-driven rule added.
- Market-source/coverage/zero-pick/date-cluster semantics unchanged; missing migration provenance remains UNKNOWN.
- No Worker, D1/KV schema, workflow, dashboard, formal selection, monitoring, notification or Production deployment changed in this run.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Continue migration audit **without code changes**: identify exact commits/scripts for V8.7.2 through V8.8.1 and inspect for `trade_research_days`, `market_json`, `researchMarketContext`, backfill/reconstruction, UPDATE/UPSERT, or schema/migration logic. Do not infer absence from code-search misses or current Worker identity.
4. Audit malformed Top5 boundary: duplicate/empty industry names, fewer than five unique names, malformed rank, rank/position mismatch, null/non-finite score and writer `toNumber(score)||0` coercion. Preserve `TOP5_SET_MEMBERSHIP` vs `TOP5_ORDERING`; no new threshold.
5. Historical raw-tie status stays UNKNOWN; no tie-breaker or backfill.
6. Do not implement validator/helper on main; workflow-path change remains Class B proposal-first.
7. Do not modify shared calendar runtime/cache/date resolution or retroactively upgrade B-73/B-74 pairs.
8. B-73 tests may upgrade only after exact branch/head/blob verification and actual exit-0 fixture PASS.
9. Keep B-62 proposal-only; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
