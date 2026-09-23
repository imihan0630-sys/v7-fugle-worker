# Research Checkpoint

Checkpoint sequence: B-75.
Updated: 2026-09-23 23:12 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Previous verified production/research baseline through B-72 was V8.8.2. Latest main observed at B-75 start was `087b0c5d4fcb1270797f64f05909d94feb93808f` (B-74 checkpoint); prior deployment commit observed was `12faf559558efe429c6deb93aa9a193a3557968c`, `Deploy V8.9.1 three-pool dashboard`. Repository evidence is not Production readback.
- No newer trusted live Production plan/readback was established in B-75. Live plan status remains UNKNOWN.
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
- Branch `research/b73-r03-r06-sequence-readiness` remains isolated Class A; no Worker import, DB query, runtime route, deployment, threshold, alpha calculation, or formal-selection wiring.
- B-73 created supplied-row readiness helper and falsification fixtures for zero-pick expected dates, missing/duplicate research rows, malformed market JSON, default-vs-proven MIXED, insufficient/duplicate Top5 industries, and missing expected dates.
- B-74 established that journal adjacency proves only consecutive observed expected journal dates, not consecutive TWSE/TPEx sessions. `exchangeSessionAdjacency` remains UNKNOWN absent PIT-safe session provenance; Friday->Monday fixture prevents accidental promotion to sequence-ready.

## B-75 — duplicate journal-date denominator falsification
### Engineering result
- Source review confirmed the B-74 helper built expected dates with a JavaScript `Set`, so duplicate journal rows for the same scan date were silently collapsed. That preserved a unique-date denominator but hid a data-quality anomaly.
- Updated isolated branch helper to count journal rows by scan date before constructing the unique expected-date denominator. A duplicate date remains **one independent scan-date observation** but is now surfaced as `journalRow=DUPLICATE`, `duplicateJournalDateCount`, and `duplicateJournalDates`.
- Any adjacent pair touching a duplicate journal date now reports `journalDenominatorQuality=DUPLICATE_DATE_ANOMALY` and cannot be structurally R03/R06-ready. This avoids both double-counting and silently trusting an ambiguous denominator row.
- Added a falsification fixture with two journal rows on 2026-09-24 plus one on 2026-09-25: expectedDateCount must remain 2, duplicateJournalDateCount must be 1, and the pair must not become field-ready.
- Branch head after B-75 changes: `0277b0fb1e8a82fbd7ca8d77f9883d64d375d3b0`; helper blob `6e1228a6f8cf2547628c7d3459cd453efc9eeb9f`; test blob `437d31d8e396551decf5541869d2a407baf313c2`.
- Exact-source execution was attempted in the local runtime, but outbound GitHub DNS/network access was unavailable, so the branch could not be cloned there. Test status therefore remains **SOURCE_WRITTEN_NOT_EXECUTED**; no PASS is claimed.

### Evidence / counterevidence / bias audit
- Supporting evidence: scan date remains the independent evidence unit; duplicate physical rows must not increase statistical sample size.
- Counterevidence: a duplicate row can arise from benign rerun/storage behavior rather than distinct market evidence. Therefore duplicate is a data-quality anomaly, not BAD performance and not an extra observation.
- Selection bias / zero-pick: zero-pick dates remain in denominator; duplicate dates are not dropped from the denominator, only flagged.
- Look-ahead/PIT: no present-day data or exchange calendar was used to repair duplicates.
- Market-source bias: no TWSE/TPEx calendar inference added; `exchangeSessionAdjacency=UNKNOWN` remains frozen.
- Data snooping / Factor Zoo / overfit / redundancy: no factor, threshold, window, ranking, sampler, alpha rule, or experiment added.
- Date clustering: duplicate storage rows cannot masquerade as independent scan dates.
- Transaction cost: not applicable to structural readiness.
- R03/R06 impact: readiness semantics only; no directionality claim. R01/R02/R04/R05/R07/R08 and I01-I07 unchanged.
- Classification: Class A branch-only research diagnostic. Formal Core unchanged; no merge/deploy.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Keep `exchangeSessionAdjacency=UNKNOWN`; do not invent/backfill exchange sessions. Any new shared calendar persistence/fetch path is Class B proposal-first.
4. Source-review whether the underlying `v8_trade_journal_days` schema/writer enforces one row per `scan_date` (PRIMARY KEY/UNIQUE/UPSERT semantics). If uniqueness is structurally guaranteed, retain the duplicate fixture as corruption/contract falsification rather than expected runtime behavior; if not guaranteed, identify the exact duplicate-producing path. Do not change shared storage in Class A.
5. Source-review duplicate research-row persistence the same way: determine whether helper `researchRow=DUPLICATE` is a corruption guard or a reachable normal rerun state. Preserve UNKNOWN/data-quality semantics.
6. If exact-source execution becomes available, verify branch head `0277b0fb1e8a82fbd7ca8d77f9883d64d375d3b0` and exact blobs, then execute the test; only exit 0 + fixture PASS may upgrade SOURCE_WRITTEN_NOT_EXECUTED.
7. Do not wire helper into runtime/dashboard. Keep B-62 proposal-only; do not repeat listing-venue discovery.
8. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
