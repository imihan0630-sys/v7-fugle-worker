# Research Checkpoint

Checkpoint sequence: B-56.
Updated: 2026-09-23 13:44 Asia/Taipei.

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

## B-53/B-55 retained — Serializer, route, regime and deployment boundary
- `readShadowCounterfactualResearch()` reads up to 5000 archived Shadow rows, computes outcomes from post-scan history, aggregate coverage/cohort diagnostics, and returns only `recentOutcomes: outcomes.slice(-80)` at row level.
- Row serializer exposes scanDate/cohort/baseline/horizons/firstDay/breakout/full snapshot. R05 Overnight/Intraday is emitted. R07/R08 residualSectorRs20 and volumeTodayVsPrev5 can pass through snapshot when finite.
- Authenticated external route is source-proven as GET `/api/research/dashboard?days=...`; no secret was requested or bypassed and no authorized live dashboard response has been read in this automation context.
- Regime remains a separate `trade_research_days.market_json` path; inspected implementation has no per-row counterfactual regime join. Any shared-runtime join is Class B proposal-first.
- Exact `.github/workflows/v7-cloudflare.yml` means `research/**` changes on main enter production deployment; new research code must remain isolated unless deployment neutrality is proven. Shared dashboard/runtime wiring or workflow changes are Class B proposal-first.
- Readiness states remain `AVAILABLE / OUTCOME_NOT_MATURE / FIELD_UNKNOWN_OR_MISSING / PROVENANCE_BLOCKED`, counted by scanDate x cohort; runtime finite-value coverage remains UNKNOWN without trusted runtime read.

## NEW B-56 — Existing aggregate readiness does not expose per-date/per-cohort field-presence
### Continuity / concurrency
- Re-read governance/worklist/canonical B-55 checkpoint before audit. Checkpoint blob immediately before write was `e9ca8f473932e063b3e1dcef98aead277901707d`; re-fetched immediately before write and no newer A/B checkpoint appeared.
- No newer trusted Production readback with >=1 formal plan was established in this cycle; primary execution funnel is not reinterpreted.

### Positive source audit
- Exact `research/counterfactual_v8_7_4.js` shows the aggregate returned by `readShadowCounterfactualResearch()` consists of: `archivedRows`, `outcomeRows`, `historySymbols`, horizon-only `coverage.d1/d3/d5/d10/d20`, `byCohort` horizon outcome statistics, `selectionAlpha`, `diagnostics`, and `recentOutcomes` last-80 rows.
- `researchOutcomeCohortSummary()` groups by cohort but only summarizes horizon return/MFE/MAE metrics. It does not count field presence for breakout reference/status, firstDay overnight/intraday, `residualSectorRs20`, or `volumeTodayVsPrev5`, and it does not retain per-scanDate field-presence counts.
- `buildShadowResearchDiagnostics()` aggregates breakout counts, first-day overnight/intraday only when both are finite, residual-RS D5 median study, and Quiet/Attention D5 study. These are effect/diagnostic aggregates, not a scanDate x cohort readiness matrix and they cannot distinguish field missingness from outcome immaturity/provenance failure.
- Therefore the currently inspected exact aggregate path does **not** positively provide the required per-scanDate/per-cohort field-presence counts for R01/R05/R07/R08. This conclusion is based on exact serializer/aggregate source, not merely search absence.

### Research consequence
- Existing aggregate statistics must not be reused as a readiness denominator: e.g. `intradayVsOvernight.n` requires both first-day fields finite and therefore conflates field presence with D1 outcome availability; residual/quiet studies additionally require mature D5 and cross-sectional eligibility.
- Using those counts as evidence-readiness would create survivorship/availability conditioning and could undercount fields on immature dates, biasing prospective coverage toward already-mature observations.
- Correct readiness remains observational: for each independent `scanDate x cohort`, separately count field present/unknown and outcome maturity/provenance state before any alpha estimate.
- Runtime finite-value coverage remains UNKNOWN because no authorized live dashboard response was obtained. No directional alpha, threshold search, or return ranking was performed.

### Bias / falsification / redundancy checks
- Selection/availability bias: explicitly prevented by refusing to use D1/D5-conditioned diagnostics as field-presence denominators.
- Look-ahead: no backfill or future data inserted into scan-time fields.
- Data snooping / Factor Zoo: no R09/I08, cutoff, window or composite introduced.
- Market-source bias: TWSE/TPEx field missingness remains UNKNOWN until actual archived rows can be read through an authorized path.
- Redundancy: R07/R08 shared inputs remain recognized; no independent-evidence double count.
- Date clustering: readiness unit remains independent scanDate x cohort, not stock-row count.
- Transaction costs: no alpha claim; unchanged.

### R01-R08 / I01-I07 impact
- R01/R05/R07/R08: only readiness-observability gap clarified; definitions and status unchanged.
- R02/R03/R04/R06 and I01-I07: unchanged.
- Fundamental Persistence remains UNKNOWN/context-only.

### Engineering classification / tests / deployment / rollback
- Classification: Class A source/documentation audit only.
- Code/runtime/schema/workflow: unchanged; only canonical checkpoint updated.
- Tests: not applicable to source aggregate audit; no runtime claim made.
- Deployment: no production runtime change intended by this checkpoint-only commit; protected formal outputs unchanged.
- Rollback: previous checkpoint blob `e9ca8f473932e063b3e1dcef98aead277901707d` / Git history.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint blob SHA before any write.
2. If a newer trusted formal scan with >=1 plan exists, immediately restore primary funnel priority: establish plan date/count from trusted Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Otherwise do not re-discover the dashboard route or aggregate gap. Runtime field coverage remains UNKNOWN unless an already-authorized path can read the authenticated dashboard without exposing secrets.
4. Continue Price Path Quality/Information Discreteness as a Class A design audit only: define the minimal **branch-only** readiness matrix schema/algorithm using existing archived snapshot/outcome inputs, with separate `fieldState` and `outcomeState`, grouped by independent `scanDate x cohort`. Do not wire it into shared runtime/main yet.
5. The design must prevent conditioning on D1/D5 maturity: R01 scan-time reference presence, R05 scan-time baseline presence vs next-day outcome state, R07/R08 scan-time residual/relative-volume presence are counted independently of future horizon availability. Missing/parse failures remain UNKNOWN/PROVENANCE_BLOCKED, never BAD/0.
6. Before any code, classify the branch-only helper as Class A and list frozen invariants: no change to legacy `coverage.dN`, `byCohort`, selectionAlpha, diagnostics, recentOutcomes, Formal Core, monitoring or push. If later shared dashboard wiring is proposed, classify that promotion separately as Class B.
7. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; do not repeat byte-transport discovery or implement the B-49 Class B CI proposal without approval. Do not infer 09/22 Shadow without new trusted evidence; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
