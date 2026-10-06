# System1｜Official Quality Body-Timeout Retry Repair — 2026-10-07

Status: IMPLEMENTED / CI PENDING  
Formal Core impact: NONE  
System2 impact: NONE

## Observed Production failure

2026-10-06 scheduled `V7 Official Market Data Sync` failed twice during the official-quality step:

- run `37489328230` (~23:39 Taipei);
- run `37492017324` (~23:58 Taipei).

Both runs successfully completed:
- trading-day resolution;
- official TWSE/TPEx closing cache;
- institutional synchronization;
- INDEX;
- TDCC;
- VALUATION;
- ANNOUNCEMENTS.

Both then reached MOPS financial synchronization and terminated approximately 45 seconds after the MOPS financial body request began with:

`Quality synchronization failed: The operation was aborted due to timeout`.

Consequences for marketDate 2026-10-06:
- FINANCIAL not persisted;
- QUARTER_EPS not reached/persisted;
- qualityReady=false;
- Formal scan was not confirmed;
- no C1 generation;
- therefore no genuine V8.20 Formal→C1 binding could exist.

This date remains research-ineligible and must not be backfilled as a genuine sample.

## Root cause

`tests/sync_official_quality.mjs` previously placed only `fetch()` inside the bounded retry helper.

Callers consumed `response.text()` / `response.json()` after the helper returned.

If an official server returned headers but the response body stalled, `AbortSignal.timeout(45000)` fired during body consumption outside the helper's `try/catch`. The exception therefore bypassed the intended three-attempt retry budget and terminated the quality workflow after the first body timeout.

The 2026-10-02 successful run `37030724117` shows normal MOPS financial bodies generally completed well below 45 seconds. This repair therefore does not widen the timeout budget.

## Repair

New helper:

`tests/official_source_fetch.mjs`

Semantics:
- default timeout remains 45,000 ms;
- default attempts remain 3;
- entire response body is consumed via `response.arrayBuffer()` inside the retry boundary;
- body-read timeout now receives the same bounded retry treatment as fetch-connect timeout;
- 429 / 5xx retain bounded retry;
- 401 / 403 remain immediate fail-closed with no credential bypass;
- non-retryable 4xx remain immediate failure.

`tests/sync_official_quality.mjs` now imports this helper.

## Behavioral acceptance

`tests/test_official_source_fetch_retry_v0_1.mjs` covers:
1. first body-read timeout then success => second attempt succeeds;
2. repeated body-read timeout => exactly three attempts then fail;
3. 401/403 => one attempt, fail closed;
4. transient 503 => bounded retry and recovery;
5. non-retryable 400 => one attempt.

Existing recovery-hardening test now also guards that full body consumption stays inside the retry helper.

## Safety

No change to:
- A/B;
- Top6 / 3+3;
- Formal comparator;
- capital sizing;
- 15-minute confirmation;
- BUY / ADD / REDUCE / SELL / STOP;
- push/order behavior;
- Worker runtime;
- System2.

This repair improves only the read-only official-quality acquisition path used before the existing Formal readiness gate.
