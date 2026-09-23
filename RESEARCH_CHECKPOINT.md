# Research Checkpoint

Checkpoint sequence: B-53.
Updated: 2026-09-23 12:11 Asia/Taipei.

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

## NEW B-53 — Exact counterfactual serializer field-exposure verification
### Continuity / concurrency
- Re-read governance, worklist and canonical B-52 checkpoint first. Main head at cycle start was `d705793ccce9c143ce00d1925d1e11219a637de1` (`research: B-52 audit price-path evidence readiness`).
- Canonical checkpoint blob immediately before this write was re-fetched as `206c00deea668261fb6eb73deddc244b2d709a11`; no newer A/B checkpoint appeared during the cycle.
- No newer trusted Production readback with >=1 plan was established, so the primary execution funnel was not reinterpreted.

### Positive source verification — what the existing serializer actually emits
Exact main source `research/counterfactual_v8_7_4.js` establishes the following, without relying on code-search absence:
- `researchShadowOutcomeForRow()` emits row-level `scanDate`, `symbol`, `name`, `cohort`, `pool`, `exclusionReason`, `baselineClose`, `horizons`, `firstDay`, `breakout`, and the complete parsed `snapshot` object.
- `horizons.d1/d3/d5/d10/d20`, when mature, each expose `tradingDays`, `asOfDate`, `returnPct`, `mfePct`, `maePct`; immature horizons are `null`.
- `firstDay` exposes `overnightPct`, `intradayPct`, D1 total return and D1 as-of date. Therefore R05 component exposure is positively verified in the serializer; raw `nextOpen`/`nextClose` are not separately emitted, but the frozen R05 components themselves are.
- `breakout` exposes `reference`, `activeAtScan`, fixed R01 `status`, `closeFailDate`, and `intradayViolationDate`. The helper obtains the breakout reference first from `snapshot.price.breakoutReferencePriceResearch`, otherwise derives it from `snapshot.price.close` plus `snapshot.price.breakoutDistancePct`. The serializer does **not** expose the three future closes themselves.
- `recentOutcomes` returns only `outcomes.slice(-80)`. Thus row-level endpoint observability is capped to the latest 80 serialized outcomes even though the D1 query can archive up to 5000 Shadow rows.
- `coverage.dN` is aggregate mature-row count only. It does not provide per-date/per-cohort readiness and does not explain provenance failure vs insufficient observation.

### Positive source verification — R07/R08 fields
- The same exact source proves the serializer retains the complete parsed `snapshot`, and `researchQuietAttentionStudy()` directly reads `snapshot.price.residualSectorRs20` and `snapshot.volume.volumeTodayVsPrev5`.
- Therefore the serializer **can emit those two values whenever they were actually present in the archived snapshot**; this removes B-52's serializer-level UNKNOWN.
- It does **not** prove every prospective Shadow row contains valid finite values. Row-level runtime coverage remains UNKNOWN until a trusted readback is counted; missing/invalid snapshot values must not be coerced to zero.

### Regime exposure remains separate
- Counterfactual row outcomes do not attach `regime`. `readResearchRegimePersistence()` separately reads `trade_research_days.market_json` and exposes usable regime-day sequences.
- Therefore the existing counterfactual row serializer alone is insufficient for a per-row R07/R08 `regime` readiness matrix. Joining regime by scanDate would require either a research-side observational join/read or an additive serializer change.
- Do not infer regime absence in storage: exact source positively shows it exists in the separate research-day path when `market_json.regime` is available.

### Readiness consequence / no directional claim
- R01: row-level scan date/cohort/baseline close/fixed breakout status/reference + D5/D10/MFE/MAE are exposed; raw future closes are not. For the frozen R01 classification, raw future closes are not required to interpret the already-fixed HELD/FAILED/PENDING status, but they would be needed for an audit trail that independently recomputes the label.
- R05: serializer-level readiness is stronger than B-52 assumed because Overnight/Intraday components are already emitted. Runtime finite-value coverage remains UNKNOWN until readback.
- R07/R08: factor values are carried through snapshot when present, and D5/D10/D20/MFE/MAE exist when mature; regime is not joined into each outcome row. Runtime finite-value coverage and same-date cross-section sufficiency remain UNKNOWN.
- Last trusted prospective sample still has zero mature outcomes; all directional alpha remains ACCUMULATING/UNKNOWN. No return ranking or threshold sweep was performed.

### Bias / falsification / redundancy checks
- Selection bias: `recentOutcomes` last-80 truncation can distort cohort/date representation if used as if complete. Any readiness matrix must not silently use that slice as full archive coverage.
- Look-ahead: outcome function correctly filters history to bars strictly after `scanDate`; scan-time snapshot remains separate from future outcomes.
- Data snooping / Factor Zoo: no new parameter, window, label or experiment was introduced.
- Market-source bias: finite-value runtime coverage must eventually be split/checkable by source/market if missingness is material; source code alone cannot prove equal TWSE/TPEx row coverage.
- Redundancy: R07/R08 continue to share the same residual-RS and relative-volume inputs and are not independent confirmations.
- Date clustering/overfit: current prospective evidence remains far below independent-date maturity; no directionality claimed.
- Transaction cost: no alpha/effect estimate was made, so existing 30/60/100 bps stress remains untouched.

### Engineering classification / impact
- Class A documentation/readiness audit only. No runtime code, schema, endpoint, deployment, branch, factor, threshold, rank, signal, capital, push or Formal Core behavior changed.
- Existing serializer is adequate for many readiness fields but not for a complete per-date/per-cohort matrix because `recentOutcomes` is last-80 and regime is separate. A matrix built from full D1 rows + research-day regime can remain research-only if implemented in a completely isolated module/read path; modifying shared endpoint/runtime wiring may become Class B and requires proposal-first review.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main; re-check checkpoint blob SHA immediately before write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from trusted Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Otherwise continue B-53 readiness by locating the exact route that returns `readShadowCounterfactualResearch()` and determine whether a trusted authorized runtime read can expose `recentOutcomes` now. If yes, count only finite-value/explicit statuses and label the last-80 limitation; do not treat it as complete archive coverage.
4. In parallel, inspect whether an existing research-only function already joins `trade_research_shadow_candidates` / counterfactual outcomes with `trade_research_days.market_json.regime`. If no such isolated join exists, design the smallest **Class A isolated observational readiness module** that reads existing tables without schema changes and returns per-date/per-cohort field availability; do not wire/deploy if that requires shared runtime/API changes.
5. Any readiness module must report AVAILABLE / OUTCOME_NOT_MATURE / FIELD_UNKNOWN_OR_MISSING / PROVENANCE_BLOCKED and preserve separate cohorts. It must not calculate directional alpha until frozen maturity gates are met.
6. Preserve Fundamental Persistence as UNKNOWN/context-only. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`; do not repeat byte-transport discovery or implement the B-49 Class B workflow proposal without approval.
7. Do not revisit 09/18 execution or infer 09/22 Shadow without new trusted evidence. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
