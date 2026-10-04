# D06-19 IC-064 — Retail proxy purity/coverage vintage-drift firewall

Research cycle: 2026-10-05 Asia/Taipei
Status: OUTCOME_BLIND_PROXY_VINTAGE_DRIFT_CONFIRMED / L2_REMAINS / FORMAL_CORE_LOCKED

## Question
Can a retail-proxy channel be assigned a fixed identity-purity or market-coverage constant across time?

## Official evidence
TWSE evidence shows that odd-lot channel composition and coverage are not time-invariant:
- 2020-10-26 through 2024-10-30: domestic individuals were 82.5% of intraday odd-lot trading value; total odd-lot trading was about 0.91% of centralized-market trading value.
- Calendar 2024: a separate TWSE publication reports domestic individuals at 78.6% of intraday odd-lot trading value.
- Calendar 2025: odd-lot average daily turnover reached NT$8.671bn and about 2.08% of centralized-market turnover.

The study windows are not identical, so these figures are not same-generation observations and must not be differenced as if they were. They are sufficient, however, to falsify the assumption that purity and coverage can be hard-coded as timeless constants.

## Research decision
Retail proxy quality becomes a vintage-dependent object:
- identityPurity must carry measurement window/source vintage;
- marketCoverage must carry measurement window/source vintage;
- missing same-generation purity/coverage remains UNKNOWN;
- no 82.5%, 78.6%, 0.91% or 2.08% constant may be backfilled across dates;
- proxy validation should prefer overlapping/common-frequency windows before correlation or disagreement tests;
- channel growth itself can create regime drift even when investor identity remains retail-heavy.

This extends IC-062. HIGH_PURITY != HIGH_COVERAGE, and now:
FIXED_PURITY != VALID_CROSS_TIME_PURITY;
FIXED_COVERAGE != VALID_CROSS_TIME_COVERAGE.

## Bias/falsification controls
- No return/outcome data were joined.
- No stock-level retail direction is inferred.
- No annual/cumulative windows are treated as same-generation.
- No TPEx parity is assumed.
- No maturity promotion follows from mechanism refinement alone.

## System relevance
Potential value is de-duplication and calibration hygiene: System 1/System 2 research must not treat margin/odd-lot proxies as fixed-strength retail votes across regimes. Any future proxy weight must be Shadow/OOS validated with vintage-aware inputs.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core remains LOCKED.

## Exact next
1. Build outcome-blind common-frequency proxy diagnostics only where direct aggregate retail participation and proxy measurements overlap in the same measurement generation.
2. On the next valid trading session execute the frozen D06 prospective capture set.
3. Keep D06-19 L2/40% until authorized/replayable stock-date investor-type PIT data or equivalent promotion evidence exists.
