# P2 research note — path-quality overlap audit

Timestamp: 2026-09-22 06:44 +08:00
Governance: RESEARCH ONLY / Formal Core LOCKED

## Question
Can the existing persistence / positive-day / breakout fields already span an information-discreteness-like idea, and is a new factor justified?

## Repository evidence
- `research/incremental_v8_7_7.js` preregisters I02 as `price.persistenceScoreResearch` beyond `price.residualSectorRs20`; I03 tests `setup.breakoutQualityResearch` beyond attention volume. These are already counted research definitions, not free dimensions.
- `research/EXPERIMENT_REGISTRY.md` already freezes R01 breakout holding/failure, R05 overnight vs intraday, and R07/R08 attention-vs-strength contrasts.
- The checked-in base `Worker.js` `buildMarketFeatures()` computes raw path ingredients such as ret20/ret60, volumeTodayVsPrev5, volatility20, priorHigh20, close position, upper shadow, moving-average structure and breakout setup. However, the literal `positiveDayRatio20` / `persistenceScoreResearch` / `breakoutQualityResearch` research fields are not defined in the checked-in base source section; repository code search also did not locate `positiveDayRatio20` or `persistenceScoreResearch` as literal main-source definitions. Therefore their authoritative construction is likely in the generated/deployment research patch chain rather than the base Worker source, and must be traced there before any new diagnostic is specified.

## Convergence
1. Do **not** create an ID / path-quality factor now. Persistence + breakout quality + R07/R08 attention proxies already occupy much of the conceptual space, creating clear Factor-Zoo and redundancy risk.
2. Existing preregistered incremental tests already provide the right first falsification path: I02 asks whether persistence adds beyond residual RS; I03/I04 test breakout quality vs attention volume. Any ID-like candidate would need to show incremental value beyond these, not merely correlate with D5.
3. `positiveDayRatio20` should be treated as UNKNOWN in definition-level audit until its exact deployed formula/provenance is recovered. Do not infer its formula from the name.
4. A composite made from persistence + positive-day ratio + breakout quality would be a new experiment/variant, not a harmless recombination; it must not be constructed after seeing outcomes.

## Bias / redundancy / data-quality checks
- No outcome-driven thresholds or windows were introduced.
- No historical execution Shadow was backfilled.
- No missing field was coerced to BAD/0.
- Same-day stocks remain clustered; scan date is the independent evidence unit.
- Current gap is definition provenance, not evidence that the field is absent from deployed research snapshots.

## R01-R08 / I01-I07 impact
- R01-R08 unchanged; I01-I07 unchanged; no R09.
- I02/I03/I04 become explicit redundancy controls for any future path/ID proposal.
- R05 remains the execution-path prior; R07/R08 remain attention controls.

## Engineering classification
Research interpretation / provenance audit only. No code change, branch, tests or deployment. Formal Core remains LOCKED.

## Exact next continuation point
1. Trace the generated/deployment research patch chain and production research schema to recover exact formulas/provenance for `price.persistenceScoreResearch`, `positiveDayRatio20` (if deployed), and `setup.breakoutQualityResearch`; do not infer from names.
2. Compare those formulas term-by-term for shared inputs/windows and identify deterministic or near-deterministic overlap before registering any new diagnostic.
3. Continue accumulating prospective execution-shadow-v2. Once actual trading-day snapshots exist, inspect coverage by independent scan date before directional Execution Alpha inference.
4. Keep spread as transaction-cost/liquidity control, depth imbalance descriptive, and opening gap diagnostic/control only.