# Research Checkpoint

Checkpoint sequence: B-80.
Updated: 2026-09-24 01:39 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Previous verified production/research baseline through B-72 was V8.8.2. Repository evidence is not Production readback.
- Prior deployment commit retained from checkpoint: `12faf559558efe429c6deb93aa9a193a3557968c`, `Deploy V8.9.1 three-pool dashboard`.
- No newer trusted live Production plan/readback established in B-80. Live plan status remains UNKNOWN; direct public `/api/version` readback was inaccessible to the available web reader in B-80 and is not treated as evidence.
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

## B-79 retained — calendar persistence provenance source audit
- Current main `Worker.js` hard-codes the 2026 closure set without source/capture/vintage/scope metadata. For non-embedded years, `loadTradingCalendar()` accepts/persists KV `{year,holidays}` only; source URL exists only in code and is not part of durable payload.
- Therefore existing calendar persistence cannot prove pair-specific PIT session provenance. Existing B-73/B-74 `exchangeSessionAdjacency=UNKNOWN` remains correct and no historical pair is upgraded.
- Modifying `loadTradingCalendar`, `MARKET_CALENDARS`, shared KV calendar payload, or formal date resolution is Class B proposal-first.

## B-80 — smallest prospective-only R03/R06 calendar-provenance contract design
### Isolation finding
- Current repository tree has a dedicated `research/` subtree separate from `Worker.js`; a provenance artifact can be represented as a research-only file/record without modifying `MARKET_CALENDARS`, `loadTradingCalendar`, `isTradingDate`, shared KV keys, D1 schema, formal scan routes, Cron, dashboard, push, or deployment workflow.
- This supports a **Class A design path only if the artifact remains write/read isolated**: formal runtime must never import or consult it, and R03/R06 offline readiness may consume it only as supplied research evidence.
- Automatic capture through an existing deployment/runtime workflow would cross the Class B boundary. B-80 therefore designs the contract but does not add workflow/runtime persistence.

### Minimal prospective record contract
One immutable research record per `calendarYear + captureId` (or content hash), captured only from the approval/implementation date forward:
- `schemaVersion`: fixed research provenance schema identifier.
- `calendarYear`: integer year asserted by source.
- `sources`: explicit authoritative source records for TWSE and TPEx, each containing `marketScope`, exact `sourceUrl`, `capturedAt`, `sourceYear`, and fetch/parse status.
- `holidays`: normalized sorted unique `YYYY-MM-DD` exchange-wide closure dates only; weekends remain calendar logic, not duplicated as holidays.
- `holidaySetSha256`: deterministic SHA-256 over canonical normalized holiday payload.
- `parityStatus`: `VERIFIED_MATCH`, `UNVERIFIED`, or `MISMATCH`; only VERIFIED_MATCH may support shared TWSE/TPEx exchange-wide adjacency for the directly verified year.
- `verifiedAt`: timestamp when both authoritative payloads were successfully compared; must not predate either source capture.
- `captureMode`: `PROSPECTIVE_ONLY`; no historical reconstruction flag is permitted.
- `notes`: optional bounded research note; never a substitute for machine fields.

### Pair-use semantics
- A future R03/R06 pair may be session-adjacency READY only when both dates are on/after the provenance record's `verifiedAt` date boundary as governed prospectively, both fall within the proven `calendarYear`, the record hash verifies, parityStatus is VERIFIED_MATCH, and the normalized calendar proves there is no intervening trading session.
- The artifact proves exchange-wide session adjacency only. It does not prove individual-stock tradability, listing venue, security-specific halt, or outcome availability.
- Existing 2026 pairs created before this artifact exists remain UNKNOWN; B-78/B-79 evidence is not retroactively promoted into row-level PIT provenance.

### Falsification / data-quality semantics
Any of the following yields `UNKNOWN` / `DATA_QUALITY_BLOCKED`, never inferred adjacency and never BAD/0:
- either authoritative source fetch failed, timed out, returned non-parseable content, or lacks the asserted year;
- TWSE/TPEx normalized closure sets are not both present or parity is UNVERIFIED/MISMATCH;
- `calendarYear` disagrees with either sourceYear or requested pair year;
- `capturedAt` or `verifiedAt` is absent/malformed, `verifiedAt` predates a source capture, or pair evidence would require using a record not yet verified at the governed prospective boundary;
- holiday list contains malformed dates, duplicates before normalization that cannot be explained safely, out-of-year dates, or an empty/unreasonably incomplete payload without authoritative confirmation;
- recomputed canonical SHA-256 differs from `holidaySetSha256`;
- source URL/scope is missing, changed without a new immutable capture, or one market is represented only by the other market's source;
- any attempt is made to use the artifact for security-specific halt semantics.

### Bias / governance audit
- Look-ahead/PIT: artifact is prospective-only; no backfill and no existing pair upgrade.
- Market-source bias: requires separate authoritative TWSE + TPEx records and explicit parity state rather than assuming one market represents both.
- Selection bias / zero-pick / date clustering: calendar provenance is independent of selected symbols; one formal scan date remains one evidence unit.
- Data snooping / Factor Zoo / overfit / redundancy / transaction cost: no factor, score, threshold, return window, sampler, experiment, or trading rule added.
- R03/R06 impact: improves future evidence measurability only; no alpha conclusion.
- I01-I07 impact: none to formal instrumentation; this is a research provenance contract design.
- Engineering classification: **Class A design/proposal** if kept entirely under isolated research artifacts and supplied-row analysis; any shared runtime, KV/D1, workflow/deployment, formal date resolver, dashboard, or push integration is **Class B proposal-first**.
- Implementation/tests/deployment: none in B-80. No branch/file beyond checkpoint changed; no Production deployment. Formal Core invariants unchanged by construction.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Preserve B-77 uniqueness proof, B-78 parity scope, B-79 persistence proof, and B-80 isolation boundary. Do not modify shared calendar runtime/cache/date resolution.
4. Next, define the canonical hash serialization and a supplied-record validator interface for the B-80 contract, including exact status outputs for all falsification cases. Keep it offline/research-only and do not implement runtime persistence or workflows.
5. Before coding any Class A validator, prove from repository imports/workflows that the chosen `research/` file is not imported by Worker/formal runtime; if isolation cannot be proven, stop at Class B proposal-only.
6. Do not retroactively upgrade B-73/B-74 pairs and do not backfill historical Shadow/calendar provenance.
7. If a trusted read-only Production D1/schema path becomes available, check actual table definitions/integrity for duplicate rows without mutating storage; source contracts alone do not prove historical DB integrity.
8. If exact-source execution becomes available, verify branch head `0277b0fb1e8a82fbd7ca8d77f9883d64d375d3b0` and exact blobs, then execute the test; only exit 0 + fixture PASS may upgrade SOURCE_WRITTEN_NOT_EXECUTED.
9. Do not wire helper into runtime/dashboard. Keep B-62 proposal-only; do not repeat listing-venue discovery.
10. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
