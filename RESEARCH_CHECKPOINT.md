# Research Checkpoint

Checkpoint sequence: B-49.
Updated: 2026-09-23 10:14 Asia/Taipei.

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

## Provenance lane retained through B-48
- Current counterfactual path can collapse malformed snapshot/history, missing history, and valid-but-insufficient observed history into legacy null horizons; legacy `coverage.dN` cannot explain cause.
- Conservative diagnostics: snapshot parse state; baseline state; history row/parse/empty/OK; historyLastDate; postScanValidBars; OUTCOME_AVAILABLE vs provenance failure/OBSERVED_HISTORY_INSUFFICIENT; calendar maturity UNKNOWN without trusted calendar evidence.
- Safest design is parallel/additive diagnostics. Do not alter `researchShadowOutcomeForRow()`, `researchOutcomeCohortSummary()`, `researchPairedSelectionAlpha()` or legacy `coverage.dN` semantics.
- Isolated branch commit `4f2c3fcabd8e689a880844b276e87b000a6ae7c0` contains helper blob `801ec27449e7f3d24477c85dadaefbd7624df541`, exact-path fixture blob `93147e1d308c41a384d675bd29322a71ecb5c5b6`, observational fixture `7ba2b14aceed43b7aaf810b662fac7bbf61f51de`, and targeted fixture `f39ca0ebf0d5ee05ba860fffacfefa9d75531028`.
- Targeted + observational tests retain `LOCAL_EXACT_SOURCE_PASS`. Exact-path fixture remains `LOCAL_RECONSTRUCTED_ASSERTION_PASS / EXACT_SOURCE_NOT_RUN`; CI NOT_RUN.
- B-48 proved unchanged shared CI is not a valid bridge: it does not invoke the isolated exact-path fixture, and changing shared workflow behavior is Class B.

## NEW B-49 — no no-change byte transport established; minimal Class B runner proposal frozen, not executed
### Continuity / concurrency
- Re-read governance, worklist, canonical B-48 checkpoint and latest main commit before work.
- Main head at cycle start was `0d3a4dc568f48da47776bd10026fcb0903e23120` (B-48 checkpoint commit).
- Immediately before this write, canonical checkpoint blob SHA remained `e9b48d66de93b22a11339aed3d53ecf673cedeae`; no newer A/B checkpoint appeared.

### Exact-source / transport evidence
- Re-read pinned provenance branch tree at commit `4f2c3fcabd8e689a880844b276e87b000a6ae7c0`; research subtree positively identifies helper `801ec274...` (3976 bytes) and exact fixture `93147e1d...` (5141 bytes).
- GitHub Contents base64 read of helper returns the same blob SHA `801ec274...`; exact fixture base64 read returns blob SHA `93147e1d...`. Source identity is therefore durable at GitHub.
- Available connected GitHub readers expose source/base64 to the model but no existing action was found that materializes an arbitrary repository blob/file reference directly into the local Node execution filesystem without model reconstruction. Workflow-artifact download only applies to artifacts that a workflow already emitted; there is no evidence these pinned files exist in such an artifact.
- Therefore exact-path remains `EXACT_SOURCE_NOT_RUN`. Do not convert connector-returned text/base64 by hand and call it exact-source execution.

### Minimal Class B proposal — PREPARED ONLY / NOT IMPLEMENTED
If owner later explicitly approves a Class B pipeline-only test bridge, smallest acceptable design is:
1. Add a manually dispatched, isolated provenance-test workflow; no push/schedule trigger and no deployment step.
2. Checkout exactly pinned commit `4f2c3fcabd8e689a880844b276e87b000a6ae7c0` (or an explicitly reviewed reconciled successor).
3. Before execution, calculate Git blob identities for `research/shadow_provenance_v8_8_2.js` and `research/shadow_provenance_exact_path_v8_8_2.test.mjs`; require exact matches `801ec274...` and `93147e1d...` for this frozen fixture run.
4. Run only targeted, observational, and exact-path provenance tests. No Worker deployment, no D1 write, no production API call, no secrets beyond normal checkout permission.
5. Upload test log/hash manifest as artifact for durable verification.
6. Any hash mismatch fails closed; no inference from a green unrelated regression workflow.
This is a deployment-pipeline change and remains Class B. It is not authorized merely because it is test-only; no workflow file was created or changed this cycle.

### Safety / falsification / UNKNOWN
- No production prevalence of provenance failure states was measured; prevalence remains UNKNOWN.
- No calendar maturity inference or historical Shadow backfill was performed.
- No formal factor/cohort/rank/threshold/source, scan, signal, allocation, trade, notification, runtime, schema, storage or workflow behavior changed.
- This preserves the falsification gate: exact-source PASS requires exact bytes actually executed, not equivalent/reconstructed assertions.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint blob SHA immediately before write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` observations only on formal SELECTED names.
3. Otherwise provenance lane remains blocked only on exact byte execution. Do not repeat GitHub path/blob/source discovery and do not hand-reconstruct source.
4. Do not implement the B-49 Class B workflow proposal without explicit owner approval. If no approval/new safe transport exists, preserve `EXACT_SOURCE_NOT_RUN` and advance other independent Class A research/observability work rather than looping on the same transport gap.
5. Only exact byte materialization + execution of helper `801ec274...` with fixture `93147e1d...` may upgrade exact-path to `LOCAL_EXACT_SOURCE_PASS`.
6. After exact-source pass, safely reconcile `research/b13-shadow-provenance` divergence with current main without force overwrite; re-read current production counterfactual path after reconciliation.
7. Only after reconciliation may additive provenance integration be implemented on isolated branch. Diagnostics remain parallel/research-only; no legacy outcome/coverage rewrite.
8. Run targeted + observational + exact-path + existing counterfactual regression tests from exact reconciled branch sources. CI remains NOT_RUN unless an authorized safe runner actually executes those exact sources.
9. If integration requires shared schema/runtime/storage/workflow changes, reclassify Class B before change and do not promote Production.
10. Do NOT revisit 09/18 execution or infer 09/22 Shadow without new trusted evidence. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
