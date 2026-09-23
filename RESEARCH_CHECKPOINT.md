# Research Checkpoint

Checkpoint sequence: B-51.
Updated: 2026-09-23 11:12 Asia/Taipei.

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

## NEW B-51 — Price Path Quality / Information Discreteness mapped to frozen definitions
### Continuity / concurrency
- Re-read governance, worklist, canonical B-50 checkpoint, frozen experiment registry, research firewall and latest main commit before work.
- Main head at cycle start was `86e12fb6fc327c55f74d7ca2c87c3e6b7746bcc3` (`research: B-50 freeze fundamental persistence boundary`).
- Immediately before this write, canonical checkpoint blob SHA remained `7cc45e7ca0e159988d4727e67525e42854eb225c`; no newer A/B checkpoint appeared.

### Frozen path-quality evidence map — no new experiment/window
- R01 is the direct frozen price-path falsification experiment: fixed baseline = scan-date `priorHigh20`; fixed labels = `HELD_3D` only if all next 3 trading-day closes remain >= baseline, otherwise `FAILED_CLOSE_WITHIN_3D` if any closes below. Fixed outcomes are existing D5/D10 plus MFE/MAE; changing 3 days, using lows, or choosing a different baseline is prohibited without a new experiment.
- R05 is the frozen information-arrival decomposition: next-day Overnight = next open / scan close - 1; Intraday = next close / next open - 1. This can test whether continuation is gap-driven or session-driven without inventing an information-discreteness threshold.
- R07/R08 provide a frozen attention proxy only: `volumeTodayVsPrev5`, split cross-sectionally by each scan date's median together with `residualSectorRs20`. This is not literal news/search/social attention and must not be relabeled as such. It can falsify whether path quality differs between quiet-underreaction and attention-continuation proxies without adding 1.5x/1.8x/2.0x thresholds.
- Existing raw descriptive fields can explain mechanisms without creating a new hypothesis: `dailyClosePosition`, `dailyUpperShadowRatio`, `priorHigh20`, `volumeTodayVsPrev5`, `volumeContraction5to20`, `atrPercent`, `volatility20`, `ret20`, `residualSectorRs20`. They are descriptive/context fields unless already consumed by R01-R08; do not mine cutoffs from them.
- Formal `strategySetupState()` already contains hard A/B thresholds (for example B breakout vs priorHigh20, volume >=1.3x, close-position >=0.65, upper-shadow <=0.35). Those are Formal Core mechanics, not permission to create additional Shadow threshold sweeps. Research must observe/falsify them without changing or multiplying them.

### Hypotheses that can be falsified now without R09
1. **Breakout path integrity**: R01 asks whether 3-day close-hold above priorHigh20 has stable D5/D10/MFE/MAE separation from failed-close cases. Null/反證 = no stable difference, single-date/sector/regime dependence, or redundancy with residual RS/breakout quality.
2. **Information timing**: R05 asks whether next-day continuation comes mainly from overnight gap or intraday move. Null/反證 = unstable decomposition, extreme-gap dependence, or insufficient independent dates.
3. **Attention-path mechanism**: R07/R08 ask whether strong residual-RS names with low vs high relative volume have different subsequent paths. Null/反證 = no stable path difference, few-date concentration, regime concentration, or complete explanation by residual RS/breakout quality.
- These are not three new experiments; they are the existing R01/R05/R07/R08 read through the Price Path Quality / Information Discreteness lens.

### Bias / redundancy / maturity controls
- Selection bias: compare SELECTED with same-date Shadow cohorts separately; do not pool controls or treat stock rows from one date as independent dates.
- Look-ahead: scan-date path fields must be frozen at scan time; future closes/opens only populate outcomes/labels defined by the registry.
- Data snooping / Factor Zoo: no new threshold, holding window, baseline, volume multiple, wick cutoff, ATR cutoff or composite path score may be selected after viewing returns.
- Redundancy: R01 path integrity must be checked against residual RS / breakout quality; R07/R08 already share residualSectorRs20 and volumeTodayVsPrev5, so apparent agreement is not independent evidence.
- Coverage/zero-pick: zero formal picks remain a valid formal outcome, not a failed experiment. Shadow coverage gaps remain data-quality gaps.
- Transaction costs: any eventual D5/D10 interpretation must retain existing 30/60/100 bps round-trip stress; gross path separation alone is insufficient.
- Date clustering/overfit: independent scan date is the evidence unit; current prospective evidence is still far below maturity, so all directionality remains ACCUMULATING/UNKNOWN.
- Market-source bias: path variables are price/volume derived, but universe/history coverage can still differ by market; do not interpret missing TPEx/TWSE history as BAD.

### Engineering classification
- Research mapping/checkpoint only: Class A / no runtime effect.
- No code, branch, tests, deployment, threshold, rank or formal output changed.
- Formal Core invariants unchanged by construction.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint blob SHA immediately before write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from trusted Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` observations only on formal SELECTED names.
3. Otherwise continue Price Path Quality with **coverage/readiness, not effect hunting**: map whether the existing research endpoint/Shadow rows expose all inputs needed for R01/R05/R07/R08 on prospective dates (`priorHigh20`, scan close, next open/close, residualSectorRs20, volumeTodayVsPrev5, D5/D10/MFE/MAE, regime/scanDate). Missing fields stay UNKNOWN. Do not add fields to shared runtime unless isolated Class A is clearly possible.
4. If existing rows are sufficient, define a no-new-parameter observational matrix keyed by independent scan date: R01 label coverage, R05 overnight/intraday coverage, R07/R08 proxy-group coverage, plus same-date cohort counts. Do not calculate directional alpha until maturity gates are met.
5. Preserve Fundamental Persistence as UNKNOWN/context-only; no new persistence experiment/window while R01-R08 are frozen.
6. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; do not repeat byte-transport discovery or implement the B-49 Class B workflow proposal without explicit owner approval.
7. Do NOT revisit 09/18 execution or infer 09/22 Shadow without new trusted evidence. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
