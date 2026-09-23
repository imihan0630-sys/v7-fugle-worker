# Research Checkpoint

Checkpoint sequence: B-90.
Updated: 2026-09-24 06:19 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-88 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Baseline retained
- No newer trusted live Production plan/readback established through B-89. Live plan status remains UNKNOWN.
- Last trusted prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 remains a formal zero-pick date; `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill.
- B-73..B-75 isolated sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency is not exchange-session adjacency; no historical calendar/Shadow backfill.
- Deployment coupling from B-81/B-82 remains: no purpose-fit non-deploy-triggered research harness proven; workflow-path changes are Class B proposal-first.

## Top5 provenance retained through B-88
- `buildResearchMarketContext(...)` sorts available full-precision `sectorStats.score` descending, slices Top20, then persists rounded score/breadth/avgChange and assigns `rank=index+1` after sorting.
- No explicit secondary tie-break exists. Exact raw-score ties inherit incidental upstream insertion order, not a durable semantic tie-break.
- Raw pre-round score is not separately durable in `market_json`; historical raw-tie status remains UNKNOWN.
- Current R03/R06 consumer takes `(market.topSectors||[]).slice(0,5)` and uses array names; it does not re-sort by persisted rank. Rank is an integrity check, not a repair source.
- V8.7.0 formal persistence serializes `researchMarket` directly to `trade_research_days.market_json` without a second sort/re-rank. Its current-snapshot backfill path is semantically different and must not be assumed equivalent to original full-formal-scan provenance.
- B-88 found no visible V8.7.2..V8.8.1 migration rewrite of `trade_research_days.market_json`; later-migration rewrite risk is materially reduced but row-level origin remains unresolved.

## B-89 — malformed Top5 boundary + row-origin audit
### Evidence
- Re-read governance/worklist/B-88 and latest main. Latest main before this write was B-88 commit `602983d45fbff06d57b442491fe6f761a565f5d1`; checkpoint blob SHA was `1d4bda8dcece5411b1a8fba25dfd2dcd3d93dec5` immediately before write.
- Re-inspected V8.7.0 writer/source rather than relying on search misses. `buildResearchMarketContext` builds `topSectors` from `Object.entries(sectorStats||{})`, sorts by `(toNumber(score)||0)` descending, slices 20, and persists `{rank:index+1, industry, score:round(toNumber(score)||0,2), ...}`.
- Because `sectorStats` is an object, duplicate exact object keys cannot coexist at this writer boundary. This materially weakens duplicate-industry risk for rows produced directly by this function, but it does not prove arbitrary/migrated/corrupt persisted JSON cannot contain duplicates.
- Empty-string industry is not explicitly rejected by `buildResearchMarketContext`; if upstream `sectorStats` contains an empty key, it can enter Top20/Top5. Therefore empty-name membership is a real data-quality blocker unless upstream provenance proves impossibility.
- Fewer than five `topSectors` entries, or fewer than five unique non-empty industry names after parsing, cannot support a five-sector set. `TOP5_SET_MEMBERSHIP=UNKNOWN/DATA_QUALITY_BLOCKED`; do not shrink the denominator and call it Top5.
- `rank` is assigned as `index+1` by the writer. For a row claiming original writer provenance, missing/non-positive/non-integer/duplicate rank or rank != array position is a persistence/integrity anomaly. It invalidates `TOP5_ORDERING`; it does not by itself erase otherwise five unique non-empty industry names for set-membership overlap.
- Persisted `score` is produced with `round(toNumber(stat?.score)||0,2)`. Thus null/non-finite/unparseable raw score and genuine raw zero are collapsed to persisted `0`. A persisted zero cannot prove the original raw score was valid zero. This blocks score/order provenance where that distinction matters, but name-only set membership may remain structurally usable if the five names themselves are valid.
- Exact raw ties remain unknowable after persistence because full-precision raw score is not stored. Rounded equal scores also cannot prove raw equality. Consequently ordering stays UNKNOWN when interpretation depends on tie provenance, especially around the Top5/Top6 boundary.
- V8.7.0 `backfillCurrentResearchSnapshots` explicitly marks each reconstructed **snapshot** `sourceCompleteness="PARTIAL_CURRENT_SCAN_RECONSTRUCTION"`, but its subsequent UPSERT into `trade_research_days` writes only `scan_date, market_json, sectors_json, created_at, updated_at`. The reconstructed `marketContext` itself does not receive an origin/sourceCompleteness marker before serialization.
- The formal writer uses the same `trade_research_days` columns and also serializes a `researchMarket` object without a row-origin field. Therefore no durable field in the inspected `trade_research_days` schema/market JSON distinguishes original full-formal-scan market rows from V8.7.0 current-snapshot reconstructed market rows.
- `created_at`/`updated_at` are timestamps of row persistence/update, not a semantic origin marker. Date or timestamp inference is insufficient and must not be used to label a row original vs reconstructed.

### Malformed-boundary interpretation
- `TOP5_SET_MEMBERSHIP` requires at minimum: parseable market JSON, array-like Top5 source, at least five entries, and the first five names all non-empty and unique. Rank/score defects alone do not automatically destroy the name set.
- `TOP5_ORDERING` is stricter: membership prerequisites plus valid rank/position integrity and sufficient score provenance. Missing/malformed rank, rank-position mismatch, persisted-score coercion ambiguity, or unresolved tie provenance keeps ordering UNKNOWN.
- Duplicate names in persisted JSON are a corruption/contract anomaly even though direct object-key writer construction makes normal duplicate production unlikely. They block five-name set membership if the first five no longer contain five unique industries.
- No repair/re-sort/de-dup/backfill is allowed. Malformed evidence remains UNKNOWN/DATA_QUALITY_BLOCKED rather than being silently normalized.

### Falsification / bias / safety
- Positive hypothesis falsified: `trade_research_days` does **not** carry a durable original-vs-reconstructed row-origin marker in the inspected V8.7.0 schema/writers. Row origin therefore remains UNKNOWN unless independent durable evidence is found.
- Alternative mechanism checked: snapshot-level `sourceCompleteness` exists, but it is not sufficient to label the day-level market row because the day row can be overwritten independently and has no foreign-keyed origin/vintage contract tying it to a particular snapshot write.
- PIT/look-ahead: no historical reconstruction or date-based guessing performed.
- Selection bias/data snooping/Factor Zoo/overfit: no factor, threshold, experiment, tie-break, score or window added.
- Coverage/zero-pick/date clustering/transaction costs/market-source bias unchanged. Defective rows reduce interpretable coverage; they must not be dropped silently from denominators.
- R03/R06: structural interpretation tightened only; no alpha/readiness upgrade. R01/R02/R04/R05/R07/R08 and I01-I07 unchanged.
- Engineering classification: source/data-contract audit only. No Worker, D1/KV schema, workflow, dashboard, formal selection, monitoring, notification or Production deployment changed.

## Production engineering note — owner-approved 3+3+3 architecture (2026-09-23/24)
- Owner explicitly approved changing the production strategy architecture to **3+3+3** while keeping Formal thousand and Hybrid selection logic intentionally different.
- Pool A `FORMAL_GENERAL`: price < 1,000, 0~3 names, no padding. Pool B `FORMAL_THOUSAND`: price >= 1,000, 0~3 names, no padding. Pool C `HYBRID_THOUSAND_SHADOW`: price >= 1,000, 0~3 names, no padding.
- Each pool has a ring-fenced **NT$200,000** strategy/research capital budget; capital does not cross pools.
- Formal General/Thousand keep the existing Formal A/B core. Hybrid is independent and does not reuse Formal `scoreCandidate()` or `strategySetupState()`; it uses fundamental quality + persistent Smart Money + early price acceptance + overheat guard + >=10% verifiable remaining upside.
- A symbol may appear in both Formal Thousand and Hybrid. Cross-pool duplication is preserved as convergence evidence only; it must not auto-upgrade signal grade, position size, BUY status or ADD.
- Hybrid remains **Shadow-only**: visible and archived, but not written into Formal STOCK_CONFIG and not a Formal BUY/push source.
- V8.9.0 added the three-pool selection/archive layer and per-pool capital semantics. V8.9.1 added the read-only `/pools` dashboard plus `/api/strategy-pool-performance` for prospective D1/D3/D5/latest selection tracking by pool.
- No historical Hybrid selections may be fabricated. Pool performance must accrue prospectively from persisted selections; selection performance is not realized BUY→SELL trade win rate.
- Verified deployment evidence: V8.9.0 workflow run `35870357514` SUCCESS; V8.9.1 workflow run `35871427600` SUCCESS; V8.9.1 regression run `35871427866` SUCCESS. Production readback observed exactly `8.9.1-three-pool-dashboard`; research firewall remained valid with `formalCoreImpact:false`.
- V8.8.2 mandatory zero-selection daily push acceptance semantics remain preserved underneath the patch stack.
- This note is a record of an **owner-approved production change**, not permission for future autonomous Formal Core changes. The governance lock above remains in force for any further rule/threshold/capital/entry-exit modifications.

## B-90 — independent backfill provenance + normal industry-key proof
### Independent durable evidence for /api/research/backfill-current
- Git history contains exactly one commit in the inspected range with the trigger tag `[research-backfill-current]`: commit `25c15918fe598fca33feecd474109932b062e276` (`V8.7.0: research data layer and validation [research-backfill-current]`), committed 2026-09-20 06:37:22Z.
- GitHub Actions run `35494708153` (`V8 Cloudflare Deploy`) completed SUCCESS. Step 45 `Backfill current formal research snapshot` completed SUCCESS.
- Durable job logs show the route was actually called and returned:
  - `{"ok":true,"scanDate":"2026-09-18","imported":3,"noPlanChanges":true,"noPush":true,"noTrade":true}`
  - immediate dashboard readback: `snapshotCoverage.total=3, full=0, partial=3, distinctDates=1`.
- Therefore freeze: `BACKFILL_CURRENT_INVOCATION(2026-09-18)=PROVEN` and the route did write partial-current reconstruction evidence for that scan date at that time.
- This does **not** by itself prove the current persisted `trade_research_days` row for 2026-09-18 is still backfill-origin, because the same day row is UPSERT-able by later writers. Without a row-linked immutable write-origin/version field or a complete later-writer exclusion proof, `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`.
- Action logs are valid independent evidence of route execution and scan-date targeting; they are not sufficient to infer current row origin after possible later overwrites.

### Empty industry-key hypothesis narrowed
- Base source `buildTodaySectorStats(rows,features)` groups with `const key = row.industry || "未分類"`.
- Therefore null/undefined/empty-string industry values in normal todayRows are normalized to the non-empty key `未分類` before `sectorStats` is created.
- `buildResearchMarketContext(...,sectorStats,...)` derives `topSectors` from `Object.entries(sectorStats)`; for the normal full-formal-scan writer path, an empty-string Top5 industry name is therefore not producible from an empty/null source industry through this code path.
- Freeze: `NORMAL_FORMAL_EMPTY_TOPSECTOR_NAME_FROM_SOURCE_INDUSTRY=FALSIFIED`.
- Keep the malformed-data rule for arbitrary persisted JSON: migrated/corrupt/manual rows may still contain empty names, so validators must continue to treat empty names as DATA_QUALITY_BLOCKED rather than silently normalizing historical persisted evidence.
- `未分類` is a valid non-empty bucket label, not an empty-name failure. It may still be analytically coarse, but that is a separate semantic-quality issue and must not be reclassified as missing data.

### Bias / safety
- No present-day market/sector values were used to backfill historical evidence.
- No factor, threshold, tie-break, score, window, Formal selection rule, monitoring or push behavior changed.
- This is provenance/source-contract research only; no Worker/schema/workflow/runtime deployment performed in B-90.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. For R03/R06, continue from B-90: identify whether any later writer can be proven to have overwritten `trade_research_days(scan_date=2026-09-18)` after the proven backfill invocation. If a complete durable later-writer audit cannot exclude overwrite, keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`.
4. Treat normal full-formal empty industry-key production as falsified by `row.industry || "未分類"`; next inspect whether `未分類` participation in Top5 should remain structurally valid for set membership while separately flagged as semantic-quality coarse/unknown.
5. Freeze malformed rules from B-89: five unique non-empty names are required for Top5 set membership; rank/score/tie defects can separately block ordering. Do not introduce a repair, threshold, secondary tie-break or historical backfill.
6. Historical raw-tie status stays UNKNOWN.
7. Do not implement validator/helper on main; workflow-path change remains Class B proposal-first.
8. Do not modify shared calendar runtime/cache/date resolution or retroactively upgrade B-73/B-74 pairs.
9. B-73 tests may upgrade only after exact branch/head/blob verification and actual exit-0 fixture PASS.
10. Keep B-62 proposal-only; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
