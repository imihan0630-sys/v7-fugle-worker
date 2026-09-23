# Research Checkpoint

Checkpoint sequence: B-67.
Updated: 2026-09-23 19:11 Asia/Taipei.

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
- No newer trusted Production plan readback was available in this run; live plan status remains UNKNOWN rather than assumed zero.
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
- Counterfactual legacy null horizons can conflate malformed/missing provenance with immature outcomes; legacy `coverage.dN` cannot explain cause.
- `research/b13-shadow-provenance` remains isolated/not deployed. Exact-path fixture remains `LOCAL_RECONSTRUCTED_ASSERTION_PASS / EXACT_SOURCE_NOT_RUN`; CI NOT_RUN. Do not repeat transport discovery without new capability/approval.
- Price Path uses only frozen R01 `priorHigh20` + future 3-close hold/fail; R05 next-day Overnight/Intraday; R07/R08 same-date medians of `residualSectorRs20` and `volumeTodayVsPrev5`. No new thresholds/windows/composite scores.
- `readShadowCounterfactualResearch()` reads up to 5000 Shadow rows but returns only last 80 row-level `recentOutcomes`; do not treat 80 as full archive.
- Existing aggregate diagnostics are maturity/effect-conditioned and cannot be reused as field-readiness denominators.
- Regime is a separate `trade_research_days.market_json` path; shared-runtime join is Class B proposal-first.
- Authenticated dashboard route is source-proven GET `/api/research/dashboard?days=...`; runtime finite-value coverage remains UNKNOWN without authorized readback.
- `.github/workflows/v7-cloudflare.yml` includes `research/**` in production deploy triggers; branch-only research helper remains safest until deployment neutrality is proven.
- Branch `research/b57-price-path-readiness`; matrix unit `INDEPENDENT_SCAN_DATE_X_COHORT`; B-58/B-59/B-60 semantics frozen; B-61 trusted-execution contract unmet. Tests remain `SOURCE_WRITTEN_NOT_EXECUTED`.

## B-62 — liquidity-reject/control coverage isolation audit retained
- Current Shadow conditions on surviving base/liquidity; it cannot falsify the largest observed liquidity reject gate.
- A prospective reason-preserving `PRE_BASE_LIQUIDITY_CONTROL` requires capture inside shared formal scan plus durable storage, so implementation is **Class B proposal-only**. Do not overload frozen `REJECTED_AFTER_BASE`.
- Any future approved capture must be prospective only, preserve exact rejection reason/UNKNOWN, stay outside formal ranking/trading/push, and reconcile same-date counts against formal exclusion aggregates.

## B-63/B-64 — BROAD_CONTROL sampling/concentration audit retained
- BROAD_CONTROL is sampled after earlier cohorts from unused eligible feature rows; eligibility requires >=60 history days, minimum close and pool-dependent liquidity floor.
- Deterministic `researchStableHash(scanDate + "|" + symbol)` ordering plus caps of 6 GENERAL + 6 THOUSAND makes a reproducible pool-stratified eligible-survivor control, not a full-universe random control.
- Date in the hash argues against a deliberately fixed permanent basket, but does not prove independence/representativeness. Small eligible pools can repeat symbols; industry concentration can be inherited from the source population and prior-cohort exclusion.
- R02 same-date pairing reduces row-count dominance but does not establish representative control composition. No alternate sampler/seed/cap/threshold.

## B-65/B-66 — immutable Shadow metadata audit / venue search frozen
- `trade_research_shadow_candidates` persists pool but no explicit listing venue; `snapshot.sector.name` is the immutable scan-time industry source.
- Snapshot `market` is regime/context, not individual-stock TWSE/TPEx venue. No separate immutable per-symbol listing-venue path keyed by scan_date+symbol was source-proven.
- Therefore TWSE/TPEx composition for existing persisted Shadow rows is frozen UNKNOWN. Do not infer venue from symbol/current listings/current metadata.
- Adding venue capture to shared scan/storage remains Class B proposal-first and was not implemented.

## NEW B-67 — offline BROAD_CONTROL concentration diagnostic
### Engineering result
- Created isolated branch `research/b67-broad-control-concentration` from main `0ba33de334c743250cdb4c82e5213b9b3bdae9be`.
- Added `research/broad_control_concentration.mjs` and fixture `research/broad_control_concentration.test.mjs`; branch head after fixture commit `251a1dbf0b584552d85a11827285c48089eb5a00`.
- Helper accepts supplied rows only and filters strictly to `cohort === BROAD_CONTROL`; it does not fetch runtime data and has no formal/runtime dependency.
- Outputs: effective controls/date, distinct symbols/date, within-date duplicate rows, industry known/unknown and non-null coverage, largest-industry share among known industries, pool x industry cross-tab, cross-date repeated symbols/max appearances, plus explicit `eligibleDenominator=UNKNOWN` and `venueCoverage=UNKNOWN`.
- Industry comes only from stored `snapshot.sector.name` (object or persisted snapshot_json). Malformed/missing snapshot industry stays UNKNOWN.
- No returns, alpha labels, thresholds, sampler changes, alternate hash seed/cap, or pass/fail concentration rule were added.

### Supporting / falsifying interpretation
- Support: the diagnostic now makes the B-63/B-64 structural concerns measurable when trusted persisted rows become available, without conditioning on future returns.
- Falsifier/limitation: source code and synthetic fixture do **not** establish empirical concentration, industry completeness, or representativeness of real BROAD_CONTROL rows. Those remain UNKNOWN until trusted prospective rows are supplied/read.
- Repeated symbols are descriptive only; recurrence is not automatically BAD because deterministic date-varying sampling can legitimately reselect an eligible survivor.
- Largest-industry share uses known-industry rows as denominator and separately reports unknown count, preventing missing industry from silently becoming another sector.

### Bias / overfit / data-quality audit
- Selection bias remains explicit: this diagnoses an eligible-survivor control, not the full universe.
- Look-ahead guarded: no current metadata joins; only persisted scan-time industry is used.
- Market-source bias explicit: venue remains UNKNOWN.
- Data snooping/Factor Zoo/overfit guarded: no returns, factor, window, threshold, seed, cap or experiment added.
- Coverage/date-cluster: independent scan date is retained as the primary unit; cross-date symbol recurrence is reported separately.
- Transaction cost/redundancy/zero-pick semantics unchanged; this diagnostic cannot establish alpha or executability.

### Tests / deployment
- Fixture source contains assertions for cohort filtering, two independent dates, repeated symbol detection, industry known/unknown behavior, malformed snapshot handling, largest-industry share, and venue/eligible-denominator UNKNOWN semantics.
- Exact execution was not available in this run; status is **SOURCE_WRITTEN_NOT_EXECUTED**, not PASS.
- Branch-only. No main Worker/schema/workflow/runtime/Formal Core/monitor/push change; deployment NONE.
- R02 interpretation/readiness only; R01/R03-R08 and I01-I07 unchanged. No R09/I08.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Keep B-62 liquidity-control implementation proposal-only unless owner explicitly approves the Class B shared-runtime/storage change.
4. Do not repeat listing-venue discovery; existing Shadow TWSE/TPEx coverage remains UNKNOWN unless a genuinely new immutable source appears.
5. Continue B-67 by source-auditing the offline diagnostic for denominator semantics and duplicate-row behavior. In particular decide whether same-date duplicate `scan_date+symbol` rows should be surfaced as a data-quality warning rather than silently counted as controls; do not invent a pass/fail threshold.
6. If a trusted row readback becomes available, apply the frozen diagnostic descriptively only; do not interpret concentration as alpha and do not tune sampler/seed/cap from the result.
7. Keep diagnostic branch-only; do not wire to main/runtime until deployment neutrality is proven. Test remains `SOURCE_WRITTEN_NOT_EXECUTED` until exact branch source is actually run.
8. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
