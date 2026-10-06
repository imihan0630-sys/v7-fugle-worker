# System1｜Official Quality MOPS Timeout Hardening — 2026-10-07

Status: CLASS-B CANDIDATE / NOT MERGED / NOT DEPLOYED  
Formal Core: LOCKED / impact NONE  
System2 impact: NONE

## Incident

The first post-V8.20 scheduled evidence attempt for scanDate 2026-10-06 failed closed with:

- FORMAL_SCAN_NOT_CONFIRMED;
- C1_GENERATION_NOT_FOUND;
- formalScanDate remained 2026-09-29;
- institutionReady=true;
- qualityReady=false;
- missingQuality = FINANCIAL + QUARTER_EPS.

The two actual V7 Official Market Data Sync runs for the 2026-10-06 session were:

- 37489328230 / job 112357586620;
- 37492017324 / job 112366894044.

Both failed in:
`Sync official index, quarterly financials, valuation and TDCC (no plan changes)`.

In both runs:
- TWSE/TPEx market cache succeeded;
- institution sync succeeded;
- INDEX succeeded;
- TDCC succeeded;
- VALUATION succeeded;
- ANNOUNCEMENTS succeeded;
- MOPS market-option discovery began;
- the quality script then terminated with `The operation was aborted due to timeout`;
- recovery never ran because the quality step failed first.

## Root cause

`publicSource()` applied `AbortSignal.timeout(45000)` and retry logic only around the initial `fetch()`.

The function returned the live `Response` before the body was fully consumed.

Many callers then executed `.text()` or `.json()` outside the retry scope.

Therefore a slow/stalled response body could time out after headers were received, bypassing the existing retry handler entirely. The MOPS path reproduced exactly that failure mode.

## Repair

1. `publicSource()` now fully buffers `response.arrayBuffer()` inside the retry scope.
2. It returns a new local `Response` backed by the completed buffer.
3. Body timeout / abort is therefore retried by the existing bounded 3-attempt policy.
4. 401/403 restrictions remain non-retryable.
5. Retry observability logs path, attempt and bounded error text.
6. The 23:45 scheduled fallback receives `QUALITY_RECOVERY_ONLY=1`.
7. Already-ready quality families are reused on the fallback so the run reaches missing FINANCIAL / QUARTER_EPS sooner and avoids unnecessary repeated official-source load.

## Safety

No change to:
- A/B semantics;
- Top6 / 3+3;
- Formal comparator;
- capital;
- 15-minute confirmation;
- BUY/ADD/REDUCE/SELL/STOP lifecycle;
- push/order behavior;
- quality readiness requirements;
- C1 binding semantics;
- System2.

No historical 2026-10-06 Formal/C1 generation will be synthesized. That date remains research-ineligible.

## Validation target

`tests/test_system1_official_quality_body_retry_v0_1.mjs` verifies:
- body-read timeout is retried through the full source fetch;
- success on a later bounded attempt;
- 403 stops immediately;
- 23:45 fallback is recovery-only;
- no Formal save/scan mutation is introduced.

Next valid proof must come prospectively on a future trading session.
