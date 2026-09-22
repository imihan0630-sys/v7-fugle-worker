# Research Checkpoint

Checkpoint sequence: B-9 after main `bd72ad25ca7c1ba921bfb224dd2c4cab79661558`.

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

## A-8 — exact PIT covariate field audit (2026-09-22 14:43 Taipei)
### Pre-registered balance fields
The existing prospective Shadow schema already captures the requested covariates at selection time; no new field is justified yet:
- **price — AVAILABLE_PIT:** `snapshot.price.close`.
- **liquidity — AVAILABLE_PIT:** `snapshot.volume.avgVolume20Lots` and `snapshot.volume.avgAmount20`.
- **strategy A/B — AVAILABLE_PIT:** `snapshot.strategy`.
- **pool — AVAILABLE_PIT:** Shadow row column `pool`.
- **sector — AVAILABLE_PIT:** `snapshot.sector.name`.
- **Residual RS — AVAILABLE_PIT:** `snapshot.price.residualSectorRs20` (also mirrored as `snapshot.sector.residualRs20`; same construct).
- **volatility — AVAILABLE_PIT:** `snapshot.price.volatility20`.

### Provenance / joinability boundary
- `buildResearchSnapshot()` marks research-only / decisionImpact=false and prospective provenance; price features are bounded through `scanDate`; prospective Shadow carries `capturedAtSelection:true`, `shadowOnly:true`, `noForwardFill:true`.
- Shadow storage persists `pool` plus full `snapshot_json`; SELECTED rows are archived.
- Covariate availability is not the blocker. Remaining blocker is individual BUY identity/read coverage and execution-shadow recorder storage coverage.
- Changing shared plan/runtime plumbing merely to expose fields would be Class B and is not justified while isolated Shadow already contains them.

### Bias / redundancy checks
- Price, pool and liquidity are mechanically related; THOUSAND pool is defined from price. Do not interpret them as independent causal controls.
- Residual RS mirrored paths are one variable, not two votes.
- Strategy A/B is selected by formal setup rules and may be confounded with volatility/attention/path shape. Balance diagnostics are descriptive only.
- Missing/malformed PIT fields remain UNKNOWN; no later data backfill.
- One prospective scan date is insufficient for inference.

## NEW B-9 — recorder safe-read boundary + balance preregistration (2026-09-22)
### Safe-read evidence
- Audited the scheduled GitHub Actions health run `35690221950` and its successful `verify` job. The workflow authenticates with the existing Actions secret and reports intraday monitor health (`monitoredCount=1`, `formal15Ready=1`, no synthetic push), but its emitted payload contains **no execution-shadow recorder write count, persisted-row identity, D1 coverage, or individual BUY journal identity**.
- Therefore a successful scheduled-health workflow is **not evidence that execution-shadow rows were persisted**. It only verifies the health checks that the workflow actually emits.
- This independently confirms the prior safe-read boundary: execution-shadow D1 storage coverage remains UNKNOWN, and BUY-observed identity remains NOT_JOINABLE from current safe durable evidence.
- Do not reinterpret cron/workflow SUCCESS, monitoredCount, formal15Ready, or a live signal as recorder persistence. That would be a provenance error and could create false coverage.

### Frozen descriptive balance choices (pre-outcome)
- Primary liquidity representation is now pre-specified as `snapshot.volume.avgAmount20` because it expresses traded-value capacity on a common monetary scale across price levels/pools. `avgVolume20Lots` remains a secondary descriptive field only; it must not be swapped in as primary after seeing outcomes.
- Canonical Residual-RS path is now pre-specified as `snapshot.price.residualSectorRs20`; the mirrored sector path is validation-only, never a second factor/vote.
- These choices are measurement conventions for a future descriptive balance report, not new factors, thresholds, experiments, scores or formal gates.

### Bias / falsification implications
- Even after identity becomes readable, BUY-observed vs no-BUY balance cannot establish causality: confirmation/zone/clock gates create endogenous selection. A balanced table would reduce one concern but would not prove Execution Alpha.
- Multiple prospective scan dates remain mandatory; same-date stocks are clustered. Sparse or missing identities stay UNKNOWN/NOT_JOINABLE.
- No historical BUY identities may be fabricated from price paths, alerts or later outcomes.

### Engineering classification / status
- Class A evidence/documentation audit only. No executable code, schema, runtime, deployment, formal output, factor, threshold, window, R09 or I08 changed.
- Formal Core unchanged by construction. No deployment required.

## Conditional R03/R04/R07/R08 diagnostic design — design only
When mature, condition existing frozen outcomes as:
1. sector-persistence state x Residual-RS HIGH/LOW;
2. Quiet vs Attention within sector-persistence state;
3. Attention vs existing breakout-quality/volume component for incremental information;
4. scan-date clustered leave-one-date-out robustness.
Sparse cells remain UNKNOWN/ACCUMULATING. Do not pool merely for significance.

## Exact next continuation point
1. Re-read latest governance/worklist/checkpoint and latest main research commit; re-check checkpoint SHA immediately before any write.
2. Keep execution-shadow D1 storage/read coverage UNKNOWN unless an existing authorized artifact explicitly returns persisted recorder rows/counts. Do not treat scheduled-health SUCCESS as storage evidence.
3. Continue from the next non-blocked research point without modifying shared plumbing: audit existing prospective Shadow maturity/coverage artifacts for additional independent scan dates and D1/D3/D5 availability. If only one scan date remains, record ACCUMULATING and do not infer direction.
4. If individual BUY identity later becomes safely readable, use the frozen balance conventions: primary liquidity=`snapshot.volume.avgAmount20`; canonical Residual RS=`snapshot.price.residualSectorRs20`; cluster by scan date. Do not add/tune covariates after outcomes.
5. Continue SELECTED -> BUY-observed vs no-BUY outcome interpretation only after outcomes mature; positive daily return is never proof of executability.
6. Keep REDUCED_CONFIRMED UNKNOWN until trusted actual-share observations exist; future append-only confirmation recorder remains design only.
7. Keep joint sector-persistence diagnostic as design until maturity/governance gates are satisfied.
8. Formal Core remains LOCKED. No Class B/C production change without explicit owner decision.
