# Research Checkpoint

Checkpoint sequence: B-85.
Updated: 2026-09-24 04:10 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Production/research baseline retained
- Previous verified production/research baseline through B-72 was V8.8.2. Prior deployment commit retained: `12faf559558efe429c6deb93aa9a193a3557968c` (`Deploy V8.9.1 three-pool dashboard`). Repository evidence is not Production readback.
- No newer trusted live Production plan/readback established through B-85. Live plan status remains UNKNOWN.
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

## B-83/B-84 retained — Top5 ordering provenance
- `topSectors` is PIT-derived at scan time. `buildTodaySectorStats()` retains full-precision JS score, but producer group insertion order is inherited from upstream row/object order and is not an explicit semantic tie-break contract.
- Separate diagnostic `buildConditionDistribution()` rounds before its own diagnostic sort; it must not be used to infer the persisted research-market writer behavior.
- Keep separate readiness dimensions: `TOP5_SET_MEMBERSHIP` versus `TOP5_ORDERING`. R03 overlap is a set operation, but a true tie across the 5th/6th boundary can change set membership.
- No retrospective tie-breaker is permitted. Apparent rounded ties are provenance ambiguity unless raw equality is proven.

## B-85 — actual persisted research-market Top5 writer / rank-consumer audit
### Repository evidence
- Re-read governance/worklist/checkpoint and latest main. Latest main before this write was `a9ddc8ca3107936402c50bb25b58ddc5b3e6c73a` (`research: checkpoint B-84 sector order provenance`). Immediately before write checkpoint blob remained `9af1b2ce1c420987fa93aa03f8062af264d25cc2` (B-84); no concurrent newer checkpoint required merge.
- The actual research-market writer is introduced by `scripts/apply_v8_7_0.py` in `buildResearchMarketContext(...)`.
- It constructs persisted sectors as `Object.entries(sectorStats||{}).sort((a,b)=>(toNumber(b[1]?.score)||0)-(toNumber(a[1]?.score)||0)).slice(0,20).map(...)`.
- Therefore ordering is performed on the available **full-precision `sectorStats.score` before persistence rounding**. Only inside the post-sort map is score persisted as `round(...,2)`; breadth/avgChange are also rounded after ordering.
- The same post-sort map assigns `rank:index+1`. Under the writer contract, a freshly produced valid row therefore has rank equal to persisted array position + 1.
- The writer still has no explicit secondary tie-break. If two raw scores are exactly equal, ECMAScript stable sort preserves the inherited `Object.entries(sectorStats)` insertion order; B-84 already established that insertion order is incidental upstream ordering, not a durable semantic tie-break contract.
- The persisted research-day table stores `market_json` containing this rounded post-sort structure. Raw pre-round score is not separately persisted by this writer. Consequently a historical exact raw tie cannot be reconstructed from two equal rounded persisted scores.
- The R03/R06 consumer in `research/counterfactual_v8_7_4.js` does **not** sort by `rank`. `researchRegimePersistenceFromDays()` takes `(market.topSectors||[]).slice(0,5)` and uses array order/names directly for Top5 set, streak and retention. It ignores persisted `rank` for membership/order reconstruction.

### Falsification / interpretation
- Hypothesis “persisted research-market Top5 sorts rounded scores before ranking” is **falsified**. It sorts full-precision score first and rounds only for persistence.
- Hypothesis “consumer can repair malformed array order from persisted rank” is also **falsified** for the current R03/R06 consumer; it trusts array order and does not re-sort by rank.
- Therefore `rank` is best treated as a writer-contract integrity check, not an alternate historical ordering source. Missing/duplicate/non-positive/non-integer rank or rank != array index+1 => `TOP5_ORDERING=DATA_QUALITY/UNKNOWN`; do not silently reorder the array by rank.
- Because the R03 retention calculation is set-based over the first five array entries, malformed rank alone does not invalidate five-name set membership if the array itself contains five unique non-empty names. Array-order corruption that changes which names occupy positions 1-5 is a separate data-quality issue.
- Historical raw-tie status remains **UNKNOWN** whenever only rounded persisted scores survive. Do not infer raw equality from equal 2-decimal values, do not backfill current sector scores, and do not invent alphabetical/breadth/amount tie-breaks.

### Bias / safety audit
- PIT/look-ahead: only deployment source/writer and frozen consumer contracts inspected; no current market data used to reconstruct historical ranks.
- Selection/data-snooping: no outcome-driven ranking change, threshold search or tie-break search.
- Market-source bias: no listing venue inference or source substitution.
- Factor Zoo/overfit/redundancy/transaction cost: no factor, experiment, score, threshold or trading rule added.
- Coverage/zero-pick/date clustering unchanged. R03/R06 interpretation tightened only; no alpha conclusion.
- Formal Core, Worker, storage, calendar, workflow, dashboard, monitoring and push unchanged; no Production deployment.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Continue R03/R06 source-contract audit without code changes: trace the `trade_research_days` writer from `marketResearchContext` into `market_json` and confirm it persists the already-built Top20 array unchanged rather than re-sorting/re-ranking it. Also identify whether any later migration rewrites `market_json` semantics.
4. Audit the current readiness/consumer boundary for malformed Top5 arrays: duplicate/non-empty industry names, fewer than five unique names, malformed rank, rank/position mismatch, and score-null/zero coercion. Preserve set-membership vs ordering separation; do not add a new threshold.
5. Freeze historical raw-tie status as UNKNOWN because raw full-precision sector score is not separately durable in `market_json`; no tie-breaker or historical backfill.
6. Preserve B-81/B-82 deployment-coupling evidence; do not implement validator/helper on main merely because it is research-only. Any workflow-path change remains Class B proposal-first.
7. Do not modify shared calendar runtime/cache/date resolution; do not retroactively upgrade B-73/B-74 pairs; no historical Shadow/calendar backfill.
8. If exact-source execution becomes available, verify B-73 branch exact head/blobs before test; only exit 0 + fixture PASS may upgrade SOURCE_WRITTEN_NOT_EXECUTED.
9. Keep B-62 proposal-only; do not repeat listing-venue discovery. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
