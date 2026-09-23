# Research Checkpoint

Checkpoint sequence: B-91.
Updated: 2026-09-24 06:40 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-90 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Baseline retained
- Latest owner-approved production architecture is 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid remains Shadow-only and cannot become a Formal BUY/push source.
- Trusted deployment evidence retained from B-90: V8.9.1 production readback exactly `8.9.1-three-pool-dashboard`; V8.9.0/V8.9.1 deploy/regression runs succeeded. This is not permission for further autonomous Formal Core changes.
- Public web readback attempted again in B-91 for `/api/version` and `/api/strategy-pool-performance`; this tool could not access the Worker host. No newer trusted formal scan/plan was established, so current newer-plan status remains UNKNOWN rather than inferred from repository state.
- Last trusted prospective Shadow evidence retained: 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 remains a formal zero-pick date; `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill.
- B-73..B-75 isolated sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency is not exchange-session adjacency; no historical calendar/Shadow backfill.
- Deployment coupling from B-81/B-82 remains: no purpose-fit non-deploy-triggered research harness proven; workflow-path changes are Class B proposal-first.

## Top5 provenance retained through B-90
- `buildResearchMarketContext(...)` sorts available full-precision `sectorStats.score` descending, slices Top20, then persists rounded score/breadth/avgChange and assigns `rank=index+1` after sorting.
- No explicit secondary tie-break exists. Exact raw-score ties inherit incidental upstream insertion order, not a durable semantic tie-break. Raw pre-round score is not separately durable; historical raw-tie status remains UNKNOWN.
- R03/R06 consumer takes `(market.topSectors||[]).slice(0,5)` and uses array names; persisted rank is an integrity check, not a repair source.
- V8.7.0 formal persistence serializes `researchMarket` directly to `trade_research_days.market_json`; current-snapshot backfill is semantically different. No visible V8.7.2..V8.8.1 migration rewrite was found, but row-level origin remains unresolved.
- `TOP5_SET_MEMBERSHIP` requires parseable market JSON, at least five entries, and five unique non-empty first-five industry names. Rank/score defects alone do not erase an otherwise valid five-name set.
- `TOP5_ORDERING` is stricter: membership prerequisites plus valid rank-position integrity and sufficient score/tie provenance. Persisted score zero is ambiguous because writer uses `round(toNumber(score)||0,2)`; exact raw ties cannot be reconstructed.
- No repair/re-sort/de-dup/backfill is allowed. Malformed evidence remains UNKNOWN/DATA_QUALITY_BLOCKED.
- B-90 proved `/api/research/backfill-current` actually ran for 2026-09-18 in GitHub Actions run `35494708153`, step 45 SUCCESS, returning `scanDate=2026-09-18`, `imported=3`, `noPlanChanges=true`, `noPush=true`, `noTrade=true`; immediate coverage was total=3/full=0/partial=3.
- Freeze `BACKFILL_CURRENT_INVOCATION(2026-09-18)=PROVEN`, but `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`: day rows are UPSERT-able and inspected schema/market JSON has no immutable original-vs-reconstructed row-origin field.
- B-90 also falsified normal full-formal empty industry-key production from missing source industry: `buildTodaySectorStats` uses `row.industry || "未分類"`, so null/undefined/empty source industry becomes the non-empty bucket `未分類` before `sectorStats`/Top5 construction.

## B-91 — `未分類` semantic-quality boundary + provenance non-upgrade
### Evidence / interpretation
- Re-read governance, worklist and latest B-90 checkpoint before continuing; checkpoint blob SHA immediately before this write was `6d66607bbcda39130c3dc4b2fb510ee30d9ca94d`. Latest checkpoint commit observed was `791ac000a7f3991fc6a7439496ecf3be92ef0f9b`.
- B-90 source proof is sufficient to distinguish **structural missingness** from **semantic coarseness**: `未分類` is a deliberately non-empty fallback bucket created by the normal sector-stat path, not an empty/missing industry name.
- Therefore freeze: `未分類` participation does **not** by itself fail the five-unique-non-empty-name structural contract. If the first five names are otherwise unique/non-empty, `TOP5_SET_MEMBERSHIP` need not be DATA_QUALITY_BLOCKED merely because one name is `未分類`.
- However, `未分類` aggregates securities whose source industry classification is absent/falsey. It is not evidence of a coherent economic sector. Any R03/R06 interpretation that treats it as a normal named sector carries a separate semantic-quality limitation.
- New diagnostic distinction (research interpretation only, no code): `TOP5_STRUCTURAL_MEMBERSHIP` may remain structurally valid while `TOP5_SEMANTIC_CLASSIFICATION_QUALITY=COARSE_OR_UNKNOWN` when `未分類` is present. Do not coerce this to BAD/0, and do not silently drop `未分類` from the set or denominator.
- This avoids two opposite errors: (a) falsely declaring missing data and shrinking coverage just because the writer uses an explicit fallback label; (b) falsely treating the fallback bucket as economically equivalent to a genuine industry classification.
- No threshold is introduced for how much `未分類` is acceptable. Such a threshold would be a new experiment/parameter and risks data snooping. Prospective evidence should first measure occurrence/coverage before any proposal.

### 2026-09-18 row-origin continuation
- Re-checked the proven V8.7.0 backfill job evidence: the deploy job completed successfully and step 45 `Backfill current formal research snapshot` was SUCCESS. This reinforces invocation provenance but does not provide immutable current-row origin.
- A complete durable later-writer exclusion proof was not established in this turn. The public Worker readback was inaccessible through the available web reader, and GitHub job evidence alone cannot prove that no later same-date UPSERT occurred.
- Therefore retain `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`. Do not infer current origin from timestamps, deployment chronology, or the fact that the backfill invocation is proven.

### Falsification / bias / safety
- Falsified interpretation: `未分類` must not automatically be classified as structurally missing/invalid Top5 membership.
- Counter-risk retained: `未分類` must not automatically be interpreted as a coherent economic sector either.
- PIT/look-ahead: no historical market/sector values reconstructed; no date-based row-origin guessing.
- Selection bias/data snooping/Factor Zoo/overfit: no factor, threshold, score, tie-break, window, experiment or denominator exclusion added.
- Coverage: `未分類` stays visible in coverage rather than being silently removed. Zero-pick/date clustering/transaction costs/market-source bias unchanged.
- R03/R06: interpretation quality tightened only; no alpha/readiness upgrade. R01/R02/R04/R05/R07/R08 and I01-I07 unchanged.
- Engineering classification: research/data-contract audit only. No Worker, D1/KV schema, workflow, dashboard, formal selection, monitoring, notification or Production deployment changed.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. R03/R06: keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` unless complete durable evidence proves a later writer did or did not overwrite the day row. Do not infer origin from chronology alone.
4. Quantify prospectively, from already-persisted supplied rows only, whether `未分類` appears in Top5 and how often; preserve it in structural membership while separately reporting semantic-classification quality. Do not create a threshold or drop such dates.
5. Freeze malformed rules: five unique non-empty names required for structural Top5 set membership; rank/score/tie defects separately block ordering. Historical raw-tie status stays UNKNOWN.
6. Do not implement validator/helper on main; workflow-path change remains Class B proposal-first.
7. Do not modify shared calendar runtime/cache/date resolution or retroactively upgrade B-73/B-74 pairs. B-73 tests may upgrade only after exact branch/head/blob verification and actual exit-0 fixture PASS.
8. Keep B-62 proposal-only; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
