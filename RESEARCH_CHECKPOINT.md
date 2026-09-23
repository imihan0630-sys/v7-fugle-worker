# Research Checkpoint

Checkpoint sequence: B-81.
Updated: 2026-09-24 02:13 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Previous verified production/research baseline through B-72 was V8.8.2. Repository evidence is not Production readback.
- Prior deployment commit retained from checkpoint: `12faf559558efe429c6deb93aa9a193a3557968c`, `Deploy V8.9.1 three-pool dashboard`.
- No newer trusted live Production plan/readback established through B-81. Live plan status remains UNKNOWN.
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
- Branch `research/b73-r03-r06-sequence-readiness` remains isolated; no Worker import, DB query, runtime route, threshold, alpha calculation, or formal-selection wiring.
- B-73 created supplied-row readiness helper and falsification fixtures; B-74 rejected journal adjacency as proof of exchange-session adjacency; B-75 surfaces duplicate journal dates as one observation plus `DUPLICATE_DATE_ANOMALY`.
- Branch head `0277b0fb1e8a82fbd7ca8d77f9883d64d375d3b0`; helper blob `6e1228a6f8cf2547628c7d3459cd453efc9eeb9f`; test blob `437d31d8e396551decf5541869d2a407baf313c2`.
- Test status remains **SOURCE_WRITTEN_NOT_EXECUTED**; no PASS claimed.

## B-76 to B-79 retained — calendar/session provenance
- Current source has a trading-calendar subsystem, but journal-row adjacency is not exchange-session adjacency and pair-specific PIT provenance is not durable in readiness rows.
- `v8_trade_journal_days.scan_date` and `trade_research_days.scan_date` are PRIMARY KEY contracts with UPSERT; plan/snapshot uniqueness is `(scan_date,symbol)`. Duplicate fixtures remain corruption/contract guards, not normal rerun semantics.
- Authoritative TPEx/TWSE 2026 calendars agree on directly compared exchange-wide closures including 2026-09-25 and 2026-09-28; scope does not establish listing venue, historical-year parity, or security-specific halt semantics.
- Current main `Worker.js` hard-codes 2026 closures without source/capture/vintage/scope metadata; non-embedded years persist only `{year,holidays}`. Existing persistence cannot prove pair-specific PIT session provenance.
- Modifying shared calendar runtime/cache/date resolution is Class B proposal-first.

## B-80 retained — prospective-only calendar provenance contract
- Minimal immutable record: `schemaVersion`, `calendarYear`, separate authoritative TWSE/TPEx `sources` with `marketScope/sourceUrl/capturedAt/sourceYear/status`, normalized `holidays`, `holidaySetSha256`, `parityStatus`, `verifiedAt`, `captureMode=PROSPECTIVE_ONLY`, optional bounded `notes`.
- Future R03/R06 pair may use it only prospectively when year/source/timestamps/hash/parity all validate and no intervening trading session exists. Existing pairs remain UNKNOWN; no backfill.
- Any failed/missing source, year mismatch, malformed timestamp/date, parity mismatch/unverified, hash mismatch, incomplete payload, missing scope, or security-specific-halt use yields `UNKNOWN/DATA_QUALITY_BLOCKED`, never BAD/0.

## B-81 — validator contract frozen; hidden deployment coupling falsifies naive Class-A main-path assumption
### New repository counterevidence
- Main `.github/workflows/v7-cloudflare.yml` deploy workflow triggers on pushes to `main` when `research/**` changes. Therefore a new validator committed under `research/` on main is **not deployment-isolated**, even if `Worker.js` never imports it.
- This falsifies the naive hypothesis that directory separation alone proves autonomous Class A implementation safety. A `research/**` main commit can trigger the production deployment workflow and is therefore shared deployment-path risk under governance.
- No validator file was created in B-81. No workflow, Worker, KV, D1, dashboard, push, or runtime code changed.

### Canonical hash serialization v1
- Hash input is UTF-8 bytes of one exact JSON string with no whitespace and this fixed key order: `{"schemaVersion":"calendar-provenance-v1","calendarYear":YYYY,"holidays":[...sorted normalized dates...]}`.
- `holidays` must already be unique, lexicographically ascending canonical `YYYY-MM-DD`, in `calendarYear`, and represent exchange-wide weekday closures only. Validator does not silently repair duplicates/malformed/out-of-year values for hash acceptance.
- SHA output is lowercase 64-character hexadecimal SHA-256. Hash covers only schema/year/normalized holiday set; source provenance and parity are validated separately so source metadata changes require a new immutable capture record but do not masquerade as holiday-set changes.

### Supplied-record validator interface v1
Pure offline conceptual interface: `validateCalendarProvenance(record, pair?) -> result`; it performs no fetch, DB/KV read/write, clock-dependent inference, or runtime import.
Result fields are frozen as:
- `recordStatus`: `VALID` | `DATA_QUALITY_BLOCKED`.
- `hashStatus`: `VERIFIED` | `MISMATCH` | `UNKNOWN`.
- `sourceStatus`: `VERIFIED_BOTH` | `INCOMPLETE` | `INVALID`.
- `parityStatus`: preserve only `VERIFIED_MATCH` | `UNVERIFIED` | `MISMATCH`; unknown values are INVALID.
- `prospectiveStatus`: `ELIGIBLE` | `PRE_VERIFICATION_PAIR` | `INVALID_TIMESTAMP` | `OUT_OF_YEAR` | `NOT_EVALUATED`.
- `sessionAdjacency`: `READY_CONSECUTIVE` | `READY_NOT_CONSECUTIVE` | `UNKNOWN`.
- `reasons`: deterministic ordered machine codes; no free-text inference.

### Exact blocking semantics
- Missing/malformed schema/year/holidays/hash => `recordStatus=DATA_QUALITY_BLOCKED`, `sessionAdjacency=UNKNOWN`.
- Recomputed hash mismatch => `hashStatus=MISMATCH`, blocked.
- Missing one market, duplicate market scope, failed/non-parseable source, sourceYear mismatch, missing exact URL/capturedAt => source incomplete/invalid, blocked.
- `parityStatus!=VERIFIED_MATCH` => blocked for shared TWSE/TPEx adjacency; mismatch is not coerced into a directional market conclusion.
- `verifiedAt` missing/malformed or earlier than either source capture => `INVALID_TIMESTAMP`, blocked.
- Pair absent => `prospectiveStatus=NOT_EVALUATED`, adjacency UNKNOWN even for a valid record.
- Pair year mismatch/out of record year => `OUT_OF_YEAR`, adjacency UNKNOWN.
- Either pair date before the governed prospective verification date boundary => `PRE_VERIFICATION_PAIR`, adjacency UNKNOWN. No historical repair.
- Only a fully VALID record with an eligible pair may compute weekend/holiday session sequence; then exact result is READY_CONSECUTIVE or READY_NOT_CONSECUTIVE. This is structural readiness only, never alpha evidence.

### Governance/bias audit
- Engineering classification for **implementation on main under current workflow is Class B proposal-first**, because `research/**` changes trigger the production deploy workflow. No autonomous main implementation.
- A branch-only artifact remains non-production evidence but is not promoted/merged/deployed without resolving deployment coupling; checkpoint-only research documentation remains safe and does not match the deploy path filter.
- Look-ahead/PIT: no existing pair upgraded; prospective boundary explicit.
- Market-source bias: requires both TWSE and TPEx source records and VERIFIED_MATCH.
- Selection bias/zero-pick/date cluster: independent of symbols and selected count; one scan date remains one evidence unit.
- Data snooping/Factor Zoo/overfit/redundancy/transaction costs: no factor, threshold, window, return, sampler, experiment, score, or trading behavior added.
- Formal Core remains LOCKED.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Preserve B-81 deployment-coupling proof: do **not** commit a new `research/**` validator to main autonomously while `v7-cloudflare.yml` deploys on `research/**` changes. Any workflow-path change or main implementation is Class B proposal-first.
4. Next research step: audit whether an existing non-deploy-triggered location/test harness can hold supplied-record validator fixtures without changing workflow semantics. If none exists, stop implementation at the frozen B-81 contract and move to the next unresolved R03/R06 readiness/data-quality question rather than asking for approval prematurely.
5. Do not modify shared calendar runtime/cache/date resolution; do not retroactively upgrade B-73/B-74 pairs; no historical Shadow/calendar backfill.
6. If trusted read-only Production evidence becomes available, prioritize current formal plan/readback and actual D1 integrity over further helper work.
7. If exact-source execution becomes available, verify B-73 branch exact head/blobs before test; only exit 0 + fixture PASS may upgrade SOURCE_WRITTEN_NOT_EXECUTED.
8. Keep B-62 proposal-only; do not repeat listing-venue discovery. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
