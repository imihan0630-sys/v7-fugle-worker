# Research Checkpoint

Checkpoint sequence: B-62.
Updated: 2026-09-23 16:39 Asia/Taipei.

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

## B-50 through B-61 retained boundaries
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
- B-60 froze finite serialized outcome precedence: finite future metric remains AVAILABLE even if attached provenance is inconsistent, but never fabricates missing scan-time fields. No new INCONSISTENT bucket.
- B-61 froze exact branch/blob identities and trusted-execution contract. Tests remain `SOURCE_WRITTEN_NOT_EXECUTED`; branch not wired/deployed.

## NEW B-62 — liquidity-reject/control coverage isolation audit
### Research question
- Can the largest observed rejection gate (liquidity/base failure) be added as a prospective falsification/control population without touching Formal Core or silently changing existing R02 cohort semantics?
- This is a coverage/selection-bias audit only. No claim that the liquidity gate is good/bad, no new factor/window/threshold, and no historical Shadow fabrication.

### Supporting source evidence
- Current `selectTomorrowCandidates()` constructs `featureRows`, then calls the formal `scoreCandidate(f, sector)` once per feature row. It appends a row to `basePoolDiagnostics` **only when `result.basePassed` is true**; rejected rows are otherwise reduced to aggregate `diagnostics.exclusions[result.reason]`, with only A/B-formation misses optionally retained as a 12-row `nearMisses` debug sample.
- `diagnostics.conditionDistribution` is built from `basePoolDiagnostics`, therefore its denominator is already conditioned on passing base/liquidity. It cannot falsify the liquidity gate itself.
- Existing R02 explicitly freezes BROAD_CONTROL, QUALIFIED_NOT_SELECTED, NEAR_MISS and REJECTED_AFTER_BASE as separate controls. Re-labeling pre-base liquidity rejects as `REJECTED_AFTER_BASE` would violate the frozen cohort meaning and contaminate existing Selection Alpha comparisons.
- Existing Shadow integrity only verifies archive existence, SELECTED coverage and BROAD_CONTROL presence; it does not prove coverage of pre-base rejects.

### Isolation result / engineering classification
- A truly prospective per-symbol liquidity-reject control requires capturing `f` plus `scoreCandidate` rejection reason during the formal scan and durably writing those rows for later outcomes.
- The necessary source data exists at scan time, so no look-ahead/backfill is needed. However, the capture point is inside the shared formal scan path (`selectTomorrowCandidates`) and durable persistence would extend shared runtime/storage behavior.
- Therefore **direct implementation is Class B**, not autonomous Class A, despite the intended rows being research-only. No shared scan/storage/runtime code was changed in this run.
- A branch-only/offline Class A helper could define normalization/diagnostics over supplied hypothetical rows, but without a trusted prospective capture source it would not close the real coverage gap; building such a helper now would create ceremony without evidence and is deferred.

### Safest prospective design if later approved as Class B
- Add a new research-only population name distinct from all frozen R02 cohorts, e.g. `PRE_BASE_LIQUIDITY_CONTROL`; do **not** overload `REJECTED_AFTER_BASE`.
- Capture only rows actually evaluated on that scan date, with immutable scan-date snapshot fields and exact formal rejection reason already emitted by `scoreCandidate`; never reconstruct older dates.
- Preserve reason granularity rather than collapsing every base failure into one BAD label; missing source fields remain UNKNOWN.
- Keep it excluded from formal ranking, Top6/3+3, capital, monitoring and push; exclude it from existing R02 Selection Alpha until a separately preregistered experiment/version explicitly defines a comparison.
- Evidence unit remains independent scan date. Report coverage counts and reason distribution before any return comparison; outcome maturity must remain separate from field coverage.
- Add integrity checks comparing captured pre-base control counts/reasons against same-date formal exclusion aggregates, with mismatches marked RESEARCH_DATA_GAP rather than altering trading.

### Falsification / bias / redundancy audit
- Selection bias: this gap is material because the current research archive conditions on surviving the largest gate; present Shadow evidence cannot answer whether rejected low-liquidity names would have out/underperformed.
- Look-ahead: safe design is prospective only; historical reconstruction is prohibited.
- Data snooping / Factor Zoo / overfit: no new alpha experiment is opened; first objective is coverage and falsification, not searching for a winning liquidity threshold.
- Redundancy: existing BROAD_CONTROL does not substitute for a reason-preserving pre-base reject population because it does not establish membership in the liquidity-reject gate.
- Market-source bias: unchanged/UNKNOWN; control should preserve TWSE/TPEx market metadata if later captured so coverage can be audited by market.
- Transaction costs: especially important for liquidity rejects; raw returns without executable cost/slippage context must not be interpreted as tradable alpha.
- Date clustering: independent scan date remains the unit; thousands of same-day rejects are not thousands of independent observations.
- Coverage/zero-pick: design improves ability to explain zero-pick/funnel behavior but must never loosen the gate automatically.

### R01-R08 / I01-I07 impact
- R02: exposes a missing falsification population but **does not change** frozen R02 controls or effect estimates.
- R01/R03-R08: definitions/effects unchanged.
- I01-I07: unchanged; no new incremental pair or experiment.
- Formal Core remains LOCKED.

### Engineering / tests / deployment
- Classification: Class B proposal/evidence only because prospective capture must touch shared scan/runtime/storage.
- Branch/commit: none for implementation; checkpoint-only main update.
- Tests: source audit only; no new executable test claimed.
- Deployment: none. Production Formal Core and runtime unchanged.
- Rollback: revert this checkpoint commit only; no runtime artifact exists.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Otherwise keep B-62 liquidity-control implementation proposal-only unless owner explicitly approves the Class B shared-runtime/storage change. Do not create `PRE_BASE_LIQUIDITY_CONTROL` in production or overload `REJECTED_AFTER_BASE`.
4. Continue to another genuinely independent Class A research gap that can be advanced without shared runtime wiring. Prioritize a static/source-level falsification audit of whether existing BROAD_CONTROL sampling itself can induce market/pool/date imbalance, using only frozen definitions and source semantics; if empirical evaluation requires unavailable full prospective rows, record UNKNOWN rather than inventing data.
5. Readiness test remains `SOURCE_WRITTEN_NOT_EXECUTED` until the B-61 trusted-execution contract is met. Do not repeat B-49 transport discovery without new capability.
6. Do not wire readiness into dashboard/runtime/main without separate Class B review. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
