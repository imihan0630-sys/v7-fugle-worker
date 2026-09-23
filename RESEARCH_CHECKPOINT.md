# Research Checkpoint

Checkpoint sequence: B-73.
Updated: 2026-09-23 22:11 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Previous verified production/research baseline through B-72 was V8.8.2. Main has since advanced: latest main observed at start of B-73 was `12faf559558efe429c6deb93aa9a193a3557968c`, commit message `Deploy V8.9.1 three-pool dashboard`. This is repository evidence only; production runtime readback was not independently verified in B-73, so do not equate main commit with deployed runtime health.
- Last trusted prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 scheduled health previously verified selectedCount=0, planCount=0, signalCount=0; preserve as formal zero-pick date, not Execution Alpha failure. `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.
- No newer trusted Production plan readback was established in B-73; live plan status remains UNKNOWN rather than assumed zero.

## Primary research lane retained
- Root funnel: `universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
- 2026-09-16: 1,873 scanned -> 3 selected.
- 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 liquidity rejects, 335 no A/B formation, 71 RR<2.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; evidence-coverage gap, not proof gate is wrong.
- Signal observation != brokerage fill. Confirmed fills/reduced shares remain UNKNOWN absent trusted reconciliation.

## Retained readiness/control findings through B-72
- Legacy counterfactual null horizons conflate provenance failures with immature outcomes; missing remains UNKNOWN.
- R01 uses frozen priorHigh20 + future 3-close hold/fail; R05 next-day Overnight/Intraday; R07/R08 same-date medians of residualSectorRs20 and volumeTodayVsPrev5. No new thresholds/windows/composites.
- `readShadowCounterfactualResearch()` may read up to 5000 Shadow rows but exposes only last 80 row-level recentOutcomes; never treat 80 as full archive.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only; current Shadow cannot falsify the largest liquidity-reject gate.
- BROAD_CONTROL is deterministic eligible-survivor control, max 6 GENERAL + 6 THOUSAND, not full-universe random control. Durable pool + scan-time industry exist; immutable listing venue remains UNKNOWN. Branch `research/b67-broad-control-concentration` stays branch-only; duplicate scan_date+symbol is a data-quality anomaly excluded from effective denominators.
- Existing `researchRegimePersistenceFromDays()` can bridge across missing/malformed dates because it filters before adjacency; it is not a completeness denominator.
- Zero-pick formal dates are expected denominator dates. Prospective expected dates are `scan_date >= 2026-09-21` rows present in `v8_trade_journal_days`, regardless of selected_count/status/regime/research-row presence.
- `buildResearchMarketContext()` can default regime to MIXED. Stored MIXED alone never proves complete regime inputs.
- Frozen regime readiness: PROVEN_COMPLETE only when persisted `marketReturn20` and `aboveMa20Pct` are both finite.
- Frozen Top5 readiness: YES only when persisted `topSectors` is an array with at least five unique non-empty industry names; NO for parseable but insufficient list; UNKNOWN for absent/non-array/malformed enclosing market JSON.

## NEW B-73 — isolated offline R03/R06 sequence readiness helper
### Engineering result
- Created isolated branch `research/b73-r03-r06-sequence-readiness` from main commit `12faf559558efe429c6deb93aa9a193a3557968c`.
- Added `research/r03_r06_sequence_readiness.mjs` and `research/r03_r06_sequence_readiness.test.mjs` on branch only. Branch head after fixtures: `165a1aa78c5f26f8e7b0aa0ae8b28717abfc8023`.
- Helper accepts supplied journal rows + research-day rows only. It has no Worker import, DB query, runtime route, deployment, threshold, alpha calculation, or formal-selection wiring.
- It reports per expected date: research-row presence, market JSON parse state, frozen regime-input completeness, frozen Top5 computability; then reports only consecutive expected-date pairs. A missing expected research row remains in sequence and causes both adjacent pair readiness values to be NO, preventing silent bridging.
- Duplicate research rows for the same expected date are treated as a data-quality anomaly (`DUPLICATE`) and not silently selected.

### Falsification fixtures written
- Fixture covers: zero-pick expected date, missing research row, malformed market_json, default MIXED with missing inputs, valid MIXED with complete inputs, partial (<5) topSectors, duplicate sector names, and a missing middle expected date.
- Duplicate sector names do not count twice; readiness requires five unique usable names.
- Missing middle expected date explicitly blocks 09-21 -> 09-23 bridging.
- Test status remains **SOURCE_WRITTEN_NOT_EXECUTED**. No exact-source execution environment was established this run; assertions are not claimed PASS.

### Bias / governance audit
- Selection bias: expected denominator is journal dates, including zero-pick dates.
- Look-ahead/PIT: supplied persisted scan-time fields only; no current market/sector lookup.
- Market-source bias: MIXED cannot certify completeness without the two persisted inputs.
- Data snooping / Factor Zoo / overfit: no new factor, experiment, threshold, window, ranking or regime rule.
- Date clustering: date is independent unit; no adjacency across an expected-date research gap.
- Transaction cost: not applicable to structural readiness.
- Classification: Class A isolated research-only branch. Formal Core unchanged; no merge/deploy performed.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main; re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Source-review B-73 helper against the frozen B-72 semantics for one subtle issue before extending it: adjacency currently means consecutive expected journal dates, not necessarily consecutive exchange trading sessions. Determine whether the readiness diagnostic needs a separate `calendarGapUnknown`/session-calendar provenance state rather than assuming adjacent journal rows are consecutive sessions. Do not fetch present-day calendars to backfill historical readiness unless PIT-safe source exists.
4. If exact-source execution becomes available, execute branch head `165a1aa78c5f26f8e7b0aa0ae8b28717abfc8023` after verifying exact blobs and only then upgrade test status from SOURCE_WRITTEN_NOT_EXECUTED. Otherwise keep status unchanged.
5. Do not wire the helper into runtime or dashboard yet. First falsify denominator/session semantics and duplicate-row behavior. Any shared runtime/storage change is Class B proposal-first.
6. Keep B-62 proposal-only; do not repeat listing-venue discovery. B-67/B-68 semantics remain frozen.
7. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
