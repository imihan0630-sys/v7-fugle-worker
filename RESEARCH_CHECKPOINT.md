# Research Checkpoint

Checkpoint sequence: B-5 after main `d9820b19896e49d9638f1a2f31489bfb81e6a8e7`.

> Continuity note: this checkpoint was compacted from blob `38cac4583003ecb837ef3a656749884d27ff188a` after re-reading it in full. The prior blob remains the durable detailed audit trail in Git history; this file is the canonical current cursor and retains the findings needed for the next A/B handoff.

## Governance / immutable boundary
- Formal Core: **LOCKED**. No A/B definitions, ranking, score, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push semantics may change autonomously.
- R01-R08 and I01-I07 remain frozen; no R09/I08.
- New evidence/factors remain research/Shadow. Class B/C production changes require explicit owner decision.
- Prospective Shadow starts 2026-09-21. No fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan date is the evidence unit. Continue checks for selection bias, look-ahead, data snooping, market-source bias, Factor Zoo, overfit, coverage/zero-pick, transaction costs, date clustering and redundancy.

## Production/research baseline retained
- Previously verified research infrastructure: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; merge `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`; V8.8.0 rollback baseline.
- Execution-shadow D1 storage coverage remains **UNKNOWN** from safe public reads. Public monitor does not persist recorder result; protected research/journal endpoints require authorization. Do not infer storage success from cron SUCCESS or a live BUY.
- Existing aggregate CI/deploy evidence: currently journaled research sample had selectedPlans=4 and buyTriggeredPlans=1 after the 2026-09-22 trigger; Shadow archive 31 rows / one prospective date and zero mature D1/D3/D5/D10/D20 outcomes at last verified read. This is not a month-long denominator.
- Formal selection funnel is independently narrow in observed historical CI evidence: 2026-09-16 selected 3/~1,873; 2026-09-17 selected 2/~1,875. On 9/17 baseEligible=513, rrEligible=9, A full setup=97, B full setup=7, final A=2/B=0. Do not treat primary exclusion counts as missed winners.

## Retained construct/provenance findings
- R06 classifier: BULL_BROAD marketReturn20>=3% & breadth>=55%; BEAR_BROAD <=-3% & breadth<=45%; INDEX_STRONG_BREADTH_WEAK return>=0 & breadth<45%; BREADTH_RECOVERY return<0 & breadth>=55%; otherwise MIXED. Literature does not validate these exact thresholds; do not retune after outcomes.
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

## NEW B-5 — exact entry-gate observability audit (2026-09-22)
Source audit of current `Worker.js` clarifies what existing journal fields can and cannot quantify without new instrumentation.

### BUY timing
- When a formal BUY is emitted, `v8_trade_journal_signals.occurred_at` can identify observed BUY timing for journaled signals.
- Current safe aggregate read exposes only counts, not individual signal rows, so exact BUY-time distribution remains **UNKNOWN** until an authorized existing read is available.

### maxChase attribution
- `buildFinalDecision` may first produce `level="buy"`, but `evaluateOperationSignals` emits BUY/ADD only when `(p.maxChase == null || currentPrice <= p.maxChase)`.
- Therefore a plan can have a technically valid final BUY setup yet emit no BUY because current price is above maxChase.
- Existing plan table stores maxChase, but absence of a BUY row alone cannot prove maxChase caused rejection; current journal does not persist a dedicated `MAX_CHASE_BLOCKED` event.
- Required interpretation: maxChase-block count is **UNKNOWN**, not zero.

### plan-expiry attribution
- `applyPlanValidity` converts a buy decision to `wait` when `plan.planDate !== taiwanDate()` for NONE/new-entry state.
- The journal plan stores planDate, but no dedicated `PLAN_EXPIRED_BUY_BLOCKED` event is guaranteed.
- A no-BUY expired plan therefore cannot be attributed to expiry merely from plan/signal tables; exact expiry-block count remains **UNKNOWN**.

### clause-failure attribution
- A/B evaluators return watch/wait/risk text in live monitor state, but the durable signal journal primarily records emitted operation signals. For no-BUY plans, durable clause-by-clause failure history is not established.
- Do not retrospectively infer zone-touch, volume, retest, maxChase or expiry failure from no-BUY status or daily OHLC.

### Bias consequence
This prevents a common selection/execution-bias error: classifying all no-BUY plans into a guessed failure bucket and then comparing outcomes as if those labels were observed. Until prospective clause-level evidence exists, only SELECTED -> BUY-observed vs SELECTED -> no-BUY-observed is reliable from the journal identity; causal gate attribution is UNKNOWN.

## NEW B-5 — REDUCE-event reconstructability audit
Current source confirms:
- `REDUCE` is emitted only for an existing position when price is at/above `reduceAt` and latest 15m bar is bearish with `volumeRatio>=1.3`.
- The emitted REDUCE signal records an intended half-position amount/shares when held shares are known.
- Signal emission itself does **not** mutate actual shares or positionStage.
- Position stages remain NONE/FIRST/FULL; there is no REDUCED/TRIMMED state.

Consequences:
- A REDUCE signal row can prove a recommendation event occurred, but **cannot prove the reduction was executed**.
- Trusted pre/post actual shares are required to index a confirmed reduction. Repository/chat-selection history is not a complete execution ledger and cannot safely reconstruct a population of confirmed REDUCE events.
- Therefore historical/prospective REDUCE forward-path analysis is split into two cohorts: `REDUCE_SIGNAL_OBSERVED` (recommendation only) and `REDUCED_CONFIRMED` (requires trusted actual-share evidence). Never promote the first to the second.
- Existing durable repository evidence is insufficient to estimate confirmed-REDUCE conversion or restoration outcomes; those remain **UNKNOWN**.

This strengthens the preregistered Shadow design: the REDUCED->RE-ADD_ELIGIBLE index time must be confirmed post-reduction shares, not the REDUCE push timestamp. Compare STAY_REDUCED vs SHADOW_RESTORE on the sold tranche with D1/D3/D5/D10/D20, MFE/MAE, costs, restoration frequency and whipsaw; reject if benefits vanish after costs, worsen drawdown, depend on one stock/ABF/date/regime, or trigger excessively in ranges. No recovery threshold is chosen now.

## Conditional R03/R04/R07/R08 diagnostic design — design only
Existing primitives are sufficient conceptually but current machine-readable outputs do not directly join each stock outcome to contemporaneous sector-persistence state.
When mature, condition existing frozen outcomes as:
1. sector-persistence state x Residual-RS HIGH/LOW;
2. Quiet vs Attention within sector-persistence state;
3. Attention vs existing breakout-quality/volume component for incremental information;
4. scan-date clustered leave-one-date-out robustness.
Sparse cells remain UNKNOWN/ACCUMULATING. Do not pool merely for significance. No implementation without the applicable governance approval.

## Engineering status
- This B-5 turn is source/documentation research only; no executable code, Formal Core, production runtime, deployment, thresholds or signals changed.
- No new factor/experiment/window created; no outcome-driven tuning.
- Positive hypothesis and reverse mechanism retained: conservative gates may reduce false entries, but their conjunction may also suppress executable winners. Current evidence cannot choose between them because no-BUY clause history and mature forward outcomes are incomplete.

## Exact next continuation point
1. Re-read latest governance/worklist/checkpoint and latest main commit; re-check checkpoint SHA immediately before any write.
2. Seek an **existing safe aggregate or authorized-without-secret-exposure read** that can reveal individual journal BUY/REDUCE rows or richer aggregates. Do not request/expose ADMIN_TOKEN merely for research convenience.
3. If individual BUY rows become safely observable, quantify BUY timing by independent plan/scan date; otherwise retain UNKNOWN and move on.
4. Continue prospective no-BUY vs BUY-observed outcome comparison only when D1/D3/D5/D10/D20 mature; do not infer executability from positive daily returns.
5. Audit existing position-confirmation/history paths for trusted pre/post actual shares around REDUCE. If absent, keep REDUCED_CONFIRMED coverage UNKNOWN and specify the minimal future Class-A-only evidence field separately from production state.
6. Keep early-window instrumentation and joint sector-persistence diagnostic as designs until recorder coverage/governance gates are satisfied.
7. Formal Core remains LOCKED. No Class B/C production change without explicit owner decision.
