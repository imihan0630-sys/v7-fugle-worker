# Research Checkpoint

Checkpoint sequence: B-83.
Updated: 2026-09-24 03:12 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Previous verified production/research baseline through B-72 was V8.8.2. Repository evidence is not Production readback.
- Prior deployment commit retained: `12faf559558efe429c6deb93aa9a193a3557968c`, `Deploy V8.9.1 three-pool dashboard`.
- No newer trusted live Production plan/readback established through B-83. Live plan status remains UNKNOWN.
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
- Top5 **set-membership** readiness is YES only when persisted `topSectors` has at least five unique non-empty industry names; insufficient parseable list = NO; absent/non-array/malformed = UNKNOWN. B-83 separates this from Top5 **ordering** readiness, which remains UNKNOWN unless deterministic order provenance is proven.

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

## B-81/B-82 retained — validator contract and deployment coupling
- `.github/workflows/v7-cloudflare.yml` triggers Production deployment on main changes to `research/**` and `tests/**` (except exact `tests/inspect_official_quality_sources.mjs`), among other paths. Directory separation alone does not prove autonomous Class A safety.
- Canonical hash v1 is UTF-8 exact compact JSON in fixed key order: `{"schemaVersion":"calendar-provenance-v1","calendarYear":YYYY,"holidays":[...sorted canonical unique dates...]}`; lowercase 64-char SHA-256.
- Pure offline conceptual interface frozen: `validateCalendarProvenance(record, pair?) -> result`, with `recordStatus`, `hashStatus`, `sourceStatus`, `parityStatus`, `prospectiveStatus`, `sessionAdjacency`, deterministic `reasons`.
- Only fully VALID prospective records with both TWSE/TPEx sources, VERIFIED_MATCH parity, valid timestamps/hash/year and eligible pair may compute structural session adjacency. No alpha inference.
- B-82 found no purpose-fit non-deploy-triggered validator/test harness. The one excluded test file is separately coupled to Official Quality Source Diagnostics and is not a loophole. Workflow-path changes remain Class B proposal-first; validator implementation remains stopped at contract.

## B-83 — R03 Top5 ordering provenance / tie stability audit
### Repository evidence
- Re-read governance/worklist/checkpoint and latest main commit; immediately before write, checkpoint blob SHA was still `7daed14a47d66d8724c1cac4dd0c66f964f6d873` (B-82), so no concurrent A checkpoint had to be merged.
- The original research-market implementation constructs `topSectors` directly at scan time from `sectorStats` and persists the resulting market JSON; therefore the **industry names/set membership are PIT-derived**, not reconstructed from later data.
- However ordering is `Object.entries(sectorStats||{}).sort((a,b)=>(toNumber(b[1]?.score)||0)-(toNumber(a[1]?.score)||0))`, then `.slice(0,20)` and assigns `rank=index+1`.
- There is no explicit secondary tie-break key in that persisted ordering rule. Exact/effectively equal scores therefore inherit source-entry order rather than a separately durable tie-break provenance.
- Non-finite/missing sector scores are coerced by the ordering expression to `0` (`toNumber(... ) || 0`) and persisted score also becomes `0`; the durable row does not distinguish a genuine numeric zero from missing/non-finite score provenance.
- Existing R03 consumer `researchRegimePersistenceFromDays()` takes persisted `topSectors.slice(0,5)` and treats those names as the Top5 set. It does not validate rank uniqueness, score finiteness provenance, boundary ties, or ordering determinism before calculating retention/streaks.

### Falsification / interpretation
- Hypothesis partially falsified: “persisted Top5 order is fully deterministic from durable PIT ranking evidence.” PIT set membership is supported, but deterministic **ordering provenance is not proven** because ties have no explicit persisted tie-break contract and missing/non-finite scores collapse to zero.
- Do **not** relabel the existing Top5 names as BAD or discard them. Preserve two separate readiness dimensions:
  - `TOP5_SET_MEMBERSHIP`: existing YES/NO/UNKNOWN rule based on five unique non-empty persisted industry names.
  - `TOP5_ORDERING`: UNKNOWN when score provenance is missing/non-finite, rank is malformed/duplicate, or the Top5 boundary/order depends on an unresolved equal-score tie; otherwise it may be structurally ordered only from persisted finite scores/ranks.
- R03 overlap/retention is mathematically a set operation, so internal ordering among an unambiguous persisted five-name set is not itself required. But a tie spanning the 5th/6th boundary can change which sector enters the set, so boundary-tie provenance matters for Top5 set interpretation.
- No tie-breaker (industry name, breadth, amount, insertion order, etc.) is invented retrospectively. No threshold is introduced.

### Bias / safety audit
- PIT/look-ahead: no current sector data backfilled into historical research rows; analysis uses the persisted writer/consumer contract only.
- Selection/data-snooping: no sector was chosen or removed based on future return; no parameter/tie-break scan.
- Factor Zoo/overfit/redundancy/transaction costs: no new factor, experiment, score, window or trading rule.
- Coverage/zero-pick/date cluster: denominator dates unchanged; zero-pick days remain expected research dates.
- Market-source bias: no TWSE/TPEx venue inference added.
- Formal Core, Worker, storage, Cron, dashboard, monitoring and push unchanged; no Production deployment.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Continue R03/R06 data-quality audit without code changes: inspect the **producer of `sectorStats`** to determine whether sector object insertion order is itself deterministic from a stable scan-time source, and whether a 5th/6th equal-score boundary can occur with persisted rounded score versus raw sort score. Distinguish raw-score tie from display-rounding tie; do not invent a tie-breaker.
4. Audit persisted `topSectors.rank` contract: malformed/duplicate/missing ranks and disagreement between array position and rank must remain DATA_QUALITY/UNKNOWN for ordering, while set-membership may remain independently usable.
5. Preserve B-81/B-82 deployment-coupling evidence; do not implement validator/helper on main merely because it is research-only. Any workflow-path change remains Class B proposal-first.
6. Do not modify shared calendar runtime/cache/date resolution; do not retroactively upgrade B-73/B-74 pairs; no historical Shadow/calendar backfill.
7. If exact-source execution becomes available, verify B-73 branch exact head/blobs before test; only exit 0 + fixture PASS may upgrade SOURCE_WRITTEN_NOT_EXECUTED.
8. Keep B-62 proposal-only; do not repeat listing-venue discovery. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
