# Research Checkpoint

Checkpoint sequence: A-8 after main `e7b58dff48d77c913e9104822bad0deec0876d5a`.

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

## B-7 — BUY-observed vs no-BUY covariate-balance feasibility audit (2026-09-22)
- `researchExecutionAlphaFromRows()` currently joins plans to first BUY signals by `(plan_scan_date, symbol)`, but the current execution-alpha projection discards most PIT covariates.
- Shadow preserves full `snapshot`, `pool`, cohort and selected identity, so a descriptive balance table is conceptually joinable only when individual BUY identity is available in the same authorized research execution.
- Aggregate `selectedPlans=4`, `buyTriggeredPlans=1` is insufficient to infer the three no-BUY identities or attributes.
- BUY-observed is execution-selected, not randomized. Raw outcome differences mix execution with selection/confounding; same-date clustering remains mandatory.

## NEW A-8 — exact PIT covariate field audit (2026-09-22 14:43 Taipei)
### Pre-registered balance fields
The existing prospective Shadow schema already captures the requested covariates at selection time; no new field is justified yet:
- **price — AVAILABLE_PIT:** `snapshot.price.close`.
- **liquidity — AVAILABLE_PIT:** `snapshot.volume.avgVolume20Lots` and `snapshot.volume.avgAmount20`; both are selection-time research snapshot fields. Do not choose whichever looks better after outcomes; a future report must pre-specify one primary liquidity scale or report both descriptively without winner-picking.
- **strategy A/B — AVAILABLE_PIT:** `snapshot.strategy` stores `A拉回承接` / `B突破後承接` when the formal candidate carries channel A/B. For SELECTED rows this is the formal selected strategy identity.
- **pool — AVAILABLE_PIT:** Shadow row column `pool` is deterministically captured as `GENERAL` or `THOUSAND` from selection-time close and the frozen thousand-stock boundary.
- **sector — AVAILABLE_PIT:** `snapshot.sector.name`.
- **Residual RS — AVAILABLE_PIT:** `snapshot.price.residualSectorRs20` (also mirrored as `snapshot.sector.residualRs20`). Use one canonical path only to avoid duplicate-vote/redundancy mistakes.
- **volatility — AVAILABLE_PIT:** `snapshot.price.volatility20`.

### Provenance / joinability boundary
- `buildResearchSnapshot()` marks research-only / decisionImpact=false and prospective provenance; V8.7.1 reconstructs price features only from bars through `scanDate`, while prospective Shadow explicitly adds `capturedAtSelection:true`, `shadowOnly:true`, `noForwardFill:true`.
- Shadow storage persists `pool` separately plus full `snapshot_json`; SELECTED rows are included in the archive before other cohorts.
- Therefore **covariate availability is no longer the blocker**. The remaining blocker is identity/read coverage: individual BUY-observed identities are not safely available from current public/durable aggregate evidence, and execution-shadow D1 storage coverage remains UNKNOWN.
- Formal-plan normalized objects also preserve `researchSnapshot`, but changing shared plan/runtime plumbing merely to expose these fields would be Class B and is not justified while the isolated Shadow copy already contains them.

### Bias / redundancy checks
- Price, pool and liquidity are mechanically related; THOUSAND pool is defined from price. They must not be interpreted as independent causal controls.
- `residualSectorRs20` appears in two snapshot paths but is the same construct, not two variables.
- Strategy A/B is selected by formal setup rules and can be strongly confounded with volatility/attention/path shape. Balance diagnostics are descriptive only.
- UNKNOWN stays UNKNOWN for any malformed/missing snapshot field; no later market data may backfill a selection-time covariate.
- One prospective scan date remains insufficient for inference; no outcome direction is evaluated in this audit.

### Engineering classification / status
- Class A source/documentation audit only. No executable code, schema, runtime, deployment, factor, threshold, window or experiment changed.
- No tests/deployment required because executable code is unchanged; Formal Core invariants unchanged by construction.
- R01-R08 / I01-I07 unchanged; no R09/I08.

## Conditional R03/R04/R07/R08 diagnostic design — design only
When mature, condition existing frozen outcomes as:
1. sector-persistence state x Residual-RS HIGH/LOW;
2. Quiet vs Attention within sector-persistence state;
3. Attention vs existing breakout-quality/volume component for incremental information;
4. scan-date clustered leave-one-date-out robustness.
Sparse cells remain UNKNOWN/ACCUMULATING. Do not pool merely for significance.

## Exact next continuation point
1. Re-read latest governance/worklist/checkpoint and latest main commit; re-check checkpoint SHA immediately before any write.
2. Treat the seven balance dimensions above as frozen descriptive diagnostics; do not add new covariates or tune definitions after seeing outcomes.
3. Establish execution-shadow recorder storage/read coverage through an existing safe/authorized path before building any BUY-observed identity report. If individual BUY identities remain unavailable, keep the report NOT_JOINABLE/UNKNOWN rather than modifying shared plumbing.
4. Once individual BUY identity and SELECTED Shadow rows are safely readable for multiple prospective scan dates, specify a scan-date-clustered balance report. Pre-specify primary liquidity representation and canonical Residual-RS path before computing group differences.
5. Continue prospective SELECTED -> BUY-observed vs no-BUY outcome interpretation only after D1/D3/D5/D10/D20 mature; positive daily return is never proof of executability.
6. Keep REDUCED_CONFIRMED UNKNOWN until trusted actual-share observations exist; future append-only confirmation recorder remains design only.
7. Keep joint sector-persistence diagnostic as design until maturity/governance gates are satisfied.
8. Formal Core remains LOCKED. No Class B/C production change without explicit owner decision.
