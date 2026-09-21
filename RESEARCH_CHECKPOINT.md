# Research Checkpoint

Updated: 2026-09-22T04:43+08:00

## Continuity / baseline
- Formal Core: LOCKED.
- Repository: `imihan0630-sys/v7-fugle-worker`.
- Production Worker: `fugle-test` / `https://fugle-test.imihan0630.workers.dev/`.
- Actual Production readback overrides remembered/chat version strings.
- Prospective Shadow begins 2026-09-21; no fabricated historical Shadow.
- Missing evidence remains UNKNOWN, never BAD/0.
- Owner explicitly approved starting the validated optimization batch on 2026-09-22.

## Engineering in progress — V8.8.0 Prospective Shadow Execution Recorder
Branch: `research/execution-recorder-v8-8-0`
PR: #93
Current branch head before this checkpoint update included repair commit `5c127ab5d0e696d9f711d86b86fead646b35ae98`.
Pre-change main / rollback point: `9951b93b308f5ef7bfb0f244ffca6ded90e54cea`.

### Research / experiment
Execution Alpha evidence remains regime-, participant-, instrument- and cost-sensitive. Current evidence does not justify promoting first30/VWAP/10m/15m strength into a formal score/gate. Exact point-in-time execution state cannot be safely reconstructed later, so prospective capture remains the validated engineering objective.

### Implemented scope
- `scripts/apply_v8_8_0.py`: V8.8.0 sparse prospective recorder.
- `tests/test_v8_8_0_execution_recorder.mjs`: targeted research-only/UNKNOWN/hook-order guard.
- `.github/workflows/v7-cloudflare.yml`: production build/deploy chain updated to apply/validate V8.8.0.
- `.github/workflows/v7-regression.yml`: full regression now applies V8.8.0 and runs the targeted test.
- `.github/workflows/v7-repair-ci.yml`: repair verification aligned through V8.8.0.
- `tests/test_v8_7_13_daily_mobile_alert.mjs`: repaired to test the V8.7.13 behavior contract without incorrectly pinning all future runtime versions to 8.7.13.

Sparse events: OPEN_BASELINE, FIRST_10M_COMPLETE, FIRST_15M_COMPLETE, FIRST_30M_COMPLETE, FORMAL_SIGNAL_OBSERVED.
PIT fields include scheduledTime, decisionAt, observedAt/featureKnownAt, quote lastTradeAt where valid, completed 10m/15m bar start/end, freshness flags, current price and already-existing formal decision.

### Supporting evidence / counterevidence / redundancy
- Supporting: prospective PIT capture is required to test execution timing without historical look-ahead.
- Counterevidence: Taiwan evidence does not support a universal first30/VWAP trading rule; no such rule is added.
- Redundancy firewall: recorder does not create R09 or any score/gate; future analysis must residualize existing momentum, positiveDayRatio20, residualSectorRs20, volume/attention, overnight gap and market-state effects.
- Selection bias/date clustering: future inference remains clustered by independent scan date, not by individual Top6 row.

### UNKNOWN / data quality
Still intentionally UNKNOWN/null unless proven available from already-polled payload:
- opening gap
- session VWAP
- bid/ask spread
- depth imbalance
- market mechanism state (VI/halt/disposition/call auction)
No UNKNOWN is coerced to BAD/0 or NORMAL.

### R01-R08 / I01-I07
Unchanged. No R09. No formal factor/threshold promotion.

## Engineering classification / safety
Class B during implementation because this adds a D1 table/write on shared runtime. Owner approval has been received, but promotion remains gated on regression/deploy verification.
- No new vendor calls.
- No A/B, ranking, Top6, 3+3, capital, entry/add/reduce/sell/stop, formal 10m/15m, monitoring eligibility or push semantic change.
- Recorder hook runs after formal signal processing and live-state persistence.
- Recorder failure is fail-open and can only create a research data gap.
- Duplicate sparse events use D1 INSERT OR IGNORE.

## Tests / deployment
- First V8.8-aware regression run `35652665570` correctly built V8.8.0 but failed before the new targeted test because legacy `test_v8_7_13_daily_mobile_alert.mjs` asserted the exact old runtime version `8.7.13-daily-mobile-alert`.
- This was a test-maintenance incompatibility, not a detected Formal Core behavior change. The test's actual DAILY_SELECTION Slack mention assertions were preserved; only the stale exact-version pin was made forward-compatible in commit `5c127ab5d0e696d9f711d86b86fead646b35ae98`.
- Earlier V8 regression run before applying V8.8.0 passed, confirming the baseline, but is not sufficient evidence for V8.8.0 promotion.
- Repair CI earlier exposed a separate stale-chain failure in `test_three_min_current_recovery`; the repair workflow has since been aligned through V8.8.0 and must be re-observed on the current head.
- Production deployment/readback has NOT occurred. Do not claim V8.8.0 is live.

## Unfinished / exact next continuation point
1. Wait for/inspect the fresh PR CI triggered by the current branch head after `5c127ab5...` and this checkpoint commit.
2. Require V8 Regression Tests to build V8.8.0, run all legacy regressions plus `test_v8_8_0_execution_recorder.mjs`, and pass read-only production preflight.
3. Inspect V8 Repair CI separately; if it fails only from another stale version/test-chain assumption, repair on branch without weakening behavioral invariants. Any genuine Formal Core regression stops promotion.
4. Only when required regression evidence is green, merge PR #93.
5. Observe the existing Cloudflare deployment workflow. Require predeploy backup, successful code-only deploy, postdeploy `/api/version` readback = `8.8.0-shadow-execution-recorder`, production health/readback, and recorder endpoint/table readiness. Do not create fake historical Shadow or real test signals.
6. If deployment/readback fails, use the pre-change rollback point/workflow backup and preserve evidence.
7. After V8.8.0 is stable, inspect already-polled quote payload coverage for spread/depth/VWAP/market-state fields; only propose a next optimization when real coverage exists.
