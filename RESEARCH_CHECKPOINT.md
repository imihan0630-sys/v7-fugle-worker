# Research Checkpoint

Checkpoint sequence: B-13 after main `0b5211ccca3c744f4b1bebcd536d67dd2e5a94bd`.

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

## A-12 — malformed snapshot / outcome-enrichment observability audit retained
- Readiness sees finite derived outcome/covariate counts, not parse/enrichment provenance.
- Valid missing PIT covariates, malformed snapshot JSON and failed/unavailable outcome enrichment can collapse to similar lower usable counts.
- Do not convert missing covariates/outcomes to zero/BAD and do not infer strategy weakness from reduced eligible counts until provenance is known.

## NEW B-13 — exact Shadow parse -> history -> outcome failure semantics trace (2026-09-22)
### Exact path confirmed
- `readShadowCounterfactualResearch()` reads `trade_research_shadow_candidates` including raw `snapshot_json`.
- Snapshot parsing is explicitly fail-open: `let snapshot={}; try { snapshot=JSON.parse(row.snapshot_json||"{}") } catch(_) {}`. Therefore malformed `snapshot_json` is **silently neutralized to `{}`**, not surfaced, not counted and not marked DATA_QUALITY_BLOCKED.
- It then loads `v7_history_cache.history_json` by archived symbol. History parsing is also fail-open: parse failure becomes `histories[symbol]=[]`. A symbol with no returned history row is also passed to outcome enrichment as `[]`.
- `researchShadowOutcomeForRow(row,bars)` uses `snapshot.price.close` as baseline. With malformed/empty snapshot, baseline becomes null; all horizon metrics stay null even if valid future bars exist.
- With valid snapshot but missing/unparseable history, `post=[]`; all D1/D3/D5/D10/D20 horizons remain null. This is observationally identical to a genuinely immature horizon at the current readiness layer unless separate provenance is recorded.
- The outcome function itself does not throw for these cases and returns an outcome row with null horizons; `outcomeRows` therefore counts attempted rows, not successful enrichment rows.

### Important distinction from the formal history reader
- `readHistoryCache()` elsewhere in the formal worker also skips malformed per-symbol history JSON, but B-13 does **not** propose changing that shared/formal path. The ambiguity being addressed here is specifically the research-only Shadow reader inside `readShadowCounterfactualResearch()`.
- Therefore the smallest safe fix can remain isolated at the research boundary; touching shared history/cache plumbing would be unnecessary Class B risk.

### Falsification / bias implications
- `archivedRows == outcomeRows` does not prove usable outcome coverage; rows can survive with null baseline/horizons.
- Low D5 coverage cannot be attributed solely to calendar immaturity. It can also reflect malformed snapshot JSON, malformed/missing history cache, or valid snapshot with missing baseline.
- Treating these silent failures as ordinary WAITING_DATA risks coverage bias: affected symbols/cohorts could disappear selectively from R01-R08 usable samples.
- No evidence currently shows that such corruption has actually occurred in prospective rows; occurrence rate remains **UNKNOWN**. This trace proves an observability blind spot, not a present corruption incident.

### Smallest isolated Class A diagnostic design (DESIGN ONLY; not yet deployed)
At `readShadowCounterfactualResearch()` only, preserve existing outcome calculations and add research-only diagnostic counters/status; do not alter stored rows, formal selection, history cache, ranking, push or trading:
1. Parse each `snapshot_json` with explicit status: `SNAPSHOT_PARSE_OK` / `SNAPSHOT_PARSE_ERROR`; parse error remains UNKNOWN data, never `{}` interpreted as valid.
2. For successfully parsed snapshots, record `BASELINE_CLOSE_OK` vs `BASELINE_CLOSE_MISSING` using the existing `snapshot.price.close` requirement.
3. For each archived symbol distinguish `HISTORY_ROW_MISSING`, `HISTORY_PARSE_ERROR`, `HISTORY_EMPTY`, `HISTORY_OK` before calling outcome enrichment.
4. After `researchShadowOutcomeForRow`, count horizon status separately: `D1_NOT_YET_MATURE` only when history is valid and fewer than one post-scan trading bars exist; analogous maturity counts may be summarized for D3/D5/D10/D20 without inventing outcomes.
5. Expose aggregate counts plus optional recent row statuses only through the existing research dashboard/API. No schema migration is required for the first diagnostic version.
6. Keep existing `coverage.dN` definition unchanged for comparability; add provenance diagnostics beside it rather than silently redefining historical metrics.

### Engineering classification / status
- Trace and diagnostic design are Class A research-only.
- No code/runtime/schema/deployment change made in B-13 because main pushes to `research/**` or patch scripts trigger the production deployment workflow. Governance requires targeted + regression/invariant tests before deployment; committing an untested implementation directly to main would invert that order.
- Formal Core unchanged; R01-R08/I01-I07 unchanged; no new factor, threshold, window or experiment.

## Conditional R03/R04/R07/R08 diagnostic design — design only
When mature: sector-persistence x Residual-RS; Quiet vs Attention within persistence state; Attention vs existing breakout-quality/volume component; scan-date clustered leave-one-date-out. Sparse cells remain UNKNOWN/ACCUMULATING.

## Exact next continuation point
1. Re-read latest governance/worklist/checkpoint and latest main research commit; re-check checkpoint SHA immediately before any write.
2. Implement the B-13 diagnostic only on a non-production branch/PR or equivalent testable isolation first: explicit snapshot parse, baseline, history-row/history-parse/history-empty and horizon-maturity provenance in `readShadowCounterfactualResearch()`; no schema change and no shared formal plumbing.
3. Add targeted tests covering: malformed snapshot + valid history; valid snapshot + malformed history; valid snapshot + missing history row; valid snapshot/history but immature D1; mature D1; verify missing stays UNKNOWN/null and existing `coverage.dN` values remain backward-compatible.
4. Run existing regression/invariant suite and verify protected formal outputs are byte/semantically unchanged before any deployment. If isolation cannot guarantee that, stop as Class B and request owner decision rather than merging.
5. Only after tests pass may the Class A diagnostic be merged/deployed through the existing authorized path; verify workflow, production version/readback and research endpoint. Do not claim deployment from commit alone.
6. After diagnostic observability exists, inspect real prospective counts. Until then actual malformed snapshot/history occurrence remains UNKNOWN; do not infer corruption.
7. Do not repeat the one-date maturity audit unless a safe durable artifact shows a new prospective Shadow date or mature horizon.
8. Keep execution-shadow D1 storage/read coverage UNKNOWN unless an authorized artifact explicitly returns persisted recorder rows/counts. Readiness HEALTHY/WAITING_DATA is not execution-recorder certification.
9. If individual BUY identity later becomes safely readable, use the frozen balance conventions above; do not tune covariates after outcomes.
10. Keep `REDUCED_CONFIRMED` UNKNOWN until trusted actual-share observations exist.
11. Formal Core remains LOCKED. No Class B/C production change without explicit owner decision.
