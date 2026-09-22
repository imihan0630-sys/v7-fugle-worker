# Research Checkpoint

Checkpoint sequence: A-14 after main `2f10777684755fcd4406a56b5bd33921723f71e1`.

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

## Retained research findings
- R06 exact thresholds are repository constructs, not literature-validated cutoffs; no outcome-driven retuning.
- Fugle `avgPrice` is cumulative day-to-observation average, not interval VWAP.
- `frame.latest.time` is candle bar-start; `barEndAt` is locally derived theoretical end; source publication time remains UNKNOWN.
- Reduced quote object discards raw Fugle `lastTrade.time`/`total.time`; shared quote plumbing change would be Class B.
- R03 sector persistence, R04 Residual RS and R07/R08 Attention are related momentum layers, not independent votes. Breakout quality already embeds volume, creating explicit redundancy risk.
- BUY-observed vs no-BUY balance covariates are already present in prospective Shadow; do not add fields merely for balance analysis. Individual BUY identity remains NOT_JOINABLE from safe durable evidence.
- REDUCE signal is recommendation, not execution. `REDUCED_CONFIRMED` requires trusted timestamped actual-share evidence and remains UNKNOWN.

## Retained B-13 finding — Shadow parse/history/outcome ambiguity
- `readShadowCounterfactualResearch()` reads raw `snapshot_json` and silently neutralizes malformed snapshot JSON to `{}`.
- Shadow history loading silently converts malformed `v7_history_cache.history_json` to `[]`; missing history rows also reach outcome enrichment as `[]`.
- `researchShadowOutcomeForRow()` needs `snapshot.price.close` as baseline. Missing/malformed snapshot or missing/malformed history therefore leaves horizons null without proving whether the horizon is merely immature.
- `archivedRows == outcomeRows` does not prove usable outcome coverage.
- Actual prospective corruption occurrence remains **UNKNOWN**. This is an observability blind spot, not evidence that corruption has occurred.
- Smallest safe fix remains isolated Class A research diagnostics at the Shadow reader boundary; shared/formal history plumbing must not be changed.

## NEW A-14 — isolated engineering start (2026-09-22 17:43 Taipei)
### Actions completed
- Re-read latest governance, worklist, checkpoint and latest main commit before engineering.
- Verified latest main commit was `2f10777684755fcd4406a56b5bd33921723f71e1`, whose only changed file was the B-13 checkpoint.
- Created rollback/test isolation branch `research/b13-shadow-provenance` from exact main commit `2f10777684755fcd4406a56b5bd33921723f71e1`.
- Re-read the exact branch implementation of `readShadowCounterfactualResearch()` and reconfirmed the B-13 failure semantics before touching code.
- Inspected repository test inventory. Existing tests are available, but no dedicated B-13 provenance test exists yet.

### Safety / classification
- Planned change remains Class A only if confined to research Shadow diagnostics and leaves existing outcome calculations plus `coverage.dN` semantics unchanged.
- Protected formal outputs: candidate eligibility/order, selected symbols, 3+3 quotas, plan prices/risk rules, capital, monitoring plan, signal/push behavior, bindings/Cron/external targets.
- No runtime, schema, formal selection, ranking, notification, trading, R01-R08 or I01-I07 change was made in this cycle.
- No production deployment was attempted. Creating the branch alone is not deployment evidence.

### Interruption / blocker this cycle
- The connected GitHub contents writer replaces whole files rather than applying a line patch. `research/counterfactual_v8_7_4.js` is large enough that the fetched response is truncated when read wholesale; editing from a partial copy would risk deleting unrelated research code.
- Therefore implementation was deliberately **not** written from an incomplete file image. This is a tooling/edit-safety blocker, not a strategy or permission blocker.
- The branch is the durable rollback/test point. No owner action is required yet; another connected editing path or a safely reconstructable full file is needed before code modification.

### Bias / UNKNOWN checks
- No missing value was coerced to BAD/0.
- No outcome was inspected to tune a factor, threshold, window or diagnostic definition.
- No new experiment was added; this remains data-quality provenance engineering.
- Actual malformed snapshot/history incidence remains UNKNOWN until the diagnostic is implemented and observed prospectively.

## Exact next continuation point
1. Re-read latest governance/worklist/checkpoint and latest main research commit; immediately re-check checkpoint SHA before any write.
2. Continue from branch `research/b13-shadow-provenance`; do **not** recreate the branch or repeat B-13 tracing.
3. Obtain a safe complete editable representation of `research/counterfactual_v8_7_4.js` (or use an available patch-capable connected tool). Do not overwrite the file from truncated content.
4. Implement only the isolated B-13 provenance diagnostics in `readShadowCounterfactualResearch()`: snapshot parse status, baseline-close status, history-row/history-parse/history-empty status, and horizon maturity status. Preserve existing outcome calculations and `coverage.dN` semantics.
5. Add targeted tests for malformed snapshot + valid history; valid snapshot + malformed history; missing history row; valid snapshot/history but immature D1; mature D1. Verify missing remains UNKNOWN/null and old coverage values remain backward-compatible.
6. Run existing regression/invariant suite and compare protected formal outputs. If isolation cannot guarantee invariants, stop as Class B and request owner decision.
7. Only after tests pass may Class A be merged/deployed through the existing authorized path; then verify workflow, Production readback/health and research endpoint. Never infer deployment from commit alone.
8. After observability exists, inspect real prospective counts. Until then corruption incidence and execution-shadow D1 persistence remain UNKNOWN.
9. Do not repeat the one-date maturity audit unless a durable artifact shows a new prospective Shadow date or mature horizon.
10. Formal Core remains LOCKED. No Class B/C production change without explicit owner decision.
