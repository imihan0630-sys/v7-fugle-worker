# Research Checkpoint

Checkpoint sequence: B-78.
Updated: 2026-09-24 00:40 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Previous verified production/research baseline through B-72 was V8.8.2. Repository evidence is not Production readback.
- Prior deployment commit retained from checkpoint: `12faf559558efe429c6deb93aa9a193a3557968c`, `Deploy V8.9.1 three-pool dashboard`.
- No newer trusted live Production plan/readback established in B-78. Live plan status remains UNKNOWN.
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

## B-77 retained — journal/research duplicate reachability source proof
- `v8_trade_journal_days.scan_date` and `trade_research_days.scan_date` are source-level PRIMARY KEY contracts with UPSERT replacement semantics.
- `v8_trade_journal_plans` and `trade_research_snapshots` use `(scan_date,symbol)` uniqueness/upsert semantics. Same-day reruns replace rather than create independent evidence under compliant schema/writers.
- Duplicate helper fixtures remain corruption/contract falsification guards because source contract does not prove live historical D1 integrity.

## B-78 — authoritative 2026 TPEx/TWSE closure parity evidence
### New evidence
- Authoritative TPEx 115-year market open/closure table explicitly lists the 2026 OTC-market closure calendar. It includes 2026-09-25 Mid-Autumn Festival closure and 2026-09-28 Teachers' Day closure, plus the same major 2026 holiday structure observed in TWSE's official holiday schedule.
- Authoritative TWSE 2026 holiday schedule independently lists 2026-09-25 and 2026-09-28 as closures, with the same 2026 holiday dates relevant to the current prospective research window.
- Therefore the prior blanket concern that a TWSE calendar might not represent TPEx session closures is **falsified for the authoritative 2026 calendar dates directly compared**. For prospective 2026 dates, exchange-wide closure parity can be supported when both authoritative annual calendars agree.
- This does **not** establish immutable per-row listing venue, and it does not prove all historical years or special instrument-specific suspensions. A company-specific trading halt is not an exchange-wide session closure and must not be conflated with calendar adjacency.

### PIT / provenance boundary
- The authoritative annual calendars are current external evidence. B-78 does not rewrite or backfill any existing Shadow/research row and does not retroactively change B-73/B-74 pair readiness.
- Existing helper still has no durable pair-specific calendar source/vintage fields. Thus `exchangeSessionAdjacency=UNKNOWN` remains correct for already-persisted rows unless the required calendar provenance was durably captured at the relevant research time or a separately governed prospective provenance mechanism is introduced.
- For new prospective research only, a safe future design may persist `calendarSource`, `calendarYear`, `calendarCapturedAt/verifiedAt`, and market-scope evidence before pair interpretation. Because adding shared persistence/runtime fields could touch common storage paths, classify any such implementation before coding; prefer isolated Class A research storage, otherwise Class B proposal-first.

### Bias / governance audit
- Market-source bias: materially reduced for 2026 exchange-wide closures because TWSE and TPEx authoritative annual calendars independently agree on the directly compared closure dates.
- Look-ahead/PIT: no historical readiness was upgraded from today's web lookup; existing pairs remain UNKNOWN without durable vintage provenance.
- Selection bias / zero-pick / date clustering: unchanged; one formal scan date remains one evidence unit.
- Data snooping / Factor Zoo / overfit / redundancy: no factor, threshold, window, sampler, alpha rule, experiment, or classification added.
- UNKNOWN semantics: preserved. Calendar parity evidence does not manufacture missing per-row provenance.
- Classification: source research / Class A interpretation only. No runtime, storage, Formal Core, deployment, monitoring, or push change.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Preserve B-77 uniqueness proof and B-78 2026 calendar-parity scope: source-level uniqueness is not live DB integrity; 2026 TWSE/TPEx exchange-wide closure parity is supported only for authoritative calendar dates directly compared, not listing venue or individual-security halts.
4. Continue R03/R06 readiness by locating whether the existing calendar subsystem persists source URL/year/fetchedAt/verifiedAt or only caches a date set. Determine whether prospective pair-specific session provenance can be proven without modifying shared runtime.
5. Do not retroactively upgrade B-73/B-74 pairs from B-78 web evidence. If durable provenance is absent, design the smallest prospective-only research provenance proposal and classify it A vs B before coding.
6. If a trusted read-only Production D1/schema path becomes available, check actual table definitions/integrity for duplicate rows without mutating storage; source contracts alone do not prove historical DB integrity.
7. If exact-source execution becomes available, verify branch head `0277b0fb1e8a82fbd7ca8d77f9883d64d375d3b0` and exact blobs, then execute the test; only exit 0 + fixture PASS may upgrade SOURCE_WRITTEN_NOT_EXECUTED.
8. Do not wire helper into runtime/dashboard. Keep B-62 proposal-only; do not repeat listing-venue discovery.
9. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
