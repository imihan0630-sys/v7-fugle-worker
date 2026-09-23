# Research Checkpoint

Checkpoint sequence: B-48.
Updated: 2026-09-23 09:42 Asia/Taipei.

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

## Provenance lane retained through B-47
- Current counterfactual path can collapse malformed snapshot/history, missing history, and valid-but-insufficient observed history into legacy null horizons; legacy `coverage.dN` cannot explain cause.
- Conservative diagnostics: snapshot parse state; baseline state; history row/parse/empty/OK; historyLastDate; postScanValidBars; OUTCOME_AVAILABLE vs provenance failure/OBSERVED_HISTORY_INSUFFICIENT; calendar maturity UNKNOWN without trusted calendar evidence.
- Safest design is parallel/additive diagnostics. Do not alter `researchShadowOutcomeForRow()`, `researchOutcomeCohortSummary()`, `researchPairedSelectionAlpha()` or legacy `coverage.dN` semantics.
- Isolated branch commit `4f2c3fcabd8e689a880844b276e87b000a6ae7c0` contains helper blob `801ec27449e7f3d24477c85dadaefbd7624df541` and exact-path fixture blob `93147e1d308c41a384d675bd29322a71ecb5c5b6` plus prior targeted/observational tests.
- Targeted + observational tests retain `LOCAL_EXACT_SOURCE_PASS`. Exact-path fixture remains `LOCAL_RECONSTRUCTED_ASSERTION_PASS / EXACT_SOURCE_NOT_RUN`; CI NOT_RUN.
- B-47 verified GitHub blob access is healthy; the remaining gap is trusted byte materialization into an execution runner.

## NEW B-48 — existing CI is not an authorized no-change bridge for the isolated provenance fixture
### Continuity / concurrency
- Re-read governance, worklist, canonical B-47 checkpoint and latest main commit before work.
- Latest main read was `0658514fca9bc62b3d5461d90af428daf91bee7e` (B-47 checkpoint commit).
- Immediately before this write, canonical checkpoint blob SHA remained `c9212a29844d549b8836bef28be8e2234ed6c9e5`; no newer A/B checkpoint appeared.

### Runner / workflow evidence
- Re-read `.github/workflows/v7-regression.yml` from current main.
- Existing regression workflow has `workflow_dispatch`, but its checkout executes the ref selected by the workflow run and its test list is hard-coded to production/main test paths; it does **not** invoke `research/shadow_provenance_exact_path_v8_8_2.test.mjs` or the isolated provenance helper/fixture.
- Push automation only covers `main` and `repair/v7-30-rules-20260916`, not `research/b13-shadow-provenance`.
- Therefore re-running or manually dispatching the unchanged existing workflow cannot truthfully establish execution of pinned helper blob `801ec274...` plus fixture blob `93147e1d...`.
- Adding a checkout/ref override, artifact bridge, or new test invocation to the shared workflow would be a deployment-pipeline change and is Class B under governance. It may be proposed/prepared, but must not be promoted merely to satisfy this Class A evidence gap.

### Safety / falsification / UNKNOWN
- Exact-path status remains `LOCAL_RECONSTRUCTED_ASSERTION_PASS / EXACT_SOURCE_NOT_RUN`; CI remains NOT_RUN.
- No evidence about production prevalence of provenance failure states was generated; prevalence remains UNKNOWN.
- No calendar maturity inference, historical Shadow backfill, factor/cohort/rank/threshold/source change, or Formal Core change was made.
- This cycle avoids a false-positive test claim: an existing green regression workflow would not prove the isolated exact fixture ran.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint blob SHA immediately before write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` observations only on formal SELECTED names.
3. Otherwise continue provenance lane without modifying shared workflow. Seek a pre-existing connector/file-reference mechanism that can materialize pinned GitHub blob bytes into an execution filesystem and verify Git blob SHA before running. Do not repeat generic source/blob discovery.
4. If no no-change trusted transport exists, retain `EXACT_SOURCE_NOT_RUN`. Prepare a minimal **Class B proposal only** for an isolated/manual CI test path that checks out the pinned provenance branch/commit, verifies both blob hashes, and runs only the provenance tests; do not merge/promote/deploy without owner decision.
5. Only exact byte materialization + execution of helper `801ec274...` with fixture `93147e1d...` may upgrade exact-path to `LOCAL_EXACT_SOURCE_PASS`.
6. After exact-source pass, safely reconcile `research/b13-shadow-provenance` divergence with current main without force overwrite; re-read current production counterfactual path after reconciliation.
7. Only after reconciliation may additive provenance integration be implemented on isolated branch. Diagnostics remain parallel/research-only; no legacy outcome/coverage rewrite.
8. Run targeted + observational + exact-path + existing counterfactual regression tests from exact reconciled branch sources. CI remains NOT_RUN unless an authorized safe runner actually executes those exact sources.
9. If integration requires shared schema/runtime/storage/workflow changes, reclassify Class B before change and do not promote Production.
10. Do NOT revisit 09/18 execution or infer 09/22 Shadow without new trusted evidence. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
