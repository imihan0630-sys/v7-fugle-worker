# Research Checkpoint

Checkpoint sequence: B-59.
Updated: 2026-09-23 15:11 Asia/Taipei.

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
- B-13 isolated helper explicitly distinguishes `snapshotStatus`, `baselineStatus`, `historyStatus`, `postScanValidBars`, and horizon provenance. Missing baseline is `BASELINE_UNAVAILABLE`; malformed snapshot is distinct from history failure.
- Safest design remains parallel/additive diagnostics. Do not alter `researchShadowOutcomeForRow()`, `researchOutcomeCohortSummary()`, `researchPairedSelectionAlpha()` or legacy `coverage.dN` semantics.
- `research/b13-shadow-provenance` remains isolated/not deployed. Targeted + observational tests retain `LOCAL_EXACT_SOURCE_PASS`; exact-path fixture remains `LOCAL_RECONSTRUCTED_ASSERTION_PASS / EXACT_SOURCE_NOT_RUN`; CI NOT_RUN.
- B-49 established no trusted no-change byte-materialization path from connected GitHub reader into local runner; minimal manual isolated CI bridge is Class B proposal-only. Do not repeat transport discovery without new capability/approval.

## B-50 through B-56 retained boundaries
- Fundamental Persistence remains UNKNOWN/context-only: monthly revenue is R08 context/falsification metadata, not a new persistence experiment. No arbitrary windows or historical PIT backfill.
- Price Path uses only frozen R01 `priorHigh20` + future 3-close hold/fail; R05 next-day Overnight/Intraday; R07/R08 same-date medians of `residualSectorRs20` and `volumeTodayVsPrev5`. No new thresholds/windows/composite scores.
- `readShadowCounterfactualResearch()` reads up to 5000 Shadow rows but returns only last 80 row-level `recentOutcomes`; do not treat 80 as full archive.
- Existing aggregate diagnostics are maturity/effect-conditioned and cannot be reused as field-readiness denominators.
- Regime is a separate `trade_research_days.market_json` path; no per-row counterfactual join. Shared-runtime join is Class B proposal-first.
- Authenticated dashboard route is source-proven GET `/api/research/dashboard?days=...`; no authorized live dashboard response has been read in this automation context. Runtime finite-value coverage remains UNKNOWN.
- `.github/workflows/v7-cloudflare.yml` means `research/**` changes on main enter production deployment; research helper code stays branch-only unless deployment neutrality is proven.

## B-57/B-58 retained — branch-only readiness matrix and split provenance
- Branch `research/b57-price-path-readiness`; matrix unit fixed to `INDEPENDENT_SCAN_DATE_X_COHORT`; scan-time field state is separate from future outcome state.
- R01/R05/R07/R08 observability only; legacy coverage/byCohort/selectionAlpha/diagnostics/recentOutcomes and Formal Core untouched.
- B-58 falsified combined provenance: later history failure must not erase valid scan-time snapshot fields. Helper now uses split snapshot vs history/outcome provenance.
- Fixtures cover valid snapshot + broken history and malformed snapshot. Tests remain `SOURCE_WRITTEN_NOT_EXECUTED`; branch not wired/deployed.

## NEW B-59 — baseline provenance is a third semantic axis
### Finding / falsification
- Exact B-13 provenance design already supports baseline separately: `baselineStatus=BASELINE_CLOSE_OK|BASELINE_CLOSE_MISSING`, and horizon provenance returns `BASELINE_UNAVAILABLE` after checking for an actually finite observed outcome and before history/maturity classification.
- Therefore B-58's two-axis snapshot/history split was necessary but not sufficient. Counterexample: snapshot parses correctly and contains residual RS / relative volume, history is `HISTORY_OK`, but baseline close is absent. Scan-time R07/R08 fields are still positively observable, while return-based future outcomes cannot be interpreted as merely `OUTCOME_NOT_MATURE`.
- Treating that case as maturity would mix data-quality failure into maturity denominators and can bias readiness upward/downward depending on missing-baseline incidence.

### Class A branch-only correction
- Updated `research/price_path_readiness_v8_8_2.js` on `research/b57-price-path-readiness`, commit `d0f416927ac518bb91f5a6d7b9ee1c5f48aa8921`.
- `outcomeState()` now preserves B-13 ordering: finite observed metric => AVAILABLE; otherwise missing baseline => PROVENANCE_BLOCKED; then history provenance; only valid provenance with no metric => OUTCOME_NOT_MATURE.
- No new provenance vocabulary was invented. Baseline presence is derived from the existing row baseline/snapshot close and maps conservatively to the readiness bucket `PROVENANCE_BLOCKED` for unavailable return outcomes.
- Added falsification fixture on branch head `1c5ec96bf5e6d60c776eb4e6c7e2398a0968111f`: valid parsed snapshot + missing baseline + valid R07/R08 fields + `HISTORY_OK` must keep R07 AVAILABLE, mark R05 baseline FIELD_UNKNOWN_OR_MISSING, and mark D5 PROVENANCE_BLOCKED rather than OUTCOME_NOT_MATURE.

### Test / evidence status
- Source/assertions written but **NOT_EXECUTED**. Status remains `SOURCE_WRITTEN_NOT_EXECUTED`; no PASS inferred from inspection.
- No workflow/CI/runtime/storage/schema/dashboard/main helper wiring changed. Production remains untouched.

### Bias / UNKNOWN / redundancy audit
- Selection/availability bias improved by preventing missing-baseline rows from contaminating maturity counts while preserving other known scan-time fields.
- Look-ahead unchanged; no future value backfills scan-time evidence.
- UNKNOWN semantics remain conservative: parsed-but-absent baseline is missing evidence, not BAD/0; malformed snapshot remains provenance-blocked.
- Factor Zoo/data snooping unchanged: no new experiment, factor, threshold, window, score or ranking. R07/R08 residual RS remains one underlying field, not two discoveries.
- Transaction-cost, market-source, date-cluster and directional alpha claims remain unchanged/UNKNOWN.

### R01-R08 / I01-I07 impact
- R01/R05/R07/R08 readiness semantics only; experiment definitions/effects unchanged. R02/R03/R04/R06 and I01-I07 unchanged.
- Formal Core remains LOCKED.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Otherwise continue branch-only readiness verification from B-59. Re-fetch exact helper/fixture and inspect the remaining semantic edge: an actually finite serialized outcome with missing baseline/history provenance. Preserve B-13's existing rule that a finite outcome is authoritative, but verify this cannot create an impossible/inconsistent readiness state in the current serializer contract.
4. If no additional conflation exists, freeze the helper interface and write a deployment-neutral verification plan. Test remains `SOURCE_WRITTEN_NOT_EXECUTED` until trusted no-reconstruction execution exists.
5. Do not wire readiness into dashboard/runtime/main without separate Class B review. Do not alter legacy coverage/byCohort/selectionAlpha/diagnostics/recentOutcomes.
6. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; do not implement B-49 CI proposal without approval. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
