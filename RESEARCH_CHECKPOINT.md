# Research Checkpoint

Checkpoint sequence: B-7 after main `e7b58dff48d77c913e9104822bad0deec0876d5a`.

> Continuity note: prior detailed checkpoints remain durable in Git history. This file is the canonical current cursor for both A/B research schedules.

## Governance / immutable boundary
- Formal Core: **LOCKED**. No A/B definitions, ranking, score, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push semantics may change autonomously.
- R01-R08 and I01-I07 remain frozen; no R09/I08.
- New evidence/factors remain research/Shadow. Class B/C production changes require explicit owner decision.
- Prospective Shadow starts 2026-09-21. No fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.

## Production/research baseline retained
- Previously verified research infrastructure: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; merge `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`; V8.8.0 rollback baseline.
- Execution-shadow D1 storage coverage remains **UNKNOWN** from safe public reads. Public monitor does not persist recorder result; protected research/journal endpoints require authorization. Do not infer storage success from cron SUCCESS or a live BUY.
- Existing aggregate CI/deploy evidence: journaled research sample had selectedPlans=4 and buyTriggeredPlans=1 after the 2026-09-22 trigger; Shadow archive 31 rows / one prospective date and zero mature D1/D3/D5/D10/D20 outcomes at last verified read. This is not a month-long denominator.
- Formal selection funnel is independently narrow in observed historical CI evidence: 2026-09-16 selected 3/~1,873; 2026-09-17 selected 2/~1,875. On 9/17 baseEligible=513, rrEligible=9, A full setup=97, B full setup=7, final A=2/B=0. Do not treat primary exclusion counts as missed winners.

## Retained construct/provenance findings
- R06 exact thresholds are repository constructs, not literature-validated cutoffs; do not retune after outcomes.
- Fugle `avgPrice` is cumulative intraday/day-to-observation average, not interval VWAP.
- `frame.latest.time` is source candle bar-start time; `barEndAt` is locally derived theoretical end, not source publication time. `candlePublishedAt` remains UNKNOWN.
- Reduced quote object discards raw Fugle `lastTrade.time`/`total.time`; changing shared quote plumbing is Class B.
- R03 sector persistence, R04 Residual RS and R07/R08 Attention are related momentum layers, not independent votes. `breakoutQualityResearch` already embeds a 25% volume component, so Attention has explicit redundancy risk.

## Entry/capital funnel — durable state
Capital utilization must be decomposed as:
`universe -> base/liquidity -> A/B formation -> RR/quality/risk -> SELECTED -> eligible clock -> zone touch -> confirmation -> formal BUY -> confirmed fill -> ADD/FULL -> REDUCE -> confirmed reduced state -> restoration`.

Known mechanics:
- Formal A/B BUY cannot occur until about 10:45 Taipei because 15m `volumeRatio` needs five prior same-day bars and both A/B need a subsequent confirming/retest bar.
- Current execution-shadow schedule leaves 09:32-10:44 largely unobserved for plans that never signal. Potential FIRST_60M/FIRST_90M/ENTRY_ELIGIBILITY_BASELINE instrumentation remains deferred until recorder storage is verified.
- One-day plan validity plus maxChase and confirmation gates can compound scarcity. 3006 showed later valid confirmation is possible, so the clock gate is not by itself proof of defect.
- 3006 2026-09-16 -> 9/22 case supports researching revalidation-aware persistence, not blind multi-day carry-forward.

## Entry-gate observability retained
- Journal `occurred_at` can identify BUY timing only when individual signal rows are safely readable.
- Absence of BUY cannot be causally assigned to maxChase, expiry, zone, volume or retest because no durable clause-level rejection event is established.
- Therefore maxChase-block, expiry-block and clause-failure counts remain **UNKNOWN**, not zero.
- Reliable current identity is SELECTED -> BUY-observed vs SELECTED -> no-BUY-observed; causal gate attribution remains UNKNOWN until prospective evidence exists.

## REDUCE reconstructability retained
- REDUCE signal is a recommendation event, not proof of execution; signal emission does not mutate actual shares or positionStage.
- Position stages remain NONE/FIRST/FULL; no REDUCED/TRIMMED state.
- Keep cohorts distinct: `REDUCE_SIGNAL_OBSERVED` vs `REDUCED_CONFIRMED`. The latter requires trusted actual-share evidence.
- REDUCED->RE-ADD research must index confirmed post-reduction shares, not push time; no recovery threshold is chosen.

## A-6 — safe-read and trusted-share audit (2026-09-22 13:41 Taipei)
- No repository artifact provides a secret-free individual journal-signal export or durable public read of individual BUY/REDUCE rows. Existing protected journal/research endpoints remain the known route. Exact BUY-time distribution and individual REDUCE-signal population therefore remain UNKNOWN from safe evidence.
- Repository artifacts do not establish complete timestamped pre/post actual-share history around REDUCE events. `REDUCED_CONFIRMED` coverage remains UNKNOWN; alerts/daily OHLC cannot be converted into fills.
- Minimal future confirmed-reduction evidence, if later justified as isolated Class A: symbol, observedAt, trusted source/provenance, actually observed sharesBefore/sharesAfter, linkable reduce-signal identity, confirmationStatus CONFIRMED/UNKNOWN, and executionPrice only if trusted. No inferred fill time/price/share delta.

## NEW B-7 — BUY-observed vs no-BUY covariate-balance feasibility audit (2026-09-22)
### What existing artifacts can and cannot join
- `researchExecutionAlphaFromRows()` currently joins `v8_trade_journal_plans` to first BUY signals by `(plan_scan_date, symbol)`. The plan query exposes only `scan_date,symbol,name,formal_close,buy_low,buy_high`; it does **not** expose strategy, pool, sector, liquidity, Residual RS or volatility in this research read.
- The Shadow outcome path preserves each archive row's full `snapshot`, plus `pool` and cohort, so PIT research covariates such as sector/Residual-RS/volatility may exist there when captured at scan time. However the current execution-alpha rows discard that snapshot and retain only scanDate/symbol/name/formalClose/entryPrice/time and price-improvement metrics.
- Therefore a descriptive BUY-observed vs no-BUY balance table is **conceptually joinable** by `(scanDate,symbol)` only if both individual plan membership and BUY identity are available in the same authorized research execution. It is **not safely reconstructable from the present public/durable aggregate evidence**.
- Existing aggregate `selectedPlans=4`, `buyTriggeredPlans=1` is insufficient for covariate balance. Do not infer the three no-BUY identities or their attributes.

### Confounding / bias implication
- BUY-observed is an execution-selected subgroup, not a randomized sample. Price level, strategy A/B, pool, liquidity, sector, volatility and momentum state can all affect both trigger probability and later outcome; raw BUY-vs-no-BUY outcome differences would therefore mix execution effect with selection/confounding.
- Covariate balance is descriptive diagnostics only, not causal adjustment and not a new factor. Same-date clustering remains mandatory; one prospective scan date cannot establish balance or outcome direction.
- Missing PIT covariates remain UNKNOWN. Do not backfill sector/Residual-RS/volatility using later snapshots.
- Positive mechanism: confirmation may screen weak paths. Reverse mechanism: confirmation may preferentially chase high-attention/high-volatility names and miss quiet winners. Current evidence cannot choose between them.

### Engineering classification
- No code was changed. A future isolated research-only join/report could be Class A only if it reads existing research/journal data without changing shared schemas, runtime fetches, formal selection or signals. Adding fields to shared plan/runtime plumbing or protected production paths would be Class B and requires proposal/approval before production promotion.
- No new factor, threshold, window or experiment was created. Formal Core unchanged.

## Conditional R03/R04/R07/R08 diagnostic design — design only
When mature, condition existing frozen outcomes as:
1. sector-persistence state x Residual-RS HIGH/LOW;
2. Quiet vs Attention within sector-persistence state;
3. Attention vs existing breakout-quality/volume component for incremental information;
4. scan-date clustered leave-one-date-out robustness.
Sparse cells remain UNKNOWN/ACCUMULATING. Do not pool merely for significance.

## Engineering status
- B-7 is source/documentation research only; no executable code, production runtime, deployment, thresholds, signals or formal outputs changed.
- Classification: Class A research finding/design only. No deployment/tests required because executable code is unchanged; Formal Core invariants unchanged by construction.
- No new factor/experiment/window; R01-R08/I01-I07 unchanged.

## Exact next continuation point
1. Re-read latest governance/worklist/checkpoint and latest main commit; re-check checkpoint SHA immediately before any write.
2. Continue prospective SELECTED -> BUY-observed vs no-BUY only when D1/D3/D5/D10/D20 outcomes mature; same-date stocks remain clustered and positive daily return must never be treated as proof of executability.
3. Before any early-window/clause-level recorder or shared-plumbing change, establish execution-shadow recorder storage/read coverage through an existing safe/authorized path; otherwise retain UNKNOWN.
4. Audit the exact PIT field names in Shadow `snapshot` and formal-plan construction for the pre-registered descriptive balance set: price, liquidity, strategy A/B, pool, sector, Residual RS and volatility. Mark each field AVAILABLE_PIT / UNKNOWN / NOT_JOINABLE; do not add new fields yet.
5. If all required identities/fields become safely readable, specify (but do not outcome-tune) a scan-date-clustered balance report for BUY-observed vs no-BUY. Do not interpret outcome differences until balance/confounding is described and multiple prospective dates mature.
6. Keep REDUCED_CONFIRMED UNKNOWN until trusted actual-share observations exist; future append-only confirmation recorder remains design only.
7. Keep joint sector-persistence diagnostic as design until maturity/governance gates are satisfied.
8. Formal Core remains LOCKED. No Class B/C production change without explicit owner decision.
