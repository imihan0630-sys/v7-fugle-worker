# Research Checkpoint

Checkpoint sequence: B-57.
Updated: 2026-09-23 14:12 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified production/research infrastructure baseline: V8.8.2 `8.8.2-zero-selection-push-guard`, schema `execution-shadow-v2`; pre-change backup V8.8.1.
- Last verified prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 scheduled health positively verified selectedCount=0, planCount=0, signalCount=0; preserve as formal zero-pick date, not Execution Alpha failure. `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.
- B-13/B-16 provenance engineering remains isolated on `research/b13-shadow-provenance`; nothing from that branch is deployed.
- Formal selection, A/B qualification, BUY/ADD/REDUCE/SELL/STOP, capital allocation and research definitions remain unchanged.

## Primary research lane retained
Root funnel: `universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
- 2026-09-16: 1,873 scanned -> 3 selected.
- 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 liquidity rejects, 335 no A/B formation, 71 RR<2.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; evidence-coverage gap, not proof gate is wrong.
- `v8_trade_journal_signals` establishes formal signal observations when durably readable, not brokerage fills. Confirmed fills remain UNKNOWN absent trusted reconciliation.
- 09/17 selected pair 4763/1301 through 09/22: endpoint about +0.37%, average MFE +7.55%, MAE -0.57%; near-miss 12 endpoint about -0.77%, MFE +1.12%, MAE -1.46%. One independent date only; no filter change.
- 8046 restoration and `HUMAN_MOMENTUM_SHADOW` remain research-only; keep execution-alpha separate from near-miss selection rescue.

## Provenance lane retained through B-49
- Current counterfactual path can collapse malformed snapshot/history, missing history, and valid-but-insufficient observed history into legacy null horizons; legacy `coverage.dN` cannot explain cause.
- Conservative diagnostics: snapshot parse state; baseline state; history row/parse/empty/OK; historyLastDate; postScanValidBars; OUTCOME_AVAILABLE vs provenance failure/OBSERVED_HISTORY_INSUFFICIENT; calendar maturity UNKNOWN without trusted calendar evidence.
- Safest design is parallel/additive diagnostics. Do not alter `researchShadowOutcomeForRow()`, `researchOutcomeCohortSummary()`, `researchPairedSelectionAlpha()` or legacy `coverage.dN` semantics.
- Isolated branch commit `4f2c3fcabd8e689a880844b276e87b000a6ae7c0` contains helper blob `801ec27449e7f3d24477c85dadaefbd7624df541`, exact-path fixture blob `93147e1d308c41a384d675bd29322a71ecb5c5b6`, observational fixture `7ba2b14aceed43b7aaf810b662fac7bbf61f51de`, and targeted fixture `f39ca0ebf0d5ee05ba860fffacfefa9d75531028`.
- Targeted + observational tests retain `LOCAL_EXACT_SOURCE_PASS`. Exact-path fixture remains `LOCAL_RECONSTRUCTED_ASSERTION_PASS / EXACT_SOURCE_NOT_RUN`; CI NOT_RUN.
- B-49 established there is no trusted no-change byte-materialization path from connected GitHub reader into the local execution runner; minimal manual isolated CI bridge is Class B and remains proposal-only.

## B-50 retained — Fundamental Persistence boundary clarified
- Frozen registry defines only R01-R08. Monthly-revenue evidence is context/falsification metadata for R08, not a persistence experiment.
- Arbitrary revenue persistence windows would be a new experiment and violate the current no-R09/I08 freeze plus Factor-Zoo/data-snooping controls.
- Fundamental Persistence therefore remains UNKNOWN/context-only; no threshold/window search or historical PIT backfill is permitted.

## B-51/B-52 retained — Price Path Quality readiness boundary
- R01 = fixed `priorHigh20` + future 3-close hold/fail; R05 = next-day Overnight/Intraday; R07/R08 = same-date medians of `residualSectorRs20` and `volumeTodayVsPrev5`.
- No new threshold/window/volume multiple/wick cutoff/ATR cutoff/composite score while R01-R08 are frozen.
- Readiness is counted by independent scan date and cohort. Zero-pick dates remain valid formal observations; row count never substitutes for independent dates.
- Future OHLC only populates outcomes after observation; no historical snapshot backfill with future information.

## B-53/B-56 retained — Serializer, route, regime and aggregate boundary
- `readShadowCounterfactualResearch()` reads up to 5000 archived Shadow rows, computes outcomes from post-scan history, aggregate coverage/cohort diagnostics, and returns only `recentOutcomes: outcomes.slice(-80)` at row level.
- Row serializer exposes scanDate/cohort/baseline/horizons/firstDay/breakout/full snapshot. R05 Overnight/Intraday is emitted. R07/R08 residualSectorRs20 and volumeTodayVsPrev5 can pass through snapshot when finite.
- Authenticated external route is source-proven as GET `/api/research/dashboard?days=...`; no secret was requested or bypassed and no authorized live dashboard response has been read in this automation context.
- Regime remains a separate `trade_research_days.market_json` path; inspected implementation has no per-row counterfactual regime join. Any shared-runtime join is Class B proposal-first.
- Existing aggregate path does not expose per-scanDate/per-cohort field-presence counts. `intradayVsOvernight.n`, residual-RS and Quiet/Attention diagnostics are maturity/effect-conditioned and must not be reused as readiness denominators.
- Exact `.github/workflows/v7-cloudflare.yml` means `research/**` changes on main enter production deployment; new research code must remain isolated unless deployment neutrality is proven. Shared dashboard/runtime wiring or workflow changes are Class B proposal-first.
- Runtime finite-value coverage remains UNKNOWN without trusted runtime read.

## NEW B-57 — Branch-only readiness matrix implemented, not wired
### Continuity / concurrency
- Re-read governance/worklist/canonical B-56 checkpoint and latest main commit before work. Latest main before branch creation was `25838e48d32b137757bcdc1bf71c968d57e14f46` (`research: B-56 audit aggregate field-presence readiness gap`).
- Re-fetched canonical checkpoint immediately before write; blob remained `0b4624a0234f24f069028eb669dbf56036962b93`, so no newer A/B checkpoint needed merging.
- No newer trusted Production readback with >=1 formal plan was established; primary execution funnel is not reinterpreted.

### Engineering classification / frozen invariants
- Classification before code: **Class A, branch-only research helper**. It only transforms already-produced research outcome/snapshot objects into observational readiness counts and has no storage, schema, network, formal selection, monitoring or push path.
- Frozen invariants: legacy `coverage.dN`, `byCohort`, `selectionAlpha`, `diagnostics`, `recentOutcomes`, Formal Core, A/B qualification, Top6/3+3, capital, BUY/ADD/REDUCE/SELL/STOP, monitoring and push remain untouched.
- Any later wiring into shared dashboard/runtime/main is a separate **Class B** proposal-first decision; this branch is not deployed.

### Isolated implementation
- Created branch `research/b57-price-path-readiness` from main `25838e48d32b137757bcdc1bf71c968d57e14f46`.
- Added `research/price_path_readiness_v8_8_2.js`; branch implementation commit `bfc062f798e0ad759c133126f65bedda4e6b9c23`.
- Added fixture `research/price_path_readiness_v8_8_2.test.js`; branch head commit `4fe06dcfa9da2f6cb343596efaf24c1f28cff57b`.
- Matrix unit is fixed to `INDEPENDENT_SCAN_DATE_X_COHORT`.
- Scan-time `fieldState` is separated from future `outcomeState`:
  - R01 field: breakout reference availability; outcome: fixed 3-close held/failed state.
  - R05 field: scan-time baseline close; outcomes: next-day overnight and intraday.
  - R07 field: `residualSectorRs20`; D5/D10/D20 maturity remains separate.
  - R08 fields: `residualSectorRs20` and `volumeTodayVsPrev5`; future horizons remain separate.
- States are constrained to `AVAILABLE / FIELD_UNKNOWN_OR_MISSING / PROVENANCE_BLOCKED` for fields and `AVAILABLE / OUTCOME_NOT_MATURE / PROVENANCE_BLOCKED` for outcomes. No BAD/0 coercion exists.

### Fixture intent / test status
- Fixture deliberately places one immature and one mature row on the same scanDate/cohort and asserts both scan-time residual-RS and relative-volume fields count AVAILABLE while D5 splits AVAILABLE vs OUTCOME_NOT_MATURE. This directly guards against D5-conditioned readiness/survivorship bias.
- Separate row asserts missing R07/R08 fields remain FIELD_UNKNOWN_OR_MISSING while D5 is OUTCOME_NOT_MATURE.
- **Test source written, NOT_EXECUTED** in this cycle. Do not claim PASS from assertions existing in source. No CI/workflow change was made.

### Bias / falsification / redundancy checks
- Selection/availability bias: field coverage is computed before and independently from outcome maturity.
- Look-ahead: helper consumes scan-time snapshot fields as supplied; it does not reconstruct or backfill historical scan-time evidence.
- Data snooping / Factor Zoo: no new experiment, threshold, window, cutoff, score or ranking; R01-R08 definitions remain frozen.
- Market-source bias: actual TWSE/TPEx finite-value coverage remains UNKNOWN until authorized runtime rows are observed.
- Redundancy: R07/R08 shared residual-RS is explicitly represented as the same underlying field, not counted as two independent discoveries.
- Date clustering: output grouping is scanDate x cohort; stock rows are counts within a date/cohort, not independent dates.
- Transaction costs: no alpha/effect claim is made; unchanged.
- Counterexample retained: a row can have all scan-time fields AVAILABLE while every future outcome remains OUTCOME_NOT_MATURE; therefore readiness must not be inferred from outcome coverage.

### R01-R08 / I01-I07 impact
- R01/R05/R07/R08: observability design only; experiment definitions/effects unchanged and runtime coverage remains UNKNOWN.
- R02/R03/R04/R06 and I01-I07: unchanged.
- Fundamental Persistence remains UNKNOWN/context-only.

### Deployment / rollback
- Main runtime code unchanged; branch is isolated and not deployed.
- Rollback branch work by abandoning `research/b57-price-path-readiness`; main pre-branch point `25838e48d32b137757bcdc1bf71c968d57e14f46` remains unaffected.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint blob SHA before any write.
2. If a newer trusted formal scan with >=1 plan exists, immediately restore primary funnel priority: establish plan date/count from trusted Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Otherwise continue B-57 branch-only helper verification. Inspect exact branch source and fixture; execute only if a trusted no-reconstruction runner path is available. Until then test status is `SOURCE_WRITTEN_NOT_EXECUTED`, not PASS.
4. Audit a subtle semantic edge before any integration: `PROVENANCE_BLOCKED` must not suppress a scan-time field that was positively parsed from a valid snapshot merely because future history provenance failed. If provenance is split into snapshot provenance vs history/outcome provenance, fieldState must depend only on snapshot provenance while outcomeState may depend on history provenance. Treat this as a falsification test of the B-57 helper, not as permission to broaden scope.
5. Add branch-only fixtures for that edge plus malformed snapshot/baseline cases if source audit confirms the helper currently conflates snapshot and history provenance. Keep UNKNOWN semantics conservative.
6. Do not wire readiness into dashboard/runtime/main without separate Class B review. Do not alter legacy coverage/byCohort/selectionAlpha/diagnostics/recentOutcomes.
7. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; do not repeat byte-transport discovery or implement B-49 CI proposal without approval. Do not infer 09/22 Shadow without new trusted evidence; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
