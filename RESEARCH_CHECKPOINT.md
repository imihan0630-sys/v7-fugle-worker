# Research Checkpoint

Checkpoint sequence: A-12 after main `1d5380cbb8074573767147ce4b754845d85315b0`.

> Canonical current cursor for both A/B research schedules. Prior detailed checkpoints remain durable in Git history and must not be re-run.

## Governance / immutable boundary
- Formal Core: **LOCKED**. No autonomous change to A/B definitions, ranking, score, thresholds, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push semantics.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow begins 2026-09-21. No fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.

## Production/research baseline retained
- Previously verified research infrastructure: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; merge `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`; V8.8.0 rollback baseline.
- Execution-shadow D1 storage/read coverage remains **UNKNOWN** from safe public reads. Workflow/cron success is not persistence evidence.
- Last verified prospective Shadow evidence: 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes. Do not manufacture a newer date or mature horizon from current prices.
- Formal selection funnel is narrow in retained CI evidence; exclusion counts are not missed-winner counts.

## Retained provenance / construct findings
- R06 exact thresholds are repository constructs, not literature-validated cutoffs; no outcome-driven retuning.
- Fugle `avgPrice` is cumulative day-to-observation average, not interval VWAP.
- `frame.latest.time` is candle bar-start; `barEndAt` is locally derived theoretical end; source publication time remains UNKNOWN.
- Reduced quote object discards raw Fugle `lastTrade.time`/`total.time`; shared quote plumbing change would be Class B.
- R03 sector persistence, R04 Residual RS and R07/R08 Attention are related momentum layers, not independent votes. Breakout quality already embeds volume, creating explicit redundancy risk.

## Entry / execution observability retained
- Capital funnel must remain decomposed: universe -> base/liquidity -> A/B formation -> RR/quality/risk -> SELECTED -> eligible clock -> zone touch -> confirmation -> formal BUY -> confirmed fill -> ADD/FULL -> REDUCE -> confirmed reduced state -> restoration.
- Formal A/B BUY cannot occur until about 10:45 Taipei under current 15m volume/confirmation mechanics; current execution-shadow schedule leaves much of 09:32-10:44 unobserved for plans that never signal.
- Journal `occurred_at` identifies BUY timing only when individual signal rows are safely readable. Aggregate selectedPlans/buyTriggeredPlans cannot identify no-BUY symbols.
- Absence of BUY cannot currently be attributed to maxChase, expiry, zone, volume or retest; clause-failure counts remain UNKNOWN.
- REDUCE signal is recommendation, not execution. `REDUCED_CONFIRMED` requires trusted timestamped actual-share evidence and remains UNKNOWN.

## BUY-observed vs no-BUY balance preregistration retained
Existing prospective Shadow already has the PIT covariates; do not add fields merely for balance analysis:
- price=`snapshot.price.close`
- primary liquidity=`snapshot.volume.avgAmount20`; `avgVolume20Lots` secondary
- strategy=`snapshot.strategy`
- pool=row `pool`
- sector=`snapshot.sector.name`
- canonical Residual RS=`snapshot.price.residualSectorRs20`; mirrored sector path validation-only
- volatility=`snapshot.price.volatility20`
Price/pool/liquidity are mechanically related; mirrored Residual RS is one construct. Balance is descriptive and must cluster by scan date. Individual BUY identity remains NOT_JOINABLE from safe durable evidence.

## Readiness semantics retained (B-11)
- `researchReadinessRow()` gives `DATA_QUALITY_BLOCKED` precedence when shared `dataQualityBlocked` is true; otherwise zero immature required evidence may be `WAITING_DATA`.
- Shared data-quality blocking is narrowly tied to `shadowIntegrity.status === RESEARCH_DATA_GAP`, currently covering missing Shadow archive, SELECTED-count mismatch, or missing BROAD_CONTROL for prospective formal dates.
- Therefore HEALTHY/WAITING_DATA is **not** universal data-quality certification and does not certify execution-recorder health.

## NEW A-12 — malformed snapshot / outcome-enrichment observability audit (2026-09-22 16:39 Taipei)
### What is detectable with existing diagnostics
- Outcome maturity is detected only through finite derived outcome fields. `researchReadinessEvidenceFromOutcomes()` counts D5 only when `horizons.d5.returnPct` is finite; R04/R07 additionally require finite PIT covariates. Missing covariates therefore reduce those experiment-specific usable counts, but the readiness output does not identify the cause as malformed JSON versus a legitimately absent PIT field.
- Normal horizon immaturity is represented by absent/null horizon metrics and can correctly remain WAITING_DATA when archive integrity is otherwise healthy.
- Shadow archive structural gaps already covered by `researchShadowIntegrityFromRows()` remain separately detectable as RESEARCH_DATA_GAP.

### What is not reliably distinguishable today
- A malformed `snapshot_json` row is not proven by the readiness matrix itself. Downstream code consumes parsed `snapshot`; if an upstream reader skips/neutralizes a parse failure, readiness can only observe missing usable covariates/outcomes, not the parse-failure provenance.
- A valid snapshot with one missing PIT covariate and a malformed snapshot can therefore collapse to the same downstream symptom for R04/R07: fewer eligible samples.
- Outcome-enrichment failure after an otherwise structurally complete archive can also resemble ordinary horizon immaturity because readiness observes finite outcome fields, not an explicit enrichment-attempt/result ledger.
- Consequently, `WAITING_DATA` can mean genuinely not yet mature **or** an undiagnosed enrichment/parse coverage problem unless a separate integrity signal exists. It must not be interpreted as proof that the pipeline is healthy.

### Falsification / bias implications
- Do not convert missing covariates or missing outcomes to zero/BAD to make the distinction easier.
- Do not infer strategy weakness from reduced eligible counts until parse/enrichment provenance is known.
- Do not add a new factor/experiment to solve an observability problem. This is data-quality provenance, not alpha research.
- One prospective scan date remains insufficient for inference; same-date clustering unchanged.

### Engineering classification / decision
- This audit is Class A documentation/evidence only. No runtime/schema/deployment/Formal Core change made.
- A future isolated research-only diagnostic could count `snapshotParseOk/snapshotParseError` and outcome-enrichment attempt/status without changing formal outputs, but implementation is **not yet justified** until the exact Shadow reader/enricher failure path and storage semantics are traced. Avoid instrumenting the wrong layer.
- R01-R08/I01-I07 unchanged. Formal Core remains LOCKED.

## Conditional R03/R04/R07/R08 diagnostic design — design only
When mature: sector-persistence x Residual-RS; Quiet vs Attention within persistence state; Attention vs existing breakout-quality/volume component; scan-date clustered leave-one-date-out. Sparse cells remain UNKNOWN/ACCUMULATING.

## Exact next continuation point
1. Re-read latest governance/worklist/checkpoint and latest main research commit; re-check checkpoint SHA immediately before any write.
2. Do not repeat the one-date maturity audit unless a safe durable artifact shows a new prospective Shadow date or mature horizon.
3. Trace the exact Shadow D1 read -> `snapshot_json` parse -> `researchShadowOutcomeForRow()` enrichment path and determine whether parse errors are skipped, neutralized, or surfaced; separately trace what happens when price-history bars are unavailable. Record exact failure semantics.
4. Only if that trace proves a silent ambiguity, design the smallest isolated Class A diagnostic at the research boundary (parse status + enrichment attempt/status/counts). No shared formal plumbing. Run targeted + regression/invariant tests before any deployment.
5. Keep execution-shadow D1 storage/read coverage UNKNOWN unless an authorized artifact explicitly returns persisted recorder rows/counts. Readiness HEALTHY/WAITING_DATA is not execution-recorder certification.
6. If individual BUY identity later becomes safely readable, use the frozen balance conventions above; do not tune covariates after outcomes.
7. Keep `REDUCED_CONFIRMED` UNKNOWN until trusted actual-share observations exist.
8. Formal Core remains LOCKED. No Class B/C production change without explicit owner decision.
