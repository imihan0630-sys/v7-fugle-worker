# Research Checkpoint

Checkpoint sequence: B-69.
Updated: 2026-09-23 20:11 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified production/research infrastructure baseline: V8.8.2 `8.8.2-zero-selection-push-guard`, schema `execution-shadow-v2`; pre-change backup V8.8.1.
- Last verified prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 scheduled health positively verified selectedCount=0, planCount=0, signalCount=0; preserve as formal zero-pick date, not Execution Alpha failure. `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.
- No newer trusted Production plan readback was available in B-69; live plan status remains UNKNOWN rather than assumed zero.
- Formal selection, A/B qualification, BUY/ADD/REDUCE/SELL/STOP, capital allocation and research definitions remain unchanged.

## Primary research lane retained
Root funnel: `universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
- 2026-09-16: 1,873 scanned -> 3 selected.
- 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 liquidity rejects, 335 no A/B formation, 71 RR<2.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; evidence-coverage gap, not proof gate is wrong.
- `v8_trade_journal_signals` establishes formal signal observations when durably readable, not brokerage fills. Confirmed fills remain UNKNOWN absent trusted reconciliation.
- 09/17 selected pair 4763/1301 through 09/22: endpoint about +0.37%, average MFE +7.55%, MAE -0.57%; near-miss 12 endpoint about -0.77%, MFE +1.12%, MAE -1.46%. One independent date only; no filter change.
- 8046 restoration and `HUMAN_MOMENTUM_SHADOW` remain research-only; keep execution-alpha separate from near-miss selection rescue.

## Provenance/readiness lane retained through B-61
- Counterfactual legacy null horizons can conflate malformed/missing provenance with immature outcomes; legacy `coverage.dN` cannot explain cause.
- `research/b13-shadow-provenance` remains isolated/not deployed. Exact-path fixture remains `LOCAL_RECONSTRUCTED_ASSERTION_PASS / EXACT_SOURCE_NOT_RUN`; CI NOT_RUN. Do not repeat transport discovery without new capability/approval.
- Price Path uses only frozen R01 `priorHigh20` + future 3-close hold/fail; R05 next-day Overnight/Intraday; R07/R08 same-date medians of `residualSectorRs20` and `volumeTodayVsPrev5`. No new thresholds/windows/composite scores.
- `readShadowCounterfactualResearch()` reads up to 5000 Shadow rows but returns only last 80 row-level `recentOutcomes`; do not treat 80 as full archive.
- Existing aggregate diagnostics are maturity/effect-conditioned and cannot be reused as field-readiness denominators.
- Regime is a separate `trade_research_days.market_json` path; shared-runtime join is Class B proposal-first.
- Authenticated dashboard route is source-proven GET `/api/research/dashboard?days=...`; runtime finite-value coverage remains UNKNOWN without authorized readback.
- `.github/workflows/v7-cloudflare.yml` includes `research/**` in production deploy triggers; branch-only research helper remains safest until deployment neutrality is proven.
- Branch `research/b57-price-path-readiness`; matrix unit `INDEPENDENT_SCAN_DATE_X_COHORT`; B-58/B-59/B-60 semantics frozen; B-61 trusted-execution contract unmet. Tests remain `SOURCE_WRITTEN_NOT_EXECUTED`.

## B-62 — liquidity-reject/control coverage isolation audit retained
- Current Shadow conditions on surviving base/liquidity; it cannot falsify the largest observed liquidity reject gate.
- A prospective reason-preserving `PRE_BASE_LIQUIDITY_CONTROL` requires capture inside shared formal scan plus durable storage, so implementation is **Class B proposal-only**. Do not overload frozen `REJECTED_AFTER_BASE`.
- Any future approved capture must be prospective only, preserve exact rejection reason/UNKNOWN, stay outside formal ranking/trading/push, and reconcile same-date counts against formal exclusion aggregates.

## B-63 through B-68 — BROAD_CONTROL audit retained
- BROAD_CONTROL is a reproducible pool-stratified eligible-survivor control, not a full-universe random control: deterministic `researchStableHash(scanDate + "|" + symbol)`, max 6 GENERAL + 6 THOUSAND after earlier cohorts and eligibility gates.
- R02 same-date pairing reduces row-count dominance but does not establish representative control composition.
- Durable Shadow has pool and scan-time industry (`snapshot.sector.name`), but no source-proven immutable per-symbol TWSE/TPEx venue. Existing venue composition remains UNKNOWN; do not infer from current metadata/symbol.
- Branch `research/b67-broad-control-concentration` remains isolated/not deployed. Frozen outputs: controls/date, cross-date recurrence, stored-industry coverage/concentration, pool x industry; eligible denominator and venue coverage UNKNOWN.
- B-68 hardened duplicate `scan_date+symbol` semantics: ambiguous duplicate keys are data-quality anomalies and excluded from effective concentration denominators; recurrence counts a symbol at most once/date. Branch head `88fcd9cf4e407ded46daf5b00cdfa44ea811f18d`.
- No return/alpha threshold, sampler/seed/cap change, or concentration pass/fail rule. Exact branch execution remains `SOURCE_WRITTEN_NOT_EXECUTED`; deployment NONE.

## NEW B-69 — pre-maturity negative-evidence / falsifier audit
### Registry audit result
Audited the frozen R01-R08 definitions specifically for falsifiers that can be evaluated **before mature future-return outcomes exist**, without inventing a new experiment, threshold, or window.

- **R01 Successful vs False Breakout:** directional falsifier requires D5/D10/MFE/MAE after the frozen 3-close classification, so it is **OUTCOME_DEPENDENT**. Pre-maturity work is limited to provenance/readiness of `priorHigh20` and future-close maturity; absence of mature outcomes is not evidence for/against the hypothesis.
- **R02 Selection vs Execution Alpha:** Selection Alpha falsifier is **OUTCOME_DEPENDENT**. Execution Alpha itself does not require D5/D10 returns, but it requires a real first formal BUY observation/price relative to scan close. A zero-pick/no-BUY date must remain **NOT_OBSERVED**, never 0% execution alpha. Signal observation is not brokerage fill.
- **R03 Industry Rotation/Persistence:** the structural parts **are PRE-MATURITY_EVALUABLE**: adjacent formal-research-date Top5 overlap, longest Top5 streak, and regime transition count can be measured from prospective sequences without future stock returns. However the actual falsifier “persistence adds no future-path increment / is fully explained by Residual RS” remains **OUTCOME_DEPENDENT**. Structural instability/insufficient sequence is negative evidence about readiness, not alpha direction.
- **R04 Residual RS:** HIGH/LOW directional falsifier and OOS/regime/year consistency are **OUTCOME_DEPENDENT**. Factor redundancy can be audited descriptively from scan-time snapshots, but correlation/redundancy alone cannot falsify future-return alpha without mature outcomes.
- **R05 Overnight vs Intraday:** decomposition needs the next trading day's open/close; therefore **D1_PATH_DEPENDENT** even though it is not a D5/D10 return test. Until next-day path matures, no directional inference.
- **R06 Market Regime Transition:** transition count and transition-definition stability are **PRE-MATURITY_EVALUABLE** from prospective `trade_research_days.market_json.regime`. The falsifier concerning Shadow/Selected future paths under transitions remains **OUTCOME_DEPENDENT**. Sparse/unstable transition sequence can block interpretation but cannot be converted into BAD/0.
- **R07 Quiet vs Attention Strength:** the same-date median classification/readiness is pre-outcome observable, but the registered falsifier “Quiet Strength does not outperform Attention Strength / only a few dates drive it” is **OUTCOME_DEPENDENT**.
- **R08 Two-Engine Momentum:** classification and regime distribution are pre-outcome observable; the registered path-difference, date/regime concentration, and “fully explained by existing factors” falsifiers require mature D5/D10/D20/MFE/MAE and are **OUTCOME_DEPENDENT**.

### Negative-evidence interpretation
- The only clean non-return falsification/readiness lane now available from the existing registry is **sequence structure**, chiefly R03/R06: date coverage, Top5 persistence/overlap availability, regime-transition availability/stability, and UNKNOWN provenance.
- This is a readiness/falsification-of-measurability audit, **not evidence that R03/R06 alpha is good or bad**.
- R02 Execution Alpha may become evaluable earlier than D5 research if a trusted first formal BUY is observed, but no-BUY remains missing observation rather than zero.
- No new falsifier was invented. The registry wording remains authoritative; B-69 only classifies which existing falsifiers need future outcomes.

### Bias / governance audit
- Selection bias: unchanged; no cohort resampling or new control.
- Look-ahead: pre-maturity structural checks may use only prospective formal research dates and scan-time regime/Top5 data; reconstructed/current metadata cannot backfill missing dates.
- Data snooping / Factor Zoo / overfit: no factor, window, threshold, split, experiment ID, or scoring rule added.
- Coverage / zero-pick: sparse sequence or zero-pick dates are retained as evidence about coverage/readiness, not dropped to improve results.
- Transaction cost: not applicable to the structural readiness audit; remains mandatory once return/Execution Alpha interpretation resumes.
- Date clustering: independent formal research date remains the unit; same-day stocks cannot inflate sequence evidence.

### Engineering status
- Documentation/checkpoint audit only. No Worker, schema, branch helper, workflow, Formal Core, monitoring or push change.
- R01-R08/I01-I07 unchanged; no R09/I08. Deployment NONE.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Keep B-62 liquidity-control implementation proposal-only unless owner explicitly approves the Class B shared-runtime/storage change.
4. Do not repeat listing-venue discovery; existing Shadow TWSE/TPEx coverage remains UNKNOWN unless a genuinely new immutable source appears.
5. B-67/B-68 diagnostic semantics are frozen. Apply only if trusted persisted BROAD_CONTROL rows become readable; duplicate keys are data-quality warnings, not alpha evidence.
6. Continue Negative Evidence/Falsification from B-69 by source-auditing the existing R03/R06 prospective sequence implementation/data path: determine exactly what Top5/regime sequence fields are persisted, whether independent formal research dates include zero-pick dates, and whether missing dates/UNKNOWN are preserved rather than silently skipped. Do **not** calculate alpha or invent stability thresholds.
7. If R03/R06 sequence source is sufficient, define only a descriptive readiness table (available dates, UNKNOWN dates, adjacent-pair availability, observed transition count, Top5-overlap computability). If implementation would touch shared runtime/storage, classify Class B proposal-first; prefer an offline supplied-row Class A helper if needed.
8. Keep diagnostic branches branch-only; do not wire to main/runtime until deployment neutrality is proven. Existing tests remain `SOURCE_WRITTEN_NOT_EXECUTED` until exact branch source is actually run.
9. Provenance exact-path remains `EXACT_SOURCE_NOT_RUN`. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
