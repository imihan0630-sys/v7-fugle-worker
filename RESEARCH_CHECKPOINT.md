# Research Checkpoint

Updated: 2026-09-21T23:35+08:00

## Continuity / baseline
- Formal Core: LOCKED.
- Repository: `imihan0630-sys/v7-fugle-worker`.
- Production Worker: `fugle-test` / `https://fugle-test.imihan0630.workers.dev/`.
- Actual Production readback must override remembered/chat version strings.
- Prospective Shadow begins 2026-09-21; no fabricated historical Shadow.
- Missing evidence remains UNKNOWN, never BAD/0.
- Owner authorization rule: research may continue autonomously, but program modification/deployment requires first presenting a validated optimization proposal and receiving explicit owner approval.

## Repository state recovered this cycle
- Read main `RESEARCH_ENGINEERING_GOVERNANCE.md`, `RESEARCH_WORKLIST.md`, and this checkpoint before continuing.
- Governance still classifies formal 15m/10m confirmation semantics as Class C; Execution Alpha remains diagnostic/Shadow unless explicitly approved.
- Prior checkpoint established that `Worker.js` intends minute Quote polling with 10m/15m K updates only after bar close, but there is no durable PIT execution recorder for exact feature availability / contemporaneous VWAP / market-mechanism state.
- No runtime code was changed this cycle; therefore no deployment or Production version claim is made.

## Research advanced this cycle — Priority 6 Execution Alpha / minimal prospective recorder proposal

### Research question
Is a prospective Shadow execution-state recorder sufficiently useful, isolated, low-cost and falsifiable to justify engineering, without changing formal selection or trading behavior?

### New supporting evidence
- Taiwan individual-stock evidence located this cycle materially strengthens the need for prospective measurement rather than assuming one direction: an intraday Taiwan-stock study reports short-horizon price reversal/overreaction and distinguishes 30-minute contrarian behavior from 120-minute momentum behavior. This directly warns against promoting a generic first-30-minute momentum rule.
- Taiwan market order-flow evidence shows both informed and liquidity traders concentrate activity near the open, with liquidity trading slightly more influential in explaining volume. Therefore opening strength can mix information and liquidity demand rather than represent a clean alpha signal.
- Taiwan evidence on executed limit versus market orders reports limit-order execution can outperform market orders even after accounting for non-execution, supporting the broader proposition that Execution Alpha may arise through fill/adverse-selection quality rather than stock selection.
- Existing Taiwan ETF/index-futures evidence still supports studying first-half-hour information, but cannot be silently generalized to individual stocks.

### New counterevidence / falsification
- The individual-stock Taiwan evidence is directionally inconsistent with a naive first-30-minute continuation hypothesis: short-horizon reversal exists, while momentum appears at a longer intraday horizon. This is important counterevidence against adding `first30Return > 0` as a formal confirmation rule.
- Opening activity is structurally contaminated by liquidity demand and Taiwan's high opening volatility; raw gap/VWAP/opening-range thresholds risk learning microstructure rather than incremental execution value.
- Evidence spans different historical market structures; Taiwan moved to continuous intraday trading in 2020, so old findings require a market-mechanism/regime control before modern use.

### Redundancy / bias firewall
- No new score, threshold, R09 or formal 10m/15m rule.
- Any prospective test must separate Selection Alpha from Execution Alpha and control prior-day momentum, breakout quality, `positiveDayRatio20`, `residualSectorRs20`, attention/volume state and market regime.
- Same-day symbols are clustered evidence. Results must be evaluated by independent scan dates, realistic observable fill timing, slippage and transaction costs.
- Do not reconstruct historical exact VWAP/feature-known timestamps from EOD bars.

### UNKNOWN / data quality
- Historical exact `featureKnownAt`, VWAP-at-decision and execution market state remain UNKNOWN where not prospectively recorded.
- Modern post-2020 individual-stock Taiwan first30/VWAP incremental effect remains UNKNOWN.
- VI/halt/disposition-periodic-call state availability from current runtime/source has not yet been proven field-by-field; recorder must preserve UNKNOWN if unavailable rather than infer NORMAL.

### Minimal isolated recorder proposal (candidate optimization; not yet implemented)
Purpose: preserve contemporaneous evidence so future 10m/15m/VWAP/opening hypotheses can be falsified without look-ahead.

Proposed scope:
- Research-only records for the already-known formal monitored/selected symbols; no eligibility/ranking changes and no additional trading universe fetch solely to create alpha.
- Event snapshots rather than every-minute archival: opening baseline plus first completed 10m, first completed 15m, 09:30/first-30-minute checkpoint, and existing formal decision/signal evaluation timestamps when observable. This keeps storage small and aligns records to preregistered hypotheses.
- Minimum fields: `tradeDate`, `symbol`, `snapshotType`, `barStartAt`, `barEndAt`, `lastTradeAt`, `capturedAt`, `featureKnownAt`, `decisionAt` (nullable), `lastPrice`, `cumVolume`, contemporaneous cumulative `sumPriceVolume`/VWAP inputs where source semantics support them, `vwapAtCapture`, `openingGapPct`, `first30Return` when actually known, `executionMarketState`, `marketStateSource`, `dataQuality`, `sourceTimestamp`, `sourceMarket`.
- Missing/unsupported state = UNKNOWN; never infer NORMAL.
- Immutable prospective semantics: no historical synthetic backfill.

### Storage / API cost estimate
- With Top6-scale monitoring and four fixed early-session snapshots, baseline is about 24 rows/trading day before any decision-event snapshots. Even allowing several decision snapshots per symbol, expected volume is hundreds, not thousands, of rows/day.
- Reuse already-polled Quote/bar data where possible. The proposal should not add a new high-frequency vendor call solely for research; if a required field needs extra calls, that becomes a separate cost/rate-limit review and may move the change toward Class B.
- Exact byte/storage cost remains implementation-dependent on the current persistence binding/schema; verify before coding.

### Targeted tests / protected invariants for proposed implementation
1. Frozen-input formal candidate eligibility/order identical before/after recorder.
2. Top6 and 3+3 outputs identical.
3. Formal 10m/15m confirmation semantics and signal state identical.
4. Monitoring/push/capital/trade-plan outputs identical.
5. Recorder failure is fail-open for formal runtime: it may mark research evidence missing but cannot block formal processing.
6. No extra research field may be consumed by formal scoring/ranking code.
7. Timestamp tests prove a 10m/15m feature is not persisted as known before bar completion.
8. UNKNOWN tests prove unavailable market state/VWAP is not coerced to zero/normal.
9. Duplicate/idempotency tests for repeated scheduled invocations.
10. Storage/rate-limit test confirms no material degradation to formal scan latency.

### R01-R08 / I01-I07 impact
- R01-R08 and I01-I07 unchanged.
- No R09 created.
- Execution Alpha research direction is now more sharply falsifiable: first30 continuation is explicitly challenged by Taiwan individual-stock reversal evidence; recorder is intended to determine which horizon/market state, if any, survives prospectively and net of costs.

## Engineering classification / actions this cycle
- Proposed recorder is provisionally Class A only if isolated research persistence can reuse existing data and fail open without affecting shared runtime latency/scheduling. If it requires shared schema/path changes, extra vendor calls, or can delay formal monitoring, classify Class B instead.
- Formal 10m/15m confirmation changes remain Class C.
- No code modification/deployment this cycle because owner approval is required before program modification.

## Tests / deployment
- Code tests: not applicable; runtime unchanged.
- Research validation: repository governance/worklist/checkpoint read; repository root/storage search performed; literature search added Taiwan individual-stock/order-flow/execution counterevidence.
- Deployment: none.

## Decision status
- The recorder now meets the threshold to present as a worthwhile optimization proposal: its value is not to assert a new alpha but to prevent future look-ahead and make Execution Alpha hypotheses prospectively falsifiable. The strongest new evidence is precisely contradictory horizon behavior in Taiwan stocks, which makes contemporaneous timestamped evidence more valuable.
- Owner approval is required before code modification/deployment.

## Exact next continuation point
If owner approves the prospective Shadow Execution Recorder, first inspect the exact current persistence bindings/schema and `Worker.js` quote/bar/monitoring call sites; determine whether the implementation is truly isolated Class A or must be Class B. Create a rollback branch, implement the smallest fail-open event recorder, run targeted + full regression and Formal Core invariant comparisons, then use the existing authorized deployment chain and verify workflow + Production readback/health. If owner does not approve or defers, continue Priority 6 research without code, focusing on modern post-2020 Taiwan individual-stock VWAP/first30 evidence and market-state observability.
