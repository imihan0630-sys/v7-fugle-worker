# Research Checkpoint

Updated: 2026-09-22T04:36+08:00

## Continuity / baseline
- Formal Core: LOCKED.
- Repository: `imihan0630-sys/v7-fugle-worker`.
- Production Worker: `fugle-test` / `https://fugle-test.imihan0630.workers.dev/`.
- Actual Production readback overrides remembered/chat version strings.
- Prospective Shadow begins 2026-09-21; no fabricated historical Shadow.
- Missing evidence remains UNKNOWN, never BAD/0.
- Owner explicitly approved starting the validated optimization batch on 2026-09-22.

## Engineering now in progress — V8.8.0 Prospective Shadow Execution Recorder
### Research basis
- Execution Alpha evidence is regime-, participant-, instrument- and cost-sensitive.
- Taiwan evidence does not justify promoting first30/VWAP/10m/15m strength into a new formal score or gate.
- Exact point-in-time execution state cannot be safely reconstructed later from completed historical bars, so prospective capture is required before falsification.

### Scope implemented on branch
Branch: `research/execution-recorder-v8-8-0`

Files:
- `scripts/apply_v8_8_0.py`: adds isolated prospective execution snapshots.
- `tests/test_v8_8_0_execution_recorder.mjs`: guards research-only semantics, UNKNOWN handling and post-formal hook ordering.
- `.github/workflows/v7-cloudflare.yml`: applies/validates the new patch and runs the targeted test.

Recorder captures only already-polled runtime state at sparse milestones:
- OPEN_BASELINE
- FIRST_10M_COMPLETE
- FIRST_15M_COMPLETE
- FIRST_30M_COMPLETE
- FORMAL_SIGNAL_OBSERVED when a formal notification event exists

Saved PIT semantics include scheduledTime, decisionAt, observedAt/featureKnownAt, quote lastTradeAt where valid, completed 10m/15m bar start/end, freshness flags, current price and the formal decision that already existed.

### UNKNOWN / data quality
The first implementation intentionally stores these as UNKNOWN/null rather than inferring them:
- opening gap
- session VWAP
- bid/ask spread
- depth imbalance
- market mechanism state (VI/halt/disposition/call auction)
This avoids fabricating fields not yet proven available from the already-polled payload.

### Safety / redundancy firewall
- No new vendor calls.
- No new selection factor, score, weight, threshold or gate.
- No change to A/B definitions, Top6, 3+3, capital, entry/add/reduce/sell/stop, formal 15m/10m semantics, monitoring eligibility or push logic.
- Recorder hook is after formal signal processing and live-state persistence.
- Recorder errors are fail-open and only create research data gaps.
- Duplicate sparse events use D1 INSERT OR IGNORE keyed by trade date/symbol/event.
- This is classified **Class B during implementation** because it adds a table/write to the shared D1/runtime path even though decision semantics are research-only. Owner approval has been received. Production promotion still requires passing full regression and deployment safety gates.

### Bias / overfit checks
- Recorder creates observations only; it does not test or select thresholds.
- Future analysis must cluster by scan date and control existing momentum, positiveDayRatio20, residualSectorRs20, volume/attention, overnight gap and market mechanism state where known.
- No R09 is created. R01-R08 and I01-I07 remain unchanged.

## Tests / deployment status
- Targeted test added but GitHub CI has not yet completed at this checkpoint.
- Full existing regression is required before merge.
- Production deployment/readback has not yet occurred.
- Web readback from the chat web tool was inaccessible; production verification must use the repository's existing GitHub Actions path, which already performs version guard, predeploy backup, code-only deploy, rollback-on-failure and postdeploy readback.

## Rollback
- Pre-change main: `9951b93b308f5ef7bfb0f244ffca6ded90e54cea`.
- Dedicated rollback/implementation branch: `research/execution-recorder-v8-8-0`.
- Existing deployment workflow also preserves a verified predeploy Worker/Cron backup artifact before production update.

## Exact next continuation point
1. Open PR from `research/execution-recorder-v8-8-0` to main.
2. Run/inspect targeted + full regression.
3. If any protected Formal Core invariant changes or runtime tests fail, do not merge/deploy; repair only on branch and update this checkpoint.
4. If all tests pass, merge the owner-approved Class B research-only recorder.
5. Verify deploy workflow, Production `/api/version`, health/readback and recorder endpoint/table readiness without generating fake historical Shadow or real test signals.
6. Only after V8.8.0 is stable, inspect already-polled quote payload coverage for spread/depth/VWAP/market-state fields. Propose the next optimization only if coverage is real; UNKNOWN must remain UNKNOWN.
