# Research Checkpoint

Checkpoint sequence: B-86.
Updated: 2026-09-24 04:49 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-85 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Baseline retained
- No newer trusted live Production plan/readback established through B-86. Live plan status remains UNKNOWN.
- Last trusted prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 remains a formal zero-pick date; `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill.
- B-73..B-75 isolated sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency is not exchange-session adjacency; no historical calendar/Shadow backfill.
- Deployment coupling from B-81/B-82 remains: no purpose-fit non-deploy-triggered research harness proven; workflow-path changes are Class B proposal-first.

## Top5 provenance retained through B-85
- `buildResearchMarketContext(...)` sorts available full-precision `sectorStats.score` descending, slices Top20, then persists rounded score/breadth/avgChange and assigns `rank=index+1` after sorting.
- No explicit secondary tie-break exists. Exact raw-score ties inherit incidental upstream insertion order, not a durable semantic tie-break.
- Raw pre-round score is not separately durable in `market_json`; historical raw-tie status remains UNKNOWN.
- Current R03/R06 consumer takes `(market.topSectors||[]).slice(0,5)` and uses array names; it does not re-sort by persisted rank. Rank is an integrity check, not a repair source.
- Keep `TOP5_SET_MEMBERSHIP` separate from `TOP5_ORDERING`.

## B-86 — research-day writer persistence-path audit
### Evidence
- Re-read governance/worklist/B-85 and current main tree. Immediately before this write checkpoint blob remained `afccbf9634fc60ea7b6bcabb4de1fc408852686b`; no concurrent newer checkpoint was observed.
- V8.7.0 formal persistence writes `trade_research_days` after the per-plan snapshot loop. It chooses `researchMarket = diagnostics?.researchMarketContext || list.find(stock=>stock?.researchSnapshot)?.researchSnapshot?.market || {}` and binds `JSON.stringify(researchMarket)` directly into `market_json`.
- That persistence statement performs **no sort, slice, re-rank or score rounding of `topSectors`**. When the source object came from `buildResearchMarketContext(...)`, the already-built Top20 array order/ranks are serialized unchanged.
- The fallback path also serializes the selected stock's `researchSnapshot.market` unchanged; it does not reconstruct ordering.
- V8.7.0 `backfillCurrentResearchSnapshots()` is semantically different: it reconstructs `marketContext=buildResearchMarketContext([],currentRows,...,sectorStats,scanDate)` and UPSERTs it. Therefore a reconstructed research-day row must not automatically be treated as proof of original full-formal-scan market breadth provenance.
- V8.7.1 adds historical price/snapshot provenance, but this run did not obtain sufficient exact-source evidence to prove that **none** of the later V8.7.2..V8.9.1 migrations can rewrite `trade_research_days.market_json`. That remains UNKNOWN rather than guessed closed.

### Falsification / interpretation
- “The V8.7.0 formal research-day writer re-sorts/re-ranks TopSectors during persistence” is **falsified**.
- “Every historical `trade_research_days.market_json` necessarily preserves original full-formal-scan Top20 semantics forever” is **not yet proven** because later migrations/reconstruction paths remain to audit.
- R03 array order should therefore be trusted only after row provenance supports normal formal-writer origin and no later semantic rewrite. Otherwise ordering stays UNKNOWN; never repair from rank.

### Bias / safety
- PIT/look-ahead: source contracts only; no current data used to reconstruct historical Top5.
- No outcome-driven threshold, rank rule, tie-break, factor, window or trading rule added.
- No listing-venue inference or source substitution.
- Coverage/zero-pick/date clustering unchanged; no Alpha conclusion.
- Formal Core, Worker, D1/KV schema, workflow, dashboard, monitoring and push unchanged; no Production deployment.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Continue B-86 **without code changes**: inspect V8.7.2 through V8.9.1 migrations for any `trade_research_days`, `market_json`, `researchMarketContext`, backfill/reconstruction, UPDATE/UPSERT or migration logic that can rewrite research-day semantics. Do not infer absence from code-search index misses.
4. Audit malformed Top5 boundary: duplicate/empty industry names, fewer than five unique names, malformed rank, rank/position mismatch, null/non-finite score and writer `toNumber(score)||0` coercion. Preserve set-membership vs ordering separation; no new threshold.
5. Historical raw-tie status stays UNKNOWN; no tie-breaker or backfill.
6. Do not implement validator/helper on main; workflow-path change remains Class B proposal-first.
7. Do not modify shared calendar runtime/cache/date resolution or retroactively upgrade B-73/B-74 pairs.
8. B-73 tests may upgrade only after exact branch/head/blob verification and actual exit-0 fixture PASS.
9. Keep B-62 proposal-only; do not repeat listing-venue discovery. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
