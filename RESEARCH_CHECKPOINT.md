# Research Checkpoint

Checkpoint sequence: B-79.
Updated: 2026-09-24 01:11 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Previous verified production/research baseline through B-72 was V8.8.2. Repository evidence is not Production readback.
- Prior deployment commit retained from checkpoint: `12faf559558efe429c6deb93aa9a193a3557968c`, `Deploy V8.9.1 three-pool dashboard`.
- No newer trusted live Production plan/readback established in B-79. Live plan status remains UNKNOWN.
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

## B-78 retained — authoritative 2026 TPEx/TWSE closure parity evidence
- Authoritative TPEx and TWSE 2026 calendars independently agree on directly compared exchange-wide closure dates including 2026-09-25 and 2026-09-28.
- Scope remains narrow: this supports 2026 exchange-wide closure parity only for authoritative dates directly compared; it does not establish listing venue, historical-year parity, or individual-security halt semantics.
- No historical Shadow/research row was rewritten or upgraded from current web evidence.

## B-79 — calendar persistence provenance source audit
### New source proof
- Current main `Worker.js` defines a hard-coded `MARKET_CALENDARS` entry for 2026 as an in-memory `Set` of closure dates. The hard-coded object carries no source URL, fetchedAt, verifiedAt, source publication date, or market-scope metadata.
- `loadTradingCalendar(env, year)` first returns immediately when the year already exists in `MARKET_CALENDARS`; therefore 2026 normally uses the embedded date set without a runtime fetch and without producing a contemporaneous provenance record.
- For non-embedded years, the loader checks KV key `V7_TRADING_CALENDAR:<year>`. The accepted cached payload contract is only `{year, holidays}`. The write path likewise persists `JSON.stringify({year, holidays})` with TTL; it does **not** persist source URL, fetchedAt, verifiedAt, source vintage/publication timestamp, TWSE/TPEx parity evidence, or a content hash.
- If cache is absent, the loader fetches TWSE `holidaySchedule` and validates `queryYear` plus non-empty `data`, then derives the holiday date set. The fetch URL exists only in source code, not in the persisted calendar payload.
- `isTradingDate(dateString)` consumes only year/weekend/date-membership semantics. It cannot expose which calendar source/vintage established a specific pair's adjacency.

### Conclusion / counterevidence
- The hypothesis that existing calendar persistence might already be sufficient to prove prospective pair-specific PIT session provenance is **falsified** by current source: the durable payload lacks the required provenance fields.
- B-78's external 2026 TWSE/TPEx parity evidence remains useful source research, but it cannot be joined retroactively to an already-persisted R03/R06 pair as if that evidence had been captured at the decision timestamp.
- `exchangeSessionAdjacency=UNKNOWN` therefore remains correct for existing B-73/B-74 readiness rows. No pair is upgraded in B-79.
- A minimal future prospective provenance record would need at least calendar year, exact source identity/URL, capturedAt or verifiedAt, source vintage/publication evidence when available, market scope/parity status, and preferably a deterministic holiday-set hash. This is a design requirement only, not implemented.

### Classification / bias audit
- Any modification to existing `loadTradingCalendar`, `MARKET_CALENDARS`, shared KV payload, or shared runtime date resolution is **Class B proposal-first** because those paths are shared runtime/date infrastructure.
- A separately isolated research-only provenance artifact that is not consumed by formal scans could potentially be Class A, but its write/read path must be demonstrably disconnected from formal date resolution before coding.
- Look-ahead/PIT: no historical pair upgraded and no present-day source used to fabricate historical provenance.
- Market-source bias: B-78 parity remains bounded to directly compared 2026 authoritative closures; B-79 does not infer listing venue or security-specific halts.
- Selection bias / zero-pick / date clustering: unchanged; one formal scan date remains one evidence unit.
- Data snooping / Factor Zoo / overfit / redundancy / transaction cost: no factor, threshold, window, sampler, alpha rule, experiment, or trading interpretation added.
- UNKNOWN semantics preserved.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Preserve B-77 uniqueness proof, B-78 parity scope, and B-79 persistence proof: existing calendar cache is `{year,holidays}` only and does not establish pair-specific PIT provenance.
4. Design, but do not implement in shared runtime, the smallest prospective-only R03/R06 calendar-provenance contract. First test whether it can live as an isolated research-only artifact with no dependency from formal date resolution; if not demonstrably isolated, classify Class B and leave proposal-only.
5. Explicitly define falsification semantics for the proposed provenance artifact: source fetch failure, year mismatch, TWSE/TPEx parity unverified, stale/absent capture timestamp, malformed holiday set, or hash mismatch must yield UNKNOWN/DATA_QUALITY_BLOCKED rather than inferred adjacency.
6. Do not retroactively upgrade B-73/B-74 pairs from B-78/B-79 source evidence and do not backfill historical Shadow.
7. If a trusted read-only Production D1/schema path becomes available, check actual table definitions/integrity for duplicate rows without mutating storage; source contracts alone do not prove historical DB integrity.
8. If exact-source execution becomes available, verify branch head `0277b0fb1e8a82fbd7ca8d77f9883d64d375d3b0` and exact blobs, then execute the test; only exit 0 + fixture PASS may upgrade SOURCE_WRITTEN_NOT_EXECUTED.
9. Do not wire helper into runtime/dashboard. Keep B-62 proposal-only; do not repeat listing-venue discovery.
10. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
