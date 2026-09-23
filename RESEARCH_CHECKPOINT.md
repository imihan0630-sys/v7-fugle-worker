# Research Checkpoint

Checkpoint sequence: B-70.
Updated: 2026-09-23 20:44 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified production/research infrastructure baseline: V8.8.2 `8.8.2-zero-selection-push-guard`, schema `execution-shadow-v2`; pre-change backup V8.8.1.
- Last verified prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 scheduled health positively verified selectedCount=0, planCount=0, signalCount=0; preserve as formal zero-pick date, not Execution Alpha failure. `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.
- No newer trusted Production plan readback was available through B-70; live plan status remains UNKNOWN rather than assumed zero.

## Primary research lane retained
- Root funnel: `universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
- 2026-09-16: 1,873 scanned -> 3 selected.
- 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 liquidity rejects, 335 no A/B formation, 71 RR<2.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; evidence-coverage gap, not proof gate is wrong.
- Signal observation != brokerage fill. Confirmed fills/reduced shares remain UNKNOWN absent trusted reconciliation.
- 09/17 selected pair vs near-miss evidence remains one independent date only; no filter change.

## Provenance/readiness retained through B-61
- Legacy counterfactual null horizons conflate missing/malformed provenance with immature outcomes; legacy coverage cannot explain cause.
- Price Path uses only frozen R01 priorHigh20 + future 3-close hold/fail; R05 next-day Overnight/Intraday; R07/R08 same-date medians of residualSectorRs20 and volumeTodayVsPrev5. No new thresholds/windows/composites.
- `readShadowCounterfactualResearch()` can read up to 5000 Shadow rows but returns only last 80 row-level recentOutcomes; never treat 80 as full archive.
- Existing aggregate diagnostics are maturity/effect-conditioned and cannot be field-readiness denominators.
- Regime is separate `trade_research_days.market_json`; shared-runtime join is Class B proposal-first.
- Authenticated dashboard route is source-proven GET `/api/research/dashboard?days=...`; finite-value runtime coverage remains UNKNOWN without authorized readback.
- `.github/workflows/v7-cloudflare.yml` includes `research/**` in production deploy triggers; branch-only helpers remain safest until deployment neutrality is proven.
- Branch `research/b57-price-path-readiness`; B-58/B-59/B-60 semantics frozen. Tests remain `SOURCE_WRITTEN_NOT_EXECUTED`; provenance exact path remains `EXACT_SOURCE_NOT_RUN`.

## B-62 liquidity-control coverage retained
- Current Shadow conditions on surviving base/liquidity and cannot falsify the largest liquidity reject gate.
- Prospective reason-preserving `PRE_BASE_LIQUIDITY_CONTROL` requires shared formal scan + durable storage, therefore **Class B proposal-only**. Do not overload frozen `REJECTED_AFTER_BASE`.

## B-63 through B-68 BROAD_CONTROL audit retained
- BROAD_CONTROL is deterministic pool-stratified eligible-survivor control, max 6 GENERAL + 6 THOUSAND, not full-universe random control.
- Durable Shadow has pool and scan-time industry but no source-proven immutable per-symbol TWSE/TPEx venue; venue remains UNKNOWN.
- Branch `research/b67-broad-control-concentration` isolated/not deployed. Duplicate scan_date+symbol keys are data-quality anomalies excluded from effective concentration denominators. Branch head `88fcd9cf4e407ded46daf5b00cdfa44ea811f18d`.
- No alpha threshold, sampler/seed/cap change or concentration pass/fail rule. Tests `SOURCE_WRITTEN_NOT_EXECUTED`; deployment NONE.

## B-69 pre-maturity falsifier audit retained
- R01/R04/R07/R08 directional falsifiers are outcome-dependent; R05 is next-day path-dependent; R02 Selection Alpha outcome-dependent while Execution Alpha requires a real first BUY observation.
- R03/R06 sequence structure is the clean pre-maturity lane: prospective date coverage, Top5 overlap/persistence availability, regime transition availability/stability and UNKNOWN provenance. This is measurability/readiness evidence, not alpha direction.
- No new falsifier, factor, window, threshold, split or experiment was added.

## NEW B-70 — R03/R06 sequence preservation source audit
### Source-proven implementation findings
- `researchRegimePersistenceFromDays(days)` first filters input to rows where `market.regime` exists and is not `UNKNOWN`, then sorts only those surviving rows. Therefore its `usableDays`, adjacent transitions, Top5 retention and streaks are conditioned on known-regime rows.
- `readResearchRegimePersistence(env,days)` reads `scan_date,market_json` from `trade_research_days`, but JSON parse failures are caught and silently omitted (`catch(_) {}`). The current aggregate therefore cannot distinguish a genuinely absent research date, an UNKNOWN-regime date, and a malformed `market_json` row.
- Consequence: current R03/R06 aggregate is valid only as a descriptive statistic over **usable known-regime rows**. It is not a readiness denominator and must not be used to claim prospective date coverage or sequence completeness.
- Important adjacency caveat: after filtering UNKNOWN rows, two surviving dates can become adjacent in the `usable` array even if an intervening persisted formal research date had UNKNOWN/malformed regime. A transition/Top5 retention computed across that gap is not proof of contiguous formal-research-date continuity.
- This is a measurable negative-evidence/data-quality finding: missing/UNKNOWN sequence evidence is currently **silently skipped at the aggregate layer**. It does not imply R03/R06 alpha is bad and must not be coerced to BAD/0.

### Zero-pick / persistence status
- Source audit in this run positively proves the reader query is driven by rows present in `trade_research_days`; it does **not yet prove** that every formal scan date, including zero-pick dates, is persisted there.
- Therefore `ZERO_PICK_DATE_INCLUDED_IN_RESEARCH_DAY_SEQUENCE` remains **UNKNOWN** pending writer-path audit. Do not infer inclusion from the 2026-09-22 health record.

### Safe readiness semantics now frozen
A future descriptive readiness table must preserve, per prospective formal research date, separate states rather than pre-filtering:
- `ROW_AVAILABLE_KNOWN_REGIME`
- `ROW_AVAILABLE_UNKNOWN_REGIME`
- `ROW_AVAILABLE_MALFORMED_MARKET_JSON`
- `FORMAL_DATE_EXPECTED_ROW_NOT_PROVEN` only when an independent trusted formal-date source establishes the expected date.

Adjacent-pair availability must require two consecutive **expected prospective formal research dates** with parseable rows; it must not bridge silently across UNKNOWN/malformed/missing dates. No numeric stability threshold is introduced.

### Bias / governance audit
- Selection bias: exposing skipped dates prevents known-regime-only conditioning from masquerading as full sequence evidence.
- Look-ahead: only prospective persisted research-day rows and independently trusted formal dates may be used; no current metadata backfill.
- Data snooping / Factor Zoo / overfit: no new experiment, factor, threshold, regime definition or Top5 rule.
- Coverage / zero-pick: zero-pick inclusion remains UNKNOWN until writer-path proof.
- Date clustering: date remains the unit; no same-day stock inflation.
- Transaction cost: not applicable to this structural readiness audit.

### Engineering status
- Documentation/checkpoint audit only. No Worker/schema/runtime/workflow/Formal Core/monitoring/push change. No deployment.
- This finding means the existing aggregate should **not** be modified in place merely to expose readiness; changing shared research runtime would be Class B. Prefer an offline supplied-row Class A helper only after the writer/date-source semantics are proven.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Continue B-70 by source-auditing the **writer path for `trade_research_days`**: prove exactly when a row is inserted/upserted, whether a completed zero-pick formal scan writes a row, and whether `market_json` stores UNKNOWN explicitly versus omitting/failing the row. Do not infer from reader behavior.
4. Identify an independent trusted prospective formal-date source already persisted by the system that can establish expected dates without future/current metadata backfill. If none exists, expected-date completeness remains UNKNOWN and the readiness table must say so.
5. Only after 3-4 are source-proven, define a descriptive R03/R06 readiness table: expected dates, persisted rows, known/UNKNOWN/malformed states, adjacent-pair computability, observed transition count, Top5-overlap computability. No alpha and no stability pass/fail threshold.
6. Keep B-62 proposal-only; do not repeat listing-venue discovery. B-67/B-68 semantics frozen and applied only to trusted persisted BROAD_CONTROL rows.
7. Keep diagnostic branches branch-only; do not wire to main/runtime. Existing tests remain `SOURCE_WRITTEN_NOT_EXECUTED` until exact branch source is actually run.
8. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
