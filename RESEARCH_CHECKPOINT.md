# Research Checkpoint

Updated: 2026-09-22T06:44+08:00

## Continuity / baseline
- Formal Core: **LOCKED**.
- Repository: `imihan0630-sys/v7-fugle-worker`.
- Production Worker: `fugle-test` / `https://fugle-test.imihan0630.workers.dev/`.
- Actual Production readback overrides remembered/chat version strings.
- Prospective Shadow begins 2026-09-21; no fabricated historical Shadow.
- Missing evidence remains UNKNOWN, never BAD/0.
- R01-R08 and I01-I07 remain frozen unless explicitly versioned; no R09 currently exists.

## Current production research infrastructure
### V8.8.0 — Prospective Shadow Execution Recorder
- Production readback after deployment: `8.8.0-shadow-execution-recorder`.
- Sparse research-only snapshots: OPEN_BASELINE, FIRST_10M_COMPLETE, FIRST_15M_COMPLETE, FIRST_30M_COMPLETE, FORMAL_SIGNAL_OBSERVED when a formal notification event exists.
- PIT timestamps/freshness are stored; no historical execution Shadow was fabricated.
- Merge: `e9fe3c94c826593b9f2b85e6fdfc5c09b62b4646`; rollback source: `9951b93b308f5ef7bfb0f244ffca6ded90e54cea`.

### V8.8.1 — Execution Source Coverage
- Production deployment workflow run 90: SUCCESS.
- Research schema: `execution-shadow-v2`.
- Zero-additional-call fields from already-polled Fugle quote: openingGapPct, sessionAvgPrice / explicitly labeled VWAP proxy, best spread, five-level bid/ask depth and depthImbalance, conservative executionMarketState.
- Market state remains UNKNOWN when flags are insufficient; no claim of disposition/VI identification.
- Merge: `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`; V8.8.0 is rollback baseline.
- No A/B, ranking, Top6, 3+3, capital, entry/add/reduce/sell/stop, monitoring eligibility or push behavior change.

## P2 research status — Execution Research Readiness
Status: **ACCUMULATING / RESEARCH ONLY**.

### Taiwan price-path / intraday prior
Durable note: `research/notes/P2_2026-09-22_0552_ID_INTRADAY_PRIOR.md`.
- Taiwan evidence supports path persistence / continuous-information underreaction as a stronger prior than raw cumulative return alone.
- Positive opening gap is not assumed bullish; overnight momentum can reverse while intraday momentum continues.
- Price-limit regime and turnover remain explicit falsification dimensions.
- Spread remains transaction-cost/liquidity evidence; five-level depth imbalance remains descriptive until prospective incremental evidence survives controls.

### Path-quality overlap audit — 2026-09-22 06:44
Durable note: `research/notes/P2_2026-09-22_0644_PATH_OVERLAP_AUDIT.md`; commit `be85cde98b4b9e4e681665add181865b53090903`.

New convergence:
1. `research/incremental_v8_7_7.js` already preregisters I02 persistence beyond residual RS and I03/I04 breakout quality vs attention volume. These are existing counted research dimensions and are the first redundancy/falsification controls for any future ID/path proposal.
2. R01, R05, R07 and R08 already cover breakout holding/failure, overnight-vs-intraday decomposition, and attention-vs-strength paths. A new information-discreteness factor now would materially expand the Factor Zoo before existing overlap is falsified.
3. Checked-in base `Worker.js` exposes raw path ingredients (ret20/ret60, volumeTodayVsPrev5, volatility20, priorHigh20, close position, upper shadow, MA structure/breakout setup), but literal deployed research definitions for `positiveDayRatio20` / `price.persistenceScoreResearch` / `setup.breakoutQualityResearch` were not located in the base source/code search. Their exact formulas must therefore be recovered from the generated/deployment research patch chain or production research schema before any new diagnostic is registered.
4. `positiveDayRatio20` is **UNKNOWN at definition-provenance level** for this audit. Do not infer its formula from its name, and do not treat this as evidence that the field is absent from deployed research snapshots.
5. Combining persistence + positive-day ratio + breakout quality after observing outcomes would itself be a new experiment/variant and is prohibited without preregistration.

### R01-R08 / I01-I07 impact
- R01-R08 unchanged; I01-I07 unchanged; no R09.
- I02/I03/I04 explicitly serve as redundancy controls for future path/ID hypotheses.
- R05 remains the execution-path prior; R07/R08 remain attention controls.
- No Formal Core change.

## Bias / data-quality firewall
- UNKNOWN remains UNKNOWN; no BAD/0 coercion.
- No historical execution-shadow-v2 backfill.
- Independent scan date remains the primary evidence unit; same-day stocks are clustered observations.
- No causal claim from contemporaneous correlations.
- No outcome-driven ID window, gap threshold, intraday-confirmation threshold or holding period introduced.
- Turnover can be both attention proxy and conditioning variable; avoid double-counting correlated information.
- Disposition/VI-specific state remains UNKNOWN until a reliable official PIT source distinguishes it.

## Engineering status this cycle
- Classification: research interpretation / provenance audit only.
- No code change, branch, PR, regression test or deployment required.
- Formal Core remains LOCKED.
- Durable note commit this cycle: `be85cde98b4b9e4e681665add181865b53090903`.

## Exact next continuation point
Priority 6 Execution Alpha remains in **P2 research-readiness / coverage diagnostics**. Continue without user interaction unless a B/C decision or genuine blocker appears:
1. Trace the generated/deployment research patch chain and production research schema to recover exact formulas/provenance for `price.persistenceScoreResearch`, `positiveDayRatio20` (if deployed), and `setup.breakoutQualityResearch`; do not infer from names.
2. Compare recovered formulas term-by-term for shared inputs/windows and identify deterministic or near-deterministic overlap before registering any new Shadow diagnostic.
3. Continue Taiwan evidence review on path persistence, turnover-conditioned momentum and regime sensitivity; prefer falsification/redundancy work over adding factors.
4. Let prospective execution-shadow-v2 accumulate actual trading-day snapshots; never fabricate/backfill historical execution fields.
5. When snapshots exist, read field-level coverage by independent scan date for openingGapPct, sessionAvgPrice/VWAP proxy, spreadPct, depthImbalance and executionMarketState before directional inference.
6. Preserve spread as execution-cost/liquidity control, depth imbalance as descriptive state, and opening gap as diagnostic/control until prospective evidence survives controls.
7. No formal execution gate/score proposal until prospective/OOS evidence survives Selection Alpha, momentum/attention, residual RS, liquidity/volatility, transaction-cost and date-cluster controls.
