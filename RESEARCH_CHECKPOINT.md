# Research Checkpoint

Checkpoint sequence: B-82.
Updated: 2026-09-24 02:39 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Previous verified production/research baseline through B-72 was V8.8.2. Repository evidence is not Production readback.
- Prior deployment commit retained: `12faf559558efe429c6deb93aa9a193a3557968c`, `Deploy V8.9.1 three-pool dashboard`.
- No newer trusted live Production plan/readback established through B-82. Live plan status remains UNKNOWN.
- Last trusted prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 scheduled health previously verified selectedCount=0, planCount=0, signalCount=0; preserve as formal zero-pick date, not Execution Alpha failure. `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.

## Primary research lane retained
- Root funnel: `universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
- 2026-09-16: 1,873 scanned -> 3 selected.
- 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 liquidity rejects, 335 no A/B formation, 71 RR<2.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; evidence-coverage gap, not proof gate is wrong.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only.
- Signal observation != brokerage fill. Confirmed fills/reduced shares remain UNKNOWN absent trusted reconciliation.

## Retained readiness/control findings
- Legacy counterfactual null horizons conflate provenance failures with immature outcomes; missing remains UNKNOWN.
- R01 uses frozen priorHigh20 + future 3-close hold/fail; R05 next-day Overnight/Intraday; R07/R08 same-date medians of residualSectorRs20 and volumeTodayVsPrev5. No new thresholds/windows/composites.
- `readShadowCounterfactualResearch()` may read up to 5000 Shadow rows but exposes only last 80 row-level recentOutcomes; never treat 80 as full archive.
- BROAD_CONTROL is deterministic eligible-survivor control, max 6 GENERAL + 6 THOUSAND, not full-universe random control. Durable pool + scan-time industry exist; immutable listing venue remains UNKNOWN. B-67/B-68 semantics frozen.
- Zero-pick formal dates are expected denominator dates. Prospective expected dates are `scan_date >= 2026-09-21` rows present in `v8_trade_journal_days`, regardless of selected_count/status/regime/research-row presence.
- Stored MIXED alone never proves complete regime inputs. Regime readiness is PROVEN_COMPLETE only when persisted `marketReturn20` and `aboveMa20Pct` are finite.
- Top5 readiness is YES only when persisted `topSectors` has at least five unique non-empty industry names; insufficient parseable list = NO; absent/non-array/malformed = UNKNOWN.

## B-73 to B-75 retained — isolated offline R03/R06 sequence readiness helper
- Branch `research/b73-r03-r06-sequence-readiness` remains isolated; no Worker import, DB query, runtime route, threshold, alpha calculation, or formal-selection wiring.
- B-73 created supplied-row readiness helper and falsification fixtures; B-74 rejected journal adjacency as proof of exchange-session adjacency; B-75 surfaces duplicate journal dates as one observation plus `DUPLICATE_DATE_ANOMALY`.
- Branch head `0277b0fb1e8a82fbd7ca8d77f9883d64d375d3b0`; helper blob `6e1228a6f8cf2547628c7d3459cd453efc9eeb9f`; test blob `437d31d8e396551decf5541869d2a407baf313c2`.
- Test status remains **SOURCE_WRITTEN_NOT_EXECUTED**; no PASS claimed.

## B-76 to B-80 retained — calendar/session provenance
- Current source has a trading-calendar subsystem, but journal-row adjacency is not exchange-session adjacency and pair-specific PIT provenance is not durable in readiness rows.
- `v8_trade_journal_days.scan_date` and `trade_research_days.scan_date` are PRIMARY KEY contracts with UPSERT; plan/snapshot uniqueness is `(scan_date,symbol)`. Duplicate fixtures remain corruption/contract guards.
- Authoritative TPEx/TWSE 2026 calendars agree on directly compared exchange-wide closures including 2026-09-25 and 2026-09-28; this does not establish listing venue, historical-year parity, or security-specific halt semantics.
- Main `Worker.js` hard-codes 2026 closures without source/capture/vintage/scope metadata; non-embedded years persist only `{year,holidays}`. Existing persistence cannot prove pair-specific PIT session provenance.
- Modifying shared calendar runtime/cache/date resolution is Class B proposal-first.
- Prospective-only immutable calendar provenance contract frozen: schema/year; separate authoritative TWSE/TPEx sources with marketScope/sourceUrl/capturedAt/sourceYear/status; normalized holidays; SHA-256; parityStatus; verifiedAt; captureMode=PROSPECTIVE_ONLY.
- Existing pairs remain UNKNOWN; no backfill. Any failed/missing source, year mismatch, malformed timestamp/date, parity mismatch/unverified, hash mismatch, incomplete payload, missing scope, or security-specific-halt use yields UNKNOWN/DATA_QUALITY_BLOCKED.

## B-81 retained — validator contract and deployment coupling
- `.github/workflows/v7-cloudflare.yml` triggers Production deployment on main changes to `research/**` and `tests/**` (except exact `tests/inspect_official_quality_sources.mjs`), among other paths. Directory separation alone does not prove autonomous Class A safety.
- Canonical hash v1 is UTF-8 exact compact JSON in fixed key order: `{"schemaVersion":"calendar-provenance-v1","calendarYear":YYYY,"holidays":[...sorted canonical unique dates...]}`; lowercase 64-char SHA-256.
- Pure offline conceptual interface frozen: `validateCalendarProvenance(record, pair?) -> result`, with `recordStatus`, `hashStatus`, `sourceStatus`, `parityStatus`, `prospectiveStatus`, `sessionAdjacency`, deterministic `reasons`.
- Only fully VALID prospective records with both TWSE/TPEx sources, VERIFIED_MATCH parity, valid timestamps/hash/year and eligible pair may compute structural session adjacency. No alpha inference.

## B-82 — non-deploy-triggered harness audit
### Repository evidence
- Re-read main governance/worklist/checkpoint and rechecked checkpoint blob SHA immediately before write.
- `v7-cloudflare.yml` confirms main pushes touching `research/**` or general `tests/**` trigger the Production deployment workflow.
- The only explicit tests-path exclusion found in that deploy filter is exact file `tests/inspect_official_quality_sources.mjs`.
- That excluded file is not a generic research validator harness: `.github/workflows/v7-quality-diagnostics.yml` owns it as the **Official Quality Source Diagnostics** entry point and triggers on changes to that exact file. Its job is specifically public official-source schema inspection and only executes automatically when the commit message carries `[v7-quality-diagnostics]` (or via workflow_dispatch).
- Reusing that exact file for calendar-provenance validator fixtures would mix unrelated responsibilities and change the semantics of an existing diagnostic harness. This is rejected as unsafe coupling, not treated as a loophole around the deploy filter.
- No existing purpose-fit non-deploy-triggered validator/test harness was established. No new validator/fixture file was created.

### Falsification / engineering decision
- Hypothesis falsified: “an existing excluded test harness can safely host the B-81 calendar validator without workflow/deployment semantics changes.” The only observed exclusion is purpose-specific and separately workflow-coupled.
- Therefore implementation remains stopped at the frozen B-81 contract. Creating a new safe path by editing workflow filters is itself deployment-pipeline semantics and remains **Class B proposal-first** under governance.
- No approval is requested prematurely because no formal behavior needs changing and the next useful work is research/data-quality analysis.

### Bias / safety audit
- PIT/look-ahead: no existing R03/R06 pair upgraded; no historical calendar/Shadow backfill.
- Market-source bias: frozen contract still requires both TWSE and TPEx authoritative source records plus VERIFIED_MATCH.
- Selection bias/zero-pick/date clustering: no symbol cohort, selected-count filter, return or date weighting changed.
- Factor Zoo/data snooping/overfit/redundancy/transaction costs: no new factor, experiment, threshold, window, score, sampler or trading rule.
- Formal Core, Worker, KV, D1, Cron, dashboard, monitoring and push remain unchanged. No Production deployment.
- R03/R06 effect/readiness remains UNKNOWN where provenance is absent; UNKNOWN is not BAD/0.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Do not use `tests/inspect_official_quality_sources.mjs` as a calendar-validator loophole. Preserve B-81/B-82 deployment-coupling evidence; any workflow-path change or main validator implementation is Class B proposal-first.
4. Move to the next unresolved R03/R06 data-quality question: audit whether `topSectors` order itself is durably PIT-derived and whether ties/non-finite sector scores can make “Top5” ordering unstable. Use existing persisted fields/source only; do not invent tie-breakers or thresholds. If provenance/order cannot be proven, mark ordering readiness UNKNOWN while preserving set-membership readiness separately.
5. Do not modify shared calendar runtime/cache/date resolution; do not retroactively upgrade B-73/B-74 pairs; no historical Shadow/calendar backfill.
6. If trusted read-only Production evidence becomes available, prioritize current formal plan/readback and actual D1 integrity over helper work.
7. If exact-source execution becomes available, verify B-73 branch exact head/blobs before test; only exit 0 + fixture PASS may upgrade SOURCE_WRITTEN_NOT_EXECUTED.
8. Keep B-62 proposal-only; do not repeat listing-venue discovery. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
