# Research Checkpoint

Checkpoint sequence: B-65.
Updated: 2026-09-23 18:14 Asia/Taipei.

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
- Frozen diagnostic specification: effective controls/date, distinct/repeated symbols, max appearances, market/industry coverage when immutable metadata exists, pool x industry cross-tab, and eligible denominator UNKNOWN unless durably available. No pass/fail concentration threshold.
- R02 same-date pairing reduces row-count dominance but does not establish representative control composition. No alternate sampler/seed/cap/threshold.

## NEW B-65 — stored Shadow metadata availability audit
### Source-proven findings
- `trade_research_shadow_candidates` durable schema has explicit `pool` but **no explicit listing-market or industry columns**. The persisted row fields are scan_date, symbol, name, cohort, cohort_rank, selected_flag, exclusion_reason, pool, snapshot_json, created_at, updated_at.
- `buildShadowCandidateEntry()` computes `pool` at scan time from the feature-row close (`THOUSAND` vs `GENERAL`) and persists it directly. Therefore B-64 pool diagnostics are source-proven structurally available for every successfully persisted Shadow row; empirical completeness remains UNKNOWN until trusted rows are read.
- `buildResearchSnapshot()` stores immutable scan-time industry as `snapshot.sector.name = item.industry || null`. Shadow construction calls this snapshot builder on the scan-time feature row and then marks `capturedAtSelection=true`, `shadowOnly=true`, `noForwardFill=true`. Therefore B-64 industry diagnostics can use `snapshot.sector.name` prospectively without a current-metadata join; null remains UNKNOWN.
- The snapshot's `market` object is **market regime/context**, not the stock's listing venue. It contains fields such as regime, marketReturn20, breadth and top sectors. It does not encode whether the individual stock is TWSE or TPEx.
- Formal scan feature rows do carry `row.market` from TWSE/TPEx ingestion, so listing venue exists transiently during the scan, but the V8.7.2 Shadow serializer does not copy it into either a durable column or the research snapshot. Therefore historical/prospective persisted Shadow listing-market coverage is **NOT SOURCE-PROVEN AVAILABLE** from the current Shadow row schema.
- Do not infer TWSE/TPEx from symbol, current listings, names, or present-day metadata. For B-64, `marketCoverageByDate` must remain UNKNOWN with current persisted rows unless a trusted existing field is later proven.

### Supporting / falsifying interpretation
- Support for industry concentration diagnostic: industry is captured at selection time in the same prospective snapshot used for counterfactual research, so no look-ahead join is required.
- Falsifier/limitation: source proof of a field's serializer path does not prove all persisted rows have non-null industry; actual finite/non-null coverage is still UNKNOWN without trusted row readback.
- Support for pool x industry cross-tab: pool is a durable column and industry is inside the same row's snapshot, so the cross-tab is structurally definable offline from supplied Shadow rows.
- Falsifier/limitation: absence of listing-market metadata means TWSE/TPEx concentration cannot currently be measured from Shadow rows without changing capture/storage. Adding it inside the shared scan/persistence path would be a shared-runtime/storage change and is therefore **Class B proposal-first**, not autonomous B-65 work.

### Bias / overfit / data-quality audit
- Selection bias: unchanged; BROAD_CONTROL remains an eligible-survivor sample after prior-cohort exclusion.
- Look-ahead: industry may only come from stored `snapshot.sector.name`; no later metadata join. Listing market remains UNKNOWN rather than backfilled.
- Market-source bias: inability to distinguish TWSE/TPEx in stored Shadow rows is now an explicit coverage limitation, not silently ignored.
- Data snooping / Factor Zoo / overfit: no new factor, return window, sampler, seed, cap or threshold was introduced.
- Coverage: structural availability != empirical non-null coverage. Pool/industry empirical rates remain UNKNOWN pending trusted rows.
- Date clustering: unchanged; independent scan date remains the evidence unit.
- Transaction costs/redundancy/zero-pick: unchanged; metadata diagnostics do not imply alpha or executability and zero-SELECTED dates still cannot form paired R02 alpha.

### Engineering classification / action
- Class A checkpoint/source audit only. No Worker, schema, workflow, sampler, runtime, Formal Core, monitoring or push change.
- No branch diagnostic was written yet because B-64 first required proving which immutable fields actually exist. No executable test claimed.
- A future offline diagnostic may consume supplied/pinned Shadow rows and use `row.pool` + `row.snapshot.sector.name`; it must emit listing market as UNKNOWN unless the input itself contains a proven immutable venue field.

### R01-R08 / I01-I07 impact
- R02 only: clarifies which control-composition diagnostics are structurally supportable. Frozen R02 cohort/effect calculation unchanged.
- R01/R03-R08 unchanged. I01-I07 unchanged. No R09/I08.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Keep B-62 liquidity-control implementation proposal-only unless owner explicitly approves the Class B shared-runtime/storage change.
4. Continue B-64/B-65 as Class A: inspect whether any **already persisted immutable** listing-market field exists in a different existing Shadow-adjacent table/read path keyed by scan_date+symbol. Do not join current metadata and do not change schema/runtime. If none is source-proven, freeze TWSE/TPEx coverage as UNKNOWN and stop searching repeated equivalent paths.
5. Then define the minimal branch/offline diagnostic over supplied rows only using source-proven `pool` and `snapshot.sector.name`: effective controls/date, repeat symbols, max appearances, industry coverage/largest-industry share and pool x industry cross-tab. No return-conditioned output and no thresholds.
6. Do not wire the diagnostic to main/runtime until deployment neutrality is proven. If exact execution remains unavailable, keep test status honest. Do not create alternate sampler/seed/cap/threshold/experiment.
7. Readiness test remains `SOURCE_WRITTEN_NOT_EXECUTED`; provenance exact-path remains `EXACT_SOURCE_NOT_RUN`. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
