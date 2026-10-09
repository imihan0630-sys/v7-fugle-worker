# BR074 source-clock audit — 2026-10-10

Status: RESEARCH_ONLY / OUTCOMES_CLOSED / PIT_ELIGIBLE_N_UNKNOWN
Scope: Room11 D16+D18, TWSE-only descriptive breadth, not a trading policy.

Read back three existing official-source research receipts:
- 2026-10-02: 483 up, 506 down, 91 flat; comparable 1080/1082; net breadth -2.129630 pp; recorded capturedAt 15:48 Taipei.
- 2026-10-07: 588 up, 387 down, 99 flat; comparable 1074/1082; net +18.715084 pp; capturedAt 23:55:26 Taipei.
- 2026-10-08: 425 up, 540 down, 109 flat; comparable 1074/1082; net -10.707635 pp; no capturedAt field in BR073 receipt.

All three numerator/denominator calculations reproduce their stored values. They establish N=3 distinct official *market dates*, NOT N=3 decision-clock-admissible dates. The three inspected JSON receipts do not expose immutable raw-source hashes. A source URL or marketDate is not an availableAt receipt.

At an illustrative 18:00 Taipei decision cutoff, the 10/07 capturedAt is too late, the 10/08 clock is UNKNOWN, and 10/02 is timestamp-compatible only (additional source integrity proof still needed). Do not backfill these receipts into 18:00 strategy decisions.

PIT decision eligibility must be computed separately for each frozen strategy cutoff, with source hash/firstKnownAt or conservative availability bound. Unknown clock is not BAD, zero breadth or a no-event assertion.

Next: request immutable source clock/hash lineage for each prospective date; keep BR074 predictive outcomes CLOSED and D18-04 U2B negative-event completeness independently blocked. Formal Core unchanged.
