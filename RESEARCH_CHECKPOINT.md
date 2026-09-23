# Research Checkpoint

Checkpoint sequence: B-61.
Updated: 2026-09-23 16:09 Asia/Taipei.

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

## B-50 through B-60 retained boundaries
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
- Tests remain `SOURCE_WRITTEN_NOT_EXECUTED`; branch not wired/deployed.

## NEW B-61 — deployment-neutral verification contract frozen
### Purpose
- Execute the B-60 exact next point without changing workflow/runtime/main: freeze exactly what must be executed and what evidence would count as trusted verification.
- This is verification governance only; no alpha/effect claim, no new factor/window/threshold/experiment.

### Exact branch identity
- Branch: `research/b57-price-path-readiness`.
- Branch head: `135412c435cc9e0e8f060e871e0b904a13ade161`.
- Helper path/blob: `research/price_path_readiness_v8_8_2.js` = `d88e3981ce0b2ae6bb79faae274e7f8df3827076` (5338 bytes).
- Fixture path/blob: `research/price_path_readiness_v8_8_2.test.js` = `949dfe5fb9bb2f5500bf7c1ca975eb88280e9019` (6139 bytes).
- These identities are the verification inputs; any changed blob means this contract must be re-reviewed before execution evidence is accepted.

### Assertions that trusted execution must satisfy
1. Field readiness is independent of D5 maturity: mature/immature rows with valid snapshot fields both count R07/R08 fields AVAILABLE.
2. Missing scan-time fields remain FIELD_UNKNOWN_OR_MISSING; they are never BAD/0.
3. Later history parse failure cannot erase valid scan-time snapshot fields; it may block future outcomes only.
4. Malformed snapshot is PROVENANCE_BLOCKED, not ordinary missing field.
5. Missing baseline does not erase other valid scan-time fields; baseline-dependent future outcomes are PROVENANCE_BLOCKED rather than OUTCOME_NOT_MATURE.
6. Deliberately inconsistent finite D5 + missing baseline/history failure keeps D5 AVAILABLE while baseline remains FIELD_UNKNOWN_OR_MISSING.
7. Aggregation unit remains exactly `INDEPENDENT_SCAN_DATE_X_COHORT`.

### Protected invariants
- No modification to Formal Core, A/B, rank/score/threshold, Top6/3+3, capital, BUY/ADD/REDUCE/SELL/STOP, monitoring or push.
- No modification to `researchShadowOutcomeForRow()`, legacy coverage/byCohort/selectionAlpha/diagnostics/recentOutcomes semantics.
- No storage/schema/runtime/dashboard wiring and no workflow change.
- No historical Shadow backfill and no use of future outcomes to fill scan-time fields.
- UNKNOWN/data-quality states stay non-directional; no readiness count becomes alpha evidence.

### What counts as trusted execution
- Runner must execute the exact Git objects above without model/manual reconstruction of file contents.
- Before execution, evidence must establish checked-out/ref-resolved commit `135412c...` and exact helper/test blob SHAs `d88e3981...` / `949dfe5f...`.
- The executed command must be limited to the branch fixture (for example Node running the exact test file) and must produce exit status 0 plus the fixture's PASS output.
- Execution evidence must be durably attributable to those exact blobs (trusted checkout/artifact/log). A copied/retyped/reconstructed local harness is insufficient.
- Trusted execution must not deploy, mutate production storage, require production secrets, or modify shared workflow/runtime. If achieving execution requires workflow/pipeline modification, it is Class B proposal-first and this run must remain NOT_EXECUTED.

### Current status / falsification
- Current status remains `SOURCE_WRITTEN_NOT_EXECUTED`; this plan itself is not a test result.
- No new transport capability appeared in this run, so B-49 transport discovery was not repeated.
- A future assertion failure falsifies the helper semantics and blocks any wiring proposal. A blob mismatch invalidates the frozen verification contract until re-reviewed.

### Bias / UNKNOWN audit
- Selection/availability bias: verification explicitly protects maturity-independent field denominators.
- Look-ahead: future outcomes cannot populate scan-time fields.
- Data snooping/Factor Zoo/overfit: no performance search, no R09/I08, no threshold/window change.
- Market-source bias, transaction costs, date clustering, redundancy and directional alpha remain unchanged/UNKNOWN.
- Formal Core remains LOCKED.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Otherwise do not extend B-57/B-60 helper vocabulary or fixtures absent a new live counterexample. Search for a genuinely independent Class A research gap from the frozen R01-R08/I01-I07 worklist/registry that can improve falsification or coverage without runtime wiring; prioritize liquidity-reject/control coverage design because current Shadow omits the largest rejection gate.
4. Any liquidity-control design must remain prospective/research-only, must not fabricate historical Shadow, must preserve base/liquidity rejection reasons and independent scan-date clustering, and must first prove it can be isolated from formal candidate/ranking/runtime behavior. If isolation requires shared scan/storage changes, classify Class B and stop at proposal/evidence.
5. Readiness test remains `SOURCE_WRITTEN_NOT_EXECUTED` until the B-61 trusted-execution contract is met. Do not repeat B-49 transport discovery without new capability.
6. Do not wire readiness into dashboard/runtime/main without separate Class B review. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
