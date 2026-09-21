# Research Checkpoint

Updated: 2026-09-22T04:48+08:00

## Continuity / baseline
- Formal Core: LOCKED.
- Repository: `imihan0630-sys/v7-fugle-worker`.
- Production Worker: `fugle-test` / `https://fugle-test.imihan0630.workers.dev/`.
- Actual Production readback overrides remembered/chat version strings.
- Prospective Shadow begins 2026-09-21; no fabricated historical Shadow.
- Missing evidence remains UNKNOWN, never BAD/0.
- Owner approved the validated optimization batch on 2026-09-22.

## Completed engineering — V8.8.0 Prospective Shadow Execution Recorder
Production readback: **8.8.0-shadow-execution-recorder**.

### What was implemented
Sparse prospective research-only execution snapshots are now recorded from already-polled runtime state at:
- OPEN_BASELINE
- FIRST_10M_COMPLETE
- FIRST_15M_COMPLETE
- FIRST_30M_COMPLETE
- FORMAL_SIGNAL_OBSERVED when a formal notification event exists

PIT fields include scheduledTime, decisionAt, observedAt/featureKnownAt, quote lastTradeAt where valid, completed 10m/15m bar start/end, freshness flags, current price and the already-existing formal decision.

The first version intentionally stores these as UNKNOWN/null rather than inventing them:
- opening gap
- session VWAP
- bid/ask spread
- depth imbalance
- market mechanism state

### Safety result
- No new vendor calls.
- No A/B, ranking, Top6, 3+3, capital, entry/add/reduce/sell/stop, formal 10m/15m semantics, monitoring eligibility or push behavior changes.
- Recorder runs after formal signal processing and live-state persistence.
- Recorder errors are fail-open and create research data gaps only.
- Duplicate sparse events use D1 INSERT OR IGNORE.
- R01-R08 and I01-I07 unchanged; no R09.

### Engineering classification
Class B during implementation because a research-only table/write was added to the shared D1/runtime path. Owner explicitly approved modification and deployment.

### Branch / PR / commits
- Implementation branch: `research/execution-recorder-v8-8-0`.
- PR: #93.
- Merge commit on main: `e9fe3c94c826593b9f2b85e6fdfc5c09b62b4646`.
- Pre-change main / rollback source point: `9951b93b308f5ef7bfb0f244ffca6ded90e54cea`.

### Tests
- V8 Regression Tests run 274: SUCCESS.
- V8 Repair CI run 126: SUCCESS.
- Targeted V8.8.0 recorder contract test: PASS within both suites.
- Existing V8.7 research contract tests were made version-forward compatible; behavior assertions remain.
- Deploy workflow syntax check + behavioral regression: SUCCESS.
- Formal protected behavior contract greps and existing full test suite: SUCCESS.

### Deployment / readback
- V8 Cloudflare Deploy run 87: SUCCESS.
- Predeploy version guard observed `8.7.13-daily-mobile-alert`; build `8.8.0-shadow-execution-recorder`.
- Existing workflow captured and retained the verified predeploy Worker/Cron backup artifact before deployment.
- Code-only Cloudflare deployment: SUCCESS.
- Existing after-market Cron migration/preservation: SUCCESS.
- Deployed version/config verification: SUCCESS.
- Research readback observed `8.8.0-shadow-execution-recorder`.
- Existing Shadow integrity remained HEALTHY at readback; R01-R08 readiness remained research-only/accumulating.

## Research interpretation
The recorder is infrastructure for falsification, not a trading signal. Current Taiwan evidence still does not justify promoting first30/VWAP/10m/15m strength into a formal score or gate.

## UNKNOWN / bias firewall
- No historical execution Shadow was fabricated.
- Exact spread/depth/VWAP/market-mechanism availability from the current already-polled quote payload is still unverified.
- UNKNOWN remains UNKNOWN; do not infer NORMAL market state from price behavior.
- Future execution studies must control existing momentum, positiveDayRatio20, residualSectorRs20, volume/attention, overnight gap, market mechanism state where known, transaction cost and scan-date clustering.

## Completed engineering — V8.8.1 Execution Source Coverage
Production deploy workflow: **SUCCESS (V8 Cloudflare Deploy run 90)**.

### New evidence / source verification
Fugle's current official Intraday Quote contract (docs updated 2026-01-09) confirms the already-required quote response contains:
- previousClose + openPrice;
- avgPrice (intraday average transaction price);
- five-level bids / asks with price and size;
- tradingHalt plus isTrial / isContinuous / delayed-open / delayed-close / limit-halt flags.
Therefore opening-gap diagnostics, an explicitly labeled avgPrice/VWAP proxy, best-spread and five-level depth imbalance can be captured with **zero additional vendor calls**.

### V8.8.1 implementation
- Research snapshot schema advances to execution-shadow-v2.
- Adds openingGapPct from openPrice/previousClose when both are valid.
- Adds sessionAvgPrice and sessionVwapProxy, explicitly preserving semantics as FUGLE_INTRADAY_QUOTE_AVG_PRICE rather than claiming an independently reconstructed VWAP.
- Adds bestBid/bestAsk/spreadPct and bidDepth5/askDepth5/depthImbalance.
- Adds conservative executionMarketState from quote flags: HALTED / TRIAL / CONTINUOUS / NON_CONTINUOUS_FLAGGED / UNKNOWN.
- Does **not** claim to identify disposition status or a dedicated VI event. Insufficient flags remain UNKNOWN.
- All added quote fields are passed through only after the existing formal decision is computed; they do not enter formal selection/trading logic.

### Safety / bias result
- No new Fugle calls.
- No Formal Core factor/score/threshold/ranking change.
- No A/B, Top6, 3+3, capital, entry/add/reduce/sell/stop, formal 10m/15m semantics, monitoring eligibility or push change.
- UNKNOWN remains UNKNOWN.
- avgPrice is labeled a proxy/official quote field, avoiding semantic overclaim.
- These are diagnostics/observations only; no new R09 and no automatic promotion.

### Engineering / tests / deployment
- Branch: research/execution-coverage-v8-8-1.
- PR: #94.
- Merge commit: 9283719e661e42a09b3b0d9fdfe27d54f3753d3e.
- V8 Regression Tests run 279 on PR: SUCCESS.
- V8 Repair CI run 130 on PR: SUCCESS.
- Main regression run 282: SUCCESS.
- First deploy trigger run 89 failed before build because a temporary comment inserted into baseline Worker.js broke the old patch chain at apply_v7_5_33.py. No production deploy occurred from that failed run.
- The comment was removed, restoring the exact patch baseline; main regression remained SUCCESS.
- V8 Cloudflare Deploy run 90: SUCCESS.
- Production deployment was therefore completed only after the patch-chain baseline was restored.
- Formal Core remains LOCKED.

### Rollback
- V8.8.0 production baseline/merge: e9fe3c94c826593b9f2b85e6fdfc5c09b62b4646.
- V8.8.1 merge: 9283719e661e42a09b3b0d9fdfe27d54f3753d3e.
- Existing deployment workflow retains verified predeploy Worker/Cron backup before code-only deployment.

## Exact next continuation point
Priority 6 Execution Alpha moves to **P2 research-readiness / coverage diagnostics**:
1. Let prospective execution-shadow-v2 accumulate actual trading-day snapshots; do not fabricate/backfill historical execution fields.
2. Add/read field-level coverage rates by independent scan date for openingGapPct, sessionAvgPrice/VWAP proxy, spreadPct, depthImbalance and executionMarketState.
3. Keep disposition/VI-specific state UNKNOWN until an official PIT source can distinguish it reliably.
4. Evaluate Execution Alpha only after enough independent dates exist, controlling Selection Alpha, positiveDayRatio20, residualSectorRs20, momentum/attention, overnight gap, transaction costs and date clustering.
5. No formal execution gate/score proposal until prospective/OOS evidence survives these controls.
