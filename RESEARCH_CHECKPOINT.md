# Research Checkpoint

Checkpoint sequence: A-10 after main `bd72ad25ca7c1ba921bfb224dd2c4cab79661558`.

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

## B-9 — recorder safe-read boundary + balance preregistration (2026-09-22)
### Safe-read evidence
- Audited scheduled GitHub Actions health run `35690221950`. Its successful health payload contains no execution-shadow recorder write count, persisted-row identity, D1 coverage, or individual BUY journal identity.
- Therefore workflow SUCCESS is not recorder-persistence evidence. Execution-shadow D1 storage coverage remains UNKNOWN and BUY-observed identity remains NOT_JOINABLE from safe durable evidence.

### Frozen descriptive balance choices (pre-outcome)
- Primary liquidity=`snapshot.volume.avgAmount20`; `avgVolume20Lots` secondary only.
- Canonical Residual RS=`snapshot.price.residualSectorRs20`; mirrored sector path validation-only.
- These are measurement conventions, not factors/thresholds/experiments/formal gates.

## NEW A-10 — prospective Shadow maturity/coverage audit (2026-09-22 15:43 Taipei)
### Evidence audited
- Re-read current main governance/worklist/checkpoint and current research readiness implementation before interpreting maturity.
- Current readiness code only counts an outcome as D5-mature when `horizons.d5.returnPct` is finite, and counts independent evidence by distinct `scanDate`; R01/R04/R07 require at least 60 mature D5 samples and 15 independent scan dates, while R02/R08 require 20 paired D5 dates. These are pre-existing frozen readiness rules, not newly tuned thresholds.
- The latest durable prospective evidence remains the previously verified Shadow archive: **31 rows, one prospective scan date, zero mature D1/D3/D5/D10/D20 outcomes**. No newer safe durable artifact located in this audit establishes an additional prospective Shadow scan date or mature horizon.
- The latest scheduled health workflow is still run `35690221950` (2026-09-22 13:18 Taipei); it is a monitor-health artifact, not a Shadow maturity/coverage export. It cannot be used to manufacture a second scan date or mature D1.

### Interpretation / falsification
- Status remains **ACCUMULATING / WAITING_DATA**, not directional evidence. One scan date is one clustered evidence unit regardless of the 31 stock rows.
- Zero mature outcomes means no Selection Alpha, Execution Alpha, breakout-success, Residual-RS, Quiet/Attention or Two-Engine direction should be inferred yet.
- This is not a negative strategy result and not a zero-pick result; it is an evidence-maturity limitation.
- Do not backfill 2026-09-22 outcomes from later/current prices unless the existing prospective pipeline records them under its PIT rules. No synthetic D1/D3/D5 rows.
- Existing readiness implementation itself enforces distinct scan-date counting, which is consistent with the governance rule against treating same-day stocks as independent evidence.

### Bias / data-quality checks
- Selection bias: unchanged; Shadow cohorts are prospective, but only one date cannot establish representativeness.
- Look-ahead: no later price/outcome data were inserted.
- Data snooping / Factor Zoo: no new factor, window, threshold, R09 or I08 added.
- Market-source bias: no new source inference made.
- Date clustering: explicitly preserved; 31 rows != 31 independent dates.
- UNKNOWN semantics: no safe evidence of newer Shadow maturity was converted to zero/BAD.

### Engineering classification / status
- Class A documentation/evidence audit only. No executable code, schema, runtime, deployment or Formal Core output changed; no deployment required.
- R01-R08/I01-I07 unchanged. Formal Core remains LOCKED.

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
3. On the next run, first re-audit safe durable artifacts for a **new prospective Shadow scan date or newly matured D1/D3/D5 horizon**. If none exists, do not repeat this maturity audit; move to the next non-blocked research question and preserve ACCUMULATING/WAITING_DATA.
4. A high-value non-blocked next question is to audit whether the existing readiness/maturity machinery distinguishes `WAITING_DATA` caused by normal horizon immaturity from `DATA_QUALITY_BLOCKED` caused by missing/corrupt Shadow coverage, without changing code. If semantics are ambiguous, document the exact failure mode before proposing any Class A observability change.
5. If individual BUY identity later becomes safely readable, use frozen balance conventions: primary liquidity=`snapshot.volume.avgAmount20`; canonical Residual RS=`snapshot.price.residualSectorRs20`; cluster by scan date. Do not add/tune covariates after outcomes.
6. Keep REDUCED_CONFIRMED UNKNOWN until trusted actual-share observations exist; append-only confirmation recorder remains design only.
7. Keep joint sector-persistence diagnostic as design until maturity/governance gates are satisfied.
8. Formal Core remains LOCKED. No Class B/C production change without explicit owner decision.
