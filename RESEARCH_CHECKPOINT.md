# Research Checkpoint

Checkpoint sequence: B-55.
Updated: 2026-09-23 13:14 Asia/Taipei.

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

## B-53/B-54 retained — Serializer and deployment boundary
- `readShadowCounterfactualResearch()` reads up to 5000 archived Shadow rows, computes outcomes from post-scan history, aggregate coverage/cohort diagnostics, and returns only `recentOutcomes: outcomes.slice(-80)` at row level.
- Row serializer exposes scanDate/cohort/baseline/horizons/firstDay/breakout/full snapshot. R05 Overnight/Intraday is emitted. R07/R08 residualSectorRs20 and volumeTodayVsPrev5 can pass through snapshot when finite.
- Regime is stored/read separately through `trade_research_days.market_json`; B-54 had not yet established the external HTTP route or a per-row regime join.
- Exact `.github/workflows/v7-cloudflare.yml` means `research/**` changes on main enter production deployment; new research code must remain isolated unless deployment neutrality is proven. Shared dashboard/runtime wiring or workflow changes are Class B proposal-first.
- Readiness states remain `AVAILABLE / OUTCOME_NOT_MATURE / FIELD_UNKNOWN_OR_MISSING / PROVENANCE_BLOCKED`, counted by scanDate x cohort; runtime finite-value coverage remains UNKNOWN without trusted runtime read.

## NEW B-55 — Exact dashboard route and regime-join boundary positively verified
### Continuity / concurrency
- Re-read governance/worklist/canonical B-54 checkpoint and latest main first. Main head before this write was `67ce41bce15cd00c2658a52236b27c5862d3bd5a` (`research: B-54 audit readiness integration deployment boundary`).
- Checkpoint blob immediately before write was re-fetched as `159c7e5d67073600e48413b83e22d8068c749fa4`; no newer A/B checkpoint appeared before write.
- No newer trusted Production readback with >=1 formal plan was established in this cycle; primary execution funnel is therefore not reinterpreted.

### Exact external route established from source
- Exact `scripts/apply_v8_7_0.py` positively defines the protected GET route `/api/research/dashboard?days=...`; it requires `isAuthorized(request,env)` / `x-admin-token`, rejects non-GET, and returns `readResearchDashboard(...)`.
- The same exact source defines `/research` as the research-center UI and its browser code calls `/api/research/dashboard?days=...` with the ADMIN_TOKEN header.
- Exact `scripts/apply_v8_7_4.py` later extends that same `readResearchDashboard()` payload with `counterfactualResearch`, `executionAlpha`, and `regimePersistence`. Therefore the deployed research dashboard route for the counterfactual payload is source-proven as `/api/research/dashboard`, not merely inferred from helper naming.
- This is code-level route proof only. This automation context does not possess/expose the ADMIN_TOKEN value and did not attempt to obtain or bypass it. No authorized live dashboard response was read this cycle; runtime finite-value counts remain UNKNOWN.

### Regime join audit — positive source boundary
- Exact `research/counterfactual_v8_7_4.js` shows `readShadowCounterfactualResearch()` queries only `trade_research_shadow_candidates` plus `v7_history_cache`, then serializes outcomes; it does not read `trade_research_days` and does not attach regime to each counterfactual row.
- Exact same module separately defines `readResearchRegimePersistence()` which reads `trade_research_days(scan_date,market_json)` and parses `{scanDate, market}` for aggregate transition/persistence diagnostics.
- Exact `scripts/apply_v8_7_4.py` loads `counterfactualResearch` and `regimePersistence` as separate Promise results and emits them as separate dashboard fields. There is no join between those two paths in the exact implementation inspected.
- Therefore per-row/per-cohort regime readiness is not currently available from the existing counterfactual result. A scanDate observational join is technically possible from existing stored sources, but implementing/wiring it into shared dashboard runtime is Class B proposal-first under the current deployment boundary. No such change was made.

### Readiness consequence
- R01: source path to row breakout state/reference is established; runtime finite coverage still UNKNOWN.
- R05: source path to firstDay overnight/intraday is established; runtime finite coverage still UNKNOWN.
- R07/R08: source path to residualSectorRs20 and volumeTodayVsPrev5 through snapshot is established; runtime finite coverage still UNKNOWN.
- Regime: day-level source exists separately, but counterfactual row-level join is absent in inspected exact implementation. Mark row-level regime readiness `FIELD_UNKNOWN_OR_MISSING` only when a particular archived row/day is actually inspected and lacks a usable join source; do not globally coerce all rows to missing from source structure alone.
- Current prospective maturity remains insufficient for directional alpha. No effect estimate, return ranking, threshold sweep or new experiment was performed.

### Bias / falsification / redundancy checks
- Selection bias: the dashboard's `recentOutcomes` remains last-80; even a future authorized live read may only characterize that truncated sample at row level, never full archive coverage.
- Look-ahead: no historical backfill or future information inserted into scan-time fields.
- Data snooping / Factor Zoo: no R09/I08, new cutoff, new window, or outcome-driven label.
- Market-source bias: runtime missingness by TWSE/TPEx remains UNKNOWN; source structure alone cannot establish equal market coverage.
- Redundancy: R07/R08 continue to share residual-RS/relative-volume inputs; no double-counting as independent evidence.
- Date clustering: independent scan date remains evidence unit; one prospective Shadow date remains far below maturity.
- Transaction costs: no alpha claim was made; existing cost stress is unchanged.

### R01-R08 / I01-I07 impact
- R01/R05/R07/R08: observability route and regime-join boundary clarified only; definitions/status unchanged.
- R02/R03/R04/R06 and I01-I07: unchanged.
- Fundamental Persistence remains UNKNOWN/context-only.

### Engineering classification / tests / deployment / rollback
- Classification: Class A source/documentation audit only.
- Code/runtime/schema/workflow: unchanged; only canonical checkpoint updated.
- Tests: not applicable to source-route audit; no runtime claim made.
- Deployment: no production runtime change intended by this checkpoint-only commit; protected formal outputs unchanged.
- Rollback: previous checkpoint blob `159c7e5d67073600e48413b83e22d8068c749fa4` / Git history.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint blob SHA before any write.
2. If a newer trusted formal scan with >=1 plan exists, immediately restore primary funnel priority: establish plan date/count from trusted Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Otherwise do not re-discover the dashboard route: it is source-proven as authenticated GET `/api/research/dashboard?days=...`. Only if an already-authorized connector/runtime path can supply the required auth without exposing secrets, read it and label `recentOutcomes` as truncated; otherwise runtime field coverage remains UNKNOWN without asking for secret values.
4. Continue Class A source audit of readiness using existing exact sources: determine whether any existing aggregate (not row-level last-80) already exposes per-scanDate/per-cohort field-presence counts for R01/R05/R07/R08. Positive source proof required; absence of search results is not proof of absence.
5. For regime, do not repeat join discovery: exact implementation has separate counterfactual and research-day paths with no inspected row join. Any additive scanDate join in shared dashboard/runtime is Class B proposal-first; branch-only design is allowed but main promotion is not.
6. Preserve readiness states AVAILABLE / OUTCOME_NOT_MATURE / FIELD_UNKNOWN_OR_MISSING / PROVENANCE_BLOCKED and independent-date/cohort counts. No directional alpha until frozen maturity gates are met.
7. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; do not repeat byte-transport discovery or implement the B-49 Class B CI proposal without approval. Do not infer 09/22 Shadow without new trusted evidence; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
