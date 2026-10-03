# System 2 Daily Shadow A1 Exact-Date Fallback V0.2

Updated: 2026-10-03 Asia/Taipei  
Status: REPOSITORY IMPLEMENTATION / REMOTE CI + PROSPECTIVE PHYSICAL ACCEPTANCE PENDING  
Scope: S2-07 current-day A1 source integrity only  
System 1 / V8 impact: NONE

## Problem

The 2026-10-02 prospective diagnostic proved a real source-timing mismatch:
- TPEx latest OpenAPI already reported 2026-10-02;
- TWSE `STOCK_DAY_ALL` still reported 2026-10-01 at the observation clock;
- the existing adapter correctly rejected the stale TWSE rows, leaving A1 incomplete.

This is a source-availability issue, not a reason to lower the ordinary-symbol coverage gate.

## V0.2 rule

For each market independently:

1. Query the existing official latest OpenAPI.
2. If it contains the requested market date, keep it as the source.
3. If it does not contain the requested market date, query the already-validated official exact-date endpoint:
   - TWSE MI_INDEX `date=YYYYMMDD&type=ALLBUT0999`;
   - TPEx afterTrading dailyQuotes `date=YYYY/MM/DD`.
4. The exact-date parser must independently prove that the returned source date equals the requested market date.
5. If exact-date recovery succeeds, convert only the normalized values into the A1 snapshot contract and bind provenance to a distinct prospective exact-date source ID.
6. For prospective PIT semantics, `observedAt/availableAt` equals the time after the fallback response was actually observed. Historical endpoint finality/publication assumptions are NOT reused.
7. If both sources fail, or latest is stale and exact-date cannot prove the target date, remain SOURCE_ERROR / INCOMPLETE. Never reinterpret this as zero picks.

## Provenance identities

- `A1_TWSE_MI_INDEX_EXACT_DATE_PROSPECTIVE`
- `A1_TPEX_DAILY_QUOTES_EXACT_DATE_PROSPECTIVE`

The latest-OpenAPI identities remain unchanged when they already contain the target date.

## Safety

This change:
- does not define strategy thresholds;
- does not resolve `ASSESSOR_POLICY_NOT_FROZEN`;
- does not establish corporate-action continuity;
- does not enable final selection, push, capital or orders;
- does not populate `s2_capacity_runs` by itself;
- does not change the user-video Baseline or Challenger formula;
- does not touch System 1/V8.

## Acceptance

Repository tests must prove:
- stale latest TWSE + valid exact-date TWSE can become READY;
- the exact-date provenance identity and URL are retained;
- prospective `availableAt` is the actual observation time;
- a failed/mismatched fallback remains INCOMPLETE;
- a market whose latest source is already target-date does not call fallback.

Physical acceptance requires a future trading-day diagnostic where an exact-date fallback is actually used or where both latest sources are already current. Synthetic fixtures do not count as positive live evidence.
