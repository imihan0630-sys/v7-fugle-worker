# Research Checkpoint

Checkpoint sequence: B-77.
Updated: 2026-09-24 00:14 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Previous verified production/research baseline through B-72 was V8.8.2. Latest main commit observed at B-77 start was `da74049cf06a88a9d6473a0d8f2a1e575f4e838f` (B-76 checkpoint); repository evidence is not Production readback.
- Prior deployment commit retained from checkpoint: `12faf559558efe429c6deb93aa9a193a3557968c`, `Deploy V8.9.1 three-pool dashboard`.
- No newer trusted live Production plan/readback established in B-77. Live plan status remains UNKNOWN.
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

## B-76 retained — existing exchange-calendar source counterevidence
- Current source has a trading-calendar subsystem: explicit 2026 holiday set plus `loadTradingCalendar()` / `isTradingDate()` using TWSE holidaySchedule semantics.
- Correct retained conclusion: journal-row adjacency itself is not exchange-session adjacency; an exchange calendar exists, but pair-specific PIT provenance is not yet durable in the readiness rows.
- Existing `exchangeSessionAdjacency=UNKNOWN` remains unchanged; no historical pair is repaired from present-day source inspection.

## B-77 — journal/research duplicate reachability source proof
### Source findings
- Direct source retrieval of `scripts/apply_v8_5_0.py` proves `v8_trade_journal_days` is created with `scan_date TEXT PRIMARY KEY`.
- Its writer `recordTradeJournalDay()` uses `INSERT ... ON CONFLICT(scan_date) DO UPDATE`; a normal same-date rerun updates the existing day row instead of creating a second physical row. Therefore B-75 `DUPLICATE_DATE_ANOMALY` is correctly retained as a **corruption/contract falsification guard**, not an expected rerun state.
- The same writer deletes and rewrites `v8_trade_journal_plans` for the scan date, while plans themselves use `PRIMARY KEY(scan_date,symbol)`. This reinforces that same-day reruns are replacement semantics, not extra independent evidence.
- Direct source retrieval of `scripts/apply_v8_7_0.py` proves `trade_research_days` is created with `scan_date TEXT PRIMARY KEY`.
- The research-day writer shown in `backfillCurrentResearchSnapshots()` uses `INSERT ... ON CONFLICT(scan_date) DO UPDATE` for `trade_research_days`; normal reruns update one row. Thus helper `researchRow=DUPLICATE` is also a **corruption/contract guard** under the proven schema, not a normal rerun state.
- `trade_research_snapshots` separately uses `PRIMARY KEY(scan_date,symbol)` and UPSERT by that pair, so same-day/same-symbol research snapshot reruns replace rather than multiply observations.

### Counterevidence / scope limits
- The proof is repository-source semantics, not a live D1 integrity read. It establishes what compliant schema/writers allow, but does not prove an existing Production database has never been manually corrupted or created from an incompatible historical schema. Therefore duplicate guards remain useful and should not be removed merely because normal writers are unique.
- Current main `Worker.js` is a base source transformed by sequential `scripts/apply_*` deployment steps; direct raw Worker blob alone is not sufficient evidence for generated V8 runtime semantics. B-77 therefore used the exact patch scripts that define these tables/writers.
- No evidence found in this cycle that later research patches intentionally relax these uniqueness contracts. Absence of such evidence is not a live DB schema readback.

### Bias / governance audit
- Selection bias / zero-pick: unchanged. A zero-pick day remains one independent denominator date; rerunning it cannot create extra sample weight.
- Date clustering: uniqueness contracts directly prevent same-date reruns from inflating independent-date counts under normal writers.
- Look-ahead/PIT: no historical row or outcome was backfilled/rewritten by this research cycle.
- Market-source bias: not implicated in uniqueness proof; calendar TPEx parity remains separately unresolved.
- Data snooping / Factor Zoo / overfit / redundancy: no factor, threshold, window, sampler, alpha rule, experiment, or classification added.
- Transaction cost: not applicable to storage uniqueness/readiness.
- UNKNOWN semantics: live DB integrity remains UNKNOWN absent trusted schema/data readback; source contract != empirical integrity proof.
- Classification: source review only / Class A research interpretation. No shared storage change, branch change, runtime change, merge, or deployment.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Preserve B-77 uniqueness proof: `v8_trade_journal_days.scan_date` and `trade_research_days.scan_date` are source-level PRIMARY KEY contracts with UPSERT replacement semantics. Keep duplicate fixtures as corruption/contract guards; do not treat duplicates as expected rerun behavior.
4. Continue R03/R06 readiness by verifying whether existing trading-calendar data has **durable source/vintage provenance** sufficient for prospective pair-specific session adjacency. Distinguish runtime calendar availability from persisted research provenance. Do not backfill historical pairs from today's calendar.
5. Independently verify TPEx/TWSE session-closure parity for the prospective dates under study from authoritative source semantics before allowing a TWSE calendar to certify both markets. If parity cannot be proven, keep venue/session provenance UNKNOWN rather than assuming it.
6. If a trusted read-only Production D1/schema path becomes available, check actual table definitions/integrity for duplicate rows without mutating storage; source contracts alone do not prove historical DB integrity.
7. If exact-source execution becomes available, verify branch head `0277b0fb1e8a82fbd7ca8d77f9883d64d375d3b0` and exact blobs, then execute the test; only exit 0 + fixture PASS may upgrade SOURCE_WRITTEN_NOT_EXECUTED.
8. Do not wire helper into runtime/dashboard. Keep B-62 proposal-only; do not repeat listing-venue discovery.
9. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
