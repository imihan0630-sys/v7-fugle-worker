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

## Exact next continuation point
Priority 6 Execution Alpha continues with **P1 source-coverage verification**:
1. Verify from Fugle's current quote/candle contract and, where safely observable, already-polled production payload whether session VWAP, bid/ask spread, depth/imbalance and reliable market-state fields are actually available without additional vendor calls.
2. Record field-level coverage/UNKNOWN rate prospectively; do not infer missing values.
3. If coverage is sufficient, prepare the next owner-facing optimization proposal for execution-cost diagnostics and market-state provenance. Do not modify/deploy another program change until owner approval.
4. If coverage is insufficient, keep P1 UNKNOWN and proceed to P2 research-readiness diagnostics using V8.8.0 recorder samples.
