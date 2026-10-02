# System 1 C3 provider call envelope correction — 2026-10-03

Status: authoritative correction for PR #322 provider-budget arithmetic.

The earlier checkpoint paragraph that described a 24/60 requests-per-minute
worst case counted only the Formal 6-stock path. The integrated runtime also
contains AIDEEN_APP and Hybrid WATCH monitoring.

Correct static worst-case accounting before C3:
- Formal + AIDEEN_APP: 11 Quote + 11 10m candles + 11 15m candles = 33/min.
- Hybrid WATCH: up to 5 Quote + 5 15m candles = 10/min.
- Existing total before C3 = 43/min.

C3 adds no Quote requests and at most six 15m candle requests, so the bounded
static maximum is 49/min under the current Fugle Basic 60/min intraday limit.

V8.15.2 now also enforces maxTotalCallsPerMinute=50 against the existing
fugleCallsThisRun.total before any C3 request. If the projected total exceeds
50, the C3 slot is skipped as C3_CAPTURE_MINUTE_BUDGET_BLOCKED. Formal,
AIDEEN_APP and Hybrid WATCH paths are not changed by this research guard.

This correction supersedes only the provider-envelope arithmetic in
SYSTEM1_C3_CAPTURE_CLASS_B_CHECKPOINT_20261003.md. All other governance,
non-deployment and evidence-boundary statements remain unchanged.
