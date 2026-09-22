# Research Checkpoint

Checkpoint sequence: B-15 after main `948a187925c5e525991e309f9e4577d2734af67b`.

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

## Retained A-14 — isolated engineering start
- Isolation branch `research/b13-shadow-provenance` exists from exact rollback point `2f10777684755fcd4406a56b5bd33921723f71e1`.
- Planned diagnostics remain Class A only if confined to research Shadow diagnostics and existing outcome calculations plus `coverage.dN` semantics remain unchanged.
- No production deployment was attempted and no formal behavior was changed.

## NEW B-15 — safe-edit path narrowed (2026-09-22 Taipei)
### Actions completed
- Re-read latest governance, worklist, canonical checkpoint and latest main commit before continuing.
- Verified main had advanced to `948a187925c5e525991e309f9e4577d2734af67b` only to persist A-14 checkpoint state; canonical checkpoint SHA was re-read immediately before this write.
- Verified branch `research/b13-shadow-provenance` still exists; did not recreate it.
- Tested line-ranged GitHub reads against `research/counterfactual_v8_7_4.js`. The previous whole-file truncation blocker is narrower than A-14 recorded: tail range 250-499 is safely retrievable in full, including the complete `readShadowCounterfactualResearch()` implementation; broad 1-249 still truncates and therefore whole-file replacement is not yet safe.
- Reconfirmed exact reader behavior from branch code: malformed snapshot is caught to `{}`; malformed history is caught to `[]`; absent history is supplied as `[]`; legacy `coverage.dN` counts only finite returnPct horizons.

### Engineering status
- No code modification was made because the available writer still replaces the entire file and a complete byte-equivalent source image has not yet been reconstructed.
- This is still an edit-safety/tooling constraint, not a strategy decision or owner-action blocker.
- The safe route is now concrete: reconstruct the source using smaller non-truncating line ranges, verify reconstructed content/blob equivalence before replacement, then make the isolated branch-only change.

### Bias / falsification / UNKNOWN checks
- No outcome values were inspected; no factor, threshold, window, experiment or classification was tuned.
- No missing value was coerced to BAD/0.
- Actual malformed snapshot/history incidence remains UNKNOWN; the code-path ambiguity is proven, occurrence is not.
- No selection-bias, look-ahead, market-source, Factor-Zoo, transaction-cost, date-cluster or redundancy conclusion changes this cycle.
- Execution-shadow D1 persistence remains UNKNOWN.

## Exact next continuation point
1. Re-read latest governance/worklist/checkpoint and latest main research commit; re-check checkpoint SHA before any write.
2. Continue on existing `research/b13-shadow-provenance`; do not recreate it or repeat B-13 tracing.
3. Fetch `research/counterfactual_v8_7_4.js` in sufficiently small non-truncating line ranges (the 250-499 tail is already proven retrievable; split the 1-249 head further). Reconstruct the complete file and verify no gaps/overlap before any whole-file update.
4. Implement only isolated provenance diagnostics in `readShadowCounterfactualResearch()`: snapshot parse status, baseline-close status, history-row/history-parse/history-empty status, and horizon maturity status. Preserve outcome calculations and legacy `coverage.dN` exactly.
5. Add targeted tests for malformed snapshot + valid history; valid snapshot + malformed history; missing history row; valid snapshot/history but immature D1; mature D1. Missing remains UNKNOWN/null.
6. Run existing regression/invariant suite and compare protected formal outputs. If isolation cannot guarantee invariants, stop as Class B and request owner decision.
7. Only after tests pass may Class A be merged/deployed through the existing authorized path; verify workflow plus production readback/health/research endpoint. Commit alone is never deployment evidence.
8. After observability exists, inspect real prospective counts. Until then corruption incidence and execution-shadow D1 persistence remain UNKNOWN.
9. Do not repeat one-date maturity audit unless a durable artifact shows a new prospective Shadow date or mature horizon.
10. Formal Core remains LOCKED. No Class B/C production change without explicit owner decision.
