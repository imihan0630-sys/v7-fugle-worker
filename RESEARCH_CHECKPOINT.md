# Research Checkpoint

Checkpoint sequence: B-16 after main `948a187925c5e525991e309f9e4577d2734af67b`.

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

## Retained research findings
- R06 exact thresholds are repository constructs, not literature-validated cutoffs; no outcome-driven retuning.
- Fugle `avgPrice` is cumulative day-to-observation average, not interval VWAP.
- `frame.latest.time` is candle bar-start; `barEndAt` is locally derived theoretical end; source publication time remains UNKNOWN.
- Reduced quote object discards raw Fugle `lastTrade.time`/`total.time`; shared quote plumbing change would be Class B.
- R03 sector persistence, R04 Residual RS and R07/R08 Attention are related momentum layers, not independent votes. Breakout quality already embeds volume, creating explicit redundancy risk.
- BUY-observed vs no-BUY balance covariates already exist in prospective Shadow; individual BUY identity remains NOT_JOINABLE from safe durable evidence.
- REDUCE signal is recommendation, not execution; `REDUCED_CONFIRMED` remains UNKNOWN without trusted timestamped actual-share evidence.

## Retained B-13 / A-14 finding
- `readShadowCounterfactualResearch()` silently neutralizes malformed `snapshot_json` to `{}`.
- Malformed `v7_history_cache.history_json` becomes `[]`; missing history rows also reach outcome enrichment as `[]`.
- `researchShadowOutcomeForRow()` needs `snapshot.price.close`; missing/malformed snapshot or history can therefore leave horizons null without distinguishing corruption from immaturity.
- Actual prospective corruption occurrence remains **UNKNOWN**. This is an observability blind spot, not evidence corruption occurred.
- Isolation branch `research/b13-shadow-provenance` exists from rollback point `2f10777684755fcd4406a56b5bd33921723f71e1`.
- Planned diagnostics are Class A only while confined to research Shadow diagnostics with outcome calculations and legacy `coverage.dN` semantics unchanged.

## NEW B-16 — complete safe source reconstruction achieved (2026-09-22 Taipei)
### Actions completed
- Re-read latest governance, worklist and canonical checkpoint before continuing; re-read checkpoint SHA immediately before this write.
- Continued existing `research/b13-shadow-provenance`; did not recreate it and did not repeat B-13 tracing.
- Split the previously truncating head into line ranges 1-120 and 121-249, and reused the already-safe 250-499 tail. All three reads returned the same branch blob SHA `efb93275d585b021ac8c7fa5ba3c2d039449105a`.
- The ranges are contiguous with no gap/overlap (1-120, 121-249, 250-end), so the complete source image is now safely reconstructable for a whole-file branch update.
- Reconfirmed the exact reader boundary and legacy behavior from the reconstructed source: malformed snapshot -> `{}`; malformed history -> `[]`; absent history -> fallback `[]`; `coverage.dN` counts finite `returnPct` only.

### Engineering status
- No source modification yet in this cycle: the previous edit-safety blocker is now removed, but implementation/tests remain unfinished.
- Next code change remains isolated Class A: add provenance diagnostics only; preserve every existing outcome calculation and legacy coverage value.
- No production deployment attempted; no formal behavior changed.

### Bias / falsification / UNKNOWN checks
- No outcome values were inspected and no factor/threshold/window/experiment/classification was tuned.
- Missing evidence was not coerced to BAD/0.
- Actual malformed snapshot/history incidence remains UNKNOWN until diagnostics are deployed and prospective rows are observed.
- Selection-bias, look-ahead, market-source, Factor-Zoo, transaction-cost, date-cluster and redundancy conclusions are unchanged.
- Execution-shadow D1 persistence remains UNKNOWN.

## Exact next continuation point
1. Re-read latest governance/worklist/checkpoint and latest main research commit; re-check checkpoint SHA before any write.
2. Continue on `research/b13-shadow-provenance`; do not repeat source reconstruction unless branch blob SHA changed from `efb93275d585b021ac8c7fa5ba3c2d039449105a`.
3. Using the now-complete reconstructed source, implement only isolated provenance diagnostics in `readShadowCounterfactualResearch()`: snapshot parse status, baseline-close status, history-row/history-parse/history-empty status, and horizon maturity status. Preserve `researchShadowOutcomeForRow()` calculations and legacy `coverage.dN` exactly.
4. Add targeted tests for malformed snapshot + valid history; valid snapshot + malformed history; missing history row; valid snapshot/history but immature D1; mature D1. Missing remains UNKNOWN/null.
5. Run existing regression/invariant suite and compare protected formal outputs. If isolation cannot guarantee invariants, stop as Class B and request owner decision.
6. Only after tests pass may Class A be merged/deployed through the existing authorized path; verify workflow plus Production readback/health/research endpoint. Commit alone is never deployment evidence.
7. After observability exists, inspect real prospective counts. Until then corruption incidence and execution-shadow D1 persistence remain UNKNOWN.
8. Do not repeat one-date maturity audit unless a durable artifact shows a new prospective Shadow date or mature horizon.
9. Formal Core remains LOCKED. No Class B/C production change without explicit owner decision.
