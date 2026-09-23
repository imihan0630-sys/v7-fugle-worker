# Research Checkpoint

Checkpoint sequence: B-84.
Updated: 2026-09-24 03:43 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Production/research baseline retained
- Previous verified production/research baseline through B-72 was V8.8.2. Prior deployment commit retained: `12faf559558efe429c6deb93aa9a193a3557968c` (`Deploy V8.9.1 three-pool dashboard`). Repository evidence is not Production readback.
- No newer trusted live Production plan/readback established through B-84. Live plan status remains UNKNOWN.
- Last trusted prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 scheduled health previously verified selectedCount=0, planCount=0, signalCount=0; preserve as formal zero-pick date, not Execution Alpha failure. `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.

## Primary research lane retained
- Root funnel: `universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
- 2026-09-16: 1,873 scanned -> 3 selected. 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 liquidity rejects, 335 no A/B formation, 71 RR<2.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; evidence-coverage gap, not proof gate is wrong. B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only.
- Signal observation != brokerage fill. Confirmed fills/reduced shares remain UNKNOWN absent trusted reconciliation.

## Retained readiness/control findings
- Legacy counterfactual null horizons conflate provenance failures with immature outcomes; missing remains UNKNOWN.
- R01 uses frozen priorHigh20 + future 3-close hold/fail; R05 next-day Overnight/Intraday; R07/R08 same-date medians of residualSectorRs20 and volumeTodayVsPrev5. No new thresholds/windows/composites.
- `readShadowCounterfactualResearch()` may read up to 5000 Shadow rows but exposes only last 80 row-level recentOutcomes; never treat 80 as full archive.
- BROAD_CONTROL is deterministic eligible-survivor control, max 6 GENERAL + 6 THOUSAND, not full-universe random control. Durable pool + scan-time industry exist; immutable listing venue remains UNKNOWN. B-67/B-68 semantics frozen.
- Zero-pick formal dates are expected denominator dates. Prospective expected dates are `scan_date >= 2026-09-21` rows present in `v8_trade_journal_days`, regardless of selected_count/status/regime/research-row presence.
- Stored MIXED alone never proves complete regime inputs. Regime readiness is PROVEN_COMPLETE only when persisted `marketReturn20` and `aboveMa20Pct` are finite.
- Top5 set-membership readiness is YES only when persisted `topSectors` has at least five unique non-empty industry names; insufficient parseable list = NO; absent/non-array/malformed = UNKNOWN. Ordering readiness is separate.

## B-73 to B-75 retained — isolated offline R03/R06 sequence readiness helper
- Branch `research/b73-r03-r06-sequence-readiness` remains isolated; no Worker import, DB query, runtime route, threshold, alpha calculation, or formal-selection wiring.
- B-73 created supplied-row readiness helper and falsification fixtures; B-74 rejected journal adjacency as proof of exchange-session adjacency; B-75 surfaces duplicate journal dates as one observation plus `DUPLICATE_DATE_ANOMALY`.
- Branch head `0277b0fb1e8a82fbd7ca8d77f9883d64d375d3b0`; helper blob `6e1228a6f8cf2547628c7d3459cd453efc9eeb9f`; test blob `437d31d8e396551decf5541869d2a407baf313c2`.
- Test status remains **SOURCE_WRITTEN_NOT_EXECUTED**; no PASS claimed.

## B-76 to B-82 retained — calendar/session provenance and deployment coupling
- Current source has a trading-calendar subsystem, but journal-row adjacency is not exchange-session adjacency and pair-specific PIT provenance is not durable in readiness rows.
- `v8_trade_journal_days.scan_date` and `trade_research_days.scan_date` are PRIMARY KEY contracts with UPSERT; plan/snapshot uniqueness is `(scan_date,symbol)`. Duplicate fixtures remain corruption/contract guards.
- Authoritative TPEx/TWSE 2026 calendars agree on directly compared exchange-wide closures including 2026-09-25 and 2026-09-28; this does not establish listing venue, historical-year parity, or security-specific halt semantics.
- Main `Worker.js` hard-codes 2026 closures without source/capture/vintage/scope metadata; non-embedded years persist only `{year,holidays}`. Existing persistence cannot prove pair-specific PIT session provenance. Shared calendar/runtime changes remain Class B proposal-first.
- Prospective-only immutable calendar provenance contract remains frozen; existing pairs remain UNKNOWN; no backfill.
- `.github/workflows/v7-cloudflare.yml` triggers Production deployment on main changes to `research/**` and ordinary `tests/**`; the one excluded quality-source diagnostic is not a loophole. No purpose-fit non-deploy-triggered harness was proven. Validator implementation remains stopped at contract; workflow-path changes are Class B proposal-first.

## B-83 retained — Top5 ordering provenance
- `topSectors` is PIT-derived at scan time, but prior audit found no explicit secondary tie-break in the persisted ordering rule and missing/non-finite sector score can collapse to 0.
- Keep separate readiness dimensions: `TOP5_SET_MEMBERSHIP` versus `TOP5_ORDERING`. R03 overlap is a set operation, but a true tie across the 5th/6th boundary can change set membership.
- No retrospective tie-breaker is permitted.

## B-84 — sectorStats producer / raw-vs-rounded tie audit
### Repository evidence
- Re-read governance/worklist/checkpoint and current main. Immediately before write checkpoint blob remained `056a3f452ffa48013a927ffdae043156aac549c1` (B-83), so no concurrent newer checkpoint had to be merged.
- `buildTodaySectorStats(rows, features)` builds `groups` by iterating the supplied `rows` in their existing order. A sector key is inserted on its **first encountered stock**: `(groups[key] ||= []).push(row)`. It later creates `raw = Object.entries(groups)...` and writes `output[item.industry] = item` in that same group-entry order. There is no explicit industry sort in this producer.
- The sector score itself is computed from scan-time values as `amount/maxAmount*45 + breadth*0.3 + clamp(avgChange*5+15,0,25)` and retained in `sectorStats` at full JS numeric precision; it is not rounded inside `buildTodaySectorStats`.
- `normalizeClosingPayload()` preserves the official payload row order (`source.map(...).filter(Boolean)`) and validates count/duplicate symbols, but does not impose a stable symbol/industry sort. `buildMarketRowsFromHistoryCache()` iterates a Set assembled from object-key sources and likewise does not define an industry ordering contract.
- Therefore sector object insertion order is reproducible only insofar as upstream source/object enumeration order is reproducible; the repository does **not** establish it as an explicit stable semantic tie-break contract.
- Separate downstream diagnostic `buildConditionDistribution()` demonstrates an important distinction: it rounds sector score to 1 decimal **before** sorting its diagnostic `topSectors`, so equal displayed/diagnostic scores can be rounding ties. This is not proof that the persisted research-market Top5 writer used rounded values for its original sort.

### Falsification / interpretation
- Hypothesis “sectorStats insertion order is an explicit deterministic tie-break provenance” is **not supported**. It is an incidental consequence of upstream row/object order, not a durable ranking rule.
- A displayed/persisted rounded-score tie must not automatically be called a raw-score tie. The producer computes full-precision scores, so two sectors that both display e.g. 71.2 may still have had distinct raw scores at sort time.
- Conversely, if only rounded persisted scores/ranks survive and raw pre-sort scores are not durably saved, historical exact raw-tie status is UNKNOWN. Do not reconstruct it from current market data and do not invent alphabetical/breadth/amount tie-breaks.
- For R03 Top5 set interpretation, an apparent 5th/6th rounded tie is therefore a **provenance ambiguity**, not proof of unstable membership. Only a proven raw-score equality at the boundary would establish a true score tie; absent raw durable evidence, classify boundary tie provenance UNKNOWN.

### Rank contract audit direction
- `topSectors.rank` remains evidence only if rank values are finite positive integers, unique, and consistent with persisted array position. Missing/duplicate/malformed rank or disagreement with array position => `TOP5_ORDERING=UNKNOWN/DATA_QUALITY`; it must not automatically invalidate the independently usable five-name set.
- No code/schema/runtime change was made this round because the task is source-contract falsification. Engineering class: research analysis only (Class A evidence), no deployment.

### Bias / safety audit
- PIT/look-ahead: no current sector data backfilled; only writer/normalizer contracts were inspected.
- Selection/data-snooping: no sector selected/removed by future outcome; no tie-break parameter search.
- Factor Zoo/overfit/redundancy/transaction cost: no factor, threshold, score, experiment or trading rule added.
- Coverage/zero-pick/date clustering unchanged. Market-source bias not converted into a venue inference.
- R03/R06 impact: improves readiness semantics only; does not assert or falsify Alpha. I01-I07 unchanged.
- Formal Core, Worker, storage, Cron, dashboard, monitoring and push unchanged; no Production deployment.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Continue R03/R06 source-contract audit without code changes: locate the **actual persisted research-market `topSectors` writer** and determine whether it sorts on full-precision `sectorStats.score` and only rounds for persistence, or rounds before sorting. Do not infer this from `buildConditionDistribution()`, which is a separate diagnostic path.
4. Audit persisted `topSectors.rank`: malformed/duplicate/missing ranks and array-position disagreement must remain DATA_QUALITY/UNKNOWN for ordering while set-membership stays independently assessed. Determine whether writer always assigns `rank=index+1` after final sort and whether consumer trusts array order or rank.
5. If raw full-precision score is not persisted, freeze historical raw-tie status as UNKNOWN; do not add a tie-breaker or historical backfill.
6. Preserve B-81/B-82 deployment-coupling evidence; do not implement validator/helper on main merely because it is research-only. Any workflow-path change remains Class B proposal-first.
7. Do not modify shared calendar runtime/cache/date resolution; do not retroactively upgrade B-73/B-74 pairs; no historical Shadow/calendar backfill.
8. If exact-source execution becomes available, verify B-73 branch exact head/blobs before test; only exit 0 + fixture PASS may upgrade SOURCE_WRITTEN_NOT_EXECUTED.
9. Keep B-62 proposal-only; do not repeat listing-venue discovery. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
