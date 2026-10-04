# D12 real-parent Put-Call parity / futures cross-check — 2026-10-04

Status: RESEARCH_ONLY / SOURCE_QA / OUTCOMES_CLOSED / H11_PARTIAL
Parent date: 2026-10-02
Parent option SHA-256: 61574590f9c8a1c882616f89090d39cbd44e00a91bd93055ff046ff4ab287c2a
Parent futures SHA-256: d41cc8c279d805a0ebb13c29f3ff757cdc78a35d7a2e13fc06be4b3f3aeb1834
Workflow run: 37190733214
Job: 111402160015
Raw bytes persisted to repository: NO

## Method

Use only regular-session TXO rows that pass frozen Surface Method V0.1 two-sided midpoint eligibility.

For each expiry and strike with both Call and Put eligible:
- C = Call last-best-bid/ask midpoint
- P = Put last-best-bid/ask midpoint
- regress C-P on strike K under the European parity identity C-P = D*(F-K)
- OLS intercept = D*F
- OLS slope = -D
- parity-derived F = intercept / D

This is a source-quality / identity diagnostic only. The daily file does not prove synchronized quote timestamps across strikes or Call/Put sides. Regression residuals are not executable arbitrage.

## Results by expiry

| Expiry | Expiry date | Pairs | Implied D | Parity F | R2 | RMSE points |
|---|---|---:|---:|---:|---:|---:|
| 202610F1 | 2026-10-02 | 12 | 0.9984039846 | 48450.4254 | 0.99999399 | 0.998944 |
| 202610W1 | 2026-10-07 | 112 | 0.9929954412 | 48354.877333 | 0.99794818 | 93.758126 |
| 202610F2 | 2026-10-12 | 123 | 0.9984020687 | 48425.741417 | 0.99965685 | 46.808682 |
| 202610W2 | 2026-10-14 | 121 | 0.9991574357 | 48488.132593 | 0.99999714 | 3.93894 |
| 202610F3 | 2026-10-16 | 103 | 0.9994198125 | 48541.475811 | 0.99999919 | 2.255576 |
| 202610 | 2026-10-21 | 219 | 0.9991841375 | 48675.876109 | 0.99997487 | 31.666081 |
| 202611 | 2026-11-18 | 176 | 0.9980085630 | 48841.429696 | 0.99999955 | 3.456469 |
| 202612 | 2026-12-16 | 247 | 0.9989174308 | 48985.274861 | 0.99999667 | 15.659998 |
| 202703 | 2027-03-17 | 133 | 0.9959522959 | 49477.933621 | 0.99999397 | 18.783090 |
| 202706 | 2027-06-16 | 109 | 0.9903359976 | 49990.928649 | 0.99999622 | 12.116931 |

## Falsification: high R2 does not validate the discount factor

The joint F/D regression fits are visually/statistically strong, but the implied discount-factor term structure is not economically coherent enough to become the primary pricing input.

Examples:
- same-day 202610F1 produces D=0.9984039846 rather than a value effectively near one for a same-day residual horizon;
- 202610W1, only five calendar days after the source date, produces D=0.9929954412;
- a simple calendar-day continuous-rate diagnostic for 202610W1 is roughly 51% annualized, while several monthly maturities imply rates around 1–2%;
- 202610F2 similarly implies a much larger short-tenor diagnostic than adjacent expiries.

Exact annualization is not the core claim because the proper settlement clock must be frozen separately. The robust conclusion is that the inferred D values are not monotone/coherent across nearby expiries and therefore cannot be accepted merely because R2 is high.

Likely mechanisms include non-synchronized "last best bid/ask" observations across strikes and Call/Put sides, stale quotes, liquidity differences and daily-file end-state semantics.

Decision:
**JOINT_PARITY_F_AND_D_PRIMARY = REJECTED_FOR_THIS_PARENT.**

## Same-date TX futures cross-check

Official TX futures daily parent:
- source: https://www.taifex.com.tw/cht/3/futDataDown
- raw bytes: 2,128
- SHA-256: d41cc8c279d805a0ebb13c29f3ff757cdc78a35d7a2e13fc06be4b3f3aeb1834

Regular-session monthly futures final best-bid/ask midpoint versus parity-derived F:

| Expiry | TX midpoint | Parity-derived F | Difference | Difference bps |
|---|---:|---:|---:|---:|
| 202610 | 48667.5 | 48675.876109 | +8.376109 | +1.72 |
| 202611 | 48845.0 | 48841.429696 | -3.570304 | -0.73 |
| 202612 | 48987.0 | 48985.274861 | -1.725139 | -0.35 |
| 202703 | 49468.0 | 49477.933621 | +9.933621 | +2.01 |
| 202706 | 49977.0 | 49990.928649 | +13.928649 | +2.79 |

Thus the parity-derived forward level is broadly consistent with same-date TX futures on monthly expiries even though the jointly estimated discount factor is unstable. This separates two conclusions:
1. parity contains useful forward-level information;
2. joint estimation of both forward and discount from asynchronous daily last-best quotes is too fragile for primary surface pricing.

## Research consequence for H11

For monthly expiries, use same-expiry TX futures as the primary forward candidate in the next source-only surface replay, with exact quote/session identity recorded.

For weekly/flexible weekly expiries lacking a direct same-expiry futures parent, do not silently reuse the rejected joint F/D estimate. A separately frozen rate/discount convention plus parity-derived forward, or another explicitly validated forward convention, is required.

D12-07 simple skew/term and D12-16 surface must still be computed from identical eligible option rows/common support before H11 can receive a terminal decision.

No outcome data were inspected. D12 remains 40.0%; Formal Core LOCKED; FORMAL_OPTIMIZATION_CANDIDATE=NONE.

## Exact next

1. Freeze a source-only monthly-expiry replay convention using same-expiry TX futures as forward, plus an explicit official risk-free/discount source and exact expiry clock.
2. Run IV solver and quote-quality guards on the identical 2026-10-02 monthly option rows.
3. Compute simple D12-07 skew/term baselines before D12-16 surface level/slope/curvature.
4. Compare incremental/residual structure and method sensitivity before any outcomes.
