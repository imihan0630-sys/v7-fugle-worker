# Research Checkpoint

Checkpoint sequence: B-74.
Updated: 2026-09-23 22:44 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Previous verified production/research baseline through B-72 was V8.8.2. Latest main observed before B-74 write was `cff1f4cf19e9d9577278784cf1ceb5cb2aafe9c8` (B-73 checkpoint); prior main deployment commit observed in B-73 was `12faf559558efe429c6deb93aa9a193a3557968c`, `Deploy V8.9.1 three-pool dashboard`. Repository evidence is not Production readback.
- Production monitor URL could not be accessed by the available web reader in B-74, so no newer trusted live plan/readback was established. Live plan status remains UNKNOWN.
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
- Existing `researchRegimePersistenceFromDays()` can bridge across missing/malformed dates because it filters before adjacency; it is not a completeness denominator.
- Zero-pick formal dates are expected denominator dates. Prospective expected dates are `scan_date >= 2026-09-21` rows present in `v8_trade_journal_days`, regardless of selected_count/status/regime/research-row presence.
- Stored MIXED alone never proves complete regime inputs. Regime readiness is PROVEN_COMPLETE only when persisted `marketReturn20` and `aboveMa20Pct` are finite.
- Top5 readiness is YES only when persisted `topSectors` has at least five unique non-empty industry names; insufficient parseable list = NO; absent/non-array/malformed = UNKNOWN.

## B-73/B-74 — isolated offline R03/R06 sequence readiness helper
### Engineering result
- Branch `research/b73-r03-r06-sequence-readiness` remains isolated Class A; no Worker import, DB query, runtime route, deployment, threshold, alpha calculation, or formal-selection wiring.
- B-73 created supplied-row readiness helper and falsification fixtures for zero-pick expected dates, missing/duplicate research rows, malformed market JSON, default-vs-proven MIXED, insufficient/duplicate Top5 industries, and missing expected dates.
- B-74 source-reviewed the subtle adjacency issue. Repository search found no existing immutable exchange-session calendar/provenance source suitable for proving that two adjacent journal rows are consecutive exchange trading sessions.
- Critical correction: adjacency in `v8_trade_journal_days` proves only consecutive *observed expected journal dates*, not consecutive TWSE/TPEx sessions. Weekend/holiday/calendar gaps cannot be inferred away.
- Updated branch helper so every pair reports `expectedJournalAdjacency=YES`, `exchangeSessionAdjacency=UNKNOWN`, and `calendarDayGap`. Structural field readiness is separated from sequence readiness: `r06RegimeFieldsReady` / `r03Top5FieldsReady` may be YES, but pair readiness is `UNKNOWN_SESSION_ADJACENCY` until session adjacency has PIT-safe provenance.
- Added a Friday->Monday falsification fixture: both dates can have complete regime/Top5 fields, yet the helper must not call the pair sequence-ready merely because they are adjacent journal rows.
- Branch head after B-74 changes: `1e1265fe2981d0120b34e73fb58c92dc3e149085`.
- Test status remains **SOURCE_WRITTEN_NOT_EXECUTED**. Assertions were updated but are not claimed PASS; no exact-source execution environment was established.

### Evidence / counterevidence / bias audit
- Supporting evidence: journal rows are a valid prospective expected-date denominator including zero-pick dates; persisted market fields can establish field-level readiness.
- Counterevidence: journal adjacency alone cannot prove exchange-session adjacency; current repository search did not establish a durable session calendar source.
- Look-ahead/PIT: no present-day exchange calendar was used to backfill historical readiness. Missing session provenance remains UNKNOWN.
- Selection bias: zero-pick dates remain in denominator.
- Market-source bias: no TWSE/TPEx session source is silently assumed.
- Data snooping / Factor Zoo / overfit: no new factor, experiment, threshold, window, ranking, regime rule, or alpha result.
- Date clustering: scan date remains independent evidence unit; sequence interpretation is now more conservative.
- Transaction cost: not applicable to structural readiness.
- R03/R06 impact: readiness interpretation tightened only; no claim that Alpha is good/bad. R01/R02/R04/R05/R07/R08 and I01-I07 unchanged.
- Classification: Class A branch-only research diagnostic. Formal Core unchanged; no merge/deploy.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Do not invent or backfill exchange-session adjacency. Source-review whether an already-persisted PIT-safe session identifier/trading-date sequence exists elsewhere in the repository. If none exists, freeze `exchangeSessionAdjacency=UNKNOWN`; any new shared calendar persistence/fetch path is Class B proposal-first.
4. Source-review duplicate journal-date behavior (not only duplicate research rows): B-73 de-duplicates journal dates via Set. Determine whether duplicate journal rows should be surfaced as a denominator data-quality anomaly rather than silently collapsed. This is the next branch-only falsification target.
5. If exact-source execution becomes available, execute branch head `1e1265fe2981d0120b34e73fb58c92dc3e149085` after verifying exact blobs; only then upgrade test status from SOURCE_WRITTEN_NOT_EXECUTED.
6. Do not wire helper into runtime/dashboard. Keep B-62 proposal-only; do not repeat listing-venue discovery.
7. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
