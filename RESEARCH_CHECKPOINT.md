# Research Checkpoint

Checkpoint sequence: B-76.
Updated: 2026-09-23 23:40 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Previous verified production/research baseline through B-72 was V8.8.2. Repository main observed at B-76 start has tree `c91f9fe84db574c3f0064dd08d39164d5d1ed5a6`; repository evidence is not Production readback.
- Prior deployment commit retained from checkpoint: `12faf559558efe429c6deb93aa9a193a3557968c`, `Deploy V8.9.1 three-pool dashboard`.
- No newer trusted live Production plan/readback established in B-76. Live plan status remains UNKNOWN.
- Last trusted prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 scheduled health previously verified selectedCount=0, planCount=0, signalCount=0; preserve as formal zero-pick date, not Execution Alpha failure. `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.

## Primary research lane retained
- Root funnel: `universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
- 2026-09-16: 1,873 scanned -> 3 selected.
- 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 liquidity rejects, 335 no A/B formation, 71 RR<2.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; evidence-coverage gap, not proof gate is wrong.
- Signal observation != brokerage fill. Confirmed fills/reduced shares remain UNKNOWN absent trusted reconciliation.

## Retained readiness/control findings
- Legacy counterfactual null horizons conflate provenance failures with immature outcomes; missing remains UNKNOWN.
- R01 uses frozen priorHigh20 + future 3-close hold/fail; R05 next-day Overnight/Intraday; R07/R08 same-date medians of residualSectorRs20 and volumeTodayVsPrev5. No new thresholds/windows/composites.
- `readShadowCounterfactualResearch()` may read up to 5000 Shadow rows but exposes only last 80 row-level recentOutcomes; never treat 80 as full archive.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only; current Shadow cannot falsify the largest liquidity-reject gate.
- BROAD_CONTROL is deterministic eligible-survivor control, max 6 GENERAL + 6 THOUSAND, not full-universe random control. Durable pool + scan-time industry exist; immutable listing venue remains UNKNOWN. B-67/B-68 semantics remain frozen.
- Zero-pick formal dates are expected denominator dates. Prospective expected dates are `scan_date >= 2026-09-21` rows present in `v8_trade_journal_days`, regardless of selected_count/status/regime/research-row presence.
- Stored MIXED alone never proves complete regime inputs. Regime readiness is PROVEN_COMPLETE only when persisted `marketReturn20` and `aboveMa20Pct` are finite.
- Top5 readiness is YES only when persisted `topSectors` has at least five unique non-empty industry names; insufficient parseable list = NO; absent/non-array/malformed = UNKNOWN.

## B-73 to B-75 retained — isolated offline R03/R06 sequence readiness helper
- Branch `research/b73-r03-r06-sequence-readiness` remains isolated Class A; no Worker import, DB query, runtime route, deployment, threshold, alpha calculation, or formal-selection wiring.
- B-73 created supplied-row readiness helper and falsification fixtures for zero-pick expected dates, missing/duplicate research rows, malformed market JSON, default-vs-proven MIXED, insufficient/duplicate Top5 industries, and missing expected dates.
- B-74 correctly rejected *journal adjacency alone* as proof of consecutive exchange sessions; Friday->Monday cannot become ready merely because the two dates are adjacent journal rows.
- B-75 surfaces duplicate journal dates rather than silently collapsing them: one independent scan-date observation plus `DUPLICATE_DATE_ANOMALY`; duplicate physical rows never increase sample size.
- Branch head remains `0277b0fb1e8a82fbd7ca8d77f9883d64d375d3b0`; helper blob `6e1228a6f8cf2547628c7d3459cd453efc9eeb9f`; test blob `437d31d8e396551decf5541869d2a407baf313c2`.
- Test status remains **SOURCE_WRITTEN_NOT_EXECUTED**; no PASS claimed.

## B-76 — existing exchange-calendar source is counterevidence to the stronger B-74 assumption
### Research finding
- Source review of current main `Worker.js` found an existing trading-calendar subsystem that predates this readiness helper: `MARKET_CALENDARS` contains an explicit 2026 holiday set; `loadTradingCalendar(env, year)` uses cached `V7_TRADING_CALENDAR:<year>` or fetches TWSE official holidaySchedule data; `isTradingDate(dateString)` rejects weekends and dates in that calendar.
- Therefore the stronger statement “repository has no exchange-session calendar semantics” is false. What B-74 actually established remains narrower and valid: **journal-row adjacency itself is not exchange-session adjacency**.
- This calendar discovery does **not** yet prove PIT-safe R03/R06 pair provenance. The current Shadow/research rows do not establish which calendar vintage/source was available at each historical decision timestamp, and the readiness helper intentionally does not import shared Worker runtime.
- Do not retroactively flip existing pairs to `exchangeSessionAdjacency=YES` from present-day source inspection. For prospective dates, a future design could capture/submit calendar provenance contemporaneously, but any shared persistence/fetch/runtime wiring remains Class B proposal-first.

### Evidence / counterevidence / bias audit
- Supporting evidence: main `Worker.js` visibly defines the 2026 holiday set plus official TWSE calendar loader and `isTradingDate()` semantics.
- Counterevidence to B-74 overstatement: an exchange-calendar mechanism does exist; the missing piece is durable PIT provenance for the research pair, not calendar logic itself.
- Look-ahead/PIT: no historical pair was repaired from the current calendar. Existing `exchangeSessionAdjacency=UNKNOWN` remains unchanged.
- Market-source bias: source is TWSE calendar semantics; TPEx parity for this research use was not independently proven in B-76, so no TWSE->TPEx assumption is promoted.
- Selection bias / zero-pick: unchanged; zero-pick expected dates remain denominator dates.
- Data snooping / Factor Zoo / overfit / redundancy: no factor, threshold, window, ranking, sampler, alpha rule, or experiment added.
- Date clustering: finding improves the future path for proving session continuity but does not increase current independent-date sample size.
- Transaction cost: not applicable to structural readiness.
- R03/R06 impact: provenance/readiness interpretation only; no directionality claim. R01/R02/R04/R05/R07/R08 and I01-I07 unchanged.
- Classification: research/source review only. No branch change, no runtime change, no deployment.

## Interruption / source-review status
- Exact-next item to prove `v8_trade_journal_days` uniqueness was attempted via GitHub code search, but the connector search index returned no match even though prior repository evidence proves the table is used. Full `Worker.js` retrieval is oversized/truncated before the relevant schema/writer section, so uniqueness was **not proven** in B-76.
- Do not infer uniqueness from the helper or from the absence of search results. Duplicate journal row remains a corruption/contract guard with reachability UNKNOWN until schema/writer source is directly retrieved.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Preserve B-76 correction: journal adjacency alone is insufficient, but an existing TWSE calendar subsystem exists. Keep current `exchangeSessionAdjacency=UNKNOWN` until pair-specific PIT provenance is proven; do not backfill historical pairs from today's source tree.
4. Continue source-review of `v8_trade_journal_days` schema/writer using a direct blob/range/commit-patch path that can expose the relevant code. Determine PRIMARY KEY/UNIQUE/UPSERT semantics. If uniqueness is guaranteed, duplicate fixture is corruption/contract falsification; if not, identify exact duplicate-producing path. Do not change shared storage in Class A.
5. Source-review duplicate `trade_research_days` persistence the same way: determine whether helper `researchRow=DUPLICATE` is a corruption guard or reachable rerun state. Preserve UNKNOWN/data-quality semantics.
6. Separately verify whether the existing calendar mechanism has durable source/vintage provenance sufficient for **prospective** R03/R06 session adjacency and whether TPEx uses identical session closures for the dates under study. Do not assume parity. Any shared calendar persistence/fetch/runtime change is Class B proposal-first.
7. If exact-source execution becomes available, verify branch head `0277b0fb1e8a82fbd7ca8d77f9883d64d375d3b0` and exact blobs, then execute the test; only exit 0 + fixture PASS may upgrade SOURCE_WRITTEN_NOT_EXECUTED.
8. Do not wire helper into runtime/dashboard. Keep B-62 proposal-only; do not repeat listing-venue discovery.
9. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
