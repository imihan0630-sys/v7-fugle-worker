# Research Checkpoint

Checkpoint sequence: B-58.
Updated: 2026-09-23 14:40 Asia/Taipei.

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

## B-57 retained — Branch-only readiness matrix
- Branch `research/b57-price-path-readiness` from main `25838e48d32b137757bcdc1bf71c968d57e14f46`.
- Matrix unit fixed to `INDEPENDENT_SCAN_DATE_X_COHORT`; scan-time fieldState is separate from future outcomeState.
- R01/R05/R07/R08 observability only; no new factor/threshold/window/effect claim.
- Legacy `coverage.dN`, `byCohort`, `selectionAlpha`, `diagnostics`, `recentOutcomes` and all Formal Core outputs remain untouched.
- Branch is not wired to dashboard/runtime/main and is not deployed. Any later shared-runtime wiring is Class B proposal-first.

## NEW B-58 — Falsification found and corrected: snapshot vs history provenance
### Finding
- Exact B-57 source audit confirmed a semantic conflation: one combined provenance state was passed to both `readinessState()` and `outcomeState()`.
- Counterexample: a valid scan-time snapshot can positively contain `residualSectorRs20`, relative volume, baseline and breakout reference while later history JSON is malformed/missing. The old helper would mark those known scan-time fields `PROVENANCE_BLOCKED` solely because future history failed.
- This would undercount field readiness and introduce outcome-availability/survivorship bias. It is not acceptable to let future-history failure erase already-observed scan-time evidence.

### Class / implementation
- Classification remains **Class A branch-only research helper**; no runtime/shared wiring, storage, schema, formal output or deployment change.
- Updated `research/price_path_readiness_v8_8_2.js` on `research/b57-price-path-readiness`, commit `b5020fa05e2b57943412350ac677c94d5e150454`.
- Helper now resolves split provenance: `snapshotState`/snapshot.state controls scan-time fieldState; `historyState`/outcomeState/history.state controls future outcomeState. Legacy combined `state` remains conservative fallback only when split provenance is unavailable.
- Updated fixture with two falsification cases, branch head `f8d73c13bc14d6dab812e58b9c7a570f92475a3b`:
  1. valid snapshot + `HISTORY_PARSE_ERROR` => scan-time R07/R08 fields must remain AVAILABLE while D5 is PROVENANCE_BLOCKED;
  2. `SNAPSHOT_PARSE_ERROR` + missing history/baseline => scan-time fields remain PROVENANCE_BLOCKED and outcome is PROVENANCE_BLOCKED.

### Test / evidence status
- Source and assertions are written but **NOT_EXECUTED**. Status remains `SOURCE_WRITTEN_NOT_EXECUTED`; do not infer PASS from source inspection.
- No CI/workflow modification was made. B-49 exact-source runner constraint remains unchanged and is not being rediscovered.

### Bias / redundancy / UNKNOWN audit
- Selection/availability bias improved: future-history failures can no longer suppress positively observed scan-time fields when split provenance is supplied.
- Look-ahead unchanged: no future information is backfilled into scan-time fields.
- UNKNOWN remains conservative: malformed snapshot is provenance-blocked, not BAD/0; valid-but-absent field is FIELD_UNKNOWN_OR_MISSING.
- Factor Zoo/data snooping unchanged: no R09/I08, threshold, window, score or ranking added.
- R07/R08 shared residual-RS remains one underlying field; no double-discovery claim.
- Transaction-cost, date-cluster and market-source effect claims remain unchanged/UNKNOWN.

### R01-R08 / I01-I07 impact
- R01/R05/R07/R08: readiness semantics corrected only; experiment definitions and directional effects unchanged.
- R02/R03/R04/R06 and I01-I07 unchanged.
- Production runtime finite-value coverage remains UNKNOWN without trusted authorized readback.

### Deployment / rollback
- Main runtime unchanged; branch not deployed.
- Rollback: abandon `research/b57-price-path-readiness`; Formal Core and production remain unaffected.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan with >=1 plan exists, restore primary funnel priority immediately: establish plan date/count from trusted Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Otherwise continue branch-only B-58 verification. Re-fetch exact branch helper + fixture and inspect whether baseline provenance needs a distinct state from snapshot parse provenance; do not invent a state unless existing B-13 provenance design already supports it.
4. If no further semantic conflation is found, freeze the branch helper interface and prepare a deployment-neutral verification plan. Test remains `SOURCE_WRITTEN_NOT_EXECUTED` until a trusted no-reconstruction execution path exists.
5. Do not wire readiness into dashboard/runtime/main without separate Class B review. Do not alter legacy coverage/byCohort/selectionAlpha/diagnostics/recentOutcomes.
6. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; do not repeat byte-transport discovery or implement B-49 CI proposal without approval. Do not infer 09/22 Shadow without new trusted evidence; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
