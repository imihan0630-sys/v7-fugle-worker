# Research Checkpoint

Checkpoint sequence: A-6 after main `21da24fff48801a18bb46aa3636dea848e7660a6`.

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

## NEW A-6 — safe-read and trusted-share audit (2026-09-22 13:41 Taipei)
### Existing safe journal read
- Re-read latest main tree and current source paths. No repository artifact provides a secret-free individual journal-signal export or a durable public read of individual BUY/REDUCE rows.
- Existing protected journal/research endpoints remain the known route for individual rows; this turn found no alternate authorized-without-secret-exposure read.
- Consequence: exact BUY-time distribution and individual REDUCE-signal population remain **UNKNOWN** from currently safe evidence. Do not request/expose ADMIN_TOKEN merely to improve research convenience.

### Position confirmation / actual-share history
- Current architecture separates emitted operation signals from actual position confirmation. Durable source evidence retained from prior audit shows REDUCE emission does not mutate shares/stage.
- Repository artifacts do not establish a complete timestamped pre/post actual-share history around REDUCE events. Chat/recovered selections are not an execution ledger and must not be promoted into confirmed fills.
- Therefore `REDUCED_CONFIRMED` coverage remains **UNKNOWN**; no historical conversion rate or restoration outcome may be estimated.

### Minimal future evidence design — research-only specification, not implemented
If an isolated Class-A recorder becomes justified after storage/read coverage is verified, the minimum evidence for a confirmed reduction should be append-only and separate from production position state:
- `symbol`
- `observedAt`
- `source` / provenance of the trusted actual-share observation
- `sharesBefore` (only when actually observed)
- `sharesAfter` (only when actually observed)
- `linkedReduceSignalId` or stable `(planScanDate,symbol,reduceOccurredAt)` when linkable
- `confirmationStatus` = CONFIRMED / UNKNOWN; never infer CONFIRMED from a signal
- optional `executionPrice` only when supplied by trusted execution evidence; otherwise UNKNOWN
No inferred fill time, price or share delta from alerts/daily OHLC is permitted.

### Bias / falsification consequence
- This blocks hindsight labeling of recommendation events as executed trades and prevents survivorship/selection bias in restoration studies.
- Positive hypothesis remains that a symmetric restoration state may recover upside after prudent trims; reverse mechanism remains whipsaw/cost amplification. Existing evidence cannot choose between them.
- No new factor/window/threshold/experiment was created; no outcome-driven tuning and no Formal Core change.

## Conditional R03/R04/R07/R08 diagnostic design — design only
When mature, condition existing frozen outcomes as:
1. sector-persistence state x Residual-RS HIGH/LOW;
2. Quiet vs Attention within sector-persistence state;
3. Attention vs existing breakout-quality/volume component for incremental information;
4. scan-date clustered leave-one-date-out robustness.
Sparse cells remain UNKNOWN/ACCUMULATING. Do not pool merely for significance.

## Engineering status
- A-6 is source/documentation research only; no executable code, production runtime, deployment, thresholds, signals or formal outputs changed.
- Classification: Class A research finding/specification only. No branch/deployment/tests required because executable code is unchanged; Formal Core invariants unchanged by construction.
- No new factor/experiment/window; R01-R08/I01-I07 unchanged.

## Exact next continuation point
1. Re-read latest governance/worklist/checkpoint and latest main commit; re-check checkpoint SHA immediately before any write.
2. Continue the prospective SELECTED -> BUY-observed vs no-BUY comparison only when D1/D3/D5/D10/D20 outcomes mature; keep same-date stocks clustered and do not infer executability from positive daily returns.
3. Before adding any early-window or clause-level recorder, first establish execution-shadow recorder storage/read coverage through an existing safe/authorized path; if unavailable, retain UNKNOWN rather than modifying shared runtime.
4. Audit whether current Shadow/plan artifacts can support a **descriptive covariate-balance table** for BUY-observed vs no-BUY (price, liquidity, strategy A/B, pool, sector, residual-RS/volatility where PIT fields exist) without new factors. This is to detect selection/execution confounding before interpreting outcome differences.
5. Keep REDUCED_CONFIRMED coverage UNKNOWN until trusted actual-share observations exist. The minimal append-only evidence fields above are a future Class-A design only, not permission to alter production position state.
6. Keep joint sector-persistence diagnostic as design until maturity/governance gates are satisfied.
7. Formal Core remains LOCKED. No Class B/C production change without explicit owner decision.
