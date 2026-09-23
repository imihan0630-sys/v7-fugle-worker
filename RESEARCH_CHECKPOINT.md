# Research Checkpoint

Checkpoint sequence: B-64.
Updated: 2026-09-23 17:42 Asia/Taipei.

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
- This run attempted public Production root readback, but the available web reader could not access the Worker URL. No newer Production plan is inferred; live status remains UNKNOWN rather than assumed zero.
- Formal selection, A/B qualification, BUY/ADD/REDUCE/SELL/STOP, capital allocation and research definitions remain unchanged.

## Primary research lane retained
Root funnel: `universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
- 2026-09-16: 1,873 scanned -> 3 selected.
- 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 liquidity rejects, 335 no A/B formation, 71 RR<2.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; evidence-coverage gap, not proof gate is wrong.
- `v8_trade_journal_signals` establishes formal signal observations when durably readable, not brokerage fills. Confirmed fills remain UNKNOWN absent trusted reconciliation.
- 09/17 selected pair 4763/1301 through 09/22: endpoint about +0.37%, average MFE +7.55%, MAE -0.57%; near-miss 12 endpoint about -0.77%, MFE +1.12%, MAE -1.46%. One independent date only; no filter change.
- 8046 restoration and `HUMAN_MOMENTUM_SHADOW` remain research-only; keep execution-alpha separate from near-miss selection rescue.

## Provenance/readiness lane retained through B-61
- Counterfactual path can collapse malformed snapshot/history, missing history, and valid-but-insufficient observed history into legacy null horizons; legacy `coverage.dN` cannot explain cause.
- B-13 isolated helper distinguishes snapshot, baseline, history, post-scan valid bars and horizon provenance. Safest design remains parallel/additive; do not alter legacy outcome/coverage semantics.
- `research/b13-shadow-provenance` remains isolated/not deployed. Exact-path fixture remains `LOCAL_RECONSTRUCTED_ASSERTION_PASS / EXACT_SOURCE_NOT_RUN`; CI NOT_RUN. Do not repeat transport discovery without new capability/approval.
- Fundamental Persistence remains UNKNOWN/context-only; no arbitrary windows or historical PIT backfill.
- Price Path uses only frozen R01 `priorHigh20` + future 3-close hold/fail; R05 next-day Overnight/Intraday; R07/R08 same-date medians of `residualSectorRs20` and `volumeTodayVsPrev5`. No new thresholds/windows/composite scores.
- `readShadowCounterfactualResearch()` reads up to 5000 Shadow rows but returns only last 80 row-level `recentOutcomes`; do not treat 80 as full archive.
- Existing aggregate diagnostics are maturity/effect-conditioned and cannot be reused as field-readiness denominators.
- Regime is a separate `trade_research_days.market_json` path; shared-runtime join is Class B proposal-first.
- Authenticated dashboard route is source-proven GET `/api/research/dashboard?days=...`; no authorized live dashboard response has been read in this automation context. Runtime finite-value coverage remains UNKNOWN.
- `.github/workflows/v7-cloudflare.yml` means `research/**` changes on main enter production deployment; research helper code stays branch-only unless deployment neutrality is proven.
- Branch `research/b57-price-path-readiness`; matrix unit `INDEPENDENT_SCAN_DATE_X_COHORT`; scan-time field state is separate from future outcome state. B-58/B-59/B-60 semantics frozen; B-61 trusted-execution contract remains unmet. Tests remain `SOURCE_WRITTEN_NOT_EXECUTED`; branch not wired/deployed.

## B-62 — liquidity-reject/control coverage isolation audit
- Current Shadow conditions on surviving base/liquidity; it cannot falsify the largest observed liquidity reject gate.
- A prospective reason-preserving `PRE_BASE_LIQUIDITY_CONTROL` would require capture inside shared formal scan plus durable storage, so direct implementation is **Class B proposal-only**. Do not overload frozen `REJECTED_AFTER_BASE`.
- No implementation/runtime/schema change was made. Any future approved capture must be prospective only, preserve exact rejection reason/UNKNOWN, stay outside formal ranking/trading/push, and reconcile same-date counts against formal exclusion aggregates.

## B-63 — BROAD_CONTROL sampling-bias audit retained
- `buildShadowCandidateArchive()` uses a shared `used` set; BROAD_CONTROL comes after earlier cohorts and only from unused eligible feature rows.
- Eligibility requires >=60 history days, minimum close, and pool-dependent liquidity floor. Controls are ordered by deterministic `researchStableHash(scanDate + "|" + symbol)` and capped at 6 GENERAL + 6 THOUSAND.
- This is reproducible capped pool-stratified pseudo-random sampling of eligible survivors, not a full-universe random control. Market/industry are not stratification axes.
- R02 same-date pairing reduces row-count dominance but does not prove representative market/industry composition. Actual per-date market/industry mix remains UNKNOWN without trusted full prospective rows.
- Frozen R02 semantics unchanged; alternate samplers require a separately preregistered research version.

## NEW B-64 — BROAD_CONTROL repeated-symbol / industry concentration readiness audit
### Research question
Can deterministic date+symbol hashing plus fixed 6/6 pool caps create repeated-symbol or industry concentration across prospective dates, and what diagnostic-only evidence can detect it without changing the frozen sampler?

### Supporting / falsifying reasoning
- The hash input includes `scanDate`, so the ordering for a given symbol changes across dates. This is evidence **against** a mechanically fixed permanent control basket; there is no source rule that deliberately reuses yesterday's symbols.
- However, date-varying deterministic hash is not proof of statistical independence or representativeness. A symbol that remains in a small eligible pool can be sampled repeatedly simply because the eligible choice set is small; the risk is especially relevant when a pool has near-cap cardinality.
- The 6/6 caps constrain price-pool count, not industry or market composition. If eligible survivors on a date are industry-concentrated, BROAD_CONTROL can inherit that concentration. Hash ordering cannot repair a concentrated source population.
- Prior-cohort exclusion (`used`) changes the eligible control set date by date. A symbol/industry heavily represented in SELECTED/QUALIFIED/NEAR_MISS/REJECTED_AFTER_BASE is mechanically less available to BROAD_CONTROL that day, so control composition can also reflect earlier-cohort composition rather than only the broad eligible universe.
- Therefore repeated-symbol and industry concentration are structurally possible but **empirical magnitude is UNKNOWN** until multiple prospective dates with complete row metadata are durably readable. One date cannot measure cross-date repeat share.

### Diagnostic-only concentration/readiness specification (no sampler change)
Use existing prospective BROAD_CONTROL rows only; do not backfill or resample. Evidence unit remains independent scan date.
- `effectiveControlsByDate`: count BROAD_CONTROL rows per scan date, total and by GENERAL/THOUSAND. This is descriptive coverage, not an alpha weight.
- `distinctControlSymbols`: distinct BROAD_CONTROL symbols across the observed prospective window.
- `repeatSymbolRows`: number/share of control rows whose symbol appeared as BROAD_CONTROL on at least one earlier prospective scan date; also report `maxAppearancesPerSymbol`. Do not define a pass/fail threshold yet.
- `marketCoverageByDate`: TWSE/TPEx/UNKNOWN counts **only when immutable scan-time market metadata exists**. Missing market remains UNKNOWN.
- `industryCoverageByDate`: distinct industry count, UNKNOWN-industry count, and largest-industry row share **only when scan-time industry metadata exists**. Do not infer industry from current data for older rows.
- `poolIndustryCrossTabByDate`: GENERAL/THOUSAND x industry counts when both fields exist, to distinguish price-pool scarcity from industry concentration.
- `eligibleDenominatorState`: UNKNOWN unless the same-date full eligible-unused population denominator is durably available. Without that denominator, do not report sampling fraction or claim representativeness.
- `readiness`: `WAITING_DATA` for <2 independent prospective scan dates; `DESCRIPTIVE_READY` only means repeat/concentration can be described, never that R02 is promotion-ready. Existing R02 maturity gates remain authoritative; no new alpha threshold is created.

### Bias / overfit / data-quality audit
- Selection bias: diagnostics describe the frozen eligible-survivor control only; they cannot generalize to pre-base rejects or full universe.
- Look-ahead: use only scan-time metadata stored with each prospective row. No current industry/market backfill into prior dates.
- Data snooping / Factor Zoo: no alternate hash seed, cap, concentration threshold, factor, return window or comparator is searched.
- Market-source bias: explicit TWSE/TPEx/UNKNOWN counts expose rather than silently coerce missing market metadata.
- Overfit: no return-conditioned choice is made. Concentration is measured before any attempt to reinterpret R02 effect.
- Redundancy: these are sampling-quality diagnostics, not substitutes for R02 Selection Alpha, B-62 pre-base control, or transaction-cost analysis.
- Transaction costs: unchanged; concentration diagnostics do not imply executability.
- Date clustering: repeat share is descriptive across dates; same-day rows remain one evidence cluster.
- Coverage/zero-pick: dates with BROAD_CONTROL but zero SELECTED may contribute concentration diagnostics but still cannot form paired R02 alpha.

### Engineering classification / action
- Class A, checkpoint-only diagnostic specification. No Worker, research helper, schema, workflow, runtime, sampler, Formal Core, monitoring or push change.
- No executable test claimed. Empirical values remain UNKNOWN because trusted full prospective BROAD_CONTROL rows/metadata are unavailable in this automation context.
- Do not implement a new sampler or threshold from these diagnostics. Any future alternative market/industry-stratified control is a new preregistered research comparator/version and cannot overwrite R02.

### R01-R08 / I01-I07 impact
- R02 only: adds a diagnostic interpretation layer for control-sample concentration/readiness; frozen cohort and effect calculation unchanged.
- R01/R03-R08 unchanged. I01-I07 unchanged. No R09/I08.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Keep B-62 liquidity-control implementation proposal-only unless owner explicitly approves the Class B shared-runtime/storage change.
4. Continue Class A falsification without changing R02: audit whether the existing stored Shadow row schema actually contains immutable `market` and `industry/sector` metadata needed for B-64 diagnostics, and whether BROAD_CONTROL rows expose pool consistently. If absent, mark the corresponding diagnostic field UNKNOWN; do not join current metadata or alter shared runtime/storage.
5. If metadata is source-proven available, define a branch/offline diagnostic over supplied rows only; do not wire it to main/runtime until deployment neutrality is proven. If exact execution remains unavailable, keep test status honest.
6. Do not create alternate sampler/seed/cap/threshold/experiment. Readiness test remains `SOURCE_WRITTEN_NOT_EXECUTED`; provenance exact-path remains `EXACT_SOURCE_NOT_RUN`.
7. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
