# Research Checkpoint

Checkpoint sequence: B-50.
Updated: 2026-09-23 10:45 Asia/Taipei.

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

## NEW B-50 — Fundamental Persistence boundary clarified; no hidden R09/window mining
### Continuity / concurrency
- Re-read governance, worklist, canonical B-49 checkpoint and latest main commit before work.
- Main head at cycle start was `9b3b3605cd666bbee27e20ee3deaf4800ace4194` (B-49 checkpoint commit).
- Immediately before this write, canonical checkpoint blob SHA remained `d47f3792e739aa30485443485bc3585924a955c7`; no newer A/B checkpoint appeared.

### Research finding / falsification boundary
- Priority lane names Fundamental Persistence, but the frozen experiment registry currently defines only R01-R08. Existing monthly-revenue evidence is explicitly context/falsification metadata for R08 and does **not** define a persistence experiment.
- Registry governance explicitly says future revenue-persistence thresholds/windows require a separately preregistered experiment and cannot be selected after inspecting raw metadata. Governance simultaneously freezes R01-R08 and forbids R09/I08 in the current research phase.
- Therefore testing arbitrary 2/3/6/12-month revenue persistence windows now would violate the Factor-Zoo/data-snooping guard even if done only in Shadow. This is a real research constraint, not missing engineering work.
- Safe work under the current freeze is limited to evidence quality/PIT provenance and descriptive coverage of already-defined monthly-revenue metadata; no directionality claim, threshold search, rank/score use, or formal-selection effect is permitted.
- TPEx/TWSE monthly-revenue source parity from V8.7.11 remains evidence infrastructure, not proof that Fundamental Persistence has alpha. Historical first-known vintage remains a known limitation; current snapshots must not be backfilled into historical decision timestamps.

### Data quality / bias checks
- Fundamental Persistence effect remains UNKNOWN because no preregistered persistence definition exists and prospective independent dates are insufficient.
- Treating current monthly-revenue snapshots as historical PIT evidence would create look-ahead bias; choosing the best persistence window after seeing returns would create data snooping / Factor Zoo inflation.
- No new R09, no new threshold/window, no historical Shadow, no BAD/0 coercion, and no formal factor/rank/score change were created.
- This cycle therefore narrows the research lane instead of manufacturing an apparently productive but invalid persistence backtest.

### Runtime/readback
- Direct unauthenticated web reads of `/api/health` and `/api/research/dashboard?days=7` were inaccessible from the available web reader this cycle; no newer trusted Production plan/readback was established. Do not infer a new plan date from absence of access.
- Existing verified Production baseline is retained until a trusted authorized read supersedes it.

### Engineering classification
- Documentation/checkpoint-only research governance clarification: Class A / no runtime effect.
- Branch/code/tests/deployment: none this cycle.
- Formal Core invariants: unchanged by construction.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint blob SHA immediately before write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` observations only on formal SELECTED names.
3. Otherwise do **not** invent a Fundamental Persistence experiment while R01-R08 are frozen. Advance priority 3 Price Path Quality / Information Discreteness using only already-frozen R01-R08 definitions and existing prospective observations; first map which existing fields/experiments can falsify path-quality hypotheses without creating a new threshold/window.
4. Preserve Fundamental Persistence as UNKNOWN/context-only until a future explicit experiment-governance decision allows a preregistered definition. Any future persistence proposal must specify PIT vintage, fixed window/metric, null/falsification, redundancy against existing fundamental quality, independent-date maturity, and transaction-cost relevance before data inspection.
5. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; do not repeat byte-transport discovery or implement the B-49 Class B workflow proposal without explicit owner approval.
6. Only exact byte materialization + execution of helper `801ec274...` with fixture `93147e1d...` may upgrade exact-path to `LOCAL_EXACT_SOURCE_PASS`.
7. Do NOT revisit 09/18 execution or infer 09/22 Shadow without new trusted evidence. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
