# Research Checkpoint

Checkpoint sequence: B-52.
Updated: 2026-09-23 11:43 Asia/Taipei.

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

## B-50 retained — Fundamental Persistence boundary clarified
- Frozen registry defines only R01-R08. Monthly-revenue evidence is context/falsification metadata for R08, not a persistence experiment.
- Arbitrary revenue persistence windows would be a new experiment and violate the current no-R09/I08 freeze plus Factor-Zoo/data-snooping controls.
- Fundamental Persistence therefore remains UNKNOWN/context-only; no threshold/window search or historical PIT backfill is permitted.

## B-51 retained — Price Path Quality / Information Discreteness frozen map
- R01 is the fixed breakout path-integrity experiment: scan-date `priorHigh20`, 3 future trading-day close-hold label, D5/D10/MFE/MAE outcomes.
- R05 is the fixed next-day Overnight/Intraday decomposition.
- R07/R08 use same-scan-date medians of `residualSectorRs20` and `volumeTodayVsPrev5`; relative volume is only an attention proxy, not literal news/search/social attention.
- No new path threshold, holding window, volume multiple, wick cutoff, ATR cutoff or composite score is permitted while R01-R08 are frozen.

## NEW B-52 — Price-path evidence readiness audit; coverage before effects
### Continuity / concurrency
- Re-read governance, worklist and canonical B-51 checkpoint first. Main head at cycle start and immediately before checkpoint write remained `ce39f0d040edda541331978c8dfee3b0eb42bde1` (`research: B-51 map frozen price-path falsification fields`).
- Canonical checkpoint blob SHA immediately before write remained `14d91dda1b75a4df4c9e0993ea68002ef6c49cf1`; no newer A/B checkpoint appeared.
- No newer trusted Production readback with >=1 plan was established this cycle, so the primary execution funnel was not reinterpreted.

### What existing code/data can already support
- `buildMarketFeatures()` computes scan-time `close`, `open`, `priorHigh20`, `volumeTodayVsPrev5`, `dailyClosePosition`, `dailyUpperShadowRatio`, `atrPercent`, `volatility20`, `ret20` and related path descriptors from the historical bars available at scan time. These are sufficient raw scan-time ingredients for the R01 baseline and R07/R08 relative-volume side if they are durably preserved in the research snapshot.
- Existing history bars contain OHLC, so R05's next-day open/close and R01's future close sequence are derivable from future history **only as outcomes after the scan**, not as scan-time features. This preserves the look-ahead boundary when outcome computation is delayed until bars actually exist.
- The frozen registry already defines R01/R05/R07/R08 labels and maturity gates; therefore no new experiment ID, threshold or window is needed merely to measure coverage/readiness.

### Important readiness gaps / UNKNOWNs
- `residualSectorRs20` is required for R07/R08, but this cycle did not establish from the connected main-source read that every prospective Shadow row exposes it in a directly readable endpoint payload. Treat row-level R07/R08 strength coverage as **UNKNOWN**, not zero.
- Likewise, the code can derive future next open/close from history, but a durable endpoint/readback exposing per-row R05 Overnight/Intraday components was not positively established this cycle. R05 endpoint-level component coverage remains **UNKNOWN** even though the underlying computation is conceptually available.
- D5/D10/MFE/MAE are frozen outcome concepts, but the last trusted prospective sample still has zero mature outcomes. Therefore R01/R07/R08 directional effect remains **ACCUMULATING/UNKNOWN** regardless of field availability.
- `regime` and `scanDate` are required grouping/provenance dimensions. The frozen registry specifies them, but this cycle did not use absence of a source-code search hit as evidence of missing runtime data; runtime exposure must be positively verified before any coverage percentage is claimed.
- No attempt was made to infer 2026-09-22 Shadow existence from formal zero-pick evidence.

### No-new-parameter observational matrix definition
When a trusted row-level read is available, readiness should be counted by **independent scan date** and cohort, not by pooled stock rows:
- R01 readiness: `scanDate + cohort + priorHigh20 + scanClose + three future closes + D5/D10/MFE/MAE availability`; label only when the fixed three future trading closes are actually observed.
- R05 readiness: `scanDate + cohort + scanClose + nextOpen + nextClose`; report component availability and missingness, not alpha direction.
- R07/R08 readiness: `scanDate + cohort + residualSectorRs20 + volumeTodayVsPrev5 + D5/D10/D20/MFE/MAE + regime`; median groups are only valid within the same scan date and only when the cross-section has usable values.
- Always report same-date cohort counts separately for SELECTED / QUALIFIED_NOT_SELECTED / NEAR_MISS / REJECTED_AFTER_BASE / BROAD_CONTROL. Do not collapse controls.
- Coverage states: AVAILABLE, OUTCOME_NOT_MATURE, FIELD_UNKNOWN/MISSING, PROVENANCE_BLOCKED. Missing data never becomes BAD/0.

### Bias / falsification / redundancy implications
- Selection bias: a date with zero formal picks remains a valid formal zero-pick observation; it must not be dropped merely because R01/R05 cannot form SELECTED labels that date.
- Look-ahead: future OHLC can only populate frozen outcomes after observation; never copy current/future history into a historical scan snapshot.
- Data snooping / Factor Zoo: readiness matrix contains no return-ranking, no cutoff sweep and no post-hoc path score.
- Redundancy: eventual R01 separation must still be checked against residual RS/breakout-quality diagnostics; R07/R08 are not independent confirmations because they share the same two frozen inputs.
- Market-source bias: TWSE/TPEx missing history or missing row fields must be reported by market/source when possible; no market-specific missingness may be coerced to failure.
- Date clustering/overfit: one prospective scan date cannot support directionality; row count does not substitute for independent-date count.
- Transaction cost: no directional alpha was computed, so no gross-return claim bypasses the existing 30/60/100 bps stress requirement.

### Engineering classification / impact
- Class A documentation/readiness audit only; no runtime code, branch, test, deployment, schema, endpoint, factor, rank, threshold or Formal Core output changed.
- R01-R08 / I01-I07 definitions unchanged. Impact is evidence-quality/readiness only, chiefly R01/R05/R07/R08 observability; all other experiments unaffected.
- Formal Core invariants unchanged by construction.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint blob SHA immediately before any write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from trusted Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` observations only on formal SELECTED names.
3. Otherwise continue Price Path Quality readiness by locating the existing research endpoint/counterfactual serializer and **positively verifying** which of these fields are actually emitted per prospective Shadow row: `scanDate`, cohort, scan close, `priorHigh20`, `residualSectorRs20`, `volumeTodayVsPrev5`, regime, R01 label/future-close availability, R05 overnight/intraday, D5/D10/D20/MFE/MAE. Absence from search is not proof of absence; use exact source/readback evidence.
4. If the endpoint already emits enough data, produce the no-new-parameter per-date/per-cohort readiness matrix only; do not calculate directional alpha before maturity. If fields are missing, first determine whether a parallel research-only serializer can be isolated as Class A. Any shared runtime/API/schema change with indirect formal risk is Class B proposal-only.
5. Preserve Fundamental Persistence as UNKNOWN/context-only; no new persistence experiment/window while R01-R08 are frozen.
6. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; do not repeat byte-transport discovery or implement the B-49 Class B workflow proposal without explicit owner approval.
7. Do NOT revisit 09/18 execution or infer 09/22 Shadow without new trusted evidence. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
