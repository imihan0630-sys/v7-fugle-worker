# Research Checkpoint

Checkpoint sequence: B-60.
Updated: 2026-09-23 15:40 Asia/Taipei.

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
- B-13 isolated helper distinguishes snapshot, baseline, history, post-scan valid bars and horizon provenance. Missing baseline is `BASELINE_UNAVAILABLE`; malformed snapshot is distinct from history failure.
- Safest design remains parallel/additive diagnostics. Do not alter `researchShadowOutcomeForRow()`, `researchOutcomeCohortSummary()`, `researchPairedSelectionAlpha()` or legacy `coverage.dN` semantics.
- `research/b13-shadow-provenance` remains isolated/not deployed. Targeted + observational tests retain `LOCAL_EXACT_SOURCE_PASS`; exact-path fixture remains `LOCAL_RECONSTRUCTED_ASSERTION_PASS / EXACT_SOURCE_NOT_RUN`; CI NOT_RUN.
- B-49 established no trusted no-change byte-materialization path from connected GitHub reader into local runner; minimal manual isolated CI bridge is Class B proposal-only. Do not repeat transport discovery without new capability/approval.

## B-50 through B-59 retained boundaries
- Fundamental Persistence remains UNKNOWN/context-only; no arbitrary windows or historical PIT backfill.
- Price Path uses only frozen R01 `priorHigh20` + future 3-close hold/fail; R05 next-day Overnight/Intraday; R07/R08 same-date medians of `residualSectorRs20` and `volumeTodayVsPrev5`. No new thresholds/windows/composite scores.
- `readShadowCounterfactualResearch()` reads up to 5000 Shadow rows but returns only last 80 row-level `recentOutcomes`; do not treat 80 as full archive.
- Existing aggregate diagnostics are maturity/effect-conditioned and cannot be reused as field-readiness denominators.
- Regime is a separate `trade_research_days.market_json` path; shared-runtime join is Class B proposal-first.
- Authenticated dashboard route is source-proven GET `/api/research/dashboard?days=...`; no authorized live dashboard response has been read in this automation context. Runtime finite-value coverage remains UNKNOWN.
- `.github/workflows/v7-cloudflare.yml` means `research/**` changes on main enter production deployment; research helper code stays branch-only unless deployment neutrality is proven.
- Branch `research/b57-price-path-readiness`; matrix unit `INDEPENDENT_SCAN_DATE_X_COHORT`; scan-time field state is separate from future outcome state.
- B-58 split snapshot from later history provenance so later history failure cannot erase valid scan-time fields.
- B-59 added baseline as a third semantic axis: finite observed metric => AVAILABLE; otherwise missing baseline => PROVENANCE_BLOCKED; then history provenance; only valid provenance with no metric => OUTCOME_NOT_MATURE.
- Tests remain `SOURCE_WRITTEN_NOT_EXECUTED`; branch not wired/deployed.

## NEW B-60 — finite serialized outcome is authoritative; inconsistent provenance is not a new readiness bucket
### Research question / experiment
- Inspect the remaining B-59 semantic edge: can a finite serialized future outcome coexist with missing baseline/history provenance under the current production serializer, and if an inconsistent downstream row appears, which state wins?
- This is a readiness/provenance falsification check only; no new experiment ID, factor, threshold, score or alpha claim.

### Supporting evidence
- Current production `researchShadowOutcomeForRow()` derives `baseline` from `snapshot.price.close` and `metricForSlice()` returns null unless `baseline>0`. D1/D3/D5/D10/D20 return/MFE/MAE therefore cannot be generated as finite values by this serializer when baseline is missing.
- The same serializer builds post-scan bars from valid finite closes; finite horizon metrics are downstream serialized evidence, not inferred by the readiness helper.
- Therefore the state `finite dN outcome + missing baseline` is impossible from the current normal serializer contract, though an externally corrupted/stale/inconsistent payload could still present it.

### Falsification / semantic decision
- Preserve B-13 precedence: if an actually finite serialized outcome is present, readiness marks that outcome `AVAILABLE` even when attached baseline/history provenance is inconsistent.
- Crucially this does **not** backfill scan-time evidence: a missing baseline field remains `FIELD_UNKNOWN_OR_MISSING`; the finite future metric does not fabricate baseline presence.
- No new `INCONSISTENT` state is introduced because that would expand the frozen readiness vocabulary without evidence that the production serializer emits such rows. If later live evidence shows this inconsistency, treat it as a data-quality incident and revisit provenance diagnostics, not as alpha evidence.

### Class A branch-only engineering
- Branch: `research/b57-price-path-readiness`.
- Added an explicit deliberately inconsistent fixture: finite D5 return + missing baseline + `HISTORY_PARSE_ERROR`.
- Assertion freezes two independent semantics: D5 remains `AVAILABLE`; R05 baseline remains `FIELD_UNKNOWN_OR_MISSING`.
- Branch commit: `135412c435cc9e0e8f060e871e0b904a13ade161`.
- Helper interface itself is now semantically frozen for B-57/B-60: no additional state vocabulary or fields should be added absent new counterexample/live evidence.

### Tests / deployment
- Source/assertions written but **NOT_EXECUTED**. Status remains `SOURCE_WRITTEN_NOT_EXECUTED`; no PASS inferred from source inspection.
- No workflow/CI/runtime/storage/schema/dashboard/main helper wiring changed. No deployment performed. Production Formal Core untouched.
- Rollback: branch can be reset before `135412c435cc9e0e8f060e871e0b904a13ade161`; main contains checkpoint only.

### Bias / UNKNOWN / redundancy audit
- Selection/availability bias: improved semantic separation; maturity counts are not polluted by missing baseline/history, while a real finite serialized outcome is not discarded solely due to stale provenance metadata.
- Look-ahead: unchanged; no future metric is used to fill a scan-time field.
- UNKNOWN/data quality: missing baseline remains missing; malformed provenance remains blocked where no finite outcome exists. No BAD/0 coercion.
- Factor Zoo/data snooping/overfit: unchanged; no R09/I08, no new threshold/window/composite, no performance search.
- Market-source bias, transaction costs, date clustering and directional effects remain unchanged/UNKNOWN.

### R01-R08 / I01-I07 impact
- R01/R05/R07/R08 readiness semantics only; definitions/effects unchanged. R02/R03/R04/R06 and I01-I07 unchanged.
- Formal Core remains LOCKED.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Otherwise treat B-57/B-60 helper semantics as frozen. Write a deployment-neutral verification plan only: enumerate exact branch blobs/SHAs, assertions, protected invariants, and what constitutes trusted execution without modifying workflow/runtime/main.
4. Test remains `SOURCE_WRITTEN_NOT_EXECUTED` until trusted no-reconstruction execution exists. Do not repeat B-49 transport discovery unless capability changes.
5. Do not wire readiness into dashboard/runtime/main without separate Class B review. Do not alter legacy coverage/byCohort/selectionAlpha/diagnostics/recentOutcomes.
6. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; do not implement B-49 CI proposal without approval. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
