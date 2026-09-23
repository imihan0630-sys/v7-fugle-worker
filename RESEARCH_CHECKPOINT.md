# Research Checkpoint

Checkpoint sequence: B-54.
Updated: 2026-09-23 12:39 Asia/Taipei.

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

## B-51/B-52 retained — Price Path Quality readiness boundary
- R01 = fixed `priorHigh20` + future 3-close hold/fail; R05 = next-day Overnight/Intraday; R07/R08 = same-date medians of `residualSectorRs20` and `volumeTodayVsPrev5`.
- No new threshold/window/volume multiple/wick cutoff/ATR cutoff/composite score while R01-R08 are frozen.
- Readiness is counted by independent scan date and cohort. Zero-pick dates remain valid formal observations; row count never substitutes for independent dates.
- Future OHLC only populates outcomes after observation; no historical snapshot backfill with future information.

## B-53 retained — Exact counterfactual serializer field exposure
- `readShadowCounterfactualResearch()` reads up to 5000 archived Shadow rows, computes outcomes from post-scan history, aggregate coverage/cohort diagnostics, and returns only `recentOutcomes: outcomes.slice(-80)` at row level.
- Row serializer exposes scanDate/cohort/baseline/horizons/firstDay/breakout/full snapshot. R05 Overnight/Intraday is emitted. R07/R08 residualSectorRs20 and volumeTodayVsPrev5 can pass through snapshot when finite.
- Regime is stored/read separately through `trade_research_days.market_json`; no per-row regime join exists in the counterfactual serializer.
- Runtime finite-value coverage remains UNKNOWN until trusted runtime read. Last-80 must never be treated as complete archive coverage.

## NEW B-54 — Readiness integration/deployment boundary audit
### Continuity / concurrency
- Re-read governance, worklist and canonical B-53 checkpoint first. Main tree at this cycle is `70b5d1fc4e18105f167b8f0b267a2d6a147dc7f3`; checkpoint blob immediately before write re-fetched as `89a9fb217567255c7e67c3badde20824ad5b37bb`. No newer checkpoint appeared before this write.
- No newer trusted Production readback with >=1 formal plan was established in this cycle, so execution-funnel priority was not reinterpreted.

### Exact integration path established
- Exact `scripts/apply_v8_7_4.py` proves `readShadowCounterfactualResearch()` is loaded inside `readResearchDashboard()` and its result is emitted as `counterfactualResearch` in the existing research dashboard payload. Therefore the counterfactual serializer is not merely dead helper code; it is wired into the research dashboard build path.
- This establishes a trusted code-level route into the dashboard payload, but this cycle did not positively establish the externally callable HTTP path nor obtain an authorized live runtime response. Runtime finite-value counts therefore remain UNKNOWN; no source-code inference is promoted to runtime evidence.

### Critical deployment-boundary finding
- Exact `.github/workflows/v7-cloudflare.yml` shows production deployment triggers on pushes to `main` that touch `RESEARCH_WORKLIST.md`, `research/**`, `tests/**`, the deploy workflow itself, and formal Worker/apply scripts.
- Consequence: even a logically isolated new file under `research/**` merged to main automatically enters the production deployment workflow. A source-only Class A readiness helper is not operationally deployment-neutral on main.
- Therefore the B-53 idea of adding an isolated readiness module must remain branch-only unless its promotion path is proven not to alter shared runtime/deployment behavior. Wiring it into `readResearchDashboard()` or changing the shared deploy workflow is Class B proposal-first under governance.
- No module, schema, endpoint, workflow, Worker, deployment, factor, threshold, rank, signal, capital, push or Formal Core code was changed this cycle.

### Readiness design tightened without adding an experiment
If/when implemented in an isolated research branch, the observational matrix should consume existing frozen fields only and report, per scanDate x cohort:
- `AVAILABLE`: required scan-time field finite/explicit and required outcome mature.
- `OUTCOME_NOT_MATURE`: scan-time field exists but frozen D1/D3/D5/D10/D20 observation is not yet available.
- `FIELD_UNKNOWN_OR_MISSING`: archived scan-time field absent/non-finite; never coerce to 0/BAD.
- `PROVENANCE_BLOCKED`: outcome absence cannot safely be distinguished from parse/history provenance failure.
It must separately count R01 breakout status/reference, R05 overnight/intraday, R07/R08 residualSectorRs20/volumeTodayVsPrev5, horizons/MFE/MAE, and regime availability by scanDate. It must preserve cohorts and report independent dates, not just rows.

### Bias / falsification / redundancy
- Selection bias: full-archive readiness cannot be inferred from `recentOutcomes` last-80. A live dashboard read, if obtained, is useful for current finite-value inspection only and must be labeled truncated.
- Look-ahead: no historical field backfill or future-data substitution permitted.
- Market-source bias: TWSE/TPEx missingness must remain separately diagnosable where source metadata exists; absence is UNKNOWN.
- Factor Zoo/data snooping: no R09/I08, threshold sweep, return ranking or new label introduced.
- Redundancy: R07/R08 still share residual-RS/relative-volume inputs; readiness of both is not two independent pieces of alpha evidence.
- Date clustering: independent scan date remains the unit; current prospective maturity remains insufficient for directionality.

### R01-R08 / I01-I07 impact
- R01/R05/R07/R08: evidence-observability/readiness semantics clarified only; definitions unchanged.
- R02/R03/R04/R06 and I01-I07: no definition, evidence, threshold or status change.
- Fundamental Persistence remains UNKNOWN/context-only.

### Engineering classification / tests / deployment / rollback
- Classification: Class A documentation/source audit only.
- Branch/code: none created/changed beyond this durable checkpoint.
- Tests: not applicable to documentation audit; no runtime claim made.
- Deployment: none intended from this checkpoint-only update; protected formal outputs unchanged.
- Rollback: previous checkpoint blob `89a9fb217567255c7e67c3badde20824ad5b37bb` / Git history.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint blob SHA before any write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from trusted Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Otherwise locate the exact external HTTP route that serves `readResearchDashboard()` / `counterfactualResearch` from the deployed runtime. If an already-authorized trusted read is possible, inspect `recentOutcomes` only as a truncated live sample and count finite/explicit R01/R05/R07/R08 fields; do not infer full archive coverage.
4. Inspect existing research modules for any already-implemented observational join of Shadow/counterfactual rows to `trade_research_days.market_json.regime`. Positive source proof required; absence of code-search results is not proof of absence.
5. Do not add a new `research/**` file to main merely because its logic is Class A: current workflow would trigger production deployment. Any implementation should stay on an isolated branch until deployment neutrality is proven; any shared dashboard/runtime wiring or workflow change is Class B proposal-first.
6. Preserve readiness states AVAILABLE / OUTCOME_NOT_MATURE / FIELD_UNKNOWN_OR_MISSING / PROVENANCE_BLOCKED and independent-date/cohort counts. No directional alpha until frozen maturity gates are met.
7. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; do not repeat byte-transport discovery or implement the B-49 Class B CI proposal without approval. Do not infer 09/22 Shadow without new trusted evidence; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
