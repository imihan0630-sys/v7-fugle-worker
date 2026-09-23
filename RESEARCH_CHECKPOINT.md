# Research Checkpoint

Checkpoint sequence: B-47.
Updated: 2026-09-23 09:14 Asia/Taipei.

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

## Provenance lane retained through B-46
- Current counterfactual path can collapse malformed snapshot/history, missing history, and valid-but-insufficient observed history into legacy null horizons; legacy `coverage.dN` cannot explain cause.
- Conservative diagnostics: snapshot parse state; baseline state; history row/parse/empty/OK; historyLastDate; postScanValidBars; OUTCOME_AVAILABLE vs provenance failure/OBSERVED_HISTORY_INSUFFICIENT; calendar maturity UNKNOWN without trusted calendar evidence.
- Safest design is parallel/additive diagnostics. Do not alter `researchShadowOutcomeForRow()`, `researchOutcomeCohortSummary()`, `researchPairedSelectionAlpha()` or legacy `coverage.dN` semantics.
- Isolated branch commit `4f2c3fcabd8e689a880844b276e87b000a6ae7c0` contains helper blob `801ec27449e7f3d24477c85dadaefbd7624df541` and exact-path fixture blob `93147e1d308c41a384d675bd29322a71ecb5c5b6` plus prior targeted/observational tests.
- Targeted + observational tests retain `LOCAL_EXACT_SOURCE_PASS`. Exact-path fixture remains `LOCAL_RECONSTRUCTED_ASSERTION_PASS / EXACT_SOURCE_NOT_RUN`; CI NOT_RUN.

## NEW B-47 — Git blob API path verified, but direct runner materialization still unavailable
### Continuity / concurrency
- Re-read governance, worklist, canonical B-46 checkpoint and latest main commit before work.
- Main head at cycle start: `8a325aa5c817366d58f1fe3d1de0ae8de4865d1b` (B-46 checkpoint commit).
- Immediately before this write, canonical checkpoint blob SHA remained `1f382f77a51c8cec65990eb05848c3a622aa266d`; no newer A/B checkpoint appeared.

### Exact-source evidence
- Re-fetched isolated-branch helper through GitHub Contents with UTF-8 and base64 forms; both identify blob SHA `801ec27449e7f3d24477c85dadaefbd7624df541`.
- Read pinned commit tree directly; it confirms exact-path fixture path `research/shadow_provenance_exact_path_v8_8_2.test.mjs`, size 5141, blob SHA `93147e1d308c41a384d675bd29322a71ecb5c5b6`, alongside helper blob `801ec27449e7f3d24477c85dadaefbd7624df541`.
- Read the exact fixture through GitHub Git Blobs API by SHA; source is available and deterministic through the connected GitHub reader.
- However, the connector response is text/content exposed to the model, not a mounted byte file in the isolated Node runner. Re-typing/model-copying that content into a local file would violate B-46's gate against recreating the fixture by hand and calling it exact.
- Therefore this cycle deliberately did **not** upgrade the test status and did not claim byte-for-byte runner execution.

### Safety / falsification
- The transport problem is narrower now: GitHub source access is healthy; only trusted byte materialization from connector to runner is missing.
- No evidence about production prevalence of provenance failure states was generated; prevalence remains UNKNOWN.
- No calendar maturity inference was added. No historical Shadow was fabricated.
- No formal factor, rank, threshold, cohort, market source, scan, signal, capital, trade or push behavior changed.
- No workflow/schema/runtime/storage change was made; Formal Core remains LOCKED.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint blob SHA immediately before write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` observations only on formal SELECTED names.
3. Otherwise continue provenance lane. Do not repeat generic GitHub source discovery: exact helper/fixture blobs and paths are now proven. Seek an already-authorized connector/file-reference or runner mechanism that transfers GitHub blob bytes directly into execution storage without model/manual reconstruction. Verify Git blob SHA before execution.
4. Only exact byte materialization + execution of helper `801ec274...` with fixture `93147e1d...` may upgrade exact-path to `LOCAL_EXACT_SOURCE_PASS`. Otherwise retain `EXACT_SOURCE_NOT_RUN`.
5. After exact-source pass, safely reconcile `research/b13-shadow-provenance` divergence with current main without force overwrite; re-read current production counterfactual path after reconciliation.
6. Only after reconciliation may additive provenance integration be implemented on isolated branch. Diagnostics remain parallel/research-only; no legacy outcome/coverage rewrite.
7. Run targeted + observational + exact-path + existing counterfactual regression tests from exact reconciled branch sources. CI remains NOT_RUN unless an already-authorized safe runner is available.
8. If integration requires shared schema/runtime/storage/workflow changes, reclassify Class B before change and do not promote Production.
9. Do NOT revisit 09/18 execution or infer 09/22 Shadow without new trusted evidence. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
