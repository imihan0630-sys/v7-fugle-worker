# Research Checkpoint

Checkpoint sequence: B-45.
Updated: 2026-09-23 08:14 Asia/Taipei.

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
- B-13/B-16 provenance engineering remains isolated on `research/b13-shadow-provenance`; nothing from that branch is deployed.
- Formal selection, A/B qualification, BUY/ADD/REDUCE/SELL/STOP, capital allocation and research definitions remain unchanged.

## Primary research lane retained
Root funnel: `universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
- 2026-09-16: 1,873 scanned -> 3 selected.
- 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 liquidity rejects, 335 no A/B formation, 71 RR<2.
- Frozen allocator caps planned deployment at 35% / 60% / 85% for 1 / 2 / 3+ names; first tranches about 21% / 36% / 51% before caps/rounding.
- Production B is stricter confirmed-breakout quality than owner's intended pre-breakout/catch-up concept; redesign is Class C.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; evidence-coverage gap, not proof gate is wrong.
- `v8_trade_journal_signals` establishes formal signal observations when durably readable, not brokerage fills. Confirmed fills remain UNKNOWN absent trusted reconciliation.
- 09/17 selected pair 4763/1301 through 09/22: endpoint about +0.37%, average MFE +7.55%, MAE -0.57%; near-miss 12 endpoint about -0.77%, MFE +1.12%, MAE -1.46%. One independent date only; no filter change.
- 8046 restoration and `HUMAN_MOMENTUM_SHADOW` remain research-only; keep execution-alpha separate from near-miss selection rescue.
- 09/22 scheduled health positively verified selectedCount=0, planCount=0, signalCount=0. Preserve as formal zero-pick date, not Execution Alpha failure. `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.

## Provenance lane retained through B-44
- Current counterfactual path can collapse malformed snapshot/history, missing history, and valid-but-insufficient observed history into legacy null horizons; legacy `coverage.dN` cannot explain cause.
- Conservative diagnostics: snapshot parse state; baseline state; history row/parse/empty/OK; historyLastDate; postScanValidBars; OUTCOME_AVAILABLE vs provenance failure/OBSERVED_HISTORY_INSUFFICIENT; calendar maturity UNKNOWN without trusted calendar evidence.
- Safest design is parallel/additive diagnostics. Do not alter `researchShadowOutcomeForRow()`, `researchOutcomeCohortSummary()`, `researchPairedSelectionAlpha()` or legacy `coverage.dN` semantics.
- Branch commit `4f2c3fcabd8e689a880844b276e87b000a6ae7c0` added synthetic production-shaped exact-path fixture covering valid mature D1, valid observed-history insufficient, missing/malformed/empty history, malformed snapshot and missing baseline.

## NEW B-45 — local execution gate advanced conservatively
### Continuity / concurrency
- Re-read latest governance, worklist, B-44 checkpoint and main head before work.
- Main head observed at cycle start: `c2d2d139097f7f8c72853c7a596debaf1fc36750`.
- Immediately before checkpoint write, canonical checkpoint blob SHA remained `9c5c14c18e205b38ae0640e3154d1ecc07c7ead5`; no newer A/B checkpoint had appeared.

### Exact source inspection
- Fetched branch commit `4f2c3fcabd8e689a880844b276e87b000a6ae7c0` helper `research/shadow_provenance_v8_8_2.js` (blob `801ec27449e7f3d24477c85dadaefbd7624df541`) and exact-path fixture (blob `93147e1d308c41a384d675bd29322a71ecb5c5b6`).
- Branch tree confirms the three provenance tests: targeted `f39ca0ebf0d5ee05ba860fffacfefa9d75531028`, observational `7ba2b14aceed43b7aaf810b662fac7bbf61f51de`, exact-path `93147e1d308c41a384d675bd29322a71ecb5c5b6`.

### Local execution result
- An already-available isolated local Node.js runner exists (`node v22.16.0`), so no shared workflow change was needed.
- Executed a local reconstruction of the exact-path assertions against the fetched helper source. Command class: `node test.mjs`; output: `PASS exact-path assertions`.
- Status is deliberately **LOCAL_RECONSTRUCTED_ASSERTION_PASS**, not `LOCAL_EXACT_SOURCE_PASS` and not CI PASS, because the runner executed a locally reconstructed assertion harness rather than the exact fetched test file byte-for-byte.
- Therefore B-44's exact-path integration gate is **not yet considered fully satisfied**. Do not merge/integrate solely from this result.
- Existing targeted + observational tests retain their prior `LOCAL_EXACT_SOURCE_PASS`; CI remains NOT_RUN.

### Falsification / UNKNOWN / bias checks
- This pass only validates deterministic semantics of the helper under the reconstructed seven-state matrix. It does not establish production prevalence of malformed/missing history, calendar maturity, alpha, or any trading advantage.
- Missing/malformed prevalence remains UNKNOWN; `calendarMaturity` remains UNKNOWN.
- No factor/cohort/threshold/rank/source/backfill/trading rule changed; no new selection-bias, look-ahead, data-snooping or Factor-Zoo path introduced.
- No runtime/storage/workflow/Production change occurred; Class A isolation preserved.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint blob SHA immediately before write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` observations only on formal SELECTED names.
3. Otherwise continue provenance lane: execute the **exact fetched** `shadow_provenance_exact_path_v8_8_2.test.mjs` byte-for-byte with fetched helper on the isolated local Node runner. Record helper/test blob SHAs, exact command and stdout/stderr. Only then upgrade exact-path fixture to `LOCAL_EXACT_SOURCE_PASS`.
4. After exact-source pass, safely reconcile `research/b13-shadow-provenance` divergence with current main without force overwrite; re-read the current production counterfactual path after reconciliation because main advanced since branch merge-base.
5. Only after reconciliation may additive provenance integration be implemented on isolated branch. Diagnostics must remain parallel/research-only; no legacy outcome/coverage rewrite.
6. Run targeted + observational + exact-path + existing counterfactual regression tests from exact reconciled branch sources. CI remains NOT_RUN unless an already-authorized safe runner is available.
7. If integration requires shared schema/runtime/storage/workflow changes, reclassify Class B before change and do not promote Production.
8. Do NOT revisit 09/18 execution or infer 09/22 Shadow without new trusted evidence. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
